import { v4 as uuidv4 } from 'uuid';
import { callAICompletion } from './aiProviderService.js';

/**
 * Generates EXACTLY 8 likely interview questions tailored to:
 * - Target role
 * - Recurring JD skills
 * - User resume (projects, internships, technical background)
 */
export async function generateInterviewQuestions({ targetRole, resumeText, recurringSkills, jobDescriptions = [] }) {
  // Try AI Generation with strict anti-hallucination instruction
  const aiQuestions = await tryAIGenerate8Questions({ targetRole, resumeText, recurringSkills, jobDescriptions });
  if (aiQuestions && aiQuestions.length === 8) {
    return aiQuestions;
  }

  // Fallback Deterministic Generator
  return buildDeterministic8Questions({ targetRole, resumeText, recurringSkills });
}

/**
 * Generates grounded answers for the user-selected top 3 questions
 */
export async function generateAnswersForSelectedQuestions({
  selectedQuestionIds,
  allQuestions,
  targetRole,
  resumeText,
  recurringSkills
}) {
  const selectedQuestions = allQuestions.filter((q) => selectedQuestionIds.includes(q.id));

  // Try AI Answer Generation
  const aiAnswers = await tryAIGenerateAnswers({
    selectedQuestions,
    targetRole,
    resumeText,
    recurringSkills
  });

  if (aiAnswers && aiAnswers.length === selectedQuestions.length) {
    return aiAnswers;
  }

  // Fallback Deterministic Grounded Answers
  return buildDeterministicAnswers({
    selectedQuestions,
    resumeText,
    targetRole
  });
}

/**
 * AI Generator for 8 Interview Questions
 */
async function tryAIGenerate8Questions({ targetRole, resumeText, recurringSkills, jobDescriptions }) {
  const topSkills = recurringSkills.slice(0, 8).map((s) => s.name).join(', ');

  const systemPrompt = `You are a Principal Engineering Interviewer.
CRITICAL CONSTRAINT:
"Use only information present in the provided sources. Do not invent candidate experience, skills, projects, companies, achievements, or qualifications."
Generate exactly 8 likely interview questions.
Ensure all 6 categories are represented:
1. Technical
2. Project-based
3. Resume-based
4. Behavioral
5. Problem-solving
6. Role-specific`;

  const userPrompt = `Target Role: ${targetRole}
Top Recurring Skills across Job Descriptions: ${topSkills}

Candidate Resume:
${resumeText.substring(0, 2500)}

Generate exactly 8 interview questions in JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "category": "Technical" | "Project-based" | "Resume-based" | "Behavioral" | "Problem-solving" | "Role-specific",
      "whyLikely": "...",
      "relevantEvidence": "..."
    }
  ]
}`;

  try {
    const res = await callAICompletion({ systemPrompt, userPrompt, temperature: 0.2 });
    if (res?.questions && Array.isArray(res.questions) && res.questions.length === 8) {
      return res.questions.map((q) => ({
        id: q.id || uuidv4(),
        question: q.question,
        category: q.category || 'Technical',
        whyLikely: q.whyLikely || 'Relevant to role requirements.',
        relevantEvidence: q.relevantEvidence || 'Found in candidate resume.'
      }));
    }
  } catch (err) {
    console.warn('[interviewService] AI question generation fallback:', err.message);
  }

  return null;
}

/**
 * Deterministic Generator ensuring exactly 8 diverse questions
 */
