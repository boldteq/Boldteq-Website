import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";
import { SITE_CONFIG } from "@/lib/constants/site";
import { FAQ_ITEMS } from "@/lib/constants/faq";
import "./globals.css";

const roobertPro = localFont({
  src: [
    {
      path: "../../public/fonts/RoobertPRO-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/RoobertPRO-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/RoobertPRO-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/RoobertPRO-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roobert",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "White Label Web Design & Development Services | Boldteq",
    template: "%s | Boldteq",
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.founder }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  keywords: [
    "white label web development",
    "white label agency",
    "subscription web development",
    "agency outsourcing",
    "Shopify development for agencies",
    "WordPress development for agencies",
    "white label dev team",
  ],
  verification: {
    google: "JlE0J7GQIyTbyMqTli7Z0EOoLHC08lyX-cdkTY9iRLI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    locale: "en_US",
    url: SITE_CONFIG.url,
    images: [
      {
        url: "/images/webflow/Group-47047.png",
        width: 1200,
        height: 630,
        alt: "Boldteq — White Label Web Development for Agencies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/webflow/Group-47047.png"],
  },
};

/** Organization JSON-LD — matches Webflow head custom code exactly */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Boldteq",
  url: "https://boldteq.com",
  logo: "https://cdn.prod.website-files.com/68ee3857579ec95674c7dd80/6937cbaf47872f6a8eb16f1c_Group%2046895.svg",
  description:
    "Subscription-based white-label web development service for digital agencies.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Yash",
    jobTitle: "Founder",
  },
  sameAs: [SITE_CONFIG.social.linkedin, SITE_CONFIG.social.trustpilot],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "sales@boldteq.com",
    url: "https://boldteq.com/book-a-demo",
  },
  areaServed: "Worldwide",
};

/** FAQPage JSON-LD — homepage structured data */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

/** WebSite JSON-LD — enables Google sitelinks search box */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roobertPro.variable} h-full antialiased`}>
      <head>
        {/* ── Performance hints ──────────────────────────────── */}
        <link
          rel="preconnect"
          href="https://cdn.prod.website-files.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://cdn.prod.website-files.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://t.contentsquare.net" />
        <link rel="dns-prefetch" href="https://app.chatwoot.com" />

        {/* ── Structured Data ────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-roobert">
        <PostHogProvider>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>

        {/* ── Google Analytics (gtag.js) — G-VSPBSV4406 ──────── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VSPBSV4406"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VSPBSV4406');
            `,
          }}
        />

        {/* ── Microsoft Clarity — v2sdjrzf16 ─────────────────── */}
        <Script
          id="clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "v2sdjrzf16");
            `,
          }}
        />

        {/* ── Contentsquare ──────────────────────────────────── */}
        <Script
          src="https://t.contentsquare.net/uxa/82f0998b73803.js"
          strategy="afterInteractive"
        />

        {/* ── Chatwoot (hardcoded token from Webflow) ─────────── */}
        <Script
          id="chatwoot-sdk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (window.self === window.top) {
                (function(d,t) {
                  var BASE_URL="https://app.chatwoot.com";
                  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                  g.src=BASE_URL+"/packs/js/sdk.js";
                  g.async=true;
                  s.parentNode.insertBefore(g,s);
                  g.onload=function(){
                    window.chatwootSDK.run({
                      websiteToken: 'i6RsELa1Smu1Gp6ayBrvTiQj',
                      baseUrl: BASE_URL
                    })
                  }
                })(document,"script");
              }
            `,
          }}
        />

        {/* ── Chatwoot aria-label fix ─────────────────────────── */}
        <Script
          id="chatwoot-aria"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function fixChatwootAria() {
                var openBtn = document.querySelector('.woot-widget-bubble:not(.woot--close)');
                var closeBtn = document.querySelector('.woot-widget-bubble.woot--close');
                if (openBtn && !openBtn.getAttribute('aria-label')) openBtn.setAttribute('aria-label', 'Open chat window');
                if (closeBtn && !closeBtn.getAttribute('aria-label')) closeBtn.setAttribute('aria-label', 'Close chat window');
              }
              fixChatwootAria();
              new MutationObserver(fixChatwootAria).observe(document.body, { childList: true, subtree: true });
            `,
          }}
        />
      </body>
    </html>
  );
}
