# Figma File Setup Guide — EnergyCorp Demo

**Time to set up:** ~15 minutes
**Result:** A Figma file with Variables, Text Styles, and two components ready for the Session 3 demo

---

## Quick Start (Recommended)

### Option A: Import tokens via Tokens Studio plugin (~5 min)

1. Open Figma → Plugins → Search "Tokens Studio for Figma" → Install (free tier)
2. Open the plugin → Settings → Import → Load `tokens.json` from this directory
3. The plugin creates all color, typography, spacing, and sizing tokens automatically
4. Click "Create Styles" to push tokens into Figma's native Local Variables
5. Build the two components manually using the imported tokens (see Section 3 below)

### Option B: Manual setup (~15 min)

Follow Sections 1–3 below step by step.

---

## Section 1: Create Figma Variables (5 min)

Open your Figma file → right sidebar → **Local Variables** (grid icon) → **+ Create collection**

### Collection: "Colors"

Create these color variables. In Figma: + New variable → Color type → name it → paste hex.

| Variable Name | Hex Value | Description |
|---|---|---|
| `primary` | `#51CBCE` | Main brand teal |
| `success` | `#6BD098` | Green — active/positive |
| `info` | `#51BCDA` | Light blue — informational |
| `warning` | `#FBC658` | Yellow — caution |
| `danger` | `#EF8157` | Red/orange — error/destructive |
| `purple` | `#C178C1` | Accent purple |
| `orange` | `#F96332` | Accent orange |
| `white` | `#FFFFFF` | White |
| `black` | `#2C2C2C` | Near-black |
| `font-color` | `#66615B` | Base text |
| `muted` | `#A49E93` | Secondary/muted text |
| `gray-light` | `#E3E3E3` | Light borders |
| `gray-medium` | `#DDDDDD` | Input borders |
| `gray-dark` | `#9A9A9A` | Placeholder text |
| `bg-body` | `#F4F3EF` | Page background |
| `bg-card` | `#FFFFFF` | Card surface |

**Total: 16 color variables** — enough for the demo to show meaningful token extraction.

### Collection: "Spacing"

Create these number variables:

| Variable Name | Value | Description |
|---|---|---|
| `margin-sm` | `10` | Small margin |
| `margin-base` | `15` | Standard margin / card padding |
| `margin-lg` | `30` | Large section spacing |
| `padding-input` | `11` | Input padding |
| `padding-btn` | `11` | Button vertical padding |
| `padding-btn-h` | `22` | Button horizontal padding |
| `table-cell-v` | `12` | Table cell vertical padding |
| `table-cell-h` | `7` | Table cell horizontal padding |

**Total: 8 spacing variables.**

### Collection: "Radii"

| Variable Name | Value | Description |
|---|---|---|
| `radius-sm` | `3` | Small elements |
| `radius-base` | `4` | Inputs |
| `radius-card` | `12` | Cards |
| `radius-button` | `20` | Pill buttons |
| `radius-circle` | `999` | Avatars/icons |

**Total: 5 radius variables.**

### Collection: "Sizing"

| Variable Name | Value | Description |
|---|---|---|
| `icon-sm` | `32` | Small icon |
| `icon-md` | `40` | Medium icon |
| `stat-icon` | `56` | Status card icon circle |
| `input-height` | `40` | Input/button height |
| `avatar-sm` | `30` | Small avatar |

**Total: 5 sizing variables.**

**Grand total: 34 variables** — this gives a rich extraction result for the demo.

---

## Section 2: Create Text Styles (3 min)

Go to the canvas → create text layers → select each → right sidebar → **Style** (4 dots) → **+** to save as a style.

| Style Name | Font | Size | Weight | Line Height | Color |
|---|---|---|---|---|---|
| `Heading/H1` | Montserrat | 49px | Bold (700) | 1.35 | `#2C2C2C` |
| `Heading/H2` | Montserrat | 35px | Bold (700) | 1.35 | `#2C2C2C` |
| `Heading/H3` | Montserrat | 28px | SemiBold (600) | 1.35 | `#2C2C2C` |
| `Heading/H4` | Montserrat | 24px | SemiBold (600) | 1.35 | `#2C2C2C` |
| `Heading/H5` | Montserrat | 22px | SemiBold (600) | 1.35 | `#2C2C2C` |
| `Heading/H6` | Montserrat | 14px | SemiBold (600) | 1.35 | `#2C2C2C` |
| `Body/Regular` | Montserrat | 14px | Regular (400) | 1.5 | `#66615B` |
| `Body/Small` | Montserrat | 12px | Regular (400) | 1.5 | `#A49E93` |
| `Body/Mini` | Montserrat | 10px | Regular (400) | 1.5 | `#A49E93` |
| `Display/Number` | Montserrat | 28px | Bold (700) | 1.2 | `#2C2C2C` |
| `Label/Uppercase` | Montserrat | 12px | SemiBold (600) | 1.5 | `#A49E93` |
| `Table/Header` | Montserrat | 14px | Bold (700) | 1.5 | `#66615B` |

**Tip:** If Montserrat isn't available, use the "Add fonts" button in Figma or use Helvetica Neue as a fallback.

---

## Section 3: Build the Components (7 min)

### Component A: StatusCard

This is the primary component for the demo — a dashboard stat card with icon, value, and trend.

