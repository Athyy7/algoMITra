import express from 'express';
import { isTeacher } from '../middleware/roleMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

// We get 'protect' from the index.js file, but we need isTeacher here
const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY; // API key is handled by the environment
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// --- Helper for exponential backoff retry ---
async function fetchWithRetry(payload, maxRetries = 3) {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) { // Too many requests
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        return JSON.parse(text); // Return the parsed JSON object
      } else {
        throw new Error("Invalid response structure from Gemini API.");
      }

    } catch (error) {
      if (i === maxRetries - 1) { // Last retry failed
        console.error("Gemini API call failed after retries:", error);
        throw error; // Re-throw the last error
      }
    }
  }
}


// --- Function 1: Generate a WHOLE new problem ---
async function callGeminiForProblem(prompt) {
  const systemPrompt = `
    You are an expert Computer Science professor who specializes in creating problems for coding platforms like LeetCode and HackerRank.
    Your task is to generate a complete coding problem based on a user's prompt.
    You MUST return the problem in a specific JSON format.
    - The 'description' must be detailed, in markdown, with a problem statement, constraints, and at least one example.
    - 'difficulty' must be one of "Easy", "Medium", or "Hard".
    - 'testCases' must be an array of objects.
    - You MUST generate at least 5 test cases.
    - You MUST include a mix of sample cases, hidden basic cases, and hidden edge cases (e.g., empty inputs, single-item inputs, large inputs).
    - 'isSample' should be 'true' for the first 1-2 examples, and 'false' for all hidden and edge cases.
    - All inputs and outputs must be strings. For example, an array [1, 2, 3] should be "[1, 2, 3]", and a number 5 should be "5".
  `;
  const problemSchema = {
    type: "OBJECT",
    properties: {
      "title": { "type": "STRING" },
      "description": { "type": "STRING" },
      "difficulty": { "type": "STRING", "enum": ["Easy", "Medium", "Hard"] },
      "testCases": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "input": { "type": "STRING" },
            "output": { "type": "STRING" },
            "isSample": { "type": "BOOLEAN" }
          }, "required": ["input", "output", "isSample"]
        }
      }
    }, "required": ["title", "description", "difficulty", "testCases"]
  };
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: problemSchema,
    }
  };
  return fetchWithRetry(payload);
}

// --- Function 2: Generate ONLY test cases for an existing problem ---
async function callGeminiForTestCases(description, existingTestCases) {
  const systemPrompt = `
    You are an expert QA Engineer and competitive programmer.
    Your task is to generate a list of 10-15 additional hidden test cases for a given problem, focusing on edge cases.
    The user will provide the problem description and their existing sample test cases.
    DO NOT repeat the sample test cases in your response.
    Focus on:
    - Edge Cases (empty inputs, nulls, 0, 1, large inputs, duplicates, single-item arrays, already sorted, reverse sorted).
    - Basic Cases (simple, straightforward examples).
    
    You MUST return ONLY a valid JSON array of test case objects.
    - All test cases MUST have "isSample": false.
    - All inputs and outputs must be strings.
  `;
  const testCasesSchema = {
    type: "ARRAY",
    items: {
      "type": "OBJECT",
      "properties": {
        "input": { "type": "STRING" },
        "output": { "type": "STRING" },
        "isSample": { "type": "BOOLEAN", "const": false } // Force isSample to be false
      }, "required": ["input", "output", "isSample"]
    }
  };
  const prompt = `
    Problem Description:
    ${description}

    Existing Sample Test Cases (DO NOT REPEAT THESE):
    ${existingTestCases}
  `;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: testCasesSchema,
    }
  };
  return fetchWithRetry(payload);
}


/**
 * @route   POST /api/ai/generate-problem
 * @desc    Generate a new problem with AI
 * @access  Private (Teachers only)
 */
router.post('/generate-problem', isTeacher, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required.' });
  }
  try {
    const aiProblem = await callGeminiForProblem(prompt);
    res.status(200).json({ success: true, problem: aiProblem });
  } catch (error) {
    console.error('AI Problem Generation Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate AI problem. Please try again.' });
  }
});


/**
 * @route   POST /api/ai/generate-test-cases
 * @desc    Generate new test cases for an existing problem
 * @access  Private (Teachers only)
 */
router.post('/generate-test-cases', isTeacher, async (req, res) => {
  const { description, testCases } = req.body;
  if (!description || !testCases) {
    return res.status(400).json({ success: false, message: 'Problem description and sample test cases are required.' });
  }
  try {
    const aiTestCases = await callGeminiForTestCases(description, JSON.stringify(testCases));
    res.status(200).json({ success: true, testCases: aiTestCases });
  } catch (error) {
    console.error('AI Test Case Generation Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate AI test cases. Please try again.' });
  }
});


export default router;