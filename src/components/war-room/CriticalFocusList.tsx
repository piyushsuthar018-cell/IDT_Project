'use client';

import React from 'react';
import { AlertTriangle, ArrowRight, Play, Sparkles, BookOpen } from 'lucide-react';
import { SyllabusUnit, SyllabusTopic } from '@/types/academic';

interface CriticalFocusListProps {
  units: SyllabusUnit[];
  onSelectFocusTopic: (topic: SyllabusTopic) => void;
  activeFocusTopicId?: string;
}

export function CriticalFocusList({
  units,
  onSelectFocusTopic,
  activeFocusTopicId,
}: CriticalFocusListProps) {
  // Extract all untouched topics and sort by importance ('high_yield' first)
  const untouchedTopics: { unitTitle: string; topic: SyllabusTopic }[] = [];

  units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      if (topic.status === 'untouched') {
        untouchedTopics.push({ unitTitle: unit.title, topic });
      }
    });
  });

  const sortedUntouched = untouchedTopics.sort((a, b) => {
    if (a.topic.importance === 'high_yield' && b.topic.importance !== 'high_yield') return -1;
    if (b.topic.importance === 'high_yield' && a.topic.importance !== 'high_yield') return 1;
    return 0;
  });

  const top3 = sortedUntouched.slice(0, 3);

  return (
    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900">Critical Focus List</h4>
            <p className="text-[11px] text-slate-500">Highest-yield untouched topics for maximum exam ROI</p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
          {untouchedTopics.length} Untouched
        </span>
      </div>

      {top3.length === 0 ? (
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-center text-xs text-slate-500">
          🎉 All critical topics are either in progress or mastered!
        </div>
      ) : (
        <div className="space-y-2">
          {top3.map(({ unitTitle, topic }, idx) => {
            const isCurrentlyFocused = activeFocusTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wide">
                      #Priority {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">• {unitTitle}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 truncate">
                    {topic.title}
                  </h5>
                  {topic.notesSummary && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {topic.notesSummary}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onSelectFocusTopic(topic)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    isCurrentlyFocused
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>{isCurrentlyFocused ? 'Active in Timer' : 'Focus Now'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
