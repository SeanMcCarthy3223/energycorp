---
name: context-audit
description: Audits how many lines and estimated tokens of markdown context are loaded into Claude's session. Shows a breakdown by loading trigger — startup, directory-scoped, path-scoped, and on-invoke.
allowed-tools: Bash, Read, Grep, Glob
---

# Context Audit

Analyze all markdown context sources that Claude Code loads and categorize them by **when** they are loaded. Produce a summary table showing lines and estimated tokens per source.

## Important: Loading semantics

Claude Code does NOT load all context at once. Each source has a specific loading trigger:

| Scope | When loaded | Examples |
|-------|-------------|---------|
| **startup** | Every session, immediately | Root `CLAUDE.md`, working-dir `CLAUDE.md`, additional-dir `CLAUDE.md`, global rules (no `paths:` frontmatter), `MEMORY.md` |
| **directory-scoped** | When Claude works with files in that directory | Nested `CLAUDE.md` files inside app subdirectories (e.g., `src/users/CLAUDE.md`) |
| **path-scoped** | When Claude edits files matching the glob in `paths:` frontmatter | Rules with `paths:` frontmatter (e.g., `paths: Backend/src/**/*.py`) |
| **on-invoke** | Only when the user invokes the skill/command | Skill body, command body. Only name+description are listed at startup. |

### Determining scope for CLAUDE.md files

- The **project root** `CLAUDE.md` → **startup** (always loaded)
- A `CLAUDE.md` in the **primary working directory** or an **additional working directory** (configured in `.claude/settings*.json` via `additionalDirectories`) → **startup**
- A `CLAUDE.md` nested deeper inside the tree (e.g., inside `src/users/`) → **directory-scoped** (loaded only when editing files in that directory)

To identify additional working directories, check settings files:

```bash
# Check for additionalDirectories in settings
grep -r "additionalDirectories" /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/.claude/settings*.json /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp/Backend/.claude/settings*.json 2>/dev/null
`` `

## Data collection

IMPORTANT: Exclude `.claude/worktrees/` paths from ALL searches — these are temporary copies and must not be counted.

### 1. CLAUDE.md files

```bash
find /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp -name "CLAUDE.md" -not -path "*/node_modules/*" -not -path "*/.claude/worktrees/*" | while read f; do
  lines=$(wc -l < "$f")
  chars=$(wc -c < "$f")
  echo "CLAUDE.md|$f|$lines|$chars"
done
`` `

Classify each result:
- Project root `CLAUDE.md` → startup
- Working directory `CLAUDE.md` (e.g., `Backend/CLAUDE.md` when launched from `Backend/`) → startup
- Additional directory `CLAUDE.md` (e.g., `Frontend/CLAUDE.md` if `../Frontend` is in `additionalDirectories`) → startup
- All others (e.g., `Backend/src/users/CLAUDE.md`) → directory-scoped

### 2. Rules files (.claude/rules/)

```bash
find /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp -path "*/.claude/rules/*.md" -not -path "*/node_modules/*" -not -path "*/.claude/worktrees/*" | while read f; do
  lines=$(wc -l < "$f")
  chars=$(wc -c < "$f")
  if head -10 "$f" | grep -q "^paths:"; then
    scope="path-scoped"
    paths_value=$(head -10 "$f" | grep -A1 "^paths:" | tail -1 | sed 's/^ *- *//')
  else
    scope="startup"
    paths_value=""
  fi
  echo "Rule|$f|$lines|$chars|$scope|$paths_value"
done
`` `

### 3. Skills (.claude/skills/*/SKILL.md)

Only name + description are listed at startup. The full skill body is loaded on-invoke.

```bash
find /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp -path "*/.claude/skills/*/SKILL.md" -not -path "*/node_modules/*" -not -path "*/.claude/worktrees/*" | while read f; do
  name=$(grep "^name:" "$f" | head -1 | sed 's/^name: *//')
  desc=$(grep "^description:" "$f" | head -1 | sed 's/^description: *//')
  combined="$name: $desc"
  chars=${#combined}
  total_lines=$(wc -l < "$f")
  total_chars=$(wc -c < "$f")
  echo "Skill|$f|$name|$desc|$chars|$total_lines|$total_chars"
done
`` `

