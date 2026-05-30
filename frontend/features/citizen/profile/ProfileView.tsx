"use client";

import { useEffect, useState } from "react";
import { UpdateVolunteerPayload } from "../types";
import {
  useCitizenStore,
  selectVolunteerStatus,
} from "@/store/citizenStore";
import { updateVolunteer } from "../api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Building,
} from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

import ProfileEditForm from "./ProfileEditForm";
import SocialLinks from "./SocialLinks";
import VolunteerPreferences from "./VolunteerPreferences";

export default function ProfileView() {
  const {
    user: profile,
    volunteer,
    loading: storeLoading,
    fetchProfile,
    refreshProfile,
    setVolunteer,
  } = useCitizenStore();
  const volunteerStatus = useCitizenStore(selectVolunteerStatus);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSave = async (updatedFields: UpdateVolunteerPayload) => {
    try {
      if (volunteer) {
        const res = await updateVolunteer(volunteer.id, updatedFields);
        setVolunteer(res.volunteer);
      }
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile modifications:", err);
      throw err;
    }
  };

  if (storeLoading) {
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

  const formattedDOB = "Not Configured";

  const formattedJoinDate = profile.created_at
    ? formatDate(profile.created_at, "long-in")
    : "";

  return (
    <div className="space-y-8">
      {/* Top Banner Profile Summary */}
      <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-r from-primary/15 to-primary/5" />

        <CardContent className="pt-20 pb-8 px-6 sm:px-10 relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center font-bold text-3xl text-primary shrink-0 font-display relative">
            {profile.profile_photo ? (
              <Image
                src={profile.profile_photo}
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
                <Badge variant="success" size="sm">
                  Active
                </Badge>
                <Badge variant="primary-light" size="sm">
                  {profile.user_type === "admin"
                    ? "Coordinator Admin"
                    : "Smart Citizen"}
                </Badge>
              </div>
            </div>

            {formattedJoinDate && (
              <p className="text-text-muted text-xs font-medium">
                Registered on{" "}
                <span className="font-bold">{formattedJoinDate}</span>
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
              volunteer={volunteer}
              onSave={handleProfileSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Card className="rounded-[40px] border-primary/5 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <h3 className="font-display text-lg font-bold text-text">
                    Personal Details
                  </h3>
                  {volunteer && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      startIcon={<Edit3 size={13} />}
                    >
                      Edit Details
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Mail size={14} className="text-primary/70" />
                      Email Address
                    </span>
                    <p className="font-semibold text-text">
                      {volunteer?.email || "Not Applied as Volunteer"}
                    </p>
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
                      {volunteer?.address || "Not Set"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Building size={14} className="text-primary/70" />
                      City & Pincode
                    </span>
                    <p className="font-semibold text-text">
                      {volunteer?.city
                        ? `${volunteer.city} - ${volunteer.pincode}`
                        : "Not Set"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs uppercase tracking-wider">
                      <Building size={14} className="text-primary/70" />
                      District
                    </span>
                    <p className="font-semibold text-text">
                      {volunteer?.district || "Not Set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <VolunteerPreferences
            profile={profile}
            volunteerStatus={volunteerStatus}
          />
        </div>

      </div>
    </div>
  );
}
