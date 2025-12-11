import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Mesh, MeshStandardMaterial } from 'three'
import trussModel from '../assets/truss.glb'

interface TrussModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
}

export function TrussModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color }: TrussModelProps) {
  const gltf = useGLTF(trussModel)
  
  // Clone the scene so we can have multiple instances
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.material) {
          const material = child.material as MeshStandardMaterial
          if (color) {
            material.color.set(color)
          }
        }
      }
    })
  }, [color, scene])
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

// Preload the model
useGLTF.preload(trussModel)
