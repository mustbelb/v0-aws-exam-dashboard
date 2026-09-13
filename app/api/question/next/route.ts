export const dynamic = 'force-dynamic'
// app/api/question/next/route.ts
// Fetches a random unseen question from the DynamoDB question bank
// Supports both specific service and random category mode

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { issueQuestion } from "@/lib/issued-question"
import { getSeenQuestionIds, selectBankQuestion } from "@/lib/question-bank"
import { getServiceById, getServicesInCategory, getRandomServiceFromCategory, type CertificationType } from "@/lib/services"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const service = searchParams.get("service")
    const category = searchParams.get("category")  // NEW: for random mode
    const certification = (searchParams.get("certification") || "DVA-C02") as CertificationType

    if (!["DVA-C02", "SAA-C03"].includes(certification) || (service && category)
      || (service && !getServiceById(service)?.certifications.includes(certification))) {
      return NextResponse.json({error: "Invalid service or certification"}, {status:400})
    }

    // Validate - need either service or category
    if (!service && !category) {
      return NextResponse.json(
        { error: "Missing required parameter: service or category" },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let selectedService: string
    let isRandomMode = false

    if (category) {
      // Random mode - pick a random service from the category
      isRandomMode = true
      const randomService = getRandomServiceFromCategory(category, certification)

      if (!randomService) {
        return NextResponse.json(
          { error: "No services available in this category for this certification" },
          { status: 404 }
        )
      }

      selectedService = randomService.id
    } else {
      selectedService = service!
    }

    const services = isRandomMode
      ? [selectedService, ...getServicesInCategory(category!, certification)
          .map(svc => svc.id).filter(id => id !== selectedService)]
      : [selectedService]

    for (const serviceId of services) {
      const seen = await getSeenQuestionIds(supabase, user.id, certification, serviceId)
      const { question, remainingQuestions, totalQuestions } =
        await selectBankQuestion(certification, serviceId, seen)

      if (question) {
        const info = getServiceById(serviceId)
        return NextResponse.json({
          ...await issueQuestion(user.id, serviceId, certification, question),
          ...(isRandomMode ? {
            service: serviceId, serviceName: info?.name, serviceIcon: info?.icon,
            isRandomMode: true,
          } : {}),
          remainingQuestions, totalQuestions, runningLow: remainingQuestions < 10,
        }, { headers: { "Cache-Control": "private, no-store" } })
      }

      if (!isRandomMode) {
        if (totalQuestions === 0) {
          return NextResponse.json({ error: "No questions available for this service", bankEmpty: true },
            { status: 404, headers: { "Cache-Control": "private, no-store" } })
        }
        return NextResponse.json({
          bankExhausted: true, totalQuestions, questionsCompleted: seen.size,
          message: "You've completed all available questions for this service",
        }, { headers: { "Cache-Control": "private, no-store" } })
      }
    }
    return NextResponse.json({
      bankExhausted: true, isRandomMode: true, category,
      message: "You've completed all available questions in this category",
    }, { headers: { "Cache-Control": "private, no-store" } })

  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}
