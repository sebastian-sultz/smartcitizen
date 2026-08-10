"use client";

import { useEffect, useState } from "react";
import { UpdateVolunteerPayload } from "../types";
import { useCitizenStore, selectIsVolunteer } from "@/store/citizenStore";
import { updateVolunteer } from "../api";
import { updateProfilePhoto } from "@/features/shared/auth";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Edit3, Building, Camera } from "lucide-react";
import Image from "next/image";
import { formatDate, compressImage, cn } from "@/lib/utils";
import { toast } from "sonner";

import ProfileEditForm from "./ProfileEditForm";
import VolunteerPreferences from "./VolunteerPreferences";
import { PrivacyControls } from "./PrivacyControls";

export default function ProfileView() {
  const {
    user: profile,
    volunteer,
    loading: storeLoading,
    fetchProfile,
    refreshProfile,
    setVolunteer,
  } = useCitizenStore();
  const isVolunteer = useCitizenStore(selectIsVolunteer);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Flexible MIME check + file extension fallback to support mobile/iOS HEIC blank types
    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|gif|bmp|webp|heic|heif)$/i.test(file.name);
    if (!isImage) {
      toast.error("Please upload an image file");
      return;
    }

    // Safety guardrail for extremely large files (> 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size must be under 25MB");
      return;
    }

    setIsUploading(true);
    try {
      if (profile) {
        // Compress the image locally to JPEG max 800x800 at 0.85 quality
        const compressedFile = await compressImage(file, 800, 800, 0.85);
        await updateProfilePhoto(profile.id, compressedFile);
        toast.success("Profile photo updated successfully!");
        await refreshProfile();
      }
    } catch (err) {
      console.error("Failed to upload profile photo:", err);
      toast.error("Failed to upload profile photo");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      <div className="space-y-8 w-full animate-pulse">
        {/* Profile Card Header Skeleton */}
        <div className="bg-surface p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border border-border/40 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="space-y-3 w-full max-w-xs text-center sm:text-left">
            <Skeleton className="h-8 w-48 rounded-lg mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-32 rounded-lg mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info Card */}
          <div className="bg-surface p-6 rounded-[24px] border border-border/40 space-y-4">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Volunteer / Settings Card */}
          <div className="bg-surface p-6 rounded-[24px] border border-border/40 space-y-4">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
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

  const formattedJoinDate = profile.created_at
    ? formatDate(profile.created_at, "long-in")
    : "";

  return (
    <div className="space-y-8">
      {/* Top Banner Profile Summary */}
      <Card className="rounded-2xl sm:rounded-[40px] border-primary/5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-r from-primary/15 to-primary/5" />

        <CardContent className="pt-20 pb-8 px-5 sm:px-10 relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="relative group shrink-0">
            {/* Clickable Avatar Label Wrapper */}
            <label
              htmlFor="profile-photo-upload"
              className={cn(
                "relative block w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center font-bold text-3xl text-primary font-display transition-all duration-200",
                !isUploading ? "cursor-pointer hover:border-primary/20 hover:shadow-md" : "pointer-events-none"
              )}
              title="Click to update profile photo"
            >
              {profile.profile_photo ? (
                <Image
                  src={profile.profile_photo}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              ) : (
                userInitials
              )}

              {/* Uploading Overlay Spinner */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-10">
                  <Spinner className="size-5 text-white" />
                </div>
              )}
            </label>

            {/* Camera Edit Badge on Bottom-Right */}
            {!isUploading && (
              <label
                htmlFor="profile-photo-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer hover:bg-primary-dark hover:scale-105 transition-all duration-200 z-20"
                title="Click to update profile photo"
              >
                <Camera className="w-4 h-4" />
              </label>
            )}

            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
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

      {/* Centered single-column layout stack */}
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            volunteer={volunteer}
            onSave={handleProfileSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Card className="rounded-2xl sm:rounded-[40px] border-primary/5 shadow-sm">
            <CardContent className="p-5 sm:p-8 space-y-6">
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

        <VolunteerPreferences isVolunteer={isVolunteer} />
        {profile.user_type === "volunteer" && (
          <div className="mt-8">
            <PrivacyControls />
          </div>
        )}
      </div>
    </div>
  );
}
