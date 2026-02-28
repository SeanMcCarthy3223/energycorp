# Hands-on Lab: Power Features & Automation

**Duration:** 25-35 minutes (independent work)
**Goal:** Create custom commands, configure automation hooks, and set up rules files for your project.

---

## Exercise 1: Create a Custom Slash Command (8 min)

### 1.1 Set Up the Commands Directory

```bash
cd /path/to/your/project
mkdir -p .claude/commands
```

### 1.2 Create a Test Command

Create a file called `.claude/commands/test.md` that runs your project's test suite:

```markdown
---
description: Run the full test suite and summarize results
allowed-tools: Bash, Read
---
Run the full test suite with `![your exact test command here]`.

Report:
1. Total tests run
2. Pass/fail count
3. For any failures: test name, file location, and error message
4. A suggested fix for each failure
```

**Replace `[your exact test command here]` with your actual command.** Examples:
- Django: `python manage.py test`
- pytest: `pytest --tb=short`
- npm: `npm test -- --watchAll=false`

### 1.3 Test Your Command

Launch Claude Code and run:

```
/test
```

**Verify:**
- [ ] The command appears when you type `/`
- [ ] Claude runs your actual test command
- [ ] Results are formatted as requested

### 1.4 Create a Review Command (with arguments)

Create `.claude/commands/review-file.md`:

```markdown
---
description: Focused code review for a specific file
argument-hint: <file-path>
allowed-tools: Read, Grep, Glob
---
Review @$ARGUMENTS for:

1. **Import errors** — are all imported modules actually installed?
2. **Security** — unvalidated input, missing auth/permission checks
3. **Error handling** — are exceptions caught? Are edge cases covered?
4. **Project patterns** — does the code follow patterns from CLAUDE.md?

Present findings as a numbered list with severity: HIGH / MEDIUM / LOW.
If no issues, say so explicitly.
```

Test it by reviewing one of your project's files:

```
/review-file [path/to/a/file/in/your/project]
```

**Verify:**
- [ ] Claude reads the specific file you passed
- [ ] Findings are structured with severity ratings
- [ ] It catches at least one real issue (or confirms the file is clean)

---

## Exercise 2: Configure a PostToolUse Hook (5 min)

### 2.1 Open Your Project Settings

