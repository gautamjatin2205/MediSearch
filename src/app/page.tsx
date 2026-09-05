"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { DrugCard } from "@/components/DrugCard";
import { DrugCardSkeleton } from "@/components/DrugCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { useDebounce } from "@/hooks/useDebounce";
import { useDrugSearch } from "@/hooks/useDrugSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";

type FilterType = "all" | "otc" | "rx";

const QUICK_CATEGORIES = [
  { label: "Pain Relief", query: "Advil" },
  { label: "Cold & Flu", query: "Tylenol" },
  { label: "Headache", query: "Aspirin" },
  { label: "Allergy", query: "Zyrtec" },
  { label: "Antibiotics", query: "Amoxicillin" },
  { label: "Cholesterol", query: "Lipitor" },
];

function MedicineSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const debouncedQuery = useDebounce(inputQuery, 350);
  const isDebouncing =
    inputQuery.trim() !== debouncedQuery.trim() && inputQuery.trim().length > 0;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useDrugSearch(debouncedQuery);

  const { recentSearches, addSearch, clearSearches } = useRecentSearches();

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed) {
      router.replace(`/?q=${encodeURIComponent(trimmed)}`, { scroll: false });
      addSearch(trimmed);
    } else {
      router.replace("/", { scroll: false });
    }
  }, [debouncedQuery, router, addSearch]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== inputQuery) {
      setInputQuery(q);
    }
  }, [searchParams]);

  const handleSelectSuggestion = useCallback((term: string) => {
    setInputQuery(term);
  }, []);

  const drugs = data?.drugs || [];
  const totalCount = data?.total || 0;

  // Filter results by OTC / Prescription tag
  const filteredDrugs = useMemo(() => {
    if (activeFilter === "all") return drugs;

    return drugs.filter((drug) => {
      const productType = (drug.openfda?.product_type?.[0] || "").toUpperCase();
      if (activeFilter === "otc") {
        return productType.includes("OTC");
      }
      if (activeFilter === "rx") {
        return productType.includes("PRESCRIPTION") || productType.includes("RX");
      }
      return true;
    });
  }, [drugs, activeFilter]);

  const showLoading = (isLoading || isDebouncing) && inputQuery.trim().length > 0;
  const hasSearched = debouncedQuery.trim().length > 0;
  const hasResults = !showLoading && filteredDrugs.length > 0;
  const isNoResults = hasSearched && !showLoading && !isError && drugs.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Search Medicines
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Find drug labels, ingredients, dosage instructions, and warnings
          sourced directly from the official FDA database.
        </p>

        {/* Search Bar */}
        <div className="mt-6">
          <SearchBar
            value={inputQuery}
            onChange={setInputQuery}
            isLoading={isFetching && !isDebouncing}
            isDebouncing={isDebouncing}
            recentSearches={recentSearches}
            onSelectSuggestion={handleSelectSuggestion}
            onClearRecent={clearSearches}
          />
        </div>
      </div>

      {/* Results Header with filters */}
      {hasSearched && (
        <div className="mt-10 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {showLoading ? (
                "Searching..."
              ) : (
                <>
                  Results for &ldquo;{debouncedQuery}&rdquo;
                </>
              )}
            </h2>
            {!showLoading && (
              <p className="text-xs text-slate-500">
                Found {totalCount} matching {totalCount === 1 ? "medicine" : "medicines"}
              </p>
            )}
          </div>

          {/* OTC / Prescription Filter buttons */}
          {drugs.length > 0 && !showLoading && (
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`rounded-md px-3 py-1 transition-colors ${activeFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                All ({drugs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("otc")}
                className={`rounded-md px-3 py-1 transition-colors ${activeFilter === "otc"
                    ? "bg-white text-emerald-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Over the Counter
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("rx")}
                className={`rounded-md px-3 py-1 transition-colors ${activeFilter === "rx"
                    ? "bg-white text-blue-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Prescription
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="mt-6">
        {/* Loading Skeletons */}
        {showLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DrugCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!showLoading && isError && (
          <ErrorState
            message={error?.message || "Failed to reach the FDA database."}
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State: No matches found */}
        {isNoResults && (
          <EmptyState
            searchTerm={debouncedQuery}
            onSelectSuggestion={handleSelectSuggestion}
          />
        )}

        {/* Initial Empty State: Clean category pills */}
        {!hasSearched && (
          <div className="mx-auto max-w-lg text-center py-16">
            <p className="text-sm font-medium text-slate-600 mb-3">
              Common searches:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat.query}
                  type="button"
                  onClick={() => handleSelectSuggestion(cat.query)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{cat.query}</span>
                  <span className="text-slate-400 ml-1.5">({cat.label})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Cards Grid */}
        {hasResults && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrugs.map((drug) => (
              <DrugCard
                key={drug.id}
                drug={drug}
                searchQuery={debouncedQuery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DrugCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      }
    >
      <MedicineSearchContent />
    </Suspense>
  );
}
