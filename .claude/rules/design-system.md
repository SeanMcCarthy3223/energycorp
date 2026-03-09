# EnergyCorp Design System Rules

Rules for translating Figma designs into production code for this project.

## 1. Token Definitions

Design tokens are defined as CSS custom properties in `Frontend/src/assets/css/design-tokens.css`, mapped from Figma variables (team library node `3314:1047`).

**Format:** `:root` CSS custom properties with `--` prefix, organized by category:

```css
/* Colors — Semantic */
--color-primary: #51cbce;    /* teal — primary actions, active states */
--color-success: #6bd098;    /* green — positive trends, confirmations */
--color-info:    #51bcda;    /* cyan — informational */
--color-warning: #fbc658;    /* yellow — caution */
--color-danger:  #ef8157;    /* red — errors, negative trends */
--color-purple:  #c178c1;
--color-orange:  #f96332;

/* Colors — Neutrals */
--color-body-bg:     #f4f3ef;  /* page background */
--color-surface:     #ffffff;  /* card/panel backgrounds */
--color-font:        #66615b;  /* body text */
--color-muted:       #a49e93;  /* secondary text */
--color-black:       #2c2c2c;  /* headings */
--color-gray-light:  #e3e3e3;  /* borders, dividers */
--color-gray-dark:   #9a9a9a;  /* disabled/placeholder */

/* Typography */
--font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
--font-size-base: 14px;  --font-size-medium: 16px;
--font-size-sm: 12px;    --font-size-xs: 10px;
--font-size-number: 28px; /* stat/metric values */
--font-weight-normal: 400; --font-weight-semi: 600; --font-weight-bold: 700;

/* Spacing */
--spacing-sm: 10px; --spacing-base: 15px; --spacing-lg: 30px;

/* Border Radius */
--radius-card: 12px; --radius-button: 20px; --radius-input: 4px;

/* Sizing */
--size-stat-icon: 56px; --size-icon-sm: 32px; --size-icon-md: 40px;

/* Shadows */
--shadow-card: 0px 6px 10px -4px rgba(0, 0, 0, 0.15);
```

**SCSS variables** are also defined in `Frontend/src/assets/scss/paper-dashboard/_variables.scss` and mirror the same values. The CSS custom properties in `design-tokens.css` are the canonical source for new components.

**Rules:**
- Always use `var(--token-name, fallback)` syntax with a hardcoded fallback matching the token value
- When Figma shows a hex color matching a token, use the token variable — never hardcode colors
- If a Figma value has no matching token, add a new token to `design-tokens.css` before using it

## 2. Component Library

**Location:** `Frontend/src/components/` (reusable) and `Frontend/src/views/` (page-level, organized by role).

**Architecture:** All components are **class-based** extending `React.Component`. No functional components or hooks.

```jsx
// Standard component pattern
import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

class MyComponent extends React.Component {
    render() {
        const { prop1, prop2 } = this.props;
        return (
            <Card className="card-stats">
                <CardBody>
                    <Row>
                        <Col xs={5} md={4}>{/* content */}</Col>
                        <Col xs={7} md={8}>{/* content */}</Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}
export default MyComponent;
```

**Key existing components:**
- `StatusCard` — stat cards with icon circle, value, trend indicator
- `Sidebar` — navigation sidebar with route-driven links
- `DemoNavbar` — header with language selector and logout
- `DashLayout` — page wrapper (sidebar + navbar + content + footer)
- `ProtectedRoute` — route guard by user role
- `GetBill` — public invoice lookup form

**No Storybook or component documentation** exists. Refer to component source files directly.

## 3. Frameworks & Libraries

| Layer | Technology | Version |
|-------|-----------|----------|
| Framework | React | 16.8.6 |
| UI components | Reactstrap | 8.0.0 (Bootstrap 4.3.1) |
| State management | Redux | 4.0.5 (react-redux 7.2.0) |
| Routing | React Router | 5.0.0 |
| HTTP | Axios | 0.19.2 |
| i18n | react-translate-component + counterpart | 0.15.1 / 0.18.6 |
| Maps | Leaflet + react-leaflet | 1.6.0 / 2.6.3 |
| Charts | Chart.js + react-chartjs-2 | 2.8.0 / 2.7.6 |
| Build | Create React App (react-scripts) | 3.0.1 |
| SCSS | node-sass | 4.12.0 |
| Testing | Jest + @testing-library/react | 9.5.0 |

**Critical:** Requires **Node 12** (v12.22.12). Newer Node versions break `node-sass` and `react-scripts`.

## 4. Asset Management

**Directory structure:** `Frontend/src/assets/`
- `css/` — Compiled CSS and design tokens
- `scss/` — SCSS source (Paper Dashboard theme partials)
- `fonts/` — Nucleo icon font files (eot, ttf, woff, woff2)
- `demo/` — Demo/example assets
- `github/` — GitHub-related assets

**Image imports:** Use ES module imports. Test mock returns `'test-file-stub'` via `__mocks__/fileMock.js`.

```jsx
import logo from "logo.png";
// ...
<img src={logo} alt="react-logo" />
```

**No CDN or asset optimization** pipeline. Images bundled via CRA's webpack config.

## 5. Icon System

**Library:** Nucleo Icons (custom icon font).

**Font files:** `Frontend/src/assets/fonts/nucleo-icons.*`

**SCSS definition:** `Frontend/src/assets/scss/paper-dashboard/_nucleo-outline.scss`

**Usage pattern:** CSS classes with `nc-icon` prefix:

