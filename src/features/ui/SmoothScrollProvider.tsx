import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useState } from 'react';

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
    // Initialize with a check to avoid layout shift if possible, but safe for SSR
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            // Check for touch capability AND small screen to target actual mobile phones/tablets
            return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
        }
        return false;
    });

    useEffect(() => {
        const checkMobile = () => {
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 1024;
            setIsMobile(isTouch && isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 📱 Mobile: Native Scroll (Native is always best for performance on phones)
    // 🖥️ Desktop: Lenis Smooth Scroll
    if (isMobile) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1, // Smoothness (0-1). Lower is smoother/heavier.
                duration: 1.5, // Duration of the scroll animation
                smoothWheel: true,
                wheelMultiplier: 1, // Scroll speed
            }}
        >
            {children}
        </ReactLenis>
    );
};

export default SmoothScrollProvider;
