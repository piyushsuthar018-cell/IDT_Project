'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { ExamWarRoomBanner } from '@/components/dashboard/ExamWarRoomBanner';
import { SubjectsGrid } from '@/components/dashboard/SubjectsGrid';
import { DeadlinesRail } from '@/components/dashboard/DeadlinesRail';
import { StudyMilestones } from '@/components/dashboard/StudyMilestones';
import { SubjectsView } from '@/components/views/SubjectsView';
import { CalendarView } from '@/components/views/CalendarView';
import { DigitalLockerView } from '@/components/views/DigitalLockerView';
import { SettingsView } from '@/components/views/SettingsView';
import { WarRoomDedicatedView } from '@/components/views/WarRoomDedicatedView';
import { AddSubjectModal } from '@/components/modals/AddSubjectModal';
import { AddDeadlineModal } from '@/components/modals/AddDeadlineModal';
import { CalendarImportModal } from '@/components/ingest/CalendarImportModal';
import { ChapterUploadModal } from '@/components/ingest/ChapterUploadModal';
import { useAcademic } from '@/context/AcademicContext';
import { Subject } from '@/types/academic';

export default function DashboardPage() {
  const router = useRouter();
  const {
    subjects,
    profile,
    deadlines,
    milestones,
    toggleMilestone,
    toggleDeadline,
    createSubject,
    createDeadline,
    resetDemoData,
    refreshData,
    triggerIngestionNotice,
  } = useAcademic();

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [isCalendarImportOpen, setIsCalendarImportOpen] = useState(false);
  const [isChapterUploadOpen, setIsChapterUploadOpen] = useState(false);

  // Urgent exam subject within 5 days (e.g. Operating Systems CS-301)
  const urgentSubject = subjects.find((s) => s.daysUntilExam <= 5) || null;

  const handleEnterWarRoom = (subject: Subject) => {
    router.push(`/war-room/${subject.id}`);
  };

  return (
    <AppShell>
      {({ currentTab }) => {
        // Handle tab switching
        if (currentTab === 'subjects') {
          return <SubjectsView subjects={subjects} onEnterWarRoom={handleEnterWarRoom} />;
        }

        if (currentTab === 'calendar') {
          return <CalendarView />;
        }

        if (currentTab === 'war-room' || currentTab === 'matrix') {
          return (
            <WarRoomDedicatedView
              onEnterWarRoom={handleEnterWarRoom}
              onOpenCalendarImport={() => setIsCalendarImportOpen(true)}
              onOpenChapterUpload={() => setIsChapterUploadOpen(true)}
            />
          );
        }

        if (currentTab === 'locker') {
          return <DigitalLockerView />;
        }

        if (currentTab === 'settings') {
          return <SettingsView />;
        }

        // Default: Primary Dashboard
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Semester Metric Bar */}
            <QuickStats
              profile={profile}
              subjects={subjects}
              deadlines={deadlines}
            />

            {/* Dynamic Exam War Room Banner (Triggers when an exam is within 5 days) */}
            <ExamWarRoomBanner
              urgentSubject={urgentSubject}
              onEnterWarRoom={handleEnterWarRoom}
            />

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Active Subjects Grid (7 cols) */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-6">
                <SubjectsGrid
                  subjects={subjects}
                  onEnterWarRoom={handleEnterWarRoom}
                  onOpenAddSubject={() => setIsAddSubjectOpen(true)}
                  onOpenCalendarImport={() => setIsCalendarImportOpen(true)}
                  onOpenChapterUpload={() => setIsChapterUploadOpen(true)}
                  onResetDemoData={resetDemoData}
                />
              </div>

              {/* Right Column: Milestones & Deadlines Rail (5 cols) */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-6">
                {/* Today's Study Milestones */}
                <StudyMilestones
                  initialMilestones={milestones}
                />

                {/* Upcoming Deadlines & Exams Rail */}
                <DeadlinesRail
                  deadlines={deadlines}
                  onToggleStatus={toggleDeadline}
                  onOpenAddDeadline={() => setIsAddDeadlineOpen(true)}
                />
              </div>
            </div>

            {/* Manual Creation Modals */}
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
          </div>
        );
      }}
    </AppShell>
  );
}
