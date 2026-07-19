import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Sparkles,
  Fire,
  Activity,
  X,
} from "lucide-react";

const SUBJECT_COLORS = {
  Math: "#4cc9f0",
  Physics: "#f72585",
  Chemistry: "#4cc9f0",
  Biology: "#7209b7",
  History: "#f72585",
  Literature: "#4cc9f0",
  Language: "#7209b7",
  Programming: "#f72585",
};

const StudyPlanner = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", duration: "", date: "" });
  const [streak, setStreak] = useState(0);
  const [productivityScore, setProductivityScore] = useState(0);

  // Mock data generation on mount
  useEffect(() => {
    const today = new Date();
    const mock = [
      {
        id: 1,
        subject: "Math",
        duration: 90,
        date: today.toISOString().split("T")[0],
      },
      {
        id: 2,
        subject: "History",
        duration: 60,
        date: new Date(today.setDate(today.getDate() + 1))
          .toISOString()
          .split("T")[0],
      },
      {
        id: 3,
        subject: "Programming",
        duration: 120,
        date: new Date(today.setDate(today.getDate() + 2))
          .toISOString()
          .split("T")[0],
      },
    ];
    setEvents(mock);
    calculateStreak();
    calculateProductivity();
  }, []);

  const calculateStreak = () => {
    const sorted = [...events]
      .map((e) => e.date)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
    let current = 0,
      best = 0,
      prev = null;
    sorted.forEach((d) => {
      const day = new Date(d);
      if (!prev) {
        current = 1;
      } else {
        const diff = (day - prev) / (1000 * 60 * 60 * 24);
        current = diff === 1 ? current + 1 : 1;
      }
      best = Math.max(best, current);
      prev = day;
    });
    setStreak(best);
  };

  const calculateProductivity = () => {
    const totalMinutes = events.reduce((sum, e) => sum + e.duration, 0);
    const target = 420; // 7h per week target
    const score = Math.min(100, Math.round((totalMinutes / target) * 100));
    setProductivityScore(score);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      subject: form.subject,
      duration: Number(form.duration),
      date: form.date,
    };
    setEvents([...events, newEvent]);
    setModalOpen(false);
    setForm({ subject: "", duration: "", date: "" });
    calculateStreak();
    calculateProductivity();
  };

  const handleAISuggestion = () => {
    // Placeholder for AI logic
    alert("AI schedule suggestion feature coming soon!");
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i - new Date().getDay()); // start from Sunday
    return {
      date: date.toISOString().split("T")[0],
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      isToday:
        date.toISOString().split("T")[0] ===
        new Date().toISOString().split("T")[0],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-gray-100 p-6"
    >
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Planner – Ngoms AI</h1>
        <div className="flex space-x-3">
          <motion.button
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-btn flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            Add Study Event
          </motion.button>
          <motion.button
            onClick={handleAISuggestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-btn flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Suggestion
          </motion.button>
        </div>
      </header>

      {/* Streak & Productivity */}
      <section className="flex flex-col md:flex-row md:space-x-8 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-3 p-4 bg-gray-800/50 backdrop-blur rounded-xl"
        >
          <Fire className="h-5 w-5 text-red-400" />
          <span>Streak: {streak} day{streak !== 1 ? "s" : ""}</span>
        </motion.div>

        <motion.div
          className="relative w-20 h-20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Background ring */}
          <div className="absolute inset-0 rounded-full bg-gray-700/30"></div>
          {/* Foreground ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                from -90deg at 50% 50%,
                #4cc9f0 0%,
                ${productivityScore}%
                )`,
              WebkitMask: `radial-gradient(farthest-side,transparent calc(100% - 4px), black calc(100% - 3px))`,
            }}
          ></div>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <span className="text-lg font-medium">{productivityScore}%</span>
            <br />
            <span className="text-xs opacity-70">Productivity</span>
          </div>
        </motion.div>
      </section>

      {/* 7‑Day Calendar Row */}
      <section className="mb-8">
        <motion.ul
          className="flex space-x-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {weekDays.map((day) => (
            <motion.li
              key={day.date}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center p-3 rounded-xl ${
                day.isToday
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                  : "bg-gray-800/50 backdrop-blur"
              }`}
            >
              <div className="text-sm font-medium">{day.label}</div>
              <div className="text-xs">{new Date(day.date).getDate()}</div>
              {/* Study blocks for this day */}
              <div className="mt-2 flex flex-col space-y-1 w-full">
                {events
                  .filter((e) => e.date === day.date)
                  .map((ev) => (
                    <motion.div
                      key={ev.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`h-3 w-full rounded bg-${SUBJECT_COLORS[
                        ev.subject
                      ] || "#6366f1"} opacity-90`}
                    >
                      <div className="absolute -left-1 -top-0.5 text-xs opacity-70">
                        {ev.subject}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Modal */}
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-md p-6 bg-gray-800/70 backdrop-blur rounded-xl border border-gray-700"
          >
            <motion.button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </motion.button>
            <h2 className="mb-4 text-lg font-bold">Add Study Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded"
                >
                  <option value="">Select subject</option>
                  {[...new Set(events.map((e) => e.subject))].map(
                    (sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded"
                />
              </div>
