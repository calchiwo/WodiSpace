import type { ApodData } from "@/lib/apod"

interface ApodDetailProps {
  apod: ApodData
}

export function ApodDetail({ apod }: ApodDetailProps) {
  return (
    <div className="space-y-6">
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Explanation</h2>
        <p className="text-foreground/80 leading-relaxed text-sm">{apod.explanation}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm">
        <div>
          <h3 className="text-muted-foreground mb-1">Media Type</h3>
          <p className="text-foreground/70 capitalize">{apod.media_type}</p>
        </div>

        {apod.copyright && (
          <div>
            <h3 className="text-muted-foreground mb-1">Copyright</h3>
            <p className="text-foreground/70">{apod.copyright}</p>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <a
          href={`https://apod.nasa.gov/apod/ap${apod.date.replace(/-/g, "").slice(2)}.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm"
        >
          View on NASA APOD
          <span>→</span>
        </a>
      </div>
    </div>
  )
}
