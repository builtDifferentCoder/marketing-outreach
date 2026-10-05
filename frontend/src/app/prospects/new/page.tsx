"use client";

import React from "react";
import { ProspectForm } from "@/components/ProspectForm";
import { ProspectFormData } from "@/lib/types";
import { api } from "@/lib/api";

export default function NewProspectPage() {
  const handleCreate = async (data: ProspectFormData) => {
    await api.createProspect(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Add New Prospect
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enter agency or company details to begin your outreach workflow.
        </p>
      </div>

      <ProspectForm onSubmit={handleCreate} isEdit={false} />
    </div>
  );
}
