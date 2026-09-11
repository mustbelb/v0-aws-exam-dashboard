"use client"

import { useState, useEffect } from "react"
import { useExplainerPlayback } from "@/hooks/use-explainer-playback"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FileCode, Layers, RefreshCw, Package } from "lucide-react"

// 1. Template Structure Explainer (Rich)
export function TemplateStructureExplainer() {


  const [selectedSection, setSelectedSection] = useState<"parameters" | "resources" | "outputs">("resources")

  const steps = [
    { title: "CloudFormation Templates", description: "JSON or YAML files that define your AWS infrastructure as code" },
    { title: "Template Sections", description: "Parameters, Resources (required), Outputs, Mappings, Conditions" },
    { title: "Resources Section", description: "The only required section - defines AWS resources to create" },
    { title: "Parameters", description: "Input values that customize template behavior at runtime" },
    { title: "Outputs", description: "Return values that can be imported by other stacks" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <div className="text-xl font-semibold text-white mb-2">CloudFormation Templates</div>
            <div className="text-gray-400">Infrastructure as Code (IaC)</div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-blue-400 mb-2">JSON Format</div>
                <pre className="text-xs font-mono text-yellow-400">{"{ \"Resources\": {...} }"}</pre>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-400 mb-2">YAML Format</div>
                <pre className="text-xs font-mono text-yellow-400">Resources: ...</pre>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4 text-lg font-semibold text-white">Template Sections</div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-lg border-2 border-blue-500 bg-blue-900/30">
                <div className="text-sm font-semibold text-center">Parameters</div>
                <div className="text-xs text-gray-400 text-center">Optional</div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="p-3 rounded-lg border-2 border-orange-500 bg-orange-900/30">
                <div className="text-sm font-semibold text-center">Resources</div>
                <div className="text-xs text-gray-400 text-center">Required</div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="p-3 rounded-lg border-2 border-green-500 bg-green-900/30">
                <div className="text-sm font-semibold text-center">Outputs</div>
                <div className="text-xs text-gray-400 text-center">Optional</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-400">Other sections: Mappings, Conditions</div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-block p-3 rounded-lg border-2 border-orange-500 bg-orange-900/30">
                <div className="text-lg font-semibold text-center">Resources Section</div>
                <div className="text-xs text-gray-400 text-center">REQUIRED - Only mandatory section</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs bg-orange-600 text-white">Resources</span>
                <span className="text-xs text-gray-500">YAML</span>
              </div>
              <pre className="text-sm font-mono text-yellow-400 overflow-auto whitespace-pre-wrap">
                {templateSections.resources}
              </pre>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-block p-3 rounded-lg border-2 border-blue-500 bg-blue-900/30">
                <div className="text-lg font-semibold text-center">Parameters</div>
                <div className="text-xs text-gray-400 text-center">Input values for customization</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs bg-blue-600 text-white">Parameters</span>
                <span className="text-xs text-gray-500">YAML</span>
              </div>
              <pre className="text-sm font-mono text-yellow-400 overflow-auto whitespace-pre-wrap">
                {templateSections.parameters}
              </pre>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-block p-3 rounded-lg border-2 border-green-500 bg-green-900/30">
                <div className="text-lg font-semibold text-center">Outputs</div>
                <div className="text-xs text-gray-400 text-center">Return values for cross-stack references</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">Outputs</span>
                <span className="text-xs text-gray-500">YAML</span>
              </div>
              <pre className="text-sm font-mono text-yellow-400 overflow-auto whitespace-pre-wrap">
                {templateSections.outputs}
              </pre>
            </div>
          </div>
        )}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [operation, setOperation] = useState<"create" | "update" | "delete">("create")
  const [stackStatus, setStackStatus] = useState("CREATE_IN_PROGRESS")

  const steps = [
    { title: "Stack Lifecycle", description: "Create, update, and delete operations manage your infrastructure" },
    { title: "Create Stack", description: "Provisions all resources defined in template" },
    { title: "Update Stack", description: "Change sets preview changes before applying" },
    { title: "Delete Stack", description: "Removes all resources (unless DeletionPolicy: Retain)" },
    { title: "Rollback", description: "Automatic rollback on failure to previous stable state" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🔄</div>
            <div className="text-xl font-semibold text-white mb-4">Stack Lifecycle</div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">➕</span>
                </div>
                <div className="text-sm text-white">Create</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">✏️</span>
                </div>
                <div className="text-sm text-white">Update</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🗑️</span>
                </div>
                <div className="text-sm text-white">Delete</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
                <span className="text-white font-semibold">CREATE_IN_PROGRESS</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["VPC", "Subnet", "EC2"].map((resource, i) => (
                <div key={i} className="p-4 rounded-lg bg-yellow-900/30">
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {resource === "VPC" ? "🌐" : resource === "Subnet" ? "🔲" : "💻"}
                    </div>
                    <div className="text-sm text-white font-semibold">{resource}</div>
                    <div className="text-xs text-gray-400 mt-1">CREATING</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-600">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
                <span className="text-white font-semibold">UPDATE_IN_PROGRESS</span>
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-yellow-400 mb-2">Change Set Preview</div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>✓ EC2Instance - Modify (InstanceType)</div>
                <div>✓ SecurityGroup - No change</div>
                <div>+ NewS3Bucket - Add</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["VPC", "Subnet", "EC2"].map((resource, i) => (
                <div key={i} className="p-4 rounded-lg bg-green-900/30">
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {resource === "VPC" ? "🌐" : resource === "Subnet" ? "🔲" : "💻"}
                    </div>
                    <div className="text-sm text-white font-semibold">{resource}</div>
                    <div className="text-xs text-gray-400 mt-1">{i === 2 ? "UPDATING" : "NO CHANGE"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
                <span className="text-white font-semibold">DELETE_IN_PROGRESS</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["VPC", "Subnet", "EC2"].map((resource, i) => (
                <div key={i} className="p-4 rounded-lg bg-red-900/30">
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {resource === "VPC" ? "🌐" : resource === "Subnet" ? "🔲" : "💻"}
                    </div>
                    <div className="text-sm text-white font-semibold">{resource}</div>
                    <div className="text-xs text-gray-400 mt-1">DELETING</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              DeletionPolicy: Retain prevents resource deletion
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600">
                <span className="text-white font-semibold">ROLLBACK_IN_PROGRESS</span>
              </div>
            </div>
            <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-red-400 mb-2">Stack Update Failed</div>
              <div className="text-xs text-gray-300">
                Rolling back to previous stable state...
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["VPC", "Subnet", "EC2"].map((resource, i) => (
                <div key={i} className={`p-4 rounded-lg ${i === 2 ? "bg-red-900/30" : "bg-green-900/30"}`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {resource === "VPC" ? "🌐" : resource === "Subnet" ? "🔲" : "💻"}
                    </div>
                    <div className="text-sm text-white font-semibold">{resource}</div>
                    <div className="text-xs text-gray-400 mt-1">{i === 2 ? "REVERTING" : "STABLE"}</div>
                  </div>
                </div>
              ))}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [selectedFunction, setSelectedFunction] = useState("Ref")

  const steps = [
    { title: "Intrinsic Functions", description: "Built-in functions for dynamic values in templates" },
    { title: "!Ref", description: "Return parameter value or resource physical ID" },
    { title: "!GetAtt", description: "Get attribute from a resource (e.g., ARN, DNS name)" },
    { title: "!Sub", description: "Substitute variables in strings" },
    { title: "!ImportValue", description: "Import values exported from other stacks" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">⚙️</div>
            <div className="text-xl font-semibold text-white mb-2">Intrinsic Functions</div>
            <div className="text-gray-400 mb-6">Built-in functions for dynamic template values</div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(functions).map((func) => (
                <div key={func} className="bg-gray-700 rounded-lg p-3">
                  <div className="font-mono text-purple-400">!{func}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-purple-400">!Ref</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Syntax</div>
              <div className="font-mono text-purple-400">{functions.Ref.syntax}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Template</div>
                <div className="font-mono text-yellow-400">{functions.Ref.example}</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Resolved Value</div>
                <div className="font-mono text-green-400">{functions.Ref.result}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 text-center">
              {functions.Ref.description}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-purple-400">!GetAtt</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Syntax</div>
              <div className="font-mono text-purple-400">{functions.GetAtt.syntax}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Template</div>
                <div className="font-mono text-yellow-400">{functions.GetAtt.example}</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Resolved Value</div>
                <div className="font-mono text-green-400">{functions.GetAtt.result}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 text-center">
              {functions.GetAtt.description}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-purple-400">!Sub</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Syntax</div>
              <div className="font-mono text-purple-400">{functions.Sub.syntax}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Template</div>
                <div className="font-mono text-yellow-400">{functions.Sub.example}</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Resolved Value</div>
                <div className="font-mono text-green-400">{functions.Sub.result}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 text-center">
              {functions.Sub.description}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-purple-400">!ImportValue</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Syntax</div>
              <div className="font-mono text-purple-400">{functions.ImportValue.syntax}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Template</div>
                <div className="font-mono text-yellow-400">{functions.ImportValue.example}</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Resolved Value</div>
                <div className="font-mono text-green-400">{functions.ImportValue.result}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 text-center">
              {functions.ImportValue.description}
            </div>
          </div>
        )}
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [view, setView] = useState<"nested" | "stacksets">("nested")

  const steps = [
    { title: "Nested Stacks", description: "Reusable template components - one stack calls another" },
    { title: "Parent/Child Relationship", description: "Parent stack manages lifecycle of nested stacks" },
    { title: "Cross-Stack References", description: "Export/Import values between independent stacks" },
    { title: "StackSets", description: "Deploy stacks across multiple accounts and regions" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <div className="text-xl font-semibold text-white mb-2">Nested Stacks</div>
            <div className="text-gray-400 mb-6">Reusable template components for modular infrastructure</div>
            <div className="flex flex-col items-center">
              <div className="w-48 bg-cyan-600 rounded-lg p-4 text-center">
                <Layers className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">Parent Stack</div>
              </div>
              <div className="flex gap-8 my-4">
                <div className="w-1 h-8 bg-gray-600" />
                <div className="w-1 h-8 bg-gray-600" />
                <div className="w-1 h-8 bg-gray-600" />
              </div>
              <div className="flex gap-4">
                <div className="w-32 bg-gray-700 rounded-lg p-3 text-center border-2 border-cyan-500/50">
                  <div className="text-white font-semibold text-sm">Child 1</div>
                </div>
                <div className="w-32 bg-gray-700 rounded-lg p-3 text-center border-2 border-cyan-500/50">
                  <div className="text-white font-semibold text-sm">Child 2</div>
                </div>
                <div className="w-32 bg-gray-700 rounded-lg p-3 text-center border-2 border-cyan-500/50">
                  <div className="text-white font-semibold text-sm">Child 3</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Parent/Child Relationship</div>
            <div className="flex flex-col items-center">
              <div className="w-64 bg-cyan-600 rounded-lg p-4 text-center">
                <Layers className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">Root Stack</div>
                <div className="text-xs text-cyan-200">main-infrastructure</div>
              </div>
              <div className="flex gap-8 my-4">
                <div className="w-1 h-8 bg-gray-600" />
                <div className="w-1 h-8 bg-gray-600" />
                <div className="w-1 h-8 bg-gray-600" />
              </div>
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
        )}
        {step === 2 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-6">Cross-Stack References</div>
            <div className="flex justify-center items-center gap-8">
              <div className="bg-blue-600 rounded-lg p-4 text-center w-48">
                <div className="text-white font-semibold mb-2">Stack A</div>
                <div className="bg-blue-900/50 rounded p-2 text-xs text-white">
                  <div className="font-mono">Export:</div>
                  <div className="font-mono">VPC-ID</div>
                </div>
              </div>
              <div className="text-gray-400 text-2xl">→</div>
              <div className="bg-green-600 rounded-lg p-4 text-center w-48">
                <div className="text-white font-semibold mb-2">Stack B</div>
                <div className="bg-green-900/50 rounded p-2 text-xs text-white">
                  <div className="font-mono">!ImportValue</div>
                  <div className="font-mono">VPC-ID</div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              Independent stacks share values via Exports and ImportValue
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">StackSets</div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
                <span className="text-white font-semibold">StackSet: SecurityBaseline</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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


  const [selectedResource, setSelectedResource] = useState<"function" | "api" | "table">("function")

  const steps = [
    { title: "AWS SAM", description: "Serverless Application Model - CloudFormation extension for serverless" },
    { title: "Transform", description: "AWS::Serverless-2016-10-31 transform enables SAM resources" },
    { title: "SAM Resources", description: "AWS::Serverless::Function, ::Api, ::SimpleTable, ::Application" },
    { title: "Globals", description: "Set default properties for all functions/APIs in one place" },
    { title: "SAM CLI", description: "Build, test locally, and deploy serverless applications" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <div className="text-xl font-semibold text-white mb-2">AWS SAM</div>
            <div className="text-gray-400 mb-6">Serverless Application Model - CloudFormation extension</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-2xl mb-2">λ</div>
                <div className="text-sm text-white">Functions</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-2xl mb-2">🌐</div>
                <div className="text-sm text-white">APIs</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm text-white">Tables</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4 text-lg font-semibold text-white">Transform</div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Required at top of template</div>
              <pre className="text-sm font-mono text-yellow-400">
{`Transform: AWS::Serverless-2016-10-31

Description: My SAM Application

Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    ...`}
              </pre>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Transform enables SAM-specific resource types
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4 text-lg font-semibold text-white">SAM Resources</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-yellow-400 text-sm">AWS::Serverless::Function</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-yellow-400 text-sm">AWS::Serverless::Api</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-yellow-400 text-sm">AWS::Serverless::SimpleTable</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-yellow-400 text-sm">AWS::Serverless::Application</div>
              </div>
            </div>
            <div className="mt-4 bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Example</div>
              <pre className="text-xs font-mono text-yellow-400 overflow-auto whitespace-pre-wrap">
                {samResources.function}
              </pre>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4 text-lg font-semibold text-white">Globals</div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-2">Set defaults for all functions</div>
              <pre className="text-sm font-mono text-yellow-400">
{`Globals:
  Function:
    Runtime: nodejs18.x
    Timeout: 30
    Environment:
      Variables:
        STAGE: prod

Resources:
  Function1:
    Type: AWS::Serverless::Function
    # Inherits globals
  Function2:
    Type: AWS::Serverless::Function
    # Inherits globals`}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-400">
              Reduces duplication across resources
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4 text-lg font-semibold text-white">SAM CLI</div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-mono text-xs text-yellow-400">sam build</div>
                <div className="text-xs text-gray-400 mt-1">Build application</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="font-mono text-xs text-yellow-400">sam local invoke</div>
                <div className="text-xs text-gray-400 mt-1">Test locally</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-mono text-xs text-yellow-400">sam deploy</div>
                <div className="text-xs text-gray-400 mt-1">Deploy to AWS</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-400">
              Build, test locally, and deploy serverless applications
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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


  const [driftStatus, setDriftStatus] = useState<"checking" | "drifted" | "in_sync">("checking")

  const steps = [
    { title: "Stack Drift", description: "Differences between expected and actual resource configuration" },
    { title: "Drift Detection", description: "Compare stack template with actual AWS resources" },
    { title: "Drift Status", description: "IN_SYNC, DRIFTED, NOT_CHECKED, or DELETED" },
    { title: "Resource Drift", description: "Shows specific properties that have changed" },
    { title: "Remediation", description: "Update stack or import resources to resolve drift" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-xl font-semibold text-white mb-2">Stack Drift</div>
            <div className="text-gray-400 mb-6">Differences between template and actual resources</div>
            <div className="flex justify-center gap-8">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400 mb-2">Expected</div>
                <div className="font-mono text-sm text-green-400">Template Definition</div>
              </div>
              <div className="text-4xl text-gray-500">≠</div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400 mb-2">Actual</div>
                <div className="font-mono text-sm text-red-400">AWS Resource</div>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              Manual changes outside CloudFormation cause drift
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-600">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
                <span className="text-white font-semibold">Detecting drift...</span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-400 mb-4">
              Comparing stack template with actual AWS resources
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["VPC", "EC2", "RDS"].map((resource, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">
                    {resource === "VPC" ? "🌐" : resource === "EC2" ? "💻" : "🗄️"}
                  </div>
                  <div className="text-xs text-gray-400">Checking...</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600">
                <span className="text-white font-semibold">DRIFTED</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🌐</div>
                <div className="text-sm text-white">VPC</div>
                <div className="text-xs text-green-400">IN_SYNC</div>
              </div>
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">💻</div>
                <div className="text-sm text-white">EC2</div>
                <div className="text-xs text-red-400">DRIFTED</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🗄️</div>
                <div className="text-sm text-white">RDS</div>
                <div className="text-xs text-green-400">IN_SYNC</div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Resource Drift Details</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
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
          </div>
        )}
        {step === 4 && (
          <div className="text-center">
            <div className="text-xl font-semibold text-white mb-6">Remediation Options</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="text-lg mb-2">🔄</div>
                <div className="text-sm font-semibold text-white mb-2">Update Stack</div>
                <div className="text-xs text-gray-400">
                  Update template to match actual configuration
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-lg mb-2">📥</div>
                <div className="text-sm font-semibold text-white mb-2">Import Resources</div>
                <div className="text-xs text-gray-400">
                  Bring unmanaged resources under stack control
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                <div className="text-lg mb-2">🔐</div>
                <div className="text-sm font-semibold text-white mb-2">Stack Policy</div>
                <div className="text-xs text-gray-400">
                  Prevent unintended modifications
                </div>
              </div>
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <div className="text-lg mb-2">↩️</div>
                <div className="text-sm font-semibold text-white mb-2">Revert Changes</div>
                <div className="text-xs text-gray-400">
                  Manually revert resources to template state
                </div>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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


  const [selectedScript, setSelectedScript] = useState<"cfn-init" | "cfn-signal" | "cfn-hup">("cfn-init")

  const steps = [
    { title: "CloudFormation Helper Scripts", description: "Scripts to help bootstrap EC2 instances" },
    { title: "cfn-init", description: "Reads metadata and performs configuration actions" },
    { title: "cfn-signal", description: "Signals CloudFormation when resources are ready" },
    { title: "cfn-hup", description: "Daemon that checks for updates to metadata" },
    { title: "cfn-get-metadata", description: "Retrieves metadata from CloudFormation" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🛠️</div>
            <div className="text-xl font-semibold text-white mb-2">CloudFormation Helper Scripts</div>
            <div className="text-gray-400 mb-6">Bootstrap and configure EC2 instances</div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(scripts).map((script) => (
                <div key={script} className="bg-gray-700 rounded-lg p-3">
                  <div className="font-mono text-green-400 text-sm">{script}</div>
                </div>
              ))}
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-green-400 text-sm">cfn-get-metadata</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-green-400">cfn-init</span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">{scripts["cfn-init"].description}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-sm font-mono text-green-400 overflow-auto whitespace-pre-wrap">
                {scripts["cfn-init"].example}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {scripts["cfn-init"].actions.map((action, i) => (
                <div key={i} className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-green-400">✓</span> {action}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-green-400">cfn-signal</span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">{scripts["cfn-signal"].description}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-sm font-mono text-green-400 overflow-auto whitespace-pre-wrap">
                {scripts["cfn-signal"].example}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {scripts["cfn-signal"].actions.map((action, i) => (
                <div key={i} className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-green-400">✓</span> {action}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <span className="text-2xl font-mono text-green-400">cfn-hup</span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">{scripts["cfn-hup"].description}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-sm font-mono text-green-400 overflow-auto whitespace-pre-wrap">
                {scripts["cfn-hup"].example}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {scripts["cfn-hup"].actions.map((action, i) => (
                <div key={i} className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-green-400">✓</span> {action}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">cfn-get-metadata</div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-2">Retrieves metadata from CloudFormation</div>
              <pre className="text-sm font-mono text-green-400">
{`/opt/aws/bin/cfn-get-metadata -v \\
  --stack \${AWS::StackName} \\
  --resource MyInstance \\
  --region \${AWS::Region}`}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-400">
              All helper scripts must be called from UserData script
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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


  const [signalReceived, setSignalReceived] = useState(false)

  const steps = [
    { title: "Wait Conditions", description: "Pause stack creation until signals are received" },
    { title: "WaitConditionHandle", description: "Pre-signed URL for sending signals" },
    { title: "CreationPolicy", description: "Modern alternative - signals directly to resource" },
    { title: "Timeout", description: "Specify how long to wait for success signals" },
    { title: "Count", description: "Wait for multiple signals (e.g., ASG instances)" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <div className="text-xl font-semibold text-white mb-2">Wait Conditions</div>
            <div className="text-gray-400 mb-6">Pause stack creation until signals are received</div>
            <div className="flex justify-center items-center gap-8">
              <div className="bg-orange-600 rounded-lg p-4 text-center w-40">
                <div className="text-white font-semibold mb-2">CloudFormation</div>
                <div className="text-xs text-orange-200">Creating resources...</div>
              </div>
              <div className="text-gray-400 text-2xl">⏸️</div>
              <div className="bg-yellow-600 rounded-lg p-4 text-center w-40">
                <div className="text-white font-semibold mb-2">Waiting</div>
                <div className="text-xs text-yellow-200">For signal</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">WaitConditionHandle</div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-blue-400 mb-2">WaitConditionHandle</div>
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`MyWaitHandle:
  Type: AWS::CloudFormation::WaitConditionHandle

MyWaitCondition:
  Type: AWS::CloudFormation::WaitCondition
  Properties:
    Handle: !Ref MyWaitHandle
    Timeout: 900
    Count: 1`}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-400">
              Handle provides pre-signed URL for sending signals
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">CreationPolicy</div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-purple-400 mb-2">CreationPolicy (Recommended)</div>
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`MyInstance:
  Type: AWS::EC2::Instance
  CreationPolicy:
    ResourceSignal:
      Count: 1
      Timeout: PT15M
  Properties:
    ImageId: ami-12345678
    InstanceType: t3.micro`}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-400">
              Modern alternative - signals directly to resource
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-6">Timeout Configuration</div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4 inline-block">
              <div className="font-mono text-yellow-400 text-lg mb-2">Timeout: PT15M</div>
              <div className="text-sm text-gray-400">ISO 8601 duration format</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-purple-400 text-sm">PT5M</div>
                <div className="text-xs text-gray-400 mt-1">5 minutes</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-purple-400 text-sm">PT1H</div>
                <div className="text-xs text-gray-400 mt-1">1 hour</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-purple-400 text-sm">PT30M</div>
                <div className="text-xs text-gray-400 mt-1">30 minutes</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Stack fails if timeout expires without required signals
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Signal Count</div>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-600">
                  <span className="text-2xl text-white">✓</span>
                </div>
                <div className="text-sm text-gray-300 mt-2">Signal 1</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-600">
                  <span className="text-2xl text-white">✓</span>
                </div>
                <div className="text-sm text-gray-300 mt-2">Signal 2</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-600">
                  <span className="text-2xl text-white">✓</span>
                </div>
                <div className="text-sm text-gray-300 mt-2">Signal 3</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="font-mono text-yellow-400 text-sm mb-2">Count: 3</div>
              <div className="text-xs text-gray-400">
                Useful for Auto Scaling Groups - wait for multiple instances to signal success
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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


  const [selectedRegion, setSelectedRegion] = useState("us-east-1")

  const steps = [
    { title: "Mappings", description: "Fixed variables defined in templates - like lookup tables" },
    { title: "!FindInMap", description: "Function to retrieve values from mappings" },
    { title: "Use Cases", description: "Region-to-AMI mapping, environment configs, instance sizes" },
    { title: "Structure", description: "Three-level hierarchy: MapName, FirstKey, SecondKey" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <div className="text-xl font-semibold text-white mb-2">Mappings</div>
            <div className="text-gray-400 mb-6">Fixed lookup tables for template values</div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Common Use Cases</div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-gray-600 rounded p-2 text-sm text-white">Region → AMI ID</div>
                <div className="bg-gray-600 rounded p-2 text-sm text-white">Environment → Config</div>
                <div className="bg-gray-600 rounded p-2 text-sm text-white">Instance Type Map</div>
                <div className="bg-gray-600 rounded p-2 text-sm text-white">AZ → Subnet CIDR</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">!FindInMap Function</div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-2">Syntax</div>
              <div className="font-mono text-indigo-400">!FindInMap [MapName, TopLevelKey, SecondLevelKey]</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Example</div>
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`ImageId: !FindInMap
  - RegionAMI
  - !Ref AWS::Region
  - AMI

# Returns the AMI ID for the current region`}
              </pre>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Use Cases: Region-to-AMI Mapping</div>
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
        )}
        {step === 3 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-6">Three-Level Hierarchy</div>
            <div className="bg-gray-700 rounded-lg p-6 inline-block">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 rounded px-4 py-2 text-white font-mono text-sm">MapName</div>
                  <div className="text-gray-400">→</div>
                  <div className="text-gray-400 text-sm">RegionAMI</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600 rounded px-4 py-2 text-white font-mono text-sm">FirstKey</div>
                  <div className="text-gray-400">→</div>
                  <div className="text-gray-400 text-sm">us-east-1</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-pink-600 rounded px-4 py-2 text-white font-mono text-sm">SecondKey</div>
                  <div className="text-gray-400">→</div>
                  <div className="text-gray-400 text-sm">AMI</div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              !FindInMap [MapName, FirstKey, SecondKey]
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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


  const [environment, setEnvironment] = useState<"prod" | "dev">("prod")

  const steps = [
    { title: "Conditions", description: "Control resource creation based on parameter values" },
    { title: "Condition Functions", description: "!If, !Equals, !And, !Or, !Not" },
    { title: "Conditional Resources", description: "Use Condition attribute on resources" },
    { title: "Conditional Properties", description: "!If function in Properties section" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🔀</div>
            <div className="text-xl font-semibold text-white mb-2">Conditions</div>
            <div className="text-gray-400 mb-6">Control resource creation based on parameters</div>
            <div className="flex justify-center gap-8">
              <div className="bg-green-600 rounded-lg p-4 text-center w-40">
                <div className="text-white font-semibold mb-2">TRUE</div>
                <div className="text-xs text-green-200">Create resource</div>
              </div>
              <div className="text-4xl text-gray-500">vs</div>
              <div className="bg-red-600 rounded-lg p-4 text-center w-40">
                <div className="text-white font-semibold mb-2">FALSE</div>
                <div className="text-xs text-red-200">Skip resource</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Condition Functions</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-amber-400 mb-1">!Equals</div>
                <div className="text-xs text-gray-400">Compare two values</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-amber-400 mb-1">!If</div>
                <div className="text-xs text-gray-400">Conditional values</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-amber-400 mb-1">!And</div>
                <div className="text-xs text-gray-400">All true</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-amber-400 mb-1">!Or</div>
                <div className="text-xs text-gray-400">Any true</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="font-mono text-amber-400 mb-1">!Not</div>
                <div className="text-xs text-gray-400">Negate condition</div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Conditional Resources</div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  ProdOnlyBucket:
    Type: AWS::S3::Bucket
    Condition: IsProd  # Only created in prod`}
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
              <div className="text-center flex items-center justify-center">
                <div className="text-gray-400">
                  Environment: <span className="font-mono text-amber-400">{environment}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Conditional Properties</div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !If
        - IsProd
        - t3.large   # if true
        - t3.micro   # if false`}
              </pre>
            </div>
            <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-900/30">
              <div className="text-sm font-semibold text-white mb-2">MyInstance</div>
              <div className="text-xs text-gray-400">
                Environment: <span className="text-amber-400">{environment}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                InstanceType: <span className="text-blue-400">{environment === "prod" ? "t3.large" : "t3.micro"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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


  const [requestType, setRequestType] = useState<"Create" | "Update" | "Delete">("Create")

  const steps = [
    { title: "Custom Resources", description: "Extend CloudFormation with custom provisioning logic" },
    { title: "Lambda-Backed", description: "Lambda function handles Create, Update, Delete events" },
    { title: "Request Types", description: "CloudFormation sends Create, Update, or Delete requests" },
    { title: "Response", description: "Lambda must send response to pre-signed S3 URL" },
    { title: "Use Cases", description: "Populate S3, empty buckets, create external resources" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



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
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🔧</div>
            <div className="text-xl font-semibold text-white mb-2">Custom Resources</div>
            <div className="text-gray-400 mb-6">Extend CloudFormation with custom logic</div>
            <div className="flex justify-center items-center gap-8">
              <div className="bg-orange-600 rounded-lg p-4 text-center">
                <Layers className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">CloudFormation</div>
              </div>
              <div className="text-gray-400 text-2xl">→</div>
              <div className="bg-yellow-600 rounded-lg p-4 text-center">
                <span className="text-3xl">λ</span>
                <div className="text-white font-semibold mt-2">Lambda</div>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              Run custom code during stack operations
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Lambda-Backed Custom Resources</div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-2">Custom Resource Definition</div>
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`MyCustomResource:
  Type: Custom::EmptyBucket
  Properties:
    ServiceToken: !GetAtt MyLambda.Arn
    BucketName: !Ref MyBucket`}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-400">
              ServiceToken specifies Lambda function ARN
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Request Types</div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(["Create", "Update", "Delete"] as const).map((type) => (
                <div key={type} className={`p-4 rounded-lg border-2 ${
                  requestType === type ? "border-pink-500 bg-pink-900/30" : "border-gray-600 bg-gray-700"
                }`}>
                  <div className="text-sm font-semibold text-white text-center">{type}</div>
                </div>
              ))}
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
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Response Handling</div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">λ</span>
                </div>
                <div className="text-xs text-gray-400">Lambda</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500 text-sm">PUT Response →</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📦</span>
                </div>
                <div className="text-xs text-gray-400">S3 Pre-signed URL</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Response Format</div>
              <pre className="text-xs font-mono text-green-400">
{`{
  "Status": "SUCCESS",
  "PhysicalResourceId": "resource-id",
  "Data": {
    "Result": "Custom data"
  }
}`}
              </pre>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Common Use Cases</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2">Empty S3 Bucket</div>
                <div className="text-xs text-gray-400">
                  Delete all objects before stack deletion
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2">Populate Database</div>
                <div className="text-xs text-gray-400">
                  Initialize database with seed data
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2">External API Call</div>
                <div className="text-xs text-gray-400">
                  Register with third-party services
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-white mb-2">Resource Lookup</div>
                <div className="text-xs text-gray-400">
                  Query existing resources dynamically
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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



  const steps = [
    { title: "Stack Policies", description: "Protect specific resources from unintended updates" },
    { title: "IAM Execution Role", description: "Role CloudFormation assumes to create/update resources" },
    { title: "Service Role", description: "Grant specific permissions for stack operations" },
    { title: "Termination Protection", description: "Prevent accidental stack deletion" },
    { title: "Resource Policies", description: "Control updates to specific resources" }
  ]

  const { step, setStep, isPlaying, togglePlayback, reset, resetKey } = useExplainerPlayback(steps.length)



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Stack Policies & Security</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-xl font-semibold text-white mb-2">Stack Policies</div>
            <div className="text-gray-400 mb-6">Protect resources from unintended updates</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-2xl mb-2">✓</div>
                <div className="text-sm font-semibold text-white">Allowed Updates</div>
                <div className="text-xs text-gray-400 mt-1">Safe changes permitted</div>
              </div>
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <div className="text-2xl mb-2">✗</div>
                <div className="text-sm font-semibold text-white">Denied Updates</div>
                <div className="text-xs text-gray-400 mt-1">Critical resources protected</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">IAM Execution Role</div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-2">CloudFormation assumes this role</div>
              <pre className="text-xs font-mono text-yellow-400">
{`aws cloudformation create-stack \\
  --stack-name MyStack \\
  --template-body file://template.yaml \\
  --role-arn arn:aws:iam::123456:role/CFNRole`}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-400">
              Limits permissions CloudFormation can use
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Service Role</div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400">🔐</span>
                <span className="text-sm font-semibold text-white">Service Role Benefits</span>
              </div>
              <div className="text-xs text-gray-400 space-y-2">
                <div>• Users can deploy without direct AWS permissions</div>
                <div>• Centralized permission management</div>
                <div>• Least privilege for users</div>
                <div>• CloudFormation uses role's permissions</div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Termination Protection</div>
            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                <span className="text-sm font-semibold text-white">Termination Protection Enabled</span>
              </div>
              <div className="text-xs text-gray-400 mb-3">Prevents accidental stack deletion</div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>1. Must explicitly disable protection first</div>
                <div>2. Then delete the stack</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="font-mono text-xs text-yellow-400">
                aws cloudformation update-termination-protection<br />
                &nbsp;&nbsp;--stack-name MyStack<br />
                &nbsp;&nbsp;--enable-termination-protection
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-6 text-lg font-semibold text-white">Resource Policies</div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-red-400 mb-3">Stack Policy Example</div>
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
                <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-400">🛡️</span>
                    <span className="text-sm font-semibold text-white">Protected Resources</span>
                  </div>
                  <div className="text-xs text-gray-400">RDS instances protected from replacement</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-xs text-white font-semibold mb-2">Policy Actions</div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>• Update:Replace</div>
                    <div>• Update:Delete</div>
                    <div>• Update:Modify</div>
                  </div>
                </div>
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
        <button onClick={reset} aria-label="Reset lesson" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button aria-label="Previous step" onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={togglePlayback} aria-label={isPlaying ? "Pause lesson" : step === steps.length - 1 ? "Replay lesson" : "Play lesson"} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button aria-label="Next step" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
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
