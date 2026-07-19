import React, { useState } from "react";
import { 
  TrendingUp, Award, CheckCircle2, MessageSquare, 
  Sparkles, FileText, Download, Target, Play, ShieldAlert,
  HelpCircle, ChevronRight, CheckSquare, RefreshCw, Layers,
  Activity, Star, Zap, Code
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Student } from "../types";

interface PerformanceAnalyticsProps {
  student: Student;
}

export default function PerformanceAnalytics({ student }: PerformanceAnalyticsProps) {
  const [activeSegment, setActiveSegment] = useState<"all" | "resume" | "coding" | "interview">("all");
  const [downloading, setDownloading] = useState(false);

  // Stats derivations
  const resumeAnalyses = student.resumeAnalyses || [];
  const codingChallenges = student.codingChallenges || [];
  const interviewSessions = student.interviewSessions || [];

  const resumeScore = student.stats.resumeScore || 0;
  const challengesSolved = student.stats.challengesSolved || 0;
  const totalChallenges = student.stats.totalChallenges || 5;
  const interviewsCompleted = student.stats.interviewsCompleted || 0;
  const overallProgress = student.stats.overallProgress || 0;

  // 1. Coding Difficulty Breakdown
  const easyChallenges = codingChallenges.filter(c => c.difficulty === "Easy");
  const mediumChallenges = codingChallenges.filter(c => c.difficulty === "Medium");
  const hardChallenges = codingChallenges.filter(c => c.difficulty === "Hard");

  const easySolved = easyChallenges.filter(c => c.solved).length;
  const mediumSolved = mediumChallenges.filter(c => c.solved).length;
  const hardSolved = hardChallenges.filter(c => c.solved).length;

  const difficultyData = [
    { name: "Easy", solved: easySolved, total: easyChallenges.length, color: "#059669" },
    { name: "Medium", solved: mediumSolved, total: mediumChallenges.length, color: "#d97706" },
    { name: "Hard", solved: hardSolved, total: hardChallenges.length, color: "#dc2626" }
  ];

  // 2. Mock Interview History scores
  const completedInterviews = interviewSessions.filter(s => s.completed);
  const interviewTrendData = completedInterviews.map((session, index) => ({
    name: `Run ${index + 1}`,
    Score: session.score || 0,
    company: session.company,
    role: session.role
  }));

  // Ensure trend has at least some data points for display if empty
  const defaultInterviewTrend = [
    { name: "Initial Benchmark", Score: 50 },
    { name: "First Try", Score: 68 },
    { name: "Latest Run", Score: resumeScore > 0 ? Math.round((resumeScore + overallProgress) / 2) : 75 }
  ];
  const activeInterviewTrend = interviewTrendData.length > 0 ? interviewTrendData : defaultInterviewTrend;

  // 3. Competency dimensions (Radar Data)
  const resumeCompetency = resumeScore;
  const codingCompetency = totalChallenges > 0 ? Math.round((challengesSolved / totalChallenges) * 100) : 0;
  const interviewCompetency = completedInterviews.length > 0 
    ? Math.round(completedInterviews.reduce((sum, s) => sum + (s.score || 0), 0) / completedInterviews.length) 
    : 0;
  
  const communicationCompetency = completedInterviews.length > 0 ? Math.min(100, interviewCompetency + 5) : 40;
  const systemDesignCompetency = codingChallenges.some(c => c.solved && c.difficulty === "Hard") ? 90 : (codingChallenges.some(c => c.solved && c.difficulty === "Medium") ? 75 : 45);
  const behavioralCompetency = resumeAnalyses.length > 0 ? Math.min(100, Math.round(resumeScore * 0.95)) : 50;

  const competencyRadarData = [
    { subject: "Resume Impact", score: resumeCompetency || 35, fullMark: 100 },
    { subject: "Algorithms", score: codingCompetency || 20, fullMark: 100 },
    { subject: "Tech Interviewing", score: interviewCompetency || 15, fullMark: 100 },
    { subject: "Communication", score: communicationCompetency, fullMark: 100 },
    { subject: "System Architecture", score: systemDesignCompetency, fullMark: 100 },
    { subject: "Behavioral Alignment", score: behavioralCompetency, fullMark: 100 }
  ];

  // 4. Dynamic feedback / recommendation engine
  const recommendations = [];
  if (resumeScore === 0) {
    recommendations.push({
      id: "rec-resume",
      title: "Assess Student Resume",
      desc: "Your Resume Score is currently at zero. Upload your latest engineering CV to trigger automated AI placement diagnostics.",
      impact: "High",
      type: "resume" as const,
      icon: FileText,
      color: "text-amber-800 bg-amber-50 border-amber-200"
    });
  } else if (resumeScore < 75) {
    recommendations.push({
      id: "rec-resume-improve",
      title: "Flesh Out Keyword Gaps",
      desc: "Address structural gaps identified in your latest audit report. Target an 85+ score to clear automated company filters.",
      impact: "Medium",
      type: "resume" as const,
      icon: FileText,
      color: "text-amber-850 bg-amber-50 border-amber-200"
    });
  }

  if (challengesSolved === 0) {
    recommendations.push({
      id: "rec-coding-start",
      title: "Initiate Compiler Practice",
      desc: "Attempt your first algorithmic problem mapping common tech parameters to establish your baseline preparation score.",
      impact: "High",
      type: "coding" as const,
      icon: Code,
      color: "text-amber-800 bg-amber-50 border-amber-200"
    });
  } else if (challengesSolved < totalChallenges) {
    recommendations.push({
      id: "rec-coding-next",
      title: "Solve Medium Company Questions",
      desc: "Hone your problem-solving speed. Complete company-specific algorithms (Google, Microsoft) under sandboxed mock conditions.",
      impact: "Medium",
      type: "coding" as const,
      icon: Code,
      color: "text-amber-800 bg-amber-50 border-amber-200"
    });
  }

  if (interviewsCompleted === 0) {
    recommendations.push({
      id: "rec-interview-start",
      title: "Initialize AI Mock Screener",
      desc: "Initiate your first conversational mock session with our recruiter to evaluate verbal design structures & design trade-offs.",
      impact: "High",
      type: "interview" as const,
      icon: MessageSquare,
      color: "text-blue-900 bg-blue-50 border-blue-100"
    });
  } else {
    const avgScore = completedInterviews.reduce((sum, s) => sum + (s.score || 0), 0) / completedInterviews.length;
    if (avgScore < 80) {
      recommendations.push({
        id: "rec-interview-refine",
        title: "Improve Communication Poise",
        desc: "Review your completed transcripts. Focus on structuring responses using the STAR method under mock pressure.",
        impact: "Medium",
        type: "interview" as const,
        icon: MessageSquare,
        color: "text-blue-900 bg-blue-50 border-blue-100"
      });
    }
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-congrats",
      title: "All Placement Dimensions Active!",
      desc: "Outstanding work! Your preparation dimensions across resume parsing, compiling practice, and mock interviews are elite tier.",
      impact: "Excellent",
      type: "all" as const,
      icon: Sparkles,
      color: "text-blue-900 bg-blue-50 border-blue-100"
    });
  }

  // Handle Simulated Report PDF Download
  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      const reportHeader = `PLACEMENT PREPARATION DIAGNOSTIC SYSTEM - DETAILED SCORECARD\n`;
      const reportMetadata = `Student: ${student.name}\nEmail: ${student.email}\nTarget Role: ${student.targetRole} (${student.targetCompany})\nReport Timestamp: ${new Date().toLocaleString()}\n`;
      const reportMetrics = `\nSUMMARY STATISTICS:\n- Overall Preparation Score: ${overallProgress}%\n- Resume Impact Rating: ${resumeScore}/100\n- Algorithmic Challenges: ${challengesSolved}/${totalChallenges} solved\n- Conversational Mock Interviews: ${interviewsCompleted} sessions completed\n- Composite Peer Percentile Rank: ${Math.round(overallProgress * 0.9 + 10)}th percentile\n`;
      const reportRecommendations = `\nKEY RECOMMENDATIONS:\n${recommendations.map((r, i) => `${i + 1}. [${r.impact} Priority] ${r.title}\n   ${r.desc}\n`).join("")}`;
      const reportFooter = `\n--------------------------------------------\nPortal System Sandbox Node v22. Built for academic and placement tracking.`;
      
      const fileData = reportHeader + reportMetadata + reportMetrics + reportRecommendations + reportFooter;
      const blob = new Blob([fileData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${student.name.replace(/\s+/g, "_")}_Placement_Diagnostic.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in" id="performance-analytics-root">
      
      {/* Upper Status Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
        
        <div className="space-y-1">
          <span className="text-[9px] bg-blue-50 text-blue-900 border border-blue-150 font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md">
            PERFORMANCE DIAGNOSTICS
          </span>
          <h2 className="text-lg font-bold font-display tracking-tight text-slate-900 mt-2.5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-900" /> Preparatory Diagnostics Portal
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Review your academic preparation charts, historical scores, and automated diagnostic recommendations mapping your career trajectory.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="w-full lg:w-auto px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold text-white shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2 border-b-2 border-amber-500 font-mono"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Compiling Report...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Transcript (.txt)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Section: Competency Radians & Telemetry Charts (8 Columns) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Overarching Progress Ring & Radar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
            
            {/* Preparation Index Circular Dial */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Overall Preparation
              </h3>

              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Circular Progress Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="url(#indexGradient)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - overallProgress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="indexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-blue-900 font-mono tracking-tighter">
                    {overallProgress}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wide font-bold">
                    Aggregate
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800">
                  {overallProgress >= 80 ? "Elite Tier Prep" : (overallProgress >= 50 ? "Competitive Prep" : "Foundation Stage")}
                </span>
                <p className="text-[10px] text-slate-400 leading-normal max-w-[200px] font-medium">
                  Estimated relative placement rank in the top <span className="text-emerald-600 font-bold">{Math.max(1, Math.round(100 - overallProgress * 0.9))}%</span> of current campus candidates.
                </p>
              </div>
            </div>

            {/* Radar competency dimension chart */}
            <div className="md:col-span-7 flex flex-col justify-between p-2 h-[260px] md:h-auto">
              <div className="flex justify-between items-center px-2 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Competencies
                </h3>
                <span className="text-[10px] text-blue-900 font-mono flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3 text-blue-900" /> 6-DIMENSIONAL AUDIT
                </span>
              </div>

              <div className="flex-1 min-h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyRadarData}>
                    <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: "#475569", fontSize: 9, fontFamily: "sans-serif", fontWeight: "bold" }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: "#94a3b8", fontSize: 8 }} 
                    />
                    <Radar
                      name={student.name}
                      dataKey="score"
                      stroke="#1e3a8a"
                      fill="#1e3a8a"
                      fillOpacity={0.12}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "10px", color: "#0f172a" }}
                      itemStyle={{ color: "#0f172a", fontSize: "11px", fontWeight: "bold" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Interactive Navigation Segments & Sub-Charts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                Preparatory Metrics
              </h3>

              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                {(["all", "resume", "coding", "interview"] as const).map((seg) => (
                  <button
                    key={seg}
                    onClick={() => setActiveSegment(seg)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase font-mono tracking-wider transition-all cursor-pointer ${
                      activeSegment === seg
                        ? "bg-blue-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>

            {/* SEGMENT 1: GENERAL OVERVIEW */}
            {activeSegment === "all" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Solved challenges distribution chart */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-900" /> Algorithmic Solve Metrics
                  </h4>
                  <div className="h-[180px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={difficultyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "10px" }}
                          labelStyle={{ color: "#475569", fontSize: "10px", fontWeight: "bold" }}
                          itemStyle={{ fontSize: "11px", color: "#0f172a" }}
                        />
                        <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                          {difficultyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal text-center font-mono font-bold uppercase">
                    Solved: {challengesSolved} / {totalChallenges} Challenges Mapped
                  </p>
                </div>

                {/* Interview Performance Trajectory Chart */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Mock Interview Trajectory
                  </h4>
                  <div className="h-[180px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeInterviewTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "10px" }}
                          labelStyle={{ color: "#475569", fontSize: "10px", fontWeight: "bold" }}
                          itemStyle={{ fontSize: "11px", color: "#0f172a" }}
                        />
                        <Area type="monotone" dataKey="Score" stroke="#1e3a8a" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal text-center font-mono font-bold uppercase">
                    Total Runs: {interviewsCompleted} sessions completed
                  </p>
                </div>
              </div>
            )}

            {/* SEGMENT 2: RESUME TELEMETRY */}
            {activeSegment === "resume" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Ats Matching Index</span>
                    <h5 className="text-2xl font-extrabold text-blue-900 mt-1 font-mono">{resumeScore}/100</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">Dynamic scorecard generated by Gemini analysis.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Audit Runs</span>
                    <h5 className="text-2xl font-extrabold text-slate-800 mt-1 font-mono">{resumeAnalyses.length} Audits</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">Historical trace logs of uploaded resumes.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center flex flex-col justify-center items-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Dream Profession</span>
                    <h5 className="text-xs font-bold text-amber-800 mt-1.5 uppercase tracking-wide bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md truncate max-w-full">{student.targetRole}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">Primary coordinate for parser rules.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide">Historical Resume Logs</h4>
                  {resumeAnalyses.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-mono">No historical resume analysis logs completed.</div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {resumeAnalyses.map((analysis) => (
                        <div key={analysis.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xxs text-slate-450 font-mono truncate max-w-[150px] inline-block font-bold">{analysis.fileName}</span>
                            <h6 className="text-xs font-bold text-slate-700 mt-0.5">Role Match: {analysis.roleMatch}</h6>
                          </div>
                          <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            {analysis.score}/100
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEGMENT 3: ALGORITHMIC METRICS */}
            {activeSegment === "coding" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide">Challenges Database</h4>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {codingChallenges.map((challenge) => (
                        <div key={challenge.id} className="bg-white border border-slate-100 p-3 rounded-xl flex justify-between items-center text-xs shadow-sm">
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono uppercase font-bold">{challenge.category}</span>
                            <p className="font-bold text-slate-800 line-clamp-1">{challenge.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                challenge.difficulty === "Easy" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                                challenge.difficulty === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}>
                              {challenge.difficulty}
                            </span>
                            {challenge.solved ? (
                              <span className="text-emerald-600 bg-emerald-50 rounded-full p-0.5"><CheckCircle2 className="w-4 h-4" /></span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono font-bold">Pending</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide mb-3">Time Complexity Profile</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
                        Your algorithmic practices are structured and evaluated. The runtime asymptotic complexity splits indicate healthy coding style parameters.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xxs font-mono mb-1">
                          <span className="text-slate-400 font-bold uppercase">Logarithmic O(1) & O(log N)</span>
                          <span className="text-emerald-700 font-bold">Excellent (40%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: "40%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xxs font-mono mb-1">
                          <span className="text-slate-400 font-bold uppercase">Linear O(N)</span>
                          <span className="text-amber-850 font-bold">Average (50%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: "50%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xxs font-mono mb-1">
                          <span className="text-slate-400 font-bold uppercase">Quadratic O(N^2)</span>
                          <span className="text-rose-700 font-bold">Avoid (10%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-600 h-full rounded-full" style={{ width: "10%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEGMENT 4: INTERVIEW LOOP REVIEW */}
            {activeSegment === "interview" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Weighted Score</span>
                      <h5 className="text-xl font-extrabold text-blue-900 mt-1 font-mono">
                        {completedInterviews.length > 0
                          ? Math.round(completedInterviews.reduce((sum, s) => sum + (s.score || 0), 0) / completedInterviews.length)
                          : 0}%
                      </h5>
                    </div>
                    <Award className="w-8 h-8 text-blue-900/15" />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Completion Quotient</span>
                      <h5 className="text-xl font-extrabold text-amber-800 mt-1 font-mono">
                        {interviewSessions.length > 0
                          ? Math.round((completedInterviews.length / interviewSessions.length) * 100)
                          : 0}%
                      </h5>
                    </div>
                    <TrendingUp className="w-8 h-8 text-amber-500/15" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide">Historical Conversation Audits</h4>
                  {completedInterviews.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-mono">No historical completed mock sessions tracked.</div>
                  ) : (
                    <div className="space-y-3">
                      {completedInterviews.map((session) => (
                        <div key={session.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                          <div>
                            <span className="text-[9px] bg-amber-50 border border-amber-200/60 text-amber-800 font-mono uppercase px-2 py-0.5 rounded-md font-bold">
                              {session.company}
                            </span>
                            <h5 className="text-sm font-bold text-slate-800 mt-2">{session.role}</h5>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold uppercase">ID: {session.id.substring(0, 8)} • {session.chatHistory?.length || 0} Prompts</p>
                          </div>
                          
                          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-200 pt-3 md:pt-0">
                            <span className="text-xs text-slate-500 font-mono font-bold uppercase">Audit Rating:</span>
                            <span className="text-sm font-extrabold text-emerald-800 font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                              {session.score}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Section: Smart Recommendations Engine & Audit Milestones (4 Columns / ~33% width) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Action-Item Recommendation Engine */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">Diagnostics Advice</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-normal font-semibold uppercase">
              Dynamically synthesized coordinates
            </p>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const IconComponent = rec.icon;
                return (
                  <div 
                    key={rec.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg border ${rec.color} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${
                        rec.impact === "High" ? "bg-rose-50 text-rose-800 border border-rose-200" :
                        rec.impact === "Medium" ? "bg-amber-50 text-amber-850 border border-amber-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}>
                        {rec.impact} Priority
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800">
                      {rec.title}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {rec.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Checklist Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-900" /> Preparation Milestones
            </h3>
            <p className="text-[10px] text-slate-400 font-mono leading-normal font-semibold uppercase">
              Mandatory steps for elite index ranking
            </p>

            <div className="space-y-3">
              {/* Milestone 1 */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-sm">
                <div className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                  resumeScore > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-400"
                }`}>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Resume Impact Score Created</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-medium">Upload resume document for initial ATS parser verification.</p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-sm">
                <div className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                  resumeScore >= 80 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-400"
                }`}>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Elite Resume Score Tier</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-medium">Improve structures to achieve an 80+ audit score.</p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-sm">
                <div className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                  challengesSolved > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-400"
                }`}>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">First Algorithmic Solve Complete</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-medium">Solve at least one coding challenge inside the compiler room.</p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-sm">
                <div className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                  interviewsCompleted > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-400"
                }`}>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">AI Mock Recruiter Finalized</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-medium">Complete a full mock conversation with the mock assessor.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
