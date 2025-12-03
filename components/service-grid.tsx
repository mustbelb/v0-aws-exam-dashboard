import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Service {
  id: string
  name: string
  icon: string
  progress: number
}

const services: Service[] = [
  { id: "lambda", name: "Lambda", icon: "⚡", progress: 75 },
  { id: "s3", name: "S3", icon: "🪣", progress: 90 },
  { id: "dynamodb", name: "DynamoDB", icon: "📊", progress: 60 },
  { id: "api-gateway", name: "API Gateway", icon: "🚪", progress: 45 },
  { id: "iam", name: "IAM", icon: "🔐", progress: 85 },
  { id: "vpc", name: "VPC", icon: "🔗", progress: 50 },
  { id: "sqs", name: "SQS", icon: "📬", progress: 70 },
  { id: "sns", name: "SNS", icon: "📢", progress: 65 },
  { id: "cloudwatch", name: "CloudWatch", icon: "📈", progress: 55 },
  { id: "cloudformation", name: "CloudFormation", icon: "📋", progress: 40 },
  { id: "ecs", name: "ECS", icon: "🐳", progress: 35 },
  { id: "ecr", name: "ECR", icon: "📦", progress: 30 },
  { id: "step-functions", name: "Step Functions", icon: "🔄", progress: 25 },
  { id: "kinesis", name: "Kinesis", icon: "🌊", progress: 20 },
  { id: "cognito", name: "Cognito", icon: "👤", progress: 80 },
]

export function ServiceGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((service) => (
        <Link key={service.id} href={`/practice/${service.id}`}>
          <Card className="group transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <span className="text-5xl" role="img" aria-label={service.name}>
                {service.icon}
              </span>
              <h3 className="text-lg font-semibold text-center">{service.name}</h3>
              <div className="w-full space-y-2">
                <Progress value={service.progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">{service.progress}% mastered</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
