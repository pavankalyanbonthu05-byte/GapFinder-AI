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
  TrendingUp,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { UploadZone } from "@/components/UploadZone";
import { TopicMapTree } from "@/components/TopicMapTree";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { GapReportCard } from "@/components/GapReportCard";
import { RevisionPlanner } from "@/components/RevisionPlanner";
import { ExplainDrawer } from "@/components/ExplainDrawer";
import { ProgressTracker } from "@/components/ProgressTracker";

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
  QuizAttempt,
} from "@/lib/types";

type ActiveTab = "upload" | "topic-map" | "quiz" | "gap-report" | "revision-plan" | "progress";

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
  const [lastStudentAnswers, setLastStudentAnswers] = useState<StudentAnswer[]>([]);

  // User Customizable Revision Schedule
  const [studyDays, setStudyDays] = useState<number>(5);
  const [studyHoursPerDay, setStudyHoursPerDay] = useState<number>(2);

  // Attempts tracking
  const [attemptHistory, setAttemptHistory] = useState<QuizAttempt[]>([]);
  const [quizAttemptCount, setQuizAttemptCount] = useState<number>(0);

  // Explain Drawer State
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [selectedTopicForExplain, setSelectedTopicForExplain] = useState<{
    id: string;
    name: string;
  }>({ id: "topic-1", name: "Physical & Data Link Layer Protocols" });

  // Get user-specific key for isolated local storage
  const getUserStorageKey = (currentUser: UserSession | null, baseKey: string) => {
    if (!currentUser) return baseKey;
    const identifier = currentUser.guestId || currentUser.email || "guest";
    return `${baseKey}_${identifier.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  };

  // Load session & cached data on mount
  useEffect(() => {
    let activeUser: UserSession;
    const cachedUser = localStorage.getItem("gapfinder_user");
    if (cachedUser) {
      try {
        activeUser = JSON.parse(cachedUser);
      } catch (e) {
        activeUser = {
          email: "guest@gapfinder.ai",
          name: "Guest Student",
          role: "guest",
          isDemoUser: true,
          guestId: `guest_${Date.now()}`,
        };
      }
    } else {
      activeUser = {
        email: "guest@gapfinder.ai",
        name: "Guest Student",
        role: "guest",
        isDemoUser: true,
        guestId: `guest_${Date.now()}`,
      };
      localStorage.setItem("gapfinder_user", JSON.stringify(activeUser));
    }
    setUser(activeUser);

    // Load isolated report & attempts for this user
    const reportKey = getUserStorageKey(activeUser, "gapfinder_report");
    const attemptsKey = getUserStorageKey(activeUser, "gapfinder_attempts");

    const cachedReport = localStorage.getItem(reportKey);
    if (cachedReport) {
      try {
        setReport(JSON.parse(cachedReport));
      } catch (e) {
        // ignore
      }
    }

    const cachedAttempts = localStorage.getItem(attemptsKey);
    if (cachedAttempts) {
      try {
        const parsed = JSON.parse(cachedAttempts);
        setAttemptHistory(parsed);
        setQuizAttemptCount(parsed.length);
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
    if (user) {
      const reportKey = getUserStorageKey(user, "gapfinder_report");
      localStorage.removeItem(reportKey);
    }
    setActiveTab("topic-map");
  };

  const generateQuizForTopics = async (
    targetTopics: Topic[],
    targetChunks: DocumentChunk[],
    attemptNumber?: number
  ) => {
    setIsGeneratingQuiz(true);
    try {
      const currentAttempt = attemptNumber ?? (quizAttemptCount + 1);
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: targetTopics,
          chunks: targetChunks,
          attemptCount: currentAttempt,
          seed: `${Date.now()}-${currentAttempt}`,
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
    setQuestions([]);
    setReport(null);
    if (user) {
      const reportKey = getUserStorageKey(user, "gapfinder_report");
      localStorage.removeItem(reportKey);
    }
    setActiveTab("topic-map");

    // Immediately trigger quiz generation based on the newly extracted topics
    generateQuizForTopics(newTopics, newChunks, 1);
  };

  const handleStartQuiz = async () => {
    if (questions.length === 0 && !isGeneratingQuiz) {
      await generateQuizForTopics(topics, chunks, quizAttemptCount + 1);
    }
    setActiveTab("quiz");
  };

  const handleRetestRequest = async () => {
    // Generate fresh questions dynamically
    await generateQuizForTopics(topics, chunks, quizAttemptCount + 1);
    setActiveTab("quiz");
  };

  const handleQuizCompleted = async (answers: StudentAnswer[]) => {
    setLastStudentAnswers(answers);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics,
          questions,
          studentAnswers: answers,
          availableDays: studyDays,
          hoursPerDay: studyHoursPerDay,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");
      const evalReport: GapDiagnosisReport = await res.json();
      setReport(evalReport);

      // Record this quiz attempt in history
      const newAttemptNumber = quizAttemptCount + 1;
      const totalCorrect = answers.filter((a) => a.isCorrect).length;
      const newAttempt: QuizAttempt = {
        id: `attempt_${Date.now()}`,
        attemptNumber: newAttemptNumber,
        timestamp: new Date().toISOString(),
        scorePercentage: evalReport.overallScore,
        totalQuestions: questions.length,
        correctQuestions: totalCorrect,
        topicBreakdown: evalReport.topicGaps.map((g) => ({
          topicId: g.topicId,
          topicName: g.topicName,
          scorePercentage: g.scorePercentage,
          correct: g.correctQuestions,
          total: g.totalQuestions,
          masteryLevel: g.masteryLevel,
        })),
      };

      const updatedAttempts = [...attemptHistory, newAttempt];
      setAttemptHistory(updatedAttempts);
      setQuizAttemptCount(newAttemptNumber);

      // Save user-isolated data
      if (user) {
        const reportKey = getUserStorageKey(user, "gapfinder_report");
        const attemptsKey = getUserStorageKey(user, "gapfinder_attempts");
        localStorage.setItem(reportKey, JSON.stringify(evalReport));
        localStorage.setItem(attemptsKey, JSON.stringify(updatedAttempts));
      }

      setActiveTab("gap-report");
    } catch (err) {
      console.error(err);
      alert("Failed to compute diagnosis report. Please try again.");
    }
  };

  const handleUpdatePlanSchedule = async (newDays: number, newHours: number) => {
    setStudyDays(newDays);
    setStudyHoursPerDay(newHours);

    // If report and answers exist, re-run evaluate to recalculate schedule allocations
    if (report && lastStudentAnswers.length > 0) {
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topics,
            questions,
            studentAnswers: lastStudentAnswers,
            availableDays: newDays,
            hoursPerDay: newHours,
          }),
        });
        if (res.ok) {
          const updatedReport: GapDiagnosisReport = await res.json();
          setReport(updatedReport);
          if (user) {
            const reportKey = getUserStorageKey(user, "gapfinder_report");
            localStorage.setItem(reportKey, JSON.stringify(updatedReport));
          }
        }
      } catch (e) {
        console.error("Failed to update schedule allocation:", e);
      }
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
            <span>5. Personalized Revision Plan</span>
          </button>

          {attemptHistory.length > 0 && (
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === "progress"
                  ? "bg-white text-emerald-700 shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>6. Progress & Attempts</span>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-bold">
                {attemptHistory.length}
              </span>
            </button>
          )}
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
            onRetest={handleRetestRequest}
          />
        )}

        {activeTab === "gap-report" && (
          report ? (
            <div className="space-y-6">
              <GapReportCard
                report={report}
                onOpenExplainTopic={handleOpenExplainTopic}
                onGoToPlan={() => setActiveTab("revision-plan")}
              />
              {attemptHistory.length > 0 && (
                <ProgressTracker
                  attempts={attemptHistory}
                  onTakeRetest={handleRetestRequest}
                />
              )}
            </div>
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
              onRetest={handleRetestRequest}
              onOpenExplainTopic={handleOpenExplainTopic}
              onUpdatePlanSchedule={handleUpdatePlanSchedule}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Revision Plan Not Generated</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The personalized revision plan adapts strictly to your quiz weaknesses and available hours. Take the diagnostic quiz first.
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

        {activeTab === "progress" && (
          <ProgressTracker
            attempts={attemptHistory}
            onTakeRetest={handleRetestRequest}
          />
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
