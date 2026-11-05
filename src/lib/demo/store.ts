"use client";

/**
 * Demo data layer.
 *
 * The StudioSpace backend is a separate Express + MongoDB service, and this
 * build ships with a browser-persisted stand-in so every page works out of
 * the box. When the backend is connected, replace the bodies of these
 * functions with fetch calls — their signatures mirror the REST contract.
 *
 * Everything here is client-side demo data; don't treat it as security.
 */
import type {
  Booking,
  BookingStatus,
  CreateBookingInput,
  Studio,
  User,
} from "@/lib/types";
import { FICTIONAL_CREATORS, SEED_STUDIOS } from "@/lib/demo/studios";
import { addDaysISO, minutesOf, todayISO } from "@/lib/format";
import { hasOverlap } from "@/lib/schedule";

const STORAGE_KEY = "studiospace.demo.v1";
const SESSION_KEY = "studiospace.demo.session.v1";

export const DEMO_ACCOUNT = {
  email: "demo@studiospace.app",
  password: "demo-1234",
};

interface DemoUser extends User {
  password: string;
}

export interface OwnedStudio extends Studio {
  ownerId: string;
}

export interface DemoData {
  users: DemoUser[];
  bookings: Booking[];
  listings: OwnedStudio[];
  favorites: Record<string, string[]>;
  seededFor: string[];
  bookingSeq: number;
}

const EMPTY_DATA: DemoData = {
  users: [],
  bookings: [],
  listings: [],
  favorites: {},
  seededFor: [],
  bookingSeq: 0,
};

/* ------------------------------------------------------------------ */
/* tiny observable store (client only)                                 */
/* ------------------------------------------------------------------ */

let data: DemoData = EMPTY_DATA;
let hydrated = false;
const dataListeners = new Set<() => void>();

/** Load persisted storage exactly once; getSnapshot must be pure afterwards. */
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) data = { ...EMPTY_DATA, ...(JSON.parse(raw) as DemoData) };
    // Anything computed before hydration (like the session cache) is stale now.
    sessionSnapshot = null;
  } catch {
    data = EMPTY_DATA;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage blocked — demo keeps working in memory
  }
}

function emit() {
  sessionSnapshot = null;
  persist();
  dataListeners.forEach((l) => l());
}

export function subscribe(fn: () => void) {
  dataListeners.add(fn);
  return () => {
    dataListeners.delete(fn);
  };
}

export function getSnapshot(): DemoData {
  ensureHydrated();
  return data;
}

/* ------------------------------------------------------------------ */
/* auth                                                                */
/* ------------------------------------------------------------------ */

let sessionUserId: string | null = null;
let sessionChecked = false;
/** Sticky object so useSyncExternalStore gets stable identity between emits. */
let sessionSnapshot: { user: User | null; ready: boolean } | null = null;

export type AuthError =
  | "invalid_credentials"
  | "email_taken"
  | "weak_password"
  | "unknown";

function currentUserInternal(): User | null {
  const id = readSessionId();
  return id ? (getSnapshot().users.find((u) => u.id === id) ?? null) : null;
}

function readSessionId(): string | null {
  if (!sessionChecked) {
    sessionUserId = null;
    sessionChecked = true;
    if (typeof window !== "undefined") {
      try {
        sessionUserId = window.localStorage.getItem(SESSION_KEY);
      } catch {
        sessionUserId = null;
      }
    }
    const existing = sessionUserId
      ? getSnapshot().users.find((u) => u.id === sessionUserId)
      : undefined;
    if (!existing) sessionUserId = null;
  }
  return sessionUserId;
}

export function getSession(): { user: User | null } {
  return { user: currentUserInternal() };
}

/**
 * External-store view of the session: identity stays stable between
 * mutations (which call emit), so React's own subscription machinery can
 * reload it without setState-in-effect.
 */
export function getSessionSnapshot(): { user: User | null; ready: boolean } {
  ensureHydrated();
  if (sessionSnapshot === null) {
    sessionSnapshot = { user: currentUserInternal(), ready: true };
  }
  return sessionSnapshot;
}

