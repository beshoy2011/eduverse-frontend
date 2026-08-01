export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ExerciseStep {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  expectedOutput?: string;
  aiPromptHint: string;
  solutionCode: string;
}

export interface LessonModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  estimatedHours: number;
  xpReward: number;
  coinsReward: number;
  badgeName: string;
  badgeIcon: string;
  objectives: string[];
  readingMaterial: string;
  videoPlaceholderUrl: string;
  videoTitle: string;
  quizzes: QuizQuestion[];
  codingExercises: ExerciseStep[];
  aiChallenge: {
    title: string;
    promptInstruction: string;
    targetResult: string;
  };
  miniProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Curriculum' | 'Hackathon' | 'Community' | 'Mastery';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpValue: number;
  unlocked?: boolean;
}

export interface SkillNode {
  id: number;
  title: string;
  category: string;
  prerequisiteId: number | null;
  xpRequired: number;
  unlocked: boolean;
  completed: boolean;
}

export interface JudgeProfile {
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
}

export interface HallOfFameProject {
  id: string;
  name: string;
  tagline: string;
  founder: string;
  avatar: string;
  category: string;
  score: number;
  rank: number;
  image: string;
  githubUrl: string;
  demoUrl: string;
  replitUrl: string;
  description: string;
  badge: string;
  techStack: string[];
}

