'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { useAcademic } from '@/context/AcademicContext';
import { AddDeadlineModal } from '@/components/modals/AddDeadlineModal';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const { deadlines, subjects, createDeadline } = useAcademic();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            Assessment Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Timeline of scheduled mid-terms, end-terms, quizzes, and submission milestones
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Timeline Schedule Cards or Empty State */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-900">Scheduled Milestones</h3>
          <span className="text-xs text-slate-400 font-mono">{deadlines.length} total scheduled</span>
        </div>

        {deadlines.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">
                All caught up! No upcoming deadlines.
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Register an assignment, test, or quiz to track due dates.
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register First Deadline</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {deadlines.map((d) => (
              <div
                key={d.id}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-colors',
                  d.status === 'submitted'
                    ? 'bg-slate-50/60 border-slate-100 opacity-75'
                    : d.urgencyLevel === 'urgent'
                    ? 'bg-rose-50/40 border-rose-200/80'
                    : d.urgencyLevel === 'soon'
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                )}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg text-xs font-mono font-medium',
                      d.status === 'submitted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.urgencyLevel === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : d.urgencyLevel === 'soon'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-800'
                    )}
                  >
                    {d.subjectCode}
                  </div>

                  <div>
                    <h4
                      className={cn(
                        'font-medium text-sm text-slate-900',
                        d.status === 'submitted' && 'line-through text-slate-400'
                      )}
                    >
                      {d.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {d.subjectName} • Weight: {d.weightPercentage}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-600 self-end sm:self-auto">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(d.dueDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-medium uppercase',
                      d.status === 'submitted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : d.urgencyLevel === 'urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : d.urgencyLevel === 'soon'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {d.status === 'submitted' ? 'submitted' : d.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Add Deadline Modal */}
      <AddDeadlineModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        subjects={subjects}
        onCreateDeadline={createDeadline}
      />
    </div>
  );
}
