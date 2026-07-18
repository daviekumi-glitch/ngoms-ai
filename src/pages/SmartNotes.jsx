import { motion } from 'framer-motion'

export default function SmartNotes() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8">
        <h1 className="text-3xl font-black gradient-text">SmartNotes</h1>
        <p className="text-white/40 mt-1">Building premium experience...</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
