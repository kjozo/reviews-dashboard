"use client";

import { ReactNode, useState } from "react";
import { MdDashboard, MdRateReview } from "react-icons/md";
import { FaRegWindowRestore, FaHome } from "react-icons/fa";

// constants for colors
const DASHBOARD_GREEN = "#335C59";
const NAVBAR_BG = "#FFFDF6";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  // sidebar collapsed state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ background: "#fff" }}
    >
      {/* sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-[${NAVBAR_BG}] text-[#335C59] flex flex-col transition-all duration-500 ease-in-out shadow-xl`}
        style={{
          background: NAVBAR_BG,
          color: DASHBOARD_GREEN,
        }}
      >
        {/* header with generic house icon and toggle */}
        <div className="flex items-center h-16 text-xl font-bold border-b border-[#e6e3d7] px-4">
          {!collapsed && (
            <span className="flex items-center gap-2 text-lg font-bold tracking-wide">
              <FaHome className="text-blue-600" size={32} />
              <span>Dashboard</span>
            </span>
          )}
          {/* When collapsed, don't show house icon */}
          {collapsed && <div className="flex-1" />}
          <button
            className={`flex items-center justify-center w-10 h-10 rounded hover:text-[#B7E283] transition-all duration-300 ml-auto`}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            style={{
              color: DASHBOARD_GREEN,
              background: "transparent",
            }}
          >
            <FaRegWindowRestore size={22} />
          </button>
        </div>

        {/* navigation */}
        <nav className="flex-1 py-6 space-y-2">
          <a
            href="/dashboard"
            className={`flex items-center py-2 rounded hover:bg-[#e6e3d7] transition-all duration-300 ${
              collapsed ? "justify-center" : "gap-3 px-6 justify-start"
            }`}
            style={{
              color: DASHBOARD_GREEN,
              fontWeight: 600,
            }}
          >
            <MdDashboard className="w-5 h-5" />
            {!collapsed && <span>Dashboard</span>}
          </a>
          <a
            href="/reviews"
            className={`flex items-center py-2 rounded hover:bg-[#e6e3d7] transition-all duration-300 ${
              collapsed ? "justify-center" : "gap-3 px-6 justify-start"
            }`}
            style={{
              color: DASHBOARD_GREEN,
              fontWeight: 600,
            }}
          >
            <MdRateReview className="w-5 h-5" />
            {!collapsed && <span>Reviews</span>}
          </a>
        </nav>

        {/* copyright */}
        <div className="px-4 py-3 border-t border-[#e6e3d7] text-sm" style={{ color: DASHBOARD_GREEN }}>
          © 2025
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 flex flex-col text-black font-sans">
        <header
          className="bg-white px-6 py-5 flex items-center justify-between rounded-b-2xl shadow mb-2"
          style={{ color: DASHBOARD_GREEN }}
        >
          <div className="font-semibold text-lg">Welcome Back 👋</div>
          <div className="flex items-center gap-4">
            {/* removed search bar and branding */}
          </div>
        </header>

        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
