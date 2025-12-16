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
        <h2 className="text-2xl font-bold text-white">Metrics & Dimensions</h2>
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
        {/* Metric Graph */}
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

        {/* Dimensions */}
        <div className="bg-gray-700 rounded-lg p-4 mt-4">
          <div className="text-sm font-semibold text-gray-300 mb-2">Dimensions</div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gray-600 px-3 py-1 rounded-full text-sm">
              <span className="text-gray-400">InstanceId: </span>
              <span className="text-white">i-abc123def</span>
            </div>
            <div className="bg-gray-600 px-3 py-1 rounded-full text-sm">
              <span className="text-gray-400">AutoScalingGroupName: </span>
              <span className="text-white">my-asg</span>
            </div>
          </div>
        </div>

        {/* Resolution Info */}
        <div className={`mt-4 p-3 rounded-lg ${
          resolution === "high" ? "bg-purple-900/30 border border-purple-600/30" : "bg-gray-700"
        }`}>
          <div className="text-sm">
            <span className="text-gray-400">Resolution: </span>
            <span className={resolution === "high" ? "text-purple-400" : "text-white"}>
              {resolution === "high" ? "1 second (additional cost)" : "1 minute (standard)"}
            </span>
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
        {/* Alarm State */}
        <div className="flex items-center justify-center mb-6">
          <div className={`text-4xl font-bold px-8 py-4 rounded-xl ${
            alarmState === "ALARM"
              ? "bg-red-600 text-white animate-pulse"
              : "bg-green-600 text-white"
          }`}>
            {alarmState}
          </div>
        </div>

        {/* Metric Visualization */}
        <div className="relative h-32 bg-gray-700 rounded-lg p-4 mb-4">
          {/* Threshold Line */}
          <div
            className="absolute w-full border-t-2 border-dashed border-red-500"
            style={{ bottom: `${threshold}%` }}
          >
            <span className="absolute -top-5 right-0 text-xs text-red-400">
              Threshold: {threshold}%
            </span>
          </div>
          {/* Current Value */}
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

        {/* Alarm Actions */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg text-center ${
            alarmState === "ALARM" ? "bg-red-900/30 border border-red-600/50" : "bg-gray-700"
          }`}>
            <div className="text-2xl mb-1">📧</div>
            <div className="text-xs text-gray-400">SNS Topic</div>
            {alarmState === "ALARM" && <div className="text-xs text-red-400 mt-1">Sending...</div>}
          </div>
          <div className={`p-3 rounded-lg text-center ${
            alarmState === "ALARM" ? "bg-orange-900/30 border border-orange-600/50" : "bg-gray-700"
          }`}>
            <div className="text-2xl mb-1">📈</div>
            <div className="text-xs text-gray-400">Auto Scaling</div>
            {alarmState === "ALARM" && <div className="text-xs text-orange-400 mt-1">Scale Out</div>}
          </div>
          <div className={`p-3 rounded-lg text-center ${
            alarmState === "ALARM" ? "bg-purple-900/30 border border-purple-600/50" : "bg-gray-700"
          }`}>
            <div className="text-2xl mb-1">λ</div>
            <div className="text-xs text-gray-400">Lambda</div>
            {alarmState === "ALARM" && <div className="text-xs text-purple-400 mt-1">Invoking...</div>}
          </div>
        </div>
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
        <h2 className="text-2xl font-bold text-white">Logs & Insights</h2>
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
        {!showInsights ? (
          <div>
            {/* Log Hierarchy */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span className="bg-gray-600 px-2 py-1 rounded">Log Group: /aws/lambda/my-function</span>
                <span>→</span>
                <span className="bg-gray-600 px-2 py-1 rounded">Log Stream: 2024/01/15/[$LATEST]abc123</span>
              </div>
            </div>

            {/* Log Events */}
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
          </div>
        ) : (
          <div>
            {/* Insights Query */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Insights Query</div>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-purple-400">
                <div>fields @timestamp, @message</div>
                <div>| filter @message like /ERROR/</div>
                <div>| sort @timestamp desc</div>
                <div>| limit 20</div>
              </div>
            </div>

            {/* Query Results */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Results (1 found)</div>
              <div className="bg-gray-900 rounded p-3 font-mono text-sm">
                <div className="text-gray-500">12:00:15</div>
                <div className="text-red-400">ERROR: Connection timeout to database</div>
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
        <div className="flex items-center justify-between">
          {/* Event Source */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-3xl">{eventSources[eventSource].icon}</span>
            </div>
            <span className="text-sm text-gray-400">Event Source</span>
            <div className="text-xs text-gray-500 mt-1 max-w-[120px]">
              {eventSources[eventSource].example}
            </div>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-gray-500">→</div>

          {/* Event Bus */}
          <div className="text-center">
            <div className="w-24 h-20 bg-orange-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <Calendar className="w-8 h-8 text-white" />
              <span className="text-xs text-white mt-1">Event Bus</span>
            </div>
            <span className="text-sm text-gray-400">EventBridge</span>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-gray-500">→</div>

          {/* Rule */}
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-lg flex flex-col items-center justify-center mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs text-white mt-1">Rule</span>
            </div>
            <span className="text-sm text-gray-400">Pattern Match</span>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-gray-500">→</div>

          {/* Targets */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span>λ</span>
              <span className="text-sm text-gray-300">Lambda</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span>📨</span>
              <span className="text-sm text-gray-300">SQS</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span>📬</span>
              <span className="text-sm text-gray-300">SNS</span>
            </div>
          </div>
        </div>

        {/* Event Pattern */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-2">Event Pattern Example</div>
          <pre className="text-xs font-mono text-orange-400 overflow-auto">
{`{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change Notification"],
  "detail": {
    "state": ["stopped", "terminated"]
  }
}`}
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
    { title: "Segments & Subsegments", description: "Segments represent services, subsegments represent calls" },
    { title: "Service Map", description: "Visual representation of your application architecture" },
    { title: "Annotations & Metadata", description: "Add custom data to traces for filtering and analysis" },
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
        {!showTrace ? (
          <div>
            {/* Service Map */}
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                  <span>🌐</span>
                </div>
                <span className="text-xs text-gray-400">API GW</span>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-2 rounded" />
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-2">
                  <span>λ</span>
                </div>
                <span className="text-xs text-gray-400">Lambda</span>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-2 rounded" />
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <span>📊</span>
                </div>
                <span className="text-xs text-gray-400">DynamoDB</span>
              </div>
              <div className="flex-1 h-1 bg-red-500 mx-2 rounded animate-pulse" />
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2 ring-2 ring-red-400">
                  <span>🔗</span>
                </div>
                <span className="text-xs text-red-400">External</span>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              Red indicates errors or high latency
            </div>
          </div>
        ) : (
          <div>
            {/* Trace Timeline */}
            <div className="space-y-3">
              {traceData.map((segment, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-400">{segment.service}</div>
                  <div className="flex-1 h-6 bg-gray-700 rounded relative">
                    <div
                      className={`h-full rounded transition-all ${
                        segment.status === "error" ? "bg-red-500" : "bg-cyan-500"
                      }`}
                      style={{ width: `${(segment.duration / 400) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1 text-xs text-gray-300">
                      {segment.duration}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Total trace duration: {traceData.reduce((a, b) => a + b.duration, 0)}ms
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
        <div className="mb-4 text-sm text-gray-400">Metric Availability</div>
        <div className="space-y-2">
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
              <span className="text-white">{m.name}</span>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${m.default ? "bg-green-600" : "bg-red-600"}`}>{m.default ? "Default" : "Agent Required"}</span>
              </div>
            </div>
          ))}
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
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Select Retention Period</div>
          <select
            value={retention}
            onChange={(e) => setRetention(parseInt(e.target.value))}
            className="bg-gray-700 text-white rounded-lg p-2 w-full"
          >
            <option value={0}>Never Expire</option>
            {retentionOptions.map(d => (
              <option key={d} value={d}>{d} days {d >= 365 ? `(${Math.floor(d/365)} year${d >= 730 ? 's' : ''})` : ''}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
          <div>
            <div className="text-white font-semibold">Estimated Cost</div>
            <div className="text-xs text-gray-400">Based on 10GB/month ingestion</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">${retention === 0 ? '∞' : (0.03 * retention * 0.1).toFixed(2)}</div>
            <div className="text-xs text-gray-400">storage/month</div>
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
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button onClick={() => setAlarm1(!alarm1)} className={`p-4 rounded-lg border-2 ${alarm1 ? "border-red-500 bg-red-900/20" : "border-green-500 bg-green-900/20"}`}>
            <div className="text-white font-semibold">CPU Alarm</div>
            <div className={`text-sm ${alarm1 ? "text-red-400" : "text-green-400"}`}>{alarm1 ? "ALARM" : "OK"}</div>
          </button>
          <div className="flex items-center justify-center text-2xl text-gray-400">AND</div>
          <button onClick={() => setAlarm2(!alarm2)} className={`p-4 rounded-lg border-2 ${alarm2 ? "border-red-500 bg-red-900/20" : "border-green-500 bg-green-900/20"}`}>
            <div className="text-white font-semibold">Memory Alarm</div>
            <div className={`text-sm ${alarm2 ? "text-red-400" : "text-green-400"}`}>{alarm2 ? "ALARM" : "OK"}</div>
          </button>
        </div>
        <div className="text-center text-2xl text-gray-400 mb-4">↓</div>
        <div className={`p-4 rounded-lg border-2 text-center ${compositeState === "ALARM" ? "border-red-500 bg-red-900/20" : "border-green-500 bg-green-900/20"}`}>
          <div className="text-white font-bold text-lg">Composite Alarm</div>
          <div className={`text-xl ${compositeState === "ALARM" ? "text-red-400" : "text-green-400"}`}>{compositeState}</div>
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
        <div className="space-y-3">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Error Rate Calculation</div>
            <div className="font-mono text-sm text-green-400">m1: Errors, m2: Requests</div>
            <div className="font-mono text-sm text-yellow-400">e1: (m1 / m2) * 100</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Aggregation</div>
            <div className="font-mono text-sm text-green-400">SUM(METRICS())</div>
            <div className="text-xs text-gray-400">Sum all matching metrics</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Search Expression</div>
            <div className="font-mono text-sm text-green-400">SEARCH(' CPUUtilization ', 'Average', 300)</div>
            <div className="text-xs text-gray-400">Find all CPU metrics</div>
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
        <div className="h-40 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-24 bg-gray-600/30 rounded" />
          </div>
          <svg className="absolute inset-0 w-full h-full">
            <path d="M 0 100 Q 50 80, 100 90 T 200 70 T 300 85 T 400 40 T 500 75" fill="none" stroke="#22d3ee" strokeWidth="2" />
          </svg>
          <div className="absolute top-2 left-2 bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
            <span className="inline-block w-3 h-3 bg-gray-500 rounded mr-1" /> Expected Band
          </div>
          <div className="absolute bottom-2 right-2 bg-red-600 px-2 py-1 rounded text-xs text-white">
            Anomaly Detected!
          </div>
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
            {["Lambda", "SNS", "SQS"].map((t, i) => (
              <div key={i} className="bg-green-600 rounded px-2 py-1 text-xs text-white text-center">{t}</div>
            ))}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 font-mono text-xs text-green-400">
          {`{ "source": ["aws.ec2"], "detail-type": ["EC2 Instance State-change"] }`}
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
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border-2 border-indigo-500 bg-indigo-900/20">
            <div className="text-lg font-bold text-indigo-400 mb-2">Rate</div>
            <div className="text-sm text-gray-300">rate(5 minutes)</div>
          </div>
          <div className="p-4 rounded-lg border-2 border-purple-500 bg-purple-900/20">
            <div className="text-lg font-bold text-purple-400 mb-2">Cron</div>
            <div className="text-sm text-gray-300">cron(0 18 ? * MON-FRI *)</div>
          </div>
          <div className="p-4 rounded-lg border-2 border-pink-500 bg-pink-900/20">
            <div className="text-lg font-bold text-pink-400 mb-2">One-time</div>
            <div className="text-sm text-gray-300">at(2024-12-31T23:59:00)</div>
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
        <h2 className="text-2xl font-bold text-white">X-Ray Segments & Subsegments</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="p-4 rounded-lg border-2 border-teal-500 bg-teal-900/20 mb-4">
          <div className="text-lg font-bold text-teal-400 mb-2">Segment: API Handler</div>
          <div className="ml-4 space-y-2">
            <div className="p-2 bg-gray-700 rounded">
              <div className="text-sm text-blue-400">Subsegment: DynamoDB Query</div>
              <div className="text-xs text-gray-400">duration: 45ms</div>
            </div>
            <div className="p-2 bg-gray-700 rounded">
              <div className="text-sm text-purple-400">Subsegment: External API</div>
              <div className="text-xs text-gray-400">duration: 120ms</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-900/30 rounded">
              <div className="text-xs text-green-400">Annotation (indexed)</div>
              <div className="text-sm text-white">user_id: "123"</div>
            </div>
            <div className="p-2 bg-gray-700 rounded">
              <div className="text-xs text-gray-400">Metadata (not indexed)</div>
              <div className="text-sm text-white">request_body: {"{...}"}</div>
            </div>
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
        <div className="text-sm text-gray-400 mb-3">Top 5 Contributors by Request Count</div>
        <div className="space-y-2">
          {topContributors.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-white font-mono text-sm w-32">{c.ip}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div className={`${c.color} h-full rounded-full`} style={{ width: `${(c.requests / 15234) * 100}%` }} />
              </div>
              <span className="text-gray-400 text-sm w-20 text-right">{c.requests.toLocaleString()}</span>
            </div>
          ))}
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
