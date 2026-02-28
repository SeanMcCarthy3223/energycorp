const pptxgen = require("pptxgenjs");

// ─── Color Palette: Ocean Gradient (matching 02_Skills_Commands_MCPs.pptx) ───
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
  pres.title = "Hooks, Sub-Agents & Automation";

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
    s.addText("Hooks, Sub-Agents", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.2,
      fontSize: 42, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addText("& Automation", {
      x: 0.8, y: 2.2, w: 8.4, h: 0.8,
      fontSize: 42, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.accent } });
    s.addText("Session 2 — Power Features & Automation", {
      x: 0.8, y: 3.6, w: 8.4, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.medGray, margin: 0
    });
    // Decorative shapes bottom-right
    addIconCircle(s, pres, 7.0, 4.1, 0.7, C.deepBlue, "\u21BB");
    addIconCircle(s, pres, 7.9, 3.9, 0.7, C.teal, "\u2699");
    addIconCircle(s, pres, 8.5, 4.2, 0.6, C.midnight, "\u2713");
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 2: The Problem — Humans Forget, Hooks Don't
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Humans Forget, Hooks Don't", {
      x: 0.7, y: 0.3, w: 8.6, h: 0.6,
      fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0
    });

    // Left: the problem
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.1, w: 4.3, h: 2.8, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.1, w: 4.3, h: 0.06, fill: { color: C.red } });
    addIconCircle(s, pres, 1.0, 1.35, 0.5, C.red, "!");
    s.addText("The Weak Link", { x: 1.65, y: 1.35, w: 3.0, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    s.addText("The safe workflow:\nPlan \u2192 Test \u2192 Implement \u2192 Verify \u2192 Commit", {
      x: 0.95, y: 1.9, w: 3.8, h: 0.65,
      fontSize: 12, fontFace: "Calibri", color: C.bodyText, margin: 0
    });
    s.addText([
      { text: "\"Verify\" is the weak link.", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "You know you should run tests.", options: { breakLine: true } },
      { text: "You know you should check imports.", options: { breakLine: true } },
      { text: "You know you should review for security.", options: { breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "But after 30 min of focused work,", options: { italic: true, breakLine: true } },
      { text: "you forget. Or skip it \"just this once.\"", options: { italic: true } },
    ], { x: 0.95, y: 2.55, w: 3.8, h: 1.2, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "top", margin: 0, paraSpaceAfter: 1 });

    // Right: the solution
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.1, w: 4.3, h: 2.8, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.1, w: 4.3, h: 0.06, fill: { color: C.green } });
    addIconCircle(s, pres, 5.6, 1.35, 0.5, C.green, "\u2713");
    s.addText("Hooks Solve This", { x: 6.25, y: 1.35, w: 3.0, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    s.addText([
      { text: "A hook is a command, prompt, or agent that executes ", options: { color: C.bodyText, breakLine: false } },
      { text: "automatically", options: { bold: true, color: C.deepBlue, breakLine: false } },
      { text: " when a specific event happens in Claude Code.", options: { color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 8, breakLine: true } },
      { text: "Not a suggestion.", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "Not a best practice.", options: { bold: true, color: C.darkText, breakLine: true } },
      { text: "A guarantee.", options: { bold: true, color: C.green, fontSize: 16 } },
    ], { x: 5.55, y: 1.9, w: 3.8, h: 2.0, fontSize: 12, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 2 });

    // Bottom callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.3, w: 8.6, h: 0.55, fill: { color: C.navy } });
    s.addText("Don't rely on humans to remember. Automate the checks.", {
      x: 0.7, y: 4.3, w: 8.6, h: 0.55, fontSize: 15, fontFace: "Calibri", bold: true, color: C.accentAlt, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 3: What Are Hooks?
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("What Are Hooks?", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("User-defined automations at lifecycle events", { x: 0.7, y: 0.8, w: 8.6, h: 0.35, fontSize: 15, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Three types as cards
    const types = [
      { letter: "C", title: "Command Hooks", desc: "Run a shell command\n(e.g., run tests, check lint)", color: C.deepBlue },
      { letter: "P", title: "Prompt Hooks", desc: "Evaluate a question with\na small LLM (Haiku)", color: C.teal },
      { letter: "A", title: "Agent Hooks", desc: "Spawn a sub-agent with\ntool access for verification", color: C.midnight },
    ];
    types.forEach((t, i) => {
      const cx = 0.7 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.35, w: 2.8, h: 1.8, fill: { color: C.offWhite }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.35, w: 2.8, h: 0.06, fill: { color: t.color } });
      addIconCircle(s, pres, cx + 1.0, 1.55, 0.6, t.color, t.letter);
      s.addText(t.title, { x: cx + 0.15, y: 2.25, w: 2.5, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.darkText, align: "center", margin: 0 });
      s.addText(t.desc, { x: cx + 0.15, y: 2.6, w: 2.5, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.bodyText, align: "center", margin: 0 });
    });

    // Where to configure
    s.addText("Where to Configure", { x: 0.7, y: 3.45, w: 8.6, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const configs = [
      { path: "~/.claude/settings.json", desc: "All your projects", scope: "Personal" },
      { path: ".claude/settings.json", desc: "Shared via git", scope: "Project" },
      { path: ".claude/settings.local.json", desc: "Personal overrides, gitignored", scope: "Local" },
      { path: "Managed settings", desc: "Enterprise, highest precedence", scope: "Managed" },
    ];
    configs.forEach((c, i) => {
      const cx = 0.7 + i * 2.35;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.95, w: 2.15, h: 1.05, fill: { color: C.offWhite } });
      s.addText(c.scope, { x: cx + 0.1, y: 3.98, w: 1.95, h: 0.28, fontSize: 12, fontFace: "Calibri", bold: true, color: C.deepBlue, margin: 0 });
      s.addText(c.path, { x: cx + 0.1, y: 4.25, w: 1.95, h: 0.28, fontSize: 9, fontFace: "Consolas", color: C.bodyText, margin: 0 });
      s.addText(c.desc, { x: cx + 0.1, y: 4.52, w: 1.95, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.medGray, margin: 0 });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 4: The Hook Events That Matter Most
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Hook Events That Matter Most", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("14 events available \u2014 focus on these five", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    const events = [
      { name: "PostToolUse", when: "After Claude writes/edits a file", use: "Auto-run tests, lint, format", blocks: "Yes", color: C.deepBlue },
      { name: "PreToolUse", when: "Before Claude runs a command", use: "Block dangerous operations", blocks: "Yes", color: C.teal },
      { name: "Stop", when: "When Claude finishes responding", use: "Auto code review, summaries", blocks: "Yes", color: C.midnight },
      { name: "TaskCompleted", when: "When a task is marked done", use: "Gate on test passing", blocks: "Yes", color: C.accent },
      { name: "SessionStart", when: "When a session begins", use: "Load team context, setup", blocks: "No", color: C.medGray },
    ];

    // Table header
    const headerY = 1.3;
    const colX = [0.7, 2.4, 4.6, 6.9, 8.5];
    const colW = [1.7, 2.2, 2.3, 1.6, 1.1];
    const headers = ["Event", "When It Fires", "Practical Use", "Can Block?"];
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: headerY, w: 8.9, h: 0.45, fill: { color: C.deepBlue } });
    headers.forEach((h, i) => {
      s.addText(h, { x: colX[i], y: headerY, w: colW[i], h: 0.45, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: [0, 0, 0, 8] });
    });

    events.forEach((ev, i) => {
      const ey = 1.75 + i * 0.6;
      const fill = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: ey, w: 8.9, h: 0.55, fill: { color: fill } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: ey, w: 0.06, h: 0.55, fill: { color: ev.color } });
      s.addText(ev.name, { x: colX[0] + 0.1, y: ey, w: colW[0] - 0.1, h: 0.55, fontSize: 11, fontFace: "Consolas", bold: true, color: ev.color, valign: "middle", margin: 0 });
      s.addText(ev.when, { x: colX[1], y: ey, w: colW[1], h: 0.55, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
      s.addText(ev.use, { x: colX[2], y: ey, w: colW[2], h: 0.55, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
      const blockColor = ev.blocks === "Yes" ? C.green : C.medGray;
      s.addText(ev.blocks, { x: colX[3], y: ey, w: colW[3], h: 0.55, fontSize: 12, fontFace: "Calibri", bold: true, color: blockColor, valign: "middle", margin: 0 });
    });

    // Insight callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fill: { color: C.navy } });
    s.addText([
      { text: "matcher ", options: { fontFace: "Consolas", color: C.accentAlt, bold: true } },
      { text: "lets you target specific tools. ", options: { color: C.lightGray } },
      { text: "Write|Edit", options: { fontFace: "Consolas", color: C.green, bold: true } },
      { text: " = only file writes, not reads or searches.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.85, w: 8.2, h: 0.4, fontSize: 12, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 5: Hook Communication Protocol
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Hook Communication", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("A simple protocol for guaranteed feedback", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Protocol items as horizontal cards
    const protocols = [
      { code: "Exit 0", desc: "Success \u2014 continue normally", icon: "\u2713", color: C.green },
      { code: "Exit 2", desc: "Block \u2014 stop action, show error", icon: "\u2717", color: C.red },
      { code: "Stdout", desc: "Structured JSON feedback", icon: "{}", color: C.deepBlue },
      { code: "Stderr", desc: "Error messages to the user", icon: "!", color: C.orange },
      { code: "Stdin", desc: "Receives tool name, input, context", icon: "\u2190", color: C.teal },
    ];
    protocols.forEach((p, i) => {
      const py = 1.3 + i * 0.58;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: py, w: 4.3, h: 0.5, fill: { color: C.offWhite } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: py, w: 0.06, h: 0.5, fill: { color: p.color } });
      s.addText(p.code, { x: 1.0, y: py, w: 1.2, h: 0.5, fontSize: 13, fontFace: "Consolas", bold: true, color: p.color, valign: "middle", margin: 0 });
      s.addText(p.desc, { x: 2.3, y: py, w: 2.5, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });

    // Right: the self-correcting loop
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.3, h: 3.4, fill: { color: C.navy } });
    s.addText("The Self-Correcting Loop", { x: 5.5, y: 1.4, w: 3.5, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "When a PostToolUse hook fails", options: { color: C.lightGray, breakLine: true } },
      { text: "(exit code 2), Claude sees the", options: { color: C.lightGray, breakLine: true } },
      { text: "failure output and can immediately", options: { color: C.lightGray, breakLine: true } },
      { text: "fix the issue.", options: { color: C.lightGray, breakLine: true } },
      { text: "", options: { fontSize: 8, breakLine: true } },
      { text: "This creates a loop:", options: { bold: true, color: C.white, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "  1. Claude writes code", options: { color: C.accentAlt, breakLine: true } },
      { text: "  2. Tests run automatically", options: { color: C.accentAlt, breakLine: true } },
      { text: "  3. Tests fail \u2192 Claude sees why", options: { color: C.orange, breakLine: true } },
      { text: "  4. Claude fixes the issue", options: { color: C.accentAlt, breakLine: true } },
      { text: "  5. Tests run again", options: { color: C.accentAlt, breakLine: true } },
      { text: "  6. Repeat until passing", options: { color: C.green, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "No human intervention needed.", options: { bold: true, color: C.green } },
    ], { x: 5.5, y: 1.75, w: 3.9, h: 2.8, fontSize: 12, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 2 });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.95, w: 8.6, h: 0.35, fill: { color: C.offWhite } });
    s.addText("Blocking hooks create feedback loops that make Claude self-correcting.", {
      x: 0.7, y: 4.95, w: 8.6, h: 0.35, fontSize: 12, fontFace: "Calibri", bold: true, color: C.deepBlue, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 6: The PostToolUse Auto-Test Pattern
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The PostToolUse Auto-Test Pattern", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("The single most valuable hook for your team", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });

    // Code block
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 5.5, h: 2.8, fill: { color: C.navy } });
    s.addText("Configuration for Django + React", { x: 0.9, y: 1.4, w: 4, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: "{", options: { color: C.lightGray, breakLine: true } },
      { text: '  "hooks": {', options: { color: C.lightGray, breakLine: true } },
      { text: '    "PostToolUse"', options: { color: C.accentAlt, breakLine: false } },
      { text: ": [{", options: { color: C.lightGray, breakLine: true } },
      { text: '      "matcher"', options: { color: C.accentAlt, breakLine: false } },
      { text: ': "', options: { color: C.lightGray, breakLine: false } },
      { text: "Write|Edit", options: { color: C.green, breakLine: false } },
      { text: '",', options: { color: C.lightGray, breakLine: true } },
      { text: '      "hooks": [{', options: { color: C.lightGray, breakLine: true } },
      { text: '        "type": "command",', options: { color: C.lightGray, breakLine: true } },
      { text: '        "command":', options: { color: C.accentAlt, breakLine: true } },
      { text: '          "cd \\"$CLAUDE_PROJECT_DIR\\"', options: { color: C.orange, breakLine: true } },
      { text: '          && python src/manage.py test', options: { color: C.orange, breakLine: true } },
      { text: '          2>&1 | tail -30"', options: { color: C.orange, breakLine: true } },
      { text: "      }]", options: { color: C.lightGray, breakLine: true } },
      { text: "    }]", options: { color: C.lightGray, breakLine: true } },
      { text: "  }", options: { color: C.lightGray, breakLine: true } },
      { text: "}", options: { color: C.lightGray } },
    ], { x: 0.9, y: 1.7, w: 5.1, h: 2.3, fontSize: 10, fontFace: "Consolas", margin: 0, paraSpaceAfter: 0 });

    // Right: tips
    s.addText("Tips for Effective Auto-Testing", { x: 6.5, y: 1.3, w: 3.2, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    const tips = [
      { label: "tail -30", desc: "Limit output \u2014 Claude doesn't need 200 lines", icon: "\u2702" },
      { label: "--failfast", desc: "Stop at first failure \u2014 faster feedback loop", icon: "\u26A1" },
      { label: "Write|Edit", desc: "Match specific tools, not all of them", icon: "\u2699" },
      { label: "Test manually", desc: "Verify hook command works before adding it", icon: "\u2714" },
    ];
    tips.forEach((t, i) => {
      const ty = 1.75 + i * 0.65;
      s.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: ty, w: 3.2, h: 0.57, fill: { color: C.offWhite } });
      s.addText(t.label, { x: 6.6, y: ty + 0.02, w: 3.0, h: 0.26, fontSize: 12, fontFace: "Consolas", bold: true, color: C.deepBlue, margin: 0 });
      s.addText(t.desc, { x: 6.6, y: ty + 0.28, w: 3.0, h: 0.26, fontSize: 10, fontFace: "Calibri", color: C.bodyText, margin: 0 });
    });

    // Bottom callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.45, w: 8.6, h: 0.55, fill: { color: C.navy } });
    s.addText([
      { text: "Every time Claude writes or edits a file, tests run automatically. ", options: { color: C.lightGray } },
      { text: "Failures are fixed before you even ask.", options: { bold: true, color: C.green } },
    ], { x: 0.9, y: 4.45, w: 8.2, h: 0.55, fontSize: 13, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 7: Sub-Agents — Delegation Without Context Pollution
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Sub-Agents", { x: 0.7, y: 0.3, w: 5, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Delegation Without Context Pollution", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 15, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Why sub-agents callout
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 8.6, h: 0.8, fill: { color: C.white }, shadow: makeCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 0.06, h: 0.8, fill: { color: C.accent } });
    s.addText([
      { text: "The main conversation is precious real estate. ", options: { bold: true, color: C.darkText } },
      { text: "Every message fills the context window. Sub-agents work in isolation \u2014 their research doesn\u2019t pollute your main context. They report back with just the results.", options: { color: C.bodyText } },
    ], { x: 1.0, y: 1.3, w: 8.1, h: 0.8, fontSize: 12, fontFace: "Calibri", valign: "middle", margin: 0 });

    // Built-in agents table
    s.addText("Built-In Sub-Agents", { x: 0.7, y: 2.3, w: 4, h: 0.3, fontSize: 15, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    const agents = [
      { name: "Explore", model: "Haiku", tools: "Read, Glob, Grep", use: "Fast codebase search", color: C.deepBlue },
      { name: "Plan", model: "Sonnet", tools: "Read, Glob, Grep, Web", use: "Analysis & proposals", color: C.teal },
      { name: "General", model: "Sonnet", tools: "All tools", use: "Full access tasks", color: C.midnight },
    ];
    // Header
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.7, w: 8.6, h: 0.4, fill: { color: C.deepBlue } });
    ["Agent", "Model", "Tools", "Use For"].forEach((h, i) => {
      const hx = [0.8, 2.4, 3.8, 6.2][i];
      const hw = [1.6, 1.4, 2.4, 3.0][i];
      s.addText(h, { x: hx, y: 2.7, w: hw, h: 0.4, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0 });
    });
    agents.forEach((a, i) => {
      const ay = 3.1 + i * 0.48;
      const fill = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: ay, w: 8.6, h: 0.45, fill: { color: fill } });
      s.addText(a.name, { x: 0.8, y: ay, w: 1.6, h: 0.45, fontSize: 12, fontFace: "Calibri", bold: true, color: a.color, valign: "middle", margin: 0 });
      s.addText(a.model, { x: 2.4, y: ay, w: 1.4, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
      s.addText(a.tools, { x: 3.8, y: ay, w: 2.4, h: 0.45, fontSize: 10, fontFace: "Consolas", color: C.bodyText, valign: "middle", margin: 0 });
      s.addText(a.use, { x: 6.2, y: ay, w: 3.0, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
    });

    // Custom agent preview
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.5, w: 8.6, h: 0.8, fill: { color: C.navy } });
    s.addText([
      { text: "Custom agents: ", options: { bold: true, color: C.accentAlt } },
      { text: "Create ", options: { color: C.lightGray } },
      { text: ".claude/agents/<name>.md", options: { fontFace: "Consolas", color: C.green } },
      { text: " with YAML frontmatter (name, description, tools, model) + instructions.", options: { color: C.lightGray } },
    ], { x: 0.9, y: 4.5, w: 8.2, h: 0.8, fontSize: 12, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 8: Custom Sub-Agents + When to Use What
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Custom Sub-Agents", { x: 0.7, y: 0.3, w: 5, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("& When to Use Hooks vs. Agents", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 15, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Left: code example
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 4.6, h: 3.5, fill: { color: C.navy } });
    s.addText(".claude/agents/code-reviewer.md", { x: 0.9, y: 1.4, w: 4, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.medGray, margin: 0 });
    s.addText([
      { text: "---", options: { color: C.medGray, breakLine: true } },
      { text: "name: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "code-reviewer", options: { color: C.lightGray, breakLine: true } },
      { text: "description: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "Reviews code changes", options: { color: C.lightGray, breakLine: true } },
      { text: "  for quality. Use proactively.", options: { color: C.lightGray, breakLine: true } },
      { text: "tools: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "Read, Grep, Glob", options: { color: C.lightGray, breakLine: true } },
      { text: "model: ", options: { color: C.accentAlt, breakLine: false } },
      { text: "sonnet", options: { color: C.green, breakLine: true } },
      { text: "---", options: { color: C.medGray, breakLine: true } },
      { text: "You are a senior code reviewer", options: { color: C.lightGray, breakLine: true } },
      { text: "for a Django + React project.", options: { color: C.lightGray, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "Review modified files for:", options: { color: C.lightGray, breakLine: true } },
      { text: "- Import errors", options: { color: C.orange, breakLine: true } },
      { text: "- Missing error handling", options: { color: C.orange, breakLine: true } },
      { text: "- Security vulnerabilities", options: { color: C.orange, breakLine: true } },
      { text: "- Pattern deviations", options: { color: C.orange, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "Rate: CRITICAL / WARNING / INFO", options: { color: C.green } },
    ], { x: 0.9, y: 1.7, w: 4.2, h: 2.9, fontSize: 11, fontFace: "Consolas", margin: 0, paraSpaceAfter: 0 });

    // Right: decision table
    s.addText("When to Use What", { x: 5.6, y: 1.3, w: 4, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0 });
    const decisions = [
      { need: "Run tests after every edit", use: "Hook", type: "PostToolUse", color: C.deepBlue },
      { need: "Deep code review after task", use: "Agent", type: "Stop hook + agent", color: C.teal },
      { need: "Block dangerous commands", use: "Hook", type: "PreToolUse", color: C.deepBlue },
      { need: "Research a library", use: "Agent", type: "Explore agent", color: C.teal },
      { need: "Gate on test completion", use: "Hook", type: "TaskCompleted", color: C.deepBlue },
    ];
    decisions.forEach((d, i) => {
      const dy = 1.8 + i * 0.62;
      const fill = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: dy, w: 4.0, h: 0.55, fill: { color: fill } });
      s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: dy, w: 0.05, h: 0.55, fill: { color: d.color } });
      s.addText(d.need, { x: 5.8, y: dy, w: 2.5, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.bodyText, margin: 0 });
      s.addText([
        { text: d.use, options: { bold: true, color: d.use === "Hook" ? C.deepBlue : C.teal } },
        { text: " \u2014 " + d.type, options: { fontSize: 9, color: C.medGray } },
      ], { x: 5.8, y: dy + 0.25, w: 3.6, h: 0.25, fontSize: 10, fontFace: "Calibri", margin: 0 });
    });

    // Summary
    s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 4.95, w: 4.0, h: 0.4, fill: { color: C.navy } });
    s.addText([
      { text: "Hooks ", options: { bold: true, color: C.accentAlt } },
      { text: "= fast, guaranteed  |  ", options: { color: C.lightGray } },
      { text: "Agents ", options: { bold: true, color: C.accentAlt } },
      { text: "= thorough, isolated", options: { color: C.lightGray } },
    ], { x: 5.6, y: 4.95, w: 4.0, h: 0.4, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 9: Rules Files in Practice
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("Rules Files in Practice", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("What goes in them \u2014 concrete examples for your team", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.teal, margin: 0 });

    // Left: testing.md
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.3, w: 4.3, h: 2.6, fill: { color: C.navy } });
    s.addText("testing.md", { x: 0.9, y: 1.4, w: 3, h: 0.25, fontSize: 11, fontFace: "Consolas", bold: true, color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "# Testing Conventions", options: { color: C.white, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "- All new API endpoints must", options: { color: C.lightGray, breakLine: true } },
      { text: "  have at least one test", options: { color: C.lightGray, breakLine: true } },
      { text: "- Test files go in the app's", options: { color: C.lightGray, breakLine: true } },
      { text: "  tests/ directory", options: { color: C.lightGray, breakLine: true } },
      { text: "- Use factory_boy for test data", options: { color: C.lightGray, breakLine: true } },
      { text: "- Test names follow:", options: { color: C.lightGray, breakLine: true } },
      { text: "  test_<action>_<condition>_<result>", options: { color: C.green, breakLine: true } },
      { text: "- Always test success + failure", options: { color: C.lightGray, breakLine: true } },
      { text: "  for permission-gated views", options: { color: C.lightGray } },
    ], { x: 0.9, y: 1.7, w: 3.9, h: 2.1, fontSize: 11, fontFace: "Consolas", margin: 0, paraSpaceAfter: 0 });

    // Right: api-conventions.md
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.3, h: 2.6, fill: { color: C.navy } });
    s.addText("api-conventions.md", { x: 5.5, y: 1.4, w: 3.5, h: 0.25, fontSize: 11, fontFace: "Consolas", bold: true, color: C.accentAlt, margin: 0 });
    s.addText([
      { text: "# API Conventions", options: { color: C.white, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "- All viewsets must set", options: { color: C.lightGray, breakLine: true } },
      { text: "  permission_classes explicitly", options: { color: C.lightGray, breakLine: true } },
      { text: "- Use ModelSerializer with", options: { color: C.lightGray, breakLine: true } },
      { text: "  explicit fields (never __all__)", options: { color: C.orange, breakLine: true } },
      { text: "- Pagination required on all", options: { color: C.lightGray, breakLine: true } },
      { text: "  list endpoints", options: { color: C.lightGray, breakLine: true } },
      { text: "- All 4xx responses must include", options: { color: C.lightGray, breakLine: true } },
      { text: "  a message field in the body", options: { color: C.lightGray, breakLine: true } },
      { text: "- URL: /api/<app>/<resource>/", options: { color: C.green } },
    ], { x: 5.5, y: 1.7, w: 3.9, h: 2.1, fontSize: 11, fontFace: "Consolas", margin: 0, paraSpaceAfter: 0 });

    // Subdirectory CLAUDE.md
    s.addText("Subdirectory CLAUDE.md", { x: 0.7, y: 4.2, w: 5, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.6, w: 4.3, h: 0.55, fill: { color: C.offWhite } });
    s.addText([
      { text: "Backend/src/contract/CLAUDE.md", options: { fontFace: "Consolas", fontSize: 11, bold: true, color: C.deepBlue, breakLine: true } },
      { text: "Only loads when Claude works in this directory", options: { fontSize: 10, color: C.bodyText } },
    ], { x: 0.85, y: 4.6, w: 4.0, h: 0.55, fontFace: "Calibri", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 4.6, w: 4.3, h: 0.55, fill: { color: C.offWhite } });
    s.addText([
      { text: "Zero overhead ", options: { bold: true, color: C.darkText } },
      { text: "for work elsewhere. ", options: { color: C.bodyText } },
      { text: "Full depth ", options: { bold: true, color: C.darkText } },
      { text: "where needed.", options: { color: C.bodyText } },
    ], { x: 5.45, y: 4.6, w: 4.0, h: 0.55, fontSize: 11, fontFace: "Calibri", valign: "middle", margin: 0 });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 10: The Automated Team Workflow
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    s.addText("The Automated Team Workflow", { x: 0.7, y: 0.3, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
    s.addText("Every check is automatic. Nothing depends on the developer remembering.", { x: 0.7, y: 0.8, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.teal, margin: 0 });

    const steps = [
      { label: "Session starts", detail: "SessionStart hook loads team context", color: C.medGray, type: "Hook" },
      { label: "/implement-feature", detail: "Claude enters Plan Mode, reads CLAUDE.md + rules", color: C.deepBlue, type: "Command" },
      { label: "Claude implements", detail: "PostToolUse hook runs tests after each file edit", color: C.teal, type: "Hook" },
      { label: "Tests fail?", detail: "Claude sees failure \u2192 fixes \u2192 tests run again", color: C.orange, type: "Auto-fix" },
      { label: "Stop hook triggers", detail: "Code-reviewer sub-agent reviews all changes", color: C.midnight, type: "Agent" },
      { label: "TaskCompleted", detail: "Verifies: tests pass + lint clean \u2192 PR ready", color: C.green, type: "Hook" },
    ];

    steps.forEach((st, i) => {
      const sy = 1.2 + i * 0.58;
      // Connector line
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, { x: 1.32, y: sy + 0.43, w: 0, h: 0.15, line: { color: C.lightGray, width: 2 } });
      }
      // Step card
      s.addShape(pres.shapes.RECTANGLE, { x: 1.6, y: sy, w: 7.2, h: 0.46, fill: { color: C.white }, shadow: makeCardShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.6, y: sy, w: 0.05, h: 0.46, fill: { color: st.color } });
      // Number circle
      addIconCircle(s, pres, 0.9, sy + 0.02, 0.4, st.color, String(i + 1));
      // Label
      s.addText(st.label, { x: 1.85, y: sy, w: 2.3, h: 0.46, fontSize: 11, fontFace: "Calibri", bold: true, color: C.darkText, valign: "middle", margin: 0 });
      // Detail
      s.addText(st.detail, { x: 4.2, y: sy, w: 3.5, h: 0.46, fontSize: 10, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0 });
      // Type badge
      s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: sy + 0.08, w: 0.8, h: 0.28, fill: { color: st.color } });
      s.addText(st.type, { x: 7.9, y: sy + 0.08, w: 0.8, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    });

    // Bottom arrow to PR
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.35, fill: { color: C.navy } });
    s.addText("Developer reviews PR \u2192 merge", {
      x: 0.7, y: 4.85, w: 8.6, h: 0.35, fontSize: 13, fontFace: "Calibri", bold: true, color: C.green, align: "center", valign: "middle", margin: 0
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 11: Summary / Key Takeaways
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
      { text: "Hooks = guaranteed automation", sub: "Tests run every time, dangerous commands blocked every time" },
      { text: "Sub-agents = isolated delegation", sub: "Research and review without polluting main context" },
      { text: "Rules files = scalable conventions", sub: "CLAUDE.md stays lean, teams don\u2019t conflict" },
      { text: "PostToolUse is the #1 hook", sub: "Self-correcting loop: write \u2192 test \u2192 fix \u2192 repeat" },
      { text: "Automate everything you\u2019d forget", sub: "Build a system that makes the right thing the easy thing" },
    ];
    takeaways.forEach((t, i) => {
      const ty = 1.2 + i * 0.7;
      s.addText((i + 1).toString(), { x: 0.8, y: ty, w: 0.4, h: 0.35, fontSize: 20, fontFace: "Calibri", bold: true, color: C.accent, margin: 0 });
      s.addText(t.text, { x: 1.4, y: ty, w: 7.5, h: 0.32, fontSize: 16, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });
      s.addText(t.sub, { x: 1.4, y: ty + 0.32, w: 7.5, h: 0.28, fontSize: 12, fontFace: "Calibri", color: C.medGray, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.8, w: 8.6, h: 0.04, fill: { color: C.accent } });
    s.addText("Next: Hands-on lab \u2014 create commands, configure hooks, set up rules files", {
      x: 0.7, y: 4.9, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.medGray, margin: 0
    });
  }

  const outPath = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_2/04_Hooks_Automation.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Presentation written to:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
