"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/charges", label: "Charges", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-primary-900 flex pt-20">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 z-30">
          <div className="flex flex-col h-full bg-glass-medium backdrop-blur-2xl border-r border-glass-border">
            {/* Brand */}
            <div className="px-6 py-6 border-b border-glass-border">
              <Link href="/" className="inline-block">
                <img
                  src="/images/logo/logo-dark.png"
                  alt="Atlas Adaptive Tint"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* User info */}
            <div className="px-6 py-5 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center text-primary-900 font-bold text-sm">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-primary-500 text-xs truncate">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative ${
                      active
                        ? "text-gold bg-gold/10"
                        : "text-primary-400 hover:text-white hover:bg-glass-light"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-gold/10 rounded-xl border border-gold/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {active && (
                      <ChevronRight className="w-3 h-3 ml-auto relative z-10" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-6">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-glass-medium backdrop-blur-2xl border-b border-glass-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo/logo-dark.png"
                alt="Atlas Adaptive Tint"
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-primary-300 hover:text-white p-1"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="lg:hidden fixed inset-y-0 left-0 w-72 bg-primary-800/95 backdrop-blur-2xl border-r border-glass-border z-50 flex flex-col"
              >
                <div className="px-6 py-5 border-b border-glass-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center text-primary-900 font-bold text-sm">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-primary-500 text-xs truncate">
                      {session?.user?.email || ""}
                    </p>
                  </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          active
                            ? "text-gold bg-gold/10"
                            : "text-primary-400 hover:text-white hover:bg-glass-light"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="px-3 pb-6">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 lg:ml-72 pt-14 lg:pt-0">
          <div className="p-6 lg:p-8 max-w-6xl">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
