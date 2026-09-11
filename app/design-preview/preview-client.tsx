"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { QuestionCard } from "@/components/question-card";
import { FeedbackDisplay } from "@/components/feedback-display";
import { ExplainerModal } from "@/components/explainer-modal";
import { ServiceSidebar } from "@/components/service-sidebar";
import { Button } from "@/components/ui/button";
const options = [
  { id: "a", text: "Increase the execution timeout for the function." },
  { id: "b", text: "Configure provisioned concurrency for the function." },
  { id: "c", text: "Increase the visibility timeout of the queue." },
  { id: "d", text: "Enable active tracing in AWS X-Ray." },
];
export function PracticePreview() {
  const [answer, setAnswer] = useState(""),
    [lesson, setLesson] = useState(false);
  const question =
    "An application uses AWS Lambda to handle customer requests. The first request after a period of inactivity takes longer to respond. Which option reduces this initialization latency?";
  return (
    <div className="practice-surface">
      <Header
        user={{ id: "preview", email: "preview@example.com", name: "Learner" }}
        preview
      />
      <main className="workspace">
        <Link href="/design-preview" className="text-sm text-primary">
          ← Study workspace
        </Link>
        <div className="mt-8 mb-8">
          <p className="eyebrow mb-3">Design preview · Sample question</p>
          <h1 className="editorial-title text-5xl">Lambda practice</h1>
          <p className="text-muted-foreground mt-4">
            Focus on the concepts behind serverless computing.
          </p>
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-7">
          <div>
            {!answer ? (
              <QuestionCard
                question={question}
                options={options}
                onSubmit={setAnswer}
              />
            ) : (
              <>
                <FeedbackDisplay
                  isCorrect={answer === "b"}
                  correctAnswer="B"
                  selectedAnswer={answer}
                  explanations={{
                    correct:
                      "Provisioned concurrency initializes execution environments ahead of incoming requests, reducing the initialization latency associated with cold starts.",
                    wrongAnswers: options
                      .filter((o) => o.id !== "b")
                      .map((o) => ({
                        id: o.id,
                        reason:
                          o.id === "a"
                            ? "A longer timeout allows more execution time; it does not pre-initialize an environment."
                            : o.id === "c"
                              ? "An SQS visibility timeout controls message availability, not Lambda initialization."
                              : "Tracing helps you investigate latency; it does not pre-initialize environments.",
                      })),
                  }}
                  examTip="Distinguish reserved concurrency, which reserves capacity, from provisioned concurrency, which pre-initializes environments."
                  onNextQuestion={() => setAnswer("")}
                />
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setLesson(true)}
                >
                  Explore cold starts
                </Button>
              </>
            )}
          </div>
          <ServiceSidebar
            serviceName="AWS Lambda"
            icon=""
            description="Event-driven computing without managing servers. Explore execution environments, concurrency, and invocation patterns."
            stats={{
              questionsAnswered: answer ? 1 : 0,
              correctRate: answer === "b" ? 100 : 0,
              averageTime: "—",
            }}
          />
        </div>
      </main>
      {lesson && (
        <ExplainerModal
          explainerId="lambda-cold-starts"
          question={{ question, correct: "B" }}
          selectedAnswer={answer}
          onClose={() => setLesson(false)}
          onNextQuestion={() => setAnswer("")}
        />
      )}
    </div>
  );
}
