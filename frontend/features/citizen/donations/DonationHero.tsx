"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HeartHandshake,
  ShieldCheck,
  Zap,
  Globe,
  Coins,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationHeroProps {
  onDonateInitiate: (params: {
    amount: number;
    purpose: string;
    provider: "phonepe" | "razorpay";
  }) => void;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const PURPOSES = [
  { value: "General Citizen Fund", label: "General Citizen Fund" },
  { value: "Public Civic Assemblies", label: "Public Civic Assemblies" },
  { value: "Local Clean-up & Eco Drives", label: "Local Clean-up & Eco Drives" },
  { value: "Community Empowerment Technology", label: "Community Tech & Development" },
];

export default function DonationHero({ onDonateInitiate }: DonationHeroProps) {
  const formik = useFormik({
    initialValues: {
      amount: 1000 as number | "",
      purpose: "General Citizen Fund",
      provider: "phonepe" as "phonepe" | "razorpay",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .required("Please select or enter a donation amount.")
        .min(100, "Minimum contribution amount is ₹100.")
        .max(10000000, "Maximum contribution amount is ₹10,000,000."),
      purpose: Yup.string().required("Please select a support purpose."),
      provider: Yup.string()
        .oneOf(["phonepe", "razorpay"])
        .required("Please select a payment provider."),
    }),
    onSubmit: (values) => {
      onDonateInitiate({
        amount: Number(values.amount),
        purpose: values.purpose,
        provider: values.provider,
      });
    },
  });

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      formik.setFieldValue("amount", value === "" ? "" : parseInt(value, 10));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-scale-in">
      {/* Left Column: Narrative/Information */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-10 bg-gradient-to-br from-primary to-primary-light text-white rounded-3xl md:rounded-[40px] relative overflow-hidden shadow-card">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl -mb-16 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider">
            <HeartHandshake size={14} className="text-accent-light" />
            Make a Direct Impact
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-black leading-[1.1] tracking-tight">
            Support the Future of <br className="hidden md:inline" /> SmartCitizen Initiatives
          </h1>

          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">
            Your contributions directly fund localized civic activities. We allocate resources to empower neighborhood assemblies, support eco clean-up operations, and deploy community tools that encourage citizen involvement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-3xl border border-white/10">
              <ShieldCheck size={20} className="text-accent-light shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">80G Tax Deductible</p>
                <p className="text-xs text-white/70">
                  Claim rebates on your contributions automatically
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-3xl border border-white/10">
              <Zap size={20} className="text-accent-light shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">Direct Deployment</p>
                <p className="text-xs text-white/70">
                  Funds routed straight to local civic programs
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <Globe size={14} />
            <span>smartcitizen.org/transparency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins size={14} />
            <span>Audited & verified finances</span>
          </div>
        </div>
      </div>

      {/* Right Column: Quick Donation Form Widget */}
      <div className="lg:col-span-5 flex">
        <Card className="w-full rounded-3xl md:rounded-[40px] border border-border shadow-card flex flex-col justify-between overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-5 flex-1 pt-6 md:pt-8">
            <div className="space-y-1.5">
              <h2 className="text-xl font-display font-black text-text">Quick Contribution</h2>
              <p className="text-xs text-text-muted">
                Choose an amount and your payment method to proceed
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Preset Amounts Grid */}
              <div className="space-y-2">
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
                        className={cn(
                          "py-3 px-2 text-xs font-bold h-auto rounded-xl",
                          isSelected
                            ? "bg-primary text-white"
                            : "border-border/80 text-text hover:bg-bg"
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
                placeholder="Or enter custom amount (₹)"
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
                className="py-3.5 pr-4 text-sm"
                icon={<span className="font-bold text-text-light text-sm">₹</span>}
              />

              {/* Purpose Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Support Purpose
                </label>
                <Select
                  value={formik.values.purpose}
                  onValueChange={(val) => formik.setFieldValue("purpose", val)}
                >
                  <SelectTrigger className="px-4 py-3 text-xs rounded-xl h-auto border-border bg-bg/50">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {PURPOSES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Gateway Provider Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all hover:bg-bg/40 select-none",
                      formik.values.provider === "phonepe"
                        ? "border-indigo-600 bg-indigo-50/20"
                        : "border-border/80 bg-transparent"
                    )}
                    onClick={() => formik.setFieldValue("provider", "phonepe")}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-lg shrink-0",
                        formik.values.provider === "phonepe"
                          ? "bg-indigo-600 text-white"
                          : "bg-bg text-text-muted"
                      )}
                    >
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">PhonePe</p>
                      <p className="text-[10px] text-text-muted font-medium">UPI / QR Code</p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all hover:bg-bg/40 select-none",
                      formik.values.provider === "razorpay"
                        ? "border-blue-600 bg-blue-50/20"
                        : "border-border/80 bg-transparent"
                    )}
                    onClick={() => formik.setFieldValue("provider", "razorpay")}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-lg shrink-0",
                        formik.values.provider === "razorpay"
                          ? "bg-blue-600 text-white"
                          : "bg-bg text-text-muted"
                      )}
                    >
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">Razorpay</p>
                      <p className="text-[10px] text-text-muted font-medium">Card / Netbank</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                variant="accent"
                className="w-full text-xs font-black py-3.5 h-auto rounded-2xl"
              >
                Proceed to Contribute
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
