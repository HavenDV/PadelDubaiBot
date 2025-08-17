"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../../hooks/useUser";
import { Booking } from "../../../../database.types";
import { CalendarIcon } from "@components/icons/Icons";
import AddBookingModal from "./AddBookingModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useBookingsData,
  useDeleteBooking,
  useAddRegistration,
  useRemoveRegistration,
  useRemoveRegistrationById,
} from "@lib/hooks/db";

export default function Bookings() {
  const { styles } = useTelegram();
  const { isAdmin, user } = useUser();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Fetch all data using React Query
  const { data, isLoading: loading, error: queryError } = useBookingsData();

  const bookings = data?.bookings ?? [];
  const locations = data?.locations ?? [];
  const registrations = data?.registrations ?? [];
  const telegramMessages = data?.telegramMessageLookup ?? {};

  // Set up query error handling
  useEffect(() => {
    if (queryError) {
      setError("Failed to load data");
      console.error(queryError);
    } else {
      setError("");
    }
  }, [queryError]);

  const startEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const startAdd = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings-data"] });
  };

  // Use centralized delete mutation
  const deleteBookingMutation = useDeleteBooking();

  const handleDelete = (id: number) => {
    if (!confirm("Delete this booking?")) return;
    setError("");
    deleteBookingMutation.mutate(id, {
      onError: (error) => {
        setError("Failed to delete booking");
        console.error(error);
      },
    });
  };

  // Refresh messages mutation
  const refreshMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/telegram/cleanup-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh message status");
      }

      return response.json();
    },
    onSuccess: (result) => {
      console.log("Message cleanup result:", result);
      // Refresh the data to update button states
      queryClient.invalidateQueries({ queryKey: ["bookings-data"] });
    },
    onError: (error) => {
      setError(
        `Failed to refresh messages: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error(error);
    },
  });

  const handleRefreshMessages = () => {
    setError("");
    refreshMessagesMutation.mutate();
  };

  const handlePostToTelegram = async (booking: Booking) => {
    if (telegramMessages[booking.id]) {
      alert("This booking has already been posted to Telegram");
      return;
    }

    if (!confirm("Post this booking to Telegram chat for registrations?"))
      return;

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
      queryClient.invalidateQueries({ queryKey: ["bookings-data"] }); // Refresh to show updated message_id
    } catch (e) {
      setError(
        `Failed to post to Telegram: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
      console.error(e);
    }
  };

  // Use centralized registration mutations
  const addRegistrationMutation = useAddRegistration();

  const handleRegister = (bookingId: number) => {
    if (!user) {
      alert("Please login to register for games");
      return;
    }

    setError("");
    addRegistrationMutation.mutate(
      {
        bookingId,
        userId: parseInt(user.id),
      },
      {
        onError: (error) => {
          setError("Failed to register for game");
          console.error(error);
        },
      }
    );
  };

  const removeRegistrationMutation = useRemoveRegistration();

  const handleUnregister = (bookingId: number) => {
    if (!user) return;

    if (!confirm("Cancel your registration?")) return;

    setError("");
    removeRegistrationMutation.mutate(
      {
        bookingId,
        userId: parseInt(user.id),
      },
      {
        onError: (error) => {
          setError("Failed to cancel registration");
          console.error(error);
        },
      }
    );
  };

  const removeRegistrationByIdMutation = useRemoveRegistrationById();

  const handleAdminRemoveRegistration = (registrationId: number) => {
    if (!confirm("Remove this player's registration?")) return;

    setError("");
    removeRegistrationByIdMutation.mutate(registrationId, {
      onError: (error) => {
        setError("Failed to remove registration");
        console.error(error);
      },
    });
  };

  const getBookingRegistrations = (bookingId: number) => {
    return registrations.filter((r) => r.booking_id === bookingId);
  };

  const isUserRegistered = (bookingId: number) => {
    if (!user) return false;
    return registrations.some(
      (r) => r.booking_id === bookingId && r.user_id === parseInt(user.id)
    );
  };

  const getMaxPlayers = (courts: number) => courts * 4;

  const getMainPlayers = (
    bookingRegs: typeof registrations,
    maxPlayers: number
  ) => {
    return bookingRegs.slice(0, maxPlayers);
  };

  const getWaitlistPlayers = (
    bookingRegs: typeof registrations,
    maxPlayers: number
  ) => {
    return bookingRegs.slice(maxPlayers);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} style={styles.text} />
          <h2 className="text-xl font-bold" style={styles.text}>
            Bookings
          </h2>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshMessages}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex items-center justify-center shadow-sm ${
                refreshMessagesMutation.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white`}
              title={
                refreshMessagesMutation.isPending
                  ? "Refreshing..."
                  : "Refresh message status"
              }
              disabled={refreshMessagesMutation.isPending}
            >
              {refreshMessagesMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
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
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              )}
            </button>
            <button
              onClick={startAdd}
              className="w-8 h-8 text-white rounded-full text-lg font-medium transition-colors flex items-center justify-center shadow-sm hover:brightness-110"
              style={styles.primaryButton}
              title="Add Booking"
            >
              +
            </button>
          </div>
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
            const userOnWaitlist =
              userRegistered &&
              waitlistPlayers.some(
                (r) => user && r.user_id === parseInt(user.id)
              );

            return (
              <div
                key={b.id}
                className="relative mb-4 border rounded-xl p-4 shadow-sm"
                style={{ ...styles.card, ...styles.border }}
              >
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                    {/* Post to Telegram */}
                    <button
                      onClick={() => handlePostToTelegram(b)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                        telegramMessages[b.id]
                          ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                          : "text-white hover:brightness-110"
                      }`}
                      style={
                        !telegramMessages[b.id] ? styles.primaryButton : {}
                      }
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

                    {/* Check message status (only show if message was posted) */}
                    {telegramMessages[b.id] && (
                      <button
                        onClick={handleRefreshMessages}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                          refreshMessagesMutation.isPending
                            ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                            : "hover:brightness-110"
                        }`}
                        style={
                          !refreshMessagesMutation.isPending
                            ? { ...styles.secondaryButton, ...styles.border }
                            : {}
                        }
                        title={
                          refreshMessagesMutation.isPending
                            ? "Checking..."
                            : "Check if message still exists"
                        }
                        disabled={refreshMessagesMutation.isPending}
                      >
                        {refreshMessagesMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
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
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => startEdit(b)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
                      style={styles.primaryButton}
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
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
                      style={{
                        backgroundColor: "transparent",
                        color: styles.destructiveText.color,
                        borderWidth: "1px",
                        borderColor: styles.destructiveText.color,
                      }}
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
                <div className="flex-1 pr-0">
                  {/* Location */}
                  <div className="flex items-center gap-3 mb-4">
                    {location?.url ? (
                      <a
                        href={location.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group hover:brightness-90"
                        style={styles.secondaryButton}
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
                          className="w-5 h-5 group-hover:brightness-110"
                          style={styles.text}
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </a>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={styles.secondaryButton}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                          style={styles.text}
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-lg" style={styles.text}>
                        {(() => {
                          const displayName = location?.name || `Location #${b.location_id}`;
                          return displayName.length > 22
                            ? displayName.slice(0, 19) + "..."
                            : displayName;
                        })()}
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={styles.secondaryText}
                      >
                        Courts {b.courts}
                      </div>
                    </div>
                  </div>

                  {/* Time & Duration Info */}
                  <div
                    className="border rounded-lg p-3 mb-2 space-y-2"
                    style={{ ...styles.header, ...styles.border }}
                  >
                    {/* Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                          style={styles.secondaryText}
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
                        <span className="font-bold text-lg" style={styles.text}>
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                          style={styles.secondaryText}
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                        <span
                          className="font-semibold text-base"
                          style={styles.text}
                        >
                          {startTime} - {endTime}
                        </span>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-bold"
                        style={{
                          ...styles.text,
                          backgroundColor:
                            styles.selectedBg.backgroundColor ||
                            "rgba(255,255,255,0.1)",
                        }}
                      >
                        {duration}min
                      </span>
                    </div>
                  </div>

                  {/* Note */}
                  {b.note && (
                    <div
                      className="flex items-start gap-2 text-sm p-2 rounded-md border mb-2"
                      style={{ ...styles.card, ...styles.border }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={styles.secondaryText}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      <span style={styles.secondaryText}>{b.note}</span>
                    </div>
                  )}

                  {/* Registrations */}
                  <div
                    className="border rounded-lg p-3 space-y-3"
                    style={{ ...styles.header, ...styles.border }}
                  >
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
                          className="w-5 h-5"
                          style={styles.secondaryText}
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span className="font-bold text-sm" style={styles.text}>
                          Players ({bookingRegs.length}/{maxPlayers})
                        </span>
                      </div>

                      {/* User Registration Control */}
                      {!isAdmin && (
                        <div className="sm:mt-0 mt-1">
                          {userRegistered ? (
                            <button
                              onClick={() => handleUnregister(b.id)}
                              className="px-3 py-1.5 border rounded-md text-sm font-medium transition-colors hover:brightness-90"
                              style={{
                                ...styles.secondaryButton,
                                borderColor: "#ef4444",
                              }}
                            >
                              {userOnWaitlist ? "Leave Waitlist" : "Cancel"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegister(b.id)}
                              className="px-3 py-1.5 text-white border rounded-md text-sm font-medium transition-colors hover:brightness-110"
                              style={styles.primaryButton}
                            >
                              {isFull ? "Join Waitlist" : "Register"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Main Players */}
                    {mainPlayers.length > 0 && (
                      <div className="space-y-1">
                        <div
                          className="text-xs font-bold uppercase tracking-wide"
                          style={styles.secondaryText}
                        >
                          Main Players
                        </div>
                        {mainPlayers.map((reg, index) => (
                          <div
                            key={reg.id}
                            className="flex items-center justify-between p-2 rounded-md border"
                            style={styles.selectedBg}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-semibold"
                                style={styles.primaryButton}
                              >
                                {index + 1}
                              </span>
                              <span
                                className="text-sm font-medium"
                                style={styles.text}
                              >
                                {reg.user?.username ||
                                  reg.user?.first_name ||
                                  `User ${reg.user_id}`}
                              </span>
                              {userRegistered &&
                                user &&
                                reg.user_id === parseInt(user.id) &&
                                !userOnWaitlist && (
                                  <span
                                    className="text-xs text-white px-2 py-1 rounded-full"
                                    style={styles.primaryButton}
                                  >
                                    You
                                  </span>
                                )}
                            </div>

                            {/* Admin Remove Control */}
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  handleAdminRemoveRegistration(reg.id)
                                }
                                className="w-6 h-6 transition-colors hover:brightness-110"
                                style={styles.destructiveText}
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
                      <div className="space-y-1">
                        <div
                          className="text-xs font-bold uppercase tracking-wide flex items-center gap-2"
                          style={styles.secondaryText}
                        >
                          <span>Waitlist</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{
                              backgroundColor:
                                styles.selectedBg.backgroundColor ||
                                "rgba(255,193,7,0.2)",
                              color: styles.text.color,
                            }}
                          >
                            {waitlistPlayers.length} waiting
                          </span>
                        </div>
                        {waitlistPlayers.map((reg, index) => (
                          <div
                            key={reg.id}
                            className="flex items-center justify-between p-2 rounded-md border"
                            style={{
                              backgroundColor:
                                styles.selectedBg.backgroundColor ||
                                "rgba(255,193,7,0.1)",
                              borderColor:
                                styles.selectedBg.borderColor || "#fbbf24",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  backgroundColor:
                                    styles.selectedBg.backgroundColor ||
                                    "rgba(255,193,7,0.3)",
                                  color: styles.text.color,
                                }}
                              >
                                W{index + 1}
                              </span>
                              <span
                                className="text-sm font-medium"
                                style={styles.text}
                              >
                                {reg.user?.username ||
                                  reg.user?.first_name ||
                                  `User ${reg.user_id}`}
                              </span>
                              {userOnWaitlist &&
                                user &&
                                reg.user_id === parseInt(user.id) && (
                                  <span
                                    className="text-xs text-white px-2 py-1 rounded-full"
                                    style={styles.primaryButton}
                                  >
                                    You
                                  </span>
                                )}
                            </div>

                            {/* Admin Remove Control */}
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  handleAdminRemoveRegistration(reg.id)
                                }
                                className="w-6 h-6 transition-colors hover:brightness-110"
                                style={styles.destructiveText}
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
                      <div
                        className="text-sm text-center py-4"
                        style={styles.secondaryText}
                      >
                        No players registered yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && bookings.length === 0 && (
            <div className="py-6 text-sm" style={styles.secondaryText}>
              No bookings yet
            </div>
          )}
        </div>
      )}

      {/* Booking Modal (Add/Edit) */}
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        locations={locations}
        onLocationUpdate={handleModalSuccess}
        editingBooking={editingBooking}
      />
    </div>
  );
}
