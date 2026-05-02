// src/data/portfolio.ts

export const portfolioData = {
  name: "Kunal Madaan",
  role: "Senior Techno-Functional BSA & AI Architect",
  tagline: "I automate the work that slows enterprises down.",
  about:
    "7+ years bridging legacy enterprise complexity and modern GenAI delivery. Certified Scrum Master (CSM®) and Product Owner (CSPO®) across Banking, Retail, Healthcare, and Insurance. I specialize in RAG pipelines, deep SQL data audits, and agentic workflows.",

  contact: {
    email: "kunal.madaan.work@gmail.com",
    github: "https://github.com/kunalmadaanwork-maker", 
    linkedin: "https://www.linkedin.com/in/kunal-madaan-bsa/",
    location: "Bengaluru (Open to Remote)",
  },

  skills:[
    "Enterprise RAG Architecture",
    "Agentic Workflows (n8n)",
    "Prompt Engineering",
    "SQL Data Audits",
    "Agile / Scrum (CSM® & CSPO®)",
    "Claude API / Local LLMs",
    "Requirements Lifecycle",
    "Fraud Detection ML",
  ],

  // These map to the 3D zones (Planet, Nebula)
  projects:[
    {
      id: 1,
      title: "Multi-Stage AI Pipeline",
      category: "Enterprise RAG Architecture",
      description:
        "Engineered a hallucination-free documentation pipeline at RBC. Leveraged Enterprise Copilot to feed a secure Knowledge Base fortified with strict guardrails — turning a 6-day manual process into a 2-day automated one.",
      tech:["Copilot", "Intent Extract", "Knowledge Base", "Guardrails"],
      link: "https://www.linkedin.com/in/kunal-madaan-bsa/",
      accentColor: "#38bdf8", // Sky Blue -> Planet Zone
    },
    {
      id: 2,
      title: "Claims Fraud MVP",
      category: "Insurance ML POC",
      description:
        "Automated manual fraud detection by mapping high-risk indicators to predictive model architectures. Collaborated with Data Science teams to feature-engineer complex indicators for anomaly detection models.",
      tech: ["Data Science", "Feature Engineering", "Anomaly Detection"],
      link: "https://www.linkedin.com/in/kunal-madaan-bsa/",
      accentColor: "#a78bfa", // Violet -> Nebula Zone
    },
  ],

  experience:[
    {
      year: "Dec 2023 – Present",
      role: "Senior BSA / AI Architect",
      company: "Epsilon",
      desc: "Driving AI transformation for Tier-1 Financial Leaders and Global Retailers — specializing in RAG pipelines and deep SQL data audits. Achieved 70% FSD turnaround cut.",
    },
    {
      year: "Nov 2021 – Oct 2023",
      role: "Business Systems Analyst",
      company: "NTT Data",
      desc: "Engineered an ML Fraud Detection POC and owned the full requirements lifecycle for US Healthcare radiology systems across 2 enterprise domains.",
    },
    {
      year: "Aug 2018 – May 2021",
      role: "QA / BSA",
      company: "Crestech Systems",
      desc: "Directed end-to-end QA for Max Life Insurance product streams, ensuring 100% data integrity across mobile and web platforms.",
    },
  ],
};

export type Project = (typeof portfolioData.projects)[number];