import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Solutions",
    href: "#",
    children: [
      {
        label: "Web Development",
        href: "/services/website-development",
        description: "Fast, scalable websites built for performance and growth.",
      },
      {
        label: "UI/UX Design",
        href: "/services/ui-ux-design",
        description:
          "User-centric designs that drive engagement and conversions.",
        comingSoon: true,
      },
      {
        label: "Graphic Design",
        href: "/services/graphics-design",
        description: "Visually striking designs that strengthen your brand.",
        comingSoon: true,
      },
      {
        label: "App Development",
        href: "/services/app-development",
        description: "Custom apps designed for speed and scalability.",
        comingSoon: true,
      },
    ],
  },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our Work", href: "/our-works" },
  { label: "Our Mission", href: "/our-mission" },
  {
    label: "Resources",
    href: "#",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "https://help.boldteq.com", external: true },
    ],
  },
];

export const CTA_NAV: NavItem[] = [
  { label: "Login", href: "https://portal.boldteq.com/", external: true },
  { label: "Schedule Demo", href: "/book-a-demo" },
];
