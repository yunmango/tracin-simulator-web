import { useRef, useState, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshStandardMaterial } from 'three'

interface FadeGroupProps {
  visible?: boolean
  children: ReactNode
}

export function FadeGroup({ visible = true, children }: FadeGroupProps) {
  const groupRef = useRef<Group>(null)
  const currentOpacityRef = useRef(visible ? 1 : 0)
  const [isVisible, setIsVisible] = useState(visible)
  const targetOpacity = visible ? 1 : 0
  
  // Animate opacity changes
  useFrame(() => {
    const diff = targetOpacity - currentOpacityRef.current
    if (Math.abs(diff) > 0.001) {
      currentOpacityRef.current += diff * 0.1
      
      // Update all materials in the group
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          if (child instanceof Mesh && child.material) {
            const material = child.material as MeshStandardMaterial
            material.transparent = true
            material.opacity = currentOpacityRef.current
          }
        })
      }
      
      // Update visibility state
      const shouldBeVisible = currentOpacityRef.current > 0.01
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible)
      }
    }
  })
  
  return (
    <group ref={groupRef} visible={isVisible}>
      {children}
    </group>
  )
}
