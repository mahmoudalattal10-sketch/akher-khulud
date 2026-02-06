
export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  availableStock: number;
  mealPlan: string;
  view: string | null;
  area: number | null;
  features: string[] | null;
  images: string[] | null;
  hotelId: string;
  sofa?: boolean;
  beds?: string;
  allowExtraBed?: boolean;
  extraBedPrice?: number;
  maxExtraBeds?: number;
  isVisible?: boolean;
  pricingPeriods?: {
    id: string;
    startDate: string;
    endDate: string;
    price: number;
  }[];
  partialMetadata?: {
    isPartial: boolean;
    availableFrom: string;
    availableTo: string;
    availableNightsCount: number;
    totalPrice: number;
    avgPrice: number;
  };
  occupancies?: {
    label: string;
    capacity: number;
    price: number;
    image: string;
  }[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  hotelId: string;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  location: string;
  locationEn: string;
  city: string;
  country?: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  coords: [number, number];
  amenities: string[];
  description: string;
  isOffer: boolean;
  isFeatured: boolean;
  discount: string | null;
  distanceFromHaram?: string;
  extraBedStock: number;
  hasFreeBreakfast: boolean;
  hasFreeTransport: boolean;
  isVisible: boolean;
  view?: string;
  partialMatch?: boolean;
  displayPrice?: number;
  rooms?: Room[];
  guestReviews?: Review[];
  nearbyLandmarks?: {
    name: string;
    distance: string;
    icon: string;
    type?: string;
  }[];
  lat?: string | number;
  lng?: string | number;
  price?: number; // Added for UI compatibility
  basePrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  country: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  paymentRef: string | null;
  userId: string;
  roomId: string;
  roomCount: number;
  guestsCount: number;
  extraBedCount: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  nationality?: string;
  specialRequests: string | null;
  createdAt: string;
  room?: {
    id: string;
    name: string;
    view?: string;
    hotel?: {
      id: string;
      name: string;
      image?: string;
      city?: string;
      slug?: string;
    }
  }
}

export interface SearchFilters {
  destination: string;
  dates: string;
  guests: number;
}
