import { useEffect, useState } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, StatusBadge, PrototypeBadge, OfficialSource, Progress, Tag } from "./ui"
import type { Service, CitizenDoc } from "../data/mock"

/* ---------------- AI Input with voice states ---------------- */
export function AIInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe what you need help with…",
  size = "lg",
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder?: string
  size?: "lg" | "md"
}) {
  const [voice, setVoice] = useState<"idle" | "listening" | "processing">("idle")

  function startVoice() {
    setVoice("listening")
    setTimeout(() => setVoice("processing"), 1900)
    setTimeout(() => {
      setVoice("idle")
      onChange("My father lost his job and our family income has decreased. I need financial and education support.")
    }, 3000)
  }

  return (
    <div className="relative">
      <div
        className={`flex items-end gap-2 rounded-2xl border bg-surface p-2.5 shadow-[0_10px_40px_-24px_rgba(19,26,43,0.4)] transition-colors ${
          voice === "listening" ? "border-accent" : "border-border-strong focus-within:border-primary"
        }`}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={size === "lg" ? 2 : 1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          className={`min-w-0 flex-1 resize-none bg-transparent px-2.5 py-2 outline-none placeholder:text-muted-foreground ${
            size === "lg" ? "text-[15px]" : "text-sm"
          }`}
        />
        <button
          onClick={startVoice}
          aria-label="Voice input"
          className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
            voice === "listening" ? "bg-accent text-white" : "bg-surface-muted text-muted-foreground hover:text-primary"
          }`}
        >
          <Icon.Mic width={19} height={19} />
          {voice === "listening" ? <span className="absolute inset-0 animate-ping rounded-xl bg-accent/40" /> : null}
        </button>
        <Button size="lg" className="h-11 shrink-0" icon={<Icon.Send width={17} height={17} />} onClick={onSubmit}>
          <span className="hidden sm:inline">Get help</span>
        </Button>
      </div>

      {voice !== "idle" ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2 text-[13px] font-500 text-accent animate-fade-up">
          {voice === "listening" ? (
            <>
              <span className="flex items-end gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="w-1 rounded-full bg-accent" style={{ height: 14, animation: "listen-wave 0.9s infinite", animationDelay: `${i * 0.1}s` }} />
                ))}
              </span>
              Listening… speak now
            </>
          ) : (
            <>
              <Icon.Sparkle width={15} height={15} /> Processing your voice input…
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

/* ---------------- Service card ---------------- */
export function ServiceCard({
  s,
  onEligibility,
  onDocs,
}: {
  s: Service
  onEligibility?: () => void
  onDocs?: () => void
}) {
  const IconMap = { grad: Icon.Grad, briefcase: Icon.Briefcase, rupee: Icon.Rupee }
  const I = IconMap[s.icon]
  const matchTone = s.match >= 80 ? "text-success" : s.match >= 65 ? "text-info" : "text-warning"
  return (
    <Card className="flex flex-col p-5" interactive>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <I width={22} height={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-[16px] font-700 leading-tight text-foreground">{s.name}</h3>
            {s.prototype ? <PrototypeBadge label="Prototype" /> : null}
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {s.department} · <Tag tone="muted">{s.category}</Tag>
          </p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{s.description}</p>

      <div className="mt-3 rounded-xl border border-border bg-surface-muted/50 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide text-primary">
          <Icon.Sparkle width={13} height={13} /> Why this was recommended
        </p>
        <p className="mt-1 text-[12.5px] leading-snug text-foreground/85">{s.why}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className={`font-display text-2xl font-800 ${matchTone}`}>{s.match}%</p>
          <p className="text-[11px] text-muted-foreground">AI match — preliminary</p>
        </div>
        <div className="flex-1">
          <Progress value={s.match} tone={s.match >= 80 ? "success" : "primary"} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><Icon.Doc width={14} height={14} /> {s.requiredDocs} documents</span>
        <span className="flex items-center gap-1.5"><Icon.Layers width={14} height={14} /> {s.method}</span>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <OfficialSource source={s.source} updated={s.sourceUpdated} />
        <p className="mt-1.5 text-[11px] italic text-muted-foreground">Official eligibility is determined by the respective authority.</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onEligibility}>Check eligibility</Button>
        <Button size="sm" variant="secondary" onClick={onDocs}>View documents</Button>
        <Button size="sm" variant="ghost">View details</Button>
      </div>
    </Card>
  )
}

/* ---------------- Document card ---------------- */
export function DocumentCard({ d, onAction }: { d: CitizenDoc; onAction?: (act: string) => void }) {
  const isProblem = d.status === "missing" || d.status === "expired"
  return (
    <Card className={`p-4 ${isProblem ? "border-danger/25" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isProblem ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent"}`}>
          <Icon.Doc width={19} height={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[14px] font-600 text-foreground">{d.name}</h3>
            <StatusBadge status={d.status} />
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {d.type}
            {d.issuer ? ` · ${d.issuer}` : ""}
            {d.updated ? ` · ${d.updated}` : ""}
          </p>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            Required for: <span className="text-foreground/80">{d.requiredFor.join(", ")}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.status === "missing" ? (
              <Button size="sm" icon={<Icon.Upload width={15} height={15} />} onClick={() => onAction?.("upload")}>Upload document</Button>
            ) : d.status === "expired" ? (
              <Button size="sm" variant="danger" icon={<Icon.Refresh width={15} height={15} />} onClick={() => onAction?.("replace")}>Replace</Button>
            ) : (
              <Button size="sm" variant="secondary" icon={<Icon.Eye width={15} height={15} />} onClick={() => onAction?.("view")}>View</Button>
            )}
            {d.status === "available" ? <Button size="sm" variant="ghost">Verify</Button> : null}
            <Button size="sm" variant="ghost">Why needed?</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ---------------- Next best action ---------------- */
export function NextBestAction({
  title = "Upload your Income Certificate to continue.",
  detail = "This is the one step blocking your Education Support application and external verification.",
  onPrimary,
  onSecondary,
}: {
  title?: string
  detail?: string
  onPrimary?: () => void
  onSecondary?: () => void
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground">
      <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.12]">
        <Icon.Sparkle width={130} height={130} />
      </div>
      <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/70">
        <Icon.Sparkle width={14} height={14} /> Next best action
      </p>
      <h3 className="mt-1.5 font-display text-lg font-700 leading-snug">{title}</h3>
      <p className="mt-1 max-w-md text-[13px] text-white/75">{detail}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="md" variant="soft" className="!bg-white !text-primary hover:!bg-white/90" icon={<Icon.Upload width={16} height={16} />} onClick={onPrimary}>
          Upload document
        </Button>
        <Button size="md" variant="ghost" className="!text-white hover:!bg-white/10" onClick={onSecondary}>
          View journey
        </Button>
      </div>
    </div>
  )
}

/* ---------------- Animated readiness meter ---------------- */
export function ReadinessRing({ value }: { value: number }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 150)
    return () => clearTimeout(t)
  }, [value])
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid h-28 w-28 place-items-center">
      <svg width={112} height={112} className="-rotate-90">
        <circle cx={56} cy={56} r={r} fill="none" stroke="var(--color-surface-muted)" strokeWidth={9} />
        <circle
          cx={56}
          cy={56}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * shown) / 100}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl font-800 text-foreground">{shown}%</p>
        <p className="text-[10px] text-muted-foreground">ready</p>
      </div>
    </div>
  )
}
