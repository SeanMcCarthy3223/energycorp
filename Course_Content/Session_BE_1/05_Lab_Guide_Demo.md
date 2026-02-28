# Lab Guide: Cross-Repo API Change on energycorp (Instructor-Led)

**Duration:** 20–25 minutes
**Format:** Instructor-led, students follow along
**Repo:** `energycorp` — Django REST API (`Backend/`) + React SPA (`Frontend/`)
**Prerequisites:** Claude Code installed, GitHub CLI authenticated, energycorp cloned

---

## Overview

In this instructor-led lab, we'll walk through the complete workflow together:

1. Configure project-level settings for the Django backend
2. Register GitHub MCP and verify the connection
3. Launch Claude with multi-repo context
4. Discover existing API contracts across Backend and Frontend
5. Implement a new Django REST endpoint
6. Verify and create a PR

Everyone should be working on their local copy of the energycorp repo.

---

## Step 1: Configure Project-Level Settings (3 minutes)

### The Concept

> "Before we start using Claude on our backend, we need to set up safety rails. Django has sensitive areas — migrations, environment files, database commands — that we don't want Claude touching without explicit permission."

### What We're Building

A `.claude/settings.json` file in the energycorp root that protects the Django project.

### Do It Together

1. Open Claude Code from the energycorp root:

```bash
cd /path/to/energycorp
claude
```

2. Ask Claude to create the settings file:

```
Create a .claude/settings.json file with these permission rules:

Deny:
- Editing any migration files (*/migrations/*.py)
- Editing .env files (.env*)
- Editing settings.py (**/settings.py)
- Running manage.py migrate, flush, or dbshell
- Running rm -rf
- Running any command with DROP TABLE
- Reading .env files

Allow:
- Reading all Python, JavaScript, JSX, JSON, Markdown, HTML, and CSS files
- Running manage.py test and manage.py check
- Running manage.py makemigrations --dry-run
- Running manage.py showmigrations
- Running pip list and pip show
- Running ruff check and pytest
```

3. Review the generated file together.

### Review the Output Together

