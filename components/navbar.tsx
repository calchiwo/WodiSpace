import Link from "next/link"

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-accent-foreground">◆</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">WodiSpace</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Today
          </Link>
          <Link href="/browse" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Browse
          </Link>
          <Link href="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}
