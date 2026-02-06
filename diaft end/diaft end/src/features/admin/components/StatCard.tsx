
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change?: number;
    icon: React.ReactNode;
    color: string;
    gradient: string;
    featured?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon, color, gradient, featured }) => {
    const isPositive = (change || 0) > 0;

    return (
        <div className={`
            relative overflow-hidden transition-all duration-700 group cursor-default
            ${featured
                ? 'bg-white/40 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-white/60 shadow-[0_30px_60px_-15px_rgba(12,166,120,0.15)] col-span-1 md:col-span-2'
                : 'bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/40 shadow-xl shadow-slate-200/40 hover:shadow-emerald-500/10'
            }
        `}>
            {/* Ambient Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20 transition-all duration-700 group-hover:opacity-30 ${gradient}`}></div>

            <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                <div className={`
                    rounded-[1.5rem] md:rounded-[2rem] ${gradient} text-white shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6
                    ${featured ? 'p-5 md:p-7 shadow-emerald-200' : 'p-4 md:p-5 shadow-slate-200'}
                `}>
                    {React.cloneElement(icon as React.ReactElement, { size: featured ? 28 : 20, strokeWidth: 2.5 })}
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl text-[9px] md:text-[10px] font-black backdrop-blur-md border ${isPositive ? 'bg-emerald-500/10 text-[#0ca678] border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                        <span className="tracking-widest">{Math.abs(change)}%</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 ml-1">{label}</p>
                <div className="flex items-end gap-2 md:gap-3">
                    <h3 className={`font-black text-slate-800 tracking-tighter ${featured ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                        {value}
                    </h3>
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#0ca678] mb-2 md:mb-3 animate-pulse shadow-[0_0_15px_rgba(12,166,120,0.5)]"></div>
                </div>
            </div>

            {/* Glass decoration for featured card */}
            {featured && (
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl border border-white/20"></div>
            )}
        </div>
    );
};

export default StatCard;
