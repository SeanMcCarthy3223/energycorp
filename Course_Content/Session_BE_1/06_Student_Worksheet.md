# Student Worksheet: Cross-Repo API Change on Your Codebase

**Duration:** 35–40 minutes (independent work)
**Goal:** Apply the multi-repo context and MCP workflow to your own Django + React project
**Prerequisites:** Completed the instructor-led lab on energycorp; your own backend and frontend repositories accessible locally

---

## Before You Start

Make sure you have:
- [ ] Claude Code installed and authenticated (`claude --version`)
- [ ] GitHub CLI installed and authenticated (`gh auth status`)
- [ ] Your backend repo cloned locally (note the path: `________________________`)
- [ ] Your frontend repo or directory accessible locally (note the path: `________________________`)
- [ ] A working branch created for this session's work

**If your backend and frontend are in the same repo:**
That's fine — you'll use `--add-dir` to point to the frontend subdirectory, or skip it if Claude can already see both.

---

## Exercise 1: Configure Project-Level Settings

### Context
Your Django project has the same sensitive areas as energycorp — migrations, environment files, database commands. Before using Claude on your codebase, you need safety rails.

### 1.1 Identify Your Sensitive Paths

Fill in the paths specific to your project:

| Sensitive Area | Your Project's Path |
|---------------|-------------------|
| Migration files | `_______/migrations/*.py` |
| Environment files | `________________________` |
| Django settings | `________________________` |
| manage.py location | `________________________` |
| Docker/deployment configs | `________________________` |

### 1.2 Create Your Settings File

Start a Claude Code session in your backend repo root:

```bash
cd /path/to/your/backend
claude
```

Ask Claude to create the settings file, adapting the template to your project:

```
Create a .claude/settings.json file for this Django project.

My project structure:
- Django manage.py is at: [YOUR MANAGE.PY PATH]
- Migration files are at: [YOUR MIGRATIONS PATH PATTERN]
- Environment files: [YOUR .ENV PATH]
- Django settings: [YOUR SETTINGS PATH]

Configure these permissions:

Deny:
- Editing migration files (*/migrations/*.py)
- Editing environment files (.env*)
- Editing Django settings files (**/settings.py)
- Running manage.py migrate, flush, or dbshell
- Running rm -rf
- Running any command with DROP TABLE
- Reading environment files (.env*)

Allow:
- Reading all Python, JavaScript, TypeScript, JSON, Markdown, HTML, and CSS files
- Running manage.py test
- Running manage.py check
- Running manage.py makemigrations --dry-run
- Running manage.py showmigrations
- Running pip list and pip show
- Running your linter: [ruff/flake8/pylint/black — whichever you use]
- Running pytest (if applicable)
```

### 1.3 Verify

- [ ] Settings file created at `.claude/settings.json`
- [ ] Deny list includes migration files, .env, settings.py, destructive commands, and `DROP TABLE`
- [ ] Allow list includes broad read access, safe management commands, and `pip list`/`pip show`
- [ ] `Read(.env*)` is in deny (blocks reading secrets, not just editing them)
- [ ] Glob patterns match your actual project structure (test with `ls` to confirm)

**Remember the permission evaluation flow:** Deny → Ask → Allow → Permission Mode fallback. Deny rules are checked first and are **absolute** — no other rule or manual approval can override a deny. Everything not covered by a deny or allow rule falls through to your permission mode (default mode asks before writes). This is why migrations and .env go in deny — there's no scenario where Claude should touch them.

Exit this Claude session before proceeding.

---

## Exercise 2: Register and Verify GitHub MCP

### Context
GitHub MCP turns GitHub into a tool Claude can call directly — creating PRs, reading issues, searching code.

### 2.1 Register

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

This registers at the **local** scope (`~/.claude.json`) by default — personal to you, available across all projects. If your team wants everyone to have it, add it to `.mcp.json` in the project root instead (project scope, committed and shared).

### 2.2 Verify Registration

```bash
claude mcp list
```

