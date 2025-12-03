"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { FeedbackDisplay } from "@/components/feedback-display"
import { ServiceSidebar } from "@/components/service-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { ServiceDefinition } from "@/lib/services"

interface PracticeClientProps {
  user: {
    id: string
    email: string
    name: string
  }
  isActive: boolean
  subscriptionStatus: string
  service: ServiceDefinition
  serviceProgress: {
    questionsAnswered: number
    correctRate: number
    lastPracticed: string | null
  }
}

interface Question {
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correct: string
  explanation: {
    correct: string
    A?: string
    B?: string
    C?: string
    D?: string
  }
  examTip: string
}

export function PracticeClient({
  user,
  isActive,
  subscriptionStatus,
  service,
  serviceProgress
}: PracticeClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(serviceProgress.questionsAnswered)
  const [correctCount, setCorrectCount] = useState(
    Math.round((serviceProgress.correctRate / 100) * serviceProgress.questionsAnswered)
  )
  const startTimeRef = useRef<number>(0)

  // Parser for plain text format from Lambda
  const parsePlainTextQuestion = (text: string): Question | null => {
    try {
      console.log('[Parser] Raw text length:', text.length)
      console.log('[Parser] Raw text preview:', text.substring(0, 500))
      
      // More flexible extraction - handles various whitespace and formatting
      const extractSection = (label: string): string => {
        // Match the label followed by content until the next label or end
        const regex = new RegExp(
          `${label}[:\\s]*\\n?([\\s\\S]*?)(?=\\n(?:QUESTION|OPTION_[A-D]|CORRECT|EXPLANATION_(?:CORRECT|[A-D])|EXAM_TIP)[:\\s]|$)`,
          'i'
        )
        const match = text.match(regex)
        const result = match ? match[1].trim() : ''
        console.log(`[Parser] ${label}:`, result.substring(0, 100))
        return result
      }

      const question = extractSection('QUESTION')
      const optionA = extractSection('OPTION_A')
      const optionB = extractSection('OPTION_B')
      const optionC = extractSection('OPTION_C')
      const optionD = extractSection('OPTION_D')
      const correct = extractSection('CORRECT').toUpperCase().trim().charAt(0) // Just get first char (A, B, C, or D)
      const explanationCorrect = extractSection('EXPLANATION_CORRECT')
      const explanationA = extractSection('EXPLANATION_A')
      const explanationB = extractSection('EXPLANATION_B')
      const explanationC = extractSection('EXPLANATION_C')
      const explanationD = extractSection('EXPLANATION_D')
      const examTip = extractSection('EXAM_TIP')

      console.log('[Parser] Parsed values:', {
        hasQuestion: !!question,
        hasOptionA: !!optionA,
        hasOptionB: !!optionB,
        hasOptionC: !!optionC,
        hasOptionD: !!optionD,
        correct
      })

      if (!question || !optionA || !optionB || !optionC || !optionD || !correct) {
        console.error('[Parser] Missing required fields')
        console.error('[Parser] Full text:', text)
        return null
      }

      return {
        question,
        options: {
          A: optionA,
          B: optionB,
          C: optionC,
          D: optionD
        },
        correct,
        explanation: {
          correct: explanationCorrect,
          A: explanationA,
          B: explanationB,
          C: explanationC,
          D: explanationD
        },
        examTip
      }
    } catch (e) {
      console.error('[Parser] Error parsing plain text question:', e)
      console.error('[Parser] Full text:', text)
      return null
    }
  }

  const generateQuestion = useCallback(async () => {
    setIsLoading(true)
    setStreamingContent("")
    setError(null)
    setCurrentQuestion(null)
    setShowFeedback(false)
    setSelectedAnswer("")

    const params = new URLSearchParams({
      service: service.id,
      userId: user.id
    })

    try {
      const streamUrl = `/api/question/generate?${params.toString()}`
      console.log('[Practice] Starting stream:', streamUrl)
      
      const eventSource = new EventSource(streamUrl)
      let accumulated = ""

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('[Practice] Received event type:', data.type)

          switch (data.type) {
            case "character":
              accumulated += data.character
              setStreamingContent(accumulated)
              break

            case "chunk":
              accumulated += data.content
              setStreamingContent(accumulated)
              break

            case "complete":
              console.log('[Practice] Stream complete, accumulated length:', accumulated.length)
              eventSource.close()
              setIsLoading(false)

              // Parse the plain text format into Question object
              try {
                const question = parsePlainTextQuestion(accumulated)
                if (question) {
                  setCurrentQuestion(question)
                  setStreamingContent("") // Clear streaming content once parsed
                  startTimeRef.current = Date.now()
                } else {
                  console.error("Failed to parse question from text")
                  setError("Failed to parse question. Please try again.")
                }
              } catch (e) {
                console.error("Failed to parse question:", e)
                setError("Failed to parse question. Please try again.")
              }
              break

            case "error":
              eventSource.close()
              setIsLoading(false)
              setError(data.error || "An error occurred")
              break
          }
        } catch (e) {
          console.error("Parse error:", e)
        }
      }

      eventSource.onerror = (error) => {
        console.error('[Practice] EventSource error:', error)
        eventSource.close()
        setIsLoading(false)
        setStreamingContent("")
        setError("Connection error. Please try again.")
      }

      // Timeout after 120 seconds
      setTimeout(() => {
        if (eventSource.readyState !== EventSource.CLOSED) {
          console.log('[Practice] Stream timeout, closing')
          eventSource.close()
          setIsLoading(false)
          setStreamingContent("")
          setError("Request timed out. Please try again.")
        }
      }, 120000)
    } catch (e) {
      setIsLoading(false)
      setError("Failed to start question generation")
    }
  }, [service.id, user.id])

  const handleSubmit = async (answer: string) => {
    if (!currentQuestion) return

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    const correct = answer.toLowerCase() === currentQuestion.correct.toLowerCase()

    setSelectedAnswer(answer)
    setIsCorrect(correct)
    setShowFeedback(true)
    setQuestionsAnswered(prev => prev + 1)
    if (correct) {
      setCorrectCount(prev => prev + 1)
    }

    // Submit to backend
    try {
      await fetch("/api/question/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.id,
          topic: null,
          questionText: currentQuestion.question,
          correctAnswer: currentQuestion.correct,
          userAnswer: answer,
          timeTakenSeconds: timeTaken
        })
      })
    } catch (e) {
      console.error("Failed to submit answer:", e)
    }
  }

  const handleNextQuestion = () => {
    generateQuestion()
  }

  // Format options for QuestionCard component
  const formattedOptions = currentQuestion
    ? [
        { id: "a", text: currentQuestion.options.A },
        { id: "b", text: currentQuestion.options.B },
        { id: "c", text: currentQuestion.options.C },
        { id: "d", text: currentQuestion.options.D }
      ]
    : []

  // Format explanations for FeedbackDisplay
  const formattedExplanations = currentQuestion
    ? {
        correct: currentQuestion.explanation.correct,
        wrongAnswers: ["A", "B", "C", "D"]
          .filter(key => key.toLowerCase() !== currentQuestion.correct.toLowerCase())
          .map(key => ({
            id: key.toLowerCase(),
            reason: currentQuestion.explanation[key as keyof typeof currentQuestion.explanation] || ""
          }))
      }
    : { correct: "", wrongAnswers: [] }

  const currentAccuracy = questionsAnswered > 0
    ? Math.round((correctCount / questionsAnswered) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/dashboard">
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
          <p className="text-muted-foreground mt-2">{service.description}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div>
            {/* Initial state - no question yet */}
            {!currentQuestion && !isLoading && !error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Ready to test your {service.name} knowledge?
                </p>
                <Button onClick={generateQuestion} size="lg">
                  Start Practice
                </Button>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={generateQuestion} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading state - show streaming content */}
            {isLoading && (
              <div className="space-y-4">
                {streamingContent ? (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <p className="text-sm font-medium text-primary mb-3">✨ Generating your question...</p>
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed bg-muted/30 p-4 rounded-md max-h-[500px] overflow-y-auto">
                      {streamingContent}
                      <span className="animate-pulse text-primary">|</span>
                    </pre>
                  </div>
                ) : (
                  <QuestionCard
                    question=""
                    options={[]}
                    onSubmit={() => {}}
                    isLoading={true}
                  />
                )}
              </div>
            )}

            {/* Question display */}
            {currentQuestion && !showFeedback && !isLoading && (
              <QuestionCard
                question={currentQuestion.question}
                options={formattedOptions}
                onSubmit={handleSubmit}
                isLoading={false}
              />
            )}

            {/* Feedback display */}
            {showFeedback && currentQuestion && (
              <FeedbackDisplay
                isCorrect={isCorrect}
                correctAnswer={currentQuestion.correct}
                selectedAnswer={selectedAnswer}
                explanations={formattedExplanations}
                examTip={currentQuestion.examTip}
                onNextQuestion={handleNextQuestion}
              />
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ServiceSidebar
              serviceName={service.name}
              icon={service.icon}
              description={service.description}
              stats={{
                questionsAnswered,
                correctRate: currentAccuracy,
                averageTime: "—"
              }}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
