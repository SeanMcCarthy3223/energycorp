# Lecture: Hooks, Sub-Agents & Automation

**Duration:** 15 minutes
**Goal:** Teach students how hooks provide guaranteed automation, how sub-agents enable delegation, and how to scale CLAUDE.md with rules files.

---

## The Problem: Humans Forget, Hooks Don't

In Session 1, we established the safe workflow: Plan → Test → Implement → Verify → Commit.

**The weak link is "Verify."** You know you should run tests after every change. You know you should check imports. You know you should review for security issues. But after 30 minutes of focused work, you forget. Or you skip it "just this once."

**Hooks solve this.** A hook is a command, prompt, or agent that executes **automatically** when a specific event happens in Claude Code. Not a suggestion. Not a best practice. A guarantee.

---

## What Are Hooks?

Hooks are user-defined automations that fire at specific **lifecycle events** in Claude Code.

**Three types:**
- **Command hooks** — run a shell command (e.g., run tests, check lint)
- **Prompt hooks** — evaluate a question with a small LLM (Haiku by default)
- **Agent hooks** — spawn a sub-agent with tool access for verification

**Where to configure:**
- `~/.claude/settings.json` — applies to all your projects
- `.claude/settings.json` — project-level, shared via git
- `.claude/settings.local.json` — personal overrides, gitignored
- Managed settings — enterprise, highest precedence

---

## The Hook Events That Matter Most

Claude Code has 14 hook events. For daily development, focus on these five:

### 1. PostToolUse — "After Claude writes a file"
**Fires:** After Claude successfully uses a tool (Write, Edit, Bash, etc.)
**Use for:** Auto-run tests, lint, format
**Can block:** Yes — if tests fail, Claude sees the failure and can fix it

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && python src/manage.py test 2>&1 | tail -20"
      }]
    }]
  }
}
```

> **Key insight:** The `matcher` field lets you target specific tools. `Write|Edit` means the hook only fires when Claude writes or edits files — not when it reads or searches.

### 2. PreToolUse — "Before Claude runs a command"
**Fires:** Before Claude executes a tool
**Use for:** Block dangerous operations, enforce security policies
**Can block:** Yes — exit code 2 stops the action

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "python3 -c \"import json,sys; cmd=json.load(sys.stdin)['command']; sys.exit(2) if any(x in cmd for x in ['rm -rf','DROP TABLE','.env']) else 0\""
      }]
    }]
  }
}
```

> **Key insight:** This is a safety net that's invisible to Claude. Claude doesn't know the hook exists — it just sees the command get blocked if it's dangerous.

### 3. Stop — "When Claude finishes responding"
**Fires:** After Claude completes a response
**Use for:** Auto code review, summary generation
**Can block:** Yes — can force Claude to continue working

### 4. TaskCompleted — "When a task is marked done"
**Fires:** When Claude marks a task as complete
**Use for:** Gate on test passing, enforce quality checks
**Can block:** Yes — prevents marking as done until checks pass

### 5. SessionStart — "When a session begins"
**Fires:** When Claude starts, resumes, or clears
**Use for:** Load team context, set up environment
**Can block:** No

---

## Hook Communication

Hooks communicate through a simple protocol:

| Mechanism | How It Works |
|-----------|-------------|
| **Exit code 0** | Success — continue normally |
| **Exit code 2** | Block — stop the action, show error to Claude |
| **Stdout JSON** | Structured feedback: `{"decision": "deny", "reason": "Tests failed"}` |
| **Stderr** | Error messages shown to the user |
| **Stdin** | Hook receives JSON with tool name, input, and context |

**The power of blocking:** When a PostToolUse hook fails (exit 2), Claude sees the failure output and can immediately fix the issue. This creates a **self-correcting loop** — Claude writes code, tests run automatically, if tests fail Claude sees why and fixes it, tests run again. No human intervention needed.

---

## The PostToolUse Auto-Test Pattern

This is the single most valuable hook for your team.

### How It Works

```
Claude edits a file
    ↓
PostToolUse hook fires
    ↓
Tests run automatically
    ↓
┌─── Tests pass → Claude continues normally
│
└─── Tests fail → Claude sees failure output
                      ↓
                  Claude fixes the issue
                      ↓
                  PostToolUse fires again
                      ↓
                  Tests run again
                      ↓
                  (Repeat until passing)
```

