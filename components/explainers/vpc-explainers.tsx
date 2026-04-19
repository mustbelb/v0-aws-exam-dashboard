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

  useEffect(() => {
    const typeByStep: Array<"public" | "private"> = ["public", "public", "private", "public"]
    if (typeByStep[step]) setSubnetType(typeByStep[step])
  }, [step])

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

  useEffect(() => {
    const layerByStep: Array<"sg" | "nacl"> = ["sg", "sg", "nacl", "sg"]
    if (layerByStep[step]) setLayer(layerByStep[step])
  }, [step])

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

  useEffect(() => {
    const natByStep: Array<boolean> = [false, true, true, true]
    setHasNat(natByStep[step])
  }, [step])

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

  useEffect(() => {
    const typeByStep: Array<"gateway" | "interface"> = ["gateway", "gateway", "interface", "interface"]
    if (typeByStep[step]) setEndpointType(typeByStep[step])
  }, [step])

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
  const [focus, setFocus] = useState<"overview" | "requirements" | "crossaccount" | "routes">("overview")

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

  useEffect(() => {
    const focusByStep: Array<"overview" | "requirements" | "crossaccount" | "routes"> = ["overview", "requirements", "crossaccount", "routes"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
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
  const [focus, setFocus] = useState<"overview" | "routes" | "specificity" | "main">("overview")

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

  useEffect(() => {
    const focusByStep: Array<"overview" | "routes" | "specificity" | "main"> = ["overview", "routes", "specificity", "main"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
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
  const [focus, setFocus] = useState<"overview" | "destinations" | "content" | "aggregation">("overview")

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

  useEffect(() => {
    const focusByStep: Array<"overview" | "destinations" | "content" | "aggregation"> = ["overview", "destinations", "content", "aggregation"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
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
  const [focus, setFocus] = useState<"overview" | "hubspoke" | "routes" | "crossregion">("overview")

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

  useEffect(() => {
    const focusByStep: Array<"overview" | "hubspoke" | "routes" | "crossregion"> = ["overview", "hubspoke", "routes", "crossregion"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
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
  const [focus, setFocus] = useState<"overview" | "provider" | "consumer" | "security">("overview")

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

  useEffect(() => {
    const focusByStep: Array<"overview" | "provider" | "consumer" | "security"> = ["overview", "provider", "consumer", "security"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
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

  useEffect(() => {
    const methodByStep: Array<"bastion" | "ssm"> = ["ssm", "bastion", "ssm", "ssm"]
    if (methodByStep[step]) setMethod(methodByStep[step])
  }, [step])

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
// INTERNET GATEWAY EXPLAINER (Light)
// ============================================================================
export function VPCInternetGatewayExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasIgw, setHasIgw] = useState(true)

  const steps = [
    { title: "What is Internet Gateway?", description: "Horizontally scaled, redundant, highly available VPC component for internet connectivity." },
    { title: "Key Function", description: "Performs NAT for instances with public IPs. Translates private to public IP for outbound traffic." },
    { title: "One per VPC", description: "Only one IGW can be attached to a VPC at a time. Detach before attaching new one." },
    { title: "Route Table Entry", description: "Add route 0.0.0.0/0 -> IGW to make subnet public. Instance also needs public IP." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const igwByStep: Array<boolean> = [false, true, true, true]
    setHasIgw(igwByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Internet Gateway</h1>
        <p className="text-slate-400">VPC internet connectivity</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center mb-6">
          <button onClick={() => setHasIgw(!hasIgw)} className={`px-4 py-2 rounded-lg ${hasIgw ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            IGW: {hasIgw ? "Attached" : "Detached"}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* VPC */}
            <div className="border-2 border-blue-500/30 rounded-lg p-4 flex-1 mr-4">
              <div className="text-xs text-blue-400 mb-2">VPC</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-500/20 border border-green-500/50 rounded p-2">
                  <div className="text-xs text-green-400">Public Subnet</div>
                  <div className="bg-blue-500 rounded p-1 text-white text-xs mt-1">EC2 + Public IP</div>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/50 rounded p-2">
                  <div className="text-xs text-orange-400">Private Subnet</div>
                  <div className="bg-blue-500 rounded p-1 text-white text-xs mt-1">EC2 Private</div>
                </div>
              </div>
            </div>

            {/* Internet Gateway */}
            <div className={`rounded-lg p-4 text-center ${hasIgw ? "bg-yellow-500 text-black" : "bg-slate-700 text-slate-500"}`}>
              <div className="text-2xl">{hasIgw ? "🌐" : "❌"}</div>
              <div className="text-xs font-medium">IGW</div>
            </div>

            {/* Internet */}
            <div className="ml-4 text-center">
              <div className="text-4xl">☁️</div>
              <div className="text-xs text-slate-400">Internet</div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs">
            <span className={hasIgw ? "text-green-400" : "text-red-400"}>
              {hasIgw ? "✓ Public subnet EC2 can reach internet" : "✗ No internet connectivity"}
            </span>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>IGW is horizontally scaled, redundant, and highly available</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Only ONE IGW per VPC</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Instance needs public IP AND route to IGW for internet</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>No cost for IGW itself (only data transfer)</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// ELASTIC IP EXPLAINER (Light)
// ============================================================================
export function VPCElasticIPExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [eipAllocated, setEipAllocated] = useState(true)

  const steps = [
    { title: "What is Elastic IP?", description: "Static, public IPv4 address you own until you release it. Survives instance stop/start." },
    { title: "Association", description: "Associate EIP with instance or network interface. One EIP per instance at a time." },
    { title: "Cost Model", description: "FREE when associated with running instance. CHARGED when unused or associated with stopped instance." },
    { title: "Limits", description: "5 EIPs per region by default. Can request increase. Use sparingly - IPv4 addresses are scarce." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const eipByStep: Array<boolean> = [true, true, false, true]
    setEipAllocated(eipByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Elastic IP Addresses</h1>
        <p className="text-slate-400">Static public IPv4 addresses</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center mb-6">
          <button onClick={() => setEipAllocated(!eipAllocated)} className={`px-4 py-2 rounded-lg ${eipAllocated ? "bg-green-500 text-white" : "bg-orange-500 text-white"}`}>
            EIP: {eipAllocated ? "Associated" : "Unassociated"}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            {/* Elastic IP */}
            <div className={`rounded-lg p-4 text-center ${eipAllocated ? "bg-green-500" : "bg-orange-500"}`}>
              <div className="text-white text-sm font-mono">54.23.45.67</div>
              <div className="text-xs text-white/80">Elastic IP</div>
            </div>

            {eipAllocated ? (
              <>
                <div className="text-green-400">→ associated →</div>
                <div className="bg-blue-500 rounded-lg p-4 text-white">
                  <div className="text-2xl">🖥️</div>
                  <div className="text-xs">EC2 Running</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-orange-400">not associated</div>
                <div className="bg-slate-700 rounded-lg p-4 text-slate-500">
                  <div className="text-2xl">❓</div>
                  <div className="text-xs">No Instance</div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 p-3 bg-slate-800 rounded">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Cost:</span>
              <span className={eipAllocated ? "text-green-400" : "text-red-400"}>
                {eipAllocated ? "FREE (associated with running instance)" : "$0.005/hour (unused EIP charge)"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-green-500/20 rounded p-2">
              <div className="text-green-400">Free</div>
              <div className="text-slate-400">Associated + Running</div>
            </div>
            <div className="bg-red-500/20 rounded p-2">
              <div className="text-red-400">Charged</div>
              <div className="text-slate-400">Unassociated</div>
            </div>
            <div className="bg-red-500/20 rounded p-2">
              <div className="text-red-400">Charged</div>
              <div className="text-slate-400">Instance Stopped</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>EIP is CHARGED when not associated or instance is stopped</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>5 EIPs per region default limit</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Best practice: use DNS names instead of EIPs when possible</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can move EIP between instances instantly</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// VPC DNS EXPLAINER (Medium)
// ============================================================================
export function VPCDNSExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"basics" | "hostnames" | "resolution" | "privatezone">("basics")

  const steps = [
    { title: "VPC DNS Basics", description: "AWS provides DNS server at VPC base + 2 (e.g., 10.0.0.2). Called Route 53 Resolver." },
    { title: "DNS Hostnames", description: "enableDnsHostnames: assigns public DNS to instances with public IPs (ec2-x-x-x-x.region.compute.amazonaws.com)." },
    { title: "DNS Resolution", description: "enableDnsSupport: allows VPC to use AWS DNS. If disabled, must provide own DNS." },
    { title: "Private Hosted Zones", description: "Route 53 private zones let you use custom domain names within VPC (e.g., db.internal)." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const focusByStep: Array<"basics" | "hostnames" | "resolution" | "privatezone"> = ["basics", "hostnames", "resolution", "privatezone"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">VPC DNS Settings</h1>
        <p className="text-slate-400">DNS resolution and hostnames in VPC</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* DNS Architecture */}
          <div className="border-2 border-blue-500/30 rounded-lg p-4">
            <div className="text-xs text-blue-400 mb-4">VPC 10.0.0.0/16</div>

            <div className="grid grid-cols-3 gap-4">
              {/* EC2 Instance */}
              <div className="bg-blue-500 rounded p-3 text-white text-center">
                <div className="text-xs">EC2 Instance</div>
                <div className="font-mono text-xs mt-1">10.0.1.50</div>
              </div>

              {/* DNS Server */}
              <div className="bg-green-500 rounded p-3 text-white text-center">
                <div className="text-xs">Route 53 Resolver</div>
                <div className="font-mono text-xs mt-1">10.0.0.2</div>
              </div>

              {/* Result */}
              <div className="bg-purple-500 rounded p-3 text-white text-center">
                <div className="text-xs">Resolved Name</div>
                <div className="font-mono text-xs mt-1 break-all">ip-10-0-1-50</div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-sm font-medium text-green-400 mb-2">enableDnsSupport</div>
              <div className="text-xs text-slate-300">Queries go to Route 53 Resolver (10.0.0.2)</div>
              <div className="text-xs text-slate-400 mt-1">Default: true</div>
            </div>
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-sm font-medium text-purple-400 mb-2">enableDnsHostnames</div>
              <div className="text-xs text-slate-300">Instances get public DNS hostname</div>
              <div className="text-xs text-slate-400 mt-1">Default: false (except default VPC)</div>
            </div>
          </div>

          {/* Private Hosted Zone */}
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
            <div className="text-sm font-medium text-orange-400 mb-2">Private Hosted Zone Example</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-500 text-white px-2 py-1 rounded">app.internal</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-300">10.0.1.50</span>
              <span className="text-slate-400">(custom domain within VPC)</span>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AWS DNS at VPC CIDR base + 2 (10.0.0.2 for 10.0.0.0/16)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Both settings must be enabled for VPC endpoints to work</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Private hosted zones need enableDnsHostnames = true</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can use Route 53 Resolver endpoints for hybrid DNS</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// VPC CIDR PLANNING EXPLAINER (Medium)
// ============================================================================
export function VPCCIDRPlanningExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [focus, setFocus] = useState<"basics" | "secondary" | "subnets" | "conflicts">("basics")

  const steps = [
    { title: "VPC CIDR Basics", description: "VPC requires IPv4 CIDR block. Range: /16 (65,536 IPs) to /28 (16 IPs). Can't change primary CIDR." },
    { title: "Secondary CIDRs", description: "Can add up to 4 secondary CIDRs. Must not overlap with primary or other associated CIDRs." },
    { title: "Subnet Planning", description: "Divide VPC CIDR into subnets. AWS reserves 5 IPs per subnet. Plan for growth." },
    { title: "Avoiding Conflicts", description: "Don't overlap with on-premises or other VPCs you'll peer with. Use private IP ranges (RFC 1918)." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const focusByStep: Array<"basics" | "secondary" | "subnets" | "conflicts"> = ["basics", "secondary", "subnets", "conflicts"]
    if (focusByStep[step]) setFocus(focusByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto" data-focus={focus}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">VPC CIDR Planning</h1>
        <p className="text-slate-400">Designing IP address allocation</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          {/* VPC CIDR Visualization */}
          <div className="border-2 border-blue-500/30 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-400 text-sm">VPC: 10.0.0.0/16</span>
              <span className="text-xs text-slate-400">65,536 IPs</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-green-500/20 border border-green-500 rounded p-2 text-xs">
                <div className="text-green-400">Public AZ-A</div>
                <div className="font-mono text-slate-300">10.0.1.0/24</div>
                <div className="text-slate-500">251 usable</div>
              </div>
              <div className="bg-green-500/20 border border-green-500 rounded p-2 text-xs">
                <div className="text-green-400">Public AZ-B</div>
                <div className="font-mono text-slate-300">10.0.2.0/24</div>
                <div className="text-slate-500">251 usable</div>
              </div>
              <div className="bg-orange-500/20 border border-orange-500 rounded p-2 text-xs">
                <div className="text-orange-400">Private AZ-A</div>
                <div className="font-mono text-slate-300">10.0.10.0/24</div>
                <div className="text-slate-500">251 usable</div>
              </div>
              <div className="bg-orange-500/20 border border-orange-500 rounded p-2 text-xs">
                <div className="text-orange-400">Private AZ-B</div>
                <div className="font-mono text-slate-300">10.0.11.0/24</div>
                <div className="text-slate-500">251 usable</div>
              </div>
            </div>
          </div>

          {/* Reserved IPs */}
          <div className="bg-slate-800 p-3 rounded mb-4">
            <div className="text-sm font-medium text-red-400 mb-2">5 Reserved IPs per Subnet</div>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="bg-red-500/20 rounded p-2 text-center">
                <div className="text-red-400">.0</div>
                <div className="text-slate-400">Network</div>
              </div>
              <div className="bg-red-500/20 rounded p-2 text-center">
                <div className="text-red-400">.1</div>
                <div className="text-slate-400">VPC Router</div>
              </div>
              <div className="bg-red-500/20 rounded p-2 text-center">
                <div className="text-red-400">.2</div>
                <div className="text-slate-400">DNS</div>
              </div>
              <div className="bg-red-500/20 rounded p-2 text-center">
                <div className="text-red-400">.3</div>
                <div className="text-slate-400">Future</div>
              </div>
              <div className="bg-red-500/20 rounded p-2 text-center">
                <div className="text-red-400">.255</div>
                <div className="text-slate-400">Broadcast</div>
              </div>
            </div>
          </div>

          {/* RFC 1918 Ranges */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded text-center">
              <div className="text-purple-400">10.0.0.0/8</div>
              <div className="text-slate-400">16M IPs</div>
            </div>
            <div className="bg-slate-800 p-2 rounded text-center">
              <div className="text-purple-400">172.16.0.0/12</div>
              <div className="text-slate-400">1M IPs</div>
            </div>
            <div className="bg-slate-800 p-2 rounded text-center">
              <div className="text-purple-400">192.168.0.0/16</div>
              <div className="text-slate-400">65K IPs</div>
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>VPC CIDR: /16 (largest) to /28 (smallest)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>AWS reserves 5 IPs per subnet (first 4 + last)</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Can&apos;t resize primary CIDR - plan ahead!</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Use RFC 1918 private ranges to avoid conflicts</span></li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// DIRECT CONNECT EXPLAINER (Medium)
// ============================================================================
export function VPCDirectConnectExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [connectionType, setConnectionType] = useState<"dedicated" | "hosted">("dedicated")

  const steps = [
    { title: "What is Direct Connect?", description: "Dedicated network connection from on-premises to AWS. Bypasses public internet for consistent performance." },
    { title: "Connection Types", description: "Dedicated: physical port (1Gbps, 10Gbps, 100Gbps). Hosted: share partner's connection (50Mbps to 10Gbps)." },
    { title: "Virtual Interfaces", description: "Public VIF: access AWS public services. Private VIF: access VPC resources. Transit VIF: access Transit Gateway." },
    { title: "High Availability", description: "Single DX is single point of failure. Use redundant connections or DX + VPN backup for resilience." }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const typeByStep: Array<"dedicated" | "hosted"> = ["dedicated", "hosted", "dedicated", "dedicated"]
    if (typeByStep[step]) setConnectionType(typeByStep[step])
  }, [step])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AWS Direct Connect</h1>
        <p className="text-slate-400">Dedicated hybrid connectivity</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setConnectionType("dedicated")} className={`px-4 py-2 rounded-lg ${connectionType === "dedicated" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>Dedicated</button>
          <button onClick={() => setConnectionType("hosted")} className={`px-4 py-2 rounded-lg ${connectionType === "hosted" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}>Hosted</button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* On-Premises */}
            <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">🏢</div>
              <div className="text-xs">On-Premises</div>
            </div>

            {/* Connection */}
            <div className="flex-1 mx-4">
              <div className={`h-2 rounded ${connectionType === "dedicated" ? "bg-blue-500" : "bg-purple-500"}`}></div>
              <div className="text-center text-xs text-slate-400 mt-1">
                {connectionType === "dedicated" ? "Physical Fiber (1/10/100 Gbps)" : "Partner Connection (50Mbps-10Gbps)"}
              </div>
            </div>

            {/* DX Location */}
            <div className="bg-yellow-500 rounded-lg p-4 text-black text-center">
              <div className="text-2xl">🔌</div>
              <div className="text-xs">DX Location</div>
            </div>

            {/* AWS Connection */}
            <div className="flex-1 mx-4">
              <div className="h-2 bg-green-500 rounded"></div>
              <div className="text-center text-xs text-slate-400 mt-1">AWS Backbone</div>
            </div>

            {/* AWS */}
            <div className="bg-green-500 rounded-lg p-4 text-white text-center">
              <div className="text-2xl">☁️</div>
              <div className="text-xs">AWS Region</div>
            </div>
          </div>

          {/* Virtual Interfaces */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-green-500/20 border border-green-500 rounded p-3 text-center">
              <div className="text-sm font-medium text-green-400">Private VIF</div>
              <div className="text-xs text-slate-400 mt-1">Access VPC (via VGW)</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500 rounded p-3 text-center">
              <div className="text-sm font-medium text-blue-400">Public VIF</div>
              <div className="text-xs text-slate-400 mt-1">S3, DynamoDB, etc.</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500 rounded p-3 text-center">
              <div className="text-sm font-medium text-purple-400">Transit VIF</div>
              <div className="text-xs text-slate-400 mt-1">Access TGW</div>
            </div>
          </div>

          {/* Lead Time Warning */}
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-center text-red-400">
            ⚠️ Direct Connect setup takes weeks to months - plan ahead!
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
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Direct Connect: consistent latency, bypasses internet</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>NOT encrypted by default - use VPN over DX for encryption</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Long lead time - takes weeks/months to provision</span></li>
          <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>For HA: two DX connections in different locations</span></li>
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
  "vpc-internet-gateway": VPCInternetGatewayExplainer,
  "vpc-elastic-ip": VPCElasticIPExplainer,
  "vpc-dns": VPCDNSExplainer,
  "vpc-cidr-planning": VPCCIDRPlanningExplainer,
  "vpc-direct-connect": VPCDirectConnectExplainer,
}
