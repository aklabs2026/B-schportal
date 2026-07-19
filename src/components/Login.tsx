import React, { useState } from "react";
import { GraduationCap, ArrowRight, User, Mail, Briefcase, Building, Loader2, ShieldCheck, Award } from "lucide-react";
import { Student } from "../types";

interface LoginProps {
  onLoginSuccess: (student: Student) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegistering 
      ? { email, name, targetRole, targetCompany }
      : { email };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 md:p-8 font-sans">
      
      {/* Decorative Collegiate Top Line */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-900 via-blue-700 to-amber-500 absolute top-0 left-0 z-50" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between z-10 py-5 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900 text-amber-400 p-2 rounded-xl">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-lg font-bold tracking-tight text-blue-900 font-display">University Career Portal</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">PLACEMENT PREP STATION</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] text-blue-900 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Database Connected
        </div>
      </header>

      {/* Auth Card Container */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          
          {/* Subtle Decorative Background Seal */}
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full border-4 border-slate-50/50 pointer-events-none flex items-center justify-center text-slate-100 font-bold font-display select-none">
            UNIV
          </div>

          {/* Academic Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900" />

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950 font-display tracking-tight">
              {isRegistering ? "Create Profile" : "Portal Access"}
            </h2>
            <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
              {isRegistering 
                ? "Configure your target role and organization to receive customized coding challenges and resume optimization tips." 
                : "Sign in with your registered student credentials. Registration is instant for new profiles."}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-[11px] rounded-lg p-3 mb-4 font-medium flex items-start gap-2">
              <span className="bg-rose-100 text-rose-700 w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Target Role */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    Target Role
                  </label>
                  <div className="relative">
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer font-medium"
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Cloud Architect">Cloud Architect</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[9px] text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Target Company */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    Dream Company
                  </label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="Google, Microsoft, Meta"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                Student Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@placement.edu"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Password / Access Code</label>
                <span className="text-[8px] text-slate-400 font-mono bg-slate-100 px-1 py-0.5 rounded">SANDBOX MODE</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 disabled:bg-blue-900/50 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-4 border-b-2 border-amber-500 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? "Create Profile" : "Access Portal"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Login Assist */}
          {!isRegistering && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setEmail("student@placement.edu")}
                className="text-[10px] text-blue-900 hover:text-blue-950 transition-all font-mono font-semibold flex items-center justify-center gap-1.5 mx-auto bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100/30"
              >
                <span>💡 Click to autofill student email</span>
              </button>
            </div>
          )}

          {/* Auth Mode Toggle */}
          <div className="mt-5 text-center text-xs text-slate-500 font-sans border-t border-slate-100 pt-4">
            {isRegistering ? "Profile already registered?" : "New student candidate?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-blue-900 hover:text-blue-950 font-bold transition-colors cursor-pointer ml-1 hover:underline text-xs"
            >
              {isRegistering ? "Sign In" : "Register Profile"}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-5 border-t border-slate-200">
        <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest leading-none">
          Placement Department Office • Academic Session Active
        </p>
      </footer>
    </div>
  );
}
