import { useState } from 'react'
import { Zap, CheckCircle, XCircle, RotateCcw, ChevronRight, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function QuizEngine() {
  const { quizzes, loading, isFeatureEnabled } = useApp()
  const [active, setActive] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (!isFeatureEnabled('quiz')) {
    return <div className="p-6 text-center text-white/40">Quiz Engine is currently disabled by admin.</div>
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="h-8 w-40 rounded-xl bg-white/5 animate-pulse mb-4" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (active && !submitted) {
    // Generate sample questions from quiz metadata
    const questions = Array.from({ length: active.questions || 5 }, (_, i) => ({
      id: i,
      q: `Question ${i + 1}: What is the key concept from ${active.title}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
    }))

    const score = Object.entries(answers).filter(([k, v]) => v === 'Option A').length
    const total = questions.length

    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setActive(null)}
            className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{active.title}</h1>
            <p className="text-white/40 text-xs">{total} questions · {active.difficulty}</p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="glass p-4 rounded-2xl">
              <p className="text-white font-semibold text-sm mb-3">{q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <button key={j}
                    onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all active:scale-[0.98] ${
                      answers[i] === opt
                        ? 'bg-gradient-to-r from-primary to-violet text-white'
                        : 'glass text-white/60'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setSubmitted(true)}
          className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold active:scale-[0.98] transition-transform">
          Submit Quiz
        </button>
      </div>
    )
  }

  if (active && submitted) {
    const questions = Array.from({ length: active.questions || 5 }, (_, i) => ({ id: i }))
    const score = Object.entries(answers).filter(([k, v]) => v === 'Option A').length
    const total = questions.length
    const pct = Math.round((score / total) * 100)

    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto text-center">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto">
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${pct >= 70 ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
            <Target size={36} className={pct >= 70 ? 'text-emerald-400' : 'text-amber-400'} />
          </div>
          <h2 className="text-3xl font-black text-white">{pct}%</h2>
          <p className="text-white/40 text-sm mt-1">{score} out of {total} correct</p>
          <div className="mt-4 flex gap-2 justify-center">
            <button onClick={() => { setActive(null); setSubmitted(false); setAnswers({}) }}
              className="px-4 py-2.5 rounded-xl glass text-white/70 text-sm font-semibold active:scale-95 transition-transform">
              Back to Quizzes
            </button>
            <button onClick={() => { setSubmitted(false); setAnswers({}) }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
              <RotateCcw size={14} className="inline mr-1" /> Retake
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Quiz Engine</h1>
        <p className="text-white/40 text-sm mt-0.5">Test your knowledge</p>
      </div>

      <div className="space-y-2.5">
        {(quizzes || []).filter(q => q.status === 'active').length === 0 ? (
          <div className="text-center py-20">
            <Zap size={48} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No quizzes available yet</p>
          </div>
        ) : (quizzes || []).filter(q => q.status === 'active').map((q) => (
          <div key={q.id} onClick={() => { setActive(q); setAnswers({}); setSubmitted(false) }}
            className="glass p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{q.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white/40 text-xs">{q.questions || 0} questions</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/40 text-xs">{q.difficulty}</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/40 text-xs">{q.attempts || 0} attempts</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/30" />
          </div>
        ))}
      </div>
    </div>
  )
}
