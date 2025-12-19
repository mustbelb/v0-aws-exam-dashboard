"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity, Bell, FileText, Calendar, Search, BarChart3, Server, Clock, TrendingUp, Zap, Users } from "lucide-react"

// 1. Metrics and Dimensions Explainer (Rich)
export function MetricsDimensionsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState("CPUUtilization")
  const [resolution, setResolution] = useState<"standard" | "high">("standard")

  const steps = [
    { title: "CloudWatch Metrics", description: "Time-ordered data points representing resource utilization and performance" },
    { title: "Namespaces", description: "Containers for metrics - AWS/EC2, AWS/Lambda, custom namespaces" },
    { title: "Dimensions", description: "Name-value pairs that identify a metric (e.g., InstanceId, FunctionName)" },
    { title: "Resolution", description: "Standard (1 min) vs High Resolution (1 sec) - affects cost and granularity" },
    { title: "Retention", description: "1-min data: 15 days, 5-min: 63 days, 1-hour: 455 days" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const metrics = [
    { name: "CPUUtilization", namespace: "AWS/EC2", unit: "Percent" },
    { name: "NetworkIn", namespace: "AWS/EC2", unit: "Bytes" },
    { name: "Invocations", namespace: "AWS/Lambda", unit: "Count" },
    { name: "Duration", namespace: "AWS/Lambda", unit: "Milliseconds" }
  ]

  const generateDataPoints = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${i}:00`,
      value: 30 + Math.random() * 40 + (selectedMetric === "CPUUtilization" ? Math.sin(i / 2) * 20 : 0)
    }))
  }

  const dataPoints = generateDataPoints()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Metrics &amp; Dimensions</h2>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {metrics.map(metric => (
          <button
            key={metric.name}
            onClick={() => setSelectedMetric(metric.name)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              selectedMetric === metric.name
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {metric.name}
          </button>
        ))}
      </div>

      {/* Resolution Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setResolution("standard")}
          className={`px-3 py-1 rounded-lg text-sm ${
            resolution === "standard" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Standard (1 min)
        </button>
        <button
          onClick={() => setResolution("high")}
          className={`px-3 py-1 rounded-lg text-sm ${
            resolution === "high" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          High Resolution (1 sec)
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: CloudWatch Metrics - Show basic metric graph */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Time-Series Metric Data</h3>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">{selectedMetric}</span>
                <span className="text-xs text-gray-500">{metrics.find(m => m.name === selectedMetric)?.namespace}</span>
              </div>
              <div className="h-32 flex items-end gap-1">
                {dataPoints.map((point, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${point.value}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{point.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-3 text-sm text-blue-200">
              Metrics are time-ordered data points showing resource performance over time
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Namespaces - Highlight namespaces */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Metric Namespaces</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="text-lg font-bold text-purple-300 mb-2">AWS/EC2</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• CPUUtilization</div>
                  <div>• NetworkIn/Out</div>
                  <div>• DiskReadOps</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="text-lg font-bold text-purple-300 mb-2">AWS/Lambda</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• Invocations</div>
                  <div>• Duration</div>
                  <div>• Errors</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                <div className="text-lg font-bold text-purple-300 mb-2">AWS/RDS</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• DatabaseConnections</div>
                  <div>• ReadLatency</div>
                  <div>• WriteLatency</div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="text-lg font-bold text-green-300 mb-2">Custom/MyApp</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• OrdersProcessed</div>
                  <div>• CacheHitRate</div>
                  <div>• UserSessions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Dimensions - Highlight dimensions */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Metric Dimensions</h3>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-green-300 mb-3">Dimensions Identify Metrics Uniquely</div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-green-900/30 border border-green-600/50 px-3 py-2 rounded-lg text-sm">
                  <span className="text-gray-400">InstanceId: </span>
                  <span className="text-white font-semibold">i-abc123def</span>
                </div>
                <div className="bg-green-900/30 border border-green-600/50 px-3 py-2 rounded-lg text-sm">
                  <span className="text-gray-400">AutoScalingGroupName: </span>
                  <span className="text-white font-semibold">my-asg</span>
                </div>
                <div className="bg-green-900/30 border border-green-600/50 px-3 py-2 rounded-lg text-sm">
                  <span className="text-gray-400">ImageId: </span>
                  <span className="text-white font-semibold">ami-xyz789</span>
                </div>
                <div className="bg-green-900/30 border border-green-600/50 px-3 py-2 rounded-lg text-sm">
                  <span className="text-gray-400">InstanceType: </span>
                  <span className="text-white font-semibold">t3.medium</span>
                </div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200">
              Each dimension is a name-value pair that helps identify a specific metric stream
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Resolution - Highlight resolution differences */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Metric Resolution</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${
                resolution === "standard"
                  ? "bg-green-900/30 border-2 border-green-600"
                  : "bg-gray-700"
              }`}>
                <div className="text-lg font-bold text-green-300 mb-2">Standard Resolution</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>⏱️ 1 minute intervals</div>
                  <div>💰 No additional cost</div>
                  <div>📊 Default for AWS metrics</div>
                  <div>✅ Sufficient for most use cases</div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                resolution === "high"
                  ? "bg-purple-900/30 border-2 border-purple-600"
                  : "bg-gray-700"
              }`}>
                <div className="text-lg font-bold text-purple-300 mb-2">High Resolution</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>⚡ 1 second intervals</div>
                  <div>💵 Additional cost applies</div>
                  <div>📈 For custom metrics only</div>
                  <div>🎯 Real-time monitoring needs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Retention - Show retention periods */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Data Retention Periods</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-yellow-300">1-minute data points</div>
                    <div className="text-sm text-gray-300">High resolution metrics</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">15 days</div>
                </div>
              </div>
              <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-orange-300">5-minute data points</div>
                    <div className="text-sm text-gray-300">Aggregated from 1-minute</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">63 days</div>
                </div>
              </div>
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-red-300">1-hour data points</div>
                    <div className="text-sm text-gray-300">Long-term aggregation</div>
                  </div>
                  <div className="text-2xl font-bold text-red-400">455 days</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-sm text-yellow-200 mt-4">
              Automatic aggregation and retention - older data automatically aggregates to lower resolution
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
          <li>• Standard resolution: 1 minute (free), High resolution: 1 second (cost)</li>
          <li>• Dimensions uniquely identify metrics within a namespace</li>
          <li>• Custom metrics use PutMetricData API</li>
          <li>• Retention: 15 days (1-min), 63 days (5-min), 455 days (1-hour)</li>
        </ul>
      </div>
    </div>
  )
}

// 2. CloudWatch Alarms Explainer (Rich)
export function CloudWatchAlarmsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [threshold, setThreshold] = useState(70)
  const [currentValue, setCurrentValue] = useState(45)

  const steps = [
    { title: "CloudWatch Alarms", description: "Monitor metrics and trigger actions when thresholds are breached" },
    { title: "Alarm States", description: "OK, ALARM, INSUFFICIENT_DATA - transitions trigger actions" },
    { title: "Evaluation Periods", description: "Number of data points that must breach threshold" },
    { title: "Actions", description: "SNS notifications, Auto Scaling, EC2 actions, Lambda triggers" },
    { title: "Composite Alarms", description: "Combine multiple alarms with AND/OR logic" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const alarmState = currentValue >= threshold ? "ALARM" : "OK"

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Alarms</h2>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current CPU: {currentValue}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentValue}
            onChange={(e) => setCurrentValue(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Threshold: {threshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: CloudWatch Alarms - Basic alarm concept */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-red-400 mb-2">Alarm Monitoring</h3>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className={`text-4xl font-bold px-8 py-4 rounded-xl ${
                alarmState === "ALARM"
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-green-600 text-white"
              }`}>
                {alarmState}
              </div>
            </div>
            <div className="relative h-32 bg-gray-700 rounded-lg p-4 mb-4">
              <div
                className="absolute w-full border-t-2 border-dashed border-red-500"
                style={{ bottom: `${threshold}%` }}
              >
                <span className="absolute -top-5 right-0 text-xs text-red-400">
                  Threshold: {threshold}%
                </span>
              </div>
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 rounded-t transition-all ${
                  alarmState === "ALARM" ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ height: `${currentValue}%` }}
              />
              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                {currentValue}%
              </span>
            </div>
            <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-3 text-sm text-red-200">
              Alarms watch metrics and trigger actions when thresholds are breached
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Alarm States - Show all three states */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Three Alarm States</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-bold text-white bg-green-600 px-4 py-2 rounded">OK</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-green-300">OK State</div>
                    <div className="text-sm text-gray-300">Metric is within acceptable threshold</div>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/30 border-2 border-red-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-bold text-white bg-red-600 px-4 py-2 rounded animate-pulse">ALARM</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-red-300">ALARM State</div>
                    <div className="text-sm text-gray-300">Metric breached threshold - triggers actions</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 border-2 border-gray-500 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-bold text-white bg-gray-600 px-4 py-2 rounded">INSUFFICIENT_DATA</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-300">Insufficient Data</div>
                    <div className="text-sm text-gray-300">Not enough data to evaluate alarm state</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Evaluation Periods - Show how evaluation works */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Evaluation Periods</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-3">
                  <span className="font-semibold text-yellow-400">Example:</span> 3 out of 5 data points must breach threshold
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 bg-red-500 rounded flex items-center justify-center text-white font-bold">85</div>
                    <div className="text-xs text-red-400 mt-1">Breach</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 bg-green-500 rounded flex items-center justify-center text-white font-bold">65</div>
                    <div className="text-xs text-green-400 mt-1">OK</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 bg-red-500 rounded flex items-center justify-center text-white font-bold">90</div>
                    <div className="text-xs text-red-400 mt-1">Breach</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 bg-red-500 rounded flex items-center justify-center text-white font-bold">88</div>
                    <div className="text-xs text-red-400 mt-1">Breach</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 bg-green-500 rounded flex items-center justify-center text-white font-bold">60</div>
                    <div className="text-xs text-green-400 mt-1">OK</div>
                  </div>
                </div>
                <div className="text-center mt-3 text-sm">
                  <span className="text-gray-400">Threshold: 70% | </span>
                  <span className="text-red-400 font-semibold">3 breaches detected → ALARM triggered!</span>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-sm text-yellow-200">
                Prevents false alarms from momentary spikes by requiring multiple breaches
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Actions - Show alarm actions */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Alarm Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg text-center ${
                alarmState === "ALARM" ? "bg-red-900/30 border-2 border-red-600" : "bg-gray-700 border border-gray-600"
              }`}>
                <div className="text-3xl mb-2">📧</div>
                <div className="text-sm font-semibold text-gray-300">SNS Notification</div>
                <div className="text-xs text-gray-400 mt-1">Email, SMS, HTTP/S</div>
                {alarmState === "ALARM" && <div className="text-xs text-red-400 mt-2 font-semibold">Sending now...</div>}
              </div>
              <div className={`p-4 rounded-lg text-center ${
                alarmState === "ALARM" ? "bg-orange-900/30 border-2 border-orange-600" : "bg-gray-700 border border-gray-600"
              }`}>
                <div className="text-3xl mb-2">📈</div>
                <div className="text-sm font-semibold text-gray-300">Auto Scaling</div>
                <div className="text-xs text-gray-400 mt-1">Scale out/in instances</div>
                {alarmState === "ALARM" && <div className="text-xs text-orange-400 mt-2 font-semibold">Scaling out...</div>}
              </div>
              <div className={`p-4 rounded-lg text-center ${
                alarmState === "ALARM" ? "bg-purple-900/30 border-2 border-purple-600" : "bg-gray-700 border border-gray-600"
              }`}>
                <div className="text-3xl mb-2">🖥️</div>
                <div className="text-sm font-semibold text-gray-300">EC2 Action</div>
                <div className="text-xs text-gray-400 mt-1">Stop, terminate, reboot</div>
                {alarmState === "ALARM" && <div className="text-xs text-purple-400 mt-2 font-semibold">Executing...</div>}
              </div>
              <div className={`p-4 rounded-lg text-center ${
                alarmState === "ALARM" ? "bg-blue-900/30 border-2 border-blue-600" : "bg-gray-700 border border-gray-600"
              }`}>
                <div className="text-3xl mb-2">λ</div>
                <div className="text-sm font-semibold text-gray-300">Lambda Function</div>
                <div className="text-xs text-gray-400 mt-1">Custom remediation</div>
                {alarmState === "ALARM" && <div className="text-xs text-blue-400 mt-2 font-semibold">Invoking...</div>}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Composite Alarms - Show composite alarm logic */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">Composite Alarms</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-300 mb-3">Combine multiple alarms with Boolean logic</div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">CPU Alarm</div>
                    <div className="text-lg font-bold text-red-400">ALARM</div>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">AND</div>
                  <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Memory Alarm</div>
                    <div className="text-lg font-bold text-red-400">ALARM</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">=</div>
                  <div className="bg-red-600 rounded-lg p-3 text-center animate-pulse">
                    <div className="text-xs text-white mb-1">Composite</div>
                    <div className="text-lg font-bold text-white">ALARM</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Disk Alarm</div>
                    <div className="text-lg font-bold text-red-400">ALARM</div>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">OR</div>
                  <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Network Alarm</div>
                    <div className="text-lg font-bold text-green-400">OK</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">=</div>
                  <div className="bg-red-600 rounded-lg p-3 text-center animate-pulse">
                    <div className="text-xs text-white mb-1">Composite</div>
                    <div className="text-lg font-bold text-white">ALARM</div>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-900/30 border border-cyan-600/30 rounded-lg p-3 text-sm text-cyan-200">
                Reduces alarm noise by creating higher-level alarms from multiple metrics
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
          <li>• Three states: OK, ALARM, INSUFFICIENT_DATA</li>
          <li>• Actions: SNS, Auto Scaling, EC2 actions, EventBridge</li>
          <li>• Composite alarms combine multiple alarms with AND/OR</li>
          <li>• Alarms are per-region and cannot cross regions</li>
        </ul>
      </div>
    </div>
  )
}

