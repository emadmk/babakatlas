"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";

export default function AdminUsersPage() {
  const { users, setUsers, userSearch, setUserSearch } =
    useAdminStore();

  const toggleUserStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "active" ? "banned" : "active";
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (json.success) {
      setUsers(users.map((u) => (u.id === id ? json.data : u)));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (userSearch) params.set("search", userSearch);

    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setUsers(res.data || []);
      })
      .catch(() => {});
  }, [userSearch, setUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-white/50 text-sm mt-1">
          Manage registered users and accounts
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-white/30"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left p-4 font-medium hidden md:table-cell">
                  Country
                </th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">
                  Orders
                </th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">
                  Spent
                </th>
                <th className="text-left p-4 font-medium hidden md:table-cell">
                  Joined
                </th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60 font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-white font-medium hover:text-[#0071E3] transition-colors"
                      >
                        {user.name}
                      </Link>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="p-4 text-white/60 hidden md:table-cell">
                    {user.country}
                  </td>
                  <td className="p-4 text-white/60 hidden lg:table-cell">
                    {user.ordersCount}
                  </td>
                  <td className="p-4 text-white/60 hidden lg:table-cell">
                    {`\u20B1${user.totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </td>
                  <td className="p-4 text-white/60 hidden md:table-cell">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                          user.status === "active"
                            ? "text-red-400 hover:text-red-300"
                            : "text-green-400 hover:text-green-300"
                        }`}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX size={14} />
                            Ban
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} />
                            Activate
                          </>
                        )}
                      </button>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-[#0071E3] hover:text-[#2997ff] text-xs font-medium transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-white/30 py-12 text-sm">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
