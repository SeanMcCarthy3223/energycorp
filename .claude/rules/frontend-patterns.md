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
