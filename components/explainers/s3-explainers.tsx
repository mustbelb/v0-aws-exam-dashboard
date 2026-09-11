"use client"

import { useState, useEffect } from "react"
import { useExplainerPlayback } from "@/hooks/use-explainer-playback"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// S3 STORAGE CLASSES EXPLAINER (Rich)
// ============================================================================
export function S3StorageClassesExplainer() {


  const [selectedClass, setSelectedClass] = useState("standard")

  const steps = [
    {
      title: "Storage Class Overview",
      description: "S3 offers multiple storage classes optimized for different access patterns and cost requirements."
    },
    {
      title: "Standard & Intelligent-Tiering",
      description: "Standard for frequent access. Intelligent-Tiering auto-moves objects between tiers based on access patterns."
    },
    {
      title: "Infrequent Access Tiers",
      description: "Standard-IA and One Zone-IA for less frequent access. Lower storage cost but retrieval fees apply."
    },
    {
      title: "Archive Tiers",
      description: "Glacier Instant, Flexible, and Deep Archive for long-term storage. Lowest cost, retrieval times vary."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const storageClasses = [
    { id: "standard", name: "Standard", cost: 0.023, retrieval: "ms", durability: "11 9s", availability: "99.99%", useCase: "Frequent access" },
    { id: "intelligent", name: "Intelligent-Tiering", cost: 0.023, retrieval: "ms", durability: "11 9s", availability: "99.9%", useCase: "Unknown/changing patterns" },
    { id: "standard-ia", name: "Standard-IA", cost: 0.0125, retrieval: "ms", durability: "11 9s", availability: "99.9%", useCase: "Infrequent, quick access" },
    { id: "onezone-ia", name: "One Zone-IA", cost: 0.01, retrieval: "ms", durability: "11 9s", availability: "99.5%", useCase: "Recreatable data" },
    { id: "glacier-instant", name: "Glacier Instant", cost: 0.004, retrieval: "ms", durability: "11 9s", availability: "99.9%", useCase: "Archive, instant access" },
    { id: "glacier-flexible", name: "Glacier Flexible", cost: 0.0036, retrieval: "1-12 hrs", durability: "11 9s", availability: "99.99%", useCase: "Archive, flexible retrieval" },
    { id: "glacier-deep", name: "Glacier Deep Archive", cost: 0.00099, retrieval: "12-48 hrs", durability: "11 9s", availability: "99.99%", useCase: "Long-term archive" },
  ]

  const selected = storageClasses.find(c => c.id === selectedClass)!



  useEffect(() => {
    const classByStep = ["standard", "intelligent", "standard-ia", "glacier-instant"]
    if (classByStep[step]) setSelectedClass(classByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Storage Classes</h1>
        <p className="text-slate-400">Optimizing cost and performance for different access patterns</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Storage Class Selector */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {storageClasses.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedClass(sc.id)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                selectedClass === sc.id ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>

        {/* Selected Class Details */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white">{selected.name}</h3>
            <p className="text-sm text-slate-400">{selected.useCase}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400">Cost/GB/Month</div>
              <div className="text-lg font-mono text-green-400">${selected.cost}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400">Retrieval Time</div>
              <div className="text-lg font-mono text-blue-400">{selected.retrieval}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400">Durability</div>
              <div className="text-lg font-mono text-purple-400">{selected.durability}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400">Availability</div>
              <div className="text-lg font-mono text-orange-400">{selected.availability}</div>
            </div>
          </div>

          {/* Cost Comparison Bar */}
          <div className="mt-6">
            <div className="text-xs text-slate-400 mb-2">Relative Cost (Standard = 100%)</div>
            <div className="space-y-1">
              {storageClasses.map((sc) => (
                <div key={sc.id} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-32 truncate">{sc.name}</span>
                  <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${sc.id === selectedClass ? "bg-blue-500" : "bg-slate-600"}`}
                      style={{ width: `${(sc.cost / 0.023) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-12">{Math.round((sc.cost / 0.023) * 100)}%</span>
                </div>
              ))}
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>All classes have 11 9&apos;s (99.999999999%) durability</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>One Zone-IA stores in single AZ - lower availability, lower cost</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Intelligent-Tiering has monitoring fee but no retrieval fees</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Glacier Deep Archive: cheapest, 12-48 hour retrieval</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 LIFECYCLE EXPLAINER (Medium)
// ============================================================================
export function S3LifecycleExplainer() {


  const [daysSinceCreation, setDaysSinceCreation] = useState(0)

  const steps = [
    {
      title: "Lifecycle Rules",
      description: "Automate transitioning objects between storage classes or deleting them after a period."
    },
    {
      title: "Transition Actions",
      description: "Move objects to cheaper storage classes after specified days. Common: Standard → IA → Glacier."
    },
    {
      title: "Expiration Actions",
      description: "Automatically delete objects or old versions after specified days."
    },
    {
      title: "Filters & Scope",
      description: "Apply rules to entire bucket, prefix, or objects with specific tags."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const getStorageClass = (days: number) => {
    if (days >= 365) return { name: "Glacier Deep Archive", color: "bg-purple-500" }
    if (days >= 90) return { name: "Glacier Flexible", color: "bg-blue-500" }
    if (days >= 30) return { name: "Standard-IA", color: "bg-green-500" }
    return { name: "Standard", color: "bg-orange-500" }
  }

  const currentClass = getStorageClass(daysSinceCreation)



  useEffect(() => {
    const daysByStep = [0, 60, 120, 365]
    if (daysByStep[step] !== undefined) setDaysSinceCreation(daysByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Lifecycle Policies</h1>
        <p className="text-slate-400">Automating storage class transitions and expiration</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Day Slider */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Days Since Object Creation</label>
          <input
            type="range"
            min="0"
            max="400"
            value={daysSinceCreation}
            onChange={(e) => setDaysSinceCreation(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-white font-mono mt-1">{daysSinceCreation} days</div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="relative">
            {/* Timeline */}
            <div className="h-2 bg-slate-700 rounded-full mb-4">
              <div
                className={`h-full rounded-full transition-all ${currentClass.color}`}
                style={{ width: `${Math.min(100, (daysSinceCreation / 400) * 100)}%` }}
              />
            </div>

            {/* Markers */}
            <div className="flex justify-between text-xs text-slate-400 mb-4">
              <span>Day 0</span>
              <span>Day 30</span>
              <span>Day 90</span>
              <span>Day 365</span>
            </div>

            {/* Transition Points */}
            <div className="flex justify-between">
              <div className={`text-center ${daysSinceCreation < 30 ? "opacity-100" : "opacity-40"}`}>
                <div className="bg-orange-500 w-8 h-8 rounded mx-auto mb-1 flex items-center justify-center text-xs">S3</div>
                <div className="text-xs text-slate-400">Standard</div>
              </div>
              <div className={`text-center ${daysSinceCreation >= 30 && daysSinceCreation < 90 ? "opacity-100" : "opacity-40"}`}>
                <div className="bg-green-500 w-8 h-8 rounded mx-auto mb-1 flex items-center justify-center text-xs">IA</div>
                <div className="text-xs text-slate-400">Standard-IA</div>
              </div>
              <div className={`text-center ${daysSinceCreation >= 90 && daysSinceCreation < 365 ? "opacity-100" : "opacity-40"}`}>
                <div className="bg-blue-500 w-8 h-8 rounded mx-auto mb-1 flex items-center justify-center text-xs">G</div>
                <div className="text-xs text-slate-400">Glacier</div>
              </div>
              <div className={`text-center ${daysSinceCreation >= 365 ? "opacity-100" : "opacity-40"}`}>
                <div className="bg-purple-500 w-8 h-8 rounded mx-auto mb-1 flex items-center justify-center text-xs">DA</div>
                <div className="text-xs text-slate-400">Deep Archive</div>
              </div>
            </div>
          </div>

          {/* Current State */}
          <div className="mt-6 text-center">
            <div className={`inline-block px-4 py-2 rounded-lg ${currentClass.color}`}>
              <span className="text-white font-medium">Current: {currentClass.name}</span>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Minimum 30 days before transitioning to IA classes</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can&apos;t transition smaller objects (&lt;128KB) to IA</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Rules can filter by prefix or tags</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Expiration deletes current version; NoncurrentVersionExpiration for versions</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 VERSIONING EXPLAINER (Medium)
// ============================================================================
export function S3VersioningExplainer() {


  const [versioningEnabled, setVersioningEnabled] = useState(true)
  const [versions, setVersions] = useState([
    { id: "v3", content: "Latest content", isLatest: true, isDeleted: false },
    { id: "v2", content: "Previous content", isLatest: false, isDeleted: false },
    { id: "v1", content: "Original content", isLatest: false, isDeleted: false },
  ])

  const steps = [
    {
      title: "What is Versioning?",
      description: "Keep multiple versions of an object. Every update creates a new version; old versions preserved."
    },
    {
      title: "Version IDs",
      description: "Each version has unique ID. Latest version served by default. Access specific version by ID."
    },
    {
      title: "Delete Behavior",
      description: "Delete adds a 'delete marker' - previous versions still exist. Permanently delete by specifying version ID."
    },
    {
      title: "MFA Delete",
      description: "Optional protection requiring MFA to delete versions or change versioning state."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const addDeleteMarker = () => {
    setVersions([
      { id: "delete-marker", content: "DELETE MARKER", isLatest: true, isDeleted: true },
      ...versions.map(v => ({ ...v, isLatest: false }))
    ])
  }



  useEffect(() => {
    const baseVersions = [
      { id: "v3", content: "Latest content", isLatest: true, isDeleted: false },
      { id: "v2", content: "Previous content", isLatest: false, isDeleted: false },
      { id: "v1", content: "Original content", isLatest: false, isDeleted: false },
    ]
    if (step === 0) {
      setVersioningEnabled(false)
      setVersions([baseVersions[0]])
    } else if (step === 1) {
      setVersioningEnabled(true)
      setVersions(baseVersions)
    } else if (step === 2) {
      setVersioningEnabled(true)
      setVersions([
        { id: "delete-marker", content: "DELETE MARKER", isLatest: true, isDeleted: true },
        ...baseVersions.map(v => ({ ...v, isLatest: false })),
      ])
    } else if (step === 3) {
      setVersioningEnabled(true)
      setVersions(baseVersions)
    }
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Versioning</h1>
        <p className="text-slate-400">Keeping multiple versions of objects</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setVersioningEnabled(!versioningEnabled)}
            className={`px-4 py-2 rounded-lg ${versioningEnabled ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            Versioning: {versioningEnabled ? "Enabled" : "Suspended"}
          </button>
          <button
            onClick={addDeleteMarker}
            className="px-4 py-2 rounded-lg bg-red-500 text-white"
          >
            Delete Object
          </button>
        </div>

        {/* Versions Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Object: report.pdf</div>

          <div className="space-y-2">
            {versions.map((version, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  version.isDeleted
                    ? "bg-red-500/20 border border-red-500"
                    : version.isLatest
                    ? "bg-green-500/20 border border-green-500"
                    : "bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs px-2 py-1 rounded ${
                    version.isDeleted ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"
                  }`}>
                    {version.id}
                  </span>
                  <span className="text-sm text-slate-300">{version.content}</span>
                </div>
                <div className="flex items-center gap-2">
                  {version.isLatest && !version.isDeleted && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Current</span>
                  )}
                  {version.isDeleted && (
                    <span className="text-xs text-red-400">404 on GET</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            💡 Tip: Access old version with ?versionId=v2
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Once enabled, versioning can only be suspended, never disabled</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Delete adds marker; permanent delete requires version ID</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>MFA Delete requires MFA for version deletion</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>All versions count towards storage costs</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 ENCRYPTION EXPLAINER (Medium)
// ============================================================================
export function S3EncryptionExplainer() {


  const [encryptionType, setEncryptionType] = useState<"sse-s3" | "sse-kms" | "sse-c" | "client">("sse-s3")

  const steps = [
    {
      title: "Encryption Options",
      description: "S3 supports server-side encryption (SSE) with S3-managed, KMS, or customer keys, plus client-side encryption."
    },
    {
      title: "SSE-S3",
      description: "AWS manages keys entirely. Enabled by default. Uses AES-256. Simplest option."
    },
    {
      title: "SSE-KMS",
      description: "AWS KMS manages keys. Audit trail via CloudTrail. Can use customer-managed CMK for rotation control."
    },
    {
      title: "SSE-C & Client-Side",
      description: "SSE-C: you provide key with each request. Client-side: encrypt before upload. Full key control."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const encryptionOptions = {
    "sse-s3": { name: "SSE-S3", keyMgmt: "AWS Managed", audit: "No", cost: "Free", header: "x-amz-server-side-encryption: AES256" },
    "sse-kms": { name: "SSE-KMS", keyMgmt: "KMS CMK", audit: "Yes", cost: "KMS charges", header: "x-amz-server-side-encryption: aws:kms" },
    "sse-c": { name: "SSE-C", keyMgmt: "Customer", audit: "No", cost: "Free", header: "x-amz-server-side-encryption-customer-key" },
    "client": { name: "Client-Side", keyMgmt: "Customer", audit: "Optional", cost: "Varies", header: "N/A - encrypted before upload" },
  }

  const selected = encryptionOptions[encryptionType]



  useEffect(() => {
    const typeByStep: Array<"sse-s3" | "sse-kms" | "sse-c" | "client"> = ["sse-s3", "sse-s3", "sse-kms", "sse-c"]
    if (typeByStep[step]) setEncryptionType(typeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Encryption</h1>
        <p className="text-slate-400">Server-side and client-side encryption options</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Encryption Type Selector */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {(Object.keys(encryptionOptions) as Array<keyof typeof encryptionOptions>).map((type) => (
            <button
              key={type}
              onClick={() => setEncryptionType(type)}
              className={`px-3 py-1 rounded text-xs ${encryptionType === type ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              {encryptionOptions[type].name}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Client */}
            <div className="text-center">
              <div className="bg-purple-500 rounded p-3 text-white mb-2">
                <div className="text-2xl">📱</div>
                <div className="text-xs">Client</div>
              </div>
              {encryptionType === "client" && (
                <div className="text-xs text-green-400">🔐 Encrypts</div>
              )}
            </div>

            {/* Arrow with data */}
            <div className="flex-1 text-center">
              <div className="text-slate-400">→</div>
              <div className="text-xs text-slate-500 mt-1">
                {encryptionType === "client" ? "Encrypted data" : "Plain data"}
              </div>
            </div>

            {/* S3 */}
            <div className="text-center">
              <div className="bg-green-500 rounded p-3 text-white mb-2">
                <div className="text-2xl">🪣</div>
                <div className="text-xs">S3</div>
              </div>
              {encryptionType !== "client" && (
                <div className="text-xs text-green-400">🔐 Encrypts</div>
              )}
            </div>

            {/* Arrow */}
            <div className="text-slate-400">→</div>

            {/* Key Source */}
            <div className="text-center">
              {encryptionType === "sse-s3" && (
                <div className="bg-orange-500 rounded p-3 text-white">
                  <div className="text-2xl">🔑</div>
                  <div className="text-xs">S3 Key</div>
                </div>
              )}
              {encryptionType === "sse-kms" && (
                <div className="bg-blue-500 rounded p-3 text-white">
                  <div className="text-2xl">🔐</div>
                  <div className="text-xs">KMS CMK</div>
                </div>
              )}
              {encryptionType === "sse-c" && (
                <div className="bg-red-500 rounded p-3 text-white">
                  <div className="text-2xl">🔑</div>
                  <div className="text-xs">Your Key</div>
                </div>
              )}
              {encryptionType === "client" && (
                <div className="bg-red-500 rounded p-3 text-white">
                  <div className="text-2xl">🔑</div>
                  <div className="text-xs">Your Key</div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Key Management</div>
              <div className="text-sm text-white">{selected.keyMgmt}</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Audit Trail</div>
              <div className="text-sm text-white">{selected.audit}</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Cost</div>
              <div className="text-sm text-white">{selected.cost}</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Header</div>
              <div className="text-xs text-green-400 font-mono truncate">{selected.header}</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SSE-S3 is enabled by default on all new buckets</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SSE-KMS provides CloudTrail audit logging</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SSE-C requires HTTPS and key with every request</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Bucket policies can enforce encryption</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 BUCKET POLICIES EXPLAINER (Medium)
// ============================================================================
export function S3BucketPoliciesExplainer() {


  const [policyType, setPolicyType] = useState<"public" | "cross-account" | "vpc" | "encryption">("public")

  const steps = [
    {
      title: "Bucket Policy Basics",
      description: "JSON-based resource policies attached to buckets. Control access from any principal."
    },
    {
      title: "Principal Element",
      description: "Specify who can access: AWS accounts, IAM users/roles, anonymous (*), or AWS services."
    },
    {
      title: "Conditions",
      description: "Add conditions like IP address, VPC, MFA, encryption requirements, time-based access."
    },
    {
      title: "Common Patterns",
      description: "Public read, cross-account access, VPC-only access, enforce encryption."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const policies = {
    public: {
      name: "Public Read",
      policy: `{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::bucket/*"
}`
    },
    "cross-account": {
      name: "Cross-Account",
      policy: `{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::ACCOUNT:root"
  },
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::bucket/*"
}`
    },
    vpc: {
      name: "VPC Only",
      policy: `{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": "arn:aws:s3:::bucket/*",
  "Condition": {
    "StringNotEquals": {
      "aws:sourceVpc": "vpc-123456"
    }
  }
}`
    },
    encryption: {
      name: "Enforce Encryption",
      policy: `{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:PutObject",
  "Resource": "arn:aws:s3:::bucket/*",
  "Condition": {
    "StringNotEquals": {
      "s3:x-amz-server-side-encryption": "aws:kms"
    }
  }
}`
    }
  }



  useEffect(() => {
    const typeByStep: Array<"public" | "cross-account" | "vpc" | "encryption"> = ["public", "cross-account", "vpc", "encryption"]
    if (typeByStep[step]) setPolicyType(typeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Bucket Policies</h1>
        <p className="text-slate-400">Resource-based access control for S3 buckets</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Policy Type Selector */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {(Object.keys(policies) as Array<keyof typeof policies>).map((type) => (
            <button
              key={type}
              onClick={() => setPolicyType(type)}
              className={`px-3 py-1 rounded text-xs ${policyType === type ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              {policies[type].name}
            </button>
          ))}
        </div>

        {/* Policy Display */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-2">{policies[policyType].name} Policy</div>
          <pre className="bg-slate-800 rounded p-3 text-xs text-green-400 overflow-x-auto">
            {policies[policyType].policy}
          </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Bucket policies are resource-based; IAM policies are identity-based</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Explicit Deny always wins over Allow</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cross-account access requires both bucket policy AND IAM permission</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use conditions for fine-grained access control</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 PRESIGNED URLS EXPLAINER (Medium)
// ============================================================================
export function S3PresignedURLsExplainer() {


  const [urlExpiry, setUrlExpiry] = useState(3600)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const steps = [
    {
      title: "What are Pre-signed URLs?",
      description: "Temporary URLs granting access to private S3 objects. Share without making bucket public."
    },
    {
      title: "How They Work",
      description: "Generate URL with credentials baked in. Anyone with URL can access until expiration."
    },
    {
      title: "Upload vs Download",
      description: "Pre-signed URLs work for both GET (download) and PUT (upload) operations."
    },
    {
      title: "Security Considerations",
      description: "URL validity tied to creator&apos;s credentials. If IAM role session expires, URL becomes invalid."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const isExpired = timeElapsed > urlExpiry



  useEffect(() => {
    const elapsedByStep = [0, 600, 1800, 7200]
    const expiryByStep = [3600, 3600, 3600, 3600]
    if (elapsedByStep[step] !== undefined) {
      setTimeElapsed(elapsedByStep[step])
      setUrlExpiry(expiryByStep[step])
    }
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Pre-signed URLs</h1>
        <p className="text-slate-400">Temporary access to private objects</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">URL Expiry (seconds)</label>
            <input
              type="range"
              min="300"
              max="7200"
              value={urlExpiry}
              onChange={(e) => setUrlExpiry(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-white font-mono mt-1">{urlExpiry}s ({Math.round(urlExpiry/60)}min)</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm text-slate-400 block mb-2">Time Elapsed</label>
            <input
              type="range"
              min="0"
              max="7200"
              value={timeElapsed}
              onChange={(e) => setTimeElapsed(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-white font-mono mt-1">{timeElapsed}s</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* User */}
            <div className="text-center">
              <div className="bg-purple-500 rounded p-3 text-white">
                <div className="text-2xl">👤</div>
                <div className="text-xs">User</div>
              </div>
            </div>

            {/* Pre-signed URL */}
            <div className="flex-1">
              <div className={`p-3 rounded-lg text-center ${isExpired ? "bg-red-500/20 border border-red-500" : "bg-green-500/20 border border-green-500"}`}>
                <div className="font-mono text-xs text-slate-300 mb-1 truncate">
                  https://bucket.s3.aws.com/file?X-Amz-Expires={urlExpiry}&Signature=...
                </div>
                <div className={`text-sm ${isExpired ? "text-red-400" : "text-green-400"}`}>
                  {isExpired ? "🔴 EXPIRED" : `🟢 Valid for ${urlExpiry - timeElapsed}s`}
                </div>
              </div>
            </div>

            {/* S3 */}
            <div className="text-center">
              <div className={`rounded p-3 text-white ${isExpired ? "bg-red-500" : "bg-green-500"}`}>
                <div className="text-2xl">🪣</div>
                <div className="text-xs">S3</div>
              </div>
              <div className="text-xs mt-1 text-slate-400">
                {isExpired ? "403 Forbidden" : "200 OK"}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${isExpired ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(100, (timeElapsed / urlExpiry) * 100)}%` }}
              />
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Default expiry: 1 hour. Max: 7 days (with IAM user credentials)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>URLs inherit permissions of the creator</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use for temporary access without making bucket public</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Works for uploads (PUT) and downloads (GET)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 REPLICATION EXPLAINER (Medium)
// ============================================================================
export function S3ReplicationExplainer() {


  const [replicationType, setReplicationType] = useState<"crr" | "srr">("crr")

  const steps = [
    {
      title: "Replication Types",
      description: "Cross-Region Replication (CRR) copies to different region. Same-Region Replication (SRR) copies within region."
    },
    {
      title: "Requirements",
      description: "Versioning must be enabled on both buckets. IAM role with replication permissions required."
    },
    {
      title: "What Gets Replicated",
      description: "New objects replicated automatically. Existing objects need S3 Batch Replication. Delete markers optional."
    },
    {
      title: "Use Cases",
      description: "CRR: compliance, disaster recovery, latency. SRR: log aggregation, data sovereignty, backup."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => {
    const typeByStep: Array<"crr" | "srr"> = ["crr", "crr", "srr", "crr"]
    if (typeByStep[step]) setReplicationType(typeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Replication</h1>
        <p className="text-slate-400">Cross-region and same-region object replication</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Replication Type Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setReplicationType("crr")}
            className={`px-4 py-2 rounded-lg ${replicationType === "crr" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            Cross-Region (CRR)
          </button>
          <button
            onClick={() => setReplicationType("srr")}
            className={`px-4 py-2 rounded-lg ${replicationType === "srr" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            Same-Region (SRR)
          </button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Source Bucket */}
            <div className="text-center">
              <div className="bg-green-500 rounded p-4 text-white">
                <div className="text-2xl">🪣</div>
                <div className="text-xs">Source Bucket</div>
                <div className="text-xs opacity-75">us-east-1</div>
              </div>
              <div className="text-xs text-green-400 mt-1">Versioning ✓</div>
            </div>

            {/* Replication Arrow */}
            <div className="flex-1 text-center">
              <div className={`text-2xl ${replicationType === "crr" ? "text-blue-400" : "text-green-400"}`}>
                ➡️➡️➡️
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {replicationType === "crr" ? "Cross-Region" : "Same-Region"}
              </div>
              <div className="text-xs text-slate-500">~15 min RTC</div>
            </div>

            {/* Destination Bucket */}
            <div className="text-center">
              <div className={`rounded p-4 text-white ${replicationType === "crr" ? "bg-blue-500" : "bg-green-600"}`}>
                <div className="text-2xl">🪣</div>
                <div className="text-xs">Destination Bucket</div>
                <div className="text-xs opacity-75">
                  {replicationType === "crr" ? "eu-west-1" : "us-east-1"}
                </div>
              </div>
              <div className="text-xs text-green-400 mt-1">Versioning ✓</div>
            </div>
          </div>

          {/* Replication Rules */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-400 mb-2">Replicated</div>
              <ul className="text-xs text-green-400 space-y-1">
                <li>✓ New objects</li>
                <li>✓ Metadata</li>
                <li>✓ Tags</li>
                <li>✓ ACLs (optional)</li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-400 mb-2">NOT Replicated</div>
              <ul className="text-xs text-red-400 space-y-1">
                <li>✗ Existing objects</li>
                <li>✗ Objects from other rules</li>
                <li>✗ Delete markers (optional)</li>
                <li>✗ Lifecycle actions</li>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Versioning required on BOTH source and destination</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Only NEW objects replicated; use Batch Replication for existing</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Replication Time Control (RTC) for 15-minute SLA</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Delete markers NOT replicated by default</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 EVENT NOTIFICATIONS EXPLAINER (Light)
// ============================================================================
export function S3EventNotificationsExplainer() {


  const [eventType, setEventType] = useState<"put" | "delete" | "restore">("put")

  const steps = [
    {
      title: "Event Notifications",
      description: "Trigger actions when objects are created, deleted, restored, or replicated."
    },
    {
      title: "Destinations",
      description: "Send notifications to SNS topics, SQS queues, Lambda functions, or EventBridge."
    },
    {
      title: "Filtering",
      description: "Filter by prefix and/or suffix. Example: trigger only for *.jpg in uploads/ folder."
    },
    {
      title: "EventBridge Integration",
      description: "Enable EventBridge for advanced routing, filtering, and multiple destinations per event."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => {
    const typeByStep: Array<"put" | "delete" | "restore"> = ["put", "delete", "put", "restore"]
    if (typeByStep[step]) setEventType(typeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Event Notifications</h1>
        <p className="text-slate-400">Triggering workflows from S3 events</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Event Type Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button onClick={() => setEventType("put")} className={`px-3 py-1 rounded text-xs ${eventType === "put" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>s3:ObjectCreated</button>
          <button onClick={() => setEventType("delete")} className={`px-3 py-1 rounded text-xs ${eventType === "delete" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>s3:ObjectRemoved</button>
          <button onClick={() => setEventType("restore")} className={`px-3 py-1 rounded text-xs ${eventType === "restore" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>s3:ObjectRestore</button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* S3 Bucket */}
            <div className="text-center">
              <div className="bg-green-500 rounded p-3 text-white">
                <div className="text-2xl">🪣</div>
                <div className="text-xs">S3 Bucket</div>
              </div>
              <div className={`text-xs mt-1 ${eventType === "put" ? "text-green-400" : eventType === "delete" ? "text-red-400" : "text-blue-400"}`}>
                {eventType === "put" ? "PUT /image.jpg" : eventType === "delete" ? "DELETE /old.txt" : "RESTORE /archive.zip"}
              </div>
            </div>

            {/* Event */}
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full p-2 text-black">
                <span className="text-xl">⚡</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Event</div>
            </div>

            {/* Destinations */}
            <div className="flex flex-col gap-2">
              <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">Lambda</div>
              <div className="bg-purple-500 rounded p-2 text-white text-xs text-center">SNS</div>
              <div className="bg-blue-500 rounded p-2 text-white text-xs text-center">SQS</div>
              <div className="bg-pink-500 rounded p-2 text-white text-xs text-center">EventBridge</div>
            </div>
          </div>

          {/* Event JSON */}
          <div className="mt-4">
            <div className="text-xs text-slate-400 mb-1">Event Payload</div>
            <pre className="bg-slate-800 rounded p-2 text-xs text-green-400 overflow-x-auto">
{`{
  "eventName": "${eventType === "put" ? "ObjectCreated:Put" : eventType === "delete" ? "ObjectRemoved:Delete" : "ObjectRestore:Post"}",
  "bucket": "my-bucket",
  "key": "${eventType === "put" ? "image.jpg" : eventType === "delete" ? "old.txt" : "archive.zip"}"
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Destinations: Lambda, SNS, SQS, EventBridge</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Filter by prefix and suffix (e.g., uploads/*.jpg)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>EventBridge supports advanced filtering and multiple targets</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires appropriate resource policies on destinations</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 TRANSFER ACCELERATION EXPLAINER (Light)
// ============================================================================
export function S3TransferAccelerationExplainer() {


  const [accelerationEnabled, setAccelerationEnabled] = useState(true)

  const steps = [
    {
      title: "What is Transfer Acceleration?",
      description: "Uses CloudFront edge locations to accelerate uploads and downloads over long distances."
    },
    {
      title: "How It Works",
      description: "Data routes through nearest edge location, then travels over AWS backbone network to S3."
    },
    {
      title: "When to Use",
      description: "Large file uploads from distant locations. Speed improvement varies by distance and file size."
    },
    {
      title: "Costs",
      description: "Additional charge per GB transferred. Use Speed Comparison tool to verify benefit."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => {
    const enabledByStep = [false, true, true, false]
    setAccelerationEnabled(enabledByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Transfer Acceleration</h1>
        <p className="text-slate-400">Faster uploads using CloudFront edge locations</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setAccelerationEnabled(!accelerationEnabled)}
            className={`px-4 py-2 rounded-lg ${accelerationEnabled ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            Transfer Acceleration: {accelerationEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="relative h-40">
            {/* User */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="bg-purple-500 rounded p-2 text-white text-center">
                <div className="text-xl">👤</div>
                <div className="text-xs">Sydney</div>
              </div>
            </div>

            {/* Edge Location (if enabled) */}
            {accelerationEnabled && (
              <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-orange-500 rounded p-2 text-white text-center">
                  <div className="text-xl">🌐</div>
                  <div className="text-xs">Edge</div>
                </div>
              </div>
            )}

            {/* S3 Bucket */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="bg-green-500 rounded p-2 text-white text-center">
                <div className="text-xl">🪣</div>
                <div className="text-xs">us-east-1</div>
              </div>
            </div>

            {/* Path lines */}
            <svg className="absolute inset-0 w-full h-full">
              {accelerationEnabled ? (
                <>
                  <line x1="15%" y1="50%" x2="30%" y2="50%" stroke="#22c55e" strokeWidth="3" />
                  <line x1="35%" y1="50%" x2="85%" y2="50%" stroke="#22c55e" strokeWidth="3" strokeDasharray="8" />
                </>
              ) : (
                <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="#ef4444" strokeWidth="2" />
              )}
            </svg>

            {/* Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 px-4">
              <span>Upload</span>
              {accelerationEnabled && <span className="text-orange-400">AWS Backbone</span>}
              <span>{accelerationEnabled ? "~2s" : "~10s"}</span>
            </div>
          </div>

          {/* Speed Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${!accelerationEnabled ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-xs text-slate-400">Standard Upload</div>
              <div className="text-lg font-mono text-red-400">10 seconds</div>
              <div className="text-xs text-slate-500">Public internet path</div>
            </div>
            <div className={`p-3 rounded-lg ${accelerationEnabled ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-xs text-slate-400">Accelerated Upload</div>
              <div className="text-lg font-mono text-green-400">2 seconds</div>
              <div className="text-xs text-slate-500">Edge + AWS backbone</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Uses CloudFront edge locations for uploads</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Best for long-distance, large file transfers</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Additional cost per GB - use Speed Comparison tool first</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Bucket name must be DNS-compliant (no periods)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 SELECT EXPLAINER (Light)
// ============================================================================
export function S3SelectExplainer() {


  const [useSelect, setUseSelect] = useState(true)

  const steps = [
    {
      title: "What is S3 Select?",
      description: "Query data in S3 using SQL. Retrieve only the data you need instead of entire objects."
    },
    {
      title: "Supported Formats",
      description: "Works with CSV, JSON, and Parquet files. Can handle GZIP and BZIP2 compression."
    },
    {
      title: "Cost Savings",
      description: "Pay only for data scanned and returned. Significant savings for large files with selective queries."
    },
    {
      title: "Limitations",
      description: "Simple SQL only. No JOINs. For complex analytics, use Athena or Redshift Spectrum."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => {
    const selectByStep = [true, true, true, false]
    setUseSelect(selectByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Select</h1>
        <p className="text-slate-400">Query objects with SQL without downloading</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setUseSelect(!useSelect)}
            className={`px-4 py-2 rounded-lg ${useSelect ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            S3 Select: {useSelect ? "Enabled" : "Full Download"}
          </button>
        </div>

        {/* Visualization */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* S3 File */}
            <div className="text-center flex-1">
              <div className="bg-green-500 rounded p-3 text-white">
                <div className="text-xl">📄</div>
                <div className="text-xs">sales.csv</div>
                <div className="text-xs opacity-75">100 MB</div>
              </div>
            </div>

            {/* Query */}
            <div className="flex-1 text-center">
              <div className="bg-slate-800 rounded p-2 text-xs font-mono text-green-400">
                SELECT * FROM s3object<br/>WHERE year = 2024
              </div>
            </div>

            {/* Result */}
            <div className="text-center flex-1">
              <div className={`rounded p-3 text-white ${useSelect ? "bg-blue-500" : "bg-red-500"}`}>
                <div className="text-xl">📊</div>
                <div className="text-xs">Result</div>
                <div className="text-xs opacity-75">{useSelect ? "2 MB" : "100 MB"}</div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${!useSelect ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-xs text-slate-400">Without S3 Select</div>
              <div className="text-sm text-white">Download 100 MB → Filter locally</div>
              <div className="text-xs text-red-400">Cost: $0.09 / 10 queries</div>
            </div>
            <div className={`p-3 rounded-lg ${useSelect ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-xs text-slate-400">With S3 Select</div>
              <div className="text-sm text-white">Filter in S3 → Return 2 MB</div>
              <div className="text-xs text-green-400">Cost: $0.002 / 10 queries</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Supports CSV, JSON, Parquet formats</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Up to 400% faster and 80% cheaper than downloading</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Simple SQL only - no JOINs, subqueries</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>For complex queries, use Athena instead</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 ACCESS POINTS EXPLAINER (Medium)
// ============================================================================
export function S3AccessPointsExplainer() {


  const [accessPoint, setAccessPoint] = useState<"finance" | "analytics" | "public">("finance")

  const steps = [
    {
      title: "What are Access Points?",
      description: "Named network endpoints attached to buckets. Each has its own policy and permissions for simplified access management."
    },
    {
      title: "Per-Application Access",
      description: "Create dedicated access points for each application. Simplifies bucket policies for multi-tenant scenarios."
    },
    {
      title: "VPC Access Points",
      description: "Restrict access to specific VPCs. Traffic never traverses public internet."
    },
    {
      title: "Use Cases",
      description: "Multi-tenant applications, shared data lakes, simplified permissions for large organizations."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const accessPoints = {
    finance: { name: "finance-reports-ap", vpc: "vpc-finance", policy: "Finance team only" },
    analytics: { name: "analytics-data-ap", vpc: "vpc-analytics", policy: "Read-only analytics" },
    public: { name: "public-assets-ap", vpc: "Internet", policy: "GetObject only" }
  }



  useEffect(() => {
    const apByStep: Array<"finance" | "analytics" | "public"> = ["finance", "analytics", "finance", "public"]
    if (apByStep[step]) setAccessPoint(apByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Access Points</h1>
        <p className="text-slate-400">Simplified access management for shared buckets</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-2 mb-6">
          <button onClick={() => setAccessPoint("finance")} className={`px-3 py-1 rounded text-xs ${accessPoint === "finance" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Finance AP</button>
          <button onClick={() => setAccessPoint("analytics")} className={`px-3 py-1 rounded text-xs ${accessPoint === "analytics" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Analytics AP</button>
          <button onClick={() => setAccessPoint("public")} className={`px-3 py-1 rounded text-xs ${accessPoint === "public" ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}>Public AP</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-2">
              <div className={`rounded p-2 text-white text-xs ${accessPoint === "finance" ? "bg-blue-500" : "bg-slate-700"}`}>Finance Team</div>
              <div className={`rounded p-2 text-white text-xs ${accessPoint === "analytics" ? "bg-green-500" : "bg-slate-700"}`}>Analytics App</div>
              <div className={`rounded p-2 text-white text-xs ${accessPoint === "public" ? "bg-orange-500" : "bg-slate-700"}`}>Public Users</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="text-center mb-2">
                <code className="text-xs text-green-400 bg-slate-800 px-2 py-1 rounded">
                  {accessPoints[accessPoint].name}
                </code>
              </div>
              <div className="h-0.5 bg-slate-600"></div>
              <div className="text-xs text-slate-400 text-center mt-1">VPC: {accessPoints[accessPoint].vpc}</div>
            </div>
            <div className="bg-green-500 rounded p-3 text-white text-center">
              <div className="text-2xl">🪣</div>
              <div className="text-xs">Shared Bucket</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3 mt-4">
            <div className="text-xs text-slate-400 mb-2">Access Point Policy</div>
            <pre className="text-xs text-green-400 font-mono">{accessPoints[accessPoint].policy}</pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Each access point has unique DNS name and ARN</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can restrict to VPC - no internet access possible</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Simplifies complex bucket policies for shared data</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Up to 10,000 access points per account per region</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 OBJECT LOCK EXPLAINER (Medium)
// ============================================================================
export function S3ObjectLockExplainer() {


  const [lockMode, setLockMode] = useState<"governance" | "compliance">("governance")

  const steps = [
    {
      title: "What is Object Lock?",
      description: "WORM (Write Once Read Many) model. Prevents objects from being deleted or modified for a retention period."
    },
    {
      title: "Retention Modes",
      description: "Governance: users with special permissions can override. Compliance: NO ONE can delete, including root."
    },
    {
      title: "Legal Hold",
      description: "Separate from retention. Applied indefinitely until removed. Prevents deletion regardless of retention."
    },
    {
      title: "Requirements",
      description: "Must enable versioning. Can only enable Object Lock when creating bucket (not existing buckets)."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => {
    const modeByStep: Array<"governance" | "compliance"> = ["governance", "compliance", "compliance", "governance"]
    if (modeByStep[step]) setLockMode(modeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Object Lock</h1>
        <p className="text-slate-400">WORM protection for compliance and data protection</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setLockMode("governance")} className={`px-4 py-2 rounded-lg ${lockMode === "governance" ? "bg-yellow-500 text-black" : "bg-slate-700 text-slate-300"}`}>Governance Mode</button>
          <button onClick={() => setLockMode("compliance")} className={`px-4 py-2 rounded-lg ${lockMode === "compliance" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>Compliance Mode</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-center mb-4">
            <div className={`inline-block rounded-full p-4 ${lockMode === "governance" ? "bg-yellow-500" : "bg-red-500"}`}>
              <div className="text-3xl">🔒</div>
            </div>
            <div className="text-white font-medium mt-2">{lockMode === "governance" ? "Governance" : "Compliance"} Mode</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${lockMode === "governance" ? "bg-yellow-500/20 border border-yellow-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Governance</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Special permission can bypass</li>
                <li>• s3:BypassGovernanceRetention</li>
                <li>• Can shorten retention</li>
                <li>• Testing/development</li>
              </ul>
            </div>
            <div className={`p-3 rounded-lg ${lockMode === "compliance" ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-white mb-2">Compliance</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• NO ONE can delete</li>
                <li>• Not even root user</li>
                <li>• Cannot shorten retention</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Delete Attempt Result</div>
            <div className={`text-sm font-mono ${lockMode === "governance" ? "text-yellow-400" : "text-red-400"}`}>
              {lockMode === "governance"
                ? "403 Forbidden (unless s3:BypassGovernanceRetention)"
                : "403 Forbidden - ALWAYS (until retention expires)"}
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Governance: bypassable with special permission</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Compliance: cannot be bypassed by anyone</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires versioning enabled</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Only configurable at bucket creation</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 MULTIPART UPLOAD EXPLAINER (Medium)
// ============================================================================
export function S3MultipartUploadExplainer() {


  const [uploadProgress, setUploadProgress] = useState(0)

  const steps = [
    {
      title: "What is Multipart Upload?",
      description: "Upload large files in parts. Required for files >5GB. Recommended for files >100MB."
    },
    {
      title: "How It Works",
      description: "Initiate upload, upload parts in parallel, complete by combining. Parts: 5MB-5GB each."
    },
    {
      title: "Benefits",
      description: "Parallel uploads, pause/resume, recover from failures (retry single part). Faster throughput."
    },
    {
      title: "Lifecycle Cleanup",
      description: "Incomplete multipart uploads consume storage. Use lifecycle rules to abort old incomplete uploads."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const parts = [
    { id: 1, size: "5 GB", status: uploadProgress >= 25 ? "complete" : uploadProgress >= 10 ? "uploading" : "pending" },
    { id: 2, size: "5 GB", status: uploadProgress >= 50 ? "complete" : uploadProgress >= 30 ? "uploading" : "pending" },
    { id: 3, size: "5 GB", status: uploadProgress >= 75 ? "complete" : uploadProgress >= 55 ? "uploading" : "pending" },
    { id: 4, size: "3 GB", status: uploadProgress >= 100 ? "complete" : uploadProgress >= 80 ? "uploading" : "pending" },
  ]



  useEffect(() => {
    const progressByStep = [0, 40, 75, 100]
    if (progressByStep[step] !== undefined) setUploadProgress(progressByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Multipart Upload</h1>
        <p className="text-slate-400">Efficient upload of large files in parallel</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm text-slate-400 block mb-2">Upload Progress</label>
          <input type="range" min="0" max="100" value={uploadProgress} onChange={(e) => setUploadProgress(Number(e.target.value))} className="w-full" />
          <div className="text-center text-white font-mono mt-1">{uploadProgress}%</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">18 GB File → 4 Parts</div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {parts.map(part => (
              <div key={part.id} className={`p-3 rounded text-center ${
                part.status === "complete" ? "bg-green-500/20 border border-green-500" :
                part.status === "uploading" ? "bg-blue-500/20 border border-blue-500" :
                "bg-slate-800"
              }`}>
                <div className="text-2xl">{part.status === "complete" ? "✓" : part.status === "uploading" ? "⬆️" : "⏳"}</div>
                <div className="text-xs text-white">Part {part.id}</div>
                <div className="text-xs text-slate-400">{part.size}</div>
              </div>
            ))}
          </div>

          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all" style={{ width: `${uploadProgress}%` }}></div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Min Part Size</div>
              <div className="text-sm text-white">5 MB</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Max Part Size</div>
              <div className="text-sm text-white">5 GB</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Max Parts</div>
              <div className="text-sm text-white">10,000</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Required for objects &gt;5 GB, recommended &gt;100 MB</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Part size: 5 MB - 5 GB, max 10,000 parts</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Parts upload in parallel for faster throughput</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use lifecycle rules to clean up incomplete uploads</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 CORS EXPLAINER (Light)
// ============================================================================
export function S3CORSExplainer() {


  const [corsEnabled, setCorsEnabled] = useState(true)

  const steps = [
    {
      title: "What is CORS?",
      description: "Cross-Origin Resource Sharing. Allows web browsers to make requests to S3 from different domains."
    },
    {
      title: "How It Works",
      description: "Browser sends preflight OPTIONS request. S3 responds with allowed origins/methods. Browser proceeds if allowed."
    },
    {
      title: "Configuration",
      description: "JSON or XML rules specifying AllowedOrigins, AllowedMethods, AllowedHeaders, and ExposeHeaders."
    },
    {
      title: "Common Use Cases",
      description: "Web apps loading images/files from S3, JavaScript SDK uploads, static website hosting."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  useEffect(() => {
    const enabledByStep = [false, true, true, true]
    setCorsEnabled(enabledByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 CORS</h1>
        <p className="text-slate-400">Cross-Origin Resource Sharing configuration</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center mb-6">
          <button onClick={() => setCorsEnabled(!corsEnabled)} className={`px-4 py-2 rounded-lg ${corsEnabled ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            CORS: {corsEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="bg-purple-500 rounded p-3 text-white">
                <div className="text-xl">🌐</div>
                <div className="text-xs">app.example.com</div>
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className="space-y-2">
                <div className="text-xs text-center text-slate-400">1. OPTIONS (preflight)</div>
                <div className="h-0.5 bg-blue-500"></div>
                <div className="h-0.5 bg-green-500"></div>
                <div className="text-xs text-center text-slate-400">{corsEnabled ? "2. Allow headers" : "2. No CORS headers"}</div>
              </div>
            </div>
            <div className="text-center">
              <div className={`rounded p-3 text-white ${corsEnabled ? "bg-green-500" : "bg-red-500"}`}>
                <div className="text-xl">🪣</div>
                <div className="text-xs">S3 Bucket</div>
              </div>
            </div>
          </div>

          <div className={`p-3 rounded text-center ${corsEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {corsEnabled ? "✓ Request allowed from app.example.com" : "✗ CORS error: No 'Access-Control-Allow-Origin'"}
          </div>

          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">CORS Configuration</div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`[{
  "AllowedOrigins": ["https://app.example.com"],
  "AllowedMethods": ["GET", "PUT", "POST"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"]
}]`}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"><RotateCcw className="w-5 h-5" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><span>💡</span> Exam Takeaways</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Required for browser-based S3 access from different domains</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Configure AllowedOrigins, Methods, Headers</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Browser sends OPTIONS preflight first</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Common issue when using S3 with JavaScript apps</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// S3 BATCH OPERATIONS EXPLAINER (Medium)
// ============================================================================
export function S3BatchOperationsExplainer() {


  const [operation, setOperation] = useState<"copy" | "tag" | "acl" | "restore">("copy")

  const steps = [
    {
      title: "What is S3 Batch Operations?",
      description: "Perform operations on billions of objects. Single request can process millions of objects automatically."
    },
    {
      title: "Supported Operations",
      description: "Copy, invoke Lambda, restore from Glacier, replace tags, replace ACLs, Object Lock retention."
    },
    {
      title: "How It Works",
      description: "Create job with manifest (list of objects), specify operation, S3 processes in background with reports."
    },
    {
      title: "Use Cases",
      description: "Bulk encryption, cross-account copy, Glacier restores, compliance tagging, Lambda processing at scale."
    }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)

  const operations = {
    copy: { name: "Copy", icon: "📋", desc: "Copy objects across buckets/accounts" },
    tag: { name: "Replace Tags", icon: "🏷️", desc: "Update tags on all objects" },
    acl: { name: "Replace ACL", icon: "🔐", desc: "Update ACLs across objects" },
    restore: { name: "Restore", icon: "📦", desc: "Restore from Glacier at scale" }
  }



  useEffect(() => {
    const opByStep: Array<"copy" | "tag" | "acl" | "restore"> = ["copy", "tag", "acl", "restore"]
    if (opByStep[step]) setOperation(opByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">S3 Batch Operations</h1>
        <p className="text-slate-400">Perform bulk operations on billions of objects</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-2 mb-6">
          {Object.entries(operations).map(([key, op]) => (
            <button key={key} onClick={() => setOperation(key as typeof operation)} className={`px-3 py-1 rounded text-xs ${operation === key ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
              {op.name}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="bg-blue-500 rounded p-3 text-white">
                <div className="text-xl">📄</div>
                <div className="text-xs">Manifest</div>
                <div className="text-xs opacity-75">1M objects</div>
              </div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="text-center">
              <div className="bg-purple-500 rounded p-3 text-white">
                <div className="text-xl">{operations[operation].icon}</div>
                <div className="text-xs">{operations[operation].name}</div>
              </div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="text-center">
              <div className="bg-green-500 rounded p-3 text-white">
                <div className="text-xl">📊</div>
                <div className="text-xs">Report</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-2">Operation: {operations[operation].name}</div>
            <div className="text-sm text-white">{operations[operation].desc}</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Objects</div>
              <div className="text-lg font-mono text-blue-400">1,000,000</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Success</div>
              <div className="text-lg font-mono text-green-400">999,985</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Failed</div>
              <div className="text-lg font-mono text-red-400">15</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Process billions of objects with single request</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Operations: Copy, Tag, ACL, Restore, Lambda, Object Lock</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires manifest file listing objects</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Completion reports show success/failure</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const s3Explainers = {
  "s3-storage-classes": S3StorageClassesExplainer,
  "s3-lifecycle": S3LifecycleExplainer,
  "s3-versioning": S3VersioningExplainer,
  "s3-encryption": S3EncryptionExplainer,
  "s3-bucket-policies": S3BucketPoliciesExplainer,
  "s3-presigned-urls": S3PresignedURLsExplainer,
  "s3-replication": S3ReplicationExplainer,
  "s3-event-notifications": S3EventNotificationsExplainer,
  "s3-transfer-acceleration": S3TransferAccelerationExplainer,
  "s3-select": S3SelectExplainer,
  "s3-access-points": S3AccessPointsExplainer,
  "s3-object-lock": S3ObjectLockExplainer,
  "s3-multipart-upload": S3MultipartUploadExplainer,
  "s3-cors": S3CORSExplainer,
  "s3-batch-operations": S3BatchOperationsExplainer,
}
