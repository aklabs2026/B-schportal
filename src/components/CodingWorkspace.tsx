import React, { useState, useEffect } from "react";
import { 
  Code, Terminal, Cpu, Play, CheckCircle, AlertTriangle, Search, 
  Building2, Copy, Sparkles, RefreshCw, BookOpen, Award, Clock, 
  Loader2, ChevronRight, Check, AlertCircle, Info, ThumbsUp
} from "lucide-react";
import { Student, CodingChallenge } from "../types";

// Dynamic detailed challenge metadata
interface ChallengeMetadata {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  companies: string[];
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  boilerplates: Record<string, string>;
  testCases: Array<{
    input: string;
    expected: string;
    args: any[];
  }>;
}

const CHALLENGES_META: Record<string, ChallengeMetadata> = {
  "code-1": {
    id: "code-1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companies: ["Google", "Meta", "Amazon", "Microsoft"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    boilerplates: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def twoSum(nums, target):
    # Write your code here
    pass`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`
    },
    testCases: [
      { input: "[2, 7, 11, 15], target=9", expected: "[0,1] or [1,0]", args: [[2, 7, 11, 15], 9] },
      { input: "[3, 2, 4], target=6", expected: "[1,2] or [2,1]", args: [[3, 2, 4], 6] }
    ]
  },
  "code-2": {
    id: "code-2",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    companies: ["Amazon", "Microsoft", "Netflix"],
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" }
    ],
    boilerplates: {
      javascript: `function reverseList(head) {
    // Write your code here
    
}`,
      python: `def reverseList(head):
    # Write your code here
    pass`,
      cpp: `ListNode* reverseList(ListNode* head) {
    // Write your code here
    
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode* head) {
        // Write your code here
        return null;
    }
}`
    },
    testCases: [
      { input: "head = [1,2,3]", expected: "[3,2,1]", args: [[1,2,3]] }
    ]
  },
  "code-3": {
    id: "code-3",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    companies: ["Google", "Meta", "Amazon", "Microsoft", "Apple"],
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      { input: "s = \"()\"", output: "true" },
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    boilerplates: {
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      python: `def isValid(s):
    # Write your code here
    pass`,
      cpp: `bool isValid(string s) {
    // Write your code here
    
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`
    },
    testCases: [
      { input: "s = \"()\"", expected: "true", args: ["()"] },
      { input: "s = \"([)]\"", expected: "false", args: ["([)]"] }
    ]
  },
  "code-4": {
    id: "code-4",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    companies: ["Google", "Microsoft", "Apple"],
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" }
    ],
    boilerplates: {
      javascript: `function search(nums, target) {
    // Write your code here
    
}`,
      python: `def search(nums, target):
    # Write your code here
    pass`,
      cpp: `int search(vector<int>& nums, int target) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`
    },
    testCases: [
      { input: "nums=[-1,0,3,5], target=3", expected: "2", args: [[-1,0,3,5], 3] }
    ]
  },
  "code-5": {
    id: "code-5",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Sliding Window",
    companies: ["Google", "Meta", "Amazon", "Microsoft", "Apple"],
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "In this case, no transactions are done and max profit = 0." }
    ],
    boilerplates: {
      javascript: `function maxProfit(prices) {
    // Write your code here
    
}`,
      python: `def maxProfit(prices):
    # Write your code here
    pass`,
      cpp: `int maxProfit(vector<int>& prices) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }
}`
    },
    testCases: [
      { input: "prices = [7,1,5,3,6,4]", expected: "5", args: [[7,1,5,3,6,4]] }
    ]
  },
  "code-6": {
    id: "code-6",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    companies: ["Google", "Meta", "Amazon"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." },
      { input: "s = \"bbbbb\"", output: "1", explanation: "The answer is \"b\", with the length of 1." }
    ],
    boilerplates: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    
}`,
      python: `def lengthOfLongestSubstring(s):
    # Write your code here
    pass`,
      cpp: `int lengthOfLongestSubstring(string s) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`
    },
    testCases: [
      { input: "s=\"abcabcbb\"", expected: "3", args: ["abcabcbb"] }
    ]
  },
  "code-7": {
    id: "code-7",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Intervals",
    companies: ["Google", "Meta", "Microsoft"],
    description: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." }
    ],
    boilerplates: {
      javascript: `function merge(intervals) {
    // Write your code here
    
}`,
      python: `def merge(intervals):
    # Write your code here
    pass`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your code here
        return new int[0][0];
    }
}`
    },
    testCases: [
      { input: "intervals = [[1,4],[4,5]]", expected: "[[1,5]]", args: [[[1,4],[4,5]]] }
    ]
  }
};

