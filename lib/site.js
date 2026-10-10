// All portfolio content lives here. Edit this file to make changes.

export const site = {
  name: "Raj",
  fullName: "Raj Tiwari",
  brand: { first: "Raj", second: "Tiwari" },
  role: "Technical Lead & Senior Backend Engineer",
  tagline: "I build the backend systems that brands run on.",
  intro:
    "Technical Lead with 10+ years designing and scaling enterprise web applications in Laravel, PHP, Node.js and Next.js: ERP, CRM, CMS, SaaS and e-commerce platforms, REST APIs, AI integration, workflow automation and AWS infrastructure. I lead teams and own systems end to end, from schema to deployment.",
  location: "New Delhi, India",
  timezone: "Asia/Kolkata",
  tzLabel: "IST",
  status: "Available: full-time · part-time · contract · freelance",
  email: "rajtiwariyng@gmail.com",
  phone: "917827795334", // WhatsApp number with country code, digits only
  cv: "/Raj-Tiwari-Resume.pdf",
  photo: "/img/raj.webp",
  socials: {
    github: "https://github.com/rajtiwariyng",
    linkedin: "https://www.linkedin.com/in/rajkrtiwari/",
  },
  badges: ["Technical Lead @ Abhikant Digital Ads", "Laravel & PHP", "Node.js", "AI Integration", "AWS & DevOps", "10+ Years"],
  stats: [
    { value: "10+", label: "years building backends", icon: "clock" },
    { value: "80+", label: "projects delivered", icon: "layers" },
    { value: "15+", label: "developers led", icon: "smile" },
    { value: "16", label: "live platforms", icon: "globe" },
    { value: "40+", label: "technologies", icon: "tool" },
    { value: "5", label: "teams", icon: "bolt" },
  ],
  about: [
    "I'm Raj Tiwari, a Senior Backend Developer with over a decade of experience building and maintaining production-grade web applications. My primary expertise is in Laravel and PHP, where I design clean, secure and scalable backend architectures for e-commerce, CMS and enterprise platforms.",
    "Alongside PHP I work with Node.js and Python for automation, microservices, scripting and data-driven workflows, choosing the right tool based on the problem, not preference. In recent years my focus has shifted toward backend automation, AI API integrations and data extraction pipelines: systems that automate repetitive processes and handle large-scale data processing to improve operational efficiency.",
    "I have hands-on experience managing AWS infrastructure, optimising application performance and deploying secure, scalable systems using modern DevOps practices. I'm comfortable owning projects end to end, from system design and development through to deployment, monitoring and optimisation.",
  ],
};

export const rooms = [
  {
    id: "work",
    name: "Work Studio",
    href: "/profile#case-studies",
    cta: "See the work",
    desc: "16 live platforms from 10 years of builds: Lacoste India, Kama Ayurveda, Hero FinCorp, TOTO India, Dulux Professional and more.",
  },
  {
    id: "tools",
    name: "Tool Shop",
    href: "/tools",
    cta: "Open the free tools",
    desc: "Free browser tools that never upload your files: JSON formatter, Base64 encoder, word counter, case converter and more.",
  },
  {
    id: "blog",
    name: "Newsroom",
    href: "/blog",
    cta: "Read the blog",
    desc: "Notes on Laravel, PHP, APIs, automation and AI integration: practical guides for people who build backends.",
  },
  {
    id: "games",
    name: "Game Room",
    href: "/games",
    cta: "Play a game",
    desc: "Take a break: Snake, Memory Match and more. Small, fast, no sign-up.",
  },
  {
    id: "cabin",
    name: "Raj's Cabin",
    href: "/profile",
    cta: "View full profile",
    desc: "Meet the person behind the office: experience, skills, how I work and how to work together.",
  },
];

