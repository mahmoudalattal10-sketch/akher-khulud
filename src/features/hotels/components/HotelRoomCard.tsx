import { Users, Maximize, BedDouble, Plus, Minus, Info, Eye, Utensils, Check, Sparkles, MessageCircle } from 'lucide-react';
import { MEAL_PLAN_LABELS } from '../../../constants/hotelConstants';
import { formatDateArabic } from '../../../contexts/SearchContext';

interface Room {
    id: string;
    name: string;
    price: number;
    capacity: number;
    size: string;
    bed: string;
    view: string;
    mealPlan: string;
    tags: string[];
    images: string[];
    inventory: number;
    allowExtraBed: boolean;
    extraBedPrice: number;
    maxExtraBeds: number;
    isVisible: boolean;
    partialMetadata?: any;
    originalIdx: number;
}

interface HotelRoomCardProps {
    group: {
        name: string;
        images: string[];
        capacity: number;
        size: string;
        bed: string;
        view: string;
        variants: Room[];
    };
    roomQuantities: Record<string, number>;
    extraBedCounts: Record<string, number>;
    onQuantityChange: (roomId: string, delta: number, max: number) => void;
    onExtraBedChange: (roomId: string, delta: number, max: number) => void;
    onBookNow: (idx: number) => void;
    hotelMainImage?: string;
    hasDates?: boolean;
    onOpenSearch?: () => void;
    onRoomSelect?: (idx: number) => void;
    selectedRoom?: number | null;
}

