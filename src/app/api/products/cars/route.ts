import { NextResponse } from "next/server";
import { getCarTypes, getWindowConfigs } from "@/lib/adminData";

export async function GET() {
  const carTypes = getCarTypes().filter((c) => c.active);

  const cars = carTypes.map((car) => {
    const windows = getWindowConfigs(car.type)
      .filter((w) => w.active)
      .map((w) => ({
        id: w.position.toLowerCase(),
        label: w.label.en,
        sqft: w.defaultSqft,
      }));

    return {
      id: car.slug,
      name: car.name.en,
      slug: car.slug,
      imageUrl: car.imageUrl,
      windows,
      totalSqft: windows.reduce((sum, w) => sum + w.sqft, 0),
    };
  });

  return NextResponse.json({
    success: true,
    data: cars,
    count: cars.length,
  });
}
