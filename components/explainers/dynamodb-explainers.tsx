"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// DYNAMODB PARTITION KEYS EXPLAINER (Rich)
// ============================================================================
export function DynamoDBPartitionKeysExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPartition, setSelectedPartition] = useState<string | null>(null)

  const steps = [
    {
      title: "Partition Key Basics",
      description: "The partition key determines which physical partition stores your item. DynamoDB hashes the key to locate data."
    },
    {
      title: "Hot Partitions",
      description: "If one partition key gets too much traffic, that partition becomes 'hot' and throttles. Avoid sequential IDs!"
    },
    {
      title: "Composite Keys",
      description: "Partition Key + Sort Key allow multiple items per partition. Query all items in a partition efficiently."
    },
    {
      title: "Key Design Patterns",
      description: "Use high-cardinality attributes. Add random suffixes for write-heavy workloads. Consider access patterns first."
    }
  ]

  const partitions = [
    { id: "user-1", items: 3, hot: false },
    { id: "user-2", items: 150, hot: true },
    { id: "user-3", items: 5, hot: false },
    { id: "user-4", items: 8, hot: false },
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Partition Keys</h1>
        <p className="text-slate-400">Understanding data distribution and avoiding hot partitions</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-4">DynamoDB Table Partitions</div>

          <div className="grid grid-cols-4 gap-4">
            {partitions.map((partition) => (
              <div
                key={partition.id}
                onClick={() => setSelectedPartition(partition.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  partition.hot
                    ? "bg-red-500/20 border-2 border-red-500"
                    : "bg-blue-500/20 border-2 border-blue-500/30"
                } ${selectedPartition === partition.id ? "ring-2 ring-white" : ""}`}
              >
                <div className="text-xs text-slate-400 mb-1">Partition</div>
                <div className="font-mono text-white text-sm mb-2">{partition.id}</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(partition.items, 20) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${partition.hot ? "bg-red-400" : "bg-blue-400"}`}
                    />
                  ))}
                  {partition.items > 20 && (
                    <span className="text-xs text-slate-500">+{partition.items - 20}</span>
                  )}
                </div>
                {partition.hot && (
                  <div className="text-xs text-red-400 mt-2 animate-pulse">🔥 HOT!</div>
                )}
              </div>
            ))}
          </div>

          {/* Hash Visualization */}
          <div className="mt-6 p-4 bg-slate-800 rounded-lg">
            <div className="text-xs text-slate-400 mb-2">Hash Function</div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-700 rounded px-3 py-2 font-mono text-sm text-white">
                partition_key: &quot;user-2&quot;
              </div>
              <div className="text-slate-400">→</div>
              <div className="bg-slate-700 rounded px-3 py-2 font-mono text-sm text-orange-400">
                hash(&quot;user-2&quot;)
              </div>
              <div className="text-slate-400">→</div>
              <div className="bg-blue-500/20 rounded px-3 py-2 font-mono text-sm text-blue-400">
                Partition 2
              </div>
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use high-cardinality partition keys (e.g., user_id, not status)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Hot partitions cause throttling even if table has unused capacity</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Composite key = partition key + sort key (enables range queries)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Each partition supports up to 3,000 RCU and 1,000 WCU</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB TTL EXPLAINER (Light)
// ============================================================================
export function DynamoDBTTLExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(1700000000)

  const steps = [
    {
      title: "What is TTL?",
      description: "Time To Live automatically deletes expired items. Store expiration timestamp as epoch seconds in a designated attribute."
    },
    {
      title: "How It Works",
      description: "DynamoDB scans for expired items in the background. Items typically deleted within 48 hours of expiration."
    },
    {
      title: "No Cost Deletes",
      description: "TTL deletes don't consume write capacity! Free way to remove old data automatically."
    },
    {
      title: "Use Cases",
      description: "Session data, temporary tokens, logs, cached data - anything with natural expiration."
    }
  ]

  const items = [
    { id: "session-1", ttl: 1699999900, data: "User A session" },
    { id: "session-2", ttl: 1700000100, data: "User B session" },
    { id: "session-3", ttl: 1700000500, data: "User C session" },
    { id: "token-1", ttl: 1699999800, data: "Reset token" },
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB TTL</h1>
        <p className="text-slate-400">Automatic item expiration at no cost</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Time Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Current Time (simulate)</label>
          <input
            type="range"
            min="1699999700"
            max="1700000600"
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-white font-mono mt-1">{currentTime}</div>
        </div>

        {/* Items Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Table Items</div>
          <div className="space-y-2">
            {items.map((item) => {
              const expired = item.ttl < currentTime
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded transition-all ${
                    expired ? "bg-red-500/20 opacity-50" : "bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-white">{item.id}</span>
                    <span className="text-xs text-slate-500">{item.data}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">ttl: {item.ttl}</span>
                    {expired ? (
                      <span className="text-xs text-red-400 animate-pulse">⏱️ EXPIRED</span>
                    ) : (
                      <span className="text-xs text-green-400">Active</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>TTL attribute must be a Number type containing epoch timestamp (seconds)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Deletions are FREE - no WCU consumed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Items may take up to 48 hours to be deleted after expiration</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>TTL deletes appear in DynamoDB Streams (if enabled)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// GSI VS LSI EXPLAINER (Rich)
// ============================================================================
export function DynamoDBGSIvsLSIExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [indexType, setIndexType] = useState<"gsi" | "lsi">("gsi")

  const steps = [
    {
      title: "Secondary Indexes Overview",
      description: "Query data using different keys than the table's primary key. Two types: Global (GSI) and Local (LSI)."
    },
    {
      title: "Global Secondary Index (GSI)",
      description: "Different partition key AND sort key. Has its own throughput. Can be added/removed anytime."
    },
    {
      title: "Local Secondary Index (LSI)",
      description: "Same partition key, different sort key. Shares table throughput. Must be created with table."
    },
    {
      title: "Choosing Between Them",
      description: "Need different partition key? GSI. Need same partition, different sort? LSI (if planned at creation)."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">GSI vs LSI</h1>
        <p className="text-slate-400">Understanding DynamoDB secondary indexes</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setIndexType("gsi")} className={`px-4 py-2 rounded-lg ${indexType === "gsi" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>GSI</button>
          <button onClick={() => setIndexType("lsi")} className={`px-4 py-2 rounded-lg ${indexType === "lsi" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>LSI</button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Base Table */}
            <div>
              <div className="text-sm text-slate-400 mb-2">Base Table</div>
              <div className="bg-slate-800 rounded p-3">
                <div className="text-xs text-blue-400 mb-1">PK: user_id</div>
                <div className="text-xs text-orange-400 mb-2">SK: order_id</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="bg-slate-700 p-1 rounded">user_1 | order_001</div>
                  <div className="bg-slate-700 p-1 rounded">user_1 | order_002</div>
                  <div className="bg-slate-700 p-1 rounded">user_2 | order_003</div>
                </div>
              </div>
            </div>

            {/* Index */}
            <div>
              <div className="text-sm text-slate-400 mb-2">{indexType === "gsi" ? "Global Secondary Index" : "Local Secondary Index"}</div>
              <div className={`rounded p-3 ${indexType === "gsi" ? "bg-purple-500/20 border border-purple-500/30" : "bg-green-500/20 border border-green-500/30"}`}>
                {indexType === "gsi" ? (
                  <>
                    <div className="text-xs text-purple-400 mb-1">PK: status</div>
                    <div className="text-xs text-purple-300 mb-2">SK: created_at</div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="bg-slate-800 p-1 rounded">pending | 2024-01</div>
                      <div className="bg-slate-800 p-1 rounded">shipped | 2024-02</div>
                      <div className="bg-slate-800 p-1 rounded">pending | 2024-03</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-green-400 mb-1">PK: user_id (same)</div>
                    <div className="text-xs text-green-300 mb-2">SK: created_at</div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="bg-slate-800 p-1 rounded">user_1 | 2024-01</div>
                      <div className="bg-slate-800 p-1 rounded">user_1 | 2024-02</div>
                      <div className="bg-slate-800 p-1 rounded">user_2 | 2024-03</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400">
                  <th className="text-left p-2">Feature</th>
                  <th className="text-left p-2">GSI</th>
                  <th className="text-left p-2">LSI</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="p-2">Partition Key</td>
                  <td className="p-2 text-purple-400">Different</td>
                  <td className="p-2 text-green-400">Same as table</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="p-2">Throughput</td>
                  <td className="p-2 text-purple-400">Own capacity</td>
                  <td className="p-2 text-green-400">Shares with table</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="p-2">Creation</td>
                  <td className="p-2 text-purple-400">Anytime</td>
                  <td className="p-2 text-green-400">Table creation only</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="p-2">Limit</td>
                  <td className="p-2 text-purple-400">20 per table</td>
                  <td className="p-2 text-green-400">5 per table</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>GSI: Different partition key, own throughput, add anytime (max 20)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>LSI: Same partition key, shares throughput, create with table (max 5)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>LSI has 10GB limit per partition key value</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>GSI is eventually consistent; LSI can be strongly consistent</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB STREAMS EXPLAINER (Medium)
// ============================================================================
export function DynamoDBStreamsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [streamView, setStreamView] = useState<"keys" | "new" | "old" | "both">("both")

  const steps = [
    {
      title: "What are Streams?",
      description: "Ordered flow of item-level changes in a table. Captures inserts, updates, and deletes."
    },
    {
      title: "Stream Records",
      description: "Each change creates a stream record. Choose what data to capture: keys only, new image, old image, or both."
    },
    {
      title: "Use Cases",
      description: "Trigger Lambda functions, replicate data, build audit trails, maintain aggregations, cross-region replication."
    },
    {
      title: "Processing",
      description: "Use Lambda event source mapping or Kinesis Client Library. Records available for 24 hours."
    }
  ]

  const viewOptions = {
    keys: { label: "KEYS_ONLY", desc: "Only partition/sort keys" },
    new: { label: "NEW_IMAGE", desc: "New item values" },
    old: { label: "OLD_IMAGE", desc: "Previous values" },
    both: { label: "NEW_AND_OLD_IMAGES", desc: "Both versions" }
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Streams</h1>
        <p className="text-slate-400">Capturing and reacting to table changes</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Stream View Selector */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Stream View Type</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(viewOptions) as Array<keyof typeof viewOptions>).map((key) => (
              <button
                key={key}
                onClick={() => setStreamView(key)}
                className={`p-2 rounded text-xs ${streamView === key ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"}`}
              >
                {viewOptions[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-6">
            {/* Table */}
            <div className="flex-1">
              <div className="text-sm text-slate-400 mb-2">DynamoDB Table</div>
              <div className="bg-slate-800 rounded p-3">
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-green-500/20 p-2 rounded border-l-2 border-green-500">
                    INSERT: user_1 {`{name: "Alice"}`}
                  </div>
                  <div className="bg-yellow-500/20 p-2 rounded border-l-2 border-yellow-500">
                    UPDATE: user_2 {`{status: "active"}`}
                  </div>
                  <div className="bg-red-500/20 p-2 rounded border-l-2 border-red-500">
                    DELETE: user_3
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center h-32">
              <div className="text-blue-400 text-2xl">→</div>
            </div>

            {/* Stream */}
            <div className="flex-1">
              <div className="text-sm text-slate-400 mb-2">Stream ({viewOptions[streamView].label})</div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-green-400">INSERT</div>
                    {streamView !== "old" && <div className="text-slate-400">New: {`{user_1, name: "Alice"}`}</div>}
                    {streamView === "keys" && <div className="text-slate-500">(keys only)</div>}
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-yellow-400">MODIFY</div>
                    {(streamView === "old" || streamView === "both") && <div className="text-red-400">Old: {`{status: "pending"}`}</div>}
                    {(streamView === "new" || streamView === "both") && <div className="text-green-400">New: {`{status: "active"}`}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lambda Consumer */}
          <div className="mt-4 flex justify-center">
            <div className="bg-orange-500 rounded p-3 text-white text-sm">
              Lambda Consumer
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Stream records are retained for 24 hours</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>NEW_AND_OLD_IMAGES captures complete before/after state</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use with Lambda for serverless event-driven architectures</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Streams enable Global Tables cross-region replication</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB CAPACITY MODES EXPLAINER (Medium)
// ============================================================================
export function DynamoDBCapacityModesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState<"provisioned" | "ondemand">("provisioned")
  const [traffic, setTraffic] = useState(50)

  const steps = [
    {
      title: "Capacity Modes",
      description: "DynamoDB offers two capacity modes: Provisioned (you set RCU/WCU) and On-Demand (pay per request)."
    },
    {
      title: "Provisioned Capacity",
      description: "You specify Read/Write Capacity Units. Predictable cost but requires capacity planning. Supports auto-scaling."
    },
    {
      title: "On-Demand Capacity",
      description: "Pay per request. No capacity planning needed. Great for unpredictable or new workloads."
    },
    {
      title: "Choosing a Mode",
      description: "Provisioned: predictable traffic, cost optimization. On-Demand: spiky/unknown traffic, new applications."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  const provisionedCapacity = 100
  const throttled = mode === "provisioned" && traffic > provisionedCapacity

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Capacity Modes</h1>
        <p className="text-slate-400">Provisioned vs On-Demand throughput</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setMode("provisioned")} className={`px-4 py-2 rounded-lg ${mode === "provisioned" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Provisioned</button>
          <button onClick={() => setMode("ondemand")} className={`px-4 py-2 rounded-lg ${mode === "ondemand" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>On-Demand</button>
        </div>

        {/* Traffic Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Incoming Traffic (RCU)</label>
          <input type="range" min="10" max="200" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{traffic} RCU</div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="relative h-40">
            {/* Capacity Line (Provisioned only) */}
            {mode === "provisioned" && (
              <div className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-500" style={{ top: `${100 - (provisionedCapacity / 2)}%` }}>
                <span className="absolute right-0 -top-5 text-xs text-yellow-500">Provisioned: {provisionedCapacity} RCU</span>
              </div>
            )}

            {/* Traffic Bar */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20">
              <div
                className={`w-full transition-all ${throttled ? "bg-red-500" : mode === "ondemand" ? "bg-green-500" : "bg-blue-500"}`}
                style={{ height: `${Math.min(traffic / 2, 100)}%` }}
              />
              {throttled && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400 animate-pulse whitespace-nowrap">
                  🚫 THROTTLED
                </div>
              )}
            </div>

            {/* Cost Indicator */}
            <div className="absolute bottom-2 right-2 text-xs">
              {mode === "provisioned" ? (
                <span className="text-blue-400">Fixed monthly cost</span>
              ) : (
                <span className="text-green-400">Pay: ${(traffic * 0.25).toFixed(2)}/hour</span>
              )}
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>1 RCU = 1 strongly consistent read (4KB) or 2 eventually consistent</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>1 WCU = 1 write per second (1KB)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>On-Demand: 2.5x more expensive but no throttling</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can switch modes once every 24 hours</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB TRANSACTIONS EXPLAINER (Medium)
// ============================================================================
export function DynamoDBTransactionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transactionState, setTransactionState] = useState<"pending" | "success" | "failed">("pending")

  const steps = [
    {
      title: "What are Transactions?",
      description: "ACID transactions across multiple items and tables. All operations succeed or all fail together."
    },
    {
      title: "TransactWriteItems",
      description: "Up to 100 write actions: Put, Update, Delete, ConditionCheck. Atomic all-or-nothing execution."
    },
    {
      title: "TransactGetItems",
      description: "Read multiple items atomically. Get a consistent snapshot across items."
    },
    {
      title: "Cost & Limits",
      description: "Transactions cost 2x normal capacity. Use for critical operations like financial transfers, inventory."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Transactions</h1>
        <p className="text-slate-400">ACID operations across multiple items</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Transaction State Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setTransactionState("pending")} className={`px-3 py-1 rounded text-sm ${transactionState === "pending" ? "bg-yellow-500 text-black" : "bg-slate-700 text-slate-300"}`}>Pending</button>
          <button onClick={() => setTransactionState("success")} className={`px-3 py-1 rounded text-sm ${transactionState === "success" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Success</button>
          <button onClick={() => setTransactionState("failed")} className={`px-3 py-1 rounded text-sm ${transactionState === "failed" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Failed</button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Transfer $100: Account A → Account B</div>

          <div className="grid grid-cols-3 gap-4">
            {/* Account A */}
            <div className={`p-4 rounded-lg border-2 ${transactionState === "failed" ? "border-red-500 bg-red-500/10" : transactionState === "success" ? "border-green-500 bg-green-500/10" : "border-slate-600 bg-slate-800"}`}>
              <div className="text-xs text-slate-400">Account A</div>
              <div className="text-2xl font-mono text-white mt-2">
                ${transactionState === "success" ? "400" : "500"}
              </div>
              <div className={`text-xs mt-2 ${transactionState === "pending" ? "text-yellow-400" : transactionState === "success" ? "text-green-400" : "text-red-400"}`}>
                {transactionState === "pending" ? "Debit $100..." : transactionState === "success" ? "✓ Debited" : "✗ Rolled back"}
              </div>
            </div>

            {/* Transaction */}
            <div className="flex items-center justify-center">
              <div className={`p-3 rounded-full ${transactionState === "pending" ? "bg-yellow-500/20 animate-pulse" : transactionState === "success" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {transactionState === "pending" ? "⏳" : transactionState === "success" ? "✓" : "✗"}
              </div>
            </div>

            {/* Account B */}
            <div className={`p-4 rounded-lg border-2 ${transactionState === "failed" ? "border-red-500 bg-red-500/10" : transactionState === "success" ? "border-green-500 bg-green-500/10" : "border-slate-600 bg-slate-800"}`}>
              <div className="text-xs text-slate-400">Account B</div>
              <div className="text-2xl font-mono text-white mt-2">
                ${transactionState === "success" ? "300" : "200"}
              </div>
              <div className={`text-xs mt-2 ${transactionState === "pending" ? "text-yellow-400" : transactionState === "success" ? "text-green-400" : "text-red-400"}`}>
                {transactionState === "pending" ? "Credit $100..." : transactionState === "success" ? "✓ Credited" : "✗ Not changed"}
              </div>
            </div>
          </div>

          {transactionState === "failed" && (
            <div className="mt-4 text-center text-sm text-red-400">
              Transaction failed: Condition check failed. All changes rolled back.
            </div>
          )}
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Transactions provide ACID guarantees across items/tables</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Maximum 100 items per transaction, 4MB total</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cost 2x regular reads/writes</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use for inventory, financial operations, booking systems</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DAX EXPLAINER (Medium)
// ============================================================================
export function DynamoDBDAXExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [daxEnabled, setDaxEnabled] = useState(false)

  const steps = [
    {
      title: "What is DAX?",
      description: "DynamoDB Accelerator - fully managed, in-memory cache. Microsecond response times for cached reads."
    },
    {
      title: "How It Works",
      description: "DAX cluster sits between app and DynamoDB. Cache hits return instantly; misses fetch from DynamoDB."
    },
    {
      title: "Write-Through Caching",
      description: "Writes go to both DAX and DynamoDB. Maintains consistency automatically."
    },
    {
      title: "Use Cases",
      description: "Read-heavy workloads, gaming leaderboards, session stores. Not for strongly consistent reads."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB DAX</h1>
        <p className="text-slate-400">In-memory caching for microsecond reads</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button onClick={() => setDaxEnabled(!daxEnabled)} className={`px-4 py-2 rounded-lg ${daxEnabled ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>
            DAX: {daxEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Application */}
            <div className="bg-purple-500 rounded p-4 text-white text-center">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-xs">Application</div>
            </div>

            {/* DAX (conditional) */}
            {daxEnabled && (
              <>
                <div className="text-slate-400">→</div>
                <div className="bg-green-500 rounded p-4 text-white text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-xs">DAX Cluster</div>
                  <div className="text-xs opacity-75">~μs latency</div>
                </div>
              </>
            )}

            <div className="text-slate-400">→</div>

            {/* DynamoDB */}
            <div className="bg-blue-600 rounded p-4 text-white text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs">DynamoDB</div>
              <div className="text-xs opacity-75">~ms latency</div>
            </div>
          </div>

          {/* Latency Comparison */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-400 mb-1">Without DAX</div>
              <div className="text-lg font-mono text-red-400">~5-10 ms</div>
            </div>
            <div className={`rounded p-3 ${daxEnabled ? "bg-green-500/20" : "bg-slate-800"}`}>
              <div className="text-xs text-slate-400 mb-1">With DAX (cache hit)</div>
              <div className={`text-lg font-mono ${daxEnabled ? "text-green-400" : "text-slate-500"}`}>
                {daxEnabled ? "~400 μs" : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>DAX provides microsecond latency for cached reads</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Only supports eventually consistent reads (not strongly consistent)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Must be deployed in VPC - Lambda needs VPC config to use DAX</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use ElastiCache if you need more control or cross-service caching</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// GLOBAL TABLES EXPLAINER (Medium)
// ============================================================================
export function DynamoDBGlobalTablesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeRegion, setActiveRegion] = useState<"us" | "eu" | "ap">("us")

  const steps = [
    {
      title: "What are Global Tables?",
      description: "Fully managed multi-region, multi-active database. Automatic replication across regions."
    },
    {
      title: "Multi-Active",
      description: "Read and write to any region. All replicas accept writes - no single primary."
    },
    {
      title: "Conflict Resolution",
      description: "Last-writer-wins based on timestamp. Conflicts rare in practice with proper key design."
    },
    {
      title: "Use Cases",
      description: "Global applications, disaster recovery, low-latency worldwide access, regulatory compliance."
    }
  ]

  const regions = [
    { id: "us", name: "US East", x: 20, y: 40 },
    { id: "eu", name: "EU West", x: 45, y: 30 },
    { id: "ap", name: "AP Tokyo", x: 80, y: 35 },
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Global Tables</h1>
        <p className="text-slate-400">Multi-region, multi-active replication</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Region Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setActiveRegion(region.id as typeof activeRegion)}
              className={`px-4 py-2 rounded-lg ${activeRegion === region.id ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* World Map Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4 relative h-48">
          {/* Simplified world map background */}
          <div className="absolute inset-0 opacity-20 text-6xl text-center pt-12">🌍</div>

          {/* Region nodes */}
          {regions.map((region) => (
            <div
              key={region.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${activeRegion === region.id ? "z-10" : ""}`}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
            >
              <div className={`rounded-full p-3 ${activeRegion === region.id ? "bg-green-500 animate-pulse" : "bg-blue-500"}`}>
                <div className="text-white text-xs font-medium">{region.name}</div>
              </div>
              {activeRegion === region.id && (
                <div className="text-xs text-green-400 text-center mt-1">Writing...</div>
              )}
            </div>
          ))}

          {/* Replication arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="25%" y1="40%" x2="43%" y2="32%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
            <line x1="47%" y1="32%" x2="75%" y2="37%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="42%" x2="75%" y2="37%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
          </svg>

          {/* Replication status */}
          <div className="absolute bottom-2 right-2 text-xs text-slate-400">
            Replication: ~1 second
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Multi-active: read/write to any region</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires DynamoDB Streams enabled</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Last-writer-wins conflict resolution</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Replication typically under 1 second</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SORT KEYS EXPLAINER (Medium)
// ============================================================================
export function DynamoDBSortKeysExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queryType, setQueryType] = useState<"eq" | "begins" | "between">("eq")

  const steps = [
    {
      title: "Sort Key Purpose",
      description: "Sort key determines ordering within a partition. Enables efficient range queries on related items."
    },
    {
      title: "Query Operations",
      description: "Use sort key conditions: =, <, >, <=, >=, BETWEEN, begins_with. Query returns items in sorted order."
    },
    {
      title: "Design Patterns",
      description: "Use composite sort keys for hierarchy: STATUS#DATE or TYPE#ID. Enables flexible querying."
    },
    {
      title: "vs Scan",
      description: "Query with sort key is efficient (finds partition, then range). Scan reads entire table - expensive!"
    }
  ]

  const items = [
    { pk: "user_1", sk: "ORDER#2024-01-01", data: "Order A" },
    { pk: "user_1", sk: "ORDER#2024-01-15", data: "Order B" },
    { pk: "user_1", sk: "ORDER#2024-02-01", data: "Order C" },
    { pk: "user_1", sk: "PROFILE", data: "User profile" },
    { pk: "user_1", sk: "SETTINGS", data: "User settings" },
  ]

  const getHighlightedItems = () => {
    switch (queryType) {
      case "eq": return items.filter(i => i.sk === "PROFILE")
      case "begins": return items.filter(i => i.sk.startsWith("ORDER#"))
      case "between": return items.filter(i => i.sk >= "ORDER#2024-01-01" && i.sk <= "ORDER#2024-01-31")
    }
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  const highlighted = getHighlightedItems()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Sort Keys</h1>
        <p className="text-slate-400">Range queries and data organization</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Query Type Selector */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Query Condition</label>
          <div className="flex gap-2">
            <button onClick={() => setQueryType("eq")} className={`flex-1 py-2 rounded text-xs ${queryType === "eq" ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"}`}>SK = &quot;PROFILE&quot;</button>
            <button onClick={() => setQueryType("begins")} className={`flex-1 py-2 rounded text-xs ${queryType === "begins" ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"}`}>begins_with(&quot;ORDER#&quot;)</button>
            <button onClick={() => setQueryType("between")} className={`flex-1 py-2 rounded text-xs ${queryType === "between" ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"}`}>BETWEEN Jan 1-31</button>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-2">Table: PK = user_1</div>
          <div className="space-y-2">
            {items.map((item, idx) => {
              const isHighlighted = highlighted.some(h => h.sk === item.sk)
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-2 rounded transition-all ${isHighlighted ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}
                >
                  <span className="font-mono text-xs text-blue-400 w-16">{item.pk}</span>
                  <span className="font-mono text-xs text-orange-400 flex-1">{item.sk}</span>
                  <span className="text-xs text-slate-400">{item.data}</span>
                  {isHighlighted && <span className="text-green-400">✓</span>}
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-sm text-slate-400">
            Results: {highlighted.length} items
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Sort key enables range queries within a partition</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use composite keys like TYPE#DATE for flexible queries</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Query = efficient (partition + range), Scan = expensive (full table)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>begins_with only works on sort key, not partition key</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// AUTO SCALING EXPLAINER (Light)
// ============================================================================
export function DynamoDBAutoScalingExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [traffic, setTraffic] = useState(50)

  const steps = [
    {
      title: "What is Auto Scaling?",
      description: "Automatically adjusts provisioned capacity based on actual usage. Maintains target utilization."
    },
    {
      title: "How It Works",
      description: "Set min/max capacity and target utilization (e.g., 70%). DynamoDB scales within those bounds."
    },
    {
      title: "Scale-Out vs Scale-In",
      description: "Scale-out happens quickly (minutes). Scale-in is gradual to avoid throttling."
    },
    {
      title: "Best Practices",
      description: "Set reasonable min to handle baseline. Use scheduled scaling for predictable spikes."
    }
  ]

  const minCapacity = 20
  const maxCapacity = 200
  const targetUtil = 70
  const currentCapacity = Math.min(maxCapacity, Math.max(minCapacity, Math.round(traffic / (targetUtil / 100))))

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Auto Scaling</h1>
        <p className="text-slate-400">Dynamic capacity management</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Traffic Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Current Traffic (RCU)</label>
          <input type="range" min="10" max="250" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{traffic} RCU</div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-end justify-between h-40 gap-4">
            {/* Traffic Bar */}
            <div className="flex-1">
              <div className="text-xs text-slate-400 mb-2">Traffic</div>
              <div className="h-32 bg-slate-800 rounded relative">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded transition-all"
                  style={{ height: `${Math.min(100, (traffic / maxCapacity) * 100)}%` }}
                />
              </div>
              <div className="text-center text-xs mt-1">{traffic}</div>
            </div>

            {/* Capacity Bar */}
            <div className="flex-1">
              <div className="text-xs text-slate-400 mb-2">Provisioned</div>
              <div className="h-32 bg-slate-800 rounded relative">
                {/* Min line */}
                <div className="absolute left-0 right-0 border-t border-yellow-500" style={{ bottom: `${(minCapacity / maxCapacity) * 100}%` }}>
                  <span className="text-xs text-yellow-500 absolute -right-8">min</span>
                </div>
                {/* Max line */}
                <div className="absolute left-0 right-0 border-t border-red-500 top-0">
                  <span className="text-xs text-red-500 absolute -right-8">max</span>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500 rounded transition-all"
                  style={{ height: `${(currentCapacity / maxCapacity) * 100}%` }}
                />
              </div>
              <div className="text-center text-xs mt-1">{currentCapacity}</div>
            </div>

            {/* Utilization */}
            <div className="flex-1">
              <div className="text-xs text-slate-400 mb-2">Utilization</div>
              <div className="h-32 bg-slate-800 rounded relative">
                {/* Target line */}
                <div className="absolute left-0 right-0 border-t border-dashed border-green-500" style={{ bottom: `${targetUtil}%` }}>
                  <span className="text-xs text-green-500 absolute -right-10">{targetUtil}%</span>
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded transition-all ${(traffic / currentCapacity) * 100 > 80 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ height: `${Math.min(100, (traffic / currentCapacity) * 100)}%` }}
                />
              </div>
              <div className="text-center text-xs mt-1">{Math.round((traffic / currentCapacity) * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step {step + 1}/{steps.length}</span>
            <span className="text-blue-400 font-medium">{steps[step].title}</span>
          </div>
          <p className="text-slate-300 text-sm">{steps[step].description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Auto scaling uses Application Auto Scaling service</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Target tracking maintains ~70% utilization by default</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Scale-out is fast, scale-in is gradual (prevents oscillation)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use scheduled scaling for predictable traffic patterns</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB CONDITIONAL WRITES EXPLAINER (Medium)
// ============================================================================
export function DynamoDBConditionalWritesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [writeType, setWriteType] = useState<"unconditional" | "conditional">("conditional")

  const steps = [
    {
      title: "Conditional Expressions",
      description: "Add conditions to write operations. Only succeeds if condition evaluates to true."
    },
    {
      title: "Optimistic Locking",
      description: "Use version numbers to prevent overwriting concurrent changes. Check version before update."
    },
    {
      title: "Atomic Counters",
      description: "Increment/decrement values atomically with SET counter = counter + :inc without conditions."
    },
    {
      title: "Common Patterns",
      description: "attribute_not_exists for creates, attribute_exists for updates, version checks for locking."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const typeByStep: Array<"unconditional" | "conditional"> = ["unconditional", "conditional", "conditional", "conditional"]
    if (typeByStep[step]) setWriteType(typeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Conditional Writes</h1>
        <p className="text-slate-400">Preventing race conditions with conditional expressions</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setWriteType("unconditional")} className={`px-4 py-2 rounded-lg ${writeType === "unconditional" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Unconditional</button>
          <button onClick={() => setWriteType("conditional")} className={`px-4 py-2 rounded-lg ${writeType === "conditional" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Conditional</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 rounded p-2 text-white text-xs">User A</div>
                <div className="flex-1 mx-2 h-0.5 bg-purple-500"></div>
                <div className="bg-blue-600 rounded p-2 text-white text-xs">UpdateItem</div>
                <div className="flex-1 mx-2 h-0.5 bg-blue-500"></div>
                <div className="bg-green-500 rounded p-2 text-white text-xs">✓</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-orange-500 rounded p-2 text-white text-xs">User B</div>
                <div className="flex-1 mx-2 h-0.5 bg-orange-500"></div>
                <div className="bg-blue-600 rounded p-2 text-white text-xs">UpdateItem</div>
                <div className="flex-1 mx-2 h-0.5 bg-blue-500"></div>
                <div className="bg-green-500 rounded p-2 text-white text-xs">✓ (overwrites!)</div>
              </div>
              <div className="mt-4 bg-slate-800 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Without Condition - Race Condition Risk</div>
                <pre className="text-xs text-red-400 font-mono overflow-x-auto">{`UpdateItem:
  Key: {id: "123"}
  UpdateExpression: "SET price = :p"
// No condition - last write wins!`}</pre>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 rounded p-2 text-white text-xs">User A</div>
                <div className="flex-1 mx-2 h-0.5 bg-purple-500"></div>
                <div className="bg-blue-600 rounded p-2 text-white text-xs">UpdateItem</div>
                <div className="flex-1 mx-2 h-0.5 bg-blue-500"></div>
                <div className="bg-green-500 rounded p-2 text-white text-xs">✓</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-orange-500 rounded p-2 text-white text-xs">User B</div>
                <div className="flex-1 mx-2 h-0.5 bg-orange-500"></div>
                <div className="bg-blue-600 rounded p-2 text-white text-xs">UpdateItem</div>
                <div className="flex-1 mx-2 h-0.5 bg-blue-500"></div>
                <div className="bg-red-500 rounded p-2 text-white text-xs">✗ Rejected</div>
              </div>
              <div className="mt-4 bg-slate-800 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">With Condition - Safe</div>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto">{`UpdateItem:
  Key: {id: "123"}
  ConditionExpression: "version = :v"
  ExpressionAttributeValues: {":v": 5}`}</pre>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Atomic Counter Pattern</div>
                <pre className="text-xs text-blue-400 font-mono overflow-x-auto">{`UpdateItem:
  Key: {id: "post-1"}
  UpdateExpression: "SET likes = likes + :inc"
  ExpressionAttributeValues: {":inc": 1}
// Atomic - no condition needed`}</pre>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-purple-500/20 border border-purple-500 rounded p-2">
                  <div className="text-xs text-slate-400">Before</div>
                  <div className="text-lg text-white">likes: 42</div>
                </div>
                <div className="flex items-center justify-center text-2xl text-blue-400">→</div>
                <div className="bg-green-500/20 border border-green-500 rounded p-2">
                  <div className="text-xs text-slate-400">After +1</div>
                  <div className="text-lg text-white">likes: 43</div>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-slate-800 rounded p-3">
                <div className="text-xs text-green-400 mb-1">Safe Create</div>
                <pre className="text-xs text-slate-300 font-mono">ConditionExpression: &quot;attribute_not_exists(pk)&quot;</pre>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <div className="text-xs text-blue-400 mb-1">Safe Update</div>
                <pre className="text-xs text-slate-300 font-mono">ConditionExpression: &quot;attribute_exists(pk)&quot;</pre>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <div className="text-xs text-purple-400 mb-1">Optimistic Lock</div>
                <pre className="text-xs text-slate-300 font-mono">ConditionExpression: &quot;version = :v&quot;</pre>
              </div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>attribute_not_exists(pk) - ensure item doesn&apos;t exist (safe create)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>attribute_exists(pk) - ensure item exists before update</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Optimistic locking with version numbers prevents lost updates</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>ConditionalCheckFailedException when condition fails</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB BATCH OPERATIONS EXPLAINER (Medium)
// ============================================================================
export function DynamoDBBatchOperationsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [operation, setOperation] = useState<"get" | "write">("get")

  const steps = [
    {
      title: "Batch Operations",
      description: "BatchGetItem and BatchWriteItem process multiple items in single request. More efficient than individual calls."
    },
    {
      title: "BatchGetItem",
      description: "Read up to 100 items across multiple tables. Returns items in parallel. Max 16 MB response."
    },
    {
      title: "BatchWriteItem",
      description: "Write up to 25 items (put or delete) across tables. No update support. Max 16 MB request."
    },
    {
      title: "Handling Failures",
      description: "Partial failures return UnprocessedItems/Keys. Implement exponential backoff retry for these items."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Batch Operations</h1>
        <p className="text-slate-400">Efficient multi-item reads and writes</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setOperation("get")} className={`px-4 py-2 rounded-lg ${operation === "get" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>BatchGetItem</button>
          <button onClick={() => setOperation("write")} className={`px-4 py-2 rounded-lg ${operation === "write" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>BatchWriteItem</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-sm font-medium text-white mb-2">{operation === "get" ? "BatchGetItem" : "BatchWriteItem"}</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Max items: {operation === "get" ? "100" : "25"}</li>
                <li>• Max size: 16 MB</li>
                <li>• Cross-table: ✓</li>
                <li>• {operation === "get" ? "Parallel reads" : "Put + Delete only"}</li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded p-3">
              <div className="text-sm font-medium text-white mb-2">Single Item API</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• 1 item per call</li>
                <li>• More round trips</li>
                <li>• Higher latency</li>
                <li>• Simpler error handling</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Response with Unprocessed Items</div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{operation === "get" ? `{
  "Responses": {
    "Users": [{...}, {...}],
    "Orders": [{...}]
  },
  "UnprocessedKeys": {
    "Users": { "Keys": [{pk: "user#999"}] }
  }  // Retry these!
}` : `{
  "UnprocessedItems": {
    "Products": [
      { "PutRequest": { "Item": {...} } }
    ]
  }  // Retry with exponential backoff
}`}
            </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>BatchGetItem: 100 items, BatchWriteItem: 25 items</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>BatchWriteItem: Put and Delete only - no Update</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Always handle UnprocessedItems/UnprocessedKeys</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use exponential backoff for retries</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB QUERY VS SCAN EXPLAINER (Medium)
// ============================================================================
export function DynamoDBQueryScanExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [operation, setOperation] = useState<"query" | "scan">("query")

  const steps = [
    {
      title: "Query vs Scan",
      description: "Query finds items by partition key (required) and optionally sort key. Scan reads entire table."
    },
    {
      title: "Query Efficiency",
      description: "Query is efficient - reads only items matching the partition key. Use KeyConditionExpression."
    },
    {
      title: "Scan Considerations",
      description: "Scan reads every item in table. Expensive for large tables. Consider parallel scan for large datasets."
    },
    {
      title: "Best Practices",
      description: "Design for queries, not scans. Use GSIs for different access patterns. Filter after read."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Query vs Scan</h1>
        <p className="text-slate-400">Efficient data retrieval strategies</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setOperation("query")} className={`px-4 py-2 rounded-lg ${operation === "query" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Query</button>
          <button onClick={() => setOperation("scan")} className={`px-4 py-2 rounded-lg ${operation === "scan" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Scan</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Table: Orders (1M items)</div>

          <div className="grid grid-cols-5 gap-1 mb-4">
            {Array(25).fill(0).map((_, i) => (
              <div key={i} className={`h-8 rounded text-xs flex items-center justify-center ${
                operation === "query"
                  ? (i % 5 === 0 ? "bg-green-500 text-white" : "bg-slate-700 text-slate-500")
                  : "bg-red-500/80 text-white"
              }`}>
                {operation === "query" && i % 5 === 0 ? "✓" : ""}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${operation === "query" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Query</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Partition key required</li>
                <li>• Reads: ~1,000 items</li>
                <li>• Cost: 1 RCU per 4KB</li>
                <li>• Time: ~10ms</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${operation === "scan" ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Scan</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Reads ALL items</li>
                <li>• Reads: 1,000,000 items</li>
                <li>• Cost: Very high RCU</li>
                <li>• Time: Minutes</li>
              </ul>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Query requires partition key, Scan reads entire table</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FilterExpression applies AFTER items read (still consumes RCU)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use GSI for different query patterns, not Scan</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Parallel Scan for one-time exports of large tables</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB ITEM SIZE EXPLAINER (Light)
// ============================================================================
export function DynamoDBItemSizeExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [itemSize, setItemSize] = useState(200)

  const steps = [
    {
      title: "Item Size Limits",
      description: "Maximum item size is 400 KB including attribute names. Plan data model to stay within limits."
    },
    {
      title: "Calculating Size",
      description: "Size = attribute names + values. Numbers are variable-length. Strings are UTF-8 bytes."
    },
    {
      title: "Large Items",
      description: "For large objects, store in S3 and save reference in DynamoDB. Common pattern for images/files."
    },
    {
      title: "Size Impact",
      description: "Larger items = more RCUs/WCUs. 1 WCU = 1 KB write, 1 RCU = 4 KB read."
    }
  ]

  const sizeStatus = itemSize <= 400 ? "OK" : "TOO LARGE"
  const wcuNeeded = Math.ceil(itemSize / 1)
  const rcuNeeded = Math.ceil(itemSize / 4)

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Item Size</h1>
        <p className="text-slate-400">Understanding item size limits and capacity</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Item Size (KB)</label>
          <input type="range" min="1" max="500" value={itemSize} onChange={(e) => setItemSize(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{itemSize} KB</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div className={`h-full transition-all ${itemSize <= 400 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, (itemSize / 400) * 100)}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
              {itemSize} KB / 400 KB max
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg text-center ${itemSize <= 400 ? "bg-green-500/20" : "bg-red-500/20"}`}>
              <div className="text-xs text-slate-400">Status</div>
              <div className={`text-lg font-bold ${itemSize <= 400 ? "text-green-400" : "text-red-400"}`}>{sizeStatus}</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-400">WCU per Write</div>
              <div className="text-lg font-mono text-blue-400">{wcuNeeded}</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-400">RCU per Read</div>
              <div className="text-lg font-mono text-purple-400">{rcuNeeded}</div>
            </div>
          </div>

          {itemSize > 400 && (
            <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded p-3 text-yellow-400 text-sm">
              💡 Store large data in S3 and reference in DynamoDB
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Max item size: 400 KB (including attribute names)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>1 WCU = 1 KB write, 1 RCU = 4 KB strongly consistent read</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Store large objects in S3, reference in DynamoDB</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Short attribute names reduce item size</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DYNAMODB BACKUP RESTORE EXPLAINER (Light)
// ============================================================================
export function DynamoDBBackupRestoreExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [backupType, setBackupType] = useState<"ondemand" | "pitr">("pitr")

  const steps = [
    {
      title: "Backup Options",
      description: "On-demand backups for snapshots, Point-in-time Recovery (PITR) for continuous backup with 35-day retention."
    },
    {
      title: "Point-in-Time Recovery",
      description: "Restore to any second within last 35 days. Enabled per table. Protects against accidental writes/deletes."
    },
    {
      title: "On-Demand Backups",
      description: "Manual snapshots retained indefinitely. Good for compliance, before migrations. No performance impact."
    },
    {
      title: "Restore Process",
      description: "Restores create NEW table (can&apos;t overwrite). Restore time depends on table size."
    }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DynamoDB Backup & Restore</h1>
        <p className="text-slate-400">Protecting data with PITR and on-demand backups</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setBackupType("pitr")} className={`px-4 py-2 rounded-lg ${backupType === "pitr" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Point-in-Time Recovery</button>
          <button onClick={() => setBackupType("ondemand")} className={`px-4 py-2 rounded-lg ${backupType === "ondemand" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>On-Demand Backup</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {backupType === "pitr" ? (
            <div>
              <div className="text-sm text-slate-400 mb-3">35-Day Rolling Window</div>
              <div className="relative h-8 bg-slate-800 rounded mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-green-500/30 rounded-l"></div>
                <div className="absolute inset-0 flex items-center px-2">
                  <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-green-500/20"></div>
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">35 days ago</div>
              </div>
              <div className="text-center text-sm text-green-400">Restore to any second in the window</div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-slate-400 mb-3">Manual Snapshots</div>
              <div className="flex gap-4 justify-center">
                <div className="bg-blue-500/20 rounded p-3 text-center">
                  <div className="text-2xl">📸</div>
                  <div className="text-xs text-slate-400">Jan 1</div>
                </div>
                <div className="bg-blue-500/20 rounded p-3 text-center">
                  <div className="text-2xl">📸</div>
                  <div className="text-xs text-slate-400">Feb 15</div>
                </div>
                <div className="bg-blue-500/20 rounded p-3 text-center">
                  <div className="text-2xl">📸</div>
                  <div className="text-xs text-slate-400">Mar 1</div>
                </div>
              </div>
              <div className="text-center text-sm text-blue-400 mt-3">Retained indefinitely until deleted</div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${backupType === "pitr" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white">PITR</div>
              <ul className="text-xs text-slate-400 space-y-1 mt-2">
                <li>• 35-day retention</li>
                <li>• Per-second granularity</li>
                <li>• Automatic, continuous</li>
                <li>• Storage cost applies</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${backupType === "ondemand" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white">On-Demand</div>
              <ul className="text-xs text-slate-400 space-y-1 mt-2">
                <li>• Infinite retention</li>
                <li>• Manual trigger</li>
                <li>• No performance impact</li>
                <li>• Good for compliance</li>
              </ul>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>PITR: 35-day retention, restore to any second</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>On-demand: manual, retained indefinitely</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Restore always creates NEW table</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>No performance impact during backup</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const dynamodbExplainers = {
  "dynamodb-partition-keys": DynamoDBPartitionKeysExplainer,
  "dynamodb-ttl": DynamoDBTTLExplainer,
  "dynamodb-gsi-lsi": DynamoDBGSIvsLSIExplainer,
  "dynamodb-streams": DynamoDBStreamsExplainer,
  "dynamodb-capacity-modes": DynamoDBCapacityModesExplainer,
  "dynamodb-transactions": DynamoDBTransactionsExplainer,
  "dynamodb-dax": DynamoDBDAXExplainer,
  "dynamodb-global-tables": DynamoDBGlobalTablesExplainer,
  "dynamodb-sort-keys": DynamoDBSortKeysExplainer,
  "dynamodb-auto-scaling": DynamoDBAutoScalingExplainer,
  "dynamodb-conditional-writes": DynamoDBConditionalWritesExplainer,
  "dynamodb-batch-operations": DynamoDBBatchOperationsExplainer,
  "dynamodb-query-scan": DynamoDBQueryScanExplainer,
  "dynamodb-item-size": DynamoDBItemSizeExplainer,
  "dynamodb-backup-restore": DynamoDBBackupRestoreExplainer,
}
