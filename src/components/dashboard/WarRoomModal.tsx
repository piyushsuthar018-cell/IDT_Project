'use client';

import React, { useState } from 'react';
import {
  X,
  Target,
  FileText,
  Download,
  CheckCircle2,
  Play,
  Clock,
  Sparkles
} from 'lucide-react';
import { Subject } from '@/types/academic';
import { mockWarRoomResources } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface WarRoomModalProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
}

const HIGH_YIELD_TOPICS = [
  { id: 't1', title: "Banker's Algorithm & Deadlock Avoidance", weight: 'High Yield (15%)', done: true },
  { id: 't2', title: 'Virtual Memory & Multi-Level Page Tables', weight: 'High Yield (20%)', done: true },
  { id: 't3', title: 'Page Replacement (LRU, FIFO, Clock Algo)', weight: 'High Yield (15%)', done: true },
  { id: 't4', title: 'CPU Scheduling (Round Robin, SRTF, Multilevel)', weight: 'Core (15%)', done: false },
  { id: 't5', title: 'Process Synchronization & Semaphores (Dining Philosophers)', weight: 'Core (20%)', done: false },
  { id: 't6', title: 'UNIX Inode File System Structure & Disk I/O (SCAN/C-LOOK)', weight: 'Moderate (15%)', done: false },
];

export function WarRoomModal({ subject, isOpen, onClose }: WarRoomModalProps) {
  const [topics, setTopics] = useState(HIGH_YIELD_TOPICS);
  const [activeTab, setActiveTab] = useState<'checklist' | 'resources' | 'strategy'>('checklist');

  if (!isOpen || !subject) return null;

  const toggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedTopicsCount = topics.filter((t) => t.done).length;
  const readinessPercent = Math.round((completedTopicsCount / topics.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-semibold">
                  <Target className="h-3.5 w-3.5" />
                  Exam Preparation Cockpit
                </span>
                <span className="text-xs font-mono font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {subject.code}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight pt-1">
                {subject.name} — {subject.nextExamTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {subject.instructor ? `Instructor: ${subject.instructor} • ` : ''}Target Exam in {subject.daysUntilExam} Days
                {subject.room ? ` • ${subject.room}` : ''}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Target Grade</span>
              <p className="text-sm font-semibold text-slate-900">Grade A+ (95%)</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Readiness Score</span>
              <p className="text-sm font-semibold text-indigo-600">
                {readinessPercent}% Ready
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500">High-Yield Topics</span>
              <p className="text-sm font-semibold text-slate-900">
                {completedTopicsCount} of {topics.length} Mastered
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Time to Exam</span>
              <p className="text-sm font-semibold text-amber-700">
                {subject.daysUntilExam} Days Remaining
              </p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-1.5 mt-4 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('checklist')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeTab === 'checklist'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              High-Yield Checklist ({completedTopicsCount}/{topics.length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeTab === 'resources'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              Formula Sheets & Papers (3)
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeTab === 'strategy'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              Revision Protocol
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Core Topics for Maximum Exam Marks
                </h4>
                <span className="text-xs text-slate-400">Click to toggle completion</span>
              </div>

              <div className="space-y-2">
                {topics.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer',
                      t.done
                        ? 'bg-slate-50/60 border-slate-100 text-slate-400'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-colors',
                          t.done
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        )}
                      >
                        {t.done && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <span
                        className={cn(
                          'text-xs sm:text-sm font-medium text-slate-800',
                          t.done && 'line-through text-slate-400'
                        )}
                      >
                        {t.title}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'text-[11px] font-medium px-2 py-0.5 rounded-md border',
                        t.weight.includes('High')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      )}
                    >
                      {t.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Curated Preparation Assets for {subject.code}
              </h4>
              <div className="space-y-2">
                {mockWarRoomResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-medium text-slate-900">{res.title}</h5>
                        <p className="text-[11px] text-slate-400">
                          {res.format} • {res.fileSize} • Updated {res.updatedAt}
                        </p>
                      </div>
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-indigo-50/60 p-4 border border-indigo-100">
                <h5 className="font-semibold text-xs text-indigo-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  3-Day Accelerated Revision Protocol
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on past examination papers first to identify numerical problem types (e.g. Banker&apos;s algorithm allocation matrices and multi-level page tables).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-indigo-600">Day 1 (Today)</span>
                  <h6 className="text-xs font-medium text-slate-900">Virtual Memory & Paging</h6>
                  <p className="text-[11px] text-slate-500">Review formulas + solve 5 numerical exercises</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-indigo-600">Day 2 (Tomorrow)</span>
                  <h6 className="text-xs font-medium text-slate-900">Deadlocks & Scheduling</h6>
                  <p className="text-[11px] text-slate-500">Solve 2023 & 2024 End-Term Section B</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-indigo-600">Day 3 (Final Sprint)</span>
                  <h6 className="text-xs font-medium text-slate-900">Timed Mock Exam</h6>
                  <p className="text-[11px] text-slate-500">2-hour mock test under real exam conditions</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            Progress saved to semester profile
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Close
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            >
              <Play className="h-3 w-3 fill-current" />
              Start Study Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
