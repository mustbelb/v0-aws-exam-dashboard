"use client";
import { BookOpen, Target } from "lucide-react";
export function ServiceSidebar({
  serviceName,
  description,
  stats,
}: {
  serviceName: string;
  icon: string;
  description?: string;
  stats: {
    questionsAnswered: number;
    correctRate: number;
    averageTime: string;
  };
}) {
  return (
    <aside className="space-y-5">
      <div className="study-panel p-6">
        <Target size={21} className="text-primary mb-4" />
        <p className="eyebrow mb-4">Your practice</p>
        <h3 className="text-xl mb-6 font-medium">{serviceName}</h3>
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Questions answered</dt>
            <dd className="font-semibold tabular-nums">
              {stats.questionsAnswered}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Accuracy</dt>
            <dd className="font-semibold tabular-nums">
              {stats.questionsAnswered ? `${stats.correctRate}%` : "—"}
            </dd>
          </div>
        </dl>
        <div className="h-1.5 bg-muted rounded-full mt-5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full"
            style={{ width: `${stats.correctRate}%` }}
          />
        </div>
      </div>
      {description && (
        <div className="p-6 border rounded-2xl">
          <BookOpen size={19} className="text-muted-foreground mb-3" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground px-2">
        Review the explanation after each answer. Knowing why matters more than
        getting it right.
      </p>
    </aside>
  );
}
