"use client";

import { ReactNode } from "react";
import { MdDashboard, MdBarChart, MdRateReview } from "react-icons/md"; // Import icons

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#556B2F] text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-[#6B8E23]">
          THE FLEX
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#6B8E23]"
          >
            <MdDashboard className="w-5 h-5" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#6B8E23]"
          >
            <MdBarChart className="w-5 h-5" />
            Statistics
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#6B8E23]"
          >
            <MdRateReview className="w-5 h-5" />
            Reviews
          </a>
        </nav>
        <div className="px-4 py-3 border-t border-[#6B8E23] text-sm">
          © 2025 Your Company
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col text-black">
        {/* Top navbar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="font-semibold">Welcome Back, Manager 👋</div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-1 text-sm text-black"
            />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1 text-black">{children}</main>
      </div>
    </div>
  );
}
