"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { UserSession } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@gapfinder.ai");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const session: UserSession = {
      email,
      name: email === "demo@gapfinder.ai" ? "Dr. Alex Vance (Hackathon Judge)" : "Demo Student",
      role: "judge",
      isDemoUser: true,
    };

    localStorage.setItem("gapfinder_user", JSON.stringify(session));

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  const handleQuickJudgeLogin = () => {
    setEmail("demo@gapfinder.ai");
    setPassword("password123");
    const session: UserSession = {
      email: "demo@gapfinder.ai",
      name: "Dr. Alex Vance (Hackathon Judge)",
      role: "judge",
      isDemoUser: true,
    };
    localStorage.setItem("gapfinder_user", JSON.stringify(session));
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
            <Brain className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            GapFinder <span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-xs text-slate-500">
            Find What the Student Doesn’t Know • Diagnostic RAG Platform
          </p>
        </div>

        {/* 1-Click Judge Button */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-center space-y-2 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Hackathon Judge 1-Click Access</span>
          </div>
          <p className="text-[11px] text-indigo-700">
            Preloads demo student session with full course datasets & citations.
          </p>
          <button
            onClick={handleQuickJudgeLogin}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <span>Log In as Demo Judge</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to GapFinder"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Demo Credentials:
            </span>
            <span className="font-mono text-slate-700">demo@gapfinder.ai / password123</span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            ← Back to Product Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
