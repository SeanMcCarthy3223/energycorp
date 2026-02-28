# Hands-on Lab: Figma MCP & Design-to-Code Pipeline

**Duration:** 50-60 minutes (independent work)
**Goal:** Install Figma MCP, extract design tokens from your project's Figma files, generate a React component matching your project's conventions, create a frontend rules file, auto-generate design system rules from your codebase, create a FigJam architecture diagram, and try the bidirectional Code to Canvas pipeline.

---

## Exercise 1: Install and Verify Figma MCP (5 min)

### 1.1 Install the Figma MCP Server

Open a terminal in your project directory:

```bash
cd /path/to/your/project
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

### 1.2 Install the Figma Plugin

From within Claude Code, install the Figma plugin:

```
/plugin
```

Then select the **Figma Plugin** from the list.

### 1.3 Verify the Installation

Launch Claude Code and check:

```
/mcp
```

You should see `figma` listed as a connected server.

### 1.4 Authenticate

If prompted, follow the OAuth flow — click the link, authorize in your browser, return to Claude Code.

If authentication doesn't trigger automatically, run:

```
/mcp
```
Then select figma → Authenticate.

### 1.5 Test the Connection

Ask Claude:

```
Can you access the Figma MCP? List the available Figma tools you have access to.
```

**Verify:**
- [ ] Figma appears in `/mcp` server list
- [ ] Figma Plugin installed successfully
- [ ] Authentication completed successfully
- [ ] Claude confirms access to Figma tools (`get_design_context`, `get_variable_defs`, `get_screenshot`, etc.)

---

## Exercise 2: Extract Design Tokens (8 min)

### 2.1 Identify a Figma File

You need a Figma file URL. Use one of these:
- **Your project's design file** — the actual BulkSource designs (best option)
- **The instructor's sample file** — URL provided during the session
- **Any Figma file you have access to** — even a personal file works for practice

### 2.2 Extract Tokens

Ask Claude to extract design tokens:

```
Extract all design tokens from this Figma file: [PASTE YOUR FIGMA URL]

I want to see:
1. Color tokens (all named colors with hex values)
2. Typography tokens (font families, sizes, weights, line heights)
3. Spacing tokens (if defined as variables)
4. Border/radius tokens (if defined)

Format as a structured list I can reference later.
```

### 2.3 Review the Token Output

Look at what Claude extracted. Answer these questions:

- How many color tokens were found? ___
- Are there typography definitions? ___
- Were spacing tokens defined in the Figma file? ___
- Are the token names meaningful (e.g., `primary-500`) or generic (e.g., `color-1`)? ___

> **If `get_variable_defs` returns few or no tokens:** This is the most common issue. Figma Variables must be **manually created** by your designer — they do NOT exist automatically. A designer must open the Local Variables panel, create each variable, name it, and apply it to layers. A Figma file where colors were simply picked from the color picker (without creating Variables) will return **zero tokens**. This is extremely common, especially with smaller teams.
>
> **You can still proceed without tokens.** Use `get_design_context` to generate components — it extracts visual properties directly from the frame regardless of whether Variables exist. You just won't get named token values. Tell your designer that creating Figma Variables dramatically improves the AI-assisted workflow.

### 2.4 Create a Token Mapping File

Ask Claude to create a CSS custom properties file for your project:

```
Based on the tokens you extracted, create a design token mapping file
using CSS custom properties.

Save it to [your preferred location, e.g., src/styles/design-tokens.css
or src/assets/tokens.css].

