import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line, Text } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useSimulatorStore } from '@/store/simulator-store'

// Logo brand color - movin yellow
const BRAND_COLOR = '#DCFF00'

// ============================================
// Zone Visualization (Wireframe Box)
// ============================================

export function ZoneVisualization() {
  const { zoneSettings, isZoneLabelsPinned, setZoneLabelsPinned } = useSimulatorStore()
  const { width, length, height, distance } = zoneSettings
  const pointerDragRef = useRef({ x: 0, y: 0, isDown: false, didDrag: false, startedInside: false })
  
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
    <group
      onPointerDown={(e) => {
        pointerDragRef.current = {
          x: e.clientX,
          y: e.clientY,
          isDown: true,
          didDrag: false,
          startedInside: true,
        }
      }}
      onPointerMove={(e) => {
        if (!pointerDragRef.current.isDown) return
        const dx = e.clientX - pointerDragRef.current.x
        const dy = e.clientY - pointerDragRef.current.y
        const distSq = dx * dx + dy * dy
        if (distSq > 9) {
          pointerDragRef.current.didDrag = true // >3px 이동 시 드래그로 간주
        }
      }}
      onPointerUp={(e) => {
        const state = pointerDragRef.current
        pointerDragRef.current = { x: 0, y: 0, isDown: false, didDrag: false, startedInside: false }

        // 존 바깥에서 시작한 드래그/클릭이면 무시
        if (!state.startedInside) return

        // 드래그로 판정되면 아무 동작 없음
        if (state.didDrag) return

        // Prevent Canvas onPointerMissed from treating this as a miss
        e.stopPropagation()

        setZoneLabelsPinned(!isZoneLabelsPinned)
      }}
      onPointerCancel={() => {
        pointerDragRef.current = { x: 0, y: 0, isDown: false, didDrag: false, startedInside: false }
      }}
    >
      {/* Floor plane - semi-transparent */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[centerX, 0.02, centerZ]}
        userData={{ zoneHit: true }}
      >
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial 
          color={BRAND_COLOR} 
          transparent 
          opacity={0.12} 
          side={DoubleSide}
          depthWrite={false}
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

// Arrow head component for dimension visualization - simple chevron shape
// Points upward (^) by default along Y-axis to match cone geometry behavior
function ArrowHead({ position, rotation, opacity }: { position: [number, number, number]; rotation: [number, number, number]; opacity: number }) {
  const size = 0.1
  // Create ^ chevron pointing up along Y-axis
  const leftPoint: [number, number, number] = [-size/2, -size/2, 0]
  const tipPoint: [number, number, number] = [0, size/2, 0]
  const rightPoint: [number, number, number] = [size/2, -size/2, 0]
  
  return (
    <group position={position} rotation={rotation}>
      {/* Left line of chevron */}
      <Line
        points={[leftPoint, tipPoint]}
        color={BRAND_COLOR}
        lineWidth={4}
        transparent
        opacity={opacity}
      />
      {/* Right line of chevron */}
      <Line
        points={[tipPoint, rightPoint]}
        color={BRAND_COLOR}
        lineWidth={4}
        transparent
        opacity={opacity}
      />
    </group>
  )
}

// Width change effect - horizontal arrows on XZ plane (beside wireframe at back edge)
function WidthChangeEffect({
  width,
  isVisible,
  opacity,
  zoneCenter,
  halfLength,
  showText = true,
}: {
  width: number
  isVisible: boolean
  opacity: number
  zoneCenter: number
  halfLength: number
  showText?: boolean
}) {
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
        lineWidth={3}
        transparent
        opacity={opacity}
      />
      {/* Left arrow - flat on XZ plane, pointing left (-X) */}
      <ArrowHead position={[halfWidth, y, z]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} opacity={opacity} />
      {/* Right arrow - flat on XZ plane, pointing right (+X) */}
      <ArrowHead position={[-halfWidth, y, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} opacity={opacity} />
      {/* Width value text */}
      {showText && (
        <DimensionBadge position={[0, 0.18, z + 0.55]} text={`${width.toFixed(1)}m`} opacity={opacity} />
      )}
    </group>
  )
}

// Length change effect - depth arrows on XZ plane (beside wireframe)
function LengthChangeEffect({
  length,
  isVisible,
  opacity,
  distance,
  width,
  showText = true,
}: {
  length: number
  isVisible: boolean
  opacity: number
  distance: number
  width: number
  showText?: boolean
}) {
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
        lineWidth={3}
        transparent
        opacity={opacity}
      />
      {/* Front arrow (toward Tracin) */}
      <ArrowHead position={[x, y, startZ]} rotation={[Math.PI / 2, 0, 0]} opacity={opacity} />
      {/* Back arrow (away from Tracin) */}
      <ArrowHead position={[x, y, endZ]} rotation={[-Math.PI / 2, 0, 0]} opacity={opacity} />
      {/* Length value text */}
      {showText && (
        <DimensionBadge position={[x + 0.55, 0.18, centerZ]} text={`${length.toFixed(1)}m`} opacity={opacity} />
      )}
    </group>
  )
}

