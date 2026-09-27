'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Clock,
  BookOpen,
  User,
  LogOut,
  SlidersHorizontal,
  Flame,
  Check,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  CheckCheck,
  Plus,
  RefreshCw,
  Database,
  CalendarCheck,
  FileText
} from 'lucide-react';
import { mockSemesters, mockStudentProfile } from '@/data/mockData';
import { Semester, NotificationItem, NotificationCategory } from '@/types/academic';
import { useAcademic } from '@/context/AcademicContext';
import { AddSubjectModal } from '@/components/modals/AddSubjectModal';
import { AddDeadlineModal } from '@/components/modals/AddDeadlineModal';
import { CalendarImportModal } from '@/components/ingest/CalendarImportModal';
import { ChapterUploadModal } from '@/components/ingest/ChapterUploadModal';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  selectedSemester: Semester;
  onSelectSemester: (semester: Semester) => void;
  onEnterWarRoom?: () => void;
}

export function TopBar({
  onOpenMobileMenu,
  selectedSemester,
  onSelectSemester,
  onEnterWarRoom,
}: TopBarProps) {
  const router = useRouter();
  const {
    subjects,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    createSubject,
    createDeadline,
    resetDemoData,
    refreshData,
    triggerIngestionNotice,
    setActiveView,
  } = useAcademic();

  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [isCalendarImportOpen, setIsCalendarImportOpen] = useState(false);
  const [isChapterUploadOpen, setIsChapterUploadOpen] = useState(false);

  const semesterRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (semesterRef.current && !semesterRef.current.contains(event.target as Node)) {
        setIsSemesterOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryBadge = (category?: NotificationCategory) => {
    switch (category) {
      case 'deadline':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="text-[9px]">🚨</span> Deadline
          </span>
        );
      case 'roadmap':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="text-[9px]">📚</span> Roadmap
          </span>
        );
      case 'weak_spot':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80">
            <span className="text-[9px]">⚠️</span> Weak Spot
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80">
            <span>ℹ️</span> System
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-6 backdrop-blur-md">
      {/* Left section: mobile hamburger & Semester Selector */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Semester Selector Dropdown */}
        <div className="relative" ref={semesterRef}>
          <button
            onClick={() => setIsSemesterOpen(!isSemesterOpen)}
            className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-100/80 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500 hidden sm:inline" />
            <span className="font-medium text-slate-800 flex items-center gap-1.5">
              {selectedSemester.name}
              {selectedSemester.isCurrent && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-slate-400 transition-transform duration-150',
                isSemesterOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Semester dropdown menu */}
          {isSemesterOpen && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Select Academic Session
              </div>
              <div className="space-y-0.5">
                {mockSemesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => {
                      onSelectSemester(sem);
                      setIsSemesterOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors',
                      selectedSemester.id === sem.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{sem.name}</span>
                        {sem.isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {sem.totalCredits} Credits • Target GPA: {sem.targetGpa}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-600">
                      {sem.gpa.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle section: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, notes, past papers..."
            className="w-full h-8 pl-8.5 pr-12 rounded-lg bg-slate-100/80 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500/50 transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section: Quick Add, War Room Quick Link, Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Quick Add Dropdown */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
            title="Create Course or Deadline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add</span>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:inline" />
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in duration-100">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Progressive Ingestion
              </div>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  setIsCalendarImportOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors text-left"
              >
                <CalendarCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span>Import Calendar</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  setIsChapterUploadOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors text-left"
              >
                <FileText className="h-3.5 w-3.5 text-indigo-600" />
                <span>Ingest Chapter PDF</span>
              </button>

              <div className="my-1 border-t border-slate-100" />
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Manual Entry
              </div>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  setIsAddSubjectOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span>+ Add Course</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  setIsAddDeadlineOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                <span>+ Add Deadline</span>
              </button>
            </div>
          )}
        </div>

        {onEnterWarRoom && (
          <button
            onClick={onEnterWarRoom}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 hover:bg-amber-100/70 transition-colors text-xs font-medium"
          >
            <Flame className="h-3.5 w-3.5 text-amber-600" />
            <span>War Room: OS</span>
          </button>
        )}

        {/* Proactive Notification Center Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-1.5 w-84 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">StudyPulse Alerts</span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.2 rounded-full">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    All caught up! No active alerts.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'p-3 rounded-xl border text-xs transition-colors space-y-1.5',
                        !notif.isRead
                          ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                          : 'bg-white border-slate-100 text-slate-500'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getCategoryBadge(notif.category)}
                          <span className="font-semibold text-slate-900">{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {notif.timeAgo}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        {notif.actionHref && notif.actionLabel ? (
                          <button
                            onClick={() => {
                              markNotificationRead(notif.id);
                              setIsNotifOpen(false);
                              if (notif.actionHref) {
                                if (notif.actionHref.includes('/locker')) {
                                  setActiveView('locker');
                                } else if (notif.actionHref.includes('/war-room')) {
                                  setActiveView('war-room');
                                } else if (notif.actionHref === '/') {
                                  setActiveView('dashboard');
                                }
                                router.push(notif.actionHref);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
                          >
                            <span>{notif.actionLabel}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                          </button>
                        ) : <div />}

                        {!notif.isRead && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <div className="flex flex-col items-end text-right hidden xl:flex">
              <span className="text-xs font-semibold text-slate-800 leading-none">
                {mockStudentProfile.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">CS & Engineering</span>
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold text-xs">
              {mockStudentProfile.initials}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg z-50 animate-in fade-in duration-100">
              <div className="pb-2 mb-2 border-b border-slate-100">
                <div className="font-semibold text-xs text-slate-900">
                  {mockStudentProfile.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {mockStudentProfile.email}
                </div>
              </div>

              <div className="py-1 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600 px-1">
                  <span>Enrolled Courses</span>
                  <span className="font-semibold text-slate-900">{subjects.length} Active</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 px-1">
                  <span>Daily Streak</span>
                  <span className="font-semibold text-amber-700">
                    🔥 {mockStudentProfile.studyStreakDays} Days
                  </span>
                </div>
              </div>

              <div className="pt-2 mt-1 border-t border-slate-100 space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetDemoData();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Reset Demo Data (SQLite)</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                  <span>Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Modals reachable from TopBar */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onCreateSubject={createSubject}
      />

      <AddDeadlineModal
        isOpen={isAddDeadlineOpen}
        onClose={() => setIsAddDeadlineOpen(false)}
        subjects={subjects}
        onCreateDeadline={createDeadline}
      />

      <CalendarImportModal
        isOpen={isCalendarImportOpen}
        onClose={() => setIsCalendarImportOpen(false)}
        onSuccess={(data) => {
          refreshData();
          triggerIngestionNotice({
            title: 'Academic Calendar Synced',
            message: data.message,
          });
        }}
      />

      <ChapterUploadModal
        isOpen={isChapterUploadOpen}
        onClose={() => setIsChapterUploadOpen(false)}
        subjects={subjects}
        onSuccess={(data) => {
          refreshData();
          triggerIngestionNotice({
            title: 'Chapter Ingested & Mapped',
            message: data.message,
            subjectId: data.subjectId,
            subjectCode: data.subjectCode,
            unitNumber: data.unitNumber,
            topicsAdded: data.topicsAdded,
          });
        }}
      />
    </header>
  );
}
