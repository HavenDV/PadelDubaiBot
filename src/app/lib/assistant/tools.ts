import { supabaseAdmin } from "@/app/lib/supabase/admin";
import {
  MessageFormatter,
  REGISTRATION_BUTTONS,
  TelegramAPI,
} from "@/app/lib/telegram";
import type { Booking, Location, User } from "../../../../database.types";

export interface AddBookingArgs {
  location_id?: number | null;
  location_name?: string | null;
  date?: string | null; // YYYY-MM-DD
  time?: string | null; // HH:mm
  duration?: number | null; // minutes
  price?: number | null; // AED per player
  courts?: number | null;
  note?: string | null;
}

export interface AddBookingResult {
  success: boolean;
  booking_id?: number;
  error?: string;
  normalized?: Required<
    Pick<
      AddBookingArgs,
      "location_id" | "date" | "time" | "duration" | "price" | "courts"
    >
  > & { note: string | null };
}

export interface PublishBookingArgs {
  booking_id: number;
  chat?: number | string | null; // default to current chat if not provided
}

export interface PublishBookingResult {
  success: boolean;
  chat_id?: number;
  message_id?: number;
  error?: string;
}

function parseDateTimeToIso(
  dateStr: string,
  timeStr: string,
  durationMinutes: number
): { startISO: string; endISO: string } {
  // Interpret as local time; store as UTC ISO strings
  const [year, month, day] = dateStr.split("-").map((v) => parseInt(v, 10));
  const [hour, minute] = timeStr.split(":").map((v) => parseInt(v, 10));
  const start = new Date(
    year,
    (month || 1) - 1,
    day || 1,
    hour || 0,
    minute || 0,
    0,
    0
  );
  const end = new Date(
    start.getTime() + Math.max(30, durationMinutes || 90) * 60 * 1000
  );
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

export async function addBookingTool(
  args: AddBookingArgs
): Promise<AddBookingResult> {
  try {
    // Validate minimum fields
    const price =
      typeof args.price === "number" && args.price >= 0 ? args.price : null;
    const courts =
      typeof args.courts === "number" && args.courts >= 1 ? args.courts : null;
    const duration =
      typeof args.duration === "number" && args.duration > 0
        ? args.duration
        : 90;
    const date = (args.date || "").trim() || null;
    const time = (args.time || "").trim() || null;

    if (!date || !time) {
      return {
        success: false,
        error: "date (YYYY-MM-DD) and time (HH:mm) are required",
      };
    }
    if (price === null) return { success: false, error: "price is required" };
    if (courts === null) return { success: false, error: "courts is required" };

    // Resolve location
    let locationId: number | null = args.location_id ?? null;
    if (!locationId) {
      const name = (args.location_name || "").trim();
      if (!name)
        return {
          success: false,
          error: "location_id or location_name is required",
        };

      const { data: loc, error: locErr } = await supabaseAdmin
        .from("locations")
        .select("id")
        .ilike("name", name)
        .order("id")
        .limit(1)
        .maybeSingle();
      if (locErr || !loc?.id)
        return { success: false, error: "location not found" };
      locationId = loc.id;
    }

    const { startISO, endISO } = parseDateTimeToIso(date, time, duration);

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        start_time: startISO,
        end_time: endISO,
        location_id: locationId,
        price,
        courts,
        note: args.note ?? null,
      })
      .select("id")
      .single();

    if (error || !data?.id)
      return { success: false, error: "failed to create booking" };

    return {
      success: true,
      booking_id: data.id,
      normalized: {
        location_id: locationId,
        date,
        time,
        duration,
        price,
        courts,
        note: args.note ?? null,
      },
    };
  } catch (e) {
    console.error("addBookingTool error:", e);
    return { success: false, error: "internal error" };
  }
}

export async function publishBookingTool(
  args: PublishBookingArgs,
  fallbackChatId?: number
): Promise<PublishBookingResult> {
  try {
    const bookingId = args.booking_id;
    if (!bookingId || typeof bookingId !== "number")
      return { success: false, error: "booking_id is required" };

    // Load booking with location
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select(
        `*,
        locations:location_id (
          id,
          name,
          url
        )`
      )
      .eq("id", bookingId)
      .single();
    if (bookingError || !booking)
      return { success: false, error: "booking not found" };

    // Prepare message
    const dbBooking: Booking = {
      id: booking.id,
      location_id: booking.locations.id,
      start_time: booking.start_time,
      end_time: booking.end_time,
      price: booking.price,
      courts: booking.courts,
      note: booking.note,
      cancelled: booking.cancelled,
      created_at: null,
      updated_at: null,
    };
    const dbLocation: Location = {
      id: booking.locations.id,
      name: booking.locations.name,
      url: booking.locations.url,
      address: null,
      attributes: null,
      created_at: null,
      lat: null,
      lng: null,
      opening_hours: null,
      phone: null,
      place_id: null,
      plus_code: null,
      rating: null,
      updated_at: null,
      user_ratings_total: null,
      website: null,
    };
    const messageText = MessageFormatter.formatBookingMessage({
      booking: dbBooking,
      location: dbLocation,
      registrations: [],
    });

    const chatId: number | string | undefined = (args.chat ??
      fallbackChatId) as any;
    if (!chatId) return { success: false, error: "chat is required" };

    const res = await TelegramAPI.sendMessage({
      chat_id: chatId,
      text: messageText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: booking.cancelled
        ? undefined
        : {
            inline_keyboard: [
              ...REGISTRATION_BUTTONS,
              [
                {
                  text: "Open Settings",
                  url: "https://t.me/padel_dubai_bot?startapp",
                },
              ],
            ],
          },
    });

    if (!res?.ok || !res.result?.message_id) {
      return {
        success: false,
        error: res?.description || "failed to send telegram message",
      };
    }

    const messageId = res.result.message_id as number;
    const numericChatId = typeof chatId === "string" ? NaN : Number(chatId);

    try {
      await supabaseAdmin
        .from("messages")
        .insert({
          booking_id: bookingId,
          chat_id: isNaN(numericChatId) ? undefined : numericChatId,
          message_id: messageId,
        });
    } catch (e) {
      console.error("Failed to store message mapping:", e);
      // continue
    }

    return {
      success: true,
      chat_id: isNaN(numericChatId) ? undefined : numericChatId,
      message_id: messageId,
    };
  } catch (e) {
    console.error("publishBookingTool error:", e);
    return { success: false, error: "internal error" };
  }
}

export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "add_booking",
      description:
        "Create a new booking (game) in the database from structured details.",
      parameters: {
        type: "object",
        properties: {
          location_id: {
            type: ["number", "null"],
            description: "Existing location ID if known",
          },
          location_name: {
            type: ["string", "null"],
            description: "Location name if ID not known",
          },
          date: { type: ["string", "null"], description: "Date in YYYY-MM-DD" },
          time: {
            type: ["string", "null"],
            description: "Start time in HH:mm (24h)",
          },
          duration: {
            type: ["number", "null"],
            description: "Duration in minutes, default 90",
          },
          price: {
            type: ["number", "null"],
            description: "Price per player in AED",
          },
          courts: {
            type: ["number", "null"],
            description: "Number of courts booked",
          },
          note: {
            type: ["string", "null"],
            description: "Optional note to include in message",
          },
        },
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "publish_booking",
      description: "Publish an existing booking to a Telegram chat or channel.",
      parameters: {
        type: "object",
        properties: {
          booking_id: { type: "number" },
          chat: {
            type: ["number", "string", "null"],
            description:
              "Target chat ID or @username. Defaults to current chat.",
          },
        },
        required: ["booking_id"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];
