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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-gray-400">Multiple Clients</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <Server className="w-12 h-12 text-white" />
                </div>
                <span className="text-sm text-gray-400">Load Balancer</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">EC2</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-400">Targets</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">ELB distributes incoming traffic across multiple targets (EC2, containers, IPs) in one or more Availability Zones, ensuring high availability and fault tolerance.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💻</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">HTTP/HTTPS</span>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="p-6 rounded-lg border-2 border-blue-500 bg-blue-900/20">
                <div className="text-center">
                  <div className="text-lg font-bold mb-1 text-blue-400">ALB</div>
                  <div className="text-xs text-gray-400">Layer 7</div>
                  <div className="text-xs text-gray-500">HTTP/HTTPS</div>
                </div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {lbTypes.alb.features.map((feature, i) => (
                    <span key={i} className="bg-gray-600 px-2 py-1 rounded text-xs text-white">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-2">Use Case</div>
                <div className="text-sm text-gray-300">{lbTypes.alb.useCase}</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎮</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📡</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">TCP/UDP</span>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="p-6 rounded-lg border-2 border-green-500 bg-green-900/20">
                <div className="text-center">
                  <div className="text-lg font-bold mb-1 text-green-400">NLB</div>
                  <div className="text-xs text-gray-400">Layer 4</div>
                  <div className="text-xs text-gray-500">TCP/UDP/TLS</div>
                </div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {lbTypes.nlb.features.map((feature, i) => (
                    <span key={i} className="bg-gray-600 px-2 py-1 rounded text-xs text-white">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-2">Use Case</div>
                <div className="text-sm text-gray-300">{lbTypes.nlb.useCase}</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🌐</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">Traffic</span>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="p-6 rounded-lg border-2 border-orange-500 bg-orange-900/20">
                <div className="text-center">
                  <div className="text-lg font-bold mb-1 text-orange-400">GWLB</div>
                  <div className="text-xs text-gray-400">Layer 3</div>
                  <div className="text-xs text-gray-500">GENEVE</div>
                </div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="text-center">
                <div className="flex flex-col gap-2 mb-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-400">Firewalls</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {lbTypes.gwlb.features.map((feature, i) => (
                    <span key={i} className="bg-gray-600 px-2 py-1 rounded text-xs text-white">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-2">Use Case</div>
                <div className="text-sm text-gray-300">{lbTypes.gwlb.useCase}</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-purple-400 mb-4">Target Group Types</div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="text-xs text-gray-300">Instance ID</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">IP</span>
                  </div>
                  <div className="text-xs text-gray-300">IP Address</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">λ</span>
                  </div>
                  <div className="text-xs text-gray-300">Lambda</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">ALB</span>
                  </div>
                  <div className="text-xs text-gray-300">ALB</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">Target Groups route requests to one or more registered targets. Health checks automatically remove unhealthy targets from the rotation.</p>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🌍</span>
                </div>
                <span className="text-sm text-gray-400">Global Users</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-12 h-12 text-white" />
                </div>
                <span className="text-sm text-gray-400">Route 53 DNS</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="flex gap-2 mb-2">
                  {["us-e", "eu-w", "ap-s"].map(region => (
                    <div key={region} className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">{region}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-400">Endpoints</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Route 53 is a highly available and scalable DNS service with intelligent routing policies, health checks, and domain registration.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="text-center text-xs text-gray-400 mb-1">DNS Query</div>
                <div className="h-1 bg-blue-500 rounded" />
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">Route 53</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="h-1 bg-green-500 rounded" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">us-e</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300">
                <span className="text-blue-400 font-semibold">Simple:</span> Returns a single value. No health checks. Good for single resource.
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="text-center text-xs text-gray-400 mb-1">DNS Query</div>
                <div className="h-1 bg-blue-500 rounded" />
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">Route 53</span>
              </div>
              <div className="flex-1 mx-2">
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
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">us-e</span>
                </div>
                <div className="w-14 h-14 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">eu-w</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300">
                <span className="text-blue-400 font-semibold">Weighted:</span> Split traffic by weight (70/30 shown). Useful for blue-green deployments.
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
                <div className="text-xs text-gray-500">Tokyo</div>
              </div>
              <div className="flex-1 mx-2">
                <div className="text-center text-xs text-gray-400 mb-1">DNS Query</div>
                <div className="h-1 bg-blue-500 rounded" />
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">Route 53</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="text-center">
                  <div className="text-xs text-green-400">Lowest Latency</div>
                  <div className="h-1 bg-green-500 rounded mt-1" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">ap-s</span>
                </div>
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center opacity-50">
                  <span className="text-white text-xs">us-e</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300">
                <span className="text-blue-400 font-semibold">Latency:</span> Routes to region with lowest latency for the user. Best for global apps.
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="text-center text-xs text-gray-400 mb-1">DNS Query</div>
                <div className="h-1 bg-blue-500 rounded" />
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">Route 53</span>
              </div>
              <div className="flex-1 mx-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-green-500 rounded flex-1" />
                    <span className="text-xs text-green-400">Primary ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gray-600 rounded flex-1" />
                    <span className="text-xs text-gray-500">Secondary (Standby)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">us-e</span>
                </div>
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">eu-w</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300">
                <span className="text-blue-400 font-semibold">Failover:</span> Active-passive. Health checks route to secondary if primary fails.
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🌍</span>
                </div>
                <span className="text-sm text-gray-400">Global Users</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-12 h-12 text-white" />
                </div>
                <span className="text-sm text-gray-400">CloudFront CDN</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="flex gap-2 mb-2">
                  {["Edge1", "Edge2", "Edge3"].map(edge => (
                    <div key={edge} className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-400">400+ Edge Locations</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">CloudFront is a global content delivery network (CDN) that caches content at edge locations worldwide for low-latency access.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-orange-400 mb-4">CloudFront Origins</div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🪣</span>
                  </div>
                  <div className="text-xs text-gray-300">S3 Bucket</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">ALB</span>
                  </div>
                  <div className="text-xs text-gray-300">ALB</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-300">EC2/On-Prem</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-300">HTTP Server</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">Origins are the source servers where CloudFront retrieves content. Can be S3, ALB, EC2, or any HTTP server.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
                <div className="text-xs text-gray-500">Tokyo</div>
              </div>
              <div className="flex-1 mx-2">
                <div className="text-center text-xs text-green-400 mb-1">~10ms</div>
                <div className="h-1 bg-green-500 rounded" />
              </div>
              <div className="text-center">
                <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center mb-2 ${
                  cacheHit ? "bg-green-600" : "bg-yellow-600"
                }`}>
                  <Zap className="w-8 h-8 text-white" />
                  <span className="text-xs text-white">Edge</span>
                </div>
                <span className="text-sm text-gray-400">Tokyo Edge</span>
              </div>
              <div className={`flex-1 mx-2 ${cacheHit ? "opacity-30" : ""}`}>
                <div className="text-center text-xs text-yellow-400 mb-1">
                  {cacheHit ? "Cached!" : "~200ms"}
                </div>
                <div className={`h-1 rounded ${cacheHit ? "bg-gray-600" : "bg-yellow-500"}`} />
              </div>
              <div className={`text-center ${cacheHit ? "opacity-30" : ""}`}>
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                  <span className="text-xs text-white">S3</span>
                </div>
                <span className="text-sm text-gray-400">Origin</span>
                <div className="text-xs text-gray-500">us-east-1</div>
              </div>
            </div>
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
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-orange-400 mb-4">Cache Behaviors</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">/images/*.jpg</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-blue-400">S3 Origin</span>
                  <span className="text-gray-400 text-xs">TTL: 86400s</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">/api/*</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-purple-400">ALB Origin</span>
                  <span className="text-gray-400 text-xs">TTL: 0s</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">/static/*</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-blue-400">S3 Origin</span>
                  <span className="text-gray-400 text-xs">TTL: 3600s</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">Cache behaviors define different caching rules based on URL path patterns, allowing different origins and TTLs per path.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-orange-400 mb-4">Security Features</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">OAC/OAI</span>
                  </div>
                  <p className="text-xs text-gray-300">Restrict S3 access to CloudFront only</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">SSL/TLS</span>
                  </div>
                  <p className="text-xs text-gray-300">HTTPS encryption with ACM certificates</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">Signed URLs</span>
                  </div>
                  <p className="text-xs text-gray-300">Time-limited access to individual files</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">Signed Cookies</span>
                  </div>
                  <p className="text-xs text-gray-300">Access to multiple restricted files</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">CloudFront provides multiple security features to protect content and control access.</p>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">ALB</span>
                </div>
                <span className="text-sm text-gray-400">Load Balancer</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">Target Group</div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">EC2</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Target Groups route requests to registered targets and automatically perform health checks to remove unhealthy targets from rotation.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-blue-400 mb-4">Target Types</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">EC2</span>
                  </div>
                  <div className="text-sm text-gray-300 font-semibold">Instance</div>
                  <div className="text-xs text-gray-400">Register by instance ID</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">IP</span>
                  </div>
                  <div className="text-sm text-gray-300 font-semibold">IP Address</div>
                  <div className="text-xs text-gray-400">Can be outside VPC</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs">λ</span>
                  </div>
                  <div className="text-sm text-gray-300 font-semibold">Lambda</div>
                  <div className="text-xs text-gray-400">Invoke functions</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">ALB can route to EC2 instances, IP addresses (including on-premises servers), or Lambda functions.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">ALB</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { healthy: true, id: 1 },
                  { healthy: true, id: 2 },
                  { healthy: false, id: 3 }
                ].map(target => (
                  <div key={target.id} className="flex items-center gap-2">
                    <div className={`w-8 h-1 rounded ${target.healthy ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs text-gray-400">/health</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { healthy: true, label: "✓ Healthy" },
                  { healthy: true, label: "✓ Healthy" },
                  { healthy: false, label: "✗ Unhealthy" }
                ].map((target, i) => (
                  <div key={i} className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    target.healthy ? "bg-green-600" : "bg-red-600"
                  }`}>
                    <span className="text-white text-xs">{target.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
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
                  <span className="text-gray-400">Threshold</span>
                  <div className="text-white">2 checks</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-blue-400 mb-4">Routing Rules</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">Path: /api/*</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-blue-400">api-target-group</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">Host: admin.example.com</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-purple-400">admin-target-group</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">Query: ?user=vip</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-orange-400">vip-target-group</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-green-400">Header: X-Custom-Header</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-yellow-400">custom-target-group</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">ALB can route based on path, host header, HTTP method, query strings, source IP, and custom headers.</p>
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <span className="text-sm text-gray-400">Client</span>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="bg-green-900/30 border border-green-600 rounded-lg p-3">
                  <div className="text-sm text-green-400 text-center">Encrypted in Transit</div>
                  <div className="text-xs text-gray-400 text-center mt-1">TLS 1.2/1.3</div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">AWS</span>
                </div>
                <span className="text-sm text-gray-400">Load Balancer</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">SSL/TLS certificates encrypt data in transit between clients and AWS services. Use HTTPS to secure communications.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-semibold">AWS Certificate Manager (ACM)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400">Cost</div>
                  <div className="text-green-400 font-semibold">FREE</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400">Renewal</div>
                  <div className="text-green-400 font-semibold">Automatic</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400">Validation</div>
                  <div className="text-white">DNS or Email</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400">Regions</div>
                  <div className="text-white">All AWS regions</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              ACM provides free SSL/TLS certificates that auto-renew. For CloudFront, certificates must be in us-east-1.
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-300">api.example.com</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-300">www.example.com</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">Multiple Domains</span>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="p-6 rounded-lg border-2 border-purple-500 bg-purple-900/20">
                <div className="text-center">
                  <div className="text-lg font-bold mb-1 text-purple-400">ALB with SNI</div>
                  <div className="text-xs text-gray-400">One IP, Multiple Certs</div>
                </div>
              </div>
            </div>

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
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-3">SSL Termination (ALB)</div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Client</span>
                  <span className="text-green-400">HTTPS →</span>
                  <span className="text-purple-400">ALB</span>
                  <span className="text-blue-400">→ HTTP</span>
                  <span className="text-gray-400">Backend</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">Decrypt at LB, forward HTTP to instances</div>
              </div>

              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-3">SSL Passthrough (NLB)</div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Client</span>
                  <span className="text-green-400">HTTPS →</span>
                  <span className="text-blue-400">NLB</span>
                  <span className="text-green-400">→ HTTPS</span>
                  <span className="text-gray-400">Backend</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">Forward encrypted traffic, decrypt at instances</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Choose termination for simpler certificate management, or passthrough for end-to-end encryption.
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">ALB</span>
                </div>
                <span className="text-sm text-gray-400">Load Balancer</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-green-500 rounded" />
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-green-500 rounded" />
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-red-500 rounded" />
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Health checks automatically detect unhealthy targets and stop routing traffic to them until they recover.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">ALB</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {targets.map(target => (
                  <div key={target.id} className="flex items-center gap-2">
                    <div className={`w-8 h-1 rounded ${target.healthy ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs text-gray-400">/health</span>
                  </div>
                ))}
              </div>
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
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-block bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
                <div className="text-yellow-400 font-semibold">Grace Period: 300 seconds</div>
                <div className="text-xs text-gray-400 mt-1">Wait before starting health checks</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🕐</div>
                <div className="text-sm text-gray-400">0-300s</div>
                <div className="text-xs text-yellow-400 mt-1">Grace Period</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm text-gray-400">After 300s</div>
                <div className="text-xs text-green-400 mt-1">Start Checks</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">✓</div>
                <div className="text-sm text-gray-400">{healthyCount} consecutive</div>
                <div className="text-xs text-green-400 mt-1">Mark Healthy</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Grace period prevents health check failures during application startup. New instances won't be marked unhealthy during this time.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-3">Cross-Zone: Disabled</div>
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">us-east-1a</div>
                    <div className="text-sm text-white">2 targets (100% of AZ traffic)</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">us-east-1b</div>
                    <div className="text-sm text-white">1 target (100% of AZ traffic)</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-3">Cross-Zone: Enabled</div>
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">us-east-1a</div>
                    <div className="text-sm text-white">2 targets (~66% each)</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">us-east-1b</div>
                    <div className="text-sm text-white">1 target (~33%)</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Cross-zone load balancing distributes traffic evenly across all healthy targets in all enabled AZs.
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🌐</span>
                </div>
                <span className="text-sm text-gray-400">Domain</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-12 h-12 text-white" />
                </div>
                <span className="text-sm text-gray-400">Hosted Zone</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-xs text-white">A</div>
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-xs text-white">CNAME</div>
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-xs text-white">MX</div>
                </div>
                <span className="text-sm text-gray-400">DNS Records</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">A hosted zone is a container for DNS records that define how to route traffic for a domain and its subdomains.</p>
            </div>
          </div>
        )}

        {step === 1 && (
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
        )}

        {step === 2 && (
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

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-3">Name Server (NS) Records</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-xs text-gray-400">NS Records</div>
                  <div className="text-sm text-white mt-1">ns-123.awsdns-12.com</div>
                  <div className="text-sm text-white">ns-456.awsdns-34.net</div>
                  <div className="text-sm text-white">ns-789.awsdns-56.org</div>
                  <div className="text-sm text-white">ns-012.awsdns-78.co.uk</div>
                </div>
                <div className="text-xs text-gray-300">
                  Add these NS records to your domain registrar to delegate DNS to Route 53
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              NS records tell the internet which name servers contain the authoritative DNS records for your domain.
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">Viewer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Lambda@Edge</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">Edge Location</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Lambda@Edge runs serverless functions at CloudFront edge locations worldwide, enabling custom logic closer to users.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">Viewer</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-600">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Edge Cache</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-700">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Origin</span>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 border border-orange-600 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Viewer Request</div>
              <div className="text-sm text-gray-300">Runs before CloudFront checks the cache</div>
              <div className="mt-2 text-xs text-gray-400">Use cases: Auth, URL rewrites, A/B testing, device detection</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">Viewer</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-700">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Cache Miss</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-600">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Origin</span>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 border border-orange-600 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Origin Request</div>
              <div className="text-sm text-gray-300">Runs on cache miss, before request goes to origin</div>
              <div className="mt-2 text-xs text-gray-400">Use cases: Dynamic origin selection, add headers, modify query strings</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">Viewer</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Edge</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-700">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Origin</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-600">
                <Code className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 border border-orange-600 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Origin Response</div>
              <div className="text-sm text-gray-300">Runs after origin responds, before caching</div>
              <div className="mt-2 text-xs text-gray-400">Use cases: Modify cache headers, compress images, transform content</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">Viewer</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-600">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Edge Cache</span>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 border border-orange-600 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Viewer Response</div>
              <div className="text-sm text-gray-300">Runs before returning response to viewer</div>
              <div className="mt-2 text-xs text-gray-400">Use cases: Add security headers, modify cookies, insert tracking pixels</div>
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
        )}
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">CloudFront</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">OAC</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                </div>
                <span className="text-sm text-gray-400">S3 Bucket</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Origin Access Control (OAC) ensures only CloudFront can access your S3 bucket, preventing direct public access.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                <div className="text-yellow-400 font-semibold mb-3">OAI (Legacy)</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Origin Access Identity</div>
                  <div>• CloudFront user approach</div>
                  <div>• No SSE-KMS support</div>
                  <div>• Being deprecated</div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-3">OAC (Modern)</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>✓ Origin Access Control</div>
                  <div>✓ Service principal approach</div>
                  <div>✓ SSE-KMS supported</div>
                  <div>✓ AWS recommended</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              OAC is the modern replacement for OAI with better security and KMS encryption support.
            </div>
          </div>
        )}

        {step === 2 && (
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

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="text-red-400 font-semibold mb-3">Without OAC</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">User → CloudFront → S3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-gray-300">User → S3 directly</span>
                  </div>
                  <div className="text-red-300 mt-2">Bypasses caching, WAF, logging</div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-3">With OAC</div>
                <div className="space-y-2 text-xs text-gray-300">
                  <div>✓ Only CloudFront can access S3</div>
                  <div>✓ Enforce HTTPS delivery</div>
                  <div>✓ Works with SSE-KMS</div>
                  <div>✓ Centralized security control</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              OAC prevents direct S3 access, ensuring all requests go through CloudFront for caching, security, and monitoring.
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="space-y-4 mb-6">
              <div className="text-lg font-semibold text-green-400">Static IPs per AZ</div>
              <div className="space-y-2 max-w-md mx-auto">
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
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">NLB provides one static IP address per Availability Zone for predictable, whitelist-friendly connectivity.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 font-semibold mb-3">Auto-assigned IP</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• AWS assigns static IP</div>
                  <div>• Free</div>
                  <div>• Released when deleted</div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-3">Elastic IP (Your own)</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>✓ Bring your own EIP</div>
                  <div>✓ Keep after deletion</div>
                  <div>✓ Pre-whitelisted IPs</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              You can optionally assign your own Elastic IPs to NLB for each AZ, allowing IP retention across NLB lifecycle.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">Firewall Whitelisting</div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-700 rounded p-3 flex-1">
                    <div className="text-xs text-gray-400">Corporate Firewall</div>
                    <div className="text-sm text-white mt-1">Allow: 52.1.2.3, 52.4.5.6, 52.7.8.9</div>
                  </div>
                  <div className="text-green-400">→</div>
                  <div className="bg-green-600 rounded p-3">
                    <div className="text-xs text-white">NLB</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
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
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-4">PrivateLink (VPC Endpoint Service)</div>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-sm text-white">VPC-A</span>
                  </div>
                  <span className="text-xs text-gray-400">Consumer</span>
                </div>
                <div className="flex-1 text-center max-w-xs">
                  <div className="h-1 bg-purple-500 rounded" />
                  <div className="text-xs text-purple-400 mt-1">Private Connection</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">NLB Service</span>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                PrivateLink allows you to expose services to other VPCs/accounts without internet or VPC peering
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700 rounded p-3">
                <div className="text-green-400 font-semibold">Benefits</div>
                <div className="text-gray-300 space-y-1 mt-2">
                  <div>• Private connectivity</div>
                  <div>• No internet exposure</div>
                  <div>• Cross-account access</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <div className="text-blue-400 font-semibold">Use Cases</div>
                <div className="text-gray-300 space-y-1 mt-2">
                  <div>• SaaS integration</div>
                  <div>• Partner access</div>
                  <div>• Multi-account arch</div>
                </div>
              </div>
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-2">A / AAAA</div>
                <div className="text-xs text-gray-300">IPv4 / IPv6 addresses</div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-2">CNAME</div>
                <div className="text-xs text-gray-300">Hostname to hostname</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-2">Alias</div>
                <div className="text-xs text-gray-300">AWS resources (free)</div>
              </div>
              <div className="bg-orange-900/20 border border-orange-600 rounded-lg p-4">
                <div className="text-orange-400 font-semibold mb-2">MX</div>
                <div className="text-xs text-gray-300">Mail exchange</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">DNS record types define how domain names map to IP addresses, other domains, or AWS resources.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-400 mb-3">A / AAAA Records</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400">A Record (IPv4)</div>
                  <div className="font-mono text-green-400 mt-1">www.example.com → 54.123.45.67</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400">AAAA Record (IPv6)</div>
                  <div className="font-mono text-green-400 mt-1">www.example.com → 2001:0db8::1</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              A records map domain names to IPv4 addresses. AAAA records map to IPv6 addresses. Both can be used at apex domain.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <div className="text-lg font-semibold text-green-400 mb-3">CNAME Record</div>
              <div className="bg-gray-700 rounded p-3 mb-3">
                <div className="font-mono text-green-400">api.example.com → lb-123.us-east-1.elb.amazonaws.com</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 rounded p-3">
                <div className="text-red-400 font-semibold mb-2">⚠️ Cannot use at apex domain!</div>
                <div className="text-xs text-gray-300">CNAME not allowed for example.com, only subdomains like www.example.com</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              CNAME maps a hostname to another hostname. Cannot be used at the zone apex (root domain).
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
              <div className="text-lg font-semibold text-purple-400 mb-3">Alias Record (AWS)</div>
              <div className="bg-gray-700 rounded p-3 mb-3">
                <div className="font-mono text-green-400">example.com → d123.cloudfront.net</div>
                <div className="text-xs text-gray-400 mt-1">✓ Works at apex domain</div>
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">ALB</span>
                </div>
                <span className="text-sm text-gray-400">Load Balancer</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-green-500 rounded" />
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-yellow-500 rounded" />
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-yellow-400">Draining</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Connection draining allows in-flight requests to complete before removing a target from the load balancer.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
              <div className="text-yellow-400 font-semibold mb-3">Deregistration Delay</div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-700 rounded p-3 text-center flex-1 mx-2">
                  <div className="text-sm text-gray-400">Minimum</div>
                  <div className="text-lg text-white font-semibold">0 sec</div>
                  <div className="text-xs text-gray-500">Disabled</div>
                </div>
                <div className="bg-yellow-600 rounded p-3 text-center flex-1 mx-2">
                  <div className="text-sm text-white">Default</div>
                  <div className="text-lg text-white font-semibold">300 sec</div>
                  <div className="text-xs text-yellow-200">5 minutes</div>
                </div>
                <div className="bg-gray-700 rounded p-3 text-center flex-1 mx-2">
                  <div className="text-sm text-gray-400">Maximum</div>
                  <div className="text-lg text-white font-semibold">3600 sec</div>
                  <div className="text-xs text-gray-500">1 hour</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Configure how long the load balancer waits before forcibly closing connections to a deregistering target.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
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
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm font-semibold text-blue-400">Deployments</div>
                <div className="text-xs text-gray-300 mt-2">Graceful updates</div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📉</div>
                <div className="text-sm font-semibold text-green-400">Scale Down</div>
                <div className="text-xs text-gray-300 mt-2">Remove instances</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔧</div>
                <div className="text-sm font-semibold text-purple-400">Maintenance</div>
                <div className="text-xs text-gray-300 mt-2">Zero downtime</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Use connection draining for blue-green deployments, auto-scaling, and maintenance without disrupting active users.
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>
              <div className="flex-1 max-w-xs space-y-1">
                <div className="h-1 bg-purple-500 rounded" />
                <div className="text-center text-xs text-purple-400">Cookie: SessionID</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">ALB</span>
                </div>
              </div>
              <div className="flex-1 max-w-xs h-1 bg-green-500 rounded" />
              <div className="text-center">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center border-2 border-yellow-400 mb-2">
                  <span className="text-white text-xs">Same Target</span>
                </div>
                <span className="text-xs text-gray-400">Always routed here</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Sticky sessions (session affinity) route a user's requests to the same target, maintaining session state.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="text-lg font-semibold text-purple-400 mb-3">Duration-Based Stickiness</div>
              <div className="bg-gray-700 rounded p-3 mb-3">
                <div className="text-sm text-gray-400 mb-2">Cookie Generated by ALB</div>
                <div className="font-mono text-green-400">AWSALB=base64encodedvalue</div>
                <div className="text-xs text-gray-400 mt-1">Expiration: 1 second - 7 days</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400">Default</div>
                  <div className="text-white">1 day (86400s)</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400">Configurable</div>
                  <div className="text-white">Target group level</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              ALB generates and manages the cookie automatically. Simplest option for session stickiness.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-400 mb-3">Application-Based Stickiness</div>
              <div className="bg-gray-700 rounded p-3 mb-3">
                <div className="text-sm text-gray-400 mb-2">Cookie Generated by Your App</div>
                <div className="font-mono text-green-400">CUSTOM_SESSION_ID=abcd1234</div>
                <div className="text-xs text-gray-400 mt-1">ALB reads this cookie to route requests</div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Custom cookie name (defined by you)</div>
                <div>• Cookie managed by your application</div>
                <div>• More control over session lifecycle</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Your application creates the cookie, ALB routes based on it. Provides more control but requires app changes.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-3">Benefits</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>✓ Maintain session state</div>
                  <div>✓ User always goes to same target</div>
                  <div>✓ No distributed session store needed</div>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                <div className="text-yellow-400 font-semibold mb-3">Trade-offs</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>⚠️ Can cause uneven load</div>
                  <div>⚠️ Lost sessions if target fails</div>
                  <div>⚠️ Harder to scale down</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Consider using distributed caching (ElastiCache, DynamoDB) instead of sticky sessions for better scalability.
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Signed</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">CloudFront</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm text-gray-400">Private Content</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Signed URLs and Cookies restrict access to CloudFront content, perfect for premium content or user-specific files.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <div className="text-lg font-semibold text-green-400 mb-3">Signed URL</div>
              <div className="bg-gray-700 rounded-lg p-4 mb-3">
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
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Use signed URLs when you need to restrict access to individual files with time-based expiration.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-400 mb-3">Signed Cookie</div>
              <div className="bg-gray-700 rounded-lg p-4 mb-3">
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
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              Use signed cookies when users need access to multiple files (e.g., all videos in a course).
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
              <div className="text-lg font-semibold text-purple-400 mb-3">Trusted Key Groups</div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400 mb-2">1. Create RSA key pair</div>
                  <div className="font-mono text-xs text-green-400">openssl genrsa -out private_key.pem 2048</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400 mb-2">2. Upload public key to CloudFront</div>
                  <div className="text-xs text-gray-300">Create trusted key group in CloudFront</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400 mb-2">3. Sign URLs/Cookies with private key</div>
                  <div className="text-xs text-gray-300">Use AWS SDK or custom signing logic</div>
                </div>
              </div>
            </div>
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
                    <li>• Don&apos;t want to change URLs</li>
                  </ul>
                </div>
              </div>
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
        {step === 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm font-bold">LB</span>
                </div>
                <span className="text-sm text-gray-400">Load Balancer</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="text-blue-400 text-xs">AZ-A</div>
                  <div className="w-12 h-1 bg-green-500 rounded" />
                  <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">T1</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-green-400 text-xs">AZ-B</div>
                  <div className="w-12 h-1 bg-green-500 rounded" />
                  <div className="flex gap-1">
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">T2</span>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">T3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">Cross-zone load balancing determines whether traffic is distributed evenly across all targets in all AZs.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
              <div className="text-yellow-400 font-semibold mb-3">Without Cross-Zone Load Balancing</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-3">AZ-A (50% traffic)</div>
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-white text-xs">LB</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">50%</span>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-400 mt-2">1 target</div>
                </div>

                <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <div className="text-green-400 font-semibold mb-3">AZ-B (50% traffic)</div>
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-white text-xs">LB</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">17%</span>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">17%</span>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">17%</span>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-400 mt-2">3 targets</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-yellow-400">
              ⚠️ Uneven: AZ-A target gets 50%, AZ-B targets get ~17% each. Each AZ node only routes to targets in its AZ.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-3">With Cross-Zone Load Balancing</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-3">AZ-A (50% traffic)</div>
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-white text-xs">LB</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">25%</span>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-400 mt-2">1 target</div>
                </div>

                <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <div className="text-green-400 font-semibold mb-3">AZ-B (50% traffic)</div>
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-white text-xs">LB</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">25%</span>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">25%</span>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">25%</span>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-400 mt-2">3 targets</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-green-400">
              ✓ Even distribution: Each target gets 25% (total 4 targets). Each node routes to all targets across all AZs.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-3">ALB (Application LB)</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Always enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>No extra charge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Cannot be disabled</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-3">NLB (Network LB)</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⚠️</span>
                    <span>Disabled by default</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⚠️</span>
                    <span>Charges for inter-AZ traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">i</span>
                    <span>Must enable manually</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
              GWLB also has cross-zone disabled by default with inter-AZ charges, similar to NLB.
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
