"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Search,
  Globe,
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
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } =
    useChat({
      api: "/api/chat",
      body: {
        chunks,
        activeTopicId: topicId,
        activeTopicName: topicName,
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    `Explain ${topicName} with an intuitive analogy.`,
    `What are the most common exam traps in ${topicName}?`,
    `Compare how ${topicName} in my notes relates to real-world applications.`,
  ];

  const handleResetChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">GapFinder AI Tutor</h3>
                <span className="rounded-full bg-indigo-100 px-2 py-0.2 text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Notes + Web Tools
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-semibold truncate max-w-sm">
                Topic: {topicName || "General & Course Material"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button
                onClick={handleResetChat}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                title="Clear Conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feature Sub-bar */}
        <div className="bg-indigo-50/60 border-b border-indigo-100 px-6 py-2 flex items-center justify-between text-[11px] text-indigo-900">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            Evaluated by LLM with live notes & web tool-calling.
          </span>
          <span className="text-[10px] font-mono text-indigo-600 font-semibold">Groq 120B</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 ? (
            <div className="space-y-4 text-center py-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Ask Anything About "{topicName || "Your Course"}"
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Ask specific questions, request real-world comparisons, or ask general questions.
                  The AI tutor will search your notes, look up web knowledge if needed, and synthesize a clean,
                  polished explanation.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-2 pt-4 max-w-md mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Suggested Questions:
                </span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-900 transition flex items-center justify-between gap-2 shadow-2xs"
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
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 max-w-[90%] ${
                      isAssistant
                        ? "bg-slate-50/90 border border-slate-200/90 text-slate-800 shadow-xs"
                        : "bg-indigo-600 text-white shadow-xs"
                    }`}
                  >
                    {isAssistant ? (
                      <div className="prose prose-xs max-w-none text-slate-800 space-y-2.5">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h3: ({ node, ...props }) => (
                              <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1" {...props} />
                            ),
                            h4: ({ node, ...props }) => (
                              <h4 className="text-xs font-bold text-slate-900 mt-2 mb-1" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="leading-relaxed mb-1.5" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="leading-relaxed" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-3 border-indigo-500 bg-indigo-50/60 p-2.5 my-2 rounded-r-lg text-indigo-950 font-medium italic"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold text-slate-900" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[11px] text-indigo-700"
                                {...props}
                              />
                            ),
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                                <table className="min-w-full divide-y divide-slate-200 text-[11px]" {...props} />
                              </div>
                            ),
                            thead: ({ node, ...props }) => (
                              <thead className="bg-slate-100/80 font-bold text-slate-800" {...props} />
                            ),
                            th: ({ node, ...props }) => (
                              <th className="px-3 py-2 text-left font-semibold text-slate-700" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="px-3 py-1.5 border-t border-slate-100 text-slate-700" {...props} />
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex items-center gap-2 rounded-xl bg-indigo-50/80 border border-indigo-100 p-3 text-xs text-indigo-800 animate-pulse">
              <Search className="h-4 w-4 animate-spin text-indigo-600 shrink-0" />
              <span>
                Evaluating notes, querying web if needed, and synthesizing a polished explanation...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 p-4 bg-white flex items-center gap-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask about this topic, real-world context, or request an analogy...`}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
