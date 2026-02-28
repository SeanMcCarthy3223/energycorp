# Presentation: Skills, Custom Commands & MCP Servers

**Duration:** 15-20 minutes
**Format:** Slide-by-slide content. Each section represents one slide or a small group of related slides.

---

## Slide 1: Title

**Extending Claude Code: Skills, Commands & MCPs**

Session 2 — Power Features & Automation

---

## Slide 2: The Extensibility Problem

Out of the box, Claude Code can read files, write code, and run commands.

**But your team has specific needs:**
- A specific way to run tests and report results
- A review process that checks for your project's common mistakes
- External tools: GitHub, Jira, Figma, databases, Slack

**Three mechanisms solve this:**

| Mechanism | Who Invokes It | Where It Lives | Best For |
|-----------|---------------|----------------|----------|
| **Custom Commands** | You type `/command` | `.claude/commands/` | Repeatable workflows |
| **Skills** | Claude decides automatically | `.claude/skills/` | Background intelligence |
| **MCP Servers** | Claude uses as needed | `.mcp.json` | External service access |

> **Speaker note:** Frame this as "teaching Claude your team's way of working." The mechanisms are different tools for different jobs — not alternatives to each other.

---

## Slide 3: Custom Slash Commands — Your Team's Playbook

Custom commands are **Markdown files that become slash commands**. They live in `.claude/commands/` and are shared via git.

**File structure:**
```
.claude/
  commands/
    test-backend.md        → becomes /test-backend
    review-file.md         → becomes /review-file
    deploy-check.md        → becomes /deploy-check
    frontend/
      component.md         → becomes /component (project:frontend)
```

**Example: `/test-backend.md`**
```markdown
---
description: Run Django tests and summarize results
allowed-tools: Bash, Read
---
Run the full backend test suite with `!python manage.py test`.
Report: total tests, pass/fail count, and details for any failures.
```

**Key features:**
- `$ARGUMENTS` — pass parameters: `/review-file Backend/src/users/views.py`
- `$1`, `$2` — positional params for multi-argument commands
- `!` prefix — execute shell commands inline
- `@` prefix — reference project files
- Subdirectories create namespaces

> **Speaker note:** This is the most immediately useful feature. If they remember one thing from this section, it should be: "If I type the same prompt twice, make it a command."

---

## Slide 4: Custom Commands — Practical Examples

### Pre-Deployment Check
```markdown
---
description: Verify project is ready to deploy
allowed-tools: Bash, Read, Grep
---
Run a pre-deployment checklist:
1. Run `!python manage.py test` — all tests must pass
2. Search for debug statements (`print()`, `console.log()`)
3. Verify no .env files are staged
4. Check migrations are up to date
5. Report as a pass/fail checklist
```

### Code Review with Context
```markdown
---
description: Review a file for common project issues
argument-hint: <file-path>
allowed-tools: Read, Grep, Glob
---
Review @$ARGUMENTS for:
- Import errors (packages not in requirements.txt or package.json)
- Missing error handling on API calls
- Permission checks on DRF views
- React version compatibility (we use React 16)
Present findings as a numbered list with severity (high/medium/low).
```

### Quick Documentation
```markdown
---
description: Generate API documentation for an endpoint
argument-hint: <app-name>
allowed-tools: Read, Grep
---
Read all views, serializers, and URLs in `Backend/src/$ARGUMENTS/`.
Generate API documentation in Markdown with:
- Endpoint URL and method
- Required permissions
- Request/response body examples
- Error codes
```

> **Speaker note:** Walk through each example briefly. The audience should see how commands encode their team's specific workflows.

---

## Slide 5: Skills — Claude's Automatic Instincts

Skills are like commands, but **Claude decides when to use them** based on the description.

**Structure:**
```
.claude/
  skills/
    security-check/
      SKILL.md             ← Required: instructions + frontmatter
      checklist.md         ← Optional: supporting files
```

**SKILL.md format:**
```yaml
---
name: security-check
description: Reviews code changes for security issues. Use when editing
  views.py, urls.py, or serializers.py files.
allowed-tools: Read, Grep, Glob
context: fork
---
When triggered, check the modified file for:
- SQL injection via raw queries
- Missing permission classes on views
- Unvalidated user input in serializers
- Exposed sensitive fields (passwords, tokens)
Report any findings inline.
```

