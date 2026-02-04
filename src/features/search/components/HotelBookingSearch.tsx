import React, { useState, useRef, useEffect } from 'react';
import { Tag, Search, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSearchLogic } from '../hooks/useSearchLogic';
import CalendarUI from './CalendarUI';
import Counter from './Counter';

export interface BookingSearchData {
    checkIn: Date;
    checkOut: Date;
    nights: number;
    rooms: number;
    adults: number;
    children: number;
    promoCode: string;
}

interface HotelBookingSearchProps {
    hotelId: string;
    hotelName: string;
    basePrice: number;
    onSearch?: (data: BookingSearchData) => void;
    onChange?: (data: BookingSearchData) => void;
    isLoading?: boolean;
    autoSearch?: boolean; // ✨ New: Trigger search automatically on change
}

const HotelBookingSearch: React.FC<HotelBookingSearchProps> = ({
    hotelId,
    hotelName,
    basePrice,
    onSearch,
    onChange,
    isLoading,
    autoSearch = false
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
        handleFieldClick,
        closeSheet
    } = useSearchLogic();

    // [AUTO-SEARCH] Professionally trigger update on data changes
    useEffect(() => {
        if (!autoSearch || !onSearch) return;

        // Only trigger if we have a complete valid range
        if (searchData.checkIn && searchData.checkOut) {
            const timer = setTimeout(() => {
                onSearch({
                    checkIn: searchData.checkIn!,
                    checkOut: searchData.checkOut!,
                    nights: searchData.nights || 1,
                    rooms: searchData.rooms || 1,
                    adults: searchData.adults || 2,
                    children: searchData.children || 0,
                    promoCode: searchData.promoCode || ''
                });
            }, 600); // 600ms debounce for professional feel
            return () => clearTimeout(timer);
        }
    }, [
        searchData.checkIn,
        searchData.checkOut,
        searchData.rooms,
        searchData.adults,
        searchData.children,
        autoSearch
    ]);

    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
    const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showPromoInput, setShowPromoInput] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const prevActiveSheet = useRef(activeSheet);

    const handleVerifyCoupon = async () => {
        if (!searchData.promoCode?.trim()) return;
        setIsCheckingCoupon(true);
        setCouponMsg(null);

        try {
            const res = await fetch('http://localhost:3001/api/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: searchData.promoCode,
                    hotelId: hotelId
                })
            });
            const data = await res.json();

            if (data.valid) {
                setCouponMsg({ type: 'success', text: `تم تطبيق خصم ${data.discount}% بنجاح!` });
                updateSearch({
                    couponDiscount: data.discount,
                    promoCode: searchData.promoCode // Ensure code is saved
                });
                triggerConfetti();
            } else {
                setCouponMsg({ type: 'error', text: data.error || data.message || 'الكوبون غير صالح' });
                updateSearch({ couponDiscount: 0 });
            }
        } catch (err) {
            setCouponMsg({ type: 'error', text: 'حدث خطأ أثناء التحقق' });
            updateSearch({ couponDiscount: 0 });
        } finally {
            setIsCheckingCoupon(false);
        }
    };

    const triggerConfetti = () => {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 2000 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 20 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                closeSheet();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Smart Scroll Effect for HotelBookingSearch
    useEffect(() => {
        if (window.innerWidth < 1024) return; // Only for Tablet & Desktop

        // Only scroll if the state actually CHANGED from what it was
        if (prevActiveSheet.current === activeSheet) return;

        if (activeSheet !== 'none') {
            // Opening: Scroll to focus search
            setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const targetY = window.scrollY + rect.top - 120; // Consistent 120px offset for navbar
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
    }, [activeSheet]);

    useEffect(() => {
        if (onChange && searchData.checkIn && searchData.checkOut) {
            onChange({
                checkIn: searchData.checkIn,
                checkOut: searchData.checkOut,
                nights: searchData.nights || 1,
                rooms: searchData.rooms || 1,
                adults: searchData.adults || 2,
                children: searchData.children || 0,
                promoCode: searchData.promoCode || ''
            });
        }
    }, [searchData, onChange]);

    const handleSearchClick = () => {
        if (onSearch && searchData.checkIn && searchData.checkOut) {
            onSearch({
                checkIn: searchData.checkIn,
                checkOut: searchData.checkOut,
                nights: searchData.nights || 1,
                rooms: searchData.rooms || 1,
                adults: searchData.adults || 2,
                children: searchData.children || 0,
                promoCode: searchData.promoCode || ''
            });

            // Scroll to rooms section
            setTimeout(() => {
                const roomsSection = document.getElementById('rooms');
                if (roomsSection) {
                    const navbarHeight = 100; // Approximate navbar height
                    const rect = roomsSection.getBoundingClientRect();
                    const targetY = window.scrollY + rect.top - navbarHeight;

                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    };

    const formatDateArabicLocal = (date: Date | null) => {
        if (!date) return 'اختر التاريخ';
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
    };

    return (
        <div className="w-full mb-12 animate-fade-in relative z-50" style={{ animationDelay: '200ms' }} ref={containerRef}>
            <div className="flex items-end justify-between mb-6 px-1">
                <div className="space-y-0.5">
                    <h3 className="text-[19px] font-[1000] text-slate-900 tracking-tight leading-none">ابدأ حجزك الآن</h3>
                    <p className="text-[12px] font-bold text-slate-400 capitalize">اختر مواعيدك المفضلة لاستكشاف العروض</p>
                </div>
                {searchData.nights !== undefined && searchData.nights > 0 && (
                    <div className="bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-1.5 rounded-xl shrink-0 cursor-default flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[12px] font-black">
                            {searchData.nights} {searchData.nights === 1 ? 'ليلة' : searchData.nights === 2 ? 'ليلتين' : searchData.nights <= 10 ? 'ليالي' : 'ليلة'}
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-100">
                    {/* Dates Section */}
                    <div className="lg:col-span-3 relative group/field">
                        <button
                            type="button"
                            onClick={() => handleFieldClick('dates')}
                            className="w-full h-full flex items-center gap-5 p-6 md:p-8 hover:bg-slate-50/50 transition-all text-right group lg:rounded-r-[2.5rem]"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors shrink-0 shadow-inner">
                                <Search size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1.5 opacity-60">تاريخ الإقامة</div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[17px] font-black text-slate-900 leading-none">{formatDateArabicLocal(searchData.checkIn)}</span>
                                    </div>
                                    <div className="w-8 h-px bg-slate-200 opacity-50"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[17px] font-black text-slate-900 leading-none">{formatDateArabicLocal(searchData.checkOut)}</span>
                                    </div>
                                </div>
                            </div>
                        </button>

                    </div>

                    {/* Guests Section */}
                    <div className="lg:col-span-2 relative">
                        <button
                            type="button"
                            onClick={() => handleFieldClick('guests')}
                            className="w-full h-full flex items-center gap-5 p-6 md:p-8 hover:bg-slate-50/50 transition-all text-right group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors shrink-0 shadow-inner">
                                <div className="p-0.5">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1.5 opacity-60">النزلاء</div>
                                <div className="text-[17px] font-black text-slate-900 leading-none truncate">
                                    {searchData.rooms} غرفة <span className="text-slate-300 mx-1">·</span> {(searchData.adults || 0) + (searchData.children || 0)} ضيوف
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Search Button Section */}
                    <div className="lg:col-span-2 p-4 lg:p-5 flex items-center">
                        <button
                            onClick={handleSearchClick}
                            disabled={isLoading}
                            className={`group w-full h-full min-h-[70px] ${isLoading ? 'bg-emerald-600/50 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500'} text-white py-5 rounded-[1.75rem] font-black text-[18px] shadow-2xl shadow-emerald-500/30 active:scale-[0.97] transition-all flex items-center justify-center gap-4 relative overflow-hidden`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {isLoading ? (
                                <Loader2 size={22} className="animate-spin" strokeWidth={3} />
                            ) : (
                                <Search size={22} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
                            )}
                            <span>تحديث العروض</span>
                        </button>
                    </div>
                </div>
            </div>


            {/* Moved Popups to Root Level for Better Positioning & Z-Index */}
            {activeSheet === 'dates' && (
                <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.2)] p-12 z-[100] w-[95vw] md:w-[900px] md:max-w-[calc(100vw-40px)] animate-premium-popup origin-top">
                    <CalendarUI
                        currentMonth={currentMonth}
                        handlePrevMonth={handlePrevMonth}
                        handleNextMonth={handleNextMonth}
                        handleDaySelect={handleDaySelect}
                        isSelected={isSelected}
                        isInRange={isInRange}
                        checkInLabel={formatDateArabicLocal(searchData.checkIn)}
                        checkOutLabel={formatDateArabicLocal(searchData.checkOut)}
                        showDoubleMonth={true}
                    />
                    <div className="mt-12 flex justify-center">
                        <button onClick={closeSheet} className="group flex items-center gap-3 bg-slate-900 text-white px-14 py-5 rounded-[2rem] font-black text-[15px] shadow-2xl hover:bg-emerald-600 transition-all active:scale-95">
                            تأكيد المواعيد
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Search size={14} strokeWidth={3} />
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {activeSheet === 'guests' && (
                <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 md:left-auto md:right-[20%] md:translate-x-0 w-[90vw] md:w-[350px] bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] p-8 z-[100] animate-premium-popup origin-top-right">
                    <div className="space-y-6">
                        <div className="pb-2 border-b border-slate-50">
                            <h4 className="text-[17px] font-black text-slate-900">عدد الغرف والنزلاء</h4>
                        </div>
                        <Counter label="الغرف" value={searchData.rooms || 1} setter={(v) => updateSearch({ rooms: v })} min={1} />
                        <Counter label="البالغين" subLabel="11 سنة فأكثر" value={searchData.adults || 2} setter={(v) => updateSearch({ adults: v })} min={1} />
                        <Counter label="الأطفال" subLabel="تحت 11 سنة" value={searchData.children || 0} setter={(v) => updateSearch({ children: v })} />
                        <button onClick={closeSheet} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm mt-4 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200">تأكيد التعديلات</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HotelBookingSearch;
