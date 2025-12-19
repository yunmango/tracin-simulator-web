import { ZoneSettingsPanel } from './ZoneSettingsPanel'
import { InstallationHeightPanel } from './InstallationHeightPanel'
import { MocapModePanel } from './MocapModePanel'
import { LightConditionPanel } from './LightConditionPanel'
import { X } from 'lucide-react'

interface ControlPanelProps {
  isOpen?: boolean
  onClose?: () => void
  onOpen?: () => void
}

// Main Control Panel Component
export function ControlPanel({ isOpen = true, onClose, onOpen }: ControlPanelProps) {
  return (
    <>
      {/* Desktop: Always visible, Mobile/Tablet: Show when open */}
      <div className={`${isOpen ? 'flex' : 'hidden xl:flex'} flex-col w-full xl:flex-[554] xl:min-w-0 h-[45vh] xl:h-full xl:border-l bg-white overflow-y-auto`}>
        <div className="px-4 xl:px-[69px] pt-6 pb-4 bg-white relative">
          <h1 className="text-[24px] xl:text-3xl font-semibold text-[#1A1A1A] tracking-tight leading-tight">Visualization</h1>
          {/* Mobile/Tablet close button */}
          <button
            onClick={onClose}
            className="xl:hidden absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="flex flex-col">
          <ZoneSettingsPanel />
          
          {/* Desktop: Stacked vertically */}
          <div className="hidden xl:flex xl:flex-col">
            <InstallationHeightPanel />
            <LightConditionPanel />
            <MocapModePanel />
          </div>
          
          {/* Mobile/Tablet: 2-column layout (Installation Height | Mocap Mode), LightCondition aligned to left column */}
          <div className="grid grid-cols-2 xl:hidden min-w-0 px-4 gap-x-3 gap-y-1">
            <div className="min-w-0">
              <InstallationHeightPanel className="px-0" />
            </div>
            <div className="min-w-0">
              <MocapModePanel className="px-0" />
            </div>
            <div className="min-w-0 col-start-1">
              <LightConditionPanel className="px-0" />
            </div>
            <div className="hidden" />
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet: Show button when closed */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="xl:hidden fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50"
        >
          Open Settings
        </button>
      )}
    </>
  )
}
