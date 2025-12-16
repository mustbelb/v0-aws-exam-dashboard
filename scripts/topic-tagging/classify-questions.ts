// Script to classify and tag all questions in DynamoDB with topic tags
// Run with: npx tsx scripts/topic-tagging/classify-questions.ts
//
// Before running, create a .env.local file in this directory with:
//   AWS_REGION=us-east-1
//   AWS_ACCESS_KEY_ID=your-key
//   AWS_SECRET_ACCESS_KEY=your-secret
//   DYNAMODB_TABLE_NAME=exam-questions
//   DRY_RUN=true (set to false to actually update)

import { config } from "dotenv"
import { resolve } from "path"

// Load environment variables from .env.local
config({ path: resolve(__dirname, ".env.local") })

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb"
import { serviceMappings, fallbackTopics, TopicMapping } from "./topic-mappings"

// Configuration
const BATCH_SIZE = 25  // DynamoDB batch limit
const DRY_RUN = process.env.DRY_RUN !== "false"  // Default to dry run for safety

// Check for required credentials
function checkCredentials(): boolean {
  const missing: string[] = []
  if (!process.env.AWS_ACCESS_KEY_ID) missing.push("AWS_ACCESS_KEY_ID")
  if (!process.env.AWS_SECRET_ACCESS_KEY) missing.push("AWS_SECRET_ACCESS_KEY")

  if (missing.length > 0) {
    console.error("ERROR: Missing required environment variables:")
    console.error(missing.map(v => `  - ${v}`).join("\n"))
    console.error("\nCreate a .env.local file with your AWS credentials.")
    console.error("See .env.example for the required format.")
    return false
  }
  return true
}

// Initialize DynamoDB client (lazy initialization)
let docClient: DynamoDBDocumentClient | null = null

function getDocClient(): DynamoDBDocumentClient {
  if (!docClient) {
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    docClient = DynamoDBDocumentClient.from(dynamoClient)
  }
  return docClient
}

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "exam-questions"

// Certifications and services to process
const certifications = ["DVA-C02", "SAA-C03"]

const services = [
  "lambda", "dynamodb", "s3", "sqs", "sns", "vpc", "ec2", "iam",
  "api-gateway", "rds", "aurora", "ecs", "cloudwatch", "cloudformation",
  "kinesis", "step-functions", "cognito", "secrets-manager", "kms",
  "elb", "route53", "cloudfront", "elasticache", "eventbridge", "x-ray",
  "elastic-beanstalk", "codepipeline", "codebuild", "codedeploy", "codecommit",
  "ecr", "sam", "athena", "glue", "emr", "sagemaker", "rekognition",
  "dms", "snow-family", "datasync", "ebs", "efs", "s3-glacier", "fsx",
  "storage-gateway", "redshift", "waf", "shield", "acm", "cloudtrail",
  "systems-manager", "config", "eks", "auto-scaling", "direct-connect",
  "global-accelerator"
]

// Report data structure
interface Report {
  totalProcessed: number
  successfullyTagged: number
  alreadyTagged: number
  fallbackToGeneral: number
  errors: number
  byService: Record<string, {
    total: number
    tagged: number
    topicDistribution: Record<string, number>
  }>
  byCertification: Record<string, {
    total: number
    tagged: number
  }>
  unclassified: Array<{ questionId: string; service: string; preview: string }>
}

const report: Report = {
  totalProcessed: 0,
  successfullyTagged: 0,
  alreadyTagged: 0,
  fallbackToGeneral: 0,
  errors: 0,
  byService: {},
  byCertification: {},
  unclassified: []
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
  questionStyle?: string
}

/**
 * Classify a question based on its content
 */
function classifyQuestion(question: Question, service: string): string | null {
  const mappings = serviceMappings[service]

  if (!mappings || mappings.length === 0) {
    return null
  }

  // Combine question text, explanation, and options for analysis
  const textToAnalyze = [
    question.question,
    question.explanation?.correct || "",
    question.explanation?.A || "",
    question.explanation?.B || "",
    question.explanation?.C || "",
    question.explanation?.D || "",
    question.examTip || "",
    Object.values(question.options || {}).join(" ")
  ].join(" ").toLowerCase()

  // Score each topic based on keyword matches
  const scores: Array<{ topic: string; score: number; priority: number }> = []

  for (const mapping of mappings) {
    let score = 0
    for (const keyword of mapping.keywords) {
      // Count occurrences of keyword
      const regex = new RegExp(keyword.toLowerCase(), "gi")
      const matches = textToAnalyze.match(regex)
      if (matches) {
        score += matches.length
      }
    }

    if (score > 0) {
      scores.push({
        topic: mapping.topic,
        score,
        priority: mapping.priority
      })
    }
  }

  if (scores.length === 0) {
    return null
  }

  // Sort by score * priority (weighted scoring)
  scores.sort((a, b) => {
    const weightedA = a.score * a.priority
    const weightedB = b.score * b.priority
    return weightedB - weightedA
  })

  return scores[0].topic
}

/**
 * Fetch all questions for a certification + service combination
 */
async function fetchQuestions(certification: string, service: string): Promise<Question[]> {
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

    try {
      const response = await getDocClient().send(command)

      if (response.Items) {
        questions.push(...(response.Items as Question[]))
      }

      lastEvaluatedKey = response.LastEvaluatedKey
    } catch (error) {
      console.error(`Error fetching questions for ${certification}/${service}:`, error)
      break
    }
  } while (lastEvaluatedKey)

  return questions
}

/**
 * Update a question with its topic tag
 */
