"use client";

import { useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfessionalCard } from "./ProfessionalCard";
import EmptyState from "@/components/ui/EmptyState";

const mockProfessionals = [
  {
    id: 1,
    name: "Dr. Anuj Singh",
    profession: "Lawyer",
    expertise: "Consumer Rights, Human Rights",
    description: "I provide free preliminary legal guidance for consumer disputes and basic human rights awareness.",
    location: "Delhi NCR",
    showPhone: true,
  },
  {
    id: 2,
    name: "Mrs. Kavita Rai",
    profession: "Counselor",
    expertise: "Mental Health, Career Guidance",
    description: "Offering counseling sessions to students and young adults dealing with career anxiety and stress.",
    location: "Mumbai, Maharashtra",
    showPhone: false,
  },
  {
    id: 3,
    name: "Mr. Manoj Jain",
    profession: "Financial Advisor",
    expertise: "Financial Literacy, Scam Prevention",
    description: "Educating citizens on safe banking practices and how to identify and prevent financial frauds.",
    location: "Jaipur, Rajasthan",
    showPhone: true,
  },
  {
    id: 4,
    name: "Mr. Neeraj Kumar",
    profession: "IT Professional",
    expertise: "Digital Safety, Cybersecurity",
    description: "Conducting workshops and providing 1-on-1 support for cyber fraud victims to secure their digital footprint.",
    location: "Bangalore, Karnataka",
    showPhone: false,
  },
  {
    id: 5,
    name: "Dr. Smita Patel",
    profession: "Doctor",
    expertise: "General Medicine, Public Health",
    description: "Available for general health awareness consultations and guiding patients to appropriate medical facilities.",
    location: "Ahmedabad, Gujarat",
    showPhone: true,
  }
];

const categories = ["All", "Lawyer", "Doctor", "Counselor", "Financial Advisor", "IT Professional", "Teacher", "Social Worker"];

export const NeedHelpDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProfessionals = mockProfessionals.filter((prof) => {
    const matchesSearch = 
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prof.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || prof.profession === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-6">
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
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-light">
              <MapPin size={20} />
            </div>
            <select className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-bg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-[15px] appearance-none transition-all text-text">
              <option value="">All Locations</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
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
      {filteredProfessionals.length > 0 ? (
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
