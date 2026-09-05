"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { FdaDrugLabel } from "@/types/fda";
import { normalizeDrug } from "@/services/fdaApi";
import { Badge } from "./Badge";

interface DrugDetailViewProps {
  drug: FdaDrugLabel;
  returnQuery?: string;
}

export const DrugDetailView: React.FC<DrugDetailViewProps> = ({
  drug,
  returnQuery = "",
}) => {
  const data = normalizeDrug(drug);
  const backHref = returnQuery ? `/?q=${encodeURIComponent(returnQuery)}` : "/";

  const [activeTab, setActiveTab] = useState<
    "uses" | "dosage" | "warnings" | "ingredients" | "packaging"
  >("uses");

  const renderSectionText = (lines?: string[]) => {
    if (!lines || lines.length === 0) {
      return (
        <p className="text-sm text-slate-400 italic">
          No details provided in this label revision.
        </p>
      );
    }
    return (
      <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
        {lines.map((text, i) => (
          <p key={i} className="whitespace-pre-line">
            {text}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            {returnQuery
              ? `Back to "${returnQuery}" results`
              : "Back to search"}
          </span>
        </Link>
      </div>

      {/* Main Drug Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {data.isOtc && (
            <Badge variant="success" size="sm">
              Over-the-Counter (OTC)
            </Badge>
          )}
          {data.isRx && (
            <Badge variant="primary" size="sm">
              Prescription
            </Badge>
          )}
          {!data.isOtc && !data.isRx && data.productType && (
            <Badge variant="neutral" size="sm">
              {data.productType}
            </Badge>
          )}

          {data.routes.map((route) => (
            <span
              key={route}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium"
            >
              {route}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {data.brandName}
        </h1>

        <p className="mt-1 text-sm text-slate-500 font-medium">
          {data.genericName}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-slate-100 pt-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>{data.manufacturer}</span>
          </div>
          <div>
            <span className="text-slate-400">NDC:</span>{" "}
            <span className="font-mono font-medium">{data.productNdc}</span>
          </div>
          {data.applicationNumber !== "N/A" && (
            <div>
              <span className="text-slate-400">Application:</span>{" "}
              <span className="font-mono font-medium">
                {data.applicationNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="mt-6 flex border-b border-slate-200 text-sm font-medium overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("uses")}
          className={`pb-3 px-4 transition-colors whitespace-nowrap ${activeTab === "uses"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Uses & Indications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dosage")}
          className={`pb-3 px-4 transition-colors whitespace-nowrap ${activeTab === "dosage"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Dosage & Directions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warnings")}
          className={`pb-3 px-4 transition-colors whitespace-nowrap ${activeTab === "warnings"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Warnings & Safety
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ingredients")}
          className={`pb-3 px-4 transition-colors whitespace-nowrap ${activeTab === "ingredients"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Ingredients
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("packaging")}
          className={`pb-3 px-4 transition-colors whitespace-nowrap ${activeTab === "packaging"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Packaging & Storage
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        {activeTab === "uses" && (
          <div className="space-y-4">
            {drug.purpose && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Purpose
                </h3>
                {renderSectionText(drug.purpose)}
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Indications & Usage
              </h3>
              {renderSectionText(drug.indications_and_usage)}
            </div>
          </div>
        )}

        {activeTab === "dosage" && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Directions & Dosage Instructions
            </h3>
            {renderSectionText(drug.dosage_and_administration)}
          </div>
        )}

        {activeTab === "warnings" && (
          <div className="space-y-4">
            {drug.do_not_use && (
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1">
                  Do Not Use
                </h4>
                {renderSectionText(drug.do_not_use)}
              </div>
            )}

            {drug.warnings && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Warnings
                </h3>
                {renderSectionText(drug.warnings)}
              </div>
            )}

            {drug.ask_doctor && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Ask a Doctor Before Use
                </h3>
                {renderSectionText(drug.ask_doctor)}
              </div>
            )}

            {drug.stop_use && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Stop Use If
                </h3>
                {renderSectionText(drug.stop_use)}
              </div>
            )}
          </div>
        )}

        {activeTab === "ingredients" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Active Ingredients
              </h3>
              {renderSectionText(drug.active_ingredient)}
            </div>

            {drug.inactive_ingredient && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Inactive Ingredients
                </h3>
                {renderSectionText(drug.inactive_ingredient)}
              </div>
            )}
          </div>
        )}

        {activeTab === "packaging" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Storage & Handling
              </h3>
              {renderSectionText(
                drug.storage_and_handling || drug.spl_unclassified_section
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 text-xs">
              <h3 className="font-semibold text-slate-500 mb-2">
                OpenFDA Identifiers
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-mono">
                <div>
                  <span className="text-slate-400">SPL ID:</span>{" "}
                  <span className="break-all">{drug.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">RxCUI:</span>{" "}
                  {drug.openfda?.rxcui?.join(", ") || "N/A"}
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
