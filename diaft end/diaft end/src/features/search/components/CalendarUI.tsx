import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface MonthViewProps {
    month: Date;
    handleDaySelect: (date: Date) => void;
    isSelected: (date: Date) => boolean;
    isInRange: (date: Date) => boolean;
}

export const MonthView: React.FC<MonthViewProps> = ({
    month,
    handleDaySelect,
    isSelected,
    isInRange,
}) => {
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: (firstDayOfMonth + 1) % 7 }, (_, i) => i);
    const weekDays = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

    return (
        <div className="flex-1 min-w-[280px]">
            <h3 className="text-center font-black text-secondary mb-2 text-sm">
                {month.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {blanks.map(i => <div key={`blank-${i}`} />)}
                {days.map(day => {
                    const date = new Date(month.getFullYear(), month.getMonth(), day);
                    const selected = isSelected(date);
                    const inRange = isInRange(date);
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                    return (
                        <button
                            key={day}
                            disabled={isPast}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDaySelect(date); }}
                            className={`
                                relative h-11 w-full flex items-center justify-center text-sm font-black transition-all duration-300 rounded-xl
                                ${selected ? 'bg-gold text-white shadow-lg shadow-gold/20 scale-110 z-10' : ''}
                                ${inRange ? 'bg-gold/10 text-gold rounded-none' : ''}
                                ${!selected && !inRange && !isPast ? 'hover:bg-white text-secondary' : ''}
                                ${isPast ? 'text-slate-200 cursor-not-allowed opacity-50' : ''}
                            `}
                        >
                            {day}
                            {date.toDateString() === new Date().toDateString() && !selected && (
                                <div className="absolute bottom-1 w-1 h-1 bg-gold rounded-full"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

interface CalendarUIProps {
    currentMonth: Date;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handleDaySelect: (date: Date) => void;
    isSelected: (date: Date) => boolean;
    isInRange: (date: Date) => boolean;
    checkInLabel?: string;
    checkOutLabel?: string;
    showDoubleMonth?: boolean;
}

const CalendarUI: React.FC<CalendarUIProps> = ({
    currentMonth,
    handlePrevMonth,
    handleNextMonth,
    handleDaySelect,
    isSelected,
    isInRange,
    checkInLabel = 'حدد التاريخ',
    checkOutLabel = 'حدد التاريخ',
    showDoubleMonth = false
}) => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 text-right">
                    <span className="block text-[9px] font-black text-slate-900 uppercase tracking-widest mb-0.5">الوصول</span>
                    <span className="block text-[11px] font-black text-secondary">{checkInLabel}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 text-right">
                    <span className="block text-[9px] font-black text-slate-900 uppercase tracking-widest mb-0.5">المغادرة</span>
                    <span className="block text-[11px] font-black text-secondary">{checkOutLabel}</span>
                </div>
            </div>

            <div className="bg-slate-50/50 backdrop-blur-md rounded-[2rem] p-4 border border-slate-100/50 relative">
                {/* Navigation Controls */}
                <div className="absolute top-6 left-6 right-6 flex justify-between z-20 pointer-events-none">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrevMonth(); }} className="p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-gold transition-all pointer-events-auto active:scale-90">
                        <ChevronRight size={18} />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNextMonth(); }} className="p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-gold transition-all pointer-events-auto active:scale-90">
                        <ChevronLeft size={18} />
                    </button>
                </div>

                <div className={`flex flex-col ${showDoubleMonth ? 'lg:flex-row' : ''} gap-10 pt-2`}>
                    <MonthView
                        month={currentMonth}
                        handleDaySelect={handleDaySelect}
                        isSelected={isSelected}
                        isInRange={isInRange}
                    />
                    {showDoubleMonth && (
                        <>
                            <div className="hidden lg:block w-px bg-slate-100 self-stretch my-4"></div>
                            <div className="hidden lg:block">
                                <MonthView
                                    month={nextMonth}
                                    handleDaySelect={handleDaySelect}
                                    isSelected={isSelected}
                                    isInRange={isInRange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarUI;
