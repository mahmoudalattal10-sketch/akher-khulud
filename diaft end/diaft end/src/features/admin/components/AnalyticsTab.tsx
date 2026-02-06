
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Globe, TrendingUp, Users, Building2, Map } from 'lucide-react';
import { useAdminAnalytics } from '../../../hooks/useAdminStats';

// Unused hardcoded data removed

const COLORS = ['#0ca678', '#3b82f6', '#8b5cf6', '#059669'];

const AnalyticsTab: React.FC = () => {
  const { data, loading } = useAdminAnalytics();

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-500 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-black text-sm uppercase tracking-widest">تجميع بيانات الذكاء الاصطناعي...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* 🚀 Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أفضل وجهة</p>
              <p className="text-lg font-black text-slate-800">{data.visitorSources.top.name}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نسبة الانتشار</p>
              <p className="text-lg font-black text-slate-800">{data.visitorSources.top.pct}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الفئة الكبرى</p>
              <p className="text-lg font-black text-slate-800">محلي ({data.visitorSources.ksa}%)</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أداء الفنادق</p>
              <p className="text-lg font-black text-slate-800">مستقر</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">نمو الزوار الأسبوعي</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">تحليل حركة المستخدمين النشطة</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekly}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} dx={-10} />
                <Tooltip
                  cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' }}
                />
                <Bar dataKey="visitors" fill="url(#barGradient)" radius={[12, 12, 0, 0]} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">تطور المبيعات (SAR)</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">الأداء المالي الأسبوعي المباشر</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weekly}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#areaGradient)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12">
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">أداء الفنادق بالسوق</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">نسبة الحجوزات المؤكدة حسب المدينة</p>
            </div>
            <div className="w-10 h-10 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
          <div className="space-y-10">
            {data.hotels.map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-base font-black text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{item.val}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">إشغال</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100/50 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110"
                    style={{ width: item.val, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">مصادر الزوار</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">التوزيع الجغرافي لقاعدة العملاء</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
              <Map size={20} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 border-[12px] border-slate-50 rounded-full"></div>
                <div className="absolute inset-0 border-[12px] border-emerald-500 rounded-full" style={{ clipPath: `inset(0 0 0 ${100 - (data.visitorSources.ksa)}%)` }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-centertext-center">
                  <span className="text-3xl font-black text-slate-800">{data.visitorSources.ksa}%</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">محلي</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/60 rounded-3xl border border-white/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-black text-slate-600">المملكة العربية السعودية</span>
                </div>
                <span className="text-sm font-black text-emerald-600">{data.visitorSources.ksa}%</span>
              </div>
              <div className="p-4 bg-white/60 rounded-3xl border border-white/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-black text-slate-600">دول الخليج العربي</span>
                </div>
                <span className="text-sm font-black text-blue-600">{data.visitorSources.gulf}%</span>
              </div>
              <div className="p-4 bg-white/60 rounded-3xl border border-white/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                  <span className="text-xs font-black text-slate-600">زوار دوليون</span>
                </div>
                <span className="text-sm font-black text-violet-600">{data.visitorSources.intl}%</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">رؤية المحلل الذكي</p>
              <p className="text-xs leading-relaxed font-bold">
                أداء قوي في السوق {data.visitorSources.top.name}، مع نمو ملحوظ في {data.visitorSources.intl > 10 ? 'القطاع الدولي' : 'العملاء المحليين'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
