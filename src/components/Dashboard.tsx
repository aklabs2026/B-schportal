import React, { useState } from "react";
import { 
  GraduationCap, LogOut, Briefcase, Building, Sparkles, 
  Target, Award, CheckCircle2, Circle, Clock, TrendingUp, 
  ChevronRight, ArrowUpRight, Edit2, Check, X, FileText, 
  MessageSquare, Terminal, HelpCircle, Code, ShieldAlert, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student } from "../types";
import ResumeAnalyzer from "./ResumeAnalyzer";
import CodingWorkspace from "./CodingWorkspace";
import InterviewSimulator from "./InterviewSimulator";
import PerformanceAnalytics from "./PerformanceAnalytics";

interface DashboardProps {
  student: Student;
  onLogout: () => void;
  onProfileUpdate: (updatedStudent: Student) => void;
}

export default function Dashboard({ student, onLogout, onProfileUpdate }: DashboardProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempRole, setTempRole] = useState(student.targetRole);
  const [tempCompany, setTempCompany] = useState(student.targetCompany);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"roadmap" | "resume" | "coding" | "interview" | "analytics">("roadmap");

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const response = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          targetRole: tempRole,
          targetCompany: tempCompany,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        onProfileUpdate(data.user);
        setIsEditingProfile(false);
      }
    } catch (e) {
      console.error("Error updating profile:", e);
    } finally {
      setUpdating(false);
    }
  };

  // SVG Radial Progress Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (student.stats.overallProgress / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative">
      
      {/* Decorative Collegiate Top Line */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-900 via-blue-700 to-amber-500 absolute top-0 left-0 z-50" />

      {/* Top Main College Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-amber-400 p-2.5 rounded-xl border border-blue-800 shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-900 font-display">University Placement Portal</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold">STUDENT PORTAL • PORTFOLIO STATION</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Student ID Badge */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 rounded-full py-1.5 pl-2.5 pr-4 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center text-xs font-bold">
                {student.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-950 leading-tight">{student.name}</p>
                <p className="text-[9px] text-slate-400 font-mono">ID: {student.id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-rose-200 transition-all cursor-pointer"
              title="Sign out of student session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Primary Academic Navigation Tabs Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-[73px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2 md:gap-6">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`py-4 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "roadmap"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-900" /> General Roadmap
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`py-4 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "resume"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4 text-blue-900" /> Resume Analyzer
          </button>
          <button
            onClick={() => setActiveTab("coding")}
            className={`py-4 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "coding"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code className="w-4 h-4 text-blue-900" /> Coding Workspace
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`py-4 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "interview"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-900" /> Mock Interview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-4 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-900" /> Career Analytics
          </button>
        </div>
      </div>

      {/* Workspace Area - Fluid Light Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Student Details & Overall Progress metrics (4 cols / ~30% width) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main Student Profile Card (70% white theme layout) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[9px] bg-blue-50 text-blue-900 font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-md border border-blue-100">
                  Student Record
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{student.name}</h3>
                <p className="text-xs text-slate-500 font-mono font-medium">{student.email}</p>
              </div>
              
              <button
                onClick={() => {
                  if (isEditingProfile) {
                    setTempRole(student.targetRole);
                    setTempCompany(student.targetCompany);
                  }
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="text-slate-400 hover:text-blue-900 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Edit Target Configuration"
              >
                {isEditingProfile ? <X className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Profile Edit Mode */}
            {isEditingProfile ? (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target Job Role</label>
                  <input
                    type="text"
                    value={tempRole}
                    onChange={(e) => setTempRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Dream Recruiter</label>
                  <input
                    type="text"
                    value={tempCompany}
                    onChange={(e) => setTempCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg py-2 mt-2 flex items-center justify-center gap-1.5 cursor-pointer transition-colors border-b-2 border-amber-500"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Save Coordinates
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-900">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Target Profession</p>
                    <p className="text-sm font-semibold text-slate-800">{student.targetRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Target Recruiter</p>
                    <p className="text-sm font-semibold text-slate-800">{student.targetCompany || "Not specified"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Radial Preparation Scorecard Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            
            <h4 className="text-xs font-bold text-slate-700 mr-auto flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-blue-900" /> Academic Readiness
            </h4>
            
            <div className="relative my-5 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-blue-900 transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold tracking-tight text-blue-900">{student.stats.overallProgress}%</span>
                <span className="text-[8px] font-mono text-slate-400 font-semibold tracking-wider uppercase">READINESS</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 px-1 leading-relaxed">
              Calculated weight of your resume matching index, code sandbox completions, and mock recruiter evaluations.
            </p>
          </div>

        </div>

        {/* Right Column: Portal Content workspace (8 cols / ~70% width) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="flex flex-col gap-6 w-full"
            >
              {activeTab === "resume" ? (
                <ResumeAnalyzer student={student} onAnalysisSuccess={onProfileUpdate} />
              ) : activeTab === "coding" ? (
                <CodingWorkspace student={student} onSubmissionSuccess={onProfileUpdate} />
              ) : activeTab === "interview" ? (
                <InterviewSimulator student={student} onSessionUpdated={onProfileUpdate} />
              ) : activeTab === "analytics" ? (
                <PerformanceAnalytics student={student} />
              ) : (
                <>
                  {/* General Overview Tab Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Resume Score Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                      <div className="bg-blue-50 border border-blue-100/50 p-2.5 rounded-xl text-blue-900">
                        <Award className="w-5 h-5 text-blue-900" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Resume Rating</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">{student.stats.resumeScore}<span className="text-xs text-slate-400 font-normal"> / 100</span></p>
                      </div>
                    </div>

                    {/* Challenges Solved Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                      <div className="bg-emerald-50 border border-emerald-100/50 p-2.5 rounded-xl text-emerald-700">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Coding Drills</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">{student.stats.challengesSolved}<span className="text-xs text-slate-400 font-normal"> / {student.stats.totalChallenges}</span></p>
                      </div>
                    </div>

                    {/* Interview runs Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                      <div className="bg-amber-50 border border-amber-100/50 p-2.5 rounded-xl text-amber-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Mock Sessions</p>
                        <p className="text-xl font-bold text-slate-800 mt-0.5">{student.stats.interviewsCompleted} <span className="text-xs text-slate-400 font-normal font-sans">runs</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Core Phase Roadmap (Structured Plan) */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-900" /> Professional Placement Milestones
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">5 stages structured for career evaluation and industry matching</p>
                      </div>
                      <span className="self-start sm:self-center px-3 py-1 rounded-md text-[9px] font-bold bg-blue-50 border border-blue-100 text-blue-900 font-mono uppercase tracking-wide">
                        Stage 5 Active
                      </span>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Phase 1 */}
                      <div className="border border-slate-150 rounded-xl p-4 flex gap-4 bg-slate-50/30">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            1
                          </div>
                          <div className="w-px h-full bg-slate-200 mt-2" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-slate-800">Core Portal Registry</h5>
                            <span className="self-start px-2 py-0.5 rounded text-[8px] bg-slate-100 border border-slate-200 text-slate-500 font-mono uppercase font-bold tracking-wider">
                              Completed
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Registered candidate files and targeted role parameters.
                          </p>
                        </div>
                      </div>

                      {/* Phase 2 */}
                      <div className="border border-slate-150 rounded-xl p-4 flex gap-4 bg-slate-50/30">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            2
                          </div>
                          <div className="w-px h-full bg-slate-200 mt-2" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-slate-800">AI Resume Audit</h5>
                            <span className="self-start px-2 py-0.5 rounded text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-750 font-mono uppercase font-bold tracking-wider">
                              Completed
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Verified technical keywords and layout compliance parameters using Gemini models.
                          </p>
                        </div>
                      </div>

                      {/* Phase 3 */}
                      <div className="border border-slate-150 rounded-xl p-4 flex gap-4 bg-slate-50/30">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            3
                          </div>
                          <div className="w-px h-full bg-slate-200 mt-2" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-slate-800">Mock Recruitment Session</h5>
                            <span className="self-start px-2 py-0.5 rounded text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-750 font-mono uppercase font-bold tracking-wider">
                              Completed
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Completed behavioral and scale-design discussion scripts with automated analytical review.
                          </p>
                        </div>
                      </div>

                      {/* Phase 4 */}
                      <div className="border border-slate-150 rounded-xl p-4 flex gap-4 bg-slate-50/30">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            4
                          </div>
                          <div className="w-px h-full bg-slate-200 mt-2" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-slate-800">Algorithmic Sandbox Editor</h5>
                            <span className="self-start px-2 py-0.5 rounded text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-750 font-mono uppercase font-bold tracking-wider">
                              Completed
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Solved structural code challenges with integrated Big-O asymptotic analysis.
                          </p>
                        </div>
                      </div>

                      {/* Phase 5 */}
                      <div className="border border-blue-200 bg-blue-50/20 rounded-xl p-4 flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center text-xs font-bold shadow-sm">
                            5
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-blue-900">Telemetry Analytics & Portfolio Review</h5>
                            <span className="self-start px-2 py-0.5 rounded text-[8px] bg-blue-100 border border-blue-200 text-blue-900 font-mono uppercase font-bold tracking-wider">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Consolidated feedback reports and interactive metrics tracking placement progress.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sandbox State Verification (Academic Style) */}
                  <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 mb-3.5 flex items-center gap-2 uppercase tracking-wide font-mono">
                      <Terminal className="w-4 h-4 text-blue-900" /> Candidate Verification Record
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-1">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">AUTHORIZED ENDPOINTS</p>
                        <p className="text-xs font-bold text-slate-800">Resume & Profile Parser: <span className="text-emerald-700">Online</span></p>
                        <p className="text-xs font-bold text-slate-800">Practice sandbox environment: <span className="text-emerald-700">Online</span></p>
                      </div>
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-1">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">SYSTEM PARAMETERS</p>
                        <p className="text-xs text-slate-600">Candidate Role: <strong className="font-semibold text-slate-850">{student.targetRole}</strong></p>
                        <p className="text-xs text-slate-600">Matching Focus: <strong className="font-semibold text-slate-850">{student.targetCompany || "Global tech companies"}</strong></p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 University Placement Administration. Portfolio session active.</p>
          <div className="flex gap-4 font-mono text-[9px] text-slate-400">
            <span>NETWORK: ACADEMIC OFFICE</span>
            <span>SECURE GATEWAY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
