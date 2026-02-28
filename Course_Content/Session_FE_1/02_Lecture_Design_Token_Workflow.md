# Lecture: From Design to Code — Figma MCP, Design Tokens & Best Practices

**Duration:** 25-30 minutes
**Presentation file:** `Session_3_Combined.pptx` (16 slides)
**Goal:** Teach students the full design-to-code pipeline using Figma MCP — from connecting to Figma and extracting design tokens, through generating components with the right tech stack, to reviewing, refining, and avoiding common pitfalls with AI-generated frontend code.

---

## Slide 1: Title

**From Design to Code: Figma MCP, Design Tokens & Best Practices**

Session 3 — The Design-to-Code Pipeline

---

## Slide 2: The Gap Between Design and Code

Today, going from a Figma mockup to a React component looks like this:

```
1. Designer creates mockup in Figma
2. Developer opens Figma, measures spacing, copies hex colors
3. Developer manually builds component, eyeballing the design
4. Designer reviews: "The padding is off. That's the wrong blue."
5. Developer adjusts, re-submits
6. Repeat 2-3 times until it matches
```

**The pain points:**
- Manual measurement of spacing, colors, and typography
- Hardcoded values instead of design tokens
- Back-and-forth between developer and designer
- Inconsistencies across components
- Each developer interprets the design differently

**With Figma MCP:** Claude reads the design directly. No manual measurement, no eyeballing hex colors, no back-and-forth cycles. Figma MCP eliminates the gap by giving Claude direct access to your design data.

> **Speaker note:** Let students describe their own pain points first. Then show this slide to validate that these are universal problems. Frame the solution: "What if Claude could read the design directly?"

---

## Slide 3: How Claude Code Connects to Figma

MCP (Model Context Protocol) lets Claude Code talk to external services. In Session 2, you connected to GitHub. Today we connect to Figma.

**Simplified architecture:**
```
You → Claude Code → MCP Client → Figma MCP Server → Figma API
                                                        ↓
                                              Design data: frames, tokens,
                                              variables, styles, code hints
```

**Two server options:**

| Feature | Remote MCP | Desktop MCP |
|---------|-----------|-------------|
| **Setup** | `claude mcp add --transport http figma https://mcp.figma.com/mcp` | Enable in Figma Desktop Dev Mode |
| **How you reference** | Share Figma URLs in prompts | Select frames directly in Figma |
| **Requires Figma Desktop** | No | Yes |
| **Selection-based** | No (link-based) | Yes (click to select) |
| **Best for** | Quick prototyping, CI/CD | Daily dev workflow, precision |

**Today:** We'll use Remote MCP (simpler setup, no desktop dependency). One command to install.

> **Speaker note:** Most teams should start with Remote MCP. Desktop MCP is better for daily production work but requires more setup. Don't overwhelm — install one today, consider the other later.

---

## Slide 4: Key Figma MCP Tools

The Figma MCP provides multiple tools. These four are the most relevant for design-to-code:

### `get_design_context`
**The main tool. Returns a structured code representation of your Figma selection.**
- Input: Figma frame URL (or selection in Desktop MCP) + technology stack
- Output: React + Tailwind by default (customizable to your stack)

### `get_variable_defs`
**Returns variables and styles applied to the current selection.**
- Colors, spacing, typography, border radius
- **Selection-scoped**: only returns variables on the selected layers, NOT the entire file's variable library
- Returns nothing if the Figma file doesn't use named Variables

### `get_code_connect_map`
**Maps Figma components to your existing codebase.**
- Tells Claude which Figma component = which code component
- **Requires Figma Organization or Enterprise plan** (not free or Professional)

### `get_screenshot`
**Takes a visual screenshot of the selection for layout fidelity.**
- Claude sees the visual design alongside the structural data
- Useful for layout decisions and responsive behavior

> **Speaker note:** `get_design_context` and `get_variable_defs` are the most immediately useful. `get_code_connect_map` requires a higher-tier Figma plan and Code Connect setup — that's a later optimization. Focus on the first two today.

---

## Slide 5: What Are Design Tokens?

A design token is a **named value** from your design system — the bridge between design decisions and code implementation.

**In Figma, "design tokens" = Figma Variables** — named containers that store a single reusable value.

**Instead of this:**
```css
.card { background: #3B82F6; padding: 16px; }
```

**You use this:**
```css
.card { background: var(--color-primary); padding: var(--spacing-md); }
```

### The Token Hierarchy

Tokens work in layers, from generic to specific:

