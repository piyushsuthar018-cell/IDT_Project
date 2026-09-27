'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, FileText, Download, CheckCircle2, Clock, ArrowRight, Calendar, Upload } from 'lucide-react';
import { Subject } from '@/types/academic';
import { useAcademic } from '@/context/AcademicContext';
import { mockWarRoomResources } from '@/data/mockData';
import { ExamWarRoomBanner } from '@/components/dashboard/ExamWarRoomBanner';
import { CalendarImportModal } from '@/components/ingest/CalendarImportModal';
import { ChapterUploadModal } from '@/components/ingest/ChapterUploadModal';

interface WarRoomDedicatedViewProps {
  onEnterWarRoom: (subject: Subject) => void;
  onOpenCalendarImport?: () => void;
  onOpenChapterUpload?: () => void;
}

export function WarRoomDedicatedView({
  onEnterWarRoom,
  onOpenCalendarImport,
  onOpenChapterUpload,
}: WarRoomDedicatedViewProps) {
  const { subjects, refreshData, triggerIngestionNotice } = useAcademic();
  const [isLocalCalendarOpen, setIsLocalCalendarOpen] = useState(false);
  const [isLocalChapterOpen, setIsLocalChapterOpen] = useState(false);

  const targetSubject = subjects.find((s) => s.daysUntilExam <= 14 && s.daysUntilExam > 0) || subjects[0];

  // Empty state guard for zero-subject safety
  if (!targetSubject || subjects.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              Exam Preparation Command Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Active revision cockpit and interactive syllabus matrix for approaching exams
          </p>
        </div>

        {/* Clean, calm empty-state card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-10 sm:p-14 text-center shadow-xs space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-200">
            <Target className="h-7 w-7 text-indigo-500" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Exam War Room Offline
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              No active courses scheduled. Import your academic calendar or drop a chapter PDF to activate your first War Room.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onOpenCalendarImport) {
                  onOpenCalendarImport();
                } else {
                  setIsLocalCalendarOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-indigo-300" />
              <span>+ Ingest Calendar / Notes</span>
            </button>
            <button
              onClick={() => {
                if (onOpenChapterUpload) {
                  onOpenChapterUpload();
                } else {
                  setIsLocalChapterOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Upload className="h-4 w-4 text-slate-500" />
              <span>Drop Chapter PDF</span>
            </button>
          </div>
        </div>

        {/* Ingestion Modals */}
        <CalendarImportModal
          isOpen={isLocalCalendarOpen}
          onClose={() => setIsLocalCalendarOpen(false)}
          onSuccess={(data) => {
            refreshData();
            triggerIngestionNotice({
              title: 'Academic Calendar Synced',
              message: data.message,
            });
          }}
        />

        <ChapterUploadModal
          isOpen={isLocalChapterOpen}
          onClose={() => setIsLocalChapterOpen(false)}
          subjects={subjects}
          onSuccess={(data) => {
            refreshData();
            triggerIngestionNotice({
              title: 'Chapter Ingested & Mapped',
              message: data.message,
              subjectId: data.subjectId,
              subjectCode: data.subjectCode,
              unitNumber: data.unitNumber,
              topicsAdded: data.topicsAdded,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              Exam Preparation Command Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Active revision cockpit and interactive syllabus matrix for approaching exams
          </p>
        </div>

        {targetSubject?.id && (
          <Link
            href={`/war-room/${targetSubject.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs self-start sm:self-auto"
          >
            <span>Open Full War Room Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Main War Room Hero Card */}
      <ExamWarRoomBanner
        urgentSubject={targetSubject}
        onEnterWarRoom={onEnterWarRoom}
      />

      {/* Deep Dive Study Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
            <Target className="h-4 w-4 text-indigo-600" />
            Core High-Yield Focus (40% Marks)
          </div>
          <p className="text-xs text-slate-500">
            Historically highest frequency topics across recent examination sessions.
          </p>
          <div className="space-y-1.5 pt-1">
            {[
              "Banker's Algorithm & Resource Allocation Graph",
              'Virtual Memory Page Replacement (LRU/Clock)',
              'Multi-Level Feedback Queue Scheduling',
            ].map((topic, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                • {topic}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
            <FileText className="h-4 w-4 text-indigo-600" />
            Formula Cheatsheets & PYQs
          </div>
          <p className="text-xs text-slate-500">
            Quick-access formula deck and 2023-2024 solutions.
          </p>
          <div className="space-y-1.5 pt-1">
            {mockWarRoomResources.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="truncate mr-2">{r.title}</span>
                <Download className="h-3.5 w-3.5 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Readiness Checklist
          </div>
          <p className="text-xs text-slate-500">
            Recommended revision milestones prior to sitting the exam.
          </p>
          <div className="space-y-1.5 pt-1 text-xs text-slate-700">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Formula review complete
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              2023 End-Term Solved
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-amber-800">
              <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              Timed Mock Exam pending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export alias for compatibility
export { WarRoomDedicatedView as WarRoomDedicatedSection };
