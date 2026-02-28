/**
 * Stranger Things Themed Tech Events Data 
 * ✅ Compatible with your old EventCard.jsx (has gradient field)
 * ✅ Enhanced schema with full details structure
 * ✅ Updated against Reference Document (Registration source, Team sizes, Cash prizes)
 * ✅ Added Student Coordinators
 */
const events = [
  {
    id: "connexion",
    title: "CONNEXION",
    subtitle: "ELECTRICAL CORE CHALLENGE",
    category: "Technical",
    registrationLink: "https://forms.gle/h627HTRAZS1x44zc6",
    meta: {
      topic: "Core Electrical",
      teamSize: "2-3 members"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "An interactive technical event focused on analytical thinking and understanding core electrical concepts."
      ],
      rules: [
        "Team collaboration required",
        "Time-bound rounds",
        "Judges decision final"
      ],
      requirements: ["Basic electrical knowledge"],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Concept Round",
          description: "Testing theoretical understanding"
        },
        {
          title: "Design Round",
          description: "Application-based problem solving"
        }
      ],
      duration: null
    },
    note: "Encourages practical understanding of electrical systems.",
    gradient: ["#00FF7F", "#006400"]
  },

  {
    id: "technical-paper",
    title: "TECHNICAL PAPER PRESENTATION",
    subtitle: "RESEARCH SHOWCASE",
    category: "Technical",
    registrationLink: "https://forms.gle/tYdfyMJnt1xaHvUU6",
    meta: {
      topic: "Open Technical Domain",
      teamSize: "Individual / Max 4 members"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "Present original research papers, case studies, or innovative technical concepts."
      ],
      rules: [
        "Original content only",
        "Abstract submission mandatory",
        "Presentation time strictly followed"
      ],
      requirements: ["PPT submission", "Research abstract"],
      specs: ["8-10 slides"],
      deliverables: ["PowerPoint Presentation"],
      rounds: [],
      duration: "7 min presentation + 3 min Q&A"
    },
    note: "Focus on clarity, innovation and technical depth.",
    gradient: ["#4B0082", "#8A2BE2"]
  },

  {
    id: "analog-arena",
    title: "ANALOG ARENA",
    subtitle: "REAL-TIME CIRCUIT BUILD",
    category: "Technical",
    registrationLink: "https://forms.gle/R3Zbgk1Zq5QSe5oc6",
    meta: {
      topic: "Analog Electronics",
      teamSize: "2 members"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "Hands-on analog circuit analysis, assembly and optimization challenge."
      ],
      rules: [
        "Time-based circuit building",
        "Component selection accuracy matters",
        "Functional output mandatory"
      ],
      requirements: ["Strong understanding of analog components"],
      specs: [
        "Breadboard assembly",
        "Component rating analysis"
      ],
      deliverables: ["Working analog circuit"],
      rounds: [
        {
          title: "Circuit Interpretation",
          description: "Analyze given diagram"
        },
        {
          title: "Build & Optimize",
          description: "Construct and modify circuit"
        }
      ],
      duration: null
    },
    note: "Simulates real engineering workflow.",
    gradient: ["#FFD700", "#FF4500"]
  },

  {
    id: "spark-the-brain",
    title: "SPARK THE BRAIN",
    subtitle: "DIFFERENT LEVEL QUIZ",
    category: "Technical",
    registrationLink: "https://forms.gle/N2ZLmPYyNPuG3WzW6",
    meta: {
      topic: "Technical Quiz",
      teamSize: "Individual / Team"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "A structured technical quiz bridging theory and practical application."
      ],
      rules: [
        "Three structured rounds",
        "Increasing difficulty",
        "No electronic devices allowed"
      ],
      requirements: [],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Round 1",
          description: "MCQ screening test"
        },
        {
          title: "Round 2",
          description: "Application-based questions"
        },
        {
          title: "Final Round",
          description: "Rapid technical problem solving"
        }
      ],
      duration: null
    },
    note: "Think beyond textbooks.",
    gradient: ["#FF8C00", "#FF0000"]
  },

  {
    id: "what-an-idea",
    title: "WHAT AN IDEA!",
    subtitle: "ABSTRACT PITCH EVENT",
    category: "Technical",
    registrationLink: "https://forms.gle/HhFiQQ9au7eLMXpp7",
    meta: {
      topic: "Innovation & Entrepreneurship",
      teamSize: "Individual / Team"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "Pitch your innovative product, business model, or service solution before industry experts and investors."
      ],
      rules: [
        "Idea must be original",
        "Pitch time strictly limited",
        "Presentation should be clear and structured"
      ],
      requirements: ["Prototype optional", "Presentation mandatory"],
      specs: ["Business or product innovation concept"],
      deliverables: ["Pitch Presentation"],
      rounds: [],
      duration: "10 minutes pitch + Q&A"
    },
    note: "Industry experts evaluate feasibility and innovation.",
    gradient: ["#FF1744", "#8B0000"]
  },

  {
    id: "thinklink",
    title: "THINKLINK",
    subtitle: "FUN MEMORY & COMMUNICATION GAME",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/Lw5Y2RCfCNRHogUv5",
    meta: {
      topic: "Memory & Interaction",
      teamSize: "Individual / Team of 2"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "A light-hearted event testing memory, communication, creativity, and confidence."
      ],
      rules: [
        "Follow time limits",
        "No mobile phones",
        "Judges’ decision final"
      ],
      requirements: [],
      specs: [],
      deliverables: [],
      rounds: [],
      duration: null
    },
    note: "Observe, connect, and entertain.",
    gradient: ["#FF6A00", "#FF1493"]
  },

  {
    id: "blackout-survival-challenge",
    title: "BLACKOUT SURVIVAL CHALLENGE",
    subtitle: "POWER CUT SITUATION GAME",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/yNRFeMDjYG4baVcM6",
    meta: {
      topic: "Team Strategy & Role Play",
      teamSize: "Team"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "Teams handle fun blackout themed tasks through gameplay."
      ],
      rules: [
        "Follow time limits",
        "Maintain decorum",
        "Decision final"
      ],
      requirements: [],
      specs: [],
      deliverables: [],
      rounds: [],
      duration: null
    },
    note: "Stay calm in the dark and think smart.",
    gradient: ["#000000", "#FFA500"]
  },

  {
    id: "human-ludo",
    title: "HUMAN LUDO",
    subtitle: "LIFE-SIZE LUDO EXPERIENCE",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/mwj8LjzEMPSzV9Bd9",
    meta: {
      topic: "Strategy & Team Play",
      teamSize: "3 – 4 per team"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "Life-size Ludo game combining movement and strategy."
      ],
      rules: [
        "Follow instructions",
        "No malpractice",
        "Decision final"
      ],
      requirements: [],
      specs: [],
      deliverables: [],
      rounds: [],
      duration: "1–2 hours"
    },
    note: "Think fast, move smart.",
    gradient: ["#00B4DB", "#0083B0"]
  },

  {
    id: "d2-investigation-challenge",
    title: "D-2 INVESTIGATION CHALLENGE",
    subtitle: "CASE, CLUES & LOGIC",
    category: "Technical",
    registrationLink: "https://forms.gle/HD2KL1ynJK3YGUe28",
    meta: {
      topic: "Investigative Problem Solving",
      teamSize: "Team"
    },
    coordinator: {
      name: "To Be Announced",
      phone: "0000000000"
    },
    details: {
      description: [
        "Multi-stage investigation and technical challenge."
      ],
      rules: [
        "Follow constraints",
        "Time limit enforced",
        "Decision final"
      ],
      requirements: [],
      specs: [],
      deliverables: [],
      rounds: [],
      duration: null
    },
    note: "Think like an investigator.",
    gradient: ["#6A11CB", "#2575FC"]
  }
];

export default events;