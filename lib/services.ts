// lib/services.ts

export type CertificationType = 'DVA-C02' | 'SAA-C03'

export interface CertificationInfo {
  id: CertificationType
  name: string
  fullName: string
  description: string
  icon: string
}

export interface ServiceDefinition {
  id: string
  name: string
  icon: string
  topics: string[]
  description: string
  certifications: CertificationType[]
}

export interface CategoryDefinition {
  id: string
  name: string
  icon: string
  serviceIds: string[]
}

// Certification definitions
export const certifications: CertificationInfo[] = [
  {
    id: 'SAA-C03',
    name: 'Solutions Architect',
    fullName: 'AWS Certified Solutions Architect - Associate',
    description: 'Design secure, resilient, high-performing, and cost-optimized architectures',
    icon: '🏗️'
  },
  {
    id: 'DVA-C02',
    name: 'Developer',
    fullName: 'AWS Certified Developer - Associate',
    description: 'Develop, deploy, and debug cloud-based applications using AWS',
    icon: '💻'
  }
]

// Category definitions for random mode
export const categories: CategoryDefinition[] = [
  {
    id: 'compute',
    name: 'Compute',
    icon: '🖥️',
    serviceIds: ['ec2', 'lambda', 'ecs', 'eks', 'elastic-beanstalk', 'auto-scaling']
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: '💾',
    serviceIds: ['s3', 'ebs', 'efs', 's3-glacier', 'fsx', 'storage-gateway']
  },
  {
    id: 'database',
    name: 'Database',
    icon: '🗄️',
    serviceIds: ['dynamodb', 'rds', 'aurora', 'elasticache', 'redshift']
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
    serviceIds: ['vpc', 'route53', 'cloudfront', 'elb', 'api-gateway', 'direct-connect', 'global-accelerator']
  },
  {
    id: 'security',
    name: 'Security & Identity',
    icon: '🔐',
    serviceIds: ['iam', 'cognito', 'kms', 'secrets-manager', 'waf', 'shield', 'acm']
  },
  {
    id: 'integration',
    name: 'Application Integration',
    icon: '🔗',
    serviceIds: ['sqs', 'sns', 'eventbridge', 'step-functions', 'kinesis']
  },
  {
    id: 'management',
    name: 'Management & Monitoring',
    icon: '📊',
    serviceIds: ['cloudwatch', 'cloudtrail', 'cloudformation', 'systems-manager', 'config', 'x-ray']
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    icon: '🛠️',
    serviceIds: ['codepipeline', 'codebuild', 'codedeploy', 'codecommit', 'ecr', 'sam']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📈',
    serviceIds: ['athena', 'glue', 'emr']
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    icon: '🤖',
    serviceIds: ['sagemaker', 'rekognition']
  },
  {
    id: 'migration',
    name: 'Migration & Transfer',
    icon: '🚚',
    serviceIds: ['dms', 'snow-family', 'datasync']
  }
]

