// lib/services.ts

export interface ServiceDefinition {
  id: string
  name: string
  icon: string
  topics: string[]
  description: string
}

export const services: ServiceDefinition[] = [
  {
    id: 'lambda',
    name: 'AWS Lambda',
    icon: '⚡',
    description: 'Serverless compute service that runs code in response to events',
    topics: [
      'concurrency',
      'cold-starts',
      'triggers',
      'memory-timeout',
      'layers',
      'vpc-access',
      'environment-variables',
      'versions-aliases'
    ]
  },
  {
    id: 's3',
    name: 'Amazon S3',
    icon: '🪣',
    description: 'Object storage with industry-leading scalability and durability',
    topics: [
      'storage-classes',
      'lifecycle-policies',
      'versioning',
      'encryption',
      'access-control',
      'replication',
      'event-notifications'
    ]
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    icon: '📊',
    description: 'Fully managed NoSQL database with fast, predictable performance',
    topics: [
      'partition-keys',
      'sort-keys',
      'secondary-indexes',
      'capacity-modes',
      'streams',
      'transactions',
      'ttl'
    ]
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    icon: '🚪',
    description: 'Fully managed service for creating and managing APIs',
    topics: [
      'rest-vs-http',
      'authentication',
      'throttling',
      'stages',
      'caching',
      'cors',
      'request-validation'
    ]
  },
  {
    id: 'iam',
    name: 'IAM',
    icon: '🔐',
    description: 'Identity and access management for AWS resources',
    topics: [
      'policies',
      'roles',
      'users-groups',
      'cross-account',
      'service-roles',
      'permissions-boundaries'
    ]
  },
  {
    id: 'vpc',
    name: 'VPC',
    icon: '🔗',
    description: 'Isolated virtual network for your AWS resources',
    topics: [
      'subnets',
      'security-groups',
      'nacls',
      'nat-gateway',
      'peering',
      'endpoints',
      'flow-logs'
    ]
  },
  {
    id: 'sqs',
    name: 'SQS',
    icon: '📬',
    description: 'Fully managed message queuing service',
    topics: [
      'standard-vs-fifo',
      'visibility-timeout',
      'dead-letter-queues',
      'long-polling',
      'message-attributes'
    ]
  },
  {
    id: 'sns',
    name: 'SNS',
    icon: '📢',
    description: 'Pub/sub messaging and mobile notification service',
    topics: [
      'topics',
      'subscriptions',
      'message-filtering',
      'fanout-pattern',
      'mobile-push'
    ]
  },
  {
    id: 'cloudwatch',
    name: 'CloudWatch',
    icon: '📈',
    description: 'Monitoring and observability for AWS resources',
    topics: [
      'metrics',
      'logs',
      'alarms',
      'dashboards',
      'logs-insights',
      'contributor-insights'
    ]
  },
  {
    id: 'cloudformation',
    name: 'CloudFormation',
    icon: '📋',
    description: 'Infrastructure as code for AWS resources',
    topics: [
      'templates',
      'stacks',
      'changesets',
      'drift-detection',
      'nested-stacks',
      'stack-sets'
    ]
  },
  {
    id: 'ecs',
    name: 'ECS',
    icon: '🐳',
    description: 'Container orchestration service',
    topics: [
      'task-definitions',
      'services',
      'fargate-vs-ec2',
      'load-balancing',
      'service-discovery'
    ]
  },
  {
    id: 'ecr',
    name: 'ECR',
    icon: '📦',
    description: 'Fully managed container registry',
    topics: [
      'repositories',
      'lifecycle-policies',
      'image-scanning',
      'cross-account-access'
    ]
  },
  {
    id: 'step-functions',
    name: 'Step Functions',
    icon: '🔄',
    description: 'Visual workflow orchestration service',
    topics: [
      'state-machines',
      'standard-vs-express',
      'error-handling',
      'parallel-states',
      'wait-states'
    ]
  },
  {
    id: 'kinesis',
    name: 'Kinesis',
    icon: '🌊',
    description: 'Real-time data streaming service',
    topics: [
      'data-streams',
      'firehose',
      'analytics',
      'shards',
      'consumers'
    ]
  },
  {
    id: 'cognito',
    name: 'Cognito',
    icon: '👤',
    description: 'User authentication and authorization service',
    topics: [
      'user-pools',
      'identity-pools',
      'authentication-flows',
      'social-identity',
      'mfa'
    ]
  }
]

export function getServiceById(id: string): ServiceDefinition | undefined {
  return services.find(s => s.id === id)
}

export function getServiceTopics(id: string): string[] {
  return getServiceById(id)?.topics || []
}
