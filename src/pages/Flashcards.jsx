import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, ChevronLeft, ChevronRight, Trash2, Edit } from "lucide-react";

const FlashcardStudio = () => {
  const [decks, setDecks] = useState([
    { id: "1", title: "Vocabulary", cards: [], mastery: 0 },
    { id: "2", title: "Math Formulas", cards: [], mastery: 65 },
  ]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (selectedDeckId) {
      const deck = decks.find(d => d.id === selectedDeckId);
      setCards(deck ? deck.cards : []);
      setCurrentIndex(0);
      setFlip(false);
    }
  }, [selectedDeckId, decks]);

  const toggleFlip = () => setFlip(prev => !prev);
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setFlip(false);
    }
  };
  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFlip(false);
    }
  };
  const addCard = () => {
    if (newFront.trim() && newBack.trim()) {
      const newCard = { id: Date.now(), front: newFront, back: newBack, nextReview: new Date(Date.now() + 86400000).toISOString().split("T")[0], ease: 2.5 };
      setCards(prev => [...prev, newCard]);
      setNewFront("");
      setNewBack("");
      // update deck mastery placeholder
      setDecks(prev =>
        prev.map(d =>
          d.id === selectedDeckId
            ? { ...d, cards: [...d.cards, newCard], mastery: Math.min(100, d.mastery + 5) }
            : d
        )
      );
    }
  };
  const deleteCard = id => {
    setCards(prev => prev.filter(c => c.id !== id));
    setDecks(prev =>
      prev.map(d =>
        d.id === selectedDeckId
          ? {
              ...d,
              cards: d.cards.filter(c => c.id !== id),
              mastery: Math.max(0, d.mastery - 5),
            }
          : d
      )
    );
  };

  const deckMastery = selectedDeckId
    ? decks.find(d => d.id === selectedDeckId)?.mastery ?? 0
    : 0;

  const emptyState = !selectedDeckId || cards.length === 0;

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Flashcard Studio</h1>

      {/* Deck List */}
      <div className="mb-8 space-y-4">
        {decks.map(deck => (
          <motion.div
            key={deck.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedDeckId(deck.id)}
            className={`cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 transition-transform`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] rounded-lg flex items-center justify-center text-white font-medium">
                #{deck.id.slice(-1)}
              </div>
              <div>
                <h2 className="font-semibold">{deck.title}</h2>
                <p className="text-sm text-white/70">{deck.cards.length} cards</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-2 bg-white/20 rounded">
                <div
                  className={`h-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] rounded transition-all width-[${deck.mastery}%]`}
                ></div>
              </div>
              <span className="text-xs text-white/60">{deck.mastery}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Card View */}
      {!selectedDeckId ? (
        <div className="flex items-center justify-center h-96 text-white/50">
          <div className="text-center">
            <span role="img" aria-label="select a deck">📚</span>
            <p className="mt-4">Select a deck to start studying</p>
          </div>
        </div>
      ) : emptyState ? (
        <div className="flex items-center justify-center h-96 text-white/50">
          <div className="text-center">
            <span role="img" aria-label="empty flashcards">🃏</span>
            <p className="mt-4">No cards in this deck yet. Add some to begin!</p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={cards[currentIndex]?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl mx-auto"
          >
            <motion.div
              className={`w-full h-96 relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 perspective-1000`}
              style={{
                transform: `rotateY(${flip ? 180 : 0}deg)`,
                transition: { duration: 0.6 },
              }}
              onClick={toggleFlip}
              whileHover={{ cursor: "pointer" }}
            >
              <motion.div
                className={`absolute inset-0 flex items-center justify-center text-2xl font-medium backface-hidden`}
                style={{ backfaceVisibility: "hidden" }}
              >
                {flip ? (
                  cards[currentIndex]?.back ?? ""
                ) : (
                  cards[currentIndex]?.front ?? ""
                )}
              </motion.div>
              <motion.div
                className={`absolute inset-0 flex items-center justify-center text-2xl font-medium backface-hidden`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: `rotateY(180deg)`,
                }}
              >
                {flip ? (
                  cards[currentIndex]?.front ?? ""
                ) : (
                  cards[currentIndex]?.back ?? ""
                )}
              </motion.div>
            </motion.div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${currentIndex === 0 ? "bg-white/10" : "bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]"} hover:scale-105`}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </button>
              <div className="flex items-center space-x-3 text-sm">
                <span>{currentIndex + 1} / {cards.length}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{new Date(cards[currentIndex]?.nextReview ?? Date.now()).toLocaleDateString()}</span>
              </div>
              <button
                onClick={goNext}
                disabled={currentIndex >= cards.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${currentIndex >= cards.length - 1 ? "bg-white/10" : "bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]"} hover:scale-105`}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Card actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => deleteCard(cards[currentIndex]?.id ?? 0)}
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] hover:scale-105 transition-transform"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Card
            </button>
          </div>
        </AnimatePresence>
      )}

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full max-w-md bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-white/50 hover:text-white"
            >
              <Edit className="h-5 w-5" />
            </button>
            <h2 className="mb-4 text-center text-xl font-semibold">Add New Card</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Front side"
                value={newFront}
                onChange={e => setNewFront(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="Back side"
                value={newBack}
                onChange={e => setNewBack(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                onClick={addCard}
                disabled={!(newFront.trim() && newBack.trim())}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] hover:scale-105 transition-transform text-white font-medium"
              >
                Add Card
              </button>
            </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FlashcardStudio;
