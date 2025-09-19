import React from "react";
import { Bot, Coffee, Zap, ArrowRight } from "lucide-react";

export default function Hero() {
  const features = [
    { icon: <Zap size={28} className="text-yellow-500" />, title: "500+ Problems", desc: "From company interviews to mind-bending puzzles" },
    { icon: <Bot size={28} className="text-slate-800" />, title: "MITra AI Assistant", desc: "Your personal coding मित्र that never sleeps" },
    { icon: <Coffee size={28} className="text-amber-700" />, title: "24/7 Learning", desc: "Because inspiration strikes at 3 AM" },
  ];

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-start text-center px-6 sm:px-12 pt-32 pb-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* ... blobs ... */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-60 right-16 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full max-w-5xl">
        {/* FIX: Added animation class here */}
        <div className="inline-block mb-6 px-4 py-1 text-xs sm:text-sm font-medium rounded-full bg-gray-100/80 backdrop-blur-sm text-gray-700 border border-white/50 shadow-sm animate-[pulse-subtle_3s_ease-in-out_infinite]">
          ✨ Meet MITra, your AI coding companion ✨
        </div>

        {/* ... rest of the component is unchanged ... */}
        <h1 className="mt-2 font-extrabold leading-tight max-w-4xl mx-auto">
          <span className="gradient-text typing block text-[48px] sm:text-[76px] tracking-tight" style={{ animationDelay: "0s" }}>
            Code Like You're
          </span>
          <span className="gradient-text typing block text-[44px] sm:text-[72px] tracking-tight" style={{ animationDelay: "2.5s" }}>
            Actually Good At It
          </span>
        </h1>
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-500 mt-6 leading-relaxed">
          MIT WPU's intelligent coding platform where problems become possibilities
          <br />
          and MITra AI helps you debug life (and code).
          <span className="block mt-2 text-xs text-slate-400">
            *MITra doesn't judge your variable names... much 😅*
          </span>
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="px-8 py-3 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 text-white text-sm sm:text-base font-bold flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Start Grinding <ArrowRight size={16} />
          </button>
          <button className="px-6 py-3 rounded-lg border border-gray-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base font-bold text-gray-700 flex items-center gap-3 hover:border-slate-400 transition">
            <Bot size={16} /> Meet MITra AI
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mt-14 mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="interactive-card p-6 rounded-2xl h-56 w-full flex flex-col items-center justify-center text-center">
              <div className="card-content flex flex-col items-center">
                {feature.icon}
                <h3 className="font-semibold text-lg my-3 text-slate-800">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-snug">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-slate-400 italic">
          💡 MITra's wisdom: "The best code is written when you understand the problem, not just Google it"
        </p>
      </div>
    </section>
  );
}