import { Brain } from 'lucide-react'

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/30">
          <Brain size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-black gradient-text">Ngoms AI</h1>
        <p className="text-white/40 text-sm mt-1">Learn Smarter. Not Harder.</p>
        <div className="mt-4 w-32 h-1 rounded-full bg-white/5 mx-auto overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-violet animate-pulse" />
        </div>
      </div>
    </div>
  )
}