- [ ] `github` appears in the list with HTTP transport

### 2.3 Authenticate

Start a Claude session and authenticate:

```bash
claude
```

Then inside the session:

```
/mcp
```

Select `github` → Authenticate. Complete the OAuth flow in your browser.

**Note:** The GitHub MCP uses its own OAuth flow — this is separate from `gh auth login`. Even if you have `gh` authenticated, you still need to authenticate the MCP server.

### 2.4 Test the Connection

```
Can you access GitHub? List the 5 most recent commits on the main branch
of this repository.
```

- [ ] Claude successfully lists recent commits
- [ ] No authentication errors

**Note:** MCP servers can be slow on their first call while the connection warms up — that's normal. Subsequent calls will be faster.

---

## Exercise 3: Launch with Multi-Repo Context

### Context
If your backend and frontend are separate repos (or separate directories), you need `--add-dir` to give Claude cross-repo vision.

### 3.1 Launch

Exit any existing Claude session, then:

```bash
cd /path/to/your/backend
claude --add-dir /path/to/your/frontend
```

**If your frontend is a subdirectory of the same repo:**
```bash
cd /path/to/your/repo/backend-dir
claude --add-dir ../frontend-dir
```

**If they're the same repo and Claude can see both:**
```bash
cd /path/to/your/repo
claude
```

**Forgot to add a directory at launch?** You can add one mid-session:
```
/add-dir /path/to/other/project
```

### 3.2 Verify Cross-Repo Access

```
List the main directories in both the backend and frontend parts of this project.
Show me the directory structure of each.
```

- [ ] Claude lists files from the backend
- [ ] Claude lists files from the frontend (or frontend subdirectory)
- [ ] No "file not found" or "access denied" errors

**Important:** CLAUDE.md files from additional directories are **not** loaded by default. Claude won't pick up the frontend's CLAUDE.md rules. If you need them, set the environment variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` before launching.

### 3.3 Test @ Mention Navigation

Try referencing a file in each area:

```
Show me the contents of @[YOUR_MAIN_URLS_FILE] (e.g., @src/urls.py or @config/urls.py)
```

```
Show me the contents of @[YOUR_FRONTEND_ENTRY] (e.g., @../frontend/src/App.tsx)
```

- [ ] Both `@` references resolve correctly

**Known limitation:** Files from `--add-dir` directories don't appear in `@` autocomplete (GitHub Issue #7412). You'll need to type the full path manually. This is expected to be fixed in a future release.

---

## Exercise 4: Discover Your API Contracts

### Context
Before building anything new, understand what exists. Claude can trace the connections between your Django endpoints and your frontend API calls.

**Tip:** When you `@`-reference a file, Claude also loads any CLAUDE.md files from that file's directory hierarchy. For example, `@src/users/views.py` triggers loading of `src/users/CLAUDE.md`, `src/CLAUDE.md`, and the root `CLAUDE.md` — if they exist. This means module-level conventions activate automatically when you navigate into a directory.

### 4.1 Map Your API Endpoints

```
I want to understand the API contracts between the Django backend and
the frontend in this project.

1. Find the main URL configuration file (urls.py) and list all
   registered API route prefixes
2. For each app, read the views.py to understand what endpoints exist
3. Search the frontend code for API calls (look for fetch, axios,
   or your HTTP client library)
4. Show me which backend endpoints have matching frontend consumers

