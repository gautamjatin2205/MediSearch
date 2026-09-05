import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  onSelectSuggestion: (term: string) => void;
}

const COMMON_SUGGESTIONS = ["Advil", "Tylenol", "Aspirin", "Amoxicillin", "Lipitor"];

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onSelectSuggestion,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-3">
        <SearchX className="h-6 w-6 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        No medicines found for &ldquo;{searchTerm}&rdquo;
      </h3>

      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        Please check the spelling or search by commercial brand name rather than generic chemical name.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
        <span className="text-slate-400">Try searching:</span>
        {COMMON_SUGGESTIONS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelectSuggestion(name)}
            className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
