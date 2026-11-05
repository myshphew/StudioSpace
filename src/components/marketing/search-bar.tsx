"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants";
import { todayISO } from "@/lib/format";

/** Hero search — location, studio type and date hand off to /studios. */
export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (category && category !== "all") params.set("category", category);
    if (date) params.set("date", date);
    router.push(params.size > 0 ? `/studios?${params}` : "/studios");
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-3 lg:grid-cols-[1.4fr_1.3fr_1.2fr_auto]"
      aria-label="Find spaces"
    >
      <SearchField
        icon={<MapPin className="size-4 text-neutral-500" aria-hidden />}
        label="Location"
      >
        <div className="relative">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search city or area"
            className="rounded-none border-0 bg-neutral-50 pr-4 focus:shadow-[inset_0_0_0_2px_var(--color-neutral-950)]"
            aria-label="Where are you creating?"
          />
        </div>
      </SearchField>

      <SearchField
        icon={<Search className="size-4 text-neutral-500" aria-hidden />}
        label="Studio type"
      >
        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger
            className="rounded-none border-0 bg-neutral-50 focus:shadow-[inset_0_0_0_2px_var(--color-neutral-950)]"
            aria-label="What kind of space do you need?"
          >
            <SelectValue placeholder="All creative spaces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All creative spaces</SelectItem>
            {CATEGORY_ORDER.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_META[c].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SearchField>

      <SearchField
        icon={<CalendarDays className="size-4 text-neutral-500" aria-hidden />}
        label="Date"
      >
        <Input
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Choose a date"
          className="rounded-none border-0 bg-neutral-50 focus:shadow-[inset_0_0_0_2px_var(--color-neutral-950)]"
          aria-label="When do you need it?"
        />
      </SearchField>

      <div className="flex items-center bg-neutral-50 p-1.5 lg:pl-0">
        <Button type="submit" className="h-full w-full lg:w-auto">
          <Search className="size-4" aria-hidden />
          Find Spaces
        </Button>
      </div>
    </form>
  );
}

function SearchField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-1 bg-neutral-50 p-4">
      <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}
