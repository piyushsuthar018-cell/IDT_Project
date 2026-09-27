'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  UploadCloud,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Subject } from '@/types/academic';
import { cn } from '@/lib/utils';

interface ChapterUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectId?: string;
  onSuccess: (data: {
    message: string;
    subjectId: string;
    subjectCode: string;
    unitNumber: number;
    topicsAdded: number;
  }) => void;
}

export function ChapterUploadModal({
  isOpen,
  onClose,
  subjects,
  initialSubjectId,
  onSuccess,
}: ChapterUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || 'auto');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sampleFilename: string) => {
    const sampleBlob = new Blob(
      [`Sample Lecture PDF Content for ${sampleFilename}. Generated for StudyPulse progressive ingestion.`],
      { type: 'application/pdf' }
    );
    const sampleFile = new File([sampleBlob], sampleFilename, { type: 'application/pdf' });
    setFile(sampleFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please drop or select a chapter PDF file.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedSubjectId !== 'auto') {
        formData.append('subjectId', selectedSubjectId);
      }

      const res = await fetch('/api/ingestion/chapter', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to ingest chapter document');
      }

      onSuccess({
        message: data.message,
        subjectId: data.subject.id,
        subjectCode: data.subject.code,
        unitNumber: data.unit.unitNumber,
        topicsAdded: data.topicsAdded,
      });

      setFile(null);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while uploading the chapter.');
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
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Progressive Chapter Ingestion
              </h3>
              <p className="text-xs text-slate-500">
                Drop chapter PDFs to auto-extract units and map subtopics to your Readiness Matrix
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
              Assign Course
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            >
              <option value="auto">✨ Auto-Detect Course from Document</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Chapter / Lecture Document (PDF) *
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center',
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : file
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-1">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{file.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 shadow-2xs">
                    <UploadCloud className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      Drop lecture or chapter PDF here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      e.g. DSA_Unit1_Primitive_Types.pdf, OS_Unit2_Virtual_Memory.pdf
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Demo Sample Files */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500 block">
              Quick Test: Try a realistic engineering chapter:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectSample('DSA_Unit1_Primitive_Types.pdf')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 transition-colors"
              >
                DSA_Unit1_Primitive_Types.pdf
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('OS_Unit2_Virtual_Memory_Paging.pdf')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 transition-colors"
              >
                OS_Unit2_Virtual_Memory.pdf
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('DBMS_Unit3_Transactions_2PL.pdf')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 transition-colors"
              >
                DBMS_Unit3_Transactions.pdf
              </button>
            </div>
          </div>

          {/* Automated Ingestion Details */}
          <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-indigo-900 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>What happens upon ingestion:</span>
            </div>
            <ul className="text-slate-500 list-disc list-inside space-y-0.5">
              <li>Auto-detects course and creates unit (e.g. Unit 1)</li>
              <li>Maps 4 core subtopics into the <strong>Syllabus Matrix</strong> (🔴 Untouched)</li>
              <li>Catalogs document into <strong>Digital Locker</strong> under respective subject</li>
              <li>Recalculates syllabus completion percentage across your dashboard</li>
            </ul>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
              disabled={isSubmitting || !file}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>{isSubmitting ? 'Ingesting Document...' : 'Ingest Chapter PDF'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
