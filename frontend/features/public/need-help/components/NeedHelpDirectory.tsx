"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Building2,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfessionalCard } from "./ProfessionalCard";
import { NeedHelpHeader } from "./NeedHelpHeader";
import { NeedHelpGate } from "./NeedHelpGate";
import EmptyState from "@/components/ui/EmptyState";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import {
  getAllVolunteers,
  VolunteerResponse,
  VOLUNTEER_PROFESSIONS,
  INDIAN_STATES,
} from "@/features/public/volunteer";

export const NeedHelpDirectory = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [professionals, setProfessionals] = useState<VolunteerResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(isLoggedIn);

  // Derive unique cities/districts dynamically from fetched coordinator data
  const availableCities = useMemo(() => {
    const subset =
      selectedState === "All"
        ? professionals
        : professionals.filter(
            (vol) =>
              (vol.state || "").toLowerCase() === selectedState.toLowerCase(),
          );

    const cities = subset
      .flatMap((vol) => [vol.city, vol.district])
      .filter((c): c is string => typeof c === "string" && c.trim().length > 0);

    return Array.from(new Set(cities.map((c) => c.trim()))).sort();
  }, [professionals, selectedState]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true);
        const res = await getAllVolunteers({
          search: searchTerm,
          profession: selectedCategory,
          state: selectedState,
          city: selectedCity,
          sort: sortBy,
        });
        setProfessionals(res.volunteers || []);
      } catch (error) {
        console.error("Failed to load live volunteers:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search term typing slightly for optimal database performance
    const timer = setTimeout(() => {
      fetchVolunteers();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    isLoggedIn,
    searchTerm,
    selectedCategory,
    selectedState,
    selectedCity,
    sortBy,
  ]);

  // Reset city selection if chosen state changes and current city is no longer in state
  const handleStateChange = (stateVal: string) => {
    setSelectedState(stateVal);
    setSelectedCity("All");
  };

  // Show gate for non-authenticated visitors
  if (!isLoggedIn) {
    return (
      <div className="space-y-8">
        <NeedHelpHeader />
        <NeedHelpGate />
      </div>
    );
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    selectedState !== "All" ||
    selectedCity !== "All";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedState("All");
    setSelectedCity("All");
    setSortBy("newest");
  };

  return (
    <div className="space-y-8">
      <NeedHelpHeader />

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Search Input */}
          <div className="w-full">
            <Input
              placeholder="Search name, skill, pincode..."
              icon={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
          </div>

          {/* Profession Category Filter */}
          <div className="w-full">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger size="sm">
                <span className="flex items-center gap-2 text-text min-w-0 overflow-hidden">
                  <Filter size={16} className="text-text-light shrink-0" />
                  <span className="truncate">
                    <SelectValue placeholder="All Professions" />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Professions</SelectItem>
                {VOLUNTEER_PROFESSIONS.map((prof) => (
                  <SelectItem key={prof} value={prof}>
                    {prof}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div className="w-full">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger size="sm">
                <span className="flex items-center gap-2 text-text min-w-0 overflow-hidden">
                  <Building2 size={16} className="text-text-light shrink-0" />
                  <span className="truncate">
                    <SelectValue placeholder="All States" />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All States</SelectItem>
                {INDIAN_STATES.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City / District Filter */}
          <div className="w-full">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger size="sm">
                <span className="flex items-center gap-2 text-text min-w-0 overflow-hidden">
                  <MapPin size={16} className="text-text-light shrink-0" />
                  <span className="truncate">
                    <SelectValue placeholder="All Cities" />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                {availableCities.map((ct) => (
                  <SelectItem key={ct} value={ct}>
                    {ct}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger size="sm">
                <span className="flex items-center gap-2 text-text min-w-0 overflow-hidden">
                  <ArrowUpDown size={16} className="text-text-light shrink-0" />
                  <span className="truncate">
                    <SelectValue placeholder="Sort By" />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="name_asc">Name (A to Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z to A)</SelectItem>
                <SelectItem value="profession">Profession (A to Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-text-muted">
            <span>
              Found <strong>{professionals.length}</strong> matching
              coordinator(s)
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              startIcon={<X size={12} />}
              className="p-0 h-auto font-bold text-primary hover:bg-transparent hover:underline"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      ) : professionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((vol) => (
            <ProfessionalCard key={vol.id} {...vol} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No volunteers found"
          description="We couldn't find any volunteers matching your search criteria. Try adjusting your filters."
        />
      )}
    </div>
  );
};
