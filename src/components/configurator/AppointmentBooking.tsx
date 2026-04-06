'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { MapPin, Calendar, Clock, ChevronLeft, ChevronRight, ChevronDown, Info } from 'lucide-react';

const PH_REGIONS = [
  'Metro Manila', 'Cebu', 'Davao', 'Calabarzon', 'Central Luzon',
  'Western Visayas', 'Central Visayas', 'Northern Mindanao',
  'Ilocos Region', 'Bicol Region', 'Eastern Visayas',
  'Zamboanga Peninsula', 'Cordillera Administrative Region',
  'SOCCSKSARGEN', 'Caraga', 'BARMM',
];

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
const STATE_LABELS: Record<string, string> = {
  NSW: 'New South Wales', VIC: 'Victoria', QLD: 'Queensland',
  WA: 'Western Australia', SA: 'South Australia', TAS: 'Tasmania',
  ACT: 'Australian Capital Territory', NT: 'Northern Territory',
};

interface DayAvailability {
  date: string;
  morning: { available: number; total: number; enabled: boolean };
  afternoon: { available: number; total: number; enabled: boolean };
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AppointmentBooking() {
  const { country, appointment, setAppointment, shippingAddress, setShippingAddress } = useConfiguratorStore();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(appointment?.date || null);
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | null>(appointment?.slot || null);

  const fetchAvailability = useCallback(async () => {
    if (!country) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/appointments/available?country=${country}&month=${currentMonth.month + 1}&year=${currentMonth.year}`
      );
      const data = await res.json();
      if (data.success) {
        setAvailability(data.data);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [country, currentMonth]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    if (selectedDate && selectedSlot) {
      setAppointment({
        date: selectedDate,
        slot: selectedSlot,
        address: shippingAddress.street1,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
      });
    }
  }, [selectedDate, selectedSlot, shippingAddress, setAppointment]);

  const regions = country === 'AU' ? AU_STATES : PH_REGIONS;

  // Calendar rendering
  const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month, 1).getDay();
  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();

  const goNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { month: 0, year: prev.year + 1 };
      return { ...prev, month: prev.month + 1 };
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const goPrevMonth = () => {
    const now = new Date();
    setCurrentMonth((prev) => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      if (newYear < now.getFullYear() || (newYear === now.getFullYear() && newMonth < now.getMonth())) {
        return prev;
      }
      return { month: newMonth, year: newYear };
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const getDateAvailability = (day: number): DayAvailability | null => {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availability.find((a) => a.date === dateStr) || null;
  };

  const isDatePast = (day: number) => {
    const date = new Date(currentMonth.year, currentMonth.month, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const isDateAvailable = (day: number) => {
    if (isDatePast(day)) return false;
    const avail = getDateAvailability(day);
    if (!avail) return false;
    const morningOpen = avail.morning.enabled && avail.morning.available > 0;
    const afternoonOpen = avail.afternoon.enabled && avail.afternoon.available > 0;
    return morningOpen || afternoonOpen;
  };

  const isDateBlocked = (day: number) => {
    const avail = getDateAvailability(day);
    if (!avail) return true;
    return !avail.morning.enabled && !avail.afternoon.enabled;
  };

  const isDateFull = (day: number) => {
    if (isDatePast(day)) return false;
    const avail = getDateAvailability(day);
    if (!avail) return false;
    const morningFull = !avail.morning.enabled || avail.morning.available <= 0;
    const afternoonFull = !avail.afternoon.enabled || avail.afternoon.available <= 0;
    return morningFull && afternoonFull && (avail.morning.enabled || avail.afternoon.enabled);
  };

  const selectedDayAvail = selectedDate ? availability.find((a) => a.date === selectedDate) : null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Book Your Appointment</h2>
        <p className="text-white/50 text-sm">
          Enter your address and choose a convenient date and time
        </p>
      </div>

      {/* Address Section */}
      <div className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white/70" />
          </div>
          <h3 className="text-lg font-semibold text-white">Service Address</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Full Name</label>
            <input
              type="text"
              value={shippingAddress.name}
              onChange={(e) => setShippingAddress({ name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">Street Address</label>
            <input
              type="text"
              value={shippingAddress.street1}
              onChange={(e) => setShippingAddress({ street1: e.target.value })}
              placeholder="123 Main Street"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ city: e.target.value })}
                placeholder={country === 'PH' ? 'Manila' : 'Sydney'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                {country === 'AU' ? 'State' : 'Region'}
              </label>
              <div className="relative">
                <select
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all appearance-none pr-10"
                >
                  <option value="" className="bg-neutral-900 text-white/50">Select...</option>
                  {regions.map((r) => (
                    <option key={r} value={r} className="bg-neutral-900">
                      {country === 'AU' ? (STATE_LABELS[r] ?? r) : r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                {country === 'AU' ? 'Postcode' : 'ZIP Code'}
              </label>
              <input
                type="text"
                value={shippingAddress.zip}
                onChange={(e) => setShippingAddress({ zip: e.target.value })}
                placeholder={country === 'PH' ? '1000' : '2000'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white/70" />
          </div>
          <h3 className="text-lg font-semibold text-white">Select Date</h3>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrevMonth}
            className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h4 className="text-white font-medium">
            {MONTHS[currentMonth.month]} {currentMonth.year}
          </h4>
          <button
            onClick={goNextMonth}
            className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs text-white/30 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const past = isDatePast(day);
            const available = isDateAvailable(day);
            const blocked = isDateBlocked(day);
            const full = isDateFull(day);
            const isSelected = selectedDate === dateStr;

            let cellClass = 'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative ';
            if (isSelected) {
              cellClass += 'bg-blue-500 text-white font-medium ring-2 ring-blue-400';
            } else if (past) {
              cellClass += 'text-white/15 cursor-not-allowed';
            } else if (blocked) {
              cellClass += 'text-red-400/40 cursor-not-allowed line-through';
            } else if (full) {
              cellClass += 'text-white/20 cursor-not-allowed';
            } else if (available) {
              cellClass += 'text-white/80 hover:bg-blue-500/20 hover:text-blue-300 cursor-pointer';
            } else {
              cellClass += 'text-white/15 cursor-not-allowed';
            }

            return (
              <button
                key={day}
                disabled={!available}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setSelectedSlot(null);
                }}
                className={cellClass}
              >
                <span>{day}</span>
                {full && !past && (
                  <span className="text-[8px] text-white/20 absolute bottom-0.5">Full</span>
                )}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-2 text-xs text-white/30">Loading availability...</div>
        )}
      </div>

      {/* Time Slot Selection */}
      <AnimatePresence>
        {selectedDate && selectedDayAvail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white/70" />
              </div>
              <h3 className="text-lg font-semibold text-white">Select Time Slot</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Morning */}
              {selectedDayAvail.morning.enabled && (
                <button
                  disabled={selectedDayAvail.morning.available <= 0}
                  onClick={() => setSelectedSlot('morning')}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedSlot === 'morning'
                      ? 'bg-blue-500/10 ring-2 ring-blue-500'
                      : selectedDayAvail.morning.available > 0
                        ? 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20'
                        : 'bg-white/[0.02] ring-1 ring-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <p className="text-white font-medium">Morning</p>
                  <p className="text-sm text-white/40">09:00 AM</p>
                  <p className="text-xs text-white/30 mt-1">
                    {selectedDayAvail.morning.available > 0
                      ? `${selectedDayAvail.morning.available} slot${selectedDayAvail.morning.available > 1 ? 's' : ''} available`
                      : 'Fully booked'}
                  </p>
                </button>
              )}

              {/* Afternoon */}
              {selectedDayAvail.afternoon.enabled && (
                <button
                  disabled={selectedDayAvail.afternoon.available <= 0}
                  onClick={() => setSelectedSlot('afternoon')}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedSlot === 'afternoon'
                      ? 'bg-blue-500/10 ring-2 ring-blue-500'
                      : selectedDayAvail.afternoon.available > 0
                        ? 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20'
                        : 'bg-white/[0.02] ring-1 ring-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <p className="text-white font-medium">Afternoon</p>
                  <p className="text-sm text-white/40">02:00 PM</p>
                  <p className="text-xs text-white/30 mt-1">
                    {selectedDayAvail.afternoon.available > 0
                      ? `${selectedDayAvail.afternoon.available} slot${selectedDayAvail.afternoon.available > 1 ? 's' : ''} available`
                      : 'Fully booked'}
                  </p>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation */}
      <AnimatePresence>
        {selectedDate && selectedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl p-6 bg-blue-500/5 ring-1 ring-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Appointment Confirmed</p>
                <p className="text-sm text-white/50 mt-1">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  - {selectedSlot === 'morning' ? '09:00 AM' : '02:00 PM'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-4 pt-4 border-t border-white/10">
              <Info className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-amber-400/70">
                Installation pricing will be provided after assessment
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
