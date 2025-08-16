"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import type { NormalizedReview } from "@/types/reviews";
import { ChartOptions } from "chart.js";

// chartjs registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale
);

// theme colors for charts
const THEME_GREEN = "rgba(85, 107, 47, 0.9)";     // #556B2F dark olive
const THEME_GREEN_LIGHT = "rgba(107, 142, 35, 0.6)"; // #6B8E23 lighter

type Props = {
  reviews: NormalizedReview[];
  propertyFilter: string;
  setPropertyFilter: (val: string) => void;
  propertyList: string[];
  timeline: "all" | "6m" | "12m";
  setTimeline: (val: "all" | "6m" | "12m") => void;
};

export default function DashboardCharts({
  reviews,
  propertyFilter,
  setPropertyFilter,
  propertyList,
  timeline,
  setTimeline,
}: Props) {
  // filter reviews by property name
  const filteredReviews =
    propertyFilter === "all"
      ? reviews
      : reviews.filter((r) => r.listingName === propertyFilter);

  // rating trend over time
  const reviewsByMonth: Record<string, number[]> = {};
  filteredReviews.forEach((r) => {
    const dateStr = r.departureDate ?? r.arrivalDate;
    if (r.rating != null && dateStr) {
      const month = new Date(dateStr).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!reviewsByMonth[month]) reviewsByMonth[month] = [];
      reviewsByMonth[month].push(r.rating);
    }
  });
  let months = Object.keys(reviewsByMonth);
  let avgRatings = months.map((m) => {
    const arr = reviewsByMonth[m];
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  });

  // timeline filter logic
  if (timeline !== "all" && months.length > 0) {
    const now = new Date();
    months = months.filter((m) => {
      const [monthStr, yearStr] = m.split(" ");
      const monthIdx = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
      const year = Number(yearStr);
      const date = new Date(year, monthIdx);
      if (timeline === "6m") {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return date >= sixMonthsAgo;
      }
      if (timeline === "12m") {
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        return date >= twelveMonthsAgo;
      }
      return true;
    });
    avgRatings = months.map((m) => {
      const arr = reviewsByMonth[m];
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    });
  }

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Average Rating (Over Time)",
        data: avgRatings,
        borderColor: THEME_GREEN,
        backgroundColor: THEME_GREEN_LIGHT,
        fill: true,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 24,
        },
      },
    },
    layout: {
      padding: {
        top: 24,
      },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        title: {
          display: true,
          text: "Rating (1–5)",
        },
        ticks: {
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        ticks: {
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  // average rating per property
  const propertyMap: Record<string, number[]> = {};
  filteredReviews.forEach((r) => {
    if (r.rating != null && r.listingName) {
      if (!propertyMap[r.listingName]) propertyMap[r.listingName] = [];
      propertyMap[r.listingName].push(r.rating);
    }
  });

  const propertyNames = Object.keys(propertyMap);

  // always show all property labels, even if some have no reviews
  const allPropertyLabels = propertyList.length > 0 ? propertyList : propertyNames;
  const allPropertyAverages = allPropertyLabels.map((name) => {
    const arr = propertyMap[name];
    return arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  });

  const barData = {
    labels: allPropertyLabels,
    datasets: [
      {
        label: "Average Rating (Per Property)",
        data: allPropertyAverages,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: allPropertyAverages.map((v) =>
          v === null ? "rgba(0,0,0,0.05)" : THEME_GREEN_LIGHT
        ),
        borderColor: allPropertyAverages.map((v) =>
          v === null ? "rgba(0,0,0,0.05)" : THEME_GREEN
        ),
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 24,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y === null
              ? "No reviews"
              : `Average: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 24,
      },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        title: {
          display: true,
          text: "Rating (1–5)",
        },
        ticks: {
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        ticks: {
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  // category breakdown
  const categories = ["cleanliness", "communication", "respect_house_rules"];
  const categoryLabels = ["Cleanliness", "Communication", "Respect House Rules"];

  const categoryAverages = categories.map((cat) => {
    let total = 0;
    let count = 0;
    filteredReviews.forEach((r) => {
      if (Array.isArray(r.reviewCategory)) {
        r.reviewCategory.forEach((c) => {
          if (c.category === cat && typeof c.rating === "number") {
            total += c.rating;
            count++;
          }
        });
      }
    });
    return count > 0 ? Math.round((total / count) * 10) / 10 : null;
  });

  const categoryBarData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Average Rating (Category)",
        data: categoryAverages,
        backgroundColor: categoryAverages.map((v) =>
          v === null ? "rgba(0,0,0,0.05)" : THEME_GREEN_LIGHT
        ),
        borderColor: categoryAverages.map((v) =>
          v === null ? "rgba(0,0,0,0.05)" : THEME_GREEN
        ),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const categoryBarOptions: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 24,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.x === null
              ? "No reviews"
              : `Average: ${context.parsed.x.toFixed(2)}`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 24,
      },
    },
    scales: {
      x: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: "Average Rating (0–10)",
        },
        ticks: {
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      y: {
        ticks: {
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  // always render filter controls
  const FilterControls = (
    <div className="mb-4 flex items-center gap-4">
      <label className="font-medium text-gray-700">Filter by property:</label>
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
      <label className="ml-6 font-medium text-gray-700">Timeline:</label>
      <select
        value={timeline}
        onChange={(e) => setTimeline(e.target.value as "all" | "6m" | "12m")}
        className="border rounded px-2 py-1"
      >
        <option value="all">All</option>
        <option value="6m">Last 6 Months</option>
        <option value="12m">Last 12 Months</option>
      </select>
    </div>
  );

  if (!reviews || reviews.length === 0) {
    return (
      <div>
        {FilterControls}
        <div className="text-gray-500">No chart data available</div>
      </div>
    );
  }

  return (
    <div>
      {FilterControls}
      {/* charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4 flex flex-col">
          <Line data={lineData} options={lineOptions} />
          <div className="mt-4 text-center text-gray-500 text-sm">
            Timeline: {timeline === "all" ? "All" : timeline === "6m" ? "Last 6 Months" : "Last 12 Months"}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4 flex flex-col">
          <Bar data={barData} options={barOptions} />
          <div className="mt-4 text-center text-gray-500 text-sm">
            {propertyFilter === "all" ? "ALL PROPERTIES" : propertyFilter}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4 flex flex-col">
          <Bar data={categoryBarData} options={categoryBarOptions} />
          <div className="mt-4 text-center text-gray-500 text-sm">
            {propertyFilter === "all" ? "ALL PROPERTIES" : propertyFilter}
          </div>
        </div>
      </div>
    </div>
  );
}
