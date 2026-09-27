import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

interface ChapterExtraction {
  subjectCode: string;
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  subtopics: string[];
}

function analyzeDocumentMetadata(filename: string): ChapterExtraction {
  // Strip file extension (.pdf, .doc, etc.)
  const rawBase = filename.replace(/\.[^/.]+$/, '').trim();
  const cleanName = rawBase.toLowerCase();

  // Extract unit/chapter number
  let unitNum = 1;
  const unitMatch = rawBase.match(/(?:unit|ch|chapter|mod|module)\D*(\d+)/i);
  if (unitMatch) {
    unitNum = parseInt(unitMatch[1], 10);
  }

  // Check if filename is partitioned by a hyphen / underscore / colon
  // e.g. "Data Structures - Unit 1" or "Machine Learning - Chapter 2"
  let extractedCourseName = '';
  let extractedUnitSubtitle = '';

  const parts = rawBase.split(/\s*[-–—:]\s*/);
  if (parts.length >= 2) {
    extractedCourseName = parts[0].replace(/(?:unit|ch|chapter|mod|module)\D*\d+/gi, '').trim();
    extractedUnitSubtitle = parts.slice(1).join(' - ').trim();
  } else {
    const unitKeywordIndex = rawBase.search(/(?:unit|ch|chapter|mod|module)\D*\d+/i);
    if (unitKeywordIndex > 2) {
      extractedCourseName = rawBase.slice(0, unitKeywordIndex).trim();
      extractedUnitSubtitle = rawBase.slice(unitKeywordIndex).trim();
    }
  }

  // Clean course name
  let subjectName = extractedCourseName.replace(/[_\-]+/g, ' ').trim();

  // Fallback to domain matching or raw tokens if empty
  if (!subjectName || subjectName.length < 2) {
    if (cleanName.includes('dsa') || cleanName.includes('data_structure') || cleanName.includes('data structure')) {
      subjectName = 'Data Structures & Algorithms';
    } else if (cleanName.includes('os') || cleanName.includes('operating_system') || cleanName.includes('operating system')) {
      subjectName = 'Operating Systems';
    } else if (cleanName.includes('dbms') || cleanName.includes('database') || cleanName.includes('sql')) {
      subjectName = 'Database Management Systems';
    } else if (cleanName.includes('network')) {
      subjectName = 'Computer Networks';
    } else {
      const cleanTokens = rawBase.replace(/(?:unit|ch|chapter|mod|module)\D*\d+/gi, '').split(/[_\s-]+/);
      subjectName = cleanTokens
        .filter((w) => w.length > 0)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ') || 'Engineering Course';
    }
  }

  // Capitalize course words properly
  subjectName = subjectName
    .split(/\s+/)
    .map((w) => (w.length <= 3 && !['and', 'for', 'the'].includes(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

  // Generate a clean subject code (e.g. "Data Structures" -> "DS-101", "Operating Systems" -> "OS-301")
  let subjectCode = '';
  const codeInFilename = rawBase.match(/\b([A-Z]{2,4}[-\s]?\d{3})\b/i);
  if (codeInFilename) {
    subjectCode = codeInFilename[1].toUpperCase().replace(/\s+/, '-');
  } else {
    const acronymWords = subjectName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => !['and', '&', 'of', 'the', 'in', 'for', 'to'].includes(w.toLowerCase()));
    if (acronymWords.length === 1) {
      subjectCode = `${acronymWords[0].slice(0, 3).toUpperCase()}-101`;
    } else if (acronymWords.length >= 2) {
      const initials = acronymWords.map((w) => w[0]).join('').toUpperCase().slice(0, 4);
      subjectCode = `${initials}-${unitNum * 100 || 101}`;
    } else {
      subjectCode = 'CS-101';
    }
  }

  // Determine unit title
  let unitTitle = `Unit ${unitNum}`;
  if (extractedUnitSubtitle) {
    const subClean = extractedUnitSubtitle.replace(/^(?:unit|ch|chapter|mod|module)\D*\d+[\s:–-]*/i, '').trim();
    if (subClean) {
      unitTitle = `Unit ${unitNum}: ${subClean}`;
    } else {
      unitTitle = `Unit ${unitNum}: Foundational Concepts`;
    }
  } else if (cleanName.includes('memory') || cleanName.includes('paging')) {
    unitTitle = `Unit ${unitNum}: Memory Management & Paging Architecture`;
  } else if (cleanName.includes('tree') || cleanName.includes('bst')) {
    unitTitle = `Unit ${unitNum}: Balanced Trees & Priority Queues`;
  } else if (cleanName.includes('graph') || cleanName.includes('dijkstra')) {
    unitTitle = `Unit ${unitNum}: Graph Traversal & Shortest Path`;
  } else if (cleanName.includes('relational') || cleanName.includes('sql')) {
    unitTitle = `Unit ${unitNum}: Relational Algebra & Advanced SQL`;
  } else if (cleanName.includes('process') || cleanName.includes('concurren')) {
    unitTitle = `Unit ${unitNum}: Process Synchronization & Concurrency`;
  } else {
    unitTitle = `Unit ${unitNum}: Core Foundations & Architecture`;
  }

  // Dynamic syllabus subtopics
  let subtopics = [
    `${subjectName} Theoretical Foundations`,
    'Mathematical Frameworks & Analytical Models',
    'Implementation & Algorithmic Tracing',
    'Standard Examination Questions & Edge Cases',
  ];

  if (cleanName.includes('dsa') || cleanName.includes('data structure') || cleanName.includes('tree')) {
    subtopics = [
      'Primitive vs. Non-Primitive Data Representation',
      'Balanced Tree Rotations & Invariants',
      'Time & Space Complexity Bounds',
      'Priority Queues & Heap Operations',
    ];
  } else if (cleanName.includes('os') || cleanName.includes('operating')) {
    subtopics = [
      'Process Synchronization & Critical Sections',
      'Counting & Binary Semaphores',
      'Paging Architecture & TLB Lookup',
      'Deadlock Necessary Conditions & Prevention',
    ];
  } else if (cleanName.includes('dbms') || cleanName.includes('database')) {
    subtopics = [
      'Relational Calculus & Set Operations',
      'B+ Tree Indexing & Hash Collisions',
      'ACID Properties & Conflict Serializability',
      'Two-Phase Locking (2PL) & Recovery',
    ];
  }

  return {
    subjectCode,
    subjectName,
    unitNumber: unitNum,
    unitTitle,
    subtopics,
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetSubjectId = formData.get('subjectId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No chapter PDF file uploaded' }, { status: 400 });
    }

    // Ensure public/uploads exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save uploaded file
    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const savedFilename = `chapter_${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadsDir, savedFilename);
    fs.writeFileSync(filePath, buffer);

    const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Analyze document heuristics
    const extraction = analyzeDocumentMetadata(file.name);

    // Resolve or create Subject
    let subject;
    if (targetSubjectId && targetSubjectId !== 'auto') {
      subject = await prisma.subject.findUnique({
        where: { id: targetSubjectId },
      });
    }

    if (!subject) {
      subject = await prisma.subject.findFirst({
        where: {
          OR: [
            { code: extraction.subjectCode },
            { name: { contains: extraction.subjectName } },
          ],
        },
      });
    }

    if (!subject) {
      // Find the nearest upcoming exam from existing calendar deadlines
      const upcomingExam = await prisma.deadline.findFirst({
        where: {
          type: 'exam',
          dueDate: { gte: new Date() },
        },
        orderBy: { dueDate: 'asc' },
      });

      // Create new subject genuinely without fake professor or room
      subject = await prisma.subject.create({
        data: {
          code: extraction.subjectCode,
          name: extraction.subjectName,
          instructor: '', // Leave professor empty when not present in document
          examDate: upcomingExam ? upcomingExam.dueDate : null,
          color: 'indigo',
        },
      });
    }

    // Find or create SyllabusUnit
    let unit = await prisma.syllabusUnit.findFirst({
      where: {
        subjectId: subject.id,
        unitNumber: extraction.unitNumber,
      },
      include: {
        topics: true,
      },
    });

    if (!unit) {
      unit = await prisma.syllabusUnit.create({
        data: {
          subjectId: subject.id,
          unitNumber: extraction.unitNumber,
          title: extraction.unitTitle,
        },
        include: {
          topics: true,
        },
      });
    }

    // Register extracted topics (avoiding duplicates)
    const existingTopicTitles = new Set(unit.topics.map((t) => t.title.toLowerCase()));
    const topicsToCreate = extraction.subtopics.filter(
      (title) => !existingTopicTitles.has(title.toLowerCase())
    );

    for (const title of topicsToCreate) {
      await prisma.syllabusTopic.create({
        data: {
          unitId: unit.id,
          title,
          status: 'UNTOUCHED',
        },
      });
    }

    // Create Resource record linked to this Subject and Unit
    const resource = await prisma.resource.create({
      data: {
        subjectId: subject.id,
        title: `${extraction.unitTitle} — Lecture Notes & Formulas`,
        fileType: 'pdf',
        fileUrl: `/uploads/${savedFilename}`,
        fileSize: fileSizeStr,
        unitNumber: extraction.unitNumber,
        isStarred: true,
      },
    });

    // Create a corresponding Roadmap Milestone
    await prisma.roadmapMilestone.create({
      data: {
        subjectId: subject.id,
        phase: extraction.unitNumber === 1 ? 1 : 2,
        title: `Master ${extraction.unitTitle} concepts & definitions`,
        isCompleted: false,
      },
    });

    const totalTopicsAdded = topicsToCreate.length;
    const message = `Unit ${extraction.unitNumber} added to ${subject.name}: ${totalTopicsAdded} new topics mapped to your Readiness Matrix.`;

    return NextResponse.json({
      success: true,
      message,
      subject: {
        id: subject.id,
        code: subject.code,
        name: subject.name,
      },
      unit: {
        id: unit.id,
        unitNumber: extraction.unitNumber,
        title: extraction.unitTitle,
      },
      topicsAdded: totalTopicsAdded,
      resource: {
        id: resource.id,
        title: resource.title,
        fileUrl: resource.fileUrl,
        fileSize: resource.fileSize,
      },
    });
  } catch (error) {
    console.error('Chapter Ingestion Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chapter document' },
      { status: 500 }
    );
  }
}
