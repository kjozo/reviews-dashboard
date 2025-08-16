"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { NormalizedReview } from "@/types/reviews";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  reviews: NormalizedReview[];
};

export default function PropertyRatingsChart({ reviews }: Props) {
  const grouped: Record<string, number[]> = {};

  reviews.forEach((r) => {
    if (r.rating != null) {
      const key = r.listingName || `Property ${r.listingMapId}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r.rating);
    }
  });

  const labels = Object.keys(grouped);
  const averages = labels.map((key) => {
    const sum = grouped[key].reduce((a, b) => a + b, 0);
    return sum / grouped[key].length;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Average Rating",
        data: averages,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Average Rating per Property" },
    },
    scales: {
      y: { beginAtZero: true, max: 5 },
    },
  };

  return <Bar data={data} options={options} />;
}
