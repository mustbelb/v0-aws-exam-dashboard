"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { allExplainers } from "@/components/explainers"

interface ExplainerModalProps {
  explainerId: string
  question?: {
    question: string
    correct: string
  } | null
  selectedAnswer?: string
  onClose: () => void
  onNextQuestion?: () => void
}

export function ExplainerModal({
  explainerId,
  question,
  selectedAnswer,
  onClose,
  onNextQuestion
}: ExplainerModalProps) {
  const [isQuestionExpanded, setIsQuestionExpanded] = useState(true)
  
  // Get the explainer component
  const ExplainerComponent = allExplainers[explainerId]
  
  if (!ExplainerComponent) {
    console.warn(`No explainer found for: ${explainerId}`)
    return null
  }

  const handleGotIt = () => {
    onClose()
    if (onNextQuestion) {
      onNextQuestion()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Sticky Question Header */}
        {question && (
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-sm">✗</span>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  Let's review this concept
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQuestionExpanded(!isQuestionExpanded)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
                  title={isQuestionExpanded ? "Collapse question" : "Expand question"}
                >
                  {isQuestionExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Collapsible Question Content */}
            {isQuestionExpanded && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-300 line-clamp-3">
                  {question.question}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-red-400">
                    Your answer: <strong>{selectedAnswer?.toUpperCase()}</strong>
                  </span>
                  <span className="text-green-400">
                    Correct: <strong>{question.correct?.toUpperCase()}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Explainer Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <ExplainerComponent />
        </div>
        
        {/* Footer with Action Button */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span>Understanding this concept will help with similar questions</span>
            </div>
            <Button 
              onClick={handleGotIt}
              className="bg-green-600 hover:bg-green-500 text-white px-6"
            >
              ✓ Got it - Next Question
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
