"use client";

// reviews context with localStorage persistence
import { createContext, useContext, useState, useEffect } from "react";
import type { NormalizedReview } from "@/types/reviews";

type ReviewsContextType = {
  reviews: NormalizedReview[];
  setReviews: React.Dispatch<React.SetStateAction<NormalizedReview[]>>;
  loading: boolean;
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "reviews-dashboard-reviews";

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // always load from localStorage first
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      setReviews(JSON.parse(local));
      setLoading(false);
    } else {
      // only fetch if localStorage is empty
      async function fetchReviews() {
        setLoading(true);
        try {
          const res = await fetch("/api/reviews/hostaway");
          const data = await res.json();
          if (data.status === "success" && Array.isArray(data.result)) {
            setReviews(data.result);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.result));
          } else {
            const mockRes = await fetch("/data/hostaway-mock.json");
            const mockData = await mockRes.json();
            setReviews(mockData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockData));
          }
        } catch {
          try {
            const mockRes = await fetch("/data/hostaway-mock.json");
            const mockData = await mockRes.json();
            setReviews(mockData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockData));
          } catch {
            setReviews([]);
          }
        } finally {
          setLoading(false);
        }
      }
      fetchReviews();
    }
  }, []);

  // persist reviews to localStorage on change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    }
  }, [reviews]);

  return (
    <ReviewsContext.Provider value={{ reviews, setReviews, loading }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}