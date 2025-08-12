import { useRef, useCallback } from 'react'
import shortBeepUrl from '../assets/short_beep.mp3'
import longBeepUrl from '../assets/long_beep.mp3'

export function useAudio() {
  const shortBeepRef = useRef(null)
  const longBeepRef = useRef(null)

  // Initialize audio objects
  const initializeAudio = useCallback(() => {
    if (!shortBeepRef.current) {
      shortBeepRef.current = new Audio(shortBeepUrl)
      shortBeepRef.current.preload = 'auto'
    }
    if (!longBeepRef.current) {
      longBeepRef.current = new Audio(longBeepUrl)
      longBeepRef.current.preload = 'auto'
    }
  }, [])

  const playDot = useCallback(async () => {
    initializeAudio()
    try {
      shortBeepRef.current.currentTime = 0
      await shortBeepRef.current.play()
    } catch (error) {
      console.error('Error playing dot sound:', error)
    }
  }, [initializeAudio])

  const playDash = useCallback(async () => {
    initializeAudio()
    try {
      longBeepRef.current.currentTime = 0
      await longBeepRef.current.play()
    } catch (error) {
      console.error('Error playing dash sound:', error)
    }
  }, [initializeAudio])

  const setVolume = useCallback((volume) => {
    if (shortBeepRef.current) {
      shortBeepRef.current.volume = volume
    }
    if (longBeepRef.current) {
      longBeepRef.current.volume = volume
    }
  }, [])

  return {
    playDot,
    playDash,
    setVolume
  }
}

