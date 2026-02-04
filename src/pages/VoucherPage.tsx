import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Loader2, ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Quote, Landmark, QrCode, Sparkles } from 'lucide-react';

import { BookingsAPI, AiAPI } from '../services/api';
import { BookingStatus, BookingDetails, GuestInfo } from '../components/Voucher/types';
import { parseDateSafe } from '../contexts/SearchContext';
import VoucherHeader from '../components/Voucher/VoucherHeader';
import InfoGrid from '../components/Voucher/InfoGrid';
import ReservationBreakdown from '../components/Voucher/ReservationBreakdown';
import VoucherPolicies from '../components/Voucher/VoucherPolicies';
import SecurityWatermark from '../components/Voucher/SecurityWatermark';
import VoucherDownloadButton from '../components/Voucher/VoucherDownloadButton';

const VoucherPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
    const [status, setStatus] = useState<BookingStatus>(BookingStatus.PENDING);
    const [welcomeMessage, setWelcomeMessage] = useState('We are delighted to confirm your upcoming stay with us. Please find your booking details below. Our team is preparing everything to ensure your visit is memorable.');
    const [securityHash, setSecurityHash] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;
            try {
                const response = await BookingsAPI.getById(id);
                if (response.success && response.data) {
                    const b = response.data;

                    const checkInDate = parseDateSafe(b.checkIn);
                    const checkOutDate = parseDateSafe(b.checkOut);

                    const details: BookingDetails = {
                        reference: `RES-${b.id.substring(0, 4).toUpperCase()}-${b.id.split('-').pop()?.substring(0, 4).toUpperCase() || '8892'}`,
                        hotelName: (b as any).hotelNameEn || b.room?.hotel?.name || 'Hotel',
                        hotelAddress: (b as any).hotelAddressEn || (b as any).hotelCity || 'Saudi Arabia',
                        checkIn: checkInDate ? checkInDate.toLocaleDateString('en-GB') : '--',
                        checkOut: checkOutDate ? checkOutDate.toLocaleDateString('en-GB') : '--',
                        checkInTime: '16:00:00',
                        checkOutTime: '12:00:00',
                        roomType: (b as any).roomNameEn || (b as any).roomName || b.room?.name || 'Room',
                        nights: (checkInDate && checkOutDate)
                            ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
                            : 1,
                        totalPrice: b.totalPrice,
                        currency: 'SAR',
                        occupancy: String(b.guestsCount),
                        boardBasis: (b as any).room?.mealPlan || 'Room Only',
                        view: (b as any).room?.view || 'City View',
                        bedding: (b as any).room?.beds || (b as any).bedding || 'King Size Bed',
                        rate: b.totalPrice / (b.roomCount || 1),
                        hotelConf: 'CONF-' + Math.floor(Math.random() * 10000),
                        specialInclusions: b.specialRequests || 'None',
                        extraBedCount: b.extraBedCount || 0,
                        extraBedPrice: (b as any).room?.extraBedPrice || 0,
                    };

                    // Helper to clean enum-style strings (e.g., HALF_BOARD -> Half Board)
                    const clean = (s: string) => s && (s.includes('_') || (s === s.toUpperCase() && s.length > 3))
                        ? s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                        : s;

                    const guest: GuestInfo = {
                        firstName: b.guestName?.split(' ')[0] || 'Guest',
                        lastName: b.guestName?.split(' ').slice(1).join(' ') || '',
                        nationality: b.nationality || 'Saudi Arabia',
                        email: b.guestEmail || '',
                        phone: b.guestPhone || ''
                    };

                    let st = BookingStatus.PENDING;
                    // 🚀 STRICT RULE: Booking is PENDING until PAID.
                    // Even if status is CONFIRMED, if payment is UNPAID, show PENDING.
                    if (b.status === 'CONFIRMED') {
                        st = (b.paymentStatus === 'PAID') ? BookingStatus.CONFIRMED : BookingStatus.PENDING;
                    } else if (b.status === 'CANCELLED') {
                        st = BookingStatus.CANCELLED;
                    } else if (b.status === 'COMPLETED') {
                        st = BookingStatus.COMPLETED;
                    }

                    // 1. Initial Data Prep (Raw Data - Translation Canceled)
                    let finalBooking = {
                        ...details,
                        hotelName: details.hotelName,
                        hotelAddress: details.hotelAddress,
                        roomType: clean(details.roomType),
                        boardBasis: clean(details.boardBasis),
                        view: clean(details.view),
                        bedding: clean(details.bedding),
                    };
                    let finalGuest = { ...guest };
                    let finalStatus = st;
                    let finalWelcome = 'We are delighted to confirm your upcoming stay with us.';

                    // 2. Translation logic removed by user request.
                    // System will display original Arabic/English mix as stored in DB.

                    // 3. Fetch AI Welcome Message (Using Final Translated Data)
                    try {
                        const aiRes = await AiAPI.generateWelcome(
                            finalGuest.firstName + ' ' + finalGuest.lastName,
                            finalBooking.hotelName,
                            finalBooking.roomType
                        );
                        if (aiRes.success && aiRes.data?.message) {
                            finalWelcome = aiRes.data.message;
                        }
                    } catch (aiErr) {
                        console.error('AI Welcome Failed', aiErr);
                    }

                    // 4. Update All States at once to prevent flicker
                    setBookingDetails(finalBooking);
                    setGuestInfo(finalGuest);
                    setStatus(finalStatus);
                    setWelcomeMessage(finalWelcome);

                    // 🔐 Capture Security Integrity Hash
                    if ((b as any).securityHash) {
                        setSecurityHash((b as any).securityHash);
                    }
                } else {
                    setError('Booking not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-[#c5a059] animate-spin" />
            </div>
        );
    }

    if (error || !bookingDetails || !guestInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <p className="text-red-500 font-black text-xl">{error || 'Booking not found'}</p>
                <button onClick={() => navigate('/')} className="bg-[#1a3d2a] text-white px-8 py-3 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-transform">
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white text-slate-900" dir="ltr" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {/* Font Injection */}
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>{`
                .serif-font { font-family: 'Playfair Display', serif; }
                .tech-font { font-family: 'Space Grotesk', sans-serif; }
                .main-font { font-family: 'Plus Jakarta Sans', sans-serif; }
                
                @media print {
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .print-shadow-none { box-shadow: none !important; border: 0 !important; }
                    .a4-container { width: 210mm; min-height: 297mm; padding: 12mm !important; margin: 0 auto !important; box-shadow: none !important; }
                }

                .a4-container {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 12mm;
                    margin: 0 auto;
                    background: white;
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15);
                    position: relative;
                }
            `}</style>

            <div className="max-w-[210mm] mx-auto">
                {/* Dashboard Control Panel */}
                <div className="mb-6 flex justify-between items-center bg-[#1a3d2a] p-3 rounded-2xl shadow-xl no-print border border-white/5 relative z-50">
                    <div className="flex items-center gap-3 pl-3">
                        <div className="w-10 h-10 rounded-full bg-[#286343] flex items-center justify-center shadow-lg border border-white/10">
                            <Sparkles className="text-[#c5a059]" size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Voucher Control Panel</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Manual Status Toggles Removed to Enforce Strict Payment Rule */}

                        <div className="flex items-center gap-2">
                            {bookingDetails && (
                                <VoucherDownloadButton
                                    booking={bookingDetails}
                                    guest={guestInfo}
                                    status={status}
                                    welcomeMessage={welcomeMessage}
                                />
                            )}


                        </div>
                    </div>
                </div>

                {/* Actual A4 Container */}
                <div className="a4-container flex flex-col print-shadow-none" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
                    {/* Security Layer */}
                    <SecurityWatermark />

                    <div className="flex-grow relative z-10">
                        <VoucherHeader booking={bookingDetails} status={status} />

                        {/* AI Welcome Block */}
                        <div className="mb-4 mt-2">
                            <div className="flex items-start gap-4 text-left" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
                                <div className="text-[#e4dcc0] shrink-0 h-12 w-12 flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100/50 mt-1">
                                    <Quote size={20} fill="currentColor" />
                                </div>
                                <p className="text-[14px] text-slate-500 leading-relaxed italic font-medium text-left">
                                    <span>Dear Mr. </span>
                                    <span className="font-bold text-[#1e293b]">{guestInfo.firstName} {guestInfo.lastName}</span>
                                    <span>, it is our pleasure to formally confirm your reservation at </span>
                                    <span className="font-bold text-[#1e293b] italic">{bookingDetails.hotelName}</span>
                                    <span>. Your stay in a </span>
                                    <span className="font-bold text-[#1e293b] italic">{bookingDetails.roomType}</span>
                                    <span> for </span>
                                    <span className="font-bold text-[#1e293b] italic">{bookingDetails.nights} nights</span>
                                    <span> (from </span>
                                    <span className="font-bold text-[#1e293b] italic">{bookingDetails.checkIn}</span>
                                    <span> to </span>
                                    <span className="font-bold text-[#1e293b] italic">{bookingDetails.checkOut}</span>
                                    <span>) is officially </span>
                                    <span className={`font-black uppercase tracking-wide ${status === BookingStatus.PENDING ? 'text-amber-600' : 'text-[#286343]'}`}>
                                        {status === BookingStatus.PENDING ? 'PENDING' : 'CONFIRMED'}
                                    </span>
                                    <span>. We look forward to welcoming you soon.</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 mt-4">
                            <InfoGrid guest={guestInfo} booking={bookingDetails} />
                            <ReservationBreakdown booking={bookingDetails} status={status} />
                            <VoucherPolicies />
                        </div>
                    </div>

                    <div className="mt-auto">
                        {/* Creative Concierge Footer */}
                        <div className="mt-8 mb-0" dir="ltr">
                            {/* Digital Integrity Signature (HMAC) */}
                            {securityHash && (
                                <div className="px-8 py-2 bg-slate-50 border-x border-t border-slate-100 flex items-center justify-between rounded-t-xl opacity-60">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Digital Integrity Signature</span>
                                    <span className="text-[9px] font-mono text-slate-600 font-bold">{securityHash.match(/.{1,8}/g)?.join(' ')}</span>
                                </div>
                            )}

                            <div className="flex items-stretch py-8 px-4 border-t border-slate-100 text-left whitespace-nowrap bg-white relative z-10">
                                <div className="flex items-center gap-4 pr-6 border-r border-slate-100 h-full">
                                    <a href="https://wa.me/201018565155" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer p-1">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwa.me%2F201018565155&color=30-41-59"
                                            alt="WhatsApp QR"
                                            className="w-full h-full object-contain"
                                        />
                                    </a>
                                    <div className="flex flex-col justify-center gap-0.5">
                                        <div className="flex items-center gap-1.5 leading-none">
                                            <ShieldCheck size={12} className="text-[#c5a059]" fill="currentColor" fillOpacity={0.2} />
                                            <span className="text-[11px] font-black text-[#1e293b] uppercase tracking-wider leading-none">Secured Registry</span>
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 italic uppercase tracking-wide leading-none">System Powered by Elattal Co.</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center px-6 border-r border-slate-100 h-10">
                                    <div className="flex items-center gap-2 mb-1 leading-none">
                                        <Phone size={12} className="text-[#c5a059]" />
                                        <span className="text-[12px] font-black text-slate-800 font-mono tracking-tight leading-none">+966 2445 388 055</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">24/7 Support Line</span>
                                </div>
                                <div className="flex flex-col justify-center pl-6 h-10">
                                    <div className="flex items-center gap-2 mb-1 leading-none">
                                        <Mail size={12} className="text-[#c5a059]" />
                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">Diyafaat.khulood@outlook.sa</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Official Correspondence</span>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default VoucherPage;
