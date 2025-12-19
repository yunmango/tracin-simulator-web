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
    <Card className={cn("flex flex-col gap-[4px] xl:gap-6 px-4 xl:px-[69px] pt-4 pb-4 rounded-none border-0 border-b shadow-none bg-white", className)}>
      <div className="mb-0 space-y-[4px] xl:space-y-1">
        <h3 className="text-[13px] xl:text-xl font-semibold text-[#1A1A1A] tracking-tight leading-none">Light Condition</h3>
        <Label className="text-[8px] xl:text-xs text-[#BFBFBF] tracking-normal font-normal leading-[8px] xl:leading-tight">
          {getSubtitle()}
        </Label>
      </div>
      <div className="flex w-full gap-0 xl:gap-2 rounded-[16px] xl:rounded-none overflow-hidden xl:overflow-visible bg-[#f0f0f0] xl:bg-transparent border border-[#e2e2e2] xl:border-0 divide-x divide-[#e2e2e2] xl:divide-x-0">
        <Button
          onClick={() => setLightCondition('dark')}
          variant={lightCondition === 'dark' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 relative min-w-0 px-2 sm:px-5 text-[8px] xl:text-[15px] leading-none rounded-none xl:rounded-[16px] border-0",
            lightCondition === 'dark'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] xl:bg-[#f0f0f0] xl:hover:bg-[#e8e8e8] xl:border xl:border-[#e2e2e2] xl:rounded-[16px]"
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
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] xl:text-[15px] leading-none rounded-none xl:rounded-[16px] border-0",
            lightCondition === 'less'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] xl:bg-[#f0f0f0] xl:hover:bg-[#e8e8e8] xl:border xl:border-[#e2e2e2] xl:rounded-[16px]"
          )}
        >
          <img src={lessIcon} alt="Less" className="w-5 h-5 pt-0.5" />
          Less
        </Button>
        <Button
          onClick={() => setLightCondition('bright')}
          variant={lightCondition === 'bright' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] xl:text-[15px] leading-none rounded-none xl:rounded-[16px] border-0",
            lightCondition === 'bright'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] xl:bg-[#f0f0f0] xl:hover:bg-[#e8e8e8] xl:border xl:border-[#e2e2e2] xl:rounded-[16px]"
          )}
        >
          <img src={brightIcon} alt="Bright" className="w-5 h-5 pt-0.5" />
          Bright
        </Button>
      </div>
    </Card>
  )
}

