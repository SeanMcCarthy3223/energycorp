# Lecture: Multi-Repo Context and MCP Architecture

**Duration:** 20–25 minutes
**Goal:** Understand how Claude Code extends beyond a single repository using `--add-dir` and the Model Context Protocol (MCP), with focus on GitHub MCP for backend teams.
**Presentation file:** `02_Multi_Repo_MCP_Architecture.pptx`

---

## Slide 1: Title

**Multi-Repo Context and MCP Architecture**
Backend Session 1 — Advanced User Track

> Speaker note: "In Sessions 1 and 2, everything we did was inside a single repository. That's fine for learning, but it doesn't match how most teams actually work. Today we break that boundary."

---

## Slide 2: The Multi-Repo Reality

Most backend teams live in a world where code is spread across multiple repositories or directory structures:

- **Backend repo** — Django REST API, models, business logic
- **Frontend repo** — React SPA, API client, components
- **Shared libraries** — Authentication, utilities, types
- **Infrastructure** — Docker, CI/CD, deployment configs
- **Documentation** — API specs, architecture decision records

When Claude Code can only see one repo, it operates like a developer who's never met the frontend team. It can write a Django view, but it has no idea how that view's response will be consumed.

**The result:** Claude guesses about API contracts, field names, response shapes, and URL patterns. Those guesses become hallucinations.

> Speaker note: "Show of hands — how many of you have had Claude generate an endpoint that didn't match what the frontend expected? That's exactly the problem we're solving."

---

## Slide 3: --add-dir Extends Claude's Vision

The `--add-dir` flag tells Claude Code to include additional directories in its file access scope:

```bash
# From your primary working directory
claude --add-dir ../frontend-repo
claude --add-dir ../frontend-repo --add-dir ../shared-libs

# Or mid-session
/add-dir /path/to/other/project
```

**What happens when you use --add-dir:**

```
┌─────────────────────────────────────────────────┐
│                  Claude Code                     │
│                                                  │
│   Primary Context          Additional Dirs       │
│   ┌──────────────┐     ┌──────────────────────┐  │
│   │  Backend/     │     │  Frontend/           │  │
│   │  ├── src/     │     │  ├── src/            │  │
│   │  │   ├── users│     │  │   ├── components/ │  │
│   │  │   ├── api/ │     │  │   ├── services/   │  │
│   │  │   └── ...  │     │  │   └── ...         │  │
│   │  └── tests/   │     │  └── package.json    │  │
│   └──────────────┘     └──────────────────────┘  │
│                                                  │
│   Claude can Read, Search, and Reference         │
│   files in ALL directories                       │
└─────────────────────────────────────────────────┘
```

**Key behaviors:**
- Claude can **read** files in all directories
- Claude can **search** across all directories with Glob and Grep
- Claude can **reference** files with `@` mentions from any directory
- File **edits** work in all directories (subject to permissions)
- CLAUDE.md files from additional directories are **not** loaded by default

> Speaker note: "The primary directory is where you launched Claude. That's your home base. Additional directories are like visiting another team's desk — you can see their work, but your desk is still your desk. CLAUDE.md files from additional directories won't load automatically. If you need them, set the environment variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`."

---

## Slide 4: --add-dir Patterns for Backend Teams

**Pattern 1: Separate repos, launched from backend**
```bash
cd ~/projects/backend-api
claude --add-dir ~/projects/frontend-app
```
Best for: Backend-focused work where you need to verify frontend consumption.

**Pattern 2: Launched from parent directory**
```bash
cd ~/projects
claude
# Claude sees both backend-api/ and frontend-app/ as children
```
Best for: Cross-cutting changes that affect both sides equally.

**Pattern 3: Monorepo with subdirectories**
```bash
cd ~/projects/monorepo/backend
claude --add-dir ../frontend --add-dir ../shared
```
Best for: Monorepos where each subdirectory acts like a separate project.

**Pattern 4: Persistent configuration**
```json
// .claude/settings.json
{
  "permissions": {
    "additionalDirectories": ["../frontend-app", "../shared-libs"]
  }
}
```
Best for: When you always need cross-repo access and don't want to type `--add-dir` every time.

