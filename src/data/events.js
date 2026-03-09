/**
 * Epsilon 2K26 — Events Data
 * ✅ Fully updated from official PDFs, posters & SOP documents (March 2026)
 * ✅ Real coordinator names, contacts, venues, timings, rounds, rules
 * ✅ Correct team sizes, registration links, categories
 */
const events = [

  // ─────────────────────────────────────────────────────────────────────────────
  // TECHNICAL EVENTS
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: "connexiion",
    title: "CONNEXIION",
    subtitle: "ELECTRICAL CORE CHALLENGE",
    category: "Technical",
    registrationLink: "https://forms.gle/h627HTRAZS1x44zc6",
    meta: {
      topic: "Core Electrical",
      teamSize: "3 Members Mandatory"
    },
    date: "16 March 2026",
    time: "Round-wise schedule",
    venue: "CR 3, EEE – First Floor (Main Block)",
    coordinators: [
      { name: "Deepak", phone: "7397377589" }
    ],
    email: "epsilon2k26@gmail.com",
    details: {
      description: [
        "CONNEXION is an interactive multi-stage technical event that challenges participants to demonstrate their analytic abilities, electrical components knowledge, and engineering fundamentals. Through structured quiz rounds, component identification tasks, and teams strategically connect clues to reveal the core electrical principle behind the challenges."
      ],
      rules: [
        "No online screening — all registered teams present on event day may participate.",
        "Only one mobile phone per team allowed during Round 1 & 2 for answering questions.",
        "One member per team must speak loudly for Round 3.",
        "Rankings and quickest time will be final to declare the winner.",
        "Exchange of answers between teams is strictly prohibited.",
        "Internet usage during quiz leads to immediate disqualification.",
        "Answers must be given with correct logic within the time limit.",
        "In case of a tie, previous round scores will determine the winner.",
        "Judges' decision is final and binding."
      ],
      requirements: [
        "Basic knowledge of electrical components and circuit theory.",
        "Install digital buzzer app on mobile before Round 2."
      ],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Round 1 – Analysis",
          description: "Online quiz of ~25 general electrical core questions. Teams answer via a shared QR-code website using one mobile phone. Rankings determine progression."
        },
        {
          title: "Round 2 – Design",
          description: "Images of electrical components, principles, and formulae are projected. 15 questions, 5 points each. Teams press a digital buzzer (first-come-first-serve) to answer. Unanswered questions pass to the next 3 fastest teams."
        },
        {
          title: "Round 3 – Build Up",
          description: "Teams receive a sealed paper slip with two electrical components (jumbled/coded). On the projector, various components are displayed. Teams figure out the third component connecting the first two, then explain the underlying principle. Fastest correct team wins."
        }
      ],
      duration: "Full day — round-wise"
    },
    note: "Encourages practical understanding and lateral thinking in electrical systems.",
    gradient: ["#00FF7F", "#006400"],
    poster: "/posters/connexiion.jpeg",
    brochure: "/brochures/connxiion.pdf"
  },

  {
    id: "technical-paper",
    title: "PAPER PRESENTATION",
    subtitle: "INNOVATE · RESEARCH · PRESENT",
    category: "Technical",
    registrationLink: "https://forms.gle/tYdfyMJnt1xaHvUU6",
    meta: {
      topic: "Open Domain – Any Technical Topic",
      teamSize: "Individual or max 3 members"
    },
    date: "16 March 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "KRS Seminar Hall Main Block",
    coordinators: [
      { name: "Srikanth N", phone: "9943246709" },
      { name: "Surya S", phone: "9043083844" }
    ],
    email: "epsilon2k26@gmail.com",
    prize: "Exciting Cash Prize",
    details: {
      description: [
        "Paper Presentation is a technical event that provides a platform for students to present their innovative ideas, research findings, and technical knowledge in front of a panel of judges. It encourages participants to explore emerging technologies, enhance analytical thinking, and develop confident presentation skills. Where Ideas Speak Louder Than Words."
      ],
      rules: [
        "Each team gets 10–12 minutes for presentation + 5 minutes for Q&A.",
        "Presentation must be prepared using PowerPoint (PPT). Maximum 12 slides (excluding title and thank you slide).",
        "Topics: Open Domain (Technical & Innovative Topics).",
        "The presentation must be the original work of the participants.",
        "Plagiarism will lead to immediate disqualification.",
        "Abstract submission hardcopy is mandatatory before presentation.",
        "Participants must bring their presentation on a pen drive with email backup.",
        "Participants must report 30 minutes before the event starts.",
        "Formal dress code is mandatory.",
        "Judges' decision will be final and binding."
      ],
      requirements: [
        "PowerPoint presentation (max 12 slides).",
        "Research abstract should be Submitted .",
        "Pen drive with backup copy."
      ],
      specs: [],
      deliverables: ["PowerPoint Presentation", "Research Abstract"],
      rounds: [
        {
          title: "Single Round – Presentation + Q&A",
          description: "10–12 min presentation followed by 5 min Q&A with judges. Judged on technical content, innovation, presentation skills, PPT design, Q&A performance, and time management."
        }
      ],
      judgingCriteria: [
        { criterion: "Technical Content", marks: 25 },
        { criterion: "Innovation & Originality", marks: 20 },
        { criterion: "Presentation Skills", marks: 20 },
        { criterion: "PPT Design", marks: 15 },
        { criterion: "Q&A Performance", marks: 15 },
        { criterion: "Time Management", marks: 5 }
      ],
      duration: "10:00 AM – 1:00 PM"
    },
    note: "Maximum 20 teams. First come, first served.",
    gradient: ["#4B0082", "#8A2BE2"],
    poster: "/posters/paper-prensentation.jpeg",
    brochure: "/brochures/paperpresentation.pdf"
  },

  {
    id: "analog-arena",
    title: "ANALOG ARENA",
    subtitle: "REAL-TIME CIRCUIT BUILD",
    category: "Technical",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLScphhGuN8UXakck3k7bri6S1OvtrE3nw1qoS1NGaG2O-qXcfA/viewform?usp=sharing&ouid=101277837040012249193",
    meta: {
      topic: "Analog Circuit Design & Implementation",
      teamSize: "2–3 members"
    },
    date: "16 March 2026",
    time: "10:00 AM – 3:00 PM",
    venue: "ECE Circuit Lab (1st floor Main block)",
    coordinators: [
      { name: "M. Lokesh", phone: "6369974529" },
      { name: "M. Tarun", phone: "7200067554" }
    ],
    email: "epsilon2k26@gmail.com",
    details: {
      description: [
        "Analog Arena is a hands-on analog electronics competition where participants transform circuit diagrams into working hardware under real-time constraints. This event challenges students to demonstrate their understanding of component selection, breadboard implementation, output measurement, and performance optimization. Grab your exciting prizes!"
      ],
      rules: [
        "Maximum 20 teams. Registration on first come, first serve basis.",
        "Only provided components may be used.",
        "Judges must verify the circuit before power supply connection.",
        "Any short circuit or unsafe wiring must be corrected before testing.",
        "Mobile phones are not allowed during active competition.",
        "Teams must report 30 minutes prior to the event.",
        "Exceeding time limits will result in negative marking.",
        "Participants must wear closed-toe footwear; hands must be dry before handling equipment.",
        "Short circuits and unsafe wiring are strictly prohibited.",
        "The jury's decision will be final and binding."
      ],
      requirements: [
        "Basic knowledge of analog circuits and component identification.",
        "Inter-college teams allowed. Individual participation not permitted."
      ],
      specs: [
        "Breadboard assembly",
        "Component rating analysis",
        "Output precision measurement"
      ],
      deliverables: ["Working analog circuit on breadboard"],
      rounds: [
        {
          title: "Round 1 – Component Gathering",
          description: "Participants identify and collect the correct components based on a provided circuit diagram."
        },
        {
          title: "Round 2 – Bread Board Build",
          description: "Teams assemble the circuit on a breadboard using collected components. Judges verify before power connection."
        },
        {
          title: "Round 3 – Constraint Design",
          description: "Advanced qualifier round: teams modify circuits to meet specified electrical constraints within a time limit."
        }
      ],
      judgingCriteria: [
        { criterion: "Component Selection", marks: 20 },
        { criterion: "Circuit Accuracy", marks: 20 },
        { criterion: "Output Precision", marks: 20 },
        { criterion: "Constraint Satisfaction", marks: 20 },
        { criterion: "Neatness & Layout", marks: 10 },
        { criterion: "Time Efficiency", marks: 10 }
      ],
      duration: "10:00 AM – 3:00 PM"
    },
    note: "Simulates a real engineering workflow under pressure.",
    gradient: ["#FFD700", "#FF4500"],
    poster: "/posters/analogarena.jpeg",
    brochure: "/brochures/analogarena.pdf"
  },

  {
    id: "spark-the-brain",
    title: "SPARK THE BRAIN",
    subtitle: "ULTIMATE MIND ARENA",
    category: "Technical",
    registrationLink: "https://forms.gle/N2ZLmPYyNPuG3WzW6",
    meta: {
      topic: "Technical Quiz – Electrical Engineering",
      teamSize: "2 members per team"
    },
    date: "16 March 2026",
    time: "Session 1: 9:30 AM–12:00 PM | Session 2: 1:00 PM–3:00 PM",
    venue: "Main Block",
    coordinators: [
      { name: "Ramprasath M", phone: "7695863928" },
      { name: "Bharanitharan", phone: "8248910236" }
    ],
    email: "epsilon2k26@gmail.com",
    prize: "No Entry Fees! Exciting Cash Prizes",
    details: {
      description: [
        "SPARK THE BRAIN is a dynamic three-round technical quiz that tests participants' knowledge, logical thinking, and practical understanding of electrical concepts. The event combines MCQs, visual fault-finding challenges, and equipment decoding puzzles to create an engaging competition. Think fast. Analyze smart. Win big! A high-energy technical quiz of MCQs, visual challenges, and picture-based clues."
      ],
      rules: [
        "Each team must consist of exactly 3 participants from the same institution.",
        "Inter-department teams are allowed. No individual participation.",
        "Mobile phones, smartwatches, or any electronic gadgets are strictly prohibited during the event.",
        "Teams found using unauthorized devices will be immediately disqualified.",
        "Teams must qualify in each round to proceed to the next.",
        "Answers once given cannot be changed.",
        "No discussion with the audience or other teams during competition.",
        "In case of a tie, a tie-breaker question will be conducted.",
        "Participants must report at least 15 minutes before the event begins.",
        "Judges' and coordinators' decision is final and binding."
      ],
      requirements: [
        "Knowledge of electrical engineering fundamentals.",
        "No gadgets permitted during competition."
      ],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Round 1 – MCQ Rapid Fire",
          description: "Rapid-fire multiple choice questions covering electrical engineering concepts. Tests speed, accuracy, and technical breadth."
        },
        {
          title: "Round 2 – Visual Fault Detection",
          description: "Teams analyze images to identify faults and decode visual challenges related to electrical systems and components."
        },
        {
          title: "Round 3 – Equipment Decoding",
          description: "Picture-based clues and equipment puzzles. Teams must identify components and explain their function under pressure."
        }
      ],
      judgingCriteria: [
        { criterion: "Technical Knowledge", marks: 40 },
        { criterion: "Logical & Analytical Skills", marks: 35 },
        { criterion: "Speed & Team Coordination", marks: 25 }
      ],
      duration: "Two sessions — morning and afternoon"
    },
    note: "Fuel your logic. Own the stage. Think beyond textbooks.",
    gradient: ["#FF8C00", "#FF0000"],
    poster: "/posters/sparkthebrain.jpeg",
    brochure: "/brochures/sparkthebrain.pdf"
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // NON-TECHNICAL EVENTS
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: "what-an-idea",
    title: "WHAT AN IDEA!",
    subtitle: "INNOVATE · PRESENT · SUCCEED",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/HhFiQQ9au7eLMXpp7",
    meta: {
      topic: "Innovation & Entrepreneurship",
      teamSize: "1-3 members"
    },
    date: "16 March 2026",
    time: "9:30 AM – 4:00 PM",
    venue: "PSS Lab,1st Floor Main Block, MSEC",
    coordinators: [
      { name: "Event Coordinator", phone: "epsilon2k26@gmail.com" }
    ],
    email: "epsilon2k26@gmail.com",
    prize: "Exciting Prizes",
    details: {
      description: [
        "What An Idea! is a startup pitch contest where participants present innovative products, services, or business solutions before a panel of industry experts and investors. Showcase ideas, receive expert feedback, and compete to prove your idea's market potential. Pitch your idea. Build the future. Innovate. Present. Succeed."
      ],
      rules: [
        "Ideas must be original. Plagiarism leads to immediate disqualification.",
        "Teams of 1-3 members. Cross-department teams allowed.",
        "Presentation must be in PPT/PDF format on a pen drive.",
        "Participants must report to the venue at least 15 minutes before their slot.",
        "Time limits are strictly enforced for each round.",
        "Use of mobile phones during presentations is strictly prohibited.",
        "Judges' decisions are final and binding.",
        "Formal dress code is mandatory. ID cards must be worn visibly.",
        "Offensive, illegal, or unethical ideas are not permitted."
      ],
      requirements: [
        "PPT/PDF on pen drive.",
        "Prototype optional but encouraged."
      ],
      specs: [
        "Round 2 PPT: max 8 slides with basic financial estimation."
      ],
      deliverables: ["Idea Pitch", "PPT Presentation", "Live Negotiation"],
      rounds: [
        {
          title: "Round 1 – Elevator Pitch",
          description: "3-minute verbal pitch (no PPT). Judges evaluate problem clarity, innovation, relevance, and communication. Top 10 teams qualify."
        },
        {
          title: "Round 2 – Market Validation",
          description: "5-min PPT presentation + 5-min Q&A with judges. Evaluated on feasibility, market demand, revenue model, scalability, and Q&A defense. Top 5 teams qualify."
        },
        {
          title: "Final Round – Live Negotiation",
          description: "Teams negotiate investment with judges as mock investors. Must ask for investment amount, offer equity, justify valuation, and negotiate the deal. Judges may counter-offer, reject, or offer conditional investment."
        }
      ],
      judgingCriteria: [
        { criterion: "Innovation & Originality", marks: 25 },
        { criterion: "Market Feasibility", marks: 25 },
        { criterion: "Presentation Skills", marks: 20 },
        { criterion: "Negotiation Skill", marks: 20 },
        { criterion: "Investment Worthiness", marks: 10 }
      ],
      duration: "9:30 AM – 4:00 PM"
    },
    note: "Registration open soon. Cross-department and inter-college participation welcome.",
    gradient: ["#FF1744", "#8B0000"],
    poster: "/posters/whatanidea.jpeg",
    brochure: "/brochures/Whatanidea.pdf"
  },

  {
    id: "thinklink",
    title: "THINKLINK",
    subtitle: "WHERE MEMORY MEETS CREATIVITY",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/Lw5Y2RCfCNRHogUv5",
    meta: {
      topic: "Memory, Communication & Creativity",
      teamSize: "3 members per team"
    },
    date: "16 March 2026",
    time: "10:00 AM",
    venue: "Main Block, First Floor – CR2",
    coordinators: [
      { name: "Steve Vincili S", phone: "9025172801" },
      { name: "Keerthivasan S", phone: "9025172801" }
    ],
    email: "epsilon2k26@gmail.com",
    details: {
      description: [
        "ThinkLink is an engaging non-technical event designed to challenge memory, teamwork, creativity, and stage presence through a series of fun and interactive rounds. It provides a vibrant platform for participants to think smart, act fast, and collaborate effectively. More than just a competition — ThinkLink is an exciting blend of observation, communication skills, humour, and confidence. Where Memory Meets Creativity."
      ],
      rules: [
        "Each team must consist of exactly 3 members. All members actively participate in Round 1.",
        "Round 2 is conducted with 2 members from the team.",
        "Round 3 requires the entire team.",
        "Individual performances are not permitted.",
        "Registration on first come, first serve basis. Late arrivals may be disqualified.",
        "Participants must maintain respectful and friendly behaviour toward judges, volunteers, and other teams.",
        "Offensive jokes, inappropriate actions, or misconduct will lead to disqualification.",
        "Props or costumes may be used only if appropriate and non-offensive.",
        "Mobile phones or unauthorized materials are not allowed during rounds unless permitted.",
        "Any cheating or misconduct results in immediate disqualification.",
        "Judges' decisions are final and binding."
      ],
      requirements: [
        "Neat casual dress recommended. Comfortable footwear suitable for indoor movement.",
        "Teams must report at their assigned time slot."
      ],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Round 1 – Memory Challenge",
          description: "All 3 team members observe and recall details with accuracy and attention. Tests memory, observation, and recall speed. (30 marks)"
        },
        {
          title: "Round 2 – Team Communication",
          description: "2 members participate. Silent lip-reading and non-verbal communication challenge. Tests coordination and clarity of silent communication. (30 marks)"
        },
        {
          title: "Round 3 – Creativity & Humour",
          description: "Entire team performs a fun product pitch on the stage. Judged on creativity, humour, confidence, and presentation skills. (40 marks)"
        }
      ],
      judgingCriteria: [
        { criterion: "Round 1 – Memory Accuracy", marks: 30 },
        { criterion: "Round 2 – Communication Clarity", marks: 30 },
        { criterion: "Round 3 – Creativity & Performance", marks: 40 }
      ],
      duration: "Starting 10:00 AM"
    },
    note: "Observe, connect, and entertain. The most creative team wins!",
    gradient: ["#FF6A00", "#FF1493"],
    poster: "/posters/thinklink.jpeg",
    brochure: "/brochures/thinkLink.pdf"
  },

  {
    id: "blackout-survival-challenge",
    title: "BLACKOUT SURVIVAL CHALLENGE",
    subtitle: "THINK FAST · REACT SMART · SURVIVE",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/yNRFeMDjYG4baVcM6",
    meta: {
      topic: "Strategy + Role Play Challenge",
      teamSize: "Max 3 members per team"
    },
    date: "16 March 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "CR4, First Floor (Main Block)",
    coordinators: [
      { name: "Prabakaran M", phone: "8925704723" },
      { name: "S.Sabari", phone: "7904150731" }
    ],
    email: "epsilon2k26@gmail.com",
    details: {
      description: [
        "Blackout Survival Challenge is an engaging strategy-based survival event designed to test participants' teamwork, crisis management, and spontaneous thinking skills. The event simulates unexpected power failure scenarios where teams must act quickly, solve tasks, and creatively respond to challenging situations. It is not just a game — it is a test of coordination, logic, adaptability, and smart decision-making under pressure. Think Fast. React Smart. Survive the Blackout."
      ],
      rules: [
        "Maximum 3 members per team. Open to all departments. Inter-college teams allowed. No individual participation.",
        "Registration on first come, first serve basis. Limited slots available.",
        "Once registered, team members cannot be changed.",
        "Participants must maintain discipline and respect throughout the event.",
        "Mobile phones are not allowed unless permitted by organizers.",
        "Any form of malpractice will result in immediate disqualification.",
        "Evidence materials, clues, or props must not be damaged.",
        "Arguments and conflicts will not be tolerated.",
        "The jury's decision will be final and binding."
      ],
      requirements: [
        "No special preparation needed — spontaneous thinking and teamwork are key."
      ],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Round 1 – Power Grid Rush",
          description: "Snake & Ladder styled game board. Teams roll a dice and move accordingly. Each box has a blackout-related task (mandatory completion). Landing on a Ladder = move up + complete task + 1 bonus mark. Landing on a Snake = move down + complete task – 1 penalty mark. No task can be skipped."
        },
        {
          title: "Round 2 – Current Confusion",
          description: "Each team picks one blackout scenario chit. 2 minutes preparation time. Teams perform a 2–3 minute role play. All 3 members must actively participate. Performance must clearly relate to the given blackout scenario."
        }
      ],
      judgingCriteria: [
        { criterion: "Round 1 – Task Completion", marks: 20 },
        { criterion: "Round 1 – Accuracy & Clarity", marks: 10 },
        { criterion: "Round 1 – Team Coordination", marks: 10 },
        { criterion: "Round 1 – Strategy & Smart Play", marks: 10 },
        { criterion: "Round 2 – Creativity", marks: 20 },
        { criterion: "Round 2 – Expression & Confidence", marks: 10 },
        { criterion: "Round 2 – Team Coordination", marks: 10 },
        { criterion: "Round 2 – Audience Engagement", marks: 10 }
      ],
      duration: "10:00 AM – 1:00 PM"
    },
    note: "Stay calm in the dark and think smart. Limited slots — register early!",
    gradient: ["#800000", "#FF4500"], // changed to be more visible instead of black
    poster: "/posters/blackout.jpeg",
    brochure: "/brochures/blackout.pdf"
  },

  {
    id: "human-ludo",
    title: "HUMAN LUDO",
    subtitle: "BE THE COIN · PLAY THE GAME",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/mwj8LjzEMPSzV9Bd9",
    meta: {
      topic: "Strategy & Team Play",
      teamSize: "3–4 members per team"
    },
    date: "16 March 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "Machines Lab, Ground Floor (Main Block)",
    coordinators: [
      { name: "Bootharajan", phone: "8870645437" },
      { name: "Manoj", phone: "8807999672" }
    ],
    email: "epsilon2k26@gmail.com",
    details: {
      description: [
        "Human Ludo is an interactive team-based event where participants act as live tokens on a giant Ludo board. The game blends physical movement, quick thinking, and teamwork with exciting challenge-based tasks at every box. Four teams compete simultaneously on a life-size board drawn inside the Machines Lab. Be the Coin. Play the Game. Own the Board."
      ],
      rules: [
        "Each team must consist of 3–4 members. Four teams per match (Red, Blue, Green, Yellow).",
        "Participants act as tokens on the giant Ludo board.",
        "Teams take turns rolling a dice. Movement is clockwise.",
        "Each box contains a challenge/question. 30 seconds allowed per challenge.",
        "Failure to complete a challenge results in moving back 1–2 boxes.",
        "Landing on an opponent's token sends them back to start.",
        "No running or pushing inside the lab.",
        "Mobile phones are prohibited.",
        "Team changes are not allowed after registration.",
        "First come, first serve basis. Teams must report 30 minutes before the event.",
        "Judges' decisions are final and binding."
      ],
      requirements: [
        "Physical readiness for indoor movement.",
        "Follow lab safety regulations at all times."
      ],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Main Game – Giant Ludo",
          description: "Life-size Ludo on a drawn board in Machines Lab. Participants are the tokens. Each box has a task/question. Duration per match: 20–30 minutes."
        },
        {
          title: "Tie-Breaker (if needed)",
          description: "MCQ Tie-Breaker Round conducted if teams are tied at the end of regulation play."
        }
      ],
      judgingCriteria: [
        { criterion: "Position on Board", marks: null },
        { criterion: "Accuracy of Answers", marks: null },
        { criterion: "Team Coordination", marks: null },
        { criterion: "Discipline & Fair Play", marks: null }
      ],
      duration: "10:00 AM – 1:00 PM | 20–30 min per match"
    },
    note: "Where Strategy Meets Fun! Limited slots. Register early.",
    gradient: ["#00B4DB", "#0083B0"],
    poster: "/posters/humanludo.jpeg",
    brochure: "/brochures/humanludo.pdf"
  },

  {
    id: "d2-investigation-challenge",
    title: "D² – DETECT THE DISRUPTOR",
    subtitle: "INVESTIGATE · ANALYSE · SOLVE",
    category: "Non-Technical",
    registrationLink: "https://forms.gle/HD2KL1ynJK3YGUe28",
    meta: {
      topic: "Investigation + Debugging Challenge",
      teamSize: "Max 3 members per team"
    },
    date: "16 March 2026",
    time: "9:00 AM – 1:00 PM",
    venue: "Power Electronics Laboratory(Main Block)",
    coordinators: [
      { name: "Dronaditya S", phone: "8122056031" },
      { name: "Suhail", phone: "8122781495" }
    ],
    email: "epsilon2k26@gmail.com",
    details: {
      description: [
        "D² – Detect the Disruptor is an interactive investigation-based event designed to test participants' analytical thinking, problem-solving ability, and teamwork. Participants go through multiple rounds where they must analyse clues, identify problems, debug challenges, and ultimately determine the disruptor behind the case. This event combines logic, investigation, and technical reasoning. The Truth is Buried. The Clock is Ticking. In the Shadows, Truth Waits."
      ],
      rules: [
        "Maximum 3 members per team. Inter-college teams allowed. No individual participation.",
        "Early arrivals get priority. Limited number of teams allowed.",
        "Once registered, team members cannot be changed.",
        "Participants must report to the venue at least 30 minutes before the event begins.",
        "All materials for each challenge will be provided by organizers.",
        "Participants must complete assigned challenges within the given time limit.",
        "Any form of malpractice, copying, or unfair practices is strictly prohibited.",
        "Mobile phones or external help may not be allowed unless permitted.",
        "Teams must maintain discipline and cooperate with the organizing committee.",
        "The decision of the judges and organizers will be final and binding."
      ],
      requirements: [
        "Analytical thinking and logical reasoning.",
        "Ability to work under time pressure as a team."
      ],
      specs: [],
      deliverables: [],
      rounds: [
        {
          title: "Round 1 – Case Investigation",
          description: "Teams analyse a set of clues and evidence to understand the case scenario. Tests observation and logical deduction."
        },
        {
          title: "Round 2 – Debugging Challenge",
          description: "Teams identify and debug technical and logical faults within given materials or scenarios. Speed and accuracy are critical."
        },
        {
          title: "Round 3 – Judgement Hour",
          description: "Teams present their findings and identify the Disruptor. Evaluated on clarity of reasoning, accuracy of conclusion, and presentation quality."
        }
      ],
      judgingCriteria: [
        { criterion: "Problem Analysis & Logical Reasoning", marks: null },
        { criterion: "Debugging Accuracy", marks: null },
        { criterion: "Teamwork & Time Management", marks: null },
        { criterion: "Final Presentation Clarity", marks: null }
      ],
      duration: "9:00 AM – 1:00 PM"
    },
    note: "Think like an investigator. The truth is in the details.",
    gradient: ["#6A11CB", "#2575FC"],
    poster: "/posters/d2.jpeg",
    brochure: "/brochures/D2.pdf"
  }

];

export default events;
