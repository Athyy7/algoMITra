import React from "react";
import {
    Code, CheckCircle, Trophy, BookOpen, BrainCircuit, Zap, Coffee, Heart,
    Users, Gauge, Lightbulb
} from 'lucide-react';

// --- Code Ember Particle System ---
const CodeEmberSystem = ({ count = 100 }) => { // Increased count for more visibility
    const symbols = ['</>', '{}', '()', '=>', '&&', '||', 'px'];
    const embers = [];
    for (let i = 0; i < count; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const fontSize = Math.random() * 12 + 10;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;

        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 150;
        
        // FIX: This now allows particles to drift both up and down
        const endY = startY + (Math.random() - 0.5) * 500; // Increased vertical range

        embers.push(
            <div
                key={i}
                className="code-ember"
                style={{
                    fontSize: `${fontSize}px`,
                    top: 0,
                    left: 0,
                    textShadow: `0 0 8px #fed7aa, 0 0 16px #fb923c`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    '--start-x': `${startX}vw`,
                    '--start-y': `${startY}vh`,
                    '--end-x': `${endX}vw`,
                    '--end-y': `${endY}vh`,
                }}
            >
                {symbol}
            </div>
        );
    }
    return <div className="absolute inset-0 z-0 pointer-events-none">{embers}</div>;
};


// --- Feature Card Component ---
const FeatureCard = ({ feature }) => {
    return (
        <div className="group relative p-5 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-slate-300/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-400/20">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg">
                        {feature.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${feature.badgeColor} ${feature.badgeBg}`}>
                        {feature.badge}
                    </span>
                </div>
                <div className="mt-3 flex-grow">
                    <h3 className="text-sm font-bold text-slate-800">{feature.title}</h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 flex-shrink-0 pt-3 border-t border-slate-100">
                    {feature.points.map(point => (
                        <li key={point} className="flex items-center gap-2">
                            <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// --- Main Features Section Component ---
export default function Features() {
    const features = [
        { icon: <Code size={18} className="text-sky-500" />, title: "Multi-Language Support", badge: "Variety", badgeColor: "border-sky-200 text-sky-700", badgeBg: "bg-sky-100", description: "Code in Python, Java, C++, or JavaScript. Even supports your questionable coding style choices.", points: ["Syntax highlighting", "Auto-completion", "Real-time error detection"] },
        { icon: <Gauge size={18} className="text-emerald-500" />, title: "Real-Time Testing", badge: "Fast AF", badgeColor: "border-emerald-200 text-emerald-700", badgeBg: "bg-emerald-100", description: "Instant feedback faster than your professor's disappointment when you submit at 11:59 PM.", points: ["Custom test cases", "Performance metrics", "Memory usage tracking"] },
        { icon: <Users size={18} className="text-purple-500" />, title: "Collaborative Learning", badge: "Squad Up", badgeColor: "border-purple-200 text-purple-700", badgeBg: "bg-purple-100", description: "Study groups that actually study (revolutionary concept, we know).", points: ["Team contests", "Code reviews", "Discussion forums"] },
        { icon: <Trophy size={18} className="text-yellow-500" />, title: "Contests & Tournaments", badge: "Epic", badgeColor: "border-yellow-200 text-yellow-700", badgeBg: "bg-yellow-100", description: "Compete with your peers in epic coding battles. May the best algorithm win!", points: ["Weekly contests", "Semester championships", "Prize rewards"] },
        { icon: <BookOpen size={18} className="text-blue-500" />, title: "Learning Paths", badge: "Guided", badgeColor: "border-blue-200 text-blue-700", badgeBg: "bg-blue-100", description: "Structured curriculum from 'What is a variable?' to 'How do I optimize this mess?'", points: ["Progressive difficulty", "Topic mastery", "Personalized recommendations"] },
        { icon: <BrainCircuit size={18} className="text-rose-500" />, title: "AI-Powered Hints", badge: "Smart", badgeColor: "border-rose-200 text-rose-700", badgeBg: "bg-rose-100", description: "Stuck? Our AI tutor provides hints without giving away the solution (unlike your friend).", points: ["Contextual hints", "Solution approaches", "Common mistake warnings"] },
        { icon: <Zap size={18} className="text-orange-500" />, title: "Performance Analytics", badge: "Data", badgeColor: "border-orange-200 text-orange-700", badgeBg: "bg-orange-100", description: "Track your progress with beautiful charts that make you feel productive.", points: ["Skill progression", "Time complexity analysis", "Improvement suggestions"] },
        { icon: <Coffee size={18} className="text-amber-700" />, title: "24/7 Platform", badge: "Always On", badgeColor: "border-amber-200 text-amber-700", badgeBg: "bg-amber-100", description: "Code at 3 AM? We got you. Our servers run on caffeine and determination.", points: ["99.9% uptime", "Global accessibility", "Mobile responsive"] },
        { icon: <Heart size={18} className="text-pink-500" />, title: "Mental Health Friendly", badge: "Wholesome", badgeColor: "border-pink-200 text-pink-700", badgeBg: "bg-pink-100", description: "Built with student stress levels in mind. No toxic competitiveness, just growth.", points: ["Positive feedback", "Stress-free environment", "Supportive community"] },
    ];

    return (
        <section className="particle-background py-20 px-4 sm:px-6 lg:px-8">
            <CodeEmberSystem />
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-block mb-3 px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        Features That Actually Matter
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Why algoMITra Hits Different
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-base text-slate-600">
                        We built this platform because existing ones were either too boring or too intimidating. Here, you learn, grow, and conquer.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} feature={feature} />
                    ))}
                </div>
                
                {/* Pro Tip Callout */}
                <div className="mt-16 max-w-xl mx-auto text-center p-5 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 shadow-sm">
                    <h3 className="font-semibold text-slate-800">Pro Tip</h3>
                    <p className="mt-1 text-sm text-slate-600">
                        <Lightbulb size={14} className="inline-block mr-1.5 text-yellow-500" />
                        This platform was built by students, for students. We know the struggle is real. 👍
                    </p>
                </div>
            </div>
        </section>
    );
}