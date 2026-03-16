---
name: migration-check
description: Validates Django migration safety. Use PROACTIVELY after creating or modifying any migration file in Backend/src/.
allowed-tools: Read, Grep, Glob, Bash
context: fork
model: sonnet
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: |
            CMD=$(jq -r '.tool_input.command // empty')
            # Reject shell operators to prevent chaining bypasses
            if echo "$CMD" | grep -qE '[;&|]|\$\(|`'; then
              echo "BLOCKED: shell operators (;&|$()) are not allowed in migration-check commands" >&2
              exit 2
            fi
            # Anchor to manage.py + allowed subcommand only
            if echo "$CMD" | grep -qE '^python3\s+\S*manage\.py\s+(showmigrations|sqlmigrate\s+\S+\s+\S+|migrate\s+--check)\s*$'; then
              exit 0
            else
              echo "BLOCKED: migration-check skill can only run showmigrations, sqlmigrate, and migrate --check" >&2
              exit 2
            fi
---
# Django Migration Safety Checker

Analyze the most recently created or modified migration file for safety issues.

## Checks to Perform

1. **Reversibility**: Check that any RunPython operations include a reverse function (not `migrations.RunPython.noop` for destructive operations). Flag irreversible data migrations as CRITICAL.

2. **Safe field alterations**: AlterField operations should not change field types in ways that lose data (e.g., CharField → IntegerField). Flag unsafe type changes as CRITICAL.

3. **Orphaned RemoveField**: If a RemoveField operation exists, verify that no code still references that field. Use Grep to search for field references. Flag orphaned removes as CRITICAL.

4. **Index operations on large tables**: AddIndex or RemoveIndex on tables likely to have many rows should include a note about potential lock time. Flag as WARNING.

5. **Missing dependencies**: Verify that migration dependencies reference existing migrations. Use `python3 Backend/src/manage.py showmigrations` to check.

6. **SQL review**: Run `python3 Backend/src/manage.py sqlmigrate <app> <migration>` to see generated SQL. Flag any ALTER TABLE operations that could cause downtime.

## Output Format

For each check:
- PASS: [check] — safe
- CRITICAL: [check] — [details with file:line]
- WARNING: [check] — [concern]

If any CRITICAL findings exist, recommend: "Do NOT apply this migration until reviewed by the team."