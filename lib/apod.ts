export interface ApodData {
  date: string
  explanation: string
  media_type: "image" | "video"
  title: string
  url: string
  copyright?: string
  hdurl?: string
}

export async function getApod(date: string): Promise<ApodData> {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY"
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch APOD data")
  }

  return response.json()
}
