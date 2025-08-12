import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function FlashlightSimulator({ isActive, flashType, duration }) {
  const [isFlashing, setIsFlashing] = useState(false)

  useEffect(() => {
    if (isActive && flashType && flashType !== 'space') {
      setIsFlashing(true)
      const timer = setTimeout(() => {
        setIsFlashing(false)
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsFlashing(false)
    }
  }, [isActive, flashType, duration])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <motion.div
          className={`w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center ${
            isFlashing ? 'bg-yellow-300 border-yellow-400' : 'bg-gray-100'
          }`}
          animate={{
            scale: isFlashing ? 1.1 : 1,
            boxShadow: isFlashing 
              ? '0 0 30px rgba(255, 255, 0, 0.8), 0 0 60px rgba(255, 255, 0, 0.4)' 
              : '0 0 0px rgba(255, 255, 0, 0)'
          }}
          transition={{
            duration: 0.1,
            ease: 'easeInOut'
          }}
        >
          <motion.div
            className={`w-20 h-20 rounded-full ${
              isFlashing ? 'bg-white' : 'bg-gray-300'
            }`}
            animate={{
              opacity: isFlashing ? 1 : 0.3,
              scale: isFlashing ? 1 : 0.8
            }}
            transition={{
              duration: 0.1
            }}
          />
        </motion.div>
        
        {/* Outer glow effect */}
        {isFlashing && (
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full bg-yellow-200 opacity-30 -z-10"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {isActive ? (
            isFlashing ? (
              <span className="text-yellow-600">
                {flashType === 'dot' ? 'DOT (•)' : 'DASH (−)'}
              </span>
            ) : (
              <span className="text-gray-500">Pause</span>
            )
          ) : (
            'Ready'
          )}
        </p>
      </div>
    </div>
  )
}

