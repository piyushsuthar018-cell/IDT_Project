'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Sidebar, NavItemKey } from './Sidebar';
import { TopBar } from './TopBar';
import { Semester, Subject } from '@/types/academic';
import { useAcademic } from '@/context/AcademicContext';
import { WarRoomModal } from '@/components/dashboard/WarRoomModal';
import { StudyCopilotDrawer } from '@/components/chat/StudyCopilotDrawer';
import { GlobalShortcuts } from '@/components/common/GlobalShortcuts';

export type { NavItemKey };

interface AppShellProps {
  children: (props: {
    currentTab: NavItemKey;
    onSelectTab: (tab: NavItemKey) => void;
    onEnterWarRoom: (subject: Subject) => void;
    selectedSemester: Semester;
  }) => React.ReactNode;
}

function AppShellInner({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const { subjects, selectedSemester, setSelectedSemester, activeView, setActiveView } = useAcademic();

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  
  // War Room modal state (for preview popup)
  const [isWarRoomModalOpen, setIsWarRoomModalOpen] = useState(false);
  const [activeWarRoomSubject, setActiveWarRoomSubject] = useState<Subject | null>(subjects[0] || null);

  const tabParam = searchParams?.get('tab') as NavItemKey | null;

  // Determine effective tab deterministically from route and search params
  let effectiveTab: NavItemKey = 'dashboard';
  if (pathname === '/locker') {
    effectiveTab = 'locker';
  } else if (pathname.startsWith('/war-room')) {
    effectiveTab = 'war-room';
  } else if (
    tabParam &&
    ['dashboard', 'subjects', 'calendar', 'war-room', 'matrix', 'locker', 'settings'].includes(tabParam)
  ) {
    effectiveTab = tabParam;
  } else if (pathname === '/') {
    effectiveTab = 'dashboard';
  } else {
    effectiveTab = activeView || 'dashboard';
  }

  // Synchronize context activeView with current route
  useEffect(() => {
    if (effectiveTab && activeView !== effectiveTab) {
      setActiveView(effectiveTab);
    }
  }, [effectiveTab, activeView, setActiveView]);

  const handleEnterWarRoom = (subject?: Subject | null) => {
    if (subject?.id) {
      router.push(`/war-room/${subject.id}`);
    }
  };

  const handleSelectTab = (tab: NavItemKey) => {
    setActiveView(tab);

    if (tab === 'locker') {
      if (pathname !== '/locker') {
        router.push('/locker');
      }
    } else if (tab === 'dashboard') {
      if (pathname !== '/' || tabParam !== null) {
        router.push('/');
      }
    } else {
      // 'subjects' | 'calendar' | 'war-room' | 'matrix' | 'settings'
      if (pathname !== '/' || tabParam !== tab) {
        router.push(`/?tab=${tab}`);
      }
    }
  };

  const urgentSubject = subjects.find((s) => s.daysUntilExam <= 5) || subjects[0] || null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Global Keyboard Shortcuts (Cmd+K search, Esc close) */}
      <GlobalShortcuts
        onEscape={() => {
          setIsCopilotOpen(false);
          setIsWarRoomModalOpen(false);
          setIsOpenMobile(false);
        }}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={effectiveTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          selectedSemester={selectedSemester}
          onSelectSemester={setSelectedSemester}
          onEnterWarRoom={urgentSubject ? () => handleEnterWarRoom(urgentSubject) : undefined}
        />

        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children({
            currentTab: effectiveTab,
            onSelectTab: handleSelectTab,
            onEnterWarRoom: handleEnterWarRoom,
            selectedSemester,
          })}
        </main>
      </div>

      {/* Global Floating Copilot Trigger Pill (Bottom-Right) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-slate-700/60 print:hidden cursor-pointer"
          aria-label="Open StudyPulse Copilot"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-pulse" />
          <span>Study Copilot</span>
          <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded-full font-mono">
            AI
          </span>
        </button>
      )}

      {/* Slide-over Study Copilot Drawer */}
      <StudyCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Exam War Room Modal */}
      <WarRoomModal
        subject={activeWarRoomSubject}
        isOpen={isWarRoomModalOpen}
        onClose={() => setIsWarRoomModalOpen(false)}
      />
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <AppShellInner {...props} />
    </Suspense>
  );
}
