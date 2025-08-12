import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Volume2, VolumeX, Play, Square } from 'lucide-react'

export function AudioControls({ 
  onPlay, 
  isPlaying, 
  disabled = false,
  speed = 20,
  onSpeedChange,
  volume = 0.7,
  onVolumeChange 
}) {
  const [isMuted, setIsMuted] = useState(false)

  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    onVolumeChange(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(0.7)
      setIsMuted(false)
    } else {
      onVolumeChange(0)
      setIsMuted(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Play/Stop Button */}
      <div className="flex justify-center">
        <Button
          onClick={onPlay}
          disabled={disabled}
          size="lg"
          className="w-32"
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Play Audio
            </>
          )}
        </Button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Speed: {speed} WPM (Words Per Minute)
        </Label>
        <Slider
          value={[speed]}
          onValueChange={(value) => onSpeedChange(value[0])}
          min={5}
          max={40}
          step={1}
          className="w-full"
          disabled={isPlaying}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Slow (5)</span>
          <span>Fast (40)</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Volume: {Math.round(volume * 100)}%
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="p-1"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mute</span>
          <span>Max</span>
        </div>
      </div>
    </div>
  )
}

