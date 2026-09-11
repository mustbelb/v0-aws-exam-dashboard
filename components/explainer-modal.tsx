"use client";
import { useEffect, useRef } from "react";
import { X, ArrowRight, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allExplainers } from "@/components/explainers";
export function ExplainerModal({
  explainerId,
  question,
  selectedAnswer,
  onClose,
  onNextQuestion,
}: {
  explainerId: string;
  question?: { question: string; correct: string } | null;
  selectedAnswer?: string;
  onClose: () => void;
  onNextQuestion?: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null),
    close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input,select,[tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, []);
  const Component = allExplainers[explainerId];
  return (
    <div
      className="fixed inset-0 z-50 bg-[#142b35]/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="explainer-title"
        tabIndex={-1}
        className="bg-background w-full max-w-5xl max-h-[94dvh] flex flex-col rounded-2xl overflow-hidden shadow-2xl outline-none"
      >
        <header className="px-5 sm:px-7 py-5 flex justify-between items-center border-b">
          <div className="flex items-center gap-3">
            <Layers3 className="text-primary" size={22} />
            <div>
              <p className="eyebrow mb-1">The learning room</p>
              <h2 id="explainer-title" className="font-semibold text-lg">
                See how it works
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close explainer"
            className="p-2 rounded-lg hover:bg-muted"
          >
            <X size={21} />
          </button>
        </header>
        <div className="overflow-y-auto min-h-0 p-3 sm:p-6">
          {question && (
            <details className="mb-5 border rounded-xl px-4 py-3 text-sm">
              <summary className="cursor-pointer font-medium">
                Revisit the question{" "}
                <span className="text-muted-foreground font-normal ml-2">
                  Your answer: {selectedAnswer?.toUpperCase()} · Correct:{" "}
                  {question.correct.toUpperCase()}
                </span>
              </summary>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {question.question}
              </p>
            </details>
          )}
          <div className="explainer-stage dark">
            {Component ? (
              <Component />
            ) : (
              <p className="p-8">
                This lesson is not available yet. You can continue practicing
                below.
              </p>
            )}
          </div>
        </div>
        <footer className="px-5 sm:px-7 py-4 border-t flex flex-wrap justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Take the concept with you.
          </p>
          <Button
            onClick={() => {
              onClose();
              onNextQuestion?.();
            }}
            className="gap-3"
          >
            {onNextQuestion ? "Continue practicing" : "Back to practice"}
            <ArrowRight size={16} />
          </Button>
        </footer>
      </div>
    </div>
  );
}
