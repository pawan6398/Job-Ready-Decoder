import { v4 as uuidv4 } from 'uuid';

export const SAMPLE_RESUME_TEXT = `
ALEX MORGAN
alex.morgan@email.com | +1 (555) 234-5678 | github.com/alexmorgan | linkedin.com/in/alexmorgan
San Francisco, CA

SUMMARY
Final-year Computer Science student at California State University with hands-on full stack web development experience building scalable web applications with React, Node.js, Express, and MongoDB. Strong foundation in data structures, RESTful API architecture, and modern JavaScript.

EDUCATION
Bachelor of Science in Computer Science | California State University | Expected May 2026
Relevant Coursework: Data Structures & Algorithms, Database Systems, Web Engineering, Software Architecture, Distributed Systems

TECHNICAL SKILLS
- Programming Languages: JavaScript (ES6+), TypeScript, Python, HTML5, CSS3
- Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, Responsive Web Design
- Backend: Node.js, Express.js, REST APIs, JSON Web Tokens (JWT), WebSocket basics
- Databases: MongoDB (Mongoose), PostgreSQL, Redis (basic caching)
- Developer Tools: Git, GitHub, VS Code, Postman, Vite, npm/yarn
- Testing: Jest, React Testing Library
- Methodologies: Agile / Scrum, Component-driven development, Clean Code

EXPERIENCE
Software Engineering Intern | TechSprint Labs | June 2025 – August 2025
- Built and shipped 5+ responsive React frontend components for client analytics dashboard, reducing initial page load time by 28%.
- Integrated RESTful backend endpoints with axios and managed complex global state with React Context and Redux Toolkit.
- Authored 20+ unit tests with Jest and React Testing Library, achieving 82% code coverage on core user workflows.
- Collaborated in daily Agile standups and two-week sprints with senior engineers, reviewing PRs and resolving merge conflicts using Git.

PROJECTS
EduAI — Intelligent Learning Assistant | React, Node.js, Express, MongoDB, Tailwind CSS
- Designed and built a full-stack learning platform enabling students to organize notes and generate quiz questions.
- Implemented JWT-based authentication with bcrypt password hashing and HTTP-only cookie session protection.
- Architected 12+ REST API endpoints in Express for user profiles, courses, and flashcards with robust input validation.
- Deployed frontend to Vercel and backend to Render with MongoDB Atlas database cluster.

DevMetrics — Developer Productivity Tracker | Next.js, TypeScript, PostgreSQL, Prisma
- Developed a web application tracking GitHub commit activity, PR cycle times, and issue turnaround metrics.
- Utilized TypeScript for end-to-end type safety across API routes and React functional components.
- Designed relational database schema with PostgreSQL and Prisma ORM for relational querying and indexing.
- Implemented dark mode UI with Tailwind CSS and responsive charts using SVG data visualizations.
`.trim();

export const SAMPLE_JD_1 = `
Job Title: Full Stack Software Engineer (Entry-Level / Associate)
Company: NexaPay Technologies (FinTech)
Location: Remote / Hybrid

About The Role:
NexaPay is looking for an enthusiastic Full Stack Engineer to join our core product engineering team. You will build and scale web applications powering secure payment workflows and user dashboards.

Responsibilities:
- Build high-performance, accessible, and responsive user interfaces with React.js, TypeScript, and modern CSS/Tailwind.
- Develop reliable, maintainable backend microservices and REST APIs using Node.js and Express.
- Collaborate with database engineers on data modeling in MongoDB and PostgreSQL.
- Deploy and monitor cloud services hosted on AWS (EC2, S3, CloudWatch).
- Containerize application components using Docker for local dev environments and cloud deployments.
- Write automated unit and integration tests using Jest.
- Participate in Agile ceremonies, code reviews, and Git-based collaborative workflows.
- Communicate technical tradeoffs effectively within a cross-functional team.

Requirements:
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.
- Strong proficiency in JavaScript (ES6+), TypeScript, HTML5, and CSS3.
- Demonstrated experience building web applications with React and Node.js / Express.
- Hands-on familiarity with REST API design, HTTP status codes, and JSON data formats.
- Working knowledge of Git version control and GitHub PR workflows.
- Familiarity with AWS cloud primitives and containerization concepts (Docker).
- Strong problem-solving abilities and enthusiasm for continuous learning.
`.trim();

