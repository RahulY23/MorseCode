import { useState, useCallback, useRef } from 'react'
import { parseMorseForPlayback } from '../lib/morseCode.js'
import { useAudio } from './useAudio.js'

export function useMorsePlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentElement, setCurrentElement] = useState(null)
  const timeoutRef = useRef(null)
  const { playDot, playDash, setVolume } = useAudio()

  const stopPlayback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPlaying(false)
    setCurrentElement(null)
  }, [])

  const playMorseSequence = useCallback(async (morseCode, speed = 20, volume = 0.7, onFlash = null) => {
    if (isPlaying) {
      stopPlayback()
      return
    }

    const elements = parseMorseForPlayback(morseCode)
    if (elements.length === 0) return

    setIsPlaying(true)
    setVolume(volume)

    // Calculate timing based on WPM (Words Per Minute)
    // Standard: 1 unit = 1200ms / WPM
    const unitDuration = 1200 / speed

    const playElement = async (index) => {
      if (index >= elements.length) {
        setIsPlaying(false)
        setCurrentElement(null)
        return
      }

      const element = elements[index]
      setCurrentElement(element)

      let duration = element.duration * unitDuration

      switch (element.type) {
        case 'dot':
          await playDot()
          if (onFlash) onFlash('dot', duration)
          break
        case 'dash':
          await playDash()
          if (onFlash) onFlash('dash', duration)
          break
        case 'element-space':
        case 'letter-space':
        case 'word-space':
          if (onFlash) onFlash('space', duration)
          break
        default:
          break
      }

      timeoutRef.current = setTimeout(() => {
        playElement(index + 1)
      }, duration)
    }

    playElement(0)
  }, [isPlaying, playDot, playDash, setVolume, stopPlayback])

  return {
    isPlaying,
    currentElement,
    playMorseSequence,
    stopPlayback
  }
}

