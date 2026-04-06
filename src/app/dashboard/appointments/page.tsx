"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  slot: "morning" | "afternoon";
  status: string;
  address: string;
  city: string;
  country: string;
  vehicleType: string;
  notes: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAppointments(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Appointments</h1>
        <p className="text-primary-400 text-sm mt-1">
          View your scheduled installation appointments
        </p>
      </motion.div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl">
          <Calendar className="w-10 h-10 text-primary-500 mx-auto mb-3" />
          <p className="text-primary-400 text-sm">No appointments scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl p-5 hover:border-glass-border-light transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[appt.status] || "bg-white/10 text-white/50"}`}>
                      {appt.status}
                    </span>
                    <span className="text-xs text-primary-500">
                      {appt.country === "PH" ? "\u{1F1F5}\u{1F1ED}" : "\u{1F1E6}\u{1F1FA}"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-white">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      {new Date(appt.date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Clock className="w-4 h-4 text-primary-400" />
                      {appt.slot === "morning" ? "09:00 AM" : "02:00 PM"}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <MapPin className="w-4 h-4 text-primary-400" />
                      {appt.address}, {appt.city}
                    </div>
                  </div>
                  {appt.notes && (
                    <p className="text-xs text-primary-500 mt-2">{appt.notes}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