export const REPLIT_CHALLENGE_MODULES: LessonModule[] = [
  {
    id: 1,
    slug: 'welcome-eduverse-replit',
    title: 'Welcome to EduVerse × Replit',
    subtitle: 'Build the Future. Ship the Impossible.',
    description: 'Kickstart your AI Startup journey. Discover how Replit Agent & EduVerse empower complete beginners to turn ideas into deployed software in hours.',
    iconName: 'Sparkles',
    level: 'Beginner',
    estimatedHours: 1.5,
    xpReward: 250,
    coinsReward: 50,
    badgeName: 'Pioneer Builder',
    badgeIcon: '🚀',
    objectives: [
      'Understand the Replit AI Startup Builder Accelerator roadmap',
      'Set up your Replit Workspace & EduVerse Cloud Link',
      'Learn how Replit Agent autonomously writes, tests, and deploys full-stack apps',
      'Formulate your initial AI startup vision'
    ],
    readingMaterial: `# Welcome to EduVerse × Replit AI Accelerator

Welcome to the future of software creation! You are entering an elite startup incubator designed to transform absolute beginners into AI startup founders.

### Why Replit + EduVerse?
Traditional software development takes months of setup, environment debugging, and complex build tools. **Replit Agent** changes everything:
1. **Natural Language Coding**: Describe what you want in plain English.
2. **Autonomous Scaffolding**: Replit creates file structures, installs packages, and configures databases automatically.
3. **Instant Cloud Deployment**: One click to publish your app to millions of users worldwide.

> *"The best way to predict the future is to build it."* — Replit AI Manifesto`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Welcome to the Replit AI Accelerator',
    quizzes: [
      {
        id: 'q1-1',
        question: 'What is the primary power of Replit Agent for startup builders?',
        options: [
          'It turns natural language descriptions into full-stack software and automatically configures environments.',
          'It replaces human founders entirely with AI bots.',
          'It only formats CSS code.',
          'It requires 5 years of C++ experience to run.'
        ],
        correctAnswer: 0,
        explanation: 'Replit Agent interprets natural language prompts to scaffold, program, test, and deploy applications instantly.'
      },
      {
        id: 'q1-2',
        question: 'How long do students have in the EduVerse Global Build Challenge?',
        options: ['2 hours', '14 days', '6 months', '1 year'],
        correctAnswer: 1,
        explanation: 'After finishing the course, students enter the 14-day EduVerse Global Build Challenge to launch their startup.'
      }
    ],
    codingExercises: [
      {
        id: 'ex1-1',
        title: 'Your First AI Startup Tagline Generator',
        description: 'Modify the JavaScript code below to log your AI startup idea and mission statement to the console.',
        initialCode: `// Welcome to EduVerse x Replit
const startupName = "AuraMind AI";
const tagline = "AI Mental Health Assistant for Students";

console.log(\`⚡ Launching \${startupName}: \${tagline}\`);`,
        solutionCode: `const startupName = "AuraMind AI";
const tagline = "AI Mental Health Assistant for Students";

console.log(\`⚡ Launching \${startupName}: \${tagline}\`);`,
        aiPromptHint: 'Try changing startupName and tagline to your own AI startup idea!'
      }
    ],
    aiChallenge: {
      title: 'Define Your Startup Vision',
      promptInstruction: 'Prompt Replit Agent to design a landing page wireframe for a futuristic AI product of your choice.',
      targetResult: 'Hero title, value proposition, and email signup box rendered cleanly.'
    },
    miniProject: {
      title: 'Startup Genesis Document',
      description: 'Create your 1-page startup pitch draft inside Replit describing the problem, AI solution, and target audience.',
      deliverables: ['Problem Statement', 'AI Solution Overview', 'Target Audience', 'Replit Workspace URL']
    }
  },
  {
    id: 2,
    slug: 'introduction-to-ai',
    title: 'Introduction to AI & LLMs',
    subtitle: 'Demystifying Large Language Models',
    description: 'Learn how modern AI models like GPT-4, Claude, Gemini, and open-source LLMs process text, reason, and generate code.',
    iconName: 'Brain',
    level: 'Beginner',
    estimatedHours: 2.0,
    xpReward: 300,
    coinsReward: 60,
    badgeName: 'Neural Initiate',
    badgeIcon: '🧠',
    objectives: [
      'Understand Transformers, Neural Networks, and Tokens',
      'Differentiate between LLM APIs, embeddings, and context windows',
      'Learn how AI model latency, temperature, and token limits affect UX',
      'Choose the right model for your AI startup feature set'
    ],
    readingMaterial: `# Introduction to Large Language Models (LLMs)

Modern AI startups leverage **Large Language Models (LLMs)** as reasoning engines inside software.

### Key AI Concepts Every Founder Must Know
- **Tokens**: Pieces of words (1,000 tokens ≈ 750 words).
- **Context Window**: The memory limit of an AI call (e.g., 128k - 1M tokens).
- **Temperature**: Controls creativity (0.0 = precise/factual, 0.9 = creative/varied).
- **API Pay-Per-Token**: How AI startups manage unit economics and cloud costs.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'How Large Language Models Work Under the Hood',
    quizzes: [
      {
        id: 'q2-1',
        question: 'What happens when you set an AI model Temperature to 0.0?',
        options: [
          'The model becomes extremely creative and random.',
          'The model becomes deterministic, selecting the most probable tokens for precise outputs.',
          'The model shuts down completely.',
          'The API becomes free of charge.'
        ],
        correctAnswer: 1,
        explanation: 'Low temperature (0.0) yields consistent, factual outputs suitable for code generation and structured data.'
      }
    ],
    codingExercises: [
      {
        id: 'ex2-1',
        title: 'Calculate Token Cost Calculator',
        description: 'Write a utility function to estimate API costs based on input and output token counts.',
        initialCode: `function calculateCost(inputTokens, outputTokens) {
  const inputRatePer1k = 0.0015; // $0.0015 per 1k input tokens
  const outputRatePer1k = 0.0020; // $0.0020 per 1k output tokens
  
  const totalCost = (inputTokens / 1000 * inputRatePer1k) + (outputTokens / 1000 * outputRatePer1k);
  return totalCost.toFixed(4);
}

console.log("Estimated cost ($):", calculateCost(5000, 2000));`,
        solutionCode: `function calculateCost(inputTokens, outputTokens) {
  const inputRatePer1k = 0.0015;
  const outputRatePer1k = 0.0020;
  const totalCost = (inputTokens / 1000 * inputRatePer1k) + (outputTokens / 1000 * outputRatePer1k);
  return totalCost.toFixed(4);
}

console.log("Estimated cost ($):", calculateCost(5000, 2000));`,
        aiPromptHint: 'Modify the function to take custom token rates for GPT-4o or Claude 3.5 Sonnet.'
      }
    ],
    aiChallenge: {
      title: 'Model Comparison Test',
      promptInstruction: 'Prompt AI to summarize a technical article using two different temperature settings and analyze response variances.',
      targetResult: 'Comparison notes detailing factual precision vs creative flair.'
    },
    miniProject: {
      title: 'AI Economics Calculator',
      description: 'Build a lightweight calculator tool on Replit that estimates monthly AI token costs for 1,000 active startup users.',
      deliverables: ['Interactive Token Calculator Component', 'Cost Projections Sheet']
    }
  },
  {
    id: 3,
    slug: 'prompt-engineering',
    title: 'Prompt Engineering & System Directives',
    subtitle: 'Architecting AI Cognition & Structured JSON Outputs',
    description: 'Master Few-Shot Prompting, Chain of Thought (CoT), System Instructions, and JSON Schema enforcement for reliable AI features.',
    iconName: 'MessageSquareCode',
    level: 'Beginner',
    estimatedHours: 2.5,
    xpReward: 350,
    coinsReward: 75,
    badgeName: 'Prompt Architect',
    badgeIcon: '⚡',
    objectives: [
      'Master System vs User vs Assistant message roles',
      'Enforce strict JSON schemas from AI APIs without hallucination',
      'Implement Few-Shot prompting for consistent structured data',
      'Prevent prompt injection and security exploits'
    ],
    readingMaterial: `# Advanced Prompt Engineering for AI Startups

In production AI apps, loose text prompts cause random failures. Great prompt engineers design **Structured System Directives**.

### The 4 Pillars of a Production System Prompt
1. **Role & Identity**: "You are an elite financial analyst AI."
2. **Context & Constraints**: "Analyze the following numbers. Do not include external commentary."
3. **Few-Shot Examples**: Provide 2-3 input/output pairs.
4. **Strict Output Format**: Force JSON key specifications.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Mastering System Prompts & JSON Mode',
    quizzes: [
      {
        id: 'q3-1',
        question: 'Why is Few-Shot Prompting preferred for production AI APIs?',
        options: [
          'It provides real input-output examples to guide the AI model to match the exact schema and tone needed.',
          'It forces the model to run 50x faster.',
          'It deletes the need for system roles.',
          'It bypasses token limitations.'
        ],
        correctAnswer: 0,
        explanation: 'Providing examples dramatically increases accuracy and adherence to strict formatting.'
      }
    ],
    codingExercises: [
      {
        id: 'ex3-1',
        title: 'Structured System Prompt Builder',
        description: 'Construct a structured prompt JSON object ready to send to an OpenAI or Replit AI endpoint.',
        initialCode: `const systemPrompt = {
  role: "system",
  content: \`You are an AI Startup Name & Domain Evaluator.
Always return JSON format with keys: "name", "tagline", "domainAvailable", "rating".\`
};

console.log("System Prompt Configured:", systemPrompt);`,
        solutionCode: `const systemPrompt = {
  role: "system",
  content: \`You are an AI Startup Name & Domain Evaluator.
Always return JSON format with keys: "name", "tagline", "domainAvailable", "rating".\`
};

console.log("System Prompt Configured:", systemPrompt);`,
        aiPromptHint: 'Enhance the system prompt by adding negative constraints like "Do not include markdown triple backticks".'
      }
    ],
    aiChallenge: {
      title: 'Hallucination Defense Test',
      promptInstruction: 'Craft a prompt that successfully forces the LLM to output valid JSON even when handed noisy user input.',
      targetResult: 'Strict JSON object validated without parsing errors.'
    },
    miniProject: {
      title: 'AI Persona Generator Widget',
      description: 'Build a Replit app where users can select an AI persona (e.g. Mentor, Code Reviewer, Venture Capitalist) and receive customized advice.',
      deliverables: ['3 System Persona Presets', 'Interactive Chat Interface', 'Replit Live Demo']
    }
  },
  {
    id: 4,
    slug: 'building-with-replit-agent',
    title: 'Building with Replit Agent',
    subtitle: 'From Idea to Full-Stack App in Minutes',
    description: 'Unleash the full power of Replit Agent. Master natural language app generation, automated package installation, and cloud workspace workflows.',
    iconName: 'Bot',
    level: 'Intermediate',
    estimatedHours: 3.0,
    xpReward: 400,
    coinsReward: 100,
    badgeName: 'Agent Commander',
    badgeIcon: '🤖',
    objectives: [
      'Guide Replit Agent step-by-step from high-level spec to working app',
      'Inspect and edit code generated by Replit Agent seamlessly',
      'Manage environment secrets (API Keys) in Replit Secrets Manager',
      'Debug Agent iterations using clear refine prompts'
    ],
    readingMaterial: `# Harnessing Replit Agent for Rapid Startup Building

Replit Agent is your AI co-founder. It reads your prompts, designs project architecture, writes React & Node.js code, executes shell commands, and fixes its own runtime errors.

### Best Practices for Replit Agent
1. **Start with a Clear Specification**: State the core user flow first before adding complex secondary features.
2. **Iterative Feature Additions**: Build step 1 (UI mockup), step 2 (Database connection), step 3 (AI integration).
3. **Use Replit Secrets**: Store \`OPENAI_API_KEY\` or \`DATABASE_URL\` securely in the Secrets tab.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Replit Agent Deep-Dive Tutorial',
    quizzes: [
      {
        id: 'q4-1',
        question: 'Where should API secrets (e.g. OpenAI Keys) be stored in Replit?',
        options: [
          'In Replit Secrets Manager (Environment variables)',
          'Hardcoded into client-side HTML files',
          'In a public GitHub README',
          'In browser localStorage'
        ],
        correctAnswer: 0,
        explanation: 'Secrets Manager securely injects environment variables without exposing private keys in code repositories.'
      }
    ],
    codingExercises: [
      {
        id: 'ex4-1',
        title: 'Replit Agent Prompt Generator',
        description: 'Build a prompt string that gives Replit Agent crystal-clear instructions to build a modern SaaS landing page.',
        initialCode: `const agentTaskPrompt = \`Build a modern Next.js 16 landing page for "CodePulse AI".
Theme: Dark mode with cyan (#00E5FF) and purple (#6C63FF) glow accents.
Components needed: Hero section, Feature grid, Live demo CTA, and Pricing table.
Use Tailwind CSS and Lucide React icons.\`;

console.log("Replit Agent Launch Prompt Ready!\\n", agentTaskPrompt);`,
        solutionCode: `const agentTaskPrompt = \`Build a modern Next.js 16 landing page for "CodePulse AI".
Theme: Dark mode with cyan (#00E5FF) and purple (#6C63FF) glow accents.
Components needed: Hero section, Feature grid, Live demo CTA, and Pricing table.
Use Tailwind CSS and Lucide React icons.\`;

console.log("Replit Agent Launch Prompt Ready!\\n", agentTaskPrompt);`,
        aiPromptHint: 'Copy this prompt directly into your Replit Agent prompt box to watch it build live!'
      }
    ],
    aiChallenge: {
      title: 'Full-Stack Agent Speedrun',
      promptInstruction: 'Prompt Replit Agent to build a functional Todo App with Tailwind CSS styling and local state storage in under 5 minutes.',
      targetResult: 'Live app preview running seamlessly in Replit.'
    },
    miniProject: {
      title: 'Agent-Built Startup MVP',
      description: 'Use Replit Agent to create a complete MVP frontend for your chosen AI startup topic.',
      deliverables: ['Replit Project Link', 'Working Interactive Frontend', 'Custom Styling & Glassmorphism UI']
    }
  },
  {
    id: 5,
    slug: 'frontend-development',
    title: 'Modern Frontend Development',
    subtitle: 'React, Next.js, Tailwind CSS & Framer Motion',
    description: 'Craft high-converting, hyper-responsive dark UIs with glassmorphism, micro-interactions, smooth animations, and clean React components.',
    iconName: 'Layout',
    level: 'Intermediate',
    estimatedHours: 3.5,
    xpReward: 450,
    coinsReward: 120,
    badgeName: 'UI Craftmaster',
    badgeIcon: '🎨',
    objectives: [
      'Master React 19 state management, hooks, and component composition',
      'Build futuristic Tailwind CSS dark mode layouts with custom glow tokens',
      'Implement Framer Motion micro-animations for cards, badges, and modals',
      'Ensure flawless mobile responsiveness and accessibility'
    ],
    readingMaterial: `# Crafting World-Class Dark UIs

Top tech platforms (Apple, Linear, Stripe, Replit, Framer) share a signature visual polish.

### Key Design Ingredients
- **Dark Void Backgrounds**: Deep slate/charcoal tones (\`#030712\`, \`#090d16\`).
- **Subtle Glow & Glass**: Glassmorphism with \`backdrop-blur-xl\` and glowing cyan/purple borders.
- **Micro-Animations**: Elevate elements on hover, add spring transitions with Framer Motion.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Building Apple & Linear Style Dark UIs',
    quizzes: [
      {
        id: 'q5-1',
        question: 'Which CSS property creates the glassmorphism blur effect over background content?',
        options: ['backdrop-filter: blur(...)', 'box-shadow: inset(...)', 'transform: scale(...)', 'opacity: 0.5'],
        correctAnswer: 0,
        explanation: 'backdrop-filter: blur() blurs the pixels behind an element, giving a frosted glass appearance.'
      }
    ],
    codingExercises: [
      {
        id: 'ex5-1',
        title: 'Glassmorphic Glow Card Component',
        description: 'Define React JSX for a futuristic glassmorphic startup metric card.',
        initialCode: `function MetricCard({ title, value, change }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300">
      <p className="text-sm font-medium text-cyan-400">{title}</p>
      <h3 className="text-3xl font-extrabold text-white mt-2">{value}</h3>
      <span className="inline-block mt-3 px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-full">
        {change}
      </span>
    </div>
  );
}`,
        solutionCode: `function MetricCard({ title, value, change }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300">
      <p className="text-sm font-medium text-cyan-400">{title}</p>
      <h3 className="text-3xl font-extrabold text-white mt-2">{value}</h3>
      <span className="inline-block mt-3 px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-full">
        {change}
      </span>
    </div>
  );`,
        aiPromptHint: 'Pass props into MetricCard to render dynamic startup numbers!'
      }
    ],
    aiChallenge: {
      title: 'Framer Motion Hover Challenge',
      promptInstruction: 'Add Framer Motion hover scale and tap feedback to your startup action buttons in Replit.',
      targetResult: 'Smooth spring animated buttons with zero layout shifts.'
    },
    miniProject: {
      title: 'Interactive Startup Landing Page',
      description: 'Build a polished landing page with dynamic tabs, hero section, feature cards, and animated gradient badges.',
      deliverables: ['Hero Section', 'Feature Grid with Framer Motion', 'Interactive Demo Widget']
    }
  },
  {
    id: 6,
    slug: 'backend-apis',
    title: 'Backend APIs & Serverless Functions',
    subtitle: 'Connecting React to Node.js & AI Endpoints',
    description: 'Build robust REST APIs, handle JSON payloads, manage CORS, integrate OpenAI/Replit AI SDKs, and build streaming responses.',
    iconName: 'Server',
    level: 'Intermediate',
    estimatedHours: 3.5,
    xpReward: 500,
    coinsReward: 150,
    badgeName: 'API Architect',
    badgeIcon: '⚙️',
    objectives: [
      'Create Next.js Route Handlers / Express endpoints',
      'Stream real-time AI responses to the frontend using Server-Sent Events (SSE)',
      'Validate request bodies with Zod and TypeScript',
      'Implement error handling and status codes (200, 400, 401, 500)'
    ],
    readingMaterial: `# Building Production API Endpoints for AI Apps

