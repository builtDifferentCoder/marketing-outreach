import React from "react";
import { Prospect } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { AlertCircle, Calendar, ChevronRight, Clock } from "lucide-react";

interface FollowUpSectionProps {
  dueFollowUps: Prospect[];
  upcomingFollowUps: Prospect[];
  loading?: boolean;
  onSelectProspect: (prospect: Prospect) => void;
}

export const FollowUpSection: React.FC<FollowUpSectionProps> = ({
  dueFollowUps,
  upcomingFollowUps,
  loading = false,
  onSelectProspect,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const formatDueText = (dateStr?: string | null) => {
    if (!dateStr) return "";
    if (dateStr === todayStr) return "Due Today";
    if (dateStr < todayStr) return `Overdue (${dateStr})`;
    return dateStr;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Follow-ups Due */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Follow-ups Due
              </h3>
              <p className="text-xs text-slate-500">
                Action required today or overdue
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
            {loading ? "..." : dueFollowUps.length}
          </span>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto max-h-60 space-y-2">
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading follow-ups...</div>
          ) : dueFollowUps.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No follow-ups due. Great job keeping on top of outreach!
            </div>
          ) : (
            dueFollowUps.map((p) => {
              const isOverdue = (p.next_follow_up_date || "") < todayStr;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProspect(p)}
                  className="group flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate transition">
                        {p.company_name}
                      </span>
                      <PriorityBadge priority={p.priority} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="truncate">{p.owner_name}</span>
                      <span>&bull;</span>
                      <span
                        className={`font-medium ${
                          isOverdue ? "text-rose-600 font-semibold" : "text-amber-700"
                        }`}
                      >
                        {formatDueText(p.next_follow_up_date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upcoming Follow-ups (Next 7 days) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Upcoming Follow-ups
              </h3>
              <p className="text-xs text-slate-500">Scheduled for the next 7 days</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {loading ? "..." : upcomingFollowUps.length}
          </span>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto max-h-60 space-y-2">
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading upcoming...</div>
          ) : upcomingFollowUps.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No follow-ups scheduled in the next 7 days.
            </div>
          ) : (
            upcomingFollowUps.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProspect(p)}
                className="group flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition cursor-pointer"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate transition">
                      {p.company_name}
                    </span>
                    <PriorityBadge priority={p.priority} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="truncate">{p.owner_name}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {p.next_follow_up_date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
