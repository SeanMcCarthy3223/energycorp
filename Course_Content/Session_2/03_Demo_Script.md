# Demo Script: Skills, Custom Commands & MCP Servers

**Duration:** 20-25 minutes
**Repo:** energycorp (Django REST API + React SPA)
**Prerequisites:** Claude Code CLI installed, energycorp cloned, GitHub access

---

## Demo Setup (before students arrive)

1. Clean energycorp repo (revert any Session 1 demo changes)
2. Ensure `.claude/` directory exists: `mkdir -p .claude/commands .claude/skills .claude/rules`
3. Verify Claude Code works: `claude --version`
4. Have a GitHub Personal Access Token ready (for MCP demo)
5. Increase terminal font size for visibility
6. Open VS Code as backup for file editing

---

## Part 1: Custom Slash Commands (8-10 min)

### Goal
Create two custom commands live, demonstrate how they work and how the team shares them.

### Steps

**1.** Navigate to the energycorp directory and launch Claude Code:

```bash
cd /path/to/energycorp
claude
```

**2.** Show the commands directory:

> **Say:** "Custom commands are just Markdown files in `.claude/commands/`. Let's create our first one."

**3.** Exit Claude (or use a separate terminal). Create the first command:

Create file `.claude/commands/test-backend.md`:

```markdown
---
description: Run Django backend tests and summarize results
allowed-tools: Bash, Read
---
Run the Django test suite with `!cd Backend && python src/manage.py test`.

Report:
1. Total tests run
2. Pass/fail count
3. If any failures, show the test name, file, and error message
4. Suggest a fix for each failure
```

> **Say:** "This is a Markdown file with YAML frontmatter. The `description` tells Claude what the command does. `allowed-tools` restricts which tools Claude can use. Everything below the frontmatter is the prompt Claude will execute."

**4.** Re-launch Claude (or, if still in session, it will detect the new command). Type `/test-backend` and press Enter.

> **Say:** "Watch — Claude runs the test suite and gives us a structured report. Every team member who pulls this repo gets this command automatically."

Wait for it to execute. Walk through the output.

**5.** Create a second command with arguments. Create `.claude/commands/review-file.md`:

```markdown
---
description: Focused code review for a specific file
argument-hint: <file-path>
allowed-tools: Read, Grep, Glob
---
Perform a focused code review of @$ARGUMENTS.

Check for:
1. Import errors — are all imported modules actually installed?
2. Security issues — unvalidated input, missing permission checks
3. Error handling — are exceptions caught appropriately?
4. Project patterns — does the code follow patterns from our CLAUDE.md?

Present findings as a numbered list with severity (HIGH / MEDIUM / LOW).
If no issues found, say so explicitly.
```

**6.** Demonstrate the command with arguments:

```
/review-file Backend/src/users/views.py
```

> **Say:** "The `$ARGUMENTS` placeholder gets replaced with whatever you type after the command name. Here I passed a file path. Claude reads that file and runs the review checks we defined."

Wait for the review. Discuss the findings briefly.

**7.** Show how commands are shared:

> **Say:** "These files live in `.claude/commands/`. They're committed to git. When your colleague pulls, they get the same commands. No setup, no configuration — just type the slash."

---

## Part 2: MCP Server — GitHub Integration (6-8 min)

### Goal
Install the GitHub MCP server and show Claude interacting with GitHub directly.

### Steps

**1.** Show current MCP status:

```
/mcp
```

> **Say:** "The `/mcp` command shows all configured MCP servers. Right now we probably have none or just the defaults. Let's add GitHub."

**2.** Exit Claude temporarily and install the GitHub MCP server:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

> **Say:** "One command. That's it. Claude now has access to GitHub's API — PRs, issues, code search, everything."

**3.** Re-launch Claude and verify:

```
/mcp
```

> **Say:** "See 'github' listed? Claude can now use it as a tool."

**4.** Authenticate if prompted (follow the OAuth flow or use a token).

**5.** Ask Claude to use the GitHub MCP:

```
List the most recent pull requests on this repository.
```

> **Say:** "Claude is reading directly from GitHub. It didn't scrape a webpage — it used the MCP protocol to call the GitHub API."

**6.** Try a more practical query:

```
Show me any open issues labeled "bug" in this repository.
```

Or if there are no issues:

```
What was the last commit message and who made it?
```

**7.** Show the project-level MCP configuration:

> **Say:** "MCP servers can be scoped to a project. Check `.mcp.json` — this file is committed to git so your whole team shares the same MCP configuration."

Show the generated `.mcp.json` file.

**8.** Demonstrate MCP tool search concept:

