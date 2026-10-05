"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Prospect, StatsData } from "@/lib/types";
import { api } from "@/lib/api";
import { StatsCards } from "@/components/StatsCards";
import { FollowUpSection } from "@/components/FollowUpSection";
import { ProspectTable } from "@/components/ProspectTable";
import { ProspectModal } from "@/components/ProspectModal";
import { ScheduleFollowUpModal } from "@/components/ScheduleFollowUpModal";
import { useToast } from "@/components/Toast";
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "REPLIED", label: "Replied" },
  { value: "INTERESTED", label: "Interested" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  { value: "NEGOTIATING", label: "Negotiating" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "next_follow_up", label: "Next Follow-up" },
  { value: "priority", label: "Priority" },
];

export default function DashboardPage() {
  const { showToast } = useToast();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [dueFollowUps, setDueFollowUps] = useState<Prospect[]>([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<Prospect[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modals state
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followUpTarget, setFollowUpTarget] = useState<Prospect | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Load data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);

      const [statsRes, prospectsRes, dueRes, upcomingRes] = await Promise.all([
        api.getStats(),
        api.getProspects({
          search,
          status: statusFilter,
          priority: priorityFilter,
          sort: sortOption,
        }),
        api.getDueFollowUps(),
        api.getUpcomingFollowUps(),
      ]);

      setStats(statsRes);
      setProspects(prospectsRes);
      setDueFollowUps(dueRes);
      setUpcomingFollowUps(upcomingRes);

      // Keep selected prospect in sync if modal is open
      if (selectedProspect) {
        const updated = prospectsRes.find((p) => p.id === selectedProspect.id);
        if (updated) setSelectedProspect(updated);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to connect to backend API";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortOption, selectedProspect]);

  // Initial fetch and refetch on filter change
  useEffect(() => {
    loadDashboardData();
  }, [search, statusFilter, priorityFilter, sortOption]);

  // Handle Prospect Quick Status Change
  const handleQuickStatusChange = async (id: number, newStatus: string) => {
    try {
      const updated = await api.updateStatus(id, newStatus);
      showToast(`Status updated to ${newStatus}`, "success");
      if (selectedProspect && selectedProspect.id === id) {
        setSelectedProspect(updated);
      }
      loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      showToast(msg, "error");
    }
  };

  // Handle Schedule Follow-up Save
  const handleSaveFollowUpDate = async (dateStr: string | null) => {
    if (!followUpTarget) return;
    try {
      const updated = await api.updateFollowUp(followUpTarget.id, dateStr);
      showToast(
        dateStr
          ? `Follow-up scheduled for ${dateStr}`
          : "Follow-up date cleared",
        "success"
      );
      if (selectedProspect && selectedProspect.id === followUpTarget.id) {
        setSelectedProspect(updated);
      }
      loadDashboardData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to schedule follow-up";
      showToast(msg, "error");
    }
  };

  // Handle Prospect Delete
  const handleDeleteProspect = async (id: number) => {
    try {
      await api.deleteProspect(id);
      showToast("Prospect deleted successfully", "success");
      if (selectedProspect && selectedProspect.id === id) {
        setIsModalOpen(false);
        setSelectedProspect(null);
      }
      loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete prospect";
      showToast(msg, "error");
    }
  };

  // Open prospect details modal
  const handleOpenProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsModalOpen(true);
  };

  // Open schedule follow-up modal
  const handleOpenFollowUp = (prospect: Prospect) => {
    setFollowUpTarget(prospect);
    setIsFollowUpModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Outreach CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track prospects, conversations, proposals and clients.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDashboardData()}
            title="Refresh Data"
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/prospects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            + Add Prospect
          </Link>
        </div>
      </div>

      {/* Backend connection warning if API is down */}
      {apiError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Cannot connect to CRM backend</p>
            <p className="text-amber-800 mt-0.5">{apiError}</p>
            <p className="text-amber-700 mt-1 font-mono text-[11px]">
              Make sure FastAPI is running: <code>uvicorn main:app --reload</code> in the <code>backend/</code> folder.
            </p>
          </div>
          <button
            onClick={() => loadDashboardData()}
            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium rounded-lg text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Dynamic Summary Statistics Cards */}
      <StatsCards
        stats={stats}
        loading={loading && !stats}
        selectedStatus={statusFilter}
        onSelectStatus={(status) => setStatusFilter(status)}
      />

      {/* Follow-ups Due & Upcoming Section */}
      <FollowUpSection
        dueFollowUps={dueFollowUps}
        upcomingFollowUps={upcomingFollowUps}
        loading={loading && !stats}
        onSelectProspect={handleOpenProspect}
      />

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, owner or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium text-slate-400">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-400">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Badges/Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          {STATUS_FILTERS.map((f) => {
            const isSelected = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full font-medium transition flex-shrink-0 text-xs ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prospect Table */}
      <ProspectTable
        prospects={prospects}
        loading={loading}
        onSelectProspect={handleOpenProspect}
        onQuickStatusChange={handleQuickStatusChange}
        onScheduleFollowUp={handleOpenFollowUp}
        onDeleteProspect={handleDeleteProspect}
      />

      {/* Modals */}
      <ProspectModal
        prospect={selectedProspect}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProspect(null);
        }}
        onStatusChange={handleQuickStatusChange}
        onScheduleFollowUp={(p) => {
          setIsModalOpen(false);
          handleOpenFollowUp(p);
        }}
        onDelete={handleDeleteProspect}
      />

      <ScheduleFollowUpModal
        prospect={followUpTarget}
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setFollowUpTarget(null);
        }}
        onSave={handleSaveFollowUpDate}
      />
    </div>
  );
}