export function signIn(email: string, password: string): { user?: User; error?: AuthError } {
  ensureHydrated();
  const user = getSnapshot().users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user || user.password !== password) return { error: "invalid_credentials" };
  sessionUserId = user.id;
  sessionChecked = true;
  try {
    window.localStorage.setItem(SESSION_KEY, user.id);
  } catch {
    /* storage blocked */
  }
  emit();
  ensureUserContent(user.id);
  return { user: stripPassword(user) };
}

export function signUp(input: {
  name: string;
  email: string;
  password: string;
}): { user?: User; error?: AuthError } {
  ensureHydrated();
  const email = input.email.trim().toLowerCase();
  if (getSnapshot().users.some((u) => u.email.toLowerCase() === email)) {
    return { error: "email_taken" };
  }
  if (input.password.length < 6) return { error: "weak_password" };
  const user: DemoUser = {
    id: `usr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e5).toString(36)}`,
    name: input.name.trim(),
    email,
    password: input.password,
    avatar: undefined,
    location: "",
    bio: "",
    createdAt: Date.now(),
  };
  data = { ...getSnapshot(), users: [...getSnapshot().users, user] };
  emit();
  ensureUserContent(user.id);
  return { user: stripPassword(user) };
}

export function signOut() {
  sessionUserId = null;
  sessionChecked = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }
  emit();
}

export function updateProfile(
  patch: Partial<Pick<User, "name" | "avatar" | "location" | "bio">>,
) {
  ensureHydrated();
  const id = readSessionId();
  if (!id) return;
  data = {
    ...getSnapshot(),
    users: data.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
  };
  emit();
}

/** Shallow copy without one key — keeps type narrowing lint-clean. */
function omitKey<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

function stripPassword(u: DemoUser): User {
  return omitKey(u, "password");
}

/* ------------------------------------------------------------------ */
/* demo content seeding                                                */
/* ------------------------------------------------------------------ */

function makeRef(): string {
  const seq = getSnapshot().bookingSeq + 1;
  data = { ...getSnapshot(), bookingSeq: seq };
  const year = new Date().getFullYear();
  return `SS-${year}-${String(seq).padStart(4, "0")}`;
}

export function ensureDemoAccount() {
  ensureHydrated();
  if (getSnapshot().users.some((u) => u.email === DEMO_ACCOUNT.email)) return;
  data = {
    ...getSnapshot(),
    users: [
      ...getSnapshot().users,
      {
        id: "demo-user",
        name: "Farhana Islam",
        email: DEMO_ACCOUNT.email,
        password: DEMO_ACCOUNT.password,
        avatar: undefined,
        location: "Dhaka, Bangladesh",
        bio: "Creator working across photography and film. This demo workspace is filled with fictional data.",
        createdAt: Date.now(),
      },
    ],
  };
  emit();
  ensureUserContent("demo-user");
}

function standardWeek(): Studio["weeklyHours"] {
  return {
    0: null,
    1: { open: "10:00", close: "20:00" },
    2: { open: "10:00", close: "20:00" },
    3: { open: "10:00", close: "20:00" },
    4: { open: "10:00", close: "20:00" },
    5: { open: "10:00", close: "20:00" },
    6: { open: "11:00", close: "19:00" },
  };
}

function seededHostName(userId: string) {
  return getSnapshot().users.find((u) => u.id === userId)?.name ?? "You";
}

/**
 * Fill a freshly signed-in demo account with plausible content:
 * two owned listings (one active, one draft), bookings in every status,
 * incoming requests, and a few favorites.
 */
