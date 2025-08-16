import { NextResponse } from "next/server";
import { normalizeHostawayReview } from "@/lib/normalizeHostaway";
import mockReviews from "@/data/hostaway-mock.json";

// Google Places API Integration
import { normalizeGooglePlacesReview } from "@/lib/normalizeGooglePlaces";

// Hostaway API
const HOSTAWAY_API_URL = `https://api.hostaway.com/v1/reviews?accountId=${process.env.HOSTAWAY_ACCOUNT_ID}`;

// Google Places API
const GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID; // set this in your .env
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;   // set this in your .env

import type { NormalizedReview } from "@/types/reviews";

export async function GET() {
  let reviews: NormalizedReview[] = [];
  let source = "hostaway";

  // try hostaway api first
  try {
    const res = await fetch(HOSTAWAY_API_URL, {
      headers: {
        "Authorization": `Bearer ${process.env.HOSTAWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      reviews = Array.isArray(data.result) ? data.result : data.reviews || [];
    }
  } catch (error) {
    console.error("error fetching hostaway api:", error);
  }

  // if hostaway fails, try google places api
  if (!reviews || reviews.length === 0) {
    try {
      const url = `${GOOGLE_PLACES_API_URL}?place_id=${GOOGLE_PLACE_ID}&fields=reviews,name,place_id&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.result && Array.isArray(data.result.reviews)) {
          reviews = data.result.reviews;
          source = "google_places";
        }
      }
    } catch (error) {
      console.error("error fetching google places api:", error);
    }
  }

  // fallback to mock data if nothing else
  if (!reviews || reviews.length === 0) {
    reviews = mockReviews;
    source = "mock";
  }

  // normalize reviews for dashboard
  let normalized: any[] = [];
  if (source === "hostaway" || source === "mock") {
    normalized = reviews.map(normalizeHostawayReview);
  } else if (source === "google_places") {
    normalized = reviews.map(normalizeGooglePlacesReview);
  }

  return NextResponse.json({
    status: "success",
    source,
    result: normalized,
  });
}
