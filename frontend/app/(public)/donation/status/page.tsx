"use client";
import { ASSETS } from "@/lib/assets";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, Download, Home, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/spinner";
import { getPaymentStatus, getReceiptStatus } from "@/features/citizen/api";
import { Payment } from "@/features/citizen/types";
import PageHero from "@/components/layout/PageHero";
import { toast } from "sonner";
import { downloadBlob } from "@/lib/utils";
import { useCitizenStore } from "@/store/citizenStore";

function PaymentStatusContent() {
  const router = useRouter();
  const { user } = useCitizenStore();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState(false);

  useEffect(() => {
    if (!transactionId) {
      setError("No transaction ID provided.");
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        setLoading(true);
        const data = await getPaymentStatus(transactionId);
        if (data) {
          const isOwner = data.userId ? (user?.id === data.userId) : false;
          const isAdmin = user?.user_type === "admin";
          const isSessionAuthorized = sessionStorage.getItem(`payment_auth_${transactionId}`) === "true";

          if (!isAdmin && !isSessionAuthorized && (!data.userId || !isOwner)) {
            setError("Access Denied: You are not authorized to view this payment status.");
          } else {
            setPayment(data);
          }
        } else {
          setError("Payment record not found.");
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        setError("Unable to fetch payment status.");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [transactionId, user]);

  useEffect(() => {
    if (!transactionId || !payment || payment.status !== "SUCCESS") return;

    let timeoutId: NodeJS.Timeout;
    let isMounted = true;
    let retries = 0;

    const pollReceipt = async () => {
      try {
        setReceiptLoading(true);
        const res = await getReceiptStatus(transactionId);
        if (!isMounted) return;

        if (res && res.url) {
          setReceiptUrl(res.url);
          setReceiptLoading(false);
        } else if (res && res.status === "processing") {
          // Retry after 3 seconds
          timeoutId = setTimeout(pollReceipt, 3000);
        } else {
          if (retries < 5) {
            retries++;
            timeoutId = setTimeout(pollReceipt, 3000);
          } else {
            setReceiptLoading(false);
            setReceiptError(true);
          }
        }
      } catch {
        if (!isMounted) return;
        if (retries < 5) {
          retries++;
          timeoutId = setTimeout(pollReceipt, 3000);
        } else {
          setReceiptLoading(false);
          setReceiptError(true);
        }
      }
    };

    pollReceipt();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [transactionId, payment]);

  const handleDownloadReceipt = () => {
    if (receiptUrl) {
      downloadBlob(receiptUrl, `80G_Receipt_${transactionId || "donation"}.pdf`);
    } else if (receiptLoading) {
      toast.info("Your tax receipt is still being compiled. Please wait a moment...");
    } else if (receiptError) {
      toast.error("Tax receipt is currently unavailable. Please try again from your dashboard.");
    } else {
      toast.error("Tax receipt link not compiled yet. Try again shortly.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Spinner className="size-12 text-primary" />
        <p className="text-text-muted text-sm font-semibold">Verifying your payment status, please wait...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center py-10 rounded-[32px] border border-border shadow-card mt-8">
        <CardContent className="space-y-6">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle size={40} className="stroke-[2.5]" />
          </div>
          <CardTitle className="text-3xl font-display font-black text-text">Verification Error</CardTitle>
          <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
            {error || "We could not retrieve details for this transaction. Please contact support if your account was debited."}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push(user ? "/citizen/donations" : "/donation")}
              variant="outline"
              size="sm"
              startIcon={<ArrowLeft size={14} />}
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              size="sm"
              startIcon={<Home size={14} />}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isSuccess = payment.status === "SUCCESS";
  const isPending = payment.status === "PENDING";
  const isFailed = payment.status === "FAILED" || payment.status === "CANCELLED";

  return (
    <Card className="w-full max-w-lg mx-auto text-center py-10 rounded-[32px] border border-border shadow-card mt-8 animate-scale-in">
      <CardContent className="space-y-6">
        {isSuccess && (
          <>
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
              <CheckCircle2 size={40} className="stroke-[2.5]" />
            </div>
            <CardTitle className="text-3xl font-display font-black text-text">Donation Successful!</CardTitle>
            <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-text">{payment.donorName || "Anonymous Citizen"}</span>, for your generous contribution of <span className="font-bold text-text">₹{(payment.amount / 100).toLocaleString("en-IN")}</span>. Your support empowers our local civic programs.
            </p>
          </>
        )}

        {isPending && (
          <>
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100">
              <Spinner className="size-10 text-amber-600" />
            </div>
            <CardTitle className="text-3xl font-display font-black text-text">Payment Pending</CardTitle>
            <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
              We are waiting for final verification from PhonePe. If money was deducted, the status will update to SUCCESS shortly.
            </p>
          </>
        )}

        {isFailed && (
          <>
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <XCircle size={40} className="stroke-[2.5]" />
            </div>
            <CardTitle className="text-3xl font-display font-black text-text">Payment Failed</CardTitle>
            <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
              Your transaction could not be processed successfully. No amount was debited, or it will be refunded automatically by your bank.
            </p>
          </>
        )}

        {/* Details Grid */}
        <div className="bg-bg p-6 rounded-3xl border border-border inline-block text-left w-full mt-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-border/50">
            <span className="text-text-muted font-bold uppercase tracking-wider">Transaction ID</span>
            <span className="font-mono font-bold text-text">{payment.providerReferenceId || payment.merchantOrderId}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-border/50">
            <span className="text-text-muted font-bold uppercase tracking-wider">Donor Name</span>
            <span className="font-bold text-text">{payment.donorName || "Anonymous Citizen"}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-border/50">
            <span className="text-text-muted font-bold uppercase tracking-wider">Amount</span>
            <span className="font-bold text-text">₹{(payment.amount / 100).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-muted font-bold uppercase tracking-wider">Status</span>
            <Badge variant={isSuccess ? "success" : isPending ? "warning" : "danger"}>
              {payment.status}
            </Badge>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {isSuccess && (
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              size="sm"
              isLoading={receiptLoading}
              startIcon={<Download size={14} />}
            >
              {receiptLoading ? "Generating Receipt..." : "Download Receipt"}
            </Button>
          )}
          
          {user ? (
            <Button
              onClick={() => router.push("/citizen/donations")}
              size="sm"
              startIcon={<LayoutDashboard size={14} />}
            >
              Go to My Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/")}
              variant="secondary"
              size="sm"
              startIcon={<Home size={14} />}
            >
              Back to Home
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentStatusPage() {
  return (
    <main className="min-h-screen pb-24 bg-white">
      <PageHero title="Transaction Status" image={ASSETS.a2} />
      <section className="py-12 md:py-16">
        <div className="max-content">
          <Suspense fallback={
            <div className="flex flex-col justify-center items-center py-24 space-y-4">
              <Spinner className="size-12 text-primary" />
              <p className="text-text-muted text-sm font-semibold">Loading transaction details...</p>
            </div>
          }>
            <PaymentStatusContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
