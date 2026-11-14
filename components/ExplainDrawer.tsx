"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
} from "lucide-react";
import { DocumentChunk } from "@/lib/types";

interface ExplainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicName: string;
  chunks: DocumentChunk[];
}

export const ExplainDrawer: React.FC<ExplainDrawerProps> = ({
  isOpen,
  onClose,
  topicId,
  topicName,
  chunks,
}) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({
      api: "/api/chat",
      body: {
        chunks,
        activeTopicId: topicId,
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    `What are the most common exam mistakes in ${topicName}?`,
    `Explain this concept step-by-step with citations from my notes.`,
    `Give me a memory mnemonic for this topic.`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">Explain-This-Topic Assistant</h3>
                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                  RAG Only
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-semibold truncate max-w-xs">
                Topic: {topicName}
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

        {/* Grounding Notice */}
        <div className="bg-indigo-50/60 border-b border-indigo-100 px-6 py-2.5 flex items-center justify-between text-[11px] text-indigo-900">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            Answers strictly from your uploaded notes chunks. Zero hallucination.
          </span>
          <span className="text-[10px] font-mono text-indigo-500">Groq 70b</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4 text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Ask anything about "{topicName}"
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The assistant will cross-reference your uploaded notes and provide explanations with
                  exact section citations.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-2 pt-4 max-w-md mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Suggested Prompts:
                </span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-900 transition flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{prompt}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAssistant && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 max-w-[85%] ${
                      isAssistant
                        ? "bg-slate-50 border border-slate-200/80 text-slate-800 space-y-2"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>

                  {!isAssistant && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span>Retrieving source chunks and streaming answer...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 p-4 bg-white flex items-center gap-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask a question grounded in ${topicName}...`}
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