```jsx
<i className="nc-icon nc-bank" />
<i className="nc-icon nc-diamond" />
<i className="nc-icon nc-globe" />
<i className="nc-icon nc-credit-card" />
<i className="nc-icon nc-pin-3" />
<i className="nc-icon nc-single-copy-04" />
```

**Naming convention:** `nc-icon nc-{icon-name}` — kebab-case icon names from the Nucleo set.

**When Figma shows an icon:**
1. Check if a matching Nucleo icon exists (browse the font or SCSS file)
2. If yes, use the `nc-icon` class
3. If no match, consider adding an SVG or inline icon — but prefer the existing icon font

## 6. Styling Approach

**Methodology:** Global SCSS (Paper Dashboard theme) + component-scoped SCSS + CSS custom properties.

**No CSS Modules, no styled-components, no CSS-in-JS.**

**Global styles:**
- `Frontend/src/assets/scss/paper-dashboard.scss` — main SCSS entry (imports 20+ partials)
- `Frontend/src/assets/css/paper-dashboard.css` — compiled output
- `Frontend/src/assets/css/design-tokens.css` — design tokens (imported in `index.js`)
- `Frontend/src/index.css` — app-specific overrides

**Component-scoped styles:**
- SCSS files colocated with components: `StatusCard/StatusCard.scss`
- Imported directly in the component: `import "./StatusCard.scss";`
- Use nesting and reference CSS custom properties with fallbacks

**Responsive design:**
- Bootstrap 4 grid via Reactstrap: `<Row>`, `<Col xs={} md={} lg={}>`
- SCSS responsive partials: `_responsive.scss`
- Breakpoints follow Bootstrap 4 defaults (576px, 768px, 992px, 1200px)

**Key CSS patterns:**
```scss
// Use design tokens with fallbacks
.my-element {
  color: var(--color-font, #66615b);
  font-size: var(--font-size-base, 14px);
  border-radius: var(--radius-card, 12px);
  box-shadow: var(--shadow-card, 0px 6px 10px -4px rgba(0, 0, 0, 0.15));
}

// Color variants via modifier classes
&.icon-primary   { background-color: var(--color-primary, #51cbce); }
&.icon-success   { background-color: var(--color-success, #6bd098); }
&.icon-warning   { background-color: var(--color-warning, #fbc658); }
&.icon-danger    { background-color: var(--color-danger, #ef8157); }
```

**Inline styles** are used sparingly for one-off layout tweaks (e.g., `style={{ marginTop: "2em" }}`). Prefer CSS classes.

**Animations:** `animate.css` classes (`animated fadeIn slow`, `animated zoomInDown`).

## 7. Project Structure

```
Frontend/src/
├── assets/
│   ├── css/          # design-tokens.css, paper-dashboard.css, index.css
│   ├── scss/         # Paper Dashboard SCSS source + partials
│   ├── fonts/        # Nucleo icon font files
│   └── demo/         # Demo assets
├── components/       # Reusable UI components
│   ├── auth/         #   Auth singleton, ProtectedRoute
│   ├── chatBot/      #   ChatBot component
│   ├── Footer/       #   Footer
│   ├── GetBill/      #   Public bill lookup
│   ├── login/        #   Login form
│   ├── Navbars/      #   DemoNavbar (header)
│   ├── Sidebar/      #   Navigation sidebar
│   ├── StatusCard/   #   Dashboard stat card
│   └── __tests__/    #   Shared component tests
├── langs/            # i18n translation files (es, en, pt)
├── layouts/          # Page layout wrappers
│   └── DashLayout.jsx
├── routes/           # Role-based route configs
│   ├── adminRoutes.js
│   ├── operatorRoutes.js
│   └── managerRoutes.js
├── views/            # Page-level components by role
│   ├── admin/        #   Admin pages + __tests__/
│   ├── operator/     #   Operator pages + __tests__/
│   └── manager/      #   Manager pages
├── App.js            # Root component, top-level routing
├── store.js          # Redux store (language reducer only)
├── index.js          # ReactDOM.render entry point
└── setupTests.js     # Jest test mocks
```

**Naming conventions:**
- **Components/Views:** PascalCase files and folders (`StatusCard.jsx`, `CreateClient.jsx`)
- **Routes/Config:** camelCase (`operatorRoutes.js`, `store.js`)
- **Styles:** kebab-case for SCSS partials (`_sidebar-and-main-panel.scss`), PascalCase for component SCSS (`StatusCard.scss`)
- **Tests:** `__tests__/ComponentName.test.js` or colocated `ComponentName.test.js`

**Route config pattern:**
```javascript
{
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/operator"
}
```

## 8. Figma-to-Code Translation Rules

When implementing a Figma design in this project:

1. **Use Reactstrap layout components** (`Container`, `Row`, `Col`, `Card`, `CardBody`, etc.) — never raw `<div>` grids
2. **Map Figma colors to design tokens** — find the closest `--color-*` variable
3. **Use class-based components** — no hooks, no functional components
4. **Connect to Redux** only if the component needs language state
5. **Add translations** to all three lang files (`spanish.js`, `english.js`, `portuguese.js`) for any user-visible text
6. **Use Nucleo icons** (`nc-icon nc-*`) when Figma shows icons
7. **Create component-scoped SCSS** in the component folder when custom styles are needed
8. **Reference design tokens** with `var(--token, fallback)` syntax in SCSS
9. **Follow the existing Card pattern** for dashboard widgets — use `Card > CardBody > Row > Col` structure
10. **Keep forms controlled** with `this.state` and `this.setState`
