"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useSearchLocationsQuery } from "@/store/api/locationsApi";
import { useAppDispatch } from "@/store/hooks";
import { setCenter, setSelectedPin, setZoom } from "@/store/slices/mapSlice";
import type { NominatimLocation } from "@/store/api/locationsApi";

export function LocationSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const dispatch = useAppDispatch();

  // Simple debounce via timeout
  function handleChange(value: string) {
    setQuery(value);
    const t = setTimeout(() => setDebouncedQuery(value), 400);
    return () => clearTimeout(t);
  }

  const { data: results, isLoading, isFetching } = useSearchLocationsQuery(
    debouncedQuery,
    { skip: debouncedQuery.trim().length < 3 }
  );

  function selectLocation(loc: NominatimLocation) {
    const lat = parseFloat(loc.lat);
    const lon = parseFloat(loc.lon);
    dispatch(setCenter([lat, lon]));
    dispatch(setZoom(14));
    dispatch(
      setSelectedPin({
        lat,
        lon,
        label: loc.display_name,
      })
    );
    setQuery(loc.display_name.split(",")[0]);
    setDebouncedQuery("");
  }

  const showDropdown =
    debouncedQuery.length >= 3 && (isLoading || isFetching || (results && results.length > 0));

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
        <Input
          id="location-search-input"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Yer axtar... (min. 3 hərf)"
          className="pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
            }}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border bg-card shadow-lg overflow-hidden">
          {isLoading || isFetching ? (
            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Axtarılır...
            </div>
          ) : results?.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Nəticə tapılmadı</p>
          ) : (
            <ul className="divide-y max-h-72 overflow-y-auto">
              {results?.map((loc) => (
                <li key={loc.place_id}>
                  <button
                    type="button"
                    onClick={() => selectLocation(loc)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-tight">
                        {loc.display_name.split(",")[0]}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {loc.display_name}
                      </p>
                      {loc.type && (
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          {loc.type}
                        </Badge>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
