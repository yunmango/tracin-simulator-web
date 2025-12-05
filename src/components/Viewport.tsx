import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, useGLTF, Line, Text } from '@react-three/drei'
import { DoubleSide, Vector3 } from 'three'
import { useSimulatorStore, type LightCondition, type MocapMode } from '@/store/simulator-store'
import { MichelleModel } from './MichelleModel'
import tracinModel from '../assets/tracin.glb'

function TracinModel() {
  const gltf = useGLTF(tracinModel)
  return <primitive object={gltf.scene} scale={0.001} position={[0, 1.0, 0]} rotation={[0, Math.PI, 0]} />
}

// Light settings for each condition
const lightSettings = {
  bright: {
    ambient: 0.5,
    mainLight: 1.2,
    fillLight: 0.5,
    background: '#1a1a1f',
  },
  less: {
    ambient: 0.15,
    mainLight: 0.3,
    fillLight: 0.1,
    background: '#0d0d10',
  },
  dark: {
    ambient: 0.02,
    mainLight: 0.0,
    fillLight: 0.0,
    background: '#050507',
  },
}

// Logo brand color - movin yellow
const BRAND_COLOR = '#DCFF00'

// Distance change effect - a glowing line on the floor (XZ plane)
function DistanceChangeEffect({ distance, isVisible, opacity }: { distance: number; isVisible: boolean; opacity: number }) {
  if (!isVisible) return null
  
  // Line on floor (y = 0.01 to be slightly above grid)
  const startPos: [number, number, number] = [0, 0.01, 0]
  const endPos: [number, number, number] = [0, 0.01, -distance]
  
  return (
    <group>
      {/* Main distance line on floor */}
      <Line
        points={[startPos, endPos]}
        color={BRAND_COLOR}
        lineWidth={5}
        transparent
        opacity={opacity}
      />
      {/* Distance indicator rings at both ends - flat on floor */}
      <mesh position={startPos} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.15, 32]} />
        <meshBasicMaterial color={BRAND_COLOR} transparent opacity={opacity} side={DoubleSide} />
      </mesh>
      <mesh position={endPos} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.45, 32]} />
        <meshBasicMaterial color={BRAND_COLOR} transparent opacity={opacity} side={DoubleSide} />
      </mesh>
      {/* Distance value text - positioned at midpoint of line, flat on floor */}
      <Text
        position={[0.3, 0.01, -distance / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color={BRAND_COLOR}
        anchorX="left"
        anchorY="middle"
        fillOpacity={opacity}
      >
        {distance.toFixed(1)}m
      </Text>
    </group>
  )
}

// Wrapper component to handle the fade animation
function DistanceEffectController() {
  const { zoneSettings } = useSimulatorStore()
  const [effectState, setEffectState] = useState({ isVisible: false, opacity: 1 })
  const prevDistanceRef = useRef(zoneSettings.distance)
  const fadeStartTime = useRef<number | null>(null)
  
  // Animate the fade out and detect distance changes
  useFrame(() => {
    // Detect distance changes
    if (prevDistanceRef.current !== zoneSettings.distance) {
      setEffectState({ isVisible: true, opacity: 1 })
      fadeStartTime.current = Date.now()
      prevDistanceRef.current = zoneSettings.distance
    }
    
    // Handle fade animation
    if (fadeStartTime.current !== null) {
      const elapsed = Date.now() - fadeStartTime.current
      const duration = 1200 // 1.2 seconds
      
      if (elapsed >= duration) {
        setEffectState({ isVisible: false, opacity: 1 })
        fadeStartTime.current = null
      } else {
        const newOpacity = 1 - (elapsed / duration)
        setEffectState(prev => ({ ...prev, opacity: newOpacity }))
      }
    }
  })
  
  return (
    <DistanceChangeEffect 
      distance={zoneSettings.distance} 
      isVisible={effectState.isVisible} 
      opacity={effectState.opacity} 
    />
  )
}

