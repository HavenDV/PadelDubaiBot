"use client";

import React from "react";

interface MapEmbedProps {
  name: string;
  url?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Lightweight Google Maps embed builder.
 * Prefers Google Maps Embed API when NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY is provided.
 * Falls back to a generic output=embed URL using name or url.
 */
export default function MapEmbed({ name, url, width = "100%", height = 260, className }: MapEmbedProps) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

  const buildSrc = () => {
    const query = name?.trim() || url || "";
    if (key) {
      // Use Embed API search mode; works with text queries reliably
      return `https://www.google.com/maps/embed/v1/search?key=${encodeURIComponent(
        key
      )}&q=${encodeURIComponent(query)}`;
    }
    // Fallback: generic embed via output=embed
    // Prefer name query to avoid unexpected redirect behavior of short links
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

