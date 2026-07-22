import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, Building2, ArrowRight, Check, Brain, Sparkles, ChevronLeft } from 'lucide-react'

const STEPS = [
  { title: "Welcome to Ngoms AI 👋", sub: "Your personal AI study companion" },
  { title: "What describes you?",    sub: "We'll tailor the experience just for you" },
  { title: "Pick your subjects",     sub: "Choose up to 5 you want to focus on" },
  { title: "Set your weekly goal",   sub: "How many hours can you study per week?" },
]

const ROLES = [
  { id: 'Student',     icon: GraduationCap, desc: 'Studying for exams and personal growth' },
  { id: 'Lecturer',    icon: BookOpen,      desc: 'Teaching and creating learning content' },
  { id: 'Institution', icon: Building2,     desc: 'Managing a school or training academy' },
]

const SUBJECTS = [
  { label: 'Mathematics',      icon: '🔢' }, { label: 'Biology',     icon: '🧬' },
  { label: 'Physics',          icon: '⚛️' }, { label: 'Chemistry',   icon: '🧪' },
  { label: 'English',          icon: '📝' }, { label: 'History',     icon: '🌍' },
  { label: 'Computer Science', icon: '💻' }, { label: 'Geography',   icon: '🗺️' },
  { label: 'Business',         icon: '📈' }, { label: 'Art & Design', icon: '🎨' },
]

const HOURS = [1, 2, 3, 5, 7, 10, 14, 20]

export default function Onboarding() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [subjects, setSubjects] = useState([])
  const [hours, setHours] = useState(5)

  const toggleSubject = (s) =>
    setSubjects(p => p.includes(s) ? p.filter(x => x !== s) : p.length < 5 ? [...p, s] : p)

  const canAdvance = () => {
    if (step === 0) return name.trim().length >= 2
    if (step === 1) return role !== ''
    if (step === 2) return subjects.length > 0
    return true
  }

  const finish = () => {
    const userData = {
      name: name.trim(),
      email: '', phone: '', plan: 'Free', role,
      xp: 0, streak: 0, subjects, hoursPerWeek: hours,
      bio: `${role} focused on ${subjects.slice(0, 3).join(', ') || 'learning'}.`,
    }
    try {
      localStorage.setItem('ngoms_user', JSON.stringify(userData))
      localStorage.setItem('ngoms_onboarded', 'true')
    } catch {}
    nav('/', { replace: true })
  }

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : finish()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* BG blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 bg-sky-100/60 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-14 pb-2">
        {step > 0 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-soft border border-surface-border"
          >
            <ChevronLeft size={18} className="text-ink" />
          </button>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-sky-400 shadow-btn">
            <Brain size={18} className="text-white" />
          </div>
        )}
        <span className="text-sm font-semibold text-ink-muted">{step + 1} / {STEPS.length}</span>
      </div>

      {/* Progress */}
      <div className="relative px-5 mt-3 mb-7">
        <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 px-5 overflow-hidden">
        <div key={step} className="animate-slide-up">
          <h1 className="text-2xl font-black text-ink mb-1">{STEPS[step].title}</h1>
          <p className="text-ink-muted text-sm mb-6">{STEPS[step].sub}</p>

          {/* Step 0 — Name */}
          {step === 0 && (
            <div>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center mx-auto mb-7 shadow-btn">
                <Sparkles size={36} className="text-white" />
              </div>
              <p className="text-ink-secondary text-sm text-center mb-6 leading-relaxed">
                I'll guide you through personalized learning — AI tutoring, quizzes, flashcards, smart notes, and more.
              </p>
              <label className="block text-sm font-bold text-ink mb-2">Your first name</label>
              <input
                className="input text-base font-semibold"
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
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all duration-200
                    ${role === r.id ? 'border-brand bg-brand-soft' : 'border-surface-border bg-white hover:border-brand/30'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                    ${role === r.id ? 'bg-brand text-white' : 'bg-surface-muted text-ink-secondary'}`}>
                    <r.icon size={22} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${role === r.id ? 'text-brand' : 'text-ink'}`}>{r.id}</p>
                    <p className="text-sm text-ink-muted">{r.desc}</p>
                  </div>
                  {role === r.id && (
                    <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — Subjects */}
          {step === 2 && (
            <div>
              <p className="text-xs text-ink-muted mb-3">{subjects.length}/5 selected</p>
              <div className="grid grid-cols-2 gap-2.5">
                {SUBJECTS.map(s => {
                  const sel = subjects.includes(s.label)
                  return (
                    <button
                      key={s.label}
                      onClick={() => toggleSubject(s.label)}
                      className={`flex items-center gap-2.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-200
                        ${sel ? 'border-brand bg-brand-soft' : 'border-surface-border bg-white hover:border-brand/30'}`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className={`text-sm font-semibold flex-1 ${sel ? 'text-brand' : 'text-ink'}`}>{s.label}</span>
                      {sel && <Check size={12} className="text-brand shrink-0" />}
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
                <span className="text-2xl font-bold text-ink-muted"> hrs / week</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 mb-6">
                {HOURS.map(h => (
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
              <div className="p-4 rounded-2xl bg-brand-soft border border-brand/20">
                <p className="text-sm font-bold text-brand">🎯 Your study plan</p>
                <p className="text-xs text-brand/70 mt-1">
                  At {hours}h/week you can master a new subject in ~{Math.ceil(80 / hours)} weeks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="relative px-5 pb-10 pt-4">
        <button
          onClick={next}
          disabled={!canAdvance()}
          className={`w-full py-4 rounded-3xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200
            ${canAdvance() ? 'bg-brand text-white shadow-btn active:scale-95' : 'bg-surface-muted text-ink-faint cursor-not-allowed'}`}
        >
          {step === STEPS.length - 1 ? 'Start Learning 🚀' : <>Continue <ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  )
}
