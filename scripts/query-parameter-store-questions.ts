// Query DynamoDB for Lambda questions containing "Parameter Store" or "SecureString"
// Run with: npx tsx scripts/query-parameter-store-questions.ts

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "exam-questions"

// Initialize DynamoDB client using default credential provider chain
function getDocClient(): DynamoDBDocumentClient {
  const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
  })
  return DynamoDBDocumentClient.from(dynamoClient)
}

interface Question {
  PK: string
  SK: string
  questionId: string
  question: string
  options: Record<string, string>
  correct: string
  explanation: Record<string, string>
  examTip?: string
  topic?: string
}

async function fetchLambdaQuestions(certification: string): Promise<Question[]> {
  const questions: Question[] = []
  let lastEvaluatedKey: Record<string, any> | undefined
  const docClient = getDocClient()

  do {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `CERT#${certification}#SERVICE#lambda`,
      },
      ExclusiveStartKey: lastEvaluatedKey,
    })

    const response = await docClient.send(command)

    if (response.Items) {
      questions.push(...(response.Items as Question[]))
    }

    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)

  return questions
}

function containsSearchTerms(question: Question): boolean {
  const searchTerms = ["parameter store", "securestring"]

  // Combine all text fields
  const textToSearch = [
    question.question,
    question.explanation?.correct || "",
    question.explanation?.A || "",
    question.explanation?.B || "",
    question.explanation?.C || "",
    question.explanation?.D || "",
    question.examTip || "",
    Object.values(question.options || {}).join(" ")
  ].join(" ").toLowerCase()

  return searchTerms.some(term => textToSearch.includes(term))
}

async function main() {
  console.log("=".repeat(70))
  console.log("Querying Lambda Questions for 'Parameter Store' or 'SecureString'")
  console.log("=".repeat(70))
  console.log(`Table: ${TABLE_NAME}\n`)

  const certifications = ["DVA-C02", "SAA-C03"]
  const matchingQuestions: Array<{ cert: string; question: Question }> = []

  for (const cert of certifications) {
    console.log(`Fetching Lambda questions for ${cert}...`)
    const questions = await fetchLambdaQuestions(cert)
    console.log(`  Found ${questions.length} total Lambda questions`)

    const matches = questions.filter(q => containsSearchTerms(q))
    console.log(`  Found ${matches.length} matching "Parameter Store" or "SecureString"`)

    for (const q of matches) {
      matchingQuestions.push({ cert, question: q })
    }
  }

  console.log("\n" + "=".repeat(70))
  console.log(`RESULTS: ${matchingQuestions.length} matching questions found`)
  console.log("=".repeat(70))

  for (const { cert, question } of matchingQuestions) {
    console.log("\n" + "-".repeat(70))
    console.log(`Certification: ${cert}`)
    console.log(`Question ID: ${question.questionId}`)
    console.log(`Topic: ${question.topic || "(not set)"}`)
    console.log("-".repeat(70))
    console.log(`Question: ${question.question.substring(0, 200)}...`)

    // Show which field contains the search term
    const fields: string[] = []
    if (question.question.toLowerCase().includes("parameter store") ||
        question.question.toLowerCase().includes("securestring")) {
      fields.push("question text")
    }
    const explanationText = [
      question.explanation?.correct || "",
      question.explanation?.A || "",
      question.explanation?.B || "",
      question.explanation?.C || "",
      question.explanation?.D || "",
    ].join(" ").toLowerCase()
    if (explanationText.includes("parameter store") || explanationText.includes("securestring")) {
      fields.push("explanation")
    }
    if ((question.examTip || "").toLowerCase().includes("parameter store") ||
        (question.examTip || "").toLowerCase().includes("securestring")) {
      fields.push("examTip")
    }
    console.log(`Match found in: ${fields.join(", ")}`)
  }

  // Summary table of topics
  console.log("\n" + "=".repeat(70))
  console.log("TOPIC SUMMARY")
  console.log("=".repeat(70))

  const topicCounts: Record<string, number> = {}
  for (const { question } of matchingQuestions) {
    const topic = question.topic || "(not set)"
    topicCounts[topic] = (topicCounts[topic] || 0) + 1
  }

  console.log("\nTopic Distribution:")
  for (const [topic, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${topic}: ${count} question(s)`)
  }
}

main().catch(console.error)