> Speaker note: "Pattern 1 is what we'll use in the demo. Most of you will use Pattern 1 or Pattern 4. If your team has a monorepo, Pattern 3 is your friend."

---

## Slide 5: What Is MCP?

**MCP — Model Context Protocol** — is an open-source standard that connects AI applications to external tools and services. Think of it as **USB for AI**: a universal connector that lets Claude plug into any system that speaks the protocol.

```
┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌───────────┐
│          │    │            │    │              │    │           │
│   You    │───▶│ Claude Code │───▶│  MCP Client  │───▶│MCP Server │
│          │    │   (Host)   │    │  (Session)   │    │  (Tools)  │
│          │    │            │    │              │    │           │
└──────────┘    └────────────┘    └──────────────┘    └───────────┘
                                                           │
                                                           ▼
                                                    ┌───────────┐
                                                    │  External  │
                                                    │  Service   │
                                                    │ (GitHub,   │
                                                    │  Figma,    │
                                                    │  DB, etc.) │
                                                    └───────────┘
```

**The architecture:**
- **Host** — Claude Code (the application you interact with)
- **Client** — Manages 1:1 sessions with MCP servers
- **Server** — Exposes tools, resources, and prompts to Claude
- **Transport** — How they communicate: `stdio` (local process), `http` (remote service), or `sse` (deprecated — use `http` where available)

**What MCP servers provide:**
1. **Tools** — Functions Claude can call (e.g., `create_pull_request`, `search_code`)
2. **Resources** — Data Claude can read (e.g., repository contents, issue details)
3. **Prompts** — Pre-built templates that appear as slash commands

> Speaker note: "MCP is not Claude-specific. It's an open standard that any AI tool can implement. But Claude Code has the deepest integration. The key insight: MCP servers give Claude abilities it doesn't have natively. Without GitHub MCP, Claude can't create PRs. With it, PR creation is just another tool call."

---

## Slide 6: Installing and Managing MCP Servers

**Registration (one-time setup):**
```bash
# Remote MCP server (HTTP transport)
claude mcp add --transport http github https://api.githubcopilot.com/mcp

# Local MCP server (stdio transport) — database access via DBHub
claude mcp add --transport stdio dbhub -- npx -y @bytebase/dbhub@latest --transport stdio --dsn "postgres://user:password@localhost:5432/mydb"

# With environment variables
claude mcp add --transport stdio my-server --env API_KEY=xxx -- npx my-mcp-server
```

**Three scopes:**
| Scope | Location | Shared? |
|-------|----------|---------|
| **Local** | `~/.claude.json` | No (personal, all projects) |
| **Project** | `.mcp.json` | Yes (committed, team-wide) |
| **User** | User config | No (personal, all projects) |

**Management commands:**
```bash
claude mcp list              # See all registered servers
claude mcp get github        # Details for a specific server
claude mcp remove github     # Unregister a server
```

**In-session:**
- `/mcp` — View and manage MCP servers
- `/mcp` → select server → Authenticate (for OAuth-based servers)

> Speaker note: "For team projects, use `.mcp.json` in your repo so everyone gets the same MCP servers. For personal tools, register at the local scope. We'll use the remote GitHub MCP today — it's the fastest to set up. The DBHub example shows a local stdio server — it's the database MCP recommended in Claude Code's official docs. It supports PostgreSQL, MySQL, SQLite, and more through a single package. You can also pass `--readonly` to restrict it to SELECT queries, which is what you'd want for a production connection."

---

## Slide 7: GitHub MCP — Your Most-Used Backend MCP

The GitHub MCP server (`https://api.githubcopilot.com/mcp`) gives Claude direct access to GitHub's API. After registration and authentication, Claude can:

| Capability | Tool | Example Use |
|-----------|------|-------------|
| **Create PRs** | `create_pull_request` | "Create a PR for these changes" |
| **Read PRs** | `get_pull_request` | "What's in PR #42?" |
| **Review PRs** | `create_and_submit_pull_request_review` | "Review this PR for issues" |
| **Search code** | `search_code` | "Find all uses of this serializer" |
| **Create issues** | `create_issue` | "File a bug for this" |
| **Read issues** | `get_issue` | "What does issue #15 say?" |
| **List commits** | `list_commits` | "What changed this week?" |
| **Read files** | `get_file_contents` | "Show me the main branch version" |
| **Create branches** | `create_branch` | "Create a feature branch" |

