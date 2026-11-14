"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { QuizQuestion, StudentAnswer, Topic, DocumentChunk } from "@/lib/types";

interface DiagnosticQuizProps {
  questions: QuizQuestion[];
  topics: Topic[];
  chunks: DocumentChunk[];
  isLoading?: boolean;
  onQuizCompleted: (answers: StudentAnswer[]) => void;
  onRetest: () => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  questions,
  topics,
  chunks,
  isLoading = false,
  onQuizCompleted,
  onRetest,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showFeedback) return; // locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleComplete = () => {
    const totalAnswered = Object.keys(selectedAnswers).length;
    if (totalAnswered < questions.length) {
      if (
        !confirm(
          `You have answered ${totalAnswered} of ${questions.length} questions. Submit anyway to generate diagnosis?`
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    setShowFeedback(true);

    const answersList: StudentAnswer[] = questions.map((q) => {
      const chosen = selectedAnswers[q.id];
      const isCorrect = chosen === q.correctAnswerIndex;
      return {
        questionId: q.id,
        selectedOptionIndex: chosen !== undefined ? chosen : -1,
        isCorrect: isCorrect,
        topicId: q.topicId,
        subtopicId: q.subtopicId,
      };
    });

    // Trigger celebratory confetti if score is reasonable
    const correctCount = answersList.filter((a) => a.isCorrect).length;
    if (correctCount >= Math.ceil(questions.length * 0.5)) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onQuizCompleted(answersList);
    }, 1200);
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-white p-12 text-center shadow-xs space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Sparkles className="h-7 w-7 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900">
            Generating Grounded Diagnostic Questions...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Groq AI is analyzing your uploaded topics and weighting questions according to exam frequency.
            Extracting exact textbook citations and section references...
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-indigo-600">
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Grounded Diagnostic Assessment
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> 100% Sourced from Material
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Topic-Level Diagnostic Examination
          </h2>
          <p className="text-xs text-slate-500">
            Every question tests critical concepts with verbatim citations to your uploaded books and
            notes. Answer carefully to reveal your blind spots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">
            {Object.keys(selectedAnswers).length} of {questions.length} answered
          </span>
          <button
            onClick={handleComplete}
            disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {isSubmitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Generating Diagnosis...</span>
              </>
            ) : (
              <>
                <span>Submit & View Gap Report</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-5">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = selectedOption !== undefined;

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-slate-300"
            >
              {/* Question metadata badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                    {qIndex + 1}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {q.topicName}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">{q.subtopicName}</span>
                </div>

                {/* Grounded Citation Badge */}
                <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 text-[11px] text-indigo-700">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="font-semibold">{q.citation.section}</span>
                  <span className="text-indigo-400">({q.citation.pageOrChapter})</span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-4 leading-relaxed">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 mb-4">
                {q.options.map((opt, oIndex) => {
                  const isSelected = selectedOption === oIndex;
                  const isCorrect = oIndex === q.correctAnswerIndex;

                  let optionStyle =
                    "border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 text-slate-800";

                  if (showFeedback) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-50/80 text-rose-950 ring-1 ring-rose-500";
                    } else {
                      optionStyle = "border-slate-200 bg-slate-50 opacity-60 text-slate-600";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500";
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleSelectOption(q.id, oIndex)}
                      disabled={showFeedback}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                          showFeedback && isCorrect
                            ? "bg-emerald-600 text-white"
                            : showFeedback && isSelected && !isCorrect
                            ? "bg-rose-600 text-white"
                            : isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-slate-300 text-slate-700"
                        }`}
                      >
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt}</span>

                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="ml-auto h-4 w-4 shrink-0 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Grounded Citation & Explanation box (shown when submitted) */}
              {showFeedback && (
                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>Source Grounding Verification (RAG Citation):</span>
                  </div>
                  <p className="text-slate-700 italic border-l-2 border-indigo-400 pl-3 py-0.5">
                    "{q.citation.verbatimSnippet}"
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Reference: {q.citation.documentTitle} • {q.citation.section} • {q.citation.pageOrChapter}
                  </p>
                  <div className="pt-2 border-t border-indigo-100/70 text-slate-800">
                    <span className="font-semibold text-indigo-950">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600">
            Progress: <span className="font-bold text-slate-900">{Object.keys(selectedAnswers).length}</span> /{" "}
            {questions.length} questions answered
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showFeedback && (
            <button
              onClick={onRetest}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Quiz</span>
            </button>
          )}

          <button
            onClick={handleComplete}
            disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {isSubmitting ? "Generating Diagnosis..." : "Submit & View Gap Diagnosis"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
