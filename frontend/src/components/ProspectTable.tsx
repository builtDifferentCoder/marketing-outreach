"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Prospect } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import {
  Calendar,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Send,
  Building2,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";

interface ProspectTableProps {
  prospects: Prospect[];
  loading?: boolean;
  onSelectProspect: (prospect: Prospect) => void;
  onQuickStatusChange: (id: number, status: string) => Promise<void>;
  onScheduleFollowUp: (prospect: Prospect) => void;
  onDeleteProspect: (id: number) => Promise<void>;
}

export const ProspectTable: React.FC<ProspectTableProps> = ({
  prospects,
  loading = false,
  onSelectProspect,
  onQuickStatusChange,
  onScheduleFollowUp,
  onDeleteProspect,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const formatShortDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount?: number | null, currency: string = "USD") => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div
      id="prospects-table"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Owner</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Last Contact</th>
              <th className="py-3.5 px-4">Next Follow-up</th>
              <th className="py-3.5 px-4">Proposal</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-28" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-slate-200 rounded w-12 ml-auto" />
                  </td>
                </tr>
              ))
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">
                      No prospects yet
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 text-center">
                      Add your first prospect to start tracking your outreach.
                    </p>
                    <Link
                      href="/prospects/new"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 shadow-sm transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Prospect
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              prospects.map((p) => {
                const isOverdue =
                  p.next_follow_up_date &&
                  p.next_follow_up_date < todayStr &&
                  !["WON", "LOST", "NOT_INTERESTED"].includes(p.status);
                const isToday = p.next_follow_up_date === todayStr;

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProspect(p)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* Company */}
                    <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-blue-600 transition">
                      <div className="flex items-center gap-2">
                        <span>{p.company_name}</span>
                        {p.demo_sent && (
                          <span
                            title={`Demo Sent: ${p.demo_type || "Yes"}`}
                            className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.2 rounded font-normal"
                          >
                            Demo
                          </span>
                        )}
                      </div>
                      {p.website && (
                        <span className="text-[11px] text-slate-400 font-normal block truncate max-w-[180px]">
                          {p.website.replace(/^https?:\/\//, "")}
                        </span>
                      )}
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium block">{p.owner_name}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                        {p.email}
                      </span>
                    </td>

                    {/* Service / Company Type */}
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {p.service_type || p.company_type || "—"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3 px-4">
                      <PriorityBadge priority={p.priority} />
                    </td>

                    {/* Last Contact */}
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {formatShortDate(p.last_contact_date)}
                    </td>

                    {/* Next Follow-up */}
                    <td className="py-3 px-4 text-xs font-medium">
                      {p.next_follow_up_date ? (
                        <span
                          className={`inline-flex items-center gap-1 ${
                            isOverdue
                              ? "text-rose-600 font-bold"
                              : isToday
                              ? "text-amber-600 font-bold"
                              : "text-slate-600"
                          }`}
                        >
                          {formatShortDate(p.next_follow_up_date)}
                          {isOverdue && <span className="text-[10px]">(Overdue)</span>}
                          {isToday && <span className="text-[10px]">(Today)</span>}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">—</span>
                      )}
                    </td>

                    {/* Proposal */}
                    <td className="py-3 px-4 text-slate-700 font-medium text-xs">
                      {formatCurrency(p.proposal_amount, p.currency)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === p.id ? null : p.id)
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === p.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-left">
                            <button
                              onClick={() => {
                                onSelectProspect(p);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              View Details
                            </button>
                            <Link
                              href={`/prospects/${p.id}/edit`}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                              Edit Prospect
                            </Link>
                            <button
                              onClick={() => {
                                onScheduleFollowUp(p);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Schedule Follow-up
                            </button>
                            {p.status !== "CONTACTED" && (
                              <button
                                onClick={() => {
                                  onQuickStatusChange(p.id, "CONTACTED");
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Send className="w-3.5 h-3.5 text-slate-400" />
                                Mark Contacted
                              </button>
                            )}
                            {p.status !== "INTERESTED" && (
                              <button
                                onClick={() => {
                                  onQuickStatusChange(p.id, "INTERESTED");
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                                Mark Interested
                              </button>
                            )}
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete ${p.company_name}?`
                                  )
                                ) {
                                  onDeleteProspect(p.id);
                                }
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
