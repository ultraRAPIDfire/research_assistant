import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

export interface SourceInput {
  title: string;
  author: string | null;
  content: string | null;
}

export async function analyzeSource(
  title: string,
  content: string
) {
  const response = await client.responses.create({
    model: MODEL,

    input: `
You are an academic research assistant.

Analyze the following research source.

SOURCE TITLE:
${title}

SOURCE CONTENT:
${content}

Return a useful academic analysis containing:

SUMMARY
A concise summary of the source.

KEY FINDINGS
List the most important findings supported by the source.

RESEARCH QUESTIONS
Suggest research questions that logically follow from the source.

LIMITATIONS
Identify limitations only when they can reasonably be inferred from the supplied source.

IMPORTANT:
- Do not invent facts.
- Do not cite information that is not present in the source.
- Clearly distinguish evidence from interpretation.
- Use clear academic language.
`,
  });

  return response.output_text;
}

export async function analyzeProject(
  projectTitle: string,
  researchQuestion: string,
  sources: SourceInput[]
) {
  const material = sources
    .map(
      (source, index) => `
SOURCE ${index + 1}

TITLE:
${source.title}

AUTHOR:
${source.author || "Unknown"}

CONTENT:
${source.content || "No content supplied"}
`
    )
    .join("\n\n");

  const response = await client.responses.create({
    model: MODEL,

    input: `
You are an academic research synthesis assistant.

PROJECT:
${projectTitle}

RESEARCH QUESTION:
${researchQuestion || "Not specified"}

SOURCES:
${material}

Produce a research synthesis containing:

1. MAJOR THEMES
Identify recurring themes across the sources.

2. COMMON FINDINGS
Identify findings supported by multiple sources.

3. DIFFERENCES
Explain important disagreements or differences.

4. RESEARCH GAPS
Identify areas that appear insufficiently studied based only on the supplied sources.

5. SUGGESTED RESEARCH QUESTIONS
Generate useful research questions based on the synthesis.

IMPORTANT:
- Do not invent evidence.
- Do not pretend the sources agree when they do not.
- Base the synthesis only on the supplied material.
- Clearly identify uncertainty.
`,
  });

  return response.output_text;
}