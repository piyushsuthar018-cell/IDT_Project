'use server';

import { prisma } from '@/lib/prisma';
import {
  mapPrismaSubject,
  mapPrismaDeadline,
  mapPrismaResource,
  buildRoadmapFromMilestones,
} from '@/lib/mappers';
import { Subject, Deadline, Resource, ExamRoadmap } from '@/types/academic';
import { seedDatabase } from '../../../prisma/seed';

export interface SemesterDataResponse {
  subjects: Subject[];
  deadlines: Deadline[];
  resources: Resource[];
  roadmaps: ExamRoadmap[];
}

export async function getSemesterData(): Promise<SemesterDataResponse> {
  try {
    const rawSubjects = await prisma.subject.findMany({
      include: {
        units: {
          include: {
            topics: true,
          },
          orderBy: {
            unitNumber: 'asc',
          },
        },
        deadlines: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        resources: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        milestones: {
          orderBy: {
            phase: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Fetch all deadlines (including global semester milestones where subjectId is null)
    const rawDeadlines = await prisma.deadline.findMany({
      include: {
        subject: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    const nowTime = Date.now();
    // Resolve upcoming exam deadline across semester (e.g. Mid-Sem)
    const nextUpcomingExam = rawDeadlines.find(
      (d) => d.type === 'exam' && new Date(d.dueDate).getTime() >= nowTime
    ) || rawDeadlines.find((d) => d.type === 'exam') || null;

    const subjects: Subject[] = rawSubjects.map((sub) =>
      mapPrismaSubject(sub, nextUpcomingExam)
    );

    const deadlines: Deadline[] = rawDeadlines.map((d) =>
      mapPrismaDeadline(d, d.subject?.code || 'SEMESTER', d.subject?.name || 'Academic Calendar')
    );

    // Flatten all resources
    const resources: Resource[] = [];
    rawSubjects.forEach((sub) => {
      sub.resources.forEach((r) => {
        resources.push(mapPrismaResource(r, sub.code));
      });
    });

    // Build roadmaps for subjects
    const roadmaps: ExamRoadmap[] = rawSubjects.map((sub) =>
      buildRoadmapFromMilestones(sub.id, sub.code, sub.milestones, sub.examDate)
    );

    return {
      subjects,
      deadlines,
      resources,
      roadmaps,
    };
  } catch (error) {
    console.error('Failed to getSemesterData from SQLite:', error);
    return {
      subjects: [],
      deadlines: [],
      resources: [],
      roadmaps: [],
    };
  }
}

export async function createSubject(data: {
  code: string;
  name: string;
  instructor?: string;
  examDate?: string;
  color?: string;
}): Promise<Subject | null> {
  try {
    let examDateVal = data.examDate ? new Date(data.examDate) : null;
    if (!examDateVal) {
      const upcomingExam = await prisma.deadline.findFirst({
        where: {
          type: 'exam',
          dueDate: { gte: new Date() },
        },
        orderBy: { dueDate: 'asc' },
      });
      if (upcomingExam) {
        examDateVal = upcomingExam.dueDate;
      }
    }

    const newSubject = await prisma.subject.create({
      data: {
        code: data.code.toUpperCase().trim(),
        name: data.name.trim(),
        instructor: data.instructor ? data.instructor.trim() : '',
        examDate: examDateVal,
        color: data.color || 'indigo',
        units: {
          create: [
            {
              unitNumber: 1,
              title: `Unit 1: Fundamentals of ${data.name.trim()}`,
              topics: {
                create: [
                  { title: 'Core Definitions & Foundations', status: 'IN_PROGRESS' },
                  { title: 'Theoretical Frameworks & Principles', status: 'UNTOUCHED' },
                  { title: 'Primary Problem Models', status: 'UNTOUCHED' },
                ],
              },
            },
            {
              unitNumber: 2,
              title: `Unit 2: Applied Methodologies`,
              topics: {
                create: [
                  { title: 'Algorithmic Formulations', status: 'UNTOUCHED' },
                  { title: 'Implementation & Trace Analysis', status: 'UNTOUCHED' },
                ],
              },
            },
          ],
        },
        milestones: {
          create: [
            { phase: 1, title: 'Review core concepts in Unit 1', isCompleted: false },
            { phase: 2, title: 'Solve textbook exercise set', isCompleted: false },
            { phase: 3, title: 'Attempt timed past paper questions', isCompleted: false },
          ],
        },
      },
      include: {
        units: {
          include: {
            topics: true,
          },
        },
        deadlines: true,
        resources: true,
        milestones: true,
      },
    });

    return mapPrismaSubject(newSubject);
  } catch (error) {
    console.error('Failed to createSubject in SQLite:', error);
    return null;
  }
}

export async function createDeadline(data: {
  subjectId?: string | null;
  title: string;
  type?: string;
  dueDate: string;
}): Promise<Deadline | null> {
  try {
    const subject = data.subjectId
      ? await prisma.subject.findUnique({
          where: { id: data.subjectId },
          select: { code: true, name: true },
        })
      : null;

    const newDeadline = await prisma.deadline.create({
      data: {
        subjectId: data.subjectId || null,
        title: data.title.trim(),
        type: data.type || 'assignment',
        dueDate: new Date(data.dueDate),
        status: 'pending',
      },
    });

    return mapPrismaDeadline(newDeadline, subject?.code || 'SEMESTER', subject?.name || 'Academic Calendar');
  } catch (error) {
    console.error('Failed to createDeadline in SQLite:', error);
    return null;
  }
}

export async function toggleTopicStatus(
  topicId: string,
  nextStatus: 'UNTOUCHED' | 'IN_PROGRESS' | 'MASTERED'
): Promise<boolean> {
  try {
    await prisma.syllabusTopic.update({
      where: { id: topicId },
      data: { status: nextStatus },
    });
    return true;
  } catch (error) {
    console.error('Failed to toggleTopicStatus in SQLite:', error);
    return false;
  }
}

export async function toggleDeadlineStatus(
  deadlineId: string,
  isSubmitted: boolean
): Promise<boolean> {
  try {
    await prisma.deadline.update({
      where: { id: deadlineId },
      data: { status: isSubmitted ? 'submitted' : 'pending' },
    });
    return true;
  } catch (error) {
    console.error('Failed to toggleDeadlineStatus in SQLite:', error);
    return false;
  }
}

export async function toggleMilestone(
  milestoneId: string,
  isCompleted: boolean
): Promise<boolean> {
  try {
    await prisma.roadmapMilestone.update({
      where: { id: milestoneId },
      data: { isCompleted },
    });
    return true;
  } catch (error) {
    console.error('Failed to toggleMilestone in SQLite:', error);
    return false;
  }
}

export async function resetDemoData(): Promise<SemesterDataResponse> {
  try {
    await seedDatabase();
    return await getSemesterData();
  } catch (error) {
    console.error('Failed to resetDemoData in SQLite:', error);
    return {
      subjects: [],
      deadlines: [],
      resources: [],
      roadmaps: [],
    };
  }
}
