'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Calendar,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { message: string; deadlinesCreated: number }) => void;
}

export function CalendarImportModal({
  isOpen,
  onClose,
  onSuccess,
}: CalendarImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [semesterName, setSemesterName] = useState('Semester 4 — CS & Engineering');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleUseStandardTemplate = () => {
    const dummyFile = new File(
      ['University Academic Calendar: Mid-Sem and Final Exams Schedule'],
      'University_Academic_Calendar_2026.pdf',
      { type: 'application/pdf' }
    );
    setFile(dummyFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('semesterName', semesterName);

      const res = await fetch('/api/ingestion/calendar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to ingest academic calendar');
        return;
      }

      onSuccess({
        message: data.message,
        deadlinesCreated: data.deadlinesCreated,
      });
      onClose();
    } catch (err: any) {
      console.error('Calendar Ingestion Error:', err);
      setErrorMessage(err.message || 'An error occurred while importing your calendar.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Academic Calendar Onboarding
              </h3>
              <p className="text-xs text-slate-500">
                Lock in university exam dates, holiday blocks, and assessment milestones
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
          {/* Semester Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Academic Term / Program
            </label>
            <input
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              University Calendar Document (PDF or Image)
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
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-1">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-800">{file.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • Click or drop to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 shadow-2xs">
                    <UploadCloud className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      Drop university calendar PDF here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      or click to browse files from your computer
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-400">No file right now?</span>
              <button
                type="button"
                onClick={handleUseStandardTemplate}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Use Standard B.Tech Calendar
              </button>
            </div>
          </div>

          {/* Automated Milestone Preview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Automated Timeline Mapping:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">Mid-Semester Week</span>
                <span className="font-semibold text-slate-800">~6 Weeks Out</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">End-Term Theory Exams</span>
                <span className="font-semibold text-indigo-600">~13 Weeks Out</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Dates will automatically populate the Deadlines Rail, countdown clocks, and Exam War Room triggers.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-0.5 flex-1">
                <span className="font-semibold block">Calendar Ingestion Error</span>
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
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
              disabled={isUploading}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>{isUploading ? 'Importing Schedule...' : 'Lock in Exam Dates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
