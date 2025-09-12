import { supabaseAdmin } from "@/app/lib/supabase/admin";
import {
  MessageFormatter,
  REGISTRATION_BUTTONS,
  TelegramAPI,
} from "@/app/lib/telegram";
import type { Booking, Location } from "../../../../database.types";

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

export interface UpdateUserSkillArgs {
  skill: "E" | "D-" | "D" | "D+" | "D++" | "C-" | "C" | "C+";
  user_id?: number; // target user; defaults to caller
  username?: string | null; // admins can specify @username instead of user_id
}

export interface UpdateUserSkillResult {
  success: boolean;
  user_id?: number;
  new_skill?: string;
  error?: string;
}

export interface ToolCallerContext {
  userId: number | undefined;
  firstName?: string | null;
  username?: string | null;
  isAdmin: boolean;
}

function parseDateTimeToIso(
  dateStr: string,
  timeStr: string,
  durationMinutes: number
): { startISO: string; endISO: string } {
  // Interpret user-provided date/time as Dubai time (UTC+4), then convert to UTC ISO
  const [year, month, day] = dateStr.split("-").map((v) => parseInt(v, 10));
  const [hour, minute] = timeStr.split(":").map((v) => parseInt(v, 10));
  const dubaiUtcOffsetHours = 4; // Asia/Dubai UTC+4, no DST
  const startUtcMs = Date.UTC(
    year,
    (month || 1) - 1,
    day || 1,
    (hour || 0) - dubaiUtcOffsetHours,
    minute || 0,
    0,
    0
  );
  const endUtcMs = startUtcMs + Math.max(30, durationMinutes || 90) * 60 * 1000;
  return {
    startISO: new Date(startUtcMs).toISOString(),
    endISO: new Date(endUtcMs).toISOString(),
  };
}

