export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  videoUrl?: string;
  summary: string;
  contentMarkdown: string;
  initialCode?: string;
  expectedOutput?: string;
  quiz?: QuizQuestion[];
  resources: { name: string; url: string; type: string }[];
}

export interface ModuleItem {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  lessonsCount: number;
  duration: string;
  projectTitle: string;
  projectDescription: string;
  rewardXP: number;
  lessons: LessonItem[];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpBonus: number;
}

export const REPLIT_ACADEMY_META = {
  name: "Replit AI Academy",
  tagline: "Learn. Build. Launch.",
  subtitle: "Master AI development by building real-world applications with Replit.",
  badge: "⭐ EduVerse Signature Program",
  instructor: {
    name: "Beshoy Simon & Replit AI Team",
    role: "Lead AI Engineer & Founder @ EduVerse",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    bio: "Pioneering interactive tech education and AI-native application architectures for thousands of global builders."
  },
  stats: {
    modules: 12,
    lessons: 48,
    hours: "40+ Hours",
    projects: 12,
    students: "2,840+",
    rating: "4.98/5.0"
  },
  colors: {
    primary: "#00D4FF",
    accent: "#7C3AED",
    secondary: "#FF8A00",
    background: "#07111F"
  },
  technologies: [
    "Replit Agent", "Next.js 16", "TypeScript", "Tailwind CSS", 
    "OpenAI APIs", "Supabase", "Vector Databases", "Python FastAPI", "Vercel / Replit Deploy"
  ],
  careerOutcomes: [
    "Build full-stack AI applications from zero to deployment",
    "Master prompt engineering & autonomous AI agents",
    "Ship viral SaaS products in record speed using Replit Workspace",
    "Earn a verified signature certificate for your developer profile"
  ]
};

