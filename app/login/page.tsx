"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Lock, Mail, Sparkles, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { UserSession } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@gapfinder.ai");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const session: UserSession = {
      email,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Student",
      role: "student",
      isDemoUser: false,
    };

    localStorage.setItem("gapfinder_user", JSON.stringify(session));

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 350);
  };

  const handleGuestLogin = () => {
    // Generate a unique guest identifier so each guest device / session gets their own clean sandbox
    const randomGuestNum = Math.floor(1000 + Math.random() * 9000);
    const guestId = `guest_${Date.now()}_${randomGuestNum}`;
    const session: UserSession = {
      email: `guest_${randomGuestNum}@gapfinder.ai`,
      name: `Guest #${randomGuestNum}`,
      role: "guest",
      isDemoUser: true,
      guestId,
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
          <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
            Bridge Your Gap
          </p>
          <p className="text-xs text-slate-500">
            Find What You Don't Know • Diagnostic RAG Learning Engine
          </p>
        </div>

        {/* 1-Click Guest Button */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-center space-y-2 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Instant Guest Access</span>
          </div>
          <p className="text-[11px] text-indigo-700">
            Explore with instant 1-click access and ready-to-test course data.
          </p>
          <button
            onClick={handleGuestLogin}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            <span>Continue as Guest</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Form Card for Registered / Custom Student Credentials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold text-slate-700">Or Log In With Your Account</span>
          </div>

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
                  placeholder="student@school.edu"
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
                  placeholder="••••••••"
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
              {loading ? "Authenticating..." : "Sign In with Student Account"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Demo Credentials:
            </span>
            <span className="font-mono text-slate-700">student@gapfinder.ai / password123</span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            ← Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
