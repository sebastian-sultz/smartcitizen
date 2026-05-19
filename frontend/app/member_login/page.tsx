import Link from "next/link";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </div>
      <div className="text-center mb-10 space-y-4">
        <Link href="/" className="flex flex-col items-center group">
          <span className="font-display text-3xl font-black leading-none group-hover:text-primary transition-colors">
            GlobalSmart
          </span>
          <span className="font-body text-[12px] uppercase tracking-widest font-light opacity-80 text-text-muted">
            Citizens Foundation
          </span>
        </Link>
      </div>

      <LoginForm />

      <div className="mt-8 text-center">
        <Link href="/" className="text-[14px] text-text-light hover:text-primary transition-colors">
          ← Back to Homepage
        </Link>
      </div>
    </main>
  );
}
