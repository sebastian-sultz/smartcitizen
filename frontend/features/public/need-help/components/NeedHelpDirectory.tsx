"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { ProfessionalCard } from "./ProfessionalCard";
import { NeedHelpHeader } from "./NeedHelpHeader";
import { NeedHelpGate } from "./NeedHelpGate";
import EmptyState from "@/components/ui/EmptyState";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { getAllVolunteers, VolunteerResponse, VOLUNTEER_PROFESSIONS } from "@/features/public/volunteer";

export const NeedHelpDirectory = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [professionals, setProfessionals] = useState<VolunteerResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isLoading, setIsLoading] = useState(isLoggedIn);

  // Derive unique city options from fetched data — no hardcoding
  const uniqueLocations = useMemo(() => {
    const cities = professionals
      .map((vol) => vol.city)
      .filter((city): city is string => Boolean(city));
    return Array.from(new Set(cities)).sort();
  }, [professionals]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchVolunteers = async () => {
      try {
        const res = await getAllVolunteers();
        setProfessionals(res.volunteers || []);
      } catch (error) {
        console.error("Failed to load live volunteers:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVolunteers();
  }, [isLoggedIn]);

  // Show gate for non-authenticated visitors
  if (!isLoggedIn) {
    return (
      <div className="space-y-8">
        <NeedHelpHeader />
        <NeedHelpGate />
      </div>
    );
  }

  const filteredProfessionals = professionals.filter((vol) => {
    const location = [vol.city, vol.district].filter(Boolean).join(", ") || vol.address || "India";
    const profession = vol.profession || "";
    const experience = vol.experience || "";

    const matchesSearch =
      vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      profession.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      selectedLocation === "all" ||
      location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-8">
      <NeedHelpHeader />

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by name, expertise, or location..."
              icon={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
          </div>
          <div className="w-full md:w-[220px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger size="sm">
                <span className="flex items-center gap-2 text-text">
                  <Filter size={16} className="text-text-light shrink-0" />
                  <SelectValue placeholder="All Professions" />
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
          <div className="w-full md:w-[220px]">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger size="sm">
                <span className="flex items-center gap-2 text-text">
                  <MapPin size={16} className="text-text-light shrink-0" />
                  <SelectValue placeholder="All Locations" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((vol) => (
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
