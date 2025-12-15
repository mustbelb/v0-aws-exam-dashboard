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

// 5. KMS Keys Explainer
export function KmsKeysExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [keyType, setKeyType] = useState<"aws" | "customer" | "external">("customer")

  const steps = [
    { title: "KMS Keys", description: "Cryptographic keys for encryption at rest and in transit" },
    { title: "AWS Managed Keys", description: "Created and managed by AWS services (aws/service-name)" },
    { title: "Customer Managed Keys", description: "Created and controlled by you with full key policies" },
    { title: "Key Policies", description: "Resource-based policies controlling key access" },
    { title: "Grants", description: "Delegate key usage without modifying key policy" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const keyTypes = {
    aws: { name: "AWS Managed", icon: "🔑", control: "AWS", cost: "Free", rotation: "Automatic (3 years)" },
    customer: { name: "Customer Managed", icon: "🗝️", control: "You", cost: "$1/month", rotation: "Configurable" },
    external: { name: "External (BYOK)", icon: "🔐", control: "You (imported)", cost: "$1/month", rotation: "Manual only" }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">KMS Keys</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {Object.entries(keyTypes).map(([key, type]) => (
          <button
            key={key}
            onClick={() => setKeyType(key as typeof keyType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              keyType === key ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span>{type.icon}</span> {type.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Key ID</div>
            <div className="font-mono text-yellow-400 text-sm">mrk-1234abcd-12ab-34cd-56ef-1234567890ab</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">ARN</div>
            <div className="font-mono text-green-400 text-xs overflow-auto">arn:aws:kms:us-east-1:123456789:key/mrk-1234...</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries({ Control: keyTypes[keyType].control, Cost: keyTypes[keyType].cost, Rotation: keyTypes[keyType].rotation }).map(([label, value]) => (
            <div key={label} className="bg-gray-700 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400">{label}</div>
              <div className="text-white font-semibold text-sm">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Key Policy (Resource-based)</div>
          <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`{
  "Effect": "Allow",
  "Principal": {"AWS": "arn:aws:iam::123456789:role/MyRole"},
  "Action": ["kms:Encrypt", "kms:Decrypt"],
  "Resource": "*"
}`}
          </pre>
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
          <li>• Customer managed keys: full control over key policy</li>
          <li>• AWS managed keys: free but limited control</li>
          <li>• Key policy + IAM policy = access decision</li>
          <li>• Multi-region keys for cross-region encryption</li>
        </ul>
      </div>
    </div>
  )
}

// 6. KMS Encryption Operations Explainer
export function KmsEncryptionExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [operation, setOperation] = useState<"encrypt" | "decrypt" | "envelope">("envelope")

  const steps = [
    { title: "KMS Encryption", description: "Encrypt and decrypt data using KMS keys" },
    { title: "Direct Encryption", description: "Encrypt up to 4KB directly with KMS" },
    { title: "Envelope Encryption", description: "Use data keys for larger data (S3, EBS)" },
    { title: "Data Keys", description: "GenerateDataKey returns plaintext and encrypted versions" },
    { title: "Client-Side vs Server-Side", description: "Choose based on control and performance needs" }
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
        <Lock className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">KMS Encryption Operations</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: "encrypt", label: "Direct Encrypt" },
          { key: "decrypt", label: "Direct Decrypt" },
          { key: "envelope", label: "Envelope Encryption" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setOperation(key as typeof operation)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              operation === key ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {operation === "envelope" ? (
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-400 mb-4">Envelope Encryption (for large data)</div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-purple-600 rounded-lg p-4 text-center">
                <Key className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-xs text-white">KMS Key</div>
              </div>
              <div className="text-gray-500">→ GenerateDataKey →</div>
              <div className="bg-yellow-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🔑</div>
                <div className="text-xs text-white">Data Key</div>
              </div>
              <div className="text-gray-500">→ Encrypt →</div>
              <div className="bg-green-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-xs text-white">Encrypted Data</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center text-sm text-gray-300">
              Encrypted data key stored with encrypted data
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 ${
                operation === "encrypt" ? "bg-blue-600" : "bg-green-600"
              }`}>
                <span className="text-2xl">{operation === "encrypt" ? "📄" : "🔒"}</span>
              </div>
              <div className="text-xs text-gray-400">{operation === "encrypt" ? "Plaintext" : "Ciphertext"}</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="bg-purple-600 rounded-lg p-4 text-center">
              <Key className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-xs text-white">KMS</div>
              <div className="text-xs text-purple-200">{operation === "encrypt" ? "Encrypt" : "Decrypt"}</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="text-center">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 ${
                operation === "encrypt" ? "bg-green-600" : "bg-blue-600"
              }`}>
                <span className="text-2xl">{operation === "encrypt" ? "🔒" : "📄"}</span>
              </div>
              <div className="text-xs text-gray-400">{operation === "encrypt" ? "Ciphertext" : "Plaintext"}</div>
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
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Direct KMS encryption: up to 4KB only</li>
          <li>• Envelope encryption: use data keys for larger data</li>
          <li>• GenerateDataKey returns both plaintext and encrypted key</li>
          <li>• AWS services use envelope encryption (S3, EBS, etc.)</li>
        </ul>
      </div>
    </div>
  )
}

// 7. Cognito Lambda Triggers Explainer
export function CognitoTriggersExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState("preSignUp")

  const steps = [
    { title: "Lambda Triggers", description: "Customize Cognito authentication with Lambda functions" },
    { title: "Pre Sign-Up", description: "Validate or auto-confirm users before registration" },
    { title: "Pre Authentication", description: "Custom validation before authentication" },
    { title: "Post Confirmation", description: "Send welcome emails, add to groups after sign-up" },
    { title: "Custom Message", description: "Customize verification and MFA messages" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const triggers = {
    preSignUp: { name: "Pre Sign-Up", use: "Validate email domain, auto-confirm" },
    preAuth: { name: "Pre Authentication", use: "Block certain users, custom validation" },
    postConfirm: { name: "Post Confirmation", use: "Welcome email, add to DynamoDB" },
    customMessage: { name: "Custom Message", use: "Customize email/SMS content" },
    preToken: { name: "Pre Token Generation", use: "Add custom claims to tokens" },
    migrate: { name: "User Migration", use: "Migrate users from legacy system" }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Cognito Lambda Triggers</h2>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(triggers).map(([key, trigger]) => (
          <button
            key={key}
            onClick={() => setSelectedTrigger(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedTrigger === key ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {trigger.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">👤</span>
            </div>
            <span className="text-xs text-gray-400">User</span>
          </div>
          <div className="text-gray-500">→</div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs text-gray-400">Cognito</span>
          </div>
          <div className="text-gray-500">→</div>
          <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
            <div className="text-center">
              <span className="text-2xl">λ</span>
              <div className="text-xs text-cyan-400 mt-1">{triggers[selectedTrigger as keyof typeof triggers].name}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Use Case</div>
          <div className="text-white">{triggers[selectedTrigger as keyof typeof triggers].use}</div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Pre-triggers can validate and modify, Post-triggers for side effects</li>
          <li>• User Migration trigger for gradual migration</li>
          <li>• Pre Token Generation adds custom claims to JWT</li>
          <li>• Lambda must return event object back to Cognito</li>
        </ul>
      </div>
    </div>
  )
}

// 8. ACM Certificate Manager Explainer
export function AcmExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "ACM Certificates", description: "Provision, manage, and deploy SSL/TLS certificates" },
    { title: "Public Certificates", description: "Free certificates for AWS services (CloudFront, ALB, API Gateway)" },
    { title: "DNS Validation", description: "Add CNAME record to prove domain ownership" },
    { title: "Auto-Renewal", description: "Automatic renewal for DNS-validated certificates" },
    { title: "Regional vs Global", description: "CloudFront requires us-east-1, ALB uses regional" }
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
        <Shield className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">ACM Certificate Manager</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm text-gray-400">ACM</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500">→ Attaches to →</div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { icon: "🌐", name: "CloudFront", region: "us-east-1 only" },
              { icon: "⚖️", name: "ALB/NLB", region: "Same region" },
              { icon: "🔌", name: "API Gateway", region: "Same region" }
            ].map((service, i) => (
              <div key={i} className="bg-gray-700 rounded-lg px-4 py-2 flex items-center gap-3">
                <span className="text-xl">{service.icon}</span>
                <div>
                  <div className="text-white text-sm">{service.name}</div>
                  <div className="text-xs text-gray-400">{service.region}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">DNS Validation</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Add CNAME record to DNS</li>
              <li>• Automatic renewal</li>
              <li>• Recommended method</li>
            </ul>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-400 mb-2">Email Validation</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Email to domain contacts</li>
              <li>• Manual renewal</li>
              <li>• Legacy method</li>
            </ul>
          </div>
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
          <li>• Public certificates are FREE for AWS services</li>
          <li>• CloudFront requires certificate in us-east-1</li>
          <li>• DNS validation enables automatic renewal</li>
          <li>• Cannot export public certificates (for EC2, use private CA)</li>
        </ul>
      </div>
    </div>
  )
}

// 9. WAF Explainer
export function WafExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "AWS WAF", description: "Web Application Firewall to protect against common web exploits" },
    { title: "Web ACLs", description: "Container for rules - attached to CloudFront, ALB, API Gateway" },
    { title: "Rules", description: "Match conditions (IP, geo, size, SQLi, XSS) with actions" },
    { title: "Managed Rules", description: "AWS and Marketplace rule groups (OWASP, bot protection)" },
    { title: "Rate Limiting", description: "Block IPs exceeding request threshold" }
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
        <Shield className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">AWS WAF</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🌐</span>
            </div>
            <span className="text-xs text-gray-400">Internet</span>
          </div>
          <div className="text-gray-500">→</div>
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-sm text-red-400 font-semibold">WAF</div>
          </div>
          <div className="text-gray-500">→</div>
          <div className="flex flex-col gap-2">
            <div className="w-16 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xs text-white">CloudFront</span>
            </div>
            <div className="w-16 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xs text-white">ALB</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { rule: "SQL Injection", action: "Block", color: "red" },
            { rule: "XSS", action: "Block", color: "red" },
            { rule: "Rate Limit (2000/5min)", action: "Block", color: "yellow" },
            { rule: "Geo (Allow US)", action: "Allow", color: "green" },
            { rule: "IP Blacklist", action: "Block", color: "red" },
            { rule: "Bot Control", action: "Challenge", color: "blue" }
          ].map((rule, i) => (
            <div key={i} className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
              rule.color === "red" ? "border-red-500" :
              rule.color === "yellow" ? "border-yellow-500" :
              rule.color === "green" ? "border-green-500" : "border-blue-500"
            }`}>
              <div className="text-xs text-white">{rule.rule}</div>
              <div className={`text-xs ${
                rule.action === "Block" ? "text-red-400" :
                rule.action === "Allow" ? "text-green-400" : "text-blue-400"
              }`}>{rule.action}</div>
            </div>
          ))}
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
          <li>• WAF protects CloudFront, ALB, API Gateway, AppSync</li>
          <li>• Rate-based rules for DDoS protection at layer 7</li>
          <li>• Managed rules: AWSManagedRulesCommonRuleSet</li>
          <li>• Rule actions: Allow, Block, Count, CAPTCHA</li>
        </ul>
      </div>
    </div>
  )
}

// 10. Shield Explainer
export function ShieldExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tier, setTier] = useState<"standard" | "advanced">("standard")

  const steps = [
    { title: "AWS Shield", description: "Managed DDoS protection for AWS resources" },
    { title: "Shield Standard", description: "Free, automatic protection for all AWS customers" },
    { title: "Shield Advanced", description: "Enhanced protection with DDoS Response Team support" },
    { title: "Cost Protection", description: "Advanced tier includes cost protection during attacks" },
    { title: "Integration", description: "Works with WAF, CloudFront, Route 53, Global Accelerator" }
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
        <Shield className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">AWS Shield</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTier("standard")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            tier === "standard" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Standard (Free)
        </button>
        <button
          onClick={() => setTier("advanced")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            tier === "advanced" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Advanced ($3000/mo)
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${tier === "standard" ? "bg-green-900/30 border-2 border-green-500" : "bg-gray-700"}`}>
            <div className="text-lg font-semibold text-green-400 mb-3">Shield Standard</div>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Layer 3/4 protection</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Automatic detection</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Always on, no cost</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✗</span> No DRT support</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✗</span> No cost protection</li>
            </ul>
          </div>
          <div className={`p-4 rounded-lg ${tier === "advanced" ? "bg-blue-900/30 border-2 border-blue-500" : "bg-gray-700"}`}>
            <div className="text-lg font-semibold text-blue-400 mb-3">Shield Advanced</div>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Layer 3/4/7 protection</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Real-time metrics</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> DDoS Response Team</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Cost protection</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> WAF included</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Shield Standard is FREE and always on</li>
          <li>• Advanced: $3000/month, 1-year commitment</li>
          <li>• DRT (DDoS Response Team) only with Advanced</li>
          <li>• Cost protection reimburses DDoS-related charges</li>
        </ul>
      </div>
    </div>
  )
}

// 11. GuardDuty Explainer
export function GuardDutyExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "GuardDuty", description: "Intelligent threat detection using ML and anomaly detection" },
    { title: "Data Sources", description: "CloudTrail, VPC Flow Logs, DNS logs, S3 data events" },
    { title: "Finding Types", description: "Recon, instance compromise, account compromise, S3 threats" },
    { title: "Integration", description: "EventBridge for automated response (Lambda, SNS)" },
    { title: "Multi-Account", description: "Centralized management via AWS Organizations" }
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
        <Shield className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Amazon GuardDuty</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { name: "CloudTrail", icon: "📋" },
            { name: "VPC Flow", icon: "🌊" },
            { name: "DNS Logs", icon: "🔤" },
            { name: "S3 Events", icon: "📦" }
          ].map((source, i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-3 text-center">
              <span className="text-2xl">{source.icon}</span>
              <div className="text-xs text-gray-300 mt-1">{source.name}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-gray-500">↓</div>
        </div>

        <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-orange-400" />
            <div>
              <div className="text-lg font-semibold text-orange-400">GuardDuty</div>
              <div className="text-xs text-gray-400">ML-powered threat detection</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: "Recon:EC2/PortScan", severity: "Medium" },
              { type: "UnauthorizedAccess:IAM", severity: "High" },
              { type: "CryptoCurrency:EC2", severity: "High" }
            ].map((finding, i) => (
              <div key={i} className={`bg-gray-800 rounded p-2 text-xs ${
                finding.severity === "High" ? "border-l-2 border-red-500" : "border-l-2 border-yellow-500"
              }`}>
                <div className="text-white">{finding.type}</div>
                <div className={finding.severity === "High" ? "text-red-400" : "text-yellow-400"}>{finding.severity}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="text-gray-500">↓ EventBridge ↓</div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="bg-yellow-600 rounded-lg px-4 py-2 text-xs text-white">Lambda</div>
          <div className="bg-red-600 rounded-lg px-4 py-2 text-xs text-white">SNS</div>
          <div className="bg-blue-600 rounded-lg px-4 py-2 text-xs text-white">Security Hub</div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• One-click enable, 30-day free trial</li>
          <li>• Analyzes CloudTrail, VPC Flow Logs, DNS, S3</li>
          <li>• Findings sent to EventBridge for automation</li>
          <li>• Integrates with Security Hub for aggregation</li>
        </ul>
      </div>
    </div>
  )
}

// 12. Macie Explainer
export function MacieExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Amazon Macie", description: "ML-powered service to discover and protect sensitive data in S3" },
    { title: "Data Discovery", description: "Automatically discovers PII, credentials, financial data" },
    { title: "Sensitive Data Types", description: "Credit cards, SSN, API keys, passwords, custom patterns" },
    { title: "Findings", description: "Alerts on public buckets, unencrypted data, shared access" },
    { title: "Integration", description: "EventBridge for automated remediation" }
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
        <Shield className="w-8 h-8 text-pink-400" />
        <h2 className="text-2xl font-bold text-white">Amazon Macie</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-sm text-gray-400">S3 Buckets</span>
          </div>
          <div className="text-gray-500">→ Scan →</div>
          <div className="bg-pink-900/30 border-2 border-pink-500 rounded-lg p-4">
            <Shield className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="text-sm text-pink-400 font-semibold text-center">Macie</div>
          </div>
          <div className="text-gray-500">→ Alert →</div>
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl">🔔</span>
            </div>
            <span className="text-sm text-gray-400">EventBridge</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { type: "Credit Cards", icon: "💳", count: 23 },
            { type: "SSN", icon: "🔢", count: 156 },
            { type: "API Keys", icon: "🔑", count: 12 },
            { type: "Passwords", icon: "🔐", count: 8 }
          ].map((data, i) => (
            <div key={i} className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 text-center">
              <span className="text-xl">{data.icon}</span>
              <div className="text-xs text-white mt-1">{data.type}</div>
              <div className="text-red-400 font-semibold">{data.count} found</div>
            </div>
          ))}
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
          <li>• S3-only service for sensitive data discovery</li>
          <li>• Uses ML to identify PII and sensitive data</li>
          <li>• Custom data identifiers with regex</li>
          <li>• One-click enable across organization with AWS Organizations</li>
        </ul>
      </div>
    </div>
  )
}

