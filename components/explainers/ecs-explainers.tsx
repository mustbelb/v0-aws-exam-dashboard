"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Container, Server, Scaling, Package, Layers, Lock, Cpu, FileText, RefreshCw, Shield, Network } from "lucide-react"

// 1. ECS vs Fargate Explainer (Rich)
export function EcsVsFargateExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [launchType, setLaunchType] = useState<"ec2" | "fargate">("fargate")

  const steps = [
    { title: "ECS Launch Types", description: "Choose between EC2 instances or serverless Fargate for running containers" },
    { title: "EC2 Launch Type", description: "You manage EC2 instances - full control but more operational overhead" },
    { title: "Fargate Launch Type", description: "Serverless - AWS manages infrastructure, you just define tasks" },
    { title: "Pricing Differences", description: "EC2: pay for instances. Fargate: pay per vCPU and memory per second" },
    { title: "When to Use Each", description: "Fargate for simplicity, EC2 for GPU, cost optimization, or custom AMIs" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const ec2Features = [
    { name: "You Manage Instances", supported: true },
    { name: "Full EC2 Access", supported: true },
    { name: "GPU Support", supported: true },
    { name: "Custom AMIs", supported: true },
    { name: "Reserved/Spot Pricing", supported: true },
    { name: "No Server Management", supported: false }
  ]

  const fargateFeatures = [
    { name: "You Manage Instances", supported: false },
    { name: "Full EC2 Access", supported: false },
    { name: "GPU Support", supported: false },
    { name: "Custom AMIs", supported: false },
    { name: "Serverless Pricing", supported: true },
    { name: "No Server Management", supported: true }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Container className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">ECS vs Fargate</h2>
      </div>

      {/* Launch Type Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setLaunchType("ec2")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            launchType === "ec2" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          EC2 Launch Type
        </button>
        <button
          onClick={() => setLaunchType("fargate")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            launchType === "fargate" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Fargate Launch Type
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Choose Your Launch Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20">
                <Server className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-400">EC2 Launch Type</div>
                <div className="text-sm text-gray-300 mt-2">You manage instances</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-orange-500 bg-orange-900/20">
                <Container className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-orange-400">Fargate Launch Type</div>
                <div className="text-sm text-gray-300 mt-2">AWS manages infrastructure</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20">
            <h3 className="text-lg font-bold mb-4 text-blue-400">EC2 Launch Type</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Server className="w-8 h-8 text-blue-400" />
                <div className="text-sm text-gray-300">EC2 Instance (You manage)</div>
              </div>
              <div className="ml-10 space-y-2">
                <div className="flex items-center gap-2">
                  <Container className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">Container 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <Container className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">Container 2</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Install ECS Agent, manage capacity, patch OS
              </div>
              <div className="mt-4 space-y-1">
                {ec2Features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      feature.supported ? "bg-green-500" : "bg-gray-600"
                    }`}>
                      {feature.supported ? <span className="text-white text-xs">✓</span> : <span className="text-gray-400 text-xs">✗</span>}
                    </div>
                    <span className={feature.supported ? "text-white" : "text-gray-500"}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 rounded-lg border-2 border-orange-500 bg-orange-900/20">
            <h3 className="text-lg font-bold mb-4 text-orange-400">Fargate Launch Type</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">AWS</span>
                </div>
                <div className="text-sm text-gray-300">Fargate (AWS manages)</div>
              </div>
              <div className="ml-10 space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                  <Container className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-gray-400">Task 1 (1 vCPU, 2GB)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                  <Container className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-gray-400">Task 2 (0.5 vCPU, 1GB)</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                No servers to manage, pay per task
              </div>
              <div className="mt-4 space-y-1">
                {fargateFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      feature.supported ? "bg-green-500" : "bg-gray-600"
                    }`}>
                      {feature.supported ? <span className="text-white text-xs">✓</span> : <span className="text-gray-400 text-xs">✗</span>}
                    </div>
                    <span className={feature.supported ? "text-white" : "text-gray-500"}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Pricing Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/50">
                <div className="text-lg font-bold text-blue-400 mb-2">EC2 Pricing</div>
                <div className="text-sm text-gray-300">Pay for EC2 instances (per hour)</div>
                <div className="text-xs text-gray-400 mt-2">• Reserved Instances</div>
                <div className="text-xs text-gray-400">• Spot Instances</div>
                <div className="text-xs text-gray-400">• On-Demand</div>
              </div>
              <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-500/50">
                <div className="text-lg font-bold text-orange-400 mb-2">Fargate Pricing</div>
                <div className="text-sm text-gray-300">Pay per vCPU/memory per second</div>
                <div className="text-xs text-gray-400 mt-2">• No upfront costs</div>
                <div className="text-xs text-gray-400">• Pay only for running tasks</div>
                <div className="text-xs text-gray-400">• Fargate Spot available</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">When to Use Each</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/50">
                <div className="text-lg font-bold text-blue-400 mb-2">Use EC2 When...</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ Need GPU support</div>
                  <div>✓ Custom AMIs required</div>
                  <div>✓ Cost optimization with Reserved/Spot</div>
                  <div>✓ Windows containers</div>
                  <div>✓ Direct host access needed</div>
                </div>
              </div>
              <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-500/50">
                <div className="text-lg font-bold text-orange-400 mb-2">Use Fargate When...</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ Want serverless simplicity</div>
                  <div>✓ No server management</div>
                  <div>✓ Variable workloads</div>
                  <div>✓ Quick deployment</div>
                  <div>✓ Small to medium workloads</div>
                </div>
              </div>
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
          <li>• Fargate = serverless, no EC2 management, pay per vCPU/memory</li>
          <li>• EC2 = more control, GPU support, can use Spot/Reserved</li>
          <li>• Fargate cannot use custom AMIs or access underlying host</li>
          <li>• Choose Fargate for simplicity, EC2 for specialized workloads</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Task Definitions Explainer (Medium)
export function TaskDefinitionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSection, setSelectedSection] = useState<"container" | "task" | "network">("container")

  const steps = [
    { title: "What is a Task Definition?", description: "Blueprint for running containers - like a docker-compose file for ECS" },
    { title: "Container Definitions", description: "Image, memory, CPU, port mappings, environment variables" },
    { title: "Task-Level Settings", description: "Task role, execution role, network mode, volumes" },
    { title: "Task vs Execution Role", description: "Task role = container permissions, Execution role = ECS agent permissions" },
    { title: "Revisions", description: "Task definitions are versioned - create new revisions for updates" }
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
        <Package className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Task Definitions</h2>
      </div>

      {/* Section Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "container", label: "Container Config" },
          { key: "task", label: "Task Settings" },
          { key: "network", label: "Network Mode" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedSection(key as typeof selectedSection)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSection === key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 text-center">What is a Task Definition?</h3>
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <div className="text-gray-300 mb-4">Blueprint for running containers in ECS</div>
              <div className="bg-gray-700 rounded-lg p-4 text-sm text-left">
                <div className="text-gray-400 mb-2">Like docker-compose.yml for ECS:</div>
                <div className="text-green-400">• Which image to use</div>
                <div className="text-green-400">• How much CPU/memory</div>
                <div className="text-green-400">• Port mappings</div>
                <div className="text-green-400">• Environment variables</div>
                <div className="text-green-400">• IAM roles</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Container Definition</h3>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-400">{"{"}</div>
              <div className="ml-4">
                <div><span className="text-purple-400">"name"</span>: <span className="text-green-400">"my-app"</span>,</div>
                <div><span className="text-purple-400">"image"</span>: <span className="text-green-400">"123456.dkr.ecr.us-east-1.amazonaws.com/my-app:latest"</span>,</div>
                <div><span className="text-purple-400">"memory"</span>: <span className="text-yellow-400">512</span>,</div>
                <div><span className="text-purple-400">"cpu"</span>: <span className="text-yellow-400">256</span>,</div>
                <div><span className="text-purple-400">"portMappings"</span>: [{"{"} <span className="text-purple-400">"containerPort"</span>: <span className="text-yellow-400">80</span> {"}"}],</div>
                <div><span className="text-purple-400">"environment"</span>: [</div>
                <div className="ml-4">{"{"} <span className="text-purple-400">"name"</span>: <span className="text-green-400">"NODE_ENV"</span>, <span className="text-purple-400">"value"</span>: <span className="text-green-400">"production"</span> {"}"}</div>
                <div>]</div>
              </div>
              <div className="text-gray-400">{"}"}</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Task-Level Settings</h3>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-white font-semibold">Network Mode</div>
                <div className="text-sm text-gray-400">awsvpc (recommended), bridge, host, none</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-white font-semibold">IAM Roles</div>
                <div className="text-sm text-gray-400">Task role & Execution role</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-white font-semibold">Volumes</div>
                <div className="text-sm text-gray-400">EFS, bind mounts, Docker volumes</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-white font-semibold">Launch Type</div>
                <div className="text-sm text-gray-400">Fargate or EC2</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Task vs Execution Roles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-2">Task Role</div>
                <div className="text-sm text-gray-300 mb-2">Permissions for your application</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Access S3 buckets</li>
                  <li>• Call DynamoDB</li>
                  <li>• Send SQS messages</li>
                  <li>• Invoke Lambda</li>
                </ul>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-2">Execution Role</div>
                <div className="text-sm text-gray-300 mb-2">Permissions for ECS agent</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Pull images from ECR</li>
                  <li>• Write CloudWatch logs</li>
                  <li>• Fetch secrets</li>
                  <li>• Access SSM params</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 text-center">Task Definition Revisions</h3>
            <div className="text-center mb-4">
              <RefreshCw className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <div className="text-gray-300">Task definitions are immutable</div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                <span className="text-white">my-app:3 (latest)</span>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Active</span>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-gray-400">my-app:2</span>
                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">Inactive</span>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-gray-400">my-app:1</span>
                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">Inactive</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 text-center mt-3">
              Create new revision for updates - cannot modify existing
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
          <li>• Task Role = app permissions, Execution Role = ECS agent permissions</li>
          <li>• awsvpc mode required for Fargate (each task gets ENI)</li>
          <li>• Task definitions are immutable - create new revisions</li>
          <li>• Use Secrets Manager or SSM Parameter Store for secrets</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Service Auto Scaling Explainer (Rich)
export function ServiceAutoScalingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cpuLoad, setCpuLoad] = useState(40)
  const [taskCount, setTaskCount] = useState(2)

  const steps = [
    { title: "ECS Service Auto Scaling", description: "Automatically adjust task count based on metrics" },
    { title: "Target Tracking", description: "Scale to maintain a target value (e.g., 50% CPU)" },
    { title: "Step Scaling", description: "Scale by specific amounts based on threshold breaches" },
    { title: "Scheduled Scaling", description: "Scale based on time patterns (e.g., business hours)" },
    { title: "Scale-Out/In Cooldown", description: "Prevent rapid scaling with cooldown periods" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  // Auto-scale simulation
  useEffect(() => {
    const targetCpu = 50
    if (cpuLoad > 70 && taskCount < 6) {
      setTaskCount(t => t + 1)
    } else if (cpuLoad < 30 && taskCount > 1) {
      setTaskCount(t => t - 1)
    }
  }, [cpuLoad, taskCount])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Scaling className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Service Auto Scaling</h2>
      </div>

      {/* CPU Load Slider */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Simulated CPU Load: {cpuLoad}%
        </label>
        <input
          type="range"
          min="10"
          max="90"
          value={cpuLoad}
          onChange={(e) => setCpuLoad(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span className="text-yellow-500">Target: 50%</span>
          <span>90%</span>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">ECS Service Auto Scaling</h3>
            <Scaling className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Automatically adjust task count based on demand</div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Current Tasks</div>
                <div className="text-4xl font-bold text-white">{taskCount}</div>
              </div>
              <div className="flex-1 mx-8">
                <div className="flex gap-2 justify-center flex-wrap">
                  {Array.from({ length: taskCount }).map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <Container className="w-8 h-8 text-white" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">CPU</div>
                <div className={`text-4xl font-bold ${
                  cpuLoad > 70 ? "text-red-400" : cpuLoad < 30 ? "text-blue-400" : "text-green-400"
                }`}>
                  {cpuLoad}%
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Target Tracking Scaling</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Simplest Approach</div>
              <div className="text-sm text-gray-300 mb-3">Set a target value and ECS automatically scales to maintain it</div>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                Target: 50% CPU utilization
              </div>
              <div className="mt-3 text-xs text-gray-400">
                • Scales out when metric exceeds target<br />
                • Scales in when metric falls below target<br />
                • Works with: CPU, Memory, ALB request count
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl">📉</div>
                <div className="text-xs text-gray-400">Low Load</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <div className="text-2xl">🎯</div>
                <div className="text-xs text-yellow-400">Target: 50%</div>
              </div>
              <div className="text-2xl text-gray-400">←</div>
              <div className="text-center">
                <div className="text-2xl">📈</div>
                <div className="text-xs text-gray-400">High Load</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Step Scaling</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">Fine-Grained Control</div>
              <div className="text-sm text-gray-300 mb-3">Scale by specific amounts based on alarm thresholds</div>
              <div className="space-y-2">
                <div className="bg-red-900/30 border border-red-500/50 rounded p-2 text-sm">
                  <div className="text-red-400">CPU &gt; 80%: Add 3 tasks</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-500/50 rounded p-2 text-sm">
                  <div className="text-orange-400">CPU &gt; 60%: Add 2 tasks</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded p-2 text-sm">
                  <div className="text-yellow-400">CPU &gt; 40%: Add 1 task</div>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/50 rounded p-2 text-sm">
                  <div className="text-blue-400">CPU &lt; 20%: Remove 1 task</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Scheduled Scaling</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">Time-Based Scaling</div>
              <div className="text-sm text-gray-300 mb-3">Scale based on predictable patterns</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">🌅</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Business Hours Start</div>
                    <div className="text-xs text-gray-400">8:00 AM: Scale to 10 tasks</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">🌙</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Business Hours End</div>
                    <div className="text-xs text-gray-400">6:00 PM: Scale to 2 tasks</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">📅</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Weekend Schedule</div>
                    <div className="text-xs text-gray-400">Sat-Sun: Scale to 1 task</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Cooldown Periods</h3>
            <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Prevent Rapid Scaling</div>
              <div className="text-sm text-gray-300 mb-3">Wait before scaling again to stabilize</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Scale-Out Cooldown</div>
                  <div className="text-sm text-gray-400">Wait 60s after adding tasks</div>
                  <div className="text-xs text-gray-500 mt-1">Allows new tasks to start handling load</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Scale-In Cooldown</div>
                  <div className="text-sm text-gray-400">Wait 300s after removing tasks</div>
                  <div className="text-xs text-gray-500 mt-1">Prevents premature scale-in during traffic spikes</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-2 rounded">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-sm text-gray-300">Cooldown prevents scaling thrashing</span>
                </div>
              </div>
            </div>
          </div>
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
          <li>• Target Tracking: simplest - just set target metric value</li>
          <li>• Step Scaling: more control with specific scale amounts</li>
          <li>• Cooldown periods prevent scaling thrashing</li>
          <li>• Can scale on CPU, memory, ALB request count, or custom metrics</li>
        </ul>
      </div>
    </div>
  )
}

// 4. ECR Integration Explainer (Medium)
export function EcrIntegrationExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScan, setShowScan] = useState(false)

  const steps = [
    { title: "ECR Overview", description: "Fully managed Docker container registry integrated with ECS" },
    { title: "Push/Pull Images", description: "Authenticate with AWS CLI, push images, pull from ECS tasks" },
    { title: "Image Scanning", description: "Automated vulnerability scanning on push or on-demand" },
    { title: "Lifecycle Policies", description: "Automatically clean up old or untagged images" },
    { title: "Cross-Account Access", description: "Share images across accounts with resource policies" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const vulnerabilities = [
    { severity: "CRITICAL", count: 2, color: "red" },
    { severity: "HIGH", count: 5, color: "orange" },
    { severity: "MEDIUM", count: 12, color: "yellow" },
    { severity: "LOW", count: 23, color: "blue" }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">ECR Integration</h2>
      </div>

      {/* Scan Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowScan(!showScan)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showScan ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          {showScan ? "🔍 Scan Results" : "Show Vulnerability Scan"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Elastic Container Registry (ECR)</h3>
            <Package className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Fully managed Docker container registry</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm text-white">Secure</div>
                <div className="text-xs text-gray-400">Encrypted at rest</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm text-white">Scan Images</div>
                <div className="text-xs text-gray-400">Vulnerability detection</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-sm text-white">Lifecycle</div>
                <div className="text-xs text-gray-400">Auto cleanup</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center mb-4">Push & Pull Images</h3>
            {/* Push Flow */}
            <div>
              <div className="text-sm font-semibold text-purple-400 mb-3">Push Image to ECR</div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-2xl">💻</span>
                  </div>
                  <span className="text-xs text-gray-400">Local</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-700 rounded p-2 text-xs font-mono text-green-400">
                    aws ecr get-login-password | docker login
                  </div>
                </div>
                <div className="text-2xl">→</div>
                <div className="flex-1">
                  <div className="bg-gray-700 rounded p-2 text-xs font-mono text-green-400">
                    docker push 123456.dkr.ecr...
                  </div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-1">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">ECR</span>
                </div>
              </div>
            </div>

            {/* Pull Flow */}
            <div>
              <div className="text-sm font-semibold text-orange-400 mb-3">ECS Pulls from ECR</div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-1">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">ECR</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-400 mb-1">Execution Role</div>
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-orange-500 rounded" />
                  <div className="text-xs text-gray-500 mt-1">ecr:GetAuthorizationToken, ecr:BatchGetImage</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-1">
                    <Container className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">ECS Task</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold text-white text-center mb-4">Image Scanning</h3>
            <div className="text-lg font-semibold text-red-400 mb-4">Vulnerability Scan Results</div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {vulnerabilities.map((v, i) => (
                <div key={i} className={`p-4 rounded-lg bg-${v.color}-900/30 border border-${v.color}-600/30 text-center`}
                  style={{
                    backgroundColor: v.color === "red" ? "rgba(127,29,29,0.3)" :
                                    v.color === "orange" ? "rgba(124,45,18,0.3)" :
                                    v.color === "yellow" ? "rgba(113,63,18,0.3)" :
                                    "rgba(30,58,138,0.3)"
                  }}
                >
                  <div className={`text-2xl font-bold`}
                    style={{ color: v.color === "red" ? "#f87171" :
                                   v.color === "orange" ? "#fb923c" :
                                   v.color === "yellow" ? "#facc15" :
                                   "#60a5fa" }}
                  >
                    {v.count}
                  </div>
                  <div className="text-xs text-gray-400">{v.severity}</div>
                </div>
              ))}
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Scan on push: automatic vulnerability detection</div>
              <div className="text-xs text-gray-400">Basic scanning (free) or Enhanced with Inspector</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Lifecycle Policies</h3>
            <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Automatic Image Cleanup</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Keep only 10 production images</span>
                  <span className="text-green-400 text-sm">Priority: 1</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Delete dev images older than 14 days</span>
                  <span className="text-yellow-400 text-sm">Priority: 2</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Delete untagged images older than 1 day</span>
                  <span className="text-red-400 text-sm">Priority: 3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Cross-Account Access</h3>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="text-white text-sm">Account A</div>
                <div className="text-xs text-gray-400">123456789012</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">→</div>
                <div className="bg-gray-700 rounded p-2 text-xs">
                  <div className="text-purple-400">Resource Policy</div>
                  <div className="text-gray-400">Grant access</div>
                </div>
                <div className="text-2xl mt-2">→</div>
              </div>
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="text-white text-sm">Account B</div>
                <div className="text-xs text-gray-400">987654321098</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-300">Share images across AWS accounts using ECR resource policies</div>
            </div>
          </div>
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
          <li>• ECR requires execution role with ecr:GetAuthorizationToken</li>
          <li>• Enable scan on push for automatic vulnerability detection</li>
          <li>• Lifecycle policies help manage storage costs</li>
          <li>• Cross-region replication available for DR</li>
        </ul>
      </div>
    </div>
  )
}

// 5. ECS Service Discovery Explainer
export function EcsServiceDiscoveryExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Service Discovery", description: "AWS Cloud Map enables service-to-service communication via DNS" },
    { title: "DNS Namespaces", description: "Create private DNS namespaces in Route 53 for service discovery" },
    { title: "Service Registration", description: "ECS automatically registers/deregisters tasks with Cloud Map" },
    { title: "DNS Resolution", description: "Services find each other via DNS names like service.namespace.local" },
    { title: "Health Checks", description: "Cloud Map monitors health and removes unhealthy instances" }
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
        <Server className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">ECS Service Discovery</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">AWS Cloud Map Service Discovery</h3>
            <Server className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Enables service-to-service communication via DNS</div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="text-white text-sm">Service A</div>
                <div className="text-xs text-gray-400">api.local</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">DNS Query</div>
                <div className="text-2xl">→</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">☁️</span>
                </div>
                <div className="text-white text-sm">Cloud Map</div>
                <div className="text-xs text-gray-400">Route 53</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">IP Address</div>
                <div className="text-2xl">→</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-white text-sm">Service B</div>
                <div className="text-xs text-gray-400">backend.local</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">DNS Namespaces</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Private DNS Namespace</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-mono text-sm">myapp.local</div>
                  <div className="text-xs text-gray-400 mt-1">Private namespace in Route 53</div>
                </div>
                <div className="ml-4 space-y-1">
                  <div className="bg-gray-600 rounded p-2 text-sm text-gray-300">
                    api.myapp.local
                  </div>
                  <div className="bg-gray-600 rounded p-2 text-sm text-gray-300">
                    backend.myapp.local
                  </div>
                  <div className="bg-gray-600 rounded p-2 text-sm text-gray-300">
                    db.myapp.local
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Service Registration</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Automatic Registration</div>
              <div className="text-sm text-gray-300 mb-3">ECS automatically manages task registration</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">➕</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Task Starts</div>
                    <div className="text-xs text-gray-400">ECS registers task IP with Cloud Map</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">➖</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Task Stops</div>
                    <div className="text-xs text-gray-400">ECS deregisters task from Cloud Map</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">DNS Resolution</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-3">Service Discovery in Action</div>
              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                  <div className="text-gray-400 mb-2"># Service A calls Service B</div>
                  <div className="text-green-400">curl http://backend.myapp.local/api</div>
                </div>
                <div className="text-center text-2xl">⬇️</div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Cloud Map Resolution</div>
                  <div className="font-mono text-xs text-green-400">backend.myapp.local → 10.0.1.45, 10.0.2.78</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Health Checks</h3>
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
              <div className="text-red-400 font-semibold mb-3">Automatic Health Monitoring</div>
              <div className="text-sm text-gray-300 mb-3">Cloud Map monitors task health</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-900/50 border border-green-500/50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">✓</div>
                  <div className="text-xs text-gray-300">Healthy</div>
                  <div className="text-xs text-green-400">In DNS</div>
                </div>
                <div className="bg-yellow-900/50 border border-yellow-500/50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">⚠️</div>
                  <div className="text-xs text-gray-300">Degraded</div>
                  <div className="text-xs text-yellow-400">Monitoring</div>
                </div>
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">✗</div>
                  <div className="text-xs text-gray-300">Unhealthy</div>
                  <div className="text-xs text-red-400">Removed</div>
                </div>
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

      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Cloud Map = AWS service discovery (integrates with Route 53)</li>
          <li>• ECS auto-registers tasks with service discovery</li>
          <li>• Use private DNS namespaces for internal service discovery</li>
          <li>• Supports A records (IP) and SRV records (port + IP)</li>
        </ul>
      </div>
    </div>
  )
}

// 6. ECS Load Balancing Explainer
export function EcsLoadBalancingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lbType, setLbType] = useState<"alb" | "nlb">("alb")

  const steps = [
    { title: "Load Balancer Integration", description: "ECS integrates with ALB and NLB for traffic distribution" },
    { title: "Dynamic Port Mapping", description: "ALB supports dynamic host ports - multiple tasks on same EC2" },
    { title: "Target Groups", description: "ECS auto-registers/deregisters task IPs with target groups" },
    { title: "Health Checks", description: "LB health checks determine task health, replacing unhealthy tasks" },
    { title: "ALB vs NLB", description: "ALB for HTTP/HTTPS, NLB for TCP/UDP high performance" }
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
        <Layers className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">ECS Load Balancing</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setLbType("alb")} className={`px-4 py-2 rounded-lg font-medium ${lbType === "alb" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}>ALB</button>
        <button onClick={() => setLbType("nlb")} className={`px-4 py-2 rounded-lg font-medium ${lbType === "nlb" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>NLB</button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Load Balancer Integration</h3>
            <Layers className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Distribute traffic across ECS tasks</div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🌐</span>
                </div>
                <div className="text-white text-sm">Traffic</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div className="text-white text-sm">Load Balancer</div>
                <div className="text-xs text-gray-400">ALB or NLB</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-2 bg-orange-600 rounded-lg p-2">
                    <Container className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">Task {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Dynamic Port Mapping</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Run Multiple Tasks on Same Host</div>
              <div className="text-sm text-gray-300 mb-3">ALB supports dynamic host ports</div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-white font-semibold mb-2">EC2 Instance</div>
                <div className="space-y-2 ml-4">
                  <div className="flex items-center gap-2 bg-gray-600 rounded p-2">
                    <Container className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Task 1: container port 80 → host port 32768</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-600 rounded p-2">
                    <Container className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Task 2: container port 80 → host port 32769</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-600 rounded p-2">
                    <Container className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Task 3: container port 80 → host port 32770</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Target Groups</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Auto-Registration</div>
              <div className="text-sm text-gray-300 mb-3">ECS automatically manages target group membership</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">➕</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Task Starts</div>
                    <div className="text-xs text-gray-400">ECS registers task IP:port with target group</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-700 rounded p-3">
                  <div className="text-2xl">➖</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Task Stops</div>
                    <div className="text-xs text-gray-400">ECS deregisters task from target group</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Health Checks</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-3">Load Balancer Health Monitoring</div>
              <div className="text-sm text-gray-300 mb-3">LB health checks determine task health</div>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm mb-3">
                <div className="text-gray-400 mb-1">Health Check:</div>
                <div className="text-green-400">Path: /health</div>
                <div className="text-green-400">Interval: 30s</div>
                <div className="text-green-400">Threshold: 2 consecutive checks</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-900/50 border border-green-500/50 rounded p-2 text-center">
                  <div className="text-xs text-green-400">Healthy → Receives traffic</div>
                </div>
                <div className="bg-red-900/50 border border-red-500/50 rounded p-2 text-center">
                  <div className="text-xs text-red-400">Unhealthy → Replaced</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">ALB vs NLB</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-2">ALB (Layer 7)</div>
                <div className="text-sm text-gray-300 mb-3">Application Load Balancer</div>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>✓ HTTP/HTTPS</div>
                  <div>✓ Path-based routing</div>
                  <div>✓ Host-based routing</div>
                  <div>✓ WebSocket support</div>
                  <div>✓ HTTP/2 support</div>
                  <div>✓ WAF integration</div>
                </div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-2">NLB (Layer 4)</div>
                <div className="text-sm text-gray-300 mb-3">Network Load Balancer</div>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>✓ TCP/UDP/TLS</div>
                  <div>✓ Ultra-low latency</div>
                  <div>✓ Static IP addresses</div>
                  <div>✓ Millions of RPS</div>
                  <div>✓ Preserve source IP</div>
                  <div>✓ High performance</div>
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
          <li>• ALB: Layer 7, path/host routing, HTTP/HTTPS</li>
          <li>• NLB: Layer 4, TCP/UDP, ultra-low latency, static IP</li>
          <li>• Dynamic port mapping allows multiple tasks per EC2</li>
          <li>• ECS auto-registers tasks with target groups</li>
        </ul>
      </div>
    </div>
  )
}

// 7. ECS Secrets Management Explainer
export function EcsSecretsManagementExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [secretType, setSecretType] = useState<"secrets" | "ssm">("secrets")

  const steps = [
    { title: "Secrets in ECS", description: "Inject secrets into containers without hardcoding credentials" },
    { title: "Secrets Manager", description: "Store and rotate secrets, database credentials, API keys" },
    { title: "Parameter Store", description: "Store configuration and secrets (free tier available)" },
    { title: "Task Definition", description: "Reference secrets in task definition, injected as env vars" },
    { title: "IAM Permissions", description: "Execution role needs permission to access secrets" }
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
        <Lock className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">ECS Secrets Management</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setSecretType("secrets")} className={`px-4 py-2 rounded-lg font-medium ${secretType === "secrets" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"}`}>Secrets Manager</button>
        <button onClick={() => setSecretType("ssm")} className={`px-4 py-2 rounded-lg font-medium ${secretType === "ssm" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>Parameter Store</button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Secrets in ECS</h3>
            <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Inject secrets without hardcoding credentials</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🔐</div>
                <div className="text-sm text-white">Secrets Manager</div>
                <div className="text-xs text-gray-400">Auto-rotation, secure</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm text-white">Parameter Store</div>
                <div className="text-xs text-gray-400">Free tier, config + secrets</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">AWS Secrets Manager</h3>
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
              <div className="text-yellow-400 font-semibold mb-3">Fully Managed Secret Storage</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Automatic Rotation</div>
                  <div className="text-xs text-gray-400">Rotate database credentials automatically</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Encryption</div>
                  <div className="text-xs text-gray-400">Encrypted at rest with KMS</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Cost</div>
                  <div className="text-xs text-gray-400">$0.40 per secret per month + API calls</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">SSM Parameter Store</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Configuration + Secrets Storage</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Free Tier</div>
                  <div className="text-xs text-gray-400">Standard parameters are free</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">SecureString</div>
                  <div className="text-xs text-gray-400">Encrypted parameters for sensitive data</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Limitations</div>
                  <div className="text-xs text-gray-400">No automatic rotation (standard tier)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Task Definition Reference</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🔐</span>
                </div>
                <div className="text-white text-sm">Secrets Manager</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="text-white text-sm">Task Definition</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Container className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-sm">Container</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400">
              "secrets": [{"{"}<br />
              &nbsp;&nbsp;"name": "DB_PASSWORD",<br />
              &nbsp;&nbsp;"valueFrom": "arn:aws:secretsmanager:..."<br />
              {"}"}]
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">IAM Permissions</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-3">Execution Role Permissions</div>
              <div className="text-sm text-gray-300 mb-3">ECS agent needs permission to fetch secrets</div>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs">
                <div className="text-gray-400 mb-2">Required IAM permissions:</div>
                <div className="text-green-400">• secretsmanager:GetSecretValue</div>
                <div className="text-green-400">• ssm:GetParameters</div>
                <div className="text-green-400">• kms:Decrypt (if encrypted)</div>
              </div>
              <div className="mt-3 bg-yellow-900/30 border border-yellow-500/50 rounded p-2">
                <div className="text-xs text-yellow-300">⚠️ Attach to Execution Role, not Task Role</div>
              </div>
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
          <li>• Secrets Manager: auto-rotation, cost per secret</li>
          <li>• Parameter Store: free tier, no auto-rotation (standard)</li>
          <li>• Execution role needs secretsmanager/ssm permissions</li>
          <li>• Secrets injected at task launch as env vars</li>
        </ul>
      </div>
    </div>
  )
}

// 8. ECS Capacity Providers Explainer
export function EcsCapacityProvidersExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [providerType, setProviderType] = useState<"fargate" | "ec2">("fargate")

  const steps = [
    { title: "Capacity Providers", description: "Define infrastructure strategy for running ECS tasks" },
    { title: "Fargate Providers", description: "FARGATE and FARGATE_SPOT for serverless containers" },
    { title: "EC2 Providers", description: "Auto Scaling Groups with managed scaling" },
    { title: "Capacity Strategy", description: "Mix providers with weights and base counts" },
    { title: "Cost Optimization", description: "Use Fargate Spot for 70% savings on fault-tolerant workloads" }
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
        <Cpu className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">ECS Capacity Providers</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setProviderType("fargate")} className={`px-4 py-2 rounded-lg font-medium ${providerType === "fargate" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>Fargate</button>
        <button onClick={() => setProviderType("ec2")} className={`px-4 py-2 rounded-lg font-medium ${providerType === "ec2" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300"}`}>EC2</button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">ECS Capacity Providers</h3>
            <Cpu className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Define infrastructure strategy for running tasks</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">☁️</div>
                <div className="text-sm text-white">Fargate Providers</div>
                <div className="text-xs text-gray-400">Serverless containers</div>
              </div>
              <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="text-sm text-white">EC2 Providers</div>
                <div className="text-xs text-gray-400">Auto Scaling Groups</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Fargate Providers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border-2 border-purple-500 bg-purple-900/20">
                <div className="text-lg font-bold text-purple-400 mb-2">FARGATE</div>
                <div className="text-sm text-gray-300 mb-2">On-demand pricing</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>✓ Consistent pricing</div>
                  <div>✓ Always available</div>
                  <div>✓ Production workloads</div>
                </div>
              </div>
              <div className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                <div className="text-lg font-bold text-green-400 mb-2">FARGATE_SPOT</div>
                <div className="text-sm text-gray-300 mb-2">Up to 70% savings</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>✓ Huge cost savings</div>
                  <div>⚠️ Can be interrupted</div>
                  <div>✓ Batch/fault-tolerant</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">EC2 Capacity Providers</h3>
            <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Server className="w-12 h-12 text-white" />
                </div>
                <div className="text-white font-bold mb-2">Auto Scaling Group</div>
                <div className="text-sm text-gray-400">Managed scaling based on task demand</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-700 rounded p-3 text-center">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="text-white text-sm">Scale Out</div>
                  <div className="text-xs text-gray-400">Add EC2 instances</div>
                </div>
                <div className="bg-gray-700 rounded p-3 text-center">
                  <div className="text-2xl mb-1">📉</div>
                  <div className="text-white text-sm">Scale In</div>
                  <div className="text-xs text-gray-400">Remove instances</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Capacity Provider Strategy</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Mix Multiple Providers</div>
              <div className="text-sm text-gray-300 mb-3">Combine providers with base + weight</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">FARGATE</span>
                    <span className="text-purple-400 text-xs">base: 2, weight: 1</span>
                  </div>
                  <div className="text-xs text-gray-400">Always run 2 tasks, then 1:1 ratio</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">FARGATE_SPOT</span>
                    <span className="text-green-400 text-xs">base: 0, weight: 4</span>
                  </div>
                  <div className="text-xs text-gray-400">No base, then 4:1 ratio for cost savings</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Cost Optimization</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Use Fargate Spot for Savings</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">70% Savings</div>
                  <div className="text-xs text-gray-400">Fargate Spot offers up to 70% cost reduction</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Best For</div>
                  <div className="text-xs text-gray-400">Batch jobs, CI/CD, fault-tolerant workloads</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded p-2">
                  <div className="text-xs text-yellow-300">⚠️ Tasks may be interrupted with 2-min notice</div>
                </div>
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
          <li>• FARGATE_SPOT: 70% savings, can be interrupted</li>
          <li>• EC2 capacity providers use managed Auto Scaling</li>
          <li>• Capacity strategy: base + weight distribution</li>
          <li>• Mix Fargate and Fargate Spot for cost optimization</li>
        </ul>
      </div>
    </div>
  )
}

// 9. ECS Logging Explainer
export function EcsLoggingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Container Logging", description: "Centralize container logs using log drivers in task definition" },
    { title: "awslogs Driver", description: "Send logs to CloudWatch Logs - most common approach" },
    { title: "FireLens", description: "Use Fluent Bit/Fluentd for routing to multiple destinations" },
    { title: "Log Configuration", description: "Configure log group, region, and stream prefix in task def" },
    { title: "IAM Permissions", description: "Task execution role needs logs:CreateLogStream and logs:PutLogEvents" }
  ]

  const logDrivers = [
    { name: "awslogs", dest: "CloudWatch", popular: true },
    { name: "awsfirelens", dest: "Multiple (S3, Kinesis, etc)", popular: true },
    { name: "splunk", dest: "Splunk", popular: false },
    { name: "fluentd", dest: "Fluentd", popular: false }
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
        <FileText className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">ECS Logging</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Container Logging</h3>
            <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Centralize container logs for monitoring</div>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Container className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-sm">ECS Task</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-cyan-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-sm">Log Driver</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">☁️</span>
                </div>
                <div className="text-white text-sm">CloudWatch</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">awslogs Driver</h3>
            <div className="bg-cyan-900/30 border border-cyan-500 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-3">Most Common Approach</div>
              <div className="text-sm text-gray-300 mb-3">Send logs directly to CloudWatch Logs</div>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 mb-3">
                "logConfiguration": {"{"}<br />
                &nbsp;&nbsp;"logDriver": "awslogs",<br />
                &nbsp;&nbsp;"options": {"{"}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;"awslogs-group": "/ecs/my-app",<br />
                &nbsp;&nbsp;&nbsp;&nbsp;"awslogs-region": "us-east-1",<br />
                &nbsp;&nbsp;&nbsp;&nbsp;"awslogs-stream-prefix": "ecs"<br />
                &nbsp;&nbsp;{"}"}<br />
                {"}"}
              </div>
              <div className="text-xs text-gray-400">
                • Execution role needs logs:CreateLogStream and logs:PutLogEvents
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">FireLens</h3>
            <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-3">Flexible Log Routing</div>
              <div className="text-sm text-gray-300 mb-3">Use Fluent Bit/Fluentd for routing to multiple destinations</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded p-2 text-center">
                  <div className="text-white text-sm">S3</div>
                  <div className="text-xs text-gray-400">Long-term storage</div>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <div className="text-white text-sm">Kinesis</div>
                  <div className="text-xs text-gray-400">Real-time streaming</div>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <div className="text-white text-sm">Elasticsearch</div>
                  <div className="text-xs text-gray-400">Search & analytics</div>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <div className="text-white text-sm">Datadog</div>
                  <div className="text-xs text-gray-400">Third-party tools</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Log Configuration</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Configure in Task Definition</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">awslogs-group</div>
                  <div className="text-xs text-gray-400">CloudWatch log group name</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">awslogs-region</div>
                  <div className="text-xs text-gray-400">AWS region for logs</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">awslogs-stream-prefix</div>
                  <div className="text-xs text-gray-400">Prefix for log stream names</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">awslogs-create-group</div>
                  <div className="text-xs text-gray-400">Auto-create log group (true/false)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">IAM Permissions</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-3">Execution Role Permissions</div>
              <div className="text-sm text-gray-300 mb-3">Required for awslogs driver</div>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs mb-3">
                <div className="text-gray-400 mb-2">IAM Policy:</div>
                <div className="text-green-400">• logs:CreateLogStream</div>
                <div className="text-green-400">• logs:PutLogEvents</div>
                <div className="text-green-400">• logs:CreateLogGroup (optional)</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded p-2">
                <div className="text-xs text-yellow-300">⚠️ Attach to Execution Role, not Task Role</div>
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
          <li>• awslogs: simplest way to send logs to CloudWatch</li>
          <li>• FireLens: flexible routing with Fluent Bit/Fluentd</li>
          <li>• Execution role needs logs permissions</li>
          <li>• awslogs-create-group: auto-create log group</li>
        </ul>
      </div>
    </div>
  )
}

// 10. ECR Lifecycle Policies Explainer
export function EcrLifecyclePoliciesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Lifecycle Policies", description: "Automatically clean up old or unused container images" },
    { title: "Rule Types", description: "Match by tag prefix, image age, or count" },
    { title: "Priority Order", description: "Rules evaluated by priority - lower numbers first" },
    { title: "Expiration Rules", description: "Delete images older than X days or keep only X images" },
    { title: "Cost Savings", description: "Reduce storage costs by removing unused images" }
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
        <RefreshCw className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">ECR Lifecycle Policies</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">ECR Lifecycle Policies</h3>
            <RefreshCw className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Automatically clean up old or unused images</div>
            <div className="inline-flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-lg">
              <span className="text-2xl">🗑️</span>
              <span className="text-white font-medium">Auto-cleanup old images</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Rule Types</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Match Criteria</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">imageCountMoreThan</div>
                  <div className="text-xs text-gray-400">Keep only N most recent images</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">sinceImagePushed</div>
                  <div className="text-xs text-gray-400">Delete images older than X days</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">tagPrefixList</div>
                  <div className="text-xs text-gray-400">Match images by tag prefix (e.g., "dev-")</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Priority Order</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-3">Rules Evaluated by Priority</div>
              <div className="text-sm text-gray-300 mb-3">Lower numbers evaluated first</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Keep only 10 production images</span>
                  <span className="text-green-400 text-sm">Priority: 1</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Delete dev images older than 14 days</span>
                  <span className="text-yellow-400 text-sm">Priority: 2</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Delete untagged images older than 1 day</span>
                  <span className="text-red-400 text-sm">Priority: 3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Expiration Rules</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Common Expiration Patterns</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Keep 5 production images</div>
                  <div className="font-mono text-xs text-gray-400">tagPrefixList: ["prod"], imageCountMoreThan: 5</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Delete old dev images</div>
                  <div className="font-mono text-xs text-gray-400">tagPrefixList: ["dev"], sinceImagePushed: 14</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Clean untagged immediately</div>
                  <div className="font-mono text-xs text-gray-400">tagStatus: untagged, sinceImagePushed: 1</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Cost Savings</h3>
            <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-3">Reduce Storage Costs</div>
              <div className="text-sm text-gray-300 mb-4">Lifecycle policies automatically reduce storage costs</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-white text-sm">Before</div>
                  <div className="text-xs text-red-400">1000 images</div>
                  <div className="text-xs text-gray-400">High storage cost</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-white text-sm">After</div>
                  <div className="text-xs text-green-400">50 images</div>
                  <div className="text-xs text-gray-400">95% cost reduction</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Lifecycle policies automate image cleanup</li>
          <li>• Match by: imageCountMoreThan, sinceImagePushed, tagPrefixList</li>
          <li>• Lower priority numbers evaluated first</li>
          <li>• Reduce ECR storage costs automatically</li>
        </ul>
      </div>
    </div>
  )
}

// 11. ECR Image Scanning Explainer
export function EcrImageScanningExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scanType, setScanType] = useState<"basic" | "enhanced">("basic")

  const steps = [
    { title: "Image Scanning", description: "Detect vulnerabilities in container images before deployment" },
    { title: "Basic Scanning", description: "Free CVE scanning on push using Clair database" },
    { title: "Enhanced Scanning", description: "Continuous scanning with Amazon Inspector (additional cost)" },
    { title: "Scan on Push", description: "Automatically scan images when pushed to repository" },
    { title: "Scan Results", description: "View findings by severity: Critical, High, Medium, Low" }
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
        <Shield className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">ECR Image Scanning</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setScanType("basic")} className={`px-4 py-2 rounded-lg font-medium ${scanType === "basic" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>Basic Scanning</button>
        <button onClick={() => setScanType("enhanced")} className={`px-4 py-2 rounded-lg font-medium ${scanType === "enhanced" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>Enhanced Scanning</button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">ECR Image Scanning</h3>
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Detect vulnerabilities before deployment</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm text-white">Basic Scanning</div>
                <div className="text-xs text-gray-400">Free, on-push</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="text-sm text-white">Enhanced Scanning</div>
                <div className="text-xs text-gray-400">Inspector, continuous</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Basic Scanning</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Free CVE Scanning</div>
              <div className="text-sm text-gray-300 mb-3">Scan on push using Clair database</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">When It Runs</div>
                  <div className="text-xs text-gray-400">Only when image is pushed to repository</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Vulnerability Database</div>
                  <div className="text-xs text-gray-400">Common Vulnerabilities and Exposures (CVE)</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Cost</div>
                  <div className="text-xs text-green-400">FREE</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Enhanced Scanning</h3>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-3">Amazon Inspector Integration</div>
              <div className="text-sm text-gray-300 mb-3">Continuous scanning with advanced detection</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Continuous Scanning</div>
                  <div className="text-xs text-gray-400">Automatic rescan when new vulnerabilities discovered</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Inspector Database</div>
                  <div className="text-xs text-gray-400">More comprehensive vulnerability detection</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Cost</div>
                  <div className="text-xs text-yellow-400">Per image scanned (additional cost)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Scan on Push</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Automatic Scanning</div>
              <div className="text-sm text-gray-300 mb-3">Enable in repository settings</div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">💻</span>
                  </div>
                  <div className="text-white text-sm">Push Image</div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-sm">ECR</div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-sm">Auto Scan</div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 text-xs text-green-400 text-center">
                Scan on push: Enabled ✓
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Scan Results</h3>
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
              <div className="text-red-400 font-semibold mb-3">Vulnerability Findings</div>
              <div className="text-sm text-gray-300 mb-3">Results categorized by severity</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-red-900/50 rounded">
                  <div className="text-red-400 font-bold">3</div>
                  <div className="text-xs text-gray-400">Critical</div>
                </div>
                <div className="text-center p-2 bg-orange-900/50 rounded">
                  <div className="text-orange-400 font-bold">7</div>
                  <div className="text-xs text-gray-400">High</div>
                </div>
                <div className="text-center p-2 bg-yellow-900/50 rounded">
                  <div className="text-yellow-400 font-bold">12</div>
                  <div className="text-xs text-gray-400">Medium</div>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-gray-300 font-bold">25</div>
                  <div className="text-xs text-gray-400">Low</div>
                </div>
              </div>
              <div className="mt-3 bg-yellow-900/30 border border-yellow-500/50 rounded p-2">
                <div className="text-xs text-yellow-300">⚠️ Address Critical and High severity issues before deploying</div>
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

      <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Basic scanning: free, on-push only, CVE database</li>
          <li>• Enhanced scanning: continuous, Inspector integration</li>
          <li>• Enable "scan on push" in repository settings</li>
          <li>• Results categorized by severity level</li>
        </ul>
      </div>
    </div>
  )
}

// 12. ECS Networking Modes Explainer
export function EcsNetworkingModesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [networkMode, setNetworkMode] = useState<"awsvpc" | "bridge" | "host">("awsvpc")

  const steps = [
    { title: "Network Modes", description: "ECS supports different networking modes for containers" },
    { title: "awsvpc Mode", description: "Each task gets its own ENI with private IP - required for Fargate" },
    { title: "bridge Mode", description: "Docker's built-in virtual network - EC2 launch type only" },
    { title: "host Mode", description: "Container shares host's network - EC2 launch type only" },
    { title: "Choosing Mode", description: "awsvpc for most use cases, provides best security and networking" }
  ]

  const modes = {
    awsvpc: { description: "Task ENI with private IP", fargate: true, features: ["Security groups per task", "Private IP per task", "Required for Fargate"] },
    bridge: { description: "Docker virtual network", fargate: false, features: ["Port mapping required", "Dynamic host ports", "EC2 only"] },
    host: { description: "Share host network", fargate: false, features: ["No port mapping", "Host ports used", "EC2 only"] }
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-bold text-white">ECS Networking Modes</h2>
      </div>

      <div className="flex gap-2 mb-4">
        {(Object.keys(modes) as Array<keyof typeof modes>).map(mode => (
          <button key={mode} onClick={() => setNetworkMode(mode)} className={`px-4 py-2 rounded-lg font-medium ${networkMode === mode ? "bg-teal-600 text-white" : "bg-gray-700 text-gray-300"}`}>{mode}</button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">ECS Network Modes</h3>
            <Network className="w-16 h-16 text-teal-400 mx-auto mb-4" />
            <div className="text-gray-300 mb-4">Different networking modes for containers</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🌐</div>
                <div className="text-sm text-white">awsvpc</div>
                <div className="text-xs text-gray-400">Task ENI</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🔗</div>
                <div className="text-sm text-white">bridge</div>
                <div className="text-xs text-gray-400">Docker network</div>
              </div>
              <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="text-sm text-white">host</div>
                <div className="text-xs text-gray-400">Host network</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">awsvpc Mode</h3>
            <div className="bg-teal-900/30 border border-teal-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-teal-400 font-semibold">Recommended Mode</div>
                <span className="bg-purple-600 text-xs px-2 py-1 rounded">Fargate Required</span>
              </div>
              <div className="text-sm text-gray-300 mb-3">Each task gets its own ENI with private IP</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Task ENI</div>
                  <div className="text-xs text-gray-400">Each task has its own elastic network interface</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Security Groups</div>
                  <div className="text-xs text-gray-400">Apply security groups per task</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Private IP</div>
                  <div className="text-xs text-gray-400">Each task gets unique private IP from VPC</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">VPC Flow Logs</div>
                  <div className="text-xs text-gray-400">Monitor traffic per task</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">bridge Mode</h3>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-blue-400 font-semibold">Docker Virtual Network</div>
                <span className="bg-gray-600 text-xs px-2 py-1 rounded">EC2 Only</span>
              </div>
              <div className="text-sm text-gray-300 mb-3">Docker's built-in virtual network</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Port Mapping Required</div>
                  <div className="text-xs text-gray-400">Map container ports to host ports</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Dynamic Host Ports</div>
                  <div className="text-xs text-gray-400">ALB can use dynamic port mapping</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Multiple Tasks</div>
                  <div className="text-xs text-gray-400">Run multiple tasks on same EC2 instance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">host Mode</h3>
            <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-orange-400 font-semibold">Share Host Network</div>
                <span className="bg-gray-600 text-xs px-2 py-1 rounded">EC2 Only</span>
              </div>
              <div className="text-sm text-gray-300 mb-3">Container uses host's network stack</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">No Port Mapping</div>
                  <div className="text-xs text-gray-400">Container uses host ports directly</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Higher Performance</div>
                  <div className="text-xs text-gray-400">No network translation overhead</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Port Conflicts</div>
                  <div className="text-xs text-gray-400">Cannot run multiple tasks using same port</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">Choosing the Right Mode</h3>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Best Practices</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">✓ Use awsvpc</div>
                  <div className="text-xs text-gray-400">
                    Required for Fargate, best security with per-task security groups, enables VPC features
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Use bridge</div>
                  <div className="text-xs text-gray-400">
                    When using EC2 launch type and need multiple tasks per instance with different ports
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Use host</div>
                  <div className="text-xs text-gray-400">
                    Only for special cases requiring maximum network performance (rare)
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-teal-900/30 border border-teal-500/50 rounded p-2">
                <div className="text-xs text-teal-300">💡 awsvpc is recommended for most use cases</div>
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
          <li>• awsvpc: required for Fargate, best for most cases</li>
          <li>• awsvpc gives each task its own ENI and security group</li>
          <li>• bridge/host: EC2 launch type only</li>
          <li>• awsvpc enables VPC features like flow logs per task</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const ecsExplainers = {
  "ecs-vs-fargate": EcsVsFargateExplainer,
  "task-definitions": TaskDefinitionsExplainer,
  "service-auto-scaling": ServiceAutoScalingExplainer,
  "ecr-integration": EcrIntegrationExplainer,
  "ecs-service-discovery": EcsServiceDiscoveryExplainer,
  "ecs-load-balancing": EcsLoadBalancingExplainer,
  "ecs-secrets-management": EcsSecretsManagementExplainer,
  "ecs-capacity-providers": EcsCapacityProvidersExplainer,
  "ecs-logging": EcsLoggingExplainer,
  "ecr-lifecycle-policies": EcrLifecyclePoliciesExplainer,
  "ecr-image-scanning": EcrImageScanningExplainer,
  "ecs-networking-modes": EcsNetworkingModesExplainer,
}
