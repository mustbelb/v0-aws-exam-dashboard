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
        {step === 0 && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-blue-300">Multi-AZ Deployment Architecture</h3>
            </div>
            <div className="flex justify-between items-start">
              {/* AZ 1 - Primary */}
              <div className="flex-1 p-4 rounded-lg border-2 border-green-500 bg-green-900/20 mr-4">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1a</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-2 bg-blue-600">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-semibold">✓ Primary</span>
                  <span className="text-xs text-gray-400">Read/Write</span>
                </div>
              </div>

              {/* Sync Arrow */}
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-xs text-gray-400 mb-2">Sync</div>
                <RefreshCw className="w-6 h-6 text-green-500" />
                <div className="text-xs text-gray-400 mt-2">Replication</div>
              </div>

              {/* AZ 2 - Standby */}
              <div className="flex-1 p-4 rounded-lg border-2 border-yellow-500 bg-yellow-900/20 ml-4">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1b</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-2 bg-yellow-600">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-semibold">⏳ Standby</span>
                  <span className="text-xs text-gray-400">No Traffic</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-blue-300">Synchronous Replication Flow</h3>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20 mr-4">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1a</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-2 bg-blue-600">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-semibold">Primary</span>
                  <span className="text-xs text-green-400 mt-2">✍️ Write committed</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-xs text-green-400 font-bold mb-2">SYNC</div>
                <RefreshCw className="w-6 h-6 text-green-500 animate-spin" />
                <div className="text-xs text-green-400 font-bold mt-2">Zero Data Loss</div>
              </div>

              <div className="flex-1 p-4 rounded-lg border-2 border-green-500 bg-green-900/20 ml-4">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1b</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-2 bg-green-600">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-semibold">Standby</span>
                  <span className="text-xs text-green-400 mt-2">✓ Write replicated</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-sm text-blue-300">Every write waits for standby confirmation before returning success</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-orange-300">Automatic Failover in Action</h3>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 p-4 rounded-lg border-2 border-red-500 bg-red-900/20 opacity-50 mr-4">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1a</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-2 bg-red-600">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-semibold">❌ Primary Failed</span>
                  <span className="text-xs text-red-400">Unavailable</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-xs text-orange-400 mb-2">Failover</div>
                <RefreshCw className="w-6 h-6 text-orange-500" />
                <div className="text-xs text-orange-400 mt-2">DNS Update</div>
              </div>

              <div className="flex-1 p-4 rounded-lg border-2 border-green-500 bg-green-900/20 ml-4">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">us-east-1b</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-2 bg-green-600">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-semibold">✓ New Primary</span>
                  <span className="text-xs text-green-400">Now Read/Write</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">RDS Endpoint (DNS)</div>
              <div className="font-mono text-sm text-green-400">mydb.abc123.us-east-1.rds.amazonaws.com</div>
              <div className="text-xs text-orange-400 mt-1">Automatically redirected to us-east-1b</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Failover Timeline</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-purple-400 font-mono text-sm">T+0s</div>
                <div className="flex-1 bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <span className="text-white">Primary instance failure detected</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-purple-400 font-mono text-sm">T+10s</div>
                <div className="flex-1 bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
                  <span className="text-white">RDS initiates automatic failover</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-purple-400 font-mono text-sm">T+60s</div>
                <div className="flex-1 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3">
                  <span className="text-white">DNS record updated to point to standby</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-purple-400 font-mono text-sm">T+120s</div>
                <div className="flex-1 bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                  <span className="text-white">Standby promoted - Service fully restored</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Typical failover: 60-120 seconds (depends on DNS TTL)</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-yellow-300">Multi-AZ vs Read Replicas</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-blue-300 font-semibold mb-2">Multi-AZ (This)</div>
                  <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ High Availability</li>
                  <li>✓ Synchronous replication</li>
                  <li>✓ Automatic failover</li>
                  <li>✗ Standby not readable</li>
                  <li>✗ No read scaling</li>
                </ul>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-green-300 font-semibold mb-2">Read Replicas</div>
                  <Server className="w-12 h-12 text-green-400 mx-auto mb-2" />
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Read scaling</li>
                  <li>✓ Replicas are readable</li>
                  <li>✓ Cross-region support</li>
                  <li>✗ Asynchronous replication</li>
                  <li>✗ No automatic failover</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-yellow-900/30 rounded-lg p-4 text-center border border-yellow-500/30">
              <p className="text-sm text-yellow-300">Use Multi-AZ for HA, Read Replicas for read scaling - often used together!</p>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-green-300">Read Replicas Architecture</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20 mb-6">
                <div className="flex flex-col items-center">
                  <Database className="w-12 h-12 text-blue-400 mb-2" />
                  <span className="text-white font-semibold">Primary Instance</span>
                  <span className="text-xs text-gray-400">Read/Write</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-4">Asynchronous Replication ↓</div>
              <div className="flex gap-4 flex-wrap justify-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                    <div className="flex flex-col items-center">
                      <Database className="w-10 h-10 text-green-400 mb-2" />
                      <span className="text-white font-semibold text-sm">Replica {i}</span>
                      <span className="text-xs text-gray-400">Read Only</span>
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
              <h3 className="text-lg font-semibold text-green-300">Asynchronous Replication Flow</h3>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20">
                  <div className="flex flex-col items-center">
                    <Database className="w-12 h-12 text-blue-400 mb-2" />
                    <span className="text-white font-semibold">Primary</span>
                    <span className="text-xs text-green-400 mt-2">✍️ Write committed</span>
                    <span className="text-xs text-gray-500">(immediately)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-8 py-8">
                <div className="text-xs text-yellow-400 font-bold mb-2">ASYNC</div>
                <RefreshCw className="w-6 h-6 text-yellow-500" />
                <div className="text-xs text-yellow-400 font-bold mt-2">Eventual</div>
              </div>

              <div className="flex-1">
                <div className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                  <div className="flex flex-col items-center">
                    <Database className="w-12 h-12 text-green-400 mb-2" />
                    <span className="text-white font-semibold">Replica</span>
                    <span className="text-xs text-yellow-400 mt-2">⏱️ Replication lag</span>
                    <span className="text-xs text-gray-500">(milliseconds-seconds)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-yellow-900/30 rounded-lg p-4 text-center border border-yellow-500/30">
              <p className="text-sm text-yellow-300">Write returns success immediately - replicas catch up asynchronously</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-green-300">Read Scaling in Action</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20 mb-4">
                <div className="flex flex-col items-center">
                  <Database className="w-12 h-12 text-blue-400 mb-2" />
                  <span className="text-white font-semibold">Primary</span>
                  <span className="text-xs text-gray-400">✍️ All Writes + Some Reads</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-4">↓ Offload Reads ↓</div>
              <div className="flex gap-4 flex-wrap justify-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg border-2 border-green-500 bg-green-900/20">
                    <div className="flex flex-col items-center">
                      <Database className="w-10 h-10 text-green-400 mb-2" />
                      <span className="text-white font-semibold text-sm">Replica {i}</span>
                      <span className="text-xs text-green-400">📖 Read Traffic</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2 text-center">Read Traffic Distribution</div>
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-blue-600 rounded h-6 flex items-center justify-center">
                  <span className="text-xs text-white">Primary (25%)</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 bg-green-600 rounded h-6 flex items-center justify-center">
                    <span className="text-xs text-white">R{i} (25%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Read Replica Limits</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-blue-300 font-semibold mb-2">RDS (MySQL/PostgreSQL)</div>
                  <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">5</div>
                  <div className="text-sm text-gray-300">Max Read Replicas</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-purple-300 font-semibold mb-2">Aurora</div>
                  <Database className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">15</div>
                  <div className="text-sm text-gray-300">Max Read Replicas</div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Aurora supports 3x more read replicas than standard RDS!</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Read Replica Promotion</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <Database className="w-10 h-10 text-blue-400 mb-2" />
                      <div className="text-white font-semibold">Primary</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>→ Replicating →</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                  <div>
                    <Database className="w-10 h-10 text-green-400 mb-2" />
                    <div className="text-white font-semibold">Read Replica</div>
                    <div className="text-xs text-gray-400">Connected</div>
                  </div>
                </div>
              </div>

              <div className="text-center text-orange-400 font-bold">↓ PROMOTE ↓</div>

              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 rounded-lg border-2 border-gray-500 bg-gray-900/20 opacity-50">
                  <div>
                    <Database className="w-10 h-10 text-gray-400 mb-2" />
                    <div className="text-gray-400 font-semibold">Old Primary</div>
                    <div className="text-xs text-gray-500">Still running</div>
                  </div>
                </div>
                <div className="flex-1 p-4 rounded-lg border-2 border-orange-500 bg-orange-900/20">
                  <div>
                    <Database className="w-10 h-10 text-orange-400 mb-2" />
                    <div className="text-white font-semibold">New Standalone DB</div>
                    <div className="text-xs text-orange-400">Read/Write (no replication)</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">Promotion breaks replication link - creates independent database</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">Cross-Region Read Replicas</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-center mb-3">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">us-east-1</span>
                </div>
                <div className="flex justify-center">
                  <div className="p-4 rounded-lg border-2 border-blue-400 bg-blue-800/20">
                    <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <div className="text-white font-semibold text-center">Primary</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="flex-1 h-1 bg-cyan-500 rounded"></div>
                <span className="text-cyan-400 text-sm">Cross-Region Replication</span>
                <div className="flex-1 h-1 bg-cyan-500 rounded"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">eu-west-1</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-3 rounded-lg border-2 border-green-400 bg-green-800/20">
                      <Database className="w-10 h-10 text-green-400 mx-auto mb-1" />
                      <div className="text-white text-sm text-center">Replica</div>
                      <div className="text-xs text-gray-400 text-center">Lower latency (EU)</div>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">ap-southeast-1</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-3 rounded-lg border-2 border-purple-400 bg-purple-800/20">
                      <Database className="w-10 h-10 text-purple-400 mx-auto mb-1" />
                      <div className="text-white text-sm text-center">Replica</div>
                      <div className="text-xs text-gray-400 text-center">DR backup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-cyan-900/30 rounded-lg p-4 text-center border border-cyan-500/30">
              <p className="text-sm text-cyan-300">Cross-region replicas for disaster recovery and global low-latency reads</p>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Aurora Storage Architecture</h3>
            </div>
            <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-lg p-6 border border-orange-500/30">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-orange-300 mb-2">Shared Storage Layer</div>
                <div className="text-sm text-gray-300">Distributed, fault-tolerant, self-healing</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {["AZ-1", "AZ-2", "AZ-3"].map((az, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/30">
                    <div className="text-center mb-2">
                      <span className="text-xs text-orange-400 font-semibold">{az}</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">1</span>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">2</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="inline-block bg-orange-900/50 px-4 py-2 rounded-lg border border-orange-500/50">
                  <div className="text-2xl font-bold text-orange-300 mb-1">6 Copies</div>
                  <div className="text-xs text-gray-400">Across 3 Availability Zones</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">Can lose 2 copies without affecting write availability, 3 copies without affecting reads</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Writer Instance</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-6 rounded-lg border-2 border-orange-500 bg-orange-900/20 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
                    <Database className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-white font-semibold text-lg">Writer Instance</span>
                  <span className="text-xs text-orange-400 mt-2">Single writer for all write operations</span>
                </div>
              </div>
              <div className="text-gray-400 mb-4">↓ Writes to ↓</div>
              <div className="w-full bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-lg p-4 border border-orange-500/30">
                <div className="text-center mb-2">
                  <span className="text-orange-300 font-semibold">Shared Storage Layer</span>
                </div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white">{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">Only ONE writer instance - all writes go through it to ensure consistency</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-green-300">Reader Instances</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-4 mb-6">
                <div className="p-4 rounded-lg border-2 border-orange-500 bg-orange-900/20">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                      <Database className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-white font-semibold">Writer</span>
                    <span className="text-xs text-gray-400">Reads + Writes</span>
                  </div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 rounded-lg border-2 border-green-500 bg-green-900/20">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-sm">R{i}</span>
                      <span className="text-xs text-gray-400">Read Only</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-gray-400 mb-4">↑ All read from same storage ↑</div>
              <div className="w-full bg-gradient-to-r from-orange-900/50 to-yellow-900/50 rounded-lg p-3 border border-orange-500/30">
                <div className="text-center text-orange-300 text-sm">Shared Storage (6 copies across 3 AZs)</div>
              </div>
            </div>
            <div className="mt-6 bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
              <p className="text-sm text-green-300">Up to 15 read replicas - all share the same storage, no data copying needed!</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-blue-300">Auto-Healing Storage</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {["AZ-1", "AZ-2", "AZ-3"].map((az, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4 border border-orange-500/30">
                    <div className="text-center mb-2">
                      <span className="text-xs text-orange-400 font-semibold">{az}</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${i === 1 ? "bg-red-600" : "bg-orange-500"}`}>
                        <span className="text-xs text-white">{i * 2 + 1}</span>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">{i * 2 + 2}</span>
                      </div>
                    </div>
                    {i === 1 && <div className="text-xs text-red-400 text-center mt-2">❌ Failed</div>}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold mb-2">↓ Auto-Healing ↓</div>
                <RefreshCw className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["AZ-1", "AZ-2", "AZ-3"].map((az, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4 border border-green-500/30">
                    <div className="text-center mb-2">
                      <span className="text-xs text-green-400 font-semibold">{az}</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">{i * 2 + 1}</span>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">{i * 2 + 2}</span>
                      </div>
                    </div>
                    {i === 1 && <div className="text-xs text-green-400 text-center mt-2">✓ Repaired</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-sm text-blue-300">Storage automatically detects and repairs failed segments using peer segments</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Aurora Global Database</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/20">
                <div className="text-center mb-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Primary Region (us-east-1)</span>
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-orange-600 rounded-lg flex items-center justify-center mb-1">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs text-white">Writer</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">Reader</span>
                  </div>
                </div>
                <div className="bg-orange-900/30 rounded-lg p-2 border border-orange-500/30">
                  <div className="text-xs text-center text-orange-300">Primary Storage</div>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-purple-500 bg-purple-900/20">
                <div className="text-center mb-4">
                  <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">Secondary Region (eu-west-1)</span>
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-1">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-400">Reader</span>
                    </div>
                  ))}
                </div>
                <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/30">
                  <div className="text-xs text-center text-purple-300">Replicated Storage</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 my-4">
              <div className="flex-1 h-1 bg-purple-500 rounded"></div>
              <div className="bg-purple-900/50 px-4 py-2 rounded-lg border border-purple-500/50">
                <RefreshCw className="w-4 h-4 text-purple-400 inline mr-2" />
                <span className="text-sm text-purple-300">&lt;1 second lag</span>
              </div>
              <div className="flex-1 h-1 bg-purple-500 rounded"></div>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Cross-region replication with sub-second latency for DR and global reads</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">Aurora Serverless v2</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-end justify-center gap-2 h-40">
                {[2, 5, 8, 12, 15, 10, 6, 3].map((height, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all"
                      style={{ height: `${height * 6}px` }}
                    />
                    <div className="text-xs text-gray-400 mt-1">{i + 1}h</div>
                  </div>
                ))}
              </div>
              <div className="text-center text-cyan-300 font-semibold mb-4">Auto-Scaling Capacity</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2">Minimum ACUs</div>
                    <div className="text-2xl font-bold text-cyan-300">0.5</div>
                  </div>
                </div>
                <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2">Maximum ACUs</div>
                    <div className="text-2xl font-bold text-cyan-300">128</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ Scales in fine-grained increments</div>
                  <div>✓ Instant scaling (no cold starts)</div>
                  <div>✓ Pay only for capacity used</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-cyan-900/30 rounded-lg p-4 text-center border border-cyan-500/30">
              <p className="text-sm text-cyan-300">Serverless v2 auto-scales to match application demand - no manual capacity planning</p>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">RDS Proxy Architecture</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="flex flex-wrap w-24 gap-1 justify-center mb-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-orange-500 rounded text-xs flex items-center justify-center text-white">
                      λ
                    </div>
                  ))}
                </div>
                <span className="text-sm text-orange-400">Lambda Functions</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-cyan-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <Shield className="w-12 h-12 text-white" />
                  <span className="text-xs text-white mt-1">RDS Proxy</span>
                </div>
                <span className="text-sm text-cyan-400">Managed Proxy</span>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-12 h-12 text-white" />
                </div>
                <span className="text-sm text-blue-400">RDS Database</span>
              </div>
            </div>
            <div className="mt-6 bg-cyan-900/30 rounded-lg p-4 text-center border border-cyan-500/30">
              <p className="text-sm text-cyan-300">Fully managed database proxy layer between applications and database</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">Connection Pooling</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {Array.from({ length: Math.min(20, Math.ceil(connectionCount / 100)) }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-orange-500 rounded"></div>
                    ))}
                  </div>
                  <span className="text-sm text-orange-400">{connectionCount} App Connections</span>
                </div>
                <div className="text-gray-500 text-2xl px-4">→</div>
                <div className="text-center flex-1">
                  <div className="w-20 h-20 bg-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm text-cyan-400">Connection Pool</span>
                </div>
                <div className="text-gray-500 text-2xl px-4">→</div>
                <div className="text-center flex-1">
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {Array.from({ length: Math.min(20, proxyConnections / 10) }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-blue-500 rounded"></div>
                    ))}
                  </div>
                  <span className="text-sm text-blue-400">{proxyConnections} DB Connections</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-300">Without Proxy</div>
                    <div className="text-red-400 font-semibold">{connectionCount} connections</div>
                    {connectionCount > maxDbConnections && (
                      <div className="text-xs text-red-400">⚠️ Exceeds limit</div>
                    )}
                  </div>
                  <div className="text-2xl text-gray-500">vs</div>
                  <div>
                    <div className="text-sm text-gray-300">With Proxy</div>
                    <div className="text-green-400 font-semibold">{proxyConnections} connections</div>
                    <div className="text-xs text-green-400">✓ Optimized</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-cyan-900/30 rounded-lg p-4 text-center border border-cyan-500/30">
              <p className="text-sm text-cyan-300">{Math.round((1 - proxyConnections / connectionCount) * 100)}% reduction in database connections</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Perfect for AWS Lambda</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-red-300 font-semibold mb-3">Without Proxy</div>
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-orange-500 rounded text-xs flex items-center justify-center text-white">
                        λ
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">1000 concurrent Lambdas</div>
                  <div className="text-red-400 text-lg font-bold mb-2">❌</div>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✗ 1000 DB connections</li>
                  <li>✗ Connection exhaustion</li>
                  <li>✗ Lambda connection overhead</li>
                  <li>✗ Poor performance</li>
                </ul>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-green-300 font-semibold mb-3">With RDS Proxy</div>
                  <div className="flex gap-2 justify-center items-center mb-3">
                    <div className="flex flex-wrap w-20 gap-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-orange-500 rounded"></div>
                      ))}
                    </div>
                    <div className="text-gray-500">→</div>
                    <div className="w-12 h-12 bg-cyan-600 rounded flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">1000 concurrent Lambdas</div>
                  <div className="text-green-400 text-lg font-bold mb-2">✓</div>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ ~50-100 DB connections</li>
                  <li>✓ Connection pooling</li>
                  <li>✓ Fast connection reuse</li>
                  <li>✓ Excellent performance</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">Lambda creates new connections rapidly - Proxy pools and reuses them efficiently</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Faster Failover</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="text-red-300 font-semibold mb-2">Without Proxy</div>
                    <Clock className="w-12 h-12 text-red-400 mx-auto mb-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-right text-red-400 font-mono text-sm">T+0s</div>
                      <div className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white">Primary fails</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-right text-red-400 font-mono text-sm">T+60s</div>
                      <div className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white">DNS update</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-right text-red-400 font-mono text-sm">T+120s</div>
                      <div className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white">Apps reconnect</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-red-400 font-bold">~2 minutes</div>
                </div>
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="text-green-300 font-semibold mb-2">With Proxy</div>
                    <Clock className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-right text-green-400 font-mono text-sm">T+0s</div>
                      <div className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white">Primary fails</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-right text-green-400 font-mono text-sm">T+10s</div>
                      <div className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white">Proxy detects</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-right text-green-400 font-mono text-sm">T+40s</div>
                      <div className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white">Routes to standby</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-green-400 font-bold">~40 seconds</div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Proxy reduces failover time by 66% by maintaining connection pool to standby</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-blue-300">IAM Database Authentication</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl text-white">λ</span>
                  </div>
                  <span className="text-sm text-orange-400">Lambda</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-blue-400 mb-1">IAM Auth Token</div>
                  <div className="text-blue-400 text-2xl">→</div>
                  <div className="text-xs text-gray-500 mt-1">(15 min validity)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-600 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm text-cyan-400">RDS Proxy</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-cyan-400 mb-1">DB Credentials</div>
                  <div className="text-cyan-400 text-2xl">→</div>
                  <div className="text-xs text-gray-500 mt-1">(from Secrets Manager)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm text-blue-400">RDS</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-blue-300 mb-2">Security Benefits:</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ No hardcoded database credentials</div>
                  <div>✓ IAM-based access control</div>
                  <div>✓ Centralized credential management in Secrets Manager</div>
                  <div>✓ Automatic credential rotation</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-sm text-blue-300">Apps use IAM tokens, Proxy handles database credentials securely</p>
            </div>
          </div>
        )}
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
        <h2 className="text-2xl font-bold text-white">Backup &amp; Recovery</h2>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-yellow-300">RDS Backup Options</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-green-300 font-semibold mb-3">Automated Backups</div>
                  <Clock className="w-12 h-12 text-green-400 mx-auto mb-2" />
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Daily snapshots</li>
                  <li>✓ Transaction logs (5 min)</li>
                  <li>✓ Point-in-time recovery</li>
                  <li>✓ 1-35 day retention</li>
                  <li>✓ Enabled by default</li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-blue-300 font-semibold mb-3">Manual Snapshots</div>
                  <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ User-initiated</li>
                  <li>✓ Full database snapshot</li>
                  <li>✓ Kept until deleted</li>
                  <li>✓ Unlimited retention</li>
                  <li>✓ Can copy cross-region</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-yellow-900/30 rounded-lg p-4 text-center border border-yellow-500/30">
              <p className="text-sm text-yellow-300">Both backup types stored in S3, but automated backups support PITR</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-green-300">Automated Backups</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm text-blue-400">RDS Instance</span>
                </div>
                <div className="text-gray-500 text-2xl">→</div>
                <div className="flex flex-col gap-3">
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 min-w-[200px]">
                    <div className="text-sm text-green-400 font-semibold">Daily Snapshot</div>
                    <div className="text-xs text-gray-400">During backup window</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 min-w-[200px]">
                    <div className="text-sm text-yellow-400 font-semibold">Transaction Logs</div>
                    <div className="text-xs text-gray-400">Archived every 5 minutes</div>
                  </div>
                </div>
                <div className="text-gray-500 text-2xl">→</div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-3xl">🪣</span>
                  </div>
                  <span className="text-sm text-green-400">S3 Storage</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-400">Retention:</span> <span className="text-white">1-35 days</span></div>
                  <div><span className="text-gray-400">PITR:</span> <span className="text-green-400">To any second</span></div>
                  <div><span className="text-gray-400">Delete with DB:</span> <span className="text-yellow-400">Yes (configurable)</span></div>
                  <div><span className="text-gray-400">Cost:</span> <span className="text-green-400">Free up to DB size</span></div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
              <p className="text-sm text-green-300">Automated backups run during your specified backup window (30 min default)</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-blue-300">Manual Snapshots</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm text-blue-400">RDS Instance</span>
                </div>
                <div className="text-gray-500 text-2xl">→</div>
                <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 min-w-[200px]">
                  <div className="text-sm text-blue-400 font-semibold text-center">📸 Create Snapshot</div>
                  <div className="text-xs text-gray-400 text-center mt-1">User-initiated</div>
                  <div className="text-xs text-gray-500 text-center mt-2">Anytime you want</div>
                </div>
                <div className="text-gray-500 text-2xl">→</div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-3xl">🪣</span>
                  </div>
                  <span className="text-sm text-blue-400">S3 Storage</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-400">Retention:</span> <span className="text-white">Until you delete</span></div>
                  <div><span className="text-gray-400">PITR:</span> <span className="text-red-400">No (snapshot only)</span></div>
                  <div><span className="text-gray-400">Delete with DB:</span> <span className="text-green-400">No (persists)</span></div>
                  <div><span className="text-gray-400">Cross-Region:</span> <span className="text-green-400">Yes, can copy</span></div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-sm text-blue-300">Manual snapshots persist after DB deletion - great for compliance &amp; long-term backup</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Point-in-Time Recovery (PITR)</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-purple-300 font-semibold mb-2">Restore to Any Second</div>
                  <div className="flex items-center justify-center gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={i} className={`px-3 py-2 rounded ${i === 3 ? 'bg-purple-600' : 'bg-gray-600'}`}>
                        <div className="text-xs text-white">{day}</div>
                        {i === 3 && <div className="text-xs text-purple-200 mt-1">14:35:47</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-around">
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-400 mb-2">Daily Snapshots</div>
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-xs text-white">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-purple-400 text-2xl px-4">+</div>
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-400 mb-2">Transaction Logs</div>
                  <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-yellow-500 rounded"></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Every 5 minutes</div>
                </div>
                <div className="text-purple-400 text-2xl px-4">=</div>
                <div className="text-center flex-1">
                  <div className="text-sm text-purple-400 mb-2">PITR</div>
                  <div className="text-3xl text-purple-400">⏱️</div>
                  <div className="text-xs text-gray-400 mt-1">Second-level</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Restore to any second within retention period (1-35 days) - perfect for accidental deletes!</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">Cross-Region Snapshot Copy</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">us-east-1</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Database className="w-12 h-12 text-blue-400 mb-2" />
                    <div className="text-sm text-white font-semibold">Primary RDS</div>
                    <div className="text-xs text-gray-400 mt-2">Production</div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="text-cyan-400 mb-2">Copy Snapshot</div>
                  <div className="text-cyan-400 text-3xl">→</div>
                  <div className="text-xs text-gray-500 mt-2">Encrypted copy</div>
                </div>

                <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <span className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full">eu-west-1</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">🪣</span>
                    <div className="text-sm text-white font-semibold">DR Snapshot</div>
                    <div className="text-xs text-gray-400 mt-2">Backup region</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-cyan-300 mb-2">Use Cases:</div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>✓ Disaster recovery</div>
                  <div>✓ Geographic distribution</div>
                  <div>✓ Compliance requirements</div>
                  <div>✓ Migration to new region</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-cyan-900/30 rounded-lg p-4 text-center border border-cyan-500/30">
              <p className="text-sm text-cyan-300">Copy snapshots across regions for disaster recovery - can restore in target region if needed</p>
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
        <h2 className="text-2xl font-bold text-white">Parameter &amp; Option Groups</h2>
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
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Configuration Groups Overview</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <Settings className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-300 font-semibold">Parameter Groups</div>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Database engine settings</li>
                  <li>• Like postgresql.conf or my.cnf</li>
                  <li>• Dynamic or static parameters</li>
                  <li>• Controls DB behavior</li>
                </ul>
              </div>
              <div className="bg-teal-900/30 border-2 border-teal-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <Settings className="w-12 h-12 text-teal-400 mx-auto mb-2" />
                  <div className="text-teal-300 font-semibold">Option Groups</div>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Optional features/plugins</li>
                  <li>• Engine-specific options</li>
                  <li>• Enable extra functionality</li>
                  <li>• Examples: TDE, Audit, plugins</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Both groups customize and control database behavior and features</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Parameter Groups</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-purple-300 font-semibold mb-3">Common Parameters:</div>
                <div className="space-y-3">
                  {parameterExamples.map((param, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-600 rounded-lg p-3">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-white">{param.name}</div>
                        <div className="text-xs text-gray-400 mt-1">Value: {param.value}</div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded font-semibold ${
                        param.type === "Dynamic" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                      }`}>
                        {param.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                  <div className="text-green-400 font-semibold text-sm mb-1">Dynamic Parameters</div>
                  <div className="text-xs text-gray-300">Apply immediately - no reboot</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3">
                  <div className="text-yellow-400 font-semibold text-sm mb-1">Static Parameters</div>
                  <div className="text-xs text-gray-300">Require instance reboot</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Parameter groups define database engine configuration - similar to config files</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-teal-300">Option Groups</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-teal-300 font-semibold mb-3">Available Options by Engine:</div>
                <div className="space-y-3">
                  {optionExamples.map((option, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-600 rounded-lg p-3">
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl">✓</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{option.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• Oracle: TDE, APEX, Statspack</div>
                  <div>• SQL Server: SQL Server Audit, Native Backup/Restore</div>
                  <div>• MySQL/MariaDB: Memcached plugin</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-teal-900/30 rounded-lg p-4 text-center border border-teal-500/30">
              <p className="text-sm text-teal-300">Option groups enable engine-specific optional features and plugins</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Static vs Dynamic Parameters</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="text-green-300 font-semibold text-lg">Dynamic</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-700 rounded p-2 text-sm">
                    <div className="font-mono text-white">max_connections</div>
                    <div className="text-xs text-gray-400">Change: 100 → 200</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-sm">Apply Immediately</div>
                    <div className="text-xs text-gray-400">No downtime!</div>
                  </div>
                </div>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>✓ No reboot required</li>
                  <li>✓ Zero downtime</li>
                  <li>✓ Takes effect instantly</li>
                </ul>
              </div>

              <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">🔄</span>
                  </div>
                  <div className="text-yellow-300 font-semibold text-lg">Static</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-700 rounded p-2 text-sm">
                    <div className="font-mono text-white">shared_buffers</div>
                    <div className="text-xs text-gray-400">Change: 128MB → 256MB</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-sm">Requires Reboot</div>
                    <div className="text-xs text-gray-400">Planned maintenance</div>
                  </div>
                </div>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>⚠️ Reboot required</li>
                  <li>⚠️ Causes downtime</li>
                  <li>⚠️ Plan carefully</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">Always check if a parameter is dynamic or static before changing it in production!</p>
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

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Aurora Serverless v2 Overview</h3>
            </div>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-12 h-12 text-white" />
                </div>
                <div className="text-white font-semibold">Aurora Serverless v2</div>
                <div className="text-xs text-gray-400 mt-1">Auto-scales instantly</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Scaling:</span> <span className="text-white">Automatic &amp; instant</span></div>
                <div><span className="text-gray-400">Pricing:</span> <span className="text-white">Pay per second</span></div>
                <div><span className="text-gray-400">Min ACUs:</span> <span className="text-white">0.5</span></div>
                <div><span className="text-gray-400">Max ACUs:</span> <span className="text-white">128</span></div>
              </div>
            </div>
            <div className="mt-4 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">Perfect for variable workloads - no capacity planning needed!</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-orange-300">Aurora Capacity Units (ACUs)</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-orange-400 mb-2">1 ACU</div>
                  <div className="text-gray-400 text-sm">=</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">~2 GB</div>
                    <div className="text-xs text-gray-400">RAM</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">Proportional</div>
                    <div className="text-xs text-gray-400">CPU &amp; Networking</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-orange-300 mb-2">ACU Examples:</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• 0.5 ACU = ~1GB RAM (minimum)</div>
                  <div>• 2 ACU = ~4GB RAM</div>
                  <div>• 16 ACU = ~32GB RAM</div>
                  <div>• 128 ACU = ~256GB RAM (maximum)</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-orange-900/30 rounded-lg p-4 text-center border border-orange-500/30">
              <p className="text-sm text-orange-300">ACUs provide a simple way to measure and pay for compute capacity</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-green-300">Instant Scaling</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-end justify-center gap-1 h-40">
                {[1, 0.5, 2, 6, 12, 16, 8, 4, 2, 1, 0.5].map((val, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t transition-all"
                      style={{ height: `${(val / 16) * 140}px` }}
                    />
                    <div className="text-xs text-gray-400 mt-1">{i}m</div>
                  </div>
                ))}
              </div>
              <div className="text-center text-green-300 font-semibold">Workload Demand Over Time</div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-300 mb-2">Scaling Speed:</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>✓ Scales up/down in <span className="text-green-400">milliseconds</span></div>
                  <div>✓ No connection disruption</div>
                  <div>✓ No downtime</div>
                  <div>✓ Automatic response to demand</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
              <p className="text-sm text-green-300">Scales instantly without disrupting database connections - unlike provisioned instances!</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-purple-300">Configure Min/Max ACUs</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <input type="range" min="0.5" max="16" step="0.5" value={acu} onChange={(e) => setAcu(parseFloat(e.target.value))} className="w-64" />
                <span className="ml-4 text-white font-mono">{acu} ACUs</span>
              </div>
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
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-purple-300 mb-2">ACU Range:</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Minimum: 0.5 - 128 ACUs</div>
                  <div>• Maximum: 1 - 128 ACUs</div>
                  <div>• Set boundaries for cost control</div>
                  <div>• Aurora auto-scales within range</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
              <p className="text-sm text-purple-300">Define min/max ACUs to control costs while maintaining performance</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">Pay Per Use Pricing</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400 mb-2">Current Capacity</div>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">{acu} ACUs</div>
                  <div className="text-xl font-bold text-green-400">~${(acu * 0.12).toFixed(2)}/hour</div>
                  <div className="text-xs text-gray-500 mt-1">Billed per second</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-cyan-300 mb-2">Pricing Benefits:</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>✓ Pay only for capacity used</div>
                  <div>✓ Billed per second (60 sec minimum)</div>
                  <div>✓ No over-provisioning waste</div>
                  <div>✓ Perfect for variable workloads</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <div className="text-red-300 font-semibold text-sm mb-1">Provisioned (8GB)</div>
                  <div className="text-xs text-gray-300">$100/month even at 10% usage</div>
                </div>
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                  <div className="text-green-300 font-semibold text-sm mb-1">Serverless v2</div>
                  <div className="text-xs text-gray-300">~$10-30/month at 10% avg usage</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-cyan-900/30 rounded-lg p-4 text-center border border-cyan-500/30">
              <p className="text-sm text-cyan-300">Ideal for dev/test, variable workloads, and applications with unpredictable demand</p>
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

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                <Database className="w-8 h-8 text-blue-400 mb-2" />
                <div className="text-white font-semibold">Data</div>
                <div className="text-xs text-gray-400">AES-256 Encrypted</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                <Clock className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-white font-semibold">Backups</div>
                <div className="text-xs text-gray-400">Encrypted</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-green-500 bg-green-900/20">
                <Server className="w-8 h-8 text-orange-400 mb-2" />
                <div className="text-white font-semibold">Snapshots</div>
                <div className="text-xs text-gray-400">Encrypted</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-400">KMS Key: </span>
              <span className="text-sm text-yellow-400 font-mono">aws/rds (default) or CMK</span>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="text-center">
            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-6 mb-4">
              <div className="text-yellow-300 font-semibold mb-2 text-lg">Database Creation Time</div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked className="w-4 h-4" readOnly />
                  <span className="text-white">Enable Encryption</span>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-gray-300 text-sm">Encryption must be enabled at creation - cannot be changed later!</div>
            </div>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
              <div className="text-red-300 font-semibold mb-2">Existing Unencrypted DB</div>
              <div className="text-gray-300 text-sm">Cannot enable encryption directly</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Database className="w-10 h-10 text-white" />
              </div>
              <div className="text-white font-semibold">Unencrypted DB</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-xs text-gray-400">1. Snapshot</div>
              <div className="text-2xl">→</div>
            </div>
            <div className="text-center flex-1">
              <div className="w-20 h-20 bg-yellow-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">📸</span>
              </div>
              <div className="text-white font-semibold">Snapshot</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-xs text-gray-400">2. Copy (Encrypted)</div>
              <div className="text-2xl">→</div>
            </div>
            <div className="text-center flex-1">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="text-white font-semibold">Encrypted Copy</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-xs text-gray-400">3. Restore</div>
              <div className="text-2xl">→</div>
            </div>
            <div className="text-center flex-1">
              <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Database className="w-10 h-10 text-white" />
              </div>
              <div className="text-white font-semibold">Encrypted DB</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-green-400">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">Source DB</div>
              <div className="text-xs text-green-400">Encrypted (AES-256)</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-green-400">
                <Server className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">Read Replica</div>
              <div className="text-xs text-green-400">Inherits Encryption</div>
            </div>
            <div className="mt-4 bg-yellow-900/30 border border-yellow-500 rounded-lg p-3">
              <div className="text-yellow-300 text-sm">Read replicas automatically inherit encryption from source!</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">💻</span>
                </div>
                <div className="text-white font-semibold">Client App</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-green-400 text-sm mb-1">SSL/TLS</div>
                <div className="text-2xl">🔒→</div>
                <div className="text-gray-400 text-xs">In-transit encryption</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white font-semibold">RDS</div>
                <div className="text-xs text-green-400">At-rest encryption</div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
              <div className="text-green-300 text-sm">Use SSL certificates to encrypt connections to RDS</div>
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

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="text-xs text-blue-400 mb-2 font-semibold">us-east-1 (Primary)</div>
              <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-green-400">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white text-sm">Read/Write</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-center">
              <div className="text-xs text-purple-400 mb-2 font-semibold">eu-west-1 (Secondary)</div>
              <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-2 border-blue-400">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white text-sm">Read-only</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-center">
              <div className="text-xs text-yellow-400 mb-2 font-semibold">ap-south-1 (Secondary)</div>
              <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-2 border-blue-400">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white text-sm">Read-only</div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">us-east-1 (Primary)</div>
              <div className="text-xs text-green-400">Read/Write</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-green-400 text-sm mb-1 animate-pulse">Replicating</div>
              <div className="text-2xl">⚡→</div>
              <div className="text-green-400 text-xs font-semibold">&lt;1 second lag</div>
            </div>
            <div className="text-center flex-1">
              <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">eu-west-1 (Secondary)</div>
              <div className="text-xs text-blue-400">Read-only</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-green-400">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white font-semibold text-sm">us-east-1</div>
                <div className="text-xs text-green-400">Primary</div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {["eu-west-1", "ap-south-1", "ap-northeast-1", "sa-east-1", "ca-central-1"].map((region, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-1 mx-auto">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs">{region}</div>
                  <div className="text-xs text-blue-400">Read-only</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-gray-400 text-sm">Up to 5 secondary regions supported</div>
          </div>
        )}
        {step === 3 && (
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-600 rounded-lg flex items-center justify-center mb-2 mx-auto relative">
                <Database className="w-12 h-12 text-white opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">❌</div>
              </div>
              <div className="text-white font-semibold">us-east-1</div>
              <div className="text-xs text-red-400">Primary Failed</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-orange-400 text-sm mb-1 animate-pulse">Promoting...</div>
              <div className="text-2xl">🔄</div>
              <div className="text-orange-400 text-xs font-semibold">RTO &lt;1 min</div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-green-400 animate-pulse">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">eu-west-1</div>
              <div className="text-xs text-green-400">New Primary!</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">💻</span>
                </div>
                <div className="text-white text-sm">App in eu-west-1</div>
                <div className="text-xs text-blue-400">Wants to Write</div>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="text-purple-400 text-sm mb-1">Write Forwarding</div>
                <div className="text-2xl">→</div>
              </div>
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white text-sm">eu-west-1 (Secondary)</div>
                <div className="text-xs text-purple-400">Forwards write</div>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="text-green-400 text-sm mb-1">Actual Write</div>
                <div className="text-2xl">→</div>
              </div>
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white text-sm">us-east-1 (Primary)</div>
                <div className="text-xs text-green-400">Executes write</div>
              </div>
            </div>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 text-center">
              <div className="text-purple-300 text-sm">Secondary regions can forward writes to primary with low latency</div>
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
        {step === 0 && (
          <div className="text-center">
            <div className="mb-4">
              <Settings className="w-16 h-16 text-purple-400 mx-auto mb-3" />
              <div className="text-white text-lg font-semibold mb-2">RDS Performance Insights Dashboard</div>
              <div className="text-gray-400 text-sm">Monitor and identify database bottlenecks</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="text-purple-300 font-semibold mb-1">DB Load (AAS)</div>
                <div className="text-2xl text-white">4.2</div>
                <div className="text-xs text-gray-400">Active Sessions</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="text-blue-300 font-semibold mb-1">Wait Events</div>
                <div className="text-2xl text-white">5</div>
                <div className="text-xs text-gray-400">Categories</div>
              </div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="text-green-300 font-semibold mb-1">Top SQL</div>
                <div className="text-2xl text-white">12</div>
                <div className="text-xs text-gray-400">Queries tracked</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-sm text-gray-400 mb-2">Average Active Sessions (AAS) - DB Load</div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-end gap-2 h-32">
                {[3.2, 4.1, 2.8, 5.2, 4.5, 3.9, 6.1, 4.3].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div className={`rounded-t ${val > 5 ? "bg-red-500" : val > 4 ? "bg-yellow-500" : "bg-green-500"}`} style={{ height: `${(val / 7) * 100}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>12:00</span>
                <span>12:30</span>
                <span>13:00</span>
              </div>
            </div>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3">
              <div className="text-purple-300 text-sm">Current DB Load: <span className="font-semibold">4.2 AAS</span></div>
              <div className="text-gray-400 text-xs mt-1">Average Active Sessions indicates database load at any given time</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
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
        )}
        {step === 3 && (
          <div>
            <div className="text-sm text-gray-400 mb-3">Top SQL Statements by Load</div>
            <div className="space-y-2">
              {[
                { query: "SELECT * FROM orders WHERE...", load: 28, time: "1.2s" },
                { query: "UPDATE users SET last_login...", load: 22, time: "0.8s" },
                { query: "INSERT INTO logs VALUES...", load: 18, time: "0.5s" },
                { query: "SELECT COUNT(*) FROM products...", load: 15, time: "2.1s" },
                { query: "DELETE FROM cache WHERE...", load: 12, time: "0.3s" }
              ].map((sql, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm font-mono flex-1">{sql.query}</div>
                    <div className="text-xs text-gray-400 ml-2">{sql.time}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div className={`h-2 rounded-full ${i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : "bg-yellow-500"}`} style={{ width: `${sql.load}%` }} />
                    </div>
                    <div className="text-xs text-white w-12 text-right">{sql.load}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="text-center">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6">
                <div className="text-green-300 font-semibold mb-2 text-lg">Free Tier</div>
                <div className="text-4xl text-white mb-2">7</div>
                <div className="text-gray-400 text-sm">Days Retention</div>
                <div className="text-green-400 text-xs mt-2">No additional cost</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6">
                <div className="text-blue-300 font-semibold mb-2 text-lg">Paid</div>
                <div className="text-4xl text-white mb-2">2</div>
                <div className="text-gray-400 text-sm">Years Retention</div>
                <div className="text-blue-400 text-xs mt-2">Long-term analysis</div>
              </div>
            </div>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3">
              <div className="text-purple-300 text-sm">Free tier provides 7 days of performance history for troubleshooting</div>
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

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-blue-400">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">Production DB</div>
              <div className="text-xs text-gray-400">100GB Database</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-teal-400 text-sm mb-1">Clone</div>
              <div className="text-2xl">→</div>
              <div className="text-teal-400 text-xs">Fast &amp; Efficient</div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-teal-600 rounded-lg flex items-center justify-center mb-2 mx-auto border-4 border-teal-400">
                <Database className="w-12 h-12 text-white" />
              </div>
              <div className="text-white font-semibold">Clone DB</div>
              <div className="text-xs text-gray-400">Testing/Development</div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Copy-on-Write Technology</div>
              <div className="text-gray-400 text-sm">Clone shares storage initially, copies only when data diverges</div>
            </div>
            <div className="flex items-start justify-around">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="text-white text-sm font-semibold mb-1">Shared Storage</div>
                <div className="text-xs text-gray-400">100GB</div>
                <div className="mt-2 text-xs text-green-400">Original pages</div>
              </div>
              <div className="flex flex-col items-center pt-6">
                <div className="text-2xl">↙ ↘</div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs">Production</div>
                  <div className="text-xs text-blue-400 mt-1">+2GB new</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs">Clone</div>
                  <div className="text-xs text-teal-400 mt-1">+3GB new</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-teal-900/30 border border-teal-500 rounded-lg p-3 text-center">
              <div className="text-teal-300 text-sm">Only modified pages are copied - significant storage savings!</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white font-semibold">Production DB</div>
                <div className="text-xs text-gray-400">100GB</div>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="text-teal-400 text-sm mb-1">Clone Operation</div>
                <div className="text-2xl animate-pulse">⚡</div>
                <div className="text-teal-400 text-xs font-semibold">~2 minutes</div>
              </div>
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-teal-600 rounded-lg flex items-center justify-center mb-2 mx-auto animate-pulse">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white font-semibold">Clone Ready!</div>
                <div className="text-xs text-gray-400">100GB (shared)</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-red-400 text-sm mb-1">Traditional Copy</div>
                <div className="text-2xl text-white">2-4 hrs</div>
                <div className="text-xs text-gray-400">100GB DB</div>
              </div>
              <div className="text-2xl text-center pt-3">vs</div>
              <div className="bg-teal-900/30 border-2 border-teal-500 rounded-lg p-3 text-center">
                <div className="text-teal-400 text-sm mb-1">Aurora Clone</div>
                <div className="text-2xl text-white">~2 min</div>
                <div className="text-xs text-gray-400">Any size!</div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Storage Cost Comparison</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="text-red-300 font-semibold mb-2">Traditional Snapshot</div>
                <div className="text-3xl text-white mb-1">$200</div>
                <div className="text-xs text-gray-400 mb-3">Full 100GB copy immediately</div>
                <div className="text-xs text-red-400">100% storage cost from day 1</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="text-green-300 font-semibold mb-2">Aurora Clone</div>
                <div className="text-3xl text-white mb-1">$10</div>
                <div className="text-xs text-gray-400 mb-3">Only 5GB diverged after 1 week</div>
                <div className="text-xs text-green-400">Pay only for changed data</div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
              <div className="text-green-300 text-sm">Cost scales with data divergence, not total database size</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Common Use Cases for Aurora Cloning</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🧪</span>
                  <div className="text-purple-300 font-semibold">Testing</div>
                </div>
                <div className="text-gray-400 text-xs">Test code changes against production data without risk</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👨‍💻</span>
                  <div className="text-blue-300 font-semibold">Development</div>
                </div>
                <div className="text-gray-400 text-xs">Dev environments with real production data</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <div className="text-yellow-300 font-semibold">Analytics</div>
                </div>
                <div className="text-gray-400 text-xs">Run heavy queries without impacting production</div>
              </div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔄</span>
                  <div className="text-green-300 font-semibold">Schema Changes</div>
                </div>
                <div className="text-gray-400 text-xs">Test migrations safely before production</div>
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
        {step === 0 && (
          <div className="text-center">
            <div className="mb-4">
              <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
              <div className="text-white text-lg font-semibold mb-2">RDS Maintenance Windows</div>
              <div className="text-gray-400 text-sm">Scheduled time for patches, upgrades, and modifications</div>
            </div>
            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-6 mb-4">
              <div className="text-yellow-300 font-semibold mb-2 text-lg">Maintenance Window</div>
              <div className="text-3xl text-white mb-2 font-mono">Sun 03:00-03:30 UTC</div>
              <div className="text-gray-400 text-sm">30-minute window during off-peak hours</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-red-400 text-sm mb-1">Required Updates</div>
                <div className="text-white text-xs">Must be applied</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 text-sm mb-1">Optional Updates</div>
                <div className="text-white text-xs">Can be deferred</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">30-Minute Maintenance Window</div>
              <div className="text-gray-400 text-sm">Default window during off-peak hours for your region</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Day:</span>
                <span className="text-yellow-400 font-semibold">Sunday</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Time:</span>
                <span className="text-yellow-400 font-semibold font-mono">03:00 - 03:30 UTC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-yellow-400 font-semibold">30 minutes</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex gap-4 h-8">
                <div className="flex-1 bg-green-600 rounded flex items-center justify-center text-white text-xs">Normal Operation</div>
                <div className="w-16 bg-yellow-600 rounded flex items-center justify-center text-white text-xs">Maint</div>
                <div className="flex-1 bg-green-600 rounded flex items-center justify-center text-white text-xs">Normal Operation</div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Multi-AZ Maintenance Sequence</div>
              <div className="text-gray-400 text-sm">Minimal downtime with automated failover</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">1</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Upgrade Standby</div>
                  <div className="text-gray-400 text-xs">Standby instance upgraded first (no impact)</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">2</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Failover to Standby</div>
                  <div className="text-gray-400 text-xs">Automatic failover promotes standby to primary</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">3</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Upgrade Old Primary</div>
                  <div className="text-gray-400 text-xs">Old primary upgraded and becomes new standby</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
              <div className="text-green-300 text-sm">Brief downtime only during failover (~60-120 seconds)</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-sm text-gray-400 mb-3">Maintenance Types &amp; Deferral Options</div>
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
            <div className="mt-4 bg-red-900/30 border border-red-500 rounded-lg p-3">
              <div className="text-red-300 text-sm font-semibold mb-1">Important:</div>
              <div className="text-gray-300 text-xs">Required maintenance has deadlines and cannot be deferred indefinitely</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Customize Maintenance Window</div>
              <div className="text-gray-400 text-sm">Align with your low-traffic periods</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">Default Window</div>
                <div className="text-white font-mono">Sun 03:00-03:30 UTC</div>
                <div className="text-yellow-400 text-xs mt-1">AWS recommended</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="text-blue-300 text-sm mb-2">Custom Window</div>
                <div className="text-white font-mono">Tue 22:00-22:30 UTC</div>
                <div className="text-green-400 text-xs mt-1">Your low-traffic period</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-white text-sm mb-2">Window Options:</div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>• Choose day of week (Mon-Sun)</div>
                <div>• Select start time (any hour)</div>
                <div>• Minimum 30-minute window</div>
                <div>• Must be in UTC timezone</div>
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

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center">
            <div className="mb-4">
              <Database className="w-16 h-16 text-indigo-400 mx-auto mb-3" />
              <div className="text-white text-lg font-semibold mb-2">Storage Auto Scaling</div>
              <div className="text-gray-400 text-sm">Automatically increase storage when running low</div>
            </div>
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-3xl">💾</span>
                </div>
                <div className="text-white font-semibold">100GB</div>
                <div className="text-xs text-gray-400">Initial Storage</div>
              </div>
              <div className="text-2xl text-indigo-400 animate-pulse">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-3xl">📈</span>
                </div>
                <div className="text-white font-semibold">Auto Scales</div>
                <div className="text-xs text-gray-400">As needed</div>
              </div>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-500 rounded-lg p-3">
              <div className="text-indigo-300 text-sm">No downtime during storage scaling operations</div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Auto Scaling Trigger Conditions</div>
              <div className="text-gray-400 text-sm">When does RDS auto scale storage?</div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">Free Storage</div>
                  <div className="text-red-400 font-mono">&lt;10%</div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div className="bg-red-500 h-4 rounded-full" style={{ width: "8%" }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">Condition 1: Less than 10% free space</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">Duration</div>
                  <div className="text-yellow-400 font-mono">5+ min</div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((min) => (
                    <div key={min} className="flex-1 bg-yellow-500 rounded h-8 flex items-center justify-center text-white text-xs">{min}</div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">Condition 2: Low space lasts 5+ minutes</div>
              </div>
            </div>
            <div className="mt-4 bg-indigo-900/30 border border-indigo-500 rounded-lg p-3 text-center">
              <div className="text-indigo-300 text-sm">Both conditions must be met to trigger auto scaling</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Scaling Increment Calculation</div>
              <div className="text-gray-400 text-sm">RDS scales by the greater of these three values:</div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">Option 1: Fixed Amount</div>
                  <div className="text-green-400 font-semibold text-xl">5GB</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">Option 2: Percentage</div>
                  <div className="text-blue-400 font-semibold text-xl">10%</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">10% of current allocated storage</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">Option 3: Predicted Growth</div>
                  <div className="text-purple-400 font-semibold text-xl">~7GB</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">Based on usage patterns</div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
              <div className="text-green-300 font-semibold text-lg mb-1">Result: Scale by 10GB</div>
              <div className="text-gray-300 text-xs">Whichever value is greatest</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Maximum Storage Threshold</div>
              <div className="text-gray-400 text-sm">Set limits to prevent runaway scaling costs</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 mb-4">
              <div className="flex items-end justify-center gap-4 mb-4">
                <div>
                  <div className="w-16 bg-gray-600 rounded-t-lg relative" style={{ height: "100px" }}>
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg" style={{ height: "60%" }} />
                  </div>
                  <div className="text-center text-white text-xs mt-1">Current</div>
                  <div className="text-center text-gray-400 text-xs">200GB</div>
                </div>
                <div>
                  <div className="w-16 bg-gray-600 rounded-t-lg relative" style={{ height: "100px" }}>
                    <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg" style={{ height: "100%" }} />
                    <div className="absolute top-0 left-0 right-0 border-t-2 border-red-500" />
                    <div className="absolute -top-5 left-0 right-0 text-center text-red-400 text-xs">Max: 500GB</div>
                  </div>
                  <div className="text-center text-white text-xs mt-1">Can Scale To</div>
                  <div className="text-center text-gray-400 text-xs">500GB max</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
                <div className="text-green-300 text-sm font-semibold mb-1">With Max Set</div>
                <div className="text-gray-300 text-xs">Controlled costs, prevents runaway scaling</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
                <div className="text-red-300 text-sm font-semibold mb-1">Without Max</div>
                <div className="text-gray-300 text-xs">Could scale to 64TB (expensive!)</div>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Zero Downtime Scaling</div>
              <div className="text-gray-400 text-sm">Storage scaling happens online without interruption</div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">✓</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">No Downtime</div>
                  <div className="text-gray-400 text-xs">Application stays online during scaling</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">✓</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Automatic</div>
                  <div className="text-gray-400 text-xs">No manual intervention required</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">✓</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">Performance</div>
                  <div className="text-gray-400 text-xs">No performance impact during scaling</div>
                </div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
              <div className="text-green-300 text-sm">Storage scaling is transparent to your application</div>
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

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            <div className="text-center mb-4">
              <Server className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
              <div className="text-white text-lg font-semibold mb-2">Aurora Endpoints</div>
              <div className="text-gray-400 text-sm">Different endpoints for different access patterns</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="text-green-300 font-semibold">Cluster Endpoint</div>
                </div>
                <div className="text-gray-400 text-xs">Points to writer instance</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="text-blue-300 font-semibold">Reader Endpoint</div>
                </div>
                <div className="text-gray-400 text-xs">Load balances reads</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="text-yellow-300 font-semibold">Instance Endpoint</div>
                </div>
                <div className="text-gray-400 text-xs">Direct to instance</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <div className="text-purple-300 font-semibold">Custom Endpoint</div>
                </div>
                <div className="text-gray-400 text-xs">Group instances</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Cluster Endpoint (Writer)</div>
              <div className="text-gray-400 text-sm">Always points to the current writer instance</div>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-2xl">🔗</span>
                </div>
                <div className="text-white font-semibold">Cluster Endpoint</div>
                <div className="text-xs text-gray-400 font-mono">mydb.cluster-xxx.rds.amazonaws.com</div>
              </div>
              <div className="text-2xl text-green-400">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 border-4 border-green-400">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white font-semibold">Writer Instance</div>
                <div className="text-xs text-green-400">Read/Write</div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/30 border border-green-500 rounded-lg p-3">
              <div className="text-green-300 text-sm font-semibold mb-1">Use for:</div>
              <div className="text-gray-300 text-xs">All write operations and transactions</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Reader Endpoint</div>
              <div className="text-gray-400 text-sm">Load balances across all read replicas</div>
            </div>
            <div className="flex items-start justify-center gap-6">
              <div className="text-center pt-8">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-2xl">🔗</span>
                </div>
                <div className="text-white font-semibold">Reader Endpoint</div>
                <div className="text-xs text-gray-400 font-mono">mydb.cluster-ro-xxx.rds.amazonaws.com</div>
              </div>
              <div className="flex flex-col items-center pt-8">
                <div className="text-2xl text-blue-400">→</div>
                <div className="text-xs text-blue-400 mt-1">Load Balance</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-1">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs">Read Replica 1</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-1">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs">Read Replica 2</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-1">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs">Read Replica 3</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-blue-900/30 border border-blue-500 rounded-lg p-3">
              <div className="text-blue-300 text-sm font-semibold mb-1">Use for:</div>
              <div className="text-gray-300 text-xs">Read-only queries distributed across replicas</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Instance Endpoints</div>
              <div className="text-gray-400 text-sm">Direct connection to specific instance</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-gray-700 rounded-lg p-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Writer Instance</div>
                  <div className="text-xs text-gray-400 font-mono">mydb-instance-1.xxx.rds.amazonaws.com</div>
                </div>
                <div className="text-xs text-green-400">Direct connect</div>
              </div>
              <div className="flex items-center gap-4 bg-gray-700 rounded-lg p-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Read Replica 1</div>
                  <div className="text-xs text-gray-400 font-mono">mydb-instance-2.xxx.rds.amazonaws.com</div>
                </div>
                <div className="text-xs text-blue-400">Direct connect</div>
              </div>
              <div className="flex items-center gap-4 bg-gray-700 rounded-lg p-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Read Replica 2</div>
                  <div className="text-xs text-gray-400 font-mono">mydb-instance-3.xxx.rds.amazonaws.com</div>
                </div>
                <div className="text-xs text-blue-400">Direct connect</div>
              </div>
            </div>
            <div className="mt-4 bg-yellow-900/30 border border-yellow-500 rounded-lg p-3">
              <div className="text-yellow-300 text-sm font-semibold mb-1">Use for:</div>
              <div className="text-gray-300 text-xs">Troubleshooting or testing specific instances</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Custom Endpoints</div>
              <div className="text-gray-400 text-sm">Group specific instances for specialized workloads</div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-purple-300 font-semibold">Analytics Endpoint</div>
                  <div className="text-xs text-purple-400 font-mono">mydb-analytics.xxx.rds.amazonaws.com</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-purple-900/30 border border-purple-500 rounded p-2 text-center">
                    <Database className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <div className="text-white text-xs">Replica 1</div>
                    <div className="text-xs text-purple-400">r5.2xlarge</div>
                  </div>
                  <div className="flex-1 bg-purple-900/30 border border-purple-500 rounded p-2 text-center">
                    <Database className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <div className="text-white text-xs">Replica 2</div>
                    <div className="text-xs text-purple-400">r5.2xlarge</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">Large instances for heavy analytical queries</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-cyan-300 font-semibold">Reporting Endpoint</div>
                  <div className="text-xs text-cyan-400 font-mono">mydb-reports.xxx.rds.amazonaws.com</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-cyan-900/30 border border-cyan-500 rounded p-2 text-center">
                    <Database className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                    <div className="text-white text-xs">Replica 3</div>
                    <div className="text-xs text-cyan-400">r5.large</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">Dedicated instance for daily reports</div>
              </div>
            </div>
            <div className="mt-4 bg-purple-900/30 border border-purple-500 rounded-lg p-3">
              <div className="text-purple-300 text-sm font-semibold mb-1">Use for:</div>
              <div className="text-gray-300 text-xs">Isolating workloads on specific instance types or sizes</div>
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
        {step === 0 && (
          <div className="text-center">
            <div className="mb-4">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-3" />
              <div className="text-white text-lg font-semibold mb-2">IAM Database Authentication</div>
              <div className="text-gray-400 text-sm">Use IAM credentials instead of database passwords</div>
            </div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center mb-2 relative">
                  <span className="text-2xl">🔑</span>
                  <div className="absolute -top-2 -right-2 text-2xl">❌</div>
                </div>
                <div className="text-white text-sm">Database Password</div>
                <div className="text-xs text-red-400">Traditional approach</div>
              </div>
              <div className="text-2xl text-gray-400">vs</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2 relative">
                  <span className="text-2xl">🎫</span>
                  <div className="absolute -top-2 -right-2 text-2xl">✓</div>
                </div>
                <div className="text-white text-sm">IAM Token</div>
                <div className="text-xs text-green-400">IAM-based auth</div>
              </div>
            </div>
            <div className="bg-amber-900/30 border border-amber-500 rounded-lg p-3">
              <div className="text-amber-300 text-sm">No database passwords to manage or rotate</div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Token-Based Authentication</div>
              <div className="text-gray-400 text-sm">Generate temporary authentication tokens</div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="text-white text-sm">IAM User/Role</div>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="text-xs text-gray-400">Generate Token</div>
                <div className="text-xl">→</div>
              </div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2 mx-auto animate-pulse">
                  <span className="text-2xl">🎫</span>
                </div>
                <div className="text-white text-sm">Auth Token</div>
                <div className="text-xs text-yellow-400 font-semibold">Valid 15 min</div>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="text-xs text-gray-400">Connect</div>
                <div className="text-xl">→</div>
              </div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-sm">RDS/Aurora</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs text-green-400 mb-3">
              aws rds generate-db-auth-token --hostname mydb.xxx.rds.amazonaws.com --port 3306 --username myuser
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3">
              <div className="text-yellow-300 text-sm font-semibold mb-1">Token Expiration:</div>
              <div className="text-gray-300 text-xs">Tokens expire after 15 minutes for security. Generate a new token for each connection.</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">SSL/TLS Required</div>
              <div className="text-gray-400 text-sm">Connections must use SSL/TLS encryption</div>
            </div>
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">💻</span>
                </div>
                <div className="text-white text-sm">Client Application</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-green-400 font-semibold mb-1">SSL/TLS</div>
                <div className="text-3xl animate-pulse">🔒</div>
                <div className="text-green-400 text-xs mt-1">Encrypted Connection</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-white text-sm">RDS/Aurora</div>
              </div>
            </div>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 mb-3">
              <div className="text-red-300 font-semibold mb-1 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>SSL Required!</span>
              </div>
              <div className="text-gray-300 text-xs">IAM database authentication will NOT work without SSL/TLS encryption</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-white text-sm mb-2">SSL Configuration:</div>
              <div className="text-gray-400 text-xs font-mono">mysql -h mydb.xxx.rds.amazonaws.com --ssl-ca=rds-ca.pem --enable-cleartext-plugin</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">Supported Database Engines</div>
              <div className="text-gray-400 text-sm">IAM authentication availability</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🐬</div>
                <div className="text-green-300 font-semibold mb-1">MySQL</div>
                <div className="text-xs text-gray-400">5.6.34+ / 5.7.16+</div>
                <div className="text-xs text-green-400 mt-1">✓ Supported</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🐘</div>
                <div className="text-green-300 font-semibold mb-1">PostgreSQL</div>
                <div className="text-xs text-gray-400">9.5.2+</div>
                <div className="text-xs text-green-400 mt-1">✓ Supported</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🦭</div>
                <div className="text-green-300 font-semibold mb-1">MariaDB</div>
                <div className="text-xs text-gray-400">10.6+</div>
                <div className="text-xs text-green-400 mt-1">✓ Supported</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                <div className="text-blue-300 text-sm font-semibold mb-1">RDS</div>
                <div className="text-gray-300 text-xs">All supported engines</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3">
                <div className="text-purple-300 text-sm font-semibold mb-1">Aurora</div>
                <div className="text-gray-300 text-xs">MySQL &amp; PostgreSQL compatible</div>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4">
              <div className="text-white font-semibold mb-2">IAM Policy Configuration</div>
              <div className="text-gray-400 text-sm">Grant rds-db:connect permission</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-white text-sm mb-2">IAM Policy Example:</div>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "rds-db:connect",
    "Resource": "arn:aws:rds-db:us-east-1:123456789012:dbuser:db-ABC123/mydbuser"
  }]
}`}
              </pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">1</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm font-semibold mb-1">Create IAM Policy</div>
                  <div className="text-gray-400 text-xs">Grant rds-db:connect permission</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">2</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm font-semibold mb-1">Attach to IAM User/Role</div>
                  <div className="text-gray-400 text-xs">Associate policy with identity</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">3</div>
                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                  <div className="text-white text-sm font-semibold mb-1">Enable on Database User</div>
                  <div className="text-gray-400 text-xs">Database user must exist with IAM auth enabled</div>
                </div>
              </div>
            </div>
          </div>
        )}
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
