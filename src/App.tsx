import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Student } from "./types";
import { Loader2 } from "lucide-react";

export default function App() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have an active session in localStorage to keep user logged in on refresh
    const savedStudentId = localStorage.getItem("placement_student_id");
    if (savedStudentId) {
      fetch(`/api/student/${savedStudentId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Session expired");
          }
          return res.json();
        })
        .then((data) => {
          setStudent(data.user);
        })
        .catch((err) => {
          console.warn("Active session restore failed:", err);
          localStorage.removeItem("placement_student_id");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (authenticatedStudent: Student) => {
    setStudent(authenticatedStudent);
    localStorage.setItem("placement_student_id", authenticatedStudent.id);
  };

  const handleLogout = () => {
    setStudent(null);
    localStorage.removeItem("placement_student_id");
  };

  const handleProfileUpdate = (updatedStudent: Student) => {
    setStudent(updatedStudent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-blue-800 animate-spin" />
        <p className="text-sm text-slate-600 mt-4 font-mono uppercase tracking-wider">
          Initializing Student Placement Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {student ? (
        <Dashboard 
          student={student} 
          onLogout={handleLogout} 
          onProfileUpdate={handleProfileUpdate} 
        />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
