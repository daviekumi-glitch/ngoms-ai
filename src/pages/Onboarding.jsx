import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, Building2, ArrowRight, Check, Clock, Calendar, Globe, Sparkles } from 'lucide-react'

export default function Onboarding() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [subjects, setSubjects] = useState([])
  const [hours, setHours] = useState(3)
  const [examDate, setExamDate] = useState('')
  const [language, setLanguage] = useState('English')

  const roles = [
    { id: 'Student', icon: GraduationCap, color: 'from-blue-500 to-primary' },
    { id: 'Lecturer', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { id: 'Institution', icon: Building2, color: 'from-violet to-purple-500' },
  ]

  const subjectList = ['Biology', 'Mathematics', 'Physics', 'Chemistry', 'English', 'History', 'Geography', 'Computer Science']
  const languages = ['English', 'French', 'Chichewa', 'Swahili', 'Portuguese']

  const next = () => {
    if (step < 3) setStep(step + 1)
    else nav('/')
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Progress bar */}
      <div className="flex gap-1.5 p-4 pb-0">
        {[0,1,2,3].map(i => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-gradient-to-r from-primary to-violet' : 'bg-white/10'}`} />
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {step === 0 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/30">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white">Welcome to Ngoms AI</h1>
                <p className="text-white/40 text-sm mt-1">Let's set up your learning journey</p>
              </div>
              <p className="text-white/60 text-xs font-semibold mb-2.5 uppercase tracking-wide">Choose your role</p>
              <div className="space-y-2">
                {roles.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${role === r.id ? 'bg-gradient-to-r from-primary to-violet' : 'glass'}`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                      <r.icon size={20} className="text-white" />
                    </div>
                    <span className={`text-sm font-semibold ${role === r.id ? 'text-white' : 'text-white/70'}`}>{r.id}</span>
                    {role === r.id && <Check size={18} className="text-white ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Select Subjects</h1>
              <p className="text-white/40 text-sm mb-4">Choose what you want to study</p>
              <div className="grid grid-cols-2 gap-2">
                {subjectList.map(s => (
                  <button key={s} onClick={() => setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all ${subjects.includes(s) ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/60'}`}>
                    {s}
                    {subjects.includes(s) && <Check size={14} className="inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Study Goals</h1>
              <p className="text-white/40 text-sm mb-4">Set your daily target</p>
              <div className="glass p-4 rounded-2xl mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-primary" />
                  <span className="text-white/70 text-sm font-semibold">Hours per day</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="12" value={hours} onChange={e => setHours(+e.target.value)}
                    className="flex-1 accent-primary" />
                  <span className="text-2xl font-black gradient-text w-12 text-center">{hours}h</span>
                </div>
              </div>
              <div className="glass p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={18} className="text-violet" />
                  <span className="text-white/70 text-sm font-semibold">Exam date (optional)</span>
                </div>
                <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                  className="input-field text-sm" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Language</h1>
              <p className="text-white/40 text-sm mb-4">Choose your preferred language</p>
              <div className="space-y-2">
                {languages.map(l => (
                  <button key={l} onClick={() => setLanguage(l)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${language === l ? 'bg-gradient-to-r from-primary to-violet' : 'glass'}`}>
                    <Globe size={20} className={language === l ? 'text-white' : 'text-white/40'} />
                    <span className={`text-sm font-semibold ${language === l ? 'text-white' : 'text-white/70'}`}>{l}</span>
                    {language === l && <Check size={18} className="text-white ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={next}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            {step === 3 ? 'Start Learning' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