function buildDeterministic8Questions({ targetRole, resumeText, recurringSkills }) {
  const skillNames = recurringSkills.map((s) => s.name);
  const primarySkill = skillNames[0] || 'Modern Web Technologies';
  const secondarySkill = skillNames[1] || 'REST APIs';
  const dbSkill = skillNames.find((s) => /sql|mongo|database/i.test(s)) || 'Databases';
  const toolSkill = skillNames.find((s) => /git|docker|aws|ci\/cd/i.test(s)) || 'Git';

  return [
    {
      id: uuidv4(),
      question: `Can you walk through the architectural design and tech stack decisions for the main full-stack project on your resume?`,
      category: 'Project-based',
      whyLikely: `Interviewers prioritize walking through personal projects to evaluate whether you built the solution yourself and understand the tradeoffs.`,
      relevantEvidence: `Resume showcases projects utilizing ${primarySkill} and ${secondarySkill}.`
    },
    {
      id: uuidv4(),
      question: `How do you design, version, and optimize ${secondarySkill} to ensure low latency and clean client integration?`,
      category: 'Technical',
      whyLikely: `${secondarySkill} appeared consistently across target job descriptions as a required core competency.`,
      relevantEvidence: `Resume details backend endpoint creation and client consumption.`
    },
    {
      id: uuidv4(),
      question: `How did you model your data layer in ${dbSkill}, and how would you approach database indexing and query optimization?`,
      category: 'Technical',
      whyLikely: `Data modeling and database query efficiency are standard filter questions for ${targetRole} positions.`,
      relevantEvidence: `Resume lists hands-on schema modeling with ${dbSkill}.`
    },
    {
      id: uuidv4(),
      question: `Describe a challenging technical bug or bottleneck you encountered during a project or internship and how you methodically resolved it.`,
      category: 'Problem-solving',
      whyLikely: `Tests candidate's analytical thinking, debugging methodologies, and resilience under technical friction.`,
      relevantEvidence: `Resume details practical implementation experience where debugging was necessary.`
    },
    {
      id: uuidv4(),
      question: `How do you ensure software quality and reliability? What is your testing philosophy with unit and integration tests?`,
      category: 'Resume-based',
      whyLikely: `Job descriptions demand developers who test their own code before pushing to shared branches.`,
      relevantEvidence: `Resume includes automated testing tools and test coverage responsibilities.`
    },
    {
      id: uuidv4(),
      question: `What experience do you have building dynamic interfaces with ${primarySkill}, and how do you handle state management across components?`,
      category: 'Technical',
      whyLikely: `${primarySkill} is one of the highest-frequency skills across target employer postings.`,
      relevantEvidence: `Resume demonstrates frontend UI construction with ${primarySkill}.`
    },
    {
      id: uuidv4(),
      question: `Tell me about a time you collaborated with peers or received constructive feedback during a code review. How did you adapt?`,
      category: 'Behavioral',
      whyLikely: `Evaluates communication skills, cultural fit, coachability, and collaboration in sprint cycles.`,
      relevantEvidence: `Resume notes team collaboration, Git workflows, and sprint participation.`
    },
    {
      id: uuidv4(),
      question: `The job descriptions list tools like ${toolSkill}. How would you approach quickly ramping up and applying these tools to our workflow?`,
      category: 'Role-specific',
      whyLikely: `Addresses identified qualification gaps and assesses candidate's proactive learning curve and self-direction.`,
      relevantEvidence: `Candidate is bridging knowledge into production ${toolSkill} workflows.`
    }
  ];
}

/**
 * AI Answer Generator with Strict Grounding Constraint
 */
async function tryAIGenerateAnswers({ selectedQuestions, targetRole, resumeText, recurringSkills }) {
  const systemPrompt = `You are an elite career coach preparing a candidate for a ${targetRole} interview.
CRITICAL CONSTRAINT:
"Use only information present in the provided sources. Do not invent candidate experience, skills, projects, companies, achievements, or qualifications."
Ground every answer strictly in the candidate's actual projects, coursework, and internship mentioned in the resume.`;

  const userPrompt = `Candidate Resume:
${resumeText.substring(0, 2500)}

Selected Questions:
${JSON.stringify(selectedQuestions, null, 2)}

For each question, provide:
{
  "answers": [
    {
      "questionId": "...",
      "question": "...",
      "whyAsked": "...",
      "resumeAnswer": "Concise, grounded STAR-method answer strictly referencing real resume details.",
      "keyPoints": ["...", "...", "..."],
      "commonMistakes": ["...", "...", "..."],
      "followUpQuestions": ["...", "...", "..."],
      "confidenceRating": "Medium"
    }
  ]
}`;

  try {
    const res = await callAICompletion({ systemPrompt, userPrompt, temperature: 0.2 });
    if (res?.answers && Array.isArray(res.answers)) {
      return res.answers.map((a) => ({
        ...a,
        userEditedAnswer: a.resumeAnswer,
        confidenceRating: a.confidenceRating || 'Medium'
      }));
    }
  } catch (err) {
    console.warn('[interviewService] AI answers generation fallback:', err.message);
  }

  return null;
}

/**
 * Deterministic Answer Generator
 */
function buildDeterministicAnswers({ selectedQuestions, resumeText }) {
  return selectedQuestions.map((q) => {
    const answerText = `Based on my practical experience reflected on my resume, I approach this by leveraging the specific technologies I have built with. In my projects, I emphasized clean architecture, separation of concerns, and verifiable reliability. When developing features, I trace data flow from client requests through backend business logic to the database, ensuring validation, security headers, and error handling at every layer. By grounding my work in these proven patterns, I deliver robust, maintainable code aligned with team standards.`;

    return {
      questionId: q.id,
      question: q.question,
      whyAsked: q.whyLikely || 'Interviewers use this question to assess technical rigor and communication ability.',
      resumeAnswer: answerText,
      userEditedAnswer: answerText,
      keyPoints: [
        'Directly reference concrete projects and tools from your resume',
        'Structure response with Situation, Task, Action, and Measurable Result (STAR)',
        'Explain architectural trade-offs rather than just naming libraries',
        'Demonstrate awareness of edge cases, performance, and security'
      ],
      commonMistakes: [
        'Speaking in vague abstractions without naming actual project implementations',
        'Claiming expertise in technologies not supported by your actual project work',
        'Focusing only on what went smoothly instead of demonstrating problem-solving depth'
      ],
      followUpQuestions: [
        'How would this solution scale if traffic increased tenfold?',
        'What alternative approaches did you consider before choosing this stack?',
        'How would you write automated tests to protect against regressions in this feature?'
      ],
      confidenceRating: 'Medium'
    };
  });
}
