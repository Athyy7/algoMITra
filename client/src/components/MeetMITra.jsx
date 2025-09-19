import React, { useState, useEffect } from "react";
import { Bot, Zap, Code, BookOpen, MessageSquare, Star, Heart, User } from "lucide-react";

// --- Custom Hook for Typing Animation ---
const useTypewriter = (text, speed = 40, start = false) => {
    const [displayText, setDisplayText] = useState("");
    useEffect(() => {
        if (start) {
            setDisplayText("");
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);
            return () => clearInterval(typingInterval);
        }
    }, [text, speed, start]);
    return displayText;
};

// --- Main MeetMitra Component ---
export default function MeetMitra() {
    // FIX: Restored all original feature content
    const features = [
        { icon: <Zap size={20} />, title: "Smart Hints", desc: "Stuck? MITra provides contextual hints without spoiling the solution.", example: "“Try thinking about this problem as finding patterns in the array...”", iconColor: "text-yellow-400" },
        { icon: <Code size={20} />, title: "Code Review", desc: "Get instant feedback on your code quality and optimization suggestions.", example: "“Your solution works, but consider using a hash map for O(1) lookups!”", iconColor: "text-sky-400" },
        { icon: <BookOpen size={20} />, title: "Concept Explanation", desc: "Don’t understand a topic? MITra breaks it down in simple terms.", example: "“Dynamic Programming is like solving smaller puzzles to build bigger ones...”", iconColor: "text-emerald-400" },
        { icon: <MessageSquare size={20} />, title: "24/7 Chat Support", desc: "Always available to answer your coding questions and doubts.", example: "“Why is my code getting TLE? Let me help you optimize it!”", iconColor: "text-rose-400" },
    ];
    
    const stats = [
        { icon: <Star className="w-5 h-5 mx-auto text-yellow-400" />, value: "95%", label: "Solve Rate" },
        { icon: <MessageSquare className="w-5 h-5 mx-auto text-blue-400" />, value: "10k+", label: "Questions" },
        { icon: <Heart className="w-5 h-5 mx-auto text-pink-400" />, value: "4.9/5", label: "Rating" },
    ];
    
    // --- State for sequential chat animation ---
    const [chatStep, setChatStep] = useState(0);
    const botText1 = "Absolutely! Two Sum is a classic. Instead of checking every pair (O(n²)), try remembering numbers you've seen.";
    const botText2 = "Exactly! For each number, check if (target - current) exists. If yes — found the pair. If not — store and continue.";

    const animatedBotText1 = useTypewriter(botText1, 30, chatStep >= 1);
    const animatedBotText2 = useTypewriter(botText2, 30, chatStep >= 3);

    useEffect(() => {
        const timers = [
            setTimeout(() => setChatStep(1), 500), // Start first bot message
            setTimeout(() => setChatStep(2), 500 + botText1.length * 30 + 500), // User 2 appears
            setTimeout(() => setChatStep(3), 500 + botText1.length * 30 + 1000), // Start second bot message
        ];
        return () => timers.forEach(clearTimeout);
    }, [botText1.length]);

    return (
        <section className="aurora-background relative text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full bg-slate-800/50 text-cyan-300 border border-cyan-500/20">
                        <Bot size={16} /> Powered by AI
                    </div>
                    <h2 className="mt-6 font-extrabold text-slate-100 text-4xl sm:text-5xl tracking-tight">Meet MITra - Your AI मित्र</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">More than just an AI assistant — MITra understands the struggle of coding and is here to guide you.</p>
                </div>
                
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* LEFT: Interactive Terminal */}
                    <div className="p-1 rounded-xl bg-slate-800/30 border border-slate-800 shadow-2xl shadow-black">
                        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <p className="ml-auto text-xs text-slate-500 font-mono">/bin/mitra_chat</p>
                            </div>
                            <div className="p-6 font-mono space-y-6 h-[480px] overflow-y-auto">
                                {/* Chat Messages */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex-shrink-0 flex items-center justify-center">
                                        <User size={16} className="text-indigo-400" />
                                    </div>
                                    <p className="text-sm text-slate-300 rounded-md px-4 py-2 bg-slate-800/50 border border-slate-700">I'm stuck on the Two Sum problem. Can you help?</p>
                                </div>

                                {chatStep >= 1 && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                                            <Bot size={16} className="text-cyan-400" />
                                        </div>
                                        <p className="text-sm text-slate-300 rounded-md py-2 max-w-[85%]">{animatedBotText1}<span className="typing-cursor"></span></p>
                                    </div>
                                )}
                                
                                {chatStep >= 2 && (
                                     <div className="flex items-start gap-3 animate-fade-in">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex-shrink-0 flex items-center justify-center">
                                            <User size={16} className="text-indigo-400" />
                                        </div>
                                        <p className="text-sm text-slate-300 rounded-md px-4 py-2 bg-slate-800/50 border border-slate-700">Oh! So I store the numbers I've seen in a hash map?</p>
                                    </div>
                                )}

                                {chatStep >= 3 && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                                            <Bot size={16} className="text-cyan-400" />
                                        </div>
                                        <div className="text-sm text-slate-300 rounded-md py-2 max-w-[85%]">
                                            <p>{animatedBotText2}<span className="typing-cursor"></span></p>
                                            {animatedBotText2.length === botText2.length &&
                                                <div className="flex gap-2 mt-3 animate-fade-in">
                                                    <button className="text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded hover:bg-slate-700 transition">Show Code Example</button>
                                                    <button className="text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded hover:bg-slate-700 transition">Explain Complexity</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Feature Cards & Stats */}
                    <div className="space-y-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm flex items-start gap-4 transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1">
                                <div className={`p-2 bg-slate-800 border border-slate-700 rounded-lg ${feature.iconColor}`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-100">{feature.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
                                    <p className="text-xs text-cyan-400/70 mt-2 italic border-l-2 border-cyan-500/30 pl-2">{feature.example}</p>
                                </div>
                            </div>
                        ))}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="p-4 text-center rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                    {stat.icon}
                                    <p className="mt-2 text-lg font-bold text-white">{stat.value}</p>
                                    <p className="text-[11px] text-slate-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* "Ready to Meet Mitra" CTA */}
                <div className="mt-20 max-w-4xl mx-auto p-8 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                            <Bot className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Ready to meet your coding मित्र?</h3>
                        <p className="text-base text-slate-400 mb-6 max-w-xl mx-auto">Join thousands of students who've already made MITra their coding companion.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-3 bg-cyan-500 text-slate-900 rounded-lg font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition">Start Chatting →</button>
                            <button className="px-8 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-700/50 transition">See More Examples</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}