import { useState, useEffect } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, SectionTitle, TrustBadge, StatusBadge, PrototypeBadge } from "../components/ui"
import { DocumentCard, ReadinessRing } from "../components/domain"
import { documents } from "../data/mock"
import type { View } from "../lib/nav"

type OcrStage = "idle" | "uploading" | "extracting" | "done" | "mismatch"

export default function Documents({ go, threadId }: { go: (v: View) => void; threadId: string }) {
  const [ocr, setOcr] = useState<OcrStage>("idle")
  const [readiness, setReadiness] = useState(75)
  const [missingDocs, setMissingDocs] = useState<string[]>([])

  useEffect(() => {
    fetch(`http://localhost:8000/api/state?thread_id=${threadId}`)
      .then(r => r.json())
      .then(data => {
        if (data.readiness_percentage !== undefined) {
          setReadiness(data.readiness_percentage)
        }
        if (data.missing_documents) {
          setMissingDocs(data.missing_documents)
        }
      })
      .catch(console.error)
  }, [threadId])

  function startUpload() {
    setOcr("uploading")
    setTimeout(() => setOcr("extracting"), 900)
    setTimeout(() => setOcr("done"), 2200)
  }

  const legend = [
    { s: "verified", label: "Verified" },
    { s: "available", label: "Available" },
    { s: "needs-verification", label: "Needs verification" },
    { s: "missing", label: "Missing" },
    { s: "expired", label: "Expired" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-[26px] font-800 text-foreground">Get your application ready</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">Here&apos;s what you need before applying. We&apos;ll flag anything missing so nothing blocks you later.</p>
      </div>

      {/* Readiness header */}
      <Card className="flex flex-col items-center gap-5 p-6 sm:flex-row">
        <ReadinessRing value={readiness} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="font-display text-lg font-700 text-foreground">Application readiness: {readiness}%</h2>
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">
            This is a readiness indicator — <span className="font-500 text-foreground">not an official eligibility score</span>. One document needs your attention.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-start">
            {legend.map((l) => (
              <span key={l.s} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <StatusBadge status={l.s} />
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Missing highlight + OCR sim */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <SectionTitle>Required documents</SectionTitle>
          {documents.map((d) => {
            const isMissing = missingDocs.includes(d.name) || missingDocs.some(md => md.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(md.toLowerCase()));
            const docStatus = isMissing ? "missing" : d.status;
            return <DocumentCard key={d.id} d={{...d, status: docStatus}} onAction={(a) => (a === "upload" || a === "replace" ? startUpload() : undefined)} />
          })}
        </div>

        <div className="space-y-4">
          {/* Upload / OCR panel */}
          <Card className="p-5">
            <SectionTitle action={<PrototypeBadge label="Simulated OCR" />}>Document intelligence</SectionTitle>

            {ocr === "idle" ? (
              <button onClick={startUpload} className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border-strong bg-surface-muted/40 px-4 py-8 text-center transition-colors hover:border-primary hover:bg-primary-soft/30">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary"><Icon.Upload width={22} height={22} /></div>
                <p className="text-[13.5px] font-600 text-foreground">Upload Income Certificate</p>
                <p className="text-[12px] text-muted-foreground">PDF or image · we&apos;ll read it for you</p>
              </button>
            ) : ocr === "uploading" || ocr === "extracting" ? (
              <div className="rounded-2xl border border-border bg-surface-muted/40 p-5 text-center">
                <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-primary text-white">
                  <Icon.Sparkle width={20} height={20} className="animate-pulse" />
                </div>
                <p className="text-[13.5px] font-600 text-foreground">{ocr === "uploading" ? "Uploading document…" : "Extracting information…"}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: ocr === "uploading" ? "40%" : "85%" }} />
                </div>
              </div>
            ) : (
              <div className="animate-fade-up">
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-[13px] font-500 text-success">
                  <Icon.Check width={16} height={16} /> Document detected: Income Certificate
                </div>
                <p className="mb-2 text-[11px] font-mono uppercase tracking-wide text-muted-foreground">Extracted information</p>
                <div className="divide-y divide-border rounded-xl border border-border">
                  {[
                    ["Certificate type", "Income Certificate"],
                    ["Issuing authority", "Tahsildar, Revenue Dept."],
                    ["Issue date", "11 Sep 2025"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2 text-[13px]">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-500 text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1" icon={<Icon.Check width={15} height={15} />}>Looks right</Button>
                  <Button size="sm" variant="secondary" onClick={() => setOcr("mismatch")}>Not correct</Button>
                </div>
              </div>
            )}

            {ocr === "mismatch" ? (
              <div className="mt-3 animate-fade-up rounded-xl border border-danger/25 bg-danger-soft/50 p-4">
                <p className="flex items-center gap-2 text-[13px] font-600 text-danger"><Icon.Alert width={16} height={16} /> Couldn&apos;t confidently match</p>
                <p className="mt-1 text-[12.5px] text-muted-foreground">The document information could not be confidently matched to your record.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setOcr("done")}>Review</Button>
                  <Button size="sm" variant="ghost" icon={<Icon.Refresh width={14} height={14} />} onClick={startUpload}>Retry</Button>
                  <Button size="sm" variant="ghost">Manual verification</Button>
                </div>
              </div>
            ) : null}
          </Card>

          <TrustBadge>We only read documents to help you prepare. Verification always happens with the official issuing authority.</TrustBadge>

          <Button className="w-full" onClick={() => go("journey")} icon={<Icon.Layers width={16} height={16} />}>View your journey</Button>
        </div>
      </div>
    </div>
  )
}
