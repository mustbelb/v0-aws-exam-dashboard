"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { FeedbackDisplay } from "@/components/feedback-display"
import { ServiceSidebar } from "@/components/service-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Loader2, PartyPopper, Zap } from "lucide-react"
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

    try {
      const params = new URLSearchParams({
        service: service.id,
        certification: certification
      })

      const response = await fetch(`/api/question/next?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        if (data.bankEmpty) {
          // No questions exist for this service at all
          setError("No questions available for this service yet. Try another service or check back later.")
          setIsLoading(false)
          return
        }
        throw new Error(data.error || "Failed to fetch question")
      }

      // Check if bank is exhausted for this user
      if (data.bankExhausted) {
        setBankExhausted(true)
        setShowExhaustedMessage(true)
        setTotalQuestionsInBank(data.totalQuestions || 0)
        setIsLoading(false)
        return
      }

      // Success - instant question!
      setCurrentQuestion({
        questionId: data.questionId,
        question: data.question,
        options: data.options,
        correct: data.correct,
        explanation: data.explanation,
        examTip: data.examTip
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
  
  // Progressive JSON parser - extracts partial data as it streams
  const parsePartialJSON = (text: string): PartialQuestion => {
    const partial: PartialQuestion = {}
    
    const questionMatch = text.match(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
    if (questionMatch) {
      partial.question = questionMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
    }
    
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

  // Plain text parser for QUESTION:/OPTION_A: format
  const parsePlainTextQuestion = (text: string): Question | null => {
    try {
      const extractSection = (label: string): string => {
        const regex = new RegExp(
          `${label}[:\\s]*\\n?([\\s\\S]*?)(?=\\n(?:QUESTION|OPTION_[A-D]|CORRECT|EXPLANATION_(?:CORRECT|[A-D])|EXAM_TIP)[:\\s]|$)`,
          'i'
        )
        const match = text.match(regex)
        return match ? match[1].trim() : ''
      }

      const question = extractSection('QUESTION')
      const optionA = extractSection('OPTION_A')
      const optionB = extractSection('OPTION_B')
      const optionC = extractSection('OPTION_C')
      const optionD = extractSection('OPTION_D')
      const correctRaw = extractSection('CORRECT')
      const correct = correctRaw.toUpperCase().trim().charAt(0)
      const explanationCorrect = extractSection('EXPLANATION_CORRECT')
      const explanationA = extractSection('EXPLANATION_A')
      const explanationB = extractSection('EXPLANATION_B')
      const explanationC = extractSection('EXPLANATION_C')
      const explanationD = extractSection('EXPLANATION_D')
      const examTip = extractSection('EXAM_TIP')

      if (!question || !optionA || !optionB || !optionC || !optionD || !correct) {
        return null
      }

      return {
        question,
        options: { A: optionA, B: optionB, C: optionC, D: optionD },
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
      console.error('[PlainTextParser] Error:', e)
      return null
    }
  }

  // Progressive plain text parser for streaming display
  const parsePartialPlainText = (text: string): PartialQuestion => {
    const partial: PartialQuestion = {}
    
    const questionMatch = text.match(/QUESTION[:\s]*\n?([\s\S]*?)(?=\nOPTION_A[:\s]|$)/i)
    if (questionMatch) {
      partial.question = questionMatch[1].trim()
    }
    
    partial.options = {}
    
    const optionAMatch = text.match(/OPTION_A[:\s]*\n?([\s\S]*?)(?=\nOPTION_B[:\s]|$)/i)
    if (optionAMatch) {
      partial.options.A = optionAMatch[1].trim()
    }
    
    const optionBMatch = text.match(/OPTION_B[:\s]*\n?([\s\S]*?)(?=\nOPTION_C[:\s]|$)/i)
    if (optionBMatch) {
      partial.options.B = optionBMatch[1].trim()
    }
    
    const optionCMatch = text.match(/OPTION_C[:\s]*\n?([\s\S]*?)(?=\nOPTION_D[:\s]|$)/i)
    if (optionCMatch) {
      partial.options.C = optionCMatch[1].trim()
    }
    
    const optionDMatch = text.match(/OPTION_D[:\s]*\n?([\s\S]*?)(?=\nCORRECT[:\s]|$)/i)
    if (optionDMatch) {
      partial.options.D = optionDMatch[1].trim()
    }
    
    return partial
  }

  const generateQuestionStreaming = useCallback(async () => {
    setIsLoading(true)
    setIsStreaming(true)
    setError(null)
    setCurrentQuestion(null)
    setPartialQuestion(null)
    setShowFeedback(false)
    setSelectedAnswer("")

    const params = new URLSearchParams({
      service: service.id,
      userId: user.id,
      certification: certification
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
              let partial: PartialQuestion
              if (accumulated.trim().startsWith('{')) {
                partial = parsePartialJSON(accumulated)
              } else {
                partial = parsePartialPlainText(accumulated)
              }
              setPartialQuestion(partial)
              
              if (!currentQuestion && partial.question && 
                  partial.options?.A && partial.options?.B && 
                  partial.options?.C && partial.options?.D) {
                
                let correctAnswer = ''
                if (accumulated.trim().startsWith('{')) {
                  const correctMatch = accumulated.match(/"correct"\s*:\s*"([A-Da-d])"/i)
                  if (correctMatch) {
                    correctAnswer = correctMatch[1].toUpperCase()
                  }
                } else {
                  const correctMatch = accumulated.match(/\nCORRECT[:\s]*\n?([A-Da-d])/i)
                  if (correctMatch) {
                    correctAnswer = correctMatch[1].toUpperCase()
                  }
                }
                
                if (correctAnswer) {
                  const earlyQuestion: Question = {
                    question: partial.question,
                    options: {
                      A: partial.options.A,
                      B: partial.options.B,
                      C: partial.options.C,
                      D: partial.options.D
                    },
                    correct: correctAnswer,
                    explanation: { correct: '', A: '', B: '', C: '', D: '' },
                    examTip: ''
                  }
                  setCurrentQuestion(earlyQuestion)
                  setPartialQuestion(null)
                  setIsStreaming(false)
                  setIsLoading(false)
                  startTimeRef.current = Date.now()
                }
              }
              break

            case "chunk":
              accumulated += data.content
              let partialChunk: PartialQuestion
              if (accumulated.trim().startsWith('{')) {
                partialChunk = parsePartialJSON(accumulated)
              } else {
                partialChunk = parsePartialPlainText(accumulated)
              }
              setPartialQuestion(partialChunk)
              
              if (!currentQuestion && partialChunk.question && 
                  partialChunk.options?.A && partialChunk.options?.B && 
                  partialChunk.options?.C && partialChunk.options?.D) {
                
                let correctAnswer = ''
                if (accumulated.trim().startsWith('{')) {
                  const correctMatch = accumulated.match(/"correct"\s*:\s*"([A-Da-d])"/i)
                  if (correctMatch) {
                    correctAnswer = correctMatch[1].toUpperCase()
                  }
                } else {
                  const correctMatch = accumulated.match(/\nCORRECT[:\s]*\n?([A-Da-d])/i)
                  if (correctMatch) {
                    correctAnswer = correctMatch[1].toUpperCase()
                  }
                }
                
                if (correctAnswer) {
                  const earlyQuestion: Question = {
                    question: partialChunk.question,
                    options: {
                      A: partialChunk.options.A,
                      B: partialChunk.options.B,
                      C: partialChunk.options.C,
                      D: partialChunk.options.D
                    },
                    correct: correctAnswer,
                    explanation: { correct: '', A: '', B: '', C: '', D: '' },
                    examTip: ''
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

                let fullQuestion: Question | null = null

                if (cleanContent.startsWith('{')) {
                  const parsed = JSON.parse(cleanContent)
                  
                  if (parsed.question && parsed.options && parsed.correct) {
                    fullQuestion = {
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
                  }
                } else {
                  fullQuestion = parsePlainTextQuestion(cleanContent)
                }

                if (fullQuestion) {
                  setCurrentQuestion(fullQuestion)
                  setPartialQuestion(null)
                  if (startTimeRef.current === 0) {
                    startTimeRef.current = Date.now()
                  }
                } else if (!currentQuestion) {
                  throw new Error('Failed to parse question from response')
                }
              } catch (parseError) {
                console.error('[Practice] Parse failed:', parseError)
                if (!currentQuestion) {
                  setError("Failed to parse question. Please try again.")
                }
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
  }, [service.id, user.id, certification, currentQuestion])

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

  // Handle continuing with streaming after bank exhausted
  const handleContinueWithStreaming = () => {
    setShowExhaustedMessage(false)
    setUseStreamingMode(true)
    generateQuestionStreaming()
  }

  // Handle trying another service
  const handleTryAnotherService = () => {
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
          service: service.id,
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

  const handleNextQuestion = () => {
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
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {certification === 'SAA-C03' ? '🏗️ Solutions Architect' : '💻 Developer'} Associate
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
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div>
            {/* Initial state - no question yet */}
            {!currentQuestion && !isLoading && !error && !partialQuestion && !showExhaustedMessage && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Ready to test your {service.name} knowledge?
                </p>
                <Button onClick={getNextQuestion} size="lg">
                  Start Practice
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
                    🎉 You've completed all {totalQuestionsInBank} {service.name} questions!
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
