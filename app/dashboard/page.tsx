"use client";

// dashboard page for reviews
import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCharts from "@/components/DashboardCharts";
import type { NormalizedReview } from "@/types/reviews";

export default function DashboardPage() {
  // state for reviews, filters, sorting, etc.
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [timeline, setTimeline] = useState<"all" | "6m" | "12m">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof NormalizedReview | "published">("departureDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("unknown");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await fetch("/api/reviews/hostaway");
        const data = await res.json();

        if (data.status === "success") {
          setReviews(data.result);
          setSource(data.source || (data.mock ? "mock" : "api"));
          setLastUpdated(new Date().toLocaleString());
        } else {
          setError(data.message || "Unknown error");
        }
      } catch (err) {
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // get filtered reviews based on property filter and timeline
  const filtered = useMemo(() => {
    let result = reviews;
    if (propertyFilter !== "all") {
      result = result.filter((r) => r.listingName === propertyFilter);
    }
    if (timeline !== "all") {
      const now = new Date();
      const monthsAgo = timeline === "6m" ? 6 : 12;
      const cutoff = new Date(now.getFullYear(), now.getMonth() - (monthsAgo - 1), 1);
      result = result.filter((r) => {
        const dateStr = r.departureDate ?? r.arrivalDate;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date >= cutoff;
      });
    }
    return result;
  }, [reviews, propertyFilter, timeline]);

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    let valA: any;
    let valB: any;

    if (sortBy === "published") {
      valA = a.status === "published" ? 1 : 0;
      valB = b.status === "published" ? 1 : 0;
    } else {
      valA = a[sortBy as keyof NormalizedReview];
      valB = b[sortBy as keyof NormalizedReview];
    }

    if (valA == null) return 1;
    if (valB == null) return -1;
    if (sortBy === "departureDate") {
      valA = new Date(valA as string).getTime();
      valB = new Date(valB as string).getTime();
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const arrow = (col: keyof NormalizedReview | "published") =>
    sortBy === col ? (sortDir === "asc" ? "▲" : "▼") : "";

  // build property list using listingName instead of ID
  const properties = Array.from(new Set(reviews.map((r) => r.listingName))).filter(
    (name): name is string => typeof name === "string" && !!name
  );
  const statuses = Array.from(new Set(reviews.map((r) => r.status)));

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handlePublishToggle = async (review: NormalizedReview) => {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center p-8 text-gray-500">Loading reviews...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* timeline filter dropdown */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium text-gray-700">Timeline:</label>
        <select
          value={timeline}
          onChange={(e) => {
            setTimeline(e.target.value as "all" | "6m" | "12m");
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      {/* kpi cards - now reactive to property filter and timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm text-center transition hover:scale-105 hover:shadow-md">
          <div className="text-2xl font-bold">{filtered.length}</div>
          <div className="text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm text-center transition hover:scale-105 hover:shadow-md">
          <div className="text-2xl font-bold">
            {(
              filtered.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
              (filtered.filter((r) => r.rating != null).length || 1)
            ).toFixed(1)}
          </div>
          <div className="text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm text-center transition hover:scale-105 hover:shadow-md">
          <div className="text-2xl font-bold">
            {(
              (filtered.filter((r) => r.status === "published").length /
                (filtered.length || 1)) *
              100
            ).toFixed(0)}
            %
          </div>
          <div className="text-gray-600">Published %</div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-white rounded-2xl border-2 border-gray-200 shadow-sm text-black mb-8">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => {
                  setSortBy("published");
                  setSortDir(sortBy === "published" && sortDir === "asc" ? "desc" : "asc");
                }}
              >
                Published? {arrow("published")}
              </th>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => {
                  setSortBy("listingName");
                  setSortDir(sortBy === "listingName" && sortDir === "asc" ? "desc" : "asc");
                }}
              >
                Property {arrow("listingName")}
              </th>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => {
                  setSortBy("guestName");
                  setSortDir(sortBy === "guestName" && sortDir === "asc" ? "desc" : "asc");
                }}
              >
                Guest {arrow("guestName")}
              </th>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => {
                  setSortBy("rating");
                  setSortDir(sortBy === "rating" && sortDir === "asc" ? "desc" : "asc");
                }}
              >
                Rating {arrow("rating")}
              </th>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => {
                  setSortBy("departureDate");
                  setSortDir(sortBy === "departureDate" && sortDir === "asc" ? "desc" : "asc");
                }}
              >
                Departure Date {arrow("departureDate")}
              </th>
              <th className="border p-2">Public Review</th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={r.status === "published"}
                      onChange={() => handlePublishToggle(r)}
                    />
                  </td>
                  <td className="border p-2">{r.listingName}</td>
                  <td className="border p-2">{r.guestName}</td>
                  <td className="border p-2">{r.rating ?? "N/A"}</td>
                  <td className="border p-2">
                    {r.departureDate
                      ? new Date(r.departureDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="border p-2 max-w-xs break-words whitespace-pre-line">
                    {r.publicReview ?? "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-500">
                  No reviews found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* pagination controls */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4">
          <div>
            Show{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>{" "}
            at a time
          </div>
          <div>
            <button
              className="px-2 py-1 border rounded mr-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            Page {page} of {totalPages}
            <button
              className="px-2 py-1 border rounded ml-2"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* chart */}
      <div className="mt-8 bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4 text-black">
        <DashboardCharts
          reviews={filtered}
          propertyFilter={propertyFilter}
          setPropertyFilter={setPropertyFilter}
          propertyList={properties}
          timeline={timeline}
          setTimeline={setTimeline}
        />
      </div>

      {/* footer info */}
      <div className="mt-4 text-sm text-gray-500">
        Data source:{" "}
        {source === "mock"
          ? "Mock Data"
          : source === "api"
          ? "Hostaway API"
          : "Unknown"}
        <br />
        Last updated: {lastUpdated}
      </div>
    </DashboardLayout>
  );
}
