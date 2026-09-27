'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, X, ArrowRight, FolderLock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAcademic } from '@/context/AcademicContext';

export interface IngestionNotice {
  id: string;
  title: string;
  message: string;
  subjectId?: string;
  subjectCode?: string;
  unitNumber?: number;
  topicsAdded?: number;
}

interface IngestionToastProps {
  notice: IngestionNotice | null;
  onDismiss: () => void;
}

export function IngestionToast({ notice, onDismiss }: IngestionToastProps) {
  const { setActiveView } = useAcademic();
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 9000);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">{notice.title}</span>
                <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {notice.message}
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
          <Link
            href="/locker"
            onClick={() => {
              setActiveView('locker');
              onDismiss();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
          >
            <FolderLock className="h-3 w-3 text-slate-400" />
            <span>View in Locker</span>
          </Link>

          {notice.subjectId && (
            <Link
              href={`/war-room/${notice.subjectId}`}
              onClick={() => {
                setActiveView('war-room');
                onDismiss();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>Open War Room</span>
              <ArrowRight className="h-3 w-3 text-indigo-300" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
