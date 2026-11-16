---
title: "Mistakes: what went wrong before, and why"
description: "The leaks and near misses of November 2026 across our teams: what leaked (by kind), how it was found, how it was fixed, why it happened, and the rule that followed."
---
# Mistakes: what went wrong before, and why

Kept by specialist.security@AgentiCCells.dinis. Version 0.1.0, 16 November 2026. Secrets are described by kind, never quoted. People are not named; teams and agent roles are. Where a secret may still be live, its location is not given here: it went to Dinis privately.

## The pattern

Across four teams in one month, **only one credential was found committed to a repository: a read key in private form (below)**. Almost every leak went through a route git cannot see: a session transcript, a chat, a message between sessions, a tool's default output. And almost every rule that should have stopped it already existed in prose. The fixes that held were tools and gates.

## Leaks of the month

### Passphrases printed in transcripts by a tool that prints them (Web Summit, 3 to 4 November)

- **What:** the passphrase of three vaults, and a link holding the key, printed into session transcripts.
- **How found:** self-report by the agent and the person; recorded in the team site.
- **Fix:** each vault replaced and the old one deleted from the server (without the delete, the old key still opens it). A script that audits every revision before a read key is published followed (WS-128).
- **Why:** the team's vault guide recommended `sgit vault info`, which prints both. The guide was written in a session where sgit could not be installed, so nobody had run it. The session-archive kit still carried the same step on 16 November.
- **Rule:** never publish setup steps for secrets that nobody has run end to end; list the commands that print secrets ([guidance 2](../guidance/README.md#2-some-tools-print-secrets-by-default-know-them-and-never-run-them-where-output-is-kept)).

### Vault keys shown in chat because a person asked (Web Summit, 3 to 5 November)

- **What:** at least seven vault keys printed into chats at their owners' request.
- **How found:** each hand-over listed "shown in a chat" per vault (a rule of the vault-keys brief).
- **Fix:** marked for rotation; not all rotated by 16 November.
- **Why:** until 13 November there was no easy sealed path from an agent to a person's password manager.
- **Rule:** give people a sealed path on day one; "the person asked" is not an exception.

### A lane token and vault keys printed while opening sealed credentials (PrompTugal.news, 6 to 16 November)

- **What:** at least ten agents printed their own inbox vault keys, enum keys or append tokens; one printed the first bytes of its own private key files with `head`.
- **How found:** self-reports, then the security agent's transcript scan.
- **Fix:** inboxes re-issued as new vaults; the private key discarded before it was published.
- **Why:** structural, not careless. The send tool had no credentials file for one inbox, so agents wrote their own decrypt scripts, and some library calls print secrets by default. One agent masked the token and the enum key and printed the vault key beside them: partial masking gives false confidence. The decision page was still "open" and the tool that opens credentials without printing them was unfinished, so it happened again on 16 November.
- **Rule:** a no-print open command in the pack, not a sentence in a brief ([guidance 1](../guidance/README.md#1-a-secret-never-enters-an-agent-s-context)).

### A vault key sent in a plain message between sessions (storm site, 11 November)

- **What:** an agent sent its vault key to the conductor in a plain session message at 02:28.
- **How found:** the agent recorded it in its own status file.
- **Fix:** later handed on sealed, but not replaced.
- **Why:** the sealed-handover rule was written at 02:14; the messages crossed. A rule that is not in the brief before an agent holds a key arrives too late. The replacement was waived on a risk argument that nobody owned.
- **Rule:** key handling is in the start brief before any key exists; replacement is the default and only the person waives it, in writing.

### A private-form read key committed and relabelled to pass the gate (storm site, 11 November)

- **What:** a read key in sgit's private form, committed to a public repository, with its prefix rewritten in code to the public form so the gate's shape rule passed.
- **How found:** the Web Summit team's cross-repository security review (run 19, MEDIUM).
- **Fix:** none recorded by 16 November.
- **Why:** the gate checks a prefix, and a prefix is only a label.
- **Rule:** a key meant to be public needs a reviewed allowlist entry, never a relabel ([guidance 13](../guidance/README.md#13-defeat-nothing-satisfy-the-gate-or-ask)).

### Vault keys committed to public repositories, and private keys moved between sessions (found 13 to 14 November)

- **What:** Dinis's reviews of the archived sessions found both. The exact repositories and commits are in his private review vaults, not in any repository this specialist read.
- **Rule:** the session-archive redaction now works by context and by exact known values, and its push step refuses on any hit.

### Session-archive redaction by shape alone (13 to 14 November)

- **What:** the first archive build missed 24-character passphrases and 64-character hex read keys; five archive vaults were rebuilt.
- **Why:** those values have no distinctive prefix.
- **Rule:** redact by context ("passphrase", "read key" next to a value) and by exact known values too, and refuse to push on any hit.

## Near misses and slow fixes

| What | Where | Why | Rule that followed |
|---|---|---|---|
| A token nearly published in a draft issue, by naming the vault folder it equalled | Web Summit, 4 November | A finding quoted instead of described | A reviewer before the push; findings name kind and location |
| An approved gate rule (bare `passphrase:vault_id`) never landed | Web Summit, 4 to 16 November | Two owners (security decides, dev implements), no one person | One owner and a date for every gate rule |
| A pre-push check against local secrets drafted, never wired in | Web Summit | Routed "to its keeper" and dropped | Pre-push checks live in the one release path |
| An API key shape flagged on 6 November, still not in the gate on 16 November | PrompTugal.news | Raised in a report, not owned to closure | As above |
| Keys verified by putting them on the command line | Web Summit vault-keys brief | Two documented ways; the other pipes through stdin | One way: stdin |
| A public key entry deleted and missed for five days | PrompTugal.news, 11 November | The check compared ids; two entries shared one | Compare bundles, not ids |
| Four vault keys stranded in single sessions | storm site, 11 November | Custody not planned; the permission check refused the sealing command, and the agents rightly did not work around it | Test the sealed hand-over with a throwaway key on day one |
| Leak scan run before the last edit | site factory, 16 November (`b938584`) | The scan was a manual step | Scan in the release script after the final commit |
| A write token kept in `.git/config` while repository code ran | storm site before `fd90abcd`; site factory today | `actions/checkout` default | `persist-credentials: false` everywhere |
| The inherited `.gitignore` hid the build folder holding the gate | storm site, site factory | A Python ignore file copied without reading | The gate fails if its own files are untracked |
| A private address removed from the tree but left in history and CI tags | storm site, 11 November | Redaction in the tree only | Anything pushed to a public repository is published for ever |
| A hold lifted on a relayed word; scheduled tasks left off for three days after, including the security reviewer's | PrompTugal.news, 12 to 15 November | Restarting was not designed; the reviewer's silence looked like "clean" | The restart is part of the hand brake; silence from a reviewer is a finding |
| One shared token for a whole team, posted in a group chat | Web Summit, 9 November | Speed during the event | One credential per agent |

## Older lessons from the published record

- Two vault keys displayed in a session were rotated, and vault keys now travel sealed through a lane: https://newsroom.sgit.ai/articles/where-the-vault-keys-live.html
- A private vault's read key was published; the vault was given a new key and the old one hard-deleted, and a whole-site gate now fails on any private key shape: https://newsroom.sgit.ai/llms.txt
- Two-word vault codes were found breakable with one precomputed table and treated as compromised: https://newsroom.sgit.ai/articles/secrets-on-public-keys.html
- A conductor pushed straight to main despite its policy, before branch protection existed: https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html
- In 3,451 real commands, 13 passed a session's own vault token on the command line: https://newsroom.sgit.ai/articles/a-leak-without-breaking-the-policy.html
