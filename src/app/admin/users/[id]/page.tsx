"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  ShoppingCart,
  DollarSign,
  Calendar,
  UserCheck,
  UserX,
  Save,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "banned";
  joinedAt: string;
  lastActive: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
          setEditName(res.data.name);
          setEditEmail(res.data.email);
          setEditCountry(res.data.country);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          country: editCountry,
        }),
      });
      const json = await res.json();
      if (json.success) setUser(json.data);
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async () => {
    if (!user) return;
    const newStatus = user.status === "active" ? "banned" : "active";
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (json.success) setUser(json.data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/30 text-sm">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/30 text-sm">User not found. Return to the users list.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/users")}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-white/50 text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={() => toggleUserStatus()}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            user.status === "active"
              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
              : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
          }`}
        >
          {user.status === "active" ? (
            <>
              <UserX size={16} />
              Ban User
            </>
          ) : (
            <>
              <UserCheck size={16} />
              Activate User
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Status",
            value: user.status,
            icon: User,
            color:
              user.status === "active" ? "text-green-400" : "text-red-400",
          },
          {
            label: "Orders",
            value: user.ordersCount,
            icon: ShoppingCart,
            color: "text-blue-400",
          },
          {
            label: "Total Spent",
            value: `\u20B1${user.totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "text-green-400",
          },
          {
            label: "Joined",
            value: new Date(user.joinedAt).toLocaleDateString(),
            icon: Calendar,
            color: "text-purple-400",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            >
              <Icon size={16} className={`${stat.color} mb-2`} />
              <p className="text-xs text-white/40">{stat.label}</p>
              <p className="text-white font-semibold text-sm capitalize mt-0.5">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Edit User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Edit User Info
        </h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
              <User size={14} />
              Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
              <Mail size={14} />
              Email
            </label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
              <MapPin size={14} />
              Country
            </label>
            <select
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            >
              <option value="PH" className="bg-[#1a1a1a]">
                Philippines
              </option>
              <option value="AU" className="bg-[#1a1a1a]">
                Australia
              </option>
            </select>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Order History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Order History
        </h2>
        {user.ordersCount > 0 ? (
          <p className="text-white/50 text-sm">
            This user has {user.ordersCount} order(s) totaling $
            {user.totalSpent.toFixed(2)}. View the{" "}
            <a
              href="/admin/orders"
              className="text-[#0071E3] hover:text-[#2997ff]"
            >
              orders page
            </a>{" "}
            for details.
          </p>
        ) : (
          <p className="text-white/30 text-sm">No orders yet.</p>
        )}
      </motion.div>
    </div>
  );
}
