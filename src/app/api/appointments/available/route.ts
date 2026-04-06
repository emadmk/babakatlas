export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAppointmentConfig, getAppointments } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "PH";
    const month = parseInt(searchParams.get("month") || "1", 10);
    const year = parseInt(searchParams.get("year") || "2026", 10);

    const config = getAppointmentConfig(country);
    if (!config) {
      return NextResponse.json({ success: false, error: "No config for country" }, { status: 404 });
    }

    // Get all appointments for this country in this month
    const allAppointments = getAppointments({ country });
    const monthStr = String(month).padStart(2, "0");

    // Build availability for each day of the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const now = new Date();
    const minAdvance = new Date(now.getTime() + config.minAdvanceHours * 60 * 60 * 1000);

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${monthStr}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(dateStr + "T23:59:59");

      const isHoliday = config.holidays.includes(dateStr);
      const isBlocked = config.blockedDates.includes(dateStr);
      const isPast = dateObj < now;
      const isTooSoon = dateObj < minAdvance;

      // Count existing bookings for this date
      const dayBookings = allAppointments.filter(
        (a) => a.date === dateStr && a.status !== "cancelled"
      );
      const morningBooked = dayBookings.filter((a) => a.slot === "morning").length;
      const afternoonBooked = dayBookings.filter((a) => a.slot === "afternoon").length;

      const morningEnabled = config.morningEnabled && !isHoliday && !isBlocked && !isPast && !isTooSoon;
      const afternoonEnabled = config.afternoonEnabled && !isHoliday && !isBlocked && !isPast && !isTooSoon;

      data.push({
        date: dateStr,
        morning: {
          available: morningEnabled ? Math.max(0, config.morningSlots - morningBooked) : 0,
          total: config.morningSlots,
          enabled: morningEnabled,
        },
        afternoon: {
          available: afternoonEnabled ? Math.max(0, config.afternoonSlots - afternoonBooked) : 0,
          total: config.afternoonSlots,
          enabled: afternoonEnabled,
        },
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
