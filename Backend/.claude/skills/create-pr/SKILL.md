---
name: create-pr
description: Creates a pull request with the specified changes. Stages all changes, commits with a clear message, pushes to a new feature branch, and creates a GitHub PR with a detailed description covering what it does, API spec, permissions, and frontend integration instructions.
allowed-tools: Bash, mcp__github__create_pull_request, mcp__github__push_files, mcp__github__create_branch, mcp__github__list_pull_requests, mcp__github__get_pull_request
context: fork
agent: general-purpose
---

# Create Pull Request Skill

## Workflow

### Step 1: Analyze Changes

1. Run `git status` and `git diff --stat` to understand what will be included.
2. Run `git log --oneline -10` to see recent commit style.
3. Determine the branch name: use the one provided by the user, or derive one from the changes.

### Step 2: Draft PR Artifacts

1. Draft the commit message, PR title, and PR description body following the PR Content format below.

### Step 3: Execute

 1. **Get the list of changed files**: Run `git diff master --name-only` and `git status --porcelain` to identify all modified, added,    
     and untracked files.
 2. **Read each changed file's content** from the working tree.
 3. **Push to GitHub via MCP**: Use `mcp__github__push_files` to push all changed files to a new branch on GitHub. This creates the bra   
     nch and commits in one step — do NOT use `git push`. Provide:
    - `owner` and `repo` (parse from `git remote get-url origin`)
    - `branch` — the new feature branch name
    - `message` — the commit message
    - `files` — array of `{ path, content }` for every changed file (read content from disk)
 4. **Create the GitHub PR**: Use `mcp__github__create_pull_request` to open a pull request against the `master` branch. If the MCP tool is unavailable, fall back to `gh pr create` via Bash.
 5. **Return the PR URL** when done.

## PR Content

The PR should include:

- **Title**: A concise summary of the feature (e.g., "Add dashboard summary endpoint for manager view")
- **Description** with these sections:
  - **What it does**: Brief overview of the feature or fix
  - **API Spec**: Endpoint path, HTTP method, request/response format, status codes
  - **Permissions**: Which roles can access it (Admin/Manager/Operator) and the permission class used
  - **Frontend Integration**: Instructions for the frontend team on how to consume the new endpoint, including example Axios calls and expected response shapes

## Error Handling

- If there are no changes to commit, stop and report that there is nothing to do.
- If the branch already exists on the remote, append a short suffix (e.g., `-v2`) and retry.
- If the PR creation fails, show the error and suggest manual steps.