# Lab Guide: Instructor-Led Demo — Bidirectional Figma Workflows on energycorp

**Duration:** 25-30 minutes (instructor-led portion)
**Repo:** energycorp
**Goal:** Demonstrate three workflows from the lecture that go beyond basic Figma-to-code: auto-generating design system rules from codebase analysis, creating a FigJam architecture diagram for planning, and sending a code-generated UI back to Figma as editable frames — showing the full bidirectional pipeline in action.

---

## Prerequisites

Before starting, verify:
- [ ] Figma MCP installed and authenticated (completed during the demo in Block 3)
- [ ] energycorp repo with any files generated during the demo (design-tokens.css, generated component)
- [ ] Claude Code CLI running and connected (`/mcp` shows figma as active)
- [ ] `.claude/` directory exists with `commands/`, `skills/`, `rules/` from Session 2
- [ ] Internet access for Figma MCP

If Figma MCP wasn't installed during the demo:
```bash
cd /path/to/energycorp
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

---

## Step 1: Verify MCP Connection (2 min)

### Quick Check

> **Instructor says:** "Before we try the new workflows, let's make sure Figma MCP is still connected after the lecture."

Launch Claude Code and verify:

```
/mcp
```

Confirm `figma` is listed and connected. If it shows as disconnected, restart Claude Code.

> **Instructor says:** "If you see figma listed with a green status, you're good. If it dropped during the break, just restart Claude Code — it reconnects automatically."

---

## Step 2: Auto-Generate Design System Rules (7-8 min)

### The Concept

> **Instructor says:** "In the lecture, we talked about six integration layers between Figma and Claude. One of them is Design System Rules — a tool that analyzes your codebase and generates a rules file automatically. In Session 2, we wrote rules files by hand. Now let's have Claude do it by examining our actual code."

### What Is `create_design_system_rules`?

This MCP tool prompts Claude to analyze your codebase and document the design patterns it finds. The output is a Markdown rules file that captures:
- Color tokens and their semantic meanings
- Typography conventions
- Spacing patterns
- Component naming and structure conventions
- Framework-specific guidance (e.g., "Use Reactstrap Card, not raw divs")

> **Instructor says:** "The key distinction from the demo: in the demo, we wrote `frontend-patterns.md` by hand. Now we're asking Claude to discover our patterns from the code itself. Think of it as an automated audit of your frontend conventions."

### Run the Tool

Ask Claude:

```
Use the Figma MCP's create_design_system_rules tool to generate a design system
rules file for this project.

Analyze the existing codebase — especially the Frontend/src/ directory — and
document the patterns you find: component structure, styling approach, UI library
usage, state management, and any design tokens or CSS variables.
```

> **Instructor says:** "Watch what happens. Claude uses the MCP tool to get a template, then it analyzes our codebase — reading existing components, SCSS files, package.json — and generates a rules file based on what it actually finds."

### Wait for Generation

This may take 30-60 seconds as Claude reads multiple files across the codebase.

### Review the Output Together

> **Instructor says:** "Let's look at what Claude discovered about our project. Compare this to the `frontend-patterns.md` we wrote by hand during the demo:"

Walk through the comparison:

| Aspect | Hand-Written (Demo) | Auto-Generated (Now) |
|--------|--------------------|--------------------|
| **Source** | Our knowledge of the project | Claude's analysis of actual code |
| **Coverage** | What we remembered to include | What Claude found in the files |
| **Accuracy** | Based on our understanding | Based on what the code actually does |
| **Detail level** | High-level conventions | Specific patterns with file references |

> **Instructor says:** "Notice the differences. The auto-generated version may have caught patterns we forgot to mention, or it may have missed conventions that aren't obvious from the code alone. Neither is perfect on its own — the best approach is to start with the auto-generated version and refine it with your team's knowledge."

### Discuss Where It Goes

> **Instructor says:** "For Claude Code, this file goes in `.claude/rules/` — the same place as our other rules files. Claude loads it automatically at session start."

Save the generated rules file (if Claude didn't already place it):

```
Save the generated design system rules to .claude/rules/figma-design-system.md
```

### Key Teaching Moment

> **Instructor says:** "Here's the important part: the hand-written `frontend-patterns.md` from the demo and the auto-generated `figma-design-system.md` from this step serve complementary roles. The hand-written file captures your team's *intentions* — 'we use class components, not hooks.' The auto-generated file captures the codebase's *reality* — 'here are the actual patterns in your code.' When they disagree, that's a signal worth investigating."

---

## Step 3: FigJam Diagram Generation — Planning Artifacts (5-6 min)

### The Concept

> **Instructor says:** "In the lecture, we covered the planning-to-implementation workflow: a PM or designer creates a diagram, and developers reference it later when building features. Let's create one now using the `generate_diagram` tool."

### Why This Matters

> **Instructor says:** "FigJam diagrams are planning artifacts — architecture diagrams, user flows, data model maps. The important thing is that these diagrams live in Figma alongside your design files. A developer can later access them via the `get_figjam` MCP tool and use them as context when implementing features. Planning and implementation live in the same ecosystem."

### Generate an Architecture Diagram

Ask Claude to create a FigJam diagram from energycorp's data model:

```
Create a FigJam diagram showing energycorp's core data model relationships:

