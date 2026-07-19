import { motion } from 'framer-motion';
import { Crown, ChevronUp, ChevronDown } from 'lucide-react';

const Leaderboard = ({ leaderboard, currentUserId = null }) => {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0A0F1E] p-6 text-white"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Filters */}
        <div className="w-full flex flex-wrap items-center gap-4">
          <select
            className="bg-[#1A1F2E]/80 backdrop-blur-sm border border-[#3B82F6]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">All Institutions</option>
            {/* Additional options could be injected via props */}
          </select>
          <div className="flex flex-wrap gap-2">
            {/* Subject chips - static example; could be dynamic */}
            {['Math', 'Science', 'English'].map((subj) => (
              <button
                key={subj}
                className={`px-3 py-1 rounded-full text-xs ${
                  subj === 'Math'
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]'
                    : 'bg-[#1A1F2E]/80 border border-[#3B82F6]/30'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Podium */}
        <div className="relative w-full max-w-4xl flex justify-center items-end gap-4">
          {top3.map((user, idx) => {
            const placement = idx + 1;
            const bgColor =
              placement === 1
                ? '#FFD700'
                : placement === 2
                ? '#C0C0C0'
                : placement === 3
                ? '#CD7F32'
                : '';
            return (
              <motion.div
                key={user.id}
                className="flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full text-white font-bold ${
                    placement === 1
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]'
                      : placement === 2
                      ? 'bg-gradient-to-r from-[#C0C0C0] to-[#A9A9A9]'
                      : placement === 3
                      ? 'bg-gradient-to-r from-[#CD7F32] to-[#B8860B]'
                      : ''
                  }`}
                >
                  {user.avatarInitials}
                </div>
                <div className="mt-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Crown className={`w-4 h-4 ${placement === 1 ? 'text-yellow-400' : placement === 2 ? 'text-gray-400' : 'text-orange-400'}`} />
                    <span className="text-sm font-medium">{placement}</span>
                  </div>
                  <p className="mt-1 text-xs">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.xp} XP</p>
                </div>
                {/* Weekly change indicator */}
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {user.weeklyChange >= 0 ? (
                    <>
                      <ChevronUp className="w-3 h-3 text-green-400" />
                      <span>+{user.weeklyChange}</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 text-red-400" />
                      <span>{user.weeklyChange}</span>
                    </>
                  )}
                </div>
                {/* Podium base */}
                <div
                  className="absolute bottom-0 w-20 h-2 bg-gray-800 opacity-50"
                  style={{
                    transform: `translateX(${placement === 1 ? -10 : placement === 2 ? 0 : 10}px)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Ranked list */}
        <div className="w-full max-w-4xl space-y-2">
          {rest.map((user) => {
            const isCurrent = user.id === currentUserId;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rest.indexOf(user) * 0.05, duration: 0.4 }}
                className={`flex items-center p-3 rounded-lg bg-[#1A1F2E]/80 backdrop-blur-sm border ${
                  isCurrent
                    ? 'border-2 bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]/20'
                    : 'border-transparent'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]">
                  {user.avatarInitials}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.institution} • {user.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{user.xp} XP</p>
                      <p className="text-xs">
                        {user.weeklyChange >= 0 ? (
                          <>
                            <ChevronUp className="w-3 h-3 inline-block text-green-400 mr-1" />
                            +{user.weeklyChange}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 inline-block text-red-400 mr-1" />
                            {user.weeklyChange}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-10 text-right text-xs font-medium">{rest.indexOf(user) + 4}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
