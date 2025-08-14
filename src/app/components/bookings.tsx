"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { supabase } from "@lib/supabase/client";
import { Booking, BookingInsert, Location } from "../../../database.types";
import Image from "next/image";

function toLocalInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function Bookings() {
  const { theme } = useTelegram();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<BookingInsert>({
    title: "",
    start_time: "",
    end_time: "",
    location_id: 0,
    price: "",
    courts: 1,
    max_players: 0,
    note: "",
    chat_id: 0,
    message_id: 0,
    cancelled: false,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [bRes, lRes] = await Promise.all([
        supabase.from("bookings").select("*").order("id", { ascending: false }),
        supabase.from("locations").select("*").order("id"),
      ]);
      if (bRes.error) throw bRes.error;
      if (lRes.error) throw lRes.error;
      setBookings(bRes.data ?? []);
      setLocations(lRes.data ?? []);
    } catch (e) {
      setError("Failed to load data");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetForm = () =>
    setForm({
      title: "",
      start_time: "",
      end_time: "",
      location_id: 0,
      price: "",
      courts: 1,
      max_players: 0,
      note: "",
      chat_id: 0,
      message_id: 0,
      cancelled: false,
    });

  const handleCreate = async () => {
    if (
      !form.title ||
      !form.start_time ||
      !form.end_time ||
      !form.location_id ||
      !form.price
    )
      return;
    setLoading(true);
    setError("");
    try {
      const payload: BookingInsert = {
        ...form,
        start_time: new Date(form.start_time as string).toISOString(),
        end_time: new Date(form.end_time as string).toISOString(),
      };
      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;
      resetForm();
      await loadAll();
    } catch (e) {
      setError("Failed to create booking");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (b: Booking) => {
    setEditingId(b.id);
    setEditForm({
      ...b,
      start_time: toLocalInputValue(b.start_time),
      end_time: toLocalInputValue(b.end_time),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...editForm,
        start_time: editForm.start_time
          ? new Date(editForm.start_time as string).toISOString()
          : undefined,
        end_time: editForm.end_time
          ? new Date(editForm.end_time as string).toISOString()
          : undefined,
      } as Partial<Booking>;
      const { error } = await supabase
        .from("bookings")
        .update(payload)
        .eq("id", editingId);
      if (error) throw error;
      cancelEdit();
      await loadAll();
    } catch (e) {
      setError("Failed to update booking");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this booking?")) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
      await loadAll();
    } catch (e) {
      setError("Failed to delete booking");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Image src="/calendar.svg" alt="Bookings" width={20} height={20} />
        <h2 className={`text-xl font-bold ${theme.text}`}>Bookings</h2>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Create form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title as string}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <select
          value={form.location_id ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, location_id: Number(e.target.value) }))
          }
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        >
          <option value="" disabled>
            Select location
          </option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={form.start_time as string}
          onChange={(e) =>
            setForm((f) => ({ ...f, start_time: e.target.value }))
          }
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="datetime-local"
          value={form.end_time as string}
          onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="text"
          placeholder="Price"
          value={form.price as string}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="number"
          min={1}
          placeholder="Courts"
          value={form.courts as number}
          onChange={(e) =>
            setForm((f) => ({ ...f, courts: Number(e.target.value) }))
          }
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="number"
          min={0}
          placeholder="Max players"
          value={form.max_players as number}
          onChange={(e) =>
            setForm((f) => ({ ...f, max_players: Number(e.target.value) }))
          }
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={(form.note as string) || ""}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="number"
          placeholder="Chat ID"
          value={form.chat_id as number}
          onChange={(e) =>
            setForm((f) => ({ ...f, chat_id: Number(e.target.value) }))
          }
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <input
          type="number"
          placeholder="Message ID"
          value={form.message_id as number}
          onChange={(e) =>
            setForm((f) => ({ ...f, message_id: Number(e.target.value) }))
          }
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            theme.cardBg || "border-gray-300 bg-white"
          } ${theme.text || "text-black"}`}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.cancelled)}
            onChange={(e) =>
              setForm((f) => ({ ...f, cancelled: e.target.checked }))
            }
          />
          Cancelled
        </label>
        <div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loading
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Add booking
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200/40">
        {bookings.map((b) => (
          <div key={b.id} className="py-3 space-y-2">
            {editingId === b.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={(editForm.title as string) || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <select
                  value={editForm.location_id ?? b.location_id}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      location_id: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={
                    (editForm.start_time as string) ||
                    toLocalInputValue(b.start_time)
                  }
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, start_time: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="datetime-local"
                  value={
                    (editForm.end_time as string) ||
                    toLocalInputValue(b.end_time)
                  }
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, end_time: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="text"
                  value={(editForm.price as string) || b.price}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="number"
                  min={1}
                  value={(editForm.courts as number) ?? b.courts}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      courts: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="number"
                  min={0}
                  value={(editForm.max_players as number) ?? b.max_players}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      max_players: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="text"
                  value={(editForm.note as string) ?? (b.note || "")}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, note: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="number"
                  value={(editForm.chat_id as number) ?? b.chat_id}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      chat_id: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <input
                  type="number"
                  value={(editForm.message_id as number) ?? b.message_id}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      message_id: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    theme.cardBg || "border-gray-300 bg-white"
                  } ${theme.text || "text-black"}`}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(
                      (editForm.cancelled as boolean) ?? b.cancelled
                    )}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        cancelled: e.target.checked,
                      }))
                    }
                  />
                  Cancelled
                </label>
              </div>
            ) : (
              <div className="flex-1">
                <div className={`font-medium ${theme.text}`}>{b.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(b.start_time).toLocaleString()} →{" "}
                  {new Date(b.end_time).toLocaleString()} · L#{b.location_id} ·
                  Courts {b.courts} · Max {b.max_players}
                </div>
                {b.note && (
                  <div className="text-xs text-gray-500">{b.note}</div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              {editingId === b.id ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-2 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(b)}
                    className="px-3 py-2 rounded-md text-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-2 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {!loading && bookings.length === 0 && (
          <div className="py-6 text-sm text-gray-500">No bookings yet</div>
        )}
      </div>
    </div>
  );
}