> **Say:** "When you have many MCP servers installed, Claude doesn't load all their tools at once. It uses MCP Tool Search to dynamically load only the tools it needs — saving up to 95% of context space. This means you can install many servers without cluttering Claude's context."

---

## Part 3: Skills — Automatic Intelligence (4-5 min)

### Goal
Create a simple skill that Claude invokes automatically.

### Steps

**1.** Explain the difference:

> **Say:** "Commands are for things you trigger. Skills are for things Claude triggers. When Claude detects it's doing something that matches a skill's description, it uses the skill automatically."

**2.** Create a skill directory and file:

```bash
mkdir -p .claude/skills/django-check
```

Create `.claude/skills/django-check/SKILL.md`:

```yaml
---
name: django-check
description: Validates Django model and view changes. Use when editing
  models.py, views.py, or serializers.py files in the Backend.
allowed-tools: Read, Grep
context: fork
---
When Claude modifies a Django model, view, or serializer file, verify:

1. **Models**: Any new fields should have appropriate defaults or null=True
2. **Views**: All ViewSets must have a permission_classes attribute
3. **Serializers**: Fields listed in Meta.fields must exist on the model
4. **Imports**: All imported classes must exist in the installed version of DRF

Report any issues found. If everything looks good, confirm with a brief message.
```

> **Say:** "The `context: fork` means this runs in an isolated sub-agent — it doesn't pollute your main conversation. Claude scans the description at startup and decides when to invoke it."

**3.** Demonstrate by making a change to a model:

```
Add a "notes" field to the Client model in Backend/src/users/models.py.
Make it a TextField that allows blank and null.
```

> **Say:** "Watch the skill trigger. Claude edits the model, then the django-check skill activates because we edited models.py. It verifies the change follows our rules."

**Note:** The skill may or may not trigger immediately depending on the session. If it doesn't trigger automatically, explain:

> **Say:** "Skills are probabilistic — Claude decides based on context. If it didn't trigger this time, that's normal. Over many interactions, it will learn when the skill is relevant. For guaranteed execution, use hooks instead — which we'll cover next."

**4.** Revert the change:

```
Revert the change to models.py — remove the notes field we just added.
```

---

## Part 4: Putting It Together (3-4 min)

### Goal
Show how commands, MCPs, and skills compose into a workflow.

### Steps

**1.** Demonstrate a composed workflow:

> **Say:** "Let's see these work together. I'll ask Claude to review the project holistically."

```
Use our test-backend command to run tests, then check GitHub for any
open PRs or recent issues, and give me a project status summary.
```

**2.** Wait for Claude to:
- Run the `/test-backend` command logic (tests)
- Use the GitHub MCP to check PRs/issues
- Synthesize a summary

> **Say:** "One prompt, and Claude used a custom command for testing and the GitHub MCP for project status. If we had a reporting skill, it would have triggered automatically to format the output. That's the composition model."

**3.** Show the file structure:

```
.claude/
  commands/
    test-backend.md         ← You type /test-backend
    review-file.md          ← You type /review-file <path>
  skills/
    django-check/
      SKILL.md              ← Claude invokes automatically
  settings.json             ← Permissions and hooks
  rules/                    ← Team-owned convention files
.mcp.json                   ← MCP server configurations
CLAUDE.md                   ← Project instructions
```

> **Say:** "This is the full picture. Commands for your workflows, skills for Claude's instincts, MCP for external access, rules for conventions, hooks for automation, and CLAUDE.md for project context. All committed to git, all shared with the team."

---

## Demo Wrap-Up

> **Say:** "Let's recap:
> - **Custom commands** turn repeated prompts into team-shared tools — one Markdown file, one slash command
> - **MCP servers** give Claude access to GitHub, Figma, databases — anything with an MCP integration
> - **Skills** let Claude automatically apply domain knowledge when relevant
> - **They compose** — commands define workflows, MCPs provide data, skills add intelligence
>
> Next, we'll cover hooks and sub-agents — the automation layer that guarantees checks run every time."

---

## Troubleshooting Common Demo Issues

| Issue | Fix |
|-------|-----|
| Command not appearing after creation | Restart Claude session; check file is in `.claude/commands/` with `.md` extension |
| MCP server install fails | Check network connectivity; try with `--verbose` flag |
| GitHub MCP authentication fails | Verify token permissions; try `gh auth login` first |
| Skill doesn't trigger automatically | Normal — skills are probabilistic; demonstrate the concept and explain hooks as the guaranteed alternative |
| `$ARGUMENTS` not replaced | Check that there's no space between `$` and `ARGUMENTS`; verify frontmatter has correct `argument-hint` |
| MCP tools not showing | Run `/mcp` to verify server status; check if server requires authentication |