// All services with certification mappings
export const services: ServiceDefinition[] = [
  // =====================
  // COMPUTE SERVICES
  // =====================
  {
    id: 'ec2',
    name: 'Amazon EC2',
    icon: '🖥️',
    description: 'Virtual servers in the cloud with resizable compute capacity',
    topics: [
      'instance-types',
      'pricing-models',
      'placement-groups',
      'ami-creation',
      'user-data',
      'instance-metadata',
      'elastic-ip',
      'instance-store-vs-ebs'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'ecs',
    name: 'Amazon ECS',
    icon: '🐳',
    description: 'Highly scalable container orchestration service',
    topics: [
      'task-definitions',
      'services',
      'fargate-vs-ec2',
      'load-balancing',
      'service-discovery'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'eks',
    name: 'Amazon EKS',
    icon: '☸️',
    description: 'Managed Kubernetes service for container orchestration',
    topics: [
      'cluster-management',
      'node-groups',
      'fargate-profiles',
      'service-accounts',
      'ingress-controllers'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'elastic-beanstalk',
    name: 'Elastic Beanstalk',
    icon: '🌱',
    description: 'Easy-to-use service for deploying web applications',
    topics: [
      'deployment-policies',
      'environment-types',
      'configuration-files',
      'platform-updates',
      'worker-environments'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'auto-scaling',
    name: 'Auto Scaling',
    icon: '📈',
    description: 'Automatically adjust capacity to maintain performance',
    topics: [
      'launch-templates',
      'scaling-policies',
      'target-tracking',
      'scheduled-scaling',
      'predictive-scaling',
      'lifecycle-hooks'
    ],
    certifications: ['SAA-C03']
  },

  // =====================
  // STORAGE SERVICES
  // =====================
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'ebs',
    name: 'Amazon EBS',
    icon: '💾',
    description: 'Block storage volumes for EC2 instances',
    topics: [
      'volume-types',
      'snapshots',
      'encryption',
      'multi-attach',
      'performance-optimization',
      'raid-configurations'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'efs',
    name: 'Amazon EFS',
    icon: '📁',
    description: 'Fully managed elastic file system for Linux workloads',
    topics: [
      'performance-modes',
      'throughput-modes',
      'storage-classes',
      'lifecycle-management',
      'access-points',
      'mount-targets'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 's3-glacier',
    name: 'S3 Glacier',
    icon: '🧊',
    description: 'Low-cost archive storage with retrieval options',
    topics: [
      'glacier-instant',
      'glacier-flexible',
      'glacier-deep-archive',
      'retrieval-options',
      'vault-lock',
      'lifecycle-transitions'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'fsx',
    name: 'Amazon FSx',
    icon: '📂',
    description: 'Fully managed file systems for various workloads',
    topics: [
      'fsx-windows',
      'fsx-lustre',
      'fsx-netapp',
      'fsx-openzfs',
      'performance-optimization'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'storage-gateway',
    name: 'Storage Gateway',
    icon: '🚪',
    description: 'Hybrid cloud storage integration',
    topics: [
      'file-gateway',
      'volume-gateway',
      'tape-gateway',
      'cached-vs-stored',
      'hybrid-architectures'
    ],
    certifications: ['SAA-C03']
  },

  // =====================
  // DATABASE SERVICES
  // =====================
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
      'ttl',
      'global-tables'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    icon: '🗄️',
    description: 'Managed relational database service',
    topics: [
      'multi-az',
      'read-replicas',
      'backup-restore',
      'parameter-groups',
      'option-groups',
      'performance-insights',
      'proxy'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'aurora',
    name: 'Amazon Aurora',
    icon: '✨',
    description: 'High-performance managed relational database',
    topics: [
      'aurora-replicas',
      'global-database',
      'serverless-v2',
      'multi-master',
      'backtrack',
      'cloning',
      'parallel-query'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'elasticache',
    name: 'ElastiCache',
    icon: '⚡',
    description: 'In-memory caching service for Redis and Memcached',
    topics: [
      'redis-vs-memcached',
      'cluster-mode',
      'replication',
      'backup-restore',
      'caching-strategies',
      'session-management'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'redshift',
    name: 'Amazon Redshift',
    icon: '🔴',
    description: 'Fast, scalable data warehouse',
    topics: [
      'cluster-architecture',
      'distribution-styles',
      'sort-keys',
      'spectrum',
      'concurrency-scaling',
      'workload-management'
    ],
    certifications: ['SAA-C03']
  },

  // =====================
  // NETWORKING
  // =====================
  {
    id: 'vpc',
    name: 'Amazon VPC',
    icon: '🔗',
    description: 'Isolated virtual network for your AWS resources',
    topics: [
      'subnets',
      'security-groups',
      'nacls',
      'nat-gateway',
      'peering',
      'endpoints',
      'flow-logs',
      'transit-gateway'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'route53',
    name: 'Route 53',
    icon: '🌐',
    description: 'Scalable DNS and domain registration',
    topics: [
      'routing-policies',
      'health-checks',
      'alias-records',
      'hosted-zones',
      'domain-registration',
      'dnssec',
      'resolver'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    icon: '🌍',
    description: 'Fast content delivery network (CDN)',
    topics: [
      'distributions',
      'origins',
      'cache-behaviors',
      'edge-functions',
      'signed-urls',
      'origin-access-identity',
      'geo-restriction'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'elb',
    name: 'Elastic Load Balancing',
    icon: '⚖️',
    description: 'Distribute traffic across multiple targets',
    topics: [
      'alb-vs-nlb-vs-clb',
      'target-groups',
      'health-checks',
      'sticky-sessions',
      'cross-zone-balancing',
      'ssl-termination',
      'path-based-routing'
    ],
    certifications: ['SAA-C03']
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'direct-connect',
    name: 'Direct Connect',
    icon: '🔌',
    description: 'Dedicated network connection to AWS',
    topics: [
      'dedicated-vs-hosted',
      'virtual-interfaces',
      'lag-groups',
      'resiliency',
      'encryption'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'global-accelerator',
    name: 'Global Accelerator',
    icon: '🚀',
    description: 'Improve availability and performance using AWS global network',
    topics: [
      'accelerators',
      'endpoint-groups',
      'static-ip',
      'health-checks',
      'client-affinity'
    ],
    certifications: ['SAA-C03']
  },

  // =====================
  // SECURITY & IDENTITY
  // =====================
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
      'permissions-boundaries',
      'identity-federation'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'kms',
    name: 'AWS KMS',
    icon: '🔑',
    description: 'Create and manage cryptographic keys',
    topics: [
      'cmk-types',
      'key-policies',
      'envelope-encryption',
      'key-rotation',
      'grants',
      'multi-region-keys'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'secrets-manager',
    name: 'Secrets Manager',
    icon: '🤫',
    description: 'Rotate, manage, and retrieve secrets',
    topics: [
      'secret-rotation',
      'rds-integration',
      'cross-account-access',
      'versioning',
      'resource-policies'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'waf',
    name: 'AWS WAF',
    icon: '🛡️',
    description: 'Web application firewall for protection against exploits',
    topics: [
      'web-acls',
      'rules-groups',
      'rate-limiting',
      'managed-rules',
      'logging'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'shield',
    name: 'AWS Shield',
    icon: '🛡️',
    description: 'DDoS protection for AWS applications',
    topics: [
      'shield-standard',
      'shield-advanced',
      'ddos-response-team',
      'cost-protection'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'acm',
    name: 'ACM',
    icon: '📜',
    description: 'Provision and manage SSL/TLS certificates',
    topics: [
      'public-certificates',
      'private-ca',
      'domain-validation',
      'auto-renewal',
      'certificate-transparency'
    ],
    certifications: ['SAA-C03']
  },

  // =====================
  // APPLICATION INTEGRATION
  // =====================
  {
    id: 'sqs',
    name: 'Amazon SQS',
    icon: '📬',
    description: 'Fully managed message queuing service',
    topics: [
      'standard-vs-fifo',
      'visibility-timeout',
      'dead-letter-queues',
      'long-polling',
      'message-attributes'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'sns',
    name: 'Amazon SNS',
    icon: '📢',
    description: 'Pub/sub messaging and mobile notification service',
    topics: [
      'topics',
      'subscriptions',
      'message-filtering',
      'fanout-pattern',
      'mobile-push'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'eventbridge',
    name: 'EventBridge',
    icon: '🚌',
    description: 'Serverless event bus for application integration',
    topics: [
      'event-buses',
      'rules-patterns',
      'schema-registry',
      'archive-replay',
      'api-destinations'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
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
      'consumers',
      'enhanced-fan-out'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },

  // =====================
  // MANAGEMENT & MONITORING
  // =====================
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
      'contributor-insights',
      'custom-metrics'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'cloudtrail',
    name: 'CloudTrail',
    icon: '📝',
    description: 'Track user activity and API usage',
    topics: [
      'management-events',
      'data-events',
      'insights-events',
      'organization-trails',
      'log-file-validation'
    ],
    certifications: ['SAA-C03']
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'systems-manager',
    name: 'Systems Manager',
    icon: '⚙️',
    description: 'Operations hub for managing AWS resources',
    topics: [
      'parameter-store',
      'session-manager',
      'patch-manager',
      'run-command',
      'state-manager',
      'automation'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'config',
    name: 'AWS Config',
    icon: '📋',
    description: 'Track resource configurations and compliance',
    topics: [
      'config-rules',
      'conformance-packs',
      'remediation',
      'aggregators',
      'resource-timeline'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'x-ray',
    name: 'AWS X-Ray',
    icon: '🔍',
    description: 'Analyze and debug distributed applications',
    topics: [
      'traces',
      'segments',
      'subsegments',
      'annotations',
      'service-map',
      'sampling'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },

  // =====================
  // DEVELOPER TOOLS (DVA-C02 Heavy)
  // =====================
  {
    id: 'codepipeline',
    name: 'CodePipeline',
    icon: '🔧',
    description: 'Continuous delivery service for fast updates',
    topics: [
      'pipeline-stages',
      'actions',
      'artifacts',
      'manual-approval',
      'cross-account'
    ],
    certifications: ['DVA-C02']
  },
  {
    id: 'codebuild',
    name: 'CodeBuild',
    icon: '🏗️',
    description: 'Fully managed build service',
    topics: [
      'buildspec',
      'build-environments',
      'caching',
      'reports',
      'vpc-access'
    ],
    certifications: ['DVA-C02']
  },
  {
    id: 'codedeploy',
    name: 'CodeDeploy',
    icon: '🚀',
    description: 'Automated application deployments',
    topics: [
      'deployment-types',
      'appspec',
      'deployment-groups',
      'rollbacks',
      'lifecycle-hooks'
    ],
    certifications: ['DVA-C02']
  },
  {
    id: 'codecommit',
    name: 'CodeCommit',
    icon: '📦',
    description: 'Managed source control service',
    topics: [
      'repositories',
      'branches',
      'pull-requests',
      'triggers',
      'cross-account'
    ],
    certifications: ['DVA-C02']
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
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },
  {
    id: 'sam',
    name: 'AWS SAM',
    icon: '🐿️',
    description: 'Serverless Application Model for Lambda apps',
    topics: [
      'sam-templates',
      'sam-cli',
      'local-testing',
      'deployment',
      'policy-templates'
    ],
    certifications: ['DVA-C02']
  },

  // =====================
  // ANALYTICS (SAA-C03 Heavy)
  // =====================
  {
    id: 'athena',
    name: 'Athena',
    icon: '🔎',
    description: 'Interactive query service for S3 data',
    topics: [
      'sql-queries',
      'partitioning',
      'workgroups',
      'federated-queries',
      'cost-optimization'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'glue',
    name: 'AWS Glue',
    icon: '🧪',
    description: 'Serverless data integration service',
    topics: [
      'crawlers',
      'data-catalog',
      'etl-jobs',
      'classifiers',
      'connections'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'emr',
    name: 'Amazon EMR',
    icon: '🗺️',
    description: 'Big data processing with Hadoop and Spark',
    topics: [
      'cluster-types',
      'instance-fleets',
      'step-execution',
      'spot-instances',
      'emr-on-eks'
    ],
    certifications: ['SAA-C03']
  },

  // =====================
  // MACHINE LEARNING
  // =====================
  {
    id: 'sagemaker',
    name: 'SageMaker',
    icon: '🤖',
    description: 'Build, train, and deploy ML models',
    topics: [
      'notebooks',
      'training-jobs',
      'endpoints',
      'built-in-algorithms',
      'feature-store'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'rekognition',
    name: 'Rekognition',
    icon: '👁️',
    description: 'Image and video analysis',
    topics: [
      'object-detection',
      'face-analysis',
      'content-moderation',
      'celebrity-recognition'
    ],
    certifications: ['SAA-C03', 'DVA-C02']
  },

  // =====================
  // MIGRATION & TRANSFER
  // =====================
  {
    id: 'dms',
    name: 'Database Migration',
    icon: '🚚',
    description: 'Database migration service',
    topics: [
      'replication-instances',
      'endpoints',
      'task-types',
      'schema-conversion',
      'ongoing-replication'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'snow-family',
    name: 'Snow Family',
    icon: '❄️',
    description: 'Physical devices for data transfer',
    topics: [
      'snowcone',
      'snowball-edge',
      'snowmobile',
      'data-sync',
      'edge-computing'
    ],
    certifications: ['SAA-C03']
  },
  {
    id: 'datasync',
    name: 'DataSync',
    icon: '🔄',
    description: 'Automated data transfer service',
    topics: [
      'agents',
      'locations',
      'task-scheduling',
      'filtering',
      'verification'
    ],
    certifications: ['SAA-C03']
  }
]

// Helper functions
export function getCertificationById(id: CertificationType): CertificationInfo | undefined {
  return certifications.find(c => c.id === id)
}

export function getServicesForCertification(certId: CertificationType): ServiceDefinition[] {
  return services.filter(s => s.certifications.includes(certId))
}

export function getServiceById(id: string): ServiceDefinition | undefined {
  return services.find(s => s.id === id)
}

export function getServiceTopics(id: string): string[] {
  return getServiceById(id)?.topics || []
}

// Category helpers
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return categories.find(c => c.id === id)
}

export function getServicesInCategory(categoryId: string, certId: CertificationType): ServiceDefinition[] {
  const category = getCategoryById(categoryId)
  if (!category) return []
  
  return services.filter(
    s => category.serviceIds.includes(s.id) && s.certifications.includes(certId)
  )
}

export function getRandomServiceFromCategory(categoryId: string, certId: CertificationType): ServiceDefinition | null {
  const eligibleServices = getServicesInCategory(categoryId, certId)
  if (eligibleServices.length === 0) return null
  
  return eligibleServices[Math.floor(Math.random() * eligibleServices.length)]
}

export function getCategoriesForCertification(certId: CertificationType): CategoryDefinition[] {
  return categories.filter(category => {
    const servicesInCategory = getServicesInCategory(category.id, certId)
    return servicesInCategory.length > 0
  })
}

// Get services grouped by category for display
export function getServicesByCategory(certId: CertificationType): Record<string, ServiceDefinition[]> {
  const result: Record<string, ServiceDefinition[]> = {}
  
  for (const category of categories) {
    const servicesInCategory = getServicesInCategory(category.id, certId)
    if (servicesInCategory.length > 0) {
      result[category.name] = servicesInCategory
    }
  }
  
  return result
}
