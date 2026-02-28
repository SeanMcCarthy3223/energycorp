const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak
} = require("docx");

// ── Style Constants (matching Session 1 worksheet) ──
const COLOR = {
  primary: "2B579A",
  title: "1A1A2E",
  body: "333333",
  heading3: "444444",
  tip: "4A4A4A",
  subtitle: "666666",
  answerLine: "BBBBBB",
  separator: "CCCCCC",
  altRow: "F2F2F2",
  white: "FFFFFF",
  codeBg: "1E1E1E",
  codeText: "D4D4D4",
  titleBorder: "4F81BD",
};

const FONT = {
  main: "Calibri",
  code: "Consolas",
};

const border = (color, size) => ({ style: BorderStyle.SINGLE, size, color });
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 60, bottom: 60, left: 108, right: 108 };

// ── Helper Functions ──

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, space: 4, color: COLOR.primary } },
    children: [new TextRun({ text, font: FONT.main, size: 36, bold: true, color: COLOR.primary })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: FONT.main, size: 26, bold: true, color: COLOR.body })],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT.main, size: 22, bold: true, color: COLOR.heading3 })],
  });
}

function para(...runs) {
  return new Paragraph({
    spacing: { after: 120 },
    children: runs,
  });
}

function bodyText(text) {
  return new TextRun({ text, font: FONT.main, size: 21, color: COLOR.body });
}

function boldText(text) {
  return new TextRun({ text, font: FONT.main, size: 21, color: COLOR.body, bold: true });
}

function italicText(text) {
  return new TextRun({ text, font: FONT.main, size: 21, color: COLOR.body, italics: true });
}

function codeInline(text) {
  return new TextRun({ text, font: FONT.code, size: 19, color: COLOR.primary });
}

function codeBlock(lines) {
  return lines.map((line) =>
    new Paragraph({
      spacing: { before: line === lines[0] ? 120 : 0, after: line === lines[lines.length - 1] ? 120 : 0 },
      indent: { left: 432, right: 432 },
      shading: { fill: COLOR.codeBg, type: ShadingType.CLEAR },
      children: [new TextRun({ text: line || " ", font: FONT.code, size: 18, color: COLOR.codeText })],
    })
  );
}

function checkbox(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 432 },
    children: [
      new TextRun({ text: "\u2610 ", font: "Segoe UI Symbol", size: 22, color: COLOR.body }),
      new TextRun({ text, font: FONT.main, size: 20, color: COLOR.body }),
    ],
  });
}

function bulletItem(text, bold_prefix) {
  const children = [];
  children.push(new TextRun({ text: "\u2022  ", font: FONT.main, size: 20, color: COLOR.body }));
  if (bold_prefix) {
    children.push(new TextRun({ text: bold_prefix, font: FONT.main, size: 20, color: COLOR.body, bold: true }));
  }
  children.push(new TextRun({ text: typeof text === "string" ? text : "", font: FONT.main, size: 20, color: COLOR.body }));
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 720, hanging: 288 },
    children,
  });
}

function bulletItemWithCode(textBefore, codeText, textAfter) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 720, hanging: 288 },
    children: [
      new TextRun({ text: "\u2022  ", font: FONT.main, size: 20, color: COLOR.body }),
      new TextRun({ text: textBefore, font: FONT.main, size: 20, color: COLOR.body }),
      new TextRun({ text: codeText, font: FONT.code, size: 19, color: COLOR.primary }),
      new TextRun({ text: textAfter || "", font: FONT.main, size: 20, color: COLOR.body }),
    ],
  });
}

function numberedItem(num, textRuns) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 720, hanging: 288 },
    children: [
      new TextRun({ text: `${num}. `, font: FONT.main, size: 20, color: COLOR.body, bold: true }),
      ...textRuns,
    ],
  });
}

function tipBlock(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 432 },
    children: [
      new TextRun({ text: "TIP: ", font: FONT.main, size: 20, color: COLOR.tip, bold: true, italics: true }),
      new TextRun({ text, font: FONT.main, size: 20, color: COLOR.tip, italics: true }),
    ],
  });
}

