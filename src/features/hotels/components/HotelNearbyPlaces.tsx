import React from 'react';
import {
    MapPin, Building, Globe, Car, Plane, ShoppingBag, Utensils,
    Briefcase, Sparkles, MapPinned, Info, Navigation2
} from 'lucide-react';

interface Landmark {
    name: string;
    distance: string | number;
    icon?: string | React.ReactNode;
}

interface HotelNearbyPlacesProps {
    landmarks: Landmark[];
}

const iconMap: Record<string, any> = {
    'haram': <Sparkles size={18} className="text-amber-500" />,
    'building': <Building size={18} />,
    'mall': <ShoppingBag size={18} />,
    'restaurant': <Utensils size={18} />,
    'business': <Briefcase size={18} />,
    'transport': <Car size={18} />,
    'airport': <Plane size={18} />,
    'other': <MapPin size={18} />
};

const HotelNearbyPlaces: React.FC<HotelNearbyPlacesProps> = ({ landmarks }) => {
    if (!landmarks || landmarks.length === 0) return null;

    return (
        <section id="surroundings" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-[1000] text-[#0F172A] flex items-center gap-4">
                    <div className="w-2.5 h-8 bg-[#D6B372] rounded-full" />
                    المحيط والمعالم القريبة
                </h2>
                <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <Navigation2 size={14} className="text-emerald-500" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Nearby Places</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {landmarks.map((place, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-200 hover:border-slate-900 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 group"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-3 transition-all duration-500 shadow-inner border border-slate-100">
                                {typeof place.icon === 'string'
                                    ? (iconMap[place.icon] || <MapPin size={20} strokeWidth={2.5} />)
                                    : (place.icon || <MapPin size={20} strokeWidth={2.5} />)}
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-[15px] font-[1000] text-slate-900 group-hover:text-slate-900 transition-colors">{place.name}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">معلم جذب رئيسي</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500 shadow-sm flex items-center gap-2">
                                <span className="text-[13px] font-[1000] tracking-tight">{place.distance}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Smart Disclaimer */}
            <div className="p-8 bg-slate-100/50 rounded-[2.5rem] border border-slate-200/40 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 opacity-20 blur-2xl group-hover:bg-emerald-500 transition-colors duration-1000"></div>
                <div className="flex items-start gap-5 relative z-10">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0 border border-slate-100">
                        <Info size={18} strokeWidth={2.5} />
                    </div>
                    <p className="text-[12px] font-bold text-slate-500 leading-relaxed text-right">
                        جميع المسافات المذكورة أعلاه تقريبية ويتم قياسها عادةً في خط مستقيم من الفندق إلى المعلم. قد تختلف مسافة المشي أو القيادة الفعلية وفقاً للظروف المرورية وطبيعة الطرق.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HotelNearbyPlaces;
