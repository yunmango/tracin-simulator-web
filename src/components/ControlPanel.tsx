import { ZoneSettingsPanel } from './ZoneSettingsPanel'
import { InstallationHeightPanel } from './InstallationHeightPanel'
import { MocapModePanel } from './MocapModePanel'
import { LightConditionPanel } from './LightConditionPanel'

// Main Control Panel Component
export function ControlPanel() {
  return (
    <div className="flex border-b bg-card w-full">
      <ZoneSettingsPanel />
      <InstallationHeightPanel />
      <MocapModePanel />
      <LightConditionPanel />
    </div>
  )
}
