"use client";

import { useEffect, useState } from "react";
import { MemberProfile, DashboardStats } from "../types";
import { getMemberProfile, updateMemberProfile, getDashboardStats } from "../api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Building 
} from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

import ProfileEditForm from "./ProfileEditForm";
import SocialLinks from "./SocialLinks";
import VolunteerPreferences from "./VolunteerPreferences";

export default function ProfileView() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [dbStats, setDbStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profData, stats] = await Promise.all([
        getMemberProfile(),
        getDashboardStats()
      ]);
      setProfile(profData);
      setDbStats(stats);
    } catch (err) {
      console.error("Failed to load profile context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileSave = async (updatedFields: Partial<MemberProfile>) => {
    try {
      const updated = await updateMemberProfile(updatedFields);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile modifications:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const userInitials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "SC";

  const formattedDOB = profile.dob
    ? formatDate(profile.dob, "long-in")
    : "Not Configured";

  const formattedJoinDate = profile.joinDate
    ? formatDate(profile.joinDate, "long-in")
    : "";

  return (
    <div className="space-y-8">
      {/* Top Banner Profile Summary */}
      <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-r from-primary/15 to-primary/5" />
        
        <CardContent className="pt-20 pb-8 px-6 sm:px-10 relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center font-bold text-3xl text-primary shrink-0 font-display relative">
            {profile.profilePhoto ? (
              <Image 
                src={profile.profilePhoto} 
                alt={profile.name} 
                fill
                className="object-cover" 
                sizes="96px"
              />
            ) : (
              userInitials
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-2 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="font-display text-2xl font-black text-text truncate">
                {profile.name}
              </h2>
              <div className="flex gap-1.5 justify-center sm:justify-start">
                <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wide px-2">
                  Active
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[9px] uppercase tracking-wide px-2">
                  {profile.userType === "admin" ? "Coordinator Admin" : "Smart Citizen"}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm font-mono text-primary font-bold">{profile.memberId}</p>
            
            {formattedJoinDate && (
              <p className="text-text-muted text-xs font-medium">
                Registered on <span className="font-bold">{formattedJoinDate}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Center Column */}
        <div className="lg:col-span-2 space-y-8">
          {isEditing ? (
            <ProfileEditForm 
              profile={profile} 
              onSave={handleProfileSave} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <Card className="rounded-[40px] border-primary/5 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <h3 className="font-display text-lg font-bold text-text">Personal Details</h3>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    startIcon={<Edit3 size={13} />}
                  >
                    Edit Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Mail size={14} className="text-primary/70" />
                      Email Address
                    </span>
                    <p className="font-semibold text-text">{profile.email}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Phone size={14} className="text-primary/70" />
                      Mobile Number
                    </span>
                    <p className="font-semibold text-text">{profile.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Calendar size={14} className="text-primary/70" />
                      Date of Birth
                    </span>
                    <p className="font-semibold text-text">{formattedDOB}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <MapPin size={14} className="text-primary/70" />
                      Residential Address
                    </span>
                    <p className="font-semibold text-text leading-relaxed">
                      {profile.address || "Not Set"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Building size={14} className="text-primary/70" />
                      City & Pincode
                    </span>
                    <p className="font-semibold text-text">
                      {profile.city ? `${profile.city} - ${profile.pincode}` : "Not Set"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Building size={14} className="text-primary/70" />
                      District / State
                    </span>
                    <p className="font-semibold text-text">
                      {profile.district ? `${profile.district}, ${profile.state}` : "Not Set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <VolunteerPreferences 
            profile={profile} 
            volunteerStatus={dbStats?.volunteerStatus || "not_applied"} 
          />
        </div>

        {/* Right Column (Social Profiles) */}
        <div className="space-y-8">
          <SocialLinks profile={profile} onSave={handleProfileSave} />
        </div>

      </div>
    </div>
  );
}
