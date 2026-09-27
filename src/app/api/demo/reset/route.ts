import { NextResponse } from 'next/server';
import { seedDatabase } from '../../../../../prisma/seed';
import { getSemesterData } from '@/app/actions/academic';

export async function POST() {
  try {
    const startTime = Date.now();
    await seedDatabase();
    const freshData = await getSemesterData();
    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Database reset to initial demo state in ${elapsed}ms.`,
      coursesCount: freshData.subjects.length,
      deadlinesCount: freshData.deadlines.length,
      resourcesCount: freshData.resources.length,
      data: freshData,
    });
  } catch (error: any) {
    console.error('Failed to execute demo reset:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset demo data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
