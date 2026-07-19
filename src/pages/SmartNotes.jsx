import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  List,
  File,
  Brain,
  Zap,
  Download,
} from "lucide-react";

const SmartNotes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      subject: "Mathematics",
      title: "Quadratic Equations",
      preview:
        "Learn how to solve ax²+bx+c=0 using factoring, completing the square, and the quadratic formula.",
      content: "",
    },
    {
      id: 2,
      subject: "History",
      title: "World War II Causes",
      preview:
        "Explore the political, economic, and social factors that led to the outbreak of WWII in 1939.",
      content: "",
    },
    {
      id: 3,
      subject: "Biology",
      title: "Cell Structure",
      preview:
        "Overview of prokaryotic vs eukaryotic cells, organelles, and their functions.",
      content: "",
    },
  ]);
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id ?? null);
  const [tab, setTab] = useState("summary"); // summary, bullets, cornell, mindmap
  const [filterSubject, setFilterSubject] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    // Simulate AI call
    await new Promise((r) => setTimeout(r, 1500));
    if (activeNote) {
      const aiContent = `AI-generated ${tab} notes for "${activeNote.title}"`;
      setNotes(
        notes.map((n) =>
          n.id === activeNoteId ? { ...n, content: aiContent } : n
        )
      );
    }
    setIsGenerating(false);
  }, [activeNote, tab, notes, activeNoteId]);

  const handleExportPDF = useCallback(() => {
    setExporting(true);
    // Simulate PDF generation
    setTimeout(() => {
      setExporting(false);
      alert("PDF exported!");
    }, 1200);
  }, []);

  const filteredNotes = notes.filter(
    (n) =>
      filterSubject === "all" || n.subject.toLowerCase() === filterSubject
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0A0F1E] text-white p-6 flex gap-6"
    >
      {/* Sidebar: Note List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 space-y-4"
      >
        {/* Subject Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterSubject("all")}
            className={`px-3 py-1 rounded-full text-xs ${
              filterSubject === "all"
                ? "bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white"
                : "bg-[#1E293B]/50 hover:bg-[#1E293B]/70"
            }`}
          >
            All
          </button>
          {[...new Set(notes.map((n) => n.subject.toLowerCase()))].map(
            (subject) => (
              <button
                key={subject}
                onClick={() => setFilterSubject(subject)}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterSubject === subject
                    ? "bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white"
                    : "bg-[#1E293B]/50 hover:bg-[#1E293B]/70"
                }`}
              >
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Note Cards */}
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <motion.li
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer p-4 rounded-xl bg-[#111827]/40 backdrop-blur-sm border border-[#1E293B]/30 hover:bg-[#1E293B]/50 transition-colors"
              onClick={() => setActiveNoteId(note.id)}
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-[#94A3B8]">{note.subject}</span>
                  {activeNoteId === note.id && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {}}
                      className="p-1 rounded-full bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30"
                    >
                      <FileText className="h-4 w-4 text-white" />
                    </motion.button>
                  )}
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">
                  {note.preview}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
            </motion.li>
          ))}
        </div>
      </motion.div>

      {/* Main Editor */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-2 space-y-5"
      >
        {/* Tabs */}
        <div className="flex gap-2">
          {["summary", "bullets", "cornell", "mindmap"].map((t) => (
            <motion.button
              key={t}
              onClick={() => setTab(t)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white shadow-lg"
                  : "bg-[#111827]/40 backdrop-blur-sm border border-[#1E293B]/30 hover:bg-[#1E293B]/50"
              }`}
            >
              {t === "summary" && (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {t === "bullets" && (
                <List className="mr-2 h-4 w-4" />
              )}
              {t === "cornell" && (
                <File className="mr-2 h-4 w-4" />
              )}
              {t === "mindmap" && (
                <Brain className="mr-2 h-4 w-4" />
              )}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Editable Textarea */}
        <motion.textarea
          value={activeNote?.content ?? ""}
          onChange={(e) => {
            if (activeNote) {
              setNotes(
                notes.map((n) =>
                  n.id === activeNote.id ? { ...n, content: e.target.value } : n
                )
              );
            }
          }}
          placeholder="Start writing or click AI Generate..."
          className="flex-1 p-4 w-full resize-none rounded-xl bg-[#111827]/40 backdrop-blur-sm border border-[#1E293B]/30 text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
          style={{ minHeight: 200 }}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleGenerate}
            disabled={!activeNote || isGenerating}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
              isGenerating
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white shadow-lg"
            }`}
          >
            {isGenerating ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                AI Generate
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleExportPDF}
            disabled={exporting}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
              exporting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg"
            }`}
          >
            {exporting ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-pulse" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartNotes;