Your frontend communicates with backend endpoints to process user prompts, call AI models securely, and query databases.

### Key API Concepts
- **Route Handlers**: Server-side functions that run without exposing API keys to the browser.
- **Streaming Responses**: Delivering text token-by-token so users don't wait 10 seconds for completion.
- **Zod Validation**: Guarding backend endpoints against malformed requests.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Building AI API Endpoints & Streaming Text',
    quizzes: [
      {
        id: 'q6-1',
        question: 'Why should AI API calls be executed on the backend rather than in browser React code?',
        options: [
          'To keep private API keys hidden from client browser code and prevent theft.',
          'Because browsers cannot run JavaScript.',
          'To disable CORS headers.',
          'Because AI models only accept binary data.'
        ],
        correctAnswer: 0,
        explanation: 'Executing API requests server-side keeps secret keys secure and avoids API quota theft.'
      }
    ],
    codingExercises: [
      {
        id: 'ex6-1',
        title: 'Next.js 16 Route Handler for AI Generation',
        description: 'Examine a backend route handler snippet that calls an AI completion model and returns a JSON response.',
        initialCode: `// src/app/api/generate/route.ts
export async function POST(req) {
  const { prompt } = await req.json();
  
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  // Simulated AI API call
  const aiOutput = \`Generated response for: "\${prompt}"\`;

  return Response.json({ success: true, result: aiOutput });
}`,
        solutionCode: `export async function POST(req) {
  const { prompt } = await req.json();
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }
  const aiOutput = \`Generated response for: "\${prompt}"\`;
  return Response.json({ success: true, result: aiOutput });
}`,
        aiPromptHint: 'Try extending the handler to return token usage metrics.'
      }
    ],
    aiChallenge: {
      title: 'API Rate Limiter Test',
      promptInstruction: 'Prompt Replit Agent to add in-memory rate limiting to your backend API to prevent prompt spamming.',
      targetResult: '429 Too Many Requests status returned after 5 rapid requests.'
    },
    miniProject: {
      title: 'AI Microservice API',
      description: 'Build a working API backend inside Replit with at least two endpoints: /api/generate-tagline and /api/review-pitch.',
      deliverables: ['Working Route Handlers', 'Error Validation', 'Replit Live Test Endpoint']
    }
  },
  {
    id: 7,
    slug: 'databases',
    title: 'Databases & Persistence',
    subtitle: 'PostgreSQL, Supabase & Vector Storage',
    description: 'Store user data, startup submissions, and vector embeddings. Master relational schemas, SQL queries, ORMs (Prisma/Drizzle), and Supabase.',
    iconName: 'Database',
    level: 'Intermediate',
    estimatedHours: 4.0,
    xpReward: 550,
    coinsReward: 160,
    badgeName: 'Data Overlord',
    badgeIcon: '💾',
    objectives: [
      'Design SQL table schemas for users, startup projects, and achievements',
      'Connect Replit PostgreSQL / Supabase instance seamlessly',
      'Understand Vector Databases (pgvector) for semantic search & RAG',
      'Write safe CRUD queries using SQL or ORMs'
    ],
    readingMaterial: `# Database Architecture for AI Startups

Modern AI startups rely on two types of data storage:
1. **Relational Data (PostgreSQL)**: Users, accounts, transactions, startup submissions, badges.
2. **Vector Data (pgvector / Pinecone)**: High-dimensional embeddings used for semantic search, memory, and Retrieval-Augmented Generation (RAG).

### Example SQL Table for Startup Projects
\`\`\`sql
CREATE TABLE startup_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  tagline TEXT NOT NULL,
  founder_id UUID REFERENCES users(id),
  score NUMERIC(4,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\``,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'PostgreSQL & Supabase for Replit AI Apps',
    quizzes: [
      {
        id: 'q7-1',
        question: 'What is the primary function of Vector Storage (pgvector) in AI applications?',
        options: [
          'To perform semantic similarity search on text embeddings for RAG and AI memory.',
          'To store CSS images as JPEG files.',
          'To generate random user passwords.',
          'To replace HTML tags.'
        ],
        correctAnswer: 0,
        explanation: 'Vector databases index numeric embeddings so AI models can retrieve relevant context instantly.'
      }
    ],
    codingExercises: [
      {
        id: 'ex7-1',
        title: 'SQL Schema & Query Practice',
        description: 'Write a SQL query to select top-ranked startup submissions with scores above 85.',
        initialCode: `SELECT id, name, tagline, score 
FROM startup_projects 
WHERE score >= 85 
ORDER BY score DESC 
LIMIT 10;`,
        solutionCode: `SELECT id, name, tagline, score 
FROM startup_projects 
WHERE score >= 85 
ORDER BY score DESC 
LIMIT 10;`,
        aiPromptHint: 'Run this query against your Replit Postgres database instance.'
      }
    ],
    aiChallenge: {
      title: 'Automatic DB Schema Generator',
      promptInstruction: 'Prompt Replit Agent to create Prisma or Supabase table migrations for a multi-user SaaS app.',
      targetResult: 'Clean schema definition file generated without syntax errors.'
    },
    miniProject: {
      title: 'Startup Persistence Engine',
      description: 'Connect your Replit app frontend to PostgreSQL or Supabase so user project submissions persist across browser reloads.',
      deliverables: ['Database Connection', 'Projects Table Schema', 'Create & Fetch API endpoints']
    }
  },
  {
    id: 8,
    slug: 'authentication',
    title: 'Authentication & User Management',
    subtitle: 'Securing Your AI Startup Workspace',
    description: 'Implement JWTs, OAuth login (Google, GitHub, Replit Auth), session management, and Protected API routes for your startup users.',
    iconName: 'ShieldCheck',
    level: 'Intermediate',
    estimatedHours: 3.5,
    xpReward: 600,
    coinsReward: 180,
    badgeName: 'Security Sentinel',
    badgeIcon: '🔒',
    objectives: [
      'Implement secure user registration, login, and password hashing',
      'Configure Replit Auth / OAuth providers (GitHub & Google)',
      'Protect private frontend routes and backend endpoints',
      'Manage user roles, levels, and authorization middleware'
    ],
    readingMaterial: `# User Authentication & Security

Every startup needs secure identity management.

### Key Authentication Standards
- **OAuth 2.0**: Allow users to "Sign in with GitHub" or "Sign in with Replit".
- **JWT (JSON Web Tokens)**: Cryptographically signed tokens that identify logged-in users.
- **Middleware Protection**: Inspect incoming authorization headers before processing backend actions.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Implementing Authentication in Next.js & Replit',
    quizzes: [
      {
        id: 'q8-1',
        question: 'Why should user passwords never be stored in plain text in a database?',
        options: [
          'Because if a database breach occurs, plain passwords expose user credentials across services. They must be salted & hashed (e.g. bcrypt/argon2).',
          'Because plain text takes up too much disk space.',
          'Because SQL does not support strings.',
          'Because AI models reject plain text passwords.'
        ],
        correctAnswer: 0,
        explanation: 'Salting and hashing protects user accounts even if raw database storage is compromised.'
      }
    ],
    codingExercises: [
      {
        id: 'ex8-1',
        title: 'Authentication Token Verifier Middleware',
        description: 'Examine authentication check logic for protected backend routes.',
        initialCode: `function verifyAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, reason: "Missing or malformed Authorization header" };
  }
  const token = authHeader.split(" ")[1];
  return { authenticated: true, token };
}

