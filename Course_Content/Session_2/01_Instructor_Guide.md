# Session 2 Instructor Guide: Power Features & Automation

**Duration:** 2 hours
**Audience:** Ukrainian software contractor (~22 employees, frontend + backend split) building "BulkSource" — a construction supply chain web portal (Django + React)
**Demo repo:** energycorp (Django REST API + React SPA)
**Prerequisites:** Session 1 completed. Students have Claude Code installed, a CLAUDE.md on their BulkSource project, and have submitted at least one Claude-assisted PR.

---

## Session Overview

| Block | Topic | Duration | Format |
|-------|-------|----------|--------|
| 1 | Welcome & Session 1 Recap | 5-10 min | Discussion |
| 2 | Presentation: Skills, Custom Commands & MCP Servers | 15-20 min | Slides/Lecture |
| 3 | Demo: Skills, Commands & MCPs in Action | 20-25 min | Live Demo |
| 4 | Lecture: Hooks, Sub-Agents & Automation | 15 min | Slides/Lecture |
| 5 | Hands-On Lab | 45-60 min | Guided Lab + Independent Work |
| 6 | Q&A & Wrap-Up | 5-10 min | Discussion |

**Total: ~110-135 minutes**

---

## Block 1: Welcome & Session 1 Recap (5-10 min)

### Objectives
- Reconnect with the group
- Surface wins and pain points from Session 1
- Bridge into Session 2 topics

### Speaker Notes

**[0:00]** Welcome back.

> "Last session we covered the fundamentals — what Claude is, CLAUDE.md, settings, Plan Mode, and you each submitted a PR. Before we go further, I want to hear from you."

**[0:02]** Guided discussion (3-4 questions):

- "Who used Claude Code between sessions? What did you use it for?"
- "Did anyone hit a hallucination? What happened?"
- "Did anyone improve their CLAUDE.md? What did you add?"
- "What's one thing that frustrated you?"

> **Instructor note:** Use their answers to tailor emphasis during the session. If many hit hallucinations, spend extra time on hooks for auto-testing. If they struggled with CLAUDE.md, give more time to rules files.

**[0:07]** Frame Session 2:

> "Today we're moving from 'using Claude' to 'making Claude work the way your team needs.' We'll cover three categories of power features:
> 1. **Extensibility** — Skills, custom commands, and MCP servers that give Claude new abilities
> 2. **Automation** — Hooks that run automatically so you don't have to remember every check
> 3. **Delegation** — Sub-agents that handle research and review in isolated contexts
>
> By the end, you'll have a custom slash command, a PostToolUse hook for auto-testing, and a rules file structure that scales across your team."

### Transition
> "Let's start with how you extend Claude beyond its built-in capabilities."

---

## Block 2: Presentation — Skills, Custom Commands & MCP Servers (15-20 min)

### Objectives
- Understand the difference between skills, custom commands, MCPs, and rules files
- Know when to use each extensibility mechanism
- See how rules files scale CLAUDE.md for teams
- See practical examples relevant to Django + React development

### Materials
- `02_Presentation_Skills_Commands_MCPs.md` (slide-by-slide content)
- `02_Skills_Commands_MCPs.pptx` (PowerPoint)

### Speaker Notes

**[0:10]** Start with the big picture — three ways to extend Claude:

> "Out of the box, Claude Code can read files, run commands, and search your codebase. But your team has specific workflows — specific test commands, specific review processes, specific external tools. These three mechanisms let you teach Claude your team's way of working."

Draw or show the comparison:

| Feature | Who invokes it? | Where it lives | Best for |
|---------|-----------------|----------------|----------|
| **Custom Commands** | You type `/command` | `.claude/commands/` | Repeatable workflows |
| **Skills** | Claude decides automatically | `.claude/skills/` | Background automation |
| **MCP Servers** | Claude uses as tools | `.mcp.json` | External service access |

**[0:14]** Walk through custom commands. These are the most immediately useful.

> "A custom command is a Markdown file that becomes a slash command. Your team can share them via git. Think of them as reusable prompts with structure."