// 13. Cognito Hosted UI Explainer
export function CognitoHostedUIExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Hosted UI", description: "Pre-built customizable sign-in pages hosted by Cognito" },
    { title: "Customization", description: "Logo, CSS, and custom domain support" },
    { title: "OAuth 2.0 Flows", description: "Authorization code, implicit, and client credentials" },
    { title: "Social Sign-In", description: "Google, Facebook, Amazon, Apple built-in" },
    { title: "SAML/OIDC", description: "Enterprise identity provider federation" }
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
        <Users className="w-8 h-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Cognito Hosted UI</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xl">🏢</span>
            </div>
            <div className="text-gray-800 font-semibold">MyApp</div>
          </div>
          <div className="space-y-3">
            <input type="text" placeholder="Email" className="w-full p-2 border border-gray-300 rounded text-sm" />
            <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded text-sm" />
            <button className="w-full bg-indigo-600 text-white py-2 rounded text-sm">Sign In</button>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">f</div>
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">G</div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white">🍎</div>
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

      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30">
        <h3 className="text-lg font-semibold text-indigo-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Zero-code authentication UI</li>
          <li>• Custom domain requires ACM certificate in us-east-1</li>
          <li>• Supports OAuth 2.0 authorization code with PKCE</li>
          <li>• Social IdPs configured in User Pool settings</li>
        </ul>
      </div>
    </div>
  )
}