console.log(verifyAuthHeader("Bearer eyJhbGciOiJIUzI1Ni..."));`,
        solutionCode: `function verifyAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, reason: "Missing or malformed Authorization header" };
  }
  const token = authHeader.split(" ")[1];
  return { authenticated: true, token };
}`,
        aiPromptHint: 'Test what happens when passing an empty string or invalid header.'
      }
    ],
    aiChallenge: {
      title: 'OAuth Integration Challenge',
      promptInstruction: 'Prompt Replit Agent to set up NextAuth or Supabase Auth with GitHub sign-in.',
      targetResult: 'Protected profile route accessible only after logging in.'
    },
    miniProject: {
      title: 'Secure User Portal',
      description: 'Build a secure authentication portal for your AI startup on Replit featuring Login, Sign Up, and User Dashboard views.',
      deliverables: ['Auth Forms', 'Session Token Storage', 'Protected Dashboard View']
    }
  },
  {
    id: 9,
    slug: 'ai-integrations',
    title: 'Advanced AI Integrations & Agents',
    subtitle: 'RAG, Vision, Audio & Multi-Agent Workflows',
    description: 'Elevate your startup with multi-modal AI capabilities: OpenAI Vision, Whisper Audio, ElevenLabs Voice, and LangChain/LlamaIndex RAG pipelines.',
    iconName: 'Cpu',
    level: 'Advanced',
    estimatedHours: 4.5,
    xpReward: 700,
    coinsReward: 200,
    badgeName: 'AI Fusion Specialist',
    badgeIcon: '⚡',
    objectives: [
      'Integrate Multimodal AI APIs (Image analysis, Text-to-Speech, Speech-to-Text)',
      'Build Retrieval-Augmented Generation (RAG) pipelines over custom documents',
      'Implement Autonomous AI Agent loops with function calling & tool tools',
      'Optimize AI response times and fallback strategies'
    ],
    readingMaterial: `# Multi-Modal AI & Autonomous Agents

