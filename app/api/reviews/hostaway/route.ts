import { NextResponse } from "next/server";
import { normalizeHostawayReview } from "@/lib/normalizeHostaway";
import mockData from "@/data/hostaway-mock.json";

export async function GET() {
  const normalized = (mockData as any[]).map(normalizeHostawayReview);
  return NextResponse.json({ status: "success", result: normalized });
}
