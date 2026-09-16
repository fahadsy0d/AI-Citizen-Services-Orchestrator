import { useState } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, SectionTitle, StatusBadge, PrototypeBadge, OfficialSource } from "../components/ui"

const existing = [
  { id: "GRV-2025-0451", title: "Delay in income certificate issuance", dept: "Revenue Department", status: "in-progress", updated: "1 day ago" },
  { id: "GRV-2025-0388", title: "Scholarship disbursement not received", dept: "Education Department", status: "completed", updated: "2 weeks ago" },
]

export default function Grievances() {
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-[26px] font-800 text-foreground">Raise &amp; track a grievance</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">Describe the issue in plain language. We&apos;ll route it to the right department and keep it in your unified case view.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <SectionTitle action={<PrototypeBadge label="Routes to CPGRAMS (concept)" />}>New grievance</SectionTitle>
          {submitted ? (
            <div className="rounded-xl border border-success/30 bg-success-soft/50 p-5 text-center animate-fade-up">
              <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full bg-success-soft text-success"><Icon.Check width={22} height={22} /></div>
              <p className="font-display text-base font-700 text-foreground">Grievance logged (simulated)</p>
              <p className="mt-1 text-[13px] text-muted-foreground">Reference <span className="font-mono">GRV-2025-0502</span> · routed to the concerned department.</p>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => { setSubmitted(false); setText("") }}>Raise another</Button>
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="e.g. My income certificate application has been pending for over three weeks with no update."
                className="w-full resize-none rounded-xl border border-border-strong bg-surface p-4 text-[14px] outline-none focus:border-primary"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-muted-foreground">Suggested department:</span>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-[12.5px] font-500 text-primary">Revenue Department</span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" icon={<Icon.Mic width={15} height={15} />}>Voice</Button>
                <Button disabled={!text.trim()} onClick={() => setSubmitted(true)} icon={<Icon.Send width={15} height={15} />}>Submit grievance</Button>
              </div>
            </>
          )}
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <SectionTitle>Your grievances</SectionTitle>
            <div className="space-y-3">
              {existing.map((g) => (
                <div key={g.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13.5px] font-600 text-foreground">{g.title}</p>
                    <StatusBadge status={g.status} />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{g.id} · {g.dept}</p>
                  <p className="text-[11px] text-muted-foreground">Updated {g.updated}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <OfficialSource source="CPGRAMS" updated="Aug 2025" />
            <p className="mt-2 text-[12px] text-muted-foreground">Grievances are routed to official channels. This prototype simulates routing and status updates.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
