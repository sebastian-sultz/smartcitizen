"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { MemberProfile } from "../../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User, Mail, Calendar, MapPin, Building, Hash } from "lucide-react";
import { toast } from "sonner";

interface ProfileEditFormProps {
  profile: MemberProfile;
  onSave: (updated: Partial<MemberProfile>) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, onSave, onCancel }: ProfileEditFormProps) {
  const formik = useFormik({
    initialValues: {
      name: profile.name || "",
      email: profile.email || "",
      dob: profile.dob || "",
      address: profile.address || "",
      city: profile.city || "",
      district: profile.district || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Full name is required").min(3, "Name must be at least 3 characters"),
      email: Yup.string().email("Enter a valid email address").required("Email is required"),
      dob: Yup.string().nullable(),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      district: Yup.string().required("District is required"),
      state: Yup.string().required("State is required"),
      pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Enter a valid 6-digit Pincode")
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
              label="Date of Birth"
              type="date"
              icon={<Calendar size={18} className="text-text-muted" />}
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dob ? formik.errors.dob : undefined}
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
              label="State"
              placeholder="State name"
              icon={<Building size={18} className="text-text-muted" />}
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state ? formik.errors.state : undefined}
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
              className="rounded-2xl px-6 py-2.5 h-auto font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              className="rounded-2xl px-6 py-2.5 h-auto font-bold"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
