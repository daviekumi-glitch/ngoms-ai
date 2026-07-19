import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

// Sample data (replace with real data from state/context)
const weeklyHours = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 5 },
  { day: 'Sun', hours: 2.5 },
];

const quizScores = [
  { week: 'W1', score: 78 },
  { week: 'W2', score: 82 },
  { week: 'W3', score: 85 },
  { week: 'W4', score: 90 },
  { week: 'W5', score: 88 },
  { week: 'W6', score: 92 },
];

const badges = [
  { id: 1, name: 'Speed Runner', earned: true },
  { id: 2, name: 'Quiz Master', earned: false },
  { id: 3, name: 'Night Owl', earned: true },
  { id: 4, name: 'Streak King', earned: false },
  { id: 5, name: 'Early Bird', earned: true },
  { id: 6, name: 'Perfectionist', earned: false },
];

const reportCard = { grade: 'A', attendance: '98%', avgScore: 91 };
const xpStats = { currentXP: 3450, level: 7, xpToNextLevel: 5000 };

const ProgressAnalytics = () => {
  const barGradient = (
    <defs>
      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  );

  const lineGradient = (
    <defs>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  );

  const xpPercent = (xpStats.currentXP / xpStats.xpToNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0A0F1E] text-white p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Ngoms AI – Progress & Analytics</h1>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Weekly Study Hours BarChart */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <h2 className="mb-4 text-lg font-medium">Weekly Study Hours</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={weeklyHours}
              barSize={20}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              {barGradient}
              <CartesianGrid strokeDasharray="3 3" strokeOpacity:0.2 stroke="#fff" />
              <XAxis dataKey="day" tick={{ fill: '#fff', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#fff', fontSize: 12 }}
                domain={['dataMax', 0]}
                orientation="right"
              />
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                labelStyle={{ fill: '#fff', fontSize: 12 }}
                containerStyle={{ background: 'rgba(10,15,30,0.8)', borderRadius: 8 }}
                formatter={(value) => `${value} hrs`}
              />
              <Legend verticalAlign="bottom" height={30} filler={#fff} />
              <Bar dataKey="hours" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quiz Scores LineChart */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <h2 className="mb-4 text-lg font-medium">Quiz Scores Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={quizScores}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              {lineGradient}
              <CartesianGrid strokeDasharray="3 3" strokeOpacity:0.2 stroke="#fff" />
              <XAxis dataKey="week" tick={{ fill: '#fff', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#fff', fontSize: 12 }}
                domain={['dataMin', 'dataMax']}
                orientation="right"
              />
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                labelStyle={{ fill: '#fff', fontSize: 12 }}
                containerStyle={{ background: 'rgba(10,15,30,0.8)', borderRadius: 8 }}
                formatter={(value) => `${value}%`}
              />
              <Legend verticalAlign="bottom" height={30} filler={#fff} />
              <Line type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Achievement Badges */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-8"
      >
        <h2 className="mb-4 text-lg font-medium">Achievement Badges</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                badge.earned
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300'
                  : 'bg-gray-800/50 border border-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={badge.earned ? '#fff' : '#9ca3af'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                {/* Simple star icon */}
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
              </svg>
              <div>
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-sm text-gray-400">{badge.earned ? 'Earned' : 'Locked'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Report Card & XP Bar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <h2 className="mb-4 text-lg font-medium">Weekly Report Card</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Letter Grade</span>
              <span className="font-bold text-2xl">{reportCard.grade}</span>
            </div>
            <div className="flex justify-between">
              <span>Attendance</span>
              <span>{reportCard.attendance}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Score</span>
              <span>{reportCard.avgScore}%</span>
            </div>
          </div>
        </motion.div>

        {/* XP Progress */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <h2 className="mb-4 text-lg font-medium">XP & Level</h2>
          <div className="flex items-center mb-2">
            <span className="mr-2">Level</span>
            <span className="font-bold text-xl">{xpStats.level}</span>
          </div>
          <div className="w-full bg-gray-800/30 h-2.5 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-width duration-700"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{xpStats.currentXP} XP</span>
            <span>{xpStats.xpToNextLevel - xpStats.currentXP} XP to next level</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressAnalytics;
