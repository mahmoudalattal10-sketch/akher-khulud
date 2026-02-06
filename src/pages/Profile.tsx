
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Key, LogOut, Calendar, Heart, Settings, MapPin, CreditCard, Bell, Loader2, AlertCircle, Hotel, Printer } from 'lucide-react';
import { AuthAPI, BookingsAPI, HotelsAPI } from '../services/api';
import { API_BASE_URL } from '../services/api-client';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import HotelCard from '../features/hotels/components/HotelCard';
import { Hotel as HotelType } from '../types';

// Booking type from API
interface UserBooking {
    id: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    guestsCount: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    createdAt: string;
    room?: {
        id: string;
        name: string;
        hotel?: {
            id: string;
            slug: string;
            name: string;
            image: string;
            city: string;
        };
    };
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { favorites } = useUserPreferences();
    const [favoriteHotels, setFavoriteHotels] = useState<HotelType[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    useEffect(() => {
        checkAuthAndLoadData();
    }, []);

    useEffect(() => {
        // ⚡ Smart Caching: Only fetch if data is missing or out of sync with favorites list
        if (activeTab === 'favorites' && favorites.length > 0) {
            const hasData = favoriteHotels.length > 0;
            const isSync = favoriteHotels.length === favorites.length && favoriteHotels.every(h => favorites.includes(h.id));

            if (!hasData || !isSync) {
                loadFavorites();
            }
        }
    }, [activeTab, favorites]); // eslint-disable-next-line react-hooks/exhaustive-deps

    const loadFavorites = async () => {
        setLoadingFavorites(true);
        try {
            const response = await HotelsAPI.getByIds(favorites);
            if (response.success) {
                setFavoriteHotels(response.data || []);
            }
        } catch (err) {
            console.error('Failed to load favorites', err);
        } finally {
            setLoadingFavorites(false);
        }
    };

    const checkAuthAndLoadData = async () => {
        setLoading(true);
        setError(null);

        if (!AuthAPI.isLoggedIn()) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        try {
            const profileRes = await AuthAPI.profile();
            if (profileRes.success && profileRes.data?.user) {
                setUser(profileRes.data.user as unknown as UserProfile);
                setBookings((profileRes.data.user as any).bookings || []);
                setIsLoggedIn(true);
            } else {
                // Token invalid, clear it
                AuthAPI.logout();
                setIsLoggedIn(false);
            }
        } catch (err) {
            setError('حدث خطأ في تحميل البيانات');
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        AuthAPI.logout();
        setIsLoggedIn(false);
        setUser(null);
        setBookings([]);
        navigate('/');
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return { text: 'حجز مكتمل', class: 'bg-[#e6fcf5] text-[#0ca678] border-[#c3fae8]' };
            case 'PENDING': return { text: 'بانتظار الدفع', class: 'bg-[#fff9ef] text-[#f59e0b] border-[#ffe3b3]' };
            case 'CANCELLED': return { text: 'حجز ملغي', class: 'bg-slate-100 text-slate-500 border-slate-200' };
            case 'FAILED': return { text: 'فشل الدفع', class: 'bg-rose-50 text-rose-600 border-rose-100' };
            case 'COMPLETED': return { text: 'تمت الزيارة', class: 'bg-blue-50 text-blue-600 border-blue-100' };
            default: return { text: status, class: 'bg-slate-50 text-slate-500' };
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const tabs = [
        { id: 'bookings', label: 'حجوزاتي', icon: Calendar },
        { id: 'favorites', label: 'المفضلة', icon: Heart },
        { id: 'account', label: 'إعدادات الحساب', icon: Settings },
    ];

    const LoginOverlay = () => (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-[2.5rem] border border-white/50 text-center p-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white max-w-sm w-full animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogOut className="text-gold w-8 h-8 rotate-180" />
                </div>
                <h3 className="text-xl font-black text-text mb-3">يرجى تسجيل الدخول</h3>
                <p className="text-slate-500 font-bold text-sm mb-8">
                    يجب عليك تسجيل الدخول أولاً لعرض {activeTab === 'bookings' ? 'حجوزاتك' : activeTab === 'favorites' ? 'قائمة المفضلة' : 'إعدادات الحساب'}.
                </p>
                <button
                    onClick={() => navigate('/auth')}
                    className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg hover:bg-primary transition-all active:scale-95"
                >
                    تسجيل الدخول / إنشاء حساب
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-40 flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
            </div>
        );
    }

    const userName = user?.name || 'زائر';

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50 font-cairo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Welcome Card */}
                <div className="bg-primary rounded-[3rem] p-8 md:p-12 mb-10 relative overflow-hidden shadow-2xl text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-primary border-4 border-gold-dark/50 flex items-center justify-center shadow-inner">
                                <span className="text-4xl font-black text-gold-200">{userName.charAt(0)}</span>
                            </div>
                            <div className="text-center md:text-right">
                                <h1 className="text-3xl font-black mb-2">أهلاً، {userName} 👋</h1>
                                <p className="text-gold-200 font-medium">
                                    {isLoggedIn ? (
                                        <>
                                            {user?.email}
                                            {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? ' | مدير النظام' : ''}
                                        </>
                                    ) : 'سجل دخولك للاستمتاع بالمزايا'}
                                </p>
                            </div>
                        </div>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold transition-all text-sm flex items-center gap-2 border border-white/10"
                            >
                                <LogOut size={18} />
                                تسجيل الخروج
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/auth')}
                                className="bg-gold text-white hover:bg-gold-dark px-8 py-3 rounded-2xl font-bold transition-all text-sm shadow-lg shadow-gold/20"
                            >
                                تسجيل الدخول
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-72 shrink-0 space-y-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white text-text shadow-xl shadow-slate-200/50 scale-[1.02]'
                                    : 'bg-transparent text-slate-500 hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon size={22} className={activeTab === tab.id ? 'text-gold' : 'text-slate-400'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 relative min-h-[400px]">

                        {/* Bookings Content */}
                        {activeTab === 'bookings' && (
                            <div className={`space-y-6 animate-fade-in-up transition-all ${!isLoggedIn ? 'opacity-30 select-none pointer-events-none grayscale' : ''}`}>
                                <h2 className="text-2xl font-black text-text mb-6 flex items-center gap-2">
                                    <Calendar size={28} className="text-gold" />
                                    حجوزاتي ({bookings.length})
                                </h2>

                                {bookings.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center">
                                        <Hotel size={48} className="text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-black text-slate-700 mb-2">لا توجد حجوزات</h3>
                                        <p className="text-slate-400 font-bold mb-6">ابحث عن فندقك المثالي واحجز الآن!</p>
                                        <button
                                            onClick={() => navigate('/hotels')}
                                            className="bg-gold text-white px-8 py-3 rounded-xl font-bold hover:bg-gold-dark transition-colors"
                                        >
                                            استعرض الفنادق
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => {
                                            const statusDisplay = getStatusDisplay(booking.status);
                                            return (
                                                <div key={booking.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm md:flex gap-6 items-center">
                                                    <img
                                                        src={booking.room?.hotel?.image || '/placeholder-hotel.jpg'}
                                                        className="w-full md:w-32 h-32 rounded-2xl object-cover"
                                                        alt="Hotel"
                                                    />
                                                    <div className="flex-1 space-y-2 mt-4 md:mt-0">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="text-xl font-black text-text">
                                                                {booking.room?.hotel?.name || 'فندق'}
                                                            </h3>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border shadow-sm ${statusDisplay.class}`}>
                                                                {statusDisplay.text}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
                                                            <MapPin size={16} />
                                                            {booking.room?.name || 'غرفة'} • {booking.guestsCount} ضيوف
                                                        </p>
                                                        <div className="flex gap-4 text-sm text-text font-bold pt-2">
                                                            <div className="bg-slate-50 px-3 py-1.5 rounded-lg">{formatDate(booking.checkIn)}</div>
                                                            <span className="text-slate-300">←</span>
                                                            <div className="bg-slate-50 px-3 py-1.5 rounded-lg">{formatDate(booking.checkOut)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-left mt-4 md:mt-0 flex flex-col items-end gap-3 min-w-[140px]">
                                                        <span className="text-gold font-black text-lg">{booking.totalPrice.toLocaleString()} ر.س</span>
                                                        <span className="text-[10px] text-slate-400 font-bold">#{booking.id.slice(0, 8).toUpperCase()}</span>
                                                        <button
                                                            onClick={() => navigate(`/booking/${booking.id}/voucher`)}
                                                            className="flex items-center gap-2 bg-[#1a3d2a] text-secondary px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#142e20] transition-colors"
                                                        >
                                                            <Printer size={14} />
                                                            عرض الفاتورة
                                                        </button>



                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Favorites Content */}
                        {activeTab === 'favorites' && (
                            <div className={`space-y-6 animate-fade-in-up transition-all ${!isLoggedIn ? 'opacity-30 select-none pointer-events-none grayscale' : ''}`}>
                                <h2 className="text-2xl font-black text-text mb-6 flex items-center gap-2">
                                    <Heart size={28} className="text-gold" />
                                    المفضلة ({favorites.length})
                                </h2>

                                {loadingFavorites ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                                    </div>
                                ) : favorites.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center">
                                        <Heart size={48} className="text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-black text-slate-700 mb-2">قائمة المفضلة فارغة</h3>
                                        <p className="text-slate-400 font-bold">أضف الفنادق المفضلة لديك للوصول إليها بسهولة.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {favoriteHotels.map((hotel, index) => (
                                            <HotelCard key={hotel.id} hotel={hotel} index={index} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Account Settings Content */}
                        {activeTab === 'account' && (
                            <div className={`bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 animate-fade-in-up transition-all ${!isLoggedIn ? 'opacity-30 select-none pointer-events-none grayscale' : ''}`}>
                                <h2 className="text-2xl font-black text-text mb-8 flex items-center gap-2">
                                    <Settings size={28} className="text-gold" />
                                    الإعدادات الشخصية
                                </h2>

                                <form className="space-y-6 max-w-lg">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            value={user?.name || ''}
                                            readOnly
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            readOnly
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-text opacity-70"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500">رقم الهاتف</label>
                                        <input
                                            type="tel"
                                            value={user?.phone || 'غير محدد'}
                                            readOnly
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-text text-left dir-ltr"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500">نوع الحساب</label>
                                        <input
                                            type="text"
                                            value={user?.role === 'SUPER_ADMIN' ? 'مدير النظام' : user?.role === 'ADMIN' ? 'مدير' : 'مستخدم'}
                                            readOnly
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-text"
                                        />
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Overlay if not logged in */}
                        {!isLoggedIn && <LoginOverlay />}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