export const SAMPLE_JD_2 = `
Job Title: Associate Full Stack Developer
Company: CloudPulse Software
Location: San Francisco, CA / Remote

About Us:
CloudPulse provides real-time observability and cloud monitoring tools for enterprise engineering teams. We are seeking a talented Associate Full Stack Developer to help develop our customer-facing web console.

Key Responsibilities:
- Develop modular UI components using React, TypeScript, and state management libraries.
- Engineer RESTful APIs and backend services using Node.js and Express.
- Work with cloud infrastructure deployed on AWS (Lambda, ECS, S3).
- Utilize Docker for environment consistency and CI/CD pipelines.
- Manage data storage and caching solutions using PostgreSQL, MongoDB, and Redis.
- Ensure high code quality through automated testing with Jest and thorough peer reviews.
- Work alongside product managers and designers in a fast-paced Agile sprint cycle.

Qualifications:
- BS or MS in Computer Science or related STEM field.
- Solid understanding of JavaScript, React.js component lifecycle, and React hooks.
- Experience building RESTful APIs in Node.js.
- Exposure to relational (PostgreSQL/SQL) and NoSQL (MongoDB) databases.
- Familiarity with AWS cloud architecture and Docker containers is a strong plus.
- Proficiency with Git for branch management and pull requests.
- Excellent written and verbal communication skills.
`.trim();

export const SAMPLE_JD_3 = `
Job Title: Junior Full Stack Web Developer
Company: Velocity Commerce
Location: Hybrid (New York, NY)

Position Overview:
Velocity Commerce powers e-commerce experiences for top global brands. We are hiring a Junior Full Stack Web Developer to enhance our merchant administration platform and customer storefronts.

What You Will Do:
- Build dynamic, responsive single-page web applications with React.js and modern JavaScript.
- Design and implement scalable REST APIs with Node.js, Express, and JWT authentication.
- Work with MongoDB database collections, query optimization, and schema design.
- Containerize services with Docker and deploy services across AWS cloud infrastructure.
- Write unit tests using Jest to maintain robust test coverage across releases.
- Use Git and GitHub for version control, branching strategies, and CI/CD automation.
- Partner with team members in daily Scrum meetings, sprint planning, and retrospective sessions.

Requirements:
- Degree in Computer Science or demonstrable experience through projects/internships.
- Proficiency with JavaScript (ES6+), React, Node.js, and Express.
- Understanding of REST API architecture, HTTP protocol, and web security best practices (JWT, CORS).
- Practical experience with MongoDB or SQL databases.
- Familiarity with Docker containerization and AWS cloud hosting.
- Experience with Jest or automated testing frameworks.
- Team-first mindset, proactive communication, and problem-solving drive.
`.trim();

