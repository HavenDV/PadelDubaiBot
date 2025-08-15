import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface LocationExtractRequest {
  text: string;
}

interface LocationData {
  name?: string | null;
  url?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body: LocationExtractRequest = await req.json();

    if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (body.text.length > 2000) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

    const locationSchema = {
      type: "object",
      properties: {
        name: { type: ["string", "null"], description: "Club or venue name" },
        url: {
          type: ["string", "null"],
          description: "Google Maps link or official website URL",
        },
      },
      required: ["name", "url"],
      additionalProperties: false,
    } as const;

    // If we don't have OpenAI configured, we cannot extract reliably
    if (!openai) {
      return NextResponse.json({ error: "Auto-fill is not available: missing AI configuration" }, { status: 400 });
    }

    const systemPrompt = `You extract only padel/tennis club location info from text.
Always return strict JSON for fields: name, url. If URL not found, leave it null.
Never include extra commentary, only JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.text },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "location_data",
          schema: locationSchema,
          strict: true,
        },
      },
    });

    const content = completion.choices?.[0]?.message?.content;
    const extracted: LocationData = content ? JSON.parse(content) : {};

    // Post-validate and lightly normalize
    const result: LocationData = {};
    if (extracted.name && extracted.name.trim()) {
      result.name = extracted.name.trim().slice(0, 100);
    }

    if (extracted.url && extracted.url.trim()) {
      const urlStr = extracted.url.trim();
      // Basic URL validation
      try {
        const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
        if (["http:", "https:"].includes(parsed.protocol)) {
          result.url = parsed.toString();
        }
      } catch {
        // ignore invalid URL
      }
    }

    // If name found but URL missing, fallback to a Google Maps search URL for that name
    if (result.name && !result.url) {
      result.url = `https://www.google.com/maps/search/${encodeURIComponent(result.name)}`;
    }

    if (!result.name && !result.url) {
      return NextResponse.json(
        { error: "No location details found in text" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Location extraction error:", err);
    return NextResponse.json(
      { error: "Failed to extract location information" },
      { status: 500 }
    );
  }
}
