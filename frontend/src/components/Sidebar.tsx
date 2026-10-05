"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  Target,
  PlusCircle,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Prospects", href: "/#prospects-table", icon: Users },
  ];

  return (
    <>
      {/* Mobile Top Header with Menu Button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Target className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">
            Outreach CRM
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
                Outreach CRM
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Agency Client Pipeline</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <Link
            href="/prospects/new"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Prospect</span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-2 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Navigation
          </div>
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Preferences
          </div>
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              pathname === "/settings"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            Settings
          </Link>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-semibold flex items-center justify-center text-xs">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Outreach Manager</p>
              <p className="text-[11px] text-slate-400 truncate">Local CRM &bull; Single User</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
