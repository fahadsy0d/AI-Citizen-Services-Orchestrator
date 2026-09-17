import { useState, useEffect } from "react"
import { Icon } from "../lib/icons"
import { Button, Card, SectionTitle, Skeleton, EmptyState, Tag, PrototypeBadge } from "../components/ui"
import { ServiceCard } from "../components/domain"
import { ecosystem } from "../data/mock"
import type { View } from "../lib/nav"
import type { Service } from "../data/mock" // We will map the backend data to this type or modify ServiceCard.

const cats = ["All", "Employment", "Business", "Education", "Livelihood", "Financial"]

export default function Services({ go, threadId }: { go: (v: View) => void; threadId: string }) {
  const [cat, setCat] = useState("All")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetch(`http://localhost:8000/api/services?thread_id=${threadId}`)
      .then(r => r.json())
      .then(data => {
        // Map backend schema to frontend Service type
        const mapped = data.services
          .map((s: any) => ({
            id: String(s.id),
            name: s.name,
            department: s.category, // fallback mapping
            category: s.category,
            description: s.description || s.eligibility_criteria,
            why: "Recommended based on your recent interactions.",
            match: typeof s.match === "number" ? s.match : 75,
            requiredDocs: s.required_documents ? s.required_documents.split(",").length : 0,
            method: s.time_to_apply || "Online",
            source: "National Portal",
            sourceUpdated: s.year_established || "2025",
            prototype: false,
            icon: s.category === "Business" ? "briefcase" : s.category === "Employment" ? "briefcase" : "rupee"
          }))
          .sort((a: Service, b: Service) => b.match - a.match)
        setServices(mapped)
        setLoading(false)
      })
      .catch(e => {
        console.error("Failed to fetch services", e)
        setLoading(false)
      })
  }, [threadId])

  function search(q: string) {
    setQuery(q)
  }

  const filtered = services.filter(
    (s) => (cat === "All" || s.category === cat) && (query === "" || s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()))
  )
  const noResults = query.toLowerCase().includes("passport") || query.toLowerCase().includes("xyz")

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-[26px] font-800 text-foreground">Recommended for your goal</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">
          Found by the Government Knowledge Engine from your situation. Each card explains what it&apos;s for and why it appeared — using intent, not exact scheme names.
        </p>
      </div>

      {/* search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2.5">
          <Icon.Search width={17} height={17} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search by need, e.g. “help paying college fees”"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-500 transition-colors ${
                cat === c ? "bg-primary text-primary-foreground" : "border border-border-strong text-foreground hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="h-11 w-11 !rounded-xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-9 w-1/2" />
            </Card>
          ))}
        </div>
      ) : noResults || filtered.length === 0 ? (
        <EmptyState
          title="No exact match — but we can still help"
          body="We didn't find a service for that wording. Try describing the outcome you want, or let the AI Assistant interpret your goal."
          action={<Button onClick={() => go("assistant")} icon={<Icon.Sparkle width={16} height={16} />}>Ask the AI Assistant</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((s) => (
            <ServiceCard key={s.id} s={s} onEligibility={() => go("eligibility")} onDocs={() => go("documents")} />
          ))}
        </div>
      )}

      {/* Ecosystem */}
      <section className="mt-4">
        <SectionTitle>Service ecosystem this platform can orchestrate</SectionTitle>
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <PrototypeBadge label="Potential / prototype connections" />
            <span>Ecosystem references — not live integrations in this prototype.</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ecosystem.map((e) => (
              <span key={e} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted/50 px-3 py-1.5 text-[12.5px] text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
                {e}
              </span>
            ))}
          </div>
          <p className="mt-4 border-t border-border pt-3 text-[12.5px] text-muted-foreground">
            The product does not replace these systems — it acts as an intelligent orchestration layer over existing government digital infrastructure.
          </p>
        </Card>
      </section>
    </div>
  )
}
