import React from 'react';
import { Star, Check, Info, Tag } from 'lucide-react';
import { formatDateArabic } from '../../../contexts/SearchContext';

interface BookingSummaryProps {
    checkIn: string;
    checkOut: string;
    nights: number;
    adults: number;
    children: number;
    selectedRooms: Array<{
        name: string;
        count: number;
        price: number;
        extraBeds: number;
        extraBedPrice: number;
    }>;
    onConfirm: () => void;
    hotelRating: number;
    couponDiscount?: number;
    hasDates?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    selectedRooms,
    onConfirm,
    hotelRating,
    couponDiscount = 0,
    hasDates = false
}) => {
    // Calculate totals
    const totalRoomPrice = selectedRooms.reduce((sum, room) => sum + (room.price * room.count * nights), 0);
    const totalExtraBedsPrice = selectedRooms.reduce((sum, room) => sum + (room.extraBedPrice * room.extraBeds * room.count * nights), 0);
    const totalPrice = totalRoomPrice + totalExtraBedsPrice;

    // Discount Calculation
    const discountVal = Number(couponDiscount) || 0;
    const discountAmount = (totalPrice * discountVal) / 100;
    const priceAfterDiscount = totalPrice - discountAmount;

    // Amount to Pay (Inclusive of all fees)
    const amountToPay = priceAfterDiscount;

    const hasSelection = selectedRooms.length > 0;

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden p-6 relative">
            {/* Header - Balanced */}
            <div className="flex items-center justify-between mb-5 px-1">
                <div>
                    <span className="text-xs text-slate-400 font-bold block mb-1">المجموع لليلة</span>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-black text-secondary">
                            {hasSelection ? (amountToPay / nights).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '---'}
                        </span>
                        <span className="text-xs font-bold text-slate-500">ريال سعودي</span>
                    </div>
                </div>
                <div className="text-left flex flex-col items-end">
                    <div className="flex items-center gap-1 text-gold mb-1">
                        < Star className="fill-current" size={16} />
                        <span className="font-black text-lg">{hotelRating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">ممتاز جداً</span>
                </div>
            </div>

            {/* Dates & Guests - Compact but Readable */}
            <div className="bg-slate-50/80 rounded-2xl p-4 mb-5 border border-slate-100">
                <div className="flex items-center justify-between text-center gap-3">
                    <div className="flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">الوصول</span>
                        <span className="text-sm font-black text-secondary truncate">{formatDateArabic(checkIn)}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">المغادرة</span>
                        <span className="text-sm font-black text-secondary truncate">{formatDateArabic(checkOut)}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">الليالي</span>
                        <span className="text-sm font-black text-emerald-600 truncate">{nights} ليلة</span>
                    </div>
                </div>
                <div className="h-px bg-slate-200/60 my-3" />
                <div className="text-center">
                    <span className="text-sm font-black text-slate-700">{adults} بالغين • {children} أطفال</span>
                </div>
            </div>

            {/* Selection Status - Compact Alert */}
            {!hasDates ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Info size={14} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-black text-amber-900 leading-tight">يرجى تحديد التاريخ للمتابعة</p>
                </div>
            ) : !hasSelection ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Info size={14} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-black text-amber-900 leading-tight">لم يتم اختيار الغرفة بعد</p>
                </div>
            ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-5 flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Check size={14} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-black text-emerald-900 leading-tight">تم اختيار الغرف بنجاح</p>
                </div>
            )}

            {/* Price Breakdown - Smaller Gaps */}
            <div className="space-y-2 mb-4 px-1">
                {selectedRooms.map((room, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-bold truncate max-w-[150px]">
                            {room.count}x {room.name}
                        </span>
                        <span className="font-black text-secondary">
                            {((room.price * room.count + room.extraBedPrice * room.extraBeds * room.count) * nights).toLocaleString()} ر.س
                        </span>
                    </div>
                ))}

                {couponDiscount > 0 && (
                    <div className="flex justify-between text-[11px] text-emerald-600 bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/50">
                        <span className="font-bold flex items-center gap-1">
                            خصم خاص ({couponDiscount}%)
                        </span>
                        <span className="font-black">
                            - {((discountAmount).toLocaleString())} ر.س
                        </span>
                    </div>
                )}

                <div className="h-px bg-slate-100 my-1" />

                <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100/30">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-500">الإجمالي</span>
                        {couponDiscount > 0 && <span className="text-[9px] text-slate-400 line-through">{(totalPrice).toLocaleString()} ر.س</span>}
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-black text-secondary block leading-none">{amountToPay.toLocaleString()} ر.س</span>
                        <span className="text-[8px] text-emerald-600 font-bold">شامل الرسوم والضرائب</span>
                    </div>
                </div>
            </div>

            {/* Action Button - Compact */}
            <button
                onClick={onConfirm}
                disabled={!hasSelection}
                className={`w-full py-3.5 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                    ${hasSelection
                        ? 'bg-[#059669] text-white hover:bg-[#047857] shadow-emerald-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
                <span>تأكيد الحجز الآن</span>
                {hasSelection && <Check size={14} />}
            </button>
        </div>
    );
};

export default BookingSummary;
