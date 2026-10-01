// Tailwind is wired to the thock&co. design system tokens in src/styles/system.css.
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--void)",
        panel: "var(--panel)",
        surface: "var(--surface)",
        line: "var(--line)",
        bone: "var(--bone)",
        ash: "var(--ash)",
        signal: "var(--signal)",
        ember: "var(--ember)",
        // Older pages call the accent "interactive"; it is the same pink.
        interactive: "var(--signal)",
      },
      fontFamily: {
        display: ["Matrix Sans Print", "monospace"],
        mono: ["Reddit Mono", "monospace"],
        body: ["Varela Round", "system-ui", "sans-serif"],
      },
      fontSize: {
        // 1.333 scale from a 16px base, set for this site's three faces
        "display-xl": ["5.25rem", { lineHeight: "0.9" }],
        "display-lg": ["3.5rem", { lineHeight: "0.95" }],
        "display-md": ["2.125rem", { lineHeight: "1" }],
        label: ["0.8125rem", { lineHeight: "1.4" }],
      },
      borderRadius: {
        stage: "1.75rem",
        panel: "1.25rem",
        cap: "0.75rem",
      },
      spacing: {
        dot: "var(--dot-pitch)",
      },
    },
  },
  plugins: [],
};