```
Layer 1: Primitives (raw values)
├── blue-500: #3B82F6
├── gray-100: #F3F4F6
├── font-sans: 'Inter'
└── size-4: 16px

Layer 2: Semantics (meaningful names)
├── color-primary: blue-500
├── color-surface: gray-100
├── font-body: font-sans
└── spacing-md: size-4

Layer 3: Component (specific usage)
├── button-bg: color-primary
├── card-bg: color-surface
└── card-padding: spacing-md
```

### Why This Matters for AI-Generated Code

When Claude extracts tokens with `get_variable_defs`, it gets **Figma Variables and Styles** applied to the selected layers:
- Figma Variables → Primitives (single raw values: colors, numbers, strings, booleans)
- Figma Styles → Composite treatments (typography combos, gradients, shadows)

**Important: Variables and Styles are NOT the same thing.** Variables hold single values (e.g., `primary-500: #3B82F6`) and support modes (light/dark) and aliasing. Styles hold composite bundles (e.g., a Text Style combining font + size + weight + line-height). Best practice is to use both together.

**Critical: `get_variable_defs` is selection-scoped.** It only returns variables and styles applied to whatever is currently selected — it does NOT dump the entire file's variable library. If nothing is selected or the selection has no variables applied, you get empty results.

**The quality of token extraction depends on whether the designer created Figma Variables.** Variables do NOT exist automatically. A designer must manually create them in Figma's Local Variables panel. **A Figma file where a designer just picked colors from the color picker without creating Variables will have zero extractable tokens.** This is extremely common in practice, especially with smaller teams.

### What to Do If Your Figma File Isn't Token-Ready

1. **Ask your designer to use Figma Variables** for colors, spacing, and sizing — this is the single most impactful change
2. **Ask your designer to create Text Styles** for typography (these are Styles, not Variables — both are useful)
3. **At minimum**, create named color Variables for your primary, secondary, and neutral palettes
4. Even basic Variables give Claude enough vocabulary to generate consistent code
5. **You can still generate components without Variables** — `get_design_context` extracts visual properties directly from frames. You just won't get named token values.

> **Speaker note:** If the team doesn't currently use design tokens, that's OK. Claude can still generate components using `get_design_context`. But tell your designers: using named Figma Variables dramatically improves the AI-assisted workflow. Without Variables, `get_variable_defs` returns nothing.

---

## Slide 6: The End-to-End Pipeline

```
1. Install Figma MCP
   └─ claude mcp add --transport http figma https://mcp.figma.com/mcp

2. Share a Figma frame URL with Claude
   └─ "Generate a component from this frame: https://figma.com/file/..."

3. Specify your tech stack
   └─ "Use React 16 class components, Reactstrap, SCSS"

4. Claude extracts tokens (get_variable_defs)
   └─ Colors, spacing, typography → token mapping (requires Figma Variables)

5. Claude generates component (get_design_context)
   └─ React component using your specified tech stack

6. You review and refine
   └─ "Use our existing Card component from Reactstrap"
   └─ "Add i18n translation wrappers"

7. Integrate into your project
   └─ Place in correct directory, add routes, connect to API
```

**This is not a one-shot process.** Steps 5-6 iterate until the component matches your standards.

> **Speaker note:** Emphasize the iterative nature. The first generated output is rarely perfect — it's a 70-80% starting point. The review-refine loop is what makes it production-ready. This is the same principle from Session 1: "generated code is a starting point, not a finished product."

---

## Slide 7: Specifying Your Tech Stack — Why It Matters

Claude's default output from `get_design_context` is **React + Tailwind CSS + TypeScript**. If your project uses something different, you must tell Claude.

**energycorp uses:**
- React 16 (class components, no hooks)
- Reactstrap (Bootstrap 4 components)
- SCSS (Paper Dashboard template)
- `counterpart` for i18n
- Redux for language state only
- Axios for API calls

**Your project (fill in during the session):**
- React version: ___
- Component style: ___
- UI library: ___
- Styling approach: ___
- State management: ___
- i18n library: ___
- API client: ___

**Three ways to tell Claude your stack:**

1. **In the prompt** — Immediate, one-time
2. **In CLAUDE.md** — Permanent, every session
3. **In a rules file** — Detailed patterns

> **Speaker note:** This is one of the most common mistakes. Students will forget to specify their stack and get Tailwind + TypeScript output for a plain CSS + JavaScript project. Hammer this: "Always specify your tech stack. Put it in your CLAUDE.md and rules files so you don't have to repeat it every time."

---

## Slide 8: What Goes in Your Frontend Rules File

