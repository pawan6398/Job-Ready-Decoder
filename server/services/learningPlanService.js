import { v4 as uuidv4 } from 'uuid';
import { callAICompletion } from './aiProviderService.js';

/**
 * Builds a realistic 30-day learning plan based on at least 2 skills from "Need to Learn"
 */
export async function generateLearningPlan({ targetRole, recurringSkills }) {
  // 1. Identify at least 2 skills from "Need to Learn"
  let needToLearn = recurringSkills
    .filter((s) => s.classification === 'Need to Learn')
    .map((s) => s.name);

  // If fewer than 2, supplement from "Need to Demonstrate" or top skills
  if (needToLearn.length < 2) {
    const needToDemo = recurringSkills
      .filter((s) => s.classification === 'Need to Demonstrate')
      .map((s) => s.name);
    needToLearn = [...new Set([...needToLearn, ...needToDemo])];
  }

  if (needToLearn.length < 2) {
    needToLearn = ['Docker & Containers', 'Cloud Deployment & AWS'];
  }

  const primarySkill = needToLearn[0] || 'Docker';
  const secondarySkill = needToLearn[1] || 'AWS Cloud Architecture';

  // Try AI Plan Generation
  const aiPlan = await tryAIGeneratePlan({ targetRole, primarySkill, secondarySkill });
  if (aiPlan?.weeks && aiPlan.weeks.length === 4) {
    return aiPlan;
  }

  // Fallback Deterministic Generator
  return buildDeterministicPlan(primarySkill, secondarySkill, targetRole);
}

async function tryAIGeneratePlan({ targetRole, primarySkill, secondarySkill }) {
  const systemPrompt = `You are a Senior Engineering Mentor creating a realistic, high-impact 30-day preparation roadmap.
Generate a structured 4-week + Day 29 & 30 preparation plan for ${targetRole} focusing on two key skill gaps: "${primarySkill}" and "${secondarySkill}".
Return valid JSON matching the exact schema.`;

  const userPrompt = `Generate a 30-day plan targeting ${primarySkill} and ${secondarySkill}.
Include:
- Week 1: ${primarySkill} core fundamentals, topics, resources, practice, deliverable, 3 specific tasks.
- Week 2: ${primarySkill} advanced practical projects, deliverable, 3 tasks.
- Week 3: ${secondarySkill} foundations & core architecture, deliverable, 3 tasks.
- Week 4: Full integration of both skills with CI/CD and deployment, deliverable, 3 tasks.
- Day 29: Revision & Mock Interview (revisionTasks, mockInterviewFocus).
- Day 30: Final Assessment & Simulation (assessmentTasks, simulationPrompt).

Format:
{
  "skillsToLearn": ["${primarySkill}", "${secondarySkill}"],
  "weeks": [
    {
      "weekNumber": 1,
      "title": "...",
      "skill": "${primarySkill}",
      "topics": ["...", "..."],
      "resources": ["...", "..."],
      "practice": "...",
      "deliverable": "...",
      "tasks": [
        {
          "id": "t1",
          "task": "...",
          "practiceTask": "...",
          "expectedOutcome": "...",
          "completed": false
        }
      ]
    }
  ],
  "day29": {
    "title": "Day 29: Intensive Revision & Technical Mock Interview",
    "skill": "${primarySkill} & ${secondarySkill}",
    "revisionTasks": ["...", "..."],
    "mockInterviewFocus": "...",
    "completed": false
  },
  "day30": {
    "title": "Day 30: Final Practical Assessment & Role Simulation",
    "skill": "Full Stack Integration",
    "assessmentTasks": ["...", "..."],
    "simulationPrompt": "...",
    "completed": false
  }
}`;

  try {
    const res = await callAICompletion({ systemPrompt, userPrompt, temperature: 0.2 });
    if (res?.weeks && Array.isArray(res.weeks) && res.weeks.length === 4) {
      // Ensure IDs on all tasks
      res.weeks.forEach((w) => {
        w.tasks = (w.tasks || []).map((t) => ({
          ...t,
          id: t.id || uuidv4(),
          completed: Boolean(t.completed)
        }));
      });
      return res;
    }
  } catch (err) {
    console.warn('[learningPlanService] AI plan generation fallback:', err.message);
  }

  return null;
}

