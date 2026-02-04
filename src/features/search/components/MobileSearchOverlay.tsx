import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';
import { useSearchLogic } from '../hooks/useSearchLogic';
import DestinationList from './DestinationList';
import CalendarUI from './CalendarUI';
import Counter from './Counter';

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (data: any) => void;
    initialStep?: 'destination' | 'dates' | 'guests';
    hideDestination?: boolean;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
    isOpen,
    onClose,
    onSearch,
    initialStep = 'destination',
    hideDestination = false
}) => {
    const {
        searchData,
        updateSearch,
        activeSheet,
        setActiveSheet,
        currentMonth,
        handleNextMonth,
        handlePrevMonth,
        isSelected,
        isInRange,
        handleDaySelect,
        handleSearch: executeSearch,
        closeSheet
    } = useSearchLogic();

    const [step, setStep] = useState(hideDestination && initialStep === 'destination' ? 'dates' : initialStep);
    const [destination, setDestination] = useState(searchData.destination || '');

    // Sync local destination with context
    useEffect(() => {
        if (searchData.destination !== destination) {
            setDestination(searchData.destination || '');
        }
    }, [searchData.destination]);

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(hideDestination && initialStep === 'destination' ? 'dates' : initialStep);
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen, initialStep, hideDestination]);

    if (!isOpen) return null;

    const handleSearchClick = () => {
        if (!hideDestination && !destination) {
            setStep('destination');
            alert("يرجى اختيار الوجهة أولاً للبدء بالبحث");
            return;
        }

        onSearch({
            city: destination,
            checkIn: searchData.checkIn,
            checkOut: searchData.checkOut,
            guests: {
                adults: searchData.adults,
                children: searchData.children,
                rooms: searchData.rooms
            }
        });
        onClose();
    };

    const formatDateArabic = (date: Date | null) => {
        if (!date) return 'حدد التاريخ';
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex flex-col justify-end md:justify-center md:items-center">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-[400ms] ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

            <div className={`relative w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:w-[600px] md:rounded-[3rem] bg-white shadow-[0_-20px_80px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-all duration-[500ms] ease-ios transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full md:opacity-0 md:scale-95'}`}>
                <div className="pt-8 px-6 flex items-center justify-between mb-4 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-black text-secondary">تعديل البحث</h2>
                    <button onClick={handleSearchClick} className="text-gold font-bold text-sm active:scale-90 transition-all">تطبيق</button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-1 no-scrollbar">
                    <div className={`grid ${hideDestination ? 'grid-cols-2' : 'grid-cols-3'} gap-2 bg-slate-50 p-1.5 rounded-[2.5rem] border border-slate-100 mb-4 sticky top-0 z-10`}>
                        {!hideDestination && (
                            <button
                                onClick={() => setStep('destination')}
                                className={`py-3 rounded-full text-[12px] font-black transition-all duration-300 ${step === 'destination' ? 'bg-white shadow-sm text-gold' : 'text-slate-400'}`}
                            >
                                الوجهة
                            </button>
                        )}
                        <button
                            onClick={() => setStep('dates')}
                            className={`py-3 rounded-full text-[12px] font-black transition-all duration-300 ${step === 'dates' ? 'bg-white shadow-sm text-gold' : 'text-slate-400'}`}
                        >
                            التاريخ
                        </button>
                        <button
                            onClick={() => setStep('guests')}
                            className={`py-3 rounded-full text-[12px] font-black transition-all duration-300 ${step === 'guests' ? 'bg-white shadow-sm text-gold' : 'text-slate-400'}`}
                        >
                            الضيوف
                        </button>
                    </div>

                    <div className="stagger-entry active">
                        <div className="space-y-6">
                            {step === 'destination' && (
                                <DestinationList
                                    destination={destination}
                                    setDestination={(v) => { setDestination(v); updateSearch({ destination: v }); setStep('dates'); }}
                                    closeSheet={onClose}
                                />
                            )}

                            {step === 'dates' && (
                                <CalendarUI
                                    currentMonth={currentMonth}
                                    handlePrevMonth={handlePrevMonth}
                                    handleNextMonth={handleNextMonth}
                                    handleDaySelect={(date) => {
                                        handleDaySelect(date);
                                        // Auto-advance to guests if range is complete
                                        if (searchData.checkIn && !searchData.checkOut && date > searchData.checkIn) {
                                            setTimeout(() => setStep('guests'), 400);
                                        }
                                    }}
                                    isSelected={isSelected}
                                    isInRange={isInRange}
                                    checkInLabel={formatDateArabic(searchData.checkIn)}
                                    checkOutLabel={formatDateArabic(searchData.checkOut)}
                                    showDoubleMonth={false}
                                />
                            )}

                            {step === 'guests' && (
                                <div className="space-y-4">
                                    <div className="p-2">
                                        <h3 className="text-xl font-black text-secondary mb-6 text-right">الضيوف والمرافق</h3>
                                        <div className="space-y-3">
                                            <Counter label="بالغين" subLabel="11 سنة فأكثر" value={searchData.adults || 0} setter={(v) => updateSearch({ adults: v })} min={1} />
                                            <Counter label="أطفال" subLabel="تحت 11 سنة" value={searchData.children || 0} setter={(v) => updateSearch({ children: v })} />
                                            <div className="pt-4 border-t border-slate-100/50 mt-4">
                                                <Counter label="عدد الغرف" subLabel="المطلوبة" value={searchData.rooms || 0} setter={(v) => updateSearch({ rooms: v })} min={1} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 pb-12 border-t border-slate-100 shrink-0 bg-white">
                    <button
                        onClick={handleSearchClick}
                        className="w-full bg-secondary text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-secondary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Search size={22} />
                        بحث الآن
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MobileSearchOverlay;
