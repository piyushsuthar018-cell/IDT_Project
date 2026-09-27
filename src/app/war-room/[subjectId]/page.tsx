'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  Target,
  Sparkles,
  CheckCircle2,
  Layers,
  Sliders,
  FolderOpen,
  Printer
} from 'lucide-react';
import { useAcademic } from '@/context/AcademicContext';
import { PomodoroTimer } from '@/components/war-room/PomodoroTimer';
import { ReadinessGauge } from '@/components/war-room/ReadinessGauge';
import { CriticalFocusList } from '@/components/war-room/CriticalFocusList';
import { SyllabusMatrix } from '@/components/war-room/SyllabusMatrix';
import { RoadmapTimeline } from '@/components/roadmap/RoadmapTimeline';
import { CreateRoadmapModal } from '@/components/roadmap/CreateRoadmapModal';
import { PrintRevisionSheet } from '@/components/war-room/PrintRevisionSheet';
import { StudyCopilotDrawer } from '@/components/chat/StudyCopilotDrawer';
import { SyllabusTopic } from '@/types/academic';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export default function WarRoomSubjectPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const subjectId = resolvedParams.subjectId;

  const {
    subjects,
    resources,
    roadmaps,
    createExamRoadmap,
    toggleRoadmapTask,
    cycleTopicStatus,
    setTopicStatus,
    activeFocusTopic,
    setFocusTopic,
    setActiveView,
  } = useAcademic();

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'matrix'>('roadmap');
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find subject or fallback to first subject
  const currentSubject =
    subjects.find(
      (s) =>
        s.id.toLowerCase() === subjectId.toLowerCase() ||
        s.code.toLowerCase() === subjectId.toLowerCase() ||
        s.code.toLowerCase().replace(/[^a-z0-9]/g, '') === subjectId.toLowerCase().replace(/[^a-z0-9]/g, '')
    ) || (subjects.length > 0 ? subjects[0] : null);

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Course Not Found or Loading</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No matching course found for &ldquo;{subjectId}&rdquo; in your current SQLite database.
            </p>
          </div>
          <Link
            href="/"
            onClick={() => setActiveView('dashboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const units = currentSubject.syllabusUnits || [];

  // Find roadmap for this subject, or fallback to first roadmap
  const currentRoadmap = roadmaps.find((r) => r.subjectId === currentSubject.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 md:px-8 backdrop-blur-md print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <span className="text-slate-300">/</span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {currentSubject.code}
            </span>
            <span className="text-xs font-semibold text-slate-900 hidden sm:inline">
              Exam War Room
            </span>
          </div>
        </div>

        {/* Action controls & Countdown */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            title="Print or save as physical exam revision sheet"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print Revision Sheet</span>
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-800 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Ask</span> Copilot
          </button>

          <Link
            href={`/locker?subject=${currentSubject.id}`}
            onClick={() => setActiveView('locker')}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <FolderOpen className="h-3.5 w-3.5 text-indigo-600" />
            <span>Digital Locker</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 border-l border-slate-200 pl-2.5">
            <Clock className="h-3.5 w-3.5 text-indigo-600" />
            {isMounted ? (
              <span>
                Exam in <strong className="text-slate-900 font-semibold">{currentSubject.daysUntilExam}d</strong>
              </span>
            ) : (
              <span>Exam in 3d</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Interactive Screen Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:hidden">
        {/* Subject Overview Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                End-Term Theory Assessment
              </span>
              <span className="text-xs text-slate-500">
                {currentSubject.creditHours} Credits{currentSubject.room ? ` • ${currentSubject.room}` : ''}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {currentSubject.name} — Exam Readiness War Room
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {currentSubject.instructor ? (
                <>Instructed by <span className="font-medium text-slate-800">{currentSubject.instructor}</span>{currentSubject.instructorEmail ? ` (${currentSubject.instructorEmail})` : ''}</>
              ) : (
                <span>Self-directed study curriculum</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 self-start md:self-auto bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-400 block">Syllabus Matrix</span>
              <span className="font-semibold text-slate-900 text-sm">
                {currentSubject.syllabusTopics.completed} of {currentSubject.syllabusTopics.total} Topics
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-[11px] text-slate-400 block">Current Readiness</span>
              <span className="font-semibold text-indigo-600 text-sm font-mono">
                {currentSubject.readinessScore}% Ready
              </span>
            </div>
          </div>
        </div>

        {/* Top 2-Column: Focus Timer & Live Readiness Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <PomodoroTimer
              activeTopic={activeFocusTopic}
              onClearTopic={() => setFocusTopic(null)}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <ReadinessGauge
              units={units}
              subjectName={currentSubject.name}
            />
          </div>
        </div>

        {/* View Switcher Tabs: 3-Phase Study Roadmap vs Syllabus Matrix */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                activeTab === 'roadmap'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <Sparkles className={cn('h-3.5 w-3.5', activeTab === 'roadmap' ? 'text-indigo-300' : 'text-slate-400')} />
              <span>3-Phase Study Roadmap</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  activeTab === 'roadmap' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                )}
              >
                Backwards-Engineered
              </span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <Layers className={cn('h-3.5 w-3.5', activeTab === 'matrix' ? 'text-indigo-300' : 'text-slate-400')} />
              <span>Syllabus Readiness Matrix</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  activeTab === 'matrix' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                )}
              >
                {units.length} Units
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsRoadmapModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span>Schedule Exam</span>
          </button>
        </div>

        {/* Main 2-Column: Active Workspace (Roadmap or Matrix) & Critical Focus Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Active Workspace (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'roadmap' ? (
              <RoadmapTimeline
                roadmap={currentRoadmap}
                subjectName={currentSubject.name}
                onOpenCreateModal={() => setIsRoadmapModalOpen(true)}
                onToggleTask={toggleRoadmapTask}
              />
            ) : (
              <SyllabusMatrix
                units={units}
                subjectId={currentSubject.id}
                onCycleTopic={(topicId) => cycleTopicStatus(currentSubject.id, topicId)}
                onSetStatus={(topicId, status) => setTopicStatus(currentSubject.id, topicId, status)}
              />
            )}
          </div>

          {/* Right Column: Critical Focus List & Quick Advice (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <CriticalFocusList
              units={units}
              onSelectFocusTopic={(topic) => setFocusTopic(topic)}
              activeFocusTopicId={activeFocusTopic?.id}
            />

            {/* Backwards Strategy Overview Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Backwards Prep Philosophy
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rather than studying forwards without a finish line, StudyPulse calculates backwards from Exam Eve:
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100">
                  <span className="font-semibold text-indigo-900 block">Phase 1: Foundation (50% Days)</span>
                  <span className="text-slate-500 text-[11px]">Clear all untouched (🔴) topics to in-progress (🟡).</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-semibold text-emerald-900 block">Phase 2: Active Practice (30% Days)</span>
                  <span className="text-slate-500 text-[11px]">Execute code drills, problem banks, and numerical trace sheets.</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100">
                  <span className="font-semibold text-amber-900 block">Phase 3: Exam Simulation (20% Days)</span>
                  <span className="text-slate-500 text-[11px]">Full timed PYQs and formula speed-recall tests.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Backwards Scheduling Engine Modal */}
      <CreateRoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        subjects={subjects}
        initialSubjectId={currentSubject.id}
        onCreateRoadmap={createExamRoadmap}
      />

      {/* Physical Pen-Tickable Revision Cheat Sheet (Visible solely when printing or exporting PDF) */}
      <PrintRevisionSheet
        subject={currentSubject}
        units={units}
        resources={resources}
      />

      {/* Slide-over Study Copilot Drawer */}
      <StudyCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeSubject={currentSubject}
        activeUnitTitle={activeFocusTopic?.title}
      />
    </div>
  );
}
