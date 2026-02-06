import { NextResponse } from "next/server";

type APODResponse = {
  title: string;
  explanation: string;
  url: string;
  media_type: string;
  date: string;
};

type ContentType =
  | "Astronomical Object"
  | "Space Mission"
  | "Instrument"
  | "Earth Observation"
  | "Event";

type SpaceKnowledgeObject = {
  id: string;
  canonical_name: string | null;
  aliases: string[];
  title: string;
  date: string;
  media: {
    type: "image" | "video";
    url: string;
  };
  content_type: ContentType;
  classification: {
    category: string;
    object_type: string;
  };
  science: {
    summary: string;
    explanation: string;
  };
  ai_context: string;
};

const NASA_ENDPOINT = "https://api.nasa.gov/planetary/apod";
const FETCH_TIMEOUT_MS = 8000;

function assertEnv(): string {
  const key = process.env.NASA_API_KEY;
  if (!key || key.trim() === "") {
    throw new Error("NASA_API_KEY is not defined");
  }
  return key;
}

function validateAPOD(data: unknown): APODResponse {
  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as any).title !== "string" ||
    typeof (data as any).explanation !== "string" ||
    typeof (data as any).url !== "string" ||
    typeof (data as any).media_type !== "string" ||
    typeof (data as any).date !== "string"
  ) {
    throw new Error("Invalid APOD response schema");
  }

  return data as APODResponse;
}

function validateMedia(mediaType: string, url: string): "image" | "video" {
  if (mediaType === "image") return "image";

  if (mediaType === "video") {
    const lowerUrl = url.toLowerCase();
    const isEmbeddable =
      lowerUrl.endsWith(".mp4") ||
      lowerUrl.includes("youtube.com") ||
      lowerUrl.includes("youtu.be") ||
      lowerUrl.includes("vimeo.com");

    if (isEmbeddable) return "video";
  }

  throw new Error(`Unsupported media type: ${mediaType}`);
}

function extractCanonicalNames(text: string): {
  canonical_name: string | null;
  aliases: string[];
} {
  const aliases: string[] = [];

  const messier = text.match(/\bM\s?\d{1,3}\b/i);
  const ngc = text.match(/\bNGC\s?\d{1,4}\b/i);

  if (messier) aliases.push(messier[0].toUpperCase().replace(/\s+/g, ""));
  if (ngc) aliases.push(ngc[0].toUpperCase().replace(/\s+/g, ""));

  return {
    canonical_name: aliases.length > 0 ? aliases[0] : null,
    aliases,
  };
}

function detectObjectType(text: string): string {
  const rules: { keyword: string; type: string }[] = [
    { keyword: "supernova", type: "Supernova Remnant" },
    { keyword: "nebula", type: "Nebula" },
    { keyword: "galaxy", type: "Galaxy" },
    { keyword: "star cluster", type: "Star Cluster" },
    { keyword: "cluster", type: "Star Cluster" },
    { keyword: "planet", type: "Planet" },
    { keyword: "moon", type: "Moon" },
    { keyword: "comet", type: "Comet" },
  ];

  for (const rule of rules) {
    if (text.includes(rule.keyword)) return rule.type;
  }

  return "Unknown";
}

function classifyContent(text: string): ContentType {
  const priorityRules: { test: (t: string) => boolean; type: ContentType }[] =
    [
      {
        test: (t) =>
          /\bmission\b|\brover\b|\bsatellite\b/.test(t),
        type: "Space Mission",
      },
      {
        test: (t) =>
          /\btelescope\b|\bobservatory\b|\binstrument\b/.test(t),
        type: "Instrument",
      },
      {
        test: (t) =>
          /\beclipse\b|\btransit\b|\bevent\b/.test(t),
        type: "Event",
      },
      {
        test: (t) =>
          /\baurora\b|\batmosphere\b|\bearth observation\b/.test(t),
        type: "Earth Observation",
      },
    ];

  for (const rule of priorityRules) {
    if (rule.test(text)) return rule.type;
  }

  return "Astronomical Object";
}

function summarize(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > 100) {
    return truncated.slice(0, lastPeriod + 1);
  }

  return truncated.trimEnd() + "...";
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const requestId = crypto.randomUUID();

  try {
    const apiKey = assertEnv();

    const response = await fetchWithTimeout(
      `${NASA_ENDPOINT}?api_key=${apiKey}`,
      FETCH_TIMEOUT_MS
    );

    if (!response.ok) {
      console.error("APOD upstream error", {
        requestId,
        status: response.status,
      });
      return NextResponse.json(
        { error: "Upstream APOD service failure" },
        { status: 502 }
      );
    }

    const raw = await response.json();
    const apod = validateAPOD(raw);

    const mediaType = validateMedia(apod.media_type, apod.url);

    const combined = `${apod.title} ${apod.explanation}`.toLowerCase();

    const { canonical_name, aliases } = extractCanonicalNames(
      `${apod.title} ${apod.explanation}`
    );

    const objectType = detectObjectType(combined);
    const contentType = classifyContent(combined);

    const knowledgeObject: SpaceKnowledgeObject = {
      id: apod.date,
      canonical_name,
      aliases,
      title: apod.title,
      date: apod.date,
      media: {
        type: mediaType,
        url: apod.url,
      },
      content_type: contentType,
      classification: {
        category:
          contentType === "Astronomical Object"
            ? "Deep Space Object"
            : contentType,
        object_type: objectType,
      },
      science: {
        summary: summarize(apod.explanation, 220),
        explanation: apod.explanation,
      },
      ai_context: summarize(
        `${apod.title} is categorized as ${contentType}. ${
          objectType !== "Unknown"
            ? `It is identified as a ${objectType}. `
            : ""
        }${apod.explanation}`,
        350
      ),
    };

    return NextResponse.json(knowledgeObject);
  } catch (error: any) {
    const isAbort = error?.name === "AbortError";

    console.error("Space Knowledge API failure", {
      message: error?.message,
      type: error?.name,
    });

    return NextResponse.json(
      {
        error: isAbort
          ? "Upstream APOD request timed out"
          : "Internal space knowledge processing failure",
      },
      { status: isAbort ? 504 : 500 }
    );
  }
}