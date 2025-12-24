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
    <Card className={cn("flex flex-col gap-[4px] lg:gap-[10px] min-w-0 px-4 lg:px-[69px] pt-4 lg:pt-0 pb-4 lg:pb-[20px] rounded-none border-0 border-b shadow-none bg-white lg:flex-1", className)}>
      <div className="mb-0 space-y-[4px] lg:space-y-0 lg:flex lg:items-baseline lg:gap-[7px] min-w-0">
        <h3 className="text-[13px] lg:text-[22px] font-semibold text-[#1A1A1A] tracking-tight leading-none whitespace-normal lg:whitespace-nowrap flex-none">
          Installation Height
        </h3>
        <Label className="text-[8px] lg:text-[11px] text-[#BFBFBF] tracking-normal font-normal leading-[8px] lg:leading-none flex-1 min-w-0 truncate">
          {installationHeight === 'tripod' ? 'On Tripod' : 'On Ceiling'}
        </Label>
      </div>
      <div className="flex w-full gap-0 lg:gap-1 rounded-[4px] lg:rounded-none overflow-hidden lg:overflow-visible bg-[#f0f0f0] lg:bg-transparent border border-[#e2e2e2] lg:border-0 divide-x divide-[#e2e2e2] lg:divide-x-0">
        <Button
          onClick={() => setInstallationHeight('tripod')}
          variant={installationHeight === 'tripod' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            installationHeight === 'tripod'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
        >
          <img 
            src={tripodIcon} 
            alt="Tripod" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              installationHeight === 'tripod' ? "brightness-0 invert" : ""
            )} 
          />
          Tripod
        </Button>
        <Button
          onClick={() => setInstallationHeight('ceiling')}
          variant={installationHeight === 'ceiling' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            installationHeight === 'ceiling'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
        >
          <img 
            src={ceilingIcon} 
            alt="Ceiling" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              installationHeight === 'ceiling' ? "brightness-0 invert" : ""
            )} 
          />
          Ceiling
        </Button>
      </div>
    </Card>
  )
}

