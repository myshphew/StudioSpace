import type { StudioCategory, ListingStatus, BookingDisplayStatus } from "@/lib/types";

export const CATEGORY_META: Record<
  StudioCategory,
  { label: string; blurb: string }
> = {
  photography: { label: "Photography Studio", blurb: "Spaces made for the perfect shot." },
  film: { label: "Film & Video", blurb: "Room to bring stories to life." },
  podcast: { label: "Podcast Room", blurb: "Find your voice, and a place to share it." },
  music: { label: "Music Studio", blurb: "Make space for your sound." },
  art: { label: "Art & Creative Space", blurb: "Room to experiment, explore and create." },
};

export const CATEGORY_ORDER: StudioCategory[] = [
  "photography",
  "film",
  "podcast",
  "music",
  "art",
];

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const AMENITIES_LIBRARY = [
  "Wi-Fi",
  "Air conditioning",
  "Power outlets",
  "Parking",
  "Elevator access",
  "Lounging area",
  "Changing area",
  "Makeup station",
  "Kitchenette",
  "Wheelchair accessible",
] as const;

export const EQUIPMENT_PRESETS: Record<StudioCategory, string[]> = {
  photography: [
    "Cyclorama wall",
    "Continuous LED lights",
    "Softboxes",
    "Reflectors",
    "Light stands",
    "Backdrop papers",
    "Tripods",
    "Color gels",
  ],
  film: ["Cinema camera rig", "Lighting kit", "Sound recorders", "Grip & stands", "Green screen", "Teleprompter", "Dolly", "Monitors"],
  podcast: ["Broadcast microphones", "Boom arms", "Audio interface", "Mixer", "Headphones", "Acoustic panels", "SD recorders", "On-screen monitors"],
  music: ["Mixing console", "Studio monitors", "Condenser microphones", "Keyboard", "Electric & bass guitars", "Drum kit", "Headphone amp", "DAW workstation"],
  art: ["Work tables", "Easels", "Pottery wheel", "Kiln", "Drawing boards", "Storage shelving", "Utility sink", "Exhibition wall"],
};

export const LISTING_STATUS_META: Record<
  ListingStatus,
  { label: string; description: string; tone: "success" | "warning" | "muted" | "error" }
> = {
  draft: {
    label: "Draft",
    description: "Your listing isn't published yet.",
    tone: "muted",
  },
  active: {
    label: "Active",
    description: "Your listing is visible to creators.",
    tone: "success",
  },
  paused: {
    label: "Paused",
    description: "Your listing is temporarily unavailable for new bookings.",
    tone: "warning",
  },
  archived: {
    label: "Archived",
    description: "Your listing is no longer active.",
    tone: "error",
  },
};

export const BOOKING_STATUS_META: Record<
  BookingDisplayStatus,
  { label: string; description: string; tone: "success" | "warning" | "muted" | "error" | "info" }
> = {
  pending: {
    label: "Pending",
    description: "Your request is waiting for the host's approval.",
    tone: "warning",
  },
  confirmed: {
    label: "Confirmed",
    description: "Your host approved the request. Your booking is confirmed.",
    tone: "success",
  },
  completed: {
    label: "Completed",
    description: "Your booking has been completed.",
    tone: "muted",
  },
  cancelled: {
    label: "Cancelled",
    description: "This booking has been cancelled.",
    tone: "muted",
  },
  declined: {
    label: "Declined",
    description: "The host couldn't accommodate this request.",
    tone: "error",
  },
  expired: {
    label: "Expired",
    description: "This request expired before it was approved.",
    tone: "muted",
  },
};

export const CANCELLATION_POLICY_LABEL: Record<string, string> = {
  flexible: "Flexible — free cancellation up to 24 hours before the booking.",
  moderate: "Moderate — free cancellation up to 3 days before the booking.",
  strict: "Strict — cancellation requests are reviewed by the host.",
};

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** Booking flow guard message used when the selected slot disappears. */
export const SLOT_GONE = "This time slot is no longer available.";
