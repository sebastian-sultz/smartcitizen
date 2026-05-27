"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAlert } from "@/components/ui/AlertProvider";
import { createVolunteer } from "@/features/volunteer/api";
import { getProfile } from "@/features/auth/api";
import { Heart, UserPlus, Info, Check } from "lucide-react";

interface VolunteerApplicationFormProps {
  onSuccess: () => void;
}

export default function VolunteerApplicationForm({ onSuccess }: VolunteerApplicationFormProps) {
  const { showAlert } = useAlert();
  const [profileLoading, setProfileLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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
      experience: "",
      skills: [] as string[],
      availability: "",
      interest: "",
      workType: "",
      motivation: "",
      consentGuidelines: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required").min(2, "Name is too short"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      address: Yup.string().required("Address is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      pincode: Yup.string().required("Pincode is required").matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
      profession: Yup.string().required("Profession is required"),
      experience: Yup.string().required("Experience is required"),
      availability: Yup.string().required("Availability is required"),
      interest: Yup.string().required("Primary area of interest is required"),
      workType: Yup.string().required("Preferred work type is required"),
      motivation: Yup.string().required("Please describe your motivation").min(10, "Tell us a bit more"),
      consentGuidelines: Yup.boolean().oneOf([true], "You must accept the guidelines"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!userId) {
        showAlert({
          title: "Session Error",
          message: "You must be signed in to submit this form.",
          type: "error",
        });
        return;
      }

      setSubmitting(true);
      try {
        await createVolunteer({
          user_id: userId,
          name: values.fullName,
          email: values.email,
          phone: values.mobileNumber,
          alternate_phone: values.altMobileNumber,
          address: values.address,
          city: values.state, // Map 'state' to 'city' payload field to conform to backend expectations
          district: values.district,
          pincode: values.pincode,
          profession: values.profession,
          experience: values.experience,
        });

        showAlert({
          title: "Application Received",
          message: "Your application is submitted successfully! We are reviewing it.",
          type: "success",
        });
        onSuccess();
      } catch (err: any) {
        console.error("Failed to submit volunteer app:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setProfileLoading(true);
        const u = await getProfile();
        if (u) {
          setUserId(u.id);
          formik.setFieldValue("fullName", u.name);
          formik.setFieldValue("mobileNumber", u.phone);
        }
      } catch (err) {
        console.error("Failed to load prefilled profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleSkillToggle = (skill: string) => {
    const current = [...formik.values.skills];
    if (current.includes(skill)) {
      formik.setFieldValue("skills", current.filter(s => s !== skill));
    } else {
      formik.setFieldValue("skills", [...current, skill]);
    }
  };

  const skillsOptions = [
    "Community Organizing",
    "Social Media & Design",
    "Teaching & Education",
    "Field Coordination",
    "Public Speaking",
    "Logistics & Transport",
    "First Aid & Medical Support",
  ];

  if (profileLoading) {
    return (
      <Card className="rounded-[40px] border-primary/5 shadow-sm p-8 text-center text-text-muted">
        Prefilling profile info...
      </Card>
    );
  }

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden">
      <CardHeader className="bg-bg border-b border-border p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
            <Heart size={22} fill="white" />
          </div>
          <div>
            <CardTitle className="font-display text-xl font-black text-text">Volunteer Application</CardTitle>
            <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mt-0.5">Please share your skills and availability</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6 text-sm">
          
          {/* Section 1: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-text">1. Personal & Contact Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Full Name *</label>
                <Input
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : undefined}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Email Address *</label>
                <Input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Mobile Number *</label>
                <Input
                  name="mobileNumber"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobileNumber && formik.errors.mobileNumber ? formik.errors.mobileNumber : undefined}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Alternate Mobile</label>
                <Input
                  name="altMobileNumber"
                  placeholder="Optional alternate mobile"
                  value={formik.values.altMobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>

          <Separator className="border-border/80 border-dashed" />

          {/* Section 2: Address Coordinates */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-text">2. Address & Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
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

              <div className="grid grid-cols-3 md:col-span-2 gap-3">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-text-muted mb-1 block">District *</label>
                  <Input
                    name="district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.district && formik.errors.district ? formik.errors.district : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-text-muted mb-1 block">State *</label>
                  <Input
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && formik.errors.state ? formik.errors.state : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-text-muted mb-1 block">Pincode *</label>
                  <Input
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pincode && formik.errors.pincode ? formik.errors.pincode : undefined}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="border-border/80 border-dashed" />

          {/* Section 3: Prefs & Skills */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-text">3. Capabilities & Availability</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label id="pref-profession-label" className="text-xs font-bold text-text-muted mb-1 block">Profession Category *</label>
                <Select 
                  value={formik.values.profession} 
                  onValueChange={(val) => formik.setFieldValue("profession", val)}
                >
                  <SelectTrigger aria-labelledby="pref-profession-label" className="rounded-xl">
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lawyer">Lawyer / Legal</SelectItem>
                    <SelectItem value="Doctor">Doctor / Medical</SelectItem>
                    <SelectItem value="Teacher">Educator / Teacher</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="IT Professional">IT / Technical Professional</SelectItem>
                    <SelectItem value="Social Worker">Social Worker</SelectItem>
                    <SelectItem value="Other">Other Profession</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.profession && formik.errors.profession && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{formik.errors.profession}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Experience Level / Summary *</label>
                <Input
                  name="experience"
                  placeholder="E.g. 3 years in teaching, student"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.experience && formik.errors.experience ? formik.errors.experience : undefined}
                />
              </div>

              <div>
                <label id="pref-availability-label" className="text-xs font-bold text-text-muted mb-1 block">Availability *</label>
                <Select 
                  value={formik.values.availability} 
                  onValueChange={(val) => formik.setFieldValue("availability", val)}
                >
                  <SelectTrigger aria-labelledby="pref-availability-label" className="rounded-xl">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekends">Weekends only (4-8 hours)</SelectItem>
                    <SelectItem value="weekdays">Weekdays only (flexible hours)</SelectItem>
                    <SelectItem value="evenings">Evenings only (flexible)</SelectItem>
                    <SelectItem value="fulltime">Full-time Coordinator (30+ hours/week)</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.availability && formik.errors.availability && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{formik.errors.availability}</p>
                )}
              </div>

              <div>
                <label id="pref-interest-label" className="text-xs font-bold text-text-muted mb-1 block">Primary Area of Interest *</label>
                <Select 
                  value={formik.values.interest} 
                  onValueChange={(val) => formik.setFieldValue("interest", val)}
                >
                  <SelectTrigger aria-labelledby="pref-interest-label" className="rounded-xl">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="environment">Cleanliness & Tree Plantation</SelectItem>
                    <SelectItem value="education">Tribal & Child Education</SelectItem>
                    <SelectItem value="relief">Disaster Relief Operations</SelectItem>
                    <SelectItem value="outreach">Community Advocacy & Assemblies</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.interest && formik.errors.interest && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{formik.errors.interest}</p>
                )}
              </div>

              <div>
                <label id="pref-worktype-label" className="text-xs font-bold text-text-muted mb-1 block">Preferred Operation Type *</label>
                <Select 
                  value={formik.values.workType} 
                  onValueChange={(val) => formik.setFieldValue("workType", val)}
                >
                  <SelectTrigger aria-labelledby="pref-worktype-label" className="rounded-xl">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field">Field Operations (Direct driving/cleanup)</SelectItem>
                    <SelectItem value="remote">Remote Support (Design/Content/Calls)</SelectItem>
                    <SelectItem value="both">Flexible (Field & Remote support)</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.workType && formik.errors.workType && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{formik.errors.workType}</p>
                )}
              </div>
            </div>

            {/* Skills selection */}
            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-text-muted block">Select Specific Skillsets (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {skillsOptions.map((skill) => {
                  const isSelected = formik.values.skills.includes(skill);
                  return (
                    <Button
                      key={skill}
                      type="button"
                      variant={isSelected ? "ghost-primary" : "ghost"}
                      size="xs"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected 
                          ? "bg-primary/10 border-primary text-primary hover:bg-primary/10" 
                          : "border-border text-text-muted hover:border-text hover:bg-transparent"
                      }`}
                    >
                      {isSelected && <Check size={11} />}
                      {skill}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-text-muted block">Motivation Statement *</label>
              <textarea
                name="motivation"
                value={formik.values.motivation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-4 rounded-2xl border border-border bg-bg/30 text-text outline-none focus:border-primary min-h-[90px] resize-none font-medium text-xs leading-relaxed"
                placeholder="Why do you wish to volunteer with us? Briefly explain your commitment..."
              />
              {formik.touched.motivation && formik.errors.motivation && (
                <p className="text-red-500 text-[11px] font-semibold">{formik.errors.motivation}</p>
              )}
            </div>
          </div>

          <Separator className="border-border/80 border-dashed" />

          {/* Guidelines checkbox */}
          <div className="p-4 bg-bg/40 border border-border rounded-2xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={formik.values.consentGuidelines}
                onCheckedChange={(checked) => formik.setFieldValue("consentGuidelines", !!checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-text">I accept the Citizen Volunteer Guidelines *</p>
                <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
                  I agree to respect team safety, wear field gear during drives, coordinate with block leaders, and support community alignment.
                </p>
              </div>
            </label>
            {formik.touched.consentGuidelines && formik.errors.consentGuidelines && (
              <p className="text-red-500 text-[11px] font-semibold mt-2 pl-7">{formik.errors.consentGuidelines}</p>
            )}
          </div>

          {/* Form submit button */}
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            fullWidth
            className="bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-2xl h-auto shadow-md"
          >
            {formik.isSubmitting ? "Submitting Application..." : "Submit Volunteer Application"}
          </Button>

          <div className="flex gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl text-[11px] text-blue-900/80 mt-4 leading-relaxed">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <span>
              Your personal credentials (name, email, phone) will be kept private unless you approve publishing. Volunteer approval is subject to coordinate reviews.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
