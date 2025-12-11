import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import tracinModel from '../assets/tracin.glb'

interface TracinModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
}

export function TracinModel({ 
  position = [0, 1.0, 0], 
  rotation = [0, Math.PI, 0],
  scale = 0.001,
  color
}: TracinModelProps) {
  const { scene } = useGLTF(tracinModel)
  
  // Clone the scene to create a new instance for each TracinModel
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
