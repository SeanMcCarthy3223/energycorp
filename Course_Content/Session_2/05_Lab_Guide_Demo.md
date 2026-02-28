# Lab Guide: Instructor-Led Demo — Power Features on energycorp

**Duration:** 20-25 minutes (instructor-led portion)
**Repo:** energycorp
**Goal:** Build custom commands, configure hooks, set up rules files, and (optionally) create a custom sub-agent — all live, together.

---

## Prerequisites

Before starting, verify:
- [ ] Claude Code CLI installed (`claude --version`)
- [ ] energycorp repo cloned and clean
- [ ] `.claude/` directory exists with `commands/`, `skills/`, `rules/` subdirectories
- [ ] Git configured for commits

If directories don't exist:
```bash
cd /path/to/energycorp
mkdir -p .claude/commands .claude/skills .claude/rules .claude/agents
```

---

## Step 1: Create a Custom Slash Command (5 min)

### The Command

We'll create a `/deploy-check` command that runs a pre-deployment verification checklist.

### Build It Together

> **Instructor says:** "Let's create our first team command. This one runs a deployment readiness check."

Create the file `.claude/commands/deploy-check.md`:

```markdown
---
description: Pre-deployment checklist — verifies tests, debug statements, and migrations
allowed-tools: Bash, Read, Grep
---
Run a pre-deployment checklist for the energycorp project:

1. **Tests**: Run `!cd Backend && python src/manage.py test` — report pass/fail
2. **Debug statements**: Search for `print(` in all Python files under Backend/src/ (exclude migrations and manage.py). Search for `console.log(` in all JS/JSX files under Frontend/src/.
3. **Environment files**: Check if any `.env` files exist that might be accidentally committed
4. **Migrations**: Run `!cd Backend && python src/manage.py showmigrations` — check for unapplied migrations

Present results as a checklist:
- [x] for passing checks
- [ ] for failing checks with details on what needs fixing
```

### Test It

Launch Claude Code and run:

```
/deploy-check
```

> **Instructor says:** "Watch Claude work through each check. This is a repeatable workflow. Every developer on the team types `/deploy-check` and gets the same checks. No one forgets a step."

Walk through the output together. Discuss any findings.

### Create a Second Command (with arguments)

Create `.claude/commands/explain-app.md`:

```markdown
---
description: Explain a Django app's models, views, and URL structure
argument-hint: <app-name>
allowed-tools: Read, Grep
---
Read the following files for the `$ARGUMENTS` Django app in Backend/src/:
- models.py
- views.py
- serializers.py
- urls.py

Provide a concise summary:
1. **Models**: List each model with its fields and relationships
2. **Views**: List each view/viewset with its HTTP methods and permissions
3. **URLs**: List each URL pattern and what view it maps to
4. **Serializers**: List each serializer and which model it serves

Keep the summary under 50 lines.
```

Test it:

```
/explain-app users
```

> **Instructor says:** "Now any new team member can type `/explain-app payments` and get an instant overview of that module. This is especially powerful for onboarding."

---

## Step 2: Configure a PostToolUse Hook (5 min)

### The Hook

We'll add an auto-test hook that runs Django tests every time Claude modifies a file.

### Build It Together

> **Instructor says:** "Now let's set up the automation. This hook guarantees tests run after every file edit — no exceptions."

Open `.claude/settings.json` and add the hooks configuration:

```json
{
  "permissions": {
    "allow": [
      "Bash(python src/manage.py test)",
      "Bash(python src/manage.py makemigrations)",
      "Bash(python src/manage.py migrate)",
      "Bash(python src/manage.py showmigrations)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(*DROP TABLE*)",
      "Bash(*--force*)",
      "Bash(*manage.py flush*)"
    ]
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR/Backend\" && python src/manage.py test 2>&1 | tail -20"
      }]
    }]
  }
}
```

> **Instructor says:** "The `matcher` says: only fire when Claude uses the Write or Edit tools. The command runs Django tests and pipes through `tail -20` so Claude gets just the summary, not hundreds of lines of output."

### Test the Hook

Restart Claude Code (to pick up the new settings), then ask Claude to make a small change:

```
Add a __str__ method to the Client model in Backend/src/users/models.py
that returns the client's user name.
```

> **Instructor says:** "Watch what happens after Claude edits the file. The hook fires automatically — tests run without us asking. If they fail, Claude sees the output and can fix it immediately."

Wait for the edit and the hook to trigger. Show the test output appearing in the conversation.

### Discuss the Self-Correcting Loop

> **Instructor says:** "This creates a feedback loop: Claude edits → tests run → if tests fail, Claude sees why → Claude fixes → tests run again. This loop continues until tests pass. You don't have to type 'run the tests' after every change — it's automatic."

---

## Step 3: Set Up Rules Files (5 min)

### The Problem

> **Instructor says:** "Our CLAUDE.md is about 60 lines. That's close to the recommended limit. But we have more conventions to document — testing standards, API patterns, security rules. Instead of bloating CLAUDE.md, we'll use rules files."

### Build the Rules Directory

Create `.claude/rules/testing.md`:

```markdown
# Testing Conventions

- All new endpoints must have at least one test covering the success case
- Test names follow the pattern: `test_<action>_<condition>_<expected>`
- Example: `test_login_valid_credentials_returns_token`
- Use Django's `TestCase` for database tests, `SimpleTestCase` for pure logic
- Always test permission enforcement: verify unauthorized users get 403
- Run tests from Backend/ directory: `python src/manage.py test`
```

Create `.claude/rules/api-conventions.md`:

```markdown
# API Design Conventions

- All ViewSets must set `permission_classes` explicitly
- Permission types: AllowAdmin (type 1), AllowManager (type 2), AllowOperator (type 3)
- Serializers must use explicit `fields` lists, never `fields = '__all__'`
- All list endpoints should support filtering where practical
- URL pattern: /api/<app-name>/<resource>/ (plural nouns)
- Response format for errors: `{"message": "...", "code": <http_code>, "data": {}}`
```

> **Instructor says:** "Both files load automatically — same priority as CLAUDE.md. Now let's verify Claude sees them."

### Verify Rules Loading

Ask Claude:

```
What testing conventions should I follow in this project?
```

> **Instructor says:** "Claude should reference the testing.md rules file. It loaded automatically because it's in `.claude/rules/`."

### Team Ownership Model

> **Instructor says:** "Here's the team workflow: your backend lead owns `api-conventions.md`. Your QA lead owns `testing.md`. Your security person owns `security.md`. Each person maintains their file, commits it to git, and there are no merge conflicts because they're separate files."

---

## Step 4: (Optional) Create a Custom Sub-Agent (3-5 min)

If time allows, create a code review sub-agent.

### Build It

Create `.claude/agents/reviewer.md`:

```yaml
---
name: reviewer
description: Reviews code changes for quality and security issues. Use proactively after completing edits.
tools: Read, Grep, Glob
model: sonnet
---
You are a code reviewer for a Django REST + React project (energycorp).

When reviewing code changes, check for:

1. **Correctness**: Do imports exist? Do model fields match the schema?
2. **Security**: Are permission classes set? Is input validated?
3. **Patterns**: Does the code follow DRF conventions (ViewSets, Serializers)?
4. **Tests**: Are there tests for new functionality?

Format your review as:
- CRITICAL: [issue] — must fix before merge
- WARNING: [issue] — should fix, not blocking
- INFO: [observation] — nice to know

Be concise. Only flag real issues.
```

### Test It

Ask Claude:

```
Review the recent changes in users/models.py using the reviewer agent.
```

> **Instructor says:** "The sub-agent runs in its own context. Its analysis doesn't consume our main conversation's context window. When it's done, we get just the summary."

---

## Step 5: Review the Complete Structure (2 min)

Show the final `.claude/` directory:

```
.claude/
  commands/
    deploy-check.md          ← /deploy-check
    explain-app.md           ← /explain-app <app-name>
  skills/
    django-check/
      SKILL.md               ← Auto-invokes on model/view edits
  rules/
    testing.md               ← Testing team conventions
    api-conventions.md       ← API team conventions
  agents/
    reviewer.md              ← Code review sub-agent
  settings.json              ← Permissions + hooks
  settings.local.json        ← Personal overrides (gitignored)
.mcp.json                    ← MCP server configs (shared)
CLAUDE.md                    ← Project instructions (lean, <80 lines)
```

> **Instructor says:** "This is the full automation stack. CLAUDE.md for project context, rules for conventions, commands for workflows, skills for automatic intelligence, hooks for guaranteed checks, agents for delegation, and MCP for external services. All of it committed to git, all of it shared with the team."

---

## Recap

| Step | What We Built | Why It Matters |
|------|--------------|----------------|
| Custom commands | `/deploy-check`, `/explain-app` | Repeatable workflows shared via git |
| PostToolUse hook | Auto-test on every file edit | Tests guaranteed to run, self-correcting loop |
| Rules files | `testing.md`, `api-conventions.md` | Scales CLAUDE.md without bloating it |
| Sub-agent | `reviewer.md` | Isolated code review without context pollution |

> **Instructor says:** "Now open the student worksheet. You're going to build these same things for BulkSource."
