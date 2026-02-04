import React from 'react';
import { Clock, Info, CreditCard, Users, ShieldCheck } from 'lucide-react';

interface HotelPoliciesProps {
    checkInTime?: string;
    checkOutTime?: string;
    childPolicy?: string;
    cancellationPolicy?: string;
    paymentMethods?: string[];
}

const HotelPolicies: React.FC<HotelPoliciesProps> = ({
    checkInTime = "من 4:00 مساءً",
    checkOutTime = "حتى 12:00 ظهراً",
    childPolicy = "يرحب بالأطفال من جميع الأعمار. الأطفال من سن 11 سنة فأكثر يعتبرون بالغين في هذا الفندق.",
    cancellationPolicy = "تختلف سياسات الإلغاء والدفع المسبق حسب نوع الغرفة وموعد الحجز.",
    paymentMethods = ['visa', 'mastercard', 'mada']
}) => {
    return (
        <section id="policies" className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#D6B372] rounded-full" />
                <h2 className="text-[20px] font-[1000] text-[#0F172A] flex items-center gap-2">
                    السياسات والتعليمات
                    <Info size={20} className="text-[#D6B372]" />
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Check-in / Check-out */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 text-right">
                            <h3 className="text-[16px] font-black text-slate-900 group-hover:text-[#D6B372] transition-colors">تسجيل الدخول / الخروج</h3>
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-slate-500">تسجيل الدخول: {checkInTime}</p>
                                <p className="text-[13px] font-bold text-slate-500">تسجيل الخروج: {checkOutTime}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#D6B372]/10 group-hover:text-[#D6B372] transition-all">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>

                {/* Child Policy */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 text-right">
                            <h3 className="text-[16px] font-black text-slate-900 group-hover:text-[#D6B372] transition-colors">سياسة الأطفال</h3>
                            <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
                                {childPolicy}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#D6B372]/10 group-hover:text-[#D6B372] transition-all">
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                {/* Cancellation & Prepayment */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 text-right">
                            <h3 className="text-[16px] font-black text-slate-900 group-hover:text-[#D6B372] transition-colors">الإلغاء والدفع المسبق</h3>
                            <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
                                {cancellationPolicy}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#D6B372]/10 group-hover:text-[#D6B372] transition-all">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-start justify-between">
                        <div className="space-y-4 text-right w-full">
                            <h3 className="text-[16px] font-black text-slate-900 group-hover:text-[#D6B372] transition-colors">طرق الدفع المقبولة</h3>
                            <div className="flex items-center gap-3 justify-end">
                                <div className="h-8 w-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all px-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 md:h-4 w-full object-contain" />
                                </div>
                                <div className="h-8 w-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all px-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 md:h-6 w-full object-contain" />
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#D6B372]/10 group-hover:text-[#D6B372] transition-all">
                            <CreditCard size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HotelPolicies;
