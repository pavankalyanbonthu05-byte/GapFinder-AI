"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { GapDiagnosisReport, TopicGap } from "@/lib/types";

interface GapReportProps {
  report: GapDiagnosisReport;
  onOpenExplainTopic: (topicId: string, topicName: string) => void;
  onGoToPlan: () => void;
}

export const GapReportCard: React.FC<GapReportProps> = ({
  report,
  onOpenExplainTopic,
  onGoToPlan,
}) => {
  return (
    <div className="space-y-6">
      {/* High-Level Diagnostic Summary */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                AI Gap Diagnosis
              </span>
              <span className="text-xs text-slate-400">
                Generated {new Date(report.timestamp).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Topic Mastery & Vulnerability Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {report.summaryDiagnosis}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-center rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4 min-w-[100px]">
              <span className="text-3xl font-extrabold text-indigo-700">
                {report.overallScore}%
              </span>
              <span className="text-[11px] font-semibold text-indigo-900 mt-0.5">Overall Score</span>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-rose-700">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>{report.weakTopicsCount} Weak (&lt;50%)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>{report.mediumTopicsCount} Medium (50-75%)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{report.strongTopicsCount} Strong (&gt;75%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500">
            Below is the topic-level diagnosis. Focus immediately on the 🔴 Weak topics with high exam weightage.
          </p>
          <button
            onClick={onGoToPlan}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <span>View 5-Day Prioritized Revision Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Diagnostic Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {report.topicGaps.map((gap) => {
          const isWeak = gap.masteryLevel === "WEAK";
          const isMedium = gap.masteryLevel === "MEDIUM";
          const isStrong = gap.masteryLevel === "STRONG";

          let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
          let badgeText = "🟢 Strong Mastery";
          let borderColor = "border-emerald-200/80";

          if (isWeak) {
            badgeColor = "bg-rose-100 text-rose-800 border-rose-200";
            badgeText = "🔴 Critical Weakness";
            borderColor = "border-rose-300";
          } else if (isMedium) {
            badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
            badgeText = "🟡 Moderate Gap";
            borderColor = "border-amber-300";
          }

          return (
            <div
              key={gap.topicId}
              className={`flex flex-col rounded-2xl border ${borderColor} bg-white p-5 shadow-xs transition hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{gap.topicName}</h3>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-slate-900">{gap.scorePercentage}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {gap.correctQuestions}/{gap.totalQuestions} Correct
                  </span>
                </div>
              </div>

              {/* Exam Weightage Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[11px] font-medium text-slate-600">
                  <span>Exam Weightage: {gap.examWeightage}%</span>
                  <span className="font-semibold text-indigo-600">
                    Priority Score: {Math.round((100 - gap.scorePercentage) * (gap.examWeightage / 100))}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      isWeak ? "bg-rose-500" : isMedium ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${gap.scorePercentage}%` }}
                  />
                </div>
              </div>

              {/* Diagnosis Reasoning */}
              <div className="flex-1 space-y-2 mb-4">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Clinical Diagnosis:</span>
                  <p className="text-slate-600 leading-relaxed">{gap.reasoning}</p>
                </div>

                {gap.missedSubtopics && gap.missedSubtopics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Concepts to patch:</span>
                    {gap.missedSubtopics.map((sub, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200/50"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Explain Topic Assistant Trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 line-clamp-1">
                  {gap.recommendedAction}
                </span>

                <button
                  onClick={() => onOpenExplainTopic(gap.topicId, gap.topicName)}
                  className="flex items-center gap-1.5 shrink-0 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition border border-indigo-200/60"
                  title="Ask RAG assistant to explain this topic with citations"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Explain Topic</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
