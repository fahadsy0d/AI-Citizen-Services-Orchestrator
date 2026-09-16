import { useEffect, useRef, useState } from "react"
import { Icon, Chakra } from "../../lib/icons"
import { Button } from "../ui"
import type { View } from "../../lib/nav"

type Msg = { role: "ai" | "user"; text: string }

const contextByView: Record<string, { intro: string; prompts: { q: string; a: string }[] }> = {
  documents: {
    intro: "I can help you get your documents ready. Your Income Certificate is currently missing.",
    prompts: [
      { q: "Which document is missing?", a: "Your Income Certificate is missing. It's needed for the Education Support application. You can request one from your State Revenue Department, then upload it here." },
      { q: "Why is an income certificate required?", a: "Education support programmes usually check household income to confirm the family qualifies for financial help. The certificate is the accepted proof." },
    ],
  },
  eligibility: {
    intro: "I'll explain any eligibility question in plain language. This is a preliminary check — the authority makes the final decision.",
    prompts: [
      { q: "Why are you asking this question?", a: "Your education level helps match the right programme. Support for undergraduates differs from school-level support, so this narrows the options accurately." },
      { q: "Is this the final decision?", a: "No. This is an AI-assisted preliminary assessment. Final eligibility is determined by the concerned government authority after they verify your details." },
    ],
  },
  journey: {
    intro: "Here's your journey overview. I can tell you what to do next.",
    prompts: [
      { q: "What should I do next?", a: "Upload your Income Certificate. That single step unblocks both your Education Support application and the external verification stage." },
      { q: "What is pending on external systems?", a: "Income verification is queued with the issuing authority (simulated integration). Your journey stays intact even while that runs." },
    ],
  },
  application: {
    intro: "I can explain any field. I won't submit anything without your confirmation.",
    prompts: [
      { q: "Explain the household income field.", a: "Enter your family's total annual income based on the applicable official instructions. It may be used to assess eligibility — you always review before it's used." },
      { q: "Is this a real submission?", a: "No — this is a simulated submission for the prototype. No real application is sent to any government system." },
    ],
  },
  default: {
    intro: "Hello Kowsika. Describe a goal and I'll connect you to the right government services.",
    prompts: [
      { q: "How does this platform work?", a: "You describe your problem in plain language. I understand it, find relevant services, reason through eligibility, check documents, and build one connected journey you can track." },
      { q: "Where should I start?", a: "Start on the Home screen — tell me what you need help with. For the demo, try the family support scenario." },
    ],
  },
}

export default function AIAssistant({
  open,
  onClose,
  view,
}: {
  open: boolean
  onClose: () => void
  view: View
}) {
  const ctx = contextByView[view] || contextByView.default
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: ctx.intro }])
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMsgs([{ role: "ai", text: ctx.intro }])
  }, [view, ctx.intro])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs, typing])

  function ask(q: string, a: string) {
    setMsgs((m) => [...m, { role: "user", text: q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { role: "ai", text: a }])
    }, 850)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] lg:hidden animate-fade-in" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[380px] flex-col border-l border-border bg-surface shadow-2xl animate-fade-up">
        <div className="flex items-center gap-3 border-b border-border px-4 h-[68px]">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-[#e9c96b]">
            <Chakra size={20} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-700">AI Assistant</p>
            <p className="flex items-center gap-1.5 text-[11px] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Context: {view === "understanding" ? "assistant" : view}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close assistant" className="ml-auto grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-surface-muted">
            <Icon.Close width={18} height={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-surface-muted text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing ? (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground" style={{ animation: "ai-pulse 1s infinite", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3">
          <p className="mb-2 px-1 text-[11px] font-mono uppercase tracking-wide text-muted-foreground">Suggested</p>
          <div className="mb-3 space-y-1.5">
            {ctx.prompts.map((p) => (
              <button
                key={p.q}
                onClick={() => ask(p.q, p.a)}
                className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:border-primary hover:bg-primary-soft/40"
              >
                <Icon.Sparkle width={15} height={15} className="text-accent shrink-0" />
                {p.q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5">
            <input
              placeholder="Ask about this screen…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  ask(e.currentTarget.value, "This is a prototype assistant. In the full product I'd answer using the Government Knowledge Engine with cited official sources.")
                  e.currentTarget.value = ""
                }
              }}
            />
            <button aria-label="Voice" className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-primary">
              <Icon.Mic width={17} height={17} />
            </button>
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            AI assists with understanding — it never makes the official government decision.
          </p>
        </div>
      </aside>
    </>
  )
}

export function AssistantFab({ onClick, hidden }: { onClick: () => void; hidden?: boolean }) {
  if (hidden) return null
  return (
    <button
      onClick={onClick}
      aria-label="Open AI Assistant"
      className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-600 text-primary-foreground shadow-xl transition-transform hover:scale-[1.03] lg:bottom-6 lg:right-6"
    >
      <Chakra size={20} className="text-[#e9c96b]" />
      <span className="hidden sm:inline">Ask AI</span>
    </button>
  )
}
