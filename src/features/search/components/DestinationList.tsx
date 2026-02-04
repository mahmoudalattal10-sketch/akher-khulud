import React, { useState, useEffect } from 'react';
import { Search, Building, ChevronLeft, MapPin, Globe, ChevronUp, ChevronDown, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFrontendHotels } from '../../../hooks/useFrontendHotels';
import { DESTINATIONS, TOP_DESTINATIONS } from '../../../constants/destinations';

interface DestinationListProps {
    destination: string;
    setDestination: (v: string) => void;
    closeSheet: () => void;
}

const DestinationList: React.FC<DestinationListProps> = ({ destination, setDestination, closeSheet }) => {
    const [search, setSearch] = useState('');
    const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch all hotels for smart search
    const { hotels } = useFrontendHotels();

    const filteredTop = TOP_DESTINATIONS.filter(city => city.includes(search));

    const hotelsArray = Array.isArray(hotels) ? hotels : [];
    const normalize = (text: string) =>
        text.toLowerCase()
            .replace(/ة/g, 'ه')
            .replace(/أ|إ|آ/g, 'ا')
            .replace(/فندق/g, '') // Remove 'fandaq'
            .replace(/\b(hotel|the)\b/g, '') // Remove English particles
            .replace(/\s+/g, ' ')
            .trim();

    const filteredHotels = search.trim().length >= 2
        ? hotelsArray.filter(hotel => {
            if (!hotel || !hotel.name) return false;

            const queryTokens = normalize(search).split(' ').filter(t => t.length > 0);
            const combinedText = normalize(
                `${hotel.name} ${hotel.nameEn || ''} ${hotel.city || ''}`
            );

            return queryTokens.every(token => combinedText.includes(token));
        }).slice(0, 5) // Limit to top 5 matches
        : [];

    const filteredDestinations = DESTINATIONS.map(country => ({
        ...country,
        cities: country.cities.filter(city =>
            city.includes(search) || country.name.includes(search)
        )
    })).filter(country => country.cities.length > 0);

    const hasResults = filteredTop.length > 0 || filteredDestinations.length > 0 || filteredHotels.length > 0;

    // Auto-expand if searching
    useEffect(() => {
        if (search.trim() !== '') {
            setExpandedCountry(null);
        }
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="text-right">
                <h3 className="text-xl font-black text-secondary">اختر وجهتك</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">نغطي أغلب فنادق العالم</p>
            </div>

            {/* Search Header */}
            <div className="sticky top-0 bg-white pb-2 z-10 border-b border-slate-50 mb-2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن فندق، مدينة أو دولة..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-xs font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-gold transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                        <Search size={16} />
                    </div>
                </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto no-scrollbar scroll-smooth space-y-6 text-right" dir="rtl">
                {hasResults ? (
                    <>
                        {/* Matching Hotels (Smart Results) */}
                        {filteredHotels.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Building size={12} className="text-gold" />
                                    الفنادق المقترحة
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {filteredHotels.map(hotel => (
                                        <button
                                            key={hotel.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeSheet();
                                                navigate(`/hotel/${hotel.slug}`);
                                            }}
                                            className="w-full text-right p-3 rounded-[2rem] transition-all flex items-center justify-between group bg-white/50 hover:bg-white border border-transparent hover:border-gold/10 backdrop-blur-sm shadow-sm hover:shadow-md active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <span className="block font-black text-sm group-hover:text-gold transition-colors">{hotel.name}</span>
                                                    <span className="block text-[10px] font-bold text-slate-400">{hotel.city}</span>
                                                </div>
                                                <div className="w-12 h-12 rounded-[1.2rem] bg-slate-100 overflow-hidden border border-slate-100 group-hover:border-gold/30 transition-all shrink-0">
                                                    {hotel.image ? (
                                                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gold">
                                                            <Building size={18} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-gold/10 text-slate-400 group-hover:text-gold transition-all">
                                                <ChevronLeft size={14} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Destinations */}
                        {filteredTop.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Compass size={12} className="text-gold" />
                                    أغلب المدن حجزاً
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {filteredTop.map(city => (
                                        <button
                                            key={city}
                                            onClick={(e) => { e.stopPropagation(); setDestination(city); closeSheet(); }}
                                            className={`w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group active:scale-[0.97] ${destination === city ? 'bg-secondary text-white shadow-lg' : 'bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm'}`}
                                        >
                                            <div className={`p-2 rounded-xl ${destination === city ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-gold/10'}`}>
                                                <MapPin size={14} className={destination === city ? 'text-white' : 'text-gold'} />
                                            </div>
                                            <span className="font-black text-sm">{city}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Countries */}
                        <div className="space-y-2">
                            {filteredDestinations.map(country => {
                                const isExpanded = expandedCountry === country.code || (search.trim() !== '' && !filteredHotels.length);
                                return (
                                    <div key={country.code} className="space-y-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedCountry(expandedCountry === country.code ? null : country.code); }}
                                            className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] transition-all border ${expandedCountry === country.code ? 'bg-slate-50 border-gold/20' : 'bg-white border-transparent hover:bg-slate-50'}`}
                                        >
                                            <div className="text-slate-400">
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-sm text-secondary">{country.name}</span>
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <Globe size={14} className="text-gold" />
                                                </div>
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="grid grid-cols-1 gap-2 pr-4 border-r-2 border-slate-50 mr-4 animate-premium-popup">
                                                {country.cities.map(city => (
                                                    <button
                                                        key={city}
                                                        onClick={(e) => { e.stopPropagation(); setDestination(city); closeSheet(); }}
                                                        className={`w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group active:scale-[0.97] ${destination === city ? 'bg-secondary text-white shadow-lg' : 'bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm'}`}
                                                    >
                                                        <div className={`p-2 rounded-xl ${destination === city ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-gold/10'}`}>
                                                            <MapPin size={14} className={destination === city ? 'text-white' : 'text-gold'} />
                                                        </div>
                                                        <span className="font-black text-sm">{city}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Search size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">عذراً، لم نجد ما تبحث عنه</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DestinationList;
