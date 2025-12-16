// Test script to verify classification logic
// Run with: npx tsx scripts/topic-tagging/test-classification.ts

import { serviceMappings, fallbackTopics, TopicMapping } from "./topic-mappings"

interface TestQuestion {
  question: string
  explanation: { correct: string }
  service: string
  expectedTopic: string
}

// Test questions to verify classification
const testQuestions: TestQuestion[] = [
  // Lambda tests
  {
    question: "Your Lambda function is experiencing throttling errors with a 429 status code during peak traffic. How can you ensure more consistent performance?",
    explanation: { correct: "Use reserved concurrency to guarantee a portion of the account limit for this function." },
    service: "lambda",
    expectedTopic: "lambda-concurrency"
  },
  {
    question: "Users report that the first request to your Lambda function after periods of inactivity takes 3-4 seconds longer than subsequent requests. What's causing this?",
    explanation: { correct: "This is a cold start - Lambda needs to initialize a new execution context." },
    service: "lambda",
    expectedTopic: "lambda-cold-starts"
  },
  {
    question: "Your Lambda function needs to access an RDS database in a private subnet. What configuration is required?",
    explanation: { correct: "Configure the Lambda function to run in the VPC with appropriate security groups and ensure a NAT Gateway is configured for internet access." },
    service: "lambda",
    expectedTopic: "lambda-vpc-access"
  },
  {
    question: "You want to share common dependencies across multiple Lambda functions. What's the best approach?",
    explanation: { correct: "Create a Lambda Layer containing the shared dependencies and attach it to the functions." },
    service: "lambda",
    expectedTopic: "lambda-layers"
  },

  // DynamoDB tests
  {
    question: "Your DynamoDB table has a hot partition problem. What attribute design would help distribute traffic more evenly?",
    explanation: { correct: "Choose a partition key with high cardinality to ensure even distribution across partitions." },
    service: "dynamodb",
    expectedTopic: "dynamodb-partition-keys"
  },
  {
    question: "You need to query items in DynamoDB using an attribute that is not the partition key. What should you create?",
    explanation: { correct: "Create a Global Secondary Index (GSI) with the attribute as the partition key or sort key." },
    service: "dynamodb",
    expectedTopic: "dynamodb-gsi-lsi"
  },
  {
    question: "Your application needs to process changes to DynamoDB items in real-time. What feature enables this?",
    explanation: { correct: "Enable DynamoDB Streams to capture time-ordered sequences of item-level changes." },
    service: "dynamodb",
    expectedTopic: "dynamodb-streams"
  },
  {
    question: "You need to atomically update multiple items across different tables in DynamoDB. What should you use?",
    explanation: { correct: "Use DynamoDB Transactions with TransactWriteItems for all-or-nothing operations." },
    service: "dynamodb",
    expectedTopic: "dynamodb-transactions"
  },

  // S3 tests
  {
    question: "You need to move infrequently accessed data to a lower-cost storage tier after 30 days. What should you configure?",
    explanation: { correct: "Create an S3 Lifecycle policy to transition objects to S3 Standard-IA or Glacier after 30 days." },
    service: "s3",
    expectedTopic: "s3-lifecycle"
  },
  {
    question: "Which S3 storage class provides the lowest cost for data that is rarely accessed but requires millisecond retrieval?",
    explanation: { correct: "S3 Glacier Instant Retrieval offers the lowest cost for long-lived data with millisecond retrieval." },
    service: "s3",
    expectedTopic: "s3-storage-classes"
  },
  {
    question: "You need to replicate S3 objects to another region for disaster recovery. What feature enables this?",
    explanation: { correct: "Configure Cross-Region Replication (CRR) to automatically replicate objects to a destination bucket." },
    service: "s3",
    expectedTopic: "s3-replication"
  },

  // SQS tests
  {
    question: "Messages in your SQS queue are being processed multiple times. How can you prevent this?",
    explanation: { correct: "Increase the visibility timeout to give consumers more time to process and delete messages." },
    service: "sqs",
    expectedTopic: "sqs-visibility-timeout"
  },
  {
    question: "You need to ensure messages are processed in the exact order they were sent. What type of queue should you use?",
    explanation: { correct: "Use an SQS FIFO queue which guarantees exactly-once processing and message ordering." },
    service: "sqs",
    expectedTopic: "sqs-standard-vs-fifo"
  },
  {
    question: "Failed messages in your SQS queue are filling up. Where should you route them for later analysis?",
    explanation: { correct: "Configure a Dead Letter Queue (DLQ) to capture messages that exceed the maximum receive count." },
    service: "sqs",
    expectedTopic: "sqs-dlq"
  },

  // VPC tests
  {
    question: "Your EC2 instances in a private subnet need to access the internet for software updates. What do you need?",
    explanation: { correct: "Deploy a NAT Gateway in a public subnet and update the private subnet route table." },
    service: "vpc",
    expectedTopic: "vpc-nat-gateway"
  },
  {
    question: "You want to allow S3 access from a private subnet without routing through the internet. What should you create?",
    explanation: { correct: "Create a VPC Gateway Endpoint for S3 to enable private connectivity." },
    service: "vpc",
    expectedTopic: "vpc-endpoints"
  },
  {
    question: "What's the difference between security groups and network ACLs?",
    explanation: { correct: "Security groups are stateful and operate at the instance level, while NACLs are stateless and operate at the subnet level." },
    service: "vpc",
    expectedTopic: "vpc-security-groups-nacls"
  },

  // API Gateway tests
  {
    question: "You need to choose between REST API and HTTP API for a simple Lambda integration. What factors should you consider?",
    explanation: { correct: "HTTP APIs are simpler, faster, and cheaper. REST APIs offer more features like API keys, request validation, and caching." },
    service: "api-gateway",
    expectedTopic: "rest-vs-http-apis"
  },
  {
    question: "How can you protect your API Gateway from too many requests overwhelming your backend?",
    explanation: { correct: "Configure throttling with rate limits and burst limits to control request flow." },
    service: "api-gateway",
    expectedTopic: "throttling-rate-limiting"
  },

  // IAM tests
  {
    question: "A policy has both Allow and Deny statements for the same action. Which takes precedence?",
    explanation: { correct: "Explicit Deny always wins. AWS evaluates policies and an explicit deny overrides any allows." },
    service: "iam",
    expectedTopic: "iam-policy-evaluation"
  },
  {
    question: "You need to grant temporary AWS credentials to a user from another AWS account. What should you use?",
    explanation: { correct: "Create an IAM role with a trust policy allowing the external account and use STS AssumeRole." },
    service: "iam",
    expectedTopic: "iam-cross-account"
  }
]

