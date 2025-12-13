// Maps service IDs to their primary/default explainer topic
// When a user gets a question wrong, show this explainer for that service

export const serviceToExplainerMap: Record<string, string> = {
  // Compute
  "lambda": "lambda-concurrency",
  "ec2": "ec2-instance-types",
  "ecs": "ecs-task-definitions",
  "fargate": "ecs-fargate-vs-ec2",
  
  // Storage & Databases
  "s3": "s3-storage-classes",
  "dynamodb": "dynamodb-partition-keys",
  "rds": "rds-multi-az-read-replicas",
  "aurora": "aurora-architecture",
  "elasticache": "elasticache-redis-vs-memcached",
  
  // Networking
  "vpc": "vpc-subnets-azs",
  "api-gateway": "rest-vs-http-apis",
  "cloudfront": "cloudfront-origins-behaviors",
  "route53": "route53-routing-policies",
  "elb": "alb-vs-nlb",
  
  // Messaging
  "sqs": "sqs-visibility-timeout",
  "sns": "sns-topics-subscriptions",
  "eventbridge": "eventbridge-rules-patterns",
  "kinesis": "kinesis-streams-vs-firehose",
  "step-functions": "step-functions-state-types",
  
  // Security & Identity
  "iam": "iam-policy-evaluation",
  "cognito": "cognito-user-pools-identity-pools",
  "secrets-manager": "secrets-manager-vs-parameter-store",
  "kms": "kms-key-types",
  
  // Monitoring & DevOps
  "cloudwatch": "cloudwatch-metrics-alarms",
  "cloudformation": "cloudformation-template-anatomy",
  "x-ray": "xray-tracing-segments",
  "codepipeline": "codepipeline-stages",
  "codebuild": "codebuild-buildspec",
  "codedeploy": "codedeploy-deployment-types",
}

// Get the default explainer for a service
export function getExplainerForService(serviceId: string): string | null {
  return serviceToExplainerMap[serviceId] || null
}

// Get all explainers related to a service (for Study Hub)
export const serviceExplainerGroups: Record<string, string[]> = {
  "lambda": [
    "lambda-concurrency",
    "lambda-cold-starts",
    "lambda-vpc-access",
    "lambda-versions-aliases",
    "lambda-layers",
    "lambda-destinations-dlq",
    "lambda-event-source-mappings",
    "lambda-environment-config"
  ],
  "dynamodb": [
    "dynamodb-partition-keys",
    "dynamodb-ttl",
    "dynamodb-gsi-lsi",
    "dynamodb-streams",
    "dynamodb-capacity-modes",
    "dynamodb-transactions",
    "dynamodb-dax",
    "dynamodb-global-tables"
  ],
  "s3": [
    "s3-storage-classes",
    "s3-lifecycle-policies",
    "s3-versioning",
    "s3-encryption",
    "s3-bucket-policies-acls",
    "s3-presigned-urls",
    "s3-replication",
    "s3-event-notifications"
  ],
  "sqs": [
    "sqs-visibility-timeout",
    "sqs-standard-vs-fifo",
    "sqs-dead-letter-queues",
    "sqs-long-polling",
    "sqs-message-batching"
  ],
  "sns": [
    "sns-topics-subscriptions",
    "sns-message-filtering",
    "sns-fanout-pattern",
    "sns-mobile-push"
  ],
  "vpc": [
    "vpc-subnets-azs",
    "vpc-security-groups-nacls",
    "vpc-nat-gateway",
    "vpc-endpoints",
    "vpc-peering",
    "vpc-flow-logs"
  ],
  "iam": [
    "iam-policy-evaluation",
    "iam-policy-types",
    "iam-roles-vs-users",
    "iam-cross-account",
    "iam-permissions-boundaries",
    "iam-instance-profiles"
  ],
  "api-gateway": [
    "rest-vs-http-apis",
    "stages-deployments",
    "authentication-methods",
    "throttling-rate-limiting",
    "api-caching",
    "request-response-transformations"
  ],
  "ec2": [
    "ec2-instance-types",
    "ec2-pricing-models",
    "ec2-placement-groups",
    "ec2-instance-store-vs-ebs",
    "ec2-auto-scaling",
    "ec2-launch-templates"
  ],
  "rds": [
    "rds-multi-az-read-replicas",
    "rds-backup-restore",
    "rds-encryption",
    "aurora-architecture",
    "aurora-serverless",
    "rds-proxy"
  ],
  "ecs": [
    "ecs-task-definitions",
    "ecs-fargate-vs-ec2",
    "ecs-service-discovery",
    "ecr-lifecycle-policies"
  ],
  "cloudwatch": [
    "cloudwatch-metrics-alarms",
    "cloudwatch-logs-insights",
    "cloudwatch-dashboards",
    "xray-tracing-segments",
    "cloudwatch-contributor-insights"
  ],
  "cloudformation": [
    "cloudformation-template-anatomy",
    "cloudformation-intrinsic-functions",
    "cloudformation-drift-detection",
    "sam-template-basics"
  ],
  "kinesis": [
    "kinesis-streams-vs-firehose",
    "kinesis-shards-scaling",
    "kinesis-enhanced-fan-out"
  ],
  "step-functions": [
    "step-functions-state-types",
    "step-functions-error-handling",
    "step-functions-standard-vs-express"
  ],
  "cognito": [
    "cognito-user-pools-identity-pools",
    "cognito-authentication-flows",
    "cognito-lambda-triggers"
  ],
  "secrets-manager": [
    "secrets-manager-vs-parameter-store",
    "secrets-manager-rotation"
  ]
}

