"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { streamQuestionGeneration } from "@/lib/question-generation-client"
import { parseIssuedQuestion } from "@/lib/generated-question"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { FeedbackDisplay } from "@/components/feedback-display"
import { ServiceSidebar } from "@/components/service-sidebar"
import { ExplainerModal } from "@/components/explainer-modal"
import { allExplainers } from "@/components/explainers"
import { getExplainerForService } from "@/lib/explainer-mapping"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Loader2, PartyPopper, Zap, Lightbulb } from "lucide-react"
import type { ServiceDefinition, CertificationType } from "@/lib/services"

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
  certification: CertificationType
}

interface Question {
  issuanceId: string
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
  topic?: string  // Topic for targeted explainer (e.g., "lambda-cold-starts")
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
  serviceProgress,
  certification
}: PracticeClientProps) {
  const router = useRouter()
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

  // Bank exhausted state
  const [bankExhausted, setBankExhausted] = useState(false)
  const [showExhaustedMessage, setShowExhaustedMessage] = useState(false)
  const [useStreamingMode, setUseStreamingMode] = useState(false)
  const [totalQuestionsInBank, setTotalQuestionsInBank] = useState(0)

  // NEW: Explainer modal state
  const [showExplainer, setShowExplainer] = useState(false)
  const [currentExplainerId, setCurrentExplainerId] = useState<string | null>(null)

  const startTimeRef = useRef<number>(0)

  // ===========================================
  // PRIMARY: Fetch from DynamoDB question bank
  // ===========================================
  const fetchQuestionFromBank = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setCurrentQuestion(null)
    setShowFeedback(false)
    setSelectedAnswer("")
    setShowExplainer(false)  // NEW: Reset explainer state

    try {
      const params = new URLSearchParams({
        service: service.id,
        certification: certification
      })

      const response = await fetch(`/api/question/next?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        if (data.bankEmpty) {
          setError("No questions available for this service yet. Try another service or check back later.")
          setIsLoading(false)
          return
        }
        throw new Error(data.error || "Failed to fetch question")
      }

      if (data.bankExhausted) {
        setBankExhausted(true)
        setShowExhaustedMessage(true)
        setTotalQuestionsInBank(data.totalQuestions || 0)
        setIsLoading(false)
        return
      }

      setCurrentQuestion({
        issuanceId: data.issuanceId,
        questionId: data.questionId,
        question: data.question,
        options: data.options,
        correct: "",
        explanation: {correct: ""},
        examTip: "",
        topic: data.topic  // Include topic for targeted explainer
      })
      startTimeRef.current = Date.now()
      setIsLoading(false)
    } catch (e) {
      console.error("Error fetching from bank:", e)
      setError("Failed to load question. Please try again.")
      setIsLoading(false)
    }
  }, [service.id, certification])

  // ===========================================
  // FALLBACK: Stream question from AI (when bank exhausted)
  // ===========================================

  const activeStream = useRef<AbortController | null>(null)
  useEffect(() => () => { activeStream.current?.abort(); activeStream.current = null }, [])

  const generateQuestionStreaming = useCallback(async () => {
    setIsLoading(true)
    setIsStreaming(true)
    setError(null)
    setCurrentQuestion(null)
    setPartialQuestion(null)
    setShowFeedback(false)
    setSelectedAnswer("")
    setShowExplainer(false)  // NEW: Reset explainer state

    activeStream.current?.abort()
    const controller = new AbortController()
    activeStream.current = controller
    const timeout = setTimeout(() => controller.abort(), 120000)
    try {
      await streamQuestionGeneration({service:service.id, certification}, data => {
        if (data.type === 'partial') {
          setPartialQuestion(data.question as PartialQuestion)
        } else if (data.type === 'complete') {
          const question = parseIssuedQuestion(data.question)
          if (!question) throw new Error('The generated question was incomplete. Please try again.')
          setCurrentQuestion({...question, correct:'', explanation:{correct:''}, examTip:''})
          setPartialQuestion(null)
          setIsStreaming(false)
          setIsLoading(false)
          startTimeRef.current = Date.now()
        }
      }, controller.signal)
    } catch (error) {
      if (activeStream.current !== controller) return
      setIsStreaming(false)
      setIsLoading(false)
      setPartialQuestion(null)
      setError(controller.signal.aborted ? 'Generation stopped. Please try again.' : error instanceof Error ? error.message : 'Generation failed. Please try again.')
    } finally {
      clearTimeout(timeout)
    }

  }, [service.id, user.id, certification])

  // ===========================================
  // Main function to get next question
  // ===========================================
  const getNextQuestion = useCallback(() => {
    if (useStreamingMode) {
      generateQuestionStreaming()
    } else {
      fetchQuestionFromBank()
    }
  }, [useStreamingMode, generateQuestionStreaming, fetchQuestionFromBank])

  const handleContinueWithStreaming = () => {
    setShowExhaustedMessage(false)
    setUseStreamingMode(true)
    generateQuestionStreaming()
  }

  const handleTryAnotherService = () => {
    router.push('/dashboard')
  }

  // ===========================================
  // UPDATED: Handle submit with explainer trigger
  // ===========================================
  const handleSubmit = async (answer: string) => {
    if (!currentQuestion) return

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)

    const response = await fetch("/api/question/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issuanceId: currentQuestion.issuanceId,
          userAnswer: answer,
          timeTakenSeconds: timeTaken
        })
      })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      throw new Error(result.error || "Your answer could not be saved. Please try again.")
    }

    const result = await response.json()
    setCurrentQuestion({...currentQuestion, correct: result.correctAnswer, explanation: result.explanation, examTip: result.examTip})
    const correct = result.answeredCorrectly === true
    const totals = (result.serviceProgress as Array<{ service: string; attempted: number; correct: number }>)
      .filter(row => row.service === service.id)
    setSelectedAnswer(result.userAnswer.toLowerCase())
    setIsCorrect(correct)
    setShowFeedback(true)
    setQuestionsAnswered(totals.reduce((sum, row) => sum + row.attempted, 0))
    setCorrectCount(totals.reduce((sum, row) => sum + row.correct, 0))

    // Set up explainer for wrong answers - use question's topic if available
    if (!correct) {
      // Try to use the question's specific topic first
      let explainerId: string | null = null

      if (currentQuestion.topic && allExplainers[currentQuestion.topic]) {
        // Use the question's topic if it has a matching explainer
        explainerId = currentQuestion.topic
      } else {
        // Fall back to service-level default explainer
        explainerId = getExplainerForService(service.id)
      }

      if (explainerId) {
        setCurrentExplainerId(explainerId)
      }
    }

  }

  // NEW: Handle showing explainer
  const handleShowExplainer = () => {
    if (currentExplainerId) {
      setShowExplainer(true)
    }
  }

  // NEW: Handle closing explainer and moving to next question
  const handleExplainerClose = () => {
    setShowExplainer(false)
  }

  const handleNextQuestion = () => {
    setShowExplainer(false)
    setCurrentExplainerId(null)
    getNextQuestion()
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
    <div className="min-h-screen bg-background practice-surface">
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
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {certification === 'SAA-C03' ? 'Solutions Architect' : 'Developer'} Associate
            </span>
            {useStreamingMode && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Live Generation
              </span>
            )}
          </div>
          <h2 className="text-3xl font-bold text-balance flex items-center gap-3">
            <span className="text-4xl">{service.icon}</span>
            {service.name} Practice
          </h2>
          <p className="text-muted-foreground mt-2">{service.description}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main Content */}
          <div>
            {/* Initial state - no question yet */}
            {!currentQuestion && !isLoading && !error && !partialQuestion && !showExhaustedMessage && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Ready to test your {service.name} knowledge?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={getNextQuestion} size="lg">
                    Start Practice
                  </Button>
                  <Button onClick={handleContinueWithStreaming} variant="outline" size="lg">
                    <Zap className="mr-2 h-4 w-4" />
                    Generate a new question
                  </Button>
                </div>
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
                    You've completed all {totalQuestionsInBank} {service.name} questions!
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

                    <Button variant="outline" onClick={handleTryAnotherService} className="gap-2">
                      Try Another Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isStreaming && !partialQuestion && (
              <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground" role="status">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating your question…
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

            {/* Initial loading state (instant fetch) */}
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

            {/* Completed question display */}
            {currentQuestion && !showFeedback && !isLoading && (
              <QuestionCard
                question={currentQuestion.question}
                options={formattedOptions}
                onSubmit={handleSubmit}
                isLoading={false}
              />
            )}

            {/* Feedback display - UPDATED with Learn More button */}
            {showFeedback && currentQuestion && (
              <div className="space-y-4">
                <FeedbackDisplay
                  isCorrect={isCorrect}
                  correctAnswer={currentQuestion.correct}
                  selectedAnswer={selectedAnswer}
                  explanations={formattedExplanations}
                  examTip={currentQuestion.examTip}
                  onNextQuestion={handleNextQuestion}
                />

                {/* NEW: Learn More button for wrong answers */}
                {!isCorrect && currentExplainerId && (
                  <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Want to understand this better?</p>
                            <p className="text-sm text-muted-foreground">
                              View an interactive explainer for {service.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleShowExplainer}
                          variant="outline"
                          className="border-yellow-500/50 hover:bg-yellow-500/10"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
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

      {/* NEW: Explainer Modal */}
      {showExplainer && currentExplainerId && (
        <ExplainerModal
          explainerId={currentExplainerId}
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onClose={handleExplainerClose}
          onNextQuestion={handleNextQuestion}
        />
      )}
    </div>
  )
}