// 3. CloudWatch Logs and Insights Explainer (Medium)
export function LogsInsightsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showInsights, setShowInsights] = useState(false)

  const steps = [
    { title: "CloudWatch Logs", description: "Collect, monitor, and analyze log data from AWS resources" },
    { title: "Log Structure", description: "Log Groups → Log Streams → Log Events" },
    { title: "Retention", description: "Configure retention from 1 day to 10 years (or never expire)" },
    { title: "Insights Queries", description: "SQL-like query language to analyze logs at scale" },
    { title: "Metric Filters", description: "Extract metric data from logs using patterns" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const sampleLogs = [
    { timestamp: "12:00:01", level: "INFO", message: "Request received: GET /api/users" },
    { timestamp: "12:00:02", level: "DEBUG", message: "Querying database..." },
    { timestamp: "12:00:03", level: "INFO", message: "Response sent: 200 OK" },
    { timestamp: "12:00:15", level: "ERROR", message: "Connection timeout to database" },
    { timestamp: "12:00:16", level: "WARN", message: "Retrying connection..." }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Logs &amp; Insights</h2>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowInsights(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            !showInsights ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Log Events
        </button>
        <button
          onClick={() => setShowInsights(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showInsights ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Insights Query
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: CloudWatch Logs - Basic log viewing */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">CloudWatch Logs</h3>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span className="bg-gray-600 px-2 py-1 rounded">Log Group: /aws/lambda/my-function</span>
                <span>→</span>
                <span className="bg-gray-600 px-2 py-1 rounded">Log Stream: 2024/01/15/[$LATEST]abc123</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-2 max-h-64 overflow-auto">
              {sampleLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gray-500">{log.timestamp}</span>
                  <span className={`px-2 rounded text-xs ${
                    log.level === "ERROR" ? "bg-red-600 text-white" :
                    log.level === "WARN" ? "bg-yellow-600 text-white" :
                    log.level === "DEBUG" ? "bg-gray-600 text-white" :
                    "bg-blue-600 text-white"
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200 mt-4">
              Centralized logging for all AWS resources and applications
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Log Structure - Hierarchy visualization */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Log Hierarchy</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-4">
                <div className="text-lg font-bold text-blue-300 mb-2">Log Groups</div>
                <div className="text-sm text-gray-300 mb-2">Container for log streams (e.g., /aws/lambda/my-function)</div>
                <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-400">
                  /aws/lambda/my-function
                </div>
              </div>
              <div className="flex justify-center">
                <div className="text-2xl text-blue-400">↓</div>
              </div>
              <div className="bg-purple-900/30 border-2 border-purple-600 rounded-lg p-4">
                <div className="text-lg font-bold text-purple-300 mb-2">Log Streams</div>
                <div className="text-sm text-gray-300 mb-2">Sequence of log events from same source</div>
                <div className="space-y-1">
                  <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-400">
                    2024/01/15/[$LATEST]abc123
                  </div>
                  <div className="bg-gray-700 rounded p-2 font-mono text-xs text-gray-400">
                    2024/01/15/[$LATEST]def456
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="text-2xl text-purple-400">↓</div>
              </div>
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
                <div className="text-lg font-bold text-green-300 mb-2">Log Events</div>
                <div className="text-sm text-gray-300 mb-2">Individual timestamped log entries</div>
                <div className="bg-gray-900 rounded p-2 font-mono text-xs">
                  <div className="text-gray-500">12:00:01 INFO Request received</div>
                  <div className="text-gray-500">12:00:02 DEBUG Processing...</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Retention - Show retention policies */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Log Retention Policies</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-300 mb-3">Configure retention per Log Group</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-900/30 border border-green-600/50 rounded p-2 text-center">
                    <div className="text-lg font-bold text-green-400">1 day</div>
                    <div className="text-xs text-gray-400">Minimum</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-600/50 rounded p-2 text-center">
                    <div className="text-lg font-bold text-blue-400">30 days</div>
                    <div className="text-xs text-gray-400">Common</div>
                  </div>
                  <div className="bg-purple-900/30 border border-purple-600/50 rounded p-2 text-center">
                    <div className="text-lg font-bold text-purple-400">1 year</div>
                    <div className="text-xs text-gray-400">Long-term</div>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-600/50 rounded p-2 text-center">
                    <div className="text-lg font-bold text-orange-400">10 years</div>
                    <div className="text-xs text-gray-400">Maximum</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-600/50 rounded p-2 text-center col-span-2">
                    <div className="text-lg font-bold text-red-400">Never expire</div>
                    <div className="text-xs text-gray-400">Infinite retention (costs apply)</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-sm text-yellow-200">
                Retention is set at the Log Group level - all streams inherit the policy
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Insights Queries - Show query capabilities */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">CloudWatch Logs Insights</h3>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Query Language (SQL-like)</div>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-purple-400">
                <div>fields @timestamp, @message</div>
                <div>| filter @message like /ERROR/</div>
                <div>| stats count() by bin(5m)</div>
                <div>| sort @timestamp desc</div>
                <div>| limit 20</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Query Results</div>
              <div className="bg-gray-900 rounded p-3 font-mono text-sm space-y-2">
                <div>
                  <span className="text-gray-500">12:00:15</span>
                  <span className="text-red-400 ml-2">ERROR: Connection timeout to database</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">1 error found in the last 5 minutes</div>
              </div>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-3 text-sm text-purple-200 mt-4">
              Powerful query engine for analyzing logs at scale with SQL-like syntax
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Metric Filters - Show metric extraction */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Metric Filters</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-orange-300 mb-2">Extract metrics from log patterns</div>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-400 mb-3">
                  Pattern: [level = ERROR]
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-gray-800 rounded p-3 flex-1">
                    <div className="text-xs text-gray-500 mb-2">Log Events</div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="text-blue-400">INFO: Request OK</div>
                      <div className="text-red-400 bg-red-900/30 p-1 rounded">ERROR: Timeout</div>
                      <div className="text-blue-400">INFO: Success</div>
                      <div className="text-red-400 bg-red-900/30 p-1 rounded">ERROR: Failed</div>
                    </div>
                  </div>
                  <div className="text-2xl text-orange-400">→</div>
                  <div className="bg-orange-900/30 border border-orange-600 rounded p-3 flex-1">
                    <div className="text-xs text-gray-400 mb-2">CloudWatch Metric</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">2</div>
                      <div className="text-xs text-gray-400">Error Count</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200">
                Transform log data into CloudWatch metrics for alarming and graphing
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
          <li>• Log Groups contain Log Streams, which contain Log Events</li>
          <li>• Insights uses a SQL-like query language</li>
          <li>• Metric Filters extract custom metrics from log patterns</li>
          <li>• Export to S3 for long-term storage (async, not real-time)</li>
        </ul>
      </div>
    </div>
  )
}

// 4. EventBridge Explainer (Rich)
export function EventBridgeExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [eventSource, setEventSource] = useState<"aws" | "custom" | "saas">("aws")

  const steps = [
    { title: "EventBridge Overview", description: "Serverless event bus for building event-driven architectures" },
    { title: "Event Sources", description: "AWS services, custom applications, SaaS integrations" },
    { title: "Event Rules", description: "Filter events using patterns and route to targets" },
    { title: "Targets", description: "Lambda, Step Functions, SQS, SNS, API Gateway, and more" },
    { title: "Scheduling", description: "Create scheduled events with cron or rate expressions" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const eventSources = {
    aws: { name: "AWS Events", icon: "☁️", example: "EC2 state change, S3 object created" },
    custom: { name: "Custom Events", icon: "📝", example: "PutEvents API from your app" },
    saas: { name: "SaaS Partners", icon: "🔗", example: "Auth0, Datadog, Zendesk" }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">EventBridge</h2>
      </div>

      {/* Event Source Selector */}
      <div className="flex gap-2 mb-6">
        {Object.entries(eventSources).map(([key, source]) => (
          <button
            key={key}
            onClick={() => setEventSource(key as typeof eventSource)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              eventSource === key
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {source.icon} {source.name}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: EventBridge Overview - Show complete flow */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Event-Driven Architecture</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">{eventSources[eventSource].icon}</span>
                </div>
                <span className="text-sm text-gray-400">Event Source</span>
                <div className="text-xs text-gray-500 mt-1 max-w-[120px]">
                  {eventSources[eventSource].example}
                </div>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="text-center">
                <div className="w-24 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <Calendar className="w-8 h-8 text-white" />
                  <span className="text-xs text-white mt-1">Event Bus</span>
                </div>
                <span className="text-sm text-gray-400">EventBridge</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2">
                  <span className="text-2xl">📋</span>
                  <span className="text-xs text-white mt-1">Rule</span>
                </div>
                <span className="text-sm text-gray-400">Pattern Match</span>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                  <span>λ</span>
                  <span className="text-sm text-gray-300">Lambda</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                  <span>📨</span>
                  <span className="text-sm text-gray-300">SQS</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200 mt-4">
              Serverless event bus connecting application components through events
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Event Sources - Highlight sources */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Event Sources</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg text-center ${
                eventSource === "aws"
                  ? "bg-blue-900/30 border-2 border-blue-600"
                  : "bg-gray-700"
              }`}>
                <div className="text-4xl mb-2">☁️</div>
                <div className="text-lg font-semibold text-blue-300">AWS Services</div>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <div>• EC2 state changes</div>
                  <div>• S3 events</div>
                  <div>• CloudWatch alarms</div>
                  <div>• CodePipeline events</div>
                </div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                eventSource === "custom"
                  ? "bg-green-900/30 border-2 border-green-600"
                  : "bg-gray-700"
              }`}>
                <div className="text-4xl mb-2">📝</div>
                <div className="text-lg font-semibold text-green-300">Custom Apps</div>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <div>• PutEvents API</div>
                  <div>• Your applications</div>
                  <div>• Microservices</div>
                  <div>• Custom events</div>
                </div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                eventSource === "saas"
                  ? "bg-purple-900/30 border-2 border-purple-600"
                  : "bg-gray-700"
              }`}>
                <div className="text-4xl mb-2">🔗</div>
                <div className="text-lg font-semibold text-purple-300">SaaS Partners</div>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <div>• Auth0</div>
                  <div>• Datadog</div>
                  <div>• Zendesk</div>
                  <div>• PagerDuty</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Event Rules - Show pattern matching */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Event Pattern Rules</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-purple-300 mb-2">Pattern Matching Example</div>
                <pre className="text-xs font-mono text-purple-400 overflow-auto bg-gray-900 rounded p-3">
{`{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change"],
  "detail": {
    "state": ["stopped", "terminated"]
  }
}`}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/30 border border-green-600 rounded-lg p-3">
                  <div className="text-sm font-semibold text-green-300 mb-2">✓ Matches</div>
                  <div className="text-xs text-gray-300 font-mono bg-gray-900 rounded p-2">
                    source: aws.ec2<br/>
                    state: stopped
                  </div>
                </div>
                <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
                  <div className="text-sm font-semibold text-red-300 mb-2">✗ No Match</div>
                  <div className="text-xs text-gray-300 font-mono bg-gray-900 rounded p-2">
                    source: aws.ec2<br/>
                    state: running
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Targets - Show available targets */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Event Targets</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">λ</div>
                <div className="text-sm font-semibold text-gray-300">Lambda</div>
                <div className="text-xs text-gray-400">Invoke function</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📨</div>
                <div className="text-sm font-semibold text-gray-300">SQS Queue</div>
                <div className="text-xs text-gray-400">Send message</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📬</div>
                <div className="text-sm font-semibold text-gray-300">SNS Topic</div>
                <div className="text-xs text-gray-400">Publish message</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🔄</div>
                <div className="text-sm font-semibold text-gray-300">Step Functions</div>
                <div className="text-xs text-gray-400">Start execution</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🌐</div>
                <div className="text-sm font-semibold text-gray-300">API Gateway</div>
                <div className="text-xs text-gray-400">HTTP endpoint</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm font-semibold text-gray-300">Kinesis</div>
                <div className="text-xs text-gray-400">Stream data</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-sm font-semibold text-gray-300">ECS Task</div>
                <div className="text-xs text-gray-400">Run container</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🔧</div>
                <div className="text-sm font-semibold text-gray-300">Systems Manager</div>
                <div className="text-xs text-gray-400">Run command</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-sm font-semibold text-gray-300">CloudWatch Logs</div>
                <div className="text-xs text-gray-400">Log group</div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200 mt-4">
              Each rule can trigger up to 5 targets simultaneously
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Scheduling - Show cron/rate expressions */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Scheduled Events</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-300 mb-3">Rate Expressions</div>
                <div className="space-y-2">
                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-yellow-400">
                    rate(5 minutes) - Every 5 minutes
                  </div>
                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-yellow-400">
                    rate(1 hour) - Every hour
                  </div>
                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-yellow-400">
                    rate(1 day) - Every day
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-orange-300 mb-3">Cron Expressions</div>
                <div className="space-y-2">
                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-orange-400">
                    cron(0 12 * * ? *) - Every day at 12:00 PM UTC
                  </div>
                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-orange-400">
                    cron(0 18 ? * MON-FRI *) - Weekdays at 6:00 PM UTC
                  </div>
                  <div className="bg-gray-900 rounded p-2 font-mono text-xs text-orange-400">
                    cron(0/15 * * * ? *) - Every 15 minutes
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-sm text-yellow-200">
                Schedule rules for automated tasks without needing external schedulers
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
          <li>• EventBridge is the evolution of CloudWatch Events</li>
          <li>• Event patterns filter events by source, type, and detail</li>
          <li>• Supports scheduled rules (cron/rate expressions)</li>
          <li>• Archive and replay events for debugging/recovery</li>
        </ul>
      </div>
    </div>
  )
}

// 5. X-Ray Integration Explainer (Medium)
export function XRayIntegrationExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTrace, setShowTrace] = useState(false)

  const steps = [
    { title: "AWS X-Ray", description: "Distributed tracing to analyze and debug production applications" },
    { title: "Segments &amp; Subsegments", description: "Segments represent services, subsegments represent calls" },
    { title: "Service Map", description: "Visual representation of your application architecture" },
    { title: "Annotations &amp; Metadata", description: "Add custom data to traces for filtering and analysis" },
    { title: "Sampling", description: "Control how many requests are traced to manage costs" }
  ]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  const traceData = [
    { service: "API Gateway", duration: 5, status: "ok" },
    { service: "Lambda", duration: 150, status: "ok" },
    { service: "DynamoDB", duration: 45, status: "ok" },
    { service: "External API", duration: 200, status: "error" }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">X-Ray Tracing</h2>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowTrace(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            !showTrace ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Service Map
        </button>
        <button
          onClick={() => setShowTrace(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showTrace ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Trace Timeline
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: AWS X-Ray - Basic tracing concept */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">Distributed Tracing</h3>
            </div>
            <div className="space-y-3">
              {traceData.map((segment, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-gray-400">{segment.service}</div>
                  <div className="flex-1 h-8 bg-gray-700 rounded relative">
                    <div
                      className={`h-full rounded transition-all ${
                        segment.status === "error" ? "bg-red-500 animate-pulse" : "bg-cyan-500"
                      }`}
                      style={{ width: `${(segment.duration / 400) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-gray-300">
                      {segment.duration}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-cyan-900/30 border border-cyan-600/30 rounded-lg p-3 text-sm text-cyan-200">
              X-Ray traces requests as they travel through your distributed application
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Segments &amp; Subsegments */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Segments &amp; Subsegments</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-900/30 border-2 border-purple-600 rounded-lg p-4">
                <div className="text-lg font-bold text-purple-300 mb-3">Segment: Lambda Function</div>
                <div className="bg-gray-700 rounded p-3 space-y-2 ml-4">
                  <div className="bg-blue-900/30 border border-blue-600 rounded p-2">
                    <div className="text-sm font-semibold text-blue-300">Subsegment: DynamoDB Query</div>
                    <div className="text-xs text-gray-400 mt-1">45ms</div>
                  </div>
                  <div className="bg-green-900/30 border border-green-600 rounded p-2">
                    <div className="text-sm font-semibold text-green-300">Subsegment: S3 GetObject</div>
                    <div className="text-xs text-gray-400 mt-1">20ms</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-600 rounded p-2">
                    <div className="text-sm font-semibold text-red-300">Subsegment: External API Call</div>
                    <div className="text-xs text-gray-400 mt-1">200ms (error)</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-3 text-sm text-purple-200">
                Segments represent services, subsegments represent operations within services
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Service Map */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Service Map</h3>
            </div>
            <div className="flex items-center justify-around mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                  <span>🌐</span>
                </div>
                <span className="text-xs text-gray-400">API Gateway</span>
                <div className="text-xs text-green-400 mt-1">5ms</div>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-2 rounded" />
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-2">
                  <span>λ</span>
                </div>
                <span className="text-xs text-gray-400">Lambda</span>
                <div className="text-xs text-green-400 mt-1">150ms</div>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-2 rounded" />
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <span>📊</span>
                </div>
                <span className="text-xs text-gray-400">DynamoDB</span>
                <div className="text-xs text-green-400 mt-1">45ms</div>
              </div>
              <div className="flex-1 h-1 bg-red-500 mx-2 rounded animate-pulse" />
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2 ring-2 ring-red-400">
                  <span>🔗</span>
                </div>
                <span className="text-xs text-red-400">External API</span>
                <div className="text-xs text-red-400 mt-1">200ms ✗</div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200">
              Visual representation shows service dependencies and health - red indicates issues
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Annotations &amp; Metadata */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Annotations &amp; Metadata</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-lg font-bold text-yellow-300 mb-2">Annotations</div>
                <div className="text-sm text-gray-300 mb-3">Indexed for filtering &amp; search</div>
                <div className="bg-gray-900 rounded p-3 space-y-2 font-mono text-xs">
                  <div className="text-yellow-400">user_id: "12345"</div>
                  <div className="text-yellow-400">order_type: "premium"</div>
                  <div className="text-yellow-400">region: "us-west-2"</div>
                </div>
                <div className="text-xs text-gray-400 mt-2">✓ Can filter traces by these</div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-4">
                <div className="text-lg font-bold text-blue-300 mb-2">Metadata</div>
                <div className="text-sm text-gray-300 mb-3">Not indexed, for context</div>
                <div className="bg-gray-900 rounded p-3 space-y-2 font-mono text-xs">
                  <div className="text-blue-400">cart_items: {...}</div>
                  <div className="text-blue-400">user_agent: "..."</div>
                  <div className="text-blue-400">request_body: {...}</div>
                </div>
                <div className="text-xs text-gray-400 mt-2">✗ Cannot filter, view only</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Sampling */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Sampling Rules</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-orange-300 mb-3">Default Sampling</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">1</div>
                    <div className="text-xs text-gray-400">per second</div>
                  </div>
                  <div className="text-2xl text-gray-500">+</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">5%</div>
                    <div className="text-xs text-gray-400">additional</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-300 mb-3">Custom Sampling Example</div>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs space-y-2">
                  <div className="text-green-400">Priority: 100</div>
                  <div className="text-green-400">Rate: 0.1 (10%)</div>
                  <div className="text-green-400">Service: my-api</div>
                  <div className="text-green-400">URL: */checkout/*</div>
                </div>
              </div>
              <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200">
                Sampling controls cost by tracing a subset of requests while maintaining visibility
              </div>
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
          <li>• X-Ray SDK instruments your code to create trace data</li>
          <li>• Annotations are indexed for filtering, metadata is not</li>
          <li>• Sampling rules control trace collection rate</li>
          <li>• Lambda has built-in X-Ray support (enable in config)</li>
        </ul>
      </div>
    </div>
  )
}

// 6. CloudWatch Dashboards Explainer
export function CloudWatchDashboardsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "CloudWatch Dashboards", description: "Create custom visualizations of metrics and logs" },
    { title: "Widget Types", description: "Line charts, stacked areas, numbers, text, logs, alarms" },
    { title: "Cross-Account", description: "View metrics from multiple AWS accounts in one dashboard" },
    { title: "Cross-Region", description: "Aggregate metrics from multiple regions" },
    { title: "Automatic Dashboards", description: "AWS provides automatic dashboards for many services" }
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
        <BarChart3 className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Dashboards</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: CloudWatch Dashboards - Basic dashboard layout */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Custom Dashboard</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 col-span-2">
                <div className="text-xs text-gray-400 mb-2">CPU Utilization</div>
                <div className="h-20 flex items-end gap-1">
                  {[40, 55, 65, 45, 70, 80, 60, 75, 85, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Requests</div>
                <div className="text-3xl font-bold text-green-400">12.5K</div>
                <div className="text-xs text-gray-400">per minute</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Alarms</div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-green-600 rounded text-xs">OK: 5</span>
                  <span className="px-2 py-1 bg-red-600 rounded text-xs">ALARM: 1</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 col-span-2">
                <div className="text-xs text-gray-400 mb-2">Log Events</div>
                <div className="font-mono text-xs text-green-400 space-y-1">
                  <div>2024-01-15 10:23:45 INFO Request processed</div>
                  <div>2024-01-15 10:23:46 ERROR Connection timeout</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-3 text-sm text-blue-200 mt-4">
              Create custom visualizations combining multiple widgets in one view
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Widget Types - Show different widget types */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Widget Types</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                <div className="text-xs font-semibold text-purple-300 mb-2">Line Chart</div>
                <div className="h-16 flex items-end gap-1">
                  {[40, 55, 65, 45, 70, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-purple-500 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                <div className="text-xs font-semibold text-purple-300 mb-2">Stacked Area</div>
                <div className="h-16 flex items-end gap-1">
                  {[60, 70, 65, 75, 80, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div className="bg-purple-600" style={{ height: `${h * 0.6}%` }} />
                      <div className="bg-purple-400" style={{ height: `${h * 0.4}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                <div className="text-xs font-semibold text-purple-300 mb-2">Number</div>
                <div className="text-3xl font-bold text-purple-400">98.7%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                <div className="text-xs font-semibold text-purple-300 mb-2">Alarm Widget</div>
                <div className="space-y-1">
                  <div className="bg-green-600 rounded px-2 py-1 text-xs">API Gateway OK</div>
                  <div className="bg-red-600 rounded px-2 py-1 text-xs">Lambda ALARM</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3 col-span-2">
                <div className="text-xs font-semibold text-purple-300 mb-2">Logs Widget</div>
                <div className="font-mono text-xs text-purple-400 space-y-1">
                  <div>ERROR: Connection failed</div>
                  <div>WARN: Retry attempt 1</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Cross-Account - Show multi-account visualization */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Cross-Account Dashboards</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-300 mb-2">Production Account (123456789012)</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">EC2 Instances</div>
                    <div className="text-lg font-bold text-green-400">15</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Lambda Invocations</div>
                    <div className="text-lg font-bold text-green-400">2.5M</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Alarms</div>
                    <div className="text-lg font-bold text-green-400">OK</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-900/30 border-2 border-blue-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-blue-300 mb-2">Development Account (987654321098)</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">EC2 Instances</div>
                    <div className="text-lg font-bold text-blue-400">8</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Lambda Invocations</div>
                    <div className="text-lg font-bold text-blue-400">500K</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Alarms</div>
                    <div className="text-lg font-bold text-blue-400">OK</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200">
                Monitor metrics from multiple AWS accounts in a single dashboard
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Cross-Region - Show multi-region visualization */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Cross-Region Dashboards</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-300 mb-2">🌎 us-east-1 (Virginia)</div>
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">EC2 Instances</div>
                    <div className="text-lg font-bold text-yellow-400">25 running</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">CPU Average</div>
                    <div className="text-lg font-bold text-yellow-400">45%</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-300 mb-2">🌏 eu-west-1 (Ireland)</div>
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">EC2 Instances</div>
                    <div className="text-lg font-bold text-yellow-400">18 running</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">CPU Average</div>
                    <div className="text-lg font-bold text-yellow-400">52%</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-300 mb-2">🌏 ap-southeast-1 (Singapore)</div>
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">EC2 Instances</div>
                    <div className="text-lg font-bold text-yellow-400">12 running</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">CPU Average</div>
                    <div className="text-lg font-bold text-yellow-400">38%</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-yellow-300 mb-2">📊 Global Aggregate</div>
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">Total Instances</div>
                    <div className="text-lg font-bold text-yellow-400">55 running</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-400">Avg CPU Global</div>
                    <div className="text-lg font-bold text-yellow-400">45%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Automatic Dashboards - Show service-specific dashboards */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Automatic Dashboards</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-3">
                <div className="text-sm font-semibold text-orange-300 mb-2">AWS automatically creates dashboards for:</div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-2xl mb-1">🖥️</div>
                    <div className="text-xs text-gray-300">EC2</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-2xl mb-1">λ</div>
                    <div className="text-xs text-gray-300">Lambda</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-2xl mb-1">🗄️</div>
                    <div className="text-xs text-gray-300">RDS</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-2xl mb-1">⚖️</div>
                    <div className="text-xs text-gray-300">ELB</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-2xl mb-1">🪣</div>
                    <div className="text-xs text-gray-300">S3</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <div className="text-2xl mb-1">🌐</div>
                    <div className="text-xs text-gray-300">API Gateway</div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200">
                No configuration needed - AWS provides pre-built dashboards for common services
              </div>
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

      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Up to 3 dashboards free, then $3/dashboard/month</li>
          <li>• Cross-account and cross-region supported</li>
          <li>• Automatic dashboards for AWS services</li>
          <li>• Share dashboards publicly or with specific accounts</li>
        </ul>
      </div>
    </div>
  )
}

// 7. CloudWatch Agent Explainer
export function CloudWatchAgentExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "CloudWatch Agent", description: "Collect system-level metrics and custom application logs" },
    { title: "Installation", description: "Install via SSM, CLI, or manual download on EC2/on-premises" },
    { title: "Configuration", description: "JSON config file specifies metrics and logs to collect" },
    { title: "Custom Metrics", description: "Memory, disk, CPU per-process - not available by default" },
    { title: "Unified Agent", description: "Single agent for both metrics and logs collection" }
  ]

  const metrics = [
    { name: "Memory", default: false, agent: true },
    { name: "Disk", default: false, agent: true },
    { name: "Network", default: true, agent: true },
    { name: "CPU", default: true, agent: true },
    { name: "Processes", default: false, agent: true }
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
        <Server className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Agent</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: CloudWatch Agent - Overview */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Unified CloudWatch Agent</h3>
            </div>
            <div className="flex items-center justify-around mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">🖥️</span>
                </div>
                <div className="text-sm text-gray-400">EC2 / On-Premises</div>
              </div>
              <div className="text-2xl text-orange-400">→</div>
              <div className="text-center">
                <div className="w-24 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <Server className="w-10 h-10 text-white" />
                </div>
                <div className="text-sm text-gray-400">CW Agent</div>
              </div>
              <div className="text-2xl text-orange-400">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">☁️</span>
                </div>
                <div className="text-sm text-gray-400">CloudWatch</div>
              </div>
            </div>
            <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200">
              Collect system-level metrics and application logs from EC2 and on-premises servers
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Installation - Methods */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Installation Methods</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div className="text-lg font-bold text-green-300 mb-2">SSM</div>
                <div className="text-sm text-gray-300 mb-2">Systems Manager</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Automated install</div>
                  <div>• Parameter Store</div>
                  <div>• Fleet management</div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div className="text-lg font-bold text-green-300 mb-2">CLI</div>
                <div className="text-sm text-gray-300 mb-2">Command Line</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• wget/curl download</div>
                  <div>• Manual install</div>
                  <div>• Script automation</div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div className="text-lg font-bold text-green-300 mb-2">Package</div>
                <div className="text-sm text-gray-300 mb-2">Direct Download</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• .rpm/.deb files</div>
                  <div>• Windows MSI</div>
                  <div>• On-premises</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Configuration - JSON config */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Agent Configuration</h3>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 mb-3">
              <div className="text-sm text-gray-400 mb-2">config.json</div>
              <pre className="text-xs font-mono text-purple-400 overflow-auto">
{`{
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "mem": { "measurement": ["mem_used_percent"] },
      "disk": { "measurement": ["used_percent"] }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          { "file_path": "/var/log/app.log" }
        ]
      }
    }
  }
}`}
              </pre>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-3 text-sm text-purple-200">
              JSON configuration specifies which metrics and logs to collect
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Custom Metrics - Availability comparison */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Metric Availability</h3>
            </div>
            <div className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white font-semibold">{m.name}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-3 py-1 rounded ${m.default ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                      {m.default ? "✓ Default EC2 Metrics" : "✗ Requires Agent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-3 text-sm text-blue-200 mt-4">
              Memory and Disk metrics require the CloudWatch Agent - not available by default
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Unified Agent - Single solution */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Unified Agent</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-lg font-bold text-yellow-300 mb-3">Metrics Collection</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>• System-level metrics</div>
                  <div>• Memory, Disk, Network</div>
                  <div>• Per-process metrics</div>
                  <div>• Custom namespaces</div>
                </div>
              </div>
              <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                <div className="text-lg font-bold text-yellow-300 mb-3">Logs Collection</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>• Application logs</div>
                  <div>• System logs</div>
                  <div>• Custom log files</div>
                  <div>• Windows Event logs</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-sm text-yellow-200 mt-4">
              Single agent handles both metrics and logs - replaces legacy separate agents
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
          <li>• Memory and disk metrics REQUIRE CloudWatch agent</li>
          <li>• Unified agent replaces older logs and monitoring agents</li>
          <li>• SSM Parameter Store stores agent configuration</li>
          <li>• Works on EC2 and on-premises servers</li>
        </ul>
      </div>
    </div>
  )
}

// 8. CloudWatch Logs Retention Explainer
export function CloudWatchLogsRetentionExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [retention, setRetention] = useState(30)

  const steps = [
    { title: "Log Retention", description: "Control how long logs are stored in CloudWatch Logs" },
    { title: "Retention Options", description: "1 day to 10 years, or never expire" },
    { title: "Cost Impact", description: "Longer retention = higher storage costs" },
    { title: "Export Options", description: "Export to S3 for long-term archival at lower cost" },
    { title: "Default Behavior", description: "Logs never expire unless retention is set" }
  ]

  const retentionOptions = [1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653]

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Logs Retention</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            {/* Step 0: Log Retention - Basic concept */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Log Retention Management</h3>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-3">Select Retention Period</div>
              <select
                value={retention}
                onChange={(e) => setRetention(parseInt(e.target.value))}
                className="bg-gray-700 text-white rounded-lg p-2 w-full border-2 border-purple-600"
              >
                <option value={0}>Never Expire</option>
                {retentionOptions.map(d => (
                  <option key={d} value={d}>{d} days {d >= 365 ? `(${Math.floor(d/365)} year${d >= 730 ? 's' : ''})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-3 text-sm text-purple-200">
              Control how long CloudWatch Logs stores your log data
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Step 1: Retention Options - Show all available periods */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Retention Options</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">1 day</div>
                <div className="text-xs text-gray-400">Minimum</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">7 days</div>
                <div className="text-xs text-gray-400">1 week</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">30 days</div>
                <div className="text-xs text-gray-400">1 month</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">90 days</div>
                <div className="text-xs text-gray-400">3 months</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">180 days</div>
                <div className="text-xs text-gray-400">6 months</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">365 days</div>
                <div className="text-xs text-gray-400">1 year</div>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-300">3653 days</div>
                <div className="text-xs text-gray-400">10 years</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded p-2 text-center">
                <div className="text-sm font-bold text-purple-300">Never</div>
                <div className="text-xs text-gray-400">Infinite</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Cost Impact - Show cost comparison */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Cost Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                <div>
                  <div className="text-white font-semibold">Current Selection: {retention === 0 ? 'Never Expire' : `${retention} days`}</div>
                  <div className="text-xs text-gray-400">Based on 10GB/month ingestion</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-400">${retention === 0 ? '∞' : (0.03 * retention * 0.1).toFixed(2)}</div>
                  <div className="text-xs text-gray-400">storage/month</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-900/30 border border-green-600 rounded p-3 text-center">
                  <div className="text-sm text-green-300">7 days</div>
                  <div className="text-lg font-bold text-green-400">$0.21/mo</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-600 rounded p-3 text-center">
                  <div className="text-sm text-orange-300">30 days</div>
                  <div className="text-lg font-bold text-orange-400">$0.90/mo</div>
                </div>
                <div className="bg-red-900/30 border border-red-600 rounded p-3 text-center">
                  <div className="text-sm text-red-300">Never</div>
                  <div className="text-lg font-bold text-red-400">Growing</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {/* Step 3: Export Options - S3 archival */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Export to S3</h3>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">📝</span>
                </div>
                <div className="text-sm text-gray-400">CloudWatch Logs</div>
                <div className="text-xs text-gray-500">$0.03/GB storage</div>
              </div>
              <div className="text-2xl text-green-400">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-3xl">🪣</span>
                </div>
                <div className="text-sm text-gray-400">S3 Glacier</div>
                <div className="text-xs text-gray-500">$0.004/GB storage</div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
              <div className="text-sm font-semibold text-green-300 mb-2">Cost Savings</div>
              <div className="text-xs text-gray-300">
                For long-term archival, export logs to S3 Glacier for 7.5x lower storage costs
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Default Behavior - Never expire by default */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Default Retention Behavior</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-900/30 border-2 border-orange-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">⚠️</span>
                  <div className="text-lg font-bold text-orange-300">Logs Never Expire by Default</div>
                </div>
                <div className="text-sm text-gray-300">
                  Unless you set a retention policy, logs are kept indefinitely and costs continue to grow
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-3">Best Practice:</div>
                <div className="text-xs text-gray-400 space-y-2">
                  <div>✓ Set retention policies on all log groups</div>
                  <div>✓ Use 7-30 days for debugging logs</div>
                  <div>✓ Export to S3 for compliance/audit logs</div>
                  <div>✓ Review retention quarterly to optimize costs</div>
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
          <li>• Default: logs never expire (can get expensive!)</li>
          <li>• Set retention to control storage costs</li>
          <li>• Export to S3 for cheaper long-term storage</li>
          <li>• Subscription filters can stream to Kinesis/Lambda</li>
        </ul>
      </div>
    </div>
  )
}

// 9. CloudWatch Composite Alarms Explainer
export function CloudWatchCompositeAlarmsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [alarm1, setAlarm1] = useState(true)
  const [alarm2, setAlarm2] = useState(true)

  const steps = [
    { title: "Composite Alarms", description: "Combine multiple alarms using AND/OR logic" },
    { title: "Reduce Noise", description: "Only trigger when multiple conditions are met" },
    { title: "Rule Expressions", description: "Use AND, OR, NOT operators between alarms" },
    { title: "Use Cases", description: "Alert only when CPU high AND memory high" },
    { title: "Cost Savings", description: "Reduce unnecessary notifications and actions" }
  ]

  const compositeState = alarm1 && alarm2 ? "ALARM" : "OK"

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3000)
      return () => clearTimeout(timer)
    } else if (step >= steps.length - 1) setIsPlaying(false)
  }, [isPlaying, step, steps.length])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Composite Alarms</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 1 || step === 2 || step === 3) && (
          <div>
            {/* Steps 0-3: Show interactive composite alarm */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                {step === 0 && "Composite Alarm Logic"}
                {step === 1 && "Reduce False Alarms"}
                {step === 2 && "Boolean Expressions"}
                {step === 3 && "Use Case Example"}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button onClick={() => setAlarm1(!alarm1)} className={`p-4 rounded-lg border-2 transition-all ${alarm1 ? "border-red-500 bg-red-900/20" : "border-green-500 bg-green-900/20"}`}>
                <div className="text-white font-semibold">CPU Alarm</div>
                <div className={`text-sm ${alarm1 ? "text-red-400" : "text-green-400"}`}>{alarm1 ? "ALARM" : "OK"}</div>
                <div className="text-xs text-gray-500 mt-1">Click to toggle</div>
              </button>
              <div className="flex items-center justify-center text-2xl font-bold text-cyan-400">AND</div>
              <button onClick={() => setAlarm2(!alarm2)} className={`p-4 rounded-lg border-2 transition-all ${alarm2 ? "border-red-500 bg-red-900/20" : "border-green-500 bg-green-900/20"}`}>
                <div className="text-white font-semibold">Memory Alarm</div>
                <div className={`text-sm ${alarm2 ? "text-red-400" : "text-green-400"}`}>{alarm2 ? "ALARM" : "OK"}</div>
                <div className="text-xs text-gray-500 mt-1">Click to toggle</div>
              </button>
            </div>
            <div className="text-center text-3xl text-gray-400 mb-4">↓</div>
            <div className={`p-6 rounded-lg border-2 text-center transition-all ${compositeState === "ALARM" ? "border-red-500 bg-red-900/30 animate-pulse" : "border-green-500 bg-green-900/30"}`}>
              <div className="text-white font-bold text-xl mb-2">Composite Alarm</div>
              <div className={`text-3xl font-bold ${compositeState === "ALARM" ? "text-red-400" : "text-green-400"}`}>{compositeState}</div>
              <div className="text-sm text-gray-400 mt-2">
                {compositeState === "ALARM" ? "Both conditions met - Action triggered!" : "Not all conditions met - No action"}
              </div>
            </div>
            {step === 2 && (
              <div className="bg-cyan-900/30 border border-cyan-600/30 rounded-lg p-3 text-sm text-cyan-200 mt-4">
                Expression: ALARM("CPUAlarm") AND ALARM("MemoryAlarm") OR NOT ALARM("HealthCheckAlarm")
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            {/* Step 4: Cost Savings - Benefits */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Cost Savings Benefits</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div className="text-lg font-bold text-red-300 mb-2">❌ Without Composite</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>• Every metric triggers separately</div>
                  <div>• Notification flood</div>
                  <div>• Unnecessary scaling events</div>
                  <div>• High SNS/Lambda costs</div>
                  <div>• Alert fatigue</div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div className="text-lg font-bold text-green-300 mb-2">✓ With Composite</div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>• Trigger only when needed</div>
                  <div>• Single notification</div>
                  <div>• Prevent false positives</div>
                  <div>• Reduced action costs</div>
                  <div>• Meaningful alerts</div>
                </div>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200 mt-4">
              Composite alarms reduce noise and costs by combining conditions - only alert when it truly matters
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
          <li>• Combine metric alarms with AND, OR, NOT</li>
          <li>• Reduce alarm noise with multiple conditions</li>
          <li>• Can suppress actions during maintenance</li>
          <li>• Composite alarms can reference other composites</li>
        </ul>
      </div>
    </div>
  )
}

// 10. CloudWatch Metric Math Explainer
export function CloudWatchMetricMathExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Metric Math", description: "Perform calculations on CloudWatch metrics" },
    { title: "Math Expressions", description: "SUM, AVG, MIN, MAX, RATE, and more" },
    { title: "Cross-Metric", description: "Combine metrics from different sources" },
    { title: "Search Expression", description: "Aggregate metrics matching a pattern" },
    { title: "Use in Alarms", description: "Create alarms on calculated values" }
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
        <Activity className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Metric Math</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {step === 0 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-green-400 mb-2">Metric Math Overview</h3></div>
            <div className="bg-gray-700 rounded-lg p-4 mb-3">
              <div className="text-sm text-gray-400 mb-2">Example: Error Rate Calculation</div>
              <div className="font-mono text-sm text-green-400 mb-1">m1: Errors = 50</div>
              <div className="font-mono text-sm text-green-400 mb-1">m2: Requests = 1000</div>
              <div className="font-mono text-lg text-yellow-400 mt-2">e1: (m1 / m2) * 100 = 5%</div>
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200">
              Perform mathematical operations on metrics to derive new insights
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-blue-400 mb-2">Math Functions</h3></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300 mb-1">SUM(m1)</div><div className="text-xs text-gray-400">Add all values</div></div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300 mb-1">AVG(m1)</div><div className="text-xs text-gray-400">Calculate average</div></div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300 mb-1">MIN(m1)</div><div className="text-xs text-gray-400">Find minimum</div></div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300 mb-1">MAX(m1)</div><div className="text-xs text-gray-400">Find maximum</div></div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300 mb-1">RATE(m1)</div><div className="text-xs text-gray-400">Rate of change</div></div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300 mb-1">IF(m1>10,1,0)</div><div className="text-xs text-gray-400">Conditional</div></div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-purple-400 mb-2">Cross-Metric Calculations</h3></div>
            <div className="space-y-3">
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-purple-300 mb-2">Combine Different Metrics</div>
                <div className="font-mono text-xs text-purple-400 space-y-1">
                  <div>m1: AWS/Lambda Invocations</div>
                  <div>m2: AWS/Lambda Errors</div>
                  <div className="text-yellow-400 mt-2">e1: (m2 / m1) * 100 = Error %</div>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                <div className="text-sm font-semibold text-purple-300 mb-2">Across Namespaces</div>
                <div className="font-mono text-xs text-purple-400 space-y-1">
                  <div>m1: AWS/EC2 CPUUtilization</div>
                  <div>m2: CWAgent MemoryUtilization</div>
                  <div className="text-yellow-400 mt-2">e1: (m1 + m2) / 2 = Avg Load</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-yellow-400 mb-2">SEARCH Expressions</h3></div>
            <div className="bg-gray-700 rounded-lg p-4 mb-3">
              <div className="text-sm text-gray-400 mb-2">Find &amp; Aggregate Metrics</div>
              <div className="font-mono text-sm text-yellow-400 mb-3">SEARCH(' CPUUtilization ', 'Average', 300)</div>
              <div className="text-xs text-gray-400">Finds all CPUUtilization metrics across all instances</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">With Aggregation</div>
              <div className="font-mono text-sm text-yellow-400 mb-3">SUM(SEARCH(' NetworkIn ', 'Sum', 300))</div>
              <div className="text-xs text-gray-400">Total network traffic across all resources</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-orange-400 mb-2">Alarms on Math</h3></div>
            <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-4 mb-3">
              <div className="text-sm font-semibold text-orange-300 mb-3">Create Alarms on Calculated Values</div>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-400">Expression</div>
                  <div className="font-mono text-sm text-orange-400">(Errors / Requests) * 100</div>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-400">Alarm Threshold</div>
                  <div className="text-lg font-bold text-red-400">Error Rate > 5%</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200">
              Use math expressions to create sophisticated alarms on derived metrics
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
          <li>• Calculate error rates, percentages, aggregations</li>
          <li>• SEARCH() finds metrics matching patterns</li>
          <li>• Can create alarms on math expressions</li>
          <li>• Combine metrics from different namespaces</li>
        </ul>
      </div>
    </div>
  )
}

// 11. CloudWatch Anomaly Detection Explainer
export function CloudWatchAnomalyDetectionExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Anomaly Detection", description: "ML-powered detection of unusual metric behavior" },
    { title: "Dynamic Thresholds", description: "Automatically adjusts based on historical patterns" },
    { title: "Training Period", description: "2 weeks of data needed for accurate model" },
    { title: "Anomaly Band", description: "Expected range shown as gray band around metric" },
    { title: "Alarm Integration", description: "Create alarms when metrics go outside the band" }
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
        <TrendingUp className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Anomaly Detection</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 3) && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-cyan-400 mb-2">{step === 0 ? "ML-Powered Detection" : "Anomaly Band Visualization"}</h3></div>
            <div className="h-40 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full h-24 bg-gray-600/30 rounded" /></div>
              <svg className="absolute inset-0 w-full h-full">
                <path d="M 0 100 Q 50 80, 100 90 T 200 70 T 300 85 T 400 40 T 500 75" fill="none" stroke="#22d3ee" strokeWidth="2" />
              </svg>
              <div className="absolute top-2 left-2 bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                <span className="inline-block w-3 h-3 bg-gray-500 rounded mr-1" /> Expected Band
              </div>
              <div className="absolute bottom-2 right-2 bg-red-600 px-2 py-1 rounded text-xs text-white animate-pulse">Anomaly Detected!</div>
            </div>
            <div className="bg-cyan-900/30 border border-cyan-600/30 rounded-lg p-3 text-sm text-cyan-200 mt-4">
              {step === 0 ? "Machine learning automatically detects unusual metric patterns" : "Gray band shows expected range - deviations trigger anomalies"}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-purple-400 mb-2">Dynamic Thresholds</h3></div>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-2">Traditional Static Threshold</div>
                <div className="flex items-center gap-2"><div className="text-4xl text-red-400">❌</div><div className="text-sm text-gray-400">Same value 24/7 - misses patterns</div></div>
              </div>
              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                <div className="text-sm text-purple-300 mb-2">Anomaly Detection</div>
                <div className="flex items-center gap-2"><div className="text-4xl text-green-400">✓</div><div className="text-sm text-gray-300">Adapts to hourly, daily, weekly patterns</div></div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-yellow-400 mb-2">Training Period</h3></div>
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-center justify-around mb-4">
                <div className="text-center"><div className="text-3xl font-bold text-yellow-400">2 weeks</div><div className="text-xs text-gray-400">Minimum data</div></div>
                <div className="text-2xl text-yellow-400">→</div>
                <div className="text-center"><div className="text-3xl font-bold text-green-400">✓</div><div className="text-xs text-gray-400">Model trained</div></div>
              </div>
              <div className="text-sm text-gray-300 text-center">Needs historical data to learn normal patterns before detecting anomalies</div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-orange-400 mb-2">Alarm Integration</h3></div>
            <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-4 mb-3">
              <div className="text-sm font-semibold text-orange-300 mb-2">Create Alarms with Anomaly Detection</div>
              <div className="bg-gray-900 rounded p-3 font-mono text-xs text-orange-400">ANOMALY_DETECTION_BAND(m1, 2)</div>
              <div className="text-xs text-gray-400 mt-2">Triggers when metric is 2 standard deviations outside the expected band</div>
            </div>
            <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3 text-sm text-orange-200">
              No manual threshold tuning required - ML handles it automatically
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
          <li>• ML-based, no manual threshold setting needed</li>
          <li>• Needs ~2 weeks of historical data</li>
          <li>• Accounts for hourly/daily/weekly patterns</li>
          <li>• Use ANOMALY_DETECTION_BAND() in alarms</li>
        </ul>
      </div>
    </div>
  )
}

// 12. EventBridge Rules Explainer
export function EventBridgeRulesExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "EventBridge Rules", description: "Match events and route them to targets" },
    { title: "Event Patterns", description: "JSON patterns to filter matching events" },
    { title: "Schedule Rules", description: "Cron or rate expressions for periodic events" },
    { title: "Multiple Targets", description: "Route one event to up to 5 targets" },
    { title: "Input Transformation", description: "Transform event before sending to target" }
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
        <Zap className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">EventBridge Rules</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 3) && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-yellow-400 mb-2">{step === 0 ? "Event Routing" : "Multiple Targets"}</h3></div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto"><span className="text-2xl">📨</span></div>
                <div className="text-white text-sm">Event</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2 mx-auto"><span className="text-2xl">📋</span></div>
                <div className="text-white text-sm">Rule</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="flex flex-col gap-1 flex-1">
                {["Lambda", "SNS", "SQS", step === 3 ? "Step Fns" : null, step === 3 ? "Kinesis" : null].filter(Boolean).map((t, i) => (
                  <div key={i} className="bg-green-600 rounded px-2 py-1 text-xs text-white text-center">{t}</div>
                ))}
              </div>
            </div>
            {step === 3 && <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200">Up to 5 targets per rule - fan out events to multiple services</div>}
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-purple-400 mb-2">Event Patterns</h3></div>
            <div className="bg-gray-700 rounded-lg p-3 mb-3 font-mono text-xs text-purple-400">{`{ "source": ["aws.ec2"], "detail-type": ["EC2 Instance State-change"] }`}</div>
            <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-3 text-sm text-purple-200">JSON patterns filter which events match the rule</div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-blue-400 mb-2">Schedule Rules</h3></div>
            <div className="space-y-2">
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300">rate(5 minutes)</div><div className="text-xs text-gray-400">Every 5 minutes</div></div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-3"><div className="font-mono text-sm text-blue-300">cron(0 12 * * ? *)</div><div className="text-xs text-gray-400">Daily at 12:00 PM UTC</div></div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-orange-400 mb-2">Input Transformation</h3></div>
            <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-4">
              <div className="text-sm text-orange-300 mb-2">Transform event before sending to target</div>
              <div className="bg-gray-900 rounded p-2 mb-2 font-mono text-xs text-gray-400">Original: {"{"} "instance": "i-123" {"}"}</div>
              <div className="text-center text-lg">↓</div>
              <div className="bg-gray-900 rounded p-2 font-mono text-xs text-orange-400">Transformed: {"{"} "id": "i-123", "msg": "Instance changed" {"}"}</div>
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
          <li>• Event patterns for filtering, schedules for periodic</li>
          <li>• Up to 5 targets per rule</li>
          <li>• Input transformers modify event data</li>
          <li>• Archive and replay events for debugging</li>
        </ul>
      </div>
    </div>
  )
}

// 13. EventBridge Scheduler Explainer
export function EventBridgeSchedulerExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "EventBridge Scheduler", description: "Schedule one-time or recurring events" },
    { title: "Schedule Types", description: "Rate-based, cron-based, or one-time" },
    { title: "Flexible Time Windows", description: "Allow execution within a time window" },
    { title: "Retry Policies", description: "Configure retries for failed deliveries" },
    { title: "Universal Targets", description: "Invoke any AWS API as a target" }
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
        <Calendar className="w-8 h-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">EventBridge Scheduler</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 1) && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-indigo-400 mb-2">{step === 0 ? "Scheduler Overview" : "Schedule Types"}</h3></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2 border-indigo-500 bg-indigo-900/20">
                <div className="text-lg font-bold text-indigo-400 mb-2">Rate</div>
                <div className="text-sm text-gray-300 font-mono">rate(5 minutes)</div>
                <div className="text-xs text-gray-400 mt-2">Recurring interval</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-purple-500 bg-purple-900/20">
                <div className="text-lg font-bold text-purple-400 mb-2">Cron</div>
                <div className="text-sm text-gray-300 font-mono">cron(0 18 ? * MON-FRI *)</div>
                <div className="text-xs text-gray-400 mt-2">Complex schedules</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-pink-500 bg-pink-900/20">
                <div className="text-lg font-bold text-pink-400 mb-2">One-time</div>
                <div className="text-sm text-gray-300 font-mono">at(2024-12-31T23:59:00)</div>
                <div className="text-xs text-gray-400 mt-2">Single execution</div>
              </div>
            </div>
            {step === 1 && <div className="bg-indigo-900/30 border border-indigo-600/30 rounded-lg p-3 text-sm text-indigo-200 mt-4">One-time schedules only available in Scheduler - not in EventBridge Rules</div>}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-blue-400 mb-2">Flexible Time Windows</h3></div>
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
              <div className="text-sm text-blue-300 mb-3">Execute within a time window instead of exact time</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center"><div className="text-2xl font-bold text-blue-400">12:00 PM</div><div className="text-xs text-gray-400">Start window</div></div>
                <div className="text-xl">→</div>
                <div className="text-center"><div className="text-2xl font-bold text-blue-400">1:00 PM</div><div className="text-xs text-gray-400">End window</div></div>
              </div>
              <div className="text-xs text-gray-300 mt-3 text-center">Executes at any time between 12:00-1:00 PM</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-yellow-400 mb-2">Retry Policies</h3></div>
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
              <div className="space-y-3">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-yellow-300 mb-2">Maximum Retries</div>
                  <div className="text-lg font-bold text-white">Up to 185 retries</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-yellow-300 mb-2">Maximum Age</div>
                  <div className="text-lg font-bold text-white">Up to 14 days</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-yellow-300 mb-2">Dead Letter Queue</div>
                  <div className="text-lg font-bold text-white">Send to SQS on failure</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-green-400 mb-2">Universal Targets</h3></div>
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
              <div className="text-sm font-semibold text-green-300 mb-3">Invoke ANY AWS API</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700 rounded p-2 text-center text-sm">StartInstances (EC2)</div>
                <div className="bg-gray-700 rounded p-2 text-center text-sm">PutObject (S3)</div>
                <div className="bg-gray-700 rounded p-2 text-center text-sm">UpdateItem (DynamoDB)</div>
                <div className="bg-gray-700 rounded p-2 text-center text-sm">Invoke (Lambda)</div>
                <div className="bg-gray-700 rounded p-2 text-center text-sm">SendMessage (SQS)</div>
                <div className="bg-gray-700 rounded p-2 text-center text-sm">+270 more services</div>
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
          <li>• Separate from EventBridge rules (more features)</li>
          <li>• Supports one-time schedules (rules don't)</li>
          <li>• Universal targets: invoke ANY AWS API</li>
          <li>• Built-in retry policies and dead-letter queues</li>
        </ul>
      </div>
    </div>
  )
}

// 14. X-Ray Segments Explainer
export function XRaySegmentsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "X-Ray Segments", description: "Segments represent units of work in a trace" },
    { title: "Subsegments", description: "Break down segments into smaller operations" },
    { title: "Annotations", description: "Key-value pairs indexed for filtering (searchable)" },
    { title: "Metadata", description: "Additional data not indexed (not searchable)" },
    { title: "Trace Structure", description: "Segments contain subsegments, annotations, metadata" }
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
        <Search className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-bold text-white">X-Ray Segments &amp; Subsegments</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 4) && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-teal-400 mb-2">{step === 0 ? "Segment Structure" : "Complete Trace"}</h3></div>
            <div className="p-4 rounded-lg border-2 border-teal-500 bg-teal-900/20 mb-4">
              <div className="text-lg font-bold text-teal-400 mb-2">Segment: API Handler</div>
              <div className="ml-4 space-y-2">
                <div className="p-2 bg-blue-900/30 border border-blue-600 rounded">
                  <div className="text-sm text-blue-400 font-semibold">Subsegment: DynamoDB Query</div>
                  <div className="text-xs text-gray-400">duration: 45ms</div>
                </div>
                <div className="p-2 bg-purple-900/30 border border-purple-600 rounded">
                  <div className="text-sm text-purple-400 font-semibold">Subsegment: External API</div>
                  <div className="text-xs text-gray-400">duration: 120ms</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-2 bg-green-900/30 border border-green-600 rounded">
                  <div className="text-xs text-green-400 font-semibold">Annotation (indexed)</div>
                  <div className="text-sm text-white font-mono">user_id: "123"</div>
                </div>
                <div className="p-2 bg-gray-700 rounded">
                  <div className="text-xs text-gray-400">Metadata (not indexed)</div>
                  <div className="text-sm text-white font-mono">request_body: {"{...}"}</div>
                </div>
              </div>
            </div>
            {step === 0 && <div className="bg-teal-900/30 border border-teal-600/30 rounded-lg p-3 text-sm text-teal-200">Segments represent a unit of work - typically a service handling a request</div>}
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-blue-400 mb-2">Subsegments</h3></div>
            <div className="bg-gray-700 rounded-lg p-4 mb-3">
              <div className="text-sm text-gray-300 mb-3">Break down work into smaller operations</div>
              <div className="space-y-2">
                <div className="p-3 bg-blue-900/30 border border-blue-600 rounded"><div className="text-blue-300 font-semibold">DynamoDB Query</div><div className="text-xs text-gray-400">Database calls</div></div>
                <div className="p-3 bg-purple-900/30 border border-purple-600 rounded"><div className="text-purple-300 font-semibold">S3 GetObject</div><div className="text-xs text-gray-400">Storage operations</div></div>
                <div className="p-3 bg-green-900/30 border border-green-600 rounded"><div className="text-green-300 font-semibold">HTTP Request</div><div className="text-xs text-gray-400">External API calls</div></div>
                <div className="p-3 bg-yellow-900/30 border border-yellow-600 rounded"><div className="text-yellow-300 font-semibold">Business Logic</div><div className="text-xs text-gray-400">Internal processing</div></div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-green-400 mb-2">Annotations (Searchable)</h3></div>
            <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
              <div className="text-sm text-green-300 mb-3 font-semibold">Indexed key-value pairs for filtering</div>
              <div className="space-y-2">
                <div className="bg-gray-900 rounded p-2 font-mono text-sm"><span className="text-gray-400">user_id:</span> <span className="text-green-400">"user-12345"</span></div>
                <div className="bg-gray-900 rounded p-2 font-mono text-sm"><span className="text-gray-400">order_type:</span> <span className="text-green-400">"premium"</span></div>
                <div className="bg-gray-900 rounded p-2 font-mono text-sm"><span className="text-gray-400">region:</span> <span className="text-green-400">"us-west-2"</span></div>
              </div>
              <div className="mt-3 text-xs text-green-200">✓ Use for filtering traces in X-Ray console</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-purple-400 mb-2">Metadata (Not Searchable)</h3></div>
            <div className="bg-purple-900/30 border-2 border-purple-600 rounded-lg p-4">
              <div className="text-sm text-purple-300 mb-3 font-semibold">Additional context - NOT indexed</div>
              <div className="space-y-2">
                <div className="bg-gray-900 rounded p-2 font-mono text-sm"><span className="text-gray-400">request_headers:</span> <span className="text-purple-400">{"{...}"}</span></div>
                <div className="bg-gray-900 rounded p-2 font-mono text-sm"><span className="text-gray-400">response_body:</span> <span className="text-purple-400">{"{...}"}</span></div>
                <div className="bg-gray-900 rounded p-2 font-mono text-sm"><span className="text-gray-400">debug_info:</span> <span className="text-purple-400">{"{...}"}</span></div>
              </div>
              <div className="mt-3 text-xs text-purple-200">✗ Cannot filter by metadata - view only for context</div>
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
          <li>• Annotations: indexed, searchable (key-value)</li>
          <li>• Metadata: not indexed, any data (objects)</li>
          <li>• Subsegments for downstream calls</li>
          <li>• Use annotations for filtering traces</li>
        </ul>
      </div>
    </div>
  )
}

// 15. CloudWatch Contributor Insights Explainer
export function CloudWatchContributorInsightsExplainer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: "Contributor Insights", description: "Find top contributors to metric patterns" },
    { title: "Log Analysis", description: "Analyze CloudWatch Logs to find patterns" },
    { title: "Built-in Rules", description: "Pre-configured rules for common AWS services" },
    { title: "Custom Rules", description: "Create rules using JSON filter patterns" },
    { title: "Top-N Analysis", description: "Find top IPs, users, URLs causing issues" }
  ]

  const topContributors = [
    { ip: "192.168.1.100", requests: 15234, color: "bg-red-500" },
    { ip: "10.0.2.50", requests: 8456, color: "bg-orange-500" },
    { ip: "172.16.0.25", requests: 5123, color: "bg-yellow-500" },
    { ip: "192.168.2.80", requests: 3890, color: "bg-green-500" },
    { ip: "10.1.1.15", requests: 2345, color: "bg-blue-500" }
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
        <Users className="w-8 h-8 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">CloudWatch Contributor Insights</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        {(step === 0 || step === 4) && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-amber-400 mb-2">{step === 0 ? "Contributor Insights" : "Top-N Analysis"}</h3></div>
            <div className="text-sm text-gray-400 mb-3">Top 5 Contributors by Request Count</div>
            <div className="space-y-2">
              {topContributors.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-white font-mono text-sm w-32">{c.ip}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div className={`${c.color} h-full rounded-full transition-all`} style={{ width: `${(c.requests / 15234) * 100}%` }} />
                  </div>
                  <span className="text-gray-400 text-sm w-20 text-right">{c.requests.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-900/30 border border-amber-600/30 rounded-lg p-3 text-sm text-amber-200 mt-4">
              {step === 0 ? "Identify top contributors to system load, errors, or latency" : "Find top IPs, users, or URLs causing issues"}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-blue-400 mb-2">Log Analysis</h3></div>
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
              <div className="text-sm text-blue-300 mb-3">Analyze CloudWatch Logs to extract insights</div>
              <div className="space-y-2">
                <div className="bg-gray-900 rounded p-3"><div className="text-xs text-gray-400">Source</div><div className="font-mono text-sm text-blue-400">CloudWatch Logs</div></div>
                <div className="text-center text-xl">↓</div>
                <div className="bg-gray-900 rounded p-3"><div className="text-xs text-gray-400">Analysis</div><div className="text-sm text-blue-400">Pattern matching &amp; aggregation</div></div>
                <div className="text-center text-xl">↓</div>
                <div className="bg-gray-900 rounded p-3"><div className="text-xs text-gray-400">Output</div><div className="text-sm text-blue-400">Top contributors ranked by impact</div></div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-green-400 mb-2">Built-in Rules</h3></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-900/30 border border-green-600 rounded p-3"><div className="text-green-300 font-semibold mb-1">VPC Flow Logs</div><div className="text-xs text-gray-400">Top talkers by bytes</div></div>
              <div className="bg-green-900/30 border border-green-600 rounded p-3"><div className="text-green-300 font-semibold mb-1">Lambda@Edge</div><div className="text-xs text-gray-400">Top URLs by requests</div></div>
              <div className="bg-green-900/30 border border-green-600 rounded p-3"><div className="text-green-300 font-semibold mb-1">CloudFront</div><div className="text-xs text-gray-400">Top viewers by requests</div></div>
              <div className="bg-green-900/30 border border-green-600 rounded p-3"><div className="text-green-300 font-semibold mb-1">Route 53</div><div className="text-xs text-gray-400">Top domains queried</div></div>
            </div>
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 text-sm text-green-200 mt-4">
              AWS provides pre-configured rules for common services
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4"><h3 className="text-xl font-semibold text-purple-400 mb-2">Custom Rules</h3></div>
            <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
              <div className="text-sm text-purple-300 mb-3">Create custom rules with JSON patterns</div>
              <div className="bg-gray-900 rounded p-3 mb-3">
                <div className="text-xs text-gray-400 mb-2">Example Rule</div>
                <div className="font-mono text-xs text-purple-400">{`{
  "Schema": {
    "Name": "CloudWatchLogRule",
    "Version": 1
  },
  "AggregateOn": "Count",
  "Contribution": {
    "Keys": ["$srcaddr"],
    "Filters": [
      { "Match": "$action", "EqualTo": "REJECT" }
    ]
  }
}`}</div>
              </div>
              <div className="text-xs text-purple-200">Identify top source IPs with rejected connections</div>
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

      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl p-4 border border-amber-500/30">
        <h3 className="text-lg font-semibold text-amber-300 mb-2">📝 Exam Takeaways</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Find highest contributors to metrics/logs</li>
          <li>• Built-in rules for VPC Flow Logs, API Gateway, etc.</li>
          <li>• Identify bad actors, heavy users, error sources</li>
          <li>• Real-time or historical analysis</li>
        </ul>
      </div>
    </div>
  )
}

// Export all explainers
export const cloudwatchExplainers = {
  "metrics-dimensions": MetricsDimensionsExplainer,
  "cloudwatch-alarms": CloudWatchAlarmsExplainer,
  "logs-insights": LogsInsightsExplainer,
  "eventbridge": EventBridgeExplainer,
  "xray-integration": XRayIntegrationExplainer,
  "cloudwatch-dashboards": CloudWatchDashboardsExplainer,
  "cloudwatch-agent": CloudWatchAgentExplainer,
  "cloudwatch-logs-retention": CloudWatchLogsRetentionExplainer,
  "cloudwatch-composite-alarms": CloudWatchCompositeAlarmsExplainer,
  "cloudwatch-metric-math": CloudWatchMetricMathExplainer,
  "cloudwatch-anomaly-detection": CloudWatchAnomalyDetectionExplainer,
  "eventbridge-rules": EventBridgeRulesExplainer,
  "eventbridge-scheduler": EventBridgeSchedulerExplainer,
  "xray-segments": XRaySegmentsExplainer,
  "cloudwatch-contributor-insights": CloudWatchContributorInsightsExplainer,
}
