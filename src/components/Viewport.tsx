import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'
import { TracinModel } from './TracinModel'
import { MichelleModel } from './MichelleModel'
import { Zone } from './Zone'
import { SceneLighting, lightSettings } from './SceneLighting'
import { CameraController } from './CameraController'

export function Viewport() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  const { lightCondition, mocapMode, zoneSettings } = useSimulatorStore()
  const settings = lightSettings[lightCondition]
  
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
        <color attach="background" args={[settings.background]} />
        <SceneLighting lightCondition={lightCondition} />
        
        {/* Ground plane to receive spotlight */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#222228" roughness={0.9} metalness={0.1} />
        </mesh>
        
        {/* Ground grid for reference */}
        <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={1}
            cellColor="#666"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#888"
            fadeDistance={20}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
            side={DoubleSide}
          />
        
        {/* Zone (includes visualization and dimension effects) */}
        <Zone />
        
        {/* Tracin 3D Model */}
        <TracinModel />
        
        {/* Michelle Character Model (A-Pose) */}
        <MichelleModel />
        
        {/* Camera controller for zoom animations */}
        <CameraController 
          mocapMode={mocapMode} 
          michelleDistance={zoneSettings.distance}
          orbitControlsRef={orbitControlsRef}
        />
        
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