The next generation of AI startups goes beyond simple text boxes.

### Advanced Capabilities
1. **RAG (Retrieval-Augmented Generation)**: Feed private PDFs, docs, or web data to LLMs in real-time.
2. **Function Calling / Tool Use**: Allow the AI to query databases, call third-party APIs, or send emails automatically.
3. **Vision & Audio**: Analyze uploaded images or generate voice output.`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Building Multi-Agent Workflows & RAG Systems',
    quizzes: [
      {
        id: 'q9-1',
        question: 'What is AI Tool Use / Function Calling?',
        options: [
          'A feature that allows LLMs to trigger predefined code functions (like fetching live weather or updating a database) based on prompt context.',
          'A physical hardware robot tool.',
          'A way to compile C++ code into CSS.',
          'A method to increase font sizes.'
        ],
        correctAnswer: 0,
        explanation: 'Function calling allows AI agents to interact directly with backend services and external APIs.'
      }
    ],
    codingExercises: [
      {
        id: 'ex9-1',
        title: 'Function Calling Schema Definition',
        description: 'Define an OpenAI-compatible tool function definition for an AI agent that searches startup records.',
        initialCode: `const searchToolSchema = {
  name: "searchStartupDatabase",
  description: "Searches for AI startups by category or technology stack.",
  parameters: {
    type: "object",
    properties: {
      category: { type: "string", description: "e.g. Healthcare, EdTech, FinTech" },
      minScore: { type: "number", description: "Minimum judge score (1-100)" }
    },
    required: ["category"]
  }
};

console.log("AI Agent Tool Registered:", searchToolSchema.name);`,
        solutionCode: `const searchToolSchema = {
  name: "searchStartupDatabase",
  description: "Searches for AI startups by category or technology stack.",
  parameters: {
    type: "object",
    properties: {
      category: { type: "string", description: "e.g. Healthcare, EdTech, FinTech" },
      minScore: { type: "number", description: "Minimum judge score (1-100)" }
    },
    required: ["category"]
  }
};

console.log("AI Agent Tool Registered:", searchToolSchema.name);`,
        aiPromptHint: 'Expand the properties object to include a maxResults integer field.'
      }
    ],
    aiChallenge: {
      title: 'RAG Document QA Challenge',
      promptInstruction: 'Prompt Replit Agent to create a document upload widget that answers user questions based strictly on the uploaded text.',
      targetResult: 'Contextually accurate answers generated from custom text input.'
    },
    miniProject: {
      title: 'Autonomous AI Copilot Feature',
      description: 'Build a multi-modal feature inside your Replit startup app (e.g. Voice Pitch Analyzer or Document Summarizer).',
      deliverables: ['Multi-Modal API Integration', 'Interactive UI Feedback', 'Replit Working Prototype']
    }
  },
  {
    id: 10,
    slug: 'deployment',
    title: 'Deployment & Production Ops',
    subtitle: 'Custom Domains, CI/CD & Scaling on Replit Deployments',
    description: 'Publish your AI startup live to the world! Configure custom domains, SSL, autoscaling, error monitoring, and continuous deployment on Replit.',
    iconName: 'Rocket',
    level: 'Advanced',
    estimatedHours: 3.0,
    xpReward: 800,
    coinsReward: 250,
    badgeName: 'Launch Engineer',
    badgeIcon: '🌐',
    objectives: [
      'Deploy full-stack applications with 1 click using Replit Deployments',
      'Configure custom domain names (e.g. www.mystartup.ai) and SSL certificates',
      'Monitor production metrics, latency logs, and server performance',
      'Set up environment variable fallbacks and high availability'
    ],
    readingMaterial: `# Production Deployment & DevOps on Replit

Deploying your application is the moment your startup becomes real.

