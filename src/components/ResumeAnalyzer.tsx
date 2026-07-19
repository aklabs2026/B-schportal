import React, { useState, useRef } from "react";
import { 
  FileText, UploadCloud, Sparkles, CheckCircle, AlertTriangle, 
  Clock, AlertCircle, Loader2, Target, Award
} from "lucide-react";
import { Student, ResumeAnalysis } from "../types";

interface ResumeAnalyzerProps {
  student: Student;
  onAnalysisSuccess: (updatedStudent: Student) => void;
}

export default function ResumeAnalyzer({ student, onAnalysisSuccess }: ResumeAnalyzerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(
    student.resumeAnalyses && student.resumeAnalyses.length > 0 ? student.resumeAnalyses[0] : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        startAnalysis(file.name, text || `PDF content placeholder for ${file.name}`);
      };
      reader.readAsText(file);
    } else if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        startAnalysis(file.name, text);
      };
      reader.readAsText(file);
    } else {
      setError("Unsupported file format. Please upload .txt, .md or paste your resume text directly.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setError("Please paste your resume text before analyzing.");
      return;
    }
    setError(null);
    startAnalysis("Pasted_Resume_Text.txt", pastedText);
  };

  const startAnalysis = async (nameOfFile: string, textContent: string) => {
    setAnalyzing(true);
    setError(null);
    
    const stages = [
      "Extracting resume semantic elements...",
      `Comparing keywords against target: "${student.targetRole}"...`,
      `Evaluating compliance for company: "${student.targetCompany || "target company"}"...`,
      "Synthesizing actionable recommendations..."
    ];

    let currentStage = 0;
    setStatusMessage(stages[0]);
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setStatusMessage(stages[currentStage]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          fileName: nameOfFile,
          resumeText: textContent
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      onAnalysisSuccess(data.user);
      setActiveAnalysis(data.analysis);
      setPastedText("");
      setFileName(null);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during resume analysis.");
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-800 border-emerald-200 bg-emerald-50";
    if (score >= 70) return "text-amber-800 border-amber-200 bg-amber-50";
    return "text-rose-800 border-rose-200 bg-rose-50";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-600";
    if (score >= 70) return "bg-amber-500";
    return "bg-rose-600";
  };

  return (
    <div className="space-y-8 animate-fade-in w-full">
      
      {/* Top Title/Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] bg-blue-50 text-blue-900 border border-blue-150 font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md">
            RESUME OPTIMIZATION
          </span>
          <h2 className="text-lg font-bold font-display tracking-tight text-slate-900 mt-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-900" /> AI Resume Evaluation
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Submit your resume to evaluate technical score matching, identify core keyword gaps, and receive feedback aligned with: <strong className="text-blue-900 font-semibold">{student.targetRole}</strong> at <strong className="text-blue-900 font-semibold">{student.targetCompany || "target company"}</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Upload area & past analysis list (5 cols / ~40% width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Upload / Input Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800">Submit Resume</h3>
              <p className="text-[9px] text-slate-400 font-mono font-semibold uppercase tracking-wide mt-0.5">TEXT OR FILE UPLOAD</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl p-3.5 font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Drag & Drop File Upload */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-blue-900 bg-blue-50/40 scale-[0.99]" 
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".txt,.md,.pdf"
                onChange={handleFileChange}
              />
              
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-blue-900 mb-2.5">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-xs font-bold text-slate-800">
                {fileName ? `Selected: ${fileName}` : "Drop resume file or click to upload"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Supports PDF, TXT, MD up to 4MB
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center text-slate-300 text-[9px] font-mono uppercase tracking-widest my-3">
              <div className="flex-1 border-t border-slate-100" />
              <span className="px-2 text-slate-400">or paste raw text</span>
              <div className="flex-1 border-t border-slate-100" />
            </div>

            {/* Text Paste Area */}
            <div className="space-y-3">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the plain text of your resume here..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono"
              />

              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={analyzing || !pastedText.trim()}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 font-bold text-white rounded-xl py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm border-b-2 border-amber-500"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evaluate Raw Text</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Past Analyses Log List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Clock className="w-4 h-4 text-blue-900" /> Past File Audits
            </h3>

            {student.resumeAnalyses && student.resumeAnalyses.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {student.resumeAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    type="button"
                    onClick={() => setActiveAnalysis(analysis)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      activeAnalysis?.id === analysis.id 
                        ? "bg-blue-50/50 border-blue-900 shadow-sm" 
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className={`text-xs font-bold truncate ${activeAnalysis?.id === analysis.id ? "text-blue-900" : "text-slate-800"}`}>{analysis.fileName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-medium">
                        {new Date(analysis.analyzedAt).toLocaleDateString()} • {new Date(analysis.analyzedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div className={`px-2 py-0.5 rounded-md border font-mono text-xs font-bold shrink-0 ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No past audited logs found</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Interactive Report Feedback Display (7 cols / ~60% width) */}
        <div className="lg:col-span-7">
          
          {analyzing ? (
            /* Analyzing State Loader Card */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[450px]">
              <div className="relative mb-5">
                <div className="w-12 h-12 rounded-full border-3 border-slate-100 border-t-blue-900 animate-spin" />
                <Sparkles className="w-5 h-5 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Analyzing Document</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed font-medium">{statusMessage}</p>
            </div>
          ) : activeAnalysis ? (
            /* Result Feedback Card */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />

              {/* Card Header with Score Meter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200/60 font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded-md">
                    Academic Evaluation Audit
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2.5">{activeAnalysis.fileName}</h3>
                  <p className="text-[10px] text-slate-400 font-mono font-medium">
                    AUDITED: {new Date(activeAnalysis.analyzedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
                  <div className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center font-mono ${getScoreColor(activeAnalysis.score)}`}>
                    <span className="text-lg font-bold leading-none">{activeAnalysis.score}</span>
                    <span className="text-[8px] uppercase font-bold tracking-wider opacity-80 mt-0.5">Rating</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Matching Index</p>
                    <p className="text-xs font-bold text-slate-700">{activeAnalysis.roleMatch}</p>
                  </div>
                </div>
              </div>

              {/* Progress Slider Display */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>RESUME COMPLIANCE BENCHMARK</span>
                  <span>{activeAnalysis.score} / 100</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${getScoreProgressColor(activeAnalysis.score)}`}
                    style={{ width: `${activeAnalysis.score}%` }}
                  />
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-900" /> Recruiter Placement Synthesis
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activeAnalysis.summary}
                </p>
              </div>

              {/* Key Strengths & Crucial Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Strengths */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Verifiable Highlights
                  </h4>
                  <ul className="space-y-2">
                    {activeAnalysis.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Keyword Additions
                  </h4>
                  <ul className="space-y-2">
                    {activeAnalysis.improvements.map((imp, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Custom Action Notice */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 font-semibold">
                <span>UNIVERSITY COMPLIANCE PIPELINE</span>
                <span className="text-slate-400">SESSION VERIFIED</span>
              </div>

            </div>
          ) : (
            /* No Analysis State Empty Card */
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[450px]">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-full text-slate-300 mb-4 animate-bounce">
                <FileText className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No active analysis loaded</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed font-medium">
                To begin the document evaluation process, upload a resume file (.txt, .md or .pdf) or paste the raw markdown text into the inputs panel.
              </p>
              
              <div className="mt-8 flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] text-blue-900 font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Target: {student.targetRole} @ {student.targetCompany}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
