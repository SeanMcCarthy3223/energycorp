const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "EnergyCorp Training";
pres.title = "Hallucinations & Safe Usage Patterns - Session 1";

// ─── Same color palette & fonts as presentation 02 ───
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
  codeBg:    "1E293B",
  codeText:  "E2E8F0",
};

const FONT_H = "Trebuchet MS";
const FONT_B = "Calibri";
const FONT_CODE = "Consolas";

const cardShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 });

// Helper: standard header bar
function addHeader(slide, title) {
  slide.background = { color: C.contentBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.darkBg } });
  slide.addText(title, {
    x: 0.8, y: 0.1, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });
}

// ═══════════════════════════════════════════
// SLIDE 1: Title
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.danger } });

  slide.addText("Hallucinations &", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });
  slide.addText("Safe Usage Patterns", {
    x: 0.8, y: 2.1, w: 8.4, h: 0.8,
    fontSize: 44, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.2, w: 2.5, h: 0.04, fill: { color: C.danger } });

  slide.addText("Session 1 \u2014 Understanding, Detecting, and Preventing AI Mistakes", {
    x: 0.8, y: 3.5, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: FONT_B, color: C.mutedText, margin: 0,
  });

  slide.addText("Duration: 15 minutes", {
    x: 0.8, y: 4.2, w: 8.4, h: 0.35,
    fontSize: 13, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });
}

