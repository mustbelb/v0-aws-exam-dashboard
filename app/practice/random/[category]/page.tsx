// app/practice/random/[category]/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RandomPracticeClient } from "./random-practice-client"
import { getCategoryById, getServicesInCategory, type CertificationType } from "@/lib/services"
import { cookies } from "next/headers"

interface PageProps {
  params: { category: string }
  searchParams: { cert?: string }
}

export default async function RandomPracticePage({ params, searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Get certification from searchParams or cookie, default to DVA-C02
  const certification = (searchParams.cert || "DVA-C02") as CertificationType
  
  // Get category info
  const category = getCategoryById(params.category)
  
  if (!category) {
    redirect("/dashboard")
  }
  
  // Get services in this category for this certification
  const servicesInCategory = getServicesInCategory(params.category, certification)
  
  if (servicesInCategory.length === 0) {
    redirect("/dashboard")
  }

  // Get user's progress for services in this category
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("service, questions_attempted, questions_correct")
    .eq("user_id", user.id)
    .eq("certification", certification)
    .in("service", servicesInCategory.map(s => s.id))

  const categoryProgress = {
    totalAttempted: progressData?.reduce((sum, p) => sum + (p.questions_attempted || 0), 0) || 0,
    totalCorrect: progressData?.reduce((sum, p) => sum + (p.questions_correct || 0), 0) || 0
  }
  
  const correctRate = categoryProgress.totalAttempted > 0
    ? Math.round((categoryProgress.totalCorrect / categoryProgress.totalAttempted) * 100)
    : 0

  // Get user info
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single()

  const safeUser = {
    id: user.id,
    email: user.email || "",
    name: profile?.name || user.email?.split("@")[0] || "User"
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single()

  const isActive = subscription?.status === "active" || subscription?.status === "trialing"

  return (
    <RandomPracticeClient
      user={safeUser}
      isActive={isActive}
      subscriptionStatus={subscription?.status || "none"}
      category={category}
      servicesInCategory={servicesInCategory}
      categoryProgress={{
        questionsAnswered: categoryProgress.totalAttempted,
        correctRate: correctRate
      }}
      certification={certification}
    />
  )
}
