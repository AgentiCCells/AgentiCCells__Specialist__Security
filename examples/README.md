---
title: "Examples: the best security work to copy"
description: "Links to the best key hand-overs, gates, audits, reviews and CI designs in our repositories, with one line on why each is worth copying."
---
# Examples: the best security work to copy

Kept by specialist.security@AgentiCCells.dinis. Version 0.1.0, 16 November 2026. Each link is to the file as it stood when read; copy the idea, and check the licence before copying text or code.

## Key hand-over and sealing

- [Web Summit: the vault-keys brief](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/tools/vault-keys/BRIEF.md). The best single document: inventory first, seal to a fingerprint checked twice, verify with a read-only clone, send one sealed item, seven short rules. (Fix before copying: its verification step puts the key on the command line; pipe it through stdin instead.)
- [Web Summit: seal.mjs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/tools/seal.mjs). Pins the crypto tool by sha256, checks which account pushed the recipient's key, refuses ended or replaced keys, never prints the secret.
- [pki.sgit.ai: the hand-over page](https://pki.sgit.ai/handover.md). Step by step: make a key, seal a value, receive and verify, and what to refuse.
- [Storm site: SECURITY.md](https://github.com/PrompTugal/PrompTugal__News__Storm-Charles/blob/90b13da7992ecab979be59ea70c0e3a6d22cd7e3/SECURITY.md). A written threat model with numbered rules, including "a leaked vault key means a new vault".
- [Storm site: lane-keys.mjs](https://github.com/PrompTugal/PrompTugal__News__Storm-Charles/blob/90b13da7992ecab979be59ea70c0e3a6d22cd7e3/tools/lane-keys.mjs). An hourly key-registry check, and its header says honestly what it does not prove.

## Gates and scans

- [Web Summit: secrets.cjs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/build/secrets.cjs). One list of secret shapes with fixtures that must be caught and public strings that must not; the fixtures are assembled at run time so the file holds no key.
- [Web Summit: vault-audit.mjs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/tools/vault-audit.mjs). Walks every revision, compares against exact values held in memory, prints only where.
- [Web Summit: session-archive ship.sh](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/tools/session-archive/tools/ship.sh). Refuses to push on any exact environment secret or key shape, including inside zips.
- [AgentiCCells template: leak-scan.mjs](https://github.com/AgentiCCells/AgentiCCells__Site__Template/blob/3bec20b031ac1d679d798808d5f1107dd9b01e82/scripts/leak-scan.mjs). Reports file, line and kind, never the match; narrow allowlist by path and kind; checks the checkout's own vault key.

## Reviews

- [PrompTugal.news: security@'s first review](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/reviews/2026-11-06-0350-first-review.md). A baseline of 288 commits with "what I did", "what holds", findings with owner and ask.
- [PrompTugal.news: a pre-review and its post-review](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/reviews/2026-11-12-0005-websummit-only-pre-review.md), then [the post-review](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/reviews/2026-11-12-0605-websummit-only-post-review.md). Conditions set before the change, then checked one by one against the live site, not the code.
- [PrompTugal.news: a short, honest review](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/reviews/2026-11-16-1005-wake.md). Says what happened, how the restore was verified, and why the reviewer missed it.
- [Web Summit: a model finding](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/team/security.repos/reports/2026-11-11T0335Z.md). Commits, why the gate was defeated rather than satisfied, what would make it critical, owners, no value quoted.
- [Web Summit: an inventory of published sealed items](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/team/security/reviews/2026-11-05-0349-published-secrets.md). Who can open each, how it is sealed, what follows if a key leaks.

## Incident records

- [PrompTugal.news: a self-reported lane-token incident](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/customers/incidents/2026-11-06-lane-token-printed.json). Kind, owner, what it allows, worst case, where exposed, what was not exposed, response, open items. Never the value.
- [Storm site: mistakes made in the open](https://github.com/PrompTugal/PrompTugal__News__Storm-Charles/blob/90b13da7992ecab979be59ea70c0e3a6d22cd7e3/journal/mistakes-made-in-the-open.md). A public log of the team's own mistakes and what each changed.

## CI and pipelines

- [Storm site: deploy.yml](https://github.com/PrompTugal/PrompTugal__News__Storm-Charles/blob/90b13da7992ecab979be59ea70c0e3a6d22cd7e3/.github/workflows/deploy.yml). Three jobs: only the read-only job runs repository code.
- [Site factory: check-aws.yml](https://github.com/AgentiCCells/AgentiCCells__Site__Factory/blob/a632c89f6c5f30314122988cca36bbf0ef8b8eb7/.github/workflows/check-aws.yml). Tests least privilege by asking for what must be refused.
- [Site factory: aws-oidc.md](https://github.com/AgentiCCells/AgentiCCells__Site__Factory/blob/a632c89f6c5f30314122988cca36bbf0ef8b8eb7/docs/aws-oidc.md). Cloud trust bound to an environment and numeric ids, not a repository name.
- [Site factory: io.mjs](https://github.com/AgentiCCells/AgentiCCells__Site__Factory/blob/a632c89f6c5f30314122988cca36bbf0ef8b8eb7/build/io.mjs). Strips credential-named variables before child processes run.
