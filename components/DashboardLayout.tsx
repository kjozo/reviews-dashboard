"use client";

import { ReactNode, useState } from "react";
import { MdDashboard, MdRateReview } from "react-icons/md";
import { FaRegWindowRestore } from "react-icons/fa";
import Image from "next/image";

// constants for colors
const FLEX_GREEN = "#335C59";
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
          color: FLEX_GREEN,
        }}
      >
        {/* header with logo on the left, toggle on the right */}
        <div className="flex items-center h-16 text-xl font-bold border-b border-[#e6e3d7] px-4">
          {/* logo: visible when expanded, hidden when collapsed */}
          {!collapsed && (
            <Image
              src="/theflex-logo.png"
              alt="The Flex Logo"
              width={140}
              height={40}
              style={{ objectFit: "contain" }}
              priority
            />
          )}
          {/* when collapsed, keep space for centering toggle */}
          {collapsed && <div className="flex-1" />}
          <button
            className={`flex items-center justify-center w-10 h-10 rounded hover:text-[#B7E283] transition-all duration-300 ml-auto`}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            style={{
              color: FLEX_GREEN,
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
              color: FLEX_GREEN,
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
              color: FLEX_GREEN,
              fontWeight: 600,
            }}
          >
            <MdRateReview className="w-5 h-5" />
            {!collapsed && <span>Reviews</span>}
          </a>
        </nav>

        {/* copyright */}
        <div className="px-4 py-3 border-t border-[#e6e3d7] text-sm" style={{ color: FLEX_GREEN }}>
          © 2025 The Flex
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 flex flex-col text-black font-sans">
        <header
          className="bg-white px-6 py-5 flex items-center justify-between rounded-b-2xl shadow mb-2"
          style={{ color: FLEX_GREEN }}
        >
          <div className="font-semibold text-lg">Welcome Back, Manager 👋</div>
          <div className="flex items-center gap-4">
            {/* removed search bar as requested */}
          </div>
        </header>

        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
