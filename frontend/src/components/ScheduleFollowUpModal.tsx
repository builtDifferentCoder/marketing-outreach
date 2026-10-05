"use client";

import React, { useState } from "react";
import { Prospect } from "@/lib/types";
import { Calendar, X } from "lucide-react";

interface ScheduleFollowUpModalProps {
  prospect: Prospect | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateStr: string | null) => Promise<void>;
}

export const ScheduleFollowUpModal: React.FC<ScheduleFollowUpModalProps> = ({
  prospect,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    prospect?.next_follow_up_date || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !prospect) return null;

  const setRelativeDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(selectedDate || null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async () => {
    try {
      setIsSubmitting(true);
      await onSave(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-slate-900 text-sm">Schedule Follow-up</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-xs text-slate-600">
            Set next follow-up date for{" "}
            <span className="font-semibold text-slate-800">
              {prospect.company_name}
            </span>{" "}
            ({prospect.owner_name}):
          </p>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Follow-up Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Quick presets */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Shortcuts
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRelativeDays(1)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-left transition"
              >
                +1 Day (Tomorrow)
              </button>
              <button
                type="button"
                onClick={() => setRelativeDays(3)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-left transition"
              >
                +3 Days
              </button>
              <button
                type="button"
                onClick={() => setRelativeDays(7)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-left transition"
              >
                +1 Week
              </button>
              <button
                type="button"
                onClick={() => setRelativeDays(14)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-left transition"
              >
                +2 Weeks
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1"
          >
            Clear Date
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Date"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