### Configuration for Django + React

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "cd \"$CLAUDE_PROJECT_DIR/Backend\" && python src/manage.py test 2>&1 | tail -30"
        }]
      }
    ]
  }
}
```

### Tips for Effective Auto-Testing
- **Use `tail -30`** to limit output — Claude doesn't need 200 lines of test output
- **Use `--bail` (JS) or `--failfast` (Django)** to stop at the first failure — faster feedback
- **Match specific tools** — `Write|Edit` is better than matching all tools
- **Test the hook command manually first** — make sure it works outside Claude Code before adding it as a hook

---

## Sub-Agents: Delegation Without Context Pollution

A sub-agent is a **separate Claude instance** with its own context window, instructions, and tool access.

### Why Sub-Agents?

**The main conversation is precious real estate.** Every message, every tool call, every file read fills up the context window. When you ask Claude to research something or review code, that work consumes context that could be used for implementation.

Sub-agents work in isolation. Their research doesn't pollute your main context. They report back with just the results.

### Built-In Sub-Agents

| Agent | Model | Tools | Use For |
|-------|-------|-------|---------|
| **Explore** | Haiku | Read, Glob, Grep | Fast codebase search and exploration |
| **Plan** | Sonnet | Read, Glob, Grep, WebSearch | Plan Mode analysis and proposals |
| **General-purpose** | Sonnet | All tools | Complex tasks requiring full access |

### Custom Sub-Agents

Create `.claude/agents/<name>.md`:

```yaml
---
name: code-reviewer
description: Reviews code changes for quality. Use proactively after edits.
tools: Read, Grep, Glob
model: sonnet
---
You are a senior code reviewer for a Django + React project.

Review modified files for:
- Import errors and version incompatibilities
- Missing error handling and edge cases
- Security vulnerabilities (injection, auth bypass)
- Deviations from project patterns in CLAUDE.md

Be concise. Only flag real issues, not style preferences.
Rate each finding: CRITICAL / WARNING / INFO
```

### When to Use Sub-Agents vs. Hooks

| Need | Use |
|------|-----|
| Run tests after every edit | **Hook** (PostToolUse) — guaranteed, fast |
| Deep code review after a task | **Sub-agent** (Stop hook with agent type) — thorough, isolated |
| Block dangerous commands | **Hook** (PreToolUse) — immediate, deterministic |
| Research a library before using it | **Sub-agent** (Explore) — doesn't pollute main context |
| Enforce test gate on task completion | **Hook** (TaskCompleted) — blocks until passing |

---

## Rules Files in Practice — Going Deeper

In the presentation, we introduced rules files — modular Markdown files in `.claude/rules/` that load automatically alongside CLAUDE.md with team-owned, conflict-free conventions.

Now let's look at **what goes in them** and how to structure them for your team.

### Example: `testing.md`

```markdown
# Testing Conventions

- All new API endpoints must have at least one test
- Test files go in the app's `tests/` directory (not a single tests.py)
- Use `factory_boy` for test data, not raw `Model.objects.create()`
- Test names follow: `test_<action>_<condition>_<expected_result>`
- Always test both success and failure cases for permission-gated views
```

### Example: `api-conventions.md`

```markdown
# API Conventions

- All viewsets must set `permission_classes` explicitly (never rely on defaults)
- Use `serializers.ModelSerializer` with explicit `fields` (never `fields = '__all__'`)
- Pagination is required on all list endpoints
- All 4xx responses must include a `message` field in the body
- URL patterns: `/api/<app>/<resource>/` (plural nouns, no verbs)
```

### Subdirectory CLAUDE.md Files

For deep, directory-specific context:

```
Backend/
  src/
    contract/
      CLAUDE.md    ← Only loads when Claude works in this directory
```

**Content:**
```markdown
# Contract App Context

The invoice generation flow is complex:
1. Invoice.generate() calculates consumption from Counter readings
2. Tariffs vary by stratum (1-6) — see utils.py for rate tables
3. Late payment interest (interes_mora) compounds monthly
4. PDF generation uses the template in templates/contract/index.html

IMPORTANT: Never modify invoice calculations without running the full
contract test suite. Rounding errors have caused billing disputes before.
```

This loads **only** when Claude accesses files in `Backend/src/contract/`. Zero overhead for work in other directories.

---

## Putting It All Together: The Automated Team Workflow

```
Developer starts Claude Code session
    ↓
SessionStart hook loads team context
    ↓
Developer types /implement-feature "add export button"
    ↓
Claude enters Plan Mode (defaultMode: plan)
    ↓
Claude reads CLAUDE.md + .claude/rules/*.md + subdirectory CLAUDE.md
    ↓
Claude produces plan → Developer approves
    ↓
Claude implements changes
    ↓
PostToolUse hook runs tests after each file edit
    ↓
Tests fail? → Claude sees failure → fixes → tests run again
    ↓
Tests pass? → Claude continues
    ↓
Stop hook triggers code-reviewer sub-agent
    ↓
Sub-agent reviews changes, reports findings
    ↓
Claude addresses findings
    ↓
TaskCompleted hook verifies: tests pass + lint clean
    ↓
Developer reviews PR → merge
```

**Every check is automatic. Nothing depends on the developer remembering.**

---

## Summary

| Feature | What It Does | Key Benefit |
|---------|-------------|-------------|
| **Hooks** | Guaranteed automation at lifecycle events | Tests run every time, dangerous commands blocked every time |
| **Sub-agents** | Isolated delegation to specialized Claude instances | Research and review without polluting main context |
| **Rules files** | Modular, team-owned convention files | CLAUDE.md stays lean, teams don't conflict |
| **Subdirectory CLAUDE.md** | On-demand deep context for specific directories | Zero overhead, full depth where needed |

**The key principle:** Don't rely on humans to remember. Automate the checks, isolate the research, modularize the rules. Build a system that makes the right thing the easy thing.
