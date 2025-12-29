"use client"

import { useState } from "react"
import Image from "next/image"
import type { ApodData } from "@/lib/apod"
import { DatePicker } from "./date-picker"
import { ApodDetail } from "./apod-detail"

export function BrowseClient() {
  const [apod, setApod] = useState<ApodData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDateChange = async (date: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/apod?date=${date}`)

      if (!response.ok) {
        setError("No image available for this date")
        setLoading(false)
        return
      }

      const data = await response.json()
      setApod(data)
    } catch (err) {
      setError("Failed to fetch image data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <DatePicker onDateChange={handleDateChange} initialDate={new Date().toISOString().split("T")[0]} />

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}

      {apod && !loading && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-light tracking-tight text-pretty">{apod.title}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(apod.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-lg overflow-hidden bg-card border border-border">
            {apod.media_type === "image" ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={apod.url || "/placeholder.svg"}
                  alt={apod.title}
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src={apod.url}
                  title={apod.title}
                  frameBorder="0"
                  allow="autoplay"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          <ApodDetail apod={apod} />
        </div>
      )}

      {!apod && !loading && (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Select a date to view an image</div>
        </div>
      )}
    </div>
  )
}
