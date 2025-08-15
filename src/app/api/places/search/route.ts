import { NextRequest, NextResponse } from "next/server";

// Type for Google Places search result
interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
}

export async function GET(req: NextRequest) {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q) {
      return NextResponse.json({ error: "Missing q" }, { status: 400 });
    }

    // Prefer Text Search for broader keyword queries like "Padel"
    const defaultLat = 25.2048; // Dubai center-ish
    const defaultLng = 55.2708;
    const radius = 60000; // 60km
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      q
    )}&language=en&region=ae&location=${defaultLat},${defaultLng}&radius=${radius}&key=${encodeURIComponent(
      key
    )}`;
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch places" },
        { status: 502 }
      );
    }
    const json = await res.json();
    const results = Array.isArray(json?.results) ? json.results : [];
    const candidates = results.slice(0, 12).map((c: GooglePlaceResult) => ({
      place_id: c.place_id as string,
      name: c.name as string,
      formatted_address: c.formatted_address as string,
      lat: c.geometry?.location?.lat ?? null,
      lng: c.geometry?.location?.lng ?? null,
    }));
    return NextResponse.json({ success: true, candidates });
  } catch (e) {
    console.error("Places search error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
