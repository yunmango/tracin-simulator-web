import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'
import type { _ } from 'node_modules/tailwindcss/dist/colors-b_6i0Oi7'

// Logo brand color - movin yellow
const BRAND_COLOR = '#DCFF00'

// ============================================
// Zone Visualization (Wireframe Box)
// ============================================

export function ZoneVisualization() {
  const { zoneSettings } = useSimulatorStore()
  const { width, length, height, distance } = zoneSettings
  
  // Zone center at Michelle's position
  const centerX = 0
  const centerZ = -distance
  
  // Half dimensions for easier calculation
  const halfWidth = width / 2
  const halfLength = length / 2
  
  // Calculate 8 corners of the zone box
  // Bottom corners (y = 0)
  const b1: [number, number, number] = [centerX - halfWidth, 0.02, centerZ - halfLength] // back-left
  const b2: [number, number, number] = [centerX + halfWidth, 0.02, centerZ - halfLength] // back-right
  const b3: [number, number, number] = [centerX + halfWidth, 0.02, centerZ + halfLength] // front-right
  const b4: [number, number, number] = [centerX - halfWidth, 0.02, centerZ + halfLength] // front-left
  
  // Top corners (y = height)
  const t1: [number, number, number] = [centerX - halfWidth, height, centerZ - halfLength] // back-left
  const t2: [number, number, number] = [centerX + halfWidth, height, centerZ - halfLength] // back-right
  const t3: [number, number, number] = [centerX + halfWidth, height, centerZ + halfLength] // front-right
  const t4: [number, number, number] = [centerX - halfWidth, height, centerZ + halfLength] // front-left
  
  // Floor boundary as a single continuous line
  const floorBoundary: [number, number, number][] = [b1, b2, b3, b4, b1]
  
  // Top boundary as a single continuous line
  const topBoundary: [number, number, number][] = [t1, t2, t3, t4, t1]
  
  return (
    <group>
      {/* Floor plane - semi-transparent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0.02, centerZ]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial 
          color={BRAND_COLOR} 
          transparent 
          opacity={0.12} 
          side={DoubleSide}
        />
      </mesh>
      
      {/* Floor boundary line */}
      <Line
        points={floorBoundary}
        color={BRAND_COLOR}
        lineWidth={2}
        transparent
        opacity={0.8}
      />
      
      {/* Top boundary line */}
      <Line
        points={topBoundary}
        color={BRAND_COLOR}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      
      {/* 4 vertical corner posts */}
      <Line points={[b1, t1]} color={BRAND_COLOR} lineWidth={2} transparent opacity={0.6} />
      <Line points={[b2, t2]} color={BRAND_COLOR} lineWidth={2} transparent opacity={0.6} />
      <Line points={[b3, t3]} color={BRAND_COLOR} lineWidth={2} transparent opacity={0.6} />
      <Line points={[b4, t4]} color={BRAND_COLOR} lineWidth={2} transparent opacity={0.6} />
    </group>
  )
}

// ============================================
// Dimension Change Effects
// ============================================

// Arrow head component for dimension visualization
function ArrowHead({ position, rotation, opacity }: { position: [number, number, number]; rotation: [number, number, number]; opacity: number }) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.15, 0.35, 8]} />
      <meshBasicMaterial color={BRAND_COLOR} transparent opacity={opacity} />
    </mesh>
  )
}

