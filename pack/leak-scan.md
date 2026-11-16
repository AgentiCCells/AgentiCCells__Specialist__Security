---
title: "Pack: the leak scan"
description: "Where the AgentiCCells leak scan runs, what it checks, what it misses, and how to handle a false positive without weakening it."
---
# Pack: the leak scan

From the day-one pack of specialist.security@AgentiCCells.dinis, version 0.1.0, 16 November 2026. The script: `scripts/leak-scan.mjs` in the site template (https://github.com/AgentiCCells/AgentiCCells__Site__Template/blob/3bec20b031ac1d679d798808d5f1107dd9b01e82/scripts/leak-scan.mjs), written by security@agenticcells.dinis on 15 November 2026.

## Where it runs

- **Before every push, after the final commit:** `scripts/release.sh` runs it. Do not push with plain `git push`.
- **In CI:** the Pages workflow runs it again. CI runs after the push is public, so it is the second line, not the first.
- **Once over the full history,** on a full clone, when a repository is created or adopted: `node scripts/leak-scan.mjs --history`.

## What it checks

Every tracked file, every untracked file that is not ignored, and the built `_site/`: private key blocks; AWS, GitHub, Google, Slack, Anthropic and OpenAI key shapes; JSON Web Tokens; sgit vault and read keys; a bare `passphrase:vault_id` pair; a secret-looking value assigned to a secret-looking name; long high-entropy strings; public keys outside `team/keys`; any file from `.sg_vault/local/`; and this checkout's own vault key or token. It prints file, line and kind, never the match.

## What it does not see

Know these, because they are where our leaks actually happened:

- Session transcripts, chat messages and messages between sessions.
- Commit and tag messages, pull request text, comments, CI logs and uploaded artifacts.
- Secrets added in a merge commit, in `--history` mode.
- Binary files (images, archives, key files in DER form) and UTF-16 text: skipped.
- Secrets inside URLs; low-entropy passwords not assigned to a secret-like name.
- Token shapes it does not list (Stripe, npm, PyPI, GitLab, Hugging Face, Azure, SG/Send).
- Anything pushed without running it.

pki.sgit.ai publishes private keys for five made-up test people on purpose (`/directory/fixtures/`). If you copy them into tests, the scan will flag them. That is correct: build such fixtures at run time instead.

## A false positive

1. Check it really is public (a public OIDC subject, a commit id in a link).
2. Add **one** allowlist entry: one path, one kind, a reason, in the same commit, and say why in the commit message.
3. Never allowlist a whole file for every kind, never relabel a value to pass, never disable the scan.
4. Tell the Security specialist, so the scan can be fixed for every team.

## Proposed improvements (proposals, not decisions)

From the review of the scan on 16 November 2026. Each would be made by the scan's owner, with fixtures:

1. A pre-push hook installed by the release script; and GitHub secret scanning push protection on public repositories (a setting only Dinis can turn on).
2. Allowlist by a hash of the allowed value (never the value), so a new secret in the same file still fails.
3. Scan commit and tag messages in the pushed range, merges in `--history`, and a `--text <file>` mode for hand-overs, summaries and CI artifacts.
4. Fail on key-file names wherever tracked (`.pem`, `.key`, `.p12`, `.pfx`, `id_rsa*`, `.env*`); decode UTF-16.
5. A rule for credentials in URLs (`scheme://user:pass@host`).
6. More token shapes, with fixtures.
7. In CI, compare files and logs against the job's own secret values.
