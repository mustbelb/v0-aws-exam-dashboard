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
          {/* Step 0: Understanding Concurrency */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Each request = 1 concurrent execution</div>
              <div className="flex items-center justify-center gap-4 h-full">
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="bg-blue-500 rounded px-2 py-1 text-white text-xs animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                        Request {i}
                      </div>
                      <div className="text-yellow-400">→</div>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl mb-1">λ</div>
                  <div className="text-xs">Lambda</div>
                  <div className="text-xs mt-2 bg-orange-600 rounded px-2 py-1">5 concurrent</div>
                </div>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="text-green-400">→</div>
                      <div className="bg-green-500/20 border border-green-500 rounded px-2 py-1 text-green-400 text-xs">
                        Response {i}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Account-Level Limits */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Account Concurrency Pool (Region)</div>
              <div className="border-2 border-blue-500/30 rounded-lg p-3 h-full">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-400 text-sm">Account Limit: 1,000</span>
                  <span className="text-slate-500 text-xs">Shared across ALL functions</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-orange-500/20 border border-orange-500 rounded p-2 text-center">
                    <div className="text-orange-400 text-xs">Function A</div>
                    <div className="text-white text-lg font-bold">300</div>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500 rounded p-2 text-center">
                    <div className="text-purple-400 text-xs">Function B</div>
                    <div className="text-white text-lg font-bold">200</div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500 rounded p-2 text-center">
                    <div className="text-green-400 text-xs">Function C</div>
                    <div className="text-white text-lg font-bold">150</div>
                  </div>
                  <div className="bg-slate-700 rounded p-2 text-center">
                    <div className="text-slate-400 text-xs">Available</div>
                    <div className="text-slate-300 text-lg font-bold">350</div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-4">
                  <div className="bg-gradient-to-r from-orange-500 via-purple-500 to-green-500 h-4 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="text-xs text-slate-500 mt-1 text-center">650 / 1,000 used</div>
              </div>
            </div>
          )}

          {/* Step 2: Reserved Concurrency */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Reserved Concurrency: Guaranteed but Limited</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-2 border-orange-500 rounded-lg p-3 bg-orange-500/10">
                  <div className="text-orange-400 text-sm mb-2">Critical Function</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{reservedConcurrency}</div>
                    <div className="text-xs text-slate-400">Reserved</div>
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-green-400">
                      <span>✓</span> Guaranteed capacity
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <span>!</span> Also max limit
                    </div>
                  </div>
                </div>
                <div className="border-2 border-slate-600 rounded-lg p-3">
                  <div className="text-slate-400 text-sm mb-2">Unreserved Pool</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-300">{1000 - reservedConcurrency}</div>
                    <div className="text-xs text-slate-500">Available for others</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Other functions share this pool
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Provisioned Concurrency */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Provisioned Concurrency: Pre-warmed Environments</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-2 border-green-500 rounded-lg p-3 bg-green-500/10">
                  <div className="text-green-400 text-sm mb-2">Provisioned (Warm)</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {Array.from({ length: Math.min(provisionedConcurrency, 12) }).map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-green-500 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="text-xs text-green-400">
                    {provisionedConcurrency} pre-initialized
                  </div>
                  <div className="text-xs text-slate-500 mt-1">No cold start latency</div>
                </div>
                <div className="border-2 border-blue-500 rounded-lg p-3 bg-blue-500/10">
                  <div className="text-blue-400 text-sm mb-2">On-Demand (Cold)</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {Array.from({ length: Math.min(coldInstances, 12) }).map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-blue-500 rounded" />
                    ))}
                  </div>
                  <div className="text-xs text-blue-400">
                    {coldInstances} started on demand
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Cold start on first request</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Throttling Behavior */}
          {step === 4 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">When Limit Reached: Throttling</div>
              <div className="flex items-center justify-around h-full">
                <div className="text-center">
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-blue-500 rounded px-2 py-1 text-white text-xs">
                        Request
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">{concurrentRequests} incoming</div>
                </div>
                <div className="text-yellow-400 text-2xl">→</div>
                <div className="bg-orange-500 rounded-lg p-3 text-white text-center">
                  <div className="text-xl mb-1">λ</div>
                  <div className="text-xs">Limit: {reservedConcurrency || 1000}</div>
                </div>
                <div className="text-yellow-400 text-2xl">→</div>
                <div className="space-y-2">
                  <div className="bg-green-500/20 border border-green-500 rounded p-2 text-center">
                    <div className="text-green-400 text-sm font-bold">{activeInstances}</div>
                    <div className="text-xs text-green-400">Processed</div>
                  </div>
                  {throttled > 0 && (
                    <div className="bg-red-500/20 border border-red-500 rounded p-2 text-center animate-pulse">
                      <div className="text-red-400 text-sm font-bold">{throttled}</div>
                      <div className="text-xs text-red-400">429 Throttled</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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

          <div className="relative h-32">
            {/* Step 0: Basic Cold Start concept */}
            {step === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-slate-700 rounded p-3 text-slate-400">
                      <span className="text-2xl">📦</span>
                      <div className="text-xs mt-1">New Request</div>
                    </div>
                    <div className="text-2xl text-yellow-400 animate-pulse">→</div>
                    <div className="bg-red-500/20 border-2 border-red-500 rounded p-3 text-red-400">
                      <span className="text-2xl">⏳</span>
                      <div className="text-xs mt-1">Cold Start</div>
                    </div>
                    <div className="text-2xl text-yellow-400 animate-pulse">→</div>
                    <div className="bg-green-500/20 border-2 border-green-500 rounded p-3 text-green-400">
                      <span className="text-2xl">✓</span>
                      <div className="text-xs mt-1">Ready</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">First invocation requires initialization</div>
                </div>
              </div>
            )}

            {/* Step 1: Cold Start Phases breakdown */}
            {step === 1 && (
              <div className="absolute inset-0">
                <div className="text-xs text-slate-400 mb-2">Cold Start Phases (in order)</div>
                <div className="flex items-center h-12 gap-1">
                  <div className="bg-purple-500 h-full flex items-center justify-center text-xs text-white rounded-l px-2 animate-pulse" style={{ width: "60px" }}>
                    1. Download
                  </div>
                  <div className="bg-blue-500 h-full flex items-center justify-center text-xs text-white px-2" style={{ width: "70px" }}>
                    2. Start Env
                  </div>
                  <div className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white px-2" style={{ width: "60px" }}>
                    3. Runtime
                  </div>
                  <div className="bg-orange-500 h-full flex items-center justify-center text-xs text-white px-2" style={{ width: "50px" }}>
                    4. Init
                  </div>
                  <div className="bg-green-500 h-full flex items-center justify-center text-xs text-white rounded-r px-2" style={{ width: "50px" }}>
                    5. Handler
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>← Initialization overhead (cold) →</span>
                  <span>Execution</span>
                </div>
              </div>
            )}

            {/* Step 2: Factors affecting duration - highlight controls */}
            {step === 2 && (
              <div className="absolute inset-0">
                <div className="grid grid-cols-4 gap-2 h-full">
                  <div className={`bg-slate-800 rounded p-2 border-2 transition-all ${runtime === "java" || runtime === "dotnet" ? "border-red-500" : "border-green-500"}`}>
                    <div className="text-xs text-slate-400">Runtime</div>
                    <div className={`text-lg font-bold ${runtime === "java" || runtime === "dotnet" ? "text-red-400" : "text-green-400"}`}>
                      {runtime === "nodejs" ? "Fast" : runtime === "python" ? "Fast" : "Slow"}
                    </div>
                    <div className="text-xs text-slate-500">{runtime}</div>
                  </div>
                  <div className={`bg-slate-800 rounded p-2 border-2 transition-all ${memorySize < 512 ? "border-red-500" : "border-green-500"}`}>
                    <div className="text-xs text-slate-400">Memory</div>
                    <div className={`text-lg font-bold ${memorySize < 512 ? "text-red-400" : "text-green-400"}`}>
                      {memorySize < 512 ? "Low" : "Good"}
                    </div>
                    <div className="text-xs text-slate-500">{memorySize}MB</div>
                  </div>
                  <div className={`bg-slate-800 rounded p-2 border-2 transition-all ${vpcEnabled ? "border-red-500" : "border-green-500"}`}>
                    <div className="text-xs text-slate-400">VPC</div>
                    <div className={`text-lg font-bold ${vpcEnabled ? "text-red-400" : "text-green-400"}`}>
                      {vpcEnabled ? "+200ms" : "No VPC"}
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded p-2 border-2 border-blue-500">
                    <div className="text-xs text-slate-400">Total</div>
                    <div className="text-lg font-bold text-blue-400">{calculateColdStart()}ms</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Mitigation Strategies */}
            {step === 3 && (
              <div className="absolute inset-0">
                <div className="grid grid-cols-2 gap-3 h-full">
                  <div className="bg-green-500/20 border border-green-500 rounded p-3">
                    <div className="text-green-400 font-medium text-sm mb-1">✓ Provisioned Concurrency</div>
                    <div className="text-xs text-slate-400">Pre-warm instances always ready</div>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500 rounded p-3">
                    <div className="text-blue-400 font-medium text-sm mb-1">✓ Scheduled Warm-up</div>
                    <div className="text-xs text-slate-400">Ping function every few minutes</div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500 rounded p-3">
                    <div className="text-yellow-400 font-medium text-sm mb-1">✓ Optimize Package</div>
                    <div className="text-xs text-slate-400">Smaller deployment = faster download</div>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500 rounded p-3">
                    <div className="text-purple-400 font-medium text-sm mb-1">✓ Increase Memory</div>
                    <div className="text-xs text-slate-400">More memory = more CPU = faster init</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Warm vs Cold comparison */}
            {step === 4 && (
              <div className="absolute inset-0">
                {/* Cold Start Bar */}
                <div className="flex items-center mb-3">
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
                  <div className="ml-2 text-sm text-red-400 font-mono">{calculateColdStart()}ms</div>
                </div>

                {/* Warm Start Bar */}
                <div className="flex items-center">
                  <div className="text-xs text-slate-500 w-20">Warm Start</div>
                  <div className="flex h-8">
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-xs text-white rounded animate-pulse"
                      style={{ width: "40px" }}
                    >
                      Handler
                    </div>
                  </div>
                  <div className="ml-2 text-sm text-green-400 font-mono">~10ms ⚡</div>
                </div>
                <div className="text-xs text-slate-500 mt-2">Warm invocations skip all initialization - just run handler!</div>
              </div>
            )}
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
          {/* Step 0: Lambda in VPC - Default vs VPC-enabled */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Default Lambda vs VPC-enabled Lambda</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-2 border-slate-600 rounded-lg p-3">
                  <div className="text-slate-400 text-sm mb-3">Default (AWS-managed VPC)</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500 rounded p-3 text-white text-center">
                      <div className="text-xl">λ</div>
                      <div className="text-xs">Lambda</div>
                    </div>
                    <div className="text-green-400 text-xs">✓ Internet Access</div>
                    <div className="text-green-400 text-xs">✓ AWS Services</div>
                    <div className="text-red-400 text-xs">✗ Private Resources</div>
                  </div>
                </div>
                <div className="border-2 border-blue-500 rounded-lg p-3 bg-blue-500/10">
                  <div className="text-blue-400 text-sm mb-3">Your VPC</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500 rounded p-3 text-white text-center animate-pulse">
                      <div className="text-xl">λ</div>
                      <div className="text-xs">Lambda</div>
                    </div>
                    <div className="text-yellow-400 text-xs">? Internet (needs NAT)</div>
                    <div className="text-green-400 text-xs">✓ Private Resources</div>
                    <div className="flex gap-2 mt-2">
                      <div className="bg-blue-600 rounded p-1 text-white text-xs">RDS</div>
                      <div className="bg-red-600 rounded p-1 text-white text-xs">ElastiCache</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: ENI Creation */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Elastic Network Interface (ENI) in Your Subnet</div>
              <div className="border-2 border-blue-500/30 rounded-lg p-4 h-full">
                <div className="text-blue-400 text-sm mb-4">VPC - Private Subnet</div>
                <div className="flex items-center justify-around">
                  <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
                    <div className="text-2xl">λ</div>
                    <div className="text-xs">Lambda</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-yellow-400 text-xl animate-pulse">↔</div>
                    <div className="bg-purple-500 rounded p-2 text-white text-xs text-center mt-1">
                      ENI
                      <div className="text-purple-200 text-xs">10.0.1.25</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Hyperplane</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-600 rounded p-2 text-white text-xs text-center">
                      RDS
                      <div className="text-blue-200 text-xs">10.0.1.50</div>
                    </div>
                    <div className="bg-red-600 rounded p-2 text-white text-xs text-center">
                      ElastiCache
                      <div className="text-red-200 text-xs">10.0.1.60</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500 text-center">
                  Lambda gets private IP in your subnet via ENI
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Internet Access Problem */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Private Subnet = No Internet!</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-2 border-red-500/50 rounded-lg p-3 bg-red-500/10">
                  <div className="text-red-400 text-sm mb-2">Without NAT Gateway</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500 rounded p-2 text-white text-xs">Lambda</div>
                    <div className="text-red-400 text-xl">✗</div>
                    <div className="bg-slate-700 rounded-full p-2 text-slate-500 text-xs">Internet</div>
                  </div>
                  <div className="mt-2 text-xs text-red-400 text-center">
                    Cannot call external APIs!
                  </div>
                </div>
                <div className="border-2 border-green-500/50 rounded-lg p-3 bg-green-500/10">
                  <div className="text-green-400 text-sm mb-2">With NAT Gateway</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500 rounded p-2 text-white text-xs">Lambda</div>
                    <div className="text-yellow-400">↓</div>
                    <div className="bg-green-500 rounded p-2 text-white text-xs animate-pulse">NAT GW</div>
                    <div className="text-yellow-400">↓</div>
                    <div className="bg-slate-600 rounded-full p-2 text-white text-xs">Internet</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: VPC Endpoints */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">VPC Endpoints: Private AWS Access</div>
              <div className="border-2 border-blue-500/30 rounded-lg p-3 h-full">
                <div className="flex items-center justify-around h-full">
                  <div className="bg-orange-500 rounded-lg p-3 text-white text-center">
                    <div className="text-xl">λ</div>
                    <div className="text-xs">Lambda</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500 rounded p-2 text-white text-xs animate-pulse">
                        S3 Endpoint
                      </div>
                      <div className="text-yellow-400">→</div>
                      <div className="bg-green-600 rounded p-2 text-white text-xs">S3</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500 rounded p-2 text-white text-xs animate-pulse">
                        DynamoDB Endpoint
                      </div>
                      <div className="text-yellow-400">→</div>
                      <div className="bg-blue-600 rounded p-2 text-white text-xs">DynamoDB</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500 rounded p-2 text-white text-xs animate-pulse">
                        SQS Endpoint
                      </div>
                      <div className="text-yellow-400">→</div>
                      <div className="bg-pink-600 rounded p-2 text-white text-xs">SQS</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-400 text-center mt-2">
                  ✓ Private connection - no internet needed
                </div>
              </div>
            </div>
          )}
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
          {/* Step 0: Versions */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Lambda Versions: Immutable Snapshots</div>
              <div className="flex items-start gap-6 h-full">
                <div className="border-2 border-yellow-500 rounded-lg p-3 bg-yellow-500/10">
                  <div className="bg-yellow-500 rounded p-2 text-black text-xs font-medium text-center">
                    $LATEST
                  </div>
                  <div className="text-xs text-yellow-400 mt-2 text-center">Mutable</div>
                  <div className="text-xs text-slate-500 mt-1">Can be updated</div>
                  <div className="mt-2 text-xs text-slate-400 animate-pulse">
                    ↓ Publish
                  </div>
                </div>
                <div className="flex-1 border-2 border-blue-500/30 rounded-lg p-3">
                  <div className="text-blue-400 text-sm mb-3">Published Versions (Immutable)</div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="bg-slate-600 rounded p-2 text-white text-xs">v1</div>
                    <div className="bg-slate-600 rounded p-2 text-white text-xs">v2</div>
                    <div className="bg-blue-500 rounded p-2 text-white text-xs animate-pulse">v3</div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Once published, code & config are frozen
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Aliases */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Aliases: Pointers to Versions</div>
              <div className="flex flex-col gap-4 h-full">
                <div className="flex gap-2 justify-center">
                  <div className="bg-yellow-500 rounded p-2 text-black text-xs">$LATEST</div>
                  <div className="bg-slate-600 rounded p-2 text-white text-xs">v1</div>
                  <div className="bg-slate-600 rounded p-2 text-white text-xs">v2</div>
                  <div className="bg-blue-500 rounded p-2 text-white text-xs">v3</div>
                </div>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-slate-500 text-xl mb-2">↑</div>
                    <div className="bg-purple-500 rounded px-3 py-2 text-white text-xs font-medium">
                      dev
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-500 text-xl mb-2">↑</div>
                    <div className="bg-orange-500 rounded px-3 py-2 text-white text-xs font-medium">
                      staging
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-500 text-xl mb-2">↑</div>
                    <div className="bg-green-500 rounded px-3 py-2 text-white text-xs font-medium animate-pulse">
                      prod
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-slate-500">
                  Update alias to point to new version - no client changes needed
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Traffic Shifting */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Traffic Shifting: Canary Deployments</div>
              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-green-500 rounded p-2 text-white text-xs">v1 (Stable)</div>
                  <div className="bg-blue-500 rounded p-2 text-white text-xs">v2 (New)</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 rounded px-4 py-2 text-white text-sm font-medium inline-block">
                    prod alias
                  </div>
                </div>
                <div className="flex h-6 rounded overflow-hidden mx-8">
                  <div className="bg-green-500 flex items-center justify-center text-xs text-white transition-all" style={{ width: `${prodWeight}%` }}>
                    {prodWeight}%
                  </div>
                  <div className="bg-blue-500 flex items-center justify-center text-xs text-white transition-all" style={{ width: `${100 - prodWeight}%` }}>
                    {100 - prodWeight}%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-slate-700 rounded p-2">
                    <div className="text-yellow-400">Canary</div>
                    <div className="text-slate-400">Start at 10%</div>
                  </div>
                  <div className="bg-slate-700 rounded p-2">
                    <div className="text-blue-400">Linear</div>
                    <div className="text-slate-400">+10% every 10min</div>
                  </div>
                  <div className="bg-slate-700 rounded p-2">
                    <div className="text-green-400">All-at-once</div>
                    <div className="text-slate-400">Immediate 100%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: API Gateway Integration */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">API Gateway + Lambda Aliases</div>
              <div className="flex items-center justify-around h-full">
                <div className="space-y-3">
                  <div className="bg-purple-600 rounded p-2 text-white text-xs text-center">
                    API Gateway
                  </div>
                  <div className="space-y-1">
                    <div className="bg-purple-500/50 rounded px-2 py-1 text-purple-200 text-xs">/prod stage</div>
                    <div className="bg-purple-500/50 rounded px-2 py-1 text-purple-200 text-xs">/staging stage</div>
                    <div className="bg-purple-500/50 rounded px-2 py-1 text-purple-200 text-xs">/dev stage</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-yellow-400">→</div>
                  <div className="text-yellow-400">→</div>
                  <div className="text-yellow-400">→</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">
                    Lambda Function
                  </div>
                  <div className="space-y-1">
                    <div className="bg-green-500 rounded px-2 py-1 text-white text-xs animate-pulse">:prod → v3</div>
                    <div className="bg-orange-500 rounded px-2 py-1 text-white text-xs">:staging → v3</div>
                    <div className="bg-purple-500 rounded px-2 py-1 text-white text-xs">:dev → $LATEST</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center">
                Update alias = deploy without changing API Gateway config
              </div>
            </div>
          )}
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
          {/* Step 0: What are Layers? */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Layers: Reusable ZIP Packages</div>
              <div className="flex items-center justify-center gap-6 h-full">
                <div className="space-y-2">
                  <div className="bg-purple-500 rounded p-3 text-white text-center animate-pulse">
                    <div className="text-sm font-medium">Layer.zip</div>
                    <div className="text-xs opacity-75">Libraries</div>
                  </div>
                  <div className="bg-purple-600 rounded p-3 text-white text-center">
                    <div className="text-sm font-medium">Layer.zip</div>
                    <div className="text-xs opacity-75">Custom Runtime</div>
                  </div>
                  <div className="bg-purple-700 rounded p-3 text-white text-center">
                    <div className="text-sm font-medium">Layer.zip</div>
                    <div className="text-xs opacity-75">Shared Utils</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-2xl">→</div>
                <div className="space-y-2">
                  <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">Function A</div>
                  <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">Function B</div>
                  <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">Function C</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center mt-2">
                Share layers across multiple functions
              </div>
            </div>
          )}

          {/* Step 1: Layer Structure */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Layer File Structure (extracts to /opt)</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs">
                  <div className="text-purple-400 mb-2">Python Layer:</div>
                  <div className="text-slate-300 space-y-1">
                    <div>/opt/</div>
                    <div className="pl-4">python/</div>
                    <div className="pl-8 text-green-400">requests/</div>
                    <div className="pl-8 text-green-400">pandas/</div>
                    <div className="pl-8 text-green-400">numpy/</div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs">
                  <div className="text-blue-400 mb-2">Node.js Layer:</div>
                  <div className="text-slate-300 space-y-1">
                    <div>/opt/</div>
                    <div className="pl-4">nodejs/</div>
                    <div className="pl-8">node_modules/</div>
                    <div className="pl-12 text-green-400">lodash/</div>
                    <div className="pl-12 text-green-400">axios/</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-green-400 text-center mt-2">
                Automatically added to runtime path
              </div>
            </div>
          )}

          {/* Step 2: Benefits */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Benefits of Using Layers</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-2 border-red-500/50 rounded-lg p-3 bg-red-500/10">
                  <div className="text-red-400 text-sm mb-2">Without Layers</div>
                  <div className="bg-orange-500 rounded p-2 text-white text-xs text-center mb-2">
                    Function Code
                  </div>
                  <div className="bg-slate-600 rounded p-2 text-slate-300 text-xs text-center">
                    + All Dependencies
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-red-400 text-lg font-bold">50 MB</span>
                    <div className="text-xs text-slate-500">per function</div>
                  </div>
                </div>
                <div className="border-2 border-green-500/50 rounded-lg p-3 bg-green-500/10">
                  <div className="text-green-400 text-sm mb-2">With Layers</div>
                  <div className="bg-orange-500 rounded p-2 text-white text-xs text-center mb-1">
                    Function Code Only
                  </div>
                  <div className="bg-purple-500 rounded p-1 text-white text-xs text-center mb-1 animate-pulse">
                    Layer (shared)
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-green-400 text-lg font-bold">2 MB</span>
                    <div className="text-xs text-slate-500">+ shared layer</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Limits & Considerations */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Limits & Considerations</div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded p-3">
                    <div className="text-yellow-400 text-sm mb-1">Max Layers</div>
                    <div className="text-2xl font-bold text-white">5</div>
                    <div className="text-xs text-slate-500">per function</div>
                  </div>
                  <div className="bg-slate-800 rounded p-3">
                    <div className="text-yellow-400 text-sm mb-1">Total Size</div>
                    <div className="text-2xl font-bold text-white">250 MB</div>
                    <div className="text-xs text-slate-500">unzipped (layers + code)</div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded p-3">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="text-blue-400 text-sm">Versioned</div>
                      <div className="text-xs text-slate-500">Layer:1, Layer:2</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-sm">Immutable</div>
                      <div className="text-xs text-slate-500">Publish new version</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 text-sm">Shareable</div>
                      <div className="text-xs text-slate-500">Cross-account</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          {/* Step 0: What are Destinations? */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Async Invocation Results → Destinations</div>
              <div className="flex items-center justify-around h-full">
                <div className="text-center">
                  <div className="bg-blue-600 rounded p-2 text-white text-xs mb-1">S3 Event</div>
                  <div className="text-xs text-slate-500">async trigger</div>
                </div>
                <div className="text-yellow-400">→</div>
                <div className="text-center">
                  <div className="bg-orange-500 rounded p-3 text-white text-center animate-pulse">
                    <div className="text-xl">λ</div>
                    <div className="text-xs">Lambda</div>
                  </div>
                </div>
                <div className="text-yellow-400">→</div>
                <div className="space-y-2">
                  <div className="bg-green-600 rounded p-2 text-white text-xs">SQS</div>
                  <div className="bg-pink-600 rounded p-2 text-white text-xs">SNS</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center mt-2">
                Route results automatically - no code changes needed
              </div>
            </div>
          )}

          {/* Step 1: Success vs Failure */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Separate Destinations for Each Outcome</div>
              <div className="flex items-center justify-center gap-6 h-full">
                <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl">λ</div>
                  <div className="text-xs">Lambda</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-green-400 text-xl animate-pulse">→</div>
                    <div className="bg-green-600 rounded p-2 text-white text-xs">
                      On Success
                    </div>
                    <div className="text-xs text-slate-500">→ Process result</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-red-400 text-xl">→</div>
                    <div className="bg-red-600 rounded p-2 text-white text-xs">
                      On Failure
                    </div>
                    <div className="text-xs text-slate-500">→ Alert / Retry</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Supported Destinations */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Supported Destination Types</div>
              <div className="grid grid-cols-4 gap-3 h-full">
                <div className="bg-slate-800 rounded-lg p-3 text-center flex flex-col justify-center">
                  <div className="bg-green-600 rounded p-2 text-white text-xs mb-2 mx-auto">SQS</div>
                  <div className="text-xs text-slate-400">Queue for processing</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center flex flex-col justify-center">
                  <div className="bg-pink-600 rounded p-2 text-white text-xs mb-2 mx-auto">SNS</div>
                  <div className="text-xs text-slate-400">Fan-out notifications</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center flex flex-col justify-center animate-pulse">
                  <div className="bg-orange-500 rounded p-2 text-white text-xs mb-2 mx-auto">Lambda</div>
                  <div className="text-xs text-slate-400">Chain functions</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center flex flex-col justify-center">
                  <div className="bg-purple-600 rounded p-2 text-white text-xs mb-2 mx-auto">EventBridge</div>
                  <div className="text-xs text-slate-400">Event routing</div>
                </div>
              </div>
              <div className="text-xs text-green-400 text-center mt-2">
                Each receives full execution context + result
              </div>
            </div>
          )}

          {/* Step 3: vs DLQ */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Destinations vs Dead Letter Queue (DLQ)</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-2 border-slate-600 rounded-lg p-3">
                  <div className="text-slate-400 text-sm mb-2">DLQ (Legacy)</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-slate-400">Failures only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-slate-400">SQS or SNS only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-slate-400">Limited event data</span>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-green-500 rounded-lg p-3 bg-green-500/10">
                  <div className="text-green-400 text-sm mb-2">Destinations (Recommended)</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">Success + Failure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">4 service types</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">Rich context data</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          {/* Step 0: What is Event Source Mapping? */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Lambda Polls the Source (not push!)</div>
              <div className="flex items-center justify-around h-full">
                <div className="space-y-2">
                  <div className="bg-purple-600 rounded p-2 text-white text-xs text-center">SQS Queue</div>
                  <div className="bg-blue-600 rounded p-2 text-white text-xs text-center">Kinesis Stream</div>
                  <div className="bg-green-600 rounded p-2 text-white text-xs text-center">DynamoDB Stream</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-blue-400 text-xl animate-pulse">←</div>
                  <div className="text-xs text-slate-500">Lambda polls</div>
                </div>
                <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl">λ</div>
                  <div className="text-xs">Lambda</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Polling Behavior */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Managed Polling Infrastructure</div>
              <div className="flex items-center justify-center gap-6 h-full">
                <div className="bg-purple-600 rounded p-3 text-white text-center">
                  <div className="text-xl">{sourceConfig[sourceType].icon}</div>
                  <div className="text-xs">{sourceConfig[sourceType].label}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 rounded p-1 text-white text-xs animate-pulse">Poller 1</div>
                    <div className="text-yellow-400">→</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 rounded p-1 text-white text-xs">Poller 2</div>
                    <div className="text-yellow-400">→</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 rounded p-1 text-white text-xs">Poller N</div>
                    <div className="text-yellow-400">→</div>
                  </div>
                </div>
                <div className="bg-orange-500 rounded p-3 text-white text-center">
                  <div className="text-xl">λ</div>
                  <div className="text-xs">Lambda</div>
                </div>
              </div>
              <div className="text-xs text-green-400 text-center">
                Auto-scales pollers based on traffic
              </div>
            </div>
          )}

          {/* Step 2: Batch Processing */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Batch Processing</div>
              <div className="flex items-center justify-around h-full">
                <div className="bg-purple-600 rounded p-2 text-white text-center">
                  <div className="text-sm">{sourceConfig[sourceType].icon}</div>
                  <div className="text-xs">{sourceConfig[sourceType].label}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-yellow-400">→</div>
                  <div className="bg-slate-700 rounded p-2 border border-blue-400 border-dashed">
                    <div className="text-xs text-blue-400">Batch: {batchSize}</div>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: Math.min(batchSize, 5) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-blue-400 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                      ))}
                      {batchSize > 5 && <span className="text-xs text-slate-500">...</span>}
                    </div>
                  </div>
                  <div className="text-yellow-400">→</div>
                </div>
                <div className="bg-orange-500 rounded p-3 text-white text-center">
                  <div className="text-xl">λ</div>
                  <div className="text-xs">Receives array</div>
                </div>
              </div>
              <div className="text-xs text-yellow-400 text-center">
                All records in batch succeed or fail together
              </div>
            </div>
          )}

          {/* Step 3: Error Handling */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Error Handling Options</div>
              <div className="grid grid-cols-3 gap-3 h-full">
                <div className="bg-slate-800 rounded p-2 text-center">
                  <div className="text-yellow-400 text-sm mb-1">Retry</div>
                  <div className="text-xs text-slate-400">
                    <div>Max attempts</div>
                    <div>Max age</div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded p-2 text-center animate-pulse">
                  <div className="text-blue-400 text-sm mb-1">Bisect on Error</div>
                  <div className="text-xs text-slate-400">
                    <div>Split batch in half</div>
                    <div>Isolate bad record</div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded p-2 text-center">
                  <div className="text-red-400 text-sm mb-1">On Failure</div>
                  <div className="text-xs text-slate-400">
                    <div>Send to SQS/SNS</div>
                    <div>for investigation</div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          {/* Step 0: Basic Environment Variables concept */}
          {step === 0 && (
            <div className="absolute inset-4">
              <div className="flex items-start gap-4 h-full">
                <div className="bg-orange-500 rounded p-3 text-white text-center">
                  <div className="text-2xl mb-1">λ</div>
                  <div className="text-xs">Lambda</div>
                </div>
                <div className="flex-1 bg-slate-800 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Environment Variables (process.env / os.environ)</div>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2 bg-slate-700/50 rounded p-2 animate-pulse">
                      <span className="text-blue-400">DB_HOST</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-green-400">rds.example.com</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-700/50 rounded p-2">
                      <span className="text-blue-400">TABLE_NAME</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-green-400">users-prod</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-700/50 rounded p-2">
                      <span className="text-blue-400">LOG_LEVEL</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-green-400">INFO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Encryption */}
          {step === 1 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Encryption at Rest</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-slate-800 rounded p-3 border-2 border-slate-600">
                  <div className="text-xs text-slate-400 mb-2">AWS Managed Key (Default)</div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">DB_HOST=***</span>
                      <span className="text-yellow-400">🔐</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">TABLE=***</span>
                      <span className="text-yellow-400">🔐</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Automatic, no config needed</div>
                </div>
                <div className={`bg-slate-800 rounded p-3 border-2 transition-all ${encrypted ? "border-green-500" : "border-slate-600"}`}>
                  <div className="text-xs text-slate-400 mb-2">Customer Managed KMS Key</div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">DB_HOST=***</span>
                      <span className="text-green-400 animate-pulse">🔐🔑</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">TABLE=***</span>
                      <span className="text-green-400 animate-pulse">🔐🔑</span>
                    </div>
                  </div>
                  <div className="text-xs text-green-400 mt-2">More control, audit via CloudTrail</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Best Practices */}
          {step === 2 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Best Practices: Config vs Secrets</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-green-500/20 border border-green-500 rounded p-3">
                  <div className="text-green-400 font-medium text-sm mb-2">✓ Store in Env Vars</div>
                  <div className="space-y-1 font-mono text-xs text-slate-300">
                    <div>TABLE_NAME=users</div>
                    <div>LOG_LEVEL=INFO</div>
                    <div>REGION=us-east-1</div>
                    <div>FEATURE_FLAG=true</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Non-sensitive config</div>
                </div>
                <div className="bg-red-500/20 border border-red-500 rounded p-3">
                  <div className="text-red-400 font-medium text-sm mb-2">✗ DON&apos;T Store Here</div>
                  <div className="space-y-1 font-mono text-xs text-red-300 line-through opacity-70">
                    <div>API_KEY=sk-xxxx</div>
                    <div>DB_PASSWORD=secret</div>
                    <div>JWT_SECRET=token</div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2 animate-pulse">Use Secrets Manager!</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Limits */}
          {step === 3 && (
            <div className="absolute inset-4">
              <div className="text-xs text-slate-400 mb-3">Environment Variable Limits</div>
              <div className="space-y-4">
                <div className="bg-slate-800 rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Total Size Limit</span>
                    <span className="text-xl font-bold text-blue-400">4 KB</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">All variables combined must fit in 4KB</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded p-3">
                    <div className="text-yellow-400 text-sm mb-1">Case Sensitive</div>
                    <div className="font-mono text-xs">
                      <div className="text-green-400">DB_HOST ≠ db_host</div>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded p-3">
                    <div className="text-yellow-400 text-sm mb-1">Reserved Names</div>
                    <div className="font-mono text-xs text-slate-400">
                      AWS_*, LAMBDA_* reserved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
