import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { AnimationMixer, Object3D, SpotLight, MeshStandardMaterial } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'

import michelleComplicatedGesture from '../assets/Michelle_Comlicated_Gesture.fbx'
import michelleSimpleGesture from '../assets/Michelle_Simple_Gesture.fbx'
import michelleDancing from '../assets/Michelle_Dancing.fbx'

// Spotlight settings for each light condition
const spotlightSettings = {
  bright: {
    intensity: 50,
    color: '#ffffff',
  },
  less: {
    intensity: 20,
    color: '#e8e8ff',
  },
  dark: {
    intensity: 5,
    color: '#6666ff',
  },
}

export function MichelleModel() {
  const baseFbx = useFBX(michelleDancing)
  const complicatedGestureFbx = useFBX(michelleComplicatedGesture)
  const simpleGestureFbx = useFBX(michelleSimpleGesture)
  const dancingFbx = useFBX(michelleDancing)
  
  const { zoneSettings, mocapMode, lightCondition } = useSimulatorStore()
  const isSetupMode = mocapMode === 'setup'
  const mixerRef = useRef<AnimationMixer | null>(null)
  const spotlightRef = useRef<SpotLight>(null)
  const targetRef = useRef<Object3D>(null)
  
  // Convert FBX materials to MeshStandardMaterial so they respond to lights
  useEffect(() => {
    if (baseFbx) {
      baseFbx.traverse((child) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mesh = child as any
        if (mesh.isMesh && mesh.material) {
          const oldMaterial = mesh.material
          // Create a new standard material that responds to lights
          const newMaterial = new MeshStandardMaterial({
            map: oldMaterial.map || null,
            color: oldMaterial.color || 0xffffff,
            roughness: 0.7,
            metalness: 0.1,
          })
          mesh.material = newMaterial
        }
      })
    }
  }, [baseFbx])
  
  // Determine which animation to play based on mocapMode and lightCondition
  const currentAnimation = useMemo(() => {
    // Setup mode: no animation (T-pose)
    if (mocapMode === 'setup') {
      return null
    }
    if (mocapMode === 'bodyOnly') {
      // Body Only mode: always play dancing animation regardless of light condition
      return dancingFbx.animations[0]
    } else {
      // Hands On mode: depends on light condition
      if (lightCondition === 'bright') {
        return complicatedGestureFbx.animations[0]
      } else {
        // 'less' light condition (dark is disabled for handsOn)
        return simpleGestureFbx.animations[0]
      }
    }
  }, [mocapMode, lightCondition, complicatedGestureFbx, simpleGestureFbx, dancingFbx])
  
  // Setup and update animation mixer
  useEffect(() => {
    if (baseFbx && currentAnimation && !isSetupMode) {
      // Create new mixer for the model
      const mixer = new AnimationMixer(baseFbx)
      mixerRef.current = mixer
      
      // Play the animation
      const action = mixer.clipAction(currentAnimation)
      action.reset()
      action.play()
      
      return () => {
        mixer.stopAllAction()
        mixer.uncacheRoot(baseFbx)
      }
    } else {
      // In setup mode, clear the mixer to show T-pose
      mixerRef.current = null
    }
  }, [baseFbx, currentAnimation, isSetupMode])
  
  // Setup spotlight target - must add target to scene
  useEffect(() => {
    if (spotlightRef.current && targetRef.current) {
      spotlightRef.current.target = targetRef.current
      // The target must be added to the scene for the spotlight to work
      spotlightRef.current.target.updateMatrixWorld()
    }
  }, [zoneSettings.distance])
  
  // Update animation on each frame (skip in setup mode to maintain T-pose)
  useFrame((_, delta) => {
    if (mixerRef.current && !isSetupMode) {
      mixerRef.current.update(delta)
    }
  })
  
  // Get spotlight settings based on light condition
  const spotlight = spotlightSettings[lightCondition]
  const michellePosition: [number, number, number] = [0, 0, -zoneSettings.distance]
  
  // FBX models are often in centimeters, scale down to meters
  // Position Michelle at distance from Tracin (which is at 0, 1.0, 0)
  // Michelle moves along the Z-axis based on distance setting
  return (
    <group>
      <primitive object={baseFbx} scale={0.01} position={michellePosition} />
      
      {/* Target object for spotlight - positioned at Michelle's center (waist height) */}
      <object3D ref={targetRef} position={[michellePosition[0], michellePosition[1] + 1, michellePosition[2]]} />
      
      {/* Spotlight on Michelle - changes with light condition */}
      <spotLight
        ref={spotlightRef}
        position={[michellePosition[0], michellePosition[1] + 5, michellePosition[2] + 3]}
        intensity={spotlight.intensity}
        color={spotlight.color}
        angle={Math.PI / 5}
        penumbra={0.5}
        distance={20}
        decay={1}
      />
    </group>
  )
}
