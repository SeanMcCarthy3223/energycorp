const pptxgen = require("pptxgenjs");

// ─── Color Palette: Ocean Gradient (matching Sessions 2-3) ───
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

function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
}

function addSlideTitle(slide, text) {
  slide.addText(text, {
    x: 0.7, y: 0.3, w: 8.6, h: 0.6,
    fontSize: 28, fontFace: "Calibri", bold: true, color: C.navy, margin: 0
  });
}

function addCard(slide, pres, x, y, w, h, content, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.bgColor || C.white },
    shadow: makeCardShadow(),
    rectRadius: 0.05
  });
  if (content) {
    slide.addText(content, {
      x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
      fontSize: opts.fontSize || 12, fontFace: "Calibri",
      color: opts.textColor || C.bodyText,
      valign: "top", margin: 0, paraSpaceAfter: 4,
      ...(opts.textOpts || {})
    });
  }
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Claude Code Training";
  pres.title = "Multi-Repo Context, MCPs, and Repo Configuration";

  // ════════════════════════════════════════════════════════
  // SLIDE 1: Title
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    addTopBar(s, pres);
    for (let i = 1; i < 6; i++) {
      s.addShape(pres.shapes.LINE, { x: 0, y: i * 0.95, w: 10, h: 0, line: { color: C.deepBlue, width: 0.3 } });
    }
    s.addText("Multi-Repo Context,", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.0,
      fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addText("MCPs, and Repo Configuration", {
      x: 0.8, y: 2.1, w: 8.4, h: 0.8,
      fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.2, w: 2.5, h: 0.04, fill: { color: C.accent } });
    s.addText("Backend Session 1 \u2014 Advanced User Track", {
      x: 0.8, y: 3.5, w: 8.4, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.medGray, margin: 0
    });
    addIconCircle(s, pres, 6.8, 4.0, 0.7, C.deepBlue, "\u21C4");
    addIconCircle(s, pres, 7.7, 3.8, 0.7, C.teal, "\u2699");
    addIconCircle(s, pres, 8.6, 4.1, 0.6, C.midnight, "\u26A1");
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 2: The Multi-Repo Reality
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "The Multi-Repo Reality");

    const repos = [
      { icon: "\uD83D\uDCE6", label: "Backend Repo", desc: "Django REST API, models, business logic" },
      { icon: "\uD83C\uDFA8", label: "Frontend Repo", desc: "React SPA, API client, components" },
      { icon: "\uD83D\uDCDA", label: "Shared Libs", desc: "Auth, utilities, types" },
      { icon: "\u2699\uFE0F", label: "Infrastructure", desc: "Docker, CI/CD, deployment" },
    ];
    repos.forEach((r, i) => {
      const x = 0.7 + i * 2.2;
      addCard(s, pres, x, 1.2, 2.0, 1.4, [
        { text: r.label + "\n", options: { fontSize: 13, bold: true, color: C.navy } },
        { text: r.desc, options: { fontSize: 11, color: C.bodyText } },
      ]);
    });

    addCard(s, pres, 0.7, 3.0, 8.6, 1.6, [
      { text: "The Problem\n", options: { fontSize: 14, bold: true, color: C.red } },
      { text: "When Claude can only see one repo, it operates like a developer who\u2019s never met the frontend team. It guesses about API contracts, field names, response shapes, and URL patterns.\n\n", options: { fontSize: 12, color: C.bodyText } },
      { text: "Those guesses become hallucinations.", options: { fontSize: 12, bold: true, color: C.red } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 3: --add-dir Extends Claude's Vision
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "--add-dir Extends Claude\u2019s Vision");

    addCard(s, pres, 0.7, 1.1, 4.0, 1.2, [
      { text: "Command Line\n", options: { fontSize: 12, bold: true, color: C.accent } },
      { text: "claude --add-dir ../frontend\nclaude --add-dir ../frontend --add-dir ../libs", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
    ]);

    addCard(s, pres, 5.0, 1.1, 4.3, 1.2, [
      { text: "Mid-Session\n", options: { fontSize: 12, bold: true, color: C.accent } },
      { text: "/add-dir /path/to/other/project", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
    ]);

    const behaviors = [
      "\u2713  Read files in all directories",
      "\u2713  Search across all directories (Glob + Grep)",
      "\u2713  Reference files with @ mentions",
      "\u2713  Edit files in all directories (subject to permissions)",
      "\u2717  CLAUDE.md from added dirs NOT loaded by default",
    ];
    addCard(s, pres, 0.7, 2.6, 8.6, 2.2, [
      { text: "Key Behaviors\n\n", options: { fontSize: 13, bold: true, color: C.navy } },
      ...behaviors.map(b => ({
        text: b + "\n",
        options: { fontSize: 12, color: b.startsWith("\u2717") ? C.orange : C.bodyText }
      })),
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 4: --add-dir Patterns
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "--add-dir Patterns for Backend Teams");

    const patterns = [
      { title: "Separate Repos", cmd: "cd backend-api\nclaude --add-dir ../frontend-app", when: "Backend-focused work" },
      { title: "Parent Directory", cmd: "cd ~/projects\nclaude", when: "Cross-cutting changes" },
      { title: "Monorepo", cmd: "cd monorepo/backend\nclaude --add-dir ../frontend", when: "Subdirectory per service" },
      { title: "Persistent Config", cmd: '\"additionalDirectories\":\n  [\"../frontend-app\"]', when: "Always need cross-repo" },
    ];
    patterns.forEach((p, i) => {
      const x = 0.7 + (i % 2) * 4.5;
      const y = 1.2 + Math.floor(i / 2) * 2.0;
      addCard(s, pres, x, y, 4.2, 1.7, [
        { text: p.title + "\n", options: { fontSize: 13, bold: true, color: C.teal } },
        { text: p.cmd + "\n", options: { fontSize: 10, fontFace: "Consolas", color: C.darkText } },
        { text: "\nBest for: " + p.when, options: { fontSize: 10, italics: true, color: C.medGray } },
      ]);
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 5: What Is MCP?
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "What Is MCP?");

    s.addText("Model Context Protocol \u2014 USB for AI", {
      x: 0.7, y: 0.9, w: 8.6, h: 0.4,
      fontSize: 16, fontFace: "Calibri", italics: true, color: C.teal, margin: 0
    });

    // Architecture flow
    const boxes = [
      { label: "You", x: 0.4, color: C.accent },
      { label: "Claude Code\n(Host)", x: 2.2, color: C.deepBlue },
      { label: "MCP Client\n(Session)", x: 4.2, color: C.teal },
      { label: "MCP Server\n(Tools)", x: 6.2, color: C.midnight },
      { label: "External\nService", x: 8.2, color: C.navy },
    ];
    boxes.forEach(b => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: b.x, y: 1.6, w: 1.6, h: 1.0,
        fill: { color: b.color }, rectRadius: 0.06
      });
      s.addText(b.label, {
        x: b.x, y: 1.6, w: 1.6, h: 1.0,
        fontSize: 10, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0
      });
    });
    // Arrows
    for (let i = 0; i < 4; i++) {
      s.addText("\u2192", {
        x: 1.9 + i * 2.0, y: 1.85, w: 0.4, h: 0.4,
        fontSize: 20, color: C.medGray, align: "center", valign: "middle"
      });
    }

    // What MCP provides
    const provides = [
      { icon: "\uD83D\uDD27", label: "Tools", desc: "Functions Claude can call" },
      { icon: "\uD83D\uDCC4", label: "Resources", desc: "Data Claude can read" },
      { icon: "\uD83D\uDCDD", label: "Prompts", desc: "Pre-built templates" },
    ];
    provides.forEach((p, i) => {
      addCard(s, pres, 0.7 + i * 3.1, 3.2, 2.8, 1.2, [
        { text: p.icon + " " + p.label + "\n", options: { fontSize: 13, bold: true, color: C.navy } },
        { text: p.desc, options: { fontSize: 11, color: C.bodyText } },
      ]);
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 6: GitHub MCP
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "GitHub MCP \u2014 Your Most-Used Backend MCP");

    addCard(s, pres, 0.7, 1.1, 8.6, 0.7, [
      { text: "claude mcp add --transport http github https://api.githubcopilot.com/mcp", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
    ], { bgColor: C.lightGray });

    const rows = [
      ["Create PRs", "create_pull_request", "\"Create a PR for these changes\""],
      ["Read PRs", "get_pull_request", "\"What\u2019s in PR #42?\""],
      ["Search Code", "search_code", "\"Find all uses of this serializer\""],
      ["Create Issues", "create_issue", "\"File a bug for this\""],
      ["List Commits", "list_commits", "\"What changed this week?\""],
      ["Create Branches", "create_branch", "\"Create a feature branch\""],
    ];
    const tableOpts = {
      x: 0.7, y: 2.1, w: 8.6,
      border: { pt: 0.5, color: C.lightGray },
      colW: [2.0, 3.0, 3.6],
      fontSize: 10, fontFace: "Calibri",
      color: C.bodyText,
      rowH: 0.35,
      autoPage: false,
    };
    const tableRows = [
      [
        { text: "Capability", options: { bold: true, color: C.white, fill: { color: C.navy } } },
        { text: "MCP Tool", options: { bold: true, color: C.white, fill: { color: C.navy } } },
        { text: "Example", options: { bold: true, color: C.white, fill: { color: C.navy } } },
      ],
      ...rows.map((r, i) => r.map(cell => ({
        text: cell,
        options: { fill: { color: i % 2 === 0 ? C.white : C.offWhite } }
      }))),
    ];
    s.addTable(tableRows, tableOpts);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 7: MCP Tool Search
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "MCP Tool Search \u2014 Staying Efficient");

    addCard(s, pres, 0.7, 1.2, 4.0, 2.5, [
      { text: "Without Tool Search\n\n", options: { fontSize: 13, bold: true, color: C.red } },
      { text: "All tool descriptions loaded\ninto context window upfront\n\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "\u2717 High context usage\n", options: { fontSize: 11, color: C.red } },
      { text: "\u2717 Less room for code\n", options: { fontSize: 11, color: C.red } },
      { text: "\u2717 Slower performance", options: { fontSize: 11, color: C.red } },
    ]);

    addCard(s, pres, 5.3, 1.2, 4.0, 2.5, [
      { text: "With Tool Search\n\n", options: { fontSize: 13, bold: true, color: C.green } },
      { text: "Tool descriptions loaded\non-demand as needed\n\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "\u2713 Up to 95% context savings\n", options: { fontSize: 11, color: C.green } },
      { text: "\u2713 More room for code\n", options: { fontSize: 11, color: C.green } },
      { text: "\u2713 Automatic (Sonnet 4+ / Opus 4+)", options: { fontSize: 11, color: C.green } },
    ]);

    addCard(s, pres, 0.7, 4.0, 8.6, 0.8, [
      { text: "No configuration needed \u2014 Tool Search activates automatically when tool descriptions exceed 10% of context window.", options: { fontSize: 11, italics: true, color: C.teal } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 8: Figma MCP for Backend Teams
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Figma MCP for Backend Teams");

    s.addText("Designs imply API contracts", {
      x: 0.7, y: 0.9, w: 8.6, h: 0.4,
      fontSize: 16, fontFace: "Calibri", italics: true, color: C.teal, margin: 0
    });

    addCard(s, pres, 0.7, 1.5, 4.0, 3.0, [
      { text: "Figma: \u201CUser Profile Card\u201D\n\n", options: { fontSize: 12, bold: true, color: C.navy } },
      { text: "Avatar (image)\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "Full Name\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "Email\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "Role Badge: \u201CAdmin\u201D\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "Status: \u25CF Active\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "Last Login: Feb 25, 2026\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "[Edit] [Deactivate]", options: { fontSize: 11, color: C.bodyText } },
    ]);

    addCard(s, pres, 5.3, 1.5, 4.0, 3.0, [
      { text: "Implied API Contract\n\n", options: { fontSize: 12, bold: true, color: C.teal } },
      { text: "\u2192 avatar_url (string/URL)\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      { text: "\u2192 full_name (string)\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      { text: "\u2192 email (string)\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      { text: "\u2192 role (enum/choice)\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      { text: "\u2192 is_active (boolean)\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      { text: "\u2192 last_login (datetime)\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      { text: "\u2192 PATCH + DELETE endpoints", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 9: Settings for Django Backend
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Settings for Django Backend Teams");

    const sensitiveCols = [
      ["Sensitive Area", "Risk", "Action"],
      ["migrations/", "Corrupt migration chain", "Deny Edit"],
      [".env / .env.*", "Leak API keys", "Deny Read + Edit"],
      ["manage.py migrate", "Alter production schema", "Deny Bash"],
      ["manage.py flush", "Delete all data", "Deny Bash"],
      ["settings.py", "Change DB / secrets", "Deny Edit"],
    ];
    const tOpts = {
      x: 0.7, y: 1.1, w: 8.6,
      border: { pt: 0.5, color: C.lightGray },
      colW: [2.4, 3.2, 3.0],
      fontSize: 11, fontFace: "Calibri", color: C.bodyText,
      rowH: 0.38, autoPage: false,
    };
    const tRows = sensitiveCols.map((row, i) =>
      row.map(cell => ({
        text: cell,
        options: i === 0
          ? { bold: true, color: C.white, fill: { color: C.navy } }
          : { fill: { color: i % 2 === 0 ? C.white : C.offWhite } }
      }))
    );
    s.addTable(tRows, tOpts);

    addCard(s, pres, 0.7, 3.8, 8.6, 0.9, [
      { text: "Principle: ", options: { fontSize: 12, bold: true, color: C.navy } },
      { text: "Allow reads broadly, restrict writes narrowly, block destructive operations entirely.", options: { fontSize: 12, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 10: Permission Evaluation Flow
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Permission Evaluation Flow");

    const steps = [
      { label: "1. Hooks\n(PreToolUse)", color: C.teal, y: 1.2 },
      { label: "2. Deny Rules\n(first match \u2192 BLOCK)", color: C.red, y: 2.1 },
      { label: "3. Allow Rules\n(first match \u2192 ALLOW)", color: C.green, y: 3.0 },
      { label: "4. Permission Mode\n(default \u2192 ask)", color: C.deepBlue, y: 3.9 },
    ];
    steps.forEach(st => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 1.5, y: st.y, w: 4.0, h: 0.7,
        fill: { color: st.color }, rectRadius: 0.06
      });
      s.addText(st.label, {
        x: 1.5, y: st.y, w: 4.0, h: 0.7,
        fontSize: 12, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0
      });
      if (st.y < 3.9) {
        s.addText("\u2193", {
          x: 3.3, y: st.y + 0.65, w: 0.4, h: 0.35,
          fontSize: 18, color: C.medGray, align: "center"
        });
      }
    });

    addCard(s, pres, 6.0, 1.2, 3.3, 3.5, [
      { text: "Key Insight\n\n", options: { fontSize: 13, bold: true, color: C.navy } },
      { text: "Deny rules are absolute.\n\n", options: { fontSize: 12, bold: true, color: C.red } },
      { text: "If you deny Edit(*/migrations/*.py), no allow rule, permission mode, or user approval can override it.\n\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "This is your hard safety boundary.", options: { fontSize: 11, italics: true, color: C.teal } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 11: @ Mentions for Django
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "@ Mentions for Django Navigation");

    const examples = [
      ["@src/users/models.py", "Load a specific model file"],
      ["@src/rest/urls.py", "See all API route registrations"],
      ["@src/contract/", "Reference an entire Django app"],
      ["@../Frontend/src/App.js", "Cross-repo file (via --add-dir)"],
    ];
    examples.forEach((ex, i) => {
      addCard(s, pres, 0.7, 1.2 + i * 0.9, 8.6, 0.7, [
        { text: ex[0], options: { fontSize: 12, fontFace: "Consolas", bold: true, color: C.accent } },
        { text: "  \u2014  " + ex[1], options: { fontSize: 12, color: C.bodyText } },
      ]);
    });

    addCard(s, pres, 0.7, 4.0, 8.6, 0.8, [
      { text: "Tip: ", options: { fontSize: 11, bold: true, color: C.orange } },
      { text: "When you @-reference a file, Claude also loads CLAUDE.md files from that file\u2019s directory hierarchy. Module-level rules activate automatically.", options: { fontSize: 11, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 12: Combined Workflow
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Multi-Repo + MCP Combined Workflow");

    const workflow = [
      { step: "1", label: "Launch with --add-dir", desc: "Claude sees Backend + Frontend", color: C.deepBlue },
      { step: "2", label: "Discover API contracts", desc: "Read Django views + React services", color: C.teal },
      { step: "3", label: "Implement endpoint", desc: "Django view + serializer + React fetch", color: C.accent },
      { step: "4", label: "GitHub MCP creates PR", desc: "create_pull_request tool call", color: C.green },
      { step: "5", label: "Link to issue", desc: "get_issue \u2192 add_issue_comment", color: C.midnight },
    ];
    workflow.forEach((w, i) => {
      const y = 1.2 + i * 0.75;
      addIconCircle(s, pres, 0.9, y + 0.05, 0.5, w.color, w.step);
      s.addText(w.label, {
        x: 1.7, y, w: 3.0, h: 0.5,
        fontSize: 13, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0
      });
      s.addText(w.desc, {
        x: 4.7, y, w: 4.6, h: 0.5,
        fontSize: 12, fontFace: "Calibri", color: C.bodyText, valign: "middle", margin: 0
      });
    });

    addCard(s, pres, 0.7, 5.1, 8.6, 0.5, [
      { text: "One prompt, one flow, one PR. Five context switches eliminated.", options: { fontSize: 12, bold: true, italics: true, color: C.teal } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 13: Key Takeaways
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    addTopBar(s, pres);
    s.addText("Key Takeaways", {
      x: 0.7, y: 0.3, w: 8.6, h: 0.6,
      fontSize: 28, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });

    const takeaways = [
      "--add-dir makes Claude cross-repo aware",
      "MCP is USB for AI \u2014 a universal connector",
      "GitHub MCP replaces context-switching",
      "Figma MCP reveals API contracts from designs",
      "Deny rules are your hard safety boundary",
      "Configure \u2192 Discover \u2192 Implement \u2192 Verify \u2192 PR",
    ];
    takeaways.forEach((t, i) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.7, y: 1.2 + i * 0.65, w: 8.6, h: 0.5,
        fill: { color: C.deepBlue }, rectRadius: 0.04
      });
      s.addText((i + 1) + ".  " + t, {
        x: 0.9, y: 1.2 + i * 0.65, w: 8.2, h: 0.5,
        fontSize: 14, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
      });
    });

    s.addText("Next Session: Hooks and Sub-Agents for Testing + Security", {
      x: 0.7, y: 5.0, w: 8.6, h: 0.4,
      fontSize: 13, fontFace: "Calibri", italics: true, color: C.medGray, margin: 0
    });
  }

  // ── Save ──
  const outPath = `${__dirname}/../02_Multi_Repo_MCP_Architecture.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`\u2705  Presentation saved to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
