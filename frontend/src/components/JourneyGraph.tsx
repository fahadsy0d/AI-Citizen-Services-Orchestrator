import type { ReactNode } from "react"
import { Icon } from "../lib/icons"
import type { NodeStatus } from "../data/mock"

const statusStyle: Record<NodeStatus, { ring: string; icon: ReactNode; dot: string; label: string }> = {
  completed: { ring: "border-success bg-success-soft text-success", icon: <Icon.Check width={16} height={16} />, dot: "bg-success", label: "Completed" },
  "in-progress": { ring: "border-info bg-info-soft text-info", icon: <span className="h-2.5 w-2.5 rounded-full bg-info" />, dot: "bg-info", label: "In progress" },
  "action-required": { ring: "border-warning bg-warning-soft text-warning", icon: <Icon.Alert width={15} height={15} />, dot: "bg-warning", label: "Action required" },
  upcoming: { ring: "border-border-strong bg-surface text-muted-foreground", icon: <Icon.Circle width={14} height={14} />, dot: "bg-muted-foreground", label: "Upcoming" },
  "pending-external": { ring: "border-pending bg-pending-soft text-pending", icon: <Icon.Clock width={15} height={15} />, dot: "bg-pending", label: "Pending external" },
}

function Node({
  title,
  desc,
  status,
  department,
  action,
  time,
  compact,
}: {
  title: string
  desc: string
  status: NodeStatus
  department: string
  action?: string
  time?: string
  compact?: boolean
}) {
  const st = statusStyle[status]
  return (
    <div className={`group flex gap-3 rounded-2xl border bg-surface p-3.5 transition-all hover:shadow-[0_8px_30px_-16px_rgba(19,26,43,0.25)] ${
      status === "action-required" ? "border-warning/40" : "border-border"
    } ${compact ? "" : "w-full"}`}>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 ${st.ring}`}>{st.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-[14px] font-700 text-foreground">{title}</h4>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${st.ring}`}>
            {st.label}
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{desc}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="font-mono">{department}</span>
          {time ? <span>· {time}</span> : null}
          {action ? <span className="font-500 text-warning">· {action}</span> : null}
        </div>
      </div>
    </div>
  )
}

function Connector() {
  return (
    <div className="flex justify-center py-1.5">
      <Icon.ChevronD width={18} height={18} className="text-border-strong" />
    </div>
  )
}

export default function JourneyGraph({ nodes }: { nodes: typeof import("../data/mock").journey }) {
  const pre = nodes.filter((n) => !n.branch && ["goal", "understand", "eligibility", "docs"].includes(n.id))
  const branches = nodes.filter((n) => n.branch)
  const post = nodes.filter((n) => !n.branch && ["verify", "case", "next"].includes(n.id))

  return (
    <div className="mx-auto max-w-3xl">
      {pre.map((n, i) => (
        <div key={n.id}>
          <Node {...n} />
          {i < pre.length - 1 ? <Connector /> : null}
        </div>
      ))}

      {/* branch */}
      <div className="relative py-1.5">
        <div className="flex justify-center">
          <Icon.ChevronD width={18} height={18} className="text-border-strong" />
        </div>
      </div>
      <div className="relative">
        <div className="mb-2 flex items-center justify-center">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-mono uppercase tracking-wide text-primary">
            Services orchestrated in parallel
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {branches.map((n) => (
            <Node key={n.id} {...n} compact />
          ))}
        </div>
      </div>

      <div className="flex justify-center py-1.5">
        <Icon.ChevronD width={18} height={18} className="text-border-strong" />
      </div>
      <div className="mb-2 flex items-center justify-center">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-mono uppercase tracking-wide text-accent">
          Converge into one case
        </span>
      </div>

      {post.map((n, i) => (
        <div key={n.id}>
          <Node {...n} />
          {i < post.length - 1 ? <Connector /> : null}
        </div>
      ))}
    </div>
  )
}
