export interface MetricItem {
  label: string;
  value: string;
  context: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  github: string;
  demo?: string;
  stars?: number;
}

export interface PortfolioData {
  name: string;
  title: string;
  role: string;
  tagline: string;
  status: string;
  location: string;
  github: string;
  linkedin: string;
  email: string;
  heroMetrics: MetricItem[];
  projects: ProjectItem[];
}


export const portfolioData: PortfolioData = {
  name: "Emmanuel Wilson",
  title: "Full-Stack & Systems Engineer",
  role: "Software Development Engineer",
  tagline: "Architecting high-scale distributed backends, autonomous AI agent orchestrations, and high-performance frontend systems.",
  status: "Available for high-impact engineering roles",
  location: "Bangalore, India · Remote / Global",
  github: "https://github.com/emwil23",
  linkedin: "https://www.linkedin.com/in/ewilly/",
  email: "emmanuel_work@icloud.com",
  heroMetrics: [
    { label: "Platform Scale", value: "150K–200K DAU", context: "Cloud Workforce Platform" },
    { label: "Query Optimization", value: "-99.7%", context: "N+1 Batch DB Overhaul" },
    { label: "Bundle Reduction", value: "-60%", context: "Unified Vite Architecture" }
  ],
  projects: [
    {
      id: "enterprise-ai-copilot",
      title: "Autonomous Enterprise AI Copilot",
      summary: "Deterministic multi-gate workflow orchestrator executing payroll, compliance filing, and policy onboarding with bi-directional UI synchronization.",
      stack: ["Python", "FastAPI", "React", "Celery", "Distributed State Machines"],
      github: "https://github.com/emwil23"
    },
    {
      id: "distributed-batch-pipeline",
      title: "High-Throughput Batch Optimization",
      summary: "Eliminated cascading N+1 database bottlenecks in high-volume payroll calculations, accelerating throughput by 19x.",
      stack: ["Django", "PostgreSQL", "Read-Replicas", "RabbitMQ", "Redis"],
      github: "https://github.com/emwil23"
    },
    {
      id: "virtualized-matrix-register",
      title: "High-Cardinality Virtualized Register",
      summary: "Client-side virtualized data table rendering 10,000+ employee records at a locked 60 FPS with microsecond frame pacing.",
      stack: ["React", "TypeScript", "Vite", "AG-Grid", "Tailwind CSS"],
      github: "https://github.com/emwil23"
    }
  ]
};

