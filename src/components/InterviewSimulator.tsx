import React, { useState } from "react";
import { 
  Briefcase, Building, Send, Loader2, Award, 
  CheckCircle2, AlertCircle, MessageSquare, History, Sparkles, 
  ChevronRight, RefreshCw, BarChart2, Star, User, ShieldCheck
} from "lucide-react";
import { Student, InterviewSession, ChatMessage } from "../types";

interface InterviewSimulatorProps {
  student: Student;
  onSessionUpdated: (updatedStudent: Student) => void;
}

const POPULAR_ROLES = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Fullstack Developer",
  "Data Scientist",
  "Product Manager",
  "Cloud Solutions Architect"
];

const POPULAR_COMPANIES = [
  "Google",
  "Microsoft",
  "Meta",
  "Amazon",
  "Netflix",
  "Apple",
  "Stripe",
  "OpenAI"
];

export default function InterviewSimulator({ student, onSessionUpdated }: InterviewSimulatorProps) {
  const [selectedRole, setSelectedRole] = useState(student.targetRole || "Software Engineer");
  const [selectedCompany, setSelectedCompany] = useState(student.targetCompany || "Google");
  
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [viewingHistorySession, setViewingHistorySession] = useState<InterviewSession | null>(
    student.interviewSessions && student.interviewSessions.length > 0 ? student.interviewSessions[0] : null
  );

  // Filter out completed sessions for history
  const historySessions = student.interviewSessions || [];

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          role: selectedRole,
          company: selectedCompany
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setActiveSession(data.session);
        setViewingHistorySession(null);
      }
    } catch (err) {
      console.error("Failed to start interview:", err);
    } finally {
      setStarting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSession || loading) return;

    const userMsg = inputValue.trim();
    setInputValue("");
    setLoading(true);

    // Optimistically update client UI with user's input immediately
    const optimisticHistory: ChatMessage[] = [
      ...activeSession.chatHistory,
      { role: "user", text: userMsg }
    ];
    setActiveSession({
      ...activeSession,
      chatHistory: optimisticHistory
    });

    try {
      const response = await fetch("/api/interview/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          sessionId: activeSession.id,
          message: userMsg
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setActiveSession(data.session);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeInterview = async () => {
    if (!activeSession || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          sessionId: activeSession.id
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        onSessionUpdated(data.user);
        // Find the completed session from the updated user stats to render results
        const completedSession = data.user.interviewSessions.find((s: InterviewSession) => s.id === activeSession.id);
        setActiveSession(null);
        setViewingHistorySession(completedSession || data.session);
      }
    } catch (err) {
      console.error("Failed to finalize interview:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderEvaluationView = () => {
    if (!viewingHistorySession) return null;
    const currentScore = viewingHistorySession.score ?? 75;
    const currentFeedback = viewingHistorySession.feedback ?? "Session recorded. Click 'Setup New Config' to configure additional simulation coordinates.";
    const isHigh = currentScore >= 80;
    const strengths = isHigh ? [
      "Demonstrated thorough technical domain knowledge and scale-readiness.",
      "Well-structured communication layout detailing engineering trade-offs.",
      "Great explanation of architectural principles and teamwork alignment."
    ] : [
      "Communicates basic technical patterns and terminology clearly.",
      "Shows solid educational background and project motivation.",
      "Addresses questions with structured professionalism."
    ];

    const weaknesses = isHigh ? [
      "Could specify more micro-performance metrics in explanations.",
      "Practice deeper distributed query design patterns.",
      "Flesh out error boundary recovery protocols under peak pressure."
    ] : [
      "Elaborate more comprehensively under behavioral prompts.",
      "Quantify engineering and performance impact in answers.",
      "Use the structured STAR (Situation, Task, Action, Result) methodology."
    ];

    return (
      /* Detailed Evaluation Scorecard View */
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
        
        {/* Score Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-blue-900">
                  <Award className="w-5 h-5 text-blue-900" />
                </div>
                <div>
                  <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200/60 font-mono uppercase font-bold px-2 py-0.5 rounded-md">
                    Evaluation Report
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{viewingHistorySession.role}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-medium">
                    Target Company: <span className="text-blue-900 font-semibold">{viewingHistorySession.company}</span>
                  </p>
                </div>
              </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
            <div className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center font-mono ${
              isHigh ? "text-emerald-800 border-emerald-200 bg-emerald-50" : "text-amber-800 border-amber-200 bg-amber-50"
            }`}>
              <span className="text-lg font-bold leading-none">{currentScore}</span>
              <span className="text-[8px] uppercase tracking-wider font-bold opacity-80 mt-0.5">Rating</span>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-mono font-bold uppercase">Status</p>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">COMPLETED & AUDITED</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Feedback Critique */}
          <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-blue-900" /> Executive Appraisal Synthesis
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {currentFeedback}
            </p>
          </div>

          {/* Highlights & Demerits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Demonstrated Strengths
              </h4>
              <ul className="space-y-2">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Star className="w-4 h-4 text-amber-500" /> Actionable Recommendations
              </h4>
              <ul className="space-y-2">
                {weaknesses.map((wk, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample QA Dialog Loops */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-900" /> Live Conversation Logs
            </h4>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200/80 max-h-64 overflow-y-auto">
              {viewingHistorySession.chatHistory.map((chat, idx) => (
                <div key={idx} className="p-4 text-xs space-y-1.5 font-medium">
                  <div className={`font-bold uppercase tracking-wider text-[9px] ${
                    chat.role === "model" ? "text-blue-900" : "text-slate-500"
                  }`}>
                    {chat.role === "model" ? "Interviewer AI" : `${student.name} (Student)`}
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer controls */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setActiveSession(null);
              setViewingHistorySession(null);
            }}
            className="bg-blue-900 hover:bg-blue-800 border-b-2 border-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Start New Session
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      
      {/* Dynamic Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] bg-blue-50 text-blue-900 border border-blue-150 font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md">
            MOCK ASSESSMENT
          </span>
          <h2 className="text-lg font-bold font-display tracking-tight text-slate-900 mt-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-900" /> Interactive Placement Screener
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Practice mock tech screenings and behavioral queries. Select your targeted role, chat with the evaluation system, and view your analytical scorecard feedback.
          </p>
        </div>
        
        {!activeSession && (
          <button
            onClick={() => {
              setActiveSession(null);
              setViewingHistorySession(null);
            }}
            className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-900" /> Setup Parameters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Main Work Area (Left 8 Columns / ~67% width) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Active Interview Session */}
          {activeSession ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md flex flex-col h-[600px] transition-all relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />

              {/* Interview Status Bar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Active Interview Session: {activeSession.role}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                      Target Recruiter: <span className="text-blue-900">{activeSession.company}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleFinalizeInterview}
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 text-xs font-bold text-white shadow-sm cursor-pointer transition-all flex items-center gap-1.5 border-b-2 border-amber-500"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Complete Session
                    </>
                  )}
                </button>
              </div>

              {/* Chat Transcript Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {activeSession.chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 max-w-[85%] ${
                      msg.role === "model" ? "mr-auto" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                      msg.role === "model" 
                        ? "bg-blue-900 border-blue-800 text-amber-400" 
                        : "bg-white border-slate-200 text-slate-700"
                    }`}>
                      {msg.role === "model" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm font-medium ${
                      msg.role === "model"
                        ? "bg-white border border-slate-200 text-slate-700"
                        : "bg-blue-900 text-white"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Loading / Typing indicator */}
                {loading && (
                  <div className="flex gap-3 max-w-[85%] mr-auto">
                    <div className="w-8 h-8 rounded-xl bg-blue-900 border border-blue-800 text-amber-400 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-white border border-slate-200 text-slate-400 text-xs font-mono flex items-center gap-2 font-bold uppercase tracking-wide shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span>Assessor writing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loading}
                  placeholder="Draft your professional response to the question..."
                  className="flex-1 bg-slate-50 text-sm border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-700 outline-none transition-all disabled:opacity-50 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 px-5 rounded-xl font-bold transition-all flex items-center justify-center shrink-0 border-b-2 border-amber-500 cursor-pointer text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : viewingHistorySession ? (
            renderEvaluationView()
          ) : (
            
            /* Interview Config Bootstrapper */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
              
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Setup Parameters</h3>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase font-semibold">CHOOSE TARGET PARAMETERS</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Select Target Role */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Job Role</label>
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 appearance-none font-bold"
                    >
                      {POPULAR_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <ChevronRight className="w-4 h-4 transform rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Select Target Company */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Organization</label>
                  <div className="relative">
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 appearance-none font-bold"
                    >
                      {POPULAR_COMPANIES.map((comp) => (
                        <option key={comp} value={comp}>{comp}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <ChevronRight className="w-4 h-4 transform rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Warning Info banner */}
              <div className="bg-amber-50 border border-amber-200 text-slate-600 rounded-xl p-4 text-xs leading-relaxed flex items-start gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-800 font-bold block mb-0.5">Mock Simulator Guidelines:</strong>
                  The simulator initiates an interactive question-and-answer cycle. We recommend conducting a back-and-forth dialogue of at least 3 messages before completing the session to trigger rich analytical report metrics.
                </div>
              </div>

              {/* Start Trigger */}
              <button
                onClick={handleStartInterview}
                disabled={starting}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer shadow-sm border-b-2 border-amber-500 transition-colors"
              >
                {starting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Preparing assessment session...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Initiate Mock Screening Session</span>
                  </>
                )}
              </button>

            </div>
          )}

        </div>

        {/* Right Side Logs & History list (Right 4 columns / ~33% width) */}
        <div className="xl:col-span-4 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <History className="w-4 h-4 text-blue-900" /> Historic Sessions
            </h3>

            {historySessions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {historySessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setActiveSession(null);
                      setViewingHistorySession(session);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      viewingHistorySession?.id === session.id
                        ? "bg-blue-50/50 border-blue-900"
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className={`text-xs font-bold truncate ${viewingHistorySession?.id === session.id ? "text-blue-900" : "text-slate-800"}`}>
                        {session.role}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-0.5">
                        {session.company} • {session.chatHistory.length} prompts
                      </p>
                    </div>

                    <div className={`w-8 h-8 rounded-lg border font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      session.score && session.score >= 80 ? "text-emerald-850 border-emerald-200 bg-emerald-50" : "text-amber-850 border-amber-200 bg-amber-50"
                    }`}>
                      {session.score || "--"}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <MessageSquare className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No prior session records found</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
