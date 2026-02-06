import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { formatHotelDistance } from '../../../utils/formatters';

interface HotelHeaderProps {
    name: string;
    rating: number;
    location: string;
    city: string;
    distanceFromHaram: string | number;
}

const HotelHeader: React.FC<HotelHeaderProps> = ({ name, rating, location, city, distanceFromHaram }) => {
    return (
        <div className="animate-fade-in space-y-4 md:space-y-6" style={{ animationDelay: '100ms' }}>
            {/* Top Row: Title & Rating */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-0.5 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(rating || 5) ? "currentColor" : "none"}
                            className={i < Math.floor(rating || 5) ? "" : "opacity-20"}
                            strokeWidth={2.5}
                        />
                    ))}
                </div>
                <h1 className="text-[28px] md:text-[48px] font-[1000] text-slate-900 leading-tight tracking-tight">
                    {name}
                </h1>
            </div>

            {/* Information Bar: Clean & Minimal */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Location Badge */}
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 pl-3 pr-1 py-1 rounded-2xl shadow-sm hover:border-gold/30 transition-colors group">
                    <span className="text-[12px] md:text-[14px] font-[800] text-slate-700 px-2">{location}</span>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center border border-slate-100 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                        <MapPin size={14} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Distance Badge */}
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 hover:border-gold/30 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] md:text-[13px] font-black text-slate-700">
                        {formatHotelDistance(distanceFromHaram, city)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HotelHeader;
