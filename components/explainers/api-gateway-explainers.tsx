"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Globe, Zap, Shield, Gauge, Database, FileCode } from "lucide-react"

// 1. REST vs HTTP APIs Explainer (Rich)
export function RestVsHttpApisExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedApi, setSelectedApi] = useState<"rest" | "http">("rest")

  const steps = [
    { title: "API Gateway Types", description: "API Gateway offers REST APIs (v1) and HTTP APIs (v2) for different use cases" },
    { title: "REST API Features", description: "Full-featured with caching, request validation, WAF integration, and API keys" },
    { title: "HTTP API Features", description: "Lightweight, faster, cheaper - ideal for simple proxy and Lambda integrations" },
    { title: "Protocol Support", description: "REST supports WebSocket. HTTP APIs are HTTP-only but with OIDC/OAuth2" },
    { title: "Pricing Comparison", description: "HTTP APIs cost up to 70% less than REST APIs for equivalent traffic" },
    { title: "Choose Wisely", description: "Use REST for complex transformations, HTTP for simple, cost-effective APIs" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Sync selected API with step
  useEffect(() => {
    const apiByStep: Array<"rest" | "http"> = ["rest", "rest", "http", "rest", "http", "http"]
    if (apiByStep[step]) setSelectedApi(apiByStep[step])
  }, [step])

  const restFeatures = [
    { name: "API Keys", supported: true },
    { name: "Caching", supported: true },
    { name: "WAF Integration", supported: true },
    { name: "Request Validation", supported: true },
    { name: "Resource Policies", supported: true },
    { name: "Private Endpoints", supported: true }
  ]

  const httpFeatures = [
    { name: "API Keys", supported: false },
    { name: "Caching", supported: false },
    { name: "WAF Integration", supported: false },
    { name: "Request Validation", supported: false },
    { name: "JWT Authorizers", supported: true },
    { name: "Auto-deploy", supported: true }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">REST vs HTTP APIs</h2>
      </div>

      {/* API Type Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedApi("rest")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedApi === "rest"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          REST API (v1)
        </button>
        <button
          onClick={() => setSelectedApi("http")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedApi === "http"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          HTTP API (v2)
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* API Box */}
          <div className={`p-4 rounded-lg border-2 transition-all ${
            selectedApi === "rest" ? "border-purple-500 bg-purple-900/20" : "border-blue-500 bg-blue-900/20"
          }`}>
            <h3 className={`text-lg font-bold mb-3 ${selectedApi === "rest" ? "text-purple-400" : "text-blue-400"}`}>
              {selectedApi === "rest" ? "REST API" : "HTTP API"}
            </h3>
            <div className="space-y-2">
              {(selectedApi === "rest" ? restFeatures : httpFeatures).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    feature.supported ? "bg-green-500" : "bg-gray-600"
                  }`}>
                    {feature.supported && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={feature.supported ? "text-white" : "text-gray-500"}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Metrics */}
          <div className="space-y-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Cost</div>
              <div className="flex items-center gap-2">
                <div className={`h-4 rounded transition-all ${
                  selectedApi === "rest" ? "bg-purple-500 w-full" : "bg-blue-500 w-[30%]"
                }`} />
                <span className="text-white text-sm">
                  {selectedApi === "rest" ? "$3.50/million" : "$1.00/million"}
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Latency</div>
              <div className="flex items-center gap-2">
                <div className={`h-4 rounded transition-all ${
                  selectedApi === "rest" ? "bg-purple-500 w-full" : "bg-blue-500 w-[60%]"
                }`} />
                <span className="text-white text-sm">
                  {selectedApi === "rest" ? "~30ms overhead" : "~10ms overhead"}
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Best For</div>
              <div className="text-white text-sm">
                {selectedApi === "rest"
                  ? "Complex APIs needing caching, validation, WAF"
                  : "Simple Lambda proxies, OIDC/OAuth2 auth"
                }
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
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• HTTP APIs are cheaper and faster but lack caching and WAF</li>
          <li>• REST APIs support API keys, resource policies, and request validation</li>
          <li>• HTTP APIs have native OIDC/OAuth2 JWT authorizer support</li>
          <li>• Choose HTTP API for simple Lambda proxies, REST for complex requirements</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Stages and Deployments Explainer (Medium)
export function StagesDeploymentsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeStage, setActiveStage] = useState("prod")

  const steps = [
    { title: "What are Stages?", description: "Stages are named references to a deployment - like dev, staging, prod" },
    { title: "Stage Variables", description: "Key-value pairs that act like environment variables for each stage" },
    { title: "Canary Deployments", description: "Route a percentage of traffic to a new deployment for testing" },
    { title: "Stage Settings", description: "Each stage can have its own throttling, caching, and logging settings" },
    { title: "Deployment History", description: "Rollback to previous deployments if issues arise" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Sync active stage with step
  useEffect(() => {
    const stageByStep: string[] = ["dev", "staging", "prod", "prod", "dev"]
    if (stageByStep[step]) setActiveStage(stageByStep[step])
  }, [step])

  const stages = [
    { name: "dev", color: "blue", lambda: "my-func:$LATEST", caching: false },
    { name: "staging", color: "yellow", lambda: "my-func:staging", caching: true },
    { name: "prod", color: "green", lambda: "my-func:prod", caching: true }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Stages & Deployments</h2>
      </div>

      {/* Stage Selector */}
      <div className="flex gap-2 mb-6">
        {stages.map(stage => (
          <button
            key={stage.name}
            onClick={() => setActiveStage(stage.name)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeStage === stage.name
                ? `bg-${stage.color}-600 text-white`
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            style={{ backgroundColor: activeStage === stage.name ?
              (stage.color === "blue" ? "#2563eb" : stage.color === "yellow" ? "#ca8a04" : "#16a34a")
              : undefined
            }}
          >
            {stage.name}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Client */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <Globe className="w-8 h-8 text-gray-300" />
            </div>
            <span className="text-sm text-gray-400">Client</span>
          </div>

          {/* Arrow with URL */}
          <div className="flex-1 mx-4">
            <div className="text-center mb-2">
              <span className="text-xs text-gray-400 font-mono">
                /api/{activeStage}/resource
              </span>
            </div>
            <div className="h-1 bg-gradient-to-r from-gray-600 via-purple-500 to-gray-600 rounded" />
          </div>

          {/* Stage Box */}
          <div className={`p-4 rounded-lg border-2 ${
            activeStage === "prod" ? "border-green-500 bg-green-900/20" :
            activeStage === "staging" ? "border-yellow-500 bg-yellow-900/20" :
            "border-blue-500 bg-blue-900/20"
          }`}>
            <div className="text-lg font-bold text-white mb-2">{activeStage.toUpperCase()}</div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Lambda: {stages.find(s => s.name === activeStage)?.lambda}</div>
              <div>Caching: {stages.find(s => s.name === activeStage)?.caching ? "✓ Enabled" : "✗ Disabled"}</div>
            </div>
          </div>

          {/* Arrow */}
          <div className="mx-4">
            <div className="h-1 w-8 bg-gray-600 rounded" />
          </div>

          {/* Lambda */}
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">λ</span>
            </div>
            <span className="text-sm text-gray-400">Lambda</span>
          </div>
        </div>

        {/* Stage Variables */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Stage Variables</h4>
          <div className="font-mono text-sm">
            <span className="text-purple-400">$&#123;stageVariables.lambdaAlias&#125;</span>
            <span className="text-gray-500"> → </span>
            <span className="text-green-400">{activeStage}</span>
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
          <li>• Stage variables can reference Lambda aliases for environment-specific routing</li>
          <li>• Canary deployments allow testing new versions with a percentage of traffic</li>
          <li>• Each stage maintains its own settings (throttling, caching, logging)</li>
          <li>• Use deployment history to rollback if issues occur</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Authentication Methods Explainer (Rich)
export function AuthenticationMethodsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [authType, setAuthType] = useState<"apikey" | "lambda" | "cognito" | "iam">("cognito")

  const steps = [
    { title: "API Gateway Auth Options", description: "Multiple authentication methods to secure your APIs" },
    { title: "API Keys", description: "Simple key-based auth for usage plans and throttling - NOT for primary security" },
    { title: "Lambda Authorizers", description: "Custom auth logic - validate tokens, headers, or query params" },
    { title: "Cognito Authorizers", description: "Native integration with Cognito User Pools for JWT validation" },
    { title: "IAM Authorization", description: "Use AWS Sig v4 signing - ideal for AWS service-to-service calls" },
    { title: "Choosing Auth Method", description: "Match auth method to your use case and security requirements" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Sync auth type with step
  useEffect(() => {
    const authByStep: Array<"apikey" | "lambda" | "cognito" | "iam"> = ["cognito", "apikey", "lambda", "cognito", "iam", "cognito"]
    if (authByStep[step]) setAuthType(authByStep[step])
  }, [step])

  const authMethods = {
    apikey: { name: "API Key", icon: "🔑", color: "blue", use: "Usage tracking, throttling", notFor: "Primary authentication" },
    lambda: { name: "Lambda Authorizer", icon: "λ", color: "orange", use: "Custom tokens, legacy auth", notFor: "Simple JWT validation" },
    cognito: { name: "Cognito", icon: "👤", color: "purple", use: "User pools, JWT tokens", notFor: "Service-to-service" },
    iam: { name: "IAM Auth", icon: "🛡️", color: "green", use: "AWS services, Sig v4", notFor: "End-user authentication" }
  }

  const currentAuth = authMethods[authType]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">API Gateway Authentication</h2>
      </div>

      {/* Auth Type Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Object.entries(authMethods).map(([key, auth]) => (
          <button
            key={key}
            onClick={() => setAuthType(key as typeof authType)}
            className={`p-3 rounded-lg font-medium transition-all text-center ${
              authType === key
                ? "bg-gray-600 ring-2 ring-purple-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <div className="text-2xl mb-1">{auth.icon}</div>
            <div className="text-xs">{auth.name}</div>
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4">
          {/* Client */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <Globe className="w-10 h-10 text-gray-300" />
            </div>
            <span className="text-sm text-gray-400">Client</span>
          </div>

          {/* Request with Auth */}
          <div className="flex-1 max-w-xs">
            <div className="bg-gray-700 rounded-lg p-3 mb-2">
              <div className="text-xs text-gray-400 mb-1">Request Header</div>
              <div className="font-mono text-xs text-green-400">
                {authType === "apikey" && "x-api-key: abc123..."}
                {authType === "lambda" && "Authorization: Bearer token..."}
                {authType === "cognito" && "Authorization: Bearer JWT..."}
                {authType === "iam" && "Authorization: AWS4-HMAC-SHA256..."}
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-gray-600 via-green-500 to-gray-600 rounded" />
          </div>

          {/* Auth Check */}
          <div className={`p-4 rounded-lg border-2 ${
            authType === "cognito" ? "border-purple-500 bg-purple-900/20" :
            authType === "lambda" ? "border-orange-500 bg-orange-900/20" :
            authType === "iam" ? "border-green-500 bg-green-900/20" :
            "border-blue-500 bg-blue-900/20"
          }`}>
            <div className="text-3xl text-center mb-2">{currentAuth.icon}</div>
            <div className="text-sm font-semibold text-white text-center">{currentAuth.name}</div>
          </div>

          {/* Arrow to API */}
          <div className="text-2xl text-gray-500">→</div>

          {/* API Gateway */}
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">🌐</span>
            </div>
            <span className="text-sm text-gray-400">API Gateway</span>
          </div>
        </div>

        {/* Auth Details */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3">
            <div className="text-sm font-semibold text-green-400 mb-1">✓ Best For</div>
            <div className="text-sm text-gray-300">{currentAuth.use}</div>
          </div>
          <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-3">
            <div className="text-sm font-semibold text-red-400 mb-1">✗ Not For</div>
            <div className="text-sm text-gray-300">{currentAuth.notFor}</div>
          </div>
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
          <li>• API Keys are for usage tracking, NOT primary authentication</li>
          <li>• Lambda authorizers return IAM policy - can cache for performance</li>
          <li>• Cognito authorizers validate JWT tokens from User Pools</li>
          <li>• IAM auth uses Sig v4 - ideal for AWS services calling your API</li>
        </ul>
      </div>
    </div>
  )
}

// 4. Throttling and Rate Limiting Explainer (Medium)
export function ThrottlingRateLimitingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [requestRate, setRequestRate] = useState(5000)

  const steps = [
    { title: "API Gateway Throttling", description: "Protect your backend from traffic spikes with rate limiting" },
    { title: "Account Limits", description: "Default: 10,000 requests/second across all APIs (soft limit)" },
    { title: "Usage Plans", description: "Set throttling and quota limits per API key" },
    { title: "Method-Level Throttling", description: "Override limits for specific API methods" },
    { title: "429 Responses", description: "Throttled requests receive HTTP 429 Too Many Requests" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Sync request rate with step
  useEffect(() => {
    const rateByStep: number[] = [3000, 9000, 5000, 7000, 12000]
    if (rateByStep[step] !== undefined) setRequestRate(rateByStep[step])
  }, [step])

  const accountLimit = 10000
  const usagePlanLimit = 5000
  const isThrottled = requestRate > usagePlanLimit

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Gauge className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Throttling & Rate Limiting</h2>
      </div>

      {/* Rate Slider */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Incoming Request Rate: {requestRate.toLocaleString()} req/sec
        </label>
        <input
          type="range"
          min="1000"
          max="15000"
          value={requestRate}
          onChange={(e) => setRequestRate(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1K</span>
          <span className="text-yellow-500">5K (Plan Limit)</span>
          <span className="text-red-500">10K (Account Limit)</span>
          <span>15K</span>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Incoming Requests */}
          <div className="text-center flex-1">
            <div className="text-4xl mb-2">📨</div>
            <div className="text-2xl font-bold text-white">{requestRate.toLocaleString()}</div>
            <div className="text-sm text-gray-400">req/sec</div>
          </div>

          {/* Throttle Gates */}
          <div className="space-y-4 flex-1">
            {/* Usage Plan Limit */}
            <div className={`p-3 rounded-lg border-2 ${
              requestRate > usagePlanLimit ? "border-red-500 bg-red-900/20" : "border-green-500 bg-green-900/20"
            }`}>
              <div className="text-sm font-semibold text-white">Usage Plan Limit</div>
              <div className="text-xs text-gray-400">{usagePlanLimit.toLocaleString()} req/sec</div>
              {requestRate > usagePlanLimit && (
                <div className="text-xs text-red-400 mt-1">⚠️ Throttling active</div>
              )}
            </div>

            {/* Account Limit */}
            <div className={`p-3 rounded-lg border-2 ${
              requestRate > accountLimit ? "border-red-500 bg-red-900/20" : "border-blue-500 bg-blue-900/20"
            }`}>
              <div className="text-sm font-semibold text-white">Account Limit</div>
              <div className="text-xs text-gray-400">{accountLimit.toLocaleString()} req/sec</div>
              {requestRate > accountLimit && (
                <div className="text-xs text-red-400 mt-1">⚠️ Hard limit exceeded</div>
              )}
            </div>
          </div>

          {/* Result */}
          <div className="text-center flex-1">
            <div className={`text-4xl mb-2 ${isThrottled ? "opacity-50" : ""}`}>🔗</div>
            <div className="text-2xl font-bold text-white">
              {Math.min(requestRate, usagePlanLimit).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">passed</div>
            {isThrottled && (
              <div className="mt-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                429: {(requestRate - usagePlanLimit).toLocaleString()} rejected
              </div>
            )}
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
          <li>• Account-level limit: 10,000 req/sec (can be increased)</li>
          <li>• Usage plans tie API keys to throttling and quota limits</li>
          <li>• Throttled requests get HTTP 429 Too Many Requests</li>
          <li>• Method-level throttling can override stage-level settings</li>
        </ul>
      </div>
    </div>
  )
}

// 5. API Caching Explainer (Medium)
export function ApiCachingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cacheEnabled, setCacheEnabled] = useState(true)
  const [ttl, setTtl] = useState(300)

  const steps = [
    { title: "API Gateway Caching", description: "Cache API responses to reduce backend calls and latency" },
    { title: "Cache Location", description: "Cache is at the stage level, stored in dedicated cache instance" },
    { title: "TTL Settings", description: "Default 300 seconds (5 minutes), range 0-3600 seconds" },
    { title: "Cache Keys", description: "By default, uses full request URL. Can add headers/params" },
    { title: "Cache Invalidation", description: "Clients can invalidate with Cache-Control: max-age=0 header" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Sync cache enabled + TTL with step
  useEffect(() => {
    const cacheByStep: boolean[] = [false, true, true, true, false]
    const ttlByStep: number[] = [0, 300, 600, 1800, 0]
    if (cacheByStep[step] !== undefined) setCacheEnabled(cacheByStep[step])
    if (ttlByStep[step] !== undefined) setTtl(ttlByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">API Gateway Caching</h2>
      </div>

      {/* Cache Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCacheEnabled(!cacheEnabled)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            cacheEnabled ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Cache: {cacheEnabled ? "Enabled" : "Disabled"}
        </button>
        <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
          <span className="text-gray-300 text-sm">TTL:</span>
          <input
            type="range"
            min="0"
            max="3600"
            value={ttl}
            onChange={(e) => setTtl(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-white text-sm w-16">{ttl}s</span>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Request */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">📱</span>
            </div>
            <span className="text-sm text-gray-400">Client</span>
          </div>

          {/* Arrow 1 */}
          <div className="text-2xl text-gray-500">→</div>

          {/* API Gateway + Cache */}
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🌐</span>
              </div>
              {cacheEnabled && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center border-2 border-gray-800">
                  <Database className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <span className="text-sm text-gray-400">API Gateway</span>
            {cacheEnabled && (
              <div className="text-xs text-cyan-400 mt-1">TTL: {ttl}s</div>
            )}
          </div>

          {/* Cache Hit/Miss */}
          <div className="flex-1 mx-4">
            <div className={`p-4 rounded-lg ${
              cacheEnabled ? "bg-green-900/30 border border-green-600/50" : "bg-gray-700"
            }`}>
              {cacheEnabled ? (
                <>
                  <div className="text-green-400 font-semibold text-center mb-2">Cache Hit!</div>
                  <div className="text-sm text-gray-300 text-center">Response from cache</div>
                  <div className="text-xs text-gray-500 text-center mt-1">~10ms latency</div>
                </>
              ) : (
                <>
                  <div className="text-gray-400 font-semibold text-center mb-2">No Cache</div>
                  <div className="text-sm text-gray-300 text-center">Direct to backend</div>
                </>
              )}
            </div>
          </div>

          {/* Arrow 2 */}
          <div className={`text-2xl ${cacheEnabled ? "text-gray-600" : "text-green-500"}`}>
            {cacheEnabled ? "╳" : "→"}
          </div>

          {/* Backend */}
          <div className={`text-center ${cacheEnabled ? "opacity-50" : ""}`}>
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">λ</span>
            </div>
            <span className="text-sm text-gray-400">Backend</span>
            {!cacheEnabled && (
              <div className="text-xs text-orange-400 mt-1">~100ms latency</div>
            )}
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
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
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Caching is only available for REST APIs, not HTTP APIs</li>
          <li>• Cache capacity: 0.5GB to 237GB, billed hourly</li>
          <li>• Default TTL is 300 seconds (5 minutes)</li>
          <li>• Invalidate with Cache-Control: max-age=0 header</li>
        </ul>
      </div>
    </div>
  )
}

// 6. Request/Response Transformations Explainer (Medium)
export function RequestResponseTransformationsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTransformed, setShowTransformed] = useState(false)

  const steps = [
    { title: "Mapping Templates", description: "Transform requests and responses using Velocity Template Language (VTL)" },
    { title: "Request Transformation", description: "Modify headers, body, and query parameters before reaching backend" },
    { title: "Response Transformation", description: "Reshape backend responses before sending to client" },
    { title: "Integration Types", description: "AWS, AWS_PROXY, HTTP, HTTP_PROXY, MOCK - proxy types pass through" },
    { title: "VTL Syntax", description: "Use $input, $context, $stageVariables for dynamic values" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const originalRequest = `{
  "user_name": "john_doe",
  "user_email": "john@example.com"
}`

  const transformedRequest = `{
  "userName": "john_doe",
  "email": "john@example.com",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "api-gateway"
}`

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="w-8 h-8 text-pink-400" />
        <h2 className="text-2xl font-bold text-white">Request/Response Transformations</h2>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowTransformed(!showTransformed)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showTransformed ? "bg-pink-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          {showTransformed ? "Show Original" : "Apply Transformation"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Client Request */}
          <div>
            <div className="text-sm font-semibold text-gray-300 mb-2">Client Request</div>
            <pre className="bg-gray-900 p-3 rounded-lg text-xs text-blue-400 overflow-auto">
              {originalRequest}
            </pre>
          </div>

          {/* Mapping Template */}
          <div className="flex flex-col items-center justify-center">
            <div className={`p-4 rounded-lg transition-all ${
              showTransformed ? "bg-pink-900/50 border-2 border-pink-500" : "bg-gray-700"
            }`}>
              <div className="text-center mb-2">
                <FileCode className={`w-8 h-8 mx-auto ${showTransformed ? "text-pink-400" : "text-gray-500"}`} />
              </div>
              <div className="text-xs text-gray-300 text-center">
                {showTransformed ? "VTL Template Active" : "Pass-through"}
              </div>
            </div>
            <div className="mt-2 text-2xl">{showTransformed ? "⚡" : "→"}</div>
          </div>

          {/* Transformed Request */}
          <div>
            <div className="text-sm font-semibold text-gray-300 mb-2">Backend Receives</div>
            <pre className={`bg-gray-900 p-3 rounded-lg text-xs overflow-auto transition-all ${
              showTransformed ? "text-green-400" : "text-blue-400"
            }`}>
              {showTransformed ? transformedRequest : originalRequest}
            </pre>
          </div>
        </div>

        {/* VTL Example */}
        {showTransformed && (
          <div className="mt-4 bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Mapping Template (VTL)</div>
            <pre className="text-xs text-pink-400 font-mono">
{`#set($inputRoot = $input.path('$'))
{
  "userName": "$inputRoot.user_name",
  "email": "$inputRoot.user_email",
  "timestamp": "$context.requestTime",
  "source": "api-gateway"
}`}
            </pre>
          </div>
        )}
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
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
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 rounded-xl p-4 border border-pink-500/30">
        <h3 className="text-lg font-semibold text-pink-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• PROXY integrations pass through unchanged - no transformation</li>
          <li>• VTL templates use $input.json(), $input.path() for data access</li>
          <li>• $context provides request ID, stage, identity info</li>
          <li>• Use mapping templates to adapt between different API formats</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// WEBSOCKET APIS EXPLAINER (Medium)
// ============================================================================
export function WebSocketApisExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "WebSocket APIs", description: "Real-time two-way communication between clients and backend. Full-duplex connections." },
    { title: "Route Selection", description: "Routes defined by $request.body.action or $connect, $disconnect, $default." },
    { title: "Connection Management", description: "Connections persisted up to 10 minutes idle. Use @connections API to send messages." },
    { title: "Use Cases", description: "Chat applications, live dashboards, gaming, real-time notifications." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">WebSocket APIs</h1>
        <p className="text-slate-400">Real-time bidirectional communication</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* WebSocket flow */}
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">👤</div>
              <div className="text-xs">Client</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1 bg-green-500 rounded"></div>
                <span className="text-xs text-green-400">↔ bidirectional</span>
                <div className="flex-1 h-1 bg-green-500 rounded"></div>
              </div>
              <div className="text-center text-xs text-slate-400">wss://api-id.execute-api.region.amazonaws.com/stage</div>
            </div>
            <div className="bg-purple-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">🌐</div>
              <div className="text-xs">API GW</div>
            </div>
            <div className="mx-4 text-slate-400">→</div>
            <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">λ</div>
              <div className="text-xs">Lambda</div>
            </div>
          </div>

          {/* Routes */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-green-500/20 rounded p-2 text-center">
              <div className="text-xs text-green-400 font-medium">$connect</div>
              <div className="text-[10px] text-slate-400">Connection open</div>
            </div>
            <div className="bg-red-500/20 rounded p-2 text-center">
              <div className="text-xs text-red-400 font-medium">$disconnect</div>
              <div className="text-[10px] text-slate-400">Connection close</div>
            </div>
            <div className="bg-blue-500/20 rounded p-2 text-center">
              <div className="text-xs text-blue-400 font-medium">$default</div>
              <div className="text-[10px] text-slate-400">Fallback route</div>
            </div>
            <div className="bg-purple-500/20 rounded p-2 text-center">
              <div className="text-xs text-purple-400 font-medium">sendMessage</div>
              <div className="text-[10px] text-slate-400">Custom route</div>
            </div>
          </div>

          {/* Callback URL */}
          <div className="bg-slate-800 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Send to client:</div>
            <div className="font-mono text-xs text-orange-400">POST @connections/&#123;connectionId&#125;</div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>WebSocket APIs support REST APIs only (not HTTP APIs)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>10-minute idle timeout, 2-hour max connection duration</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use @connections API to send messages to connected clients</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Routes: $connect, $disconnect, $default, custom</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// CORS EXPLAINER (Light)
// ============================================================================
export function ApiGatewayCORSExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [corsEnabled, setCorsEnabled] = useState(true)

  const steps = [
    { title: "What is CORS?", description: "Cross-Origin Resource Sharing - allows APIs to be called from different domains." },
    { title: "Preflight Requests", description: "Browser sends OPTIONS request first. API must respond with CORS headers." },
    { title: "CORS Headers", description: "Access-Control-Allow-Origin, Allow-Methods, Allow-Headers are required." },
    { title: "Configuration", description: "Enable CORS in API Gateway console or return headers from Lambda." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">API Gateway CORS</h1>
        <p className="text-slate-400">Cross-Origin Resource Sharing</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center mb-6">
          <button onClick={() => setCorsEnabled(!corsEnabled)} className={`px-4 py-2 rounded-lg ${corsEnabled ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            CORS: {corsEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded p-3 text-white text-center">
              <div className="text-lg">🌐</div>
              <div className="text-xs">example.com</div>
            </div>
            <div className="flex-1 mx-4 text-center">
              <div className="text-xs text-slate-400 mb-1">OPTIONS (preflight)</div>
              <div className="h-1 bg-slate-600 rounded mb-2"></div>
              <div className={`text-xs ${corsEnabled ? "text-green-400" : "text-red-400"}`}>
                {corsEnabled ? "200 OK + CORS headers" : "No CORS headers!"}
              </div>
            </div>
            <div className="bg-purple-500 rounded p-3 text-white text-center">
              <div className="text-lg">🔌</div>
              <div className="text-xs">api.other.com</div>
            </div>
          </div>

          {corsEnabled && (
            <div className="bg-slate-800 rounded p-3 font-mono text-xs">
              <div className="text-green-400">Access-Control-Allow-Origin: https://example.com</div>
              <div className="text-blue-400">Access-Control-Allow-Methods: GET, POST, PUT</div>
              <div className="text-purple-400">Access-Control-Allow-Headers: Content-Type</div>
            </div>
          )}

          {!corsEnabled && (
            <div className="bg-red-500/20 rounded p-3 text-center text-red-400 text-sm">
              Browser blocks cross-origin request!
            </div>
          )}
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>CORS is browser security - server must send headers</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Preflight OPTIONS request for non-simple requests</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Lambda proxy: return CORS headers from Lambda code</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Enable CORS in API Gateway for non-proxy integrations</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// INTEGRATION TYPES EXPLAINER (Medium)
// ============================================================================
export function IntegrationTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [integrationType, setIntegrationType] = useState("AWS_PROXY")

  const steps = [
    { title: "Integration Types", description: "How API Gateway connects to backend services. Proxy vs non-proxy patterns." },
    { title: "AWS_PROXY (Lambda Proxy)", description: "Passes entire request to Lambda. Most common for serverless. No mapping templates." },
    { title: "AWS (Lambda Custom)", description: "Allows request/response transformation with mapping templates." },
    { title: "HTTP/HTTP_PROXY", description: "Forward to HTTP endpoints. Proxy passes through, HTTP allows transformation." }
  ]

  const types = {
    AWS_PROXY: { name: "Lambda Proxy", desc: "Pass-through to Lambda", transform: false },
    AWS: { name: "Lambda Custom", desc: "With mapping templates", transform: true },
    HTTP_PROXY: { name: "HTTP Proxy", desc: "Pass-through to HTTP", transform: false },
    HTTP: { name: "HTTP Custom", desc: "Transform HTTP requests", transform: true },
    MOCK: { name: "Mock", desc: "Return static response", transform: false }
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">API Gateway Integration Types</h1>
        <p className="text-slate-400">Connecting to backend services</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.entries(types).map(([key, val]) => (
            <button key={key} onClick={() => setIntegrationType(key)} className={`px-3 py-1 rounded text-xs ${integrationType === key ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
              {val.name}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-blue-500 rounded p-3 text-white text-center">
              <div className="text-lg">📱</div>
              <div className="text-xs">Client</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-purple-500 rounded p-3 text-white text-center">
              <div className="text-lg">🌐</div>
              <div className="text-xs">API GW</div>
            </div>
            <div className={`px-4 py-2 rounded ${types[integrationType as keyof typeof types].transform ? "bg-orange-500" : "bg-slate-700"}`}>
              <div className="text-xs text-white">
                {types[integrationType as keyof typeof types].transform ? "Transform" : "Pass-through"}
              </div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-green-500 rounded p-3 text-white text-center">
              <div className="text-lg">{integrationType.includes("MOCK") ? "📄" : integrationType.includes("HTTP") ? "🔗" : "λ"}</div>
              <div className="text-xs">Backend</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-800 rounded">
            <div className="text-sm text-slate-300">
              <strong className="text-white">{types[integrationType as keyof typeof types].name}:</strong>{" "}
              {types[integrationType as keyof typeof types].desc}
            </div>
            <div className="mt-2 text-xs">
              <span className={types[integrationType as keyof typeof types].transform ? "text-orange-400" : "text-green-400"}>
                {types[integrationType as keyof typeof types].transform ? "✓ Mapping templates supported" : "✗ No transformation"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AWS_PROXY: most common for Lambda, no mapping templates</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>PROXY integrations = pass-through, no transformation</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Non-proxy (AWS, HTTP) = VTL mapping templates available</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>MOCK = return canned responses without backend</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// USAGE PLANS EXPLAINER (Light)
// ============================================================================
export function UsagePlansExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What are Usage Plans?", description: "Define throttling limits and quotas for API consumers. Associate with API keys." },
    { title: "Throttling", description: "Rate limit: requests per second. Burst limit: max concurrent requests." },
    { title: "Quotas", description: "Maximum requests per day/week/month. Prevents excessive usage." },
    { title: "API Key Association", description: "Link API keys to usage plans. Different keys can have different limits." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">API Gateway Usage Plans</h1>
        <p className="text-slate-400">Throttling and quotas for API consumers</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Free Tier */}
            <div className="bg-slate-800 border border-green-500/50 rounded p-3">
              <div className="text-green-400 font-medium mb-2">Free Tier</div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Rate: 10 req/s</div>
                <div>Burst: 20 req</div>
                <div>Quota: 1,000/day</div>
              </div>
            </div>
            {/* Pro Tier */}
            <div className="bg-slate-800 border border-blue-500/50 rounded p-3">
              <div className="text-blue-400 font-medium mb-2">Pro Tier</div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Rate: 100 req/s</div>
                <div>Burst: 200 req</div>
                <div>Quota: 50,000/day</div>
              </div>
            </div>
            {/* Enterprise */}
            <div className="bg-slate-800 border border-purple-500/50 rounded p-3">
              <div className="text-purple-400 font-medium mb-2">Enterprise</div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Rate: 1,000 req/s</div>
                <div>Burst: 2,000 req</div>
                <div>Quota: Unlimited</div>
              </div>
            </div>
          </div>

          {/* API Keys association */}
          <div className="p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">API Keys → Usage Plans</div>
            <div className="flex gap-2">
              <div className="bg-green-500/20 rounded px-2 py-1 text-xs text-green-400">key-free-123</div>
              <div className="bg-blue-500/20 rounded px-2 py-1 text-xs text-blue-400">key-pro-456</div>
              <div className="bg-purple-500/20 rounded px-2 py-1 text-xs text-purple-400">key-ent-789</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Usage plans combine throttling (rate/burst) and quotas</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>API keys are NOT for authentication, only tracking</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>One API key can be in multiple usage plans</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Quotas reset at start of period (day/week/month)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// PRIVATE APIS EXPLAINER (Medium)
// ============================================================================
export function PrivateApisExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What are Private APIs?", description: "APIs only accessible from within a VPC. Not exposed to public internet." },
    { title: "VPC Endpoints", description: "Create Interface VPC Endpoint for execute-api service. Private DNS resolution." },
    { title: "Resource Policy", description: "Must configure resource policy to allow access from VPC or specific endpoints." },
    { title: "Use Cases", description: "Internal microservices, B2B APIs, secure internal tools." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Private REST APIs</h1>
        <p className="text-slate-400">VPC-only API access</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Architecture */}
          <div className="border-2 border-blue-500/30 rounded-lg p-4">
            <div className="text-xs text-blue-400 mb-4">VPC</div>
            <div className="flex items-center justify-between">
              <div className="bg-blue-500 rounded p-3 text-white text-center">
                <div className="text-lg">🖥️</div>
                <div className="text-xs">EC2</div>
              </div>
              <div className="text-slate-400">→</div>
              <div className="bg-purple-500 rounded p-3 text-white text-center">
                <div className="text-lg">🔌</div>
                <div className="text-xs">VPC Endpoint</div>
                <div className="text-[10px] text-purple-200">execute-api</div>
              </div>
              <div className="text-slate-400">→</div>
              <div className="bg-orange-500 rounded p-3 text-white text-center">
                <div className="text-lg">🌐</div>
                <div className="text-xs">Private API</div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="bg-red-500/20 rounded px-3 py-1 text-red-400 text-xs">
                ✗ Not accessible from internet
              </div>
            </div>
          </div>

          {/* Resource Policy */}
          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Resource Policy:</div>
            <pre className="text-[10px] text-green-400 font-mono">{`"Condition": {
  "StringEquals": {
    "aws:sourceVpce": "vpce-1234567890abcdef0"
  }
}`}</pre>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires Interface VPC Endpoint for execute-api</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Resource policy MUST allow VPC/endpoint access</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Enable private DNS for standard API URL resolution</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Private APIs only available for REST API type</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// CUSTOM DOMAINS EXPLAINER (Light)
// ============================================================================
export function CustomDomainsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Custom Domain Names", description: "Use your own domain instead of the default API Gateway URL." },
    { title: "Certificate Required", description: "Must have ACM certificate. Regional API: same region. Edge: us-east-1." },
    { title: "Base Path Mapping", description: "Map different API stages to paths on your domain." },
    { title: "DNS Configuration", description: "Point CNAME/A record to API Gateway domain name." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Custom Domain Names</h1>
        <p className="text-slate-400">Using your own domain with API Gateway</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Before/After */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-500/20 rounded p-3">
              <div className="text-xs text-red-400 mb-2">Default URL</div>
              <div className="font-mono text-xs text-slate-300 break-all">
                abc123.execute-api.us-east-1.amazonaws.com/prod
              </div>
            </div>
            <div className="bg-green-500/20 rounded p-3">
              <div className="text-xs text-green-400 mb-2">Custom Domain</div>
              <div className="font-mono text-xs text-slate-300">
                api.mycompany.com/v1
              </div>
            </div>
          </div>

          {/* Setup */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-500 text-white rounded px-2 py-1">1</span>
              <span className="text-slate-300">ACM Certificate for api.mycompany.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-500 text-white rounded px-2 py-1">2</span>
              <span className="text-slate-300">Create Custom Domain in API Gateway</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-500 text-white rounded px-2 py-1">3</span>
              <span className="text-slate-300">Base path mapping: /v1 → prod stage</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-500 text-white rounded px-2 py-1">4</span>
              <span className="text-slate-300">DNS: CNAME to d-xxx.execute-api.region.amazonaws.com</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Edge-optimized: ACM certificate in us-east-1</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Regional: ACM certificate in same region as API</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Base path mapping links domain paths to API stages</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use Route 53 alias record for edge-optimized APIs</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LOGGING EXPLAINER (Light)
// ============================================================================
export function ApiGatewayLoggingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "CloudWatch Logs", description: "Execution logs for debugging. Access logs for analytics. Both optional." },
    { title: "Execution Logs", description: "Detailed logs showing request/response, errors, integration latency." },
    { title: "Access Logs", description: "Structured logs for each request. Customizable format (JSON, CLF, etc)." },
    { title: "X-Ray Tracing", description: "End-to-end request tracing. See latency across API Gateway, Lambda, etc." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">API Gateway Logging</h1>
        <p className="text-slate-400">CloudWatch and X-Ray integration</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Execution Logs */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3">
              <div className="text-blue-400 font-medium text-sm mb-2">Execution Logs</div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Request/Response data</div>
                <div>• Error messages</div>
                <div>• Integration latency</div>
              </div>
            </div>
            {/* Access Logs */}
            <div className="bg-green-500/20 border border-green-500/50 rounded p-3">
              <div className="text-green-400 font-medium text-sm mb-2">Access Logs</div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Caller IP, method</div>
                <div>• Response status</div>
                <div>• Custom format</div>
              </div>
            </div>
            {/* X-Ray */}
            <div className="bg-orange-500/20 border border-orange-500/50 rounded p-3">
              <div className="text-orange-400 font-medium text-sm mb-2">X-Ray Tracing</div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• End-to-end trace</div>
                <div>• Service map</div>
                <div>• Latency analysis</div>
              </div>
            </div>
          </div>

          {/* IAM Role */}
          <div className="p-3 bg-slate-800 rounded text-center text-xs">
            <span className="text-yellow-400">Requires:</span>
            <span className="text-slate-300 ml-2">CloudWatch Logs IAM role on API Gateway</span>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Must configure CloudWatch IAM role at account level</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Execution logs: detailed debugging (can be expensive)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Access logs: customizable format for analytics</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>X-Ray: enable active tracing at stage level</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// MOCK INTEGRATION EXPLAINER (Light)
// ============================================================================
export function MockIntegrationExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Mock Integration", description: "Return static responses without backend. Useful for development and testing." },
    { title: "How It Works", description: "API Gateway generates response directly. No Lambda or HTTP backend needed." },
    { title: "Response Templates", description: "Use mapping templates to define mock response body, headers, status." },
    { title: "Use Cases", description: "API prototyping, frontend development, testing client error handling." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Mock Integration</h1>
        <p className="text-slate-400">Static responses without backend</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Flow */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-blue-500 rounded p-3 text-white text-center">
              <div className="text-lg">📱</div>
              <div className="text-xs">Client</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-purple-500 rounded p-3 text-white text-center">
              <div className="text-lg">🌐</div>
              <div className="text-xs">API Gateway</div>
            </div>
            <div className="bg-green-500 rounded px-3 py-1 text-white text-xs">MOCK</div>
            <div className="text-slate-400">→</div>
            <div className="bg-green-500 rounded p-3 text-white text-center">
              <div className="text-lg">📄</div>
              <div className="text-xs">Static Response</div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Mock Response Template:</div>
            <pre className="text-xs text-green-400 font-mono">{`{
  "message": "Hello from mock",
  "timestamp": "$context.requestTime",
  "path": "$context.resourcePath"
}`}</pre>
          </div>

          <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-center text-xs text-yellow-400">
            No backend costs during development!
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Mock = no backend integration needed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use mapping templates for dynamic values ($context)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Great for API prototyping and frontend development</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can return different responses based on request data</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// OPENAPI SWAGGER EXPLAINER (Light)
// ============================================================================
export function OpenAPISwaggerExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "OpenAPI Integration", description: "Import/export API definitions using OpenAPI 3.0 or Swagger 2.0 spec." },
    { title: "Import API", description: "Create complete API from OpenAPI file. Includes resources, methods, models." },
    { title: "Export API", description: "Export existing API to OpenAPI format. Include API Gateway extensions." },
    { title: "Extensions", description: "x-amazon-apigateway-* extensions for integrations, authorizers, validators." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">OpenAPI / Swagger</h1>
        <p className="text-slate-400">API definition import and export</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Import/Export */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-500/20 border border-green-500/50 rounded p-3 text-center">
              <div className="text-lg mb-1">📥</div>
              <div className="text-green-400 font-medium text-sm">Import</div>
              <div className="text-xs text-slate-400">OpenAPI → API Gateway</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center">
              <div className="text-lg mb-1">📤</div>
              <div className="text-blue-400 font-medium text-sm">Export</div>
              <div className="text-xs text-slate-400">API Gateway → OpenAPI</div>
            </div>
          </div>

          {/* Example extension */}
          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">API Gateway Extension:</div>
            <pre className="text-xs text-green-400 font-mono">{`x-amazon-apigateway-integration:
  type: aws_proxy
  uri: arn:aws:lambda:...
  httpMethod: POST`}</pre>
          </div>

          {/* Formats */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="bg-slate-700 rounded px-3 py-1 text-xs text-slate-300">OpenAPI 3.0</div>
            <div className="bg-slate-700 rounded px-3 py-1 text-xs text-slate-300">Swagger 2.0</div>
            <div className="bg-slate-700 rounded px-3 py-1 text-xs text-slate-300">YAML / JSON</div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Supports OpenAPI 3.0 and Swagger 2.0</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>x-amazon-apigateway-* extensions for AWS-specific config</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Export with or without API Gateway extensions</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use for API versioning and documentation</span></li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const apiGatewayExplainers = {
  "rest-vs-http-apis": RestVsHttpApisExplainer,
  "stages-deployments": StagesDeploymentsExplainer,
  "authentication-methods": AuthenticationMethodsExplainer,
  "throttling-rate-limiting": ThrottlingRateLimitingExplainer,
  "api-caching": ApiCachingExplainer,
  "request-response-transformations": RequestResponseTransformationsExplainer,
  "websocket-apis": WebSocketApisExplainer,
  "api-gateway-cors": ApiGatewayCORSExplainer,
  "integration-types": IntegrationTypesExplainer,
  "usage-plans": UsagePlansExplainer,
  "private-apis": PrivateApisExplainer,
  "custom-domains": CustomDomainsExplainer,
  "api-gateway-logging": ApiGatewayLoggingExplainer,
  "mock-integration": MockIntegrationExplainer,
  "openapi-swagger": OpenAPISwaggerExplainer,
}
