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

// 4. Kinesis Firehose Explainer
export function KinesisFirehoseExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [destination, setDestination] = useState<"s3" | "redshift" | "opensearch">("s3")

  const steps = [
    { title: "Kinesis Data Firehose", description: "Fully managed service to load streaming data into data stores" },
    { title: "Destinations", description: "S3, Redshift, OpenSearch, Splunk, or custom HTTP endpoints" },
    { title: "Transformations", description: "Transform data with Lambda before delivery" },
    { title: "Buffering", description: "Buffer by size (1-128 MB) or time (60-900 seconds)" },
    { title: "Automatic Scaling", description: "No shards to manage - fully serverless" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const destinations = {
    s3: { icon: "📦", name: "S3", color: "green" },
    redshift: { icon: "🗄️", name: "Redshift", color: "purple" },
    opensearch: { icon: "🔍", name: "OpenSearch", color: "yellow" }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Kinesis Data Firehose</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {Object.entries(destinations).map(([key, dest]) => (
          <button
            key={key}
            onClick={() => setDestination(key as typeof destination)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              destination === key ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{dest.icon}</span> {dest.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">📡</span>
            </div>
            <span className="text-xs text-gray-400">Sources</span>
          </div>

          <div className="text-gray-500">→</div>

          <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl">🔥</span>
              <div className="text-xs text-white">Firehose</div>
            </div>
          </div>

          <div className="text-gray-500">→</div>

          <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">λ</span>
          </div>
          <div className="text-xs text-gray-400 -ml-2">Transform</div>

          <div className="text-gray-500">→</div>

          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{destinations[destination].icon}</span>
          </div>
          <div className="text-xs text-gray-400 -ml-2">{destinations[destination].name}</div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-gray-400">Buffer Size</div>
            <div className="text-white font-semibold">1-128 MB</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-gray-400">Buffer Interval</div>
            <div className="text-white font-semibold">60-900 sec</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-gray-400">Scaling</div>
            <div className="text-green-400 font-semibold">Automatic</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Near real-time: minimum 60-second buffer</li>
          <li>• No shards to manage - fully managed scaling</li>
          <li>• Lambda can transform data before delivery</li>
          <li>• Supports compression (GZIP, Snappy) and encryption</li>
        </ul>
      </div>
    </div>
  )
}

// 5. Kinesis Data Analytics Explainer
export function KinesisAnalyticsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Kinesis Data Analytics", description: "Real-time analytics on streaming data using SQL or Apache Flink" },
    { title: "SQL Applications", description: "Write SQL queries against streaming data" },
    { title: "Flink Applications", description: "Apache Flink for complex stream processing" },
    { title: "Reference Data", description: "Enrich streams with static reference data from S3" },
    { title: "Outputs", description: "Send results to Kinesis streams, Firehose, or Lambda" }
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
        <Activity className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Kinesis Data Analytics</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">🌊</span>
            </div>
            <span className="text-xs text-gray-400">Kinesis Stream</span>
          </div>

          <div className="text-gray-500">→</div>

          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
            <div className="text-center text-blue-400 font-semibold mb-2">Analytics App</div>
            <div className="bg-gray-900 rounded p-2 font-mono text-xs text-green-400">
              SELECT stream, COUNT(*) as cnt<br />
              FROM SOURCE_SQL_STREAM<br />
              GROUP BY stream, TUMBLE(...)
            </div>
          </div>

          <div className="text-gray-500">→</div>

          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">SQL Applications</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Time-based windows (TUMBLE, HOP)</li>
              <li>• Aggregations and filtering</li>
              <li>• Easy to get started</li>
            </ul>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-purple-400 mb-2">Flink Applications</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Complex event processing</li>
              <li>• Custom operators</li>
              <li>• More control and flexibility</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• SQL: simpler, good for basic analytics</li>
          <li>• Flink: more powerful, complex processing</li>
          <li>• Reference data from S3 for enrichment</li>
          <li>• Automatic scaling based on throughput</li>
        </ul>
      </div>
    </div>
  )
}

// 6. Enhanced Fan-Out Explainer
export function EnhancedFanOutExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState<"standard" | "enhanced">("standard")

  const steps = [
    { title: "Enhanced Fan-Out", description: "Dedicated throughput for each consumer application" },
    { title: "Standard Consumers", description: "Share 2 MB/s per shard across all consumers" },
    { title: "Enhanced Consumers", description: "Each gets dedicated 2 MB/s per shard" },
    { title: "Push Model", description: "Data pushed to consumers via HTTP/2" },
    { title: "Use Case", description: "Multiple consumers needing low latency and high throughput" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const consumers = ["Consumer A", "Consumer B", "Consumer C"]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Enhanced Fan-Out</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("standard")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === "standard" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Standard (Shared)
        </button>
        <button
          onClick={() => setMode("enhanced")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === "enhanced" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Enhanced Fan-Out
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center">
          <div className="text-center mr-8">
            <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <div className="text-center">
                <span className="text-2xl">🌊</span>
                <div className="text-xs text-white">Stream</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">2 MB/s read/shard</div>
          </div>

          <div className="flex flex-col gap-4">
            {consumers.map((consumer, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-32 h-1 ${mode === "enhanced" ? "bg-green-500" : "bg-yellow-500"}`} />
                <div className={`px-4 py-2 rounded-lg ${mode === "enhanced" ? "bg-green-900/30 border border-green-500" : "bg-gray-700"}`}>
                  <div className="text-sm text-white">{consumer}</div>
                  <div className={`text-xs ${mode === "enhanced" ? "text-green-400" : "text-yellow-400"}`}>
                    {mode === "enhanced" ? "2 MB/s dedicated" : "~0.67 MB/s shared"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${mode === "standard" ? "bg-yellow-900/30 border border-yellow-500" : "bg-gray-700"}`}>
            <div className="text-sm font-semibold text-yellow-400 mb-2">Standard</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Pull model (GetRecords API)</li>
              <li>• 2 MB/s shared across consumers</li>
              <li>• ~200ms latency</li>
              <li>• Lower cost</li>
            </ul>
          </div>
          <div className={`p-4 rounded-lg ${mode === "enhanced" ? "bg-green-900/30 border border-green-500" : "bg-gray-700"}`}>
            <div className="text-sm font-semibold text-green-400 mb-2">Enhanced Fan-Out</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Push model (SubscribeToShard)</li>
              <li>• 2 MB/s dedicated per consumer</li>
              <li>• ~70ms latency</li>
              <li>• Higher cost</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Enhanced: dedicated 2 MB/s per consumer per shard</li>
          <li>• Uses HTTP/2 push model (SubscribeToShard API)</li>
          <li>• ~70ms latency vs ~200ms for standard</li>
          <li>• Up to 20 enhanced consumers per stream</li>
        </ul>
      </div>
    </div>
  )
}

// 7. Step Functions Error Handling Explainer
export function StepFunctionsErrorHandlingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorType, setErrorType] = useState<"retry" | "catch">("retry")

  const steps = [
    { title: "Error Handling", description: "Build resilient workflows with Retry and Catch" },
    { title: "Retry", description: "Automatically retry failed states with backoff" },
    { title: "Catch", description: "Handle errors and transition to fallback states" },
    { title: "Error Types", description: "States.ALL, States.Timeout, States.TaskFailed, custom" },
    { title: "Best Practice", description: "Use Retry for transient errors, Catch for business logic" }
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
        <Workflow className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Step Functions Error Handling</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setErrorType("retry")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            errorType === "retry" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Retry Pattern
        </button>
        <button
          onClick={() => setErrorType("catch")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            errorType === "catch" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Catch Pattern
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {errorType === "retry" ? (
          <div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`"ProcessPayment": {
  "Type": "Task",
  "Resource": "arn:aws:lambda:...",
  "Retry": [{
    "ErrorEquals": ["States.Timeout", "PaymentError"],
    "IntervalSeconds": 2,
    "MaxAttempts": 3,
    "BackoffRate": 2.0
  }]
}`}
              </pre>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className="text-center">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    attempt < 3 ? "bg-red-600" : "bg-green-600"
                  }`}>
                    {attempt < 3 ? "❌" : "✓"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Attempt {attempt}
                    {attempt < 3 && <br />}
                    {attempt === 1 && "2s wait"}
                    {attempt === 2 && "4s wait"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-xs font-mono text-red-400 overflow-auto">
{`"ProcessPayment": {
  "Type": "Task",
  "Resource": "arn:aws:lambda:...",
  "Catch": [{
    "ErrorEquals": ["PaymentDeclined"],
    "Next": "NotifyCustomer"
  }, {
    "ErrorEquals": ["States.ALL"],
    "Next": "HandleError"
  }]
}`}
              </pre>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="w-24 bg-blue-600 rounded-lg p-3 text-center">
                <span className="text-xl">💳</span>
                <div className="text-xs text-white">Process Payment</div>
              </div>
              <div className="text-gray-500">→ ❌ →</div>
              <div className="flex flex-col gap-2">
                <div className="w-24 bg-yellow-600 rounded-lg p-2 text-center">
                  <div className="text-xs text-white">Notify Customer</div>
                </div>
                <div className="w-24 bg-red-600 rounded-lg p-2 text-center">
                  <div className="text-xs text-white">Handle Error</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Retry: IntervalSeconds, MaxAttempts, BackoffRate</li>
          <li>• Catch: ErrorEquals array, Next state, ResultPath</li>
          <li>• States.ALL catches any error type</li>
          <li>• Retry executes before Catch</li>
        </ul>
      </div>
    </div>
  )
}

// 8. Step Functions Parallel State Explainer
export function StepFunctionsParallelExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [branchStatus, setBranchStatus] = useState([0, 0, 0])

  const steps = [
    { title: "Parallel State", description: "Execute multiple branches concurrently" },
    { title: "Branches", description: "Each branch is an independent chain of states" },
    { title: "Output", description: "Returns array of outputs from all branches" },
    { title: "Error Handling", description: "If any branch fails, entire Parallel fails" },
    { title: "Use Cases", description: "Fan-out processing, parallel API calls, batch operations" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    setBranchStatus([0, 0, 0])
    const intervals = [1000, 1500, 2000]
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setBranchStatus(prev => {
        const newStatus = [...prev]
        newStatus[i] = 1
        return newStatus
      }), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Step Functions Parallel State</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-24 bg-blue-600 rounded-lg p-3 text-center mb-4">
            <span className="text-white text-sm">Start</span>
          </div>

          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4 w-full mb-4">
            <div className="text-purple-400 text-sm font-semibold text-center mb-4">Parallel State</div>
            <div className="flex justify-center gap-4">
              {["Process Order", "Send Email", "Update Inventory"].map((task, i) => (
                <div key={i} className={`w-32 rounded-lg p-3 text-center transition-all ${
                  branchStatus[i] ? "bg-green-600" : "bg-gray-700"
                }`}>
                  <div className="text-2xl mb-1">{branchStatus[i] ? "✓" : "⏳"}</div>
                  <div className="text-xs text-white">{task}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-24 bg-green-600 rounded-lg p-3 text-center">
            <span className="text-white text-sm">End</span>
          </div>
        </div>

        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Output Array</div>
          <pre className="text-xs font-mono text-green-400">
{`[
  { "orderId": "123", "status": "processed" },
  { "emailSent": true },
  { "inventoryUpdated": true }
]`}
          </pre>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• All branches execute concurrently</li>
          <li>• Output is array of all branch outputs</li>
          <li>• If one branch fails, entire Parallel state fails</li>
          <li>• Can add Catch at Parallel level for error handling</li>
        </ul>
      </div>
    </div>
  )
}

// 9. Step Functions Choice State Explainer
export function StepFunctionsChoiceExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [orderValue, setOrderValue] = useState(150)

  const steps = [
    { title: "Choice State", description: "Add conditional branching to your workflow" },
    { title: "Comparison Operators", description: "StringEquals, NumericGreaterThan, BooleanEquals, etc." },
    { title: "Variable Path", description: "Reference input data using JSONPath ($.field)" },
    { title: "Default", description: "Fallback path if no conditions match" },
    { title: "Complex Logic", description: "Combine conditions with And, Or, Not" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const getPath = () => {
    if (orderValue >= 500) return "premium"
    if (orderValue >= 100) return "standard"
    return "basic"
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Step Functions Choice State</h2>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Order Value: ${orderValue}
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          value={orderValue}
          onChange={(e) => setOrderValue(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-32 bg-yellow-600 rounded-lg p-3 text-center mb-4">
            <span className="text-white text-sm">Check Order</span>
            <div className="text-xs text-yellow-200">Choice State</div>
          </div>

          <div className="flex gap-8">
            {[
              { path: "premium", label: "Premium", condition: "≥ $500", color: "purple" },
              { path: "standard", label: "Standard", condition: "≥ $100", color: "blue" },
              { path: "basic", label: "Basic", condition: "Default", color: "gray" }
            ].map((option) => (
              <div key={option.path} className="text-center">
                <div className={`w-1 h-8 mx-auto ${getPath() === option.path ? "bg-green-500" : "bg-gray-600"}`} />
                <div className={`w-28 rounded-lg p-3 ${
                  getPath() === option.path
                    ? option.color === "purple" ? "bg-purple-600" :
                      option.color === "blue" ? "bg-blue-600" : "bg-gray-600"
                    : "bg-gray-700 opacity-50"
                }`}>
                  <div className="text-white text-sm">{option.label}</div>
                  <div className="text-xs text-gray-300">{option.condition}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`"CheckOrder": {
  "Type": "Choice",
  "Choices": [
    {
      "Variable": "$.orderValue",
      "NumericGreaterThanEquals": 500,
      "Next": "PremiumProcessing"
    },
    {
      "Variable": "$.orderValue",
      "NumericGreaterThanEquals": 100,
      "Next": "StandardProcessing"
    }
  ],
  "Default": "BasicProcessing"
}`}
          </pre>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Choice state does not support Retry or Catch</li>
          <li>• Conditions evaluated in order - first match wins</li>
          <li>• Always include Default for unmatched cases</li>
          <li>• Use JSONPath ($.field) to reference input data</li>
        </ul>
      </div>
    </div>
  )
}

// 10. Step Functions Map State Explainer
export function StepFunctionsMapExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [itemsProcessed, setItemsProcessed] = useState(0)

  const steps = [
    { title: "Map State", description: "Iterate over array items and process each in parallel" },
    { title: "ItemsPath", description: "JSONPath to the array in the input" },
    { title: "MaxConcurrency", description: "Limit parallel executions (0 = unlimited)" },
    { title: "Iterator", description: "State machine to run for each item" },
    { title: "Output", description: "Returns array of results from each iteration" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    setItemsProcessed(0)
    const timer = setInterval(() => {
      setItemsProcessed(prev => prev < 5 ? prev + 1 : prev)
    }, 500)
    return () => clearInterval(timer)
  }, [])

  const items = ["Order 1", "Order 2", "Order 3", "Order 4", "Order 5"]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Workflow className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Step Functions Map State</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Input Array</div>
            <div className="space-y-1">
              {items.map((item, i) => (
                <div key={i} className="text-xs text-gray-300 font-mono">{item}</div>
              ))}
            </div>
          </div>

          <div className="text-gray-500">→</div>

          <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
            <div className="text-cyan-400 text-sm font-semibold text-center mb-4">Map State</div>
            <div className="grid grid-cols-5 gap-2">
              {items.map((_, i) => (
                <div key={i} className={`w-12 h-12 rounded flex items-center justify-center ${
                  i < itemsProcessed ? "bg-green-600" : "bg-gray-700"
                }`}>
                  {i < itemsProcessed ? "✓" : "⏳"}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              {itemsProcessed}/{items.length} processed
            </div>
          </div>

          <div className="text-gray-500">→</div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Output Array</div>
            <div className="space-y-1">
              {items.slice(0, itemsProcessed).map((item, i) => (
                <div key={i} className="text-xs text-green-400 font-mono">{item}: processed</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <pre className="text-xs font-mono text-cyan-400 overflow-auto">
{`"ProcessOrders": {
  "Type": "Map",
  "ItemsPath": "$.orders",
  "MaxConcurrency": 3,
  "Iterator": {
    "StartAt": "ProcessSingleOrder",
    "States": {
      "ProcessSingleOrder": {
        "Type": "Task",
        "Resource": "arn:aws:lambda:...",
        "End": true
      }
    }
  }
}`}
          </pre>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Map iterates over arrays, Parallel has fixed branches</li>
          <li>• MaxConcurrency controls parallel execution limit</li>
          <li>• ItemsPath points to input array using JSONPath</li>
          <li>• Distributed Map mode for large-scale processing (S3 data)</li>
        </ul>
      </div>
    </div>
  )
}

// 11. Step Functions Service Integrations Explainer
export function StepFunctionsIntegrationsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState<"sync" | "async" | "callback">("sync")

  const steps = [
    { title: "Service Integrations", description: "200+ AWS service integrations built into Step Functions" },
    { title: "Request-Response", description: "Call service and wait for response" },
    { title: "Run a Job (.sync)", description: "Wait for job completion (ECS, Batch, Glue)" },
    { title: "Wait for Callback", description: "Pause until external system calls back" },
    { title: "Optimized Integrations", description: "Direct service calls without Lambda" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const patterns = {
    sync: {
      name: "Request-Response",
      resource: "arn:aws:states:::dynamodb:putItem",
      description: "Call and immediately continue",
      icon: "⚡"
    },
    async: {
      name: "Run a Job (.sync)",
      resource: "arn:aws:states:::ecs:runTask.sync",
      description: "Wait for job to complete",
      icon: "⏱️"
    },
    callback: {
      name: "Wait for Callback",
      resource: "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
      description: "Pause until callback received",
      icon: "📞"
    }
  }

  const currentPattern = patterns[selectedPattern]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Workflow className="w-8 h-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Service Integrations</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {Object.entries(patterns).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => setSelectedPattern(key as typeof selectedPattern)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              selectedPattern === key ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{pattern.icon}</span> {pattern.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: "λ", name: "Lambda" },
            { icon: "📊", name: "DynamoDB" },
            { icon: "📬", name: "SQS" },
            { icon: "🐳", name: "ECS" },
            { icon: "📦", name: "S3" },
            { icon: "🔔", name: "SNS" },
            { icon: "🤖", name: "SageMaker" },
            { icon: "⚙️", name: "Batch" }
          ].map((service, i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-3 text-center">
              <span className="text-2xl">{service.icon}</span>
              <div className="text-xs text-gray-300 mt-1">{service.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">{currentPattern.description}</div>
          <pre className="text-xs font-mono text-indigo-400 overflow-auto">
{`"CallService": {
  "Type": "Task",
  "Resource": "${currentPattern.resource}",
  "Parameters": {
    "TableName": "Orders",
    "Item": { ... }
  }
}`}
          </pre>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30">
        <h3 className="text-lg font-semibold text-indigo-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• .sync waits for job completion (ECS, Batch, Glue, EMR)</li>
          <li>• .waitForTaskToken pauses until external callback</li>
          <li>• Optimized integrations: Lambda, DynamoDB, SQS, SNS, etc.</li>
          <li>• No Lambda needed for many service calls</li>
        </ul>
      </div>
    </div>
  )
}

// 12. Kinesis Client Library (KCL) Explainer
export function KinesisKCLExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Kinesis Client Library", description: "Java library for building Kinesis consumer applications" },
    { title: "Checkpointing", description: "Track processing progress in DynamoDB" },
    { title: "Shard Assignment", description: "Automatically distributes shards across workers" },
    { title: "Resharding", description: "Handles shard splits and merges automatically" },
    { title: "Multi-Language", description: "KCL also supports Python, Node.js, Ruby via MultiLangDaemon" }
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
        <Activity className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-bold text-white">Kinesis Client Library (KCL)</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">🌊</span>
            </div>
            <span className="text-xs text-gray-400">Kinesis Stream</span>
            <div className="text-xs text-gray-500">4 shards</div>
          </div>

          <div className="text-gray-500">→</div>

          <div className="bg-teal-900/30 border-2 border-teal-500 rounded-lg p-4">
            <div className="text-teal-400 text-sm font-semibold text-center mb-4">KCL Application</div>
            <div className="grid grid-cols-2 gap-3">
              {["Worker 1", "Worker 2"].map((worker, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-white font-semibold">{worker}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Shards: {i === 0 ? "0, 1" : "2, 3"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-gray-500">↔</div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-xs text-gray-400">DynamoDB</span>
            <div className="text-xs text-gray-500">Checkpoints</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-teal-400 mb-2">Checkpointing</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Stores sequence numbers</li>
              <li>• Resume from last position</li>
              <li>• Prevents reprocessing</li>
            </ul>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">Shard Assignment</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Automatic distribution</li>
              <li>• Worker failure handling</li>
              <li>• Load balancing</li>
            </ul>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-purple-400 mb-2">Resharding</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Handles shard splits</li>
              <li>• Handles shard merges</li>
              <li>• Automatic rebalancing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-xl p-4 border border-teal-500/30">
        <h3 className="text-lg font-semibold text-teal-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• KCL uses DynamoDB table for checkpointing</li>
          <li>• One record processor per shard</li>
          <li>• Workers can handle multiple shards</li>
          <li>• Alternative: Lambda consumer (simpler but less control)</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const kinesisStepfunctionsExplainers = {
  "kinesis-data-streams": KinesisDataStreamsExplainer,
  "step-functions-state-machine": StepFunctionsStateMachineExplainer,
  "streaming-comparison": StreamingComparisonExplainer,
  "kinesis-firehose": KinesisFirehoseExplainer,
  "kinesis-analytics": KinesisAnalyticsExplainer,
  "enhanced-fan-out": EnhancedFanOutExplainer,
  "step-functions-error-handling": StepFunctionsErrorHandlingExplainer,
  "step-functions-parallel": StepFunctionsParallelExplainer,
  "step-functions-choice": StepFunctionsChoiceExplainer,
  "step-functions-map": StepFunctionsMapExplainer,
  "step-functions-integrations": StepFunctionsIntegrationsExplainer,
  "kinesis-kcl": KinesisKCLExplainer,
}