**Frame setup:**
1. Create frame → name it `StatusCard`
2. Size: **280 × 130 px**
3. Auto Layout: Vertical, padding 15px all sides, gap 8px
4. Fill: `bg-card` variable (#FFFFFF)
5. Corner radius: `radius-card` variable (12)
6. Effects → Drop Shadow: X=0, Y=6, Blur=10, Spread=-4, Color=#000000 at 15%

**Inner structure:**

```
StatusCard (Auto Layout: Vertical, pad 15, gap 8)
├── Content Row (Auto Layout: Horizontal, gap 15)
│   ├── Icon Circle
│   │   Frame: 56×56, fill `primary` variable, corner radius 999
│   │   └── Icon Text: "⚡" white, 24px, centered
│   └── Text Stack (Auto Layout: Vertical, gap 2)
│       ├── Label: "ACTIVE COUNTERS" — style Label/Uppercase
│       └── Value: "1,284" — style Display/Number
└── Trend Row (Auto Layout: Horizontal, gap 4)
    Border top: 1px solid `gray-light`
    Padding top: 8px
    ├── Trend Arrow: "↑ 12%" — 12px, color `success` variable
    └── Trend Text: "vs last month" — style Body/Small
```

**Make it a Component:**
- Select the frame → right-click → "Create Component" (or Ctrl/Cmd+Alt+K)
- Add Component Properties:
  - `iconColor` (variant): primary | success | warning | danger
  - `trendDirection` (variant): up | down | neutral
  - `icon` (text): swap the icon character
  - `title` (text): swap the label
  - `value` (text): swap the number
  - `trendText` (text): swap the trend description

**Apply variables:** Select the icon circle fill → click the variable icon → bind to `primary`. Select the card background → bind to `bg-card`. This is what makes `get_variable_defs` return results.

### Component B: DataTable

A card wrapping a header with search and a table of client rows with action buttons.

**Frame setup:**
1. Create frame → name it `DataTable`
2. Size: **800 × auto** (hug height)
3. Auto Layout: Vertical, padding 0, gap 0
4. Fill: `bg-card` variable (#FFFFFF)
5. Corner radius: `radius-card` variable (12)
6. Effects → Drop Shadow: same as StatusCard

**Inner structure:**

```
DataTable (Auto Layout: Vertical, pad 0, gap 0)
├── Header (Auto Layout: Horizontal, pad 15, space-between)
│   ├── Title Stack (Auto Layout: Vertical, gap 2)
│   │   ├── "Client List" — 16px SemiBold, color black
│   │   └── "Manage registered clients" — style Body/Small
│   └── Search Input
│       Frame: 220×40, corner radius 4, stroke gray-medium
│       └── "Search clients..." — placeholder text style
├── Table Header Row (Auto Layout: Horizontal, pad 12/7)
│   Fill: transparent
│   Stroke bottom: 1px gray-light
│   ├── "NAME" — style Table/Header, width 180
│   ├── "CONTRACT #" — style Table/Header, width 140
│   ├── "COUNTER" — style Table/Header, width 100
│   ├── "STATUS" — style Table/Header, width 100
│   └── "ACTIONS" — style Table/Header, width 120, align right
├── Table Row 1 (Auto Layout: Horizontal, pad 12/7)
│   Stroke bottom: 1px gray-light
│   ├── "Maria Silva" — Body/Regular bold, width 180
│   ├── "CTR-2024-0891" — Body/Regular, width 140
│   ├── "CNT-4521" — Body/Regular, width 100
│   ├── Badge: "Active" — 12px white on success bg, pad 2/12, radius 3
│   └── Action Buttons (Auto Layout: Horizontal, gap 4)
│       ├── View btn: 30×30 circle, fill info, "👁" white
│       ├── Edit btn: 30×30 circle, fill warning, "✎" white
│       └── Delete btn: 30×30 circle, fill danger, "✕" white
├── Table Row 2 (same structure, "João Santos", Active)
├── Table Row 3 (same structure, "Ana Ferreira", badge warning "Overdue")
├── Table Row 4 (same structure, "Carlos Mendes", badge danger "Suspended")
└── Table Row 5 (same structure, "Lucia Rodrigues", Active)
```

**Apply variables to these elements:**
- Card background → `bg-card`
- Badge fills → `success`, `warning`, `danger` variables
- Action button fills → `info`, `warning`, `danger` variables
- Text colors → `font-color`, `muted` variables
- Border colors → `gray-light` variable
- Input border → `gray-medium` variable
- Table cell padding → `table-cell-v` / `table-cell-h` variables

---

## Section 4: Final Checklist

Before the demo, verify:

- [ ] **34 variables** visible in Local Variables panel (16 colors + 8 spacing + 5 radii + 5 sizing)
- [ ] **12 text styles** visible in the Styles panel
- [ ] **StatusCard** component with variables applied to icon fill, card background, trend color
- [ ] **DataTable** component with variables applied to badge fills, button fills, borders
- [ ] Both components selected → Figma MCP `get_variable_defs` returns variables (test this!)
- [ ] File URL copied and ready to paste

### Testing the MCP extraction

Before the demo, run this in Claude Code to verify:

```
Read my Figma file at [URL] and extract all design variables using get_variable_defs.
```

You should see output listing your color, spacing, radius, and sizing variables with their values.

**If `get_variable_defs` returns empty:**
- Make sure you **selected** the components/frames before running the tool (it's selection-scoped)
- Variables must be **applied to layers** (bound via the variable icon in the fill/stroke/padding panel), not just defined
- Raw hex colors (not bound to a variable) won't appear in the output
- Check that variables are in the same file (not from a library reference)

---

## Tips for a Smooth Demo

1. **Pre-select the StatusCard** in Figma before asking Claude to extract tokens — `get_variable_defs` is selection-scoped
2. Keep the Figma file tab open so you can quickly switch to show what's selected
3. If token extraction is slow, have the `component-reference.html` file open as a visual backup
4. The `tokens.json` file in this directory is the expected output — compare Claude's extraction against it
5. If Figma authentication fails mid-demo, use the backup approach: paste the token values manually and focus on the component generation part instead
