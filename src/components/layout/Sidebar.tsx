'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Flame,
  Target,
  FolderLock,
  Settings,
  GraduationCap,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAcademic } from '@/context/AcademicContext';
import { NavItemKey } from '@/types/academic';

export type { NavItemKey };

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    variant: 'urgent' | 'highlight' | 'neutral';
  };
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'subjects',
    label: 'Subjects',
    icon: BookOpen,
    badge: { text: '5 Enrolled', variant: 'neutral' },
  },
  {
    key: 'calendar',
    label: 'Calendar & Exams',
    icon: Calendar,
    badge: { text: 'Exam in 3d', variant: 'urgent' },
  },
  {
    key: 'war-room',
    label: 'Exam War Room',
    icon: Flame,
    badge: { text: '1 Active', variant: 'highlight' },
  },
  {
    key: 'matrix',
    label: 'Readiness Matrix',
    icon: Target,
  },
  {
    key: 'locker',
    label: 'Digital Locker',
    icon: FolderLock,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function Sidebar({ currentTab, onSelectTab, isOpenMobile, onCloseMobile }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { profile, subjects, activeView, setActiveView } = useAcademic();
  const nearestSubject = [...subjects].sort((a, b) => a.daysUntilExam - b.daysUntilExam)[0];
  const activeKey = currentTab || activeView || 'dashboard';

  const handleNavClick = (key: NavItemKey) => {
    setActiveView(key);
    if (onSelectTab) {
      onSelectTab(key);
    } else {
      if (key === 'locker') {
        router.push('/locker');
      } else if (key === 'dashboard') {
        router.push('/');
      } else {
        router.push(`/?tab=${key}`);
      }
    }
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex-col justify-between border-r border-slate-200/80 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 flex',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Header & Logo */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <div>
                <h1 className="font-semibold text-base text-slate-900 tracking-tight leading-none">
                  StudyPulse
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5">Academic Workspace</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Current Term Quick Chip */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Semester 4 Active</span>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-600">
              GPA 3.84
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          <div className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Workspace
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group cursor-pointer',
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Badge if present */}
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-md border',
                      item.badge.variant === 'urgent' &&
                        'bg-rose-50 text-rose-700 border-rose-200/80',
                      item.badge.variant === 'highlight' &&
                        'bg-amber-50 text-amber-800 border-amber-200/80',
                      item.badge.variant === 'neutral' &&
                        'bg-slate-100 text-slate-600 border-slate-200/60'
                    )}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Readiness telemetry card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600">Exam Readiness</span>
              <span className="text-xs font-semibold text-slate-900">{profile.averageReadiness}%</span>
            </div>

            {/* Clean Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${profile.averageReadiness}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              {nearestSubject?.code ?? 'CS-301'} scheduled in {nearestSubject?.daysUntilExam ?? 3} days.
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Sync: Live</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
