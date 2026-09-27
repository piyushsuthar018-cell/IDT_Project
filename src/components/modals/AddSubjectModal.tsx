'use client';

import React, { useState } from 'react';
import { X, BookPlus, Calendar, User, Sparkles, Check, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSubject: (data: {
    code: string;
    name: string;
    instructor: string;
    examDate?: string;
    color?: string;
  }) => Promise<void>;
}

const COLOR_OPTIONS = [
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-500' },
];

export function AddSubjectModal({
  isOpen,
  onClose,
  onCreateSubject,
}: AddSubjectModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [examDate, setExamDate] = useState('');
  const [color, setColor] = useState('indigo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    setIsSubmitting(true);
    try {
      await onCreateSubject({
        code,
        name,
        instructor: instructor.trim(),
        examDate: examDate || undefined,
        color,
      });
      // Reset form
      setCode('');
      setName('');
      setInstructor('');
      setExamDate('');
      setColor('indigo');
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BookPlus className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Enroll New Course
              </h3>
              <p className="text-xs text-slate-500">
                Add a new subject to track syllabus readiness and exam milestones
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Course Code */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-medium text-slate-700 block">
                Course Code *
              </label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="CS-401"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-9 pl-8 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all uppercase"
                />
              </div>
            </div>

            {/* Course Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-700 block">
                Course Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Systems"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Instructor */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Lead Instructor (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Dr. Leslie Lamport (Optional)"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Target Exam Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Scheduled Exam Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              StudyPulse will automatically trigger the Exam War Room when this assessment is &le; 5 days away.
            </p>
          </div>

          {/* Color Accent Picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 block">
              Color Tag
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  className={cn(
                    'h-7 w-7 rounded-lg flex items-center justify-center transition-all',
                    opt.bg,
                    color === opt.id ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' : 'opacity-80 hover:opacity-100'
                  )}
                  title={opt.label}
                >
                  {color === opt.id && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

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
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>{isSubmitting ? 'Adding Course...' : 'Add Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
