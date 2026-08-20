"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { UserPlus, UserCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { addDirectMember } from "../api";
import { AddDirectMemberPayload } from "../types";
import { nameSchema, phoneSchema } from "@/lib/validation";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  onSuccess?: () => void;
}

const addMemberSchema = Yup.object().shape({
  name: nameSchema("Full Name is required"),
  phone: phoneSchema("Mobile phone number is required"),
});

export default function AddMemberDialog({
  isOpen,
  onClose,
  referralCode,
  onSuccess,
}: AddMemberDialogProps) {
  const formik = useFormik<AddDirectMemberPayload>({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: addMemberSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await addDirectMember({
          name: values.name.trim(),
          phone: values.phone.trim(),
        });
        if (res) {
          toast.success(
            `Member ${values.name} enrolled successfully under code ${referralCode}`,
          );
          resetForm();
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (error: unknown) {
        // Handled via global error handler
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      formik.resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent size="md" className="gap-4">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-12.5 h-12.5 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10">
              <UserPlus size={20} />
            </div>
            <div>
              <div className="flex flex-col gap-">
                <DialogTitle className="font-display text-lg font-bold text-text leading-none">
                  Direct Member Enrollment
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted leading-none">
                  Register a new member directly under your invitation code.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Referrer Badge Notice */}
        <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-primary/5 border border-primary/10 my-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <span className="text-xs font-medium text-text-muted">
              Assigned Referrer Code
            </span>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-xs font-bold text-primary"
          >
            {referralCode || "PRIMARY"}
          </Badge>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-bold text-text-muted block"
            >
              Member Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : undefined
              }
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="text-xs font-bold text-text-muted block"
            >
              10-Digit Mobile Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              size="md"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phone && formik.errors.phone
                  ? formik.errors.phone
                  : undefined
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleDialogChange(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={formik.isSubmitting}
              startIcon={<UserCheck size={16} />}
            >
              Enroll Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
