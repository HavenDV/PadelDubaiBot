"use client";

import React, { useState } from "react";
import { LocationIcon } from "@components/icons/Icons";
import { useTelegramTheme } from "@/app/hooks/useTelegramTheme";
import { useUser } from "../../hooks/useUser";
import { Location } from "../../../../database.types";
import AddLocationModal from "./AddLocationModal";
import dynamic from "next/dynamic";
import { useLocations, useDeleteLocation } from "@lib/hooks/db";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

export default function Locations() {
  const { styles } = useTelegramTheme();
  const { isAdmin } = useUser();
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [openMapId, setOpenMapId] = useState<number | null>(null);

  // Fetch locations using React Query
  const {
    data: locations = [],
    isLoading: loading,
    error: queryError,
  } = useLocations();

  // Handle query errors
  React.useEffect(() => {
    if (queryError) {
      setError("Failed to load locations");
      console.error(queryError);
    } else {
      setError("");
    }
  }, [queryError]);

  const openAddModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };
  const openEditModal = (loc: Location) => {
    setEditingLocation(loc);
    setIsModalOpen(true);
  };

  // Use the centralized delete mutation
  const deleteMutation = useDeleteLocation();

  const handleDelete = (id: number) => {
    if (!confirm("Delete this location?")) return;
    setError("");
    deleteMutation.mutate(id, {
      onError: (error) => {
        setError("Failed to delete location");
        console.error(error);
      },
    });
  };

  const handleModalSuccess = () => {
    // Query invalidation is handled by the mutation hooks automatically
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LocationIcon size={20} style={styles.text} />
          <h2 className="text-xl font-bold" style={styles.text}>
            Locations
          </h2>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="w-8 h-8 text-white rounded-full text-lg font-medium transition-colors flex items-center justify-center hover:brightness-110"
            style={styles.primaryButton}
            title="Add Location"
          >
            +
          </button>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {loading && locations.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl shadow-sm border animate-pulse"
              style={{ ...styles.card, ...styles.border }}
            >
              <div
                className="h-5 rounded w-48 mb-2"
                style={{ ...styles.header, opacity: 0.6 }}
              />
              <div
                className="h-4 rounded w-72"
                style={{ ...styles.card, opacity: 0.7 }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="relative p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row sm:items-start gap-2"
              style={{ ...styles.card, ...styles.border }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {loc.url ? (
                    <a
                      href={loc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:brightness-110"
                      style={styles.secondaryButton}
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
                        style={styles.text}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </a>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={styles.secondaryButton}
                      title="No map link"
                      aria-label="No map link"
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
                        style={styles.text}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                  )}
                  <div className="font-medium" style={styles.text}>
                    {loc.name && loc.name.length > 22 ? `${loc.name.slice(0, 19)}...` : loc.name}
                  </div>
                </div>
                {openMapId === loc.id && (
                  <div className="mt-3">
                    <MapEmbed
                      name={loc.name}
                      url={loc.url}
                      height={220}
                      className="w-full rounded-md"
                    />
                  </div>
                )}
                {/* Opening hours */}
                {Array.isArray(
                  (loc as Location & { opening_hours?: string[] }).opening_hours
                ) && (
                  <div className="mt-3">
                    <div
                      className="text-xs font-medium mb-2"
                      style={styles.text}
                    >
                      Opening hours
                    </div>
                    <div
                      className="border rounded-lg shadow-sm overflow-hidden max-w-md"
                      style={{ ...styles.header, ...styles.border }}
                    >
                      <div>
                        {(
                          loc as Location & { opening_hours: string[] }
                        ).opening_hours.map((line: string, idx: number) => {
                          const [day, hours] = line.split(": ");
                          const isOpen24h =
                            hours?.toLowerCase().includes("24 hours") ||
                            hours?.toLowerCase().includes("open 24 hours");
                          const isClosed = hours
                            ?.toLowerCase()
                            .includes("closed");

                          return (
                            <div
                              key={idx}
                              className="px-4 py-2.5 flex justify-between items-center hover:brightness-110 transition-colors"
                              style={
                                idx > 0
                                  ? {
                                      borderTopWidth: "1px",
                                      borderTopStyle: "solid",
                                      borderTopColor: styles.border.borderColor,
                                    }
                                  : undefined
                              }
                            >
                              <span
                                className="text-sm font-medium min-w-[80px]"
                                style={styles.text}
                              >
                                {day}
                              </span>
                              {isOpen24h ? (
                                <span
                                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                                  style={{
                                    backgroundColor:
                                      styles.selectedBg.backgroundColor,
                                    color: styles.text.color,
                                  }}
                                >
                                  24/7
                                </span>
                              ) : isClosed ? (
                                <span
                                  className="text-sm font-medium"
                                  style={styles.destructiveText}
                                >
                                  {hours || "Closed"}
                                </span>
                              ) : (
                                <span
                                  className="text-sm font-medium"
                                  style={styles.secondaryText}
                                >
                                  {hours || "Closed"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {/* Toggle Map */}
                  <button
                    onClick={() =>
                      setOpenMapId((prev) => (prev === loc.id ? null : loc.id))
                    }
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
                    style={
                      openMapId === loc.id
                        ? styles.primaryButton
                        : {
                            backgroundColor: "transparent",
                            color:
                              (styles.link && styles.link.color) ||
                              styles.primaryButton.backgroundColor,
                            borderWidth: "1px",
                            borderColor:
                              (styles.link && styles.link.color) ||
                              styles.primaryButton.backgroundColor,
                          }
                    }
                    title={openMapId === loc.id ? "Hide map" : "Show map"}
                    aria-label={openMapId === loc.id ? "Hide map" : "Show map"}
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
                      style={{ color: "inherit" }}
                    >
                      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" />
                      <path d="M9 4v16" />
                      <path d="M15 6v16" />
                    </svg>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(loc)}
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
                      style={styles.text}
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:brightness-110"
                    style={
                      deleteMutation.isPending
                        ? {
                            ...styles.secondaryButton,
                            ...styles.border,
                            opacity: 0.6,
                          }
                        : {
                            backgroundColor: "transparent",
                            color: styles.destructiveText.color,
                            borderWidth: "1px",
                            borderColor: styles.destructiveText.color,
                          }
                    }
                    title={deleteMutation.isPending ? "Deleting..." : "Remove"}
                    aria-label={
                      deleteMutation.isPending ? "Deleting..." : "Remove"
                    }
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <div
                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: styles.destructiveText.color,
                          borderTopColor: "transparent",
                        }}
                      />
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
                        style={{ color: styles.destructiveText.color }}
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
          {!loading && locations.length === 0 && (
            <div className="py-6 text-sm" style={styles.secondaryText}>
              No locations yet
            </div>
          )}
        </div>
      )}

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
        onSuccess={handleModalSuccess}
        editingLocation={editingLocation}
      />
    </div>
  );
}
