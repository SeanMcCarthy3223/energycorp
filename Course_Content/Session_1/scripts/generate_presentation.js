const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "EnergyCorp Training";
pres.title = "Claude Code: AI-Powered Software Engineering - Session 1";

// ─── Color Palette (Tech / AI theme) ───
const C = {
  darkBg:    "0F172A",
  contentBg: "F8FAFC",
  cardBg:    "FFFFFF",
  accent:    "0EA5E9",
  accent2:   "0D9488",
  accent3:   "8B5CF6",
  darkText:  "1E293B",
  mutedText: "64748B",
  lightText: "FFFFFF",
  border:    "E2E8F0",
  success:   "10B981",
  warning:   "F59E0B",
  danger:    "EF4444",
};

const FONT_H = "Trebuchet MS";
const FONT_B = "Calibri";

// Helper: create fresh shadow
const cardShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 });

// ═══════════════════════════════════════════
// SLIDE 1: Title
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Accent bar at top
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

  // Main title
  slide.addText("Claude Code", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.2,
    fontSize: 48, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  slide.addText("AI-Powered Software Engineering", {
    x: 0.8, y: 2.3, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: FONT_B, color: C.accent, margin: 0,
  });

  // Divider line
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.accent } });

  slide.addText("Session 1 — Introduction & Safe Usage Patterns", {
    x: 0.8, y: 3.6, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: FONT_B, color: C.mutedText, margin: 0,
  });
}