function ensureUserContent(userId: string) {
  ensureHydrated();
  if (getSnapshot().seededFor.includes(userId)) return;
  const today = todayISO();
  const host = (studioId: string) => `host-of-${studioId}`;

  const ownA: OwnedStudio = {
    ...SEED_STUDIOS[0],
    id: `own-${userId}-photography`,
    name: "Corner Frame Studio",
    tagline: "A compact daylight corner studio for portraits and product work.",
    description:
      "Corner Frame is a favourite of homegrown brands: a white cyclorama corner, a table-top rig and a changing curtain in the back.\n\nIt fits one photographer and two subjects comfortably, which keeps hourly costs friendly for smaller projects.\n\nHosted in a quiet apartment building with lift access.",
    highlights: [
      "White cyclorama corner with soft daylight.",
      "Table-top rig for product shots.",
      "Changing curtain and mirror.",
      "Lift access in a quiet building.",
      "Walking distance from two parking garages.",
    ],
    city: "Dhaka",
    area: "Mohakhali DOHS",
    address: "Road 4, DOHS, Mohakhali, Dhaka 1206, Bangladesh",
    capacity: 5,
    sizeSqft: 420,
    hourlyRate: 1400,
    securityDeposit: 900,
    minHours: 2,
    maxHours: 8,
    cancellationPolicy: "moderate",
    rating: 4.6,
    reviewCount: 5,
    images: [SEED_STUDIOS[0].images[1], SEED_STUDIOS[0].images[2], SEED_STUDIOS[0].images[3]],
    equipment: ["Softboxes", "Light stands", "Backdrop papers", "Tripods", "Reflectors"],
    amenities: ["Air conditioning", "Wi-Fi", "Changing area", "Power outlets", "Elevator access"],
    weeklyHours: standardWeek(),
    unavailableDates: [],
    advanceWindowDays: 30,
    status: "active",
    featured: false,
    host: {
      name: seededHostName(userId),
      memberSince: "January 2026",
      bio: "Your demo listing. Edit details, pricing and availability from the Edit Studio page.",
    },
    ownerId: userId,
  };

  const ownB: OwnedStudio = {
    ...SEED_STUDIOS[4],
    id: `own-${userId}-podcast`,
    name: "Second Voice Recording Room",
    tagline: "A work-in-progress podcast room saved as a draft listing.",
    description:
      "This is a draft listing saved from the Add Studio flow.\n\nFinish pricing, photos and availability, then publish it when you're ready — or keep it as a draft until the room is tuned.",
    highlights: [
      "Acoustic panels up, furniture arriving.",
      "Draft saved from the Add Studio wizard.",
      "Finish and publish from My Listings.",
    ],
    city: "Dhaka",
    area: "Mirpur",
    address: "Block C, Mirpur 10, Dhaka 1216, Bangladesh",
    capacity: 4,
    sizeSqft: 380,
    hourlyRate: 1100,
    securityDeposit: 600,
    minHours: 1,
    maxHours: 6,
    cancellationPolicy: "flexible",
    rating: 0,
    reviewCount: 0,
    images: [SEED_STUDIOS[4].images[0]],
    equipment: ["Broadcast microphones", "Boom arms", "Audio interface"],
    amenities: ["Air conditioning", "Wi-Fi", "Power outlets"],
    weeklyHours: standardWeek(),
    unavailableDates: [],
    advanceWindowDays: 21,
    status: "draft",
    featured: false,
    host: {
      name: seededHostName(userId),
      memberSince: "January 2026",
      bio: "Draft listing for testing the publishing flow.",
    },
    ownerId: userId,
  };

  const myBookings: Booking[] = [
    {
      id: "bkg-seed-1",
      reference: makeRef(),
      studioId: SEED_STUDIOS[0].id,
      creatorId: userId,
      creatorName: ownA.host.name,
      creatorEmail: "",
      hostId: host(SEED_STUDIOS[0].id),
      message:
        "Half-day product shoot for a home fragrance line. We'd need the cyclorama from morning.",
      date: addDaysISO(today, 5),
      start: "10:00",
      hours: 3,
      hourlyRate: SEED_STUDIOS[0].hourlyRate,
      securityDeposit: SEED_STUDIOS[0].securityDeposit,
      total: 3 * SEED_STUDIOS[0].hourlyRate,
      status: "pending",
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: "bkg-seed-2",
      reference: makeRef(),
      studioId: SEED_STUDIOS[4].id,
      creatorId: userId,
      creatorName: ownA.host.name,
      creatorEmail: "",
      hostId: host(SEED_STUDIOS[4].id),
      message:
        "Recording the first two episodes of a series about independent music.",
      date: addDaysISO(today, 9),
      start: "15:00",
      hours: 2,
      hourlyRate: SEED_STUDIOS[4].hourlyRate,
      securityDeposit: SEED_STUDIOS[4].securityDeposit,
      total: 2 * SEED_STUDIOS[4].hourlyRate,
      status: "confirmed",
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: "bkg-seed-3",
      reference: makeRef(),
      studioId: SEED_STUDIOS[1].id,
      creatorId: userId,
      creatorName: ownA.host.name,
      creatorEmail: "",
      hostId: host(SEED_STUDIOS[1].id),
      date: addDaysISO(today, -8),
      start: "11:00",
      hours: 2,
      hourlyRate: SEED_STUDIOS[1].hourlyRate,
      securityDeposit: SEED_STUDIOS[1].securityDeposit,
      total: 2 * SEED_STUDIOS[1].hourlyRate,
      status: "confirmed",
      createdAt: Date.now() - 12 * 86400000,
    },
    {
      id: "bkg-seed-4",
      reference: makeRef(),
      studioId: SEED_STUDIOS[7].id,
      creatorId: userId,
      creatorName: ownA.host.name,
      creatorEmail: "",
      hostId: host(SEED_STUDIOS[7].id),
      message: "Workshop planning visit.",
      date: addDaysISO(today, -3),
      start: "14:00",
      hours: 2,
      hourlyRate: SEED_STUDIOS[7].hourlyRate,
      securityDeposit: SEED_STUDIOS[7].securityDeposit,
      total: 2 * SEED_STUDIOS[7].hourlyRate,
      status: "cancelled",
      createdAt: Date.now() - 9 * 86400000,
    },
    {
      id: "bkg-seed-5",
      reference: makeRef(),
      studioId: SEED_STUDIOS[6].id,
      creatorId: userId,
      creatorName: ownA.host.name,
      creatorEmail: "",
      hostId: host(SEED_STUDIOS[6].id),
      message: "Full band rehearsal with the kit.",
      date: addDaysISO(today, -1),
      start: "18:00",
      hours: 3,
      hourlyRate: SEED_STUDIOS[6].hourlyRate,
      securityDeposit: SEED_STUDIOS[6].securityDeposit,
      total: 3 * SEED_STUDIOS[6].hourlyRate,
      status: "declined",
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      id: "bkg-seed-6",
      reference: makeRef(),
      studioId: SEED_STUDIOS[3].id,
      creatorId: userId,
      creatorName: ownA.host.name,
      creatorEmail: "",
      hostId: host(SEED_STUDIOS[3].id),
      message: "Neon portrait series.",
      date: addDaysISO(today, -2),
      start: "16:00",
      hours: 2,
      hourlyRate: SEED_STUDIOS[3].hourlyRate,
      securityDeposit: SEED_STUDIOS[3].securityDeposit,
      total: 2 * SEED_STUDIOS[3].hourlyRate,
      status: "pending",
      createdAt: Date.now() - 20 * 86400000,
    },
  ];

  const incoming: Booking[] = FICTIONAL_CREATORS.slice(0, 4).map((creator, i) => {
    const statuses: BookingStatus[] = ["pending", "pending", "confirmed", "declined"];
    const dayOffsets = [4, 7, 2, -4];
    const starts = ["09:00", "13:00", "11:00", "10:00"];
    const hoursList = [4, 3, 2, 3];
    const messages = [
      "Launching a ceramics label this month. We need clean daylight for the first catalogue — 4 hours should cover it.",
      "Headshot session for our engineering team — eleven people across the afternoon, if the space allows.",
      undefined,
      "Content batches for a fashion drop.",
    ];
    return {
      id: `bkg-in-${userId}-${i + 1}`,
      reference: makeRef(),
      studioId: ownA.id,
      creatorId: "fictional",
      creatorName: creator.name,
      creatorEmail: creator.email,
      hostId: userId,
      message: messages[i],
      date: addDaysISO(today, dayOffsets[i]),
      start: starts[i],
      hours: hoursList[i],
      hourlyRate: ownA.hourlyRate,
      securityDeposit: ownA.securityDeposit,
      total: hoursList[i] * ownA.hourlyRate,
      status: statuses[i],
      createdAt: Date.now() - (i + 1) * 86400000,
    };
  });

  data = {
    ...getSnapshot(),
    seededFor: [...getSnapshot().seededFor, userId],
    listings: [...getSnapshot().listings, ownA, ownB],
    bookings: [...getSnapshot().bookings, ...myBookings, ...incoming],
    favorites: {
      ...getSnapshot().favorites,
      [userId]: [SEED_STUDIOS[2].id, SEED_STUDIOS[4].id],
    },
  };
  emit();
}

