"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MemberProfile } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAlert } from "@/components/ui/AlertProvider";
import { Globe, Edit2 } from "lucide-react";

// Inline brand SVGs to bypass missing lucide exports
const LinkedinIcon = ({ size = 18, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 18, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-1 2.17-2 2.85c.95.03 1.94-.35 2.5-1.15-.43.34-1.1.65-1.9.77-1-.62-2.32-1.02-3.6-1.02-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.7.12 1.03-3.74-.2-7.07-2-9.3-4.72-.4.7-.63 1.5-.63 2.37 0 1.56.78 2.94 2 3.75-.73-.03-1.42-.23-2-.55v.06c0 2.18 1.56 4 3.63 4.42-.38.1-.78.15-1.2.15-.3 0-.6-.03-.88-.1.57 1.8 2.25 3.1 4.25 3.13-1.57 1.23-3.55 1.97-5.7 1.97-.37 0-.73-.02-1.1-.06 2.02 1.3 4.43 2.05 7.02 2.05 8.42 0 13.03-6.97 13.03-13.03 0-.2 0-.4-.01-.6.9-.64 1.67-1.44 2.28-2.35z" />
  </svg>
);

const FacebookIcon = ({ size = 18, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface SocialLinksProps {
  profile: MemberProfile;
  onUpdate: (updatedData: Partial<MemberProfile>) => Promise<void>;
}

export default function SocialLinks({ profile, onUpdate }: SocialLinksProps) {
  const { showAlert } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    linkedinUrl: Yup.string().url("Must be a valid URL").nullable(),
    twitterUrl: Yup.string().url("Must be a valid URL").nullable(),
    facebookUrl: Yup.string().url("Must be a valid URL").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      linkedinUrl: profile.linkedinUrl || "",
      twitterUrl: profile.twitterUrl || "",
      facebookUrl: profile.facebookUrl || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onUpdate(values);
        setIsEditing(false);
        showAlert({
          title: "Social Links Saved",
          message: "Your social media references have been updated successfully.",
          type: "success",
        });
      } catch (err) {
        console.error("Failed to update social links:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Globe className="text-primary animate-pulse" size={20} />
          Social Connections
        </CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold gap-1 px-3 py-1.5 h-auto rounded-xl border-primary/10 text-primary"
          >
            <Edit2 size={12} />
            Edit
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">LinkedIn Profile URL</label>
                <Input
                  name="linkedinUrl"
                  icon={<LinkedinIcon size={16} className="text-text-muted" />}
                  placeholder="https://linkedin.com/in/username"
                  value={formik.values.linkedinUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.linkedinUrl && formik.errors.linkedinUrl ? formik.errors.linkedinUrl : undefined}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Twitter/X Profile URL</label>
                <Input
                  name="twitterUrl"
                  icon={<TwitterIcon size={16} className="text-text-muted" />}
                  placeholder="https://twitter.com/username"
                  value={formik.values.twitterUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.twitterUrl && formik.errors.twitterUrl ? formik.errors.twitterUrl : undefined}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-1 block">Facebook Profile URL</label>
                <Input
                  name="facebookUrl"
                  icon={<FacebookIcon size={16} className="text-text-muted" />}
                  placeholder="https://facebook.com/username"
                  value={formik.values.facebookUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.facebookUrl && formik.errors.facebookUrl ? formik.errors.facebookUrl : undefined}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  formik.resetForm();
                  setIsEditing(false);
                }}
                disabled={loading}
                className="rounded-xl px-4 py-2 h-auto text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-white rounded-xl px-4 py-2 h-auto text-xs font-bold"
              >
                {loading ? "Saving..." : "Save Links"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 bg-bg/40 border border-border/80 rounded-2xl">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <LinkedinIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">LinkedIn</span>
                <p className="text-sm font-semibold text-text truncate">
                  {profile.linkedinUrl ? (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                      {profile.linkedinUrl}
                    </a>
                  ) : (
                    <span className="text-text-muted italic font-medium">Not Connected</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 bg-bg/40 border border-border/80 rounded-2xl">
              <div className="p-2 bg-sky-50 text-sky-500 rounded-xl">
                <TwitterIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Twitter / X</span>
                <p className="text-sm font-semibold text-text truncate">
                  {profile.twitterUrl ? (
                    <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                      {profile.twitterUrl}
                    </a>
                  ) : (
                    <span className="text-text-muted italic font-medium">Not Connected</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 bg-bg/40 border border-border/80 rounded-2xl">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <FacebookIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Facebook</span>
                <p className="text-sm font-semibold text-text truncate">
                  {profile.facebookUrl ? (
                    <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                      {profile.facebookUrl}
                    </a>
                  ) : (
                    <span className="text-text-muted italic font-medium">Not Connected</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
