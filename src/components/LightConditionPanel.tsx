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
    <Card className={cn("flex flex-col gap-[4px] md:gap-6 px-4 md:px-[69px] pt-4 pb-4 rounded-none border-0 border-b shadow-none bg-white", className)}>
      <div className="mb-0 space-y-[4px] md:space-y-1">
        <h3 className="text-[13px] md:text-xl font-semibold text-[#1A1A1A] tracking-tight leading-none">Light Condition</h3>
        <Label className="text-[8px] md:text-xs text-[#BFBFBF] tracking-normal font-normal leading-[8px] md:leading-tight">
          {getSubtitle()}
        </Label>
      </div>
      <div className="flex w-full gap-0 md:gap-2 rounded-[16px] md:rounded-none overflow-hidden md:overflow-visible bg-[#f0f0f0] md:bg-transparent border border-[#e2e2e2] md:border-0 divide-x divide-[#e2e2e2] md:divide-x-0">
        <Button
          onClick={() => setLightCondition('dark')}
          variant={lightCondition === 'dark' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 relative min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            lightCondition === 'dark'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
          disabled={isDarkDisabled}
        >
          <img src={darkIcon} alt="Dark" className="w-5 h-5 pt-0.5" />
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
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            lightCondition === 'less'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
        >
          <img src={lessIcon} alt="Less" className="w-5 h-5 pt-0.5" />
          Less
        </Button>
        <Button
          onClick={() => setLightCondition('bright')}
          variant={lightCondition === 'bright' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            lightCondition === 'bright'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
        >
          <img src={brightIcon} alt="Bright" className="w-5 h-5 pt-0.5" />
          Bright
        </Button>
      </div>
    </Card>
  )
}

