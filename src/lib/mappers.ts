import {
  Subject as PrismaSubject,
  SyllabusUnit as PrismaUnit,
  SyllabusTopic as PrismaTopic,
  Deadline as PrismaDeadline,
  Resource as PrismaResource,
  RoadmapMilestone as PrismaMilestone,
} from '@prisma/client';
import {
  Subject,
  SyllabusUnit,
  SyllabusTopic,
  Deadline,
  Resource,
  UrgencyLevel,
  AssessmentType,
  ResourceType,
  TopicStatus,
  ExamRoadmap,
  RoadmapPhase,
  RoadmapTask,
} from '@/types/academic';

type FullPrismaSubject = PrismaSubject & {
  units: (PrismaUnit & { topics: PrismaTopic[] })[];
  deadlines: PrismaDeadline[];
  resources: PrismaResource[];
  milestones: PrismaMilestone[];
};

export function mapPrismaTopic(t: PrismaTopic): SyllabusTopic {
  let status: TopicStatus = 'untouched';
  const rawStatus = t.status.toLowerCase();
  if (rawStatus === 'mastered') status = 'mastered';
  else if (rawStatus === 'in_progress') status = 'in_progress';
  else status = 'untouched';

  return {
    id: t.id,
    title: t.title,
    status,
    importance: 'core',
    estimatedMinutes: 45,
  };
}

export function mapPrismaUnit(u: PrismaUnit & { topics: PrismaTopic[] }): SyllabusUnit {
  return {
    id: u.id,
    unitNumber: u.unitNumber,
    title: u.title,
    weightPercentage: 25,
    topics: u.topics.map(mapPrismaTopic),
  };
}

export function mapPrismaSubject(
  s: FullPrismaSubject,
  fallbackExamDeadline?: PrismaDeadline | null
): Subject {
  const units = s.units.map(mapPrismaUnit);

  let totalTopics = 0;
  let masteredCount = 0;
  let inProgressCount = 0;

  units.forEach((unit) => {
    unit.topics.forEach((top) => {
      totalTopics += 1;
      if (top.status === 'mastered') masteredCount += 1;
      else if (top.status === 'in_progress') inProgressCount += 1;
    });
  });

  const readinessScore =
    totalTopics > 0
      ? Math.round(((masteredCount * 1.0 + inProgressCount * 0.5) / totalTopics) * 100)
      : 0;

  // Resolve upcoming exam date and title
  const nowTime = Date.now();
  let targetExamDate: Date | null = null;
  let targetExamTitle = '';

  // 1. Check subject-specific exam deadlines
  const subjectExamDeadlines = (s.deadlines || [])
    .filter((d) => d.type === 'exam' && new Date(d.dueDate).getTime() >= nowTime)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (subjectExamDeadlines.length > 0) {
    targetExamDate = new Date(subjectExamDeadlines[0].dueDate);
    targetExamTitle = subjectExamDeadlines[0].title;
  } else if (s.examDate) {
    targetExamDate = new Date(s.examDate);
    if (fallbackExamDeadline) {
      targetExamTitle = fallbackExamDeadline.title;
    }
  } else if (fallbackExamDeadline) {
    targetExamDate = new Date(fallbackExamDeadline.dueDate);
    targetExamTitle = fallbackExamDeadline.title;
  }

  // Calculate dynamic days until exam based on real date diff
  let daysUntilExam = 0;
  let examDateStr = '';
  if (targetExamDate) {
    const diffTime = targetExamDate.getTime() - nowTime;
    daysUntilExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    examDateStr = targetExamDate.toISOString();
  }

  // Determine exam type and title dynamically
  let examType: 'Mid-Term' | 'End-Term' | 'Quiz' | 'Practical' = 'Mid-Term';
  let nextExamTitle = 'Mid-Semester Examination';

  const titleLower = targetExamTitle.toLowerCase();
  if (titleLower.includes('end') || titleLower.includes('final')) {
    examType = 'End-Term';
    nextExamTitle = targetExamTitle || 'End-Semester Theory Exam';
  } else if (titleLower.includes('quiz')) {
    examType = 'Quiz';
    nextExamTitle = targetExamTitle || 'Continuous Assessment Quiz';
  } else if (titleLower.includes('practical') || titleLower.includes('lab')) {
    examType = 'Practical';
    nextExamTitle = targetExamTitle || 'Practical Examination';
  } else if (titleLower.includes('mid') || titleLower.includes('sessional') || titleLower.includes('internal')) {
    examType = 'Mid-Term';
    nextExamTitle = targetExamTitle || 'Mid-Semester Examination';
  } else if (targetExamTitle) {
    nextExamTitle = targetExamTitle;
    examType = daysUntilExam > 45 ? 'End-Term' : 'Mid-Term';
  } else {
    examType = daysUntilExam > 45 ? 'End-Term' : 'Mid-Term';
    nextExamTitle = examType === 'End-Term' ? 'End-Semester Examination' : 'Mid-Semester Examination';
  }

  // Count resources
  const notesCount = s.resources.filter((r) => r.fileType === 'notes' || r.fileType === 'pdf').length;
  const labsCount = s.resources.filter((r) => r.fileType === 'code').length;
  const pastPapersCount = s.resources.filter((r) => r.fileType === 'past_paper' || r.fileType === 'formula_sheet').length;

  return {
    id: s.id,
    code: s.code,
    name: s.name,
    instructor: s.instructor || '',
    instructorEmail: s.instructor ? `${s.instructor.toLowerCase().replace(/[^a-z0-9]/g, '.')}@university.edu` : undefined,
    room: undefined,
    color: s.color || 'indigo',
    accentGradient: 'from-indigo-500/10 to-indigo-500/0',
    nextExamDate: examDateStr,
    nextExamTitle,
    daysUntilExam,
    examType,
    readinessScore,
    resources: {
      notesCount,
      labsCount,
      pastPapersCount,
      slidesCount: 0,
    },
    syllabusTopics: {
      completed: masteredCount,
      total: totalTopics,
    },
    syllabusUnits: units,
    creditHours: 4,
  };
}

