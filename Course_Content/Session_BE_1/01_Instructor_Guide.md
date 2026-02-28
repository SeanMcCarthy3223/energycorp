# Session BE-1: Instructor Guide

## Multi-Repo Context, MCPs, and Repo Configuration

| Field | Detail |
|-------|--------|
| **Duration** | 2 hours (120 minutes) |
| **Audience** | Backend developers (Django / Python) — Advanced User Track |
| **Demo Repo** | `energycorp` (Django REST + React SPA) |
| **Prerequisites** | Completed New User Track (Sessions 1–2); Claude Code installed and authenticated; Git + GitHub CLI (`gh`) configured; Python 3.9+ with pip; Node.js 18+ |
| **Track** | Backend Team — Session 1 of 4 |

---

## Session Overview

| Block | Topic | Duration | Format |
|-------|-------|----------|--------|
| 1 | Opening — Review Workflows and Pain Points | 5 min | Discussion |
| 2 | Lecture — Multi-Repo Context and MCP Architecture | 20–25 min | Presentation |
| 3 | Demo — Multi-Repo Setup with GitHub MCP | 20 min | Live Demo |
| 4 | Lecture — Settings, @ Mentions, and Permissions for Backend | 10–15 min | Presentation |
| 5 | Instructor-Led Lab — Cross-Repo API Change on energycorp | 20–25 min | Guided Hands-On |
| 6 | Independent Lab — Cross-Repo API Change on Your Codebase | 35–40 min | Student Worksheet |
| 7 | Wrap-Up and Q+A | 5–10 min | Discussion |

---

## Block 1 — Opening (5 minutes)

### Objectives
- Reconnect with the backend sub-team after the New User Track
- Surface real pain points around multi-repo workflows and API contracts
- Set the stage for MCP-driven automation

### Speaker Notes

**[0:00]** Welcome back.

> "You've completed two sessions where we covered CLAUDE.md, settings, hallucination prevention, skills, and hooks. Everything so far has been single-repo work. Today we're going to break that boundary."

**[0:02]** Guided discussion (3–4 questions):

- "When the frontend team needs a new endpoint, what does that handoff look like today?"
- "What's your process for keeping API contracts in sync?"

> "These are real problems that cost teams hours every week. Today we're going to show you how Claude Code can see across repos simultaneously and how MCPs give it superpowers — starting with GitHub."

### Materials
- Slide deck: `02_Multi_Repo_MCP_Architecture.pptx`
- Demo repo: `energycorp` checked out locally

### Transition
> "Let's start with the architecture. Understanding how multi-repo context and MCPs work will make the demo and lab much more productive."

---

## Block 2 — Lecture: Multi-Repo Context and MCP Architecture (20–25 minutes)

### Objectives
- Explain the `--add-dir` mechanism and mid-session `/add-dir` for cross-repo context
- Introduce the MCP protocol: what it is, architecture (Host → Client → Server), transport types
- Cover GitHub MCP setup, capabilities, and the three MCP scopes (local, project, user)
- Explain MCP Tool Search and how it keeps context efficient
- Show how backend teams extract API contracts from design specs via Figma MCP
- Survey the MCP ecosystem and where to discover more servers
- Cover current limitations and workarounds

### Speaker Notes

**[0:05]** Begin presentation.

> "There are two features that transform Claude Code from a single-repo assistant into a cross-repo development partner. The first is `--add-dir`, which extends Claude's file access to additional directories. The second is MCP — the Model Context Protocol — which connects Claude to external tools like GitHub, databases, and Figma."

Walk through the presentation slides. Key moments to emphasize:

**[0:08]** When covering `--add-dir`:
> "This is not just a convenience feature. When your Django views return data that React components consume, Claude needs to see both sides. Without `--add-dir`, it's guessing about the other repo — and we know what happens when Claude guesses. You can also add directories mid-session with `/add-dir /path/to/other/project` if you realize you need cross-repo access after launching."

> "One important behavior: CLAUDE.md files from additional directories are **not** loaded by default. Claude won't pick up the other repo's CLAUDE.md rules. If you need them, set the environment variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`."

**[0:14]** When covering MCP architecture:
> "MCP is an open standard. Think of it like USB for AI tools — a universal connector. The host is Claude Code, the client manages sessions, the server exposes tools. Transport types are stdio for local processes, HTTP for remote services, and SSE which is deprecated in favor of HTTP. The key insight: MCP servers give Claude abilities it doesn't have natively. GitHub MCP means Claude can create PRs, read issues, search code across repos — all without you copying and pasting."

