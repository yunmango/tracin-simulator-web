import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

interface MountModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
}

export function MountModel({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  color
}: MountModelProps) {
  const { scene } = useGLTF('/src/assets/mount.glb')
  
  // Clone the scene to create a new instance
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          // Clone material to avoid affecting other instances
          child.material = child.material.clone()
          if (color) {
            child.material.color.set(color)
          }
        }
      }
    })
  }, [clonedScene, color])
  
  return <primitive object={clonedScene} position={position} rotation={rotation} scale={scale} />
}
