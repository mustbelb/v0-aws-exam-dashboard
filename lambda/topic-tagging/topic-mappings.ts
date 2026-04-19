// Topic keyword mappings for classifying questions
// Each topic has keywords that, when found in the question text, indicate that topic

export interface TopicMapping {
  topic: string
  keywords: string[]
  priority: number  // Higher priority = more specific topic
}

export const serviceMappings: Record<string, TopicMapping[]> = {
  // ===================
  // LAMBDA
  // ===================
  lambda: [
    {
      topic: "lambda-concurrency",
      keywords: [
        "concurrent", "concurrency", "throttling", "throttled", "reserved concurrency",
        "provisioned concurrency", "burst", "scaling", "429", "rate exceeded",
        "unreserved", "account limit", "concurrent executions"
      ],
      priority: 10
    },
    {
      topic: "lambda-cold-starts",
      keywords: [
        "cold start", "cold-start", "initialization", "init duration", "first invocation",
        "snapstart", "snap start", "warm", "keep warm", "provisioned concurrency",
        "startup latency", "execution context", "initializing"
      ],
      priority: 10
    },
    {
      topic: "lambda-vpc-access",
      keywords: [
        "vpc", "eni", "elastic network interface", "private subnet", "nat gateway",
        "nat instance", "private resource", "rds in vpc", "hyperplane", "vpc-enabled",
        "vpc access", "vpc configuration", "security group", "private network"
      ],
      priority: 10
    },
    {
      topic: "lambda-layers",
      keywords: [
        "layer", "layers", "shared code", "common dependencies", "shared libraries",
        "arn for layer", "custom runtime", "layer version"
      ],
      priority: 10
    },
    {
      topic: "lambda-memory-timeout",
      keywords: [
        "memory", "timeout", "128 mb", "256 mb", "512 mb", "1024 mb", "10240 mb",
        "15 minutes", "duration", "max timeout", "power tuning", "cpu", "execution time",
        "gb-seconds", "billing"
      ],
      priority: 8
    },
    {
      topic: "lambda-versions-aliases",
      keywords: [
        "version", "alias", "$latest", "traffic shifting", "weighted alias",
        "blue-green", "canary deployment", "published version", "function version",
        "immutable", "traffic split"
      ],
      priority: 10
    },
    {
      topic: "lambda-destinations",
      keywords: [
        "destination", "on success", "on failure", "async invocation", "asynchronous",
        "event destination", "success destination", "failure destination"
      ],
      priority: 10
    },
    {
      topic: "lambda-event-source-mappings",
      keywords: [
        "event source mapping", "esm", "batch size", "batch window", "kinesis trigger",
        "sqs trigger", "dynamodb trigger", "stream", "poller", "parallelization factor",
        "bisect", "starting position"
      ],
      priority: 10
    },
    {
      topic: "lambda-environment-config",
      keywords: [
        "environment variable", "env var", "configuration", "secrets", "parameter store",
        "ssm parameter", "encrypted environment", "kms", "runtime settings"
      ],
      priority: 8
    },
    {
      topic: "lambda-permissions",
      keywords: [
        "execution role", "resource-based policy", "function policy", "invoke permission",
        "trust policy", "lambda:invoke", "permission", "cross-account invoke"
      ],
      priority: 9
    },
    {
      topic: "lambda-invocation-types",
      keywords: [
        "synchronous", "asynchronous", "requestresponse", "event", "dryrun",
        "invoke type", "invocation type", "sync", "async"
      ],
      priority: 9
    },
    {
      topic: "lambda-error-handling",
      keywords: [
        "error handling", "retry", "dlq", "dead letter", "error", "exception",
        "failure", "max retry", "retry attempt", "on-failure"
      ],
      priority: 8
    },
    {
      topic: "lambda-container-images",
      keywords: [
        "container image", "ecr", "docker", "container", "dockerfile",
        "base image", "ric", "runtime interface client", "container lambda"
      ],
      priority: 10
    },
    {
      topic: "lambda-snapstart",
      keywords: [
        "snapstart", "snap start", "java", "corretto", "snapshot", "priming",
        "beforecheckpoint", "afterrestore"
      ],
      priority: 10
    },
    {
      topic: "lambda-function-urls",
      keywords: [
        "function url", "function urls", "https endpoint", "invoke url",
        "iam auth", "none auth", "public url"
      ],
      priority: 10
    },
    // Cross-service: Lambda@Edge (primary explainer in CloudFront)
    {
      topic: "cloudfront-lambda-edge",
      keywords: [
        "lambda@edge", "edge function", "viewer request", "origin request",
        "viewer response", "origin response", "cloudfront edge", "edge location",
        "edge locations", "cloudfront trigger", "edge compute"
      ],
      priority: 11
    },
    // Cross-service: X-Ray tracing for Lambda
    {
      topic: "xray-integration",
      keywords: [
        "x-ray", "xray", "trace", "tracing", "segment", "subsegment",
        "service map", "active tracing", "tracing enabled"
      ],
      priority: 9
    },
    // Cross-service: EventBridge triggering Lambda
    {
      topic: "eventbridge",
      keywords: [
        "eventbridge", "event bus", "event pattern", "scheduled",
        "cron", "rate", "schedule expression", "eventbridge rule"
      ],
      priority: 9
    },
    // Cross-service: S3 event notifications triggering Lambda
    {
      topic: "s3-event-notifications",
      keywords: [
        "s3 event", "s3 notification", "s3:objectcreated", "s3:objectremoved",
        "bucket notification", "s3 trigger"
      ],
      priority: 9
    }
  ],

  // ===================
  // DYNAMODB
  // ===================
  dynamodb: [
    {
      topic: "dynamodb-partition-keys",
      keywords: [
        "partition key", "hash key", "key design", "high cardinality", "even distribution",
        "hot partition", "composite key", "pk design", "sharding", "partition strategy"
      ],
      priority: 9
    },
    {
      topic: "dynamodb-sort-keys",
      keywords: [
        "sort key", "range key", "sk", "begins_with", "between", "hierarchical",
        "composite sort key", "query patterns"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-gsi-lsi",
      keywords: [
        "gsi", "lsi", "global secondary index", "local secondary index", "secondary index",
        "alternate key", "sparse index", "projection", "keys_only", "create.*index",
        "query.*attribute", "not.*partition key"
      ],
      priority: 11
    },
    {
      topic: "dynamodb-capacity-modes",
      keywords: [
        "on-demand", "provisioned", "rcu", "wcu", "read capacity", "write capacity",
        "capacity mode", "throughput", "burst capacity", "auto scaling", "capacity units"
      ],
      priority: 9
    },
    {
      topic: "dynamodb-streams",
      keywords: [
        "streams", "stream", "change data capture", "cdc", "keys_only", "new_image",
        "old_image", "new_and_old_images", "stream record", "shard iterator"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-transactions",
      keywords: [
        "transaction", "transact", "transactwriteitems", "transactgetitems", "acid",
        "all-or-nothing", "idempotent", "clientrequesttoken"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-ttl",
      keywords: [
        "ttl", "time to live", "expiration", "expire", "delete automatically",
        "epoch time", "ttl attribute"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-dax",
      keywords: [
        "dax", "accelerator", "in-memory cache", "microsecond", "read-intensive",
        "eventually consistent", "write-through"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-global-tables",
      keywords: [
        "global table", "multi-region", "replication", "active-active",
        "cross-region", "disaster recovery"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-query-scan",
      keywords: [
        "query", "scan", "filter", "filterexpression", "consumed capacity",
        "parallel scan", "sequential", "limit", "pagination"
      ],
      priority: 8
    },
    {
      topic: "dynamodb-conditional-writes",
      keywords: [
        "conditional", "condition expression", "attribute_exists", "attribute_not_exists",
        "optimistic locking", "version", "conditioncheckfailed"
      ],
      priority: 10
    },
    {
      topic: "dynamodb-batch-operations",
      keywords: [
        "batch", "batchwriteitem", "batchgetitem", "unprocessed", "25 items",
        "bulk", "parallel"
      ],
      priority: 9
    },
    {
      topic: "dynamodb-item-size",
      keywords: [
        "400 kb", "item size", "large item", "item collection", "attribute size",
        "string limit", "binary limit"
      ],
      priority: 9
    },
    {
      topic: "dynamodb-backup-restore",
      keywords: [
        "backup", "restore", "pitr", "point-in-time", "continuous backup",
        "on-demand backup"
      ],
      priority: 9
    },
    {
      topic: "dynamodb-auto-scaling",
      keywords: [
        "auto scaling", "autoscaling", "target utilization", "scaling policy",
        "minimum capacity", "maximum capacity"
      ],
      priority: 9
    },
    // Cross-service: Lambda processing DynamoDB Streams
    {
      topic: "lambda-event-source-mappings",
      keywords: [
        "lambda", "lambda trigger", "lambda function", "event source mapping",
        "stream processing", "batch size", "starting position", "bisect"
      ],
      priority: 9
    }
  ],

  // ===================
  // S3
  // ===================
  s3: [
    {
      topic: "s3-storage-classes",
      keywords: [
        "storage class", "intelligent-tiering", "standard-ia", "one zone-ia",
        "glacier instant", "glacier flexible", "glacier deep archive",
        "reduced redundancy", "storage tier", "access frequency", "which.*class",
        "lowest cost", "retrieval time", "frequently accessed", "infrequently accessed"
      ],
      priority: 9
    },
    {
      topic: "s3-lifecycle",
      keywords: [
        "lifecycle", "transition", "expiration", "lifecycle rule", "lifecycle policy",
        "days since creation", "noncurrent version", "abort multipart", "move after",
        "transition after", "automatically transition", "days old", "after 30 days"
      ],
      priority: 11
    },
    {
      topic: "s3-versioning",
      keywords: [
        "versioning", "version id", "delete marker", "mfa delete", "noncurrent",
        "latest version", "version-enabled", "suspended"
      ],
      priority: 10
    },
    {
      topic: "s3-encryption",
      keywords: [
        "sse-s3", "sse-kms", "sse-c", "server-side encryption", "client-side encryption",
        "default encryption", "bucket key", "aes-256", "x-amz-server-side-encryption"
      ],
      priority: 10
    },
    {
      topic: "s3-bucket-policies",
      keywords: [
        "bucket policy", "acl", "access control list", "public access", "block public",
        "canonical user", "object acl", "bucket acl", "public-read"
      ],
      priority: 9
    },
    {
      topic: "s3-presigned-urls",
      keywords: [
        "presigned url", "pre-signed", "temporary access", "expiration time",
        "signature", "shared access", "temporary url"
      ],
      priority: 10
    },
    {
      topic: "s3-replication",
      keywords: [
        "crr", "srr", "cross-region replication", "same-region replication",
        "replication", "replica", "replication rule", "replication time control"
      ],
      priority: 10
    },
    {
      topic: "s3-event-notifications",
      keywords: [
        "event notification", "s3 event", "s3:objectcreated", "s3:objectremoved",
        "trigger lambda", "sqs notification", "sns notification", "eventbridge"
      ],
      priority: 10
    },
    {
      topic: "s3-transfer-acceleration",
      keywords: [
        "transfer acceleration", "accelerate", "edge location", "cloudfront",
        "upload speed", "global transfer"
      ],
      priority: 10
    },
    {
      topic: "s3-select",
      keywords: [
        "s3 select", "glacier select", "sql", "query in place", "csv", "json",
        "parquet", "selectobjectcontent"
      ],
      priority: 10
    },
    {
      topic: "s3-access-points",
      keywords: [
        "access point", "bucket access point", "vpc access point", "arn",
        "access policy"
      ],
      priority: 10
    },
    {
      topic: "s3-object-lock",
      keywords: [
        "object lock", "worm", "retention", "legal hold", "governance mode",
        "compliance mode", "immutable"
      ],
      priority: 10
    },
    {
      topic: "s3-multipart-upload",
      keywords: [
        "multipart", "multi-part", "upload part", "complete multipart",
        "5 gb", "5 tb", "large file", "parallel upload"
      ],
      priority: 10
    },
    {
      topic: "s3-cors",
      keywords: [
        "cors", "cross-origin", "access-control-allow", "origin header",
        "preflight", "options"
      ],
      priority: 10
    },
    {
      topic: "s3-batch-operations",
      keywords: [
        "batch operations", "s3 batch", "inventory", "manifest", "bulk operations",
        "copy objects", "tag objects"
      ],
      priority: 10
    }
  ],

  // ===================
  // SQS
  // ===================
  sqs: [
    {
      topic: "sqs-standard-vs-fifo",
      keywords: [
        "standard queue", "fifo queue", "fifo", "exactly-once", "at-least-once",
        "ordering", "message order", "sequence", "deduplication"
      ],
      priority: 10
    },
    {
      topic: "sqs-visibility-timeout",
      keywords: [
        "visibility timeout", "invisible", "inflight", "in-flight", "receive count",
        "change visibility", "default visibility", "30 seconds"
      ],
      priority: 10
    },
    {
      topic: "sqs-dlq",
      keywords: [
        "dead letter", "dlq", "redrive", "maxreceivecount", "failed message",
        "redrive policy", "poison message"
      ],
      priority: 10
    },
    {
      topic: "sqs-long-polling",
      keywords: [
        "long polling", "short polling", "waittimeseconds", "receive message wait",
        "polling", "empty response"
      ],
      priority: 10
    },
    {
      topic: "sqs-batching",
      keywords: [
        "batch", "sendbatch", "deletebatch", "10 messages", "batch size",
        "receivemessage"
      ],
      priority: 9
    },
    {
      topic: "sqs-delay-queues",
      keywords: [
        "delay queue", "delay seconds", "delayseconds", "message timer",
        "delayed message"
      ],
      priority: 10
    },
    {
      topic: "sqs-message-attributes",
      keywords: [
        "message attribute", "metadata", "messageattributes", "string", "number",
        "binary", "custom attribute"
      ],
      priority: 9
    },
    {
      topic: "sqs-lambda-integration",
      keywords: [
        "lambda trigger", "event source mapping", "sqs trigger", "lambda poll",
        "batch window"
      ],
      priority: 9
    },
    {
      topic: "sqs-message-retention",
      keywords: [
        "retention", "message retention", "4 days", "14 days", "retention period",
        "message expiration"
      ],
      priority: 9
    },
    {
      topic: "sqs-security",
      keywords: [
        "queue policy", "sse-sqs", "sse-kms", "encrypted queue", "server-side encryption",
        "access policy"
      ],
      priority: 8
    }
  ],

  // ===================
  // SNS
  // ===================
  sns: [
    {
      topic: "sns-topics",
      keywords: [
        "topic", "standard topic", "fifo topic", "topic arn", "create topic",
        "publish", "message publish"
      ],
      priority: 8
    },
    {
      topic: "sns-subscriptions",
      keywords: [
        "subscription", "subscribe", "endpoint", "protocol", "email", "sms",
        "http", "https", "lambda", "sqs", "confirmation"
      ],
      priority: 9
    },
    {
      topic: "sns-filtering",
      keywords: [
        "filter", "filter policy", "message filtering", "subscription filter",
        "attribute filter", "message attributes"
      ],
      priority: 10
    },
    {
      topic: "sns-fanout-pattern",
      keywords: [
        "fanout", "fan-out", "multiple subscribers", "sqs subscribers",
        "parallel processing", "one-to-many"
      ],
      priority: 10
    },
    {
      topic: "sns-message-attributes",
      keywords: [
        "message attribute", "messageattributes", "metadata",
        "binary", "string", "number"
      ],
      priority: 8
    },
    {
      topic: "sns-delivery-policies",
      keywords: [
        "delivery policy", "retry", "backoff", "http delivery", "throttle",
        "delivery status"
      ],
      priority: 9
    },
    {
      topic: "sns-fifo-topics",
      keywords: [
        "fifo topic", "message ordering", "message deduplication",
        "message group", "exactly-once"
      ],
      priority: 10
    },
    {
      topic: "sns-mobile-push",
      keywords: [
        "mobile push", "push notification", "apns", "gcm", "fcm",
        "platform application", "device token"
      ],
      priority: 10
    },
    {
      topic: "sns-sms",
      keywords: [
        "sms", "text message", "promotional", "transactional", "opt-out",
        "phone number"
      ],
      priority: 10
    },
    {
      topic: "sns-dlq",
      keywords: [
        "dead letter", "dlq", "failed delivery", "redrive", "sns dlq"
      ],
      priority: 10
    }
  ],

  // ===================
  // VPC
  // ===================
  vpc: [
    {
      topic: "vpc-subnets",
      keywords: [
        "create subnet", "subnet design", "availability zone", "subnet sizing",
        "cidr block", "ip range", "auto-assign public ip", "subnet tier"
      ],
      priority: 8
    },
    {
      topic: "vpc-security-groups-nacls",
      keywords: [
        "security group", "nacl", "network acl", "inbound", "outbound",
        "stateful", "stateless", "firewall rule", "deny rule", "allow rule",
        "difference between", "security vs nacl"
      ],
      priority: 10
    },
    {
      topic: "vpc-nat-gateway",
      keywords: [
        "nat gateway", "nat instance", "internet access", "private subnet internet",
        "outbound internet", "software updates", "download packages",
        "internet from private", "access internet"
      ],
      priority: 11
    },
    {
      topic: "vpc-endpoints",
      keywords: [
        "vpc endpoint", "interface endpoint", "gateway endpoint", "privatelink",
        "s3 endpoint", "dynamodb endpoint", "endpoint policy", "without internet",
        "private connectivity", "private access", "without routing"
      ],
      priority: 11
    },
    {
      topic: "vpc-peering",
      keywords: [
        "vpc peering", "peering connection", "cross-account", "cross-region",
        "no transitive", "peering route"
      ],
      priority: 10
    },
    {
      topic: "vpc-route-tables",
      keywords: [
        "route table", "routing", "destination", "target", "local route",
        "main route table", "subnet association"
      ],
      priority: 9
    },
    {
      topic: "vpc-flow-logs",
      keywords: [
        "flow log", "vpc flow", "traffic logging", "network traffic",
        "cloudwatch logs", "s3 bucket", "eni flow"
      ],
      priority: 10
    },
    {
      topic: "vpc-transit-gateway",
      keywords: [
        "transit gateway", "tgw", "hub and spoke", "centralized", "multi-vpc",
        "transit gateway attachment"
      ],
      priority: 10
    },
    {
      topic: "vpc-privatelink",
      keywords: [
        "privatelink", "endpoint service", "nlb privatelink", "interface endpoint",
        "private connectivity"
      ],
      priority: 10
    },
    {
      topic: "vpc-bastion-session-manager",
      keywords: [
        "bastion", "bastion host", "jump box", "session manager", "ssm",
        "systems manager", "ssh"
      ],
      priority: 10
    },
    {
      topic: "vpc-internet-gateway",
      keywords: [
        "internet gateway", "igw", "public internet", "attach igw",
        "internet connectivity"
      ],
      priority: 9
    },
    {
      topic: "vpc-elastic-ip",
      keywords: [
        "elastic ip", "eip", "static ip", "public ip", "ip address"
      ],
      priority: 9
    },
    {
      topic: "vpc-dns",
      keywords: [
        "dns", "enable dns", "dns hostname", "dns support", "route 53 resolver",
        "private hosted zone"
      ],
      priority: 9
    },
    {
      topic: "vpc-cidr-planning",
      keywords: [
        "cidr", "ip planning", "ip range", "subnet sizing", "non-overlapping",
        "secondary cidr"
      ],
      priority: 9
    },
    {
      topic: "vpc-direct-connect",
      keywords: [
        "direct connect", "dx", "dedicated connection", "private vif",
        "public vif", "transit vif", "1 gbps", "10 gbps"
      ],
      priority: 10
    }
  ],

  // ===================
  // EC2
  // ===================
  ec2: [
    {
      topic: "ec2-instance-types",
      keywords: [
        "instance type", "t2", "t3", "m5", "c5", "r5", "compute optimized",
        "memory optimized", "general purpose", "burstable"
      ],
      priority: 9
    },
    {
      topic: "ec2-pricing-models",
      keywords: [
        "on-demand", "reserved", "spot", "savings plan", "dedicated host",
        "dedicated instance", "spot instance", "reserved instance"
      ],
      priority: 10
    },
    {
      topic: "ec2-placement-groups",
      keywords: [
        "placement group", "cluster", "spread", "partition", "low latency",
        "high availability"
      ],
      priority: 10
    },
    {
      topic: "ec2-instance-store-ebs",
      keywords: [
        "instance store", "ephemeral", "ebs", "ebs volume", "root volume",
        "block storage", "persistent"
      ],
      priority: 10
    },
    {
      topic: "ec2-ami",
      keywords: [
        "ami", "amazon machine image", "custom ami", "ami copy", "ami sharing",
        "golden image"
      ],
      priority: 10
    },
    {
      topic: "ec2-user-data",
      keywords: [
        "user data", "bootstrap", "startup script", "initialization",
        "cloud-init", "first boot"
      ],
      priority: 10
    },
    {
      topic: "ec2-metadata",
      keywords: [
        "instance metadata", "metadata", "169.254.169.254", "imds",
        "instance identity", "iam role credentials"
      ],
      priority: 10
    },
    {
      topic: "ec2-auto-scaling",
      keywords: [
        "auto scaling", "launch template", "launch configuration", "scaling policy",
        "target tracking", "step scaling", "scheduled scaling", "asg"
      ],
      priority: 10
    },
    {
      topic: "ec2-ebs-types",
      keywords: [
        "gp2", "gp3", "io1", "io2", "st1", "sc1", "iops", "throughput",
        "provisioned iops", "ssd", "hdd"
      ],
      priority: 10
    },
    {
      topic: "ec2-ebs-snapshots",
      keywords: [
        "snapshot", "ebs snapshot", "backup", "incremental", "copy snapshot",
        "encrypted snapshot"
      ],
      priority: 10
    },
    {
      topic: "ec2-hibernation",
      keywords: [
        "hibernation", "hibernate", "suspend", "ram contents", "resume"
      ],
      priority: 10
    },
    {
      topic: "ec2-eni",
      keywords: [
        "eni", "elastic network interface", "multiple eni", "secondary ip",
        "network interface"
      ],
      priority: 9
    }
  ],

  // ===================
  // IAM
  // ===================
  iam: [
    {
      topic: "iam-policy-evaluation",
      keywords: [
        "policy evaluation", "explicit deny", "implicit deny", "allow",
        "evaluation logic", "deny wins"
      ],
      priority: 10
    },
    {
      topic: "iam-policy-types",
      keywords: [
        "identity-based", "resource-based", "managed policy", "inline policy",
        "aws managed", "customer managed", "service control"
      ],
      priority: 10
    },
    {
      topic: "iam-roles-users",
      keywords: [
        "difference between role and user", "when to use role", "when to use user",
        "iam user", "service role", "application identity"
      ],
      priority: 8
    },
    {
      topic: "iam-cross-account",
      keywords: [
        "cross-account", "external id", "another account", "external account",
        "trusted account", "different account", "cross account access",
        "grant.*another aws account", "from another account"
      ],
      priority: 11
    },
    {
      topic: "iam-permissions-boundaries",
      keywords: [
        "permissions boundary", "boundary", "maximum permissions",
        "delegate permissions"
      ],
      priority: 10
    },
    {
      topic: "iam-instance-profiles",
      keywords: [
        "instance profile", "ec2 role", "instance role", "iam role for ec2",
        "credentials"
      ],
      priority: 10
    },
    {
      topic: "iam-sts",
      keywords: [
        "sts", "assume role", "temporary credentials", "session token",
        "getsessiontoken", "assumerole", "temporary security", "federate",
        "role session", "token service"
      ],
      priority: 11
    },
    {
      topic: "iam-conditions",
      keywords: [
        "condition", "condition key", "ip address", "mfa", "sourceip",
        "stringequals", "aws:sourcevpc"
      ],
      priority: 9
    },
    {
      topic: "iam-scps",
      keywords: [
        "scp", "service control policy", "organization", "guardrail",
        "restrict actions"
      ],
      priority: 10
    },
    {
      topic: "iam-groups",
      keywords: [
        "group", "iam group", "user group", "group policy", "group membership"
      ],
      priority: 8
    },
    {
      topic: "iam-mfa",
      keywords: [
        "mfa", "multi-factor", "virtual mfa", "hardware mfa", "totp",
        "authenticator"
      ],
      priority: 10
    },
    {
      topic: "iam-access-keys",
      keywords: [
        "access key", "secret key", "rotate key", "programmatic access",
        "cli credentials"
      ],
      priority: 9
    },
    {
      topic: "iam-resource-based-policies",
      keywords: [
        "resource-based", "bucket policy", "key policy", "trust policy",
        "principal"
      ],
      priority: 10
    },
    {
      topic: "iam-policy-simulator",
      keywords: [
        "policy simulator", "simulate", "test policy", "effective permissions"
      ],
      priority: 10
    },
    {
      topic: "iam-identity-center",
      keywords: [
        "identity center", "sso", "single sign-on", "saml", "federation",
        "idp", "identity provider"
      ],
      priority: 10
    }
  ],

  // ===================
  // API GATEWAY
  // ===================
  "api-gateway": [
    {
      topic: "rest-vs-http-apis",
      keywords: [
        "rest api", "http api", "api type", "rest vs http", "websocket api",
        "regional", "edge-optimized", "private api"
      ],
      priority: 10
    },
    {
      topic: "stages-deployments",
      keywords: [
        "stage", "deployment", "stage variable", "deploy api", "canary deployment",
        "prod", "dev", "test"
      ],
      priority: 10
    },
    {
      topic: "authentication-methods",
      keywords: [
        "cognito authorizer", "lambda authorizer", "iam authorization", "api key",
        "authorizer", "jwt", "token validation"
      ],
      priority: 10
    },
    {
      topic: "throttling-rate-limiting",
      keywords: [
        "throttling", "rate limit", "burst limit", "steady-state", "429",
        "usage plan", "api quota"
      ],
      priority: 10
    },
    {
      topic: "api-caching",
      keywords: [
        "cache", "caching", "ttl", "cache invalidation", "cache capacity",
        "stage cache"
      ],
      priority: 10
    },
    {
      topic: "request-response-transformations",
      keywords: [
        "mapping template", "vtl", "velocity", "request transformation",
        "response transformation", "integration request", "integration response"
      ],
      priority: 10
    },
    {
      topic: "websocket-apis",
      keywords: [
        "websocket", "bidirectional", "connection", "onconnect", "ondisconnect",
        "onmessage", "route"
      ],
      priority: 10
    },
    {
      topic: "api-gateway-cors",
      keywords: [
        "cors", "cross-origin", "options", "preflight", "access-control",
        "allowed origins"
      ],
      priority: 10
    },
    {
      topic: "integration-types",
      keywords: [
        "integration type", "aws_proxy", "lambda proxy", "http_proxy", "mock",
        "aws integration"
      ],
      priority: 10
    },
    {
      topic: "usage-plans",
      keywords: [
        "usage plan", "api key", "quota", "rate limit", "throttle",
        "subscription"
      ],
      priority: 10
    },
    {
      topic: "private-apis",
      keywords: [
        "private api", "vpc endpoint", "vpce", "resource policy",
        "internal api"
      ],
      priority: 10
    },
    {
      topic: "custom-domains",
      keywords: [
        "custom domain", "domain name", "base path", "acm certificate",
        "route 53"
      ],
      priority: 10
    },
    {
      topic: "api-gateway-logging",
      keywords: [
        "access log", "execution log", "cloudwatch", "logging",
        "api logging"
      ],
      priority: 9
    },
    {
      topic: "mock-integration",
      keywords: [
        "mock", "mock integration", "test api", "stub", "no backend"
      ],
      priority: 10
    },
    {
      topic: "openapi-swagger",
      keywords: [
        "openapi", "swagger", "api definition", "import", "export",
        "specification"
      ],
      priority: 10
    }
  ],

  // ===================
  // RDS / AURORA
  // ===================
  rds: [
    {
      topic: "multi-az-deployments",
      keywords: [
        "multi-az", "standby", "synchronous replication", "failover",
        "high availability", "automatic failover"
      ],
      priority: 10
    },
    {
      topic: "read-replicas",
      keywords: [
        "read replica", "replica", "asynchronous replication", "read scaling",
        "promote replica", "cross-region replica"
      ],
      priority: 10
    },
    {
      topic: "aurora-architecture",
      keywords: [
        "aurora", "cluster volume", "aurora replica", "writer endpoint",
        "reader endpoint", "shared storage"
      ],
      priority: 10
    },
    {
      topic: "rds-proxy",
      keywords: [
        "rds proxy", "proxy", "connection pooling", "connection management",
        "lambda connection", "serverless"
      ],
      priority: 10
    },
    {
      topic: "backup-recovery",
      keywords: [
        "backup", "automated backup", "snapshot", "restore", "retention period",
        "point-in-time", "pitr"
      ],
      priority: 9
    },
    {
      topic: "parameter-option-groups",
      keywords: [
        "parameter group", "option group", "db parameter", "database settings",
        "configuration"
      ],
      priority: 9
    },
    {
      topic: "aurora-serverless",
      keywords: [
        "serverless", "aurora serverless", "acu", "capacity unit", "auto pause",
        "scale to zero"
      ],
      priority: 10
    },
    {
      topic: "rds-encryption",
      keywords: [
        "encryption", "kms", "tde", "encrypted rds", "ssl", "in-transit",
        "at-rest"
      ],
      priority: 9
    },
    {
      topic: "aurora-global-database",
      keywords: [
        "global database", "cross-region", "disaster recovery", "secondary region",
        "rpo", "rto"
      ],
      priority: 10
    },
    {
      topic: "rds-performance-insights",
      keywords: [
        "performance insights", "database load", "wait events", "top sql",
        "monitoring"
      ],
      priority: 10
    },
    {
      topic: "aurora-cloning",
      keywords: [
        "clone", "cloning", "copy-on-write", "test database", "development copy"
      ],
      priority: 10
    },
    {
      topic: "rds-maintenance-windows",
      keywords: [
        "maintenance window", "maintenance", "patching", "upgrade",
        "scheduled maintenance"
      ],
      priority: 9
    },
    {
      topic: "rds-storage-autoscaling",
      keywords: [
        "storage autoscaling", "storage scaling", "automatic storage",
        "max storage", "allocated storage"
      ],
      priority: 9
    },
    {
      topic: "aurora-endpoints",
      keywords: [
        "cluster endpoint", "reader endpoint", "instance endpoint",
        "custom endpoint"
      ],
      priority: 10
    },
    {
      topic: "rds-iam-authentication",
      keywords: [
        "iam authentication", "iam database", "token", "rds iam",
        "password-less"
      ],
      priority: 10
    }
  ],
  aurora: [
    {
      topic: "aurora-architecture",
      keywords: [
        "aurora", "cluster volume", "aurora replica", "writer endpoint",
        "reader endpoint", "shared storage"
      ],
      priority: 10
    },
    {
      topic: "aurora-serverless",
      keywords: [
        "serverless", "aurora serverless", "acu", "capacity unit", "auto pause",
        "scale to zero"
      ],
      priority: 10
    },
    {
      topic: "aurora-global-database",
      keywords: [
        "global database", "cross-region", "disaster recovery", "secondary region",
        "rpo", "rto"
      ],
      priority: 10
    },
    {
      topic: "aurora-cloning",
      keywords: [
        "clone", "cloning", "copy-on-write", "test database", "development copy"
      ],
      priority: 10
    },
    {
      topic: "aurora-endpoints",
      keywords: [
        "cluster endpoint", "reader endpoint", "instance endpoint",
        "custom endpoint"
      ],
      priority: 10
    },
    {
      topic: "read-replicas",
      keywords: [
        "read replica", "replica", "asynchronous replication", "read scaling",
        "up to 15 replicas"
      ],
      priority: 10
    },
    {
      topic: "multi-az-deployments",
      keywords: [
        "multi-az", "high availability", "failover", "automatic failover"
      ],
      priority: 9
    }
  ],

  // ===================
  // ECS
  // ===================
  ecs: [
    {
      topic: "ecs-vs-fargate",
      keywords: [
        "fargate", "ec2 launch type", "launch type", "serverless container",
        "managed infrastructure"
      ],
      priority: 10
    },
    {
      topic: "task-definitions",
      keywords: [
        "task definition", "container definition", "task", "cpu", "memory",
        "task role", "execution role"
      ],
      priority: 10
    },
    {
      topic: "service-auto-scaling",
      keywords: [
        "service scaling", "target tracking", "step scaling", "scheduled scaling",
        "desired count", "minimum", "maximum"
      ],
      priority: 10
    },
    {
      topic: "ecr-integration",
      keywords: [
        "ecr", "elastic container registry", "container registry", "image",
        "push", "pull"
      ],
      priority: 10
    },
    {
      topic: "ecs-service-discovery",
      keywords: [
        "service discovery", "cloud map", "dns", "service mesh",
        "namespace"
      ],
      priority: 10
    },
    {
      topic: "ecs-load-balancing",
      keywords: [
        "load balancer", "alb", "nlb", "target group", "dynamic port",
        "host-based routing"
      ],
      priority: 9
    },
    {
      topic: "ecs-secrets-management",
      keywords: [
        "secrets manager", "parameter store", "environment secrets",
        "secret injection"
      ],
      priority: 10
    },
    {
      topic: "ecs-capacity-providers",
      keywords: [
        "capacity provider", "fargate", "fargate spot", "ec2 capacity",
        "auto scaling"
      ],
      priority: 10
    },
    {
      topic: "ecs-logging",
      keywords: [
        "awslogs", "cloudwatch logs", "log driver", "firelens", "fluentbit",
        "container logs"
      ],
      priority: 9
    },
    {
      topic: "ecr-lifecycle-policies",
      keywords: [
        "lifecycle policy", "image cleanup", "untagged images", "expire images"
      ],
      priority: 10
    },
    {
      topic: "ecr-image-scanning",
      keywords: [
        "image scanning", "vulnerability", "cve", "scan on push",
        "security scan"
      ],
      priority: 10
    },
    {
      topic: "ecs-networking-modes",
      keywords: [
        "network mode", "awsvpc", "bridge", "host", "none",
        "task networking"
      ],
      priority: 10
    }
  ],

  // ===================
  // CLOUDWATCH
  // ===================
  cloudwatch: [
    {
      topic: "metrics-dimensions",
      keywords: [
        "metric", "dimension", "namespace", "custom metric", "putmetricdata",
        "period", "statistic"
      ],
      priority: 9
    },
    {
      topic: "cloudwatch-alarms",
      keywords: [
        "alarm", "alarm state", "ok", "alarm", "insufficient data",
        "threshold", "action"
      ],
      priority: 10
    },
    {
      topic: "logs-insights",
      keywords: [
        "logs insights", "query", "log query", "fields", "filter",
        "parse", "stats"
      ],
      priority: 10
    },
    {
      topic: "eventbridge",
      keywords: [
        "eventbridge", "event bus", "event pattern", "event rule",
        "target", "schedule"
      ],
      priority: 10
    },
    {
      topic: "xray-integration",
      keywords: [
        "x-ray", "xray", "trace", "tracing", "segment", "subsegment",
        "service map"
      ],
      priority: 10
    },
    {
      topic: "cloudwatch-dashboards",
      keywords: [
        "dashboard", "widget", "visualization", "custom dashboard"
      ],
      priority: 9
    },
    {
      topic: "cloudwatch-agent",
      keywords: [
        "cloudwatch agent", "unified agent", "collectd", "statsd",
        "custom metrics", "logs agent"
      ],
      priority: 10
    },
    {
      topic: "cloudwatch-logs-retention",
      keywords: [
        "retention", "log retention", "never expire", "expiration policy",
        "log group"
      ],
      priority: 9
    },
    {
      topic: "cloudwatch-composite-alarms",
      keywords: [
        "composite alarm", "alarm rule", "and", "or", "multiple alarms"
      ],
      priority: 10
    },
    {
      topic: "cloudwatch-metric-math",
      keywords: [
        "metric math", "expression", "calculation", "formula", "math"
      ],
      priority: 10
    },
    {
      topic: "cloudwatch-anomaly-detection",
      keywords: [
        "anomaly detection", "anomaly", "band", "expected", "ml"
      ],
      priority: 10
    },
    {
      topic: "eventbridge-rules",
      keywords: [
        "event rule", "event pattern", "schedule expression", "cron",
        "rate"
      ],
      priority: 10
    },
    {
      topic: "eventbridge-scheduler",
      keywords: [
        "scheduler", "scheduled task", "one-time", "recurring",
        "flexible time window"
      ],
      priority: 10
    },
    {
      topic: "xray-segments",
      keywords: [
        "segment", "subsegment", "trace header", "sampling", "annotation",
        "metadata"
      ],
      priority: 10
    },
    {
      topic: "cloudwatch-contributor-insights",
      keywords: [
        "contributor insights", "top contributors", "high cardinality",
        "analysis"
      ],
      priority: 10
    }
  ],

  // ===================
  // CLOUDFORMATION
  // ===================
  cloudformation: [
    {
      topic: "template-structure",
      keywords: [
        "template", "resources", "parameters", "outputs", "description",
        "awstemplatformatversion", "yaml", "json"
      ],
      priority: 9
    },
    {
      topic: "stack-operations",
      keywords: [
        "stack", "create stack", "update stack", "delete stack", "rollback",
        "stack status"
      ],
      priority: 9
    },
    {
      topic: "intrinsic-functions",
      keywords: [
        "ref", "fn::ref", "fn::getatt", "fn::join", "fn::sub", "fn::if",
        "fn::select", "fn::split"
      ],
      priority: 10
    },
    {
      topic: "nested-stacks",
      keywords: [
        "nested stack", "aws::cloudformation::stack", "cross-stack",
        "parent stack", "child stack"
      ],
      priority: 10
    },
    {
      topic: "sam-templates",
      keywords: [
        "sam", "serverless", "aws::serverless", "transform", "globals",
        "sam template"
      ],
      priority: 10
    },
    {
      topic: "drift-detection",
      keywords: [
        "drift", "drift detection", "detect drift", "configuration drift",
        "modified", "deleted"
      ],
      priority: 10
    },
    {
      topic: "helper-scripts",
      keywords: [
        "cfn-init", "cfn-signal", "cfn-hup", "cfn-get-metadata",
        "helper script", "metadata"
      ],
      priority: 10
    },
    {
      topic: "wait-conditions",
      keywords: [
        "wait condition", "waitconditionhandle", "signal", "timeout",
        "creation policy"
      ],
      priority: 10
    },
    {
      topic: "mappings",
      keywords: [
        "mappings", "fn::findmap", "region mapping", "lookup table"
      ],
      priority: 10
    },
    {
      topic: "conditions",
      keywords: [
        "condition", "fn::if", "fn::equals", "fn::and", "fn::or",
        "conditional resource"
      ],
      priority: 10
    },
    {
      topic: "custom-resources",
      keywords: [
        "custom resource", "custom::resource", "lambda-backed", "cfnresponse",
        "servicettoken"
      ],
      priority: 10
    },
    {
      topic: "stack-policies",
      keywords: [
        "stack policy", "update protection", "prevent update", "protect resource"
      ],
      priority: 10
    }
  ],

  // ===================
  // KINESIS
  // ===================
  kinesis: [
    {
      topic: "kinesis-data-streams",
      keywords: [
        "data stream", "shard", "partition key", "sequence number",
        "putrecord", "getrecords"
      ],
      priority: 10
    },
    {
      topic: "kinesis-firehose",
      keywords: [
        "firehose", "delivery stream", "s3 delivery", "redshift delivery",
        "transformation", "buffering"
      ],
      priority: 10
    },
    {
      topic: "kinesis-analytics",
      keywords: [
        "kinesis analytics", "sql", "flink", "real-time analytics",
        "streaming sql"
      ],
      priority: 10
    },
    {
      topic: "enhanced-fan-out",
      keywords: [
        "enhanced fan-out", "efo", "dedicated throughput", "consumer",
        "subscribetostream"
      ],
      priority: 10
    },
    {
      topic: "streaming-comparison",
      keywords: [
        "kinesis vs sqs", "kinesis vs kafka", "streaming comparison",
        "real-time processing"
      ],
      priority: 9
    },
    {
      topic: "kinesis-kcl",
      keywords: [
        "kcl", "kinesis client library", "consumer library", "checkpoint",
        "lease table"
      ],
      priority: 10
    },
    // Cross-service: Lambda consuming Kinesis streams
    {
      topic: "lambda-event-source-mappings",
      keywords: [
        "lambda", "lambda consumer", "lambda trigger", "event source mapping",
        "batch size", "parallelization factor", "bisect on error", "lambda function"
      ],
      priority: 9
    }
  ],

  // ===================
  // STEP FUNCTIONS
  // ===================
  "step-functions": [
    {
      topic: "step-functions-state-machine",
      keywords: [
        "state machine", "asl", "amazon states language", "workflow",
        "execution"
      ],
      priority: 10
    },
    {
      topic: "step-functions-error-handling",
      keywords: [
        "retry", "catch", "error handling", "states.all", "states.timeout",
        "states.taskfailed"
      ],
      priority: 10
    },
    {
      topic: "step-functions-parallel",
      keywords: [
        "parallel", "parallel state", "branches", "concurrent execution"
      ],
      priority: 10
    },
    {
      topic: "step-functions-choice",
      keywords: [
        "choice", "choice state", "branching", "conditional", "comparison"
      ],
      priority: 10
    },
    {
      topic: "step-functions-map",
      keywords: [
        "map", "map state", "iteration", "iterator", "itemsprocessor",
        "distributed map"
      ],
      priority: 10
    },
    {
      topic: "step-functions-integrations",
      keywords: [
        "service integration", "optimized integration", "lambda integration",
        "sdk integration", "waitfortasktoken"
      ],
      priority: 10
    }
  ],

  // ===================
  // COGNITO
  // ===================
  cognito: [
    {
      topic: "cognito-user-pools",
      keywords: [
        "user pool", "authentication", "sign up", "sign in", "mfa",
        "password policy"
      ],
      priority: 10
    },
    {
      topic: "cognito-identity-pools",
      keywords: [
        "identity pool", "federated identity", "aws credentials",
        "unauthenticated", "authenticated"
      ],
      priority: 10
    },
    {
      topic: "cognito-triggers",
      keywords: [
        "lambda trigger", "pre-sign-up", "post-confirmation", "pre-token",
        "custom message"
      ],
      priority: 10
    },
    {
      topic: "cognito-hosted-ui",
      keywords: [
        "hosted ui", "hosted sign-in", "oauth", "authorization code",
        "implicit grant"
      ],
      priority: 10
    }
  ],

  // ===================
  // SECRETS MANAGER
  // ===================
  "secrets-manager": [
    {
      topic: "secrets-manager",
      keywords: [
        "secrets manager", "secret rotation", "automatic rotation", "lambda rotation",
        "getvalue", "getsecretvalue"
      ],
      priority: 10
    },
    {
      topic: "parameter-store",
      keywords: [
        "parameter store", "ssm parameter", "string", "stringlist", "securestring",
        "hierarchy", "standard", "advanced"
      ],
      priority: 10
    },
    {
      topic: "secrets-vs-parameter",
      keywords: [
        "secrets vs parameter", "comparison", "when to use", "difference"
      ],
      priority: 10
    }
  ],

  // ===================
  // KMS
  // ===================
  kms: [
    {
      topic: "kms-keys",
      keywords: [
        "cmk", "customer master key", "kms key", "aws managed key",
        "customer managed key"
      ],
      priority: 10
    },
    {
      topic: "kms-encryption",
      keywords: [
        "encrypt", "decrypt", "envelope encryption", "data key",
        "generatedatakey"
      ],
      priority: 10
    },
    {
      topic: "kms-rotation",
      keywords: [
        "key rotation", "automatic rotation", "annual rotation", "rotate key"
      ],
      priority: 10
    }
  ],

  // ===================
  // ELB
  // ===================
  elb: [
    {
      topic: "load-balancer-types",
      keywords: [
        "alb", "nlb", "clb", "application load balancer", "network load balancer",
        "classic load balancer", "gateway load balancer"
      ],
      priority: 10
    },
    {
      topic: "alb-target-groups",
      keywords: [
        "target group", "target", "health check", "target type",
        "instance", "ip", "lambda"
      ],
      priority: 10
    },
    {
      topic: "ssl-tls-certificates",
      keywords: [
        "ssl", "tls", "certificate", "acm", "sni", "ssl termination",
        "https"
      ],
      priority: 10
    },
    {
      topic: "health-checks",
      keywords: [
        "health check", "healthy", "unhealthy", "threshold", "interval",
        "timeout"
      ],
      priority: 9
    },
    {
      topic: "connection-draining",
      keywords: [
        "connection draining", "deregistration delay", "drain", "in-flight"
      ],
      priority: 10
    },
    {
      topic: "sticky-sessions",
      keywords: [
        "sticky session", "session affinity", "cookie", "stickiness",
        "target group stickiness"
      ],
      priority: 10
    },
    {
      topic: "cross-zone-load-balancing",
      keywords: [
        "cross-zone", "availability zone", "distribute traffic", "even distribution"
      ],
      priority: 10
    },
    {
      topic: "nlb-static-ip",
      keywords: [
        "static ip", "elastic ip", "nlb", "fixed ip", "whitelisting"
      ],
      priority: 10
    }
  ],

  // ===================
  // ROUTE 53
  // ===================
  route53: [
    {
      topic: "route53-routing-policies",
      keywords: [
        "routing policy", "simple", "weighted", "latency", "failover",
        "geolocation", "geoproximity", "multivalue"
      ],
      priority: 10
    },
    {
      topic: "route53-hosted-zones",
      keywords: [
        "hosted zone", "public hosted zone", "private hosted zone",
        "domain", "subdomain"
      ],
      priority: 10
    },
    {
      topic: "route53-record-types",
      keywords: [
        "a record", "aaaa", "cname", "alias", "mx", "txt", "ns",
        "record type"
      ],
      priority: 10
    },
    {
      topic: "health-checks",
      keywords: [
        "health check", "endpoint health", "calculated", "cloudwatch alarm",
        "failover"
      ],
      priority: 9
    }
  ],

  // ===================
  // CLOUDFRONT
  // ===================
  cloudfront: [
    {
      topic: "cloudfront-distributions",
      keywords: [
        "distribution", "edge location", "pop", "cache", "origin",
        "behavior"
      ],
      priority: 9
    },
    {
      topic: "cloudfront-lambda-edge",
      keywords: [
        "lambda@edge", "edge function", "viewer request", "origin request",
        "viewer response", "origin response"
      ],
      priority: 10
    },
    {
      topic: "cloudfront-oac",
      keywords: [
        "oac", "oai", "origin access control", "origin access identity",
        "s3 origin"
      ],
      priority: 10
    },
    {
      topic: "cloudfront-signed-urls",
      keywords: [
        "signed url", "signed cookie", "private content", "trusted key group",
        "custom policy"
      ],
      priority: 10
    }
  ],

  // ===================
  // ELASTICACHE
  // ===================
  elasticache: [
    {
      topic: "redis-vs-memcached",
      keywords: [
        "redis", "memcached", "caching", "in-memory", "data structures",
        "persistence"
      ],
      priority: 10
    },
    {
      topic: "cluster-mode",
      keywords: [
        "cluster mode", "sharding", "node group", "replica", "partitioning"
      ],
      priority: 10
    },
    {
      topic: "caching-strategies",
      keywords: [
        "lazy loading", "write-through", "cache-aside", "ttl", "invalidation"
      ],
      priority: 10
    }
  ],

  // ===================
  // EVENTBRIDGE
  // ===================
  eventbridge: [
    {
      topic: "eventbridge",
      keywords: [
        "eventbridge", "event bus", "event pattern", "event rule",
        "target", "schedule"
      ],
      priority: 10
    },
    {
      topic: "eventbridge-rules",
      keywords: [
        "event rule", "event pattern", "schedule expression", "cron",
        "rate"
      ],
      priority: 10
    },
    {
      topic: "eventbridge-scheduler",
      keywords: [
        "scheduler", "scheduled task", "one-time", "recurring",
        "flexible time window"
      ],
      priority: 10
    }
  ],

  // ===================
  // X-RAY
  // ===================
  "x-ray": [
    {
      topic: "xray-integration",
      keywords: [
        "x-ray", "xray", "trace", "tracing", "segment", "subsegment",
        "service map"
      ],
      priority: 10
    },
    {
      topic: "xray-segments",
      keywords: [
        "segment", "subsegment", "trace header", "sampling", "annotation",
        "metadata"
      ],
      priority: 10
    }
  ]
}

// Fallback topics for each service when no specific match is found
export const fallbackTopics: Record<string, string> = {
  lambda: "lambda-concurrency",
  dynamodb: "dynamodb-partition-keys",
  s3: "s3-storage-classes",
  sqs: "sqs-standard-vs-fifo",
  sns: "sns-topics",
  vpc: "vpc-subnets",
  ec2: "ec2-instance-types",
  iam: "iam-policy-evaluation",
  "api-gateway": "rest-vs-http-apis",
  rds: "multi-az-deployments",
  aurora: "aurora-architecture",
  ecs: "task-definitions",
  cloudwatch: "cloudwatch-alarms",
  cloudformation: "template-structure",
  kinesis: "kinesis-data-streams",
  "step-functions": "step-functions-state-machine",
  cognito: "cognito-user-pools",
  "secrets-manager": "secrets-manager",
  kms: "kms-keys",
  elb: "load-balancer-types",
  route53: "route53-routing-policies",
  cloudfront: "cloudfront-distributions",
  elasticache: "redis-vs-memcached",
  eventbridge: "eventbridge",
  "x-ray": "xray-integration"
}