**[0:17]** When covering MCP scopes:
> "MCP servers register at three scopes: local (`~/.claude.json`) for personal tools across all projects, project (`.mcp.json`) for team-wide configuration that gets committed, and user config for personal settings. For team projects, use `.mcp.json` in your repo so everyone gets the same MCP servers."

**[0:18]** When covering GitHub MCP:
> "This is the MCP server you'll use most. It turns GitHub into a first-class tool that Claude can call directly. Create PRs, read issue context, search code, review PR diffs — all from your terminal."

**[0:20]** When covering MCP Tool Search:
> "When you have multiple MCP servers registered, the total tool count can overwhelm Claude's context window. MCP Tool Search — available on Sonnet 4+ and Opus 4+ — solves this by loading tool descriptions on-demand, reducing context usage by up to 85%. You don't need to configure it — it activates automatically."

**[0:22]** When covering Figma MCP for backend teams:
> "You might think Figma is only for frontend. But when a designer creates a data table component, that table implies an API contract — what fields exist, what types they are, how they're sorted. Backend teams can use Figma MCP to extract those implicit contracts. We won't set it up today — that's the frontend team's focus — but know that it exists."

**[0:24]** When covering current limitations:
> "Be aware of what multi-repo and MCP cannot do today. No coordinated cross-repo PR creation, CLAUDE.md from `--add-dir` not loaded by default, files from `--add-dir` don't appear in `@` autocomplete — that's a confirmed bug, GitHub Issue #7412. These are real limitations. Don't let them surprise you in the lab."

### Materials
- Lecture file: `02_Lecture_Multi_Repo_MCP_Architecture.md`
- Presentation file: `02_Multi_Repo_MCP_Architecture.pptx`

### Transition
> "Now let's see this in action. I'm going to set up multi-repo context and GitHub MCP live, using our demo repo."

---

## Block 3 — Demo: Multi-Repo Setup with GitHub MCP (20 minutes)

### Objectives
- Live-configure GitHub MCP in Claude Code with OAuth authentication
- Explain MCP scopes (local, project, user)
- Launch Claude with `--add-dir` pointing to the frontend
- Demonstrate cross-repo search and API contract discovery
- Create a Django REST endpoint and show the React connection
- Create a PR via GitHub MCP

### Speaker Notes

**[0:25]** Begin demo.

> "I'm going to walk through exactly what you'll do in the lab. Watch the terminal — every command I type is something you'll replicate."

**[0:27]** Part 1 — Register GitHub MCP (3 min):
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

> "One command. We're telling Claude Code to connect to GitHub's MCP server over HTTP. The name 'github' is what we'll see in our MCP list."

Verify with `claude mcp list`.

> "This registered at the **local** scope — your personal `~/.claude.json`. If you wanted the whole team to have it, you'd put it in `.mcp.json` at the project root. There are three scopes: local (personal, all projects), project (`.mcp.json`, committed and shared), and user config (personal, all projects)."

Start a Claude session and authenticate:
```bash
claude
```
Then inside the session:
```
/mcp
```
Select the `github` server and follow the OAuth authentication flow in the browser.

> "MCP servers that need authentication — like GitHub — will prompt you the first time. This is a one-time OAuth flow. After this, Claude can call GitHub tools in every session. Note that the GitHub MCP uses its own OAuth — this is separate from `gh auth login`."

Verify authentication works by asking Claude to list recent issues or PRs.

> "Note that MCP servers can be slow on their first call while the connection warms up — that's normal."

Exit the session for the next part.

**[0:30]** Part 2 — Launch with multi-repo context (3 min):
```bash
cd Backend
claude --add-dir ../Frontend
```

> "Notice I'm starting from the Backend directory — that's my primary context. But I'm telling Claude it can also see the Frontend. This is exactly how you'd work if your backend and frontend are in separate repos. You can also add directories mid-session with `/add-dir /path/to/other/project`."

> "One thing to know: CLAUDE.md files from additional directories are **not** loaded by default. Claude won't pick up the Frontend's CLAUDE.md rules. If you need them, set the environment variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`. For most backend work, you don't need this."

