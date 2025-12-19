import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { type ColorRepresentation, type Material, type Texture, AnimationMixer, Mesh, MeshStandardMaterial, Object3D, SpotLight } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'

// TODO: Replace with different animation files when ready
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
  const { zoneSettings, lightCondition, mocapMode } = useSimulatorStore()
  
  // Conditionally select FBX based on mocapMode (loads only the needed one)
  const fbxUrl = useMemo(() => {
    switch (mocapMode) {
      case 'setup':
        return neoMovinManSetup
      case 'bodyOnly':
        return neoMovinManBodyOnly
      case 'handsOn':
        return neoMovinManHandsOn
      default:
        return neoMovinManSetup
    }
  }, [mocapMode])
  
  // Load only the FBX for the current mode
  const fbx = useFBX(fbxUrl)
  
  const isSetupMode = mocapMode === 'setup'
  const spotlightRef = useRef<SpotLight>(null)
  const targetRef = useRef<Object3D>(null)
  const mixerRef = useRef<AnimationMixer | null>(null)

  // Convert FBX materials to MeshStandardMaterial so they respond to lights
  useEffect(() => {
    if (!fbx) return

    type MaterialLike = Material & {
      map?: Texture | null
      color?: ColorRepresentation
    }

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
  }, [fbx])
  
  // Determine animation to use based on mocapMode
  const currentAnimation = useMemo(() => {
    if (mocapMode === 'setup' || !fbx.animations || fbx.animations.length === 0) {
      return null
    }
    // Use the first animation for both bodyOnly and handsOn modes
    return fbx.animations[0]
  }, [mocapMode, fbx])
  
  // Setup and update animation mixer
  useEffect(() => {
    if (fbx && currentAnimation && !isSetupMode) {
      const mixer = new AnimationMixer(fbx)
      mixerRef.current = mixer
      
      const action = mixer.clipAction(currentAnimation)
      action.reset()
      action.play()
      
      return () => {
        mixer.stopAllAction()
        mixer.uncacheRoot(fbx)
      }
    } else {
      mixerRef.current = null
    }
  }, [fbx, currentAnimation, isSetupMode])

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
      <primitive object={fbx} scale={0.01} position={characterPosition} />

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
