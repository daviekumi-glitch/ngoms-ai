import { useState } from 'react'
import { Plus, Layers, ChevronRight, Check, X, ArrowLeft, Sparkles, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

/* ─── Card Flip Study Mode ─── */
function StudyMode({ deck, onBack }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])
  const cards = deck.cards || []

  if (!cards.length) return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <Layers size={36} className="text-ink-faint" />
      <p className="font-bold text-ink">No cards in this deck yet</p>
      <button onClick={onBack} className="btn-ghost px-6">Go Back</button>
    </div>
  )

  if (idx >= cards.length) {
    const score = results.filter(Boolean).length
    const pct   = Math.round((score / cards.length) * 100)
    return (
      <div className="flex flex-col items-center gap-5 py-8 animate-scale-in text-center">
        <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center shadow-btn">
          <Sparkles size={32} className="text-white" />
        </div>
        <div>
          <p className="text-4xl font-black text-ink">{pct}%</p>
          <p className="text-ink-muted text-sm">{score} of {cards.length} correct</p>
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={onBack} className="btn-ghost flex-1">Back</button>
          <button onClick={() => { setIdx(0); setFlipped(false); setResults([]) }} className="btn-primary flex-1">Again</button>
        </div>
      </div>
    )
  }

  const card = cards[idx]
  const answer = (correct) => {
    setResults(r => [...r, correct])
    setFlipped(false)
    setTimeout(() => setIdx(i => i + 1), 180)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Progress bar */}
      <div className="w-full flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center shrink-0">
          <ArrowLeft size={15} className="text-ink" />
        </button>
        <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${(idx / cards.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-ink-muted shrink-0">{idx + 1}/{cards.length}</span>
      </div>

      {/* Flip card */}
      <div
        className="w-full max-w-sm perspective-1000 cursor-pointer select-none"
        style={{ height: 220 }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full h-full preserve-3d transition-transform duration-500"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-surface-border shadow-float flex flex-col items-center justify-center p-6 text-center">
            <span className="chip mb-3 text-xs">Question</span>
            <p className="text-base font-bold text-ink leading-snug">{card.front}</p>
            <p className="text-xs text-ink-faint mt-4">Tap to reveal answer</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-brand to-sky-500 rounded-3xl shadow-btn flex flex-col items-center justify-center p-6 text-center">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-3">Answer</span>
            <p className="text-base font-bold text-white leading-snug">{card.back}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-muted">Tap the card to flip</p>

      {flipped && (
        <div className="flex gap-3 w-full max-w-sm animate-slide-up">
          <button
            onClick={() => answer(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 border-2 border-red-100 text-danger font-bold active:scale-95 transition-all"
          >
            <X size={17} /> Missed
          </button>
          <button
            onClick={() => answer(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-50 border-2 border-green-100 text-success font-bold active:scale-95 transition-all"
          >
            <Check size={17} /> Got it!
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ─── */
export default function Flashcards() {
  const { flashcardDecks, create, remove } = useApp()
  const [studying, setStudying] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const decks = (flashcardDecks || []).filter(d => d.status !== 'Archived')

  const handleCreate = async () => {
    if (!newTitle.trim() || creating) return
    setCreating(true)
    await create('flashcards', { title: newTitle.trim(), author: 'Me', views: 0, status: 'Active', cards: [] })
    toast.success('Deck created!')
    setNewTitle(''); setShowNew(false); setCreating(false)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await remove('flashcards', id)
    toast.success('Deck deleted')
  }

  if (studying) return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto">
      <h2 className="font-black text-xl text-ink mb-1">{studying.title}</h2>
      <p className="text-sm text-ink-muted mb-6">{(studying.cards || []).length} cards</p>
      <StudyMode deck={studying} onBack={() => setStudying(null)} />
    </div>
  )

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink">Flashcards</h1>
          <p className="text-sm text-ink-muted">{decks.length} deck{decks.length !== 1 ? 's' : ''} available</p>
        </div>
        <button onClick={() => setShowNew(true)} className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center shadow-btn active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </div>

      {showNew && (
        <div className="card mb-5 animate-slide-up">
          <p className="font-bold text-ink mb-3">New Deck</p>
          <input
            className="input mb-3"
            placeholder="Deck title (e.g. Cell Biology)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={!newTitle.trim() || creating} className="btn-primary flex-1 py-3 text-sm">
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => { setShowNew(false); setNewTitle('') }} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mb-4">
            <Layers size={28} className="text-brand" />
          </div>
          <p className="font-bold text-ink mb-1">No decks yet</p>
          <p className="text-sm text-ink-muted mb-5">Create your first flashcard deck</p>
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
                <p className="text-xs text-ink-muted mt-0.5">{(d.cards || []).length} cards · {d.author || 'You'}</p>
              </div>
              <button
                onClick={(e) => handleDelete(e, d.id)}
                className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-danger opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
              >
                <Trash2 size={13} />
              </button>
              <ChevronRight size={15} className="text-ink-faint shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
