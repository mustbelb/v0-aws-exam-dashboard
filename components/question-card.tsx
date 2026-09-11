"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
export function QuestionCard({
  question,
  options,
  onSubmit,
  isLoading,
}: {
  question: string;
  options: { id: string; text: string }[];
  onSubmit: (answer: string) => void | Promise<void>;
  isLoading?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  if (isLoading)
    return (
      <div className="study-panel p-8 space-y-5" aria-label="Loading question">
        <Skeleton className="h-20 w-full" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  return (
    <section className="study-panel overflow-hidden">
      <div className="p-6 sm:p-9 border-b">
        <p className="eyebrow mb-5">Think it through</p>
        <h3 className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight">
          {question}
        </h3>
      </div>
      <div className="p-6 sm:p-9">
        <p
          id="answer-instruction"
          className="text-sm text-muted-foreground mb-5"
        >
          Select the best answer.
        </p>
        <RadioGroup
          aria-labelledby="answer-instruction"
          disabled={saving}
          value={selected}
          onValueChange={setSelected}
          className="gap-3"
        >
          {options.map((option) => (
            <Label
              htmlFor={`answer-${option.id}`}
              key={option.id}
              className={`relative flex items-center gap-4 border rounded-xl p-4 sm:p-5 cursor-pointer transition-colors ${selected === option.id ? "border-primary bg-secondary/60" : "hover:bg-muted/50"}`}
            >
              <RadioGroupItem
                className="sr-only"
                value={option.id}
                id={`answer-${option.id}`}
              />
              <span
                className={`w-8 h-8 shrink-0 grid place-items-center rounded-lg border text-sm ${selected === option.id ? "bg-primary text-white border-primary" : "bg-background text-muted-foreground"}`}
              >
                {selected === option.id ? (
                  <Check size={16} />
                ) : (
                  option.id.toUpperCase()
                )}
              </span>
              <span className="text-base font-normal leading-relaxed">
                {option.text}
              </span>
            </Label>
          ))}
        </RadioGroup>
        {saveError && <p role="alert" className="text-sm text-destructive mt-4">{saveError}</p>}
        <div className="flex flex-wrap gap-4 justify-between items-center pt-7">
          <span className="text-xs text-muted-foreground">
            Take your time. Understanding comes first.
          </span>
          <Button
            disabled={!selected || saving}
            onClick={async () => {
              if (saving) return;
              setSaving(true); setSaveError(null);
              try { await onSubmit(selected); setSelected(""); }
              catch (error) { setSaveError(error instanceof Error ? error.message : "Your answer could not be saved. Please try again."); }
              finally { setSaving(false); }
            }}
            size="lg"
            className="gap-3"
          >
            {saving ? "Saving answer…" : "Check answer"} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