export const REPLIT_ACADEMY_MODULES: ModuleItem[] = [
  {
    id: 1,
    slug: "intro-to-replit",
    title: "Module 1: Introduction to Replit",
    tagline: "The Cloud IDE Ecosystem",
    description: "Discover how Replit revolutionizes software development with instant cloud environments, multiplayer coding, and modern dev toolchains.",
    icon: "Terminal",
    lessonsCount: 4,
    duration: "2.5 Hours",
    projectTitle: "Cloud Portfolio Starter",
    projectDescription: "Deploy your first cloud-hosted interactive developer profile on Replit.",
    rewardXP: 250,
    lessons: [
      {
        id: "m1-l1",
        title: "Welcome to Replit AI Academy",
        duration: "15 min",
        type: "video",
        summary: "Introduction to the signature academy curriculum, community guidelines, and setting up your workspace.",
        contentMarkdown: `
# Welcome to Replit AI Academy ⭐

Welcome to **EduVerse's signature AI engineering program**! In this journey, you won't just learn syntax; you will **build and launch real production-grade AI software**.

### What You Will Accomplish:
- Master the **Replit Cloud IDE** & AI Agent system.
- Build **12 practical projects** ranging from custom LLM tools to full SaaS products.
- Earn your **Verified EduVerse Signature Certificate**.

\`\`\`typescript
const academyGoal = {
  mindset: "Learn by Building",
  environment: "Replit Cloud IDE",
  outcome: "Shipped Production Products"
};
console.log("Ready to build:", academyGoal);
\`\`\`
        `,
        resources: [
          { name: "Replit Official Docs", url: "https://docs.replit.com", type: "Doc" },
          { name: "EduVerse Academy Discord", url: "#", type: "Community" }
        ],
        quiz: [
          {
            id: "q1",
            question: "What is the core philosophy of Replit AI Academy?",
            options: [
              "Reading theoretical books only",
              "Building and launching real-world applications in the cloud",
              "Memorizing syntax definitions",
              "Waiting for local environment setup errors"
            ],
            correctAnswer: 1,
            explanation: "Replit AI Academy focuses on hands-on building and immediate deployment in cloud environments."
          }
        ]
      },
      {
        id: "m1-l2",
        title: "Navigating the Replit Workspace",
        duration: "30 min",
        type: "interactive",
        summary: "Deep dive into files, shell, packages, secret management, and multiplayer collaboration in Replit.",
        contentMarkdown: `
# Navigating the Replit Workspace

The Replit environment provides instant access to Linux terminals, package management, environment variables, and live previews.

### Key Concepts:
1. **Secrets tab (\`.env\` protection)**: Never expose API keys in code.
2. **Shell & Console**: Direct bash shell access to run node, python, or git.
3. **Webview Preview**: Automatic hot-reloading dev server port forwarding.

Try running the code below in the practice playground!
        `,
        initialCode: `// Write a script that reads environment variables securely
function checkWorkspaceSetup() {
  const isCloudActive = true;
  const devPort = 3000;
  
  return \`Workspace Status: Online at Port \${devPort}\`;
}

console.log(checkWorkspaceSetup());`,
        expectedOutput: "Workspace Status: Online at Port 3000",
        resources: [
          { name: "Replit Secret Management Guide", url: "https://docs.replit.com/programming-ide/workspace-features/secrets", type: "Doc" }
        ]
      },
      {
        id: "m1-l3",
        title: "Git, Deployments & Package Tools",
        duration: "45 min",
        type: "reading",
        summary: "Learn how to manage version control directly inside Replit and push code to remote repositories.",
        contentMarkdown: `
# Git & Continuous Deployment on Replit

Replit integrates git seamlessly into the sidebar, allowing you to branch, commit, push, and deploy directly to Vercel or Replit Autoscale deployments.

### Workflow Best Practices:
- Keep commits atomic and descriptive.
- Store production credentials in **Replit Secrets**.
- Use instant deployments for testing webhooks and live user traffic.
        `,
        resources: [
          { name: "Replit Deployments Overview", url: "https://replit.com/deployments", type: "Guide" }
        ]
      },
      {
        id: "m1-l4",
        title: "Mini Quiz & Module Project: Cloud Portfolio",
        duration: "40 min",
        type: "quiz",
        summary: "Test your understanding of Replit fundamentals and submit your Module 1 project.",
        contentMarkdown: `
# Module 1 Capstone Challenge: Cloud Portfolio

Your mission is to construct and test a cloud developer landing page using standard Web & Node tools in Replit.
        `,
        quiz: [
          {
            id: "q2",
            question: "Where should sensitive API keys be stored in a Replit workspace?",
            options: [
              "Inside public HTML meta tags",
              "Hardcoded in index.js",
              "In the Secrets (.env) tool",
              "In a public GitHub repository"
            ],
            correctAnswer: 2,
            explanation: "Secrets tab securely encrypts environment variables away from public repositories."
          }
        ],
        resources: [
          { name: "Starter Template", url: "#", type: "Code" }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "ai-fundamentals",
    title: "Module 2: AI Fundamentals",
    tagline: "Models, Embeddings & Vectors",
    description: "Understand Large Language Models (LLMs), tokenization, temperature, vector embeddings, and semantic search.",
    icon: "Brain",
    lessonsCount: 4,
    duration: "3.5 Hours",
    projectTitle: "AI Knowledge Summarizer",
    projectDescription: "Build a tool that tokenizes, analyzes, and extracts key insights from long technical documents.",
    rewardXP: 300,
    lessons: [
      {
        id: "m2-l1",
        title: "How LLMs Process Text (Tokens & Context)",
        duration: "30 min",
        type: "reading",
        summary: "Learn tokenization mechanics, context windows, and how model architectures parse human language.",
        contentMarkdown: `
# How LLMs Work: Tokens, Probabilities & Context

Large Language Models do not read full words; they process **tokens** (sub-word chunks).

\`\`\`json
{
  "phrase": "Replit AI Academy",
  "tokens": ["Repl", "it", " AI", " Academy"],
  "tokenCount": 4
}
\`\`\`

### Key Parameters:
- **Temperature (0.0 to 1.0)**: Lower means deterministic, higher means creative.
- **Context Window**: Maximum input + output token capacity.
        `,
        resources: [
          { name: "OpenAI Tokenizer Tool", url: "https://platform.openai.com/tokenizer", type: "Tool" }
        ]
      },
      {
        id: "m2-l2",
        title: "Vector Embeddings & Semantic Search",
        duration: "45 min",
        type: "interactive",
        summary: "Understand vector spaces and mathematical cosine similarity for intelligent search.",
        contentMarkdown: `
# Vector Embeddings

Embeddings convert text into high-dimensional numerical vectors where similar meanings sit close together in vector space.

\`\`\`typescript
// Mathematical concept of Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

console.log("Vector similarity computed successfully.");
\`\`\``,
        initialCode: `// Calculate similarity between two concept vectors
const vecA = [0.9, 0.1, 0.4];
const vecB = [0.85, 0.12, 0.38];

function computeSimilarity(a: number[], b: number[]) {
  return a.reduce((acc, val, i) => acc + val * b[i], 0);
}

console.log("Similarity score:", computeSimilarity(vecA, vecB).toFixed(3));`,
        expectedOutput: "Similarity score: 0.929",
        resources: [
          { name: "Vector Embedding Basics", url: "#", type: "Guide" }
        ]
      },
      {
        id: "m2-l3",
        title: "Streaming AI Responses in Real-Time",
        duration: "40 min",
        type: "video",
        summary: "Master Server-Sent Events (SSE) and readable streams for snappy, instant AI UI feedback.",
        contentMarkdown: `
# Real-time Streaming UI

Users expect typing effects rather than waiting 10 seconds for a full API response. Streaming with Server-Sent Events makes your apps feel blazing fast!
        `,
        resources: [
          { name: "Vercel AI SDK Streaming", url: "https://sdk.vercel.ai/docs", type: "Docs" }
        ]
      },
      {
        id: "m2-l4",
        title: "Module 2 Quiz & AI Summarizer Project",
        duration: "45 min",
        type: "quiz",
        summary: "Validate AI parameters and complete the AI Knowledge Summarizer mini-project.",
        contentMarkdown: `
# Module 2 Project: Document Summarizer
Build an interface that accepts text inputs and streams synthesized AI summaries back to the user.
        `,
        quiz: [
          {
            id: "q3",
            question: "What parameter controls randomness in LLM output generation?",
            options: [
              "Context Window",
              "Temperature",
              "Batch Size",
              "Learning Rate"
            ],
            correctAnswer: 1,
            explanation: "Temperature dictates how deterministic or creative the model output probability distribution will be."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 3,
    slug: "prompt-engineering",
    title: "Module 3: Prompt Engineering",
    tagline: "System Prompts & Structured Outputs",
    description: "Master system prompts, Few-Shot prompting, Chain-of-Thought reasoning, and JSON Schema enforcement.",
    icon: "Sparkles",
    lessonsCount: 4,
    duration: "3.0 Hours",
    projectTitle: "AI Prompt Studio",
    projectDescription: "Create a prompt template engine that converts raw user inputs into structured JSON payloads.",
    rewardXP: 350,
    lessons: [
      {
        id: "m3-l1",
        title: "System Prompts & Persona Architecture",
        duration: "30 min",
        type: "reading",
        summary: "How to craft robust system prompts that lock model personas into place safely.",
        contentMarkdown: `
# Designing Robust System Prompts

System prompts define the rules, constraints, tone, and format of AI assistants.

### System Prompt Template:
\`\`\`markdown
You are Senior Code Reviewer AI.
Role: Analyze TypeScript snippet for performance and security risks.
Constraints:
- Always output JSON format.
- Never answer non-programming queries.
\`\`\`
        `,
        resources: [
          { name: "Anthropic Prompt Library", url: "https://docs.anthropic.com", type: "Reference" }
        ]
      },
      {
        id: "m3-l2",
        title: "Chain-of-Thought & Few-Shot Prompting",
        duration: "45 min",
        type: "interactive",
        summary: "Boost reasoning accuracy by giving models step-by-step thinking instructions and concrete examples.",
        contentMarkdown: `
# Chain-of-Thought (CoT) Reasoning

By asking models to "Think step-by-step before producing your final answer", accuracy on complex math and logic jumps dramatically.
        `,
        initialCode: `// Simulated Few-Shot Prompt Builder
function buildFewShotPrompt(task: string, examples: {input: string, output: string}[]) {
  let prompt = \`Task: \${task}\\n\\nExamples:\\n\`;
  examples.forEach((ex, idx) => {
    prompt += \`\${idx + 1}. Input: \${ex.input} -> Output: \${ex.output}\\n\`;
  });
  return prompt;
}

const promptStr = buildFewShotPrompt("Extract Sentiment", [
  { input: "I love this product!", output: "POSITIVE" },
  { input: "It broke in 2 days.", output: "NEGATIVE" }
]);

console.log(promptStr);`,
        expectedOutput: `Task: Extract Sentiment\n\nExamples:\n1. Input: I love this product! -> Output: POSITIVE\n2. Input: It broke in 2 days. -> Output: NEGATIVE\n`,
        resources: []
      },
      {
        id: "m3-l3",
        title: "Structured Outputs with Zod & JSON Schema",
        duration: "40 min",
        type: "reading",
        summary: "Enforce strict JSON return types using Zod schemas for reliable application backend pipelines.",
        contentMarkdown: `
# Structured JSON Outputs

Modern AI applications require structured JSON, not raw text paragraphs. Using tools like Zod ensures type-safe parsing.
        `,
        resources: []
      },
      {
        id: "m3-l4",
        title: "Prompt Engineering Quiz & Project",
        duration: "45 min",
        type: "quiz",
        summary: "Test prompt design techniques and submit the AI Prompt Studio mini-project.",
        contentMarkdown: `
# Module 3 Capstone: AI Prompt Studio
Construct a reusable playground that generates structured JSON configurations from custom user inputs.
        `,
        quiz: [
          {
            id: "q4",
            question: "Why is Chain-of-Thought prompting effective for complex logic?",
            options: [
              "It speeds up response latency",
              "It forces the model to generate intermediate reasoning tokens before the answer",
              "It reduces token cost to zero",
              "It bypasses system prompt limits"
            ],
            correctAnswer: 1,
            explanation: "Generating intermediate reasoning steps gives the model computational workspace to arrive at correct conclusions."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 4,
    slug: "building-with-replit-agent",
    title: "Module 4: Building with Replit Agent",
    tagline: "Autonomous Agentic Workflows",
    description: "Leverage Replit Agent to build full-stack web applications from simple natural language prompts.",
    icon: "Bot",
    lessonsCount: 4,
    duration: "4.0 Hours",
    projectTitle: "Autonomous Micro-SaaS",
    projectDescription: "Prompt Replit Agent to generate, configure, and launch an interactive SaaS web tool.",
    rewardXP: 400,
    lessons: [
      {
        id: "m4-l1",
        title: "Introduction to Replit Agent",
        duration: "30 min",
        type: "video",
        summary: "Understand how Replit Agent plans software architecture, creates files, installs packages, and fixes bugs autonomously.",
        contentMarkdown: `
# Meet Replit Agent 🤖

Replit Agent is your AI pair programmer that can build complete applications from high-level user specifications.

### How Replit Agent Works:
1. **Planning**: Breaks down user prompt into incremental technical tasks.
2. **Execution**: Writes code across multiple frontend & backend files.
3. **Self-Debugging**: Runs terminal build commands and auto-fixes runtime errors.
        `,
        resources: [
          { name: "Replit Agent Docs", url: "https://docs.replit.com/replitai/agent", type: "Docs" }
        ]
      },
      {
        id: "m4-l2",
        title: "Crafting Specs & Prompts for Agents",
        duration: "45 min",
        type: "interactive",
        summary: "Learn how to write precise technical specs that guide agentic code generation without ambiguity.",
        contentMarkdown: `
# Writing Effective Technical Specs for AI Agents

Vague prompts produce generic apps. Detailed technical specifications produce world-class products.
        `,
        initialCode: `// Spec Generator Helper
interface AppSpec {
  appName: string;
  targetUser: string;
  features: string[];
  techStack: string[];
}

const mySaaS: AppSpec = {
  appName: "InvoiceGen AI",
  targetUser: "Freelancers",
  features: ["PDF Export", "Stripe Checkout", "Client Dashboard"],
  techStack: ["Next.js 16", "Tailwind CSS", "Supabase"]
};

console.log("Generated Spec for Replit Agent:", JSON.stringify(mySaaS, null, 2));`,
        expectedOutput: `Generated Spec for Replit Agent: {\n  "appName": "InvoiceGen AI",\n  "targetUser": "Freelancers",\n  "features": [\n    "PDF Export",\n    "Stripe Checkout",\n    "Client Dashboard"\n  ],\n  "techStack": [\n    "Next.js 16",\n    "Tailwind CSS",\n    "Supabase"\n  ]\n}`,
        resources: []
      },
      {
        id: "m4-l3",
        title: "Iterative Refinement & Agent Debugging",
        duration: "45 min",
        type: "reading",
        summary: "Techniques for guiding Replit Agent through bug fixes, UI polish, and state management refactoring.",
        contentMarkdown: `
# Iterative Refinement

When working with agents, build incrementally:
- Step 1: Core layout & routing
- Step 2: API integrations
- Step 3: UI polish & animations
        `,
        resources: []
      },
      {
        id: "m4-l4",
        title: "Module 4 Quiz & Autonomous Micro-SaaS",
        duration: "60 min",
        type: "quiz",
        summary: "Build and deploy an autonomous micro-SaaS application using Replit Agent.",
        contentMarkdown: `
# Capstone 4: Launching Your Micro-SaaS
Collaborate with Replit Agent to deliver a fully functional micro-SaaS tool.
        `,
        quiz: [
          {
            id: "q5",
            question: "What is the best way to prompt Replit Agent for a complex application?",
            options: [
              "Give a single 1-word prompt like 'make app'",
              "Provide structured technical specs and build feature by feature",
              "Never look at generated code",
              "Disable error logs in terminal"
            ],
            correctAnswer: 1,
            explanation: "Providing clear technical specifications and building incrementally produces the highest quality code."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 5,
    slug: "frontend-development",
    title: "Module 5: Modern Frontend Development",
    tagline: "Next.js 16 & Glassmorphism UI",
    description: "Build reactive user interfaces with Next.js 16 App Router, Framer Motion, and Tailwind CSS.",
    icon: "Layout",
    lessonsCount: 4,
    duration: "3.5 Hours",
    projectTitle: "Glassmorphic AI Dashboard",
    projectDescription: "Design a futuristic, responsive AI dashboard complete with glowing borders and micro-interactions.",
    rewardXP: 350,
    lessons: [
      {
        id: "m5-l1",
        title: "Next.js 16 App Router & Server Components",
        duration: "45 min",
        type: "reading",
        summary: "Understand Server vs Client Components, layout hierarchies, and fast routing.",
        contentMarkdown: `
# Next.js 16 Architecture

Learn how React Server Components (RSC) keep client bundle sizes lightweight while offering instant server-side data rendering.
        `,
        resources: [
          { name: "Next.js Documentation", url: "https://nextjs.org/docs", type: "Docs" }
        ]
      },
      {
        id: "m5-l2",
        title: "Framer Motion & Glassmorphism Design",
        duration: "45 min",
        type: "interactive",
        summary: "Build glass cards, glowing hover effects, and fluid spring animations.",
        contentMarkdown: `
# Creating Premium Glassmorphic Cards

Combine backdrop-blur with subtle borders and radiant gradients to craft luxury UI cards.
        `,
        initialCode: `// Glass Card Style Tokens
const glassCardStyles = {
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
};

console.log("Glass Card Configuration:", glassCardStyles);`,
        expectedOutput: `Glass Card Configuration: { background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }`,
        resources: []
      },
      {
        id: "m5-l3",
        title: "Responsive Layouts & Dark Mode Systems",
        duration: "40 min",
        type: "reading",
        summary: "Build fluid grid systems that adapt across mobile, tablet, and ultra-wide displays.",
        contentMarkdown: `
# Responsive Grid Architecture
Use Tailwind flex and grid utilities with modern dark theme color palettes.
        `,
        resources: []
      },
      {
        id: "m5-l4",
        title: "Frontend Quiz & AI Dashboard Project",
        duration: "40 min",
        type: "quiz",
        summary: "Construct and submit your Glassmorphic AI Dashboard project.",
        contentMarkdown: `
# Capstone 5: Glassmorphic AI Dashboard
Assemble a responsive dashboard layout with glowing metrics, chart placeholders, and smooth transitions.
        `,
        quiz: [
          {
            id: "q6",
            question: "Which CSS property is essential for creating glassmorphism blur effects?",
            options: [
              "backdrop-filter",
              "text-shadow",
              "margin-auto",
              "opacity-100"
            ],
            correctAnswer: 0,
            explanation: "backdrop-filter: blur() blurs the visual content situated behind the element."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 6,
    slug: "backend-apis",
    title: "Module 6: Backend APIs & Integrations",
    tagline: "FastAPI & RESTful Endpoints",
    description: "Design secure API endpoints, rate limiters, webhooks, and third-party service connections.",
    icon: "Server",
    lessonsCount: 4,
    duration: "3.5 Hours",
    projectTitle: "AI Service API Gateway",
    projectDescription: "Build a secure REST API proxy that handles authentication, rate limiting, and AI request logging.",
    rewardXP: 350,
    lessons: [
      {
        id: "m6-l1",
        title: "Building REST APIs with FastAPI & Express",
        duration: "45 min",
        type: "reading",
        summary: "Structure maintainable API routes, request bodies, and HTTP status codes.",
        contentMarkdown: `
# API Endpoint Architecture

Building production backends requires clean separation of router, controllers, and data services.
        `,
        resources: []
      },
      {
        id: "m6-l2",
        title: "Rate Limiting, CORS & Security Headers",
        duration: "40 min",
        type: "interactive",
        summary: "Protect your API from abuse with token bucket rate limiters and CORS validation.",
        contentMarkdown: `
# Securing Public API Endpoints
Prevent key leakage and DDoS attempts using middleware protection.
        `,
        initialCode: `// Simple Token Bucket Rate Limiter Simulation
class RateLimiter {
  private tokens: number;
  constructor(private limit: number) {
    this.tokens = limit;
  }
  
  allowRequest(): boolean {
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

const limiter = new RateLimiter(2);
console.log("Req 1:", limiter.allowRequest());
console.log("Req 2:", limiter.allowRequest());
console.log("Req 3:", limiter.allowRequest());`,
        expectedOutput: `Req 1: true\nReq 2: true\nReq 3: false`,
        resources: []
      },
      {
        id: "m6-l3",
        title: "Handling Webhooks & Async Background Tasks",
        duration: "40 min",
        type: "video",
        summary: "Process external service webhooks (Stripe, GitHub) with signature verification.",
        contentMarkdown: `
# Webhooks & Queue Processing
Handle event-driven notifications reliably.
        `,
        resources: []
      },
      {
        id: "m6-l4",
        title: "Backend Quiz & API Gateway Project",
        duration: "45 min",
        type: "quiz",
        summary: "Build and verify your AI Service API Gateway.",
        contentMarkdown: `
# Capstone 6: AI API Gateway
Deploy an API proxy layer that manages token quotas and request auditing.
        `,
        quiz: [
          {
            id: "q7",
            question: "Why is rate limiting critical for AI API backends?",
            options: [
              "To prevent unexpected API billing overages and service denial",
              "To increase browser memory usage",
              "To disable CORS security headers",
              "To force database table locking"
            ],
            correctAnswer: 0,
            explanation: "Rate limiting prevents abuse and protects against unexpected billing spikes on external AI APIs."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 7,
    slug: "databases",
    title: "Module 7: Databases & Vector Stores",
    tagline: "PostgreSQL, Supabase & Vector Search",
    description: "Store persistent user data, conversation threads, and high-dimensional vector embeddings with pgvector.",
    icon: "Database",
    lessonsCount: 4,
    duration: "3.5 Hours",
    projectTitle: "AI Memory & Chat History Store",
    projectDescription: "Build a persistent chat storage system with vector similarity search for past conversation retrieval.",
    rewardXP: 400,
    lessons: [
      {
        id: "m7-l1",
        title: "Relational Schema Design with PostgreSQL",
        duration: "45 min",
        type: "reading",
        summary: "Design normalized database tables for users, workspaces, messages, and subscriptions.",
        contentMarkdown: `
# Relational Database Design for AI Apps

\`\`\`sql
CREATE TABLE conversation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`
        `,
        resources: []
      },
      {
        id: "m7-l2",
        title: "Vector Search with pgvector & Supabase",
        duration: "45 min",
        type: "interactive",
        summary: "Query vector similarity directly in SQL using cosine distance operators.",
        contentMarkdown: `
# Vector Operations in SQL

Using \`pgvector\`, you can find the nearest matching document chunks directly inside your PostgreSQL database.
        `,
        initialCode: `// Mock Vector Query Builder
function buildVectorMatchQuery(tableName: string, matchThreshold: number, matchCount: number) {
  return \`SELECT *, 1 - (embedding <=> query_embedding) AS similarity
FROM \${tableName}
WHERE 1 - (embedding <=> query_embedding) > \${matchThreshold}
ORDER BY similarity DESC
LIMIT \${matchCount};\`;
}

console.log(buildVectorMatchQuery("documents", 0.75, 5));`,
        expectedOutput: `SELECT *, 1 - (embedding <=> query_embedding) AS similarity\nFROM documents\nWHERE 1 - (embedding <=> query_embedding) > 0.75\nORDER BY similarity DESC\nLIMIT 5;`,
        resources: []
      },
      {
        id: "m7-l3",
        title: "Caching & Performance Optimization",
        duration: "30 min",
        type: "reading",
        summary: "Implement Redis / in-memory cache layers to eliminate redundant LLM API calls.",
        contentMarkdown: `
# Semantic Caching

If two users ask identical or near-identical questions, return the cached result instantly without re-querying the LLM!
        `,
        resources: []
      },
      {
        id: "m7-l4",
        title: "Database Quiz & Memory Store Project",
        duration: "45 min",
        type: "quiz",
        summary: "Complete the database quiz and submit the AI Memory Store project.",
        contentMarkdown: `
# Capstone 7: AI Memory Engine
Construct a database schema that logs user sessions and matches historical context dynamically.
        `,
        quiz: [
          {
            id: "q8",
            question: "What PostgreSQL extension enables vector similarity search?",
            options: [
              "pgvector",
              "pg_stat_statements",
              "uuid-ossp",
              "postgis"
            ],
            correctAnswer: 0,
            explanation: "pgvector adds vector data types and similarity search indexes (HNSW, IVFFlat) to PostgreSQL."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 8,
    slug: "authentication",
    title: "Module 8: Authentication & Security",
    tagline: "JWT, OAuth & Row Level Security",
    description: "Implement user authentication, OAuth providers (GitHub, Google), JWT tokens, and Supabase RLS policies.",
    icon: "Lock",
    lessonsCount: 4,
    duration: "3.0 Hours",
    projectTitle: "Multi-tenant Auth System",
    projectDescription: "Build a secure auth system with role-based access control (RBAC) and OAuth integration.",
    rewardXP: 350,
    lessons: [
      {
        id: "m8-l1",
        title: "JWT Tokens & Session Management",
        duration: "40 min",
        type: "reading",
        summary: "Understand token signatures, expiration policies, and HTTP-only cookie security.",
        contentMarkdown: `
# Secure Auth Architecture

Never store plain text passwords! Always hash using bcrypt or argon2 and pass signed JWTs over HTTPS.
        `,
        resources: []
      },
      {
        id: "m8-l2",
        title: "OAuth 2.0 with GitHub & Google",
        duration: "40 min",
        type: "interactive",
        summary: "Configure 1-click social logins for frictionless developer onboarding.",
        contentMarkdown: `
# OAuth 2.0 Authorization Flow

Learn how code authorization grants exchange temporary tokens for authenticated user profiles.
        `,
        initialCode: `// OAuth State Verification Mock
function verifyOAuthState(state: string, storedState: string) {
  if (!state || state !== storedState) {
    throw new Error("CSRF State mismatch security alert!");
  }
  return "OAuth State Validated";
}

console.log(verifyOAuthState("xyz123", "xyz123"));`,
        expectedOutput: "OAuth State Validated",
        resources: []
      },
      {
        id: "m8-l3",
        title: "Row Level Security (RLS) in Supabase",
        duration: "35 min",
        type: "reading",
        summary: "Enforce database-level data isolation policies so users can only view their own projects.",
        contentMarkdown: `
# Row Level Security

\`\`\`sql
CREATE POLICY "Users can only read own items"
ON user_projects FOR SELECT
USING (auth.uid() = user_id);
\`\`\`
        `,
        resources: []
      },
      {
        id: "m8-l4",
        title: "Auth Quiz & Multi-tenant Auth Project",
        duration: "40 min",
        type: "quiz",
        summary: "Build and test a multi-tenant authentication pipeline.",
        contentMarkdown: `
# Capstone 8: Secure Multi-Tenant Auth
Implement role-based access control protecting premium application features.
        `,
        quiz: [
          {
            id: "q9",
            question: "Why should refresh tokens be stored in HttpOnly cookies?",
            options: [
              "To prevent Client-Side JavaScript (XSS attacks) from reading sensitive session tokens",
              "To slow down network traffic",
              "To force users to re-login every 5 seconds",
              "To hide HTML elements"
            ],
            correctAnswer: 0,
            explanation: "HttpOnly cookies cannot be accessed via JavaScript document.cookie, mitigating XSS token theft."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 9,
    slug: "deploying-applications",
    title: "Module 9: Deploying Applications",
    tagline: "Custom Domains, CI/CD & Autoscale",
    description: "Deploy production applications using Replit Deployments, custom domain linking, SSL, and GitHub CI/CD.",
    icon: "Rocket",
    lessonsCount: 4,
    duration: "3.0 Hours",
    projectTitle: "Production Deployment Pipeline",
    projectDescription: "Deploy your application with custom domains, automatic SSL certificates, and zero-downtime restarts.",
    rewardXP: 350,
    lessons: [
      {
        id: "m9-l1",
        title: "Replit Autoscale & Static Deployments",
        duration: "40 min",
        type: "reading",
        summary: "Choose between Reserved VMs, Autoscale instances, and Static hosting based on app requirements.",
        contentMarkdown: `
# Production Hosting Strategies

Learn how Autoscale deployments spin up instances dynamically during traffic bursts while saving server costs during low traffic.
        `,
        resources: []
      },
      {
        id: "m9-l2",
        title: "DNS, Custom Domains & SSL Setup",
        duration: "40 min",
        type: "interactive",
        summary: "Link custom \`.com\` domains to your Replit deployment with CNAME & A records.",
        contentMarkdown: `
# Domain Setup Guide

Learn how DNS CNAME records point domain traffic securely to cloud edge networks.
        `,
        initialCode: `// DNS Record Validator Helper
interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
}

const cnameRecord: DNSRecord = {
  type: "CNAME",
  name: "app",
  value: "deploy.replit.app",
  ttl: 3600
};

console.log("Configured DNS Record:", cnameRecord.name, "->", cnameRecord.value);`,
        expectedOutput: "Configured DNS Record: app -> deploy.replit.app",
        resources: []
      },
      {
        id: "m9-l3",
        title: "Application Monitoring & Health Checks",
        duration: "35 min",
        type: "reading",
        summary: "Set up uptime monitoring, error tracking (Sentry), and system performance logs.",
        contentMarkdown: `
# Operational Health & Monitoring

Track 5xx error rates, response latency percentiles (p95, p99), and memory spikes.
        `,
        resources: []
      },
      {
        id: "m9-l4",
        title: "Deployment Quiz & Launch Project",
        duration: "40 min",
        type: "quiz",
        summary: "Complete the deployment project and launch a live domain build.",
        contentMarkdown: `
# Capstone 9: Live Production Launch
Deploy a live web project with automated SSL and custom domain mapping.
        `,
        quiz: [
          {
            id: "q10",
            question: "What DNS record type is used to alias a subdomain to a deployment URL?",
            options: [
              "CNAME",
              "MX",
              "TXT",
              "NS"
            ],
            correctAnswer: 0,
            explanation: "CNAME (Canonical Name) maps subdomains directly to another domain name."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 10,
    slug: "building-ai-products",
    title: "Module 10: Building AI Products",
    tagline: "Multimodal AI & Autonomous Agents",
    description: "Integrate vision models, audio processing (Whisper), function calling, and multi-agent coordination.",
    icon: "Cpu",
    lessonsCount: 4,
    duration: "4.0 Hours",
    projectTitle: "Multimodal AI Assistant",
    projectDescription: "Build an AI agent that accepts text, voice, and image inputs to execute real-world tasks.",
    rewardXP: 450,
    lessons: [
      {
        id: "m10-l1",
        title: "Vision & Audio Multimodal APIs",
        duration: "45 min",
        type: "reading",
        summary: "Process images, wireframes, and voice recordings using GPT-4 Vision & Whisper.",
        contentMarkdown: `
# Multimodal Capabilities

Pass base64 image data or audio streams to give your applications eyes and ears!
        `,
        resources: []
      },
      {
        id: "m10-l2",
        title: "AI Tool Use & Function Calling",
        duration: "50 min",
        type: "interactive",
        summary: "Give LLMs tools to execute real code, search the live web, or fetch database data.",
        contentMarkdown: `
# Tool Calling Architecture

Define executable schemas so the AI can decide when to trigger specific internal application functions.
        `,
        initialCode: `// Tool Calling Declaration
const searchTool = {
  name: "search_web",
  description: "Search live web results for real-time news",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" }
    },
    required: ["query"]
  }
};

console.log("Registered AI Tool:", searchTool.name);`,
        expectedOutput: "Registered AI Tool: search_web",
        resources: []
      },
      {
        id: "m10-l3",
        title: "Multi-Agent Collaboration Networks",
        duration: "40 min",
        type: "video",
        summary: "Connect researcher, writer, and editor agents into a cohesive automated workflow.",
        contentMarkdown: `
# Multi-Agent Orchestration
How specialized autonomous sub-agents communicate to solve multi-stage problems.
        `,
        resources: []
      },
      {
        id: "m10-l4",
        title: "AI Product Quiz & Multimodal Assistant Project",
        duration: "45 min",
        type: "quiz",
        summary: "Build and test your Multimodal AI Assistant.",
        contentMarkdown: `
# Capstone 10: Multimodal Assistant
Deploy an agent capable of image inspection and tool execution.
        `,
        quiz: [
          {
            id: "q11",
            question: "What is AI Function Calling used for?",
            options: [
              "Allowing an LLM to trigger custom code and external API tools deterministically",
              "Replacing CSS stylesheets",
              "Compressing JPEG image sizes",
              "Restarting the computer server"
            ],
            correctAnswer: 0,
            explanation: "Function calling provides structured schemas so models can ask your application to run code and return output."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 11,
    slug: "startup-thinking",
    title: "Module 11: Startup Thinking & Product Strategy",
    tagline: "MVP Validation, Analytics & Growth",
    description: "Learn lean startup methodologies, product analytics, user feedback loops, and monetization strategies.",
    icon: "TrendingUp",
    lessonsCount: 4,
    duration: "3.0 Hours",
    projectTitle: "SaaS Launch Strategy Deck",
    projectDescription: "Create a complete launch roadmap including pricing tiers, landing page copy, and analytics tracking.",
    rewardXP: 400,
    lessons: [
      {
        id: "m11-l1",
        title: "Defining Minimum Viable Products (MVP)",
        duration: "40 min",
        type: "reading",
        summary: "Focus on core value propositions and launch in days rather than months.",
        contentMarkdown: `
# The Lean AI Startup Method

Identify the 1 core problem your app solves exceptionally well and ship it fast.
        `,
        resources: []
      },
      {
        id: "m11-l2",
        title: "Pricing Models & Monetization Integration",
        duration: "40 min",
        type: "interactive",
        summary: "Design subscription tiers, token pay-as-you-go models, and freemium funnels.",
        contentMarkdown: `
# AI SaaS Monetization

Compare usage-based token credits vs monthly recurring subscription tiers.
        `,
        initialCode: `// Tier Calculator
function calculatePricingTier(userType: "starter" | "pro" | "enterprise") {
  const tiers = {
    starter: { price: 0, credits: 100 },
    pro: { price: 29, credits: 2500 },
    enterprise: { price: 199, credits: 25000 }
  };
  return tiers[userType];
}

console.log("Pro Plan details:", calculatePricingTier("pro"));`,
        expectedOutput: `Pro Plan details: { price: 29, credits: 2500 }`,
        resources: []
      },
      {
        id: "m11-l3",
        title: "User Retention & Feedback Loops",
        duration: "35 min",
        type: "reading",
        summary: "Track active user metrics (DAU/MAU) and capture real user feedback to iterate rapidly.",
        contentMarkdown: `
# Analytics & Feedback Architecture
Instrument your application with events to understand user behavior.
        `,
        resources: []
      },
      {
        id: "m11-l4",
        title: "Startup Strategy Quiz & Launch Deck Project",
        duration: "40 min",
        type: "quiz",
        summary: "Submit your SaaS Launch Strategy Deck.",
        contentMarkdown: `
# Capstone 11: SaaS Strategy Deck
Formulate a growth plan with pricing structures and acquisition channels.
        `,
        quiz: [
          {
            id: "q12",
            question: "What is the primary goal of a Minimum Viable Product (MVP)?",
            options: [
              "To validate core user value and gather feedback with minimal effort",
              "To spend 2 years building every conceivable feature",
              "To hire 100 employees before writing code",
              "To hide your product from real users"
            ],
            correctAnswer: 0,
            explanation: "An MVP validates core product-market fit hypotheses quickly in the real world."
          }
        ],
        resources: []
      }
    ]
  },
  {
    id: 12,
    slug: "capstone-project",
    title: "Module 12: Capstone Challenge",
    tagline: "Build & Launch a Full AI SaaS",
    description: "The ultimate milestone: Build, deploy, and submit your flagship AI application for evaluation in the EduVerse Replit AI Challenge.",
    icon: "Award",
    lessonsCount: 4,
    duration: "5.0 Hours",
    projectTitle: "Capstone Challenge",
    projectDescription: "Deploy your complete production AI SaaS product to qualify for the Top 20 EduVerse Replit AI Challenge in Egypt.",
    rewardXP: 1000,
    lessons: [
      {
        id: "m12-l1",
        title: "Capstone Architecture Planning",
        duration: "45 min",
        type: "reading",
        summary: "Finalize your application architecture, data schemas, API routes, and user flow.",
        contentMarkdown: `
# The Capstone Challenge ⭐

This is your graduation milestone! You will combine everything you learned across the 11 modules into a single flagship application.

### Requirements:
1. Glassmorphic Next.js 16 frontend layout.
2. AI integration (LLM text, streaming, or vision).
3. Persistent storage & database backend.
4. Deployed on live Replit / web URL.
        `,
        resources: []
      },
      {
        id: "m12-l2",
        title: "Building Core App Engine & Integrations",
        duration: "60 min",
        type: "interactive",
        summary: "Assemble backend endpoints and frontend views.",
        contentMarkdown: `
# Assembling Your Product Engine

Integrate authentication, database CRUD operations, and AI stream handlers into a cohesive application.
        `,
        initialCode: `// Capstone Health Status Check
function verifyCapstoneBuild() {
  const checklist = {
    uiDesign: "Glassmorphic Modern UI",
    aiEngine: "OpenAI / Replit Agent API",
    database: "Supabase PostgreSQL",
    deployment: "Live Web URL",
    status: "READY FOR VERIFIED CERTIFICATE"
  };
  return checklist;
}

console.log(verifyCapstoneBuild());`,
        expectedOutput: `{\n  uiDesign: 'Glassmorphic Modern UI',\n  aiEngine: 'OpenAI / Replit Agent API',\n  database: 'Supabase PostgreSQL',\n  deployment: 'Live Web URL',\n  status: 'READY FOR VERIFIED CERTIFICATE'\n}`,
        resources: []
      },
      {
        id: "m12-l3",
        title: "UI Polish, Security & Performance Review",
        duration: "45 min",
        type: "reading",
        summary: "Audit application performance, dark theme contrast, mobile responsiveness, and security rules.",
        contentMarkdown: `
# Pre-Launch Quality Audit

Verify accessibility, zero key leakage in code, and lightning-fast page loading speeds.
        `,
        resources: []
      },
      {
        id: "m12-l4",
        title: "Final Graduation & Verified Certificate Generation",
        duration: "60 min",
        type: "quiz",
        summary: "Submit your final Capstone Project, complete the graduation assessment, and unlock your official EduVerse Signature Certificate!",
        contentMarkdown: `
# Congratulations Pioneer! 🎉

By completing this module, you unlock the **EduVerse Signature Verified Certificate** signed by Founder & CEO Beshoy Simon.
        `,
        quiz: [
          {
            id: "q13",
            question: "What completes the EduVerse Replit AI Academy graduation requirement?",
            options: [
              "Submitting a fully working deployed Capstone project and passing final checks",
              "Closing your web browser tab",
              "Deleting your database tables",
              "Skipping all practical exercises"
            ],
            correctAnswer: 0,
            explanation: "Graduation requires submitting a functional, deployed Capstone AI product."
          }
        ],
        resources: []
      }
    ]
  }
];

export const REPLIT_ACADEMY_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "first_lesson",
    title: "First Step Builder",
    description: "Completed your first lesson in Replit AI Academy",
    icon: "Play",
    unlocked: false,
    xpBonus: 50
  },
  {
    id: "first_quiz",
    title: "Knowledge Seeker",
    description: "Passed your first module quiz with 100% accuracy",
    icon: "Brain",
    unlocked: false,
    xpBonus: 100
  },
  {
    id: "first_project",
    title: "Cloud Craftsman",
    description: "Submitted your first hands-on module project",
    icon: "FolderPlus",
    unlocked: false,
    xpBonus: 200
  },
  {
    id: "halfway_hero",
    title: "Halfway Hero",
    description: "Completed 6 out of 12 modules in the flagship academy",
    icon: "Flame",
    unlocked: false,
    xpBonus: 500
  },
  {
    id: "course_completed",
    title: "Academy Graduate",
    description: "Finished all 12 modules and 48 core lessons",
    icon: "Trophy",
    unlocked: false,
    xpBonus: 1000
  },
  {
    id: "capstone_completed",
    title: "AI Product Pioneer",
    description: "Successfully built and deployed the Module 12 Capstone AI SaaS",
    icon: "Rocket",
    unlocked: false,
    xpBonus: 1500
  },
  {
    id: "perfect_quiz",
    title: "Perfect Score",
    description: "Answered all module quiz questions correctly on the first attempt",
    icon: "Sparkles",
    unlocked: false,
    xpBonus: 300
  }
];

export interface StudentState {
  completedLessons: string[];
  completedModules: number[];
  quizScores: Record<string, number>;
  userNotes: Record<string, string>;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedAchievements: string[];
  submittedProjects: { moduleId: number; title: string; link: string; date: string }[];
  certificateUnlocked: boolean;
  certificateId: string;
}

const STORAGE_KEY = "eduverse_replit_academy_state";

export function getStudentState(): StudentState {
  if (typeof window === "undefined") {
    return getDefaultStudentState();
  }
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStudentState();
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading student state", e);
    return getDefaultStudentState();
  }
}

export function saveStudentState(state: StudentState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving student state", e);
  }
}

export function getDefaultStudentState(): StudentState {
  return {
    completedLessons: ["m1-l1"],
    completedModules: [],
    quizScores: {},
    userNotes: {},
    xp: 250,
    streakDays: 4,
    lastActiveDate: new Date().toISOString(),
    unlockedAchievements: ["first_lesson"],
    submittedProjects: [],
    certificateUnlocked: false,
    certificateId: "EV-REPLIT-2026-" + Math.floor(100000 + Math.random() * 900000)
  };
}
