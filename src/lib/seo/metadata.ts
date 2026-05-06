import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";

const DEFAULT_OG_IMAGE = "/images/webflow/Group-47047.png";

type OgType = "website" | "article" | "profile";

export function createMetadata({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: OgType;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_CONFIG.url}${ogImage}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
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
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type,
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && type === "article" ? { publishedTime } : {}),
      ...(modifiedTime && type === "article" ? { modifiedTime } : {}),
      ...(authors && type === "article" ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
