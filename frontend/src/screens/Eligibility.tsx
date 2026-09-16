import { useState } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, StepIndicator, TrustBadge, PrototypeBadge } from "../components/ui"
import { eligibilityQuestions } from "../data/mock"
import type { View } from "../lib/nav"

export default function Eligibility({ go }: { go: (v: View) => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const total = eligibilityQuestions.length
  const done = step >= total

  const q = eligibilityQuestions[step]

  function answer(v: string) {
    setAnswers((a) => ({ ...a, [q.id]: v }))
  }
  function next() {
    if (!answers[q.id]) return
    setStep((s) => s + 1)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl space-y-5 animate-fade-up">
        <div className="flex items-center gap-2 text-[13px] text-accent"><Icon.Check width={16} height={16} /> Assessment complete</div>
        <div>
          <h1 className="font-display text-[26px] font-800 text-foreground">Preliminary eligibility assessment</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PrototypeBadge label="AI-assisted · preliminary" />
            <span className="text-[13px] text-muted-foreground">Not an official government decision.</span>
          </div>
        </div>

        <Card className="divide-y divide-border overflow-hidden">
          <Group tone="success" title="Likely eligible" icon={<Icon.Check width={15} height={15} />} items={["Household income change reported", "Dependent student in family", "Resident of an eligible state"]} />
          <Group tone="warning" title="Needs confirmation" icon={<Icon.Alert width={15} height={15} />} items={["Income within programme threshold (needs Income Certificate)"]} />
          <Group tone="muted" title="Not enough information" icon={<Icon.Circle width={13} height={13} />} items={["Prior benefit history for the same academic year"]} />
        </Card>

        <TrustBadge>
          This is an AI-assisted preliminary assessment based on what you told us. Final eligibility is determined by the concerned government authority after official verification.
        </TrustBadge>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setStep(0)}>Review answers</Button>
          <Button icon={<Icon.Doc width={16} height={16} />} onClick={() => go("documents")}>Continue to documents</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <button onClick={() => (step === 0 ? go("services") : setStep((s) => s - 1))} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <Icon.ChevronR width={15} height={15} className="rotate-180" /> Back
        </button>
        <StepIndicator current={step + 1} total={total} />
      </div>

      <div>
        <h1 className="font-display text-[24px] font-800 leading-tight text-foreground">Let&apos;s check if you may qualify.</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">A few simple questions — plain language, no bureaucratic terms.</p>
      </div>

      <Card key={q.id} className="p-6 animate-fade-up">
        <h2 className="font-display text-[18px] font-700 text-foreground">{q.q}</h2>
        {q.help ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-muted-foreground">
            <Icon.Sparkle width={14} height={14} className="mt-0.5 shrink-0 text-primary" /> {q.help}
          </p>
        ) : null}

        <div className="mt-5 space-y-2.5">
          {q.type === "yesno" ? (
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((opt) => (
                <Option key={opt} label={opt} selected={answers[q.id] === opt} onClick={() => answer(opt)} />
              ))}
            </div>
          ) : q.type === "select" ? (
            <select
              value={answers[q.id] || ""}
              onChange={(e) => answer(e.target.value)}
              className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-[14px] outline-none focus:border-primary"
            >
              <option value="" disabled>Select your state…</option>
              {q.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <div className="space-y-2.5">
              {q.options?.map((opt) => (
                <Option key={opt} label={opt} selected={answers[q.id] === opt} onClick={() => answer(opt)} radio />
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground">Your answers stay private and are used only for this check.</p>
        <Button disabled={!answers[q.id]} onClick={next} icon={<Icon.Arrow width={16} height={16} />}>
          {step === total - 1 ? "See result" : "Next"}
        </Button>
      </div>
    </div>
  )
}

function Option({ label, selected, onClick, radio }: { label: string; selected: boolean; onClick: () => void; radio?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] font-500 transition-all ${
        selected ? "border-primary bg-primary-soft/50 text-primary" : "border-border-strong text-foreground hover:border-primary/50"
      }`}
    >
      <span className={`grid h-5 w-5 place-items-center ${radio ? "rounded-full" : "rounded-md"} border-2 ${selected ? "border-primary bg-primary text-white" : "border-border-strong"}`}>
        {selected ? <Icon.Check width={12} height={12} /> : null}
      </span>
      {label}
    </button>
  )
}

function Group({ tone, title, icon, items }: { tone: string; title: string; icon: React.ReactNode; items: string[] }) {
  const tones: Record<string, string> = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    muted: "bg-surface-muted text-muted-foreground",
  }
  return (
    <div className="p-5">
      <p className="mb-3 flex items-center gap-2 text-[13px] font-700 text-foreground">
        <span className={`grid h-6 w-6 place-items-center rounded-full ${tones[tone]}`}>{icon}</span>
        {title}
      </p>
      <ul className="space-y-2 pl-1">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-[13.5px] text-foreground/85">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-muted-foreground"}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
