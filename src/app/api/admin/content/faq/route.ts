export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getFaqItems, createFaqItem, updateFaqItem } from "@/lib/adminData";

export async function GET() {
  const items = getFaqItems();
  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = createFaqItem({
      question: body.question || { en: "", tl: "" },
      answer: body.answer || { en: "", tl: "" },
      order: body.order ?? getFaqItems().length + 1,
      active: body.active !== false,
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items: Array<{ id: string; [key: string]: unknown }> = body.items;
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "items must be an array" }, { status: 400 });
    }
    const updated = [];
    for (const item of items) {
      const result = updateFaqItem(item.id, item);
      if (result) updated.push(result);
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
