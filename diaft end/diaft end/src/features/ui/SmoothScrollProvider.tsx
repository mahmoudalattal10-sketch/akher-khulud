import React from 'react';

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
    // 🗑️ Lenis Removed for Performance
    // This component is kept as a pass-through to maintain tree structure
    // and allow for future scroll implementations if needed.
    return <>{children}</>;
};

export default SmoothScrollProvider;
