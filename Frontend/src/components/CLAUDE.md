# Frontend Components

Reusable UI components shared across admin, operator, and manager views.

## Conventions

- **Class-based only** — all components extend `React.Component`. No functional components, no hooks.
- **Reactstrap 8.0** (Bootstrap 4) for layout and UI: `Card`, `Row`, `Col`, `Button`, etc.
- **SCSS** colocated with components (e.g., `StatusCard/StatusCard.scss`). Uses Paper Dashboard theme.
- **Design tokens** via CSS custom properties: `var(--color-primary, #51cbce)` with hardcoded fallbacks.
- **Icons:** Nucleo icon font — `<i className="nc-icon nc-icon-name" />`
- **i18n:** `counterpart` + `react-translate-component` for all user-visible text.
- **State:** `this.state` in constructor, arrow function handlers, Redux only for language state.
- **Tests:** `__tests__/` subfolder, Jest + `@testing-library/react`.
