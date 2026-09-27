'use client';

import React, { useState } from 'react';
import { ArrowUpDown, Plus, BookOpen, Sparkles, RefreshCw, FileText, Calendar } from 'lucide-react';
import { Subject } from '@/types/academic';
import { SubjectCard } from './SubjectCard';

interface SubjectsGridProps {
  subjects: Subject[];
  onEnterWarRoom?: (subject: Subject) => void;
  onViewResources?: (subject: Subject) => void;
  onOpenAddSubject?: () => void;
  onOpenCalendarImport?: () => void;
  onOpenChapterUpload?: () => void;
  onResetDemoData?: () => void;
}

type SortOption = 'readiness-asc' | 'readiness-desc' | 'exam-date' | 'name';

export function SubjectsGrid({
  subjects,
  onEnterWarRoom,
  onViewResources,
  onOpenAddSubject,
  onOpenCalendarImport,
  onOpenChapterUpload,
  onResetDemoData,
}: SubjectsGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('exam-date');

  const sortedSubjects = [...subjects].sort((a, b) => {
    switch (sortBy) {
      case 'readiness-desc':
        return b.readinessScore - a.readinessScore;
      case 'readiness-asc':
        return a.readinessScore - b.readinessScore;
      case 'exam-date':
        return a.daysUntilExam - b.daysUntilExam;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Header bar with total enrolled subjects, add action & sort selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base md:text-lg text-slate-900 tracking-tight">
              Active Courses
            </h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
              {subjects.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Syllabus coverage, resources, and exam readiness scores
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenChapterUpload && (
            <button
              onClick={onOpenChapterUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
              title="Ingest Chapter PDF"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Ingest Chapter</span>
            </button>
          )}

          {onOpenCalendarImport && (
            <button
              onClick={onOpenCalendarImport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
              title="Import Academic Calendar"
            >
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Import Calendar</span>
            </button>
          )}

          {onOpenAddSubject && (
            <button
              onClick={onOpenAddSubject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Course</span>
            </button>
          )}

          {subjects.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-slate-800 focus:outline-none cursor-pointer font-medium"
              >
                <option value="exam-date">Next Exam Date</option>
                <option value="readiness-desc">Readiness (High to Low)</option>
                <option value="readiness-asc">Readiness (Needs Attention)</option>
                <option value="name">Course Name</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Grid or Empty State */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-10 text-center shadow-xs space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-base font-semibold text-slate-900">
              No subjects enrolled yet
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No subjects enrolled yet. Drop a lecture PDF or syllabus to add your first course.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left pt-2">
            {onOpenCalendarImport && (
              <button
                onClick={onOpenCalendarImport}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/20 transition-all text-left space-y-1.5 group"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900">1. Import Calendar</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Drop university calendar to auto-lock mid-sem & end-term exam dates.
                </p>
              </button>
            )}

            {onOpenChapterUpload && (
              <button
                onClick={onOpenChapterUpload}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/20 transition-all text-left space-y-1.5 group"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900">2. Ingest Chapter PDF</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Drop chapter notes to auto-extract units and map untouched topics.
                </p>
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-slate-100">
            {onOpenAddSubject && (
              <button
                onClick={onOpenAddSubject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" />
                <span>Add Course Manually</span>
              </button>
            )}

            {onResetDemoData && (
              <button
                onClick={onResetDemoData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                <span>Load Demo Curriculum</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEnterWarRoom={onEnterWarRoom}
              onViewResources={onViewResources}
            />
          ))}
        </div>
      )}
    </div>
  );
}
