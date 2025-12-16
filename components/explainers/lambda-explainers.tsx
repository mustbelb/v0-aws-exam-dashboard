"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// LAMBDA CONCURRENCY EXPLAINER (Rich)
// ============================================================================
export function LambdaConcurrencyExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [concurrentRequests, setConcurrentRequests] = useState(5)
  const [reservedConcurrency, setReservedConcurrency] = useState(100)
  const [provisionedConcurrency, setProvisionedConcurrency] = useState(0)

  const steps = [
    {
      title: "Understanding Concurrency",
      description: "Concurrency is the number of requests your function handles simultaneously. Each request = 1 concurrent execution."
    },
    {
      title: "Account-Level Limits",
      description: "Your AWS account has a default limit of 1,000 concurrent executions across ALL Lambda functions in a region."
    },
    {
      title: "Reserved Concurrency",
      description: "Reserve a portion of your account's concurrency for a specific function. This guarantees capacity but also LIMITS that function."
    },
    {
      title: "Provisioned Concurrency",
      description: "Pre-initialize execution environments to eliminate cold starts. Ideal for latency-sensitive applications."
    },
    {
      title: "Throttling Behavior",
      description: "When concurrency limit is reached, additional requests are throttled (429 error) or retried depending on invocation type."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  const activeInstances = Math.min(concurrentRequests, reservedConcurrency || 1000)
  const throttled = Math.max(0, concurrentRequests - (reservedConcurrency || 1000))
  const warmInstances = Math.min(provisionedConcurrency, activeInstances)
  const coldInstances = activeInstances - warmInstances

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Concurrency</h1>
        <p className="text-slate-400">Understanding concurrent executions, limits, and provisioned concurrency</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Interactive Controls */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Concurrent Requests</label>
            <input
              type="range"
              min="1"
              max="200"
              value={concurrentRequests}
              onChange={(e) => setConcurrentRequests(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-white font-mono mt-1">{concurrentRequests}</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Reserved Concurrency</label>
            <input
              type="range"
              min="0"
              max="200"
              value={reservedConcurrency}
              onChange={(e) => setReservedConcurrency(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-white font-mono mt-1">{reservedConcurrency || "Unreserved"}</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Provisioned Concurrency</label>
            <input
              type="range"
              min="0"
              max="100"
              value={provisionedConcurrency}
              onChange={(e) => setProvisionedConcurrency(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-white font-mono mt-1">{provisionedConcurrency || "None"}</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="relative h-64 bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Account Pool */}
          <div className="absolute top-2 left-2 text-xs text-slate-500">Account Limit: 1,000</div>

          {/* Lambda Function Box */}
          <div className="absolute inset-4 border-2 border-dashed border-orange-500/30 rounded-lg">
            <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-orange-400 text-sm">
              Lambda Function
            </div>

            {/* Instances Grid */}
            <div className="p-4 flex flex-wrap gap-1 max-h-40 overflow-hidden">
              {/* Warm instances (provisioned) */}
              {Array.from({ length: warmInstances }).map((_, i) => (
                <div
                  key={`warm-${i}`}
                  className="w-6 h-6 bg-green-500 rounded animate-pulse"
                  title="Warm (Provisioned)"
                />
              ))}
              {/* Cold instances */}
              {Array.from({ length: coldInstances }).map((_, i) => (
                <div
                  key={`cold-${i}`}
                  className="w-6 h-6 bg-blue-500 rounded"
                  style={{ animationDelay: `${i * 100}ms` }}
                  title="Cold Start"
                />
              ))}
            </div>

            {/* Stats */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs">
              <span className="text-green-400">Warm: {warmInstances}</span>
              <span className="text-blue-400">Cold: {coldInstances}</span>
              <span className="text-red-400">Throttled: {throttled}</span>
            </div>
          </div>

          {/* Incoming Requests Arrow */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
            <div className="flex items-center">
              <div className="text-xs text-slate-400 mr-2">{concurrentRequests} req</div>
              <div className="w-4 h-4 border-t-2 border-r-2 border-blue-400 transform rotate-45" />
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Default account concurrency limit is 1,000 per region (can request increase)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Reserved concurrency GUARANTEES capacity but also LIMITS the function</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Provisioned concurrency eliminates cold starts - charged even when not used</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Synchronous invocations return 429 when throttled; async invocations retry</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Use Application Auto Scaling to manage provisioned concurrency automatically</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA COLD STARTS EXPLAINER (Rich)
// ============================================================================
export function LambdaColdStartsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [runtime, setRuntime] = useState<"nodejs" | "python" | "java" | "dotnet">("nodejs")
  const [memorySize, setMemorySize] = useState(512)
  const [vpcEnabled, setVpcEnabled] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  const steps = [
    {
      title: "What is a Cold Start?",
      description: "First invocation after deployment or scale-up. AWS must download code, start runtime, and initialize your handler."
    },
    {
      title: "Cold Start Phases",
      description: "1) Download code from S3, 2) Start execution environment, 3) Initialize runtime, 4) Run initialization code, 5) Execute handler."
    },
    {
      title: "Factors Affecting Duration",
      description: "Runtime (Java/.NET slower than Node/Python), package size, memory allocation, VPC configuration, and initialization code complexity."
    },
    {
      title: "Mitigation Strategies",
      description: "Provisioned Concurrency, keep functions warm with scheduled pings, optimize package size, increase memory, lazy initialization."
    },
    {
      title: "Warm Invocations",
      description: "Subsequent requests reuse the execution environment. Only handler code runs - much faster response times."
    }
  ]

  const coldStartTimes = {
    nodejs: { base: 100, init: 50 },
    python: { base: 120, init: 60 },
    java: { base: 800, init: 400 },
    dotnet: { base: 600, init: 300 }
  }

  const calculateColdStart = () => {
    const rt = coldStartTimes[runtime]
    let total = rt.base + rt.init
    total *= (1024 / memorySize) // Lower memory = longer cold start
    if (vpcEnabled) total += 200 // VPC adds latency
    return Math.round(total)
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    setShowTimeline(true)
  }, [runtime, memorySize, vpcEnabled])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Cold Starts</h1>
        <p className="text-slate-400">Understanding initialization latency and optimization strategies</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Runtime</label>
            <select
              value={runtime}
              onChange={(e) => setRuntime(e.target.value as typeof runtime)}
              className="w-full bg-slate-600 text-white rounded p-2"
            >
              <option value="nodejs">Node.js</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="dotnet">.NET</option>
            </select>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Memory (MB)</label>
            <input
              type="range"
              min="128"
              max="3008"
              step="64"
              value={memorySize}
              onChange={(e) => setMemorySize(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-white font-mono mt-1">{memorySize} MB</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">VPC Enabled</label>
            <button
              onClick={() => setVpcEnabled(!vpcEnabled)}
              className={`w-full p-2 rounded transition-colors ${
                vpcEnabled ? "bg-orange-500 text-white" : "bg-slate-600 text-slate-300"
              }`}
            >
              {vpcEnabled ? "Yes (Adds Latency)" : "No"}
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Cold Start Timeline</div>

          <div className="relative h-24">
            {/* Cold Start Bar */}
            <div className="absolute top-0 left-0 h-10 flex items-center">
              <div className="text-xs text-slate-500 w-20">Cold Start</div>
              <div className="flex h-8">
                <div
                  className="bg-red-500/80 h-full flex items-center justify-center text-xs text-white rounded-l"
                  style={{ width: `${calculateColdStart() / 5}px`, minWidth: "40px" }}
                >
                  Init
                </div>
                <div
                  className="bg-yellow-500/80 h-full flex items-center justify-center text-xs text-white"
                  style={{ width: "60px" }}
                >
                  Runtime
                </div>
                <div
                  className="bg-green-500/80 h-full flex items-center justify-center text-xs text-white rounded-r"
                  style={{ width: "40px" }}
                >
                  Handler
                </div>
              </div>
              <div className="ml-2 text-sm text-white font-mono">{calculateColdStart()}ms</div>
            </div>

            {/* Warm Start Bar */}
            <div className="absolute top-14 left-0 h-10 flex items-center">
              <div className="text-xs text-slate-500 w-20">Warm Start</div>
              <div className="flex h-8">
                <div
                  className="bg-green-500/80 h-full flex items-center justify-center text-xs text-white rounded"
                  style={{ width: "40px" }}
                >
                  Handler
                </div>
              </div>
              <div className="ml-2 text-sm text-green-400 font-mono">~10ms</div>
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Java and .NET have longer cold starts than Node.js and Python</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>More memory = more CPU = faster cold starts (and execution)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>VPC-enabled functions have additional ENI attachment latency</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Provisioned Concurrency keeps environments warm - eliminates cold starts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Initialize SDK clients OUTSIDE the handler for reuse across invocations</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA VPC ACCESS EXPLAINER (Medium)
// ============================================================================
export function LambdaVPCAccessExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasNatGateway, setHasNatGateway] = useState(false)
  const [hasVpcEndpoint, setHasVpcEndpoint] = useState(false)

  const steps = [
    {
      title: "Lambda in VPC",
      description: "By default, Lambda runs in AWS-managed VPC. To access private resources (RDS, ElastiCache), configure VPC access."
    },
    {
      title: "ENI Creation",
      description: "Lambda creates Elastic Network Interfaces (ENIs) in your subnets. Uses Hyperplane technology for faster ENI attachment."
    },
    {
      title: "Internet Access",
      description: "Lambda in private subnet loses internet access! Need NAT Gateway or VPC endpoints for external services."
    },
    {
      title: "VPC Endpoints",
      description: "Use VPC endpoints to access AWS services (S3, DynamoDB, SQS) without internet. More secure and faster."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda VPC Access</h1>
        <p className="text-slate-400">Connecting Lambda to private resources securely</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle Controls */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setHasNatGateway(!hasNatGateway)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              hasNatGateway ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            NAT Gateway: {hasNatGateway ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setHasVpcEndpoint(!hasVpcEndpoint)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              hasVpcEndpoint ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            VPC Endpoint: {hasVpcEndpoint ? "ON" : "OFF"}
          </button>
        </div>

        {/* Architecture Diagram */}
        <div className="relative bg-slate-900/50 rounded-xl p-4 h-72 mb-4">
          {/* VPC Box */}
          <div className="absolute inset-4 border-2 border-blue-500/30 rounded-lg">
            <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-blue-400 text-sm">VPC</div>

            {/* Private Subnet */}
            <div className="absolute left-4 top-8 bottom-4 w-40 border border-orange-500/30 rounded bg-orange-500/5">
              <div className="text-xs text-orange-400 p-1">Private Subnet</div>

              {/* Lambda */}
              <div className="absolute top-8 left-4 right-4">
                <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">
                  Lambda
                </div>
                <div className="text-xs text-slate-500 text-center mt-1">ENI</div>
              </div>

              {/* RDS */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-blue-600 rounded p-2 text-white text-xs text-center">
                  RDS
                </div>
              </div>
            </div>

            {/* Public Subnet */}
            <div className="absolute right-4 top-8 bottom-4 w-40 border border-green-500/30 rounded bg-green-500/5">
              <div className="text-xs text-green-400 p-1">Public Subnet</div>

              {hasNatGateway && (
                <div className="absolute top-8 left-4 right-4">
                  <div className="bg-green-500 rounded p-2 text-white text-xs text-center">
                    NAT Gateway
                  </div>
                </div>
              )}
            </div>

            {/* VPC Endpoint */}
            {hasVpcEndpoint && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-500 rounded p-2 text-white text-xs text-center">
                  VPC Endpoint
                </div>
              </div>
            )}
          </div>

          {/* Internet */}
          <div className="absolute right-0 top-1/4 transform translate-x-4">
            <div className="bg-slate-700 rounded-full p-3 text-white text-xs">
              Internet
            </div>
          </div>

          {/* AWS Services */}
          <div className="absolute right-0 bottom-1/4 transform translate-x-4">
            <div className="bg-orange-600 rounded p-2 text-white text-xs">
              S3/DynamoDB
            </div>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Lambda to RDS */}
            <line x1="100" y1="100" x2="100" y2="180" stroke="#22c55e" strokeWidth="2" strokeDasharray="4" />

            {/* NAT Gateway path */}
            {hasNatGateway && (
              <>
                <line x1="140" y1="80" x2="220" y2="80" stroke="#f97316" strokeWidth="2" />
                <line x1="260" y1="80" x2="320" y2="60" stroke="#f97316" strokeWidth="2" />
              </>
            )}

            {/* VPC Endpoint path */}
            {hasVpcEndpoint && (
              <line x1="180" y1="200" x2="320" y2="200" stroke="#a855f7" strokeWidth="2" />
            )}
          </svg>

          {/* Status Indicators */}
          <div className="absolute bottom-2 left-4 right-4 flex gap-4 text-xs">
            <span className={hasNatGateway ? "text-green-400" : "text-red-400"}>
              Internet: {hasNatGateway ? "✓" : "✗"}
            </span>
            <span className={hasVpcEndpoint ? "text-green-400" : "text-yellow-400"}>
              AWS Services: {hasVpcEndpoint ? "Via Endpoint" : hasNatGateway ? "Via NAT" : "✗"}
            </span>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Lambda in VPC needs NAT Gateway for internet access (e.g., external APIs)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>VPC endpoints provide private connectivity to AWS services without internet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Place Lambda in multiple AZs for high availability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Security groups control Lambda&apos;s network access - remember to allow outbound</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA VERSIONS AND ALIASES EXPLAINER (Medium)
// ============================================================================
export function LambdaVersionsAliasesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [prodWeight, setProdWeight] = useState(90)

  const steps = [
    {
      title: "Versions",
      description: "A version is an immutable snapshot of your function code and configuration. $LATEST is the only mutable version."
    },
    {
      title: "Aliases",
      description: "An alias is a pointer to a specific version. Use aliases like 'prod', 'staging', 'dev' instead of version numbers."
    },
    {
      title: "Traffic Shifting",
      description: "Aliases support weighted traffic splitting between two versions. Perfect for canary deployments and blue/green."
    },
    {
      title: "API Gateway Integration",
      description: "Point API Gateway stages to Lambda aliases. Update alias to deploy new version without changing API config."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Versions & Aliases</h1>
        <p className="text-slate-400">Managing deployments with immutable versions and flexible aliases</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Traffic Weight Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Alias Traffic Split (Canary)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={prodWeight}
            onChange={(e) => setProdWeight(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm mt-2">
            <span className="text-blue-400">v2 (New): {100 - prodWeight}%</span>
            <span className="text-green-400">v1 (Stable): {prodWeight}%</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="relative bg-slate-900/50 rounded-xl p-4 h-64 mb-4">
          {/* $LATEST */}
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-500 rounded p-2 text-black text-xs font-medium">
              $LATEST
            </div>
            <div className="text-xs text-slate-500 mt-1">Mutable</div>
          </div>

          {/* Versions */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="text-sm text-slate-400 mb-2">Published Versions</div>
            <div className="flex gap-2">
              <div className="bg-slate-600 rounded p-2 text-white text-xs">v1</div>
              <div className="bg-blue-500 rounded p-2 text-white text-xs">v2</div>
              <div className="bg-slate-600 rounded p-2 text-white text-xs">v3</div>
            </div>
          </div>

          {/* Aliases */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="text-sm text-slate-400 mb-2 text-center">Aliases</div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="bg-green-500 rounded px-3 py-2 text-white text-xs font-medium">
                  prod
                </div>
                <div className="text-xs text-slate-500 mt-1">→ v1 ({prodWeight}%) + v2 ({100-prodWeight}%)</div>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 rounded px-3 py-2 text-white text-xs font-medium">
                  staging
                </div>
                <div className="text-xs text-slate-500 mt-1">→ v2</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-500 rounded px-3 py-2 text-white text-xs font-medium">
                  dev
                </div>
                <div className="text-xs text-slate-500 mt-1">→ $LATEST</div>
              </div>
            </div>
          </div>

          {/* Traffic Flow Visualization */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex h-4 rounded overflow-hidden mx-4">
              <div
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${prodWeight}%` }}
              />
              <div
                className="bg-blue-500 transition-all duration-300"
                style={{ width: `${100 - prodWeight}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>$LATEST is the only mutable version - published versions are immutable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Aliases can point to one or two versions for traffic shifting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Use aliases in ARNs for stable references: arn:aws:lambda:region:account:function:name:alias</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>CodeDeploy can automate canary/linear deployments with aliases</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA LAYERS EXPLAINER (Light)
// ============================================================================
export function LambdaLayersExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLayers, setShowLayers] = useState(true)

  const steps = [
    {
      title: "What are Layers?",
      description: "Layers are ZIP archives containing libraries, custom runtimes, or other dependencies shared across functions."
    },
    {
      title: "Layer Structure",
      description: "Layers extract to /opt. Put libraries in /opt/python, /opt/nodejs, etc. for automatic path inclusion."
    },
    {
      title: "Benefits",
      description: "Reduce deployment package size, share common code, separate dependencies from business logic."
    },
    {
      title: "Limits & Considerations",
      description: "Max 5 layers per function, 250 MB total unzipped. Layers are versioned and immutable."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Layers</h1>
        <p className="text-slate-400">Sharing dependencies and code across functions</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showLayers ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            Layers: {showLayers ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Visualization */}
        <div className="relative bg-slate-900/50 rounded-xl p-4 h-64 mb-4">
          {/* Function Stack */}
          <div className="absolute inset-8 flex flex-col justify-end">
            {/* Function Code */}
            <div className="bg-orange-500 rounded-t p-4 text-white text-center">
              <div className="text-sm font-medium">Function Code</div>
              <div className="text-xs opacity-75">{showLayers ? "2 MB" : "50 MB"}</div>
            </div>

            {/* Layers */}
            {showLayers && (
              <>
                <div className="bg-purple-500 p-2 text-white text-center text-sm">
                  Layer: AWS SDK
                </div>
                <div className="bg-purple-600 p-2 text-white text-center text-sm">
                  Layer: Pandas/NumPy
                </div>
                <div className="bg-purple-700 rounded-b p-2 text-white text-center text-sm">
                  Layer: Custom Utils
                </div>
              </>
            )}
          </div>

          {/* Path Info */}
          <div className="absolute top-4 right-4 text-xs text-slate-500">
            <div>/var/task (function code)</div>
            {showLayers && (
              <>
                <div className="text-purple-400">/opt/python (layers)</div>
                <div className="text-purple-400">/opt/nodejs</div>
              </>
            )}
          </div>

          {/* Size Comparison */}
          <div className="absolute bottom-4 left-4">
            <div className="text-xs text-slate-400">
              Deployment Size: {showLayers ? "2 MB" : "50 MB"}
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Maximum 5 layers per function, 250 MB total unzipped limit</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Layers extract to /opt directory in the execution environment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Layers can be shared across functions and AWS accounts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Use layers for large dependencies like ML libraries, SDKs</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA DESTINATIONS EXPLAINER (Medium)
// ============================================================================
export function LambdaDestinationsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [invocationResult, setInvocationResult] = useState<"success" | "failure">("success")

  const steps = [
    {
      title: "What are Destinations?",
      description: "Destinations route asynchronous invocation results to another AWS service without code changes."
    },
    {
      title: "Success vs Failure",
      description: "Configure separate destinations for successful executions and failures. Great for error handling workflows."
    },
    {
      title: "Supported Destinations",
      description: "SQS, SNS, Lambda (another function), or EventBridge. Each receives execution result with context."
    },
    {
      title: "vs DLQ",
      description: "Destinations replace DLQs with more flexibility - support success routing and richer event data."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Destinations</h1>
        <p className="text-slate-400">Routing async results to downstream services</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setInvocationResult("success")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              invocationResult === "success" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setInvocationResult("failure")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              invocationResult === "failure" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            Failure
          </button>
        </div>

        {/* Visualization */}
        <div className="relative bg-slate-900/50 rounded-xl p-4 h-56 mb-4">
          {/* Event Source */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="bg-blue-600 rounded p-3 text-white text-xs">
              S3 Event
            </div>
          </div>

          {/* Lambda */}
          <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`rounded p-3 text-white text-xs ${
              invocationResult === "success" ? "bg-orange-500" : "bg-orange-500 ring-2 ring-red-500"
            }`}>
              Lambda
            </div>
            <div className="text-xs text-center mt-1 text-slate-500">async</div>
          </div>

          {/* Success Destination */}
          <div className={`absolute right-4 top-8 transition-opacity ${
            invocationResult === "success" ? "opacity-100" : "opacity-30"
          }`}>
            <div className="bg-green-600 rounded p-3 text-white text-xs">
              SQS Queue
            </div>
            <div className="text-xs text-slate-500 mt-1">On Success</div>
          </div>

          {/* Failure Destination */}
          <div className={`absolute right-4 bottom-8 transition-opacity ${
            invocationResult === "failure" ? "opacity-100" : "opacity-30"
          }`}>
            <div className="bg-red-600 rounded p-3 text-white text-xs">
              SNS Topic
            </div>
            <div className="text-xs text-slate-500 mt-1">On Failure</div>
          </div>

          {/* Arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            {/* To Lambda */}
            <line x1="80" y1="112" x2="130" y2="112" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* To Success */}
            <line
              x1="200" y1="100" x2="280" y2="60"
              stroke={invocationResult === "success" ? "#22c55e" : "#64748b"}
              strokeWidth="2"
              strokeDasharray={invocationResult === "success" ? "0" : "4"}
              markerEnd="url(#arrowhead)"
            />

            {/* To Failure */}
            <line
              x1="200" y1="124" x2="280" y2="164"
              stroke={invocationResult === "failure" ? "#ef4444" : "#64748b"}
              strokeWidth="2"
              strokeDasharray={invocationResult === "failure" ? "0" : "4"}
              markerEnd="url(#arrowhead)"
            />
          </svg>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Destinations work with ASYNC invocations only (not sync)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Can route to SQS, SNS, Lambda, or EventBridge</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Destinations include full execution context - more data than DLQ</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Prefer destinations over DLQ for new applications</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA EVENT SOURCE MAPPINGS EXPLAINER (Medium)
// ============================================================================
export function LambdaEventSourceMappingsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [batchSize, setBatchSize] = useState(10)
  const [sourceType, setSourceType] = useState<"sqs" | "kinesis" | "dynamodb">("sqs")

  const steps = [
    {
      title: "What is Event Source Mapping?",
      description: "Lambda polls the source (SQS, Kinesis, DynamoDB Streams) and invokes your function with batches of records."
    },
    {
      title: "Polling Behavior",
      description: "Lambda manages polling infrastructure. Scales pollers automatically based on traffic. You don&apos;t manage servers."
    },
    {
      title: "Batch Processing",
      description: "Configure batch size and window. Function receives array of records. Entire batch succeeds or fails together."
    },
    {
      title: "Error Handling",
      description: "Failed batches retry. Configure max retry attempts, bisect on error, and destination for failed records."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  const sourceConfig = {
    sqs: { maxBatch: 10000, icon: "📬", label: "SQS Queue" },
    kinesis: { maxBatch: 10000, icon: "🌊", label: "Kinesis Stream" },
    dynamodb: { maxBatch: 10000, icon: "📊", label: "DynamoDB Stream" }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Event Source Mappings</h1>
        <p className="text-slate-400">Polling-based triggers for stream and queue processing</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Event Source</label>
            <div className="flex gap-2">
              {(["sqs", "kinesis", "dynamodb"] as const).map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceType(src)}
                  className={`flex-1 py-2 rounded text-xs ${
                    sourceType === src ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"
                  }`}
                >
                  {src.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Batch Size: {batchSize}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Visualization */}
        <div className="relative bg-slate-900/50 rounded-xl p-4 h-48 mb-4">
          {/* Source */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <div className="bg-purple-600 rounded p-3 text-white text-center">
              <div className="text-2xl mb-1">{sourceConfig[sourceType].icon}</div>
              <div className="text-xs">{sourceConfig[sourceType].label}</div>
            </div>
          </div>

          {/* Event Source Mapping (Poller) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-slate-600 rounded p-3 text-white text-center border-2 border-dashed border-blue-400">
              <div className="text-xs font-medium">Event Source Mapping</div>
              <div className="text-xs text-slate-400">(Lambda polls)</div>
              <div className="text-xs mt-1">Batch: {batchSize}</div>
            </div>
          </div>

          {/* Lambda */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-2xl mb-1">λ</div>
              <div className="text-xs">Lambda</div>
            </div>
          </div>

          {/* Arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow-esm" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
            <line x1="120" y1="96" x2="160" y2="96" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-esm)" />
            <line x1="260" y1="96" x2="300" y2="96" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-esm)" />
          </svg>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Event source mappings poll SQS, Kinesis, DynamoDB Streams, Kafka</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Lambda scales pollers automatically - you don&apos;t manage infrastructure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>For streams: records stay in stream, processed in order per shard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Batch failure: entire batch retries. Use &quot;bisect on error&quot; to isolate bad records</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA ENVIRONMENT CONFIG EXPLAINER (Light)
// ============================================================================
export function LambdaEnvironmentConfigExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [encrypted, setEncrypted] = useState(false)

  const steps = [
    {
      title: "Environment Variables",
      description: "Key-value pairs injected into your function&apos;s runtime environment. Access via process.env (Node) or os.environ (Python)."
    },
    {
      title: "Encryption",
      description: "Variables encrypted at rest by default with AWS-managed key. Use customer-managed KMS key for additional control."
    },
    {
      title: "Best Practices",
      description: "Store config, not secrets. For secrets, use Secrets Manager or Parameter Store with IAM permissions."
    },
    {
      title: "Limits",
      description: "4 KB total size for all environment variables. Variable names are case-sensitive."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Environment Configuration</h1>
        <p className="text-slate-400">Managing configuration with environment variables</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setEncrypted(!encrypted)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              encrypted ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            KMS Encryption: {encrypted ? "Custom Key" : "AWS Managed"}
          </button>
        </div>

        {/* Visualization */}
        <div className="relative bg-slate-900/50 rounded-xl p-4 h-56 mb-4">
          {/* Lambda Function */}
          <div className="absolute left-1/2 top-4 transform -translate-x-1/2">
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              Lambda Function
            </div>
          </div>

          {/* Environment Variables */}
          <div className="absolute left-8 top-20 right-8 bottom-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Environment Variables</div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">DB_HOST</span>
                <span className="text-slate-500">=</span>
                <span className="text-green-400">rds.example.com</span>
                {encrypted && <span className="text-yellow-400">🔐</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">TABLE_NAME</span>
                <span className="text-slate-500">=</span>
                <span className="text-green-400">users-prod</span>
                {encrypted && <span className="text-yellow-400">🔐</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">LOG_LEVEL</span>
                <span className="text-slate-500">=</span>
                <span className="text-green-400">INFO</span>
                {encrypted && <span className="text-yellow-400">🔐</span>}
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <span className="text-red-400">SECRET_KEY</span>
                <span className="text-slate-500">=</span>
                <span className="text-red-400 line-through">Don&apos;t do this!</span>
              </div>
            </div>

            <div className="absolute bottom-2 right-2 text-xs text-slate-500">
              Max 4KB total
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setStep(0); setIsPlaying(false) }}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Environment variables are encrypted at rest by default</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Use Secrets Manager or Parameter Store for sensitive data, NOT env vars</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>4 KB total limit for all environment variables combined</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Can use customer-managed KMS keys for additional encryption control</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA PERMISSIONS EXPLAINER (Medium)
// ============================================================================
export function LambdaPermissionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [permissionType, setPermissionType] = useState<"execution" | "resource">("execution")

  const steps = [
    {
      title: "Two Permission Types",
      description: "Lambda uses two permission models: Execution Role (what Lambda CAN do) and Resource Policy (who CAN invoke Lambda)."
    },
    {
      title: "Execution Role",
      description: "IAM role attached to function. Grants Lambda permission to access AWS services like S3, DynamoDB, CloudWatch Logs."
    },
    {
      title: "Resource-Based Policy",
      description: "Attached to the function itself. Grants other services/accounts permission to invoke the function."
    },
    {
      title: "Common Patterns",
      description: "S3 triggers: resource policy. Lambda calling DynamoDB: execution role. Cross-account: both needed."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Permissions</h1>
        <p className="text-slate-400">Execution roles and resource-based policies</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setPermissionType("execution")} className={`px-4 py-2 rounded-lg ${permissionType === "execution" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Execution Role</button>
          <button onClick={() => setPermissionType("resource")} className={`px-4 py-2 rounded-lg ${permissionType === "resource" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Resource Policy</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {permissionType === "execution" ? (
            <div className="flex items-center justify-between">
              <div className="bg-orange-500 rounded p-3 text-white text-center">
                <div className="text-2xl">λ</div>
                <div className="text-xs">Lambda</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="text-center text-blue-400 text-sm mb-1">Execution Role</div>
                <div className="h-1 bg-blue-500 rounded"></div>
                <div className="text-xs text-slate-400 text-center mt-1">Lambda assumes this role</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-green-500 rounded p-2 text-white text-xs">S3</div>
                <div className="bg-blue-600 rounded p-2 text-white text-xs">DynamoDB</div>
                <div className="bg-purple-500 rounded p-2 text-white text-xs">CloudWatch</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="bg-green-500 rounded p-2 text-white text-xs">S3 Bucket</div>
                <div className="bg-yellow-500 rounded p-2 text-white text-xs">API Gateway</div>
                <div className="bg-purple-500 rounded p-2 text-white text-xs">EventBridge</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="text-center text-green-400 text-sm mb-1">Resource Policy</div>
                <div className="h-1 bg-green-500 rounded"></div>
                <div className="text-xs text-slate-400 text-center mt-1">Who can invoke Lambda</div>
              </div>
              <div className="bg-orange-500 rounded p-3 text-white text-center">
                <div className="text-2xl">λ</div>
                <div className="text-xs">Lambda</div>
              </div>
            </div>
          )}

          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Example Policy</div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{permissionType === "execution" ? `{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem"
  ],
  "Resource": "arn:aws:dynamodb:*:*:table/MyTable"
}` : `{
  "Effect": "Allow",
  "Principal": {"Service": "s3.amazonaws.com"},
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:*:*:function:MyFunction",
  "Condition": {
    "ArnLike": {"AWS:SourceArn": "arn:aws:s3:::my-bucket"}
  }
}`}
            </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Execution Role: what Lambda can DO (access other services)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Resource Policy: who can INVOKE Lambda</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cross-account invocation requires BOTH policies</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Lambda automatically creates CloudWatch Logs permissions</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA INVOCATION TYPES EXPLAINER (Medium)
// ============================================================================
export function LambdaInvocationTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [invocationType, setInvocationType] = useState<"sync" | "async" | "event">("sync")

  const steps = [
    {
      title: "Three Invocation Types",
      description: "Lambda supports synchronous, asynchronous, and event source mapping invocations with different behaviors."
    },
    {
      title: "Synchronous (RequestResponse)",
      description: "Caller waits for response. API Gateway, ALB, SDK calls. Errors returned immediately to caller."
    },
    {
      title: "Asynchronous (Event)",
      description: "Lambda queues the event. S3, SNS, EventBridge. Returns 202 immediately. Lambda handles retries."
    },
    {
      title: "Event Source Mapping",
      description: "Lambda polls the source. SQS, Kinesis, DynamoDB Streams. Lambda manages polling infrastructure."
    }
  ]

  const invocationTypes = {
    sync: { name: "Synchronous", services: ["API Gateway", "ALB", "SDK", "Cognito"], retries: "Caller handles", response: "Wait for result" },
    async: { name: "Asynchronous", services: ["S3", "SNS", "EventBridge", "CloudWatch Events"], retries: "2 automatic retries", response: "202 Accepted" },
    event: { name: "Event Source Mapping", services: ["SQS", "Kinesis", "DynamoDB Streams", "Kafka"], retries: "Until success/expiry", response: "N/A (polling)" }
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  const current = invocationTypes[invocationType]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Invocation Types</h1>
        <p className="text-slate-400">Synchronous, asynchronous, and polling patterns</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-2 mb-6">
          <button onClick={() => setInvocationType("sync")} className={`px-3 py-1 rounded text-xs ${invocationType === "sync" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Synchronous</button>
          <button onClick={() => setInvocationType("async")} className={`px-3 py-1 rounded text-xs ${invocationType === "async" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Asynchronous</button>
          <button onClick={() => setInvocationType("event")} className={`px-3 py-1 rounded text-xs ${invocationType === "event" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>Event Source Mapping</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              {current.services.map((svc, i) => (
                <div key={i} className="bg-slate-700 rounded px-2 py-1 text-xs text-white">{svc}</div>
              ))}
            </div>
            <div className="flex-1 mx-4 text-center">
              <div className={`text-sm mb-2 ${invocationType === "sync" ? "text-blue-400" : invocationType === "async" ? "text-green-400" : "text-purple-400"}`}>
                {invocationType === "sync" ? "→ Wait →" : invocationType === "async" ? "→ Queue →" : "← Poll ←"}
              </div>
              <div className="text-xs text-slate-500">{current.response}</div>
            </div>
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-2xl">λ</div>
              <div className="text-xs">Lambda</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Type</div>
              <div className="text-sm text-white">{current.name}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Retries</div>
              <div className="text-sm text-white">{current.retries}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Response</div>
              <div className="text-sm text-white">{current.response}</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Sync: API Gateway, ALB - caller waits and handles errors</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Async: S3, SNS - Lambda retries twice automatically</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Event Source: SQS, Kinesis - Lambda polls and manages retries</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use destinations for async success/failure handling</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA ERROR HANDLING EXPLAINER (Medium)
// ============================================================================
export function LambdaErrorHandlingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorType, setErrorType] = useState<"handled" | "unhandled" | "timeout">("handled")

  const steps = [
    {
      title: "Error Types",
      description: "Lambda has handled errors (your code catches them), unhandled exceptions, and system errors (timeout, OOM)."
    },
    {
      title: "Retry Behavior",
      description: "Sync: no retries. Async: 2 retries with delays. Event source: depends on source type (streams vs queues)."
    },
    {
      title: "Dead Letter Queues",
      description: "After retries exhausted, failed events can go to SQS DLQ or SNS topic for investigation."
    },
    {
      title: "Error Destinations",
      description: "Modern alternative to DLQ - route success/failure to SQS, SNS, Lambda, or EventBridge with full context."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Error Handling</h1>
        <p className="text-slate-400">Retries, DLQs, and error destinations</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-2 mb-6">
          <button onClick={() => setErrorType("handled")} className={`px-3 py-1 rounded text-xs ${errorType === "handled" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Handled Error</button>
          <button onClick={() => setErrorType("unhandled")} className={`px-3 py-1 rounded text-xs ${errorType === "unhandled" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Unhandled Exception</button>
          <button onClick={() => setErrorType("timeout")} className={`px-3 py-1 rounded text-xs ${errorType === "timeout" ? "bg-yellow-500 text-white" : "bg-slate-700 text-slate-300"}`}>Timeout</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded p-2 text-white text-xs">Event</div>
            <div className="text-slate-400">→</div>
            <div className={`rounded p-3 text-white text-center ${errorType === "handled" ? "bg-green-500" : "bg-red-500"}`}>
              <div className="text-xl">λ</div>
              <div className="text-xs">{errorType === "timeout" ? "TIMEOUT" : errorType === "handled" ? "Caught" : "CRASH"}</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="flex flex-col gap-2">
              <div className={`rounded p-2 text-xs ${errorType === "handled" ? "bg-green-500 text-white" : "bg-slate-600 text-slate-400"}`}>
                {errorType === "handled" ? "Response" : "Retry 1"}
              </div>
              {errorType !== "handled" && (
                <>
                  <div className="bg-slate-600 rounded p-2 text-xs text-slate-400">Retry 2</div>
                  <div className="bg-orange-500 rounded p-2 text-xs text-white">DLQ/Dest</div>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3 mt-4">
            <div className="text-xs text-slate-400 mb-2">Error Response</div>
            <pre className="text-xs font-mono overflow-x-auto">
              {errorType === "handled" ? (
                <span className="text-green-400">{`{
  "statusCode": 400,
  "body": "Validation error: missing field"
}`}</span>
              ) : errorType === "unhandled" ? (
                <span className="text-red-400">{`{
  "errorType": "ReferenceError",
  "errorMessage": "x is not defined",
  "trace": ["at handler (index.js:15:10)", ...]
}`}</span>
              ) : (
                <span className="text-yellow-400">{`{
  "errorType": "Task timed out",
  "errorMessage": "Task timed out after 30.00 seconds"
}`}</span>
              )}
            </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Async invocation: 2 automatic retries with exponential backoff</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>DLQ for failed events after retries exhausted</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Destinations preferred over DLQ - more context, supports success too</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Return proper error responses to avoid unnecessary retries</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA MEMORY AND TIMEOUT EXPLAINER (Light)
// ============================================================================
export function LambdaMemoryTimeoutExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [memory, setMemory] = useState(512)
  const [timeout, setTimeout_] = useState(30)

  const steps = [
    {
      title: "Memory Configuration",
      description: "128 MB to 10,240 MB. More memory = more CPU = faster execution. Often cost-effective to increase memory."
    },
    {
      title: "Timeout Configuration",
      description: "1 second to 15 minutes maximum. Set based on expected execution time plus buffer."
    },
    {
      title: "Cost Calculation",
      description: "Charged per ms of execution × memory allocated. Faster execution with more memory can cost less overall."
    },
    {
      title: "Best Practices",
      description: "Use AWS Lambda Power Tuning to find optimal memory. Set timeout > expected duration. Monitor with CloudWatch."
    }
  ]

  const cpuShare = Math.min(6, Math.floor(memory / 1769))
  const estimatedDuration = Math.max(100, 5000 - (memory * 3))
  const cost = ((memory / 1024) * (estimatedDuration / 1000) * 0.0000166667).toFixed(6)

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Memory & Timeout</h1>
        <p className="text-slate-400">Optimizing performance and cost</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Memory (MB)</label>
            <input type="range" min="128" max="3008" step="64" value={memory} onChange={(e) => setMemory(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{memory} MB</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Timeout (seconds)</label>
            <input type="range" min="1" max="900" value={timeout} onChange={(e) => setTimeout_(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{timeout}s</div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Memory</div>
              <div className="text-lg font-mono text-blue-400">{memory} MB</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">vCPU</div>
              <div className="text-lg font-mono text-green-400">{cpuShare || "<1"}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Est. Duration</div>
              <div className="text-lg font-mono text-yellow-400">{estimatedDuration}ms</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Est. Cost</div>
              <div className="text-lg font-mono text-purple-400">${cost}</div>
            </div>
          </div>

          <div className="mt-4 h-8 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: `${Math.min(100, estimatedDuration / timeout / 10)}%` }}>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Fast</span>
            <span>{estimatedDuration}ms / {timeout * 1000}ms timeout</span>
            <span>Timeout</span>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Memory: 128 MB - 10,240 MB (10 GB)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Timeout: 1 second - 15 minutes (900 seconds)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>CPU scales proportionally with memory at 1,769 MB = 1 vCPU</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>More memory often reduces cost (faster execution)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA CONTAINER IMAGES EXPLAINER (Light)
// ============================================================================
export function LambdaContainerImagesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [deploymentType, setDeploymentType] = useState<"zip" | "container">("container")

  const steps = [
    {
      title: "Container Image Support",
      description: "Deploy Lambda functions as container images up to 10 GB. Use familiar container tooling and workflows."
    },
    {
      title: "Base Images",
      description: "AWS provides base images for each runtime. Or use any image that implements Lambda Runtime API."
    },
    {
      title: "ECR Integration",
      description: "Images stored in Amazon ECR. Lambda pulls image at deployment. Supports private repositories."
    },
    {
      title: "When to Use",
      description: "Large dependencies, custom runtimes, consistent dev/prod environments, existing container workflows."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Container Images</h1>
        <p className="text-slate-400">Deploying functions as Docker containers</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setDeploymentType("zip")} className={`px-4 py-2 rounded-lg ${deploymentType === "zip" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>ZIP Package</button>
          <button onClick={() => setDeploymentType("container")} className={`px-4 py-2 rounded-lg ${deploymentType === "container" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>Container Image</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              {deploymentType === "zip" ? (
                <div className="bg-blue-500 rounded p-3 text-white">
                  <div className="text-2xl">📦</div>
                  <div className="text-xs">ZIP (≤250MB)</div>
                </div>
              ) : (
                <div className="bg-purple-500 rounded p-3 text-white">
                  <div className="text-2xl">🐳</div>
                  <div className="text-xs">Container (≤10GB)</div>
                </div>
              )}
            </div>
            <div className="text-slate-400">→</div>
            {deploymentType === "container" && (
              <>
                <div className="bg-orange-500 rounded p-3 text-white text-center">
                  <div className="text-xl">📦</div>
                  <div className="text-xs">ECR</div>
                </div>
                <div className="text-slate-400">→</div>
              </>
            )}
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-2xl">λ</div>
              <div className="text-xs">Lambda</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${deploymentType === "zip" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">ZIP Package</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Max 250 MB unzipped</li>
                <li>• 50 MB direct upload</li>
                <li>• Quick deployments</li>
                <li>• Built-in runtimes only</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${deploymentType === "container" ? "bg-purple-500/20 border border-purple-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Container Image</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Max 10 GB image</li>
                <li>• Stored in ECR</li>
                <li>• Custom runtimes</li>
                <li>• Familiar tooling</li>
              </ul>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Container images up to 10 GB (vs 250 MB for ZIP)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Must be stored in Amazon ECR</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use AWS base images or implement Lambda Runtime API</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Same 15-minute timeout and 10 GB memory limits apply</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA SNAPSTART EXPLAINER (Light)
// ============================================================================
export function LambdaSnapStartExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [snapStartEnabled, setSnapStartEnabled] = useState(true)

  const steps = [
    {
      title: "What is SnapStart?",
      description: "Caches initialized execution environment snapshots. Dramatically reduces cold start latency for Java functions."
    },
    {
      title: "How It Works",
      description: "When you publish a version, Lambda initializes your function and takes a snapshot. Invocations restore from snapshot."
    },
    {
      title: "Performance Impact",
      description: "Up to 10x faster cold starts for Java. From seconds to milliseconds. No code changes required."
    },
    {
      title: "Considerations",
      description: "Java only (Corretto 11+). Requires published versions. Some state (connections, random) needs refresh hooks."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda SnapStart</h1>
        <p className="text-slate-400">Eliminating Java cold starts with snapshots</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center mb-6">
          <button onClick={() => setSnapStartEnabled(!snapStartEnabled)} className={`px-4 py-2 rounded-lg ${snapStartEnabled ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>
            SnapStart: {snapStartEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-4">Cold Start Timeline</div>

          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Without SnapStart</div>
              <div className="flex h-8 rounded overflow-hidden">
                <div className="bg-red-500 flex items-center justify-center text-xs text-white" style={{ width: "30%" }}>Download</div>
                <div className="bg-yellow-500 flex items-center justify-center text-xs text-black" style={{ width: "40%" }}>Init JVM + Code</div>
                <div className="bg-green-500 flex items-center justify-center text-xs text-white" style={{ width: "30%" }}>Handler</div>
              </div>
              <div className="text-xs text-red-400 mt-1">~6,000ms total</div>
            </div>

            <div className={snapStartEnabled ? "opacity-100" : "opacity-40"}>
              <div className="text-xs text-slate-500 mb-1">With SnapStart</div>
              <div className="flex h-8 rounded overflow-hidden">
                <div className="bg-blue-500 flex items-center justify-center text-xs text-white" style={{ width: "15%" }}>Restore</div>
                <div className="bg-green-500 flex items-center justify-center text-xs text-white" style={{ width: "30%" }}>Handler</div>
                <div className="bg-slate-700" style={{ width: "55%" }}></div>
              </div>
              <div className="text-xs text-green-400 mt-1">~200ms total (10x faster!)</div>
            </div>
          </div>

          <div className="mt-6 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">SnapStart Lifecycle</div>
            <div className="flex items-center justify-between text-xs">
              <div className="text-center">
                <div className="bg-blue-500 rounded p-2 text-white mb-1">Publish Version</div>
                <div className="text-slate-500">Trigger</div>
              </div>
              <div className="text-slate-400">→</div>
              <div className="text-center">
                <div className="bg-yellow-500 rounded p-2 text-black mb-1">Init & Snapshot</div>
                <div className="text-slate-500">Cache</div>
              </div>
              <div className="text-slate-400">→</div>
              <div className="text-center">
                <div className="bg-green-500 rounded p-2 text-white mb-1">Restore & Run</div>
                <div className="text-slate-500">Fast!</div>
              </div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Java only - Corretto 11 and higher</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Up to 10x reduction in cold start latency</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires published versions (not $LATEST)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use runtime hooks to refresh connections/state after restore</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// LAMBDA FUNCTION URLS EXPLAINER (Light)
// ============================================================================
export function LambdaFunctionURLsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [authType, setAuthType] = useState<"none" | "iam">("none")

  const steps = [
    {
      title: "What are Function URLs?",
      description: "Dedicated HTTPS endpoints for Lambda functions. No API Gateway needed for simple HTTP use cases."
    },
    {
      title: "Authentication",
      description: "Two auth types: AWS_IAM (SigV4 signed requests) or NONE (public). CORS configuration available."
    },
    {
      title: "URL Format",
      description: "https://<url-id>.lambda-url.<region>.on.aws - unique, persistent URL per function/alias."
    },
    {
      title: "When to Use",
      description: "Simple webhooks, single-function APIs, testing. Use API Gateway for complex routing, auth, throttling."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lambda Function URLs</h1>
        <p className="text-slate-400">Built-in HTTPS endpoints without API Gateway</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setAuthType("none")} className={`px-4 py-2 rounded-lg ${authType === "none" ? "bg-yellow-500 text-black" : "bg-slate-700 text-slate-300"}`}>AUTH_TYPE: NONE</button>
          <button onClick={() => setAuthType("iam")} className={`px-4 py-2 rounded-lg ${authType === "iam" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>AUTH_TYPE: AWS_IAM</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="bg-purple-500 rounded p-3 text-white">
                <div className="text-2xl">🌐</div>
                <div className="text-xs">Client</div>
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-slate-800 rounded p-2 text-center">
                <code className="text-xs text-green-400 break-all">
                  https://abc123.lambda-url.us-east-1.on.aws
                </code>
              </div>
              <div className="text-center text-xs text-slate-400 mt-1">
                {authType === "none" ? "Public Access" : "IAM Signed Request"}
              </div>
            </div>
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-2xl">λ</div>
              <div className="text-xs">Lambda</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-sm font-medium text-white mb-2">Function URL</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✓ Free (no API Gateway cost)</li>
                <li>✓ Simple setup</li>
                <li>✓ Built-in HTTPS</li>
                <li>✗ No custom domains</li>
                <li>✗ Limited auth options</li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded p-3">
              <div className="text-sm font-medium text-white mb-2">API Gateway</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✓ Custom domains</li>
                <li>✓ Request validation</li>
                <li>✓ Usage plans/throttling</li>
                <li>✓ Multiple auth methods</li>
                <li>✗ Additional cost</li>
              </ul>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Function URLs are free - no API Gateway charges</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Auth types: AWS_IAM or NONE (public)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>No custom domain support - use API Gateway for that</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Great for webhooks, simple APIs, internal tools</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const lambdaExplainers = {
  "lambda-concurrency": LambdaConcurrencyExplainer,
  "lambda-cold-starts": LambdaColdStartsExplainer,
  "lambda-vpc-access": LambdaVPCAccessExplainer,
  "lambda-versions-aliases": LambdaVersionsAliasesExplainer,
  "lambda-layers": LambdaLayersExplainer,
  "lambda-destinations": LambdaDestinationsExplainer,
  "lambda-event-source-mappings": LambdaEventSourceMappingsExplainer,
  "lambda-environment-config": LambdaEnvironmentConfigExplainer,
  "lambda-permissions": LambdaPermissionsExplainer,
  "lambda-invocation-types": LambdaInvocationTypesExplainer,
  "lambda-error-handling": LambdaErrorHandlingExplainer,
  "lambda-memory-timeout": LambdaMemoryTimeoutExplainer,
  "lambda-container-images": LambdaContainerImagesExplainer,
  "lambda-snapstart": LambdaSnapStartExplainer,
  "lambda-function-urls": LambdaFunctionURLsExplainer,
}
