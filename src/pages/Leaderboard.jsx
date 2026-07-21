import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react'
import { useApp } from '../context/AppContext'

const MEDALS = ['🥇', '🥈', '🥉']
const BG = ['from-amber-400 to-yellow-300', 'from-slate-400 to-slate-300', 'from-amber-600 to-amber-500']

export default function Leaderboard() {
  const { leaderboard, user } = useApp()
  const entries = (leaderboard || []).slice(0, 20)

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Leaderboard</h1>
        <p className="text-sm text-ink-muted">Top learners this month</p>
      </div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-8">
          {[entries[1], entries[0], entries[2]].map((e, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3
            const height = rank === 1 ? 'h-28' : rank === 2 ? 'h-20' : 'h-16'
            return (
              <div key={e?.id || i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-xl border-2 border-white shadow-card">
                  {(e?.avatar || e?.name || 'U')[0].toUpperCase()}
                </div>
                <p className="text-xs font-bold text-ink text-center truncate w-full">{e?.name || `Learner ${rank}`}</p>
                <div className={`w-full ${height} bg-gradient-to-t ${BG[rank-1]} rounded-t-2xl flex items-center justify-center shadow-card`}>
                  <span className="text-2xl">{MEDALS[rank - 1]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {entries.map((e, i) => {
          const isUser = e?.name === user?.name
          return (
            <div key={e?.id || i} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all
              ${isUser ? 'bg-brand-soft border-brand/30 shadow-card' : 'bg-white border-surface-border shadow-card'}`}>
              <span className={`text-base font-black w-6 text-center ${i < 3 ? 'text-2xl' : 'text-ink-muted'}`}>
                {i < 3 ? MEDALS[i] : `${i + 1}`}
              </span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isUser ? 'bg-brand text-white' : 'bg-surface-muted text-ink-secondary'}`}>
                {(e?.name || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${isUser ? 'text-brand' : 'text-ink'}`}>{e?.name || 'Learner'} {isUser && '(You)'}</p>
                <p className="text-xs text-ink-muted">{e?.badge || 'Learner'}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={13} className="text-amber-400" />
                <span className="text-sm font-bold text-ink">{(e?.xp || 0).toLocaleString()}</span>
              </div>
            </div>
          )
        })}
        {entries.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <Trophy size={40} className="text-ink-faint mb-3" />
            <p className="font-bold text-ink">Leaderboard is empty</p>
            <p className="text-sm text-ink-muted">Start studying to earn XP and rank up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
