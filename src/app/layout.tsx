import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Providers from "@/components/Providers";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Atlas Adaptive Tint - Premium Window Tint Films",
  description:
    "Professional-grade ceramic and carbon window tint films. UV protection, heat reduction, and style for your vehicle. Shipping to Philippines & Australia.",
  keywords: [
    "window tint",
    "car tint",
    "ceramic tint",
    "carbon tint",
    "UV protection",
    "heat reduction",
    "Philippines",
    "Australia",
    "adaptive tint",
  ],
  icons: {
    icon: "/images/logo/logo-dark.png",
    apple: "/images/logo/logo-dark.png",
  },
  openGraph: {
    title: "Atlas Adaptive Tint - Premium Window Tint Films",
    description:
      "Professional-grade ceramic and carbon window tint films for ultimate UV protection, heat reduction, and style.",
    type: "website",
    siteName: "Atlas Adaptive Tint",
    images: ["/images/logo/logo-main.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-black text-white`}
      >
        <Providers>
          <LanguageProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
