import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    id?: string;
    label: string;
    icon?: React.ReactNode;
}

interface PremiumDropdownProps {
    value: string;
    options: Option[];
    onChange: (val: string) => void;
    icon?: any;
    label: string;
    disabled?: boolean;
}

const PremiumDropdown: React.FC<PremiumDropdownProps> = ({
    value,
    options,
    onChange,
    icon: Icon,
    label,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value || opt.label === value);

    return (
        <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">{label}</label>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group transition-all hover:border-gold/30 hover:bg-white disabled:opacity-50 ${isOpen ? 'ring-2 ring-gold/20 border-gold/40 bg-white' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-slate-400 group-hover:text-gold transition-colors" />}
                    <span className={`text-sm font-bold ${selectedOption ? 'text-secondary' : 'text-slate-400'}`}>
                        {selectedOption?.label || `اختر ${label}`}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-premium-popup py-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {options.map((option) => (
                        <button
                            key={option.id || option.label}
                            type="button"
                            onClick={() => {
                                onChange(option.id || option.label);
                                setIsOpen(false);
                            }}
                            className={`w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${(option.id === value || option.label === value) ? 'bg-gold/5 text-gold' : 'text-slate-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {option.icon}
                                <span className="text-sm font-bold">{option.label}</span>
                            </div>
                            {(option.id === value || option.label === value) && <Check size={16} className="text-gold" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PremiumDropdown;
