import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Check, ChevronRight, ChevronLeft, Calendar, User, Mail, Phone, Lock, UserPlus,
    Shield, MapPin, Hotel, Star, ArrowLeft, ShieldCheck, Loader2, ChevronDown, Globe, Search, Plus, Minus, BedDouble,
    Maximize, Eye, Users, Percent, CheckCircle2, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUNTRIES } from '../constants';
import { useSearch, formatDateArabic, formatDateISO } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import { createPaymentPage } from '../services/paytabs';
import { HotelsAPI, BookingsAPI, AuthAPI, CouponsAPI, Hotel as HotelType, Room, TokenManager } from '../services/api';

const BookingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { searchData, initializeForBooking } = useSearch();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hotel, setHotel] = useState<HotelType | null>(null);
    const [isFetchingHotel, setIsFetchingHotel] = useState(true);
    const priceSummaryRef = useRef<HTMLDivElement>(null);

    // Ensure search dates are initialized if user lands here directly
    useEffect(() => {
        initializeForBooking();
    }, []);

    // Get initial extra bed count and room count from state
    const state = location.state as {
        roomId?: string;
        price?: number;
        roomIdx?: number;
        extraBedCount?: number;
        roomCount?: number;
        checkIn?: string;
        checkOut?: string;
    } | null;
    const [extraBedCount, setExtraBedCount] = useState(state?.extraBedCount || searchData.extraBeds || 0);
    const [roomCount, setRoomCount] = useState(state?.roomCount || 1);

    // Guest form data
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [nationality, setNationality] = useState('');
    const [password, setPassword] = useState(''); // For registration
    const { user: authUser, login: authLogin, logout: authLogout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);

    // Sync local isLoggedIn with auth context and pre-fill data
    useEffect(() => {
        setIsLoggedIn(!!authUser);
        if (authUser) {
            if (authUser.email) setGuestEmail(authUser.email);
            if (authUser.name) setGuestName(authUser.name);
            if (authUser.phone) {
                // Try to strip dial code if present or just set it
                const phone = authUser.phone.replace(/^\+\d+/, '');
                setGuestPhone(phone);
            }
        }
    }, [authUser]);

    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default SA
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] = useState(false);
    const [nationalitySearch, setNationalitySearch] = useState('');

    const filteredCountries = COUNTRIES.filter(c =>
        c.name.includes(countrySearch) || c.dial_code.includes(countrySearch) || c.code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const filteredNationalities = COUNTRIES.filter(c =>
        c.name.includes(nationalitySearch) || c.code.toLowerCase().includes(nationalitySearch.toLowerCase())
    );

    // Coupon State
    const [couponCode, setCouponCode] = useState((state as any)?.promoCode || searchData.promoCode || '');
    const [couponDiscount, setCouponDiscount] = useState((state as any)?.couponDiscount || searchData.couponDiscount || 0); // Percentage
    const [isCouponApplied, setIsCouponApplied] = useState((!!(state as any)?.promoCode) || (!!searchData.couponDiscount && searchData.couponDiscount > 0));
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(
        (state as any)?.promoCode
            ? `تم تطبيق خصم ${(state as any)?.couponDiscount}% مسبقاً`
            : (!!searchData.couponDiscount ? `تم تطبيق خصم ${searchData.couponDiscount}% مسبقاً` : '')
    );
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
    const [showCouponInput, setShowCouponInput] = useState(false);

    // Dynamic Account Check State
    const [emailExists, setEmailExists] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [hasCheckedEmail, setHasCheckedEmail] = useState(false);

    // Real-time Email Verification
    useEffect(() => {
        if (isLoggedIn) return; // Skip if already logged in

        const checkEmail = async () => {
            if (!guestEmail.trim() || !guestEmail.includes('@')) {
                setEmailExists(false);
                setHasCheckedEmail(false);
                return;
            }

            setIsCheckingEmail(true);
            try {
                const res = await AuthAPI.checkEmail(guestEmail.trim());
                if (res.success && res.data) {
                    setEmailExists(res.data.exists);
                    setHasCheckedEmail(true);
                    // Proactive UX: if email exists, hint them
                    if (res.data.exists) {
                        setError(''); // Clear previous "account doesn't exist" errors if any
                    }
                }
            } catch (err) {
                console.error('Email check failed', err);
            } finally {
                setIsCheckingEmail(false);
            }
        };

        // Reset check status while typing to hide password field immediately
        setHasCheckedEmail(false);

        const timer = setTimeout(checkEmail, 600); // 600ms debounce
        return () => clearTimeout(timer);
    }, [guestEmail, isLoggedIn]);

    // Fetch Hotel & User Data
    useEffect(() => {
        const loadData = async () => {
            setIsFetchingHotel(true);
            try {
                // 1. Fetch Hotel
                if (id) {
                    const response = await HotelsAPI.getById(id);
                    if (response.success && response.data) {
                        setHotel(response.data);
                    } else {
                        setError('لم يتم العثور على الفندق');
                    }
                }

                // 2. Check Auth & Profile
                if (AuthAPI.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const profile = await AuthAPI.profile();
                    if (profile.success && profile.data?.user) {
                        // User requested empty fields
                        // setGuestName(profile.data.user.name);
                        // setGuestEmail(profile.data.user.email);
                        // setGuestPhone(profile.data.user.phone || '');
                    }
                }
            } catch (err) {
                console.error('Failed to load data', err);
                setError('حدث خطأ في تحميل البيانات');
            } finally {
                setIsFetchingHotel(false);
            }
        };

        loadData();
    }, [id]);

    // Find the specific room
    const selectedRoom = hotel?.rooms?.find(r => r.id === state?.roomId) || hotel?.rooms?.[0];

    const roomType = selectedRoom?.name || 'غرفة ديلوكس';
    const basePricePerNight = state?.price || selectedRoom?.price || hotel?.basePrice || 0;
    const extraBedPriceTotal = (extraBedCount > 0 && selectedRoom?.allowExtraBed) ? ((selectedRoom.extraBedPrice || 0) * extraBedCount) : 0;

    const pricePerNight = (basePricePerNight * roomCount) + extraBedPriceTotal;

    // Check if dates are overridden in state (for partial matches)
    const effectiveCheckIn = state?.checkIn ? new Date(state.checkIn) : searchData.checkIn;
    const effectiveCheckOut = state?.checkOut ? new Date(state.checkOut) : searchData.checkOut;

    const nights = (effectiveCheckIn && effectiveCheckOut)
        ? Math.ceil((effectiveCheckOut.getTime() - effectiveCheckIn.getTime()) / (1000 * 60 * 60 * 24))
        : (searchData.nights || 1);

    const subtotal = pricePerNight * nights;

    // Calculate Discount
    const discountValue = isCouponApplied ? (subtotal * couponDiscount / 100) : 0;
    const totalPrice = subtotal - discountValue;

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const validateForm = () => {
        if (!guestName.trim()) {
            setError('الرجاء إدخال الاسم');
            return false;
        }
        if (!guestEmail.trim() || !guestEmail.includes('@')) {
            setError('الرجاء إدخال بريد إلكتروني صحيح');
            return false;
        }
        if (!guestPhone.trim() || guestPhone.length < 9) {
            setError('الرجاء إدخال رقم هاتف صحيح');
            return false;
        }
        if (!nationality.trim()) {
            setError('الرجاء اختيار الجنسية');
            return false;
        }
        if (!isLoggedIn && !emailExists && !password.trim()) {
            setError('الرجاء إدخال كلمة مرور لإنشاء الحساب');
            return false;
        }
        setError('');
        return true;
    };

    const handleVerifyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsCheckingCoupon(true);
        setCouponError('');
        setCouponSuccess('');

        try {
            const res = await CouponsAPI.verify(couponCode, hotel?.id);

            if (res.success && res.data) {
                setCouponDiscount(res.data.discount);
                setIsCouponApplied(true);
                setCouponSuccess(`تم تطبيق خصم ${res.data.discount}% بنجاح!`);
                setShowCouponInput(false);

                // 🎉 ADVANCED CELEBRATION EFFECT (The "WOW" Factor)
                const end = Date.now() + 3 * 1000;
                const colors = ['#D4AF37', '#FFD700', '#F0E68C', '#ffffff']; // Gold & White Theme

                (function frame() {
                    confetti({
                        particleCount: 4,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors,
                        zIndex: 2000
                    });
                    confetti({
                        particleCount: 4,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors,
                        zIndex: 2000
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());

                // Big Center Burst for immediate impact
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: colors,
                    zIndex: 2000,
                    scalar: 1.2
                });

                // 📜 Smooth Scroll to Summary
                setTimeout(() => {
                    priceSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);

            } else {
                setCouponError(res.error || 'الكوبون غير صالح أو لا ينطبق على هذا الفندق');
                setIsCouponApplied(false);
                setCouponDiscount(0);
            }
        } catch (err) {
            setCouponError('حدث خطأ أثناء التحقق من الكوبون');
        } finally {
            setIsCheckingCoupon(false);
        }
    };

    const handlePayment = async () => {
        if (!validateForm() || !hotel) return;

        setIsLoading(true);
        setError('');

        try {
            // 1. Smart Register/Auth Logic
            if (!isLoggedIn) {
                // Scenario A: Existing Email -> Skip Registration (Backend will link by email)
                if (emailExists) {
                    console.log('Existing email detected, proceeding as guest-link-booking');
                    // No action needed here, we just don't try to register/login
                }
                // Scenario B: New Email -> Register
                else {
                    let currentToken = '';
                    let currentUser = null;

                    const registerRes = await AuthAPI.register({
                        name: guestName.trim(),
                        email: guestEmail.trim(),
                        phone: `${selectedCountry.dial_code}${guestPhone}`,
                        password: password,
                        country: selectedCountry.name
                    });

                    if (registerRes.success && registerRes.data) {
                        currentToken = registerRes.data.token;
                        currentUser = registerRes.data.user;

                        // Sync with Global Auth Context
                        TokenManager.set(currentToken);
                        authLogin(currentToken, currentUser);
                    } else {
                        // If somehow it fails with "already registered" between check and submit
                        if (registerRes.error?.includes('already exists')) {
                            console.log('Email registered during checkout, proceeding with linking');
                        } else {
                            throw new Error(registerRes.error || 'فشل إنشاء الحساب');
                        }
                    }
                }
            }

            // 2. Create Booking on Backend
            const roomId = selectedRoom?.id;

            if (!roomId) {
                throw new Error('لا توجد غرف متاحة للحجز حالياً');
            }

            const bookingRes = await BookingsAPI.create({
                roomId: roomId,
                checkIn: effectiveCheckIn ? formatDateISO(effectiveCheckIn) : formatDateISO(new Date()),
                checkOut: effectiveCheckOut ? formatDateISO(effectiveCheckOut) : formatDateISO(new Date(Date.now() + 86400000)),
                guestsCount: searchData.adults || 2,
                roomCount: roomCount,
                extraBedCount: extraBedCount,
                guestName: guestName,
                guestEmail: guestEmail.trim(),
                guestPhone: `${selectedCountry.dial_code}${guestPhone}`,
                nationality: nationality,
                specialRequests: '',
                promoCode: isCouponApplied ? couponCode : undefined // <--- Pass Promo Code
            });

            if (!bookingRes.success || !bookingRes.data) {
                throw new Error(bookingRes.error || 'فشل إنشاء الحجز');
            }

            const bookingId = bookingRes.data.id;

            // 3. Initiate Payment (PayTabs)
            const cartId = bookingId;
            const callbackUrl = `${window.location.origin}/#/payment/callback`;
            const returnUrl = `${window.location.origin}/#/payment/callback`;

            const redirectUrl = await createPaymentPage({
                cart_id: cartId,
                cart_description: `حجز ${hotel.name} - ${nights} ليالي`,
                cart_currency: 'SAR',
                cart_amount: totalPrice,
                customer_details: {
                    name: guestName,
                    email: guestEmail,
                    phone: `${selectedCountry.dial_code}${guestPhone}`,
                    street1: 'المملكة العربية السعودية',
                    city: 'الرياض',
                    state: 'المنطقة الوسطى',
                    country: selectedCountry.code || 'SA',
                    ip: '1.1.1.1'
                },
                callback: callbackUrl,
                return: returnUrl,
            });

            // Redirect to PayTabs payment page
            window.location.href = redirectUrl;

        } catch (err: any) {
            console.error('Payment/Booking Error:', err);
            setError(err.message || 'حدث خطأ في عملية الحجز. يرجى المحاولة مرة أخرى.');
            setIsLoading(false);
        }
    };

    if (isFetchingHotel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
                <p className="text-slate-500 font-bold">عذراً، لم يتم العثور على الفندق المطلوب</p>
                <button onClick={() => navigate('/')} className="text-text font-bold">العودة للرئيسية</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-cairo text-text pb-20 md:pt-32">
            {/* Header - Premium Refined Style */}
            <header className="fixed top-0 left-0 right-0 z-[1001] h-20 bg-white/90 backdrop-blur-2xl border-b border-slate-100/50 transition-all duration-500 shadow-sm">
                <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
                    {/* Right Side: Brand & Back Action */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="transition-all active:scale-95 shrink-0">
                            <img src="/assets/images/ui/logo.png" alt="Logo" className="h-16 w-auto" />
                        </Link>

                        <div className="hidden sm:block h-8 w-px bg-slate-100 mx-2" />

                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2.5 bg-secondary text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-secondary/10 hover:bg-gold transition-all active:scale-95 group font-black text-sm"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            <span>العودة</span>
                        </button>
                    </div>

                    {/* Center: Progress / Title */}
                    <div className="hidden md:flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            <h1 className="font-black text-lg text-secondary tracking-tight whitespace-nowrap">إتمام الحجز الآمن</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={10} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">
                                {hotel?.name}
                            </span>
                        </div>
                    </div>

                    {/* Left Side: Professional Support */}
                    <a
                        href="https://wa.me/966553882445"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">دعم ضيافة خلود</span>
                            <span dir="ltr" className="text-xs font-black text-secondary tracking-tighter inline-block">+966 55 388 2445</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-gold">
                            <Phone size={18} />
                        </div>
                    </a>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Stepper - Modern Minimalist Progress */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">الخطوة {step} من 2</span>
                            <h2 className="text-xl font-black text-secondary">{step === 1 ? 'تأكيد تفاصيل الإقامة' : 'بيانات الضيف والدفع'}</h2>
                        </div>
                        <div className="flex -space-x-1 rtl:space-x-reverse">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 border-slate-50 transition-all duration-500 shadow-sm ${step >= s ? 'bg-secondary text-white scale-110 z-10' : 'bg-white text-slate-300'
                                        }`}
                                >
                                    {step > s ? <Check size={16} strokeWidth={3} /> : s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary rounded-full transition-all duration-700 ease-ios"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">

                    {/* Step 1: Summary */}
                    {step === 1 && hotel && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Hotel Preview Card - High Contrast Premium */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col sm:flex-row gap-6 group hover:border-gold/30 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-gold/10 transition-colors"></div>

                                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 shadow-inner relative z-10">
                                    <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="hotel" />
                                </div>
                                <div className="relative z-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <Star size={10} fill="currentColor" />
                                            <span>{hotel.rating} ممتاز</span>
                                        </div>
                                        <div className="w-px h-3 bg-slate-200" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">إقامة موثقة</span>
                                    </div>
                                    <h2 className="font-black text-secondary text-2xl mb-2 leading-tight tracking-tight">{hotel.name}</h2>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-100">
                                        <MapPin size={14} className="text-secondary" />
                                        <span>{hotel.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details - Receipt Style Redesign */}
                            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden">
                                {/* Header Strip */}
                                <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex items-center justify-between">
                                    <h3 className="font-black text-secondary text-lg flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-gold rounded-full" />
                                        تفاصيل الحجز
                                    </h3>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                        رقم المرجع: #{Math.random().toString(36).substr(2, 6).toUpperCase()}
                                    </div>
                                </div>

                                <div className="p-8">
                                    {/* 1. Timeline Section - Top */}
                                    <div className="bg-secondary rounded-[1.5rem] p-6 text-white mb-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                                            {/* Check In */}
                                            <div className="text-center md:text-right flex-1">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-70">تاريخ الوصول</span>
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gold">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <span className="font-black text-2xl tracking-tight">{formatDateArabic(searchData.checkIn)}</span>
                                                </div>
                                            </div>

                                            {/* Duration Pill */}
                                            <div className="flex flex-col items-center px-8 relative">
                                                <div className="h-px w-full bg-white/10 absolute top-1/2 -translate-y-1/2 md:block hidden" />
                                                <div className="bg-gold text-secondary px-5 py-2 rounded-full text-sm font-black shadow-lg shadow-gold/20 relative z-10 whitespace-nowrap">
                                                    {nights} ليالي
                                                </div>
                                            </div>

                                            {/* Check Out */}
                                            <div className="text-center md:text-left flex-1">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-70">تاريخ المغادرة</span>
                                                <div className="flex items-center justify-center md:justify-end gap-3 flex-row-reverse md:flex-row">
                                                    <span className="font-black text-2xl tracking-tight">{formatDateArabic(searchData.checkOut)}</span>
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gold">
                                                        <ArrowLeft size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {/* Room Block */}
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <Hotel size={24} />
                                            </div>
                                            <div>
                                                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">الوحدة المحجوزة</span>
                                                <h4 className="text-base font-black text-secondary mb-2">{roomType}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
                                                        {selectedRoom?.view || 'إطلالة مدينة'}
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
                                                        {selectedRoom?.beds || 'أسرة ملكية'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guests Block */}
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">الضيوف</span>
                                                <h4 className="text-base font-black text-secondary mb-2">
                                                    {searchData.adults || 2} بالغين
                                                    {searchData.children > 0 && <span className="mx-1">و {searchData.children} أطفال</span>}
                                                </h4>
                                                <div className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100 inline-block">
                                                    {roomCount} غرف
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Extra Bed Row (Conditional) */}
                                    {(selectedRoom?.allowExtraBed && extraBedCount > 0) && (
                                        <div className="mb-8 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 shadow-sm flex items-center justify-center">
                                                    <BedDouble size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-black text-secondary">سرير إضافي</span>
                                                    <span className="text-[10px] font-bold text-slate-400">تمت الإضافة للغرفة</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-black text-secondary">{extraBedCount}x</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Invoice Section */}
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                                        <div className="space-y-4 relative z-10">
                                            {/* Line Item: Room Rate */}
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-slate-500">سعر الغرفة <span className="text-xs font-normal opacity-70">({nights} ليالي)</span></span>
                                                <span className="font-black text-secondary">{((basePricePerNight * roomCount) * nights).toLocaleString()} ر.س</span>
                                            </div>

                                            {/* Line Item: Extra Bed */}
                                            {extraBedCount > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-slate-500">
                                                        سرير إضافي <span className="text-xs font-normal opacity-70">({extraBedCount}x)</span>
                                                    </span>
                                                    <span className={`font-black ${((selectedRoom?.extraBedPrice || 0) * extraBedCount * nights) > 0 ? "text-secondary" : "text-emerald-600"}`}>
                                                        {((selectedRoom?.extraBedPrice || 0) * extraBedCount * nights) > 0
                                                            ? `${((selectedRoom?.extraBedPrice || 0) * extraBedCount * nights).toLocaleString()} ر.س`
                                                            : 'مجاني'
                                                        }
                                                    </span>
                                                </div>
                                            )}

                                            {/* Line Item: Discount (if valid) */}
                                            {isCouponApplied && couponDiscount > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-emerald-600 flex items-center gap-2">
                                                        <Percent size={14} />
                                                        خصم كوبون ({couponDiscount}%)
                                                    </span>
                                                    <span className="font-black text-emerald-600">- {discountValue.toLocaleString()} ر.س</span>
                                                </div>
                                            )}

                                            {/* Line Item: Fees */}
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-slate-500">الرسوم والضرائب</span>
                                                <span className="font-black text-emerald-600 text-xs bg-emerald-100/50 px-2 py-1 rounded-md">مشمولة</span>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-slate-300 my-4" />

                                            {/* Total */}
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المجموع الكلي</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-black text-secondary tracking-tight">{totalPrice.toLocaleString()}</span>
                                                        <span className="text-sm font-bold text-slate-500">ر.س</span>
                                                    </div>
                                                </div>

                                                {/* Action Button Integrated */}
                                                <button
                                                    onClick={handleNext}
                                                    className="bg-secondary hover:bg-gold text-white px-8 py-3 rounded-xl font-black text-sm shadow-xl shadow-secondary/10 hover:shadow-gold/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                                                >
                                                    <span>تأكيد ومتابعة</span>
                                                    <ArrowLeft size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Decorative Background Pattern */}
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                            <img src="/assets/images/ui/logo-icon.png" className="w-32" alt="" />
                                        </div>
                                    </div>

                                    {/* Security Note */}
                                    <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
                                        <ShieldCheck size={14} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400">حجز آمن وموثق 100%</span>
                                    </div>
                                </div>
                            </div>                        </div>
                    )}
                    {/* Step 2: Customer Identity & Security Payment */}
                    {step === 2 && hotel && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Trust & Security Banner */}
                            <div className="bg-secondary text-white p-6 rounded-[2rem] shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-colors"></div>
                                <div className="relative z-10 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gold">
                                        <Shield size={28} className="animate-pulse-slow" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg mb-1 tracking-tight">تأمين الحجز المتقدم</h4>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed">
                                            بياناتك محمية بتشفير عالي المستوى وتتم معالجتها عبر <span className="text-white">بوابات دفع عالمية</span> معتمدة ومؤمنة.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Guest Form */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-6 bg-gold rounded-full" />
                                    <h3 className="font-black text-secondary text-lg">
                                        {isLoggedIn ? 'التحقق من بيانات المسافر' : 'تسجيل حساب ضيافة موثق'}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">الاسم الكامل ثلاثي *</label>
                                        <div className="relative group/field">
                                            <input
                                                type="text"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                                placeholder="مثال: محمد بن ناصر بن عبد العزيز"
                                            />
                                            <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                        </div>
                                    </div>

                                    {/* Nationality Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">الجنسية *</label>
                                        <div className="relative group/field">
                                            <button
                                                onClick={() => setIsNationalityDropdownOpen(!isNationalityDropdownOpen)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 text-right flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {nationality ? (
                                                        <>
                                                            <img
                                                                src={COUNTRIES.find(c => c.name === nationality)?.flag}
                                                                alt=""
                                                                className="w-6 h-4 object-cover rounded shadow-sm"
                                                            />
                                                            <span>{nationality}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-300">اختر الجنسية</span>
                                                    )}
                                                </div>
                                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isNationalityDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isNationalityDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-[1050]" onClick={() => setIsNationalityDropdownOpen(false)}></div>
                                                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[1051] overflow-hidden animate-fade-in">
                                                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 relative">
                                                            <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="ابحث عن الجنسية..."
                                                                className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-black focus:outline-none focus:ring-2 focus:ring-gold/20 text-right text-secondary"
                                                                value={nationalitySearch}
                                                                onChange={(e) => setNationalitySearch(e.target.value)}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 text-right">
                                                            {filteredNationalities.map((country) => (
                                                                <button
                                                                    key={country.code}
                                                                    onClick={() => {
                                                                        setNationality(country.name);
                                                                        setIsNationalityDropdownOpen(false);
                                                                        setNationalitySearch('');
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs transition-all duration-200 group/item ${nationality === country.name
                                                                        ? 'bg-secondary text-white'
                                                                        : 'text-slate-600 hover:bg-slate-50 text-right'
                                                                        }`}
                                                                >
                                                                    <img src={country.flag} alt={country.code} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                                                                    <span className="font-black">{country.name}</span>
                                                                </button>
                                                            ))}
                                                            {filteredNationalities.length === 0 && (
                                                                <div className="p-4 text-center text-slate-400 text-xs font-bold">
                                                                    لم يتم العثور على نتائج
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <Globe size={18} className="absolute left-6 top-[22px] text-slate-300 group-focus-within/field:text-gold transition-colors z-20 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Email Field - Hidden for Logged in Users */}
                                    {!isLoggedIn && (
                                        <div className="space-y-2 animate-fade-in">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">البريد الإلكتروني (لتسجيل حسابك في الموقع وحفظ حجوزاتك) *</label>
                                            <div className="relative group/field">
                                                <input
                                                    type="email"
                                                    value={guestEmail}
                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                    autoComplete="off"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300 text-left dir-ltr"
                                                    placeholder="name@example.com"
                                                />
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                                                    {isCheckingEmail ? (
                                                        <Loader2 size={18} className="text-gold animate-spin" />
                                                    ) : (
                                                        <Mail size={18} className="text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Linked Account Explanation - Show when email exists or logged in */}
                                    {(isLoggedIn || emailExists) && (
                                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[11px] font-black text-emerald-700">
                                                    {isLoggedIn ? 'أنت مسجل دخولك بالفعل' : 'هذا البريد مسجل مسبقاً'}
                                                </p>
                                                <p className="text-[10px] font-bold text-emerald-600/70">
                                                    سيتم ربط هذا الحجز بحسابك المرتبط بـ: {isLoggedIn ? authUser?.email : guestEmail}
                                                </p>
                                            </div>

                                            <button
                                                onClick={async () => {
                                                    if (isLoggedIn) {
                                                        // 🔓 SILENT LOGOUT: Clear local state ONLY without redirecting away from booking
                                                        try {
                                                            await AuthAPI.logout(); // This clears the token & calls backend
                                                        } catch (e) {
                                                            TokenManager.remove(); // Fallback
                                                        }
                                                        // Update local contexts/states
                                                        authLogout();
                                                        setIsLoggedIn(false);
                                                        setGuestEmail('');
                                                        setGuestName('');
                                                        setGuestPhone('');
                                                        setEmailExists(false);
                                                        setHasCheckedEmail(false);
                                                    } else {
                                                        setGuestEmail('');
                                                        setEmailExists(false);
                                                        setHasCheckedEmail(false);
                                                    }
                                                }}
                                                className="shrink-0 text-[10px] font-black bg-white/50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-100/50 hover:bg-emerald-100 transition-all active:scale-95"
                                            >
                                                {isLoggedIn ? 'تسجيل الخروج' : 'تغيير البريد'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Password Field - Only show for NEW users who are NOT logged in and AFTER check is complete */}
                                    {(!isLoggedIn && hasCheckedEmail && !emailExists) && (
                                        <div className="space-y-2 animate-fade-in mb-4">
                                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest mr-1 flex items-center gap-2">
                                                إنشاء كلمة مرور (سيتم إنشاء حساب لك آلياً لتتمكن من الوصول إلى حجوزاتك) *
                                                <span className="text-[9px] text-indigo-600 lowercase bg-indigo-50 px-2 py-0.5 rounded-full font-bold">حساب جديد</span>
                                            </label>
                                            <div className="relative group/field">
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    autoComplete="new-password"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                                    placeholder="اختر كلمة مرور قوية لحماية حسابك"
                                                />
                                                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone Number Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">رقم الجوال (لإرسال الفوتشر والتواصل فوراً عبر الواتساب) *</label>
                                        <div className="flex gap-3" dir="ltr">
                                            <div className="relative shrink-0">
                                                <button
                                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 h-full flex items-center gap-3 hover:bg-slate-100 transition-all duration-300 min-w-[120px] justify-between group/country active:scale-95"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <img src={selectedCountry.flag} alt={selectedCountry.code} className="w-6 rounded-sm shadow-sm" />
                                                        <span className="font-black text-secondary text-sm">{selectedCountry.dial_code}</span>
                                                    </div>
                                                    <ChevronDown size={14} className="text-slate-400 group-hover:text-gold transition-colors" />
                                                </button>

                                                {isCountryDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-[1050]" onClick={() => setIsCountryDropdownOpen(false)}></div>
                                                        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[1051] overflow-hidden animate-fade-in">
                                                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 relative">
                                                                <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="ابحث عن الدولة..."
                                                                    className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-black focus:outline-none focus:ring-2 focus:ring-gold/20 text-right text-secondary"
                                                                    value={countrySearch}
                                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                                    autoFocus
                                                                />
                                                            </div>
                                                            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                                                                {filteredCountries.map((country) => (
                                                                    <button
                                                                        key={country.code}
                                                                        onClick={() => {
                                                                            setSelectedCountry(country);
                                                                            setIsCountryDropdownOpen(false);
                                                                            setCountrySearch('');
                                                                        }}
                                                                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition-all duration-200 group/item ${selectedCountry.code === country.code
                                                                            ? 'bg-secondary text-white'
                                                                            : 'text-slate-600 hover:bg-slate-50'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <img src={country.flag} alt={country.code} className="w-5 rounded-sm shadow-sm" />
                                                                            <span className="font-black">{country.name}</span>
                                                                        </div>
                                                                        <span className={`font-black tracking-tight ${selectedCountry.code === country.code ? 'text-gold' : 'text-slate-400'}`}>
                                                                            {country.dial_code}
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="relative flex-1 group/field">
                                                <input
                                                    type="tel"
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black tracking-[0.1em] text-right focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                                    placeholder="5XXXXXXXX"
                                                />
                                                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Coupon & Price Summary */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
                                <button
                                    onClick={() => setShowCouponInput(!showCouponInput)}
                                    className="flex items-center justify-between w-full group/coupon"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold/5 text-gold flex items-center justify-center group-hover/coupon:scale-110 transition-transform">
                                            <Percent size={18} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-secondary font-black text-sm">هل تحمل رمز خصم خاص؟</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">اضغط هنا لتفعيل العرض</span>
                                        </div>
                                    </div>
                                    <ChevronDown size={18} className={`text-slate-300 group-hover/coupon:text-gold transition-all duration-500 ${showCouponInput ? 'rotate-180' : ''}`} />
                                </button>

                                {showCouponInput && (
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-fade-in">
                                        <div className="relative flex-1 group/field">
                                            <input
                                                type="text"
                                                placeholder="أدخل مسمى الرمز الترويجي"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-sm font-black text-secondary focus:outline-none focus:border-gold transition-all uppercase tracking-widest"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                disabled={isCouponApplied}
                                            />
                                            <Plus size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                        </div>
                                        <button
                                            onClick={handleVerifyCoupon}
                                            disabled={isCheckingCoupon || isCouponApplied || !couponCode}
                                            className="bg-secondary text-white px-8 py-4 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.96] disabled:opacity-50 transition-all shadow-lg"
                                        >
                                            {isCheckingCoupon ? <Loader2 size={18} className="animate-spin" /> : 'تطبيق الرمز'}
                                        </button>
                                    </div>
                                )}

                                {/* Final Pricing Dashboard */}
                                <div className="mt-10 bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100/80 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الحجز المبدئي</span>
                                        <span className="text-secondary font-black text-sm">{subtotal.toLocaleString()} ر.س</span>
                                    </div>

                                    {isCouponApplied && (
                                        <div className="flex justify-between items-center text-emerald-600 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">تم تطبيق الخصم ({couponDiscount}%)</span>
                                            </div>
                                            <span className="font-black text-sm">- {discountValue.toLocaleString()} ر.س</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-slate-200/50" />

                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <span className="block text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">صافي القيمة المستحقة</span>
                                            <span className="text-3xl font-black text-secondary tracking-tighter">
                                                {totalPrice.toLocaleString()} <span className="text-sm font-bold">ر.س</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-3">
                                                {/* Official Visa Logo */}
                                                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center h-[32px]">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
                                                        alt="Visa"
                                                        className="h-3 w-auto object-contain"
                                                    />
                                                </div>
                                                {/* Official Mastercard Logo */}
                                                <div className="bg-white px-2 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center h-[32px]">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                                        alt="Mastercard"
                                                        className="h-5 w-auto object-contain"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase">الدفع عبر بوابات دفع دولية آمنة</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Final CTA Button */}
                                <div className="mt-8 flex flex-col gap-4">
                                    <button
                                        onClick={handlePayment}
                                        disabled={isLoading}
                                        className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin text-gold" />
                                                <span className="relative z-10">جاري توثيق العملية...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={22} className="text-gold" />
                                                <span className="relative z-10">
                                                    {isLoggedIn ? 'تأكيد الحجز والدفع النهائي' : 'توثيق البيانات وتأكيد الدفع'}
                                                </span>
                                                <ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-slate-400">
                                        <Lock size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">تشفير SSL 256-bit مفعل</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-5 rounded-2xl flex items-center gap-4 animate-shake">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p className="text-xs font-black">{error}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
                
                .ease-ios {
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .dir-ltr { direction: ltr; }
            `}</style>
        </div >
    );
};

export default BookingPage;
