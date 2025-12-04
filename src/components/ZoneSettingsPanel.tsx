import { 
  useSimulatorStore, 
  type ZoneSettings as ZoneSettingsType, 
  WIDTH_MIN, WIDTH_MAX,
  LENGTH_MIN, LENGTH_MAX,
  HEIGHT_MIN, HEIGHT_MAX,
  DISTANCE_MIN, DISTANCE_MAX 
} from '@/store/simulator-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

// Dimension Input Component
interface DimensionInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

function DimensionInput({ label, value, onChange, min = 0, max }: DimensionInputProps) {
  return (
    <div className="flex flex-col gap-2 min-w-[100px]">
      <Label htmlFor={label.toLowerCase()} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={label.toLowerCase()}
          type="number"
          value={value.toFixed(1)}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step="0.1"
          min={min}
          max={max}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">m</span>
      </div>
    </div>
  )
}

// Zone Settings Section
export function ZoneSettingsPanel() {
  const { zoneSettings, setZoneSettings } = useSimulatorStore()

  const handleChange = (key: keyof ZoneSettingsType) => (value: number) => {
    setZoneSettings({ [key]: value })
  }

  return (
    <Card className="flex flex-col p-4 rounded-none border-0 border-r flex-1">
      <h3 className="text-sm font-semibold mb-4">Mocap Zone Setting</h3>
      <div className="flex gap-4">
        <DimensionInput
          label="Width"
          value={zoneSettings.width}
          onChange={handleChange('width')}
          min={WIDTH_MIN}
          max={WIDTH_MAX}
        />
        <DimensionInput
          label="Length"
          value={zoneSettings.length}
          onChange={handleChange('length')}
          min={LENGTH_MIN}
          max={LENGTH_MAX}
        />
        <DimensionInput
          label="Height"
          value={zoneSettings.height}
          onChange={handleChange('height')}
          min={HEIGHT_MIN}
          max={HEIGHT_MAX}
        />
        <DimensionInput
          label="Distance"
          value={zoneSettings.distance}
          onChange={handleChange('distance')}
          min={DISTANCE_MIN}
          max={DISTANCE_MAX}
        />
      </div>
    </Card>
  )
}