Use semantic names:
- Colors: --color-primary, --color-secondary, --color-surface, --color-text
- Typography: --font-family-body, --font-size-base, --font-weight-bold
- Spacing: --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg
- Borders: --radius-sm, --radius-md, --radius-lg
```

**Verify:**
- [ ] Token file was created at the specified path
- [ ] Color tokens have semantic names (not just `--color-1`, `--color-2`)
- [ ] Values match what you see in the Figma file
- [ ] The file format matches your project's styling approach (CSS variables, SCSS variables, JS tokens, etc.)

---

## Exercise 3: Generate a React Component from Figma (12 min)

### 3.1 Choose a Figma Frame

Pick a single component from your Figma file. Good candidates:
- A card component (product card, status card, info card)
- A table or list view
- A form section
- A navigation element

**Copy the frame's URL** from Figma (right-click the frame → Copy link, or use the browser URL while the frame is selected).

### 3.2 Document Your Tech Stack

Before generating, fill in your project's tech stack:

| Setting | Your Project |
|---------|-------------|
| React version | ___ (e.g., 16, 17, 18, 19) |
| Component style | ___ (class components / functional + hooks / mixed) |
| UI library | ___ (Reactstrap, MUI, Ant Design, Chakra, none) |
| Styling approach | ___ (CSS modules, SCSS, Tailwind, styled-components) |
| State management | ___ (Redux, Context, Zustand, MobX, none) |
| i18n library | ___ (react-intl, i18next, counterpart, none) |
| API client | ___ (Axios, fetch, React Query, SWR) |
| TypeScript | ___ (yes / no) |

### 3.3 Generate the Component

Ask Claude to generate a component with your exact constraints:

```
Generate a React component from this Figma frame: [PASTE FRAME URL]

Use these exact constraints for my project:
- React [your version] with [class/functional] components
- [Your UI library] for base UI components
- [Your styling approach] for styles
- [Your state management] if global state is needed
- [Your i18n approach] for all user-visible text
- [TypeScript/JavaScript] (specify one)

Follow the patterns in [path/to/an/existing/component/in/your/project].

Create the component file and any associated style files.
```

**Example for a React 18 + TypeScript + Tailwind project:**
```
Generate a React component from this Figma frame: [URL]

Use these exact constraints:
- React 18 with functional components and hooks
- TypeScript for type safety
- Tailwind CSS for styling (no custom CSS files)
- React Query for data fetching if needed
- react-intl for i18n translations

Follow the patterns in src/components/ProductCard.tsx.
```

**Example for a React 16 + JavaScript + CSS Modules project:**
```
Generate a React component from this Figma frame: [URL]

Use these exact constraints:
- React 16 with class components (NO hooks)
- Plain JavaScript (no TypeScript)
- CSS Modules for styling (.module.css files)
- Redux with connect() HOC for state management
- No i18n library — English only

Follow the patterns in src/components/OrderList.jsx.
```

### 3.4 Review the Generated Code

Run through this checklist:

| Check | Question | Pass? |
|-------|----------|-------|
| **Imports** | Do all imported packages exist in your `package.json`? | [ ] |
| **Component style** | Does it use your component pattern (class/functional/hooks)? | [ ] |
| **UI library** | Does it use your UI components, not some other library? | [ ] |
| **Styling** | Does it use your styling approach, not a different one? | [ ] |
| **i18n** | Are user-visible strings wrapped in your translation system? | [ ] |
| **State** | Does it manage state the way your other components do? | [ ] |
| **File location** | Is the component in the right directory for your project? | [ ] |

### 3.5 Refine the Component

If any checks failed, ask Claude to fix the specific issues:

```
Please fix these issues with the generated component:
1. [List each issue specifically]
2. Verify all imports exist in our package.json
3. Make sure the component follows the exact pattern of [existing component path]
```

### 3.6 Compare with an Existing Component

Open the generated component and an existing component from your project side by side. Ask yourself:
- Would this pass code review on my team?
- Does the structure look natural alongside our other components?
- Are there patterns in the generated code that don't exist in our codebase?

**Verify:**
- [ ] Generated component uses your correct React version patterns
- [ ] All imports are valid (exist in package.json, correct paths)
- [ ] Styling matches your project's approach
- [ ] Component structure matches your existing components
- [ ] After refinement, the component would pass code review

---

## Exercise 4: Create a Frontend Rules File (5 min)

### 4.1 Create the Rules Directory (if it doesn't exist)

```bash
mkdir -p .claude/rules
```

### 4.2 Create Your Frontend Conventions File

Create `.claude/rules/frontend-patterns.md` using the tech stack you documented in Exercise 3.2:

```markdown
# Frontend Conventions

