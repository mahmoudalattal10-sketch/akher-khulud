import React from 'react';
import {
    Wifi, Car, Utensils, Bell, CigaretteOff, Accessibility, Wind, Monitor, VolumeX,
    Coffee, Zap, Lock, Sofa, Briefcase, Droplets, ShowerHead, HelpCircle, Shirt,
    Footprints, FileText, Tv, Phone, Baby, GlassWater, Clock, UserCheck, Waves,
    FireExtinguisher, Siren, Shield, Key, Cctv, Globe, CheckCircle2, Trees,
    LayoutGrid, Check, Activity, EyeOff, Moon, Star, AlertTriangle, XCircle, Map,
    Dumbbell, Plane, Sparkles, Gamepad2, Building, ShoppingBag, MapPin, Refrigerator
} from 'lucide-react';
import { MEAL_PLANS as SHARED_MEAL_PLANS, ROOM_TYPE_LABELS } from '../../../constants/hotelConstants';

export const ADMIN_HOTEL_AMENITIES = [
    { id: 'wifi', label: 'واي فاي مجاني', icon: <Wifi size={16} /> },
    { id: 'parking', label: 'مواقف سيارات', icon: <Car size={16} /> },
    { id: 'pool', label: 'مسبح فندقي', icon: <Waves size={16} /> },
    { id: 'gym', label: 'نادي رياضي', icon: <Dumbbell size={16} /> },
    { id: 'food', label: 'مطعم فاخر', icon: <Utensils size={16} /> },
    { id: 'shuttle', label: 'نقل للحرم 24/7', icon: <Plane size={16} /> },
    { id: 'spa', label: 'مركز سبا وعافية', icon: <Sparkles size={16} /> },
    { id: 'room_service', label: 'خدمة غرف 24/7', icon: <Bell size={16} /> },
    { id: 'kids_club', label: 'نادي أطفال', icon: <Gamepad2 size={16} /> },
    { id: 'business', label: 'مركز أعمال', icon: <Briefcase size={16} /> },
    { id: 'laundry', label: 'خدمة غسيل', icon: <Shirt size={16} /> },
    { id: 'concierge', label: 'كونسيرج', icon: <UserCheck size={16} /> },
    { id: 'cafe', label: 'مقهى', icon: <Coffee size={16} /> },
    { id: 'valet', label: 'صف سيارات', icon: <Key size={16} /> }
];

export const ROOM_AMENITIES = [
    { id: 'room_wifi', label: 'واي فاي سريع', icon: <Wifi size={14} /> },
    { id: 'tv', label: 'شاشة ذكية', icon: <Tv size={14} /> },
    { id: 'ac', label: 'تكييف مركزي', icon: <Wind size={14} /> },
    { id: 'minibar', label: 'ميني بار', icon: <Utensils size={14} /> },
    { id: 'safe', label: 'صندوق أمانات', icon: <Lock size={14} /> },
    { id: 'sofa', label: 'أريكة جلوس', icon: <Sofa size={14} /> },
    { id: 'desk', label: 'مكتب عمل', icon: <Briefcase size={14} /> },
    { id: 'kettle', label: 'غلاية ماء', icon: <Coffee size={14} /> },
    { id: 'iron', label: 'مكواة ملابس', icon: <Shirt size={14} /> },
    { id: 'shower', label: 'دش استحمام المطري', icon: <ShowerHead size={14} /> },
    { id: 'hairdryer', label: 'مجفف شعر', icon: <Zap size={14} /> },
    { id: 'fridge', label: 'ثلاجة صغيرة', icon: <Refrigerator size={14} /> }
];

export const MEAL_PLANS = SHARED_MEAL_PLANS;

export const ROOM_TYPES = Object.entries(ROOM_TYPE_LABELS).map(([id, label]) => ({ id, label }));

export const ROOM_VIEWS = [
    { label: 'بدون إطلالة محددة', icon: <EyeOff size={14} className="opacity-40" /> },
    { label: 'مطلة كاملة على الكعبة', icon: <Sparkles size={14} className="text-amber-500" /> },
    { label: 'مطلة جزئية على الكعبة', icon: <Sparkles size={14} className="text-amber-300" /> },
    { label: 'مطلة كاملة على المسجد النبوي', icon: <Moon size={14} className="text-slate-800" /> },
    { label: 'مطلة جزئية على المسجد النبوي', icon: <Moon size={14} className="text-slate-400" /> },
    { label: 'مطلة كاملة على المدينة', icon: <Map size={14} className="text-slate-500" /> },
    { label: 'مطلة جزئية على المدينة', icon: <Map size={14} className="text-slate-400" /> },
    { label: 'مطلة على الشاطئ', icon: <Waves size={14} className="text-blue-500" /> },
    { label: 'مطلة على الحديقة', icon: <Trees size={14} className="text-emerald-500" /> }
];

export const BEDDING_SUGGESTIONS = [
    "1 سرير كينج",
    "2 سرير فردي",
    "3 أسرّة فردية",
    "4 أسرّة فردية",
    "1 سرير كينج + 1 أريكة سرير",
    "2 سرير كينج"
];

export const FILTER_STATUS_OPTIONS = [
    { id: 'all', label: 'عرض الكل', icon: <LayoutGrid size={14} /> },
    { id: 'active', label: 'الفنادق النشطة', icon: <Check size={14} className="text-[#0f172a]" /> },
    { id: 'inactive', label: 'الفنادق الغير نشطة', icon: <XCircle size={14} className="text-red-500" /> },
    { id: 'featured', label: 'الفنادق المميزة', icon: <Star size={14} className="text-amber-500" /> },
    { id: 'low_stock', label: 'غرفها قربت تخلص', icon: <AlertTriangle size={14} className="text-orange-500" /> },
    { id: 'sold_out', label: 'فنادق خلصانة (Sold Out)', icon: <XCircle size={14} className="text-slate-500" /> },
    { id: 'expiring_soon', label: 'أسعارها قربت تخلص', icon: <Clock size={14} className="text-orange-500" /> },
    { id: 'expired_prices', label: 'أسعارها منتهية', icon: <Activity size={14} className="text-red-500" /> },
];

export const ADMIN_HOTEL_LANDMARKS = [
    { id: 'haram', label: 'المسجد الحرام / النبوي', icon: <Sparkles size={16} className="text-amber-500" /> },
    { id: 'building', label: 'معلم سياحي', icon: <Building size={16} /> },
    { id: 'mall', label: 'مركز تسوق', icon: <ShoppingBag size={16} /> },
    { id: 'restaurant', label: 'مطعم / مقهى', icon: <Utensils size={16} /> },
    { id: 'business', label: 'مركز أعمال', icon: <Briefcase size={16} /> },
    { id: 'transport', label: 'محطة نقل', icon: <Car size={16} /> },
    { id: 'airport', label: 'مطار', icon: <Plane size={16} /> },
    { id: 'other', label: 'أخرى', icon: <MapPin size={16} /> }
];