Verify Claude can see both directories, then show `@` mention navigation for Backend and Frontend files.

> "One known limitation: files from `--add-dir` directories don't appear in `@` autocomplete — that's a confirmed bug (GitHub Issue #7412). You'll need to type the full path manually. It's expected to be fixed in a future release."

**[0:33]** Part 3 — Cross-repo API contract discovery (5 min):

Paste prompt:
```
I want to understand the Login API flow. Look at the Login view in
src/users/views.py, then search the Frontend code for where this API
endpoint is called. Show me both sides of the contract — what the
backend returns and what the frontend expects.
```

> "Watch how Claude reads the Django view, identifies the endpoint URL and response format, then searches the React code for the matching fetch call. It sees the full picture."

Walk through the output — the Django view returns `{ token, user_type, message }`, the React code expects `response.data.token` and `response.data.user_type`.

Then ask Claude to build an API endpoint mapping table showing all endpoints and their frontend consumers.

**[0:38]** Part 4 — Implement a new endpoint (5 min):

Paste prompt:
```
Add a new Django REST endpoint GET /api/reports/dashboard-summary/ that returns:
- total_clients (count of active clients)
- total_invoices (count of unpaid invoices)
- total_revenue (sum of paid invoice amounts)

Use the existing permission system (AllowManager). Include a serializer.
Then show me what the React fetch call would look like to consume this endpoint.
```

Walk through the generated code — serializer, view, URL config, and React service call. Point out how Claude followed existing patterns.

> "Notice how Claude followed the existing patterns. It didn't invent new conventions — it read the existing code and matched them. That's the benefit of multi-repo context."

Run the Django tests to verify nothing is broken.

**[0:43]** Part 5 — Create a PR via GitHub MCP (4 min):

Ask Claude to commit, push, and create a PR via the GitHub MCP.

> "Watch this carefully. Claude is calling the GitHub MCP tool — `create_pull_request` — to create the PR directly. No browser, no copy-paste."

Open the PR in the browser: `gh pr view --web`.

> "There's your PR. Created from the terminal, by Claude, using the GitHub MCP. The description includes the API spec, the permission model, and the frontend integration notes."

### Materials
- Demo script: `03_Demo_Script.md`
- Demo repo: `energycorp` (Backend + Frontend directories)

### Transition
> "Before we get hands-on, let's cover the settings and permissions model that controls how Claude operates across your Django apps."

---

## Block 4 — Lecture: Settings, @ Mentions, and Permissions for Backend (10–15 minutes)

### Objectives
- Deep-dive on `settings.json` for backend-specific configuration — sensitive areas and deny/allow patterns
- Explain the full permission evaluation flow: Deny → Ask → Allow → Permission Mode fallback
- Show glob patterns for Django project security
- Show `@` mention patterns for Django app navigation, including CLAUDE.md hierarchy loading
- Cover permission modes (default, plan, acceptEdits) and when to use each
- Introduce `additionalDirectories` for persistent cross-repo access

### Speaker Notes

**[0:45]** Begin second lecture.

> "In the New User sessions, we covered the 5-tier settings hierarchy at a high level. Now let's look at what backend teams specifically need to configure."

**[0:46]** Sensitive areas in Django projects:
> "Django projects have uniquely sensitive areas — migrations, .env files, settings.py, destructive management commands. Every one of these has bitten someone. The settings system is your safety net."

**[0:47]** Settings for backend:
> "Your project-level `.claude/settings.json` should include permission rules that protect your Django project. You don't want Claude accidentally modifying migration files, touching `.env`, or running `manage.py migrate` without your approval."

Show the full settings example:
```json
{
  "permissions": {
    "deny": [
      "Edit(*/migrations/*.py)",
      "Edit(.env*)",
      "Edit(**/settings.py)",
      "Bash(*manage.py*migrate*)",
      "Bash(*manage.py*flush*)",
      "Bash(*manage.py*dbshell*)",
      "Bash(rm -rf*)",
      "Bash(*DROP*TABLE*)",
      "Read(.env*)"
    ],
    "allow": [
      "Read(**/*.py)",
      "Read(**/*.js)",
      "Read(**/*.jsx)",
      "Read(**/*.json)",
      "Read(**/*.md)",
      "Bash(python*manage.py*test*)",
      "Bash(python*manage.py*check*)",
      "Bash(python*manage.py*makemigrations*--dry-run*)",
      "Bash(ruff check*)",
      "Bash(pytest*)"
    ]
  }
}
```

