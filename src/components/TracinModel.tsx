import { useGLTF } from '@react-three/drei'
import tracinModel from '../assets/tracin.glb'

export function TracinModel() {
  const gltf = useGLTF(tracinModel)
  return <primitive object={gltf.scene} scale={0.001} position={[0, 1.0, 0]} rotation={[0, Math.PI, 0]} />
}
