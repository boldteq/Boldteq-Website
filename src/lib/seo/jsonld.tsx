import { SITE_CONFIG } from "@/lib/constants/site";

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
