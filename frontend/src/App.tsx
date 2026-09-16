import { useEffect, useState } from "react"
import type { View } from "./lib/nav"
import Sidebar from "./components/shell/Sidebar"
import Header from "./components/shell/Header"
import MobileNav from "./components/shell/MobileNav"
import AIAssistant, { AssistantFab } from "./components/shell/AIAssistant"
import { NotificationPanel } from "./components/shell/Panels"
import { notifications } from "./data/mock"

import Home from "./screens/Home"
import Assistant from "./screens/Assistant"
import Services from "./screens/Services"
import Eligibility from "./screens/Eligibility"
import Documents from "./screens/Documents"
import Journey from "./screens/Journey"
import Application from "./screens/Application"
import Tracking from "./screens/Tracking"
import Profile from "./screens/Profile"
import Grievances from "./screens/Grievances"
import Admin from "./screens/Admin"

export default function App() {
  const [view, setView] = useState<View>("home")
  const [seed, setSeed] = useState("")
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = notifications.filter((n) => n.unread).length

  function go(v: View) {
    if (v === "assistant") setSeed("")
    setView(v)
    setNotifOpen(false)
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }

  function startProblem(text: string) {
    setSeed(text || " ")
    setView("assistant")
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    document.title = "AI Citizen Services Orchestrator"
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar view={view} go={go} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header go={go} onNotifications={() => setNotifOpen((o) => !o)} unread={unread} />

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {view === "home" && <Home go={go} onProblem={startProblem} />}
          {view === "assistant" && <Assistant seed={seed} onConfirm={() => go("services")} />}
          {view === "services" && <Services go={go} />}
          {view === "eligibility" && <Eligibility go={go} />}
          {view === "documents" && <Documents go={go} />}
          {view === "journey" && <Journey go={go} />}
          {view === "application" && <Application go={go} />}
          {view === "tracking" && <Tracking go={go} />}
          {view === "profile" && <Profile go={go} />}
          {view === "grievances" && <Grievances />}
          {view === "admin" && <Admin />}
        </main>
      </div>

      <MobileNav view={view} go={(v) => (v === "assistant" ? (setAssistantOpen(true)) : go(v))} />

      <AssistantFab onClick={() => setAssistantOpen(true)} hidden={assistantOpen} />
      <AIAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} view={view} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}
