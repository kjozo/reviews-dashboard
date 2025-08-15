import { NormalizedReview } from "@/types/reviews";

export function normalizeHostawayReview(r: any): NormalizedReview {
  // Average reviewCategory ratings (0–10) → scale to 1–5
  let rating: number | null = null;
  if (Array.isArray(r.reviewCategory) && r.reviewCategory.length > 0) {
    const avg10 =
      r.reviewCategory.reduce(
        (sum: number, cat: { category: string; rating: number }) =>
          sum + Number(cat.rating || 0),
        0
      ) / r.reviewCategory.length;

    rating = Math.round((avg10 / 2) * 10) / 10;
  }

  return {
    id: Number(r.id),
    listingMapId: Number(r.listingMapId ?? -1),
    listingName: r.listingName ?? null,
    guestName: r.guestName ?? null,
    channel: r.type ?? null, // e.g. "host-to-guest"
    status: (r.status ?? "other") as NormalizedReview["status"],
    rating,
    publicReview: r.publicReview ?? null,
    privateFeedback: null,
    arrivalDate: null,
    departureDate: r.submittedAt
      ? new Date(r.submittedAt).toISOString()
      : null,
    source: "hostaway",
  };
}
