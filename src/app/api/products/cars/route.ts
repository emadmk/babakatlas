import { NextResponse } from 'next/server';
import { WINDOW_SQFT } from '@/store/configuratorStore';

interface CarTypeData {
  id: string;
  name: string;
  slug: string;
  windows: {
    id: string;
    label: string;
    sqft: number;
  }[];
  totalSqft: number;
}

const CAR_LABELS: Record<string, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  van: 'Van',
  station_wagon: 'Station Wagon',
  hatchback: 'Hatchback',
  coupe: 'Coupe',
  truck: 'Truck',
  convertible: 'Convertible',
};

function formatWindowLabel(windowId: string): string {
  return windowId
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function GET() {
  const cars: CarTypeData[] = Object.entries(WINDOW_SQFT).map(
    ([slug, windows]) => {
      const windowList = Object.entries(windows).map(([id, sqft]) => ({
        id,
        label: formatWindowLabel(id),
        sqft,
      }));

      return {
        id: slug,
        name: CAR_LABELS[slug] ?? slug,
        slug,
        windows: windowList,
        totalSqft: windowList.reduce((sum, w) => sum + w.sqft, 0),
      };
    },
  );

  return NextResponse.json({
    success: true,
    data: cars,
    count: cars.length,
  });
}
