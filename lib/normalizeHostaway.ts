import type { NormalizedReview } from "@/types/reviews";

// normalize hostaway review for dashboard
export function normalizeHostawayReview(review: Record<string, unknown>): NormalizedReview {
  // average reviewCategory ratings (0–10) → scale to 1–5
  let rating: number | null = null;
  const reviewCategory = Array.isArray(review.reviewCategory)
    ? review.reviewCategory as { category: string; rating: number }[]
    : [];

  if (reviewCategory.length > 0) {
    const avg10 =
      reviewCategory.reduce(
        (sum, cat) => sum + Number(cat.rating || 0),
        0
      ) / reviewCategory.length;

    rating = Math.round((avg10 / 2) * 10) / 10;
  }

  return {
    id: typeof review.id === "number" || typeof review.id === "string" ? Number(review.id) : 0,
    listingMapId: typeof review.listingMapId === "number" || typeof review.listingMapId === "string"
      ? Number(review.listingMapId)
      : -1,
    listingName: typeof review.listingName === "string" ? review.listingName : "",
    guestName: typeof review.guestName === "string" ? review.guestName : "",
    channel: typeof review.type === "string" ? review.type : "",
    status: typeof review.status === "string"
      ? (review.status as NormalizedReview["status"])
      : "other",
    rating,
    publicReview: typeof review.publicReview === "string" ? review.publicReview : "",
    privateFeedback: null,
    arrivalDate: null,
    departureDate:
      typeof review.submittedAt === "string" || typeof review.submittedAt === "number"
        ? new Date(review.submittedAt).toISOString()
        : null,
    source: "hostaway",
    reviewCategory,
  };
}
