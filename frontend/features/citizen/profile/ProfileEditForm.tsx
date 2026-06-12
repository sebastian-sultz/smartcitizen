"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { UserResponse } from "@/features/shared/auth/types";
import { Volunteer, UpdateVolunteerPayload } from "../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User, Mail, MapPin, Building, Hash } from "lucide-react";
import { toast } from "sonner";
import { PINCODE_REGEX, EMAIL_REGEX, NAME_REGEX, CITY_REGEX, ADDRESS_REGEX } from "@/lib/regex";

interface ProfileEditFormProps {
  profile: UserResponse;
  volunteer: Volunteer | null;
  onSave: (updated: UpdateVolunteerPayload) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, volunteer, onSave, onCancel }: ProfileEditFormProps) {
  const formik = useFormik({
    initialValues: {
      name: profile.name || "",
      email: volunteer?.email || "",
      address: volunteer?.address || "",
      city: volunteer?.city || "",
      district: volunteer?.district || "",
      pincode: volunteer?.pincode || "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .matches(NAME_REGEX, "Enter a valid name (letters, spaces, dots, hyphens only)")
        .required("Full name is required")
        .min(3, "Name must be at least 3 characters"),
      email: Yup.string()
        .matches(EMAIL_REGEX, "Enter a valid email address")
        .required("Email is required"),
      address: Yup.string()
        .matches(ADDRESS_REGEX, "Enter a valid address (alphanumeric and standard punctuation only)")
        .required("Address is required"),
      city: Yup.string()
        .matches(CITY_REGEX, "Enter a valid city (letters, spaces, dots, hyphens only)")
        .required("City is required"),
      district: Yup.string()
        .matches(CITY_REGEX, "Enter a valid district (letters, spaces, dots, hyphens only)")
        .required("District is required"),
      pincode: Yup.string()
        .matches(PINCODE_REGEX, "Enter a valid 6-digit Pincode")
        .required("Pincode is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await onSave(values);
        toast.success("Profile updated successfully!");
      } catch (err) {
        console.error("Profile save failed:", err);
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-text">Edit Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Your full name"
              icon={<User size={18} className="text-text-muted" />}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name ? formik.errors.name : undefined}
            />

            <Input
              label="Email Address"
              placeholder="yourname@example.com"
              type="email"
              icon={<Mail size={18} className="text-text-muted" />}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? formik.errors.email : undefined}
            />

            <Input
              label="Address Line"
              placeholder="House, Street, Area"
              icon={<MapPin size={18} className="text-text-muted" />}
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address ? formik.errors.address : undefined}
            />

            <Input
              label="City"
              placeholder="City name"
              icon={<Building size={18} className="text-text-muted" />}
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city ? formik.errors.city : undefined}
            />

            <Input
              label="District"
              placeholder="District name"
              icon={<Building size={18} className="text-text-muted" />}
              name="district"
              value={formik.values.district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.district ? formik.errors.district : undefined}
            />

            <Input
              label="Pincode"
              placeholder="6-digit pincode"
              icon={<Hash size={18} className="text-text-muted" />}
              name="pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pincode ? formik.errors.pincode : undefined}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              size="sm"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
