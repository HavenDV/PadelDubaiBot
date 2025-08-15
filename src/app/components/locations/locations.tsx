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
            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg font-medium transition-colors flex items-center justify-center"
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
              className="py-3 flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <div className="flex-1">
                <div className={`font-medium ${theme.text}`}>{loc.name}</div>
                <a
                  href={loc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {loc.url}
                </a>
                {openMapId === loc.id && (
                  <div className="mt-3">
                    <MapEmbed name={loc.name} url={loc.url} height={220} className="w-full rounded-md" />
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <>
                    <button
                      onClick={() => setOpenMapId((prev) => (prev === loc.id ? null : loc.id))}
                      className="px-3 py-2 rounded-md text-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {openMapId === loc.id ? "Hide Map" : "Show Map"}
                    </button>
                    <button
                      onClick={() => openEditModal(loc)}
                      className="px-3 py-2 rounded-md text-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className="px-3 py-2 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </>
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
