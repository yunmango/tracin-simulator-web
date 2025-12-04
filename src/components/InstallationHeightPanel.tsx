import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function InstallationHeightPanel() {
  const { installationHeight, setInstallationHeight } = useSimulatorStore()

  return (
    <Card className="flex flex-col p-4 rounded-none border-0 border-r flex-1">
      <h3 className="text-sm font-semibold mb-4">Installation Height</h3>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setInstallationHeight('tripod')}
            variant={installationHeight === 'tripod' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[90px]"
          >
            Tripod
          </Button>
          <Button
            onClick={() => setInstallationHeight('ceiling')}
            variant={installationHeight === 'ceiling' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[90px]"
          >
            Ceiling
          </Button>
        </div>
        <Label className="text-sm text-muted-foreground">
          {installationHeight === 'tripod' ? 'On Tripod' : 'On Ceiling'}
        </Label>
      </div>
    </Card>
  )
}

