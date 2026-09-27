'use client';

import React from 'react';
import {
  Calendar,
  FileText,
  FlaskConical,
  FileCode,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Subject } from '@/types/academic';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  subject: Subject;
  onEnterWarRoom?: (subject: Subject) => void;
  onViewResources?: (subject: Subject) => void;
}

export function SubjectCard({ subject, onEnterWarRoom, onViewResources }: SubjectCardProps) {
  const isImminent = subject.daysUntilExam <= 5;

  const formattedExamDate = new Date(subject.nextExamDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
      {/* 3px Left Border Color Accent */}
      <span
        className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
        style={{ backgroundColor: subject.color }}
      />

      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-2 mb-2.5 pl-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {subject.code}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {subject.creditHours} Credits
            </span>
          </div>

          {/* Exam status pill */}
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border',
              isImminent
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            )}
          >
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>
              {isImminent ? `Exam in ${subject.daysUntilExam}d` : formattedExamDate}
            </span>
          </div>
        </div>

        {/* Subject Name & Instructor */}
        <div className="pl-2">
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            {subject.name}
          </h3>
          {subject.instructor || subject.room ? (
            <p className="text-xs text-slate-500 mt-0.5">
              {[subject.instructor, subject.room].filter(Boolean).join(' • ')}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">Self-paced course</p>
          )}

          {/* Next Exam Pill */}
          <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Next Assessment:</span>
            <span className="font-medium text-slate-800 truncate ml-2">
              {subject.nextExamTitle}
            </span>
          </div>

          {/* Readiness Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Readiness</span>
              <span className="font-semibold text-slate-900">
                {subject.readinessScore}% Ready
              </span>
            </div>

            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${subject.readinessScore}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Syllabus Covered</span>
              <span className="text-slate-600 font-medium">
                {subject.syllabusTopics.completed} of {subject.syllabusTopics.total} topics
              </span>
            </div>
          </div>

          {/* Quick Resource Counters */}
          <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-800 block">
                {subject.resources.notesCount}
              </span>
              <span className="text-[10px] text-slate-400">Notes</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-800 block">
                {subject.resources.labsCount}
              </span>
              <span className="text-[10px] text-slate-400">Labs</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-800 block">
                {subject.resources.pastPapersCount}
              </span>
              <span className="text-[10px] text-slate-400">PYQs</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-800 block">
                {subject.resources.slidesCount}
              </span>
              <span className="text-[10px] text-slate-400">Slides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 pl-2">
        <button
          onClick={() => onViewResources?.(subject)}
          className="flex-1 py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200/80 transition-colors text-center"
        >
          Resources
        </button>

        <button
          onClick={() => onEnterWarRoom?.(subject)}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1',
            isImminent
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          )}
        >
          <span>{isImminent ? 'War Room' : 'Exam Plan'}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