> "The principle: allow reads broadly, restrict writes narrowly, block destructive operations entirely. Notice we denied `Read(.env*)` — not just `Edit(.env*)`. This prevents Claude from even reading your secrets."

**[0:49]** Permission evaluation flow:
> "When Claude wants to use a tool, permissions are evaluated in this order: **Deny → Ask → Allow → Permission Mode fallback**. Deny rules are checked first and they are **absolute** — no ask rule, allow rule, permission mode, or even your manual approval can override a deny. That's your hard safety boundary. If no rule matches, your Permission Mode is the final fallback."

**[0:50]** @ mentions for Django:
> "The `@` symbol is your navigation shortcut. Type `@Backend/src/users/models.py` and Claude loads that file into context. This is especially useful when you want Claude to understand your model relationships before writing a new view."

Show patterns:
- `@Backend/src/users/models.py` — load a specific model
- `@Backend/src/rest/urls.py` — show all API routes
- `@Backend/src/contract/` — reference an entire Django app directory
- `@../Frontend/src/App.js` — reference files across repos with `--add-dir`

**[0:52]** @ mentions and CLAUDE.md hierarchy:
> "An important behavior: when you `@`-reference a file, Claude also loads any CLAUDE.md files from that file's directory hierarchy. So `@Backend/src/contract/views.py` triggers loading of `Backend/src/contract/CLAUDE.md`, `Backend/src/CLAUDE.md`, and the root `CLAUDE.md` — if they exist. Module-level conventions activate automatically when you reference files in their directory. This is a preview of a later session where we'll build a full module-level CLAUDE.md system."

**[0:53]** Permission modes:
> "Claude Code has three permission modes backend teams typically use. **Default mode** asks before writes — your normal development mode. **Plan mode** blocks all writes, for exploration and planning. **Accept Edits mode** allows writes without asking — only use after reviewing the plan. Switch between them with Shift+Tab. Important: your deny rules are always enforced regardless of mode. Even in Accept Edits, Claude cannot edit migrations."

**[0:55]** Persistent configuration with additionalDirectories:
> "If you always work across the same repos, persist it in settings instead of typing `--add-dir` every time. Use project settings (`.claude/settings.json`) for directories everyone on the team needs. Use local settings (`.claude/settings.local.json`) for personal directories that shouldn't be committed."

### Materials
- Lecture file: `04_Lecture_Settings_Permissions_Backend.md`
- Presentation file: Slides included in `02_Multi_Repo_MCP_Architecture.pptx` (settings slides) or standalone

### Transition
> "Now you know the architecture, you've seen it live, and you understand the safety controls. Time to build it yourself."

---

## Block 5 — Instructor-Led Lab: Cross-Repo API Change on energycorp (20–25 minutes)

### Objectives
- Students follow along as instructor builds a new endpoint on the demo repo
- Practice the full workflow: configure → discover → implement → verify → PR
- Apply the permission evaluation flow and permission mode workflow

### Speaker Notes

**[1:00]** Begin instructor-led lab.

> "Open your terminals. We're going to build this together, step by step. Everyone should be working on the energycorp repo."

Walk through each step from `05_Lab_Guide_Demo.md`:

**Step 1 — Configure project settings** (3 min)
> "First, let's set up our `.claude/settings.json` with backend-appropriate permissions. This protects our migrations and environment files."

> "Remember the permission evaluation flow: **Deny → Ask → Allow → Permission Mode fallback**. Deny rules are checked first and are **absolute** — no override possible. That's why migrations and .env go in deny."

**Step 2 — Register GitHub MCP** (2 min)
> "Run the MCP registration command. Then verify with `claude mcp list`. When we start our session, we'll authenticate via `/mcp` — the GitHub MCP uses its own OAuth flow, separate from `gh auth login`."

**Step 3 — Launch with multi-repo context** (2 min)
> "Start Claude from the Backend directory with `--add-dir ../Frontend`."

> "Remember: CLAUDE.md files from additional directories are **not** loaded by default. And files from `--add-dir` don't appear in `@` autocomplete — that's a confirmed bug (GitHub Issue #7412). Type the full path manually."

**Step 4 — Cross-repo discovery** (5 min)
> "Ask Claude to map the existing API endpoints. This is where `@` mentions and cross-repo search shine."

