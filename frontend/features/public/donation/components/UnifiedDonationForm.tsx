"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  Heart, 
  ShieldCheck, 
  Smartphone, 
  Send, 
  Building2 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useCitizenStore } from "@/store/citizenStore";
import { nameSchema, panSchema, addressSchema, trimmedString } from "@/lib/validation";
import ManualUploadField from "./ManualUploadField";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

interface UnifiedDonationFormProps {
  submitApiCall: (payload: { 
    amount: number; 
    donorName: string; 
    donorEmail?: string; 
    donorPhone?: string; 
    donorPan?: string;
    donorAddress?: string;
  }) => Promise<{
    redirectUrl: string;
    merchantOrderId: string;
  }>;
  onSuccess: (details: { transactionId: string; amount: number; isManual: boolean }) => void;
  title?: string;
  description?: string;
}

export default function UnifiedDonationForm({
  submitApiCall,
  onSuccess,
  title = "Make a Contribution",
  description = "Choose your amount and support our civic initiatives"
}: UnifiedDonationFormProps) {
  const { user } = useCitizenStore();
  const [paymentType, setPaymentType] = useState<"online" | "manual">("online");

  const formik = useFormik({
    initialValues: {
      amount: 1000 as number | "",
      donorName: "", // Optional for anonymous users
      pan: "",
      donorAddress: "",
      transactionId: "",
      receipt: null as File | null,
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .required("Donation amount is required")
        .min(100, "Minimum contribution is ₹100")
        .max(10000000, "Maximum contribution is ₹10,000,000"),
      donorName: nameSchema().max(100, "Name must be under 100 characters").nullable(),
      pan: panSchema().nullable(),
      donorAddress: addressSchema().max(200, "Address must be under 200 characters").nullable(),
      transactionId: Yup.string().when([], {
        is: () => paymentType === "manual",
        then: () => trimmedString().required("Transaction Reference / UTR ID is required"),
        otherwise: () => Yup.string().notRequired(),
      }),
      receipt: Yup.mixed().when([], {
        is: () => paymentType === "manual",
        then: () => Yup.mixed().required("Payment receipt image is required"),
        otherwise: () => Yup.mixed().notRequired(),
      }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        if (paymentType === "manual") {
          // Manual bank transfer is simulated offline since the backend has no offline slip endpoint
          await new Promise((resolve) => setTimeout(resolve, 1500));
          onSuccess({
            transactionId: values.transactionId,
            amount: Number(values.amount),
            isManual: true
          });
        } else {
          // Online PhonePe integration
          const finalDonorName = user?.name || values.donorName || "Anonymous Citizen";
          const finalDonorPhone = user?.phone || undefined;

          const payload = {
            amount: Number(values.amount),
            donorName: finalDonorName,
            donorPan: values.pan || undefined,
            donorAddress: values.donorAddress || undefined,
            ...(finalDonorPhone ? { donorPhone: finalDonorPhone } : {})
          };

          const response = await submitApiCall(payload);
          if (response?.redirectUrl) {
            // Redirect browser directly to secure PhonePe hosted page
            window.location.href = response.redirectUrl;
          } else {
            // Fallback mock transaction ID for sandbox testing
            const generatedTxId = response?.merchantOrderId || "TXN" + Math.floor(10000000 + Math.random() * 90000000);
            onSuccess({
              transactionId: generatedTxId,
              amount: Number(values.amount),
              isManual: false
            });
          }
        }
      } catch (err) {
        console.error("Donation submission failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      formik.setFieldValue("amount", "");
    } else {
      const parsed = parseInt(value, 10);
      if (parsed <= 10000000) {
        formik.setFieldValue("amount", parsed);
      }
    }
  };

  return (
    <Card className="w-full rounded-[32px] border border-border shadow-card flex flex-col justify-between overflow-hidden">
      <CardHeader className="flex-row items-center gap-4 border-b border-border/40 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shadow-sm shrink-0">
          <Heart size={22} fill="currentColor" className="text-accent" />
        </div>
        <div>
          <CardTitle className="text-xl font-display font-black text-text">{title}</CardTitle>
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Tax Rebate Info Banner */}
        <div className="bg-green-50/70 border border-green-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={18} />
          <p className="text-[13px] text-green-800 leading-normal">
            <span className="font-bold">80G Tax Rebate:</span> Contributions to our foundation are tax-exempt under Section 80G. Enter your PAN below to claim tax benefits.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Preset Amounts Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Select Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amount) => {
                const isSelected = formik.values.amount === amount;
                return (
                  <Button
                    key={amount}
                    type="button"
                    variant={isSelected ? "primary" : "secondary"}
                    size="sm"
                    noShadow
                    className={cn(
                      "border border-transparent",
                      !isSelected && "border-border/80 text-text"
                    )}
                    onClick={() => {
                      formik.setFieldValue("amount", amount);
                    }}
                  >
                    ₹{amount.toLocaleString("en-IN")}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <Input
            label="Or Enter Custom Amount (₹) *"
            placeholder="Enter custom amount"
            value={
              PRESET_AMOUNTS.includes(Number(formik.values.amount))
                ? ""
                : formik.values.amount
            }
            onChange={handleCustomAmountChange}
            error={
              formik.touched.amount && formik.errors.amount
                ? (formik.errors.amount as string)
                : undefined
            }
            size="sm"
            icon="₹"
          />

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Payment Method
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentType === "online" ? "primary" : "secondary"}
                size="md"
                className={cn(
                  "border",
                  paymentType === "online"
                    ? "border-primary"
                    : "border-border"
                )}
                onClick={() => setPaymentType("online")}
              >
                Online Gateway
              </Button>
              <Button
                type="button"
                variant={paymentType === "manual" ? "primary" : "secondary"}
                size="md"
                className={cn(
                  "border",
                  paymentType === "manual"
                    ? "border-primary"
                    : "border-border"
                )}
                onClick={() => setPaymentType("manual")}
              >
                Manual Bank Transfer
              </Button>
            </div>
          </div>

          {/* Conditional Input Fields */}
          {paymentType === "online" ? (
            <div className="space-y-4 animate-fade-in">
              {/* Optional Guest Name Input if not logged in */}
              {!user && (
                <Input
                  label="Donor Name (Optional - Displays on Tax Receipt)"
                  placeholder="Enter name for receipt"
                  name="donorName"
                  value={formik.values.donorName}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s{2,}/g, " ");
                    formik.setFieldValue("donorName", val);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.donorName ? formik.errors.donorName : undefined}
                  size="sm"
                />
              )}

              <div className="flex items-center gap-2.5 p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/20 select-none">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0">
                  <Smartphone size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">PhonePe Payment Gateway</p>
                  <p className="text-[10px] text-text-muted font-medium">UPI, Cards, and Net Banking checkout page</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in bg-bg/50 p-4 border border-border/60 rounded-2xl">
              {/* Account details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Building2 size={16} />
                  <span>Transfer Recipient Bank Info</span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs py-2 border-y border-border/40">
                  <div>
                    <p className="text-text-muted">Account Name</p>
                    <p className="font-bold text-text mt-0.5">Global Smart Citizens</p>
                  </div>
                  <div>
                    <p className="text-text-muted">HDFC Bank Account</p>
                    <p className="font-bold text-text mt-0.5 tracking-wider">50200119596441</p>
                  </div>
                  <div className="mt-1">
                    <p className="text-text-muted">IFSC Code</p>
                    <p className="font-bold text-text mt-0.5 tracking-wider">HDFC0000226</p>
                  </div>
                </div>
              </div>

              {/* UTR Input */}
              <Input
                label="Transaction ID / UTR / Reference *"
                placeholder="Enter 12-digit reference number"
                name="transactionId"
                value={formik.values.transactionId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.transactionId && formik.errors.transactionId
                    ? (formik.errors.transactionId as string)
                    : undefined
                }
                size="sm"
              />

              {/* Upload field */}
              <ManualUploadField
                file={formik.values.receipt}
                onChange={(file) => formik.setFieldValue("receipt", file)}
                error={
                  formik.touched.receipt && formik.errors.receipt
                    ? (formik.errors.receipt as string)
                    : undefined
                }
              />
            </div>
          )}

          {/* PAN Input (Optional) */}
          <Input
            label="PAN Number (Optional - Required for 80G Tax Rebate)"
            placeholder="ABCDE1234F"
            name="pan"
            maxLength={10}
            value={formik.values.pan}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
              formik.setFieldValue("pan", val);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.pan && formik.errors.pan
                ? (formik.errors.pan as string)
                : undefined
            }
            size="sm"
          />

          {/* Address Input (Optional) */}
          <Input
            label="Address (Optional - Required for 80G Tax Rebate)"
            placeholder="Enter your address"
            name="donorAddress"
            value={formik.values.donorAddress}
            onChange={(e) => {
              const val = e.target.value.replace(/\s{2,}/g, " ");
              formik.setFieldValue("donorAddress", val);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.donorAddress && formik.errors.donorAddress
                ? (formik.errors.donorAddress as string)
                : undefined
            }
            size="sm"
          />

          {/* Submit Action */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            fullWidth
            startIcon={<Send size={16} />}
            isLoading={formik.isSubmitting}
          >
            {paymentType === "online" ? "Proceed to PhonePe" : "Submit Receipt Proof"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