// 14. Secrets Manager vs Parameter Store Explainer
export function SecretsVsParameterExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Choosing the Right Service", description: "Both store configuration, but with different capabilities" },
    { title: "Secrets Manager", description: "Best for credentials needing rotation" },
    { title: "Parameter Store", description: "Best for general configuration and cost-sensitive cases" },
    { title: "Cost Comparison", description: "Parameter Store free tier vs Secrets Manager per-secret pricing" },
    { title: "Integration", description: "Both integrate with Lambda, ECS, CloudFormation" }
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
        <Key className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-bold text-white">Secrets Manager vs Parameter Store</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-red-400" />
              <div className="text-lg font-semibold text-red-400">Secrets Manager</div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { feature: "Auto Rotation", value: "✓", positive: true },
                  { feature: "Cross-Region", value: "✓", positive: true },
                  { feature: "Cost", value: "$0.40/secret/mo", positive: false },
                  { feature: "Hierarchy", value: "Limited", positive: false },
                  { feature: "Version History", value: "✓", positive: true }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="py-2 text-gray-400">{row.feature}</td>
                    <td className={`py-2 text-right ${row.positive ? "text-green-400" : "text-yellow-400"}`}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-6 h-6 text-green-400" />
              <div className="text-lg font-semibold text-green-400">Parameter Store</div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { feature: "Auto Rotation", value: "✗", positive: false },
                  { feature: "Cross-Region", value: "✗", positive: false },
                  { feature: "Cost", value: "Free (standard)", positive: true },
                  { feature: "Hierarchy", value: "✓ Full paths", positive: true },
                  { feature: "Version History", value: "✓", positive: true }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="py-2 text-gray-400">{row.feature}</td>
                    <td className={`py-2 text-right ${row.positive ? "text-green-400" : "text-red-400"}`}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">Step {step + 1}/{steps.length}</span>
          <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
        </div>
        <p className="text-gray-300">{steps[step].description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => { setStep(0); setIsPlaying(false) }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-xl p-4 border border-teal-500/30">
        <h3 className="text-lg font-semibold text-teal-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Secrets Manager: rotation needed → use this</li>
          <li>• Parameter Store: config data, cost-sensitive → use this</li>
          <li>• Both can reference each other via dynamic references</li>
          <li>• CloudFormation supports both via dynamic references</li>
        </ul>
      </div>
    </div>
  )
}

