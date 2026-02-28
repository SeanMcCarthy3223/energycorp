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
  pres.title = "From Design to Code: Figma MCP, Design Tokens & Best Practices";

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
    s.addText("From Design to Code", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.2,
      fontSize: 42, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addText("Figma MCP, Design Tokens & Best Practices", {
      x: 0.8, y: 2.3, w: 8.4, h: 0.7,
      fontSize: 24, fontFace: "Calibri", color: C.accentAlt, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.accent } });
    s.addText("Session 3 \u2014 The Design-to-Code Pipeline", {
      x: 0.8, y: 3.6, w: 8.4, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.medGray, margin: 0
    });
    addIconCircle(s, pres, 7.0, 4.1, 0.7, C.deepBlue, "F");
    addIconCircle(s, pres, 7.9, 3.9, 0.7, C.teal, "T");
    addIconCircle(s, pres, 8.7, 4.2, 0.6, C.midnight, "\u2192");
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 2: The Gap Between Design and Code
  // (from Pres1 slide 2)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Gap Between Design and Code", {
      x: 0.7, y: 0.3, w: 8.6, h: 0.6,
      fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0
    });

    // Left: the manual process
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.1, w: 4.3, h: 3.2, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.1, w: 4.3, h: 0.06, fill: { color: C.red } });
    addIconCircle(s, pres, 1.0, 1.35, 0.5, C.red, "!");
    s.addText("Today\u2019s Workflow", { x: 1.65, y: 1.35, w: 3.0, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });

    const manualSteps = [
      "Designer creates mockup in Figma",
      "Developer measures spacing, copies hex colors",
      "Developer builds component by eyeballing",
      "Designer reviews: \"Wrong padding, wrong blue\"",
      "Developer adjusts, re-submits",
      "Repeat 2\u20133 times until it matches",
    ];
    manualSteps.forEach((step, i) => {
      const sy = 1.9 + i * 0.38;
      s.addText((i + 1) + ".", { x: 0.95, y: sy, w: 0.3, h: 0.35, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
      s.addText(step, { x: 1.3, y: sy, w: 3.5, h: 0.35, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });

    // Right: the solution
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.1, w: 4.3, h: 3.2, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.1, w: 4.3, h: 0.06, fill: { color: C.green } });
    addIconCircle(s, pres, 5.6, 1.35, 0.5, C.green, "\u2713");
    s.addText("With Figma MCP", { x: 6.25, y: 1.35, w: 3.0, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    s.addText([
      { text: "Claude reads the design directly.", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "No manual measurement", options: { color: C.bodyText, breakLine: true } },
      { text: "No eyeballing hex colors", options: { color: C.bodyText, breakLine: true } },
      { text: "No back-and-forth cycles", options: { color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "Figma MCP eliminates the gap", options: { bold: true, color: C.deepBlue, breakLine: true } },
      { text: "by giving Claude direct access", options: { bold: true, color: C.deepBlue, breakLine: true } },
      { text: "to your design data.", options: { bold: true, color: C.deepBlue } },
    ], { x: 5.55, y: 1.9, w: 3.8, h: 2.3, fontSize: 12, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 2 });

    // Bottom callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.6, w: 8.6, h: 0.55, fill: { color: C.navy } });
    s.addText("What if Claude could read the design directly?", {
      x: 0.7, y: 4.6, w: 8.6, h: 0.55, fontSize: 15, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 3: How Claude Code Connects to Figma
  // (from Pres1 slide 3 — includes Remote vs Desktop table,
  //  so Pres2 slide 8 is not needed separately)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("How Claude Code Connects to Figma", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("MCP = Model Context Protocol", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 15, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Architecture flow
    const flowItems = ["You", "Claude Code", "MCP Client", "Figma MCP", "Figma API"];
    const flowColors = [C.deepBlue, C.deepBlue, C.teal, C.teal, C.midnight];
    flowItems.forEach((label, i) => {
      const fx = 0.5 + i * 1.9;
      s.addShape(pres.shapes.RECTANGLE, { x: fx, y: 1.35, w: 1.6, h: 0.5, fill: { color: flowColors[i] } });
      s.addText(label, { x: fx, y: 1.35, w: 1.6, h: 0.5, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      if (i < 4) s.addText("\u2192", { x: fx + 1.6, y: 1.35, w: 0.3, h: 0.5, fontSize: 16, color: C.medGray, align: "center", valign: "middle", margin: 0 });
    });

    // Comparison table: Remote vs Desktop
    s.addText("Two Server Options", { x: 0.7, y: 2.15, w: 4, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    const compRows = [
      ["", "Remote MCP", "Desktop MCP"],
      ["Setup", "claude mcp add ...", "Figma Desktop Dev Mode"],
      ["Reference", "Share URLs in prompts", "Select frames directly"],
      ["Requires Desktop", "No", "Yes"],
      ["Selection-based", "No (link-based)", "Yes (click to select)"],
      ["Best for", "Quick prototyping, CI/CD", "Daily dev, precision"],
    ];
    const tableData = compRows.map((row, ri) => row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri === 0 ? C.deepBlue : (ri % 2 === 1 ? C.offWhite : C.white) },
        color: ri === 0 ? C.white : C.darkText,
        bold: ri === 0 || ci === 0, fontSize: 10, valign: "middle",
      }
    })));
    s.addTable(tableData, { x: 0.7, y: 2.55, w: 8.6, fontSize: 10, fontFace: "Calibri", colW: [1.8, 3.4, 3.4], border: { pt: 0.5, color: C.lightGray } });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.75, w: 8.6, h: 0.5, fill: { color: C.navy } });
    s.addText([
      { text: "Today: ", options: { bold: true, color: C.accentAlt } },
      { text: "Remote MCP \u2014 simpler setup, no desktop dependency. One command to install.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.75, w: 8.2, h: 0.5, fontSize: 13, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 4: Key Figma MCP Tools
  // (from Pres1 slide 5)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Key Figma MCP Tools", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });

    const tools = [
      { letter: "D", name: "get_design_context", desc: "The main tool. Returns structured\ncode from your Figma selection.\nDefault: React + Tailwind (customizable).", color: C.deepBlue },
      { letter: "V", name: "get_variable_defs", desc: "Returns variables & styles on the\ncurrent selection. Selection-scoped.\nRequires Figma Variables to exist.", color: C.teal },
      { letter: "M", name: "get_code_connect_map", desc: "Maps Figma components to\nyour existing codebase.\nRequires Org/Enterprise plan.", color: C.midnight },
      { letter: "S", name: "get_screenshot", desc: "Visual screenshot of selection.\nClaude sees the design\nalongside the structural data.", color: C.accent },
    ];
    tools.forEach((t, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const cx = 0.7 + col * 4.5;
      const cy = 1.1 + row * 1.8;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 4.2, h: 1.55, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 4.2, h: 0.06, fill: { color: t.color } });
      addIconCircle(s, pres, cx + 0.2, cy + 0.25, 0.6, t.color, t.letter);
      s.addText(t.name, { x: cx + 0.95, y: cy + 0.15, w: 3.0, h: 0.35, fontSize: 15, fontFace: "Consolas", bold: true, color: t.color, margin: 0 });
      s.addText(t.desc, { x: cx + 0.95, y: cy + 0.55, w: 3.0, h: 0.9, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });

    // Bottom callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText([
      { text: "Focus today: ", options: { bold: true, color: C.accentAlt } },
      { text: "get_design_context", options: { fontFace: "Consolas", bold: true, color: C.green } },
      { text: " and ", options: { color: C.lightGray } },
      { text: "get_variable_defs", options: { fontFace: "Consolas", bold: true, color: C.green } },
      { text: " \u2014 the most immediately useful tools.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.85, w: 8.2, h: 0.4, fontSize: 13, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 5: What Are Design Tokens?
  // (merged: code comparison from Pres1 slide 4 +
  //  detailed hierarchy from Pres2 slide 3 + critical callout)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("What Are Design Tokens?", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("In Figma, \"design tokens\" = Figma Variables \u2014 named containers for single reusable values", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Left: hardcoded vs tokens
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.35, w: 4.3, h: 1.5, fill: { color: C.navy } });
    s.addText("Instead of this:", { x: 0.9, y: 1.45, w: 3, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.red, margin: 0 });
    s.addText([
      { text: ".card {", options: { color: C.lightGray, breakLine: true } },
      { text: "  background: ", options: { color: C.lightGray, breakLine: false } },
      { text: "#3B82F6", options: { color: C.orange, breakLine: false } },
      { text: ";", options: { color: C.lightGray, breakLine: true } },
      { text: "  padding: ", options: { color: C.lightGray, breakLine: false } },
      { text: "16px", options: { color: C.orange, breakLine: false } },
      { text: ";", options: { color: C.lightGray, breakLine: true } },
      { text: "}", options: { color: C.lightGray } },
    ], { x: 0.9, y: 1.75, w: 3.9, h: 1.0, fontSize: 11, fontFace: "Consolas", margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.35, w: 4.3, h: 1.5, fill: { color: C.navy } });
    s.addText("You use this:", { x: 5.5, y: 1.45, w: 3, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.green, margin: 0 });
    s.addText([
      { text: ".card {", options: { color: C.lightGray, breakLine: true } },
      { text: "  background: ", options: { color: C.lightGray, breakLine: false } },
      { text: "var(--color-primary)", options: { color: C.green, breakLine: false } },
      { text: ";", options: { color: C.lightGray, breakLine: true } },
      { text: "  padding: ", options: { color: C.lightGray, breakLine: false } },
      { text: "var(--spacing-md)", options: { color: C.green, breakLine: false } },
      { text: ";", options: { color: C.lightGray, breakLine: true } },
      { text: "}", options: { color: C.lightGray } },
    ], { x: 5.5, y: 1.75, w: 3.9, h: 1.0, fontSize: 11, fontFace: "Consolas", margin: 0 });

    // Token hierarchy — three layers with expanded examples (from Pres2)
    const layers = [
      {
        title: "Primitives",
        desc: "Raw values",
        items: "blue-500: #3B82F6\ngray-100: #F3F4F6\nfont-sans: 'Inter'\nsize-4: 16px",
        color: C.deepBlue,
      },
      {
        title: "Semantics",
        desc: "Meaningful names",
        items: "color-primary: blue-500\ncolor-surface: gray-100\nfont-body: font-sans\nspacing-md: size-4",
        color: C.teal,
      },
      {
        title: "Component",
        desc: "Specific usage",
        items: "button-bg: color-primary\ncard-bg: color-surface\ncard-padding: spacing-md",
        color: C.midnight,
      },
    ];
    layers.forEach((l, i) => {
      const cx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.1, w: 2.8, h: 1.6, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.1, w: 2.8, h: 0.06, fill: { color: l.color } });
      s.addText(l.title, { x: cx + 0.15, y: 3.2, w: 2.5, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: l.color, align: "center", margin: 0 });
      s.addText(l.desc, { x: cx + 0.15, y: 3.45, w: 2.5, h: 0.2, fontSize: 10, fontFace: "Calibri", color: C.medGray, align: "center", margin: 0 });
      s.addText(l.items, { x: cx + 0.15, y: 3.7, w: 2.5, h: 0.85, fontSize: 9, fontFace: "Consolas", color: C.bodyText, margin: 0 });
      if (i < 2) {
        s.addText("\u2192", { x: cx + 2.8, y: 3.5, w: 0.3, h: 0.5, fontSize: 18, color: C.medGray, align: "center", valign: "middle", margin: 0 });
      }
    });

    // Bottom callout (critical note from Pres2)
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.9, w: 8.6, h: 0.35, fill: { color: C.navy } });
    s.addText([
      { text: "Critical: ", options: { bold: true, color: C.orange } },
      { text: "Figma Variables must be created by designers. get_variable_defs is selection-scoped \u2014 no Variables = empty results.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.9, w: 8.2, h: 0.35, fontSize: 11, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 6: The End-to-End Pipeline
  // (from Pres1 slide 6)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The End-to-End Pipeline", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Steps 5\u20136 iterate until the component matches your standards", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });

    const steps = [
      { num: "1", label: "Install Figma MCP", detail: "claude mcp add --transport http figma ...", color: C.medGray },
      { num: "2", label: "Share Figma Frame URL", detail: "\"Generate a component from this frame: https://...\"", color: C.deepBlue },
      { num: "3", label: "Specify Tech Stack", detail: "\"React 16 class components, Reactstrap, SCSS\"", color: C.teal },
      { num: "4", label: "Claude Extracts Tokens", detail: "get_variable_defs \u2192 colors, spacing, typography (requires Figma Variables)", color: C.midnight },
      { num: "5", label: "Claude Generates Component", detail: "get_design_context \u2192 React component with your constraints", color: C.accent },
      { num: "6", label: "You Review and Refine", detail: "\"Use our Card component\" \u2192 \"Add i18n wrappers\"", color: C.orange },
      { num: "7", label: "Integrate into Project", detail: "Place in directory, add routes, connect to API", color: C.green },
    ];

    steps.forEach((st, i) => {
      const sy = 1.2 + i * 0.5;
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, { x: 1.15, y: sy + 0.4, w: 0, h: 0.1, line: { color: C.lightGray, width: 2 } });
      }
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: sy, w: 7.5, h: 0.42, fill: { color: C.white }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: sy, w: 0.05, h: 0.42, fill: { color: st.color } });
      addIconCircle(s, pres, 0.8, sy + 0.01, 0.38, st.color, st.num);
      s.addText(st.label, { x: 1.75, y: sy, w: 2.5, h: 0.42, fontSize: 12, fontFace: "Calibri", bold: true, color: C.darkText, valign: "middle", margin: 0 });
      s.addText(st.detail, { x: 4.1, y: sy, w: 4.7, h: 0.42, fontSize: 10, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.35, fill: { color: C.navy } });
    s.addText("Not a one-shot process. The review-refine loop is what makes output production-ready.", {
      x: 0.7, y: 4.85, w: 8.6, h: 0.35, fontSize: 12, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 7: Specifying Your Tech Stack
  // (from Pres1 slide 7)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Specifying Your Tech Stack", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Why it matters \u2014 Claude defaults to React + Tailwind + TypeScript", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Left: energycorp stack
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.35, w: 4.3, h: 2.8, fill: { color: C.navy } });
    s.addText("energycorp uses:", { x: 0.9, y: 1.45, w: 3, h: 0.25, fontSize: 11, fontFace: "Calibri", bold: true, color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "\u2022 React 16 ", options: { color: C.lightGray, breakLine: false } },
      { text: "(class components, no hooks)", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 Reactstrap ", options: { color: C.lightGray, breakLine: false } },
      { text: "(Bootstrap 4 components)", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 SCSS ", options: { color: C.lightGray, breakLine: false } },
      { text: "(Paper Dashboard template)", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 counterpart ", options: { color: C.lightGray, breakLine: false } },
      { text: "for i18n", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 Redux ", options: { color: C.lightGray, breakLine: false } },
      { text: "for language state only", options: { color: C.medGray, breakLine: true } },
      { text: "\u2022 Axios ", options: { color: C.lightGray, breakLine: false } },
      { text: "for API calls", options: { color: C.medGray } },
    ], { x: 0.9, y: 1.8, w: 3.9, h: 2.2, fontSize: 12, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 6 });

    // Right: fill-in template
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.35, w: 4.3, h: 2.8, fill: { color: C.navy } });
    s.addText("Your project (fill in):", { x: 5.5, y: 1.45, w: 3, h: 0.25, fontSize: 11, fontFace: "Calibri", bold: true, color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "\u2022 React version: ___", options: { color: C.lightGray, breakLine: true } },
      { text: "\u2022 Component style: ___", options: { color: C.lightGray, breakLine: true } },
      { text: "\u2022 UI library: ___", options: { color: C.lightGray, breakLine: true } },
      { text: "\u2022 Styling approach: ___", options: { color: C.lightGray, breakLine: true } },
      { text: "\u2022 State management: ___", options: { color: C.lightGray, breakLine: true } },
      { text: "\u2022 i18n library: ___", options: { color: C.lightGray, breakLine: true } },
      { text: "\u2022 API client: ___", options: { color: C.lightGray } },
    ], { x: 5.5, y: 1.8, w: 3.9, h: 2.2, fontSize: 12, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 6 });

    // How to tell Claude
    s.addText("Three ways to tell Claude your stack:", { x: 0.7, y: 4.35, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const ways = [
      { label: "In the prompt", desc: "Immediate, one-time", color: C.deepBlue },
      { label: "In CLAUDE.md", desc: "Permanent, every session", color: C.teal },
      { label: "In rules file", desc: "Detailed patterns", color: C.midnight },
    ];
    ways.forEach((w, i) => {
      const wx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: wx, y: 4.7, w: 2.8, h: 0.55, fill: { color: C.offWhite } });
      s.addText(w.label, { x: wx + 0.15, y: 4.72, w: 2.5, h: 0.25, fontSize: 12, fontFace: "Calibri", bold: true, color: w.color, margin: 0 });
      s.addText(w.desc, { x: wx + 0.15, y: 4.97, w: 2.5, h: 0.22, fontSize: 10, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 8: Frontend Rules File
  // (from Pres1 slide 8)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("What Goes in Your Frontend Rules File", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText(".claude/rules/frontend-patterns.md", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 14, fontFace: "Consolas", color: C.teal, margin: 0 });

    // Code block with template
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 5.5, h: 3.5, fill: { color: C.navy } });
    s.addText([
      { text: "# Frontend Conventions", options: { color: C.white, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "## Tech Stack", options: { color: C.accentAlt, breakLine: true } },
      { text: "- React [version] with [component style]", options: { color: C.lightGray, breakLine: true } },
      { text: "- [UI library] for base components", options: { color: C.lightGray, breakLine: true } },
      { text: "- [Styling approach]", options: { color: C.lightGray, breakLine: true } },
      { text: "- [State management]", options: { color: C.lightGray, breakLine: true } },
      { text: "- [i18n library] for translations", options: { color: C.lightGray, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "## Component Structure", options: { color: C.accentAlt, breakLine: true } },
      { text: "- Components go in [your dirs]", options: { color: C.lightGray, breakLine: true } },
      { text: "- [Naming conventions]", options: { color: C.lightGray, breakLine: true } },
      { text: "- [Export patterns]", options: { color: C.lightGray, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "## Styling", options: { color: C.accentAlt, breakLine: true } },
      { text: "- [Where style files live]", options: { color: C.lightGray, breakLine: true } },
      { text: "- [No Tailwind / no inline styles]", options: { color: C.orange, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "## When Generating from Figma", options: { color: C.accentAlt, breakLine: true } },
      { text: "- Always use [UI library] components", options: { color: C.lightGray, breakLine: true } },
      { text: "- Follow structure of [example path]", options: { color: C.green } },
    ], { x: 0.9, y: 1.4, w: 5.1, h: 3.3, fontSize: 10, fontFace: "Consolas", margin: 0, paraSpaceAfter: 0 });

    // Right: why it matters
    const benefits = [
      { icon: "1", label: "Auto-loaded", desc: "Claude reads this at session start \u2014 no need to repeat", color: C.deepBlue },
      { icon: "2", label: "Consistent output", desc: "Every generated component follows your conventions", color: C.teal },
      { icon: "3", label: "Team-shared", desc: "Committed to git, whole team benefits", color: C.midnight },
      { icon: "4", label: "Builds on Session 2", desc: "Same pattern as testing.md and api-conventions.md", color: C.accent },
    ];
    benefits.forEach((b, i) => {
      const by = 1.3 + i * 0.85;
      addIconCircle(s, pres, 6.5, by + 0.05, 0.4, b.color, b.icon);
      s.addText(b.label, { x: 7.05, y: by, w: 2.6, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: b.color, margin: 0 });
      s.addText(b.desc, { x: 7.05, y: by + 0.3, w: 2.6, h: 0.4, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 9: Why Generated Code Needs Review
  // (from Pres2 slide 2)
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
      const srcY = 3.85;
      s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 3.8, w: 2.8, h: 0.7, fill: { color: C.white }, shadow: makeCardShadow() });
      addIconCircle(s, pres, sx + 0.1, srcY, 0.4, src.color, src.num);
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
  // SLIDE 10: The Review-Refine Workflow
  // (from Pres2 slide 4)
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
  // SLIDE 11: The Review Checklist
  // (from Pres2 slide 5)
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
  // SLIDE 12: Common Pitfalls (1/2)
  // (from Pres2 slide 6)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Common Pitfalls (1/2)", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });

    // Pitfall 1: React version mismatch
    s.addText("1. React Version Mismatch", { x: 0.7, y: 1.0, w: 8.6, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.red, margin: 0 });

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
  // SLIDE 13: Common Pitfalls (2/2)
  // (from Pres2 slide 7)
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
  // SLIDE 14: Best Practices for Prompting
  // (from Pres2 slide 9)
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
  // SLIDE 15: Limitations to Know
  // (from Pres1 slide 9)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Limitations to Know", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Being honest about limits builds trust with your team", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });

    const limitations = [
      { limit: "Tokens need Figma Variables", impact: "get_variable_defs returns nothing without them", fix: "Designers must create Variables manually", color: C.deepBlue },
      { limit: "get_variable_defs is scoped", impact: "Only returns variables on selected layers", fix: "Select the right frames first", color: C.teal },
      { limit: "Default tech stack", impact: "Outputs React + Tailwind unless specified", fix: "Always specify your stack", color: C.midnight },
      { limit: "Code Connect needs paid plan", impact: "Requires Figma Organization/Enterprise", fix: "Start without it; add later", color: C.orange },
      { limit: "No animation conversion", impact: "Figma transitions don't transfer", fix: "Add animations manually", color: C.accent },
      { limit: "Generated code needs review", impact: "May use wrong library versions", fix: "Review all imports and deps", color: C.red },
    ];

    // Table header
    const headerY = 1.3;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: headerY, w: 8.6, h: 0.45, fill: { color: C.deepBlue } });
    s.addText("Limitation", { x: 0.8, y: headerY, w: 2.4, h: 0.45, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: [0, 0, 0, 8] });
    s.addText("Impact", { x: 3.2, y: headerY, w: 2.8, h: 0.45, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: [0, 0, 0, 8] });
    s.addText("Workaround", { x: 6.0, y: headerY, w: 3.3, h: 0.45, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: [0, 0, 0, 8] });

    limitations.forEach((lim, i) => {
      const ly = 1.75 + i * 0.52;
      const fill = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: ly, w: 8.6, h: 0.48, fill: { color: fill } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: ly, w: 0.06, h: 0.48, fill: { color: lim.color } });
      s.addText(lim.limit, { x: 0.9, y: ly, w: 2.3, h: 0.48, fontSize: 10, fontFace: "Calibri", bold: true, color: C.darkText, valign: "middle", margin: 0 });
      s.addText(lim.impact, { x: 3.2, y: ly, w: 2.8, h: 0.48, fontSize: 10, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
      s.addText(lim.fix, { x: 6.0, y: ly, w: 3.3, h: 0.48, fontSize: 10, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.95, w: 8.6, h: 0.35, fill: { color: C.navy } });
    s.addText("Figma MCP excels at individual frames and tokens. It does not replace architecture decisions.", {
      x: 0.7, y: 4.95, w: 8.6, h: 0.35, fontSize: 12, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 16: Key Takeaways (merged from both presentations)
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    for (let i = 1; i < 6; i++) {
      s.addShape(pres.shapes.LINE, { x: 0, y: i * 0.95, w: 10, h: 0, line: { color: C.deepBlue, width: 0.3 } });
    }
    s.addText("Key Takeaways", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 32, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });

    const takeaways = [
      { text: "Figma MCP = direct design access", sub: "No screenshots, no manual descriptions \u2014 Claude reads the design data" },
      { text: "Design tokens bridge design and code", sub: "Primitives \u2192 Semantics \u2192 Components; quality depends on Figma Variables" },
      { text: "Always specify your tech stack", sub: "Claude defaults to React + Tailwind + TypeScript \u2014 use rules files for consistency" },
      { text: "Review is mandatory, not optional", sub: "Check imports, patterns, dependencies \u2014 the checklist makes output production-ready" },
      { text: "Five common pitfalls are all preventable", sub: "Version mismatch, wrong UI lib, missing i18n, phantom imports, over-engineering" },
      { text: "Rules files + reference components save time", sub: "One-time setup \u2192 permanent benefit; every minute of config saves ten of refinement" },
    ];
    takeaways.forEach((t, i) => {
      const ty = 1.1 + i * 0.7;
      s.addText((i + 1).toString(), { x: 0.8, y: ty, w: 0.4, h: 0.35, fontSize: 20, fontFace: "Calibri", bold: true, color: C.accent, margin: 0 });
      s.addText(t.text, { x: 1.4, y: ty, w: 7.5, h: 0.32, fontSize: 16, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });
      s.addText(t.sub, { x: 1.4, y: ty + 0.32, w: 7.5, h: 0.28, fontSize: 12, fontFace: "Calibri", color: C.medGray, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 5.0, w: 8.6, h: 0.04, fill: { color: C.accent } });
    s.addText("Next: Hands-on lab \u2014 Figma MCP install, token extraction, component generation", {
      x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.medGray, margin: 0
    });
  }

  const outPath = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_3/Session_3_Combined.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Combined presentation written to:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
