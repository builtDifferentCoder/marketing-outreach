"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Prospect,
  ProspectFormData,
  PriorityType,
  StatusType,
  ServiceType,
  DemoType,
} from "@/lib/types";
import { useToast } from "./Toast";
import {
  Building2,
  User,
  Lightbulb,
  Send,
  DollarSign,
  FileText,
  ArrowLeft,
  Save,
} from "lucide-react";
import Link from "next/link";

interface ProspectFormProps {
  initialData?: Prospect | null;
  onSubmit: (data: ProspectFormData) => Promise<void>;
  isEdit?: boolean;
}

const SERVICE_TYPES: ServiceType[] = [
  "AI Automation Agency",
  "Marketing Agency",
  "Software Agency",
  "Other",
];

const STATUS_OPTIONS: { value: StatusType; label: string }[] = [
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

const PRIORITY_OPTIONS: PriorityType[] = ["HIGH", "MEDIUM", "LOW"];

const DEMO_TYPES: DemoType[] = [
  "Lead Qualification",
  "AI Support/Sales Agent",
  "RAG",
  "Automation",
  "Other",
];

export const ProspectForm: React.FC<ProspectFormProps> = ({
  initialData,
  onSubmit,
  isEdit = false,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ProspectFormData>({
    company_name: initialData?.company_name || "",
    website: initialData?.website || "",
    company_type: initialData?.company_type || "",
    country: initialData?.country || "",
    timezone: initialData?.timezone || "",

    owner_name: initialData?.owner_name || "",
    owner_title: initialData?.owner_title || "",
    email: initialData?.email || "",
    linkedin_url: initialData?.linkedin_url || "",
    phone: initialData?.phone || "",

    service_type: initialData?.service_type || "AI Automation Agency",
    potential_need: initialData?.potential_need || "",
    source: initialData?.source || "Apollo",
    priority: (initialData?.priority as PriorityType) || "MEDIUM",

    status: (initialData?.status as StatusType) || "NEW",
    first_contact_date: initialData?.first_contact_date || "",
    last_contact_date: initialData?.last_contact_date || "",
    next_follow_up_date: initialData?.next_follow_up_date || "",
    demo_sent: initialData?.demo_sent ?? false,
    demo_type: (initialData?.demo_type as DemoType) || "",

    proposal_amount: initialData?.proposal_amount ?? null,
    currency: initialData?.currency || "USD",

    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = "Owner name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address (e.g. name@company.com)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the errors in the form before submitting", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      showToast(
        isEdit ? "Prospect updated successfully" : "Prospect created successfully",
        "success"
      );
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save prospect";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting ? "Saving..." : isEdit ? "Update Prospect" : "Save Prospect"}
          </button>
        </div>
      </div>

      {/* 1. Company Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">1. Company Details</h3>
            <p className="text-xs text-slate-500">Information about the prospect company</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Automations"
              value={formData.company_name}
              onChange={(e) => {
                setFormData({ ...formData, company_name: e.target.value });
                if (errors.company_name) setErrors({ ...errors, company_name: "" });
              }}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.company_name
                  ? "border-rose-300 focus:ring-rose-400"
                  : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
              }`}
            />
            {errors.company_name && (
              <p className="text-xs text-rose-600 mt-1">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Website
            </label>
            <input
              type="text"
              placeholder="e.g. https://acme.example.com"
              value={formData.website || ""}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Company Type
            </label>
            <input
              type="text"
              placeholder="e.g. AI Agency, Software Dev, E-commerce"
              value={formData.company_type || ""}
              onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Country
            </label>
            <input
              type="text"
              placeholder="e.g. United States, United Kingdom"
              value={formData.country || ""}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Timezone
            </label>
            <input
              type="text"
              placeholder="e.g. EST, PST, GMT, CET"
              value={formData.timezone || ""}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">2. Contact Details</h3>
            <p className="text-xs text-slate-500">Key decision maker and communication channels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Owner Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. John Smith"
              value={formData.owner_name}
              onChange={(e) => {
                setFormData({ ...formData, owner_name: e.target.value });
                if (errors.owner_name) setErrors({ ...errors, owner_name: "" });
              }}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.owner_name
                  ? "border-rose-300 focus:ring-rose-400"
                  : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
              }`}
            />
            {errors.owner_name && (
              <p className="text-xs text-rose-600 mt-1">{errors.owner_name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Owner Title
            </label>
            <input
              type="text"
              placeholder="e.g. Founder & CEO, Head of Growth"
              value={formData.owner_title || ""}
              onChange={(e) => setFormData({ ...formData, owner_title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-rose-300 focus:ring-rose-400"
                  : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              placeholder="e.g. https://linkedin.com/in/johnsmith"
              value={formData.linkedin_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, linkedin_url: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="e.g. +1 555-0100"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 3. Opportunity Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">3. Opportunity & Fit</h3>
            <p className="text-xs text-slate-500">Service match, lead source, and priority</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Service Type
            </label>
            <select
              value={formData.service_type || "Other"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  service_type: e.target.value as ServiceType,
                })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Lead Source
            </label>
            <input
              type="text"
              placeholder="e.g. Apollo, LinkedIn, Google, Referral, Website"
              value={formData.source || ""}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as PriorityType,
                })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Potential Need
            </label>
            <input
              type="text"
              placeholder="e.g. n8n automation / CRM integration / AI chatbot"
              value={formData.potential_need || ""}
              onChange={(e) =>
                setFormData({ ...formData, potential_need: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Outreach Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">4. Outreach Tracking</h3>
            <p className="text-xs text-slate-500">Track stage in the sales workflow and touchpoints</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Outreach Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as StatusType })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              First Contact Date
            </label>
            <input
              type="date"
              value={formData.first_contact_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, first_contact_date: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Last Contact Date
            </label>
            <input
              type="date"
              value={formData.last_contact_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, last_contact_date: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Next Follow-up Date
            </label>
            <input
              type="date"
              value={formData.next_follow_up_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, next_follow_up_date: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="demo_sent"
              checked={formData.demo_sent}
              onChange={(e) =>
                setFormData({ ...formData, demo_sent: e.target.checked })
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="demo_sent" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Demo Sent to Client
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Demo Type
            </label>
            <select
              value={formData.demo_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, demo_type: e.target.value as DemoType })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="">None / Not Applicable</option>
              {DEMO_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5. Commercial Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">5. Commercial Proposal</h3>
            <p className="text-xs text-slate-500">Proposal pricing and currency details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Proposal Amount
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 3500"
              value={
                formData.proposal_amount !== null && formData.proposal_amount !== undefined
                  ? formData.proposal_amount
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proposal_amount: e.target.value === "" ? null : parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Currency
            </label>
            <input
              type="text"
              placeholder="USD"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 6. Notes Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">6. Notes & Context</h3>
            <p className="text-xs text-slate-500">Call highlights, objections, custom requirements</p>
          </div>
        </div>

        <div>
          <textarea
            rows={5}
            placeholder="Add relevant notes from conversations, key pain points, next steps..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/"
          className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Prospect" : "Save Prospect"}
        </button>
      </div>
    </form>
  );
};
