"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { FeedbackDisplay } from "@/components/feedback-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Loader2, PartyPopper, Zap, Shuffle } from "lucide-react"
import type { ServiceDefinition, CategoryDefinition, CertificationType } from "@/lib/services"

interface RandomPracticeClientProps {
  user: {
    id: string
    email: string
    name: string
  }
  isActive: boolean
  subscriptionStatus: string
  category: CategoryDefinition
  servicesInCategory: ServiceDefinition[]
  categoryProgress: {
    questionsAnswered: number
    correctRate: number
  }
  certification: CertificationType
}

interface Question {
  questionId?: string
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
  service?: string
  serviceName?: string
  serviceIcon?: string
}

interface PartialQuestion {
  question?: string
  options?: {
    A?: string
    B?: string
    C?: string
    D?: string
  }
}

export function RandomPracticeClient({
  user,
  isActive,
  subscriptionStatus,
  category,
  servicesInCategory,
  categoryProgress,
  certification
}: RandomPracticeClientProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [partialQuestion, setPartialQuestion] = useState<PartialQuestion | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(categoryProgress.questionsAnswered)
  const [correctCount, setCorrectCount] = useState(
    Math.round((categoryProgress.correctRate / 100) * categoryProgress.questionsAnswered)
  )
  
  // Current service being shown (for random mode)
  const [currentService, setCurrentService] = useState<{
    id: string
    name: string
    icon: string
  } | null>(null)
  
  // Bank exhausted state
  const [bankExhausted, setBankExhausted] = useState(false)
  const [showExhaustedMessage, setShowExhaustedMessage] = useState(false)
  const [useStreamingMode, setUseStreamingMode] = useState(false)
  
  const startTimeRef = useRef<number>(0)

  // Fetch random question from category
  const fetchRandomQuestion = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setCurrentQuestion(null)
    setShowFeedback(false)
    setSelectedAnswer("")
    setCurrentService(null)

    try {
      const params = new URLSearchParams({
        category: category.id,
        certification: certification
      })

      const response = await fetch(`/api/question/next?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        if (data.bankEmpty) {
          setError("No questions available for this category yet. Try another category or check back later.")
          setIsLoading(false)
          return
        }
        throw new Error(data.error || "Failed to fetch question")
      }

      // Check if bank is exhausted for entire category
      if (data.bankExhausted) {
        setBankExhausted(true)
        setShowExhaustedMessage(true)
        setIsLoading(false)
        return
      }

      // Set current service info
      setCurrentService({
        id: data.service,
        name: data.serviceName || data.service,
        icon: data.serviceIcon || '📦'
      })

      // Success - instant question!
      setCurrentQuestion({
        questionId: data.questionId,
        question: data.question,
        options: data.options,
        correct: data.correct,
        explanation: data.explanation,
        examTip: data.examTip,
        service: data.service,
        serviceName: data.serviceName,
        serviceIcon: data.serviceIcon
      })
      startTimeRef.current = Date.now()
      setIsLoading(false)

    } catch (e) {
      console.error("Error fetching from bank:", e)
      setError("Failed to load question. Please try again.")
      setIsLoading(false)
    }
  }, [category.id, certification])

  // Streaming fallback (same as practice-client.tsx)
  const generateQuestionStreaming = useCallback(async () => {
    // Pick a random service from the category
    const randomService = servicesInCategory[Math.floor(Math.random() * servicesInCategory.length)]
    
    setIsLoading(true)
    setIsStreaming(true)
    setError(null)
    setCurrentQuestion(null)
    setPartialQuestion(null)
    setShowFeedback(false)
    setSelectedAnswer("")
    setCurrentService({
      id: randomService.id,
      name: randomService.name,
      icon: randomService.icon
    })

    const params = new URLSearchParams({
      service: randomService.id,
      userId: user.id,
      certification: certification
    })

    try {
      const streamUrl = `/api/question/generate?${params.toString()}`
      const eventSource = new EventSource(streamUrl)
      let accumulated = ""

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case "character":
            case "chunk":
              accumulated += data.character || data.content || ""
              // Parse partial question (simplified)
              const partial: PartialQuestion = {}
              const questionMatch = accumulated.match(/QUESTION[:\s]*\n?([\s\S]*?)(?=\nOPTION_A[:\s]|$)/i)
              if (questionMatch) partial.question = questionMatch[1].trim()
              
              partial.options = {}
              const optAMatch = accumulated.match(/OPTION_A[:\s]*\n?([\s\S]*?)(?=\nOPTION_B[:\s]|$)/i)
              if (optAMatch) partial.options.A = optAMatch[1].trim()
              const optBMatch = accumulated.match(/OPTION_B[:\s]*\n?([\s\S]*?)(?=\nOPTION_C[:\s]|$)/i)
              if (optBMatch) partial.options.B = optBMatch[1].trim()
              const optCMatch = accumulated.match(/OPTION_C[:\s]*\n?([\s\S]*?)(?=\nOPTION_D[:\s]|$)/i)
              if (optCMatch) partial.options.C = optCMatch[1].trim()
              const optDMatch = accumulated.match(/OPTION_D[:\s]*\n?([\s\S]*?)(?=\nCORRECT[:\s]|$)/i)
              if (optDMatch) partial.options.D = optDMatch[1].trim()
              
              setPartialQuestion(partial)
              
              // Check if ready for interaction
              if (partial.question && partial.options?.A && partial.options?.B && partial.options?.C && partial.options?.D) {
                const correctMatch = accumulated.match(/\nCORRECT[:\s]*\n?([A-Da-d])/i)
                if (correctMatch) {
                  const earlyQuestion: Question = {
                    question: partial.question,
                    options: {
                      A: partial.options.A,
                      B: partial.options.B,
                      C: partial.options.C,
                      D: partial.options.D
                    },
                    correct: correctMatch[1].toUpperCase(),
                    explanation: { correct: '' },
                    examTip: '',
                    service: randomService.id,
                    serviceName: randomService.name,
                    serviceIcon: randomService.icon
                  }
                  setCurrentQuestion(earlyQuestion)
                  setPartialQuestion(null)
                  setIsStreaming(false)
                  setIsLoading(false)
                  startTimeRef.current = Date.now()
                }
              }
              break

            case "complete":
              eventSource.close()
              setIsStreaming(false)
              setIsLoading(false)
              // Parse full response if not already done
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

      eventSource.onerror = () => {
        eventSource.close()
        setIsStreaming(false)
        setIsLoading(false)
        setError("Connection error. Please try again.")
      }

    } catch (e) {
      setIsStreaming(false)
      setIsLoading(false)
      setError("Failed to start question generation")
    }
  }, [servicesInCategory, user.id, certification])

  const getNextQuestion = useCallback(() => {
    if (useStreamingMode) {
      generateQuestionStreaming()
    } else {
      fetchRandomQuestion()
    }
  }, [useStreamingMode, generateQuestionStreaming, fetchRandomQuestion])

  const handleContinueWithStreaming = () => {
    setShowExhaustedMessage(false)
    setUseStreamingMode(true)
    generateQuestionStreaming()
  }

  const handleTryAnotherCategory = () => {
    router.push('/dashboard')
  }

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
          questionId: currentQuestion.questionId,
          service: currentService?.id || currentQuestion.service,
          certification: certification,
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

  const formattedOptions = currentQuestion
    ? [
        { id: "a", text: currentQuestion.options.A },
        { id: "b", text: currentQuestion.options.B },
        { id: "c", text: currentQuestion.options.C },
        { id: "d", text: currentQuestion.options.D }
      ]
    : []

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
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {certification === 'SAA-C03' ? '🏗️ Solutions Architect' : '💻 Developer'} Associate
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 flex items-center gap-1">
              <Shuffle className="h-3 w-3" />
              Random Mode
            </span>
            {useStreamingMode && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Live Generation
              </span>
            )}
          </div>
          <h2 className="text-3xl font-bold text-balance flex items-center gap-3">
            <span className="text-4xl">{category.icon}</span>
            Random {category.name} Practice
          </h2>
          <p className="text-muted-foreground mt-2">
            Questions from: {servicesInCategory.map(s => s.name).join(', ')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            {/* Current Service Indicator */}
            {currentService && !showFeedback && currentQuestion && (
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-xl">{currentService.icon}</span>
                <span>Current: <strong>{currentService.name}</strong></span>
              </div>
            )}

            {/* Initial state */}
            {!currentQuestion && !isLoading && !error && !partialQuestion && !showExhaustedMessage && (
              <div className="text-center py-12">
                <Shuffle className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                <p className="text-muted-foreground mb-4">
                  Ready to test your {category.name} knowledge across all services?
                </p>
                <Button onClick={getNextQuestion} size="lg">
                  Start Random Practice
                </Button>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={getNextQuestion} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Bank Exhausted Message */}
            {showExhaustedMessage && (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <PartyPopper className="h-12 w-12 mx-auto mb-4 text-primary" />
                  
                  <h3 className="text-xl font-semibold mb-2">
                    🎉 You've completed all {category.name} questions!
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Questions will now be generated in real-time until the next batch 
                    update. This may take a few seconds per question.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleContinueWithStreaming} className="gap-2">
                      <Zap className="h-4 w-4" />
                      Continue with Live Questions
                    </Button>
                    
                    <Button variant="outline" onClick={handleTryAnotherCategory} className="gap-2">
                      Try Another Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Streaming state */}
            {isStreaming && partialQuestion && (
              <Card className="w-full">
                <CardHeader className="pb-4">
                  {currentService && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{currentService.icon}</span>
                      <span>{currentService.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating question...</span>
                  </div>
                  <div className="text-lg font-medium leading-relaxed min-h-[60px]">
                    {partialQuestion.question || (
                      <span className="text-muted-foreground">Loading question...</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((letter) => {
                    const optionText = partialQuestion.options?.[letter as 'A' | 'B' | 'C' | 'D']
                    return (
                      <div
                        key={letter}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          optionText ? 'border-border bg-card' : 'border-dashed border-muted bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`font-semibold ${optionText ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {letter}.
                          </span>
                          <span className={optionText ? 'text-foreground' : 'text-muted-foreground'}>
                            {optionText || '...'}
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

            {/* Loading state */}
            {isLoading && !isStreaming && !partialQuestion && (
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading question...</span>
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
              <>
                {currentService && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-xl">{currentService.icon}</span>
                    <span>Service: <strong>{currentService.name}</strong></span>
                  </div>
                )}
                <FeedbackDisplay
                  isCorrect={isCorrect}
                  correctAnswer={currentQuestion.correct}
                  selectedAnswer={selectedAnswer}
                  explanations={formattedExplanations}
                  examTip={currentQuestion.examTip}
                  onNextQuestion={getNextQuestion}
                />
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">Random Mode</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{questionsAnswered}</p>
                    <p className="text-sm text-muted-foreground">Answered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentAccuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Services in this category:</p>
                  <div className="flex flex-wrap gap-2">
                    {servicesInCategory.map(service => (
                      <span 
                        key={service.id} 
                        className={`text-xs px-2 py-1 rounded-full ${
                          currentService?.id === service.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {service.icon} {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
