import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@lib/supabase/admin";

interface BookingExtractRequest {
  text: string;
}

interface BookingData {
  location_name?: string | null;
  location_id?: number | null;
  date?: string | null;
  time?: string | null;
  duration?: number | null;
  price?: number | null;
  courts?: number | null;
  note?: string | null;
}

interface ProcessedBookingData
  extends Omit<BookingData, "location_name" | "location_id"> {
  location_id?: number;
  location_name?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingExtractRequest = await req.json();

    // Validate request
    if (
      !body.text ||
      typeof body.text !== "string" ||
      body.text.trim().length === 0
    ) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Prevent abuse - limit text length
    if (body.text.length > 2000) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Fetch recent bookings and locations for AI learning
    let recentBookings: BookingData[] = [];
    let availableLocations: string[] = [];

    try {
      // Get last 3 bookings as examples
      const { data: bookingsData, error: bookingsError } = await supabaseAdmin
        .from("bookings")
        .select(
          `
          start_time,
          end_time,
          price,
          courts,
          note,
          locations:location_id (
            id,
            name
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(3);

      if (!bookingsError && bookingsData) {
        recentBookings = bookingsData.map((booking) => ({
          location_name: booking.locations?.name ?? null,
          location_id: booking.locations?.id ?? null,
          date: booking.start_time
            ? new Date(booking.start_time).toISOString().split("T")[0]
            : null,
          time: booking.start_time
            ? new Date(booking.start_time).toTimeString().substring(0, 5)
            : null,
          duration:
            booking.start_time && booking.end_time
              ? Math.round(
                  (new Date(booking.end_time).getTime() -
                    new Date(booking.start_time).getTime()) /
                    (1000 * 60)
                )
              : null,
          price: booking.price,
          courts: booking.courts,
          note: booking.note,
        }));
      }

      // Get available locations with IDs
      const { data: locationsData, error: locationsError } = await supabaseAdmin
        .from("locations")
        .select("id, name")
        .order("name");

      if (!locationsError && locationsData) {
        availableLocations = locationsData.map(
          (loc) => `${loc.name} (ID: ${loc.id})`
        );
      }
    } catch (fetchError) {
      console.error("Error fetching examples:", fetchError);
      // Continue without examples if fetch fails
    }

    // Specialized schema for padel booking extraction only
    // With strict: true, we need to be more careful about the schema structure
    const bookingSchema = {
      type: "object",
      properties: {
        location_name: {
          type: ["string", "null"],
          description: "Padel club or venue name",
        },
        location_id: {
          type: ["number", "null"],
          description:
            "Location ID if it matches an available location exactly",
        },
        date: {
          type: ["string", "null"],
          description: "Date in YYYY-MM-DD format",
        },
        time: {
          type: ["string", "null"],
          description: "Start time in HH:MM format (24-hour)",
        },
        duration: {
          type: ["number", "null"],
          description: "Duration in minutes (60, 90, 120, 150, or 180 only)",
        },
        price: {
          type: ["number", "null"],
          description: "Price in AED as a number (e.g., 110)",
        },
        courts: {
          type: ["number", "null"],
          description: "Number of padel courts (1-4)",
        },
        note: {
          type: ["string", "null"],
          description: "Additional details about the padel game",
        },
      },
      required: [
        "location_name",
        "location_id",
        "date",
        "time",
        "duration",
        "price",
        "courts",
        "note",
      ],
      additionalProperties: false,
    };

    // Build enhanced prompt with examples and available locations
    let systemPrompt = `You are a specialized assistant for extracting padel booking information only. 
Extract booking details from text about padel games. ALWAYS return valid JSON in the specified schema format.
If the text is clearly about padel/tennis bookings, extract the relevant fields.
If the text is NOT about sports bookings, return an empty JSON object: {}
Never return plain text explanations - only JSON.

LOCATION MATCHING: When extracting location_name, also check if it matches any of the available locations below. If you find an exact or very close match, include the location_id in your response.`;

    // Add available locations for better matching
    if (availableLocations.length > 0) {
      systemPrompt += `\n\nAVAILABLE LOCATIONS (prefer these exact names when possible):
${availableLocations.map((loc) => `- ${loc}`).join("\n")}`;
    }

    // Add recent booking examples for learning patterns
    if (recentBookings.length > 0) {
      systemPrompt += `\n\nRECENT BOOKING EXAMPLES (learn from these patterns for price and note formatting):`;
      recentBookings.forEach((booking, index) => {
        systemPrompt += `\n\nExample ${index + 1}:`;
        if (booking.location_name && booking.location_id) {
          systemPrompt += `\n- Location: "${booking.location_name}" (ID: ${booking.location_id})`;
        } else if (booking.location_name) {
          systemPrompt += `\n- Location: "${booking.location_name}"`;
        }
        if (booking.price !== undefined && booking.price !== null)
          systemPrompt += `\n- Price: ${booking.price}`;
        if (booking.duration)
          systemPrompt += `\n- Duration: ${booking.duration} minutes`;
        if (booking.courts) systemPrompt += `\n- Courts: ${booking.courts}`;
        if (booking.note) systemPrompt += `\n- Note: "${booking.note}"`;
      });

      systemPrompt += `\n\nReturn price as a number in AED (e.g., 110).`;
      systemPrompt += `\nWhen selecting locations, prefer exact matches from the available locations list above.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: body.text,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "padel_booking_data",
          schema: bookingSchema,
          strict: true,
        },
      },
    });

    const messageContent = response.choices[0]?.message?.content;

    // With strict: true, the response is guaranteed to be valid JSON following our schema
    const extractedData: BookingData = messageContent
      ? JSON.parse(messageContent)
      : {};

    // Validate extracted data for booking context
    if (!extractedData || Object.keys(extractedData).length === 0) {
      return NextResponse.json(
        {
          error: "No booking information found in text",
        },
        { status: 400 }
      );
    }

    // Additional validation for booking-specific constraints
    const validatedData: BookingData = {};

    if (extractedData.location_name && extractedData.location_name !== null) {
      validatedData.location_name = extractedData.location_name.substring(
        0,
        100
      );
    }

    if (
      extractedData.date &&
      extractedData.date !== null &&
      /^\d{4}-\d{2}-\d{2}$/.test(extractedData.date)
    ) {
      validatedData.date = extractedData.date;
    }

    if (
      extractedData.time &&
      extractedData.time !== null &&
      /^\d{2}:\d{2}$/.test(extractedData.time)
    ) {
      validatedData.time = extractedData.time;
    }

    if (
      extractedData.duration &&
      extractedData.duration !== null &&
      [60, 90, 120, 150, 180].includes(extractedData.duration)
    ) {
      validatedData.duration = extractedData.duration;
    }

    if (typeof extractedData.price === "number" && extractedData.price >= 0) {
      validatedData.price = extractedData.price;
    }

    if (
      extractedData.courts &&
      extractedData.courts !== null &&
      extractedData.courts >= 1 &&
      extractedData.courts <= 4
    ) {
      validatedData.courts = extractedData.courts;
    }

    if (extractedData.note && extractedData.note !== null) {
      validatedData.note = extractedData.note.substring(0, 200);
    }

    if (
      extractedData.location_id &&
      extractedData.location_id !== null &&
      extractedData.location_id > 0
    ) {
      validatedData.location_id = extractedData.location_id;
    }

    // Handle location matching and creation
    const processedData: ProcessedBookingData = {
      ...validatedData,
      location_id: validatedData.location_id ?? undefined,
    };

    if (extractedData.location_name && extractedData.location_name !== null) {
      try {
        // If AI provided a location_id, try to use it directly
        if (extractedData.location_id && extractedData.location_id !== null) {
          const { data: locationById, error: locationByIdError } =
            await supabaseAdmin
              .from("locations")
              .select("*")
              .eq("id", extractedData.location_id)
              .single();

          if (!locationByIdError && locationById) {
            // AI found the correct location by ID
            processedData.location_id = locationById.id;
            processedData.location_name = locationById.name;
          } else {
            // Location ID not found, fall back to name matching
            console.log(
              `AI provided location_id ${extractedData.location_id} not found, falling back to name matching`
            );
          }
        }

        // If we don't have a location_id yet, try name-based matching
        if (!processedData.location_id) {
          // First, try to find existing location
          const { data: locations, error: locationsError } = await supabaseAdmin
            .from("locations")
            .select("*");

          if (locationsError) {
            console.error("Error fetching locations:", locationsError);
          } else if (locations) {
            // Try to match location by name (fuzzy matching)
            const matchedLocation = locations.find(
              (loc) =>
                loc.name
                  .toLowerCase()
                  .includes(extractedData.location_name!.toLowerCase()) ||
                extractedData
                  .location_name!.toLowerCase()
                  .includes(loc.name.toLowerCase()) ||
                loc.name.toLowerCase() ===
                  extractedData.location_name!.toLowerCase()
            );

            if (matchedLocation) {
              // Found existing location
              processedData.location_id = matchedLocation.id;
              processedData.location_name = matchedLocation.name;
            } else {
              // No match found, create new location
              const { data: newLocation, error: createError } =
                await supabaseAdmin
                  .from("locations")
                  .insert({
                    name: extractedData.location_name.substring(0, 100),
                    url: `https://www.google.com/maps/search/${encodeURIComponent(
                      extractedData.location_name
                    )}`,
                  })
                  .select()
                  .single();

              if (createError) {
                console.error("Error creating location:", createError);
                // Keep the location_name for manual selection
                processedData.location_name = extractedData.location_name;
              } else if (newLocation) {
                // Successfully created new location
                processedData.location_id = newLocation.id;
                processedData.location_name = newLocation.name;
              }
            }
          }
        }
      } catch (locationError) {
        console.error("Location processing error:", locationError);
        // Keep the location_name for manual selection
        processedData.location_name = extractedData.location_name;
      }
    }

    // If price is missing but we have a location, try to infer from latest booking at that location
    try {
      if (
        (processedData.price === undefined || processedData.price === null) &&
        processedData.location_id
      ) {
        const { data: lastPriceRow, error: lastPriceError } =
          await supabaseAdmin
            .from("bookings")
            .select("price")
            .eq("location_id", processedData.location_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!lastPriceError && typeof lastPriceRow?.price === "number") {
          processedData.price = lastPriceRow.price as number;
        }
      }
    } catch (priceFallbackError) {
      console.warn("Price fallback lookup failed:", priceFallbackError);
    }

    return NextResponse.json({
      success: true,
      data: processedData,
    });
  } catch (err: unknown) {
    console.error("Booking extraction error:", err);
    return NextResponse.json(
      {
        error: "Failed to extract booking information",
      },
      { status: 500 }
    );
  }
}
