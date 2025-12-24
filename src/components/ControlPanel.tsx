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
      <div className={`${isOpen ? 'flex' : 'hidden lg:flex'} flex-col w-full min-w-0 flex-1 lg:flex-none lg:w-[554px] lg:h-full lg:border-l bg-white overflow-y-auto overflow-x-hidden`}>
        <div className="px-4 lg:px-[69px] pt-4 lg:pt-[43px] pb-4 lg:pb-[6px] bg-white relative">
          <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#1A1A1A] tracking-tight leading-tight">Visualization</h1>
          {/* Mobile/Tablet close button */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="flex flex-col">
          <ZoneSettingsPanel />
          
          {/* Desktop: Stacked vertically */}
          <div className="hidden lg:flex lg:flex-col">
            <InstallationHeightPanel />
            <LightConditionPanel />
            <MocapModePanel />
          </div>
          
          {/* Mobile/Tablet: 2-column layout (Installation Height | Mocap Mode), LightCondition aligned to left column */}
          <div className="grid grid-cols-2 lg:hidden min-w-0 px-4 gap-x-4">
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
          className="lg:hidden fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50"
        >
          Open Settings
        </button>
      )}
    </>
  )
}
