import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function LightConditionPanel() {
  const { lightCondition, setLightCondition, mocapMode } = useSimulatorStore()

  const isDarkDisabled = mocapMode === 'handsOn'

  const getLightLabel = () => {
    switch (lightCondition) {
      case 'bright': return 'Bright Light'
      case 'less': return 'Less Light'
      case 'dark': return 'Dark'
    }
  }

  return (
    <Card className="flex flex-col p-4 rounded-none border-0 border-r flex-1">
      <h3 className="text-sm font-semibold mb-4">Light Condition</h3>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setLightCondition('bright')}
            variant={lightCondition === 'bright' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
          >
            Bright
          </Button>
          <Button
            onClick={() => setLightCondition('less')}
            variant={lightCondition === 'less' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
          >
            Less
          </Button>
          <Button
            onClick={() => setLightCondition('dark')}
            variant={lightCondition === 'dark' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px] relative"
            disabled={isDarkDisabled}
          >
            Dark
            {isDarkDisabled && (
              <span className="absolute inset-0 flex items-center justify-center text-destructive font-bold text-lg">
                ✕
              </span>
            )}
          </Button>
        </div>
        <Label className="text-sm text-muted-foreground">
          {getLightLabel()}
        </Label>
      </div>
    </Card>
  )
}