**Why this matters for backend teams:**
- Create PRs without leaving the terminal
- Cross-reference issues when implementing features
- Search code across repos you don't have cloned locally
- Review PR diffs and leave comments programmatically

> Speaker note: "The GitHub MCP is the single most useful MCP for daily backend work. It replaces the context-switching loop of: write code → open browser → create PR → copy link → paste in Slack. Claude does it all in one flow."

---

## Slide 8: MCP Tool Search — Staying Efficient

When you have multiple MCP servers registered, the total number of tools can overwhelm Claude's context window. **MCP Tool Search** (available on Sonnet 4+ and Opus 4+) solves this:

```
Without Tool Search:
┌─────────────────────────────────────────┐
│ Context Window                          │
│ ┌─────────────────────────────────────┐ │
│ │ All MCP tool descriptions loaded    │ │
│ │ (potentially thousands of tokens)   │ │
│ └─────────────────────────────────────┘ │
│ ┌──────────────────┐                    │
│ │ Your actual code │ ← less room       │
│ └──────────────────┘                    │
└─────────────────────────────────────────┘

With Tool Search:
┌─────────────────────────────────────────┐
│ Context Window                          │
│ ┌──────────┐                            │
│ │ Tool     │ ← only loaded when needed  │
│ │ summaries│                            │
│ └──────────┘                            │
│ ┌──────────────────────────────────┐    │
│ │ Your actual code                 │    │
│ │ (much more room)                 │    │
│ └──────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

MCP Tool Search reduces context usage by up to **85%** by loading tool descriptions on-demand rather than all at once.

> Speaker note: "You don't need to configure this — it activates automatically when your tool descriptions exceed 10% of the context window. Just know that having many MCP servers registered won't slow Claude down."

---

## Slide 9: Figma MCP for Backend Teams

You might think Figma is a frontend concern. It's not.

When a designer creates a data table, card, or dashboard in Figma, they're implicitly defining an **API contract**:

```
Figma Frame: "User Profile Card"
┌─────────────────────────────┐
│  Avatar (image)             │     → implies: avatar_url field (string/URL)
│  Full Name                  │     → implies: full_name field (string)
│  Email                      │     → implies: email field (string)
│  Role Badge: "Admin"        │     → implies: role field (enum/choice)
│  Status: ● Active           │     → implies: is_active field (boolean)
│  Last Login: Feb 25, 2026   │     → implies: last_login field (datetime)
│  [Edit] [Deactivate]        │     → implies: PATCH + DELETE endpoints
└─────────────────────────────┘
```

**How backend teams use Figma MCP:**
1. Connect to Figma MCP (same setup as frontend team)
2. Point Claude at a Figma frame showing a data-heavy component
3. Ask: "What API fields does this design require?"
4. Claude extracts the implicit contract and suggests a Django serializer

This closes the gap between "what the designer drew" and "what the API returns."

> Speaker note: "You don't need to become a Figma expert. You just need to know that when the frontend team shares a Figma link, you can feed it to Claude and get the API contract it implies. We won't set up Figma MCP today — that's the frontend team's focus — but know that it exists and it's useful."

---

## Slide 10: The MCP Ecosystem

Beyond GitHub and Figma, popular MCP servers for backend teams include:

| MCP Server | Use Case | Transport |
|-----------|----------|-----------|
| **GitHub** | PRs, issues, code search | HTTP |
| **DBHub** (`@bytebase/dbhub`) | Query databases, inspect schemas (PostgreSQL, MySQL, SQLite, and more) | stdio |
| **Figma** | Extract API contracts from designs | HTTP |
| **Sentry** | Read error reports, stack traces | HTTP |
| **Slack** | Post updates, read channel history | HTTP |
| **Notion** | Read/write documentation | HTTP |
| **Brave Search** | Web search for documentation | stdio |

**Marketplaces to discover more:**
- Claude Code Marketplace (1,261+ servers as of early 2026)
- MCP.so (17,665+ servers as of early 2026)
- Claude Market (community-maintained GitHub repo — not an official Anthropic product; hand-curated, open-source)

> Speaker note: "Don't install everything at once. Start with GitHub MCP — that's the one you'll use daily. Add others as specific needs arise. Each MCP server you add should solve a concrete problem."

---

## Slide 11: How Multi-Repo Context and MCP Work Together

The real power comes from combining `--add-dir` with multiple MCPs:

```
Developer Workflow:  --add-dir + Figma MCP + GitHub MCP
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  1. Launch with --add-dir                                    │
│     Claude sees: Backend/ + Frontend/                        │
│                                                              │
│  2. Designer shares a Figma link for a new "Invoice Detail"  │
│     card. Paste the URL into Claude.                         │
│     ┌─ Figma MCP ─────────────────────────────────────────┐  │
│     │ Claude calls: get_design_context                     │  │
│     │ Claude extracts: field names, data types, actions    │  │
│     │ → invoice_number (string), amount_due (decimal),     │  │
│     │   due_date (date), status badge (enum),              │  │
│     │   [Pay Now] button → POST endpoint needed            │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                              │
│  3. Claude cross-references the existing code (--add-dir)    │
│     Claude reads: Django Invoice model + React services      │
│     Claude spots: missing "status" field on the serializer   │
│                                                              │
│  4. Implement the changes                                    │
│     Claude writes: Django serializer update + new view       │
│     Claude writes: React fetch call + component props        │
│     Both sides match — field names came from the same        │
│     Figma source of truth                                    │
│                                                              │
│  5. GitHub MCP creates the PR                                │
│     ┌─ GitHub MCP ────────────────────────────────────────┐  │
│     │ Claude calls: create_pull_request                    │  │
│     │ PR includes: both backend and frontend changes       │  │
│     │ Claude calls: get_issue → add_issue_comment          │  │
│     │ Issue updated with PR link + summary of changes      │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Without this combination:** Designer shares Figma link → you open Figma → manually read the fields → write the endpoint → switch to the frontend repo → write the fetch call → hope the field names match → open browser → create the PR → switch to the issue tracker → link them. Seven context switches, and a good chance the field names drift.