**Key differences from commands:**
- **Model-invoked** — Claude reads the description and decides to use it
- **`context: fork`** — runs in an isolated sub-agent (doesn't pollute main context)
- **Composable** — Claude can chain skills with other actions
- **Hot-reload** — edit during a session without restarting

> **Speaker note:** Skills are more advanced than commands. For this session, the takeaway is: "Commands for things you trigger, skills for things Claude triggers." They'll build skills in a later session.

---

## Slide 6: MCP Servers — Connecting to External Services

MCP (Model Context Protocol) gives Claude access to **external tools, data, and services**.

**Architecture (simplified):**
```
You → Claude Code → MCP Client → MCP Server → External Service
                                      ↓
                              GitHub / Figma / DB / Slack / etc.
```

**Installing an MCP server:**
```bash
# GitHub (HTTP transport)
claude mcp add --transport http github https://api.githubcopilot.com/mcp

# PostgreSQL (stdio transport)
claude mcp add --transport stdio postgres -- npx -y @anthropic/pg-mcp-server

# Figma (HTTP transport)
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

**Three scopes:**
- **Local** (`~/.claude.json`) — personal, all projects
- **Project** (`.mcp.json`) — shared via git
- **User** — personal, all projects

**Managing MCP servers:**
- `claude mcp list` — see what's installed
- `claude mcp get <name>` — inspect a server
- `claude mcp remove <name>` — uninstall
- `/mcp` — manage in-session

> **Speaker note:** MCP is a deep topic. For this session, focus on the practical: install a server, use it. They don't need to understand the protocol architecture.

---

## Slide 7: MCP Servers — Popular Options for Your Stack

| Server | What It Does | Install Command |
|--------|-------------|-----------------|
| **GitHub** | PRs, issues, repo search, code review | `claude mcp add --transport http github https://api.githubcopilot.com/mcp` |
| **Figma** | Design-to-code, extract design tokens | `claude mcp add --transport http figma https://mcp.figma.com/mcp` |
| **PostgreSQL** | Query databases, inspect schemas | `npx -y @anthropic/pg-mcp-server` |
| **Brave Search** | Web search with better results | `npx -y @anthropic/brave-mcp-server` |
| **Sentry** | Error tracking, exception details | Via Sentry MCP package |
| **Notion** | Read/write documentation | Via Notion MCP server |
| **Slack** | Send messages, read channels | Via Slack MCP server |

**MCP Tool Search:**
When you have many MCP servers installed, Claude dynamically loads tools on-demand instead of loading all at once — reducing context usage by up to **95%**.

**Discovery:**
- Claude Code Marketplace: 1,261+ servers
- MCP.so: 17,665+ servers
- `claude mcp search <keyword>` — search from CLI

> **Speaker note:** For BulkSource, GitHub MCP is the most immediately useful. If they use Figma for design, that's the second priority. Don't overwhelm with options — pick 1-2 that match their workflow.

---

## Slide 8: How They Work Together

**Scenario: "Review my PR before merging"**

```
You type: /review-pr 42

1. Custom Command (.claude/commands/review-pr.md)
   → "Fetch PR #42 and review the changes"

2. MCP Server (GitHub)
   → Claude calls GitHub MCP to fetch PR diff, comments, CI status

3. Skill (.claude/skills/security-check/)
   → Claude notices the PR touches views.py
   → Automatically invokes security-check skill

4. Result:
   → Combined review: code quality + security findings + CI status
   → All from one command
```

**The pattern:**
- **Commands** define *what* to do (the workflow)
- **MCPs** provide *access* to external data
- **Skills** add *automatic intelligence* to any workflow

> **Speaker note:** This composition is the key insight. Each mechanism is simple alone; together they're powerful.

---

## Slide 9: Rules Files — Scaling Your Team's Knowledge

In Session 1 you created a CLAUDE.md — your project's instructions for Claude. But CLAUDE.md should stay **under 80 lines**. Your team has more conventions than that.

**Rules files** are modular Markdown files in `.claude/rules/` that load automatically alongside CLAUDE.md.

```
.claude/
  rules/
    testing.md              ← QA lead owns this
    api-conventions.md      ← Backend team owns this
    frontend-patterns.md    ← Frontend team owns this
    security.md             ← Security lead owns this
```

**How they differ from CLAUDE.md:**

| | CLAUDE.md | Rules Files |
|---|-----------|-------------|
| **Location** | Project root | `.claude/rules/*.md` |
| **Scope** | Whole project overview | Specific topic/domain |
| **Ownership** | One file, everyone edits | Different files, different owners |
| **Merge conflicts** | Likely with many contributors | Rare — separate files |
| **Best for** | Project description, build commands, architecture | Detailed conventions, team standards |

**Subdirectory CLAUDE.md** files provide even deeper context:
- `Backend/src/contract/CLAUDE.md` — only loads when Claude works in that directory
- Zero overhead for work elsewhere; full depth where needed

**How rules files fit the extensibility picture:**
- **CLAUDE.md** = project identity (what the project is)
- **Rules files** = team conventions (how to work in it)
- **Commands** = repeatable workflows (what to do)
- **Skills** = automatic intelligence (when to do it)
- **MCPs** = external access (where to get data)

> **Speaker note:** Rules files bridge CLAUDE.md and the extensibility features. Students created CLAUDE.md in Session 1; now they'll split conventions into team-owned files. Emphasize the merge-conflict-free ownership model — this is critical for a 22-person team.

---

## Slide 10: Getting Started — Priority Order

**For your team, start with:**

1. **Custom commands** (today's lab)
   - `/test` — run your test suite
   - `/review-file <path>` — focused code review
   - `/deploy-check` — pre-deployment checklist

2. **MCP server: GitHub** (today's lab or homework)
   - PR management from Claude Code
   - Issue tracking integration

3. **Rules files** (today's lab)
   - `.claude/rules/testing.md`
   - `.claude/rules/api-conventions.md`

4. **Skills** (Session 3+)
   - Auto-review on file changes
   - Custom agents for your domain

> **Speaker note:** Give them a clear priority. Commands first (immediate value), MCPs second (external access), rules files to scale (team coordination), skills later (they need more experience first).

---

## Slide 11: Key Takeaways

1. **Custom commands = reusable prompts** — if you type it twice, make it a command
2. **Skills = automatic instincts** — Claude decides when to use them
3. **MCPs = external access** — GitHub, Figma, databases, and 17K+ more
4. **They compose** — commands trigger workflows, MCPs provide data, skills add intelligence
5. **Share via git** — `.claude/commands/` and `.mcp.json` are committed to the repo; the whole team benefits

---

*Next: Live demo of Skills, Commands & MCPs on the energycorp project*