// Live platforms. Screenshots are in /public/work.
export const work = [
  { name: "Lacoste India", type: "E-commerce", url: "https://www.lacoste.in/", img: "/work/locoste.webp" },
  { name: "Kama Ayurveda", type: "E-commerce", url: "https://www.kamaayurveda.in/", img: "/work/kama.webp" },
  { name: "Hero FinCorp", type: "Financial services", url: "https://www.herofincorp.com/", img: "/work/hero.webp", desc: "Lending and financial services platform." },
  { name: "TOTO India", type: "Corporate", url: "https://in.toto.com/", img: "/work/toto.webp" },
  { name: "Dulux Professional", type: "Corporate", url: "https://www.duluxprofessional.com/in/en", img: "/work/duluxprofessional.webp" },
  { name: "Merino Laminates", type: "E-commerce", url: "https://www.merinolaminates.com/en/", img: "/work/merinolaminates.webp" },
  { name: "Giftopia", type: "E-commerce", url: "https://www.giftopia.in/", img: "/work/giftopia.webp" },
  { name: "Cottons & Satins", type: "E-commerce", url: "https://cottonsandsatins.com/", img: "/work/cottonsandsatins.webp" },
  { name: "FOS Lighting", type: "E-commerce", url: "https://www.foslighting.in/", img: "/work/fslight.webp" },
  { name: "Flowershut", type: "E-commerce", url: "https://flowershut.com/", img: "/work/flowershut.webp" },
  { name: "Wallart India", type: "Corporate", url: "https://wallartindia.com/", img: "/work/wallartindia.webp" },
  { name: "APCA Malaysia", type: "Corporate", url: "http://apcamalaysia.com/", img: "/work/apcamalaysia.webp" },
  { name: "Manish Anil Gupta", type: "Corporate", url: "https://www.manishanilgupta.com/", img: "/work/manish.webp" },
  { name: "Aethyrtech", type: "Corporate", url: "https://aethyrtech.ai/", img: "/work/aethyrtech.webp" },
  { name: "Asteria", type: "Corporate", url: "https://asteria.co.in/", img: "/work/asteria.webp" },
  { name: "Chanderpur", type: "Corporate", url: "https://www.chanderpur.com/", img: "/work/chanderpur.webp" },
];

export const experience = [
  {
    role: "Technical Lead",
    company: "Abhikant Digital Ads Pvt. Ltd.",
    period: "Dec 2023 — Present",
    points: [
      "Lead a team of backend developers delivering enterprise-grade web applications.",
      "Design scalable backend architecture using Laravel, PHP, Node.js and CodeIgniter.",
      "Develop secure REST APIs, payment gateway integrations and third-party services.",
      "Manage AWS infrastructure, Docker deployments, CI/CD pipelines and production environments.",
      "Mentor developers, conduct code reviews and establish engineering best practices.",
      "Collaborate directly with clients to gather requirements and deliver scalable business solutions.",
    ],
  },
  {
    role: "Senior Backend Developer",
    company: "Karmatech Mediaworks Pvt. Ltd.",
    period: "Jul 2019 — Dec 2023",
    points: [
      "Developed enterprise ERP, CRM, CMS, SaaS and e-commerce applications using Laravel and PHP.",
      "Designed scalable REST APIs and integrated payment gateways and third-party services.",
      "Built AI-powered automation workflows, reporting systems and backend processing pipelines.",
      "Developed large-scale data extraction and web crawling solutions.",
      "Managed AWS cloud infrastructure including EC2, RDS, S3 and deployment pipelines.",
      "Improved application performance, database optimisation and system scalability.",
    ],
  },
  {
    role: "Senior Magento Developer",
    company: "Vasudev Accounting Pvt. Ltd.",
    period: "Jul 2018 — Jun 2019",
    points: [
      "Developed and customised Magento modules, extensions and themes.",
      "Delivered enterprise e-commerce solutions with improved performance and scalability.",
      "Optimised checkout workflows, application performance and user experience.",
    ],
  },
  {
    role: "Magento Developer",
    company: "Techpapa Pvt. Ltd.",
    period: "Jan 2018 — Jul 2018",
    points: [
      "Developed custom Magento modules and maintained enterprise e-commerce applications.",
      "Implemented frontend customisations and resolved production issues.",
      "Collaborated with clients to deliver high-quality solutions.",
    ],
  },
  {
    role: "Magento Developer",
    company: "YNG Media Pvt. Ltd.",
    period: "Jun 2016 — Dec 2017",
    points: [
      "Developed Magento-based e-commerce applications and custom modules.",
      "Customised themes and integrated third-party APIs.",
      "Enhanced application performance and backend functionality.",
    ],
  },
  {
    role: "B.Tech",
    company: "Guru Gobind Singh College of Engineering, Punjab Technical University",
    period: "2010 — 2014",
    points: [],
  },
];