export function getSampleAnalysisData(userId) {
  const recurringSkills = [
    {
      id: uuidv4(),
      name: 'React.js',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Frontend',
      classification: 'Already Have',
      evidence: 'EduAI — Built full frontend with React.js & Tailwind CSS; TechSprint Labs internship — Built 5+ responsive React components with Redux Toolkit.',
      userNote: 'Strong hands-on experience in production internship and personal full-stack project.'
    },
    {
      id: uuidv4(),
      name: 'Node.js',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Backend',
      classification: 'Already Have',
      evidence: 'EduAI — Architected 12+ REST API endpoints in Express & Node.js with JWT auth and MongoDB.',
      userNote: 'Solid backend experience building REST APIs.'
    },
    {
      id: uuidv4(),
      name: 'REST APIs',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Backend',
      classification: 'Already Have',
      evidence: 'EduAI — Designed RESTful endpoints for users/flashcards; TechSprint Labs — Integrated REST APIs with axios.',
      userNote: 'Core strength across both projects and internship.'
    },
    {
      id: uuidv4(),
      name: 'JavaScript (ES6+)',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Programming',
      classification: 'Already Have',
      evidence: 'Listed under Technical Skills; applied in all projects and TechSprint Labs internship.',
      userNote: 'Fluent in async/await, closures, promises, and modern ES6 syntax.'
    },
    {
      id: uuidv4(),
      name: 'Git & GitHub',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'DevOps',
      classification: 'Already Have',
      evidence: 'TechSprint Labs — Handled pull requests, code reviews, and merge conflicts; active GitHub profile.',
      userNote: 'Daily team Git workflow experience.'
    },
    {
      id: uuidv4(),
      name: 'MongoDB',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Database',
      classification: 'Already Have',
      evidence: 'EduAI project — Schema modeling with Mongoose, database indexing, and Atlas cloud deployment.',
      userNote: 'Solid NoSQL schema design experience.'
    },
    {
      id: uuidv4(),
      name: 'AWS (Cloud)',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Cloud',
      classification: 'Need to Learn',
      evidence: 'Not present on resume. Experience is limited to PaaS providers (Vercel, Render) rather than core AWS services.',
      userNote: 'Target key AWS primitives: S3, EC2, IAM, Lambda.'
    },
    {
      id: uuidv4(),
      name: 'Docker',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'DevOps',
      classification: 'Need to Learn',
      evidence: 'No containerization experience or Dockerfiles mentioned in resume projects or internship.',
      userNote: 'High ROI skill to learn for local environment reproducibility and container deployments.'
    },
    {
      id: uuidv4(),
      name: 'Jest (Testing)',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Testing',
      classification: 'Already Have',
      evidence: 'TechSprint Labs internship — Authored 20+ unit tests with Jest and React Testing Library (82% coverage).',
      userNote: 'Good testing foundations on frontend workflows.'
    },
    {
      id: uuidv4(),
      name: 'TypeScript',
      frequency: '2/3',
      count: 2,
      total: 3,
      category: 'Programming',
      classification: 'Need to Demonstrate',
      evidence: 'DevMetrics project lists TypeScript, but resume lacks detailed descriptions of complex generics or backend typing.',
      userNote: 'Know basics, but need to demonstrate advanced type safety in interview discussion.'
    },
    {
      id: uuidv4(),
      name: 'PostgreSQL / SQL',
      frequency: '2/3',
      count: 2,
      total: 3,
      category: 'Database',
      classification: 'Need to Demonstrate',
      evidence: 'DevMetrics project mentions PostgreSQL with Prisma, but lacks evidence of complex SQL queries or joins.',
      userNote: 'Be prepared to explain indexing, ACID properties, and relational schema normalization.'
    },
    {
      id: uuidv4(),
      name: 'Agile / Scrum',
      frequency: '3/3',
      count: 3,
      total: 3,
      category: 'Soft Skills',
      classification: 'Already Have',
      evidence: 'TechSprint Labs internship — Participated in daily standups and two-week sprint cycles.',
      userNote: 'Comfortable speaking to sprint ceremonies and peer reviews.'
    },
    {
      id: uuidv4(),
      name: 'Redis',
      frequency: '2/3',
      count: 2,
      total: 3,
      category: 'Database',
      classification: 'Not Important for Me',
      evidence: 'Listed as basic caching only; not prioritized for entry-level full stack focus.',
      userNote: 'Secondary priority behind mastering AWS and Docker.'
    }
  ];

  const q1Id = uuidv4();
  const q2Id = uuidv4();
  const q3Id = uuidv4();
  const q4Id = uuidv4();
  const q5Id = uuidv4();
  const q6Id = uuidv4();
  const q7Id = uuidv4();
  const q8Id = uuidv4();

  const interviewQuestions = [
    {
      id: q1Id,
      question: 'Explain how you implemented JWT authentication and session security in your EduAI project.',
      category: 'Project-based',
      whyLikely: 'EduAI lists JWT authentication with bcrypt hashing, and all 3 JDs require secure REST API development.',
      relevantEvidence: 'Resume: EduAI project — "Implemented JWT-based authentication with bcrypt password hashing and HTTP-only cookie session protection."'
    },
    {
      id: q2Id,
      question: 'How do you structure and optimize REST API endpoints in Node.js and Express?',
      category: 'Technical',
      whyLikely: 'REST APIs appeared in 3/3 job descriptions as a primary responsibility.',
      relevantEvidence: 'Resume: EduAI project architected 12+ REST endpoints; TechSprint Labs integrated backend endpoints.'
    },
    {
      id: q3Id,
      question: 'Why did you choose MongoDB for EduAI, and how did you model the data schema with Mongoose?',
      category: 'Technical',
      whyLikely: 'All 3 JDs highlight database modeling, and candidate utilized MongoDB extensively in EduAI.',
      relevantEvidence: 'Resume: EduAI lists MongoDB (Mongoose) with user profiles, courses, and flashcards.'
    },
    {
      id: q4Id,
      question: 'Describe a challenging technical bug or performance bottleneck you encountered at TechSprint Labs and how you resolved it.',
      category: 'Problem-solving',
      whyLikely: 'Employers want concrete proof of debugging skills and engineering resilience in a production environment.',
      relevantEvidence: 'Resume: TechSprint Labs internship — Reduced page load time by 28% and authored 20+ unit tests.'
    },
    {
      id: q5Id,
      question: 'How do you approach automated testing with Jest, and how did you achieve 82% code coverage during your internship?',
      category: 'Resume-based',
      whyLikely: 'Jest appears in 3/3 JDs; employers value engineers who write dependable tests without hand-holding.',
      relevantEvidence: 'Resume: TechSprint Labs — "Authored 20+ unit tests with Jest and React Testing Library, achieving 82% code coverage."'
    },
    {
      id: q6Id,
      question: 'What is your experience with React state management, and when would you choose Context API versus Redux Toolkit?',
      category: 'Technical',
      whyLikely: 'React is required in 3/3 JDs; understanding state management scope is a core interview filter.',
      relevantEvidence: 'Resume: TechSprint Labs — Managed complex global state with React Context and Redux Toolkit.'
    },
    {
      id: q7Id,
      question: 'Tell me about a time you collaborated in an Agile sprint, received critical code review feedback, or resolved a merge conflict.',
      category: 'Behavioral',
      whyLikely: 'All 3 JDs emphasize cross-functional teamwork, code reviews, and Git collaboration.',
      relevantEvidence: 'Resume: TechSprint Labs — Collaborated in daily standups and sprint planning, reviewing PRs and resolving merge conflicts.'
    },
    {
      id: q8Id,
      question: 'The job requires Docker and AWS. How would you containerize your Node.js/React application and get up to speed on AWS?',
      category: 'Role-specific',
      whyLikely: 'Docker and AWS are prominent in 3/3 JDs but represent identified skill gaps on your resume.',
      relevantEvidence: 'Resume: Currently deployed on Vercel and Render; proactively bridging gap to Docker and AWS.'
    }
  ];

  const answers = [
    {
      questionId: q1Id,
      question: 'Explain how you implemented JWT authentication and session security in your EduAI project.',
      whyAsked: 'Verifies real backend security competence and confirms candidate didn’t simply copy-paste boilerplates.',
      resumeAnswer: 'In my EduAI project, I implemented user authentication using JSON Web Tokens (JWT) paired with bcrypt for password hashing. When a user registers or logs in, their password is salted with 10 rounds of bcrypt before storage in MongoDB. Upon verification, the server generates a signed JWT payload containing the user ID and role, signed with an HMAC SHA-256 secret. To protect against XSS attacks, rather than storing the token in localStorage, I configured Express to transmit the JWT in an HTTP-only, secure, SameSite cookie. An Express middleware inspects the cookie on protected routes, verifies the token signature, and attaches the authenticated user object to the request.',
      userEditedAnswer: 'In my EduAI project, I implemented user authentication using JSON Web Tokens (JWT) paired with bcrypt for password hashing. When a user registers or logs in, their password is salted with 10 rounds of bcrypt before storage in MongoDB. Upon verification, the server generates a signed JWT payload containing the user ID and role, signed with an HMAC SHA-256 secret. To protect against XSS attacks, rather than storing the token in localStorage, I configured Express to transmit the JWT in an HTTP-only, secure, SameSite cookie. An Express middleware inspects the cookie on protected routes, verifies the token signature, and attaches the authenticated user object to the request.',
      keyPoints: [
        'Salted bcrypt password hashing with appropriate cost factor (10 rounds)',
        'Signed JWT payload with expiration and role-based claims',
        'HTTP-only, Secure, SameSite cookie defense against XSS and CSRF',
        'Reusable Express auth middleware validating Bearer token / cookies on protected routes'
      ],
      commonMistakes: [
        'Storing sensitive user passwords in plaintext or using outdated MD5/SHA1',
        'Storing JWT in localStorage where it is vulnerable to cross-site scripting (XSS)',
        'Failing to handle token expiration or invalid signature errors gracefully'
      ],
      followUpQuestions: [
        'How would you handle token revocation or user logout before JWT expiration?',
        'What is the difference between Access Tokens and Refresh Tokens?',
        'How do you protect your endpoints against CSRF when using cookies?'
      ],
      confidenceRating: 'High'
    },
    {
      questionId: q2Id,
      question: 'How do you structure and optimize REST API endpoints in Node.js and Express?',
      whyAsked: 'Assesses architectural maturity, adherence to HTTP standards, and ability to write maintainable backend code.',
      resumeAnswer: 'In my EduAI project, I structured 12+ REST endpoints following a layered architecture: routes handle URL mapping, controllers manage request validation and response formatting, and Mongoose models encapsulate database queries. I strictly adhere to standard HTTP verbs—GET for retrieving, POST for creation, PUT/PATCH for updates, and DELETE for removal—along with semantic HTTP status codes (200, 201, 400, 401, 404, 500). For optimization, I used Mongoose projection to only return needed fields, indexed frequent query fields like userId and courseId, and implemented express-rate-limit to protect endpoints from abuse.',
      userEditedAnswer: 'In my EduAI project, I structured 12+ REST endpoints following a layered architecture: routes handle URL mapping, controllers manage request validation and response formatting, and Mongoose models encapsulate database queries. I strictly adhere to standard HTTP verbs—GET for retrieving, POST for creation, PUT/PATCH for updates, and DELETE for removal—along with semantic HTTP status codes (200, 201, 400, 401, 404, 500). For optimization, I used Mongoose projection to only return needed fields, indexed frequent query fields like userId and courseId, and implemented express-rate-limit to protect endpoints from abuse.',
      keyPoints: [
        'Layered separation of concerns (Routes -> Controllers -> Services/Models)',
        'Strict HTTP verb semantics and standardized error response payloads',
        'Database indexing on high-frequency query fields and field projections',
        'Input validation and rate limiting for reliability and security'
      ],
      commonMistakes: [
        'Using POST for every action or returning HTTP 200 for error responses',
        'Putting database queries directly inside route callback files without separation',
        'Over-fetching full database documents when only a few fields are needed'
      ],
      followUpQuestions: [
        'How do you handle pagination when an endpoint returns thousands of records?',
        'How do you structure centralized error handling middleware in Express?',
        'How would you implement caching for read-heavy REST endpoints?'
      ],
      confidenceRating: 'Medium'
    },
    {
      questionId: q4Id,
      question: 'Describe a challenging technical bug or performance bottleneck you encountered at TechSprint Labs and how you resolved it.',
      whyAsked: 'Evaluates production troubleshooting methodology, profiling capability, and communication clarity.',
      resumeAnswer: 'During my internship at TechSprint Labs, our client analytics dashboard suffered from slow initial page loads and sluggish UI updates when switching between heavy metric charts. I profiled the component tree using React DevTools Profiler and Chrome Performance tab, discovering that multiple parent state updates were triggering unnecessary re-renders of large SVG chart components. I resolved this by memoizing heavy calculation functions with useMemo, wrapping chart sub-components in React.memo, and decoupling high-frequency filter inputs into local component state. Additionally, we implemented code-splitting via React.lazy and dynamic imports for secondary dashboard tabs. These optimizations reduced initial page load time by 28% and eliminated UI stutter.',
      userEditedAnswer: 'During my internship at TechSprint Labs, our client analytics dashboard suffered from slow initial page loads and sluggish UI updates when switching between heavy metric charts. I profiled the component tree using React DevTools Profiler and Chrome Performance tab, discovering that multiple parent state updates were triggering unnecessary re-renders of large SVG chart components. I resolved this by memoizing heavy calculation functions with useMemo, wrapping chart sub-components in React.memo, and decoupling high-frequency filter inputs into local component state. Additionally, we implemented code-splitting via React.lazy and dynamic imports for secondary dashboard tabs. These optimizations reduced initial page load time by 28% and eliminated UI stutter.',
      keyPoints: [
        'Objective profiling with React DevTools and Chrome Performance tab before writing code',
        'Targeted elimination of wasted re-renders using React.memo and useMemo',
        'Code-splitting with React.lazy to decrease initial bundle transfer size',
        'Measurable business impact: 28% page load reduction verified on production metrics'
      ],
      commonMistakes: [
        'Blindly wrapping every function in useCallback without profiling where re-renders occur',
        'Blaming backend performance without verifying network waterfall and client render time',
        'Failing to quantify results with concrete metrics or benchmarks'
      ],
      followUpQuestions: [
        'How do you decide between useMemo vs letting React re-calculate a value?',
        'What metrics (e.g. LCP, FID, CLS) do you prioritize when evaluating web vitals?',
        'How did you ensure that code-splitting did not cause layout shifts?'
      ],
      confidenceRating: 'High'
    }
  ];

  const learningPlan = {
    skillsToLearn: ['Docker', 'AWS (Cloud)'],
    weeks: [
      {
        weekNumber: 1,
        title: 'Docker Fundamentals & Containerization Basics',
        skill: 'Docker',
        topics: [
          'Containers vs Virtual Machines: architecture and isolation',
          'Dockerfile syntax: FROM, WORKDIR, COPY, RUN, CMD, EXPOSE, ENV',
          'Building, tagging, and running Docker images locally',
          'Multi-stage builds to optimize image footprint for Node.js apps'
        ],
        resources: [
          'Docker Official Get Started Documentation (docs.docker.com)',
          'Docker for Node.js Developers Guide',
          'Play with Docker interactive labs'
        ],
        practice: 'Write a multi-stage Dockerfile for the EduAI Express backend and run it in an isolated container.',
        deliverable: 'Containerized Express/Node.js backend running on localhost:5000 with minimal production image size (<150MB).',
        tasks: [
          {
            id: uuidv4(),
            task: 'Install Docker Desktop and verify container runtime commands (docker run, docker ps, docker stop).',
            practiceTask: 'Run an official Node alpine container and execute interactive shell commands.',
            expectedOutcome: 'Fluency in primary Docker CLI commands and image management.',
            completed: true
          },
          {
            id: uuidv4(),
            task: 'Write a production-ready Dockerfile for an Express API utilizing .dockerignore and non-root user permissions.',
            practiceTask: 'Build the image locally and inspect layer caching during code edits.',
            expectedOutcome: 'Clean, cache-efficient Dockerfile without leaking node_modules or secrets.',
            completed: true
          },
          {
            id: uuidv4(),
            task: 'Implement multi-stage build separating dev dependencies from lean production runtime.',
            practiceTask: 'Compare image sizes between single-stage vs multi-stage builds.',
            expectedOutcome: 'Achieve >60% image size reduction using alpine runtime base.',
            completed: false
          }
        ]
      },
      {
        weekNumber: 2,
        title: 'Multi-Container Orchestration with Docker Compose',
        skill: 'Docker',
        topics: [
          'Docker Compose specification (services, networks, volumes, environment)',
          'Orchestrating React frontend, Express API, and local MongoDB container',
          'Persistent data volumes for database containers',
          'Container networking, internal DNS resolution, and port binding'
        ],
        resources: [
          'Docker Compose V2 Documentation',
          'Full-Stack MERN Docker Compose architecture patterns',
          'Docker networking deep-dive guide'
        ],
        practice: 'Create a docker-compose.yml file that launches the React frontend, Express backend, and MongoDB service with one command.',
        deliverable: 'A single `docker compose up` command boots the complete 3-tier application with hot reloading and database persistence.',
        tasks: [
          {
            id: uuidv4(),
            task: 'Write docker-compose.yml defining frontend, backend, and mongodb services.',
            practiceTask: 'Configure named volumes for MongoDB data persistence across restarts.',
            expectedOutcome: 'Database retains records even after docker compose down/up cycles.',
            completed: false
          },
          {
            id: uuidv4(),
            task: 'Configure custom bridge network allowing services to communicate via container names (e.g. mongodb://mongodb:27017).',
            practiceTask: 'Verify internal connectivity using docker exec and curl/ping.',
            expectedOutcome: 'Eliminate hardcoded host IPs and understand Docker internal DNS.',
            completed: false
          },
          {
            id: uuidv4(),
            task: 'Add bind mounts for local dev hot-reloading in frontend and backend containers.',
            practiceTask: 'Edit a React component and Express route and confirm instant reloading inside containers.',
            expectedOutcome: 'A seamless local container development workflow.',
            completed: false
          }
        ]
      },
      {
        weekNumber: 3,
        title: 'AWS Core Primitives: IAM, S3, and EC2',
        skill: 'AWS (Cloud)',
        topics: [
          'AWS Free Tier setup, billing alarms, and security best practices',
          'IAM: Users, Groups, Roles, Policies, and Least Privilege access',
          'Amazon S3: Buckets, permissions, static website hosting, and presigned URLs',
          'Amazon EC2: Instances, Security Groups, SSH key pairs, and Elastic IPs'
        ],
        resources: [
          'AWS Cloud Practitioner Essentials (Skill Builder)',
          'AWS Hands-on Tutorials: Host a Static Website on S3',
          'AWS EC2 Linux Instance User Guide'
        ],
        practice: 'Deploy the React frontend as a static website on Amazon S3 and provision an EC2 Linux instance with security groups.',
        deliverable: 'Live React static site on AWS S3 and an operational EC2 instance accessible over SSH with tight security group rules.',
        tasks: [
          {
            id: uuidv4(),
            task: 'Create AWS account, enable MFA on root, and configure an IAM admin user with programmatic access keys.',
            practiceTask: 'Set up an AWS billing alert for $5 to prevent unintended costs.',
            expectedOutcome: 'Secure AWS account following cloud security baseline.',
            completed: false
          },
          {
            id: uuidv4(),
            task: 'Deploy Vite React build output to an S3 bucket configured for static web hosting.',
            practiceTask: 'Configure bucket policy allowing public read access for web assets.',
            expectedOutcome: 'Publicly reachable React frontend hosted directly on Amazon S3.',
            completed: false
          },
          {
            id: uuidv4(),
            task: 'Launch an Amazon EC2 t3.micro instance running Ubuntu, configure inbound security groups (port 22, 80, 443).',
            practiceTask: 'Connect via SSH key pair, install Node.js and Git, and clone sample API.',
            expectedOutcome: 'Understanding EC2 lifecycle, security groups, and cloud server provisioning.',
            completed: false
          }
        ]
      },
      {
        weekNumber: 4,
        title: 'AWS Container Deployment & CI/CD Pipelines',
        skill: 'AWS (Cloud)',
        topics: [
          'Deploying containerized apps with Docker on EC2 with Nginx reverse proxy',
          'Introduction to AWS ECS (Elastic Container Service) and ECR (Container Registry)',
          'Automating build and deploy workflows with GitHub Actions to AWS',
          'CloudWatch monitoring, application logging, and health checks'
        ],
        resources: [
          'AWS ECR & ECS Getting Started Guides',
          'GitHub Actions Documentation for AWS Deployments',
          'Nginx Reverse Proxy configuration handbook'
        ],
        practice: 'Push your Docker image to AWS ECR, deploy it to your EC2 instance behind an Nginx reverse proxy with SSL (Certbot), and automate with GitHub Actions.',
        deliverable: 'Production full-stack deployment on AWS where a Git push to `main` triggers automated testing and deployment.',
        tasks: [
          {
            id: uuidv4(),
            task: 'Configure Nginx on EC2 as a reverse proxy forwarding port 80/443 to the local Docker container port 5000.',
            practiceTask: 'Install Let\'s Encrypt SSL certificate via Certbot for HTTPS termination.',
            expectedOutcome: 'Secure production web server routing traffic to Docker containers.',
            completed: false
          },
          {
            id: uuidv4(),
            task: 'Create GitHub Actions workflow YAML that builds Docker image, runs Jest tests, and verifies linting.',
            practiceTask: 'Configure deployment secrets in GitHub Repository Secrets.',
            expectedOutcome: 'Automated CI/CD pipeline preventing broken builds from deploying.',
            completed: false
          },
          {
            id: uuidv4(),
            task: 'Configure CloudWatch agent or container logs to monitor application uptime and HTTP error rates.',
            practiceTask: 'Trigger sample error requests and verify logs in AWS console.',
            expectedOutcome: 'Production observability and cloud log monitoring fluency.',
            completed: false
          }
        ]
      }
    ],
    day29: {
      title: 'Day 29: Intensive Revision & Full Technical Mock Interview',
      skill: 'Docker & AWS',
      revisionTasks: [
        'Review Dockerfile vs Docker Compose definitions, networking modes, and volume caching.',
        'Review AWS core architecture: S3 vs EC2 vs ECS, IAM roles, and security groups.',
        'Conduct 45-minute timed mock interview answering Docker and AWS architectural questions.',
        'Document 3 areas of hesitation and refine verbal explanations.'
      ],
      mockInterviewFocus: 'Focus on explaining why containerization solves "works on my machine" issues and articulating AWS trade-offs.',
      completed: false
    },
    day30: {
      title: 'Day 30: Final Practical Assessment & Role Simulation',
      skill: 'Full Stack Integration',
      assessmentTasks: [
        'Perform a clean deployment of the full-stack project from scratch using Docker and AWS.',
        'Simulate a live troubleshooting scenario: kill database container and verify recovery behavior.',
        'Walk through your completed architecture live on webcam/recording as if presenting to an engineering hiring manager.',
        'Update resume with newly validated skills: "Docker", "AWS (EC2, S3)", "Containerized Deployments".'
      ],
      simulationPrompt: 'You are presenting your architecture to the Lead Engineer at NexaPay. Explain your choice of Docker Compose for local development and how your deployment scales on AWS.',
      completed: false
    }
  };

  return {
    userId: userId || 'demo-user-id',
    targetRole: 'Full Stack Software Engineer',
    resumeOriginalName: 'Alex_Morgan_Resume_2026.pdf',
    resumeText: SAMPLE_RESUME_TEXT,
    jobDescriptions: [
      {
        id: uuidv4(),
        title: 'Full Stack Software Engineer (Entry-Level / Associate)',
        company: 'NexaPay Technologies',
        filename: 'NexaPay_FullStack_JD.pdf',
        text: SAMPLE_JD_1
      },
      {
        id: uuidv4(),
        title: 'Associate Full Stack Developer',
        company: 'CloudPulse Software',
        filename: 'CloudPulse_JD.docx',
        text: SAMPLE_JD_2
      },
      {
        id: uuidv4(),
        title: 'Junior Full Stack Web Developer',
        company: 'Velocity Commerce',
        filename: 'VelocityCommerce_JD.txt',
        text: SAMPLE_JD_3
      }
    ],
    recurringSkills,
    interviewQuestions,
    selectedQuestions: [q1Id, q2Id, q4Id],
    answers,
    learningPlan
  };
}
