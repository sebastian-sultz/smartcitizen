"use client";

import { useEffect, useState } from "react";
import { MemberProfile } from "../../types";
import { getMemberProfile, updateMemberProfile, getDashboardStats } from "../../api";
import { updateProfilePhoto } from "@/features/auth/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertProvider";
import { User, Mail, Phone, Calendar, MapPin, Edit2, Camera } from "lucide-react";
import Image from "next/image";

import ProfileEditForm from "./ProfileEditForm";
import SocialLinks from "./SocialLinks";
import VolunteerPreferences from "./VolunteerPreferences";

export default function ProfileView() {
  const { showAlert } = showAlertHelper();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<'not_applied' | 'pending' | 'approved' | 'rejected'>('not_applied');

  // Helper hook abstraction to avoid direct hook imports/errors
  function showAlertHelper() {
    return useAlert();
  }

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getMemberProfile(),
        getDashboardStats(),
      ]);
      setProfile(profileData);
      
      const savedApp = typeof window !== 'undefined' && localStorage.getItem("volunteer-application-submitted");
      if (savedApp === "true") {
        setVolunteerStatus('pending');
      } else {
        setVolunteerStatus(statsData.volunteerStatus);
      }
    } catch (err) {
      console.error("Failed to load profile view:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (updatedData: Partial<MemberProfile>) => {
    try {
      const data = await updateMemberProfile(updatedData);
      setProfile(data);
    } catch (err) {
      console.error("Failed to update profile data:", err);
      throw err;
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    try {
      setUploading(true);
      // Upload using the existing real auth API
      const imageUrl = await updateProfilePhoto(profile.id, file);
      setProfile((prev) => (prev ? { ...prev, profilePhoto: imageUrl } : null));
      showAlert({
        title: "Photo Uploaded",
        message: "Your profile photo has been successfully updated!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to upload photo:", err);
      showAlert({
        title: "Upload Failed",
        message: "Failed to upload photo. Please check file format and try again.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Spinner className="size-10 text-primary animate-spin" />
        <p className="text-text-muted font-bold text-xs uppercase tracking-wider">Loading Profile details...</p>
      </div>
    );
  }

  if (!profile) return null;

  const joinDateStr = new Date(profile.joinDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      
      {/* Upper Profile Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <Card className="rounded-[40px] border-primary/5 shadow-sm lg:col-span-1 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-r from-primary/10 to-primary/5" />
          <CardContent className="pt-14 pb-8 flex flex-col items-center text-center relative z-10">
            {/* Avatar block */}
            <div className="relative w-28 h-28 rounded-full bg-white border-4 border-white shadow-xl mb-4 overflow-hidden group">
              {profile.profilePhoto ? (
                <Image 
                  src={profile.profilePhoto} 
                  alt={profile.name} 
                  fill 
                  sizes="112px"
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-bold text-2xl">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploading ? <Spinner className="size-5 text-white animate-spin" /> : <Camera size={20} />}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handlePhotoUpload} 
                  disabled={uploading}
                />
              </label>
            </div>

            <h2 className="font-display text-xl font-bold text-text">{profile.name}</h2>
            <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-wider">{profile.memberId}</p>
            
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase rounded-full tracking-wider">
                {profile.status}
              </span>
              <span className="px-2.5 py-0.5 bg-primary/5 text-primary border border-primary/10 text-[10px] font-bold uppercase rounded-full tracking-wider">
                {profile.userType}
              </span>
            </div>
            
            <p className="text-[11px] text-text-muted mt-4 font-semibold uppercase tracking-wider">
              Joined {joinDateStr}
            </p>
          </CardContent>
        </Card>

        {/* Profile details form / view */}
        <Card className="rounded-[40px] border-primary/5 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg font-bold text-text">
              {isEditing ? "Edit Personal Details" : "Personal Information"}
            </CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold gap-1 px-4 py-2 h-auto rounded-xl border-primary/10 text-primary"
              >
                <Edit2 size={12} />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <ProfileEditForm 
                profile={profile} 
                onUpdate={handleProfileUpdate} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <User className="text-primary/70 shrink-0" size={18} />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Full Name</span>
                      <p className="font-semibold text-text mt-0.5">{profile.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="text-primary/70 shrink-0" size={18} />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Email Address</span>
                      <p className="font-semibold text-text mt-0.5">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="text-primary/70 shrink-0" size={18} />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Mobile Number</span>
                      <p className="font-semibold text-text mt-0.5">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="text-primary/70 shrink-0" size={18} />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Date of Birth</span>
                      <p className="font-semibold text-text mt-0.5">
                        {profile.dob ? new Date(profile.dob).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        }) : <span className="text-text-muted italic">Not Set</span>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="text-primary/70 shrink-0" size={18} />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Street Address</span>
                      <p className="font-semibold text-text mt-0.5">{profile.address || <span className="text-text-muted italic">Not Set</span>}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">City / Town</span>
                      <p className="font-semibold text-text mt-0.5">{profile.city || <span className="text-text-muted italic">Not Set</span>}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">District</span>
                      <p className="font-semibold text-text mt-0.5">{profile.district || <span className="text-text-muted italic">Not Set</span>}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">State</span>
                      <p className="font-semibold text-text mt-0.5">{profile.state || <span className="text-text-muted italic">Not Set</span>}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Pincode</span>
                      <p className="font-semibold text-text mt-0.5">{profile.pincode || <span className="text-text-muted italic">Not Set</span>}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Social & Volunteer Preferences Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SocialLinks profile={profile} onUpdate={handleProfileUpdate} />
        <VolunteerPreferences volunteerStatus={volunteerStatus} />
      </div>

    </div>
  );
}
