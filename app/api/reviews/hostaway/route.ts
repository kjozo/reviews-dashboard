import { NextResponse } from "next/server";
import { normalizeHostawayReview } from "@/lib/normalizeHostaway";
import mockReviews from "@/data/hostaway-mock.json"; // Updated path

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1/reviews?accountId=61148";

export async function GET() {
  let reviews: any[] = [];

  try {
    const res = await fetch(HOSTAWAY_API_URL, {
      headers: {
        "Authorization": "Bearer f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Hostaway API response:", data);
      reviews = Array.isArray(data.result) ? data.result : data.reviews || [];
    }
  } catch (error) {
    console.error("Error fetching Hostaway API:", error);
  }

  // Fallback to mock data if no reviews from API
  if (!reviews || reviews.length === 0) {
    console.warn("Falling back to mock reviews data.");
    reviews = mockReviews;
  }

  const normalized = reviews.map(normalizeHostawayReview);

  return NextResponse.json({ status: "success", result: normalized });
}
