import { useState } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, SectionTitle, StatusBadge, Progress, ErrorState, PrototypeBadge } from "../components/ui"
import { NextBestAction } from "../components/domain"
import { applications } from "../data/mock"
import type { View } from "../lib/nav"

export default function Tracking({ go }: { go: (v: View) => void }) {
  const [extFailed, setExtFailed] = useState(true)

  const groups = [
    { title: "Completed", dot: "bg-success", items: ["Problem understood", "Eligibility checked", "Documents verified (4 of 5)"] },
    { title: "In progress", dot: "bg-info", items: ["Education support application"] },
    { title: "Pending", dot: "bg-pending", items: ["External income verification"] },
    { title: "Action required", dot: "bg-warning", items: ["Upload income certificate"] },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-500 text-accent">My Journey</p>
          <h1 className="font-display text-[26px] font-800 text-foreground">Family Support Journey</h1>
          <p className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
            <StatusBadge status="in-progress" /> · Last updated 2 hours ago · <span className="font-mono">CASE-2025-0912</span>
          </p>
        </div>
        <PrototypeBadge label="Prototype tracking" />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[13px] font-600 text-foreground">Overall progress</p>
          <span className="font-mono text-[13px] font-600 text-primary">3 of 6 stages</span>
        </div>
        <Progress value={55} tone="primary" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-wide text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${g.dot}`} />
                {g.title}
              </p>
              <ul className="space-y-1.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5 text-[13px] text-foreground/85">
                    <Icon.ChevronR width={13} height={13} className="mt-1 shrink-0 text-muted-foreground" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <NextBestAction onPrimary={() => go("documents")} onSecondary={() => go("journey")} />

      {/* External failure/resilient state */}
      {extFailed ? (
        <ErrorState
          title="Unable to connect to the external verification service"
          body="The issuing authority's system is temporarily unavailable (simulated integration). One pending step is affected — the rest of your journey continues normally."
          onRetry={() => setExtFailed(false)}
          onPortal={() => alert("Prototype: you'd be redirected to the official government portal, then returned here to continue.")}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-success-soft px-4 py-3 text-[13px] font-500 text-success animate-fade-up">
          <Icon.Check width={16} height={16} /> Reconnected — external verification has resumed.
        </div>
      )}

      {/* Applications */}
      <section>
        <SectionTitle action={<button onClick={() => go("services")} className="text-[13px] font-500 text-primary hover:underline">Explore services</button>}>
          My applications
        </SectionTitle>
        <div className="space-y-3">
          {applications.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[14.5px] font-600 text-foreground">{a.service}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 font-mono text-[11.5px] text-muted-foreground">{a.id} · {a.portal}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                    <Icon.Arrow width={13} height={13} className="text-warning" />
                    Next: <span className="font-500 text-foreground">{a.nextAction}</span>
                  </p>
                </div>
                <div className="text-right text-[11px] text-muted-foreground">
                  <p>Submitted: {a.submittedAt}</p>
                  <p>Updated: {a.lastUpdated}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