// Height change effect - vertical arrows (beside wireframe at corner)
function HeightChangeEffect({
  height,
  isVisible,
  opacity,
  zoneCenter,
  halfWidth,
  halfLength,
  showText = true,
}: {
  height: number
  isVisible: boolean
  opacity: number
  zoneCenter: number
  halfWidth: number
  halfLength: number
  showText?: boolean
}) {
  if (!isVisible) return null
  
  // Position at the back-right corner of zone (outside wireframe)
  const x = halfWidth + 0.2
  const z = zoneCenter + halfLength
  
  return (
    <group>
      {/* Vertical line */}
      <Line
        points={[[x, 0, z], [x, height, z]]}
        color={BRAND_COLOR}
        lineWidth={3}
        transparent
        opacity={opacity}
      />
      {/* Bottom arrow */}
      <ArrowHead position={[x, 0.05, z]} rotation={[Math.PI, 0, 0]} opacity={opacity} />
      {/* Top arrow */}
      <ArrowHead position={[x, height, z]} rotation={[0, 0, 0]} opacity={opacity} />
      {/* Height value text */}
      {showText && (
        <DimensionBadge position={[x + 0.55, height / 2, z]} text={`${height.toFixed(1)}m`} opacity={opacity} />
      )}
    </group>
  )
}

// Distance change effect - a glowing line on the floor (XZ plane)
function DistanceChangeEffect({
  distance,
  isVisible,
  opacity,
  showText = true,
}: {
  distance: number
  isVisible: boolean
  opacity: number
  showText?: boolean
}) {
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
      {showText && (
        <DimensionBadge position={[0.3, 0.18, -distance / 2]} text={`${distance.toFixed(1)}m`} opacity={opacity} />
      )}
    </group>
  )
}

function DimensionBadge({
  position,
  text,
  opacity = 1,
}: {
  position: [number, number, number]
  text: string
  opacity?: number
}) {
  return (
    <Html position={position} center distanceFactor={10} occlude={false} transform={false}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 10px',
          borderRadius: 9999,
          border: `2px solid ${BRAND_COLOR}`,
          background: 'rgba(0, 0, 0, 0.55)',
          color: BRAND_COLOR,
          fontWeight: 600,
          // 모바일에서 크기 과도 문제: 뷰포트 기반으로 축소 가능하게 clamp 사용
          fontSize: 'clamp(10px, 2.8vw, 14px)',
          lineHeight: 'clamp(10px, 2.8vw, 14px)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          opacity,
        }}
      >
        {text}
      </div>
    </Html>
  )
}

function PinnedZoneDimensionLabels() {
  const { zoneSettings, isZoneLabelsPinned } = useSimulatorStore()
  const { width, length, height, distance } = zoneSettings

  const positions = useMemo(() => {
    const centerZ = -distance
    const halfWidth = width / 2
    const halfLength = length / 2

    // Match existing effect geometry placements, but lift labels slightly for readability
    const widthLabelPos: [number, number, number] = [0, 0.18, centerZ + halfLength + 0.55]
    const lengthLabelPos: [number, number, number] = [halfWidth + 0.55, 0.18, centerZ]
    const heightLabelPos: [number, number, number] = [halfWidth + 0.55, height / 2, centerZ + halfLength]
    const distanceLabelPos: [number, number, number] = [0.3, 0.18, -distance / 2]

    return { centerZ, halfWidth, halfLength, widthLabelPos, lengthLabelPos, heightLabelPos, distanceLabelPos }
  }, [width, length, height, distance])

  if (!isZoneLabelsPinned) return null

  return (
    <group>
      {/* Use same arrow/line visuals as effects, but always visible */}
      <DistanceChangeEffect distance={distance} isVisible={true} opacity={1} showText={false} />
      <WidthChangeEffect
        width={width}
        isVisible={true}
        opacity={1}
        zoneCenter={positions.centerZ}
        halfLength={positions.halfLength}
        showText={false}
      />
      <LengthChangeEffect length={length} isVisible={true} opacity={1} distance={distance} width={width} showText={false} />
      <HeightChangeEffect
        height={height}
        isVisible={true}
        opacity={1}
        zoneCenter={positions.centerZ}
        halfWidth={positions.halfWidth}
        halfLength={positions.halfLength}
        showText={false}
      />

      {/* Badge-style labels (IKEA-like) */}
      <DimensionBadge position={positions.distanceLabelPos} text={`${distance.toFixed(1)}m`} />
      <DimensionBadge position={positions.widthLabelPos} text={`${width.toFixed(1)}m`} />
      <DimensionBadge position={positions.lengthLabelPos} text={`${length.toFixed(1)}m`} />
      <DimensionBadge position={positions.heightLabelPos} text={`${height.toFixed(1)}m`} />
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
// Font Preloader
// ============================================

// Preload the default font used by Text component to prevent first-render blink
function FontPreloader() {
  return (
    <Text
      position={[0, -1000, 0]}
      fontSize={0.01}
      fillOpacity={0}
    >
      {' '}
    </Text>
  )
}

// ============================================
// Combined Zone Component
// ============================================

// Main Zone component that includes visualization and all dimension effects
export function Zone() {
  const { isZoneLabelsPinned } = useSimulatorStore()

  return (
    <>
      {/* Preload font to prevent first-render blink */}
      <FontPreloader />
      
      {/* Zone Visualization */}
      <ZoneVisualization />

      {/* Click-to-pin dimension labels (keeps existing slider-change effects) */}
      <PinnedZoneDimensionLabels />
      
      {/* Zone dimension change visual effects */}
      {!isZoneLabelsPinned && (
        <>
          <DistanceEffectController />
          <WidthEffectController />
          <LengthEffectController />
          <HeightEffectController />
        </>
      )}
    </>
  )
}
