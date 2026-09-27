'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  BookOpen,
  Maximize2,
  Sparkles,
  Layers,
  Terminal,
  Clock
} from 'lucide-react';
import { Resource } from '@/types/academic';
import { cn } from '@/lib/utils';

interface ResourcePreviewModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResourcePreviewModal({
  resource,
  isOpen,
  onClose,
}: ResourcePreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen || !resource) return null;

  const isCode = resource.type === 'code' || ['PY', 'CPP', 'SQL', 'C'].includes(resource.format);
  const lines = resource.codeSnippet ? resource.codeSnippet.trim().split('\n') : [];

  const handleCopy = async () => {
    if (resource.codeSnippet) {
      try {
        await navigator.clipboard.writeText(resource.codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative z-10 w-full flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden transition-all duration-200 animate-in fade-in',
          isFullScreen ? 'max-w-6xl h-[95vh]' : 'max-w-4xl max-h-[90vh]'
        )}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs shrink-0">
              {isCode ? <FileCode className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {resource.subjectCode}
                </span>
                {resource.unitNumber && (
                  <span className="text-[11px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Unit {resource.unitNumber}
                  </span>
                )}
                <span className="text-xs font-mono font-semibold text-indigo-700 uppercase">
                  {resource.format}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate mt-0.5">
                {resource.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCode && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:inline"
              title={isFullScreen ? 'Exit full screen' : 'Expand full screen'}
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* CODE VIEWER */}
          {isCode ? (
            <div className="space-y-4">
              {/* Syntax highlighted code block */}
              <div className="rounded-xl border border-slate-200 bg-slate-950 text-slate-100 overflow-hidden shadow-xs">
                {/* File status ribbon */}
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{resource.title.split(' ')[0]}</span>
                    <span>•</span>
                    <span>{lines.length} lines</span>
                  </div>
                  {resource.complexity && (
                    <span className="text-amber-300">Complexity: {resource.complexity}</span>
                  )}
                </div>

                {/* Line numbered code area */}
                <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-[420px] select-text">
                  <table className="w-full border-collapse">
                    <tbody>
                      {lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60">
                          <td className="pr-4 py-0.5 text-right text-slate-600 select-none w-10 text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-0.5 text-slate-200 whitespace-pre">
                            {line}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Concepts / Exam Relevance Drawer */}
              {resource.keyConcepts && (
                <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4 space-y-1">
                  <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    Exam Relevance & Key Concepts
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {resource.keyConcepts}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* DOCUMENT / FORMULA PREVIEW */
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 text-center">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{resource.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified Academic Resource • {resource.pageCount || 10} Pages • {resource.fileSize}
                  </p>
                </div>

                {resource.keyConcepts && (
                  <p className="text-xs text-slate-600 max-w-lg mx-auto bg-white p-3 rounded-lg border border-slate-200/80">
                    {resource.keyConcepts}
                  </p>
                )}
              </div>

              {/* Table of Contents & Structure */}
              {resource.tableOfContents && resource.tableOfContents.length > 0 && (
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-3">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Table of Contents & Core Formulas
                  </h5>
                  <div className="space-y-2">
                    {resource.tableOfContents.map((section, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-800"
                      >
                        <span className="font-medium">{section}</span>
                        <span className="text-[11px] text-slate-400">Section {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {resource.format} • {resource.fileSize} • Last updated {resource.updatedAt}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Close
            </button>

            <a
              href={resource.downloadUrl || '#'}
              download
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
