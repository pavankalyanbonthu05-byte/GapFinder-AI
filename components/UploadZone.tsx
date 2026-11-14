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
  FileCheck,
  Loader2,
} from "lucide-react";
import { Topic, DocumentChunk } from "@/lib/types";
import { extractTextFromPdf } from "@/lib/pdfExtractor";

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

  const [syllabusFileName, setSyllabusFileName] = useState<string | null>(null);
  const [notesFileName, setNotesFileName] = useState<string | null>(null);
  const [pastPapersFileName, setPastPapersFileName] = useState<string | null>(null);

  const [extractingMap, setExtractingMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: "syllabus" | "notes" | "pastPapers"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractingMap((prev) => ({ ...prev, [targetField]: true }));
    setError(null);

    try {
      let extractedText = "";

      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        extractedText = await extractTextFromPdf(file);
      } else {
        // Plain text, markdown, json
        extractedText = await file.text();
      }

      if (!extractedText.trim()) {
        throw new Error(`Could not extract readable text from "${file.name}". If this PDF is a scanned image, please paste text directly.`);
      }

      if (targetField === "syllabus") {
        setSyllabusText(extractedText);
        setSyllabusFileName(file.name);
      } else if (targetField === "notes") {
        setNotesText(extractedText);
        setNotesFileName(file.name);
      } else {
        setPastPapersText(extractedText);
        setPastPapersFileName(file.name);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || `Failed to read ${file.name}`);
    } finally {
      setExtractingMap((prev) => ({ ...prev, [targetField]: false }));
    }
  };

  const handleIngest = async () => {
    if (!syllabusText.trim() && !notesText.trim()) {
      setError("Please upload a PDF/text file or paste at least the Syllabus or Course Notes.");
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
              PDF & Text Ingestion Ready
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Diagnose Knowledge Gaps with RAG
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
            Upload your syllabus PDF, textbook chapters, and past exam papers. GapFinder will
            extract topics, estimate exam frequency, generate citation-backed questions, and isolate
            your weak spots.
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Syllabus</h3>
                <p className="text-[11px] text-slate-500">PDF, TXT, or pasted outline</p>
              </div>
            </div>

            {extractingMap.syllabus && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading PDF...
              </span>
            )}
          </div>

          <textarea
            value={syllabusText}
            onChange={(e) => {
              setSyllabusText(e.target.value);
              setSyllabusFileName(null);
            }}
            placeholder="Paste syllabus outline or upload a PDF...&#10;E.g., Chapter 1: Cellular Respiration, Glycolysis, Krebs Cycle..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition">
              <UploadCloud className="h-3.5 w-3.5 text-indigo-600" />
              <span>Choose PDF or Text</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.json,application/pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "syllabus")}
              />
            </label>

            {syllabusFileName ? (
              <span className="text-[11px] text-indigo-700 font-semibold truncate max-w-[140px] flex items-center gap-1">
                <FileCheck className="h-3 w-3 text-indigo-600 shrink-0" />
                {syllabusFileName}
              </span>
            ) : syllabusText ? (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready ({syllabusText.split(/\s+/).length} words)
              </span>
            ) : null}
          </div>
        </div>

        {/* Card 2: Notes & Chapters */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Notes & Textbooks</h3>
                <p className="text-[11px] text-slate-500">PDF, TXT, or excerpts for citations</p>
              </div>
            </div>

            {extractingMap.notes && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading PDF...
              </span>
            )}
          </div>

          <textarea
            value={notesText}
            onChange={(e) => {
              setNotesText(e.target.value);
              setNotesFileName(null);
            }}
            placeholder="Paste textbook sections, summary notes, or upload your chapter PDF...&#10;E.g., Section 9.2: Glycolysis converts glucose into pyruvate..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition">
              <UploadCloud className="h-3.5 w-3.5 text-indigo-600" />
              <span>Choose PDF or Text</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.json,application/pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "notes")}
              />
            </label>

            {notesFileName ? (
              <span className="text-[11px] text-indigo-700 font-semibold truncate max-w-[140px] flex items-center gap-1">
                <FileCheck className="h-3 w-3 text-indigo-600 shrink-0" />
                {notesFileName}
              </span>
            ) : notesText ? (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready ({notesText.split(/\s+/).length} words)
              </span>
            ) : null}
          </div>
        </div>

        {/* Card 3: Past Papers */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">3. Past Exam Papers</h3>
                <p className="text-[11px] text-slate-500">PDF or text for exam weightage</p>
              </div>
            </div>

            {extractingMap.pastPapers && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading PDF...
              </span>
            )}
          </div>

          <textarea
            value={pastPapersText}
            onChange={(e) => {
              setPastPapersText(e.target.value);
              setPastPapersFileName(null);
            }}
            placeholder="Paste past exam questions or upload past papers PDF...&#10;E.g., 2024 Exam: Explain non-cyclic photophosphorylation in PS II..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition">
              <UploadCloud className="h-3.5 w-3.5 text-indigo-600" />
              <span>Choose PDF or Text</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.json,application/pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "pastPapers")}
              />
            </label>

            {pastPapersFileName ? (
              <span className="text-[11px] text-indigo-700 font-semibold truncate max-w-[140px] flex items-center gap-1">
                <FileCheck className="h-3 w-3 text-indigo-600 shrink-0" />
                {pastPapersFileName}
              </span>
            ) : pastPapersText ? (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready ({pastPapersText.split(/\s+/).length} words)
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleIngest}
          disabled={isLoading || (!syllabusText.trim() && !notesText.trim())}
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