## Tech Stack
- React [version] with [component style]
- [UI library] for base components
- [Styling approach]
- [State management] for global state
- [i18n library] for translations
- [API client] for HTTP requests
- [TypeScript/JavaScript]

## Component Structure
- Components go in [your directory structure]
- [Component naming convention — PascalCase files, etc.]
- [Export pattern — default export, named export, HOC wrapper]
- [State management pattern — where state lives, how it's connected]

## Styling
- [Where style files live]
- [Class naming convention — BEM, camelCase, utility classes, etc.]
- [Shared styles location]
- [How responsive design is handled]

## When Generating Components from Figma
- Always use [your UI library] components instead of raw HTML
- All user-visible strings must use [your i18n approach]
- Follow the structure of [path/to/your/best/example/component]
- No [list things to avoid: Tailwind if you use SCSS, hooks if you use classes, etc.]
```

**Replace all bracketed items with your actual conventions.** Be specific and concise.

### 4.3 Verify Claude Reads Your Rules

Restart Claude Code and ask:

```
What frontend conventions should I follow when creating a new React component in this project?
```

**Verify:**
- [ ] Claude references information from your `frontend-patterns.md` file
- [ ] The conventions match what you wrote
- [ ] Claude mentions your specific tech stack (not a generic answer)

---

## Exercise 5: Auto-Generate Design System Rules (8 min)

In the demo, the instructor wrote `frontend-patterns.md` by hand. Now let's have Claude discover your project's patterns automatically — and compare the two approaches.

### 5.1 Understand the Tool

`create_design_system_rules` is a Figma MCP tool that prompts Claude to analyze your codebase and document the design patterns it finds. The output is a Markdown rules file capturing:
- Color tokens and their semantic meanings
- Typography conventions
- Spacing patterns
- Component naming and structure conventions
- Framework-specific guidance

### 5.2 Run the Tool

Ask Claude:

```
Use the Figma MCP's create_design_system_rules tool to generate a design system
rules file for this project.

Analyze the existing codebase — especially the [your frontend source directory,
e.g., src/ or Frontend/src/] directory — and document the patterns you find:
component structure, styling approach, UI library usage, state management,
and any design tokens or CSS variables.
```

> **Note:** This may take 30-60 seconds as Claude reads multiple files across your codebase. This is normal.

### 5.3 Save the Output

If Claude didn't already save the file, ask it to:

```
Save the generated design system rules to .claude/rules/figma-design-system.md
```

### 5.4 Compare Hand-Written vs Auto-Generated

Open your hand-written `frontend-patterns.md` (from Exercise 4) alongside the auto-generated `figma-design-system.md`. Answer these questions:

| Question | Your Answer |
|----------|-------------|
| Did the auto-generated version catch patterns you forgot to include? | ___ |
| Did it miss conventions that aren't obvious from the code alone? | ___ |
| Are there any conflicts between the two files? | ___ |
| Which file has more specific, actionable guidance? | ___ |

> **Key insight:** The hand-written file captures your team's *intentions* — "we use class components, not hooks." The auto-generated file captures your codebase's *reality* — "here are the actual patterns in your code." When they disagree, that's a signal worth investigating. Neither is perfect on its own — the best approach is to start with the auto-generated version and refine it with your team's knowledge.

**Verify:**
- [ ] Auto-generated rules file was created at `.claude/rules/figma-design-system.md`
- [ ] The file references actual patterns from your codebase (not generic boilerplate)
- [ ] You've identified at least one difference between the hand-written and auto-generated versions
- [ ] Both files are now in `.claude/rules/` for Claude to load automatically

---

## Exercise 6: Create a FigJam Architecture Diagram (5 min)

FigJam diagrams are planning artifacts — architecture diagrams, user flows, data model maps. They live in Figma alongside your design files, and developers can later access them via the `get_figjam` MCP tool to use as context when implementing features.

### 6.1 Describe Your Architecture

Think about a useful diagram for your project. Good candidates:
- **Data model relationships** — how your core models connect to each other
- **User flow** — a key workflow like checkout, onboarding, or authentication
- **API architecture** — how your frontend talks to your backend services
- **Feature map** — the major modules or areas of your application

### 6.2 Generate the Diagram

Ask Claude to create a FigJam diagram:

```
Create a FigJam diagram showing [your project name]'s [diagram type]:

[Describe the relationships, flow, or structure you want to visualize.
Be specific about entities, connections, and groupings.]

Use a [flowchart/sequence/entity-relationship] format that a project manager
could use for onboarding new developers.
Include [relevant groupings, e.g., module names, team boundaries, service names].
```

**Example for a data model diagram:**
```
Create a FigJam diagram showing our app's core data model:

- User → has many Orders → each Order has OrderItems
- Product → belongs to Category → Categories are hierarchical
- Order → has one Payment → Payment has a status (pending/completed/refunded)

Use a flowchart format. Group by domain area (Users, Commerce, Inventory).
```

**Example for a user flow:**
```
Create a FigJam diagram showing our checkout flow:

1. Cart page → Review items
2. Shipping form → Enter address
3. Payment selection → Credit card or PayPal
4. Order confirmation → Show summary
5. Email receipt → Sent asynchronously

Include decision points (login required? coupon applied?) and error states.
```

### 6.3 Review the FigJam Output

Claude will provide a link to the generated FigJam document. Open it and check:

- [ ] The diagram accurately represents your architecture
- [ ] Relationships and groupings make sense
- [ ] The diagram would be useful for onboarding a new developer

> **Privacy reminder:** FigJam files created via Claude are **public and viewable by anyone with the link** until you log in to Figma and claim the file by adding it to your drafts. Always claim generated FigJam files promptly — especially if they contain proprietary architecture details.

### 6.4 Refine if Needed

If the diagram structure isn't right, ask Claude to adjust:

```
Adjust the diagram to [describe what needs to change — e.g., "show the
relationship between Order and Payment as one-to-one, not one-to-many"
or "add a decision point between step 2 and step 3"].
```

**Verify:**
- [ ] FigJam diagram was created and you received a link
- [ ] The diagram is editable in Figma (you can move boxes, add sticky notes)
- [ ] You claimed the file in Figma (added it to your drafts) if it contains proprietary information

---

## Exercise 7: Code to Canvas — Send a UI to Figma (8 min)

In the demos, we went from Figma to code. Now let's go the other direction — build a quick UI prototype with Claude Code and send it to Figma as fully editable frames. This is the bidirectional pipeline.

### 7.1 Why This Matters

Imagine you're prototyping a new feature. You build a quick UI with Claude Code. Instead of describing it to your designer, you send the actual rendered UI to Figma. The designer can refine the spacing, adjust colors, and improve the layout — all in Figma, without touching code. Then you pull those design changes back via `get_design_context` to update your code.

### 7.2 Build a Simple Prototype

Ask Claude to create a small, self-contained HTML page relevant to your project:

```
Build a simple HTML page that shows [describe a UI relevant to your project]:
- [Key element 1 — e.g., a title, a summary card, a data table]
- [Key element 2 — e.g., a chart, a form, a status indicator]
- [Key element 3 — e.g., action buttons, navigation tabs]
- Use clean, modern styling with [your preferred color scheme or "a white card on a light gray background"]

Save it as a standalone HTML file at [your preferred location, e.g.,
src/prototype.html or demo.html] so I can preview it in a browser.
```

**Example prompts:**
```
Build a simple HTML page that shows a customer dashboard summary with:
- A welcome banner with the customer's name
- Three stat cards showing "Total Orders", "Pending Shipments", "Account Balance"
- A recent orders table with 3-4 sample rows
- Use clean, modern styling with a white card on a light gray background

Save it as a standalone HTML file at demo-dashboard.html.
```

> **Tip:** Ask for a standalone HTML file rather than a full React component. For Code to Canvas, you want something you can preview in a browser quickly. The goal is to show the designer what you're thinking — not to build the final component.

### 7.3 Preview in the Browser

Open the generated file in your browser:

```bash
# On macOS
open demo-dashboard.html

# On Linux
xdg-open demo-dashboard.html
```

**OR open the file manually**

Drag and drop the file into your browser's search bar

**Important: Verify the UI looks correct before sending to Figma**

### 7.4 Send to Figma

Ask Claude:

```
Send the UI prototype I just built to Figma using the generate_figma_design tool.
Capture the current UI and convert it into editable Figma frames.
```

### 7.5 Review What Arrived in Figma

Open the Figma link Claude provides. Understand what's preserved and what's lost:

| Preserved in Figma | Lost (inherent to static frames) |
|--------------------|------|
| Layout and positioning | Event handlers |
| Colors and typography | JavaScript logic |
| Text content (editable) | API calls and data fetching |
| Border radius, shadows | Animation and transitions |
| Component structure (as groups) | State management |

> **If `generate_figma_design` isn't available:** This tool requires Remote MCP and may not appear in all tool catalogs. If it fails, you've still completed the concept — the HTML prototype is what you'd send. The FigJam diagram from Exercise 6 already demonstrated Claude writing back to Figma. Ask the instructor for a walkthrough of what the Figma output looks like.

### 7.6 Think About the Round-Trip

Consider the full bidirectional pipeline you've now experienced:

1. **Figma → Code** (Exercise 3): Designer creates a mockup, you generate code from it via MCP
2. **Code → Figma** (this exercise): You prototype a UI, send it to Figma for design review
3. **Figma → Code again**: Designer refines the prototype, you pull updates via `get_design_context`

**Verify:**
- [ ] HTML prototype was created and renders in the browser
- [ ] Prototype was sent to Figma (or you understand why the tool wasn't available)
- [ ] Figma frames are editable (you can select individual elements, move text, change colors)
- [ ] You understand the full round-trip workflow: Figma → Code → Figma → Code

---

## Exercise 8: (Stretch Goal) Generate a Second Component (5 min)

If you finished the exercises above with time remaining, generate a second component to test your rules files.

### 8.1 Choose a Different Frame

Pick a different component from your Figma file — something with different complexity (e.g., if your first component was a card, try a table or form).

### 8.2 Generate with Minimal Prompting

This time, give Claude less explicit tech stack information — let the rules files (both hand-written and auto-generated) do the work:

```
Generate a React component from this Figma frame: [PASTE FRAME URL]

Follow the conventions in our rules files (frontend-patterns.md and
figma-design-system.md).
Place the component in the appropriate directory.
```

### 8.3 Compare Results

Did the rules files work?
- [ ] Claude used your correct tech stack without being told explicitly
- [ ] Component structure matches your conventions
- [ ] Less refinement needed compared to Exercise 3

> This is the payoff of rules files — one-time setup, permanent benefit. Every future component generation automatically follows your conventions.

---

## Exercise 9: (Stretch Goal) Explore Desktop MCP (5 min)

If you have Figma Desktop installed and want to try the selection-based workflow:

### 9.1 Enable Dev Mode

In Figma Desktop, press **Shift+D** to enter Dev Mode.

### 9.2 Check for Claude Code Integration

Look in the **Inspect panel** (right sidebar) for Claude Code integration. If available, the Desktop MCP server runs at `http://127.0.0.1:3845/mcp`.

### 9.3 Try Selection-Based Generation

Select a frame or component in Figma, then ask Claude in your terminal:

```
Generate a React component from the currently selected frame in Figma Desktop.
```

> **Note:** Desktop MCP requires Figma Desktop running and may need additional setup. If it doesn't work, stick with Remote MCP — both produce the same quality output.

---

## Self-Assessment

### Understanding

1. What does Figma MCP give Claude access to that it doesn't have without it?

> Your answer: ___________________________________________________________

2. Why is it important to specify your tech stack when generating components from Figma?

> Your answer: ___________________________________________________________

3. What are design tokens, and why do they matter for AI-generated components?

> Your answer: ___________________________________________________________

4. What's the difference between Remote MCP and Desktop MCP for Figma?

> Your answer: ___________________________________________________________

5. Why should you create a `frontend-patterns.md` rules file instead of specifying your tech stack in every prompt?

> Your answer: ___________________________________________________________

6. What is the difference between a hand-written rules file and an auto-generated one from `create_design_system_rules`? When might they disagree?

> Your answer: ___________________________________________________________

7. How can a FigJam diagram created today help a developer working on a feature next month?

> Your answer: ___________________________________________________________

8. What is preserved and what is lost when you send a code prototype to Figma via Code to Canvas?

> Your answer: ___________________________________________________________

### Experience

9. What tokens were extracted from your Figma file? Were they useful?

> Your answer: ___________________________________________________________

10. What issues did you find during the component review step? How did you fix them?

> Your answer: ___________________________________________________________

11. Did the auto-generated design system rules catch patterns your hand-written file missed (or vice versa)?

> Your answer: ___________________________________________________________

12. Did the rules files improve the second component generation (if you tried the stretch goal)?

> Your answer: ___________________________________________________________

### Confidence

Rate your comfort level (1 = not comfortable, 5 = very comfortable):

| Skill | Rating (1-5) |
|-------|:------------:|
| Installing and configuring Figma MCP | |
| Extracting design tokens from a Figma file | |
| Generating a React component from a Figma frame | |
| Reviewing and refining generated component code | |
| Creating a hand-written frontend rules file | |
| Auto-generating design system rules from your codebase | |
| Creating a FigJam architecture diagram via `generate_diagram` | |
| Sending a code prototype to Figma via Code to Canvas | |
| Understanding the bidirectional Figma ↔ Code pipeline | |
| Knowing when to use Remote vs Desktop MCP | |

---

## Quick Reference

| Action | How |
|--------|-----|
| Install Figma MCP (Remote) | `claude mcp add --transport http figma https://mcp.figma.com/mcp` |
| Install Figma Plugin | `/plugin` in Claude Code → select Figma Plugin |
| Check MCP servers | `/mcp` in session or `claude mcp list` in terminal |
| Authenticate Figma | `/mcp` → figma → Authenticate |
| Extract design tokens | Share Figma URL + ask Claude to use `get_variable_defs` (selection-scoped) |
| Generate component from Figma | Share frame URL + specify tech stack |
| Create hand-written rules file | Add `.md` file to `.claude/rules/` |
| Auto-generate design system rules | Ask Claude to use `create_design_system_rules` from Figma MCP |
| Create FigJam diagram | Ask Claude to use `generate_diagram` with a description of your architecture |
| Read a FigJam diagram later | Share FigJam URL + ask Claude to use `get_figjam` |
| Send UI to Figma (Code to Canvas) | Build HTML prototype + ask Claude to use `generate_figma_design` |
| Reference existing component | "Follow the patterns in `path/to/Component.jsx`" |
| Verify rules loaded | Ask Claude "What conventions should I follow?" |
| Remove MCP server | `claude mcp remove figma` |
| Key caveat: tokens | `get_variable_defs` is selection-scoped and requires Figma Variables to be created by the designer |
| Key caveat: FigJam privacy | FigJam files created via Claude are public until you claim them in Figma |
| Key caveat: Code to Canvas | `generate_figma_design` requires Remote MCP and preserves layout/styling but loses interactivity |