- Substation → has many Transformers → has many Counters → each Counter has History records
- Client (linked to CustomUser) → Contract (links Client to Counter) → Invoice → Payment
- Worker (linked to CustomUser) has user_type (1=Admin, 2=Manager, 3=Operator)

Use a flowchart format that a project manager could use for onboarding new developers.
Include the Django app names (energytransfers, contract, payments, users) as groupings.
```

> **Instructor says:** "Claude is using `generate_diagram` — it converts this description into Mermaid syntax and sends it to FigJam. The output is a native FigJam document, fully editable and shareable."

### Review What Appeared in FigJam

> **Instructor says:** "Let's open the FigJam link Claude provided. This is a real FigJam document — you can move boxes around, add sticky notes, share it with your team. A few things to notice:"

Walk through the output:

| What You Get | What You Can Do With It |
|-------------|------------------------|
| Boxes representing models | Rearrange for clarity |
| Arrows showing relationships | Add labels or annotations |
| Groupings by Django app | Color-code by team or priority |
| A shareable FigJam link | Send to PMs, designers, new hires |

> **Instructor says:** "Later, a developer working on a new feature can ask Claude: 'Read the FigJam diagram for energycorp's data model using `get_figjam`.' Claude reads the diagram and understands the architecture when generating code. The planning artifact directly informs the implementation."

### Privacy Reminder

> **Instructor says:** "One important note from the lecture: FigJam files created via Claude are **public and viewable by anyone with the link** until you log in to Figma and claim the file by adding it to your drafts. Always claim generated FigJam files promptly — especially if they contain proprietary architecture details."

---

## Step 4: Code to Canvas — Send a UI to Figma (7-8 min)

### The Concept

> **Instructor says:** "In the demo, we went from Figma to code — that's the standard pipeline. Now let's go the other direction. Code to Canvas lets you build a UI with Claude Code and send it to Figma as fully editable frames. This is the bidirectional pipeline from the lecture."

### Why This Matters

> **Instructor says:** "Imagine you're prototyping a new feature. You build a quick UI with Claude Code. Instead of describing it to your designer, you send the actual rendered UI to Figma. The designer can then refine the spacing, adjust colors, and improve the layout — all in Figma, without touching code. Then you pull those design changes back via MCP to update your code."

### Build a Simple Dashboard Widget

Ask Claude to create a small, self-contained UI:

```
Build a simple HTML page that shows an energy dashboard summary card with:
- A title "Monthly Energy Usage"
- A large number showing "2,847 kWh"
- A trend indicator showing "+12% from last month" in green
- A small bar chart showing the last 6 months of usage
- Use clean, modern styling with a white card on a light gray background

