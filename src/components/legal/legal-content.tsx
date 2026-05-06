import styles from "./legal-content.module.css";
import type { LegalDocument, LegalNode } from "@/lib/constants/legal";

function renderNode(node: LegalNode, index: number): React.ReactNode {
  switch (node.type) {
    case "p":
      return (
        <p
          key={index}
          className={styles.para}
          dangerouslySetInnerHTML={{ __html: node.html }}
        />
      );
    case "h4":
      return (
        <h4 key={index} className={styles.h4}>
          {node.text}
        </h4>
      );
    case "ul":
      return (
        <ul key={index} className={styles.ul} role="list">
          {node.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
  }
}

interface LegalContentProps {
  doc: LegalDocument;
}

export function LegalContent({ doc }: LegalContentProps) {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>{doc.title}</h1>
        <div className={styles.richtext}>
          <p className={styles.lastUpdated}>Last updated: {doc.lastUpdated}</p>
          {doc.sections.map((section, si) => (
            <div key={si}>
              <h3 className={styles.h3}>{section.heading}</h3>
              {section.nodes.map((node, ni) => renderNode(node, ni))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
