import { Navbar } from "@/components/navbar"
import { BrowseClient } from "@/components/browse-client"

export const metadata = {
  title: "Browse APOD: WodiSpace",
  description: "Browse NASA Astronomy Picture of the Day by date",
}

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-light tracking-tight">Browse by Date</h1>
          <p className="text-foreground/60 text-sm">
            Explore the NASA Astronomy Picture of the Day archive. Dates available from June 16, 1995 onwards.
          </p>
        </div>
        <BrowseClient />
      </main>
    </div>
  )
}
