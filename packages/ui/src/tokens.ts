/**
 * Ported from mvbb-app.jsx `C` (prototype lines ~17-23). Values resolve to
 * the CSS custom properties defined in theme.css, which must be imported
 * once at the app root alongside fonts.css.
 */
export const C = {
  garlic: "var(--c-garlic)",
  garlicLight: "var(--c-garlicLight)",
  paper: "var(--c-paper)",
  ivory: "var(--c-ivory)",
  card: "var(--c-card)",
  ink: "var(--c-ink)",
  gold: "var(--c-gold)",
  goldDark: "var(--c-goldDark)",
  earth: "var(--c-earth)",
  green: "var(--c-green)",
  rust: "var(--c-rust)",
  line: "var(--c-line)",
  muted: "var(--c-muted)",
  white: "var(--c-white)",
} as const;
