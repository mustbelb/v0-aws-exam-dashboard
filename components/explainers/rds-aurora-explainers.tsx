"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Database, Server, RefreshCw, Shield, Clock, Settings } from "lucide-react"

// 1. Multi-AZ Deployments Explainer (Rich)
export function MultiAzDeploymentsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [primaryFailed, setPrimaryFailed] = useState(false)

  const steps = [
    { title: "Multi-AZ Overview", description: "Synchronous replication to a standby instance in a different AZ" },
    { title: "Synchronous Replication", description: "Every write to primary is synchronously replicated to standby" },
    { title: "Automatic Failover", description: "If primary fails, DNS endpoint automatically points to standby" },
    { title: "Failover Time", description: "Typically 60-120 seconds for automatic failover" },
    { title: "Not for Read Scaling", description: "Standby cannot serve read traffic - use Read Replicas for that" }
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
        <Database className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Multi-AZ Deployments</h2>
      </div>

      {/* Failover Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setPrimaryFailed(!primaryFailed)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            primaryFailed ? "bg-red-600 text-white" : "bg-green-600 text-white"
          }`}
        >
          {primaryFailed ? "🔴 Primary Failed - Failover Active" : "🟢 Primary Healthy"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start">
          {/* AZ 1 - Primary */}
          <div className={`flex-1 p-4 rounded-lg border-2 mr-4 transition-all ${
            primaryFailed ? "border-red-500 bg-red-900/20 opacity-50" : "border-green-500 bg-green-900/20"
          }`}>
            <div className="text-center mb-4">
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1a</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 ${
                primaryFailed ? "bg-red-600" : "bg-blue-600"
              }`}>
                <Database className="w-10 h-10 text-white" />
              </div>
              <span className="text-white font-semibold">
                {primaryFailed ? "❌ Primary" : "✓ Primary"}
              </span>
              <span className="text-xs text-gray-400">Read/Write</span>
            </div>
          </div>

          {/* Sync Arrow */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-xs text-gray-400 mb-2">Sync</div>
            <RefreshCw className={`w-6 h-6 ${primaryFailed ? "text-red-500" : "text-green-500"}`} />
            <div className="text-xs text-gray-400 mt-2">Replication</div>
          </div>

          {/* AZ 2 - Standby */}
          <div className={`flex-1 p-4 rounded-lg border-2 ml-4 transition-all ${
            primaryFailed ? "border-green-500 bg-green-900/20" : "border-yellow-500 bg-yellow-900/20"
          }`}>
            <div className="text-center mb-4">
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1b</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 ${
                primaryFailed ? "bg-green-600" : "bg-yellow-600"
              }`}>
                <Database className="w-10 h-10 text-white" />
              </div>
              <span className="text-white font-semibold">
                {primaryFailed ? "✓ New Primary" : "⏳ Standby"}
              </span>
              <span className="text-xs text-gray-400">
                {primaryFailed ? "Read/Write" : "No Traffic"}
              </span>
            </div>
          </div>
        </div>

        {/* DNS Endpoint */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">RDS Endpoint (DNS)</div>
          <div className="font-mono text-sm text-green-400">
            mydb.abc123.us-east-1.rds.amazonaws.com
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Points to: {primaryFailed ? "us-east-1b (new primary)" : "us-east-1a (primary)"}
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
          <li>• Multi-AZ is for HIGH AVAILABILITY, not read scaling</li>
          <li>• Synchronous replication ensures zero data loss</li>
          <li>• Automatic failover: 60-120 seconds via DNS update</li>
          <li>• Standby cannot serve any traffic until failover</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Read Replicas Explainer (Rich)
export function ReadReplicasExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [replicaCount, setReplicaCount] = useState(2)

  const steps = [
    { title: "Read Replicas", description: "Asynchronous replication for read scaling and cross-region deployments" },
    { title: "Async Replication", description: "Writes go to primary, then asynchronously replicated to replicas" },
    { title: "Read Scaling", description: "Direct read traffic to replicas to offload the primary" },
    { title: "Replica Limits", description: "Up to 5 read replicas for MySQL/PostgreSQL, 15 for Aurora" },
    { title: "Promotion", description: "Read replicas can be promoted to standalone DB instances" },
    { title: "Cross-Region", description: "Create replicas in other regions for DR and lower latency" }
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
        <h2 className="text-2xl font-bold text-white">Read Replicas</h2>
      </div>

      {/* Replica Count Slider */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of Read Replicas: {replicaCount}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          value={replicaCount}
          onChange={(e) => setReplicaCount(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>5 (Max for RDS)</span>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col items-center">
          {/* Primary */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20">
              <div className="flex flex-col items-center">
                <Database className="w-12 h-12 text-blue-400 mb-2" />
                <span className="text-white font-semibold">Primary</span>
                <span className="text-xs text-gray-400">Read/Write</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <div>✍️ Writes: 100%</div>
              <div>📖 Reads: {replicaCount > 0 ? `${Math.round(100/(replicaCount+1))}%` : "100%"}</div>
            </div>
          </div>

          {/* Async Replication Arrows */}
          {replicaCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400 text-sm">Async Replication</span>
              <div className="flex gap-1">
                {Array.from({ length: replicaCount }).map((_, i) => (
                  <div key={i} className="w-8 h-1 bg-green-500 rounded" />
                ))}
              </div>
            </div>
          )}

          {/* Replicas */}
          {replicaCount > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {Array.from({ length: replicaCount }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                  <div className="flex flex-col items-center">
                    <Database className="w-10 h-10 text-green-400 mb-2" />
                    <span className="text-white font-semibold text-sm">Replica {i + 1}</span>
                    <span className="text-xs text-gray-400">Read Only</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {replicaCount === 0 && (
            <div className="text-gray-500 text-sm">No read replicas configured</div>
          )}
        </div>

        {/* Traffic Distribution */}
        {replicaCount > 0 && (
          <div className="mt-6 bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-2">Read Traffic Distribution</div>
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-600 rounded h-4" style={{ flex: 1 }}>
                <span className="text-xs text-white px-2">Primary</span>
              </div>
              {Array.from({ length: replicaCount }).map((_, i) => (
                <div key={i} className="flex-1 bg-green-600 rounded h-4">
                  <span className="text-xs text-white px-1">R{i+1}</span>
                </div>
              ))}
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
          <li>• Read Replicas are for READ SCALING, not high availability</li>
          <li>• Asynchronous replication - slight replica lag possible</li>
          <li>• Can be promoted to standalone (breaks replication)</li>
          <li>• Cross-region replicas useful for DR and global reads</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Aurora Architecture Explainer (Rich)
export function AuroraArchitectureExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showGlobal, setShowGlobal] = useState(false)

  const steps = [
    { title: "Aurora Storage", description: "Distributed, fault-tolerant storage across 3 AZs with 6 copies of data" },
    { title: "Writer Instance", description: "Single writer handles all write operations to shared storage" },
    { title: "Reader Instances", description: "Up to 15 read replicas with auto-scaling capability" },
    { title: "Auto-Healing", description: "Storage automatically repairs and replaces failed segments" },
    { title: "Global Database", description: "Cross-region replication with <1 second lag" },
    { title: "Serverless v2", description: "Auto-scale capacity in fine-grained increments" }
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
        <Database className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Aurora Architecture</h2>
      </div>

      {/* Global Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowGlobal(!showGlobal)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showGlobal ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          {showGlobal ? "🌍 Global Database" : "Single Region"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className={`grid ${showGlobal ? "grid-cols-2 gap-4" : "grid-cols-1"}`}>
          {/* Primary Region */}
          <div className={`p-4 rounded-lg border-2 ${showGlobal ? "border-blue-500" : "border-orange-500"}`}>
            {showGlobal && <div className="text-xs text-blue-400 mb-2">Primary Region (us-east-1)</div>}

            {/* Instances */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-1">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-white">Writer</span>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Reader 1</span>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">Reader 2</span>
              </div>
            </div>

            {/* Shared Storage */}
            <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-lg p-3 border border-orange-500/30">
              <div className="text-xs text-orange-300 text-center mb-2">Shared Storage Layer</div>
              <div className="flex justify-around">
                {["AZ-1", "AZ-2", "AZ-3"].map((az, i) => (
                  <div key={i} className="text-center">
                    <div className="flex gap-1 mb-1">
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                    </div>
                    <span className="text-xs text-gray-400">{az}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">6 copies across 3 AZs</div>
            </div>
          </div>

          {/* Secondary Region (Global) */}
          {showGlobal && (
            <div className="p-4 rounded-lg border-2 border-purple-500">
              <div className="text-xs text-purple-400 mb-2">Secondary Region (eu-west-1)</div>

              {/* Replication indicator */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-full">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-300">&lt;1 sec lag</span>
                </div>
              </div>

              {/* Instances */}
              <div className="flex justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-1">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">Reader</span>
                </div>
              </div>

              {/* Storage */}
              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                <div className="text-xs text-purple-300 text-center mb-2">Replicated Storage</div>
                <div className="flex justify-around">
                  {["AZ-1", "AZ-2", "AZ-3"].map((az, i) => (
                    <div key={i} className="text-center">
                      <div className="flex gap-1 mb-1">
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                      </div>
                      <span className="text-xs text-gray-400">{az}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
      <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Aurora stores 6 copies across 3 AZs (survives loss of 2 copies)</li>
          <li>• Up to 15 read replicas with millisecond replica lag</li>
          <li>• Global Database: &lt;1 second cross-region replication</li>
          <li>• Serverless v2 scales in 0.5 ACU increments</li>
        </ul>
      </div>
    </div>
  )
}

// 4. RDS Proxy Explainer (Medium)
export function RdsProxyExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [connectionCount, setConnectionCount] = useState(1000)

  const steps = [
    { title: "RDS Proxy Overview", description: "Fully managed database proxy for connection pooling and failover" },
    { title: "Connection Pooling", description: "Reduces database connections by sharing and reusing connections" },
    { title: "Lambda Integration", description: "Perfect for Lambda functions that would otherwise overwhelm connections" },
    { title: "Faster Failover", description: "Reduces failover time by 66% by maintaining connections" },
    { title: "IAM Authentication", description: "Supports IAM database authentication for enhanced security" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const maxDbConnections = 200
  const proxyConnections = Math.min(connectionCount, maxDbConnections)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">RDS Proxy</h2>
      </div>

      {/* Connection Slider */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Lambda Concurrent Executions: {connectionCount}
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          value={connectionCount}
          onChange={(e) => setConnectionCount(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Lambda Functions */}
          <div className="text-center">
            <div className="flex flex-wrap w-24 gap-1 justify-center mb-2">
              {Array.from({ length: Math.min(20, Math.ceil(connectionCount / 100)) }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-orange-500 rounded text-xs flex items-center justify-center">
                  λ
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400">{connectionCount} connections</span>
          </div>

          {/* Arrow to Proxy */}
          <div className="text-gray-500">→</div>

          {/* RDS Proxy */}
          <div className="text-center">
            <div className="w-20 h-20 bg-cyan-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-white" />
              <span className="text-xs text-white">Proxy</span>
            </div>
            <span className="text-sm text-cyan-400">Pool & Multiplex</span>
          </div>

          {/* Arrow to DB */}
          <div className="text-gray-500">→</div>

          {/* Database */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <Database className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm text-gray-400">{proxyConnections} connections</span>
          </div>
        </div>

        {/* Connection Reduction */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-300">Without Proxy</div>
              <div className="text-red-400 font-semibold">{connectionCount} connections</div>
              {connectionCount > maxDbConnections && (
                <div className="text-xs text-red-400">⚠️ Exceeds DB limit ({maxDbConnections})</div>
              )}
            </div>
            <div className="text-2xl text-gray-500">vs</div>
            <div>
              <div className="text-sm text-gray-300">With Proxy</div>
              <div className="text-green-400 font-semibold">{proxyConnections} connections</div>
              <div className="text-xs text-green-400">✓ Within DB limit</div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400 text-center">
            {Math.round((1 - proxyConnections / connectionCount) * 100)}% reduction in database connections
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
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
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• RDS Proxy is essential for Lambda + RDS to prevent connection exhaustion</li>
          <li>• Reduces failover time by 66% by preserving connections</li>
          <li>• Supports IAM authentication and Secrets Manager integration</li>
          <li>• Works with MySQL, PostgreSQL, and Aurora</li>
        </ul>
      </div>
    </div>
  )
}

// 5. Backup and Recovery Explainer (Medium)
export function BackupRecoveryExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [backupType, setBackupType] = useState<"automated" | "manual">("automated")

  const steps = [
    { title: "RDS Backup Options", description: "Automated backups and manual snapshots for data protection" },
    { title: "Automated Backups", description: "Daily snapshots + transaction logs for point-in-time recovery" },
    { title: "Manual Snapshots", description: "User-initiated, retained until explicitly deleted" },
    { title: "Point-in-Time Recovery", description: "Restore to any second within retention period (up to 35 days)" },
    { title: "Cross-Region Copy", description: "Copy snapshots to other regions for DR" }
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
        <Clock className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Backup & Recovery</h2>
      </div>

      {/* Backup Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setBackupType("automated")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            backupType === "automated" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Automated Backups
        </button>
        <button
          onClick={() => setBackupType("manual")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            backupType === "manual" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Manual Snapshots
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {backupType === "automated" ? (
          <div>
            <div className="text-lg font-semibold text-green-400 mb-4">Automated Backup Flow</div>
            <div className="flex items-center justify-between">
              {/* RDS Instance */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm text-gray-400">RDS</span>
              </div>

              {/* Daily Snapshot */}
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-green-400">Daily Snapshot</div>
                  <div className="text-xs text-gray-400">During backup window</div>
                </div>
              </div>

              {/* Transaction Logs */}
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-yellow-400">Transaction Logs</div>
                  <div className="text-xs text-gray-400">Every 5 minutes</div>
                </div>
              </div>

              {/* S3 Storage */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                </div>
                <span className="text-sm text-gray-400">S3</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Retention:</span>
                  <span className="text-white ml-2">1-35 days</span>
                </div>
                <div>
                  <span className="text-gray-400">PITR:</span>
                  <span className="text-white ml-2">To any second</span>
                </div>
                <div>
                  <span className="text-gray-400">Delete with DB:</span>
                  <span className="text-yellow-400 ml-2">Yes (configurable)</span>
                </div>
                <div>
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-green-400 ml-2">Included (up to DB size)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-lg font-semibold text-blue-400 mb-4">Manual Snapshot</div>
            <div className="flex items-center justify-between">
              {/* RDS Instance */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm text-gray-400">RDS</span>
              </div>

              {/* User Action */}
              <div className="flex-1 mx-4">
                <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 text-center">
                  <div className="text-sm text-blue-400">📸 Create Snapshot</div>
                  <div className="text-xs text-gray-400">User-initiated</div>
                </div>
              </div>

              {/* S3 Storage */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🪣</span>
                </div>
                <span className="text-sm text-gray-400">S3</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Retention:</span>
                  <span className="text-white ml-2">Until deleted</span>
                </div>
                <div>
                  <span className="text-gray-400">PITR:</span>
                  <span className="text-red-400 ml-2">No (point-in-time only)</span>
                </div>
                <div>
                  <span className="text-gray-400">Delete with DB:</span>
                  <span className="text-green-400 ml-2">No (persists)</span>
                </div>
                <div>
                  <span className="text-gray-400">Cross-Region:</span>
                  <span className="text-green-400 ml-2">Can copy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
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
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Automated backups enable PITR, manual snapshots don't</li>
          <li>• Manual snapshots persist after DB deletion</li>
          <li>• PITR creates a NEW instance (cannot restore in-place)</li>
          <li>• Copy snapshots cross-region for DR</li>
        </ul>
      </div>
    </div>
  )
}

// 6. Parameter and Option Groups Explainer (Light)
export function ParameterOptionGroupsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [groupType, setGroupType] = useState<"parameter" | "option">("parameter")

  const steps = [
    { title: "Configuration Groups", description: "Parameter Groups and Option Groups customize database behavior" },
    { title: "Parameter Groups", description: "Database engine configuration settings (like postgresql.conf)" },
    { title: "Option Groups", description: "Enable optional features like Oracle TDE, SQL Server Audit" },
    { title: "Static vs Dynamic", description: "Dynamic parameters apply immediately, static require reboot" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const parameterExamples = [
    { name: "max_connections", value: "200", type: "Dynamic" },
    { name: "shared_buffers", value: "256MB", type: "Static" },
    { name: "log_statement", value: "all", type: "Dynamic" }
  ]

  const optionExamples = [
    { name: "Oracle TDE", description: "Transparent Data Encryption" },
    { name: "SQL Server Audit", description: "Database auditing" },
    { name: "MySQL memcached", description: "Memcached plugin" }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Parameter & Option Groups</h2>
      </div>

      {/* Group Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setGroupType("parameter")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            groupType === "parameter" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Parameter Groups
        </button>
        <button
          onClick={() => setGroupType("option")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            groupType === "option" ? "bg-teal-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Option Groups
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {groupType === "parameter" ? (
          <div>
            <div className="text-lg font-semibold text-purple-400 mb-4">Parameter Group Settings</div>
            <div className="space-y-3">
              {parameterExamples.map((param, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div>
                    <div className="font-mono text-sm text-white">{param.name}</div>
                    <div className="text-xs text-gray-400">= {param.value}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    param.type === "Dynamic" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                  }`}>
                    {param.type}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <span className="text-green-400">Dynamic</span> = Apply immediately •
              <span className="text-yellow-400 ml-2">Static</span> = Requires reboot
            </div>
          </div>
        ) : (
          <div>
            <div className="text-lg font-semibold text-teal-400 mb-4">Option Group Features</div>
            <div className="space-y-3">
              {optionExamples.map((option, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-700 rounded-lg p-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{option.name}</div>
                    <div className="text-xs text-gray-400">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Option Groups enable engine-specific optional features
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
      <div className="bg-gradient-to-r from-purple-900/50 to-teal-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Parameter Groups: engine configuration (memory, connections)</li>
          <li>• Option Groups: optional features (TDE, auditing)</li>
          <li>• Static parameters require DB instance reboot</li>
          <li>• Cannot modify default groups - create custom ones</li>
        </ul>
      </div>
    </div>
  )
}

// 7. Aurora Serverless Explainer
export function AuroraServerlessExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [acu, setAcu] = useState(2)

  const steps = [
    { title: "Aurora Serverless v2", description: "Automatically scales database capacity based on application demand" },
    { title: "Aurora Capacity Units", description: "ACUs measure compute capacity - each ACU is ~2GB RAM with proportional CPU" },
    { title: "Instant Scaling", description: "Scales in milliseconds without disruption to database connections" },
    { title: "Min/Max ACUs", description: "Set minimum (0.5-128) and maximum (1-128) ACU boundaries" },
    { title: "Pay Per Use", description: "Pay only for capacity used per second, ideal for variable workloads" }
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
        <Database className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Aurora Serverless v2</h2>
      </div>

      <div className="flex justify-center mb-4">
        <input type="range" min="0.5" max="16" step="0.5" value={acu} onChange={(e) => setAcu(parseFloat(e.target.value))} className="w-64" />
        <span className="ml-4 text-white font-mono">{acu} ACUs</span>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-400">Min ACU</div>
            <div className="text-xl font-bold text-green-400">0.5</div>
          </div>
          <div className="flex-1 mx-4 h-8 bg-gray-700 rounded-full relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-orange-500 rounded-full transition-all" style={{ width: `${(acu / 16) * 100}%` }} />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">{acu} ACUs (~{acu * 2}GB RAM)</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Max ACU</div>
            <div className="text-xl font-bold text-orange-400">128</div>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm">Cost: ~${(acu * 0.12).toFixed(2)}/hour at current capacity</div>
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

      <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Serverless v2 scales instantly without connection disruption</li>
          <li>• ACUs: 0.5-128, each ~2GB RAM with proportional CPU</li>
          <li>• Ideal for variable/unpredictable workloads</li>
          <li>• Can mix Serverless and provisioned in same cluster</li>
        </ul>
      </div>
    </div>
  )
}

// 8. RDS Encryption Explainer
export function RdsEncryptionExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)

  const steps = [
    { title: "Encryption at Rest", description: "RDS uses AWS KMS to encrypt data, logs, backups, and snapshots" },
    { title: "Enable at Creation", description: "Encryption must be enabled at DB creation - cannot encrypt existing unencrypted DB directly" },
    { title: "Encrypt Unencrypted DB", description: "Create encrypted snapshot copy, then restore from encrypted snapshot" },
    { title: "Read Replica Encryption", description: "Read replicas inherit encryption from source - cannot change" },
    { title: "TLS/SSL in Transit", description: "Use SSL certificates to encrypt connections to RDS" }
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
        <h2 className="text-2xl font-bold text-white">RDS Encryption</h2>
      </div>

      <div className="flex justify-center mb-4">
        <button onClick={() => setEncryptionEnabled(!encryptionEnabled)} className={`px-6 py-2 rounded-lg font-medium ${encryptionEnabled ? "bg-green-600" : "bg-red-600"} text-white`}>
          {encryptionEnabled ? "🔒 Encryption Enabled" : "🔓 Encryption Disabled"}
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${encryptionEnabled ? "border-green-500 bg-green-900/20" : "border-gray-600 bg-gray-700"}`}>
            <Database className="w-8 h-8 text-blue-400 mb-2" />
            <div className="text-white font-semibold">Data</div>
            <div className="text-xs text-gray-400">{encryptionEnabled ? "AES-256" : "Unencrypted"}</div>
          </div>
          <div className={`p-4 rounded-lg border-2 ${encryptionEnabled ? "border-green-500 bg-green-900/20" : "border-gray-600 bg-gray-700"}`}>
            <Clock className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-white font-semibold">Backups</div>
            <div className="text-xs text-gray-400">{encryptionEnabled ? "Encrypted" : "Unencrypted"}</div>
          </div>
          <div className={`p-4 rounded-lg border-2 ${encryptionEnabled ? "border-green-500 bg-green-900/20" : "border-gray-600 bg-gray-700"}`}>
            <Server className="w-8 h-8 text-orange-400 mb-2" />
            <div className="text-white font-semibold">Replicas</div>
            <div className="text-xs text-gray-400">{encryptionEnabled ? "Encrypted" : "Unencrypted"}</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">KMS Key: </span>
          <span className="text-sm text-yellow-400 font-mono">aws/rds (default) or CMK</span>
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
          <li>• Must enable encryption at DB creation time</li>
          <li>• To encrypt existing: snapshot → copy encrypted → restore</li>
          <li>• Read replicas inherit encryption from source</li>
          <li>• SSL/TLS for encryption in transit</li>
        </ul>
      </div>
    </div>
  )
}

// 9. Aurora Global Database Explainer
export function AuroraGlobalDatabaseExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [failoverActive, setFailoverActive] = useState(false)

  const steps = [
    { title: "Global Database", description: "Span Aurora clusters across multiple AWS regions for disaster recovery" },
    { title: "Sub-second Replication", description: "Typically <1 second lag using dedicated infrastructure" },
    { title: "Up to 5 Secondary Regions", description: "One primary region, up to 5 read-only secondary regions" },
    { title: "Cross-Region Failover", description: "Promote secondary to primary with RPO <1s, RTO <1min" },
    { title: "Write Forwarding", description: "Secondary regions can forward writes to primary region" }
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
        <RefreshCw className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Aurora Global Database</h2>
      </div>

      <div className="flex justify-center mb-4">
        <button onClick={() => setFailoverActive(!failoverActive)} className={`px-6 py-2 rounded-lg font-medium ${failoverActive ? "bg-orange-600" : "bg-blue-600"} text-white`}>
          {failoverActive ? "🔄 Failover Active" : "🌍 Normal Operation"}
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className={`flex-1 p-4 rounded-lg border-2 ${!failoverActive ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20 opacity-50"}`}>
            <div className="text-xs text-gray-400 mb-2">us-east-1 (Primary)</div>
            <Database className="w-10 h-10 text-blue-400 mx-auto mb-2" />
            <div className="text-center text-white text-sm">{!failoverActive ? "Read/Write" : "Failed"}</div>
          </div>
          <div className="px-4 text-center">
            <div className="text-xs text-gray-400">&lt;1s lag</div>
            <div className="text-2xl">→</div>
          </div>
          <div className={`flex-1 p-4 rounded-lg border-2 ${failoverActive ? "border-green-500 bg-green-900/20" : "border-yellow-500 bg-yellow-900/20"}`}>
            <div className="text-xs text-gray-400 mb-2">eu-west-1 (Secondary)</div>
            <Database className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <div className="text-center text-white text-sm">{failoverActive ? "New Primary" : "Read-only"}</div>
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
          <li>• Sub-second replication across regions</li>
          <li>• Up to 5 secondary read-only regions</li>
          <li>• RPO &lt;1s, RTO &lt;1min for cross-region failover</li>
          <li>• Write forwarding available for secondary regions</li>
        </ul>
      </div>
    </div>
  )
}

// 10. RDS Performance Insights Explainer
export function RdsPerformanceInsightsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedWait, setSelectedWait] = useState(0)

  const steps = [
    { title: "Performance Insights", description: "Database performance monitoring tool to identify bottlenecks" },
    { title: "DB Load Metric", description: "Average Active Sessions (AAS) - key metric for understanding load" },
    { title: "Wait Events", description: "Identify what queries/sessions are waiting on (CPU, I/O, locks)" },
    { title: "Top SQL Analysis", description: "Find most resource-intensive SQL statements" },
    { title: "7-Day Free Retention", description: "Free tier: 7 days history. Paid: up to 2 years" }
  ]

  const waitEvents = [
    { name: "CPU", value: 35, color: "bg-red-500" },
    { name: "I/O", value: 25, color: "bg-blue-500" },
    { name: "Lock", value: 20, color: "bg-yellow-500" },
    { name: "Network", value: 12, color: "bg-green-500" },
    { name: "Other", value: 8, color: "bg-gray-500" }
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
        <Settings className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">RDS Performance Insights</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">DB Load by Wait Type</div>
          <div className="flex h-8 rounded-lg overflow-hidden">
            {waitEvents.map((event, i) => (
              <div key={i} className={`${event.color} cursor-pointer transition-opacity ${selectedWait === i ? "opacity-100" : "opacity-70"}`} style={{ width: `${event.value}%` }} onClick={() => setSelectedWait(i)} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {waitEvents.map((event, i) => (
            <button key={i} onClick={() => setSelectedWait(i)} className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${selectedWait === i ? "ring-2 ring-white" : ""}`}>
              <div className={`w-3 h-3 rounded ${event.color}`} />
              <span className="text-white">{event.name}: {event.value}%</span>
            </button>
          ))}
        </div>
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-white font-semibold">{waitEvents[selectedWait].name} Wait Events</div>
          <div className="text-sm text-gray-400">
            {selectedWait === 0 && "High CPU indicates compute-intensive queries or under-provisioned instance"}
            {selectedWait === 1 && "I/O waits suggest storage bottleneck - consider IOPS upgrade or Aurora"}
            {selectedWait === 2 && "Lock waits indicate contention - review transaction isolation"}
            {selectedWait === 3 && "Network waits may indicate large result sets or connection issues"}
            {selectedWait === 4 && "Other waits include various internal database operations"}
          </div>
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
          <li>• DB Load (AAS) is the primary metric for database performance</li>
          <li>• Wait events show what queries are waiting on</li>
          <li>• Free tier: 7 days retention. Paid: up to 2 years</li>
          <li>• Helps identify slow queries and bottlenecks</li>
        </ul>
      </div>
    </div>
  )
}

// 11. Aurora Cloning Explainer
export function AuroraCloningExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cloneCreated, setCloneCreated] = useState(false)

  const steps = [
    { title: "Aurora Cloning", description: "Create a copy of your Aurora cluster quickly using copy-on-write" },
    { title: "Copy-on-Write", description: "Clone shares storage with source initially - only divergent pages copied" },
    { title: "Fast Creation", description: "Clone available in minutes regardless of database size" },
    { title: "Cost Efficient", description: "Pay only for additional storage as data diverges" },
    { title: "Use Cases", description: "Testing, development, analytics without impacting production" }
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
        <Database className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-bold text-white">Aurora Cloning</h2>
      </div>

      <div className="flex justify-center mb-4">
        <button onClick={() => setCloneCreated(!cloneCreated)} className="px-6 py-2 rounded-lg font-medium bg-teal-600 hover:bg-teal-500 text-white">
          {cloneCreated ? "🔄 Reset Demo" : "📋 Create Clone"}
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex justify-around items-start">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Database className="w-12 h-12 text-white" />
            </div>
            <div className="text-white font-semibold">Production</div>
            <div className="text-xs text-gray-400">100GB Database</div>
          </div>
          {cloneCreated && (
            <>
              <div className="flex flex-col items-center pt-8">
                <div className="text-xs text-gray-400">Copy-on-Write</div>
                <div className="text-2xl text-teal-400">→</div>
                <div className="text-xs text-teal-400">~2 min</div>
              </div>
              <div className="text-center animate-pulse">
                <div className="w-24 h-24 bg-teal-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-12 h-12 text-white" />
                </div>
                <div className="text-white font-semibold">Clone</div>
                <div className="text-xs text-gray-400">Shares storage initially</div>
              </div>
            </>
          )}
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

      <div className="bg-gradient-to-r from-teal-900/50 to-green-900/50 rounded-xl p-4 border border-teal-500/30">
        <h3 className="text-lg font-semibold text-teal-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Copy-on-write: clone shares storage initially</li>
          <li>• Created in minutes regardless of size</li>
          <li>• Pay only for divergent data storage</li>
          <li>• Great for testing/dev without production impact</li>
        </ul>
      </div>
    </div>
  )
}

// 12. RDS Maintenance Windows Explainer
export function RdsMaintenanceWindowsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Maintenance Windows", description: "Scheduled time for RDS to apply patches, upgrades, and modifications" },
    { title: "30-Minute Window", description: "Default is 30-minute window during off-peak hours for your region" },
    { title: "Multi-AZ Behavior", description: "Standby upgraded first, then failover, then old primary upgraded" },
    { title: "Defer Maintenance", description: "Can defer optional maintenance but required updates have deadlines" },
    { title: "Modify Window", description: "Customize window to align with your low-traffic periods" }
  ]

  const maintenanceTypes = [
    { type: "OS Patches", required: true, canDefer: false },
    { type: "Engine Upgrades", required: false, canDefer: true },
    { type: "Hardware Maintenance", required: true, canDefer: false },
    { type: "Minor Version Updates", required: false, canDefer: true }
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
        <Clock className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">RDS Maintenance Windows</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Maintenance Schedule</div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Window:</span>
              <span className="text-yellow-400 font-mono">Sun 03:00-03:30 UTC</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {maintenanceTypes.map((m, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
              <span className="text-white">{m.type}</span>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${m.required ? "bg-red-600" : "bg-green-600"}`}>{m.required ? "Required" : "Optional"}</span>
                <span className={`text-xs px-2 py-1 rounded ${m.canDefer ? "bg-blue-600" : "bg-gray-600"}`}>{m.canDefer ? "Deferrable" : "Cannot Defer"}</span>
              </div>
            </div>
          ))}
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
          <li>• 30-minute maintenance window (customizable)</li>
          <li>• Multi-AZ: standby first → failover → old primary</li>
          <li>• Some maintenance is required and cannot be deferred</li>
          <li>• Minimal downtime with Multi-AZ deployments</li>
        </ul>
      </div>
    </div>
  )
}

// 13. RDS Storage Auto Scaling Explainer
export function RdsStorageAutoScalingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [storageUsed, setStorageUsed] = useState(85)

  const steps = [
    { title: "Storage Auto Scaling", description: "Automatically increase storage when running low - no downtime" },
    { title: "Trigger Conditions", description: "Scales when free space <10% and low space lasts 5+ minutes" },
    { title: "Scaling Increment", description: "Increases by whichever is greater: 5GB, 10% of current, or predicted growth" },
    { title: "Maximum Storage", description: "Set maximum threshold to prevent runaway scaling" },
    { title: "No Downtime", description: "Storage scaling happens online without interruption" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const triggerScaling = storageUsed >= 90
  const allocatedStorage = triggerScaling ? 110 : 100

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">RDS Storage Auto Scaling</h2>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Simulate Usage:</span>
          <input type="range" min="50" max="95" value={storageUsed} onChange={(e) => setStorageUsed(parseInt(e.target.value))} className="w-32" />
          <span className="text-white font-mono">{storageUsed}%</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-end gap-4 justify-center mb-4">
          <div className="text-center">
            <div className="w-20 bg-gray-700 rounded-t-lg relative" style={{ height: "120px" }}>
              <div className={`absolute bottom-0 w-full rounded-t-lg transition-all ${storageUsed >= 90 ? "bg-red-500" : storageUsed >= 80 ? "bg-yellow-500" : "bg-green-500"}`} style={{ height: `${storageUsed}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">Used: {storageUsed}GB</div>
          </div>
          {triggerScaling && (
            <div className="text-center animate-pulse">
              <div className="text-indigo-400 text-2xl mb-2">→</div>
              <div className="text-xs text-indigo-400">Auto Scaling!</div>
            </div>
          )}
          <div className="text-center">
            <div className="w-20 bg-gray-600 rounded-t-lg" style={{ height: `${allocatedStorage * 1.2}px` }}>
              <div className="text-xs text-gray-400 p-2">Max: 500GB</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Allocated: {allocatedStorage}GB</div>
          </div>
        </div>
        <div className={`text-center p-2 rounded-lg ${triggerScaling ? "bg-indigo-900/50 text-indigo-300" : "bg-gray-700 text-gray-400"}`}>
          {triggerScaling ? "⚡ Auto scaling triggered: +10GB allocated" : "Storage within normal range"}
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
          <li>• Triggers when free space &lt;10% for 5+ minutes</li>
          <li>• Scales by max of: 5GB, 10%, or predicted need</li>
          <li>• Set maximum storage threshold</li>
          <li>• No downtime during storage scaling</li>
        </ul>
      </div>
    </div>
  )
}

// 14. Aurora Endpoints Explainer
export function AuroraEndpointsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<"cluster" | "reader" | "instance" | "custom">("cluster")

  const steps = [
    { title: "Aurora Endpoints", description: "Different endpoints for different access patterns and use cases" },
    { title: "Cluster Endpoint", description: "Points to current writer instance - use for all write operations" },
    { title: "Reader Endpoint", description: "Load balances across all read replicas - use for read operations" },
    { title: "Instance Endpoints", description: "Direct connection to specific instance - for troubleshooting" },
    { title: "Custom Endpoints", description: "Group specific instances for specialized workloads" }
  ]

  const endpoints = {
    cluster: { name: "Cluster (Writer)", color: "bg-green-500", targets: ["Writer"] },
    reader: { name: "Reader", color: "bg-blue-500", targets: ["Reader 1", "Reader 2", "Reader 3"] },
    instance: { name: "Instance", color: "bg-yellow-500", targets: ["Specific Instance"] },
    custom: { name: "Custom", color: "bg-purple-500", targets: ["Reader 1", "Reader 2"] }
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
        <Server className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Aurora Endpoints</h2>
      </div>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {(Object.keys(endpoints) as Array<keyof typeof endpoints>).map(ep => (
          <button key={ep} onClick={() => setSelectedEndpoint(ep)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedEndpoint === ep ? `${endpoints[ep].color} text-white` : "bg-gray-700 text-gray-300"}`}>
            {endpoints[ep].name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className={`w-16 h-16 ${endpoints[selectedEndpoint].color} rounded-lg flex items-center justify-center mb-2`}>
              <span className="text-white text-2xl">🔗</span>
            </div>
            <div className="text-white text-sm">{endpoints[selectedEndpoint].name}</div>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="flex flex-col gap-2">
            {endpoints[selectedEndpoint].targets.map((target, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="text-white text-sm">{target}</span>
              </div>
            ))}
          </div>
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
          <li>• Cluster endpoint: always points to writer</li>
          <li>• Reader endpoint: load balances read replicas</li>
          <li>• Custom endpoints: group instances for workloads</li>
          <li>• Instance endpoints: direct access for troubleshooting</li>
        </ul>
      </div>
    </div>
  )
}

// 15. RDS IAM Authentication Explainer
export function RdsIamAuthenticationExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "IAM DB Authentication", description: "Use IAM credentials instead of database passwords" },
    { title: "Token-Based", description: "Generate authentication token valid for 15 minutes" },
    { title: "SSL Required", description: "Connections must use SSL/TLS encryption" },
    { title: "Supported Engines", description: "MySQL, PostgreSQL, and MariaDB on RDS and Aurora" },
    { title: "IAM Policy", description: "Grant rds-db:connect permission to IAM users/roles" }
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
        <Shield className="w-8 h-8 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">RDS IAM Authentication</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <span className="text-2xl">👤</span>
            </div>
            <div className="text-white text-sm">IAM User/Role</div>
          </div>
          <div className="flex flex-col items-center px-4">
            <div className="text-xs text-gray-400">1. Request Token</div>
            <div className="text-xl">→</div>
          </div>
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <span className="text-2xl">🎫</span>
            </div>
            <div className="text-white text-sm">Auth Token</div>
            <div className="text-xs text-gray-400">Valid 15 min</div>
          </div>
          <div className="flex flex-col items-center px-4">
            <div className="text-xs text-gray-400">2. Connect (SSL)</div>
            <div className="text-xl">→</div>
          </div>
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div className="text-white text-sm">RDS/Aurora</div>
          </div>
        </div>
        <div className="mt-4 bg-gray-700 rounded-lg p-3 font-mono text-xs text-green-400">
          aws rds generate-db-auth-token --hostname mydb.xxx.rds.amazonaws.com --port 3306 --username myuser
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl p-4 border border-amber-500/30">
        <h3 className="text-lg font-semibold text-amber-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Token valid for 15 minutes only</li>
          <li>• SSL/TLS required for IAM auth connections</li>
          <li>• Supported: MySQL, PostgreSQL, MariaDB</li>
          <li>• Use rds-db:connect IAM permission</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const rdsAuroraExplainers = {
  "multi-az-deployments": MultiAzDeploymentsExplainer,
  "read-replicas": ReadReplicasExplainer,
  "aurora-architecture": AuroraArchitectureExplainer,
  "rds-proxy": RdsProxyExplainer,
  "backup-recovery": BackupRecoveryExplainer,
  "parameter-option-groups": ParameterOptionGroupsExplainer,
  "aurora-serverless": AuroraServerlessExplainer,
  "rds-encryption": RdsEncryptionExplainer,
  "aurora-global-database": AuroraGlobalDatabaseExplainer,
  "rds-performance-insights": RdsPerformanceInsightsExplainer,
  "aurora-cloning": AuroraCloningExplainer,
  "rds-maintenance-windows": RdsMaintenanceWindowsExplainer,
  "rds-storage-autoscaling": RdsStorageAutoScalingExplainer,
  "aurora-endpoints": AuroraEndpointsExplainer,
  "rds-iam-authentication": RdsIamAuthenticationExplainer,
}
