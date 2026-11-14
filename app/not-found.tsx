import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">404 - Page Not Found</h2>
          <p className="text-xs text-slate-500">
            The page you are looking for does not exist or has moved.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
