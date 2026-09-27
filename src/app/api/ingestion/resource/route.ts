import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    let subjectId = (formData.get('subjectId') as string) || '';
    const unitNumberStr = (formData.get('unitNumber') as string) || '1';
    const category = (formData.get('category') as string) || 'note';
    const format = (formData.get('format') as string) || 'PDF';
    const tags = (formData.get('tags') as string) || '';
    const codeSnippet = (formData.get('codeSnippet') as string) || '';

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Resolve or fallback subject
    let subject = null;
    if (subjectId && subjectId !== 'all') {
      subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    }
    if (!subject) {
      subject = await prisma.subject.findFirst();
    }
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          code: 'GEN-101',
          name: 'General Academic Studies',
          instructor: '',
          color: 'indigo',
        },
      });
    }

    let savedFilename = '';
    let fileSizeStr = '1.2 MB';

    if (file && typeof file.arrayBuffer === 'function') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      savedFilename = `resource_${Date.now()}_${sanitizedName}`;
      fs.writeFileSync(path.join(uploadsDir, savedFilename), buffer);
      fileSizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
    } else if (codeSnippet) {
      const ext = format === 'PY' ? 'py' : format === 'CPP' ? 'cpp' : format === 'SQL' ? 'sql' : 'txt';
      savedFilename = `snippet_${Date.now()}.${ext}`;
      fs.writeFileSync(path.join(uploadsDir, savedFilename), Buffer.from(codeSnippet, 'utf-8'));
      fileSizeStr = `${Math.round(codeSnippet.length / 1024) || 1} KB`;
    } else {
      savedFilename = `doc_${Date.now()}.pdf`;
      fs.writeFileSync(path.join(uploadsDir, savedFilename), Buffer.from(`Resource content for ${title}`, 'utf-8'));
    }

    const unitNumber = parseInt(unitNumberStr, 10) || 1;
    const finalTitle = title.trim() || (file ? file.name.replace(/\.[^/.]+$/, '') : `Unit ${unitNumber} Resource`);

    // Map fileType for Prisma schema ("pdf" | "code" | "notes" | "formula_sheet")
    let prismaFileType = 'notes';
    if (format === 'PDF' && (category === 'formula_sheet' || category === 'cheatsheet')) {
      prismaFileType = 'formula_sheet';
    } else if (['PY', 'CPP', 'SQL', 'C'].includes(format) || category === 'code') {
      prismaFileType = 'code';
    } else if (category === 'past_paper') {
      prismaFileType = 'past_paper';
    } else {
      prismaFileType = 'pdf';
    }

    const resource = await prisma.resource.create({
      data: {
        subjectId: subject.id,
        title: finalTitle,
        fileType: prismaFileType,
        fileUrl: `/uploads/${savedFilename}`,
        fileSize: fileSizeStr,
        unitNumber,
        isStarred: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Resource "${finalTitle}" uploaded and registered to ${subject.name}.`,
      resource: {
        id: resource.id,
        title: resource.title,
        fileType: resource.fileType,
        fileUrl: resource.fileUrl,
        fileSize: resource.fileSize,
        subjectId: subject.id,
        subjectCode: subject.code,
      },
    });
  } catch (error: any) {
    console.error("Resource Ingestion Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload resource" },
      { status: 500 }
    );
  }
}
