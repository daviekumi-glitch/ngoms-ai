import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated orb background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-float" />
      </div>
      {/* Particle dots */}
      {[...Array(20)].map((_,i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{ left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ opacity:[0,1,0], y:[0,-30,0] }}
          transition={{ duration:2+Math.random()*3, repeat:Infinity, delay:Math.random()*2 }} />
      ))}
      <motion.div className="relative z-10 flex flex-col items-center gap-6"
        initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{duration:0.8,ease:'easeOut'}}>
        <motion.div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center animate-glow"
          animate={{rotate:[0,5,-5,0]}} transition={{duration:4,repeat:Infinity}}>
          <Brain size={48} className="text-white" />
        </motion.div>
        <motion.div className="text-center" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
          <h1 className="text-5xl font-black gradient-text tracking-tight">Ngoms AI</h1>
          <p className="text-white/50 mt-2 text-lg font-medium">Learn Smarter. Not Harder.</p>
        </motion.div>
        <motion.div className="flex gap-2 mt-4" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}>
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-2 h-2 bg-primary rounded-full"
              animate={{scale:[1,1.5,1],opacity:[0.5,1,0.5]}}
              transition={{duration:1,repeat:Infinity,delay:i*0.2}} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
