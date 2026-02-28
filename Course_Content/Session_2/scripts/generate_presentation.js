const pptxgen = require("pptxgenjs");

// ─── Color Palette: Ocean Gradient (professional, tech) ───
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
};

// ─── Reusable style factories (never reuse option objects!) ───
const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 });

// Helper: icon circle with emoji-like character
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
  pres.title = "Extending Claude Code: Skills, Commands & MCPs";

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
    s.addText("Extending Claude Code", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.2,
      fontSize: 42, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addText("Skills, Commands & MCP Servers", {
      x: 0.8, y: 2.3, w: 8.4, h: 0.7,
      fontSize: 26, fontFace: "Calibri", color: C.accentAlt, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.accent } });
    s.addText("Session 2 — Power Features & Automation", {
      x: 0.8, y: 3.6, w: 8.4, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.medGray, margin: 0
    });
    // Decorative shapes bottom-right
    addIconCircle(s, pres, 7.2, 4.1, 0.7, C.deepBlue, "/");
    addIconCircle(s, pres, 8.1, 3.9, 0.7, C.teal, "S");
    addIconCircle(s, pres, 9.0, 4.2, 0.6, C.midnight, "M");
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 2: The Extensibility Problem
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Extensibility Problem", {
      x: 0.7, y: 0.3, w: 8.6, h: 0.6,
      fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0
    });
    s.addText("Out of the box, Claude Code reads files, writes code, and runs commands. But your team has specific needs.", {
      x: 0.7, y: 1.0, w: 8.6, h: 0.45,
      fontSize: 14, fontFace: "Calibri", color: C.bodyText, margin: 0
    });
    const cards = [
      { letter: "/", title: "Custom Commands", who: "You type /command", where: ".claude/commands/", best: "Repeatable workflows", color: C.deepBlue },
      { letter: "S", title: "Skills", who: "Claude decides", where: ".claude/skills/", best: "Background intelligence", color: C.teal },
      { letter: "M", title: "MCP Servers", who: "Claude uses as tools", where: ".mcp.json", best: "External service access", color: C.midnight },
    ];
    cards.forEach((c, i) => {
      const cx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.7, w: 2.8, h: 3.3, fill: { color: C.white }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.7, w: 2.8, h: 0.06, fill: { color: c.color } });
      addIconCircle(s, pres, cx + 0.95, y = 1.95, 0.7, c.color, c.letter);
      s.addText(c.title, { x: cx + 0.15, y: 2.8, w: 2.5, h: 0.4, fontSize: 15, fontFace: "Calibri", bold: true, color: C.darkText, align: "center", margin: 0 });
      s.addText([
        { text: "Who invokes: ", options: { bold: true, fontSize: 11, color: C.bodyText, breakLine: false } },
        { text: c.who, options: { fontSize: 11, color: C.bodyText, breakLine: true } },
        { text: "Location: ", options: { bold: true, fontSize: 11, color: C.bodyText, breakLine: false } },
        { text: c.where, options: { fontSize: 11, color: C.bodyText, fontFace: "Consolas", breakLine: true } },
        { text: "Best for: ", options: { bold: true, fontSize: 11, color: C.bodyText, breakLine: false } },
        { text: c.best, options: { fontSize: 11, color: C.bodyText } },
      ], { x: cx + 0.2, y: 3.35, w: 2.4, h: 1.5, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 6 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 3: Custom Slash Commands
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Custom Slash Commands", { x: 0.7, y: 0.3, w: 5, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Your Team's Playbook", { x: 0.7, y: 0.8, w: 5, h: 0.35, fontSize: 16, fontFace: "Calibri", color: C.teal, margin: 0 });
    // Left: file structure
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.4, w: 4.3, h: 2.2, fill: { color: C.navy } });
    s.addText("File Structure", { x: 0.9, y: 1.5, w: 3, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: ".claude/commands/", options: { color: C.accentAlt, breakLine: true } },
      { text: "  test-backend.md     ", options: { color: C.lightGray, breakLine: false } },
      { text: "-> /test-backend", options: { color: C.medGray, breakLine: true } },
      { text: "  review-file.md      ", options: { color: C.lightGray, breakLine: false } },
      { text: "-> /review-file", options: { color: C.medGray, breakLine: true } },
      { text: "  deploy-check.md     ", options: { color: C.lightGray, breakLine: false } },
      { text: "-> /deploy-check", options: { color: C.medGray, breakLine: true } },
      { text: "  frontend/", options: { color: C.accentAlt, breakLine: true } },
      { text: "    component.md      ", options: { color: C.lightGray, breakLine: false } },
      { text: "-> /component", options: { color: C.medGray } },
    ], { x: 0.9, y: 1.85, w: 3.9, h: 1.65, fontSize: 12, fontFace: "Consolas", margin: 0 });
    // Right: example
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.4, w: 4.3, h: 2.2, fill: { color: C.navy } });
    s.addText("Example: test-backend.md", { x: 5.5, y: 1.5, w: 3.5, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: "---", options: { color: C.medGray, breakLine: true } },
      { text: "description: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "Run Django tests", options: { color: C.lightGray, breakLine: true } },
      { text: "allowed-tools: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "Bash, Read", options: { color: C.lightGray, breakLine: true } },
      { text: "---", options: { color: C.medGray, breakLine: true } },
      { text: "Run the test suite with", options: { color: C.lightGray, breakLine: true } },
      { text: "`!python manage.py test`", options: { color: C.green, breakLine: true } },
      { text: "Report: pass/fail count...", options: { color: C.lightGray } },
    ], { x: 5.5, y: 1.85, w: 3.9, h: 1.65, fontSize: 12, fontFace: "Consolas", margin: 0 });
    // Key features
    const features = [
      { label: "$ARGUMENTS", desc: "Pass parameters" },
      { label: "! prefix", desc: "Execute shell cmds" },
      { label: "@ prefix", desc: "Reference files" },
      { label: "Subdirectories", desc: "Create namespaces" },
    ];
    features.forEach((f, i) => {
      const fx = 0.7 + i * 2.35;
      s.addShape(pres.shapes.RECTANGLE, { x: fx, y: 3.9, w: 2.15, h: 0.8, fill: { color: C.offWhite } });
      s.addText(f.label, { x: fx + 0.1, y: 3.95, w: 1.95, h: 0.35, fontSize: 13, fontFace: "Consolas", bold: true, color: C.deepBlue, margin: 0 });
      s.addText(f.desc, { x: fx + 0.1, y: 4.3, w: 1.95, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
    s.addText("If you type the same prompt twice, make it a command.", {
      x: 0.7, y: 4.95, w: 8.6, h: 0.35, fontSize: 14, fontFace: "Calibri", italic: true, color: C.teal, margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 4: Custom Commands — Practical Examples
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Custom Commands — Practical Examples", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const examples = [
      { title: "/deploy-check", items: ["Run tests — all must pass", "Search for debug statements", "Verify no .env files staged", "Check migrations up to date", "Report as pass/fail checklist"], color: C.deepBlue },
      { title: "/review-file <path>", items: ["Check imports vs requirements", "Missing error handling", "Permission checks on views", "React version compatibility", "Severity: high / med / low"], color: C.teal },
      { title: "/api-docs <app>", items: ["Read views, serializers, URLs", "Generate endpoint documentation", "Include required permissions", "Request/response examples", "Error codes reference"], color: C.midnight },
    ];
    examples.forEach((ex, i) => {
      const cx = 0.5 + i * 3.2;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.1, w: 2.9, h: 4.1, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.1, w: 2.9, h: 0.06, fill: { color: ex.color } });
      s.addText(ex.title, { x: cx + 0.2, y: 1.3, w: 2.5, h: 0.4, fontSize: 14, fontFace: "Consolas", bold: true, color: ex.color, margin: 0 });
      s.addShape(pres.shapes.LINE, { x: cx + 0.2, y: 1.8, w: 2.5, h: 0, line: { color: C.lightGray, width: 1 } });
      const textItems = ex.items.map((item, idx) => ({
        text: item, options: { bullet: true, fontSize: 12, color: C.bodyText, breakLine: idx < ex.items.length - 1 }
      }));
      s.addText(textItems, { x: cx + 0.2, y: 1.95, w: 2.5, h: 3.0, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 6 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 5: Skills — Claude's Automatic Instincts
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Skills — Claude's Automatic Instincts", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Claude decides when to use them — you don't type anything", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });
    // Left: SKILL.md
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.4, w: 4.8, h: 3.2, fill: { color: C.navy } });
    s.addText("SKILL.md", { x: 0.9, y: 1.5, w: 2, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: "---", options: { color: C.medGray, breakLine: true } },
      { text: "name: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "security-check", options: { color: C.lightGray, breakLine: true } },
      { text: "description: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "Reviews code for", options: { color: C.lightGray, breakLine: true } },
      { text: "  security issues. Use when editing", options: { color: C.lightGray, breakLine: true } },
      { text: "  views.py or serializers.py", options: { color: C.lightGray, breakLine: true } },
      { text: "allowed-tools: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "Read, Grep, Glob", options: { color: C.lightGray, breakLine: true } },
      { text: "context: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "fork", options: { color: C.green, breakLine: true } },
      { text: "---", options: { color: C.medGray, breakLine: true } },
      { text: "Check the modified file for:", options: { color: C.lightGray, breakLine: true } },
      { text: "- SQL injection via raw queries", options: { color: C.lightGray, breakLine: true } },
      { text: "- Missing permission classes", options: { color: C.lightGray, breakLine: true } },
      { text: "- Unvalidated user input", options: { color: C.lightGray } },
    ], { x: 0.9, y: 1.8, w: 4.4, h: 2.7, fontSize: 11, fontFace: "Consolas", margin: 0 });
    // Right: key differences
    const diffs = [
      { label: "Model-invoked", desc: "Claude reads the description and decides when to use it", letter: "A", color: C.deepBlue },
      { label: "context: fork", desc: "Runs in isolated sub-agent — won't pollute main context", letter: "F", color: C.teal },
      { label: "Composable", desc: "Claude can chain skills with commands and MCP tools", letter: "C", color: C.midnight },
      { label: "Hot-reload", desc: "Edit during a session without restarting", letter: "H", color: C.accent },
    ];
    diffs.forEach((d, i) => {
      const dy = 1.4 + i * 0.78;
      addIconCircle(s, pres, 5.8, dy + 0.05, 0.4, d.color, d.letter);
      s.addText(d.label, { x: 6.35, y: dy, w: 3.3, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.deepBlue, margin: 0 });
      s.addText(d.desc, { x: 6.35, y: dy + 0.3, w: 3.3, h: 0.35, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.45, fill: { color: C.offWhite } });
    s.addText("Commands = things you trigger   |   Skills = things Claude triggers", {
      x: 0.7, y: 4.85, w: 8.6, h: 0.45, fontSize: 13, fontFace: "Calibri", bold: true, color: C.deepBlue, align: "center", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 6: MCP Servers
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("MCP Servers", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Connecting Claude to External Services", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 16, fontFace: "Calibri", color: C.teal, margin: 0 });
    // Architecture flow
    const flowItems = ["You", "Claude Code", "MCP Client", "MCP Server", "Service"];
    const flowColors = [C.deepBlue, C.deepBlue, C.teal, C.teal, C.midnight];
    flowItems.forEach((label, i) => {
      const fx = 0.5 + i * 1.9;
      s.addShape(pres.shapes.RECTANGLE, { x: fx, y: 1.35, w: 1.6, h: 0.5, fill: { color: flowColors[i] } });
      s.addText(label, { x: fx, y: 1.35, w: 1.6, h: 0.5, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      if (i < 4) s.addText("\u2192", { x: fx + 1.6, y: 1.35, w: 0.3, h: 0.5, fontSize: 16, color: C.medGray, align: "center", valign: "middle", margin: 0 });
    });
    // Install examples
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.15, w: 8.6, h: 1.8, fill: { color: C.navy } });
    s.addText("Install with one command", { x: 0.9, y: 2.25, w: 4, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: "# GitHub", options: { color: C.medGray, breakLine: true } },
      { text: "claude mcp add --transport http github", options: { color: C.accentAlt, breakLine: true } },
      { text: "  https://api.githubcopilot.com/mcp", options: { color: C.lightGray, breakLine: true } },
      { text: "", options: { breakLine: true, fontSize: 4 } },
      { text: "# Figma", options: { color: C.medGray, breakLine: true } },
      { text: "claude mcp add --transport http figma", options: { color: C.accentAlt, breakLine: true } },
      { text: "  https://mcp.figma.com/mcp", options: { color: C.lightGray, breakLine: true } },
      { text: "", options: { breakLine: true, fontSize: 4 } },
      { text: "# PostgreSQL", options: { color: C.medGray, breakLine: true } },
      { text: "claude mcp add --transport stdio postgres", options: { color: C.accentAlt, breakLine: true } },
      { text: "  -- npx -y @anthropic/pg-mcp-server", options: { color: C.lightGray } },
    ], { x: 0.9, y: 2.55, w: 8.2, h: 1.3, fontSize: 11, fontFace: "Consolas", margin: 0 });
    // Three scopes
    const scopes = [
      { label: "Local", path: "~/.claude.json", desc: "Personal, all projects" },
      { label: "Project", path: ".mcp.json", desc: "Shared via git" },
      { label: "User", path: "User settings", desc: "Personal, all projects" },
    ];
    scopes.forEach((sc, i) => {
      const sx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 4.25, w: 2.8, h: 0.9, fill: { color: C.offWhite } });
      s.addText(sc.label, { x: sx + 0.15, y: 4.3, w: 2.5, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.deepBlue, margin: 0 });
      s.addText(sc.path + " — " + sc.desc, { x: sx + 0.15, y: 4.6, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 7: Popular MCP Servers
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Popular MCP Servers for Your Stack", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const servers = [
      { name: "GitHub", desc: "PRs, issues, repo search, code review", letter: "G" },
      { name: "Figma", desc: "Design-to-code, extract design tokens", letter: "F" },
      { name: "PostgreSQL", desc: "Query databases, inspect schemas", letter: "P" },
      { name: "Brave Search", desc: "Web search with better results", letter: "B" },
      { name: "Sentry", desc: "Error tracking, exception details", letter: "S" },
      { name: "Slack", desc: "Send messages, read channels", letter: "K" },
    ];
    servers.forEach((sv, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const sx = 0.7 + col * 4.5;
      const sy = 1.2 + row * 1.1;
      s.addShape(pres.shapes.RECTANGLE, { x: sx, y: sy, w: 4.2, h: 0.9, fill: { color: C.offWhite } });
      addIconCircle(s, pres, sx + 0.15, sy + 0.15, 0.6, C.deepBlue, sv.letter);
      s.addText(sv.name, { x: sx + 0.9, y: sy + 0.1, w: 3.1, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
      s.addText(sv.desc, { x: sx + 0.9, y: sy + 0.45, w: 3.1, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
    // Tool Search callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.6, w: 8.6, h: 0.7, fill: { color: C.navy } });
    s.addText([
      { text: "MCP Tool Search: ", options: { bold: true, color: C.accentAlt } },
      { text: "Dynamically loads tools on-demand — reduces context usage by up to ", options: { color: C.lightGray } },
      { text: "95%", options: { bold: true, color: C.green } },
    ], { x: 0.9, y: 4.6, w: 8.2, h: 0.7, fontSize: 14, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 8: How They Work Together
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("How They Work Together", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText('Scenario: "Review my PR before merging"', { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 14, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });
    const steps = [
      { num: "1", label: "Custom Command", desc: "/review-pr 42 triggers the workflow", color: C.deepBlue },
      { num: "2", label: "MCP Server", desc: "GitHub MCP fetches PR diff, comments, CI status", color: C.teal },
      { num: "3", label: "Skill", desc: "Security-check auto-triggers (PR touches views.py)", color: C.midnight },
      { num: "4", label: "Result", desc: "Combined review: code quality + security + CI status", color: C.green },
    ];
    steps.forEach((st, i) => {
      const sy = 1.4 + i * 0.95;
      addIconCircle(s, pres, 1.0, sy + 0.08, 0.5, st.color, st.num);
      if (i < 3) s.addShape(pres.shapes.LINE, { x: 1.25, y: sy + 0.58, w: 0, h: 0.37, line: { color: C.lightGray, width: 2 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.8, y: sy, w: 7.0, h: 0.65, fill: { color: C.white }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.8, y: sy, w: 0.06, h: 0.65, fill: { color: st.color } });
      s.addText(st.label, { x: 2.1, y: sy + 0.03, w: 2.5, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
      s.addText(st.desc, { x: 2.1, y: sy + 0.33, w: 6.5, h: 0.25, fontSize: 12, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 5.0, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText([
      { text: "Commands ", options: { bold: true, color: C.accentAlt } },
      { text: "define what  |  ", options: { color: C.lightGray } },
      { text: "MCPs ", options: { bold: true, color: C.accentAlt } },
      { text: "provide access  |  ", options: { color: C.lightGray } },
      { text: "Skills ", options: { bold: true, color: C.accentAlt } },
      { text: "add intelligence", options: { color: C.lightGray } },
    ], { x: 0.7, y: 5.0, w: 8.6, h: 0.4, fontSize: 13, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 9: Rules Files
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Rules Files", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Scaling Your Team's Knowledge Beyond CLAUDE.md", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 15, fontFace: "Calibri", color: C.teal, margin: 0 });
    // Left: directory structure
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.35, w: 4.3, h: 2.3, fill: { color: C.navy } });
    s.addText("Team-Owned Rule Files", { x: 0.9, y: 1.45, w: 3, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: ".claude/rules/", options: { color: C.accentAlt, breakLine: true } },
      { text: "  testing.md          ", options: { color: C.lightGray, breakLine: false } },
      { text: "<- QA lead", options: { color: C.green, breakLine: true } },
      { text: "  api-conventions.md  ", options: { color: C.lightGray, breakLine: false } },
      { text: "<- Backend team", options: { color: C.green, breakLine: true } },
      { text: "  frontend-patterns.md", options: { color: C.lightGray, breakLine: false } },
      { text: "<- Frontend team", options: { color: C.green, breakLine: true } },
      { text: "  security.md         ", options: { color: C.lightGray, breakLine: false } },
      { text: "<- Security lead", options: { color: C.green, breakLine: true } },
      { text: "", options: { breakLine: true, fontSize: 4 } },
      { text: "Backend/src/contract/", options: { color: C.accentAlt, breakLine: true } },
      { text: "  CLAUDE.md           ", options: { color: C.lightGray, breakLine: false } },
      { text: "<- On-demand only", options: { color: C.orange } },
    ], { x: 0.9, y: 1.75, w: 4.0, h: 1.8, fontSize: 12, fontFace: "Consolas", margin: 0 });
    // Right: comparison table
    s.addText("CLAUDE.md vs Rules Files", { x: 5.3, y: 1.35, w: 4.3, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    const compRows = [
      ["", "CLAUDE.md", "Rules Files"],
      ["Scope", "Whole project", "Specific topic"],
      ["Owner", "One file, everyone", "Different owners"],
      ["Conflicts", "Likely", "Rare"],
      ["Best for", "Overview, cmds", "Conventions"],
    ];
    const tableData = compRows.map((row, ri) => row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri === 0 ? C.deepBlue : (ri % 2 === 1 ? C.offWhite : C.white) },
        color: ri === 0 ? C.white : C.darkText,
        bold: ri === 0 || ci === 0, fontSize: 10, valign: "middle",
      }
    })));
    s.addTable(tableData, { x: 5.3, y: 1.75, w: 4.3, fontSize: 10, fontFace: "Calibri", colW: [0.9, 1.4, 2.0], border: { pt: 0.5, color: C.lightGray } });
    // Bottom: extensibility picture
    s.addShape(pres.shapes.LINE, { x: 0.7, y: 4.1, w: 8.6, h: 0, line: { color: C.lightGray, width: 1 } });
    s.addText("The Complete Extensibility Picture", { x: 0.7, y: 4.2, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const pieces = [
      { label: "CLAUDE.md", desc: "What the project is", color: C.deepBlue },
      { label: "Rules", desc: "How to work in it", color: C.teal },
      { label: "Commands", desc: "What to do", color: C.midnight },
      { label: "Skills", desc: "When to do it", color: C.accent },
      { label: "MCPs", desc: "Where to get data", color: C.green },
    ];
    pieces.forEach((p, i) => {
      const px = 0.5 + i * 1.9;
      s.addShape(pres.shapes.RECTANGLE, { x: px, y: 4.6, w: 1.7, h: 0.8, fill: { color: p.color } });
      s.addText(p.label, { x: px, y: 4.6, w: 1.7, h: 0.45, fontSize: 12, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      s.addText(p.desc, { x: px, y: 5.0, w: 1.7, h: 0.35, fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", valign: "top", margin: 0 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 10: Priority Order
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Getting Started — Priority Order", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const priorities = [
      { num: "1", label: "Custom Commands", timing: "Today's lab", items: "/test  |  /review-file  |  /deploy-check", color: C.deepBlue },
      { num: "2", label: "GitHub MCP", timing: "Today or homework", items: "PR management  |  Issue tracking", color: C.teal },
      { num: "3", label: "Rules Files", timing: "Today's lab", items: ".claude/rules/testing.md  |  api-conventions.md", color: C.midnight },
      { num: "4", label: "Skills", timing: "Session 3+", items: "Auto-review on changes  |  Custom domain agents", color: C.medGray },
    ];
    priorities.forEach((p, i) => {
      const py = 1.1 + i * 1.05;
      addIconCircle(s, pres, 0.8, py + 0.1, 0.5, p.color, p.num);
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: py, w: 7.8, h: 0.8, fill: { color: C.white }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: py, w: 0.05, h: 0.8, fill: { color: p.color } });
      s.addText(p.label, { x: 1.75, y: py + 0.05, w: 2.5, h: 0.3, fontSize: 15, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
      s.addText(p.timing, { x: 1.75, y: py + 0.38, w: 2, h: 0.25, fontSize: 10, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });
      s.addText(p.items, { x: 4.0, y: py, w: 5.1, h: 0.8, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 11: Key Takeaways
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
      { text: "Custom commands = reusable prompts", sub: "If you type it twice, make it a command" },
      { text: "Skills = automatic instincts", sub: "Claude decides when to use them" },
      { text: "MCPs = external access", sub: "GitHub, Figma, databases, and 17K+ more" },
      { text: "Rules files = scalable conventions", sub: "Team-owned, conflict-free, modular" },
      { text: "They compose — and share via git", sub: "Commands + MCPs + Skills + Rules = your team's workflow" },
    ];
    takeaways.forEach((t, i) => {
      const ty = 1.3 + i * 0.78;
      s.addText((i + 1).toString(), { x: 0.8, y: ty, w: 0.4, h: 0.4, fontSize: 20, fontFace: "Calibri", bold: true, color: C.accent, margin: 0 });
      s.addText(t.text, { x: 1.4, y: ty, w: 7.5, h: 0.35, fontSize: 17, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });
      s.addText(t.sub, { x: 1.4, y: ty + 0.35, w: 7.5, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.medGray, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 5.0, w: 8.6, h: 0.04, fill: { color: C.accent } });
    s.addText("Next: Live demo of Skills, Commands & MCPs on the energycorp project", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.medGray, margin: 0
    });
  }

  const outPath = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_2/02_Skills_Commands_MCPs.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Presentation written to:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
