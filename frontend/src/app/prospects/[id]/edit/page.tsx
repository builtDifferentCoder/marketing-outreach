"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Prospect, ProspectFormData } from "@/lib/types";
import { api } from "@/lib/api";
import { ProspectForm } from "@/components/ProspectForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditProspectPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("Invalid prospect ID");
      setLoading(false);
      return;
    }

    const fetchProspect = async () => {
      try {
        setLoading(true);
        const data = await api.getProspect(id);
        setProspect(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load prospect";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProspect();
  }, [id]);

  const handleUpdate = async (formData: ProspectFormData) => {
    if (!id) return;
    await api.updateProspect(id, formData);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium">Loading prospect details...</p>
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          {error || "Prospect not found"}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Edit Prospect: {prospect.company_name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Update company info, opportunity status, or outreach records.
        </p>
      </div>

      <ProspectForm initialData={prospect} onSubmit={handleUpdate} isEdit={true} />
    </div>
  );
}
