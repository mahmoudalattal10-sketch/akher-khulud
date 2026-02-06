import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text' | 'rounded';
    width?: string | number;
    height?: string | number;
    animate?: boolean;
}

/**
 * =========================================================
 * 🦴 Luxury Skeleton Loader
 * =========================================================
 * A high-end skeleton loader with a subtle shimmer effect.
 * Designed for Diafat 2026 aesthetics.
 */
const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animate = true
}) => {
    const baseClasses = "relative overflow-hidden bg-slate-100 rounded-2xl";

    const variantClasses = {
        rectangular: 'rounded-none',
        rounded: 'rounded-2xl',
        circular: 'rounded-full',
        text: 'rounded-md h-4 w-full'
    };

    const style = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        >
            {animate && (
                <div className="absolute inset-0 -translate-x-full animate-shimmer">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
            )}
        </div>
    );
};

export default Skeleton;
