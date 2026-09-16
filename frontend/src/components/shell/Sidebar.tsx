import { navItems, type View } from "../../lib/nav"
import { Icon, Chakra } from "../../lib/icons"

export default function Sidebar({ view, go }: { view: View; go: (v: View) => void }) {
  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-5 h-[68px] border-b border-border">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-[#e9c96b]">
          <Chakra size={22} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-700 text-foreground">Orchestrator</p>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Citizen Services</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const I = Icon[item.icon]
          const active = view === item.view
          return (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              aria-current={active ? "page" : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-500 transition-all ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <I width={19} height={19} className={active ? "text-primary" : ""} />
              {item.label}
              {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" /> : null}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-3 space-y-0.5 border-t border-border pt-3">
        <button
          onClick={() => go("admin")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-500 transition-all ${
            view === "admin" ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          }`}
        >
          <Icon.Trend width={19} height={19} />
          Admin Insights
        </button>
      </div>

      <div className="m-3 rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="font-display text-[13px] font-600 leading-snug">One citizen. One request. Every service connected.</p>
        <p className="mt-1.5 text-[11px] text-white/70">An orchestration layer over existing government digital infrastructure.</p>
      </div>
    </aside>
  )
}
