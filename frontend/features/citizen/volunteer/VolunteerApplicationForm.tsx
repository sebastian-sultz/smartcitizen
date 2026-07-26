"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  Lock,
  User,
  Briefcase,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { createVolunteer } from "../api";
import { lookupPincode } from "@/features/public/volunteer/api";
import { UserResponse } from "@/features/shared/auth/types";
import {
  VOLUNTEER_PROFESSIONS,
  PROFESSION_SPECIALTIES,
  INDIAN_STATES,
} from "@/features/public/volunteer/constants";
import {
  emailSchema,
  phoneSchema,
  addressSchema,
  citySchema,
  pincodeSchema,
  trimmedString,
} from "@/lib/validation";

interface VolunteerApplicationFormProps {
  user: UserResponse;
  onSubmitSuccess: () => void;
}

export default function VolunteerApplicationForm({
  user,
  onSubmitSuccess,
}: VolunteerApplicationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: user.volunteer?.email || "",
      alternate_phone: "",
      pincode: "",
      state: "",
      district: "",
      city: "",
      address: "",
      profession: "",
      specialties: [] as string[],
      experience: "",
      motivation: "",
      password: "",
      confirmPassword: "",
      consent: false,
    },
    validationSchema: Yup.object().shape({
      email: emailSchema("Email is required"),
      alternate_phone: phoneSchema().nullable().notRequired(),
      pincode: pincodeSchema("Pincode is required"),
      state: trimmedString().required("State selection is required"),
      district: citySchema("District is required"),
      city: citySchema("City/Town is required"),
      address: addressSchema("Street address is required"),
      profession: trimmedString().required("Profession selection is required"),
      specialties: Yup.array()
        .of(Yup.string())
        .min(1, "Specialization selection is required"),
      experience: Yup.string().nullable().notRequired(),
      motivation: trimmedString().required("Please state your motivation"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required to protect your profile information"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
      consent: Yup.boolean()
        .oneOf([true], "You must agree to the volunteer guidelines")
        .required("Consent required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await createVolunteer({
          user_id: user.id,
          name: user.name,
          phone: user.phone,
          email: values.email,
          alternate_phone: values.alternate_phone || "",
          address: values.address,
          city: values.city,
          district: values.district,
          state: values.state,
          pincode: values.pincode,
          profession: values.profession,
          experience: values.experience,
          specialties: values.specialties,
          ispublicconsent: values.consent,
          password: values.password,
        });
        if (res?.volunteer) {
          toast.success("Coordinator Application Submitted Successfully!");
          onSubmitSuccess();
        } else {
          toast.error("Failure submitting application.");
        }
      } catch (err: unknown) {
        console.error("Failed to submit volunteer details:", err);
        let errMsg = "Failure submitting application.";
        if (err instanceof Error && "response" in err) {
          const axiosErr = err as { response?: { data?: { error?: string } } };
          errMsg = axiosErr.response?.data?.error || errMsg;
        }
        toast.error(errMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePincodeLookup = async (pin: string) => {
    if (pin.length !== 6) return;
    setIsFetchingPincode(true);
    const details = await lookupPincode(pin);
    setIsFetchingPincode(false);

    if (details) {
      if (details.state) formik.setFieldValue("state", details.state);
      if (details.district) formik.setFieldValue("district", details.district);
      if (details.city && !formik.values.city)
        formik.setFieldValue("city", details.city);
      toast.success(`Location detected: ${details.district}, ${details.state}`);
    } else {
      toast.info("Pincode entered. Select State & District below.");
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6 md:space-y-8 mt-4 md:mt-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6 md:space-y-8">
        {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
        <Card className="rounded-[32px] border-border shadow-sm">
          <CardHeader className="border-b border-border/50 p-6 md:p-8 pb-4">
            <CardTitle className="font-display text-base md:text-lg font-bold text-text flex items-center gap-2">
              <User size={18} className="text-primary" />
              1. Personal & Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Full Name (Pre-filled)"
                value={user.name}
                disabled
                icon={<User size={16} />}
                className="bg-bg/60 text-text-muted font-bold"
              />
              <Input
                label="Registered Phone (Pre-filled)"
                value={user.phone}
                disabled
                icon={<Phone size={16} />}
                className="bg-bg/60 text-text-muted font-bold"
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="yourname@example.com"
                icon={<Mail size={16} />}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
              <Input
                label="WhatsApp / Alternate Phone (Urgent Alerts)"
                placeholder="10-digit phone number"
                icon={<Phone size={16} />}
                name="alternate_phone"
                value={formik.values.alternate_phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  formik.setFieldValue("alternate_phone", val);
                }}
                onBlur={formik.handleBlur}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                error={
                  formik.touched.alternate_phone
                    ? formik.errors.alternate_phone
                    : undefined
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: COVERAGE AREA (FOR "NEED HELP" TICKET ASSIGNMENT) */}
        <Card className="rounded-[32px] border-border shadow-sm">
          <CardHeader className="border-b border-border/50 p-6 md:p-8 pb-4">
            <CardTitle className="font-display text-base md:text-lg font-bold text-text flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              2. Coverage Area & Local Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Pincode with Auto-Lookup */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="pincode-input"
                    className="text-[14px] font-bold text-text ml-1 block"
                  >
                    6-Digit Pincode
                  </label>
                  {formik.values.pincode.length === 6 && (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => handlePincodeLookup(formik.values.pincode)}
                      isLoading={isFetchingPincode}
                      startIcon={<Search size={12} />}
                      className="p-0 h-auto"
                    >
                      Auto-Fill Location
                    </Button>
                  )}
                </div>
                <Input
                  id="pincode-input"
                  placeholder="e.g. 400058"
                  icon={<Hash size={16} />}
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    formik.setFieldValue("pincode", val);
                    if (val.length === 6) {
                      handlePincodeLookup(val);
                    }
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    if (
                      formik.values.pincode.length === 6 &&
                      !formik.values.state
                    ) {
                      handlePincodeLookup(formik.values.pincode);
                    }
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={
                    formik.touched.pincode ? formik.errors.pincode : undefined
                  }
                />
              </div>

              {/* State Dropdown (Auto-filled or Manual Fallback) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text ml-1 block">
                  State
                </label>
                <Select
                  value={formik.values.state}
                  onValueChange={(val) => formik.setFieldValue("state", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {INDIAN_STATES.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.state && formik.errors.state && (
                  <p className="text-danger text-xs ml-1">
                    {formik.errors.state}
                  </p>
                )}
              </div>

              {/* District Input */}
              <Input
                label="District"
                placeholder="e.g. Mumbai Suburban"
                icon={<Building size={16} />}
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.district ? formik.errors.district : undefined
                }
              />

              {/* City / Tehsil / Area Input */}
              <Input
                label="City / Tehsil / Area"
                placeholder="e.g. Andheri West"
                icon={<MapPin size={16} />}
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city ? formik.errors.city : undefined}
              />
            </div>

            {/* Address Line */}
            <Input
              label="Street Address Line"
              placeholder="House/Flat No, Street Name, Area"
              icon={<MapPin size={16} />}
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address ? formik.errors.address : undefined}
            />
          </CardContent>
        </Card>

        {/* SECTION 3: EXPERTISE & SPECIALIZATION */}
        <Card className="rounded-[32px] border-border shadow-sm">
          <CardHeader className="border-b border-border/50 p-6 md:p-8 pb-4">
            <CardTitle className="font-display text-base md:text-lg font-bold text-text flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              3. Professional Background & Specialization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Profession Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text ml-1 block">
                  Primary Profession / Background
                </label>
                <Select
                  value={formik.values.profession}
                  onValueChange={(val) => {
                    formik.setFieldValue("profession", val);
                    formik.setFieldValue("specialties", []);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Profession" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {VOLUNTEER_PROFESSIONS.map((prof) => (
                      <SelectItem key={prof} value={prof}>
                        {prof}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.profession && formik.errors.profession && (
                  <p className="text-danger text-xs ml-1">
                    {formik.errors.profession}
                  </p>
                )}
              </div>

              {/* Dynamic Speciality Dropdown Based on Selected Profession */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text ml-1 block">
                  Speciality / Specialization
                </label>
                <Select
                  disabled={!formik.values.profession}
                  value={formik.values.specialties[0] || ""}
                  onValueChange={(val) =>
                    formik.setFieldValue("specialties", [val])
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        formik.values.profession
                          ? "Select Specialization"
                          : "Select Profession First"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {(
                      PROFESSION_SPECIALTIES[formik.values.profession] ||
                      PROFESSION_SPECIALTIES["Other"]
                    ).map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.specialties && formik.errors.specialties && (
                  <p className="text-danger text-xs ml-1">
                    {formik.errors.specialties as string}
                  </p>
                )}
              </div>
            </div>

            <Input
              label="Prior Volunteer & Civic Experience"
              placeholder="Briefly describe any community, NGO, or civic work you have completed..."
              name="experience"
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.experience ? formik.errors.experience : undefined
              }
            />
          </CardContent>
        </Card>

        {/* SECTION 4: MOTIVATION & SECURITY */}
        <Card className="rounded-[32px] border-border shadow-sm">
          <CardHeader className="border-b border-border/50 p-6 md:p-8 pb-4">
            <CardTitle className="font-display text-base md:text-lg font-bold text-text flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              4. Motivation & Profile Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <Textarea
              label="Motivation Statement"
              name="motivation"
              rows={4}
              value={formik.values.motivation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Why do you want to become a verified citizen coordinator with GlobalSmart Citizens Foundation?"
              error={
                formik.touched.motivation && formik.errors.motivation
                  ? formik.errors.motivation
                  : undefined
              }
            />

            {/* Password Protection */}
            <div className="bg-bg border border-border p-6 rounded-[24px] space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  Account Security Password
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Applying for Coordinator status attaches sensitive address and
                  contact details to your account. Set a password to protect
                  your profile.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password ? formik.errors.password : undefined
                  }
                />
                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Code of Conduct Consent Checkbox */}
            <div
              className={`flex gap-3 items-start p-4 rounded-2xl border transition-colors ${
                formik.values.consent
                  ? "bg-emerald-50/10 border-emerald-500/30 text-emerald-950"
                  : "bg-bg border-border"
              }`}
            >
              <Checkbox
                id="consent"
                checked={formik.values.consent}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("consent", !!checked)
                }
              />
              <div className="space-y-1">
                <label
                  htmlFor="consent"
                  className="text-xs font-bold text-text leading-none select-none cursor-pointer"
                >
                  Commitment to Coordinator Code of Conduct
                </label>
                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                  I agree to represent GlobalSmart Citizens Foundation
                  responsibly, maintain civic transparency, and coordinate
                  regional help tickets and community drives professionally.
                </p>
                {formik.touched.consent && formik.errors.consent && (
                  <p className="text-danger text-[10px] font-semibold mt-1">
                    {formik.errors.consent}
                  </p>
                )}
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-2">
              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                disabled={formik.isSubmitting || !formik.values.consent}
                fullWidth
                size="lg"
              >
                Submit Coordinator Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