Save it as a standalone HTML file at Frontend/demo-dashboard.html so I can
preview it in a browser.
```

> **Instructor says:** "I'm asking for a standalone HTML file rather than a full React component. For Code to Canvas, we want something we can preview in a browser quickly. The goal is to show the designer what we're thinking — not to build the final component."

### Preview in the Browser

Open the generated file in a browser (manually open):

```bash
# On WSL/Linux — open in default browser
explorer.exe Frontend/demo-dashboard.html

# Or on macOS
open Frontend/demo-dashboard.html
```

> **Instructor says:** "Take a look. Claude built a dashboard card based on our description. It's not pixel-perfect, it's not connected to real data — it's a visual prototype. Now let's send it to our designer."

### Send to Figma

Ask Claude:

```
Send the dashboard widget I just built to Figma using the generate_figma_design tool.
Capture the current UI and convert it into editable Figma frames.
```

> **Instructor says:** "Claude is using `generate_figma_design` — the Code to Canvas tool we covered in the lecture. It captures the rendered UI and converts it into structured Figma layers."

### Review What Arrived in Figma

> **Instructor says:** "Let's look at what appeared in Figma. These are not screenshots — they're fully editable frames with real layers:"

Walk through what's preserved and what's lost:

| Preserved in Figma | Lost (inherent to static frames) |
|--------------------|------|
| Layout and positioning | Event handlers |
| Colors and typography | JavaScript logic |
| Text content (editable) | API calls and data fetching |
| Border radius, shadows | Animation and transitions |
| Component structure (as groups) | State management |

> **Instructor says:** "A designer can now take this frame and refine it — adjust the spacing, change the color palette, improve the typography. Then we pull those refinements back via `get_design_context` and update our code. That's the full round-trip."

### Discuss the Workflow

> **Instructor says:** "This completes the bidirectional pipeline from the lecture:

> 1. **Figma → Code** (demo): Designer creates a mockup, developer generates code from it via MCP
> 2. **Code → Figma** (now): Developer prototypes a UI, sends it to Figma for design review
> 3. **Figma → Code again**: Designer refines the prototype, developer pulls updates via MCP
>
> The translation between design and code goes both ways. No manual screenshots, no 'can you make it look like this screenshot I took.'"

### If `generate_figma_design` Isn't Available

> **Instructor note:** This tool requires Remote MCP and may not appear in all tool catalogs. If it fails or isn't available, demonstrate the concept by:
>
> 1. Showing the generated HTML file in the browser
> 2. Explaining that Code to Canvas would convert this into editable Figma frames
> 3. Showing a pre-captured screenshot of what the Figma output looks like
>
> Then move on to Step 5. The FigJam diagram from Step 3 already demonstrated Claude writing back to Figma, so students have still seen the bidirectional flow.

---

## Step 5: Review the Updated Ecosystem (2-3 min)

### Show the Final `.claude/` Directory

```
.claude/
  commands/
    deploy-check.md            ← /deploy-check (from Session 2)
    explain-app.md             ← /explain-app <app> (from Session 2)
  skills/
    django-check/
      SKILL.md                 ← Auto-validates Django changes (Session 2)
  rules/
    testing.md                 ← Testing conventions (Session 2)
    api-conventions.md         ← API patterns (Session 2)
    frontend-patterns.md       ← Frontend conventions — hand-written (Session 3 Demo)
    figma-design-system.md     ← Design system rules — auto-generated (Session 3 Lab) ★
  agents/
    reviewer.md                ← Code review agent (Session 2)
  settings.json                ← Permissions + hooks
  settings.local.json          ← Personal overrides (gitignored)
.mcp.json                      ← GitHub MCP + Figma MCP (updated)
CLAUDE.md                      ← Project instructions
Frontend/
  src/
    assets/
      css/
        design-tokens.css      ← Token mapping from Figma (Session 3 Demo)
  demo-dashboard.html          ← Code to Canvas prototype (Session 3 Lab) ★

Figma (external):
  FigJam diagram               ← Architecture diagram via generate_diagram (Session 3 Lab) ★
  Code to Canvas frames         ← Dashboard prototype via generate_figma_design (Session 3 Lab) ★
