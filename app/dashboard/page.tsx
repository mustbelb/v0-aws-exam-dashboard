// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
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

  // Create safe user object (serializable)
  const safeUser = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  }

  return (
    <DashboardClient 
      user={safeUser}
      isActive={isActive}
      subscriptionStatus={subscriptionStatus}
    />
  )
}
