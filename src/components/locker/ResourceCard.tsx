'use client';

import React from 'react';
import {
  FileText,
  FileCode,
  Download,
  Eye,
  Star,
  Layers,
  BookOpen
} from 'lucide-react';
import { Resource } from '@/types/academic';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  onPreview: (resource: Resource) => void;
  onToggleStar: (id: string) => void;
}

export function ResourceCard({ resource, onPreview, onToggleStar }: ResourceCardProps) {
  const isCode = resource.type === 'code' || ['PY', 'CPP', 'SQL', 'C'].includes(resource.format);

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'PY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CPP':
      case 'C':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SQL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PDF':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all">
      <div>
        {/* Top Header: Code/Doc Format pill & Star toggle */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border uppercase',
                getFormatBadge(resource.format)
              )}
            >
              {resource.format}
            </span>

            <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {resource.subjectCode}
            </span>

            {resource.unitNumber && (
              <span className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                Unit {resource.unitNumber}
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleStar(resource.id)}
            className="p-1 rounded-md text-slate-400 hover:text-amber-500 transition-colors"
            title={resource.isStarred ? 'Unstar resource' : 'Star resource'}
          >
            <Star
              className={cn(
                'h-4 w-4',
                resource.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-slate-500'
              )}
            />
          </button>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
          {resource.title}
        </h4>

        {/* Sub-metadata or Complexity */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {resource.complexity && (
            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-1.5 py-0.2 rounded">
              {resource.complexity}
            </span>
          )}

          {resource.pageCount && (
            <span className="text-[11px] text-slate-400">
              {resource.pageCount} pages
            </span>
          )}

          {resource.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.2 rounded"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: File size & Action buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 font-mono">
          {resource.fileSize} • {resource.updatedAt}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(resource)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
          >
            {isCode ? <FileCode className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>Preview</span>
          </button>

          <a
            href={resource.downloadUrl || '#'}
            download
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title="Download file"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
