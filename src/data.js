// All content comes from Swaral's CV. Edit here to update the site.

export const profile = {
  firstName: 'Swaral',
  lastName: 'Gaur',
  eyebrow: 'Code · Machine Learning · LLMs',
  tagline: 'Building thoughtful software with language models',
  location: 'Jalandhar, Punjab, India',
  email: 'swaral.gaur123@gmail.com',
  resume: '/Swaral_Gaur_Resume.pdf',
  links: [
    { label: 'GitHub', handle: '@swaral', href: 'https://github.com/swaral?tab=repositories' },
    { label: 'LinkedIn', handle: 'Swaral Gaur', href: 'https://www.linkedin.com/in/swaral-gaur-aa52a91a5/' },
    { label: 'LeetCode', handle: '60+ problems solved', href: 'https://leetcode.com/u/user7059Oz/' },
  ],
}

export const about = [
  "I'm an M.Tech Computer Science student at Dr B R Ambedkar NIT Jalandhar, and before that I spent over two years as a Programmer Analyst at Cognizant, building features for Pacific Life's customer-facing website.",
  'Today I build with React and Python and experiment with large language models, from AI-powered interview practice to unsupervised rank aggregation for LLM recommenders.',
]

export const education = [
  {
    degree: 'M.Tech, Computer Science & Engineering',
    school: 'Dr B R Ambedkar National Institute of Technology, Jalandhar',
    period: '2025 – Present',
    place: 'Punjab, India',
    score: 'CGPA 6.61',
  },
  {
    degree: 'B.Tech, Electronics & Communication Engineering',
    school: 'Jaypee Institute of Information Technology, Noida (Sector 62)',
    period: '2017 – 2021',
    place: 'Uttar Pradesh, India',
    score: 'CGPA 6.4',
  },
]

export const experience = [
  {
    company: 'Cognizant Technology Solutions',
    role: 'Programmer Analyst',
    client: 'Client: Pacific Life',
    clientHref: 'https://www.pacificlife.com/',
    period: 'Feb 2021 – Sep 2023',
    place: 'Bengaluru',
    points: [
      "Started as a Programmer Analyst Trainee (Feb – Aug 2021), completing Cognizant's technical training before client deployment.",
      "Designed and implemented enhancements to the client's customer-facing website and maintained business-critical systems.",
      'Collaborated with cross-functional teams for 21 months to analyse business requirements and turn them into website changes.',
    ],
    tags: ['Web', 'Enterprise', 'Agile'],
  },
  {
    company: 'Bharat Sanchar Nigam Limited (BSNL)',
    role: 'Telecommunication Intern',
    period: 'May 2018 – Jun 2018',
    place: 'Kanpur, UP',
    points: [
      'Trained on telecom exchange equipment and concepts: modulation techniques, multiplexers, encoders and decoders.',
    ],
    tags: ['Telecom', 'Hardware'],
  },
]

export const projects = [
  {
    title: 'AI Mock Interview Platform',
    flow: 'voice → transcript → feedback',
    year: '2026',
    summary:
      'A React app that runs spoken technical and HR interview rounds with live speech-to-text, AI follow-up questions, and about 65% of questions generated from your own CV.',
    points: [
      'Gemini API for CV scoring (ATS, clarity, impact) and per-answer evaluation, with automatic model fallback on 429/503 errors and a rule-based offline mode.',
      'On-device eye-contact and face tracking (MediaPipe), filler-word and speaking-pace analysis, a coding round, and a downloadable PDF report.',
    ],
    stack: ['React', 'Vite', 'Gemini API', 'MediaPipe', 'Web Speech API', 'Monaco Editor'],
    live: 'https://mock-interview-ai-8064.netlify.app',
    code: 'https://github.com/swaral?tab=repositories',
    hue: 'coral',
  },
  {
    title: 'LLM-Based Session Recommendation',
    flow: 'session → 4 prompts → RWRA rank',
    year: '2026',
    summary:
      'A reproducible cross-domain framework for next-item session recommendation on MovieLens-1M and Amazon Video Games, with chronological leave-one-out evaluation over 20-item candidate pools.',
    points: [
      "Designed Reliability-Weighted Rank Aggregation (RWRA): an unsupervised ensemble that measures per-session agreement between four prompt variants with Kendall's τ and down-weights outlier rankings, with no training or labels.",
      'Evaluated 6,040 user sessions with HR@1/5/10, NDCG@5/10 and per-session drift scores.',
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'SciPy', 'PyTest', 'Ollama', 'Qwen2.5-3B'],
    code: 'https://github.com/swaral?tab=repositories',
    hue: 'violet',
  },
  {
    title: 'AI Fitness & Nutrition Tracker',
    flow: 'log → track → AI coach → report',
    year: '2026',
    summary:
      'An Android app built with React Native (Expo) that tracks food, gym, running and kickboxing in one place, with AI nutrition estimates, a daily AI coach and automatic 20-day PDF reports.',
    points: [
      'Gemini API fills in calories, protein, carbs and fat from a typed meal ("2 rotis with dal") or from nutrition-label text read by OCR, returning structured JSON with a fallback when AI is unavailable.',
      'Built-in 10-week push/pull/legs gym plan and a 12-week track running plan in 3 levels, with voice-guided sessions, GPS run tracking (distance, pace, per-km splits, route shape) and a screen lock for running.',
      'Calorie goal from the Mifflin-St Jeor BMR formula, daily and weekly AI coach reviews, and PDF reports generated on the phone every 20 days, keeping the 3 newest.',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Gemini API', 'Expo Location', 'OCR.space', 'expo-print'],
    code: 'https://github.com/swaral?tab=repositories',
    hue: 'gold',
  },
]

export const skills = [
  { group: 'Languages', items: ['C', 'Python', 'JavaScript'] },
  { group: 'Web', items: ['HTML5', 'CSS3', 'React', 'Vite', 'REST APIs', 'Web Speech API'] },
  { group: 'AI / LLM', items: ['Gemini API', 'Ollama', 'Qwen2.5-3B-Instruct', 'Prompt Engineering', 'MediaPipe'] },
  { group: 'Data & Testing', items: ['Pandas', 'NumPy', 'SciPy', 'PyTest'] },
  { group: 'Tools', items: ['Git / GitHub', 'AWS', 'VS Code'] },
  { group: 'Core subjects', items: ['DSA', 'OOP', 'Operating Systems', 'DBMS', 'Machine Learning', 'Digital Logic'] },
]

export const achievements = [
  { value: 493, label: 'GATE CS 2025 score', prefix: '', suffix: '' },
  { value: 60, label: 'DSA problems solved on LeetCode', prefix: '', suffix: '+' },
  { value: 78187, label: 'All India Rank, JEE Main 2017', prefix: 'AIR ', suffix: '' },
  { icon: 'chess', label: 'National-level chess player (2014 – 2015)' },
  { icon: 'medal', label: 'Silver medal, Senior State Wushu Championship 2022' },
]
