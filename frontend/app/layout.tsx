import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Figtree } from "next/font/google";
import "./globals.css";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://globalsmartcitizensfoundation.org"),
  title:
    "GlobalSmart Citizens Foundation | Building a Smarter, Safer, and Aware India",
  description:
    "GlobalSmart Citizens Foundation is a registered non-profit working at the grassroots to build a smarter, safer, and more aware India. We empower citizens and communities through civic rights education, digital safety, environmental sustainability, health wellness, and active social participation.",
  keywords:
    "Non-profit, NGO, Social Change, India, Awareness, Education, Environment, Health, Legal Rights, Digital Safety",
  authors: [{ name: "GlobalSmart Citizens Foundation" }],
  creator: "GlobalSmart Citizens Foundation",
  publisher: "GlobalSmart Citizens Foundation",
  referrer: "origin-when-cross-origin",
  category: "Nonprofit",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "GlobalSmart Citizens Foundation",
    description: "Building a Smarter, Safer, More Aware Society.",
    url: "/",
    siteName: "GlobalSmart Citizens Foundation",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GlobalSmart Citizens Foundation Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GlobalSmart Citizens Foundation | Building a Smarter, Safer, and Aware India",
    description: "Building a Smarter, Safer, More Aware Society.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D9488",
};

import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertProvider } from "@/components/ui/AlertProvider";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { parseJwt } from "@/lib/auth-token";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import { ReferralTracker } from "@/components/providers/ReferralTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const payload = token ? parseJwt(token) : null;

  const initialSession = payload
    ? { userId: payload.user_id, userType: payload.user_type }
    : null;

  return (
    <html lang="en" className={`${sourceSans3.variable} ${figtree.variable}`}>
      <body className="min-h-screen bg-bg text-text font-body selection:bg-primary selection:text-white flex flex-col">
        {/* JSON-LD Structured Data Schema for NGO and WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "NGO",
                  "@id": "https://globalsmartcitizensfoundation.org/#organization",
                  "name": "GlobalSmart Citizens Foundation",
                  "url": "https://globalsmartcitizensfoundation.org",
                  "logo": "https://res.cloudinary.com/duwqehc0k/image/upload/f_auto,q_auto:best/v1769195538/smartcitizen/assets/logo.png",
                  "sameAs": [
                    SOCIAL_LINKS.facebook,
                    SOCIAL_LINKS.instagram
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": CONTACT_INFO.phone,
                    "contactType": "customer service",
                    "email": CONTACT_INFO.email
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://globalsmartcitizensfoundation.org/#website",
                  "url": "https://globalsmartcitizensfoundation.org",
                  "name": "GlobalSmart Citizens Foundation",
                  "publisher": {
                    "@id": "https://globalsmartcitizensfoundation.org/#organization"
                  }
                }
              ]
            })
          }}
        />
        <AuthInitializer session={initialSession} />
        <ReferralTracker />
        <TooltipProvider>
          <AlertProvider>
            {children}
            <Toaster />
          </AlertProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
