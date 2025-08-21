"use client";

import { useEffect, useState } from "react";
import { useTelegramTheme } from "@/app/hooks/telegram";
import { supabase } from "@lib/supabase/client";
import { User } from "../../../../database.types";
import { useAddRegistration, useRemoveRegistration } from "@lib/hooks/db";

type AddPlayerModalProps = {
  isOpen: boolean;
  bookingId: number | null;
  onClose: () => void;
  excludeUserIds?: number[]; // already registered for this booking
};

export default function AddPlayerModal({
  isOpen,
  bookingId,
  onClose,
  excludeUserIds = [],
}: AddPlayerModalProps) {
  const { styles } = useTelegramTheme();
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const addRegistration = useAddRegistration();
  const removeRegistration = useRemoveRegistration();
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  // Track registered users locally for instant UI feedback, while syncing with props
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(
    () => new Set<number>(excludeUserIds)
  );
  useEffect(() => {
    if (isOpen) {
      setRegisteredIds(new Set<number>(excludeUserIds));
    }
  }, [excludeUserIds, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let aborted = false;
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const query = supabase
          .from("users")
          .select(
            "id, first_name, last_name, username, photo_url, explicit_name, skill_level"
          )
          .order("updated_at", { ascending: false })
          .limit(25);

        const term = search.trim();
        let res;
        if (term.length >= 2) {
          // Search across common name fields and username
          res = await query.or(
            `username.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%,explicit_name.ilike.%${term}%`
          );
        } else {
          res = await query;
        }

        if (aborted) return;
        if (res.error) throw res.error;
        setUsers((res.data || []) as User[]);
      } catch (e) {
        if (!aborted) {
          console.error("Fetch users error:", e);
          setError("Failed to load users");
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    // Debounce for search
    const t = setTimeout(fetchUsers, search.trim().length >= 2 ? 250 : 0);
    return () => {
      aborted = true;
      clearTimeout(t);
    };
  }, [isOpen, search]);

  if (!isOpen || bookingId === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-lg rounded-lg border shadow-sm"
        style={{ ...styles.card, ...styles.border }}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold" style={styles.text}>
              Add player to game
            </div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
              style={styles.secondaryButton}
              onClick={onClose}
              aria-label="Close"
              title="Close"
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

          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or name..."
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{ ...styles.border }}
            />
            <div className="text-xs mt-1" style={styles.secondaryText}>
              Type 2+ characters to search, or browse recent users
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div
            className="max-h-80 overflow-y-auto overflow-x-hidden rounded-md border"
            style={styles.border}
          >
            {loading ? (
              <div className="p-3 text-sm" style={styles.secondaryText}>
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="p-3 text-sm" style={styles.secondaryText}>
                No users found
              </div>
            ) : (
              <ul className="divide-y overflow-x-hidden" style={styles.border}>
                {users.map((u) => {
                  const name =
                    u.explicit_name ||
                    [u.first_name, u.last_name].filter(Boolean).join(" ");
                  const isRegistered = registeredIds.has(u.id);
                  return (
                    <li
                      key={u.id}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="min-w-0">
                        <div
                          className="text-sm font-medium truncate"
                          style={styles.text}
                        >
                          {u.username ? (
                            <a
                              href={`https://t.me/${u.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.text}
                            >
                              @{u.username}
                            </a>
                          ) : (
                            <span>{name || `User ${u.id}`}</span>
                          )}
                          {name && (
                            <span className="ml-2" style={styles.secondaryText}>
                              {name}
                            </span>
                          )}
                          <span className="ml-2" style={styles.secondaryText}>
                            ({u.skill_level || "E"})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:brightness-110 ${
                            pendingIds.has(u.id)
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                          style={styles.primaryButton}
                          disabled={pendingIds.has(u.id)}
                          onClick={async () => {
                            if (bookingId === null) return;
                            setError("");
                            try {
                              setPendingIds((prev) => new Set(prev).add(u.id));
                              if (!isRegistered) {
                                await addRegistration.mutateAsync({
                                  bookingId,
                                  userId: u.id,
                                });
                                setRegisteredIds((prev) =>
                                  new Set(prev).add(u.id)
                                );
                              } else {
                                await removeRegistration.mutateAsync({
                                  bookingId,
                                  userId: u.id,
                                });
                                setRegisteredIds((prev) => {
                                  const next = new Set(prev);
                                  next.delete(u.id);
                                  return next;
                                });
                              }
                            } catch (e) {
                              const msg =
                                (e as { message?: string })?.message ||
                                (isRegistered
                                  ? "Failed to remove player"
                                  : "Failed to add player");
                              setError(msg);
                            } finally {
                              setPendingIds((prev) => {
                                const next = new Set(prev);
                                next.delete(u.id);
                                return next;
                              });
                            }
                          }}
                        >
                          <span
                            className={`${
                              pendingIds.has(u.id)
                                ? "relative overflow-hidden"
                                : ""
                            }`}
                            style={{
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            {isRegistered ? "Remove" : "Add"}
                            {pendingIds.has(u.id) && (
                              <>
                                <div
                                  className="absolute inset-0 -skew-x-12"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                    animation: "shimmer 1.5s infinite",
                                  }}
                                />
                                <style jsx>{`
                                  @keyframes shimmer {
                                    0% {
                                      transform: translateX(-100%) skewX(-12deg);
                                    }
                                    100% {
                                      transform: translateX(200%) skewX(-12deg);
                                    }
                                  }
                                `}</style>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
