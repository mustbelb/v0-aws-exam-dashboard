"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Layers, RefreshCw, Globe, Shield, Zap, Database } from "lucide-react"

// 1. Serverless Architecture Explainer (Rich)
export function ServerlessArchitectureExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [requestCount, setRequestCount] = useState(0)

  const steps = [
    { title: "Serverless Architecture", description: "Build applications without managing servers - pay per execution" },
    { title: "API Gateway + Lambda", description: "Event-driven compute triggered by HTTP requests" },
    { title: "Auto Scaling", description: "Scales automatically from zero to thousands of requests" },
    { title: "Pay Per Use", description: "Only pay for compute time used, no idle costs" },
    { title: "Managed Services", description: "Use DynamoDB, S3, SNS, SQS for a fully serverless stack" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Simulate requests
  useEffect(() => {
    const interval = setInterval(() => {
      setRequestCount(c => (c + Math.floor(Math.random() * 5)) % 100)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Serverless Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Client */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">📱</span>
            </div>
            <span className="text-sm text-gray-400">Client</span>
          </div>

          {/* Arrow */}
          <div className="text-gray-500">→</div>

          {/* API Gateway */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm text-gray-400">API GW</span>
          </div>

          {/* Arrow */}
          <div className="text-gray-500">→</div>

          {/* Lambda */}
          <div className="text-center relative">
            <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <span className="text-3xl">λ</span>
              <span className="text-xs text-white">x{Math.max(1, Math.floor(requestCount / 10))}</span>
            </div>
            <span className="text-sm text-gray-400">Lambda</span>
          </div>

          {/* Arrows to services */}
          <div className="text-gray-500">→</div>

          {/* Backend Services */}
          <div className="flex flex-col gap-2">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">S3</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{requestCount}</div>
            <div className="text-xs text-gray-400">Active Requests</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">$0.00</div>
            <div className="text-xs text-gray-400">Idle Cost</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">∞</div>
            <div className="text-xs text-gray-400">Scale Limit</div>
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Serverless = no server management, pay per use</li>
          <li>• Lambda + API GW + DynamoDB = common pattern</li>
          <li>• Consider cold starts for latency-sensitive apps</li>
          <li>• Use SQS/SNS for async, decoupled architectures</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Microservices Architecture Explainer (Rich)
export function MicroservicesArchitectureExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const steps = [
    { title: "Microservices", description: "Decompose applications into small, independent services" },
    { title: "Service Independence", description: "Each service can be developed, deployed, and scaled independently" },
    { title: "Communication", description: "Services communicate via APIs (sync) or events (async)" },
    { title: "ECS/EKS Hosting", description: "Run microservices on ECS, EKS, or Lambda" },
    { title: "Service Mesh", description: "Use App Mesh for service-to-service communication" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const services = [
    { name: "User Service", color: "blue", icon: "👤" },
    { name: "Order Service", color: "green", icon: "📦" },
    { name: "Payment Service", color: "yellow", icon: "💳" },
    { name: "Notification", color: "purple", icon: "🔔" }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Microservices Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* API Gateway */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md bg-purple-600 rounded-lg p-4 text-center">
            <Globe className="w-6 h-6 text-white mx-auto mb-1" />
            <span className="text-white text-sm">API Gateway / ALB</span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {services.map((service, i) => (
            <div
              key={i}
              onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedService === service.name
                  ? "ring-2 ring-white scale-105"
                  : ""
              }`}
              style={{
                backgroundColor:
                  service.color === "blue" ? "#1e40af" :
                  service.color === "green" ? "#166534" :
                  service.color === "yellow" ? "#854d0e" :
                  "#7e22ce"
              }}
            >
              <div className="text-center">
                <span className="text-2xl">{service.icon}</span>
                <div className="text-white text-xs mt-2">{service.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Communication */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-300 mb-3">Communication Patterns</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-600 rounded-lg p-3">
              <div className="text-green-400 text-sm font-semibold">Synchronous</div>
              <div className="text-xs text-gray-400 mt-1">REST/gRPC via ALB</div>
            </div>
            <div className="bg-gray-600 rounded-lg p-3">
              <div className="text-orange-400 text-sm font-semibold">Asynchronous</div>
              <div className="text-xs text-gray-400 mt-1">Events via SQS/SNS/EventBridge</div>
            </div>
          </div>
        </div>

        {/* Selected Service Details */}
        {selectedService && (
          <div className="mt-4 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
            <div className="text-blue-400 font-semibold">{selectedService}</div>
            <div className="text-sm text-gray-300 mt-2">
              • Own database (bounded context)<br />
              • Independent deployment<br />
              • Scales independently
            </div>
          </div>
        )}
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Each microservice has its own database</li>
          <li>• Use ALB for synchronous, SQS/SNS for async</li>
          <li>• ECS/Fargate or EKS for container hosting</li>
          <li>• Service discovery via Cloud Map or ECS Service Connect</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Event-Driven Architecture Explainer (Rich)
export function EventDrivenArchitectureExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [eventCount, setEventCount] = useState(0)

  const steps = [
    { title: "Event-Driven Architecture", description: "Loosely coupled systems that communicate through events" },
    { title: "Event Producers", description: "Services emit events when state changes" },
    { title: "Event Router", description: "EventBridge or SNS routes events to consumers" },
    { title: "Event Consumers", description: "Multiple consumers can react to the same event" },
    { title: "Event Sourcing", description: "Store all changes as a sequence of events" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Simulate events
  useEffect(() => {
    const interval = setInterval(() => {
      setEventCount(c => c + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Event-Driven Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Producer */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <span className="text-2xl">📦</span>
              <span className="text-xs text-white">Producer</span>
            </div>
            <div className="text-xs text-gray-400">Order Created</div>
          </div>

          {/* Event Flow */}
          <div className="flex-1 mx-4">
            <div className="relative">
              <div className="h-1 bg-green-500 rounded animate-pulse" />
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-700 px-2 py-1 rounded text-xs text-green-400">
                Event #{eventCount}
              </div>
            </div>
          </div>

          {/* EventBridge */}
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xs text-white">EventBridge</span>
            </div>
            <div className="text-xs text-gray-400">Event Bus</div>
          </div>

          {/* Fan-out arrows */}
          <div className="flex-1 mx-4">
            <div className="space-y-2">
              <div className="h-1 bg-green-500 rounded" />
              <div className="h-1 bg-green-500 rounded" />
              <div className="h-1 bg-green-500 rounded" />
            </div>
          </div>

          {/* Consumers */}
          <div className="flex flex-col gap-2">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">λ</span>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xs text-white">SQS</span>
            </div>
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-xs text-white">Step Fn</span>
            </div>
          </div>
        </div>

        {/* Event Schema */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Event Schema</div>
          <pre className="text-xs font-mono text-green-400">
{`{
  "source": "orders.service",
  "detail-type": "Order Created",
  "detail": {
    "orderId": "ord-123",
    "customerId": "cust-456",
    "amount": 99.99
  }
}`}
          </pre>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• EventBridge is the preferred event router</li>
          <li>• SNS + SQS fan-out pattern for reliable delivery</li>
          <li>• Events enable loose coupling between services</li>
          <li>• DynamoDB Streams, S3 Events are event sources</li>
        </ul>
      </div>
    </div>
  )
}

// 4. Multi-Tier Architecture Explainer (Medium)
export function MultiTierArchitectureExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Multi-Tier Architecture", description: "Classic 3-tier: presentation, application, data" },
    { title: "Presentation Tier", description: "Web servers, CloudFront, S3 static hosting" },
    { title: "Application Tier", description: "Business logic in EC2, ECS, or Lambda" },
    { title: "Data Tier", description: "RDS, Aurora, DynamoDB, ElastiCache" },
    { title: "High Availability", description: "Distribute across AZs with load balancers" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Multi-Tier Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="space-y-6">
          {/* Presentation Tier */}
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-3">Presentation Tier</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-orange-600 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-white text-xs">CF</span>
                </div>
                <span className="text-xs text-gray-400">CloudFront</span>
              </div>
              <div className="text-gray-500">→</div>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-white text-xs">S3</span>
                </div>
                <span className="text-xs text-gray-400">Static</span>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-white text-xs">ALB</span>
                </div>
                <span className="text-xs text-gray-400">Load Bal</span>
              </div>
            </div>
          </div>

          {/* Application Tier */}
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-3">Application Tier</div>
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-orange-600 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <span className="text-xs text-gray-400">App {i}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">Auto Scaling Group</div>
          </div>

          {/* Data Tier */}
          <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
            <div className="text-purple-400 font-semibold mb-3">Data Tier</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-1">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">RDS</span>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-white text-xs">EC</span>
                </div>
                <span className="text-xs text-gray-400">ElastiCache</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Put stateless app servers behind ALB</li>
          <li>• Use ElastiCache to reduce database load</li>
          <li>• RDS Multi-AZ for database high availability</li>
          <li>• CloudFront + S3 for static content</li>
        </ul>
      </div>
    </div>
  )
}

// 5. Disaster Recovery Patterns Explainer (Rich)
export function DisasterRecoveryPatternsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pattern, setPattern] = useState<"backup" | "pilot" | "warm" | "hot">("warm")

  const steps = [
    { title: "Disaster Recovery", description: "Strategies to recover from regional failures" },
    { title: "Backup & Restore", description: "Cheapest: restore from backups when needed (hours)" },
    { title: "Pilot Light", description: "Core components always running, scale on disaster" },
    { title: "Warm Standby", description: "Scaled-down version running, scale up on disaster" },
    { title: "Multi-Site Active/Active", description: "Full capacity in multiple regions (most expensive)" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const patterns = {
    backup: { name: "Backup & Restore", rto: "Hours", rpo: "Hours", cost: "💵", activeInDR: false },
    pilot: { name: "Pilot Light", rto: "10-30 min", rpo: "Minutes", cost: "💵💵", activeInDR: true },
    warm: { name: "Warm Standby", rto: "Minutes", rpo: "Seconds", cost: "💵💵💵", activeInDR: true },
    hot: { name: "Multi-Site", rto: "Near-zero", rpo: "Near-zero", cost: "💵💵💵💵", activeInDR: true }
  }

  const currentPattern = patterns[pattern]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Disaster Recovery Patterns</h2>
      </div>

      {/* Pattern Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(patterns).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPattern(key as typeof pattern)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              pattern === key ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Primary Region */}
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-3 text-center">Primary Region (Active)</div>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">EC2</span>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">EC2</span>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* DR Region */}
          <div className={`${currentPattern.activeInDR ? "bg-yellow-900/30 border-yellow-500" : "bg-gray-700 border-gray-600"} border rounded-lg p-4`}>
            <div className={`${currentPattern.activeInDR ? "text-yellow-400" : "text-gray-500"} font-semibold mb-3 text-center`}>
              DR Region ({currentPattern.activeInDR ? "Standby" : "Backups Only"})
            </div>
            <div className="flex justify-center gap-2">
              {pattern === "backup" ? (
                <div className="w-16 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">💾 S3</span>
                </div>
              ) : pattern === "pilot" ? (
                <>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center opacity-50">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : pattern === "warm" ? (
                <>
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-white">{currentPattern.rto}</div>
            <div className="text-xs text-gray-400">RTO (Recovery Time)</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-white">{currentPattern.rpo}</div>
            <div className="text-xs text-gray-400">RPO (Data Loss)</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-white">{currentPattern.cost}</div>
            <div className="text-xs text-gray-400">Relative Cost</div>
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• RTO: time to recover. RPO: acceptable data loss</li>
          <li>• Pilot Light: DB replicated, compute on-demand</li>
          <li>• Warm Standby: scaled-down version always running</li>
          <li>• Route 53 health checks trigger failover</li>
        </ul>
      </div>
    </div>
  )
}

// 6. Well-Architected Pillars Explainer (Medium)
export function WellArchitectedPillarsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPillar, setSelectedPillar] = useState(0)

  const steps = [
    { title: "Well-Architected Framework", description: "Best practices for building secure, resilient, efficient cloud architectures" },
    { title: "Operational Excellence", description: "Run and monitor systems, improve processes" },
    { title: "Security", description: "Protect information, systems, and assets" },
    { title: "Reliability", description: "Recover from failures, meet demand" },
    { title: "Performance Efficiency", description: "Use resources efficiently" },
    { title: "Cost Optimization", description: "Avoid unnecessary costs" },
    { title: "Sustainability", description: "Minimize environmental impact" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const pillars = [
    { name: "Operational Excellence", icon: "⚙️", color: "blue", tips: ["Automate", "Document", "Learn from failures"] },
    { name: "Security", icon: "🔐", color: "red", tips: ["Least privilege", "Enable traceability", "Protect data"] },
    { name: "Reliability", icon: "🛡️", color: "green", tips: ["Auto-recover", "Scale horizontally", "Test recovery"] },
    { name: "Performance", icon: "⚡", color: "yellow", tips: ["Right-size", "Monitor", "Use caching"] },
    { name: "Cost Optimization", icon: "💰", color: "purple", tips: ["Pay for use", "Right-size", "Reserved capacity"] },
    { name: "Sustainability", icon: "🌱", color: "teal", tips: ["Efficient code", "Right-size", "Use managed services"] }
  ]

  const currentPillar = pillars[selectedPillar]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Well-Architected Pillars</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* Pillar Icons */}
        <div className="flex justify-center gap-4 mb-6">
          {pillars.map((pillar, i) => (
            <button
              key={i}
              onClick={() => setSelectedPillar(i)}
              className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                selectedPillar === i ? "ring-2 ring-white scale-110" : ""
              }`}
              style={{
                backgroundColor:
                  pillar.color === "blue" ? "#1e40af" :
                  pillar.color === "red" ? "#991b1b" :
                  pillar.color === "green" ? "#166534" :
                  pillar.color === "yellow" ? "#854d0e" :
                  pillar.color === "purple" ? "#7e22ce" :
                  "#0d9488"
              }}
            >
              <span className="text-2xl">{pillar.icon}</span>
            </button>
          ))}
        </div>

        {/* Selected Pillar Details */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <span>{currentPillar.icon}</span>
            {currentPillar.name}
          </div>
          <div className="space-y-2">
            {currentPillar.tips.map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• 6 pillars: OpEx, Security, Reliability, Perf, Cost, Sustainability</li>
          <li>• Use Well-Architected Tool for reviews</li>
          <li>• Security: IAM, encryption, least privilege</li>
          <li>• Reliability: Multi-AZ, auto-scaling, backups</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const architectureExplainers = {
  "serverless-architecture": ServerlessArchitectureExplainer,
  "microservices-architecture": MicroservicesArchitectureExplainer,
  "event-driven-architecture": EventDrivenArchitectureExplainer,
  "multi-tier-architecture": MultiTierArchitectureExplainer,
  "disaster-recovery-patterns": DisasterRecoveryPatternsExplainer,
  "well-architected-pillars": WellArchitectedPillarsExplainer
}
