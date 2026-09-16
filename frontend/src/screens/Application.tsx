import { useState } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, StepIndicator, TrustBadge, PrototypeBadge } from "../components/ui"
import { ConsentModal } from "../components/shell/Panels"
import type { View } from "../lib/nav"

type Stage = "form" | "review" | "submitting" | "done"

export default function Application({ go }: { go: (v: View) => void }) {
  const [stage, setStage] = useState<Stage>("form")
  const [consent, setConsent] = useState(false)
  const [income, setIncome] = useState("")
  const [incomeAccepted, setIncomeAccepted] = useState(false)
  const [name] = useState("Kowsika Rajan")

  const fields = {
    name,
    student: "Aarav Rajan",
    level: "Undergraduate — Year 2",
    income: incomeAccepted ? "₹1,80,000 (from document)" : income || "—",
    account: "•••• •••• 4471",
  }

  if (stage === "submitting") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white">
          <Icon.Sparkle width={28} height={28} className="animate-pulse" />
        </div>
        <h2 className="font-display text-xl font-700">Preparing your application…</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Simulated submission — no real application is sent.</p>
      </div>
    )
  }

  if (stage === "done") {
    return (
      <div className="mx-auto max-w-xl space-y-5 py-6 text-center animate-fade-up">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
          <Icon.Check width={30} height={30} />
        </div>
        <div>
          <h1 className="font-display text-[24px] font-800 text-foreground">Application prepared &amp; simulated</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">Your Education Support application is ready and now tracked in your unified case.</p>
        </div>
        <Card className="p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Reference</span>
            <span className="font-mono text-[13px] font-600">APP-2025-EDU-4471</span>
          </div>
        </Card>
        <div className="rounded-xl bg-saffron-soft px-4 py-3 text-[13px] font-500 text-saffron">
          Prototype — no real application has been submitted to any government system.
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={() => go("journey")}>View journey</Button>
          <Button onClick={() => go("tracking")} icon={<Icon.Layers width={16} height={16} />}>Go to tracking</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] font-800 text-foreground">
            {stage === "form" ? "Complete your application" : "Review before submitting"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Education Support Service · National Scholarship Portal</p>
        </div>
        <StepIndicator current={stage === "form" ? 1 : 2} total={2} />
      </div>

      {stage === "form" ? (
        <>
          <Card className="space-y-5 p-5">
            <Field label="Applicant name" value={name} readOnly />
            <Field label="Student name" value="Aarav Rajan" readOnly />
            <Field label="Education level" value="Undergraduate — Year 2" readOnly />

            {/* AI-explained field with autofill suggestion */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[13px] font-600 text-foreground">Annual household income</label>
                <span className="flex items-center gap-1 text-[11px] text-primary"><Icon.Sparkle width={12} height={12} /> AI can explain</span>
              </div>
              {incomeAccepted ? (
                <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success-soft/40 px-4 py-3">
                  <span className="text-[14px] font-500 text-foreground">₹1,80,000</span>
                  <span className="flex items-center gap-1 text-[12px] text-success"><Icon.Check width={14} height={14} /> From your document</span>
                </div>
              ) : (
                <input
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter annual amount in ₹"
                  className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-[14px] outline-none focus:border-primary"
                />
              )}
              <p className="mt-1.5 rounded-lg bg-surface-muted/60 px-3 py-2 text-[12px] text-muted-foreground">
                <Icon.Sparkle width={12} height={12} className="mr-1 inline text-primary" />
                This may be required to assess eligibility. Enter the amount based on the applicable official instructions.
              </p>

              {!incomeAccepted ? (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-dashed border-primary/40 bg-primary-soft/30 px-3 py-2.5">
                  <p className="text-[12.5px] text-foreground">
                    <span className="font-600">Suggested from your document:</span> ₹1,80,000
                  </p>
                  <div className="flex gap-1.5">
                    <Button size="sm" onClick={() => setIncomeAccepted(true)}>Accept</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIncome("")}>Edit</Button>
                  </div>
                </div>
              ) : null}
            </div>

            <Field label="Disbursement account" value="•••• •••• 4471" readOnly />
          </Card>

          <TrustBadge>The assistant helps you understand fields — it never fills or submits consequential information on your behalf without your confirmation.</TrustBadge>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => go("journey")}>Back to journey</Button>
            <Button disabled={!incomeAccepted && !income} onClick={() => setStage("review")} icon={<Icon.Arrow width={16} height={16} />}>Review</Button>
          </div>
        </>
      ) : (
        <>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-600 text-foreground">What you&apos;re about to submit</p>
              <PrototypeBadge label="Simulated submission" />
            </div>
            <div className="divide-y divide-border rounded-xl border border-border">
              {Object.entries({ Applicant: fields.name, Student: fields.student, Level: fields.level, "Household income": fields.income, Account: fields.account }).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-500 text-foreground">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-[13px]">
              <Row label="Documents attached" value="Aadhaar, Marksheet, Income Certificate, Bank details" />
              <Row label="Service" value="Education Support Service" />
              <Row label="Destination" value="National Scholarship Portal (simulated)" />
            </div>
          </Card>

          <div className="rounded-xl bg-saffron-soft px-4 py-3 text-[13px] font-500 text-saffron">
            Prototype — no real application will be submitted. This is a demonstration of the review-and-confirm flow.
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={() => setStage("form")}>Back</Button>
            <Button onClick={() => setConsent(true)} icon={<Icon.Shield width={16} height={16} />}>Review &amp; give consent</Button>
          </div>
        </>
      )}

      <ConsentModal
        open={consent}
        onClose={() => setConsent(false)}
        onConfirm={() => {
          setConsent(false)
          setStage("submitting")
          setTimeout(() => setStage("done"), 1800)
        }}
      />
    </div>
  )
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-600 text-foreground">{label}</label>
      <div className={`flex items-center justify-between rounded-xl border px-4 py-3 text-[14px] ${readOnly ? "border-border bg-surface-muted/40 text-foreground" : "border-border-strong"}`}>
        <span>{value}</span>
        {readOnly ? <Icon.Check width={15} height={15} className="text-success" /> : null}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-500 text-foreground">{value}</span>
    </div>
  )
}
