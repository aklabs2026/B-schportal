export interface StudentStats {
  resumeScore: number;
  challengesSolved: number;
  totalChallenges: number;
  interviewsCompleted: number;
  overallProgress: number;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  solved: boolean;
  solvedAt?: string;
  code?: string;
}

export interface ResumeAnalysis {
  id: string;
  fileName: string;
  score: number;
  analyzedAt: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  roleMatch: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface InterviewSession {
  id: string;
  role: string;
  company: string;
  createdAt: string;
  completed: boolean;
  score?: number;
  chatHistory: ChatMessage[];
  feedback?: string;
}

export interface Student {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  targetRole: string;
  targetCompany: string;
  createdAt: string;
  stats: StudentStats;
  codingChallenges: CodingChallenge[];
  resumeAnalyses: ResumeAnalysis[];
  interviewSessions: InterviewSession[];
}
