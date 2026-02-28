# Session 3 Instructor Guide: Frontend #1 — Figma MCP & Design-to-Code Pipeline

**Duration:** 2 hours
**Audience:** Ukrainian software contractor (~22 employees, frontend + backend split) building "BulkSource" — a construction supply chain web portal (Django + React)
**Demo repo:** energycorp (Django REST API + React SPA — React 16, class components, Reactstrap, SCSS)
**Prerequisites:** Sessions 1-2 completed. Students have Claude Code installed, CLAUDE.md on their BulkSource project, custom commands and hooks configured.

---

## Session Overview

| Block | Topic | Duration | Format |
|-------|-------|----------|--------|
| 1 | Session Opening & Recap | 5-10 min | Discussion |
| 2 | Presentation: Figma MCP Architecture & Design Tokens | 15-20 min | Slides/Lecture |
| 3 | Demo: Figma MCP Setup & Token Extraction | 25 min | Live Demo |
| 4 | Lecture: The Design-to-Code Pipeline | 15 min | Slides/Lecture |
| 5 | Hands-On Lab | 50-60 min | Guided Lab + Independent Work |
| 6 | Q&A & Wrap-Up | 5-10 min | Discussion |

**Total: ~115-135 minutes**

---

## Block 1: Session Opening & Recap (5-10 min)

### Objectives
- Reconnect with the group
- Surface wins and issues from Sessions 1-2
- Transition from general Claude Code skills into the frontend-specific track

### Speaker Notes

**[0:00]** Welcome back.

> "We've spent two sessions covering the fundamentals — what Claude is, how to configure it, how to extend it with commands, hooks, and rules files. Starting today, we split into frontend and backend tracks. This session and the next three are specifically for your frontend developers."

**[0:02]** Guided discussion (3-4 questions):

- "Who has been using the custom commands you built in Session 2? Which ones stuck?"
- "Has the auto-test hook caught anything for you since last session?"
- "What's your current design-to-code workflow? How do you go from a Figma mockup to a React component today?"
- "What's the most painful part of that process?"

> **Instructor note:** The last two questions are critical. Listen for pain points like: manual measurement of spacing/colors, mismatch between design and implementation, back-and-forth with designers, recreating components from scratch. These are exactly what Figma MCP solves — use their answers to frame the session.

**[0:07]** Frame Session 3:

> "Today we're going to fundamentally change how you go from design to code. We'll cover:
> 1. **Figma MCP** — connecting Claude Code directly to your Figma files
> 2. **Design tokens** — extracting colors, spacing, and typography automatically
> 3. **Component generation** — generating production-quality React components from Figma frames
> 4. **The review-refine loop** — making sure generated code matches your project's actual patterns
>
> By the end, you'll have Figma MCP installed, you'll have extracted design tokens from a real file, and you'll have generated a React component that follows your project's conventions."

### Transition
> "Let's start with how Claude Code connects to Figma."

---

## Block 2: Presentation — Figma MCP Architecture & Design Tokens (15-20 min)

### Objectives
- Understand MCP as a protocol connecting Claude to external services
- Know the two Figma MCP server options (Remote vs Desktop)
- Understand what design tokens are and how they're extracted
- See how the Figma-to-React pipeline works end-to-end

### Materials
- `02_Presentation_Figma_MCP_Design_Tokens.md` (slide-by-slide content)
- `02_Figma_MCP_Design_Tokens.pptx` (PowerPoint)

### Speaker Notes

**[0:10]** Start with the architecture. Don't go deep on MCP protocol internals — focus on what it does for them.

> "In Session 2 we installed the GitHub MCP server. Today we're adding Figma. The concept is the same — MCP is the protocol that lets Claude Code talk to external services. With Figma MCP, Claude can read your designs directly. No screenshots, no manual descriptions — it sees the actual design data."

Show the simplified architecture diagram:
```
You → Claude Code → MCP Client → Figma MCP Server → Figma API
                                                       ↓
                                              Frames, tokens, code
```

**[0:13]** Cover the two Figma MCP options. This is a practical decision they need to make:

> "There are two ways to connect:
> 1. **Remote MCP** — uses a URL, works without Figma Desktop, you share Figma links with Claude
> 2. **Desktop MCP** — runs locally, needs Figma Desktop in Dev Mode, you select frames directly in Figma
>
> For today, we'll use the Remote MCP. It's simpler to set up and doesn't require Figma Desktop. Your team can switch to Desktop MCP later for the selection-based workflow."

Draw or show the comparison table:

| Feature | Remote MCP | Desktop MCP |
|---------|-----------|-------------|
| Setup | One CLI command | Figma Desktop + Dev Mode |
| How you reference designs | Share Figma URLs | Select frames in Figma |
| Works without Figma Desktop | Yes | No |
| Richer selection features | No | Yes |
| Best for | Quick prototyping, link-based | Daily workflow, precision |

