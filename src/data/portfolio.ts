// ─────────────────────────────────────────────────────────────
//  PORTFOLIO DATA  –  single source of truth
// ─────────────────────────────────────────────────────────────

export const portfolioData = {
  name: "Kunal Madaan",
  role: "Full Stack Developer",
  tagline: "Building scalable universes, one commit at a time.",
  about:
    "I architect high-performance web experiences at the intersection of engineering precision and creative vision. Specialising in React, Next.js, Three.js and Node.js — turning complex problems into elegant, immersive products.",

  contact: {
    email: "kunal@example.com",
    github: "https://github.com/kunalmadaanwork-maker",
    linkedin: "https://linkedin.com/in/kunal-madaan",
  },

  skills: [
    "React / Next.js",
    "TypeScript",
    "Three.js / R3F",
    "Node.js",
    "PostgreSQL",
    "GraphQL",
    "GSAP",
    "WebGL / GLSL",
    "Docker",
    "AWS",
  ],

  // Each project maps to a world object in the 3-D scene
  projects: [
    {
      id: 1,
      title: "Nebula UI",
      category: "Full Stack · React · Next.js",
      description:
        "A SaaS analytics dashboard with real-time WebSocket streams, custom component library, and sub-100 ms interactions. Reduced bundle size by 40 % through code-splitting and tree-shaking.",
      tech: ["Next.js", "TypeScript", "WebSockets", "Postgres", "Redis"],
      link: "https://github.com/kunalmadaanwork-maker",
      accentColor: "#38bdf8", // sky blue  → planet 1
    },
    {
      id: 2,
      title: "Orbit Engine",
      category: "Frontend · WebGL · GSAP",
      description:
        "Physics-based 3-D data-visualisation tool with custom GLSL shaders, GPGPU particle systems, and a GSAP-driven animation orchestrator for storytelling through data.",
      tech: ["Three.js", "GLSL", "GSAP", "React Three Fiber"],
      link: "https://github.com/kunalmadaanwork-maker",
      accentColor: "#a78bfa", // violet    → nebula
    },
    {
      id: 3,
      title: "Singularity API",
      category: "Backend · Node.js · GraphQL",
      description:
        "Distributed microservices platform handling 50 k+ daily requests. Redis caching, Kafka event streams, and a GraphQL gateway unifying six internal services with zero-downtime deploys.",
      tech: ["Node.js", "GraphQL", "Redis", "Kafka", "Docker"],
      link: "https://github.com/kunalmadaanwork-maker",
      accentColor: "#fb923c", // orange    → black-hole zone
    },
  ],

  experience: [
    {
      year: "2023 – Now",
      role: "Full Stack Developer",
      company: "Freelance",
      desc: "End-to-end web products for international clients; specialising in React ecosystems and 3-D web experiences.",
    },
    {
      year: "2022",
      role: "Frontend Intern",
      company: "Tech Corp",
      desc: "Built interactive dashboards and design-system components used by 20 k+ users.",
    },
    {
      year: "2021",
      role: "B.Tech CSE",
      company: "University",
      desc: "Computer Science fundamentals — algorithms, OS, networks, distributed systems.",
    },
  ],
};

export type Project = (typeof portfolioData.projects)[number];