Create `.claude/rules/frontend-patterns.md` for your project:

```markdown
# Frontend Conventions

## Tech Stack
- React [version] with [class/functional] components
- [UI library] for base components
- [Styling approach] (CSS modules / SCSS / Tailwind / etc.)
- [State management] for global state
- [i18n library] for translations

## Component Structure
- All components go in [your directories]
- [Naming conventions]
- [Export patterns]

## Styling
- [Where style files live]
- [No Tailwind / no inline styles]

## When Generating from Figma
- Always use [UI library] components
- Follow structure of [example path]
```

**Why this matters for Figma-to-code:**
1. **Auto-loaded** — Claude reads this file at session start, no need to repeat
2. **Consistent output** — Every generated component follows your conventions
3. **Team-shared** — Committed to git, whole team benefits
4. **Builds on Session 2** — Same pattern as `testing.md` and `api-conventions.md`

> **Speaker note:** Bridge back to Session 2 — this is a rules file, just like the ones they created before. The pattern is the same; the content is frontend-specific.

---

## Slide 9: Why Generated Code Needs Review

In Session 1, we covered hallucinations — plausible but incorrect output. The same principle applies to Figma-to-code generation.

**Claude generates code from design data, not from understanding your project.** It reads a Figma frame and produces code that visually matches the design. But it doesn't inherently know:
- Your project uses React 16 class components (not hooks)
- Your team imports `Reactstrap` Card, not `@mui/material` Card
- Your i18n system uses `counterpart`, not `react-intl`
- Your SCSS follows Paper Dashboard conventions, not Tailwind utility classes

**Without constraints, Claude will generate valid code that doesn't fit your project.** The constraints come from three sources:
1. **Your prompt** (immediate, one-time)
2. **Your CLAUDE.md and rules files** (permanent, every session)
3. **Your examples** (showing Claude an existing component to follow)

The more constraints you provide, the closer the first output is to production-ready. But no matter how many constraints you provide, **always review**.

> **Speaker note:** This is the transition from "how to set up" to "how to work with the output." Now that they understand the pipeline and tech stack configuration, show them why the output still needs human oversight. Connect back to Session 1's hallucination concepts.

---

## Slide 10: The Review-Refine Workflow

This is the core workflow for using Figma-to-code generation productively:

```
Step 1: GENERATE
    Specify tech stack + share Figma URL
    Claude outputs component + styles
         ↓
Step 2: REVIEW
    Check: imports, patterns, dependencies,
    styling approach, component structure
         ↓
Step 3: REFINE
    Ask Claude to fix specific issues
    "Use Reactstrap Card", "Add i18n"
         ↓
Step 4: INTEGRATE
    Place in correct directory
    Add routes, connect to API
         ↓
Step 5: TEST
    Visual comparison with Figma
    Functional tests, responsive check
         ↓
    Does it match? ──No──→ Back to Step 3
         │
        Yes
         ↓
    Commit and PR
```

Usually 1-2 iterations gets you to production-ready.

> **Speaker note:** Walk through each step clearly. Emphasize the loop back from TEST to REFINE — this is normal, not a failure. The point is that each iteration gets closer. Compare to the manual workflow on slide 2: even with 1-2 refinement iterations, AI-assisted generation is still faster than manual implementation.

---

## Slide 11: The Review Checklist

After Claude generates a component, check these things in order:

**1. Imports — Are they real?**
- Does every imported package exist in `package.json`?
- Does every imported component exist in your project?
- Is the import path correct (relative vs absolute)?

**2. Component pattern — Does it match your project?**
- Class component vs functional component vs hooks?
- State management approach (local state, Redux, Context)?
- Export pattern (default export, named export, HOC wrapper)?

**3. Styling — Does it use your approach?**
- SCSS vs CSS modules vs Tailwind vs styled-components?
- Does it reference your existing style variables?
- Does it follow your naming conventions?

**4. Dependencies — Are they version-compatible?**
- Are API calls made the same way as existing components?
- Does it use your auth pattern?
- Does it handle errors the same way?

**5. Design fidelity — Does it match the Figma?**
- Colors, spacing, typography, border radius
- Responsive behavior (if specified in Figma)
- Component states (hover, active, disabled)

> **Speaker note:** Have students keep this checklist open during the hands-on lab. After Claude generates a component, walk through each check with them. They'll internalize it quickly.

---

## Slide 12: Common Pitfalls (1/2) — React Version & UI Library

### 1. React Version Mismatch

**The problem:** Claude generates hooks (`useState`, `useEffect`) in a project that uses class components, or uses React 18 features in a React 16 project.

