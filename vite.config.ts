import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { allPaths, metaFor, NOT_FOUND, SITE_URL, type PageMeta } from "./src/routes";

// GitHub Pages serves each route as a folder, redirecting /about to /about/.
const pageUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : `${path}/`}`;

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function withMeta(html: string, meta: PageMeta, path: string | null) {
  const extra = [
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary" />`,
    ...(path ? [`<link rel="canonical" href="${pageUrl(path)}" />`, `<meta property="og:url" content="${pageUrl(path)}" />`] : []),
  ];
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace("</head>", `  ${extra.join("\n    ")}\n  </head>`);
}

/**
 * GitHub Pages only serves files that exist, so a SPA's deep links 404. Write
 * the built index.html to every route (with that route's title and
 * description), and use it as 404.html so unknown paths still load the app,
 * which then shows its not-found page.
 */
function routeFiles(): Plugin {
  let outDir = "dist";
  return {
    name: "route-files",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const html = readFileSync(join(outDir, "index.html"), "utf8");
      for (const path of allPaths()) {
        const file = path === "/" ? join(outDir, "index.html") : join(outDir, path, "index.html");
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, withMeta(html, metaFor(path), path));
      }
      writeFileSync(join(outDir, "404.html"), withMeta(html, NOT_FOUND, null));
      const urls = allPaths().map((path) => `  <url><loc>${pageUrl(path)}</loc></url>`).join("\n");
      writeFileSync(
        join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routeFiles()],
  base: "/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
