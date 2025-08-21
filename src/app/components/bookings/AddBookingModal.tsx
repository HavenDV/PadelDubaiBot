"use client";

import { useState, useEffect, useCallback } from "react";
import { useTelegram, useTelegramTheme } from "@/app/hooks/telegram";
import { BookingInsert, Location, Booking } from "../../../../database.types";
import { useRecentPrice, useCreateBooking, useUpdateBooking } from "@lib/hooks/db";
import TimeCrownPicker from "./TimeCrownPicker";

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

function defaultDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AddBookingModal({
  isOpen,
  onClose,
  onSuccess,
  locations,
  onLocationUpdate,
  editingBooking,
}: AddBookingModalProps) {
  const { styles } = useTelegramTheme();
  const { isTelegram } = useTelegram();
  
  // Clipboard (web-only): in Telegram, clipboard is not available
  
  // React Query mutations
  const createBookingMutation = useCreateBooking();
  const updateBookingMutation = useUpdateBooking();
  
  const loading = createBookingMutation.isPending || updateBookingMutation.isPending;
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    date?: string;
    time?: string;
    location?: string;
    price?: string;
  }>({});
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
    note: null,
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
        note: editingBooking.note || null,
        cancelled: editingBooking.cancelled || false,
      });
      
      // Populate date/time fields
      setStartDate(toDateString(editingBooking.start_time));
      setStartTime(toTimeString(editingBooking.start_time));
      setDuration(calculateDuration(editingBooking.start_time, editingBooking.end_time));
      
      // Clear Smart Paste state
      setError("");
      setFieldErrors({});
      setSmartPasteText("");
      setShowSmartPaste(false);
    } else if (!isEditMode && isOpen) {
      // Reset for add mode
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBooking, isOpen, isEditMode]);

  // Use React Query to get recent price for the selected location
  const { data: recentPrice } = useRecentPrice(form.location_id || undefined);
  
  // Auto-populate price when location changes and no price is set
  useEffect(() => {
    if (recentPrice && (!form.price || form.price === 0)) {
      setForm((f) => ({ ...f, price: recentPrice }));
      setFieldErrors((prev) => ({ ...prev, price: undefined }));
    }
  }, [recentPrice, form.price]);

  // Clear field errors reactively when values become valid (covers preselected/defaulted cases)
  useEffect(() => {
    setFieldErrors((prev) => ({
      ...prev,
      date: startDate ? undefined : prev.date,
      time: startTime ? undefined : prev.time,
      location: form.location_id ? undefined : prev.location,
      price: form.price && form.price > 0 ? undefined : prev.price,
    }));
  }, [startDate, startTime, form.location_id, form.price]);

  // When locations load in add mode, preselect the first and clear validation
  useEffect(() => {
    if (
      isOpen &&
      !isEditMode &&
      (!form.location_id || form.location_id === 0) &&
      Array.isArray(locations) &&
      locations.length > 0
    ) {
      setForm((f) => ({ ...f, location_id: locations[0].id }));
      setFieldErrors((prev) => ({ ...prev, location: undefined }));
    }
  }, [locations, isOpen, isEditMode, form.location_id]);

  // No Telegram clipboard integration; use manual paste or web clipboard

  const resetForm = useCallback(() => {
    setForm({
      start_time: "",
      end_time: "",
      location_id: 0,
      price: 0,
      courts: 1,
      note: null,
      cancelled: false,
    });
    setStartDate(defaultDatePlusDays(7));
    setStartTime("20:00");
    setDuration(90);
    setError("");
    setFieldErrors({});
    setSmartPasteText("");
    setShowSmartPaste(false);
    setClipboardLoading(false);
  }, []);

  const handleSave = async () => {
    const startISO = combineLocalDateTimeToISO(startDate, startTime);
    const errs: typeof fieldErrors = {};
    if (!startDate) errs.date = "Required";
    if (!startTime) errs.time = "Required";
    if (!form.location_id) errs.location = "Required";
    if (!form.price || form.price <= 0) errs.price = "Enter a positive amount";

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0 || !startISO) {
      setError("Please correct the highlighted fields");
      return;
    }
    
    // Calculate end time by adding duration to start time
    const startDateTime = new Date(startISO);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);
    const endISO = endDateTime.toISOString();
    
    setError("");
    setFieldErrors({});
    
    const payload = {
      start_time: startISO,
      end_time: endISO,
      location_id: form.location_id,
      price: form.price,
      courts: form.courts,
      note: (typeof form.note === 'string' ? form.note : '')?.trim() ? (form.note as string) : null,
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

        // Clear any previous field errors since values are now populated
        setFieldErrors({});
      }
    } catch (e) {
      console.error("Smart paste error:", e);
      setError(e instanceof Error ? e.message : "Failed to process pasted text");
    } finally {
      setSmartPasteLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    // Fallback to web clipboard API for web environment
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
        setShowSmartPaste(true);
      } else {
        setError("Clipboard is empty");
      }
    } catch (err) {
      console.error("Web clipboard read error:", err);
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
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6`}
        style={styles.card}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold`} style={styles.text}>
            {isEditMode ? "Edit Booking" : "Add New Booking"}
          </h2>
          <button
            onClick={handleClose}
            className="text-2xl transition-colors hover:brightness-110"
            style={styles.secondaryText}
          >
            ×
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Smart Paste Section */}
        <div className="mb-6 border rounded-lg p-4" style={{ ...styles.header, ...styles.border }}>
          <button
            onClick={() => setShowSmartPaste(!showSmartPaste)}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:brightness-110"
            style={{ color: styles.link?.color || styles.primaryButton.backgroundColor }}
          >
            <span>🪄</span>
            Smart Paste
            <span className={`transition-transform ${showSmartPaste ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showSmartPaste && (
            <div className="mt-3 space-y-3">
              <p className="text-xs" style={styles.secondaryText}>
                Paste booking details from messages, emails, or any text and we&apos;ll auto-fill the form fields.
              </p>
              <textarea
                value={smartPasteText}
                onChange={(e) => setSmartPasteText(e.target.value)}
                placeholder="Paste booking details here... e.g. 'Game at Oxygen Tennis tomorrow at 7 PM for 90 minutes, 110 AED per person'"
                className={`w-full px-3 py-2 border rounded-md text-sm resize-none`}
                style={{
                  ...styles.card,
                  ...styles.text,
                  borderColor: (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
                  borderWidth: '1px',
                }}
                rows={3}
              />
              <div className="flex gap-2">
                {!isTelegram && (
                  <button
                    onClick={handlePasteFromClipboard}
                    disabled={clipboardLoading}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors`}
                    style={{
                      ...(clipboardLoading ? { ...styles.secondaryButton, opacity: 0.6 } : styles.secondaryButton),
                      ...(styles.border || {}),
                    }}
                    title="Paste from clipboard"
                  >
                    <span style={styles.text}>
                      {clipboardLoading ? "Reading..." : "📋 Paste"}
                    </span>
                  </button>
                )}
                <button
                  onClick={handleSmartPaste}
                  disabled={smartPasteLoading || !smartPasteText.trim()}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors`}
                  style={
                    smartPasteLoading || !smartPasteText.trim()
                      ? { ...styles.primaryButton, opacity: 0.6 }
                      : styles.primaryButton
                  }
                >
                  <span style={{ color: styles.primaryButton.color }}>
                    {smartPasteLoading ? "Processing..." : "Auto-fill"}
                  </span>
                </button>
                <button
                  onClick={() => setSmartPasteText("")}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
                  style={{ ...styles.secondaryButton, ...styles.border }}
                >
                  <span style={styles.text}>Clear</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column: Date, Time, Duration (compact layout) */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className={`block text-sm font-medium mb-1`} style={styles.text}>
                  Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (fieldErrors.date) setFieldErrors((p) => ({ ...p, date: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.date}
                  className={`w-full h-10 px-3 border rounded-md text-sm`}
                  style={{
                    ...styles.card,
                    ...styles.text,
                    borderColor: fieldErrors.date
                      ? '#ef4444'
                      : (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
                    borderWidth: '1px',
                  }}
                />
                {fieldErrors.date && (
                  <p className="text-xs mt-1 text-red-500">{fieldErrors.date}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1`} style={styles.text}>
                  Time
                </label>
                <div
                  className="inline-flex rounded-md w-full items-center"
                  style={{
                    ...styles.card,
                    ...styles.text,
                    border: `1px solid ${fieldErrors.time ? '#ef4444' : ((styles.link && styles.link.color) || styles.primaryButton.backgroundColor)}`,
                    height: 40,
                  }}
                >
                  <TimeCrownPicker
                    value={startTime || "20:00"}
                    onChange={(v) => {
                      setStartTime(v);
                      if (fieldErrors.time) setFieldErrors((p) => ({ ...p, time: undefined }));
                    }}
                    minuteStep={5}
                  />
                </div>
                {fieldErrors.time && (
                  <p className="text-xs mt-1 text-red-500">{fieldErrors.time}</p>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className={`block text-sm font-medium mb-1`} style={styles.text}>
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={`w-full h-10 px-3 border rounded-md text-sm`}
                  style={{
                    ...styles.card,
                    ...styles.text,
                    borderColor: (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
                    borderWidth: '1px',
                  }}
                >
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={150}>2.5 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right column: Location, Price, Courts */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1`} style={styles.text}>
                Location
              </label>
              <select
                value={form.location_id ?? ""}
                onChange={(e) =>
                  {
                    setForm((f) => ({ ...f, location_id: Number(e.target.value) }));
                    if (fieldErrors.location) setFieldErrors((p) => ({ ...p, location: undefined }));
                  }
                }
                aria-invalid={!!fieldErrors.location}
                className={`w-full px-3 py-2 border rounded-md text-sm`}
                style={{
                  ...styles.card,
                  ...styles.text,
                  borderColor: fieldErrors.location
                    ? '#ef4444'
                    : (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
                  borderWidth: '1px',
                }}
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
              {fieldErrors.location ? (
                <p className="text-xs mt-1 text-red-500">{fieldErrors.location}</p>
              ) : (
                <p className="text-xs mt-1" style={styles.secondaryText}>
                  Club where the game happens.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className={`block text-sm font-medium mb-1`} style={styles.text}>
                  Price
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 110"
                  value={Number(form.price) || 0}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, price: Number(e.target.value) }));
                    if (fieldErrors.price) setFieldErrors((p) => ({ ...p, price: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.price}
                  className={`w-full h-10 px-3 border rounded-md text-sm`}
                  style={{
                    ...styles.card,
                    ...styles.text,
                    borderColor: fieldErrors.price
                      ? '#ef4444'
                      : (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
                    borderWidth: '1px',
                  }}
                />
                {fieldErrors.price ? (
                  <p className="text-xs mt-1 text-red-500">{fieldErrors.price}</p>
                ) : (
                  <p className="text-xs mt-1" style={styles.secondaryText}>Amount in AED per player.</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1`} style={styles.text}>
                  Courts
                </label>
                <div
                  className="inline-flex items-center justify-between w-full h-10 px-2 border rounded-md"
                  style={{
                    ...styles.card,
                    ...styles.text,
                    borderColor: (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
                    borderWidth: '1px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    aria-label="Decrease courts"
                    disabled={(Number(form.courts) || 1) <= 1}
                    onClick={() => {
                      if ((Number(form.courts) || 1) <= 1) return;
                      setForm((f) => ({ ...f, courts: Math.max(1, (Number(f.courts) || 1) - 1) }));
                    }}
                    className="h-10 w-12 flex items-center justify-center text-xl"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      opacity: (Number(form.courts) || 1) <= 1 ? 0.5 : (styles.secondaryButton as any)?.opacity || 1,
                      cursor: (Number(form.courts) || 1) <= 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <span style={styles.text}>−</span>
                  </button>

                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={Number(form.courts) || 1}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value) || 1);
                      setForm((f) => ({ ...f, courts: val }));
                    }}
                    className="w-14 text-center bg-transparent outline-none"
                    style={styles.text}
                  />

                  <button
                    type="button"
                    aria-label="Increase courts"
                    onClick={() =>
                      setForm((f) => ({ ...f, courts: Math.max(1, (Number(f.courts) || 1) + 1) }))
                    }
                    className="h-10 w-12 flex items-center justify-center text-xl"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <span style={styles.text}>+</span>
                  </button>
                </div>
                <p className="text-xs mt-1" style={styles.secondaryText}>Number of courts reserved.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1`} style={styles.text}>
              Note
            </label>
            <input
              type="text"
              placeholder="Optional details for players"
              value={(form.note as string) || ""}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md text-sm`}
            style={{
              ...styles.card,
              ...styles.text,
              borderColor: (styles.link && styles.link.color) || styles.primaryButton.backgroundColor,
              borderWidth: '1px',
            }}
            />
            <p className="text-xs mt-1" style={styles.secondaryText}>
              Optional: extra info (parking, coach, etc.).
            </p>
          </div>

        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            style={loading ? { ...styles.primaryButton, opacity: 0.6 } : styles.primaryButton}
          >
            <span style={{ color: styles.primaryButton.color }}>
              {loading 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update booking" : "Add booking")}
            </span>
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ ...styles.secondaryButton, ...styles.border }}
          >
            <span style={styles.text}>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
