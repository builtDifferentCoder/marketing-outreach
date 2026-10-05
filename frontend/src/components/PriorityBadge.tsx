import React from "react";
import { PriorityType } from "@/lib/types";

interface PriorityBadgeProps {
  priority: PriorityType | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const norm = (priority || "").toUpperCase();

  let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
  let dotClass = "bg-slate-400";

  if (norm === "HIGH") {
    badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    dotClass = "bg-rose-500";
  } else if (norm === "MEDIUM") {
    badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    dotClass = "bg-amber-500";
  } else if (norm === "LOW") {
    badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
    dotClass = "bg-slate-400";
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`} />
      {norm}
    </span>
  );
};
