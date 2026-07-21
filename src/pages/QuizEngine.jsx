import { useState } from 'react'
import { Zap, CheckCircle, XCircle, ChevronRight, Trophy, RefreshCw, Clock, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

function QuizSession({ quiz, onBack }) {
  const questions = quiz.questions || []
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [timer] = useState(Date.now())

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Zap size={40} className="text-ink-faint" />
        <p className="font-bold text-ink">No questions in this quiz</p>
        <button onClick={onBack} className="btn-ghost">Go Back</button>
      </div>
    )
  }

  const done = idx >= questions.length
  const q = questions[idx]

  const pick = (opt) => {
    if (selected !== null) return
    setSelected(opt)
    setTimeout(() => {
      const correct = opt === q.answer
      setAnswers(a => [...a, { q: q.question, selected: opt, correct, answer: q.answer }])
      setSelected(null)
      setIdx(i => i + 1)
    }, 900)
  }

  if (done) {
    const score = answers.filter(a => a.correct).length
    const pct = Math.round((score / questions.length) * 100)
    const elapsed = Math.round((Date.now() - timer) / 1000)
    const mins = Math.floor(elapsed / 60), secs = elapsed % 60
    return (
      <div className="flex flex-col items-center gap-5 py-8 animate-scale-in">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-btn ${pct >= 70 ? 'bg-brand' : 'bg-amber-400'}`}>
          <Trophy size={38} className="text-white" />
        </div>
        <div className="text-center">
          <p className="text-4xl font-black text-ink">{pct}%</p>
          <p className="text-ink-muted">{score}/{questions.length} correct</p>
        </div>
        <div className="flex items-center gap-1 text-ink-muted text-sm">
          <Clock size={14} />
          <span>Completed in {mins > 0 ? `${mins}m ` : ''}{secs}s</span>
        </div>
        <div className="w-full space-y-2 max-h-48 overflow-y-auto">
          {answers.map((a, i) => (
            <div key={i} className={`flex items-start gap-2 p-3 rounded-2xl text-sm ${a.correct ? 'bg-green-50' : 'bg-red-50'}`}>
              {a.correct ? <CheckCircle size={15} className="text-success shrink-0 mt-0.5" /> : <XCircle size={15} className="text-danger shrink-0 mt-0.5" />}
              <div>
                <p className="font-medium text-ink">{a.q}</p>
                {!a.correct && <p className="text-xs text-ink-muted mt-0.5">Answer: {a.answer}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onBack} className="btn-ghost flex-1">Back</button>
          <button onClick={() => { setIdx(0); setSelected(null); setAnswers([]) }} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center">
          <ArrowLeft size={15} className="text-ink" />
        </button>
        <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${(idx / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-ink-muted">{idx + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="card animate-slide-up">
        <p className="chip mb-3">Question {idx + 1}</p>
        <p className="font-bold text-ink text-base leading-snug">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {(q.options || []).map((opt, i) => {
          let style = 'bg-white border-surface-border text-ink'
          if (selected !== null) {
            if (opt === q.answer) style = 'bg-green-50 border-success text-success'
            else if (opt === selected) style = 'bg-red-50 border-danger text-danger'
          }
          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left font-medium text-sm transition-all duration-300 ${style} active:scale-[0.99]`}
            >
              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function QuizEngine() {
  const { quizzes } = useApp()
  const [active, setActive] = useState(null)
  const [aiTopic, setAiTopic] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiQuiz, setAiQuiz] = useState(null)

  const available = (quizzes || []).filter(q => q.status === 'Active' || q.status === 'active')

  const generateAiQuiz = async () => {
    if (!aiTopic.trim() || aiLoading) return
    setAiLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_quiz', topic: aiTopic, count: 5 }),
      })
      const data = await res.json()
      if (data.questions?.length) {
        const q = { title: `AI Quiz: ${aiTopic}`, questions: data.questions }
        setAiQuiz(q)
        setActive(q)
      }
    } catch {}
    setAiLoading(false)
  }

  if (active) {
    return (
      <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
        <h2 className="font-black text-xl text-ink mb-1">{active.title}</h2>
        <p className="text-sm text-ink-muted mb-5">{(active.questions || []).length} questions</p>
        <QuizSession quiz={active} onBack={() => setActive(null)} />
      </div>
    )
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Quiz Engine</h1>
        <p className="text-sm text-ink-muted">Test your knowledge</p>
      </div>

      {/* AI quiz generator */}
      <div className="card mb-6 bg-gradient-to-br from-brand to-sky-500 text-white">
        <p className="font-bold text-base mb-1">🤖 AI Quiz Generator</p>
        <p className="text-white/70 text-sm mb-3">Enter any topic and I'll generate a custom quiz for you</p>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 text-sm"
            placeholder="e.g. Cell Biology, World War 2..."
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generateAiQuiz()}
          />
          <button
            onClick={generateAiQuiz}
            disabled={aiLoading || !aiTopic.trim()}
            className="bg-white text-brand font-bold px-4 py-2.5 rounded-2xl text-sm disabled:opacity-60 active:scale-95 transition-all"
          >
            {aiLoading ? '...' : 'Go'}
          </button>
        </div>
      </div>

      {/* Stored quizzes */}
      {available.length > 0 && (
        <div>
          <p className="section-title mb-3">Available Quizzes</p>
          <div className="space-y-3">
            {available.map(q => (
              <div
                key={q.id}
                onClick={() => setActive(q)}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-surface-border shadow-card cursor-pointer active:scale-[0.99] hover:shadow-card-hover transition-all"
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">{q.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`chip text-[10px] ${q.difficulty === 'Hard' ? 'chip-danger' : q.difficulty === 'Medium' ? 'chip-warning' : 'chip-success'}`}>
                      {q.difficulty || 'Medium'}
                    </span>
                    <span className="text-xs text-ink-muted">{(q.questions || []).length} questions</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-ink-faint shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
