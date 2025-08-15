"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
          DESKBOARD
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            Statistics
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            Reviews
          </a>
        </nav>
        <div className="px-4 py-3 border-t border-gray-700 text-sm">
          © 2025 Your Company
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="font-semibold">Welcome Back, Manager 👋</div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-1 text-sm"
            />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
