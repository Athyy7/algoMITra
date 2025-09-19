import React from 'react';
import { Trophy, ShieldCheck, Gem, BarChart2, Coffee } from 'lucide-react';

// --- Hall of Fame Card Component ---
const HallOfFameCard = ({ rank, user, points, solved, streak }) => {
    let rankIcon, rankColor, shadowColor, rankHeight, pattern;

    if (rank === 1) {
        rankIcon = <Trophy size={20} />;
        rankColor = 'text-yellow-500';
        shadowColor = 'rgba(234, 179, 8, 0.25)'; // Gold glow
        rankHeight = 'md:mt-0';
        pattern = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="100%" height="100%"><rect width="80" height="80" fill="%23fffbeb"></rect><path fill="%23fde68a" d="M0 0h80L40 40z"></path></svg>')`;
    } else if (rank === 2) {
        rankIcon = <ShieldCheck size={20} />;
        rankColor = 'text-slate-500';
        shadowColor = 'rgba(100, 115, 135, 0.25)'; // Silver glow
        rankHeight = 'md:mt-8';
        pattern = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="%23f8fafc"></rect><path fill="%23e2e8f0" d="M0 50 L50 0 L100 50 L50 100 z"></path></svg>')`;
    } else {
        rankIcon = <Gem size={20} />;
        rankColor = 'text-orange-500';
        shadowColor = 'rgba(249, 115, 22, 0.25)'; // Bronze glow
        rankHeight = 'md:mt-8';
        pattern = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><rect width="32" height="32" fill="%23fff7ed"></rect><path fill="%23fed7aa" d="M0 16 L16 0 L32 16 L16 32z"></path></svg>')`;
    }

    return (
        <div 
            className={`hof-card relative p-6 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-300/20 overflow-hidden ${rankHeight}`}
            style={{ '--glow-color': shadowColor, '--pattern': pattern }}
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-slate-100 ${rankColor}`}>
                            {user.initials}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{user.name}</h3>
                            <p className={`text-sm font-medium ${rankColor}`}>{user.title}</p>
                        </div>
                    </div>
                    <div className={`p-2 rounded-full bg-slate-100 ${rankColor}`}>
                        {rankIcon}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 text-center divide-x divide-slate-100">
                    <div><p className="text-xs text-slate-500">Points</p><p className="text-xl font-bold text-slate-900">{points.toLocaleString()}</p></div>
                    <div><p className="text-xs text-slate-500">Solved</p><p className="text-xl font-bold text-slate-900">{solved}</p></div>
                    <div><p className="text-xs text-slate-500">Streak</p><p className="text-xl font-bold text-slate-900">{streak}</p></div>
                </div>
            </div>
        </div>
    );
};

// --- Ranking Row Component ---
const RankingRow = ({ rank, user, points, solved }) => (
    <div className="grid grid-cols-12 items-center px-4 py-3 rounded-lg transition-colors hover:bg-slate-100">
        <span className="col-span-1 font-mono text-sm text-slate-500">#{rank}</span>
        <div className="col-span-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">{user.initials}</div>
            <div>
                <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.title}</p>
            </div>
        </div>
        <div className="col-span-3 text-sm font-medium text-slate-700">{points.toLocaleString()} pts</div>
        <div className="col-span-3 text-sm font-medium text-slate-700 text-right">{solved} solved</div>
    </div>
);


// --- Main Leaderboard Component ---
export default function Leaderboard() {
    // FIX: Corrected ranking order
    const hallOfFame = [
        { rank: 1, user: { initials: "SS", name: "SegFaultSamurai", title: "Code Ninja" }, points: 2847, solved: 347, streak: 47 },
        { rank: 2, user: { initials: "NN", name: "NullPointerNinja", title: "Debug Master" }, points: 2654, solved: 298, streak: 23 },
        { rank: 3, user: { initials: "RR", name: "RecursiveRebel", title: "Algorithm Ace" }, points: 2489, solved: 276, streak: 34 },
    ];

    const currentRankings = [
        { rank: 4, user: { initials: "AA", name: "ArrayAvenger", title: "Data Wizard" }, points: 2234, solved: 245 },
        { rank: 5, user: { initials: "LL", name: "LoopLegend", title: "Iteration God" }, points: 2156, solved: 234 },
        { rank: 6, user: { initials: "BB", name: "BinaryBeast", title: "Bit Bender" }, points: 1987, solved: 198 },
        { rank: 7, user: { initials: "CC", name: "CacheCollider", title: "Speed Demon" }, points: 1895, solved: 182 },
    ];

    return (
        <section className="bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Hall of Fame</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">These legends have transcended beyond mere mortals. They debug in their sleep.</p>
                </div>

                {/* Hall of Fame Cards in Podium Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:items-start">
                    <div className="md:order-2"><HallOfFameCard {...hallOfFame[0]} /></div>
                    <div className="md:order-1"><HallOfFameCard {...hallOfFame[1]} /></div>
                    <div className="md:order-3"><HallOfFameCard {...hallOfFame[2]} /></div>
                </div>

                {/* Current Rankings */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4 px-4">
                        <BarChart2 size={20} className="text-slate-500" />
                        <h3 className="text-xl font-bold text-slate-800">Current Rankings</h3>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                        {currentRankings.map((data) => (
                            <RankingRow key={data.rank} {...data} />
                        ))}
                    </div>
                </div>

                {/* Fun Fact */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-500 italic">
                        <Coffee size={12} className="inline-block mr-1.5 text-amber-700" />
                        Fun fact: The top 3 users have collectively consumed enough coffee to power a small village.
                    </p>
                </div>
            </div>
        </section>
    );
}