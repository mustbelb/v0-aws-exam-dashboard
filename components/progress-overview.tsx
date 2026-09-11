"use client";
import { Target, BookOpen, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
export function ProgressOverview({
  readinessPercentage,
  totalQuestions,
  currentStreak,
  loading,
}: {
  readinessPercentage: number;
  totalQuestions: number;
  currentStreak: number;
  loading?: boolean;
}) {
  const stats = [
    {
      label: "Practice accuracy",
      value: totalQuestions ? `${readinessPercentage}%` : "—",
      note: totalQuestions
        ? "Across your answered questions"
        : "Answer a question to get started",
      icon: Target,
    },
    {
      label: "Questions answered",
      value: totalQuestions.toLocaleString(),
      note: "One concept at a time",
      icon: BookOpen,
    },
    {
      label: "Current streak",
      value: `${currentStreak} ${currentStreak === 1 ? "day" : "days"}`,
      note: currentStreak
        ? "Keep your momentum going"
        : "A little practice goes a long way",
      icon: Flame,
    },
  ];
  return (
    <section
      aria-label="Your practice statistics"
      className="study-panel grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x"
    >
      {stats.map((s) => (
        <div key={s.label} className="p-6 sm:p-7">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm">{s.label}</span>
            <s.icon size={18} strokeWidth={1.5} />
          </div>
          {loading ? (
            <Skeleton className="h-10 w-20 my-3" />
          ) : (
            <div className="text-4xl font-medium tracking-tight mt-3 mb-2 tabular-nums">
              {s.value}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{s.note}</p>
        </div>
      ))}
    </section>
  );
}
