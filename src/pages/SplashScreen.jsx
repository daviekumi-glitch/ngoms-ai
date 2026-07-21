import { useEffect, useState } from 'react'
import { Brain } from 'lucide-react'

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); return 100 }
        return p + 4
      })
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 animate-fade-in">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand to-sky-500 flex items-center justify-center mx-auto mb-6 shadow-btn">
          <Brain size={44} className="text-white" />
        </div>

        <h1 className="text-4xl font-black text-ink mb-2">
          Ngoms <span className="text-gradient">AI</span>
        </h1>
        <p className="text-ink-muted text-base font-medium mb-10">Learn Smarter. Not Harder.</p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-surface-muted rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-ink-faint text-xs mt-3 font-medium">Loading your experience...</p>
      </div>
    </div>
  )
}
