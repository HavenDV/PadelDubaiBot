"use client";

import { useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { supabase } from "@lib/supabase/client";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onSuccess,
}: AddLocationModalProps) {
  const { theme } = useTelegram();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const resetForm = () => {
    setName("");
    setUrl("");
    setError("");
  };

  const handleCreate = async () => {
    if (!name || !url) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("locations")
        .insert({ name, url });
      if (error) throw error;
      resetForm();
      onSuccess();
      onClose();
    } catch (e) {
      setError("Failed to create location");
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
        className={`w-full max-w-md rounded-lg p-6 ${
          theme.cardBg || "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme.text}`}>Add New Location</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Oxygen Tennis Academy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Name of the padel club or venue.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Maps URL
            </label>
            <input
              type="url"
              placeholder="https://maps.google.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Google Maps link or website URL for directions.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleCreate}
            disabled={loading || !name || !url}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loading || !name || !url
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Creating..." : "Add Location"}
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