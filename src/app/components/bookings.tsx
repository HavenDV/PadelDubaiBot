"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../hooks/useUser";
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

function toDateString(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeString(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function combineLocalDateTimeToISO(dateStr: string, timeStr: string) {
  // Expecting dateStr = YYYY-MM-DD and timeStr = HH:MM
  if (!dateStr || !timeStr) return "";
  const local = new Date(`${dateStr}T${timeStr}`);
  return local.toISOString();
}

export default function Bookings() {
  const { theme } = useTelegram();
  const { isAdmin } = useUser();
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

  // Create form date/time pieces for clarity
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  // Edit form date/time pieces
  const [editStartDate, setEditStartDate] = useState<string>("");
  const [editStartTime, setEditStartTime] = useState<string>("");
  const [editEndDate, setEditEndDate] = useState<string>("");
  const [editEndTime, setEditEndTime] = useState<string>("");

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

  const resetDateTimePieces = () => {
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
  };

  const handleCreate = async () => {
    const startISO = combineLocalDateTimeToISO(startDate, startTime);
    const endISO = combineLocalDateTimeToISO(endDate, endTime);
    if (!form.title || !startISO || !endISO || !form.location_id || !form.price)
      return;
    setLoading(true);
    setError("");
    try {
      const payload: BookingInsert = {
        ...form,
        start_time: startISO,
        end_time: endISO,
      };
      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;
      resetForm();
      resetDateTimePieces();
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
    setEditStartDate(toDateString(b.start_time));
    setEditStartTime(toTimeString(b.start_time));
    setEditEndDate(toDateString(b.end_time));
    setEditEndTime(toTimeString(b.end_time));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditStartDate("");
    setEditStartTime("");
    setEditEndDate("");
    setEditEndTime("");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...editForm,
        start_time:
          editStartDate && editStartTime
            ? combineLocalDateTimeToISO(editStartDate, editStartTime)
            : undefined,
        end_time:
          editEndDate && editEndTime
            ? combineLocalDateTimeToISO(editEndDate, editEndTime)
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
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Title
            </label>
            <input
              type="text"
              placeholder="E.g. Evening game at Oxygen"
              value={form.title as string}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Short name shown to players.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Location
            </label>
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
            <p className="text-xs text-gray-400 mt-1">
              Club where the game happens.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              The date players should arrive.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Start time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Local time the game starts.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              End date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">When the booking ends.</p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              End time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Local time the game ends.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Price
            </label>
            <input
              type="text"
              placeholder="e.g. 110 AED"
              value={form.price as string}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Shown to players in the post.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Courts
            </label>
            <input
              type="number"
              min={1}
              placeholder="1"
              value={form.courts as number}
              onChange={(e) =>
                setForm((f) => ({ ...f, courts: Number(e.target.value) }))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Number of courts reserved.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Max players
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={form.max_players as number}
              onChange={(e) =>
                setForm((f) => ({ ...f, max_players: Number(e.target.value) }))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">Total players allowed.</p>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Note
            </label>
            <input
              type="text"
              placeholder="Optional details for players"
              value={(form.note as string) || ""}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Extra info (parking, coach, etc.).
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Chat ID
            </label>
            <input
              type="number"
              placeholder="Telegram chat id"
              value={form.chat_id as number}
              onChange={(e) =>
                setForm((f) => ({ ...f, chat_id: Number(e.target.value) }))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Used to update the original post.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Message ID
            </label>
            <input
              type="number"
              placeholder="Telegram message id"
              value={form.message_id as number}
              onChange={(e) =>
                setForm((f) => ({ ...f, message_id: Number(e.target.value) }))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Pairs with chat id for updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="cancelled"
              type="checkbox"
              checked={Boolean(form.cancelled)}
              onChange={(e) =>
                setForm((f) => ({ ...f, cancelled: e.target.checked }))
              }
            />
            <label htmlFor="cancelled" className={`text-sm ${theme.text}`}>
              Cancelled
            </label>
          </div>

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
      )}

      {/* List */}
      {loading && bookings.length === 0 ? (
        <div className="divide-y divide-gray-200/40">
          {[0, 1, 2].map((i) => (
            <div key={i} className="py-3 space-y-2 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-56" />
              <div className="h-4 bg-gray-200 rounded w-72" />
            </div>
          ))}
        </div>
      ) : (
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
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${theme.text}`}
                    >
                      Start date
                    </label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        theme.cardBg || "border-gray-300 bg-white"
                      } ${theme.text || "text-black"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${theme.text}`}
                    >
                      Start time
                    </label>
                    <input
                      type="time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        theme.cardBg || "border-gray-300 bg-white"
                      } ${theme.text || "text-black"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${theme.text}`}
                    >
                      End date
                    </label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        theme.cardBg || "border-gray-300 bg-white"
                      } ${theme.text || "text-black"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${theme.text}`}
                    >
                      End time
                    </label>
                    <input
                      type="time"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        theme.cardBg || "border-gray-300 bg-white"
                      } ${theme.text || "text-black"}`}
                    />
                  </div>
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
                    {new Date(b.end_time).toLocaleString()} · L#{b.location_id}{" "}
                    · Courts {b.courts} · Max {b.max_players}
                  </div>
                  {b.note && (
                    <div className="text-xs text-gray-500">{b.note}</div>
                  )}
                </div>
              )}
              {isAdmin && (
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
              )}
            </div>
          ))}
          {!loading && bookings.length === 0 && (
            <div className="py-6 text-sm text-gray-500">No bookings yet</div>
          )}
        </div>
      )}
    </div>
  );
}
