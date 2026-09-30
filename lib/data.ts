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
  tagline: "Architecting high-scale distributed frontends, real-time matrix virtualizations, and autonomous agentic workflows.",
  status: "Available for high-impact engineering roles",
  location: "Remote / Global",
  github: "https://github.com/emwil23",
  linkedin: "https://www.linkedin.com/in/ewilly/",
  email: "contact@emmanuelwilson.dev",
  heroMetrics: [
    { label: "Platform Scale", value: "150K–200K DAU", context: "Kredily" },
    { label: "Bundle Reduction", value: "-60%", context: "React + Vite" },
    { label: "Render Speedup", value: "10x", context: "AG-Grid Virtualization" }
  ],
  projects: [
    {
      id: "canvasforge-ai",
      title: "CanvasForge AI",
      summary: "Autonomous multi-file agentic React IDE running in-browser with sub-50ms streaming latency.",
      stack: ["Next.js 15", "TypeScript", "FastAPI (Mocked)", "Sandpack"],
      github: "https://github.com/emwil23/canvasforge-ai"
    },
    {
      id: "throughput-matrix",
      title: "High-Throughput Analytics Matrix",
      summary: "Client-side stress test displaying massive datasets seamlessly at a locked 60 FPS.",
      stack: ["React", "Virtualization", "Web Workers"],
      github: "https://github.com/emwil23/throughput-matrix"
    }
  ]
};
