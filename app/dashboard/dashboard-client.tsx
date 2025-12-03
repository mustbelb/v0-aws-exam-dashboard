"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProgressOverview } from "@/components/progress-overview"
import { ServiceGrid } from "@/components/service-grid"
import { certifications, type CertificationType } from "@/lib/services"

interface DashboardClientProps {
  user: {
    id: string
    email: string
    name: string
  }
  isActive: boolean
  subscriptionStatus: string
}

interface ProgressData {
  totalQuestions: number
  totalCorrect: number
  overallAccuracy: number
  streak: number
  serviceProgress: {
    service: string
    attempted: number
    correct: number
    accuracy: number
    lastPracticed: string
  }[]
}

export function DashboardClient({ 
  user, 
  isActive, 
  subscriptionStatus 
}: DashboardClientProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState<CertificationType>('SAA-C03')

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch('/api/progress')
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  // Create a map of service progress for the grid
  const serviceProgressMap = new Map(
    progress?.serviceProgress.map(p => [p.service, p.accuracy]) || []
  )

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-balance">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-muted-foreground text-pretty">
            Continue your AWS certification journey. You're making great progress!
          </p>
        </div>

        {/* Certification Selector */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Select Certification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {certifications.map((cert) => (
              <button
                key={cert.id}
                onClick={() => setSelectedCert(cert.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCert === cert.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cert.icon}</span>
                  <div>
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.id}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {cert.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Banner (if not active) */}
        {!isActive && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm">
              <strong>Free tier:</strong> You have 5 questions per day. 
              <a href="/pricing" className="text-primary hover:underline ml-1">
                Upgrade to Pro
              </a> for unlimited practice.
            </p>
          </div>
        )}

        {/* Progress Overview */}
        <ProgressOverview 
          readinessPercentage={progress?.overallAccuracy || 0}
          totalQuestions={progress?.totalQuestions || 0}
          currentStreak={progress?.streak || 0}
          loading={loading}
        />

        {/* Service Selection */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">
            Choose a Service to Practice
          </h3>
          <p className="text-muted-foreground">
            Showing services for {certifications.find(c => c.id === selectedCert)?.fullName}
          </p>
          <ServiceGrid 
            progressMap={serviceProgressMap} 
            certification={selectedCert}
          />
        </div>
      </main>
    </div>
  )
}
