import type { BlogPost, BlogCategory, BlogAuthor } from "@/types/blog";

/** Shared author for the current placeholder posts (data-driven so it can vary per post later). */
const DEFAULT_AUTHOR: BlogAuthor = {
  name: "Cameron Williamson",
  role: "Co-Founder @Boldteq",
  image: "/images/webflow/53ca939ea8306f9306c2a81fd38c72ba62512c86.png",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How Agencies Use White-Label Web Development Teams",
    slug: "how-agencies-use-white-label-web-development-teams",
    category: "web-development",
    image:
      "/images/webflow/cdn/695f69fd56c2e44fd26ba42e_1f99741be431e7b9a1b8d7e4ab585ef77077f493.png",
    shortDescription:
      "How agencies plug a white-label development team into their existing workflow to ship client websites faster — without the cost of hiring in-house.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-06-12T09:00:00Z",
    updatedAt: "2026-06-12T09:00:00Z",
    readingTime: 6,
    content: `
<h2>Why agencies turn to white-label development</h2>
<p>Most agencies hit the same wall: demand for builds grows faster than they can hire and train developers. A white-label team lets you take on more web projects under your own brand while a dedicated partner handles the production work behind the scenes.</p>
<h3>What a white-label team actually handles</h3>
<p>From responsive front-end builds and CMS setup to QA and launch, a good partner slots into your process rather than replacing it. You stay the single point of contact for the client; the delivery team stays invisible.</p>
<h2>Keeping delivery on-brand</h2>
<p>The difference between outsourcing and true white-label is ownership. Code, communication, and credit all carry your agency's name — so clients experience one consistent team, even as you scale output up and down with demand.</p>
`,
  },
  {
    title: "How White-Label CRO Services Help Agencies Convert",
    slug: "how-white-label-cro-services-help-agencies-convert",
    category: "cro",
    image:
      "/images/webflow/cdn/695f6916940a141c62ff83c9_f4f2ffedfaa99fee8f19eb210348959198b2a72a.png",
    shortDescription:
      "How white-label conversion-rate optimization lets agencies offer data-backed CRO to clients without building a specialist team in-house.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-06-05T09:00:00Z",
    updatedAt: "2026-06-05T09:00:00Z",
    readingTime: 5,
    content: `
<h2>CRO is a service clients keep asking for</h2>
<p>Once a site is live, clients want results — more signups, more sales, lower bounce. Conversion-rate optimization answers that, but it needs analytics, experimentation, and design skills few agencies keep on staff full time.</p>
<h3>How the white-label model works</h3>
<p>A white-label CRO partner runs the research, builds the test variants, and reports on lift — all under your brand. You present the wins to the client and own the relationship.</p>
<h2>Turning experiments into retainers</h2>
<p>Because optimization never really ends, CRO is one of the easiest services to package as a recurring retainer — predictable revenue for your agency and continuous improvement for the client.</p>
`,
  },
  {
    title: "How to Scale Agency Web Dev Without Hiring",
    slug: "how-to-scale-agency-web-dev-without-hiring",
    category: "web-development",
    image:
      "/images/webflow/cdn/695f68bdd2ba095a11c95203_c32a98f52cfeeb06e3c9c1ceb0d2ba9ae6c3d1b7.png",
    shortDescription:
      "Practical systems for scaling your agency's web development output through demand spikes — without the overhead and risk of full-time hires.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-05-28T09:00:00Z",
    updatedAt: "2026-05-28T09:00:00Z",
    readingTime: 5,
    content: `
<h2>Hiring is the slowest way to add capacity</h2>
<p>Recruiting, onboarding, and ramping a developer takes months — and a quiet quarter can turn that hire into a liability. Project demand rarely moves in straight lines, so fixed headcount is a blunt tool for a variable problem.</p>
<h3>Build a flexible delivery layer</h3>
<p>Treat production capacity as something you turn up or down. A white-label partner gives you senior developers on demand, so a sudden three-project month doesn't force a panic hire you'll regret later.</p>
<h2>Systems beat heroics</h2>
<p>Documented hand-offs, shared QA checklists, and clear scopes let you scale without your team burning out — and without quality slipping when volume jumps.</p>
`,
  },
  {
    title: "White Label vs Outsourcing: What's the Real Difference?",
    slug: "white-label-vs-outsourcing-whats-the-real-difference",
    category: "white-label-outsourcing",
    image:
      "/images/webflow/cdn/695f68d5bc5b1d2faf7c3494_cdcd25abc4147c93ede9d5c0bf1e81ed8f5070ba.png",
    shortDescription:
      "White-label and outsourcing get used interchangeably, but they protect very different things. Here's how to tell them apart and pick the right model.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
    readingTime: 4,
    content: `
<h2>The terms aren't interchangeable</h2>
<p>Outsourcing means handing work to a third party. White-label means that third party works invisibly under your brand. Every white-label arrangement is outsourcing, but not every outsourcing arrangement is white-label.</p>
<h3>Who the client thinks they're working with</h3>
<p>With plain outsourcing, the vendor may talk to your client directly and put their own name on the work. With white-label, the client only ever sees your agency — the partner never breaks the fourth wall.</p>
<h2>Choosing the right model</h2>
<p>If client trust and brand control matter, white-label is worth the extra coordination. If you just need a one-off task done cheaply, straightforward outsourcing may be enough.</p>
`,
  },
  {
    title: "White-Label Shopify Development: Why Agencies Outsource",
    slug: "white-label-shopify-development-why-agencies-outsource",
    category: "shopify",
    image:
      "/images/webflow/cdn/695f695d822e4b695fec83f2_62826d4606184c7a100f33f714c28948f53e25f6.png",
    shortDescription:
      "Why more agencies hand Shopify builds to a white-label partner — and how to keep theme quality, app integrations, and store performance high.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-05-12T09:00:00Z",
    updatedAt: "2026-05-12T09:00:00Z",
    readingTime: 6,
    content: `
<h2>Shopify looks simple until it isn't</h2>
<p>Spinning up a basic store is easy; building a fast, custom theme with the right apps, checkout tweaks, and integrations is specialist work. Agencies that take on Shopify casually often underestimate the Liquid and performance details.</p>
<h3>What a white-label Shopify partner brings</h3>
<p>Theme development, app configuration, migrations, and speed optimization handled by people who do it every day — delivered under your brand, on your timeline.</p>
<h2>Protecting store performance</h2>
<p>Conversion on commerce sites lives and dies on speed. A dedicated partner keeps Core Web Vitals healthy and the checkout friction-free, so your client's revenue isn't quietly leaking.</p>
`,
  },
  {
    title: "White-Label UI/UX Design: A Complete Guide for Agencies",
    slug: "white-label-ui-ux-design-a-complete-guide-for-agencies",
    category: "ui-ux-design",
    image:
      "/images/webflow/cdn/695f69dddaee4341ede966d5_a994d403aef97ae290a90af19570268925b45785.png",
    shortDescription:
      "A complete guide to offering UI/UX design under your own brand through a white-label partner — from discovery and wireframes to developer handoff.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-05-04T09:00:00Z",
    updatedAt: "2026-05-04T09:00:00Z",
    readingTime: 7,
    content: `
<h2>Design is where trust is won or lost</h2>
<p>Clients judge an agency on how the work looks and feels. White-label UI/UX lets you put senior product designers in front of every project without carrying that talent on payroll.</p>
<h3>A process clients can follow</h3>
<p>Discovery, user flows, wireframes, high-fidelity UI, and a clean developer handoff — each stage runs under your brand, with deliverables your clients can review and approve.</p>
<h2>Consistency across every deliverable</h2>
<p>A shared design system keeps fonts, spacing, and components consistent whether you ship one screen or fifty — so the work always reads as one cohesive product.</p>
`,
  },
  {
    title: "Scaling WordPress Delivery: A White-Label Playbook for Agencies",
    slug: "scaling-wordpress-delivery-white-label-playbook-for-agencies",
    category: "wordpress",
    image:
      "/images/webflow/cdn/695f68bdd2ba095a11c95203_c32a98f52cfeeb06e3c9c1ceb0d2ba9ae6c3d1b7.png",
    shortDescription:
      "A repeatable playbook for delivering WordPress builds at scale under your brand — from page builders and custom themes to maintenance retainers.",
    author: DEFAULT_AUTHOR,
    publishedAt: "2026-04-26T09:00:00Z",
    updatedAt: "2026-04-26T09:00:00Z",
    readingTime: 5,
    content: `
<h2>WordPress still wins a huge share of briefs</h2>
<p>It powers a large slice of the web, and clients keep asking for it. The challenge for agencies is delivering WordPress consistently — across page builders, custom themes, and plugin stacks — without it becoming a maintenance headache.</p>
<h3>Standardize the stack</h3>
<p>A white-label partner who works to a defined stack (a chosen builder, hosting, and security baseline) turns every WordPress project into a repeatable build instead of a one-off experiment.</p>
<h2>Maintenance is the recurring revenue</h2>
<p>Updates, backups, and security monitoring make natural retainers. Packaging ongoing care alongside the build keeps clients protected and gives your agency predictable monthly income.</p>
`,
  },
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "all", name: "All" },
  {
    slug: "cro",
    name: "CRO",
    description:
      "Conversion-rate optimization for agencies — research, experimentation, and the data behind higher-converting client sites.",
  },
  {
    slug: "shopify",
    name: "Shopify",
    description:
      "White-label Shopify development — themes, apps, migrations, and store performance, delivered under your brand.",
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    description:
      "UI/UX design insights for agencies — discovery, wireframes, design systems, and clean developer handoff.",
  },
  {
    slug: "web-development",
    name: "Web Development",
    description:
      "How agencies scale web development output with white-label teams — process, quality, and delivery without hiring.",
  },
  {
    slug: "white-label-outsourcing",
    name: "White-Label & Outsourcing",
    description:
      "The white-label and outsourcing models for agencies — how to scale delivery while protecting client relationships.",
  },
  {
    slug: "wordpress",
    name: "WordPress",
    description:
      "Delivering WordPress at scale under your brand — page builders, custom themes, security, and maintenance retainers.",
  },
];

/** Single source of truth for category slug → display label (derived from BLOG_CATEGORIES). */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  BLOG_CATEGORIES.map((c) => [c.slug, c.name]),
);

/** Resolve a category slug to its display label, falling back to the raw slug. */
export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}