### Replit Deployment Modes
1. **Reserved VM**: Dedicated CPU & RAM for production workloads.
2. **Autoscale**: Dynamically scales servers up based on user traffic spikes.
3. **Static Sites**: Instant global CDN edge distribution for frontends.

> *"If you aren't embarrassed by the first version of your product, you shipped too late."* — Reid Hoffman`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Deploying & Scaling Your Startup on Replit',
    quizzes: [
      {
        id: 'q10-1',
        question: 'What is the advantage of Replit Autoscale deployments?',
        options: [
          'It automatically adjusts server instances to handle traffic spikes while keeping baseline cost low.',
          'It deletes bad user comments.',
          'It rewrites your startup pitch automatically.',
          'It changes your domain name daily.'
        ],
        correctAnswer: 0,
        explanation: 'Autoscale responds to incoming requests dynamically, providing high reliability during traffic bursts.'
      }
    ],
    codingExercises: [
      {
        id: 'ex10-1',
        title: 'Production Health Check Endpoint',
        description: 'Examine a production health check endpoint handler used by uptime monitors.',
        initialCode: `export async function GET() {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    version: "1.0.0-production"
  };

  return Response.json(healthData, { status: 200 });
}`,
        solutionCode: `export async function GET() {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    version: "1.0.0-production"
  };

  return Response.json(healthData, { status: 200 });
}`,
        aiPromptHint: 'Add database readiness checks inside the GET handler.'
      }
    ],
    aiChallenge: {
      title: 'Production Readiness Audit',
      promptInstruction: 'Prompt Replit Agent to run a production security audit check on your repository.',
      targetResult: 'Report verifying no exposed secrets and clean production scripts.'
    },
    miniProject: {
      title: 'Live Production Launch',
      description: 'Deploy your complete Replit AI Startup application to a public live URL and verify external accessibility.',
      deliverables: ['Live Public URL', 'Custom Domain / Replit Subdomain', 'Verified Health Check Status']
    }
  },
  {
    id: 11,
    slug: 'startup-fundamentals',
    title: 'Startup Fundamentals & Business Models',
    subtitle: 'Monetization, Metrics & Product-Market Fit',
    description: 'Learn how AI startups generate revenue: API subscriptions, usage credits, enterprise pricing, unit economics, CAC, and LTV.',
    iconName: 'TrendingUp',
    level: 'Master',
    estimatedHours: 3.5,
    xpReward: 900,
    coinsReward: 300,
    badgeName: 'Venture Architect',
    badgeIcon: '📈',
    objectives: [
      'Master AI SaaS monetization models (Freemium, Token Credits, Enterprise Tiers)',
      'Calculate Key Startup Metrics: MRR, CAC, LTV, Churn, and Gross Margin',
      'Integrate Stripe Checkout and subscription webhooks',
      'Evaluate Product-Market Fit signals'
    ],
    readingMaterial: `# Startup Unit Economics & Business Models

Building great tech is only half the battle. Successful founders build sustainable business engines.

### Popular AI Monetization Models
1. **Seat-Based Subscription**: $29/user/month (e.g. Linear, GitHub Copilot).
2. **Usage-Based Token Credits**: $10 for 500 AI generations.
3. **Freemium to Pro**: Free basic features, $49/month for advanced AI models & team sharing.

### Critical Equation
\`\`\`
LTV (Lifetime Value) > 3x CAC (Customer Acquisition Cost)
\`\`\``,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Monetizing AI Apps & Calculating Unit Economics',
    quizzes: [
      {
        id: 'q11-1',
        question: 'Why is LTV:CAC ratio important for startup sustainability?',
        options: [
          'It proves that customer revenue generated over time comfortably exceeds the marketing and sales cost to acquire them.',
          'It guarantees automatic venture funding.',
          'It replaces financial accounting.',
          'It sets the price of domain names.'
        ],
        correctAnswer: 0,
        explanation: 'A healthy ratio (3:1 or higher) shows your customer acquisition strategy is profitable and scalable.'
      }
    ],
    codingExercises: [
      {
        id: 'ex11-1',
        title: 'MRR & Churn Calculator',
        description: 'Write a JavaScript function to compute Monthly Recurring Revenue (MRR) and Net Revenue Retention.',
        initialCode: `function calculateMRR(activeCustomers, averagePricePerMonth) {
  const mrr = activeCustomers * averagePricePerMonth;
  const arr = mrr * 12;
  return { mrr: \`$\${mrr.toLocaleString()}\`, arr: \`$\${arr.toLocaleString()}\` };
}

console.log("Financial Metrics:", calculateMRR(150, 49));`,
        solutionCode: `function calculateMRR(activeCustomers, averagePricePerMonth) {
  const mrr = activeCustomers * averagePricePerMonth;
  const arr = mrr * 12;
  return { mrr: \`$\${mrr.toLocaleString()}\`, arr: \`$\${arr.toLocaleString()}\` };
}`,
        aiPromptHint: 'Modify the function to subtract monthly customer churn rate.'
      }
    ],
    aiChallenge: {
      title: 'Stripe Integration Simulation',
      promptInstruction: 'Prompt Replit Agent to build an interactive Pricing Tier modal with "Select Plan" buttons.',
      targetResult: '3 Pricing Tiers (Starter, Pro, Enterprise) rendered cleanly with feature checklists.'
    },
    miniProject: {
      title: 'Monetization & Pricing Strategy Page',
      description: 'Build an interactive pricing section inside your startup app with currency selectors and plan comparisons.',
      deliverables: ['Pricing Table UI', 'Plan Feature Matrix', 'Stripe Sandbox Link']
    }
  },
  {
    id: 12,
    slug: 'pitching-investors',
    title: 'Pitching Investors & Global Demo Day',
    subtitle: 'Storytelling, Pitch Decks & Championship Strategy',
    description: 'Craft an irresistible 3-minute pitch deck, record a compelling product video, present to top Silicon Valley judges, and qualify for the TOP 20 Championship.',
    iconName: 'Trophy',
    level: 'Master',
    estimatedHours: 4.0,
    xpReward: 1000,
    coinsReward: 500,
    badgeName: 'Championship Founder',
    badgeIcon: '👑',
    objectives: [
      'Structure the 10-slide Y Combinator / Sequoia pitch deck',
      'Record a high-impact 2-minute video product walkthrough',
      'Pass all 7 judging criteria (Innovation, Impact, Design, AI Usage, Technical Difficulty, Presentation, Scalability)',
      'Prepare for live investor Q&A and Global Demo Day'
    ],
    readingMaterial: `# Winning Pitch Decks & Demo Day Strategy

The pitch is your startup's narrative spotlight.

### The 10 Essential Pitch Deck Slides
1. **Title & Tagline**: Bold 1-sentence value proposition.
2. **Problem**: The painful problem real humans face daily.
3. **Solution & Demo**: Your Replit AI product in action.
4. **Market Size (TAM)**: Total addressable opportunity.
5. **Traction & Validation**: Users, waitlists, feedback.
6. **Business Model**: How you make money.
7. **Technology Architecture**: AI model & Replit setup.
8. **Competitive Advantage**: Why you win.
9. **Team**: Founders and technical expertise.
10. **The Ask**: What you need next (funding, mentors, users).`,
    videoPlaceholderUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Pitching to Investors & Demo Day Masterclass',
    quizzes: [
      {
        id: 'q12-1',
        question: 'What is the most effective slide to lead with after introducing your team in a demo day pitch?',
        options: [
          'A clear, relatable problem statement followed immediately by your live working AI demo.',
          '20 pages of dense legal disclaimers.',
          'An empty slide.',
          'A history of server CPUs from 1990.'
        ],
        correctAnswer: 0,
        explanation: 'Investors judge startups by the urgency of the problem and the magic of the working product solution.'
      }
    ],
    codingExercises: [
      {
        id: 'ex12-1',
        title: 'Pitch Deck Slide Navigator Component',
        description: 'Examine a slide deck navigator component built for embedded presentation showcases.',
        initialCode: `const slides = [
  { title: "1. Problem", content: "3.5B people lack access to rapid AI medical triage." },
  { title: "2. Solution", content: "MedAI: Autonomous 24/7 medical triage on Replit." },
  { title: "3. Traction", content: "12,400 active beta users across 40 countries." },
  { title: "4. The Ask", content: "Seeking $500k Pre-Seed funding for global expansion." }
];

console.log("Pitch Deck Configured. Total Slides:", slides.length);`,
        solutionCode: `const slides = [
  { title: "1. Problem", content: "3.5B people lack access to rapid AI medical triage." },
  { title: "2. Solution", content: "MedAI: Autonomous 24/7 medical triage on Replit." },
  { title: "3. Traction", content: "12,400 active beta users across 40 countries." },
  { title: "4. The Ask", content: "Seeking $500k Pre-Seed funding for global expansion." }
];

console.log("Pitch Deck Configured. Total Slides:", slides.length);`,
        aiPromptHint: 'Add interactive slide index toggling logic.'
      }
    ],
    aiChallenge: {
      title: 'Investor Q&A Simulation',
      promptInstruction: 'Prompt AI to roleplay as a tough venture capitalist asking tough questions about your startup margins and defensibility.',
      targetResult: 'Structured Q&A responses demonstrating strategic clarity.'
    },
    miniProject: {
      title: 'Final Accelerator Graduation Pitch',
      description: 'Submit your completed startup pitch deck link and video walkthrough to officially graduate and unlock the EduVerse Global Build Challenge!',
      deliverables: ['3-Minute Video Pitch URL', 'Interactive Replit App Link', 'Completed Pitch Deck PDF/Web Slide']
    }
  }
];