const HotelRoomCard: React.FC<HotelRoomCardProps> = ({
    group,
    roomQuantities,
    extraBedCounts,
    onQuantityChange,
    onExtraBedChange,
    onBookNow,
    hotelMainImage,
    hasDates,
    onOpenSearch,
    onRoomSelect,
    selectedRoom
}) => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100/80 overflow-hidden hover:shadow-md transition-all duration-300 group">
            <div className="flex flex-col lg:flex-row items-stretch min-h-[320px]">

                {/* Image Side - Order 1 in LTR (Left), but in RTL layout (which screen is primarily), 
                    if flex-row is used without dir='rtl' on container, first item is Left.
                    The screenshot shows Image on Right. 
                    In RTL document flow, the first item is Right. 
                    Assuming the app is wrapped in dir="rtl" or uses RTL utility classes.
                    Safest bet for RTL 'Image Right' is typically being the first element in DOM.
                */}
                <div className="lg:w-[32%] relative min-h-[250px] lg:min-h-full">
                    <img
                        src={group.images?.[0] || hotelMainImage}
                        alt={group.name}
                        className="absolute inset-0 w-full h-full object-cover lg:rounded-l-[2.5rem]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-2 shadow-lg">
                        <span>{group.images?.length || 1}+ صور</span>
                    </div>
                </div>

                {/* Content Side */}
                <div className="lg:w-[68%] p-6 md:p-8 flex flex-col justify-between bg-white relative">
                    <div>
                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-3 text-right tracking-tight">{group.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400 text-[11px] sm:text-[12px] font-bold">
                                <div className="flex items-center gap-1.5">
                                    <BedDouble size={14} strokeWidth={2} className="text-[#A2AAB8]" />
                                    <span>{group.bed}</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full" />
                                <div className="flex items-center gap-1.5">
                                    <Maximize size={14} strokeWidth={2} className="text-[#A2AAB8]" />
                                    <span>{group.size} م²</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full" />
                                <div className="flex items-center gap-1.5">
                                    <Users size={15} strokeWidth={2} className="text-[#A2AAB8]" />
                                    <span>حتى {group.capacity} أشخاص</span>
                                </div>
                            </div>
                        </div>

                        {/* Variants Loop */}
                        <div className="space-y-8">
                            {!hasDates && (
                                <div
                                    onClick={onOpenSearch}
                                    className="bg-[#FFFBF0] border border-[#FBEEC8] rounded-[2rem] p-4 mb-6 flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#FFF8E1] transition-colors group/alert"
                                >
                                    <div className="w-9 h-9 rounded-full bg-white border border-[#FBEEC8] text-[#D97706] flex items-center justify-center shrink-0 shadow-sm group-hover/alert:scale-110 transition-transform">
                                        <Info size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-right flex-1 mr-4">
                                        <p className="text-sm font-black text-[#78350F] mb-0.5">يرجى تحديد تاريخ الإقامة أولاً</p>
                                        <p className="text-[10px] font-bold text-[#92400E] opacity-80">انقر هنا لتحديد المواعيد وعرض الأسعار الدقيقة</p>
                                    </div>
                                </div>
                            )}

                            {group.variants.map((room) => {
                                const quantity = roomQuantities[room.id] || 0;
                                const isPartial = room.partialMetadata?.isPartial;

                                return (
                                    <div key={room.id} className="pt-2">

                                        {/* Partial Availability Banner - Exact Match */}
                                        {/* Partial Availability Banner - Premium Design */}
                                        {room.partialMetadata?.isPartial && (
                                            <div className="w-full mb-6 bg-amber-50/50 backdrop-blur-md border border-amber-200/50 rounded-xl p-3 flex flex-row items-center justify-between gap-4 shadow-sm border-r-4 border-r-amber-400 animate-in fade-in slide-in-from-top-2 duration-500">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <h5 className="text-[13px] font-black text-amber-900 leading-tight mb-0.5">متاح لفترة جزئية</h5>
                                                        <p className="text-[11px] font-bold text-amber-700/80">
                                                            من {formatDateArabic(room.partialMetadata.availableFrom)} إلى {formatDateArabic(room.partialMetadata.availableTo)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <a
                                                    href="https://wa.me/966553882445?text=مرحباً، لم أجد حجزاً للفترة الخاصة بي.."
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all active:scale-95 group/btn whitespace-nowrap"
                                                >
                                                    <span>لم تجد فترتك؟ تواصل واتساب</span>
                                                    <MessageCircle size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                                                </a>
                                            </div>
                                        )}

                                        <div className="px-1">
                                            {/* Action Row: Re-imagined for Mobile & Desktop */}
                                            {/* Action Row: Re-imagined for Mobile & Desktop */}
                                            <div className="flex flex-wrap items-end sm:items-center justify-between gap-y-4 gap-x-2 sm:gap-6 mb-6">

                                                {/* Button Section: Order 4 on Mobile (Bottom), Order 1 on Desktop (Right in RTL) */}
                                                <div className="w-full sm:w-[130px] md:w-[150px] flex-shrink-0 order-4 sm:order-1 pt-2 sm:pt-0">
                                                    {quantity === 0 ? (
                                                        <button
                                                            onClick={() => {
                                                                if (!hasDates || isPartial) {
                                                                    onOpenSearch?.();
                                                                    return;
                                                                }
                                                                onQuantityChange(room.id, 1, room.inventory);
                                                            }}
                                                            className={`w-full py-3 sm:py-3 rounded-full border text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${(!hasDates || isPartial)
                                                                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                                                : 'border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 active:scale-95'
                                                                }`}
                                                        >
                                                            <Plus className={`w-[18px] h-[18px] ${(!hasDates || isPartial) ? 'text-amber-600' : ''}`} />
                                                            <span>{isPartial ? 'تغيير التاريخ' : 'إختر'}</span>
                                                        </button>
                                                    ) : (
                                                        <div className="w-full h-[50px] bg-white border border-[#E2E8F0] rounded-full flex items-center justify-between px-2 shadow-sm">
                                                            <button
                                                                onClick={() => !isPartial && onQuantityChange(room.id, 1, room.inventory)}
                                                                className={`w-9 h-9 rounded-full text-[#10B981] flex items-center justify-center hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-30 ${isPartial ? 'cursor-not-allowed opacity-20' : ''}`}
                                                                disabled={quantity >= room.inventory || isPartial}
                                                            >
                                                                <Plus className="w-5 h-5" strokeWidth={2.5} />
                                                            </button>
                                                            <span className="font-bold text-xl text-[#0F172A] w-6 text-center pt-0.5">{quantity}</span>
                                                            <button
                                                                onClick={() => onQuantityChange(room.id, -1, room.inventory)}
                                                                className="w-9 h-9 rounded-full text-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95"
                                                                disabled={!quantity}
                                                            >
                                                                <Minus className="w-5 h-5" strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price Section: Order 1 on Mobile (Right), Order 2 on Desktop (Center) */}
                                                <div className="flex flex-col items-start sm:items-center w-auto sm:flex-1 order-1 sm:order-2">
                                                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                                                        <span className="text-3xl sm:text-4xl font-black text-[#0F172A] leading-none">{room.price}</span>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-[10px] sm:text-[11px] text-[#64748B] font-bold leading-tight">ريال / ليلة</span>
                                                            <span className="text-[10px] sm:text-[11px] text-[#64748B] font-medium leading-tight opacity-70">شامل الضريبة</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Features Section: Order 2 on Mobile (Left), Order 3 on Desktop (Left) */}
                                                <div className="flex flex-col items-end gap-1 sm:gap-2 order-2 sm:order-3 w-auto flex-shrink-0">
                                                    {/* Primary Feature: Meal Plan or First Tag */}
                                                    {room.mealPlan && room.mealPlan !== 'none' ? (
                                                        <div className="flex items-center gap-1.5 sm:gap-2 opacity-80">
                                                            <span className="text-[11px] sm:text-[13px] font-medium text-slate-600 tracking-tight leading-none">{MEAL_PLAN_LABELS[room.mealPlan]}</span>
                                                            <Utensils className="w-3.5 h-3.5 sm:w-[16px] sm:h-[16px] text-[#B48C3E]" strokeWidth={2.5} />
                                                        </div>
                                                    ) : room.tags[0] && room.tags[0] !== room.view && (
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <span className="text-[12px] sm:text-[15px] font-bold text-[#64748B] tracking-tight">{room.tags[0]}</span>
                                                        </div>
                                                    )}

                                                    {/* Secondary Feature: Room View (Hidden if it's identical to the primary tag) */}
                                                    <div className="flex items-center gap-1.5 sm:gap-2 opacity-80">
                                                        <span className="text-[10px] sm:text-[12px] font-medium text-slate-500">{room.view}</span>
                                                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" strokeWidth={2.5} />
                                                    </div>
                                                </div>

                                                {/* Extra Bed Row - Incorporated into Flex Flow */}
                                                {room.allowExtraBed && (
                                                    <div className="w-full order-3 sm:order-4 mt-2 sm:mt-4 bg-[#F8FAFC] rounded-[1.5rem] p-3 sm:p-4 flex items-center justify-between border border-[#F1F5F9] shadow-sm/50">
                                                        {/* Right: Info Section */}
                                                        <div className="flex items-center gap-2.5 sm:gap-4 text-right order-1">
                                                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white border border-[#F1F5F9] flex items-center justify-center text-[#10B981] shadow-sm">
                                                                <BedDouble className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                                                                    <h4 className="text-[13px] sm:text-[15px] font-bold text-[#0F172A]">إضافة سرير إضافي</h4>
                                                                    <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${extraBedCounts[room.id] > 0 ? 'bg-[#10B981] text-white' : 'bg-white border border-slate-100 text-[#10B981]'}`}>
                                                                        {room.extraBedPrice > 0 ? `${room.extraBedPrice} ريال` : 'مجاني'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] sm:text-[11px] font-medium text-[#94A3B8] mt-0.5 opacity-80">بحد أقصى {room.maxExtraBeds} أسرة لكل غرفة</p>
                                                            </div>
                                                        </div>

                                                        {/* Left: Modern Counter */}
                                                        <div className="bg-white border border-[#E2E8F0] rounded-xl h-9 sm:h-11 flex items-center px-1 shadow-sm order-2">
                                                            <button
                                                                onClick={() => onExtraBedChange(room.id, 1, room.maxExtraBeds)}
                                                                disabled={extraBedCounts[room.id] >= room.maxExtraBeds}
                                                                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg text-[#10B981] flex items-center justify-center hover:bg-emerald-50 transition-all disabled:opacity-20"
                                                            >
                                                                <Plus className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
                                                            </button>
                                                            <span className="font-bold text-sm sm:text-lg w-6 sm:w-8 text-center text-[#0F172A]">{extraBedCounts[room.id] || 0}</span>
                                                            <button
                                                                onClick={() => onExtraBedChange(room.id, -1, room.maxExtraBeds)}
                                                                disabled={!extraBedCounts[room.id]}
                                                                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg text-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-20"
                                                            >
                                                                <Minus className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HotelRoomCard;
