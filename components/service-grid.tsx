"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shuffle } from "lucide-react"
import { 
  getServicesByCategory, 
  getCategoriesForCertification,
  type CertificationType,
  type ServiceDefinition 
} from "@/lib/services"

interface ServiceGridProps {
  certification: CertificationType
  progressMap?: Map<string, number>
}

export function ServiceGrid({ certification, progressMap }: ServiceGridProps) {
  const servicesByCategory = getServicesByCategory(certification)
  const categories = getCategoriesForCertification(certification)
  
  return (
    <div className="space-y-10">
      {categories.map((category) => {
        const servicesInCategory = servicesByCategory[category.name] || []
        
        if (servicesInCategory.length === 0) return null
        
        // Calculate category average progress
        const categoryProgress = servicesInCategory.length > 0
          ? Math.round(
              servicesInCategory.reduce((sum, s) => sum + (progressMap?.get(s.id) || 0), 0) / 
              servicesInCategory.length
            )
          : 0
        
        return (
          <div key={category.id}>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <span className="text-sm text-muted-foreground">
                ({servicesInCategory.length} services)
              </span>
            </div>
            
            {/* Service Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Random Tile - First in each category */}
              <Link href={`/practice/random/${category.id}`}>
                <Card className="group transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-full border-dashed border-2 border-primary/30 bg-primary/5">
                  <CardContent className="flex flex-col items-center gap-3 p-6">
                    <div className="relative">
                      <Shuffle className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-center text-primary">
                      Random {category.name}
                    </h3>
                    <p className="text-sm text-center text-muted-foreground">
                      Practice all {category.name.toLowerCase()} services randomly
                    </p>
                    <div className="w-full space-y-2">
                      <Progress value={categoryProgress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        {categoryProgress > 0 ? `${categoryProgress}% avg` : "Not started"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Individual Service Tiles */}
              {servicesInCategory.map((service) => {
                const progress = progressMap?.get(service.id) || 0
                
                return (
                  <Link key={service.id} href={`/practice/${service.id}`}>
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
        )
      })}
    </div>
  )
}