**[0:17]** Explain design tokens. This may be new for some developers:

> "A design token is a named value from your design system. Instead of hardcoding `#2E5090` in your CSS, you use a token like `color-primary-600`. Instead of `16px`, you use `spacing-4`. Tokens are the bridge between design and code — they ensure consistency."

Show the token hierarchy:
```
Primitives          →  Semantics          →  Components
blue-500: #3B82F6      primary: blue-500      button-bg: primary
gray-100: #F3F4F6      surface: gray-100      card-bg: surface
4px, 8px, 16px         spacing-sm: 4px        card-padding: spacing-md
```

> "When we connect Figma MCP, Claude can extract these tokens automatically using `get_variable_defs`. Then when it generates a component, it uses your tokens instead of raw values."
>
> **Important caveat:** "These tokens only exist if your designer created them as Figma Variables. Variables are not automatic — a designer must manually create them in Figma's Local Variables panel, name them, and apply them to frames. If the Figma file was built without Variables, `get_variable_defs` returns nothing. This is extremely common with smaller teams."

**[0:22]** Show the four key Figma MCP tools:

| Tool | What It Does | When You Use It |
|------|-------------|-----------------|
| `get_design_context` | Returns structured code representation of a Figma selection | Component generation |
| `get_variable_defs` | Extracts variables and styles applied to the current selection | Token mapping |
| `get_code_connect_map` | Maps Figma components to existing code components | Design system alignment |
| `get_screenshot` | Takes a visual screenshot of the selection | Visual reference |

> "A few things to note: `get_variable_defs` is **selection-scoped** — it only returns variables/styles applied to whatever is currently selected, not the entire file's variable library. And `get_design_context` defaults to React + Tailwind output, which we'll need to override with our tech stack."

**[0:25]** Show the end-to-end pipeline:

```
1. Connect Figma MCP
2. Share a Figma frame URL with Claude
3. Claude extracts tokens with get_variable_defs
4. Claude generates a React component with get_design_context
5. You review, refine, and integrate into your project
```

> "This is not 'AI generates code and you ship it.' This is 'AI gives you a solid starting point that uses your actual design data, and you refine it.' The review step is critical — we'll cover that in the lecture."

### Transition
> "Let's see this in action on energycorp."

---

## Block 3: Demo — Figma MCP Setup & Token Extraction (25 min)

### Objectives
- Install Figma MCP live
- Extract design tokens from a Figma file
- Generate a React component from a Figma frame
- Show the token mapping and generated code

### Materials
- `03_Demo_Script.md` (step-by-step demo script)
- energycorp repo with Frontend directory
- A sample Figma file (prepare before session — see Pre-Demo Checklist)

### Pre-Demo Checklist
- [ ] energycorp repo clean and ready
- [ ] Sample Figma file created or accessible (a simple card/dashboard component)
- [ ] Figma MCP remote server pre-tested: `claude mcp add --transport http figma https://mcp.figma.com/mcp`
- [ ] Authentication tested (OAuth flow or token)
- [ ] Terminal font size increased
- [ ] Have a Figma frame URL ready to paste
- [ ] VS Code open as backup for file viewing

### Speaker Notes

**[0:28]** Start by installing the Figma MCP.

> "Let's connect Claude to Figma. One command."

Run the install command live:
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Verify with `/mcp`. Authenticate if prompted.

**[0:32]** Extract design tokens from the sample Figma file.

> "Now I'll give Claude a Figma URL and ask it to extract design tokens."

Paste a Figma frame URL and ask Claude to extract tokens using `get_variable_defs`.

Walk through the output — show how colors, spacing, and typography map to token names.

**[0:38]** Generate a React component from a Figma frame.

> "Now let's generate a component. I'll tell Claude our tech stack so it generates code that matches our project."

Ask Claude to generate a component, specifying the energycorp stack:
```
Generate a React component from this Figma frame: [URL]
Use React class components (we use React 16), Reactstrap for UI components,
and SCSS for styling. Follow the patterns in our CLAUDE.md.
```

Walk through the generated code. Point out where Claude used design tokens vs hardcoded values.

**[0:45]** Show how to refine the generated code.

> "The generated code is a starting point. Let's refine it to match our project's patterns."

Ask Claude to adjust the component — maybe fix the styling approach, add i18n support, or match the existing component structure.

**[0:50]** Show the generated files and discuss integration.

> "We now have a component generated from our actual Figma design, using our project's conventions. No manual pixel-measuring, no copy-pasting colors from Figma."

### Transition
> "Now let's talk about the review and refinement process — because generated code always needs human judgment."

