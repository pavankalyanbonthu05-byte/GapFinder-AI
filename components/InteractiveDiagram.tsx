"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Layers,
  FileCheck2,
  AlertTriangle,
  CalendarCheck,
  MessageSquareCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface StepInfo {
  step: number;
  title: string;
  badge: string;
  subtitle: string;
  ragRole: string;
  details: string[];
}

const STEPS: StepInfo[] = [
  {
    step: 1,
    title: "Material Ingestion & Topic Graph",
    badge: "Input Stage",
    subtitle: "Converts raw PDFs, notes & past papers into structured knowledge",
    ragRole: "Information Extraction & Chunking with source metadata (Page, Section)",
    details: [
      "Uploads Syllabus, textbook chapters, and past exam questions.",
      "Llama-3.3-70b parses topic hierarchy and calculates exam question weights.",
      "Text is sliced into semantic chunks with verified source citations.",
    ],
  },
  {
    step: 2,
    title: "Grounded Diagnostic Quiz",
    badge: "Testing Stage",
    subtitle: "Generates questions strictly from notes—never from web hallucinations",
    ragRole: "Grounded Generation (Every question points to a verbatim textbook sentence)",
    details: [
      "Retrieves high-yield chunks matching syllabus subtopics.",
      "Formulates conceptual MCQs testing common student misconceptions.",
      "Each question presents an unforgeable citation label (e.g. Chapter 9, Page 168).",
    ],
  },
  {
    step: 3,
    title: "Gap Analysis Engine",
    badge: "Diagnosis Stage",
    subtitle: "Separates real knowledge from illusion of competence",
    ragRole: "Evaluative Reasoning over student error patterns",
    details: [
      "Categorizes topics into 🔴 Weak (<50%), 🟡 Medium (50-75%), 🟢 Strong (>75%).",
      "Calculates student mastery score correlated with past exam weightage.",
      "Produces clinical diagnosis strings explaining the exact sub-concepts missed.",
    ],
  },
  {
    step: 4,
    title: "Adaptive Revision Plan",
    badge: "Prescription Stage",
    subtitle: "Prioritizes study time: High Exam Weightage × Low Mastery",
    ragRole: "Algorithmic synthesis tailored to student's available hours & days",
    details: [
      "Generates a day-by-day targeted schedule (e.g., 5 Days, 2 Hours/day).",
      "Focuses student effort exclusively on high-impact weak topics.",
      "Dynamically recalibrates whenever the student takes a follow-up test.",
    ],
  },
  {
    step: 5,
    title: "'Explain This Topic' Assistant",
    badge: "Remediation Stage",
    subtitle: "Tutor that answers exclusively from the student's uploaded material",
    ragRole: "Strict Vector/Lexical RAG with streaming responses & citations",
    details: [
      "Triggered with 1-click directly from any 🔴 Weak topic card.",
      "Refuses outside facts—only teaches what's in your course syllabus.",
      "Highlights exact citations and textbook passages.",
    ],
  },
];

export const InteractiveDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = STEPS.find((s) => s.step === activeStep) || STEPS[0];

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Interactive Architecture
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            The Complete GapFinder RAG Diagnostic Loop
          </h3>
          <p className="text-xs text-slate-500">
            Click on any step below to inspect how retrieval and generation collaborate.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Zero Hallucination Grounding</span>
        </div>
      </div>

      {/* Step Pills Navigation Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-6">
        {STEPS.map((s) => {
          const isActive = s.step === activeStep;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isActive
                  ? "border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[11px] font-bold rounded-md px-1.5 py-0.5 ${
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  Step {s.step}
                </span>
                {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />}
              </div>
              <span
                className={`text-xs font-bold leading-tight ${
                  isActive ? "text-indigo-900" : "text-slate-800"
                }`}
              >
                {s.title.split(" ")[0]} {s.title.split(" ")[1]}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">{s.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Animated Step Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 p-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  Step {current.step} of 5
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {current.badge}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-1">{current.title}</h4>
              <p className="text-sm text-slate-600">{current.subtitle}</p>
            </div>

            <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs text-indigo-900 max-w-sm">
              <span className="font-bold block text-indigo-700 mb-0.5">RAG Mechanism:</span>
              <span>{current.ragRole}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-indigo-100/70">
            {current.details.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg bg-white p-3 border border-slate-200/70 shadow-2xs"
              >
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between pt-2">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              ← Previous Step
            </button>
            <button
              disabled={activeStep === 5}
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
