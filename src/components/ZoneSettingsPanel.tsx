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
  return (
    <div className="flex flex-col gap-2.5 min-w-0">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-neutral-900">
          {label}
        </Label>
        <span className="text-base font-medium text-neutral-900">{value.toFixed(1)} m</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-gray-300">{min?.toFixed(1)}</span>
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={0.1}
          className="flex-1"
        />
        <span className="text-xs text-gray-300">{max?.toFixed(1)}</span>
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
    <Card className="flex flex-col gap-[4px] md:gap-6 px-4 md:px-[69px] pt-0 pb-4 rounded-none border-0 border-b shadow-none bg-white">
      <div className="mb-0 flex items-baseline gap-2 md:block md:space-y-1">
        <h3 className="text-[13px] md:text-xl font-semibold text-[#1A1A1A] tracking-tight leading-none">
          Zone Setting
        </h3>
        <p className="text-[8px] md:text-xs text-[#BFBFBF] tracking-normal font-normal leading-[8px] md:leading-tight">
          *The Distance value affects both Width and Length.
        </p>
      </div>
      
      {/* Mobile: 2x2 Grid (always 2 columns on mobile to match spec) */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
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
      <div className="hidden md:grid grid-cols-2 gap-x-8 items-start">
        <div className="flex flex-col">
          <DimensionSlider
            label="Distance"
            value={zoneSettings.distance}
            onChange={handleChange('distance')}
            min={DISTANCE_MIN}
            max={DISTANCE_MAX}
          />
        </div>
        
        <div className="flex flex-col gap-5">
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

