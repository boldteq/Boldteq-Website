import type { BlogPost, BlogCategory } from "@/types/blog";

const SHARED_CONTENT = `
<h4>How Agencies Use White-Label Teams in Practice</h4>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<h4>How Agencies Use White-Label Teams in Practice</h4>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<h4>How Agencies Use White-Label Teams in Practice</h4>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<h4>How Agencies Use White-Label Teams in Practice</h4>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
<p>Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa. Massa dignissim massa justo sit bibendum velit sit. Ac ut quam donec imperdiet eget est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum venenatis et venenatis massa.</p>
`;

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How Agencies Use White-Label Web Development Teams",
    slug: "how-agencies-use-white-label-teams-in-practice-6",
    category: "web-development",
    image:
      "/images/webflow/cdn/695f69fd56c2e44fd26ba42e_1f99741be431e7b9a1b8d7e4ab585ef77077f493.png",
    shortDescription:
      "Practical perspectives on agency growth, white-label delivery, and execution systems — written for teams scaling client work.",
    publishedAt: "2026-04-08T12:54:29Z",
    updatedAt: "2026-04-08T12:53:10Z",
    content: SHARED_CONTENT,
  },
  {
    title: "How White-Label CRO Services Help Agencies Convert",
    slug: "how-white-label-cro-services-help-agencies-convert",
    category: "shopify",
    image:
      "/images/webflow/cdn/695f6916940a141c62ff83c9_f4f2ffedfaa99fee8f19eb210348959198b2a72a.png",
    shortDescription:
      "Practical perspectives on agency growth, white-label delivery, and execution systems — written for teams scaling client work.",
    publishedAt: "2026-04-08T12:54:29Z",
    updatedAt: "2026-04-08T12:53:52Z",
    content: SHARED_CONTENT,
  },
  {
    title: "How to Scale Agency Web Dev Without Hiring",
    slug: "how-to-scale-agency-web-dev-without-hiring",
    category: "web-development",
    image:
      "/images/webflow/cdn/695f68bdd2ba095a11c95203_c32a98f52cfeeb06e3c9c1ceb0d2ba9ae6c3d1b7.png",
    shortDescription:
      "Practical perspectives on agency growth, white-label delivery, and execution systems — written for teams scaling client work.",
    publishedAt: "2026-04-08T12:54:29Z",
    updatedAt: "2026-04-08T12:54:19Z",
    content: SHARED_CONTENT,
  },
  {
    title: "White Label vs Outsourcing: What's the Real Difference?",
    slug: "white-label-vs-outsourcing-whats-the-real-difference",
    category: "ui-ux-design",
    image:
      "/images/webflow/cdn/695f68d5bc5b1d2faf7c3494_cdcd25abc4147c93ede9d5c0bf1e81ed8f5070ba.png",
    shortDescription:
      "Practical perspectives on agency growth, white-label delivery, and execution systems — written for teams scaling client work.",
    publishedAt: "2026-04-08T12:54:29Z",
    updatedAt: "2026-04-08T12:54:05Z",
    content: SHARED_CONTENT,
  },
  {
    title: "White-Label Shopify Development: Why Agencies Outsource",
    slug: "white-label-shopify-development-why-agencies-outsource",
    category: "cro",
    image:
      "/images/webflow/cdn/695f695d822e4b695fec83f2_62826d4606184c7a100f33f714c28948f53e25f6.png",
    shortDescription:
      "Practical perspectives on agency growth, white-label delivery, and execution systems — written for teams scaling client work.",
    publishedAt: "2026-04-08T12:54:29Z",
    updatedAt: "2026-04-08T12:53:39Z",
    content: SHARED_CONTENT,
  },
  {
    title: "White-Label UI/UX Design: A Complete Guide for Agencies",
    slug: "white-label-ui-ux-design-a-complete-guide-for-agencies",
    category: "white-label-outsourcing",
    image:
      "/images/webflow/cdn/695f69dddaee4341ede966d5_a994d403aef97ae290a90af19570268925b45785.png",
    shortDescription:
      "Practical perspectives on agency growth, white-label delivery, and execution systems — written for teams scaling client work.",
    publishedAt: "2026-04-08T12:54:29Z",
    updatedAt: "2026-04-08T12:53:26Z",
    content: SHARED_CONTENT,
  },
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "all", name: "All" },
  { slug: "cro", name: "CRO" },
  { slug: "shopify", name: "Shopify" },
  { slug: "ui-ux-design", name: "UI/UX Design" },
  { slug: "web-development", name: "Web Development" },
  { slug: "white-label-outsourcing", name: "White-Label & Outsourcing" },
  { slug: "wordpress", name: "WordPress" },
];
