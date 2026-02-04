import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../../contexts/SearchContext';
import { ChevronLeft, ChevronRight, MapPin, Search, Globe, Compass, ChevronDown, ChevronUp, Building, Plus, Minus, Clock } from 'lucide-react';
import { useSearchLogic, SheetType } from '../hooks/useSearchLogic';
import DestinationList from './DestinationList';
import CalendarUI from './CalendarUI';
import Counter from './Counter';
import MobileSearchOverlay from './MobileSearchOverlay';

const Hero: React.FC = () => {
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
    handleSearch
  } = useSearchLogic();

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [initialMobileStep, setInitialMobileStep] = useState<SheetType>('destination');

  const [destination, setDestination] = useState(searchData.destination || '');
  const searchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const prevActiveSheet = useRef(activeSheet);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Smart Scroll Effect for Search Bar
  useEffect(() => {
    if (window.innerWidth < 1024) return; // Only for Tablet & Desktop

    // Only scroll if the state actually CHANGED from what it was
    if (prevActiveSheet.current === activeSheet) return;

    if (activeSheet !== 'none') {
      // Small delay to allow the dropdown to potentially start rendering/animating
      setTimeout(() => {
        if (searchRef.current) {
          const rect = searchRef.current.getBoundingClientRect();
          const targetY = window.scrollY + rect.top - 120; // 120px offset for navbar and breathing room
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else if (prevActiveSheet.current !== 'none') {
      // When closed, scroll back to the hero top with offset
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
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

  // Scroll animations observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync local destination with context
  useEffect(() => {
    if (searchData.destination !== destination) {
      setDestination(searchData.destination || '');
    }
  }, [searchData.destination]);

  // Handle clicks outside the search bar to close sheets
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSheet();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateArabic = (date: Date | null) => {
    if (!date) return 'حدد التاريخ';
    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
  };

  const totalGuests = (searchData.adults || 0) + (searchData.children || 0);

  return (
    <section ref={heroRef} className="relative min-h-[85vh] md:min-h-[92vh] flex flex-col items-center justify-center pt-24 md:pt-32 pb-16 md:pb-24 bg-[#fafbfc]">
      {/* Background Decor - Contained to prevent scrollbars */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#e2e8f0_0%,_transparent_70%)] opacity-40"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-8">
          <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-white shadow-sm animate-fade-in">
            <span className="w-2 h-2 bg-gold animate-pulse rounded-full"></span>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">أهلاً بك في ضيافة خلود</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary leading-[1.15] md:leading-[1.1] tracking-wider animate-fade-in-up">
            إقامة تفيض <span className="text-gold relative inline-block">بالفخامة<span className="absolute bottom-2 left-0 w-full h-3 bg-gold/10 -z-10"></span></span> <br />
            وتفاصيل في قلب تركيزنا
          </h1>

          <p className="text-sm md:text-lg text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-90" style={{ animationDelay: '200ms' }}>
            نصمم لك تجارب إقامة استثنائية حول العالم، حيث يجتمع الرقي مع دقة التفاصيل التي تنشدها في كل وجهة تختارها.
          </p>
        </div>

        {/* Main Search Bar */}
        <div ref={searchRef} className="max-w-5xl mx-auto relative animate-premium-reveal z-50">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] p-3 md:p-4 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.12)] border border-white/60 flex flex-col md:flex-row items-stretch gap-2 transition-all duration-700 hover:shadow-[0_45px_130px_-20px_rgba(0,0,0,0.18)] hover:-translate-y-1 group/search">

            {/* 1. Destination Field */}
            <div className="flex-1 relative">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setInitialMobileStep('destination');
                    setShowMobileSearch(true);
                  } else {
                    handleFieldClick('destination');
                  }
                }}
                className={`w-full h-full text-right p-5 md:p-8 rounded-[2rem] md:rounded-[3.2rem] transition-all duration-500 flex flex-col justify-center group ${activeSheet === 'destination' ? 'bg-white shadow-xl shadow-gold/5 ring-1 ring-gold/10' : 'hover:bg-white/40'}`}
              >
                <span className="text-[12px] md:text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1.5 transition-colors group-hover:text-gold block">الوجهة</span>
                <div className="flex items-center gap-2.5 text-secondary">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm md:text-base font-light text-slate-400 truncate leading-none">{destination || 'إلى أين تريد الذهاب؟'}</span>
                </div>
              </button>

              {activeSheet === 'destination' && (
                <div className="absolute top-[105%] right-0 w-full md:w-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 z-[100] animate-premium-popup">
                  <DestinationList
                    destination={destination}
                    setDestination={(v) => { setDestination(v); updateSearch({ destination: v }); }}
                    closeSheet={closeSheet}
                  />
                </div>
              )}
            </div>

            {/* Divider - Tablet+ */}
            <div className="hidden md:block w-px h-12 self-center bg-white/60"></div>

            {/* 2. Dates Field */}
            <div className="flex-1 relative">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setInitialMobileStep('dates');
                    setShowMobileSearch(true);
                  } else {
                    handleFieldClick('dates');
                  }
                }}
                className={`w-full h-full text-right p-5 md:p-8 rounded-[2rem] md:rounded-[3.2rem] transition-all duration-500 flex flex-col justify-center group ${activeSheet === 'dates' ? 'bg-white shadow-xl shadow-gold/5 ring-1 ring-gold/10' : 'hover:bg-white/40'}`}
              >
                <span className="text-[12px] md:text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1.5 transition-colors group-hover:text-gold block">التواريخ</span>
                <div className="flex items-center gap-2.5 text-secondary">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shrink-0">
                    <Search size={18} />
                  </div>
                  <span className="text-xs md:text-sm font-light text-slate-400 whitespace-nowrap leading-none">
                    {searchData.checkIn ? `${formatDateArabic(searchData.checkIn)} - ${formatDateArabic(searchData.checkOut)}` : 'متى رحلتك؟'}
                  </span>
                </div>
              </button>

              {activeSheet === 'dates' && (
                <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-[350px] md:w-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 z-[100] animate-premium-popup">
                  <CalendarUI
                    currentMonth={currentMonth}
                    handlePrevMonth={handlePrevMonth}
                    handleNextMonth={handleNextMonth}
                    handleDaySelect={handleDaySelect}
                    isSelected={isSelected}
                    isInRange={isInRange}
                    checkInLabel={formatDateArabic(searchData.checkIn)}
                    checkOutLabel={formatDateArabic(searchData.checkOut)}
                  />
                </div>
              )}
            </div>

            {/* Divider - Tablet+ */}
            <div className="hidden md:block w-px h-12 self-center bg-white/60"></div>

            {/* 3. Guests Field */}
            <div className="flex-1 relative">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setInitialMobileStep('guests');
                    setShowMobileSearch(true);
                  } else {
                    handleFieldClick('guests');
                  }
                }}
                className={`w-full h-full text-right p-5 md:p-8 rounded-[2rem] md:rounded-[3.2rem] transition-all duration-500 flex flex-col justify-center group ${activeSheet === 'guests' ? 'bg-white shadow-xl shadow-gold/5 ring-1 ring-gold/10' : 'hover:bg-white/40'}`}
              >
                <span className="text-[12px] md:text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1.5 transition-colors group-hover:text-gold block">الضيوف</span>
                <div className="flex items-center gap-2.5 text-secondary">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shrink-0">
                    <Plus size={18} />
                  </div>
                  <span className="text-sm md:text-base font-light text-slate-400 leading-none">
                    {totalGuests > 0 ? `${totalGuests} ضيوف، ${searchData.rooms || 0} غرف` : 'من سيأتي معك؟'}
                  </span>
                </div>
              </button>

              {activeSheet === 'guests' && (
                <div className="absolute top-[105%] left-0 w-full md:w-[350px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 z-[100] animate-premium-popup">
                  <div className="space-y-6">
                    <div className="text-right">
                      <h3 className="text-xl font-black text-secondary">الضيوف والغرف</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">حدد عدد المسافرين</p>
                    </div>

                    <div className="space-y-2">
                      <Counter label="البالغين" subLabel="11 سنة فأكثر" value={searchData.adults || 0} setter={(v) => updateSearch({ adults: v })} min={1} />
                      <Counter label="الأطفال" subLabel="تحت 11 سنة" value={searchData.children || 0} setter={(v) => updateSearch({ children: v })} />
                      <Counter label="الغرف" subLabel="عدد الغرف المطلوبة" value={searchData.rooms || 0} setter={(v) => updateSearch({ rooms: v })} min={1} />
                    </div>

                    <button onClick={closeSheet} className="w-full bg-secondary text-white font-black py-4 rounded-[1.5rem] shadow-lg active:scale-95 transition-all text-sm">
                      تطبيق التعديلات
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch(destination)}
              className="bg-secondary text-white px-10 md:px-14 py-6 md:py-8 rounded-[2rem] md:rounded-[3.2rem] flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20 hover:bg-gold hover:shadow-gold/20 hover:scale-[1.02] active:scale-95 transition-all duration-500 group/btn"
            >
              <span className="font-black text-sm md:text-lg tracking-tight">بحث الآن</span>
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-gold transition-all duration-500">
                <Search size={22} className="group-hover/btn:scale-110 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Quick Suggestions - Below Search Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">مقترحات شائعة:</span>
            {['مكة المكرمة', 'المدينة المنورة', 'جدة', 'الرياض'].map((city) => (
              <button
                key={city}
                onClick={() => { setDestination(city); updateSearch({ destination: city }); handleSearch(city); }}
                className="text-xs font-bold hover:text-gold transition-colors underline decoration-slate-200 underline-offset-4"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Stats or Badges - CLICKABLE NOW */}
        <div
          ref={statsRef}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto"
        >
          {[
            { label: 'فندق عالمي', value: '800+', icon: <Building />, link: '/hotels' },
            { label: 'مدينة حول العالم', value: '200+', icon: <Compass />, link: '/hotels?city=all' },
            { label: 'عميل سعيد', value: '85k+', icon: <Globe />, action: 'scroll-testimonials' }, // Custom action
            { label: 'دعم فني متواصل', value: '24/7', icon: <Clock />, link: '/contact' },
          ].map((stat, i) => (
            <button
              key={i}
              onClick={() => {
                if (stat.action === 'scroll-testimonials') {
                  const section = document.getElementById('testimonials-section');
                  section?.scrollIntoView({ behavior: 'smooth' });
                } else if (stat.link) {
                  window.location.hash = stat.link; // Using hash routing based on current setup usually
                }
              }}
              className={`relative group bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/60 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 text-center w-full ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Icon Container with Glow */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl group-hover:bg-gold/30 transition-colors duration-500"></div>
                <div className="relative w-full h-full bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 28, strokeWidth: 1.5 })}
                </div>
              </div>

              {/* Text Content */}
              <h4 className="text-2xl md:text-3xl font-black text-secondary mb-2 tracking-tighter tabular-nums">
                {stat.value}
              </h4>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] leading-tight">
                {stat.label}
              </p>

              {/* Subtle Bottom Line Decor */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-100 rounded-full group-hover:w-16 group-hover:bg-gold/30 transition-all duration-500"></div>

              {/* Click intimation */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
              </div>
            </button>
          ))}
        </div>
        {/* Mobile Search Overlay */}
        <MobileSearchOverlay
          isOpen={showMobileSearch}
          onClose={() => setShowMobileSearch(false)}
          onSearch={(data) => handleSearch(data.city)}
          initialStep={initialMobileStep === 'none' || initialMobileStep === 'rooms' ? 'destination' : initialMobileStep}
        />
      </div>
    </section >
  );
};

export default Hero;