/**
 * Classify a question based on its content
 */
function classifyQuestion(question: string, explanation: string, service: string): string | null {
  const mappings = serviceMappings[service]

  if (!mappings || mappings.length === 0) {
    return null
  }

  const textToAnalyze = `${question} ${explanation}`.toLowerCase()

  const scores: Array<{ topic: string; score: number; priority: number; matches: string[] }> = []

  for (const mapping of mappings) {
    let score = 0
    const matches: string[] = []

    for (const keyword of mapping.keywords) {
      const regex = new RegExp(keyword.toLowerCase(), "gi")
      const found = textToAnalyze.match(regex)
      if (found) {
        score += found.length
        matches.push(`${keyword}(${found.length})`)
      }
    }

    if (score > 0) {
      scores.push({
        topic: mapping.topic,
        score,
        priority: mapping.priority,
        matches
      })
    }
  }

  if (scores.length === 0) {
    return null
  }

  scores.sort((a, b) => {
    const weightedA = a.score * a.priority
    const weightedB = b.score * b.priority
    return weightedB - weightedA
  })

  // Log scoring details for debugging
  console.log("  Top 3 scores:")
  for (const item of scores.slice(0, 3)) {
    console.log(`    ${item.topic}: score=${item.score}, priority=${item.priority}, weighted=${item.score * item.priority}`)
    console.log(`      matches: ${item.matches.join(", ")}`)
  }

  return scores[0].topic
}

// Run tests
console.log("=".repeat(60))
console.log("Testing Question Classification Logic")
console.log("=".repeat(60))

let passed = 0
let failed = 0

for (const test of testQuestions) {
  console.log(`\n[${test.service}] Testing classification...`)
  console.log(`Question: ${test.question.substring(0, 80)}...`)
  console.log(`Expected: ${test.expectedTopic}`)

  const result = classifyQuestion(test.question, test.explanation.correct, test.service)
  const finalResult = result || fallbackTopics[test.service] || "general"

  console.log(`Result: ${finalResult}`)

  if (finalResult === test.expectedTopic) {
    console.log("✓ PASSED")
    passed++
  } else {
    console.log("✗ FAILED")
    failed++
  }
}

console.log("\n" + "=".repeat(60))
console.log(`Results: ${passed} passed, ${failed} failed out of ${testQuestions.length} tests`)
console.log("=".repeat(60))

// Test coverage of services with mappings
console.log("\nServices with mappings:")
const mappedServices = Object.keys(serviceMappings)
console.log(mappedServices.join(", "))
console.log(`Total: ${mappedServices.length} services`)

console.log("\nServices with fallbacks:")
const fallbackServices = Object.keys(fallbackTopics)
console.log(fallbackServices.join(", "))
console.log(`Total: ${fallbackServices.length} services`)
