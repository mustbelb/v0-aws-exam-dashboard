export const dynamic = 'force-dynamic'
// app/api/question/next/route.ts
// Fetches a random unseen question from the DynamoDB question bank
// Supports both specific service and random category mode

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { issueQuestion } from "@/lib/issued-question"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { getServiceById, getServicesInCategory, getRandomServiceFromCategory, type CertificationType } from "@/lib/services"

const dynamoClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || "us-east-2",
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "exam-questions"

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

    // Get user's seen question IDs for this service
    const { data: seenQuestions, error: historyError } = await supabase
      .from("user_question_history")
      .select("question_id")
      .eq("user_id", user.id)
      .eq("service", selectedService)
      .eq("certification", certification)

    if (historyError) throw historyError
    const seenIds = new Set(seenQuestions?.map(q => q.question_id) || [])

    // Fetch all questions for this service from DynamoDB
    const questions = await getQuestionsFromDynamo(certification, selectedService)

    if (questions.length === 0) {
      // If in random mode and this service has no questions, try another service
      if (isRandomMode) {
        const servicesInCategory = getServicesInCategory(category!, certification)

        for (const svc of servicesInCategory) {
          if (svc.id === selectedService) continue

          const altQuestions = await getQuestionsFromDynamo(certification, svc.id)
          const { data: altSeen, error: altHistoryError } = await supabase
            .from("user_question_history").select("question_id")
            .eq("user_id", user.id).eq("service", svc.id).eq("certification", certification)
          if (altHistoryError) throw altHistoryError
          const altSeenIds = new Set(altSeen?.map(q => q.question_id) || [])
          const unseenAlt = altQuestions.filter(q => !altSeenIds.has(q.questionId))

          if (unseenAlt.length > 0) {
            const randomIndex = Math.floor(Math.random() * unseenAlt.length)
            const question = unseenAlt[randomIndex]

            return NextResponse.json({
              ...await issueQuestion(user.id, svc.id, certification, question),
              service: svc.id,
              serviceName: svc.name,
              serviceIcon: svc.icon,
              isRandomMode: true,
              remainingQuestions: unseenAlt.length,
              totalQuestions: altQuestions.length,
              runningLow: unseenAlt.length < 10
            })
          }
        }

        // All services in category exhausted
        return NextResponse.json({
          bankExhausted: true,
          isRandomMode: true,
          category,
          message: "You've completed all available questions in this category"
        })
      }

      return NextResponse.json(
        {
          error: "No questions available for this service",
          bankEmpty: true
        },
        { status: 404 }
      )
    }

    // Filter out seen questions
    const unseenQuestions = questions.filter(q => !seenIds.has(q.questionId))

    // Check if bank is exhausted for this user
    if (unseenQuestions.length === 0) {
      if (isRandomMode) {
        // Try other services in the category
        const servicesInCategory = getServicesInCategory(category!, certification)

        for (const svc of servicesInCategory) {
          if (svc.id === selectedService) continue

          const { data: svcSeenQuestions, error: svcHistoryError } = await supabase
            .from("user_question_history")
            .select("question_id")
            .eq("user_id", user.id)
            .eq("service", svc.id)
            .eq("certification", certification)

          if (svcHistoryError) throw svcHistoryError
          const svcSeenIds = new Set(svcSeenQuestions?.map(q => q.question_id) || [])
          const altQuestions = await getQuestionsFromDynamo(certification, svc.id)
          const unseenAlt = altQuestions.filter(q => !svcSeenIds.has(q.questionId))

          if (unseenAlt.length > 0) {
            const randomIndex = Math.floor(Math.random() * unseenAlt.length)
            const question = unseenAlt[randomIndex]

            return NextResponse.json({
              ...await issueQuestion(user.id, svc.id, certification, question),
              service: svc.id,
              serviceName: svc.name,
              serviceIcon: svc.icon,
              isRandomMode: true,
              remainingQuestions: unseenAlt.length,
              totalQuestions: altQuestions.length,
              runningLow: unseenAlt.length < 10
            })
          }
        }

        // All services in category exhausted
        return NextResponse.json({
          bankExhausted: true,
          isRandomMode: true,
          category,
          message: "You've completed all available questions in this category"
        })
      }

      return NextResponse.json({
        bankExhausted: true,
        totalQuestions: questions.length,
        questionsCompleted: seenIds.size,
        message: "You've completed all available questions for this service"
      })
    }

    // Check if running low - client can use this to show a warning or trigger replenishment
    const runningLow = unseenQuestions.length < 10

    // Pick a random unseen question
    const randomIndex = Math.floor(Math.random() * unseenQuestions.length)
    const question = unseenQuestions[randomIndex]

    // Get service info for random mode
    const serviceInfo = isRandomMode ? {
      service: selectedService,
      serviceName: getServicesInCategory(category!, certification).find(s => s.id === selectedService)?.name,
      serviceIcon: getServicesInCategory(category!, certification).find(s => s.id === selectedService)?.icon,
      isRandomMode: true
    } : {}

    return NextResponse.json({
      ...await issueQuestion(user.id, selectedService, certification, question),
      ...serviceInfo,
      remainingQuestions: unseenQuestions.length,
      totalQuestions: questions.length,
      runningLow
    })

  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}

async function getQuestionsFromDynamo(
  certification: string,
  service: string
): Promise<Question[]> {
  const questions: Question[] = []
  let lastEvaluatedKey: Record<string, any> | undefined

  // Paginate through all questions (DynamoDB returns max 1MB per query)
  do {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `CERT#${certification}#SERVICE#${service}`,
      },
      ExclusiveStartKey: lastEvaluatedKey,
    })

    const response = await docClient.send(command)

    if (response.Items) {
      for (const item of response.Items) {
        questions.push({
          questionId: item.questionId,
          question: item.question,
          options: item.options,
          correct: item.correct,
          explanation: item.explanation,
          examTip: item.examTip,
          topic: item.topic,
          questionStyle: item.questionStyle,
        })
      }
    }

    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)

  return questions
}

interface Question {
  questionId: string
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
    A: string
    B: string
    C: string
    D: string
  }
  examTip: string
  topic?: string
  questionStyle?: string
}
