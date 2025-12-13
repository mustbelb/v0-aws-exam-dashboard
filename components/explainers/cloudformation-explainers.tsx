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

// Export all explainers
export const cloudformationExplainers = {
  "template-structure": TemplateStructureExplainer,
  "stack-operations": StackOperationsExplainer,
  "intrinsic-functions": IntrinsicFunctionsExplainer,
  "nested-stacks": NestedStacksExplainer
}
