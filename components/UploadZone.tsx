"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { Topic, DocumentChunk } from "@/lib/types";

interface UploadZoneProps {
  onIngestionComplete: (topics: Topic[], chunks: DocumentChunk[]) => void;
  onLoadSample: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onIngestionComplete,
  onLoadSample,
}) => {
  const [syllabusText, setSyllabusText] = useState("");
  const [notesText, setNotesText] = useState("");
  const [pastPapersText, setPastPapersText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setter(content || "");
    };
    reader.readAsText(file);
  };

  const handleIngest = async () => {
    if (!syllabusText.trim() && !notesText.trim()) {
      setError("Please paste or upload at least the Syllabus or Course Notes text.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabusText,
          notesText,
          pastPapersText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ingestion failed");

      if (data.topics && data.topics.length > 0) {
        onIngestionComplete(data.topics, data.chunks || []);
      } else {
        throw new Error("No topics could be extracted. Try providing clearer topic titles.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process materials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Demo Load */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-200 border border-indigo-400/30">
              Turnkey Demo Ready
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Diagnose Knowledge Gaps with RAG
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
            Upload your syllabus, textbook sections, and past papers. GapFinder will map topics,
            estimate exam frequency, generate citation-backed diagnostic questions, and find your weak spots.
          </p>
        </div>

        <button
          onClick={onLoadSample}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-950 transition hover:bg-indigo-50 hover:shadow-md shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Load Biology Course Demo</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Syllabus */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Syllabus</h3>
              <p className="text-[11px] text-slate-500">Topics & subtopics outline</p>
            </div>
          </div>

          <textarea
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
            placeholder="Paste syllabus topics or table of contents...&#10;E.g., Chapter 1: Cellular Respiration, Glycolysis, Krebs Cycle..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="cursor-pointer text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
              Upload file (.txt / .md)
              <input
                type="file"
                accept=".txt,.md,.json"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setSyllabusText)}
              />
            </label>
            {syllabusText && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Notes & Chapters */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">2. Notes & Textbooks</h3>
              <p className="text-[11px] text-slate-500">Source truth for citations</p>
            </div>
          </div>

          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Paste chapter excerpts, summary notes, or definitions...&#10;E.g., Section 9.2: Glycolysis converts glucose into pyruvate..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="cursor-pointer text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
              Upload file (.txt / .md)
              <input
                type="file"
                accept=".txt,.md,.json"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setNotesText)}
              />
            </label>
            {notesText && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Past Papers */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3. Past Exam Papers</h3>
              <p className="text-[11px] text-slate-500">Determines exam weightage</p>
            </div>
          </div>

          <textarea
            value={pastPapersText}
            onChange={(e) => setPastPapersText(e.target.value)}
            placeholder="Paste past exam questions or past paper titles...&#10;E.g., 2024 Exam Q1: Explain non-cyclic photophosphorylation in PS II..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="cursor-pointer text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
              Upload file (.txt / .md)
              <input
                type="file"
                accept=".txt,.md,.json"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setPastPapersText)}
              />
            </label>
            {pastPapersText && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleIngest}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing Syllabus & Chunks with Groq...</span>
            </>
          ) : (
            <>
              <span>Build Topic Map & Index Chunks</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
