import { Card, CardContent } from "@/components/ui/card"

interface ProgressOverviewProps {
  readinessPercentage: number
  totalQuestions: number
  currentStreak: number
}

export function ProgressOverview({ readinessPercentage, totalQuestions, currentStreak }: ProgressOverviewProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (readinessPercentage / 100) * circumference

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Circular Progress */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90 transform">
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{readinessPercentage}%</span>
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Overall Readiness</p>
          </div>

          {/* Questions Answered */}
          <div className="flex flex-col items-center justify-center gap-2 border-l border-border pl-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary">{totalQuestions}</span>
              <span className="text-sm text-muted-foreground">Questions</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Answered</p>
          </div>

          {/* Current Streak */}
          <div className="flex flex-col items-center justify-center gap-2 border-l border-border pl-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-success">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">Days</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Current Streak 🔥</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
