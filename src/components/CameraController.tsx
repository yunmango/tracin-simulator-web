import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { type MocapMode } from '@/store/simulator-store'

// Default camera positions (defined outside component to avoid recreating)
const DEFAULT_CAMERA_POSITION = new Vector3(4, 4, 4)
const DEFAULT_TARGET = new Vector3(0, 0, -4)

// Camera controller to zoom in on Michelle when mocap mode changes
export function CameraController({ 
  mocapMode, 
  michelleDistance,
  orbitControlsRef 
}: { 
  mocapMode: MocapMode
  michelleDistance: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitControlsRef: React.RefObject<any>
}) {
  const { camera } = useThree()
  const isAnimating = useRef(false)
  const animationProgress = useRef(0)
  const startPosition = useRef(new Vector3())
  const targetPosition = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const targetTarget = useRef(new Vector3())
  const prevMocapMode = useRef<MocapMode>(mocapMode)
  
  // Trigger animation when mocap mode changes
  useEffect(() => {
    if (prevMocapMode.current !== mocapMode) {
      const michellePosition = new Vector3(0, 1, -michelleDistance)
      
      if (mocapMode === 'bodyOnly' || mocapMode === 'handsOn') {
        // Zoom in to Michelle - position camera in front of her (facing her front)
        // Michelle is at [0, 0, -distance] facing toward Tracin (positive Z direction)
        // Camera positioned closer to origin (positive Z from Michelle) to see her front
        startPosition.current.copy(camera.position)
        targetPosition.current.set(0, 2.0, -michelleDistance + 5.5)
        
        if (orbitControlsRef.current) {
          startTarget.current.copy(orbitControlsRef.current.target)
        }
        targetTarget.current.copy(michellePosition)
        
        isAnimating.current = true
        animationProgress.current = 0
      } else if (mocapMode === 'setup') {
        // Zoom out to default view
        startPosition.current.copy(camera.position)
        targetPosition.current.copy(DEFAULT_CAMERA_POSITION)
        
        if (orbitControlsRef.current) {
          startTarget.current.copy(orbitControlsRef.current.target)
        }
        targetTarget.current.copy(DEFAULT_TARGET)
        
        isAnimating.current = true
        animationProgress.current = 0
      }
      
      prevMocapMode.current = mocapMode
    }
  }, [mocapMode, michelleDistance, camera, orbitControlsRef])
  
  // Animate camera position
  useFrame((_, delta) => {
    if (isAnimating.current) {
      animationProgress.current += delta * 2 // Animation speed
      
      if (animationProgress.current >= 1) {
        animationProgress.current = 1
        isAnimating.current = false
      }
      
      // Smooth easing function (ease-out cubic)
      const t = 1 - Math.pow(1 - animationProgress.current, 3)
      
      // Interpolate camera position
      camera.position.lerpVectors(startPosition.current, targetPosition.current, t)
      
      // Interpolate orbit controls target
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.lerpVectors(startTarget.current, targetTarget.current, t)
        orbitControlsRef.current.update()
      }
    }
  })
  
  return null
}
