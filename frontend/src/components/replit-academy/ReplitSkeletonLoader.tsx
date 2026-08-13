'use client';

import React from 'react';

export function ModuleSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="w-16 h-5 rounded-full bg-white/10" />
      </div>
      <div className="w-3/4 h-5 rounded bg-white/10" />
      <div className="w-1/2 h-3 rounded bg-white/5" />
      <div className="w-full h-12 rounded-xl bg-white/5" />
      <div className="flex justify-between pt-3 border-t border-white/5">
        <div className="w-16 h-4 rounded bg-white/10" />
        <div className="w-20 h-4 rounded bg-white/10" />
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse space-y-6">
      <div className="w-2/3 h-8 rounded bg-white/10" />
      <div className="w-full aspect-video rounded-xl bg-white/5" />
      <div className="space-y-3">
        <div className="w-full h-4 rounded bg-white/5" />
        <div className="w-5/6 h-4 rounded bg-white/5" />
        <div className="w-4/6 h-4 rounded bg-white/5" />
      </div>
    </div>
  );
}
