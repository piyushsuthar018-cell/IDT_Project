'use client';

import React, { useState } from 'react';
import {
  FileText,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CleanMarkdownText } from './MarkdownRenderer';

export interface LongQuestionItem {
  id: number | string;
  marks?: number | string;
  title: string;
  keyPoints?: string[];
  modelAnswer: string;
  markingScheme?: string;
  examTip?: string;
}

interface LongQuestionViewProps {
  questions: LongQuestionItem[];
}

export function LongQuestionView({ questions }: LongQuestionViewProps) {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(
    questions.length === 1 ? questions[0].id : null
  );

  const handleCopy = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 my-2">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 text-white font-bold text-[11px]">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-white">University Exam Questions & Model Solutions</span>
            <span className="text-[11px] text-slate-300 ml-1.5">
              ({questions.length} {questions.length === 1 ? 'Question' : 'Questions'})
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-200 border border-indigo-800">
          5 / 10 Marks Pattern
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((item, idx) => {
          const marksLabel = item.marks ? `${item.marks} Marks` : '10 Marks';
          const isExpanded = expandedId === item.id || questions.length === 1;

          return (
            <div
              key={item.id || idx}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
            >
              {/* Question Header Card */}
              <div className="p-4 bg-white border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                      Q{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      {marksLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.modelAnswer, item.id)}
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="font-semibold text-slate-900 text-xs leading-relaxed pt-1">
                  {item.title}
                </h4>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="p-4 space-y-3.5 bg-slate-50/50">
                  {/* Key Concepts Blueprint */}
                  {item.keyPoints && item.keyPoints.length > 0 && (
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-950">
                        <Layers className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Examiner Checklist (Key Concepts to Hit):</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-700 pl-1">
                        {item.keyPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold mt-0.5">•</span>
                            <span className="text-[11px] leading-relaxed">
                              <CleanMarkdownText text={point} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Marking Scheme */}
                  {item.markingScheme && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-200/80 bg-amber-50/50 text-[11px] text-amber-950">
                      <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <div className="leading-snug">
                        <span className="font-semibold text-amber-900 mr-1.5">Mark Distribution:</span>
                        <span className="text-slate-700">{item.markingScheme}</span>
                      </div>
                    </div>
                  )}

                  {/* Model Answer Body */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900">
                      <BookOpen className="h-3.5 w-3.5 text-slate-700" />
                      <span>Model Examination Solution:</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3.5 text-xs text-slate-800 leading-relaxed space-y-2">
                      <CleanMarkdownText text={item.modelAnswer} />
                    </div>
                  </div>

                  {/* Examiner Tip */}
                  {item.examTip && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg border border-emerald-200/80 bg-emerald-50/50 text-[11px] text-emerald-950">
                      <Lightbulb className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-semibold text-emerald-900 mr-1.5">Pro-Tip for 10/10:</span>
                        <span className="text-slate-700">{item.examTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
