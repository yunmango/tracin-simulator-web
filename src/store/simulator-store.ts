import { create } from 'zustand'

export const WIDTH_MIN = 1.0
export const WIDTH_MAX = 5.0
export const LENGTH_MIN = 1.0
export const LENGTH_MAX = 5.0
export const HEIGHT_MIN = 2.0
export const HEIGHT_MAX = 3.0
export const DISTANCE_MIN = 2.0
export const DISTANCE_MAX = 3.5

export interface ZoneSettings {
  width: number
  length: number
  height: number
  distance: number
}

export type InstallationHeight = 'tripod' | 'ceiling'
export type MocapMode = 'bodyOnly' | 'handsOn'
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
  mocapMode: 'bodyOnly',
  lightCondition: 'bright',
  
  setZoneSettings: (settings) =>
    set((state) => {
      const newSettings = { ...state.zoneSettings, ...settings }
      // Clamp values to min/max bounds
      newSettings.width = Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, newSettings.width))
      newSettings.length = Math.max(LENGTH_MIN, Math.min(LENGTH_MAX, newSettings.length))
      newSettings.height = Math.max(HEIGHT_MIN, Math.min(HEIGHT_MAX, newSettings.height))
      newSettings.distance = Math.max(DISTANCE_MIN, Math.min(DISTANCE_MAX, newSettings.distance))
      return { zoneSettings: newSettings }
    }),
  setInstallationHeight: (height) => set({ installationHeight: height }),
  setMocapMode: (mode) => set({ mocapMode: mode }),
  setLightCondition: (condition) =>
    set((state) => {
      // If switching to dark and mocap mode is handsOn, reset to bodyOnly
      if (condition === 'dark' && state.mocapMode === 'handsOn') {
        return { lightCondition: condition, mocapMode: 'bodyOnly' }
      }
      return { lightCondition: condition }
    }),
}))

