"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";
import { InteractiveDiagram } from "./InteractiveDiagram";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">How GapFinder AI Works</h2>
              <p className="text-xs text-slate-500">
                End-to-End RAG Architecture, Citation Verification & Adaptive Diagnosis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <InteractiveDiagram />

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5 text-amber-800">
              💡 Why This Solves The Core Hackathon Problem Statement:
            </span>
            <p className="leading-relaxed">
              Standard LLM study chatbots wait for the student to ask a question—but students cannot ask
              about blind spots they do not know they have. GapFinder AI flips the paradigm: it acts as
              an academic physician, proactively generating grounded diagnostic tests, isolating weak
              topics with citations, and auto-adapting a prioritized revision schedule.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            Got it, Let's Diagnose!
          </button>
        </div>
      </div>
    </div>
  );
};
