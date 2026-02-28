# Demo Script: Multi-Repo Setup with GitHub MCP

**Duration:** 20 minutes
**Repo:** `energycorp` (Backend = Django REST API, Frontend = React SPA)
**Prerequisites:** Claude Code installed, GitHub CLI authenticated (`gh auth status`), energycorp cloned

---

## Demo Setup (Before Students Arrive)

- [ ] Open a clean terminal window (no prior Claude sessions)
- [ ] Navigate to the energycorp root directory
- [ ] Verify both `Backend/` and `Frontend/` directories exist
- [ ] Clear any previously registered MCP servers that might conflict: `claude mcp list`
- [ ] Ensure you're on a clean git branch: `git checkout -b demo/be-session-1`
- [ ] Verify GitHub CLI authentication: `gh auth status`
- [ ] Have the energycorp repo pushed to a GitHub remote (for PR creation)
- [ ] Pre-open `Backend/src/rest/urls.py` and `Backend/src/reports/views.py` in your editor for reference

---

## Part 1: Register GitHub MCP (3 minutes)

**Goal:** Show students how to register an MCP server in one command.

### Steps

1. From the energycorp root directory, register the GitHub MCP:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp
```

> **Say:** "One command. We're telling Claude Code to connect to GitHub's MCP server over HTTP. The name 'github' is what we'll see in our MCP list. The URL is GitHub's official MCP endpoint."

2. Verify registration:

```bash
claude mcp list
```

> **Say:** "You should see 'github' in the list with the HTTP transport. If you also have the Figma MCP from the frontend session, that's fine — they coexist. This registered at the **local** scope — your personal `~/.claude.json`. If you wanted the whole team to have it, you'd put it in `.mcp.json` at the project root. There are three scopes: local (personal, all projects), project (`.mcp.json`, committed and shared), and user config (personal, all projects)."

3. Start a Claude Code session to complete authentication:

```bash
claude
```

4. Inside the session, authenticate:

```
/mcp
```

Select the `github` server and follow the OAuth authentication flow in your browser.

> **Say:** "MCP servers that need authentication — like GitHub — will prompt you the first time. This is a one-time OAuth flow. After this, Claude can call GitHub tools in every session."

5. Verify authentication worked by asking:

```
Can you access GitHub? Try listing recent issues or PRs for this repository.
```

> **Say:** "If Claude can list issues or PRs, the MCP is working. If it can't, re-run the `/mcp` authentication flow — the GitHub MCP uses OAuth, so it needs its own authorization separate from `gh` CLI. Note that MCP servers can be slow on their first call while the connection warms up — that's normal."

Exit the session (`/exit` or Ctrl+C) for the next part.

---

## Part 2: Launch with Multi-Repo Context (3 minutes)

**Goal:** Show how `--add-dir` extends Claude's vision across repositories.

### Steps

1. Navigate to the Backend directory and launch Claude with the Frontend visible:

```bash
cd Backend
claude --add-dir ../Frontend
```

> **Say:** "I'm starting from the Backend directory — that's my primary context. The `--add-dir ../Frontend` tells Claude it can also read and search files in the Frontend directory. If these were separate repos, the same flag works — just point to wherever the other repo lives. You can also add directories mid-session with `/add-dir /path/to/other/project` if you realize you need cross-repo access after launching."

> **Say:** "One thing to know: CLAUDE.md files from additional directories are **not** loaded by default. Claude won't pick up the Frontend's CLAUDE.md rules. If you need them, set the environment variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`. For most backend work, you don't need this — you just need to read the frontend files."

2. Verify Claude can see both directories:

```
List the top-level files in both the Backend and Frontend directories.
Show me the directory structure.
```

> **Say:** "Notice Claude lists files from both directories. It treats them as one unified codebase for search and reading purposes. Watch — it shows the Django apps in Backend and the React components in Frontend."

3. Show `@` mention navigation:

```
Look at @src/rest/urls.py — what API endpoints are registered?
```

> **Say:** "The `@` symbol is your navigation shortcut. I'm referencing a file in my primary directory — Backend/src/rest/urls.py. Claude loads it immediately into context."

Now reference a Frontend file:

```
Now look at @../Frontend/src/App.js — what routes does the React app define?
```

> **Say:** "And here I'm referencing a file in the additional directory. Claude can see it because of `--add-dir`. Notice the path is relative to where I launched Claude — the Backend directory."

> **Say:** "One known limitation: files from `--add-dir` directories don't appear in `@` autocomplete — that's a confirmed bug (GitHub Issue #7412). You'll need to type the full path manually, like I just did. It's expected to be fixed in a future release."

---

## Part 3: Cross-Repo API Contract Discovery (5 minutes)

**Goal:** Show Claude finding the connection between Django views and React fetch calls.

### Steps

1. Ask Claude to trace an API contract:

```
I want to understand the Login API flow. Look at the Login view in
src/users/views.py, then search the Frontend code for where this API
endpoint is called. Show me both sides of the contract — what the
backend returns and what the frontend expects.
```

> **Say:** "This is the killer feature. Watch Claude read the Django view, find the endpoint URL, identify the response format — token, user_type, message — then search the React code for the matching fetch call. It's seeing both sides simultaneously."

