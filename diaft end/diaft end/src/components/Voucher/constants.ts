
import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { BookingStatus, ThemeConfig } from './types';

export const THEMES: Record<BookingStatus, ThemeConfig & { icon: any }> = {
    [BookingStatus.CONFIRMED]: {
        color: 'emerald',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'CONFIRMED'
    },
    [BookingStatus.TENTATIVE]: {
        color: 'amber',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        icon: AlertCircle,
        label: 'TENTATIVE'
    },
    [BookingStatus.PENDING]: {
        color: 'amber',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        icon: Clock,
        label: 'PENDING'
    },
    [BookingStatus.CANCELLED]: {
        color: 'red',
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: XCircle,
        label: 'CANCELLED'
    },
    [BookingStatus.COMPLETED]: {
        color: 'slate',
        bg: 'bg-slate-50',
        text: 'text-slate-800',
        border: 'border-slate-200',
        icon: CheckCircle,
        label: 'COMPLETED'
    }
};
