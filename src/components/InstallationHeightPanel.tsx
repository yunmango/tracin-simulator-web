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
    <Card className={cn("flex flex-col gap-[4px] md:gap-6 min-w-0 px-4 md:px-[69px] pt-4 pb-4 rounded-none border-0 border-b shadow-none bg-white md:flex-1", className)}>
      <div className="mb-0 space-y-[4px] md:space-y-1">
        <h3 className="text-[13px] md:text-xl font-semibold text-[#1A1A1A] tracking-tight leading-none whitespace-normal">Installation Height</h3>
        <Label className="text-[8px] md:text-xs text-[#BFBFBF] tracking-normal font-normal leading-[8px] md:leading-tight">
          {installationHeight === 'tripod' ? 'On Tripod' : 'On Ceiling'}
        </Label>
      </div>
      <div className="flex w-full gap-0 md:gap-2 rounded-[16px] md:rounded-none overflow-hidden md:overflow-visible bg-[#f0f0f0] md:bg-transparent border border-[#e2e2e2] md:border-0 divide-x divide-[#e2e2e2] md:divide-x-0">
        <Button
          onClick={() => setInstallationHeight('tripod')}
          variant={installationHeight === 'tripod' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            installationHeight === 'tripod'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
        >
          <img src={tripodIcon} alt="Tripod" className="w-5 h-5 pt-0.5" />
          Tripod
        </Button>
        <Button
          onClick={() => setInstallationHeight('ceiling')}
          variant={installationHeight === 'ceiling' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            installationHeight === 'ceiling'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
        >
          <img src={ceilingIcon} alt="Ceiling" className="w-5 h-5 pt-0.5" />
          Ceiling
        </Button>
      </div>
    </Card>
  )
}

