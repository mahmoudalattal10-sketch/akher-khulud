import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface HotelGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    hotelName: string;
}

const HotelGalleryModal: React.FC<HotelGalleryModalProps> = ({ isOpen, onClose, images, hotelName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-50 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
                <X size={24} />
            </button>

            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 min-h-screen">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">{hotelName} - معرض الصور</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="ltr">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-xl aspect-[4/3]">
                            <img
                                src={img}
                                alt={`${hotelName} ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-zoom-in" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelGalleryModal;
