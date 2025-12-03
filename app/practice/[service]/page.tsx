// app/practice/[service]/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { PracticeClient } from "./practice-client"
import { getServiceById } from "@/lib/services"

interface PracticePageProps {
  params: Promise<{ service: string }>
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { service: serviceId } = await params
  
  // Validate service exists
  const service = getServiceById(serviceId)
  if (!service) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check subscription status
  let isActive = false
  let subscriptionStatus = "none"

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single()

  if (sub) {
    isActive = sub.status === "active" || sub.status === "trialing"
    subscriptionStatus = sub.status
  }

  // Get service-specific progress
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("service", serviceId)
    .single()

  // Create safe user object
  const safeUser = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  }

  const serviceProgress = progress ? {
    questionsAnswered: progress.questions_attempted,
    correctRate: progress.questions_attempted > 0
      ? Math.round((progress.questions_correct / progress.questions_attempted) * 100)
      : 0,
    lastPracticed: progress.last_practiced_at
  } : {
    questionsAnswered: 0,
    correctRate: 0,
    lastPracticed: null
  }

  return (
    <PracticeClient
      user={safeUser}
      isActive={isActive}
      subscriptionStatus={subscriptionStatus}
      service={service}
      serviceProgress={serviceProgress}
    />
  )
}
