import type { ReactNode } from "react"
import { Icon } from "../../lib/icons"
import { Button } from "../ui"
import { notifications } from "../../data/mock"

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  const kindIcon: Record<string, ReactNode> = {
    success: <Icon.Check width={16} height={16} className="text-success" />,
    action: <Icon.Alert width={16} height={16} className="text-warning" />,
    info: <Icon.Bell width={16} height={16} className="text-info" />,
  }
  const kindBg: Record<string, string> = {
    success: "bg-success-soft",
    action: "bg-warning-soft",
    info: "bg-info-soft",
  }
  return (
    <>
      <div className="fixed inset-0 z-40 animate-fade-in bg-foreground/10" onClick={onClose} />
      <div className="fixed right-3 top-[64px] z-50 w-[calc(100%-1.5rem)] max-w-sm animate-fade-up rounded-2xl border border-border bg-surface p-2 shadow-2xl lg:right-6">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-display text-sm font-700">Notifications</h3>
          <button onClick={onClose} className="text-[12px] text-muted-foreground hover:text-foreground">Mark all read</button>
        </div>
        <div className="space-y-1">
          {notifications.map((n) => (
            <div key={n.id} className={`flex gap-3 rounded-xl p-3 ${n.unread ? "bg-surface-muted/60" : ""}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${kindBg[n.kind]}`}>{kindIcon[n.kind]}</div>
              <div className="min-w-0">
                <p className="text-[13px] font-600 text-foreground">{n.title}</p>
                <p className="text-[12px] leading-snug text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[11px] font-mono text-muted-foreground">{n.time}</p>
              </div>
              {n.unread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-saffron" /> : null}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function ConsentModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  if (!open) return null
  const rows = [
    { label: "What information will be used", value: "Name, state, household income range, student education level" },
    { label: "Why it is required", value: "To assess preliminary eligibility for education support" },
    { label: "Which service receives it", value: "National Scholarship Portal (simulated integration)" },
    { label: "What happens next", value: "A guided application is prepared for your review before anything is sent" },
    { label: "Duration", value: "Stored for this journey only · revocable anytime" },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg animate-fade-up rounded-t-2xl border border-border bg-surface p-6 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
            <Icon.Shield width={22} height={22} />
          </div>
          <div>
            <h3 className="font-display text-lg font-700">Review &amp; give consent</h3>
            <p className="text-[13px] text-muted-foreground">You stay in control. Nothing is shared until you confirm.</p>
          </div>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border">
          {rows.map((r) => (
            <div key={r.label} className="px-4 py-3">
              <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">{r.label}</p>
              <p className="mt-0.5 text-[13px] text-foreground">{r.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-saffron-soft px-3 py-2.5 text-[12px] text-saffron">
          <Icon.Alert width={15} height={15} />
          Prototype — this is a simulated consent flow. No real data is shared.
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>Not now</Button>
          <Button icon={<Icon.Check width={17} height={17} />} onClick={onConfirm}>
            Confirm &amp; continue
          </Button>
        </div>
      </div>
    </div>
  )
}