// ═══════════════════════════════════════════
// SLIDE 2: What is Claude?
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  // Header bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("What is Claude?", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  // Key distinction callout card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 9.0, h: 1.1,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 0.07, h: 1.1, fill: { color: C.accent } });
  slide.addText([
    { text: "Key distinction: ", options: { bold: true, color: C.accent, fontSize: 15, fontFace: FONT_H } },
    { text: "Claude is not a search engine, not a database, and not a compiler. It's a ", options: { fontSize: 14, fontFace: FONT_B, color: C.darkText } },
    { text: "reasoning engine", options: { italic: true, bold: true, fontSize: 14, fontFace: FONT_B, color: C.darkText } },
    { text: " that predicts what good code looks like based on patterns learned from training data.", options: { fontSize: 14, fontFace: FONT_B, color: C.darkText } },
  ], { x: 0.8, y: 1.3, w: 8.5, h: 0.9, valign: "middle", margin: 0 });

  // "What this means for you" section
  slide.addText("What this means for you:", {
    x: 0.8, y: 2.6, w: 8.4, h: 0.4,
    fontSize: 18, fontFace: FONT_H, color: C.darkText, bold: true, margin: 0,
  });

  // Three cards in a row
  const cards = [
    { title: "Write & Debug", desc: "It can write code, explain code, refactor code, and debug code", color: C.accent },
    { title: "Fresh Each Session", desc: "It doesn't \"know\" your project \u2014 it reads it fresh each session (without explicit memory config)", color: C.accent2 },
    { title: "Confident Mistakes", desc: "It can be wrong, and it will be confident about it", color: C.warning },
  ];

  cards.forEach((card, i) => {
    const cx = 0.5 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 3.15, w: 2.85, h: 2.1,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.15, w: 2.85, h: 0.06, fill: { color: card.color } });
    slide.addText(card.title, {
      x: cx + 0.2, y: 3.4, w: 2.45, h: 0.4,
      fontSize: 15, fontFace: FONT_H, color: card.color, bold: true, margin: 0,
    });
    slide.addText(card.desc, {
      x: cx + 0.2, y: 3.85, w: 2.45, h: 1.2,
      fontSize: 12, fontFace: FONT_B, color: C.mutedText, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════
// SLIDE 3: The Claude Model Family
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("The Claude Model Family", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  // Model table
  const headerOpts = { fill: { color: C.darkBg }, color: C.lightText, bold: true, fontFace: FONT_H, fontSize: 13, align: "center", valign: "middle" };
  const cellOpts = { fill: { color: C.cardBg }, color: C.darkText, fontFace: FONT_B, fontSize: 12, valign: "middle", align: "center" };
  const accentCell = (text, color) => ({ text, options: { ...cellOpts, color, bold: true } });

  const tableRows = [
    [
      { text: "Model", options: headerOpts },
      { text: "Strengths", options: headerOpts },
      { text: "Best For", options: headerOpts },
      { text: "Cost", options: headerOpts },
    ],
    [
      accentCell("Opus", C.accent3),
      { text: "Deep reasoning, complex analysis, nuanced judgment", options: { ...cellOpts, align: "left" } },
      { text: "Architecture decisions, hard debugging, multi-file refactors", options: { ...cellOpts, align: "left" } },
      { text: "$$$", options: { ...cellOpts, bold: true, color: C.accent3 } },
    ],
    [
      accentCell("Sonnet", C.accent),
      { text: "Strong all-around performance, good speed", options: { ...cellOpts, align: "left" } },
      { text: "Daily coding tasks, code generation, reviews", options: { ...cellOpts, align: "left" } },
      { text: "$$", options: { ...cellOpts, bold: true, color: C.accent } },
    ],
    [
      accentCell("Haiku", C.accent2),
      { text: "Fast, lightweight, cost-efficient", options: { ...cellOpts, align: "left" } },
      { text: "Quick lookups, simple questions, sub-agent tasks", options: { ...cellOpts, align: "left" } },
      { text: "$", options: { ...cellOpts, bold: true, color: C.accent2 } },
    ],
  ];

  slide.addTable(tableRows, {
    x: 0.5, y: 1.2, w: 9.0,
    colW: [1.2, 2.8, 3.2, 0.8],
    border: { pt: 0.5, color: C.border },
    rowH: [0.5, 0.7, 0.7, 0.7],
  });

  // "In Claude Code" section
  slide.addText("In Claude Code:", {
    x: 0.8, y: 3.8, w: 8.4, h: 0.35,
    fontSize: 16, fontFace: FONT_H, color: C.darkText, bold: true, margin: 0,
  });

  slide.addText([
    { text: "Sonnet is the default for most operations", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: FONT_B, color: C.darkText } },
    { text: "Haiku powers the Explore sub-agent (fast codebase searches)", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: FONT_B, color: C.darkText } },
    { text: "Opus is available for Plan Mode deep reasoning and complex tasks", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: FONT_B, color: C.darkText } },
    { text: "Switch models with /model or configure in settings", options: { bullet: true, fontSize: 13, fontFace: FONT_B, color: C.darkText } },
  ], { x: 0.8, y: 4.15, w: 8.4, h: 1.4, margin: 0 });
}

// ═══════════════════════════════════════════
// SLIDE 4: Three Ways to Use Claude
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("Three Ways to Use Claude", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  const ways = [
    {
      num: "1", title: "Claude Chat", subtitle: "Web \u2014 claude.ai", color: C.accent,
      bullets: [
        "Browser-based conversation",
        "Upload files, paste code",
        "No project access",
        "Best for: research, brainstorming",
      ],
    },
    {
      num: "2", title: "Claude Code", subtitle: "CLI \u2014 Terminal", color: C.accent2,
      bullets: [
        "Runs in your terminal",
        "Reads filesystem, runs commands",
        "Full agentic loop",
        "Best for: real development work",
      ],
    },
    {
      num: "3", title: "Claude Code", subtitle: "IDE \u2014 VS Code / JetBrains", color: C.accent3,
      bullets: [
        "Same engine, embedded in editor",
        "Inline diffs with accept/reject",
        "@ mentions from open files",
        "Best for: pair programming",
      ],
    },
  ];

  ways.forEach((way, i) => {
    const cx = 0.5 + i * 3.1;
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.2, w: 2.85, h: 4.1,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: cx + 0.15, y: 1.4, w: 0.55, h: 0.55,
      fill: { color: way.color },
    });
    slide.addText(way.num, {
      x: cx + 0.15, y: 1.4, w: 0.55, h: 0.55,
      fontSize: 22, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Title
    slide.addText(way.title, {
      x: cx + 0.85, y: 1.4, w: 1.8, h: 0.35,
      fontSize: 16, fontFace: FONT_H, color: C.darkText, bold: true, margin: 0,
    });
    slide.addText(way.subtitle, {
      x: cx + 0.85, y: 1.72, w: 1.8, h: 0.3,
      fontSize: 11, fontFace: FONT_B, color: C.mutedText, margin: 0,
    });
    // Divider
    slide.addShape(pres.shapes.RECTANGLE, { x: cx + 0.15, y: 2.15, w: 2.55, h: 0.02, fill: { color: C.border } });
    // Bullets
    const bulletItems = way.bullets.map((b, bi) => ({
      text: b,
      options: { bullet: true, fontSize: 12, fontFace: FONT_B, color: C.darkText, breakLine: bi < way.bullets.length - 1 },
    }));
    slide.addText(bulletItems, {
      x: cx + 0.15, y: 2.3, w: 2.55, h: 2.8, margin: 0, paraSpaceAfter: 6,
    });
  });
}

