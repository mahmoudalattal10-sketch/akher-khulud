import React, { useEffect, useState } from 'react';

const PageLoader = () => {
    const [show, setShow] = useState(true);

    // Unmount animation logic if needed, but for now simple mount
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center fixed inset-0 z-[9999]">
            {/* Elegant Spinner */}
            <div className="relative w-24 h-24 mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 opacity-20"></div>
                {/* Spinning Gradient Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-t-[#D6B372] border-r-transparent border-b-transparent border-l-transparent animate-spin-slow shadow-[0_0_15px_rgba(214,179,114,0.3)]"></div>

                {/* Inner Pulse */}
                <div className="absolute inset-0 m-auto w-12 h-12 bg-[#D6B372]/10 rounded-full animate-pulse-slow backdrop-blur-sm"></div>

                {/* Brand Icon Placeholder (Optional) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#D6B372] rounded-full animate-bounce"></div>
                </div>
            </div>

            {/* Quote / Text */}
            <div className="text-center space-y-3 animate-fade-in-up">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">جاري تجهيز إقامتك...</h3>
                <p className="text-sm font-bold text-slate-400 animate-pulse">لحظات قليلة ونكون جاهزين</p>
            </div>

            {/* Styles for this component only causing 0 repaints on main thread */}
            <style>{`
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                .animate-spin-slow {
                    animation: spin-slow 1.5s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(PageLoader);
