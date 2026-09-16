import { useEffect, useState } from "react"
import { Icon, Chakra } from "../lib/icons"
import { Button, Card, TrustBadge, Tag } from "../components/ui"
import { AIInput } from "../components/domain"

const DEMO = "My father lost his job and our family income has decreased. I need financial and education support."
const examples = [
  "I need employment support",
  "My child needs a scholarship",
  "I need an income certificate",
  "I want to raise a grievance",
]

const processingSteps = [
  "Understanding your situation",
  "Searching government knowledge engine",
  "Matching relevant services",
  "Reasoning through eligibility",
  "Building your journey",
]

type Stage = "input" | "processing" | "understanding"

export default function Assistant({ seed, onConfirm }: { seed: string; onConfirm: () => void }) {
  const [stage, setStage] = useState<Stage>("input")
  const [text, setText] = useState(seed || DEMO)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (seed) {
      setText(seed)
      submit(seed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  function submit(t: string) {
    if (!t.trim()) return
    setText(t)
    setStage("processing")
    setStep(0)
  }

  useEffect(() => {
    if (stage !== "processing") return
    if (step < processingSteps.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 550)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStage("understanding"), 500)
    return () => clearTimeout(t)
  }, [stage, step])

  /* -------- INPUT -------- */
  if (stage === "input") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-8 text-center animate-fade-up sm:py-16">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-[#e9c96b]">
          <Chakra size={30} />
        </div>
        <h1 className="font-display text-[28px] font-800 leading-tight text-foreground">What do you need help with?</h1>
        <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
          Describe your goal in your own words. We&apos;ll turn it into one connected government-service journey — not just a search result.
        </p>
        <div className="mt-7 w-full text-left">
          <AIInput value={text} onChange={setText} onSubmit={() => submit(text)} />
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {examples.map((e) => (
              <button key={e} onClick={() => submit(e)} className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition-colors hover:border-primary hover:text-primary">
                {e}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
          </div>
        </div>
        <p className="mt-6 text-[12px] text-muted-foreground">This is the entry point into a structured journey — not a general chatbot.</p>
      </div>
    )
  }

  /* -------- PROCESSING -------- */
  if (stage === "processing") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="relative mb-6 grid h-20 w-20 place-items-center">
          <Chakra size={72} className="animate-chakra-spin text-primary" />
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        </div>
        <h2 className="font-display text-xl font-700 text-foreground">Understanding your situation…</h2>
        <div className="mt-6 w-full space-y-2 text-left">
          {processingSteps.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[13.5px] transition-all ${
              i < step ? "border-border bg-surface text-foreground" : i === step ? "border-primary bg-primary-soft/40 text-foreground" : "border-border bg-surface/40 text-muted-foreground"
            }`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full ${i < step ? "bg-success-soft text-success" : i === step ? "bg-primary text-white" : "bg-surface-muted text-muted-foreground"}`}>
                {i < step ? <Icon.Check width={14} height={14} /> : i === step ? <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> : <span className="text-[10px]">{i + 1}</span>}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* -------- UNDERSTANDING -------- */
  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-fade-up">
      <div className="flex items-center gap-2 text-[13px] text-accent">
        <Icon.Check width={16} height={16} /> Situation understood
      </div>
      <div>
        <h1 className="font-display text-[26px] font-800 text-foreground">Here&apos;s what I understood</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">Everything below is editable. Correct anything before we continue.</p>
      </div>

      <Card className="p-4">
        <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">Your words</p>
        <p className="mt-1 text-[14px] italic text-foreground/80">&ldquo;{text}&rdquo;</p>
      </Card>

      <EditableCard title="Situation" icon={<Icon.Alert width={16} height={16} />} defaultValue="Family income has decreased due to job loss." />

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-2 text-[13px] font-600 text-foreground"><Icon.Sparkle width={16} height={16} className="text-primary" /> Potential needs</p>
          <button className="flex items-center gap-1 text-[12px] text-primary hover:underline"><Icon.Pencil width={13} height={13} /> Edit</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Employment support", "Financial assistance", "Education support"].map((n) => (
            <span key={n} className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-500 text-primary">
              {n}
              <Icon.Close width={13} height={13} className="opacity-50" />
            </span>
          ))}
          <button className="rounded-full border border-dashed border-border-strong px-3 py-1.5 text-[13px] text-muted-foreground hover:border-primary hover:text-primary">+ Add</button>
        </div>
      </Card>

      <Card className="p-5">
        <p className="mb-3 flex items-center gap-2 text-[13px] font-600 text-foreground"><Icon.User width={16} height={16} className="text-primary" /> Context detected</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["Role", "Parent / guardian"],
            ["Household", "Student in family"],
            ["Change", "Income decreased"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-surface-muted/40 p-3">
              <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">{k}</p>
              <p className="mt-0.5 text-[13.5px] font-500 text-foreground">{v}</p>
            </div>
          ))}
        </div>
      </Card>

      <TrustBadge>You remain in control. We&apos;ll use your information only to identify relevant services — nothing is shared without your consent.</TrustBadge>

      <div className="sticky bottom-0 -mx-1 flex flex-col-reverse gap-2 rounded-2xl border border-border bg-surface/90 p-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] font-500 text-foreground">Is this correct?</p>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Icon.Pencil width={15} height={15} />}>Edit details</Button>
          <Button icon={<Icon.Check width={16} height={16} />} onClick={onConfirm}>Confirm &amp; find services</Button>
        </div>
      </div>
    </div>
  )
}

function EditableCard({ title, icon, defaultValue }: { title: string; icon: React.ReactNode; defaultValue: string }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(defaultValue)
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-600 text-foreground"><span className="text-primary">{icon}</span> {title}</p>
        <button onClick={() => setEditing((e) => !e)} className="flex items-center gap-1 text-[12px] text-primary hover:underline">
          {editing ? <><Icon.Check width={13} height={13} /> Save</> : <><Icon.Pencil width={13} height={13} /> Edit</>}
        </button>
      </div>
      {editing ? (
        <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={2} className="w-full resize-none rounded-xl border border-primary bg-surface p-3 text-[14px] outline-none" autoFocus />
      ) : (
        <p className="text-[14px] text-foreground/85">{val}</p>
      )}
    </Card>
  )
}
