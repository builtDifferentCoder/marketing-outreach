import React from "react";
import { StatsData } from "@/lib/types";
import {
  Users,
  Sparkles,
  Send,
  Clock,
  ThumbsUp,
  FileSpreadsheet,
  Trophy,
} from "lucide-react";

interface StatsCardsProps {
  stats: StatsData | null;
  loading?: boolean;
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  loading = false,
  selectedStatus = "ALL",
  onSelectStatus,
}) => {
  const cards = [
    {
      key: "ALL",
      label: "Total Prospects",
      value: stats?.total ?? 0,
      icon: Users,
      color: "text-slate-700 bg-slate-100",
      activeBorder: "border-slate-500",
    },
    {
      key: "NEW",
      label: "New",
      value: stats?.new ?? 0,
      icon: Sparkles,
      color: "text-blue-700 bg-blue-50",
      activeBorder: "border-blue-500",
    },
    {
      key: "CONTACTED",
      label: "Contacted",
      value: stats?.contacted ?? 0,
      icon: Send,
      color: "text-purple-700 bg-purple-50",
      activeBorder: "border-purple-500",
    },
    {
      key: "FOLLOW_UP",
      label: "Follow Up",
      value: stats?.follow_up ?? 0,
      icon: Clock,
      color: "text-amber-700 bg-amber-50",
      activeBorder: "border-amber-500",
    },
    {
      key: "INTERESTED",
      label: "Interested",
      value: stats?.interested ?? 0,
      icon: ThumbsUp,
      color: "text-emerald-700 bg-emerald-50",
      activeBorder: "border-emerald-500",
    },
    {
      key: "PROPOSAL_SENT",
      label: "Proposals",
      value: stats?.proposals ?? 0,
      icon: FileSpreadsheet,
      color: "text-orange-700 bg-orange-50",
      activeBorder: "border-orange-500",
    },
    {
      key: "WON",
      label: "Won",
      value: stats?.won ?? 0,
      icon: Trophy,
      color: "text-emerald-800 bg-emerald-100",
      activeBorder: "border-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.key;
        return (
          <button
            key={card.key}
            onClick={() => onSelectStatus && onSelectStatus(card.key)}
            className={`text-left p-3.5 rounded-xl bg-white border transition-all duration-150 shadow-sm hover:shadow hover:border-slate-300 relative overflow-hidden ${
              isSelected ? `ring-2 ring-blue-500/20 ${card.activeBorder} shadow-sm` : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 truncate mr-1">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${card.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {loading ? (
                <div className="h-6 w-10 bg-slate-200 animate-pulse rounded" />
              ) : (
                card.value
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
