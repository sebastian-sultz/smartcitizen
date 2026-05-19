"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { UserPlus, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export const VolunteerForm = () => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      altMobileNumber: "",
      email: "",
      address: "",
      state: "",
      district: "",
      pincode: "",
      profession: "",
      specialization: "",
      experience: "",
      description: "",
      applyCoordinator: "",
      consentGuidelines: false,
      consentPublicProfile: false,
      consentNeedHelp: false,
      showPhonePublicly: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email address"),
      profession: Yup.string().required("Profession is required"),
      consentGuidelines: Yup.boolean().oneOf([true], "You must accept the guidelines"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Application submitted! It is now pending admin review.");
      resetForm();
      setSubmitting(false);
      window.location.href = "/citizen";
    },
  });

  return (
    <Card className="w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="flex-row items-center gap-4 bg-bg border-b border-border p-6 md:p-8">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <UserPlus size={24} />
        </div>
        <div>
          <CardTitle className="text-2xl">Volunteer Application</CardTitle>
          <p className="text-text-muted text-sm mt-1">Upgrade your Smart Citizen profile</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          
          {/* Section 1: Personal Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-text pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name *" placeholder="Your legal name" {...formik.getFieldProps("fullName")} error={formik.touched.fullName ? formik.errors.fullName : undefined} />
              <Input label="Mobile Number *" type="tel" placeholder="10-digit mobile number" {...formik.getFieldProps("mobileNumber")} error={formik.touched.mobileNumber ? formik.errors.mobileNumber : undefined} />
              <Input label="Alternate Mobile" type="tel" placeholder="Optional" {...formik.getFieldProps("altMobileNumber")} />
              <Input label="Email Address" type="email" placeholder="Optional" {...formik.getFieldProps("email")} error={formik.touched.email ? formik.errors.email : undefined} />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Section 2: Location */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-text pb-2">Location (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input label="Address" placeholder="Street address" {...formik.getFieldProps("address")} />
              </div>
              <Input label="State" placeholder="e.g. Maharashtra" {...formik.getFieldProps("state")} />
              <Input label="District" placeholder="e.g. Mumbai" {...formik.getFieldProps("district")} />
              <Input label="Pin Code" placeholder="6 digits" {...formik.getFieldProps("pincode")} />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Section 3: Professional Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-text pb-2">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-text ml-1 block">Profession Category *</label>
                <Select 
                  value={formik.values.profession} 
                  onValueChange={(val) => formik.setFieldValue("profession", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lawyer">Lawyer</SelectItem>
                    <SelectItem value="Doctor">Doctor / Medical</SelectItem>
                    <SelectItem value="Teacher">Educator / Teacher</SelectItem>
                    <SelectItem value="Counselor">Counselor</SelectItem>
                    <SelectItem value="Social Worker">Social Worker</SelectItem>
                    <SelectItem value="IT Professional">IT Professional</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.profession && formik.errors.profession && (
                  <p className="text-red-500 text-[12px] ml-1">{formik.errors.profession}</p>
                )}
              </div>
              <Input label="Specialization" placeholder="e.g. Consumer Law" {...formik.getFieldProps("specialization")} />
              <Input label="Experience" placeholder="e.g. 5 years" {...formik.getFieldProps("experience")} />
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-text ml-1 block">Apply for Coordinator Role (Optional)</label>
                <Select 
                  value={formik.values.applyCoordinator} 
                  onValueChange={(val) => formik.setFieldValue("applyCoordinator", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Not Applying" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block">Block Coordinator</SelectItem>
                    <SelectItem value="District">District Coordinator</SelectItem>
                    <SelectItem value="State">State Coordinator</SelectItem>
                    <SelectItem value="National">National Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[14px] font-bold text-text ml-1 block">Public Description</label>
                <textarea 
                  className="w-full p-6 rounded-xl border border-border bg-bg focus:border-primary outline-none transition-all text-text min-h-[100px] resize-none"
                  placeholder="Describe how you can help the community..."
                  {...formik.getFieldProps("description")}
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Section 4: Consent & Privacy */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-text pb-2">Consent & Privacy</h3>
            <div className="space-y-6 bg-bg-alt p-6 rounded-xl border border-border">
              
              <div className="space-y-1">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <Checkbox 
                    checked={formik.values.consentGuidelines}
                    onCheckedChange={(checked) => formik.setFieldValue("consentGuidelines", !!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-[14px] font-bold text-text group-hover:text-primary transition-colors">I agree to the Volunteer Guidelines *</p>
                    <p className="text-[12px] text-text-muted mt-0.5">I have read and accept the terms and conditions.</p>
                  </div>
                </label>
                {formik.touched.consentGuidelines && formik.errors.consentGuidelines && (
                  <p className="text-red-500 text-[12px] ml-9">{formik.errors.consentGuidelines}</p>
                )}
              </div>

              <label className="flex items-start gap-4 cursor-pointer group">
                <Checkbox 
                  checked={formik.values.consentPublicProfile}
                  onCheckedChange={(checked) => formik.setFieldValue("consentPublicProfile", !!checked)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-[14px] font-bold text-text group-hover:text-primary transition-colors">Public Profile Visibility</p>
                  <p className="text-[12px] text-text-muted mt-0.5">Allow my profile to be publicly visible on the platform.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <Checkbox 
                  checked={formik.values.consentNeedHelp}
                  onCheckedChange={(checked) => formik.setFieldValue("consentNeedHelp", !!checked)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-[14px] font-bold text-text group-hover:text-primary transition-colors">List in "Need Help" Directory</p>
                  <p className="text-[12px] text-text-muted mt-0.5">Make my profile available in the community support directory so citizens can contact me.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <Checkbox 
                  checked={formik.values.showPhonePublicly}
                  onCheckedChange={(checked) => formik.setFieldValue("showPhonePublicly", !!checked)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-[14px] font-bold text-text group-hover:text-primary transition-colors">Show Phone Number Publicly</p>
                  <p className="text-[12px] text-text-muted mt-0.5">Allow citizens to see my phone number. If unchecked, they can only contact you via platform request.</p>
                </div>
              </label>

            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            isLoading={formik.isSubmitting}
          >
            Submit Application
          </Button>

          <div className="pt-6 border-t border-border mt-8">
            <div className="flex gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <Shield className="text-accent shrink-0 mt-0.5" size={18} />
              <p className="text-[12px] text-amber-900/70 leading-relaxed">
                <span className="font-bold text-accent">Note:</span> Your application will be reviewed by administrators before your profile becomes active in the directory.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
