'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SyllabusUnit, SyllabusTopic, TopicStatus, Resource } from '@/types/academic';
import { mockWarRoomResources } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SyllabusMatrixProps {
  units: SyllabusUnit[];
  subjectId: string;
  onCycleTopic: (topicId: string) => void;
  onSetStatus: (topicId: string, status: TopicStatus) => void;
}

type MatrixFilter = 'all' | 'weak' | 'resources';

export function SyllabusMatrix({
  units,
  subjectId,
  onCycleTopic,
  onSetStatus,
}: SyllabusMatrixProps) {
  const [filter, setFilter] = useState<MatrixFilter>('all');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-2': true,
    'unit-3': true,
    'unit-4': true,
    'unit-5': true,
  });
  const [activeNotesTopic, setActiveNotesTopic] = useState<SyllabusTopic | null>(null);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 transition-colors">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Mastered
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 transition-colors">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
      case 'untouched':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 transition-colors">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Untouched / Weak
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-base text-slate-900 tracking-tight">
            Curriculum Breakdown & Mastery Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any topic badge to cycle status: 🔴 Untouched &rarr; 🟡 In Progress &rarr; 🟢 Mastered
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-colors',
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            All Topics
          </button>
          <button
            onClick={() => setFilter('weak')}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-colors',
              filter === 'weak'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Weak Spots Only
          </button>
          <button
            onClick={() => setFilter('resources')}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-colors',
              filter === 'resources'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Essential Formulas & PYQs
          </button>
        </div>
      </div>

      {/* View: Essential Formulas & PYQs */}
      {filter === 'resources' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700">
            <span className="font-semibold text-indigo-900 block mb-0.5">
              Verified High-Yield Academic Vault
            </span>
            Official formula sheets, solved university question papers, and concept summaries for rapid revision.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockWarRoomResources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {res.format}
                    </span>
                    <span className="text-[11px] text-slate-400">{res.fileSize}</span>
                  </div>

                  <h5 className="text-xs font-semibold text-slate-900 mb-2 leading-snug">
                    {res.title}
                  </h5>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {res.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.2 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Resource</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Topics Matrix (Units & Subtopics) */}
      {filter !== 'resources' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {units.map((unit) => {
            const isExpanded = expandedUnits[unit.id] ?? true;

            // Apply 'weak' filter if active
            const visibleTopics = filter === 'weak'
              ? unit.topics.filter((t) => t.status === 'untouched')
              : unit.topics;

            // Skip rendering empty unit if filtering for weak spots and all are mastered
            if (filter === 'weak' && visibleTopics.length === 0) {
              return null;
            }

            const masteredUnitTopics = unit.topics.filter((t) => t.status === 'mastered').length;
            const inProgressUnitTopics = unit.topics.filter((t) => t.status === 'in_progress').length;
            const unitReadiness = Math.round(
              ((masteredUnitTopics * 1.0 + inProgressUnitTopics * 0.5) / unit.topics.length) * 100
            );

            return (
              <div
                key={unit.id}
                className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs"
              >
                {/* Unit Accordion Header */}
                <div
                  onClick={() => toggleUnit(unit.id)}
                  className="p-3.5 px-4 bg-slate-50/70 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Unit {unit.unitNumber}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                      {unit.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 hidden md:inline">
                      Weight: {unit.weightPercentage}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600">
                      {masteredUnitTopics}/{unit.topics.length} Mastered ({unitReadiness}%)
                    </span>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600"
                      aria-label="Toggle Unit"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Subtopics Rows */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100">
                    {visibleTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/40 transition-colors"
                      >
                        {/* Topic title & metadata */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-slate-900">
                              {topic.title}
                            </span>

                            {topic.importance === 'high_yield' && (
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                High Yield
                              </span>
                            )}

                            {topic.formulaReference && (
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                Formula: {topic.formulaReference}
                              </span>
                            )}
                          </div>

                          {topic.notesSummary && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {topic.notesSummary}
                            </p>
                          )}
                        </div>

                        {/* Interactive 3-State Toggle Button */}
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <button
                            onClick={() => onCycleTopic(topic.id)}
                            className="cursor-pointer hover:scale-102 active:scale-98 transition-transform"
                            title="Click to cycle status: Untouched → In Progress → Mastered"
                          >
                            {getStatusBadge(topic.status)}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
