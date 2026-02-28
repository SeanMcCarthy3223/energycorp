# Lecture: The Figma-Claude Ecosystem — Designing with AI Inside the Canvas

**Duration:** 15 minutes
**Goal:** Teach students the full scope of Claude's integration inside Figma Desktop, how designers use Claude to create and iterate on components directly in the canvas, and how bidirectional workflows between Figma and Claude Code bridge the designer-developer gap.

---

## Beyond MCP: The Complete Picture

In the presentation and demo, we connected Claude Code *to* Figma using MCP. That's the developer's side of the story — you give Claude a Figma URL, it reads the design data, and it generates code.

But there's a whole other side: **Claude working inside Figma itself.** The Figma-Claude partnership isn't a single feature. We can think of it as three distinct integration layers, each serving a different role:

```
┌───────────────────────────────────────────────────────────────────┐
│                   The Figma + Claude Ecosystem                    │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Figma Connector (Claude side)                                 │
│     Claude reads Figma files → generates FigJam diagrams          │
│     Direction: Claude → Figma                                     │
│                                                                   │
│  2. Figma MCP Server (developer side)                             │
│     Claude Code reads designs → generates production code         │
│     Direction: Figma → Claude Code                                │
│     ✓ We covered this in the presentation and demo                │
│                                                                   │
│  3. Code to Canvas (bidirectional)                                │
│     Claude Code builds UI → captures to editable Figma frames     │
│     Direction: Claude Code → Browser → Figma                      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

> **Speaker note:** "We've been working with layer 2 — the MCP Server. Now let's zoom out. Your designers need to understand layers 1 and 3, because those are the entry points that don't require a terminal."

---

## The Figma Connector: Claude Reads Your Designs

The Figma Connector is available inside Claude itself — the web app at claude.ai, the Claude Desktop app, Claude Code, and the Claude API. It doesn't require a terminal or MCP setup.

> **Note:** The Figma Connector requires a **paid Claude plan** (Pro, Max, Team, or Enterprise) and works with **Claude Opus 4.5+ or Sonnet 4.5+**. The Connector launched on January 26, 2026.

### How It Works

1. Open Claude (web or desktop app)
2. Go to **Settings > Connectors** (or use the "Search and tools" button in a chat)
3. Select the **Figma Connector** and authenticate with your Figma account
4. Start prompting Claude with references to your Figma files

Once connected, Claude can **read** your Figma files — retrieving code resources and variables. For deeper structural reading of components, variables, styles, and layout data, you'll use the **MCP Server** (covered in the next section). The Connector is the lighter-weight entry point.

### What Designers Can Do

**Generate FigJam diagrams from:**
- Text descriptions ("Create a flowchart for our checkout process")
- PDFs (upload a requirements doc, get a system diagram)
- Images and screenshots (upload a whiteboard photo, get a clean FigJam version)
- Existing documentation or uploaded code files

**Supported diagram types:**

| Type | Use Case | Example |
|------|----------|---------|
| Flowcharts | Process documentation | User registration flow |
| Decision trees | Business logic mapping | Invoice approval process |
| Sequence diagrams | API interaction flows | Payment processing sequence |
| State diagrams | Component state mapping | Form validation states |
| Gantt charts | Project planning | Sprint timelines |

After generation, the designer clicks **"Edit in Figma"** to open the diagram in FigJam. From there, it's a native FigJam document — fully editable, shareable, and collaboratable.

> **Privacy note:** Files created from Claude that haven't been claimed are **public and viewable by anyone with the link** until the user logs in and adds the file to their drafts. Make sure to claim your FigJam files promptly.

> **Speaker note:** "This is the entry point for your PMs and designers who don't use the terminal. They can create architecture diagrams, user flows, and process maps directly from conversations with Claude. No CLI required. Just remember to claim the generated FigJam file — until you do, it's publicly accessible via the link."

### Why This Matters for Your Team

Remember in Session 2 when we covered sub-agents and the Explore agent? The Figma Connector is the design equivalent — it gives Claude the ability to explore your design files the same way the Explore agent explores your codebase.

A PM can upload a requirements PDF, Claude generates a system flowchart in FigJam, and your developers can reference that FigJam diagram later via MCP when implementing the feature. **Planning artifacts and implementation artifacts live in the same ecosystem.**

---

## The Desktop MCP Server: The Precision Workflow

In the demo, we used the **Remote MCP** server — you share Figma URLs and Claude reads them over the internet. There's a second option: the **Desktop MCP Server**, which runs locally through Figma Desktop.

### Setup

1. Open **Figma Desktop** (not the browser version)
2. Open a Figma Design file and toggle to **Dev Mode** (Shift+D)
3. In the **inspect panel's MCP server section**, click **"Enable desktop MCP server"**
4. The server starts locally at `http://127.0.0.1:3845/mcp`
5. Add the server to Claude Code. You can either use the CLI command:

```bash
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

Or add it to your MCP configuration JSON:

```json
{
  "mcpServers": {
    "figma-desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

6. Verify with `/mcp` in Claude Code (restart Claude Code if needed)

> **Note:** Earlier documentation referenced an `/sse` endpoint — that has been deprecated. The current transport is **Streamable HTTP** at the `/mcp` path.

### What Changes with Desktop MCP

| Capability | Remote MCP | Desktop MCP |
|------------|-----------|-------------|
| How you reference designs | Share Figma URLs in prompts | Select frames directly in Figma (also supports URL-based access as fallback) |
| Design access | URL/link-based access | Selection-based with live canvas access |
| Selection precision | URL points to a frame | You select exact layers |
| Requires Figma Desktop | No | Yes |
| Plan requirement | All plans (Starter plan limited to **6 tool calls/month**) | Dev or Full seat on paid plans |
| Best for | Quick prototyping, async work | Daily workflow, pixel-precise |

The key advantage: **Desktop MCP provides selection-based access to your live canvas.** Remote MCP accesses designs via shared URLs. In practice, Desktop MCP is more convenient for active development because you can select the exact layers you need without copying URLs.

> **Speaker note:** "For your daily workflow, Desktop MCP is the better choice. But it has a harder requirement — everyone needs Figma Desktop installed and a Dev or Full seat. Remote MCP works on all plans — but if you're on Starter, be aware of the 6-call-per-month limit. That's why we used Remote for the demo."

### The Selection-Based Workflow

With Desktop MCP, the workflow changes from URL-based to selection-based:

```
Developer                           Designer (Figma Desktop)
─────────                           ────────────────────────
                                    1. Selects a frame in Figma
                                           ↓
2. Asks Claude:                     Frame data flows via
   "Implement the selected frame"   local MCP server
           ↓                               ↓
3. Claude reads the selection       ← 127.0.0.1:3845
   via get_design_context
           ↓
4. Claude generates code
   matching your tech stack
```

This means a designer and developer can work side-by-side: the designer selects frames, the developer generates code from those selections in real time. No URL copying, no "which version of the file are you looking at?" conversations.

---

## Code to Canvas: From Production Code to Editable Figma Frames

This is the newest feature in the ecosystem, announced **February 17, 2026** (alongside Anthropic's release of Claude Sonnet 4.6). It inverts the pipeline — instead of Figma → Code, it goes **Code → Figma**.

### How It Works

1. Build a UI with Claude Code (React, HTML/CSS, or any framework)
2. Preview it in your browser
3. In Claude Code, type: **"Send this to Figma"**
4. Claude captures the live browser state
5. The browser UI is converted into **fully editable Figma frames**
6. Each screen becomes a separate frame in your Figma file

```
Claude Code           Browser              Figma
───────────           ───────              ─────
"Build a dashboard    Live preview
 for energy usage"    renders in
        ↓             browser
  React component         ↓
  generated          "Send this
                      to Figma"
                          ↓
                     Browser state    →    Editable frames
                     captured              with real layers,
                                           text, and colors
```

### What You Get in Figma

The captured frames aren't screenshots. They're **structured Figma layers** — text layers you can edit, shapes you can restyle, groups you can rearrange. A designer can take a code-generated UI and refine it without touching code.

> **Important caveat:** While the frames are fully editable shapes, they are **not linked to your Figma design system**. They don't carry token values, component states, or design system constraints. They're standalone layers that need to be manually connected to your design system if desired.

### Multi-Screen Capture

You can capture multiple screens in a single session. Build a login page, a dashboard, and a settings panel with Claude Code, then send all three to Figma. Each becomes a separate frame, preserving the sequence and visual context.

### What Gets Lost

This is important to understand — the conversion captures **visual state**, not logic. Since the output is static Figma frames, anything that requires code execution is inherently lost:

| Preserved | Lost (inherent to static frames) |
|-----------|------|
| Layout and positioning | Event handlers (`onClick`, etc.) |
| Colors and typography | State management (Redux, hooks) |
| Text content | API calls and data fetching |
| Border radius, shadows | Animation and transitions |
| Component structure (as layers) | Business logic |

> **Speaker note:** "Code to Canvas is for exploration and design review, not for maintaining a 1:1 sync between code and Figma. Think of it as 'I built something in code, let me send it to my designer for visual refinement.' The designer edits the Figma version, then you pull those design changes back via MCP to update the code. It's a bridge, not a live connection."

---

## The MCP Tools: Designer Workflows vs Developer Workflows

The Figma MCP server exposes **12 core tools** plus `generate_figma_design` (available only in Claude Code with Remote MCP). In the presentation we covered the four most relevant for developers. Here's the full set, organized by who benefits most.

> **Note:** The grouping below is our editorial categorization for teaching purposes — Figma's official docs list all tools in a single flat list. Some tools have platform restrictions noted below.

### Developer-Focused Tools

| Tool | What It Does | Restrictions |
|------|-------------|-------------|
| `get_design_context` | Returns styled code representation of selected frames (defaults to React + Tailwind) | — |
| `get_variable_defs` | Extracts design tokens from selected layers | — |
| `get_code_connect_map` | Retrieves existing mappings between Figma components and code components | — |
| `add_code_connect_map` | Creates new component-to-code mappings | — |
| `get_code_connect_suggestions` | AI-assisted detection of potential component mappings | **Claude Code + Remote MCP only** |
| `send_code_connect_mappings` | Confirms suggested Code Connect mappings | **Claude Code + Remote MCP only** |
| `create_design_system_rules` | Generates a rules file for consistent design-to-code translation | — |

### Designer/PM-Focused Tools

| Tool | What It Does | Restrictions |
|------|-------------|-------------|
| `generate_figma_design` | Creates design layers from code-generated interfaces (Code to Canvas) | **Claude Code + Remote MCP only** (may not appear in all tool catalogs) |
| `generate_diagram` | Creates FigJam diagrams from Mermaid syntax | — |
| `get_figjam` | Converts existing FigJam diagrams to XML with screenshots | — |

### Shared Tools

| Tool | What It Does | Restrictions |
|------|-------------|-------------|
| `get_screenshot` | Captures visual screenshot of a selection for reference | — |
| `get_metadata` | Returns layer structure (IDs, names, types, positions) — lightweight, saves tokens | — |
| `whoami` | Returns authenticated user identity | **Remote MCP only** |

> **Speaker note:** "Notice how the tools split along the designer-developer line. Your developers use `get_design_context` and `get_variable_defs` to generate code. Your designers use `generate_figma_design` and `generate_diagram` to create visual artifacts. The overlap is in `get_screenshot` and `get_metadata` — those are useful for both sides. Pay attention to the restrictions column — several tools only work in Claude Code with the Remote MCP server."

---

## Code Connect: Mapping Design Components to Code Components

This feature deserves special attention because it's the key to **design system integrity**.

> **Plan requirement:** Code Connect is available on **Organization and Enterprise plans** only, with a Full or Dev seat. Smaller teams won't have access to this feature.

Code Connect lets you create explicit mappings between Figma design components and your actual code components. When Claude generates code from a Figma design, it uses your existing `<Button>`, `<Card>`, and `<Table>` components instead of generating new ones from scratch.

### How It Works

```
Figma Component: "Primary Button"     ←→     Code: <Button color="primary" />
Figma Component: "Data Table"          ←→     Code: <Table responsive />
Figma Component: "Status Card"         ←→     Code: <Card className="status-card" />
```

### Setup via MCP (Claude Code + Remote MCP only)

1. Use `get_code_connect_suggestions` — Claude analyzes your Figma file and codebase, then suggests mappings
2. Review the suggestions
3. Confirm with `send_code_connect_mappings`
4. For manual mappings, use `add_code_connect_map` (available more broadly)

### Alternative Setup Pathways

Code Connect also supports two non-MCP approaches:
- **Code Connect UI** — A visual interface inside Figma that links components to GitHub repositories
- **Code Connect CLI** — A terminal-based tool for setting up mappings from your codebase

### Why It Matters

Without Code Connect, Claude generates generic implementations. With it, Claude uses your actual component library. For energycorp, this means Claude would use the existing Reactstrap components and class-based patterns instead of generating new functional components with Tailwind.

> **Speaker note:** "This connects directly to the hallucination prevention we covered in Session 1. Remember phantom imports — Claude inventing components that don't exist? Code Connect is the solution. It tells Claude exactly which components exist and how they map to design elements."

---

## Design System Rules: Automated Consistency

The `create_design_system_rules` tool generates a rules file that serves as a bridge between your Figma design system and your code conventions.

When you run it, the tool returns a template/prompt, and the agent then **analyzes your codebase** to discover patterns, tokens, and conventions. The output is a Markdown file that can contain:
- Your color tokens and their semantic meanings
- Typography scales and when to use each
- Spacing conventions
- Component naming conventions
- Framework-specific guidance (e.g., "Use Reactstrap Card, not raw divs")

> **Important distinction:** The content comes from **codebase analysis**, not direct extraction from your Figma file. The tool prompts the agent to examine your code and document the design patterns it finds.

The destination for this file depends on your MCP client:

| MCP Client | Destination |
|------------|------------|
| **Claude Code** | `CLAUDE.md` in project root (primary) or `.claude/rules/figma-design-system.md` |
| **Codex CLI** | `AGENTS.md` in project root |
| **Cursor** | `.cursor/rules/figma-design-system.mdc` |

For Claude Code, it fits alongside the rules directory we set up in Session 2:

```
.claude/
├── commands/             ← Session 2
│   ├── test-backend.md
│   └── review-file.md
├── rules/                ← Session 2 + Session 3
│   ├── testing.md        ← Session 2
│   ├── api-conventions.md ← Session 2
│   ├── frontend-patterns.md ← Session 3 (manual)
│   └── figma-design-system.md ← Session 3 (generated via codebase analysis)
└── settings.json         ← Session 1
```

> **Speaker note:** "In Session 2, you created rules files by hand — writing out your testing conventions and API patterns. The Figma MCP's `create_design_system_rules` tool automates this — it analyzes your codebase and generates a rules file documenting your design system patterns. It's the same concept, but the agent discovers the conventions from your code rather than you writing them manually."

---

## The Bidirectional Pipeline: Putting It All Together

Here's the full picture. This is how Figma and Claude Code work together across your team:

### Workflow 1: Design-First (Figma → Code)

The standard flow. A designer creates a mockup, a developer generates code from it.

```
Designer creates mockup in Figma
    ↓
Designer defines Variables (color tokens, spacing, typography)
    ↓
Developer connects Claude Code via MCP (Remote or Desktop)
    ↓
Developer: "Implement this Figma frame as a React component"
    ↓
Claude reads design context + variables + Code Connect mappings
    ↓
Claude generates code using your existing component library
    ↓
Developer reviews → refines → integrates → tests
```

### Workflow 2: Code-First (Code → Canvas → Refined Design → Updated Code)

A developer builds a prototype, sends it to Figma for design review, then pulls refinements back.

```
Developer builds UI with Claude Code
    ↓
"Send this to Figma"
    ↓
Editable Figma frames appear in the designer's file
    ↓
Designer refines: adjusts spacing, updates colors, improves layout
    ↓
Developer pulls refined design back via MCP
    ↓
Claude updates the code to match the designer's changes
```

### Workflow 3: Planning to Implementation (FigJam → Code)

A PM or designer plans in FigJam, and those plans inform code generation.

```
PM creates system diagram with Claude in FigJam
    ↓
Developer accesses FigJam via get_figjam MCP tool
    ↓
Claude Code understands the architecture from the diagram
    ↓
Claude generates code that follows the documented flow
```

### Workflow 4: Design Token Synchronization

Keep code and design in sync as tokens evolve.

```
Designer updates color variables in Figma
    ↓
Developer runs get_variable_defs via MCP
    ↓
Claude generates updated CSS/SCSS variables or Tailwind config
    ↓
PostToolUse hook (from Session 2) auto-runs tests
    ↓
If visual regression → Claude sees failure → fixes
```

> **Speaker note:** "Notice how Session 2's hooks integrate here. When Claude updates your token file, the PostToolUse hook runs your tests automatically. If a color change breaks a visual test, Claude catches it in the same loop. The tools compound — each session's artifacts make the next workflow more powerful."

---

## Connecting the Sessions: How Everything Compounds

Each session has built tools that plug into this ecosystem:

| Session | What You Built | How It Connects to Figma Workflows |
|---------|---------------|-------------------------------------|
| **Session 1** | CLAUDE.md with project constraints | Claude knows your React version, styling approach, and component patterns when generating from Figma |
| **Session 1** | Plan Mode workflow | Use Plan Mode before generating complex components — Claude reads the Figma frame, proposes an implementation plan, you approve, then it generates |
| **Session 1** | Hallucination awareness | Generated components need the same scrutiny — check imports, verify library versions, test builds |
| **Session 2** | Custom commands | Create `/generate-from-figma` that wraps the tech stack specification so you don't repeat it every time |
| **Session 2** | PostToolUse hooks | Auto-test after every generated component — catch version mismatches immediately |
| **Session 2** | Rules files | `frontend-patterns.md` tells Claude your conventions; `design-system.md` (generated from Figma) gives it your tokens |
| **Session 2** | Sub-agents | Delegate Figma exploration to an Explore agent to keep your main context clean for implementation |
| **Session 3** | Figma MCP connection | The foundation — Claude can read your designs |
| **Session 3** | Design token extraction | Colors, spacing, typography flow from Figma to code automatically |

> **Speaker note:** "This is why we taught the sessions in this order. CLAUDE.md constrains Claude's output. Hooks verify it automatically. Rules files encode your conventions. And now Figma MCP gives Claude the design context to generate components that match both your code patterns and your visual design. Each layer reinforces the others."

---

## Known Limitations and Honest Expectations

Consistent with Session 1's approach — set honest expectations to prevent frustration:

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **No live sync** | Code to Canvas is a one-time capture, not a real-time mirror | Re-send after significant code changes |
| **Business logic is lost** | Figma frames don't carry event handlers, state, or API calls | Treat Figma output as visual reference, not source of truth for behavior |
| **Captured frames lack design system structure** | Code to Canvas frames don't carry token values, component states, or design system constraints | Manually connect captured frames to your design system |
| **Multiple context switches** | Moving between Claude Code, browser, and Figma adds friction | Develop a consistent team workflow and stick to it |
| **`generate_figma_design` requires Remote MCP** | Code to Canvas doesn't work with Desktop MCP alone; the tool may also fail to appear in some tool catalogs | Use Remote MCP for Code to Canvas, Desktop for design reading; restart Claude Code if the tool isn't visible |
| **Connection instability** | MCP connections can drop due to switching files/apps (stops desktop server), auth token expiration, or transport protocol mismatches | Restart Claude Code if `/mcp` shows disconnected; verify your transport is `http` (not the deprecated `sse`) |
| **Starter plan: 6 MCP tool calls/month** | Severe constraint for teams on Figma's free Starter plan using Remote MCP | Upgrade to a paid Figma plan for production use |
| **Code Connect requires Org/Enterprise plan** | Not available to smaller teams on Pro or free plans | Use `add_code_connect_map` for manual mappings on lower-tier plans, or rely on `get_design_context` without Code Connect |
| **FigJam files are public until claimed** | Files generated via the Figma Connector are viewable by anyone with the link until you log in and claim them | Always claim generated FigJam files promptly by adding them to your drafts |
| **Figma Variables required for token extraction** | Files without manually created Variables yield empty token results | Work with your designer to set up Variables, or use `get_design_context` which reads visual properties directly |
| **Default output is React + Tailwind** | `get_design_context` assumes React + Tailwind unless overridden | Always specify your tech stack in the prompt or rules file |

> **Speaker note:** "There are more limitations here than in our earlier sessions — that's because this ecosystem spans multiple products. The biggest practical ones: Figma Variables must be manually created, the Starter plan's 6-call limit makes Remote MCP impractical for real work, and Code Connect is only on Organization or Enterprise plans. But component generation via `get_design_context` works across all plans and reads visual properties directly from the frame."

---

## Summary

| Integration Layer | Who Uses It | What It Does | Key Benefit |
|-------------------|-------------|-------------|-------------|
| **Figma Connector** | Designers, PMs | Claude reads Figma files, generates FigJam diagrams | No terminal required — accessible to non-developers |
| **Figma MCP (Remote)** | Developers | Claude Code reads designs via URL, generates code | Quick setup, works without Figma Desktop |
| **Figma MCP (Desktop)** | Developers + Designers | Selection-based workflow with live canvas access | Pixel-precise, sees unpublished changes |
| **Code to Canvas** | Developers → Designers | Code-generated UIs become editable Figma frames | Designers can refine code prototypes visually |
| **Code Connect** | Developers + Designers | Maps Figma components to code components | Prevents hallucinated components, maintains design system integrity |
| **Design System Rules** | Developers (automated) | Generates rules file via codebase analysis | Bridges the design-code gap permanently via rules files |

**The key principle:** The Figma-Claude ecosystem is bidirectional. Designs flow to code via MCP. Code flows to Figma via Code to Canvas. Planning artifacts flow from FigJam to implementation. Design tokens synchronize across both. And the automation tools from Sessions 1-2 — CLAUDE.md, hooks, rules files, sub-agents — make every step of this pipeline more reliable.

> The goal isn't to replace designers or developers. It's to eliminate the translation tax — the manual, error-prone work of converting between design and code. Claude handles the translation. Your team focuses on the decisions.
