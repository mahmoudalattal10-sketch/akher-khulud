
import { Mail, ArrowRight, Instagram, Twitter, Facebook, Linkedin, Phone, MapPin, ShieldCheck, FileText, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandConfig from '../../config/brandConfig';

export default function Footer() {
  return (
    <footer className="relative bg-[#F3F6F6] pt-0 pb-28 md:pb-6 px-3 overflow-hidden mt-0">
      {/* Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white via-gold-50/30 to-transparent opacity-80 pointer-events-none" />

      <div className="max-w-[98%] mx-auto relative z-10 flex flex-col items-center">

        {/* 1. Professional CTA Card - Updated to Premium Green */}
        <div
          className="w-full max-w-5xl bg-gradient-to-br from-[#065f46] via-[#059669] to-[#047857] rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-2xl shadow-emerald-950/30 mb-12 relative overflow-hidden"
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              جاهز لرحلة <span className="text-white underline decoration-gold/50 underline-offset-8">العمر</span>؟
            </h2>
            <p className="text-emerald-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              اجعل رحلتك القادمة تجربة لا تُنسى في أي مكان حول العالم. نحن نهتم بكل التفاصيل لتتفرغ أنت للاستمتاع برحلتك.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  const searchSection = document.getElementById('search-section');
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-10 py-5 bg-white text-emerald-800 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-90 flex items-center justify-center gap-2 group"
              >
                <span>ابدأ تخطيط رحلتك</span>
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="w-full sm:w-auto px-5 sm:px-8 py-4 bg-emerald-900/40 hover:bg-emerald-900/60 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-90 text-sm sm:text-base">
                <a href={`https://wa.me/${brandConfig.contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <span>تواصل واتساب</span>
                  <span dir="ltr" className="inline-block tracking-normal">{brandConfig.contact.phone}</span>
                </a>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Compact Footer Container */}
        <div
          className="w-full max-w-6xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-white/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Col 1: Branding & Contact */}
            <div className="flex flex-col gap-6">
              <img src={brandConfig.logo.primary} alt={brandConfig.brandName} className="h-20 w-auto object-contain self-start -mt-4" />
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                نسعى لتقديم أرقى خدمات الضيافة للمسافرين حول العالم، مع باقات متنوعة تناسب كافة الاحتياجات.
              </p>

              <div className="flex flex-col gap-3">
                <a href={`https://wa.me/${brandConfig.contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-gold-dark transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gold-50 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                    <Phone size={14} />
                  </div>
                  <span dir="ltr" className="font-bold font-mono text-base inline-block tracking-normal">{brandConfig.contact.phone}</span>
                </a>
                <a href={`mailto:${brandConfig.contact.email}`} className="flex items-center gap-2 text-gray-700 hover:text-gold-dark transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gold-50 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                    <Mail size={14} />
                  </div>
                  <span className="font-bold text-sm bg-transparent">{brandConfig.contact.email}</span>
                </a>
                <div className="flex items-center gap-2 text-gray-700 group">
                  <div className="w-8 h-8 rounded-full bg-gold-50 text-gold flex items-center justify-center transition-all">
                    <MapPin size={14} />
                  </div>
                  <span className="font-bold text-sm">المدينة المنورة بجانب بئر عثمان بن عفان</span>
                </div>
              </div>
            </div>

            {/* Col 2: About */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6">روابط سريعة</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                {[
                  { label: 'الرئيسية', path: '/' },
                  { label: 'الفنادق', path: '/hotels' },
                  { label: 'من نحن', path: '/about' },
                  { label: 'تواصل معنا', path: '/contact' }
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.path} className="hover:text-gold transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-gold transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Support */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6">الدعم والمساعدة</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                {[
                  { label: 'مركز المساعدة', path: '/help' },
                  { label: 'الأسئلة الشائعة', path: '/faq' },
                  { label: 'سياسة الخصوصية', path: '/privacy' },
                  { label: 'الشروط والأحكام', path: '/terms' }
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.path} className="hover:text-gold transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-gold transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Licensed Company */}
            {/* Col 4: Licensed Company */}
            <div className="flex flex-col">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  <ShieldCheck size={18} />
                </span>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">شركة مرخصة</span>
              </h4>
              <ul className="space-y-4">
                <li className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-50 group">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-2 group-hover:text-gold transition-colors">
                    <FileText size={14} className="opacity-50 group-hover:opacity-100" />
                    ترخيص وزارة السياحة
                  </span>
                  <span dir="ltr" className="font-bold text-gray-900 tracking-wider font-mono text-sm group-hover:tracking-widest transition-all">73104531</span>
                </li>
                <li className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-50 group">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                    <Building2 size={14} className="opacity-50 group-hover:opacity-100" />
                    السجل التجاري
                  </span>
                  <span dir="ltr" className="font-bold text-gray-900 tracking-wider font-mono text-sm group-hover:tracking-widest transition-all">4031284581</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm font-medium flex flex-wrap items-center gap-2">
              © 2026 جميع الحقوق محفوظة لـ <span className="text-gold-dark font-bold">{brandConfig.brandName}</span>.
              <span className="hidden md:inline text-slate-300">|</span>
              <a href="https://wa.me/201018565155" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-1 group">
                <span className="text-xs">تم التطوير بواسطة</span>
                <span dir="ltr" className="font-bold text-slate-500 group-hover:text-gold transition-colors">elattal co.</span>
              </a>
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs font-medium">طرق الدفع:</span>
              <img src="/assets/images/ui/visa-logo.png" alt="Visa" className="h-12 w-auto object-contain" />
              <img src="/assets/images/ui/mastercard-logo.png" alt="Mastercard" className="h-[18px] w-auto object-contain" />
              <img src="/assets/images/ui/mada-logo.png" alt="مدى Mada" className="h-12 w-auto object-contain" />
            </div>

            <div className="flex gap-6 text-xs text-gray-400 font-medium">
              <Link to="/privacy" className="hover:text-gold transition-colors">الخصوصية</Link>
              <Link to="/terms" className="hover:text-gold transition-colors">الشروط</Link>
              <Link to="/help" className="hover:text-gold transition-colors">المساعدة</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
