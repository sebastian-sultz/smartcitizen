"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MemberProfile } from "../../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAlert } from "@/components/ui/AlertProvider";

interface ProfileEditFormProps {
  profile: MemberProfile;
  onUpdate: (updatedData: Partial<MemberProfile>) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, onUpdate, onCancel }: ProfileEditFormProps) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const phoneRegExp = /^((\+91|91|0)?[6-9][0-9]{9})$/;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name is too short"),
    email: Yup.string().email("Must be a valid email").required("Email is required"),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid").required("Phone number is required"),
    dob: Yup.string().nullable(),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required").matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      dob: profile.dob || "",
      address: profile.address || "",
      city: profile.city || "",
      district: profile.district || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onUpdate(values);
        showAlert({
          title: "Profile Updated",
          message: "Your personal details have been saved successfully.",
          type: "success",
        });
        onCancel();
      } catch (err) {
        console.error("Failed to update profile form:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="text-xs font-bold text-text-muted mb-1 block">Full Name *</label>
          <Input
            name="name"
            placeholder="E.g. Rajesh Kumar"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-bold text-text-muted mb-1 block">Email Address *</label>
          <Input
            name="email"
            type="email"
            placeholder="name@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-bold text-text-muted mb-1 block">Mobile Number *</label>
          <Input
            name="phone"
            placeholder="+91 XXXXX XXXXX"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-xs font-bold text-text-muted mb-1 block">Date of Birth</label>
          <Input
            name="dob"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dob && formik.errors.dob ? formik.errors.dob : undefined}
          />
        </div>
      </div>

      <div className="border-t border-dashed border-border pt-4">
        <h4 className="font-display font-bold text-sm text-text mb-4">Address Details</h4>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-muted mb-1 block">Street Address *</label>
            <Input
              name="address"
              placeholder="Flat/House No, Building, Street Name"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && formik.errors.address ? formik.errors.address : undefined}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-text-muted mb-1 block">City *</label>
              <Input
                name="city"
                placeholder="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && formik.errors.city ? formik.errors.city : undefined}
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-text-muted mb-1 block">District *</label>
              <Input
                name="district"
                placeholder="District"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.district && formik.errors.district ? formik.errors.district : undefined}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted mb-1 block">State *</label>
              <Input
                name="state"
                placeholder="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state && formik.errors.state ? formik.errors.state : undefined}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted mb-1 block">Pincode *</label>
              <Input
                name="pincode"
                placeholder="6 digits"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pincode && formik.errors.pincode ? formik.errors.pincode : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end border-t border-border pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-2xl px-6 py-3 h-auto font-bold text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/95 text-white rounded-2xl px-6 py-3 h-auto font-bold text-xs shadow-md"
        >
          {loading ? "Saving Profile..." : "Save Details"}
        </Button>
      </div>
    </form>
  );
}
