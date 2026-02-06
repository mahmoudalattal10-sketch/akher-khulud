
import React from 'react';
import { Globe } from 'lucide-react';
import { BookingDetails, GuestInfo } from './types';

interface Props { guest: GuestInfo; booking: BookingDetails; }

const InfoGrid: React.FC<Props> = ({ guest, booking }) => {
    return (
        <section className="mb-6 text-left" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
            <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* Passenger & Contact Section (Split Layout) */}
                <div className="col-span-4 flex flex-col gap-4 text-left" dir="ltr">
                    {/* Lead Passenger Card */}
                    <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] flex flex-col items-start justify-center min-h-[140px]">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none flex items-center">Lead Passenger</span>
                        <h4 className="text-[18px] font-black text-[#1e293b] uppercase leading-tight tracking-tight mb-4">{guest.firstName} {guest.lastName}</h4>

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                <Globe size={14} className="text-[#c5a059]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-tight">{guest.nationality || 'Saudi Arabia'}</span>
                        </div>
                    </div>

                    {/* Contact Info (Floating) */}
                    <div className="flex flex-col gap-3 px-2 mt-1">
                        <ContactItem label="Contact Proxy" value={guest.email} />
                        <ContactItem label="Phone Record" value={guest.phone} />
                    </div>
                </div>

                {/* Dates & Duration */}
                <div className="col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex-1 grid grid-cols-2 divide-x divide-slate-100">
                        <DateBlock label="Check-In" date={booking.checkIn} time={booking.checkInTime} />
                        <DateBlock label="Check-Out" date={booking.checkOut} time={booking.checkOutTime} />
                    </div>

                    <div className="bg-[#f8fafc] py-4 text-center border-t border-slate-100 flex items-center justify-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center">Total Stay Duration</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></div>
                        <span className="text-[11px] font-black text-[#c5a059] uppercase tracking-widest leading-none">{booking.nights} Nights</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const DateBlock = ({ label, date, time }: { label: string, date: string, time: string }) => (
    <div className="bg-white p-8 flex flex-col items-center justify-center min-h-[160px]">
        <span className="text-[10px] font-medium text-slate-300 uppercase mb-4 tracking-[0.2em] leading-none flex items-center">{label}</span>
        <p className="text-3xl font-light text-slate-950 leading-tight mb-2 tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{date}</p>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-tight">{time}</p>
    </div>
);

const ContactItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col items-start text-left">
        <span className="text-[10px] font-semibold text-slate-400 uppercase mb-1 tracking-[0.15em] leading-none flex items-center">{label}</span>
        <span className="text-[12px] font-black text-[#1e293b] break-all tech-font tracking-wide leading-tight">{value}</span>
    </div>
);

export default InfoGrid;
