"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Globe, Server, Cloud, Zap, Shield, Code, Database, Timer, Users, Lock, FileText, Layers } from "lucide-react"

// 1. Load Balancer Types Explainer (Rich)
export function LoadBalancerTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lbType, setLbType] = useState<"alb" | "nlb" | "gwlb">("alb")

  const steps = [
    { title: "Elastic Load Balancing", description: "Distribute traffic across multiple targets for high availability" },
    { title: "Application LB (ALB)", description: "Layer 7 - HTTP/HTTPS, path-based routing, host-based routing" },
    { title: "Network LB (NLB)", description: "Layer 4 - TCP/UDP, ultra-low latency, millions of requests" },
    { title: "Gateway LB (GWLB)", description: "Layer 3 - Deploy virtual appliances (firewalls, IDS/IPS)" },
    { title: "Target Groups", description: "Route to EC2, ECS, Lambda, or IP addresses" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const lbTypes = {
    alb: {
      name: "Application Load Balancer",
      layer: "Layer 7",
      protocol: "HTTP/HTTPS",
      features: ["Path-based routing", "Host-based routing", "WebSocket", "HTTP/2"],
      useCase: "Microservices, containers, web apps"
    },
    nlb: {
      name: "Network Load Balancer",
      layer: "Layer 4",
      protocol: "TCP/UDP/TLS",
      features: ["Ultra-low latency", "Static IP", "Millions req/sec", "Preserve source IP"],
      useCase: "Gaming, IoT, real-time streaming"
    },
    gwlb: {
      name: "Gateway Load Balancer",
      layer: "Layer 3",
      protocol: "GENEVE",
      features: ["Transparent inspection", "Virtual appliances", "Scale firewalls"],
      useCase: "Security appliances, IDS/IPS"
    }
  }

  const currentLb = lbTypes[lbType]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Server className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Load Balancer Types</h2>
      </div>

      {/* LB Type Selector */}
      <div className="flex gap-2 mb-6">
        {Object.entries(lbTypes).map(([key, lb]) => (
          <button
            key={key}
            onClick={() => setLbType(key as typeof lbType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              lbType === key
                ? key === "alb" ? "bg-blue-600 text-white" :
                  key === "nlb" ? "bg-green-600 text-white" :
                  "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          {/* Clients */}
          <div className="text-center">
            <div className="flex flex-col gap-2 mb-2">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">💻</span>
              </div>
            </div>
            <span className="text-sm text-gray-400">Clients</span>
          </div>

          {/* Arrow */}
          <div className="text-gray-500 text-xl">→</div>

          {/* Load Balancer */}
          <div className={`p-6 rounded-lg border-2 ${
            lbType === "alb" ? "border-blue-500 bg-blue-900/20" :
            lbType === "nlb" ? "border-green-500 bg-green-900/20" :
            "border-orange-500 bg-orange-900/20"
          }`}>
            <div className="text-center">
              <div className={`text-lg font-bold mb-1 ${
                lbType === "alb" ? "text-blue-400" :
                lbType === "nlb" ? "text-green-400" :
                "text-orange-400"
              }`}>
                {lbType.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400">{currentLb.layer}</div>
              <div className="text-xs text-gray-500">{currentLb.protocol}</div>
            </div>
          </div>

          {/* Arrow */}
          <div className="text-gray-500 text-xl">→</div>

          {/* Targets */}
          <div className="text-center">
            <div className="flex flex-col gap-2 mb-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">EC2</span>
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400">Targets</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Features</div>
            <div className="flex flex-wrap gap-2">
              {currentLb.features.map((feature, i) => (
                <span key={i} className="bg-gray-600 px-2 py-1 rounded text-xs text-white">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Use Case</div>
            <div className="text-sm text-gray-300">{currentLb.useCase}</div>
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
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• ALB: Layer 7, content-based routing, WebSocket support</li>
          <li>• NLB: Layer 4, static IP, extreme performance</li>
          <li>• ALB can route to Lambda, NLB preserves source IP</li>
          <li>• Target groups can be EC2, IP, Lambda, or ECS</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Route 53 Routing Policies Explainer (Rich)
export function Route53RoutingPoliciesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [policy, setPolicy] = useState<"simple" | "weighted" | "latency" | "failover">("weighted")

  const steps = [
    { title: "Route 53", description: "Highly available DNS service with health checks and routing policies" },
    { title: "Simple Routing", description: "Single resource, no health checks" },
    { title: "Weighted Routing", description: "Distribute traffic by percentage across resources" },
    { title: "Latency Routing", description: "Route to region with lowest latency" },
    { title: "Failover Routing", description: "Active-passive with automatic failover" }
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
        <Globe className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Route 53 Routing Policies</h2>
      </div>

      {/* Policy Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "simple", label: "Simple" },
          { key: "weighted", label: "Weighted" },
          { key: "latency", label: "Latency" },
          { key: "failover", label: "Failover" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPolicy(key as typeof policy)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              policy === key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* User */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">👤</span>
            </div>
            <span className="text-sm text-gray-400">User</span>
          </div>

          {/* DNS Query */}
          <div className="flex-1 mx-2">
            <div className="text-center text-xs text-gray-400 mb-1">DNS Query</div>
            <div className="h-1 bg-blue-500 rounded" />
          </div>

          {/* Route 53 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm text-gray-400">Route 53</span>
          </div>

          {/* Routing */}
          <div className="flex-1 mx-2">
            {policy === "weighted" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-green-500 rounded" style={{ width: "70%" }} />
                  <span className="text-xs text-gray-400">70%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-yellow-500 rounded" style={{ width: "30%" }} />
                  <span className="text-xs text-gray-400">30%</span>
                </div>
              </div>
            )}
            {policy === "simple" && (
              <div className="h-1 bg-green-500 rounded" />
            )}
            {policy === "latency" && (
              <div className="text-center">
                <div className="text-xs text-green-400">Lowest Latency</div>
                <div className="h-1 bg-green-500 rounded mt-1" />
              </div>
            )}
            {policy === "failover" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-green-500 rounded flex-1" />
                  <span className="text-xs text-green-400">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-gray-600 rounded flex-1" />
                  <span className="text-xs text-gray-500">Secondary</span>
                </div>
              </div>
            )}
          </div>

          {/* Endpoints */}
          <div className="flex flex-col gap-2">
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
              policy === "failover" ? "bg-green-600" : "bg-green-600"
            }`}>
              <span className="text-white text-xs">us-e</span>
            </div>
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
              policy === "failover" ? "bg-gray-600" : "bg-yellow-600"
            }`}>
              <span className="text-white text-xs">eu-w</span>
            </div>
          </div>
        </div>

        {/* Policy Description */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          {policy === "simple" && (
            <div className="text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">Simple:</span> Returns a single value. No health checks. Good for single resource.
            </div>
          )}
          {policy === "weighted" && (
            <div className="text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">Weighted:</span> Split traffic by weight (70/30 shown). Useful for blue-green deployments.
            </div>
          )}
          {policy === "latency" && (
            <div className="text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">Latency:</span> Routes to region with lowest latency for the user. Best for global apps.
            </div>
          )}
          {policy === "failover" && (
            <div className="text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">Failover:</span> Active-passive. Health checks route to secondary if primary fails.
            </div>
          )}
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
          <li>• Weighted: A/B testing, gradual deployments</li>
          <li>• Latency: optimal performance for global users</li>
          <li>• Failover: requires health checks on primary</li>
          <li>• Geolocation: route based on user location</li>
        </ul>
      </div>
    </div>
  )
}

// 3. CloudFront Distributions Explainer (Rich)
export function CloudFrontDistributionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cacheHit, setCacheHit] = useState(true)

  const steps = [
    { title: "CloudFront CDN", description: "Global content delivery network with 400+ edge locations" },
    { title: "Origins", description: "S3 buckets, ALB, EC2, or any HTTP server" },
    { title: "Edge Caching", description: "Cache content at edge locations for low latency" },
    { title: "Cache Behaviors", description: "Configure caching rules based on path patterns" },
    { title: "Security", description: "SSL/TLS, OAI/OAC for S3, signed URLs/cookies" }
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
        <Cloud className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">CloudFront Distributions</h2>
      </div>

      {/* Cache Hit Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setCacheHit(!cacheHit)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            cacheHit ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
          }`}
        >
          {cacheHit ? "✓ Cache Hit" : "✗ Cache Miss"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* User */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">👤</span>
            </div>
            <span className="text-sm text-gray-400">User</span>
            <div className="text-xs text-gray-500">Tokyo</div>
          </div>

          {/* Arrow to Edge */}
          <div className="flex-1 mx-2">
            <div className="text-center text-xs text-green-400 mb-1">~10ms</div>
            <div className="h-1 bg-green-500 rounded" />
          </div>

          {/* Edge Location */}
          <div className="text-center">
            <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center mb-2 ${
              cacheHit ? "bg-green-600" : "bg-yellow-600"
            }`}>
              <Zap className="w-8 h-8 text-white" />
              <span className="text-xs text-white">Edge</span>
            </div>
            <span className="text-sm text-gray-400">Tokyo Edge</span>
          </div>

          {/* Arrow to Origin (dimmed if cache hit) */}
          <div className={`flex-1 mx-2 ${cacheHit ? "opacity-30" : ""}`}>
            <div className="text-center text-xs text-yellow-400 mb-1">
              {cacheHit ? "Cached!" : "~200ms"}
            </div>
            <div className={`h-1 rounded ${cacheHit ? "bg-gray-600" : "bg-yellow-500"}`} />
          </div>

          {/* Origin */}
          <div className={`text-center ${cacheHit ? "opacity-30" : ""}`}>
            <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <span className="text-2xl">🪣</span>
              <span className="text-xs text-white">S3</span>
            </div>
            <span className="text-sm text-gray-400">Origin</span>
            <div className="text-xs text-gray-500">us-east-1</div>
          </div>
        </div>

        {/* Cache Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">~10ms</div>
            <div className="text-xs text-gray-400">Cache Hit Latency</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">~200ms</div>
            <div className="text-xs text-gray-400">Cache Miss Latency</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">400+</div>
            <div className="text-xs text-gray-400">Edge Locations</div>
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
          <li>• OAC (Origin Access Control) is the new way to secure S3 origins</li>
          <li>• Cache behaviors route by path pattern (/*.jpg → S3, /api/* → ALB)</li>
          <li>• Signed URLs for individual files, Signed Cookies for multiple</li>
          <li>• Lambda@Edge runs at edge for customization</li>
        </ul>
      </div>
    </div>
  )
}

// 4. ALB Target Groups Explainer (Medium)
export function AlbTargetGroupsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [targetType, setTargetType] = useState<"instance" | "ip" | "lambda">("instance")

  const steps = [
    { title: "Target Groups", description: "Route requests to registered targets with health checks" },
    { title: "Target Types", description: "Instance (EC2), IP (ENI), Lambda, or ALB" },
    { title: "Health Checks", description: "Automatic health checks remove unhealthy targets" },
    { title: "Routing Rules", description: "Route based on path, host header, query string, etc." }
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
        <h2 className="text-2xl font-bold text-white">ALB Target Groups</h2>
      </div>

      {/* Target Type Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "instance", label: "Instance", icon: "💻" },
          { key: "ip", label: "IP", icon: "🔢" },
          { key: "lambda", label: "Lambda", icon: "λ" }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTargetType(key as typeof targetType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              targetType === key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* ALB */}
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-sm font-bold">ALB</span>
            </div>
            <span className="text-sm text-gray-400">Load Balancer</span>
          </div>

          {/* Listener Rules */}
          <div className="flex-1 mx-4">
            <div className="bg-gray-700 rounded-lg p-3 space-y-2">
              <div className="text-xs text-gray-400 mb-2">Listener Rules</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400">/api/*</span>
                <span className="text-gray-500">→</span>
                <span className="text-blue-400">api-targets</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400">/*.jpg</span>
                <span className="text-gray-500">→</span>
                <span className="text-blue-400">static-targets</span>
              </div>
            </div>
          </div>

          {/* Target Group */}
          <div className="p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
            <div className="text-blue-400 font-semibold text-sm mb-3">Target Group</div>
            <div className="flex gap-2">
              {targetType === "instance" && (
                <>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">❌</span>
                  </div>
                </>
              )}
              {targetType === "ip" && (
                <>
                  <div className="w-16 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">10.0.1.5</span>
                  </div>
                  <div className="w-16 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">10.0.2.8</span>
                  </div>
                </>
              )}
              {targetType === "lambda" && (
                <div className="w-20 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white">λ function</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Check */}
        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-300 mb-2">Health Check</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Path: </span>
              <span className="text-white">/health</span>
            </div>
            <div>
              <span className="text-gray-400">Interval: </span>
              <span className="text-white">30s</span>
            </div>
            <div>
              <span className="text-gray-400">Threshold: </span>
              <span className="text-white">2 healthy</span>
            </div>
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
          <li>• Instance targets: register by instance ID</li>
          <li>• IP targets: can include IPs outside VPC (on-premises)</li>
          <li>• Lambda targets: ALB invokes function directly</li>
          <li>• Unhealthy targets automatically removed from rotation</li>
        </ul>
      </div>
    </div>
  )
}

// 5. SSL/TLS Certificates Explainer (Medium)
export function SslTlsCertificatesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sniEnabled, setSniEnabled] = useState(true)

  const steps = [
    { title: "SSL/TLS on AWS", description: "Encrypt traffic in transit using certificates" },
    { title: "ACM (Certificate Manager)", description: "Free SSL/TLS certificates with automatic renewal" },
    { title: "SNI (Server Name Indication)", description: "Host multiple SSL sites on one load balancer" },
    { title: "SSL Termination", description: "Decrypt at ALB/NLB, or pass through to instances" }
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
        <Globe className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">SSL/TLS Certificates</h2>
      </div>

      {/* SNI Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setSniEnabled(!sniEnabled)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            sniEnabled ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          SNI: {sniEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Client */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">🔒</span>
            </div>
            <span className="text-sm text-gray-400">Client</span>
            <div className="text-xs text-green-400 mt-1">HTTPS</div>
          </div>

          {/* TLS Handshake */}
          <div className="flex-1 mx-4">
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 text-center">
              <div className="text-sm text-green-400">TLS 1.2/1.3</div>
              {sniEnabled && (
                <div className="text-xs text-gray-400 mt-1">
                  SNI: api.example.com
                </div>
              )}
            </div>
          </div>

          {/* ALB with Certs */}
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2 relative">
              <span className="text-white text-sm font-bold">ALB</span>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔐</span>
              </div>
            </div>
            <span className="text-sm text-gray-400">SSL Termination</span>
          </div>

          {/* Arrow */}
          <div className="text-gray-500 text-xl mx-2">→</div>

          {/* Backend */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-xs">HTTP</span>
            </div>
            <span className="text-sm text-gray-400">Backend</span>
          </div>
        </div>

        {/* Multiple Certs with SNI */}
        {sniEnabled && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { domain: "api.example.com", cert: "cert-1" },
              { domain: "www.example.com", cert: "cert-2" },
              { domain: "admin.example.com", cert: "cert-3" }
            ].map((item, i) => (
              <div key={i} className="bg-green-900/30 border border-green-600/50 rounded-lg p-3 text-center">
                <div className="text-green-400 text-sm">{item.domain}</div>
                <div className="text-xs text-gray-500">{item.cert}</div>
              </div>
            ))}
          </div>
        )}

        {!sniEnabled && (
          <div className="mt-6 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 text-center">
            <div className="text-yellow-400">Without SNI: One certificate per load balancer</div>
            <div className="text-xs text-gray-400 mt-1">Legacy clients may not support SNI</div>
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
          <li>• ACM certificates are free and auto-renew</li>
          <li>• SNI allows multiple SSL certs on one ALB</li>
          <li>• NLB supports TCP passthrough (no SSL termination)</li>
          <li>• CloudFront can use ACM certs (must be in us-east-1)</li>
        </ul>
      </div>
    </div>
  )
}

// 6. Health Checks Explainer (Light)
export function HealthChecksExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [healthyCount, setHealthyCount] = useState(2)

  const steps = [
    { title: "Health Checks", description: "Automatically detect and route around unhealthy targets" },
    { title: "Configuration", description: "Path, port, interval, timeout, thresholds" },
    { title: "Grace Period", description: "Wait before starting health checks on new targets" },
    { title: "Cross-Zone", description: "Distribute load evenly across all AZs" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const targets = [
    { id: 1, healthy: true },
    { id: 2, healthy: true },
    { id: 3, healthy: false }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Server className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Health Checks</h2>
      </div>

      {/* Healthy Count Slider */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Healthy Threshold: {healthyCount} consecutive checks
        </label>
        <input
          type="range"
          min="2"
          max="10"
          value={healthyCount}
          onChange={(e) => setHealthyCount(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          {/* ALB */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-xs font-bold">ALB</span>
            </div>
          </div>

          {/* Health Check Arrows */}
          <div className="flex flex-col gap-4">
            {targets.map(target => (
              <div key={target.id} className="flex items-center gap-2">
                <div className={`w-8 h-1 rounded ${target.healthy ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-gray-400">/health</span>
              </div>
            ))}
          </div>

          {/* Targets */}
          <div className="flex flex-col gap-4">
            {targets.map(target => (
              <div key={target.id} className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                target.healthy ? "bg-green-600" : "bg-red-600"
              }`}>
                <span className="text-white text-xs">
                  {target.healthy ? "✓ Healthy" : "✗ Fail"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Check Config */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Path</span>
              <div className="text-white">/health</div>
            </div>
            <div>
              <span className="text-gray-400">Interval</span>
              <div className="text-white">30 sec</div>
            </div>
            <div>
              <span className="text-gray-400">Timeout</span>
              <div className="text-white">5 sec</div>
            </div>
            <div>
              <span className="text-gray-400">Healthy</span>
              <div className="text-white">{healthyCount} checks</div>
            </div>
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
          <li>• Unhealthy targets removed from rotation automatically</li>
          <li>• Grace period prevents premature health check failures</li>
          <li>• Cross-zone balancing distributes evenly across AZs</li>
          <li>• Route 53 health checks can trigger DNS failover</li>
        </ul>
      </div>
    </div>
  )
}

// 7. Route 53 Hosted Zones Explainer
export function Route53HostedZonesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoneType, setZoneType] = useState<"public" | "private">("public")

  const steps = [
    { title: "Hosted Zones", description: "Container for DNS records for a domain" },
    { title: "Public Hosted Zone", description: "Routes traffic on the internet for a public domain" },
    { title: "Private Hosted Zone", description: "Routes traffic within VPCs for private domains" },
    { title: "NS Records", description: "Name server records delegate zone to Route 53" }
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
        <Globe className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Route 53 Hosted Zones</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setZoneType("public")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            zoneType === "public" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Public Zone
        </button>
        <button
          onClick={() => setZoneType("private")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            zoneType === "private" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Private Zone
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {zoneType === "public" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🌐</span>
                </div>
                <span className="text-sm text-gray-400">Internet</span>
              </div>
              <div className="flex-1 mx-4 h-1 bg-blue-500 rounded" />
              <div className="p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">Public Hosted Zone</div>
                <div className="text-sm text-gray-300">example.com</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="text-green-400">A: www → 54.x.x.x</div>
                  <div className="text-green-400">CNAME: api → alb.dns</div>
                </div>
              </div>
              <div className="flex-1 mx-4 h-1 bg-green-500 rounded" />
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                <Server className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Public zones resolve domain names for anyone on the internet. $0.50/month per zone.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-purple-900/20 border border-purple-500 rounded-lg">
              <div className="text-purple-400 font-semibold mb-3">Private Hosted Zone</div>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-300">VPC-A (us-east-1)</div>
                  <div className="text-xs text-green-400 mt-1">internal.corp → 10.0.1.5</div>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-300">VPC-B (eu-west-1)</div>
                  <div className="text-xs text-green-400 mt-1">internal.corp → 10.1.2.8</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Private zones resolve within associated VPCs only. Enable DNS hostnames in VPC.
            </div>
          </div>
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

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Public zones: internet-accessible domain resolution</li>
          <li>• Private zones: VPC-only resolution, associate with multiple VPCs</li>
          <li>• Private zones require enableDnsHostnames and enableDnsSupport</li>
          <li>• Split-horizon DNS: same domain, different public/private records</li>
        </ul>
      </div>
    </div>
  )
}

// 8. CloudFront Lambda@Edge Explainer
export function CloudFrontLambdaEdgeExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [triggerType, setTriggerType] = useState<"viewer-request" | "origin-request" | "origin-response" | "viewer-response">("viewer-request")

  const steps = [
    { title: "Lambda@Edge", description: "Run Lambda functions at CloudFront edge locations" },
    { title: "Viewer Request", description: "Modify request before cache check (auth, A/B testing)" },
    { title: "Origin Request", description: "Modify request to origin on cache miss" },
    { title: "Origin Response", description: "Modify response from origin before caching" },
    { title: "Viewer Response", description: "Modify response to viewer after cache" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const triggers = {
    "viewer-request": { label: "Viewer Request", pos: 1, desc: "Before cache lookup" },
    "origin-request": { label: "Origin Request", pos: 2, desc: "On cache miss" },
    "origin-response": { label: "Origin Response", pos: 3, desc: "After origin responds" },
    "viewer-response": { label: "Viewer Response", pos: 4, desc: "Before viewer response" }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Lambda@Edge</h2>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(triggers).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setTriggerType(key as typeof triggerType)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              triggerType === key ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-2">
          <div className="text-center">
            <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-xl">👤</span>
            </div>
            <span className="text-xs text-gray-400">Viewer</span>
          </div>

          <div className={`p-2 rounded-lg transition-all ${triggerType === "viewer-request" ? "bg-orange-600" : "bg-gray-700"}`}>
            <Code className="w-4 h-4 text-white" />
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs text-gray-400">Edge Cache</span>
          </div>

          <div className={`p-2 rounded-lg transition-all ${triggerType === "origin-request" ? "bg-orange-600" : "bg-gray-700"}`}>
            <Code className="w-4 h-4 text-white" />
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-400">Origin</span>
          </div>

          <div className={`p-2 rounded-lg transition-all ${triggerType === "origin-response" ? "bg-orange-600" : "bg-gray-700"}`}>
            <Code className="w-4 h-4 text-white" />
          </div>

          <div className={`p-2 rounded-lg transition-all ${triggerType === "viewer-response" ? "bg-orange-600" : "bg-gray-700"}`}>
            <Code className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <div className="text-orange-400 font-semibold mb-2">{triggers[triggerType].label}</div>
          <div className="text-sm text-gray-300">{triggers[triggerType].desc}</div>
          <div className="mt-2 text-xs text-gray-400">
            {triggerType === "viewer-request" && "Use cases: Auth, URL rewrites, A/B testing, device detection"}
            {triggerType === "origin-request" && "Use cases: Dynamic origin selection, add headers"}
            {triggerType === "origin-response" && "Use cases: Modify cache headers, compress images"}
            {triggerType === "viewer-response" && "Use cases: Add security headers, modify cookies"}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
            <div className="text-sm font-semibold text-orange-400">Lambda@Edge</div>
            <div className="text-xs text-gray-300 mt-1">Node.js/Python, up to 10GB, 30s timeout</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
            <div className="text-sm font-semibold text-blue-400">CloudFront Functions</div>
            <div className="text-xs text-gray-300 mt-1">JavaScript only, lightweight, 1ms max</div>
          </div>
        </div>
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

      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Lambda@Edge must be in us-east-1, replicates to edges</li>
          <li>• CloudFront Functions: simpler, faster, cheaper for lightweight ops</li>
          <li>• Viewer triggers run on every request, origin triggers on cache miss</li>
          <li>• Use for auth, A/B testing, URL rewrites, dynamic content</li>
        </ul>
      </div>
    </div>
  )
}

// 9. CloudFront Origin Access Control Explainer
export function CloudFrontOACExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [accessType, setAccessType] = useState<"public" | "oac">("oac")

  const steps = [
    { title: "Origin Access Control", description: "Secure S3 origins so only CloudFront can access them" },
    { title: "OAC vs OAI", description: "OAC is the modern replacement for Origin Access Identity" },
    { title: "S3 Bucket Policy", description: "Grant CloudFront service principal access" },
    { title: "Benefits", description: "Prevent direct S3 access, enforce HTTPS, KMS support" }
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
        <Lock className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">CloudFront Origin Access Control</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAccessType("public")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            accessType === "public" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Public S3 (Insecure)
        </button>
        <button
          onClick={() => setAccessType("oac")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            accessType === "oac" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          With OAC (Secure)
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {accessType === "public" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">User → CloudFront → S3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">User → S3 directly (bypasses CDN!)</span>
                </div>
              </div>
              <div className="p-4 bg-red-900/30 border-2 border-red-500 rounded-lg">
                <div className="text-red-400 font-semibold">⚠️ Public Bucket</div>
                <div className="text-xs text-gray-400 mt-1">Anyone can access directly</div>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-300">
              Problem: Users can bypass CloudFront and access S3 directly, skipping caching, WAF, and logging.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>
              <div className="flex-1 h-1 bg-green-500 rounded" />
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2 relative">
                  <Cloud className="w-8 h-8 text-white" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span className="text-xs text-gray-400">CloudFront</span>
              </div>
              <div className="flex-1">
                <div className="h-1 bg-green-500 rounded" />
                <div className="text-xs text-green-400 text-center mt-1">OAC</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                </div>
                <span className="text-xs text-gray-400">Private S3</span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-green-400 mb-2">S3 Bucket Policy</div>
              <pre className="text-xs text-gray-300 bg-gray-800 p-2 rounded overflow-x-auto">
{`{
  "Principal": {
    "Service": "cloudfront.amazonaws.com"
  },
  "Condition": {
    "StringEquals": {
      "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT:distribution/ID"
    }
  }
}`}
              </pre>
            </div>
          </div>
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

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• OAC is the recommended way (replaces legacy OAI)</li>
          <li>• OAC supports SSE-KMS encrypted buckets</li>
          <li>• S3 bucket can be private, only CloudFront accesses it</li>
          <li>• Prevents bypassing CDN, ensures all traffic goes through CloudFront</li>
        </ul>
      </div>
    </div>
  )
}

// 10. NLB Static IP Explainer
export function NlbStaticIpExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "NLB Static IP", description: "Network Load Balancer provides one static IP per AZ" },
    { title: "Elastic IP", description: "Optionally assign your own Elastic IPs" },
    { title: "Whitelist Friendly", description: "Fixed IPs for firewall rules and DNS" },
    { title: "PrivateLink", description: "Expose services via NLB endpoint services" }
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
        <Server className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">NLB Static IP & PrivateLink</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-green-400">Static IPs per AZ</div>
            <div className="space-y-2">
              {[
                { az: "us-east-1a", ip: "52.1.2.3" },
                { az: "us-east-1b", ip: "52.4.5.6" },
                { az: "us-east-1c", ip: "52.7.8.9" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-700 rounded-lg p-3">
                  <div className="w-20 text-sm text-gray-400">{item.az}</div>
                  <div className="flex-1 h-1 bg-green-500 rounded" />
                  <div className="font-mono text-green-400">{item.ip}</div>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Each AZ gets one static IP (or your Elastic IP)
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-lg font-semibold text-purple-400">PrivateLink (Endpoint Service)</div>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-xs text-white">VPC-A</span>
                  </div>
                  <span className="text-xs text-gray-400">Consumer</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="h-1 bg-purple-500 rounded" />
                  <div className="text-xs text-purple-400 mt-1">PrivateLink</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-xs text-white">NLB</span>
                  </div>
                  <span className="text-xs text-gray-400">Provider</span>
                </div>
              </div>
              <div className="text-xs text-gray-300 mt-3">
                Expose your service to other VPCs/accounts privately
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-300 mb-2">ALB vs NLB IP Behavior</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-900/30 p-3 rounded">
              <div className="text-blue-400 font-semibold">ALB</div>
              <div className="text-gray-300">Dynamic IPs, use DNS name only</div>
            </div>
            <div className="bg-green-900/30 p-3 rounded">
              <div className="text-green-400 font-semibold">NLB</div>
              <div className="text-gray-300">Static IPs, whitelist-friendly</div>
            </div>
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

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• NLB: 1 static IP per AZ, can use Elastic IPs</li>
          <li>• ALB: dynamic IPs only, always use DNS name</li>
          <li>• PrivateLink: expose services privately via NLB endpoint</li>
          <li>• NLB preserves source IP, ALB needs X-Forwarded-For</li>
        </ul>
      </div>
    </div>
  )
}

// 11. Route 53 Record Types Explainer
export function Route53RecordTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordType, setRecordType] = useState<"a" | "cname" | "alias" | "mx">("alias")

  const steps = [
    { title: "DNS Record Types", description: "Different record types serve different purposes" },
    { title: "A/AAAA Records", description: "Map hostname to IPv4/IPv6 address" },
    { title: "CNAME Records", description: "Map hostname to another hostname (not apex)" },
    { title: "Alias Records", description: "AWS-native, free queries, works at apex" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const records = {
    a: {
      name: "A Record",
      example: "www.example.com → 54.x.x.x",
      description: "Maps to IPv4 address",
      canApex: true
    },
    cname: {
      name: "CNAME",
      example: "api.example.com → lb.aws.com",
      description: "Maps to another domain name",
      canApex: false
    },
    alias: {
      name: "Alias (AWS)",
      example: "example.com → d123.cloudfront.net",
      description: "Maps to AWS resources, free queries",
      canApex: true
    },
    mx: {
      name: "MX Record",
      example: "example.com → mail.example.com",
      description: "Mail exchange server",
      canApex: true
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Route 53 Record Types</h2>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(records).map(([key, { name }]) => (
          <button
            key={key}
            onClick={() => setRecordType(key as typeof recordType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              recordType === key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-lg font-semibold text-blue-400 mb-2">{records[recordType].name}</div>
          <div className="font-mono text-green-400 mb-2">{records[recordType].example}</div>
          <div className="text-sm text-gray-300">{records[recordType].description}</div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${records[recordType].canApex ? "bg-green-600" : "bg-red-600"}`}>
              {records[recordType].canApex ? "✓ Can use at apex" : "✗ Cannot use at apex"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">CNAME vs Alias</div>
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-gray-600">
                  <td className="py-1 text-gray-400">Apex domain</td>
                  <td className="text-red-400">CNAME: No</td>
                  <td className="text-green-400">Alias: Yes</td>
                </tr>
                <tr className="border-b border-gray-600">
                  <td className="py-1 text-gray-400">Query cost</td>
                  <td className="text-yellow-400">CNAME: Paid</td>
                  <td className="text-green-400">Alias: Free</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-400">Health checks</td>
                  <td className="text-gray-400">CNAME: Yes</td>
                  <td className="text-green-400">Alias: Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-green-400 mb-2">Alias Targets</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• CloudFront distributions</li>
              <li>• ELB (ALB, NLB, CLB)</li>
              <li>• S3 website endpoints</li>
              <li>• API Gateway</li>
              <li>• Another Route 53 record</li>
            </ul>
          </div>
        </div>
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

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• CNAME cannot be used at zone apex (example.com)</li>
          <li>• Alias is AWS-only, free queries, works at apex</li>
          <li>• Always prefer Alias for AWS resources</li>
          <li>• Alias auto-updates when target IP changes</li>
        </ul>
      </div>
    </div>
  )
}

// 12. Connection Draining Explainer
export function ConnectionDrainingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [drainingTime, setDrainingTime] = useState(300)

  const steps = [
    { title: "Connection Draining", description: "Gracefully complete in-flight requests before deregistering" },
    { title: "Deregistration Delay", description: "Time to wait before removing target (1-3600 seconds)" },
    { title: "New Connections", description: "No new requests sent to draining targets" },
    { title: "Use Cases", description: "Deployments, scaling down, maintenance" }
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
        <Timer className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Connection Draining</h2>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Deregistration Delay: {drainingTime} seconds
        </label>
        <input
          type="range"
          min="0"
          max="3600"
          step="60"
          value={drainingTime}
          onChange={(e) => setDrainingTime(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 (disabled)</span>
          <span>300 (default)</span>
          <span>3600 (max)</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-xs font-bold">ALB</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <div className="flex-1 h-1 bg-green-500 rounded" />
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-xs text-green-400">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
              <div className="flex-1 h-1 bg-yellow-500 rounded" />
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-yellow-400">Draining</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full" />
              <div className="flex-1 h-1 bg-gray-500 rounded opacity-30" />
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">✗</span>
              </div>
              <span className="text-xs text-gray-400">Deregistered</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <div className="text-sm font-semibold text-yellow-400 mb-2">During Draining ({drainingTime}s)</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Existing connections continue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">✗</span>
              <span className="text-gray-300">No new connections</span>
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

      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Default: 300 seconds, Range: 0-3600 seconds</li>
          <li>• Set to 0 to disable (immediate deregistration)</li>
          <li>• Essential for zero-downtime deployments</li>
          <li>• In-flight requests complete, no new requests</li>
        </ul>
      </div>
    </div>
  )
}

// 13. Sticky Sessions Explainer
export function StickySessionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stickyType, setStickyType] = useState<"duration" | "app">("duration")

  const steps = [
    { title: "Sticky Sessions", description: "Route user requests to the same target (session affinity)" },
    { title: "Duration-Based", description: "ALB generates cookie with configurable expiration" },
    { title: "Application-Based", description: "Your app generates cookie, ALB routes by it" },
    { title: "Trade-offs", description: "Can cause uneven load distribution" }
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
        <Users className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Sticky Sessions (Session Affinity)</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStickyType("duration")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            stickyType === "duration" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Duration-Based
        </button>
        <button
          onClick={() => setStickyType("app")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            stickyType === "app" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Application-Based
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">👤</span>
            </div>
            <span className="text-xs text-gray-400">User</span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="h-1 bg-purple-500 rounded" />
            <div className="text-center text-xs text-purple-400">
              Cookie: {stickyType === "duration" ? "AWSALB" : "CUSTOM_COOKIE"}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-xs font-bold">ALB</span>
            </div>
          </div>

          <div className="flex-1 h-1 bg-green-500 rounded" />

          <div className="flex flex-col gap-2">
            <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center border-2 border-yellow-400">
              <span className="text-white text-xs">Target</span>
            </div>
            <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Target</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${stickyType === "duration" ? "bg-purple-900/30 border-purple-500" : "bg-gray-700 border-gray-600"}`}>
            <div className="text-sm font-semibold text-purple-400 mb-2">Duration-Based</div>
            <div className="text-xs text-gray-300 space-y-1">
              <div>• Cookie: AWSALB (ALB generates)</div>
              <div>• Expiration: 1 sec - 7 days</div>
              <div>• Simpler to configure</div>
            </div>
          </div>
          <div className={`p-4 rounded-lg border ${stickyType === "app" ? "bg-blue-900/30 border-blue-500" : "bg-gray-700 border-gray-600"}`}>
            <div className="text-sm font-semibold text-blue-400 mb-2">Application-Based</div>
            <div className="text-xs text-gray-300 space-y-1">
              <div>• Cookie: Your app generates</div>
              <div>• Custom cookie name</div>
              <div>• More control over session</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3">
          <div className="text-sm text-yellow-400 font-semibold mb-1">⚠️ Trade-off</div>
          <div className="text-xs text-gray-300">
            Stickiness can cause uneven load if one target gets more long-lived sessions.
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

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Use for stateful applications that store session locally</li>
          <li>• Duration-based: AWSALB cookie, 1s-7d expiration</li>
          <li>• Application-based: your cookie name, more control</li>
          <li>• Consider external session store (ElastiCache) instead</li>
        </ul>
      </div>
    </div>
  )
}

// 14. CloudFront Signed URLs Explainer
export function CloudFrontSignedUrlsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [accessType, setAccessType] = useState<"url" | "cookie">("url")

  const steps = [
    { title: "Signed URLs/Cookies", description: "Restrict access to CloudFront content" },
    { title: "Signed URL", description: "Access a single file with expiration" },
    { title: "Signed Cookie", description: "Access multiple files with one cookie" },
    { title: "Trusted Key Groups", description: "Use public/private key pairs for signing" }
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
        <Shield className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">CloudFront Signed URLs & Cookies</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAccessType("url")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            accessType === "url" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Signed URL
        </button>
        <button
          onClick={() => setAccessType("cookie")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            accessType === "cookie" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Signed Cookie
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {accessType === "url" ? (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-green-400">Signed URL</div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Single file access with embedded policy:</div>
              <div className="font-mono text-xs text-green-400 bg-gray-800 p-2 rounded break-all">
                https://d123.cloudfront.net/video.mp4?<br/>
                Policy=eyJ...&<br/>
                Signature=abc...&<br/>
                Key-Pair-Id=K12345
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Expiration</div>
                <div className="text-sm text-white">24 hours</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-xs text-gray-400">IP Restriction</div>
                <div className="text-sm text-white">Optional</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Files</div>
                <div className="text-sm text-white">1 file</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-blue-400">Signed Cookie</div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Multiple file access via cookies:</div>
              <div className="space-y-2 font-mono text-xs bg-gray-800 p-2 rounded">
                <div className="text-blue-400">Set-Cookie: CloudFront-Policy=...</div>
                <div className="text-blue-400">Set-Cookie: CloudFront-Signature=...</div>
                <div className="text-blue-400">Set-Cookie: CloudFront-Key-Pair-Id=...</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Expiration</div>
                <div className="text-sm text-white">Configurable</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Path Pattern</div>
                <div className="text-sm text-white">/videos/*</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-xs text-gray-400">Files</div>
                <div className="text-sm text-white">Multiple</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-300 mb-2">When to Use</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-400 font-semibold">Signed URL</div>
              <ul className="text-xs text-gray-300 mt-1 space-y-1">
                <li>• Single file downloads</li>
                <li>• RTMP streaming</li>
                <li>• Client doesn't support cookies</li>
              </ul>
            </div>
            <div>
              <div className="text-blue-400 font-semibold">Signed Cookie</div>
              <ul className="text-xs text-gray-300 mt-1 space-y-1">
                <li>• Multiple restricted files</li>
                <li>• HLS/DASH streaming</li>
                <li>• Don't want to change URLs</li>
              </ul>
            </div>
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

      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Signed URL: one file, Signed Cookie: multiple files</li>
          <li>• Use trusted key groups (not root account)</li>
          <li>• S3 pre-signed URLs are different (direct S3 access)</li>
          <li>• Can restrict by IP, expiration date, path pattern</li>
        </ul>
      </div>
    </div>
  )
}

// 15. Cross-Zone Load Balancing Explainer
export function CrossZoneLoadBalancingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [crossZone, setCrossZone] = useState(true)

  const steps = [
    { title: "Cross-Zone Load Balancing", description: "Distribute traffic evenly across all targets in all AZs" },
    { title: "Without Cross-Zone", description: "Each AZ node distributes only to its AZ targets" },
    { title: "With Cross-Zone", description: "Each node distributes to all registered targets" },
    { title: "Default Behavior", description: "ALB: enabled free, NLB: disabled by default" }
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
        <Layers className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Cross-Zone Load Balancing</h2>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setCrossZone(!crossZone)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            crossZone ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Cross-Zone: {crossZone ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {/* AZ-A */}
          <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
            <div className="text-blue-400 font-semibold mb-3">AZ-A (50% traffic)</div>
            <div className="text-center mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white text-xs">LB</span>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">{crossZone ? "25%" : "50%"}</span>
              </div>
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">1 target</div>
          </div>

          {/* AZ-B */}
          <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
            <div className="text-green-400 font-semibold mb-3">AZ-B (50% traffic)</div>
            <div className="text-center mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white text-xs">LB</span>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">{crossZone ? "25%" : "17%"}</span>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">{crossZone ? "25%" : "17%"}</span>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">{crossZone ? "25%" : "17%"}</span>
              </div>
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">3 targets</div>
          </div>
        </div>

        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <div className={`text-sm ${crossZone ? "text-green-400" : "text-yellow-400"}`}>
            {crossZone ? (
              <span>✓ Even distribution: Each target gets 25% (total 4 targets)</span>
            ) : (
              <span>⚠️ Uneven: AZ-A target gets 50%, AZ-B targets get ~17% each</span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-900/30 rounded-lg p-3">
            <div className="text-blue-400 font-semibold">ALB</div>
            <div className="text-gray-300">Always enabled, no extra charge</div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-3">
            <div className="text-green-400 font-semibold">NLB</div>
            <div className="text-gray-300">Disabled by default, charges apply</div>
          </div>
        </div>
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

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• ALB: cross-zone always on, free</li>
          <li>• NLB/GWLB: disabled by default, charges for inter-AZ</li>
          <li>• Without cross-zone: uneven load if AZ target counts differ</li>
          <li>• Enable for even distribution across all targets</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const elbRoute53CloudfrontExplainers = {
  "load-balancer-types": LoadBalancerTypesExplainer,
  "route53-routing-policies": Route53RoutingPoliciesExplainer,
  "cloudfront-distributions": CloudFrontDistributionsExplainer,
  "alb-target-groups": AlbTargetGroupsExplainer,
  "ssl-tls-certificates": SslTlsCertificatesExplainer,
  "health-checks": HealthChecksExplainer,
  "route53-hosted-zones": Route53HostedZonesExplainer,
  "cloudfront-lambda-edge": CloudFrontLambdaEdgeExplainer,
  "cloudfront-oac": CloudFrontOACExplainer,
  "nlb-static-ip": NlbStaticIpExplainer,
  "route53-record-types": Route53RecordTypesExplainer,
  "connection-draining": ConnectionDrainingExplainer,
  "sticky-sessions": StickySessionsExplainer,
  "cloudfront-signed-urls": CloudFrontSignedUrlsExplainer,
  "cross-zone-load-balancing": CrossZoneLoadBalancingExplainer
}
