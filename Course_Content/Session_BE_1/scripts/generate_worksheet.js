const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak
} = require("docx");

// ── Style Constants (matching Session 2-3 worksheet) ──
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

function codeBlock(lines) {
  return lines.map(line =>
    new Paragraph({
      spacing: { after: 0 },
      shading: { type: ShadingType.CLEAR, fill: COLOR.codeBg },
      indent: { left: 120, right: 120 },
      children: [new TextRun({ text: line || " ", font: FONT.code, size: 18, color: COLOR.codeText })],
    })
  );
}

function inlineCode(text) {
  return new TextRun({ text, font: FONT.code, size: 20, color: COLOR.primary });
}

function checkbox(text) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "\u2610  ", font: FONT.main, size: 21, color: COLOR.body }),
      new TextRun({ text, font: FONT.main, size: 21, color: COLOR.body }),
    ],
  });
}

function answerLine(label) {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, space: 4, color: COLOR.answerLine } },
    children: [new TextRun({ text: label || " ", font: FONT.main, size: 21, color: COLOR.subtitle })],
  });
}

function simpleTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: COLOR.primary },
      margins: cellMargins,
      children: [new Paragraph({
        children: [new TextRun({ text: h, font: FONT.main, size: 20, bold: true, color: COLOR.white })],
      })],
    })),
  });
  const dataRows = rows.map((row, i) => new TableRow({
    children: row.map(cell => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? COLOR.white : COLOR.altRow },
      margins: cellMargins,
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: FONT.main, size: 20, color: COLOR.body })],
      })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

function separator() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, space: 8, color: COLOR.separator } },
    children: [],
  });
}

// ── Main Document ──

