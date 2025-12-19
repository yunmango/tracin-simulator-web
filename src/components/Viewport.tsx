import { useRef, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Loader, Preload } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useSimulatorStore, DEFAULT_CAMERA_POSITION, DEFAULT_TARGET } from '@/store/simulator-store'
import { TracinModel } from './TracinModel'
import { TripodModel } from './TripodModel'
import { TrussModel } from './TrussModel'
import { MichelleModel } from './MichelleModel'
import { MountModel } from './MountModel'
import { FadeGroup } from './FadeGroup'
import { Zone } from './Zone'
import { SceneLighting, lightSettings } from './SceneLighting'
import { CameraController } from './CameraController'

export function Viewport() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  const { lightCondition, mocapMode, zoneSettings, installationHeight, setZoneLabelsPinned } = useSimulatorStore()
  const settings = lightSettings[lightCondition]
  const isTripodMode = installationHeight === 'tripod'
  const isCeilingMode = installationHeight === 'ceiling'
  
  // Detect mobile devices for performance optimization
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  }, [])
  
  return (
    <div className="h-[55vh] xl:h-full xl:flex-[1366] flex-1 min-w-0 min-h-0 bg-slate-900 relative">
      <Canvas
        camera={{
          position: [DEFAULT_CAMERA_POSITION.x, DEFAULT_CAMERA_POSITION.y, DEFAULT_CAMERA_POSITION.z],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
        shadows={!isMobile}
        gl={{ 
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          antialias: !isMobile,
        }}
        onPointerMissed={(e) => {
          // Clicked on empty space: hide on click, keep visible during drag
          const delta = (e as unknown as { delta?: number }).delta ?? 0
          if (delta <= 3) setZoneLabelsPinned(false)
        }}
      >
        <color attach="background" args={[settings.background]} />
        <SceneLighting lightCondition={lightCondition} />
        
        <Suspense fallback={null}>
          <group>
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
                fadeDistance={isMobile ? 15 : 20}
                fadeStrength={1}
                followCamera={false}
                infiniteGrid={!isMobile}
                side={DoubleSide}
              />
            
            {/* Tripod Mode Group - Tracin on Tripod */}
            <FadeGroup visible={isTripodMode}>
              <TripodModel position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
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
              installationHeight={installationHeight}
              michelleDistance={zoneSettings.distance}
              orbitControlsRef={orbitControlsRef}
            />
            
            {/* Preload assets for better loading experience */}
            <Preload all />
          </group>
        </Suspense>
        
        <OrbitControls
          ref={orbitControlsRef}
          target={[DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z]}
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
