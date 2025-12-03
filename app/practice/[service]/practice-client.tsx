"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { FeedbackDisplay } from "@/components/feedback-display"
import { ServiceSidebar } from "@/components/service-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
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

// Partial question for progressive display during streaming
interface PartialQuestion {
  question?: string
  options?: {
    A?: string
    B?: string
    C?: string
    D?: string
  }
}

export function PracticeClient({
  user,
  isActive,
  subscriptionStatus,
  service,
  serviceProgress
}: PracticeClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [partialQuestion, setPartialQuestion] = useState<PartialQuestion | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(serviceProgress.questionsAnswered)
  const [correctCount, setCorrectCount] = useState(
    Math.round((serviceProgress.correctRate / 100) * serviceProgress.questionsAnswered)
  )
  const startTimeRef = useRef<number>(0)

  // Progressive JSON parser - extracts partial data as it streams
  const parsePartialJSON = (text: string): PartialQuestion => {
    const partial: PartialQuestion = {}
    
    // Try to extract question text
    const questionMatch = text.match(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (questionMatch) {
      partial.question = questionMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }
    
    // Try to extract options
    partial.options = {}
    
    const optionAMatch = text.match(/"A"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionAMatch) {
      partial.options.A = optionAMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }
    
    const optionBMatch = text.match(/"B"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionBMatch) {
      partial.options.B = optionBMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }
    
    const optionCMatch = text.match(/"C"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionCMatch) {
      partial.options.C = optionCMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }
    
    const optionDMatch = text.match(/"D"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (optionDMatch) {
      partial.options.D = optionDMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }
    
    return partial
  }

  const generateQuestion = useCallback(async () => {
    setIsLoading(true)
    setIsStreaming(true)
    setError(null)
    setCurrentQuestion(null)
    setPartialQuestion(null)
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

          switch (data.type) {
            case "character":
              accumulated += data.character
              // Update partial question display every few characters
              const partial = parsePartialJSON(accumulated)
              setPartialQuestion(partial)
              break

            case "chunk":
              accumulated += data.content
              // Update partial question display
              const partialChunk = parsePartialJSON(accumulated)
              setPartialQuestion(partialChunk)
              break

            case "complete":
              console.log('[Practice] Stream complete, accumulated length:', accumulated.length)
              eventSource.close()
              setIsStreaming(false)
              setIsLoading(false)

              // Parse the complete JSON
              try {
                let cleanContent = accumulated.trim()
                if (cleanContent.startsWith("```json")) {
                  cleanContent = cleanContent.slice(7)
                }
                if (cleanContent.startsWith("```")) {
                  cleanContent = cleanContent.slice(3)
                }
                if (cleanContent.endsWith("```")) {
                  cleanContent = cleanContent.slice(0, -3)
                }
                cleanContent = cleanContent.trim()

                const parsed = JSON.parse(cleanContent)
                
                if (parsed.question && parsed.options && parsed.correct) {
                  const question: Question = {
                    question: parsed.question,
                    options: {
                      A: parsed.options.A || parsed.options.a || '',
                      B: parsed.options.B || parsed.options.b || '',
                      C: parsed.options.C || parsed.options.c || '',
                      D: parsed.options.D || parsed.options.d || ''
                    },
                    correct: parsed.correct.toUpperCase(),
                    explanation: {
                      correct: parsed.explanation?.correct || '',
                      A: parsed.explanation?.A || parsed.explanation?.a || '',
                      B: parsed.explanation?.B || parsed.explanation?.b || '',
                      C: parsed.explanation?.C || parsed.explanation?.c || '',
                      D: parsed.explanation?.D || parsed.explanation?.d || ''
                    },
                    examTip: parsed.examTip || parsed.exam_tip || ''
                  }
                  console.log('[Practice] Successfully parsed question')
                  setCurrentQuestion(question)
                  setPartialQuestion(null)
                  startTimeRef.current = Date.now()
                } else {
                  throw new Error('Missing required fields')
                }
              } catch (parseError) {
                console.error('[Practice] Parse failed:', parseError)
                setError("Failed to parse question. Please try again.")
              }
              break

            case "error":
              eventSource.close()
              setIsStreaming(false)
              setIsLoading(false)
              setError(data.error || "An error occurred")
              break
          }
        } catch (e) {
          console.error("Event parse error:", e)
        }
      }

      eventSource.onerror = (error) => {
        console.error('[Practice] EventSource error:', error)
        eventSource.close()
        setIsStreaming(false)
        setIsLoading(false)
        setError("Connection error. Please try again.")
      }

      setTimeout(() => {
        if (eventSource.readyState !== EventSource.CLOSED) {
          console.log('[Practice] Stream timeout, closing')
          eventSource.close()
          setIsStreaming(false)
          setIsLoading(false)
          setError("Request timed out. Please try again.")
        }
      }, 120000)
    } catch (e) {
      setIsStreaming(false)
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
            {!currentQuestion && !isLoading && !error && !partialQuestion && (
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

            {/* Streaming state - show progressive question card */}
            {isStreaming && partialQuestion && (
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating question...</span>
                  </div>
                  <div className="text-lg font-medium leading-relaxed min-h-[60px]">
                    {partialQuestion.question || (
                      <span className="text-muted-foreground">Loading question...</span>
                    )}
                    {isStreaming && partialQuestion.question && !partialQuestion.options?.D && (
                      <span className="animate-pulse text-primary">|</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((letter) => {
                    const optionText = partialQuestion.options?.[letter as 'A' | 'B' | 'C' | 'D']
                    const nextLetter = letter === 'A' ? 'B' : letter === 'B' ? 'C' : letter === 'C' ? 'D' : null
                    const hasNextOption = nextLetter ? partialQuestion.options?.[nextLetter as 'A' | 'B' | 'C' | 'D'] : true
                    const isCurrentlyStreaming = isStreaming && optionText && !hasNextOption
                    
                    return (
                      <div
                        key={letter}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          optionText 
                            ? 'border-border bg-card' 
                            : 'border-dashed border-muted bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`font-semibold ${optionText ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {letter}.
                          </span>
                          <span className={optionText ? 'text-foreground' : 'text-muted-foreground'}>
                            {optionText || '...'}
                            {isCurrentlyStreaming && <span className="animate-pulse text-primary">|</span>}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  
                  <Button disabled className="w-full mt-4" size="lg">
                    Waiting for options...
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Initial loading before any content */}
            {isLoading && !partialQuestion && (
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </div>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <div key={letter} className="p-4 rounded-lg border-2 border-dashed border-muted bg-muted/30">
                      <div className="flex items-start gap-3">
                        <span className="font-semibold text-muted-foreground">{letter}.</span>
                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Completed question display */}
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