// ═══════════════════════════════════════════
// SLIDE 5: Claude Chat — When to Use It
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("Claude Chat \u2014 When to Use It", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  // Left column - DO use
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 4.2, h: 3.3,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("Use Claude Chat for:", {
    x: 0.7, y: 1.4, w: 3.8, h: 0.4,
    fontSize: 16, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Brainstorming new architecture approaches", options: { bullet: true, breakLine: true } },
    { text: "Research: Use Claude's \"Research Mode\" for deep research on a topic", options: { bullet: true, breakLine: true } },
    { text: "PMs: One-off document creation (Word, PowerPoint, etc.)", options: { bullet: true } },
  ], { x: 0.7, y: 1.85, w: 3.8, h: 2.5, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 8 });

  // Right column - DON'T use
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.2, h: 3.3,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.2, w: 4.2, h: 0.06, fill: { color: C.danger } });
  slide.addText("Don't use Claude Chat for:", {
    x: 5.5, y: 1.4, w: 3.8, h: 0.4,
    fontSize: 16, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Writing code that integrates with your project", options: { bullet: true, breakLine: true } },
    { text: "Tasks requiring reading multiple project files", options: { bullet: true, breakLine: true } },
    { text: "Explaining error messages or stack traces", options: { bullet: true, breakLine: true } },
    { text: "Anything that needs to run commands or tests", options: { bullet: true } },
  ], { x: 5.5, y: 1.85, w: 3.8, h: 2.5, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 8 });

  // Pro tip bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.75, w: 9.0, h: 0.65,
    fill: { color: "EFF6FF" }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.75, w: 0.07, h: 0.65, fill: { color: C.accent } });
  slide.addText([
    { text: "Pro tip: ", options: { bold: true, color: C.accent } },
    { text: "Claude Chat with Research Mode can search the web for up-to-date documentation. Useful when evaluating new dependencies.", options: { color: C.darkText } },
  ], { x: 0.8, y: 4.75, w: 8.5, h: 0.65, fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0 });
}

