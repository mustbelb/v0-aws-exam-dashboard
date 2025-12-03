"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface FeedbackProps {
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
}: FeedbackProps) {
  return (
    <Card className={`border-2 ${isCorrect ? "border-success" : "border-destructive"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <Badge className="bg-success text-success-foreground">Correct ✓</Badge>
                <span>Well done!</span>
              </>
            ) : (
              <>
                <Badge variant="destructive">Incorrect ✗</Badge>
                <span>Let's review</span>
              </>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Correct Answer Explanation */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-success/10 p-4 text-left font-medium hover:bg-success/20 transition-colors">
            <span>✓ Why {correctAnswer.toUpperCase()} is correct</span>
            <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-3 pb-1">
            <p className="text-sm leading-relaxed text-muted-foreground">{explanations.correct}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Wrong Answers Explanations */}
        {explanations.wrongAnswers.map((item) => (
          <Collapsible key={item.id}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted p-4 text-left font-medium hover:bg-muted/80 transition-colors">
              <span className={item.id === selectedAnswer && !isCorrect ? "text-destructive" : ""}>
                ✗ Why {item.id.toUpperCase()} is wrong
                {item.id === selectedAnswer && !isCorrect && " (Your answer)"}
              </span>
              <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-3 pb-1">
              <p className="text-sm leading-relaxed text-muted-foreground">{item.reason}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Exam Tip */}
        <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <h4 className="font-semibold text-sm mb-1">Exam Tip</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{examTip}</p>
            </div>
          </div>
        </div>

        <Button onClick={onNextQuestion} size="lg" className="w-full">
          Next Question →
        </Button>
      </CardContent>
    </Card>
  )
}