// Get all explainers for a service (for Study Hub browsing)
export function getExplainersForService(serviceId: string): string[] {
  return serviceExplainerGroups[serviceId] || []
}

// Topic metadata for display
export const explainerMetadata: Record<string, { title: string; description: string; difficulty: 'basic' | 'intermediate' | 'advanced' }> = {
  // Lambda
  "lambda-concurrency": { 
    title: "Lambda Concurrency", 
    description: "How Lambda scales and handles concurrent requests",
    difficulty: "intermediate"
  },
  "lambda-cold-starts": { 
    title: "Cold Starts", 
    description: "Why first requests are slow and how to mitigate",
    difficulty: "intermediate"
  },
  "lambda-vpc-access": { 
    title: "Lambda in VPC", 
    description: "Connecting Lambda to private resources",
    difficulty: "advanced"
  },
  
  // DynamoDB
  "dynamodb-partition-keys": { 
    title: "Partition Keys", 
    description: "Designing effective partition keys for scalability",
    difficulty: "intermediate"
  },
  "dynamodb-ttl": { 
    title: "Time to Live (TTL)", 
    description: "Automatic item expiration",
    difficulty: "basic"
  },
  
  // S3
  "s3-storage-classes": { 
    title: "Storage Classes", 
    description: "Choosing the right storage tier for your data",
    difficulty: "basic"
  },
  
  // SQS
  "sqs-visibility-timeout": { 
    title: "Visibility Timeout", 
    description: "Preventing duplicate message processing",
    difficulty: "intermediate"
  },
  
  // API Gateway
  "rest-vs-http-apis": { 
    title: "REST vs HTTP APIs", 
    description: "Choosing the right API Gateway type",
    difficulty: "basic"
  },
  "authentication-methods": { 
    title: "Authentication Methods", 
    description: "Securing your APIs with different auth options",
    difficulty: "intermediate"
  },
  
  // Architecture
  "serverless-architecture": { 
    title: "Serverless Architecture", 
    description: "Building applications without managing servers",
    difficulty: "intermediate"
  },
  "disaster-recovery-patterns": { 
    title: "Disaster Recovery", 
    description: "Strategies for regional failure recovery",
    difficulty: "advanced"
  },
  
  // Add more as needed...
}

// Get metadata for an explainer
export function getExplainerMetadata(explainerId: string) {
  return explainerMetadata[explainerId] || {
    title: explainerId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: "Learn about this AWS concept",
    difficulty: "intermediate" as const
  }
}
