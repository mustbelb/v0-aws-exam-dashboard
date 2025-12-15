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
        <div className="grid grid-cols-2 gap-6">
          {/* Architecture Diagram */}
          <div className={`p-4 rounded-lg border-2 ${
            launchType === "ec2" ? "border-blue-500 bg-blue-900/20" : "border-orange-500 bg-orange-900/20"
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${launchType === "ec2" ? "text-blue-400" : "text-orange-400"}`}>
              {launchType === "ec2" ? "EC2 Launch Type" : "Fargate Launch Type"}
            </h3>

            {launchType === "ec2" ? (
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
              </div>
            ) : (
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
              </div>
            )}
          </div>

          {/* Feature Comparison */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Features</h4>
            {(launchType === "ec2" ? ec2Features : fargateFeatures).map((feature, i) => (
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
        {selectedSection === "container" && (
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

        {selectedSection === "task" && (
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

        {selectedSection === "network" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Network Modes</h3>
            <div className="space-y-3">
              {[
                { name: "awsvpc", desc: "Each task gets own ENI (required for Fargate)", recommended: true },
                { name: "bridge", desc: "Docker's default bridge network (EC2 only)", recommended: false },
                { name: "host", desc: "Task uses host's network (EC2 only)", recommended: false },
                { name: "none", desc: "No external network connectivity", recommended: false }
              ].map((mode, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${
                  mode.recommended ? "bg-green-900/30 border border-green-600/30" : "bg-gray-700"
                }`}>
                  <div className={`w-16 font-mono text-sm ${mode.recommended ? "text-green-400" : "text-gray-400"}`}>
                    {mode.name}
                  </div>
                  <div className="text-sm text-gray-300 flex-1">{mode.desc}</div>
                  {mode.recommended && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Recommended</span>
                  )}
                </div>
              ))}
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

        {/* Scaling Indicator */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-400">Min Tasks:</span>
              <span className="text-white ml-2">1</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Target CPU:</span>
              <span className="text-yellow-400 ml-2">50%</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Max Tasks:</span>
              <span className="text-white ml-2">6</span>
            </div>
          </div>
          <div className="mt-3">
            {cpuLoad > 70 && (
              <div className="text-sm text-red-400 text-center">
                ⬆️ Scaling OUT - CPU above threshold
              </div>
            )}
            {cpuLoad < 30 && (
              <div className="text-sm text-blue-400 text-center">
                ⬇️ Scaling IN - CPU below threshold
              </div>
            )}
            {cpuLoad >= 30 && cpuLoad <= 70 && (
              <div className="text-sm text-green-400 text-center">
                ✓ Stable - CPU within target range
              </div>
            )}
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
        {!showScan ? (
          <div className="space-y-6">
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
        ) : (
          <div>
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
              <div className="text-sm text-gray-300 mb-2">Scan Configuration</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Scan on push:</span>
                  <span className="text-green-400 ml-2">Enabled</span>
                </div>
                <div>
                  <span className="text-gray-400">Enhanced scanning:</span>
                  <span className="text-yellow-400 ml-2">Inspector (additional cost)</span>
                </div>
              </div>
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
        <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs text-green-400">
          backend.myapp.local → 10.0.1.45, 10.0.2.78
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
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <span className="text-2xl">🌐</span>
            </div>
            <div className="text-white text-sm">Traffic</div>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className={`w-20 h-20 ${lbType === "alb" ? "bg-green-600" : "bg-blue-600"} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
              <span className="text-2xl">{lbType === "alb" ? "⚖️" : "🔗"}</span>
            </div>
            <div className="text-white text-sm">{lbType === "alb" ? "ALB" : "NLB"}</div>
            <div className="text-xs text-gray-400">{lbType === "alb" ? "Layer 7" : "Layer 4"}</div>
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
        <div className="mt-4 bg-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">{lbType === "alb" ? "ALB Features" : "NLB Features"}</div>
          {lbType === "alb" ? (
            <div className="text-sm text-green-400">Path routing, Host routing, HTTP/2, WebSocket, WAF</div>
          ) : (
            <div className="text-sm text-blue-400">Static IP, TCP/UDP, Ultra-low latency, Millions RPS</div>
          )}
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
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className={`w-16 h-16 ${secretType === "secrets" ? "bg-yellow-600" : "bg-blue-600"} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
              <span className="text-2xl">🔐</span>
            </div>
            <div className="text-white text-sm">{secretType === "secrets" ? "Secrets Manager" : "Parameter Store"}</div>
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
            <div className="text-xs text-gray-400">ENV: DB_PASSWORD</div>
          </div>
        </div>
        <div className="mt-4 bg-gray-700 rounded-lg p-3 font-mono text-xs text-green-400">
          {secretType === "secrets" ?
            '"secrets": [{"name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:..."}]' :
            '"secrets": [{"name": "DB_PASSWORD", "valueFrom": "arn:aws:ssm:.../DB_PASSWORD"}]'
          }
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
        {providerType === "fargate" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-purple-500 bg-purple-900/20">
              <div className="text-lg font-bold text-purple-400 mb-2">FARGATE</div>
              <div className="text-sm text-gray-300">On-demand pricing</div>
              <div className="text-xs text-gray-400 mt-2">Best for: Production, steady workloads</div>
            </div>
            <div className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
              <div className="text-lg font-bold text-green-400 mb-2">FARGATE_SPOT</div>
              <div className="text-sm text-gray-300">Up to 70% savings</div>
              <div className="text-xs text-gray-400 mt-2">Best for: Batch, fault-tolerant</div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Server className="w-12 h-12 text-white" />
            </div>
            <div className="text-white font-bold mb-2">Auto Scaling Group</div>
            <div className="text-sm text-gray-400">Managed scaling: ECS adds/removes EC2 instances based on tasks</div>
            <div className="mt-4 flex justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl text-orange-400">📈</div>
                <div className="text-xs text-gray-400">Scale Out</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-orange-400">📉</div>
                <div className="text-xs text-gray-400">Scale In</div>
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
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Log Drivers</div>
          <div className="grid grid-cols-2 gap-2">
            {logDrivers.map((driver, i) => (
              <div key={i} className={`p-3 rounded-lg ${driver.popular ? "bg-cyan-900/30 border border-cyan-500" : "bg-gray-700"}`}>
                <div className="text-white font-mono text-sm">{driver.name}</div>
                <div className="text-xs text-gray-400">→ {driver.dest}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs text-green-400">
          {`"logConfiguration": { "logDriver": "awslogs", "options": { "awslogs-group": "/ecs/my-app" }}`}
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
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-lg">
            <span className="text-2xl">🗑️</span>
            <span className="text-white font-medium">Auto-cleanup old images</span>
          </div>
        </div>
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
        <div className="mb-4">
          <div className={`p-4 rounded-lg ${scanType === "basic" ? "bg-blue-900/30 border border-blue-500" : "bg-purple-900/30 border border-purple-500"}`}>
            <div className="text-lg font-bold text-white mb-2">{scanType === "basic" ? "Basic Scanning" : "Enhanced Scanning"}</div>
            <div className="text-sm text-gray-300">{scanType === "basic" ? "On-push scanning, CVE database" : "Continuous scanning with Inspector"}</div>
            <div className="text-xs text-gray-400 mt-2">{scanType === "basic" ? "Cost: Free" : "Cost: Per image scanned"}</div>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-2">Sample Scan Results:</div>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-red-900/50 rounded"><div className="text-red-400 font-bold">3</div><div className="text-xs text-gray-400">Critical</div></div>
          <div className="text-center p-2 bg-orange-900/50 rounded"><div className="text-orange-400 font-bold">7</div><div className="text-xs text-gray-400">High</div></div>
          <div className="text-center p-2 bg-yellow-900/50 rounded"><div className="text-yellow-400 font-bold">12</div><div className="text-xs text-gray-400">Medium</div></div>
          <div className="text-center p-2 bg-gray-700 rounded"><div className="text-gray-300 font-bold">25</div><div className="text-xs text-gray-400">Low</div></div>
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
        <div className="mb-4">
          <div className="p-4 rounded-lg bg-teal-900/30 border border-teal-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-bold text-white">{networkMode}</div>
              {modes[networkMode].fargate && <span className="bg-purple-600 text-xs px-2 py-1 rounded">Fargate Compatible</span>}
            </div>
            <div className="text-sm text-gray-300 mb-3">{modes[networkMode].description}</div>
            <div className="space-y-1">
              {modes[networkMode].features.map((f, i) => (
                <div key={i} className="text-xs text-gray-400">• {f}</div>
              ))}
            </div>
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
