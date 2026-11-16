---
title: "Pack: key handling"
description: "How an agent makes, keeps, publishes, hands over and retires its own key, and what to do when a key is exposed."
---
# Pack: key handling

From the day-one pack of specialist.security@AgentiCCells.dinis, version 0.1.0, 16 November 2026. Sources: https://pki.sgit.ai/handover.md, https://newsroom.sgit.ai/articles/agents-have-an-identity-now.html, https://newsroom.sgit.ai/articles/one-writer-one-key.html, and the PrompTugal.news key runbook (https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/keys-and-vaults.md).

## The kinds of secret you will hold

| Kind | What it gives | May it be published? |
|---|---|---|
| Your agent key, private half | Signing as you; opening what is sealed to you | Never. It stays in the session's key store. |
| Your agent key, public bundle | Lets others verify you and seal to you | Yes, in `team/keys/<role>.json` (the leak scan allows it there only) |
| A vault key (passphrase and vault id) | Write and read access to a vault | Never |
| A read key in private form | Read access to a private vault | Never |
| A read key in public form (`sgit_public_read_` prefix) | Read access to a vault meant to be public | Only on purpose, after an audit of every revision, with an allowlist entry |
| A lane or append token | Writing to one inbox | Never; it reaches you sealed to your key |
| An API key or CI credential | Whatever the service grants | Never; prefer short-lived tokens (OIDC) and a proxy that adds the key |

## Make your key

1. Make it in the session that will use it: `sgit pki keygen --label <role>@<team>.<person>`, or `node pki-agent.mjs keygen --name "<role>" --runtime "<where>" --session` (https://pki.sgit.ai/agents/pki-agent.mjs; pin it by sha256 and record the hash).
2. Export the public bundle only (`sgit pki export <fingerprint>`) and add it to `team/keys/<role>.json` in the same commit that says who you are.
3. Print your fingerprint in the session where your person is watching, so they can confirm it out of band.
4. Never `cat`, `head`, copy or archive the key store (`~/.sg-send/keys/`).

Known gap: `sgit pki keygen` asks for a passphrase interactively, and a cloud container is reclaimed when its session ends. Decide with your person where a long-lived agent's private half lives before you rely on it.

## Hand over a role to a new session

1. The new session makes a **new** key and publishes its bundle.
2. The old entry is marked `superseded` (with the time and the new fingerprint), never deleted, so old signatures still verify.
3. Lanes and sealed items are re-issued, sealed to the new key.
4. The old session stops its scheduled tasks, deletes its key store and clones, checks they are gone, and writes a hand-over that lists every secret it ever held and whether any was shown.
5. A commit from the old session after the hand-over is flagged.

## When a key is exposed

Exposed means shown anywhere: a reply, a log, a transcript, a message, a screenshot, a commit (even one later removed).

1. Tell your person at once: kind, where it was shown, when, what it opens. Never the value.
2. Replace it: a new key, or a new vault with the content copied; delete the old vault from the server.
3. Mark the old public entry `compromised`, with the time.
4. Write an incident record: kind, owner, what it allows, worst case, where exposed, what was not exposed, response, open items.
5. Do not rewrite git history yourself; history rewriting is your person's call.
