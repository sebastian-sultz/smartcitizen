"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { MemberProfile } from "../../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

interface SocialLinksProps {
  profile: MemberProfile;
  onSave: (updated: Partial<MemberProfile>) => Promise<void>;
}

export default function SocialLinks({ profile, onSave }: SocialLinksProps) {
  const formik = useFormik({
    initialValues: {
      linkedinUrl: profile.linkedinUrl || "",
      twitterUrl: profile.twitterUrl || "",
      facebookUrl: profile.facebookUrl || "",
    },
    validationSchema: Yup.object().shape({
      linkedinUrl: Yup.string().url("Enter a valid URL").nullable(),
      twitterUrl: Yup.string().url("Enter a valid URL").nullable(),
      facebookUrl: Yup.string().url("Enter a valid URL").nullable(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await onSave(values);
        toast.success("Social links updated successfully!");
      } catch (err) {
        console.error("Social links save failed:", err);
        toast.error("Failed to update social links.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const LinkedInIcon = (
    <svg className="w-5 h-5 text-[#0A66C2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );

  const TwitterIcon = (
    <svg className="w-5 h-5 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const FacebookIcon = (
    <svg className="w-5 h-5 text-[#1877F2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Share2 size={20} className="text-primary" />
          Social Profiles
        </CardTitle>
        <p className="text-sm text-text-muted mt-1 font-medium">
          Link your professional and social profiles to show on the civic network.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="LinkedIn Profile"
              placeholder="https://linkedin.com/in/username"
              icon={LinkedInIcon}
              name="linkedinUrl"
              value={formik.values.linkedinUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.linkedinUrl ? formik.errors.linkedinUrl : undefined}
            />

            <Input
              label="Twitter / X Profile"
              placeholder="https://x.com/username"
              icon={TwitterIcon}
              name="twitterUrl"
              value={formik.values.twitterUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.twitterUrl ? formik.errors.twitterUrl : undefined}
            />

            <Input
              label="Facebook Profile"
              placeholder="https://facebook.com/username"
              icon={FacebookIcon}
              name="facebookUrl"
              value={formik.values.facebookUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.facebookUrl ? formik.errors.facebookUrl : undefined}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              className="rounded-2xl px-6 py-2.5 h-auto font-bold"
            >
              Update Links
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
