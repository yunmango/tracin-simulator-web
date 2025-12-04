import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function MocapModePanel() {
  const { mocapMode, setMocapMode, lightCondition } = useSimulatorStore()

  const isHandsOnDisabled = lightCondition !== 'bright'

  return (
    <Card className="flex flex-col p-4 rounded-none border-0 border-r flex-1">
      <h3 className="text-sm font-semibold mb-4">Mocap Mode</h3>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setMocapMode('bodyOnly')}
            variant={mocapMode === 'bodyOnly' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[90px]"
          >
            Body Only
          </Button>
          <Button
            onClick={() => setMocapMode('handsOn')}
            variant={mocapMode === 'handsOn' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[90px] relative"
            disabled={isHandsOnDisabled}
          >
            Hands On
            {isHandsOnDisabled && (
              <span className="absolute inset-0 flex items-center justify-center text-destructive font-bold text-lg">
                ✕
              </span>
            )}
          </Button>
        </div>
        <Label className="text-sm text-muted-foreground">
          {mocapMode === 'bodyOnly' ? 'Body Only' : 'Full Body with Hands'}
        </Label>
      </div>
    </Card>
  )
}

