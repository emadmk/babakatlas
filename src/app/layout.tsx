import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BabakAtlas | Premium Window Tint Films",
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
  ],
  openGraph: {
    title: "BabakAtlas | Premium Window Tint Films",
    description:
      "Professional-grade ceramic and carbon window tint films for ultimate UV protection, heat reduction, and style.",
    type: "website",
    siteName: "BabakAtlas",
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
        className={`${inter.variable} font-sans antialiased bg-black text-white`}
      >
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
