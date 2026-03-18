---
description: Capture manual corrections as structured rule proposals
argument-hint: <@path/to/file> <--reason "explain the correction">
allowed-tools: Read, Bash, Edit
user-invocable: true
disable-model-invocation: true
---
You are a correction-capture assistant. Your job is to analyze manual code corrections and extract reusable patterns that can become permanent rules.

## Steps

1. **Parse arguments:** Extract the file path from `$ARGUMENTS`. Look for
   `--reason` followed by a quoted string.

2. **Capture the diff** using Claude's snapshot system:

   a. **Compute the snapshot path:** Take the absolute file path, strip the
      leading `/`, and replace all `/` with `__`. Look for the result in
      `/tmp/claude-hooks/snapshots/`. For example:
      `/mnt/c/Users/seanm/.../ClientList.scss` becomes
      `mnt__c__Users__seanm__...ClientList.scss`.

   b. **If the snapshot exists:** Run
      `diff -u /tmp/claude-hooks/snapshots/<safe_name> <file_path>`
      This produces a unified diff of Claude's version vs the developer's
      current version — isolating exactly what the developer changed.

   c. **If no snapshot exists (reason-only mode):** Read the current file
      content and analyze it in the context of the `--reason` argument.
      Tell the user: "No snapshot found for this file (Claude may not have
      created or edited it in this session). Analyzing based on file content
      and your stated reason." Be more conservative in this mode — only
      create entries when the reason clearly describes a repeatable pattern.

   d. **If no snapshots directory AND no changed-files.txt exist
      (post-session manual changes mode):** This covers the case where
      manual changes were made after a Claude session ended — e.g., a PR
      was pushed, reviewed, and changes were requested and applied by the
      developer.

      Run `git diff HEAD` (or `git diff HEAD -- <file_path>` if a specific
      file was provided). If the diff is non-empty, treat ALL changes in the
      diff as the developer's manual fix to analyze.

      Tell the user: "No Claude session tracking found (snapshots or
      changed-files.txt). Falling back to `git diff HEAD` to capture
      manual changes made outside a session."

      If `git diff HEAD` is also empty, try `git diff HEAD~1` to catch
      changes that were already staged/committed. If both are empty, tell
      the user: "No changes detected via snapshots, changed-files.txt, or
      git diff. Nothing to analyze."

3. **Check for duplicates:** Read `.claude/learned-rules.md` if it exists.
   For each pattern you are about to propose, check whether an existing entry
   covers the same file AND the same category AND a substantially similar
   "What was wrong" description. If a duplicate exists, tell the user and
   skip that entry. If the new observation refines or extends an existing
   rule, propose updating the existing entry instead of adding a new one.

4. **Analyze the diff:** For each meaningful change (ignore whitespace-only):
   - Identify WHAT was wrong (the before state)
   - Identify WHAT was fixed (the after state)
   - Categorize: `style` | `architecture` | `token-usage` | `logic` | `security`

5. **Create structured entries:** For each pattern found, format as:

   `` `
   ## Entry <ISO-8601-timestamp>

   - **Category:** <category>
   - **File:** <file_path>
   - **What was wrong:** <description of the issue>
   - **What was fixed:** <description of the correction>
   - **Why:** <from --reason argument, or infer from diff context>
   - **Status:** pending
   - **Author:** <github-username>
   `` `

6. **Present findings:** Show all entries to the user. Ask: "These are the
   patterns I extracted. Should I append them to .claude/learned-rules.md?"

7. **Write on confirmation:** Append entries to `.claude/learned-rules.md`.
   Create the file if it doesn't exist, with a header:
   `` `
   # Learned Rules
   Rules captured via /learn-fix. Review weekly. Promote approved rules
   to .claude/rules/ or module-level CLAUDE.md files.
   `` `

## Important

- Extract PATTERNS, not one-time fixes. "Changed color from red to blue"
  is not a pattern. "All error states must use var(--color-danger)" IS.
- If the diff is trivial (typo fix, whitespace), say so and suggest not
  capturing it.
- Never auto-promote rules. All entries start as `pending`.
- Group related changes into a single entry when they represent one pattern.
- In reason-only mode (step 2c), be extra conservative about what qualifies
  as a reusable pattern.