> "Notice that when you `@`-reference a file, Claude also loads any CLAUDE.md files from that file's directory hierarchy. Module-level conventions activate automatically."

**Step 5 — Implement a new endpoint** (8 min)
> "Now we'll ask Claude to create a new endpoint. Watch how it follows Django REST Framework patterns because it can see the existing code."

> "We'll start in **default mode** — Claude will ask before each write. If after reviewing a few changes you trust the plan, press **Shift+Tab** to switch to **Accept Edits** mode for faster execution. Remember: your deny rules are **always enforced** regardless of mode."

**Step 6 — Verify and create PR** (5 min)
> "Run `manage.py check` and `manage.py test`, verify the endpoint works, and create a PR via GitHub MCP."

**Common issues to watch for:**
- Students who haven't authenticated with GitHub (run `gh auth login` first, then also authenticate the MCP via `/mcp`)
- MCP OAuth authentication issues (the GitHub MCP uses its own OAuth flow, separate from `gh auth login`)
- MCP registration failures (check network access)
- `--add-dir` path issues (relative vs absolute paths)
- MCP server slow on first call (normal — warm up with a simple query)
- `@` autocomplete not showing Frontend files (known bug #7412 — type full path manually)
- Claude asking permission for every file write (that's default mode working correctly — use Shift+Tab for Accept Edits if trusted)

### Materials
- Lab guide: `05_Lab_Guide_Demo.md`
- Demo repo: `energycorp`

### Transition
> "Great work. Now it's your turn to do this on your own codebase. Switch to your BulkSource project and follow the student worksheet."

---

## Block 6 — Independent Lab: Cross-Repo API Change on Your Codebase (35–40 minutes)

### Objectives
- Students apply the same workflow to their own Django + React project
- Build a real endpoint that their frontend team can consume
- Apply the permission evaluation flow and permission modes
- Create a PR with API mapping documentation

### Speaker Notes

**[1:25]** Distribute worksheet.

> "The worksheet has 8 exercises. Each one builds on the last. If you get stuck, raise your hand — I'll circulate. The goal is to have a working PR by the end of this block."

**[1:30]** Circulate the room. Common issues:
- Students whose backend and frontend are in the same repo (they can skip `--add-dir` or point it to a subdirectory — the worksheet covers all three launch patterns)
- Students with non-standard Django project structures (help them adjust paths in their settings.json)
- GitHub MCP authentication issues (the MCP OAuth is separate from `gh auth login` — students need to authenticate via `/mcp` even if `gh` is already authenticated)
- CLAUDE.md from `--add-dir` directories not loading (set `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` if needed)
- `@` autocomplete not showing files from `--add-dir` (known bug #7412 — type full path manually)
- Permission mode confusion (remind students: Default asks before writes, Accept Edits allows writes silently, deny rules enforced regardless of mode)

**[1:50]** Five-minute warning:
> "Five minutes left. If you haven't created your PR yet, at minimum commit your changes and push. You can complete the PR after the session."

**[1:55]** Quick share-out:
> "Who wants to share what endpoint they created? Any surprises?"

### Materials
- Student worksheet: `06_Student_Worksheet.md`
- Students' own repositories (BulkSource)

---

## Block 7 — Wrap-Up and Q+A (5–10 minutes)

### Objectives
- Summarize key takeaways
- Preview Session BE-2 (Hooks and Sub-Agents for Testing + Security)
- Collect questions

### Speaker Notes

**[1:55]** Wrap up.

> "Let's recap what we covered today."

Key takeaways:
1. **`--add-dir` gives Claude cross-repo vision** — essential when backend and frontend are separate
2. **MCP is USB for AI** — a universal connector between Claude and external services
3. **GitHub MCP replaces context-switching** — PRs, issues, code search, all from your terminal
4. **Settings.json protects your Django project** — deny migrations, .env access, destructive commands
5. **Permission evaluation flow: Deny → Ask → Allow → Permission Mode** — deny is absolute, no override possible
6. **MCP Tool Search keeps context efficient** — thousands of tools without performance cost
7. **The workflow is: configure → discover → implement → verify → PR**

**[1:58]** Preview next session:

> "In Session BE-2, we'll automate what we did today. Instead of manually running tests after every change, hooks will do it automatically. Instead of eyeballing security, a sub-agent will scan every modification. We'll build a PreToolUse hook that blocks dangerous commands and a PostToolUse hook that runs Ruff and pytest after every file write."

**[2:00]** Q+A.

> "What questions do you have? Anything unclear about multi-repo context, MCPs, the permission evaluation flow, or the settings model?"

---

## Instructor Preparation Checklist

### Before the Session

#### Environment
- [ ] energycorp repo cloned with both `Backend/` and `Frontend/` directories
- [ ] Python 3.9+ installed with pip
- [ ] Node.js 18+ installed with npm
- [ ] Claude Code installed and authenticated (`claude --version`)
- [ ] GitHub CLI installed and authenticated (`gh auth status`)
- [ ] Git configured with push access to a test repository

#### Demo Preparation
- [ ] Run through the complete demo script (`03_Demo_Script.md`) end to end
- [ ] Verify GitHub MCP registration works: `claude mcp add --transport http github https://api.githubcopilot.com/mcp`
- [ ] Verify GitHub MCP OAuth authentication works: `/mcp` → github → Authenticate
- [ ] Verify `--add-dir` works: `cd Backend && claude --add-dir ../Frontend`
- [ ] Test that Claude can see files in both Backend and Frontend
- [ ] Verify `gh pr create` works from the demo repo
- [ ] Clear any previous MCP registrations that might conflict: `claude mcp list`
- [ ] Have the energycorp repo pushed to a GitHub remote (for PR creation)
- [ ] Pre-open `Backend/src/rest/urls.py` and `Backend/src/reports/views.py` in your editor for reference

#### Content
- [ ] Print or share `06_Student_Worksheet.md` with all students
- [ ] Prepare slide deck: `02_Multi_Repo_MCP_Architecture.pptx`
- [ ] Review `04_Lecture_Settings_Permissions_Backend.md` for the second lecture
- [ ] Have the energycorp codebase structure fresh in mind (review CLAUDE.md)

#### Student Prerequisites
- [ ] Confirm all students completed Sessions 1–2
- [ ] Confirm all students have Claude Code installed and authenticated
- [ ] Confirm all students have GitHub CLI installed (`gh auth login`)
- [ ] Confirm all students have their own backend + frontend repos accessible
- [ ] Send pre-session checklist to students (see below)

### Pre-Session Student Checklist (Send 24 Hours Before)

```
Session BE-1 Pre-Work
=====================
1. Confirm Claude Code is installed: claude --version
2. Confirm GitHub CLI is installed: gh auth status
3. Confirm you can access your backend repo from the terminal
4. Confirm you can access your frontend repo from the terminal
5. Have the paths to both repos ready (you'll need them in the lab)
6. If your backend and frontend are in the same repo, note the subdirectory paths
7. Review your Django project's URL configuration (urls.py) —
   you'll be adding a new endpoint
```

### Backup Plans

| If This Fails... | Do This Instead |
|-------------------|-----------------|
| GitHub MCP won't register | Use `gh` CLI directly in Claude Code bash commands; skip MCP-specific slides |
| GitHub MCP OAuth authentication fails | Re-run `/mcp` → github → Authenticate; note that MCP OAuth is separate from `gh auth login` |
| `--add-dir` has path issues | Have students open Claude from the parent directory containing both repos; or use absolute paths |
| Student has monorepo (no separate frontend) | Use `--add-dir` to point to a shared library or config directory; the worksheet covers this case |
| Network issues prevent MCP | Demo from pre-recorded terminal session; have students work locally |
| Student doesn't have Django project | Pair with another student; use energycorp as their practice repo |
| MCP server slow on first call | Normal behavior — warm up with a simple query first |

---

## Session Connections

### Builds On (Sessions 1–2)
- CLAUDE.md structure and best practices (Session 1)
- Settings.json 5-tier hierarchy (Session 1)
- Skills and MCP concepts (Session 2)
- Custom commands (Session 2)

### Leads To (Session BE-2)
- Hooks for auto-testing after every file write (PostToolUse)
- PreToolUse hooks for blocking dangerous commands
- Sub-agents for security scanning
- GitHub Actions integration with `claude-code-action`

### Cross-Track Connection (Frontend Session 1)
- Frontend team is learning Figma MCP in their parallel session
- API contracts extracted from Figma designs connect to backend endpoint design
- Shared GitHub MCP enables cross-team PR workflows
