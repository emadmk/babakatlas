"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavFooter = pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {!hideNavFooter && !isAuthPage && <Navbar />}
      <main>{children}</main>
      {!hideNavFooter && !isAuthPage && <Footer />}
    </>
  );
}
