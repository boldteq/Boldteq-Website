/* ============================================================
   Careers data — extracted from careers-tabs so both the client
   component AND the server page (JobPosting JSON-LD) can use it.
   ============================================================ */

export interface JobListing {
  /** stable id used for the accordion anchor + JobPosting url (not derived from the title) */
  slug: string;
  title: string;
  type: string;
  /** schema.org employmentType */
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN";
  description: string;
  responsibilities: string[];
  requirements: string[];
}

/** Posting window for the JobPosting structured data (Google requires a future validThrough). */
export const JOB_POSTED_DATE = "2026-06-01";
export const JOB_VALID_THROUGH = "2026-12-31";

export const JOB_LISTINGS: JobListing[] = [
  {
    slug: "web-developer",
    title: "Web Developers (WordPress / Shopify / Webflow)",
    type: "Full Time | Remote",
    employmentType: "FULL_TIME",
    description:
      "We're looking for a versatile Web Developer experienced in building high-performance websites across WordPress, Shopify, and Webflow. You'll work closely with designers and product teams to deliver scalable, conversion-focused digital experiences.",
    responsibilities: [
      "Develop and maintain custom themes and plugins",
      "Build Shopify storefronts and custom features",
      "Optimize performance, SEO, and responsiveness",
      "Integrate third-party APIs and tools",
    ],
    requirements: [
      "2+ years experience with WordPress, Shopify, or Webflow",
      "Strong knowledge of HTML, CSS, JavaScript",
      "Experience with Liquid (Shopify) is a plus",
      "Ability to handle multiple projects independently",
    ],
  },
  {
    slug: "frontend-developer",
    title: "Frontend Developer (React / Next.js)",
    type: "Full Time | Remote",
    employmentType: "FULL_TIME",
    description:
      "We are hiring a Frontend Developer to build fast, scalable, and visually polished web applications using modern frameworks.",
    responsibilities: [
      "Develop UI components using React / Next.js",
      "Translate UI/UX designs into responsive code",
      "Optimize applications for speed and performance",
      "Collaborate with backend developers and designers",
    ],
    requirements: [
      "Strong experience with React.js and Next.js",
      "Good understanding of REST APIs",
      "Experience with Tailwind / modern CSS frameworks",
      "Eye for design and detail",
    ],
  },
  {
    slug: "shopify-app-developer",
    title: "Shopify App Developer",
    type: "Full Time | Remote",
    employmentType: "FULL_TIME",
    description:
      "Join us to build powerful, embedded Shopify apps used by merchants worldwide. You'll own features end-to-end across the Admin, Storefront, and Webhook APIs, partnering with our delivery team to ship reliable, scalable apps that hold up in production.",
    responsibilities: [
      "Develop and maintain Shopify apps",
      "Work with Shopify APIs (Admin, Storefront, Webhooks)",
      "Build embedded apps using Polaris",
      "Ensure app performance and scalability",
    ],
    requirements: [
      "Experience with Shopify app development",
      "Knowledge of Node.js / React",
      "Understanding of Shopify ecosystem",
      "Experience with app billing & OAuth",
    ],
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    type: "Full Time | Remote",
    employmentType: "FULL_TIME",
    description:
      "We're looking for a creative UI/UX Designer to craft intuitive and engaging user experiences.",
    responsibilities: [
      "Design wireframes, prototypes, and UI systems",
      "Conduct user research and usability testing",
      "Collaborate with developers for implementation",
      "Maintain design consistency across products",
    ],
    requirements: [
      "Strong portfolio (web/SaaS preferred)",
      "Experience with Figma / Adobe XD",
      "Understanding of UX principles",
      "Ability to think from a user-first perspective",
    ],
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    type: "Full Time | Remote",
    employmentType: "FULL_TIME",
    description:
      "We're hiring a performance-driven Digital Marketing Specialist to scale qualified traffic and conversions across SEO, paid, and lifecycle channels — turning data into measurable growth for Boldteq and our agency partners.",
    responsibilities: [
      "Manage SEO, PPC, and paid campaigns",
      "Analyze performance metrics",
      "Optimize funnels and landing pages",
      "Work with content and design teams",
    ],
    requirements: [
      "Experience with Google Ads / Meta Ads",
      "Strong analytical skills",
      "Knowledge of SEO tools",
      "Growth mindset",
    ],
  },
];
