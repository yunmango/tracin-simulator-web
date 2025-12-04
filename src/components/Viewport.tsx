import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, useGLTF, useFBX, Line, Text } from '@react-three/drei'
import tracinModel from '../assets/tracin.glb'
import michelleModel from '../assets/Michelle.fbx'
import { DoubleSide } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'

function TracinModel() {
  const gltf = useGLTF(tracinModel)
  return <primitive object={gltf.scene} scale={0.001} position={[0, 1.0, 0]} rotation={[0, Math.PI, 0]} />
}

function MichelleModel() {
  const fbx = useFBX(michelleModel)
  const { zoneSettings } = useSimulatorStore()
  // FBX models are often in centimeters, scale down to meters
  // Position Michelle at distance from Tracin (which is at 0, 1.0, 0)
  // Michelle moves along the Z-axis based on distance setting
  return <primitive object={fbx} scale={0.01} position={[0, 0, -zoneSettings.distance]} />
}

import type { LightCondition } from '@/store/simulator-store'

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
        color="#00ffff"
        lineWidth={3}
        transparent
        opacity={opacity}
      />
      {/* Glowing effect - wider line behind */}
      <Line
        points={[startPos, endPos]}
        color="#00ffff"
        lineWidth={8}
        transparent
        opacity={opacity * 0.3}
      />
      {/* Distance indicator rings at both ends - flat on floor */}
      <mesh position={startPos} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={opacity} side={DoubleSide} />
      </mesh>
      <mesh position={endPos} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={opacity} side={DoubleSide} />
      </mesh>
      {/* Distance value text - positioned at midpoint of line, flat on floor */}
      <Text
        position={[0.3, 0.01, -distance / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#00ffff"
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

export function Viewport() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  const { lightCondition } = useSimulatorStore()
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
