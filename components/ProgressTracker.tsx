"use client";

import React from "react";
import { TrendingUp, Award, Clock, ArrowUpRight, ArrowDownRight, Minus, RotateCcw, Target } from "lucide-react";
import { QuizAttempt } from "@/lib/types";

interface ProgressTrackerProps {
  attempts: QuizAttempt[];
  onTakeRetest: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  attempts,
  onTakeRetest,
}) => {
  if (!attempts || attempts.length === 0) {
    return null;
  }

  const latestAttempt = attempts[attempts.length - 1];
  const firstAttempt = attempts[0];
  const scoreDiff = latestAttempt.scorePercentage - firstAttempt.scorePercentage;
  const isMultiAttempt = attempts.length > 1;

  // Extract all unique topic names across attempts
  const allTopicNames = Array.from(
    new Set(
      attempts.flatMap((a) => a.topicBreakdown.map((t) => t.topicName))
    )
  );

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Progress Dashboard
            </span>
            <span className="text-xs text-slate-400">
              {attempts.length} {attempts.length === 1 ? "attempt" : "diagnostic attempts"} recorded
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Diagnostic Attempt History & Mastery Trend
          </h3>
          <p className="text-xs text-slate-500">
            Track how your diagnostic scores evolve as you study and re-test on newly generated questions.
          </p>
        </div>

        <button
          onClick={onTakeRetest}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 px-4 py-2 text-xs font-bold transition shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Take New Diagnostic Test</span>
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 block">Baseline (Attempt 1)</span>
          <span className="text-2xl font-black text-slate-800">{firstAttempt.scorePercentage}%</span>
        </div>

        <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-3.5">
          <span className="text-[11px] font-semibold text-indigo-700 block">
            Latest (Attempt {latestAttempt.attemptNumber})
          </span>
          <span className="text-2xl font-black text-indigo-700">{latestAttempt.scorePercentage}%</span>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 block">Net Improvement</span>
          <div className="flex items-center gap-1 mt-0.5">
            {scoreDiff > 0 ? (
              <>
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                <span className="text-2xl font-black text-emerald-600">+{scoreDiff}%</span>
              </>
            ) : scoreDiff < 0 ? (
              <>
                <ArrowDownRight className="h-4 w-4 text-rose-600" />
                <span className="text-2xl font-black text-rose-600">{scoreDiff}%</span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-slate-500" />
                <span className="text-2xl font-black text-slate-700">0%</span>
              </>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 block">Last Attempt Date</span>
          <span className="text-xs font-bold text-slate-700 block mt-1.5 truncate">
            {new Date(latestAttempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{" "}
            {new Date(latestAttempt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Attempt History List */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Attempt-by-Attempt Breakdown
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-left">Attempt #</th>
                <th scope="col" className="px-4 py-2.5 text-left">Date & Time</th>
                <th scope="col" className="px-4 py-2.5 text-left">Overall Score</th>
                <th scope="col" className="px-4 py-2.5 text-left">Correct / Total</th>
                <th scope="col" className="px-4 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {attempts.map((att) => {
                const isPassed = att.scorePercentage >= 70;
                return (
                  <tr key={att.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-2.5 font-bold text-slate-800">
                      Attempt {att.attemptNumber}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">
                      {new Date(att.timestamp).toLocaleDateString()} {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2.5 font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-mono ${
                        att.scorePercentage >= 75
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : att.scorePercentage >= 50
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {att.scorePercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {att.correctQuestions} / {att.totalQuestions} questions
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPassed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {isPassed ? "Exam Ready" : "Gaps Remaining"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Topic Evolution (if multi-attempt) */}
      {isMultiAttempt && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Topic Mastery Evolution Across Attempts
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allTopicNames.map((topicName) => {
              const scores = attempts.map((a) => {
                const match = a.topicBreakdown.find((tb) => tb.topicName === topicName);
                return match ? match.scorePercentage : null;
              });

              const firstScore = scores.find((s) => s !== null) ?? 0;
              const lastScore = scores.slice().reverse().find((s) => s !== null) ?? 0;
              const diff = lastScore - firstScore;

              return (
                <div
                  key={topicName}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate pr-2" title={topicName}>
                      {topicName}
                    </span>
                    <div className="flex items-center gap-1 shrink-0 font-bold">
                      <span className="text-slate-500 font-mono">{firstScore}%</span>
                      <span className="text-slate-300">➔</span>
                      <span className={`font-mono ${
                        lastScore >= 75 ? "text-emerald-700" : lastScore >= 50 ? "text-amber-700" : "text-rose-700"
                      }`}>
                        {lastScore}%
                      </span>
                      {diff > 0 && (
                        <span className="text-[10px] text-emerald-600 font-extrabold ml-1">
                          (+{diff}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Dots/Timeline */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {attempts.map((att) => {
                      const tb = att.topicBreakdown.find((t) => t.topicName === topicName);
                      const sc = tb ? tb.scorePercentage : 0;
                      return (
                        <div
                          key={att.id}
                          className="flex-1 text-center"
                          title={`Attempt ${att.attemptNumber}: ${sc}%`}
                        >
                          <div
                            className={`h-2 rounded-full ${
                              sc >= 75
                                ? "bg-emerald-500"
                                : sc >= 50
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            A{att.attemptNumber}: {sc}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
