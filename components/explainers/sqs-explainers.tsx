"use client"

import { useState, useEffect } from "react"
import { useExplainerPlayback } from "@/hooks/use-explainer-playback"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// SQS VISIBILITY TIMEOUT EXPLAINER (Rich)
// ============================================================================
export function SQSVisibilityTimeoutExplainer() {


  const [visibilityTimeout, setVisibilityTimeout] = useState(30)
  const [processingTime, setProcessingTime] = useState(20)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const steps = [
    {
      title: "What is Visibility Timeout?",
      description: "Period during which a message is hidden from other consumers after being received. Prevents duplicate processing."
    },
    {
      title: "Message Lifecycle",
      description: "Consumer receives message → message becomes invisible → consumer processes → consumer deletes message."
    },
    {
      title: "Timeout Too Short",
      description: "If processing takes longer than visibility timeout, message becomes visible again and may be processed twice."
    },
    {
      title: "Best Practices",
      description: "Set timeout > expected processing time. Use ChangeMessageVisibility API to extend if needed."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const messageVisible = timeElapsed === 0 || timeElapsed > visibilityTimeout
  const processing = timeElapsed > 0 && timeElapsed <= processingTime
  const processed = timeElapsed > processingTime && timeElapsed <= visibilityTimeout



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Visibility Timeout</h1>
        <p className="text-slate-400">Preventing duplicate message processing</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Visibility Timeout (s)</label>
            <input type="range" min="10" max="60" value={visibilityTimeout} onChange={(e) => setVisibilityTimeout(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{visibilityTimeout}s</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Processing Time (s)</label>
            <input type="range" min="5" max="60" value={processingTime} onChange={(e) => setProcessingTime(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{processingTime}s</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Time Elapsed (s)</label>
            <input type="range" min="0" max="70" value={timeElapsed} onChange={(e) => setTimeElapsed(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{timeElapsed}s</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Queue */}
            <div className="text-center">
              <div className={`rounded p-4 text-white ${messageVisible ? "bg-purple-500" : "bg-slate-600"}`}>
                <div className="text-2xl">📬</div>
                <div className="text-xs">SQS Queue</div>
              </div>
              <div className={`text-xs mt-1 ${messageVisible ? "text-green-400" : "text-slate-500"}`}>
                {messageVisible ? "Message Visible" : "Message Hidden"}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-slate-400">→</div>

            {/* Consumer */}
            <div className="text-center">
              <div className={`rounded p-4 text-white ${processing ? "bg-orange-500 animate-pulse" : processed ? "bg-green-500" : "bg-slate-600"}`}>
                <div className="text-2xl">⚙️</div>
                <div className="text-xs">Consumer</div>
              </div>
              <div className="text-xs mt-1 text-slate-400">
                {processing ? "Processing..." : processed ? "Done!" : "Waiting"}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6">
            <div className="relative h-8 bg-slate-700 rounded">
              {/* Visibility window */}
              <div className="absolute top-0 left-0 h-full bg-red-500/30" style={{ width: `${(visibilityTimeout / 70) * 100}%` }}>
                <span className="absolute right-1 top-1 text-xs text-red-400">invisible</span>
              </div>
              {/* Processing time */}
              <div className="absolute top-0 left-0 h-full bg-green-500/30" style={{ width: `${(processingTime / 70) * 100}%` }}>
                <span className="absolute left-1 top-1 text-xs text-green-400">processing</span>
              </div>
              {/* Current position */}
              <div className="absolute top-0 w-1 h-full bg-white" style={{ left: `${(timeElapsed / 70) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0s</span>
              <span>70s</span>
            </div>
          </div>

          {/* Status */}
          <div className={`mt-4 p-3 rounded text-center ${
            processingTime > visibilityTimeout ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
          }`}>
            {processingTime > visibilityTimeout
              ? "⚠️ Processing time exceeds visibility timeout - message will be processed twice!"
              : "✓ Configuration is safe - message will be deleted before timeout"}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Default: 30 seconds, Max: 12 hours</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Set at queue level or per-message with ReceiveMessage</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use ChangeMessageVisibility to extend timeout mid-processing</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Always set timeout &gt; expected processing time</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS STANDARD VS FIFO EXPLAINER (Rich)
// ============================================================================
export function SQSStandardVsFIFOExplainer() {


  const [queueType, setQueueType] = useState<"standard" | "fifo">("standard")

  const steps = [
    {
      title: "Queue Types",
      description: "Standard queues offer maximum throughput. FIFO queues guarantee order and exactly-once processing."
    },
    {
      title: "Standard Queue",
      description: "Best-effort ordering, at-least-once delivery. Nearly unlimited throughput. May deliver duplicates."
    },
    {
      title: "FIFO Queue",
      description: "First-In-First-Out ordering, exactly-once processing. 3,000 msg/sec with batching, 300 without."
    },
    {
      title: "Choosing a Queue",
      description: "Standard: high throughput, order not critical. FIFO: order matters, exactly-once required."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Standard vs FIFO</h1>
        <p className="text-slate-400">Choosing the right queue type</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Queue Type Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setQueueType("standard")} className={`px-4 py-2 rounded-lg ${queueType === "standard" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Standard</button>
          <button onClick={() => setQueueType("fifo")} className={`px-4 py-2 rounded-lg ${queueType === "fifo" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>FIFO</button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Producer */}
            <div className="text-center">
              <div className="bg-green-500 rounded p-3 text-white">
                <div className="text-2xl">📤</div>
                <div className="text-xs">Producer</div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">1</div>
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">2</div>
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">3</div>
              </div>
            </div>

            {/* Queue */}
            <div className="flex-1 mx-4">
              <div className={`rounded-lg p-4 ${queueType === "standard" ? "bg-blue-500/20 border border-blue-500" : "bg-purple-500/20 border border-purple-500"}`}>
                <div className="text-center text-sm mb-2">
                  {queueType === "standard" ? "Standard Queue" : "my-queue.fifo"}
                </div>
                <div className="flex justify-center gap-1">
                  {queueType === "standard" ? (
                    <>
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">2</div>
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">1</div>
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">3</div>
                      <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">2</div>
                    </>
                  ) : (
                    <>
                      <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">1</div>
                      <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">2</div>
                      <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">3</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Consumer */}
            <div className="text-center">
              <div className="bg-orange-500 rounded p-3 text-white">
                <div className="text-2xl">📥</div>
                <div className="text-xs">Consumer</div>
              </div>
              <div className="mt-2 space-y-1">
                {queueType === "standard" ? (
                  <>
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">2 ⚠️</div>
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">1</div>
                  </>
                ) : (
                  <>
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">1</div>
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">2</div>
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
                  <th className="text-left p-2">Standard</th>
                  <th className="text-left p-2">FIFO</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="p-2">Throughput</td>
                  <td className="p-2 text-blue-400">Unlimited</td>
                  <td className="p-2 text-purple-400">3,000/sec (batched)</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="p-2">Ordering</td>
                  <td className="p-2 text-blue-400">Best-effort</td>
                  <td className="p-2 text-purple-400">Strict FIFO</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="p-2">Delivery</td>
                  <td className="p-2 text-blue-400">At-least-once</td>
                  <td className="p-2 text-purple-400">Exactly-once</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="p-2">Duplicates</td>
                  <td className="p-2 text-yellow-400">Possible</td>
                  <td className="p-2 text-green-400">No (deduplication)</td>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO queue names MUST end with .fifo</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO uses MessageDeduplicationId for exactly-once</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO MessageGroupId determines ordering scope</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Standard: banking notifications. FIFO: order processing</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS DLQ EXPLAINER (Medium)
// ============================================================================
export function SQSDLQExplainer() {


  const [maxReceives, setMaxReceives] = useState(3)
  const [receiveCount, setReceiveCount] = useState(0)

  const steps = [
    {
      title: "What is a DLQ?",
      description: "Dead-Letter Queue stores messages that couldn't be processed after multiple attempts. Isolates problem messages."
    },
    {
      title: "Redrive Policy",
      description: "Configure max receive count. After that many failed attempts, message moves to DLQ automatically."
    },
    {
      title: "Investigating Failures",
      description: "Check DLQ for failed messages. Analyze, fix code, then redrive messages back to source queue."
    },
    {
      title: "DLQ Redrive",
      description: "Move messages from DLQ back to source queue after fixing the issue. Available in console and API."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const inDLQ = receiveCount >= maxReceives



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Dead-Letter Queues</h1>
        <p className="text-slate-400">Handling failed message processing</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Max Receive Count</label>
            <input type="range" min="1" max="10" value={maxReceives} onChange={(e) => setMaxReceives(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{maxReceives}</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Message Receive Count</label>
            <input type="range" min="0" max="10" value={receiveCount} onChange={(e) => setReceiveCount(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{receiveCount}</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Source Queue */}
            <div className="text-center">
              <div className={`rounded p-4 text-white ${inDLQ ? "bg-slate-600" : "bg-purple-500"}`}>
                <div className="text-2xl">📬</div>
                <div className="text-xs">Source Queue</div>
              </div>
              <div className="mt-2">
                {!inDLQ && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded inline-block">
                    📧 (attempt {receiveCount + 1}/{maxReceives})
                  </div>
                )}
              </div>
            </div>

            {/* Consumer (failing) */}
            <div className="text-center">
              <div className="bg-red-500 rounded p-4 text-white">
                <div className="text-2xl">💥</div>
                <div className="text-xs">Consumer</div>
                <div className="text-xs opacity-75">Failing!</div>
              </div>
            </div>

            {/* Arrow to DLQ */}
            <div className={`text-2xl ${inDLQ ? "text-red-400" : "text-slate-600"}`}>
              {inDLQ ? "→→→" : "···"}
            </div>

            {/* DLQ */}
            <div className="text-center">
              <div className={`rounded p-4 text-white ${inDLQ ? "bg-red-500" : "bg-slate-700"}`}>
                <div className="text-2xl">☠️</div>
                <div className="text-xs">Dead-Letter Queue</div>
              </div>
              <div className="mt-2">
                {inDLQ && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded inline-block">
                    📧 Failed Message
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Receive attempts</span>
              <span className="text-xs text-slate-400">{receiveCount} / {maxReceives}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded mt-1">
              <div
                className={`h-full rounded transition-all ${inDLQ ? "bg-red-500" : "bg-yellow-500"}`}
                style={{ width: `${(receiveCount / maxReceives) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs mt-1">
              {inDLQ ? (
                <span className="text-red-400">Message moved to DLQ after {maxReceives} failed attempts</span>
              ) : (
                <span className="text-yellow-400">{maxReceives - receiveCount} attempts remaining</span>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>DLQ must be same type as source (Standard→Standard, FIFO→FIFO)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Set DLQ retention &gt; source queue for debugging time</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use CloudWatch alarm on DLQ messages for alerting</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Redrive feature moves messages back to source queue</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS LONG POLLING EXPLAINER (Medium)
// ============================================================================
export function SQSLongPollingExplainer() {


  const [pollingType, setPollingType] = useState<"short" | "long">("long")
  const [waitTime, setWaitTime] = useState(20)

  const steps = [
    {
      title: "Short vs Long Polling",
      description: "Short polling returns immediately even if queue is empty. Long polling waits for messages."
    },
    {
      title: "Long Polling Benefits",
      description: "Reduces empty responses, lowers cost, reduces API calls. Set WaitTimeSeconds 1-20."
    },
    {
      title: "Cost Impact",
      description: "Each ReceiveMessage API call costs money. Long polling dramatically reduces calls on low-traffic queues."
    },
    {
      title: "Configuration",
      description: "Set at queue level (ReceiveMessageWaitTimeSeconds) or per-request (WaitTimeSeconds parameter)."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Long Polling</h1>
        <p className="text-slate-400">Reducing costs and empty responses</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setPollingType("short")} className={`px-4 py-2 rounded-lg ${pollingType === "short" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Short Polling</button>
          <button onClick={() => setPollingType("long")} className={`px-4 py-2 rounded-lg ${pollingType === "long" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Long Polling</button>
        </div>

        {pollingType === "long" && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
            <label className="text-sm text-slate-400 block mb-2">Wait Time (seconds)</label>
            <input type="range" min="1" max="20" value={waitTime} onChange={(e) => setWaitTime(Number(e.target.value))} className="w-full" />
            <div className="text-center text-white font-mono mt-1">{waitTime}s</div>
          </div>
        )}

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Short Polling */}
            <div className={`p-4 rounded-lg ${pollingType === "short" ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-center mb-3">Short Polling</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span>Request 1</span>
                  <span className="text-red-400">Empty ✗</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span>Request 2</span>
                  <span className="text-red-400">Empty ✗</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span>Request 3</span>
                  <span className="text-red-400">Empty ✗</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-500/20 rounded">
                  <span>Request 4</span>
                  <span className="text-green-400">Message ✓</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-center text-slate-400">
                4 API calls, 3 empty responses
              </div>
            </div>

            {/* Long Polling */}
            <div className={`p-4 rounded-lg ${pollingType === "long" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-center mb-3">Long Polling</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span>Request 1</span>
                  <span className="text-yellow-400">Waiting... ({waitTime}s)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-500/20 rounded">
                  <span>→ Returns</span>
                  <span className="text-green-400">Message ✓</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-center text-slate-400">
                1 API call, 0 empty responses
              </div>
            </div>
          </div>

          {/* Cost Comparison */}
          <div className="mt-6 p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">Cost Comparison (1000 messages, arriving slowly)</div>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="text-red-400 font-mono">~10,000 API calls</div>
                <div className="text-xs text-slate-500">Short Polling</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-mono">~1,000 API calls</div>
                <div className="text-xs text-slate-500">Long Polling</div>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Long polling: WaitTimeSeconds 1-20 seconds</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Reduces API calls and costs on low-traffic queues</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Set at queue level or per ReceiveMessage request</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Returns immediately when messages available</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS BATCHING EXPLAINER (Light)
// ============================================================================
export function SQSBatchingExplainer() {


  const [batchSize, setBatchSize] = useState(10)

  const steps = [
    {
      title: "Batch Operations",
      description: "SendMessageBatch, DeleteMessageBatch, ChangeMessageVisibilityBatch - up to 10 messages per API call."
    },
    {
      title: "Cost Savings",
      description: "One API call for 10 messages vs 10 separate calls. 90% reduction in API costs."
    },
    {
      title: "Lambda Integration",
      description: "Lambda can receive batches of SQS messages. Configure batch size (1-10000) and batch window."
    },
    {
      title: "Error Handling",
      description: "Batch operations return per-message success/failure. Handle partial failures appropriately."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  const apiCallsNoBatch = batchSize
  const apiCallsBatch = 1

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Batching</h1>
        <p className="text-slate-400">Reducing costs with batch operations</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Batch Size Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Messages to Send</label>
          <input type="range" min="1" max="10" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{batchSize} messages</div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Without Batching */}
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="text-sm font-medium text-center mb-3 text-red-400">Without Batching</div>
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {Array.from({ length: batchSize }).map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-red-400">{apiCallsNoBatch}</div>
                <div className="text-xs text-slate-400">API calls</div>
              </div>
            </div>

            {/* With Batching */}
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="text-sm font-medium text-center mb-3 text-green-400">With Batching</div>
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-green-500/20 rounded border border-green-500 flex flex-wrap gap-1 max-w-32">
                  {Array.from({ length: batchSize }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-[8px]">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-green-400">{apiCallsBatch}</div>
                <div className="text-xs text-slate-400">API call</div>
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="mt-4 p-3 bg-slate-800 rounded text-center">
            <span className="text-green-400 font-mono text-lg">
              {Math.round(((apiCallsNoBatch - apiCallsBatch) / apiCallsNoBatch) * 100)}% fewer API calls
            </span>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Exam Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Maximum 10 messages per batch API call</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Total batch size max 256 KB</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Lambda batch size: 1-10,000 messages</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Handle partial batch failures in response</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS DELAY QUEUES EXPLAINER (Light)
// ============================================================================
export function SQSDelayQueuesExplainer() {


  const [delaySeconds, setDelaySeconds] = useState(300)

  const steps = [
    {
      title: "Delay Queues",
      description: "Postpone delivery of new messages. Messages invisible to consumers for delay period after being sent."
    },
    {
      title: "Queue-Level Delay",
      description: "Set DelaySeconds on queue (0-900 seconds). All messages inherit this delay automatically."
    },
    {
      title: "Per-Message Delay",
      description: "Override queue delay with DelaySeconds parameter when sending. Standard queues only."
    },
    {
      title: "Use Cases",
      description: "Rate limiting, scheduled processing, waiting for dependencies, retry backoff patterns."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Delay Queues</h1>
        <p className="text-slate-400">Postponing message delivery</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Delay Seconds</label>
          <input type="range" min="0" max="900" value={delaySeconds} onChange={(e) => setDelaySeconds(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{delaySeconds}s ({Math.floor(delaySeconds/60)}m {delaySeconds%60}s)</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded p-2 text-white text-xs">Producer</div>
            <div className="text-slate-400">→</div>
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-xl">📨</div>
              <div className="text-xs">SQS</div>
            </div>
            <div className="flex-1 mx-2 relative">
              <div className="h-0.5 bg-slate-600"></div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-yellow-400">
                ⏱️ {delaySeconds}s delay
              </div>
            </div>
            <div className="bg-green-500 rounded p-2 text-white text-xs">Consumer</div>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Timeline</div>
            <div className="h-6 bg-slate-700 rounded-full relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-yellow-500/30" style={{ width: `${(delaySeconds/900)*100}%` }}></div>
              <div className="absolute right-0 top-0 bottom-0 bg-green-500/30" style={{ width: `${100 - (delaySeconds/900)*100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Send</span>
              <span className="text-yellow-400">Delayed ({delaySeconds}s)</span>
              <span className="text-green-400">Visible</span>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Maximum delay: 900 seconds (15 minutes)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Queue-level vs per-message delay</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>FIFO queues don&apos;t support per-message delay</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Different from visibility timeout (post-receive)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS MESSAGE ATTRIBUTES EXPLAINER (Light)
// ============================================================================
export function SQSMessageAttributesExplainer() {



  const steps = [
    {
      title: "Message Attributes",
      description: "Custom metadata attached to messages. Up to 10 attributes per message. Not part of message body."
    },
    {
      title: "Attribute Structure",
      description: "Name (256 chars), Type (String/Number/Binary), Value. System attributes are read-only."
    },
    {
      title: "Use Cases",
      description: "Message routing, filtering (with SNS), tracking correlation IDs, content type hints."
    },
    {
      title: "System Attributes",
      description: "AWS-provided: ApproximateReceiveCount, SentTimestamp, SenderId, MessageDeduplicationId."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Message Attributes</h1>
        <p className="text-slate-400">Custom metadata for SQS messages</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Message Structure</div>

          <div className="bg-slate-800 rounded p-3 mb-4">
            <div className="text-xs text-green-400 mb-2">Message Body</div>
            <pre className="text-xs text-slate-300 font-mono">{"{ \"orderId\": \"12345\", \"amount\": 99.99 }"}</pre>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-blue-400 mb-2">Message Attributes (up to 10)</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">ContentType</span>
                <span className="text-white">String: application/json</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Priority</span>
                <span className="text-white">Number: 1</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">TraceId</span>
                <span className="text-white">String: abc-123-xyz</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-purple-400 mb-2">System Attributes (read-only)</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">ApproximateReceiveCount</span>
                <span className="text-slate-300">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">SentTimestamp</span>
                <span className="text-slate-300">1702659600000</span>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Maximum 10 message attributes per message</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Types: String, Number, Binary (and custom types)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Count toward 256 KB message size limit</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Used for SNS filtering when SQS subscribes</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS LAMBDA INTEGRATION EXPLAINER (Medium)
// ============================================================================
export function SQSLambdaIntegrationExplainer() {


  const [batchSize, setBatchSize] = useState(10)

  const steps = [
    {
      title: "Event Source Mapping",
      description: "Lambda polls SQS automatically. No need to write polling code. Scales based on queue depth."
    },
    {
      title: "Batch Configuration",
      description: "Batch size 1-10,000 messages. Batch window up to 5 minutes. Lambda receives array of messages."
    },
    {
      title: "Error Handling",
      description: "Failed batches return to queue. ReportBatchItemFailures for partial success. Configure DLQ."
    },
    {
      title: "Scaling Behavior",
      description: "Starts with 5 concurrent batches, scales up to 1,000. FIFO: scales by message group."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS + Lambda Integration</h1>
        <p className="text-slate-400">Event source mapping for serverless processing</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Batch Size</label>
          <input type="range" min="1" max="100" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{batchSize} messages/batch</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 rounded p-3 text-white text-center">
              <div className="text-xl">📨</div>
              <div className="text-xs">SQS</div>
              <div className="text-xs opacity-75">100 msgs</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="text-center text-sm text-blue-400 mb-1">Event Source Mapping</div>
              <div className="h-0.5 bg-blue-500"></div>
              <div className="text-xs text-slate-400 text-center mt-1">Polls automatically</div>
            </div>
            <div className="bg-orange-400 rounded p-3 text-white text-center">
              <div className="text-xl">λ</div>
              <div className="text-xs">Lambda</div>
              <div className="text-xs opacity-75">{batchSize}/batch</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Batch Size</div>
              <div className="text-lg font-mono text-blue-400">{batchSize}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Concurrent</div>
              <div className="text-lg font-mono text-green-400">{Math.ceil(100/batchSize)}</div>
            </div>
            <div className="bg-slate-800 rounded p-3 text-center">
              <div className="text-xs text-slate-400">Max Scaling</div>
              <div className="text-lg font-mono text-purple-400">1000</div>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Lambda polls SQS - no manual polling needed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Batch size: 1-10,000, batch window up to 5 min</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>ReportBatchItemFailures for partial success</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Scales to 1,000 concurrent batch processors</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS MESSAGE RETENTION EXPLAINER (Light)
// ============================================================================
export function SQSMessageRetentionExplainer() {


  const [retentionDays, setRetentionDays] = useState(4)

  const steps = [
    {
      title: "Message Retention",
      description: "How long SQS keeps messages. Default 4 days. Range: 1 minute to 14 days."
    },
    {
      title: "Lifecycle",
      description: "Message sent → available → received → visibility timeout → available again or deleted."
    },
    {
      title: "Expiration",
      description: "After retention period, messages deleted automatically. Cannot be recovered."
    },
    {
      title: "Considerations",
      description: "Longer retention = more storage cost. Too short = lost messages. Balance with DLQ strategy."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Message Retention</h1>
        <p className="text-slate-400">Message lifecycle and expiration</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Retention Period</label>
          <input type="range" min="1" max="14" value={retentionDays} onChange={(e) => setRetentionDays(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{retentionDays} days</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Message Timeline</div>

          <div className="relative h-12 bg-slate-800 rounded mb-4">
            <div className="absolute left-0 top-0 bottom-0 bg-green-500/30 rounded-l" style={{ width: `${(retentionDays/14)*100}%` }}></div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <div className="absolute top-0 bottom-0 w-1 bg-red-500" style={{ left: `${(retentionDays/14)*100}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
              {retentionDays} days retention
            </div>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-green-400">Message Sent</span>
            <span className="text-slate-400">{retentionDays} days</span>
            <span className="text-red-400">Auto-deleted</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Minimum</div>
              <div className="text-sm text-white">1 minute</div>
            </div>
            <div className={`rounded p-2 text-center ${retentionDays === 4 ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-xs text-slate-400">Default</div>
              <div className="text-sm text-white">4 days</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Maximum</div>
              <div className="text-sm text-white">14 days</div>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Range: 1 minute to 14 days (default 4 days)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Messages auto-deleted after retention expires</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cannot recover deleted messages</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use DLQ for messages that fail repeatedly</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SQS SECURITY EXPLAINER (Medium)
// ============================================================================
export function SQSSecurityExplainer() {


  const [encryptionType, setEncryptionType] = useState<"sse-sqs" | "sse-kms">("sse-sqs")

  const steps = [
    {
      title: "Encryption at Rest",
      description: "SSE-SQS (AWS managed) or SSE-KMS (customer managed keys). All messages encrypted automatically."
    },
    {
      title: "Encryption in Transit",
      description: "HTTPS endpoints only. TLS encrypts data between clients and SQS service."
    },
    {
      title: "Access Control",
      description: "IAM policies, SQS resource policies, VPC endpoints for private access. No public queues by default."
    },
    {
      title: "Cross-Account Access",
      description: "Use resource-based policies to grant access to other accounts. Principal specifies the account/role."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SQS Security</h1>
        <p className="text-slate-400">Encryption and access control</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setEncryptionType("sse-sqs")} className={`px-4 py-2 rounded-lg ${encryptionType === "sse-sqs" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>SSE-SQS</button>
          <button onClick={() => setEncryptionType("sse-kms")} className={`px-4 py-2 rounded-lg ${encryptionType === "sse-kms" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>SSE-KMS</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${encryptionType === "sse-sqs" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">SSE-SQS</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• AWS managed keys</li>
                <li>• No additional cost</li>
                <li>• No key management</li>
                <li>• Automatic rotation</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${encryptionType === "sse-kms" ? "bg-purple-500/20 border border-purple-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">SSE-KMS</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Customer managed keys</li>
                <li>• KMS API costs</li>
                <li>• Audit key usage</li>
                <li>• Custom rotation</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Security Layers</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-xs">✓</div>
                <span className="text-sm text-white">Encryption at Rest ({encryptionType.toUpperCase()})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-xs">✓</div>
                <span className="text-sm text-white">Encryption in Transit (HTTPS/TLS)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-xs">✓</div>
                <span className="text-sm text-white">IAM Access Control</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-xs">?</div>
                <span className="text-sm text-white">VPC Endpoints (optional)</span>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SSE-SQS: free, managed. SSE-KMS: audit, custom keys</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Always encrypted in transit (HTTPS required)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Resource policies for cross-account access</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>VPC endpoints for private network access</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const sqsExplainers = {
  "sqs-visibility-timeout": SQSVisibilityTimeoutExplainer,
  "sqs-standard-vs-fifo": SQSStandardVsFIFOExplainer,
  "sqs-dlq": SQSDLQExplainer,
  "sqs-long-polling": SQSLongPollingExplainer,
  "sqs-batching": SQSBatchingExplainer,
  "sqs-delay-queues": SQSDelayQueuesExplainer,
  "sqs-message-attributes": SQSMessageAttributesExplainer,
  "sqs-lambda-integration": SQSLambdaIntegrationExplainer,
  "sqs-message-retention": SQSMessageRetentionExplainer,
  "sqs-security": SQSSecurityExplainer,
}
