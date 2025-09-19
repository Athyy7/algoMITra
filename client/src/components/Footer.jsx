import React from "react";
import {
    Heart, Mail, Twitter, Github, CheckCircle, Coffee, Bot, MapPin, MessageCircle
} from 'lucide-react';

export default function Footer() {
    return (
        // FIX: Switched to a modern dark gray theme
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto pt-16 pb-12 px-6 sm:px-8">
                {/* Main footer content grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    
                    {/* Column 1: Logo and description */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-semibold text-white">&lt;/&gt;</span>
                            <div>
                                <span className="text-xl font-bold text-white tracking-tight">algoMITra</span>
                                <p className="text-[10px] text-slate-400 -mt-1">your coding मित्र (friend)</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
                            MIT World Peace University's intelligent coding platform where MITra AI helps you transform bugs into features and dreams into deployments.
                        </p>
                        <div className="mt-6 flex items-center space-x-4">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Mail size={18} /></a>
                        </div>
                    </div>

                    {/* Links Columns Wrapper */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li><a href="#" className="text-slate-400 hover:text-white">Problem Archive</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">Live Contests</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">Hall of Fame</a></li>
                                <li><a href="#" className="flex items-center gap-1.5 text-slate-400 hover:text-white"><Bot size={14} />Chat with MITra</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">Learning Paths</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Resources</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li><a href="#" className="text-slate-400 hover:text-white">Documentation</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">API Reference</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">Teacher Portal</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white">What's New</a></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                             <div>
                                <h3 className="text-sm font-semibold text-white">Get in Touch</h3>
                                <ul className="mt-4 space-y-3 text-sm">
                                    <li className="flex items-start gap-2 text-slate-400"><MapPin size={14} className="flex-shrink-0 mt-0.5" />MIT WPU, Pune</li>
                                    <li className="flex items-start gap-2 text-slate-400"><Mail size={14} className="flex-shrink-0 mt-0.5" />support@algomitra.edu</li>
                                    <li className="flex items-start gap-2 text-slate-400"><MessageCircle size={14} className="flex-shrink-0 mt-0.5" />MITra AI: Always Online</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Found a bug?</h3>
                                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                                    It's not a bug, it's a feature! But seriously, MITra can help debug it. Or you can report it to us - we'll fix it faster than you can say "NullPointerException".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section with copyright and legal links */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs">
                    <p className="text-slate-500 order-2 sm:order-1 mt-4 sm:mt-0">
                        © {new Date().getFullYear()} algoMITra • Made with <Heart size={12} className="inline-block text-red-500 mx-0.5" /> and lots of <Coffee size={12} className="inline-block text-amber-500 mx-0.5" /> by MIT WPU students
                    </p>
                    <div className="flex space-x-6 order-1 sm:order-2 text-slate-500">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-white">Cookie Policy</a>
                    </div>
                </div>
            </div>

            {/* Final fun fact line */}
            <div className="bg-black/50 border-t border-slate-800">
                <div className="max-w-7xl mx-auto py-3 px-6 sm:px-8 text-center">
                    <p className="text-xs text-slate-500">
                        <CheckCircle size={12} className="inline-block mr-1.5 text-emerald-500" />
                        Fun fact: MITra has helped debug over 50,000 coding problems and only judged your variable names twice!
                    </p>
                </div>
            </div>
        </footer>
    );
}