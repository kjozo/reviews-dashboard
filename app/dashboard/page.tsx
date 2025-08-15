"use client";

import { useEffect, useState } from "react";
import type { NormalizedReview } from "@/types/reviews";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [filtered, setFiltered] = useState<NormalizedReview[]>([]);
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch reviews on load
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews/hostaway");
        const data = await res.json();
        if (data.status === "success") {
          setReviews(data.result);
          setFiltered(data.result);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    }
    fetchReviews();
  }, []);

  // Apply filters
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

  // Unique property IDs
  const properties = Array.from(new Set(reviews.map(r => r.listingMapId)));
  const statuses = Array.from(new Set(reviews.map(r => r.status)));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border rounded px-2 py-1"
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
          className="border rounded px-2 py-1"
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
      <div className="overflow-x-auto">
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
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.listingName}</td>
                <td className="border p-2">{r.guestName}</td>
                <td className="border p-2">{r.status}</td>
                <td className="border p-2">{r.rating ?? "N/A"}</td>
                <td className="border p-2">{r.publicReview ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
