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
    <Card className={cn("flex flex-col gap-[4px] md:gap-6 min-w-0 px-4 md:px-[69px] pt-4 pb-4 rounded-none border-0 border-b shadow-none bg-white md:flex-1", className)}>
      <div className="mb-0 space-y-[4px] md:space-y-1">
        <h3 className="text-[13px] md:text-xl font-semibold text-[#1A1A1A] tracking-tight leading-none whitespace-normal">Mocap Mode</h3>
        <Label className="text-[8px] md:text-xs text-[#BFBFBF] tracking-normal font-normal leading-[8px] md:leading-tight">
          {getModeDescription()}
        </Label>
      </div>
      <div className="flex w-full gap-0 md:gap-2 rounded-[16px] md:rounded-none overflow-hidden md:overflow-visible bg-[#f0f0f0] md:bg-transparent border border-[#e2e2e2] md:border-0 divide-x divide-[#e2e2e2] md:divide-x-0">
        <Button
          onClick={() => setMocapMode('setup')}
          variant={mocapMode === 'setup' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            mocapMode === 'setup'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
        >
          <img src={setupIcon} alt="Setup" className="w-5 h-5 pt-0.5" />
          Setup
        </Button>
        <Button
          onClick={() => setMocapMode('bodyOnly')}
          variant={mocapMode === 'bodyOnly' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            mocapMode === 'bodyOnly'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
        >
          <img src={bodyonlyIcon} alt="Body Only" className="w-5 h-5 pt-0.5" />
          Body Only
        </Button>
        <Button
          onClick={() => setMocapMode('handsOn')}
          variant={mocapMode === 'handsOn' ? 'default' : 'outline'}
          className={cn(
            "flex-1 flex-col gap-1 relative min-w-0 px-2 sm:px-5 text-[8px] md:text-base leading-none rounded-none md:rounded-[16px] border-0",
            mocapMode === 'handsOn'
              ? ""
              : "bg-transparent hover:bg-[#e8e8e8] md:bg-[#f0f0f0] md:hover:bg-[#e8e8e8] md:border md:border-[#e2e2e2] md:rounded-[16px]"
          )}
          disabled={isHandsOnDisabled}
        >
          <img src={handsIcon} alt="Hands On" className="w-5 h-5 pt-0.5" />
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

