"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Prospect, StatusType } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import {
  X,
  Mail,
  Phone,
  Globe,
  Linkedin,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

interface ProspectModalProps {
  prospect: Prospect | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => Promise<void>;
  onScheduleFollowUp: (prospect: Prospect) => void;
  onDelete: (id: number) => Promise<void>;
}

const ALL_STATUSES: { value: StatusType; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "RESEARCHED", label: "Researched" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "REPLIED", label: "Replied" },
  { value: "INTERESTED", label: "Interested" },
  { value: "CALL_SCHEDULED", label: "Call Scheduled" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  { value: "NEGOTIATING", label: "Negotiating" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
];

export const ProspectModal: React.FC<ProspectModalProps> = ({
  prospect,
  isOpen,
  onClose,
  onStatusChange,
  onScheduleFollowUp,
  onDelete,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !prospect) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(prospect.id);
      setConfirmDelete(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedAmount = prospect.proposal_amount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: prospect.currency || "USD",
        maximumFractionDigits: 0,
      }).format(prospect.proposal_amount)
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {prospect.company_name}
              </h2>
              <StatusBadge status={prospect.status} size="md" />
              <PriorityBadge priority={prospect.priority} />
            </div>
            {prospect.company_type && (
              <p className="text-xs font-medium text-slate-500 mt-1">
                {prospect.company_type}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Quick Workflow Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Outreach Action:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {prospect.status === "NEW" && (
                <button
                  onClick={() => onStatusChange(prospect.id, "RESEARCHED")}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Mark Researched
                </button>
              )}
              {prospect.status !== "CONTACTED" && (
                <button
                  onClick={() => onStatusChange(prospect.id, "CONTACTED")}
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium hover:bg-purple-100 transition"
                >
                  Mark Contacted
                </button>
              )}
              <button
                onClick={() => onScheduleFollowUp(prospect)}
                className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-xs font-medium hover:bg-amber-100 transition flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                Schedule Follow-up
              </button>
              {prospect.status !== "INTERESTED" && (
                <button
                  onClick={() => onStatusChange(prospect.id, "INTERESTED")}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 transition"
                >
                  Mark Interested
                </button>
              )}
              {prospect.status !== "PROPOSAL_SENT" && (
                <button
                  onClick={() => onStatusChange(prospect.id, "PROPOSAL_SENT")}
                  className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-xs font-medium hover:bg-orange-100 transition"
                >
                  Send Proposal
                </button>
              )}
              {prospect.status !== "WON" && (
                <button
                  onClick={() => onStatusChange(prospect.id, "WON")}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-xs font-medium hover:bg-emerald-700 shadow-sm transition"
                >
                  Mark Won
                </button>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Owner / Decision Maker</span>
                <span className="font-semibold text-slate-900">
                  {prospect.owner_name}
                </span>
                {prospect.owner_title && (
                  <span className="text-xs text-slate-500 block">
                    {prospect.owner_title}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Email</span>
                <a
                  href={`mailto:${prospect.email}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {prospect.email}
                </a>
              </div>

              {prospect.phone && (
                <div>
                  <span className="text-xs text-slate-400 block">Phone</span>
                  <a
                    href={`tel:${prospect.phone}`}
                    className="font-medium text-slate-800 hover:text-blue-600 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {prospect.phone}
                  </a>
                </div>
              )}

              {prospect.website && (
                <div>
                  <span className="text-xs text-slate-400 block">Website</span>
                  <a
                    href={
                      prospect.website.startsWith("http")
                        ? prospect.website
                        : `https://${prospect.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{prospect.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {prospect.linkedin_url && (
                <div>
                  <span className="text-xs text-slate-400 block">LinkedIn</span>
                  <a
                    href={
                      prospect.linkedin_url.startsWith("http")
                        ? prospect.linkedin_url
                        : `https://${prospect.linkedin_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span className="truncate">View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {(prospect.country || prospect.timezone) && (
                <div>
                  <span className="text-xs text-slate-400 block">Location & Timezone</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {prospect.country || "—"}
                    {prospect.timezone ? ` (${prospect.timezone})` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Opportunity Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Opportunity & Fit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Service Type</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {prospect.service_type || "—"}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Source</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {prospect.source || "—"}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className="text-xs text-slate-400 block">Potential Need</span>
                <p className="font-medium text-slate-800 mt-0.5">
                  {prospect.potential_need || "Not specified yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Outreach Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Outreach Progress
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">First Contact</span>
                <span className="font-medium text-slate-800">
                  {prospect.first_contact_date || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Last Contact</span>
                <span className="font-medium text-slate-800">
                  {prospect.last_contact_date || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Next Follow-up</span>
                <span className="font-medium text-slate-800">
                  {prospect.next_follow_up_date || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Demo Sent</span>
                <span className="font-medium text-slate-800">
                  {prospect.demo_sent ? "Yes" : "No"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-400 block">Demo Type</span>
                <span className="font-medium text-slate-800">
                  {prospect.demo_type || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Commercial */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Commercial
            </h3>
            <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Proposal Value</span>
                <span className="text-lg font-bold text-slate-900">
                  {formattedAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Notes
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 whitespace-pre-wrap leading-relaxed text-xs">
              {prospect.notes ? prospect.notes : "No notes added yet."}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 font-medium">Delete prospect?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition flex items-center gap-1 text-xs font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Prospect</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            {/* Change Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Change Status</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-20 space-y-0.5">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        onStatusChange(prospect.id, s.value);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition ${
                        prospect.status === s.value
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{s.label}</span>
                      {prospect.status === s.value && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Prospect Button */}
            <Link
              href={`/prospects/${prospect.id}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Prospect</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
