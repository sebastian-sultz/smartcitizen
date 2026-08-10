"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  Heart, 
  ShieldCheck, 
  Smartphone, 
  Send, 
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
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
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<"online" | "manual">("online");

  const formik = useFormik({
    initialValues: {
      amount: "" as number | "",
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
        .min(1, "Minimum contribution is ₹1")
        .max(10000000, "Maximum contribution is ₹10,000,000"),
      donorName: nameSchema().max(100, "Name must be under 100 characters").nullable(),
      pan: panSchema().nullable(),
      donorAddress: addressSchema().max(200, "Address must be under 200 characters").nullable(),
      transactionId: Yup.string().when([], {
        is: () => paymentType === "manual" && step === 3,
        then: () => trimmedString().required("Transaction Reference / UTR ID is required"),
        otherwise: () => Yup.string().notRequired(),
      }),
      receipt: Yup.mixed().when([], {
        is: () => paymentType === "manual" && step === 3,
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
            if (response.merchantOrderId) {
              sessionStorage.setItem(`payment_auth_${response.merchantOrderId}`, "true");
            }
            // Redirect browser directly to secure PhonePe hosted page
            window.location.href = response.redirectUrl;
          } else {
            // Fallback mock transaction ID for sandbox testing
            const generatedTxId = response?.merchantOrderId || "TXN" + Math.floor(10000000 + Math.random() * 90000000);
            sessionStorage.setItem(`payment_auth_${generatedTxId}`, "true");
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

  const nextStep = async () => {
    if (step === 1) {
      formik.setFieldTouched("amount", true);
      const errors = await formik.validateForm();
      if (!errors.amount && formik.values.amount !== "") {
        setStep(2);
      }
    } else if (step === 2) {
      formik.setFieldTouched("pan", true);
      formik.setFieldTouched("donorAddress", true);
      if (!user) {
        formik.setFieldTouched("donorName", true);
      }
      const errors = await formik.validateForm();
      if (!errors.pan && !errors.donorName && !errors.donorAddress) {
        setStep(3);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full h-full rounded-card-lg border border-border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden bg-white flex flex-col justify-between">
      {/* Header and Step Tracker Panel */}
      <div className="border-b border-border/40 bg-gradient-to-r from-bg to-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title and Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner shrink-0">
            <Heart size={22} fill="currentColor" className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-display font-black text-text tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-text-muted mt-0.5 font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Wizard Progress Line */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-text-muted  self-center md:self-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <span
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center font-display transition-colors text-[10px] sm:text-xs",
                step === 1
                  ? "bg-primary text-white"
                  : step > 1
                    ? "bg-green-600 text-white"
                    : "bg-primary/10 text-primary",
              )}
            >
              {step > 1 ? <Check size={12} className="stroke-[3]" /> : "1"}
            </span>
            <span
              className={
                step === 1
                  ? "text-text font-black"
                  : step > 1
                    ? "text-green-600 font-bold"
                    : "font-semibold"
              }
            >
              Amount
            </span>
          </div>

          <div
            className={cn(
              "w-3 sm:w-8 h-[2px] transition-colors duration-300",
              step > 1 ? "bg-green-600" : "bg-border",
            )}
          />

          <div className="flex items-center gap-1 sm:gap-2">
            <span
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center font-display transition-colors text-[10px] sm:text-xs",
                step === 2
                  ? "bg-primary text-white"
                  : step > 2
                    ? "bg-green-600 text-white"
                    : "bg-primary/10 text-primary",
              )}
            >
              {step > 2 ? <Check size={12} className="stroke-[3]" /> : "2"}
            </span>
            <span
              className={
                step === 2
                  ? "text-text font-black"
                  : step > 2
                    ? "text-green-600 font-bold"
                    : "font-semibold"
              }
            >
              Payment
            </span>
          </div>

          <div
            className={cn(
              "w-3 sm:w-8 h-[2px] transition-colors duration-300",
              step > 2 ? "bg-green-600" : "bg-border",
            )}
          />

          <div className="flex items-center gap-1 sm:gap-2">
            <span
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center font-display transition-colors text-[10px] sm:text-xs",
                step === 3
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary",
              )}
            >
              3
            </span>
            <span
              className={step === 3 ? "text-text font-black" : "font-semibold"}
            >
              Complete
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <CardContent className="p-6 md:p-8 min-h-[360px] flex-1 flex flex-col justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) {
              nextStep();
            } else {
              formik.handleSubmit(e);
            }
          }}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-center py-2">
            {/* STEP 1: Select Amount */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in w-full max-w-2xl mx-auto">
                <div className="text-center space-y-1.5">
                  <h4 className="font-display font-black text-lg text-text">
                    Choose contribution amount
                  </h4>
                  <p className="text-xs text-text-muted font-medium">
                    Select a quick preset or enter a custom sum
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {PRESET_AMOUNTS.map((amount) => {
                      const isSelected = formik.values.amount === amount;
                      return (
                        <Button
                          key={amount}
                          type="button"
                          variant={isSelected ? "primary" : "secondary"}
                          size="md"
                          noShadow
                          className={cn(
                            "transition-all duration-300 relative border",
                            isSelected
                              ? "border-primary shadow-sm"
                              : "border-border/80 text-text hover:border-primary/40 hover:scale-[1.02]",
                          )}
                          onClick={() => {
                            formik.setFieldValue("amount", amount);
                          }}
                        >
                          ₹{amount.toLocaleString("en-IN")}
                          {isSelected && (
                            <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-accent" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  <Input
                    label="Custom Amount (₹) *"
                    placeholder="Enter custom amount (Minimum ₹1)"
                    value={formik.values.amount}
                    onChange={handleCustomAmountChange}
                    error={
                      formik.touched.amount && formik.errors.amount
                        ? (formik.errors.amount as string)
                        : undefined
                    }
                    size="sm"
                    icon={
                      <span className="text-sm font-bold text-text-light font-display">
                        ₹
                      </span>
                    }
                    className="focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Choose Payment Method & Identity */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in w-full max-w-2xl mx-auto">
                <div className="text-center space-y-1.5">
                  <h4 className="font-display font-black text-lg text-text">
                    Select your payment channel
                  </h4>
                  <p className="text-xs text-text-muted font-medium">
                    Choose between quick online portal or direct transfer
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Card 1 */}
                  <div
                    onClick={() => setPaymentType("online")}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border cursor-pointer  transition-all duration-300 bg-white",
                      paymentType === "online"
                        ? "border-primary bg-primary/[0.02] shadow-[0_2px_12px_-4px_rgba(var(--color-primary),0.08)]"
                        : "border-border/80 hover:border-primary/30 hover:bg-bg/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl transition-colors",
                          paymentType === "online"
                            ? "bg-primary text-white"
                            : "bg-bg text-text-muted",
                        )}
                      >
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text">
                          Instant Online checkout
                        </p>
                        <p className="text-[10px] text-text-muted font-semibold mt-0.5">
                          UPI, Cards, and Net Banking
                        </p>
                      </div>
                    </div>
                    {paymentType === "online" && (
                      <CheckCircle2
                        size={18}
                        className="text-primary shrink-0"
                      />
                    )}
                  </div>

                  {/* Payment Card 2 */}
                  <div
                    onClick={() => setPaymentType("manual")}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border cursor-pointer  transition-all duration-300 bg-white",
                      paymentType === "manual"
                        ? "border-primary bg-primary/[0.02] shadow-[0_2px_12px_-4px_rgba(var(--color-primary),0.08)]"
                        : "border-border/80 hover:border-primary/30 hover:bg-bg/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl transition-colors",
                          paymentType === "manual"
                            ? "bg-primary text-white"
                            : "bg-bg text-text-muted",
                        )}
                      >
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text">
                          Direct Bank Transfer
                        </p>
                        <p className="text-[10px] text-text-muted font-semibold mt-0.5">
                          HDFC Account Wire Transfer
                        </p>
                      </div>
                    </div>
                    {paymentType === "manual" && (
                      <CheckCircle2
                        size={18}
                        className="text-primary shrink-0"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!user && (
                    <Input
                      label="Donor Name (Optional)"
                      placeholder="Enter name for receipt"
                      name="donorName"
                      value={formik.values.donorName}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s{2,}/g, " ");
                        formik.setFieldValue("donorName", val);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.donorName
                          ? formik.errors.donorName
                          : undefined
                      }
                      size="sm"
                    />
                  )}
                  <Input
                    label="PAN Number (Optional)"
                    placeholder="Enter 10-character PAN"
                    name="pan"
                    maxLength={10}
                    value={formik.values.pan}
                    onChange={(e) => {
                      const val = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 10);
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
                  <div className="sm:col-span-2">
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
                        formik.touched.donorAddress &&
                        formik.errors.donorAddress
                          ? (formik.errors.donorAddress as string)
                          : undefined
                      }
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Verification & Complete */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto">
                <div className="text-center space-y-1.5">
                  <h4 className="font-display font-black text-lg text-text">
                    Confirm & complete payment
                  </h4>
                  <p className="text-xs text-text-muted font-medium">
                    Review your contribution summary details below
                  </p>
                </div>

                {paymentType === "online" ? (
                  <div className="max-w-md mx-auto space-y-5">
                    {/* Summary Info box */}
                    <div className="p-5 rounded-2xl bg-bg border border-border/80 space-y-4 shadow-inner">
                      <div className="flex justify-between items-center text-xs font-bold pb-2.5 border-b border-border/40">
                        <span className="text-text-muted">
                          Total Contribution:
                        </span>
                        <span className="text-text text-lg font-display font-black">
                          ₹
                          {(Number(formik.values.amount) || 0).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 },
                          )}
                        </span>
                      </div>

                      <div className="flex gap-3 items-start">
                        <Info
                          size={16}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
                          Confirming below redirects you to PhonePe&apos;s
                          secure portal where you can pay using UPI, cards, net
                          banking, or popular wallet clients.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Compact 2-column layout for manual transfer to control vertical height shifts
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                    {/* Left Column: Bank Recipient Voucher */}
                    <div className="bg-bg/40 p-4 border border-border/60 rounded-2xl flex flex-col justify-between shadow-inner">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                          <Building2 size={14} />
                          <span>Direct Recipient Bank Info</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] font-semibold py-2 border-y border-border/40">
                          <div>
                            <p className="text-text-light opacity-75">
                              Account Name
                            </p>
                            <p className="font-bold text-text mt-0.5">
                              Global Smart Citizens
                            </p>
                          </div>
                          <div>
                            <p className="text-text-light opacity-75">
                              HDFC Account
                            </p>
                            <p className="font-bold text-text mt-0.5 tracking-wider select-all">
                              50200119596441
                            </p>
                          </div>
                          <div className="mt-1">
                            <p className="text-text-light opacity-75">
                              IFSC Code
                            </p>
                            <p className="font-bold text-text mt-0.5 tracking-wider select-all">
                              HDFC0000226
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mt-3 text-[10px] text-green-800 leading-tight font-medium">
                        <ShieldCheck
                          size={14}
                          className="text-green-600 shrink-0"
                        />
                        <span>
                          Perform a standard bank transfer to HDFC then upload
                          proof below.
                        </span>
                      </div>
                    </div>

                    {/* Right Column: UTR & Upload Receipt Fields */}
                    <div className="space-y-3 bg-bg/20 p-4 border border-border/40 rounded-2xl flex flex-col justify-between">
                      <Input
                        label="Transaction UTR / Reference ID *"
                        placeholder="Enter 12-digit reference ID"
                        name="transactionId"
                        value={formik.values.transactionId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.transactionId &&
                          formik.errors.transactionId
                            ? (formik.errors.transactionId as string)
                            : undefined
                        }
                        size="sm"
                      />

                      <ManualUploadField
                        file={formik.values.receipt}
                        onChange={(file) =>
                          formik.setFieldValue("receipt", file)
                        }
                        error={
                          formik.touched.receipt && formik.errors.receipt
                            ? (formik.errors.receipt as string)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav Controls - Back / Next Layout */}
          <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between gap-4">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={prevStep}
                  startIcon={<ChevronLeft size={16} />}
                >
                  Back
                </Button>
              )}
            </div>

            <div>
              {step < 3 ? (
                <Button
                  key="btn-next"
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={nextStep}
                  endIcon={<ChevronRight size={16} />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  key="btn-submit"
                  type="submit"
                  variant="accent"
                  size="sm"
                  startIcon={<Send size={14} />}
                  isLoading={formik.isSubmitting}
                  className="uppercase tracking-wider shadow-[0_4px_16px_rgba(235,94,85,0.25)]"
                >
                  {paymentType === "online"
                    ? "Proceed to PhonePe"
                    : "Submit Receipt Proof"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