**Example:**
```jsx
// Claude generated (React 18 pattern)
const StatusCard = () => {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData(); }, []);
  return <div>{data?.value}</div>;
};

// Your project expects (React 16 class component)
class StatusCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  componentDidMount() { this.fetchData(); }
  render() { return <div>{this.state.data && this.state.data.value}</div>; }
}
```

### 2. Wrong UI Library

**The problem:** Claude generates `<div className="flex p-4">` (Tailwind) when your project uses `<Card><CardBody>` (Reactstrap).

**Prevention:** Specify React version + component style in rules file. Reference an existing component: "Follow the pattern in `GetClients.jsx`."

> **Speaker note:** Show both code blocks side by side. Ask students: "Which one would break in the energycorp project?" Make it concrete — this isn't theoretical.

---

## Slide 13: Common Pitfalls (2/2) — i18n, Phantom Imports, Over-Engineering

### 3. Missing Internationalization

**The problem:** Claude generates hardcoded English strings: `<h3>Status</h3>` instead of `<Tr content="dashboard.status" />`.

**Prevention:** Add i18n requirements to your rules file.

### 4. Phantom Import

**The problem:** Claude imports a package that sounds right but isn't in your dependencies.

```jsx
import { DashboardCard } from '@bulksource/ui-components';  // Doesn't exist
```

**Prevention:** Ask Claude to "verify all imports exist in `package.json`" or list actual dependencies in a rules file.

### 5. Over-Engineering

**The problem:** Claude generates TypeScript interfaces, custom hooks, context providers, and design patterns when your project is simpler.

**Prevention:** Reference your existing code: "Match the complexity level of our existing components."

**All five pitfalls are preventable with a rules file + reference component.**

> **Speaker note:** After showing each pitfall, ask: "How would you prevent this?" Students should arrive at the same answer: rules files and reference components. Reinforce the pattern.

---

## Slide 14: Best Practices for Prompting

### Be Specific About Tech Stack
```
✗ "Generate a component from this Figma frame"
✓ "Generate a React 16 class component using Reactstrap and SCSS from this frame"
```

### Reference Existing Components
```
✗ "Make a card component"
✓ "Make a card component following the patterns in GetClients.jsx"
```

### Start With Individual Frames
```
✗ "Generate the entire dashboard page from this Figma file"
✓ "Generate just the StatusCard component from this specific frame: [URL]"
```

### Tell Claude Which Tokens to Use
```
✗ "Use appropriate colors"
✓ "Use --color-primary for action elements, --color-surface for backgrounds"
```

**Formula:** Specific tech stack + reference component + individual frames = better output.

> **Speaker note:** Go through each do/don't pair. For each one, ask students to explain *why* the specific version is better. They should connect it back to the constraints discussion from slide 9.

---

## Slide 15: Limitations to Know

Figma MCP is powerful but has real limitations:

| Limitation | Impact | Workaround |
|-----------|--------|------------|
| **Tokens need Figma Variables** | `get_variable_defs` returns nothing without them | Designers must create Variables manually |
| **`get_variable_defs` is scoped** | Only returns variables on selected layers | Select the right frames first |
| **Default tech stack** | Outputs React + Tailwind unless specified | Always specify your stack |
| **Code Connect needs paid plan** | Requires Figma Organization/Enterprise | Start without it; add later |
| **No animation conversion** | Figma transitions don't transfer | Add animations manually |
| **Generated code needs review** | May use wrong library versions | Review all imports and deps |

**The key principle:** Figma MCP excels at converting individual frames and extracting tokens. It does not replace architectural decisions or project-specific integration.

> **Speaker note:** Being honest about limitations builds trust. Students who expect magic will be disappointed; students who expect a strong starting point will be thrilled.

---

## Slide 16: Key Takeaways

1. **Figma MCP = direct design access** — No screenshots, no manual descriptions — Claude reads the design data
2. **Design tokens bridge design and code** — Primitives → Semantics → Components; quality depends on Figma Variables
3. **Always specify your tech stack** — Claude defaults to React + Tailwind + TypeScript — use rules files for consistency
4. **Review is mandatory, not optional** — Check imports, patterns, dependencies — the checklist makes output production-ready
5. **Five common pitfalls are all preventable** — Version mismatch, wrong UI lib, missing i18n, phantom imports, over-engineering
6. **Rules files + reference components save time** — One-time setup, permanent benefit; every minute of config saves ten of refinement

---

*Next: Hands-on lab — Figma MCP install, token extraction, component generation*
