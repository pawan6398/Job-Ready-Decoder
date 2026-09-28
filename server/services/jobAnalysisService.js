import { v4 as uuidv4 } from 'uuid';
import { callAICompletion } from './aiProviderService.js';

export const SKILL_TAXONOMY = [
  // Programming Languages
  { name: 'JavaScript', category: 'Programming', patterns: [/\bjavascript\b/i, /\bjs\b/i, /\bes6\+?\b/i] },
  { name: 'TypeScript', category: 'Programming', patterns: [/\btypescript\b/i, /\bts\b/i] },
  { name: 'Python', category: 'Programming', patterns: [/\bpython\b/i, /\bpython3\b/i] },
  { name: 'Java', category: 'Programming', patterns: [/\bjava\b/i, /\bj2ee\b/i] },
  { name: 'C++', category: 'Programming', patterns: [/\bc\+\+\b/i, /\bcpp\b/i] },
  { name: 'C#', category: 'Programming', patterns: [/\bc#\b/i, /\bcsharp\b/i, /\b\.net\b/i] },
  { name: 'Go / Golang', category: 'Programming', patterns: [/\bgolang\b/i, /\bgo language\b/i, /\bgo\b/i] },
  { name: 'Rust', category: 'Programming', patterns: [/\brust\b/i] },
  { name: 'PHP', category: 'Programming', patterns: [/\bphp\b/i] },
  { name: 'Ruby', category: 'Programming', patterns: [/\bruby\b/i] },
  { name: 'HTML5 / CSS3', category: 'Frontend', patterns: [/\bhtml5?\b/i, /\bcss3?\b/i] },

  // Frontend
  { name: 'React.js', category: 'Frontend', patterns: [/\breact(\.js|js)?\b/i] },
  { name: 'Next.js', category: 'Frontend', patterns: [/\bnext(\.js|js)?\b/i] },
  { name: 'Vue.js', category: 'Frontend', patterns: [/\bvue(\.js|js)?\b/i] },
  { name: 'Angular', category: 'Frontend', patterns: [/\bangular\b/i] },
  { name: 'Tailwind CSS', category: 'Frontend', patterns: [/\btailwind(\s?css)?\b/i] },
  { name: 'Bootstrap', category: 'Frontend', patterns: [/\bbootstrap\b/i] },
  { name: 'Redux / State Management', category: 'Frontend', patterns: [/\bredux(\s?toolkit)?\b/i, /\bstate management\b/i, /\bcontext api\b/i, /\bzustand\b/i] },
  { name: 'Responsive Web Design', category: 'Frontend', patterns: [/\bresponsive\b/i, /\bmobile-first\b/i, /\bcross-browser\b/i] },

  // Backend
  { name: 'Node.js', category: 'Backend', patterns: [/\bnode(\.js|js)?\b/i] },
  { name: 'Express.js', category: 'Backend', patterns: [/\bexpress(\.js|js)?\b/i] },
  { name: 'REST APIs', category: 'Backend', patterns: [/\brest(ful)?(\s?apis?)?\b/i, /\bapi design\b/i] },
  { name: 'GraphQL', category: 'Backend', patterns: [/\bgraphql\b/i] },
  { name: 'Microservices', category: 'Backend', patterns: [/\bmicroservices?\b/i, /\bdistributed systems?\b/i] },
  { name: 'FastAPI / Django', category: 'Backend', patterns: [/\bfastapi\b/i, /\bdjango\b/i, /\bflask\b/i] },
  { name: 'Spring Boot', category: 'Backend', patterns: [/\bspring\s?boot\b/i, /\bspring\b/i] },
  { name: 'WebSockets', category: 'Backend', patterns: [/\bwebsocket\b/i, /\bsocket\.io\b/i, /\breal-time\b/i] },

  // Database
  { name: 'MongoDB', category: 'Database', patterns: [/\bmongodb\b/i, /\bmongoose\b/i, /\bnosql\b/i] },
  { name: 'PostgreSQL / SQL', category: 'Database', patterns: [/\bpostgres(ql)?\b/i, /\bsql\b/i, /\bqueries\b/i, /\brelational\b/i] },
  { name: 'MySQL', category: 'Database', patterns: [/\bmysql\b/i] },
  { name: 'Redis', category: 'Database', patterns: [/\bredis\b/i, /\bcaching\b/i] },
  { name: 'Prisma / ORM', category: 'Database', patterns: [/\bprisma\b/i, /\borm\b/i, /\bhibernate\b/i, /\btypeorm\b/i] },

  // Cloud
  { name: 'AWS (Cloud)', category: 'Cloud', patterns: [/\baws\b/i, /\bamazon web services\b/i, /\bec2\b/i, /\bs3\b/i, /\blambda\b/i] },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud', patterns: [/\bgcp\b/i, /\bgoogle cloud\b/i] },
  { name: 'Azure', category: 'Cloud', patterns: [/\bazure\b/i, /\bmicrosoft azure\b/i] },
  { name: 'Serverless', category: 'Cloud', patterns: [/\bserverless\b/i, /\bcloud functions\b/i] },

  // DevOps
  { name: 'Docker', category: 'DevOps', patterns: [/\bdocker\b/i, /\bcontainer(s|ization)?\b/i] },
  { name: 'Kubernetes', category: 'DevOps', patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { name: 'Git & GitHub', category: 'DevOps', patterns: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i, /\bversion control\b/i] },
  { name: 'CI/CD Pipelines', category: 'DevOps', patterns: [/\bci\/?cd\b/i, /\bgithub actions\b/i, /\bjenkins\b/i, /\bpipelines?\b/i] },
  { name: 'Linux', category: 'DevOps', patterns: [/\blinux\b/i, /\bunix\b/i, /\bbash\b/i, /\bshell\b/i] },

  // Testing
  { name: 'Jest (Testing)', category: 'Testing', patterns: [/\bjest\b/i, /\bunit test(ing|s)?\b/i] },
  { name: 'React Testing Library', category: 'Testing', patterns: [/\breact testing library\b/i, /\brtl\b/i] },
  { name: 'Cypress / Playwright / E2E', category: 'Testing', patterns: [/\bcypress\b/i, /\bplaywright\b/i, /\be2e\b/i, /\bend-to-end\b/i] },
  { name: 'Automated Testing', category: 'Testing', patterns: [/\btest automation\b/i, /\btdd\b/i, /\bintegration test(ing|s)?\b/i] },

  // Soft Skills & Methodologies
  { name: 'Agile / Scrum', category: 'Soft Skills', patterns: [/\bagile\b/i, /\bscrum\b/i, /\bsprints?\b/i, /\bstandups?\b/i] },
  { name: 'Problem Solving', category: 'Soft Skills', patterns: [/\bproblem[- ]solving\b/i, /\banalytical\b/i, /\bcritical thinking\b/i] },
  { name: 'Communication', category: 'Soft Skills', patterns: [/\bcommunication\b/i, /\bverbal\b/i, /\bwritten\b/i, /\bcollaborat(e|ion|ive)\b/i] },
  { name: 'Code Review', category: 'Soft Skills', patterns: [/\bcode reviews?\b/i, /\bpeer review\b/i, /\bpull requests?\b/i] },

  // Education / Qualifications
  { name: "Bachelor's in Computer Science / STEM", category: 'Education', patterns: [/\bbachelor'?s\b/i, /\bcomputer science\b/i, /\bstem\b/i, /\bbs\s?in\b/i, /\bdegree\b/i] }
];

/**
 * Analyzes 3 Job Descriptions and matches against user resume.
 * Strict Rule: Only include skills occurring in at least 2 of 3 JDs.
 */
export async function analyzeJobDescriptions({ targetRole, resumeText, jobDescriptions }) {
  if (!jobDescriptions || jobDescriptions.length !== 3) {
    throw new Error('Exactly 3 job descriptions are required for analysis.');
  }

  const jdTexts = jobDescriptions.map((jd) => jd.text || '');

  // 1. Detect skills in each JD
  const skillOccurrences = [];

  for (const item of SKILL_TAXONOMY) {
    let count = 0;
    const matchesPerJD = [false, false, false];

    for (let i = 0; i < 3; i++) {
      const text = jdTexts[i];
      const hasMatch = item.patterns.some((pattern) => pattern.test(text));
      if (hasMatch) {
        matchesPerJD[i] = true;
        count++;
      }
    }

    // Must occur in at least 2 of 3 JDs
    if (count >= 2) {
      skillOccurrences.push({
        id: uuidv4(),
        name: item.name,
        category: item.category,
        count,
        total: 3,
        frequency: `${count}/3`,
        patterns: item.patterns
      });
    }
  }

  // Sort: 3/3 frequency first, then 2/3, then alphabetical
  skillOccurrences.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });

  // 2. Resume Evidence Extraction & 4-Column Classification
  const recurringSkills = skillOccurrences.map((skill) => {
    const resumeAnalysis = extractResumeEvidence(skill, resumeText);
    return {
      id: skill.id,
      name: skill.name,
      frequency: skill.frequency,
      count: skill.count,
      total: skill.total,
      category: skill.category,
      classification: resumeAnalysis.classification,
      evidence: resumeAnalysis.evidence,
      userNote: resumeAnalysis.userNote || ''
    };
  });

  // 3. Optional AI Enrichment if API key exists
  const enrichedSkills = await tryAIEnrichment({
    targetRole,
    resumeText,
    recurringSkills
  });

  return enrichedSkills || recurringSkills;
}

/**
 * Deterministic Resume Matcher with strictly grounded evidence extraction
 */
function extractResumeEvidence(skill, resumeText) {
  if (!resumeText) {
    return {
      classification: 'Need to Learn',
      evidence: 'No resume text provided.'
    };
  }

  const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean);
  const matchedLines = [];

  for (const line of lines) {
    if (skill.patterns.some((p) => p.test(line))) {
      matchedLines.push(line);
    }
  }

  if (matchedLines.length === 0) {
    return {
      classification: 'Need to Learn',
      evidence: `Not found on resume. Prioritize learning for ${skill.name} to fulfill recurring requirements.`
    };
  }

  // Analyze the matched lines for tangible evidence (projects, internships, metrics, verbs)
  const projectKeywords = /project|built|developed|implemented|architected|designed|shipped|created|intern|experience/i;
  const projectLines = matchedLines.filter((l) => projectKeywords.test(l));

  if (projectLines.length > 0) {
    // Concrete project / experience evidence found
    const bestLine = projectLines[0].replace(/^[-•*]\s*/, '');
    const cleanSnippet = bestLine.length > 120 ? bestLine.substring(0, 117) + '...' : bestLine;
    return {
      classification: 'Already Have',
      evidence: cleanSnippet
    };
  }

  // Found in skills list or heading, but lacks concrete project detail
  const skillListLine = matchedLines[0].replace(/^[-•*]\s*/, '');
  return {
    classification: 'Need to Demonstrate',
    evidence: `Mentioned on resume ("${skillListLine.substring(0, 80)}"), but lacks detailed project/production evidence.`
  };
}

/**
 * Optional AI Enrichment hook with strict anti-hallucination constraint
 */
async function tryAIEnrichment({ targetRole, resumeText, recurringSkills }) {
  const systemPrompt = `You are an expert technical hiring manager evaluating candidate resumes against recurring skills found in job descriptions for the role of ${targetRole}.
IMPORTANT SECURITY & FIDELITY INSTRUCTION:
"Use only information present in the provided sources. Do not invent candidate experience, skills, projects, companies, achievements, or qualifications."
Return only valid JSON matching the exact schema requested.`;

  const userPrompt = `Given the candidate's resume and the list of recurring skills:
Candidate Resume:
${resumeText.substring(0, 2500)}

Recurring Skills:
${JSON.stringify(recurringSkills.map((s) => ({ id: s.id, name: s.name, frequency: s.frequency, category: s.category })), null, 2)}

Instructions:
1. For each skill, classify into EXACTLY one of: "Already Have", "Need to Learn", "Need to Demonstrate", "Not Important for Me".
- "Already Have": Real evidence in projects/experience/internships on resume.
- "Need to Demonstrate": Known or listed, but lacks strong evidence/metrics.
- "Need to Learn": Absent from resume.
2. Provide a grounded "evidence" quote from the resume or reason for gap.
Return JSON format:
{
  "skills": [
    {
      "id": "...",
      "classification": "Already Have" | "Need to Learn" | "Need to Demonstrate",
      "evidence": "..."
    }
  ]
}`;

  try {
    const aiResult = await callAICompletion({ systemPrompt, userPrompt, temperature: 0.1 });
    if (aiResult?.skills && Array.isArray(aiResult.skills)) {
      return recurringSkills.map((orig) => {
        const found = aiResult.skills.find((s) => s.id === orig.id || s.name === orig.name);
        if (found && found.classification) {
          return {
            ...orig,
            classification: found.classification,
            evidence: found.evidence || orig.evidence
          };
        }
        return orig;
      });
    }
  } catch (err) {
    console.warn('[jobAnalysisService] AI enrichment bypassed:', err.message);
  }

  return null;
}
