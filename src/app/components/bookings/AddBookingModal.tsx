"use client";

import { useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { supabase } from "@lib/supabase/client";
import { BookingInsert, Location } from "../../../../database.types";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locations: Location[];
}

function combineLocalDateTimeToISO(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return "";
  const local = new Date(`${dateStr}T${timeStr}`);
  return local.toISOString();
}

export default function AddBookingModal({
  isOpen,
  onClose,
  onSuccess,
  locations,
}: AddBookingModalProps) {
  const { theme } = useTelegram();
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

  // Create form date/time pieces for clarity
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const resetForm = () => {
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
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setError("");
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
      onSuccess();
      onClose();
    } catch (e) {
      setError("Failed to create booking");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 ${
          theme.cardBg || "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme.text}`}>Add New Booking</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

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
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loading
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Creating..." : "Add booking"}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
