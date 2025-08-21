"use client";

import { useEffect, useState } from "react";
import { useTelegramTheme } from "@/app/hooks/telegram";
import { useAuth } from "@/app/contexts/AuthContext";
import { Booking } from "../../../../database.types";
import { CalendarIcon } from "@components/icons/Icons";
import AddBookingModal from "./AddBookingModal";
import AddPlayerModal from "./AddPlayerModal";
import ConfirmRemoveModal from "./ConfirmRemoveModal";
import ConfirmSelfCancelModal from "./ConfirmSelfCancelModal";
import ConfirmPinModal from "./ConfirmPinModal";
import PostToDialog from "./PostToDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useBookingsData,
  useDeleteBooking,
  useAddRegistration,
  useRemoveRegistration,
  useRemoveRegistrationById,
  useDeleteMessage,
  useSendBookingMessage,
  usePinMessage,
  useUnpinMessage,
} from "@lib/hooks/db";
import { PinIcon, PinOffIcon } from "@components/icons/Icons";
import { useUpdateBooking } from "@lib/hooks/db";

export default function Bookings() {
  const { styles } = useTelegramTheme();
  const { isAdmin, user, telegramUserId } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [postDialogBooking, setPostDialogBooking] = useState<Booking | null>(
    null
  );
  const [postDialogChatId, setPostDialogChatId] = useState<number | undefined>(
    undefined
  );
  const [addPlayerBookingId, setAddPlayerBookingId] = useState<number | null>(
    null
  );
  // Themed dialogs for pin/unpin message actions
  const [confirmPin, setConfirmPin] = useState<{
    messageId: number;
    chatId: number;
  } | null>(null);
  const [confirmUnpin, setConfirmUnpin] = useState<{
    messageId: number;
    chatId: number;
  } | null>(null);

  // Fetch all data using React Query
  const { data, isLoading: loading, error: queryError } = useBookingsData();

  const bookings = data?.bookings ?? [];
  const locations = data?.locations ?? [];
  const registrations = data?.registrations ?? [];
  const telegramMessages = data?.telegramMessageLookup ?? {};
  const chatLookup = data?.chatLookup ?? {};

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

  // Use centralized mutations
  const deleteBookingMutation = useDeleteBooking();
  const deleteMessageMutation = useDeleteMessage();
  const sendBookingMessageMutation = useSendBookingMessage();
  const pinMessageMutation = usePinMessage();
  const unpinMessageMutation = useUnpinMessage();
  const updateBookingMutation = useUpdateBooking();

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
      try {
        const response = await fetch("/api/telegram/update-messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // No body to trigger full-scan cleanup mode
        });

        if (!response.ok) {
          // Try to surface server error details
          const body = await response.json().catch(async () => ({
            error: await response.text().catch(() => ""),
          }));
          const msg =
            body?.error ||
            `Failed to refresh message status (${response.status})`;
          throw new Error(msg);
        }

        return response.json();
      } catch (e) {
        // Network/unknown error fallback
        const err = e as Error;
        throw new Error(err.message || "Failed to refresh message status");
      }
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

  const handleDeleteMessage = (
    messageId: number,
    telegramMessageId: number,
    chatId: number
  ) => {
    if (
      !confirm(
        `Delete message ${telegramMessageId} from both Telegram and database?`
      )
    )
      return;

    setError("");
    deleteMessageMutation.mutate(
      { telegramMessageId, chatId },
      {
        onError: (error) => {
          setError("Failed to delete message");
          console.error("Delete message error:", error);
        },
      }
    );
  };

  const handlePostToTelegram = (booking: Booking, chatId: number) => {
    setError("");

    // Get location and registrations for this booking
    const location = locations.find((l) => l.id === booking.location_id);
    if (!location) {
      setError("Location not found for this booking");
      return;
    }

    const bookingRegs = getBookingRegistrations(booking.id);
    const formattedRegs = bookingRegs.map((reg) => ({
      user: {
        id: reg.user?.id || reg.user_id,
        username: reg.user?.username || null,
        first_name: reg.user?.first_name || `User ${reg.user_id}`,
        skill_level: reg.user?.skill_level || null,
      },
    }));

    sendBookingMessageMutation.mutate(
      {
        booking,
        location,
        registrations: formattedRegs,
        chatId,
      },
      {
        onError: (error) => {
          setError(`Failed to post: ${error.message}`);
          console.error("Post error:", error);
        },
      }
    );
  };

  const handlePinMessage = (messageId: number, chatId: number) => {
    setError("");
    setConfirmPin({ messageId, chatId });
  };

  const handleUnpinMessage = (messageId: number, chatId: number) => {
    setError("");
    setConfirmUnpin({ messageId, chatId });
  };

  // Use centralized registration mutations
  const addRegistrationMutation = useAddRegistration();

  const handleRegister = (bookingId: number) => {
    if (!user || !telegramUserId) {
      alert("Please login to register for games");
      return;
    }

    setError("");
    addRegistrationMutation.mutate(
      {
        bookingId,
        userId: telegramUserId,
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
    if (!user || !telegramUserId) return;
    setError("");
    removeRegistrationMutation.mutate(
      {
        bookingId,
        userId: telegramUserId,
      },
      {
        onSuccess: () => {
          setConfirmSelfBookingId(null);
          removeRegistrationMutation.reset();
        },
        onError: (error) => {
          setError("Failed to cancel registration");
          console.error(error);
        },
      }
    );
  };

  const removeRegistrationByIdMutation = useRemoveRegistrationById();

  const handleAdminRemoveRegistration = (
    registrationId: number,
    bookingId: number
  ) => {
    setError("");
    removeRegistrationByIdMutation.mutate(
      { registrationId, bookingId },
      {
        onError: (error) => {
          setError("Failed to remove registration");
          console.error(error);
        },
      }
    );
  };

  // Themed confirm dialog state for admin remove
  const [confirmRemove, setConfirmRemove] = useState<{
    id: number;
    bookingId: number;
  } | null>(null);
  // Themed confirm dialog for self cancel
  const [confirmSelfBookingId, setConfirmSelfBookingId] = useState<
    number | null
  >(null);

  // Note: we explicitly close the cancel modal in the onSuccess handler
  // of the mutation to avoid accidental closes from stale success state.

  // Inline ConfirmSelfCancelModal removed (moved to ./ConfirmSelfCancelModal)

  const getBookingRegistrations = (bookingId: number) => {
    return registrations.filter((r) => r.booking_id === bookingId);
  };

  const isUserRegistered = (bookingId: number) => {
    if (!user || !telegramUserId) return false;
    return registrations.some(
      (r) => r.booking_id === bookingId && r.user_id === telegramUserId
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
                (r) => telegramUserId && r.user_id === telegramUserId
              );

            return (
              <div
                key={b.id}
                className="relative mb-4 border rounded-xl p-4 shadow-sm"
                style={{ ...styles.card, ...styles.border }}
              >
                {/* Main Content */}
                <div className="flex-1">
                  {/* Location */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 flex-shrink-0"
                        style={styles.secondaryText}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div className="flex-1">
                        <div className="font-bold text-lg" style={styles.text}>
                          {location?.name || `Location #${b.location_id}`}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-medium"
                            style={styles.secondaryText}
                          >
                            Courts {b.courts}
                          </span>
                          {isAdmin && (
                            <div className="flex items-center gap-1">
                              <button
                                className="w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors"
                                style={{
                                  ...(b.courts > 1
                                    ? styles.secondaryButton
                                    : { ...styles.secondaryButton, opacity: 0.5, cursor: "not-allowed" }),
                                  ...(styles.border || {}),
                                }}
                                title="Decrease courts"
                                aria-label="Decrease courts"
                                disabled={updateBookingMutation.isPending || b.courts <= 1}
                                onClick={() =>
                                  updateBookingMutation.mutate({
                                    id: b.id,
                                    updates: { courts: Math.max(1, (b.courts || 1) - 1) },
                                  })
                                }
                              >
                                <span style={styles.text}>-</span>
                              </button>
                              <button
                                className="w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors hover:brightness-110"
                                style={{ ...styles.secondaryButton, ...(styles.border || {}) }}
                                title="Increase courts"
                                aria-label="Increase courts"
                                disabled={updateBookingMutation.isPending}
                                onClick={() =>
                                  updateBookingMutation.mutate({
                                    id: b.id,
                                    updates: { courts: (b.courts || 1) + 1 },
                                  })
                                }
                              >
                                <span style={styles.text}>+</span>
                              </button>
                            </div>
                          )}
                        </div>
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
                  {((b.note || "").trim()) && (
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
                      <span style={styles.secondaryText}>{(b.note || "").trim()}</span>
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

                      {/* Right-side Controls: Admin add + user self register/cancel */}
                      <div className="sm:mt-0 mt-1 flex items-center gap-2">
                        {isAdmin && (
                          <button
                            onClick={() => setAddPlayerBookingId(b.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
                            style={styles.secondaryButton}
                            title="Add player"
                            aria-label="Add player"
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
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        )}
                        {userRegistered ? (
                          <button
                            onClick={() => {
                              removeRegistrationMutation.reset();
                              setConfirmSelfBookingId(b.id);
                            }}
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
                                {/* Username (link) or fallback */}
                                {reg.user?.username ? (
                                  <a
                                    href={`https://t.me/${reg.user.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.text}
                                  >
                                    @{reg.user.username}
                                  </a>
                                ) : (
                                  <>
                                    {reg.user?.first_name ||
                                      `User ${reg.user_id}`}
                                  </>
                                )}
                                {/* Display name (explicit or first+last) */}
                                {(() => {
                                  const name =
                                    reg.user?.explicit_name ||
                                    [reg.user?.first_name, reg.user?.last_name]
                                      .filter(Boolean)
                                      .join(" ");
                                  return name ? (
                                    <span
                                      style={{
                                        marginLeft: 6,
                                        ...styles.secondaryText,
                                      }}
                                    >
                                      {name}
                                    </span>
                                  ) : null;
                                })()}
                                {/* Skill */}
                                <span
                                  style={{
                                    marginLeft: 6,
                                    ...styles.secondaryText,
                                  }}
                                >
                                  ({reg.user?.skill_level || "E"})
                                </span>
                              </span>
                              {userRegistered &&
                                telegramUserId &&
                                reg.user_id === telegramUserId &&
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
                                  setConfirmRemove({
                                    id: reg.id,
                                    bookingId: b.id,
                                  })
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
                                {/* Username (link) or fallback */}
                                {reg.user?.username ? (
                                  <a
                                    href={`https://t.me/${reg.user.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.text}
                                  >
                                    @{reg.user.username}
                                  </a>
                                ) : (
                                  <>
                                    {reg.user?.first_name ||
                                      `User ${reg.user_id}`}
                                  </>
                                )}
                                {/* Display name (explicit or first+last) */}
                                {(() => {
                                  const name =
                                    reg.user?.explicit_name ||
                                    [reg.user?.first_name, reg.user?.last_name]
                                      .filter(Boolean)
                                      .join(" ");
                                  return name ? (
                                    <span
                                      style={{
                                        marginLeft: 6,
                                        ...styles.secondaryText,
                                      }}
                                    >
                                      {name}
                                    </span>
                                  ) : null;
                                })()}
                                {/* Skill */}
                                <span
                                  style={{
                                    marginLeft: 6,
                                    ...styles.secondaryText,
                                  }}
                                >
                                  ({reg.user?.skill_level || "E"})
                                </span>
                              </span>
                              {userOnWaitlist &&
                                telegramUserId &&
                                reg.user_id === telegramUserId && (
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
                                  setConfirmRemove({
                                    id: reg.id,
                                    bookingId: b.id,
                                  })
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

                  {/* Admin Messages Section */}
                  {isAdmin && (
                    <div
                      className="border rounded-lg p-3 space-y-3 mt-2"
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
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                          <span
                            className="font-bold text-sm"
                            style={styles.text}
                          >
                            Messages
                          </span>
                        </div>

                        {/* Message Actions */}
                        <div className="flex items-center gap-2">
                          {telegramMessages[b.id] &&
                          telegramMessages[b.id].length > 0 ? (
                            <>
                              <button
                                onClick={handleRefreshMessages}
                                disabled={refreshMessagesMutation.isPending}
                                className="px-3 py-1.5 border rounded-md text-sm font-medium transition-colors hover:brightness-90"
                                style={{
                                  ...styles.secondaryButton,
                                  ...styles.border,
                                  opacity: refreshMessagesMutation.isPending
                                    ? 0.6
                                    : 1,
                                }}
                                title="Check message status"
                              >
                                {refreshMessagesMutation.isPending
                                  ? "Checking..."
                                  : "Refresh"}
                              </button>
                              <button
                                onClick={() => {
                                  setPostDialogBooking(b);
                                  setPostDialogChatId(undefined);
                                }}
                                className="px-3 py-1.5 text-white border rounded-md text-sm font-medium transition-colors hover:brightness-110"
                                style={styles.primaryButton}
                                title="Send new message"
                              >
                                Post New
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center">
                              <button
                                onClick={() => {
                                  setPostDialogBooking(b);
                                  setPostDialogChatId(undefined);
                                }}
                                className="px-3 py-1.5 text-white border rounded-md text-sm font-medium transition-colors hover:brightness-110"
                                style={styles.primaryButton}
                                title="Post to chat"
                              >
                                Post to
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message Status */}
                      <div className="space-y-1">
                        {telegramMessages[b.id] &&
                        telegramMessages[b.id].length > 0 ? (
                          <>
                            <div
                              className="text-xs font-bold uppercase tracking-wide"
                              style={styles.secondaryText}
                            >
                              Active Messages ({telegramMessages[b.id].length})
                            </div>
                            {telegramMessages[b.id].map((msg, index) => (
                              <div
                                key={msg.id}
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
                                  <div className="flex flex-col">
                                    {(() => {
                                      const chatIdStr = String(msg.chat_id);
                                      const cleanedId = chatIdStr
                                        .replace(/^-100/, "") // remove Telegram supergroup/channel prefix
                                        .replace(/^-/, ""); // remove any remaining leading '-'
                                      const deepLink = `https://t.me/c/${cleanedId}/${msg.message_id}`;
                                      return (
                                        <a
                                          href={deepLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-medium"
                                          style={{
                                            ...(styles.link || styles.text),
                                            textDecoration: "underline",
                                          }}
                                          title="Open message in Telegram"
                                        >
                                          Message {msg.message_id}
                                        </a>
                                      );
                                    })()}
                                    <span
                                      className="text-xs"
                                      style={styles.secondaryText}
                                    >
                                      {(() => {
                                        const ch = chatLookup[msg.chat_id];
                                        const title =
                                          ch?.title ||
                                          ch?.name ||
                                          (ch?.username
                                            ? `@${ch.username}`
                                            : `Chat ${msg.chat_id}`);
                                        const d = msg.created_at
                                          ? new Date(msg.created_at)
                                          : null;
                                        const date = d
                                          ? d
                                              .toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })
                                              .replace(/\//g, ".")
                                          : "";
                                        const time = d
                                          ? d.toLocaleTimeString("en-GB", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: false,
                                            })
                                          : "";
                                        return `${title} • ${date} • ${time}`;
                                      })()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const chat =
                                      chatLookup[msg.chat_id as number];
                                    const canPin =
                                      chat?.permissions?.can_pin_messages !==
                                      false;
                                    if (msg.is_pinned) {
                                      return (
                                        <button
                                          onClick={() =>
                                            canPin &&
                                            handleUnpinMessage(
                                              msg.message_id,
                                              msg.chat_id
                                            )
                                          }
                                          disabled={
                                            !canPin ||
                                            unpinMessageMutation.isPending
                                          }
                                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                            canPin
                                              ? "hover:brightness-110"
                                              : "opacity-60 cursor-not-allowed"
                                          }`}
                                          style={styles.iconButton}
                                          title={
                                            canPin
                                              ? "Unpin message"
                                              : "Bot lacks rights to manage pinned messages"
                                          }
                                          aria-disabled={!canPin}
                                        >
                                          <PinOffIcon size={14} className="w-3.5 h-3.5" strokeWidth={2} />
                                        </button>
                                      );
                                    }
                                    return (
                                      <button
                                        onClick={() =>
                                          canPin &&
                                          handlePinMessage(
                                            msg.message_id,
                                            msg.chat_id
                                          )
                                        }
                                        disabled={
                                          !canPin ||
                                          pinMessageMutation.isPending
                                        }
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                          canPin
                                            ? "hover:brightness-110"
                                            : "opacity-60 cursor-not-allowed"
                                        }`}
                                        style={styles.iconButton}
                                        title={
                                          canPin
                                            ? "Pin message"
                                            : "Bot lacks rights to manage pinned messages"
                                        }
                                        aria-disabled={!canPin}
                                      >
                                        <PinIcon size={14} className="w-3.5 h-3.5" strokeWidth={2} />
                                      </button>
                                    );
                                  })()}
                                  <button
                                    onClick={() =>
                                      handleDeleteMessage(
                                        msg.id,
                                        msg.message_id,
                                        msg.chat_id
                                      )
                                    }
                                    className="w-6 h-6 transition-colors hover:brightness-110"
                                    style={styles.destructiveText}
                                    title="Delete message"
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
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div
                            className="text-sm text-center py-4"
                            style={styles.secondaryText}
                          >
                            No messages posted yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {(isAdmin || location?.url) && (
                    <div
                      className="flex justify-end gap-1 mt-3 pt-3 border-t"
                      style={styles.border}
                    >
                      {/* Maps Link */}
                      {location?.url && (
                        <a
                          href={location.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
                          style={{
                            ...styles.secondaryButton,
                            ...styles.border,
                          }}
                          title="Open in Google Maps"
                          aria-label="Open in Google Maps"
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
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </a>
                      )}

                      {/* Admin Controls */}
                      {isAdmin && (
                        <>
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
                        </>
                      )}
                    </div>
                  )}
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

      <ConfirmRemoveModal
        payload={confirmRemove}
        onCancel={() => setConfirmRemove(null)}
        onConfirm={(p) => {
          setConfirmRemove(null);
          handleAdminRemoveRegistration(p.id, p.bookingId);
        }}
      />
      <ConfirmSelfCancelModal
        bookingId={confirmSelfBookingId}
        isPending={removeRegistrationMutation.isPending}
        onCancel={() => setConfirmSelfBookingId(null)}
        onConfirm={(bid) => handleUnregister(bid)}
      />

      {/* Pin/Unpin Confirmation Modals */}
      <ConfirmPinModal
        payload={confirmPin}
        mode="pin"
        isPending={pinMessageMutation.isPending}
        onCancel={() => setConfirmPin(null)}
        onConfirm={({ messageId, chatId }) => {
          setConfirmPin(null);
          pinMessageMutation.mutate(
            { messageId, chatId, disableNotification: true },
            {
              onError: (error) => {
                setError("Failed to pin message");
                console.error("Pin message error:", error);
              },
            }
          );
        }}
      />
      <ConfirmPinModal
        payload={confirmUnpin}
        mode="unpin"
        isPending={unpinMessageMutation.isPending}
        onCancel={() => setConfirmUnpin(null)}
        onConfirm={({ messageId, chatId }) => {
          setConfirmUnpin(null);
          unpinMessageMutation.mutate(
            { messageId, chatId },
            {
              onError: (error) => {
                setError("Failed to unpin message");
                console.error("Unpin message error:", error);
              },
            }
          );
        }}
      />

      {/* Post To Dialog */}
      {postDialogBooking && (
        <PostToDialog
          booking={postDialogBooking}
          initialChatId={postDialogChatId}
          onClose={() => {
            setPostDialogBooking(null);
            setPostDialogChatId(undefined);
          }}
          onPost={(chatId) => {
            const b = postDialogBooking;
            setPostDialogBooking(null);
            setPostDialogChatId(undefined);
            handlePostToTelegram(b, chatId);
          }}
        />
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

      {/* Add Player Modal (Admin) */}
      <AddPlayerModal
        isOpen={addPlayerBookingId !== null}
        bookingId={addPlayerBookingId}
        excludeUserIds={
          addPlayerBookingId !== null
            ? getBookingRegistrations(addPlayerBookingId).map((r) => r.user_id)
            : []
        }
        onClose={() => setAddPlayerBookingId(null)}
      />
    </div>
  );
}
