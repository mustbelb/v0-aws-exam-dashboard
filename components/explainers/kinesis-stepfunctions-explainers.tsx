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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌊</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">Kinesis Data Streams</h3>
              <p className="text-gray-300">High-throughput, low-latency streaming data service</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-orange-400 font-semibold">Real-time</div>
                <div className="text-gray-400">Millisecond latency</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-orange-400 font-semibold">Scalable</div>
                <div className="text-gray-400">GB/s throughput</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-orange-400 font-semibold">Replayable</div>
                <div className="text-gray-400">Up to 365 days</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Shards: Base Throughput Units</h3>
            </div>
            <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-6">
              <div className="space-y-4">
                {Array.from({ length: shardCount }).map((_, i) => {
                  const shardLoad = Math.min(100, (throughput / maxThroughput) * 100)
                  return (
                    <div key={i} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Shard {i}</span>
                        <span className="text-xs text-gray-400">{shardLoad.toFixed(0)}% utilized</span>
                      </div>
                      <div className="h-6 bg-gray-600 rounded overflow-hidden mb-2">
                        <div
                          className={`h-full rounded transition-all ${
                            shardLoad > 80 ? "bg-red-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${shardLoad}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>Write: 1 MB/s</div>
                        <div>Read: 2 MB/s</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {throughput > maxThroughput && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-sm text-center">
                  ⚠️ Exceeds capacity! Add more shards to handle this load
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Partition Keys Determine Shard Assignment</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                    <div className="text-blue-400 font-semibold mb-1">Record 1</div>
                    <div className="text-sm text-gray-400">Partition Key: "user-123"</div>
                    <div className="text-xs text-gray-500 mt-1">→ Hash determines shard</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                    <div className="text-blue-400 font-semibold mb-1">Record 2</div>
                    <div className="text-sm text-gray-400">Partition Key: "user-456"</div>
                    <div className="text-xs text-gray-500 mt-1">→ Hash determines shard</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                    <div className="text-blue-400 font-semibold mb-1">Record 3</div>
                    <div className="text-sm text-gray-400">Partition Key: "user-123"</div>
                    <div className="text-xs text-gray-500 mt-1">→ Same key = same shard</div>
                  </div>
                </div>
              </div>
              <div className="px-6 text-3xl text-gray-500">→</div>
              <div className="flex-1">
                <div className="space-y-3">
                  {Array.from({ length: Math.min(3, shardCount) }).map((_, i) => (
                    <div key={i} className="bg-orange-900/30 border border-orange-500 rounded-lg p-4 text-center">
                      <div className="text-orange-400 font-semibold">Shard {i}</div>
                      <div className="text-xs text-gray-400 mt-1">Maintains ordering per key</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              💡 Records with the same partition key always go to the same shard (ordering guarantee)
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Multiple Independent Consumers</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
                  <div className="text-center text-orange-400 font-semibold mb-4">Kinesis Stream</div>
                  <div className="space-y-2">
                    {Array.from({ length: shardCount }).map((_, i) => (
                      <div key={i} className="bg-gray-700 rounded p-2 text-center text-white text-sm">
                        Shard {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 text-3xl text-gray-500">→</div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">λ</span>
                      <div>
                        <div className="text-green-400 font-semibold">Lambda Consumer</div>
                        <div className="text-xs text-gray-400">Real-time processing</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      <div>
                        <div className="text-green-400 font-semibold">Analytics App</div>
                        <div className="text-xs text-gray-400">KCL consumer</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💾</span>
                      <div>
                        <div className="text-green-400 font-semibold">Archiver</div>
                        <div className="text-xs text-gray-400">Firehose to S3</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              💡 Each consumer reads independently - all can process the same data
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Data Retention & Replay</h3>
            </div>
            <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-6">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📅</div>
                  <div className="text-white font-semibold">24 Hours</div>
                  <div className="text-sm text-gray-400">Default retention</div>
                </div>
                <div className="text-3xl text-gray-500">→</div>
                <div className="text-center">
                  <div className="text-4xl mb-2">📅📅📅</div>
                  <div className="text-white font-semibold">Up to 365 Days</div>
                  <div className="text-sm text-gray-400">Extended retention</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-white font-semibold mb-2">🔄 Replay Capability</div>
                  <div className="text-sm text-gray-400">Consumers can replay data from any point in retention window</div>
                </div>
                <div className="h-12 bg-gray-600 rounded-lg flex items-center px-4">
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-gray-400">7 days ago</span>
                    <span className="text-xs text-gray-400">Now</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-900/30 border border-blue-500 rounded p-2 text-center text-blue-400">
                    Consumer A reading from beginning
                  </div>
                  <div className="bg-green-900/30 border border-green-500 rounded p-2 text-center text-green-400">
                    Consumer B reading from 2 days ago
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              💡 Unlike SQS, Kinesis allows multiple consumers to independently replay the same data
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold text-pink-400 mb-2">AWS Step Functions</h3>
              <p className="text-gray-300">Serverless workflow orchestration for distributed applications</p>
            </div>
            <div className="bg-pink-900/30 border-2 border-pink-500 rounded-lg p-6">
              <div className="flex flex-col items-center space-y-4">
                {workflowStates.map((state, i) => (
                  <div key={i} className="flex items-center gap-4 w-full max-w-md">
                    <div className="flex-1 p-4 rounded-lg border-2 border-gray-600 bg-gray-700">
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
                      <div className="text-gray-500 text-2xl">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-pink-400 mb-4">State Types</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <div className="text-blue-400 font-semibold">Task</div>
                </div>
                <div className="text-sm text-gray-400">Execute work (Lambda, API call, etc.)</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">❓</span>
                  <div className="text-yellow-400 font-semibold">Choice</div>
                </div>
                <div className="text-sm text-gray-400">Conditional branching logic</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡⚡</span>
                  <div className="text-purple-400 font-semibold">Parallel</div>
                </div>
                <div className="text-sm text-gray-400">Execute branches concurrently</div>
              </div>
              <div className="bg-gray-700 border border-gray-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⏱️</span>
                  <div className="text-gray-400 font-semibold">Wait</div>
                </div>
                <div className="text-sm text-gray-400">Delay for specified time</div>
              </div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <div className="text-green-400 font-semibold">Succeed</div>
                </div>
                <div className="text-sm text-gray-400">Successful termination</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">❌</span>
                  <div className="text-red-400 font-semibold">Fail</div>
                </div>
                <div className="text-sm text-gray-400">Failed termination</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-pink-400 mb-4">Standard vs Express Workflows</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-900/30 border-2 border-pink-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="text-pink-400 font-bold text-lg">Standard</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Duration</div>
                    <div className="text-white font-semibold">Up to 1 year</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Execution Rate</div>
                    <div className="text-white font-semibold">2,000/sec</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Execution Model</div>
                    <div className="text-white font-semibold">Exactly-once</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Use Case</div>
                    <div className="text-white font-semibold">Long-running workflows</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-purple-400 font-bold text-lg">Express</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Duration</div>
                    <div className="text-white font-semibold">Up to 5 minutes</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Execution Rate</div>
                    <div className="text-white font-semibold">100,000+/sec</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Execution Model</div>
                    <div className="text-white font-semibold">At-least-once</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-gray-400">Use Case</div>
                    <div className="text-white font-semibold">High-volume, short tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-pink-400 mb-4">Error Handling: Retry & Catch</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔄</span>
                  <div className="text-blue-400 font-bold text-lg">Retry</div>
                </div>
                <div className="text-sm text-gray-300 mb-3">Automatic retry for transient errors</div>
                <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs text-gray-300">
                  <div>"Retry": [&#123;</div>
                  <div className="ml-4">"ErrorEquals": ["States.TaskFailed"],</div>
                  <div className="ml-4">"IntervalSeconds": 2,</div>
                  <div className="ml-4">"MaxAttempts": 3,</div>
                  <div className="ml-4">"BackoffRate": 2.0</div>
                  <div>&#125;]</div>
                </div>
              </div>
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <div className="text-red-400 font-bold text-lg">Catch</div>
                </div>
                <div className="text-sm text-gray-300 mb-3">Handle errors and transition to fallback state</div>
                <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs text-gray-300">
                  <div>"Catch": [&#123;</div>
                  <div className="ml-4">"ErrorEquals": ["CustomError"],</div>
                  <div className="ml-4">"Next": "HandleError"</div>
                  <div>&#125;]</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-pink-400 mb-4">AWS Service Integrations (200+)</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">λ</div>
                <div className="text-orange-400 font-semibold text-sm">Lambda</div>
                <div className="text-xs text-gray-400">Function execution</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">💾</div>
                <div className="text-blue-400 font-semibold text-sm">DynamoDB</div>
                <div className="text-xs text-gray-400">Direct table ops</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">📬</div>
                <div className="text-purple-400 font-semibold text-sm">SQS</div>
                <div className="text-xs text-gray-400">Queue messages</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">📢</div>
                <div className="text-red-400 font-semibold text-sm">SNS</div>
                <div className="text-xs text-gray-400">Publish messages</div>
              </div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-green-400 font-semibold text-sm">S3</div>
                <div className="text-xs text-gray-400">Object operations</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">🔧</div>
                <div className="text-yellow-400 font-semibold text-sm">ECS/Batch</div>
                <div className="text-xs text-gray-400">Container tasks</div>
              </div>
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-300 text-center">
                💡 Optimized integrations = No Lambda needed = Lower cost & latency
              </div>
            </div>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">AWS Messaging Services</h3>
              <p className="text-gray-300">Choose the right service for your messaging pattern</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4 text-center">
                <div className="text-5xl mb-3">🌊</div>
                <div className="text-orange-400 font-bold text-lg mb-2">Kinesis</div>
                <div className="text-sm text-gray-400">Real-time streaming</div>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4 text-center">
                <div className="text-5xl mb-3">📬</div>
                <div className="text-purple-400 font-bold text-lg mb-2">SQS</div>
                <div className="text-sm text-gray-400">Message queue</div>
              </div>
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-5xl mb-3">📢</div>
                <div className="text-red-400 font-bold text-lg mb-2">SNS</div>
                <div className="text-sm text-gray-400">Pub/sub fan-out</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Kinesis Data Streams</h3>
              <p className="text-gray-300">Real-time streaming with ordering and replay</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-3xl">📱</span>
                </div>
                <span className="text-xs text-gray-400">Producers</span>
              </div>
              <div className="text-2xl text-gray-500 mx-4">→</div>
              <div className="w-32 h-32 bg-orange-600 rounded-lg flex flex-col items-center justify-center">
                <span className="text-4xl">🌊</span>
                <span className="text-white text-xs mt-2">Kinesis</span>
              </div>
              <div className="text-2xl text-gray-500 mx-4">→</div>
              <div className="flex gap-2">
                {["λ", "📊", "💾"].map((icon, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Ordering per partition key</div>
                <div className="text-gray-400">Maintains order within shard</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Replay capability</div>
                <div className="text-gray-400">Up to 365 days retention</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Multiple consumers</div>
                <div className="text-gray-400">All read independently</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-orange-400 font-semibold mb-1">⚠️ Manual scaling</div>
                <div className="text-gray-400">Manage shard count</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-purple-400 mb-2">Amazon SQS</h3>
              <p className="text-gray-300">Decoupled async messaging with guaranteed delivery</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-3xl">📱</span>
                </div>
                <span className="text-xs text-gray-400">Producer</span>
              </div>
              <div className="text-2xl text-gray-500 mx-4">→</div>
              <div className="w-32 h-32 bg-purple-600 rounded-lg flex flex-col items-center justify-center">
                <span className="text-4xl">📬</span>
                <span className="text-white text-xs mt-2">SQS Queue</span>
              </div>
              <div className="text-2xl text-gray-500 mx-4">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">λ</span>
                </div>
                <span className="text-xs text-gray-400">Consumer</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Automatic scaling</div>
                <div className="text-gray-400">No capacity planning</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Guaranteed delivery</div>
                <div className="text-gray-400">At-least-once delivery</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-purple-400 font-semibold mb-1">⚠️ FIFO ordering</div>
                <div className="text-gray-400">Only in FIFO queues</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">✗ No replay</div>
                <div className="text-gray-400">Deleted after processing</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-2">Amazon SNS</h3>
              <p className="text-gray-300">Pub/sub fan-out to multiple subscribers</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-3xl">📱</span>
                </div>
                <span className="text-xs text-gray-400">Publisher</span>
              </div>
              <div className="text-2xl text-gray-500 mx-4">→</div>
              <div className="w-32 h-32 bg-red-600 rounded-lg flex flex-col items-center justify-center">
                <span className="text-4xl">📢</span>
                <span className="text-white text-xs mt-2">SNS Topic</span>
              </div>
              <div className="text-2xl text-gray-500 mx-4">→</div>
              <div className="flex flex-col gap-2">
                {[{icon: "📧", label: "Email"}, {icon: "📱", label: "SMS"}, {icon: "λ", label: "Lambda"}, {icon: "📬", label: "SQS"}].map((sub, i) => (
                  <div key={i} className="flex items-center gap-2 bg-green-900/30 border border-green-500 rounded-lg p-2">
                    <span className="text-xl">{sub.icon}</span>
                    <span className="text-xs text-gray-300">{sub.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Fan-out pattern</div>
                <div className="text-gray-400">Multiple subscribers</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Push-based</div>
                <div className="text-gray-400">Delivers to subscribers</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Multiple protocols</div>
                <div className="text-gray-400">Email, SMS, HTTP, SQS, Lambda</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">✗ No persistence</div>
                <div className="text-gray-400">Fire-and-forget delivery</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Choosing the Right Service</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-orange-900/30 border-l-4 border-orange-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🌊</span>
                  <div>
                    <div className="text-orange-400 font-bold mb-1">Use Kinesis when:</div>
                    <div className="text-sm text-gray-300">
                      • Real-time analytics needed<br />
                      • Multiple consumers need same data<br />
                      • Replay capability required<br />
                      • Ordering per partition key important
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-900/30 border-l-4 border-purple-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📬</span>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">Use SQS when:</div>
                    <div className="text-sm text-gray-300">
                      • Decoupling applications<br />
                      • Job/task queues needed<br />
                      • Single consumer per message<br />
                      • Automatic scaling required
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/30 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📢</span>
                  <div>
                    <div className="text-red-400 font-bold mb-1">Use SNS when:</div>
                    <div className="text-sm text-gray-300">
                      • Fan-out to multiple subscribers<br />
                      • Push notifications needed<br />
                      • Multiple protocol support required<br />
                      • Simple pub/sub pattern
                    </div>
                  </div>
                </div>
              </div>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Kinesis Data Firehose</h3>
              <p className="text-gray-300">Fully managed ETL service for streaming data</p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📡</span>
                </div>
                <span className="text-xs text-gray-400">Data Sources</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="w-24 h-24 bg-red-600 rounded-lg flex flex-col items-center justify-center">
                <span className="text-3xl">🔥</span>
                <div className="text-xs text-white mt-1">Firehose</div>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="flex flex-col gap-2">
                {Object.entries(destinations).map(([key, dest]) => (
                  <div key={key} className="bg-green-900/30 border border-green-500 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span className="text-xl">{dest.icon}</span>
                    <span className="text-sm text-gray-300">{dest.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Fully managed</div>
                <div className="text-gray-400">No servers to manage</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Auto-scaling</div>
                <div className="text-gray-400">No capacity planning</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Supported Destinations</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">📦</span>
                  <div className="text-green-400 font-bold text-lg">Amazon S3</div>
                </div>
                <div className="text-sm text-gray-400">Data lake storage</div>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🗄️</span>
                  <div className="text-purple-400 font-bold text-lg">Redshift</div>
                </div>
                <div className="text-sm text-gray-400">Data warehouse</div>
              </div>
              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🔍</span>
                  <div className="text-yellow-400 font-bold text-lg">OpenSearch</div>
                </div>
                <div className="text-sm text-gray-400">Search & analytics</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🌐</span>
                  <div className="text-blue-400 font-bold text-lg">HTTP Endpoints</div>
                </div>
                <div className="text-sm text-gray-400">Splunk, custom APIs</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Data Transformation with Lambda</h3>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📡</span>
                </div>
                <span className="text-xs text-gray-400">Raw Data</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">λ</span>
                  <div>
                    <div className="text-yellow-400 font-bold">Transform</div>
                    <div className="text-xs text-gray-400">Optional Lambda</div>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-300">
                  <div>• Parse/filter records</div>
                  <div>• Enrich data</div>
                  <div>• Format conversion</div>
                </div>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">{destinations[destination].icon}</span>
                </div>
                <span className="text-xs text-gray-400">Destination</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Buffering Configuration</h3>
            </div>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-white font-semibold mb-2">Firehose waits until buffer condition is met</div>
                <div className="text-sm text-gray-400">Whichever comes first triggers delivery</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-white font-semibold mb-1">Buffer Size</div>
                  <div className="text-red-400 text-lg font-bold">1 - 128 MB</div>
                  <div className="text-xs text-gray-400 mt-1">Size threshold</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-white font-semibold mb-1">Buffer Interval</div>
                  <div className="text-red-400 text-lg font-bold">60 - 900 sec</div>
                  <div className="text-xs text-gray-400 mt-1">Time threshold</div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 text-center text-sm text-yellow-300">
                ⚠️ Minimum 60-second latency - NOT real-time, but near real-time
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Automatic Scaling - Fully Serverless</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🌊</div>
                  <div className="text-orange-400 font-bold">Kinesis Data Streams</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-red-400 font-semibold">✗ Manual scaling</div>
                    <div className="text-gray-400 text-xs">Manage shard count</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-red-400 font-semibold">✗ Plan capacity</div>
                    <div className="text-gray-400 text-xs">Calculate throughput needs</div>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-red-400 font-bold">Kinesis Firehose</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-green-400 font-semibold">✓ Auto-scaling</div>
                    <div className="text-gray-400 text-xs">Scales automatically</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-green-400 font-semibold">✓ Serverless</div>
                    <div className="text-gray-400 text-xs">No capacity planning</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-white font-semibold mb-2">Additional Features</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-600 rounded p-2 text-gray-300">Compression (GZIP, Snappy)</div>
                <div className="bg-gray-600 rounded p-2 text-gray-300">Encryption at rest</div>
                <div className="bg-gray-600 rounded p-2 text-gray-300">Failed records to S3</div>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Kinesis Data Analytics</h3>
              <p className="text-gray-300">Real-time stream processing with SQL or Apache Flink</p>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">🌊</span>
                </div>
                <span className="text-sm text-gray-400">Stream Input</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="w-28 h-28 bg-blue-600 rounded-lg flex flex-col items-center justify-center">
                <span className="text-3xl">📊</span>
                <span className="text-white text-xs mt-2">Analytics</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="flex flex-col gap-2">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🌊</span>
                </div>
                <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Real-time processing</div>
                <div className="text-gray-400">Sub-second latency</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-semibold mb-1">✓ Serverless</div>
                <div className="text-gray-400">Auto-scaling</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">SQL Applications</h3>
              <p className="text-gray-300">Query streaming data using standard SQL</p>
            </div>
            <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6">
              <div className="text-blue-400 font-semibold mb-3">Example: Real-time Aggregation</div>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 mb-4">
                <div>SELECT</div>
                <div className="ml-4">STREAM,</div>
                <div className="ml-4">COUNT(*) as event_count,</div>
                <div className="ml-4">AVG(value) as avg_value</div>
                <div>FROM SOURCE_SQL_STREAM</div>
                <div>GROUP BY</div>
                <div className="ml-4">STREAM,</div>
                <div className="ml-4">TUMBLE(rowtime, INTERVAL '1' MINUTE)</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-blue-400 font-semibold mb-1">Window Functions</div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• TUMBLE (fixed windows)</li>
                    <li>• HOP (sliding windows)</li>
                    <li>• SESSION (gap-based)</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-blue-400 font-semibold mb-1">Operations</div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Aggregations (COUNT, SUM, AVG)</li>
                    <li>• Filtering (WHERE)</li>
                    <li>• Joins across streams</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Apache Flink Applications</h3>
              <p className="text-gray-300">Advanced stream processing with Java/Scala</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📝</span>
                  <div className="text-blue-400 font-bold">SQL</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-green-400">✓ Easy to learn</div>
                  <div className="text-green-400">✓ Quick development</div>
                  <div className="text-green-400">✓ Standard SQL syntax</div>
                  <div className="text-red-400">✗ Limited functionality</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚙️</span>
                  <div className="text-purple-400 font-bold">Flink</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-green-400">✓ Complex event processing</div>
                  <div className="text-green-400">✓ Custom operators</div>
                  <div className="text-green-400">✓ Full control</div>
                  <div className="text-green-400">✓ Advanced state management</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">Flink Use Cases</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div>• Complex pattern matching</div>
                <div>• Machine learning inference</div>
                <div>• Custom windowing logic</div>
                <div>• Stateful transformations</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Reference Data from S3</h3>
              <p className="text-gray-300">Enrich streaming data with static lookups</p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
                  <div className="text-orange-400 font-semibold mb-2">Streaming Data</div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-300">
                      &#123; "user_id": "123", "event": "click" &#125;
                    </div>
                    <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-300">
                      &#123; "user_id": "456", "event": "purchase" &#125;
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 text-2xl text-gray-500">+</div>
              <div className="flex-1">
                <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📦</span>
                    <div className="text-green-400 font-semibold">S3 Reference Data</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-300">
                      user_id,name,tier
                    </div>
                    <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-300">
                      123,Alice,Premium
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mb-3">
              <div className="text-3xl text-gray-500">↓</div>
              <div className="text-sm text-gray-400">JOIN operation</div>
            </div>
            <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 text-center">
              <div className="text-blue-400 font-semibold mb-2">Enriched Output</div>
              <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-300">
                &#123; "user_id": "123", "event": "click", "name": "Alice", "tier": "Premium" &#125;
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Output Destinations</h3>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-3xl">📊</span>
                  <span className="text-white text-xs mt-1">Analytics App</span>
                </div>
                <span className="text-xs text-gray-400">Processed Results</span>
              </div>
              <div className="px-6 text-3xl text-gray-500">→</div>
              <div className="flex flex-col gap-3">
                <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <div className="text-orange-400 font-semibold text-sm">Kinesis Stream</div>
                    <div className="text-xs text-gray-400">Real-time downstream</div>
                  </div>
                </div>
                <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="text-red-400 font-semibold text-sm">Kinesis Firehose</div>
                    <div className="text-xs text-gray-400">Batch to S3/Redshift</div>
                  </div>
                </div>
                <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-2xl">λ</span>
                  <div>
                    <div className="text-yellow-400 font-semibold text-sm">Lambda</div>
                    <div className="text-xs text-gray-400">Custom processing</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-white font-semibold mb-2">💡 Common Pattern</div>
              <div className="text-sm text-gray-300">
                Input Stream → Analytics (filter/aggregate) → Firehose → S3 → Athena/QuickSight
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Enhanced Fan-Out</h3>
              <p className="text-gray-300">Dedicated throughput for each consumer application</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-3">📖</div>
                <div className="text-yellow-400 font-bold text-lg mb-2">Standard Consumers</div>
                <div className="text-sm text-gray-400 mb-3">Shared throughput</div>
                <div className="text-xl text-yellow-300">2 MB/s total</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <div className="text-green-400 font-bold text-lg mb-2">Enhanced Fan-Out</div>
                <div className="text-sm text-gray-400 mb-3">Dedicated per consumer</div>
                <div className="text-xl text-green-300">2 MB/s each</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Standard Consumers (Shared)</h3>
              <p className="text-gray-300">All consumers share 2 MB/s per shard</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center mr-8">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <span className="text-3xl">🌊</span>
                    <div className="text-xs text-white mt-1">Stream Shard</div>
                  </div>
                </div>
                <div className="text-sm text-white font-semibold">2 MB/s total</div>
              </div>
              <div className="flex flex-col gap-4">
                {consumers.map((consumer, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 h-1 bg-yellow-500" />
                    <div className="px-4 py-2 rounded-lg bg-gray-700 border border-yellow-500">
                      <div className="text-sm text-white">{consumer}</div>
                      <div className="text-xs text-yellow-400">~0.67 MB/s shared</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
              <div className="text-yellow-400 font-semibold mb-2">Limitations</div>
              <div className="text-sm text-gray-300">With 3 consumers, each gets ~0.67 MB/s. Adding more consumers reduces throughput per consumer.</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">Enhanced Fan-Out (Dedicated)</h3>
              <p className="text-gray-300">Each consumer gets dedicated 2 MB/s per shard</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center mr-8">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <span className="text-3xl">🌊</span>
                    <div className="text-xs text-white mt-1">Stream Shard</div>
                  </div>
                </div>
                <div className="text-sm text-white font-semibold">2 MB/s per consumer</div>
              </div>
              <div className="flex flex-col gap-4">
                {consumers.map((consumer, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 h-1 bg-green-500" />
                    <div className="px-4 py-2 rounded-lg bg-green-900/30 border-2 border-green-500">
                      <div className="text-sm text-white">{consumer}</div>
                      <div className="text-xs text-green-400">2 MB/s dedicated</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Benefits</div>
              <div className="text-sm text-gray-300">Each consumer gets full 2 MB/s regardless of how many other consumers exist. Up to 20 enhanced consumers per stream.</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">Push Model via HTTP/2</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">📖</div>
                  <div className="text-yellow-400 font-bold">Standard (Pull)</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-white font-semibold mb-1">GetRecords API</div>
                    <div className="text-gray-400 text-xs">Consumer polls for data</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-yellow-400 font-bold">~200ms latency</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-gray-300">HTTP/1.1</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-green-400 font-bold">Enhanced (Push)</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-white font-semibold mb-1">SubscribeToShard</div>
                    <div className="text-gray-400 text-xs">Data pushed to consumer</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-green-400 font-bold">~70ms latency</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-gray-300">HTTP/2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">When to Use Enhanced Fan-Out</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-900/30 border-l-4 border-green-500 rounded-lg p-4">
                <div className="text-green-400 font-bold mb-2">✓ Use Enhanced Fan-Out when:</div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Multiple consumers ({'>'}2) reading from same stream</li>
                  <li>• Low latency required (&lt;100ms)</li>
                  <li>• Each consumer needs high throughput</li>
                  <li>• Can justify higher cost</li>
                </ul>
              </div>
              <div className="bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg p-4">
                <div className="text-yellow-400 font-bold mb-2">⚠️ Use Standard when:</div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Single consumer or low consumer count</li>
                  <li>• ~200ms latency acceptable</li>
                  <li>• Cost optimization important</li>
                  <li>• Lower throughput requirements</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-300">
                  💰 Enhanced Fan-Out costs more but provides dedicated throughput and lower latency
                </div>
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Error Handling</h3>
              <p className="text-gray-300">Build resilient workflows with Retry and Catch</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-3">🔄</div>
                <div className="text-yellow-400 font-bold text-lg mb-2">Retry</div>
                <div className="text-sm text-gray-400">Automatic retries with exponential backoff</div>
              </div>
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-red-400 font-bold text-lg mb-2">Catch</div>
                <div className="text-sm text-gray-400">Graceful error handling and fallbacks</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Retry Pattern</h3>
              <p className="text-gray-300">Automatically retry failed states with exponential backoff</p>
            </div>
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
            <div className="flex items-center justify-center gap-2 mb-4">
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
                    {attempt === 2 && "4s wait (2.0 backoff)"}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3">
              <div className="text-sm text-gray-300 text-center">
                💡 Retry with exponential backoff: 2s → 4s → 8s
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Catch Pattern</h3>
              <p className="text-gray-300">Handle errors and transition to fallback states</p>
            </div>
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
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-24 bg-blue-600 rounded-lg p-3 text-center">
                <span className="text-xl">💳</span>
                <div className="text-xs text-white">Process Payment</div>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center text-2xl">❌</div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="flex flex-col gap-2">
                <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-2 text-center">
                  <div className="text-xs text-yellow-400">PaymentDeclined →</div>
                  <div className="text-xs text-white">Notify Customer</div>
                </div>
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-2 text-center">
                  <div className="text-xs text-red-400">States.ALL →</div>
                  <div className="text-xs text-white">Handle Error</div>
                </div>
              </div>
            </div>
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
              <div className="text-sm text-gray-300 text-center">
                💡 Catch handlers are evaluated in order until one matches
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Error Types</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">States.ALL</div>
                <div className="text-xs text-gray-400">Matches any error</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">States.Timeout</div>
                <div className="text-xs text-gray-400">Task execution timeout</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">States.TaskFailed</div>
                <div className="text-xs text-gray-400">Task returned error</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">States.Permissions</div>
                <div className="text-xs text-gray-400">Insufficient permissions</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 font-semibold mb-1">States.ResultPathMatchFailure</div>
                <div className="text-xs text-gray-400">ResultPath cannot be applied</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-yellow-400 font-semibold mb-1">Custom.Error</div>
                <div className="text-xs text-gray-400">Application-specific errors</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Best Practices</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <div className="text-yellow-400 font-bold mb-1">Use Retry for:</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Transient errors (network timeouts, throttling)</li>
                      <li>• Service unavailability</li>
                      <li>• Temporary failures</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/30 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-red-400 font-bold mb-1">Use Catch for:</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Business logic errors (payment declined)</li>
                      <li>• Validation failures</li>
                      <li>• Unrecoverable errors requiring different workflow</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-300 text-center">
                  ⚠️ Remember: Retry executes before Catch
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔀</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Parallel State: Concurrent Execution</h3>
              <p className="text-gray-400">Execute multiple branches of your workflow simultaneously</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 bg-blue-600 rounded-lg p-3 text-center mb-4">
                <span className="text-white text-sm">Start</span>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-purple-400 text-sm font-semibold text-center mb-2">Parallel State</div>
                <div className="text-xs text-gray-400 text-center">All branches run at the same time</div>
              </div>
              <div className="flex gap-4 my-4">
                <div className="w-1 h-12 bg-purple-500"></div>
                <div className="w-1 h-12 bg-purple-500"></div>
                <div className="w-1 h-12 bg-purple-500"></div>
              </div>
              <div className="flex gap-4">
                {["Branch 1", "Branch 2", "Branch 3"].map((branch, i) => (
                  <div key={i} className="w-32 bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-white">{branch}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Independent Branches</h3>
              <p className="text-gray-400">Each branch is a complete state machine with its own states</p>
            </div>
            <div className="flex justify-center gap-6">
              {["Process Order", "Send Email", "Update Inventory"].map((task, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm font-semibold text-purple-400 mb-3">{task}</div>
                  <div className="space-y-2">
                    <div className="bg-blue-600 rounded px-2 py-1 text-xs text-white">Validate</div>
                    <div className="bg-blue-600 rounded px-2 py-1 text-xs text-white">Process</div>
                    <div className="bg-green-600 rounded px-2 py-1 text-xs text-white">Complete</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Output Array</h3>
              <p className="text-gray-400">Results from all branches combined into a single array</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-purple-400 text-sm font-semibold text-center mb-4">Parallel State</div>
                <div className="flex gap-3">
                  {["Branch 1", "Branch 2", "Branch 3"].map((_, i) => (
                    <div key={i} className="w-24 bg-green-600 rounded-lg p-2 text-center">
                      <div className="text-xl">✓</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Output Array</div>
                <pre className="text-xs font-mono text-green-400">
{`[
  { "orderId": "123" },
  { "emailSent": true },
  { "inventory": "updated" }
]`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Error Handling</h3>
              <p className="text-gray-400">If any branch fails, the entire Parallel state fails</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-purple-400 text-sm font-semibold text-center mb-4">Parallel State</div>
                <div className="flex gap-4">
                  <div className="w-32 bg-green-600 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">✓</div>
                    <div className="text-xs text-white">Success</div>
                  </div>
                  <div className="w-32 bg-red-600 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">✗</div>
                    <div className="text-xs text-white">Failed</div>
                  </div>
                  <div className="w-32 bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">⏸</div>
                    <div className="text-xs text-white">Stopped</div>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="text-red-400 text-sm font-semibold">⚠️ Entire Parallel State Fails</div>
              </div>
            </div>
            <div className="mt-4 bg-gray-900 rounded-lg p-4">
              <pre className="text-xs font-mono text-yellow-400">
{`"Parallel": {
  "Type": "Parallel",
  "Catch": [{
    "ErrorEquals": ["States.ALL"],
    "Next": "ErrorHandler"
  }]
}`}
              </pre>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Common Use Cases</h3>
              <p className="text-gray-400">When to use Parallel states in your workflows</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="text-3xl text-center mb-2">📊</div>
                <div className="text-sm font-semibold text-purple-400 mb-2">Fan-Out Processing</div>
                <div className="text-xs text-gray-400">Process data through multiple independent pipelines</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="text-3xl text-center mb-2">🌐</div>
                <div className="text-sm font-semibold text-blue-400 mb-2">Parallel API Calls</div>
                <div className="text-xs text-gray-400">Call multiple APIs simultaneously to reduce latency</div>
              </div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="text-3xl text-center mb-2">📦</div>
                <div className="text-sm font-semibold text-green-400 mb-2">Batch Operations</div>
                <div className="text-xs text-gray-400">Execute multiple independent tasks at once</div>
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔀</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Choice State: Conditional Branching</h3>
              <p className="text-gray-400">Add if/else logic to your workflows</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 bg-yellow-600 rounded-lg p-3 text-center mb-4">
                <span className="text-white text-sm">Choice State</span>
                <div className="text-xs text-yellow-200">Make decisions</div>
              </div>
              <div className="flex gap-8">
                {[
                  { path: "premium", label: "Path A", color: "purple" },
                  { path: "standard", label: "Path B", color: "blue" },
                  { path: "basic", label: "Default", color: "gray" }
                ].map((option) => (
                  <div key={option.path} className="text-center">
                    <div className="w-1 h-8 mx-auto bg-gray-500" />
                    <div className={`w-28 rounded-lg p-3 ${
                      option.color === "purple" ? "bg-purple-600" :
                      option.color === "blue" ? "bg-blue-600" : "bg-gray-600"
                    }`}>
                      <div className="text-white text-sm">{option.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Comparison Operators</h3>
              <p className="text-gray-400">Built-in operators for all data types</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-400 mb-2">String</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• StringEquals</div>
                  <div>• StringLessThan</div>
                  <div>• StringGreaterThan</div>
                  <div>• StringMatches</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-purple-400 mb-2">Numeric</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• NumericEquals</div>
                  <div>• NumericLessThan</div>
                  <div>• NumericGreaterThan</div>
                  <div>• NumericLessThanEquals</div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-green-400 mb-2">Other</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• BooleanEquals</div>
                  <div>• TimestampEquals</div>
                  <div>• IsPresent</div>
                  <div>• IsNull</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Variable Path (JSONPath)</h3>
              <p className="text-gray-400">Reference input data using JSONPath syntax</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Input Data</div>
                <pre className="text-xs font-mono text-green-400">
{`{
  "orderValue": ${orderValue},
  "customer": {
    "tier": "gold"
  },
  "items": ["laptop"]
}`}
                </pre>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">JSONPath Examples</div>
                <pre className="text-xs font-mono text-yellow-400">
{`$.orderValue
$.customer.tier
$.items[0]
$.metadata.timestamp`}
                </pre>
                <div className="mt-3 text-xs text-gray-400">
                  Use $ to reference root<br/>
                  Use . for nested fields
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Default Path</h3>
              <p className="text-gray-400">Fallback when no conditions match - always include one!</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 bg-yellow-600 rounded-lg p-3 text-center mb-4">
                <span className="text-white text-sm">Check Order</span>
              </div>
              <div className="flex gap-8">
                {[
                  { path: "premium", label: "Premium", condition: "≥ $500", color: "purple", matches: getPath() === "premium" },
                  { path: "standard", label: "Standard", condition: "≥ $100", color: "blue", matches: getPath() === "standard" },
                  { path: "basic", label: "Basic", condition: "Default", color: "orange", matches: getPath() === "basic" }
                ].map((option) => (
                  <div key={option.path} className="text-center">
                    <div className={`w-1 h-8 mx-auto ${option.matches ? "bg-green-500" : "bg-gray-600"}`} />
                    <div className={`w-28 rounded-lg p-3 border-2 ${
                      option.matches
                        ? option.color === "purple" ? "bg-purple-600 border-green-400" :
                          option.color === "blue" ? "bg-blue-600 border-green-400" : "bg-orange-600 border-green-400"
                        : option.color === "orange" ? "bg-orange-600/30 border-orange-500" : "bg-gray-700 opacity-50 border-gray-600"
                    }`}>
                      <div className="text-white text-xs font-semibold">{option.label}</div>
                      <div className="text-xs text-gray-300 mt-1">{option.condition}</div>
                      {option.color === "orange" && <div className="text-xs text-orange-300 mt-1">⚠️ Fallback</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-gray-900 rounded-lg p-4">
              <pre className="text-xs font-mono text-yellow-400">
{`"Choices": [...],
"Default": "BasicProcessing"  ← Always include!`}
              </pre>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Complex Logic: And, Or, Not</h3>
              <p className="text-gray-400">Combine multiple conditions</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                <div className="text-sm font-semibold text-blue-400 mb-2">And</div>
                <div className="text-xs text-gray-300">All conditions must be true</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3">
                <div className="text-sm font-semibold text-purple-400 mb-2">Or</div>
                <div className="text-xs text-gray-300">Any condition can be true</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
                <div className="text-sm font-semibold text-red-400 mb-2">Not</div>
                <div className="text-xs text-gray-300">Inverts the condition</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`{
  "And": [
    { "Variable": "$.value", "NumericGreaterThan": 100 },
    { "Variable": "$.status", "StringEquals": "active" }
  ],
  "Next": "ProcessOrder"
}`}
              </pre>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Map State: Parallel Iteration</h3>
              <p className="text-gray-400">Process array items in parallel with a single state machine definition</p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Input Array</div>
                <div className="space-y-1">
                  {items.map((item, i) => (
                    <div key={i} className="text-xs text-gray-300 font-mono">{item}</div>
                  ))}
                </div>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
                <div className="text-cyan-400 text-sm font-semibold text-center mb-2">Map State</div>
                <div className="text-xs text-gray-400 text-center">Process all items</div>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Output Array</div>
                <div className="text-xs text-gray-400">[results]</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">ItemsPath: Locate the Array</h3>
              <p className="text-gray-400">Use JSONPath to specify which array to iterate over</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Input</div>
                <pre className="text-xs font-mono text-green-400">
{`{
  "orders": [
    { "id": 1, "amount": 100 },
    { "id": 2, "amount": 200 },
    { "id": 3, "amount": 150 }
  ],
  "userId": "user-123"
}`}
                </pre>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">ItemsPath Configuration</div>
                <pre className="text-xs font-mono text-cyan-400">
{`"ItemsPath": "$.orders"`}
                </pre>
                <div className="mt-3 text-xs text-gray-400">
                  Points to the array<br/>
                  Each item passed to Iterator<br/>
                  JSONPath syntax
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">MaxConcurrency: Control Parallelism</h3>
              <p className="text-gray-400">Limit how many iterations run simultaneously</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-purple-400 mb-3">MaxConcurrency: 0</div>
                <div className="text-xs text-gray-300 mb-3">Unlimited - all items process in parallel</div>
                <div className="grid grid-cols-5 gap-1">
                  {items.map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-xs">✓</div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">All 5 at once</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-400 mb-3">MaxConcurrency: 2</div>
                <div className="text-xs text-gray-300 mb-3">Limited - max 2 at a time</div>
                <div className="flex gap-1 mb-1">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-xs">✓</div>
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-xs">✓</div>
                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-xs">⏳</div>
                </div>
                <div className="text-xs text-gray-400">2 processing, others wait</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Iterator: The Processing Logic</h3>
              <p className="text-gray-400">Define a complete state machine to run for each item</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-xs font-mono text-cyan-400 overflow-auto">
{`"Iterator": {
  "StartAt": "ValidateOrder",
  "States": {
    "ValidateOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:validate",
      "Next": "ProcessOrder"
    },
    "ProcessOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:process",
      "End": true
    }
  }
}`}
              </pre>
            </div>
            <div className="flex justify-center gap-6">
              {items.slice(0, 3).map((item, i) => (
                <div key={i} className="bg-cyan-900/30 border border-cyan-500 rounded-lg p-3">
                  <div className="text-xs text-cyan-400 font-semibold mb-2">{item}</div>
                  <div className="space-y-1">
                    <div className="bg-blue-600 rounded px-2 py-1 text-xs text-white">Validate</div>
                    <div className="bg-blue-600 rounded px-2 py-1 text-xs text-white">Process</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Output: Array of Results</h3>
              <p className="text-gray-400">Map returns an array containing the result from each iteration</p>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Input Array</div>
                <pre className="text-xs font-mono text-gray-300">
{`[
  { "id": 1 },
  { "id": 2 },
  { "id": 3 }
]`}
                </pre>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-3 mb-2">
                  <div className="text-cyan-400 text-sm font-semibold">Map State</div>
                </div>
                <div className="text-gray-500 text-xl">↓</div>
                <div className="text-xs text-gray-400 mt-2">Process each item</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Output Array</div>
                <pre className="text-xs font-mono text-green-400">
{`[
  { "id": 1, "status": "ok" },
  { "id": 2, "status": "ok" },
  { "id": 3, "status": "ok" }
]`}
                </pre>
              </div>
            </div>
            <div className="mt-6 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-400 mb-2">💡 Key Difference</div>
              <div className="text-xs text-gray-300">
                <strong>Map:</strong> Dynamic - processes variable-length arrays<br/>
                <strong>Parallel:</strong> Static - fixed number of branches defined in advance
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔌</div>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">200+ AWS Service Integrations</h3>
              <p className="text-gray-400">Call AWS services directly from Step Functions without Lambda</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: "λ", name: "Lambda", color: "orange" },
                { icon: "📊", name: "DynamoDB", color: "blue" },
                { icon: "📬", name: "SQS", color: "pink" },
                { icon: "🐳", name: "ECS", color: "cyan" },
                { icon: "📦", name: "S3", color: "green" },
                { icon: "🔔", name: "SNS", color: "red" },
                { icon: "🤖", name: "SageMaker", color: "purple" },
                { icon: "⚙️", name: "Batch", color: "yellow" }
              ].map((service, i) => (
                <div key={i} className={`bg-gray-700 border-2 border-${service.color}-500 rounded-lg p-3 text-center hover:bg-gray-600 transition-all`}>
                  <span className="text-2xl">{service.icon}</span>
                  <div className="text-xs text-gray-300 mt-1 font-semibold">{service.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              Plus: Glue, Athena, EMR, EKS, EventBridge, API Gateway, and 190+ more!
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">Request-Response (Default)</h3>
              <p className="text-gray-400">Call service, get immediate response, continue workflow</p>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
                <div className="text-indigo-400 text-sm font-semibold text-center">Step Functions</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-green-500 text-xl">→</div>
                <div className="text-xs text-gray-400">Call</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-blue-400 text-sm font-semibold text-center">📊 DynamoDB</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-green-500 text-xl">←</div>
                <div className="text-xs text-gray-400">Response</div>
              </div>
              <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
                <div className="text-indigo-400 text-sm font-semibold text-center">Continue</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-xs font-mono text-indigo-400">
{`"PutItem": {
  "Type": "Task",
  "Resource": "arn:aws:states:::dynamodb:putItem",
  "Parameters": {
    "TableName": "Orders",
    "Item": {
      "orderId": { "S.$": "$.orderId" }
    }
  },
  "Next": "NextState"
}`}
              </pre>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">Run a Job (.sync)</h3>
              <p className="text-gray-400">Start a long-running job and wait for it to complete</p>
            </div>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
                  <div className="text-indigo-400 text-sm font-semibold">Step Functions</div>
                </div>
                <div className="text-green-500 text-xl">→</div>
                <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
                  <div className="text-cyan-400 text-sm font-semibold">🐳 Start ECS Task</div>
                </div>
              </div>
              <div className="text-yellow-400 text-sm animate-pulse">⏱️ Waiting for job to complete...</div>
              <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
                <div className="text-cyan-400 text-sm font-semibold">✓ Task Completed</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-green-500 text-xl">←</div>
                <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
                  <div className="text-indigo-400 text-sm font-semibold">Resume Workflow</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-xs font-mono text-indigo-400">
{`"RunTask": {
  "Type": "Task",
  "Resource": "arn:aws:states:::ecs:runTask.sync",
  "Parameters": { ... },
  "Next": "AfterTaskCompletes"
}`}
              </pre>
              <div className="text-xs text-yellow-400 mt-2">
                Note the <strong>.sync</strong> suffix - waits for completion
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">Wait for Callback (.waitForTaskToken)</h3>
              <p className="text-gray-400">Pause execution until external system calls back</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
                <div className="text-lg font-bold text-indigo-400 mb-2">1. Send Task</div>
                <div className="text-xs text-gray-300">Step Functions sends task token to external system (via SQS, SNS, etc.)</div>
              </div>
              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
                <div className="text-lg font-bold text-yellow-400 mb-2">2. Wait</div>
                <div className="text-xs text-gray-300">Execution pauses. Could be minutes, hours, or days...</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-lg font-bold text-green-400 mb-2">3. Callback</div>
                <div className="text-xs text-gray-300">External system calls SendTaskSuccess with token</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-xs font-mono text-indigo-400">
{`"WaitForApproval": {
  "Type": "Task",
  "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
  "Parameters": {
    "QueueUrl": "...",
    "MessageBody": {
      "TaskToken.$": "$$.Task.Token",
      "Data.$": "$"
    }
  }
}`}
              </pre>
              <div className="text-xs text-gray-400 mt-2">
                Use case: Manual approvals, human-in-the-loop workflows
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">Optimized Integrations - No Lambda Needed!</h3>
              <p className="text-gray-400">Direct service calls save cost and reduce complexity</p>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-red-400 mb-3">❌ Old Way (Lambda Glue)</div>
                <div className="flex flex-col gap-2">
                  <div className="bg-indigo-600 rounded p-2 text-xs text-white">Step Functions</div>
                  <div className="text-center text-red-400">↓</div>
                  <div className="bg-orange-600 rounded p-2 text-xs text-white">Lambda (wrapper)</div>
                  <div className="text-center text-red-400">↓</div>
                  <div className="bg-blue-600 rounded p-2 text-xs text-white">DynamoDB</div>
                </div>
                <div className="text-xs text-gray-400 mt-3">• More cost<br/>• More latency<br/>• More to manage</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-green-400 mb-3">✓ New Way (Direct)</div>
                <div className="flex flex-col gap-2">
                  <div className="bg-indigo-600 rounded p-2 text-xs text-white">Step Functions</div>
                  <div className="text-center text-green-400">↓</div>
                  <div className="bg-blue-600 rounded p-2 text-xs text-white">DynamoDB</div>
                  <div className="h-16"></div>
                </div>
                <div className="text-xs text-gray-400 mt-3">• Lower cost<br/>• Lower latency<br/>• Simpler architecture</div>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-400 mb-2">💡 Exam Tip</div>
              <div className="text-xs text-gray-300">
                If you can use an optimized integration instead of Lambda, do it!<br/>
                Saves money and simplifies your architecture.
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-teal-400 mb-4">Kinesis Client Library (KCL)</h3>
              <p className="text-gray-400">Powerful library for building scalable Kinesis consumer applications</p>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">🌊</span>
                </div>
                <span className="text-sm text-gray-300 font-semibold">Kinesis Stream</span>
                <div className="text-xs text-gray-500">4 shards</div>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="bg-teal-900/30 border-2 border-teal-500 rounded-lg p-4">
                <div className="text-teal-400 text-sm font-semibold text-center mb-3">KCL Application</div>
                <div className="text-xs text-gray-400 text-center">Handles all complexity</div>
              </div>
            </div>
            <div className="mt-6 bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">What KCL Does For You:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div>✓ Load balancing across workers</div>
                <div>✓ Checkpointing progress</div>
                <div>✓ Handling shard splits/merges</div>
                <div>✓ Failure recovery</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-teal-400 mb-4">Checkpointing with DynamoDB</h3>
              <p className="text-gray-400">Track processing progress to enable resume from last position</p>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="bg-teal-900/30 border-2 border-teal-500 rounded-lg p-4">
                <div className="text-teal-400 text-sm font-semibold text-center mb-3">KCL Worker</div>
                <div className="text-xs text-gray-300 text-center">Processing records...</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-teal-500 text-xl">⇄</div>
                <div className="text-xs text-gray-400">Checkpoints</div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">📊</span>
                </div>
                <span className="text-sm text-gray-300 font-semibold">DynamoDB</span>
                <div className="text-xs text-gray-500">Checkpoint Table</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Checkpoint Data</div>
                <pre className="text-xs font-mono text-teal-400">
{`{
  "shardId": "shard-0001",
  "sequenceNumber": "12345",
  "workerId": "worker-1"
}`}
                </pre>
              </div>
              <div className="bg-teal-900/30 border border-teal-500 rounded-lg p-4">
                <div className="text-sm font-semibold text-teal-400 mb-2">Benefits</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>✓ Resume after failure</div>
                  <div>✓ Prevent duplicate processing</div>
                  <div>✓ Track progress per shard</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-teal-400 mb-4">Automatic Shard Assignment</h3>
              <p className="text-gray-400">KCL distributes shards across workers automatically</p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🌊</span>
                </div>
                <div className="text-xs text-gray-400">4 Shards</div>
                <div className="flex flex-col gap-1 mt-2">
                  {["S0", "S1", "S2", "S3"].map((shard, i) => (
                    <div key={i} className="bg-orange-700 rounded px-2 py-1 text-xs text-white">{shard}</div>
                  ))}
                </div>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="bg-teal-900/30 border-2 border-teal-500 rounded-lg p-6">
                <div className="text-teal-400 text-sm font-semibold text-center mb-4">KCL Auto-Assignment</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-white font-semibold mb-2">Worker 1</div>
                    <div className="flex gap-1">
                      <div className="bg-orange-600 rounded px-2 py-1 text-xs text-white">S0</div>
                      <div className="bg-orange-600 rounded px-2 py-1 text-xs text-white">S1</div>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-white font-semibold mb-2">Worker 2</div>
                    <div className="flex gap-1">
                      <div className="bg-orange-600 rounded px-2 py-1 text-xs text-white">S2</div>
                      <div className="bg-orange-600 rounded px-2 py-1 text-xs text-white">S3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-400 mb-2">💡 Key Rule</div>
              <div className="text-xs text-gray-300">
                One record processor per shard. Workers can handle multiple shards, but each shard is processed by exactly one worker at a time.
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-teal-400 mb-4">Resharding Support</h3>
              <p className="text-gray-400">KCL automatically handles shard splits and merges</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-purple-400 mb-3">Shard Split</div>
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-orange-600 rounded-lg p-3 w-32 text-center">
                    <div className="text-white text-sm">Shard 1</div>
                    <div className="text-xs text-orange-200">Getting too hot</div>
                  </div>
                  <div className="text-purple-400 text-xl">↓ Split</div>
                  <div className="flex gap-2">
                    <div className="bg-orange-600 rounded-lg p-2 w-14 text-center">
                      <div className="text-white text-xs">S1-A</div>
                    </div>
                    <div className="bg-orange-600 rounded-lg p-2 w-14 text-center">
                      <div className="text-white text-xs">S1-B</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-3">KCL automatically reassigns workers</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-400 mb-3">Shard Merge</div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    <div className="bg-orange-600 rounded-lg p-2 w-14 text-center">
                      <div className="text-white text-xs">S2</div>
                    </div>
                    <div className="bg-orange-600 rounded-lg p-2 w-14 text-center">
                      <div className="text-white text-xs">S3</div>
                    </div>
                  </div>
                  <div className="text-blue-400 text-xl">↓ Merge</div>
                  <div className="bg-orange-600 rounded-lg p-3 w-32 text-center">
                    <div className="text-white text-sm">Shard 2-3</div>
                    <div className="text-xs text-orange-200">Combined</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-3">KCL rebalances load automatically</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-teal-400 mb-4">Multi-Language Support</h3>
              <p className="text-gray-400">KCL available for multiple programming languages</p>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-orange-400 mb-3">Native KCL</div>
                <div className="space-y-2">
                  <div className="bg-orange-700 rounded-lg p-2 text-center">
                    <div className="text-white text-sm">☕ Java</div>
                    <div className="text-xs text-orange-200">Original implementation</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-3">Full-featured, best performance</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-400 mb-3">Multi-Language Daemon</div>
                <div className="space-y-2">
                  <div className="bg-blue-700 rounded-lg p-2 text-center text-xs text-white">🐍 Python</div>
                  <div className="bg-green-700 rounded-lg p-2 text-center text-xs text-white">📗 Node.js</div>
                  <div className="bg-red-700 rounded-lg p-2 text-center text-xs text-white">💎 Ruby</div>
                </div>
                <div className="text-xs text-gray-300 mt-3">Uses Java KCL under the hood</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Alternative: Lambda Consumer</div>
              <div className="text-xs text-gray-300">
                For simpler use cases, consider Lambda with Kinesis trigger - less control but easier to manage
              </div>
            </div>
          </div>
        )}
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
