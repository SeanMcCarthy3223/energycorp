const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak
} = require("docx");

// ── Style Constants (matching Session 2 worksheet) ──
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

function noteBlock(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 432 },
    children: [
      new TextRun({ text: "NOTE: ", font: FONT.main, size: 20, color: COLOR.tip, bold: true, italics: true }),
      new TextRun({ text, font: FONT.main, size: 20, color: COLOR.tip, italics: true }),
    ],
  });
}

function answerLine() {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    indent: { left: 576 },
    children: [
      new TextRun({ text: "Your answer: ", font: FONT.main, size: 20, color: COLOR.subtitle }),
      new TextRun({ text: "___________________________________________________________", font: FONT.main, size: 20, color: COLOR.answerLine }),
    ],
  });
}

function fillInLine(label) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 576 },
    children: [
      new TextRun({ text: label + ": ", font: FONT.main, size: 20, color: COLOR.body, bold: true }),
      new TextRun({ text: "___________________________________", font: FONT.main, size: 20, color: COLOR.answerLine }),
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
          text: "Hands-on Lab: Figma MCP & Design-to-Code Pipeline",
          font: FONT.main, size: 48, bold: true, color: COLOR.title,
          characterSpacing: 5,
        })],
      }),

      // ── Subtitle ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({
          text: "Session 3 \u2014 Independent Work Worksheet",
          font: FONT.main, size: 24, italics: true, color: COLOR.subtitle,
          characterSpacing: 15,
        })],
      }),

      // ── Duration & Goal ──
      para(boldText("Duration: "), bodyText("30\u201335 minutes (independent work)")),
      para(boldText("Goal: "), bodyText("Install Figma MCP, extract design tokens from your project\u2019s Figma files, generate a React component matching your project\u2019s conventions, and create a frontend rules file.")),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 1: Install and Verify Figma MCP
      // ══════════════════════════════════════════════════
      heading1("Exercise 1: Install and Verify Figma MCP (5 min)"),

      heading2("1.1 Install the Figma MCP Server"),
      para(bodyText("Open a terminal in your project directory:")),
      ...codeBlock([
        "cd /path/to/your/project",
        "claude mcp add --transport http figma https://mcp.figma.com/mcp",
      ]),

      heading2("1.2 Verify the Installation"),
      para(bodyText("Launch Claude Code and check:")),
      ...codeBlock(["/mcp"]),
      para(bodyText("You should see "), codeInline("figma"), bodyText(" listed as a connected server.")),

      heading2("1.3 Authenticate"),
      para(bodyText("If prompted, follow the OAuth flow \u2014 click the link, authorize in your browser, return to Claude Code.")),
      para(bodyText("If authentication doesn\u2019t trigger automatically, run:")),
      ...codeBlock(["/mcp"]),
      para(bodyText("Then select figma \u2192 Authenticate.")),

      heading2("1.4 Test the Connection"),
      para(bodyText("Ask Claude:")),
      ...codeBlock(["Can you access the Figma MCP? List the available Figma tools you have access to."]),

      para(boldText("Verify:")),
      checkbox("Figma appears in /mcp server list"),
      checkbox("Authentication completed successfully"),
      checkbox("Claude confirms access to Figma tools (get_design_context, get_variable_defs, etc.)"),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 2: Extract Design Tokens
      // ══════════════════════════════════════════════════
      heading1("Exercise 2: Extract Design Tokens (8 min)"),

      heading2("2.1 Identify a Figma File"),
      para(bodyText("You need a Figma file URL. Use one of these:")),
      bulletItem("the actual BulkSource designs (best option)", "Your project\u2019s design file \u2014 "),
      bulletItem("URL provided during the session", "The instructor\u2019s sample file \u2014 "),
      bulletItem("even a personal file works for practice", "Any Figma file you have access to \u2014 "),

      heading2("2.2 Extract Tokens"),
      para(bodyText("Ask Claude to extract design tokens:")),
      ...codeBlock([
        "Extract all design tokens from this Figma file: [PASTE YOUR FIGMA URL]",
        "",
        "I want to see:",
        "1. Color tokens (all named colors with hex values)",
        "2. Typography tokens (font families, sizes, weights, line heights)",
        "3. Spacing tokens (if defined as variables)",
        "4. Border/radius tokens (if defined)",
        "",
        "Format as a structured list I can reference later.",
      ]),

      heading2("2.3 Review the Token Output"),
      para(bodyText("Look at what Claude extracted. Answer these questions:")),
      fillInLine("How many color tokens were found"),
      fillInLine("Are there typography definitions"),
      fillInLine("Were spacing tokens defined"),
      fillInLine("Are token names meaningful (e.g., primary-500) or generic (e.g., color-1)"),

      noteBlock("If get_variable_defs returns few or no tokens: Figma Variables must be manually created by your designer \u2014 they do NOT exist automatically. A file with raw hex colors and no Variables returns zero tokens. You can still use get_design_context to generate components \u2014 it extracts visual properties directly from the frame."),

      heading2("2.4 Create a Token Mapping File"),
      para(bodyText("Ask Claude to create a CSS custom properties file for your project:")),
      ...codeBlock([
        "Based on the tokens you extracted, create a design token mapping file",
        "using CSS custom properties.",
        "",
        "Save it to [your preferred location, e.g., src/styles/design-tokens.css].",
        "",
        "Use semantic names:",
        "- Colors: --color-primary, --color-secondary, --color-surface, --color-text",
        "- Typography: --font-family-body, --font-size-base, --font-weight-bold",
        "- Spacing: --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg",
        "- Borders: --radius-sm, --radius-md, --radius-lg",
      ]),

      para(boldText("Verify:")),
      checkbox("Token file was created at the specified path"),
      checkbox("Color tokens have semantic names (not just --color-1, --color-2)"),
      checkbox("Values match what you see in the Figma file"),
      checkbox("File format matches your project\u2019s styling approach"),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 3: Generate a React Component from Figma
      // ══════════════════════════════════════════════════
      heading1("Exercise 3: Generate a React Component from Figma (12 min)"),

      heading2("3.1 Choose a Figma Frame"),
      para(bodyText("Pick a single component from your Figma file. Good candidates:")),
      bulletItem("A card component (product card, status card, info card)"),
      bulletItem("A table or list view"),
      bulletItem("A form section"),
      bulletItem("A navigation element"),
      para(boldText("Copy the frame\u2019s URL"), bodyText(" from Figma (right-click the frame \u2192 Copy link).")),

      heading2("3.2 Document Your Tech Stack"),
      para(bodyText("Before generating, fill in your project\u2019s tech stack:")),

      // Tech stack table
      new Table({
        width: { size: 8640, type: WidthType.DXA },
        columnWidths: [3240, 5400],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              makeTableHeaderCell("Setting", 3240),
              makeTableHeaderCell("Your Project", 5400),
            ],
          }),
          ...([
            "React version",
            "Component style (class / functional / hooks)",
            "UI library (Reactstrap, MUI, Ant Design, etc.)",
            "Styling approach (CSS modules, SCSS, Tailwind, etc.)",
            "State management (Redux, Context, Zustand, etc.)",
            "i18n library (react-intl, i18next, counterpart, none)",
            "API client (Axios, fetch, React Query, etc.)",
            "TypeScript (yes / no)",
          ].map((setting, i) =>
            new TableRow({
              children: [
                makeTableCell(setting, 3240, i % 2 === 1),
                makeTableCell("", 5400, i % 2 === 1),
              ],
            })
          )),
        ],
      }),

      heading2("3.3 Generate the Component"),
      para(bodyText("Ask Claude to generate a component with your exact constraints:")),
      ...codeBlock([
        "Generate a React component from this Figma frame: [PASTE FRAME URL]",
        "",
        "Use these exact constraints for my project:",
        "- React [your version] with [class/functional] components",
        "- [Your UI library] for base UI components",
        "- [Your styling approach] for styles",
        "- [Your state management] if global state is needed",
        "- [Your i18n approach] for all user-visible text",
        "- [TypeScript/JavaScript] (specify one)",
        "",
        "Follow the patterns in [path/to/an/existing/component/in/your/project].",
        "",
        "Create the component file and any associated style files.",
      ]),

      heading3("Example for a React 18 + TypeScript + Tailwind project:"),
      ...codeBlock([
        "Generate a React component from this Figma frame: [URL]",
        "",
        "Use these exact constraints:",
        "- React 18 with functional components and hooks",
        "- TypeScript for type safety",
        "- Tailwind CSS for styling (no custom CSS files)",
        "- React Query for data fetching if needed",
        "- react-intl for i18n translations",
        "",
        "Follow the patterns in src/components/ProductCard.tsx.",
      ]),

      heading3("Example for a React 16 + JavaScript + CSS Modules project:"),
      ...codeBlock([
        "Generate a React component from this Figma frame: [URL]",
        "",
        "Use these exact constraints:",
        "- React 16 with class components (NO hooks)",
        "- Plain JavaScript (no TypeScript)",
        "- CSS Modules for styling (.module.css files)",
        "- Redux with connect() HOC for state management",
        "- No i18n library \u2014 English only",
        "",
        "Follow the patterns in src/components/OrderList.jsx.",
      ]),

      heading2("3.4 Review the Generated Code"),
      para(bodyText("Run through this checklist:")),

      // Review checklist table
      new Table({
        width: { size: 8640, type: WidthType.DXA },
        columnWidths: [1440, 5040, 2160],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              makeTableHeaderCell("Check", 1440),
              makeTableHeaderCell("Question", 5040),
              makeTableHeaderCell("Pass?", 2160),
            ],
          }),
          ...([
            ["Imports", "Do all imported packages exist in your package.json?"],
            ["Component", "Does it use your component pattern (class/functional)?"],
            ["UI library", "Does it use your UI components, not another library?"],
            ["Styling", "Does it use your styling approach, not a different one?"],
            ["i18n", "Are user-visible strings wrapped in your translation system?"],
            ["State", "Does it manage state the way your other components do?"],
            ["Location", "Is the component in the right directory for your project?"],
          ].map(([check, question], i) =>
            new TableRow({
              children: [
                makeTableCell(check, 1440, i % 2 === 1, false),
                makeTableCell(question, 5040, i % 2 === 1, false),
                makeTableCell("[ ]", 2160, i % 2 === 1, false),
              ],
            })
          )),
        ],
      }),

      heading2("3.5 Refine the Component"),
      para(bodyText("If any checks failed, ask Claude to fix the specific issues:")),
      ...codeBlock([
        "Please fix these issues with the generated component:",
        "1. [List each issue specifically]",
        "2. Verify all imports exist in our package.json",
        "3. Make sure the component follows the exact pattern of [existing component path]",
      ]),

      heading2("3.6 Compare with an Existing Component"),
      para(bodyText("Open the generated component and an existing component from your project side by side. Ask yourself:")),
      bulletItem("Would this pass code review on my team?"),
      bulletItem("Does the structure look natural alongside our other components?"),
      bulletItem("Are there patterns in the generated code that don\u2019t exist in our codebase?"),

      para(boldText("Verify:")),
      checkbox("Generated component uses your correct React version patterns"),
      checkbox("All imports are valid (exist in package.json, correct paths)"),
      checkbox("Styling matches your project\u2019s approach"),
      checkbox("Component structure matches your existing components"),
      checkbox("After refinement, the component would pass code review"),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 4: Create a Frontend Rules File
      // ══════════════════════════════════════════════════
      heading1("Exercise 4: Create a Frontend Rules File (5 min)"),

      heading2("4.1 Create the Rules Directory (if it doesn\u2019t exist)"),
      ...codeBlock(["mkdir -p .claude/rules"]),

      heading2("4.2 Create Your Frontend Conventions File"),
      para(bodyText("Create "), codeInline(".claude/rules/frontend-patterns.md"), bodyText(" using the tech stack you documented in Exercise 3.2:")),
      ...codeBlock([
        "# Frontend Conventions",
        "",
        "## Tech Stack",
        "- React [version] with [component style]",
        "- [UI library] for base components",
        "- [Styling approach]",
        "- [State management] for global state",
        "- [i18n library] for translations",
        "- [API client] for HTTP requests",
        "- [TypeScript/JavaScript]",
        "",
        "## Component Structure",
        "- Components go in [your directory structure]",
        "- [Component naming convention \u2014 PascalCase files, etc.]",
        "- [Export pattern \u2014 default export, named export, HOC wrapper]",
        "- [State management pattern \u2014 where state lives]",
        "",
        "## Styling",
        "- [Where style files live]",
        "- [Class naming convention \u2014 BEM, camelCase, utilities, etc.]",
        "- [How responsive design is handled]",
        "",
        "## When Generating Components from Figma",
        "- Always use [your UI library] components instead of raw HTML",
        "- All user-visible strings must use [your i18n approach]",
        "- Follow the structure of [path/to/your/best/example/component]",
        "- No [list things to avoid: Tailwind if you use SCSS, etc.]",
      ]),

      para(boldText("Replace all bracketed items with your actual conventions."), bodyText(" Be specific and concise.")),

      heading2("4.3 Verify Claude Reads Your Rules"),
      para(bodyText("Restart Claude Code and ask:")),
      ...codeBlock(["What frontend conventions should I follow when creating a new React component in this project?"]),

      para(boldText("Verify:")),
      checkbox("Claude references information from your frontend-patterns.md file"),
      checkbox("The conventions match what you wrote"),
      checkbox("Claude mentions your specific tech stack (not a generic answer)"),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 5: (Stretch) Generate a Second Component
      // ══════════════════════════════════════════════════
      heading1("Exercise 5: (Stretch Goal) Generate a Second Component (5 min)"),

      para(bodyText("If you finished the exercises above with time remaining, generate a second component to test your rules file.")),

      heading2("5.1 Choose a Different Frame"),
      para(bodyText("Pick a different component from your Figma file \u2014 something with different complexity (e.g., if your first was a card, try a table or form).")),

      heading2("5.2 Generate with Minimal Prompting"),
      para(bodyText("This time, give Claude less explicit tech stack information \u2014 let the rules file do the work:")),
      ...codeBlock([
        "Generate a React component from this Figma frame: [PASTE FRAME URL]",
        "",
        "Follow the conventions in our frontend-patterns.md rules file.",
        "Place the component in the appropriate directory.",
      ]),

      heading2("5.3 Compare Results"),
      para(bodyText("Did the rules file work?")),
      checkbox("Claude used your correct tech stack without being told explicitly"),
      checkbox("Component structure matches your conventions"),
      checkbox("Less refinement needed compared to Exercise 3"),

      tipBlock("This is the payoff of rules files \u2014 one-time setup, permanent benefit. Every future component generation automatically follows your conventions."),

      separator(),

      // ══════════════════════════════════════════════════
      // EXERCISE 6: (Stretch) Explore Desktop MCP
      // ══════════════════════════════════════════════════
      heading1("Exercise 6: (Stretch Goal) Explore Desktop MCP (5 min)"),

      para(bodyText("If you have Figma Desktop installed and want to try the selection-based workflow:")),

      heading2("6.1 Enable Dev Mode"),
      para(bodyText("In Figma Desktop, press "), boldText("Shift+D"), bodyText(" to enter Dev Mode.")),

      heading2("6.2 Check for Claude Code Integration"),
      para(bodyText("Look in the Inspect panel (right sidebar) for Claude Code integration. If available, the Desktop MCP server runs at "), codeInline("http://127.0.0.1:3845/mcp"), bodyText(".")),

      heading2("6.3 Try Selection-Based Generation"),
      para(bodyText("Select a frame or component in Figma, then ask Claude in your terminal:")),
      ...codeBlock(["Generate a React component from the currently selected frame in Figma Desktop."]),

      noteBlock("Desktop MCP requires Figma Desktop running and may need additional setup. If it doesn\u2019t work, stick with Remote MCP \u2014 both produce the same quality output."),

      separator(),

      // ══════════════════════════════════════════════════
      // SELF-ASSESSMENT
      // ══════════════════════════════════════════════════
      new Paragraph({ children: [new PageBreak()] }),

      heading1("Self-Assessment"),

      heading2("Understanding"),

      para(boldText("1. "), bodyText("What does Figma MCP give Claude access to that it doesn\u2019t have without it?")),
      answerLine(),

      para(boldText("2. "), bodyText("Why is it important to specify your tech stack when generating components from Figma?")),
      answerLine(),

      para(boldText("3. "), bodyText("What are design tokens, and why do they matter for AI-generated components?")),
      answerLine(),

      para(boldText("4. "), bodyText("What\u2019s the difference between Remote MCP and Desktop MCP for Figma?")),
      answerLine(),

      para(boldText("5. "), bodyText("Why should you create a "), codeInline("frontend-patterns.md"), bodyText(" rules file instead of specifying your tech stack in every prompt?")),
      answerLine(),

      heading2("Experience"),

      para(boldText("6. "), bodyText("What tokens were extracted from your Figma file? Were they useful?")),
      answerLine(),

      para(boldText("7. "), bodyText("What issues did you find during the component review step? How did you fix them?")),
      answerLine(),

      para(boldText("8. "), bodyText("Did the rules file improve the second component generation (if you tried the stretch goal)?")),
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
            "Installing and configuring Figma MCP",
            "Extracting design tokens from a Figma file",
            "Generating a React component from a Figma frame",
            "Reviewing and refining generated component code",
            "Creating a frontend rules file for your project",
            "Knowing when to use Remote vs Desktop MCP",
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
      heading1("What to Bring to Session 4"),

      bulletItemWithCode("Your updated ", ".claude/", " directory (with frontend-patterns.md and any token files)"),
      bulletItem("Notes on what Claude got right and wrong when generating your component"),
      bulletItem("The generated component(s) from today\u2019s lab"),
      bulletItem("Ideas for design system rules you\u2019d want Claude to enforce automatically"),
      bulletItem("One pattern or convention that Claude keeps getting wrong \u2014 we\u2019ll fix it with Skills"),

      separator(),

      // ══════════════════════════════════════════════════
      // QUICK REFERENCE
      // ══════════════════════════════════════════════════
      heading1("Quick Reference"),

      new Table({
        width: { size: 8640, type: WidthType.DXA },
        columnWidths: [3240, 5400],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              makeTableHeaderCell("Action", 3240),
              makeTableHeaderCell("How", 5400),
            ],
          }),
          ...([
            ["Install Figma MCP (Remote)", "claude mcp add --transport http figma https://mcp.figma.com/mcp"],
            ["Check MCP servers", "/mcp in session or claude mcp list in terminal"],
            ["Authenticate Figma", "/mcp \u2192 figma \u2192 Authenticate"],
            ["Extract design tokens", "Share Figma URL + ask Claude to use get_variable_defs (selection-scoped)"],
            ["Generate component", "Share frame URL + specify tech stack"],
            ["Create rules file", "Add .md file to .claude/rules/"],
            ["Reference existing component", "\"Follow the patterns in path/to/Component.jsx\""],
            ["Verify rules loaded", "Ask Claude \"What conventions should I follow?\""],
            ["Remove MCP server", "claude mcp remove figma"],
          ].map(([action, how], i) =>
            new TableRow({
              children: [
                makeTableCell(action, 3240, i % 2 === 1),
                makeTableCell(how, 5400, i % 2 === 1, true),
              ],
            })
          )),
        ],
      }),
    ],
  }],
});

// ── Generate ──
const OUTPUT = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_3/06_Student_Worksheet.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Generated: ${OUTPUT} (${(buffer.length / 1024).toFixed(1)} KB)`);
}).catch((err) => {
  console.error("Error generating document:", err);
  process.exit(1);
});
