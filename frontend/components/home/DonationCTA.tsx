"use client";

import { useState } from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const amounts = [100, 200, 500, 1000, 2000];

export default function DonationCTA() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  return (
    <section className="py-24 bg-bg-alt overflow-hidden">
      <div className="max-content">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left - Message */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">MAKE A DIFFERENCE</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
                Your Support Creates Real Change
              </h2>
            </div>
            
            <div className="space-y-6 text-text-muted text-[17px] leading-relaxed">
              <p>
                Together, We Create Real Change. At GlobalSmart Citizens Foundation,
                we are committed to creating meaningful and lasting change by empowering
                individuals and communities. We work towards education, healthcare, social
                welfare, and environmental sustainability.
              </p>
              <p>
                Every donation is not just support — it is hope, empowerment, and a step
                towards a better tomorrow.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`px-6 py-3 rounded-full font-bold transition-all border-2 ${
                      selectedAmount === amount 
                      ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105" 
                      : "bg-white border-border text-text-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
                <button className="px-6 py-3 rounded-full font-bold border-2 border-border text-text-muted hover:border-accent hover:text-accent bg-white transition-all">
                  Other Amount
                </button>
              </div>

              <Link 
                href="/donation" 
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-10 py-4 rounded-lg font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-accent/20"
              >
                Contribute Now <MoveRight size={20} />
              </Link>

              <p className="text-[13px] text-text-light italic">
                All contributions are voluntary and used strictly for social awareness,
                community development, and operational support.
              </p>
            </div>
          </div>

          {/* Right - Bank/QR */}
          <div className="flex-1">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-card space-y-12">
              <div className="space-y-6 text-center">
                <h4 className="font-display text-2xl font-bold text-primary">Pay via UPI</h4>
                <p className="text-text-muted text-[15px]">Scan QR Code using PhonePe, Google Pay, or Paytm</p>
                <div className="max-w-[240px] mx-auto p-4 bg-bg border border-border rounded-xl">
                  {/* Placeholder for QR Code */}
                  <div className="aspect-square bg-white border border-border flex items-center justify-center overflow-hidden">
                    <img src="/assets/qr.png" alt="UPI QR Code" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex justify-center gap-4 text-primary font-bold text-[14px]">
                  <span>UPI</span>
                  <span>PhonePe</span>
                  <span>GPay</span>
                  <span>Paytm</span>
                </div>
              </div>

              <div className="pt-12 border-t border-border space-y-6">
                <h4 className="font-display text-2xl font-bold text-primary text-center">Bank Transfer</h4>
                <div className="space-y-4 bg-bg p-6 rounded-xl border border-border">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-light">Account Name</span>
                    <span className="font-bold text-text text-right">Global Smart Citizens Foundation</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-light">Bank</span>
                    <span className="font-bold text-text">HDFC Bank</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-light">Account No</span>
                    <span className="font-bold text-text tracking-wider">50200119596441</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-light">IFSC Code</span>
                    <span className="font-bold text-text tracking-wider">HDFC0000226</span>
                  </div>
                </div>
                <p className="text-center text-[13px] text-text-muted">
                  Please share your payment details on email or WhatsApp for receipt and records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
