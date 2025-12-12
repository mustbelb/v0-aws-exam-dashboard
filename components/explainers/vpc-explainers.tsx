"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================================
// VPC SUBNETS EXPLAINER (Medium)
// ============================================================================
export function VPCSubnetsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [subnetType, setSubnetType] = useState<"public" | "private">("public")

  const steps = [
    { title: "What are Subnets?", description: "Subnets segment your VPC into smaller networks. Each subnet exists in one Availability Zone." },
    { title: "Public Subnets", description: "Has route to Internet Gateway. Resources can have public IPs and receive internet traffic." },
    { title: "Private Subnets", description: "No direct internet route. Resources use NAT Gateway for outbound internet access." },
    { title: "CIDR Blocks", description: "Each subnet has a CIDR range within the VPC CIDR. Plan carefully - can't resize after creation." }
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
        <h1 className="text-2xl font-bold text-white mb-2">VPC Subnets</h1>
        <p className="text-slate-400">Public and private network segmentation</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setSubnetType("public")} className={`px-4 py-2 rounded-lg ${subnetType === "public" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Public Subnet</button>
          <button onClick={() => setSubnetType("private")} className={`px-4 py-2 rounded-lg ${subnetType === "private" ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}>Private Subnet</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="border-2 border-blue-500/30 rounded-lg p-4 relative">
            <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-blue-400 text-sm">VPC 10.0.0.0/16</div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className={`p-4 rounded-lg border-2 ${subnetType === "public" ? "border-green-500 bg-green-500/10" : "border-slate-600 bg-slate-800"}`}>
                <div className="text-sm text-green-400 mb-2">Public Subnet (10.0.1.0/24)</div>
                <div className="space-y-2">
                  <div className="bg-blue-500 rounded p-2 text-white text-xs">EC2 (Public IP)</div>
                  <div className="bg-purple-500 rounded p-2 text-white text-xs">ALB</div>
                </div>
                <div className="text-xs text-slate-400 mt-2">Route: 0.0.0.0/0 → IGW</div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${subnetType === "private" ? "border-orange-500 bg-orange-500/10" : "border-slate-600 bg-slate-800"}`}>
                <div className="text-sm text-orange-400 mb-2">Private Subnet (10.0.2.0/24)</div>
                <div className="space-y-2">
                  <div className="bg-blue-500 rounded p-2 text-white text-xs">EC2 (Private)</div>
                  <div className="bg-green-500 rounded p-2 text-white text-xs">RDS</div>
                </div>
                <div className="text-xs text-slate-400 mt-2">Route: 0.0.0.0/0 → NAT</div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="bg-yellow-500 rounded p-2 text-black text-xs">Internet Gateway</div>
              <div className="bg-orange-500 rounded p-2 text-white text-xs">NAT Gateway</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Public subnet = route table has route to Internet Gateway</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Each subnet exists in ONE Availability Zone only</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AWS reserves 5 IPs per subnet (first 4 + last)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can&apos;t resize subnet CIDR after creation</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// SECURITY GROUPS VS NACLs EXPLAINER (Rich)
// ============================================================================
export function VPCSecurityGroupsVsNACLsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [layer, setLayer] = useState<"sg" | "nacl">("sg")

  const steps = [
    { title: "Two Layers of Security", description: "Security Groups protect instances (stateful). NACLs protect subnets (stateless)." },
    { title: "Security Groups", description: "Instance-level firewall. Stateful - return traffic automatically allowed. Only ALLOW rules." },
    { title: "NACLs", description: "Subnet-level firewall. Stateless - must allow both inbound AND outbound. Allow AND deny rules." },
    { title: "Rule Evaluation", description: "SGs: all rules evaluated. NACLs: rules evaluated in order, first match wins." }
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
        <h1 className="text-2xl font-bold text-white mb-2">Security Groups vs NACLs</h1>
        <p className="text-slate-400">Two layers of VPC security</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setLayer("sg")} className={`px-4 py-2 rounded-lg ${layer === "sg" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Security Group</button>
          <button onClick={() => setLayer("nacl")} className={`px-4 py-2 rounded-lg ${layer === "nacl" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>NACL</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="relative border-2 border-blue-500/30 rounded-lg p-8">
            {/* NACL layer */}
            <div className={`absolute inset-2 border-2 rounded-lg ${layer === "nacl" ? "border-purple-500 bg-purple-500/10" : "border-slate-700"}`}>
              <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-purple-400 text-xs">NACL (Subnet)</span>
            </div>

            {/* SG layer */}
            <div className={`relative border-2 rounded-lg p-4 m-6 ${layer === "sg" ? "border-green-500 bg-green-500/10" : "border-slate-700"}`}>
              <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-green-400 text-xs">Security Group</span>
              <div className="bg-blue-500 rounded p-3 text-white text-center">
                <div className="text-xl">🖥️</div>
                <div className="text-xs">EC2 Instance</div>
              </div>
            </div>

            {/* Traffic flow */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
              Traffic →
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${layer === "sg" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-green-400 mb-2">Security Group</div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Instance level</li>
                <li>• Stateful</li>
                <li>• Allow rules only</li>
                <li>• All rules evaluated</li>
              </ul>
            </div>
            <div className={`p-3 rounded ${layer === "nacl" ? "bg-purple-500/20 border border-purple-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-purple-400 mb-2">NACL</div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Subnet level</li>
                <li>• Stateless</li>
                <li>• Allow AND deny rules</li>
                <li>• Rules in order (first match)</li>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>SG: stateful (return traffic auto-allowed), NACLs: stateless (explicit rules needed)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>NACL rules have numbers - evaluated lowest to highest</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Default SG: denies all inbound, allows all outbound</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Default NACL: allows all traffic both directions</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// NAT GATEWAY EXPLAINER (Medium)
// ============================================================================
export function VPCNATGatewayExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasNat, setHasNat] = useState(true)

  const steps = [
    { title: "What is NAT Gateway?", description: "Allows instances in private subnets to access internet while remaining unreachable from outside." },
    { title: "How It Works", description: "NAT Gateway lives in public subnet. Private instances route outbound traffic through it." },
    { title: "High Availability", description: "NAT Gateway is AZ-specific. Deploy one per AZ for fault tolerance." },
    { title: "NAT Gateway vs NAT Instance", description: "NAT Gateway: managed, scalable. NAT Instance: EC2-based, more control, less recommended." }
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
        <h1 className="text-2xl font-bold text-white mb-2">NAT Gateway</h1>
        <p className="text-slate-400">Outbound internet for private subnets</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center mb-6">
          <button onClick={() => setHasNat(!hasNat)} className={`px-4 py-2 rounded-lg ${hasNat ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            NAT Gateway: {hasNat ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Private Subnet */}
            <div className="p-4 border border-orange-500/30 rounded bg-orange-500/5">
              <div className="text-xs text-orange-400 mb-2">Private Subnet</div>
              <div className="bg-blue-500 rounded p-2 text-white text-xs text-center">EC2</div>
            </div>

            {/* NAT Gateway in Public Subnet */}
            <div className="p-4 border border-green-500/30 rounded bg-green-500/5">
              <div className="text-xs text-green-400 mb-2">Public Subnet</div>
              {hasNat ? (
                <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">NAT GW</div>
              ) : (
                <div className="bg-slate-700 rounded p-2 text-slate-500 text-xs text-center">No NAT</div>
              )}
            </div>

            {/* Internet */}
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full p-4 inline-block text-black">
                <div className="text-2xl">🌐</div>
              </div>
              <div className="text-xs text-slate-400 mt-1">Internet</div>
            </div>
          </div>

          {/* Traffic Flow */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400">EC2</span>
            <span className={`text-xs ${hasNat ? "text-green-400" : "text-red-400"}`}>
              {hasNat ? "→ NAT → IGW → Internet ✓" : "→ ✗ No route to internet"}
            </span>
          </div>

          {/* Cost info */}
          <div className="mt-4 p-2 bg-slate-800 rounded text-xs text-center text-slate-400">
            NAT Gateway: ~$0.045/hour + $0.045/GB processed
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>NAT Gateway MUST be in public subnet with Elastic IP</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Deploy one NAT Gateway per AZ for high availability</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Scales to 45 Gbps automatically</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can&apos;t use NAT Gateway from same subnet it&apos;s in</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// VPC ENDPOINTS EXPLAINER (Medium)
// ============================================================================
export function VPCEndpointsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [endpointType, setEndpointType] = useState<"gateway" | "interface">("gateway")

  const steps = [
    { title: "What are VPC Endpoints?", description: "Private connections to AWS services without using internet. Traffic stays on AWS network." },
    { title: "Gateway Endpoints", description: "For S3 and DynamoDB only. Free! Uses route table entries. Highly available automatically." },
    { title: "Interface Endpoints", description: "For most other AWS services. Uses ENI with private IP. Powered by PrivateLink. Has hourly cost." },
    { title: "Security Benefits", description: "No internet gateway needed. Can restrict endpoint access with policies." }
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
        <h1 className="text-2xl font-bold text-white mb-2">VPC Endpoints</h1>
        <p className="text-slate-400">Private connectivity to AWS services</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setEndpointType("gateway")} className={`px-4 py-2 rounded-lg ${endpointType === "gateway" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Gateway Endpoint</button>
          <button onClick={() => setEndpointType("interface")} className={`px-4 py-2 rounded-lg ${endpointType === "interface" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>Interface Endpoint</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* VPC */}
            <div className="border border-blue-500/30 rounded p-4 flex-1 mr-4">
              <div className="text-xs text-blue-400 mb-2">VPC</div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 rounded p-2 text-white text-xs">EC2</div>
                {endpointType === "interface" && (
                  <div className="bg-purple-500 rounded p-2 text-white text-xs">ENI</div>
                )}
                {endpointType === "gateway" && (
                  <div className="text-xs text-slate-400">Route Table → vpce-xxx</div>
                )}
              </div>
            </div>

            {/* Endpoint */}
            <div className={`rounded p-4 text-white text-center ${endpointType === "gateway" ? "bg-green-500" : "bg-purple-500"}`}>
              <div className="text-sm font-medium">
                {endpointType === "gateway" ? "Gateway\nEndpoint" : "Interface\nEndpoint"}
              </div>
            </div>

            {/* AWS Service */}
            <div className="ml-4 text-center">
              <div className="bg-orange-500 rounded p-3 text-white">
                {endpointType === "gateway" ? "S3 / DynamoDB" : "SQS / SNS / etc"}
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${endpointType === "gateway" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-green-400">Gateway Endpoint</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>• S3 and DynamoDB only</li>
                <li>• FREE</li>
                <li>• Route table entry</li>
                <li>• Regional, HA automatic</li>
              </ul>
            </div>
            <div className={`p-3 rounded ${endpointType === "interface" ? "bg-purple-500/20 border border-purple-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-purple-400">Interface Endpoint</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>• Most AWS services</li>
                <li>• ~$0.01/hour + data</li>
                <li>• Uses ENI (private IP)</li>
                <li>• One per AZ for HA</li>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Gateway endpoints: S3, DynamoDB only - FREE</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Interface endpoints: Most services - hourly + data cost</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Both keep traffic off public internet</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Endpoint policies control access to services</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// VPC PEERING EXPLAINER (Medium)
// ============================================================================
export function VPCPeeringExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is VPC Peering?", description: "Connect two VPCs privately using AWS network. Traffic never touches public internet." },
    { title: "Requirements", description: "Non-overlapping CIDR blocks. Peering is NOT transitive - must peer each pair directly." },
    { title: "Cross-Account/Region", description: "Can peer VPCs across accounts and regions. Owner must accept peering request." },
    { title: "Route Tables", description: "Must update route tables in BOTH VPCs to enable traffic flow." }
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
        <h1 className="text-2xl font-bold text-white mb-2">VPC Peering</h1>
        <p className="text-slate-400">Private networking between VPCs</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            {/* VPC A */}
            <div className="border-2 border-blue-500/30 rounded-lg p-4 w-40">
              <div className="text-xs text-blue-400 mb-2">VPC A (10.0.0.0/16)</div>
              <div className="bg-blue-500 rounded p-2 text-white text-xs text-center">EC2</div>
            </div>

            {/* Peering Connection */}
            <div className="flex flex-col items-center">
              <div className="bg-purple-500 rounded-full px-3 py-1 text-white text-xs">
                Peering
              </div>
              <div className="text-purple-400 text-sm">⟷</div>
            </div>

            {/* VPC B */}
            <div className="border-2 border-green-500/30 rounded-lg p-4 w-40">
              <div className="text-xs text-green-400 mb-2">VPC B (10.1.0.0/16)</div>
              <div className="bg-green-500 rounded p-2 text-white text-xs text-center">RDS</div>
            </div>
          </div>

          {/* Non-transitive warning */}
          <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded">
            <div className="text-xs text-red-400 font-medium mb-1">⚠️ Peering is NOT Transitive</div>
            <div className="text-xs text-slate-400">
              A ↔ B and B ↔ C does NOT mean A can reach C. Must peer A ↔ C directly.
            </div>
          </div>

          {/* Route table */}
          <div className="mt-4 p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400 mb-2">Route Tables Required</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-blue-400">VPC A Route Table:</div>
                <div className="font-mono text-slate-300">10.1.0.0/16 → pcx-xxx</div>
              </div>
              <div>
                <div className="text-green-400">VPC B Route Table:</div>
                <div className="font-mono text-slate-300">10.0.0.0/16 → pcx-xxx</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>VPC peering is NOT transitive - must create direct connections</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>CIDRs must not overlap</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Update route tables in BOTH VPCs</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Works cross-account and cross-region</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// VPC ROUTE TABLES EXPLAINER (Light)
// ============================================================================
export function VPCRouteTablesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What are Route Tables?", description: "Rules determining where network traffic is directed. Each subnet must be associated with one route table." },
    { title: "Routes", description: "Entries with destination (CIDR) and target (IGW, NAT, VPC endpoint, peering, etc)." },
    { title: "Most Specific Wins", description: "When multiple routes match, most specific CIDR wins. 10.0.1.0/24 beats 10.0.0.0/16." },
    { title: "Main Route Table", description: "Default for subnets without explicit association. Keep it private - use custom tables." }
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
        <h1 className="text-2xl font-bold text-white mb-2">VPC Route Tables</h1>
        <p className="text-slate-400">Directing network traffic flow</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Public Subnet Route Table</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left p-2">Destination</th>
                <th className="text-left p-2">Target</th>
                <th className="text-left p-2">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="p-2 font-mono">10.0.0.0/16</td>
                <td className="p-2 text-blue-400">local</td>
                <td className="p-2">VPC internal</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="p-2 font-mono">0.0.0.0/0</td>
                <td className="p-2 text-green-400">igw-xxx</td>
                <td className="p-2">Internet</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="p-2 font-mono">pl-xxx (S3)</td>
                <td className="p-2 text-purple-400">vpce-xxx</td>
                <td className="p-2">S3 Gateway</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-sm text-slate-400 mb-3">Private Subnet Route Table</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left p-2">Destination</th>
                <th className="text-left p-2">Target</th>
                <th className="text-left p-2">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="p-2 font-mono">10.0.0.0/16</td>
                <td className="p-2 text-blue-400">local</td>
                <td className="p-2">VPC internal</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="p-2 font-mono">0.0.0.0/0</td>
                <td className="p-2 text-orange-400">nat-xxx</td>
                <td className="p-2">NAT Gateway</td>
              </tr>
            </tbody>
          </table>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Each subnet associated with exactly one route table</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Most specific route (longest prefix) wins</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>&quot;local&quot; route for VPC CIDR is automatic and can&apos;t be removed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>0.0.0.0/0 to IGW makes subnet public</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// VPC FLOW LOGS EXPLAINER (Light)
// ============================================================================
export function VPCFlowLogsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What are Flow Logs?", description: "Capture IP traffic information for VPC, subnet, or ENI. Great for troubleshooting and security." },
    { title: "Destinations", description: "Send logs to CloudWatch Logs, S3, or Kinesis Firehose. Each has different use cases." },
    { title: "Log Content", description: "Source/dest IP, ports, protocol, packets, bytes, action (ACCEPT/REJECT)." },
    { title: "Aggregation", description: "Logs aggregated over time windows. Not real-time - typically 10-15 min delay." }
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
        <h1 className="text-2xl font-bold text-white mb-2">VPC Flow Logs</h1>
        <p className="text-slate-400">Monitoring network traffic</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400 mb-3">Sample Flow Log Entry</div>
          <div className="bg-slate-800 rounded p-3 font-mono text-xs text-green-400 overflow-x-auto">
            2 123456789012 eni-xxx 10.0.1.100 52.94.76.5 443 49152 6 25 5000 1620000000 1620000060 ACCEPT OK
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400">Source IP</div>
              <div className="text-blue-400 font-mono">10.0.1.100</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400">Dest IP</div>
              <div className="text-green-400 font-mono">52.94.76.5</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400">Action</div>
              <div className="text-green-400 font-mono">ACCEPT</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400">Bytes</div>
              <div className="text-purple-400 font-mono">5000</div>
            </div>
          </div>

          {/* Destinations */}
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-orange-500 rounded p-2 text-white text-xs text-center">CloudWatch Logs</div>
            <div className="bg-green-500 rounded p-2 text-white text-xs text-center">S3 Bucket</div>
            <div className="bg-blue-500 rounded p-2 text-white text-xs text-center">Kinesis Firehose</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can enable at VPC, subnet, or ENI level</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Doesn&apos;t capture packet contents - just metadata</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Some traffic not logged: DHCP, DNS, metadata, etc.</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Not real-time - 10-15 minute aggregation delay</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// TRANSIT GATEWAY EXPLAINER (Medium)
// ============================================================================
export function VPCTransitGatewayExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is Transit Gateway?", description: "Hub to connect VPCs, VPNs, and Direct Connect. Simplifies complex network topologies." },
    { title: "Hub and Spoke", description: "Central hub - attach VPCs as spokes. Transitive routing (unlike VPC peering)." },
    { title: "Route Tables", description: "TGW has its own route tables. Control which attachments can communicate." },
    { title: "Cross-Region", description: "Peer Transit Gateways across regions for global connectivity." }
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
        <h1 className="text-2xl font-bold text-white mb-2">Transit Gateway</h1>
        <p className="text-slate-400">Central hub for VPC connectivity</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="relative flex justify-center items-center h-64">
            {/* Transit Gateway (center) */}
            <div className="bg-purple-500 rounded-full p-6 text-white text-center z-10">
              <div className="text-2xl">🔀</div>
              <div className="text-xs">Transit Gateway</div>
            </div>

            {/* VPCs around */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-500 rounded p-2 text-white text-xs">VPC A</div>
            </div>
            <div className="absolute top-1/4 right-8">
              <div className="bg-green-500 rounded p-2 text-white text-xs">VPC B</div>
            </div>
            <div className="absolute bottom-1/4 right-8">
              <div className="bg-orange-500 rounded p-2 text-white text-xs">VPC C</div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-500 rounded p-2 text-white text-xs">On-Prem (VPN)</div>
            </div>
            <div className="absolute top-1/4 left-8">
              <div className="bg-yellow-500 rounded p-2 text-black text-xs">Direct Connect</div>
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line x1="50%" y1="20%" x2="50%" y2="35%" stroke="#3b82f6" strokeWidth="2" />
              <line x1="70%" y1="30%" x2="58%" y2="45%" stroke="#22c55e" strokeWidth="2" />
              <line x1="70%" y1="70%" x2="58%" y2="55%" stroke="#f97316" strokeWidth="2" />
              <line x1="50%" y1="80%" x2="50%" y2="65%" stroke="#ef4444" strokeWidth="2" />
              <line x1="25%" y1="30%" x2="42%" y2="45%" stroke="#eab308" strokeWidth="2" />
            </svg>
          </div>

          <div className="text-center text-xs text-slate-400 mt-2">
            All VPCs can communicate through Transit Gateway (transitive routing)
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Transit Gateway supports TRANSITIVE routing (unlike peering)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Attach VPCs, VPN, Direct Connect to single hub</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Per-attachment hourly cost + data processing</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Better for complex topologies (many VPCs) vs peering</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// PRIVATELINK EXPLAINER (Medium)
// ============================================================================
export function VPCPrivateLinkExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "What is PrivateLink?", description: "Expose services privately to other VPCs/accounts. Consumer sees it as local endpoint." },
    { title: "Service Provider", description: "Create endpoint service backed by NLB. Share with specific AWS accounts or make public." },
    { title: "Service Consumer", description: "Create interface endpoint. Gets private IP in their VPC to access your service." },
    { title: "Security", description: "Traffic never leaves AWS network. No VPC peering or internet exposure needed." }
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
        <h1 className="text-2xl font-bold text-white mb-2">AWS PrivateLink</h1>
        <p className="text-slate-400">Private service connectivity</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Consumer VPC */}
            <div className="border border-blue-500/30 rounded-lg p-4 flex-1 mr-4">
              <div className="text-xs text-blue-400 mb-2">Consumer VPC (Account B)</div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded p-2 text-white text-xs">EC2</div>
                <div className="text-slate-400">→</div>
                <div className="bg-purple-500 rounded p-2 text-white text-xs">ENI</div>
              </div>
              <div className="text-xs text-slate-400 mt-2">vpce-xxx.svc.local</div>
            </div>

            {/* PrivateLink */}
            <div className="bg-purple-500 rounded-full p-4 text-white text-center">
              <div className="text-lg">🔗</div>
              <div className="text-xs">PrivateLink</div>
            </div>

            {/* Provider VPC */}
            <div className="border border-green-500/30 rounded-lg p-4 flex-1 ml-4">
              <div className="text-xs text-green-400 mb-2">Provider VPC (Account A)</div>
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 rounded p-2 text-white text-xs">NLB</div>
                <div className="text-slate-400">→</div>
                <div className="bg-green-500 rounded p-2 text-white text-xs">App</div>
              </div>
              <div className="text-xs text-slate-400 mt-2">Endpoint Service</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-800 rounded text-center text-xs text-slate-400">
            Consumer accesses service via private IP - no internet, no peering
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Provider: Endpoint service backed by NLB</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Consumer: Interface endpoint with private IP</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>No VPC peering or internet needed</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Interface endpoints for AWS services also use PrivateLink</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// BASTION VS SESSION MANAGER EXPLAINER (Medium)
// ============================================================================
export function VPCBastionVsSessionManagerExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [method, setMethod] = useState<"bastion" | "ssm">("ssm")

  const steps = [
    { title: "Accessing Private Instances", description: "How to SSH/RDP to instances in private subnets without public IP." },
    { title: "Bastion Host", description: "EC2 in public subnet. SSH to bastion, then to private instance. Requires SSH key management." },
    { title: "Session Manager", description: "AWS Systems Manager feature. No bastion needed. Browser-based, IAM auth, audit logged." },
    { title: "Comparison", description: "Session Manager: more secure, no SSH keys, audit trail. Bastion: traditional, SSH-native tools." }
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
        <h1 className="text-2xl font-bold text-white mb-2">Bastion vs Session Manager</h1>
        <p className="text-slate-400">Accessing private instances securely</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setMethod("bastion")} className={`px-4 py-2 rounded-lg ${method === "bastion" ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}>Bastion Host</button>
          <button onClick={() => setMethod("ssm")} className={`px-4 py-2 rounded-lg ${method === "ssm" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}>Session Manager</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {method === "bastion" ? (
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="bg-purple-500 rounded p-3 text-white">👤 User</div>
              </div>
              <div className="text-slate-400">→ SSH →</div>
              <div className="bg-orange-500 rounded p-3 text-white text-xs">
                Bastion<br/>(public)
              </div>
              <div className="text-slate-400">→ SSH →</div>
              <div className="bg-blue-500 rounded p-3 text-white text-xs">
                EC2<br/>(private)
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="bg-purple-500 rounded p-3 text-white">👤 User</div>
              </div>
              <div className="text-slate-400">→ IAM →</div>
              <div className="bg-green-500 rounded p-3 text-white text-xs">
                Session<br/>Manager
              </div>
              <div className="text-slate-400">→ SSM Agent →</div>
              <div className="bg-blue-500 rounded p-3 text-white text-xs">
                EC2<br/>(private)
              </div>
            </div>
          )}

          {/* Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${method === "bastion" ? "bg-orange-500/20 border border-orange-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-orange-400">Bastion Host</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>• Need public subnet + EC2</li>
                <li>• SSH key management</li>
                <li>• Open port 22</li>
                <li>• Traditional SSH tools</li>
              </ul>
            </div>
            <div className={`p-3 rounded ${method === "ssm" ? "bg-green-500/20 border border-green-500" : "bg-slate-800"}`}>
              <div className="text-sm font-medium text-green-400">Session Manager</div>
              <ul className="text-xs text-slate-300 mt-2 space-y-1">
                <li>• No public infra needed</li>
                <li>• IAM authentication</li>
                <li>• No inbound ports</li>
                <li>• CloudTrail audit logs</li>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Session Manager: preferred for security, no SSH keys or public IPs</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Requires SSM Agent (pre-installed on Amazon Linux 2/2023)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Need VPC endpoint or NAT for SSM if no internet</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Bastion: still valid for SSH-native workflows</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================
export const vpcExplainers = {
  "vpc-subnets": VPCSubnetsExplainer,
  "vpc-security-groups-nacls": VPCSecurityGroupsVsNACLsExplainer,
  "vpc-nat-gateway": VPCNATGatewayExplainer,
  "vpc-endpoints": VPCEndpointsExplainer,
  "vpc-peering": VPCPeeringExplainer,
  "vpc-route-tables": VPCRouteTablesExplainer,
  "vpc-flow-logs": VPCFlowLogsExplainer,
  "vpc-transit-gateway": VPCTransitGatewayExplainer,
  "vpc-privatelink": VPCPrivateLinkExplainer,
  "vpc-bastion-session-manager": VPCBastionVsSessionManagerExplainer,
}