function buildDeterministicPlan(skill1, skill2, targetRole) {
  return {
    skillsToLearn: [skill1, skill2],
    weeks: [
      {
        weekNumber: 1,
        title: `${skill1} Foundations & Practical Setup`,
        skill: skill1,
        topics: [
          `Core architecture and fundamental principles of ${skill1}`,
          `Installation, environment configuration, and CLI commands`,
          `Configuring standard development templates and isolation`,
          `Common patterns, configuration syntax, and best practices`
        ],
        resources: [
          `Official ${skill1} Documentation & Quickstart Tutorials`,
          `Practical Guide to ${skill1} in Modern Engineering Workflows`,
          `Interactive hands-on sandbox labs`
        ],
        practice: `Build and run a standalone proof-of-concept project utilizing ${skill1}.`,
        deliverable: `Working local implementation configured with automated build scripts.`,
        tasks: [
          {
            id: uuidv4(),
            task: `Review core syntax and foundational architectural concepts for ${skill1}.`,
            practiceTask: `Complete official getting-started tutorial and verify local toolchain.`,
            expectedOutcome: `Confident execution of standard commands and environment setup.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Configure project boilerplate integrating ${skill1} into standard project structure.`,
            practiceTask: `Create config files with secure defaults and modular settings.`,
            expectedOutcome: `Clean, reusable template ready for feature development.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Implement a functional feature or utility testing core ${skill1} APIs.`,
            practiceTask: `Write automated tests or validation scripts confirming proper execution.`,
            expectedOutcome: `Validated execution verifying error handling and performance.`,
            completed: false
          }
        ]
      },
      {
        weekNumber: 2,
        title: `Advanced ${skill1} Integration & Production Patterns`,
        skill: skill1,
        topics: [
          `Multi-service orchestration and environment parity with ${skill1}`,
          `Data persistence, caching layers, and state handling`,
          `Performance tuning, resource limitations, and debugging tools`,
          `Security hardening and credentials management`
        ],
        resources: [
          `Advanced ${skill1} Production Handbook`,
          `Designing Resilient Architectures with ${skill1}`,
          `Engineering Blog case studies on production deployment`
        ],
        practice: `Connect ${skill1} with your existing full-stack codebase to power persistent workflows.`,
        deliverable: `Fully integrated service running smoothly with automated restart policies.`,
        tasks: [
          {
            id: uuidv4(),
            task: `Architect multi-component setup wiring ${skill1} into application runtime.`,
            practiceTask: `Configure environment variables and secret injection without committing keys.`,
            expectedOutcome: `Zero-secret leaks and dynamic environment support.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Simulate failure modes and implement automated health-checks and reconnect logic.`,
            practiceTask: `Trigger simulated network partition and observe recovery behavior.`,
            expectedOutcome: `System gracefully recovers without manual intervention.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Benchmark performance and document architectural trade-offs.`,
            practiceTask: `Measure response times and memory consumption under load.`,
            expectedOutcome: `Quantifiable performance benchmarks ready to cite in interviews.`,
            completed: false
          }
        ]
      },
      {
        weekNumber: 3,
        title: `${skill2} Primitives & Cloud Infrastructure`,
        skill: skill2,
        topics: [
          `Fundamental cloud architecture and service topology with ${skill2}`,
          `Identity, access management, and least-privilege permission models`,
          `Storage, compute, and networking configuration`,
          `Cost optimization, billing alerts, and monitoring dashboards`
        ],
        resources: [
          `Official ${skill2} Fundamentals Course & Documentation`,
          `Cloud Security Best Practices Blueprint`,
          `Hands-on lab deploying static and dynamic services`
        ],
        practice: `Provision core resources in ${skill2} and deploy a working backend API.`,
        deliverable: `Live cloud deployment accessible via HTTPS with strict security firewall rules.`,
        tasks: [
          {
            id: uuidv4(),
            task: `Set up free-tier account, enable MFA, and create dedicated service roles.`,
            practiceTask: `Establish budget alerts to prevent accidental billing overages.`,
            expectedOutcome: `Secure, isolated cloud workspace ready for deployment.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Deploy frontend and backend artifacts to ${skill2} hosting infrastructure.`,
            practiceTask: `Configure DNS records, SSL certificates, and custom domain routing.`,
            expectedOutcome: `Secure live URL with valid SSL/TLS certificate.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Configure firewall rules and network access control lists.`,
            practiceTask: `Verify that public internet cannot access protected database ports.`,
            expectedOutcome: `Hardened cloud perimeter conforming to modern security audits.`,
            completed: false
          }
        ]
      },
      {
        weekNumber: 4,
        title: `Full-Stack CI/CD Pipeline & End-to-End Automation`,
        skill: `${skill1} + ${skill2}`,
        topics: [
          `Automating testing, building, and deployment via GitHub Actions`,
          `Container registry publishing and automated cloud updates`,
          `Live logging, metrics collection, and alerting`,
          `Zero-downtime deployment strategies and rollback procedures`
        ],
        resources: [
          `GitHub Actions for Modern Web Applications`,
          `Site Reliability Engineering (SRE) Fundamentals`,
          `Continuous Delivery Pipeline Architecture Guide`
        ],
        practice: `Create an end-to-end pipeline where a git push triggers test execution and auto-deployment to ${skill2}.`,
        deliverable: `Production-ready CI/CD pipeline with badge status in GitHub repository README.`,
        tasks: [
          {
            id: uuidv4(),
            task: `Write GitHub Actions workflow YAML running linting, formatting, and unit tests.`,
            practiceTask: `Submit a test PR to confirm pipeline blocks failing code from merging.`,
            expectedOutcome: `Guaranteed code quality baseline for team collaboration.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Add deployment step in CI/CD pipeline authenticating to ${skill2}.`,
            practiceTask: `Deploy changes automatically upon merging to main branch.`,
            expectedOutcome: `True Continuous Deployment pipeline with zero manual file transfers.`,
            completed: false
          },
          {
            id: uuidv4(),
            task: `Set up log monitoring and alerts for 5xx server errors.`,
            practiceTask: `Send test error and confirm alert notification triggers properly.`,
            expectedOutcome: `Operational visibility matching mid-level engineering standards.`,
            completed: false
          }
        ]
      }
    ],
    day29: {
      title: 'Day 29: Comprehensive Technical Revision & Behavioral Mock Interview',
      skill: `${skill1} & ${skill2}`,
      revisionTasks: [
        `Review architecture diagrams, trade-offs, and configuration choices for ${skill1} and ${skill2}.`,
        `Practice articulating the STAR method for how you overcame hurdles during Week 2 & 4.`,
        `Conduct a 45-minute timed mock interview with a peer, recording your audio/video answers.`,
        `Refine concise explanations for key terminology and design trade-offs.`
      ],
      mockInterviewFocus: `Emphasize architectural decision-making, debugging stories, and production security principles.`,
      completed: false
    },
    day30: {
      title: 'Day 30: Final Simulation, Resume Update & Job Application Readiness',
      skill: 'Portfolio & Interview Readiness',
      assessmentTasks: [
        `Update resume with newly proven skills (${skill1}, ${skill2}, CI/CD) and add live project links.`,
        `Conduct live walkthrough of your deployed application as if presenting in a hiring manager round.`,
        `Prepare 3 thoughtful questions to ask interviewers regarding their infrastructure and team practices.`,
        `Submit applications to target job postings with customized resume alignment.`
      ],
      simulationPrompt: `Present your 30-day capstone architecture to the engineering lead for ${targetRole}, defending your stack choices.`,
      completed: false
    }
  };
}
