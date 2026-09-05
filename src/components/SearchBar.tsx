"use client";

import React, { useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  isDebouncing: boolean;
  recentSearches: string[];
  onSelectSuggestion: (term: string) => void;
  onClearRecent: () => void;
}

const POPULAR_SUGGESTIONS = [
  "Advil",
  "Tylenol",
  "Aspirin",
  "Amoxicillin",
  "Lipitor",
  "Metformin",
  "Zyrtec",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  isLoading,
  isDebouncing,
  recentSearches,
  onSelectSuggestion,
  onClearRecent,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          {isLoading || isDebouncing ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by brand name (e.g., Advil, Tylenol)..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-xs"
          autoFocus
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            title="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span className="font-medium text-slate-500 mr-0.5">Popular:</span>
        {POPULAR_SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelectSuggestion(item)}
            className={`rounded-full px-2.5 py-0.5 transition-colors ${
              value.toLowerCase() === item.toLowerCase()
                ? "bg-blue-600 text-white font-medium"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item}
          </button>
        ))}

        {recentSearches.length > 0 && !value && (
          <div className="flex flex-wrap items-center gap-1.5 ml-2 pl-2 border-l border-slate-200">
            <span className="font-medium text-slate-400">Recent:</span>
            {recentSearches.slice(0, 3).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSelectSuggestion(term)}
                className="rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-600 hover:bg-slate-100"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={onClearRecent}
              className="text-slate-400 hover:text-slate-600 underline ml-0.5 text-[11px]"
            >
              clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
