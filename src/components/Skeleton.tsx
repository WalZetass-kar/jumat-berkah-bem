import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Banner Skeleton */}
      <div className="w-full h-32 rounded-3xl bg-slate-200 animate-pulse p-6 flex flex-col justify-between" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Main Charts & Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LandingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Hero Skeleton */}
      <div className="w-full h-80 bg-slate-200 animate-pulse rounded-b-3xl p-8 flex flex-col justify-end space-y-4">
        <Skeleton className="h-8 w-3/4 max-w-xl bg-slate-300" />
        <Skeleton className="h-4 w-1/2 max-w-md bg-slate-300" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-xl bg-slate-300" />
          <Skeleton className="h-10 w-32 rounded-xl bg-slate-300" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 5, 6].map((i) => (
          <div key={i} className="h-12 w-full bg-slate-100 rounded-xl flex items-center justify-between px-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