// ═══════════════════════════════════════════
// SLIDE 2: What Are Hallucinations?
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "What Are Hallucinations?");

  // Definition callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 9.0, h: 0.85,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.15, w: 0.07, h: 0.85, fill: { color: C.danger } });
  slide.addText([
    { text: "A hallucination is when Claude generates output that is ", options: { fontSize: 14, fontFace: FONT_B, color: C.darkText } },
    { text: "plausible-looking but factually incorrect", options: { fontSize: 14, fontFace: FONT_B, color: C.danger, bold: true } },
    { text: ". It's not a bug \u2014 it's a fundamental property of how language models work.", options: { fontSize: 14, fontFace: FONT_B, color: C.darkText } },
  ], { x: 0.8, y: 1.2, w: 8.5, h: 0.75, valign: "middle", margin: 0 });

  // "Why Do They Happen?" header
  slide.addText("Why Do They Happen?", {
    x: 0.8, y: 2.25, w: 8.4, h: 0.4,
    fontSize: 18, fontFace: FONT_H, color: C.darkText, bold: true, margin: 0,
  });

  // Four reason cards in 2x2 grid
  const reasons = [
    { num: "1", title: "Training Data Patterns", desc: "Claude has seen thousands of projects. It may assume yours follows the same patterns \u2014 even when it doesn't.", color: C.accent },
    { num: "2", title: "Ambiguity in Context", desc: "Vague prompts or thin CLAUDE.md files force Claude to fill gaps with its best guess. Sometimes the guess is wrong.", color: C.accent2 },
    { num: "3", title: "Context Window Limits", desc: "As conversations grow long, earlier details get compressed. Claude may \"forget\" constraints from 30 messages ago.", color: C.accent3 },
    { num: "4", title: "Confidence Without Calibration", desc: "Claude doesn't say \"I'm 60% sure.\" It presents everything with the same confidence, whether reading a file or guessing.", color: C.warning },
  ];

  reasons.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 0.5 + col * 4.65;
    const cy = 2.8 + row * 1.35;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 4.35, h: 1.15,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: cx + 0.15, y: cy + 0.15, w: 0.45, h: 0.45,
      fill: { color: r.color },
    });
    slide.addText(r.num, {
      x: cx + 0.15, y: cy + 0.15, w: 0.45, h: 0.45,
      fontSize: 18, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(r.title, {
      x: cx + 0.75, y: cy + 0.12, w: 3.4, h: 0.35,
      fontSize: 14, fontFace: FONT_H, color: r.color, bold: true, margin: 0,
    });
    slide.addText(r.desc, {
      x: cx + 0.75, y: cy + 0.48, w: 3.4, h: 0.6,
      fontSize: 11, fontFace: FONT_B, color: C.mutedText, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════
// SLIDE 3: Example 1 — The Phantom Import
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "Example 1: The Phantom Import (Django)");

  // Code block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 9.0, h: 1.55,
    fill: { color: C.codeBg },
  });
  slide.addText([
    { text: "from ", options: { color: "93C5FD" } },
    { text: "rest_framework.permissions ", options: { color: C.codeText } },
    { text: "import ", options: { color: "93C5FD" } },
    { text: "IsAuthenticatedOrReadOnly, AllowAny", options: { color: C.codeText, breakLine: true } },
    { text: "from ", options: { color: "93C5FD" } },
    { text: "rest_framework.mixins ", options: { color: C.codeText } },
    { text: "import ", options: { color: "93C5FD" } },
    { text: "BulkCreateModelMixin", options: { color: "FCA5A5", breakLine: true } },
    { text: "# ^^^ Does not exist in DRF!", options: { color: "FCA5A5", italic: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "class ", options: { color: "93C5FD" } },
    { text: "BulkCreateView", options: { color: "FDE68A" } },
    { text: "(BulkCreateModelMixin, generics.CreateAPIView):", options: { color: C.codeText } },
  ], { x: 0.8, y: 1.25, w: 8.4, h: 1.35, fontSize: 12, fontFace: FONT_CODE, margin: 0, paraSpaceAfter: 2 });

  // What happened card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.95, w: 4.2, h: 1.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.95, w: 4.2, h: 0.06, fill: { color: C.warning } });
  slide.addText("What happened:", {
    x: 0.7, y: 3.1, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.warning, bold: true, margin: 0,
  });
  slide.addText("Claude saw BulkCreateModelMixin in third-party packages (djangorestframework-bulk) and assumed it's part of core DRF. It isn't. The import fails at runtime.", {
    x: 0.7, y: 3.45, w: 3.8, h: 1.0,
    fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0,
  });

  // How to catch it card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 2.95, w: 4.2, h: 1.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 2.95, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("How to catch it:", {
    x: 5.5, y: 3.1, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Run the code \u2014 the ImportError is immediate", options: { bullet: true, breakLine: true } },
    { text: "Better: have a test that imports the module", options: { bullet: true } },
  ], { x: 5.5, y: 3.45, w: 3.8, h: 1.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 6 });

  // Lesson callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.8, w: 9.0, h: 0.55,
    fill: { color: "FEF2F2" },
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.8, w: 0.07, h: 0.55, fill: { color: C.danger } });
  slide.addText([
    { text: "Lesson: ", options: { bold: true, color: C.danger } },
    { text: "Claude conflates its broad training knowledge with your specific installed packages.", options: { color: C.darkText } },
  ], { x: 0.8, y: 4.8, w: 8.5, h: 0.55, fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0 });
}

