import { useState } from "react"
import { Icon, Chakra } from "../lib/icons"
import { Button, Card, SectionTitle, StatusBadge, PrototypeBadge } from "../components/ui"
import { AIInput } from "../components/domain"
import { citizen, services, applications, documents, notifications } from "../data/mock"
import type { View } from "../lib/nav"

const quickCards: { view: View; title: string; sub: string; icon: keyof typeof Icon; tone: string }[] = [
  { view: "documents", title: "Documents", sub: "View your documents", icon: "Doc", tone: "bg-accent-soft text-accent" },
  { view: "tracking", title: "My Applications", sub: "Track your applications", icon: "Layers", tone: "bg-info-soft text-info" },
  { view: "services", title: "Services", sub: "Explore government services", icon: "Grid", tone: "bg-primary-soft text-primary" },
  { view: "grievances", title: "Grievances", sub: "Raise and track grievances", icon: "Megaphone", tone: "bg-saffron-soft text-saffron" },
]

const chips = ["Employment support", "Scholarships", "Business support", "Required documents", "Check application status"]

export default function Home({ go, onProblem }: { go: (v: View) => void; onProblem: (text: string) => void }) {
  const [q, setQ] = useState("")
  const readiness = 75

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 text-primary/[0.05]">
          <Chakra size={320} className="animate-chakra-spin" />
        </div>
        <div className="relative max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-[13px] font-500 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Good morning, {citizen.firstName}! 👋
          </p>
          <h1 className="font-display text-[26px] font-800 leading-[1.15] text-foreground sm:text-[34px]">
            Don&apos;t make citizens understand the government system.
            <span className="text-primary"> Make the system understand you.</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Tell us what you need, and we&apos;ll connect you to the right government services — discover, prepare for and navigate them, all in one place.
          </p>

          <div className="mt-6">
            <AIInput value={q} onChange={setQ} onSubmit={() => onProblem(q || "My father lost his job and our family income has decreased. I need financial and education support.")} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-500 text-muted-foreground">Try asking:</span>
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => onProblem(c)}
                className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((c) => {
            const I = Icon[c.icon]
            return (
              <Card key={c.view} interactive onClick={() => go(c.view)} className="p-4">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.tone}`}>
                  <I width={22} height={22} />
                </div>
                <h3 className="mt-3 font-display text-[15px] font-700 text-foreground">{c.title}</h3>
                <p className="text-[12.5px] text-muted-foreground">{c.sub}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-500 text-primary">
                  Open <Icon.ChevronR width={13} height={13} />
                </span>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Popular services */}
        <section className="lg:col-span-2">
          <SectionTitle action={<button onClick={() => go("services")} className="text-[13px] font-500 text-primary hover:underline">View all</button>}>
            Popular services
          </SectionTitle>
          <div className="space-y-3">
            {services.slice(0, 3).map((s) => {
              const IconMap = { grad: Icon.Grad, briefcase: Icon.Briefcase, rupee: Icon.Rupee }
              const I = IconMap[s.icon]
              return (
                <Card key={s.id} interactive onClick={() => go("services")} className="flex items-center gap-4 p-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <I width={21} height={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14.5px] font-600 text-foreground">{s.name}</h3>
                      <PrototypeBadge label="Prototype" />
                    </div>
                    <p className="truncate text-[12.5px] text-muted-foreground">{s.description}</p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="font-display text-lg font-700 text-success">{s.match}%</p>
                    <p className="text-[10px] text-muted-foreground">match</p>
                  </div>
                  <Icon.ChevronR width={18} height={18} className="shrink-0 text-muted-foreground" />
                </Card>
              )
            })}
          </div>

          {/* Recent activity */}
          <div className="mt-8">
            <SectionTitle>Recent activity</SectionTitle>
            <Card className="divide-y divide-border">
              {applications.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted-foreground">
                    <Icon.Layers width={17} height={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-600 text-foreground">{a.service}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{a.id} · {a.lastUpdated}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </Card>
          </div>
        </section>

        {/* Sidebar column */}
        <section className="space-y-6">
          {/* Readiness */}
          <Card className="p-5">
            <SectionTitle>Application readiness</SectionTitle>
            <div className="flex items-center gap-4">
              <div className="relative grid h-20 w-20 place-items-center">
                <svg width={80} height={80} className="-rotate-90">
                  <circle cx={40} cy={40} r={32} fill="none" stroke="var(--color-surface-muted)" strokeWidth={7} />
                  <circle cx={40} cy={40} r={32} fill="none" stroke="var(--color-accent)" strokeWidth={7} strokeLinecap="round" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - readiness / 100)} />
                </svg>
                <span className="absolute font-display text-lg font-800">{readiness}%</span>
              </div>
              <div>
                <p className="text-[13px] font-600 text-foreground">Almost ready</p>
                <p className="text-[12px] text-muted-foreground">1 document needs attention to continue your journey.</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-warning-soft px-3 py-2 text-[12.5px] text-warning">
              <Icon.Alert width={15} height={15} /> Income Certificate is missing
            </div>
            <Button size="sm" className="mt-3 w-full" onClick={() => go("documents")}>Get documents ready</Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Readiness indicator — not an official eligibility score.</p>
          </Card>

          {/* Notifications */}
          <Card className="p-5">
            <SectionTitle action={<button onClick={() => go("tracking")} className="text-[13px] font-500 text-primary hover:underline">All</button>}>
              Notifications
            </SectionTitle>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="flex gap-2.5">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.kind === "action" ? "bg-warning" : n.kind === "success" ? "bg-success" : "bg-info"}`} />
                  <div>
                    <p className="text-[13px] font-600 leading-snug text-foreground">{n.title}</p>
                    <p className="text-[12px] leading-snug text-muted-foreground">{n.body}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
