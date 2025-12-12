"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Users, Key, Lock, Shield } from "lucide-react"

// 1. Cognito User Pools Explainer (Rich)
export function CognitoUserPoolsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [authFlow, setAuthFlow] = useState<"signup" | "signin" | "mfa">("signin")

  const steps = [
    { title: "Cognito User Pools", description: "Managed user directory for sign-up and sign-in with millions of users" },
    { title: "Authentication Flows", description: "Email/password, phone, social identity providers (Google, Facebook, etc.)" },
    { title: "Tokens", description: "Returns ID token, access token, and refresh token after authentication" },
    { title: "MFA", description: "Multi-factor authentication with SMS or TOTP" },
    { title: "Customization", description: "Lambda triggers for pre/post authentication, custom messages, etc." }
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
        <Users className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Cognito User Pools</h2>
      </div>

      {/* Auth Flow Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "signin", label: "Sign In" },
          { key: "signup", label: "Sign Up" },
          { key: "mfa", label: "With MFA" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setAuthFlow(key as typeof authFlow)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              authFlow === key
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* User */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">👤</span>
            </div>
            <span className="text-sm text-gray-400">User</span>
          </div>

          {/* Flow Steps */}
          <div className="flex-1 mx-4">
            <div className="space-y-3">
              {authFlow === "signin" && (
                <>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-green-400">1.</span>
                    <span className="text-sm text-white">Email + Password</span>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-green-400">2.</span>
                    <span className="text-sm text-white">Validate credentials</span>
                  </div>
                  <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-green-400">3.</span>
                    <span className="text-sm text-green-400">Return JWT tokens</span>
                  </div>
                </>
              )}
              {authFlow === "signup" && (
                <>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-blue-400">1.</span>
                    <span className="text-sm text-white">Submit email + password</span>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-blue-400">2.</span>
                    <span className="text-sm text-white">Verify email (code)</span>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-blue-400">3.</span>
                    <span className="text-sm text-blue-400">User confirmed</span>
                  </div>
                </>
              )}
              {authFlow === "mfa" && (
                <>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-purple-400">1.</span>
                    <span className="text-sm text-white">Email + Password</span>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-yellow-400">2.</span>
                    <span className="text-sm text-yellow-400">MFA Challenge (SMS/TOTP)</span>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-purple-400">3.</span>
                    <span className="text-sm text-white">Enter MFA code</span>
                  </div>
                  <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-green-400">4.</span>
                    <span className="text-sm text-green-400">Return JWT tokens</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cognito */}
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm text-gray-400">User Pool</span>
          </div>
        </div>

        {/* Tokens */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { name: "ID Token", desc: "User identity claims", color: "blue" },
            { name: "Access Token", desc: "API authorization", color: "green" },
            { name: "Refresh Token", desc: "Get new tokens", color: "purple" }
          ].map((token, i) => (
            <div key={i} className={`bg-${token.color}-900/30 border border-${token.color}-600/50 rounded-lg p-3 text-center`}
              style={{
                backgroundColor: token.color === "blue" ? "rgba(30,58,138,0.3)" :
                                token.color === "green" ? "rgba(20,83,45,0.3)" :
                                "rgba(88,28,135,0.3)"
              }}
            >
              <div className="text-white font-semibold text-sm">{token.name}</div>
              <div className="text-xs text-gray-400">{token.desc}</div>
            </div>
          ))}
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
          <li>• User Pools handle authentication (sign-up, sign-in, MFA)</li>
          <li>• Returns three tokens: ID, Access, Refresh</li>
          <li>• Lambda triggers customize authentication flow</li>
          <li>• Hosted UI for quick implementation</li>
        </ul>
      </div>
    </div>
  )
}

