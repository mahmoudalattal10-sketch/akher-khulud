import React from 'react';
import {
    Wifi, Car, Utensils, Info, ShieldCheck, MapPin,
    Tv, Wind, Users, Coffee, Waves, Bath,
    Armchair, Bed, Camera, Lock, Bell, Briefcase,
    Accessibility, Languages, Baby, Sparkles, Trash2,
    Key, Phone, Satellite, Snowflake, Dumbbell
} from 'lucide-react';

interface HotelFullDetailsProps {
    hotelName: string;
}

const HotelFullDetails: React.FC<HotelFullDetailsProps> = ({ hotelName }) => {
    const categories = [
        {
            title: "عام",
            items: ["ميني ماركت في الموقع", "صالة مشتركة / منطقة تلفزيون", "تكييف", "ممنوع التدخين في كل الأماكن", "خدمة إيقاظ", "تدفئة", "عازل للصوت", "مدخل خاص", "وجبات غداء مرزومة", "أرض مغطاة بالسجاد", "مصعد", "غرف عائلية", "صالون حلاقة / تجميل", "مرافق كي الملابس", "مرافق لذوي الاحتياجات الخاصة", "غرف لغير المدخنين", "مكواة", "خدمة الغرف"],
            icon: <Info className="text-slate-400" />
        },
        {
            title: "مرافق رائعة لإقامتك",
            items: ["واي فاي مجاني", "حمّام خاص", "تلفزيون بشاشة مسطحة", "تكييف", "غرف عائلية", "غرف لغير المدخنين", "خدمة الغرف", "مطعم", "موقف سيارات", "مرافق لذوي الاحتياجات الخاصة"],
            icon: <Sparkles className="text-gold" />
        },
        {
            title: "الأمان والحماية",
            items: ["طفايات حريق", "كاميرات دوائر تلفزيونية مغلقة خارج مكان الإقامة", "كاميرات دوائر تلفزيونية مغلقة في المناطق المشتركة", "أجهزة إنذار الدخان", "نظام الإنذار الأمني", "بطاقات مفاتيح الدخول", "مفاتيح الدخول", "أمن على مدار الساعة", "صندوق الأمانات"],
            icon: <ShieldCheck className="text-slate-400" />
        },
        {
            title: "مأكولات ومشروبات",
            items: ["مقهى في الموقع", "فواكه (رسوم إضافية)", "وجبات أطفال", "قوائم النظام الغذائي الخاص (عند الطلب)", "خدمة فطور في الغرفة", "ميني بار", "مطعم", "آلة صنع الشاي / القهوة"],
            icon: <Utensils className="text-slate-400" />
        },
        {
            title: "حمّام",
            items: ["ورق حمام", "مناشف", "حوض استحمام أو دش", "نعال", "حمّام خاص", "مرحاض", "لوازم استحمام مجانية", "دش"],
            icon: <Bath className="text-slate-400" />
        },
        {
            title: "خدمات استقبال",
            items: ["يمكن طلب فاتورة", "خزائن", "تسجيل وصول / مغادرة خاص", "خدمة كونسيرج", "تسجيل سريع للوصول والمغادرة", "مكتب استقبال على مدار 24 ساعة"],
            icon: <Bell className="text-slate-400" />
        },
        {
            title: "لغات التحدث",
            items: ["العربية", "الإنجليزية", "الفرنسية", "الإندونيسية", "التركية", "الأردوية"],
            icon: <Languages className="text-slate-400" />
        },
        {
            title: "خدمات تنظيف",
            items: ["خدمة تنظيف يومية", "ضاغط للسراويل (رسوم إضافية)", "خدمة كي الملابس (رسوم إضافية)", "التنظيف الجاف للملابس (رسوم إضافية)", "مرافق غسيل الملابس (رسوم إضافية)"],
            icon: <Sparkles className="text-slate-400" />
        },
        {
            title: "ميديا وتكنولوجيا",
            items: ["تلفزيون بشاشة مسطحة", "قنوات فضائية", "هاتف", "تلفزيون"],
            icon: <Tv className="text-slate-400" />
        },
        {
            title: "مرافق أعمال",
            items: ["فاكس / نسخ مستندات (رسوم إضافية)", "مركز أعمال (رسوم إضافية)", "قاعات اجتماعات / ولائم (رسوم إضافية)"],
            icon: <Briefcase className="text-slate-400" />
        },
        {
            title: "سهولة الوصول",
            items: ["مرحاض بمقابض", "ملائمة لمستخدمي الكراسي المتحركة"],
            icon: <Accessibility className="text-slate-400" />
        },
        {
            title: "غرفة نوم",
            items: ["بياضات أسرّة", "خزانة"],
            icon: <Bed className="text-slate-400" />
        },
        {
            title: "إنترنت",
            items: ["خدمة الواي فاي (الإنترنت اللاسلكي) في جميع أنحاء الفندق مجاناً."],
            icon: <Wifi className="text-slate-400" />
        },
        {
            title: "أنشطة",
            items: ["سهرات العشاء بأنماط مميزة (رسوم إضافية)"],
            icon: <Users className="text-slate-400" />
        },
        {
            title: "خدمات عائلية وترفيهية",
            items: ["بوابات حماية للأطفال"],
            icon: <Baby className="text-slate-400" />
        },
        {
            title: "مرافق الغرفة",
            items: ["مقبس بجانب السرير"],
            icon: <Info className="text-slate-400" />
        },
        {
            title: "مطبخ",
            items: ["غلاية كهربائية"],
            icon: <Coffee className="text-slate-400" />
        },
    ];

    return (
        <section className="py-12 md:py-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Minimal Header */}
            <div className="text-right mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">كل التفاصيل عن {hotelName}</h2>
                <p className="text-slate-500 font-medium">كل ما تحتاج معرفته عن إقامتك ومرافق الفندق</p>
            </div>

            {/* Clean Grid Layout - No heavy borders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

                {/* Column 1: General (Right) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Info className="text-slate-900 w-5 h-5" />
                        <h3 className="text-lg font-black text-slate-900">{categories[0].title}</h3>
                    </div>
                    <ul className="space-y-3">
                        {categories[0].items.map((item, i) => (
                            <li key={i} className="text-sm font-bold text-slate-600 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 2: Featured (Center) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-[#D6B372] w-5 h-5" />
                        <h3 className="text-lg font-black text-slate-900">{categories[1].title}</h3>
                    </div>
                    <ul className="space-y-3">
                        {categories[1].items.map((item, i) => (
                            <li key={i} className="text-sm font-bold text-slate-600 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-[#D6B372] rounded-full mt-1.5 shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Safety (Left) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-emerald-600 w-5 h-5" />
                        <h3 className="text-lg font-black text-slate-900">{categories[2].title}</h3>
                    </div>
                    <ul className="space-y-3">
                        {categories[2].items.map((item, i) => (
                            <li key={i} className="text-sm font-bold text-slate-600 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Minimal Divider */}
            <div className="h-px bg-slate-100 my-12"></div>

            {/* Other Categories - Grid of simple lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {categories.slice(3).map((cat, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            {React.cloneElement(cat.icon as React.ReactElement, { size: 18, strokeWidth: 2 })}
                            <h4 className="text-sm font-black text-slate-800">{cat.title}</h4>
                        </div>
                        <ul className="space-y-2 pr-7 border-r border-slate-100 mr-1">
                            {cat.items.map((item, i) => (
                                <li key={i} className="text-xs font-bold text-slate-500 leading-relaxed">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Simple Help Banner */}
            <div className="mt-16 bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                        <Phone size={18} />
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-slate-800">تحتاج مساعدة؟</p>
                        <p className="text-xs font-bold text-slate-400">فريقنا جاهز للإجابة على استفساراتك</p>
                    </div>
                </div>
                <button className="text-xs font-black text-slate-600 border-b border-slate-300 pb-0.5 hover:text-[#D6B372] hover:border-[#D6B372] transition-colors">
                    تواصل معنا
                </button>
            </div>
        </section>
    );
};

export default HotelFullDetails;