Present this as a table with columns:
Method | URL | Backend View | Frontend Consumer (file + line) | Match?
```

### 4.2 Save the API Map

```
Save this API mapping as a markdown file at docs/api-mapping.md
(or wherever your team keeps documentation).
```

### 4.3 Identify Gaps

Review the mapping:
- [ ] Are there backend endpoints with no frontend consumer? (Dead code?)
- [ ] Are there frontend API calls pointing to endpoints that don't exist? (Bugs?)
- [ ] Are there mismatches in field names or response shapes?

**Note what you find:**

```
Observations:
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________
```

---

## Exercise 5: Implement a New Django REST Endpoint

### Context
Choose a new endpoint that your project actually needs. If you can't think of one, use one of these generic options:

**Option A — Dashboard Summary:**
```
GET /api/dashboard/summary/
Returns aggregate counts and totals relevant to your application
```

**Option B — Search Endpoint:**
```
GET /api/search/?q=<query>&type=<model>
Returns search results across one or more models
```

**Option C — Health Check:**
```
GET /api/health/
Returns system status: database connectivity, service version, uptime
```

### 5.1 Define the Spec

Fill in the details of the endpoint you want to create:

| Field | Your Value |
|-------|-----------|
| HTTP Method | `____________` |
| URL Pattern | `____________` |
| App (new or existing) | `____________` |
| Response Fields | `____________` |
| Permission Required | `____________` |
| Models Involved | `____________` |

### 5.2 Choose Your Permission Mode

Before implementing, decide which permission mode to use:

| Mode | When to Use | How to Activate |
|------|------------|-----------------|
| **Default** | Safe approach — Claude asks before each write | Default behavior |
| **Accept Edits** | Faster — Claude writes without asking | Shift+Tab to toggle |
| **Plan** | Exploration only — Claude can't write at all | Shift+Tab × 2, or `/plan` |

**Recommended workflow:** Start in **default mode**. Review the first few changes Claude proposes. If you trust the pattern, press **Shift+Tab** to switch to **Accept Edits** for faster execution. Your deny rules are **always enforced** regardless of mode — Claude still can't edit migrations or .env files even in Accept Edits.

### 5.3 Ask Claude to Implement

Craft your prompt — be specific about the tech stack and patterns:

```
Create a new Django REST endpoint for this project:

[METHOD] [URL PATTERN]

It should return:
- [field 1]: [description]
- [field 2]: [description]
- [field 3]: [description]

Requirements:
- Create the serializer in [app]/serializers.py
- Create the view in [app]/views.py
- Register the URL in [app]/urls.py
- Use [permission class] for access control
- Follow the EXISTING code patterns in this project — read the existing
  views and serializers first to match conventions
- Use the same import style, class naming, and response format as existing code

