
import React from 'react';
import { BookingDetails, BookingStatus } from './types';
import { Users, Bed, CheckCircle2, Hash, Sparkles, Navigation, Eye, Utensils } from 'lucide-react';

interface Props { booking: BookingDetails; status: BookingStatus; }

const ReservationBreakdown: React.FC<Props> = ({ booking, status }) => {
    return (
        <section className="mb-4 px-1 text-left" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
            {/* Luxury Property Header Card */}
            <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#c5a059]/5 to-transparent rounded-2xl blur opacity-25"></div>
                <div className="relative bg-[#fdfdfd] border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pattern -mr-8 -mt-8 rotate-12 opacity-50"></div>

                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-[2px] w-6 bg-[#c5a059]"></div>
                                <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] leading-none flex items-center">Property Asset</span>
                            </div>

                            <h3 className="serif-font text-3xl font-medium text-[#1a3d2a] leading-tight mb-3">
                                {booking.hotelName}
                            </h3>

                            <div className="flex items-center gap-2.5 text-slate-500">
                                <Navigation size={12} className="text-[#c5a059]" />
                                <p className="text-[11px] font-bold uppercase tracking-wide">
                                    {booking.hotelAddress}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end mt-1">
                            <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex flex-col items-center min-w-[100px] shadow-sm">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Asset ID</span>
                                <div className="flex items-center gap-2">
                                    <Hash size={14} className="text-[#c5a059]" />
                                    <span className="text-[16px] font-bold tech-font text-slate-900 tracking-tight">
                                        {booking.reference.split('-')[2] || '8892'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 items-stretch">
                <div className="col-span-7">
                    <div className="mb-6 pl-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] leading-none flex items-center">Accommodation Tier</span>
                        </div>
                        <h4 className="serif-font text-xl font-semibold text-slate-900 border-b border-slate-100 pb-3">
                            {booking.roomType}
                        </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 pl-2">
                        <SmartSpec icon={<Users />} label="Capacity" value={`${booking.occupancy} Guests`} />
                        <SmartSpec icon={<Bed />} label="Bedding" value={booking.bedding} />
                        <SmartSpec icon={<Utensils />} label="Board" value={booking.boardBasis} />
                        <SmartSpec icon={<Eye />} label="View" value={booking.view || 'Haram'} />
                    </div>
                </div>

                <div className="col-span-5">
                    <div className="bg-[#1a3d2a] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
                        <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100/40">Financial Ledger</span>
                            </div>
                            {(() => {
                                const extraBedTotal = (booking.extraBedCount || 0) * (booking.extraBedPrice || 0) * booking.nights;
                                const baseValue = booking.totalPrice - extraBedTotal;

                                return (
                                    <>
                                        <PriceRow label="Base Value" value={baseValue} curr={booking.currency} />
                                        {(booking.extraBedCount || 0) > 0 && (
                                            <PriceRow
                                                label={`Extra Bed (x${booking.extraBedCount})`}
                                                value={extraBedTotal}
                                                curr={booking.currency}
                                            />
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex flex-col items-start px-1">
                                <span className="text-[9px] font-black text-[#c5a059] uppercase tracking-widest mb-1 leading-none flex items-center">Final Settlement</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-black tech-font text-white tracking-tighter py-0.5">
                                        {booking.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[12px] font-bold text-[#c5a059] uppercase self-center">{booking.currency}</span>
                                </div>
                                <span className="text-[8px] font-medium text-emerald-100/50 uppercase tracking-wider mt-1.5 leading-tight">Includes Taxes & Fees</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SmartSpec = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-4 text-left" dir="ltr">
        <div className="p-2.5 bg-slate-50/80 rounded-xl text-[#c5a059] shrink-0 border border-slate-100 flex items-center justify-center h-10 w-10">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 14 })}
        </div>
        <div className="flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-300 uppercase leading-tight mb-1 tracking-widest">{label}</span>
            <span className="text-[12px] font-bold text-slate-700 leading-tight uppercase tech-font">{value}</span>
        </div>
    </div>
);

const PriceRow = ({ label, value, curr }: { label: string, value: number, curr: string }) => (
    <div className="flex justify-between items-center text-left mb-2.5 last:mb-0" dir="ltr">
        <span className="text-[10px] font-bold text-[#a7c4b5] uppercase tracking-wider leading-tight">{label}</span>
        <span className="text-[12px] font-bold text-white tech-font leading-tight">
            {curr} {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
    </div>
);

export default ReservationBreakdown;
