"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import {
  Database,
  RotateCcw,
  CheckCircle2,
  Server,
  Info,
} from "lucide-react";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleResetSeed = async () => {
    if (
      !confirm(
        "Are you sure you want to re-seed demo data? This will overwrite the database with default demo prospects."
      )
    ) {
      return;
    }

    try {
      setIsSeeding(true);
      await api.seedData(true);
      showToast("Demo prospects restored successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to seed data";
      showToast(msg, "error");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Settings & Environment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Local configuration, database maintenance, and system status.
        </p>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">System Architecture</h3>
            <p className="text-xs text-slate-500">FastAPI backend with SQLite database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Frontend Stack</span>
            <span className="font-semibold text-slate-800">
              Next.js 14 App Router &bull; TypeScript &bull; Tailwind CSS
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Backend Stack</span>
            <span className="font-semibold text-slate-800">
              FastAPI &bull; SQLAlchemy ORM &bull; SQLite3
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Backend API URL</span>
            <span className="font-mono text-slate-700">http://127.0.0.1:8000</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Storage Mode</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Local File (outreach_crm.db)
            </span>
          </div>
        </div>
      </div>

      {/* Demo Seed Reset */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Demo Data Seed</h3>
            <p className="text-xs text-slate-500">
              Reset or reload the 8 realistic demo prospects
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <span>
            Clicking reset will populate the database with realistic demo prospects across different outreach stages (New, Researched, Contacted, Follow Up, Replied, Interested, Proposals, Won, Lost).
          </span>
        </div>

        <div>
          <button
            onClick={handleResetSeed}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin" : ""}`} />
            {isSeeding ? "Resetting Database..." : "Reset Demo Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
