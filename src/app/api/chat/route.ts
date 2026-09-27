import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { message, subjectName, unitTitle, subjectId, resourceId } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("--> [Copilot API] Message received:", message);
    console.log("--> [Copilot API] Context subject:", subjectName, "unit:", unitTitle);

    if (!apiKey) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY is not defined. Check your .env.local file in the project root and restart the server." 
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. Fetch all uploaded resources from the database
    const allResources = await prisma.resource.findMany({
      include: {
        subject: {
          include: {
            units: {
              include: {
                topics: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Identify the most relevant uploaded resource file(s)
    const lowerQuery = (message || '').toLowerCase();
    let relevantResources = allResources;

    // Filter by subject if specified
    if (subjectId) {
      const subjectMatched = allResources.filter(r => r.subjectId === subjectId);
      if (subjectMatched.length > 0) relevantResources = subjectMatched;
    } else if (subjectName) {
      const nameMatched = allResources.filter(r => 
        r.subject?.name?.toLowerCase().includes(subjectName.toLowerCase()) ||
        r.subject?.code?.toLowerCase().includes(subjectName.toLowerCase())
      );
      if (nameMatched.length > 0) relevantResources = nameMatched;
    }

    // Check if query targets a specific unit / chapter (e.g. "chapter 1", "unit 1", "ch 1")
    const unitMatch = lowerQuery.match(/(?:unit|ch|chapter|mod|module)\D*(\d+)/i);
    let targetedUnitNum: number | null = null;
    if (unitMatch) {
      targetedUnitNum = parseInt(unitMatch[1], 10);
    }

    let primaryResource = null;
    if (resourceId) {
      primaryResource = allResources.find(r => r.id === resourceId) || null;
    }
    if (!primaryResource && targetedUnitNum !== null) {
      primaryResource = relevantResources.find(r => r.unitNumber === targetedUnitNum) || null;
    }
    if (!primaryResource && relevantResources.length > 0) {
      // Default to the most recent uploaded resource in this course or platform
      primaryResource = relevantResources[0];
    }

    // 3. Build resource context & inspect disk files
    const contentParts: any[] = [];
    const resourceSummaries: string[] = [];

    for (const res of allResources) {
      const subCode = res.subject?.code || 'COURSE';
      const subName = res.subject?.name || 'General';
      const topics = res.subject?.units?.flatMap(u => u.topics.map(t => t.title)) || [];
      const topicSample = topics.slice(0, 5).join(', ');
      resourceSummaries.push(
        `- [${subCode} - ${subName}] "${res.title}" (Unit ${res.unitNumber || 1}, Format: ${res.fileType.toUpperCase()}) ${topicSample ? `[Topics: ${topicSample}]` : ''}`
      );
    }

    // If primary resource file exists on disk, attach it as multimodal inlineData or text
    let attachedFileName = '';
    if (primaryResource && primaryResource.fileUrl) {
      const cleanRelPath = primaryResource.fileUrl.replace(/^\//, '');
      const absFilePath = path.join(process.cwd(), 'public', cleanRelPath);

      if (fs.existsSync(absFilePath)) {
        try {
          const fileBuffer = fs.readFileSync(absFilePath);
          const ext = path.extname(absFilePath).toLowerCase();

          if (ext === '.pdf' && fileBuffer.length <= 25 * 1024 * 1024) {
            contentParts.push({
              inlineData: {
                data: fileBuffer.toString('base64'),
                mimeType: 'application/pdf',
              },
            });
            attachedFileName = path.basename(absFilePath);
            console.log(`--> [Copilot API] Attached uploaded PDF as multimodal context: ${attachedFileName}`);
          } else if (['.txt', '.py', '.cpp', '.c', '.sql', '.json', '.md'].includes(ext)) {
            const textContent = fileBuffer.toString('utf-8').slice(0, 15000);
            contentParts.push(`\n--- CONTENT OF UPLOADED RESOURCE (${path.basename(absFilePath)}) ---\n${textContent}\n--- END OF FILE ---\n`);
            attachedFileName = path.basename(absFilePath);
            console.log(`--> [Copilot API] Attached uploaded text/code resource: ${attachedFileName}`);
          }
        } catch (e) {
          console.warn("--> [Copilot API] Could not read resource file from disk:", e);
        }
      }
    }

    const contextHeader = subjectName 
      ? `Active Course Context: ${subjectName}${unitTitle ? ` · Unit: ${unitTitle}` : ''}`
      : `Active Context: General Academic & Engineering Studies`;

    const resourcesKnowledgeSection = resourceSummaries.length > 0
      ? `PLATFORM REPOSITORY & UPLOADED DOCUMENTS:\n${resourceSummaries.join('\n')}\n${attachedFileName ? `*PRIMARY DOCUMENT ATTACHED DIRECTLY TO THIS QUERY: ${attachedFileName}*` : ''}`
      : `No uploaded platform documents registered yet.`;

    const prompt = `You are StudyPulse Copilot, an elite, razor-sharp university academic and engineering tutor.
You are directly connected to all uploaded student resources, lecture notes, textbook chapters, and formula sheets.

${contextHeader}

${resourcesKnowledgeSection}

Student Query: ${message}

CRITICAL OPERATIONAL INSTRUCTIONS:
1. DIRECT GROUNDING IN UPLOADED RESOURCES:
   - When the student asks to summarize a chapter (e.g. "summarize the chapter to me in short", "summarize chapter 1"):
     Synthesize a concise, high-yield academic summary directly from the uploaded material.
     Include:
     - Core Concept & Architectural Definition
     - Essential Classifications (e.g. Primitive vs Non-Primitive, Linear vs Non-Linear)
     - Key Algorithms / Workflows & Time/Space Complexity
     - Standard University Exam Focus Areas
     Keep it crisp, direct, and well-structured with clear headings and bullet points.

   - When the student asks for MCQs, multiple choice questions, or a practice test (e.g. "give me the chapter 1 MCQ", "generate quiz"):
     Generate 4-5 university-standard multiple choice questions based specifically on the concepts in the uploaded chapter notes or document.
     CRITICAL: Enclose the questions in a single code block tagged \`\`\`mcq-json with this exact JSON structure:
     \`\`\`mcq-json
     [
       {
         "id": 1,
         "question": "Precise question statement based on the uploaded material",
         "options": [
           {"label": "A", "text": "Option text 1"},
           {"label": "B", "text": "Option text 2"},
           {"label": "C", "text": "Option text 3"},
           {"label": "D", "text": "Option text 4"}
         ],
         "correctAnswer": "A",
         "explanation": "Clear academic explanation of why Option A is correct and why other choices are invalid."
       }
     ]
     \`\`\`
     You may include a brief introductory note or conclusion outside the block.

   - When the student asks for Long Questions, subjective questions, 5/10 mark questions:
     Enclose structured exam-style questions in a block tagged \`\`\`long-question:
     \`\`\`long-question
     [
       {
         "id": 1,
         "marks": 10,
         "title": "Comprehensive question statement",
         "keyPoints": [
           "Essential concept 1 student must mention",
           "Essential concept 2 with formula/diagram requirement"
         ],
         "modelAnswer": "Full, well-structured academic model answer with clear headings, steps, and technical rigor.",
         "markingScheme": "Concept: 3M | Diagram: 3M | Implementation: 4M",
         "examTip": "Examiner's tip for scoring full marks."
       }
     ]
     \`\`\`

2. NO CONVERSATIONAL FILLER OR META-DISCLAIMERS:
   - Never say "Sure, here is your summary" or "Hey there, StudyPulse Copilot here...".
   - Start immediately with the substance on the first line.

3. POLISHED TECHNICAL RIGOR:
   - Use standard markdown bold (\`**term**\`) only for emphasis, clean bullet points (\`- item\`), and proper code blocks (\`\`\`c, \`\`\`python, etc.).`;

    // Put prompt as first content part
    contentParts.unshift(prompt);

    // Prioritize fastest available Gemini models
    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`--> [Copilot API] Generating with ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(contentParts);
        responseText = result.response.text();
        console.log(`--> [Copilot API] Successfully generated response from ${modelName}!`);
        break;
      } catch (err: any) {
        console.warn(`--> [Copilot API] ${modelName} failed (${err.message?.slice(0, 100)}), trying next candidate...`);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All candidate Gemini models failed to generate response.");
    }

    return NextResponse.json({ 
      reply: responseText,
      attachedResource: primaryResource ? {
        id: primaryResource.id,
        title: primaryResource.title,
        unitNumber: primaryResource.unitNumber,
        fileUrl: primaryResource.fileUrl,
      } : null,
    });

  } catch (error: any) {
    console.error("--> [Copilot API] Generation Error:", error);
    return NextResponse.json({ 
      error: `Gemini API Error: ${error.message || "Failed to generate content"}` 
    }, { status: 500 });
  }
}
