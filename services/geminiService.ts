import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // First check for user-provided key in localStorage (for open source usage)
  const userKey = localStorage.getItem('obsidian_api_key');
  
  // Fallback to environment variable (for hosted/dev usage)
  const apiKey = userKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }
  return new GoogleGenAI({ apiKey });
};

// System instruction to guide the persona
const SYSTEM_INSTRUCTION = `
You are an expert Knowledge Engineer and Obsidian Architect. Your goal is to take raw text (articles, thoughts, learning materials) and distill it into a high-quality, "atomic" or "evergreen" note suitable for a Zettelkasten or personal knowledge management system.

STRICT OUTPUT FORMAT RULES:
1. Output MUST be raw Markdown. Do not use code blocks (like \`\`\`markdown).
2. Output MUST start with the YAML frontmatter block.
3. You MUST follow the section headers exactly as shown in the template below. Do not skip sections.

TEMPLATE:
---
title: "A concise, active title (no colons or slashes)"
date: {{YYYY-MM-DD HH:mm}}
tags: [knowledge, learning, ...topic_tags]
status: processed
---

# {{Title Again}}

## Core Concept
A 1-2 sentence summary of the absolute core logic or mental model.

## Key Insights
- Bullet points of the most critical information.
- Focus on *principles* rather than just facts.
- What should the user memorize or understand deeply?

## Detailed Explanation
(Optional) If there is complex logic, code, or a process, explain it here clearly. If not, assume this section is not needed or keep it brief.

## Connections
- List potential links to other concepts using Wikilink format: [[Related Concept]].
- Suggest tags that link this to broader fields.

IMPORTANT: 
- Ensure the 'title' in the frontmatter is filesystem-safe (NO colons :, NO forward slashes /, NO backslashes \\).
`;

export const extractInsights = async (text: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Process the following text into a structured Obsidian note:\n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for factual accuracy and structured output
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};

export const refineInsights = async (currentNote: string, userInstruction: string): Promise<string> => {
  const ai = getClient();

  const prompt = `
  I have a draft Obsidian note. I need you to modify it based on my instructions.
  
  CURRENT NOTE:
  ${currentNote}
  
  USER INSTRUCTION:
  ${userInstruction}
  
  IMPORTANT:
  1. Output the fully rewritten note with the changes applied.
  2. You MUST PRESERVE the original Markdown structure (YAML frontmatter, Headers) unless the user explicitly asks to change the format.
  3. Do not output markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful editor refining knowledge notes. You strictly adhere to the existing Markdown structure.",
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    throw error;
  }
};