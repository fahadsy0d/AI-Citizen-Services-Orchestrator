import { Icon } from "../lib/icons"
import { Card, SectionTitle, PrototypeBadge } from "../components/ui"
import { admin } from "../data/mock"

export default function Admin() {
  const toneClasses: Record<string, string> = {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }
  const maxDemand = Math.max(...admin.demand.map((d) => d.value))

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-500 text-accent">Operations view</p>
          <h1 className="font-display text-[26px] font-800 text-foreground">Admin insights</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">
            Aggregate, non-identifying signals to spot process bottlenecks. This is not the citizen interface and shows no personal data.
          </p>
        </div>
        <PrototypeBadge label="Prototype numbers" />
      </div>

      {/* stat tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {admin.stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-[12px] text-muted-foreground">{s.label}</p>
            <p className={`mt-1 font-display text-[28px] font-800 ${toneClasses[s.tone]}`}>{s.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
              <Icon.Trend width={13} height={13} /> {s.delta}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* service demand */}
        <Card className="p-5">
          <SectionTitle>Service demand by category</SectionTitle>
          <div className="space-y-3">
            {admin.demand.map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="text-foreground">{d.label}</span>
                  <span className="font-mono font-600 text-muted-foreground">{d.value.toLocaleString()}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${(d.value / maxDemand) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Contextual information only — not a measure of scheme authenticity.</p>
        </Card>

        {/* stage duration / drop-off funnel */}
        <Card className="p-5">
          <SectionTitle>Journey stages — completion &amp; duration</SectionTitle>
          <div className="space-y-3">
            {admin.stages.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-[12.5px] text-foreground">{s.label}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-lg bg-surface-muted">
                  <div className="flex h-full items-center justify-end rounded-lg bg-accent px-2 transition-all duration-700" style={{ width: `${s.pct}%` }}>
                    <span className="text-[10px] font-600 text-white">{s.pct}%</span>
                  </div>
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[11px] text-muted-foreground">{s.days}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-warning-soft px-3 py-2 text-[12.5px] text-warning">
            <Icon.Alert width={15} height={15} /> Biggest friction: Documents stage (income certificates) — drives most drop-off.
          </div>
        </Card>
      </div>

      {/* integration health */}
      <Card className="p-5">
        <SectionTitle>Integration health (simulated)</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "National Scholarship Portal", status: "operational", val: "99.4% uptime" },
            { name: "State Revenue Dept.", status: "degraded", val: "Intermittent delays" },
            { name: "DigiLocker", status: "operational", val: "Document match 96%" },
          ].map((i) => (
            <div key={i.name} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-600 text-foreground">{i.name}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${i.status === "operational" ? "bg-success" : "bg-warning"}`} />
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">{i.val}</p>
              <p className={`mt-1 text-[11px] font-500 ${i.status === "operational" ? "text-success" : "text-warning"}`}>
                {i.status === "operational" ? "Operational" : "Degraded — failover active"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">No individual citizen data is exposed in this view. All figures are prototype/simulated.</p>
      </Card>
    </div>
  )
}