function SceneLighting({ lightCondition }: { lightCondition: LightCondition }) {
  const settings = lightSettings[lightCondition]
  
  return (
    <>
      {/* Ambient light - provides base illumination */}
      <ambientLight intensity={settings.ambient} />
      
      {/* Main directional light - simulates room lighting */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={settings.mainLight} 
      />
      
      {/* Fill light - reduces harsh shadows */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={settings.fillLight} 
      />
      
      {/* Very dim light for dark mode so scene isn't completely black */}
      {lightCondition === 'dark' && (
        <pointLight 
          position={[0, 3, 0]} 
          intensity={0.03} 
          color="#1a1a2e"
        />
      )}
    </>
  )
}

// Default camera positions (defined outside component to avoid recreating)
// const DEFAULT_CAMERA_POSITION = new Vector3(8, 6, 8)
const DEFAULT_CAMERA_POSITION = new Vector3(4, 4, 4)
const DEFAULT_TARGET = new Vector3(0, 0, -4)

// Camera controller to zoom in on Michelle when mocap mode changes
function CameraController({ 
  mocapMode, 
  michelleDistance,
  orbitControlsRef 
}: { 
  mocapMode: MocapMode
  michelleDistance: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitControlsRef: React.RefObject<any>
}) {
  const { camera } = useThree()
  const isAnimating = useRef(false)
  const animationProgress = useRef(0)
  const startPosition = useRef(new Vector3())
  const targetPosition = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const targetTarget = useRef(new Vector3())
  const prevMocapMode = useRef<MocapMode>(mocapMode)
  
  // Trigger animation when mocap mode changes
  useEffect(() => {
    if (prevMocapMode.current !== mocapMode) {
      const michellePosition = new Vector3(0, 1, -michelleDistance)
      
      if (mocapMode === 'bodyOnly' || mocapMode === 'handsOn') {
        // Zoom in to Michelle - position camera in front of her (facing her front)
        // Michelle is at [0, 0, -distance] facing toward Tracin (positive Z direction)
        // Camera positioned closer to origin (positive Z from Michelle) to see her front
        startPosition.current.copy(camera.position)
        targetPosition.current.set(0, 2.0, -michelleDistance + 5.5)
        
        if (orbitControlsRef.current) {
          startTarget.current.copy(orbitControlsRef.current.target)
        }
        targetTarget.current.copy(michellePosition)
        
        isAnimating.current = true
        animationProgress.current = 0
      } else if (mocapMode === 'setup') {
        // Zoom out to default view
        startPosition.current.copy(camera.position)
        targetPosition.current.copy(DEFAULT_CAMERA_POSITION)
        
        if (orbitControlsRef.current) {
          startTarget.current.copy(orbitControlsRef.current.target)
        }
        targetTarget.current.copy(DEFAULT_TARGET)
        
        isAnimating.current = true
        animationProgress.current = 0
      }
      
      prevMocapMode.current = mocapMode
    }
  }, [mocapMode, michelleDistance, camera, orbitControlsRef])
  
  // Animate camera position
  useFrame((_, delta) => {
    if (isAnimating.current) {
      animationProgress.current += delta * 2 // Animation speed
      
      if (animationProgress.current >= 1) {
        animationProgress.current = 1
        isAnimating.current = false
      }
      
      // Smooth easing function (ease-out cubic)
      const t = 1 - Math.pow(1 - animationProgress.current, 3)
      
      // Interpolate camera position
      camera.position.lerpVectors(startPosition.current, targetPosition.current, t)
      
      // Interpolate orbit controls target
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.lerpVectors(startTarget.current, targetTarget.current, t)
        orbitControlsRef.current.update()
      }
    }
  })
  
  return null
}

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
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
            side={DoubleSide}
          />
        
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
        
        {/* Distance change visual effect */}
        <DistanceEffectController />
        
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
