import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  ArrowLeftRight, 
  Copy, 
  Trash2, 
  Volume2, 
  Flashlight,
  Clipboard,
  CheckCircle
} from 'lucide-react'
import { textToMorse, morseToText, isValidMorse } from './lib/morseCode.js'
import { useMorsePlayer } from './hooks/useMorsePlayer.js'
import { FlashlightSimulator } from './components/FlashlightSimulator.jsx'
import { AudioControls } from './components/AudioControls.jsx'
import './App.css'

function App() {
  const [textInput, setTextInput] = useState('')
  const [morseInput, setMorseInput] = useState('')
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [copySuccess, setCopySuccess] = useState({ text: false, morse: false })
  const [speed, setSpeed] = useState(20)
  const [volume, setVolume] = useState(0.7)
  const [flashState, setFlashState] = useState({ type: null, duration: 0 })
  
  const { isPlaying, playMorseSequence, stopPlayback } = useMorsePlayer()

  // Real-time translation effect
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const timeoutId = setTimeout(() => {
      if (textInput && !morseInput) {
        setMorseInput(textToMorse(textInput))
      } else if (morseInput && !textInput && isValidMorse(morseInput)) {
        setTextInput(morseToText(morseInput))
      }
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timeoutId)
  }, [textInput, morseInput, isRealTimeEnabled])

  const handleTextToMorse = useCallback(() => {
    if (textInput) {
      setMorseInput(textToMorse(textInput))
    }
  }, [textInput])

  const handleMorseToText = useCallback(() => {
    if (morseInput && isValidMorse(morseInput)) {
      setTextInput(morseToText(morseInput))
    }
  }, [morseInput])

  const handleCopy = useCallback(async (content, type) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopySuccess(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const handlePaste = useCallback(async (type) => {
    try {
      const text = await navigator.clipboard.readText()
      if (type === 'text') {
        setTextInput(text)
      } else {
        setMorseInput(text)
      }
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }, [])

  const clearAll = useCallback(() => {
    setTextInput('')
    setMorseInput('')
  }, [])

  const clearText = useCallback(() => {
    setTextInput('')
  }, [])

  const clearMorse = useCallback(() => {
    setMorseInput('')
  }, [])

  const handlePlayAudio = useCallback(() => {
    if (isPlaying) {
      stopPlayback()
    } else if (morseInput) {
      playMorseSequence(morseInput, speed, volume)
    }
  }, [isPlaying, morseInput, speed, volume, playMorseSequence, stopPlayback])

  const handlePlayWithFlash = useCallback(() => {
    if (isPlaying) {
      stopPlayback()
      setFlashState({ type: null, duration: 0 })
    } else if (morseInput) {
      const onFlash = (type, duration) => {
        setFlashState({ type, duration })
      }
      playMorseSequence(morseInput, speed, volume, onFlash)
    }
  }, [isPlaying, morseInput, speed, volume, playMorseSequence, stopPlayback])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Morse Code Translator
          </h1>
          <p className="text-lg text-gray-600">
            Convert text to Morse code and vice versa
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Badge 
              variant={isRealTimeEnabled ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            >
              Real-time Translation: {isRealTimeEnabled ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Text Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Enter Text</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePaste('text')}
                  >
                    <Clipboard className="w-4 h-4 mr-1" />
                    Paste
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearText}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your message here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] text-lg font-mono resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Characters: {textInput.length}
                </span>
                <Button
                  onClick={() => handleCopy(textInput, 'text')}
                  disabled={!textInput}
                  variant="outline"
                  size="sm"
                >
                  {copySuccess.text ? (
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Morse Code Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Morse Code</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePaste('morse')}
                  >
                    <Clipboard className="w-4 h-4 mr-1" />
                    Paste
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearMorse}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter dots and dashes..."
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                className="min-h-[200px] text-lg font-mono resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {isValidMorse(morseInput) ? (
                    <span className="text-green-600">Valid Morse Code</span>
                  ) : (
                    <span className="text-red-600">Invalid Characters</span>
                  )}
                </span>
                <Button
                  onClick={() => handleCopy(morseInput, 'morse')}
                  disabled={!morseInput}
                  variant="outline"
                  size="sm"
                >
                  {copySuccess.morse ? (
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Translation Controls */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleTextToMorse}
                disabled={!textInput}
                className="w-full sm:w-auto"
              >
                Text → Morse
                <ArrowLeftRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Separator orientation="vertical" className="hidden sm:block h-8" />
              <Separator className="sm:hidden w-full" />
              
              <Button
                onClick={handleMorseToText}
                disabled={!morseInput || !isValidMorse(morseInput)}
                className="w-full sm:w-auto"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Morse → Text
              </Button>
              
              <Separator orientation="vertical" className="hidden sm:block h-8" />
              <Separator className="sm:hidden w-full" />
              
              <Button
                onClick={clearAll}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audio/Visual Controls */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Audio & Visual Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="audio" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="audio">Audio Playback</TabsTrigger>
                <TabsTrigger value="visual">Visual Flashlight</TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio" className="space-y-6">
                <AudioControls
                  onPlay={handlePlayAudio}
                  isPlaying={isPlaying}
                  disabled={!morseInput || !isValidMorse(morseInput)}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  volume={volume}
                  onVolumeChange={setVolume}
                />
              </TabsContent>
              
              <TabsContent value="visual" className="space-y-6">
                <div className="flex flex-col items-center space-y-6">
                  <FlashlightSimulator
                    isActive={isPlaying}
                    flashType={flashState.type}
                    duration={flashState.duration}
                  />
                  
                  <div className="flex flex-col items-center space-y-4">
                    <Button
                      onClick={handlePlayWithFlash}
                      disabled={!morseInput || !isValidMorse(morseInput)}
                      size="lg"
                      className="w-48"
                    >
                      <Flashlight className="w-4 h-4 mr-2" />
                      {isPlaying ? 'Stop Flash' : 'Start Flash'}
                    </Button>
                    
                    <AudioControls
                      onPlay={handlePlayWithFlash}
                      isPlaying={isPlaying}
                      disabled={!morseInput || !isValidMorse(morseInput)}
                      speed={speed}
                      onSpeedChange={setSpeed}
                      volume={volume}
                      onVolumeChange={setVolume}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