// ═══════════════════════════════════════════
// SLIDE 6: Claude Code — The Core Tool
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("Claude Code \u2014 The Core Tool", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  slide.addText("An agentic coding assistant that runs in your terminal (or IDE) with access to your full project.", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });

  // Left - What it CAN do
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 4.2, h: 3.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("What it can do:", {
    x: 0.7, y: 1.9, w: 3.8, h: 0.35,
    fontSize: 16, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Read and write files anywhere in your project", options: { bullet: true, breakLine: true } },
    { text: "Run shell commands (build, test, lint, deploy)", options: { bullet: true, breakLine: true } },
    { text: "Search your codebase (grep, glob, file patterns)", options: { bullet: true, breakLine: true } },
    { text: "Access the internet (private APIs need MCP config)", options: { bullet: true, breakLine: true } },
    { text: "Create branches, commits, and PRs", options: { bullet: true, breakLine: true } },
    { text: "Spawn sub-agents for parallel work", options: { bullet: true } },
  ], { x: 0.7, y: 2.3, w: 3.8, h: 2.8, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 6 });

  // Right - What it CANNOT do
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.7, w: 4.2, h: 3.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.7, w: 4.2, h: 0.06, fill: { color: C.danger } });
  slide.addText("What it cannot do:", {
    x: 5.5, y: 1.9, w: 3.8, h: 0.35,
    fontSize: 16, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Remember previous sessions (without memory config)", options: { bullet: true, breakLine: true } },
    { text: "Run indefinitely \u2014 it has a context window that fills up", options: { bullet: true, breakLine: true } },
    { text: "Guarantee correctness \u2014 it can and will make mistakes", options: { bullet: true } },
  ], { x: 5.5, y: 2.3, w: 3.8, h: 2.8, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 6 });
}

// ═══════════════════════════════════════════
// SLIDE 7: CLAUDE.md — Your Highest-Leverage File
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("CLAUDE.md \u2014 Your Highest-Leverage File", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  // Tagline
  slide.addText("Think of it as: onboarding documentation for the AI, not for humans.", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });

  // Left card - What to include
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.65, w: 4.2, h: 3.0,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.65, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("What to include (~50-80 lines):", {
    x: 0.7, y: 1.85, w: 3.8, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "One-line project description", options: { bullet: true, breakLine: true } },
    { text: "Tech stack (exact versions matter)", options: { bullet: true, breakLine: true } },
    { text: "Build, test, and lint commands", options: { bullet: true, breakLine: true } },
    { text: "Architecture overview (app structure, key patterns)", options: { bullet: true, breakLine: true } },
    { text: "Important relationships and gotchas", options: { bullet: true, breakLine: true } },
    { text: "What NOT to do (critical constraints)", options: { bullet: true } },
  ], { x: 0.7, y: 2.25, w: 3.8, h: 2.2, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 4 });

  // Right card - What NOT to include
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.65, w: 4.2, h: 3.0,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.65, w: 4.2, h: 0.06, fill: { color: C.danger } });
  slide.addText("What NOT to include:", {
    x: 5.5, y: 1.85, w: 3.8, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Generic instructions (\"write clean code\")", options: { bullet: true, breakLine: true } },
    { text: "Formatting rules \u2014 use linters instead", options: { bullet: true, breakLine: true } },
    { text: "Everything \u2014 keep it lean (~150-200 instructions max)", options: { bullet: true } },
  ], { x: 5.5, y: 2.25, w: 3.8, h: 2.2, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 4 });

  // Hierarchy bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9.0, h: 0.55,
    fill: { color: C.darkBg },
  });
  slide.addText([
    { text: "Hierarchy:  ", options: { bold: true, color: C.accent } },
    { text: "managed  >  command-line  >  local  >  project  >  user", options: { color: C.lightText } },
    { text: "    (More specific always wins)", options: { color: C.mutedText, italic: true } },
  ], { x: 0.8, y: 4.85, w: 8.5, h: 0.55, fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0 });
}

