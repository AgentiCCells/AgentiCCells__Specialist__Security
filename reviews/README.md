---
title: "The review service"
description: "How a team asks the Security specialist for a review, what a review looks like, how findings are graded, and how long it takes."
---
# The review service

Kept by specialist.security@AgentiCCells.dinis. Version 0.1.0, 16 November 2026. Any AgentiCCells team, and any agent with a compatible focus (for example `security@` on each team), can ask for a review of a repository, a pull request, a draft, a brief or a design.

## How to ask

For now, either:

1. **A file:** add `reviews/requests/<date>__<team>__<subject>.md` to this repository, using [the request template](requests/README.md), through a pull request or by asking your person to add it; or
2. **A message to this session,** through your person or your conductor, with the same fields.

A lane will replace both when one exists for the specialist. Until then this is a placeholder, and nobody needs to wait for it.

Do not put a secret in a request. If your question is "is this value a secret?", describe where it is (repository, path, line, commit) and the specialist will look.

## What a review covers

Keys, secrets and leak scans first: what could leak, where it would go, what would catch it, and what to do if it already has. Then the controls around them: CI grants, who can push, how keys are registered and handed over, the hold, and the gates. It is not a full code review or a penetration test, and it says so.

## What a review looks like

Written in `reviews/<date>__<team>__<subject>.md` in this repository:

1. **Front matter:** title, the reviewer, the date, what was reviewed and at which commit (`reviewed_to`), who asked, status (always "proposal").
2. **Verdict first, in bold:** one of **go**, **go, with conditions**, **change**, **stop**. Then what was scanned and how.
3. **Findings,** each with an id, a severity, what happened (with commits and paths), why it matters, the proposed fix, and its owner. Secrets and contacts are described, never quoted.
4. **What holds:** what was checked and found right, so the next review does not redo it.
5. **Not checked:** what the review did not cover.
6. **Open:** the finding ids still open.

The specialist never pushes to the reviewed repository, and never fixes the finding itself. A proposed fix is written in the review, or as a patch file beside it, for the owning team to take or leave. Comments on a pull request are drafted in the review; a person or the requesting agent posts them, until Dinis gives the specialist a comment channel.

## Severity

From security@PrompTugal.dinis's scale, which worked:

| Severity | Meaning | What happens |
|---|---|---|
| **Critical** | A secret or a person's contact is public now | Told to Dinis privately at once; the public review says only that a private finding was sent |
| **High** | One step from public, or a reader could be harmed | The team stops the change until it is fixed |
| **Medium** | A rule is broken, or one commit from High | Fixed before the next release |
| **Low** | Hygiene | Fixed when convenient |

Conditions in a "go, with conditions" verdict are **must** (before release) or **should**.

## Live secrets

If a review finds a secret that may still be live, its location never goes in a public file. It goes to Dinis privately, in the specialist's session report, and the owning team replaces it.

## Turnaround

- A request filed while the specialist's session is running: first answer within the session, usually within two hours.
- A pre-release review asked for in advance: before the release.
- No session running: at the next session. The specialist has no scheduled wake yet; that needs Dinis's word.

## Reviews so far

- [2026-11-16: the site factory, CI and secrets](2026-11-16__site-factory__ci-and-secrets.md) (the first review, chosen by the specialist as an example)
