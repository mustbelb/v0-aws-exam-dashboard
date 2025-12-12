"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Workflow, Activity, GitBranch } from "lucide-react"

// 1. Kinesis Data Streams Explainer (Rich)
export function KinesisDataStreamsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shardCount, setShardCount] = useState(2)
  const [throughput, setThroughput] = useState(1000)

  const steps = [
    { title: "Kinesis Data Streams", description: "Real-time data streaming service for high-throughput data ingestion" },
    { title: "Shards", description: "Base throughput unit - 1MB/s write, 2MB/s read per shard" },
    { title: "Partition Keys", description: "Determine which shard receives each record for ordering" },
    { title: "Consumers", description: "KCL, Lambda, or custom - each reads from shards independently" },
    { title: "Retention", description: "24 hours default, up to 365 days with extended retention" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const maxThroughput = shardCount * 1000 // 1MB/s ≈ 1000 records/s

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Kinesis Data Streams</h2>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Shards: {shardCount}
          </label>
          <input
            type="range"
            min="1"
            max="8"
            value={shardCount}
            onChange={(e) => setShardCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Incoming: {throughput} records/s
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            value={throughput}
            onChange={(e) => setThroughput(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Producers */}
          <div className="text-center">
            <div className="flex flex-col gap-2 mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📱</span>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">🖥️</span>
              </div>
            </div>
            <span className="text-sm text-gray-400">Producers</span>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-gray-500">→</div>

          {/* Kinesis Stream */}
          <div className="flex-1 mx-4">
            <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
              <div className="text-center text-orange-400 font-semibold mb-4">
                Kinesis Stream
              </div>
              {/* Shards */}
              <div className="space-y-2">
                {Array.from({ length: shardCount }).map((_, i) => {
                  const shardLoad = Math.min(100, (throughput / maxThroughput) * 100)
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">Shard {i}</span>
                      <div className="flex-1 h-4 bg-gray-700 rounded overflow-hidden">
                        <div
                          className={`h-full rounded transition-all ${
                            shardLoad > 80 ? "bg-red-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${shardLoad}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              {throughput > maxThroughput && (
                <div className="mt-2 text-xs text-red-400 text-center">
                  ⚠️ Exceeds capacity! Add shards or enable enhanced fan-out
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-gray-500">→</div>

          {/* Consumers */}
          <div className="text-center">
            <div className="flex flex-col gap-2 mb-2">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white">λ</span>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📊</span>
              </div>
            </div>
            <span className="text-sm text-gray-400">Consumers</span>
          </div>
        </div>

        {/* Capacity Info */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-gray-400">Write Capacity</div>
            <div className="text-white font-semibold">{shardCount} MB/s</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-gray-400">Read Capacity</div>
            <div className="text-white font-semibold">{shardCount * 2} MB/s</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-gray-400">Status</div>
            <div className={`font-semibold ${throughput > maxThroughput ? "text-red-400" : "text-green-400"}`}>
              {throughput > maxThroughput ? "Over Capacity" : "Healthy"}
            </div>
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
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Each shard: 1 MB/s write, 2 MB/s read</li>
          <li>• Partition key determines shard (ordering within shard)</li>
          <li>• Enhanced fan-out: dedicated 2 MB/s per consumer</li>
          <li>• Kinesis vs SQS: ordering, multiple consumers, replay</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Step Functions State Machine Explainer (Rich)
export function StepFunctionsStateMachineExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentState, setCurrentState] = useState(0)
  const [workflowRunning, setWorkflowRunning] = useState(false)

  const steps = [
    { title: "Step Functions", description: "Serverless orchestration service for coordinating distributed applications" },
    { title: "States", description: "Task, Choice, Parallel, Wait, Pass, Succeed, Fail" },
    { title: "Standard vs Express", description: "Standard for long-running, Express for high-volume short-duration" },
    { title: "Error Handling", description: "Retry and Catch for resilient workflows" },
    { title: "Integrations", description: "200+ AWS service integrations (Lambda, DynamoDB, SQS, etc.)" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const workflowStates = [
    { name: "ValidateOrder", type: "Task", icon: "✓" },
    { name: "CheckInventory", type: "Task", icon: "📦" },
    { name: "InStock?", type: "Choice", icon: "❓" },
    { name: "ProcessPayment", type: "Task", icon: "💳" },
    { name: "SendConfirmation", type: "Task", icon: "📧" }
  ]

  useEffect(() => {
    if (workflowRunning && currentState < workflowStates.length - 1) {
      const timer = setTimeout(() => setCurrentState(s => s + 1), 1500)
      return () => clearTimeout(timer)
    } else if (currentState >= workflowStates.length - 1) {
      setWorkflowRunning(false)
    }
  }, [workflowRunning, currentState, workflowStates.length])

  const startWorkflow = () => {
    setCurrentState(0)
    setWorkflowRunning(true)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Workflow className="w-8 h-8 text-pink-400" />
        <h2 className="text-2xl font-bold text-white">Step Functions State Machine</h2>
      </div>

      {/* Run Workflow Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={startWorkflow}
          disabled={workflowRunning}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            workflowRunning
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-pink-600 text-white hover:bg-pink-500"
          }`}
        >
          {workflowRunning ? "Running..." : "▶ Start Execution"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* State Machine Diagram */}
        <div className="flex flex-col items-center space-y-4">
          {workflowStates.map((state, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-48 p-4 rounded-lg border-2 transition-all ${
                i === currentState && workflowRunning
                  ? "border-pink-500 bg-pink-900/30 animate-pulse"
                  : i < currentState
                  ? "border-green-500 bg-green-900/30"
                  : "border-gray-600 bg-gray-700"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{state.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{state.name}</div>
                    <div className={`text-xs ${
                      state.type === "Task" ? "text-blue-400" :
                      state.type === "Choice" ? "text-yellow-400" : "text-gray-400"
                    }`}>
                      {state.type}
                    </div>
                  </div>
                </div>
              </div>
              {i < workflowStates.length - 1 && (
                <div className={`w-0.5 h-8 ${
                  i < currentState ? "bg-green-500" : "bg-gray-600"
                }`} style={{ position: 'absolute', marginTop: '80px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Execution Status */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4 text-center">
          <div className={`text-lg font-semibold ${
            currentState >= workflowStates.length - 1 && !workflowRunning
              ? "text-green-400"
              : workflowRunning
              ? "text-yellow-400"
              : "text-gray-400"
          }`}>
            {currentState >= workflowStates.length - 1 && !workflowRunning
              ? "✓ Execution Succeeded"
              : workflowRunning
              ? `Running: ${workflowStates[currentState].name}`
              : "Ready to Execute"
            }
          </div>
        </div>
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
          <li>• Standard: long-running (up to 1 year), exactly-once execution</li>
          <li>• Express: high-volume, short duration (&lt;5 min), at-least-once</li>
          <li>• Use Retry for transient errors, Catch for handling failures</li>
          <li>• Choice state for conditional branching, Parallel for concurrent</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Kinesis vs SQS vs SNS Comparison Explainer (Medium)
export function StreamingComparisonExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedService, setSelectedService] = useState<"kinesis" | "sqs" | "sns">("kinesis")

  const steps = [
    { title: "Messaging Services", description: "Different services for different messaging patterns" },
    { title: "Kinesis", description: "Real-time streaming with ordering, replay, and multiple consumers" },
    { title: "SQS", description: "Decoupled async messaging with guaranteed delivery" },
    { title: "SNS", description: "Pub/sub fan-out to multiple subscribers" },
    { title: "Choosing the Right Service", description: "Match service to use case requirements" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const services = {
    kinesis: {
      name: "Kinesis Data Streams",
      icon: "🌊",
      color: "orange",
      features: [
        { name: "Real-time", value: "✓ Millisecond latency" },
        { name: "Ordering", value: "✓ Per-partition key" },
        { name: "Replay", value: "✓ Up to 365 days" },
        { name: "Consumers", value: "Multiple parallel" },
        { name: "Scaling", value: "Manual (shards)" }
      ],
      useCases: "Log aggregation, real-time analytics, clickstream"
    },
    sqs: {
      name: "SQS",
      icon: "📬",
      color: "purple",
      features: [
        { name: "Latency", value: "Seconds to minutes" },
        { name: "Ordering", value: "✓ FIFO only" },
        { name: "Replay", value: "✗ Deleted after read" },
        { name: "Consumers", value: "Single (per message)" },
        { name: "Scaling", value: "Automatic" }
      ],
      useCases: "Job queues, decoupling, async processing"
    },
    sns: {
      name: "SNS",
      icon: "📢",
      color: "red",
      features: [
        { name: "Delivery", value: "Push to subscribers" },
        { name: "Ordering", value: "✓ FIFO topics" },
        { name: "Persistence", value: "✗ No retention" },
        { name: "Subscribers", value: "Multiple (fan-out)" },
        { name: "Protocols", value: "Email, SMS, HTTP, SQS" }
      ],
      useCases: "Notifications, fan-out, alerts"
    }
  }

  const currentService = services[selectedService]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Kinesis vs SQS vs SNS</h2>
      </div>

      {/* Service Selector */}
      <div className="flex gap-2 mb-6">
        {Object.entries(services).map(([key, service]) => (
          <button
            key={key}
            onClick={() => setSelectedService(key as typeof selectedService)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              selectedService === key
                ? key === "kinesis" ? "bg-orange-600 text-white" :
                  key === "sqs" ? "bg-purple-600 text-white" :
                  "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{service.icon}</span>
            {service.name}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* Service Diagram */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <span className="text-3xl">📱</span>
            </div>
            <span className="text-xs text-gray-400">Producer</span>
          </div>

          <div className="text-2xl text-gray-500 mx-4">→</div>

          <div className={`w-32 h-32 rounded-lg flex flex-col items-center justify-center ${
            selectedService === "kinesis" ? "bg-orange-600" :
            selectedService === "sqs" ? "bg-purple-600" : "bg-red-600"
          }`}>
            <span className="text-4xl">{currentService.icon}</span>
            <span className="text-white text-xs mt-2">{currentService.name}</span>
          </div>

          <div className="text-2xl text-gray-500 mx-4">→</div>

          <div className="text-center">
            {selectedService === "sns" ? (
              <div className="flex flex-col gap-2">
                {["📧", "📱", "λ"].map((icon, i) => (
                  <div key={i} className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{icon}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-3xl">λ</span>
              </div>
            )}
            <span className="text-xs text-gray-400">Consumer(s)</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-3">Features</div>
            <div className="space-y-2">
              {currentService.features.map((feature, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-400">{feature.name}</span>
                  <span className={feature.value.startsWith("✓") ? "text-green-400" : feature.value.startsWith("✗") ? "text-red-400" : "text-white"}>
                    {feature.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-3">Use Cases</div>
            <div className="text-sm text-gray-300">{currentService.useCases}</div>
          </div>
        </div>
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
          <li>• Kinesis: real-time streaming, ordering, replay capability</li>
          <li>• SQS: decoupling, guaranteed delivery, automatic scaling</li>
          <li>• SNS: fan-out, push-based, multiple subscriber types</li>
          <li>• SNS + SQS = fan-out pattern with guaranteed delivery</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const kinesisStepfunctionsExplainers = {
  "kinesis-data-streams": KinesisDataStreamsExplainer,
  "step-functions-state-machine": StepFunctionsStateMachineExplainer,
  "streaming-comparison": StreamingComparisonExplainer
}