// ═══════════════════════════════════════════
// SLIDE 4: Example 2 — The Wrong React Hook
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "Example 2: The Wrong React Hook Pattern");

  // Code block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 9.0, h: 1.35,
    fill: { color: C.codeBg },
  });
  slide.addText([
    { text: "import ", options: { color: "93C5FD" } },
    { text: "{ useActionState } ", options: { color: C.codeText } },
    { text: "from ", options: { color: "93C5FD" } },
    { text: "'react'", options: { color: "86EFAC", breakLine: true } },
    { text: "// ^^^ React 19+ only \u2014 this project uses React 16!", options: { color: "FCA5A5", italic: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "function ", options: { color: "93C5FD" } },
    { text: "PaymentForm", options: { color: "FDE68A" } },
    { text: "() { ... }", options: { color: C.codeText } },
  ], { x: 0.8, y: 1.25, w: 8.4, h: 1.15, fontSize: 12, fontFace: FONT_CODE, margin: 0, paraSpaceAfter: 2 });

  // What happened
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.75, w: 4.2, h: 1.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.75, w: 4.2, h: 0.06, fill: { color: C.warning } });
  slide.addText("What happened:", {
    x: 0.7, y: 2.9, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.warning, bold: true, margin: 0,
  });
  slide.addText("Your project uses React 16. Claude generated React 19 APIs because they're the most recent patterns in its training data. The hook doesn't exist in your version.", {
    x: 0.7, y: 3.25, w: 3.8, h: 1.0,
    fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0,
  });

  // How to catch
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 2.75, w: 4.2, h: 1.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 2.75, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("How to catch it:", {
    x: 5.5, y: 2.9, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "The build will fail", options: { bullet: true, breakLine: true } },
    { text: "Better: your CLAUDE.md should specify React 16 explicitly", options: { bullet: true } },
  ], { x: 5.5, y: 3.25, w: 3.8, h: 1.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 6 });

  // Lesson callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.6, w: 9.0, h: 0.55,
    fill: { color: "FEF2F2" },
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.6, w: 0.07, h: 0.55, fill: { color: C.danger } });
  slide.addText([
    { text: "Lesson: ", options: { bold: true, color: C.danger } },
    { text: "Always specify exact framework versions in CLAUDE.md. Claude defaults to the newest APIs it knows.", options: { color: C.darkText } },
  ], { x: 0.8, y: 4.6, w: 8.5, h: 0.55, fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0 });
}

// ═══════════════════════════════════════════
// SLIDE 5: Example 3 — The Invented API Endpoint
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "Example 3: The Invented API Endpoint");

  // Code block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 9.0, h: 1.1,
    fill: { color: C.codeBg },
  });
  slide.addText([
    { text: "const ", options: { color: "93C5FD" } },
    { text: "response = ", options: { color: C.codeText } },
    { text: "await ", options: { color: "93C5FD" } },
    { text: "axios.get(", options: { color: C.codeText } },
    { text: "'/api/user/permissions/'", options: { color: "FCA5A5", breakLine: true } },
    { text: "// ^^^ This endpoint does not exist!", options: { color: "FCA5A5", italic: true } },
  ], { x: 0.8, y: 1.25, w: 8.4, h: 0.9, fontSize: 12, fontFace: FONT_CODE, margin: 0, paraSpaceAfter: 2 });

  // What happened
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.5, w: 4.2, h: 1.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.5, w: 4.2, h: 0.06, fill: { color: C.warning } });
  slide.addText("What happened:", {
    x: 0.7, y: 2.65, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.warning, bold: true, margin: 0,
  });
  slide.addText("Claude inferred the endpoint from the project's URL patterns (/api/user/, /api/user/login/) and invented a plausible-looking endpoint. The request will 404.", {
    x: 0.7, y: 3.0, w: 3.8, h: 1.0,
    fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0,
  });

  // How to catch
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 2.5, w: 4.2, h: 1.6,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 2.5, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("How to catch it:", {
    x: 5.5, y: 2.65, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Check Backend/src/users/urls.py", options: { bullet: true, breakLine: true } },
    { text: "Better: have Claude verify the endpoint exists before generating code that calls it", options: { bullet: true } },
  ], { x: 5.5, y: 3.0, w: 3.8, h: 1.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 6 });

  // Lesson callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.35, w: 9.0, h: 0.55,
    fill: { color: "FEF2F2" },
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.35, w: 0.07, h: 0.55, fill: { color: C.danger } });
  slide.addText([
    { text: "Lesson: ", options: { bold: true, color: C.danger } },
    { text: "Claude invents plausible URLs from patterns. Always verify endpoints against actual urls.py files.", options: { color: C.darkText } },
  ], { x: 0.8, y: 4.35, w: 8.5, h: 0.55, fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0 });
}

