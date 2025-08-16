import type { NormalizedReview } from "@/types/reviews";

// normalize google places review for dashboard
export function normalizeGooglePlacesReview(review: Record<string, unknown>): NormalizedReview {
  // safely extract fields with type guards
  const time = typeof review.time === "number" ? review.time : null;
  const authorName = typeof review.author_name === "string" ? review.author_name : "Google User";
  const rating = typeof review.rating === "number" ? review.rating : null;
  const text = typeof review.text === "string" ? review.text : "";
  const placeId = typeof review.place_id === "string" ? review.place_id : "";

  return {
    id: time ?? 0,
    guestName: authorName,
    rating: rating,
    publicReview: text,
    departureDate: time ? new Date(time * 1000).toISOString() : "",
    listingName: placeId,
    status: "published",
    reviewCategory: [],
    // add other fields as needed
  };
}