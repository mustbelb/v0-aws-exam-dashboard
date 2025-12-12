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

// Export all explainers
export const apiGatewayExplainers = {
  "rest-vs-http-apis": RestVsHttpApisExplainer,
  "stages-deployments": StagesDeploymentsExplainer,
  "authentication-methods": AuthenticationMethodsExplainer,
  "throttling-rate-limiting": ThrottlingRateLimitingExplainer,
  "api-caching": ApiCachingExplainer,
  "request-response-transformations": RequestResponseTransformationsExplainer
}
