'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Sliders,
  Code2,
  FileSpreadsheet,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ExamRoadmap, RoadmapPhase, RoadmapTask } from '@/types/academic';
import { cn } from '@/lib/utils';

interface RoadmapTimelineProps {
  roadmap?: ExamRoadmap;
  subjectName: string;
  onOpenCreateModal: () => void;
  onToggleTask: (roadmapId: string, phaseId: string, taskId: string) => void;
}

export function RoadmapTimeline({
  roadmap,
  subjectName,
  onOpenCreateModal,
  onToggleTask,
}: RoadmapTimelineProps) {
  if (!roadmap) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-semibold text-slate-900">
            No Exam Roadmap Generated for {subjectName}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Let StudyPulse backwards-schedule your remaining days into a focused 3-phase revision plan
            (Foundation &rarr; Active Practice &rarr; Exam Simulation).
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
          <span>Generate 3-Phase Roadmap</span>
        </button>
      </div>
    );
  }

  // Calculate completion stats
  const totalTasks = roadmap.phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = roadmap.phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTaskIcon = (type: RoadmapTask['type']) => {
    switch (type) {
      case 'code':
        return <Code2 className="h-3 w-3 text-cyan-600" />;
      case 'pyq':
        return <FileSpreadsheet className="h-3 w-3 text-emerald-600" />;
      case 'formula':
        return <Sparkles className="h-3 w-3 text-amber-600" />;
      default:
        return <BookOpen className="h-3 w-3 text-indigo-600" />;
    }
  };

  const getTaskBadgeStyle = (type: RoadmapTask['type']) => {
    switch (type) {
      case 'code':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/70';
      case 'pyq':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      case 'formula':
        return 'bg-amber-50 text-amber-800 border-amber-200/70';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Backwards-Scheduled Strategy
            </span>
            <span className="text-xs text-slate-400">
              Exam Target: <strong className="text-slate-700 font-semibold">{roadmap.examDate}</strong>
            </span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mt-1">
            Reverse-Engineered Study Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured 3-phase revision plan dynamically calibrated to your exam date and readiness target.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-slate-800">
              {completedTasks} of {totalTasks} Tasks Done
            </div>
            <div className="text-[11px] text-slate-400">
              {percentage}% Roadmap Completed
            </div>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span>Re-calculate</span>
          </button>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            Roadmap Execution Progress
          </span>
          <span className="font-mono text-slate-900">{percentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 3-Phase Stepper Cards */}
      <div className="space-y-5">
        {roadmap.phases.map((phase, pIdx) => {
          const phaseCompleted = phase.tasks.filter((t) => t.completed).length;
          const isPhaseFullyDone = phaseCompleted === phase.tasks.length && phase.tasks.length > 0;

          return (
            <div
              key={phase.id}
              className={cn(
                'rounded-xl border transition-all duration-150 p-4 sm:p-5',
                isPhaseFullyDone
                  ? 'border-slate-200 bg-slate-50/60'
                  : 'border-slate-200/90 bg-white hover:border-slate-300'
              )}
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold font-mono shrink-0',
                      isPhaseFullyDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-800'
                    )}
                  >
                    {isPhaseFullyDone ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : `P${phase.phaseNumber}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{phase.title}</h3>
                      <span className="text-[11px] font-medium font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                        {phase.daysRange}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {phase.focusDescription}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span
                    className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded-md border',
                      isPhaseFullyDone
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    )}
                  >
                    {phaseCompleted} / {phase.tasks.length} Completed
                  </span>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2">
                {phase.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(roadmap.id, phase.id, task.id)}
                    className={cn(
                      'group flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors select-none',
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/60'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/40'
                    )}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0"
                      aria-label={task.completed ? 'Mark task incomplete' : 'Mark task completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-indigo-600 fill-indigo-50" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            'text-xs transition-all',
                            task.completed
                              ? 'line-through text-slate-400 font-normal'
                              : 'font-medium text-slate-800'
                          )}
                        >
                          {task.title}
                        </span>

                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border',
                            getTaskBadgeStyle(task.type)
                          )}
                        >
                          {getTaskIcon(task.type)}
                          <span className="capitalize">{task.type}</span>
                        </span>

                        {task.unitReference && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                            {task.unitReference}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{task.estimatedHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