Show the example:
```markdown
---
description: Run full test suite and report results
allowed-tools: Bash, Read
---
Run the full test suite with `!python manage.py test` and report:
1. Total tests run
2. Any failures with file and line number
3. Suggested fixes for failures
```

> "You type `/test`, Claude runs it. Every team member gets the same behavior."

**[0:18]** Cover skills briefly. The key distinction:

> "Skills are like commands, but Claude decides when to use them. You don't type anything — Claude reads the description and invokes the skill when it matches what you're doing. Think of it as teaching Claude new instincts."

**[0:21]** Introduce MCP servers. Keep it practical, not architectural.

> "MCP is how Claude talks to external systems. Want Claude to read your GitHub issues? There's an MCP server for that. Want it to query your database? There's one for that too. You install them with a single command."

Show the install command:
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

> "After this, Claude can create issues, read PRs, search your repo — all from the command line."

**[0:23]** Introduce rules files. Bridge from Session 1's CLAUDE.md.

> "In Session 1 you created a CLAUDE.md. But it should stay under 80 lines, and your team has way more conventions than that. Rules files solve this — they're Markdown files in `.claude/rules/` that load automatically alongside CLAUDE.md. Different team members own different files. No merge conflicts."

Show the comparison table: CLAUDE.md vs rules files (scope, ownership, merge conflicts). Show the directory structure with team ownership.

> "Think of it this way: CLAUDE.md is *what the project is*. Rules files are *how to work in it*. Commands are *what to do*. Skills are *when to do it*. MCPs are *where to get data*."

**[0:26]** Tie it together with a real scenario.

> "Imagine your workflow: you type `/review` (custom command), Claude reviews the code — it knows your conventions from rules files, it checks the GitHub PR comments via MCP, and a security skill triggers automatically because the PR touches views.py. Four mechanisms working together."

### Transition
> "Let's see all of this in practice on the energycorp project."

---

## Block 3: Demo — Skills, Commands & MCPs in Action (20-25 min)

### Objectives
- Create a custom slash command live
- Install and use an MCP server
- Create a simple skill
- Show how these compose together

### Materials
- `03_Demo_Script.md` (step-by-step demo script)
- energycorp repo with `.claude/` directory ready

### Pre-Demo Checklist
- [ ] energycorp repo clean and ready
- [ ] `.claude/commands/` directory exists (or ready to create)
- [ ] GitHub MCP server pre-configured (or ready to add live)
- [ ] Terminal font size increased

### Speaker Notes

**[0:28]** Start with creating a custom command.

> "Let's create a `/test-backend` command that runs Django tests and summarizes the results."

Create the file live: `.claude/commands/test-backend.md`

Show Claude running it when you type `/test-backend`.

**[0:33]** Create a second command with arguments.

> "Now a `/review-file` command that takes a file path and does a focused code review."

Create `.claude/commands/review-file.md` with `$ARGUMENTS` parameter.

Demonstrate: `/review-file Backend/src/users/views.py`

**[0:37]** Install and demo the GitHub MCP server.

> "Let's give Claude access to our GitHub repository."

Run:
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

Then ask Claude: "List the open PRs on this repo" or "Show me the most recent issues."

**[0:42]** Create a simple skill.

> "Now let's create a skill that Claude uses automatically. We'll make a 'security-check' skill that Claude invokes whenever it edits a views.py or urls.py file."

Create `.claude/skills/security-check/SKILL.md` live.

**[0:47]** Show composition. Make a change that triggers the skill, and use the custom command to verify.

**[0:50]** Demonstrate `/mcp` to show all configured servers.

### Transition
> "Now you've seen how to extend Claude's capabilities. Next, let's talk about how to automate quality checks so you don't have to remember them every time."

---

## Block 4: Lecture — Hooks, Sub-Agents & Automation (15 min)

### Objectives
- Understand what hooks are and the 14 event types
- See practical hook configurations for testing and security
- Learn about sub-agents for delegation
- Understand how to scale CLAUDE.md with `.claude/rules/`

### Materials
- `04_Lecture_Hooks_Automation.md` (full lecture content)
- `04_Hooks_Automation.pptx` (PowerPoint)

### Speaker Notes

**[0:53]** Start with the problem hooks solve:

