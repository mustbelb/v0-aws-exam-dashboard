"use client"

import { useState, useEffect } from "react"
import { useExplainerPlayback } from "@/hooks/use-explainer-playback"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Layers, RefreshCw, Globe, Shield, Zap, Database, Cloud, Server, ArrowRight, GitBranch, CircleAlert, DollarSign, Repeat, Lock, HardDrive, Copy } from "lucide-react"

// 1. Serverless Architecture Explainer (Rich)
export function ServerlessArchitectureExplainer() {


  const [requestCount, setRequestCount] = useState(0)

  const steps = [
    { title: "Serverless Architecture", description: "Build applications without managing servers - pay per execution" },
    { title: "API Gateway + Lambda", description: "Event-driven compute triggered by HTTP requests" },
    { title: "Auto Scaling", description: "Scales automatically from zero to thousands of requests" },
    { title: "Pay Per Use", description: "Only pay for compute time used, no idle costs" },
    { title: "Managed Services", description: "Use DynamoDB, S3, SNS, SQS for a fully serverless stack" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Simulate requests
  useEffect(() => setRequestCount(0), [resetKey])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setRequestCount(c => (c + Math.floor(Math.random() * 5)) % 100)
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Serverless Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
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
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              {/* Client */}
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📱</span>
                </div>
                <span className="text-sm text-gray-400">Client</span>
              </div>

              {/* Arrow */}
              <div className="text-yellow-400 font-bold">→</div>

              {/* API Gateway - Highlighted */}
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-yellow-400 font-bold">API Gateway</span>
              </div>

              {/* Arrow */}
              <div className="text-yellow-400 font-bold">→</div>

              {/* Lambda - Highlighted */}
              <div className="text-center relative">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-4xl">λ</span>
                </div>
                <span className="text-sm text-yellow-400 font-bold">Lambda Function</span>
              </div>

              {/* Arrows to services */}
              <div className="text-gray-500 opacity-50">→</div>

              {/* Backend Services */}
              <div className="flex flex-col gap-2 opacity-50">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">S3</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              HTTP requests trigger Lambda functions via API Gateway
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              {/* Client */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📱</span>
                </div>
                <span className="text-sm text-gray-400">Client</span>
                <div className="text-xs text-yellow-400 mt-1">{requestCount} req/s</div>
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

              {/* Lambda - Multiple Instances */}
              <div className="text-center relative">
                <div className="relative w-32 h-24 mb-2">
                  {[...Array(Math.min(5, Math.max(1, Math.floor(requestCount / 10))))].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-16 h-16 bg-orange-600 rounded-lg flex flex-col items-center justify-center ring-2 ring-yellow-400"
                      style={{
                        left: `${i * 16}px`,
                        top: `${i * 4}px`,
                        zIndex: i,
                      }}
                    >
                      <span className="text-2xl">λ</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-yellow-400 font-bold">Auto-scaled: x{Math.max(1, Math.floor(requestCount / 10))}</span>
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
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Lambda automatically scales from zero to thousands of concurrent executions
            </div>
          </>
        )}

        {step === 3 && (
          <>
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

            {/* Metrics - Highlighted */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center ring-2 ring-yellow-400">
                <div className="text-2xl font-bold text-yellow-400">{requestCount}</div>
                <div className="text-xs text-gray-400">Active Requests</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center ring-2 ring-green-400">
                <div className="text-2xl font-bold text-green-400">$0.00</div>
                <div className="text-xs text-gray-400">Idle Cost</div>
                <div className="text-xs text-green-300 mt-1">Pay only when running!</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center ring-2 ring-blue-400">
                <div className="text-2xl font-bold text-blue-400">∞</div>
                <div className="text-xs text-gray-400">Scale Limit</div>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
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
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2 ring-2 ring-purple-400">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm text-purple-300">API GW</span>
              </div>

              {/* Arrow */}
              <div className="text-gray-500">→</div>

              {/* Lambda */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-2 ring-orange-400">
                  <span className="text-3xl">λ</span>
                </div>
                <span className="text-sm text-orange-300">Lambda</span>
              </div>

              {/* Arrows to services */}
              <div className="text-gray-500">→</div>

              {/* Backend Services - Highlighted */}
              <div className="flex flex-col gap-2">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center ring-2 ring-blue-400">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs text-blue-300 text-center">DynamoDB</div>
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center ring-2 ring-green-400">
                  <span className="text-white text-sm">S3</span>
                </div>
              </div>
            </div>

            {/* Additional Managed Services */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-red-300">SNS</div>
                <div className="text-xs text-gray-400">Pub/Sub</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-yellow-300">SQS</div>
                <div className="text-xs text-gray-400">Queues</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-purple-300">EventBridge</div>
                <div className="text-xs text-gray-400">Events</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-blue-300">Step Functions</div>
                <div className="text-xs text-gray-400">Orchestration</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Fully serverless stack - all managed services, zero server management
            </div>
          </>
        )}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [selectedService, setSelectedService] = useState<string | null>(null)

  const steps = [
    { title: "Microservices", description: "Decompose applications into small, independent services" },
    { title: "Service Independence", description: "Each service can be developed, deployed, and scaled independently" },
    { title: "Communication", description: "Services communicate via APIs (sync) or events (async)" },
    { title: "ECS/EKS Hosting", description: "Run microservices on ECS, EKS, or Lambda" },
    { title: "Service Mesh", description: "Use App Mesh for service-to-service communication" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <>
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
                  className="p-4 rounded-lg"
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
            <div className="text-center text-sm text-blue-300 bg-blue-900/30 p-3 rounded-lg">
              Application decomposed into small, independent services
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border-2 border-blue-400"
                  style={{
                    backgroundColor:
                      service.color === "blue" ? "#1e40af" :
                      service.color === "green" ? "#166534" :
                      service.color === "yellow" ? "#854d0e" :
                      "#7e22ce"
                  }}
                >
                  <div className="text-center mb-3">
                    <span className="text-3xl">{service.icon}</span>
                    <div className="text-white font-bold mt-2">{service.name}</div>
                  </div>
                  <div className="text-xs text-gray-200 space-y-1">
                    <div>✓ Own database</div>
                    <div>✓ Independent deployment</div>
                    <div>✓ Scales independently</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-blue-300 bg-blue-900/30 p-3 rounded-lg">
              Each service is fully autonomous with its own data and lifecycle
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Service Communication */}
            <div className="mb-6">
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="p-4 rounded-lg bg-blue-700">
                  <span className="text-2xl">👤</span>
                  <div className="text-white text-xs mt-1">User Service</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-green-400 font-bold">→ REST/gRPC →</div>
                  <div className="text-orange-400 font-bold">← Events ←</div>
                </div>
                <div className="p-4 rounded-lg bg-green-700">
                  <span className="text-2xl">📦</span>
                  <div className="text-white text-xs mt-1">Order Service</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-300 mb-3">Communication Patterns</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-600 rounded-lg p-3 ring-2 ring-green-400">
                  <div className="text-green-400 text-sm font-semibold">Synchronous</div>
                  <div className="text-xs text-gray-400 mt-1">REST/gRPC via ALB</div>
                  <div className="text-xs text-green-300 mt-1">Direct request/response</div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3 ring-2 ring-orange-400">
                  <div className="text-orange-400 text-sm font-semibold">Asynchronous</div>
                  <div className="text-xs text-gray-400 mt-1">Events via SQS/SNS/EventBridge</div>
                  <div className="text-xs text-orange-300 mt-1">Decoupled messaging</div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-4">
              <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-4 mb-4">
                <div className="text-center text-purple-300 font-bold mb-2">ECS / EKS / Fargate</div>
                <div className="text-xs text-gray-300 text-center">Container Orchestration Layer</div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {services.map((service, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="p-3 rounded-lg border-2 border-yellow-400 mb-2"
                      style={{
                        backgroundColor:
                          service.color === "blue" ? "#1e40af" :
                          service.color === "green" ? "#166534" :
                          service.color === "yellow" ? "#854d0e" :
                          "#7e22ce"
                      }}
                    >
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <div className="text-xs text-gray-400">Container</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-blue-300 bg-blue-900/30 p-3 rounded-lg">
              ECS Fargate or EKS for serverless container hosting
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="mb-4">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-400 rounded-lg p-4 mb-4">
                <div className="text-center text-purple-300 font-bold mb-2">AWS App Mesh</div>
                <div className="text-xs text-gray-300 text-center">Service Mesh - Traffic Management & Observability</div>
              </div>

              <div className="relative">
                {/* Services with mesh connections */}
                <div className="grid grid-cols-2 gap-6">
                  {services.map((service, i) => (
                    <div key={i} className="relative">
                      <div
                        className="p-4 rounded-lg border-2 border-purple-400"
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
                          <div className="text-xs text-purple-300 mt-1">+ Envoy Proxy</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-purple-900/30 border border-purple-500 rounded p-2 text-center">
                <div className="text-xs text-purple-300">Traffic Control</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded p-2 text-center">
                <div className="text-xs text-purple-300">Observability</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded p-2 text-center">
                <div className="text-xs text-purple-300">Security</div>
              </div>
            </div>
          </>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [eventCount, setEventCount] = useState(0)

  const steps = [
    { title: "Event-Driven Architecture", description: "Loosely coupled systems that communicate through events" },
    { title: "Event Producers", description: "Services emit events when state changes" },
    { title: "Event Router", description: "EventBridge or SNS routes events to consumers" },
    { title: "Event Consumers", description: "Multiple consumers can react to the same event" },
    { title: "Event Sourcing", description: "Store all changes as a sequence of events" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Simulate events
  useEffect(() => setEventCount(0), [resetKey])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setEventCount(c => c + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Event-Driven Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              {/* Producer */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-2xl">📦</span>
                  <span className="text-xs text-white">Producer</span>
                </div>
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
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Loosely coupled systems communicate through asynchronous events
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Producer - Highlighted */}
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-green-400">
                  <span className="text-4xl">📦</span>
                  <span className="text-sm text-white font-bold mt-2">Event Producer</span>
                </div>
                <div className="text-xs text-green-400 font-bold mt-2">Emits events on state change</div>
              </div>

              <div className="text-green-400 text-2xl">→</div>

              <div className="flex-1 max-w-sm">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Event Published</div>
                  <pre className="text-xs font-mono text-green-400">
{`{
  "source": "orders.service",
  "detail-type": "Order Created",
  "detail": {
    "orderId": "ord-123"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Producers emit events when business state changes occur
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-50">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-2xl">📦</span>
                </div>
              </div>

              <div className="text-green-400 text-2xl">→</div>

              {/* EventBridge - Highlighted */}
              <div className="text-center">
                <div className="w-40 h-40 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-green-400">
                  <span className="text-5xl">⚡</span>
                  <span className="text-sm text-white font-bold mt-2">EventBridge</span>
                  <span className="text-xs text-orange-200">Event Router</span>
                </div>
              </div>

              <div className="text-green-400 text-2xl">→</div>

              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">λ</span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-orange-300 font-bold text-sm">Event Filtering</div>
                <div className="text-xs text-gray-400 mt-1">Route based on content</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-orange-300 font-bold text-sm">Fan-out</div>
                <div className="text-xs text-gray-400 mt-1">Multiple targets per event</div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>

              <div className="text-gray-500">→</div>

              <div className="text-center opacity-50">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>

              {/* Fan-out arrows */}
              <div className="flex-1 mx-4">
                <div className="space-y-2">
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                </div>
              </div>

              {/* Consumers - Highlighted */}
              <div className="flex flex-col gap-3">
                <div className="w-20 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center ring-2 ring-green-400">
                  <span className="text-2xl">λ</span>
                  <span className="text-xs text-white">Lambda</span>
                </div>
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex flex-col items-center justify-center ring-2 ring-green-400">
                  <span className="text-xs text-white">SQS</span>
                  <span className="text-xs text-white">Queue</span>
                </div>
                <div className="w-20 h-20 bg-green-600 rounded-lg flex flex-col items-center justify-center ring-2 ring-green-400">
                  <span className="text-xs text-white">Step Fn</span>
                  <span className="text-xs text-white">Workflow</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Multiple independent consumers can react to the same event
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="mb-4">
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-400 rounded-lg p-4 mb-4">
                <div className="text-center text-purple-300 font-bold mb-2">Event Sourcing</div>
                <div className="text-xs text-gray-300 text-center">Store all state changes as immutable events</div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-green-600 rounded px-2 py-1 text-xs text-white">Event 1</div>
                  <div className="text-xs text-gray-300">Order Created</div>
                  <div className="ml-auto text-xs text-gray-400">t=0</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-green-600 rounded px-2 py-1 text-xs text-white">Event 2</div>
                  <div className="text-xs text-gray-300">Payment Processed</div>
                  <div className="ml-auto text-xs text-gray-400">t=1</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-green-600 rounded px-2 py-1 text-xs text-white">Event 3</div>
                  <div className="text-xs text-gray-300">Order Shipped</div>
                  <div className="ml-auto text-xs text-gray-400">t=2</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-green-600 rounded px-2 py-1 text-xs text-white">Event 4</div>
                  <div className="text-xs text-gray-300">Order Delivered</div>
                  <div className="ml-auto text-xs text-gray-400">t=3</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-900/30 border border-purple-500 rounded p-3 text-center">
                <div className="text-xs text-purple-300">Full audit trail</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded p-3 text-center">
                <div className="text-xs text-purple-300">Time travel debugging</div>
              </div>
            </div>
          </>
        )}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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



  const steps = [
    { title: "Multi-Tier Architecture", description: "Classic 3-tier: presentation, application, data" },
    { title: "Presentation Tier", description: "Web servers, CloudFront, S3 static hosting" },
    { title: "Application Tier", description: "Business logic in EC2, ECS, or Lambda" },
    { title: "Data Tier", description: "RDS, Aurora, DynamoDB, ElastiCache" },
    { title: "High Availability", description: "Distribute across AZs with load balancers" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Multi-Tier Architecture</h2>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
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
        )}

        {step === 1 && (
          <>
            {/* Presentation Tier - Highlighted */}
            <div className="bg-blue-900/50 border-2 border-blue-400 rounded-lg p-6 mb-4">
              <div className="text-blue-300 font-bold text-lg mb-4 text-center">Presentation Tier</div>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-blue-400">
                    <span className="text-white text-xl font-bold">CF</span>
                  </div>
                  <span className="text-sm text-blue-300 font-bold">CloudFront</span>
                  <div className="text-xs text-gray-400 mt-1">CDN + Edge Locations</div>
                </div>
                <div className="text-blue-400 text-2xl">+</div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-blue-400">
                    <span className="text-white text-lg font-bold">S3</span>
                  </div>
                  <span className="text-sm text-blue-300 font-bold">Static Assets</span>
                  <div className="text-xs text-gray-400 mt-1">HTML, CSS, JS, Images</div>
                </div>
                <div className="text-blue-400 text-2xl">+</div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-blue-400">
                    <span className="text-white text-lg font-bold">ALB</span>
                  </div>
                  <span className="text-sm text-blue-300 font-bold">Load Balancer</span>
                  <div className="text-xs text-gray-400 mt-1">Distributes traffic</div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-blue-300 bg-blue-900/30 p-3 rounded-lg">
              Frontend layer serving users - static content and load balancing
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Application Tier - Highlighted */}
            <div className="bg-green-900/50 border-2 border-green-400 rounded-lg p-6 mb-4">
              <div className="text-green-300 font-bold text-lg mb-4 text-center">Application Tier</div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-center">
                      <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-1 ring-2 ring-green-400">
                        <span className="text-white font-bold">EC2</span>
                      </div>
                      <span className="text-xs text-green-300">Instance {i}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-green-800 rounded-lg p-3 text-center">
                  <div className="text-green-300 font-bold text-sm">Auto Scaling Group</div>
                  <div className="text-xs text-gray-400 mt-1">Scales based on demand</div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Business logic layer - stateless app servers that scale horizontally
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Data Tier - Highlighted */}
            <div className="bg-purple-900/50 border-2 border-purple-400 rounded-lg p-6 mb-4">
              <div className="text-purple-300 font-bold text-lg mb-4 text-center">Data Tier</div>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-28 h-28 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-purple-400">
                    <Database className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm text-purple-300 font-bold">RDS / Aurora</span>
                  <div className="text-xs text-gray-400 mt-1">Relational Database</div>
                  <div className="text-xs text-blue-300 mt-1">Multi-AZ for HA</div>
                </div>
                <div className="text-center">
                  <div className="w-28 h-28 bg-red-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-purple-400">
                    <span className="text-white text-2xl font-bold">EC</span>
                  </div>
                  <span className="text-sm text-purple-300 font-bold">ElastiCache</span>
                  <div className="text-xs text-gray-400 mt-1">In-Memory Cache</div>
                  <div className="text-xs text-red-300 mt-1">Redis or Memcached</div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-purple-300 bg-purple-900/30 p-3 rounded-lg">
              Persistent data storage layer with caching for performance
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500 rounded-lg p-4">
                <div className="text-red-300 font-bold text-center mb-3">High Availability - Multi-AZ</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 border-2 border-green-500">
                    <div className="text-green-400 font-bold text-sm mb-3 text-center">Availability Zone A</div>
                    <div className="space-y-2">
                      <div className="bg-blue-700 rounded p-2 text-xs text-center text-white">ALB</div>
                      <div className="bg-orange-700 rounded p-2 text-xs text-center text-white">EC2 Instances</div>
                      <div className="bg-blue-600 rounded p-2 text-xs text-center text-white">RDS Primary</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border-2 border-yellow-500">
                    <div className="text-yellow-400 font-bold text-sm mb-3 text-center">Availability Zone B</div>
                    <div className="space-y-2">
                      <div className="bg-blue-700 rounded p-2 text-xs text-center text-white">ALB</div>
                      <div className="bg-orange-700 rounded p-2 text-xs text-center text-white">EC2 Instances</div>
                      <div className="bg-blue-600 rounded p-2 text-xs text-center text-white">RDS Standby</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-red-300 bg-red-900/30 p-3 rounded-lg mt-4">
              Distribute resources across multiple AZs for fault tolerance
            </div>
          </>
        )}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [pattern, setPattern] = useState<"backup" | "pilot" | "warm" | "hot">("warm")

  const steps = [
    { title: "Disaster Recovery", description: "Strategies to recover from regional failures" },
    { title: "Backup & Restore", description: "Cheapest: restore from backups when needed (hours)" },
    { title: "Pilot Light", description: "Core components always running, scale on disaster" },
    { title: "Warm Standby", description: "Scaled-down version running, scale up on disaster" },
    { title: "Multi-Site Active/Active", description: "Full capacity in multiple regions (most expensive)" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Sync pattern with step for animation
  useEffect(() => {
    const stepToPattern: Record<number, "backup" | "pilot" | "warm" | "hot"> = {
      0: "warm",
      1: "backup",
      2: "pilot",
      3: "warm",
      4: "hot"
    }
    if (stepToPattern[step]) {
      setPattern(stepToPattern[step])
    }
  }, [step])

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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Sync pillar with step for animation
  useEffect(() => {
    if (step > 0 && step <= 6) {
      setSelectedPillar(step - 1)
    }
  }, [step])

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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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

// 7. Blue-Green Deployment Explainer
export function BlueGreenDeploymentExplainer() {


  const [activeEnv, setActiveEnv] = useState<"blue" | "green">("blue")

  const steps = [
    { title: "Blue-Green Deployment", description: "Zero-downtime deployments by maintaining two identical environments" },
    { title: "Blue Environment", description: "Current production running stable version" },
    { title: "Green Environment", description: "Deploy new version to green, test thoroughly" },
    { title: "Switch Traffic", description: "Route 53 or ALB switches traffic instantly" },
    { title: "Rollback", description: "If issues, switch back to blue immediately" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Sync environment with step for animation
  useEffect(() => {
    if (step === 0 || step === 1) {
      setActiveEnv("blue")
    } else if (step === 2) {
      setActiveEnv("green")
    } else if (step === 3) {
      setActiveEnv("green")
    } else if (step === 4) {
      setActiveEnv("blue")
    }
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Blue-Green Deployment</h2>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveEnv(activeEnv === "blue" ? "green" : "blue")}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium"
        >
          Switch to {activeEnv === "blue" ? "Green" : "Blue"}
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-sm text-gray-400">Users</span>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm text-gray-400">Route 53</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-lg border-2 transition-all ${
              activeEnv === "blue" ? "border-blue-500 bg-blue-900/30" : "border-gray-600 bg-gray-700 opacity-50"
            }`}>
              <div className="text-blue-400 font-semibold mb-2">Blue (v1.0)</div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all ${
              activeEnv === "green" ? "border-green-500 bg-green-900/30" : "border-gray-600 bg-gray-700 opacity-50"
            }`}>
              <div className="text-green-400 font-semibold mb-2">Green (v2.0)</div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gray-700 rounded-lg p-4 text-center">
          <span className={`text-lg font-semibold ${activeEnv === "blue" ? "text-blue-400" : "text-green-400"}`}>
            Traffic → {activeEnv.charAt(0).toUpperCase() + activeEnv.slice(1)} Environment
          </span>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Zero downtime with instant rollback capability</li>
          <li>• Requires 2x infrastructure during deployment</li>
          <li>• Use Route 53 weighted or ALB for traffic switching</li>
          <li>• Elastic Beanstalk supports blue-green natively</li>
        </ul>
      </div>
    </div>
  )
}

// 8. Canary Deployment Explainer
export function CanaryDeploymentExplainer() {


  const [canaryPercent, setCanaryPercent] = useState(10)

  const steps = [
    { title: "Canary Deployment", description: "Gradually roll out changes to a small subset of users first" },
    { title: "Initial Canary", description: "Route 5-10% of traffic to new version" },
    { title: "Monitor Metrics", description: "Watch error rates, latency, and business metrics" },
    { title: "Gradual Rollout", description: "Increase traffic to 25%, 50%, 100% if healthy" },
    { title: "Rollback", description: "Route back to 100% old version if issues detected" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Sync canary percentage with step for animation
  useEffect(() => {
    const stepToPercent: Record<number, number> = {
      0: 0,
      1: 10,
      2: 10,
      3: 50,
      4: 0
    }
    if (stepToPercent[step] !== undefined) {
      setCanaryPercent(stepToPercent[step])
    }
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Canary Deployment</h2>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Canary Traffic: {canaryPercent}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={canaryPercent}
          onChange={(e) => setCanaryPercent(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 bg-blue-600 rounded-l-lg p-4 text-center" style={{ width: `${100 - canaryPercent}%` }}>
            <div className="text-white font-semibold">v1.0 (Stable)</div>
            <div className="text-blue-200 text-sm">{100 - canaryPercent}% traffic</div>
          </div>
          {canaryPercent > 0 && (
            <div className="bg-yellow-600 rounded-r-lg p-4 text-center" style={{ width: `${canaryPercent}%`, minWidth: "80px" }}>
              <div className="text-white font-semibold">v2.0</div>
              <div className="text-yellow-200 text-sm">{canaryPercent}%</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">Stable (v1.0)</div>
            <div className="flex gap-1 flex-wrap">
              {Array(Math.round((100 - canaryPercent) / 10)).fill(0).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Server className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-400 mb-2">Canary (v2.0)</div>
            <div className="flex gap-1 flex-wrap">
              {Array(Math.round(canaryPercent / 10)).fill(0).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
                  <Server className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Lower risk than blue-green (gradual rollout)</li>
          <li>• CodeDeploy supports canary with Lambda & ECS</li>
          <li>• API Gateway canary releases for API testing</li>
          <li>• CloudWatch alarms can trigger automatic rollback</li>
        </ul>
      </div>
    </div>
  )
}

// 9. Fan-Out Pattern Explainer
export function FanOutPatternExplainer() {


  const [messageCount, setMessageCount] = useState(0)

  const steps = [
    { title: "Fan-Out Pattern", description: "Distribute a single message to multiple consumers" },
    { title: "SNS Topic", description: "Publisher sends one message to SNS topic" },
    { title: "Multiple Subscribers", description: "SNS fans out to SQS queues, Lambda, HTTP endpoints" },
    { title: "Parallel Processing", description: "Each subscriber processes independently" },
    { title: "Decoupling", description: "Publisher doesn't know about subscribers" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => setMessageCount(0), [resetKey])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setMessageCount(c => c + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Copy className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Fan-Out Pattern (SNS + SQS)</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-xs font-bold">Producer</span>
              </div>
              <div className="text-xs text-gray-400">1 message</div>
            </div>

            <div className="flex-1 mx-4 relative">
              <div className="h-1 bg-orange-500 rounded" />
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
                <span className="text-2xl">📢</span>
                <span className="text-white text-xs">SNS</span>
              </div>
            </div>

            <div className="flex-1 mx-4">
              <div className="space-y-3">
                <div className="h-1 bg-green-500 rounded" />
                <div className="h-1 bg-green-500 rounded" />
                <div className="h-1 bg-green-500 rounded" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-16 h-14 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">SQS</span>
              </div>
              <div className="w-16 h-14 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">λ</span>
              </div>
              <div className="w-16 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">HTTP</span>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-white text-sm font-bold">Producer</span>
                </div>
                <div className="text-sm text-yellow-400 font-bold">Sends 1 message</div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-yellow-400 rounded animate-pulse" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-yellow-400 font-bold">
                  Message #{messageCount}
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-3xl">📢</span>
                  <span className="text-white text-sm font-bold">SNS Topic</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="space-y-3">
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-30">
                <div className="w-16 h-14 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">SQS</span>
                </div>
                <div className="w-16 h-14 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">λ</span>
                </div>
                <div className="w-16 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">HTTP</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Publisher sends a single message to SNS Topic
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-orange-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-2xl">📢</span>
                  <span className="text-white text-xs">SNS</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="space-y-3">
                  <div className="h-2 bg-yellow-400 rounded animate-pulse" />
                  <div className="h-2 bg-yellow-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 bg-yellow-400 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-18 h-16 bg-purple-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                  <span className="text-white text-sm font-bold">SQS</span>
                </div>
                <div className="w-18 h-16 bg-yellow-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                  <span className="text-2xl">λ</span>
                </div>
                <div className="w-18 h-16 bg-blue-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                  <span className="text-white text-sm font-bold">HTTP</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              SNS fans out to multiple subscribers: SQS queues, Lambda functions, HTTP endpoints
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-orange-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-2xl">📢</span>
                  <span className="text-white text-xs">SNS</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="space-y-3">
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-20 h-16 bg-purple-600 rounded-lg flex items-center justify-center ring-4 ring-green-400 relative">
                  <span className="text-white text-sm font-bold">SQS</span>
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-green-400 text-xs font-bold">Processing...</div>
                </div>
                <div className="w-20 h-16 bg-yellow-600 rounded-lg flex items-center justify-center ring-4 ring-green-400 relative">
                  <span className="text-2xl">λ</span>
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-green-400 text-xs font-bold">Processing...</div>
                </div>
                <div className="w-20 h-16 bg-blue-600 rounded-lg flex items-center justify-center ring-4 ring-green-400 relative">
                  <span className="text-white text-sm font-bold">HTTP</span>
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-green-400 text-xs font-bold">Processing...</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              All subscribers process the message independently and in parallel
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
                <div className="text-xs text-green-400 font-bold">Doesn't know subscribers</div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-1 bg-orange-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-green-400">
                  <span className="text-2xl">📢</span>
                  <span className="text-white text-xs">SNS</span>
                </div>
                <div className="text-xs text-green-400 font-bold">Decoupling Layer</div>
              </div>

              <div className="flex-1 mx-4">
                <div className="space-y-3">
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                  <div className="h-1 bg-green-500 rounded" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-16 h-14 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">SQS</span>
                </div>
                <div className="w-16 h-14 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">λ</span>
                </div>
                <div className="w-16 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">HTTP</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-300 mb-2">Benefits</div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-green-400 font-semibold">Decoupled</div>
                  <div className="text-gray-400">Producers & consumers independent</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">Reliable</div>
                  <div className="text-gray-400">SQS ensures delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">Scalable</div>
                  <div className="text-gray-400">Add subscribers anytime</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• SNS + SQS = reliable fan-out with buffering</li>
          <li>• Each SQS queue processes independently</li>
          <li>• Use for order processing, notifications, analytics</li>
          <li>• SNS message filtering reduces unnecessary processing</li>
        </ul>
      </div>
    </div>
  )
}

// 10. Static Website Hosting Explainer
export function StaticWebsiteHostingExplainer() {



  const steps = [
    { title: "Static Website Hosting", description: "Host static websites on S3 with CloudFront CDN" },
    { title: "S3 Bucket", description: "Store HTML, CSS, JS, images in S3 bucket" },
    { title: "CloudFront", description: "Global CDN for low latency delivery" },
    { title: "Route 53", description: "Custom domain with SSL certificate" },
    { title: "Origin Access Control", description: "Secure S3 so only CloudFront can access" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Static Website Hosting</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">👤</span>
              </div>
              <span className="text-xs text-gray-400">User</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-500" />

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs text-gray-400">Route 53</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-500" />

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2 relative">
                <Cloud className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>
              <span className="text-xs text-gray-400">CloudFront</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-500" />

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🪣</span>
              </div>
              <span className="text-xs text-gray-400">S3 (Private)</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500 opacity-30" />

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Route 53</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500 opacity-30" />

              <div className="text-center opacity-30">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <span className="text-xs text-gray-400">CloudFront</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500 opacity-30" />

              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-3xl">🪣</span>
                </div>
                <span className="text-sm text-yellow-400 font-bold">S3 Bucket</span>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-green-400 mb-2">S3 Bucket Contents</div>
              <div className="space-y-1 text-xs text-gray-300">
                <div>📄 index.html</div>
                <div>📁 css/styles.css</div>
                <div>📁 js/app.js</div>
                <div>🖼️ images/logo.png</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Store all static assets (HTML, CSS, JS, images) in an S3 bucket
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500 opacity-30" />

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Route 53</span>
              </div>

              <ArrowRight className="w-6 h-6 text-yellow-400" />

              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2 relative ring-4 ring-yellow-400">
                  <Cloud className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-sm text-yellow-400 font-bold">CloudFront CDN</span>
              </div>

              <ArrowRight className="w-6 h-6 text-yellow-400" />

              <div className="text-center">
                <div className="w-18 h-18 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                </div>
                <span className="text-xs text-gray-400">S3</span>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-orange-400 mb-2">CloudFront Config</div>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Origin: S3 with OAC</div>
                <div>HTTPS: ACM Certificate</div>
                <div>Cache: Optimized</div>
                <div>Error Pages: Custom 404</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              CloudFront CDN provides global low-latency delivery with edge caching
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>

              <ArrowRight className="w-6 h-6 text-yellow-400 animate-pulse" />

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-yellow-400 font-bold">Route 53 DNS</span>
              </div>

              <ArrowRight className="w-6 h-6 text-yellow-400" />

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2 relative">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <span className="text-xs text-gray-400">CloudFront</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500" />

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                </div>
                <span className="text-xs text-gray-400">S3</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Route 53 provides custom domain (e.g., www.example.com) with SSL certificate from ACM
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500 opacity-30" />

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Route 53</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-500 opacity-30" />

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2 relative ring-4 ring-green-400">
                  <Cloud className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-yellow-400">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-sm text-green-400 font-bold">CloudFront + OAC</span>
              </div>

              <ArrowRight className="w-6 h-6 text-green-400" />

              <div className="text-center">
                <div className="w-18 h-18 bg-green-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-green-400 relative">
                  <span className="text-2xl">🪣</span>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span className="text-sm text-green-400 font-bold">S3 (Private)</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Origin Access Control (OAC) ensures S3 bucket is private - only CloudFront can access it
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-xs font-semibold text-green-400 mb-2">Security Benefits</div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>✓ S3 bucket stays private</div>
                  <div>✓ No public access needed</div>
                  <div>✓ CloudFront-only access</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-xs font-semibold text-orange-400 mb-2">OAC vs OAI</div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>✓ OAC is newer standard</div>
                  <div>✓ Better security</div>
                  <div>✓ Use OAC, not OAI</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Use OAC (not OAI) to secure S3 origin</li>
          <li>• ACM certificate must be in us-east-1 for CloudFront</li>
          <li>• Configure custom error pages (403→index.html for SPA)</li>
          <li>• Enable versioning and lifecycle policies on S3</li>
        </ul>
      </div>
    </div>
  )
}

// 11. Cache-Aside Pattern Explainer
export function CacheAsidePatternExplainer() {


  const [cacheHit, setCacheHit] = useState(true)

  const steps = [
    { title: "Cache-Aside Pattern", description: "Application manages cache population (lazy loading)" },
    { title: "Cache Hit", description: "Data found in cache, return immediately" },
    { title: "Cache Miss", description: "Data not in cache, fetch from database" },
    { title: "Populate Cache", description: "Store fetched data in cache for future requests" },
    { title: "TTL Expiration", description: "Cache entries expire, ensuring data freshness" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Cache-Aside Pattern</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">App</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-green-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <Zap className="w-8 h-8 text-white" />
                  <span className="text-white text-xs">ElastiCache</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">RDS</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-400 mb-2">Cache Hit Flow</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>1. App checks ElastiCache</div>
                  <div>2. Data found → return</div>
                  <div className="text-green-400">Latency: ~1ms</div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-400 mb-2">Cache Miss Flow</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>1. App checks ElastiCache</div>
                  <div>2. Miss → query RDS</div>
                  <div>3. Store result in cache</div>
                  <div className="text-yellow-400">Latency: ~50-100ms</div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-white text-sm font-bold">App</span>
                </div>
                <span className="text-xs text-yellow-400 font-bold">Request Data</span>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="text-center text-xs text-yellow-400 mb-1 font-bold">1. Check cache</div>
                <div className="h-2 bg-yellow-400 rounded animate-pulse" />
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <Zap className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-bold">ElastiCache</span>
                </div>
                <span className="text-sm text-green-400 font-bold">HIT! ✓</span>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">RDS</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Cache Hit: Data found in ElastiCache, return immediately (~1ms latency)
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-white text-sm font-bold">App</span>
                </div>
                <span className="text-xs text-yellow-400 font-bold">Request Data</span>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="text-center text-xs text-yellow-400 mb-1 font-bold">1. Check cache</div>
                <div className="h-2 bg-yellow-400 rounded" />
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-red-400">
                  <Zap className="w-10 h-10 text-white" />
                  <span className="text-white text-sm">ElastiCache</span>
                </div>
                <span className="text-sm text-red-400 font-bold">MISS ✗</span>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="text-center text-xs text-yellow-400 mb-1 font-bold">2. Fetch from DB</div>
                <div className="h-2 bg-yellow-400 rounded animate-pulse" />
              </div>

              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-yellow-400 font-bold">RDS Query</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Cache Miss: Data not in cache, application queries RDS database
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-green-400">
                  <span className="text-white text-sm font-bold">App</span>
                </div>
                <span className="text-xs text-green-400 font-bold">Populate Cache</span>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="text-center text-xs text-green-400 mb-1 font-bold">3. Store in cache</div>
                <div className="h-2 bg-green-400 rounded animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-green-400 text-xl">←</div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-green-400">
                  <Zap className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-bold">ElastiCache</span>
                </div>
                <span className="text-sm text-green-400 font-bold">Writing...</span>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">RDS</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Application stores the fetched data in cache for future requests
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">App</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-orange-400 relative">
                  <Zap className="w-10 h-10 text-white" />
                  <span className="text-white text-sm">ElastiCache</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">TTL</span>
                  </div>
                </div>
                <span className="text-sm text-orange-400 font-bold">Expiring...</span>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">RDS</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-orange-300 bg-orange-900/30 p-3 rounded-lg">
              TTL (Time To Live) ensures cached data expires, maintaining data freshness
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-300 mb-2">TTL Best Practices</div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Short TTL (seconds): Frequently changing data</div>
                <div>• Medium TTL (minutes): Semi-static data</div>
                <div>• Long TTL (hours): Rarely changing data</div>
                <div>• Balance: freshness vs cache hit rate</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Cache-aside = lazy loading (app manages cache)</li>
          <li>• ElastiCache Redis or Memcached</li>
          <li>• Set appropriate TTL to balance freshness vs hit rate</li>
          <li>• Consider write-through for write-heavy workloads</li>
        </ul>
      </div>
    </div>
  )
}

// 12. Read Replica Pattern Explainer
export function ReadReplicaPatternExplainer() {



  const steps = [
    { title: "Read Replica Pattern", description: "Scale read operations with asynchronous replicas" },
    { title: "Primary Instance", description: "Handles all write operations" },
    { title: "Read Replicas", description: "Handle read traffic, reduce primary load" },
    { title: "Async Replication", description: "Data replicated asynchronously (slight lag)" },
    { title: "Cross-Region", description: "Replicas can be in different regions for DR" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Read Replica Pattern</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">App</span>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="text-xs text-green-400 w-16">Writes</div>
                  <ArrowRight className="w-6 h-6 text-green-500" />
                  <div className="p-4 bg-green-900/30 border-2 border-green-500 rounded-lg">
                    <div className="text-green-400 font-semibold mb-2">Primary</div>
                    <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs text-blue-400 w-16">Reads</div>
                  <ArrowRight className="w-6 h-6 text-blue-500" />
                  <div className="p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
                    <div className="text-blue-400 font-semibold mb-2">Read Replicas</div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-green-400 font-semibold">Up to 15</div>
                  <div className="text-xs text-gray-400">Aurora replicas</div>
                </div>
                <div>
                  <div className="text-blue-400 font-semibold">Up to 5</div>
                  <div className="text-xs text-gray-400">RDS replicas</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold">Cross-Region</div>
                  <div className="text-xs text-gray-400">DR support</div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">App</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-yellow-400 font-bold w-16">Writes</div>
                <ArrowRight className="w-8 h-8 text-yellow-400 animate-pulse" />
                <div className="p-6 bg-green-900/30 border-4 border-yellow-400 rounded-lg">
                  <div className="text-yellow-400 font-bold mb-2 text-lg">Primary Instance</div>
                  <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                    <Database className="w-12 h-12 text-white" />
                  </div>
                  <div className="mt-2 text-xs text-green-300">Handles ALL writes</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              The primary instance is the only database that accepts write operations
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">App</span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 opacity-30">
                  <div className="text-xs text-green-400 w-16">Writes</div>
                  <ArrowRight className="w-6 h-6 text-green-500" />
                  <div className="p-3 bg-green-900/30 border-2 border-green-500 rounded-lg">
                    <div className="text-green-400 font-semibold mb-1">Primary</div>
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-yellow-400 font-bold w-16">Reads</div>
                  <ArrowRight className="w-8 h-8 text-yellow-400 animate-pulse" />
                  <div className="p-6 bg-blue-900/30 border-4 border-yellow-400 rounded-lg">
                    <div className="text-yellow-400 font-bold mb-2 text-lg">Read Replicas</div>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-blue-300">Handle read traffic</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Read replicas handle read traffic, reducing load on the primary instance
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="p-4 bg-green-900/30 border-2 border-green-500 rounded-lg">
                <div className="text-green-400 font-semibold mb-2">Primary</div>
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="mt-2 text-xs text-green-300">Write operations</div>
              </div>

              <div className="flex-1 mx-6 relative">
                <div className="h-2 bg-yellow-400 rounded animate-pulse" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-yellow-400 font-bold">
                  Async Replication
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-orange-400">
                  Slight replication lag
                </div>
              </div>

              <div className="p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">Replicas</div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-300">Read operations</div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Data is replicated asynchronously - replicas may have slight lag (eventual consistency)
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
                <div className="text-blue-400 font-semibold mb-3 text-center">Region: us-east-1</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center ring-2 ring-green-400">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs text-green-400 font-bold">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">Replica 1</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-900/30 border-2 border-purple-500 rounded-lg ring-4 ring-yellow-400">
                <div className="text-purple-400 font-semibold mb-3 text-center">Region: eu-west-1</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center ring-2 ring-yellow-400">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-yellow-400 font-bold">Cross-Region Replica</span>
                  </div>
                  <div className="text-xs text-purple-300">• Disaster Recovery</div>
                  <div className="text-xs text-purple-300">• Low latency reads</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Cross-region read replicas provide disaster recovery and low-latency reads globally
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-green-400 font-semibold">Up to 15</div>
                  <div className="text-xs text-gray-400">Aurora replicas</div>
                </div>
                <div>
                  <div className="text-blue-400 font-semibold">Up to 5</div>
                  <div className="text-xs text-gray-400">RDS replicas</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold">Cross-Region</div>
                  <div className="text-xs text-gray-400">DR support</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Aurora: up to 15 replicas, RDS: up to 5</li>
          <li>• Async replication = eventual consistency</li>
          <li>• Replicas can be promoted to primary for DR</li>
          <li>• Use connection pooling (RDS Proxy) for scaling</li>
        </ul>
      </div>
    </div>
  )
}

// 13. Decoupled Architecture Explainer
export function DecoupledArchitectureExplainer() {


  const [queueDepth, setQueueDepth] = useState(5)

  const steps = [
    { title: "Decoupled Architecture", description: "Loosely coupled components communicate via queues" },
    { title: "Producer", description: "Sends messages to queue, doesn't wait for processing" },
    { title: "SQS Queue", description: "Buffers messages, handles traffic spikes" },
    { title: "Consumer", description: "Processes messages at its own pace" },
    { title: "Scaling", description: "Scale consumers independently based on queue depth" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Repeat className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Decoupled Architecture</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
                <div className="text-xs text-gray-400">API / Lambda</div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-purple-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-24 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-xl">📬</span>
                  <span className="text-white text-xs">SQS</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-green-500 rounded" />
              </div>

              <div className="text-center">
                <div className="flex gap-1">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">λ</span>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">λ</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">Consumers</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-semibold text-sm">Async</div>
                <div className="text-xs text-gray-400">Non-blocking</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 text-center">
                <div className="text-purple-400 font-semibold text-sm">Buffered</div>
                <div className="text-xs text-gray-400">Handle spikes</div>
              </div>
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 text-center">
                <div className="text-green-400 font-semibold text-sm">Resilient</div>
                <div className="text-xs text-gray-400">Retry on failure</div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-white text-sm font-bold">Producer</span>
                </div>
                <div className="text-sm text-yellow-400 font-bold">Sends messages</div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-yellow-400 rounded animate-pulse" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400">
                  Async send
                </div>
              </div>

              <div className="text-center opacity-30">
                <div className="w-24 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-xl">📬</span>
                  <span className="text-white text-xs">SQS</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-green-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">λ</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Producer sends messages asynchronously - doesn't wait for processing
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-purple-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-32 h-28 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2 ring-4 ring-yellow-400">
                  <span className="text-3xl">📬</span>
                  <span className="text-white text-sm font-bold">SQS Queue</span>
                  <span className="text-yellow-300 text-sm font-bold">Buffer</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-green-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">λ</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              SQS queue buffers messages, handling traffic spikes smoothly
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Retention: 1 min to 14 days</div>
                <div>• Handles bursts and spikes</div>
                <div>• Decouples producer from consumer</div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-purple-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-24 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-xl">📬</span>
                  <span className="text-white text-xs">SQS</span>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-yellow-400 rounded animate-pulse" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400">
                  Poll messages
                </div>
              </div>

              <div className="text-center">
                <div className="w-18 h-18 bg-green-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                  <span className="text-2xl">λ</span>
                </div>
                <div className="text-sm text-yellow-400 font-bold mt-2">Consumer</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Consumers process messages at their own pace, independent of producer
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Queue Depth: {queueDepth} messages
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={queueDepth}
                onChange={(e) => setQueueDepth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Producer</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-1 bg-purple-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-24 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-xl">📬</span>
                  <span className="text-white text-xs">SQS</span>
                  <span className="text-purple-200 text-xs">{queueDepth} msgs</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-green-500 rounded" />
              </div>

              <div className="text-center">
                <div className="flex gap-1">
                  {Array(Math.max(1, Math.min(5, Math.ceil(queueDepth / 4)))).fill(0).map((_, i) => (
                    <div key={i} className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center ring-2 ring-yellow-400">
                      <span className="text-xl">λ</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-yellow-400 font-bold mt-2">Auto-Scaled ({Math.max(1, Math.min(5, Math.ceil(queueDepth / 4)))})</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Scale consumers independently based on queue depth - try adjusting the slider!
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• SQS decouples producers from consumers</li>
          <li>• Dead-letter queue for failed messages</li>
          <li>• Lambda scales based on queue depth</li>
          <li>• Visibility timeout prevents duplicate processing</li>
        </ul>
      </div>
    </div>
  )
}

// 14. Global Architecture Explainer
export function GlobalArchitectureExplainer() {



  const steps = [
    { title: "Global Architecture", description: "Serve users worldwide with low latency" },
    { title: "Multi-Region", description: "Deploy application in multiple AWS regions" },
    { title: "Global Accelerator", description: "Use AWS backbone network for faster routing" },
    { title: "Data Replication", description: "DynamoDB Global Tables, Aurora Global DB" },
    { title: "DNS Routing", description: "Route 53 latency or geolocation routing" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Global Architecture</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { region: "us-east-1", label: "N. Virginia", users: "🇺🇸" },
                { region: "eu-west-1", label: "Ireland", users: "🇪🇺" },
                { region: "ap-northeast-1", label: "Tokyo", users: "🇯🇵" }
              ].map((r, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <span className="text-2xl">{r.users}</span>
                  </div>
                  <div className="text-green-400 font-semibold text-sm text-center mb-2">{r.label}</div>
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">ALB + App</span>
                    </div>
                    <div className="w-full h-8 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">DynamoDB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex-1 h-1 bg-green-500 rounded" />
              <div className="p-3 bg-orange-600 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 h-1 bg-green-500 rounded" />
            </div>
            <div className="text-center text-sm text-gray-400">Global Accelerator / Route 53</div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-center text-yellow-400 font-bold mb-4">Multi-Region Deployment</div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { region: "us-east-1", label: "N. Virginia", users: "🇺🇸" },
                { region: "eu-west-1", label: "Ireland", users: "🇪🇺" },
                { region: "ap-northeast-1", label: "Tokyo", users: "🇯🇵" }
              ].map((r, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4 ring-4 ring-yellow-400">
                  <div className="text-center mb-3">
                    <span className="text-3xl">{r.users}</span>
                  </div>
                  <div className="text-yellow-400 font-bold text-sm text-center mb-2">{r.label}</div>
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-8 bg-blue-600 rounded flex items-center justify-center ring-2 ring-yellow-400">
                      <span className="text-white text-xs font-bold">ALB + App</span>
                    </div>
                    <div className="w-full h-8 bg-purple-600 rounded flex items-center justify-center ring-2 ring-yellow-400">
                      <span className="text-white text-xs font-bold">DynamoDB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Deploy identical application stacks in multiple AWS regions for global reach
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6 opacity-50">
              {[
                { label: "N. Virginia", users: "🇺🇸" },
                { label: "Ireland", users: "🇪🇺" },
                { label: "Tokyo", users: "🇯🇵" }
              ].map((r, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-3 text-center">
                  <span className="text-xl">{r.users}</span>
                  <div className="text-xs text-gray-400 mt-1">{r.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex-1 h-2 bg-yellow-400 rounded animate-pulse" />
              <div className="p-4 bg-orange-600 rounded-lg ring-4 ring-yellow-400">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 h-2 bg-yellow-400 rounded animate-pulse" />
            </div>
            <div className="text-center text-lg text-yellow-400 font-bold mb-4">AWS Global Accelerator</div>
            <div className="text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Global Accelerator uses AWS backbone network for faster, more reliable routing
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-300 space-y-1">
                <div>• 2 static Anycast IPs</div>
                <div>• Routes via AWS backbone (not public internet)</div>
                <div>• Auto failover between regions</div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "N. Virginia", users: "🇺🇸" },
                { label: "Ireland", users: "🇪🇺" },
                { label: "Tokyo", users: "🇯🇵" }
              ].map((r, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-center mb-2">
                    <span className="text-2xl">{r.users}</span>
                  </div>
                  <div className="text-gray-400 text-xs text-center mb-2">{r.label}</div>
                  <div className="w-full h-10 bg-purple-600 rounded flex items-center justify-center ring-4 ring-yellow-400">
                    <span className="text-white text-xs font-bold">DynamoDB</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[0, 1].map((i) => (
                <div key={i} className="h-1 w-20 bg-yellow-400 rounded animate-pulse" />
              ))}
            </div>
            <div className="text-center text-sm text-yellow-400 font-bold mb-4">Bi-directional Replication</div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-300 mb-2">Data Replication Options</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-purple-900/30 p-3 rounded ring-2 ring-yellow-400">
                  <span className="text-purple-400 font-semibold">DynamoDB Global Tables</span>
                  <div className="text-gray-400">Multi-region, active-active, auto replication</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <span className="text-blue-400 font-semibold">Aurora Global Database</span>
                  <div className="text-gray-400">Cross-region read replicas, {'<'}1s replication</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Global data replication ensures consistency across regions
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="mb-6 p-4 bg-orange-900/30 border-2 border-orange-500 rounded-lg">
              <div className="text-center mb-3">
                <Globe className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                <div className="text-orange-400 font-bold">Route 53 DNS Routing</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="text-green-400 font-semibold">Latency</div>
                  <div className="text-gray-400">Route to lowest latency</div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="text-blue-400 font-semibold">Geolocation</div>
                  <div className="text-gray-400">Route by user location</div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="text-purple-400 font-semibold">Failover</div>
                  <div className="text-gray-400">Health check routing</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "N. Virginia", users: "🇺🇸", latency: "10ms" },
                { label: "Ireland", users: "🇪🇺", latency: "95ms" },
                { label: "Tokyo", users: "🇯🇵", latency: "180ms" }
              ].map((r, i) => (
                <div key={i} className={`bg-gray-700 rounded-lg p-3 ${i === 0 ? 'ring-4 ring-green-400' : 'opacity-50'}`}>
                  <div className="text-center mb-2">
                    <span className="text-2xl">{r.users}</span>
                  </div>
                  <div className="text-xs text-gray-400 text-center mb-1">{r.label}</div>
                  <div className={`text-xs text-center font-bold ${i === 0 ? 'text-green-400' : 'text-gray-400'}`}>
                    {r.latency}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Route 53 latency routing directs users to the closest region automatically
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Global Accelerator: static IPs, AWS backbone</li>
          <li>• CloudFront: content caching at edge</li>
          <li>• DynamoDB Global Tables: active-active multi-region</li>
          <li>• Route 53 latency routing for region selection</li>
        </ul>
      </div>
    </div>
  )
}

// 15. Hybrid Architecture Explainer
export function HybridArchitectureExplainer() {



  const steps = [
    { title: "Hybrid Architecture", description: "Connect on-premises infrastructure with AWS cloud" },
    { title: "Site-to-Site VPN", description: "Encrypted tunnel over public internet" },
    { title: "Direct Connect", description: "Dedicated private connection to AWS" },
    { title: "Storage Gateway", description: "Hybrid cloud storage integration" },
    { title: "Outposts", description: "AWS infrastructure on-premises" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Server className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Hybrid Architecture</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 1 || step === 2) && (
          <>
            <div className="grid grid-cols-2 gap-8">
              <div className={`p-4 bg-gray-700 border-2 rounded-lg ${step >= 1 ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-500'}`}>
                <div className={`font-semibold mb-3 text-center ${step >= 1 ? 'text-yellow-400' : 'text-gray-300'}`}>On-Premises</div>
                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-400 text-center">Corporate Data Center</div>
              </div>

              <div className={`p-4 bg-orange-900/20 border-2 rounded-lg ${step >= 1 ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-orange-500'}`}>
                <div className={`font-semibold mb-3 text-center ${step >= 1 ? 'text-yellow-400' : 'text-orange-400'}`}>AWS Cloud</div>
                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">RDS</span>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">S3</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 text-center">AWS VPC</div>
              </div>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className={`flex-1 h-2 bg-gradient-to-r rounded ${step === 1 ? 'from-yellow-400 to-purple-500 animate-pulse' : step === 2 ? 'from-blue-400 to-blue-500' : 'from-gray-500 to-purple-500'}`} />
              <div className={`mx-4 p-2 rounded-lg ${step >= 1 ? 'bg-yellow-600 ring-4 ring-yellow-400' : 'bg-purple-600'}`}>
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className={`flex-1 h-2 bg-gradient-to-l rounded ${step === 1 ? 'from-yellow-400 to-purple-500 animate-pulse' : step === 2 ? 'from-blue-400 to-blue-500' : 'from-orange-500 to-purple-500'}`} />
            </div>

            {step === 1 && (
              <div className="mb-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
                Site-to-Site VPN: Encrypted tunnel over public internet, quick and cost-effective
              </div>
            )}
            {step === 2 && (
              <div className="mb-4 text-center text-sm text-blue-300 bg-blue-900/30 p-3 rounded-lg">
                Direct Connect: Dedicated private connection with consistent low latency
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className={`bg-purple-900/30 border rounded-lg p-3 ${step === 1 ? 'border-yellow-500 ring-2 ring-yellow-400' : 'border-purple-500/50'}`}>
                <div className={`text-sm font-semibold ${step === 1 ? 'text-yellow-400' : 'text-purple-400'}`}>Site-to-Site VPN</div>
                <div className="text-xs text-gray-300 mt-1">Encrypted over internet, quick setup</div>
              </div>
              <div className={`bg-blue-900/30 border rounded-lg p-3 ${step === 2 ? 'border-yellow-500 ring-2 ring-yellow-400' : 'border-blue-500/50'}`}>
                <div className={`text-sm font-semibold ${step === 2 ? 'text-yellow-400' : 'text-blue-400'}`}>Direct Connect</div>
                <div className="text-xs text-gray-300 mt-1">Dedicated line, consistent latency</div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700 border-2 border-gray-500 rounded-lg">
                <div className="text-gray-300 font-semibold mb-3 text-center">On-Premises</div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                    <HardDrive className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-sm text-yellow-400 text-center font-bold">Local Storage</div>
              </div>

              <div className="p-4 bg-orange-900/20 border-2 border-orange-500 rounded-lg">
                <div className="text-orange-400 font-semibold mb-3 text-center">AWS Cloud</div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                    <span className="text-white text-sm font-bold">S3</span>
                  </div>
                </div>
                <div className="text-sm text-yellow-400 text-center font-bold">Cloud Storage</div>
              </div>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="flex-1 h-2 bg-yellow-400 rounded animate-pulse" />
              <div className="mx-4 p-3 bg-purple-600 rounded-lg ring-4 ring-yellow-400">
                <span className="text-white text-sm font-bold">Storage Gateway</span>
              </div>
              <div className="flex-1 h-2 bg-yellow-400 rounded animate-pulse" />
            </div>

            <div className="text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Storage Gateway: Hybrid cloud storage integration (File, Volume, Tape)
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-purple-400 font-semibold">File Gateway</div>
                <div className="text-gray-400">NFS/SMB to S3</div>
              </div>
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-blue-400 font-semibold">Volume Gateway</div>
                <div className="text-gray-400">iSCSI block storage</div>
              </div>
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-green-400 font-semibold">Tape Gateway</div>
                <div className="text-gray-400">VTL to Glacier</div>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="p-6 bg-orange-900/30 border-4 border-orange-500 rounded-lg ring-4 ring-yellow-400">
              <div className="text-orange-400 font-bold text-lg text-center mb-4">AWS Outposts</div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-300 font-semibold mb-3 text-center">Your Data Center</div>
                  <div className="flex justify-center gap-2">
                    <div className="w-14 h-14 bg-orange-600 rounded-lg flex items-center justify-center ring-2 ring-yellow-400">
                      <span className="text-white text-xs font-bold">EC2</span>
                    </div>
                    <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center ring-2 ring-yellow-400">
                      <span className="text-white text-xs font-bold">RDS</span>
                    </div>
                    <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center ring-2 ring-yellow-400">
                      <span className="text-white text-xs font-bold">ECS</span>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 text-center mt-2 font-bold">AWS Hardware On-Prem</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-300 font-semibold mb-3 text-center">AWS Region</div>
                  <div className="flex justify-center">
                    <Cloud className="w-16 h-16 text-orange-400" />
                  </div>
                  <div className="text-xs text-gray-400 text-center mt-2">Managed by AWS</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              AWS Outposts: Fully managed AWS infrastructure deployed in your data center
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Run AWS services on-premises</div>
                <div>• Low latency access to local systems</div>
                <div>• Data residency compliance</div>
                <div>• AWS manages the hardware</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• VPN: quick, cheap, variable latency</li>
          <li>• Direct Connect: consistent, high bandwidth, expensive</li>
          <li>• Storage Gateway: file, volume, tape interfaces</li>
          <li>• Outposts: AWS hardware in your data center</li>
        </ul>
      </div>
    </div>
  )
}

// 16. Cost Optimization Explainer
export function CostOptimizationExplainer() {


  const [currentView, setCurrentView] = useState<0 | 1 | 2 | 3 | 4>(0)

  const steps = [
    { title: "Cost Optimization", description: "Reduce AWS spending while maintaining performance" },
    { title: "Right Sizing", description: "Match instance types to actual workload needs" },
    { title: "Reserved Capacity", description: "Commit to 1-3 year terms for up to 75% savings" },
    { title: "Spot Instances", description: "Use spare capacity for up to 90% savings" },
    { title: "Storage Tiering", description: "Move data to cheaper storage classes over time" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  // Sync current view with step: 0 overview, 1 right-size (On-Demand), 2 Reserved, 3 Spot, 4 S3 tiering
  useEffect(() => {
    const viewByStep: Array<0 | 1 | 2 | 3 | 4> = [0, 1, 2, 3, 4]
    if (viewByStep[step] !== undefined) setCurrentView(viewByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Cost Optimization</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className={`space-y-4 transition-all ${currentView === 4 ? "opacity-40" : ""} ${currentView === 1 ? "ring-2 ring-yellow-400 rounded-lg p-2" : ""}`}>
            <div className="text-lg font-semibold text-green-400 mb-2">EC2 Pricing Options</div>
            {[
              { type: "On-Demand", savings: "0%", color: "gray", desc: "Pay as you go", viewIdx: 1 },
              { type: "Reserved", savings: "Up to 75%", color: "blue", desc: "1-3 year commit", viewIdx: 2 },
              { type: "Spot", savings: "Up to 90%", color: "green", desc: "Spare capacity", viewIdx: 3 },
              { type: "Savings Plans", savings: "Up to 72%", color: "purple", desc: "Flexible commitment", viewIdx: 2 }
            ].map((option, i) => (
              <div key={i} className={`bg-${option.color}-900/30 border border-${option.color}-500/50 rounded-lg p-3 flex justify-between items-center transition-all ${currentView === option.viewIdx ? "ring-2 ring-white scale-105" : ""}`}
                   style={{ backgroundColor: option.color === "gray" ? "rgba(75,85,99,0.3)" : undefined }}>
                <div>
                  <div className="font-semibold text-white">{option.type}</div>
                  <div className="text-xs text-gray-400">{option.desc}</div>
                </div>
                <div className={`text-${option.color === "gray" ? "gray" : "green"}-400 font-bold`}>
                  {option.savings}
                </div>
              </div>
            ))}
          </div>

          <div className={`space-y-4 transition-all ${currentView >= 1 && currentView <= 3 ? "opacity-40" : ""} ${currentView === 4 ? "ring-2 ring-yellow-400 rounded-lg p-2" : ""}`}>
            <div className="text-lg font-semibold text-blue-400 mb-2">S3 Storage Classes</div>
            {[
              { tier: "Standard", cost: "$$$", access: "Frequent" },
              { tier: "IA", cost: "$$", access: "Infrequent" },
              { tier: "Glacier IR", cost: "$", access: "Rare (ms)" },
              { tier: "Glacier Deep", cost: "¢", access: "Archive (hrs)" }
            ].map((tier, i) => (
              <div key={i} className={`bg-gray-700 rounded-lg p-3 flex justify-between items-center transition-all ${currentView === 4 && i === 3 ? "ring-2 ring-white scale-105" : ""}`}>
                <div>
                  <div className="font-semibold text-white">{tier.tier}</div>
                  <div className="text-xs text-gray-400">{tier.access} access</div>
                </div>
                <div className="text-green-400 font-bold">{tier.cost}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Use Compute Optimizer for right-sizing recommendations</li>
          <li>• Savings Plans: flexible across instance families</li>
          <li>• S3 Lifecycle policies automate tiering</li>
          <li>• Cost Explorer and Budgets for monitoring</li>
        </ul>
      </div>
    </div>
  )
}

// 17. Circuit Breaker Pattern Explainer
export function CircuitBreakerPatternExplainer() {


  const [circuitState, setCircuitState] = useState<"closed" | "open" | "half-open">("closed")

  const steps = [
    { title: "Circuit Breaker Pattern", description: "Prevent cascading failures by failing fast" },
    { title: "Closed State", description: "Normal operation, requests pass through" },
    { title: "Open State", description: "Too many failures, requests fail immediately" },
    { title: "Half-Open", description: "Test if service recovered" },
    { title: "Implementation", description: "Use Step Functions, Lambda, or application code" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CircleAlert className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Circuit Breaker Pattern</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Client</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-lg flex flex-col items-center justify-center mb-2 border-4 border-gray-400">
                  <CircleAlert className="w-8 h-8 text-white" />
                  <span className="text-white text-xs">Breaker</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-gray-500 rounded" />
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Service</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-gray-300">
                Circuit Breaker prevents cascading failures by monitoring service health
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">Client</span>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-green-500 rounded animate-pulse" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400">
                  Requests flow
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-lg flex flex-col items-center justify-center mb-2 border-4 border-green-400 ring-4 ring-yellow-400">
                  <CircleAlert className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-bold">CLOSED</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-2 bg-green-500 rounded animate-pulse" />
              </div>

              <div className="text-center">
                <div className="w-18 h-18 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">Service</span>
                </div>
                <span className="text-xs text-green-400">✓ Healthy</span>
              </div>
            </div>
            <div className="mt-6 bg-green-900/30 rounded-lg p-4">
              <div className="text-green-400">
                <span className="font-semibold">Closed State:</span> Normal operation - all requests pass through. Monitoring for failures.
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">Client</span>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-red-500 rounded" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400">
                  Fail fast!
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-red-600 rounded-lg flex flex-col items-center justify-center mb-2 border-4 border-red-400 ring-4 ring-yellow-400">
                  <CircleAlert className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-bold">OPEN</span>
                </div>
              </div>

              <div className="flex-1 mx-4 opacity-30">
                <div className="h-2 bg-gray-500 rounded" />
              </div>

              <div className="text-center opacity-30">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Service</span>
                </div>
                <span className="text-xs text-red-400">✗ Down</span>
              </div>
            </div>
            <div className="mt-6 bg-red-900/30 rounded-lg p-4">
              <div className="text-red-400">
                <span className="font-semibold">Open State:</span> Too many failures detected. Requests fail immediately without calling service.
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-18 h-18 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">Client</span>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-yellow-500 rounded animate-pulse" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400">
                  Limited test
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-yellow-600 rounded-lg flex flex-col items-center justify-center mb-2 border-4 border-yellow-400 ring-4 ring-yellow-400">
                  <CircleAlert className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-bold">HALF-OPEN</span>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-2 bg-yellow-500 rounded animate-pulse" />
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Service</span>
                </div>
                <span className="text-xs text-yellow-400">? Testing</span>
              </div>
            </div>
            <div className="mt-6 bg-yellow-900/30 rounded-lg p-4">
              <div className="text-yellow-400">
                <span className="font-semibold">Half-Open State:</span> Testing with limited requests. If successful → Closed. If failed → Open.
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="flex justify-center gap-2 mb-6">
              {["closed", "open", "half-open"].map((state) => (
                <button
                  key={state}
                  onClick={() => setCircuitState(state as typeof circuitState)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    circuitState === state
                      ? state === "closed" ? "bg-green-600 text-white ring-2 ring-yellow-400" :
                        state === "open" ? "bg-red-600 text-white ring-2 ring-yellow-400" :
                        "bg-yellow-600 text-white ring-2 ring-yellow-400"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Client</span>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className={`h-2 rounded ${
                  circuitState === "closed" ? "bg-green-500" :
                  circuitState === "open" ? "bg-red-500" :
                  "bg-yellow-500 animate-pulse"
                }`} />
              </div>

              <div className="text-center">
                <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center mb-2 border-4 ${
                  circuitState === "closed" ? "bg-green-600 border-green-400" :
                  circuitState === "open" ? "bg-red-600 border-red-400" :
                  "bg-yellow-600 border-yellow-400"
                }`}>
                  <CircleAlert className="w-8 h-8 text-white" />
                  <span className="text-white text-xs">{circuitState}</span>
                </div>
              </div>

              <div className={`flex-1 mx-4 ${circuitState === "open" ? "opacity-30" : ""}`}>
                <div className="h-2 bg-gray-500 rounded" />
              </div>

              <div className={`text-center ${circuitState === "open" ? "opacity-30" : ""}`}>
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">Service</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              {circuitState === "closed" && (
                <div className="text-green-400">
                  <span className="font-semibold">Closed:</span> All requests pass through. Monitoring for failures.
                </div>
              )}
              {circuitState === "open" && (
                <div className="text-red-400">
                  <span className="font-semibold">Open:</span> Requests fail immediately. Service is down. Waiting for timeout.
                </div>
              )}
              {circuitState === "half-open" && (
                <div className="text-yellow-400">
                  <span className="font-semibold">Half-Open:</span> Testing with limited requests. If successful, close circuit.
                </div>
              )}
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Try clicking the buttons above to see how circuit state changes!
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Prevents cascading failures in distributed systems</li>
          <li>• Step Functions can implement circuit breaker with states</li>
          <li>• App Mesh supports circuit breaking for microservices</li>
          <li>• Combine with retries and exponential backoff</li>
        </ul>
      </div>
    </div>
  )
}

// 18. Strangler Fig Pattern Explainer
export function StranglerFigPatternExplainer() {


  const [migrationProgress, setMigrationProgress] = useState(30)

  const steps = [
    { title: "Strangler Fig Pattern", description: "Incrementally migrate from monolith to microservices" },
    { title: "Start Small", description: "Extract one feature at a time" },
    { title: "Route Traffic", description: "ALB routes to old or new based on path" },
    { title: "Gradual Migration", description: "Move more features over time" },
    { title: "Retire Monolith", description: "Eventually replace completely" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Strangler Fig Pattern</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">ALB Routing</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-red-400 font-semibold mb-3 text-center">
                  Monolith (100%)
                </div>
                <div className="w-full h-32 bg-red-900/50 border-2 border-red-500 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Server className="w-12 h-12 text-red-400 mx-auto" />
                    <span className="text-xs text-red-300">Legacy App</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg opacity-30">
                <div className="text-gray-400 font-semibold mb-3 text-center">
                  Microservices (0%)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Users", "Orders", "Payment", "Notif"].map((svc, i) => (
                    <div key={i} className="h-14 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-16 bg-purple-600 rounded-lg flex items-center justify-center ring-4 ring-yellow-400">
                <span className="text-white text-xs font-bold">ALB Routing</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-red-400 font-semibold mb-3 text-center">
                  Monolith (75%)
                </div>
                <div className="w-full h-32 bg-red-900/50 border-2 border-red-500 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Server className="w-12 h-12 text-red-400 mx-auto" />
                    <span className="text-xs text-red-300">Legacy App</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-green-400 font-semibold mb-3 text-center">
                  Microservices (25%)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Users", "Orders", "Payment", "Notif"].map((svc, i) => (
                    <div key={i} className={`h-14 rounded-lg flex items-center justify-center ${
                      i === 0 ? "bg-green-600 ring-4 ring-yellow-400" : "bg-gray-600"
                    }`}>
                      <span className="text-white text-xs">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Start small: Extract one feature (Users service) first
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center ring-4 ring-yellow-400">
                <span className="text-white text-sm font-bold">ALB</span>
                <span className="text-purple-200 text-xs">Path-based routing</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-sm text-yellow-400 font-bold">/users/* → New</div>
              <div className="text-sm text-gray-400">/* → Old</div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700 rounded-lg opacity-70">
                <div className="text-red-400 font-semibold mb-3 text-center">
                  Monolith (75%)
                </div>
                <div className="w-full h-32 bg-red-900/50 border-2 border-red-500 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Server className="w-12 h-12 text-red-400 mx-auto" />
                    <span className="text-xs text-red-300">Legacy</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-green-400 font-semibold mb-3 text-center">
                  Microservices (25%)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 bg-green-600 rounded-lg flex items-center justify-center ring-2 ring-yellow-400">
                    <span className="text-white text-xs font-bold">Users</span>
                  </div>
                  {["Orders", "Payment", "Notif"].map((svc, i) => (
                    <div key={i} className="h-14 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              ALB routes traffic based on path: /users/* goes to new microservice
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Migration Progress: {migrationProgress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={migrationProgress}
                onChange={(e) => setMigrationProgress(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">ALB Routing</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700 rounded-lg" style={{ opacity: 1 - migrationProgress / 100 * 0.7 }}>
                <div className="text-red-400 font-semibold mb-3 text-center">
                  Monolith ({100 - migrationProgress}%)
                </div>
                <div className="w-full h-32 bg-red-900/50 border-2 border-red-500 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Server className="w-12 h-12 text-red-400 mx-auto" />
                    <span className="text-xs text-red-300">Legacy App</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg" style={{ opacity: 0.3 + migrationProgress / 100 * 0.7 }}>
                <div className="text-green-400 font-semibold mb-3 text-center">
                  Microservices ({migrationProgress}%)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Users", "Orders", "Payment", "Notif"].map((svc, i) => (
                    <div key={i} className={`h-14 rounded-lg flex items-center justify-center ${
                      i < Math.ceil(migrationProgress / 25) ? "bg-green-600" : "bg-gray-600"
                    }`}>
                      <span className="text-white text-xs">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Gradually migrate more features - try adjusting the slider!
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-16 bg-purple-600 rounded-lg flex items-center justify-center opacity-30">
                <span className="text-white text-xs font-bold">ALB (retired)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700 rounded-lg opacity-20">
                <div className="text-gray-400 font-semibold mb-3 text-center line-through">
                  Monolith (0%)
                </div>
                <div className="w-full h-32 bg-gray-900/50 border-2 border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Server className="w-12 h-12 text-gray-500 mx-auto" />
                    <span className="text-xs text-gray-500">Retired</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg ring-4 ring-green-400">
                <div className="text-green-400 font-semibold mb-3 text-center">
                  Microservices (100%)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Users", "Orders", "Payment", "Notif"].map((svc, i) => (
                    <div key={i} className="h-14 bg-green-600 rounded-lg flex items-center justify-center ring-2 ring-green-400">
                      <span className="text-white text-xs font-bold">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-green-300 bg-green-900/30 p-3 rounded-lg">
              Migration complete! Monolith retired, all services are now microservices
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Low-risk migration: run old and new side by side</li>
          <li>• ALB path-based routing directs traffic</li>
          <li>• Extract loosely coupled components first</li>
          <li>• Use API Gateway for facade pattern</li>
        </ul>
      </div>
    </div>
  )
}

// 19. CQRS Pattern Explainer
export function CqrsPatternExplainer() {



  const steps = [
    { title: "CQRS Pattern", description: "Command Query Responsibility Segregation - separate read and write models" },
    { title: "Command Side", description: "Handles writes, validates business rules" },
    { title: "Query Side", description: "Optimized for reads, denormalized data" },
    { title: "Event Sync", description: "Events keep read model in sync with write model" },
    { title: "Benefits", description: "Scale reads and writes independently" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">CQRS Pattern</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="p-4 bg-green-900/20 border-2 border-green-500 rounded-lg">
            <div className="text-green-400 font-semibold mb-3 text-center">Command Side (Write)</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">POST /orders</span>
              </div>
              <div className="w-full h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">Command Handler</span>
              </div>
              <div className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white mr-1" />
                <span className="text-white text-xs">Write DB (RDS)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-900/20 border-2 border-blue-500 rounded-lg">
            <div className="text-blue-400 font-semibold mb-3 text-center">Query Side (Read)</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">GET /orders</span>
              </div>
              <div className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">Query Handler</span>
              </div>
              <div className="w-full h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white mr-1" />
                <span className="text-white text-xs">Read DB (DynamoDB)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="p-3 bg-orange-600 rounded-lg">
            <span className="text-white text-xs">Events sync read model</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Separate read/write concerns for complex domains</li>
          <li>• Read model can be denormalized for performance</li>
          <li>• Often combined with Event Sourcing</li>
          <li>• DynamoDB Streams can sync read models</li>
        </ul>
      </div>
    </div>
  )
}

// 20. Saga Pattern Explainer
export function SagaPatternExplainer() {


  const [sagaStep, setSagaStep] = useState(0)

  const steps = [
    { title: "Saga Pattern", description: "Manage distributed transactions across microservices" },
    { title: "Local Transactions", description: "Each service completes its own transaction" },
    { title: "Compensation", description: "If one fails, compensating transactions undo previous steps" },
    { title: "Orchestration", description: "Step Functions coordinates saga steps" },
    { title: "Choreography", description: "Services communicate via events (SNS/EventBridge)" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  const sagaSteps = [
    { name: "Create Order", status: sagaStep >= 1 ? "done" : "pending" },
    { name: "Reserve Inventory", status: sagaStep >= 2 ? "done" : sagaStep === 1 ? "active" : "pending" },
    { name: "Process Payment", status: sagaStep >= 3 ? (sagaStep === 4 ? "failed" : "done") : sagaStep === 2 ? "active" : "pending" },
    { name: "Ship Order", status: sagaStep >= 4 ? "done" : sagaStep === 3 ? "active" : "pending" }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Repeat className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Saga Pattern</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              {["Create Order", "Reserve Inv", "Payment", "Ship"].map((name, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-white text-xs text-center px-1">{name}</span>
                  </div>
                  {i < 3 && <div className="w-8 h-1 mx-1 bg-gray-500" />}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-300 bg-gray-700 p-3 rounded-lg">
              Saga Pattern manages distributed transactions across microservices
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between mb-6">
              {[
                { name: "Create Order", status: "done" },
                { name: "Reserve Inv", status: "done" },
                { name: "Payment", status: "done" },
                { name: "Ship", status: "done" }
              ].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex flex-col items-center justify-center ring-4 ring-yellow-400">
                    <span className="text-white text-xs text-center px-1">{s.name}</span>
                    <span className="text-green-200 text-xs">✓</span>
                  </div>
                  {i < 3 && <div className="w-8 h-1 mx-1 bg-green-500" />}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Each service completes its own local transaction independently
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between mb-6">
              {[
                { name: "Create Order", status: "compensate" },
                { name: "Reserve Inv", status: "compensate" },
                { name: "Payment", status: "failed" },
                { name: "Ship", status: "cancelled" }
              ].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                    s.status === "failed" ? "bg-red-600 ring-4 ring-red-400" :
                    s.status === "compensate" ? "bg-orange-600 ring-4 ring-orange-400" :
                    "bg-gray-600 opacity-30"
                  }`}>
                    <span className="text-white text-xs text-center px-1">{s.name}</span>
                    {s.status === "failed" && <span className="text-red-200 text-xs">✗</span>}
                    {s.status === "compensate" && <span className="text-orange-200 text-xs">↩</span>}
                  </div>
                  {i < 3 && (
                    <div className={`w-8 h-1 mx-1 ${
                      i >= 2 ? "bg-gray-500" : "bg-orange-500"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-red-300 bg-red-900/30 p-3 rounded-lg mb-3">
              Payment failed! Compensating transactions undo previous steps
            </div>
            <div className="bg-orange-900/30 rounded-lg p-3">
              <div className="text-xs text-orange-300 space-y-1">
                <div>1. Cancel order (compensate Create Order)</div>
                <div>2. Release inventory (compensate Reserve Inventory)</div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-4 p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg ring-4 ring-yellow-400">
              <div className="text-center mb-3">
                <Repeat className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-400 font-bold">Orchestration (Step Functions)</div>
              </div>
              <div className="text-xs text-gray-300 text-center">Central coordinator manages saga state</div>
            </div>

            <div className="flex items-center justify-between">
              {["Order", "Inventory", "Payment", "Shipping"].map((name, i) => (
                <div key={i} className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs text-center">{name}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Step Functions orchestrates the saga, calling each service in sequence
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="mb-4 p-4 bg-orange-900/30 border-2 border-orange-500 rounded-lg ring-4 ring-yellow-400">
              <div className="text-center mb-3">
                <span className="text-3xl">📡</span>
                <div className="text-orange-400 font-bold mt-2">Choreography (Events)</div>
              </div>
              <div className="text-xs text-gray-300 text-center">Services communicate via events</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Order Service", event: "OrderCreated" },
                { name: "Inventory", event: "InvReserved" },
                { name: "Payment", event: "PaymentDone" },
                { name: "Shipping", event: "OrderShipped" }
              ].map((s, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-green-400 font-bold">{s.name}</div>
                  <div className="text-xs text-orange-300 mt-1">→ {s.event}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              Each service publishes events via SNS/EventBridge, others react autonomously
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                <div className="text-sm font-semibold text-blue-400 mb-1">Orchestration</div>
                <div className="text-xs text-gray-300">
                  ✓ Central control<br/>
                  ✗ Single point of failure
                </div>
              </div>
              <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
                <div className="text-sm font-semibold text-orange-400 mb-1">Choreography</div>
                <div className="text-xs text-gray-300">
                  ✓ Decentralized<br/>
                  ✗ Harder to debug
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Step {step + 1}/{steps.length}
          </span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Saga = sequence of local transactions with compensations</li>
          <li>• Step Functions is ideal for orchestration-based sagas</li>
          <li>• EventBridge/SNS for choreography-based sagas</li>
          <li>• Each step must have a compensation action for rollback</li>
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
  "well-architected-pillars": WellArchitectedPillarsExplainer,
  "blue-green-deployment": BlueGreenDeploymentExplainer,
  "canary-deployment": CanaryDeploymentExplainer,
  "fan-out-pattern": FanOutPatternExplainer,
  "static-website-hosting": StaticWebsiteHostingExplainer,
  "cache-aside-pattern": CacheAsidePatternExplainer,
  "read-replica-pattern": ReadReplicaPatternExplainer,
  "decoupled-architecture": DecoupledArchitectureExplainer,
  "global-architecture": GlobalArchitectureExplainer,
  "hybrid-architecture": HybridArchitectureExplainer,
  "cost-optimization": CostOptimizationExplainer,
  "circuit-breaker-pattern": CircuitBreakerPatternExplainer,
  "strangler-fig-pattern": StranglerFigPatternExplainer,
  "cqrs-pattern": CqrsPatternExplainer,
  "saga-pattern": SagaPatternExplainer
}
