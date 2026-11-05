export type StudioCategory =
  | "photography"
  | "film"
  | "podcast"
  | "music"
  | "art";

export type ListingStatus = "draft" | "active" | "paused" | "archived";

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";

/** Booking status including derived states shown in the UI. */
export type BookingDisplayStatus = BookingStatus | "expired" | "completed";

export type CancellationPolicy = "flexible" | "moderate" | "strict";

/** `"09:00"`–`"21:00"` or `null` for a closed day. */
export interface DailyHours {
  open: string;
  close: string;
}

/** Keyed by weekday, 0 = Sunday … 6 = Saturday. `null` means closed. */
export type WeeklyHours = Record<number, DailyHours | null>;

export interface HostProfile {
  name: string;
  memberSince: string;
  bio: string;
}

export interface Studio {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  category: StudioCategory;
  city: string;
  area: string;
  address: string;
  capacity: number;
  sizeSqft: number;
  hourlyRate: number;
  securityDeposit: number;
  minHours: number;
  maxHours: number;
  cancellationPolicy: CancellationPolicy;
  rating: number;
  reviewCount: number;
  images: string[];
  equipment: string[];
  amenities: string[];
  weeklyHours: WeeklyHours;
  unavailableDates: string[];
  advanceWindowDays: number;
  status: ListingStatus;
  featured: boolean;
  host: HostProfile;
}

export interface Review {
  id: string;
  studioId: string;
  author: string;
  context: string;
  rating: number;
  date: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  bio?: string;
  createdAt: number;
}

export interface Booking {
  id: string;
  reference: string;
  studioId: string;
  /** id of the user who made the booking (the creator). */
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  /** id of the user who owns the studio (the host). */
  hostId: string;
  message?: string;
  /** `yyyy-mm-dd` */
  date: string;
  /** `HH:mm` */
  start: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  total: number;
  status: BookingStatus;
  createdAt: number;
}

export interface CreateBookingInput {
  studioId: string;
  date: string;
  start: string;
  hours: number;
  message?: string;
}
