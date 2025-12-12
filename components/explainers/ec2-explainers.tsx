"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// EC2 INSTANCE TYPES EXPLAINER (Medium)
// ============================================================================
export function EC2InstanceTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedFamily, setSelectedFamily] = useState("m")

  const steps = [
    { title: "Instance Type Naming", description: "Format: family + generation + size. Example: m5.xlarge = M family, 5th gen, xlarge size." },
    { title: "Instance Families", description: "General (M/T), Compute (C), Memory (R/X), Storage (I/D), Accelerated (P/G)." },
    { title: "Choosing Type", description: "Match instance to workload. Web servers: M/T. Analytics: R. ML: P/G. Batch: C." },
    { title: "Sizes", description: "nano → micro → small → medium → large → xlarge → 2xlarge... 24xlarge. Double resources each size." }
  ]

  const families = {
    m: { name: "General Purpose (M)", desc: "Balanced compute, memory, networking", use: "Web servers, dev environments" },
    t: { name: "Burstable (T)", desc: "Baseline + burst CPU credits", use: "Variable workloads, dev/test" },
    c: { name: "Compute Optimized (C)", desc: "High CPU to memory ratio", use: "Batch processing, gaming" },
    r: { name: "Memory Optimized (R)", desc: "High memory to CPU ratio", use: "In-memory databases, caches" },
    p: { name: "Accelerated (P/G)", desc: "GPU instances", use: "ML training, graphics" },
    i: { name: "Storage Optimized (I)", desc: "High sequential I/O", use: "Data warehousing, Hadoop" }
  }

  const selected = families[selectedFamily as keyof typeof families]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Instance Types</h1>
        <p className="text-slate-400">Understanding instance families and sizing</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.keys(families).map((f) => (
            <button key={f} onClick={() => setSelectedFamily(f)} className={`px-3 py-1 rounded ${selectedFamily === f ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-white">{selected.name}</div>
            <div className="text-sm text-slate-400">{selected.desc}</div>
            <div className="text-xs text-green-400 mt-1">Use case: {selected.use}</div>
          </div>

          {/* Instance type breakdown */}
          <div className="flex justify-center items-center gap-2 p-4 bg-slate-800 rounded">
            <div className="text-center">
              <div className="text-2xl font-mono text-blue-400">{selectedFamily}</div>
              <div className="text-xs text-slate-500">Family</div>
            </div>
            <div className="text-2xl text-slate-600">.</div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">5</div>
              <div className="text-xs text-slate-500">Generation</div>
            </div>
            <div className="text-2xl text-slate-600">.</div>
            <div className="text-center">
              <div className="text-2xl font-mono text-orange-400">xlarge</div>
              <div className="text-xs text-slate-500">Size</div>
            </div>
          </div>

          {/* Size progression */}
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            {["nano", "micro", "small", "medium", "large", "xlarge", "2xl", "4xl"].map((size, i) => (
              <div key={size} className="bg-slate-700 rounded px-2 py-1 text-xs" style={{ opacity: 0.5 + (i * 0.07) }}>
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>T instances use CPU credits - burst above baseline</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>C instances for CPU-intensive, R for memory-intensive</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Higher generation = better price/performance</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Graviton (suffix g) = ARM-based, better value</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 PRICING MODELS EXPLAINER (Rich)
// ============================================================================
export function EC2PricingModelsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pricingModel, setPricingModel] = useState("ondemand")

  const steps = [
    { title: "Pricing Options", description: "On-Demand, Reserved, Savings Plans, Spot, and Dedicated. Each fits different use cases." },
    { title: "On-Demand", description: "Pay by the second/hour. No commitment. Most flexible, highest cost." },
    { title: "Reserved Instances", description: "1 or 3 year commitment. Up to 72% discount. Standard or Convertible." },
    { title: "Spot Instances", description: "Bid on unused capacity. Up to 90% discount. Can be interrupted with 2-min warning." }
  ]

  const models = {
    ondemand: { name: "On-Demand", discount: "0%", commitment: "None", interruption: "No", best: "Short-term, unpredictable" },
    reserved: { name: "Reserved", discount: "Up to 72%", commitment: "1-3 years", interruption: "No", best: "Steady-state workloads" },
    savings: { name: "Savings Plans", discount: "Up to 72%", commitment: "1-3 years", interruption: "No", best: "Flexible compute" },
    spot: { name: "Spot", discount: "Up to 90%", commitment: "None", interruption: "Yes (2 min)", best: "Fault-tolerant, flexible" },
    dedicated: { name: "Dedicated Host", discount: "Varies", commitment: "Optional", interruption: "No", best: "Compliance, licensing" }
  }

  const selected = models[pricingModel as keyof typeof models]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Pricing Models</h1>
        <p className="text-slate-400">Optimizing costs for different workloads</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.keys(models).map((m) => (
            <button key={m} onClick={() => setPricingModel(m)} className={`px-3 py-1 rounded text-xs ${pricingModel === m ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>
              {models[m as keyof typeof models].name}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-white">{selected.name}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Discount</div>
              <div className="text-lg font-mono text-green-400">{selected.discount}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Commitment</div>
              <div className="text-sm text-blue-400">{selected.commitment}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Interruption</div>
              <div className={`text-sm ${selected.interruption === "No" ? "text-green-400" : "text-yellow-400"}`}>{selected.interruption}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Best For</div>
              <div className="text-xs text-purple-400">{selected.best}</div>
            </div>
          </div>

          {/* Cost comparison */}
          <div className="mt-4">
            <div className="text-xs text-slate-400 mb-2">Relative Cost (On-Demand = 100%)</div>
            <div className="space-y-1">
              {Object.entries(models).map(([key, model]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24">{model.name}</span>
                  <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
                    <div className={`h-full ${key === pricingModel ? "bg-green-500" : "bg-slate-600"}`}
                      style={{ width: key === "spot" ? "10%" : key === "reserved" || key === "savings" ? "28%" : key === "dedicated" ? "100%" : "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Spot: cheapest, 2-min interruption notice, use for fault-tolerant</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Reserved: 1-3yr commitment, Standard (most discount) or Convertible</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Savings Plans: more flexible than RIs, $/hour commitment</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Dedicated Hosts: for licensing or compliance requirements</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 PLACEMENT GROUPS EXPLAINER (Medium)
// ============================================================================
export function EC2PlacementGroupsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [groupType, setGroupType] = useState<"cluster" | "spread" | "partition">("cluster")

  const steps = [
    { title: "What are Placement Groups?", description: "Control how instances are placed on underlying hardware. Optimize for performance or availability." },
    { title: "Cluster", description: "Pack instances close together in single AZ. Lowest latency, highest throughput. Risk: single point of failure." },
    { title: "Spread", description: "Each instance on different hardware. Max 7 per AZ. Highest availability for small deployments." },
    { title: "Partition", description: "Instances grouped into partitions on separate racks. Up to 7 partitions per AZ. Good for Hadoop, Kafka." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Placement Groups</h1>
        <p className="text-slate-400">Controlling instance placement strategy</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setGroupType("cluster")} className={`px-4 py-2 rounded-lg ${groupType === "cluster" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Cluster</button>
          <button onClick={() => setGroupType("spread")} className={`px-4 py-2 rounded-lg ${groupType === "spread" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Spread</button>
          <button onClick={() => setGroupType("partition")} className={`px-4 py-2 rounded-lg ${groupType === "partition" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>Partition</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {groupType === "cluster" && (
            <div className="text-center">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 inline-block">
                <div className="text-xs text-red-400 mb-2">Single Rack</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">{i}</div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2">All instances packed together - low latency</div>
            </div>
          )}
          {groupType === "spread" && (
            <div className="flex justify-center gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-400 mb-1">Rack {i}</div>
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs mx-auto">{i}</div>
                </div>
              ))}
              <div className="text-xs text-slate-400 self-center">Max 7 per AZ</div>
            </div>
          )}
          {groupType === "partition" && (
            <div className="flex justify-center gap-4">
              {[1,2,3].map(p => (
                <div key={p} className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-purple-400 mb-1">Partition {p}</div>
                  <div className="flex flex-col gap-1">
                    {[1,2].map(i => (
                      <div key={i} className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">{p}.{i}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div className={`p-2 rounded ${groupType === "cluster" ? "bg-red-500/20" : "bg-slate-800"}`}>
              <div className="text-slate-400">Latency</div>
              <div className="text-red-400">Lowest</div>
            </div>
            <div className={`p-2 rounded ${groupType === "spread" ? "bg-green-500/20" : "bg-slate-800"}`}>
              <div className="text-slate-400">Availability</div>
              <div className="text-green-400">Highest</div>
            </div>
            <div className={`p-2 rounded ${groupType === "partition" ? "bg-purple-500/20" : "bg-slate-800"}`}>
              <div className="text-slate-400">Scale + Isolation</div>
              <div className="text-purple-400">Balanced</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cluster: lowest latency, HPC/big data, single AZ only</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Spread: max 7 instances per AZ, critical applications</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Partition: 7 partitions per AZ, Hadoop/Kafka/Cassandra</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cluster requires same instance type for best results</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// INSTANCE STORE VS EBS EXPLAINER (Medium)
// ============================================================================
export function EC2InstanceStoreVsEBSExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [storageType, setStorageType] = useState<"ebs" | "instance">("ebs")

  const steps = [
    { title: "Storage Options", description: "EBS: persistent network-attached storage. Instance Store: ephemeral local disks on host." },
    { title: "EBS Volumes", description: "Persist independently. Can detach/reattach. Snapshots for backup. Network latency." },
    { title: "Instance Store", description: "Physically attached to host. Highest I/O performance. DATA LOST on stop/terminate." },
    { title: "When to Use", description: "EBS: databases, boot volumes, persistent data. Instance Store: cache, temp files, buffers." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Instance Store vs EBS</h1>
        <p className="text-slate-400">Choosing the right storage type</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setStorageType("ebs")} className={`px-4 py-2 rounded-lg ${storageType === "ebs" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>EBS</button>
          <button onClick={() => setStorageType("instance")} className={`px-4 py-2 rounded-lg ${storageType === "instance" ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}>Instance Store</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            {/* EC2 Instance */}
            <div className="bg-blue-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">🖥️</div>
              <div className="text-sm">EC2</div>
            </div>

            {/* Connection */}
            <div className="text-slate-400">
              {storageType === "ebs" ? "~~ Network ~~" : "Direct"}
            </div>

            {/* Storage */}
            <div className={`rounded-lg p-4 text-white text-center ${storageType === "ebs" ? "bg-blue-600" : "bg-orange-500"}`}>
              <div className="text-2xl">💾</div>
              <div className="text-sm">{storageType === "ebs" ? "EBS Volume" : "Instance Store"}</div>
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${storageType === "ebs" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-blue-400">EBS</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>✓ Persistent (survives stop)</li>
                <li>✓ Detachable/reattachable</li>
                <li>✓ Snapshots to S3</li>
                <li>✗ Network latency</li>
              </ul>
            </div>
            <div className={`p-3 rounded ${storageType === "instance" ? "bg-orange-500/20 border border-orange-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-orange-400">Instance Store</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>✓ Highest IOPS</li>
                <li>✓ Lowest latency</li>
                <li>✓ Included in price</li>
                <li>✗ EPHEMERAL - data lost!</li>
              </ul>
            </div>
          </div>

          {storageType === "instance" && (
            <div className="mt-4 p-2 bg-red-500/20 border border-red-500 rounded text-center text-xs text-red-400">
              ⚠️ Data lost on: Stop, Terminate, Hardware failure
            </div>
          )}
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Instance Store data is LOST on stop/terminate - ephemeral only</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>EBS survives stop, can snapshot, resize some types</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Instance Store: best for cache, temp data, high-performance buffers</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Not all instance types have instance store</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 AUTO SCALING EXPLAINER (Rich)
// ============================================================================
export function EC2AutoScalingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [load, setLoad] = useState(50)

  const steps = [
    { title: "What is Auto Scaling?", description: "Automatically adjust EC2 capacity based on demand. Scale out (add) or scale in (remove) instances." },
    { title: "Auto Scaling Group", description: "Define min, max, desired capacity. Launch template specifies instance config." },
    { title: "Scaling Policies", description: "Target Tracking: maintain metric. Step: scale by amounts. Scheduled: time-based." },
    { title: "Health Checks", description: "EC2 status checks and/or ELB health checks. Unhealthy instances replaced automatically." }
  ]

  const minCapacity = 2
  const maxCapacity = 10
  const targetCPU = 70
  const currentInstances = Math.min(maxCapacity, Math.max(minCapacity, Math.ceil(load / 20)))

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Auto Scaling</h1>
        <p className="text-slate-400">Dynamic capacity management</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Simulated Load (%)</label>
          <input type="range" min="0" max="100" value={load} onChange={(e) => setLoad(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{load}%</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Instances visualization */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {Array.from({ length: maxCapacity }).map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded flex items-center justify-center text-xs transition-all ${
                  i < currentInstances
                    ? i < minCapacity ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                    : "bg-slate-700 text-slate-500"
                }`}
              >
                {i < currentInstances ? "🖥️" : "○"}
              </div>
            ))}
          </div>

          {/* Capacity info */}
          <div className="flex justify-between text-xs text-slate-400">
            <span>Min: {minCapacity}</span>
            <span className="text-white">Current: {currentInstances}</span>
            <span>Max: {maxCapacity}</span>
          </div>

          {/* CPU Target */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Average CPU</span>
              <span className={load > targetCPU ? "text-red-400" : "text-green-400"}>{load}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded">
              <div className={`h-full rounded ${load > 80 ? "bg-red-500" : load > targetCPU ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${load}%` }} />
            </div>
            <div className="text-xs text-slate-500 mt-1">Target: {targetCPU}%</div>
          </div>

          {/* Scaling action */}
          <div className={`mt-4 p-2 rounded text-center text-xs ${
            load > targetCPU ? "bg-green-500/20 text-green-400" : load < targetCPU - 20 ? "bg-orange-500/20 text-orange-400" : "bg-slate-800 text-slate-400"
          }`}>
            {load > targetCPU ? "↑ Scaling OUT - adding instances" : load < targetCPU - 20 ? "↓ Scaling IN - removing instances" : "Capacity stable"}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Target Tracking: easiest, specify target metric value</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cooldown period prevents rapid scale in/out oscillation</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Launch Templates preferred over Launch Configurations</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can use multiple instance types with mixed instances policy</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 LAUNCH TEMPLATES EXPLAINER (Light)
// ============================================================================
export function EC2LaunchTemplatesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is a Launch Template?", description: "Reusable configuration for launching EC2 instances. AMI, instance type, key pair, security groups, etc." },
    { title: "Versioning", description: "Launch templates are versioned. Update configs without breaking existing references." },
    { title: "vs Launch Configuration", description: "Templates are newer and more flexible. Support multiple instance types, versioning, tagging." },
    { title: "Use Cases", description: "Auto Scaling groups, EC2 Fleet, Spot Fleet. Define once, use everywhere." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Launch Templates</h1>
        <p className="text-slate-400">Reusable instance configurations</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Launch Template Configuration</div>
          <div className="bg-slate-800 rounded p-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">AMI:</span>
              <span className="text-green-400">ami-0abcdef1234567890</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Instance Type:</span>
              <span className="text-blue-400">m5.large</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Key Pair:</span>
              <span className="text-purple-400">my-key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Groups:</span>
              <span className="text-orange-400">sg-web, sg-ssh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">User Data:</span>
              <span className="text-yellow-400">#!/bin/bash...</span>
            </div>
          </div>

          {/* Versioning */}
          <div className="mt-4 flex gap-2">
            <div className="bg-slate-700 rounded px-3 py-1 text-xs text-slate-400">v1</div>
            <div className="bg-slate-700 rounded px-3 py-1 text-xs text-slate-400">v2</div>
            <div className="bg-blue-500 rounded px-3 py-1 text-xs text-white">v3 (Default)</div>
          </div>

          {/* Used by */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="bg-green-500 rounded p-2 text-white text-xs">Auto Scaling</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 rounded p-2 text-white text-xs">EC2 Fleet</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 rounded p-2 text-white text-xs">Spot Fleet</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Launch Templates are preferred over Launch Configurations</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Support versioning - update without recreation</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can specify multiple instance types</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Required for EC2 Fleet and Spot Fleet</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const ec2Explainers = {
  "ec2-instance-types": EC2InstanceTypesExplainer,
  "ec2-pricing-models": EC2PricingModelsExplainer,
  "ec2-placement-groups": EC2PlacementGroupsExplainer,
  "ec2-instance-store-ebs": EC2InstanceStoreVsEBSExplainer,
  "ec2-auto-scaling": EC2AutoScalingExplainer,
  "ec2-launch-templates": EC2LaunchTemplatesExplainer,
}
