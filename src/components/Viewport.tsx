import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, useGLTF } from '@react-three/drei'
import tracinModel from '../assets/tracin.glb'
import { DoubleSide } from 'three'

function TracinModel() {
  const gltf = useGLTF(tracinModel)
  return <primitive object={gltf.scene} scale={0.001} />
}

export function Viewport() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  
  return (
    <div className="flex-1 bg-background">
      <Canvas
        camera={{
          position: [8, 6, 8],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        
        {/* Ground grid for reference */}
        <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={1}
            cellColor="#666"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#888"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
            side={DoubleSide}
          />
        
        {/* Tracin 3D Model */}
        <TracinModel />
        
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={50}
          makeDefault
        />
        
        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          renderOrder={2}
          onTarget={() => orbitControlsRef.current?.target}
          onUpdate={() => orbitControlsRef.current?.update()}
        >
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}
