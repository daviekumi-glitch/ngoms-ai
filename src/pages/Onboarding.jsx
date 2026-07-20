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

  const toggleSubject = (s) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const next = () => {
    if (step < 3) setStep(step + 1)
    else {
      // Save preferences to localStorage
      localStorage.setItem('ngoms_user', JSON.stringify({
        name: 'Davie Kuminga',
        email: 'daviekumi@gmail.com',
        phone: '+265 991 234 567',
        bio: `${role} studying ${subjects.join(', ') || 'various subjects'}.`,
        plan: 'Premium',
        role: role || 'Student',
        xp: 0,
        streak: 0,
        subjects,
        hoursPerWeek: hours,
        examDate,
        language,
      }))
      localStorage.setItem('ngoms_onboarded', 'true')
      nav('/')
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={30} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white">Welcome to Ngoms AI</h1>
                <p className="text-white/40 text-sm mt-1">Let's personalize your learning</p>
              </div>
              <p className="text-white/60 text-sm mb-3 text-center">I am your AI study companion. I'll help you learn smarter, not harder.</p>
              <button onClick={next} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold active:scale-95 transition-transform">
                Get Started
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-xl font-black text-white mb-1">What describes you?</h1>
              <p className="text-white/40 text-sm mb-4">This helps us customize your experience</p>
              <div className="space-y-2">
                {roles.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
                      role === r.id ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/70'
                    }`}>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                      <r.icon size={22} className="text-white" />
                    </div>
                    <span className="font-semibold text-sm flex-1 text-left">{r.id}</span>
                    {role === r.id && <Check size={18} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-xl font-black text-white mb-1">Pick your subjects</h1>
              <p className="text-white/40 text-sm mb-4">Choose what you want to study</p>
              <div className="flex flex-wrap gap-2">
                {subjectList.map(s => (
                  <button key={s} onClick={() => toggleSubject(s)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      subjects.includes(s) ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/50'
                    }`}>
                    {subjects.includes(s) && <Check size={12} className="inline mr-1" />}{s}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <label className="text-white/50 text-xs font-semibold mb-2 block uppercase">Study hours per week</label>
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="20" value={hours} onChange={e => setHours(parseInt(e.target.value))} className="flex-1 accent-primary" />
                  <span className="text-white font-bold text-sm w-12">{hours}h</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-xl font-black text-white mb-1">Final touches</h1>
              <p className="text-white/40 text-sm mb-4">Just a few more details</p>
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase flex items-center gap-1"><Calendar size={12} /> Exam Date (optional)</label>
                  <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase flex items-center gap-1"><Globe size={12} /> Language</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(l => (
                      <button key={l} onClick={() => setLanguage(l)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          language === l ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/50'
                        }`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step > 0 && (
            <div className="flex gap-2 mt-6">
              {step > 0 && step < 4 && (
                <button onClick={() => setStep(step - 1)} className="flex-1 glass py-3 rounded-xl text-white/60 font-semibold text-sm active:scale-95 transition-transform">
                  Back
                </button>
              )}
              <button onClick={next}
                disabled={step === 1 && !role}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
                {step === 3 ? 'Start Learning' : 'Continue'} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
