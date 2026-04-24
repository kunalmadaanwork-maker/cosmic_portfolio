export const portfolioData = {
  name: "Kunal Madaan",
  role: "Full Stack Developer",
  tagline: "Architecting scalable web solutions at the intersection of quantitative logic and creative engineering.",
  about:
    "I build high-performance digital experiences using React, Next.js, Three.js, and Node.js. Passionate about the boundary between engineering precision and creative storytelling — turning complex problems into elegant, immersive solutions.",
  contact: {
    email: "kunal@example.com",
    github: "https://github.com/kunalmadaanwork-maker",
    linkedin: "https://linkedin.com/in/kunal-madaan",
  },
  projects: [
    {
      id: 1,
      title: "Nebula UI",
      category: "Full Stack · React · Next.js",
      description:
        "A high-performance SaaS dashboard with real-time data streams, WebSocket sync, and sub-100ms UI interactions. Built a custom component library reducing bundle size by 40%.",
      tech: ["Next.js", "TypeScript", "WebSockets", "Postgres"],
      link: "https://github.com/kunalmadaanwork-maker",
      color: "#22d3ee",
    },
    {
      id: 2,
      title: "Orbit Engine",
      category: "Frontend Architecture · WebGL",
      description:
        "A physics-based 3D data visualization tool. Custom GLSL shaders, GPGPU particle systems, and a GSAP-driven animation orchestrator for storytelling through data.",
      tech: ["Three.js", "GLSL", "GSAP", "React Three Fiber"],
      link: "https://github.com/kunalmadaanwork-maker",
      color: "#7c3aed",
    },
    {
      id: 3,
      title: "Singularity API",
      category: "Backend · Node.js · GraphQL",
      description:
        "A distributed microservices platform handling 50k+ daily requests. Redis caching, Kafka event streams, and a GraphQL gateway unifying 6 internal services.",
      tech: ["Node.js", "GraphQL", "Redis", "Kafka"],
      link: "https://github.com/kunalmadaanwork-maker",
      color: "#f59e0b",
    },
  ],
  experience: [
    {
      year: "2023–Now",
      role: "Full Stack Developer",
      company: "Freelance / Self-Employed",
      desc: "Delivering end-to-end web products for international clients. Specializing in React ecosystems and 3D web experiences.",
    },
    {
      year: "2022",
      role: "Frontend Intern",
      company: "Tech Corp",
      desc: "Built interactive dashboards and design-system components used by 20k+ users.",
    },
    {
      year: "2021",
      role: "B.Tech CSE",
      company: "University",
      desc: "Computer Science fundamentals — algorithms, OS, networks, and distributed systems.",
    },
  ],
};

export type PortfolioProject = (typeof portfolioData.projects)[number];