"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Layers,
  HelpCircle,
  FileBarChart,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { UploadZone } from "@/components/UploadZone";
import { TopicMapTree } from "@/components/TopicMapTree";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { GapReportCard } from "@/components/GapReportCard";
import { RevisionPlanner } from "@/components/RevisionPlanner";
import { ExplainDrawer } from "@/components/ExplainDrawer";

import {
  SAMPLE_TOPICS,
  SAMPLE_CHUNKS,
  SAMPLE_QUIZ_QUESTIONS,
} from "@/lib/rag/sampleData";
import {
  Topic,
  DocumentChunk,
  QuizQuestion,
  StudentAnswer,
  GapDiagnosisReport,
  UserSession,
} from "@/lib/types";

type ActiveTab = "upload" | "topic-map" | "quiz" | "gap-report" | "revision-plan";

export default function DashboardPage() {
  const router = useRouter();

  // State
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Materials & Core Knowledge
  const [topics, setTopics] = useState<Topic[]>(SAMPLE_TOPICS);
  const [chunks, setChunks] = useState<DocumentChunk[]>(SAMPLE_CHUNKS);
  const [questions, setQuestions] = useState<QuizQuestion[]>(SAMPLE_QUIZ_QUESTIONS);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [report, setReport] = useState<GapDiagnosisReport | null>(null);

  // Explain Drawer State
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [selectedTopicForExplain, setSelectedTopicForExplain] = useState<{
    id: string;
    name: string;
  }>({ id: "topic-1", name: "Cellular Respiration & Energy" });

  // Load session & cached data on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem("gapfinder_user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        // ignore
      }
    } else {
      // Default to guest session for ease of use
      const defaultUser: UserSession = {
        email: "guest@gapfinder.ai",
        name: "Guest Student",
        role: "guest",
        isDemoUser: true,
      };
      setUser(defaultUser);
      localStorage.setItem("gapfinder_user", JSON.stringify(defaultUser));
    }

    const cachedReport = localStorage.getItem("gapfinder_report");
    if (cachedReport) {
      try {
        setReport(JSON.parse(cachedReport));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gapfinder_user");
    setUser(null);
    router.push("/login");
  };

  const handleLoadDemo = () => {
    setTopics(SAMPLE_TOPICS);
    setChunks(SAMPLE_CHUNKS);
    setQuestions(SAMPLE_QUIZ_QUESTIONS);
    setReport(null);
    localStorage.removeItem("gapfinder_report");
    setActiveTab("topic-map");
  };

  const generateQuizForTopics = async (targetTopics: Topic[], targetChunks: DocumentChunk[]) => {
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: targetTopics,
          chunks: targetChunks,
        }),
      });

      if (!res.ok) throw new Error("Quiz generation failed");
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to generate quiz for new material:", err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleIngestionComplete = (newTopics: Topic[], newChunks: DocumentChunk[]) => {
    setTopics(newTopics);
    setChunks(newChunks);
    // Clear previous demo questions and report so the user gets a fresh exam tailored to their upload
    setQuestions([]);
    setReport(null);
    localStorage.removeItem("gapfinder_report");
    setActiveTab("topic-map");

    // Immediately trigger quiz generation based on the newly extracted topics and their exam weightage
    generateQuizForTopics(newTopics, newChunks);
  };

  const handleStartQuiz = async () => {
    if (questions.length === 0 && !isGeneratingQuiz) {
      await generateQuizForTopics(topics, chunks);
    }
    setActiveTab("quiz");
  };

  const handleQuizCompleted = async (answers: StudentAnswer[]) => {
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics,
          questions,
          studentAnswers: answers,
          availableDays: 5,
          hoursPerDay: 2,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");
      const evalReport: GapDiagnosisReport = await res.json();
      setReport(evalReport);
      localStorage.setItem("gapfinder_report", JSON.stringify(evalReport));
      setActiveTab("gap-report");
    } catch (err) {
      console.error(err);
      alert("Failed to compute diagnosis report. Please try again.");
    }
  };

  const handleOpenExplainTopic = (topicId: string, topicName: string) => {
    setSelectedTopicForExplain({ id: topicId, name: topicName });
    setIsExplainOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        user={user}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onLoadDemoData={handleLoadDemo}
        onLogout={handleLogout}
        onOpenChatbot={() => {
          setSelectedTopicForExplain({
            id: "",
            name: "",
          });
          setIsExplainOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs (Dribbble styled) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "upload"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>1. Material Ingestion</span>
          </button>

          <button
            onClick={() => setActiveTab("topic-map")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "topic-map"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>2. Topic Graph & Exam Weight</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 font-mono">
              {topics.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "quiz"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>3. Grounded Diagnostic Test</span>
            <span className="rounded-md bg-indigo-100 px-1.5 py-0.2 text-[10px] text-indigo-700 font-mono">
              {isGeneratingQuiz
                ? "Generating..."
                : questions.length > 0
                ? `${questions.length} Qs`
                : "0 Qs"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gap-report")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "gap-report"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileBarChart className="h-4 w-4" />
            <span>4. Gap Diagnosis Report</span>
            {report && (
              <span className="rounded-md bg-rose-100 px-1.5 py-0.2 text-[10px] text-rose-800 font-bold">
                {report.weakTopicsCount} Weak
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("revision-plan")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "revision-plan"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            <span>5. 5-Day Revision Plan</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === "upload" && (
          <UploadZone
            onIngestionComplete={handleIngestionComplete}
            onLoadSample={handleLoadDemo}
          />
        )}

        {activeTab === "topic-map" && (
          <TopicMapTree
            topics={topics}
            questionsCount={questions.length}
            isGeneratingQuiz={isGeneratingQuiz}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {activeTab === "quiz" && (
          <DiagnosticQuiz
            questions={questions}
            topics={topics}
            chunks={chunks}
            isLoading={isGeneratingQuiz}
            onQuizCompleted={handleQuizCompleted}
            onRetest={() => setActiveTab("quiz")}
          />
        )}

        {activeTab === "gap-report" && (
          report ? (
            <GapReportCard
              report={report}
              onOpenExplainTopic={handleOpenExplainTopic}
              onGoToPlan={() => setActiveTab("revision-plan")}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Diagnostic Report Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Take the diagnostic quiz to find your blind spots and generate your personalized topic diagnosis.
                </p>
              </div>
              <button
                onClick={handleStartQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <span>Take Diagnostic Exam Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )
        )}

        {activeTab === "revision-plan" && (
          report ? (
            <RevisionPlanner
              report={report}
              onRetest={() => setActiveTab("quiz")}
              onOpenExplainTopic={handleOpenExplainTopic}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Revision Plan Not Generated</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The personalized 5-day study plan adapts strictly to your quiz weaknesses. Take the diagnostic quiz first.
                </p>
              </div>
              <button
                onClick={handleStartQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <span>Take Diagnostic Exam</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )
        )}
      </main>

      {/* Slide-out RAG Explain Drawer */}
      <ExplainDrawer
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        topicId={selectedTopicForExplain.id}
        topicName={selectedTopicForExplain.name}
        chunks={chunks}
      />

      {/* Interactive Architecture Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
