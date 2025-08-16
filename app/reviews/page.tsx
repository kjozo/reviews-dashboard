"use client";

// reviews page with property dropdown, published reviews only, and sorting
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import type { NormalizedReview } from "@/types/reviews";
import { useReviews } from "@/context/ReviewsContext";

type SortField = "date" | "rating";
type SortDir = "asc" | "desc";

export default function ReviewsPage() {
  const { reviews, setReviews, loading } = useReviews();
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // get property list from published reviews
  const propertyList = useMemo(
    () =>
      Array.from(
        new Set(
          reviews.filter((r) => r.status === "published").map((r) => r.listingName)
        )
      ).filter((name): name is string => !!name),
    [reviews]
  );

  // filter published reviews by property
  const filtered = useMemo(() => {
    let result = reviews.filter((r) => r.status === "published");
    if (propertyFilter !== "all") {
      result = result.filter((r) => r.listingName === propertyFilter);
    }
    // sort by selected field and direction
    return result.sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.departureDate ?? a.arrivalDate ?? "").getTime();
        const dateB = new Date(b.departureDate ?? b.arrivalDate ?? "").getTime();
        return sortDir === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortField === "rating") {
        const ratingA = a.rating ?? 0;
        const ratingB = b.rating ?? 0;
        return sortDir === "asc" ? ratingA - ratingB : ratingB - ratingA;
      }
      return 0;
    });
  }, [reviews, propertyFilter, sortField, sortDir]);

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
      {/* property dropdown and sorting controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
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
        <label className="ml-4 font-medium text-gray-700">Sort by:</label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="border rounded px-2 py-1"
        >
          <option value="date">Date</option>
          <option value="rating">Rating</option>
        </select>
        <button
          className="ml-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          {sortDir === "asc" ? "↑ Ascending" : "↓ Descending"}
        </button>
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