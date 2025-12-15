"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// SNS TOPICS EXPLAINER (Medium)
// ============================================================================
export function SNSTopicsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [topicType, setTopicType] = useState<"standard" | "fifo">("standard")

  const steps = [
    {
      title: "What is an SNS Topic?",
      description: "A logical access point for publishers to send messages. Subscribers receive copies of all messages."
    },
    {
      title: "Standard vs FIFO",
      description: "Standard: best-effort ordering, at-least-once delivery. FIFO: strict ordering, exactly-once, lower throughput."
    },
    {
      title: "Access Control",
      description: "Topic policies control who can publish/subscribe. Cross-account access via resource-based policies."
    },
    {
      title: "Message Attributes",
      description: "Attach metadata to messages. Used for filtering by subscribers. Key-value pairs with type."
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Topics</h1>
        <p className="text-slate-400">Pub/sub messaging with SNS</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Topic Type Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setTopicType("standard")} className={`px-4 py-2 rounded-lg ${topicType === "standard" ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}>Standard</button>
          <button onClick={() => setTopicType("fifo")} className={`px-4 py-2 rounded-lg ${topicType === "fifo" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>FIFO</button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            {/* Publishers */}
            <div className="space-y-2">
              <div className="bg-green-500 rounded p-2 text-white text-xs text-center">Publisher 1</div>
              <div className="bg-green-500 rounded p-2 text-white text-xs text-center">Publisher 2</div>
            </div>

            {/* Arrows */}
            <div className="text-slate-400">→</div>

            {/* Topic */}
            <div className={`rounded-xl p-4 ${topicType === "standard" ? "bg-orange-500" : "bg-purple-500"}`}>
              <div className="text-white text-center">
                <div className="text-2xl">📢</div>
                <div className="text-sm font-medium">
                  {topicType === "standard" ? "my-topic" : "my-topic.fifo"}
                </div>
                <div className="text-xs opacity-75">
                  {topicType === "standard" ? "Standard" : "FIFO"}
                </div>
              </div>
            </div>

            {/* Arrows */}
            <div className="text-slate-400">→</div>

            {/* Subscribers */}
            <div className="space-y-2">
              <div className="bg-blue-500 rounded p-2 text-white text-xs text-center">SQS Queue</div>
              <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">Lambda</div>
              <div className="bg-purple-500 rounded p-2 text-white text-xs text-center">Email</div>
              <div className="bg-green-500 rounded p-2 text-white text-xs text-center">HTTP</div>
            </div>
          </div>

          {/* Topic Type Comparison */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${topicType === "standard" ? "bg-orange-500/20 border border-orange-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-orange-400">Standard Topic</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>• Best-effort ordering</li>
                <li>• At-least-once delivery</li>
                <li>• ~10M publishes/sec</li>
                <li>• All subscriber types</li>
              </ul>
            </div>
            <div className={`p-3 rounded ${topicType === "fifo" ? "bg-purple-500/20 border border-purple-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-purple-400">FIFO Topic</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>• Strict ordering</li>
                <li>• Exactly-once delivery</li>
                <li>• 300 publishes/sec</li>
                <li>• Only SQS FIFO subscriber</li>
              </ul>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO topics MUST end with .fifo</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO topics only support SQS FIFO queues as subscribers</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Max message size: 256 KB</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use message attributes for filtering</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS SUBSCRIPTIONS EXPLAINER (Medium)
// ============================================================================
export function SNSSubscriptionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState("sqs")

  const steps = [
    {
      title: "Subscription Types",
      description: "SNS supports multiple protocols: SQS, Lambda, HTTP/HTTPS, Email, SMS, and Kinesis Firehose."
    },
    {
      title: "Confirmation",
      description: "HTTP/Email subscriptions require confirmation. SQS/Lambda auto-confirm if in same account."
    },
    {
      title: "Raw Message Delivery",
      description: "Enable raw delivery to receive message without SNS metadata wrapper. Useful for SQS/HTTP."
    },
    {
      title: "Delivery Policies",
      description: "Configure retry policies for HTTP endpoints. Exponential backoff, max retries, etc."
    }
  ]

  const protocols = [
    { id: "sqs", name: "SQS", icon: "📬", desc: "Queue for async processing" },
    { id: "lambda", name: "Lambda", icon: "λ", desc: "Serverless function trigger" },
    { id: "http", name: "HTTP/S", icon: "🌐", desc: "Webhook endpoint" },
    { id: "email", name: "Email", icon: "📧", desc: "Email notifications" },
    { id: "sms", name: "SMS", icon: "📱", desc: "Text messages" },
    { id: "firehose", name: "Firehose", icon: "🔥", desc: "Stream to S3/Redshift" },
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Subscriptions</h1>
        <p className="text-slate-400">Multiple protocols for message delivery</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Protocol Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {protocols.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProtocol(p.id)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedProtocol === p.id
                  ? "bg-orange-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <div className="text-2xl">{p.icon}</div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs opacity-75">{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            {/* Topic */}
            <div className="bg-orange-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl">📢</div>
              <div className="text-sm">SNS Topic</div>
            </div>

            {/* Arrow */}
            <div className="text-slate-400 text-2xl">→</div>

            {/* Selected Subscriber */}
            <div className="bg-blue-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl">{protocols.find(p => p.id === selectedProtocol)?.icon}</div>
              <div className="text-sm">{protocols.find(p => p.id === selectedProtocol)?.name}</div>
            </div>
          </div>

          {/* Protocol Details */}
          <div className="mt-6 p-3 bg-slate-800 rounded">
            <div className="text-sm text-slate-400 mb-2">Subscription Details</div>
            {selectedProtocol === "sqs" && (
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Auto-confirms in same account</div>
                <div>• Enable Raw Message Delivery to skip wrapper</div>
                <div>• Cross-account requires queue policy</div>
              </div>
            )}
            {selectedProtocol === "lambda" && (
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Auto-confirms in same account</div>
                <div>• Async invocation (up to 2 retries)</div>
                <div>• Can use destination for failures</div>
              </div>
            )}
            {selectedProtocol === "http" && (
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Requires confirmation via URL token</div>
                <div>• Configure delivery retry policy</div>
                <div>• Use HTTPS for security</div>
              </div>
            )}
            {selectedProtocol === "email" && (
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Requires email confirmation</div>
                <div>• Plain text or JSON format</div>
                <div>• No delivery guarantees</div>
              </div>
            )}
            {selectedProtocol === "sms" && (
              <div className="text-xs text-slate-300 space-y-1">
                <div>• No confirmation needed</div>
                <div>• Promotional or Transactional type</div>
                <div>• Spending limits apply</div>
              </div>
            )}
            {selectedProtocol === "firehose" && (
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Stream to S3, Redshift, OpenSearch</div>
                <div>• Batch and compress data</div>
                <div>• Near real-time delivery</div>
              </div>
            )}
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SQS/Lambda auto-confirm; HTTP/Email require manual confirmation</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Raw Message Delivery removes SNS wrapper metadata</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cross-account subscriptions require resource policies</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Up to 12.5M subscriptions per topic</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS FILTERING EXPLAINER (Medium)
// ============================================================================
export function SNSFilteringExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [orderType, setOrderType] = useState<"electronics" | "clothing" | "books">("electronics")

  const steps = [
    {
      title: "Message Filtering",
      description: "Subscribers can filter messages using filter policies. Only receive messages matching the policy."
    },
    {
      title: "Filter Policy",
      description: "JSON document matching message attributes. Supports exact match, prefix, numeric comparisons."
    },
    {
      title: "Filter Scope",
      description: "Filter on MessageAttributes (default) or MessageBody (for JSON body filtering)."
    },
    {
      title: "Cost Efficiency",
      description: "Filtering happens at SNS. Subscribers don&apos;t pay for filtered-out messages."
    }
  ]

  const subscriptions = [
    { name: "Electronics Queue", filter: "electronics", color: "bg-blue-500" },
    { name: "Clothing Queue", filter: "clothing", color: "bg-pink-500" },
    { name: "Books Queue", filter: "books", color: "bg-green-500" },
    { name: "All Orders Lambda", filter: null, color: "bg-orange-500" },
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Message Filtering</h1>
        <p className="text-slate-400">Route messages to specific subscribers</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Order Type Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setOrderType("electronics")} className={`px-4 py-2 rounded-lg ${orderType === "electronics" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Electronics</button>
          <button onClick={() => setOrderType("clothing")} className={`px-4 py-2 rounded-lg ${orderType === "clothing" ? "bg-pink-500 text-white" : "bg-slate-700 text-slate-300"}`}>Clothing</button>
          <button onClick={() => setOrderType("books")} className={`px-4 py-2 rounded-lg ${orderType === "books" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Books</button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center">
            {/* Message */}
            <div className="text-center">
              <div className={`rounded p-3 text-white ${orderType === "electronics" ? "bg-blue-500" : orderType === "clothing" ? "bg-pink-500" : "bg-green-500"}`}>
                <div className="text-xs">Order</div>
                <div className="text-sm font-medium">{orderType}</div>
              </div>
            </div>

            {/* Arrow to Topic */}
            <div className="text-slate-400 mx-4">→</div>

            {/* Topic */}
            <div className="bg-orange-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl">📢</div>
              <div className="text-xs">orders-topic</div>
            </div>

            {/* Arrows to Subscribers */}
            <div className="flex-1 mx-4">
              <div className="space-y-2">
                {subscriptions.map((sub, idx) => {
                  const matches = sub.filter === null || sub.filter === orderType
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`flex-1 h-0.5 ${matches ? "bg-green-500" : "bg-slate-600"}`} />
                      <div className={`rounded p-2 text-white text-xs ${matches ? sub.color : "bg-slate-600 opacity-50"}`}>
                        {sub.name}
                        {matches && <span className="ml-1">✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Filter Policy Example */}
          <div className="mt-6 p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">Filter Policy (Electronics Queue)</div>
            <pre className="text-xs text-green-400 font-mono">
{`{
  "category": ["electronics"]
}`}
            </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Filter policies are JSON matching message attributes</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Supports exact match, prefix, numeric comparisons, exists</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>No filter = receive all messages</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Filtering is free - reduces downstream costs</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS FANOUT PATTERN EXPLAINER (Medium)
// ============================================================================
export function SNSFanoutPatternExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messageCount, setMessageCount] = useState(1)

  const steps = [
    {
      title: "Fanout Pattern",
      description: "One SNS topic fans out messages to multiple SQS queues. Each queue processes independently."
    },
    {
      title: "Decoupling",
      description: "Publishers don&apos;t know about subscribers. Add/remove subscribers without changing publisher."
    },
    {
      title: "Parallel Processing",
      description: "Each subscriber processes the message independently. Great for microservices architecture."
    },
    {
      title: "Use Cases",
      description: "Order processing: inventory, payment, shipping all process same order simultaneously."
    }
  ]

  const queues = [
    { name: "Inventory Queue", icon: "📦", process: "Update stock" },
    { name: "Payment Queue", icon: "💳", process: "Charge card" },
    { name: "Shipping Queue", icon: "🚚", process: "Create label" },
    { name: "Email Queue", icon: "📧", process: "Send confirmation" },
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Fanout Pattern</h1>
        <p className="text-slate-400">One message to many subscribers</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Message Count Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Orders Published</label>
          <input type="range" min="1" max="5" value={messageCount} onChange={(e) => setMessageCount(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{messageCount} order(s)</div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center">
            {/* Publisher */}
            <div className="text-center">
              <div className="bg-green-500 rounded p-3 text-white">
                <div className="text-2xl">🛒</div>
                <div className="text-xs">Order Service</div>
              </div>
              <div className="mt-2 flex gap-1 justify-center">
                {Array.from({ length: messageCount }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-blue-500 rounded text-white text-[8px] flex items-center justify-center">{i+1}</div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-slate-400 mx-4 text-2xl">→</div>

            {/* SNS Topic */}
            <div className="bg-orange-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl">📢</div>
              <div className="text-xs">orders-topic</div>
            </div>

            {/* Fanout Arrows */}
            <div className="mx-4">
              <svg width="60" height="120" className="text-orange-500">
                <line x1="0" y1="60" x2="60" y2="15" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="60" x2="60" y2="40" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="60" x2="60" y2="80" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="60" x2="60" y2="105" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Queues */}
            <div className="space-y-2">
              {queues.map((q, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-purple-500 rounded p-2 text-white">
                    <div className="flex items-center gap-1">
                      <span>{q.icon}</span>
                      <span className="text-xs">{q.name}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">→ {q.process}</div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: messageCount }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-blue-500 rounded text-[6px] text-white flex items-center justify-center">{i+1}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-800 rounded p-2">
              <div className="text-2xl font-mono text-green-400">{messageCount}</div>
              <div className="text-xs text-slate-400">Messages Published</div>
            </div>
            <div className="bg-slate-800 rounded p-2">
              <div className="text-2xl font-mono text-orange-400">{queues.length}</div>
              <div className="text-xs text-slate-400">Subscribers</div>
            </div>
            <div className="bg-slate-800 rounded p-2">
              <div className="text-2xl font-mono text-purple-400">{messageCount * queues.length}</div>
              <div className="text-xs text-slate-400">Total Deliveries</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SNS + SQS fanout is a common pattern for decoupling</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Each subscriber independently processes messages</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SQS provides durability - messages persist until processed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Add subscribers without modifying publisher code</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS MESSAGE ATTRIBUTES EXPLAINER (Light)
// ============================================================================
export function SNSMessageAttributesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      title: "Message Attributes",
      description: "Metadata attached to SNS messages. Used for filtering, routing, and passing context to subscribers."
    },
    {
      title: "Attribute Structure",
      description: "Name, Type (String/Number/Binary/String.Array), Value. Up to 10 attributes per message."
    },
    {
      title: "Filter Policies",
      description: "Subscribers can filter by attributes. Only receive messages matching filter criteria."
    },
    {
      title: "Raw Delivery",
      description: "With raw delivery, attributes sent separately. Without, embedded in message body as JSON."
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Message Attributes</h1>
        <p className="text-slate-400">Metadata and filtering for SNS messages</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Message with Attributes</div>

          <div className="bg-slate-800 rounded p-3 mb-4">
            <div className="text-xs text-green-400 mb-2">Message Body</div>
            <pre className="text-xs text-slate-300 font-mono">{"{ \"event\": \"order_placed\", \"total\": 150 }"}</pre>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-blue-400 mb-2">Message Attributes</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">event_type</span>
                <span className="text-white">String: order</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">priority</span>
                <span className="text-white">Number: 1</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">customer_interests</span>
                <span className="text-white">String.Array: ["sports", "tech"]</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-purple-500/10 border border-purple-500 rounded p-3">
            <div className="text-xs text-purple-400 mb-2">Filter Policy Example</div>
            <pre className="text-xs text-purple-300 font-mono">{`{ "event_type": ["order", "refund"] }`}</pre>
            <div className="text-xs text-slate-400 mt-2">Only delivers if event_type is "order" or "refund"</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Up to 10 attributes per message</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Types: String, Number, Binary, String.Array</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Filter policies use attributes for routing</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Filtered messages don&apos;t incur delivery cost</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS DELIVERY POLICIES EXPLAINER (Medium)
// ============================================================================
export function SNSDeliveryPoliciesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const steps = [
    {
      title: "Delivery Policies",
      description: "Control how SNS retries failed HTTP/S deliveries. Configure retry delays, backoff, and max attempts."
    },
    {
      title: "Retry Phases",
      description: "Immediate retries (3), pre-backoff (2), backoff (10 with exponential delay), post-backoff (100,000)."
    },
    {
      title: "Custom Policies",
      description: "Customize per subscription: numRetries, minDelayTarget, maxDelayTarget, numNoDelayRetries."
    },
    {
      title: "DLQ for Failed Messages",
      description: "After all retries exhausted, send to SQS DLQ for investigation. Don&apos;t lose messages."
    }
  ]

  useEffect(() => {
    if (isPlaying && retryCount < 5) {
      const timer = setTimeout(() => setRetryCount(r => r + 1), 1500)
      return () => clearTimeout(timer)
    } else if (retryCount >= 5) {
      setIsPlaying(false)
    }
  }, [isPlaying, retryCount])

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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Delivery Policies</h1>
        <p className="text-slate-400">Retry behavior and failed delivery handling</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 rounded p-2 text-white text-xs">SNS</div>
            <div className="flex-1 mx-4">
              <div className="text-center text-xs text-slate-400 mb-1">Retry {retryCount}/5</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all" style={{ width: `${(retryCount/5)*100}%` }}></div>
              </div>
            </div>
            <div className={`rounded p-2 text-white text-xs ${retryCount >= 5 ? "bg-red-500" : "bg-slate-600"}`}>
              HTTP Endpoint
            </div>
          </div>

          <div className="text-sm text-slate-400 mb-3">Default HTTP/S Delivery Policy</div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Immediate</div>
              <div className="text-lg font-mono text-blue-400">3</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Pre-backoff</div>
              <div className="text-lg font-mono text-green-400">2</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Backoff</div>
              <div className="text-lg font-mono text-yellow-400">10</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Post-backoff</div>
              <div className="text-lg font-mono text-purple-400">100K</div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            Total retry duration: ~23 days for HTTP/S endpoints
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
        <button onClick={() => { setStep(0); setRetryCount(0); setIsPlaying(false) }} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>HTTP/S has extensive retry (~100,000 over 23 days)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Lambda and SQS have simpler retry (3 attempts)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use DLQ to capture failed deliveries</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Custom policies available for HTTP/S only</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS FIFO TOPICS EXPLAINER (Medium)
// ============================================================================
export function SNSFIFOTopicsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [topicType, setTopicType] = useState<"standard" | "fifo">("fifo")

  const steps = [
    {
      title: "FIFO Topics",
      description: "Strictly ordered message delivery. Messages delivered in exact order published within message group."
    },
    {
      title: "Message Deduplication",
      description: "5-minute deduplication window. Use MessageDeduplicationId or content-based deduplication."
    },
    {
      title: "Message Groups",
      description: "MessageGroupId for parallel processing. Messages in same group processed in order."
    },
    {
      title: "Supported Subscribers",
      description: "FIFO topics only support SQS FIFO queues as subscribers. Cannot use HTTP, Lambda, etc."
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS FIFO Topics</h1>
        <p className="text-slate-400">Ordered and deduplicated message delivery</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setTopicType("standard")} className={`px-4 py-2 rounded-lg ${topicType === "standard" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Standard</button>
          <button onClick={() => setTopicType("fifo")} className={`px-4 py-2 rounded-lg ${topicType === "fifo" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>FIFO</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${topicType === "standard" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Standard</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Best-effort ordering</li>
                <li>• At-least-once delivery</li>
                <li>• All subscriber types</li>
                <li>• High throughput</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${topicType === "fifo" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">FIFO</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Strict ordering</li>
                <li>• Exactly-once delivery</li>
                <li>• SQS FIFO only</li>
                <li>• 300 msg/sec</li>
              </ul>
            </div>
          </div>

          {topicType === "fifo" && (
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-400 mb-2">Message Flow (FIFO)</div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-xs">
                  <div className="bg-green-500 rounded px-2 py-1 text-white">Msg 1 (Group A)</div>
                  <div className="bg-green-500 rounded px-2 py-1 text-white">Msg 2 (Group A)</div>
                  <div className="bg-blue-500 rounded px-2 py-1 text-white">Msg 3 (Group B)</div>
                </div>
                <div className="text-2xl text-slate-400">→</div>
                <div className="bg-purple-500 rounded p-2 text-white text-xs text-center">
                  SNS FIFO<br/>.fifo
                </div>
                <div className="text-2xl text-slate-400">→</div>
                <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">
                  SQS FIFO<br/>.fifo
                </div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO topics only support SQS FIFO queues</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Topic name must end with .fifo</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>MessageGroupId for ordering, DeduplicationId for exactly-once</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>300 msg/sec throughput (vs unlimited for Standard)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS MOBILE PUSH EXPLAINER (Light)
// ============================================================================
export function SNSMobilePushExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [platform, setPlatform] = useState<"apns" | "fcm" | "adm">("apns")

  const steps = [
    {
      title: "Mobile Push",
      description: "Send push notifications to mobile devices via APNS (iOS), FCM (Android), and other platforms."
    },
    {
      title: "Platform Applications",
      description: "Create platform application per push service. Configure credentials from Apple/Google/Amazon."
    },
    {
      title: "Endpoints",
      description: "Each device token creates an endpoint. Publish to endpoint for direct push or topic for broadcast."
    },
    {
      title: "Message Format",
      description: "Platform-specific JSON payload. Use message structure for multi-platform with single publish."
    }
  ]

  const platforms = {
    apns: { name: "Apple Push (APNS)", color: "bg-slate-500", icon: "🍎" },
    fcm: { name: "Firebase Cloud Messaging", color: "bg-green-500", icon: "🔥" },
    adm: { name: "Amazon Device Messaging", color: "bg-orange-500", icon: "📱" }
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Mobile Push</h1>
        <p className="text-slate-400">Push notifications to mobile devices</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-2 mb-6">
          {Object.entries(platforms).map(([key, p]) => (
            <button key={key} onClick={() => setPlatform(key as typeof platform)} className={`px-3 py-2 rounded-lg ${platform === key ? p.color + " text-white" : "bg-slate-700 text-slate-300"}`}>
              {p.icon} {p.name.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 rounded p-2 text-white text-xs">SNS</div>
            <div className="text-slate-400">→</div>
            <div className={`${platforms[platform].color} rounded p-2 text-white text-xs`}>
              {platforms[platform].icon} {platforms[platform].name}
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-slate-600 rounded p-2 text-white text-xs">📱 Device</div>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Multi-Platform Message</div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`{
  "default": "New message!",
  "APNS": "{\\"aps\\":{\\"alert\\":\\"Hello iOS\\"}}",
  "GCM": "{\\"notification\\":{\\"title\\":\\"Hi Android\\"}}"
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Supports APNS, FCM, ADM, Baidu, WNS</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Platform application holds credentials</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Endpoint = device token mapping</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use message structure for multi-platform</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS SMS EXPLAINER (Light)
// ============================================================================
export function SNSSMSExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [smsType, setSmsType] = useState<"transactional" | "promotional">("transactional")

  const steps = [
    {
      title: "SMS Messaging",
      description: "Send text messages worldwide. No subscription needed - publish directly to phone numbers."
    },
    {
      title: "Message Types",
      description: "Transactional: critical (OTPs, alerts). Promotional: marketing. Different reliability/cost."
    },
    {
      title: "Spend Limits",
      description: "Account-level spending limits. Request increase via AWS Support. Prevents unexpected costs."
    },
    {
      title: "Sender ID",
      description: "Customize sender name (where supported). Some countries require registration."
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS SMS</h1>
        <p className="text-slate-400">Text messaging via SNS</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setSmsType("transactional")} className={`px-4 py-2 rounded-lg ${smsType === "transactional" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Transactional</button>
          <button onClick={() => setSmsType("promotional")} className={`px-4 py-2 rounded-lg ${smsType === "promotional" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Promotional</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${smsType === "transactional" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Transactional</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Critical messages</li>
                <li>• OTPs, alerts</li>
                <li>• Higher deliverability</li>
                <li>• Higher cost</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${smsType === "promotional" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Promotional</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Marketing messages</li>
                <li>• Non-critical info</li>
                <li>• Cost optimized</li>
                <li>• May be blocked</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">SMS Publish Example</div>
            <pre className="text-xs text-green-400 font-mono">
{`aws sns publish \\
  --phone-number "+1555123456" \\
  --message "Your OTP: 123456" \\
  --message-attributes '{
    "AWS.SNS.SMS.SMSType": {
      "DataType": "String",
      "StringValue": "${smsType === "transactional" ? "Transactional" : "Promotional"}"
    }
  }'`}
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Transactional for OTPs/alerts, Promotional for marketing</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>No subscription needed - direct publish to phone</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Account spending limits prevent unexpected costs</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Sender ID customization varies by country</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SNS DLQ EXPLAINER (Medium)
// ============================================================================
export function SNSDLQExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      title: "Dead Letter Queues",
      description: "Capture messages that SNS cannot deliver after all retries. SQS queue stores failed messages."
    },
    {
      title: "When Messages Go to DLQ",
      description: "Client errors (4xx), server errors (5xx) after retries, access denied, endpoint deleted."
    },
    {
      title: "Configuration",
      description: "Set RedrivePolicy on subscription. Specify SQS queue ARN. Queue needs proper permissions."
    },
    {
      title: "Monitoring",
      description: "CloudWatch metrics for DLQ. Set alarms on queue depth. Investigate and reprocess failed messages."
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
        <h1 className="text-2xl font-bold text-white mb-2">SNS Dead Letter Queues</h1>
        <p className="text-slate-400">Capturing failed message deliveries</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 rounded p-2 text-white text-xs">SNS Topic</div>
            <div className="flex-1 mx-2">
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400">Success</div>
                <div className="text-xs text-red-400">Fail after retries</div>
              </div>
              <div className="flex gap-1 mt-1">
                <div className="flex-1 h-1 bg-green-500 rounded"></div>
                <div className="w-1/4 h-1 bg-red-500 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="bg-green-500 rounded px-2 py-1 text-white text-xs">✓ Subscriber</div>
              <div className="bg-red-500 rounded px-2 py-1 text-white text-xs">✗ Failed</div>
            </div>
          </div>

          <div className="flex justify-center my-4">
            <div className="text-2xl">⬇️</div>
          </div>

          <div className="flex justify-center">
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-xl">📥</div>
              <div className="text-xs">SQS DLQ</div>
              <div className="text-xs opacity-75">Failed Messages</div>
            </div>
          </div>

          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">DLQ Message Metadata</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">ErrorCode</span>
                <span className="text-red-400">AccessDenied</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">EndpointArn</span>
                <span className="text-slate-300">arn:aws:sqs:...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NumberOfRetries</span>
                <span className="text-yellow-400">3</span>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Configure per subscription, not per topic</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>DLQ must be SQS (Standard or FIFO)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Messages include error metadata</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Set CloudWatch alarms on DLQ depth</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const snsExplainers = {
  "sns-topics": SNSTopicsExplainer,
  "sns-subscriptions": SNSSubscriptionsExplainer,
  "sns-filtering": SNSFilteringExplainer,
  "sns-fanout-pattern": SNSFanoutPatternExplainer,
  "sns-message-attributes": SNSMessageAttributesExplainer,
  "sns-delivery-policies": SNSDeliveryPoliciesExplainer,
  "sns-fifo-topics": SNSFIFOTopicsExplainer,
  "sns-mobile-push": SNSMobilePushExplainer,
  "sns-sms": SNSSMSExplainer,
  "sns-dlq": SNSDLQExplainer,
}
