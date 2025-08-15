"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { supabase } from "@lib/supabase/client";
import { Location } from "../../../../database.types";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingLocation?: Location | null; // when provided, modal works in edit mode
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onSuccess,
  editingLocation,
}: AddLocationModalProps) {
  const { theme } = useTelegram();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [smartPasteText, setSmartPasteText] = useState<string>("");
  const [smartPasteLoading, setSmartPasteLoading] = useState<boolean>(false);
  const [showSmartPaste, setShowSmartPaste] = useState<boolean>(false);
  const [clipboardLoading, setClipboardLoading] = useState<boolean>(false);
  // no auto URL preview logic

  const isEditMode = !!editingLocation;

  

  const resetForm = () => {
    setName("");
    setUrl("");
    setError("");
    setSmartPasteText("");
    setShowSmartPaste(false);
    setSmartPasteLoading(false);
    setClipboardLoading(false);
  };

  const handleSave = async () => {
    if (!name || !url) return;
    setLoading(true);
    setError("");
    try {
      if (isEditMode && editingLocation) {
        const { error } = await supabase
          .from("locations")
          .update({ name, url })
          .eq("id", editingLocation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("locations").insert({ name, url });
        if (error) throw error;
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (e) {
      setError(isEditMode ? "Failed to update location" : "Failed to create location");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Populate when opening in edit mode
  useEffect(() => {
    if (!isOpen) return;
    if (isEditMode && editingLocation) {
      setName(editingLocation.name || "");
      setUrl(editingLocation.url || "");
      setError("");
      setSmartPasteText("");
      setShowSmartPaste(false);
    } else if (!isEditMode) {
      // Ensure add mode starts clean when opening
      if (name === "" && url === "") {
        setError("");
        setSmartPasteText("");
        setShowSmartPaste(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode, editingLocation?.id]);

  // Removed auto-detection of name from URL to avoid incorrect results

  const handleSmartPaste = async () => {
    if (!smartPasteText.trim()) return;
    setSmartPasteLoading(true);
    setError("");
    try {
      const processedText = smartPasteText;
      const res = await fetch("/api/auto-fill/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: processedText }),
      });
      if (!res.ok) {
        try {
          const data = await res.json();
          throw new Error(data.error || "Failed to process text");
        } catch {
          throw new Error("Failed to process text. Please try again.");
        }
      }
      const data = await res.json();
      const extracted = data?.data as { name?: string; url?: string };
      if (extracted?.name) setName(extracted.name);
      if (extracted?.url) setUrl(extracted.url);
      setSmartPasteText("");
      setShowSmartPaste(false);
    } catch (e) {
      console.error("Smart paste (locations) error:", e);
      setError(e instanceof Error ? e.message : "Failed to process pasted text");
    } finally {
      setSmartPasteLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    if (!navigator.clipboard) {
      setError("Clipboard access not supported in this browser");
      return;
    }
    setClipboardLoading(true);
    setError("");
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setSmartPasteText(text.trim());
      } else {
        setError("Clipboard is empty");
      }
    } catch (err) {
      console.error("Clipboard read error:", err);
      setError("Failed to read clipboard. Please grant permission or paste manually.");
    } finally {
      setClipboardLoading(false);
    }
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
          <h2 className={`text-xl font-bold ${theme.text}`}>
            {isEditMode ? "Edit Location" : "Add New Location"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Smart Paste Section */}
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <button
            onClick={() => setShowSmartPaste(!showSmartPaste)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <span>🪄</span>
            Smart Paste
            <span className={`transition-transform ${showSmartPaste ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {showSmartPaste && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-gray-600">
                Paste a club name and/or Google Maps link and we’ll auto-fill the fields.
              </p>
              <textarea
                value={smartPasteText}
                onChange={(e) => setSmartPasteText(e.target.value)}
                placeholder="e.g. Oxygen Padel Sport Academy https://maps.app.goo.gl/..."
                className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePasteFromClipboard}
                  disabled={clipboardLoading}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    clipboardLoading
                      ? "bg-gray-300 text-gray-500"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                  title="Paste from clipboard"
                >
                  {clipboardLoading ? "Reading..." : "📋 Paste"}
                </button>
                <button
                  onClick={handleSmartPaste}
                  disabled={smartPasteLoading || !smartPasteText.trim()}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    smartPasteLoading || !smartPasteText.trim()
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {smartPasteLoading ? "Processing..." : "Auto-fill"}
                </button>
                <button
                  onClick={() => setSmartPasteText("")}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

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
            onClick={handleSave}
            disabled={loading || !name || !url}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loading || !name || !url
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Location" : "Add Location")}
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
