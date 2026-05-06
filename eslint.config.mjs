import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Read-only Webflow reference export (NOT app source):
    "boldteq-v1-0.webflow/**",
    // Audit/diff scripts in tests/ are utility scripts, not production source:
    "tests/**",
    "test-results/**",
    // Codemod/migration scripts — not production source:
    "scripts/**",
    // Component pattern snapshots — generated reference files:
    "src/components/patterns/**",
    // Audit scripts and output — not production source:
    "audit/**",
  ]),
]);

export default eslintConfig;
