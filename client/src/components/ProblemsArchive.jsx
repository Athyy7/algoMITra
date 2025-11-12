import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, CheckCircle2, Circle, Bot, FileText, Building, Filter } from "lucide-react";

// --- Mock Data (Replace with your database connection later) ---
const allProblems = [
    { id: 1, title: "Two Sum Classic", tags: ["Array", "Hash Table"], lastSubmitted: "Last submitted: 2 days ago", company: "Google", difficulty: "Easy", acceptance: "89.2%", category: "Array", solved: true },
    { id: 2, title: "Reverse Linked List", tags: ["Linked List", "Recursion"], lastSubmitted: "", company: "Microsoft", difficulty: "Medium", acceptance: "67.8%", category: "Linked List", solved: false },
    { id: 3, title: "Maximum Subarray", tags: ["Array", "DP"], lastSubmitted: "Last submitted: 1 week ago", company: "Amazon", difficulty: "Medium", acceptance: "54.3%", category: "Dynamic Programming", solved: true },
    { id: 4, title: "Valid Parentheses", tags: ["Stack", "String"], lastSubmitted: "", company: "Facebook", difficulty: "Easy", acceptance: "76.4%", category: "Stack", solved: false },
    { id: 5, title: "Binary Tree Inorder", tags: ["Tree", "DFS"], lastSubmitted: "Last submitted: 3 days ago", company: "Apple", difficulty: "Medium", acceptance: "62.1%", category: "Tree", solved: true },
    { id: 6, title: "Longest Palindrome", tags: ["String", "DP"], lastSubmitted: "", company: "Netflix", difficulty: "Hard", acceptance: "23.1%", category: "String", solved: false },
];

// --- Reusable, Modern Dropdown Component ---
const FilterDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
                <span className={value ? "text-slate-800" : "text-slate-500"}>{value || placeholder}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
                    <button onClick={() => handleSelect(null)} className="w-full text-left px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">All</button>
                    {options.map(option => (
                        <button key={option} onClick={() => handleSelect(option)} className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Helper Components from your design ---
const DifficultyBadge = ({ level }) => {
    const colors = {
        Easy: "bg-emerald-100 text-emerald-700 border-emerald-200/80",
        Medium: "bg-yellow-100 text-yellow-700 border-yellow-200/80",
        Hard: "bg-rose-100 text-rose-700 border-rose-200/80",
    };
    // REFINED: Slightly smaller badge
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors[level]}`}>{level}</span>;
};

const ProblemRow = ({ problem }) => (
    // REFINED: Reduced vertical padding from py-4 to py-3
    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-slate-100/50 transition-colors">
        <div className="col-span-1 flex justify-start">{problem.solved ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Circle className="text-slate-300" size={18} />}</div>
        <div className="col-span-3">
            {/* REFINED: Smaller title font */}
            <p className="font-medium text-sm text-slate-800">{problem.title}</p>
            <div className="flex items-center gap-2 mt-1.5">{problem.tags.map(tag => (<span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">{tag}</span>))}</div>
            {/* REFINED: Smaller subtext font */}
            {problem.lastSubmitted && <p className="text-[11px] text-slate-400 mt-1.5">{problem.lastSubmitted}</p>}
        </div>
        <div className="col-span-2 flex items-center gap-2 text-sm text-slate-500"><Building size={14} className="text-slate-400" />{problem.company}</div>
        <div className="col-span-2"><DifficultyBadge level={problem.difficulty} /></div>
        <div className="col-span-1 text-sm text-slate-500">{problem.acceptance}</div>
        <div className="col-span-2 text-sm text-slate-500">{problem.category}</div>
        {/* REFINED: Smaller solve button */}
        <div className="col-span-1 flex justify-end"><button className="px-3 py-1 flex items-center gap-1.5 rounded-md bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"><FileText size={12} />Solve</button></div>
    </div>
);


// --- Main ProblemArchive Component ---
export default function ProblemArchive() {
    // State for filters and problem list
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [filteredProblems, setFilteredProblems] = useState(allProblems);

    // Generate unique companies for the dropdown
    const companies = [...new Set(allProblems.map(p => p.company))];

    // Effect to apply filters whenever they change
    useEffect(() => {
        let problems = allProblems;

        if (searchTerm) {
            problems = problems.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (selectedDifficulty) {
            problems = problems.filter(p => p.difficulty === selectedDifficulty);
        }
        if (selectedStatus) {
            const isSolved = selectedStatus === "Solved";
            problems = problems.filter(p => p.solved === isSolved);
        }
        if (selectedCompany) {
            problems = problems.filter(p => p.company === selectedCompany);
        }
        setFilteredProblems(problems);
    }, [searchTerm, selectedDifficulty, selectedStatus, selectedCompany]);

    return (
        <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* REFINED: Smaller Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Problem Archive
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-base text-slate-600">
                        500+ curated problems from top companies. MITra is standing by to help.
                    </p>
                    <Bot size={28} className="mx-auto mt-3 text-purple-600" />
                </div>

                {/* REFINED: Smaller Filter Bar */}
                <div className="mt-10 mb-6 p-3 bg-white/70 backdrop-blur-lg border border-slate-200/80 rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search problems, tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-700 outline-none transition-shadow"
                            />
                        </div>
                        <FilterDropdown options={["Easy", "Medium", "Hard"]} value={selectedDifficulty} onChange={setSelectedDifficulty} placeholder="Level" />
                        <FilterDropdown options={["Solved", "Unsolved"]} value={selectedStatus} onChange={setSelectedStatus} placeholder="Status" />
                        <FilterDropdown options={companies} value={selectedCompany} onChange={setSelectedCompany} placeholder="Company" />
                        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                           <Bot size={16} /> Ask MITra
                        </button>
                    </div>
                </div>

                {/* Problems Table */}
                <div className="border border-slate-200/80 rounded-xl shadow-sm overflow-hidden bg-white">
                    <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <div className="col-span-1">Status</div>
                        <div className="col-span-3">Problem</div>
                        <div className="col-span-2">Company</div>
                        <div className="col-span-2">Difficulty</div>
                        <div className="col-span-1">Acceptance</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {filteredProblems.length > 0 ? (
                            filteredProblems.map(problem => <ProblemRow key={problem.id} problem={problem} />)
                        ) : (
                            <div className="text-center py-16 text-slate-500">
                                <p className="font-semibold">No problems found</p>
                                <p className="mt-2 text-sm">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer Callout */}
                <div className="mt-10 text-center p-5 bg-slate-100 border border-slate-200 rounded-xl">
                    <div className="flex justify-center items-center gap-3">
                      <Bot size={18} className="text-purple-600 flex-shrink-0" />
                      <p className="text-sm text-slate-600 font-medium">
                          Stuck on a problem? Our AI assistant, MITra, can provide hints and explanations!
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-1.5 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm mt-3">
                        <Filter size={14} />
                        Solve more problems.
                    </button>
                </div>
            </div>
        </section>
    );
}