# Lecture: Settings, @ Mentions, and Permissions for Backend Teams

**Duration:** 10–15 minutes
**Goal:** Configure Claude Code's settings and permissions specifically for Django backend development — protecting migrations, environment files, and destructive operations while enabling productive cross-repo work.
**Presentation file:** Slides included in `02_Multi_Repo_MCP_Architecture.pptx` (if combined) or standalone

---

## Slide 1: Why Backend Teams Need Specific Settings

In the New User sessions, we covered the 5-tier settings hierarchy. Now let's focus on what **backend teams specifically need to configure**.

Django projects have uniquely sensitive areas:

| Sensitive Area | Why It's Dangerous | What Could Go Wrong |
|---------------|-------------------|-------------------|
| `migrations/` | Auto-generated schema changes | Claude edits a migration, breaks the migration chain, corrupts database state |
| `.env` / `.env.*` | API keys, database credentials | Claude reads secrets, logs them, or includes them in a PR |
| `manage.py migrate` | Applies schema changes | Claude runs migrate on production database connection |
| `manage.py flush` | Deletes all data | Claude runs flush thinking it's cleanup |
| `settings.py` | Database URLs, secret keys | Claude modifies production settings |
| `Dockerfile` / `docker-compose` | Infrastructure config | Claude changes deployment configuration |

> Speaker note: "Every one of these has happened to someone. The settings system is your safety net. Let's configure it properly."

---

## Slide 2: Project-Level Settings for Django

Create `.claude/settings.json` in your project root:

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

**The principle:** Allow reads broadly, restrict writes narrowly, block destructive operations entirely.

> Speaker note: "Let's walk through this. The deny list blocks the dangerous operations we just discussed. The allow list permits safe read operations and non-destructive management commands. Everything else — like writing new Python files, editing views, creating serializers — falls through to the 'ask' behavior. Claude will ask you before doing those things. That's the right default for code modifications."

---

## Slide 3: The Permission Evaluation Flow

When Claude wants to use a tool, permissions are evaluated in this order:

```
Claude requests tool use
         │
         ▼
┌─────────────────┐
│ 1. Hooks         │  PreToolUse hooks run first
│    (if any)      │  Can block or allow
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Deny rules    │  Checked first — if matched, BLOCKED
│    (first match) │  No override possible
└────────┬────────┘
         │ (no match)
         ▼
┌─────────────────┐
│ 3. Ask rules     │  If matched, prompts user for approval
│    (first match) │  before proceeding
└────────┬────────┘
         │ (no match)
         ▼
┌─────────────────┐
│ 4. Allow rules   │  If matched, ALLOWED silently
│    (first match) │
└────────┬────────┘
         │ (no match)
         ▼
┌─────────────────┐
│ 5. Permission    │  Fallback when no rule matches
│    Mode          │  default → asks for writes
│                  │  plan → blocks all writes
│                  │  acceptEdits → allows writes
└────────┬────────┘
         │
         ▼
    User prompt
    (approve/deny)
```

**Key insight:** Rules are evaluated in order: **Deny → Ask → Allow**. The first matching rule wins. Deny rules **always** take priority. If you deny `Edit(*/migrations/*.py)`, no ask rule, allow rule, permission mode, or user approval can override it. This is your hard safety boundary. If no rule matches at all, the Permission Mode fallback applies.

> Speaker note: "This is important to understand. The evaluation order is Deny, then Ask, then Allow. Deny is absolute. If you put something in the deny list, Claude physically cannot do it — even if you try to approve it in the prompt. Ask rules prompt you before proceeding — useful for operations you want to allow case-by-case. Allow rules let things through silently. And if nothing matches, your Permission Mode is the final fallback. Migrations and .env access should be in deny because there's no situation where Claude should modify them without you doing it manually."

---

## Slide 4: Glob Patterns for Django Projects

Permission rules use **glob-style patterns**. Here are the patterns most useful for Django:

| Pattern | Matches | Use Case |
|---------|---------|----------|
| `*/migrations/*.py` | Any migration file in any app | Protect all migration files |
| `Backend/src/*/models.py` | Model files in all Django apps | Require approval for model changes |
| `**/*.py` | All Python files recursively | Broad read access |
| `.env*` | `.env`, `.env.local`, `.env.prod` | Block all environment files |
| `**/settings.py` | Settings file anywhere | Protect Django settings |
| `Backend/src/rest/*` | All files in the REST config | Protect project-level config |
| `**/tests/**` | All test files and directories | Allow free editing of tests |
| `Bash(python*manage.py*test*)` | Any test command variant | Allow running tests |

**Combining patterns:**
```json
{
  "allow": [
    "Edit(**/tests/**)",
    "Edit(**/test_*.py)"
  ],
  "deny": [
    "Edit(*/migrations/*.py)"
  ]
}
```

> Speaker note: "Notice we allow editing test files freely. Tests are safe to modify — they don't affect production. But model files and migrations are restricted. This is the balance: maximize Claude's productivity in safe areas, gate it in dangerous ones."

---

## Slide 5: @ Mentions for Django Navigation

The `@` symbol is your file reference shortcut inside Claude Code. For Django projects, these are the most useful patterns:

**Reference specific files:**
```
@Backend/src/users/models.py       — load the users models
@Backend/src/rest/urls.py          — see all API route registrations
@Backend/src/contract/views.py     — load contract views
@Backend/requirements.txt          — see all dependencies
```

