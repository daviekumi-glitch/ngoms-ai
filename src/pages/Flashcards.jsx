import { useState } from 'react'
import { Plus, Layers, ChevronRight, RotateCw, Check, X, ArrowLeft, BookOpen, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

function StudyMode({ deck, onBack }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])
  const cards = deck.cards || []
  const done = idx >= cards.length

  const answer = (correct) => {
    setResults(r => [...r, correct])
    setFlipped(false)
    setTimeout(() => setIdx(i => i + 1), 200)
  }

  if (!cards.length) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Layers size={40} className="text-ink-faint mb-3" />
      <p className="font-bold text-ink">No cards in this deck yet</p>
      <button onClick={onBack} className="mt-4 btn-ghost">Go Back</button>
    </div>
  )

  if (done) {
    const score = results.filter(Boolean).length
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-10 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center shadow-btn">
          <Sparkles size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-ink">Session Complete!</h2>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-black text-success">{score}</p>
            <p className="text-sm text-ink-muted">Correct</p>
          </div>
          <div className="w-px h-12 bg-surface-border" />
          <div className="text-center">
            <p className="text-3xl font-black text-danger">{cards.length - score}</p>
            <p className="text-sm text-ink-muted">Missed</p>
          </div>
          <div className="w-px h-12 bg-surface-border" />
          <div className="text-center">
            <p className="text-3xl font-black text-brand">{Math.round((score/cards.length)*100)}%</p>
            <p className="text-sm text-ink-muted">Score</p>
          </div>
        </div>
        <button onClick={onBack} className="btn-primary w-full max-w-xs">Back to Decks</button>
        <button onClick={() => { setIdx(0); setFlipped(false); setResults([]) }} className="btn-ghost w-full max-w-xs">Study Again</button>
      </div>
    )
  }

  const card = cards[idx]
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Progress */}
      <div className="w-full flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center">
          <ArrowLeft size={15} className="text-ink" />
        </button>
        <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${(idx / cards.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-ink-muted">{idx + 1}/{cards.length}</span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        className="w-full max-w-sm h-52 cursor-pointer select-none perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <div className={`relative w-full h-full transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}>
          <div className="absolute inset-0 bg-white rounded-3xl border-2 border-surface-border shadow-float flex flex-col items-center justify-center p-6 text-center backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
            <span className="chip mb-3">Question</span>
            <p className="text-lg font-bold text-ink leading-snug">{card.front}</p>
            <p className="text-xs text-ink-muted mt-4">Tap to reveal answer</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-sky-500 rounded-3xl shadow-btn flex flex-col items-center justify-center p-6 text-center backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-3">Answer</span>
            <p className="text-lg font-bold text-white leading-snug">{card.back}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-ink-muted">Tap the card to flip it</p>

      {/* Actions */}
      {flipped && (
        <div className="flex gap-4 w-full max-w-sm animate-slide-up">
          <button onClick={() => answer(false)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 border border-red-100 text-danger font-bold active:scale-95 transition-all">
            <X size={18} /> Missed
          </button>
          <button onClick={() => answer(true)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-50 border border-green-100 text-success font-bold active:scale-95 transition-all">
            <Check size={18} /> Got it!
          </button>
        </div>
      )}
    </div>
  )
}

export default function Flashcards() {
  const { flashcardDecks, create } = useApp()
  const [studying, setStudying] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const nav = useNavigate()

  const decks = (flashcardDecks || []).filter(d => d.status !== 'Archived')

  const createDeck = async () => {
    if (!newTitle.trim()) return
    await create('flashcards', { title: newTitle.trim(), author: 'Me', views: 0, status: 'Active', cards: [] })
    setNewTitle(''); setShowNew(false)
  }

  if (studying) {
    return (
      <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto">
        <h2 className="font-black text-xl text-ink mb-1">{studying.title}</h2>
        <p className="text-sm text-ink-muted mb-5">{(studying.cards || []).length} cards</p>
        <StudyMode deck={studying} onBack={() => setStudying(null)} />
      </div>
    )
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink">Flashcards</h1>
          <p className="text-sm text-ink-muted">{decks.length} decks available</p>
        </div>
        <button onClick={() => setShowNew(true)} className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center shadow-btn active:scale-95 transition-all">
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* New deck form */}
      {showNew && (
        <div className="card mb-5 animate-slide-up">
          <p className="font-bold text-ink mb-3">New Deck</p>
          <input className="input mb-3" placeholder="Deck title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <button onClick={createDeck} className="btn-primary flex-1 py-3 text-sm">Create</button>
            <button onClick={() => { setShowNew(false); setNewTitle('') }} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Decks grid */}
      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mb-4">
            <Layers size={28} className="text-brand" />
          </div>
          <p className="font-bold text-ink mb-1">No decks yet</p>
          <p className="text-sm text-ink-muted mb-5">Create your first flashcard deck to start studying</p>
          <button onClick={() => setShowNew(true)} className="btn-primary px-8">Create Deck</button>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map(d => (
            <div
              key={d.id}
              onClick={() => setStudying(d)}
              className="bg-white rounded-3xl p-4 flex items-center gap-4 border border-surface-border shadow-card cursor-pointer active:scale-[0.99] hover:shadow-card-hover transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center shrink-0">
                <Layers size={22} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink truncate">{d.title}</p>
                <p className="text-xs text-ink-muted">{(d.cards || []).length} cards · {d.author || 'You'}</p>
              </div>
              <ChevronRight size={16} className="text-ink-faint shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
