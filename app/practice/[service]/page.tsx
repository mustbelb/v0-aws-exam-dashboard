"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { FeedbackDisplay } from "@/components/feedback-display"
import { ServiceSidebar } from "@/components/service-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Mock data - in a real app, this would come from an API
const serviceData: Record<string, { name: string; icon: string }> = {
  lambda: { name: "Lambda", icon: "⚡" },
  s3: { name: "S3", icon: "🪣" },
  dynamodb: { name: "DynamoDB", icon: "📊" },
}

const mockQuestion = {
  question:
    "Which AWS Lambda feature allows you to automatically adjust the amount of compute resources allocated to your function based on incoming request traffic?",
  options: [
    { id: "a", text: "Lambda Layers" },
    { id: "b", text: "Provisioned Concurrency" },
    { id: "c", text: "Reserved Concurrency" },
    { id: "d", text: "Automatic Scaling" },
  ],
  correctAnswer: "d",
  explanations: {
    correct:
      "AWS Lambda automatically scales your application by running code in response to each trigger. Your code runs in parallel and processes each trigger individually, scaling precisely with the size of the workload.",
    wrongAnswers: [
      {
        id: "a",
        reason:
          "Lambda Layers are a distribution mechanism for libraries, custom runtimes, and other function dependencies, not related to scaling.",
      },
      {
        id: "b",
        reason:
          "Provisioned Concurrency keeps functions initialized and ready to respond in double-digit milliseconds, but doesn't adjust compute resources based on traffic.",
      },
      {
        id: "c",
        reason:
          "Reserved Concurrency guarantees a set number of concurrent executions, but it's a manual limit, not automatic adjustment.",
      },
    ],
  },
  examTip:
    "Remember: Lambda's automatic scaling is one of its core features. It scales out (adds instances) automatically, not up (increases resources per instance).",
}

export default function PracticePage() {
  const params = useParams()
  const serviceId = params.service as string
  const service = serviceData[serviceId] || { name: "Lambda", icon: "⚡" }

  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = (answer: string) => {
    setSelectedAnswer(answer)
    setIsCorrect(answer === mockQuestion.correctAnswer)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    setSelectedAnswer("")
    setIsCorrect(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance flex items-center gap-3">
            <span className="text-4xl">{service.icon}</span>
            {service.name} Practice
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div>
            {!showFeedback ? (
              <QuestionCard question={mockQuestion.question} options={mockQuestion.options} onSubmit={handleSubmit} />
            ) : (
              <FeedbackDisplay
                isCorrect={isCorrect}
                correctAnswer={mockQuestion.correctAnswer}
                selectedAnswer={selectedAnswer}
                explanations={mockQuestion.explanations}
                examTip={mockQuestion.examTip}
                onNextQuestion={handleNextQuestion}
              />
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ServiceSidebar
              serviceName={service.name}
              icon={service.icon}
              stats={{
                questionsAnswered: 45,
                correctRate: 75,
                averageTime: "1m 23s",
              }}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