async function updateQuestion(question: Question, topic: string): Promise<boolean> {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would update ${question.questionId} with topic: ${topic}`)
    return true
  }

  try {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: question.PK,
        SK: question.SK
      },
      UpdateExpression: "SET topic = :topic",
      ExpressionAttributeValues: {
        ":topic": topic
      }
    })

    await getDocClient().send(command)
    return true
  } catch (error) {
    console.error(`Error updating question ${question.questionId}:`, error)
    return false
  }
}

/**
 * Process all questions for a certification + service combination
 */
async function processServiceQuestions(certification: string, service: string): Promise<void> {
  console.log(`\nProcessing ${certification} / ${service}...`)

  const questions = await fetchQuestions(certification, service)

  if (questions.length === 0) {
    console.log(`  No questions found`)
    return
  }

  console.log(`  Found ${questions.length} questions`)

  // Initialize report structures
  if (!report.byService[service]) {
    report.byService[service] = { total: 0, tagged: 0, topicDistribution: {} }
  }
  if (!report.byCertification[certification]) {
    report.byCertification[certification] = { total: 0, tagged: 0 }
  }

  let processed = 0
  let tagged = 0
  let alreadyTagged = 0
  let usedFallback = 0
  let errors = 0

  for (const question of questions) {
    processed++
    report.totalProcessed++
    report.byService[service].total++
    report.byCertification[certification].total++

    // Skip if already has a topic
    if (question.topic && question.topic !== "general") {
      alreadyTagged++
      report.alreadyTagged++

      // Track distribution even for already tagged
      if (!report.byService[service].topicDistribution[question.topic]) {
        report.byService[service].topicDistribution[question.topic] = 0
      }
      report.byService[service].topicDistribution[question.topic]++

      continue
    }

    // Classify the question
    let topic = classifyQuestion(question, service)

    // Use fallback if no match found
    if (!topic) {
      topic = fallbackTopics[service] || "general"
      usedFallback++
      report.fallbackToGeneral++

      // Track unclassified for review
      if (usedFallback <= 10) {  // Only track first 10 per service
        report.unclassified.push({
          questionId: question.questionId,
          service,
          preview: question.question.substring(0, 100) + "..."
        })
      }
    }

    // Update the question
    const success = await updateQuestion(question, topic)

    if (success) {
      tagged++
      report.successfullyTagged++
      report.byService[service].tagged++
      report.byCertification[certification].tagged++

      // Track distribution
      if (!report.byService[service].topicDistribution[topic]) {
        report.byService[service].topicDistribution[topic] = 0
      }
      report.byService[service].topicDistribution[topic]++
    } else {
      errors++
      report.errors++
    }

    // Progress indicator
    if (processed % 50 === 0) {
      console.log(`  Progress: ${processed}/${questions.length}`)
    }
  }

  console.log(`  Completed: ${tagged} tagged, ${alreadyTagged} already tagged, ${usedFallback} used fallback, ${errors} errors`)
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log("=".repeat(60))
  console.log("Question Topic Tagging Script")
  console.log("=".repeat(60))

  // Check credentials before proceeding
  if (!checkCredentials()) {
    process.exit(1)
  }

  console.log(`Table: ${TABLE_NAME}`)
  console.log(`Dry Run: ${DRY_RUN}`)
  if (DRY_RUN) {
    console.log("  (Set DRY_RUN=false to actually update DynamoDB)")
  }
  console.log(`Certifications: ${certifications.join(", ")}`)
  console.log(`Services: ${services.length} services`)
  console.log("=".repeat(60))

  const startTime = Date.now()

  // Process all certification + service combinations
  for (const certification of certifications) {
    console.log(`\n${"=".repeat(40)}`)
    console.log(`Processing certification: ${certification}`)
    console.log("=".repeat(40))

    for (const service of services) {
      try {
        await processServiceQuestions(certification, service)
      } catch (error) {
        console.error(`Error processing ${certification}/${service}:`, error)
      }
    }
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  // Print report
  console.log("\n" + "=".repeat(60))
  console.log("FINAL REPORT")
  console.log("=".repeat(60))
  console.log(`Duration: ${duration} seconds`)
  console.log(`Total Processed: ${report.totalProcessed}`)
  console.log(`Successfully Tagged: ${report.successfullyTagged}`)
  console.log(`Already Tagged: ${report.alreadyTagged}`)
  console.log(`Used Fallback: ${report.fallbackToGeneral}`)
  console.log(`Errors: ${report.errors}`)

  console.log("\n--- By Certification ---")
  for (const [cert, data] of Object.entries(report.byCertification)) {
    console.log(`${cert}: ${data.total} total, ${data.tagged} newly tagged`)
  }

  console.log("\n--- By Service (Top 20) ---")
  const sortedServices = Object.entries(report.byService)
    .filter(([_, data]) => data.total > 0)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 20)

  for (const [service, data] of sortedServices) {
    console.log(`\n${service}: ${data.total} total, ${data.tagged} newly tagged`)
    console.log("  Topics:")
    const sortedTopics = Object.entries(data.topicDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    for (const [topic, count] of sortedTopics) {
      console.log(`    ${topic}: ${count}`)
    }
  }

  if (report.unclassified.length > 0) {
    console.log("\n--- Sample Unclassified Questions (Used Fallback) ---")
    for (const item of report.unclassified.slice(0, 10)) {
      console.log(`\n[${item.service}] ${item.questionId}`)
      console.log(`  ${item.preview}`)
    }
  }

  // Save report to JSON file
  const reportPath = `./scripts/topic-tagging/report-${Date.now()}.json`
  const fs = await import("fs/promises")
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  console.log(`\nFull report saved to: ${reportPath}`)
}

// Run the script
main().catch(console.error)
