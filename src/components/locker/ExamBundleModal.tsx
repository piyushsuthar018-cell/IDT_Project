'use client';

import React from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Subject, Resource } from '@/types/academic';

interface ExamBundleModalProps {
  subject?: Subject | null;
  resources: Resource[];
  isOpen: boolean;
  onClose: () => void;
}

export function ExamBundleModal({
  subject,
  resources,
  isOpen,
  onClose,
}: ExamBundleModalProps) {
  if (!isOpen || !subject) return null;

  // Filter only Formula Sheets and Past Papers for this subject
  const bundleResources = resources.filter(
    (r) =>
      r.subjectId === subject?.id &&
      (r.type === 'formula_sheet' || r.type === 'past_paper' || r.type === 'cheatsheet')
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 print:p-0">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:h-auto animate-in fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                  {subject.code}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  Curated Revision Bundle
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                {subject.name} — Exam Quick-Bundle
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-0">
          {/* Printable Title Block */}
          <div className="border-b border-slate-200 pb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                StudyPulse Academic Repository • Official Exam Bundle
              </span>
              <span className="text-xs text-slate-400">
                Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {subject.name} ({subject.code}) — High-Yield Examination Dossier
            </h1>
            <p className="text-xs text-slate-600">
              Target: {subject.nextExamTitle} ({subject.examType})
              {subject.instructor ? ` • Instructor: ${subject.instructor}` : ''}
              {subject.room ? ` • Room: ${subject.room}` : ''}
            </p>
          </div>

          {/* Table of Collated Materials */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Included Materials ({bundleResources.length} Items)
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {bundleResources.map((res, idx) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Doc #{idx + 1}
                      </span>
                      <h5 className="text-sm font-semibold text-slate-900">{res.title}</h5>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {res.format} • {res.fileSize}
                    </span>
                  </div>

                  {res.keyConcepts && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      {res.keyConcepts}
                    </p>
                  )}

                  {res.tableOfContents && (
                    <div className="pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Table of Contents:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                        {res.tableOfContents.map((toc, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{toc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Study Strategy Note */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-1">
            <span className="text-xs font-semibold text-slate-800">
              Exam Hall Strategy:
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review Doc #1 formula sheets 24 hours prior. Practice the safe execution sequence algorithm from Doc #2 before entering the test hall.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            {bundleResources.length} high-yield documents bundled for {subject.code}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
