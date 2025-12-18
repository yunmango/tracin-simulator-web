import { type LightCondition } from '@/store/simulator-store'

// Light settings for each condition
// eslint-disable-next-line react-refresh/only-export-components
export const lightSettings = {
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

export function SceneLighting({ lightCondition }: { lightCondition: LightCondition }) {
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
