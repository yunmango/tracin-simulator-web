import { ControlPanel } from '@/components/ControlPanel'
import { Viewport } from '@/components/Viewport'
import { useState } from 'react'

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      <Viewport />
      <ControlPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onOpen={() => setIsPanelOpen(true)} />
    </div>
  )
}

export default App
