export const portfolioData = {
  profile: {
    name: "Chimwemwe Kamanga",
    title: "AI Engineer & Security Specialist | BsC Computer Science",
    image: "/profile-pic.jpg",
    summary: `I engineer autonomous, resilient systems at the intersection of Agentic AI, Forward Deployment, and Offensive Cybersecurity. I don't just build software—I bridge the gap between bleeding-edge research and mission-critical production.

My expertise spans Agentic Development and LLM Integration, where I architect state-aware autonomous agents, deterministic tool-calling pipelines, and high-throughput AI systems. As a Forward Deployment engineer, I operate directly where technical reality meets user needs—rapidly translating ambiguous requirements into battle-tested architectures, scaling workflows in fast-moving AI startups, and deploying robust systems in low-resource environments.

Underpinning my software engineering is a rigorous foundation in Penetration Testing and Information Security (INE Certified). By leveraging an adversarial mindset, I design and audit systems to withstand hostile environments, identifying attack vectors in both traditional infrastructure and emerging agentic loops. Whether deploying Beowulf compute clusters, fine-tuning retrieval pipelines, or conducting security assessments, my work is driven by high-velocity execution, deep technical curiosity, and uncompromising standards.`,
    email: "chimwemwe.kamanga01@gmail.com",
    phone: "(260) 954846892",
    location: "Lusaka, Zambia",
    linkedin: "https://www.linkedin.com/in/chimwemwe-kamanga-8b939b3ba/",
    github: "https://github.com/chimwemwe2003",
    twitter: "https://x.com/creamiechim?s=11",
    spotify: "https://open.spotify.com/user/w1nyotsp3z06zxuh1dzpj6s0x?si=5665490e41f146a9",
    binance: "https://account.binance.com/register?registerChannel=user_center&ref=1028236664",
    pinterest: "https://pin.it/4cjnBygR8",
    tags: [
      "Agentic Development",
      "Forward Deployment",
      "LLM Integration",
      "AI Engineering",
      "Penetration Testing",
      "Systems & Networks",
      "Full-Stack Architecture"
    ]
  },
  projects: [
    {
      id: "pebbles",
      title: "Pebbles SOC AI Assistant",
      focus: "Agentic AI / Cybersecurity & Rapid7 MCP",
      image: "/assets/pebbles.png",
      thumbnail: "/assets/pebbles.png",
      containThumbnail: true,
      description: "An intelligent NLP & Agentic AI assistant and unified Model Context Protocol (MCP) server for Rapid7 (InsightIDR and InsightVM). Designed with Google Gemini-style UI/UX, it retains monthly security operations data and allows analysts and CISOs to query metrics, incidents, user risk, and SLA trends using natural language with automatic interactive chart and graph generation.",
      links: {
        repo: "https://github.com/chimwemwe2003/rapid7-mcp",
        demo: "https://pebbles.streamlit.app/"
      },
      tags: ["Agentic AI", "MCP Server", "Cybersecurity", "Rapid7", "Streamlit", "LLM Integration"]
    },
    {
      id: "cefanet",
      title: "CEFANET Digital Notice Board",
      focus: "Civic Tech / Spatial Analytics & Full-Stack",
      image: "/assets/cefanet.png",
      thumbnail: "/assets/cefanet.png",
      description: "A civic-technology platform for monitoring Zambia's Constituency Development Fund (CDF) across 158 constituencies (K6.24 billion). Features project registry tracking, budget vs. expenditure variance, interactive Leaflet GPS mapping, and bursary monitoring with role-based access control.",
      links: {
        repo: "https://github.com/chimwemwe2003/cefanet",
        demo: "https://cefanet-2f71f.web.app/login/"
      },
      tags: ["Civic Tech", "Full-Stack", "TypeScript", "PostgreSQL", "GIS / Leaflet"]
    },
    {
      id: "global-hiv-insights",
      title: "Global HIV Insights Dashboard",
      focus: "Health Informatics / Geospatial Visualization",
      image: "/assets/hiv-insights.jpg",
      thumbnail: "/assets/hiv-insights.jpg",
      description: "An interactive epidemiological dashboard for exploring global HIV/AIDS indicators — new infections, AIDS-related deaths, ART coverage, and adult prevalence — across 153 countries using World Bank and UNAIDS datasets with choropleth world maps, dynamic charts, and CSV exports.",
      links: {
        repo: "https://github.com/chimwemwe2003/global-hiv-insights-",
        demo: "https://global-hiv-insigh.web.app/"
      },
      tags: ["Health Informatics", "Data Visualization", "Next.js", "D3 / Maps", "Analytics"]
    },
    {
      id: "kgs-mis",
      title: "Keeping Girls in School (KGS)",
      focus: "Education / Data Management",
      image: "/assets/kgs-gallery/Picture of flag school with flag of zambia.webp",
      thumbnail: "/assets/kgs-gallery/picture of school girls .webp",
      description: "A comprehensive initiative aimed at promoting education for girls by providing financial support and improving data management systems.",
      programOverview: "The Keeping Girls in School (KGS) initiative is a component of the World Bank-funded Girls' Education and Women's Empowerment and Livelihood (GEWEL) project. It aims to support vulnerable girls from socio-economically disadvantaged families to access and complete secondary education. By providing bursaries and educational grants, the program addresses financial barriers that often prevent girls from attending school. As of 2024, KGS has supported over 173,000 girls across 65 districts in Zambia, significantly improving enrollment and attendance rates.",
      roleDescription: "As a Training Officer within the KGS framework, I played a pivotal role in the implementation and management of the KGS Management Information System (MIS). My responsibilities included conducting training sessions for district officers and school administrators on data entry, verification, and reporting protocols. I facilitated the offloading of data from manual records to the digital MIS, ensuring accuracy and consistency. Additionally, I developed training materials and provided ongoing technical support to ensure the smooth operation of the system at the grassroots level.",
      professionalInsights: "Through this role, I honed my skills in technical training, data management, and stakeholder engagement. I learned the importance of adapting technical concepts for non-technical audiences, employing interactive training methodologies to enhance understanding and retention. The experience highlighted the critical role of accurate data in monitoring and evaluation, driving evidence-based decision-making for social impact programs.",
      gallery: [
        {
          type: "image",
          src: "/assets/kgs-gallery/IMG_1017.webp",
          caption: "Engaging District Officials: A collaborative session focused on mastering the KGS MIS interface for efficient data management."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/IMG_1018.webp",
          caption: "Hands-on Training: Guiding participants through real-time data entry scenarios to ensure accuracy and confidence."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/IMG_1077.webp",
          caption: "Capacity Building: Empowering educators with the digital tools needed to track and support vulnerable female students."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/IMG_1091.webp",
          caption: "Interactive Learning: Utilizing peer-to-peer learning strategies to reinforce understanding of the new reporting protocols."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/IMG_1102.webp",
          caption: "Strategic Planning: Discussing the roadmap for expanding the KGS initiative with key stakeholders and implementation partners."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/Rural officers learning on how to use kgs mis to pay grants.webp",
          caption: "Bridging the Gap: Rural officers learning how to utilize the KGS MIS to facilitate timely grant payments for beneficiaries."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/picture of school girls .webp",
          caption: "The Impact: Seeing the direct beneficiaries of our work—young girls gaining access to the education they deserve."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/8.webp",
          caption: "Community Outreach: Engaging with local communities to raise awareness about the KGS program and its benefits."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/chewe .webp",
          caption: "Team Collaboration: Working closely with colleagues to analyze data and improve program delivery."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/me presenting 2.webp",
          caption: "Leading the Way: Delivering a keynote presentation on the importance of digital literacy in education."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/rogers.webp",
          caption: "Field Operations: Coordinating with field officers to ensure smooth implementation of KGS activities."
        },
        {
          type: "video",
          src: "/assets/kgs-gallery/my colleague presenting .MOV",
          caption: "Knowledge Sharing in Action: A colleague demonstrating best practices for data verification during a regional workshop."
        },
        {
          type: "image",
          src: "/assets/kgs-gallery/me presenting ha.webp",
          caption: "Presentation: Sharing insights and progress updates."
        }
      ],
      links: {
        demo: "#"
      },
      tags: ["Data Management", "Forward Deployment", "Training", "Social Impact"]
    },
    {
      id: "parking",
      title: "Smart parking system",
      focus: "Simulation / Data Science",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2670&auto=format&fit=crop",
      description: "The system features a web-based dashboard that provides instant visualization (color-coded map) and dynamic summary metrics (available spots, occupied count). The core innovation lies in a state-aware JavaScript simulation engine that continuously generates realistic vehicle arrival and departure events, validating the system's core functionality and scalability before physical hardware deployment. This approach minimizes upfront investment and proves the cloud-side logic.",
      links: {
        repo: "https://github.com/chimwemwe2003/Smart-parking-system-simulator",
        demo: "https://smartcar-bc22a.firebaseapp.com"
      },
      tags: ["Simulation", "Machine Learning", "Data Visualization", "Analysis"]
    },
    {
      id: "Toll-Mang",
      title: "Toll Management with Esp32 & Arduino",
      focus: "Esp32, Arduino / Automation",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
      description: "An automated Toll collection project for iHub by infratel Zambia.",
      links: {
        repo: "https://github.com/chimwemwe2003/toll-management",
        demo: "https://drive.google.com/file/d/1xy_4KSOUw3uMXS3ho_Liod7mv_ztsXqT/view?usp=drive_link"
      },
      tags: ["Automation", "Hardware Security", "Simulation"]
    },
    {
      id: "proj-report",
      title: "Project Report on Smart car parking system",
      focus: "Pure Research / Writing",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2548&auto=format&fit=crop",
      description: "Project Report on Smart car parking system as required for a computer science undergraduate degree, including research, design, implementation, evaluation methodology, results, and discussion.",
      links: {
        report: "https://drive.google.com/file/d/1EfnsPE3yvakaXsdZcQ_YAgtU3YV1dUbg/view?usp=drive_link"
      },
      tags: ["Analysis", "Research Methods"]
    },
    {
      id: "beowulf-cluster",
      title: "Implementation of a Beowulf Cluster",
      focus: "High-Performance Computing",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
      description: "Designed and deployed a Beowulf cluster using commodity hardware to deliver parallel processing capability for simulation workloads. The project covered node provisioning, network configuration, MPI integration, and benchmarking to validate scalability gains.",
      links: {
        report: "https://drive.google.com/file/d/1XIuwRf8nIDyzBGyA3LyzYUMqIAaI3Wzx/view?usp=drive_link"
      },
      tags: ["Parallel Computing", "Linux", "MPI", "Systems Engineering"]
    },
    {
      id: "opennebula-cloud",
      title: "OpenNebula Cloud Implementation",
      focus: "Cloud Infrastructure",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
      description: "Engineered a small-scale private cloud using OpenNebula atop a clustered compute environment. Handled hypervisor configuration, virtual networking, storage orchestration, and self-service provisioning to deliver elastic resources for development workloads.",
      links: {
        report: "https://drive.google.com/file/d/1ODc-T-ysTDB1cx7ANsVo2osbg4qdB2rs/view?usp=drive_link"
      },
      tags: ["OpenNebula", "Virtualization", "Cloud Infrastructure", "Automation"]
    }
  ],
  certificates: {
    list: [
      {
        name: "INE CERTIFIED PENETRATION TESTER",
        issuer: "INE Security",
        link: "https://certs.ine.com/5c3de88d-e72e-44b1-931b-1bf02bcef891#acc.1QyDaUXY"
      },
      {
        name: "CISCO IT ESSENTIALS",
        issuer: "Cisco Networking Academy",
        highlight: false
      },
      {
        name: "CCNA - ROUTING & SWITCHING",
        issuer: "Cisco",
        highlight: false
      },
      {
        name: "CCNA 2 - SWITCHING, ROUTING & WIRELESS",
        issuer: "Cisco",
        highlight: false
      },
      {
        name: "CYBER OPS ASSOCIATE",
        issuer: "Cisco",
        highlight: false
      },
      {
        name: "AWS CERTIFIED FOUNDATIONS",
        issuer: "Amazon Web Services",
        highlight: false
      },
      {
        name: "GOOGLE CLOUD FOUNDATIONS",
        issuer: "Google Cloud",
        highlight: false
      }
    ],
    links: {
      Credly: "https://www.credly.com/users/chimwemwe-kamanga/edit#credly",
      INE: "https://certs.ine.com/5c3de88d-e72e-44b1-931b-1bf02bcef891#acc.1QyDaUXY"
    }
  },
  thoughts: [
    {
      id: "agentic-paradigms",
      title: "Beyond the Prompt: Architecting Deterministic Agentic Systems",
      date: "Nov 2026",
      readTime: "4 min read",
      category: "Agentic Development",
      summary: "LLMs alone are stochastic autocomplete engines. True autonomous impact occurs when you bind models to explicit state machines, validated tool schemas, and multi-tier feedback loops.",
      content: `Large language models have proven their linguistic ability, but in production environments, raw generation is rarely enough. The real challenge of agentic engineering lies in closing the gap between probabilistic reasoning and deterministic execution.

When architecting autonomous agents, we treat the model as a reasoning kernel rather than the entire application. By combining strict JSON schema validation, sandbox execution environments, and structured feedback loops, agents can reliably plan, self-correct, and interact with live databases and APIs without going off the rails.

Key architectural patterns for production agent loops:
1. Isolated tool-calling layers with explicit input and output contracts.
2. Checkpointed state machines allowing state replay and human-in-the-loop interventions.
3. Guardrailed error correction where syntax or schema errors are fed back into the reasoning context for automatic repair.

Autonomous systems shouldn't be fragile experiments—they should be resilient software artifacts built with defensive engineering.`
    },
    {
      id: "forward-deployment-engineering",
      title: "Forward Deployment: Engineering at the Edge of Chaos",
      date: "Oct 2026",
      readTime: "5 min read",
      category: "Forward Deployment",
      summary: "The cleanest code written in an isolated IDE often shatters upon contact with field constraints. Notes on deploying mission-critical systems in volatile, real-world conditions.",
      content: `Forward deployment engineering is the discipline of bridging theoretical software architecture and high-friction client reality. It is where engineering stops being an academic exercise and becomes an operational reality.

During my work rolling out data management systems across rural and urban districts, the most significant lessons had little to do with raw computing power and everything to do with real-world edge cases: intermittent power, unpredictable network latency, and users with wildly varying technical literacy.

A great forward deployment engineer doesn't expect the user or the environment to change to fit the software; the software must be resilient enough to survive the environment. This means offline-first architectures, ruthless simplicity in interface design, and deep empathy for the people operating the tools at the grassroots.`
    },
    {
      id: "pentesting-ai-loops",
      title: "Red Teaming Agentic Workflows: The Offensive Security Perspective",
      date: "Aug 2026",
      readTime: "6 min read",
      category: "Penetration Testing",
      summary: "Autonomous tool execution introduces entirely new attack surfaces: indirect prompt injection, SSRF via agent retrieval, and privilege escalation within reasoning traces.",
      content: `As an INE-certified penetration tester working with AI systems, the intersection of cybersecurity and agentic development is one of the most critical frontiers today.

When an LLM is granted agency—meaning the ability to execute terminal commands, read files, query internal databases, or trigger webhooks—it expands traditional vulnerability surfaces exponentially. Indirect prompt injection is no longer just a prompt trick; it is a remote code execution vector.

Key security controls every agent system must enforce:
- Strict sandbox isolation: Tools should never run with ambient credentials or unrestricted network access.
- Principle of Least Privilege: Agents should only be provided the narrowest database scopes and authenticated API tokens required for the immediate task.
- Dual-boundary verification: Inspect inputs before they reach the model, and validate the model's synthesized commands before the execution harness runs them.`
    }
  ]
};
