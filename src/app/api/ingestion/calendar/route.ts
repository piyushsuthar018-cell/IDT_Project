import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  let file: File | null = null;
  try {
    const formData = await req.formData();
    file = formData.get('file') as File | null;
    const semesterName = (formData.get('semesterName') as string) || 'Semester 4 — CS & Engineering';

    console.log("Calendar ingestion received file:", file?.name, file?.type);

    // Ensure public/uploads exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let savedFilename = '';
    let extractedText = '';

    if (file && typeof file.arrayBuffer === 'function') {
      const buffer = Buffer.from(await file.arrayBuffer());
      savedFilename = `calendar_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      fs.writeFileSync(path.join(uploadsDir, savedFilename), buffer);

      // Attempt to extract text from buffer
      try {
        const rawString = buffer.toString('utf-8');
        const printable = rawString.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
        if (printable.trim().length > 30) {
          extractedText = printable.slice(0, 4000);
        }
      } catch (e) {
        console.warn("Raw text buffer extraction skipped:", e);
      }
    }

    // Standard baseline semester dates (fallbacks based on current date)
    const now = Date.now();
    let midSemDate = new Date(now + 14 * 86400000); // fallback ~2 weeks
    let midSemTitle = 'Mid-Semester Examination';
    let endSemDate = new Date(now + 60 * 86400000); // fallback ~8.5 weeks
    let endSemTitle = 'End-Semester Theory Exams';
    let labExamDate = new Date(now + 45 * 86400000);
    let projectDueDate = new Date(now + 21 * 86400000);
    let quizDate = new Date(now + 7 * 86400000);
    let termCommencementDate = new Date(now - 30 * 86400000);
    let aiParsedSuccess = false;

    // AI Parsing with candidate models (Gemini 3.8 Flash supports images & PDFs natively)
    const apiKey = process.env.GEMINI_API_KEY;
    const candidateModels = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

    if (apiKey && file) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const todayStr = new Date().toISOString().split('T')[0];

      const prompt = `You are an expert academic calendar parser for university colleges and engineering departments.
Today's date is: ${todayStr}.
Analyze the provided academic calendar document (image, PDF, or text).
Extract the exact dates for key milestones:
1. Mid-Semester Exam (Mid-Sem, Mid-Term, Sessional, or Internal Assessment)
2. End-Semester Exam (End-Sem, Final Theory, University Exams)
3. Practical/Lab Exams
4. Project/Assignment Submission
5. Quizzes or Continuous Assessment
6. Term Commencement and Term End

Return ONLY valid JSON (no markdown formatting, no code fences, no extra text) with this structure:
{
  "midSemDate": "YYYY-MM-DD",
  "midSemTitle": "Mid-Semester Examination",
  "endSemDate": "YYYY-MM-DD",
  "endSemTitle": "End-Semester Theory Examination",
  "practicalExamDate": "YYYY-MM-DD or null",
  "projectDueDate": "YYYY-MM-DD or null",
  "quizDate": "YYYY-MM-DD or null",
  "termCommencementDate": "YYYY-MM-DD or null",
  "termEndDate": "YYYY-MM-DD or null",
  "notes": "short summary"
}`;

      // Build content parts (multimodal inlineData for image or PDF)
      const contentParts: any[] = [prompt];

      if (buffer && buffer.length > 0) {
        let mimeType = file.type || 'application/pdf';
        const lowerName = file.name.toLowerCase();
        if (lowerName.endsWith('.png')) mimeType = 'image/png';
        else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) mimeType = 'image/jpeg';
        else if (lowerName.endsWith('.webp')) mimeType = 'image/webp';
        else if (lowerName.endsWith('.pdf')) mimeType = 'application/pdf';

        if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
          contentParts.push({
            inlineData: {
              data: buffer.toString('base64'),
              mimeType,
            },
          });
        } else if (extractedText) {
          contentParts.push(`\nCalendar Text Content:\n${extractedText}`);
        }
      }

      for (const modelName of candidateModels) {
        try {
          console.log(`--> [Calendar Ingestion] Attempting AI parse with ${modelName}...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(contentParts);
          const responseText = result.response.text();
          const cleanJson = responseText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);

          const parseDate = (dStr: any) => {
            if (!dStr || typeof dStr !== 'string') return null;
            const parsedD = new Date(dStr.trim());
            return isNaN(parsedD.getTime()) ? null : parsedD;
          };

          const pMid = parseDate(parsed.midSemDate);
          const pEnd = parseDate(parsed.endSemDate);

          if (pMid || pEnd) {
            if (pMid) {
              midSemDate = pMid;
              if (parsed.midSemTitle) midSemTitle = parsed.midSemTitle.trim();
            }
            if (pEnd) {
              endSemDate = pEnd;
              if (parsed.endSemTitle) endSemTitle = parsed.endSemTitle.trim();
            }
            const pPract = parseDate(parsed.practicalExamDate);
            if (pPract) labExamDate = pPract;

            const pProj = parseDate(parsed.projectDueDate);
            if (pProj) projectDueDate = pProj;

            const pQuiz = parseDate(parsed.quizDate);
            if (pQuiz) quizDate = pQuiz;

            const pCommence = parseDate(parsed.termCommencementDate);
            if (pCommence) termCommencementDate = pCommence;

            aiParsedSuccess = true;
            console.log(`--> [Calendar Ingestion] Successfully extracted dates with ${modelName}: Mid-Sem: ${midSemDate.toISOString()}, End-Sem: ${endSemDate.toISOString()}`);
            break;
          }
        } catch (err: any) {
          console.warn(`--> [Calendar Ingestion] ${modelName} failed (${err.message?.slice(0, 100)}), trying next candidate...`);
        }
      }
    }

    if (!aiParsedSuccess) {
      console.log("--> [Calendar Ingestion] AI parsing unavailable or skipped. Using baseline semester milestones fallback.");
    }

    // Determine target exam: if midSem is upcoming, target midSem! Otherwise target endSem.
    const targetExamDate = midSemDate.getTime() > now ? midSemDate : endSemDate;
    const targetExamTitle = midSemDate.getTime() > now ? midSemTitle : endSemTitle;

    // Fetch existing subjects and update their exam date to the nearest upcoming exam
    const subjects = await prisma.subject.findMany();
    if (subjects.length > 0) {
      await prisma.subject.updateMany({
        data: {
          examDate: targetExamDate,
        },
      });
    }

    // Clear previous automated global calendar milestones to prevent duplicates
    await prisma.deadline.deleteMany({
      where: {
        subjectId: null,
      },
    });

    // Global Semester Milestones & Deadlines
    const milestones = [
      {
        subjectId: null,
        title: 'Term Commencement',
        type: 'assignment',
        dueDate: termCommencementDate,
        status: termCommencementDate.getTime() <= now ? 'submitted' : 'pending',
      },
      {
        subjectId: null,
        title: 'Continuous Assessment Quiz 1',
        type: 'quiz',
        dueDate: quizDate,
        status: quizDate.getTime() <= now ? 'submitted' : 'pending',
      },
      {
        subjectId: null,
        title: midSemTitle || 'Mid-Semester Examination',
        type: 'exam',
        dueDate: midSemDate,
        status: midSemDate.getTime() <= now ? 'submitted' : 'pending',
      },
      {
        subjectId: null,
        title: 'Mid-Term Capstone & Project Submission',
        type: 'assignment',
        dueDate: projectDueDate,
        status: projectDueDate.getTime() <= now ? 'submitted' : 'pending',
      },
      {
        subjectId: null,
        title: 'Practical & Lab Examinations',
        type: 'lab_report',
        dueDate: labExamDate,
        status: labExamDate.getTime() <= now ? 'submitted' : 'pending',
      },
      {
        subjectId: null,
        title: endSemTitle || 'End-Semester Theory Exams',
        type: 'exam',
        dueDate: endSemDate,
        status: endSemDate.getTime() <= now ? 'submitted' : 'pending',
      },
    ];

    for (const m of milestones) {
      await prisma.deadline.create({
        data: m,
      });
    }

    // Format dates for response
    const midSemStr = midSemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endSemStr = endSemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const targetStr = targetExamDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return NextResponse.json({
      success: true,
      message: `Academic calendar processed: ${targetExamTitle} (${targetStr}) locked in as immediate target.`,
      semester: semesterName,
      calendarFile: savedFilename ? `/uploads/${savedFilename}` : null,
      examWindows: {
        midSem: midSemStr,
        endSem: endSemStr,
        nextTarget: targetExamTitle,
      },
      deadlinesCreated: milestones.length,
      subjectsUpdated: subjects.length,
      aiParsed: aiParsedSuccess,
    });
  } catch (error: any) {
    console.error("Calendar Ingestion Detailed Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process calendar" },
      { status: 500 }
    );
  }
}
