import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import darkIcon from '@/assets/dark.svg'
import lessIcon from '@/assets/less.svg'
import brightIcon from '@/assets/bright.svg'

export function LightConditionPanel({ className }: { className?: string }) {
  const { lightCondition, setLightCondition, mocapMode } = useSimulatorStore()

  const isDarkDisabled = mocapMode === 'handsOn'

  const getSubtitle = () => {
    if (lightCondition === 'bright') {
      return 'Bright Light : Complicated Gestures Available'
    }
    if (lightCondition === 'less') {
      return mocapMode === 'handsOn'
        ? 'Less Light : Only simple gestures available'
        : 'Less Light'
    }
    return 'Dark'
  }

  return (
    <Card className={cn("flex flex-col gap-[4px] lg:gap-[10px] px-4 lg:px-[69px] pt-4 lg:pt-0 pb-4 lg:pb-[20px] rounded-none border-0 border-b shadow-none bg-white", className)}>
      <div className="mb-0 space-y-[4px] lg:space-y-0 lg:flex lg:items-baseline lg:gap-[7px] min-w-0">
        <h3 className="text-[13px] lg:text-[22px] font-semibold text-[#1A1A1A] tracking-tight leading-none whitespace-normal lg:whitespace-nowrap flex-none">
          Light Condition
        </h3>
        <Label className="text-[8px] lg:text-[11px] text-[#BFBFBF] tracking-normal font-normal leading-[8px] lg:leading-none flex-1 min-w-0 truncate">
          {getSubtitle()}
        </Label>
      </div>
      <div className="flex w-full gap-0 lg:gap-1 rounded-[4px] lg:rounded-none overflow-hidden lg:overflow-visible bg-[#f0f0f0] lg:bg-transparent border border-[#e2e2e2] lg:border-0 divide-x divide-[#e2e2e2] lg:divide-x-0">
        <Button
          onClick={() => setLightCondition('dark')}
          variant={lightCondition === 'dark' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 relative min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            lightCondition === 'dark'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
          disabled={isDarkDisabled}
        >
          <img 
            src={darkIcon} 
            alt="Dark" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              lightCondition === 'dark' ? "brightness-0 invert" : ""
            )} 
          />
          Dark
          {isDarkDisabled && (
            <span className="absolute inset-0 flex items-center justify-center text-destructive font-bold">
              ✕
            </span>
          )}
        </Button>
        <Button
          onClick={() => setLightCondition('less')}
          variant={lightCondition === 'less' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            lightCondition === 'less'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
        >
          <img 
            src={lessIcon} 
            alt="Less" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              lightCondition === 'less' ? "brightness-0 invert" : ""
            )} 
          />
          Less
        </Button>
        <Button
          onClick={() => setLightCondition('bright')}
          variant={lightCondition === 'bright' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            lightCondition === 'bright'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
        >
          <img 
            src={brightIcon} 
            alt="Bright" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              lightCondition === 'bright' ? "brightness-0 invert" : ""
            )} 
          />
          Bright
        </Button>
      </div>
    </Card>
  )
}