---

## Block 4: Lecture — The Design-to-Code Pipeline (15 min)

### Objectives
- Understand the design token hierarchy and why it matters
- Learn the review-refine workflow for generated components
- Know common pitfalls with generated React code
- Understand when to use Remote vs Desktop Figma MCP

### Materials
- `04_Lecture_Design_Token_Workflow.md` (full lecture content)
- `04_Design_Token_Workflow.pptx` (PowerPoint)

### Speaker Notes

**[0:53]** Start with why review matters:

> "In Session 1, we talked about hallucinations. The same principle applies here. Claude can generate a component that looks right but uses the wrong version of a library, imports a component that doesn't exist in your project, or applies CSS in a way your project doesn't use. The generated code is a strong starting point — not a finished product."

**[0:55]** Walk through the design token hierarchy:

> "Design tokens work in layers. Primitives are raw values — `blue-500`, `8px`. Semantics give those values meaning — `color-primary`, `spacing-sm`. Component tokens are specific — `button-padding`, `card-border-radius`. When Claude extracts tokens from Figma, it gets the primitive and semantic layers. You map those to your project's token system."

**[0:58]** Cover the review-refine workflow:

```
Generate → Review → Refine → Integrate → Test
   ↑                  |
   └──────────────────┘ (iterate if needed)
```

> "After Claude generates a component:
> 1. **Review** — Does it match your project's patterns? Right import style? Right state management?
> 2. **Refine** — Ask Claude to fix specific issues. 'Use Reactstrap Card instead of a div.' 'Add the counterpart translation wrapper.'
> 3. **Integrate** — Place the component in the right directory, add routes, connect to API
> 4. **Test** — Visual review, then functional tests"

**[1:02]** Cover common pitfalls:

| Pitfall | What Happens | How to Prevent |
|---------|-------------|----------------|
| **Version mismatch** | Claude generates React 18 hooks in a React 16 project | Specify version in prompt and CLAUDE.md |
| **Wrong styling approach** | Tailwind classes when your project uses SCSS | Specify styling system in prompt |
| **Missing i18n** | Hardcoded strings instead of translation keys | Add i18n requirement to frontend rules file |
| **Overengineered structure** | TypeScript interfaces, custom hooks when you use class components | Be explicit about patterns |
| **Phantom imports** | Imports from packages not in your package.json | Check imports against `package.json` |

**[1:05]** When to use each Figma MCP option:

> "Use **Remote MCP** when you're prototyping, when you want to share links in prompts, or when team members don't have Figma Desktop. Use **Desktop MCP** for daily production work — it's more precise because you select exact frames, and it sees your current edits even before you publish."

### Transition
> "Let's put all of this into practice. Open your terminals."

---

## Block 5: Hands-On Lab (50-60 min)

### Objectives
- Install and configure Figma MCP
- Extract design tokens from a Figma file
- Generate a React component matching project patterns
- Review and refine generated code
- Apply everything to BulkSource

### Materials
- `05_Lab_Guide_Demo.md` (instructor-led lab guide for energycorp demo)
- `06_Student_Worksheet.md` / `06_Student_Worksheet.docx` (generalized worksheet for BulkSource)

### Structure
1. **Instructor-led (20-25 min):** Everyone follows along on energycorp
2. **Independent work (30-35 min):** Students apply to BulkSource using the worksheet

### Speaker Notes — Phase 1: Instructor-Led

**[1:10]** Install Figma MCP together.

> "Let's all install the Figma MCP. Open your terminal."

Walk through:
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Verify together with `/mcp`. Help anyone with authentication issues.

**[1:15]** Extract tokens together from the sample Figma file.

> "I'm sharing the sample Figma file URL in chat. Let's all ask Claude to extract design tokens."

Walk through the token extraction. Discuss the output.

**[1:20]** Generate a component together.

> "Now let's generate a component. We'll create a status card for the energycorp dashboard."

Walk through generating a component with explicit constraints:
```
Generate a React class component for a status card from this Figma frame: [URL]
Use Reactstrap Card components, SCSS for custom styles, and follow
the patterns in our existing components like GetClients.jsx.
```

Review the output together. Point out what Claude got right and what needs refinement.

**[1:25]** Refine the component together.

> "Let's fix the issues. Ask Claude to adjust the component."

Show 1-2 refinement prompts:
- "Add i18n support using counterpart like our other components"
- "Use class component with `connect()` HOC for Redux language support"

**[1:30]** Create a frontend rules file.

> "Let's add a frontend conventions rules file so Claude knows our patterns for next time."

Create `.claude/rules/frontend-patterns.md` together.

### Speaker Notes — Phase 2: Independent Work

