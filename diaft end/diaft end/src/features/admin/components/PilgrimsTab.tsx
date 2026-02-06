import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Calendar, MapPin, Search, Download, Filter, User, MessageCircle, Send, Copy, CheckCircle2, X, ExternalLink, MessageSquare } from 'lucide-react';
import { AdminAPI } from '../../../services/admin.service';

interface Pilgrim {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestsCount: number;
    checkIn: string;
    checkOut: string;
    hotelName: string;
    registeredAt: string;
}

const PilgrimsTab: React.FC = () => {
    const [pilgrims, setPilgrims] = useState<Pilgrim[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedPilgrim, setSelectedPilgrim] = useState<Pilgrim | null>(null);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    useEffect(() => {
        fetchPilgrims();
    }, []);

    const fetchPilgrims = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AdminAPI.getPilgrims();
            if (response.success && response.data) {
                setPilgrims(response.data);
            } else {
                setError(response.error || 'Failed to fetch pilgrims');
            }
        } catch (err) {
            setError('خطأ في الاتصال بالخادم');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPilgrims = pilgrims.filter(p => {
        const name = (p.guestName || '').toLowerCase();
        const phone = (p.guestPhone || '');
        const hotel = (p.hotelName || '').toLowerCase();
        const term = (searchTerm || '').toLowerCase();

        return name.includes(term) || phone.includes(searchTerm) || hotel.includes(term);
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long'
        });
    };

    return (
        <div className="space-y-6 animate-fade-in" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                        <Users size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">سجل المعتمرين والزوار</h2>
                        <p className="text-sm text-slate-500 font-bold">عرض فوري لبيانات ضيوف الرحمن فور تأكيد الدفع</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {/* Export Logic */ }}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Download size={16} />
                        تصدير البيانات
                    </button>
                </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">إجمالي الضيوف</span>
                        <span className="text-2xl font-black text-slate-900">{pilgrims.length}</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">وصول اليوم</span>
                        <span className="text-2xl font-black text-slate-900">
                            {pilgrims.filter(p => new Date(p.checkIn).toDateString() === new Date().toDateString()).length}
                        </span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-amber-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">متواجد حالياً</span>
                        <span className="text-2xl font-black text-slate-900">
                            {pilgrims.filter(p => {
                                const checkIn = new Date(p.checkIn);
                                const checkOut = new Date(p.checkOut);
                                const now = new Date();
                                return now >= checkIn && now <= checkOut;
                            }).length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث باسم المعتمر، رقم الجوال، أو الفندق..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-12 pl-6 py-4 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all flex items-center gap-2 text-sm font-black shadow-lg shadow-slate-200">
                    <Filter size={18} />
                    تصفية متقدمة
                </button>
            </div>

            {/* Main Table Layer */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعتمر / الزائر</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">بيانات التواصل</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الإقامة</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الفندق</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ التسجيل</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-6">
                                            <div className="h-12 bg-slate-50 rounded-2xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredPilgrims.length > 0 ? (
                                filteredPilgrims.map((pilgrim) => (
                                    <tr key={pilgrim.bookingId} className="group hover:bg-emerald-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div
                                                className="flex items-center gap-4 cursor-pointer hover:bg-white p-2 -m-2 rounded-2xl transition-all group/cell"
                                                onClick={() => setSelectedPilgrim(pilgrim)}
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-black group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                                                    {(pilgrim.guestName || 'G').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 mb-1 group-hover/cell:text-emerald-600 transition-colors flex items-center gap-2">
                                                        {pilgrim.guestName || 'ضيف غير معروف'}
                                                        <MessageSquare size={14} className="opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">#{pilgrim.bookingId?.split('-')[0] || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                                                    <Phone size={12} className="text-emerald-500" />
                                                    <span dir="ltr">{pilgrim.guestPhone || '---'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                    <Mail size={12} />
                                                    {pilgrim.guestEmail || '---'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="text-center">
                                                    <div className="text-[10px] font-black text-indigo-400 uppercase mb-1">وصول</div>
                                                    <div className="text-xs font-black text-slate-900 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
                                                        {formatDate(pilgrim.checkIn)}
                                                    </div>
                                                </div>
                                                <div className="w-4 h-px bg-slate-200" />
                                                <div className="text-center">
                                                    <div className="text-[10px] font-black text-rose-400 uppercase mb-1">مغادرة</div>
                                                    <div className="text-xs font-black text-slate-900 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100/50">
                                                        {formatDate(pilgrim.checkOut)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-secondary">
                                                <MapPin size={14} className="text-emerald-500" />
                                                {pilgrim.hotelName || '---'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-xs font-bold text-slate-400">
                                                {new Date(pilgrim.registeredAt).toLocaleDateString('ar-EG')}
                                                <span className="block text-[9px] opacity-60">الساعة {new Date(pilgrim.registeredAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-left">
                                            <button className="px-4 py-2 text-xs font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-100/50">
                                                ملف المستخدم
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Users size={64} />
                                            <p className="text-lg font-black">{searchTerm ? 'لا توجد نتائج مطابقة' : 'لا يوجد متلقين مسجلين حالياً'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Contact Modal - Creative & Premium */}
            {selectedPilgrim && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPilgrim(null)} />

                    <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                        {/* Modal Header Wrap */}
                        <div className="relative h-32 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 flex items-end justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl -ml-12 -mb-12" />

                            <div className="relative flex items-center gap-4 text-white">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-2xl font-black">
                                    {(selectedPilgrim.guestName || 'G').charAt(0)}
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xl font-black">{selectedPilgrim.guestName}</h3>
                                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em]">تواصل سريع مع الضيف</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPilgrim(null)}
                                className="relative w-10 h-10 rounded-xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Contact Options Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* WhatsApp */}
                                <a
                                    href={`https://wa.me/${selectedPilgrim.guestPhone?.replace('+', '')}?text=${encodeURIComponent(`أهلاً بك يا ${selectedPilgrim.guestName}، معك ضيافة خلود بخصوص حجزك في فندق ${selectedPilgrim.hotelName}. نحن هنا لخدمتكم.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-100 rounded-3xl group hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300"
                                >
                                    <MessageCircle size={32} className="text-emerald-500 mb-3 group-hover:text-white transition-colors animate-bounce" />
                                    <span className="text-xs font-black text-emerald-700 group-hover:text-white transition-colors">واتساب مباشر</span>
                                </a>

                                {/* Call */}
                                <a
                                    href={`tel:${selectedPilgrim.guestPhone}`}
                                    className="flex flex-col items-center justify-center p-6 bg-indigo-50 border border-indigo-100 rounded-3xl group hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
                                >
                                    <Phone size={32} className="text-indigo-500 mb-3 group-hover:text-white transition-colors group-hover:rotate-12" />
                                    <span className="text-xs font-black text-indigo-700 group-hover:text-white transition-colors">اتصال هاتفي</span>
                                </a>

                                {/* Email */}
                                <a
                                    href={`mailto:${selectedPilgrim.guestEmail}?subject=بخصوص حجزكم في ضيافة خلود&body=${encodeURIComponent(`عزيزي ${selectedPilgrim.guestName}، نأمل أن تكونوا بخير...`)}`}
                                    className="flex flex-col items-center justify-center p-6 bg-amber-50 border border-amber-100 rounded-3xl group hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
                                >
                                    <Mail size={32} className="text-amber-500 mb-3 group-hover:text-white transition-colors group-hover:-translate-y-1" />
                                    <span className="text-xs font-black text-amber-700 group-hover:text-white transition-colors">بريد إلكتروني</span>
                                </a>

                                {/* SMS */}
                                <a
                                    href={`sms:${selectedPilgrim.guestPhone}`}
                                    className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300"
                                >
                                    <Send size={32} className="text-slate-500 mb-3 group-hover:text-white transition-colors" />
                                    <span className="text-xs font-black text-slate-700 group-hover:text-white transition-colors">رسالة SMS</span>
                                </a>
                            </div>

                            {/* Data Copy Section */}
                            <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 shadow-inner border border-slate-100">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 font-black text-xs shadow-sm">1</div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم الجوال</p>
                                            <p className="text-sm font-black text-slate-700" dir="ltr">{selectedPilgrim.guestPhone}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedPilgrim.guestPhone || '');
                                            setCopyFeedback('phone');
                                            setTimeout(() => setCopyFeedback(null), 2000);
                                        }}
                                        className={`p-3 rounded-xl transition-all ${copyFeedback === 'phone' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-emerald-500 shadow-sm'}`}
                                    >
                                        {copyFeedback === 'phone' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 font-black text-xs shadow-sm">2</div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني</p>
                                            <p className="text-sm font-black text-slate-700 truncate max-w-[200px]">{selectedPilgrim.guestEmail}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedPilgrim.guestEmail || '');
                                            setCopyFeedback('email');
                                            setTimeout(() => setCopyFeedback(null), 2000);
                                        }}
                                        className={`p-3 rounded-xl transition-all ${copyFeedback === 'email' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-emerald-500 shadow-sm'}`}
                                    >
                                        {copyFeedback === 'email' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Info Footer */}
                            <div className="text-center pt-2">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <ExternalLink size={12} />
                                    تغطية شاملة لجميع قنوات التواصل لعام 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PilgrimsTab;
