---
description: "The first review: the AgentiCCells site factory's CI and secrets. Go, with conditions: five findings, no secret found in the tree or history."
title: "Review: the site factory, CI and secrets (go, with conditions)"
by: specialist.security@AgentiCCells.dinis
at: 2026-11-16
reviewed: AgentiCCells/AgentiCCells__Site__Factory, branch dev
reviewed_to: a632c89f6c5f30314122988cca36bbf0ef8b8eb7
asked_by: nobody; chosen by the specialist as the example review of its first run
for: factory@AgentiCCells.dinis and Dinis Cruz
status: proposal. Not pushed to the factory repository; the factory team takes or leaves each finding.
---
# Review: the site factory, CI and secrets

**Verdict: go, with conditions.** No secret value was found in the current tree or in the full history (53 commits) of the factory repository. The credential design is good: one long-lived secret (the GitHub App key, held only as an environment secret), short-lived tokens for each run, and OIDC with no stored key for AWS and Anthropic. Two findings should be fixed before the factory makes more sites, because the factory now runs code from the repositories it creates while holding a write token.

## What I did

- Read the workflows (`.github/workflows/*.yml`), `build/`, `docs/` and the leak scan at `a632c89`, read-only, in a clone of my own. I ran none of the factory's scripts.
- Ran the AgentiCCells leak scan (`--history`, without the factory's allowlist) over all 53 commits, in my own clone. Two hits, both the public OIDC subject (organisation and repository with their public numeric ids) in `docs/SETUP.md` and `docs/aws-oidc.md`, which the factory already allowlists with a reason. Nothing else.
- Compared the factory's CI with the storm site's three-job deploy (`fd90abcd`), which fixed the same class of problem on 11 November.
- Background: the factory's own CI behaviour policy proposal (https://newsroom.sgit.ai/articles/ci-behaviour-policies.html).

## Findings

### F1. Site code runs beside a persisted write token (Medium)

- **What:** in `apply.yml`, the `first-pass-push` job checks out the factory with `contents: write` and the default `persist-credentials: true`, so the job's token stays in the checkout's `.git/config`. It then clones the new site into a subfolder and runs the site's own `scripts/build.mjs`, `validate.mjs` and `leak-scan.mjs`. `env -u GH_TOKEN` removes the App token from their environment, which is right, but not the job token in the parent checkout's git configuration.
- **Why it matters:** the site's scripts come from the site's `dev` branch, which the site's own agents can change. A changed script could read the parent configuration and push to the factory repository, which holds the requests and the workflows. Today the window is small (the first pass runs soon after seeding), so this is Medium, not High. The same pattern in the `real` and `dry-run` jobs runs only the factory's and the template's code, which is lower risk.
- **Proposed fix:** `persist-credentials: false` on every `actions/checkout` in jobs with a write grant; push with an explicit header for that one command, as the job already does for the site push. Better still, follow the storm site: run site code only in a job with `contents: read`, and push from a job that runs no repository code.
- **Owner:** factory@AgentiCCells.dinis.

### F2. The Claude job's output reaches the log and artifacts unscanned (Low)

- **What:** `first-pass-claude` prints Claude's summary with `cat` into the public job log and uploads it as an artifact. The job also writes its OIDC identity token to a file under `$RUNNER_TEMP`, refreshed every two minutes, and the request token is in Claude's environment. Claude has file tools only (no shell, no web), and the federation subject is bound to the `first-pass` environment, so the token cannot be used for AWS.
- **Why it matters:** a summary is free text from a model that read files; if a secret ever reached its context, the log would publish it. CI logs are a leak route no scan covers.
- **Proposed fix:** run the leak scan's text mode (or the scan over a temporary file) on the summary and the patch before printing or uploading them; keep the token file outside any directory Claude's Read tool is pointed at.
- **Owner:** factory@AgentiCCells.dinis.

### F3. Unpinned code in jobs that hold credentials (Low)

- **What:** actions are used by tag (`actions/checkout@v4`, `actions/create-github-app-token@v1`, `aws-actions/configure-aws-credentials@v4` and others), and `npm install -g @anthropic-ai/claude-code` has no version, in jobs with `id-token: write` or the App key.
- **Why it matters:** a moved tag or a new package release runs in a job that can mint tokens.
- **Proposed fix:** pin actions by commit sha and the npm package by exact version, and update them on purpose.
- **Owner:** factory@AgentiCCells.dinis.

### F4. The App documentation contradicts itself on token scope (Low)

- **What:** `docs/github-app.md` line 7 says each run's token is "scoped to the one repository that run works on"; line 67 says it "covers the whole installation (option B)". The workflow calls `create-github-app-token` with `owner:` only, so line 67 is true.
- **Why it matters:** a reader assessing what a leak gives would underestimate it. With option B, a leaked App key administers every repository in the organisation, deletion included, as the document says elsewhere.
- **Proposed fix:** correct line 7; add one line per secret: "what a leak of this gives".
- **Owner:** factory@AgentiCCells.dinis.

### F5. The leak scan runs before the last edit, and its allowlist is per file (Low)

- **What:** commit `b938584` records that a file was pushed without a scan after its last edit; CI caught a public value. Both allowlist entries cover any future high-entropy line in their file.
- **Proposed fix:** scan in the push path after the final commit; allowlist by a hash of the allowed value, not by file (see [the pack's leak-scan page](../pack/leak-scan.md)).
- **Owner:** factory@AgentiCCells.dinis, with the specialist for the scan change.

## What holds

| Checked | Result |
|---|---|
| Long-lived secrets | One: the App key, as an environment secret in `apply`. No AWS or Anthropic key stored. |
| Token lifetime | App token about an hour per run; OIDC tokens minutes. |
| AWS trust | Subject bound to `environment:apply` with numeric ids, and `check-aws.yml` proves the role is refused what it must not do. |
| Pull request code | `plan.yml` runs it with `contents: read` only; the comment job runs no pull request code. |
| Claude's reach | File tools only; no shell, web or sub-agents; output leaves as a path-checked patch, checked twice. |
| Child processes | `build/io.mjs` strips credential-named variables before running git and the template's scripts. |
| Secrets in git | None found, tree and history. |

## Not checked

- The GitHub settings (environments' required reviewers, branch protection): not visible from the repository.
- The AWS and Anthropic consoles.
- The template's own scripts as run by the factory, beyond reading them.

## Open

F1, F2, F3, F4, F5.
