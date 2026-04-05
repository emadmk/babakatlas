"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ChevronDown,
  ChevronRight,
  AppWindow,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

interface CarType {
  id: string;
  name: { en: string; tl: string };
  type: string;
  windowCount: number;
}

interface WindowConfig {
  id: string;
  carTypeId: string;
  position: { en: string; tl: string };
  defaultSqft: number;
  active: boolean;
}

interface GroupedWindows {
  [carTypeId: string]: WindowConfig[];
}

const positionDescriptions: Record<string, string> = {
  windshield: "Front windshield - full width glass panel",
  "rear-windshield": "Rear windshield - full width back glass",
  "front-left": "Front left door window - driver side",
  "front-right": "Front right door window - passenger side",
  "rear-left": "Rear left door window - behind driver",
  "rear-right": "Rear right door window - behind passenger",
  "quarter-left": "Left quarter panel window - small fixed",
  "quarter-right": "Right quarter panel window - small fixed",
  sunroof: "Top sunroof/moonroof panel",
};

export default function AdminWindowsPage() {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [windows, setWindows] = useState<GroupedWindows>({});
  const [expandedCar, setExpandedCar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingCar, setSavingCar] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [carsRes, windowsRes] = await Promise.all([
        fetch("/api/admin/cars"),
        fetch("/api/admin/windows"),
      ]);
      const carsData = await carsRes.json();
      const windowsData = await windowsRes.json();

      if (carsData.success) {
        const cars = carsData.data || [];
        setCarTypes(cars);
        if (cars.length > 0) {
          setExpandedCar(cars[0].id);
        }
      }

      if (windowsData.success) {
        const grouped: GroupedWindows = {};
        for (const w of (windowsData.data || [])) {
          if (!grouped[w.carTypeId]) grouped[w.carTypeId] = [];
          grouped[w.carTypeId].push(w);
        }
        setWindows(grouped);
      }
    } catch {
      showToast("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateWindowField = (
    carTypeId: string,
    windowId: string,
    field: "defaultSqft" | "active",
    value: number | boolean
  ) => {
    setWindows((prev) => ({
      ...prev,
      [carTypeId]: (prev[carTypeId] || []).map((w) =>
        w.id === windowId ? { ...w, [field]: value } : w
      ),
    }));
  };

  const saveCarWindows = async (carTypeId: string) => {
    setSavingCar(carTypeId);
    try {
      const res = await fetch(`/api/admin/windows`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carTypeId,
          windows: windows[carTypeId] || [],
        }),
      });
      if (res.ok) {
        showToast("success", "Windows configuration saved");
      } else {
        showToast("error", "Failed to save windows");
      }
    } catch {
      showToast("error", "Failed to save windows");
    } finally {
      setSavingCar(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Windows Configuration
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Configure window positions and sizes per car type
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse"
            >
              <div className="h-6 bg-white/10 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-bold text-white">
          Windows Configuration
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Configure window positions and default square footage per car type
        </p>
      </div>

      {/* Car Type Accordions */}
      <div className="space-y-3">
        {carTypes.map((car) => {
          const isExpanded = expandedCar === car.id;
          const carWindows = windows[car.id] || [];

          return (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() =>
                  setExpandedCar(isExpanded ? null : car.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AppWindow size={18} className="text-[#0071E3]" />
                  <div className="text-left">
                    <h3 className="text-white font-medium text-sm">
                      {car.name.en}
                    </h3>
                    <p className="text-white/40 text-xs">
                      {car.type} - {carWindows.length} windows configured
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-white/40" />
                ) : (
                  <ChevronRight size={16} className="text-white/40" />
                )}
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      {/* Info */}
                      <div className="flex items-start gap-2 p-3 bg-[#0071E3]/5 border border-[#0071E3]/10 rounded-lg">
                        <Info
                          size={14}
                          className="text-[#0071E3] mt-0.5 shrink-0"
                        />
                        <p className="text-xs text-white/50">
                          Configure the default square footage for each window
                          position. These values are used for price calculation.
                          Toggle individual windows on/off to include or exclude
                          them from the car type.
                        </p>
                      </div>

                      {/* Windows Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-white/40 border-b border-white/10">
                              <th className="text-left pb-3 font-medium">
                                Position (EN)
                              </th>
                              <th className="text-left pb-3 font-medium hidden md:table-cell">
                                Position (TL)
                              </th>
                              <th className="text-left pb-3 font-medium">
                                Default Sqft
                              </th>
                              <th className="text-left pb-3 font-medium hidden lg:table-cell">
                                Description
                              </th>
                              <th className="text-left pb-3 font-medium">
                                Active
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {carWindows.map((w) => (
                              <tr
                                key={w.id}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="py-3 text-white/80">
                                  {w.position.en}
                                </td>
                                <td className="py-3 text-white/50 hidden md:table-cell">
                                  {w.position.tl}
                                </td>
                                <td className="py-3">
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={w.defaultSqft}
                                    onChange={(e) =>
                                      updateWindowField(
                                        car.id,
                                        w.id,
                                        "defaultSqft",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                                  />
                                </td>
                                <td className="py-3 text-white/30 text-xs hidden lg:table-cell">
                                  {positionDescriptions[
                                    w.position.en
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")
                                  ] || "Window position"}
                                </td>
                                <td className="py-3">
                                  <button
                                    onClick={() =>
                                      updateWindowField(
                                        car.id,
                                        w.id,
                                        "active",
                                        !w.active
                                      )
                                    }
                                    className="flex items-center gap-1.5"
                                  >
                                    {w.active ? (
                                      <ToggleRight
                                        size={20}
                                        className="text-green-400"
                                      />
                                    ) : (
                                      <ToggleLeft
                                        size={20}
                                        className="text-white/30"
                                      />
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {carWindows.length === 0 && (
                          <p className="text-center text-white/30 py-6 text-sm">
                            No windows configured for this car type.
                          </p>
                        )}
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => saveCarWindows(car.id)}
                          disabled={savingCar === car.id}
                          className="flex items-center gap-2 px-4 py-2 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
                        >
                          {savingCar === car.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Save size={14} />
                          )}
                          {savingCar === car.id
                            ? "Saving..."
                            : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {carTypes.length === 0 && (
        <div className="text-center py-16">
          <AppWindow size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-sm">
            No car types found. Add car types first to configure windows.
          </p>
        </div>
      )}
    </div>
  );
}
