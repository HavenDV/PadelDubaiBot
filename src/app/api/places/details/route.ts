import { NextRequest, NextResponse } from "next/server";

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
    const placeId = searchParams.get("place_id")?.trim();
    if (!placeId) {
      return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=formatted_address,geometry,name,international_phone_number,website,plus_code,opening_hours,rating,user_ratings_total,url,place_id&language=en&region=ae&key=${encodeURIComponent(
      key
    )}`;
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch place details" },
        { status: 502 }
      );
    }
    const json = await res.json();
    const r = json?.result;
    if (!r) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }
    const data = {
      name: r.name ?? null,
      url: r.url ?? null,
      address: r.formatted_address ?? null,
      phone: r.international_phone_number ?? null,
      website: r.website ?? null,
      plus_code: r.plus_code?.global_code ?? null,
      rating: typeof r.rating === "number" ? r.rating : null,
      user_ratings_total:
        typeof r.user_ratings_total === "number" ? r.user_ratings_total : null,
      opening_hours: r.opening_hours?.weekday_text ?? null,
      attributes: null as string[] | null, // can extend later
      place_id: r.place_id ?? placeId,
      lat: r.geometry?.location?.lat ?? null,
      lng: r.geometry?.location?.lng ?? null,
    };
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("Place details error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
