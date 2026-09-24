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
    // Untracked Kilo Code agent worktrees (copies of this repo).
    ".kilo/**",
  ]),
  {
    rules: {
      // Images are owner-supplied URLs from any host (Supabase Storage or a
      // pasted link), so next/image would need an open remotePatterns list;
      // plain <img> keeps the ported layout identical.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
