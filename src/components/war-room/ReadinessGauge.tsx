'use client';

import React from 'react';
import { Target, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { SyllabusUnit } from '@/types/academic';

interface ReadinessGaugeProps {
  units: SyllabusUnit[];
  subjectName: string;
}

export function ReadinessGauge({ units, subjectName }: ReadinessGaugeProps) {
  let totalTopics = 0;
  let masteredCount = 0;
  let inProgressCount = 0;
  let untouchedCount = 0;

  units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      totalTopics += 1;
      if (topic.status === 'mastered') masteredCount += 1;
      else if (topic.status === 'in_progress') inProgressCount += 1;
      else untouchedCount += 1;
    });
  });

  const readinessScore = totalTopics > 0
    ? Math.round(((masteredCount * 1.0 + inProgressCount * 0.5) / totalTopics) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Syllabus Readiness Matrix
          </span>
          <h3 className="text-base font-semibold text-slate-900 mt-0.5">
            {subjectName} Preparedness Index
          </h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-slate-900 font-mono">
            {readinessScore}%
          </span>
          <span className="text-xs font-medium text-slate-500">
            {masteredCount} of {totalTopics} Mastered
          </span>
        </div>
      </div>

      {/* Segmented Progress Track */}
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {/* Mastered portion (green) */}
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${(masteredCount / totalTopics) * 100}%` }}
            title={`Mastered: ${masteredCount}`}
          />
          {/* In Progress portion (amber) */}
          <div
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${(inProgressCount / totalTopics) * 100}%` }}
            title={`In Progress: ${inProgressCount}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Formula: ((Mastered × 1.0) + (In Progress × 0.5)) / Total</span>
          <span className="font-medium text-slate-700">Target: 90%+ for Exam A Grade</span>
        </div>
      </div>

      {/* Category breakdown chips */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
          <div className="flex items-center justify-center gap-1 text-emerald-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Mastered</span>
          </div>
          <span className="text-base font-semibold text-emerald-900 font-mono mt-0.5 block">
            {masteredCount}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">1.0 weight</span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
          <div className="flex items-center justify-center gap-1 text-amber-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>In Progress</span>
          </div>
          <span className="text-base font-semibold text-amber-900 font-mono mt-0.5 block">
            {inProgressCount}
          </span>
          <span className="text-[10px] text-amber-700 font-medium">0.5 weight</span>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60">
          <div className="flex items-center justify-center gap-1 text-rose-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Untouched</span>
          </div>
          <span className="text-base font-semibold text-rose-900 font-mono mt-0.5 block">
            {untouchedCount}
          </span>
          <span className="text-[10px] text-rose-700 font-medium">0.0 weight</span>
        </div>
      </div>
    </div>
  );
}
