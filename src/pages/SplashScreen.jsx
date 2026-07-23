import { useEffect, useState } from 'react'
import { Brain } from 'lucide-react'

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let val = 0
    const id = setInterval(() => {
      val += 3 + Math.random() * 4
      if (val >= 100) { val = 100; clearInterval(id) }
      setProgress(Math.min(val, 100))
    }, 80)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 select-none relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand/8 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated logo with glow */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shadow-btn animate-[scaleIn_.5s_cubic-bezier(.16,1,.3,1)]">
            <Brain size={44} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-[28px] bg-brand/20 blur-xl scale-110 -z-10 animate-pulse" />
        </div>

        <h1 className="text-4xl font-black text-ink mb-1 tracking-tight">
          Ngoms <span className="text-gradient">AI</span>
        </h1>
        <p className="text-ink-muted font-medium text-sm mb-10">Learn Smarter. Not Harder.</p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-ink-faint text-xs mt-3 font-medium">v2.0.0</p>
      </div>
    </div>
  )
}
