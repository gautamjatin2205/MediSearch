"use client";

import React, { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useDrugDetail } from "@/hooks/useDrugDetail";
import { DrugDetailView } from "@/components/DrugDetailView";

interface MedicineDetailPageProps {
  params: Promise<{ id: string }>;
}

function MedicineDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const returnQuery = searchParams.get("q") || "";

  const { data: drug, isLoading, isError, error } = useDrugDetail(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-400 mb-6 animate-pulse">
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
        </div>

        {/* Header skeleton */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 animate-pulse">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-24 bg-slate-200 rounded-md" />
            <div className="h-6 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8 w-1/2 bg-slate-200 rounded-lg mb-3" />
          <div className="h-5 w-1/3 bg-slate-100 rounded-lg mb-6" />
          <div className="h-px bg-slate-100 w-full mb-6" />
          <div className="flex gap-6">
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-4 w-28 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Section skeleton */}
        <div className="mt-8 space-y-4 animate-pulse">
          <div className="h-20 bg-white rounded-2xl border border-slate-200" />
          <div className="h-20 bg-white rounded-2xl border border-slate-200" />
          <div className="h-20 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !drug) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4 border border-amber-100">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Medicine Details Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          We couldn&apos;t locate the requested FDA drug label record. The identifier may
          have expired, or the FDA API service may be temporarily unreachable.
        </p>
        {error && (
          <p className="mt-2 text-xs font-mono text-red-500 bg-red-50 p-2 rounded max-w-md mx-auto">
            {error.message}
          </p>
        )}
        <div className="mt-6">
          <Link
            href={returnQuery ? `/?q=${encodeURIComponent(returnQuery)}` : "/"}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Search</span>
          </Link>
        </div>
      </div>
    );
  }

  return <DrugDetailView drug={drug} returnQuery={returnQuery} />;
}

export default function MedicineDetailPage({
  params,
}: MedicineDetailPageProps) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <MedicineDetailContent id={resolvedParams.id} />
    </Suspense>
  );
}
