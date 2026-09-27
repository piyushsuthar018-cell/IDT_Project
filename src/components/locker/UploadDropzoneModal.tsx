'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileCode,
  FileText,
  Check,
  Plus,
  FileCheck
} from 'lucide-react';
import { useAcademic } from '@/context/AcademicContext';
import { ResourceType } from '@/types/academic';
import { cn } from '@/lib/utils';

interface UploadDropzoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: string;
}

export function UploadDropzoneModal({
  isOpen,
  onClose,
  defaultSubjectId,
}: UploadDropzoneModalProps) {
  const { subjects, refreshData, triggerIngestionNotice } = useAcademic();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(defaultSubjectId || subjects[0]?.id || '');
  const [unitNumber, setUnitNumber] = useState('1');
  const [format, setFormat] = useState<'PDF' | 'PY' | 'CPP' | 'SQL'>('PDF');
  const [category, setCategory] = useState<ResourceType>('note');
  const [codeContent, setCodeContent] = useState('');
  const [tags, setTags] = useState('Notes, Core Concepts');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[_\-]+/g, ' ');
    if (!title.trim()) {
      setTitle(cleanName);
    }
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'py') setFormat('PY');
    else if (ext === 'cpp' || ext === 'c') setFormat('CPP');
    else if (ext === 'sql') setFormat('SQL');
    else setFormat('PDF');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !file) return;
    setIsSubmitting(true);

    try {
      const chosenSubject = subjects.find((s) => s.id === subjectId) || subjects[0] || null;
      const targetSubId = chosenSubject?.id || subjectId;

      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('title', title.trim() || file?.name || 'Academic Resource');
      if (targetSubId) {
        formData.append('subjectId', targetSubId);
      }
      formData.append('unitNumber', unitNumber);
      formData.append('format', format);
      formData.append('category', category);
      formData.append('tags', tags);
      if (codeContent.trim()) {
        formData.append('codeSnippet', codeContent.trim());
      }

      const res = await fetch('/api/ingestion/resource', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload resource');
      }

      await refreshData();
      triggerIngestionNotice({
        title: 'Resource Added to Locker',
        message: `"${data.resource.title}" is now connected to Study Copilot, War Room, and Quiz Generator.`,
        type: 'success',
      });

      setFile(null);
      setTitle('');
      onClose();
    } catch (err: any) {
      console.error('Resource upload failed:', err);
      alert(err.message || 'Failed to upload resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Upload to Digital Locker</h3>
            <p className="text-xs text-slate-500">Add course notes, chapter PDFs, formula sheets, or lab code</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Real Interactive Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50'
                : file
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.py,.cpp,.c,.sql,.txt,.md"
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
                  {(file.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <UploadCloud className="h-8 w-8 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  Drag and drop your chapter PDF or lecture file here, or click to browse
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports PDF, Python (.py), C++ (.cpp), SQL scripts up to 25 MB
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Document / Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 1: Data Structures Overview & Asymptotic Bounds"
              className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/60 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Target Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/60"
              >
                {subjects.length === 0 ? (
                  <option value="">General Engineering / All Courses</option>
                ) : (
                  subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} ({sub.name})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Curriculum Unit</label>
              <select
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/60"
              >
                {[1, 2, 3, 4, 5].map((u) => (
                  <option key={u} value={u}>
                    Unit {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/60"
              >
                <option value="PDF">PDF Document</option>
                <option value="PY">Python (.py)</option>
                <option value="CPP">C++ (.cpp)</option>
                <option value="SQL">SQL Script (.sql)</option>
              </select>
            </div>
          </div>

          {/* Optional Code Snippet Area */}
          {(format === 'PY' || format === 'CPP' || format === 'SQL') && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Code Snippet (Optional if no file attached)</label>
              <textarea
                rows={4}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="// Paste code snippet here for syntax highlighting & AI analysis..."
                className="w-full p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Notes, Exam Prep, Algorithms"
              className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Uploading...' : 'Save & Connect to Copilot'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