export const REPLIT_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    name: 'Pioneer Builder',
    description: 'Enrolled in the Replit AI Startup Accelerator',
    icon: '🚀',
    category: 'Curriculum',
    rarity: 'Common',
    xpValue: 250,
    unlocked: true
  },
  {
    id: 'ach-2',
    name: 'Prompt Engineer',
    description: 'Mastered System Directives & JSON Schemas',
    icon: '⚡',
    category: 'Curriculum',
    rarity: 'Rare',
    xpValue: 500
  },
  {
    id: 'ach-3',
    name: 'Agent Commander',
    description: 'Scaffolding full-stack apps with Replit Agent',
    icon: '🤖',
    category: 'Curriculum',
    rarity: 'Rare',
    xpValue: 750
  },
  {
    id: 'ach-4',
    name: 'Full-Stack Craftsman',
    description: 'Built React UI, APIs, and PostgreSQL database',
    icon: '🎨',
    category: 'Curriculum',
    rarity: 'Epic',
    xpValue: 1000
  },
  {
    id: 'ach-5',
    name: 'Production Deployer',
    description: 'Deployed live app on Replit with custom domain',
    icon: '🌐',
    category: 'Curriculum',
    rarity: 'Epic',
    xpValue: 1200
  },
  {
    id: 'ach-6',
    name: 'Accelerator Graduate',
    description: 'Completed all 12 Replit AI Accelerator modules',
    icon: '🎓',
    category: 'Curriculum',
    rarity: 'Legendary',
    xpValue: 2500
  },
  {
    id: 'ach-7',
    name: 'Hackathon Contender',
    description: 'Submitted an entry to EduVerse Global Build Challenge',
    icon: '🏆',
    category: 'Hackathon',
    rarity: 'Epic',
    xpValue: 1500
  },
  {
    id: 'ach-8',
    name: 'Top 20 Finalist',
    description: 'Qualified for Global Innovation Championship',
    icon: '🌍',
    category: 'Hackathon',
    rarity: 'Legendary',
    xpValue: 5000
  },
  {
    id: 'ach-9',
    name: 'Streak Master',
    description: 'Maintained a 7-day daily active coding streak',
    icon: '🔥',
    category: 'Mastery',
    rarity: 'Rare',
    xpValue: 600
  },
  {
    id: 'ach-10',
    name: 'Venture Founder',
    description: 'Presented pitch deck to investor judge panel',
    icon: '💼',
    category: 'Mastery',
    rarity: 'Legendary',
    xpValue: 3000
  }
];