**[1:33]** Hand out the worksheet.

> "Now it's your turn. Switch to your BulkSource project. The worksheet guides you through setting up Figma MCP, extracting tokens from one of your actual design files, and generating a component. You have about 30 minutes."

**[1:33-1:58]** Circulate the room. Common issues to watch for:
- Figma MCP authentication failures — help with OAuth flow
- Students specifying the wrong tech stack — remind them to check their `package.json`
- Generated code using wrong React patterns — guide them to add constraints to their prompt
- Token extraction returning empty — **this is the most common issue**. Figma Variables must be manually created by the designer. If the Figma file uses raw hex colors and pixel values (no named Variables), `get_variable_defs` returns nothing. Students can still use `get_design_context` to generate components — it extracts visual properties directly from the frame
- Students trying to generate entire pages — remind them to start with individual components

**[1:58]** Five-minute warning.

> "Five minutes. Make sure your Figma MCP is working, you've extracted at least some tokens, and you've generated at least one component. If the component isn't perfect, that's expected — we'll work more on refinement in Session 4."

### Transition
> "Let's wrap up. Questions?"

---

## Block 6: Q&A & Wrap-Up (5-10 min)

### Objectives
- Answer questions
- Reinforce key takeaways
- Preview Session 4

### Speaker Notes

**[2:00]** Open the floor.

**[2:05]** Reinforce three takeaways:

> "Three things from today:
> 1. **Figma MCP connects Claude directly to your designs.** No screenshots, no manual descriptions — Claude reads the actual design data. One command to install, one URL to reference a frame.
> 2. **Design tokens bridge the gap.** Instead of hardcoding colors and spacing, extract them as tokens. This keeps your code consistent with your design system.
> 3. **Generated code is a starting point, not a finished product.** Always review. Always specify your tech stack. Always check imports against your actual dependencies. The review-refine loop is what makes the output production-ready."

**[2:08]** Preview Session 4.

> "Next session, we'll go deeper on design system enforcement. You'll build a Skill that automatically validates Claude's React output against your design tokens. You'll create a design-check sub-agent. And we'll cover the full Figma → component → PR pipeline with automated validation. Between now and then, try generating 2-3 more components from your Figma files. Notice where Claude gets your patterns right and where it doesn't — that's what we'll fix with Skills and rules."

**[2:10]** Close.

> "Great work. You've connected Claude Code to your design tool and started building a design-to-code pipeline. See you next session."

---

## Instructor Preparation Checklist

### Before the Session
- [ ] Verify energycorp repo is clean (revert Session 2 demo changes)
- [ ] **Create or access a sample Figma file** for the demo (a simple dashboard card or data table)
- [ ] Test Figma MCP installation: `claude mcp add --transport http figma https://mcp.figma.com/mcp`
- [ ] Complete the Figma authentication flow and verify it works
- [ ] Test `get_variable_defs` with the sample Figma file (note: selection-scoped — you must have frames selected)
- [ ] Test `get_design_context` with a frame from the sample file
- [ ] **Ensure the sample Figma file uses Figma Variables** (not just raw hex colors) — `get_variable_defs` only returns tokens that were explicitly created as Variables by the designer
- [ ] Pre-generate a component to have a backup if live generation has issues
- [ ] Prepare the sample Figma file URL to share with students
- [ ] Ensure students have Figma access (viewer at minimum for Remote MCP)
- [ ] Review Session 2 student worksheets for common issues
- [ ] Have `06_Student_Worksheet.docx` ready to distribute
- [ ] Prepare screen sharing with increased font size

### Sample Figma File Suggestions
If you need to create a sample file for the demo:
- A simple **status card** component (icon, title, value, trend indicator)
- Use defined color variables and text styles in Figma
- Keep it to a single frame for the demo, with 2-3 additional frames for the student lab
- Name frames descriptively (e.g., "StatusCard", "DataTable", "NavHeader")

### Technical Requirements
- Everything from Sessions 1-2, plus:
- Figma account (free plan works for viewing)
- Internet access for Figma MCP (it connects to Figma's API)
- Students need Figma viewer access to the sample file
- Node.js installed (some MCP operations may need it)

### Backup Plans
- If Figma MCP install fails: Show pre-configured MCP and demo with cached responses
- If Figma authentication fails: Use a pre-extracted token file and skip live extraction
- If get_code produces poor output: Have a pre-generated component ready to show and discuss
- If students don't have Figma access: Pair them with someone who does, or use the demo output as a starting point
- If the Figma file has no design tokens: Create a minimal set of **Figma Variables** (not just Styles) before the session. Variables are created via the Local Variables panel in Figma — they must be explicitly set up by a designer. Styles (typography, shadows, gradients) are complementary but separate from Variables.
