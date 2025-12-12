"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Globe, Server, Cloud, Zap } from "lucide-react"

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

// Export all explainers
export const elbRoute53CloudfrontExplainers = {
  "load-balancer-types": LoadBalancerTypesExplainer,
  "route53-routing-policies": Route53RoutingPoliciesExplainer,
  "cloudfront-distributions": CloudFrontDistributionsExplainer,
  "alb-target-groups": AlbTargetGroupsExplainer,
  "ssl-tls-certificates": SslTlsCertificatesExplainer,
  "health-checks": HealthChecksExplainer
}
