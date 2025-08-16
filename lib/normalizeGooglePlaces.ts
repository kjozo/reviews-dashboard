// normalize google places review for dashboard
export function normalizeGooglePlacesReview(review: any) {
  return {
    id: review.time?.toString() ?? "",
    guestName: review.author_name ?? "Google User",
    rating: review.rating ?? null,
    publicReview: review.text ?? "",
    departureDate: new Date(review.time * 1000).toISOString(),
    listingName: review.place_id ?? "",
    status: "published",
    reviewCategory: [],
    // add other fields as needed
  };
}