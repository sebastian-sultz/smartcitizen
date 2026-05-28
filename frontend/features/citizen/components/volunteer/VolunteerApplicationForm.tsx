"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, FileText, Check } from "lucide-react";
import { toast } from "sonner";

interface VolunteerApplicationFormProps {
  onSubmitSuccess: () => void;
}

export default function VolunteerApplicationForm({ onSubmitSuccess }: VolunteerApplicationFormProps) {
  const formik = useFormik({
    initialValues: {
      profession: "",
      experience: "",
      availability: "weekends",
      interest: "environment",
      workType: "field",
      motivation: "",
      consent: false,
    },
    validationSchema: Yup.object().shape({
      profession: Yup.string().required("Profession or student status is required"),
      experience: Yup.string().required("Brief description of volunteer experience is required"),
      availability: Yup.string().required("Availability is required"),
      interest: Yup.string().required("Primary area of interest is required"),
      workType: Yup.string().required("Preferred work location is required"),
      motivation: Yup.string().required("Please explain your motivation").min(20, "Please explain in at least 20 characters"),
      consent: Yup.boolean().oneOf([true], "You must consent to NGO terms & guidelines"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Simulating API call to submit volunteer request
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success("Volunteer Application Submitted Successfully!");
        onSubmitSuccess();
      } catch (err) {
        console.error("Failed to submit volunteer details:", err);
        toast.error("Failure submitting application.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold text-text flex items-center gap-2">
          <Heart size={20} className="text-primary" />
          Coordinator Application Form
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Profession / Study"
              placeholder="e.g. Software Engineer / Student"
              name="profession"
              value={formik.values.profession}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.profession ? formik.errors.profession : undefined}
            />

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text">Weekly Availability</label>
              <Select 
                value={formik.values.availability} 
                onValueChange={(val) => formik.setFieldValue("availability", val)}
              >
                <SelectTrigger className="px-6 py-4 rounded-xl border border-border h-auto">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="weekends">Weekends only</SelectItem>
                  <SelectItem value="weekdays">Weekdays only</SelectItem>
                  <SelectItem value="evenings">Evenings only</SelectItem>
                  <SelectItem value="flexible">Flexible schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text">Primary Track</label>
              <Select 
                value={formik.values.interest} 
                onValueChange={(val) => formik.setFieldValue("interest", val)}
              >
                <SelectTrigger className="px-6 py-4 rounded-xl border border-border h-auto">
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="environment">Environment & Beach Cleanups</SelectItem>
                  <SelectItem value="education">Education Support for Tribal Centers</SelectItem>
                  <SelectItem value="legal">Legal Aid Support Assemblies</SelectItem>
                  <SelectItem value="digital">Digital Safety Assemblies</SelectItem>
                  <SelectItem value="health">Public Health Drives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text">Coordination Format</label>
              <Select 
                value={formik.values.workType} 
                onValueChange={(val) => formik.setFieldValue("workType", val)}
              >
                <SelectTrigger className="px-6 py-4 rounded-xl border border-border h-auto">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="field">Field Coordination (On-Site)</SelectItem>
                  <SelectItem value="remote">Remote Support (Technical/Legal)</SelectItem>
                  <SelectItem value="hybrid">Hybrid Coordination</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Input
            label="Prior Volunteer Experience"
            placeholder="Briefly describe any community work you have completed..."
            name="experience"
            value={formik.values.experience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experience ? formik.errors.experience : undefined}
          />

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text">Motivation Statement</label>
            <textarea
              name="motivation"
              rows={4}
              value={formik.values.motivation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Why do you want to become a verified citizen coordinator with GlobalSmart?"
              className={`w-full rounded-xl border border-border bg-bg p-4 text-base transition-all outline-none focus:border-primary placeholder:text-text-muted ${
                formik.touched.motivation && formik.errors.motivation ? "border-red-500" : ""
              }`}
            />
            {formik.touched.motivation && formik.errors.motivation && (
              <p className="text-red-500 text-xs font-semibold">{formik.errors.motivation}</p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="flex gap-3 items-start p-4 bg-bg/50 border border-border/80 rounded-2xl">
            <Checkbox 
              id="consent" 
              checked={formik.values.consent} 
              onCheckedChange={(checked) => formik.setFieldValue("consent", checked)} 
            />
            <div className="space-y-1">
              <label htmlFor="consent" className="text-xs font-bold text-text leading-none select-none cursor-pointer">
                Commitment to Volunteer Guidelines
              </label>
              <p className="text-[10px] text-text-muted leading-relaxed font-medium">
                I agree to represent the foundation responsibly, maintain civic transparency, and coordinate regional beach cleanups, assemblies, and tree drives professionally.
              </p>
              {formik.touched.consent && formik.errors.consent && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">{formik.errors.consent}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              className="rounded-2xl px-6 py-2.5 h-auto font-bold w-full sm:w-auto"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
