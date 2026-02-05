
import React from 'react';
import { BookingDetails, BookingStatus } from './types';
import { ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import brandConfig from '../../config/brandConfig';

interface Props {
    booking: BookingDetails;
    status: BookingStatus;
}

const VoucherHeader: React.FC<Props> = ({ booking, status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case BookingStatus.CONFIRMED:
            case BookingStatus.COMPLETED:
            case BookingStatus.PENDING:
                const isConfirmed = status === BookingStatus.CONFIRMED || status === BookingStatus.COMPLETED;
                const isPending = status === BookingStatus.PENDING;

                return (
                    <header className="mb-6 relative text-left" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
                        {/* Main Header Row */}
                        <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                            {/* Logo Section */}
                            <div className="flex items-center">
                                <img
                                    src={brandConfig.logo.primary}
                                    alt={brandConfig.brandName}
                                    className="h-24 w-auto object-contain"
                                // crossOrigin="anonymous" // Removed as local assets don't need this, unless using external URL in config
                                />
                            </div>

                            {/* Right Section: Status & Reference */}
                            <div className="flex flex-col items-end gap-3 text-right" dir="ltr">
                                {/* Status Badge - Pill Shape */}
                                <div
                                    className={`flex items-center pl-3 pr-6 h-10 rounded-full border ${isConfirmed
                                        ? 'border-[#059669]/30 bg-[#f0fdf4]'
                                        : 'border-amber-500 bg-amber-50'
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-2.5 shrink-0 ${isConfirmed ? 'bg-[#10b981]/20' : 'bg-amber-100'}`}>
                                        {isConfirmed ? (
                                            <CheckCircle className="w-3.5 h-3.5 text-[#059669]" strokeWidth={3} />
                                        ) : (
                                            <Clock className="w-3.5 h-3.5 text-amber-600" strokeWidth={3} />
                                        )}
                                    </div>
                                    <span
                                        className={`text-[12px] font-black uppercase tracking-widest leading-none h-full flex items-center ${isConfirmed ? 'text-[#064e3b]' : 'text-amber-900'
                                            }`}
                                    >
                                        {status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Reference */}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">REFERENCE:</span>
                                    <span className="text-[16px] font-black text-slate-900 tech-font tracking-tight leading-none">{booking.reference}</span>
                                </div>
                            </div>
                        </div>

                        {/* Centered Verified Badge - Sitting on the line */}
                        <div className="absolute -bottom-[15px] left-1/2 -ml-[110px] w-[220px] z-10" dir="ltr">
                            <div className="bg-white px-4 py-1.5 border border-slate-100 rounded-full shadow-sm flex items-center justify-center gap-2">
                                <ShieldCheck size={12} className="text-[#c5a059]" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none whitespace-nowrap">Verified Tourism Partner</span>
                            </div>
                        </div>
                    </header>
                );
            default:
                return null; // Or handle other statuses
        }
    };

    return getStatusConfig();
};

export default VoucherHeader;
