# Demo Script: Figma MCP Setup & Token Extraction

**Duration:** 25 minutes
**Repo:** energycorp (Django REST API + React SPA — React 16, Reactstrap, SCSS)
**Prerequisites:** Claude Code CLI installed, energycorp cloned, Figma account with sample file ready

---

## Demo Setup (before students arrive)

1. Clean energycorp repo (revert any Session 2 demo changes)
2. Ensure `.claude/` directory exists with commands, skills, rules from Session 2
3. Verify Claude Code works: `claude --version`
4. **Create or prepare a sample Figma file** with:
   - A simple card component (status card with icon, title, value, trend)
   - A data table component (headers, rows, action buttons)
   - Named color variables and text styles in Figma
   - Have the Figma file URL ready to paste
5. Test Figma MCP authentication in advance
6. Increase terminal font size for visibility
7. Open VS Code as backup for viewing generated files
8. Have energycorp's `Frontend/src/views/operator/GetClients.jsx` open for pattern reference

---

## Part 1: Installing Figma MCP (5-7 min)

### Goal
Install the Figma MCP server, authenticate, and verify the connection.

### Steps

**1.** Navigate to the energycorp directory and launch Claude Code:

```bash
cd /path/to/energycorp
claude
```

**2.** Show current MCP status:

```
/mcp
```

> **Say:** "Let's check what MCP servers we have. You should see the GitHub MCP from Session 2 if you kept it. Now let's add Figma."

**3.** Exit Claude temporarily and install the Figma MCP:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

> **Say:** "One command. `--transport http` means it connects over the internet — no local server needed. The URL points to Figma's official MCP endpoint."

Additionally, install the Figma plugin for Claude Code.
From within Claude Code:
```bash
/plugin 
# then select the Figma Plugin
```

**4.** Re-launch Claude and verify:

```
/mcp
```

> **Say:** "See 'figma' listed? Claude can now talk to Figma's API."

**5.** Authenticate. When Claude first uses a Figma tool, it will prompt for authentication.

> **Say:** "The first time you use a Figma tool, it will ask you to authenticate. This is a one-time OAuth flow — you log in to Figma in your browser and authorize Claude Code."

If you need to trigger authentication manually:

```
/mcp
```
Select figma → Authenticate.

> **Say:** "Once authenticated, Claude can read any Figma file you have access to. Viewer access is enough — you don't need edit permissions."

**6.** Show the project-level MCP configuration:

> **Say:** "Like the GitHub MCP, Figma MCP can be project-scoped. Check `.mcp.json` — when you commit this file, your whole team gets the same MCP configuration."

Show `.mcp.json` briefly.

---

## Part 2: Extracting Design Tokens (8-10 min)

### Goal
Use `get_variable_defs` to extract design tokens from a Figma file and discuss the output.

> **Important prerequisite:** The Figma file must have **Figma Variables** manually set up by the designer. Variables are NOT automatic — they must be created in Figma's Local Variables panel, named, and applied to frames. A file with raw hex colors and no Variables will return nothing from `get_variable_defs`. If your sample file doesn't have Variables, create a minimal set (5-6 color variables, a few spacing values) before the demo.

### Steps

**1.** Explain what we're about to do:

> **Say:** "Now let's ask Claude to read our Figma file. I'm going to give it a URL to our sample design file and ask it to extract the design tokens — the colors, spacing, and typography values that define our design system."

**2.** Ask Claude to extract tokens:

```
I have a Figma file with our design system components. Here's the URL:
https://www.figma.com/design/EKu92cjEe5ESf9GYC3opnE/Sean-McCarthy-s-team-library?node-id=3314-781&t=W8G4czhm1Xh2zKrU-4

Please extract all design tokens from this file using the Figma MCP.
I want to see: colors, spacing values, typography styles, and any
other design variables defined in the file.
```

> **Say:** "Watch what happens. Claude uses the `get_variable_defs` tool from the Figma MCP to read the design data directly from Figma's API. Note: this tool is **selection-scoped** — it only returns variables and styles applied to whatever is currently selected in the file, not the entire file's variable library."

**3.** Wait for the output. Walk through the token extraction results:

> **Say:** "Look at this output. We've got:
> - **Color tokens** — named colors with their hex values, like `primary-500: #3B82F6`
> - **Typography tokens** — font families, sizes, weights, line heights
> - **Spacing tokens** — if the file defines spacing variables
>
> These are the exact values from the Figma file. No eyeballing, no pixel-measuring."

**4.** Discuss how tokens map to the project:

> **Say:** "Now, energycorp doesn't currently use a token system — it uses SCSS variables in `paper-dashboard.scss`. In a well-structured project, you'd map these extracted tokens to your CSS variables or SCSS variables. That's the bridge between design and code."

**5.** Ask Claude to create a token mapping file:

```
Based on the tokens you just extracted, create a simple token mapping file
at Frontend/src/assets/css/design-tokens.css using CSS custom properties.
Map the extracted colors to meaningful names like --color-primary, --color-surface, etc.
```

> **Say:** "Claude is now creating a CSS file with custom properties based on the Figma tokens. This file becomes the single source of truth for design values in your codebase."

Walk through the generated file.

---

## Part 3: Generating a React Component (8-10 min)

### Goal
Generate a React component from a Figma frame, specifying energycorp's tech stack.

### Steps

**1.** Explain what we're doing:

> **Say:** "Now the exciting part. Let's generate an actual React component from a Figma frame. The key is to tell Claude our exact tech stack so it generates code that fits our project."

**2.** Ask Claude to generate a component:

```
Generate a React component from this Figma frame: https://www.figma.com/design/EKu92cjEe5ESf9GYC3opnE/Sean-McCarthy-s-team-library?node-id=3314-781&t=AhPpx8O5g8CtjYkq-4

IMPORTANT constraints for this project:
- React 16 with class components (NOT functional components, NOT hooks)
- Reactstrap for UI components (Card, CardBody, CardTitle, Row, Col, etc.)
- SCSS for custom styling (follow the Paper Dashboard SCSS conventions)
- Use counterpart for i18n translations
- Connect to Redux with connect() HOC for language support
- Follow the component pattern in Frontend/src/views/operator/GetClients.jsx

Create the component file and a matching SCSS file.
```

> **Say:** "Notice I'm being very specific about the tech stack. React 16, class components, Reactstrap, SCSS, counterpart for i18n. If I didn't specify this, Claude would default to React + Tailwind + TypeScript — completely wrong for this project."

**3.** Wait for generation. Walk through the output:

> **Say:** "Let's look at what Claude generated. Check these things:
> - Is it a class component? ✓ or ✗
> - Does it use Reactstrap components? ✓ or ✗
> - Are styles in SCSS? ✓ or ✗
> - Does it have i18n wrappers? ✓ or ✗
> - Are imports valid? Check against our package.json"

**4.** Show a side-by-side comparison with an existing component:

> **Say:** "Let's compare this with our existing `GetClients.jsx`. Look at the structure — constructor, state, lifecycle methods, Redux connection. Does the generated component follow the same pattern?"

**5.** If there are issues, refine live:

```
Good start. Please make these adjustments:
1. The component should extend React.Component, not use hooks
2. Add the counterpart import and Tr component for translations
3. Use the mapStateToProps/mapDispatchToProps pattern from GetClients.jsx
4. Use Reactstrap Card components instead of plain divs
```

> **Say:** "This is the review-refine loop. The first output was maybe 70% right. With one refinement prompt, we're at 90%. One more and we're ready for integration."

**6.** Show the final component:

> **Say:** "That's a production-ready component, generated from a Figma design, matching our project's patterns. Compare that to manually building it from scratch while eyeballing a Figma mockup."

---

## Part 4: Creating a Frontend Rules File (3-4 min)

### Goal
Create a rules file so Claude knows the frontend conventions permanently.

### Steps

**1.** Explain the connection to Session 2:

> **Say:** "In Session 2, we created rules files for testing and API conventions. Now let's create one for frontend patterns so we don't have to specify our tech stack every time."

**2.** Create the rules file:

Create `.claude/rules/frontend-patterns.md`:

```markdown
# Frontend Conventions

## Tech Stack
- React 16.8 with class-based components (NOT hooks, NOT functional components)
- Reactstrap 8.0 for UI components (Bootstrap 4)
- SCSS using Paper Dashboard template conventions
- counterpart + react-translate-component for i18n
- Redux for language state only (connect() HOC pattern)
- Axios 0.19 for API calls (no central instance — import per component)
- React Router 5 with ProtectedRoute HOCs

## Component Structure
- Views go in `src/views/<role>/` (admin, operator, manager)
- Reusable components go in `src/components/`
- Each component: class extends React.Component
- State in constructor: `this.state = { ... }`
- Arrow function handlers: `handleInput = e => { ... }`
- Redux connection at export: `export default connect(mapState, mapDispatch)(Component)`

## Styling
- SCSS files in `src/assets/scss/paper-dashboard/`
- Use Reactstrap className props (e.g., `color="primary"`, `size="sm"`)
- Custom classes follow Paper Dashboard naming
- No inline styles except for dynamic values
- No Tailwind, no CSS-in-JS, no styled-components

## API Integration
- Base URL: hardcoded in components (see CLAUDE.md)
- Auth: token from localStorage via Auth.getSession()
- Error handling: .catch() with console.log or alert
```

**3.** Verify Claude reads it:

```
What frontend conventions should I follow when creating a new component?
```

> **Say:** "Claude now knows our frontend stack permanently. Next time we generate a component, we don't need to specify React 16 or Reactstrap — it's in the rules file."

---

## Demo Wrap-Up

> **Say:** "Let's recap what we just did:
> - **Installed Figma MCP** — one command, Claude can now read our Figma files
> - **Extracted design tokens** — colors, typography, spacing from our actual designs
> - **Generated a React component** — from a Figma frame, matching our project's patterns
> - **Created a frontend rules file** — so Claude knows our conventions permanently
>
> The entire design-to-code pipeline, from Figma to a production-ready component, in about 20 minutes. Next, we'll talk about the review process and common pitfalls."

---

## Troubleshooting Common Demo Issues

| Issue | Fix |
|-------|-----|
| Figma MCP install fails | Check internet connectivity; verify the URL is exactly `https://mcp.figma.com/mcp` |
| Authentication fails | Try `/mcp` → figma → Authenticate again; check Figma account has API access |
| `get_variable_defs` returns empty | **Most common issue.** Figma Variables must be manually created by the designer. If the file uses raw hex colors and pixel values (no named Variables), this tool returns nothing. You can still use `get_design_context` to generate components — it extracts visual properties directly from the frame. |
| `get_design_context` generates wrong tech stack | Specify tech stack explicitly in the prompt; add to `frontend-patterns.md` rules file |
| Generated component uses hooks | React 16 supports hooks but the project uses class components; add "class components only, NO hooks" to prompt |
| SCSS file has wrong conventions | Reference an existing SCSS file in the prompt: "Follow the patterns in `src/assets/scss/paper-dashboard/_cards.scss`" |
| Claude imports packages not in package.json | Always review imports; ask Claude to "verify all imports exist in our package.json" |
| Figma URL not recognized | Use the full URL from the browser address bar; frame-specific URLs work best |
