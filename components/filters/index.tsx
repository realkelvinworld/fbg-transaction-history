"use client";

import {
  CalendarBlankIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCallback, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Search ---

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search transactions...",
}: SearchFilterProps) {
  const [local, setLocal] = useState(value);
  const [prev, setPrev] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // sync local when external value changes
  if (prev !== value) {
    setPrev(value);
    setLocal(value);
  }

  const handleChange = useCallback(
    (val: string) => {
      setLocal(val);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(val), 400);
    },
    [onChange],
  );

  return (
    <div className="relative">
      <MagnifyingGlassIcon
        weight="bold"
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 rounded-full"
      />
    </div>
  );
}

// --- Type ---

const TRANSACTION_TYPES = [
  { label: "All transactions", value: "all" },
  { label: "Debit only", value: "debit" },
  { label: "Credit only", value: "credit" },
];

interface TypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  const isActive = value !== "all";

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`rounded-full transition-colors ${
          isActive
            ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-600"
            : ""
        }`}
      >
        <SelectValue placeholder="All transactions" />
      </SelectTrigger>
      <SelectContent>
        {TRANSACTION_TYPES.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// --- Clear filters ---

interface ClearFiltersProps {
  filters: { type: string; from: string; to: string; search: string };
  onClear: () => void;
}

export function ClearFilters({ filters, onClear }: ClearFiltersProps) {
  const isActive =
    filters.type !== "all" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.search !== "";

  if (!isActive) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClear}
      className="gap-1.5 rounded-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
    >
      <XIcon weight="bold" className="size-3.5" />
      Clear
    </Button>
  );
}

// --- Date Range ---

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const isActive = from !== "" || to !== "";

  const selected: DateRange = {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  };

  const label = from
    ? to
      ? `${format(new Date(from), "MMM d")} – ${format(new Date(to), "MMM d, yyyy")}`
      : format(new Date(from), "MMM d, yyyy")
    : "Date range";

  function handleSelect(range: DateRange | undefined) {
    onChange(
      range?.from ? format(range.from, "yyyy-MM-dd") : "",
      range?.to ? format(range.to, "yyyy-MM-dd") : "",
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 rounded-full transition-colors ${
            isActive
              ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-600"
              : "text-muted-foreground"
          }`}
        >
          <CalendarBlankIcon weight="bold" className="size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}
