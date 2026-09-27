'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  FileText,
  ArrowRight,
  Target,
  Download,
  BookOpen
} from 'lucide-react';
import { Subject, Resource } from '@/types/academic';
import { mockWarRoomResources } from '@/data/mockData';

interface ExamWarRoomBannerProps {
  urgentSubject?: Subject | null;
  onEnterWarRoom: (subject: Subject) => void;
  onOpenResource?: (resource: Resource) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function ExamWarRoomBanner({
  urgentSubject,
  onEnterWarRoom,
  onOpenResource,
}: ExamWarRoomBannerProps) {
  // Hydration safety check
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: urgentSubject?.daysUntilExam || 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);

    if (!urgentSubject?.nextExamDate) return;
    const targetTime = new Date(urgentSubject.nextExamDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [urgentSubject?.nextExamDate]);

  if (!urgentSubject || !urgentSubject.nextExamDate || urgentSubject.daysUntilExam > 14) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Column: Focused Preparation Details */}
        <div className="flex-1 space-y-3">
          {/* Header pill tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 text-indigo-800 px-2.5 py-0.5 text-xs font-semibold">
              <Target className="h-3.5 w-3.5" />
              Active Exam Preparation
            </span>

            <span className="text-xs text-slate-500 font-medium">
              Target: {urgentSubject.nextExamTitle} ({urgentSubject.examType})
            </span>
          </div>

          {/* Subject Title & Instructor */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2.5">
              <span>{urgentSubject.name}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                {urgentSubject.code}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {urgentSubject.instructor ? (
                <>Instructed by <span className="text-slate-800 font-medium">{urgentSubject.instructor}</span></>
              ) : (
                <span>Self-directed study</span>
              )}
              {urgentSubject.room ? ` • ${urgentSubject.room}` : ''}
            </p>
          </div>

          {/* Readiness & Progress strip */}
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <div className="flex-1 min-w-[200px] max-w-xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Topic Readiness</span>
                <span className="font-semibold text-slate-900">
                  {urgentSubject.readinessScore}% Ready
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${urgentSubject.readinessScore}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>
                <strong className="text-slate-900 font-semibold">
                  {urgentSubject.syllabusTopics.completed} of {urgentSubject.syllabusTopics.total}
                </strong>{' '}
                topics reviewed
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Inline Countdown & Action Button */}
        <div className="flex flex-col items-start lg:items-end gap-3.5 shrink-0">
          {/* Elegant Text-based Countdown */}
          <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-2xs">
            <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              <span>
                Exam Schedule:{' '}
                {urgentSubject.nextExamDate
                  ? new Date(urgentSubject.nextExamDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Upcoming'}
              </span>
            </div>

            {isMounted ? (
              <div className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{timeLeft.days} days,</span>
                <span>{timeLeft.hours} hours,</span>
                <span className="text-indigo-600 font-mono text-sm">{timeLeft.minutes}m {timeLeft.seconds}s remaining</span>
              </div>
            ) : (
              <div className="text-base font-semibold text-slate-900 tracking-tight">
                {urgentSubject.daysUntilExam} days remaining
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={() => onEnterWarRoom(urgentSubject)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors group"
          >
            <span>Enter Preparation War Room</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Fast Access High-Yield Resources */}
      <div className="mt-5 pt-4 border-t border-slate-200/70">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-700">
            Recommended Revision Materials
          </span>
          <span className="text-[11px] text-slate-500">3 high-yield assets ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockWarRoomResources.map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenResource?.(res)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {res.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {res.format} • {res.fileSize}
                  </p>
                </div>
              </div>

              <span className="p-1 text-slate-400 group-hover:text-slate-700 shrink-0">
                <Download className="h-3.5 w-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
