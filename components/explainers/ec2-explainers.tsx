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
// EBS VOLUME TYPES EXPLAINER (Medium)
// ============================================================================
export function EC2EBSVolumeTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volumeType, setVolumeType] = useState("gp3")

  const steps = [
    { title: "EBS Volume Categories", description: "SSD-backed (gp2/gp3, io1/io2) for random I/O. HDD-backed (st1, sc1) for sequential throughput." },
    { title: "General Purpose SSD", description: "gp3: baseline 3000 IOPS, scale independently. gp2: burst to 3000 IOPS, linked to size." },
    { title: "Provisioned IOPS SSD", description: "io1/io2: guaranteed IOPS up to 64,000. io2 Block Express: up to 256,000 IOPS." },
    { title: "HDD Volumes", description: "st1: throughput optimized (big data). sc1: cold storage (infrequent access). Can't be boot volumes." }
  ]

  const volumes = {
    gp3: { name: "General Purpose SSD (gp3)", iops: "3,000-16,000", throughput: "125-1000 MB/s", size: "1GB-16TB", use: "Most workloads" },
    gp2: { name: "General Purpose SSD (gp2)", iops: "3 IOPS/GB (burst 3,000)", throughput: "Up to 250 MB/s", size: "1GB-16TB", use: "Boot volumes, dev" },
    io2: { name: "Provisioned IOPS (io2)", iops: "Up to 64,000", throughput: "Up to 1000 MB/s", size: "4GB-16TB", use: "Critical databases" },
    st1: { name: "Throughput HDD (st1)", iops: "500 IOPS max", throughput: "Up to 500 MB/s", size: "125GB-16TB", use: "Big data, logs" },
    sc1: { name: "Cold HDD (sc1)", iops: "250 IOPS max", throughput: "Up to 250 MB/s", size: "125GB-16TB", use: "Infrequent access" }
  }

  const selected = volumes[volumeType as keyof typeof volumes]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">EBS Volume Types</h1>
        <p className="text-slate-400">Choosing the right storage performance</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.keys(volumes).map((v) => (
            <button key={v} onClick={() => setVolumeType(v)} className={`px-3 py-1 rounded text-xs ${volumeType === v ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
              {v.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-white">{selected.name}</div>
            <div className="text-xs text-green-400 mt-1">Best for: {selected.use}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">IOPS</div>
              <div className="text-sm text-blue-400">{selected.iops}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Throughput</div>
              <div className="text-sm text-green-400">{selected.throughput}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Size Range</div>
              <div className="text-sm text-purple-400">{selected.size}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Boot Volume</div>
              <div className={`text-sm ${volumeType === "st1" || volumeType === "sc1" ? "text-red-400" : "text-green-400"}`}>
                {volumeType === "st1" || volumeType === "sc1" ? "No" : "Yes"}
              </div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>gp3: IOPS and throughput can be provisioned independently</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>io1/io2: for databases needing &gt;16,000 IOPS</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>st1/sc1: HDD - CANNOT be boot volumes</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Multi-attach only for io1/io2 (up to 16 instances)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EBS SNAPSHOTS EXPLAINER (Medium)
// ============================================================================
export function EC2EBSSnapshotsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What are Snapshots?", description: "Point-in-time backups of EBS volumes stored in S3. Incremental - only changed blocks are saved." },
    { title: "Creating Snapshots", description: "Can snapshot while volume attached. Recommended: detach for consistency or use EBS-optimized instances." },
    { title: "Cross-Region Copy", description: "Copy snapshots across regions for DR. Creates independent snapshot in destination region." },
    { title: "Snapshot Lifecycle", description: "Use Data Lifecycle Manager (DLM) to automate snapshot creation and deletion." }
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
        <h1 className="text-2xl font-bold text-white mb-2">EBS Snapshots</h1>
        <p className="text-slate-400">Backup and restore EBS volumes</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Snapshot flow */}
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">💾</div>
              <div className="text-xs">EBS Volume</div>
              <div className="text-xs text-blue-200">100 GB</div>
            </div>
            <div className="text-slate-400 text-xs">→ Snapshot →</div>
            <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">📸</div>
              <div className="text-xs">Snapshot</div>
              <div className="text-xs text-orange-200">in S3</div>
            </div>
            <div className="text-slate-400 text-xs">→ Restore →</div>
            <div className="bg-green-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">💾</div>
              <div className="text-xs">New Volume</div>
              <div className="text-xs text-green-200">Any AZ/Region</div>
            </div>
          </div>

          {/* Incremental explanation */}
          <div className="bg-slate-800 rounded p-3 mb-4">
            <div className="text-sm font-medium text-purple-400 mb-2">Incremental Snapshots</div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-1">Snap 1 (full)</div>
                <div className="h-4 bg-blue-500 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-1">Snap 2 (changed)</div>
                <div className="h-4 bg-blue-500/30 rounded relative">
                  <div className="absolute right-0 top-0 h-full w-1/3 bg-green-500 rounded-r"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-1">Snap 3 (changed)</div>
                <div className="h-4 bg-blue-500/30 rounded relative">
                  <div className="absolute left-1/4 top-0 h-full w-1/4 bg-green-500"></div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">Only changed blocks stored - cost efficient!</div>
          </div>

          {/* Cross-region */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="bg-slate-700 rounded px-3 py-2">
              <div className="text-slate-400">us-east-1</div>
              <div className="text-orange-400">Snapshot A</div>
            </div>
            <div className="text-slate-400">→ Copy →</div>
            <div className="bg-slate-700 rounded px-3 py-2">
              <div className="text-slate-400">eu-west-1</div>
              <div className="text-green-400">Snapshot A&apos;</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Snapshots are incremental - only changed blocks stored</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can restore to any AZ in same region, or copy cross-region</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use DLM (Data Lifecycle Manager) for automated backups</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Snapshots stored in S3 (managed by AWS)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 AMI EXPLAINER (Medium)
// ============================================================================
export function EC2AMIExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is an AMI?", description: "Amazon Machine Image - template for root volume, launch permissions, and block device mapping." },
    { title: "AMI Sources", description: "AWS provided, Marketplace (vendor), Community (public), or create your own from existing instance." },
    { title: "Creating Custom AMIs", description: "Launch instance, customize, create image. Includes EBS snapshots of attached volumes." },
    { title: "AMI Region Scope", description: "AMIs are region-specific. Copy to other regions for multi-region deployments." }
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
        <h1 className="text-2xl font-bold text-white mb-2">Amazon Machine Images (AMI)</h1>
        <p className="text-slate-400">Templates for launching EC2 instances</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* AMI Components */}
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium text-blue-400 mb-3">AMI Components</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-500/20 rounded p-3 text-center">
                <div className="text-2xl mb-1">💿</div>
                <div className="text-xs text-blue-400">Root Volume</div>
                <div className="text-xs text-slate-400">OS + software</div>
              </div>
              <div className="bg-green-500/20 rounded p-3 text-center">
                <div className="text-2xl mb-1">🔐</div>
                <div className="text-xs text-green-400">Launch Permissions</div>
                <div className="text-xs text-slate-400">Who can use</div>
              </div>
              <div className="bg-purple-500/20 rounded p-3 text-center">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-xs text-purple-400">Block Device Map</div>
                <div className="text-xs text-slate-400">Attached volumes</div>
              </div>
            </div>
          </div>

          {/* AMI Creation Flow */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <div className="bg-blue-500 rounded-lg p-3 text-white">
                <div className="text-xl">🖥️</div>
                <div className="text-xs">EC2 Instance</div>
              </div>
            </div>
            <div className="text-slate-400">→ Create Image →</div>
            <div className="text-center">
              <div className="bg-orange-500 rounded-lg p-3 text-white">
                <div className="text-xl">📀</div>
                <div className="text-xs">Custom AMI</div>
              </div>
            </div>
            <div className="text-slate-400">→ Launch →</div>
            <div className="text-center">
              <div className="bg-green-500 rounded-lg p-3 text-white">
                <div className="text-xl">🖥️🖥️</div>
                <div className="text-xs">New Instances</div>
              </div>
            </div>
          </div>

          {/* AMI Sources */}
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">AWS</div>
              <div className="text-slate-500">Amazon Linux, etc</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-green-400">Marketplace</div>
              <div className="text-slate-500">Vendor software</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-purple-400">Community</div>
              <div className="text-slate-500">Public AMIs</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-orange-400">Custom</div>
              <div className="text-slate-500">Your own</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AMIs are region-specific - copy for multi-region use</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Custom AMIs include EBS snapshots (billed for storage)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Golden AMI pattern: pre-baked for faster boot</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can share AMIs with specific accounts or make public</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 USER DATA EXPLAINER (Light)
// ============================================================================
export function EC2UserDataExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is User Data?", description: "Scripts that run when instance first launches. Used to automate instance configuration." },
    { title: "Script Execution", description: "Runs as root user. Executes only on FIRST boot by default. Base64 encoded." },
    { title: "Common Uses", description: "Install packages, download files, configure services, join domains, register with config tools." },
    { title: "Limitations", description: "16KB max size. Runs once by default. Not for secrets (use Parameter Store/Secrets Manager)." }
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
        <h1 className="text-2xl font-bold text-white mb-2">EC2 User Data</h1>
        <p className="text-slate-400">Bootstrap scripts for instance configuration</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* User Data Example */}
          <div className="bg-slate-800 rounded p-4 font-mono text-xs mb-4">
            <div className="text-green-400 mb-1">#!/bin/bash</div>
            <div className="text-slate-300">yum update -y</div>
            <div className="text-slate-300">yum install -y httpd</div>
            <div className="text-slate-300">systemctl start httpd</div>
            <div className="text-slate-300">systemctl enable httpd</div>
            <div className="text-slate-300">echo &quot;Hello World&quot; &gt; /var/www/html/index.html</div>
          </div>

          {/* Execution flow */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-blue-500 rounded p-3 text-white text-center">
              <div className="text-xl">🚀</div>
              <div className="text-xs">Launch</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-xl">📜</div>
              <div className="text-xs">User Data</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-green-500 rounded p-3 text-white text-center">
              <div className="text-xl">✅</div>
              <div className="text-xs">Configured</div>
            </div>
          </div>

          {/* Key points */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-green-500/20 rounded p-2">
              <div className="text-green-400 mb-1">✓ Can Do</div>
              <div className="text-slate-300">Install packages, configure services, download files</div>
            </div>
            <div className="bg-red-500/20 rounded p-2">
              <div className="text-red-400 mb-1">✗ Avoid</div>
              <div className="text-slate-300">Hardcoded secrets, large scripts (&gt;16KB)</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Runs only on FIRST boot by default</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Executes as root user</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>16KB max size limit</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use Parameter Store for secrets, not user data</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 INSTANCE METADATA EXPLAINER (Medium)
// ============================================================================
export function EC2InstanceMetadataExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [imdsVersion, setImdsVersion] = useState<"v1" | "v2">("v2")

  const steps = [
    { title: "What is Instance Metadata?", description: "Data about instance accessible from within. Query http://169.254.169.254/latest/meta-data/" },
    { title: "Metadata Contents", description: "Instance ID, type, AZ, security groups, IAM role credentials, network info, and more." },
    { title: "IMDSv1 vs IMDSv2", description: "v1: simple GET. v2: requires token (more secure against SSRF). Use v2 in production." },
    { title: "Security", description: "Block IMDS if not needed. Use IMDSv2. Configure hop limit. IAM credentials rotate automatically." }
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
        <h1 className="text-2xl font-bold text-white mb-2">Instance Metadata Service (IMDS)</h1>
        <p className="text-slate-400">Accessing instance information from within</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setImdsVersion("v1")} className={`px-4 py-2 rounded-lg ${imdsVersion === "v1" ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}>IMDSv1</button>
          <button onClick={() => setImdsVersion("v2")} className={`px-4 py-2 rounded-lg ${imdsVersion === "v2" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>IMDSv2</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* IMDS Example */}
          <div className="bg-slate-800 rounded p-4 font-mono text-xs mb-4">
            {imdsVersion === "v1" ? (
              <>
                <div className="text-slate-400"># IMDSv1 - Simple GET (less secure)</div>
                <div className="text-green-400">curl http://169.254.169.254/latest/meta-data/instance-id</div>
              </>
            ) : (
              <>
                <div className="text-slate-400"># IMDSv2 - Token required (more secure)</div>
                <div className="text-green-400">TOKEN=$(curl -X PUT &quot;http://169.254.169.254/latest/api/token&quot; \</div>
                <div className="text-green-400 pl-4">-H &quot;X-aws-ec2-metadata-token-ttl-seconds: 21600&quot;)</div>
                <div className="text-green-400 mt-2">curl http://169.254.169.254/latest/meta-data/instance-id \</div>
                <div className="text-green-400 pl-4">-H &quot;X-aws-ec2-metadata-token: $TOKEN&quot;</div>
              </>
            )}
          </div>

          {/* Available metadata */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-4">
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">instance-id</div>
              <div className="text-slate-400">i-1234567890abcdef0</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">instance-type</div>
              <div className="text-slate-400">m5.large</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">local-ipv4</div>
              <div className="text-slate-400">10.0.1.50</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">security-groups</div>
              <div className="text-slate-400">sg-web</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">iam/</div>
              <div className="text-slate-400">role credentials</div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="text-blue-400">placement/</div>
              <div className="text-slate-400">availability-zone</div>
            </div>
          </div>

          {/* Security comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-2 rounded ${imdsVersion === "v1" ? "bg-orange-500/20 border border-orange-500" : "bg-slate-800"}`}>
              <div className="text-xs text-orange-400 font-medium">IMDSv1</div>
              <div className="text-xs text-slate-300">Simple but vulnerable to SSRF</div>
            </div>
            <div className={`p-2 rounded ${imdsVersion === "v2" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-xs text-green-400 font-medium">IMDSv2</div>
              <div className="text-xs text-slate-300">Token-based, SSRF protected</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>IMDS URL: http://169.254.169.254/latest/meta-data/</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>IMDSv2 recommended - requires session token</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>IAM role credentials available at iam/security-credentials/</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can disable IMDS or require v2 only for security</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 HIBERNATE EXPLAINER (Light)
// ============================================================================
export function EC2HibernateExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [instanceState, setInstanceState] = useState<"running" | "hibernating" | "stopped">("running")

  const steps = [
    { title: "What is Hibernate?", description: "Save RAM contents to EBS root volume before stopping. Resume with same state - faster than cold boot." },
    { title: "Requirements", description: "Root volume must be EBS (encrypted). RAM &lt; 150GB. Supported instance families only." },
    { title: "How It Works", description: "RAM dumped to EBS on hibernate. On start, RAM restored from EBS. Processes continue from where they left." },
    { title: "Use Cases", description: "Long-running processes, services with long initialization, preserving RAM state between sessions." }
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
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Hibernate</h1>
        <p className="text-slate-400">Suspend and resume instance state</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setInstanceState("running")} className={`px-4 py-2 rounded-lg ${instanceState === "running" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Running</button>
          <button onClick={() => setInstanceState("hibernating")} className={`px-4 py-2 rounded-lg ${instanceState === "hibernating" ? "bg-yellow-500 text-white" : "bg-slate-700 text-slate-300"}`}>Hibernate</button>
          <button onClick={() => setInstanceState("stopped")} className={`px-4 py-2 rounded-lg ${instanceState === "stopped" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Start</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            {/* Instance */}
            <div className={`rounded-lg p-4 text-center ${instanceState === "running" || instanceState === "stopped" ? "bg-blue-500 text-white" : "bg-yellow-500 text-black"}`}>
              <div className="text-2xl">🖥️</div>
              <div className="text-xs">EC2</div>
            </div>

            {/* RAM */}
            <div className="text-center">
              <div className={`bg-purple-500 rounded p-3 mb-1 ${instanceState === "hibernating" ? "animate-pulse" : ""}`}>
                <div className="text-white text-xs">RAM</div>
                <div className="text-white text-lg">💾</div>
              </div>
              <div className="text-xs text-slate-400">
                {instanceState === "running" ? "In use" : instanceState === "hibernating" ? "Saving..." : "Restored"}
              </div>
            </div>

            {/* EBS */}
            <div className="text-center">
              <div className={`bg-blue-600 rounded p-3 mb-1 ${instanceState === "hibernating" ? "animate-pulse" : ""}`}>
                <div className="text-white text-xs">EBS Root</div>
                <div className="text-white text-lg">📀</div>
              </div>
              <div className="text-xs text-slate-400">
                {instanceState === "hibernating" ? "Receiving RAM" : instanceState === "stopped" ? "RAM stored" : "Encrypted"}
              </div>
            </div>
          </div>

          {/* State description */}
          <div className="mt-4 p-3 bg-slate-800 rounded text-center text-sm">
            {instanceState === "running" && <span className="text-green-400">Instance running, RAM active</span>}
            {instanceState === "hibernating" && <span className="text-yellow-400">Saving RAM to encrypted EBS volume...</span>}
            {instanceState === "stopped" && <span className="text-blue-400">Instance started, RAM restored - immediate resume!</span>}
          </div>

          {/* Requirements */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-slate-400">Root Volume</div>
              <div className="text-green-400">EBS (encrypted)</div>
            </div>
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-slate-400">RAM Limit</div>
              <div className="text-purple-400">&lt; 150 GB</div>
            </div>
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-slate-400">Duration</div>
              <div className="text-orange-400">&lt; 60 days</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Root volume MUST be encrypted EBS</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>RAM limit: 150 GB maximum</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can&apos;t hibernate more than 60 days</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Enable hibernate at launch - can&apos;t add later</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 ENI EXPLAINER (Medium)
// ============================================================================
export function EC2ENIExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [eniCount, setEniCount] = useState(1)

  const steps = [
    { title: "What is an ENI?", description: "Elastic Network Interface - virtual network card. Has private IP, optional public IP, MAC address, security groups." },
    { title: "Primary ENI", description: "Every instance has one primary ENI (eth0). Created with instance, can't detach." },
    { title: "Secondary ENIs", description: "Add multiple ENIs for network segmentation, dual-homing, failover. Move between instances." },
    { title: "Use Cases", description: "Management network, licensing tied to MAC, low-budget HA (move ENI on failure)." }
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
        <h1 className="text-2xl font-bold text-white mb-2">Elastic Network Interfaces (ENI)</h1>
        <p className="text-slate-400">Virtual network cards for EC2</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setEniCount(1)} className={`px-4 py-2 rounded-lg ${eniCount === 1 ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>1 ENI</button>
          <button onClick={() => setEniCount(2)} className={`px-4 py-2 rounded-lg ${eniCount === 2 ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>2 ENIs</button>
          <button onClick={() => setEniCount(3)} className={`px-4 py-2 rounded-lg ${eniCount === 3 ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>3 ENIs</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-4">
            {/* EC2 Instance */}
            <div className="bg-blue-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">🖥️</div>
              <div className="text-xs">EC2 Instance</div>
            </div>

            {/* ENIs */}
            <div className="flex flex-col gap-2">
              {Array.from({ length: eniCount }).map((_, i) => (
                <div key={i} className={`rounded p-2 text-white text-xs ${i === 0 ? "bg-blue-600" : "bg-green-500"}`}>
                  <div className="flex items-center gap-2">
                    <span>🔌</span>
                    <div>
                      <div>{i === 0 ? "eth0 (Primary)" : `eth${i}`}</div>
                      <div className="text-xs opacity-75">10.0.{i}.{50 + i}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subnets */}
            <div className="flex flex-col gap-2">
              {Array.from({ length: eniCount }).map((_, i) => (
                <div key={i} className="bg-slate-700 rounded p-2 text-xs">
                  <div className="text-slate-400">Subnet {i + 1}</div>
                  <div className="text-slate-300">10.0.{i}.0/24</div>
                </div>
              ))}
            </div>
          </div>

          {/* ENI Properties */}
          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-sm text-slate-400 mb-2">ENI Properties</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-blue-400">Private IP</div>
                <div className="text-slate-300">✓ Required</div>
              </div>
              <div className="text-center">
                <div className="text-green-400">Public IP</div>
                <div className="text-slate-300">Optional</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400">MAC Address</div>
                <div className="text-slate-300">Persistent</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400">Security Groups</div>
                <div className="text-slate-300">Per-ENI</div>
              </div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Primary ENI can&apos;t be detached from instance</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Secondary ENIs can move between instances (same AZ)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Each ENI can have its own security groups</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Max ENIs depends on instance type</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 NITRO SYSTEM EXPLAINER (Light)
// ============================================================================
export function EC2NitroExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is Nitro?", description: "AWS's next-gen virtualization platform. Hardware-based security, better performance, more resource to instances." },
    { title: "Nitro Components", description: "Nitro Cards (I/O), Nitro Security Chip (hardware security), Nitro Hypervisor (lightweight)." },
    { title: "Benefits", description: "Higher network/EBS performance, bare-metal options, better security isolation, new instance types." },
    { title: "Instance Types", description: "All modern instance types (5th gen+) use Nitro. Required for some features like io2 Block Express." }
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
        <h1 className="text-2xl font-bold text-white mb-2">AWS Nitro System</h1>
        <p className="text-slate-400">Modern EC2 virtualization platform</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Nitro Architecture */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-500/20 border border-blue-500 rounded p-4 text-center">
              <div className="text-2xl mb-2">🔧</div>
              <div className="text-sm text-blue-400 font-medium">Nitro Cards</div>
              <div className="text-xs text-slate-400 mt-1">VPC, EBS, Instance Storage I/O</div>
            </div>
            <div className="bg-green-500/20 border border-green-500 rounded p-4 text-center">
              <div className="text-2xl mb-2">🔐</div>
              <div className="text-sm text-green-400 font-medium">Security Chip</div>
              <div className="text-xs text-slate-400 mt-1">Hardware root of trust</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500 rounded p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-purple-400 font-medium">Nitro Hypervisor</div>
              <div className="text-xs text-slate-400 mt-1">Lightweight, minimal overhead</div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-800 rounded p-4 mb-4">
            <div className="text-sm font-medium text-white mb-3">Nitro Benefits</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300">Up to 100 Gbps networking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300">Up to 256,000 EBS IOPS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300">Bare-metal instances</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300">Nitro Enclaves (isolated compute)</span>
              </div>
            </div>
          </div>

          {/* Nitro Instance Types */}
          <div className="flex flex-wrap justify-center gap-2">
            {["M5", "C5", "R5", "T3", "M6i", "C6i", "R6i", "M7i"].map(type => (
              <div key={type} className="bg-blue-500 rounded px-3 py-1 text-white text-xs">{type}</div>
            ))}
            <div className="text-slate-400 text-xs self-center">+ all 5th gen and newer</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>All modern instance types (5th gen+) are Nitro-based</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Required for io2 Block Express (256K IOPS)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Enables bare-metal instances and Nitro Enclaves</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Better price/performance than older Xen-based types</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EC2 SPOT FLEET EXPLAINER (Medium)
// ============================================================================
export function EC2SpotFleetExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is Spot Fleet?", description: "Request Spot Instances across multiple pools (instance types, AZs). Can include On-Demand for baseline." },
    { title: "Launch Specifications", description: "Define multiple instance types and AZs. Fleet picks optimal mix based on strategy." },
    { title: "Allocation Strategies", description: "lowestPrice: cheapest pools. diversified: spread across pools. capacityOptimized: least interruption." },
    { title: "Interruption Handling", description: "2-minute warning before Spot termination. Use interruption handler to save state or drain connections." }
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
        <h1 className="text-2xl font-bold text-white mb-2">EC2 Spot Fleet</h1>
        <p className="text-slate-400">Managed Spot Instance requests</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Fleet visualization */}
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-2">Spot Fleet Request: 10 instances</div>
            <div className="grid grid-cols-4 gap-2">
              {/* Different pools */}
              <div className="bg-blue-500/20 border border-blue-500 rounded p-2 text-center">
                <div className="text-xs text-blue-400">m5.large</div>
                <div className="text-xs text-slate-400">us-east-1a</div>
                <div className="flex justify-center gap-1 mt-1">
                  {[1,2,3].map(i => <div key={i} className="w-4 h-4 bg-blue-500 rounded text-xs text-white flex items-center justify-center">✓</div>)}
                </div>
              </div>
              <div className="bg-green-500/20 border border-green-500 rounded p-2 text-center">
                <div className="text-xs text-green-400">m5.xlarge</div>
                <div className="text-xs text-slate-400">us-east-1b</div>
                <div className="flex justify-center gap-1 mt-1">
                  {[1,2].map(i => <div key={i} className="w-4 h-4 bg-green-500 rounded text-xs text-white flex items-center justify-center">✓</div>)}
                </div>
              </div>
              <div className="bg-purple-500/20 border border-purple-500 rounded p-2 text-center">
                <div className="text-xs text-purple-400">c5.large</div>
                <div className="text-xs text-slate-400">us-east-1a</div>
                <div className="flex justify-center gap-1 mt-1">
                  {[1,2,3].map(i => <div key={i} className="w-4 h-4 bg-purple-500 rounded text-xs text-white flex items-center justify-center">✓</div>)}
                </div>
              </div>
              <div className="bg-orange-500/20 border border-orange-500 rounded p-2 text-center">
                <div className="text-xs text-orange-400">On-Demand</div>
                <div className="text-xs text-slate-400">baseline</div>
                <div className="flex justify-center gap-1 mt-1">
                  {[1,2].map(i => <div key={i} className="w-4 h-4 bg-orange-500 rounded text-xs text-white flex items-center justify-center">✓</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Strategies */}
          <div className="bg-slate-800 rounded p-3 mb-4">
            <div className="text-sm font-medium text-white mb-2">Allocation Strategies</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-500/20 rounded p-2">
                <div className="text-green-400 font-medium">lowestPrice</div>
                <div className="text-slate-400">Cheapest pools first</div>
              </div>
              <div className="bg-blue-500/20 rounded p-2">
                <div className="text-blue-400 font-medium">diversified</div>
                <div className="text-slate-400">Spread across pools</div>
              </div>
              <div className="bg-purple-500/20 rounded p-2">
                <div className="text-purple-400 font-medium">capacityOptimized</div>
                <div className="text-slate-400">Lowest interruption</div>
              </div>
            </div>
          </div>

          {/* Interruption Warning */}
          <div className="p-3 bg-yellow-500/20 border border-yellow-500 rounded text-center">
            <div className="text-yellow-400 text-sm font-medium">⚠️ Spot Interruption</div>
            <div className="text-xs text-slate-300">2-minute warning before termination</div>
            <div className="text-xs text-slate-400">Check: http://169.254.169.254/latest/meta-data/spot/termination-time</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>capacityOptimized: best for stateful workloads (fewer interruptions)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can mix Spot + On-Demand in same fleet</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>2-minute interruption notice via instance metadata</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Define target capacity by instances or vCPUs</span></li>
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
  "ec2-ebs-volume-types": EC2EBSVolumeTypesExplainer,
  "ec2-ebs-snapshots": EC2EBSSnapshotsExplainer,
  "ec2-amis": EC2AMIExplainer,
  "ec2-user-data": EC2UserDataExplainer,
  "ec2-instance-metadata": EC2InstanceMetadataExplainer,
  "ec2-hibernate": EC2HibernateExplainer,
  "ec2-eni": EC2ENIExplainer,
  "ec2-nitro": EC2NitroExplainer,
  "ec2-spot-fleet": EC2SpotFleetExplainer,
}
