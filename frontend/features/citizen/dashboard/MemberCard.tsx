"use client";

import { useState, useRef } from "react";
import { UserResponse } from "@/features/shared/auth/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QRCodeSVG } from "qrcode.react";
import {
  User,
  Phone,
  Calendar,
  QrCode,
  Download,
  Camera,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { formatDate, downloadBlob, compressImage, cn } from "@/lib/utils";
import { useCitizenStore } from "@/store/citizenStore";
import { updateProfilePhoto } from "@/features/shared/auth";
import { toast } from "sonner";
import { toPng } from "html-to-image";

interface MemberCardProps {
  profile: UserResponse | null;
}

export default function MemberCard({ profile }: MemberCardProps) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshProfile } = useCitizenStore();

  const handleAvatarClick = () => {
    if (uploadingPhoto) return;
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

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

    setUploadingPhoto(true);
    try {
      // Compress the image locally to JPEG max 800x800 at 0.85 quality
      const compressedFile = await compressImage(file, 800, 800, 0.85);
      await updateProfilePhoto(profile.id, compressedFile);
      toast.success("Profile photo updated successfully!");
      await refreshProfile();
    } catch (err) {
      console.error("Failed to upload profile photo:", err);
      toast.error("Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const referralCode =
    profile?.referral_id || `GSC-${profile?.id?.substring(0, 6).toUpperCase()}`;
  const memberId = `SC-${profile?.id?.substring(0, 8).toUpperCase() || "MEMBER"}`;

  const formattedDate = profile?.created_at
    ? formatDate(profile.created_at, "short")
    : "";

  const qrValue = JSON.stringify({
    name: profile?.name,
    memberId: memberId,
    referralCode: referralCode,
    status: "Active",
  });

  const downloadIDCard = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Premium print resolution
      });

      const filename = `${profile?.name?.toLowerCase().replace(/\s+/g, "_") || "member"}_id_card.png`;
      downloadBlob(dataUrl, filename);
      toast.success("Identity Card downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate ID card:", err);
      toast.error("Failed to download ID card. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Hidden printable card container for html-to-image capture */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none">
        <Card
          ref={cardRef}
          className="w-[350px] h-[540px] bg-bg border-border relative flex flex-col justify-between rounded-[32px] overflow-hidden"
        >
          {/* Header design */}
          <div className="absolute top-0 inset-x-0 h-28 bg-primary flex flex-col items-center justify-center" />
          <div className="absolute top-28 inset-x-0 h-1.5 bg-accent" />

          <CardContent className="relative z-10 flex flex-col items-center text-center h-full justify-between flex-grow mt-3 p-8">
            {/* Top section: Avatar & Member Name */}
            <div className="flex flex-col items-center w-full">
              <div className="relative w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg mb-3.5 overflow-hidden">
                {profile?.profile_photo ? (
                  <Image
                    src={`/api/users/proxy-image?url=${encodeURIComponent(profile.profile_photo)}`}
                    alt={profile.name || "Member Photo"}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                    <User size={40} className="opacity-30" />
                  </div>
                )}
              </div>

              <h2 className="font-display text-xl font-bold text-text mb-1">
                {profile?.name || "Smart Citizen"}
              </h2>

              <p className="text-primary font-mono font-bold tracking-wider text-xs mb-3">
                {memberId}
              </p>

              <div className="flex gap-2 mb-2">
                <Badge variant="success" size="sm">
                  Active Member
                </Badge>
                <Badge variant="primary-light" size="sm">
                  {profile?.user_type === "admin" ? "Admin" : "Smart Citizen"}
                </Badge>
              </div>
            </div>

            {/* Bottom section: details & QR Code */}
            <div className="w-full flex flex-col items-center mt-auto">
              <Separator variant="dashed" className="my-3.5 opacity-60" />

              <div className="w-full space-y-2.5 text-left text-xs text-text-muted">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone size={13} className="text-primary/70" />
                    <span>Mobile</span>
                  </span>
                  <span className="font-semibold text-text">
                    {profile?.phone || "Not Set"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar size={13} className="text-primary/70" />
                    <span>Member Since</span>
                  </span>
                  <span className="font-semibold text-text">
                    {formattedDate}
                  </span>
                </div>
              </div>

              <Separator variant="dashed" className="my-3.5 opacity-60" />

              <div className="bg-white p-3 rounded-2xl border border-border/60 shadow-sm flex items-center justify-center mb-2">
                <QRCodeSVG
                  value={qrValue}
                  size={90}
                  level="Q"
                  includeMargin={false}
                  fgColor="#0A5C52"
                />
              </div>

              <span className="text-[9px] font-bold text-primary tracking-wider uppercase opacity-80 mt-1">
                Verified GlobalSmart Citizen
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full shadow-card border-primary/10 overflow-hidden relative rounded-2xl sm:rounded-[24px] flex flex-col justify-between ">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-primary/20 to-primary/5 pointer-events-none" />

        <CardContent className="pt-10 pb-8 px-8 relative z-10 flex-grow flex flex-col justify-between">
          <div className="flex flex-col items-center text-center h-full justify-between flex-grow w-full">
            <div className="flex flex-col items-center w-full">
              {/* Hidden file input for card profile photo update */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="relative mb-4 group/avatar ">
                {/* Circle image container with overflow-hidden */}
                <div
                  onClick={handleAvatarClick}
                  className="relative w-28 h-28 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
                  title="Click to update profile photo"
                >
                  {profile?.profile_photo ? (
                    <Image
                      src={profile.profile_photo}
                      alt={profile.name || "Member Photo"}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                      <User size={48} className="opacity-30" />
                    </div>
                  )}

                  {/* Camera Hover Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-250 text-white z-20",
                      uploadingPhoto
                        ? "opacity-100"
                        : "opacity-0 group-hover/avatar:opacity-100",
                    )}
                  >
                    {uploadingPhoto ? (
                      <Loader2 size={22} className="animate-spin text-white" />
                    ) : (
                      <>
                        <Camera
                          size={20}
                          className="scale-90 group-hover/avatar:scale-100 transition-transform mb-0.5"
                        />
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          Change
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Icon Badge (outside the overflow-hidden boundary to prevent clipping) */}
                <div
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-primary/95 text-white rounded-full border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 z-30"
                  title="Click to update profile photo"
                >
                  {uploadingPhoto ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Camera size={14} />
                  )}
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-text mb-1">
                {profile?.name || "Smart Citizen"}
              </h2>

              <p className="text-primary font-mono font-bold tracking-wider text-sm mb-3">
                {memberId}
              </p>

              <div className="flex gap-2 mb-2">
                <Badge variant="success" size="md">
                  Active Member
                </Badge>
                <Badge variant="primary-light" size="md">
                  {profile?.user_type === "admin" ? "Admin" : "Smart Citizen"}
                </Badge>
              </div>
            </div>

            <div className="w-full flex-grow flex flex-col justify-end">
              <Separator variant="dashed" className="my-4 opacity-60" />

              <div className="w-full space-y-3.5 text-left text-sm text-text-muted">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone size={15} className="text-primary/70" />
                    <span>Mobile</span>
                  </span>
                  <span className="font-semibold text-text">
                    {profile?.phone || "Not Set"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar size={15} className="text-primary/70" />
                    <span>Member Since</span>
                  </span>
                  <span className="font-semibold text-text">
                    {formattedDate}
                  </span>
                </div>
              </div>

              <Separator variant="dashed" className="my-4 opacity-60" />

              <div className="w-full flex flex-col gap-2">
                <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost-primary"
                      size="sm"
                      fullWidth
                      className="border border-primary/15 bg-bg shadow-sm group"
                      aria-label="View Identification QR Code"
                    >
                      <QrCode
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      Digital Membership ID
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="sm" className="text-center">
                    <DialogHeader>
                      <DialogTitle>Digital Membership ID</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-4 space-y-4">
                      <div className="bg-white p-4 rounded-2xl border border-border shadow-md">
                        <QRCodeSVG
                          value={qrValue}
                          size={180}
                          level="Q"
                          includeMargin={true}
                          fgColor="#0A5C52"
                        />
                      </div>
                      <div>
                        <p className="font-display font-bold text-text text-base">
                          {profile?.name}
                        </p>
                        <p className="text-[12px] font-mono text-text-muted mt-1">
                          {memberId}
                        </p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-2 px-2.5 py-0.5 bg-primary/5 rounded-full inline-block">
                          Verified GlobalSmart Citizen
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="shadow-sm group"
                  onClick={downloadIDCard}
                  isLoading={downloading}
                  startIcon={
                    <Download
                      size={16}
                      className="group-hover:translate-y-0.5 transition-transform"
                    />
                  }
                >
                  Download ID Card
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