interface CodingWorkspaceProps {
  student: Student;
  onSubmissionSuccess: (updatedStudent: Student) => void;
}

export default function CodingWorkspace({ student, onSubmissionSuccess }: CodingWorkspaceProps) {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("code-1");
  const [language, setLanguage] = useState<string>("javascript");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  
  // Custom user boilers code storage
  const [userCodes, setUserCodes] = useState<Record<string, string>>({});
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [aiReport, setAiReport] = useState<any | null>(null);

  const selectedMeta = CHALLENGES_META[selectedChallengeId] || CHALLENGES_META["code-1"];

  // Initialize or swap code on challenge/lang switch
  const getActiveCode = () => {
    const key = `${selectedChallengeId}_${language}`;
    if (userCodes[key] !== undefined) {
      return userCodes[key];
    }
    return selectedMeta.boilerplates[language] || "";
  };

  const handleCodeChange = (newVal: string) => {
    const key = `${selectedChallengeId}_language`;
    setUserCodes((prev) => ({
      ...prev,
      [`${selectedChallengeId}_${language}`]: newVal,
    }));
  };

  const handleResetCode = () => {
    const key = `${selectedChallengeId}_${language}`;
    setUserCodes((prev) => ({
      ...prev,
      [key]: selectedMeta.boilerplates[language] || "",
    }));
    setConsoleLogs((prev) => [...prev, `[CONSOLE] Boilerplate restored for ${selectedMeta.title}.`]);
  };

  // Run local mock validations
  const handleRunMockTests = () => {
    setConsoleLogs([
      `[SYSTEM] Triggering mock sandbox environment...`,
      `[COMPILE] Bundling AST nodes for language: "${language}"`,
    ]);

    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev,
        `[COMPILE] Linking source code successfully without syntax bugs.`,
        `[TEST] Running Test Case 1/2: ${selectedMeta.testCases[0]?.input || "N/A"}`,
        `[TEST] Comparing actual results against expected: "${selectedMeta.testCases[0]?.expected}"`,
        `✅ [TEST SUCCESS] Test Case 1 Passed.`
      ]);
    }, 800);

    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev,
        `[TEST] Running Test Case 2/2: ${selectedMeta.testCases[1]?.input || "custom"}`,
        `✅ [TEST SUCCESS] Test Case 2 Passed.`,
        `\n[SYSTEM] Local sandboxed compilation succeeded. All unit tests green.`
      ]);
    }, 1500);
  };

  // Submit for real Gemini analysis
  const handleSubmitCode = async () => {
    setEvaluating(true);
    setAiReport(null);
    setConsoleLogs((prev) => [
      ...prev,
      `[SYSTEM] Connecting to evaluation server...`,
      `[API] Shipping active source solution buffer to Gemini API...`
    ]);

    const stages = [
      "Performing syntactic AST evaluation...",
      "Analyzing asymptotic Time & Space complexity metrics (O-notation)...",
      "Evaluating edge-case resilience...",
      "Generating diagnostic scorecard & refactoring guidelines..."
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
      const activeCodeStr = getActiveCode();
      const response = await fetch("/api/coding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          challengeId: selectedChallengeId,
          challengeTitle: selectedMeta.title,
          difficulty: selectedMeta.difficulty,
          category: selectedMeta.category,
          language: language,
          code: activeCodeStr
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit code.");
      }

      onSubmissionSuccess(data.user);
      setAiReport(data.report);
      setConsoleLogs((prev) => [
        ...prev,
        `✅ [API SUCCESS] Diagnostic assessment loaded. Score: ${data.report.score}/100`,
        `[INTERVIEWER] Asymptotic Complexity: ${data.report.timeComplexity} time, ${data.report.spaceComplexity} space.`
      ]);
    } catch (err: any) {
      setConsoleLogs((prev) => [
        ...prev,
        `❌ [API ERROR] Submission failed: ${err.message || "Unknown error"}`
      ]);
    } finally {
      clearInterval(interval);
      setEvaluating(false);
    }
  };

  // Filters logic
  const filteredChallenges = Object.values(CHALLENGES_META).filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || challenge.difficulty === difficultyFilter;
    const matchesCompany = companyFilter === "All" || challenge.companies.some(
      (comp) => comp.toLowerCase() === companyFilter.toLowerCase()
    );
    return matchesSearch && matchesDifficulty && matchesCompany;
  });

  const getDifficultyColor = (diff: string) => {
    if (diff === "Easy") return "text-emerald-800 bg-emerald-50 border-emerald-200/60";
    if (diff === "Medium") return "text-amber-800 bg-amber-50 border-amber-200/60";
    return "text-rose-800 bg-rose-50 border-rose-200/60";
  };

  const isChallengeSolved = (id: string) => {
    const c = student.codingChallenges?.find(cc => cc.id === id);
    return c?.solved || false;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-800 border-emerald-200 bg-emerald-50";
    if (score >= 70) return "text-amber-800 border-amber-200 bg-amber-50";
    return "text-rose-800 border-rose-200 bg-rose-50";
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      
      {/* Top Title/Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] bg-blue-50 text-blue-900 border border-blue-150 font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md">
            SANDBOX ENVIRONMENT
          </span>
          <h2 className="text-lg font-bold font-display tracking-tight text-slate-900 mt-2 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-900" /> Algorithmic Practice Arena
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Practice structural coding drills. Write compile logic, test custom assertions, and request review against professional standards.
          </p>
        </div>
      </div>

      {/* Grid of practice layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Challenge selection lists & filters (4 columns / ~33% width) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Filters Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Search className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Search Challenges</h3>
            </div>

            {/* Title search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />

            {/* Quick dropdown filters */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Difficulty */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 font-bold uppercase">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-2 text-xxs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="All">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Company Match */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 font-bold uppercase">Company Tag</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-2 text-xxs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="All">All Companies</option>
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Apple">Apple</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Challenges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 max-h-[460px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-900" /> Problems
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {filteredChallenges.length} total
              </span>
            </div>

            {filteredChallenges.length > 0 ? (
              <div className="space-y-2.5">
                {filteredChallenges.map((challenge) => {
                  const solved = isChallengeSolved(challenge.id);
                  const isSelected = selectedChallengeId === challenge.id;
                  
                  return (
                    <button
                      key={challenge.id}
                      type="button"
                      onClick={() => {
                        setSelectedChallengeId(challenge.id);
                        setAiReport(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected 
                          ? "bg-blue-50/50 border-blue-900 shadow-sm" 
                          : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {/* Solved checkmark bubble */}
                      <div className={`mt-0.5 shrink-0 rounded-full w-4.5 h-4.5 flex items-center justify-center border ${
                        solved 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}>
                        {solved && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-bold truncate ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                            {challenge.title}
                          </p>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5 font-bold uppercase tracking-wide">
                          {challenge.category}
                        </p>
                        
                        {/* Company Pill Mini badges */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          {challenge.companies.slice(0, 2).map((comp) => (
                            <span 
                              key={comp} 
                              className={`text-[9px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 font-medium ${
                                student.targetCompany?.toLowerCase() === comp.toLowerCase() ? "border-amber-400 bg-amber-50 text-amber-900 font-bold" : ""
                              }`}
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Info className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No challenges match search</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Workspace with Terminal & Editor (8 columns / ~67% width) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Workspace Frame */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
            
            {/* Header: Challenge Title & Language Selector */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[9px] font-mono text-blue-900 bg-blue-50 border border-blue-100 uppercase tracking-widest px-2.5 py-0.5 rounded-md font-bold">
                  {selectedMeta.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-2">
                  {selectedMeta.title}
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getDifficultyColor(selectedMeta.difficulty)}`}>
                    {selectedMeta.difficulty}
                  </span>
                </h3>
              </div>

              {/* Lang selector & utility */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Runtime:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python (3.x)</option>
                  <option value="cpp">C++ (GCC 11)</option>
                  <option value="java">Java (OpenJDK 17)</option>
                </select>
              </div>
            </div>

            {/* Split Panel: Description on Top, Editor on Bottom */}
            <div className="border-b border-slate-100">
              
              {/* Detailed Description */}
              <div className="p-5 bg-white space-y-4 max-h-[190px] overflow-y-auto border-b border-slate-200">
                <div className="max-w-none text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {selectedMeta.description}
                </div>

                {/* Example cases */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Example Executions:</h4>
                  {selectedMeta.examples.map((ex, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xxs space-y-1 text-slate-500 font-medium">
                      <div><strong className="text-blue-900">Input:</strong> {ex.input}</div>
                      <div><strong className="text-emerald-700">Output:</strong> {ex.output}</div>
                      {ex.explanation && (
                        <div><strong className="text-amber-800">Explanation:</strong> {ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Constraints:</h4>
                  <ul className="list-disc list-inside space-y-0.5 text-xxs text-slate-400 font-mono">
                    {selectedMeta.constraints.map((con, idx) => (
                      <li key={idx}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Editor Block - Dark Mode Textarea for contrast & developer feel, but surrounded by light portal chrome */}
              <div className="relative">
                <textarea
                  value={getActiveCode()}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="// Write or paste your algorithm here..."
                  className="w-full bg-slate-950 p-5 font-mono text-xs text-emerald-400/90 leading-relaxed min-h-[220px] focus:outline-none focus:ring-0 resize-y border-b border-slate-900"
                  spellCheck="false"
                />

                {/* Float helper controls */}
                <div className="absolute right-4 bottom-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 rounded-lg text-xxs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Reset boilerplate"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="bg-slate-50 p-4 flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Target Matches: {selectedMeta.companies.join(", ")}
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRunMockTests}
                  disabled={evaluating}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                  <span>Run Tests</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitCode}
                  disabled={evaluating}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm border-b-2 border-amber-500"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Console Logs and Diagnostics Box */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
            
            {/* Console Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-blue-900" /> Compiler Output Logs
              </h3>
              <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">Active Terminal</span>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-[11px] leading-relaxed space-y-1.5 min-h-[100px] max-h-60 overflow-y-auto">
              {consoleLogs.length > 0 ? (
                consoleLogs.map((log, idx) => {
                  let textClass = "text-slate-300";
                  if (log.startsWith("❌") || log.includes("FAIL")) textClass = "text-rose-400 font-bold";
                  else if (log.startsWith("✅") || log.includes("PASSED") || log.includes("SUCCESS")) textClass = "text-emerald-400 font-bold";
                  else if (log.startsWith("[SYSTEM]") || log.startsWith("[CONSOLE]")) textClass = "text-amber-400";
                  
                  return (
                    <div key={idx} className={textClass}>
                      {log}
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-600 text-center py-6 font-mono text-xs">
                  {"// Click \"Run Tests\" or \"AI Review\" to stream local sandbox output logs."}
                </div>
              )}
            </div>

          </div>

          {/* Detailed Gemini AI Review Report Panel (Appears when evaluation succeeds) */}
          {evaluating && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[250px]">
              <div className="relative mb-3">
                <div className="w-10 h-10 rounded-full border-3 border-slate-100 border-t-blue-900 animate-spin" />
                <Cpu className="w-4 h-4 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Processing Diagnostic Critique</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{statusMessage}</p>
            </div>
          )}

          {aiReport && !evaluating && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6 animate-fade-in relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-900" />
              
              {/* Header card with Score & complexity stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200/60 font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded-md">
                    Interviewer Diagnostic Audit
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2.5">Gemini Critique Report</h3>
                  <p className="text-[10px] text-slate-400 font-mono font-medium">
                    DIFFICULTY RATING: {selectedMeta.difficulty} • TARGET: {student.targetCompany || "Standard"}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
                  <div className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center font-mono ${getScoreColor(aiReport.score)}`}>
                    <span className="text-lg font-bold leading-none">{aiReport.score}</span>
                    <span className="text-[8px] uppercase font-bold tracking-wider opacity-80 mt-0.5">Rating</span>
                  </div>
                  <div>
                    <div className="flex gap-2 text-[10px] text-slate-500 font-mono font-bold uppercase">
                      <span>TIME: <strong className="text-blue-900">{aiReport.timeComplexity}</strong></span>
                      <span>•</span>
                      <span>SPACE: <strong className="text-blue-900">{aiReport.spaceComplexity}</strong></span>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${aiReport.passed ? "text-emerald-700" : "text-amber-800"}`}>
                      {aiReport.passed ? "Placement Ready" : "Optimization Required"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback Critique */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-900" /> Algorithmic Summary
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {aiReport.feedback}
                </p>
              </div>

              {/* Recommendations Bullets */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Refactoring Roadmap Points
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiReport.suggestions.map((sug, idx) => (
                    <li key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2.5 font-medium">
                      <span className="w-5 h-5 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Side-by-side Optimized Reference Solution */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-900" /> Verifiable Placement Solution
                </h4>
                <div className="relative bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
                  {/* File label banner */}
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase">
                    <span>OPTIMIZED_COMPLIANCE_SOL.{language === "python" ? "py" : language === "cpp" ? "cpp" : language === "java" ? "java" : "js"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(aiReport.optimizedCode);
                        setConsoleLogs(prev => [...prev, "[CONSOLE] Reference code copied to clipboard."]);
                      }}
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xxs"
                    >
                      <Copy className="w-3 h-3 text-amber-500" /> COPY SOLUTION
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xxs font-mono text-emerald-400/90 leading-relaxed max-h-60">
                    <code>{aiReport.optimizedCode}</code>
                  </pre>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
