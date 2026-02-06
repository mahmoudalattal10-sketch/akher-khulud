import React, { useMemo } from 'react';
import { useHotels } from '../../../hooks/useHotels';
import HotelCard from './HotelCard';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedHotelsProps {
    currentHotelId: string;
    city: string;
}

const RelatedHotels: React.FC<RelatedHotelsProps> = ({ currentHotelId, city }) => {
    // 🎣 Fetch all hotels to filter by city
    const { hotels, loading } = useHotels();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const relatedHotels = useMemo(() => {
        if (!hotels) return [];
        return hotels
            .filter(h =>
                h.city?.toLowerCase() === city?.toLowerCase() &&
                String(h.id) !== String(currentHotelId)
            )
            .slice(0, 6); // Show up to 6 related hotels
    }, [hotels, city, currentHotelId]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 w-64 bg-slate-100 rounded-lg mx-auto md:mx-0" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem]" />
                    ))}
                </div>
            </div>
        );
    }

    if (relatedHotels.length === 0) return null;

    return (
        <section id="related-hotels" className="space-y-10 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#D6B372] rounded-full" />
                    <div>
                        <h2 className="text-2xl md:text-3xl font-[1000] text-[#0F172A] flex items-center gap-2">
                            فنادق قد تعجبك في {city === 'makkah' ? 'مكة المكرمة' : city === 'madinah' ? 'المدينة المنورة' : city}
                            <Sparkles size={24} className="text-[#D6B372]" />
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-1">اكتشف خيارات إقامة متميزة أخرى في نفس المنطقة</p>
                    </div>
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gold font-black text-sm hover:underline underline-offset-8"
                >
                    تصفح الكل
                </button>
            </div>

            <div className="relative group">
                {/* Navigation Buttons - Only visible on hover and on desktop */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl border border-slate-100 items-center justify-center text-slate-900 hidden md:flex opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-slate-50 active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth px-2"
                >
                    {relatedHotels.map((hotel, idx) => (
                        <div
                            key={hotel.id}
                            className="min-w-[300px] md:min-w-[380px] snap-start animate-fade-in"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <HotelCard
                                hotel={hotel}
                                offerMode={true}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl border border-slate-100 items-center justify-center text-slate-900 hidden md:flex opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-slate-50 active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Optional: Add custom scrollbar styling in global CSS or use a utility */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}} />
            </div>
        </section>
    );
};

export default RelatedHotels;
