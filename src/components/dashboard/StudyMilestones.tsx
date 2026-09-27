'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Trophy,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { StudyMilestone } from '@/types/academic';
import { cn } from '@/lib/utils';

interface StudyMilestonesProps {
  initialMilestones: StudyMilestone[];
  onQuickFocus?: (milestone: StudyMilestone) => void;
}

export function StudyMilestones({ initialMilestones, onQuickFocus }: StudyMilestonesProps) {
  const [milestones, setMilestones] = useState<StudyMilestone[]>(initialMilestones);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 500);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header & Refresh */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ListTodo className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 tracking-tight">
                Daily Study Milestones
              </h3>
              <p className="text-xs text-slate-500">
                Auto-prioritized revision tasks targeting approaching exams
              </p>
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Refresh recommendations"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isRegenerating && 'animate-spin text-indigo-600')} />
          </button>
        </div>

        {/* Progress Bar & Pace */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-600">Daily Pace</span>
            <span className="font-medium text-slate-900">
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {progressPercent === 100 && (
            <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-emerald-600" />
              <span>All daily milestones completed. Excellent progress!</span>
            </div>
          )}
        </div>

        {/* Checkbox List */}
        <div className="mt-3 space-y-2">
          {milestones.map((milestone) => {
            const isDone = milestone.completed;

            return (
              <div
                key={milestone.id}
                onClick={() => toggleMilestone(milestone.id)}
                className={cn(
                  'group flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer',
                  isDone
                    ? 'bg-slate-50/50 border-slate-100 opacity-60'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                )}
              >
                {/* Notion-style Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMilestone(milestone.id);
                  }}
                  className={cn(
                    'mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors',
                    isDone
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  )}
                  aria-label={isDone ? 'Mark uncompleted' : 'Mark completed'}
                >
                  {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>

                {/* Milestone Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {milestone.subjectCode}
                    </span>

                    {milestone.topicTag && (
                      <span className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-100">
                        {milestone.topicTag}
                      </span>
                    )}

                    <span
                      className={cn(
                        'text-[10px] font-medium px-1.5 py-0.2 rounded-md',
                        milestone.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {milestone.priority}
                    </span>
                  </div>

                  <p
                    className={cn(
                      'text-xs sm:text-sm font-medium text-slate-800 transition-colors leading-snug',
                      isDone && 'line-through text-slate-400'
                    )}
                  >
                    {milestone.title}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {milestone.estimatedMinutes} mins
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickFocus?.(milestone);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span>Start focus</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Study Tip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Suggested: 45 min focused study blocks</span>
        <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
          Pomodoro Mode &rarr;
        </span>
      </div>
    </div>
  );
}
