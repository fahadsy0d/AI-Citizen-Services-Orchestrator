import { Icon } from "../lib/icons"
import { Button, Card, SectionTitle, StatusBadge, Tag } from "../components/ui"
import { citizen, documents, applications, languages } from "../data/mock"
import type { View } from "../lib/nav"

export default function Profile({ go }: { go: (v: View) => void }) {
  const cases = {
    Active: 2,
    Completed: 1,
    Draft: 1,
    Pending: 1,
  }
  const consents = [
    { service: "National Scholarship Portal", data: "Income range, education level", purpose: "Eligibility assessment", duration: "This journey" },
    { service: "e-Shram", data: "Name, state", purpose: "Registration", duration: "Until revoked" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      {/* header */}
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-chakra text-xl font-700 text-white">
          {citizen.initials}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-800 text-foreground">{citizen.name}</h1>
          <p className="text-[13px] text-muted-foreground">Citizen since {citizen.memberSince} · {citizen.state}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Tag tone="accent">Verified identity</Tag>
            <Tag tone="primary">{citizen.language}</Tag>
          </div>
        </div>
        <Button variant="secondary" icon={<Icon.Pencil width={15} height={15} />}>Edit profile</Button>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* personal info */}
          <Card className="p-5">
            <SectionTitle>Personal information</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info icon={<Icon.User width={16} height={16} />} label="Name" value={citizen.name} />
              <Info icon={<Icon.Phone width={16} height={16} />} label="Contact" value={citizen.contact} />
              <Info icon={<Icon.MapPin width={16} height={16} />} label="State" value={citizen.state} />
              <Info icon={<Icon.Globe width={16} height={16} />} label="Preferred language" value={citizen.language} />
            </div>
            <p className="mt-3 text-[11.5px] text-muted-foreground">Sensitive details are masked by default and only shared with your explicit consent.</p>
          </Card>

          {/* documents */}
          <Card className="p-5">
            <SectionTitle action={<button onClick={() => go("documents")} className="text-[13px] font-500 text-primary hover:underline">Manage</button>}>
              Documents
            </SectionTitle>
            <div className="space-y-2">
              {documents.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-surface-muted text-muted-foreground"><Icon.Doc width={16} height={16} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-500 text-foreground">{d.name}</p>
                    <p className="text-[11px] text-muted-foreground">{d.type}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* privacy */}
          <Card className="p-5">
            <SectionTitle>Privacy &amp; consent</SectionTitle>
            <div className="space-y-3">
              {consents.map((c) => (
                <div key={c.service} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-600 text-foreground">{c.service}</p>
                    <span className="flex items-center gap-1.5 text-[12px] font-500 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Active</span>
                  </div>
                  <div className="mt-2 grid gap-1.5 text-[12.5px] sm:grid-cols-3">
                    <span className="text-muted-foreground">Data: <span className="text-foreground">{c.data}</span></span>
                    <span className="text-muted-foreground">Purpose: <span className="text-foreground">{c.purpose}</span></span>
                    <span className="text-muted-foreground">Duration: <span className="text-foreground">{c.duration}</span></span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="ghost">Modify</Button>
                    <Button size="sm" variant="danger" icon={<Icon.Lock width={14} height={14} />}>Revoke</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* sidebar: my cases */}
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle>My cases</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(cases).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-surface-muted/40 p-4 text-center">
                  <p className="font-display text-2xl font-800 text-foreground">{v}</p>
                  <p className="text-[12px] text-muted-foreground">{k}</p>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => go("tracking")} icon={<Icon.Layers width={16} height={16} />}>View all cases</Button>
          </Card>

          <Card className="p-5">
            <SectionTitle>Language</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span key={l.code} className={`rounded-full border px-3 py-1.5 text-[13px] ${l.label === citizen.language ? "border-primary bg-primary-soft text-primary font-600" : "border-border-strong text-foreground"}`}>
                  {l.native}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Recent notifications</SectionTitle>
            <div className="space-y-2 text-[13px]">
              {applications.map((a) => (
                <p key={a.id} className="flex items-start gap-2 text-muted-foreground">
                  <Icon.Bell width={14} height={14} className="mt-0.5 shrink-0" />
                  <span><span className="text-foreground">{a.service}</span> — {a.lastUpdated}</span>
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-[13.5px] font-500 text-foreground">{value}</p>
      </div>
    </div>
  )
}
