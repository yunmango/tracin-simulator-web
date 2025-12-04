import { ControlPanel } from '@/components/ControlPanel'
import { Viewport } from '@/components/Viewport'

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <ControlPanel />
      <Viewport />
    </div>
  )
}

export default App
