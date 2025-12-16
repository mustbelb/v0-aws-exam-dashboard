"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FileCode, Layers, RefreshCw, Package } from "lucide-react"

// 1. Template Structure Explainer (Rich)
export function TemplateStructureExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSection, setSelectedSection] = useState<"parameters" | "resources" | "outputs">("resources")

  const steps = [
    { title: "CloudFormation Templates", description: "JSON or YAML files that define your AWS infrastructure as code" },
    { title: "Template Sections", description: "Parameters, Resources (required), Outputs, Mappings, Conditions" },
    { title: "Resources Section", description: "The only required section - defines AWS resources to create" },
    { title: "Parameters", description: "Input values that customize template behavior at runtime" },
    { title: "Outputs", description: "Return values that can be imported by other stacks" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const templateSections = {
    parameters: `Parameters:
  EnvironmentType:
    Type: String
    AllowedValues:
      - dev
      - prod
    Default: dev
  InstanceType:
    Type: String
    Default: t3.micro`,
    resources: `Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0123456789
      InstanceType: !Ref InstanceType
      Tags:
        - Key: Environment
          Value: !Ref EnvironmentType`,
    outputs: `Outputs:
  InstanceId:
    Description: The Instance ID
    Value: !Ref MyEC2Instance
    Export:
      Name: !Sub \${AWS::StackName}-InstanceId`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Template Structure</h2>
      </div>

      {/* Section Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "parameters", label: "Parameters", color: "blue" },
          { key: "resources", label: "Resources", color: "orange" },
          { key: "outputs", label: "Outputs", color: "green" }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setSelectedSection(key as typeof selectedSection)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSection === key
                ? `bg-${color}-600 text-white`
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            style={{
              backgroundColor: selectedSection === key ?
                (color === "blue" ? "#2563eb" : color === "orange" ? "#ea580c" : "#16a34a")
                : undefined
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* Template Structure Diagram */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`p-3 rounded-lg border-2 transition-all ${
            selectedSection === "parameters" ? "border-blue-500 bg-blue-900/30" : "border-gray-600 bg-gray-700"
          }`}>
            <div className="text-sm font-semibold text-center">Parameters</div>
            <div className="text-xs text-gray-400 text-center">Inputs</div>
          </div>
          <div className="text-gray-500">→</div>
          <div className={`p-3 rounded-lg border-2 transition-all ${
            selectedSection === "resources" ? "border-orange-500 bg-orange-900/30" : "border-gray-600 bg-gray-700"
          }`}>
            <div className="text-sm font-semibold text-center">Resources</div>
            <div className="text-xs text-gray-400 text-center">Required</div>
          </div>
          <div className="text-gray-500">→</div>
          <div className={`p-3 rounded-lg border-2 transition-all ${
            selectedSection === "outputs" ? "border-green-500 bg-green-900/30" : "border-gray-600 bg-gray-700"
          }`}>
            <div className="text-sm font-semibold text-center">Outputs</div>
            <div className="text-xs text-gray-400 text-center">Exports</div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs ${
              selectedSection === "parameters" ? "bg-blue-600" :
              selectedSection === "resources" ? "bg-orange-600" : "bg-green-600"
            } text-white`}>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </span>
            <span className="text-xs text-gray-500">YAML</span>
          </div>
          <pre className="text-sm font-mono text-yellow-400 overflow-auto whitespace-pre-wrap">
            {templateSections[selectedSection]}
          </pre>
        </div>
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
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Resources is the ONLY required section</li>
          <li>• !Ref returns the value of a parameter or resource ID</li>
          <li>• !Sub performs string substitution with variables</li>
          <li>• Outputs can be exported for cross-stack references</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Stack Operations Explainer (Medium)
export function StackOperationsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [operation, setOperation] = useState<"create" | "update" | "delete">("create")
  const [stackStatus, setStackStatus] = useState("CREATE_IN_PROGRESS")

  const steps = [
    { title: "Stack Lifecycle", description: "Create, update, and delete operations manage your infrastructure" },
    { title: "Create Stack", description: "Provisions all resources defined in template" },
    { title: "Update Stack", description: "Change sets preview changes before applying" },
    { title: "Delete Stack", description: "Removes all resources (unless DeletionPolicy: Retain)" },
    { title: "Rollback", description: "Automatic rollback on failure to previous stable state" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    const statuses = {
      create: ["CREATE_IN_PROGRESS", "CREATE_COMPLETE"],
      update: ["UPDATE_IN_PROGRESS", "UPDATE_COMPLETE"],
      delete: ["DELETE_IN_PROGRESS", "DELETE_COMPLETE"]
    }
    setStackStatus(statuses[operation][0])
    const timer = setTimeout(() => {
      setStackStatus(statuses[operation][1])
    }, 2000)
    return () => clearTimeout(timer)
  }, [operation])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Stack Operations</h2>
      </div>

      {/* Operation Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "create", label: "Create", color: "green" },
          { key: "update", label: "Update", color: "yellow" },
          { key: "delete", label: "Delete", color: "red" }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setOperation(key as typeof operation)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              operation === key
                ? `bg-${color}-600 text-white`
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            style={{
              backgroundColor: operation === key ?
                (color === "green" ? "#16a34a" : color === "yellow" ? "#ca8a04" : "#dc2626")
                : undefined
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* Stack Status */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
            stackStatus.includes("COMPLETE") ? "bg-green-600" :
            stackStatus.includes("PROGRESS") ? "bg-yellow-600" :
            "bg-gray-600"
          }`}>
            {stackStatus.includes("PROGRESS") && (
              <RefreshCw className="w-5 h-5 text-white animate-spin" />
            )}
            <span className="text-white font-semibold">{stackStatus}</span>
          </div>
        </div>

        {/* Stack Resources */}
        <div className="grid grid-cols-3 gap-4">
          {["VPC", "Subnet", "EC2"].map((resource, i) => {
            const resourceStatus = operation === "delete"
              ? (stackStatus.includes("COMPLETE") ? "DELETED" : "DELETING")
              : (stackStatus.includes("COMPLETE") ? "CREATED" : "CREATING")

            return (
              <div key={i} className={`p-4 rounded-lg ${
                operation === "delete"
                  ? (stackStatus.includes("COMPLETE") ? "bg-gray-700 opacity-50" : "bg-red-900/30")
                  : (stackStatus.includes("COMPLETE") ? "bg-green-900/30" : "bg-yellow-900/30")
              }`}>
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {resource === "VPC" ? "🌐" : resource === "Subnet" ? "🔲" : "💻"}
                  </div>
                  <div className="text-sm text-white font-semibold">{resource}</div>
                  <div className="text-xs text-gray-400 mt-1">{resourceStatus}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Change Set Info (for Update) */}
        {operation === "update" && (
          <div className="mt-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-400 mb-2">Change Set Preview</div>
            <div className="text-xs text-gray-300 space-y-1">
              <div>✓ EC2Instance - Modify (InstanceType)</div>
              <div>✓ SecurityGroup - No change</div>
              <div>+ NewS3Bucket - Add</div>
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
          <li>• Change sets preview updates before execution</li>
          <li>• DeletionPolicy: Retain keeps resources after stack delete</li>
          <li>• Automatic rollback on CREATE_FAILED or UPDATE_FAILED</li>
          <li>• Stack events show detailed resource status</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Intrinsic Functions Explainer (Medium)
export function IntrinsicFunctionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState("Ref")

  const steps = [
    { title: "Intrinsic Functions", description: "Built-in functions for dynamic values in templates" },
    { title: "!Ref", description: "Return parameter value or resource physical ID" },
    { title: "!GetAtt", description: "Get attribute from a resource (e.g., ARN, DNS name)" },
    { title: "!Sub", description: "Substitute variables in strings" },
    { title: "!ImportValue", description: "Import values exported from other stacks" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const functions = {
    Ref: {
      syntax: "!Ref LogicalName",
      example: "!Ref MyS3Bucket",
      result: "my-bucket-abc123",
      description: "Returns physical ID or parameter value"
    },
    GetAtt: {
      syntax: "!GetAtt Resource.Attribute",
      example: "!GetAtt MyS3Bucket.Arn",
      result: "arn:aws:s3:::my-bucket-abc123",
      description: "Returns specific resource attribute"
    },
    Sub: {
      syntax: "!Sub String",
      example: "!Sub 'arn:aws:s3:::${BucketName}/*'",
      result: "arn:aws:s3:::my-bucket-abc123/*",
      description: "Variable substitution in strings"
    },
    ImportValue: {
      syntax: "!ImportValue ExportName",
      example: "!ImportValue SharedVPC-VPCID",
      result: "vpc-abc123def456",
      description: "Import from another stack's exports"
    }
  }

  const currentFunc = functions[selectedFunction as keyof typeof functions]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Intrinsic Functions</h2>
      </div>

      {/* Function Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.keys(functions).map((func) => (
          <button
            key={func}
            onClick={() => setSelectedFunction(func)}
            className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all ${
              selectedFunction === func
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            !{func}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="space-y-4">
          {/* Syntax */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Syntax</div>
            <div className="font-mono text-purple-400">{currentFunc.syntax}</div>
          </div>

          {/* Example */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Template</div>
              <div className="font-mono text-yellow-400">{currentFunc.example}</div>
            </div>
            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Resolved Value</div>
              <div className="font-mono text-green-400">{currentFunc.result}</div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-gray-300 text-center">
            {currentFunc.description}
          </div>
        </div>
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
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• !Ref for parameters returns the value, for resources returns physical ID</li>
          <li>• !GetAtt gets specific attributes like ARN, DNS names</li>
          <li>• !Sub can use ${"{"}AWS::StackName{"}"} for pseudo parameters</li>
          <li>• !ImportValue requires the exporting stack to exist</li>
        </ul>
      </div>
    </div>
  )
}

// 4. Nested Stacks and StackSets Explainer (Medium)
export function NestedStacksExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [view, setView] = useState<"nested" | "stacksets">("nested")

  const steps = [
    { title: "Nested Stacks", description: "Reusable template components - one stack calls another" },
    { title: "Parent/Child Relationship", description: "Parent stack manages lifecycle of nested stacks" },
    { title: "Cross-Stack References", description: "Export/Import values between independent stacks" },
    { title: "StackSets", description: "Deploy stacks across multiple accounts and regions" }
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
        <Package className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Nested Stacks & StackSets</h2>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView("nested")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            view === "nested" ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Nested Stacks
        </button>
        <button
          onClick={() => setView("stacksets")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            view === "stacksets" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          StackSets
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {view === "nested" ? (
          <div>
            {/* Nested Stack Hierarchy */}
            <div className="flex flex-col items-center">
              {/* Root Stack */}
              <div className="w-64 bg-cyan-600 rounded-lg p-4 text-center">
                <Layers className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">Root Stack</div>
                <div className="text-xs text-cyan-200">main-infrastructure</div>
              </div>

              {/* Connection Lines */}
              <div className="flex gap-8 my-4">
                <div className="w-1 h-8 bg-gray-600" />
                <div className="w-1 h-8 bg-gray-600" />
                <div className="w-1 h-8 bg-gray-600" />
              </div>

              {/* Nested Stacks */}
              <div className="flex gap-4">
                {[
                  { name: "VPC Stack", template: "vpc.yaml" },
                  { name: "Database Stack", template: "rds.yaml" },
                  { name: "App Stack", template: "app.yaml" }
                ].map((stack, i) => (
                  <div key={i} className="w-40 bg-gray-700 rounded-lg p-3 text-center border-2 border-cyan-500/50">
                    <div className="text-white font-semibold text-sm">{stack.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{stack.template}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Nested Stack Resource</div>
              <pre className="text-xs font-mono text-yellow-400">
{`VPCStack:
  Type: AWS::CloudFormation::Stack
  Properties:
    TemplateURL: https://s3.../vpc.yaml
    Parameters:
      Environment: !Ref Environment`}
              </pre>
            </div>
          </div>
        ) : (
          <div>
            {/* StackSets Multi-Account */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
                <span className="text-white font-semibold">StackSet: SecurityBaseline</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Account 1 */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Account: 111111111111</div>
                <div className="flex gap-2 flex-wrap">
                  {["us-east-1", "us-west-2", "eu-west-1"].map((region, i) => (
                    <div key={i} className="bg-green-900/30 border border-green-600/50 px-2 py-1 rounded text-xs text-green-400">
                      ✓ {region}
                    </div>
                  ))}
                </div>
              </div>

              {/* Account 2 */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Account: 222222222222</div>
                <div className="flex gap-2 flex-wrap">
                  {["us-east-1", "us-west-2", "eu-west-1"].map((region, i) => (
                    <div key={i} className="bg-green-900/30 border border-green-600/50 px-2 py-1 rounded text-xs text-green-400">
                      ✓ {region}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              Deploy identical stacks across accounts and regions with a single operation
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
          <li>• Nested stacks: reusable components, parent manages lifecycle</li>
          <li>• Cross-stack refs: independent stacks share values via exports</li>
          <li>• StackSets: deploy across accounts/regions, use with Organizations</li>
          <li>• Nested stack templates must be in S3 (TemplateURL)</li>
        </ul>
      </div>
    </div>
  )
}

// 5. SAM Templates Explainer
export function SamTemplatesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedResource, setSelectedResource] = useState<"function" | "api" | "table">("function")

  const steps = [
    { title: "AWS SAM", description: "Serverless Application Model - CloudFormation extension for serverless" },
    { title: "Transform", description: "AWS::Serverless-2016-10-31 transform enables SAM resources" },
    { title: "SAM Resources", description: "AWS::Serverless::Function, ::Api, ::SimpleTable, ::Application" },
    { title: "Globals", description: "Set default properties for all functions/APIs in one place" },
    { title: "SAM CLI", description: "Build, test locally, and deploy serverless applications" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const samResources = {
    function: `MyFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.handler
    Runtime: nodejs18.x
    CodeUri: ./src
    Events:
      ApiEvent:
        Type: Api
        Properties:
          Path: /items
          Method: GET`,
    api: `MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: prod
    Cors:
      AllowOrigin: "'*'"
    Auth:
      DefaultAuthorizer: MyCognitoAuth`,
    table: `MyTable:
  Type: AWS::Serverless::SimpleTable
  Properties:
    PrimaryKey:
      Name: id
      Type: String
    ProvisionedThroughput:
      ReadCapacityUnits: 5
      WriteCapacityUnits: 5`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">SAM Templates</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: "function", label: "Function", icon: "λ" },
          { key: "api", label: "API", icon: "🌐" },
          { key: "table", label: "Table", icon: "📊" }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSelectedResource(key as typeof selectedResource)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              selectedResource === key ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-yellow-600 rounded text-xs text-white">SAM Resource</span>
          </div>
          <pre className="text-sm font-mono text-yellow-400 overflow-auto whitespace-pre-wrap">
            {samResources[selectedResource]}
          </pre>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs text-gray-300">sam build</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🖥️</div>
            <div className="text-xs text-gray-300">sam local invoke</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-xs text-gray-300">sam deploy</div>
          </div>
        </div>
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
          <li>• Transform: AWS::Serverless-2016-10-31 is required</li>
          <li>• SAM expands to standard CloudFormation at deploy time</li>
          <li>• sam local invoke tests Lambda functions locally</li>
          <li>• Globals section reduces duplication across resources</li>
        </ul>
      </div>
    </div>
  )
}

// 6. Drift Detection Explainer
export function DriftDetectionExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [driftStatus, setDriftStatus] = useState<"checking" | "drifted" | "in_sync">("checking")

  const steps = [
    { title: "Stack Drift", description: "Differences between expected and actual resource configuration" },
    { title: "Drift Detection", description: "Compare stack template with actual AWS resources" },
    { title: "Drift Status", description: "IN_SYNC, DRIFTED, NOT_CHECKED, or DELETED" },
    { title: "Resource Drift", description: "Shows specific properties that have changed" },
    { title: "Remediation", description: "Update stack or import resources to resolve drift" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    setDriftStatus("checking")
    const timer = setTimeout(() => setDriftStatus("drifted"), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Drift Detection</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
            driftStatus === "checking" ? "bg-yellow-600" :
            driftStatus === "drifted" ? "bg-red-600" : "bg-green-600"
          }`}>
            {driftStatus === "checking" && <RefreshCw className="w-5 h-5 text-white animate-spin" />}
            <span className="text-white font-semibold">
              {driftStatus === "checking" ? "Detecting drift..." :
               driftStatus === "drifted" ? "DRIFTED" : "IN_SYNC"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Expected (Template)</div>
            <div className="font-mono text-sm text-green-400">
              InstanceType: t3.micro<br />
              SecurityGroups: [sg-abc123]
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Actual (AWS)</div>
            <div className="font-mono text-sm">
              <span className="text-red-400">InstanceType: t3.large</span><br />
              <span className="text-green-400">SecurityGroups: [sg-abc123]</span>
            </div>
          </div>
        </div>

        {driftStatus === "drifted" && (
          <div className="mt-4 bg-red-900/30 border border-red-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-red-400 mb-2">Drifted Properties</div>
            <div className="text-xs text-gray-300">
              <div className="flex justify-between border-b border-gray-700 py-1">
                <span>EC2Instance.InstanceType</span>
                <span className="text-red-400">MODIFIED</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Expected: t3.micro → Actual: t3.large</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Drift occurs when resources are modified outside CloudFormation</li>
          <li>• Not all resource properties support drift detection</li>
          <li>• Use import to bring unmanaged resources under stack control</li>
          <li>• Stack policies can prevent accidental modifications</li>
        </ul>
      </div>
    </div>
  )
}

// 7. Helper Scripts Explainer
export function HelperScriptsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedScript, setSelectedScript] = useState<"cfn-init" | "cfn-signal" | "cfn-hup">("cfn-init")

  const steps = [
    { title: "CloudFormation Helper Scripts", description: "Scripts to help bootstrap EC2 instances" },
    { title: "cfn-init", description: "Reads metadata and performs configuration actions" },
    { title: "cfn-signal", description: "Signals CloudFormation when resources are ready" },
    { title: "cfn-hup", description: "Daemon that checks for updates to metadata" },
    { title: "cfn-get-metadata", description: "Retrieves metadata from CloudFormation" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const scripts = {
    "cfn-init": {
      description: "Reads AWS::CloudFormation::Init metadata and configures instance",
      example: `/opt/aws/bin/cfn-init -v \\
  --stack \${AWS::StackName} \\
  --resource MyInstance \\
  --configsets default \\
  --region \${AWS::Region}`,
      actions: ["Install packages", "Create files", "Execute commands", "Start services"]
    },
    "cfn-signal": {
      description: "Signals success or failure to WaitCondition or CreationPolicy",
      example: `/opt/aws/bin/cfn-signal -e $? \\
  --stack \${AWS::StackName} \\
  --resource MyInstance \\
  --region \${AWS::Region}`,
      actions: ["Send success/failure", "Include exit code", "Return data"]
    },
    "cfn-hup": {
      description: "Daemon that detects changes in metadata and runs actions",
      example: `[main]
stack=\${AWS::StackName}
region=\${AWS::Region}
interval=5`,
      actions: ["Monitor metadata", "Trigger on changes", "Run update hooks"]
    }
  }

  const currentScript = scripts[selectedScript]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Helper Scripts</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {Object.keys(scripts).map((script) => (
          <button
            key={script}
            onClick={() => setSelectedScript(script as typeof selectedScript)}
            className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all ${
              selectedScript === script ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {script}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">{currentScript.description}</div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <pre className="text-sm font-mono text-green-400 overflow-auto whitespace-pre-wrap">
            {currentScript.example}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {currentScript.actions.map((action, i) => (
            <div key={i} className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
              <span className="text-green-400">✓</span> {action}
            </div>
          ))}
        </div>
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
          <li>• cfn-init processes AWS::CloudFormation::Init metadata</li>
          <li>• cfn-signal used with WaitCondition or CreationPolicy</li>
          <li>• cfn-hup enables dynamic updates without replacing instances</li>
          <li>• Scripts must be called from UserData</li>
        </ul>
      </div>
    </div>
  )
}

// 8. Wait Conditions and CreationPolicy Explainer
export function WaitConditionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [signalReceived, setSignalReceived] = useState(false)

  const steps = [
    { title: "Wait Conditions", description: "Pause stack creation until signals are received" },
    { title: "WaitConditionHandle", description: "Pre-signed URL for sending signals" },
    { title: "CreationPolicy", description: "Modern alternative - signals directly to resource" },
    { title: "Timeout", description: "Specify how long to wait for success signals" },
    { title: "Count", description: "Wait for multiple signals (e.g., ASG instances)" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  useEffect(() => {
    setSignalReceived(false)
    const timer = setTimeout(() => setSignalReceived(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Wait Conditions & CreationPolicy</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              signalReceived ? "bg-green-600" : "bg-yellow-600"
            }`}>
              {signalReceived ? (
                <span className="text-2xl">✓</span>
              ) : (
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              )}
            </div>
            <div className="text-sm text-gray-300 mt-2">
              {signalReceived ? "Signal Received" : "Waiting..."}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-purple-400 mb-2">CreationPolicy</div>
            <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`MyInstance:
  Type: AWS::EC2::Instance
  CreationPolicy:
    ResourceSignal:
      Count: 1
      Timeout: PT15M`}
            </pre>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">WaitCondition</div>
            <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`MyWaitHandle:
  Type: AWS::CloudFormation::WaitConditionHandle

MyWaitCondition:
  Type: AWS::CloudFormation::WaitCondition
  Properties:
    Handle: !Ref MyWaitHandle
    Timeout: 900`}
            </pre>
          </div>
        </div>
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
          <li>• CreationPolicy is preferred over WaitCondition for EC2/ASG</li>
          <li>• Timeout uses ISO 8601 duration format (PT15M = 15 minutes)</li>
          <li>• Count specifies number of success signals required</li>
          <li>• Stack fails if timeout expires without required signals</li>
        </ul>
      </div>
    </div>
  )
}

// 9. Mappings and FindInMap Explainer
export function MappingsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState("us-east-1")

  const steps = [
    { title: "Mappings", description: "Fixed variables defined in templates - like lookup tables" },
    { title: "!FindInMap", description: "Function to retrieve values from mappings" },
    { title: "Use Cases", description: "Region-to-AMI mapping, environment configs, instance sizes" },
    { title: "Structure", description: "Three-level hierarchy: MapName, FirstKey, SecondKey" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const regionAmis: Record<string, string> = {
    "us-east-1": "ami-0123456789abcdef0",
    "us-west-2": "ami-0fedcba9876543210",
    "eu-west-1": "ami-0abcdef1234567890"
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="w-8 h-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Mappings & FindInMap</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {Object.keys(regionAmis).map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedRegion === region ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Mappings Definition</div>
            <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`Mappings:
  RegionAMI:
    us-east-1:
      AMI: ami-0123456789abcdef0
    us-west-2:
      AMI: ami-0fedcba9876543210
    eu-west-1:
      AMI: ami-0abcdef1234567890`}
            </pre>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Using !FindInMap</div>
            <pre className="text-xs font-mono text-green-400 overflow-auto">
{`ImageId: !FindInMap
  - RegionAMI
  - !Ref AWS::Region
  - AMI`}
            </pre>
            <div className="mt-4 bg-indigo-900/30 border border-indigo-600/50 rounded-lg p-3">
              <div className="text-xs text-gray-400">Selected: {selectedRegion}</div>
              <div className="text-sm text-indigo-400 font-mono">{regionAmis[selectedRegion]}</div>
            </div>
          </div>
        </div>
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

      <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 rounded-xl p-4 border border-indigo-500/30">
        <h3 className="text-lg font-semibold text-indigo-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Mappings cannot be dynamic - hardcoded values only</li>
          <li>• !FindInMap takes [MapName, FirstKey, SecondKey]</li>
          <li>• Common use: region-to-AMI mappings</li>
          <li>• Can use pseudo parameters like AWS::Region as keys</li>
        </ul>
      </div>
    </div>
  )
}

// 10. Conditions Explainer
export function ConditionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [environment, setEnvironment] = useState<"prod" | "dev">("prod")

  const steps = [
    { title: "Conditions", description: "Control resource creation based on parameter values" },
    { title: "Condition Functions", description: "!If, !Equals, !And, !Or, !Not" },
    { title: "Conditional Resources", description: "Use Condition attribute on resources" },
    { title: "Conditional Properties", description: "!If function in Properties section" }
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
        <FileCode className="w-8 h-8 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">Conditions</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {(["prod", "dev"] as const).map((env) => (
          <button
            key={env}
            onClick={() => setEnvironment(env)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              environment === env ? "bg-amber-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {env.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  ProdOnlyBucket:
    Type: AWS::S3::Bucket
    Condition: IsProd  # Only created in prod

  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !If
        - IsProd
        - t3.large
        - t3.micro`}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            environment === "prod" ? "border-green-500 bg-green-900/30" : "border-gray-600 bg-gray-700 opacity-50"
          }`}>
            <div className="text-sm font-semibold text-white">ProdOnlyBucket</div>
            <div className="text-xs text-gray-400 mt-1">
              {environment === "prod" ? "✓ Created" : "✗ Not created"}
            </div>
          </div>
          <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/30">
            <div className="text-sm font-semibold text-white">MyInstance</div>
            <div className="text-xs text-gray-400 mt-1">
              InstanceType: {environment === "prod" ? "t3.large" : "t3.micro"}
            </div>
          </div>
        </div>
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

      <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 rounded-xl p-4 border border-amber-500/30">
        <h3 className="text-lg font-semibold text-amber-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Conditions are evaluated before resources are created</li>
          <li>• Use Condition attribute to conditionally create resources</li>
          <li>• !If returns first value if true, second if false</li>
          <li>• Combine with !And, !Or, !Not for complex logic</li>
        </ul>
      </div>
    </div>
  )
}

// 11. Custom Resources Explainer
export function CustomResourcesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [requestType, setRequestType] = useState<"Create" | "Update" | "Delete">("Create")

  const steps = [
    { title: "Custom Resources", description: "Extend CloudFormation with custom provisioning logic" },
    { title: "Lambda-Backed", description: "Lambda function handles Create, Update, Delete events" },
    { title: "Request Types", description: "CloudFormation sends Create, Update, or Delete requests" },
    { title: "Response", description: "Lambda must send response to pre-signed S3 URL" },
    { title: "Use Cases", description: "Populate S3, empty buckets, create external resources" }
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
        <Layers className="w-8 h-8 text-pink-400" />
        <h2 className="text-2xl font-bold text-white">Custom Resources</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {(["Create", "Update", "Delete"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setRequestType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              requestType === type ? "bg-pink-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs text-gray-400">CloudFormation</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 text-sm">{requestType} Event →</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">λ</span>
            </div>
            <div className="text-xs text-gray-400">Lambda</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 text-sm">← Response</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-xl">📦</span>
            </div>
            <div className="text-xs text-gray-400">S3 Response</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Custom Resource Definition</div>
            <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`MyCustomResource:
  Type: Custom::EmptyBucket
  Properties:
    ServiceToken: !GetAtt MyLambda.Arn
    BucketName: !Ref MyBucket`}
            </pre>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Lambda Event ({requestType})</div>
            <pre className="text-xs font-mono text-green-400 overflow-auto">
{`{
  "RequestType": "${requestType}",
  "ResourceProperties": {
    "BucketName": "my-bucket"
  },
  "ResponseURL": "https://..."
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 rounded-xl p-4 border border-pink-500/30">
        <h3 className="text-lg font-semibold text-pink-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• ServiceToken specifies Lambda ARN or SNS topic</li>
          <li>• Lambda must respond to ResponseURL (S3 pre-signed URL)</li>
          <li>• cfn-response module simplifies sending responses</li>
          <li>• Common use: empty S3 buckets before stack deletion</li>
        </ul>
      </div>
    </div>
  )
}

// 12. Stack Policies and Security Explainer
export function StackPoliciesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Stack Policies", description: "Protect specific resources from unintended updates" },
    { title: "IAM Execution Role", description: "Role CloudFormation assumes to create/update resources" },
    { title: "Service Role", description: "Grant specific permissions for stack operations" },
    { title: "Termination Protection", description: "Prevent accidental stack deletion" },
    { title: "Resource Policies", description: "Control updates to specific resources" }
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
        <FileCode className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Stack Policies & Security</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-red-400 mb-3">Stack Policy</div>
            <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`{
  "Statement": [{
    "Effect": "Deny",
    "Action": "Update:Replace",
    "Principal": "*",
    "Resource": "*",
    "Condition": {
      "StringEquals": {
        "ResourceType": [
          "AWS::RDS::DBInstance"
        ]
      }
    }
  }]
}`}
            </pre>
          </div>

          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                <span className="text-sm font-semibold text-white">Termination Protection</span>
              </div>
              <div className="text-xs text-gray-400">Prevents accidental stack deletion</div>
            </div>

            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400">🔐</span>
                <span className="text-sm font-semibold text-white">Service Role</span>
              </div>
              <div className="text-xs text-gray-400">IAM role for stack operations</div>
            </div>

            <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-400">🛡️</span>
                <span className="text-sm font-semibold text-white">Protected Resources</span>
              </div>
              <div className="text-xs text-gray-400">RDS instances protected from replacement</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Stack policies prevent unintended resource updates</li>
          <li>• Service roles let users deploy without direct permissions</li>
          <li>• Termination protection requires explicit disable before delete</li>
          <li>• Stack policies can be temporarily overridden during updates</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const cloudformationExplainers = {
  "template-structure": TemplateStructureExplainer,
  "stack-operations": StackOperationsExplainer,
  "intrinsic-functions": IntrinsicFunctionsExplainer,
  "nested-stacks": NestedStacksExplainer,
  "sam-templates": SamTemplatesExplainer,
  "drift-detection": DriftDetectionExplainer,
  "helper-scripts": HelperScriptsExplainer,
  "wait-conditions": WaitConditionsExplainer,
  "mappings": MappingsExplainer,
  "conditions": ConditionsExplainer,
  "custom-resources": CustomResourcesExplainer,
  "stack-policies": StackPoliciesExplainer,
}