export const REPLIT_SKILL_NODES: SkillNode[] = [
  { id: 1, title: 'Accelerator Foundations', category: 'Basics', prerequisiteId: null, xpRequired: 0, unlocked: true, completed: true },
  { id: 2, title: 'AI & LLM Architecture', category: 'Basics', prerequisiteId: 1, xpRequired: 250, unlocked: true, completed: false },
  { id: 3, title: 'Prompt Engineering & JSON', category: 'AI', prerequisiteId: 2, xpRequired: 550, unlocked: false, completed: false },
  { id: 4, title: 'Replit Agent Workflows', category: 'AI', prerequisiteId: 3, xpRequired: 900, unlocked: false, completed: false },
  { id: 5, title: 'Modern React & Tailwind', category: 'Frontend', prerequisiteId: 4, xpRequired: 1300, unlocked: false, completed: false },
  { id: 6, title: 'Node.js & Streaming APIs', category: 'Backend', prerequisiteId: 5, xpRequired: 1750, unlocked: false, completed: false },
  { id: 7, title: 'Postgres & Supabase DB', category: 'Database', prerequisiteId: 6, xpRequired: 2250, unlocked: false, completed: false },
  { id: 8, title: 'OAuth & Security Auth', category: 'Security', prerequisiteId: 7, xpRequired: 2800, unlocked: false, completed: false },
  { id: 9, title: 'RAG & Multi-Modal AI', category: 'AI', prerequisiteId: 8, xpRequired: 3400, unlocked: false, completed: false },
  { id: 10, title: 'Replit Cloud Deployments', category: 'DevOps', prerequisiteId: 9, xpRequired: 4100, unlocked: false, completed: false },
  { id: 11, title: 'Monetization & Stripe', category: 'Business', prerequisiteId: 10, xpRequired: 4900, unlocked: false, completed: false },
  { id: 12, title: 'Pitch Decks & Demo Day', category: 'Venture', prerequisiteId: 11, xpRequired: 5800, unlocked: false, completed: false }
];

export const JUDGES_PANEL: JudgeProfile[] = [
  {
    name: 'Amjad Masad',
    role: 'CEO & Founder',
    company: 'Replit',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Pioneer of cloud IDEs and AI software creation. Championing software creation for everyone.'
  },
  {
    name: 'Dr. Evelyn Vance',
    role: 'Head of AI Research',
    company: 'EduVerse Labs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    bio: 'Specialist in multi-modal LLM reasoning and adaptive AI education systems.'
  },
  {
    name: 'Marcus Thorne',
    role: 'Managing Partner',
    company: 'Aurora Venture Capital',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Invested in 40+ AI unicorns. Focused on early-stage developer tools and AI productivity.'
  },
  {
    name: 'Sarah Chen',
    role: 'VP of Product',
    company: 'OpenAI Ecosystem',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Driving consumer AI adoption and autonomous developer agent APIs.'
  }
];

export const HALL_OF_FAME_PROJECTS: HallOfFameProject[] = [
  {
    id: 'hof-1',
    name: 'MedAI Assistant',
    tagline: 'Autonomous 24/7 Medical Triage & Clinical Note Generator',
    founder: 'Alexander Wright',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    category: 'Healthcare',
    score: 98.4,
    rank: 1,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/eduverse/medai-assistant',
    demoUrl: 'https://medai-assistant.replit.app',
    replitUrl: 'https://replit.com/@eduverse/MedAI-Assistant',
    description: 'MedAI provides rapid emergency medical assessment in 14 languages, using RAG over WHO clinical protocols to assist rural clinics.',
    badge: '🏆 Global Championship Winner',
    techStack: ['Replit Agent', 'Next.js 16', 'PostgreSQL', 'OpenAI Vision', 'Supabase']
  },
  {
    id: 'hof-2',
    name: 'EcoPulse Replit',
    tagline: 'Real-time Satellite Carbon Footprint & ESG Tracking',
    founder: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    category: 'Climate Tech',
    score: 96.8,
    rank: 2,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/eduverse/ecopulse-ai',
    demoUrl: 'https://ecopulse.replit.app',
    replitUrl: 'https://replit.com/@eduverse/EcoPulse-AI',
    description: 'EcoPulse analyzes satellite imagery with computer vision to audit supply chain emissions automatically for global enterprise companies.',
    badge: '🥇 1st Runner Up',
    techStack: ['Replit Agent', 'Python', 'FastAPI', 'Tailwind CSS', 'Mapbox']
  },
  {
    id: 'hof-3',
    name: 'DocuCraft AI',
    tagline: 'Instant Contract Auditing & Legal Defensibility Engine',
    founder: 'Liam O’Connor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'Legal Tech',
    score: 95.2,
    rank: 3,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com/eduverse/docucraft-ai',
    demoUrl: 'https://docucraft.replit.app',
    replitUrl: 'https://replit.com/@eduverse/DocuCraft-AI',
    description: 'DocuCraft parses complex 100-page contracts in seconds, flagging hidden liabilities and generating negotiating counter-offers.',
    badge: '🥈 2nd Runner Up',
    techStack: ['Replit Agent', 'TypeScript', 'LangChain', 'PostgreSQL', 'Framer Motion']
  }
];

export const MOCK_LEADERBOARD_USERS = [
  { rank: 1, name: 'Sora Tanaka', title: 'AI Startup Founder', xp: 14250, streak: 18, level: 12, country: '🇯🇵 Japan', badge: '👑 Grandmaster' },
  { rank: 2, name: 'Devon Vance', title: 'Full-Stack Agent Specialist', xp: 12900, streak: 14, level: 11, country: '🇺🇸 USA', badge: '⚡ Elite' },
  { rank: 3, name: 'Amina Al-Mansoor', title: 'HealthTech Builder', xp: 11850, streak: 12, level: 10, country: '🇦🇪 UAE', badge: '🚀 Champion' },
  { rank: 4, name: 'Lucas Silva', title: 'FinTech AI Architect', xp: 10400, streak: 9, level: 9, country: '🇧🇷 Brazil', badge: '🔥 Pioneer' },
  { rank: 5, name: 'Chen Wei', title: 'Multi-Modal Specialist', xp: 9600, streak: 7, level: 9, country: '🇸🇬 Singapore', badge: '🧠 Innovator' },
  { rank: 6, name: 'Sofia Rodriguez', title: 'EdTech Creator', xp: 8750, streak: 6, level: 8, country: '🇪🇸 Spain', badge: '🎨 Craftmaster' },
  { rank: 7, name: 'Tariq Hassan', title: 'Cloud DevOps Builder', xp: 7900, streak: 5, level: 7, country: '🇪🇬 Egypt', badge: '⚙️ Architect' }
];

export const JUDGING_CRITERIA_LIST = [
  { name: 'Innovation', weight: '20%', description: 'Uniqueness of the AI solution and novelty of approach.' },
  { name: 'Impact', weight: '20%', description: 'Real-world human value and problem urgency.' },
  { name: 'Design & UX', weight: '15%', description: 'Visual polish, dark UI aesthetics, responsiveness, and seamless user flow.' },
  { name: 'AI Usage', weight: '15%', description: 'Sophistication of LLM prompts, tool integrations, and model reliability.' },
  { name: 'Technical Difficulty', weight: '15%', description: 'Complexity of backend APIs, database persistence, and system architecture.' },
  { name: 'Presentation', weight: '10%', description: 'Clarity of the 2-minute video pitch and project documentation.' },
  { name: 'Scalability', weight: '5%', description: 'Potential to reach 100k+ global users on Replit Deployments.' }
];
