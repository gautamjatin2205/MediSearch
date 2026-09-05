"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { FdaDrugLabel } from "@/types/fda";
import { normalizeDrug } from "@/services/fdaApi";
import { Badge } from "./Badge";

interface DrugCardProps {
  drug: FdaDrugLabel;
  searchQuery?: string;
}

const DrugCardComponent: React.FC<DrugCardProps> = ({ drug, searchQuery = "" }) => {
  const data = useMemo(() => normalizeDrug(drug), [drug]);

  const detailHref = searchQuery
    ? `/medicine/${encodeURIComponent(data.id)}?q=${encodeURIComponent(searchQuery)}`
    : `/medicine/${encodeURIComponent(data.id)}`;

  return (
    <Link
      href={detailHref}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-sm"
    >
      <div>
        {/* Badges: OTC/Rx & Route */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {data.isOtc && (
              <Badge variant="success" size="sm">
                OTC
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
          </div>

          {data.routes.length > 0 && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
              {data.routes[0]}
            </span>
          )}
        </div>

        {/* Brand & Generic name */}
        <div className="mt-3">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {data.brandName}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
            {data.genericName}
          </p>
        </div>

        {/* Manufacturer */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{data.manufacturer}</span>
        </div>

        {/* Active substances */}
        {data.substances.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {data.substances.slice(0, 2).map((substance) => (
              <span
                key={substance}
                className="rounded bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-600 border border-slate-200"
              >
                {substance}
              </span>
            ))}
            {data.substances.length > 2 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{data.substances.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          NDC: {data.productNdc}
        </span>
        <span className="flex items-center gap-0.5 font-medium text-blue-600 group-hover:text-blue-700">
          View details
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export const DrugCard = React.memo(DrugCardComponent);