function answerLine(num) {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    indent: { left: 576 },
    children: [
      new TextRun({ text: "Your answer: ", font: FONT.main, size: 20, color: COLOR.subtitle }),
      new TextRun({ text: "___________________________________________________________", font: FONT.main, size: 20, color: COLOR.answerLine }),
    ],
  });
}

function separator() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 1, color: COLOR.separator } },
    children: [],
  });
}

function makeTableHeaderCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: COLOR.primary, type: ShadingType.CLEAR },
    borders: noBorders,
    margins: cellMargins,
    children: [new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text, font: FONT.main, size: 20, bold: true, color: COLOR.white })],
    })],
  });
}

function makeTableCell(text, width, isAlt, isCode) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: isAlt ? { fill: COLOR.altRow, type: ShadingType.CLEAR } : undefined,
    borders: noBorders,
    margins: cellMargins,
    children: [new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({
        text,
        font: isCode ? FONT.code : FONT.main,
        size: isCode ? 18 : 20,
        color: COLOR.body,
      })],
    })],
  });
}

// ── Build Document ──

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT.main, size: 21, color: COLOR.body },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: FONT.main, color: COLOR.primary },
        paragraph: { spacing: { before: 480, after: 160 }, keepNext: true, keepLines: true },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONT.main, color: COLOR.body },
        paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, keepLines: true },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: FONT.main, color: COLOR.heading3 },
        paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, keepLines: true },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 864, bottom: 1008, left: 1008, right: 1008 },
      },
    },
    children: [
      // ── Title ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, space: 4, color: COLOR.titleBorder } },
        children: [new TextRun({
          text: "Hands-on Lab: Power Features & Automation",
          font: FONT.main, size: 52, bold: true, color: COLOR.title,
          characterSpacing: 5,
        })],
      }),

      // ── Subtitle ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({
          text: "Session 2 \u2014 Independent Work Worksheet",
          font: FONT.main, size: 24, italics: true, color: COLOR.subtitle,
          characterSpacing: 15,
        })],
      }),

      // ── Duration & Goal ──
      para(boldText("Duration: "), bodyText("25\u201335 minutes (independent work)")),
      para(boldText("Goal: "), bodyText("Create custom commands, configure automation hooks, and set up rules files for your project.")),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 1
      // ══════════════════════════════════════════════════
      heading1("Exercise 1: Create a Custom Slash Command (8 min)"),

      heading2("1.1 Set Up the Commands Directory"),
      para(bodyText("Navigate to your project root and create the commands directory:")),
      ...codeBlock(["cd /path/to/your/project", "mkdir -p .claude/commands"]),

      heading2("1.2 Create a Test Command"),
      para(bodyText("Create a file called "), codeInline(".claude/commands/test.md"), bodyText(" that runs your project\u2019s test suite:")),
      ...codeBlock([
        "---",
        "description: Run the full test suite and summarize results",
        "allowed-tools: Bash, Read",
        "---",
        "Run the full test suite with `![your exact test command here]`.",
        "",
        "Report:",
        "1. Total tests run",
        "2. Pass/fail count",
        "3. For any failures: test name, file location, and error message",
        "4. A suggested fix for each failure",
      ]),
      para(boldText("Replace [your exact test command here] with your actual command."), bodyText(" Examples:")),
      bulletItemWithCode("Django: ", "python manage.py test", ""),
      bulletItemWithCode("pytest: ", "pytest --tb=short", ""),
      bulletItemWithCode("npm: ", "npm test -- --watchAll=false", ""),

      heading2("1.3 Test Your Command"),
      para(bodyText("Launch Claude Code and run:")),
      ...codeBlock(["/test"]),
      para(boldText("Verify:")),
      checkbox("The command appears when you type /"),
      checkbox("Claude runs your actual test command"),
      checkbox("Results are formatted as requested"),

      heading2("1.4 Create a Review Command (with arguments)"),
      para(bodyText("Create "), codeInline(".claude/commands/review-file.md"), bodyText(":")),
      ...codeBlock([
        "---",
        "description: Focused code review for a specific file",
        "argument-hint: <file-path>",
        "allowed-tools: Read, Grep, Glob",
        "---",
        "Review @$ARGUMENTS for:",
        "",
        "1. **Import errors** \u2014 are all imported modules actually installed?",
        "2. **Security** \u2014 unvalidated input, missing auth/permission checks",
        "3. **Error handling** \u2014 are exceptions caught? Are edge cases covered?",
        "4. **Project patterns** \u2014 does the code follow patterns from CLAUDE.md?",
        "",
        "Present findings as a numbered list with severity: HIGH / MEDIUM / LOW.",
        "If no issues, say so explicitly.",
      ]),
      para(bodyText("Test it by reviewing one of your project\u2019s files:")),
      ...codeBlock(["/review-file [path/to/a/file/in/your/project]"]),
      para(boldText("Verify:")),
      checkbox("Claude reads the specific file you passed"),
      checkbox("Findings are structured with severity ratings"),
      checkbox("It catches at least one real issue (or confirms the file is clean)"),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 2
      // ══════════════════════════════════════════════════
      heading1("Exercise 2: Configure a PostToolUse Hook (5 min)"),

      heading2("2.1 Open Your Project Settings"),
      para(bodyText("Open "), codeInline(".claude/settings.json"), bodyText(" (create it if it doesn\u2019t exist).")),

      heading2("2.2 Add the Auto-Test Hook"),
      para(bodyText("Add or update your settings to include a PostToolUse hook:")),
      ...codeBlock([
        "{",
        '  "permissions": {',
        '    "allow": [',
        '      "Bash([your test command])",',
        '      "Bash([your lint command, if applicable])"',
        "    ],",
        '    "deny": [',
        '      "Bash(rm -rf *)",',
        '      "Bash(*DROP TABLE*)",',
        '      "Bash(*--force*)"',
        "    ]",
        "  },",
        '  "hooks": {',
        '    "PostToolUse": [{',
        '      "matcher": "Write|Edit",',
        '      "hooks": [{',
        '        "type": "command",',
        '        "command": "cd \\"$CLAUDE_PROJECT_DIR\\" && [your test command] 2>&1 | tail -20"',
        "      }]",
        "    }]",
        "  }",
        "}",
      ]),
      para(boldText("Replace [your test command]"), bodyText(" with your actual test command. Examples:")),
      bulletItemWithCode("Django: ", "python manage.py test 2>&1 | tail -20", ""),
      bulletItemWithCode("pytest: ", "pytest --tb=short --no-header 2>&1 | tail -20", ""),
      bulletItemWithCode("npm: ", "npm test -- --watchAll=false 2>&1 | tail -20", ""),
      para(),
      tipBlock("The | tail -20 limits output so Claude gets a summary, not hundreds of lines."),

      heading2("2.3 Test the Hook"),
      para(bodyText("Restart Claude Code (exit and re-launch to pick up new settings).")),
      para(bodyText("Ask Claude to make a small, safe change:")),
      ...codeBlock(['Add a comment at the top of [one of your files] that says "# Updated by Claude Code"']),
      para(boldText("Verify:")),
      checkbox("Claude edits the file"),
      checkbox("Tests run automatically (you see test output appear without asking)"),
      checkbox("Claude responds to the test results"),
      para(bodyText("Then ask Claude to revert:")),
      ...codeBlock(["Remove the comment you just added."]),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 3
      // ══════════════════════════════════════════════════
      heading1("Exercise 3: Set Up Rules Files (5 min)"),

      heading2("3.1 Create the Rules Directory"),
      ...codeBlock(["mkdir -p .claude/rules"]),

      heading2("3.2 Create Your First Rules File"),
      para(bodyText("Think about your team\u2019s conventions. Pick one area and create a rules file.")),

      heading3("Option A: Testing conventions"),
      para(bodyText("Create "), codeInline(".claude/rules/testing.md"), bodyText(":")),
      ...codeBlock([
        "# Testing Conventions",
        "",
        "- [How do you name test files?]",
        "- [What test framework do you use?]",
        "- [What must be tested for new endpoints/components?]",
        "- [How do you handle test data \u2014 fixtures, factories, mocks?]",
        "- [What\u2019s the minimum test coverage expectation?]",
      ]),

      heading3("Option B: API conventions"),
      para(bodyText("Create "), codeInline(".claude/rules/api-conventions.md"), bodyText(":")),
      ...codeBlock([
        "# API Conventions",
        "",
        "- [What\u2019s your URL pattern? e.g., /api/v1/<resource>/]",
        "- [What auth is required? e.g., Token, JWT, session]",
        "- [What permission model do you use?]",
        "- [What\u2019s the standard response format?]",
        "- [What serializer patterns do you follow?]",
      ]),

      heading3("Option C: Frontend conventions"),
      para(bodyText("Create "), codeInline(".claude/rules/frontend-patterns.md"), bodyText(":")),
      ...codeBlock([
        "# Frontend Conventions",
        "",
        "- [Component structure: functional vs class, hooks vs HOCs]",
        "- [State management: Redux, Context, Zustand, etc.]",
        "- [Styling approach: CSS modules, Tailwind, styled-components, etc.]",
        "- [Folder structure: how are components organized?]",
        "- [Naming conventions: PascalCase components, camelCase functions, etc.]",
      ]),

      para(boldText("Replace the bracketed items with your actual conventions."), bodyText(" Be specific and concise.")),

      heading2("3.3 Create at Least Two Rules Files"),
      para(bodyText("Your team should have at least:")),
      numberedItem(1, [bodyText("One for backend conventions")]),
      numberedItem(2, [bodyText("One for frontend conventions")]),

      heading2("3.4 Verify Claude Reads Them"),
      para(bodyText("Restart Claude Code and ask:")),
      ...codeBlock(["What conventions should I follow when adding a new [endpoint / component] to this project?"]),
      para(boldText("Verify:")),
      checkbox("Claude references information from your rules files"),
      checkbox("The conventions match what you wrote"),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 4 (Stretch)
      // ══════════════════════════════════════════════════
      heading1("Exercise 4: (Stretch Goal) Create a Custom Sub-Agent (5 min)"),

      para(bodyText("If you finish the exercises above with time remaining, try creating a custom sub-agent.")),

      heading2("4.1 Create the Agents Directory"),
      ...codeBlock(["mkdir -p .claude/agents"]),

      heading2("4.2 Create a Reviewer Agent"),
      para(bodyText("Create "), codeInline(".claude/agents/reviewer.md"), bodyText(":")),
      ...codeBlock([
        "---",
        "name: reviewer",
        "description: Reviews code changes for quality and security. Use proactively after edits.",
        "tools: Read, Grep, Glob",
        "model: sonnet",
        "---",
        "You are a code reviewer for [brief description of your project].",
        "",
        "When reviewing code, check for:",
        "1. Import errors and dependency issues",
        "2. Missing error handling",
        "3. Security vulnerabilities (injection, auth bypass, exposed secrets)",
        "4. Deviations from project patterns",
        "",
        "Format findings as:",
        "- CRITICAL: [issue] \u2014 must fix",
        "- WARNING: [issue] \u2014 should fix",
        "- INFO: [observation]",
        "",
        "Be concise. Only flag real issues.",
      ]),

      heading2("4.3 Test the Agent"),
      para(bodyText("Ask Claude:")),
      ...codeBlock(["Use the reviewer agent to review [path/to/a/recently-changed/file]."]),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 5 (Stretch)
      // ══════════════════════════════════════════════════
      heading1("Exercise 5: (Stretch Goal) Install an MCP Server (5 min)"),

      heading2("5.1 Install GitHub MCP"),
      para(bodyText("If your team uses GitHub:")),
      ...codeBlock(["claude mcp add --transport http github https://api.githubcopilot.com/mcp"]),
      para(bodyText("Follow the authentication prompts.")),

      heading2("5.2 Test It"),
      para(bodyText("Launch Claude Code and ask:")),
      ...codeBlock(["List the most recent pull requests on this repository."]),
      para(boldText("Verify:")),
      checkbox("Claude fetches real data from GitHub"),
      checkbox("PR titles and authors are correct"),

      separator(),

      // ══════════════════════════════════════════════════
      // SELF-ASSESSMENT
      // ══════════════════════════════════════════════════
      new Paragraph({ children: [new PageBreak()] }),

      heading1("Self-Assessment"),

      heading2("Understanding"),

      para(boldText("1. "), bodyText("What is the difference between a custom command and a skill?")),
      answerLine(),

      para(boldText("2. "), bodyText("What does a PostToolUse hook with "), codeInline('matcher: "Write|Edit"'), bodyText(" do?")),
      answerLine(),

      para(boldText("3. "), bodyText("Why should you use "), codeInline(".claude/rules/"), bodyText(" instead of putting everything in CLAUDE.md?")),
      answerLine(),

      para(boldText("4. "), bodyText("What is the benefit of running a sub-agent in a forked context?")),
      answerLine(),

      heading2("Experience"),

      para(boldText("5. "), bodyText("What custom command(s) did you create? Which will your team use most?")),
      answerLine(),

      para(boldText("6. "), bodyText("Did the auto-test hook trigger correctly? Did it catch any issues?")),
      answerLine(),

      para(boldText("7. "), bodyText("What conventions did you document in your rules files?")),
      answerLine(),

      heading2("Confidence"),

      para(bodyText("Rate your comfort level (1 = not comfortable, 5 = very comfortable):")),

      // Confidence Table
      new Table({
        width: { size: 8640, type: WidthType.DXA },
        columnWidths: [6480, 2160],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              makeTableHeaderCell("Skill", 6480),
              makeTableHeaderCell("Rating (1\u20135)", 2160),
            ],
          }),
          ...([
            "Creating custom slash commands",
            "Configuring PostToolUse hooks",
            "Setting up rules files for team scaling",
            "Understanding when to use commands vs skills vs MCPs",
            "Creating a custom sub-agent",
          ].map((skill, i) =>
            new TableRow({
              children: [
                makeTableCell(skill, 6480, i % 2 === 1),
                makeTableCell("", 2160, i % 2 === 1),
              ],
            })
          )),
        ],
      }),

      separator(),

      // ══════════════════════════════════════════════════
      // WHAT TO BRING
      // ══════════════════════════════════════════════════
      heading1("What to Bring to Session 3"),

      bulletItemWithCode("Your updated ", ".claude/", " directory (commands, rules, hooks)"),
      bulletItem("Notes on what the auto-test hook caught (or didn\u2019t)"),
      bulletItem("Ideas for additional commands your team would find useful"),
      bulletItem("Any questions about hook configuration or sub-agents"),

      separator(),

      // ══════════════════════════════════════════════════
      // QUICK REFERENCE
      // ══════════════════════════════════════════════════
      heading1("Quick Reference"),

      new Table({
        width: { size: 8640, type: WidthType.DXA },
        columnWidths: [3600, 5040],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              makeTableHeaderCell("Action", 3600),
              makeTableHeaderCell("How", 5040),
            ],
          }),
          ...([
            ["Create a command", "Add .md file to .claude/commands/"],
            ["Create a skill", "Add SKILL.md to .claude/skills/<name>/"],
            ["Create a sub-agent", "Add .md file to .claude/agents/"],
            ["Add MCP server", "claude mcp add --transport <type> <name> <url>"],
            ["List MCP servers", "claude mcp list or /mcp in session"],
            ["Configure hooks", 'Add "hooks" section to .claude/settings.json'],
            ["Add rules file", "Add .md file to .claude/rules/"],
            ["Test hook manually", "Run the command from the hook\u2019s command field in your terminal"],
            ["Manage hooks interactively", "/hooks in session"],
            ["Manage agents interactively", "/agents in session"],
          ].map(([action, how], i) =>
            new TableRow({
              children: [
                makeTableCell(action, 3600, i % 2 === 1),
                makeTableCell(how, 5040, i % 2 === 1, true),
              ],
            })
          )),
        ],
      }),
    ],
  }],
});

// ── Generate ──
const OUTPUT = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_2/06_Student_Worksheet.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Generated: ${OUTPUT} (${(buffer.length / 1024).toFixed(1)} KB)`);
}).catch((err) => {
  console.error("Error generating document:", err);
  process.exit(1);
});
