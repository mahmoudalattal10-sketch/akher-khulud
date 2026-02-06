import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../../contexts/SearchContext';
import { Star, MapPin, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle, X, Search, Sparkles, Wifi, Utensils, Car, Coffee, Shield, Globe, Compass, ChevronDown, ChevronUp, Building, Plus, Minus } from 'lucide-react';
import { useSearchLogic, SheetType } from '../hooks/useSearchLogic';
import DestinationList from './DestinationList';
import CalendarUI from './CalendarUI';
import Counter from './Counter';
import MobileSearchOverlay from './MobileSearchOverlay';

interface PremiumSearchProps {
    onSearch?: (criteria: { city: string; checkIn: Date | null; checkOut: Date | null; guests: { adults: number; children: number; rooms: number } }) => void;
    className?: string;
    initialCity?: string;
    hideAiToggle?: boolean;
    disableScroll?: boolean;
}

const PremiumSearch: React.FC<PremiumSearchProps> = ({ onSearch, className = "", initialCity = "", hideAiToggle = false, disableScroll = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHotelsPage = location.pathname.includes('/hotels');

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
        handleFieldClick,
        closeSheet,
        handleSearch: executeSearch
    } = useSearchLogic();

    const [destination, setDestination] = useState(searchData.destination || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const prevActiveSheet = useRef(activeSheet);

    // Sync local destination with context
    useEffect(() => {
        if (searchData.destination !== destination) {
            setDestination(searchData.destination || '');
        }
    }, [searchData.destination]);

    // [AUTO-SEARCH] Trigger search automatically when on Hotels page
    // [FIX] Check if user is STILL on Hotels page inside the timeout to prevent redirect loops
    useEffect(() => {
        if (!isHotelsPage) return;

        // Debounce to avoid rapid reloads
        const timer = setTimeout(() => {
            // [FIX] Re-check if we're still on Hotels page (user might have navigated away during debounce)
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/hotels')) {
                console.log('[AUTO-SEARCH] User navigated away, skipping search');
                return;
            }

            // Only search if we have a valid destination and valid date range (if dates are partially selected)
            // Note: If dates are null, it's fine (search all). But if checkIn is set but checkOut is missing, wait.
            const isDatePartial = searchData.checkIn && !searchData.checkOut;
            if (searchData.destination && !isDatePartial) {
                if (onSearch) {
                    onSearch({
                        city: searchData.destination,
                        checkIn: searchData.checkIn,
                        checkOut: searchData.checkOut,
                        guests: {
                            adults: searchData.adults || 0,
                            children: searchData.children || 0,
                            rooms: searchData.rooms || 0
                        }
                    });
                }
            }
        }, 500); // 500ms debounce for snappier experience

        return () => clearTimeout(timer);
    }, [searchData, isHotelsPage, onSearch]);

    // Handle clicks outside the search bar to close sheets
    useEffect(() => {
        if (activeSheet !== 'none') return; // Don't block inside interactions
        // ... (Click outside logic handled by popup wrapper usually, but here we kept original logic structure)
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                closeSheet();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeSheet]);

    // Smart Scroll Effect for PremiumSearch
    useEffect(() => {
        if (window.innerWidth < 1024 || disableScroll) return; // Only for Tablet & Desktop + Check if disabled

        // Only scroll if the state actually CHANGED from what it was
        if (prevActiveSheet.current === activeSheet) return;

        if (activeSheet !== 'none') {
            setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const targetY = window.scrollY + rect.top - 120; // Consistent 120px offset
                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else if (prevActiveSheet.current !== 'none') {
            // Closing: Scroll back to the search container top with offset for navbar
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const targetY = window.scrollY + rect.top - 120;
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });
            }
        }

        // Update prev value for next run
        prevActiveSheet.current = activeSheet;
    }, [activeSheet, disableScroll]);

    const formatDateArabic = (date: Date | null) => {
        if (!date) return 'حدد التاريخ';
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
    };

    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [initialMobileStep, setInitialMobileStep] = useState<SheetType>('destination');

    const handleSearchClick = () => {
        if (!destination) {
            setActiveSheet('destination');
            alert("يرجى اختيار الوجهة أولاً للبدء بالبحث");
            return;
        }

        if (onSearch) {
            onSearch({
                city: destination,
                checkIn: searchData.checkIn,
                checkOut: searchData.checkOut,
                guests: {
                    adults: searchData.adults || 0,
                    children: searchData.children || 0,
                    rooms: searchData.rooms || 0
                }
            });
        } else {
            executeSearch(destination);
        }
        closeSheet();
    };

    const PopupWrapper = ({ isOpen, children: content, width = "380px" }: { isOpen: boolean, children: React.ReactNode, width?: string }) => {
        if (!isOpen) return null;
        return (
            <div className="hidden lg:block absolute z-[900] top-[110%] left-1/2 -translate-x-1/2" style={{ width }}>
                <div className="animate-premium-popup">
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100">
                        <div className="relative">{content}</div>
                        <div className="mt-6 flex justify-center">
                            <button onClick={(e) => { e.stopPropagation(); closeSheet(); }} className="bg-primary text-white px-10 py-3 rounded-full font-black text-xs hover:bg-gold active:scale-90 transition-all shadow-lg">تأكيد</button>
                        </div>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
                </div>
            </div>
        );
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-3 border border-white/60 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.15)] group/search">
                <div className="flex flex-col lg:flex-row gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {/* 1. Destination */}
                        <div className="relative">
                            <div
                                onClick={() => {
                                    if (window.innerWidth < 1024) {
                                        setInitialMobileStep('destination');
                                        setShowMobileSearch(true);
                                    } else {
                                        handleFieldClick('destination');
                                    }
                                }}
                                className={`bg-white/50 p-3 rounded-[2rem] flex items-center gap-3 cursor-pointer transition-all duration-500 border border-white/40 group ${activeSheet === 'destination' ? 'bg-white shadow-xl shadow-gold/5 ring-1 ring-gold/10' : 'hover:bg-white/80'}`}
                            >
                                <div className="p-2.5 bg-slate-50 text-gold rounded-xl group-hover:bg-gold group-hover:text-white transition-all duration-500"><MapPin size={18} /></div>
                                <div className="text-right flex-1 overflow-hidden">
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1">الوجهة</p>
                                    <p className="text-sm font-light text-slate-400 truncate leading-none">{destination || "إلى أين تريد الذهاب؟"}</p>
                                </div>
                            </div>
                            <PopupWrapper isOpen={activeSheet === 'destination'}>
                                <DestinationList
                                    destination={destination}
                                    setDestination={(v) => { setDestination(v); updateSearch({ destination: v }); }}
                                    closeSheet={closeSheet}
                                />
                            </PopupWrapper>
                        </div>

                        {/* 2. Dates */}
                        <div className="relative">
                            <div
                                onClick={() => {
                                    if (window.innerWidth < 1024) {
                                        setInitialMobileStep('dates');
                                        setShowMobileSearch(true);
                                    } else {
                                        handleFieldClick('dates');
                                    }
                                }}
                                className={`bg-white/50 p-3 rounded-[2rem] flex items-center gap-3 cursor-pointer transition-all duration-500 border border-white/40 group ${activeSheet === 'dates' ? 'bg-white shadow-xl shadow-gold/5 ring-1 ring-gold/10' : 'hover:bg-white/80'}`}
                            >
                                <div className="p-2.5 bg-slate-50 text-gold rounded-xl group-hover:bg-gold group-hover:text-white transition-all duration-500"><SlidersHorizontal size={18} /></div>
                                <div className="text-right flex-1 overflow-hidden">
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1">التاريخ</p>
                                    <p className="text-sm font-light text-slate-400 truncate leading-none">
                                        {searchData.checkIn ? `${formatDateArabic(searchData.checkIn)} - ${formatDateArabic(searchData.checkOut)}` : "متى رحلتك؟"}
                                    </p>
                                </div>
                            </div>
                            <PopupWrapper isOpen={activeSheet === 'dates'} width="720px">
                                <CalendarUI
                                    currentMonth={currentMonth}
                                    handlePrevMonth={handlePrevMonth}
                                    handleNextMonth={handleNextMonth}
                                    handleDaySelect={handleDaySelect}
                                    isSelected={isSelected}
                                    isInRange={isInRange}
                                    checkInLabel={formatDateArabic(searchData.checkIn)}
                                    checkOutLabel={formatDateArabic(searchData.checkOut)}
                                    showDoubleMonth={true}
                                />
                            </PopupWrapper>
                        </div>

                        {/* 3. Guests */}
                        <div className="relative">
                            <div
                                onClick={() => {
                                    if (window.innerWidth < 1024) {
                                        setInitialMobileStep('guests');
                                        setShowMobileSearch(true);
                                    } else {
                                        handleFieldClick('guests');
                                    }
                                }}
                                className={`bg-white/50 p-3 rounded-[2rem] flex items-center gap-3 cursor-pointer transition-all duration-500 border border-white/40 group ${activeSheet === 'guests' ? 'bg-white shadow-xl shadow-gold/5 ring-1 ring-gold/10' : 'hover:bg-white/80'}`}
                            >
                                <div className="p-2.5 bg-slate-50 text-gold rounded-xl group-hover:bg-gold group-hover:text-white transition-all duration-500"><ArrowUpDown size={18} /></div>
                                <div className="text-right flex-1 overflow-hidden">
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1">الضيوف الغرف</p>
                                    <p className="text-sm font-light text-slate-400 truncate leading-none">
                                        {(searchData.adults || 0) + (searchData.children || 0)} ضيوف، {searchData.rooms || 0} غرف
                                    </p>
                                </div>
                            </div>
                            <PopupWrapper isOpen={activeSheet === 'guests'}>
                                <div className="space-y-4 text-right">
                                    <div className="pb-4 border-b border-slate-100/50">
                                        <h3 className="text-lg font-black text-secondary">الضيوف والمرافق</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-1">حدد عدد المسافرين والغرف</p>
                                    </div>
                                    <Counter label="بالغين" subLabel="11 سنة فأكثر" value={searchData.adults || 0} setter={(v) => updateSearch({ adults: v })} min={1} />
                                    <Counter label="أطفال" subLabel="تحت 11 سنة" value={searchData.children || 0} setter={(v) => updateSearch({ children: v })} />
                                    <div className="pt-2 border-t border-slate-100/50 mt-4">
                                        <Counter label="عدد الغرف" subLabel="الغرف المطلوبة" value={searchData.rooms || 0} setter={(v) => updateSearch({ rooms: v })} min={1} />
                                    </div>
                                </div>
                            </PopupWrapper>
                        </div>
                    </div>
                    <button
                        onClick={handleSearchClick}
                        className="bg-secondary text-white font-black px-12 py-5 rounded-[2rem] hover:bg-gold hover:shadow-2xl hover:shadow-gold/20 transition-all duration-500 shadow-xl shadow-secondary/10 text-sm active:scale-95 shrink-0 flex items-center gap-3"
                    >
                        <Search size={18} />
                        تطبيق البحث
                    </button>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <MobileSearchOverlay
                isOpen={showMobileSearch}
                onClose={() => setShowMobileSearch(false)}
                onSearch={handleSearchClick}
                initialStep={initialMobileStep === 'none' || initialMobileStep === 'rooms' ? 'destination' : initialMobileStep}
            />
        </div>
    );
};

export default PremiumSearch;
