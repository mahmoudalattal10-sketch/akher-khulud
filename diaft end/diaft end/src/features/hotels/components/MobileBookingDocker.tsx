import React from 'react';
import { Calendar, Users, ChevronDown, ArrowRight } from 'lucide-react';
import { formatDateArabic } from '../../../contexts/SearchContext';

interface MobileBookingDockerProps {
    checkIn: Date | null;
    checkOut: Date | null;
    adults: number;
    children: number;
    totalPrice: number;
    hasSelection: boolean;
    onBookNow: () => void;
    onEditSearch: () => void;
}

const MobileBookingDocker: React.FC<MobileBookingDockerProps> = ({
    checkIn,
    checkOut,
    adults,
    children,
    totalPrice,
    hasSelection,
    onBookNow,
    onEditSearch
}) => {
    const hasDates = !!(checkIn && checkOut);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden p-4 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-500">

                    {/* Top Row: Dates & Guests Summary (Clickable to Edit) */}
                    <div
                        onClick={onEditSearch}
                        className="flex items-center justify-between px-4 py-2 bg-slate-50/50 rounded-2xl border border-slate-100/50 active:scale-95 transition-all"
                    >
                        <div className="flex flex-col text-right">
                            <div className="flex items-center gap-1.5 text-slate-900 font-black text-xs">
                                <span>{hasDates ? formatDateArabic(checkIn) : 'حدد التاريخ'}</span>
                                {hasDates && <span>- {formatDateArabic(checkOut)}</span>}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                                <span>{adults} بالغين، {children} أطفال</span>
                                <ChevronDown size={10} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gold border border-slate-50">
                                <Calendar size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Price & CTA */}
                    <div className="flex items-center justify-between px-2">
                        {/* Price Display */}
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-black text-slate-400 mb-0.5">المجموع</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900">
                                    {hasSelection ? totalPrice.toLocaleString() : '---'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">ر.س</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={onBookNow}
                            disabled={!hasDates}
                            className={`flex items-center justify-center gap-3 py-3.5 px-8 rounded-full font-black text-sm transition-all shadow-xl active:scale-95 group
                                ${hasSelection
                                    ? 'bg-slate-900 text-white shadow-slate-200'
                                    : 'bg-gold text-white shadow-gold/20'}`}
                        >
                            <span>{!hasDates ? 'إختر التواريخ' : !hasSelection ? 'إختر الغرفة' : 'احجز الآن'}</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <ArrowRight size={14} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileBookingDocker;
