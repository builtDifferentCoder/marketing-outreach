import React from "react";
import { StatusType } from "@/lib/types";

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  NEW: {
    label: "NEW",
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
  RESEARCHED: {
    label: "RESEARCHED",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  CONTACTED: {
    label: "CONTACTED",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  FOLLOW_UP: {
    label: "FOLLOW UP",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  REPLIED: {
    label: "REPLIED",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  INTERESTED: {
    label: "INTERESTED",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  CALL_SCHEDULED: {
    label: "CALL SCHEDULED",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  PROPOSAL_SENT: {
    label: "PROPOSAL SENT",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  NEGOTIATING: {
    label: "NEGOTIATING",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  WON: {
    label: "WON",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-300",
    dot: "bg-emerald-600",
  },
  LOST: {
    label: "LOST",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  NOT_INTERESTED: {
    label: "NOT INTERESTED",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
}) => {
  const normalized = (status || "").toUpperCase();
  const config = statusConfig[normalized] || {
    label: status,
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs tracking-wider"
      : "px-2.5 py-1 text-xs tracking-wider";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
      {config.label}
    </span>
  );
};