export async function addBookingTool(
  args: AddBookingArgs,
  caller?: ToolCallerContext
): Promise<AddBookingResult> {
  try {
    if (!caller?.isAdmin) {
      return { success: false, error: "Admins only" };
    }
    // Validate minimum fields with tighter constraints
    const allowedDurations = [60, 90, 120, 150, 180];
    const durationRaw =
      typeof args.duration === "number" ? args.duration : null;
    const duration = durationRaw === null ? 90 : durationRaw;
    if (!allowedDurations.includes(duration)) {
      return {
        success: false,
        error: "Invalid duration. Allowed: 60, 90, 120, 150, 180",
      };
    }

    const courts = typeof args.courts === "number" ? args.courts : null;
    if (courts === null || courts < 1 || courts > 4) {
      return { success: false, error: "Invalid courts. Allowed range: 1-4" };
    }

    const price =
      typeof args.price === "number" ? Math.round(args.price) : null;
    if (price === null || price < 0) {
      return {
        success: false,
        error: "Invalid price. Must be a non-negative integer",
      };
    }

    const date = (args.date || "").trim() || null;
    const time = (args.time || "").trim() || null;

    if (!date || !time) {
      return {
        success: false,
        error: "date (YYYY-MM-DD) and time (HH:mm) are required",
      };
    }

    // Resolve location
    let locationId: number | null = args.location_id ?? null;
    if (!locationId) {
      const name = (args.location_name || "").trim();
      if (!name) {
        return {
          success: false,
          error: "location_id or location_name is required",
        };
      }

      // Load all locations and match like smart paste
      const { data: allLocations, error: locListErr } = await supabaseAdmin
        .from("locations")
        .select("id,name")
        .order("name");
      if (locListErr)
        return { success: false, error: "Failed to load locations" };

      const norm = name.toLowerCase();
      const candidates = allLocations || [];
      // 1) exact (case-insensitive)
      let matched = candidates.find((l) => l.name.toLowerCase() === norm);
      // 2) includes either way
      if (!matched)
        matched = candidates.find(
          (l) =>
            l.name.toLowerCase().includes(norm) ||
            norm.includes(l.name.toLowerCase())
        );
      // 3) simple punctuation-insensitive equality
      if (!matched) {
        const strip = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
        const normStripped = strip(name);
        matched = candidates.find((l) => strip(l.name) === normStripped);
      }

      if (!matched) return { success: false, error: "location not found" };
      locationId = matched.id;
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
        note: args.note ?? null ? String(args.note).slice(0, 200) : null,
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
  fallbackChatId: number,
  caller?: ToolCallerContext
): Promise<PublishBookingResult> {
  try {
    if (!caller?.isAdmin) {
      return { success: false, error: "Admins only" };
    }
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

    const chatParam =
      args.chat ?? (fallbackChatId > 0 ? fallbackChatId : undefined);
    const chatId: number | string | undefined =
      typeof chatParam === "number" || typeof chatParam === "string"
        ? chatParam
        : undefined;
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
      if (!isNaN(numericChatId)) {
        await supabaseAdmin.from("messages").insert({
          booking_id: bookingId,
          chat_id: numericChatId,
          message_id: messageId,
        });
      }
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

export async function updateUserSkillTool(
  args: UpdateUserSkillArgs,
  caller?: ToolCallerContext
): Promise<UpdateUserSkillResult> {
  try {
    const allowed = ["E", "D-", "D", "D+", "D++", "C-", "C", "C+"] as const;
    const skill = args.skill as UpdateUserSkillArgs["skill"];
    if (!allowed.includes(skill)) {
      return { success: false, error: "Invalid skill level" };
    }

    let targetId: number | null = null;

    if (caller?.isAdmin && args.username) {
      const uname = args.username.replace(/^@/, "").trim();
      if (uname.length > 0) {
        const { data: userByName, error: selByNameErr } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("username", uname)
          .maybeSingle();
        if (selByNameErr) return { success: false, error: "Database error" };
        if (userByName?.id) targetId = userByName.id;
      }
    }

    if (!targetId) {
      if (args.user_id && caller?.isAdmin) targetId = args.user_id;
      else if (args.user_id && caller && args.user_id === caller.userId)
        targetId = args.user_id;
      else if (caller?.userId) targetId = caller.userId;
    }

    if (!targetId) return { success: false, error: "No target user" };
    if (
      !caller?.isAdmin &&
      args.user_id &&
      caller &&
      args.user_id !== caller.userId
    ) {
      return { success: false, error: "You can only change your own skill" };
    }

    // Ensure user exists; create minimal record if missing
    const { data: existing, error: selErr } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", targetId)
      .maybeSingle();

    if (selErr) {
      return { success: false, error: "Database error" };
    }

    if (!existing) {
      const firstName = caller?.firstName ?? `User ${targetId}`;
      const usernameVal = caller?.username ?? null;
      const { error: insErr } = await supabaseAdmin.from("users").insert({
        id: targetId,
        first_name: firstName,
        username: usernameVal,
        skill_level: skill,
      });
      if (insErr) return { success: false, error: "Failed to create user" };
      return { success: true, user_id: targetId, new_skill: skill };
    }

    const { error: updErr } = await supabaseAdmin
      .from("users")
      .update({ skill_level: skill })
      .eq("id", targetId);
    if (updErr) return { success: false, error: "Failed to update skill" };

    return { success: true, user_id: targetId, new_skill: skill };
  } catch (e) {
    console.error("updateUserSkillTool error:", e);
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
        required: [
          "location_id",
          "location_name",
          "date",
          "time",
          "duration",
          "price",
          "courts",
          "note",
        ],
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
        required: ["booking_id", "chat"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "update_user_skill",
      description:
        "Update Telegram user's skill level. Non-admins can update only their own skill.",
      parameters: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            enum: ["E", "D-", "D", "D+", "D++", "C-", "C", "C+"],
          },
          user_id: {
            type: ["number", "null"],
            description: "Target user id; admins only. Defaults to caller.",
          },
          username: {
            type: ["string", "null"],
            description: "Admins: @username target instead of user_id",
          },
        },
        required: ["skill", "user_id", "username"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];
