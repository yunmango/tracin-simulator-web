import { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Loader } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'
import { TracinModel } from './TracinModel'
import { TrussModel } from './TrussModel'
import { MichelleModel } from './MichelleModel'
import { MountModel } from './MountModel'
import { TripodModel } from './TripodModel'
import { FadeGroup } from './FadeGroup'
import { Zone } from './Zone'
import { SceneLighting, lightSettings } from './SceneLighting'
import { CameraController } from './CameraController'
// import { CameraPositionDisplay } from './CameraPositionDisplay'

export function Viewport() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  const { lightCondition, mocapMode, zoneSettings, installationHeight } = useSimulatorStore()
  const settings = lightSettings[lightCondition]
  const isTripodMode = installationHeight === 'tripod'
  const isCeilingMode = installationHeight === 'ceiling'
  
  return (
    <div className="flex-1 min-h-0 bg-background relative">
      <Canvas
        camera={{
          position: [8, 6, 6],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={[settings.background]} />
        <SceneLighting lightCondition={lightCondition} />
        
        <Suspense fallback={null}>
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
          
          {/* Tripod Mode Group - Tracin on Tripod */}
          <FadeGroup visible={isTripodMode}>
            <TracinModel position={[-0.02, 1.0, -0.1]} rotation={[0, Math.PI, 0]} scale={0.0015} />
            <TripodModel position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]} scale={0.8} />
          </FadeGroup>
          
          {/* Ceiling Mode Group - Tracin on Mount with Truss */}
          <FadeGroup visible={isCeilingMode}>
            <TracinModel position={[-0.02, 1.65, -0.2]} rotation={[-Math.PI / 6, Math.PI, 0]} scale={0.0015} />
            <MountModel position={[-0.18, 2.4, 0.55]} rotation={[0, Math.PI / 2, -Math.PI / 1.8]} scale={3} />
            <TrussModel position={[0.0, 1.55, -3.5]} rotation={[0, 0, 0]} scale={1} color="#777777" />
          </FadeGroup>
          
          {/* Zone (includes visualization and dimension effects) */}
          <Zone />
          
          {/* Michelle Character Model (A-Pose) */}
          <MichelleModel />
          
          {/* Camera controller for zoom animations */}
          <CameraController 
            mocapMode={mocapMode} 
            michelleDistance={zoneSettings.distance}
            orbitControlsRef={orbitControlsRef}
          />
        </Suspense>
        
        {/* Temporary camera position display */}
        {/* <CameraPositionDisplay /> */}
        
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0.01}
          maxPolarAngle={Math.PI - 0.01}
          makeDefault
        />
        
        <GizmoHelper
          alignment="bottom-right"
          margin={[100, 100]}
          renderOrder={2}
          onTarget={() => orbitControlsRef.current?.target}
          onUpdate={() => orbitControlsRef.current?.update()}
        >
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
        </GizmoHelper>
      </Canvas>

      <Loader 
        containerStyles={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      />
    </div>
  )
}
