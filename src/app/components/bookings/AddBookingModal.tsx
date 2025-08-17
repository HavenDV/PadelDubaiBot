"use client";

import { useState, useEffect } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { BookingInsert, Location, Booking } from "../../../../database.types";
import { useRecentPrice, useCreateBooking, useUpdateBooking } from "@lib/hooks/db";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locations: Location[];
  onLocationUpdate?: () => void; // Callback to refresh locations list
  editingBooking?: Booking | null; // Optional booking to edit (null/undefined = add mode)
}

function combineLocalDateTimeToISO(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return "";
  const local = new Date(`${dateStr}T${timeStr}`);
  return local.toISOString();
}

function toDateString(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeString(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function calculateDuration(startTime: string | null, endTime: string | null): number {
  if (!startTime || !endTime) return 90; // Default to 90 minutes
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

export default function AddBookingModal({
  isOpen,
  onClose,
  onSuccess,
  locations,
  onLocationUpdate,
  editingBooking,
}: AddBookingModalProps) {
  const { theme } = useTelegram();
  // React Query mutations
  const createBookingMutation = useCreateBooking();
  const updateBookingMutation = useUpdateBooking();
  
  const loading = createBookingMutation.isPending || updateBookingMutation.isPending;
  const [error, setError] = useState<string>("");
  const [smartPasteText, setSmartPasteText] = useState<string>("");
  const [smartPasteLoading, setSmartPasteLoading] = useState<boolean>(false);
  const [showSmartPaste, setShowSmartPaste] = useState<boolean>(false);
  const [clipboardLoading, setClipboardLoading] = useState<boolean>(false);

  const [form, setForm] = useState<BookingInsert>({
    start_time: "",
    end_time: "",
    location_id: 0,
    price: 0,
    courts: 1,
    note: "",
    cancelled: false,
  });

  // Create form date/time pieces for clarity
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(90); // Duration in minutes, default 90 min

  const isEditMode = !!editingBooking;

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingBooking && isOpen) {
      // Populate main form
      setForm({
        start_time: "", // Will be calculated from date/time
        end_time: "", // Will be calculated from date/time + duration
        location_id: editingBooking.location_id || 0,
        price: editingBooking.price || 0,
        courts: editingBooking.courts || 1,
        note: editingBooking.note || "",
        cancelled: editingBooking.cancelled || false,
      });
      
      // Populate date/time fields
      setStartDate(toDateString(editingBooking.start_time));
      setStartTime(toTimeString(editingBooking.start_time));
      setDuration(calculateDuration(editingBooking.start_time, editingBooking.end_time));
      
      // Clear Smart Paste state
      setError("");
      setSmartPasteText("");
      setShowSmartPaste(false);
    } else if (!isEditMode && isOpen) {
      // Reset for add mode
      resetForm();
    }
  }, [editingBooking, isOpen, isEditMode]);

  // Use React Query to get recent price for the selected location
  const { data: recentPrice } = useRecentPrice(form.location_id || undefined);
  
  // Auto-populate price when location changes and no price is set
  useEffect(() => {
    if (recentPrice && (!form.price || form.price === 0)) {
      setForm((f) => ({ ...f, price: recentPrice }));
    }
  }, [recentPrice, form.price]);

  const resetForm = () => {
    setForm({
      start_time: "",
      end_time: "",
      location_id: 0,
      price: 0,
      courts: 1,
      note: "",
      cancelled: false,
    });
    setStartDate("");
    setStartTime("");
    setDuration(90);
    setError("");
    setSmartPasteText("");
    setShowSmartPaste(false);
    setClipboardLoading(false);
  };

  const handleSave = async () => {
    const startISO = combineLocalDateTimeToISO(startDate, startTime);
    if (!startISO || !form.location_id || form.price <= 0) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Calculate end time by adding duration to start time
    const startDateTime = new Date(startISO);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);
    const endISO = endDateTime.toISOString();
    
    setError("");
    
    const payload = {
      start_time: startISO,
      end_time: endISO,
      location_id: form.location_id,
      price: form.price,
      courts: form.courts,
      note: form.note,
      cancelled: editingBooking?.cancelled || false,
    };

    try {
      if (isEditMode && editingBooking) {
        // Update existing booking
        await updateBookingMutation.mutateAsync({
          id: editingBooking.id,
          updates: payload
        });
      } else {
        // Create new booking
        await createBookingMutation.mutateAsync(payload);
      }
      
      resetForm();
      onSuccess();
      onClose();
    } catch (e) {
      setError(isEditMode ? "Failed to update booking" : "Failed to create booking");
      console.error(e);
    }
  };

  const handleSmartPaste = async () => {
    if (!smartPasteText.trim()) return;
    
    setSmartPasteLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/auto-fill/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: smartPasteText
        })
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process text');
        } catch {
          // If we can't parse the error response, show a generic message
          throw new Error('Failed to process text. Please check your input and try again.');
        }
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Received invalid response from server. Please try again.');
      }
      
      const extractedData = result.data;
      
      if (extractedData && result.success) {
        // Auto-fill form fields
        if (extractedData.date) {
          setStartDate(extractedData.date);
        }
        if (extractedData.time) {
          setStartTime(extractedData.time);
        }
        if (extractedData.duration) {
          setDuration(extractedData.duration);
        }
        if (extractedData.price) {
          setForm(f => ({ ...f, price: extractedData.price as number }));
        }
        if (extractedData.courts) {
          setForm(f => ({ ...f, courts: extractedData.courts }));
        }
        if (extractedData.note) {
          setForm(f => ({ ...f, note: extractedData.note }));
        }
        
        // Handle location - API now provides location_id if matched/created
        if (extractedData.location_id) {
          setForm(f => ({ ...f, location_id: extractedData.location_id }));
        } else if (extractedData.location_name) {
          // Fallback: try to match location by name on frontend (shouldn't happen often)
          const matchedLocation = locations.find(loc => 
            loc.name.toLowerCase().includes(extractedData.location_name.toLowerCase()) ||
            extractedData.location_name.toLowerCase().includes(loc.name.toLowerCase())
          );
          if (matchedLocation) {
            setForm(f => ({ ...f, location_id: matchedLocation.id }));
          }
        }
        
        setSmartPasteText("");
        setShowSmartPaste(false);
        
        // If a new location was created, refresh the locations list
        if (extractedData.location_id && onLocationUpdate) {
          onLocationUpdate();
        }
      }
    } catch (e) {
      console.error("Smart paste error:", e);
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
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText && clipboardText.trim()) {
        setSmartPasteText(clipboardText.trim());
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 ${
          theme.cardBg || "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme.text}`}>
            {isEditMode ? "Edit Booking" : "Add New Booking"}
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
                Paste booking details from messages, emails, or any text and we&apos;ll auto-fill the form fields.
              </p>
              <textarea
                value={smartPasteText}
                onChange={(e) => setSmartPasteText(e.target.value)}
                placeholder="Paste booking details here... e.g. 'Game at Oxygen Tennis tomorrow at 7 PM for 90 minutes, 110 AED per person'"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column: Start date, Start time, Duration */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
              />
              <p className="text-xs text-gray-400 mt-1">
                The date players should arrive.
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Start time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
              />
              <p className="text-xs text-gray-400 mt-1">
                Local time the game starts.
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
              >
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={150}>2.5 hours</option>
                <option value={180}>3 hours</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                How long the game session lasts.
              </p>
            </div>
          </div>

          {/* Right column: Location, Price, Courts */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Location
              </label>
              <select
                value={form.location_id ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location_id: Number(e.target.value) }))
                }
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
              >
                <option value="" disabled>
                  Select location
                </option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Club where the game happens.
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Price
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 110"
                value={Number(form.price) || 0}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
              />
              <p className="text-xs text-gray-400 mt-1">Amount in AED per player.</p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Courts
              </label>
              <input
                type="number"
                min={1}
                placeholder="1"
                value={form.courts as number}
                onChange={(e) => setForm((f) => ({ ...f, courts: Number(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  theme.cardBg || "border-gray-300 bg-white"
                } ${theme.text || "text-black"}`}
              />
              <p className="text-xs text-gray-400 mt-1">Number of courts reserved.</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
              Note
            </label>
            <input
              type="text"
              placeholder="Optional details for players"
              value={(form.note as string) || ""}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme.cardBg || "border-gray-300 bg-white"
              } ${theme.text || "text-black"}`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Extra info (parking, coach, etc.).
            </p>
          </div>

        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loading
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading 
              ? (isEditMode ? "Updating..." : "Creating...") 
              : (isEditMode ? "Update booking" : "Add booking")
            }
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
