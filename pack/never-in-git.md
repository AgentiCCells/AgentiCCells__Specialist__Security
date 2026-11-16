---
title: "Pack: what never goes in git"
description: "The list of things that never go in a git repository, public or private, and the .gitignore lines that guard them."
---
# Pack: what never goes in git

From the day-one pack of specialist.security@AgentiCCells.dinis, version 0.1.0, 16 November 2026. Treat anything pushed to a public repository as published for ever: removing it from the tree leaves it in history, in tags, in forks and on the served site.

## Never

- Private keys of any kind, and key stores (`~/.sg-send/`, `*.pem`, `*.key`, `*.p12`, `id_rsa*`).
- Vault keys, passphrases, read keys in private form, lane and append tokens, API keys.
- `.sg_vault/local/` (it holds the vault key and token) and any vault made inside the clone.
- `.env` files, credentials files, tokens written to a file for a push.
- Session transcripts and session archives, even "redacted" ones, unless the redaction ran by context and by exact values and a person agreed.
- Hand-over notes that quote a secret. A hand-over lists kinds and holders, never values.
- Screenshots of consoles, terminals or settings pages.
- Customer data, and anything about a person who has not agreed to be named: addresses, phone numbers, private social handles, their words.
- A team's private notes (sales rankings, prospects).

## Allowed, with care

- Public key bundles, in `team/keys/<role>.json` only.
- A read key in public form, on purpose, after an audit of every revision, with an allowlist entry.
- Sealed items (encrypted to a fingerprint), when an inventory says who can open each.

## The .gitignore lines

Add [gitignore-security.txt](gitignore-security.txt) to your `.gitignore`, then check it:

```
git check-ignore -v .sg_vault/local/vault_key .env secrets/x.pem
```

Each path must name the rule that ignores it. Read any `.gitignore` you inherit: a copied one hid a build folder holding the gate in two of our repositories.