> "In Session 1, I told you: always run tests, always check imports, always review diffs. But humans forget. Hooks make those checks automatic and guaranteed."

**[0:55]** Explain hooks at a high level:

> "A hook is a command that runs automatically when something happens in Claude Code. Think of git hooks — pre-commit, post-commit — but for Claude's actions. When Claude writes a file, a hook can automatically run your linter. When Claude finishes a task, a hook can run the test suite."

Show the key events table (simplified to the most relevant 5-6):

| Event | When It Fires | Practical Use |
|-------|---------------|---------------|
| **PostToolUse** | After Claude writes/edits a file | Auto-run tests, linting |
| **PreToolUse** | Before Claude runs a command | Block dangerous operations |
| **Stop** | When Claude finishes responding | Auto code review |
| **TaskCompleted** | When a task is marked done | Enforce test-passing gate |
| **SessionStart** | When a session begins | Load team context |

**[0:59]** Show the PostToolUse auto-test hook. This is the most immediately valuable.

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

> "Every time Claude writes or edits a file, Django tests run automatically. If they fail, Claude sees the failure output and can fix the issue immediately — before you even have to ask."

**[1:02]** Cover the PreToolUse security hook briefly:

> "This blocks dangerous commands before they execute. Claude can't run `rm -rf` or `DROP TABLE` even if it tries. The hook intercepts the command and stops it with exit code 2."

**[1:04]** Introduce sub-agents:

> "A sub-agent is a separate Claude instance with its own context window and tools. Think of delegating to a junior developer — they work on a specific task and report back, without cluttering your main conversation."

Explain the three built-in sub-agents:
- **Explore** (Haiku) — fast codebase search
- **Plan** (Sonnet) — used in Plan Mode
- **General-purpose** (Sonnet) — full tool access

> "You can also create custom sub-agents for your team. A code-reviewer agent, a migration-checker agent, a documentation agent — each with specific instructions and tool access."

**[1:06]** Go deeper on rules files (introduced in the presentation):

> "We covered rules files in the presentation — modular files in `.claude/rules/` that load alongside CLAUDE.md. Now let's talk about what actually goes in them. The key is: be specific and concise. Don't duplicate what's in CLAUDE.md."

```
.claude/
  rules/
    testing.md        ← Testing team owns this
    api-conventions.md ← Backend team owns this
    frontend-patterns.md ← Frontend team owns this
    security.md       ← Security lead owns this
```

> "Each file loads automatically, same priority as CLAUDE.md. Different team members own different files. No merge conflicts, no bloated root file."

Also mention subdirectory CLAUDE.md files:

> "Put a CLAUDE.md inside `src/auth/` and it only loads when Claude works in that directory. Deep context exactly where it's needed, zero overhead everywhere else."

### Transition
> "Let's put all of this into practice. Open your terminals."

---

## Block 5: Hands-On Lab (45-60 min)

### Objectives
- Create a custom slash command for the team
- Configure a PostToolUse hook for auto-testing
- Set up `.claude/rules/` directory for team scaling
- Create a custom sub-agent (stretch goal)
- Apply everything to BulkSource

### Materials
- `05_Lab_Guide_Demo.md` (instructor-led lab guide for energycorp demo)
- `06_Student_Worksheet.md` / `06_Student_Worksheet.docx` (generalized worksheet for BulkSource)

### Structure
1. **Instructor-led (20-25 min):** Everyone follows along on energycorp
2. **Independent work (25-35 min):** Students apply to BulkSource using the worksheet

### Speaker Notes — Phase 1: Instructor-Led

**[1:10]** Create a custom slash command together.

> "Let's create a `/deploy-check` command that verifies the project is ready for deployment."

Walk through creating `.claude/commands/deploy-check.md`:
```markdown
---
description: Pre-deployment checklist verification
allowed-tools: Bash, Read, Grep
---
Run a pre-deployment checklist:
1. Run `!python src/manage.py test` — verify all tests pass
2. Check for any `print()` or `console.log()` debug statements in source code
3. Verify no `.env` files are staged for commit
4. Check that migrations are up to date with `!python src/manage.py showmigrations`
5. Report results as a checklist with pass/fail for each item
```

