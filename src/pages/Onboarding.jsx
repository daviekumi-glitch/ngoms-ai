import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  GraduationCap, BookOpen, Building2, ArrowRight, ArrowLeft,
  Check, Clock, Calendar, Globe, Sparkles
} from 'lucide-react'

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Access AI tools and study materials' },
  { id: 'lecturer', label: 'Lecturer', icon: BookOpen, desc: 'Create content and track student progress' },
  { id: 'institution', label: 'Institution', icon: Building2, desc: 'Manage departments and analytics' },
]

const subjects = [
  'Biology', 'Physics', 'Mathematics', 'Chemistry', 'History',
  'English', 'Computer Science', 'Geography', 'Economics', 'Psychology',
]

const languages = [
  { id: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
  { id: 'fr', flag: '🇫🇷', name: 'French', native: 'Français' },
  { id: 'ny', flag: '🇲🇼', name: 'Chichewa', native: 'Chichewa' },
  { id: 'sw', flag: '🇹🇿', name: 'Swahili', native: 'Kiswahili' },
  { id: 'pt', flag: '🇵🇹', name: 'Portuguese', native: 'Português' },
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [hours, setHours] = useState(4)
  const [examDate, setExamDate] = useState('')
  const [language, setLanguage] = useState('en')

  const toggleSubject = (s) => {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const next = () => setStep(s => Math.min(s + 1, 4))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const canProceed = () => {
    if (step === 1) return role !== ''
    if (step === 2) return selectedSubjects.length > 0
    if (step === 3) return examDate !== ''
    return true
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6 py-10">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s === step ? 'w-8 bg-gradient-to-r from-primary to-violet' :
              s < step ? 'w-2 bg-primary' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Role Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Sparkles size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">Welcome to Ngoms AI</h1>
              <p className="text-white/40 text-sm mt-1">Choose your role to get started</p>
            </div>
            <div className="flex flex-col gap-3">
              {roles.map(r => (
                <motion.button
                  key={r.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(r.id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    role === r.id
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 glass hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      role === r.id ? 'bg-gradient-to-br from-primary to-violet' : 'bg-white/5'
                    }`}>
                      <r.icon size={24} className={role === r.id ? 'text-white' : 'text-white/60'} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{r.label}</p>
                      <p className="text-white/40 text-xs mt-0.5">{r.desc}</p>
                    </div>
                    {role === r.id && <Check size={20} className="text-primary" />}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Subject Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <BookOpen size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">Select Your Subjects</h1>
              <p className="text-white/40 text-sm mt-1">Choose what you want to study</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.map(s => {
                const active = selectedSubjects.includes(s)
                return (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSubject(s)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/30'
                        : 'glass text-white/50 hover:text-white'
                    }`}
                  >
                    {active && <Check size={12} className="inline mr-1" />}
                    {s}
                  </motion.button>
                )
              })}
            </div>
            {selectedSubjects.length > 0 && (
              <p className="text-center text-primary text-xs mt-4">
                {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
              </p>
            )}
          </motion.div>
        )}

        {/* STEP 3: Study Goals */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Clock size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">Set Your Goals</h1>
              <p className="text-white/40 text-sm mt-1">Help us personalize your plan</p>
            </div>

            <div className="glass p-5 rounded-2xl mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-sm font-semibold">Study hours per day</span>
                <span className="text-2xl font-black gradient-text">{hours}h</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-primary to-violet"
              />
              <div className="flex justify-between text-white/30 text-xs mt-2">
                <span>1h</span><span>6h</span><span>12h</span>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl">
              <label className="text-white/60 text-sm font-semibold flex items-center gap-2 mb-3">
                <Calendar size={16} /> Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="input-field"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 4: Language Selection */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Globe size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">Choose Language</h1>
              <p className="text-white/40 text-sm mt-1">Pick your preferred language</p>
            </div>
            <div className="flex flex-col gap-3">
              {languages.map(l => (
                <motion.button
                  key={l.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLanguage(l.id)}
                  className={`p-4 rounded-2xl flex items-center gap-4 border-2 transition-all duration-200 ${
                    language === l.id
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent glass hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl">{l.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white text-sm">{l.name}</p>
                    <p className="text-white/40 text-xs">{l.native}</p>
                  </div>
                  {language === l.id && <Check size={20} className="text-primary" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3 mt-10 w-full max-w-md">
        {step > 1 && (
          <button
            onClick={back}
            className="glass rounded-xl px-5 py-3 flex items-center gap-2 text-white/60 hover:text-white transition-all text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!canProceed()}
          className={`flex-1 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            canProceed()
              ? 'bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/30 hover:scale-[1.02]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          {step === 4 ? 'Get Started' : 'Continue'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
