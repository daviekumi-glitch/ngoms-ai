import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap, BookOpen, Building2, ArrowRight, Check,
  Clock, Calendar, Brain, Sparkles, ChevronLeft
} from 'lucide-react'

const steps = [
  { id: 'welcome', title: 'Welcome to Ngoms AI', sub: 'Your personal AI study companion' },
  { id: 'role', title: 'What describes you?', sub: 'We'll tailor the experience for you' },
  { id: 'subjects', title: 'Pick your subjects', sub: 'Choose up to 5 you want to focus on' },
  { id: 'goals', title: 'Set your study goal', sub: 'How many hours per week can you commit?' },
]

export default function Onboarding() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [subjects, setSubjects] = useState([])
  const [hours, setHours] = useState(5)
  const [name, setName] = useState('')

  const roles = [
    { id: 'Student', icon: GraduationCap, desc: 'Learning for exams & growth' },
    { id: 'Lecturer', icon: BookOpen, desc: 'Teaching & creating content' },
    { id: 'Institution', icon: Building2, desc: 'Managing a school or academy' },
  ]

  const subjectList = [
    { label: 'Mathematics', icon: '🔢' }, { label: 'Biology', icon: '🧬' },
    { label: 'Physics', icon: '⚛️' }, { label: 'Chemistry', icon: '🧪' },
    { label: 'English', icon: '📝' }, { label: 'History', icon: '🌍' },
    { label: 'Computer Science', icon: '💻' }, { label: 'Geography', icon: '🗺️' },
    { label: 'Business', icon: '📈' }, { label: 'Art & Design', icon: '🎨' },
  ]

  const hoursOptions = [1, 2, 3, 5, 7, 10, 14, 20]

  const toggleSubject = (s) => {
    setSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev
    )
  }

  const canNext = () => {
    if (step === 0) return name.trim().length > 1
    if (step === 1) return role !== ''
    if (step === 2) return subjects.length > 0
    return true
  }

  const next = () => {
    if (step < steps.length - 1) { setStep(step + 1); return }
    localStorage.setItem('ngoms_user', JSON.stringify({
      name: name.trim() || 'Learner',
      email: '', phone: '',
      bio: `${role} focused on ${subjects.slice(0,3).join(', ')}.`,
      plan: 'Free', role, xp: 0, streak: 0,
      subjects, hoursPerWeek: hours,
    }))
    localStorage.setItem('ngoms_onboarded', 'true')
    nav('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-100 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 pt-14 pb-4">
        {step > 0
          ? <button onClick={() => setStep(s => s - 1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-soft border border-surface-border">
              <ChevronLeft size={18} className="text-ink" />
            </button>
          : <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-sky-400 shadow-btn">
              <Brain size={18} className="text-white" />
            </div>
        }
        <span className="text-sm font-semibold text-ink-muted">{step + 1} / {steps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="relative px-6 mb-8">
        <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 px-6 overflow-hidden">
        <div key={step} className="animate-slide-up">
          <h1 className="text-2xl font-black text-ink mb-1">{steps[step].title}</h1>
          <p className="text-ink-muted text-sm mb-7">{steps[step].sub}</p>

          {/* Step 0 — Name */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center mx-auto mb-6 shadow-btn">
                <Sparkles size={36} className="text-white" />
              </div>
              <p className="text-ink-secondary text-center text-sm mb-6">I'll guide you through personalized learning — quizzes, flashcards, notes and more.</p>
              <label className="block text-sm font-semibold text-ink mb-2">Your first name</label>
              <input
                className="input text-lg font-semibold"
                placeholder="e.g. Daud"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Step 1 — Role */}
          {step === 1 && (
            <div className="space-y-3">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-200 text-left
                    ${role === r.id
                      ? 'border-brand bg-brand-soft shadow-card'
                      : 'border-surface-border bg-white hover:border-brand/30'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                    ${role === r.id ? 'bg-brand text-white' : 'bg-surface-muted text-ink-secondary'}`}>
                    <r.icon size={22} />
                  </div>
                  <div>
                    <p className={`font-bold ${role === r.id ? 'text-brand' : 'text-ink'}`}>{r.id}</p>
                    <p className="text-sm text-ink-muted">{r.desc}</p>
                  </div>
                  {role === r.id && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-brand flex items-center justify-center">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — Subjects */}
          {step === 2 && (
            <div>
              <p className="text-xs text-ink-muted mb-4">{subjects.length}/5 selected</p>
              <div className="grid grid-cols-2 gap-2.5">
                {subjectList.map(s => {
                  const sel = subjects.includes(s.label)
                  return (
                    <button
                      key={s.label}
                      onClick={() => toggleSubject(s.label)}
                      className={`flex items-center gap-2.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-200
                        ${sel ? 'border-brand bg-brand-soft' : 'border-surface-border bg-white hover:border-brand/30'}`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className={`text-sm font-semibold ${sel ? 'text-brand' : 'text-ink'}`}>{s.label}</span>
                      {sel && <Check size={13} className="text-brand ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Hours */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <span className="text-6xl font-black text-ink">{hours}</span>
                <span className="text-2xl font-bold text-ink-muted"> hrs/week</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {hoursOptions.map(h => (
                  <button
                    key={h}
                    onClick={() => setHours(h)}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all duration-200
                      ${hours === h ? 'bg-brand text-white shadow-btn' : 'bg-surface-soft border border-surface-border text-ink-secondary hover:border-brand/30'}`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-brand-soft border border-brand/20">
                <p className="text-sm font-semibold text-brand">🎯 Your study plan</p>
                <p className="text-xs text-brand/70 mt-1">Based on {hours}h/week you can master a subject in roughly {Math.round(120 / hours)} weeks.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative px-6 pb-10 pt-4">
        <button
          onClick={next}
          disabled={!canNext()}
          className={`w-full py-4 rounded-3xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200
            ${canNext() ? 'bg-brand text-white shadow-btn active:scale-95' : 'bg-surface-muted text-ink-faint cursor-not-allowed'}`}
        >
          {step === steps.length - 1 ? 'Start Learning 🚀' : 'Continue'}
          {step < steps.length - 1 && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}