/* ------------------------------------------------------------------ */
/* studios                                                             */
/* ------------------------------------------------------------------ */

export function allStudios(): Studio[] {
  ensureHydrated();
  return [...SEED_STUDIOS, ...getSnapshot().listings.map(asPublicStudio)];
}

function asPublicStudio(l: OwnedStudio): Studio {
  return omitKey(l, "ownerId") as Studio;
}

export function getStudioById(id: string): Studio | undefined {
  ensureHydrated();
  const owned = getSnapshot().listings.find((l) => l.id === id);
  if (owned) return asPublicStudio(owned);
  return SEED_STUDIOS.find((s) => s.id === id);
}

export function isOwnedBy(studioId: string, userId: string) {
  ensureHydrated();
  return getSnapshot().listings.some(
    (l) => l.id === studioId && l.ownerId === userId,
  );
}

export function getMyListings(userId: string): OwnedStudio[] {
  ensureHydrated();
  return getSnapshot().listings.filter((l) => l.ownerId === userId);
}

export function createListing(studio: Studio, userId: string) {
  ensureHydrated();
  data = {
    ...getSnapshot(),
    listings: [...getSnapshot().listings, { ...studio, ownerId: userId }],
  };
  emit();
}

export function updateListing(id: string, patch: Partial<Studio>) {
  ensureHydrated();
  data = {
    ...getSnapshot(),
    listings: getSnapshot().listings.map((l) => (l.id === id ? { ...l, ...patch } : l)),
  };
  emit();
}

