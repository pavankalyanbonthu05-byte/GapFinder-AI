"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Brain, Cpu, HelpCircle, LogOut, MessageSquare, Bot } from "lucide-react";
import { UserSession } from "@/lib/types";

interface NavbarProps {
  user: UserSession | null;
  onOpenHowItWorks: () => void;
  onLoadDemoData: () => void;
  onLogout: () => void;
  onOpenChatbot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenHowItWorks,
  onLoadDemoData,
  onLogout,
  onOpenChatbot,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white">
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
        </Link>

        {/* Center Pill: RAG & Model status */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3.5 py-1 text-xs text-slate-600">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">RAG Grounded</span>
          <span className="text-slate-300">|</span>
          <Cpu className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-mono text-[11px] text-slate-500">gpt-oss-120b (Groq)</span>
        </div>

        {/* Actions & Top Chatbot */}
        <div className="flex items-center gap-2.5">
          {/* Top Chatbot Button */}
          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:opacity-95 transition"
              title="Open Interactive RAG Chatbot"
            >
              <Bot className="h-3.5 w-3.5 text-indigo-200" />
              <span>Ask AI Tutor</span>
            </button>
          )}

          <button
            onClick={onOpenHowItWorks}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 shadow-xs"
            title="Interactive RAG Diagnostic Flowchart"
          >
            <HelpCircle className="h-4 w-4 text-indigo-600" />
            <span>How It Works</span>
          </button>

          <button
            onClick={onLoadDemoData}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 border border-indigo-200/60"
            title="Preload Biology Course, Citations & Exam Data"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Load Demo Exam</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-medium text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
                  {user.role}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-600 transition ml-1"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              Sign In / Guest
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
