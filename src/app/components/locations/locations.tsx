"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../../hooks/useUser";
import { supabase } from "@lib/supabase/client";
import { Location } from "../../../../database.types";
import Image from "next/image";
import AddLocationModal from "./AddLocationModal";
import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

export default function Locations() {
  const { theme } = useTelegram();
  const { isAdmin } = useUser();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [openMapId, setOpenMapId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("id");
      if (error) throw error;
      setLocations(data ?? []);
    } catch (e) {
      setError("Failed to load locations");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };
  const openEditModal = (loc: Location) => {
    setEditingLocation(loc);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
      await load();
    } catch (e) {
      setError("Failed to delete location");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/location.svg" alt="Locations" width={20} height={20} />
          <h2 className={`text-xl font-bold ${theme.text}`}>Locations</h2>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-800 text-white rounded-full text-lg font-medium transition-colors flex items-center justify-center"
            title="Add Location"
          >
            +
          </button>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {loading && locations.length === 0 ? (
        <div className="divide-y divide-gray-200/40">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 animate-pulse"
            >
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded w-48 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-72" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200/40">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="relative py-3 flex flex-col sm:flex-row sm:items-start gap-2"
            >
              <div className="flex-1 pr-24">
                <div className={`font-medium ${theme.text}`}>{loc.name}</div>
                <a
                  href={loc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {loc.url}
                </a>
                {/* Opening hours */}
                {Array.isArray((loc as any).opening_hours) && (
                  <div className="mt-3">
                    <div className={`text-xs font-medium mb-2 ${theme.text}`}>Opening hours</div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-md">
                      <div className="divide-y divide-gray-100">
                        {((loc as any).opening_hours as string[]).map((line: string, idx: number) => {
                          const [day, hours] = line.split(': ');
                          const isOpen24h = hours?.toLowerCase().includes('24 hours') || hours?.toLowerCase().includes('open 24 hours');
                          const isClosed = hours?.toLowerCase().includes('closed');
                          
                          return (
                            <div key={idx} className="px-4 py-2.5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                              <span className="text-sm font-medium text-gray-800 min-w-[80px]">{day}</span>
                              <span className={`text-sm font-medium ${
                                isOpen24h ? 'text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs' :
                                isClosed ? 'text-red-600' : 
                                'text-gray-600'
                              }`}>
                                {isOpen24h ? '24/7' : hours || 'Closed'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {openMapId === loc.id && (
                  <div className="mt-3">
                    <MapEmbed name={loc.name} url={loc.url} height={220} className="w-full rounded-md" />
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="absolute top-1 right-0 flex items-center gap-1">
                  {/* Toggle Map */}
                  <button
                    onClick={() => setOpenMapId((prev) => (prev === loc.id ? null : loc.id))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors"
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
                    >
                      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" />
                      <path d="M9 4v16" />
                      <path d="M15 6v16" />
                    </svg>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(loc)}
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
                    onClick={() => handleDelete(loc.id)}
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
            </div>
          ))}
          {!loading && locations.length === 0 && (
            <div className="py-6 text-sm text-gray-500">No locations yet</div>
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
        onSuccess={load}
        editingLocation={editingLocation}
      />
    </div>
  );
}
