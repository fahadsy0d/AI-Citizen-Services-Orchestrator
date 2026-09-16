import { Icon } from "./icons"

export type View =
  | "home"
  | "assistant"
  | "understanding"
  | "services"
  | "eligibility"
  | "documents"
  | "journey"
  | "application"
  | "tracking"
  | "profile"
  | "grievances"
  | "admin"

export const navItems: { view: View; label: string; icon: keyof typeof Icon }[] = [
  { view: "home", label: "Home", icon: "Home" },
  { view: "assistant", label: "AI Assistant", icon: "Sparkle" },
  { view: "documents", label: "Documents", icon: "Doc" },
  { view: "tracking", label: "My Applications", icon: "Layers" },
  { view: "services", label: "Services", icon: "Grid" },
  { view: "grievances", label: "Grievances", icon: "Megaphone" },
  { view: "profile", label: "Profile", icon: "User" },
]
