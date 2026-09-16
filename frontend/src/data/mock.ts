export type DocStatus = "verified" | "available" | "missing" | "needs-verification" | "expired"

export interface CitizenDoc {
  id: string
  name: string
  type: string
  status: DocStatus
  issuer?: string
  updated?: string
  requiredFor: string[]
}

export interface Service {
  id: string
  name: string
  department: string
  category: string
  description: string
  why: string
  match: number
  requiredDocs: number
  method: string
  source: string
  sourceUpdated: string
  prototype: boolean
  icon: "grad" | "briefcase" | "rupee"
}

export type NodeStatus = "completed" | "in-progress" | "action-required" | "upcoming" | "pending-external"

export interface Notification {
  id: string
  title: string
  body: string
  time: string
  kind: "success" | "action" | "info"
  unread: boolean
}

export const citizen = {
  name: "Kowsika Rajan",
  firstName: "Kowsika",
  initials: "KR",
  contact: "+91 98••• ••210",
  state: "Tamil Nadu",
  language: "English",
  memberSince: "Aug 2024",
}

export const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
]

export const documents: CitizenDoc[] = [
  { id: "aadhaar", name: "Aadhaar / Identity", type: "Identity", status: "verified", issuer: "UIDAI", updated: "12 Jul 2025", requiredFor: ["Education Support", "Employment Support"] },
  { id: "marksheet", name: "Class 12 Marksheet", type: "Education", status: "verified", issuer: "State Board", updated: "02 Jun 2024", requiredFor: ["Education Support"] },
  { id: "bank", name: "Bank Account Details", type: "Financial", status: "available", issuer: "Self-declared", updated: "18 Aug 2025", requiredFor: ["Education Support", "Employment Support"] },
  { id: "ration", name: "Ration Card", type: "Household", status: "available", issuer: "TN Civil Supplies", updated: "05 Jan 2025", requiredFor: ["Employment Support"] },
  { id: "income", name: "Income Certificate", type: "Financial", status: "missing", requiredFor: ["Education Support"] },
  { id: "domicile", name: "Domicile Certificate", type: "Residence", status: "expired", issuer: "Revenue Dept.", updated: "20 Mar 2022", requiredFor: ["Education Support"] },
]

export const services: Service[] = [
  {
    id: "edu",
    name: "Education Support Service",
    department: "Dept. of School Education (concept)",
    category: "Education",
    description: "Financial help so a dependent student can continue their studies without a break during a family income drop.",
    why: "Your description mentions a dependent student who may need education support after a change in family income.",
    match: 82,
    requiredDocs: 5,
    method: "Guided online application",
    source: "National Scholarship Portal",
    sourceUpdated: "Aug 2025",
    prototype: true,
    icon: "grad",
  },
  {
    id: "emp",
    name: "Employment & Skilling Support",
    department: "Ministry of Labour (concept)",
    category: "Livelihood",
    description: "Registration for unorganised-worker benefits and access to skilling and job-linkage programmes.",
    why: "You mentioned a job loss and reduced household income — livelihood support may help stabilise the situation.",
    match: 74,
    requiredDocs: 4,
    method: "Registration + verification",
    source: "e-Shram",
    sourceUpdated: "Jul 2025",
    prototype: true,
    icon: "briefcase",
  },
  {
    id: "fin",
    name: "Family Financial Relief",
    department: "State Social Welfare (concept)",
    category: "Financial",
    description: "Short-term financial assistance for families facing sudden income loss, subject to state criteria.",
    why: "A recent drop in household income may make your family eligible for temporary relief support.",
    match: 61,
    requiredDocs: 4,
    method: "Application via state portal",
    source: "State Government Portal",
    sourceUpdated: "Jun 2025",
    prototype: true,
    icon: "rupee",
  },
]

export const journey: {
  id: string
  title: string
  desc: string
  status: NodeStatus
  department: string
  action?: string
  time?: string
  branch?: "edu" | "emp"
}[] = [
  { id: "goal", title: "Citizen Goal", desc: "Financial & education support after a job loss.", status: "completed", department: "You", time: "Today, 9:12 AM" },
  { id: "understand", title: "Situation Understood", desc: "AI structured your problem into needs & context.", status: "completed", department: "AI Assistant", time: "Today, 9:12 AM" },
  { id: "eligibility", title: "Eligibility Assessment", desc: "Preliminary check across matched services.", status: "completed", department: "Eligibility Engine", time: "Today, 9:18 AM" },
  { id: "docs", title: "Document Readiness", desc: "Income Certificate is missing.", status: "action-required", department: "Document Intelligence", action: "Upload Income Certificate", time: "Today, 9:24 AM" },
  { id: "edu", title: "Education Support", desc: "Guided application prepared, awaiting document.", status: "in-progress", department: "National Scholarship Portal", branch: "edu" },
  { id: "emp", title: "Employment Support", desc: "e-Shram registration ready to start.", status: "upcoming", department: "e-Shram", branch: "emp" },
  { id: "verify", title: "External Verification", desc: "Income verification via issuing authority.", status: "pending-external", department: "Simulated integration" },
  { id: "case", title: "Unified Citizen Case", desc: "All services tracked together as one journey.", status: "upcoming", department: "Orchestration Layer" },
  { id: "next", title: "Next Best Action", desc: "Upload your Income Certificate to continue.", status: "action-required", department: "Orchestration Layer", action: "Upload Document" },
]

