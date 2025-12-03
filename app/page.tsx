import { Header } from "@/components/header"
import { ProgressOverview } from "@/components/progress-overview"
import { ServiceGrid } from "@/components/service-grid"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-balance">Welcome back, Jordan! 👋</h2>
          <p className="text-muted-foreground text-pretty">
            Continue your AWS certification journey. You're making great progress!
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview readinessPercentage={68} totalQuestions={342} currentStreak={7} />

        {/* Service Selection */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Choose a Service to Practice</h3>
          <ServiceGrid />
        </div>
      </main>
    </div>
  )
}