Also show me what the frontend fetch/service call would look like,
matching the patterns in the frontend code at [path to frontend services].
```

### 5.4 Review the Generated Code

Check each file:

**Serializer:**
- [ ] Field types match the data (IntegerField, CharField, DecimalField, etc.)
- [ ] Follows existing serializer conventions in your project
- [ ] No unnecessary fields or missing fields

**View:**
- [ ] Correct base class (APIView, GenericAPIView, ViewSet — matching your project)
- [ ] Correct permission class applied
- [ ] Queries are correct (right model names, right field names, right filters)
- [ ] Imports are valid (correct app paths)

**URL Config:**
- [ ] URL pattern matches your spec
- [ ] Properly imported and registered
- [ ] Follows existing URL naming conventions

**Frontend Service Call (review, don't necessarily write to file):**
- [ ] Correct URL path
- [ ] Correct HTTP method
- [ ] Includes authentication header (if required)
- [ ] Matches existing frontend API patterns

---

## Exercise 6: Verify the Endpoint

### 6.1 Run Django Checks

```
Run manage.py check to verify the Django configuration is valid.
```

- [ ] No errors from `manage.py check`

### 6.2 Run Tests

```
Run the test suite to make sure nothing is broken.
```

- [ ] Existing tests still pass
- [ ] No import errors or configuration issues

### 6.3 (Optional) Write a Test

If you have time, ask Claude to write a test:

```
Write a test for the new [endpoint name] endpoint.
Put it in [app]/tests.py (or tests/test_[name].py if that's the project pattern).
Test:
- Authenticated request returns 200 with the expected fields
- Unauthenticated request returns 401 or 403
- Response field types are correct
Follow the existing test patterns in this project.
```

- [ ] Test file created
- [ ] Test passes when run

---

## Exercise 7: Create a PR via GitHub MCP

### 7.1 Commit and Push

```
Stage all the changes from this session.
Create a clear commit message that describes the new endpoint.
Push to a new feature branch.
```

### 7.2 Create the PR

```
Create a GitHub pull request for this branch.

Title: [short description of the endpoint]

Description should include:
- What the endpoint does
- The API spec (method, URL, request/response format)
- Which permission/auth is required
- How the frontend should consume it
- Any models or apps involved
```

### 7.3 Verify

- [ ] PR created successfully
- [ ] PR title is clear and concise
- [ ] PR description includes the API spec
- [ ] All changed files are included in the PR

**Your PR URL:** `____________________________________________`

---

## Exercise 8: Create an API Mapping Document

### Context
An API mapping document helps your team understand which backend endpoints serve which frontend features. This is especially valuable when backend and frontend developers work in separate repos.

### 8.1 Generate the Document

```
Create a markdown document at docs/api-mapping.md that contains:

1. A table of all API endpoints in this project:
   Method | URL | View | Permission | Frontend Consumer

2. For the endpoint we just created, include:
   - Full request/response specification
   - Example curl command
   - Example frontend fetch/axios call

3. A section listing any orphaned endpoints (backend without frontend consumer)
   or frontend calls without a matching backend endpoint

Format it as a clean reference document that a new developer could use
to understand the API surface.
```

### 8.2 Review

- [ ] Document covers all API endpoints (not just the new one)
- [ ] New endpoint has a complete specification
- [ ] Orphaned endpoints / mismatches are noted (if any)

### 8.3 Add to PR

```
Add the api-mapping.md file to our existing PR.
Stage it, commit with message "Add API mapping document", and push.
```

- [ ] API mapping document added to the PR

---

## Stretch Goals (If You Finish Early)

### Stretch 1: Add a Second Endpoint

Choose another endpoint from the options in Exercise 5 (or design your own). Create it, test it, and add it to the PR.

### Stretch 2: Cross-Repo Bug Hunt

```
Compare the Django API responses with what the frontend expects.
Are there any mismatches in:
- Field names (e.g., backend returns "user_name" but frontend expects "username")
- Field types (e.g., backend returns integer, frontend expects string)
- URL patterns (e.g., frontend calls /api/v2/ but backend only has /api/)
- Authentication headers (e.g., frontend sends Bearer token, backend expects Token)

Report any discrepancies you find.
```

### Stretch 3: Configure additionalDirectories

Instead of using `--add-dir` every time, persist it in settings. Choose the right scope:

**Project settings** (`.claude/settings.json`) — shared with your team (committed to the repo):
```json
{
  "permissions": {
    "additionalDirectories": ["../your-frontend-path"]
  }
}
```

**Local settings** (`.claude/settings.local.json`) — personal, not committed:
```json
{
  "permissions": {
    "additionalDirectories": [
      "../your-frontend-path",
      "~/notes/api-specs"
    ]
  }
}
```

Use project settings for directories everyone on the team needs. Use local settings for your personal directories (scratch folders, personal notes, etc.).

Restart Claude and verify cross-repo access works without the `--add-dir` flag.

### Stretch 4: Explore Another MCP

If your team uses databases, Sentry, or Slack:

```bash
# Example: DBHub — supports PostgreSQL, MySQL, SQLite, and more
# (add --readonly for production connections)
claude mcp add --transport stdio dbhub -- npx -y @bytebase/dbhub@latest --transport stdio --dsn "postgres://user:password@localhost:5432/mydb"

# Example: Sentry MCP
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**Where to discover more MCPs:**
- Claude Code Marketplace (1,261+ servers)
- MCP.so (17,665+ servers)

Start with GitHub MCP — that's the one you'll use daily. Add others as specific needs arise. Each MCP server you add should solve a concrete problem.

---

## Self-Assessment

### Understanding

Answer these questions in your own words:

1. What does `--add-dir` do, and why is it important for teams with separate repos? What limitation should you be aware of regarding CLAUDE.md files from additional directories?

```
Your answer: ________________________________________________
```

2. What is MCP, and how does GitHub MCP specifically help backend developers? What are the three scopes for MCP server registration?

```
Your answer: ________________________________________________
```

3. Why should migration files be in the `deny` list rather than just the `ask` behavior? What makes deny rules different from other permission rules?

```
Your answer: ________________________________________________
```

4. Describe the full permission evaluation flow. In what order are rules checked, and what happens when no rule matches?

```
Your answer: ________________________________________________
```

5. When you `@`-reference a file, what additional files does Claude load automatically? Why is this useful for project conventions?

```
Your answer: ________________________________________________
```

6. What are the three permission modes, and when would you use each? How do they interact with deny/allow rules?

```
Your answer: ________________________________________________
```

7. What's the difference between project settings (`.claude/settings.json`) and local settings (`.claude/settings.local.json`)? When would you use each?

```
Your answer: ________________________________________________
```

### Experience

Describe what you built:

```
New endpoint: ________________________________________________
App/module: ________________________________________________
What it returns: ________________________________________________
Permission class used: ________________________________________________
Any issues encountered: ________________________________________________
How you resolved them: ________________________________________________
```

### Confidence Rating

Rate your confidence (1 = not at all, 5 = completely):

| Skill | Rating (1–5) |
|-------|-------------|
| Configuring `.claude/settings.json` for a Django project | ____ |
| Understanding the permission evaluation flow (Deny → Ask → Allow → Mode) | ____ |
| Switching between permission modes (Default / Accept Edits / Plan) | ____ |
| Using `--add-dir` for multi-repo context | ____ |
| Registering and authenticating GitHub MCP | ____ |
| Understanding MCP scopes (local / project / user) | ____ |
| Using `@` mentions to reference files across repos | ____ |
| Asking Claude to create a Django REST endpoint | ____ |
| Reviewing Claude-generated code for correctness | ____ |
| Creating a PR via GitHub MCP | ____ |

### What to Bring to Session BE-2

For the next session (Hooks and Sub-Agents: Automate Testing + Security Review), you'll need:

- [ ] The `.claude/settings.json` file you created today (we'll add hooks to it)
- [ ] The endpoint you built (we'll use it to test PostToolUse hooks)
- [ ] Your linter of choice installed locally (Ruff, Flake8, or Black)
- [ ] pytest installed (if not already): `pip install pytest pytest-django`
- [ ] Familiarity with your test runner command (e.g., `python manage.py test` or `pytest`)

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `claude --add-dir ../frontend` | Launch with cross-repo context |
| `/add-dir /path/to/repo` | Add a directory mid-session |
| `claude mcp add --transport http github https://api.githubcopilot.com/mcp` | Register GitHub MCP (local scope) |
| `claude mcp list` | List registered MCP servers |
| `claude mcp remove github` | Unregister an MCP server |
| `/mcp` | Manage/authenticate MCP servers in-session |
| `@path/to/file.py` | Reference a file (also loads CLAUDE.md hierarchy) |
| `/config` | Open settings |
| `Shift+Tab` | Cycle permission modes (Default → Accept Edits → Plan) |
| `/plan` | Enter Plan Mode |
| `gh auth status` | Check GitHub CLI authentication |
| `gh pr view --web` | Open the PR in your browser |

### Key Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` | Load CLAUDE.md files from `--add-dir` directories |

### Permission Evaluation Order

```
Deny (absolute, checked first) → Ask → Allow → Permission Mode fallback
```

### Known Limitations

| Limitation | Workaround |
|-----------|------------|
| `@` autocomplete doesn't show `--add-dir` files (Issue #7412) | Type the full path manually |
| CLAUDE.md from `--add-dir` dirs not loaded by default | Set `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` |
| MCP servers slow on first call | Warm up with a simple query |
| No coordinated cross-repo PR creation | Create separate PRs, link in descriptions |
| MCP Tool Search requires Sonnet 4+ or Opus 4+ | Ensure you're on a current model |