export const applications = [
  { id: "APP-2025-EDU-4471", service: "Education Support Service", status: "action-required" as const, submittedAt: "16 Sep 2025", lastUpdated: "2 hours ago", nextAction: "Upload Income Certificate", portal: "National Scholarship Portal" },
  { id: "APP-2025-EMP-1180", service: "Employment & Skilling Support", status: "draft" as const, submittedAt: "—", lastUpdated: "Yesterday", nextAction: "Complete e-Shram registration", portal: "e-Shram" },
  { id: "APP-2025-INC-0093", service: "Income Certificate Request", status: "pending" as const, submittedAt: "14 Sep 2025", lastUpdated: "1 day ago", nextAction: "Awaiting external verification", portal: "State Revenue Dept." },
]

export const notifications: Notification[] = [
  { id: "n1", title: "Income Certificate required", body: "Add your Income Certificate to continue your Education Support application.", time: "2h ago", kind: "action", unread: true },
  { id: "n2", title: "Aadhaar verification complete", body: "Your identity document was verified successfully.", time: "1d ago", kind: "success", unread: true },
  { id: "n3", title: "Application status changed", body: "Income Certificate request moved to external verification.", time: "1d ago", kind: "info", unread: false },
]

export const ecosystem = [
  "National Government Services Portal",
  "State Government Portals",
  "National Scholarship Portal",
  "e-Shram",
  "PM-KISAN",
  "CPGRAMS",
  "Parivahan",
  "Income Tax Department",
  "DigiLocker",
  "UMANG",
  "MyScheme",
]

export const eligibilityQuestions = [
  {
    id: "level",
    q: "What is the student's current education level?",
    help: "This helps match the right education support programmes.",
    type: "radio" as const,
    options: ["Secondary (Class 9–10)", "Higher secondary (Class 11–12)", "Undergraduate", "Postgraduate"],
    answer: "Undergraduate",
  },
  {
    id: "income-change",
    q: "Has your household income changed recently?",
    help: "Recent income change can affect which relief services apply.",
    type: "yesno" as const,
    answer: "Yes",
  },
  {
    id: "state",
    q: "Which state do you currently live in?",
    help: "Some services are administered at the state level.",
    type: "select" as const,
    options: ["Tamil Nadu", "Kerala", "Karnataka", "Telangana", "Andhra Pradesh", "Other"],
    answer: "Tamil Nadu",
  },
  {
    id: "dependent",
    q: "Is the student financially dependent on the household?",
    help: "Dependency is a common criterion for education support.",
    type: "yesno" as const,
    answer: "Yes",
  },
  {
    id: "bank",
    q: "Does the student have an active bank account?",
    help: "Support is usually disbursed directly to a bank account.",
    type: "yesno" as const,
    answer: "Yes",
  },
]

export const admin = {
  stats: [
    { label: "Service demand (30d)", value: "12,450", delta: "+6.4%", tone: "info" as const },
    { label: "Journey drop-off", value: "8.2%", delta: "-1.1%", tone: "success" as const },
    { label: "Document-related friction", value: "High", delta: "Income certs", tone: "warning" as const },
    { label: "External integration failures", value: "1.7%", delta: "+0.3%", tone: "danger" as const },
  ],
  demand: [
    { label: "Education", value: 4200 },
    { label: "Employment", value: 3650 },
    { label: "Financial relief", value: 2100 },
    { label: "Certificates", value: 1600 },
    { label: "Grievances", value: 900 },
  ],
  stages: [
    { label: "Understanding", days: "instant", pct: 100 },
    { label: "Eligibility", days: "~2 min", pct: 92 },
    { label: "Documents", days: "1.8 days", pct: 61 },
    { label: "Application", days: "0.5 days", pct: 54 },
    { label: "Verification", days: "3.2 days", pct: 41 },
  ],
}
