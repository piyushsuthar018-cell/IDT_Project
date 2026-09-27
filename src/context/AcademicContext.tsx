'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Subject,
  Deadline,
  StudyMilestone,
  StudentProfile,
  Semester,
  TopicStatus,
  SyllabusTopic,
  Resource,
  NotificationItem,
  ExamRoadmap,
  RoadmapPhase,
  RoadmapTask,
  NavItemKey,
} from '@/types/academic';
import {
  mockStudentProfile,
  mockSemesters,
  mockNotifications,
  mockInitialRoadmaps,
  mockStudyMilestones,
} from '@/data/mockData';
import {
  getSemesterData,
  createSubject as serverCreateSubject,
  createDeadline as serverCreateDeadline,
  toggleTopicStatus as serverToggleTopicStatus,
  toggleDeadlineStatus as serverToggleDeadlineStatus,
  toggleMilestone as serverToggleMilestone,
  resetDemoData as serverResetDemoData,
} from '@/app/actions/academic';
import { IngestionNotice, IngestionToast } from '@/components/common/IngestionToast';

interface AcademicContextType {
  subjects: Subject[];
  deadlines: Deadline[];
  milestones: StudyMilestone[];
  profile: StudentProfile;
  selectedSemester: Semester;
  activeFocusTopic: SyllabusTopic | null;
  resources: Resource[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  roadmaps: ExamRoadmap[];
  isLoading: boolean;
  activeView: NavItemKey;
  setActiveView: (view: NavItemKey) => void;
  setSelectedSemester: (sem: Semester) => void;
  setFocusTopic: (topic: SyllabusTopic | null) => void;
  cycleTopicStatus: (subjectId: string, topicId: string) => void;
  setTopicStatus: (subjectId: string, topicId: string, status: TopicStatus) => void;
  toggleMilestone: (id: string) => void;
  toggleDeadline: (id: string) => void;
  getSubjectById: (id: string) => Subject | undefined;
  addResource: (resource: Omit<Resource, 'id' | 'updatedAt'>) => void;
  toggleStarResource: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  createExamRoadmap: (
    subjectId: string,
    examDate: string,
    targetLevel: 'full_review' | 'refresher'
  ) => ExamRoadmap;
  toggleRoadmapTask: (roadmapId: string, phaseId: string, taskId: string) => void;
  getRoadmapBySubjectId: (subjectId: string) => ExamRoadmap | undefined;
  createSubject: (data: {
    code: string;
    name: string;
    instructor: string;
    examDate?: string;
    color?: string;
  }) => Promise<void>;
  createDeadline: (data: {
    subjectId: string;
    title: string;
    type?: string;
    dueDate: string;
  }) => Promise<void>;
  resetDemoData: () => Promise<void>;
  ingestionNotice: IngestionNotice | null;
  triggerIngestionNotice: (notice: Omit<IngestionNotice, 'id'>) => void;
  dismissIngestionNotice: () => void;
  refreshData: () => Promise<void>;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [milestones, setMilestones] = useState<StudyMilestone[]>(mockStudyMilestones);
  const [profile, setProfile] = useState<StudentProfile>(mockStudentProfile);
  const [selectedSemester, setSelectedSemester] = useState<Semester>(mockSemesters[0]);
  const [activeFocusTopic, setActiveFocusTopic] = useState<SyllabusTopic | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [roadmaps, setRoadmaps] = useState<ExamRoadmap[]>(mockInitialRoadmaps);
  const [isLoading, setIsLoading] = useState(true);
  const [ingestionNotice, setIngestionNotice] = useState<IngestionNotice | null>(null);
  const [activeView, setActiveView] = useState<NavItemKey>('dashboard');

  const refreshData = async () => {
    try {
      const data = await getSemesterData();
      setSubjects(data.subjects);
      setDeadlines(data.deadlines);
      setResources(data.resources);
      if (data.roadmaps && data.roadmaps.length > 0) {
        setRoadmaps(data.roadmaps);
      }
      updateSubjectReadiness(data.subjects);
    } catch (err) {
      console.error('Failed to refresh data from SQLite:', err);
    }
  };

  const triggerIngestionNotice = (notice: Omit<IngestionNotice, 'id'>) => {
    setIngestionNotice({
      ...notice,
      id: `notice-${Date.now()}`,
    });
  };

  const dismissIngestionNotice = () => {
    setIngestionNotice(null);
  };

  const updateSubjectReadiness = (updatedSubjects: Subject[]) => {
    if (updatedSubjects.length === 0) {
      setProfile((prev) => ({ ...prev, averageReadiness: 0 }));
      return;
    }
    const totalReadiness = updatedSubjects.reduce((acc, curr) => acc + curr.readinessScore, 0);
    const avgReadiness = Number((totalReadiness / updatedSubjects.length).toFixed(1));
    setProfile((prev) => ({ ...prev, averageReadiness: avgReadiness }));
  };

  // Load initial data from SQLite via Server Action on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getSemesterData();
        if (!isMounted) return;

        setSubjects(data.subjects);
        setDeadlines(data.deadlines);
        setResources(data.resources);
        if (data.roadmaps && data.roadmaps.length > 0) {
          setRoadmaps(data.roadmaps);
        }
        updateSubjectReadiness(data.subjects);
      } catch (err) {
        console.error('Failed to load initial data from SQLite:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const cycleTopicStatus = (subjectId: string, topicId: string) => {
    let nextDbStatus: 'UNTOUCHED' | 'IN_PROGRESS' | 'MASTERED' = 'IN_PROGRESS';

    const currentSubject = subjects.find((s) => s.id === subjectId);
    const currentTopic = currentSubject?.syllabusUnits
      ?.flatMap((u) => u.topics)
      .find((t) => t.id === topicId);

    if (currentTopic) {
      if (currentTopic.status === 'untouched') nextDbStatus = 'IN_PROGRESS';
      else if (currentTopic.status === 'in_progress') nextDbStatus = 'MASTERED';
      else nextDbStatus = 'UNTOUCHED';
    }

    setSubjects((prevSubjects) => {
      const updated = prevSubjects.map((sub) => {
        if (sub.id !== subjectId || !sub.syllabusUnits) return sub;

        let totalTopics = 0;
        let masteredCount = 0;
        let inProgressCount = 0;

        const updatedUnits = sub.syllabusUnits.map((unit) => {
          const updatedTopics = unit.topics.map((top) => {
            let nextStatus = top.status;
            if (top.id === topicId) {
              if (top.status === 'untouched') nextStatus = 'in_progress';
              else if (top.status === 'in_progress') nextStatus = 'mastered';
              else nextStatus = 'untouched';
            }

            totalTopics += 1;
            if (nextStatus === 'mastered') masteredCount += 1;
            else if (nextStatus === 'in_progress') inProgressCount += 1;

            return { ...top, status: nextStatus };
          });
          return { ...unit, topics: updatedTopics };
        });

        const computedScore = totalTopics > 0
          ? Math.round(((masteredCount * 1.0 + inProgressCount * 0.5) / totalTopics) * 100)
          : sub.readinessScore;

        return {
          ...sub,
          syllabusUnits: updatedUnits,
          readinessScore: computedScore,
          syllabusTopics: {
            completed: masteredCount,
            total: totalTopics,
          },
        };
      });

      updateSubjectReadiness(updated);
      return updated;
    });

    // Persist to SQLite
    serverToggleTopicStatus(topicId, nextDbStatus).catch((err) => {
      console.error('Failed to persist topic status:', err);
    });
  };

  const setTopicStatus = (subjectId: string, topicId: string, status: TopicStatus) => {
    setSubjects((prevSubjects) => {
      const updated = prevSubjects.map((sub) => {
        if (sub.id !== subjectId || !sub.syllabusUnits) return sub;

        let totalTopics = 0;
        let masteredCount = 0;
        let inProgressCount = 0;

        const updatedUnits = sub.syllabusUnits.map((unit) => {
          const updatedTopics = unit.topics.map((top) => {
            const nextStatus = top.id === topicId ? status : top.status;
            totalTopics += 1;
            if (nextStatus === 'mastered') masteredCount += 1;
            else if (nextStatus === 'in_progress') inProgressCount += 1;

            return { ...top, status: nextStatus };
          });
          return { ...unit, topics: updatedTopics };
        });

        const computedScore = totalTopics > 0
          ? Math.round(((masteredCount * 1.0 + inProgressCount * 0.5) / totalTopics) * 100)
          : sub.readinessScore;

        return {
          ...sub,
          syllabusUnits: updatedUnits,
          readinessScore: computedScore,
          syllabusTopics: {
            completed: masteredCount,
            total: totalTopics,
          },
        };
      });

      updateSubjectReadiness(updated);
      return updated;
    });

    const dbStatus =
      status === 'mastered'
        ? 'MASTERED'
        : status === 'in_progress'
        ? 'IN_PROGRESS'
        : 'UNTOUCHED';
    serverToggleTopicStatus(topicId, dbStatus).catch((err) => {
      console.error('Failed to persist topic status:', err);
    });
  };

  const toggleMilestone = (id: string) => {
    let nextCompleted = true;
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          nextCompleted = !m.completed;
          return { ...m, completed: nextCompleted };
        }
        return m;
      })
    );
    serverToggleMilestone(id, nextCompleted).catch((err) => {
      console.error('Failed to persist milestone status:', err);
    });
  };

  const toggleDeadline = (id: string) => {
    let isSubmitted = false;
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'submitted' ? 'pending' : 'submitted';
          isSubmitted = nextStatus === 'submitted';
          return {
            ...d,
            status: nextStatus,
            urgencyLevel: nextStatus === 'submitted' ? 'normal' : d.urgencyLevel,
          };
        }
        return d;
      })
    );
    serverToggleDeadlineStatus(id, isSubmitted).catch((err) => {
      console.error('Failed to persist deadline status:', err);
    });
  };

  const getSubjectById = (id: string) => {
    return subjects.find((s) => s.id === id || s.code.toLowerCase() === id.toLowerCase());
  };

  const addResource = (resourceData: Omit<Resource, 'id' | 'updatedAt'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: `res-${Date.now()}`,
      updatedAt: 'Just now',
    };
    setResources((prev) => [newResource, ...prev]);

    // Update subject resource count
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === resourceData.subjectId) {
          const notesCount =
            resourceData.type === 'note' ? sub.resources.notesCount + 1 : sub.resources.notesCount;
          const labsCount =
            resourceData.type === 'lab' || resourceData.type === 'code'
              ? sub.resources.labsCount + 1
              : sub.resources.labsCount;
          const pastPapersCount =
            resourceData.type === 'past_paper' || resourceData.type === 'formula_sheet'
              ? sub.resources.pastPapersCount + 1
              : sub.resources.pastPapersCount;

          return {
            ...sub,
            resources: {
              ...sub.resources,
              notesCount,
              labsCount,
              pastPapersCount,
            },
          };
        }
        return sub;
      })
    );
  };

  const toggleStarResource = (id: string) => {
    setResources((prev) =>
      prev.map((res) => (res.id === id ? { ...res, isStarred: !res.isStarred } : res))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const createExamRoadmap = (
    subjectId: string,
    examDate: string,
    targetLevel: 'full_review' | 'refresher'
  ): ExamRoadmap => {
    const targetSub = subjects.find((s) => s.id === subjectId) || subjects[0] || {
      id: subjectId || 'general',
      code: 'GEN-101',
      name: 'General Engineering',
    };
    const examTargetTime = new Date(examDate).getTime();
    const nowTime = Date.now();
    const diffDays = Math.max(2, Math.ceil((examTargetTime - nowTime) / (1000 * 60 * 60 * 24)));

    const isFullReview = targetLevel === 'full_review';
    const phase1Days = Math.max(1, Math.round(diffDays * 0.5));
    const phase2Days = Math.max(1, Math.round(diffDays * 0.3));
    const phase3Days = Math.max(1, diffDays - phase1Days - phase2Days);

    const phases: RoadmapPhase[] = [
      {
        id: `phase-${Date.now()}-1`,
        phaseNumber: 1,
        title: 'Phase 1: Foundation Pass',
        daysRange: `Days T-${diffDays} to T-${diffDays - phase1Days + 1}`,
        focusDescription: isFullReview
          ? 'Comprehensive concept mastery across all core syllabus units.'
          : 'High-speed concept brush-up and formula sheet verification.',
        tasks: [
          {
            id: `task-${Date.now()}-1`,
            title: `Review core concept notes & definitions for ${targetSub.code} Units 1 & 2`,
            completed: false,
            estimatedHours: isFullReview ? 2.5 : 1.0,
            type: 'concept',
            unitReference: 'Unit 1 & 2',
          },
          {
            id: `task-${Date.now()}-2`,
            title: `Study formula cheat sheets and identity equations`,
            completed: false,
            estimatedHours: 1.5,
            type: 'formula',
            unitReference: 'Formulas',
          },
          {
            id: `task-${Date.now()}-3`,
            title: `Identify and tag all red (🔴) untouched topics in the Syllabus Matrix`,
            completed: false,
            estimatedHours: 1.0,
            type: 'concept',
            unitReference: 'Matrix',
          },
        ],
      },
      {
        id: `phase-${Date.now()}-2`,
        phaseNumber: 2,
        title: 'Phase 2: Active Practice',
        daysRange: `Days T-${diffDays - phase1Days} to T-${diffDays - phase1Days - phase2Days + 1}`,
        focusDescription: 'Problem-solving banks, laboratory algorithm implementation, and numerical drills.',
        tasks: [
          {
            id: `task-${Date.now()}-4`,
            title: `Solve 4 standard numeric questions from past midterm papers`,
            completed: false,
            estimatedHours: 2.5,
            type: 'pyq',
            unitReference: 'Problem Set',
          },
          {
            id: `task-${Date.now()}-5`,
            title: `Run and trace key STEM code algorithms (e.g. simulation scripts)`,
            completed: false,
            estimatedHours: 2.0,
            type: 'code',
            unitReference: 'Lab Code',
          },
          {
            id: `task-${Date.now()}-6`,
            title: `Elevate at least 3 untouched topics to in-progress (🟡)`,
            completed: false,
            estimatedHours: 1.5,
            type: 'concept',
            unitReference: 'Mastery',
          },
        ],
      },
      {
        id: `phase-${Date.now()}-3`,
        phaseNumber: 3,
        title: 'Phase 3: Exam Simulation',
        daysRange: `Days T-${Math.max(1, phase3Days)} to T-1 (Exam Eve)`,
        focusDescription: 'Full-length timed question papers, rapid formula recall, and zero-defect weak spot clearance.',
        tasks: [
          {
            id: `task-${Date.now()}-7`,
            title: `Attempt full 2024 university end-term paper under strict exam timing`,
            completed: false,
            estimatedHours: 3.0,
            type: 'pyq',
            unitReference: 'Exam Prep',
          },
          {
            id: `task-${Date.now()}-8`,
            title: `Execute 15-minute formula speed recall without looking at notes`,
            completed: false,
            estimatedHours: 1.0,
            type: 'formula',
            unitReference: 'Memory',
          },
          {
            id: `task-${Date.now()}-9`,
            title: `Verify final exam readiness gauge reaches 85%+ on StudyPulse`,
            completed: false,
            estimatedHours: 0.5,
            type: 'concept',
            unitReference: 'Readiness',
          },
        ],
      },
    ];

    const totalTasksCount = phases.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasksCount = phases.reduce(
      (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
      0
    );

    const newRoadmap: ExamRoadmap = {
      id: `roadmap-${targetSub.id}`,
      subjectId: targetSub.id,
      subjectCode: targetSub.code,
      subjectName: targetSub.name,
      examDate,
      targetLevel,
      phases,
      completedTasksCount,
      totalTasksCount,
    };

    setRoadmaps((prev) => {
      const filtered = prev.filter((r) => r.subjectId !== targetSub.id);
      return [newRoadmap, ...filtered];
    });

    return newRoadmap;
  };

  const toggleRoadmapTask = (roadmapId: string, phaseId: string, taskId: string) => {
    let nextCompleted = true;
    setRoadmaps((prevRoadmaps) =>
      prevRoadmaps.map((r) => {
        if (r.id !== roadmapId) return r;

        let totalCompleted = 0;
        let totalCount = 0;

        const updatedPhases = r.phases.map((p) => {
          const updatedTasks = p.tasks.map((t) => {
            if (t.id === taskId) {
              nextCompleted = !t.completed;
              return { ...t, completed: nextCompleted };
            }
            return t;
          });

          updatedTasks.forEach((t) => {
            totalCount += 1;
            if (t.completed) totalCompleted += 1;
          });

          return { ...p, tasks: updatedTasks };
        });

        // Boost readiness score when roadmap tasks are completed
        const roadmapBoost = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 15) : 0;
        setSubjects((prevSubjects) =>
          prevSubjects.map((sub) => {
            if (sub.id === r.subjectId) {
              return {
                ...sub,
                readinessScore: Math.min(100, sub.readinessScore + (nextCompleted ? 2 : -2)),
              };
            }
            return sub;
          })
        );

        return { ...r, phases: updatedPhases };
      })
    );

    // Persist milestone in SQLite
    serverToggleMilestone(taskId, nextCompleted).catch((err) => {
      console.error('Failed to toggle milestone:', err);
    });
  };

  const getRoadmapBySubjectId = (subjectId: string) => {
    return roadmaps.find((r) => r.subjectId === subjectId);
  };

  const createSubject = async (data: {
    code: string;
    name: string;
    instructor: string;
    examDate?: string;
    color?: string;
  }) => {
    const created = await serverCreateSubject(data);
    if (created) {
      setSubjects((prev) => [...prev, created]);
      updateSubjectReadiness([...subjects, created]);

      // Add feedback notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Course Enrolled: ${created.code}`,
        message: `${created.name} (${created.instructor}) has been added to your semester curriculum.`,
        timeAgo: 'Just now',
        type: 'success',
        category: 'system',
        isRead: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const createDeadline = async (data: {
    subjectId: string;
    title: string;
    type?: string;
    dueDate: string;
  }) => {
    const created = await serverCreateDeadline(data);
    if (created) {
      setDeadlines((prev) => [...prev, created]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Deadline Scheduled: ${created.subjectCode}`,
        message: `${created.title} has been added. Due on ${new Date(created.dueDate).toLocaleDateString()}.`,
        timeAgo: 'Just now',
        type: 'info',
        category: 'deadline',
        isRead: false,
        actionLabel: 'View Deadlines',
        actionHref: '/',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      const freshData = await serverResetDemoData();
      setSubjects(freshData.subjects);
      setDeadlines(freshData.deadlines);
      setResources(freshData.resources);
      if (freshData.roadmaps.length > 0) {
        setRoadmaps(freshData.roadmaps);
      }
      updateSubjectReadiness(freshData.subjects);

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Demo Data Reset',
        message: 'Loaded 3 engineering courses (OS, DSA, DBMS) with verified syllabus topics, lab code, and PYQs.',
        timeAgo: 'Just now',
        type: 'success',
        category: 'system',
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      triggerIngestionNotice({
        title: 'Database Reset Complete',
        message: 'Database reset to initial demo state. OS, DSA, and DBMS benchmark courses restored.',
      });
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      subjects,
      deadlines,
      milestones,
      profile,
      selectedSemester,
      activeFocusTopic,
      resources,
      notifications,
      unreadNotificationCount,
      roadmaps,
      isLoading,
      activeView,
      setActiveView,
      ingestionNotice,
      triggerIngestionNotice,
      dismissIngestionNotice,
      refreshData,
      setSelectedSemester,
      setFocusTopic: setActiveFocusTopic,
      cycleTopicStatus,
      setTopicStatus,
      toggleMilestone,
      toggleDeadline,
      getSubjectById,
      addResource,
      toggleStarResource,
      markNotificationRead,
      markAllNotificationsRead,
      createExamRoadmap,
      toggleRoadmapTask,
      getRoadmapBySubjectId,
      createSubject,
      createDeadline,
      resetDemoData,
    }),
    [
      subjects,
      deadlines,
      milestones,
      profile,
      selectedSemester,
      activeFocusTopic,
      resources,
      notifications,
      unreadNotificationCount,
      roadmaps,
      isLoading,
      activeView,
      ingestionNotice,
    ]
  );

  return (
    <AcademicContext.Provider value={value}>
      {children}
      <IngestionToast notice={ingestionNotice} onDismiss={dismissIngestionNotice} />
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
}
