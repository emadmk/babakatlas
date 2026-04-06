"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Settings,
  Clock,
  MapPin,
  ChevronDown,
  Plus,
  X,
  Loader2,
} from "lucide-react";

interface AppointmentConfig {
  country: string;
  morningSlots: number;
  afternoonSlots: number;
  morningTime: string;
  afternoonTime: string;
  morningEnabled: boolean;
  afternoonEnabled: boolean;
  minAdvanceHours: number;
  holidays: string[];
  blockedDates: string[];
}

interface Appointment {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  country: string;
  address: string;
  city: string;
  vehicleType: string;
  date: string;
  slot: "morning" | "afternoon";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminAppointmentsPage() {
  const [tab, setTab] = useState<"settings" | "bookings">("bookings");
  const [configs, setConfigs] = useState<AppointmentConfig[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("PH");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newHoliday, setNewHoliday] = useState("");
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [apptNotes, setApptNotes] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [configRes, apptRes] = await Promise.all([
        fetch("/api/admin/appointments/config"),
        fetch("/api/admin/appointments"),
      ]);
      const configData = await configRes.json();
      const apptData = await apptRes.json();
      if (configData.success) setConfigs(configData.data);
      if (apptData.success) setAppointments(apptData.data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentConfig = configs.find((c) => c.country === selectedCountry);

  const updateConfig = async (updates: Partial<AppointmentConfig>) => {
    if (!currentConfig) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/appointments/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry, ...updates }),
      });
      const data = await res.json();
      if (data.success) {
        setConfigs((prev) =>
          prev.map((c) => (c.country === selectedCountry ? { ...c, ...updates } : c))
        );
      }
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const addHoliday = () => {
    if (!newHoliday || !currentConfig) return;
    const updated = [...currentConfig.holidays, newHoliday];
    updateConfig({ holidays: updated });
    setNewHoliday("");
  };

  const removeHoliday = (date: string) => {
    if (!currentConfig) return;
    updateConfig({ holidays: currentConfig.holidays.filter((h) => h !== date) });
  };

  const addBlockedDate = () => {
    if (!newBlockedDate || !currentConfig) return;
    const updated = [...currentConfig.blockedDates, newBlockedDate];
    updateConfig({ blockedDates: updated });
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date: string) => {
    if (!currentConfig) return;
    updateConfig({ blockedDates: currentConfig.blockedDates.filter((d) => d !== date) });
  };

  const updateApptStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: apptNotes || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: status as Appointment["status"], notes: apptNotes || a.notes } : a))
        );
        setSelectedAppt(null);
        setApptNotes("");
      }
    } catch {
      // handle
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filterCountry !== "all" && a.country !== filterCountry) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage booking schedule and appointments
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("bookings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "bookings"
              ? "bg-[#0071E3]/15 text-[#0071E3] border border-[#0071E3]/20"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calendar size={16} />
          Bookings
        </button>
        <button
          onClick={() => setTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "settings"
              ? "bg-[#0071E3]/15 text-[#0071E3] border border-[#0071E3]/20"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Settings size={16} />
          Schedule Settings
        </button>
      </div>

      {/* Settings Tab */}
      {tab === "settings" && !currentConfig && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/50">No configuration found for {selectedCountry}. Please delete <code className="text-[#0071E3]">data/store.json</code> on the server and restart to reload defaults.</p>
        </div>
      )}
      {tab === "settings" && currentConfig && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Country toggle */}
          <div className="flex gap-2">
            {["PH", "AU"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCountry === c
                    ? "bg-white/10 text-white ring-1 ring-white/20"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {c === "PH" ? "\u{1F1F5}\u{1F1ED} Philippines" : "\u{1F1E6}\u{1F1FA} Australia"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time slot settings */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Time Slots</h3>
              <div className="space-y-4">
                {/* Morning */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">Morning Slot</p>
                    <p className="text-white/40 text-xs">{currentConfig.morningTime}</p>
                  </div>
                  <button
                    onClick={() => updateConfig({ morningEnabled: !currentConfig.morningEnabled })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      currentConfig.morningEnabled ? "bg-[#0071E3]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        currentConfig.morningEnabled ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Morning slots count */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Morning Capacity</span>
                  <select
                    value={currentConfig.morningSlots}
                    onChange={(e) => updateConfig({ morningSlots: parseInt(e.target.value) })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n} className="bg-neutral-900">{n}</option>
                    ))}
                  </select>
                </div>

                {/* Afternoon */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">Afternoon Slot</p>
                    <p className="text-white/40 text-xs">{currentConfig.afternoonTime}</p>
                  </div>
                  <button
                    onClick={() => updateConfig({ afternoonEnabled: !currentConfig.afternoonEnabled })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      currentConfig.afternoonEnabled ? "bg-[#0071E3]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        currentConfig.afternoonEnabled ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Afternoon slots count */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Afternoon Capacity</span>
                  <select
                    value={currentConfig.afternoonSlots}
                    onChange={(e) => updateConfig({ afternoonSlots: parseInt(e.target.value) })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n} className="bg-neutral-900">{n}</option>
                    ))}
                  </select>
                </div>

                {/* Min advance hours */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-white/60 text-sm">Min Advance Booking</span>
                  <select
                    value={currentConfig.minAdvanceHours}
                    onChange={(e) => updateConfig({ minAdvanceHours: parseInt(e.target.value) })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {[6, 12, 18, 24, 48, 72].map((n) => (
                      <option key={n} value={n} className="bg-neutral-900">{n} hours</option>
                    ))}
                  </select>
                </div>
              </div>

              {saving && (
                <p className="text-xs text-[#0071E3] mt-3">Saving...</p>
              )}
            </div>

            {/* Holidays & Blocked Dates */}
            <div className="space-y-6">
              {/* Holidays */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Holidays</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="date"
                    value={newHoliday}
                    onChange={(e) => setNewHoliday(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={addHoliday}
                    className="px-3 py-2 rounded-lg bg-[#0071E3] text-white text-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {currentConfig.holidays.map((h) => (
                    <div key={h} className="flex items-center justify-between bg-white/[0.02] px-3 py-2 rounded-lg">
                      <span className="text-white/70 text-sm">{h}</span>
                      <button onClick={() => removeHoliday(h)} className="text-white/30 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {currentConfig.holidays.length === 0 && (
                    <p className="text-white/30 text-xs">No holidays set</p>
                  )}
                </div>
              </div>

              {/* Blocked Dates */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Blocked Dates</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={addBlockedDate}
                    className="px-3 py-2 rounded-lg bg-[#0071E3] text-white text-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {currentConfig.blockedDates.map((d) => (
                    <div key={d} className="flex items-center justify-between bg-white/[0.02] px-3 py-2 rounded-lg">
                      <span className="text-white/70 text-sm">{d}</span>
                      <button onClick={() => removeBlockedDate(d)} className="text-white/30 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {currentConfig.blockedDates.length === 0 && (
                    <p className="text-white/30 text-xs">No blocked dates</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <div className="relative">
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none pr-8"
              >
                <option value="all" className="bg-neutral-900">All Countries</option>
                <option value="PH" className="bg-neutral-900">Philippines</option>
                <option value="AU" className="bg-neutral-900">Australia</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none pr-8"
              >
                <option value="all" className="bg-neutral-900">All Status</option>
                <option value="pending" className="bg-neutral-900">Pending</option>
                <option value="confirmed" className="bg-neutral-900">Confirmed</option>
                <option value="completed" className="bg-neutral-900">Completed</option>
                <option value="cancelled" className="bg-neutral-900">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Appointments list */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors cursor-pointer"
                  onClick={() => { setSelectedAppt(appt); setApptNotes(appt.notes); }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-medium">{appt.customerName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[appt.status]}`}>
                          {appt.status}
                        </span>
                        <span className="text-xs text-white/30">
                          {appt.country === "PH" ? "\u{1F1F5}\u{1F1ED}" : "\u{1F1E6}\u{1F1FA}"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {appt.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.slot === "morning" ? "09:00 AM" : "02:00 PM"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {appt.city}
                        </div>
                      </div>
                      <p className="text-xs text-white/30 mt-1">{appt.customerEmail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Appointment detail modal */}
          {selectedAppt && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAppt(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Appointment Details</h3>
                  <button onClick={() => setSelectedAppt(null)} className="text-white/40 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Customer</span>
                    <span className="text-white">{selectedAppt.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Email</span>
                    <span className="text-white">{selectedAppt.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Phone</span>
                    <span className="text-white">{selectedAppt.customerPhone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Date</span>
                    <span className="text-white">{selectedAppt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Time</span>
                    <span className="text-white">{selectedAppt.slot === "morning" ? "09:00 AM" : "02:00 PM"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Address</span>
                    <span className="text-white text-right">{selectedAppt.address}, {selectedAppt.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Vehicle</span>
                    <span className="text-white">{selectedAppt.vehicleType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[selectedAppt.status]}`}>
                      {selectedAppt.status}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-sm text-white/50 mb-1.5">Notes</label>
                  <textarea
                    value={apptNotes}
                    onChange={(e) => setApptNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
                    placeholder="Add notes..."
                  />
                </div>

                {/* Status buttons */}
                <div className="flex gap-2 mt-6">
                  {selectedAppt.status === "pending" && (
                    <button
                      onClick={() => updateApptStatus(selectedAppt.id, "confirmed")}
                      className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {selectedAppt.status === "confirmed" && (
                    <button
                      onClick={() => updateApptStatus(selectedAppt.id, "completed")}
                      className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  {["pending", "confirmed"].includes(selectedAppt.status) && (
                    <button
                      onClick={() => updateApptStatus(selectedAppt.id, "cancelled")}
                      className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
