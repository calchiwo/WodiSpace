import { NextResponse } from "next/server";

// 24 hour cache TTL (APOD updates daily)
const CACHE_TTL = 1000 * 60 * 60 * 24;

let cachedData: SpaceKnowledgeObject | null = null;
let cacheTimestamp = 0;

type APODResponse = {
  title?: string;
  explanation?: string;
  url?: string;
  media_type?: string;
  date?: string;
};

type SpaceKnowledgeObject = {
  id: string;
  canonical_name: string | null;
  aliases: string[];
  title: string;
  date: string;
  media: {
    type: string;
    url: string;
  };
  content_type: "Astronomical Object" | "Space Mission" | "Instrument" | "Earth Observation" | "Event";
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

// Basic schema validation
function validateAPOD(data: any): data is APODResponse {
  return (
    typeof data === "object" &&
    typeof data.title === "string" &&
    typeof data.explanation === "string" &&
    typeof data.url === "string" &&
    typeof data.media_type === "string" &&
    typeof data.date === "string"
  );
}

// Media filtering
function isSupportedMedia(mediaType: string, url: string): boolean {
  if (mediaType === "image") return true;
  if (mediaType === "video" && url.includes("youtube")) return false;
  return false;
}

// Basic object type detection
function detectObjectType(text: string): string {
  if (text.includes("nebula")) return "Nebula";
  if (text.includes("galaxy")) return "Galaxy";
  if (text.includes("planet")) return "Planet";
  if (text.includes("moon")) return "Moon";
  if (text.includes("cluster")) return "Star Cluster";
  if (text.includes("supernova")) return "Supernova Remnant";
  if (text.includes("comet")) return "Comet";
  return "Unknown";
}

// Content classification layer
function classifyContent(text: string): SpaceKnowledgeObject["content_type"] {
  if (text.includes("mission") || text.includes("rover") || text.includes("satellite"))
    return "Space Mission";

  if (text.includes("telescope") || text.includes("observatory") || text.includes("instrument"))
    return "Instrument";

  if (text.includes("earth") || text.includes("aurora") || text.includes("atmosphere"))
    return "Earth Observation";

  if (text.includes("eclipse") || text.includes("transit") || text.includes("event"))
    return "Event";

  return "Astronomical Object";
}

// Basic canonical object extraction
// Detects Messier and NGC patterns
function extractCanonicalNames(text: string): {
  canonical_name: string | null;
  aliases: string[];
} {
  const messierMatch = text.match(/m\s?\d{1,3}/i);
  const ngcMatch = text.match(/ngc\s?\d{1,4}/i);

  const aliases: string[] = [];

  if (messierMatch) aliases.push(messierMatch[0].toUpperCase().replace(" ", ""));
  if (ngcMatch) aliases.push(ngcMatch[0].toUpperCase().replace(" ", ""));

  return {
    canonical_name: aliases.length > 0 ? aliases[0] : null,
    aliases,
  };
}

export async function GET() {
  try {
    // In-memory cache
    if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
      return NextResponse.json(cachedData);
    }

    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch NASA APOD");
    }

    const apod = await res.json();

    // Validation layer
    if (!validateAPOD(apod)) {
      return NextResponse.json(
        { error: "Invalid APOD response schema" },
        { status: 502 }
      );
    }

    // Media filtering
    if (!isSupportedMedia(apod.media_type, apod.url)) {
      return NextResponse.json(
        { error: "Unsupported media type" },
        { status: 415 }
      );
    }

    const combinedText = (apod.title + " " + apod.explanation).toLowerCase();

    const objectType = detectObjectType(combinedText);
    const contentType = classifyContent(combinedText);
    const { canonical_name, aliases } = extractCanonicalNames(
      apod.title + " " + apod.explanation
    );

    const knowledgeObject: SpaceKnowledgeObject = {
      id: apod.date,
      canonical_name,
      aliases,
      title: apod.title,
      date: apod.date,
      media: {
        type: apod.media_type,
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
        summary: apod.explanation.slice(0, 200) + "...",
        explanation: apod.explanation,
      },
      ai_context: `${apod.title} is categorized as ${contentType}. ${
        objectType !== "Unknown" ? `It is identified as a ${objectType}. ` : ""
      }${apod.explanation.slice(0, 300)}`,
    };

    // Cache result
    cachedData = knowledgeObject;
    cacheTimestamp = Date.now();

    return NextResponse.json(knowledgeObject);
  } catch (error) {
    console.error("Space Knowledge API Error:", error);
    return NextResponse.json(
      { error: "Internal space knowledge generation failure" },
      { status: 500 }
    );
  }
}