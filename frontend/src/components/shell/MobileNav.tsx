import { Icon } from "../../lib/icons"
import type { View } from "../../lib/nav"

const items: { view: View; label: string; icon: keyof typeof Icon }[] = [
  { view: "home", label: "Home", icon: "Home" },
  { view: "services", label: "Services", icon: "Grid" },
  { view: "assistant", label: "Assistant", icon: "Sparkle" },
  { view: "documents", label: "Docs", icon: "Doc" },
  { view: "tracking", label: "Cases", icon: "Layers" },
]

export default function MobileNav({ view, go }: { view: View; go: (v: View) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-surface/95 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const I = Icon[item.icon]
        const active = view === item.view
        const isAI = item.view === "assistant"
        return (
          <button
            key={item.view}
            onClick={() => go(item.view)}
            className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-500"
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                isAI
                  ? "bg-primary text-white -mt-4 shadow-md"
                  : active
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              <I width={20} height={20} />
            </span>
            <span className={active && !isAI ? "text-primary" : "text-muted-foreground"}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