Open `.claude/settings.json` (create it if it doesn't exist).

### 2.2 Add the Auto-Test Hook

Add or update your settings to include a PostToolUse hook:

```json
{
  "permissions": {
    "allow": [
      "Bash([your test command])",
      "Bash([your lint command, if applicable])"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(*DROP TABLE*)",
      "Bash(*--force*)"
    ]
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && [your test command] 2>&1 | tail -20"
      }]
    }]
  }
}
```

**Replace `[your test command]`** with your actual test command. Examples:
- Django: `python manage.py test 2>&1 | tail -20`
- pytest: `pytest --tb=short --no-header 2>&1 | tail -20`
- npm: `npm test -- --watchAll=false 2>&1 | tail -20`

**Important:** The `| tail -20` limits output so Claude gets a summary, not hundreds of lines.

### 2.3 Test the Hook

Restart Claude Code (exit and re-launch to pick up new settings).

Ask Claude to make a small, safe change:

```
Add a comment at the top of [one of your files] that says "# Updated by Claude Code"
```

**Verify:**
- [ ] Claude edits the file
- [ ] Tests run automatically (you see test output appear without asking)
- [ ] Claude responds to the test results

Then ask Claude to revert:

```
Remove the comment you just added.
```

---

## Exercise 3: Set Up Rules Files (5 min)

### 3.1 Create the Rules Directory

```bash
mkdir -p .claude/rules
```

### 3.2 Create Your First Rules File

Think about your team's conventions. Pick one area and create a rules file.

**Option A: Testing conventions**

Create `.claude/rules/testing.md`:

```markdown
# Testing Conventions

- [How do you name test files?]
- [What test framework do you use?]
- [What must be tested for new endpoints/components?]
- [How do you handle test data — fixtures, factories, mocks?]
- [What's the minimum test coverage expectation?]
```

**Option B: API conventions**

Create `.claude/rules/api-conventions.md`:

```markdown
# API Conventions

- [What's your URL pattern? e.g., /api/v1/<resource>/]
- [What auth is required? e.g., Token, JWT, session]
- [What permission model do you use?]
- [What's the standard response format?]
- [What serializer patterns do you follow?]
```

**Option C: Frontend conventions**

Create `.claude/rules/frontend-patterns.md`:

```markdown
# Frontend Conventions

- [Component structure: functional vs class, hooks vs HOCs]
- [State management: Redux, Context, Zustand, etc.]
- [Styling approach: CSS modules, Tailwind, styled-components, etc.]
- [Folder structure: how are components organized?]
- [Naming conventions: PascalCase components, camelCase functions, etc.]
```

**Replace the bracketed items with your actual conventions.** Be specific and concise.

### 3.3 Create at Least Two Rules Files

Your team should have at least:
1. One for backend conventions
2. One for frontend conventions

### 3.4 Verify Claude Reads Them

Restart Claude Code and ask:

```
What conventions should I follow when adding a new [endpoint / component] to this project?
```

**Verify:**
- [ ] Claude references information from your rules files
- [ ] The conventions match what you wrote

---

## Exercise 4: (Stretch Goal) Create a Custom Sub-Agent (5 min)

If you finish the exercises above with time remaining, try creating a custom sub-agent.

### 4.1 Create the Agents Directory

```bash
mkdir -p .claude/agents
```

### 4.2 Create a Reviewer Agent

Create `.claude/agents/reviewer.md`:

```yaml
---
name: reviewer
description: Reviews code changes for quality and security. Use proactively after edits.
tools: Read, Grep, Glob
model: sonnet
---
You are a code reviewer for [brief description of your project].

When reviewing code, check for:
1. Import errors and dependency issues
2. Missing error handling
3. Security vulnerabilities (injection, auth bypass, exposed secrets)
4. Deviations from project patterns

Format findings as:
- CRITICAL: [issue] — must fix
- WARNING: [issue] — should fix
- INFO: [observation]

Be concise. Only flag real issues.
```

### 4.3 Test the Agent

Ask Claude:

```
Use the reviewer agent to review [path/to/a/recently-changed/file].
```

---

## Exercise 5: (Stretch Goal) Install an MCP Server (5 min)

### 5.1 Install GitHub MCP

If your team uses GitHub:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

Follow the authentication prompts.

### 5.2 Test It

Launch Claude Code and ask:

```
List the most recent pull requests on this repository.
```

**Verify:**
- [ ] Claude fetches real data from GitHub
- [ ] PR titles and authors are correct

---

## Self-Assessment

### Understanding

1. What is the difference between a custom command and a skill?

> Your answer: ___________________________________________________________

2. What does a PostToolUse hook with `matcher: "Write|Edit"` do?

> Your answer: ___________________________________________________________

3. Why should you use `.claude/rules/` instead of putting everything in CLAUDE.md?

> Your answer: ___________________________________________________________

4. What is the benefit of running a sub-agent in a forked context?

> Your answer: ___________________________________________________________

### Experience

5. What custom command(s) did you create? Which will your team use most?

> Your answer: ___________________________________________________________

6. Did the auto-test hook trigger correctly? Did it catch any issues?

> Your answer: ___________________________________________________________

7. What conventions did you document in your rules files?

> Your answer: ___________________________________________________________

### Confidence

Rate your comfort level (1 = not comfortable, 5 = very comfortable):

| Skill | Rating (1-5) |
|-------|:------------:|
| Creating custom slash commands | |
| Configuring PostToolUse hooks | |
| Setting up rules files for team scaling | |
| Understanding when to use commands vs skills vs MCPs | |
| Creating a custom sub-agent | |

---

## What to Bring to Session 3

- Your updated `.claude/` directory (commands, rules, hooks)
- Notes on what the auto-test hook caught (or didn't)
- Ideas for additional commands your team would find useful
- Any questions about hook configuration or sub-agents

---

## Quick Reference

| Action | How |
|--------|-----|
| Create a command | Add `.md` file to `.claude/commands/` |
| Create a skill | Add `SKILL.md` to `.claude/skills/<name>/` |
| Create a sub-agent | Add `.md` file to `.claude/agents/` |
| Add MCP server | `claude mcp add --transport <type> <name> <url>` |
| List MCP servers | `claude mcp list` or `/mcp` in session |
| Configure hooks | Add `"hooks"` section to `.claude/settings.json` |
| Add rules file | Add `.md` file to `.claude/rules/` |
| Test hook manually | Run the command from the hook's `command` field in your terminal |
| Manage hooks interactively | `/hooks` in session |
| Manage agents interactively | `/agents` in session |