// 2. Cognito Identity Pools Explainer (Medium)
export function CognitoIdentityPoolsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [authType, setAuthType] = useState<"authenticated" | "unauthenticated">("authenticated")

  const steps = [
    { title: "Identity Pools", description: "Federate identities and provide temporary AWS credentials" },
    { title: "Identity Sources", description: "Cognito User Pools, social providers, SAML, or guest access" },
    { title: "IAM Roles", description: "Assign different IAM roles for authenticated vs unauthenticated users" },
    { title: "AWS Credentials", description: "Get temporary credentials to access AWS services directly" }
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
        <Key className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Cognito Identity Pools</h2>
      </div>

      {/* Auth Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAuthType("authenticated")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            authType === "authenticated" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Authenticated User
        </button>
        <button
          onClick={() => setAuthType("unauthenticated")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            authType === "unauthenticated" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Guest (Unauthenticated)
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Identity Source */}
          <div className="text-center">
            {authType === "authenticated" ? (
              <div className="space-y-2">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">User Pool</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">Guest</span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="text-gray-500 text-xl">→</div>

          {/* Identity Pool */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <Key className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm text-gray-400">Identity Pool</span>
          </div>

          {/* Arrow */}
          <div className="text-gray-500 text-xl">→</div>

          {/* STS */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs text-gray-400">STS</span>
          </div>

          {/* Arrow */}
          <div className="text-gray-500 text-xl">→</div>

          {/* AWS Services */}
          <div className="text-center">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">S3</span>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">DDB</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-1">AWS Services</span>
          </div>
        </div>

        {/* IAM Role Info */}
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          authType === "authenticated"
            ? "bg-green-900/20 border-green-600/50"
            : "bg-yellow-900/20 border-yellow-600/50"
        }`}>
          <div className={`font-semibold ${authType === "authenticated" ? "text-green-400" : "text-yellow-400"}`}>
            {authType === "authenticated" ? "Authenticated Role" : "Unauthenticated Role"}
          </div>
          <div className="text-sm text-gray-300 mt-2">
            {authType === "authenticated"
              ? "Full access to user-specific resources (S3 prefix: ${cognito-identity.amazonaws.com:sub}/*)"
              : "Limited read-only access to public resources"
            }
          </div>
        </div>
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
          <li>• Identity Pools provide AWS credentials (not authentication)</li>
          <li>• Separate IAM roles for authenticated vs unauthenticated</li>
          <li>• Use with User Pools for complete auth solution</li>
          <li>• Enable direct access to S3, DynamoDB, etc. from client</li>
        </ul>
      </div>
    </div>
  )
}

// 3. Secrets Manager Explainer (Medium)
export function SecretsManagerExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showRotation, setShowRotation] = useState(false)

  const steps = [
    { title: "Secrets Manager", description: "Store, rotate, and manage secrets like database credentials and API keys" },
    { title: "Automatic Rotation", description: "Built-in rotation for RDS, Redshift, DocumentDB" },
    { title: "Cross-Region Replication", description: "Replicate secrets to multiple regions for DR" },
    { title: "Integration", description: "Native integration with Lambda, ECS, RDS, and more" }
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
        <Lock className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Secrets Manager</h2>
      </div>

      {/* Rotation Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowRotation(!showRotation)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showRotation ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          {showRotation ? "🔄 Rotation Enabled" : "Show Rotation"}
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Application */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">λ</span>
            </div>
            <span className="text-sm text-gray-400">Application</span>
          </div>

          {/* API Call */}
          <div className="flex-1 mx-4">
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <div className="font-mono text-xs text-green-400">GetSecretValue</div>
            </div>
          </div>

          {/* Secrets Manager */}
          <div className="text-center relative">
            <div className="w-24 h-24 bg-red-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <Lock className="w-10 h-10 text-white" />
              <span className="text-xs text-white mt-1">Secrets</span>
            </div>
            {showRotation && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-spin">
                <span className="text-white text-xs">🔄</span>
              </div>
            )}
          </div>

          {/* Arrow to DB */}
          {showRotation && (
            <>
              <div className="text-gray-500 text-xl mx-2">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-xs">RDS</span>
                </div>
                <span className="text-xs text-gray-400">Auto-rotate</span>
              </div>
            </>
          )}
        </div>

        {/* Secret Example */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Secret: my-db-credentials</div>
          <pre className="text-xs font-mono text-yellow-400">
{`{
  "username": "admin",
  "password": "************",
  "host": "mydb.abc123.us-east-1.rds.amazonaws.com",
  "port": 5432
}`}
          </pre>
        </div>

        {/* Rotation Schedule */}
        {showRotation && (
          <div className="mt-4 bg-green-900/30 border border-green-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-green-400 mb-2">Automatic Rotation</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Schedule: </span>
                <span className="text-white">Every 30 days</span>
              </div>
              <div>
                <span className="text-gray-400">Last rotated: </span>
                <span className="text-white">15 days ago</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
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
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Automatic rotation for RDS, Redshift, DocumentDB</li>
          <li>• Charges per secret per month + API calls</li>
          <li>• Cross-region replication for disaster recovery</li>
          <li>• Secrets Manager vs Parameter Store: rotation capability</li>
        </ul>
      </div>
    </div>
  )
}

// 4. SSM Parameter Store Explainer (Medium)
export function ParameterStoreExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [paramType, setParamType] = useState<"string" | "securestring" | "stringlist">("securestring")

  const steps = [
    { title: "Parameter Store", description: "Secure, hierarchical storage for configuration and secrets" },
    { title: "Parameter Types", description: "String, StringList, SecureString (encrypted with KMS)" },
    { title: "Hierarchy", description: "Organize parameters with paths like /app/dev/db-url" },
    { title: "Free Tier", description: "Standard parameters are free (up to 10,000)" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const paramTypes = {
    string: { name: "String", icon: "📝", value: "my-app-config", encrypted: false },
    securestring: { name: "SecureString", icon: "🔐", value: "************", encrypted: true },
    stringlist: { name: "StringList", icon: "📋", value: "val1,val2,val3", encrypted: false }
  }

  const currentType = paramTypes[paramType]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">SSM Parameter Store</h2>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2 mb-6">
        {Object.entries(paramTypes).map(([key, type]) => (
          <button
            key={key}
            onClick={() => setParamType(key as typeof paramType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              paramType === key ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{type.icon}</span>
            {type.name}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {/* Parameter Hierarchy */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-3">Parameter Hierarchy</div>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <div className="text-gray-500">/myapp</div>
            <div className="ml-4 text-gray-500">├── /dev</div>
            <div className="ml-8 text-green-400">├── /db-url (String)</div>
            <div className="ml-8 text-yellow-400">├── /db-password (SecureString)</div>
            <div className="ml-4 text-gray-500">├── /prod</div>
            <div className="ml-8 text-green-400">├── /db-url (String)</div>
            <div className="ml-8 text-yellow-400">└── /db-password (SecureString)</div>
          </div>
        </div>

        {/* Current Parameter */}
        <div className={`p-4 rounded-lg border-2 ${
          currentType.encrypted ? "border-yellow-500 bg-yellow-900/20" : "border-green-500 bg-green-900/20"
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{currentType.icon}</span>
            <div>
              <div className="text-white font-semibold">{currentType.name}</div>
              <div className="text-xs text-gray-400">
                {currentType.encrypted ? "Encrypted with KMS" : "Plain text"}
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-400 mb-1">Value</div>
            <div className={`font-mono ${currentType.encrypted ? "text-yellow-400" : "text-green-400"}`}>
              {currentType.value}
            </div>
          </div>
        </div>

        {/* Comparison with Secrets Manager */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3">
            <div className="text-green-400 font-semibold mb-1">Parameter Store</div>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>✓ Free tier (standard)</li>
              <li>✓ Hierarchical organization</li>
              <li>✗ No auto-rotation</li>
            </ul>
          </div>
          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
            <div className="text-red-400 font-semibold mb-1">Secrets Manager</div>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>✗ Costs per secret</li>
              <li>✓ Auto-rotation</li>
              <li>✓ Cross-region replication</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
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
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Takeaways */}
      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Standard parameters: free, up to 10,000</li>
          <li>• SecureString uses KMS for encryption</li>
          <li>• Use hierarchical paths: /app/env/param</li>
          <li>• No automatic rotation (use Secrets Manager for that)</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const cognitoSecretsExplainers = {
  "cognito-user-pools": CognitoUserPoolsExplainer,
  "cognito-identity-pools": CognitoIdentityPoolsExplainer,
  "secrets-manager": SecretsManagerExplainer,
  "parameter-store": ParameterStoreExplainer
}