// ═══════════════════════════════════════════
// SLIDE 8: The settings.json 5-Tier Hierarchy
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("The settings.json 5-Tier Hierarchy", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  const tiers = [
    { num: "1", name: "Managed", path: "/etc/claude-code/", note: "IT-deployed, highest priority", color: C.accent3 },
    { num: "2", name: "CLI", path: "--settings flag", note: "Session only", color: C.accent },
    { num: "3", name: "Local", path: ".claude/settings.local.json", note: "Personal, gitignored", color: C.accent2 },
    { num: "4", name: "Project", path: ".claude/settings.json", note: "Shared, committed", color: C.success },
    { num: "5", name: "User", path: "~/.claude/settings.json", note: "Personal, all projects", color: C.warning },
  ];

  tiers.forEach((tier, i) => {
    const ty = 1.15 + i * 0.62;
    // Number badge
    slide.addShape(pres.shapes.OVAL, {
      x: 0.6, y: ty + 0.05, w: 0.45, h: 0.45,
      fill: { color: tier.color },
    });
    slide.addText(tier.num, {
      x: 0.6, y: ty + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Content card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.2, y: ty, w: 8.2, h: 0.52,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    slide.addText(tier.name, {
      x: 1.4, y: ty, w: 1.3, h: 0.52,
      fontSize: 14, fontFace: FONT_H, color: tier.color, bold: true, valign: "middle", margin: 0,
    });
    slide.addText(tier.path, {
      x: 2.8, y: ty, w: 3.5, h: 0.52,
      fontSize: 12, fontFace: "Consolas", color: C.darkText, valign: "middle", margin: 0,
    });
    slide.addText(tier.note, {
      x: 6.5, y: ty, w: 2.8, h: 0.52,
      fontSize: 11, fontFace: FONT_B, color: C.mutedText, italic: true, valign: "middle", align: "right", margin: 0,
    });
  });

  // Key settings section
  slide.addText("Key settings:", {
    x: 0.8, y: 4.4, w: 8.4, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.darkText, bold: true, margin: 0,
  });
  slide.addText([
    { text: "permissions.allow / deny \u2014 what Claude can run without asking", options: { bullet: true, breakLine: true } },
    { text: "defaultMode \u2014 start in plan/default/acceptEdits mode", options: { bullet: true, breakLine: true } },
    { text: "model \u2014 override the default model", options: { bullet: true } },
  ], { x: 0.8, y: 4.75, w: 8.4, h: 0.8, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 4 });
}

// ═══════════════════════════════════════════
// SLIDE 9: Research Mode
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("Research Mode", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  slide.addText("Available in Claude Chat (web) \u2014 tells Claude to search the web before answering, then cite sources.", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });

  // Left - When to use
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 4.2, h: 2.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("When to use it:", {
    x: 0.7, y: 1.9, w: 3.8, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Evaluating a new library (e.g., \"Django Ninja vs DRF?\")", options: { bullet: true, breakLine: true } },
    { text: "Checking for recent breaking changes in a dependency", options: { bullet: true, breakLine: true } },
    { text: "Finding current best practices for a technology", options: { bullet: true } },
  ], { x: 0.7, y: 2.3, w: 3.8, h: 1.8, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 8 });

  // Right - When NOT to use
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.7, w: 4.2, h: 2.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.7, w: 4.2, h: 0.06, fill: { color: C.danger } });
  slide.addText("When NOT to use it:", {
    x: 5.5, y: 1.9, w: 3.8, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Questions about your own codebase (Claude Chat can't see it)", options: { bullet: true, breakLine: true } },
    { text: "Simple coding tasks (it adds latency)", options: { bullet: true } },
  ], { x: 5.5, y: 2.3, w: 3.8, h: 1.8, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 8 });
}

// ═══════════════════════════════════════════
// SLIDE 10: Extended Thinking
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("Extended Thinking", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  slide.addText("Claude can \"think step by step\" before answering, showing its reasoning process.", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });

  // Three cards
  const thinkCards = [
    {
      title: "How it works", color: C.accent,
      bullets: [
        "Generates internal reasoning tokens before visible response",
        "Enable with alwaysThinkingEnabled: true in settings",
        "Opus engages deep reasoning automatically",
      ],
    },
    {
      title: "When it helps", color: C.accent2,
      bullets: [
        "Debugging complex issues with multiple possible causes",
        "Planning a multi-step refactor",
        "Understanding unfamiliar code with complex logic",
      ],
    },
    {
      title: "Trade-off", color: C.warning,
      bullets: [
        "More thinking = better answers",
        "But more tokens and longer wait",
        "For quick tasks, it's overhead",
      ],
    },
  ];

  thinkCards.forEach((card, i) => {
    const cx = 0.5 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.65, w: 2.85, h: 3.6,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.65, w: 2.85, h: 0.06, fill: { color: card.color } });
    slide.addText(card.title, {
      x: cx + 0.2, y: 1.85, w: 2.45, h: 0.4,
      fontSize: 16, fontFace: FONT_H, color: card.color, bold: true, margin: 0,
    });
    const bulletItems = card.bullets.map((b, bi) => ({
      text: b,
      options: { bullet: true, fontSize: 12, fontFace: FONT_B, color: C.darkText, breakLine: bi < card.bullets.length - 1 },
    }));
    slide.addText(bulletItems, {
      x: cx + 0.2, y: 2.35, w: 2.45, h: 2.7, margin: 0, paraSpaceAfter: 8,
    });
  });
}

