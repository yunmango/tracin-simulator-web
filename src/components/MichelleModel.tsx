import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { type ColorRepresentation, type Material, type Texture, AnimationMixer, Mesh, MeshStandardMaterial, Object3D, SpotLight } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'

import neoMovinManSetup from '../assets/NeoMOVINMan.fbx'
import neoMovinManBodyOnly from '../assets/NeoMOVINMan.fbx'
import neoMovinManHandsOn from '../assets/NeoMOVINMan.fbx'

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
  const setupFbx = useFBX(neoMovinManSetup)
  const bodyOnlyFbx = useFBX(neoMovinManBodyOnly)
  const handsOnFbx = useFBX(neoMovinManHandsOn)
  
  const { zoneSettings, lightCondition, mocapMode } = useSimulatorStore()
  const isSetupMode = mocapMode === 'setup'
  const spotlightRef = useRef<SpotLight>(null)
  const targetRef = useRef<Object3D>(null)
  const mixerRef = useRef<AnimationMixer | null>(null)

  // Convert FBX materials to MeshStandardMaterial so they respond to lights
  useEffect(() => {
    type MaterialLike = Material & {
      map?: Texture | null
      color?: ColorRepresentation
    }

    const convertMaterials = (fbx: Object3D | null | undefined) => {
      if (!fbx) return

      fbx.traverse((child) => {
        const mesh = child as Mesh
        if (!mesh.isMesh || !mesh.material || !mesh.geometry) return

        try {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          const hasUV = Boolean(mesh.geometry.getAttribute('uv'))

          const newMaterials = materials.map((oldMaterial) => {
            const old = oldMaterial as MaterialLike

            return new MeshStandardMaterial({
              map: hasUV ? (old.map ?? null) : null,
              color: old.color ?? 0xffffff,
              roughness: 0.7,
              metalness: 0.1,
            })
          })

          mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0]
        } catch {
          // Material conversion failed, skip this mesh
        }
      })
    }
    
    convertMaterials(setupFbx)
    convertMaterials(bodyOnlyFbx)
    convertMaterials(handsOnFbx)
  }, [setupFbx, bodyOnlyFbx, handsOnFbx])
  
  // Determine which FBX and animation to use based on mocapMode and lightCondition
  const { currentFbx, currentAnimation } = useMemo(() => {
    if (mocapMode === 'setup') {
      return { currentFbx: setupFbx, currentAnimation: null }
    } else if (mocapMode === 'bodyOnly') {
      return { 
        currentFbx: bodyOnlyFbx, 
        currentAnimation: bodyOnlyFbx.animations[0] || null 
      }
    } else {
      // handsOn mode
      return { 
        currentFbx: handsOnFbx, 
        currentAnimation: handsOnFbx.animations[0] || null 
      }
    }
  }, [mocapMode, setupFbx, bodyOnlyFbx, handsOnFbx])
  
  // Setup and update animation mixer
  useEffect(() => {
    if (currentFbx && currentAnimation && !isSetupMode) {
      const mixer = new AnimationMixer(currentFbx)
      mixerRef.current = mixer
      
      const action = mixer.clipAction(currentAnimation)
      action.reset()
      action.play()
      
      return () => {
        mixer.stopAllAction()
        mixer.uncacheRoot(currentFbx)
      }
    } else {
      mixerRef.current = null
    }
  }, [currentFbx, currentAnimation, isSetupMode])

  // Setup spotlight target - must add target to scene
  useEffect(() => {
    if (spotlightRef.current && targetRef.current) {
      spotlightRef.current.target = targetRef.current
      spotlightRef.current.target.updateMatrixWorld()
    }
  }, [zoneSettings.distance])
  
  // Update animation on each frame (skip in setup mode to maintain T-pose)
  useFrame((_, delta) => {
    if (mixerRef.current && !isSetupMode) {
      mixerRef.current.update(delta)
    }
  })

  const spotlight = spotlightSettings[lightCondition]
  const characterPosition: [number, number, number] = [0, 0, -zoneSettings.distance]

  // FBX models are often in centimeters, scale down to meters
  return (
    <group>
      <primitive object={currentFbx} scale={0.01} position={characterPosition} />

      {/* Spotlight target at waist height */}
      <object3D ref={targetRef} position={[characterPosition[0], characterPosition[1] + 1, characterPosition[2]]} />

      <spotLight
        ref={spotlightRef}
        position={[characterPosition[0], characterPosition[1] + 5, characterPosition[2] + 3]}
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
