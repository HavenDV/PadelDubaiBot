"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../../hooks/useUser";
import { supabase } from "@lib/supabase/client";
import { Booking, Location, Registration, User as DBUser } from "../../../../database.types";
import Image from "next/image";
import AddBookingModal from "./AddBookingModal";

export default function Bookings() {
  const { theme } = useTelegram();
  const { isAdmin, user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [registrations, setRegistrations] = useState<(Registration & { 
    user: Pick<DBUser, 'id' | 'first_name' | 'last_name' | 'username' | 'photo_url' | 'explicit_name'> 
  })[]>([]);
  const [telegramMessages, setTelegramMessages] = useState<{
    [key: number]: boolean;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [bRes, lRes, tRes, rRes] = await Promise.all([
        supabase.from("bookings").select("*").order("id", { ascending: false }),
        supabase.from("locations").select("*").order("id"),
        supabase.from("messages").select("booking_id").eq("is_active", true),
        supabase.from("registrations").select(`
          *,
          user:users(id, first_name, last_name, username, photo_url, explicit_name)
        `).order("created_at", { ascending: true }),
      ]);
      if (bRes.error) throw bRes.error;
      if (lRes.error) throw lRes.error;
      if (tRes.error) throw tRes.error;
      if (rRes.error) throw rRes.error;

      setBookings(bRes.data ?? []);
      setLocations(lRes.data ?? []);
      setRegistrations(rRes.data ?? []);

      // Create a lookup for bookings that have been posted to Telegram
      const telegramMessageLookup: { [key: number]: boolean } = {};
      (tRes.data ?? []).forEach((msg) => {
        telegramMessageLookup[msg.booking_id] = true;
      });
      setTelegramMessages(telegramMessageLookup);
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

  const handlePostToTelegram = async (booking: Booking) => {
    if (telegramMessages[booking.id]) {
      alert("This booking has already been posted to Telegram");
      return;
    }

    if (!confirm("Post this booking to Telegram chat for registrations?"))
      return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/telegram/post-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post to Telegram");
      }

      const result = await response.json();
      console.log("Posted to Telegram:", result);
      await loadAll(); // Refresh to show updated message_id
      alert("Successfully posted to Telegram!");
    } catch (e) {
      setError(
        `Failed to post to Telegram: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (bookingId: number) => {
    if (!user) {
      alert("Please login to register for games");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("registrations")
        .insert({
          booking_id: bookingId,
          user_id: parseInt(user.id)
        });
      
      if (error) throw error;
      await loadAll();
      alert("Successfully registered!");
    } catch (e) {
      setError("Failed to register for game");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (bookingId: number) => {
    if (!user) return;

    if (!confirm("Cancel your registration?")) return;

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("booking_id", bookingId)
        .eq("user_id", parseInt(user.id));
      
      if (error) throw error;
      await loadAll();
      alert("Registration cancelled");
    } catch (e) {
      setError("Failed to cancel registration");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRemoveRegistration = async (registrationId: number) => {
    if (!confirm("Remove this player's registration?")) return;

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", registrationId);
      
      if (error) throw error;
      await loadAll();
    } catch (e) {
      setError("Failed to remove registration");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getBookingRegistrations = (bookingId: number) => {
    return registrations.filter(r => r.booking_id === bookingId);
  };

  const isUserRegistered = (bookingId: number) => {
    if (!user) return false;
    return registrations.some(r => r.booking_id === bookingId && r.user_id === parseInt(user.id));
  };

  const getMaxPlayers = (courts: number) => courts * 4;

  const getMainPlayers = (bookingRegs: typeof registrations, maxPlayers: number) => {
    return bookingRegs.slice(0, maxPlayers);
  };

  const getWaitlistPlayers = (bookingRegs: typeof registrations, maxPlayers: number) => {
    return bookingRegs.slice(maxPlayers);
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
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-medium transition-colors flex items-center justify-center shadow-sm"
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
          {bookings.map((b) => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            const dateStr = start.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const startTime = start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
            const endTime = end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
            const duration = Math.round(
              (end.getTime() - start.getTime()) / (1000 * 60)
            );
            const location = locations.find((l) => l.id === b.location_id);
            const bookingRegs = getBookingRegistrations(b.id);
            const userRegistered = isUserRegistered(b.id);
            const maxPlayers = getMaxPlayers(b.courts);
            const mainPlayers = getMainPlayers(bookingRegs, maxPlayers);
            const waitlistPlayers = getWaitlistPlayers(bookingRegs, maxPlayers);
            const isFull = bookingRegs.length >= maxPlayers;
            const userOnWaitlist = userRegistered && waitlistPlayers.some(r => user && r.user_id === parseInt(user.id));

            return (
              <div key={b.id} className="relative py-4">
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-3 right-0 flex items-center gap-1 z-10">
                    {/* Post to Telegram */}
                    <button
                      onClick={() => handlePostToTelegram(b)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                        telegramMessages[b.id]
                          ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
                      }`}
                      title={
                        telegramMessages[b.id]
                          ? "Already posted to Telegram"
                          : "Post to Telegram"
                      }
                      aria-label={
                        telegramMessages[b.id]
                          ? "Already posted to Telegram"
                          : "Post to Telegram"
                      }
                      disabled={!!telegramMessages[b.id]}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => startEdit(b)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-colors"
                      title="Edit"
                      aria-label="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors"
                      title="Remove"
                      aria-label="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Main Content */}
                <div className="flex-1">
                  {/* Location */}
                  <div className="flex items-start gap-3 mb-2">
                    {location?.url ? (
                      <a
                        href={location.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group"
                        title="Open in Google Maps"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-blue-600 group-hover:text-blue-700"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </a>
                    ) : (
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-blue-600"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className={`font-semibold ${theme.text} text-base`}>
                        {location?.name || `Location #${b.location_id}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        Courts {b.courts}
                      </div>
                    </div>
                  </div>

                  {/* Time & Duration Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2 space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-gray-500"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="font-semibold text-gray-800 text-base">
                        {dateStr}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-gray-500"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                        <span className="font-semibold text-gray-800 text-base">
                          {startTime} - {endTime}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 bg-gray-200 px-3 py-1.5 rounded-md font-semibold">
                        {duration}min
                      </span>
                    </div>
                  </div>

                  {/* Note */}
                  {b.note && (
                    <div className="flex items-start gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      <span className="text-gray-600">{b.note}</span>
                    </div>
                  )}

                  {/* Registrations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-gray-600"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span className="font-semibold text-gray-800">
                          Players ({bookingRegs.length}/{maxPlayers})
                        </span>
                      </div>
                      
                      {/* User Registration Control */}
                      {!isAdmin && (
                        <div>
                          {userRegistered ? (
                            <button
                              onClick={() => handleUnregister(b.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                              {userOnWaitlist ? "Leave Waitlist" : "Cancel"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegister(b.id)}
                              className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                              {isFull ? "Join Waitlist" : "Register"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Main Players */}
                    {mainPlayers.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">Main Players</div>
                        {mainPlayers.map((reg, index) => (
                          <div key={reg.id} className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-200">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-800">
                                {reg.user?.username || reg.user?.first_name || `User ${reg.user_id}`}
                              </span>
                              {userRegistered && user && reg.user_id === parseInt(user.id) && !userOnWaitlist && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">You</span>
                              )}
                            </div>
                            
                            {/* Admin Remove Control */}
                            {isAdmin && (
                              <button
                                onClick={() => handleAdminRemoveRegistration(reg.id)}
                                className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors"
                                title="Remove player"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Waitlist */}
                    {waitlistPlayers.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <span>Waitlist</span>
                          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                            {waitlistPlayers.length} waiting
                          </span>
                        </div>
                        {waitlistPlayers.map((reg, index) => (
                          <div key={reg.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-md border border-yellow-200">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                W{index + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-800">
                                {reg.user?.username || reg.user?.first_name || `User ${reg.user_id}`}
                              </span>
                              {userOnWaitlist && user && reg.user_id === parseInt(user.id) && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">You</span>
                              )}
                            </div>
                            
                            {/* Admin Remove Control */}
                            {isAdmin && (
                              <button
                                onClick={() => handleAdminRemoveRegistration(reg.id)}
                                className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors"
                                title="Remove player"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty State */}
                    {bookingRegs.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No players registered yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
