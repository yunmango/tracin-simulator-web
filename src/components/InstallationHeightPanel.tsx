import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import tripodIcon from '@/assets/tripod.svg'
import ceilingIcon from '@/assets/ceiling.svg'

export function InstallationHeightPanel({ className }: { className?: string }) {
  const { installationHeight, setInstallationHeight } = useSimulatorStore()

  return (
    <Card className={cn("flex flex-col gap-[4px] xl:gap-6 min-w-0 px-4 xl:px-[69px] pt-4 pb-4 rounded-none border-0 border-b shadow-none bg-white xl:flex-1", className)}>
      <div className="mb-0 space-y-[4px] xl:space-y-1">
        <h3 className="text-[13px] xl:text-xl font-semibold text-[#1A1A1A] tracking-tight leading-none whitespace-normal">Installation Height</h3>
        <Label className="text-[8px] xl:text-xs text-[#BFBFBF] tracking-normal font-normal leading-[8px] xl:leading-tight">
          {installationHeight === 'tripod' ? 'On Tripod' : 'On Ceiling'}
        </Label>
      </div>
      <div className="flex w-full gap-0 xl:gap-2 rounded-[16px] xl:rounded-none overflow-hidden xl:overflow-visible bg-[#f0f0f0] xl:bg-transparent border border-[#e2e2e2] xl:border-0 divide-x divide-[#e2e2e2] xl:divide-x-0">
        <Button
          onClick={() => setInstallationHeight('tripod')}
          variant={installationHeight === 'tripod' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] xl:text-[15px] leading-none rounded-none xl:rounded-[16px] border-0",
            installationHeight === 'tripod'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] xl:bg-[#f0f0f0] xl:hover:bg-[#e8e8e8] xl:border xl:border-[#e2e2e2] xl:rounded-[16px]"
          )}
        >
          <img src={tripodIcon} alt="Tripod" className="w-5 h-5 pt-0.5" />
          Tripod
        </Button>
        <Button
          onClick={() => setInstallationHeight('ceiling')}
          variant={installationHeight === 'ceiling' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] xl:text-[15px] leading-none rounded-none xl:rounded-[16px] border-0",
            installationHeight === 'ceiling'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] xl:bg-[#f0f0f0] xl:hover:bg-[#e8e8e8] xl:border xl:border-[#e2e2e2] xl:rounded-[16px]"
          )}
        >
          <img src={ceilingIcon} alt="Ceiling" className="w-5 h-5 pt-0.5" />
          Ceiling
        </Button>
      </div>
    </Card>
  )
}