async function main() {
  const doc = new Document({
    creator: "Claude Code Training",
    title: "Session BE-1: Student Worksheet",
    description: "Cross-Repo API Change on Your Codebase",
    styles: {
      default: {
        document: { run: { font: FONT.main, size: 21, color: COLOR.body } },
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
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      children: [
        // ─── TITLE PAGE ───
        new Paragraph({ spacing: { before: 1200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "STUDENT WORKSHEET", font: FONT.main, size: 28, bold: true, color: COLOR.primary, allCaps: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: "Backend Session 1", font: FONT.main, size: 44, bold: true, color: COLOR.title })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Multi-Repo Context, MCPs, and Repo Configuration", font: FONT.main, size: 24, color: COLOR.subtitle })],
        }),
        separator(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "Duration: 35\u201340 minutes  \u2022  Independent Work", font: FONT.main, size: 20, color: COLOR.subtitle })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "Apply the multi-repo and MCP workflow to YOUR Django + React project", font: FONT.main, size: 20, italics: true, color: COLOR.body })],
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ─── BEFORE YOU START ───
        heading1("Before You Start"),
        para(bodyText("Make sure you have:")),
        checkbox("Claude Code installed and authenticated (claude --version)"),
        checkbox("GitHub CLI installed and authenticated (gh auth status)"),
        checkbox("Your backend repo cloned locally"),
        checkbox("Your frontend repo or directory accessible locally"),
        checkbox("A working branch created for this session"),
        separator(),
        para(boldText("Your paths:")),
        para(bodyText("Backend repo path: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        para(bodyText("Frontend repo/dir path: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        para(bodyText("Django manage.py location: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        new Paragraph({ children: [new PageBreak()] }),

        // ─── EXERCISE 1 ───
        heading1("Exercise 1: Configure Project-Level Settings"),
        para(italicText("Protect your Django project\u2019s sensitive areas before using Claude.")),
        heading3("1.1 \u2014 Identify Your Sensitive Paths"),
        simpleTable(
          ["Sensitive Area", "Your Project\u2019s Path"],
          [
            ["Migration files", ""],
            ["Environment files (.env)", ""],
            ["Django settings", ""],
            ["manage.py location", ""],
            ["Docker / deployment configs", ""],
          ]
        ),
        heading3("1.2 \u2014 Create Your Settings File"),
        para(bodyText("Start Claude Code in your backend repo and ask it to create ")),
        para(inlineCode(".claude/settings.json"), bodyText(" with appropriate deny/allow rules.")),
        heading3("Prompt Template:"),
        ...codeBlock([
          "Create a .claude/settings.json file for this Django project.",
          "",
          "Deny: editing migrations, .env, settings.py,",
          "      running migrate/flush/dbshell, rm -rf,",
          "      reading .env files",
          "",
          "Allow: reading all source files,",
          "       running manage.py test/check,",
          "       running your linter",
        ]),
        heading3("Verify"),
        checkbox("Settings file created at .claude/settings.json"),
        checkbox("Deny list includes migrations, .env, destructive commands"),
        checkbox("Allow list includes read access and safe commands"),
        checkbox("Glob patterns match your actual project structure"),
        separator(),

        // ─── EXERCISE 2 ───
        heading1("Exercise 2: Register and Verify GitHub MCP"),
        heading3("2.1 \u2014 Register"),
        ...codeBlock(["claude mcp add --transport http github https://api.githubcopilot.com/mcp"]),
        heading3("2.2 \u2014 Verify"),
        ...codeBlock(["claude mcp list"]),
        checkbox("\"github\" appears in the list with HTTP transport"),
        heading3("2.3 \u2014 Authenticate"),
        para(bodyText("Start a Claude session, run "), inlineCode("/mcp"), bodyText(", select github, and complete OAuth.")),
        heading3("2.4 \u2014 Test the Connection"),
        ...codeBlock(["Can you access GitHub? List the 5 most recent commits on the main branch."]),
        checkbox("Claude lists recent commits"),
        checkbox("No authentication errors"),
        separator(),

        // ─── EXERCISE 3 ───
        heading1("Exercise 3: Launch with Multi-Repo Context"),
        heading3("3.1 \u2014 Launch"),
        ...codeBlock([
          "cd /path/to/your/backend",
          "claude --add-dir /path/to/your/frontend",
        ]),
        para(italicText("If same repo: cd /path/to/repo/backend-dir && claude --add-dir ../frontend-dir")),
        heading3("3.2 \u2014 Verify Cross-Repo Access"),
        ...codeBlock(["List the main directories in both backend and frontend."]),
        checkbox("Claude lists backend files"),
        checkbox("Claude lists frontend files"),
        checkbox("No access errors"),
        heading3("3.3 \u2014 Test @ Mention Navigation"),
        para(bodyText("Reference a file in each area using @:")),
        para(bodyText("Backend file tested: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        para(bodyText("Frontend file tested: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        checkbox("Both @ references resolve correctly"),
        separator(),

        // ─── EXERCISE 4 ───
        heading1("Exercise 4: Discover Your API Contracts"),
        heading3("4.1 \u2014 Map Your API Endpoints"),
        ...codeBlock([
          "Find all API endpoints in the Django backend.",
          "For each, search the frontend for the matching API call.",
          "Present as: Method | URL | View | Frontend Consumer | Match?",
        ]),
        heading3("4.2 \u2014 Record Observations"),
        para(bodyText("Endpoints with no frontend consumer:")),
        answerLine(""),
        answerLine(""),
        para(bodyText("Frontend calls with no backend endpoint:")),
        answerLine(""),
        answerLine(""),
        para(bodyText("Field name or type mismatches:")),
        answerLine(""),
        answerLine(""),
        heading3("4.3 \u2014 Save the API Map"),
        ...codeBlock(["Save this API mapping as docs/api-mapping.md"]),
        checkbox("API mapping document created"),
        separator(),

        // ─── EXERCISE 5 ───
        heading1("Exercise 5: Implement a New Django REST Endpoint"),
        heading3("5.1 \u2014 Define the Spec"),
        simpleTable(
          ["Field", "Your Value"],
          [
            ["HTTP Method", ""],
            ["URL Pattern", ""],
            ["App (new or existing)", ""],
            ["Response Fields", ""],
            ["Permission Required", ""],
            ["Models Involved", ""],
          ]
        ),
        heading3("5.2 \u2014 Ask Claude to Implement"),
        para(bodyText("Be specific about tech stack and patterns. Tell Claude to read existing code first.")),
        heading3("5.3 \u2014 Review Checklist"),
        para(boldText("Serializer:")),
        checkbox("Field types match the data"),
        checkbox("Follows existing serializer conventions"),
        checkbox("No unnecessary or missing fields"),
        para(boldText("View:")),
        checkbox("Correct base class (matching project patterns)"),
        checkbox("Correct permission class applied"),
        checkbox("Queries are correct (model names, fields, filters)"),
        checkbox("Imports are valid"),
        para(boldText("URL Config:")),
        checkbox("URL pattern matches spec"),
        checkbox("Properly imported and registered"),
        para(boldText("Frontend Service Call:")),
        checkbox("Correct URL and HTTP method"),
        checkbox("Includes auth header if needed"),
        checkbox("Matches existing frontend API patterns"),
        separator(),

        // ─── EXERCISE 6 ───
        heading1("Exercise 6: Verify the Endpoint"),
        heading3("6.1 \u2014 Run Django Checks"),
        ...codeBlock(["Run manage.py check to verify configuration."]),
        checkbox("No errors from manage.py check"),
        heading3("6.2 \u2014 Run Tests"),
        ...codeBlock(["Run the test suite."]),
        checkbox("Existing tests still pass"),
        checkbox("No import or config errors"),
        heading3("6.3 \u2014 (Optional) Write a Test"),
        para(bodyText("Ask Claude to write a test for the new endpoint following existing test patterns.")),
        checkbox("Test file created"),
        checkbox("Test passes"),
        separator(),

        // ─── EXERCISE 7 ───
        heading1("Exercise 7: Create a PR via GitHub MCP"),
        heading3("7.1 \u2014 Commit and Push"),
        para(bodyText("Ask Claude to stage, commit, and push to a new feature branch.")),
        heading3("7.2 \u2014 Create the PR"),
        para(bodyText("Ask Claude to create a GitHub PR with API spec in the description.")),
        heading3("Verify"),
        checkbox("PR created successfully"),
        checkbox("PR title is clear and concise"),
        checkbox("PR description includes API spec"),
        checkbox("All changed files included"),
        para(boldText("Your PR URL: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        separator(),

        // ─── EXERCISE 8 ───
        heading1("Exercise 8: Create an API Mapping Document"),
        para(bodyText("Generate a comprehensive API mapping document and add it to your PR.")),
        ...codeBlock([
          "Create docs/api-mapping.md with:",
          "1. Table of all API endpoints",
          "2. New endpoint spec + example curl + frontend fetch",
          "3. Orphaned endpoints or mismatches",
        ]),
        checkbox("Document covers all endpoints"),
        checkbox("New endpoint has complete spec"),
        checkbox("Added to PR"),
        new Paragraph({ children: [new PageBreak()] }),

        // ─── SELF-ASSESSMENT ───
        heading1("Self-Assessment"),
        heading2("Understanding"),
        para(boldText("1. What does --add-dir do, and why is it important for separate repos?")),
        answerLine(""),
        answerLine(""),
        answerLine(""),
        para(boldText("2. What is MCP, and how does GitHub MCP help backend developers?")),
        answerLine(""),
        answerLine(""),
        answerLine(""),
        para(boldText("3. Why should migration files be in the deny list (not just ask)?")),
        answerLine(""),
        answerLine(""),
        para(boldText("4. What additional files load when you @-reference a file?")),
        answerLine(""),
        answerLine(""),
        para(boldText("5. Difference between .claude/settings.json and .claude/settings.local.json?")),
        answerLine(""),
        answerLine(""),

        heading2("Experience"),
        para(bodyText("New endpoint created: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        para(bodyText("App/module: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        para(bodyText("Issues encountered: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),
        para(bodyText("How resolved: "), new TextRun({ text: "________________________________________", font: FONT.main, size: 21, color: COLOR.answerLine })),

        heading2("Confidence Rating (1\u20135)"),
        simpleTable(
          ["Skill", "Rating"],
          [
            ["Configuring .claude/settings.json for Django", ""],
            ["Using --add-dir for multi-repo context", ""],
            ["Registering and authenticating GitHub MCP", ""],
            ["Using @ mentions across repos", ""],
            ["Asking Claude to create a Django REST endpoint", ""],
            ["Reviewing Claude-generated code for correctness", ""],
            ["Creating a PR via GitHub MCP", ""],
            ["Understanding deny/allow/ask rules", ""],
          ]
        ),
        separator(),

        // ─── WHAT TO BRING ───
        heading2("What to Bring to Session BE-2"),
        para(italicText("Hooks and Sub-Agents: Automate Testing + Security Review")),
        checkbox("The .claude/settings.json you created today"),
        checkbox("The endpoint you built (for testing PostToolUse hooks)"),
        checkbox("Your linter installed locally (Ruff, Flake8, or Black)"),
        checkbox("pytest installed: pip install pytest pytest-django"),
        checkbox("Know your test runner command"),
        separator(),

        // ─── QUICK REFERENCE ───
        heading2("Quick Reference"),
        simpleTable(
          ["Command", "Purpose"],
          [
            ["claude --add-dir ../frontend", "Launch with cross-repo context"],
            ["/add-dir /path/to/repo", "Add directory mid-session"],
            ["claude mcp add --transport http github [url]", "Register GitHub MCP"],
            ["claude mcp list", "List registered MCP servers"],
            ["/mcp", "Manage MCP servers in-session"],
            ["@path/to/file.py", "Reference a file in prompts"],
            ["/config", "Open settings"],
            ["Shift+Tab", "Cycle permission modes"],
            ["/plan", "Enter Plan Mode"],
            ["gh auth status", "Check GitHub CLI auth"],
            ["gh pr view --web", "Open PR in browser"],
          ]
        ),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = `${__dirname}/../06_Student_Worksheet.docx`;
  fs.writeFileSync(outPath, buffer);
  console.log(`\u2705  Worksheet saved to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
