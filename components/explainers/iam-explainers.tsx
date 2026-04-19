"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// IAM POLICY EVALUATION EXPLAINER (Rich)
// ============================================================================
export function IAMPolicyEvaluationExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Evaluation Logic", description: "Default DENY → Check all policies → Explicit DENY wins → Explicit ALLOW needed" },
    { title: "Step 1: Default Deny", description: "By default, all requests are implicitly denied. No permission = no access." },
    { title: "Step 2: Check Policies", description: "Evaluate all applicable policies: identity-based, resource-based, SCPs, boundaries." },
    { title: "Step 3: Explicit Deny", description: "If ANY policy has explicit deny, access is denied. Deny ALWAYS wins." },
    { title: "Step 4: Allow Required", description: "Must have at least one explicit Allow. No allow found = implicit deny." }
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
        <h1 className="text-2xl font-bold text-white mb-2">IAM Policy Evaluation</h1>
        <p className="text-slate-400">How AWS determines access</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Evaluation Flow */}
          <div className="flex flex-col items-center gap-4">
            <div className={`w-full p-3 rounded text-center ${step >= 1 ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-sm text-red-400">1. Default: DENY</div>
            </div>

            <div className="text-slate-400">↓</div>

            <div className={`w-full p-3 rounded text-center ${step >= 2 ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-sm text-blue-400">2. Evaluate All Policies</div>
              <div className="text-xs text-slate-500 mt-1">Identity, Resource, SCPs, Boundaries</div>
            </div>

            <div className="text-slate-400">↓</div>

            <div className={`w-full p-3 rounded text-center ${step >= 3 ? "bg-red-500/20 border border-red-500" : "bg-slate-800"}`}>
              <div className="text-sm text-red-400">3. Explicit Deny? → DENIED</div>
              <div className="text-xs text-slate-500 mt-1">Deny ALWAYS wins</div>
            </div>

            <div className="text-slate-400">↓</div>

            <div className={`w-full p-3 rounded text-center ${step >= 4 ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm text-green-400">4. Explicit Allow? → ALLOWED</div>
              <div className="text-xs text-slate-500 mt-1">No allow = implicit deny</div>
            </div>
          </div>

          {/* Example */}
          <div className="mt-6 p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">Example: User tries s3:PutObject</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-500/20 p-2 rounded text-center">
                <div className="text-green-400">IAM Policy</div>
                <div className="text-slate-300">Allow s3:*</div>
              </div>
              <div className="bg-red-500/20 p-2 rounded text-center">
                <div className="text-red-400">Bucket Policy</div>
                <div className="text-slate-300">Deny s3:PutObject</div>
              </div>
              <div className="bg-red-500/20 p-2 rounded text-center">
                <div className="text-red-400">Result</div>
                <div className="text-slate-300">DENIED</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Explicit DENY always wins over any Allow</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Default is implicit deny - must have explicit Allow</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>All applicable policies are evaluated together</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SCPs and boundaries are evaluated in same-account scenarios</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM POLICY TYPES EXPLAINER (Medium)
// ============================================================================
export function IAMPolicyTypesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [policyType, setPolicyType] = useState("managed")

  const steps = [
    { title: "Policy Types Overview", description: "Managed (AWS/Customer), Inline, Resource-based. Each serves different purposes." },
    { title: "AWS Managed Policies", description: "Predefined by AWS for common use cases. Can&apos;t modify. Updated automatically." },
    { title: "Customer Managed Policies", description: "You create and manage. Reusable across identities. Full control. Versioning." },
    { title: "Inline Policies", description: "Embedded in single identity. Deleted with identity. Use for strict 1:1 relationship." }
  ]

  const types = {
    managed: { name: "AWS Managed", desc: "Predefined by AWS", example: "AmazonS3ReadOnlyAccess" },
    customer: { name: "Customer Managed", desc: "You create & manage", example: "MyAppS3Policy" },
    inline: { name: "Inline", desc: "Embedded in identity", example: "Attached to specific user" },
    resource: { name: "Resource-based", desc: "Attached to resource", example: "S3 bucket policy" }
  }

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"managed" | "customer" | "inline" | "resource"> = ["managed", "managed", "customer", "inline"]
    if (valueByStep[step]) setPolicyType(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Policy Types</h1>
        <p className="text-slate-400">Understanding different policy categories</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.keys(types).map((t) => (
            <button key={t} onClick={() => setPolicyType(t)} className={`px-3 py-1 rounded text-xs ${policyType === t ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
              {types[t as keyof typeof types].name}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-white">{types[policyType as keyof typeof types].name}</div>
            <div className="text-sm text-slate-400">{types[policyType as keyof typeof types].desc}</div>
            <div className="text-xs text-green-400 mt-1">Example: {types[policyType as keyof typeof types].example}</div>
          </div>

          {/* Visualization */}
          <div className="flex justify-center items-center gap-8">
            {policyType === "resource" ? (
              <>
                <div className="bg-purple-500 rounded p-3 text-white text-xs text-center">User/Role</div>
                <div className="text-slate-400">→</div>
                <div className="bg-green-500 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl">🪣</div>
                  <div className="text-xs">S3 Bucket</div>
                  <div className="text-[10px] bg-slate-800 rounded mt-1 px-1">Policy attached</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-500 rounded-lg p-3 text-white text-center">
                  <div className="text-2xl">👤</div>
                  <div className="text-xs">User/Role</div>
                  {policyType === "inline" && <div className="text-[10px] bg-slate-800 rounded mt-1 px-1">Policy embedded</div>}
                </div>
                {policyType !== "inline" && (
                  <>
                    <div className="text-slate-400">←attach→</div>
                    <div className="bg-orange-500 rounded p-3 text-white text-xs text-center">
                      Policy<br/>(reusable)
                    </div>
                  </>
                )}
              </>
            )}
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AWS Managed: easiest, auto-updated, can&apos;t customize</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Customer Managed: full control, reusable, versioned</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Inline: strict 1:1 binding, deleted with identity</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Resource-based: cross-account without assuming role</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM ROLES VS USERS EXPLAINER (Medium)
// ============================================================================
export function IAMRolesVsUsersExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [identityType, setIdentityType] = useState<"user" | "role">("user")

  const steps = [
    { title: "Users vs Roles", description: "Users: permanent identity with credentials. Roles: temporary identity assumed when needed." },
    { title: "IAM Users", description: "Long-term credentials (password, access keys). For humans or programmatic access." },
    { title: "IAM Roles", description: "No permanent credentials. Assumed by users, services, or accounts. Temporary security tokens." },
    { title: "When to Use", description: "Users: human identity. Roles: services (EC2, Lambda), cross-account, federation." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"user" | "role"> = ["user", "user", "role", "role"]
    if (valueByStep[step]) setIdentityType(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Roles vs Users</h1>
        <p className="text-slate-400">Understanding identity types</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setIdentityType("user")} className={`px-4 py-2 rounded-lg ${identityType === "user" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>IAM User</button>
          <button onClick={() => setIdentityType("role")} className={`px-4 py-2 rounded-lg ${identityType === "role" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>IAM Role</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded ${identityType === "user" ? "bg-blue-500/20 border border-blue-500" : "bg-slate-800"}`}>
              <div className="text-center mb-3">
                <div className="text-2xl">👤</div>
                <div className="text-sm font-medium text-blue-400">IAM User</div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Permanent credentials</li>
                <li>• Password + MFA for console</li>
                <li>• Access keys for API</li>
                <li>• Belongs to one account</li>
                <li>• For humans or apps</li>
              </ul>
            </div>
            <div className={`p-4 rounded ${identityType === "role" ? "bg-purple-500/20 border border-purple-500" : "bg-slate-800"}`}>
              <div className="text-center mb-3">
                <div className="text-2xl">🎭</div>
                <div className="text-sm font-medium text-purple-400">IAM Role</div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Temporary credentials</li>
                <li>• Assumed when needed</li>
                <li>• Trust policy defines who</li>
                <li>• Can be cross-account</li>
                <li>• For services & federation</li>
              </ul>
            </div>
          </div>

          {/* Who assumes roles */}
          <div className="mt-4 p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">Who can assume roles?</div>
            <div className="flex justify-center gap-2">
              <div className="bg-blue-500 rounded px-2 py-1 text-white text-xs">IAM Users</div>
              <div className="bg-orange-500 rounded px-2 py-1 text-white text-xs">EC2</div>
              <div className="bg-green-500 rounded px-2 py-1 text-white text-xs">Lambda</div>
              <div className="bg-purple-500 rounded px-2 py-1 text-white text-xs">Other Accounts</div>
              <div className="bg-yellow-500 rounded px-2 py-1 text-black text-xs">Federated Users</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Always use roles for AWS services (EC2, Lambda)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Roles provide temporary credentials via STS</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Trust policy specifies who can assume the role</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Don&apos;t store access keys in code - use roles</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// CROSS-ACCOUNT ACCESS EXPLAINER (Medium)
// ============================================================================
export function IAMCrossAccountExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [method, setMethod] = useState<"both" | "resource" | "role">("both")

  const steps = [
    { title: "Cross-Account Access", description: "Grant access between AWS accounts. Two methods: resource-based policies or role assumption." },
    { title: "Resource-Based Policy", description: "Add principal from other account to resource policy (S3, Lambda, etc). Direct access." },
    { title: "Role Assumption", description: "Create role in target account with trust policy. User assumes role to get temporary credentials." },
    { title: "Which to Use", description: "Resource-based: simpler for S3/Lambda. Role: more control, audit trail, any service." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"both" | "resource" | "role"> = ["both", "resource", "role", "both"]
    if (valueByStep[step]) setMethod(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Cross-Account Access</h1>
        <p className="text-slate-400">Sharing resources between AWS accounts</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Two Accounts */}
          <div className="flex justify-between items-center">
            <div className="border border-blue-500/30 rounded-lg p-4 text-center flex-1 mr-4">
              <div className="text-xs text-blue-400 mb-2">Account A (111111111111)</div>
              <div className="bg-blue-500 rounded p-2 text-white text-xs">User/Role</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="text-xs text-slate-400">AssumeRole</div>
              <div className="text-purple-400 text-lg">⟷</div>
              <div className="text-xs text-slate-400">or Resource Policy</div>
            </div>

            <div className="border border-green-500/30 rounded-lg p-4 text-center flex-1 ml-4">
              <div className="text-xs text-green-400 mb-2">Account B (222222222222)</div>
              <div className="bg-green-500 rounded p-2 text-white text-xs">S3 / Role</div>
            </div>
          </div>

          {/* Methods comparison */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className={`rounded p-3 transition-all ${method === "resource" ? "bg-orange-500/20 border border-orange-500" : method === "role" ? "bg-slate-800 opacity-50" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-orange-400 mb-2">Resource-Based Policy</div>
              <pre className="text-xs text-green-400 bg-slate-900 p-2 rounded overflow-x-auto">
{`"Principal": {
  "AWS": "111111111111"
}`}
              </pre>
            </div>
            <div className={`rounded p-3 transition-all ${method === "role" ? "bg-purple-500/20 border border-purple-500" : method === "resource" ? "bg-slate-800 opacity-50" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-purple-400 mb-2">Trust Policy (Role)</div>
              <pre className="text-xs text-green-400 bg-slate-900 p-2 rounded overflow-x-auto">
{`"Principal": {
  "AWS": "arn:aws:iam::111:root"
}`}
              </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Two methods: resource-based policy OR assume role</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Role assumption requires: trust policy + assume permission</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Resource-based: simpler, direct access to that resource</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Role: better audit trail in CloudTrail</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// PERMISSIONS BOUNDARIES EXPLAINER (Medium)
// ============================================================================
export function IAMPermissionsBoundariesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"all" | "policy" | "boundary" | "effective">("all")

  const steps = [
    { title: "What are Permissions Boundaries?", description: "Maximum permissions an identity CAN have. Limits what policies can grant." },
    { title: "How They Work", description: "Effective permissions = intersection of identity policy AND boundary. Both must allow." },
    { title: "Use Case", description: "Delegate admin without giving full admin. Let developers create roles within limits." },
    { title: "Important", description: "Boundaries don&apos;t grant permissions - they only limit them. Still need explicit Allow." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"all" | "policy" | "boundary" | "effective"> = ["all", "effective", "policy", "boundary"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Permissions Boundaries</h1>
        <p className="text-slate-400">Limiting maximum permissions</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Venn diagram visualization */}
          <div className="flex justify-center items-center h-48 relative">
            {/* Identity Policy circle */}
            <div className={`absolute w-32 h-32 rounded-full bg-blue-500/30 border-2 border-blue-500 left-1/3 flex items-center justify-center transition-all ${focus === "policy" ? "ring-4 ring-blue-400 scale-110" : focus === "boundary" || focus === "effective" ? "opacity-40" : ""}`}>
              <div className="text-xs text-blue-400">Identity<br/>Policy</div>
            </div>
            {/* Boundary circle */}
            <div className={`absolute w-32 h-32 rounded-full bg-orange-500/30 border-2 border-orange-500 right-1/3 flex items-center justify-center transition-all ${focus === "boundary" ? "ring-4 ring-orange-400 scale-110" : focus === "policy" || focus === "effective" ? "opacity-40" : ""}`}>
              <div className="text-xs text-orange-400">Permissions<br/>Boundary</div>
            </div>
            {/* Intersection */}
            <div className={`absolute w-16 h-16 rounded-full bg-green-500/50 flex items-center justify-center z-10 transition-all ${focus === "effective" ? "ring-4 ring-green-400 scale-125" : focus === "policy" || focus === "boundary" ? "opacity-40" : ""}`}>
              <div className="text-[10px] text-green-400 text-center">Effective<br/>Access</div>
            </div>
          </div>

          {/* Example */}
          <div className="mt-4 p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">Example:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`bg-blue-500/20 p-2 rounded text-center transition-all ${focus === "policy" ? "ring-2 ring-blue-400" : focus === "boundary" || focus === "effective" ? "opacity-40" : ""}`}>
                <div className="text-blue-400">Policy</div>
                <div className="text-slate-300">s3:*, ec2:*</div>
              </div>
              <div className={`bg-orange-500/20 p-2 rounded text-center transition-all ${focus === "boundary" ? "ring-2 ring-orange-400" : focus === "policy" || focus === "effective" ? "opacity-40" : ""}`}>
                <div className="text-orange-400">Boundary</div>
                <div className="text-slate-300">s3:*</div>
              </div>
              <div className={`bg-green-500/20 p-2 rounded text-center transition-all ${focus === "effective" ? "ring-2 ring-green-400" : focus === "policy" || focus === "boundary" ? "opacity-40" : ""}`}>
                <div className="text-green-400">Effective</div>
                <div className="text-slate-300">s3:* only</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Boundaries LIMIT, don&apos;t GRANT permissions</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Effective = intersection of policy AND boundary</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use for delegation: let devs create roles within bounds</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Applied to users or roles, not groups</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// INSTANCE PROFILES EXPLAINER (Light)
// ============================================================================
export function IAMInstanceProfilesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"profile" | "flow" | "creation" | "secure">("profile")

  const steps = [
    { title: "What is an Instance Profile?", description: "Container for IAM role that you attach to EC2 instance. Provides temporary credentials." },
    { title: "How It Works", description: "EC2 instance metadata service provides credentials. SDK/CLI automatically retrieves them." },
    { title: "Console vs CLI", description: "Console auto-creates profile with same name as role. CLI/API: must create separately." },
    { title: "Best Practice", description: "Always use instance profiles instead of storing access keys on EC2 instances." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"profile" | "flow" | "creation" | "secure"> = ["profile", "flow", "creation", "secure"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Instance Profiles</h1>
        <p className="text-slate-400">Roles for EC2 instances</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className={`flex items-center justify-center gap-4 transition-all ${focus === "profile" || focus === "creation" ? "ring-2 ring-blue-400/50 rounded-lg p-2" : ""}`}>
            <div className="bg-blue-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">🖥️</div>
              <div className="text-xs">EC2 Instance</div>
            </div>
            <div className="text-slate-400">←→</div>
            <div className={`bg-purple-500 rounded-lg p-4 text-white text-center transition-all ${focus === "profile" || focus === "creation" ? "scale-110" : ""}`}>
              <div className="text-2xl">📋</div>
              <div className="text-xs">Instance Profile</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">🎭</div>
              <div className="text-xs">IAM Role</div>
            </div>
          </div>

          <div className={`mt-4 p-3 bg-slate-800 rounded transition-all ${focus === "flow" ? "ring-2 ring-blue-400" : focus === "profile" || focus === "secure" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">Credential Flow:</div>
            <div className="text-xs text-slate-300">
              1. App on EC2 calls AWS API<br/>
              2. SDK fetches credentials from metadata<br/>
              3. Temporary credentials returned<br/>
              4. Credentials auto-refreshed
            </div>
          </div>

          <div className={`mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-center transition-all ${focus === "secure" ? "ring-2 ring-green-400" : focus === "profile" || focus === "flow" ? "opacity-50" : ""}`}>
            <div className="text-xs text-green-400">✓ No access keys stored on instance - secure!</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Instance profile is container for role attached to EC2</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Provides temporary credentials via metadata service</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Console auto-creates profile; CLI needs separate step</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Never store access keys on EC2 - use profiles</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// STS EXPLAINER (Medium)
// ============================================================================
export function IAMSTSExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"overview" | "operations" | "credentials" | "usecases">("overview")

  const steps = [
    { title: "What is STS?", description: "Security Token Service - provides temporary security credentials for IAM/federated users." },
    { title: "Key Operations", description: "AssumeRole, AssumeRoleWithSAML, AssumeRoleWithWebIdentity, GetSessionToken, GetFederationToken." },
    { title: "Temporary Credentials", description: "Access key ID, secret key, and session token. Expire after configurable time (15 min - 12 hours)." },
    { title: "Use Cases", description: "Cross-account access, identity federation, providing temporary access to resources." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"overview" | "operations" | "credentials" | "usecases"> = ["overview", "operations", "credentials", "usecases"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AWS STS</h1>
        <p className="text-slate-400">Temporary security credentials</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className={`flex items-center justify-center gap-4 transition-all ${focus === "overview" || focus === "usecases" ? "ring-2 ring-purple-400/50 rounded-lg p-2" : ""}`}>
            <div className="bg-blue-500 rounded p-3 text-white text-xs text-center">
              User/Role/App
            </div>
            <div className="text-slate-400">→ AssumeRole →</div>
            <div className="bg-purple-500 rounded-lg p-4 text-white text-center">
              <div className="text-xl">🔐</div>
              <div className="text-xs">STS</div>
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-green-500 rounded p-3 text-white text-xs text-center">
              Temp Creds
            </div>
          </div>

          {/* Credentials breakdown */}
          <div className={`mt-4 p-3 bg-slate-800 rounded transition-all ${focus === "credentials" ? "ring-2 ring-green-400" : focus === "overview" || focus === "operations" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">Temporary Credentials Include:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-blue-500/20 p-2 rounded text-center text-blue-400">AccessKeyId</div>
              <div className="bg-green-500/20 p-2 rounded text-center text-green-400">SecretAccessKey</div>
              <div className="bg-orange-500/20 p-2 rounded text-center text-orange-400">SessionToken</div>
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center">Expires: 15 min - 12 hours (configurable)</div>
          </div>

          {/* Operations */}
          <div className={`mt-4 flex flex-wrap justify-center gap-2 transition-all ${focus === "operations" ? "ring-2 ring-blue-400 rounded p-2" : focus === "credentials" || focus === "overview" ? "opacity-50" : ""}`}>
            <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">AssumeRole</div>
            <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">AssumeRoleWithSAML</div>
            <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">AssumeRoleWithWebIdentity</div>
            <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">GetSessionToken</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>STS returns temporary credentials with session token</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Default duration: 1 hour, max: 12 hours for role assumption</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AssumeRoleWithWebIdentity: for mobile/web apps with OIDC</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use Cognito instead of direct STS for web/mobile federation</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM CONDITIONS EXPLAINER (Light)
// ============================================================================
export function IAMConditionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [example, setExample] = useState<"all" | "mfa" | "ip" | "tag">("all")

  const steps = [
    { title: "Policy Conditions", description: "Add constraints to when a policy applies. Condition keys check request context." },
    { title: "Common Condition Keys", description: "aws:SourceIp, aws:CurrentTime, aws:MultiFactorAuthPresent, aws:PrincipalTag, etc." },
    { title: "Operators", description: "StringEquals, StringLike, IpAddress, DateGreaterThan, Bool, NumericLessThan, etc." },
    { title: "Use Cases", description: "Require MFA, restrict by IP, time-based access, tag-based access control." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"all" | "mfa" | "ip" | "tag"> = ["all", "mfa", "ip", "tag"]
    if (valueByStep[step]) setExample(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Policy Conditions</h1>
        <p className="text-slate-400">Fine-grained access control</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Example Conditions</div>

          <div className="space-y-3">
            <div className={`bg-slate-800 rounded p-3 transition-all ${example === "mfa" ? "ring-2 ring-orange-400" : example === "ip" || example === "tag" ? "opacity-40" : ""}`}>
              <div className="text-xs text-orange-400 mb-1">Require MFA</div>
              <pre className="text-xs text-green-400 font-mono">
{`"Condition": {
  "Bool": {
    "aws:MultiFactorAuthPresent": "true"
  }
}`}
              </pre>
            </div>

            <div className={`bg-slate-800 rounded p-3 transition-all ${example === "ip" ? "ring-2 ring-blue-400" : example === "mfa" || example === "tag" ? "opacity-40" : ""}`}>
              <div className="text-xs text-blue-400 mb-1">Restrict by IP</div>
              <pre className="text-xs text-green-400 font-mono">
{`"Condition": {
  "IpAddress": {
    "aws:SourceIp": "192.168.1.0/24"
  }
}`}
              </pre>
            </div>

            <div className={`bg-slate-800 rounded p-3 transition-all ${example === "tag" ? "ring-2 ring-purple-400" : example === "mfa" || example === "ip" ? "opacity-40" : ""}`}>
              <div className="text-xs text-purple-400 mb-1">Tag-Based Access</div>
              <pre className="text-xs text-green-400 font-mono">
{`"Condition": {
  "StringEquals": {
    "aws:ResourceTag/Department": "\${aws:PrincipalTag/Department}"
  }
}`}
              </pre>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Conditions add context-based constraints to policies</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>aws:MultiFactorAuthPresent for MFA enforcement</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>StringEquals is case-sensitive, StringEqualsIgnoreCase is not</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Policy variables like $&#123;aws:username&#125; for dynamic values</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SERVICE CONTROL POLICIES EXPLAINER (Medium)
// ============================================================================
export function IAMSCPsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"overview" | "formula" | "hierarchy" | "warning">("overview")

  const steps = [
    { title: "What are SCPs?", description: "Service Control Policies - permission guardrails for AWS Organizations. Limit what member accounts can do." },
    { title: "How SCPs Work", description: "SCPs don't grant permissions - they set maximum available permissions. Like a ceiling." },
    { title: "Inheritance", description: "SCPs cascade down the organization tree. Account inherits from all parent OUs." },
    { title: "Management Account", description: "SCPs do NOT affect the management (master) account. Management always has full access." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"overview" | "formula" | "hierarchy" | "warning"> = ["overview", "formula", "hierarchy", "warning"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Service Control Policies (SCPs)</h1>
        <p className="text-slate-400">Organization-wide permission guardrails</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Org hierarchy */}
          <div className={`flex flex-col items-center transition-all ${focus === "hierarchy" || focus === "overview" ? "" : "opacity-50"} ${focus === "hierarchy" ? "ring-2 ring-yellow-400 rounded p-2" : ""}`}>
            <div className="bg-yellow-500 rounded p-2 text-black text-xs font-medium">Root</div>
            <div className="w-px h-4 bg-slate-600"></div>
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-blue-500 rounded p-2 text-white text-xs">OU: Production</div>
                <div className="text-xs text-slate-400 mt-1">SCP: No delete</div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="bg-green-500 rounded p-2 text-white text-xs">Account A</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-500 rounded p-2 text-white text-xs">OU: Dev</div>
                <div className="text-xs text-slate-400 mt-1">SCP: Full access</div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="bg-green-500 rounded p-2 text-white text-xs">Account B</div>
              </div>
            </div>
          </div>

          {/* Effective permissions */}
          <div className={`mt-4 p-3 bg-slate-800 rounded transition-all ${focus === "formula" ? "ring-2 ring-orange-400" : focus === "hierarchy" || focus === "warning" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">Effective Permissions Formula:</div>
            <div className="text-xs text-center">
              <span className="text-blue-400">IAM Policy</span>
              <span className="text-slate-400"> ∩ </span>
              <span className="text-orange-400">SCP</span>
              <span className="text-slate-400"> = </span>
              <span className="text-green-400">Effective Access</span>
            </div>
          </div>

          <div className={`mt-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-center text-xs text-red-400 transition-all ${focus === "warning" ? "ring-2 ring-red-400 scale-105" : focus === "hierarchy" || focus === "formula" ? "opacity-50" : ""}`}>
            ⚠️ SCPs do NOT apply to the management account
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SCPs limit permissions, don&apos;t grant them</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Do NOT affect management account</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Inherit down the OU/account hierarchy</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Affect all users including root user in member accounts</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM GROUPS EXPLAINER (Light)
// ============================================================================
export function IAMGroupsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"groups" | "benefits" | "rules" | "practices">("groups")

  const steps = [
    { title: "What are IAM Groups?", description: "Collection of IAM users. Attach policies to group - all members get those permissions." },
    { title: "Benefits", description: "Manage permissions at scale. Add/remove users from groups instead of changing individual policies." },
    { title: "Limitations", description: "Groups can&apos;t be nested (no groups within groups). Users can belong to multiple groups." },
    { title: "Best Practices", description: "Create groups by job function (Admins, Developers, Auditors). Use groups instead of attaching policies to users." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"groups" | "benefits" | "rules" | "practices"> = ["groups", "benefits", "rules", "practices"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Groups</h1>
        <p className="text-slate-400">Organizing users and permissions</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className={`flex justify-center gap-8 transition-all ${focus === "rules" ? "opacity-50" : focus === "groups" || focus === "practices" ? "ring-2 ring-blue-400/50 rounded p-2" : ""}`}>
            {/* Groups with users */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-lg p-3 text-white mb-2">
                <div className="text-xs font-medium">Admins</div>
                <div className="text-[10px]">AdministratorAccess</div>
              </div>
              <div className="flex gap-1 justify-center">
                <div className="bg-slate-700 rounded w-6 h-6 text-xs flex items-center justify-center">👤</div>
                <div className="bg-slate-700 rounded w-6 h-6 text-xs flex items-center justify-center">👤</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 rounded-lg p-3 text-white mb-2">
                <div className="text-xs font-medium">Developers</div>
                <div className="text-[10px]">PowerUserAccess</div>
              </div>
              <div className="flex gap-1 justify-center">
                <div className="bg-slate-700 rounded w-6 h-6 text-xs flex items-center justify-center">👤</div>
                <div className="bg-slate-700 rounded w-6 h-6 text-xs flex items-center justify-center">👤</div>
                <div className="bg-slate-700 rounded w-6 h-6 text-xs flex items-center justify-center">👤</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 rounded-lg p-3 text-white mb-2">
                <div className="text-xs font-medium">Auditors</div>
                <div className="text-[10px]">ReadOnlyAccess</div>
              </div>
              <div className="flex gap-1 justify-center">
                <div className="bg-slate-700 rounded w-6 h-6 text-xs flex items-center justify-center">👤</div>
              </div>
            </div>
          </div>

          <div className={`mt-4 grid grid-cols-2 gap-3 transition-all ${focus === "rules" ? "ring-2 ring-yellow-400 rounded p-2" : focus === "groups" || focus === "practices" ? "opacity-50" : ""}`}>
            <div className="bg-green-500/20 rounded p-2 text-xs text-center">
              <div className="text-green-400">✓ Can</div>
              <div className="text-slate-300">Users in multiple groups</div>
            </div>
            <div className="bg-red-500/20 rounded p-2 text-xs text-center">
              <div className="text-red-400">✗ Cannot</div>
              <div className="text-slate-300">Nest groups</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Groups CANNOT be nested</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Users can belong to multiple groups</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Best practice: use groups, not individual user policies</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Groups are not &quot;identities&quot; - can&apos;t be principals in policies</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM MFA EXPLAINER (Light)
// ============================================================================
export function IAMMFAExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"flow" | "types" | "enforce" | "practices">("flow")

  const steps = [
    { title: "What is MFA?", description: "Multi-Factor Authentication - requires second factor beyond password. Something you know + something you have." },
    { title: "MFA Types", description: "Virtual MFA (app), Hardware TOTP, U2F Security Key, Hardware key fob for GovCloud." },
    { title: "Enforcing MFA", description: "Use IAM policy conditions: aws:MultiFactorAuthPresent = true. Or require MFA for console sign-in." },
    { title: "Best Practices", description: "Always enable MFA for root account and privileged users. Use hardware MFA for highest security." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"flow" | "types" | "enforce" | "practices"> = ["flow", "types", "enforce", "practices"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Multi-Factor Authentication</h1>
        <p className="text-slate-400">Enhanced security for AWS access</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* MFA Types */}
          <div className={`grid grid-cols-4 gap-3 mb-4 transition-all ${focus === "types" ? "ring-2 ring-purple-400 rounded p-2" : focus === "flow" || focus === "enforce" ? "opacity-50" : ""}`}>
            <div className="bg-blue-500/20 rounded p-3 text-center">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-xs text-blue-400">Virtual MFA</div>
              <div className="text-[10px] text-slate-400">Google Auth, Authy</div>
            </div>
            <div className="bg-green-500/20 rounded p-3 text-center">
              <div className="text-2xl mb-1">🔐</div>
              <div className="text-xs text-green-400">Hardware TOTP</div>
              <div className="text-[10px] text-slate-400">Gemalto token</div>
            </div>
            <div className="bg-purple-500/20 rounded p-3 text-center">
              <div className="text-2xl mb-1">🔑</div>
              <div className="text-xs text-purple-400">U2F Key</div>
              <div className="text-[10px] text-slate-400">YubiKey</div>
            </div>
            <div className="bg-orange-500/20 rounded p-3 text-center">
              <div className="text-2xl mb-1">🏛️</div>
              <div className="text-xs text-orange-400">GovCloud</div>
              <div className="text-[10px] text-slate-400">Special key fob</div>
            </div>
          </div>

          {/* Auth flow */}
          <div className={`flex items-center justify-center gap-4 transition-all ${focus === "flow" ? "ring-2 ring-blue-400 rounded p-2" : focus === "types" || focus === "enforce" ? "opacity-50" : ""}`}>
            <div className="bg-slate-800 rounded p-2 text-xs text-center">
              <div>Password</div>
              <div className="text-slate-500">Something you know</div>
            </div>
            <div className="text-slate-400 text-lg">+</div>
            <div className="bg-slate-800 rounded p-2 text-xs text-center">
              <div>MFA Code</div>
              <div className="text-slate-500">Something you have</div>
            </div>
            <div className="text-slate-400">=</div>
            <div className="bg-green-500 rounded p-2 text-xs text-white text-center">
              Access ✓
            </div>
          </div>

          <div className={`mt-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-center text-xs text-red-400 transition-all ${focus === "enforce" || focus === "practices" ? "ring-2 ring-red-400 scale-105" : focus === "types" || focus === "flow" ? "opacity-50" : ""}`}>
            ⚠️ ALWAYS enable MFA for root account!
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Virtual MFA: most common, one device per user</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>U2F security keys: phishing resistant, recommended</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use aws:MultiFactorAuthPresent condition to enforce</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Root MFA: use hardware MFA if possible</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM ACCESS KEYS EXPLAINER (Medium)
// ============================================================================
export function IAMAccessKeysExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"structure" | "states" | "rotation" | "alternatives">("structure")

  const steps = [
    { title: "What are Access Keys?", description: "Long-term credentials for programmatic access. Access Key ID + Secret Access Key pair." },
    { title: "Best Practices", description: "Rotate regularly. Never embed in code. Use IAM roles for services. Max 2 keys per user." },
    { title: "Key Rotation", description: "Create new key, update applications, test, then delete old key. Keep transition period short." },
    { title: "Alternatives", description: "Use IAM roles when possible (EC2, Lambda). Use temporary credentials from STS." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"structure" | "states" | "rotation" | "alternatives"> = ["structure", "states", "rotation", "alternatives"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Access Keys</h1>
        <p className="text-slate-400">Programmatic AWS access credentials</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Access key structure */}
          <div className={`bg-slate-800 rounded p-4 font-mono text-xs mb-4 transition-all ${focus === "structure" ? "ring-2 ring-blue-400" : focus === "states" || focus === "rotation" ? "opacity-50" : ""}`}>
            <div className="mb-2">
              <span className="text-slate-400">Access Key ID: </span>
              <span className="text-blue-400">AKIAIOSFODNN7EXAMPLE</span>
            </div>
            <div>
              <span className="text-slate-400">Secret Access Key: </span>
              <span className="text-green-400">wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY</span>
            </div>
          </div>

          {/* Key states */}
          <div className={`grid grid-cols-3 gap-3 mb-4 transition-all ${focus === "states" ? "ring-2 ring-orange-400 rounded p-2" : focus === "structure" || focus === "rotation" ? "opacity-50" : ""}`}>
            <div className="bg-green-500/20 rounded p-2 text-xs text-center">
              <div className="text-green-400 font-medium">Active</div>
              <div className="text-slate-400">In use</div>
            </div>
            <div className="bg-orange-500/20 rounded p-2 text-xs text-center">
              <div className="text-orange-400 font-medium">Inactive</div>
              <div className="text-slate-400">Temporarily disabled</div>
            </div>
            <div className="bg-red-500/20 rounded p-2 text-xs text-center">
              <div className="text-red-400 font-medium">Deleted</div>
              <div className="text-slate-400">Permanent removal</div>
            </div>
          </div>

          {/* Rotation flow */}
          <div className={`p-3 bg-slate-800 rounded transition-all ${focus === "rotation" || focus === "alternatives" ? "ring-2 ring-green-400" : focus === "structure" || focus === "states" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">Key Rotation Steps:</div>
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="bg-blue-500 rounded px-2 py-1 text-white">1. Create new</div>
              <div className="text-slate-400">→</div>
              <div className="bg-green-500 rounded px-2 py-1 text-white">2. Update apps</div>
              <div className="text-slate-400">→</div>
              <div className="bg-orange-500 rounded px-2 py-1 text-white">3. Test</div>
              <div className="text-slate-400">→</div>
              <div className="bg-red-500 rounded px-2 py-1 text-white">4. Delete old</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Max 2 access keys per user (for rotation)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Never put access keys in code or commit to repos</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Prefer IAM roles over access keys when possible</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Rotate access keys regularly (90 days recommended)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM RESOURCE-BASED POLICIES EXPLAINER (Medium)
// ============================================================================
export function IAMResourceBasedPoliciesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"both" | "resource" | "identity" | "services">("both")

  const steps = [
    { title: "Resource-Based Policies", description: "Policies attached to resources (S3, Lambda, etc) instead of identities. Specify who can access." },
    { title: "Principal Element", description: "Resource policies have Principal - specifies who is allowed/denied. Not in identity policies." },
    { title: "Cross-Account Access", description: "Resource policies enable direct cross-account access without assuming a role." },
    { title: "When to Use", description: "S3 buckets, Lambda functions, SNS topics, SQS queues, KMS keys. Simpler for resource sharing." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"both" | "resource" | "identity" | "services"> = ["both", "resource", "resource", "services"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Resource-Based Policies</h1>
        <p className="text-slate-400">Policies attached to AWS resources</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`bg-blue-500/20 rounded p-3 transition-all ${focus === "identity" ? "ring-2 ring-blue-400" : focus === "resource" || focus === "services" ? "opacity-40" : ""}`}>
              <div className="text-sm font-medium text-blue-400 mb-2">Identity-Based</div>
              <div className="text-xs text-slate-300 mb-2">Attached to user/role/group</div>
              <pre className="bg-slate-800 p-2 rounded text-[10px] text-green-400">{`{
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::bucket/*"
}`}</pre>
            </div>
            <div className={`bg-orange-500/20 rounded p-3 transition-all ${focus === "resource" ? "ring-2 ring-orange-400 scale-105" : focus === "identity" || focus === "services" ? "opacity-40" : ""}`}>
              <div className="text-sm font-medium text-orange-400 mb-2">Resource-Based</div>
              <div className="text-xs text-slate-300 mb-2">Attached to resource</div>
              <pre className="bg-slate-800 p-2 rounded text-[10px] text-green-400">{`{
  "Principal": {"AWS": "arn:aws:iam::123:user/Bob"},
  "Action": "s3:GetObject",
  "Resource": "*"
}`}</pre>
            </div>
          </div>

          {/* Services that support resource policies */}
          <div className={`p-3 bg-slate-800 rounded transition-all ${focus === "services" ? "ring-2 ring-green-400" : focus === "resource" || focus === "identity" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">Services with Resource-Based Policies:</div>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="bg-green-500 rounded px-2 py-1 text-white text-xs">S3</div>
              <div className="bg-orange-500 rounded px-2 py-1 text-white text-xs">Lambda</div>
              <div className="bg-purple-500 rounded px-2 py-1 text-white text-xs">SNS</div>
              <div className="bg-blue-500 rounded px-2 py-1 text-white text-xs">SQS</div>
              <div className="bg-yellow-500 rounded px-2 py-1 text-black text-xs">KMS</div>
              <div className="bg-pink-500 rounded px-2 py-1 text-white text-xs">ECR</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Resource policies have &quot;Principal&quot; - identity policies don&apos;t</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Cross-account: no role assumption needed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Not all services support resource policies</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Same-account: identity OR resource policy Allow works</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM POLICY SIMULATOR EXPLAINER (Light)
// ============================================================================
export function IAMPolicySimulatorExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"overview" | "flow" | "result" | "access">("overview")

  const steps = [
    { title: "What is Policy Simulator?", description: "AWS tool to test and troubleshoot IAM policies before applying them in production." },
    { title: "How It Works", description: "Select user/role/group, choose actions/resources, simulate. Shows allowed/denied with reason." },
    { title: "Use Cases", description: "Test new policies, troubleshoot access denied errors, validate least privilege, compliance checks." },
    { title: "Access Methods", description: "Console at policysim.aws.amazon.com, CLI: aws iam simulate-*, or API calls." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"overview" | "flow" | "result" | "access"> = ["overview", "flow", "result", "access"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">IAM Policy Simulator</h1>
        <p className="text-slate-400">Test policies before applying</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Simulator flow */}
          <div className={`flex items-center justify-center gap-4 mb-4 transition-all ${focus === "flow" ? "ring-2 ring-blue-400 rounded p-2" : focus === "result" ? "opacity-50" : ""}`}>
            <div className="bg-blue-500 rounded p-3 text-white text-xs text-center">
              <div className="text-lg mb-1">👤</div>
              Select Identity
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-orange-500 rounded p-3 text-white text-xs text-center">
              <div className="text-lg mb-1">⚙️</div>
              Choose Action
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-purple-500 rounded p-3 text-white text-xs text-center">
              <div className="text-lg mb-1">🎯</div>
              Specify Resource
            </div>
            <div className="text-slate-400">→</div>
            <div className="bg-green-500 rounded p-3 text-white text-xs text-center">
              <div className="text-lg mb-1">✓/✗</div>
              See Result
            </div>
          </div>

          {/* Example output */}
          <div className={`bg-slate-800 rounded p-3 transition-all ${focus === "result" ? "ring-2 ring-green-400" : focus === "flow" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">Example Simulation Result:</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-green-500 text-white px-2 py-0.5 rounded">allowed</span>
                <span className="text-slate-300">s3:GetObject on bucket-prod/*</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-red-500 text-white px-2 py-0.5 rounded">denied</span>
                <span className="text-slate-300">s3:DeleteObject - implicit deny</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-red-500 text-white px-2 py-0.5 rounded">denied</span>
                <span className="text-slate-300">ec2:TerminateInstances - explicit deny in SCP</span>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Test policies BEFORE applying to production</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Shows which policy caused allow/deny</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Available as console, CLI, and API</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use for troubleshooting access denied errors</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// IAM IDENTITY CENTER EXPLAINER (Medium)
// ============================================================================
export function IAMIdentityCenterExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"overview" | "source" | "center" | "flow">("overview")

  const steps = [
    { title: "What is IAM Identity Center?", description: "Successor to AWS SSO. Centrally manage workforce access to multiple AWS accounts and apps." },
    { title: "Identity Sources", description: "Built-in directory, Active Directory, or external IdP (Okta, Azure AD). Single sign-on." },
    { title: "Permission Sets", description: "Collections of policies attached to users/groups. Defines access for AWS accounts." },
    { title: "Benefits", description: "One login for all accounts, centralized management, integrates with Organizations, SAML 2.0." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const valueByStep: Array<"overview" | "source" | "center" | "flow"> = ["overview", "source", "center", "flow"]
    if (valueByStep[step]) setFocus(valueByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AWS IAM Identity Center</h1>
        <p className="text-slate-400">Centralized workforce access management</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* Architecture */}
          <div className="flex items-start justify-center gap-4 mb-4">
            {/* Identity Source */}
            <div className={`bg-blue-500/20 rounded p-3 text-center transition-all ${focus === "source" ? "ring-2 ring-blue-400 scale-110" : focus === "center" || focus === "flow" ? "opacity-40" : ""}`}>
              <div className="text-xs text-blue-400 mb-2">Identity Source</div>
              <div className="space-y-1">
                <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">Built-in</div>
                <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">Active Directory</div>
                <div className="bg-slate-700 rounded px-2 py-1 text-xs text-slate-300">External IdP</div>
              </div>
            </div>

            <div className="text-slate-400 self-center">→</div>

            {/* Identity Center */}
            <div className={`bg-purple-500 rounded-lg p-4 text-white text-center transition-all ${focus === "center" ? "ring-4 ring-purple-300 scale-110" : focus === "source" || focus === "flow" ? "opacity-40" : ""}`}>
              <div className="text-lg mb-1">🔐</div>
              <div className="text-xs">IAM Identity Center</div>
              <div className="text-[10px]">Permission Sets</div>
            </div>

            <div className="text-slate-400 self-center">→</div>

            {/* Accounts */}
            <div className={`bg-green-500/20 rounded p-3 text-center transition-all ${focus === "source" || focus === "center" ? "opacity-40" : ""}`}>
              <div className="text-xs text-green-400 mb-2">AWS Accounts</div>
              <div className="space-y-1">
                <div className="bg-green-500 rounded px-2 py-1 text-xs text-white">Production</div>
                <div className="bg-green-500 rounded px-2 py-1 text-xs text-white">Development</div>
                <div className="bg-green-500 rounded px-2 py-1 text-xs text-white">Staging</div>
              </div>
            </div>
          </div>

          {/* User flow */}
          <div className={`p-3 bg-slate-800 rounded transition-all ${focus === "flow" ? "ring-2 ring-orange-400" : focus === "source" || focus === "center" ? "opacity-50" : ""}`}>
            <div className="text-xs text-slate-400 mb-2">User Access Flow:</div>
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="bg-blue-500 rounded px-2 py-1 text-white">Login</div>
              <div className="text-slate-400">→</div>
              <div className="bg-purple-500 rounded px-2 py-1 text-white">Portal</div>
              <div className="text-slate-400">→</div>
              <div className="bg-green-500 rounded px-2 py-1 text-white">Select Account</div>
              <div className="text-slate-400">→</div>
              <div className="bg-orange-500 rounded px-2 py-1 text-white">Console/CLI</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Formerly AWS SSO - now IAM Identity Center</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Integrates with AWS Organizations</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Permission Sets define access to accounts</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Supports AD, Okta, Azure AD, and built-in directory</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const iamExplainers = {
  "iam-policy-evaluation": IAMPolicyEvaluationExplainer,
  "iam-policy-types": IAMPolicyTypesExplainer,
  "iam-roles-users": IAMRolesVsUsersExplainer,
  "iam-cross-account": IAMCrossAccountExplainer,
  "iam-permissions-boundaries": IAMPermissionsBoundariesExplainer,
  "iam-instance-profiles": IAMInstanceProfilesExplainer,
  "iam-sts": IAMSTSExplainer,
  "iam-conditions": IAMConditionsExplainer,
  "iam-scps": IAMSCPsExplainer,
  "iam-groups": IAMGroupsExplainer,
  "iam-mfa": IAMMFAExplainer,
  "iam-access-keys": IAMAccessKeysExplainer,
  "iam-resource-based-policies": IAMResourceBasedPoliciesExplainer,
  "iam-policy-simulator": IAMPolicySimulatorExplainer,
  "iam-identity-center": IAMIdentityCenterExplainer,
}
