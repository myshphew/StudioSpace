"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Banknote } from "lucide-react";
import Link from "next/link";
import type { StudioCategory } from "@/lib/types";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { AMENITIES_LIBRARY, CATEGORY_META, CATEGORY_ORDER, SORT_OPTIONS, type SortValue } from "@/lib/constants";
import { useAvailabilityFor } from "@/lib/hooks";
import { formatBDT } from "@/lib/format";
import { StudioCard } from "@/components/studio/studio-card";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface Filters {
  search: string;
  location: string;
  category: StudioCategory | "all";
  maxPrice: number;
  minCapacity: number;
  amenities: string[];
  date: string;
  minRating: number;
  sort: SortValue;
}

const DEFAULTS: Filters = {
  search: "",
  location: "",
  category: "all",
  maxPrice: 5000,
  minCapacity: 0,
  amenities: [],
  date: "",
  minRating: 0,
  sort: "recommended",
};

const MAX_PRICE = 5000;
const PRICE_STEP = 100;

export function StudiosBrowser() {
  const params = useSearchParams();

  const [advanced, setAdvanced] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULTS,
    search: params.get("search") ?? "",
    location: params.get("location") ?? "",
    category: (params.get("category") as StudioCategory | null) ?? "all",
    date: params.get("date") ?? "",
  }));

  const patch = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));
  const reset = () => {
    setFilters({ ...DEFAULTS });
  };

  const visible = useMemo(() => {
    let list = SEED_STUDIOS.filter((s) => s.status === "active");

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((s) =>
        [s.name, s.city, s.area, s.tagline, s.description]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (filters.location.trim()) {
      const q = filters.location.trim().toLowerCase();
      list = list.filter((s) => `${s.area} ${s.city} ${s.address}`.toLowerCase().includes(q));
    }
    if (filters.category !== "all") {
      list = list.filter((s) => s.category === filters.category);
    }
    list = list.filter((s) => s.hourlyRate <= filters.maxPrice);
    if (filters.minCapacity > 0) {
      list = list.filter((s) => s.capacity >= filters.minCapacity);
    }
    if (filters.amenities.length > 0) {
      list = list.filter((s) =>
        filters.amenities.every((a) =>
          [...s.amenities, ...s.equipment].some((x) => x.toLowerCase() === a.toLowerCase()),
        ),
      );
    }
    if (filters.minRating > 0) {
      list = list.filter((s) => s.rating >= filters.minRating);
    }

    switch (filters.sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount,
        );
        break;
    }
    return list;
  }, [filters]);

  const availability = useAvailabilityFor(visible);

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.location.trim() ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.minCapacity > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxPrice < MAX_PRICE ? 1 : 0) +
    (filters.date ? 1 : 0);

  const categoryFilteredEmpty =
    filters.category !== "all" && visible.length === 0 && !filters.search.trim();

  return (
    <div className="flex flex-col gap-10 py-12 sm:py-14">
      {/* Search + sort row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" aria-hidden />
          <Input
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
            placeholder="Search studios, locations or keywords..."
            className="pl-11"
            aria-label="Search studios, locations or keywords"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={advanced || activeFilterCount > 0 ? "dark" : "secondary"}
            onClick={() => setAdvanced((v) => !v)}
            aria-expanded={advanced}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {activeFilterCount > 0 ? (
              <span className="rounded-xs bg-brand-orange px-1.5 font-semibold text-brand-charcoal">
                {activeFilterCount}
              </span>
            ) : null}
          </Button>
          <Select
            value={filters.sort}
            onValueChange={(v) => patch({ sort: v as SortValue })}
          >
            <SelectTrigger className="w-52" aria-label="Sort results">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced filters */}
      {advanced ? (
        <div className="grid gap-5 rounded-md border border-neutral-200 bg-neutral-50 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-location">Location</Label>
            <Input
              id="filter-location"
              value={filters.location}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="Gulshan, Banani, Dhanmondi..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Studio category</Label>
            <Select
              value={filters.category}
              onValueChange={(v) => patch({ category: v as StudioCategory | "all" })}
            >
              <SelectTrigger aria-label="Studio category">
                {filters.category === "all" ? (
                  "All categories"
                ) : (
                  CATEGORY_META[filters.category].label
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-capacity">Minimum capacity</Label>
            <Select
              value={String(filters.minCapacity)}
              onValueChange={(v) => patch({ minCapacity: Number(v) })}
            >
              <SelectTrigger aria-label="Minimum capacity">
                {filters.minCapacity === 0 ? "Any size" : `${filters.minCapacity}+ people`}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any size</SelectItem>
                <SelectItem value="5">5+ people</SelectItem>
                <SelectItem value="10">10+ people</SelectItem>
                <SelectItem value="15">15+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-price">Max hourly rate</Label>
            <div className="flex items-center gap-3">
              <input
                id="filter-price"
                type="range"
                min={500}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={filters.maxPrice}
                onChange={(e) => patch({ maxPrice: Number(e.target.value) })}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-950"
                aria-label="Maximum hourly rate"
              />
              <span className="flex w-20 items-center gap-1 text-sm font-semibold text-neutral-950">
                <Banknote className="size-4 text-neutral-500" aria-hidden />
                {formatBDT(filters.maxPrice, { compact: true })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-date">Available on</Label>
            <Input
              id="filter-date"
              type="date"
              value={filters.date}
              onChange={(e) => patch({ date: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Minimum rating</Label>
            <Select
              value={String(filters.minRating)}
              onValueChange={(v) => patch({ minRating: Number(v) })}
            >
              <SelectTrigger aria-label="Minimum rating">
                {filters.minRating === 0 ? "Any rating" : `${filters.minRating}+ stars`}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any rating</SelectItem>
                <SelectItem value="4">4.0+ stars</SelectItem>
                <SelectItem value="4.5">4.5+ stars</SelectItem>
                <SelectItem value="4.8">4.8+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Label>Amenities & equipment</Label>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by amenities">
              {FILTERABLE_TAGS.map((a) => {
                const active = filters.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      patch({
                        amenities: active
                          ? filters.amenities.filter((x) => x !== a)
                          : [...filters.amenities, a],
                      })
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                      active
                        ? "border-neutral-950 bg-neutral-950 text-brand-canvas"
                        : "border-neutral-300 bg-transparent text-neutral-700 hover:border-neutral-500",
                    )}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 sm:col-span-2 lg:col-span-3">
            <Button variant="ghost" onClick={reset}>
              Reset Filters
            </Button>
          </div>
        </div>
      ) : null}

      <p className="text-sm font-medium text-neutral-600" aria-live="polite">
        {visible.length} {visible.length === 1 ? "space" : "spaces"} to explore
      </p>

      {/* Results */}
      {visible.length === 0 ? (
        categoryFilteredEmpty ? (
          <EmptyState
            title="Nothing here just yet."
            description="We're still making room for more creative spaces in this category. Try exploring other spaces in the meantime."
            action={
              <Button asChild>
                <Link href="/studios">Explore All Studios</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No spaces found. Yet."
            description="We couldn't find a match for your search. Try changing your filters or exploring another location."
            action={
              <Button onClick={reset}>Clear Filters</Button>
            }
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((studio, i) => (
            <StudioCard
              key={studio.id}
              studio={studio}
              availability={availability[studio.id] ?? "check"}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const A_DEMO_EQUIPMENT = [
  "Cyclorama wall",
  "Softboxes",
  "Broadcast microphones",
  "Drum kit",
  "Green screen",
] as const;

const FILTERABLE_TAGS: string[] = [...AMENITIES_LIBRARY, ...A_DEMO_EQUIPMENT];
