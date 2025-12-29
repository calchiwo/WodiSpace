import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "About: WodiSpace",
  description: "Learn about WodiSpace and NASA's Astronomy Picture of the Day",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-light tracking-tight">About WodiSpace</h1>
            <p className="text-foreground/60">Understanding the cosmos through NASA's most iconic images</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-light">What is APOD?</h2>
            <p className="text-foreground/80 leading-relaxed">
              NASA's Astronomy Picture of the Day (APOD) is a daily feature that showcases one astronomical image and
              provides an explanation written by a professional astronomer. Each image is accompanied by detailed
              scientific context, making it an invaluable resource for learning about our universe.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Since 1995, APOD has been capturing the imagination of millions of people worldwide with images of
              galaxies, nebulae, planets, stars, and the cosmos. Whether it's a distant galaxy billions of light-years
              away or a phenomenon occurring in our own solar system, APOD brings the wonders of the universe to your
              screen.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-light">Why WodiSpace?</h2>
            <p className="text-foreground/80 leading-relaxed">
              WodiSpace was created with a simple mission: to present NASA's Astronomy Picture of the Day in a calm,
              clear, and respectful way. I believe that scientific knowledge should be accessible, beautifully
              presented, and free from distraction.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              This application strips away unnecessary elements, allowing the images and scientific explanations to
              speak for themselves. My focus is on clarity, intentional design, and the pure wonder of astronomical
              discovery.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-light">Data Source</h2>
            <p className="text-foreground/80 leading-relaxed">
              All images and data presented in WodiSpace come directly from NASA's official Astronomy Picture of the Day
              archive via their public API. I maintain complete attribution to NASA and the original image creators and
              photographers.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              WodiSpace does not generate, modify, or create any content. I simply present NASA's authentic
              astronomical data in a thoughtful interface.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-light">Design Philosophy</h2>
            <p className="text-foreground/80 leading-relaxed">
              Every design decision in WodiSpace reflects my commitment to:
            </p>
            <ul className="space-y-2 text-foreground/80 pl-4">
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>
                  <strong>Clarity:</strong> Clear typography and generous spacing ensure readability
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>
                  <strong>Respect:</strong> I respect both the images and the audience with a serious, intentional
                  design
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>
                  <strong>Minimalism:</strong> No unnecessary animations, gradients, or decorative elements
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>
                  <strong>Science:</strong> A dark theme that complements astronomical imagery
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              WodiSpace is an independent project created to celebrate NASA's Astronomy Picture of the Day. All data is
              sourced from NASA's public API and presented with proper attribution.
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