Walk through the output together:
- Point out the Django view's response structure
- Point out where the React code calls `/api/user/login/`
- Highlight any mismatches or assumptions

> **Say:** "In a real project, this is how you catch contract mismatches before they become bugs. Claude can see that the backend returns `user_type` as an integer and the frontend checks `response.data.user_type === 1`. If someone changes the backend to return a string, Claude would flag that."

2. Ask Claude to map all API endpoints:

```
Create a quick summary table of all Django API endpoints defined in
src/rest/urls.py and the app-level urls.py files. For each endpoint,
show: HTTP method, URL pattern, view class, and whether there's a
corresponding React fetch call in the Frontend.
```

> **Say:** "This is your API mapping document. It tells you which endpoints have React consumers and which don't. Any endpoint without a frontend consumer is either unused or called by something else — both worth investigating."

---

## Part 4: Implement a New Endpoint (5 minutes)

**Goal:** Show Claude creating a Django endpoint that serves the React frontend.

### Steps

1. Ask Claude to create a new endpoint:

```
Add a new Django REST endpoint to the reports app:

GET /api/reports/dashboard-summary/

It should return:
- total_clients: count of active Client objects
- total_invoices: count of Invoice objects where stateInvoice=True (unpaid)
- total_revenue: sum of valuePayment from all Payment objects

Use the existing AllowManager permission class from reports/permissions.py.
Create the serializer, view, and URL configuration.

Also show me what a React service function would look like to call this endpoint,
matching the patterns in the Frontend code.
```

> **Say:** "Watch what Claude does. It's going to read the existing models to understand the field names and relationships, read the existing views to match the coding patterns, create the serializer, view, and URL config — and then show the React fetch call. All because it can see both repos."

2. Walk through the generated code together:

> **Say:** "Let's review what Claude generated."

Point out:
- **Serializer** — Does it match the existing pattern in `reports/serializers.py`?
- **View** — Does it use `AllowManager` correctly? Does it follow the DRF patterns from other views?
- **URL config** — Is it added to `reports/urls.py` correctly?
- **React service** — Does it match the Axios patterns in the Frontend code?

> **Say:** "Notice how Claude followed the existing patterns. It didn't invent new conventions — it read the existing code and matched them. That's the benefit of multi-repo context. Without seeing the Frontend, Claude might have guessed a different response format."

3. Verify the endpoint works:

```
Can you run the Django tests to make sure nothing is broken?
Use: python src/manage.py test
```

> **Say:** "Always verify. Even with multi-repo context, Claude can make mistakes. Run the tests."

---

## Part 5: Create a PR via GitHub MCP (4 minutes)

**Goal:** Show Claude creating a PR directly through the GitHub MCP.

### Steps

1. First, commit the changes:

```
Stage and commit the new dashboard-summary endpoint files.
Use a clear commit message.
```

2. Push and create a PR:

```
Push this branch and create a GitHub pull request.
Title: "Add dashboard summary endpoint for manager view"
Description should include:
- What the endpoint returns
- Which permission class is used
- How the frontend would consume it
```

> **Say:** "Watch this carefully. Claude is calling the GitHub MCP tools — `create_pull_request` — to create the PR directly. No browser, no copy-paste. It writes the title, the description, and links the changes."

3. Show the PR in the browser:

> **Say:** "Let me open this PR in the browser so you can see it."

```bash
# If Claude provides the PR URL, open it
# Otherwise:
gh pr view --web
```

> **Say:** "There's your PR. Created from the terminal, by Claude, using the GitHub MCP. The description includes the API spec, the permission model, and the frontend integration notes. This is what your workflow could look like every day."

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `claude mcp add` fails with network error | Check internet access; try `curl https://api.githubcopilot.com/mcp` to verify the endpoint is reachable |
| MCP authentication loop | Re-run `/mcp` → select github → Authenticate. The GitHub MCP uses its own OAuth flow — `gh auth login` alone is not sufficient |
| MCP server slow on first call | Normal behavior — MCP servers warm up on first invocation. Make a simple query first to warm the connection |
| `--add-dir` path not found | Use absolute paths: `claude --add-dir /full/path/to/Frontend` |
| Claude can't find Frontend files | Verify the path: `ls ../Frontend/src/` from the Backend directory |
| `@` autocomplete doesn't show Frontend files | Known bug (GitHub Issue #7412) — files from `--add-dir` directories don't appear in autocomplete. Type the full path manually |
| PR creation fails | Ensure branch is pushed: `git push -u origin demo/be-session-1` |
| Claude ignores existing patterns | Add `@src/reports/views.py` to your prompt so Claude reads existing views first |
| "Permission denied" on GitHub operations | Re-authenticate via `/mcp` → github → Authenticate with the `repo` scope |
| Tests fail after adding endpoint | Check import paths — Claude might use wrong relative imports if the project structure is unusual |

---

## Demo Clean-Up

After the demo, if you want to reset for the lab:

```bash
# Keep the branch for reference, switch back to master
git checkout master

# Or if you want students to see the demo code:
# Leave the branch as-is — students can reference it
```

> **Say:** "I'm going to leave this demo branch up so you can reference it during the lab. Now it's your turn."
