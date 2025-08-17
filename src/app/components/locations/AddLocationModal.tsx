"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { Location, LocationInsert } from "../../../../database.types";
import { useDebouncedPlacesSearch, usePlaceDetails } from "@lib/hooks/api";
import { useCreateLocation, useUpdateLocation } from "@lib/hooks/db";
import MapEmbed from "./MapEmbed";

// Extended Location type for API responses that may have additional fields
type ExtendedLocation = Location & {
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  plus_code?: string | null;
  rating?: number | null;
  user_ratings_total?: number | null;
  opening_hours?: string[] | null;
  attributes?: unknown | null;
  place_id?: string | null;
  lat?: number | null;
  lng?: number | null;
};

// PlaceDetailsData is now imported from the hook

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingLocation?: ExtendedLocation | null; // when provided, modal works in edit mode
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onSuccess,
  editingLocation,
}: AddLocationModalProps) {
  const { theme } = useTelegram();
  // React Query mutations
  const createLocationMutation = useCreateLocation();
  const updateLocationMutation = useUpdateLocation();
  
  const loading = createLocationMutation.isPending || updateLocationMutation.isPending;
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  // Places search state
  const [query, setQuery] = useState<string>("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  
  // Use React Query hooks for Places API
  const { data: searchData, isLoading: searchLoading, isDebouncing } = useDebouncedPlacesSearch(query);
  const { data: placeDetails, isLoading: detailsLoading } = usePlaceDetails(selectedPlaceId);
  
  const suggestions = searchData?.candidates || [];

  const isEditMode = !!editingLocation;

  // Extra details state
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [plusCode, setPlusCode] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [userRatingsTotal, setUserRatingsTotal] = useState<string>("");
  const [openingHours, setOpeningHours] = useState<string>("");
  const [attributes, setAttributes] = useState<string>("");
  const [placeId, setPlaceId] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  

  const resetForm = () => {
    setName("");
    setUrl("");
    setError("");
    setQuery("");
    setSelectedPlaceId(undefined);
    setAddress("");
    setPhone("");
    setWebsite("");
    setPlusCode("");
    setRating("");
    setUserRatingsTotal("");
    setOpeningHours("");
    setAttributes("");
    setPlaceId("");
    setLat("");
    setLng("");
  };

  const handleSave = async () => {
    if (!name || !url) return;
    setError("");
    
    try {
      const payload: LocationInsert = { name, url };
      if (address) payload.address = address;
      if (phone) payload.phone = phone;
      if (website) payload.website = website;
      if (plusCode) payload.plus_code = plusCode;
      if (rating) payload.rating = Number(rating);
      if (userRatingsTotal) payload.user_ratings_total = Number(userRatingsTotal);
      if (openingHours) {
        try {
          payload.opening_hours = openingHours.trim().startsWith("[")
            ? JSON.parse(openingHours)
            : openingHours
                .split(/\n+/)
                .map((s) => s.trim())
                .filter(Boolean);
        } catch {
          payload.opening_hours = openingHours
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      if (attributes) {
        try {
          payload.attributes = JSON.parse(attributes);
        } catch {
          // ignore invalid attributes
        }
      }
      if (placeId) payload.place_id = placeId;
      if (lat) payload.lat = Number(lat);
      if (lng) payload.lng = Number(lng);

      if (isEditMode && editingLocation) {
        await updateLocationMutation.mutateAsync({
          id: editingLocation.id,
          updates: payload
        });
      } else {
        await createLocationMutation.mutateAsync(payload);
      }
      
      resetForm();
      onSuccess();
      onClose();
    } catch (e) {
      setError(isEditMode ? "Failed to update location" : "Failed to create location");
      console.error(e);
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
      setAddress(editingLocation.address || "");
      setPhone(editingLocation.phone || "");
      setWebsite(editingLocation.website || "");
      setPlusCode(editingLocation.plus_code || "");
      setRating((editingLocation.rating ?? "").toString());
      setUserRatingsTotal((editingLocation.user_ratings_total ?? "").toString());
      const oh = editingLocation.opening_hours;
      setOpeningHours(oh ? oh.join("\n") : "");
      const attrs = editingLocation.attributes;
      setAttributes(attrs ? JSON.stringify(attrs, null, 2) : "");
      setPlaceId(editingLocation.place_id || "");
      setLat((editingLocation.lat ?? "").toString());
      setLng((editingLocation.lng ?? "").toString());
      setError("");
      setQuery("");
    } else if (!isEditMode) {
      // Ensure add mode starts clean when opening
      if (name === "" && url === "") {
        setError("");
        setQuery("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode, editingLocation?.id]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedPlaceId(undefined);
    }
  }, [isOpen]);

  const selectPlace = (place_id: string) => {
    setSelectedPlaceId(place_id);
  };
  
  // Auto-populate form when place details are loaded
  useEffect(() => {
    if (placeDetails) {
      if (placeDetails.name) setName(placeDetails.name);
      if (placeDetails.url) setUrl(placeDetails.url);
      if (placeDetails.address) setAddress(placeDetails.address);
      if (placeDetails.phone) setPhone(placeDetails.phone);
      if (placeDetails.website) setWebsite(placeDetails.website);
      if (placeDetails.plus_code) setPlusCode(placeDetails.plus_code);
      if (typeof placeDetails.rating === "number") setRating(String(placeDetails.rating));
      if (typeof placeDetails.user_ratings_total === "number") setUserRatingsTotal(String(placeDetails.user_ratings_total));
      if (Array.isArray(placeDetails.opening_hours)) setOpeningHours(placeDetails.opening_hours.join("\n"));
      if (placeDetails.place_id) setPlaceId(placeDetails.place_id);
      if (typeof placeDetails.lat === "number") setLat(String(placeDetails.lat));
      if (typeof placeDetails.lng === "number") setLng(String(placeDetails.lng));
      setQuery("");
    }
  }, [placeDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg p-6 ${
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

        {/* Google Places Search */}
        <div className="mb-6 relative">
          <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Search Google Places</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type club name or address…"
            className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`}
          />
          {(searchLoading || isDebouncing) && <div className="text-xs text-gray-400 mt-1">{isDebouncing ? "Typing…" : "Searching…"}</div>}
          {suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 border rounded-md divide-y max-h-56 overflow-auto bg-white text-black shadow-lg">
              {suggestions.map((s) => (
                <button
                  key={s.place_id}
                  type="button"
                  onClick={() => selectPlace(s.place_id)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                >
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.formatted_address}</div>
                </button>
              ))}
            </div>
          )}
          {!searchLoading && !isDebouncing && query.trim() && suggestions.length === 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 border rounded-md bg-white text-black shadow-lg px-3 py-2 text-xs">
              No results. Try a different query.
            </div>
          )}
          {detailsLoading && <div className="text-xs text-gray-400 mt-1">Loading details…</div>}
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
          {(placeId || (lat && lng) || name || url) && (
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>
                Map preview
              </label>
              <div className="border rounded-md overflow-hidden">
                <MapEmbed
                  placeId={placeId || undefined}
                  name={name || undefined}
                  url={url || undefined}
                  lat={lat ? Number(lat) : undefined}
                  lng={lng ? Number(lng) : undefined}
                  height={220}
                />
              </div>
            </div>
          )}
        </div>

        {/* Details section */}
        <div className="mt-6 pt-4 border-t space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..."
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 ..."
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address"
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Plus code</label>
              <input type="text" value={plusCode} onChange={(e) => setPlusCode(e.target.value)} placeholder="e.g. J56C+42 Dubai"
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="4.5"
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Ratings count</label>
              <input type="number" min="0" value={userRatingsTotal} onChange={(e) => setUserRatingsTotal(e.target.value)} placeholder="123"
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Latitude</label>
              <input type="number" step="0.000001" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="25.2048"
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Longitude</label>
              <input type="number" step="0.000001" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="55.2708"
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Place ID</label>
              <input type="text" value={placeId} onChange={(e) => setPlaceId(e.target.value)} placeholder="ChIJ..."
                className={`w-full px-3 py-2 border rounded-md text-sm ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Opening hours (one per line or JSON array)</label>
              <textarea value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Attributes (JSON)</label>
              <textarea value={attributes} onChange={(e) => setAttributes(e.target.value)} rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${theme.cardBg || "border-gray-300 bg-white"} ${theme.text || "text-black"}`} />
              <p className="text-xs text-gray-400 mt-1">Optional flags like accessibility, payments, parking.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading || !name || !url}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loading || !name || !url ? "bg-gray-300 text-gray-500" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Location" : "Add Location")}
            </button>
            <button onClick={handleClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
