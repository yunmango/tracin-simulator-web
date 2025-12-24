import { useSimulatorStore } from '@/store/simulator-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import setupIcon from '@/assets/setup.svg'
import bodyonlyIcon from '@/assets/bodyonly.svg'
import handsIcon from '@/assets/hands.svg'

export function MocapModePanel({ className }: { className?: string }) {
  const { mocapMode, setMocapMode, lightCondition } = useSimulatorStore()

  // Hands On is available for bright and less light conditions, disabled only for dark
  // Note: In hands-on mode, the quality of hand gesture tracking depends on light conditions:
  // - Bright light: Complicated hand gestures are possible with accurate tracking
  // - Less light: Only simple hand gestures are available due to reduced visibility
  // - Dark: Hands-on mode is completely disabled as hand tracking is not feasible
  const isHandsOnDisabled = lightCondition === 'dark'

  const getModeDescription = () => {
    switch (mocapMode) {
      case 'setup':
        return 'Setup Mode'
      case 'bodyOnly':
        return 'Body Only'
      case 'handsOn':
        return 'Full Body with Hands'
    }
  }

  return (
    <Card className={cn("flex flex-col gap-[4px] lg:gap-[10px] min-w-0 px-4 lg:px-[69px] pt-4 lg:pt-0 pb-4 lg:pb-[20px] rounded-none border-0 border-b shadow-none bg-white lg:flex-1", className)}>
      <div className="mb-0 space-y-[4px] lg:space-y-0 lg:flex lg:items-baseline lg:gap-[7px] min-w-0">
        <h3 className="text-[13px] lg:text-[22px] font-semibold text-[#1A1A1A] tracking-tight leading-none whitespace-normal lg:whitespace-nowrap flex-none">
          Mocap Mode
        </h3>
        <Label className="text-[8px] lg:text-[11px] text-[#BFBFBF] tracking-normal font-normal leading-[8px] lg:leading-none flex-1 min-w-0 truncate">
          {getModeDescription()}
        </Label>
      </div>
      <div className="flex w-full gap-0 lg:gap-1 rounded-[4px] lg:rounded-none overflow-hidden lg:overflow-visible bg-[#f0f0f0] lg:bg-transparent border border-[#e2e2e2] lg:border-0 divide-x divide-[#e2e2e2] lg:divide-x-0">
        <Button
          onClick={() => setMocapMode('setup')}
          variant={mocapMode === 'setup' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            mocapMode === 'setup'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
        >
          <img 
            src={setupIcon} 
            alt="Setup" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              mocapMode === 'setup' ? "brightness-0 invert" : ""
            )} 
          />
          Setup
        </Button>
        <Button
          onClick={() => setMocapMode('bodyOnly')}
          variant={mocapMode === 'bodyOnly' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            mocapMode === 'bodyOnly'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
        >
          <img 
            src={bodyonlyIcon} 
            alt="Body Only" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              mocapMode === 'bodyOnly' ? "brightness-0 invert" : ""
            )} 
          />
          Body Only
        </Button>
        <Button
          onClick={() => setMocapMode('handsOn')}
          variant={mocapMode === 'handsOn' ? 'default' : 'outline'}
          className={cn(
            "flex-1 h-[36px] lg:w-[140px] lg:h-[54px] lg:flex-none flex-col items-center justify-center gap-1 relative min-w-0 px-2 sm:px-5 text-[8px] lg:text-[13px] leading-none rounded-none lg:rounded-[16px] border-0",
            mocapMode === 'handsOn'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] lg:bg-[#f0f0f0] lg:hover:bg-[#e8e8e8] lg:border lg:border-[#e2e2e2] lg:rounded-[16px]"
          )}
          disabled={isHandsOnDisabled}
        >
          <img 
            src={handsIcon} 
            alt="Hands On" 
            className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 pt-0.5",
              mocapMode === 'handsOn' ? "brightness-0 invert" : ""
            )} 
          />
          Hands On
          {isHandsOnDisabled && (
            <span className="absolute inset-0 flex items-center justify-center text-destructive font-bold">
              ✕
            </span>
          )}
        </Button>
      </div>
    </Card>
  )
}

