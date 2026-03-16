# Learned Rules
Rules captured via /learn-fix. Review weekly. Promote approved rules
to .claude/rules/ or module-level CLAUDE.md files.

## Entry 2026-03-16T12:44:00-05:00

- **Category:** token-usage
- **File:** Frontend/src/components/ClientList/ClientList.scss
- **What was wrong:** Table header (`thead th`) used `var(--font-size-base, 14px)`, making headers the same size as — or smaller than — body text
- **What was fixed:** Changed to `var(--font-size-large, 18px)` so headers are visually distinct and prominent
- **Why:** Always use large font size variables (`--font-size-large`) for all table headers. Headers must be larger than body text to establish visual hierarchy.
- **Status:** pending
- **Author:** SeanMcCarthy3223

