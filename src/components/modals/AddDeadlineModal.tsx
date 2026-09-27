'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Subject } from '@/types/academic';
import { cn } from '@/lib/utils';

interface AddDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectId?: string;
  onCreateDeadline: (data: {
    subjectId: string;
    title: string;
    type?: string;
    dueDate: string;
  }) => Promise<void>;
}

export function AddDeadlineModal({
  isOpen,
  onClose,
  subjects,
  initialSubjectId,
  onCreateDeadline,
}: AddDeadlineModalProps) {
  const [subjectId, setSubjectId] = useState(
    initialSubjectId || (subjects.length > 0 ? subjects[0].id : '')
  );
  const [title, setTitle] = useState('');
  const [type, setType] = useState('assignment');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !title || !dueDate) return;

    setIsSubmitting(true);
    try {
      await onCreateDeadline({
        subjectId,
        title,
        type,
        dueDate: new Date(dueDate).toISOString(),
      });
      setTitle('');
      setDueDate('');
      setType('assignment');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Register New Deadline
              </h3>
              <p className="text-xs text-slate-500">
                Add an assignment, test, or lab assessment with due date tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Course */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Enrolled Course *
            </label>
            {subjects.length === 0 ? (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Please add a course first before registering deadlines.</span>
              </div>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Assessment Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Assessment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lab 4: Memory Simulation, Problem Set 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Type & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">
                Assessment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                <option value="assignment">Assignment / Problem Set</option>
                <option value="exam">Major Exam</option>
                <option value="lab_report">Lab Code / Report</option>
                <option value="quiz">Class Quiz</option>
                <option value="project">Course Project</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">
                Due Date & Time *
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Deadlines within 48 hours are automatically flagged as urgent (rose pill) on your dashboard rail.
          </p>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || subjects.length === 0}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>{isSubmitting ? 'Saving...' : 'Register Deadline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
