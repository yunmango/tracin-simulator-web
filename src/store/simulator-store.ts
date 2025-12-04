import { create } from 'zustand'

export interface ZoneSettings {
  width: number
  length: number
  height: number
  distance: number
}

export type InstallationHeight = 'tripod' | 'ceiling'
export type MocapMode = 'bodyOnly' | 'handsOn'
export type LightCondition = 'withLight' | 'withoutLight'

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
    distance: 1.0,
  },
  installationHeight: 'tripod',
  mocapMode: 'handsOn',
  lightCondition: 'withLight',
  
  setZoneSettings: (settings) =>
    set((state) => ({
      zoneSettings: { ...state.zoneSettings, ...settings },
    })),
  setInstallationHeight: (height) => set({ installationHeight: height }),
  setMocapMode: (mode) => set({ mocapMode: mode }),
  setLightCondition: (condition) => set({ lightCondition: condition }),
}))

