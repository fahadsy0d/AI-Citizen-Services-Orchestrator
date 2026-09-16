import { Icon } from "../lib/icons"
import { Button, Card, PrototypeBadge } from "../components/ui"
import { NextBestAction } from "../components/domain"
import JourneyGraph from "../components/JourneyGraph"
import { journey } from "../data/mock"
import type { View } from "../lib/nav"

export default function Journey({ go }: { go: (v: View) => void }) {
  const legend = [
    ["Completed", "bg-success"],
    ["In progress", "bg-info"],
    ["Action required", "bg-warning"],
    ["Pending external", "bg-pending"],
    ["Upcoming", "bg-muted-foreground"],
  ]
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-800 text-foreground">Your service journey</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">
            One goal, multiple services — coordinated into a single orchestration graph. This is what the platform manages on your behalf.
          </p>
        </div>
        <PrototypeBadge label="Simulated orchestration" />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {legend.map(([label, dot]) => (
          <span key={label} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${dot}`} /> {label}
          </span>
        ))}
      </div>

      <NextBestAction onPrimary={() => go("documents")} onSecondary={() => window.scrollTo({ top: 400, behavior: "smooth" })} />

      <Card className="p-5 sm:p-7">
        <JourneyGraph nodes={journey} />
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={() => go("tracking")} icon={<Icon.Layers width={16} height={16} />}>Track this case</Button>
        <Button onClick={() => go("application")} icon={<Icon.Arrow width={16} height={16} />}>Continue to application</Button>
      </div>
    </div>
  )
}
