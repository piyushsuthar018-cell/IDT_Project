'use client';

import React from 'react';
import {
  Clock,
  Target,
  FileCheck2,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { StudentProfile, Subject, Deadline } from '@/types/academic';

interface QuickStatsProps {
  profile: StudentProfile;
  subjects: Subject[];
  deadlines: Deadline[];
}

export function QuickStats({ profile, subjects, deadlines }: QuickStatsProps) {
  const now = Date.now();

  // Filter upcoming exam deadlines (calendar or course-specific)
  const examDeadlines = deadlines
    .filter((d) => d.type === 'exam' && d.status !== 'submitted' && new Date(d.dueDate).getTime() >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Find subjects with active upcoming exams
  const subjectsWithUpcomingExams = subjects
    .filter((s) => s.nextExamDate && new Date(s.nextExamDate).getTime() >= now)
    .sort((a, b) => a.daysUntilExam - b.daysUntilExam);

  const nearestSubject = subjectsWithUpcomingExams[0];

  let nearestExam = {
    days: '—',
    code: '',
    title: 'No upcoming exams scheduled',
  };

  if (nearestSubject) {
    nearestExam = {
      days: `${nearestSubject.daysUntilExam}d`,
      code: nearestSubject.code,
      title: nearestSubject.nextExamTitle,
    };
  } else if (examDeadlines.length > 0) {
    const daysLeft = Math.max(0, Math.ceil((new Date(examDeadlines[0].dueDate).getTime() - now) / (1000 * 60 * 60 * 24)));
    nearestExam = {
      days: `${daysLeft}d`,
      code: examDeadlines[0].subjectCode || 'CALENDAR',
      title: examDeadlines[0].title,
    };
  }

  // Count pending urgent deadlines (<48h)
  const urgentCount = deadlines.filter(
    (d) => d.urgencyLevel === 'urgent' && d.status !== 'submitted'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Readiness */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Semester Readiness</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Target className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            {profile.averageReadiness}%
          </span>
          <span className="text-xs font-medium text-emerald-600 flex items-center">
            <ArrowUpRight className="h-3 w-3" />
            +4.2%
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${profile.averageReadiness}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {subjects.length > 0
            ? `Across ${subjects.length} active courses`
            : 'Awaiting course lecture notes'}
        </p>
      </div>

      {/* 2. Next Exam Target */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Nearest Exam</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            {nearestExam.days}
          </span>
          {nearestExam.code && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {nearestExam.code}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-3 truncate font-medium">
          {nearestExam.title}
        </p>
      </div>

      {/* 3. Action Items / Urgent Deadlines */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Action Items</span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <FileCheck2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            {deadlines.length}
          </span>
          {urgentCount > 0 && (
            <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70">
              {urgentCount} urgent (&lt;48h)
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {deadlines.filter((d) => d.status === 'submitted').length} completed this week
        </p>
      </div>

      {/* 4. Daily Study Streak */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Study Streak</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Flame className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            {profile.studyStreakDays}
          </span>
          <span className="text-xs text-slate-500">consecutive days</span>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < 6 ? 'bg-amber-400' : 'bg-slate-100'
              }`}
              title={i < 6 ? 'Day Active' : 'Today in progress'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
