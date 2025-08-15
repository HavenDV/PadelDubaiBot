"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../../hooks/useUser";
import { supabase } from "@lib/supabase/client";
import { Booking, Location } from "../../../../database.types";
import Image from "next/image";
import AddBookingModal from "./AddBookingModal";

export default function Bookings() {
  const { theme } = useTelegram();
  const { isAdmin } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

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

  const startEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const startAdd = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/calendar.svg" alt="Bookings" width={20} height={20} />
          <h2 className={`text-xl font-bold ${theme.text}`}>Bookings</h2>
        </div>
        {isAdmin && (
          <button
            onClick={startAdd}
            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg font-medium transition-colors flex items-center justify-center"
            title="Add Booking"
          >
            +
          </button>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

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
              <div className="flex-1">
                <div className={`font-medium ${theme.text}`}>
                  {locations.find((l) => l.id === b.location_id)?.name || `Location #${b.location_id}`}
                </div>
                <div className="text-xs text-gray-500">
                  {(() => {
                    const start = new Date(b.start_time);
                    const end = new Date(b.end_time);
                    const sameDay = start.toDateString() === end.toDateString();
                    const dateStr = start.toLocaleDateString('en-US');
                    const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    return sameDay
                      ? `${dateStr}, ${startTime} - ${endTime}`
                      : `${dateStr}, ${startTime} - ${end.toLocaleDateString('en-US')}, ${endTime}`;
                  })()} · Courts {b.courts}
                </div>
                {b.note && (
                  <div className="text-xs text-gray-500">{b.note}</div>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
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
                </div>
              )}
            </div>
          ))}
          {!loading && bookings.length === 0 && (
            <div className="py-6 text-sm text-gray-500">No bookings yet</div>
          )}
        </div>
      )}

      {/* Booking Modal (Add/Edit) */}
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAll}
        locations={locations}
        onLocationUpdate={loadAll}
        editingBooking={editingBooking}
      />
    </div>
  );
}
