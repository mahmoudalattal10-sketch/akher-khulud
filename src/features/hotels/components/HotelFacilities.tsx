import React, { useState } from 'react';
import {
    Wifi, Car, Waves, Dumbbell, Utensils, Plane, Sparkles, Bell, Gamepad2,
    Briefcase, Shirt, UserCheck, Coffee, Key, CheckCircle2, Monitor, Wind,
    Shield, Clock, User, DoorOpen, ChevronDown, ChevronUp, Bus
} from 'lucide-react';

interface Amenity {
    name: string;
    icon: React.ReactNode;
}

interface HotelFacilitiesProps {
    amenities: string[];
}

const amenityTranslations: Record<string, string> = {
    'wifi': 'واي فاي مجاني',
    'parking': 'مواقف سيارات',
    'pool': 'مسبح فندقي',
    'gym': 'نادي رياضي',
    'food': 'مطعم فاخر',
    'shuttle': 'نقل للحرم 24/7',
    'spa': 'مركز سبا وعافية',
    'room_service': 'خدمة غرف 24/7',
    'kids_club': 'نادي أطفال',
    'business': 'مركز أعمال',
    'laundry': 'خدمة غسيل',
    'concierge': 'كونسيرج',
    'cafe': 'مقهى',
    'valet': 'صف سيارات',
};

const getAmenityDetails = (key: string): Amenity | null => {
    if (!key || typeof key !== 'string') return null;
    const k = key.toLowerCase();

    // Strictly filter only allowed amenities
    if (!amenityTranslations[k]) return null;

    const name = amenityTranslations[k];
    let icon = <CheckCircle2 size={18} />;

    if (k.includes('wifi')) icon = <Wifi size={18} />;
    else if (k.includes('parking')) icon = <Car size={18} />;
    else if (k.includes('pool')) icon = <Waves size={18} />;
    else if (k.includes('gym')) icon = <Dumbbell size={18} />;
    else if (k.includes('food') || k.includes('restaurant')) icon = <Utensils size={18} />;
    else if (k.includes('shuttle') || k.includes('transport')) icon = <Bus size={18} />;
    else if (k.includes('spa')) icon = <Sparkles size={18} />;
    else if (k.includes('room_service')) icon = <Bell size={18} />;
    else if (k.includes('kids')) icon = <Gamepad2 size={18} />;
    else if (k.includes('business')) icon = <Briefcase size={18} />;
    else if (k.includes('laundry')) icon = <Shirt size={18} />;
    else if (k.includes('concierge')) icon = <UserCheck size={18} />;
    else if (k.includes('cafe')) icon = <Coffee size={18} />;
    else if (k.includes('valet')) icon = <Key size={18} />;

    return { name, icon };
};


const HotelFacilities: React.FC<HotelFacilitiesProps> = ({ amenities }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const facilityItems = (amenities || [])
        .map(key => getAmenityDetails(key))
        .filter((item): item is Amenity => item !== null);

    const hasMore = facilityItems.length > 8;

    return (
        <section id="facilities" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 md:space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-[21px] font-[1000] text-[#0F172A] flex items-center gap-3">
                    <div className="w-2 h-7 bg-[#D6B372] rounded-full" />
                    أبرز المرافق والخدمات
                </h2>
            </div>

            {facilityItems.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                        {facilityItems.map((fac, idx) => (
                            <div
                                key={idx}
                                className={`group relative flex-col gap-2 p-3 bg-white border border-slate-200 rounded-[1.2rem] hover:border-[#D6B372] hover:shadow-[0_10px_30px_-10px_rgba(214,179,114,0.3)] transition-all duration-300 cursor-default ${!isExpanded && idx >= 8 ? 'hidden md:flex' : 'flex'}`}
                            >
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-[#D6B372] group-hover:text-white group-hover:-rotate-3 transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-[#D6B372]">
                                    {React.cloneElement(fac.icon as React.ReactElement, { size: 16, strokeWidth: 2.5 })}
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[12px] font-[900] text-slate-800 group-hover:text-[#D6B372] transition-colors">{fac.name}</span>
                                    <p className="text-[9px] font-bold text-slate-400 opacity-60">مرافق متوفرة</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Expand/Collapse Button (Only shows if there are more items & strictly mobile) */}
                    {hasMore && (
                        <div className="flex justify-center md:hidden pt-2">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-[#D6B372] hover:text-white border border-slate-200 rounded-full text-[12px] font-black text-slate-500 transition-all duration-300"
                            >
                                {isExpanded ? (
                                    <>
                                        <span>عرض أقل</span>
                                        <ChevronUp size={14} />
                                    </>
                                ) : (
                                    <>
                                        <span>عرض جميع المرافق ({facilityItems.length})</span>
                                        <ChevronDown size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-slate-50/50 border border-slate-100 rounded-[3rem] p-12 text-center group">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-500">
                        <Shield size={32} strokeWidth={1} />
                    </div>
                    <p className="text-slate-400 font-[800] text-xs max-w-xs mx-auto leading-relaxed">لم يتم تحديد مرافق بارزة لهذا الفندق بعد، ولكننا نضمن لك جودة جميع الخدمات الأساسية.</p>
                </div>
            )}
        </section>
    );
};

export default HotelFacilities;
