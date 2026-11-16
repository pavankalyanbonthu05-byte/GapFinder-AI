export interface SubTopic {
  id: string;
  title: string;
  description: string;
  examFrequency: "HIGH" | "MEDIUM" | "LOW";
  pastQuestionsCount: number;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  subtopics: SubTopic[];
  examWeightage: number; // percentage or relative scale 1-100
}

export interface DocumentChunk {
  id: string;
  docTitle: string;
  section: string;
  content: string;
  topicId: string;
  subtopicId?: string;
  pageOrSlide?: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  citation: {
    documentTitle: string;
    section: string;
    pageOrChapter: string;
    verbatimSnippet: string;
  };
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  topicId: string;
  subtopicId: string;
}

export type MasteryLevel = "WEAK" | "MEDIUM" | "STRONG";

export interface TopicGap {
  topicId: string;
  topicName: string;
  masteryLevel: MasteryLevel;
  scorePercentage: number;
  totalQuestions: number;
  correctQuestions: number;
  examWeightage: number; // 0 - 100
  reasoning: string;
  missedSubtopics: string[];
  recommendedAction: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  dateStr?: string;
  allocatedHours: number;
  targetTopicId: string;
  targetTopicName: string;
  keySubtopicsToReview: string[];
  recommendedCitation: string;
  priorityScore: number; // computed from (100 - mastery) * examWeightage
  actionItem: string;
}

export interface GapDiagnosisReport {
  studentId: string;
  attemptId: string;
  overallScore: number;
  timestamp: string;
  topicGaps: TopicGap[];
  weakTopicsCount: number;
  mediumTopicsCount: number;
  strongTopicsCount: number;
  revisionPlan: StudyPlanDay[];
  summaryDiagnosis: string;
}

export interface QuizAttempt {
  id: string;
  attemptNumber: number;
  timestamp: string;
  scorePercentage: number;
  totalQuestions: number;
  correctQuestions: number;
  topicBreakdown: {
    topicId: string;
    topicName: string;
    scorePercentage: number;
    correct: number;
    total: number;
    masteryLevel: MasteryLevel;
  }[];
}

export interface UserSession {
  email: string;
  name: string;
  role: "student" | "guest" | "teacher" | "judge";
  isDemoUser: boolean;
  guestId?: string;
}
