// Export all explainer maps from individual files
export { lambdaExplainers } from "./lambda-explainers"
export { dynamodbExplainers } from "./dynamodb-explainers"
export { s3Explainers } from "./s3-explainers"
export { sqsExplainers } from "./sqs-explainers"
export { snsExplainers } from "./sns-explainers"
export { vpcExplainers } from "./vpc-explainers"
export { ec2Explainers } from "./ec2-explainers"
export { iamExplainers } from "./iam-explainers"
export { apiGatewayExplainers } from "./api-gateway-explainers"
export { rdsAuroraExplainers } from "./rds-aurora-explainers"
export { ecsExplainers } from "./ecs-explainers"
export { cloudwatchExplainers } from "./cloudwatch-explainers"
export { cloudformationExplainers } from "./cloudformation-explainers"
export { kinesisStepfunctionsExplainers } from "./kinesis-stepfunctions-explainers"
export { cognitoSecretsExplainers } from "./cognito-secrets-explainers"
export { elbRoute53CloudfrontExplainers } from "./elb-route53-cloudfront-explainers"
export { architectureExplainers } from "./architecture-explainers"

// Import all explainer maps for the combined export
import { lambdaExplainers } from "./lambda-explainers"
import { dynamodbExplainers } from "./dynamodb-explainers"
import { s3Explainers } from "./s3-explainers"
import { sqsExplainers } from "./sqs-explainers"
import { snsExplainers } from "./sns-explainers"
import { vpcExplainers } from "./vpc-explainers"
import { ec2Explainers } from "./ec2-explainers"
import { iamExplainers } from "./iam-explainers"
import { apiGatewayExplainers } from "./api-gateway-explainers"
import { rdsAuroraExplainers } from "./rds-aurora-explainers"
import { ecsExplainers } from "./ecs-explainers"
import { cloudwatchExplainers } from "./cloudwatch-explainers"
import { cloudformationExplainers } from "./cloudformation-explainers"
import { kinesisStepfunctionsExplainers } from "./kinesis-stepfunctions-explainers"
import { cognitoSecretsExplainers } from "./cognito-secrets-explainers"
import { elbRoute53CloudfrontExplainers } from "./elb-route53-cloudfront-explainers"
import { architectureExplainers } from "./architecture-explainers"

// Combined explainer map with all topics
// Usage: const ExplainerComponent = allExplainers["lambda-concurrency"]
// Note: Using defensive spreads to handle potential undefined imports during lazy loading
export const allExplainers: Record<string, React.ComponentType> = {
  // Lambda explainers
  ...(lambdaExplainers || {}),

  // DynamoDB explainers
  ...(dynamodbExplainers || {}),

  // S3 explainers
  ...(s3Explainers || {}),

  // SQS explainers
  ...(sqsExplainers || {}),

  // SNS explainers
  ...(snsExplainers || {}),

  // VPC explainers
  ...(vpcExplainers || {}),

  // EC2 explainers
  ...(ec2Explainers || {}),

  // IAM explainers
  ...(iamExplainers || {}),

  // API Gateway explainers
  ...(apiGatewayExplainers || {}),

  // RDS/Aurora explainers
  ...(rdsAuroraExplainers || {}),

  // ECS explainers
  ...(ecsExplainers || {}),

  // CloudWatch explainers
  ...(cloudwatchExplainers || {}),

  // CloudFormation explainers
  ...(cloudformationExplainers || {}),

  // Kinesis/Step Functions explainers
  ...(kinesisStepfunctionsExplainers || {}),

  // Cognito/Secrets explainers
  ...(cognitoSecretsExplainers || {}),

  // ELB/Route53/CloudFront explainers
  ...(elbRoute53CloudfrontExplainers || {}),

  // Architecture explainers
  ...(architectureExplainers || {}),
}

// Helper function to get explainer by topic key
export function getExplainer(topicKey: string): React.ComponentType | undefined {
  return allExplainers[topicKey]
}

// Get all available topic keys
export function getAllTopicKeys(): string[] {
  return Object.keys(allExplainers)
}

// Category mappings for organizing explainers
// Note: Using defensive Object.keys() calls to handle potential undefined imports during lazy loading
export const explainerCategories = {
  compute: {
    name: "Compute",
    topics: [
      ...Object.keys(lambdaExplainers || {}),
      ...Object.keys(ec2Explainers || {}),
      ...Object.keys(ecsExplainers || {}),
    ]
  },
  storage: {
    name: "Storage & Databases",
    topics: [
      ...Object.keys(s3Explainers || {}),
      ...Object.keys(dynamodbExplainers || {}),
      ...Object.keys(rdsAuroraExplainers || {}),
    ]
  },
  networking: {
    name: "Networking & Content Delivery",
    topics: [
      ...Object.keys(vpcExplainers || {}),
      ...Object.keys(elbRoute53CloudfrontExplainers || {}),
      ...Object.keys(apiGatewayExplainers || {}),
    ]
  },
  messaging: {
    name: "Messaging & Integration",
    topics: [
      ...Object.keys(sqsExplainers || {}),
      ...Object.keys(snsExplainers || {}),
      ...Object.keys(kinesisStepfunctionsExplainers || {}),
    ]
  },
  security: {
    name: "Security & Identity",
    topics: [
      ...Object.keys(iamExplainers || {}),
      ...Object.keys(cognitoSecretsExplainers || {}),
    ]
  },
  monitoring: {
    name: "Monitoring & DevOps",
    topics: [
      ...Object.keys(cloudwatchExplainers || {}),
      ...Object.keys(cloudformationExplainers || {}),
    ]
  },
  architecture: {
    name: "Architecture Patterns",
    topics: Object.keys(architectureExplainers || {}),
  }
}
