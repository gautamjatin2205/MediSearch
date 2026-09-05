import React from "react";

export const DrugCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm animate-pulse">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded-md bg-slate-200" />
          <div className="h-5 w-16 rounded-md bg-slate-100" />
        </div>

        {/* Title & Subtitle */}
        <div className="mt-4 space-y-2">
          <div className="h-6 w-3/4 rounded-md bg-slate-200" />
          <div className="h-4 w-1/2 rounded-md bg-slate-100" />
        </div>

        {/* Manufacturer */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-slate-200" />
          <div className="h-4 w-2/3 rounded-md bg-slate-100" />
        </div>

        {/* Substances */}
        <div className="mt-3 flex gap-1.5">
          <div className="h-4 w-16 rounded bg-slate-100" />
          <div className="h-4 w-20 rounded bg-slate-100" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-200" />
      </div>
    </div>
  );
};
