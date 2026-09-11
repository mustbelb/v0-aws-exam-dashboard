"use client"
import { useEffect, useState, type SetStateAction } from "react"

/** One playback clock shared by every lesson. Manual navigation pauses playback. */
export function useExplainerPlayback(stepCount: number, intervalMs = 3000) {
  const [step, updateStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const lastStep = Math.max(0, stepCount - 1)

  useEffect(() => {
    if (!isPlaying) return
    if (step >= lastStep) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => updateStep(current => Math.min(lastStep, current + 1)), intervalMs)
    return () => clearTimeout(timer)
  }, [step, isPlaying, lastStep, intervalMs])

  function reset() {
    setIsPlaying(false)
    updateStep(0)
    setResetKey(key => key + 1)
  }
  function togglePlayback() {
    if (!isPlaying && step >= lastStep) {
      updateStep(0)
      setResetKey(key => key + 1)
    }
    setIsPlaying(playing => !playing)
  }
  function setStep(next: SetStateAction<number>) {
    setIsPlaying(false)
    updateStep(current => Math.max(0, Math.min(lastStep, typeof next === 'function' ? next(current) : next)))
  }
  return { step, setStep, isPlaying, togglePlayback, reset, resetKey }
}
