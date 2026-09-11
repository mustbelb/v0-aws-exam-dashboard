"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react"

interface FeedbackDisplayProps {
  isCorrect: boolean
  correctAnswer: string
  selectedAnswer: string
  explanations: {
    correct: string
    wrongAnswers: { id: string; reason: string }[]
  }
  examTip: string
  onNextQuestion: () => void
}

export function FeedbackDisplay({
  isCorrect,
  correctAnswer,
  selectedAnswer,
  explanations,
  examTip,
  onNextQuestion,
}: FeedbackDisplayProps) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-primary">Correct!</CardTitle>
                <p className="text-sm text-muted-foreground">Your reasoning is on track.</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <CardTitle className="text-destructive">A chance to learn</CardTitle>
                <p className="text-sm text-muted-foreground">
                  The correct answer was{" "}
                  <Badge variant="outline" className="ml-1">
                    {correctAnswer.toUpperCase()}
                  </Badge>
                </p>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Correct Answer Explanation */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Why {correctAnswer.toUpperCase()} is correct
          </h4>
          <p className="text-base leading-relaxed">{explanations.correct}</p>
        </div>

        {/* Wrong Answer Explanations */}
        {explanations.wrongAnswers.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="wrong-answers">
              <AccordionTrigger className="text-sm">
                Why the other options are incorrect
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {explanations.wrongAnswers.map((wrong) => (
                    <div key={wrong.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={wrong.id === selectedAnswer.toLowerCase() ? "destructive" : "outline"}
                          className="font-mono"
                        >
                          {wrong.id.toUpperCase()}
                        </Badge>
                        {wrong.id === selectedAnswer.toLowerCase() && (
                          <span className="text-xs text-muted-foreground">(Your answer)</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-2">
                        {wrong.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Exam Tip */}
        {examTip && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Exam Tip</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {examTip}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Question Button */}
        <Button onClick={onNextQuestion} className="w-full" size="lg">
          Next Question
        </Button>
      </CardContent>
    </Card>
  )
}