// ═══════════════════════════════════════════
// SLIDE 6: The Correction Spiral Anti-Pattern
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "The Correction Spiral Anti-Pattern");

  slide.addText("The most important anti-pattern for new Claude Code users.", {
    x: 0.8, y: 1.05, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: FONT_B, color: C.mutedText, italic: true, margin: 0,
  });

  // Left: How it happens (stepped list)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 5.0, h: 3.8,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.55, w: 5.0, h: 0.06, fill: { color: C.danger } });
  slide.addText("How it happens:", {
    x: 0.7, y: 1.7, w: 4.6, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });

  const spiralSteps = [
    { text: "You ask Claude to implement a feature", color: C.darkText },
    { text: "Output has a bug. You say: \"Fix the import\"", color: C.darkText },
    { text: "Claude fixes it but introduces a new issue", color: C.warning },
    { text: "You correct that. Claude changes something else", color: C.warning },
    { text: "After 3-4 rounds, context is polluted", color: C.danger },
    { text: "Response quality degrades rapidly", color: C.danger },
    { text: "You spend more time correcting than coding", color: C.danger },
  ];

  spiralSteps.forEach((step, i) => {
    slide.addText((i + 1) + ".", {
      x: 0.7, y: 2.12 + i * 0.42, w: 0.3, h: 0.35,
      fontSize: 12, fontFace: FONT_H, color: step.color, bold: true, margin: 0,
    });
    slide.addText(step.text, {
      x: 1.05, y: 2.12 + i * 0.42, w: 4.25, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: step.color, margin: 0,
    });
  });

  // Right: The Fix
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 1.55, w: 3.7, h: 2.2,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.8, y: 1.55, w: 3.7, h: 0.06, fill: { color: C.success } });
  slide.addText("The Fix:", {
    x: 6.0, y: 1.7, w: 3.3, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText("If you've corrected Claude more than twice on the same issue, stop.", {
    x: 6.0, y: 2.1, w: 3.3, h: 0.7,
    fontSize: 13, fontFace: FONT_B, color: C.darkText, bold: true, margin: 0,
  });
  slide.addText("Run /clear and start fresh with a better prompt. A clean session almost always outperforms accumulated corrections.", {
    x: 6.0, y: 2.8, w: 3.3, h: 0.8,
    fontSize: 12, fontFace: FONT_B, color: C.mutedText, margin: 0,
  });

  // Why callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 3.95, w: 3.7, h: 1.4,
    fill: { color: "EFF6FF" }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.8, y: 3.95, w: 0.07, h: 1.4, fill: { color: C.accent } });
  slide.addText("Why this happens:", {
    x: 6.05, y: 4.05, w: 3.3, h: 0.3,
    fontSize: 13, fontFace: FONT_H, color: C.accent, bold: true, margin: 0,
  });
  slide.addText("Each correction adds context. Claude tries to satisfy all context \u2014 even when corrections are subtly contradictory. The model gets pulled in multiple directions.", {
    x: 6.05, y: 4.35, w: 3.3, h: 0.9,
    fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0,
  });
}

