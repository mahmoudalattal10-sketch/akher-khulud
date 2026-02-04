import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface CounterProps {
    label: string;
    subLabel?: string;
    value: number;
    setter: (v: number) => void;
    min?: number;
}

const Counter: React.FC<CounterProps> = ({ label, subLabel, value, setter, min = 0 }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-slate-100/50 mb-3 transition-all hover:bg-white hover:border-gold/30">
        <div className="flex items-center gap-4">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter(value + 1); }}
                className="w-10 h-10 rounded-full bg-gold shadow-lg flex items-center justify-center text-white hover:bg-gold-dark active:scale-90 transition-all"
            >
                <Plus size={18} />
            </button>
            <span className="font-black text-secondary text-xl w-6 text-center">{value}</span>
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter(Math.max(min, value - 1)); }}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-gold active:scale-90 transition-all border border-slate-200"
            >
                <Minus size={18} />
            </button>
        </div>
        <div className="flex flex-col text-right">
            <span className="font-black text-secondary text-sm">{label}</span>
            {subLabel && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subLabel}</span>}
        </div>
    </div>
);

export default Counter;
