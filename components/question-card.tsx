"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

interface Option {
  id: string
  text: string
}

interface QuestionCardProps {
  question: string
  options: Option[]
  onSubmit: (selectedOption: string) => void
  isLoading?: boolean
}

export function QuestionCard({ question, options, onSubmit, isLoading }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption)
      setSelectedOption("")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">{question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id}>
                <Label
                  htmlFor={option.id}
                  className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">{option.id.toUpperCase()}.</div>
                    <div className="text-sm leading-relaxed text-muted-foreground mt-1">
                      {option.text}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Button 
          onClick={handleSubmit} 
          disabled={!selectedOption} 
          className="w-full" 
          size="lg"
        >
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  )
}
