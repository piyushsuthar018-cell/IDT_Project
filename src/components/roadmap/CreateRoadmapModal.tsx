'use client';

import React, { useState } from 'react';
import { X, Calendar, Sparkles, Check, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { Subject } from '@/types/academic';
import { cn } from '@/lib/utils';

interface CreateRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectId?: string;
  onCreateRoadmap: (
    subjectId: string,
    examDate: string,
    preparationLevel: 'full_review' | 'refresher'
  ) => void;
}

export function CreateRoadmapModal({
  isOpen,
  onClose,
  subjects,
  initialSubjectId,
  onCreateRoadmap,
}: CreateRoadmapModalProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || (subjects.length > 0 ? subjects[0].id : '')
  );
  const [examDate, setExamDate] = useState<string>('2026-09-23');
  const [prepLevel, setPrepLevel] = useState<'full_review' | 'refresher'>('full_review');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !examDate) return;
    onCreateRoadmap(selectedSubjectId, examDate, prepLevel);
    onClose();
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Generate 3-Phase Exam Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Reverse-engineer your remaining days into structured study milestones
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
          {/* Target Subject Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Target Course / Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.name} (Exam in {sub.daysUntilExam}d)
                </option>
              ))}
            </select>
          </div>

          {/* Exam Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Target Assessment Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              StudyPulse calculates backwards from this deadline date to generate daily revision phases.
            </p>
          </div>

          {/* Preparation Intensity Level */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 block">
              Preparation Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPrepLevel('full_review')}
                className={cn(
                  'text-left p-3 rounded-xl border transition-all',
                  prepLevel === 'full_review'
                    ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Full Concept Review</span>
                  {prepLevel === 'full_review' && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Deep dive into core syllabus definitions, textbook theorems, and comprehensive lab tracing.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPrepLevel('refresher')}
                className={cn(
                  'text-left p-3 rounded-xl border transition-all',
                  prepLevel === 'refresher'
                    ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Quick Refresher</span>
                  {prepLevel === 'refresher' && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  High-speed formula recall, PYQ speed drills, and targeted weak spot elimination.
                </p>
              </button>
            </div>
          </div>

          {/* Mathematical partitioning notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              Automated Backwards Partitioning:
            </div>
            <p className="text-slate-500 leading-relaxed">
              • <strong>Phase 1 (50% Days)</strong>: Foundation pass & syllabus matrix review
              <br />
              • <strong>Phase 2 (30% Days)</strong>: Active practice & laboratory implementations
              <br />
              • <strong>Phase 3 (20% Days)</strong>: Timed PYQs & formula memorization
            </p>
          </div>

          {/* Actions */}
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
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>Calculate & Save Roadmap</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
