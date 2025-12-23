import { useState } from 'react'
import { 
  useSimulatorStore, 
  type ZoneSettings as ZoneSettingsType, 
  WIDTH_MIN, WIDTH_MAX,
  LENGTH_MIN, LENGTH_MAX,
  HEIGHT_MIN, HEIGHT_MAX,
  DISTANCE_MIN, DISTANCE_MAX 
} from '@/store/simulator-store'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

// Dimension Slider Component
interface DimensionSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

function DimensionSlider({ label, value, onChange, min = 0, max }: DimensionSliderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toFixed(1))

  const handleBlur = () => {
    const newValue = parseFloat(inputValue)
    if (!isNaN(newValue) && newValue >= (min || 0) && newValue <= (max || 100)) {
      onChange(newValue)
    } else {
      // Invalid value, revert to current value
      setInputValue(value.toFixed(1))
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setInputValue(value.toFixed(1))
      setIsEditing(false)
    }
  }

  const handleClick = () => {
    setIsEditing(true)
    setInputValue(value.toFixed(1))
  }

  return (
    <div className="flex flex-col gap-2.5 min-w-0">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-base font-semibold text-neutral-900 flex-shrink-0">
          {label}
        </Label>
        <div className="flex items-center gap-[2px] flex-shrink-0">
          {isEditing ? (
            <div className="bg-[#F6F6F6] rounded-lg py-[3px] px-[7px]">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                min={min}
                max={max}
                step={0.1}
                className="w-16 text-[15px] font-semibold text-black text-left bg-transparent outline-none"
              />
            </div>
          ) : (
            <div 
              onClick={handleClick}
              className="bg-[#F6F6F6] rounded-lg py-[3px] px-[7px] cursor-pointer hover:bg-[#EBEBEB] transition-colors"
              title="Click to edit"
            >
              <span className="text-[15px] font-semibold text-black whitespace-nowrap">
                {value.toFixed(1)}
              </span>
            </div>
          )}
          <span className="text-[15px] font-semibold text-black">m</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between">
          <span className="text-xs font-medium text-gray-300">{min?.toFixed(1)}</span>
          <span className="text-xs font-medium text-gray-300">{max?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

export function ZoneSettingsPanel() {
  const { zoneSettings, setZoneSettings } = useSimulatorStore()

  const handleChange = (key: keyof ZoneSettingsType) => (value: number) => {
    setZoneSettings({ [key]: value })
  }

  return (
    <Card className="flex flex-col gap-[11px] lg:gap-[11px] px-4 lg:px-[69px] pt-0 lg:pt-0 pb-4 lg:pb-[33px] rounded-none border-0 border-b shadow-none bg-white">
      <div className="mb-0 flex items-baseline gap-2 lg:block lg:space-y-1">
        <h3 className="text-[13px] lg:text-[24px] font-semibold text-[#1A1A1A] tracking-tight leading-none">
          Zone Setting
        </h3>
        <p className="text-[8px] lg:text-[14px] text-[#BFBFBF] tracking-normal font-normal leading-[8px] lg:leading-tight">
          *The Distance value affects both Width and Length.
        </p>
      </div>
      
      {/* Mobile/Tablet: 2x2 Grid (always 2 columns on mobile/tablet to match spec) */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        <DimensionSlider
          label="Distance"
          value={zoneSettings.distance}
          onChange={handleChange('distance')}
          min={DISTANCE_MIN}
          max={DISTANCE_MAX}
        />
        <DimensionSlider
          label="Width"
          value={zoneSettings.width}
          onChange={handleChange('width')}
          min={WIDTH_MIN}
          max={WIDTH_MAX}
        />
        <DimensionSlider
          label="Height"
          value={zoneSettings.height}
          onChange={handleChange('height')}
          min={HEIGHT_MIN}
          max={HEIGHT_MAX}
        />
        <DimensionSlider
          label="Length"
          value={zoneSettings.length}
          onChange={handleChange('length')}
          min={LENGTH_MIN}
          max={LENGTH_MAX}
        />
      </div>
      
      {/* Desktop: 1 + 3 layout */}
      <div className="hidden lg:grid grid-cols-2 gap-x-8 items-start">
        <div className="flex flex-col">
          <DimensionSlider
            label="Distance"
            value={zoneSettings.distance}
            onChange={handleChange('distance')}
            min={DISTANCE_MIN}
            max={DISTANCE_MAX}
          />
        </div>
        
        <div className="flex flex-col gap-[22px]">
          <DimensionSlider
            label="Width"
            value={zoneSettings.width}
            onChange={handleChange('width')}
            min={WIDTH_MIN}
            max={WIDTH_MAX}
          />
          <DimensionSlider
            label="Length"
            value={zoneSettings.length}
            onChange={handleChange('length')}
            min={LENGTH_MIN}
            max={LENGTH_MAX}
          />
          <DimensionSlider
            label="Height"
            value={zoneSettings.height}
            onChange={handleChange('height')}
            min={HEIGHT_MIN}
            max={HEIGHT_MAX}
          />
        </div>
      </div>
    </Card>
  )
}

