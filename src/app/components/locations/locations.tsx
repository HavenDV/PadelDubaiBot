"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../../hooks/useUser";
import { supabase } from "@lib/supabase/client";
import { Location } from "../../../../database.types";
import Image from "next/image";
import AddLocationModal from "./AddLocationModal";

export default function Locations() {
  const { theme } = useTelegram();
  const { isAdmin } = useUser();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");

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

  const startEdit = (loc: Location) => {
    setEditingId(loc.id);
    setEditName(loc.name);
    setEditUrl(loc.url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditUrl("");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("locations")
        .update({ name: editName, url: editUrl })
        .eq("id", editingId);
      if (error) throw error;
      cancelEdit();
      await load();
    } catch (e) {
      setError("Failed to update location");

      console.error(e);
    } finally {
      setLoading(false);
    }
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
            onClick={() => setIsModalOpen(true)}
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
              {isAdmin && editingId === loc.id ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                      theme.cardBg || "border-gray-300 bg-white"
                    } ${theme.text || "text-black"}`}
                  />
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                      theme.cardBg || "border-gray-300 bg-white"
                    } ${theme.text || "text-black"}`}
                  />
                </div>
              ) : (
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
                </div>
              )}
              {isAdmin && (
                <div className="flex gap-2">
                  {editingId === loc.id ? (
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
                        onClick={() => startEdit(loc)}
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
                  )}
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
        onClose={() => setIsModalOpen(false)}
        onSuccess={load}
      />
    </div>
  );
}
