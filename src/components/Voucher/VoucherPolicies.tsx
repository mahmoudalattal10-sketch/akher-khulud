
import React from 'react';

const VoucherPolicies: React.FC = () => {
    return (
        <section className="grid grid-cols-2 gap-12 px-2 pb-4 pt-8 border-t border-slate-50 text-left" dir="ltr">
            <div className="space-y-6">
                <h5 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-[#c5a059] rotate-45 shadow-sm shrink-0"></div>
                    <span className="leading-none flex items-center">Accommodation Policies</span>
                </h5>
                <div className="space-y-4">
                    <PolicyItem title="System Release:" desc="Prior 48h notice required for any booking modifications." />
                    <PolicyItem title="Family Policy:" desc="Children under 6 years stay complimentary with parents." />
                </div>
            </div>
            <div className="space-y-6">
                <h5 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-[#c5a059] rotate-45 shadow-sm shrink-0"></div>
                    <span className="leading-none flex items-center">Operation Standards</span>
                </h5>
                <div className="space-y-4">
                    <PolicyItem title="Registration:" desc="Formal check-in begins at 16:00 Local Time." />
                    <PolicyItem title="Departure:" desc="Check-out must be finalized by 12:00 PM." />
                </div>
            </div>
        </section>
    );
};

const PolicyItem = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex items-start gap-4">
        <div className="w-2 h-2 rounded-full bg-[#c5a059] mt-1.5 shrink-0"></div>
        <div className="flex flex-col text-left">
            <p className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1.5 tracking-wider text-left">{title}</p>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed text-left">{desc}</p>
        </div>
    </div>
);

export default VoucherPolicies;
