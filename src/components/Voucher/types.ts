
export enum BookingStatus {
    CONFIRMED = 'confirmed',
    TENTATIVE = 'tentative',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export interface GuestInfo {
    firstName: string;
    lastName: string;
    nationality: string;
    email: string;
    phone: string;
}

export interface BookingDetails {
    reference: string;
    hotelName: string;
    hotelAddress: string;
    checkIn: string;
    checkOut: string;
    checkInTime: string;
    checkOutTime: string;
    roomType: string;
    nights: number;
    totalPrice: number;
    currency: string;
    occupancy: string;
    boardBasis: string;
    view: string;
    bedding: string;
    rate: number;
    hotelConf: string;
    specialInclusions: string;
    extraBedCount?: number;
    extraBedPrice?: number;
}

export interface ThemeConfig {
    color: string;
    bg: string;
    text: string;
    border: string;
    label: string;
}
