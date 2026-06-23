export interface BlogAuthor {
  name: string;
  role: string;
  /** Path to the author avatar image */
  image: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  image: string;
  shortDescription: string;
  category: string;
  author: BlogAuthor;
  /** ISO-8601 publication date from Webflow CMS Published On field */
  publishedAt: string;
  /** ISO-8601 last update date */
  updatedAt?: string;
  /** Estimated read time in minutes */
  readingTime?: number;
  /** HTML content from Webflow CMS Description field */
  content?: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  /** Short SEO/intro description shown on the category page */
  description?: string;
}
