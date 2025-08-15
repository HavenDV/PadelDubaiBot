"use client";

import React from "react";

interface MapEmbedProps {
  name?: string;
  url?: string;
  placeId?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  width?: number | string;
  height?: number | string;
  className?: string;
  zoom?: number;
}

/**
 * Lightweight Google Maps embed builder.
 * Prefers Google Maps Embed API when NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY is provided.
 * Falls back to a generic output=embed URL using name or url.
 */
export default function MapEmbed({ name, url, placeId, lat, lng, width = "100%", height = 260, className, zoom = 16 }: MapEmbedProps) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

  const buildSrc = () => {
    const hasCoords = lat !== undefined && lat !== null && lng !== undefined && lng !== null && `${lat}` !== "" && `${lng}` !== "";
    if (key) {
      if (placeId) {
        return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=place_id:${encodeURIComponent(placeId)}`;
      }
      if (hasCoords) {
        return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap`;
      }
      const query = (name?.trim() || url || "").toString();
      return `https://www.google.com/maps/embed/v1/search?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}`;
    }
    // Fallback without key
    if (hasCoords) {
      return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    }
    const query = (name?.trim() || url || "").toString();
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  };

  const src = buildSrc();
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  );
}