Demonstrate running `/deploy-check`.

**[1:18]** Configure a PostToolUse hook together.

> "Now let's add the auto-test hook. Open your settings."

Walk through adding the hook to `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(python src/manage.py test)"
    ]
  },
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

Ask Claude to make a small change and watch the hook trigger automatically.

**[1:25]** Set up rules files together.

> "Let's split our CLAUDE.md conventions into modular files."

Create:
- `.claude/rules/testing.md` — testing conventions
- `.claude/rules/api-conventions.md` — DRF patterns for this project

Show that Claude reads them automatically.

**[1:30]** (Optional if time) Create a custom sub-agent.

Create `.claude/agents/code-reviewer.md`:
```yaml
---
name: code-reviewer
description: Reviews code changes for quality issues. Use proactively after edits.
tools: Read, Grep, Glob
model: sonnet
---
You are a code reviewer for a Django + React project.
Review modified files for: import errors, missing error handling,
security issues, and deviations from project patterns.
Be concise. Flag only real issues, not style preferences.
```

### Speaker Notes — Phase 2: Independent Work

**[1:33]** Hand out the worksheet.

> "Now it's your turn. Switch to your BulkSource project. The worksheet guides you through creating a custom command, configuring a hook, and setting up rules files. You have about 30 minutes."

**[1:33-1:55]** Circulate the room. Common issues to watch for:
- Hook command paths — make sure they match the student's actual test command
- `.claude/commands/` vs `.claude/skills/` confusion — commands are user-invoked, skills are model-invoked
- MCP server authentication — help with GitHub token setup if needed
- Rules files not loading — check file is valid markdown with `.md` extension

**[1:55]** Five-minute warning.

> "Five minutes. Make sure your custom command works and your hook triggers when Claude edits a file. If you haven't set up rules files yet, that's OK — we've covered the concepts."

### Transition
> "Let's wrap up. Questions?"

---

## Block 6: Q&A & Wrap-Up (5-10 min)

### Objectives
- Answer questions
- Reinforce key takeaways
- Preview Session 3

### Speaker Notes

**[2:00]** Open the floor.

**[2:05]** Reinforce three takeaways:

> "Three things from today:
> 1. **Custom commands are your team's shared playbook.** If you find yourself typing the same prompt twice, make it a command. Commit it to git. Everyone benefits.
> 2. **Hooks are your safety net that never forgets.** PostToolUse auto-testing catches regressions the moment they happen — not 30 minutes later when you remember to run tests.
> 3. **Scale your CLAUDE.md with rules files and subdirectory CLAUDE.md.** Keep the root lean, put deep context where it's needed, and let different team members own different files."

**[2:08]** Preview Session 3.

> "Next session, we'll cover advanced workflows — building multi-step pipelines with sub-agent chains, CI/CD integration with the claude-code-action GitHub Action, and how to build a correction-learning system that turns your manual fixes into permanent rules. Between now and then, try using the custom commands and hooks you built today on your daily work. Notice what's missing — that's what we'll add next time."

**[2:10]** Close.

> "Great work. You've gone from basic Claude Code usage to building team-level automation. See you next session."

---

## Instructor Preparation Checklist

### Before the Session
- [ ] Verify energycorp repo is clean (revert Session 1 demo changes)
- [ ] Pre-create `.claude/commands/` directory in energycorp
- [ ] Test the GitHub MCP server installation command
- [ ] Prepare a GitHub Personal Access Token for the MCP demo (or use existing)
- [ ] Test the PostToolUse hook with Django tests on energycorp
- [ ] Review Session 1 student worksheets for common issues
- [ ] Have `06_Student_Worksheet.docx` ready to distribute
- [ ] Prepare screen sharing with increased font size

### Technical Requirements
- Everything from Session 1, plus:
- GitHub CLI (`gh`) installed for MCP demo
- Node.js for any MCP servers that use `npx`
- Write access to `.claude/` directory in energycorp

### Backup Plans
- If MCP server install fails: Show pre-configured MCP and skip live install
- If hook doesn't trigger: Show the settings.json manually and explain the expected behavior
- If students don't have between-session experience: Use energycorp examples throughout