// ═══════════════════════════════════════════
// SLIDE 11: Plan Mode — Your Safety Net
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("Plan Mode \u2014 Your Safety Net", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  slide.addText("Restricts Claude to read-only operations. No file edits, no commands.", {
    x: 0.8, y: 1.05, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });

  // Top row: CAN / CANNOT side by side
  // CAN
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.55, w: 4.2, h: 1.8, fill: { color: C.cardBg }, shadow: cardShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.55, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("CAN do in Plan Mode:", {
    x: 0.7, y: 1.7, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Read files (Read, Glob, Grep)", options: { bullet: true, breakLine: true } },
    { text: "Search the web (WebSearch, WebFetch)", options: { bullet: true, breakLine: true } },
    { text: "Spawn research sub-agents", options: { bullet: true, breakLine: true } },
    { text: "Write a plan and present it for approval", options: { bullet: true } },
  ], { x: 0.7, y: 2.05, w: 3.8, h: 1.2, fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 3 });

  // CANNOT
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.55, w: 4.2, h: 1.8, fill: { color: C.cardBg }, shadow: cardShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.55, w: 4.2, h: 0.06, fill: { color: C.danger } });
  slide.addText("CANNOT do in Plan Mode:", {
    x: 5.5, y: 1.7, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Edit or create files", options: { bullet: true, breakLine: true } },
    { text: "Run shell commands", options: { bullet: true, breakLine: true } },
    { text: "Make any changes to your project", options: { bullet: true } },
  ], { x: 5.5, y: 2.05, w: 3.8, h: 1.2, fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 3 });

  // Bottom left: How to activate
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.55, w: 4.2, h: 1.85, fill: { color: C.cardBg }, shadow: cardShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.55, w: 4.2, h: 0.06, fill: { color: C.accent } });
  slide.addText("How to activate:", {
    x: 0.7, y: 3.7, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.accent, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Shift+Tab twice (cycles: Normal > Auto-Accept > Plan)", options: { bullet: true, breakLine: true } },
    { text: "/plan command", options: { bullet: true, breakLine: true } },
    { text: "--permission-mode plan flag", options: { bullet: true, breakLine: true } },
    { text: "Set as default: \"defaultMode\": \"plan\" in settings", options: { bullet: true } },
  ], { x: 0.7, y: 4.05, w: 3.8, h: 1.2, fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 3 });

  // Bottom right: Recommended workflow
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 3.55, w: 4.2, h: 1.85, fill: { color: C.cardBg }, shadow: cardShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 3.55, w: 4.2, h: 0.06, fill: { color: C.accent3 } });
  slide.addText("Recommended workflow:", {
    x: 5.5, y: 3.7, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.accent3, bold: true, margin: 0,
  });
  slide.addText([
    { text: "1. Start in Plan Mode \u2014 let Claude analyze and propose", options: { breakLine: true } },
    { text: "2. Review the plan \u2014 edit if needed", options: { breakLine: true } },
    { text: "3. Switch to Normal Mode \u2014 let Claude execute", options: { breakLine: true } },
    { text: "4. Verify \u2014 run tests, review diffs", options: {} },
  ], { x: 5.5, y: 4.05, w: 3.8, h: 1.2, fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 3 });
}

