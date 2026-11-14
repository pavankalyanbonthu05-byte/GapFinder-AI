"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Activity,
  Layers,
  BookOpen,
  CalendarCheck,
  Cpu,
  UserCheck,
} from "lucide-react";
import { InteractiveDiagram } from "@/components/InteractiveDiagram";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">GapFinder</span>
                <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Bridge Your Gap</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Sign In / Guest
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Bridge Your Gap • AI Diagnostic Learning Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Stop Re-reading What You Already Know. <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Uncover Your Blind Spots Before Your Exam Does.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Most study tools wait for you to ask questions. But you can’t ask about a gap you
              don’t know you have. GapFinder AI ingests your syllabus and notes, tests you with
              citation-grounded questions, isolates weak spots, and builds a personalized revision plan.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <UserCheck className="h-4 w-4 text-indigo-600" />
                <span>Continue as Guest (1-Click)</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Grounded RAG with Citations
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Cpu className="h-4 w-4 text-indigo-600" /> Groq GPT-OSS-120b
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Activity className="h-4 w-4 text-purple-600" /> Adaptive 5-Day Plan
              </span>
            </div>
          </div>

          {/* Interactive Flowchart Diagram */}
          <div className="mt-12 max-w-5xl mx-auto">
            <InteractiveDiagram />
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-slate-200/80 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              A Complete System for Knowledge Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Zero hallucination, grounded generation, algorithmic gap diagnosis, and adaptive scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Syllabus & Topic Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Breaks syllabus into topics and subtopics. Cross-references past papers to mark high-frequency
                exam topics.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Citation-Grounded Tests</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every quiz question quotes its exact textbook section and page number, proving generation
                originates strictly from retrieved notes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. 🔴 🟡 🟢 Gap Diagnosis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Classifies topics into Weak, Medium, and Strong. Generates clinical reasoning explaining
                what conceptual misunderstanding caused the error.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. Adaptive 5-Day Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prioritizes study time using (Exam Weightage × Weakness). Automatically recalibrates
                when follow-up tests are taken.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">5. "Explain Topic" Tutor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                RAG assistant that evaluates retrieved material and frames explanations with plain-English analogies,
                breakdowns, and verified citations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">6. Turnkey Guest & Student Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1-click guest access and preloaded course datasets. Zero configuration required to start learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500">
        <p>© 2026 GapFinder AI • Bridge Your Gap • Powered by Groq & Vercel AI SDK</p>
      </footer>
    </div>
  );
}