**Reference directories (loads file listing):**
```
@Backend/src/users/                — see all files in the users app
@Backend/src/contract/migrations/  — see migration history
@Frontend/src/views/               — see React view components
```

**Reference across repos (with --add-dir):**
```
@../Frontend/src/components/auth/auth.js  — see frontend auth logic
@../Frontend/src/store.js                 — see Redux store
```

**Practical workflow — loading context before a task:**
```
Look at @Backend/src/users/models.py and @Backend/src/users/serializers.py.
Then create a new serializer for the Client model that includes
the nested Contract information.
```

> Speaker note: "The `@` mention is critical for Django work. Before asking Claude to create a new view, load the models and existing views first. This gives Claude the patterns to follow. Without `@` context, Claude falls back to its training data — which might use different Django conventions than your project."

---

## Slide 6: @ Mentions Load CLAUDE.md Hierarchy

An important behavior: when you `@`-reference a file, Claude also loads any CLAUDE.md files from that file's directory hierarchy.

```
@Backend/src/contract/views.py triggers loading:

  Backend/src/contract/CLAUDE.md     (if it exists)
  Backend/src/CLAUDE.md              (if it exists)
  Backend/CLAUDE.md                  (if it exists)
  ./CLAUDE.md                        (root, always loaded)
```

This means **module-level CLAUDE.md files activate automatically** when you reference files in their directory. You don't need to load them manually.

**Practical implication:** If you put Django view conventions in `Backend/src/contract/CLAUDE.md`, those rules will apply whenever Claude works on contract views — without cluttering your root CLAUDE.md.

> Speaker note: "This is a preview of Session 3, where we'll build a full module-level CLAUDE.md system. For now, just know that this hierarchy exists and it's powerful. Your root CLAUDE.md stays lean, and detailed conventions live close to the code they govern."

---

## Slide 7: Permission Modes for Different Workflows

Claude Code has five permission modes. Backend teams typically use three:

| Mode | When to Use | How to Activate |
|------|------------|-----------------|
| **default** | Normal development — asks before writes | Default behavior |
| **plan** | Exploring code, reading docs, planning features | Shift+Tab × 2, or `/plan` (commonly available but not officially documented) |
| **acceptEdits** | Executing a reviewed plan — trusted changes | Shift+Tab to toggle |

**Mode switching workflow:**

```
1. Start in Plan Mode
   → Claude reads code, plans approach
   → You review the plan

2. Switch to Default Mode (Shift+Tab)
   → Claude implements, asks before each write
   → You approve changes one by one

3. OR Switch to Accept Edits Mode (Shift+Tab again)
   → Claude implements without asking
   → Faster, but only do this after reviewing the plan
```

**Important:** Permission modes only affect tools **not covered by allow/deny rules**. Your deny rules are always enforced regardless of mode. Even in `acceptEdits` mode, Claude cannot edit migrations if they're in your deny list.

> Speaker note: "The typical flow is: Plan Mode to understand, Default Mode to implement carefully, Accept Edits for well-scoped tasks where you trust the plan. Never use `bypassPermissions` in production work — that's only for fully isolated sandbox environments."

---

## Slide 8: Persistent Configuration with additionalDirectories

If you always work across the same repos, add them to your settings instead of typing `--add-dir` every time:

```json
// .claude/settings.json (project-level, shared with team)
{
  "permissions": {
    "additionalDirectories": ["../frontend-app"]
  }
}
```

```json
// .claude/settings.local.json (personal, not committed)
{
  "permissions": {
    "additionalDirectories": [
      "../frontend-app",
      "../shared-libraries",
      "~/notes/api-specs"
    ]
  }
}
```

**Choosing the right scope:**
- **Project settings** (`.claude/settings.json`) — directories everyone on the team needs
- **Local settings** (`.claude/settings.local.json`) — your personal directories, not committed
- **User settings** (`~/.claude/settings.json`) — applies to all projects

> Speaker note: "If your team's frontend repo is always at `../frontend-app` relative to the backend, put it in project settings so every developer gets cross-repo context automatically. If you have personal scratch directories, use local settings."

---

## Slide 9: Putting It All Together — A Backend Team's Settings

Here's a complete `.claude/settings.json` for a Django backend team:

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
    ],
    "additionalDirectories": ["../frontend-app"]
  }
}
```

This configuration:
- **Blocks** migration edits, .env access, destructive database commands
- **Allows** reading all source files, running tests, running linters
- **Asks** for all other writes (new files, editing views, creating serializers)
- **Includes** the frontend repo for cross-repo context

> Speaker note: "This is your starting point. Copy it, adjust the paths for your project, and commit it to your repo. Every backend developer on your team gets the same safety rails. We'll build on this in Session BE-2 when we add hooks for automated testing."

---

## Slide 10: Key Takeaways

1. **Django projects have uniquely sensitive areas** — migrations, .env, settings.py, destructive commands
2. **Deny rules are absolute** — no override possible, use for hard safety boundaries
3. **Allow reads broadly, restrict writes narrowly** — maximize productivity, minimize risk
4. **@ mentions load the CLAUDE.md hierarchy** — module-level rules activate automatically
5. **Permission modes complement rules** — Plan Mode for exploration, Default for implementation
6. **additionalDirectories persists cross-repo access** — no need to type `--add-dir` every session

> Speaker note: "These settings are your foundation. Every session from here builds on this base. In BE-2, we add hooks. In BE-3, we add module-level CLAUDE.md files. In BE-4, we wire it all into a production pipeline."
