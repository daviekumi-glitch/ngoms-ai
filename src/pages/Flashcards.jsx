import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Trash2, Layers } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Flashcards() {
  const { flashcardDecks, create, remove, loading, isFeatureEnabled } = useApp()
  const [activeDeck, setActiveDeck] = useState(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!isFeatureEnabled('flashcards')) {
    return <div className="p-6 text-center text-white/40">Flashcard Studio is currently disabled by admin.</div>
  }

  // Deck view
  if (activeDeck) {
    const cards = Array.from({ length: activeDeck.cards || 5 }, (_, i) => ({
      front: `Concept ${i + 1}: ${activeDeck.title}`,
      back: `Explanation for concept ${i + 1}. This is the detailed answer.`,
    }))
    const card = cards[cardIdx]

    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setActiveDeck(null); setCardIdx(0); setFlipped(false) }}
            className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{activeDeck.title}</h1>
            <p className="text-white/40 text-xs">Card {cardIdx + 1} of {cards.length}</p>
          </div>
        </div>

        {/* Flip card */}
        <div className="relative" style={{ perspective: '1000px' }}>
          <div
            onClick={() => setFlipped(!flipped)}
            className="glass rounded-3xl p-8 min-h-[240px] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-transform"
            style={{ transform: flipped ? 'rotateY(180deg)' : 'none', transformStyle: 'preserve-3d', transition: 'transform 0.3s' }}
          >
            <div className="text-center" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-2">{flipped ? 'Answer' : 'Question'}</p>
              <p className="text-white font-bold text-lg">{flipped ? card.back : card.front}</p>
            </div>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button onClick={() => { setCardIdx(Math.max(0, cardIdx - 1)); setFlipped(false) }}
            disabled={cardIdx === 0}
            className="glass p-3 rounded-xl text-white/60 disabled:opacity-30 active:scale-90 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <span className="text-white/40 text-sm">{cardIdx + 1} / {cards.length}</span>
          <button onClick={() => { setCardIdx(Math.min(cards.length - 1, cardIdx + 1)); setFlipped(false) }}
            disabled={cardIdx === cards.length - 1}
            className="glass p-3 rounded-xl text-white/60 disabled:opacity-30 active:scale-90 transition-transform">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Flashcards</h1>
          <p className="text-white/40 text-sm mt-0.5">Spaced repetition decks</p>
        </div>
        <button onClick={() => create('flashcardDecks', { title: 'New Deck', cards: 10, author: 'Davie Kuminga', views: 0, status: 'draft' })}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold active:scale-95 transition-transform">
          <Plus size={16} /> New
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (flashcardDecks || []).length === 0 ? (
        <div className="text-center py-20">
          <Layers size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No flashcard decks yet</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {(flashcardDecks || []).map((d) => (
            <div key={d.id} className="glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => { setActiveDeck(d); setCardIdx(0); setFlipped(false) }}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet to-purple-500 flex items-center justify-center shrink-0">
                <Layers size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{d.title}</p>
                <p className="text-white/40 text-xs">{d.cards || 0} cards · {d.views || 0} views</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); remove('flashcardDecks', d.id) }}
                className="p-2 text-white/30 hover:text-red-400 active:scale-90 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