// 15. KMS Key Rotation Explainer
export function KmsRotationExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "KMS Key Rotation", description: "Regularly rotate cryptographic material for security" },
    { title: "Automatic Rotation", description: "Enable for customer managed keys (annual)" },
    { title: "Key Material", description: "Old key material retained for decryption" },
    { title: "Manual Rotation", description: "Create new key, update aliases, re-encrypt" },
    { title: "Imported Keys", description: "Manual rotation only for BYOK keys" }
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
        <Key className="w-8 h-8 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">KMS Key Rotation</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          {[2022, 2023, 2024].map((year, i) => (
            <div key={year} className="text-center">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-2 ${
                i === 2 ? "bg-amber-600" : "bg-gray-600"
              }`}>
                <Key className={`w-8 h-8 ${i === 2 ? "text-white" : "text-gray-400"}`} />
              </div>
              <div className="text-xs text-gray-400">Key Material</div>
              <div className={`text-sm ${i === 2 ? "text-amber-400" : "text-gray-500"}`}>{year}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center text-sm text-gray-300 mb-6">
          Same Key ID - Old key material retained for decryption
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-green-400 mb-2">Automatic Rotation</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Every 365 days (configurable)</li>
              <li>• Same key ID maintained</li>
              <li>• No re-encryption needed</li>
              <li>• Customer managed keys only</li>
            </ul>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-400 mb-2">Manual Rotation</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Create new key</li>
              <li>• Update key alias</li>
              <li>• Re-encrypt data (optional)</li>
              <li>• Required for imported keys</li>
            </ul>
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
          <li>• Automatic: same key ID, old material retained</li>
          <li>• Manual: new key ID, use aliases for seamless switch</li>
          <li>• AWS managed keys: automatic rotation (cannot disable)</li>
          <li>• Imported keys: manual rotation only</li>
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
  "parameter-store": ParameterStoreExplainer,
  "kms-keys": KmsKeysExplainer,
  "kms-encryption": KmsEncryptionExplainer,
  "cognito-triggers": CognitoTriggersExplainer,
  "acm": AcmExplainer,
  "waf": WafExplainer,
  "shield": ShieldExplainer,
  "guardduty": GuardDutyExplainer,
  "macie": MacieExplainer,
  "cognito-hosted-ui": CognitoHostedUIExplainer,
  "secrets-vs-parameter": SecretsVsParameterExplainer,
  "kms-rotation": KmsRotationExplainer,
}
