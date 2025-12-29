import { type NextRequest, NextResponse } from "next/server"
import { getApod } from "@/lib/apod"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  try {
    const apod = await getApod(date)
    return NextResponse.json(apod)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch APOD data" }, { status: 500 })
  }
}
