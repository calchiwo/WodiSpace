import { Navbar } from "@/components/navbar"
import { ApodDisplay } from "@/components/apod-display"
import { getApod } from "@/lib/apod"

export default async function Home() {
  const today = new Date().toISOString().split("T")[0]

  const apod = await getApod(today)

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ApodDisplay apod={apod} initialDate={today} />
      </main>
    </div>
  )
}

