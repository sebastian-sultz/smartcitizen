"use client";

import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/spinner";
import {
  Shield,
  CreditCard,
  Smartphone,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCardNumber, formatExpiryDate } from "./helpers";

interface CheckoutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  purpose: string;
  provider: "phonepe" | "razorpay";
  onSuccess: (details: { transactionId: string; paymentMethod: string }) => void;
}

type PaymentStep = "method_select" | "card_entry" | "upi_entry" | "qr_display" | "processing" | "success" | "error";

export default function CheckoutModal({
  isOpen,
  onOpenChange,
  amount,
  purpose,
  provider,
  onSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<PaymentStep>("method_select");
  const [loadingMessage, setLoadingMessage] = useState("Connecting to gateway...");
  const [transactionId, setTransactionId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);

  // Keep track of timeouts so we can cancel them safely
  const paymentTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const lastUsedPaymentMethod = useRef<string>("");

  useEffect(() => {
    return () => {
      // Clear any pending timeouts on unmount to prevent memory leaks
      paymentTimeoutRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Formik validation for Credit Card
  const cardFormik = useFormik({
    initialValues: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardName: "",
    },
    validationSchema: Yup.object({
      cardNumber: Yup.string()
        .transform((value) => (value ? value.replace(/\s+/g, "") : value))
        .matches(/^\d{16}$/, "Must be exactly 16 digits")
        .required("Card number is required"),
      expiry: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Must be MM/YY")
        .required("Expiry is required"),
      cvv: Yup.string()
        .matches(/^\d{3}$/, "Must be exactly 3 digits")
        .required("CVV is required"),
      cardName: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Cardholder name is required"),
    }),
    onSubmit: (values) => {
      triggerPayment("Card Ending in " + values.cardNumber.slice(-4));
    },
  });

  // Formik validation for UPI ID
  const upiFormik = useFormik({
    initialValues: {
      upiId: "",
    },
    validationSchema: Yup.object({
      upiId: Yup.string()
        .matches(/^[\w.-]+@[\w.-]+$/, "Enter a valid UPI ID (e.g. name@upi)")
        .required("UPI ID is required"),
    }),
    onSubmit: (values) => {
      triggerPayment("UPI: " + values.upiId);
    },
  });

  const completeSimulatedPayment = (paymentMethodUsed: string) => {
    const generatedTxId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);
    setTransactionId(generatedTxId);
    setStep("success");

    // Deliver callback
    onSuccess({
      transactionId: generatedTxId,
      paymentMethod: paymentMethodUsed,
    });

    // Auto close after success message
    const t = setTimeout(() => {
      handleClose();
    }, 3000);
    paymentTimeoutRef.current.push(t);
  };

  const triggerPayment = (paymentMethodUsed: string) => {
    lastUsedPaymentMethod.current = paymentMethodUsed;
    setStep("processing");
    setLoadingMessage("Securing payment connection...");

    // Clear any previous timeouts
    paymentTimeoutRef.current.forEach((t) => clearTimeout(t));
    paymentTimeoutRef.current = [];

    // Simulate payment sequence steps with accelerated timing for better usability
    const t1 = setTimeout(() => {
      setLoadingMessage("Authorizing amount with your bank...");
    }, 800);

    const t2 = setTimeout(() => {
      setLoadingMessage("Finalizing transaction logs...");
    }, 1600);

    const t3 = setTimeout(() => {
      completeSimulatedPayment(paymentMethodUsed);
    }, 2400);

    paymentTimeoutRef.current.push(t1, t2, t3);
  };

  const handleClose = () => {
    // Clear timeouts
    paymentTimeoutRef.current.forEach((t) => clearTimeout(t));
    paymentTimeoutRef.current = [];

    onOpenChange(false);
    // Reset state after animation finishes
    setTimeout(() => {
      setStep("method_select");
      setSelectedUpiApp(null);
      cardFormik.resetForm();
      upiFormik.resetForm();
    }, 300);
  };

  const formattedAmount = amount.toLocaleString("en-IN");
  const isPhonePe = provider === "phonepe";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-[32px] p-6 gap-0 overflow-hidden">
        {/* Header Branding */}
        {step !== "processing" && step !== "success" && (
          <DialogHeader className="pb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-2 rounded-xl text-white shrink-0",
                  isPhonePe ? "bg-indigo-600" : "bg-blue-600"
                )}
              >
                <Shield size={18} />
              </div>
              <div>
                <DialogTitle className="font-display font-black text-base text-text">
                  {isPhonePe ? "PhonePe Checkout" : "Razorpay Checkout"}
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted">
                  Secured & encrypted payment environment
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        )}

        {/* Info Area */}
        {step !== "processing" && step !== "success" && (
          <div className="bg-bg/50 p-4 border-b border-border/40 flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                Funding Purpose
              </p>
              <p className="font-bold text-text truncate max-w-[200px]">{purpose}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                Total Payable
              </p>
              <p className="font-display font-black text-primary text-sm">
                ₹{formattedAmount}
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="pt-6">
          {/* STEP: Method Selection */}
          {step === "method_select" && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Select Payment Mode
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {isPhonePe ? (
                  <>
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-between p-4 h-auto text-left border border-border/80 hover:border-indigo-500 rounded-2xl group transition-all"
                      onClick={() => {
                        setSelectedUpiApp("PhonePe");
                        triggerPayment("UPI (PhonePe App)");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-text text-sm">Pay via PhonePe App</p>
                          <p className="text-xs font-medium text-text-muted">
                            Instant redirect to app
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-between p-4 h-auto text-left border border-border/80 hover:border-indigo-500 rounded-2xl group transition-all"
                      onClick={() => setStep("qr_display")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
                          <QrCode size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-text text-sm">Show UPI QR Code</p>
                          <p className="text-xs font-medium text-text-muted">
                            Scan using any UPI App
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-between p-4 h-auto text-left border border-border/80 hover:border-blue-500 rounded-2xl group transition-all"
                      onClick={() => setStep("card_entry")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-text text-sm">Credit / Debit Card</p>
                          <p className="text-xs font-medium text-text-muted">
                            Visa, Mastercard, RuPay, Maestro
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-between p-4 h-auto text-left border border-border/80 hover:border-blue-500 rounded-2xl group transition-all"
                      onClick={() => setStep("upi_entry")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-text text-sm">UPI ID / VPA</p>
                          <p className="text-xs font-medium text-text-muted">
                            Pay using custom VPA
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP: QR Display (PhonePe) */}
          {step === "qr_display" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="p-4 bg-white border border-border/60 rounded-3xl shadow-sm">
                <QRCodeSVG
                  value={`upi://pay?pa=smartcitizen@ybl&pn=SmartCitizen%20Foundation&am=${amount}&cu=INR&tn=Donation%20for%20${encodeURIComponent(purpose)}`}
                  size={180}
                  level="H"
                />
              </div>
              <div className="text-center max-w-xs space-y-1">
                <p className="text-xs font-bold text-text">Scan with any UPI App</p>
                <p className="text-[11px] text-text-muted">
                  Open PhonePe, GPay, Paytm or BHIM app and scan the QR code to finish your contribution of ₹{formattedAmount}.
                </p>
              </div>
              <div className="flex gap-2.5 w-full pt-2">
                <Button
                  variant="secondary"
                  className="flex-1 text-xs rounded-xl py-2 h-auto"
                  onClick={() => setStep("method_select")}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 text-xs rounded-xl py-2 h-auto bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10"
                  onClick={() => triggerPayment("UPI (QR Code Scan)")}
                >
                  Simulate Success
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Card Entry (Razorpay) */}
          {step === "card_entry" && (
            <form onSubmit={cardFormik.handleSubmit} className="space-y-4">
              <Input
                label="Card Number"
                name="cardNumber"
                placeholder="4111 2222 3333 4444"
                maxLength={19}
                value={cardFormik.values.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  cardFormik.setFieldValue("cardNumber", formatted);
                }}
                onBlur={cardFormik.handleBlur}
                error={
                  cardFormik.touched.cardNumber && cardFormik.errors.cardNumber
                    ? cardFormik.errors.cardNumber
                    : undefined
                }
                className="py-3 px-4 text-sm"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry (MM/YY)"
                  name="expiry"
                  placeholder="12/28"
                  maxLength={5}
                  value={cardFormik.values.expiry}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    cardFormik.setFieldValue("expiry", formatted);
                  }}
                  onBlur={cardFormik.handleBlur}
                  error={
                    cardFormik.touched.expiry && cardFormik.errors.expiry
                      ? cardFormik.errors.expiry
                      : undefined
                  }
                  className="py-3 px-4 text-sm"
                />
                <Input
                  label="CVV"
                  name="cvv"
                  type="password"
                  placeholder="***"
                  maxLength={3}
                  value={cardFormik.values.cvv}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "").substring(0, 3);
                    cardFormik.setFieldValue("cvv", cleaned);
                  }}
                  onBlur={cardFormik.handleBlur}
                  error={
                    cardFormik.touched.cvv && cardFormik.errors.cvv
                      ? cardFormik.errors.cvv
                      : undefined
                  }
                  className="py-3 px-4 text-sm"
                />
              </div>

              <Input
                label="Cardholder Name"
                name="cardName"
                placeholder="John Doe"
                value={cardFormik.values.cardName}
                onChange={cardFormik.handleChange}
                onBlur={cardFormik.handleBlur}
                error={
                  cardFormik.touched.cardName && cardFormik.errors.cardName
                    ? cardFormik.errors.cardName
                    : undefined
                }
                className="py-3 px-4 text-sm"
              />

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 text-xs rounded-xl py-2.5 h-auto"
                  onClick={() => setStep("method_select")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 text-xs rounded-xl py-2.5 h-auto bg-blue-600 hover:bg-blue-700 shadow-blue-600/10"
                >
                  Pay ₹{formattedAmount}
                </Button>
              </div>
            </form>
          )}

          {/* STEP: UPI VPA Entry (Razorpay) */}
          {step === "upi_entry" && (
            <form onSubmit={upiFormik.handleSubmit} className="space-y-4">
              <Input
                label="Virtual Private Address (UPI ID)"
                name="upiId"
                placeholder="example@upi"
                value={upiFormik.values.upiId}
                onChange={upiFormik.handleChange}
                onBlur={upiFormik.handleBlur}
                error={
                  upiFormik.touched.upiId && upiFormik.errors.upiId
                    ? upiFormik.errors.upiId
                    : undefined
                }
                className="py-3 px-4 text-sm"
              />

              <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50 text-[11px] text-blue-800 leading-normal">
                <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
                <p>
                  You will receive a collection request in your UPI client app to authorize the payment.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 text-xs rounded-xl py-2.5 h-auto"
                  onClick={() => setStep("method_select")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 text-xs rounded-xl py-2.5 h-auto bg-blue-600 hover:bg-blue-700 shadow-blue-600/10"
                >
                  Request Pay
                </Button>
              </div>
            </form>
          )}

          {/* STEP: Processing gateway animation */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-6 animate-scale-in">
              <div className="relative flex items-center justify-center">
                <Spinner className={cn("size-14", isPhonePe ? "text-indigo-600" : "text-blue-600")} />
              </div>
              <div className="text-center space-y-1.5 w-full">
                <h4 className="font-display font-black text-text text-base">Processing Transaction</h4>
                <p className="text-xs text-text-muted font-medium animate-pulse-slow">
                  {loadingMessage}
                </p>
                <p className="text-[10px] text-text-light font-medium bg-bg px-3 py-1 rounded-full border border-border/40 inline-block mt-2">
                  Please do not reload page or click back
                </p>
              </div>
              
              <div className="flex gap-2.5 w-full pt-4 border-t border-border/40">
                <Button
                  variant="outline"
                  className="flex-1 text-xs font-bold py-2 h-auto rounded-xl border-primary/20 text-primary hover:bg-primary/5"
                  onClick={() => {
                    // Cancel transaction simulation
                    paymentTimeoutRef.current.forEach((t) => clearTimeout(t));
                    paymentTimeoutRef.current = [];
                    setStep("method_select");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className={cn(
                    "flex-1 text-xs font-bold py-2 h-auto text-white",
                    isPhonePe ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/10"
                  )}
                  onClick={() => {
                    // Skip delay simulation
                    paymentTimeoutRef.current.forEach((t) => clearTimeout(t));
                    paymentTimeoutRef.current = [];
                    completeSimulatedPayment(lastUsedPaymentMethod.current || "Simulator Bypass");
                  }}
                >
                  Skip Delay
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Success Screen */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center space-y-5 py-6 animate-scale-in">
              <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-success">
                <CheckCircle2 size={40} className="stroke-[2.5]" />
              </div>
              <div className="text-center space-y-1.5 max-w-xs">
                <h4 className="font-display font-black text-emerald-800 text-lg">Payment Successful</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Your contribution of <span className="font-bold text-text">₹{formattedAmount}</span> has been processed and logged securely.
                </p>
              </div>
              <div className="bg-bg border border-border/50 rounded-2xl p-3.5 w-full text-center space-y-0.5">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                  Transaction Reference
                </span>
                <span className="font-mono text-xs font-bold text-text block">
                  {transactionId}
                </span>
              </div>
              
              <Button
                variant="outline"
                className="w-full text-xs font-bold py-2.5 h-auto rounded-xl mt-2 border-primary/20 hover:bg-primary/5 text-primary"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
