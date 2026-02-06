import React from 'react';

interface SecurityWatermarkProps {
    text?: string;
}

const SecurityWatermark: React.FC<SecurityWatermarkProps> = ({ text = 'OFFICIAL VOUCHER - DIFAAT KHULOOD' }) => {
    // Generate a timestamp for the watermark
    const timestamp = new Date().toISOString().split('T')[0];
    const securityCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.035] mix-blend-multiply z-0 print:opacity-[0.05]" aria-hidden="true">
            <div className="absolute inset-0 flex flex-wrap gap-x-24 gap-y-32 justify-center items-center -rotate-[35deg] scale-125">
                {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center whitespace-nowrap">
                        <span className="text-xl font-black tracking-[0.3em] uppercase">{text}</span>
                        <div className="flex gap-4 text-[10px] font-bold tracking-widest mt-1">
                            <span>{timestamp}</span>
                            <span>VERIFIED-01-{securityCode}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Corner Markers for structural integrity */}
            <div className="absolute top-4 left-4 border-t-2 border-l-2 border-slate-900 w-8 h-8 opacity-20"></div>
            <div className="absolute top-4 right-4 border-t-2 border-r-2 border-slate-900 w-8 h-8 opacity-20"></div>
            <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-slate-900 w-8 h-8 opacity-20"></div>
            <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-slate-900 w-8 h-8 opacity-20"></div>
        </div>
    );
};

export default SecurityWatermark;
