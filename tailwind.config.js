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
        body: ["Varela Round", "system-ui", "sans-serif"],
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
