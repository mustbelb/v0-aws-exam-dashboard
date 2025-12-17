/**
 * Lambda function for topic tagging exam questions in DynamoDB
 *
 * Environment Variables:
 *   - DYNAMODB_TABLE_NAME: Name of the DynamoDB table (default: exam-questions)
 *   - DRY_RUN: Set to "false" to actually update DynamoDB (default: "true")
 *   - AWS_REGION: AWS region (default: us-east-1)
 *
 * This function scans all questions in DynamoDB and classifies them with topic tags
 * based on keyword matching against the question content.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import { serviceMappings, fallbackTopics, TopicMapping } from "./topic-mappings"
import { Handler, Context } from "aws-lambda"

// Configuration from environment variables
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "exam-questions"
const DRY_RUN = process.env.DRY_RUN !== "false" // Default to dry run for safety

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

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
  dryRun: boolean
  tableName: string
  executionTime: number
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
  errorDetails: Array<{ questionId: string; error: string }>
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
 * Classify a question based on its content using keyword matching
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

    const response = await docClient.send(command)

    if (response.Items) {
      questions.push(...(response.Items as Question[]))
    }

    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)

  return questions
}

/**
 * Update a question with its topic tag
 */
async function updateQuestion(question: Question, topic: string): Promise<boolean> {
  if (DRY_RUN) {
    return true
  }

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

  await docClient.send(command)
  return true
}

/**
 * Process all questions for a certification + service combination
 */
async function processServiceQuestions(
  certification: string,
  service: string,
  report: Report
): Promise<void> {
  const questions = await fetchQuestions(certification, service)

  if (questions.length === 0) {
    return
  }

  // Initialize report structures
  if (!report.byService[service]) {
    report.byService[service] = { total: 0, tagged: 0, topicDistribution: {} }
  }
  if (!report.byCertification[certification]) {
    report.byCertification[certification] = { total: 0, tagged: 0 }
  }

  for (const question of questions) {
    report.totalProcessed++
    report.byService[service].total++
    report.byCertification[certification].total++

    // Skip if already has a topic (and it's not "general")
    if (question.topic && question.topic !== "general") {
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
      report.fallbackToGeneral++
    }

    // Update the question
    try {
      const success = await updateQuestion(question, topic)

      if (success) {
        report.successfullyTagged++
        report.byService[service].tagged++
        report.byCertification[certification].tagged++

        // Track distribution
        if (!report.byService[service].topicDistribution[topic]) {
          report.byService[service].topicDistribution[topic] = 0
        }
        report.byService[service].topicDistribution[topic]++
      }
    } catch (error) {
      report.errors++
      report.errorDetails.push({
        questionId: question.questionId,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }
}

/**
 * Lambda handler entry point
 */
export const handler: Handler = async (event: any, context: Context) => {
  console.log("Starting topic tagging Lambda function")
  console.log(`Table: ${TABLE_NAME}`)
  console.log(`Dry Run: ${DRY_RUN}`)
  console.log(`Region: ${process.env.AWS_REGION || "us-east-1"}`)

  const startTime = Date.now()

  // Initialize report
  const report: Report = {
    dryRun: DRY_RUN,
    tableName: TABLE_NAME,
    executionTime: 0,
    totalProcessed: 0,
    successfullyTagged: 0,
    alreadyTagged: 0,
    fallbackToGeneral: 0,
    errors: 0,
    byService: {},
    byCertification: {},
    errorDetails: []
  }

  try {
    // Process all certification + service combinations
    for (const certification of certifications) {
      console.log(`Processing certification: ${certification}`)

      for (const service of services) {
        try {
          await processServiceQuestions(certification, service, report)
        } catch (error) {
          console.error(`Error processing ${certification}/${service}:`, error)
          report.errors++
        }
      }
    }

    const endTime = Date.now()
    report.executionTime = (endTime - startTime) / 1000

    console.log("Topic tagging completed")
    console.log(`Total Processed: ${report.totalProcessed}`)
    console.log(`Successfully Tagged: ${report.successfullyTagged}`)
    console.log(`Already Tagged: ${report.alreadyTagged}`)
    console.log(`Used Fallback: ${report.fallbackToGeneral}`)
    console.log(`Errors: ${report.errors}`)
    console.log(`Execution Time: ${report.executionTime}s`)

    // Return the report
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: DRY_RUN
          ? "Dry run completed - no changes were made to DynamoDB"
          : "Topic tagging completed successfully",
        report
      }, null, 2)
    }

  } catch (error) {
    console.error("Fatal error in topic tagging Lambda:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Topic tagging failed",
        error: error instanceof Error ? error.message : String(error),
        report
      }, null, 2)
    }
  }
}
