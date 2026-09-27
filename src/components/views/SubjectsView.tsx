'use client';

import React, { useState } from 'react';
import { Subject } from '@/types/academic';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { BookOpen, Plus, PackageCheck, RefreshCw } from 'lucide-react';
import { ExamBundleModal } from '@/components/locker/ExamBundleModal';
import { AddSubjectModal } from '@/components/modals/AddSubjectModal';
import { useAcademic } from '@/context/AcademicContext';

interface SubjectsViewProps {
  subjects: Subject[];
  onEnterWarRoom: (subject: Subject) => void;
}

export function SubjectsView({ subjects, onEnterWarRoom }: SubjectsViewProps) {
  const { resources, createSubject, resetDemoData } = useAcademic();
  const [bundleSubject, setBundleSubject] = useState<Subject | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Enrolled Course Load
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your semester curriculum, resources, faculty details, and exam preparation roadmaps
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {subjects.length > 0 && (
            <button
              onClick={() => setBundleSubject(subjects[0])}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            >
              <PackageCheck className="h-4 w-4 text-indigo-600" />
              <span>Export Exam Bundle</span>
            </button>
          )}

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center shadow-xs space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-base font-semibold text-slate-900">
              No Courses Added Yet
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enroll in your semester courses to start tracking syllabus units, formula sheets, and exam roadmaps.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-300" />
              <span>+ Add First Course</span>
            </button>

            <button
              onClick={() => resetDemoData()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span>Load Demo Courses</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEnterWarRoom={onEnterWarRoom}
              onViewResources={() => setBundleSubject(subject)}
            />
          ))}
        </div>
      )}

      {bundleSubject && (
        <ExamBundleModal
          subject={bundleSubject}
          resources={resources}
          isOpen={Boolean(bundleSubject)}
          onClose={() => setBundleSubject(null)}
        />
      )}

      {/* Manual Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreateSubject={createSubject}
      />
    </div>
  );
}