// ═══════════════════════════════════════════
// SLIDE 7: Context Degradation in Long Sessions
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "Context Degradation in Long Sessions");

  // Context level table
  const headerOpts = { fill: { color: C.darkBg }, color: C.lightText, bold: true, fontFace: FONT_H, fontSize: 12, align: "center", valign: "middle" };
  const cellBase = { fill: { color: C.cardBg }, fontFace: FONT_B, fontSize: 11, valign: "middle" };

  const tableRows = [
    [
      { text: "Context Level", options: headerOpts },
      { text: "Behavior", options: headerOpts },
    ],
    [
      { text: "Fresh (0-30%)", options: { ...cellBase, color: C.success, bold: true, align: "center" } },
      { text: "Best performance \u2014 Claude has full attention on your task", options: { ...cellBase, color: C.darkText, align: "left" } },
    ],
    [
      { text: "Moderate (30-60%)", options: { ...cellBase, color: C.accent, bold: true, align: "center" } },
      { text: "Still good, but may miss nuances from early conversation", options: { ...cellBase, color: C.darkText, align: "left" } },
    ],
    [
      { text: "Heavy (60-80%)", options: { ...cellBase, color: C.warning, bold: true, align: "center" } },
      { text: "Auto-compaction kicks in \u2014 older messages get summarized", options: { ...cellBase, color: C.darkText, align: "left" } },
    ],
    [
      { text: "Full (80%+)", options: { ...cellBase, color: C.danger, bold: true, align: "center" } },
      { text: "Earlier details significantly compressed; quality degrades noticeably", options: { ...cellBase, color: C.darkText, align: "left" } },
    ],
  ];

  slide.addTable(tableRows, {
    x: 0.5, y: 1.15, w: 9.0,
    colW: [2.0, 7.0],
    border: { pt: 0.5, color: C.border },
    rowH: [0.45, 0.45, 0.45, 0.45, 0.45],
  });

  // Bottom: Signs + What to do
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 4.2, h: 1.85,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.55, w: 4.2, h: 0.06, fill: { color: C.warning } });
  slide.addText("Signs of degradation:", {
    x: 0.7, y: 3.7, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.warning, bold: true, margin: 0,
  });
  slide.addText([
    { text: "\"Forgets\" constraints you specified earlier", options: { bullet: true, breakLine: true } },
    { text: "Re-suggests rejected approaches", options: { bullet: true, breakLine: true } },
    { text: "Code quality drops \u2014 more boilerplate", options: { bullet: true, breakLine: true } },
    { text: "Asks questions you already answered", options: { bullet: true } },
  ], { x: 0.7, y: 4.05, w: 3.8, h: 1.2, fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 4 });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 3.55, w: 4.2, h: 1.85,
    fill: { color: C.cardBg }, shadow: cardShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 3.55, w: 4.2, h: 0.06, fill: { color: C.success } });
  slide.addText("What to do:", {
    x: 5.5, y: 3.7, w: 3.8, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
  });
  slide.addText([
    { text: "/compact \u2014 compress context with optional focus topic", options: { bullet: true, breakLine: true } },
    { text: "/clear \u2014 full reset, start fresh", options: { bullet: true, breakLine: true } },
    { text: "Plan sessions \u2014 don't do everything in one conversation", options: { bullet: true, breakLine: true } },
    { text: "Use sub-agents \u2014 keep main context clean", options: { bullet: true } },
  ], { x: 5.5, y: 4.05, w: 3.8, h: 1.2, fontSize: 11, fontFace: FONT_B, color: C.darkText, margin: 0, paraSpaceAfter: 4 });
}

