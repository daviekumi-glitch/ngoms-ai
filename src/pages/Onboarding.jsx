import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowRight, Check, GraduationCap, Target, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const SLIDES = [
  {
    icon: Brain,
    title: 'Your AI Study Companion',
    desc: 'Get instant help from your AI tutor — ask questions, generate quizzes, and create smart notes in seconds.',
    gradient: 'from-brand to-sky-400',
    bg: 'from-sky-50 to-blue-50',
  },
  {
    icon: Target,
    title: 'Personalized Learning Path',
    desc: 'Tell us your name, goals, and interests. We will tailor courses, flashcards, and quizzes just for you.',
    gradient: 'from-violet-500 to-purple-400',
    bg: 'from-violet-50 to-purple-50',
  },
  {
    icon: Sparkles,
    title: 'Learn Smarter, Not Harder',
    desc: 'Track your progress, earn badges, climb the leaderboard, and study with focus using the built-in Pomodoro timer.',
    gradient: 'from-amber-400 to-orange-400',
    bg: 'from-amber-50 to-orange-50',
  },
]

export default function Onboarding({ onDone }) {
  const nav = useNavigate()
  const { setUser } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('Pass exams')
  const [interest, setInterest] = useState('Technology')

  const isForm = step === SLIDES.length
  const slide = SLIDES[step]

  const finish = () => {
    const userData = {
      name: name.trim() || 'Learner',
      email: '',
      plan: 'Free',
      role: 'Student',
      xp: 0,
      streak: 0,
      bio: `Goal: ${goal}. Interest: ${interest}.`,
    }
    try {
      localStorage.setItem('ngoms_user', JSON.stringify(userData))
      localStorage.setItem('ngoms_onboarded', 'true')
    } catch {}
    onDone?.()
    nav('/', { replace: true })
  }

  const next = () => {
    if (step < SLIDES.length - 1) setStep(s => s + 1)
    else setStep(SLIDES.length)
  }

  const GOALS = ['Pass exams', 'Learn a skill', 'Career growth', 'Just curious']
  const INTERESTS = ['Technology', 'Science', 'Mathematics', 'Languages', 'Business', 'Arts']

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col">

      {/* Skip button */}
      {step < SLIDES.length && (
        <div className="absolute top-12 right-5 z-10">
          <button onClick={() => setStep(SLIDES.length)} className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors px-3 py-1.5">
            Skip
          </button>
        </div>
      )}

      {/* Slide content */}
      {!isForm ? (
        <div className={`flex-1 flex flex-col items-center justify-center px-8 bg-gradient-to-b ${slide.bg} relative overflow-hidden`}>
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${slide.gradient} opacity-10 blur-3xl animate-pulse-glow`} />
            <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br ${slide.gradient} opacity-10 blur-3xl animate-pulse-glow`} style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative flex flex-col items-center text-center animate-scale-in" key={step}>
            <div className={`w-24 h-24 rounded-[28px] bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-btn mb-8 animate-float`}>
              <slide.icon size={44} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-ink mb-3 max-w-xs">{slide.title}</h2>
            <p className="text-ink-muted text-sm leading-relaxed max-w-xs">{slide.desc}</p>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-12">
            {SLIDES.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-brand' : 'w-2 bg-surface-border'}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-5 pt-14 pb-6 max-w-md mx-auto w-full animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shadow-btn">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-ink">Almost there!</h1>
              <p className="text-sm text-ink-muted">Tell us about yourself</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-bold text-ink mb-2 block">Your Name</label>
              <input
                className="input text-base"
                placeholder="e.g. Davie Kuminga"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-bold text-ink mb-2 block">What is your main goal?</label>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`px-4 py-3 rounded-2xl text-sm font-semibold border-2 transition-all active:scale-95 ${goal === g ? 'border-brand bg-brand-soft text-brand' : 'border-surface-border bg-white text-ink-secondary hover:border-brand/30'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-ink mb-2 block">Primary interest?</label>
              <div className="grid grid-cols-3 gap-2">
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => setInterest(i)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-semibold border-2 transition-all active:scale-95 ${interest === i ? 'border-brand bg-brand-soft text-brand' : 'border-surface-border bg-white text-ink-secondary hover:border-brand/30'}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <button onClick={finish} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mt-6">
            Start Learning <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      {!isForm && (
        <div className="px-5 pb-8 pt-4 safe-pb">
          <button onClick={next} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
            {step === SLIDES.length - 1 ? 'Get Started' : 'Continue'} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
