// app/api/question/next/route.ts
// Fetches a random unseen question from the DynamoDB question bank

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "exam-questions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const service = searchParams.get("service")
    const certification = searchParams.get("certification") || "DVA-C02"
    
    if (!service) {
      return NextResponse.json(
        { error: "Missing required parameter: service" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: seenQuestions } = await supabase
      .from("user_question_history")
      .select("question_id")
      .eq("user_id", user.id)
      .eq("service", service)
      .eq("certification", certification)

    const seenIds = new Set(seenQuestions?.map(q => q.question_id) || [])
    
    const questions = await getQuestionsFromDynamo(certification, service)
    
    if (questions.length === 0) {
      return NextResponse.json(
        { 
          error: "No questions available for this service",
          bankEmpty: true 
        },
        { status: 404 }
      )
    }

    const unseenQuestions = questions.filter(q => !seenIds.has(q.questionId))
    
    if (unseenQuestions.length === 0) {
      return NextResponse.json({
        bankExhausted: true,
        totalQuestions: questions.length,
        questionsCompleted: seenIds.size,
        message: "You've completed all available questions for this service"
      })
    }

    const runningLow = unseenQuestions.length < 10
    const randomIndex = Math.floor(Math.random() * unseenQuestions.length)
    const question = unseenQuestions[randomIndex]

    return NextResponse.json({
      ...question,
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