// Width change effect - horizontal arrows on XZ plane (beside wireframe at back edge)
function WidthChangeEffect({ width, isVisible, opacity, zoneCenter, halfLength }: { width: number; isVisible: boolean; opacity: number; zoneCenter: number; halfLength: number }) {
  if (!isVisible) return null
  
  const y = 0.05
  // Position at the front edge of zone (outside wireframe)
  const z = zoneCenter + halfLength + 0.2
  const halfWidth = width / 2
  
  return (
    <group>
      {/* Center line */}
      <Line
        points={[[-halfWidth, y, z], [halfWidth, y, z]]}
        color={BRAND_COLOR}
        lineWidth={5}
        transparent
        opacity={opacity}
      />
      {/* Left arrow */}
      <ArrowHead position={[-halfWidth, y, z]} rotation={[0, 0, Math.PI / 2]} opacity={opacity} />
      {/* Right arrow */}
      <ArrowHead position={[halfWidth, y, z]} rotation={[0, 0, -Math.PI / 2]} opacity={opacity} />
      {/* Width value text */}
      <Text
        position={[0, 0.05, z + 0.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color={BRAND_COLOR}
        anchorX="center"
        anchorY="middle"
        fillOpacity={opacity}
      >
        {width.toFixed(1)} m
      </Text>
    </group>
  )
}

// Length change effect - depth arrows on XZ plane (beside wireframe)
function LengthChangeEffect({ length, isVisible, opacity, distance, width }: { length: number; isVisible: boolean; opacity: number; distance: number; width: number }) {
  if (!isVisible) return null
  
  const y = 0.05
  const halfLength = length / 2
  const halfWidth = width / 2
  
  // Zone center is at -distance (Michelle's position)
  const centerZ = -distance
  const startZ = centerZ + halfLength  // Front edge of zone
  const endZ = centerZ - halfLength    // Back edge of zone
  
  // Position beside the wireframe (right edge + small offset)
  const x = halfWidth + 0.2
  
  return (
    <group>
      {/* Center line */}
      <Line
        points={[[x, y, startZ], [x, y, endZ]]}
        color={BRAND_COLOR}
        lineWidth={5}
        transparent
        opacity={opacity}
      />
      {/* Front arrow (toward Tracin) */}
      <ArrowHead position={[x, y, startZ]} rotation={[Math.PI / 2, 0, 0]} opacity={opacity} />
      {/* Back arrow (away from Tracin) */}
      <ArrowHead position={[x, y, endZ]} rotation={[-Math.PI / 2, 0, 0]} opacity={opacity} />
      {/* Length value text */}
      <Text
        position={[x + 0.6, 0.05, centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color={BRAND_COLOR}
        anchorX="left"
        anchorY="middle"
        fillOpacity={opacity}
      >
        {length.toFixed(1)} m
      </Text>
    </group>
  )
}

// Height change effect - vertical arrows (beside wireframe at corner)
function HeightChangeEffect({ height, isVisible, opacity, zoneCenter, halfWidth, halfLength }: { height: number; isVisible: boolean; opacity: number; zoneCenter: number; halfWidth: number; halfLength: number }) {
  if (!isVisible) return null
  
  // Position at the back-right corner of zone (outside wireframe)
  const x = halfWidth + 0.1
  const z = zoneCenter - halfLength - 0.1
  
  return (
    <group>
      {/* Vertical line */}
      <Line
        points={[[x, 0, z], [x, height, z]]}
        color={BRAND_COLOR}
        lineWidth={5}
        transparent
        opacity={opacity}
      />
      {/* Bottom arrow */}
      <ArrowHead position={[x, 0.15, z]} rotation={[Math.PI, 0, 0]} opacity={opacity} />
      {/* Top arrow */}
      <ArrowHead position={[x, height, z]} rotation={[0, 0, 0]} opacity={opacity} />
      {/* Height value text */}
      <Text
        position={[x + 0.1, height / 2, z]}
        rotation={[0, 0, 0]}
        fontSize={0.2}
        color={BRAND_COLOR}
        anchorX="left"
        anchorY="middle"
        fillOpacity={opacity}
      >
        {height.toFixed(1)} m
      </Text>
    </group>
  )
}

// Distance change effect - a glowing line on the floor (XZ plane)
function DistanceChangeEffect({ distance, isVisible, opacity }: { distance: number; isVisible: boolean; opacity: number }) {
  if (!isVisible) return null
  
  // Line on floor (y = 0.01 to be slightly above grid)
  const startPos: [number, number, number] = [0, 0.05, 0]
  const endPos: [number, number, number] = [0, 0.05, -distance]
  
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
        position={[0.3, 0.05, -distance / 2]}
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

// ============================================
// Effect Controllers (with fade animation)
// ============================================

// Generic effect controller hook for fade animation
function useEffectFade(currentValue: number) {
  const [effectState, setEffectState] = useState({ isVisible: false, opacity: 1 })
  const prevValueRef = useRef(currentValue)
  const fadeStartTime = useRef<number | null>(null)
  
  useFrame(() => {
    // Detect value changes
    if (prevValueRef.current !== currentValue) {
      setEffectState({ isVisible: true, opacity: 1 })
      fadeStartTime.current = Date.now()
      prevValueRef.current = currentValue
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
  
  return effectState
}

// Wrapper component to handle the fade animation for distance
export function DistanceEffectController() {
  const { zoneSettings } = useSimulatorStore()
  const effectState = useEffectFade(zoneSettings.distance)
  
  return (
    <DistanceChangeEffect 
      distance={zoneSettings.distance} 
      isVisible={effectState.isVisible} 
      opacity={effectState.opacity} 
    />
  )
}

// Wrapper component for width effect
export function WidthEffectController() {
  const { zoneSettings } = useSimulatorStore()
  const effectState = useEffectFade(zoneSettings.width)
  const zoneCenter = -zoneSettings.distance // Zone center is at Michelle's position
  const halfLength = zoneSettings.length / 2
  
  return (
    <WidthChangeEffect 
      width={zoneSettings.width} 
      isVisible={effectState.isVisible} 
      opacity={effectState.opacity}
      zoneCenter={zoneCenter}
      halfLength={halfLength}
    />
  )
}

// Wrapper component for length effect
export function LengthEffectController() {
  const { zoneSettings } = useSimulatorStore()
  const effectState = useEffectFade(zoneSettings.length)
  
  return (
    <LengthChangeEffect 
      length={zoneSettings.length} 
      isVisible={effectState.isVisible} 
      opacity={effectState.opacity}
      distance={zoneSettings.distance}
      width={zoneSettings.width}
    />
  )
}

// Wrapper component for height effect
export function HeightEffectController() {
  const { zoneSettings } = useSimulatorStore()
  const effectState = useEffectFade(zoneSettings.height)
  const zoneCenter = -zoneSettings.distance // Zone center is at Michelle's position
  const halfWidth = zoneSettings.width / 2
  const halfLength = zoneSettings.length / 2
  
  return (
    <HeightChangeEffect 
      height={zoneSettings.height} 
      isVisible={effectState.isVisible} 
      opacity={effectState.opacity}
      zoneCenter={zoneCenter}
      halfWidth={halfWidth}
      halfLength={halfLength}
    />
  )
}

// ============================================
// Combined Zone Component
// ============================================

// Main Zone component that includes visualization and all dimension effects
export function Zone() {
  return (
    <>
      {/* Zone Visualization */}
      <ZoneVisualization />
      
      {/* Zone dimension change visual effects */}
      <DistanceEffectController />
      <WidthEffectController />
      <LengthEffectController />
      <HeightEffectController />
    </>
  )
}