export function mapPrismaDeadline(
  d: PrismaDeadline,
  subjectCode?: string,
  subjectName?: string
): Deadline {
  const diffHours = (new Date(d.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);

  let urgencyLevel: UrgencyLevel = 'normal';
  if (d.status === 'submitted') {
    urgencyLevel = 'normal';
  } else if (diffHours <= 48 && diffHours > 0) {
    urgencyLevel = 'urgent';
  } else if (diffHours <= 120 && diffHours > 0) {
    urgencyLevel = 'soon';
  }

  let type: AssessmentType = 'assignment';
  if (['exam', 'assignment', 'lab_report', 'quiz', 'project'].includes(d.type)) {
    type = d.type as AssessmentType;
  }

  return {
    id: d.id,
    title: d.title,
    subjectId: d.subjectId || 'global',
    subjectCode: subjectCode || (d.subjectId ? 'COURSE' : 'TERM'),
    subjectName: subjectName || (d.subjectId ? 'Course' : 'Academic Calendar'),
    type,
    dueDate: d.dueDate.toISOString(),
    urgencyLevel,
    weightPercentage: 15,
    status: d.status === 'submitted' ? 'submitted' : 'pending',
    points: 100,
  };
}

export function mapPrismaResource(
  r: PrismaResource,
  subjectCode?: string
): Resource {
  let format: Resource['format'] = 'PDF';
  if (r.fileType === 'code') {
    if (r.fileUrl.endsWith('.py')) format = 'PY';
    else if (r.fileUrl.endsWith('.cpp')) format = 'CPP';
    else if (r.fileUrl.endsWith('.sql')) format = 'SQL';
    else if (r.fileUrl.endsWith('.c')) format = 'C';
    else format = 'PY';
  } else if (r.fileType === 'formula_sheet') {
    format = 'PDF';
  }

  let type: ResourceType = 'note';
  if (r.fileType === 'code') type = 'code';
  else if (r.fileType === 'past_paper') type = 'past_paper';
  else if (r.fileType === 'formula_sheet') type = 'formula_sheet';

  return {
    id: r.id,
    title: r.title,
    type,
    subjectId: r.subjectId,
    subjectCode: subjectCode || 'COURSE',
    fileSize: r.fileSize || '1.4 MB',
    format,
    updatedAt: r.createdAt.toISOString(),
    downloadUrl: r.fileUrl,
    isStarred: r.isStarred,
    tags: [r.fileType, subjectCode || 'Course'],
    unitNumber: r.unitNumber || undefined,
  };
}

export function buildRoadmapFromMilestones(
  subjectId: string,
  subjectCode: string,
  milestones: PrismaMilestone[],
  examDate?: Date | null
): ExamRoadmap {
  const p1Milestones = milestones.filter((m) => m.phase === 1);
  const p2Milestones = milestones.filter((m) => m.phase === 2);
  const p3Milestones = milestones.filter((m) => m.phase === 3);

  const formatTasks = (list: PrismaMilestone[], type: RoadmapTask['type']): RoadmapTask[] => {
    return list.map((m) => ({
      id: m.id,
      title: m.title,
      completed: m.isCompleted,
      estimatedHours: 2.0,
      type,
    }));
  };

  const phases: RoadmapPhase[] = [
    {
      id: `phase-${subjectId}-1`,
      phaseNumber: 1,
      title: 'Phase 1: Foundation Pass',
      daysRange: 'Days T-10 to T-6',
      focusDescription: 'Core syllabus coverage, definitions, and theory clearance.',
      tasks: formatTasks(p1Milestones, 'concept'),
    },
    {
      id: `phase-${subjectId}-2`,
      phaseNumber: 2,
      title: 'Phase 2: Active Practice',
      daysRange: 'Days T-5 to T-3',
      focusDescription: 'Algorithm implementations, problem sets, and numerical drills.',
      tasks: formatTasks(p2Milestones, 'code'),
    },
    {
      id: `phase-${subjectId}-3`,
      phaseNumber: 3,
      title: 'Phase 3: Exam Simulation',
      daysRange: 'Days T-2 to T-1',
      focusDescription: 'Full-length timed PYQs, formula speed recall, and weak spot clearance.',
      tasks: formatTasks(p3Milestones, 'pyq'),
    },
  ];

  const totalTasksCount = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasksCount = phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );

  const dateStr = examDate
    ? examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD';

  return {
    id: `roadmap-${subjectId}`,
    subjectId,
    subjectCode,
    subjectName: subjectCode,
    examDate: dateStr,
    targetLevel: 'full_review',
    phases,
    completedTasksCount,
    totalTasksCount,
  };
}
