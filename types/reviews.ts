export type NormalizedReview = {
  id: number;
  listingMapId?: number;
  listingName?: string | null;
  guestName?: string | null;
  channel?: string | null;
  status: string;
  rating?: number | null;
  publicReview?: string | null;
  privateFeedback?: string | null;
  arrivalDate?: string | null;
  departureDate?: string | null;
  source?: string;
  reviewCategory?: {
    category: string;
    rating: number;
  }[];
};
