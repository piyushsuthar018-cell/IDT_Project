export type NavItemKey = 'dashboard' | 'subjects' | 'calendar' | 'war-room' | 'matrix' | 'locker' | 'settings';

export type UrgencyLevel = 'urgent' | 'soon' | 'normal';

export type AssessmentType = 'exam' | 'assignment' | 'lab_report' | 'quiz' | 'project';

export type ResourceType = 'note' | 'lab' | 'past_paper' | 'formula_sheet' | 'cheatsheet' | 'slide' | 'code';

export type TopicStatus = 'untouched' | 'in_progress' | 'mastered';

export type TopicImportance = 'high_yield' | 'core' | 'standard';

export interface SyllabusTopic {
  id: string;
  title: string;
  status: TopicStatus;
  importance: TopicImportance;
  estimatedMinutes?: number;
  notesSummary?: string;
  formulaReference?: string;
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  weightPercentage: number;
  topics: SyllabusTopic[];
}

export interface SubjectResourceCounts {
  notesCount: number;
  labsCount: number;
  pastPapersCount: number;
  slidesCount: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  instructor: string;
  instructorEmail?: string;
  room?: string;
  color: string;
  accentGradient: string;
  nextExamDate: string;
  nextExamTitle: string;
  daysUntilExam: number;
  examType: 'Mid-Term' | 'End-Term' | 'Quiz' | 'Practical';
  readinessScore: number;
  resources: SubjectResourceCounts;
  syllabusTopics: {
    completed: number;
    total: number;
  };
  syllabusUnits?: SyllabusUnit[];
  creditHours: number;
}

export interface Deadline {
  id: string;
  title: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  type: AssessmentType;
  dueDate: string;
  urgencyLevel: UrgencyLevel;
  weightPercentage: number;
  status: 'pending' | 'submitted' | 'in_progress';
  points?: number;
  description?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  subjectId: string;
  subjectCode: string;
  fileSize: string;
  format: 'PDF' | 'ZIP' | 'DOCX' | 'MD' | 'IPYNB' | 'PY' | 'CPP' | 'SQL' | 'C';
  updatedAt: string;
  downloadUrl?: string;
  isStarred?: boolean;
  tags: string[];
  unitNumber?: number;
  language?: 'python' | 'cpp' | 'sql' | 'c' | 'markdown';
  codeSnippet?: string;
  pageCount?: number;
  tableOfContents?: string[];
  keyConcepts?: string;
  complexity?: string;
}

export interface StudyMilestone {
  id: string;
  title: string;
  subjectCode: string;
  dueDate: string;
  completed: boolean;
  estimatedMinutes: number;
  priority: 'high' | 'medium' | 'low';
  relatedExamId?: string;
  topicTag?: string;
}

export interface Semester {
  id: string;
  code: string;
  name: string;
  department: string;
  isCurrent: boolean;
  totalCredits: number;
  gpa: number;
  targetGpa: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  initials: string;
  email: string;
  program: string;
  department: string;
  semesterName: string;
  batch: string;
  gpa: number;
  studyStreakDays: number;
  averageReadiness: number;
}

export type NotificationCategory = 'deadline' | 'roadmap' | 'weak_spot' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'urgent' | 'info' | 'success';
  category?: NotificationCategory;
  isRead: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
  type: 'concept' | 'code' | 'pyq' | 'formula';
  unitReference?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: 1 | 2 | 3;
  title: string;
  daysRange: string; // e.g. "T-10 to T-6"
  focusDescription: string;
  tasks: RoadmapTask[];
}

export interface ExamRoadmap {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  examDate: string;
  targetLevel: 'full_review' | 'refresher';
  phases: RoadmapPhase[];
  completedTasksCount: number;
  totalTasksCount: number;
}
