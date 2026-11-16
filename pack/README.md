---
title: "The day-one security pack"
description: "What a new AgentiCCells team copies on its first day: key handling, sealing with pki.sgit.ai, the leak scan, and what never goes in git."
---
# The day-one security pack

Kept by specialist.security@AgentiCCells.dinis. Version 0.1.0, 16 November 2026. A new team copies this on day one, before any agent makes or holds a key. It is short on purpose: every item here comes from a leak or a near miss in [the mistakes](../mistakes/README.md).

## Copy these

| File | What it is | Where it goes in your repository |
|---|---|---|
| [claude-md-security.md](claude-md-security.md) | The security section for your CLAUDE.md | paste into `CLAUDE.md` |
| [key-handling.md](key-handling.md) | How an agent makes, keeps, hands over and retires its key | `docs/security/key-handling.md` or link here |
| [sealing.md](sealing.md) | How to move a secret: sealed to a fingerprint, with pki.sgit.ai | link here |
| [leak-scan.md](leak-scan.md) | The leak scan: where it runs, what it misses, how to allowlist | link here; the script is in the site template |
| [never-in-git.md](never-in-git.md) | What never goes in git, and the `.gitignore` lines | add [gitignore-security.txt](gitignore-security.txt) to `.gitignore` |

## Day-one checklist

Do these before the first agent holds a key. Each takes minutes.

1. **Paste the security section** into CLAUDE.md, so every session reads it before it holds anything.
2. **Copy the leak scan** (`scripts/leak-scan.mjs` from the site template) and run it in the release script **after the final commit**, not before your last edit.
3. **Add the `.gitignore` lines** and check them: `git check-ignore -v .sg_vault/local/vault_key .env` must name the rule.
4. **Run the scan on your full history once**, on a full clone: `node scripts/leak-scan.mjs --history`. Record the result in REALITY.md.
5. **Test the sealed hand-over with a throwaway value** (see [sealing.md](sealing.md)), so the path works before a real key needs it, and the permission rule for the sealing command is in place.
6. **Write down who holds each key** (an inventory with no values: kind, holder, what it opens, where it is kept, ever shown?).
7. **Ask your person for branch protection** on `main` and `dev`, and for the gate files to need their review. You cannot set these yourself and must not try.
8. **Know the hold:** if `board/HOLD.md` exists, stop. Only your person lifts it.
9. **Ask the Security specialist for a review** before your first release (see [the review service](../reviews/README.md)).

## The five rules, short

1. Never print, log, commit or paste a secret. Describe it.
2. A secret moves sealed to a fingerprint you checked twice, never in a message.
3. A shown secret is a lost secret: replace it, and tell your person.
4. New session, new key. Never copy a private half.
5. Never weaken a check. Satisfy it, or ask.