export function setListingStatus(id: string, status: OwnedStudio["status"]) {
  updateListing(id, { status });
}

/* ------------------------------------------------------------------ */
/* bookings                                                            */
/* ------------------------------------------------------------------ */

export type BookingResult = { ok: true; booking: Booking } | { ok: false; error: string };

export function bookingConflicts(
  studioId: string,
  date: string,
  start: string,
  hours: number,
): boolean {
  ensureHydrated();
  const studio = getStudioById(studioId);
  if (!studio) return false;
  return hasOverlap(studio, date, start, hours, getSnapshot().bookings);
}

export function createBooking(
  input: CreateBookingInput,
  user: User,
): BookingResult {
  ensureHydrated();
  const studio = getStudioById(input.studioId);
  if (!studio) return { ok: false, error: "Unable to load studio details." };
  if (isOwnedBy(studio.id, user.id)) {
    return { ok: false, error: "You can't book your own studio." };
  }
  if (studio.status !== "active") {
    return { ok: false, error: "This time slot is no longer available." };
  }
  if (bookingConflicts(studio.id, input.date, input.start, input.hours)) {
    return { ok: false, error: "This time slot is no longer available." };
  }

  const booking: Booking = {
    id: `bkg-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`,
    reference: makeRef(),
    studioId: studio.id,
    creatorId: user.id,
    creatorName: user.name,
    creatorEmail: user.email,
    hostId: `host-of-${studio.id}`,
    message: input.message,
    date: input.date,
    start: input.start,
    hours: input.hours,
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit,
    total: input.hours * studio.hourlyRate,
    status: "pending",
    createdAt: Date.now(),
  };
  data = { ...getSnapshot(), bookings: [...getSnapshot().bookings, booking] };
  emit();
  return { ok: true, booking };
}

