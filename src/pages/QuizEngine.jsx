import { useState } from 'react'
import { Zap, CheckCircle, XCircle, RotateCcw, ChevronRight, Target, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'

const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

export default function QuizEngine() {
  const { quizzes, loading, isFeatureEnabled } = useApp()
  const [active, setActive] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  if (!isFeatureEnabled('quiz')) {
    return <div className="p-6 text-center text-white/40">Quiz Engine is currently disabled by admin.</div>
  }

  const startQuiz = async (quiz) => {
    setActive(quiz)
    setAnswers({})
    setSubmitted(false)
    setError('')
    setGenerating(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ai_quiz', payload: { topic: quiz.title, difficulty: quiz.difficulty, count: quiz.questions || 5 } }),
      })
      const json = await res.json()
      if (json.success && json.questions) {
        setQuestions(json.questions)
      } else {
        // Fallback to generated questions
        setError('AI quiz generation failed. Using sample questions.')
        setQuestions(Array.from({ length: quiz.questions || 5 }, (_, i) => ({
          q: `Question ${i + 1} about ${quiz.title}`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: i % 4,
        })))
      }
    } catch {
      setQuestions(Array.from({ length: quiz.questions || 5 }, (_, i) => ({
        q: `Question ${i + 1} about ${quiz.title}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: i % 4,
      })))
    }
    setGenerating(false)
  }

  if (active && !submitted) {
    if (generating) {
      return (
        <div className="p-4 md:p-6 max-w-3xl mx-auto text-center py-20">
          <Loader size={32} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-white/60 text-sm">Generating quiz questions with AI...</p>
        </div>
      )
    }

    const total = questions.length
    const score = questions.filter((q, i) => answers[i] === q.answer).length

    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setActive(null); setQuestions([]) }}
            className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{active.title}</h1>
            <p className="text-white/40 text-xs">{total} questions · {active.difficulty}</p>
          </div>
        </div>

        {error && <p className="text-amber-400/60 text-xs mb-3">{error}</p>}

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="glass p-4 rounded-2xl">
              <p className="text-white font-semibold text-sm mb-3">{i + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all active:scale-[0.98] ${
                      answers[i] === j ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/60'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < total}
          className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold active:scale-[0.98] transition-transform disabled:opacity-50">
          Submit Quiz ({Object.keys(answers).length}/{total})
        </button>
      </div>
    )
  }

  if (active && submitted) {
    const total = questions.length
    const score = questions.filter((q, i) => answers[i] === q.answer).length
    const pct = total > 0 ? Math.round((score / total) * 100) : 0

    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto text-center">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto mb-4">
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${pct >= 70 ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
            <Target size={36} className={pct >= 70 ? 'text-emerald-400' : 'text-amber-400'} />
          </div>
          <h2 className="text-3xl font-black text-white">{pct}%</h2>
          <p className="text-white/40 text-sm mt-1">{score} out of {total} correct</p>
          <div className="mt-4 flex gap-2 justify-center">
            <button onClick={() => { setActive(null); setQuestions([]); setSubmitted(false); setAnswers({}) }}
              className="px-4 py-2.5 rounded-xl glass text-white/70 text-sm font-semibold active:scale-95 transition-transform">
              Back to Quizzes
            </button>
            <button onClick={() => { setSubmitted(false); setAnswers({}) }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
              <RotateCcw size={14} className="inline mr-1" /> Retake
            </button>
          </div>
        </div>

        {/* Answer review */}
        <div className="space-y-2 text-left">
          {questions.map((q, i) => (
            <div key={i} className="glass p-3 rounded-xl">
              <div className="flex items-start gap-2">
                {answers[i] === q.answer ? (
                  <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-white/80 text-sm">{q.q}</p>
                  <p className="text-white/40 text-xs mt-0.5">Correct: {q.options[q.answer]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Quiz Engine</h1>
        <p className="text-white/40 text-sm mt-0.5">AI-powered quizzes · Test your knowledge</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (quizzes || []).filter(q => q.status === 'active').length === 0 ? (
        <div className="text-center py-20">
          <Zap size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No quizzes available yet</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {(quizzes || []).filter(q => q.status === 'active').map((q) => (
            <div key={q.id} onClick={() => startQuiz(q)}
              className="glass p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                <Zap size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{q.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/40 text-xs">{q.questions || 5} questions</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{q.difficulty}</span>
                  {q.course && (<><span className="text-white/20 text-xs">·</span><span className="text-white/40 text-xs">{q.course}</span></>)}
                </div>
              </div>
              <ChevronRight size={18} className="text-white/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
