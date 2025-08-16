"use client";

// reviews page with property dropdown and published reviews only
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import type { NormalizedReview } from "@/types/reviews";
import { useReviews } from "@/context/ReviewsContext";

export default function ReviewsPage() {
  const { reviews, setReviews, loading } = useReviews();
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

  // get property list from published reviews
  const propertyList = useMemo(
    () =>
      Array.from(new Set(reviews.filter((r) => r.status === "published").map((r) => r.listingName))).filter(
        (name): name is string => !!name
      ),
    [reviews]
  );

  // filter published reviews by property
  const filtered = useMemo(() => {
    let result = reviews.filter((r) => r.status === "published");
    if (propertyFilter !== "all") {
      result = result.filter((r) => r.listingName === propertyFilter);
    }
    // sort by date, newest first
    return result.sort((a, b) => {
      const dateA = new Date(a.departureDate ?? a.arrivalDate ?? "").getTime();
      const dateB = new Date(b.departureDate ?? b.arrivalDate ?? "").getTime();
      return dateB - dateA;
    });
  }, [reviews, propertyFilter]);

  // publish/unpublish handler
  const handlePublishToggle = (review: NormalizedReview) => {
    const action = review.status === "published" ? "Unpublish" : "Publish";
    if (
      window.confirm(
        `Are you sure you want to ${action.toLowerCase()} this review?`
      )
    ) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? {
                ...r,
                status: review.status === "published" ? "unpublished" : "published",
              }
            : r
        )
      );
    }
  };

  return (
    <DashboardLayout>
      {/* property dropdown */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium text-gray-700">Property:</label>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          {propertyList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* reviews */}
      <div className="max-w-4xl mx-auto px-4">
        {loading ? (
          <div className="text-gray-500 text-center py-12">Loading reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            No published reviews for this property.
          </div>
        ) : (
          <div className="grid gap-8">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-xl">{r.listingName}</div>
                  <div className="text-gray-500 text-base">
                    {r.departureDate
                      ? new Date(r.departureDate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Guest:</span>{" "}
                  {r.guestName}
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Rating:</span>{" "}
                  {r.rating ?? "N/A"}
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Review:</span>
                  <div className="mt-2 text-gray-900 break-words whitespace-pre-line">
                    {r.publicReview ?? "—"}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`px-4 py-2 rounded ${
                      r.status === "published"
                        ? "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                        : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                    }`}
                    onClick={() => handlePublishToggle(r)}
                  >
                    {r.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}