// ═══════════════════════════════════════════
// SLIDE 8: Prevention — CLAUDE.md, Plan Mode, TDD
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "Preventing Hallucinations (1 of 2)");

  const strategies = [
    {
      num: "1", title: "Write a Good CLAUDE.md", color: C.accent,
      bullets: [
        "Exact framework versions (Django 3.0.3, React 16.13)",
        "Your actual project structure",
        "Available endpoints (or how to find them)",
        "Known constraints and gotchas",
      ],
    },
    {
      num: "2", title: "Use Plan Mode First", color: C.accent2,
      bullets: [
        "Start in Plan Mode (Shift+Tab twice)",
        "Ask Claude to plan the change",
        "Review: does it reference real files? Real APIs?",
        "Only then switch to Normal Mode",
      ],
    },
    {
      num: "3", title: "Test-Driven Development", color: C.accent3,
      bullets: [
        "Write (or have Claude write) the test first",
        "Run it \u2014 it should fail (feature doesn't exist yet)",
        "Have Claude implement the feature",
        "Run test again \u2014 it should pass",
      ],
    },
  ];

  strategies.forEach((s, i) => {
    const cx = 0.5 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.15, w: 2.85, h: 4.1,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    slide.addShape(pres.shapes.OVAL, {
      x: cx + 0.15, y: 1.35, w: 0.5, h: 0.5,
      fill: { color: s.color },
    });
    slide.addText(s.num, {
      x: cx + 0.15, y: 1.35, w: 0.5, h: 0.5,
      fontSize: 20, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.title, {
      x: cx + 0.8, y: 1.38, w: 1.85, h: 0.45,
      fontSize: 14, fontFace: FONT_H, color: s.color, bold: true, margin: 0, valign: "middle",
    });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx + 0.15, y: 2.0, w: 2.55, h: 0.02, fill: { color: C.border } });

    const bulletItems = s.bullets.map((b, bi) => ({
      text: b,
      options: { bullet: true, fontSize: 11, fontFace: FONT_B, color: C.darkText, breakLine: bi < s.bullets.length - 1 },
    }));
    slide.addText(bulletItems, {
      x: cx + 0.15, y: 2.15, w: 2.55, h: 2.9, margin: 0, paraSpaceAfter: 8,
    });
  });
}

// ═══════════════════════════════════════════
// SLIDE 9: Prevention — Verify, Prompts, Sessions
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  addHeader(slide, "Preventing Hallucinations (2 of 2)");

  const strategies = [
    {
      num: "4", title: "Verify Against the Source", color: C.accent,
      bullets: [
        "Did Claude read the file, or is it guessing?",
        "Does the import exist in your installed version?",
        "Does the endpoint exist in your urls.py?",
        "A 30-second check saves 30 minutes of debugging",
      ],
    },
    {
      num: "5", title: "Keep Prompts Clear & Scoped", color: C.accent2,
      desc: true,
      bad: "\"Make the payment system better\"",
      good: "\"Add a payment_date field to Payment model in payments/models.py, update the serializer, and write a test\"",
    },
    {
      num: "6", title: "Compact or Restart Long Sessions", color: C.accent3,
      bullets: [
        "Working 30+ min on a complex task?",
        "Run /compact to compress context",
        "Or /clear to start fresh",
        "Don't push through degraded quality",
      ],
    },
  ];

  strategies.forEach((s, i) => {
    const cx = 0.5 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.15, w: 2.85, h: 4.1,
      fill: { color: C.cardBg }, shadow: cardShadow(),
    });
    slide.addShape(pres.shapes.OVAL, {
      x: cx + 0.15, y: 1.35, w: 0.5, h: 0.5,
      fill: { color: s.color },
    });
    slide.addText(s.num, {
      x: cx + 0.15, y: 1.35, w: 0.5, h: 0.5,
      fontSize: 20, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.title, {
      x: cx + 0.8, y: 1.38, w: 1.85, h: 0.45,
      fontSize: 13, fontFace: FONT_H, color: s.color, bold: true, margin: 0, valign: "middle",
    });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx + 0.15, y: 2.0, w: 2.55, h: 0.02, fill: { color: C.border } });

    if (s.desc) {
      // Special layout for the prompt comparison
      slide.addText("Bad:", {
        x: cx + 0.15, y: 2.2, w: 2.55, h: 0.3,
        fontSize: 12, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.15, y: 2.5, w: 2.55, h: 0.6,
        fill: { color: "FEF2F2" },
      });
      slide.addText(s.bad, {
        x: cx + 0.25, y: 2.5, w: 2.35, h: 0.6,
        fontSize: 11, fontFace: FONT_B, color: C.danger, italic: true, valign: "middle", margin: 0,
      });

      slide.addText("Good:", {
        x: cx + 0.15, y: 3.3, w: 2.55, h: 0.3,
        fontSize: 12, fontFace: FONT_H, color: C.success, bold: true, margin: 0,
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.15, y: 3.6, w: 2.55, h: 1.2,
        fill: { color: "F0FDF4" },
      });
      slide.addText(s.good, {
        x: cx + 0.25, y: 3.6, w: 2.35, h: 1.2,
        fontSize: 11, fontFace: FONT_B, color: C.success, valign: "middle", margin: 0,
      });
    } else {
      const bulletItems = s.bullets.map((b, bi) => ({
        text: b,
        options: { bullet: true, fontSize: 11, fontFace: FONT_B, color: C.darkText, breakLine: bi < s.bullets.length - 1 },
      }));
      slide.addText(bulletItems, {
        x: cx + 0.15, y: 2.15, w: 2.55, h: 2.9, margin: 0, paraSpaceAfter: 8,
      });
    }
  });
}

