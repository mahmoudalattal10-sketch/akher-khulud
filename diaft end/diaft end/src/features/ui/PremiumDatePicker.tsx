import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { MonthView } from '../search/components/CalendarUI';

interface PremiumDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

const PremiumDatePicker: React.FC<PremiumDatePickerProps> = ({
    value,
    onChange,
    label,
    placeholder = 'حدد التاريخ',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDateArabic = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    const handleDaySelect = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${day}`);
        setIsOpen(false);
    };

    const isSelected = (date: Date) => {
        if (!value) return false;
        return date.toDateString() === new Date(value).toDateString();
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="text-xs font-medium text-slate-500 mb-1.5 block">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-3 px-4 py-2.5 bg-white border rounded-xl cursor-pointer transition-all duration-300
                    ${isOpen ? 'border-gold ring-4 ring-gold/5 shadow-lg' : 'border-slate-200 hover:border-slate-300'}
                `}
            >
                <CalendarIcon className={`w-4 h-4 ${isOpen ? 'text-gold' : 'text-slate-400'}`} />
                <span className={`text-sm flex-1 ${value ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    {value ? formatDateArabic(value) : placeholder}
                </span>
                {value && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onChange(''); }}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-[99999] md:right-0 right-1/2 md:translate-x-0 translate-x-1/2 top-[105%] animate-premium-popup">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] border border-slate-200 min-w-[320px]">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNextMonth(); }} className="p-2.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-gold active:scale-95">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrevMonth(); }} className="p-2.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-gold active:scale-95">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>

                        <MonthView
                            month={currentMonth}
                            handleDaySelect={handleDaySelect}
                            isSelected={isSelected}
                            isInRange={() => false}
                        />

                        <div className="mt-6 flex justify-center border-t border-slate-50 pt-6">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
                                className="text-[11px] font-[1000] text-gold uppercase tracking-[0.2em] hover:text-gold-dark transition-colors px-6 py-2 bg-gold/5 rounded-full"
                            >
                                إغلاق التقويم
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumDatePicker;