// ═══════════════════════════════════════════
// SLIDE 12: What Claude Cannot Do — Honest Boundaries
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.contentBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText("What Claude Cannot Do \u2014 Honest Boundaries", {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  // Three columns
  const cols = [
    {
      title: "Does not...", color: C.danger,
      items: [
        "Truly understand your business logic",
        "Remember between sessions",
        "Run and test visually (without MCPs)",
        "Access private services directly",
        "Guarantee output compiles or is secure",
      ],
    },
    {
      title: "Struggles with...", color: C.warning,
      items: [
        "Very large files (>1000 lines)",
        "Cross-cutting concerns spanning many files",
        "Precise numerical computation",
        "Projects with no documentation",
        "Proprietary frameworks, niche languages",
      ],
    },
    {
      title: "Excels at...", color: C.success,
      items: [
        "Clear patterns (CRUD, serializers, tests)",
        "Well-documented codebases",
        "Iterative development with test feedback",
        "Explaining and refactoring code",
        "Boilerplate and repetitive tasks",
      ],
    },
  ];

  cols.forEach((col, i) => {
    const cx = 0.5 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.15, w: 2.85, h: 4.2,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.15, w: 2.85, h: 0.06, fill: { color: col.color } });
    slide.addText(col.title, {
      x: cx + 0.2, y: 1.35, w: 2.45, h: 0.4,
      fontSize: 16, fontFace: FONT_H, color: col.color, bold: true, margin: 0,
    });
    const bulletItems = col.items.map((item, bi) => ({
      text: item,
      options: { bullet: true, fontSize: 11, fontFace: FONT_B, color: C.darkText, breakLine: bi < col.items.length - 1 },
    }));
    slide.addText(bulletItems, {
      x: cx + 0.2, y: 1.85, w: 2.45, h: 3.3, margin: 0, paraSpaceAfter: 8,
    });
  });
}

// ═══════════════════════════════════════════
// SLIDE 13: Key Takeaways
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Accent bar at top
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

  slide.addText("Key Takeaways", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 32, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  const takeaways = [
    { num: "1", text: "Three interfaces, one brain: Chat (research), CLI (development), IDE (pair programming)", color: C.accent },
    { num: "2", text: "Three models, different jobs: Haiku (fast), Sonnet (daily driver), Opus (hard problems)", color: C.accent2 },
    { num: "3", text: "CLAUDE.md is your highest-leverage investment \u2014 write one before you start coding with Claude", color: C.accent3 },
    { num: "4", text: "Plan Mode is your safety net \u2014 use it before any non-trivial change", color: C.success },
    { num: "5", text: "Claude will be wrong sometimes \u2014 always verify, always test", color: C.warning },
  ];

  takeaways.forEach((t, i) => {
    const ty = 1.35 + i * 0.82;
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.8, y: ty + 0.05, w: 0.5, h: 0.5,
      fill: { color: t.color },
    });
    slide.addText(t.num, {
      x: 0.8, y: ty + 0.05, w: 0.5, h: 0.5,
      fontSize: 20, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Text
    slide.addText(t.text, {
      x: 1.55, y: ty, w: 7.8, h: 0.6,
      fontSize: 15, fontFace: FONT_B, color: C.lightText, valign: "middle", margin: 0,
    });
  });

  // Footer
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: C.accent } });
  slide.addText("Next: Live demo of Claude Chat, CLI, and IDE using the energycorp project", {
    x: 0.8, y: 5.3, w: 8.4, h: 0.325,
    fontSize: 13, fontFace: FONT_B, color: C.lightText, bold: true, valign: "middle", margin: 0,
  });
}

// ─── Write file ───
const outputPath = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_1/02_What_Is_Claude.pptx";
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("Presentation saved to: " + outputPath);
}).catch(err => {
  console.error("Error:", err);
});