// ═══════════════════════════════════════════
// SLIDE 10: The Safe Usage Workflow
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.success } });

  slide.addText("The Safe Usage Workflow", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 30, fontFace: FONT_H, color: C.lightText, bold: true, margin: 0,
  });

  // 6-step workflow
  const steps = [
    { num: "1", label: "PLAN", desc: "Start in Plan Mode. Let Claude read and propose.", color: C.accent },
    { num: "2", label: "REVIEW", desc: "Check the plan. Does it reference real files and APIs?", color: C.accent2 },
    { num: "3", label: "TEST", desc: "Write the test first (or have Claude write it).", color: C.accent3 },
    { num: "4", label: "BUILD", desc: "Switch to Normal Mode. Let Claude implement.", color: C.success },
    { num: "5", label: "VERIFY", desc: "Run tests. Check diffs. Review imports.", color: C.warning },
    { num: "6", label: "COMMIT", desc: "Only after verification passes.", color: "06B6D4" },
  ];

  steps.forEach((s, i) => {
    const ty = 1.1 + i * 0.56;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.8, y: ty + 0.05, w: 0.42, h: 0.42,
      fill: { color: s.color },
    });
    slide.addText(s.num, {
      x: 0.8, y: ty + 0.05, w: 0.42, h: 0.42,
      fontSize: 16, fontFace: FONT_H, color: C.lightText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.label, {
      x: 1.4, y: ty, w: 1.2, h: 0.5,
      fontSize: 16, fontFace: FONT_H, color: s.color, bold: true, valign: "middle", margin: 0,
    });
    slide.addText(s.desc, {
      x: 2.7, y: ty, w: 6.5, h: 0.5,
      fontSize: 14, fontFace: FONT_B, color: C.codeText, valign: "middle", margin: 0,
    });
  });

  // "When things go wrong" section
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.02, fill: { color: C.mutedText } });

  slide.addText("When things go wrong:", {
    x: 0.8, y: 4.75, w: 8.4, h: 0.3,
    fontSize: 14, fontFace: FONT_H, color: C.danger, bold: true, margin: 0,
  });
  slide.addText([
    { text: "Corrected twice on same issue? \u2192 /clear, better prompt    ", options: { fontSize: 11, color: C.codeText, breakLine: true } },
    { text: "Context feels degraded? \u2192 /compact or /clear    ", options: { fontSize: 11, color: C.codeText, breakLine: true } },
    { text: "Claude invents an API? \u2192 Make it verify by reading the actual file    ", options: { fontSize: 11, color: C.codeText, breakLine: true } },
    { text: "Build fails on import? \u2192 Check installed version, specify in CLAUDE.md", options: { fontSize: 11, color: C.codeText } },
  ], { x: 0.8, y: 5.05, w: 8.4, h: 0.55, fontFace: FONT_B, margin: 0, paraSpaceAfter: 1 });
}

// ─── Write file ───
const outputPath = "/mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Course_Content/Session_1/04_Hallucinations_Safe_Usage.pptx";
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("Presentation saved to: " + outputPath);
}).catch(err => {
  console.error("Error:", err);
});
