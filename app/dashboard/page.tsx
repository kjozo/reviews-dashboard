"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PropertyRatingsChart from "@/components/PropertyRatingsChart";
import { useEffect, useState } from "react";
import type { NormalizedReview } from "@/types/reviews";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [filtered, setFiltered] = useState<NormalizedReview[]>([]);
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();
      if (data.status === "success") {
        setReviews(data.result);
        setFiltered(data.result);
      }
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    let temp = [...reviews];
    if (propertyFilter !== "all") {
      temp = temp.filter(r => String(r.listingMapId) === propertyFilter);
    }
    if (statusFilter !== "all") {
      temp = temp.filter(r => r.status === statusFilter);
    }
    setFiltered(temp);
  }, [propertyFilter, statusFilter, reviews]);

  const properties = Array.from(new Set(reviews.map(r => r.listingMapId)));
  const statuses = Array.from(new Set(reviews.map(r => r.status)));

  return (
    <DashboardLayout>
      {/* Filters */}
      <div className="flex gap-4 mb-6 text-black">
        <select
          className="border rounded px-2 py-1 text-black"
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
        >
          <option value="all">All Properties</option>
          {properties.map((id) => (
            <option key={id} value={String(id)}>
              {id}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1 text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow text-black">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Property</th>
              <th className="border p-2">Guest</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Public Review</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.listingName}</td>
                  <td className="border p-2">{r.guestName}</td>
                  <td className="border p-2">{r.status}</td>
                  <td className="border p-2">{r.rating ?? "N/A"}</td>
                  <td className="border p-2">{r.publicReview ?? "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border p-4 text-center text-gray-500">
                  No reviews found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white rounded shadow p-4 text-black">
        Chart placeholder
      </div>
    </DashboardLayout>
  );
}
