import type { ReactNode } from "react"
import { Icon } from "../lib/icons"

/* ---------------- Button ---------------- */
export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  icon,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "soft" | "danger"
  size?: "sm" | "md" | "lg"
  className?: string
  type?: "button" | "submit"
  icon?: ReactNode
  disabled?: boolean
}) {
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
    secondary: "bg-surface text-foreground border border-border-strong hover:border-primary hover:text-primary",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-muted",
    soft: "bg-primary-soft text-primary hover:bg-[#dde2f3]",
    danger: "bg-danger-soft text-danger hover:bg-[#f7d9d6]",
  }
  const sizes: Record<string, string> = {
    sm: "text-[13px] px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-[15px] px-5 py-3 gap-2",
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}

/* ---------------- Card ---------------- */
export function Card({
  children,
  className = "",
  as: As = "div",
  onClick,
  interactive,
}: {
  children: ReactNode
  className?: string
  as?: any
  onClick?: () => void
  interactive?: boolean
}) {
  return (
    <As
      onClick={onClick}
      className={`rounded-2xl bg-surface border border-border ${
        interactive ? "transition-all duration-200 hover:border-border-strong hover:shadow-[0_8px_30px_-12px_rgba(19,26,43,0.18)] cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </As>
  )
}

/* ---------------- Section heading ---------------- */
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <h2 className="font-display text-lg font-700 text-foreground">{children}</h2>
      {action}
    </div>
  )
}

/* ---------------- Tag / pill ---------------- */
export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    muted: "bg-surface-muted text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent",
    saffron: "bg-saffron-soft text-saffron",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide font-500 ${tones[tone] || tones.muted}`}>
      {children}
    </span>
  )
}

/* ---------------- Prototype / Simulated badge ---------------- */
export function PrototypeBadge({ label = "Prototype data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-saffron/50 bg-saffron-soft px-2.5 py-1 text-[11px] font-mono font-500 text-saffron">
      <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
      {label}
    </span>
  )
}

/* ---------------- Official source ---------------- */
export function OfficialSource({ source, updated }: { source: string; updated?: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
      <Icon.Shield width={15} height={15} className="text-accent shrink-0" />
      <span>
        Official source · <span className="text-foreground font-500">{source}</span>
        {updated ? <span className="text-muted-foreground"> · updated {updated}</span> : null}
      </span>
    </div>
  )
}

/* ---------------- Trust badge ---------------- */
export function TrustBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-accent-soft/60 border border-accent/15 px-3.5 py-3 text-[13px] text-foreground">
      <Icon.Lock width={16} height={16} className="text-accent mt-0.5 shrink-0" />
      <p className="leading-relaxed">{children}</p>
    </div>
  )
}

/* ---------------- Status badge ---------------- */
const statusMap: Record<string, { label: string; cls: string; dot: string }> = {
  completed: { label: "Completed", cls: "bg-success-soft text-success", dot: "bg-success" },
  verified: { label: "Verified", cls: "bg-success-soft text-success", dot: "bg-success" },
  available: { label: "Available", cls: "bg-info-soft text-info", dot: "bg-info" },
  "in-progress": { label: "In progress", cls: "bg-info-soft text-info", dot: "bg-info" },
  "action-required": { label: "Action required", cls: "bg-warning-soft text-warning", dot: "bg-warning" },
  "needs-verification": { label: "Needs verification", cls: "bg-warning-soft text-warning", dot: "bg-warning" },
  missing: { label: "Missing", cls: "bg-danger-soft text-danger", dot: "bg-danger" },
  expired: { label: "Expired", cls: "bg-danger-soft text-danger", dot: "bg-danger" },
  "pending-external": { label: "Pending external", cls: "bg-pending-soft text-pending", dot: "bg-pending" },
  pending: { label: "Pending", cls: "bg-pending-soft text-pending", dot: "bg-pending" },
  upcoming: { label: "Upcoming", cls: "bg-surface-muted text-muted-foreground", dot: "bg-muted-foreground" },
  draft: { label: "Draft", cls: "bg-surface-muted text-muted-foreground", dot: "bg-muted-foreground" },
}

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] || statusMap.upcoming
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-500 ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

/* ---------------- Progress bar ---------------- */
export function Progress({ value, tone = "primary", label }: { value: number; tone?: "primary" | "accent" | "success" | "warning"; label?: string }) {
  const tones: Record<string, string> = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
  }
  return (
    <div>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
          <span>{label}</span>
          <span className="font-mono font-600 text-foreground">{value}%</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ${tones[tone]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

/* ---------------- Step indicator ---------------- */
export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-mono text-muted-foreground">
        Step {current} of {total}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < current ? "w-6 bg-primary" : "w-3 bg-border-strong"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------- States: Loading / Empty / Error ---------------- */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/50 px-6 py-14 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-surface-muted text-muted-foreground">
        <Icon.Search />
      </div>
      <h3 className="font-display text-base font-600 text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function ErrorState({
  title,
  body,
  onRetry,
  onPortal,
}: {
  title: string
  body: string
  onRetry?: () => void
  onPortal?: () => void
}) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger-soft/50 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
          <Icon.Alert width={18} height={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-600 text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          <p className="mt-2 text-[13px] font-500 text-accent">Your progress has been saved. You can retry later.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry ? (
              <Button size="sm" variant="secondary" icon={<Icon.Refresh width={15} height={15} />} onClick={onRetry}>
                Retry
              </Button>
            ) : null}
            <Button size="sm" variant="ghost">Continue later</Button>
            {onPortal ? (
              <Button size="sm" variant="ghost" icon={<Icon.External width={15} height={15} />} onClick={onPortal}>
                Open official portal
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