The generated file should look like this (matching the patterns from the lecture):

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
      "Read(**/*.html)",
      "Read(**/*.css)",
      "Bash(python*manage.py*test*)",
      "Bash(python*manage.py*check*)",
      "Bash(python*manage.py*makemigrations*--dry-run*)",
      "Bash(python*manage.py*showmigrations*)",
      "Bash(pip list*)",
      "Bash(pip show*)",
      "Bash(ruff check*)",
      "Bash(pytest*)"
    ]
  }
}
```

Verify the settings file has:
- [ ] `deny` array with migration, .env, settings.py, destructive commands, and `DROP TABLE`
- [ ] `allow` array with broad read permissions and safe management commands
- [ ] Correct glob patterns (e.g., `*/migrations/*.py` not `migrations/*.py`)
- [ ] `Read(.env*)` in deny (blocks reading, not just editing)

### Key Teaching Moments

> "Notice that we denied `Read(.env*)` — not just `Edit(.env*)`. This prevents Claude from even reading your secrets. If Claude reads a `.env` file, those secrets enter the context window and could appear in logs or PRs. Deny the read, not just the write."

> "Remember the permission evaluation flow from the lecture: **Deny → Ask → Allow → Permission Mode fallback**. Deny rules are checked first and they are **absolute** — no ask rule, allow rule, permission mode, or even your manual approval can override a deny. That's why migrations and .env access go in deny — there's no situation where Claude should touch them without you doing it manually."

> "Everything not covered by a deny or allow rule — like creating new Python files, editing views, writing serializers — falls through to the Permission Mode fallback. In default mode, Claude will ask you before those operations. That's exactly the right behavior for code changes."

Exit this Claude session — we'll start a new one with `--add-dir`.

---

## Step 2: Register GitHub MCP (2 minutes)

### The Concept

> "GitHub MCP gives Claude the ability to interact with GitHub directly — creating PRs, reading issues, searching code. It's a one-time setup."

### Run the Command

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

### Verify

```bash
claude mcp list
```

You should see:

```
github: https://api.githubcopilot.com/mcp (http)
```

### Troubleshooting

| Issue | Fix |
|-------|-----|
| "Command not found" | Ensure Claude Code is installed: `claude --version` |
| Network error | Check internet connection; verify URL is accessible |
| Already registered | That's fine — the existing registration works |

---

## Step 3: Launch with Multi-Repo Context (2 minutes)

### The Concept

> "Now we launch Claude from the Backend directory but tell it to also see the Frontend. This gives Claude cross-repo vision — it can read Django views and React components in the same session."

### Launch

```bash
cd Backend
claude --add-dir ../Frontend
```

### Verify Multi-Repo Access

Inside the Claude session, type:

```
List the Django apps in src/ and the top-level React directories in ../Frontend/src/
```

Claude should list:
- **Backend apps:** users, energytransfers, contract, payments, bancks, commercial, reports
- **Frontend dirs:** assets, components, langs, layouts, routes, variables, views

### Authenticate GitHub MCP

```
/mcp
```

Select `github` → Authenticate. Follow the browser OAuth flow.

### Key Teaching Moments

> "If Claude can list files from both directories, your multi-repo context is working. If it can't see the Frontend, check the path — `../Frontend` is relative to where you launched Claude (the Backend directory)."

> "Important: CLAUDE.md files from the additional directory are **not** loaded by default. Claude won't pick up the Frontend's CLAUDE.md rules. If you ever need them, set the environment variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`. For backend work, you typically don't need this."

> "One known limitation: files from `--add-dir` directories won't appear in `@` autocomplete — that's a confirmed bug (GitHub Issue #7412). You'll need to type the full path manually, like `@../Frontend/src/App.js`. This is expected to be fixed in a future release."

---

## Step 4: Cross-Repo API Contract Discovery (5 minutes)

### The Concept

> "Before building anything new, let's see what already exists. Claude can trace the connection between Django endpoints and React fetch calls — showing us the full API contract."

### Discover Existing Contracts

Paste this prompt:

```
I want to understand the API contracts between the Django backend and React frontend.

1. Read @src/rest/urls.py to see all registered API route prefixes
2. For the users app, read @src/users/views.py and find the Login view
3. Then search the Frontend code (in ../Frontend/src/) for where the login
   API endpoint is called
4. Show me both sides: what the Django view returns and what the React
   code expects

Present this as a two-column comparison.
```

### Review the Output Together

Claude should show:

**Django side (users/views.py — Login view):**
- Endpoint: `POST /api/user/login/`
- Request: `{ id_user, password }`
- Response: `{ token, user_type, message }`

**React side (components/login/Login.jsx or similar):**
- Calls: `axios.post('/api/user/login/', { id_user, password })`
- Expects: `response.data.token`, `response.data.user_type`

### Key Teaching Moments

> "This is the power of multi-repo context. Without `--add-dir`, Claude would have to guess about the frontend. With it, Claude reads both codebases and gives you the real picture. Notice whether there are any mismatches — different field names, different URL paths, different response shapes."

> "Notice we used `@` to reference specific files. When you `@`-reference a file, Claude also loads any CLAUDE.md files from that file's directory hierarchy. So `@src/users/views.py` triggers loading of `src/users/CLAUDE.md`, `src/CLAUDE.md`, and the root `CLAUDE.md` — if they exist. This means module-level conventions activate automatically when you reference files in their directory. We'll build on this in a later session."

### Build an API Map

```
Now create a summary table of ALL API endpoints:
- Read the main urls.py and each app's urls.py
- For each endpoint show: Method, URL, View Class, Permission Required
- Mark which endpoints have corresponding React consumers in the Frontend

Format as a markdown table.
```

> "This is your API mapping document. Save it — you'll use it as a reference for the rest of this session and for your own project."

---

## Step 5: Implement a New Endpoint (8 minutes)

### The Concept

> "Now let's build something new. We'll create a dashboard summary endpoint for managers. Claude will follow the existing patterns because it can see all the existing code."

### Permission Mode Workflow

Before we start implementing, let's use the permission mode workflow from the lecture:

> "We'll start this in **default mode** — Claude will ask before each write. This is the safe approach for implementing new code. If after reviewing a few changes you trust the plan, you can press **Shift+Tab** to switch to **Accept Edits** mode for faster execution. Remember: your deny rules are **always enforced** regardless of mode — Claude still can't edit migrations or .env files even in Accept Edits mode."

### The Prompt

```
Add a new Django REST endpoint to the reports app:

GET /api/reports/dashboard-summary/

It should return a JSON response with:
- total_clients: count of Client objects from the users app
- total_active_contracts: count of Contract objects from the contract app
- unpaid_invoices: count of Invoice objects where stateInvoice=True
- total_revenue: sum of valuePayment from all Payment objects in the payments app

Requirements:
- Create a serializer in reports/serializers.py
- Create an APIView in reports/views.py
- Register the URL in reports/urls.py
- Use the AllowManager permission class (look at reports/permissions.py for the pattern)
- Follow the existing code patterns in this project

Also show me what a React service function would look like to call this endpoint,
using the same Axios patterns as the existing Frontend code.
```

### Review the Output Together

Walk through each file Claude modifies or creates:

**reports/serializers.py:**
- [ ] Uses `serializers.Serializer` (not ModelSerializer — there's no model)
- [ ] Fields match the spec: `total_clients`, `total_active_contracts`, `unpaid_invoices`, `total_revenue`
- [ ] Field types are appropriate (IntegerField for counts, DecimalField or FloatField for revenue)

**reports/views.py:**
- [ ] Uses `APIView` or `GenericAPIView` (matching existing patterns)
- [ ] Imports models from other apps: `Client`, `Contract`, `Invoice`, `Payment`
- [ ] Uses `AllowManager` permission class
- [ ] Queries are correct (`.count()`, `.filter()`, `.aggregate()`)

**reports/urls.py:**
- [ ] URL pattern matches spec: `dashboard-summary/`
- [ ] View is properly imported and connected

**React service (shown but not necessarily written to file):**
- [ ] Uses Axios (matching existing Frontend patterns)
- [ ] Calls the correct URL: `/api/reports/dashboard-summary/`
- [ ] Includes auth token header

### Key Teaching Moments

> "Notice how Claude imported models from other apps — `Client` from users, `Contract` from contract, `Invoice` from contract, `Payment` from payments. It knew to do this because it read the existing models. Without multi-repo context, Claude might have guessed wrong model names or import paths."

> "If you switched to Accept Edits mode during this step, notice how Claude wrote the files without prompting. But also notice what it **couldn't** do — if it had tried to edit a migration file, the deny rule would have blocked it regardless of mode. This is the layered safety model: permission modes control the default behavior, but deny rules are always absolute."

---

## Step 6: Verify and Create PR (5 minutes)

### The Concept

> "Always verify before committing. Run the Django checks, then create a PR using the GitHub MCP."

### Verify

```
Run python src/manage.py check to verify the Django configuration is valid.
Then run python src/manage.py test to make sure no existing tests break.
```

### Create the PR

```
Stage all the changes we made, commit them with a clear message,
push to a new branch called feature/dashboard-summary, and create
a GitHub pull request.

The PR should include:
- Title: "Add dashboard summary endpoint for manager view"
- Description with: what it does, the API spec, permissions used, and
  instructions for the frontend team on how to consume it
```

### Review the PR Together

If the GitHub MCP created the PR successfully:
- Open it in the browser: `gh pr view --web`
- Review the PR description
- Check that all files are included

### Troubleshooting

| Issue | Fix |
|-------|-----|
| `manage.py check` fails | Read the error — usually a missing import or typo |
| `manage.py test` fails | Check if existing tests were affected by the new imports |
| PR creation fails — no remote | Push manually: `git push -u origin feature/dashboard-summary`, then retry |
| PR creation fails — auth | Re-authenticate: `/mcp` → github → Authenticate |
| MCP server slow on first call | Normal behavior — make a simple query first to warm the connection |
| Claude edited migrations | Shouldn't happen if deny rules are configured; if it did, `git checkout -- */migrations/` |
| Claude asks permission for every file write | That's default mode working correctly — approve individually, or Shift+Tab to Accept Edits mode if you trust the plan |
| `@` autocomplete doesn't show Frontend files | Known bug (GitHub Issue #7412) — type the full path manually |

---

## Wrap-Up

### What We Built

1. **Settings file** — `.claude/settings.json` with Django-specific deny/allow rules and the permission evaluation flow (Deny → Ask → Allow → Permission Mode)
2. **GitHub MCP** — registered and authenticated via OAuth
3. **Multi-repo context** — `--add-dir` giving Claude cross-repo vision of Backend + Frontend
4. **API mapping** — table of all endpoints with frontend consumers, discovered via `@` mentions
5. **New endpoint** — `GET /api/reports/dashboard-summary/` with serializer, view, and URL config
6. **Permission mode workflow** — default mode for careful implementation, Accept Edits for trusted execution
7. **PR** — created via GitHub MCP with full description

### Key Concepts Applied

- **`--add-dir` makes Claude cross-repo aware** — essential when backend and frontend are separate
- **MCP is USB for AI** — GitHub MCP replaced the context-switching loop of browser + terminal
- **Deny rules are absolute** — migrations and .env are protected regardless of permission mode
- **`@` mentions load the CLAUDE.md hierarchy** — module-level conventions activate automatically
- **Permission modes complement rules** — Plan Mode for exploration, Default for implementation, Accept Edits for trusted execution

### What's Next

> "Now you'll do this same workflow on your own codebase. The student worksheet has exercises that walk you through each step. The repo is different, the endpoints are different, but the workflow is identical: configure → discover → implement → verify → PR."