export function getMyBookings(userId: string): Booking[] {
  ensureHydrated();
  return getSnapshot()
    .bookings.filter((b) => b.creatorId === userId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Incoming requests for studios owned by `userId`. */
export function getIncomingRequests(userId: string): Booking[] {
  ensureHydrated();
  const mine = new Set(getMyListings(userId).map((l) => l.id));
  return getSnapshot()
    .bookings.filter((b) => mine.has(b.studioId))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function acceptBooking(id: string): { ok: true } | { ok: false; error: string } {
  ensureHydrated();
  const booking = getSnapshot().bookings.find((b) => b.id === id);
  if (!booking || booking.status !== "pending") {
    return { ok: false, error: "This time slot is no longer available." };
  }
  // Confirmed bookings own their slot. Pending requests don't — the host can
  // accept either of two overlapping requests, the second accept then fails.
  const startMin = minutesOf(booking.start);
  const endMin = startMin + booking.hours * 60;
  const clashesConfirmed = getSnapshot().bookings.some(
    (b) =>
      b.id !== id &&
      b.studioId === booking.studioId &&
      b.date === booking.date &&
      b.status === "confirmed" &&
      startMin < minutesOf(b.start) + b.hours * 60 &&
      endMin > minutesOf(b.start),
  );
  if (clashesConfirmed) {
    return { ok: false, error: "This time slot is no longer available." };
  }
  data = {
    ...getSnapshot(),
    bookings: getSnapshot().bookings.map((b) =>
      b.id === id ? { ...b, status: "confirmed" as const } : b,
    ),
  };
  emit();
  return { ok: true };
}

export function declineBooking(id: string): { ok: true } | { ok: false; error: string } {
  ensureHydrated();
  const booking = getSnapshot().bookings.find((b) => b.id === id);
  if (!booking || booking.status !== "pending") {
    return { ok: false, error: "This time slot is no longer available." };
  }
  data = {
    ...getSnapshot(),
    bookings: getSnapshot().bookings.map((b) =>
      b.id === id ? { ...b, status: "declined" as const } : b,
    ),
  };
  emit();
  return { ok: true };
}

export function cancelBooking(
  id: string,
  userId: string,
): { ok: true } | { ok: false; error: string } {
  ensureHydrated();
  const booking = getSnapshot().bookings.find((b) => b.id === id);
  if (!booking || booking.creatorId !== userId) {
    return { ok: false, error: "You don't have permission to perform this action." };
  }
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return { ok: false, error: "This booking can't be cancelled." };
  }
  data = {
    ...getSnapshot(),
    bookings: getSnapshot().bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b,
    ),
  };
  emit();
  return { ok: true };
}

/** Display status: completed bookings in the past, expired pending requests. */
export type DisplayStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "declined"
  | "expired";

export function displayStatus(b: Booking): DisplayStatus {
  const today = todayISO();
  if (b.status === "pending" && b.date < today) return "expired";
  if (b.status === "confirmed" && b.date < today) return "completed";
  return b.status;
}

/* ------------------------------------------------------------------ */
/* favorites                                                           */
/* ------------------------------------------------------------------ */

export function getFavorites(userId: string): string[] {
  ensureHydrated();
  return getSnapshot().favorites[userId] ?? [];
}

export function isFavorite(studioId: string, userId: string) {
  return getFavorites(userId).includes(studioId);
}

export function toggleFavorite(studioId: string, userId: string): "added" | "removed" {
  ensureHydrated();
  const current = getSnapshot().favorites[userId] ?? [];
  const next = current.includes(studioId)
    ? current.filter((id) => id !== studioId)
    : [...current, studioId];
  data = {
    ...getSnapshot(),
    favorites: { ...getSnapshot().favorites, [userId]: next },
  };
  emit();
  return next.includes(studioId) ? "added" : "removed";
}

/* ------------------------------------------------------------------ */
/* misc                                                                */
/* ------------------------------------------------------------------ */

export interface AvailabilitySummary {
  openWeekdays: number;
  hasUnavailableDates: boolean;
  nextUnavailableDate: string | null;
}

export function availabilitySummary(studio: Studio): AvailabilitySummary {
  const openWeekdays = ([0, 1, 2, 3, 4, 5, 6] as const).filter(
    (d) => studio.weeklyHours[d] !== null,
  ).length;
  const today = todayISO();
  const nextUnavailableDate =
    studio.unavailableDates.filter((d) => d >= today).sort()[0] ?? null;
  return { openWeekdays, hasUnavailableDates: studio.unavailableDates.length > 0, nextUnavailableDate };
}
