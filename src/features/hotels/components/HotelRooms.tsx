import React from 'react';
import HotelRoomCard from './HotelRoomCard';

interface Room {
    id: string;
    name: string;
    price: number;
    capacity: number;
    size: string;
    bed: string;
    view: string;
    mealPlan: string;
    tags: string[];
    images: string[];
    inventory: number;
    allowExtraBed: boolean;
    extraBedPrice: number;
    maxExtraBeds: number;
    isVisible: boolean;
    partialMetadata?: any;
    originalIdx: number;
}

interface RoomGroup {
    name: string;
    images: string[];
    capacity: number;
    size: string;
    bed: string;
    view: string;
    variants: Room[];
}

interface HotelRoomsProps {
    groups: RoomGroup[];
    selectedRoom: number | null;
    roomQuantities: Record<string, number>;
    extraBedCounts: Record<string, number>;
    onRoomSelect: (idx: number) => void;
    onQuantityChange: (roomId: string, delta: number, max: number) => void;
    onExtraBedChange: (roomId: string, delta: number, max: number) => void;
    onBookNow: (idx: number) => void;
    hotelMainImage?: string;
    hasDates?: boolean;
    onOpenSearch?: () => void;
    loading?: boolean;
}

const RoomSkeleton = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100/80 overflow-hidden animate-pulse">
        <div className="flex flex-col lg:flex-row items-stretch min-h-[320px]">
            <div className="lg:w-[32%] bg-slate-100 min-h-[250px] lg:min-h-full"></div>
            <div className="lg:w-[68%] p-6 md:p-8 flex flex-col justify-between">
                <div>
                    <div className="h-8 bg-slate-100 rounded-full w-2/3 mb-4"></div>
                    <div className="flex gap-4 mb-8">
                        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-8 border-t border-slate-50">
                    <div className="h-12 bg-slate-100 rounded-full w-32"></div>
                    <div className="h-10 bg-slate-100 rounded-full w-40"></div>
                </div>
            </div>
        </div>
    </div>
);

const HotelRooms: React.FC<HotelRoomsProps> = ({
    groups,
    selectedRoom,
    roomQuantities,
    extraBedCounts,
    onRoomSelect,
    onQuantityChange,
    onExtraBedChange,
    onBookNow,
    hotelMainImage,
    hasDates,
    onOpenSearch,
    loading
}) => {
    if (loading) {
        return (
            <div className="space-y-12">
                {[1, 2].map((i) => (
                    <RoomSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in" style={{ animationDelay: '450ms' }}>
            {groups.length > 0 ? (
                groups.map((group, idx) => (
                    <HotelRoomCard
                        key={idx}
                        group={group}
                        selectedRoom={selectedRoom}
                        roomQuantities={roomQuantities}
                        extraBedCounts={extraBedCounts}
                        onRoomSelect={onRoomSelect}
                        onQuantityChange={onQuantityChange}
                        onExtraBedChange={onExtraBedChange}
                        onBookNow={onBookNow}
                        hotelMainImage={hotelMainImage}
                        hasDates={hasDates}
                        onOpenSearch={onOpenSearch}
                    />
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold">لا توجد غرف متاحة حالياً تطابق بحثك.</p>
                </div>
            )}
        </div>
    );
};

export default HotelRooms;
