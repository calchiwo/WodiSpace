import { NextResponse } from "next/server";

type SpaceKnowledgeObject = {
  id: string;
  title: string;
  date: string;
  media: {
    type: string;
    url: string;
  };
  classification: {
    category: string;
    object_type: string;
  };
  physical_properties: {
    distance_from_earth: string;
    size: string;
    temperature: string;
    hazard_level: string;
  };
  science: {
    summary: string;
    explanation: string;
    formation_process: string;
    life_cycle_stage: string;
  };
  observation: {
    visibility_from_earth: string;
    best_viewing: string;
    observed_by: string[];
  };
  relationships: {
    part_of: string;
    related_objects: string[];
    astronomy_topics: string[];
  };
  ai_context: string;
};

export async function GET() {
  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("NASA fetch failed");

    const apod = await res.json();

    const explanation: string = apod.explanation || "";
    const title: string = apod.title || "Unknown Object";

    // --- SIMPLE INTELLIGENCE LAYER ---
    const lowerText = (title + " " + explanation).toLowerCase();

    const detectObjectType = () => {
      if (lowerText.includes("nebula")) return "Nebula";
      if (lowerText.includes("galaxy")) return "Galaxy";
      if (lowerText.includes("planet")) return "Planet";
      if (lowerText.includes("moon")) return "Moon";
      if (lowerText.includes("sun")) return "Star";
      if (lowerText.includes("cluster")) return "Star Cluster";
      return "Deep Space Object";
    };

    const objectType = detectObjectType();

    const categoryMap: Record<string, string> = {
      Nebula: "Deep Space Object",
      Galaxy: "Deep Space Object",
      "Star Cluster": "Deep Space Object",
      Star: "Stellar Object",
      Planet: "Planetary",
      Moon: "Planetary",
      "Deep Space Object": "Deep Space Object",
    };

    const buildKnowledgeObject: SpaceKnowledgeObject = {
      id: apod.date,
      title,
      date: apod.date,
      media: {
        type: apod.media_type,
        url: apod.url,
      },
      classification: {
        category: categoryMap[objectType],
        object_type: objectType,
      },
      physical_properties: {
        distance_from_earth: "Varies by object. Astronomical scale.",
        size: "Cosmic scale object",
        temperature: "Extreme environments typical in space",
        hazard_level: "No direct threat to Earth",
      },
      science: {
        summary: explanation.slice(0, 160) + "...",
        explanation,
        formation_process: "Driven by gravity, gas dynamics, and stellar evolution processes.",
        life_cycle_stage: "Part of cosmic structure and evolution.",
      },
      observation: {
        visibility_from_earth: "Observed via telescopes or space observatories",
        best_viewing: "Depends on hemisphere and season",
        observed_by: ["Ground Telescopes", "Hubble", "James Webb"],
      },
      relationships: {
        part_of: "Universe / Milky Way context",
        related_objects: [],
        astronomy_topics: [objectType, "Astrophysics", "Cosmic Evolution"],
      },
      ai_context: `${title} is a ${objectType} featured in NASA's Astronomy Picture of the Day. ${explanation.slice(
        0,
        300
      )}`,
    };

    return NextResponse.json(buildKnowledgeObject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate space knowledge object" },
      { status: 500 }
    );
  }
}