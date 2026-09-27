'use client';

import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Plus,
  Layers,
  Filter,
  PackageCheck,
  Star,
  Download,
  FileText
} from 'lucide-react';
import { useAcademic } from '@/context/AcademicContext';
import { Resource, ResourceType, Subject } from '@/types/academic';
import { ResourceCard } from '@/components/locker/ResourceCard';
import { ResourcePreviewModal } from '@/components/locker/ResourcePreviewModal';
import { UploadDropzoneModal } from '@/components/locker/UploadDropzoneModal';
import { ExamBundleModal } from '@/components/locker/ExamBundleModal';
import { ChapterUploadModal } from '@/components/ingest/ChapterUploadModal';
import { cn } from '@/lib/utils';

type FilterChip = 'all' | 'notes' | 'pyq' | 'code' | 'formula';

export function DigitalLockerView() {
  const { resources, subjects, toggleStarResource, refreshData, triggerIngestionNotice } = useAcademic();

  const [activeChip, setActiveChip] = useState<FilterChip>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [isChapterIngestOpen, setIsChapterIngestOpen] = useState(false);

  const handlePreview = (res: Resource) => {
    setPreviewResource(res);
    setIsPreviewOpen(true);
  };

  // Filtered resources
  const filteredResources = resources.filter((res) => {
    // Subject filter
    if (selectedSubjectId !== 'all' && res.subjectId !== selectedSubjectId) {
      return false;
    }

    // Type filter
    if (activeChip === 'notes' && res.type !== 'note') return false;
    if (activeChip === 'pyq' && res.type !== 'past_paper') return false;
    if (activeChip === 'code' && res.type !== 'code' && !['PY', 'CPP', 'SQL', 'C'].includes(res.format)) return false;
    if (activeChip === 'formula' && res.type !== 'formula_sheet' && res.type !== 'cheatsheet') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchCode = res.subjectCode.toLowerCase().includes(q);
      const matchTag = res.tags.some((t) => t.toLowerCase().includes(q));
      const matchFormat = res.format.toLowerCase().includes(q);
      return matchTitle || matchCode || matchTag || matchFormat;
    }

    return true;
  });

  const selectedSubject =
    selectedSubjectId !== 'all'
      ? subjects.find((s) => s.id === selectedSubjectId) || subjects[0] || null
      : subjects[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-indigo-600" />
            Digital Academic Locker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Central repository for verified formula sheets, STEM lab code, past papers, and study summaries
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setIsChapterIngestOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>Drop Chapter PDF</span>
          </button>

          {selectedSubject && (
            <button
              onClick={() => setIsBundleOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            >
              <PackageCheck className="h-4 w-4 text-indigo-600" />
              <span>Export Exam Bundle</span>
            </button>
          )}

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, topics, or code (e.g., Banker's, OSPF, Python)..."
              className="w-full h-8.5 pl-8.5 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-slate-500 shrink-0">Course:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full md:w-56 h-8.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="all">All Enrolled Courses ({subjects.length})</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'notes', label: 'Lecture Notes (PDF)' },
            { id: 'pyq', label: 'Past Papers (PYQs)' },
            { id: 'code', label: 'STEM Lab Code' },
            { id: 'formula', label: 'Formula Sheets' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveChip(chip.id as FilterChip)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                activeChip === chip.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              )}
            >
              {chip.label}
            </button>
          ))}

          <span className="ml-auto text-xs text-slate-400 font-mono">
            {filteredResources.length} items found
          </span>
        </div>
      </div>

      {/* Resources Grid or Clean Dropzone Empty State */}
      {filteredResources.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300/80 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <FolderLock className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-semibold text-slate-800">Your Digital Locker is Empty</h4>
            <p className="text-xs text-slate-500">
              Upload verified formula sheets, STEM lab code implementations (Python, C++, SQL), or past university examination papers.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => setIsChapterIngestOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-300" />
              <span>Drop Chapter PDF (Auto-Map)</span>
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5 text-slate-400" />
              <span>+ Manual Upload</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onPreview={handlePreview}
              onToggleStar={toggleStarResource}
            />
          ))}
        </div>
      )}

      {/* Interactive Code / Document Preview Modal */}
      <ResourcePreviewModal
        resource={previewResource}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Simulated File Upload Dropzone Modal */}
      <UploadDropzoneModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultSubjectId={selectedSubjectId !== 'all' ? selectedSubjectId : undefined}
      />

      {/* Exam Quick-Bundle Modal */}
      <ExamBundleModal
        subject={selectedSubject}
        resources={resources}
        isOpen={isBundleOpen}
        onClose={() => setIsBundleOpen(false)}
      />

      {/* Progressive Chapter Ingestion Dropzone Modal */}
      <ChapterUploadModal
        isOpen={isChapterIngestOpen}
        onClose={() => setIsChapterIngestOpen(false)}
        subjects={subjects}
        initialSubjectId={selectedSubjectId !== 'all' ? selectedSubjectId : undefined}
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
