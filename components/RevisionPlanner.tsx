"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Clock,
  BookOpen,
  CheckCircle,
  Flame,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { StudyPlanDay, GapDiagnosisReport } from "@/lib/types";

interface RevisionPlannerProps {
  report: GapDiagnosisReport;
  onRetest: () => void;
  onOpenExplainTopic: (topicId: string, topicName: string) => void;
}

export const RevisionPlanner: React.FC<RevisionPlannerProps> = ({
  report,
  onRetest,
  onOpenExplainTopic,
}) => {
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});

  const toggleDayComplete = (dayNumber: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = report.revisionPlan.length || 5;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Personalized Treatment Plan
            </span>
            <span className="text-xs text-slate-500 font-medium">
              5 Days • 2 Hours/Day • Exam-Prioritized
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Dynamic Adaptive Revision Schedule
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Calculated from: <code>Exam Importance × Topic Vulnerability</code>. Completing these high-impact
            modules maximizes your score in minimal study time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="font-bold text-slate-900">{completedCount} of {totalDays}</span> Days Completed
          </div>
          <button
            onClick={onRetest}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-indigo-600" />
            <span>Retake Diagnostic Test</span>
          </button>
        </div>
      </div>

      {/* Days Stack */}
      <div className="space-y-4">
        {report.revisionPlan.map((day, idx) => {
          const isDone = completedDays[day.dayNumber];

          return (
            <div
              key={day.dayNumber || idx}
              className={`rounded-2xl border p-5 transition-all ${
                isDone
                  ? "border-emerald-200 bg-emerald-50/40 opacity-75"
                  : "border-slate-200/80 bg-white shadow-xs hover:border-indigo-200 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleDayComplete(day.dayNumber)}
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-slate-300 bg-slate-50 text-transparent hover:border-indigo-500"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Day {day.dayNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {day.allocatedHours} Hours
                      </span>
                    </div>
                    <h3 className={`text-base font-bold text-slate-900 mt-0.5 ${isDone ? "line-through text-slate-400" : ""}`}>
                      {day.targetTopicName}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onOpenExplainTopic(day.targetTopicId, day.targetTopicName)}
                  className="self-start flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Explain This Topic</span>
                </button>
              </div>

              {/* Action Item and recommended reading */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700 pl-10">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-indigo-950 shrink-0">Action Item:</span>
                  <p className="leading-relaxed">{day.actionItem}</p>
                </div>

                {day.keySubtopicsToReview && day.keySubtopicsToReview.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-semibold text-slate-500 text-[11px]">Key concepts:</span>
                    {day.keySubtopicsToReview.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}

                {day.recommendedCitation && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>Reference: <code>{day.recommendedCitation}</code></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