**With this combination:** One Figma URL, one prompt, one flow, one PR — and the API contract is grounded in the design, not guessed.

> Speaker note: "This is the workflow we're going to build in the lab. Notice how the Figma MCP feeds step 2 — Claude reads the design and extracts the data contract before writing a single line of code. That contract flows through to both the Django serializer and the React component. No more 'the frontend expected camelCase but the backend sent snake_case' bugs. The design is the single source of truth, and Claude carries it through the entire implementation."

---

## Slide 12: Current Limitations

Be aware of what multi-repo and MCP **cannot** do today:

| Limitation | Workaround |
|-----------|------------|
| No coordinated cross-repo PR creation (one PR per repo) | Create separate PRs, link them in descriptions |
| CLAUDE.md from `--add-dir` directories not loaded by default | Set `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` |
| Files from `--add-dir` don't appear in `@` autocomplete (confirmed bug, GitHub Issue #7412) | Type the full path manually (expected to be fixed in a future release) |
| No multi-repo support in remote/web sessions | Use local Claude Code CLI |
| MCP servers can be slow on first call | Warm up with a simple query first |
| MCP Tool Search requires Sonnet 4+ or Opus 4+ | Ensure you're on a current model |

> Speaker note: "These are real limitations. Don't let them surprise you in the lab. The workarounds are straightforward — mostly just knowing what to expect."

---

## Slide 13: Key Takeaways

1. **`--add-dir` makes Claude cross-repo aware** — essential when backend and frontend are separate
2. **MCP is USB for AI** — a universal connector between Claude and external services
3. **GitHub MCP replaces context-switching** — PRs, issues, code search from your terminal
4. **Figma MCP reveals API contracts** — designs imply data shapes backend teams need
5. **MCP Tool Search keeps context efficient** — thousands of tools without performance cost
6. **Combine `--add-dir` + MCP** for single-flow cross-repo development

> Speaker note: "Remember: Claude Code without multi-repo context is a developer who's never seen the frontend. Claude Code without MCP is a developer who can't create PRs. Today we fix both."
