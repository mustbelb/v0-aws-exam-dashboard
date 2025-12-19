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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Users className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Cognito User Pools</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Managed user directory service for sign-up and sign-in. Handles millions of users with built-in authentication flows.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-orange-400 text-2xl mb-2">👥</div>
                <div className="text-white font-semibold text-sm">Millions of Users</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-orange-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">Secure Auth</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-orange-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Easy Setup</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
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
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">JWT Tokens Returned After Authentication</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "ID Token", desc: "User identity claims (name, email, etc.)", color: "blue", icon: "🆔" },
                { name: "Access Token", desc: "API authorization for protected resources", color: "green", icon: "🔑" },
                { name: "Refresh Token", desc: "Get new tokens without re-authenticating", color: "purple", icon: "🔄" }
              ].map((token, i) => (
                <div key={i} className="rounded-lg p-4 text-center border-2"
                  style={{
                    backgroundColor: token.color === "blue" ? "rgba(30,58,138,0.3)" :
                                    token.color === "green" ? "rgba(20,83,45,0.3)" :
                                    "rgba(88,28,135,0.3)",
                    borderColor: token.color === "blue" ? "rgba(37,99,235,0.5)" :
                                token.color === "green" ? "rgba(34,197,94,0.5)" :
                                "rgba(168,85,247,0.5)"
                  }}
                >
                  <div className="text-4xl mb-3">{token.icon}</div>
                  <div className="text-white font-semibold text-lg mb-2">{token.name}</div>
                  <div className="text-xs text-gray-300">{token.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Example JWT Payload (ID Token):</div>
              <pre className="text-xs font-mono text-green-400">
{`{
  "sub": "a1b2c3d4-...",
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe"
}`}
              </pre>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Multi-Factor Authentication (MFA)</h3>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-3xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">User</span>
              </div>

              <div className="flex-1 mx-4 space-y-3">
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
                  <span className="text-sm text-white">Enter 6-digit code</span>
                </div>
                <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-green-400">4.</span>
                  <span className="text-sm text-green-400">Return JWT tokens</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">User Pool</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">📱 SMS MFA</div>
                <div className="text-sm text-gray-300">Code sent via text message</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="font-semibold text-purple-400 mb-2">🔐 TOTP MFA</div>
                <div className="text-sm text-gray-300">Authenticator app (Google/Microsoft)</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Lambda Triggers for Customization</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">λ</span>
                  <div className="font-semibold text-orange-400">Pre Authentication</div>
                </div>
                <div className="text-sm text-gray-300">Custom validation before login</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">λ</span>
                  <div className="font-semibold text-green-400">Post Authentication</div>
                </div>
                <div className="text-sm text-gray-300">Execute logic after successful login</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">λ</span>
                  <div className="font-semibold text-blue-400">Pre Sign-up</div>
                </div>
                <div className="text-sm text-gray-300">Auto-confirm users, custom validation</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">λ</span>
                  <div className="font-semibold text-purple-400">Custom Message</div>
                </div>
                <div className="text-sm text-gray-300">Customize email/SMS templates</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">λ</span>
                  <div className="font-semibold text-yellow-400">Pre Token Generation</div>
                </div>
                <div className="text-sm text-gray-300">Add/modify token claims</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">λ</span>
                  <div className="font-semibold text-red-400">User Migration</div>
                </div>
                <div className="text-sm text-gray-300">Migrate users from legacy systems</div>
              </div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Key className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Cognito Identity Pools</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Federate identities from multiple sources and provide temporary AWS credentials to access AWS services directly from your app.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-blue-400 text-2xl mb-2">🔑</div>
                <div className="text-white font-semibold text-sm">Temporary Credentials</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-blue-400 text-2xl mb-2">🌐</div>
                <div className="text-white font-semibold text-sm">Multiple Sources</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Identity Sources</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-orange-400" />
                  <div className="font-semibold text-orange-400">Cognito User Pools</div>
                </div>
                <div className="text-sm text-gray-300">Your own user directory</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌐</span>
                  <div className="font-semibold text-blue-400">Social Providers</div>
                </div>
                <div className="text-sm text-gray-300">Google, Facebook, Amazon, Apple</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏢</span>
                  <div className="font-semibold text-purple-400">SAML Providers</div>
                </div>
                <div className="text-sm text-gray-300">Enterprise identity systems</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">👤</span>
                  <div className="font-semibold text-yellow-400">Guest Access</div>
                </div>
                <div className="text-sm text-gray-300">Unauthenticated users</div>
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">All sources flow into Identity Pool → AWS Credentials</div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">IAM Role Assignment</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg border-2 ${
                authType === "authenticated"
                  ? "bg-green-900/30 border-green-600"
                  : "bg-green-900/20 border-green-600/50"
              }`}>
                <div className="font-semibold text-green-400 mb-3 text-lg">Authenticated Role</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>✓ User-specific resources</div>
                  <div>✓ S3 prefix: ${`\${cognito-identity.amazonaws.com:sub}`}/*</div>
                  <div>✓ DynamoDB row-level access</div>
                  <div>✓ Full read/write permissions</div>
                </div>
                <div className="mt-4 bg-gray-900 rounded p-2 text-xs font-mono text-green-400">
                  arn:aws:iam::123:role/AuthRole
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                authType === "unauthenticated"
                  ? "bg-yellow-900/30 border-yellow-600"
                  : "bg-yellow-900/20 border-yellow-600/50"
              }`}>
                <div className="font-semibold text-yellow-400 mb-3 text-lg">Unauthenticated Role</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>✓ Public resources only</div>
                  <div>✓ Limited S3 read access</div>
                  <div>✓ No write permissions</div>
                  <div>✓ Restricted scope</div>
                </div>
                <div className="mt-4 bg-gray-900 rounded p-2 text-xs font-mono text-yellow-400">
                  arn:aws:iam::123:role/UnauthRole
                </div>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400 text-sm">Toggle above to see different role types</div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">AWS Credentials Flow</h3>
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

            {/* Credentials Info */}
            <div className="mt-6 bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Temporary Credentials (STS AssumeRoleWithWebIdentity):</div>
              <pre className="text-xs font-mono text-green-400">
{`{
  "AccessKeyId": "ASIA...",
  "SecretAccessKey": "...",
  "SessionToken": "...",
  "Expiration": "2024-01-15T12:00:00Z"
}`}
              </pre>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-red-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AWS Secrets Manager</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Securely store, rotate, and manage database credentials, API keys, and other secrets throughout their lifecycle.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-red-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">Encrypted Storage</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-red-400 text-2xl mb-2">🔄</div>
                <div className="text-white font-semibold text-sm">Auto Rotation</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-red-400 text-2xl mb-2">🔍</div>
                <div className="text-white font-semibold text-sm">Audit &amp; Monitor</div>
              </div>
            </div>
            <div className="mt-6 bg-gray-900 rounded-lg p-4 max-w-xl mx-auto">
              <div className="text-sm text-gray-400 mb-2">Example Secret:</div>
              <pre className="text-xs font-mono text-yellow-400">
{`{
  "username": "admin",
  "password": "************",
  "host": "mydb.abc123.us-east-1.rds.amazonaws.com",
  "port": 5432
}`}
              </pre>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Automatic Rotation</h3>
            <div className="flex items-center justify-between mb-6">
              {/* Application */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">λ</span>
                </div>
                <span className="text-sm text-gray-400">Lambda</span>
              </div>

              <div className="text-gray-500 text-xl">→</div>

              {/* Secrets Manager */}
              <div className="text-center relative">
                <div className="w-24 h-24 bg-red-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <Lock className="w-10 h-10 text-white" />
                  <span className="text-xs text-white mt-1">Secrets</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-spin">
                  <span className="text-white text-xs">🔄</span>
                </div>
              </div>

              <div className="text-gray-500 text-xl">→</div>

              {/* Database */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm">RDS</span>
                </div>
                <span className="text-xs text-gray-400">Database</span>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
              <div className="font-semibold text-green-400 mb-3">Automatic Rotation Schedule</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Frequency: </span>
                  <span className="text-white">Every 30 days</span>
                </div>
                <div>
                  <span className="text-gray-400">Last rotated: </span>
                  <span className="text-white">15 days ago</span>
                </div>
                <div>
                  <span className="text-gray-400">Next rotation: </span>
                  <span className="text-white">In 15 days</span>
                </div>
                <div>
                  <span className="text-gray-400">Status: </span>
                  <span className="text-green-400">Enabled ✓</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-semibold text-xs mb-1">RDS</div>
                <div className="text-gray-400 text-xs">Supported</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-semibold text-xs mb-1">Redshift</div>
                <div className="text-gray-400 text-xs">Supported</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-semibold text-xs mb-1">DocumentDB</div>
                <div className="text-gray-400 text-xs">Supported</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Cross-Region Replication</h3>
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Primary Region */}
              <div className="text-center">
                <div className="bg-red-600 rounded-lg p-6 mb-3">
                  <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Primary Secret</div>
                  <div className="text-xs text-red-200 mt-1">us-east-1</div>
                </div>
                <div className="bg-blue-900/30 border border-blue-600/50 rounded px-3 py-1 text-xs text-blue-400">
                  Source
                </div>
              </div>

              <div className="text-gray-500 text-2xl">⇄</div>

              {/* Replica Region 1 */}
              <div className="text-center">
                <div className="bg-red-500/70 rounded-lg p-6 mb-3">
                  <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Replica</div>
                  <div className="text-xs text-red-200 mt-1">us-west-2</div>
                </div>
                <div className="bg-green-900/30 border border-green-600/50 rounded px-3 py-1 text-xs text-green-400">
                  Auto-sync
                </div>
              </div>

              <div className="text-gray-500 text-2xl">⇄</div>

              {/* Replica Region 2 */}
              <div className="text-center">
                <div className="bg-red-500/70 rounded-lg p-6 mb-3">
                  <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Replica</div>
                  <div className="text-xs text-red-200 mt-1">eu-west-1</div>
                </div>
                <div className="bg-green-900/30 border border-green-600/50 rounded px-3 py-1 text-xs text-green-400">
                  Auto-sync
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">Benefits</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Disaster recovery</li>
                  <li>✓ Low-latency access</li>
                  <li>✓ Multi-region apps</li>
                </ul>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="font-semibold text-purple-400 mb-2">Features</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Automatic sync</li>
                  <li>✓ Read replicas</li>
                  <li>✓ Regional failover</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Native AWS Integration</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">λ</div>
                <div className="font-semibold text-blue-400">Lambda</div>
                <div className="text-xs text-gray-400 mt-2">Environment variables or SDK</div>
              </div>
              <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="font-semibold text-orange-400">ECS</div>
                <div className="text-xs text-gray-400 mt-2">Task definition secrets</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🗄️</div>
                <div className="font-semibold text-blue-400">RDS</div>
                <div className="text-xs text-gray-400 mt-2">Master password rotation</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">☸️</div>
                <div className="font-semibold text-purple-400">EKS</div>
                <div className="text-xs text-gray-400 mt-2">Secrets Store CSI Driver</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-semibold text-green-400">CodeBuild</div>
                <div className="text-xs text-gray-400 mt-2">Build environment secrets</div>
              </div>
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-semibold text-red-400">EC2</div>
                <div className="text-xs text-gray-400 mt-2">SDK or CLI access</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Example: Lambda GetSecretValue</div>
              <pre className="text-xs font-mono text-green-400">
{`const secret = await secretsManager.getSecretValue({
  SecretId: 'my-db-credentials'
}).promise();`}
              </pre>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Key className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">SSM Parameter Store</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Secure, hierarchical storage for configuration data and secrets. Perfect for application configs, feature flags, and simple secrets.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-2xl mb-2">💰</div>
                <div className="text-white font-semibold text-sm">Free Tier</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-2xl mb-2">📁</div>
                <div className="text-white font-semibold text-sm">Hierarchical</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">KMS Encryption</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Parameter Types</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg border-2 ${
                paramType === "string" ? "border-green-500 bg-green-900/30" : "border-green-500/30 bg-green-900/10"
              }`}>
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="font-semibold text-green-400">String</div>
                </div>
                <div className="text-xs text-gray-300 text-center mb-3">Plain text configuration</div>
                <div className="bg-gray-900 rounded p-2 font-mono text-xs text-green-400">
                  my-app-config
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                paramType === "securestring" ? "border-yellow-500 bg-yellow-900/30" : "border-yellow-500/30 bg-yellow-900/10"
              }`}>
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🔐</div>
                  <div className="font-semibold text-yellow-400">SecureString</div>
                </div>
                <div className="text-xs text-gray-300 text-center mb-3">Encrypted with KMS</div>
                <div className="bg-gray-900 rounded p-2 font-mono text-xs text-yellow-400">
                  ************
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                paramType === "stringlist" ? "border-blue-500 bg-blue-900/30" : "border-blue-500/30 bg-blue-900/10"
              }`}>
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">📋</div>
                  <div className="font-semibold text-blue-400">StringList</div>
                </div>
                <div className="text-xs text-gray-300 text-center mb-3">Comma-separated values</div>
                <div className="bg-gray-900 rounded p-2 font-mono text-xs text-blue-400">
                  val1,val2,val3
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">Toggle above to explore different parameter types</div>
            <div className="mt-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
              <div className="font-semibold text-yellow-400 mb-2">SecureString Encryption</div>
              <div className="text-sm text-gray-300">
                SecureString parameters are encrypted using AWS KMS. You can use the default AWS-managed key or your own customer-managed key for additional control.
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Hierarchical Organization</h3>
            <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm mb-6">
              <div className="text-gray-500 mb-2">/myapp</div>
              <div className="ml-4 text-gray-500">├── /dev</div>
              <div className="ml-8 text-green-400 mb-1">│   ├── /db-url (String)</div>
              <div className="ml-8 text-yellow-400 mb-1">│   ├── /db-password (SecureString)</div>
              <div className="ml-8 text-blue-400 mb-2">│   └── /api-endpoints (StringList)</div>
              <div className="ml-4 text-gray-500">└── /prod</div>
              <div className="ml-8 text-green-400 mb-1">    ├── /db-url (String)</div>
              <div className="ml-8 text-yellow-400 mb-1">    ├── /db-password (SecureString)</div>
              <div className="ml-8 text-blue-400">    └── /api-endpoints (StringList)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">Benefits</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Organize by environment</li>
                  <li>✓ IAM policies by path</li>
                  <li>✓ GetParametersByPath API</li>
                </ul>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="font-semibold text-green-400 mb-2">Example Paths</div>
                <div className="text-xs text-gray-300 space-y-1 font-mono">
                  <div>/app/env/param</div>
                  <div>/team/project/config</div>
                  <div>/service/region/key</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Free Tier &amp; Pricing</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">🆓</div>
                  <div className="text-2xl font-bold text-green-400">Standard</div>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Storage:</span>
                    <span className="text-green-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parameters:</span>
                    <span className="text-green-400 font-semibold">Up to 10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Size:</span>
                    <span className="text-white">4 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span className="text-white">Standard</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">💎</div>
                  <div className="text-2xl font-bold text-blue-400">Advanced</div>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Storage:</span>
                    <span className="text-blue-400 font-semibold">$0.05/param/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parameters:</span>
                    <span className="text-blue-400 font-semibold">Up to 100,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Size:</span>
                    <span className="text-white">8 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span className="text-white">Higher limits</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
              <div className="font-semibold text-purple-400 mb-2">Comparison with Secrets Manager</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-400 font-semibold mb-1">✓ Parameter Store</div>
                  <div className="text-gray-300 text-xs">Free tier, hierarchical, no rotation</div>
                </div>
                <div>
                  <div className="text-red-400 font-semibold mb-1">✓ Secrets Manager</div>
                  <div className="text-gray-300 text-xs">Paid, auto-rotation, cross-region</div>
                </div>
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-yellow-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Key className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AWS KMS Keys</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Cryptographic keys for encryption at rest and in transit. KMS manages the keys while you control access through policies.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-yellow-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">Encryption</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-yellow-400 text-2xl mb-2">🔄</div>
                <div className="text-white font-semibold text-sm">Rotation</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-yellow-400 text-2xl mb-2">📜</div>
                <div className="text-white font-semibold text-sm">Policies</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">AWS Managed Keys</h3>
            <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">🔑</div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">AWS Managed</div>
                  <div className="text-gray-400 text-sm">Created and managed by AWS services</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Naming: </span>
                  <span className="text-white font-mono">aws/service-name</span>
                </div>
                <div>
                  <span className="text-gray-400">Control: </span>
                  <span className="text-white">AWS manages</span>
                </div>
                <div>
                  <span className="text-gray-400">Cost: </span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
                <div>
                  <span className="text-gray-400">Rotation: </span>
                  <span className="text-white">Automatic (3 years)</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="font-mono text-blue-400 text-xs mb-1">aws/s3</div>
                <div className="text-gray-400 text-xs">S3 encryption</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="font-mono text-blue-400 text-xs mb-1">aws/rds</div>
                <div className="text-gray-400 text-xs">RDS encryption</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="font-mono text-blue-400 text-xs mb-1">aws/ebs</div>
                <div className="text-gray-400 text-xs">EBS encryption</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Customer Managed Keys (CMK)</h3>
            <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">🗝️</div>
                <div>
                  <div className="text-2xl font-bold text-green-400">Customer Managed</div>
                  <div className="text-gray-400 text-sm">Full control over key policies and usage</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Naming: </span>
                  <span className="text-white">Your choice (alias)</span>
                </div>
                <div>
                  <span className="text-gray-400">Control: </span>
                  <span className="text-white">You manage</span>
                </div>
                <div>
                  <span className="text-gray-400">Cost: </span>
                  <span className="text-yellow-400 font-semibold">$1/month</span>
                </div>
                <div>
                  <span className="text-gray-400">Rotation: </span>
                  <span className="text-white">Optional (1 year)</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">Benefits</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Full key policy control</li>
                  <li>✓ Enable/disable keys</li>
                  <li>✓ Audit with CloudTrail</li>
                  <li>✓ Cross-account access</li>
                </ul>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="font-semibold text-purple-400 mb-2">Use Cases</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Regulatory requirements</li>
                  <li>• Multi-account setups</li>
                  <li>• Custom rotation schedules</li>
                  <li>• Granular access control</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Key Policies (Resource-based)</h3>
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">Example Key Policy:</div>
              <pre className="text-xs font-mono text-yellow-400 overflow-auto">
{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::123456789:role/MyRole"
    },
    "Action": [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:GenerateDataKey"
    ],
    "Resource": "*"
  }]
}`}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-4">
                <div className="font-semibold text-orange-400 mb-2">Key Policy Required</div>
                <div className="text-sm text-gray-300">
                  Every KMS key must have a key policy. It's the primary way to control access to the key.
                </div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">IAM Policy Optional</div>
                <div className="text-sm text-gray-300">
                  IAM policies can grant additional permissions if key policy allows it via principal.
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Grants - Temporary Delegation</h3>
            <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-6 mb-6">
              <div className="font-semibold text-purple-400 mb-3 text-lg">What are Grants?</div>
              <div className="text-gray-300 mb-4">
                Grants allow you to delegate key usage permissions temporarily without modifying the key policy. Perfect for service-to-service scenarios.
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <pre className="text-xs font-mono text-green-400">
{`aws kms create-grant \\
  --key-id 1234abcd-12ab-34cd-56ef-1234567890ab \\
  --grantee-principal arn:aws:iam::123456789:role/ServiceRole \\
  --operations Encrypt Decrypt GenerateDataKey`}
                </pre>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-yellow-400 text-2xl mb-2">⏱️</div>
                <div className="text-white font-semibold text-sm mb-1">Temporary</div>
                <div className="text-xs text-gray-400">Easy to revoke</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-blue-400 text-2xl mb-2">🔄</div>
                <div className="text-white font-semibold text-sm mb-1">Programmatic</div>
                <div className="text-xs text-gray-400">API-driven</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-green-400 text-2xl mb-2">🎯</div>
                <div className="text-white font-semibold text-sm mb-1">Specific Ops</div>
                <div className="text-xs text-gray-400">Granular control</div>
              </div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">KMS Encryption Operations</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              KMS provides encryption and decryption operations for data protection using cryptographic keys.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-purple-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">Direct Encryption</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-purple-400 text-2xl mb-2">📦</div>
                <div className="text-white font-semibold text-sm">Envelope Encryption</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-purple-400 text-2xl mb-2">🔑</div>
                <div className="text-white font-semibold text-sm">Data Keys</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Direct Encryption (up to 4KB)</h3>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-sm text-gray-400">Plaintext</div>
                <div className="text-xs text-gray-500">(≤ 4KB)</div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="bg-purple-600 rounded-lg p-6 text-center">
                <Key className="w-10 h-10 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">KMS Encrypt</div>
                <div className="text-xs text-purple-200 mt-1">API Call</div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="text-sm text-gray-400">Ciphertext</div>
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
              <div className="font-semibold text-yellow-400 mb-2">4KB Limit</div>
              <div className="text-sm text-gray-300">
                Direct encryption via KMS API is limited to 4KB. For larger data, use envelope encryption with data keys.
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Envelope Encryption (for large data)</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center gap-4">
                <div className="bg-purple-600 rounded-lg p-4 text-center">
                  <Key className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-xs text-white">KMS Key</div>
                </div>
                <div className="text-gray-500">→ GenerateDataKey →</div>
                <div className="bg-yellow-600 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">🔑</div>
                  <div className="text-xs text-white">Data Key</div>
                  <div className="text-xs text-yellow-200">(Plaintext)</div>
                </div>
                <div className="text-gray-500">→ Encrypt →</div>
                <div className="bg-green-600 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="text-xs text-white">Encrypted Data</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center text-sm text-gray-300">
                Encrypted data key is stored alongside encrypted data
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="font-semibold text-green-400 mb-2">Used By</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• S3 (SSE-KMS)</li>
                  <li>• EBS volumes</li>
                  <li>• RDS databases</li>
                  <li>• Large files</li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">Benefits</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• No size limit</li>
                  <li>• Better performance</li>
                  <li>• Decryption doesn't call KMS</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Data Keys (GenerateDataKey)</h3>
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">KMS API Call:</div>
              <pre className="text-xs font-mono text-green-400">
{`aws kms generate-data-key \\
  --key-id alias/my-key \\
  --key-spec AES_256`}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-6">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🔑</div>
                  <div className="font-semibold text-yellow-400 text-lg">Plaintext Data Key</div>
                </div>
                <div className="text-sm text-gray-300">
                  Use immediately to encrypt your data, then DELETE from memory
                </div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-6">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🔐</div>
                  <div className="font-semibold text-green-400 text-lg">Encrypted Data Key</div>
                </div>
                <div className="text-sm text-gray-300">
                  Store with encrypted data for future decryption
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
              <div className="font-semibold text-blue-400 mb-2">Decryption Process</div>
              <div className="text-sm text-gray-300">
                Call KMS Decrypt on the encrypted data key to get plaintext key → Use plaintext key to decrypt data
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Client-Side vs Server-Side Encryption</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">💻</div>
                  <div className="text-2xl font-bold text-blue-400">Client-Side</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-blue-300 mb-1">You encrypt</div>
                    <div className="text-gray-300">Data encrypted before sending to AWS</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-300 mb-1">Benefits</div>
                    <ul className="text-gray-300 space-y-1">
                      <li>✓ Full control</li>
                      <li>✓ End-to-end encryption</li>
                      <li>✓ AWS never sees plaintext</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-300 mb-1">Use Case</div>
                    <div className="text-gray-300">Highly sensitive data</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">☁️</div>
                  <div className="text-2xl font-bold text-green-400">Server-Side</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-green-300 mb-1">AWS encrypts</div>
                    <div className="text-gray-300">Data encrypted after AWS receives it</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-300 mb-1">Benefits</div>
                    <ul className="text-gray-300 space-y-1">
                      <li>✓ Easier to implement</li>
                      <li>✓ Better performance</li>
                      <li>✓ Automatic with S3, EBS, RDS</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-green-300 mb-1">Use Case</div>
                    <div className="text-gray-300">Most common scenario</div>
                  </div>
                </div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-cyan-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Users className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Cognito Lambda Triggers</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Customize authentication flows by invoking Lambda functions at key points in the user journey.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-cyan-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Pre-Triggers</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-cyan-400 text-2xl mb-2">✅</div>
                <div className="text-white font-semibold text-sm">Post-Triggers</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-cyan-400 text-2xl mb-2">🔧</div>
                <div className="text-white font-semibold text-sm">Customization</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Pre Sign-Up Trigger</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">New User</span>
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
                <div className="text-center">
                  <span className="text-2xl">λ</span>
                  <div className="text-xs text-cyan-400 mt-1">Pre Sign-Up</div>
                </div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Cognito</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">Use Cases</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Validate email domain</li>
                  <li>• Auto-confirm users</li>
                  <li>• Block disposable emails</li>
                  <li>• Custom attribute validation</li>
                </ul>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="font-semibold text-green-400 mb-2">Can Modify</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• autoConfirmUser</li>
                  <li>• autoVerifyEmail</li>
                  <li>• autoVerifyPhone</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Pre Authentication Trigger</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-xs text-gray-400">User Login</span>
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-cyan-900/30 border-2 border-cyan-500 rounded-lg p-4">
                <div className="text-center">
                  <span className="text-2xl">λ</span>
                  <div className="text-xs text-cyan-400 mt-1">Pre Auth</div>
                </div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-400">Cognito</span>
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-4">
              <div className="font-semibold text-yellow-400 mb-2">Custom Validation</div>
              <div className="text-sm text-gray-300">
                Invoked before authentication. Can deny login by throwing an error. Perfect for IP blocking, time-based access, or custom business rules.
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <pre className="text-xs font-mono text-red-400">
{`// Example: Block user
throw new Error("User is not allowed to sign in");`}
              </pre>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Post Confirmation Trigger</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
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
                  <div className="text-xs text-cyan-400 mt-1">Post Confirm</div>
                </div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-xs text-gray-400">Confirmed</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📧</div>
                <div className="font-semibold text-purple-400 text-sm mb-1">Welcome Email</div>
                <div className="text-xs text-gray-400">Send custom message</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🗄️</div>
                <div className="font-semibold text-blue-400 text-sm mb-1">Add to Database</div>
                <div className="text-xs text-gray-400">Create user record</div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold text-green-400 text-sm mb-1">Add to Group</div>
                <div className="text-xs text-gray-400">Assign permissions</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Custom Message Trigger</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
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
                  <div className="text-xs text-cyan-400 mt-1">Custom Message</div>
                </div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">📧</span>
                </div>
                <span className="text-xs text-gray-400">User</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                <div className="font-semibold text-blue-400 mb-2">Message Types</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Verification code</li>
                  <li>• Temporary password</li>
                  <li>• MFA code</li>
                  <li>• Forgot password</li>
                </ul>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="font-semibold text-green-400 mb-2">Customization</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Email subject</li>
                  <li>• Email body (HTML)</li>
                  <li>• SMS message</li>
                  <li>• Language localization</li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Example Response:</div>
              <pre className="text-xs font-mono text-green-400">
{`{
  emailSubject: "Welcome to MyApp!",
  emailMessage: "<h1>Hi {username}!</h1>..."
}`}
              </pre>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AWS Certificate Manager</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Provision, manage, and deploy SSL/TLS certificates for AWS services and internal resources.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-2xl mb-2">🆓</div>
                <div className="text-white font-semibold text-sm">Free Public Certs</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-2xl mb-2">🔄</div>
                <div className="text-white font-semibold text-sm">Auto-Renewal</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">Managed Service</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">ACM</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500">→ FREE Certs →</div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: "🌐", name: "CloudFront", free: true },
                  { icon: "⚖️", name: "ALB/NLB", free: true },
                  { icon: "🔌", name: "API Gateway", free: true }
                ].map((service, i) => (
                  <div key={i} className="bg-green-900/30 border border-green-600 rounded-lg px-4 py-2 flex items-center gap-3">
                    <span className="text-xl">{service.icon}</span>
                    <div className="text-white text-sm font-semibold">{service.name}</div>
                    <div className="text-xs text-green-400">FREE</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 text-center">
              <div className="text-blue-400 font-semibold mb-2">⚠️ Important</div>
              <p className="text-sm text-gray-300">Cannot export public certificates (use private CA for EC2)</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">DNS Validation Process</h3>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm text-white">Request Certificate</div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔤</div>
                <div className="text-sm text-blue-400 font-semibold">Add CNAME to DNS</div>
                <div className="text-xs text-gray-400 mt-1">Prove domain ownership</div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">✓</div>
                <div className="text-sm text-green-400">Validated</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-300 font-mono">
                _abc123.example.com CNAME _def456.acm-validations.aws
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Automatic Renewal</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-400 mb-3">✓ DNS Validation</div>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Automatic renewal</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> No action required</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Recommended method</li>
                </ul>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-400 mb-3">⚠️ Email Validation</div>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Manual renewal</li>
                  <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Email verification</li>
                  <li className="flex items-center gap-2"><span className="text-yellow-400">⚠</span> Legacy method</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              {[2023, 2024, 2025].map((year, i) => (
                <div key={year} className="text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-1 ${
                    i === 2 ? "bg-green-600" : "bg-gray-600"
                  }`}>
                    <Shield className={`w-6 h-6 ${i === 2 ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className={`text-xs ${i === 2 ? "text-green-400" : "text-gray-500"}`}>{year}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Regional Requirements</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-purple-900/30 border-2 border-purple-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🌐</span>
                  <div className="text-lg font-semibold text-purple-400">CloudFront</div>
                </div>
                <div className="bg-purple-800/50 rounded p-3 mb-2">
                  <div className="text-xs text-purple-300 font-semibold mb-1">Region Requirement</div>
                  <div className="text-sm text-white font-mono">us-east-1 ONLY</div>
                </div>
                <div className="text-xs text-gray-300">Global CDN requires N. Virginia certificate</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚖️</span>
                  <div className="text-lg font-semibold text-blue-400">ALB / API Gateway</div>
                </div>
                <div className="bg-blue-800/50 rounded p-3 mb-2">
                  <div className="text-xs text-blue-300 font-semibold mb-1">Region Requirement</div>
                  <div className="text-sm text-white font-mono">Same as resource</div>
                </div>
                <div className="text-xs text-gray-300">Certificate must be in same region</div>
              </div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-red-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AWS WAF</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Web Application Firewall to protect against common web exploits and layer 7 attacks.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-red-400 text-2xl mb-2">🛡️</div>
                <div className="text-white font-semibold text-sm">Block Attacks</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-red-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Real-time</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-red-400 text-2xl mb-2">📊</div>
                <div className="text-white font-semibold text-sm">Layer 7 Protection</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Web ACLs - Container for Rules</h3>
            </div>
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
                <div className="text-sm text-red-400 font-semibold">Web ACL</div>
                <div className="text-xs text-gray-400">Rules Container</div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="flex flex-col gap-2">
                <div className="w-20 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white">CloudFront</span>
                </div>
                <div className="w-20 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white">ALB</span>
                </div>
                <div className="w-20 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white">API Gateway</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300">Web ACL attaches to resources and contains rules for inspection</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Rules - Match Conditions &amp; Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { rule: "SQL Injection", action: "Block", color: "red" },
                { rule: "XSS Attack", action: "Block", color: "red" },
                { rule: "Geo Location (Block China)", action: "Block", color: "yellow" },
                { rule: "IP Whitelist (Allow VPN)", action: "Allow", color: "green" },
                { rule: "Request Size (Max 8KB)", action: "Block", color: "yellow" },
                { rule: "URI Path (/admin)", action: "Block", color: "red" }
              ].map((rule, i) => (
                <div key={i} className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                  rule.color === "red" ? "border-red-500" :
                  rule.color === "yellow" ? "border-yellow-500" : "border-green-500"
                }`}>
                  <div className="text-xs text-white font-semibold">{rule.rule}</div>
                  <div className={`text-xs mt-1 ${
                    rule.action === "Block" ? "text-red-400" : "text-green-400"
                  }`}>Action: {rule.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Managed Rules</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🏢</span>
                  <div className="text-sm font-semibold text-orange-400">AWS Managed Rules</div>
                </div>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li>• Core Rule Set (OWASP Top 10)</li>
                  <li>• Known Bad Inputs</li>
                  <li>• SQL Database protection</li>
                  <li>• Linux/Windows protections</li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🤖</span>
                  <div className="text-sm font-semibold text-blue-400">Specialized Rules</div>
                </div>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li>• Bot Control</li>
                  <li>• Account Takeover Prevention</li>
                  <li>• Marketplace Rules</li>
                  <li>• Industry-specific (WordPress)</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400">Pre-configured, regularly updated by AWS</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Rate Limiting</h3>
            </div>
            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-yellow-400">Rate-Based Rule</div>
                <div className="bg-yellow-600 text-white px-3 py-1 rounded text-xs">2000 req / 5 min</div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-12 h-16 rounded flex items-center justify-center ${
                    i <= 4 ? "bg-green-600" : "bg-red-600"
                  }`}>
                    <span className="text-white text-xs">{i * 500}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-red-400 text-sm font-semibold mb-1">IP Blocked for 10 minutes</div>
                <div className="text-xs text-gray-400">Exceeded threshold</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-sm text-white">IP 1.2.3.4</div>
                <div className="text-xs text-green-400">1500 req ✓</div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-sm text-white">IP 5.6.7.8</div>
                <div className="text-xs text-green-400">1800 req ✓</div>
              </div>
              <div className="bg-red-900/50 border border-red-600 rounded p-3 text-center">
                <div className="text-sm text-white">IP 9.9.9.9</div>
                <div className="text-xs text-red-400">2100 req 🚫</div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AWS Shield</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Managed DDoS protection service for AWS resources. Protects against network and transport layer attacks.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-blue-400 text-2xl mb-2">🛡️</div>
                <div className="text-white font-semibold text-sm">DDoS Protection</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-blue-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Always On</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-blue-400 text-2xl mb-2">📊</div>
                <div className="text-white font-semibold text-sm">Real-time Metrics</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Shield Standard - Free for All</h3>
            </div>
            <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-12 h-12 text-green-400" />
                <div>
                  <div className="text-xl font-semibold text-green-400">Shield Standard</div>
                  <div className="text-sm text-green-300">FREE - Always enabled</div>
                </div>
              </div>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> Layer 3/4 DDoS protection</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> Automatic detection &amp; mitigation</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> Always on for all customers</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> No cost, no configuration</li>
              </ul>
              <div className="mt-4 bg-gray-700 rounded p-3 text-center">
                <div className="text-xs text-gray-400">Protects CloudFront, Route 53, ALB, ELB, Global Accelerator</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Shield Advanced - Premium Protection</h3>
            </div>
            <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-12 h-12 text-blue-400" />
                  <div>
                    <div className="text-xl font-semibold text-blue-400">Shield Advanced</div>
                    <div className="text-sm text-blue-300">$3,000/month + 1-year commitment</div>
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> Layer 3/4/7 protection</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> Real-time attack notifications</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> DDoS Response Team (DRT) 24/7</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> Advanced metrics &amp; reporting</li>
                <li className="flex items-center gap-2"><span className="text-green-400 text-lg">✓</span> WAF included at no extra cost</li>
              </ul>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Cost Protection</h3>
            </div>
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-6 mb-4">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-purple-400">Shield Advanced Cost Protection</div>
                <div className="text-sm text-gray-400">Only available with Advanced tier</div>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">⚠️</div>
                  <div className="text-sm text-white mb-1">DDoS Attack</div>
                  <div className="text-xs text-red-400">Traffic spike</div>
                </div>
                <div className="text-gray-500">→</div>
                <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm text-white mb-1">Scaling Costs</div>
                  <div className="text-xs text-yellow-400">$1,000 extra</div>
                </div>
                <div className="text-gray-500">→</div>
                <div className="bg-green-900/50 border border-green-600 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="text-sm text-white mb-1">Reimbursed</div>
                  <div className="text-xs text-green-400">$0 impact</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-center text-sm text-gray-300">
                AWS reimburses scaling costs from DDoS-related traffic
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Integration with AWS Services</h3>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-blue-400 font-semibold text-center">AWS Shield</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🌐", name: "CloudFront", desc: "Edge protection" },
                { icon: "🌍", name: "Route 53", desc: "DNS protection" },
                { icon: "⚖️", name: "ALB/ELB", desc: "Load balancer" },
                { icon: "🚀", name: "Global Accelerator", desc: "Anycast IPs" },
                { icon: "🛡️", name: "AWS WAF", desc: "Layer 7 (Advanced)" },
                { icon: "🔌", name: "Elastic IP", desc: "EC2 instances" }
              ].map((service, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <div className="text-sm text-white font-semibold">{service.name}</div>
                    <div className="text-xs text-gray-400">{service.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Amazon GuardDuty</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Intelligent threat detection using machine learning and anomaly detection to protect your AWS accounts and workloads.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-orange-400 text-2xl mb-2">🤖</div>
                <div className="text-white font-semibold text-sm">ML-Powered</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-orange-400 text-2xl mb-2">👁️</div>
                <div className="text-white font-semibold text-sm">Continuous Monitoring</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-orange-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Auto Detection</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Data Sources Analyzed</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { name: "CloudTrail Events", icon: "📋", desc: "API calls" },
                { name: "VPC Flow Logs", icon: "🌊", desc: "Network traffic" },
                { name: "DNS Logs", icon: "🔤", desc: "DNS queries" },
                { name: "S3 Data Events", icon: "📦", desc: "Object access" }
              ].map((source, i) => (
                <div key={i} className="bg-orange-900/30 border border-orange-600 rounded-lg p-4 text-center">
                  <span className="text-3xl mb-2 block">{source.icon}</span>
                  <div className="text-sm text-white font-semibold">{source.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{source.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-gray-500">↓ Continuously analyzed ↓</div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
                <Shield className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                <div className="text-sm text-orange-400 font-semibold text-center">GuardDuty</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Finding Types</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: "Recon:EC2/PortProbeUnprotectedPort", severity: "Medium", category: "Reconnaissance" },
                { type: "UnauthorizedAccess:IAMUser/TorIPCaller", severity: "High", category: "Account Compromise" },
                { type: "CryptoCurrency:EC2/BitcoinTool.B!DNS", severity: "High", category: "Instance Compromise" },
                { type: "Discovery:S3/MaliciousIPCaller", severity: "High", category: "S3 Threat" },
                { type: "Backdoor:EC2/C&CActivity.B!DNS", severity: "High", category: "Instance Compromise" },
                { type: "Stealth:S3/ServerAccessLoggingDisabled", severity: "Low", category: "S3 Threat" }
              ].map((finding, i) => (
                <div key={i} className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                  finding.severity === "High" ? "border-red-500" :
                  finding.severity === "Medium" ? "border-yellow-500" : "border-blue-500"
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-gray-400">{finding.category}</div>
                    <div className={`text-xs font-semibold ${
                      finding.severity === "High" ? "text-red-400" :
                      finding.severity === "Medium" ? "text-yellow-400" : "text-blue-400"
                    }`}>{finding.severity}</div>
                  </div>
                  <div className="text-xs text-white">{finding.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Integration with EventBridge</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4 max-w-md w-full">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-lg font-semibold text-orange-400">GuardDuty Finding</div>
                    <div className="text-xs text-gray-400">UnauthorizedAccess detected</div>
                  </div>
                </div>
                <div className="bg-red-900/50 border border-red-600 rounded p-3">
                  <div className="text-xs text-white mb-1">Type: UnauthorizedAccess:IAMUser/TorIPCaller</div>
                  <div className="text-xs text-red-400">Severity: High</div>
                </div>
              </div>

              <div className="text-gray-500">↓ EventBridge Rule ↓</div>

              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                <div className="text-sm text-purple-400 text-center">Event Pattern Match</div>
              </div>

              <div className="text-gray-500">↓ Trigger Actions ↓</div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-600 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">λ</div>
                  <div className="text-xs text-white">Lambda</div>
                  <div className="text-xs text-gray-200">Auto-remediate</div>
                </div>
                <div className="bg-red-600 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">📧</div>
                  <div className="text-xs text-white">SNS</div>
                  <div className="text-xs text-gray-200">Alert team</div>
                </div>
                <div className="bg-blue-600 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">🛡️</div>
                  <div className="text-xs text-white">Security Hub</div>
                  <div className="text-xs text-gray-200">Aggregate</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Account Management</h3>
            </div>
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-6 mb-4">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-purple-400">AWS Organizations Integration</div>
                <div className="text-xs text-gray-400">Centralized management and delegation</div>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-purple-600 rounded-lg p-4 text-center">
                  <div className="text-xl mb-2">🏢</div>
                  <div className="text-sm text-white font-semibold">Management Account</div>
                  <div className="text-xs text-gray-300">Delegated Administrator</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-gray-500">↓ Monitors ↓</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Account 1", "Account 2", "Account 3"].map((account, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-white">{account}</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Shield className="w-4 h-4 text-orange-400" />
                      <div className="text-xs text-green-400">Protected</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">Auto-enable for new member accounts in organization</div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Amazon Macie</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              ML-powered service to discover, classify, and protect sensitive data in Amazon S3.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-pink-400 text-2xl mb-2">🤖</div>
                <div className="text-white font-semibold text-sm">ML-Powered</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-pink-400 text-2xl mb-2">🔍</div>
                <div className="text-white font-semibold text-sm">Auto Discovery</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-pink-400 text-2xl mb-2">📦</div>
                <div className="text-white font-semibold text-sm">S3-Only</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Automated Data Discovery</h3>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">📦</span>
                </div>
                <span className="text-sm text-gray-400">S3 Buckets</span>
                <div className="text-xs text-gray-500 mt-1">Millions of objects</div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="bg-pink-900/30 border-2 border-pink-500 rounded-lg p-4">
                <Shield className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                <div className="text-sm text-pink-400 font-semibold text-center">Macie Scan</div>
                <div className="text-xs text-gray-400 text-center mt-1">ML Analysis</div>
              </div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-yellow-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">📊</span>
                </div>
                <span className="text-sm text-gray-400">Findings</span>
                <div className="text-xs text-gray-500 mt-1">Sensitive data</div>
              </div>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-300">Automatically discovers PII, credentials, and financial data</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Sensitive Data Types Detected</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { type: "Credit Card Numbers", icon: "💳", count: 23, severity: "High" },
                { type: "Social Security Numbers", icon: "🔢", count: 156, severity: "High" },
                { type: "API Keys", icon: "🔑", count: 12, severity: "Critical" },
                { type: "Passwords", icon: "🔐", count: 8, severity: "Critical" },
                { type: "Driver's Licenses", icon: "🪪", count: 45, severity: "Medium" },
                { type: "Bank Account Numbers", icon: "🏦", count: 67, severity: "High" },
                { type: "Email Addresses", icon: "📧", count: 234, severity: "Low" },
                { type: "Custom Patterns", icon: "🎯", count: 19, severity: "Medium" }
              ].map((data, i) => (
                <div key={i} className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                  data.severity === "Critical" ? "border-purple-500" :
                  data.severity === "High" ? "border-red-500" :
                  data.severity === "Medium" ? "border-yellow-500" : "border-blue-500"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{data.icon}</span>
                      <div className="text-xs text-white font-semibold">{data.type}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className={`text-sm font-semibold ${
                      data.severity === "Critical" ? "text-purple-400" :
                      data.severity === "High" ? "text-red-400" :
                      data.severity === "Medium" ? "text-yellow-400" : "text-blue-400"
                    }`}>{data.count} found</div>
                    <div className="text-xs text-gray-400">{data.severity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Security Findings</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 mb-4">
              {[
                {
                  finding: "Policy:IAMUser/S3BlockPublicAccessDisabled",
                  bucket: "my-public-bucket",
                  severity: "High",
                  desc: "Bucket allows public access"
                },
                {
                  finding: "Policy:IAMUser/S3BucketEncryptionDisabled",
                  bucket: "unencrypted-data",
                  severity: "Medium",
                  desc: "Bucket encryption not enabled"
                },
                {
                  finding: "SensitiveData:S3Object/Credentials",
                  bucket: "app-backups",
                  severity: "Critical",
                  desc: "AWS credentials found in objects"
                },
                {
                  finding: "SensitiveData:S3Object/Financial",
                  bucket: "customer-data",
                  severity: "High",
                  desc: "Credit card data detected"
                }
              ].map((item, i) => (
                <div key={i} className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                  item.severity === "Critical" ? "border-purple-500" :
                  item.severity === "High" ? "border-red-500" : "border-yellow-500"
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-white font-mono">{item.finding}</div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.severity === "Critical" ? "bg-purple-900/50 text-purple-400" :
                      item.severity === "High" ? "bg-red-900/50 text-red-400" : "bg-yellow-900/50 text-yellow-400"
                    }`}>{item.severity}</div>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">Bucket: {item.bucket}</div>
                  <div className="text-xs text-gray-300">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">EventBridge Integration</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-pink-900/30 border-2 border-pink-500 rounded-lg p-4 max-w-md w-full">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-pink-400" />
                  <div>
                    <div className="text-lg font-semibold text-pink-400">Macie Finding</div>
                    <div className="text-xs text-gray-400">Sensitive data detected</div>
                  </div>
                </div>
                <div className="bg-red-900/50 border border-red-600 rounded p-3">
                  <div className="text-xs text-white mb-1">SensitiveData:S3Object/Credentials</div>
                  <div className="text-xs text-gray-400 mb-1">Bucket: customer-uploads</div>
                  <div className="text-xs text-red-400">Severity: Critical - AWS Keys Found</div>
                </div>
              </div>

              <div className="text-gray-500">↓ EventBridge ↓</div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-600 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">λ</div>
                  <div className="text-xs text-white">Lambda</div>
                  <div className="text-xs text-gray-200">Quarantine object</div>
                </div>
                <div className="bg-red-600 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">📧</div>
                  <div className="text-xs text-white">SNS</div>
                  <div className="text-xs text-gray-200">Alert security team</div>
                </div>
                <div className="bg-blue-600 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">📋</div>
                  <div className="text-xs text-white">Ticket</div>
                  <div className="text-xs text-gray-200">Create incident</div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/30 border border-green-600/50 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400">Automated remediation and compliance enforcement</div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Users className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Cognito Hosted UI</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Pre-built, customizable sign-in pages hosted by AWS Cognito. Zero code required for authentication UI.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-indigo-400 text-2xl mb-2">🎨</div>
                <div className="text-white font-semibold text-sm">Customizable</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-indigo-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Zero Code</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-indigo-400 text-2xl mb-2">🔐</div>
                <div className="text-white font-semibold text-sm">OAuth 2.0</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">UI Customization Options</h3>
            </div>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto mb-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xl">🏢</span>
                </div>
                <div className="text-gray-800 font-semibold">MyApp Login</div>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Email" className="w-full p-2 border border-gray-300 rounded text-sm" disabled />
                <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded text-sm" disabled />
                <button className="w-full bg-indigo-600 text-white py-2 rounded text-sm">Sign In</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3 text-center">
                <div className="text-purple-400 text-xl mb-1">🎨</div>
                <div className="text-xs text-white font-semibold">Custom Logo</div>
                <div className="text-xs text-gray-400">Upload image</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3 text-center">
                <div className="text-blue-400 text-xl mb-1">💅</div>
                <div className="text-xs text-white font-semibold">Custom CSS</div>
                <div className="text-xs text-gray-400">Brand colors</div>
              </div>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 text-center">
                <div className="text-green-400 text-xl mb-1">🌐</div>
                <div className="text-xs text-white font-semibold">Custom Domain</div>
                <div className="text-xs text-gray-400">auth.myapp.com</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">OAuth 2.0 Flows</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-green-400 text-xl">✓</div>
                  <div className="text-sm font-semibold text-green-400">Authorization Code Flow (Recommended)</div>
                </div>
                <div className="text-xs text-gray-300 mb-2">Most secure flow with PKCE for mobile/SPA apps</div>
                <div className="bg-gray-700 rounded p-2 text-xs text-gray-400 font-mono">
                  /oauth2/authorize → code → /oauth2/token → tokens
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-400 text-xl">⚠️</div>
                  <div className="text-sm font-semibold text-yellow-400">Implicit Flow (Legacy)</div>
                </div>
                <div className="text-xs text-gray-300 mb-2">Returns tokens directly, less secure</div>
                <div className="bg-gray-700 rounded p-2 text-xs text-gray-400 font-mono">
                  /oauth2/authorize → tokens in URL fragment
                </div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-blue-400 text-xl">🔧</div>
                  <div className="text-sm font-semibold text-blue-400">Client Credentials Flow</div>
                </div>
                <div className="text-xs text-gray-300 mb-2">Machine-to-machine authentication</div>
                <div className="bg-gray-700 rounded p-2 text-xs text-gray-400 font-mono">
                  /oauth2/token → access_token
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Social Identity Providers</h3>
            </div>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto mb-4">
              <div className="text-center mb-4">
                <div className="text-gray-800 font-semibold">Sign in to MyApp</div>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                  <span className="text-lg">f</span> Continue with Facebook
                </button>
                <button className="w-full bg-red-500 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                  <span className="text-lg">G</span> Continue with Google
                </button>
                <button className="w-full bg-orange-500 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                  <span className="text-lg">📦</span> Continue with Amazon
                </button>
                <button className="w-full bg-gray-800 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                  <span className="text-lg">🍎</span> Continue with Apple
                </button>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">Configured in User Pool identity providers settings</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise Federation (SAML/OIDC)</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-3xl">👤</span>
                </div>
                <span className="text-sm text-gray-400">Employee</span>
              </div>

              <div className="text-gray-500">↓</div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className="text-purple-400 text-2xl mb-2">🏢</div>
                    <div className="text-sm font-semibold text-purple-400">SAML 2.0</div>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Active Directory</li>
                    <li>• Okta</li>
                    <li>• OneLogin</li>
                    <li>• Azure AD</li>
                  </ul>
                </div>
                <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className="text-blue-400 text-2xl mb-2">🔐</div>
                    <div className="text-sm font-semibold text-blue-400">OIDC</div>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Google Workspace</li>
                    <li>• Auth0</li>
                    <li>• Keycloak</li>
                    <li>• Custom IdP</li>
                  </ul>
                </div>
              </div>

              <div className="text-gray-500">↓</div>

              <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
                <Users className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                <div className="text-sm text-indigo-400 font-semibold text-center">Cognito User Pool</div>
                <div className="text-xs text-gray-400 text-center mt-1">Federated authentication</div>
              </div>
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-teal-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Key className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Secrets Manager vs Parameter Store</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Both store configuration data, but with different capabilities and use cases. Choose the right tool for your needs.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">Secrets Manager</div>
                <div className="text-xs text-gray-400 mt-1">Rotation + Cross-Region</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <Key className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">Parameter Store</div>
                <div className="text-xs text-gray-400 mt-1">Free + Hierarchy</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Secrets Manager - For Rotating Credentials</h3>
            </div>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-6 max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-12 h-12 text-red-400" />
                <div>
                  <div className="text-xl font-semibold text-red-400">AWS Secrets Manager</div>
                  <div className="text-sm text-gray-400">Built for credentials that need rotation</div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">Automatic Rotation</div>
                  </div>
                  <div className="text-xs text-gray-300">Built-in rotation for RDS, Redshift, DocumentDB</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">Cross-Region Replication</div>
                  </div>
                  <div className="text-xs text-gray-300">Replicate secrets to multiple regions</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">Fine-grained Access Control</div>
                  </div>
                  <div className="text-xs text-gray-300">Resource-based policies per secret</div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3 text-center">
                <div className="text-xs text-yellow-300">💰 Cost: $0.40/secret/month + $0.05/10K API calls</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Parameter Store - For Configuration</h3>
            </div>
            <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-12 h-12 text-green-400" />
                <div>
                  <div className="text-xl font-semibold text-green-400">SSM Parameter Store</div>
                  <div className="text-sm text-gray-400">For general config and cost-sensitive use</div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">FREE (Standard Tier)</div>
                  </div>
                  <div className="text-xs text-gray-300">10,000 parameters, 4KB max size</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">Hierarchical Storage</div>
                  </div>
                  <div className="text-xs text-gray-300">/app/prod/db/password structure</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 text-lg">✗</span>
                    <div className="text-sm text-white font-semibold">No Auto Rotation</div>
                  </div>
                  <div className="text-xs text-gray-300">Manual rotation with Lambda required</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 text-lg">✗</span>
                    <div className="text-sm text-white font-semibold">No Cross-Region</div>
                  </div>
                  <div className="text-xs text-gray-300">Parameters are region-specific</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Cost Comparison</h3>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-6 h-6 text-red-400" />
                  <div className="text-lg font-semibold text-red-400">Secrets Manager</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-yellow-400 text-lg font-semibold mb-1">$0.40</div>
                    <div className="text-xs text-gray-300">per secret / month</div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-yellow-400 text-lg font-semibold mb-1">$0.05</div>
                    <div className="text-xs text-gray-300">per 10,000 API calls</div>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-900/30 rounded p-2">
                  <div className="text-xs text-yellow-300 text-center">100 secrets = $40/mo</div>
                </div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-6 h-6 text-green-400" />
                  <div className="text-lg font-semibold text-green-400">Parameter Store</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-green-400 text-lg font-semibold mb-1">FREE</div>
                    <div className="text-xs text-gray-300">Standard tier (10K params)</div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-blue-400 text-lg font-semibold mb-1">$0.05</div>
                    <div className="text-xs text-gray-300">Advanced tier / param / month</div>
                  </div>
                </div>
                <div className="mt-4 bg-green-900/30 rounded p-2">
                  <div className="text-xs text-green-300 text-center">100 params = $0 (standard)</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-300">Use Secrets Manager when rotation is needed, Parameter Store for cost savings</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Integration &amp; Usage</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div className="text-center mb-3">
                  <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-red-400">Secrets Manager</div>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="bg-gray-700 rounded p-2">GetSecretValue API</div>
                  <div className="bg-gray-700 rounded p-2">Lambda env variables</div>
                  <div className="bg-gray-700 rounded p-2">ECS task definitions</div>
                  <div className="bg-gray-700 rounded p-2">CloudFormation dynamic ref</div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div className="text-center mb-3">
                  <Key className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-green-400">Parameter Store</div>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="bg-gray-700 rounded p-2">GetParameter API</div>
                  <div className="bg-gray-700 rounded p-2">GetParametersByPath</div>
                  <div className="bg-gray-700 rounded p-2">Lambda env variables</div>
                  <div className="bg-gray-700 rounded p-2">CloudFormation dynamic ref</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                <div className="text-xs text-blue-400 font-semibold mb-2">Cross-reference</div>
                <div className="text-xs text-gray-300 font-mono">
                  {'{{'}resolve:secretsmanager:db-password{'}}'}
                </div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                <div className="text-xs text-blue-400 font-semibold mb-2">Parameter reference</div>
                <div className="text-xs text-gray-300 font-mono">
                  {'{{'}resolve:ssm:/app/config{'}}'}
                </div>
              </div>
            </div>
          </div>
        )}
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
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-amber-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Key className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">KMS Key Rotation</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Regularly rotate cryptographic material for security best practices while maintaining the same key ID.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-amber-400 text-2xl mb-2">🔄</div>
                <div className="text-white font-semibold text-sm">Auto Rotation</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-amber-400 text-2xl mb-2">🔑</div>
                <div className="text-white font-semibold text-sm">Same Key ID</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-amber-400 text-2xl mb-2">🔒</div>
                <div className="text-white font-semibold text-sm">Security</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Automatic Rotation</h3>
            </div>
            <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 max-w-lg mx-auto mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-green-400 text-3xl">🔄</div>
                <div>
                  <div className="text-xl font-semibold text-green-400">Automatic Key Rotation</div>
                  <div className="text-sm text-gray-400">For customer-managed keys (CMK)</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">Every 365 days (configurable)</div>
                  </div>
                  <div className="text-xs text-gray-300">Or custom rotation period (90-2560 days)</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">Same Key ID maintained</div>
                  </div>
                  <div className="text-xs text-gray-300">Transparent to applications</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-lg">✓</span>
                    <div className="text-sm text-white font-semibold">No re-encryption needed</div>
                  </div>
                  <div className="text-xs text-gray-300">Old material retained for decryption</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">Enable in KMS console or via CLI: update-key-rotation</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Key Material Retention</h3>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              {[2023, 2024, 2025].map((year, i) => (
                <div key={year} className="text-center">
                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 ${
                    i === 2 ? "bg-amber-600 border-2 border-amber-400" : "bg-gray-600"
                  }`}>
                    <Key className={`w-10 h-10 ${i === 2 ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="text-xs text-gray-400">Key Material {year}</div>
                  <div className={`text-sm font-semibold mt-1 ${i === 2 ? "text-amber-400" : "text-gray-500"}`}>
                    {i === 2 ? "Current (Encrypt)" : "Old (Decrypt only)"}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4 mb-4">
              <div className="text-center mb-3">
                <div className="text-lg font-semibold text-purple-400">Key ID: abc-123-def-456</div>
                <div className="text-sm text-gray-400">Same ID, different backing material</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded p-3 text-center">
                  <div className="text-green-400 text-sm font-semibold mb-1">Encryption</div>
                  <div className="text-xs text-gray-300">Uses 2025 material</div>
                </div>
                <div className="bg-gray-700 rounded p-3 text-center">
                  <div className="text-blue-400 text-sm font-semibold mb-1">Decryption</div>
                  <div className="text-xs text-gray-300">Uses matching material</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center text-sm text-gray-300">
              Old key material retained for decryption - no application changes needed
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Manual Rotation Process</h3>
            </div>
            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-yellow-400 text-3xl">⚙️</div>
                <div>
                  <div className="text-xl font-semibold text-yellow-400">Manual Rotation</div>
                  <div className="text-sm text-gray-400">Full control over rotation process</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
                  <div className="flex-1 bg-gray-700 rounded p-3">
                    <div className="text-sm text-white font-semibold">Create New Key</div>
                    <div className="text-xs text-gray-400">Generate new CMK with new key material</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
                  <div className="flex-1 bg-gray-700 rounded p-3">
                    <div className="text-sm text-white font-semibold">Update Alias</div>
                    <div className="text-xs text-gray-400">Point alias from old key to new key</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
                  <div className="flex-1 bg-gray-700 rounded p-3">
                    <div className="text-sm text-white font-semibold">Re-encrypt Data (Optional)</div>
                    <div className="text-xs text-gray-400">Decrypt with old, encrypt with new</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
                  <div className="flex-1 bg-gray-700 rounded p-3">
                    <div className="text-sm text-white font-semibold">Update Applications</div>
                    <div className="text-xs text-gray-400">If using key ID instead of alias</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-3 text-center">
              <div className="text-xs text-amber-300">💡 Tip: Use aliases to avoid updating app configs</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Imported Keys (BYOK)</h3>
            </div>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-red-400 text-3xl">⚠️</div>
                <div>
                  <div className="text-xl font-semibold text-red-400">Imported Key Material</div>
                  <div className="text-sm text-gray-400">Bring Your Own Key (BYOK)</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 text-lg">✗</span>
                    <div className="text-sm text-white font-semibold">No Automatic Rotation</div>
                  </div>
                  <div className="text-xs text-gray-300">AWS cannot rotate imported key material</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 text-lg">⚙️</span>
                    <div className="text-sm text-white font-semibold">Manual Rotation Required</div>
                  </div>
                  <div className="text-xs text-gray-300">Create new key, import material, update alias</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 text-lg">ℹ️</span>
                    <div className="text-sm text-white font-semibold">Key Expiration</div>
                  </div>
                  <div className="text-xs text-gray-300">Set expiration date when importing material</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-3">
                <div className="text-xs text-purple-400 font-semibold mb-2">AWS Managed Keys</div>
                <div className="text-xs text-gray-300">Auto-rotate every 1 year (cannot disable)</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                <div className="text-xs text-blue-400 font-semibold mb-2">Customer Managed</div>
                <div className="text-xs text-gray-300">Auto-rotate optional (enable recommended)</div>
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
