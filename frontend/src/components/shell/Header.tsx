import { useState } from "react"
import { Icon, Chakra } from "../../lib/icons"
import { citizen, languages, notifications as notifs } from "../../data/mock"
import type { View } from "../../lib/nav"

export default function Header({
  go,
  onNotifications,
  unread,
}: {
  go: (v: View) => void
  onNotifications: () => void
  unread: number
}) {
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState("English")

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:px-7">
      {/* mobile brand */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[#e9c96b]">
          <Chakra size={18} />
        </div>
      </div>

      <div className="hidden md:block">
        <h1 className="font-display text-[15px] font-700 leading-tight text-foreground">
          AI Citizen Services Orchestrator
        </h1>
        <p className="text-[11px] text-muted-foreground">
          Make the government system understand the citizen.
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        {/* language */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-2 text-[13px] font-500 text-foreground transition-colors hover:border-primary"
          >
            <Icon.Globe width={16} height={16} className="text-muted-foreground" />
            <span className="hidden sm:inline">{lang}</span>
            <Icon.ChevronD width={14} height={14} className="text-muted-foreground" />
          </button>
          {langOpen ? (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 animate-fade-up rounded-xl border border-border bg-surface p-1.5 shadow-lg">
                <p className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wide text-muted-foreground">Choose language</p>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.label)
                      setLangOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-surface-muted ${
                      lang === l.label ? "text-primary font-600" : "text-foreground"
                    }`}
                  >
                    <span>{l.native}</span>
                    {lang === l.label ? <Icon.Check width={15} height={15} /> : null}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* notifications */}
        <button
          onClick={onNotifications}
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border-strong text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Icon.Bell width={18} height={18} />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-saffron px-1 text-[10px] font-600 text-white">
              {unread}
            </span>
          ) : null}
        </button>

        {/* profile */}
        <button
          onClick={() => go("profile")}
          className="flex items-center gap-2.5 rounded-full border border-border-strong py-1 pl-1 pr-3 transition-colors hover:border-primary"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-chakra text-[13px] font-600 text-white">
            {citizen.initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[13px] font-600 leading-none text-foreground">{citizen.firstName}</span>
            <span className="block text-[11px] leading-none text-muted-foreground">{citizen.state}</span>
          </span>
        </button>
      </div>
    </header>
  )
}

export { notifs }
