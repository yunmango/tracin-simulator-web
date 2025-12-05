import { create } from 'zustand'

export const WIDTH_MIN = 1.0
export const WIDTH_MAX = 5.0
export const LENGTH_MIN = 1.0
export const LENGTH_MAX = 5.0
export const HEIGHT_MIN = 2.0
export const HEIGHT_MAX = 3.0
export const DISTANCE_MIN = 1.5
export const DISTANCE_MAX = 3.5

export interface ZoneSettings {
  width: number
  length: number
  height: number
  distance: number
}

export type InstallationHeight = 'tripod' | 'ceiling'
export type MocapMode = 'setup' | 'bodyOnly' | 'handsOn'
export type LightCondition = 'bright' | 'less' | 'dark'

interface SimulatorState {
  zoneSettings: ZoneSettings
  installationHeight: InstallationHeight
  mocapMode: MocapMode
  lightCondition: LightCondition
  
  setZoneSettings: (settings: Partial<ZoneSettings>) => void
  setInstallationHeight: (height: InstallationHeight) => void
  setMocapMode: (mode: MocapMode) => void
  setLightCondition: (condition: LightCondition) => void
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  zoneSettings: {
    width: 5.0,
    length: 5.0,
    height: 3.0,
    distance: 3.5,
  },
  installationHeight: 'tripod',
  mocapMode: 'setup',
  lightCondition: 'bright',
  
  setZoneSettings: (settings) =>
    set((state) => {
      const newSettings = { ...state.zoneSettings, ...settings }
      // Clamp values to min/max bounds
      newSettings.width = Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, newSettings.width))
      newSettings.height = Math.max(HEIGHT_MIN, Math.min(HEIGHT_MAX, newSettings.height))
      newSettings.distance = Math.max(DISTANCE_MIN, Math.min(DISTANCE_MAX, newSettings.distance))
      
      // Length constraint: when distance is 1.5m, length must be 1m
      // Linear interpolation: at distance 1.5m -> length max 1m, at distance 3.5m -> length max 5m
      const maxLengthForDistance = LENGTH_MIN + ((newSettings.distance - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)) * (LENGTH_MAX - LENGTH_MIN)
      newSettings.length = Math.max(LENGTH_MIN, Math.min(maxLengthForDistance, newSettings.length))
      
      // Automatically switch to setup mode when zone settings change
      return { zoneSettings: newSettings, mocapMode: 'setup' }
    }),
  setInstallationHeight: (height) => set({ installationHeight: height }),
  setMocapMode: (mode) =>
    set((state) => {
      // If switching to handsOn while light condition is dark, also switch light to bright
      if (mode === 'handsOn' && state.lightCondition === 'dark') {
        return { mocapMode: mode, lightCondition: 'bright' }
      }
      return { mocapMode: mode }
    }),
  setLightCondition: (condition) =>
    set((state) => {
      // If switching to dark and mocap mode is handsOn, reset to setup (handsOn not available in dark)
      if (condition === 'dark' && state.mocapMode === 'handsOn') {
        return { lightCondition: condition, mocapMode: 'setup' }
      }
      return { lightCondition: condition }
    }),
}))

