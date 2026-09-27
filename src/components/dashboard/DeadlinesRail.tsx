'use client';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Deadline, UrgencyLevel } from '@/types/academic';
import { cn } from '@/lib/utils';

interface DeadlinesRailProps {
  deadlines: Deadline[];
  onToggleStatus?: (id: string) => void;
  onOpenAddDeadline?: () => void;
}

export function DeadlinesRail({
  deadlines,
  onToggleStatus,
  onOpenAddDeadline,
}: DeadlinesRailProps) {
  const [filter, setFilter] = useState<'all' | 'exam' | 'assignment'>('all');

  const filteredItems = deadlines.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'exam') return d.type === 'exam' || d.type === 'quiz';
    if (filter === 'assignment') return d.type === 'assignment' || d.type === 'lab_report' || d.type === 'project';
    return true;
  });

  const getUrgencyBadge = (urgency: UrgencyLevel, isSubmitted?: boolean) => {
    if (isSubmitted) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/80">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Submitted
        </span>
      );
    }

    switch (urgency) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200/80">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            &lt; 48 Hours
          </span>
        );
      case 'soon':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/80">
            <Clock className="h-3 w-3 text-amber-600" />
            &lt; 5 Days
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/60">
            <Calendar className="h-3 w-3 text-slate-400" />
            Upcoming
          </span>
        );
    }
  };

  const formatDueTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col h-full">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-slate-900 tracking-tight">
              Deadlines & Assessments
            </h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
              {filteredItems.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized by urgency and grade weight contribution
          </p>
        </div>

        {/* Action button & Filter Tabs */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenAddDeadline && (
            <button
              onClick={onOpenAddDeadline}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Deadline</span>
            </button>
          )}

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors',
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('exam')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors',
                filter === 'exam'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Exams
            </button>
            <button
              onClick={() => setFilter('assignment')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors',
                filter === 'assignment'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Labs
            </button>
          </div>
        </div>
      </div>

      {/* Deadlines List or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 min-h-[200px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">
              All caught up! No upcoming deadlines.
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              You have no pending assignments or exams scheduled.
            </p>
          </div>
          {onOpenAddDeadline && (
            <button
              onClick={onOpenAddDeadline}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Deadline</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-2 pt-3.5 overflow-y-auto max-h-[460px] pr-1">
          {filteredItems.map((item) => {
            const isSubmitted = item.status === 'submitted';

            return (
              <div
                key={item.id}
                className={cn(
                  'group rounded-xl border p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                  isSubmitted
                    ? 'bg-slate-50/60 border-slate-100 opacity-75'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/40'
                )}
              >
                {/* Left Side: Checkbox & Item Info */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleStatus?.(item.id)}
                    className={cn(
                      'mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors',
                      isSubmitted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    )}
                    title={isSubmitted ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {isSubmitted && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-medium px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.subjectCode}
                      </span>

                      {getUrgencyBadge(item.urgencyLevel, isSubmitted)}

                      <span className="text-[11px] text-slate-400">
                        Weight: {item.weightPercentage}%
                      </span>
                    </div>

                    <h4
                      className={cn(
                        'text-xs sm:text-sm font-medium text-slate-800 transition-colors',
                        isSubmitted && 'line-through text-slate-400'
                      )}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Right Side: Due Date */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono sm:text-right shrink-0">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>{formatDueTime(item.dueDate)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
