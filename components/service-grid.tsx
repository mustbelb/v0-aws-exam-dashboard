"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getServicesByCategory, type CertificationType } from "@/lib/services"

interface ServiceGridProps {
  progressMap?: Map<string, number>
  certification: CertificationType
}

export function ServiceGrid({ progressMap, certification }: ServiceGridProps) {
  const servicesByCategory = getServicesByCategory(certification)
  
  return (
    <div className="space-y-8">
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <h4 className="text-lg font-medium text-muted-foreground border-b pb-2">
            {category}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryServices.map((service) => {
              const progress = progressMap?.get(service.id) || 0
              
              return (
                <Link 
                  key={service.id} 
                  href={`/practice/${service.id}?certification=${certification}`}
                >
                  <Card className="group transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-full">
                    <CardContent className="flex flex-col items-center gap-3 p-6">
                      <span className="text-5xl" role="img" aria-label={service.name}>
                        {service.icon}
                      </span>
                      <h3 className="text-lg font-semibold text-center">{service.name}</h3>
                      <div className="w-full space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          {progress > 0 ? `${progress}% mastered` : "Not started"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
