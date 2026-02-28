const pptxgen = require("pptxgenjs");

// ─── Color Palette: Ocean Gradient (matching Sessions 2-3 + BE_1 02) ───
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
  codeBg:    "1E293B",
  codeText:  "E2E8F0",
};

const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 });

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
      fontSize: opts.fontSize || 12, fontFace: opts.fontFace || "Calibri",
      color: opts.textColor || C.bodyText,
      valign: opts.valign || "top", margin: 0, paraSpaceAfter: 4,
      ...(opts.textOpts || {})
    });
  }
}

function addCodeCard(slide, pres, x, y, w, h, lines) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.codeBg },
    shadow: makeCardShadow(),
    rectRadius: 0.05
  });
  slide.addText(lines.join("\n"), {
    x: x + 0.2, y: y + 0.12, w: w - 0.4, h: h - 0.24,
    fontSize: 9, fontFace: "Consolas",
    color: C.codeText,
    valign: "top", margin: 0, paraSpaceAfter: 2,
    shrinkText: true
  });
}

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
  pres.title = "Settings, @ Mentions, and Permissions for Backend Teams";

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
    s.addText("Settings, @ Mentions,", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.0,
      fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addText("and Permissions", {
      x: 0.8, y: 2.1, w: 8.4, h: 0.8,
      fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.2, w: 2.5, h: 0.04, fill: { color: C.accent } });
    s.addText("Backend Session 1 \u2014 For Django Backend Teams", {
      x: 0.8, y: 3.5, w: 8.4, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.medGray, margin: 0
    });
    addIconCircle(s, pres, 7.0, 4.0, 0.7, C.deepBlue, "\u2699");
    addIconCircle(s, pres, 7.9, 3.8, 0.7, C.teal, "@");
    addIconCircle(s, pres, 8.8, 4.1, 0.6, C.midnight, "\u26A1");
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 2: Why Backend Teams Need Specific Settings
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Why Backend Teams Need Specific Settings");

    const risks = [
      ["migrations/", "Corrupt migration chain", C.red],
      [".env / .env.*", "Leak API keys", C.red],
      ["manage.py migrate", "Alter production schema", C.orange],
      ["manage.py flush", "Delete all data", C.red],
      ["settings.py", "Change DB / secrets", C.orange],
      ["Dockerfile", "Modify deployment", C.orange],
    ];

    const tableOpts = {
      x: 0.7, y: 1.1, w: 8.6,
      border: { pt: 0.5, color: C.lightGray },
      colW: [2.6, 3.0, 3.0],
      fontSize: 11, fontFace: "Calibri", color: C.bodyText,
      rowH: 0.38, autoPage: false,
    };
    const tableRows = [
      [
        { text: "Sensitive Area", options: { bold: true, color: C.white, fill: { color: C.navy } } },
        { text: "Risk", options: { bold: true, color: C.white, fill: { color: C.navy } } },
        { text: "What Could Go Wrong", options: { bold: true, color: C.white, fill: { color: C.navy } } },
      ],
      ...risks.map((r, i) => [
        { text: r[0], options: { fontFace: "Consolas", fontSize: 10, fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
        { text: r[1], options: { color: r[2], bold: true, fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
        { text: [
          "Claude edits a migration",
          "Claude reads/logs secrets",
          "Claude runs migrate on prod",
          "Claude flushes thinking it\u2019s cleanup",
          "Claude modifies production settings",
          "Claude changes deploy config"
        ][i], options: { fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
      ]),
    ];
    s.addTable(tableRows, tableOpts);

    addCard(s, pres, 0.7, 4.1, 8.6, 0.7, [
      { text: "Every one of these has happened to someone. ", options: { fontSize: 12, italics: true, color: C.bodyText } },
      { text: "Settings are your safety net.", options: { fontSize: 12, bold: true, color: C.navy } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 3: Project-Level Settings for Django
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Project-Level Settings for Django");

    s.addText("Create .claude/settings.json in your project root", {
      x: 0.7, y: 0.9, w: 8.6, h: 0.3,
      fontSize: 13, fontFace: "Calibri", italics: true, color: C.teal, margin: 0
    });

    // Split into Deny and Allow columns
    addCodeCard(s, pres, 0.7, 1.35, 4.2, 2.7, [
      '"deny": [',
      '  "Edit(*/migrations/*.py)",',
      '  "Edit(.env*)",',
      '  "Edit(**/settings.py)",',
      '  "Bash(*manage.py*migrate*)",',
      '  "Bash(*manage.py*flush*)",',
      '  "Bash(*manage.py*dbshell*)",',
      '  "Bash(rm -rf*)",',
      '  "Bash(*DROP*TABLE*)",',
      '  "Read(.env*)"',
      ']',
    ]);

    addCodeCard(s, pres, 5.1, 1.35, 4.2, 2.7, [
      '"allow": [',
      '  "Read(**/*.py)",',
      '  "Read(**/*.js)",',
      '  "Read(**/*.jsx)",',
      '  "Read(**/*.json)",',
      '  "Read(**/*.md)",',
      '  "Bash(python*manage.py*test*)",',
      '  "Bash(python*manage.py*check*)",',
      '  "Bash(ruff check*)",',
      '  "Bash(pytest*)"',
      ']',
    ]);

    // Labels above code cards
    s.addText("\u26D4 Deny (blocked absolutely)", {
      x: 0.7, y: 1.15, w: 4.2, h: 0.25,
      fontSize: 10, fontFace: "Calibri", bold: true, color: C.red, margin: 0
    });
    s.addText("\u2705 Allow (permitted silently)", {
      x: 5.1, y: 1.15, w: 4.2, h: 0.25,
      fontSize: 10, fontFace: "Calibri", bold: true, color: C.green, margin: 0
    });

    addCard(s, pres, 0.7, 4.25, 8.6, 0.6, [
      { text: "Principle: ", options: { fontSize: 12, bold: true, color: C.navy } },
      { text: "Allow reads broadly, restrict writes narrowly, block destructive operations entirely. Everything else falls to \u201Cask.\u201D", options: { fontSize: 12, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 4: The Permission Evaluation Flow
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Permission Evaluation Flow");

    const steps = [
      { label: "1. Hooks\n(PreToolUse)", color: C.teal, y: 1.2 },
      { label: "2. Deny Rules\n(first match \u2192 BLOCK)", color: C.red, y: 2.0 },
      { label: "3. Ask Rules\n(first match \u2192 prompt)", color: C.orange, y: 2.8 },
      { label: "4. Allow Rules\n(first match \u2192 ALLOW)", color: C.green, y: 3.6 },
      { label: "5. Permission Mode\n(fallback \u2192 ask)", color: C.deepBlue, y: 4.4 },
    ];
    steps.forEach(st => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 1.2, y: st.y, w: 4.2, h: 0.65,
        fill: { color: st.color }, rectRadius: 0.06
      });
      s.addText(st.label, {
        x: 1.2, y: st.y, w: 4.2, h: 0.65,
        fontSize: 11, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0
      });
      if (st.y < 4.4) {
        s.addText("\u2193", {
          x: 3.1, y: st.y + 0.6, w: 0.4, h: 0.3,
          fontSize: 16, color: C.medGray, align: "center"
        });
      }
    });

    addCard(s, pres, 6.0, 1.2, 3.3, 3.8, [
      { text: "Key Insight\n\n", options: { fontSize: 14, bold: true, color: C.navy } },
      { text: "Deny rules are absolute.\n\n", options: { fontSize: 12, bold: true, color: C.red } },
      { text: "If you deny Edit(*/migrations/*.py), no allow rule, permission mode, or user approval can override it.\n\n", options: { fontSize: 11, color: C.bodyText } },
      { text: "Rules are evaluated:\nDeny \u2192 Ask \u2192 Allow\nFirst match wins.\n\n", options: { fontSize: 11, bold: true, color: C.teal } },
      { text: "This is your hard safety boundary.", options: { fontSize: 11, italics: true, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 5: Glob Patterns for Django Projects
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Glob Patterns for Django Projects");

    const patterns = [
      ["*/migrations/*.py", "Any migration file", "Protect migrations"],
      ["**/*.py", "All Python files", "Broad read access"],
      [".env*", ".env, .env.local, .env.prod", "Block all env files"],
      ["**/settings.py", "Settings anywhere", "Protect Django config"],
      ["**/tests/**", "All test files/dirs", "Allow free editing"],
      ["Bash(python*manage.py*test*)", "Any test command", "Allow running tests"],
    ];

    const tableOpts = {
      x: 0.7, y: 1.1, w: 8.6,
      border: { pt: 0.5, color: C.lightGray },
      colW: [3.2, 2.7, 2.7],
      fontSize: 10, fontFace: "Calibri", color: C.bodyText,
      rowH: 0.38, autoPage: false,
    };
    const tableRows = [
      [
        { text: "Pattern", options: { bold: true, color: C.white, fill: { color: C.navy } } },
        { text: "Matches", options: { bold: true, color: C.white, fill: { color: C.navy } } },
        { text: "Use Case", options: { bold: true, color: C.white, fill: { color: C.navy } } },
      ],
      ...patterns.map((r, i) => [
        { text: r[0], options: { fontFace: "Consolas", fontSize: 9, fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
        { text: r[1], options: { fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
        { text: r[2], options: { fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
      ]),
    ];
    s.addTable(tableRows, tableOpts);

    addCard(s, pres, 0.7, 3.9, 8.6, 1.0, [
      { text: "Combining patterns:\n", options: { fontSize: 11, bold: true, color: C.navy } },
      { text: 'Allow editing tests freely: "Edit(**/tests/**)", "Edit(**/test_*.py)"\n', options: { fontSize: 10, fontFace: "Consolas", color: C.green } },
      { text: 'Block migrations absolutely: "Edit(*/migrations/*.py)"', options: { fontSize: 10, fontFace: "Consolas", color: C.red } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 6: @ Mentions for Django Navigation
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "@ Mentions for Django Navigation");

    const groups = [
      {
        title: "Reference Specific Files",
        items: [
          "@src/users/models.py",
          "@src/rest/urls.py",
          "@src/contract/views.py",
          "@requirements.txt",
        ],
        color: C.accent,
      },
      {
        title: "Reference Directories",
        items: [
          "@src/users/",
          "@src/contract/migrations/",
          "@../Frontend/src/views/",
        ],
        color: C.teal,
      },
    ];

    groups.forEach((g, gi) => {
      const x = 0.7 + gi * 4.5;
      addCard(s, pres, x, 1.1, 4.2, 2.3, [
        { text: g.title + "\n\n", options: { fontSize: 13, bold: true, color: g.color } },
        ...g.items.map(item => ({
          text: item + "\n", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText }
        })),
      ]);
    });

    addCard(s, pres, 0.7, 3.6, 8.6, 1.0, [
      { text: "Practical Workflow\n", options: { fontSize: 12, bold: true, color: C.navy } },
      { text: "Look at @src/users/models.py and @src/users/serializers.py.\nThen create a new serializer for the Client model that includes nested Contract information.", options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
    ]);

    addCard(s, pres, 0.7, 4.8, 8.6, 0.5, [
      { text: "Tip: ", options: { fontSize: 11, bold: true, color: C.orange } },
      { text: "Before asking Claude to create a new view, @-load the models and existing views first. This gives Claude the patterns to follow.", options: { fontSize: 11, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 7: @ Mentions Load CLAUDE.md Hierarchy
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "@ Mentions Load CLAUDE.md Hierarchy");

    s.addText("@Backend/src/contract/views.py triggers loading:", {
      x: 0.7, y: 1.0, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Calibri", italics: true, color: C.teal, margin: 0
    });

    const hierarchy = [
      { path: "Backend/src/contract/CLAUDE.md", desc: "App-level rules", color: C.deepBlue },
      { path: "Backend/src/CLAUDE.md", desc: "Source-level rules", color: C.teal },
      { path: "Backend/CLAUDE.md", desc: "Backend rules", color: C.accent },
      { path: "./CLAUDE.md", desc: "Root (always loaded)", color: C.navy },
    ];

    hierarchy.forEach((h, i) => {
      const y = 1.6 + i * 0.7;
      const indent = i * 0.4;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 1.0 + indent, y, w: 5.5 - indent, h: 0.55,
        fill: { color: h.color }, rectRadius: 0.05
      });
      s.addText(h.path, {
        x: 1.15 + indent, y, w: 3.5, h: 0.55,
        fontSize: 11, fontFace: "Consolas", bold: true, color: C.white,
        valign: "middle", margin: 0
      });
      s.addText(h.desc, {
        x: 4.7, y, w: 1.8, h: 0.55,
        fontSize: 10, fontFace: "Calibri", italics: true, color: C.white,
        valign: "middle", align: "right", margin: 0
      });
      if (i < 3) {
        s.addText("\u2191", {
          x: 1.3 + indent + 0.2, y: y + 0.45, w: 0.4, h: 0.3,
          fontSize: 14, color: C.medGray, align: "center"
        });
      }
    });

    addCard(s, pres, 0.7, 4.5, 8.6, 0.8, [
      { text: "Module-level CLAUDE.md files activate automatically ", options: { fontSize: 12, bold: true, color: C.navy } },
      { text: "when you reference files in their directory. Put Django view conventions in Backend/src/contract/CLAUDE.md \u2014 they apply whenever Claude works on contract views.", options: { fontSize: 11, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 8: Permission Modes for Different Workflows
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Permission Modes for Different Workflows");

    const modes = [
      { name: "Default", when: "Normal dev \u2014 asks before writes", how: "Default behavior", color: C.deepBlue },
      { name: "Plan", when: "Exploring code, planning", how: "Shift+Tab \u00d72, or /plan", color: C.teal },
      { name: "Accept Edits", when: "Executing a reviewed plan", how: "Shift+Tab to toggle", color: C.green },
    ];
    modes.forEach((m, i) => {
      const y = 1.2 + i * 1.0;
      addCard(s, pres, 0.7, y, 8.6, 0.85, [
        { text: m.name + "\n", options: { fontSize: 14, bold: true, color: m.color } },
        { text: m.when + "   \u2022   ", options: { fontSize: 11, color: C.bodyText } },
        { text: m.how, options: { fontSize: 11, fontFace: "Consolas", color: C.darkText } },
      ]);
    });

    // Workflow diagram
    s.addText("Recommended Workflow:", {
      x: 0.7, y: 4.2, w: 8.6, h: 0.3,
      fontSize: 13, fontFace: "Calibri", bold: true, color: C.navy, margin: 0
    });

    const flow = [
      { label: "Plan Mode\nRead & plan", color: C.teal },
      { label: "Default Mode\nApprove changes", color: C.deepBlue },
      { label: "Accept Edits\nFaster execution", color: C.green },
    ];
    flow.forEach((f, i) => {
      const x = 1.0 + i * 3.0;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 4.6, w: 2.4, h: 0.7,
        fill: { color: f.color }, rectRadius: 0.06
      });
      s.addText(f.label, {
        x, y: 4.6, w: 2.4, h: 0.7,
        fontSize: 10, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0
      });
      if (i < 2) {
        s.addText("\u2192", {
          x: x + 2.3, y: 4.7, w: 0.4, h: 0.4,
          fontSize: 18, color: C.medGray, align: "center", valign: "middle"
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 9: Persistent Configuration
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Persistent Configuration");

    s.addText("Stop typing --add-dir every time", {
      x: 0.7, y: 0.9, w: 8.6, h: 0.3,
      fontSize: 14, fontFace: "Calibri", italics: true, color: C.teal, margin: 0
    });

    // Project settings
    addCard(s, pres, 0.7, 1.4, 4.2, 1.8, [
      { text: "Project Settings\n", options: { fontSize: 12, bold: true, color: C.navy } },
      { text: ".claude/settings.json\n", options: { fontSize: 10, fontFace: "Consolas", color: C.accent } },
      { text: "Shared with team (committed)\n\n", options: { fontSize: 10, italics: true, color: C.medGray } },
      { text: '"additionalDirectories":\n  ["../frontend-app"]', options: { fontSize: 10, fontFace: "Consolas", color: C.darkText } },
    ]);

    // Local settings
    addCard(s, pres, 5.1, 1.4, 4.2, 1.8, [
      { text: "Local Settings\n", options: { fontSize: 12, bold: true, color: C.teal } },
      { text: ".claude/settings.local.json\n", options: { fontSize: 10, fontFace: "Consolas", color: C.accent } },
      { text: "Personal, not committed\n\n", options: { fontSize: 10, italics: true, color: C.medGray } },
      { text: '"additionalDirectories":\n  ["../frontend-app",\n   "~/notes/api-specs"]', options: { fontSize: 10, fontFace: "Consolas", color: C.darkText } },
    ]);

    // User settings
    addCard(s, pres, 0.7, 3.5, 8.6, 0.7, [
      { text: "User Settings ", options: { fontSize: 12, bold: true, color: C.midnight } },
      { text: "(~/.claude/settings.json)", options: { fontSize: 10, fontFace: "Consolas", color: C.accent } },
      { text: "  \u2014  Applies to all projects. Use for personal preferences.", options: { fontSize: 11, color: C.bodyText } },
    ]);

    addCard(s, pres, 0.7, 4.4, 8.6, 0.6, [
      { text: "Tip: ", options: { fontSize: 11, bold: true, color: C.orange } },
      { text: "If your team\u2019s frontend repo is always at ../frontend-app, put it in project settings. Personal scratch dirs go in local settings.", options: { fontSize: 11, color: C.bodyText } },
    ]);
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 10: Putting It All Together
  // ════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSlideTitle(s, "Complete Backend Team Settings");

    addCodeCard(s, pres, 0.7, 1.0, 8.6, 3.6, [
      '{',
      '  "permissions": {',
      '    "deny": [',
      '      "Edit(*/migrations/*.py)",',
      '      "Edit(.env*)",    "Edit(**/settings.py)",',
      '      "Bash(*manage.py*migrate*)",',
      '      "Bash(*manage.py*flush*)", "Bash(*manage.py*dbshell*)",',
      '      "Bash(rm -rf*)",  "Bash(*DROP*TABLE*)",',
      '      "Read(.env*)"',
      '    ],',
      '    "allow": [',
      '      "Read(**/*.py)",  "Read(**/*.js)",  "Read(**/*.jsx)",',
      '      "Read(**/*.json)","Read(**/*.md)",',
      '      "Bash(python*manage.py*test*)",',
      '      "Bash(python*manage.py*check*)",',
      '      "Bash(ruff check*)", "Bash(pytest*)"',
      '    ],',
      '    "additionalDirectories": ["../frontend-app"]',
      '  }',
      '}',
    ]);

    const bullets = [
      { icon: "\u26D4", text: "Blocks migration edits, .env access, destructive DB commands", color: C.red },
      { icon: "\u2705", text: "Allows reading all source files, running tests & linters", color: C.green },
      { icon: "\u2753", text: "Asks for all other writes (new files, editing views, serializers)", color: C.orange },
      { icon: "\u21C4", text: "Includes the frontend repo for cross-repo context", color: C.accent },
    ];
    bullets.forEach((b, i) => {
      s.addText(b.icon + "  " + b.text, {
        x: 0.9, y: 4.7 + i * 0.3, w: 8.2, h: 0.3,
        fontSize: 11, fontFace: "Calibri", color: b.color, valign: "middle", margin: 0
      });
    });
  }

  // ════════════════════════════════════════════════════════
  // SLIDE 11: Key Takeaways
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
      "Django projects have uniquely sensitive areas",
      "Deny rules are absolute \u2014 no override possible",
      "Allow reads broadly, restrict writes narrowly",
      "@ mentions load the CLAUDE.md hierarchy",
      "Permission modes complement rules",
      "additionalDirectories persists cross-repo access",
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

    s.addText("Next: Hands-on Lab \u2014 Apply these settings to your own project", {
      x: 0.7, y: 5.0, w: 8.6, h: 0.4,
      fontSize: 13, fontFace: "Calibri", italics: true, color: C.medGray, margin: 0
    });
  }

  // ── Save ──
  const outPath = `${__dirname}/../04_Settings_Permissions_Backend.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`\u2705  Presentation saved to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
