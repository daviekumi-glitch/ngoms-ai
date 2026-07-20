import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Trash2, Layers, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Flashcards() {
  const { flashcardDecks, create, remove, loading, isFeatureEnabled, user } = useApp()
  const [activeDeck, setActiveDeck] = useState(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [deckCards, setDeckCards] = useState([])
  const [cardFront, setCardFront] = useState('')
  const [cardBack, setCardBack] = useState('')
  const [creating, setCreating] = useState(false)

  if (!isFeatureEnabled('flashcards')) {
    return <div className="p-6 text-center text-white/40">Flashcard Studio is currently disabled by admin.</div>
  }

  const handleCreateDeck = async () => {
    if (!deckName.trim() || deckCards.length === 0) return
    setCreating(true)
    await create('flashcards', {
      title: deckName,
      author: user?.name || 'User',
      cards: deckCards.length,
      views: 0,
      status: 'published',
    })
    // Save cards to localStorage for this deck
    const deckId = `deck_${Date.now()}`
    localStorage.setItem(`ngoms_deck_${deckId}`, JSON.stringify(deckCards))
    setDeckName('')
    setDeckCards([])
    setCreating(false)
    setShowCreate(false)
  }

  const addCard = () => {
    if (!cardFront.trim() || !cardBack.trim()) return
    setDeckCards([...deckCards, { front: cardFront, back: cardBack }])
    setCardFront('')
    setCardBack('')
  }

  // Deck view
  if (activeDeck) {
    const cards = Array.from({ length: activeDeck.cards || 5 }, (_, i) => ({
      front: `Concept ${i + 1}: ${activeDeck.title}`,
      back: `Explanation for concept ${i + 1}. This is the detailed answer for ${activeDeck.title}.`,
    }))
    const card = cards[cardIdx] || cards[0]

    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setActiveDeck(null); setCardIdx(0); setFlipped(false) }}
            className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{activeDeck.title}</h1>
            <p className="text-white/40 text-xs">Card {cardIdx + 1} of {cards.length} · {activeDeck.author || 'Unknown'}</p>
          </div>
        </div>

        <div className="relative" style={{ perspective: '1000px' }}>
          <div onClick={() => setFlipped(!flipped)}
            className="glass rounded-3xl p-8 min-h-[240px] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-transform"
            style={{ transform: flipped ? 'rotateY(180deg)' : 'none', transformStyle: 'preserve-3d', transition: 'transform 0.3s' }}>
            <div className="text-center" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-2">{flipped ? 'Answer' : 'Question'}</p>
              <p className="text-white font-bold text-lg">{flipped ? card?.back : card?.front}</p>
            </div>
          </div>
        </div>

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

        <button onClick={() => { if (confirm('Delete this deck?')) { remove('flashcards', activeDeck.id); setActiveDeck(null) } }}
          className="w-full mt-5 py-2.5 rounded-xl glass text-red-400 text-sm font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Trash2 size={14} /> Delete Deck
        </button>
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
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
          <Plus size={16} /> New Deck
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (flashcardDecks || []).length === 0 ? (
        <div className="text-center py-20">
          <Layers size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No flashcard decks yet</p>
          <p className="text-white/20 text-xs mt-1">Create a deck to start studying</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {flashcardDecks.map((d) => (
            <div key={d.id} onClick={() => { setActiveDeck(d); setCardIdx(0); setFlipped(false) }}
              className="glass p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                <Layers size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/40 text-xs">{d.cards || 0} cards</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{d.views || 0} views</span>
                  {d.author && (<><span className="text-white/20 text-xs">·</span><span className="text-white/40 text-xs">{d.author}</span></>)}
                </div>
              </div>
              <ChevronRight size={18} className="text-white/30" />
            </div>
          ))}
        </div>
      )}

      {/* Create Deck Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowCreate(false)}>
          <div className="glass rounded-2xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Create Flashcard Deck</h2>
              <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Deck Name</label>
                <input value={deckName} onChange={e => setDeckName(e.target.value)} placeholder="e.g. Biology Chapter 1" className="input-field" />
              </div>
              {deckCards.length > 0 && (
                <div className="glass p-3 rounded-xl space-y-2 max-h-32 overflow-y-auto">
                  {deckCards.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-white/60 truncate flex-1">{c.front}</span>
                      <button onClick={() => setDeckCards(deckCards.filter((_, j) => j !== i))}
                      className="text-red-400/60 hover:text-red-400 ml-2 shrink-0"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-white/10 pt-3">
                <p className="text-white/50 text-xs font-semibold mb-2 uppercase">Add Card</p>
                <input value={cardFront} onChange={e => setCardFront(e.target.value)} placeholder="Front (question)" className="input-field mb-2" />
                <input value={cardBack} onChange={e => setCardBack(e.target.value)} placeholder="Back (answer)" className="input-field mb-2" />
                <button onClick={addCard} disabled={!cardFront.trim() || !cardBack.trim()}
                  className="w-full py-2 rounded-xl glass text-white/70 text-sm font-semibold active:scale-95 transition-transform disabled:opacity-50">
                  + Add Card ({deckCards.length})
                </button>
              </div>
              <button onClick={handleCreateDeck} disabled={creating || !deckName.trim() || deckCards.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform disabled:opacity-50">
                {creating ? 'Creating...' : `Create Deck (${deckCards.length} cards)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