```

> **Instructor says:** "Look at what we've built across three sessions. Session 1 gave us CLAUDE.md and the fundamentals. Session 2 added commands, hooks, rules files, and sub-agents. Session 3 connected us to Figma and added three new layers:
>
> 1. **A hand-written rules file** from the demo — capturing our team's intentions
> 2. **An auto-generated rules file** from the lab — capturing what the code actually does
> 3. **A FigJam architecture diagram** — a planning artifact that developers can reference via MCP
> 4. **A code prototype sent to Figma** — editable frames for designer review
> 5. **Design tokens** extracted from Figma
>
> The pipeline is now bidirectional. Designs flow to code via MCP. Code flows to Figma via Code to Canvas. Planning artifacts flow from FigJam to implementation. And rules files — both manual and auto-generated — keep everything consistent."

### Connect Back to the Lecture

> **Instructor says:** "In the lecture, we covered six integration layers. Today you've now touched five of them hands-on:
>
> | Layer | Where You Used It |
> |-------|------------------|
> | Figma MCP (Remote) | Demo — token extraction, component generation |
> | Design System Rules | Lab — auto-generated `figma-design-system.md` |
> | FigJam diagrams | Lab — architecture diagram via `generate_diagram` |
> | Code to Canvas | Lab — sent a prototype to Figma |
> | Design token extraction | Demo — `design-tokens.css` |
>
> The remaining one — Code Connect (component-to-code mapping) — requires a Figma Organization or Enterprise plan. Check with your team lead about access."

---

## Recap

| Step | What We Built | Why It Matters |
|------|--------------|----------------|
| Design system rules generation | `figma-design-system.md` via `create_design_system_rules` | Claude discovers your conventions automatically — no manual documentation needed |
| FigJam diagram generation | Architecture diagram via `generate_diagram` | Planning artifacts live alongside designs — developers can reference them via MCP when implementing features |
| Code to Canvas | Dashboard prototype sent to Figma as editable frames | Designers can refine code prototypes visually — the pipeline goes both ways |
| Ecosystem review | Updated `.claude/` structure + Figma artifacts | Hand-written rules capture intentions; auto-generated rules capture reality; FigJam bridges planning and implementation |

> **Instructor says:** "Now open the student worksheet. You're going to apply these workflows to BulkSource — generate design system rules from your own codebase, create a planning diagram for your architecture, and if time permits, try the full bidirectional Code to Canvas pipeline."

---

## Troubleshooting Common Issues

| Issue | Fix |
|-------|-----|
| `create_design_system_rules` produces generic output | Make sure Claude is analyzing the `Frontend/src/` directory specifically; add "focus on the React components in Frontend/src/views/" to your prompt |
| `create_design_system_rules` takes too long | The tool triggers extensive codebase reading — this is normal; allow 60-90 seconds |
| Auto-generated rules conflict with hand-written rules | This is expected and useful — it highlights where your documented conventions differ from actual code. Reconcile by updating whichever is wrong |
| `generate_diagram` produces wrong structure | Refine with "adjust the diagram to show X relationship as Y" — Claude can iterate on Mermaid syntax |
| FigJam diagram link is public | This is expected — files created via Claude are public until you claim them in Figma. Log in to Figma and add the file to your drafts immediately |
| `generate_diagram` output is too simple | Add more detail to your description — specify cardinality, include field names, or ask for a specific diagram type (sequence, state, entity-relationship) |
| `generate_figma_design` not found | This tool is Remote MCP only and may not appear in all tool catalogs; restart Claude Code and try again |
| `generate_figma_design` fails to capture | Ensure the HTML file is accessible and renders in a browser; try simplifying the UI |
| Code to Canvas frames are flat (no layer structure) | This happens with complex UIs; simpler HTML produces cleaner Figma layers |
| Generated design system rules file is placed in wrong location | Move it to `.claude/rules/` manually, or ask Claude to save it there |
| MCP connection dropped | Restart Claude Code; run `/mcp` to verify figma is reconnected |
