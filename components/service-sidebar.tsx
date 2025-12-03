import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ServiceSidebarProps {
  serviceName: string
  icon: string
  stats: {
    questionsAnswered: number
    correctRate: number
    averageTime: string
  }
}

export function ServiceSidebar({ serviceName, icon, stats }: ServiceSidebarProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-4xl" role="img" aria-label={serviceName}>
              {icon}
            </span>
            <CardTitle>{serviceName}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{stats.correctRate}%</span>
            </div>
            <Progress value={stats.correctRate} className="h-2" />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Questions Answered</span>
              <span className="font-semibold">{stats.questionsAnswered}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Correct Rate</span>
              <span className="font-semibold">{stats.correctRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Time</span>
              <span className="font-semibold">{stats.averageTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About {serviceName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {serviceName === "Lambda" &&
              "AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages compute resources."}
            {serviceName === "S3" &&
              "Amazon S3 is object storage built to store and retrieve any amount of data from anywhere with industry-leading scalability and durability."}
            {serviceName === "DynamoDB" &&
              "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
