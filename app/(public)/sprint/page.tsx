import type { Metadata } from "next"
import { Check, Clock, Minus } from "lucide-react"

export const metadata: Metadata = {
  title: "Sprint Dashboard - Solo SHE Things",
  description: "Design sprint progress tracker for the Solo SHE Things website redesign.",
}

type TaskStatus = "done" | "in-progress" | "pending"

interface Task {
  label: string
  status: TaskStatus
}

interface TaskGroup {
  category: string
  tasks: Task[]
}

const sprintTasks: TaskGroup[] = [
  {
    category: "Design",
    tasks: [
      { label: "Extract soft, feminine travel palette from brand image", status: "done" },
      { label: "Define CSS variables for all hex values (peach, coral, blush, sage, navy)", status: "done" },
      { label: "Set global font to Rokkitt, serif fallback", status: "done" },
      { label: "Remove ALL gradients, tie-dye, and multi-color text effects", status: "done" },
      { label: "Set entire site background to pure white (#FFFFFF)", status: "done" },
      { label: "Remove grid overlays and textures from backgrounds", status: "done" },
      { label: "Ensure minimal, editorial aesthetic across all pages", status: "done" },
    ],
  },
  {
    category: "Content",
    tasks: [
      { label: "Add top banner: 'Discover your Solo SHE Adventure!'", status: "done" },
      { label: "Add divider: 'Solo SHE Things Est. 2025'", status: "done" },
      { label: "Full SHE capitalization sweep across all pages", status: "done" },
      { label: "Rename Featured Posts to 'SHE Stories'", status: "done" },
      { label: "Update CTA buttons to 'See How SHE Did It'", status: "done" },
      { label: "Rename Community section to 'Community Solo Stories'", status: "done" },
      { label: "Set Community section bg to navy with peach (#FFD0A9) text", status: "done" },
      { label: "Update Mission section with bold heading + accent bar", status: "done" },
      { label: "Rename Join section to 'Go Solo, Together'", status: "done" },
      { label: "Primary CTA: 'Join the SHEsisterhood'", status: "done" },
      { label: "Rename Newsletter to 'The Connection Collective'", status: "done" },
      { label: "Replace mission copy with provided brand text", status: "pending" },
      { label: "Replace newsletter copy with custom brand voice", status: "pending" },
    ],
  },
  {
    category: "Performance",
    tasks: [
      { label: "Hero image strip: lazy load non-critical images", status: "done" },
      { label: "Use next/image with proper sizes attributes", status: "done" },
      { label: "Remove unused animated backgrounds and floating orbs", status: "done" },
      { label: "Remove marquee scroll animation from banner", status: "done" },
      { label: "Optimize images with responsive sizes", status: "done" },
    ],
  },
  {
    category: "QA",
    tasks: [
      { label: "Mobile-first responsive layout verified", status: "done" },
      { label: "Hero strip stacks on mobile, 4-across on desktop", status: "done" },
      { label: "Navigation: editorial labels (Explore, Stories, Safe Spots)", status: "done" },
      { label: "Nav theme: navy (#2C3E50) with white text", status: "done" },
      { label: "ARIA labels on navigation and interactive elements", status: "done" },
      { label: "Color contrast meets WCAG AA requirements", status: "done" },
      { label: "Typography hierarchy is consistent", status: "done" },
      { label: "Sprint Dashboard page created at /sprint", status: "done" },
    ],
  },
]

function StatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "done":
      return (
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-sage/20">
          <Check className="h-4 w-4 text-brand-sage" aria-hidden="true" />
        </div>
      )
    case "in-progress":
      return (
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-coral/20">
          <Clock className="h-4 w-4 text-brand-coral" aria-hidden="true" />
        </div>
      )
    case "pending":
      return (
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted">
          <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      )
  }
}

function statusLabel(status: TaskStatus) {
  switch (status) {
    case "done":
      return "Done"
    case "in-progress":
      return "In Progress"
    case "pending":
      return "Pending"
  }
}

export default function SprintPage() {
  const totalTasks = sprintTasks.reduce((sum, g) => sum + g.tasks.length, 0)
  const doneTasks = sprintTasks.reduce(
    (sum, g) => sum + g.tasks.filter((t) => t.status === "done").length,
    0
  )
  const progressPercent = Math.round((doneTasks / totalTasks) * 100)

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral">
              Design Sprint
            </p>
            <h1 className="font-serif text-3xl font-bold text-brand-navy md:text-4xl lg:text-5xl">
              Sprint Dashboard
            </h1>
            <div className="mt-4 h-px w-16 bg-brand-coral" />
            <p className="mt-4 text-lg text-muted-foreground">
              Progress tracker for the Solo SHE Things website redesign sprint.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12 rounded-xl border border-border bg-brand-cream p-6">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm font-semibold text-brand-navy">Overall Progress</span>
              <span className="font-serif text-2xl font-bold text-brand-coral">{progressPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-coral transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {doneTasks} of {totalTasks} tasks completed
            </p>
          </div>

          {/* Task Groups */}
          <div className="space-y-8">
            {sprintTasks.map((group) => {
              const groupDone = group.tasks.filter((t) => t.status === "done").length
              return (
                <div key={group.category} className="rounded-xl border border-border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-serif text-xl font-bold text-brand-navy">{group.category}</h2>
                    <span className="text-sm text-muted-foreground">
                      {groupDone}/{group.tasks.length} done
                    </span>
                  </div>
                  <ul className="space-y-3" role="list">
                    {group.tasks.map((task) => (
                      <li key={task.label} className="flex items-start gap-3">
                        <StatusIcon status={task.status} />
                        <div className="flex-1">
                          <span
                            className={
                              task.status === "done"
                                ? "text-sm text-muted-foreground line-through"
                                : "text-sm text-foreground"
                            }
                          >
                            {task.label}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            task.status === "done"
                              ? "bg-brand-sage/10 text-brand-sage"
                              : task.status === "in-progress"
                              ? "bg-brand-coral/10 text-brand-coral"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {statusLabel(task.status)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Notes and Next Steps */}
          <div className="mt-12 rounded-xl border border-border bg-brand-cream p-6">
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-4">Notes & Next Steps</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Replace placeholder mission copy with finalized brand text when available</li>
              <li>- Replace newsletter copy with custom brand voice content</li>
              <li>- Upload final brand color palette image for reference</li>
              <li>- Review all pages on mobile devices for screenshot readiness</li>
              <li>- Connect WordPress CMS for live blog content</li>
              <li>- Phase 2: Implement interactive map feature</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