### 4. Commands (.claude/commands/*.md)

Only the command name (filename) is listed at startup. Full body is loaded on-invoke.

```bash
find /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp -path "*/.claude/commands/*.md" -not -path "*/node_modules/*" -not -path "*/.claude/worktrees/*" | while read f; do
  cmd_name=$(basename "$f" .md)
  total_lines=$(wc -l < "$f")
  total_chars=$(wc -c < "$f")
  echo "Command|$f|$cmd_name|$total_lines|$total_chars"
done
`` `

### 5. Agents (.claude/agents/*.md)

Name + description from frontmatter are loaded at startup.

```bash
find /mnt/c/Users/seanm/Documents/Claude/Repos/energycorp -path "*/.claude/agents/*.md" -not -path "*/node_modules/*" -not -path "*/.claude/worktrees/*" | while read f; do
  name=$(grep "^name:" "$f" | head -1 | sed 's/^name: *//')
  desc=$(grep "^description:" "$f" | head -1 | sed 's/^description: *//')
  combined="$name: $desc"
  chars=${#combined}
  echo "Agent|$f|$name|$desc|$chars"
done
`` `

### 6. Memory (MEMORY.md)

```bash
f="/home/smc/.claude/projects/-mnt-c-Users-seanm-Documents-Claude-Repos-energycorp/memory/MEMORY.md"
if [ -f "$f" ]; then
  lines=$(wc -l < "$f")
  chars=$(wc -c < "$f")
  echo "Memory|$f|$lines|$chars"
fi
`` `

## Output format

### Detail table

Present ALL context sources in a single table, grouped by loading trigger:

`` `
| Scope            | Source Type | File / Name                          | Lines | Chars  | Est. Tokens |
|------------------|------------|--------------------------------------|------:|-------:|------------:|
| startup          | CLAUDE.md  | CLAUDE.md (root)                     |   100 |  5,266 |       1,317 |
| startup          | CLAUDE.md  | Backend/CLAUDE.md                    |   110 |  4,499 |       1,125 |
| ...              | ...        | ...                                  |   ... |    ... |         ... |
| directory-scoped | CLAUDE.md  | Backend/src/users/CLAUDE.md          |    21 |  1,061 |         265 |
| ...              | ...        | ...                                  |   ... |    ... |         ... |
| path-scoped      | Rule       | Backend/.claude/rules/api-conv...    |   127 |  4,674 |       1,169 |
| ...              | ...        | ...                                  |   ... |    ... |         ... |
| on-invoke        | Skill      | create-pr (282 chars name+desc)      |    49 |  2,800 |         700 |
| ...              | ...        | ...                                  |   ... |    ... |         ... |
`` `

- **Est. Tokens** = `chars / 4` rounded to nearest integer
- For skills/commands in the detail table, show the **full body** lines/chars (since that's what loads on invoke), but note the startup cost (name+desc chars) in the name column
- Sort rows: startup first, then directory-scoped, then path-scoped, then on-invoke

### Summary table

`` `
## Context Load Summary

| Loading Trigger          | Sources | Lines | Est. Tokens | When                                    |
|--------------------------|--------:|------:|------------:|-----------------------------------------|
| Startup (always)         |     xxx |   xxx |         xxx | Every session                           |
| Directory-scoped         |     xxx |   xxx |         xxx | When editing files in that app dir      |
| Path-scoped              |     xxx |   xxx |         xxx | When editing files matching glob        |
| On-invoke (name+desc)    |     xxx |   xxx |         xxx | Name+desc listed at startup             |
| On-invoke (full body)    |     xxx |   xxx |         xxx | Full body when user runs the skill/cmd  |
| **TOTAL at startup**     |     xxx |   xxx |         xxx |                                         |
| **TOTAL if everything**  |     xxx |   xxx |         xxx |                                         |
`` `

Add a note: "Token estimates use a 4-chars-per-token heuristic. Actual token counts vary by model tokenizer."