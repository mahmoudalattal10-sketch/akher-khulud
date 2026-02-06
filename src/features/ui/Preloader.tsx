import React, { useEffect, useState } from 'react';

const messages = [
    "تجارب عالمية .. بمعايير استثنائية",
    "من أرقى الفنادق إلى سحر الوجهات",
    "ضيافة خلود .. حيث لا حدود للرفاهية"
];

const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Start exit animation slightly before unmounting
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // 3s total duration

        // Unmount from DOM
        const unmountTimer = setTimeout(() => {
            setShouldRender(false);
        }, 3600); // Wait for exit animation (0.6s)

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(unmountTimer);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            style={{ willChange: 'transform' }}
        >
            {/* Logo Animation */}
            <div className="relative mb-8">
                <img
                    src="/assets/images/ui/logo.png"
                    alt="Diafat Khulud"
                    className="w-32 md:w-40 h-auto object-contain animate-logo-enter"
                />
            </div>

            {/* Modern Progress Bar */}
            <div className="w-56 h-0.5 relative rounded-full overflow-hidden mb-8">
                {/* Track */}
                <div className="absolute inset-0 bg-slate-100/80 w-full h-full"></div>
                {/* Fill with Gradient & Glow */}
                <div className="absolute inset-0 h-full bg-gradient-to-r from-[#D6B372] via-[#F3E5AB] to-[#D6B372] animate-progress-fill origin-right rtl:origin-right ltr:origin-left shadow-[0_0_10px_rgba(214,179,114,0.5)]"></div>
            </div>

            {/* Rotating Text - CSS Only */}
            <div className="h-8 relative w-full flex justify-center items-center overflow-hidden">
                {messages.map((msg, index) => (
                    <p
                        key={index}
                        className="absolute w-full text-center text-sm md:text-base font-bold text-slate-700 tracking-wide font-cairo opacity-0 animate-text-cycle"
                        style={{
                            animationDelay: `${0.2 + (index * 1.3)}s`
                        }}
                    >
                        {msg}
                    </p>
                ))}
            </div>

            <style>{`
                @keyframes logo-enter {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1.15); }
                }
                
                @keyframes progress-fill {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }

                @keyframes text-appear {
                    0% { opacity: 0; transform: translateY(10px); }
                    15% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-5px); }
                }

                .animate-logo-enter {
                    animation: logo-enter 3s linear forwards;
                    will-change: transform, opacity;
                }

                .animate-progress-fill {
                    animation: progress-fill 3.5s ease-in-out forwards;
                    will-change: width;
                }

                .animate-text-cycle {
                    animation-name: text-appear;
                    animation-duration: 1.2s;
                    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    animation-fill-mode: forwards;
                    will-change: transform, opacity;
                }
            `}</style>
        </div>
    );
};

export default React.memo(Preloader);
