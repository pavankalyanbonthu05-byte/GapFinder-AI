"use client";

import React from "react";
import {
  Layers,
  ChevronRight,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  BookMarked,
  FileSearch,
} from "lucide-react";
import { Topic } from "@/lib/types";

interface TopicMapTreeProps {
  topics: Topic[];
  questionsCount?: number;
  isGeneratingQuiz?: boolean;
  onStartQuiz: () => void;
}

export const TopicMapTree: React.FC<TopicMapTreeProps> = ({
  topics,
  questionsCount = 0,
  isGeneratingQuiz = false,
  onStartQuiz,
}) => {
  const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Extracted Knowledge Map
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {topics.length} Core Modules • {totalSubtopics} Subtopics
            </span>
            {isGeneratingQuiz ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 animate-pulse bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                <Sparkles className="h-3 w-3 animate-spin" /> Generating Quiz from Weightage...
              </span>
            ) : questionsCount > 0 ? (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ {questionsCount} Grounded Qs Ready
              </span>
            ) : null}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Curriculum Structure & Exam Weightage
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Syllabus parsed into hierarchical concepts. Past exam papers have been cross-referenced
            to reveal high-frequency examination topics.
          </p>
        </div>

        <button
          onClick={onStartQuiz}
          disabled={isGeneratingQuiz}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isGeneratingQuiz
              ? "Generating Grounded Quiz..."
              : `Launch Grounded Diagnostic Quiz (${questionsCount} Qs)`}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {topics.map((topic, idx) => (
          <div
            key={topic.id}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-indigo-200"
          >
            {/* Topic Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {topic.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {idx + 1}. {topic.name}
                </h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-extrabold text-indigo-700">
                  {topic.examWeightage}% Exam Weight
                </span>
              </div>
            </div>

            {/* Weight Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: `${topic.examWeightage}%` }}
              />
            </div>

            {/* Subtopics list */}
            <div className="space-y-2.5 flex-1">
              {topic.subtopics.map((sub) => {
                const isHigh = sub.examFrequency === "HIGH";
                const isMed = sub.examFrequency === "MEDIUM";

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-200/60 transition hover:bg-white hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        {sub.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isHigh ? (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/60">
                            <Flame className="h-3 w-3 text-rose-500" />
                            High Yield
                          </span>
                        ) : isMed ? (
                          <span className="inline-flex items-center rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/60">
                            Medium
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            Low
                          </span>
                        )}

                        <span className="text-[10px] text-slate-500 font-medium">
                          {sub.pastQuestionsCount} past Qs
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
