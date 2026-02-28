const pptxgen = require("pptxgenjs");

// ─── Color Palette: Ocean Gradient (matching Session 2) ───
const C = {
  navy:      "0F2B46",
  deepBlue:  "065A82",
  teal:      "1C7293",
  midnight:  "21295C",
  white:     "FFFFFF",
  offWhite:  "F0F4F8",
  lightGray: "E2E8F0",
  medGray:   "94A3B8",
  darkText:  "1E293B",
  bodyText:  "334155",
  accent:    "0EA5E9",
  accentAlt: "06B6D4",
  green:     "10B981",
  orange:    "F59E0B",
  red:       "EF4444",
};

const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 });

function addIconCircle(slide, pres, x, y, size, bgColor, letter) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: bgColor } });
  slide.addText(letter, {
    x, y, w: size, h: size,
    fontSize: Math.round(size * 18), fontFace: "Calibri", bold: true,
    color: "FFFFFF", align: "center", valign: "middle", margin: 0
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Claude Code Training";
  pres.title = "The Design-to-Code Pipeline";

  // ════════════════════════════════════════════════════════
  // SLIDE 1: Title
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    for (let i = 1; i < 6; i++) {
      s.addShape(pres.shapes.LINE, { x: 0, y: i * 0.95, w: 10, h: 0, line: { color: C.deepBlue, width: 0.3 } });
    }
    s.addText("The Design-to-Code", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.2,
      fontSize: 42, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addText("Pipeline", {
      x: 0.8, y: 2.2, w: 8.4, h: 0.8,
      fontSize: 42, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.accent } });
    s.addText("Session 3 \u2014 Review, Refine & Best Practices", {
      x: 0.8, y: 3.6, w: 8.4, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.medGray, margin: 0
    });
    addIconCircle(s, pres, 7.0, 4.1, 0.7, C.deepBlue, "\u21BB");
    addIconCircle(s, pres, 7.9, 3.9, 0.7, C.teal, "\u2714");
    addIconCircle(s, pres, 8.5, 4.2, 0.6, C.midnight, "\u2699");
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 2: Why Generated Code Needs Review
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Why Generated Code Needs Review", {
      x: 0.7, y: 0.3, w: 8.6, h: 0.6,
      fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0
    });

    // What Claude doesn't know
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.1, w: 8.6, h: 0.7, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.1, w: 0.06, h: 0.7, fill: { color: C.orange } });
    s.addText([
      { text: "Claude generates code from design data, not from understanding your project. ", options: { bold: true, color: C.darkText } },
      { text: "Without constraints, it produces valid code that doesn\u2019t fit your project.", options: { color: C.bodyText } },
    ], { x: 1.0, y: 1.1, w: 8.1, h: 0.7, fontSize: 12, fontFace: "Calibri", valign: "middle", margin: 0 });

    // What Claude doesn't inherently know — cards
    const unknowns = [
      { text: "Your project uses class\ncomponents (not hooks)", color: C.deepBlue },
      { text: "Your team imports\nReactstrap, not MUI", color: C.teal },
      { text: "Your i18n uses\ncounterpart, not react-intl", color: C.midnight },
      { text: "Your SCSS follows\nPaper Dashboard conventions", color: C.accent },
    ];
    unknowns.forEach((u, i) => {
      const cx = 0.7 + i * 2.3;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 2.05, w: 2.1, h: 1.0, fill: { color: C.white }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 2.05, w: 2.1, h: 0.06, fill: { color: u.color } });
      s.addText(u.text, { x: cx + 0.1, y: 2.2, w: 1.9, h: 0.8, fontSize: 10, fontFace: "Calibri", color: C.bodyText, align: "center", valign: "middle", margin: 0 });
    });

    // Three sources of constraints
    s.addText("Constraints come from three sources:", { x: 0.7, y: 3.3, w: 8.6, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const sources = [
      { num: "1", label: "Your prompt", desc: "Immediate, one-time", color: C.deepBlue },
      { num: "2", label: "CLAUDE.md + rules files", desc: "Permanent, every session", color: C.teal },
      { num: "3", label: "Your examples", desc: "Show an existing component to follow", color: C.midnight },
    ];
    sources.forEach((src, i) => {
      const sx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 3.8, w: 2.8, h: 0.7, fill: { color: C.white }, shadow: makeCardShadow() });
      addIconCircle(s, pres, sx + 0.1, sy = 3.85, 0.4, src.color, src.num);
      s.addText(src.label, { x: sx + 0.6, y: 3.82, w: 2.0, h: 0.3, fontSize: 12, fontFace: "Calibri", bold: true, color: src.color, margin: 0 });
      s.addText(src.desc, { x: sx + 0.6, y: 4.12, w: 2.0, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.8, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText("The more constraints you provide, the closer the first output is to production-ready. But always review.", {
      x: 0.7, y: 4.8, w: 8.6, h: 0.4, fontSize: 12, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 3: The Design Token Hierarchy
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Design Token Hierarchy", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Tokens work in layers, from generic to specific", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Three layers as tall cards
    const layers = [
      {
        title: "Layer 1: Primitives",
        desc: "Raw values",
        items: "blue-500: #3B82F6\ngray-100: #F3F4F6\nfont-sans: 'Inter'\nsize-4: 16px\nradius-md: 8px",
        color: C.deepBlue,
      },
      {
        title: "Layer 2: Semantics",
        desc: "Meaningful names",
        items: "color-primary: blue-500\ncolor-surface: gray-100\nfont-body: font-sans\nspacing-md: size-4\nborder-radius-card: radius-md",
        color: C.teal,
      },
      {
        title: "Layer 3: Component",
        desc: "Specific usage",
        items: "button-bg: color-primary\ncard-bg: color-surface\ncard-padding: spacing-md\ncard-radius: border-radius-card",
        color: C.midnight,
      },
    ];
    layers.forEach((l, i) => {
      const cx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.3, w: 2.8, h: 2.7, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.3, w: 2.8, h: 0.06, fill: { color: l.color } });
      s.addText(l.title, { x: cx + 0.15, y: 1.4, w: 2.5, h: 0.35, fontSize: 13, fontFace: "Calibri", bold: true, color: l.color, align: "center", margin: 0 });
      s.addText(l.desc, { x: cx + 0.15, y: 1.7, w: 2.5, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.medGray, align: "center", margin: 0 });
      s.addShape(pres.shapes.LINE, { x: cx + 0.3, y: 2.0, w: 2.2, h: 0, line: { color: C.lightGray, width: 1 } });
      s.addText(l.items, { x: cx + 0.2, y: 2.1, w: 2.4, h: 1.7, fontSize: 10, fontFace: "Consolas", color: C.bodyText, margin: 0 });
      if (i < 2) {
        s.addText("\u2192", { x: cx + 2.8, y: 2.3, w: 0.3, h: 0.5, fontSize: 18, color: C.medGray, align: "center", valign: "middle", margin: 0 });
      }
    });

    // Bottom callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.3, w: 8.6, h: 0.9, fill: { color: C.navy } });
    s.addText([
      { text: "Critical: Figma Variables must be manually created by designers.", options: { bold: true, color: C.orange, breakLine: true } },
      { text: "get_variable_defs is selection-scoped \u2014 returns only variables on selected layers, not the full file. No Variables = empty results.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.3, w: 8.2, h: 0.9, fontSize: 12, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 4: The Review-Refine Workflow
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Review-Refine Workflow", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("The core workflow for productive Figma-to-code generation", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });

    const steps = [
      { num: "1", label: "GENERATE", detail: "Specify tech stack + share Figma URL \u2192 Claude outputs component", color: C.deepBlue },
      { num: "2", label: "REVIEW", detail: "Check imports, patterns, dependencies, styling, structure", color: C.teal },
      { num: "3", label: "REFINE", detail: "Ask Claude to fix specific issues: \"Use Reactstrap Card\", \"Add i18n\"", color: C.midnight },
      { num: "4", label: "INTEGRATE", detail: "Place in correct directory, add routes, connect to API", color: C.accent },
      { num: "5", label: "TEST", detail: "Visual comparison with Figma, functional tests, responsive check", color: C.green },
    ];

    steps.forEach((st, i) => {
      const sy = 1.3 + i * 0.65;
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, { x: 1.15, y: sy + 0.5, w: 0, h: 0.15, line: { color: C.lightGray, width: 2 } });
      }
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: sy, w: 7.5, h: 0.5, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: sy, w: 0.05, h: 0.5, fill: { color: st.color } });
      addIconCircle(s, pres, 0.8, sy + 0.03, 0.42, st.color, st.num);
      s.addText(st.label, { x: 1.75, y: sy, w: 1.5, h: 0.5, fontSize: 14, fontFace: "Calibri", bold: true, color: st.color, valign: "middle", margin: 0 });
      s.addText(st.detail, { x: 3.3, y: sy, w: 5.5, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });

    // Loop back arrow indicator
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.75, w: 8.6, h: 0.55, fill: { color: C.navy } });
    s.addText([
      { text: "Doesn\u2019t match? \u2192 Back to Step 3. ", options: { color: C.orange, bold: true } },
      { text: "Usually 1\u20132 iterations gets you to production-ready.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.75, w: 8.2, h: 0.55, fontSize: 13, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 5: The Review Checklist
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Review Checklist", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Check these five things after every generation", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    const checks = [
      { num: "1", title: "Imports \u2014 Are they real?", items: "Every package in package.json? Every path correct?", color: C.deepBlue },
      { num: "2", title: "Component pattern \u2014 Does it match?", items: "Class vs functional? State management? Export pattern?", color: C.teal },
      { num: "3", title: "Styling \u2014 Your approach?", items: "SCSS vs Tailwind? Your variables? Your naming?", color: C.midnight },
      { num: "4", title: "Dependencies \u2014 Version-compatible?", items: "API calls same way? Auth pattern? Error handling?", color: C.accent },
      { num: "5", title: "Design fidelity \u2014 Matches Figma?", items: "Colors, spacing, typography, responsive, component states", color: C.green },
    ];

    checks.forEach((ch, i) => {
      const cy = 1.3 + i * 0.68;
      addIconCircle(s, pres, 0.8, cy + 0.05, 0.45, ch.color, ch.num);
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: cy, w: 8.0, h: 0.55, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: cy, w: 0.05, h: 0.55, fill: { color: ch.color } });
      s.addText(ch.title, { x: 1.75, y: cy + 0.02, w: 4.0, h: 0.25, fontSize: 13, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
      s.addText(ch.items, { x: 1.75, y: cy + 0.28, w: 7.5, h: 0.22, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText("Generated code is a starting point. The review checklist is what makes it production-ready.", {
      x: 0.7, y: 4.85, w: 8.6, h: 0.4, fontSize: 12, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 6: Common Pitfalls — React Version & UI Library
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Common Pitfalls (1/2)", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });

    // Pitfall 1: React version mismatch
    s.addText("1. React Version Mismatch", { x: 0.7, y: 1.0, w: 8.6, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.red, margin: 0 });

    // Wrong
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.45, w: 4.3, h: 1.6, fill: { color: C.navy } });
    s.addText("Claude generated (React 18)", { x: 0.9, y: 1.5, w: 3, h: 0.2, fontSize: 9, fontFace: "Calibri", bold: true, color: C.red, margin: 0 });
    s.addText([
      { text: "const StatusCard = () => {", options: { color: C.lightGray, breakLine: true } },
      { text: "  const [data, setData]", options: { color: C.orange, breakLine: true } },
      { text: "    = useState(null);", options: { color: C.orange, breakLine: true } },
      { text: "  useEffect(() => {", options: { color: C.orange, breakLine: true } },
      { text: "    fetchData();", options: { color: C.lightGray, breakLine: true } },
      { text: "  }, []);", options: { color: C.orange } },
    ], { x: 0.9, y: 1.75, w: 3.9, h: 1.2, fontSize: 10, fontFace: "Consolas", margin: 0 });

    // Right
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.45, w: 4.3, h: 1.6, fill: { color: C.navy } });
    s.addText("Your project expects (React 16)", { x: 5.5, y: 1.5, w: 3, h: 0.2, fontSize: 9, fontFace: "Calibri", bold: true, color: C.green, margin: 0 });
    s.addText([
      { text: "class StatusCard extends", options: { color: C.lightGray, breakLine: true } },
      { text: "  React.Component {", options: { color: C.green, breakLine: true } },
      { text: "  constructor(props) {", options: { color: C.green, breakLine: true } },
      { text: "    super(props);", options: { color: C.lightGray, breakLine: true } },
      { text: "    this.state = { data: null };", options: { color: C.green, breakLine: true } },
      { text: "  }", options: { color: C.lightGray } },
    ], { x: 5.5, y: 1.75, w: 3.9, h: 1.2, fontSize: 10, fontFace: "Consolas", margin: 0 });

    // Pitfall 2: Wrong UI Library
    s.addText("2. Wrong UI Library", { x: 0.7, y: 3.3, w: 8.6, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.red, margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 3.75, w: 4.3, h: 0.8, fill: { color: C.navy } });
    s.addText([
      { text: '<div className="flex p-4">', options: { color: C.orange, breakLine: true } },
      { text: "  Tailwind utility classes", options: { color: C.medGray } },
    ], { x: 0.9, y: 3.8, w: 3.9, h: 0.7, fontSize: 11, fontFace: "Consolas", margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 3.75, w: 4.3, h: 0.8, fill: { color: C.navy } });
    s.addText([
      { text: "<Card><CardBody>", options: { color: C.green, breakLine: true } },
      { text: "  Reactstrap components", options: { color: C.medGray } },
    ], { x: 5.5, y: 3.8, w: 3.9, h: 0.7, fontSize: 11, fontFace: "Consolas", margin: 0 });

    // Prevention
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.75, w: 8.6, h: 0.55, fill: { color: C.offWhite } });
    s.addText([
      { text: "Prevention: ", options: { bold: true, color: C.deepBlue } },
      { text: "Specify React version + component style in rules file. Reference an existing component: ", options: { color: C.bodyText } },
      { text: "\"Follow the pattern in GetClients.jsx\"", options: { fontFace: "Consolas", color: C.teal, fontSize: 10 } },
    ], { x: 0.9, y: 4.75, w: 8.2, h: 0.55, fontSize: 11, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 7: Common Pitfalls — i18n, Phantom Imports, Over-Engineering
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Common Pitfalls (2/2)", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });

    const pitfalls = [
      {
        num: "3",
        title: "Missing Internationalization",
        wrong: '<h3>Status</h3>',
        right: '<Tr content="dashboard.status" />',
        fix: "Add i18n requirements to rules file",
        color: C.deepBlue,
      },
      {
        num: "4",
        title: "Phantom Import",
        wrong: "import { DashboardCard }\n  from '@bulksource/ui-components'",
        right: "import { Card }\n  from 'reactstrap'",
        fix: "Ask Claude to verify all imports exist in package.json",
        color: C.teal,
      },
      {
        num: "5",
        title: "Over-Engineering",
        wrong: "TypeScript interfaces, custom\nhooks, context providers...",
        right: "Simple class component\nmatching your existing patterns",
        fix: "\"Match the complexity of our existing components\"",
        color: C.midnight,
      },
    ];

    pitfalls.forEach((p, i) => {
      const py = 1.0 + i * 1.25;
      addIconCircle(s, pres, 0.7, py + 0.1, 0.4, p.color, p.num);
      s.addText(p.title, { x: 1.25, y: py, w: 3.5, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: p.color, margin: 0 });

      // Wrong
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: py + 0.4, w: 3.8, h: 0.65, fill: { color: C.navy } });
      s.addText(p.wrong, { x: 0.85, y: py + 0.42, w: 3.5, h: 0.58, fontSize: 9, fontFace: "Consolas", color: C.orange, margin: 0 });

      // Right
      s.addShape(pres.shapes.RECTANGLE, { x: 4.7, y: py + 0.4, w: 3.0, h: 0.65, fill: { color: C.navy } });
      s.addText(p.right, { x: 4.85, y: py + 0.42, w: 2.7, h: 0.58, fontSize: 9, fontFace: "Consolas", color: C.green, margin: 0 });

      // Fix
      s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: py + 0.4, w: 1.8, h: 0.65, fill: { color: C.offWhite } });
      s.addText(p.fix, { x: 8.0, y: py + 0.42, w: 1.6, h: 0.58, fontSize: 9, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText("All five pitfalls are preventable with a rules file + reference component.", {
      x: 0.7, y: 4.85, w: 8.6, h: 0.4, fontSize: 12, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 8: Remote MCP vs Desktop MCP
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Remote MCP vs Desktop MCP", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("When to use each option", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Remote MCP card
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 4.3, h: 3.4, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 4.3, h: 0.06, fill: { color: C.deepBlue } });
    s.addText("Remote MCP", { x: 0.9, y: 1.45, w: 3.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.deepBlue, margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 1.9, w: 3.9, h: 0.6, fill: { color: C.navy } });
    s.addText("claude mcp add --transport http\n  figma https://mcp.figma.com/mcp", { x: 1.0, y: 1.92, w: 3.7, h: 0.55, fontSize: 10, fontFace: "Consolas", color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "Best for:", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "\u2022 Quick prototyping", options: { color: C.bodyText, breakLine: true } },
      { text: "\u2022 Sharing frame URLs in prompts", options: { color: C.bodyText, breakLine: true } },
      { text: "\u2022 CI/CD pipelines", options: { color: C.bodyText, breakLine: true } },
      { text: "\u2022 First-time setup", options: { color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "Limitations:", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "\u2022 Must copy/paste URLs", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 Can\u2019t select sub-elements", options: { color: C.medGray } },
    ], { x: 0.9, y: 2.6, w: 3.9, h: 2.0, fontSize: 11, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 2 });

    // Desktop MCP card
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.3, h: 3.4, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.3, h: 0.06, fill: { color: C.teal } });
    s.addText("Desktop MCP", { x: 5.5, y: 1.45, w: 3.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.teal, margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.9, w: 3.9, h: 0.6, fill: { color: C.navy } });
    s.addText("Figma Desktop \u2192 Dev Mode (Shift+D)\nhttp://127.0.0.1:3845/mcp", { x: 5.6, y: 1.92, w: 3.7, h: 0.55, fontSize: 10, fontFace: "Consolas", color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "Best for:", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "\u2022 Daily component development", options: { color: C.bodyText, breakLine: true } },
      { text: "\u2022 Selecting specific layers", options: { color: C.bodyText, breakLine: true } },
      { text: "\u2022 Unpublished designs", options: { color: C.bodyText, breakLine: true } },
      { text: "\u2022 More precise extraction", options: { color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "Limitations:", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "\u2022 Requires Figma Desktop", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 Only works on local machine", options: { color: C.medGray } },
    ], { x: 5.5, y: 2.6, w: 3.9, h: 2.0, fontSize: 11, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 2 });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.95, w: 8.6, h: 0.35, fill: { color: C.navy } });
    s.addText([
      { text: "Start with Remote ", options: { bold: true, color: C.accentAlt } },
      { text: "(today)  |  ", options: { color: C.lightGray } },
      { text: "Upgrade to Desktop ", options: { bold: true, color: C.accentAlt } },
      { text: "when you\u2019re doing daily component work", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.95, w: 8.2, h: 0.35, fontSize: 12, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 9: Best Practices for Prompting
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Best Practices for Prompting", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });

    const practices = [
      {
        bad: "\"Generate a component from\nthis Figma frame\"",
        good: "\"Generate a React 16 class\ncomponent using Reactstrap\nand SCSS from this frame\"",
        title: "Be specific about tech stack",
        color: C.deepBlue,
      },
      {
        bad: "\"Make a card component\"",
        good: "\"Make a card component\nfollowing the patterns in\nGetClients.jsx\"",
        title: "Reference existing components",
        color: C.teal,
      },
      {
        bad: "\"Generate the entire\ndashboard page\"",
        good: "\"Generate just the StatusCard\ncomponent from this frame\"",
        title: "Start with individual frames",
        color: C.midnight,
      },
      {
        bad: "\"Use appropriate colors\"",
        good: "\"Use --color-primary for\naction elements, --color-surface\nfor backgrounds\"",
        title: "Tell Claude which tokens to use",
        color: C.accent,
      },
    ];

    practices.forEach((p, i) => {
      const py = 1.0 + i * 0.95;
      s.addText(p.title, { x: 0.7, y: py, w: 2.5, h: 0.35, fontSize: 12, fontFace: "Calibri", bold: true, color: p.color, margin: 0 });
      // Bad
      s.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: py, w: 3.2, h: 0.8, fill: { color: C.navy } });
      s.addText("\u2717", { x: 3.05, y: py, w: 0.3, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.red, margin: 0 });
      s.addText(p.bad, { x: 3.3, y: py + 0.05, w: 2.8, h: 0.7, fontSize: 9, fontFace: "Consolas", color: C.medGray, margin: 0 });
      // Good
      s.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: py, w: 3.2, h: 0.8, fill: { color: C.navy } });
      s.addText("\u2713", { x: 6.45, y: py, w: 0.3, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.green, margin: 0 });
      s.addText(p.good, { x: 6.7, y: py + 0.05, w: 2.8, h: 0.7, fontSize: 9, fontFace: "Consolas", color: C.green, margin: 0 });
    });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText("Specific tech stack + reference component + individual frames = better output", {
      x: 0.7, y: 4.85, w: 8.6, h: 0.4, fontSize: 13, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 10: Summary / Key Takeaways
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    for (let i = 1; i < 6; i++) {
      s.addShape(pres.shapes.LINE, { x: 0, y: i * 0.95, w: 10, h: 0, line: { color: C.deepBlue, width: 0.3 } });
    }
    s.addText("Key Takeaways", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 32, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });

    const takeaways = [
      { text: "Review is mandatory", sub: "Generated code is a starting point \u2014 check imports, patterns, dependencies" },
      { text: "Token hierarchy matters", sub: "Primitives \u2192 Semantics \u2192 Components; quality depends on Figma organization" },
      { text: "Review-refine loop", sub: "Generate \u2192 Review \u2192 Refine \u2192 Integrate \u2192 Test; iterate steps 3\u20135" },
      { text: "Five common pitfalls", sub: "Version mismatch, wrong UI library, missing i18n, phantom imports, over-engineering" },
      { text: "Rules files save time", sub: "Every minute of configuration saves ten minutes of manual refinement" },
    ];
    takeaways.forEach((t, i) => {
      const ty = 1.2 + i * 0.7;
      s.addText((i + 1).toString(), { x: 0.8, y: ty, w: 0.4, h: 0.35, fontSize: 20, fontFace: "Calibri", bold: true, color: C.accent, margin: 0 });
      s.addText(t.text, { x: 1.4, y: ty, w: 7.5, h: 0.32, fontSize: 16, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });
      s.addText(t.sub, { x: 1.4, y: ty + 0.32, w: 7.5, h: 0.28, fontSize: 12, fontFace: "Calibri", color: C.medGray, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.8, w: 8.6, h: 0.04, fill: { color: C.accent } });
    s.addText("Next: Hands-on lab \u2014 Figma MCP install, token extraction, component generation", {
      x: 0.7, y: 4.9, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.medGray, margin: 0
    });
  }

  const outPath = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_3/04_Design_Token_Workflow.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Lecture presentation written to:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
