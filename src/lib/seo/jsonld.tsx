import { SITE_CONFIG } from "@/lib/constants/site";
import {
  type JobListing,
  JOB_POSTED_DATE,
  JOB_VALID_THROUGH,
} from "@/lib/constants/careers";

type SchemaObject = Record<string, unknown>;

interface JsonLdProps {
  data: SchemaObject | SchemaObject[];
  id?: string;
}

/**
 * Render a JSON-LD <script> block.
 * Pass a single schema object or an array (will be emitted as @graph).
 */
export function JsonLd({ data, id }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Build BreadcrumbList JSON-LD from a Home → … → current path.
 */
export function breadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  const list = [
    { name: "Home", path: "/" },
    ...items,
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };
}

/**
 * Build a schema.org JobPosting for one role. Remote-first (TELECOMMUTE) with
 * applicant location requirements so Google Jobs treats it as a valid posting.
 */
export function jobPostingSchema(job: JobListing): SchemaObject {
  const li = (items: string[]) =>
    `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description:
      `<p>${job.description}</p>` +
      `<p><strong>Responsibilities</strong></p>${li(job.responsibilities)}` +
      `<p><strong>Requirements</strong></p>${li(job.requirements)}`,
    datePosted: JOB_POSTED_DATE,
    validThrough: JOB_VALID_THROUGH,
    employmentType: job.employmentType,
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "IN" },
    directApply: false,
    url: `${SITE_CONFIG.url}/careers#job-${job.slug}`,
    identifier: {
      "@type": "PropertyValue",
      name: "Boldteq",
      value: job.slug,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: "Boldteq",
      sameAs: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/images/webflow/Group-46895.svg`,
    },
  };
}
