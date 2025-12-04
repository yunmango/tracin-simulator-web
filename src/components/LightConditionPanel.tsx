import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function LightConditionPanel() {
  const { lightCondition, setLightCondition } = useSimulatorStore()

  return (
    <Card className="flex flex-col p-4 rounded-none border-0 border-r flex-1">
      <h3 className="text-sm font-semibold mb-4">Light Condition</h3>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setLightCondition('withLight')}
            variant={lightCondition === 'withLight' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[90px]"
          >
            With Light
          </Button>
          <Button
            onClick={() => setLightCondition('withoutLight')}
            variant={lightCondition === 'withoutLight' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[90px]"
          >
            Without Light
          </Button>
        </div>
        <Label className="text-sm text-muted-foreground">
          {lightCondition === 'withLight' ? 'With Light' : 'Without Light'}
        </Label>
      </div>
    </Card>
  )
}

