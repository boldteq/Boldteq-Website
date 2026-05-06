export interface BlogPost {
  title: string;
  slug: string;
  image: string;
  shortDescription: string;
  category: string;
  /** ISO-8601 publication date from Webflow CMS Published On field */
  publishedAt: string;
  /** ISO-8601 last update date */
  updatedAt?: string;
  /** HTML content from Webflow CMS Description field */
  content?: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
}
