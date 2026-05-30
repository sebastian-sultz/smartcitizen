"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfessionalCard } from "./ProfessionalCard";
import { NeedHelpHeader } from "./NeedHelpHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

const categories = ["All", "Lawyer", "Doctor", "Counselor", "Financial Advisor", "IT Professional", "Teacher", "Social Worker"];

export const NeedHelpDirectory = () => {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await api.get<{ volunteers: any[] }>("/volunteers");
        const list = response.data.volunteers || [];
        const mapped = list.map((vol: any) => ({
          id: vol.id,
          name: vol.name,
          profession: vol.profession || "Volunteer Coordinator",
          expertise: vol.experience ? (vol.experience.length > 60 ? vol.experience.substring(0, 60) + "..." : vol.experience) : "Community Support",
          description: vol.experience || "Smart Citizen Coordinator assisting with community projects and guidance.",
          location: [vol.city, vol.district].filter(Boolean).join(", ") || vol.address || "India",
          photoUrl: vol.image || undefined,
          showPhone: true,
        }));
        setProfessionals(mapped);
      } catch (error) {
        console.error("Failed to load live volunteers:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch = 
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prof.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || prof.profession.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation = selectedLocation === "all" || prof.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-8">
      <NeedHelpHeader />
      
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-6 relative overflow-hidden">
        {/* Top official accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, expertise, or location..."
              icon={<Search size={20} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-[250px] relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-light z-10">
              <MapPin size={20} />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full h-14 pl-12 text-[15px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-text-muted" />
            <span className="text-[14px] font-bold text-text-muted uppercase tracking-wider">Categories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                variant={selectedCategory === cat ? "primary" : "secondary"}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full font-bold px-5 py-2 text-sm normal-case shadow-none"
              >
                {cat}
              </Button>
            ))}
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
          {filteredProfessionals.map((prof) => (
            <ProfessionalCard key={prof.id} {...prof} />
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
