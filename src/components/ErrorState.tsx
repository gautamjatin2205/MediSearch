import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Failed to fetch drug labels from openFDA.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center sm:p-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        Unable to load medicine data
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-600">
        {message}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Please check your internet connection or verify that openFDA services are accessible.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