export const techStack = {
  Backend: ["Laravel", "PHP", "Node.js", "Express.js", "CodeIgniter", "Python"],
  Frontend: ["Next.js", "Vue.js", "JavaScript (ES6+)", "HTML5 / CSS3", "Bootstrap", "jQuery"],
  "Databases, Search & Cache": ["MySQL", "PostgreSQL", "MongoDB", "Elasticsearch", "Redis"],
  "APIs & Security": ["REST APIs", "OAuth", "JWT", "Webhooks", "Payment Gateways"],
  "AI & Automation": ["OpenAI API", "Claude API", "AI Chatbots", "Workflow Automation", "Queues & Cron Jobs", "Data Extraction", "Web Crawling"],
  "Cloud & DevOps": ["AWS EC2 / S3 / RDS / SES", "Docker", "CI / CD", "Linux", "Nginx / Apache", "SSL", "Git"],
  "CMS & E-commerce": ["Magento", "Shopify", "WordPress", "OpenCart", "Drupal"],
};

export const services = [
  {
    title: "Backend Architecture",
    desc: "Clean, secure, scalable backend structure for platforms that have to keep working as the business grows: schema design, business logic, query tuning and performance under load.",
    tags: ["Laravel", "PHP", "CodeIgniter", "MySQL", "MongoDB"],
  },
  {
    title: "API & Integration Engineering",
    desc: "The connective tissue between a product and everything it depends on: payments, shipping and logistics, messaging, and the ERP or CRM the business already runs.",
    tags: ["REST APIs", "Razorpay", "Stripe", "Logistics APIs", "SMS / Email / WhatsApp", "ERP & CRM"],
  },
  {
    title: "E-commerce Platform Engineering",
    desc: "Storefronts and marketplaces at brand scale: extension and module development, custom checkout and catalogue logic, and end-to-end implementations rather than theme work.",
    tags: ["Magento", "Shopify", "WordPress", "OpenCart"],
  },
  {
    title: "Automation & Data Pipelines",
    desc: "Systems that remove repetitive work: queues and schedulers, web crawling and data extraction, and large-scale processing that keeps operational data moving without anyone touching it.",
    tags: ["Queues", "Schedulers", "Web Crawling", "Python", "Node.js"],
  },
  {
    title: "AI Integration",
    desc: "AI wired into real business workflows rather than bolted on: API integration, chatbots, text processing and automation that measurably reduces manual effort.",
    tags: ["AI APIs", "Chatbots", "Text Processing", "Workflow Automation"],
  },
  {
    title: "Cloud & Deployment",
    desc: "Provisioning, hardening and deployment on AWS, with the pipelines and monitoring that keep a release boring, plus ownership of the system after it goes live.",
    tags: ["AWS", "Docker", "Nginx / Apache", "CI / CD", "Linux"],
  },
];

export const process = [
  { title: "Understand", desc: "Map the business logic and the data before writing any code." },
  { title: "Architect", desc: "Design a clean, secure structure that still makes sense at scale." },
  { title: "Build", desc: "Use the right tool for the problem, not the most familiar one." },
  { title: "Test", desc: "Verify behaviour, edge cases and every integration point." },
  { title: "Optimise", desc: "Profile queries, caching and performance until it holds under load." },
  { title: "Deploy", desc: "Ship to AWS with monitoring, and own it after launch." },
];

// Placeholder posts: replace with real articles (or remove the Newsroom room).
export const posts = [
  { title: "Laravel queues in production: a practical checklist", date: "2026-09-28", tag: "Laravel", read: "6 min" },
  { title: "Designing payment gateway integrations that don't break", date: "2026-09-14", tag: "APIs", read: "8 min" },
  { title: "Magento performance: where the time actually goes", date: "2026-08-30", tag: "Magento", read: "5 min" },
  { title: "Web crawling at scale with queues and schedulers", date: "2026-08-12", tag: "Automation", read: "7 min" },
  { title: "Wiring AI APIs into real business workflows", date: "2026-07-25", tag: "AI", read: "9 min" },
  { title: "A boring AWS deployment is a good AWS deployment", date: "2026-07-02", tag: "AWS", read: "4 min" },
];
