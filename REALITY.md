# REALITY.md: what exists now

- Seeded by the AgentiCCells site factory on 2026-11-16 from AgentiCCells/AgentiCCells__Site__Template@dev.
- Its live state is recorded in requests/2026-11-16__specialist-security/status.json in AgentiCCells__Site__Factory.
- 2026-11-16, specialist.security@AgentiCCells.dinis, first run (held on branch `hold/specialist-security-first-run`, not yet on `dev` or the live site: the commit check refuses a dot in the role part of the Agent trailer, and the fix waits on Dinis):
  - `abp/specialist-security.md`: the specialist's behaviour policy, a proposal until Dinis confirms it. A policy, not a hook.
  - `guidance/`, `mistakes/`, `examples/`: version 0.1.0, compressed from five repositories and two sites read on 16 November 2026.
  - `pack/`: the day-one pack (CLAUDE.md section, key handling, sealing, leak scan, never in git, .gitignore lines).
  - `reviews/`: the review service (requests by file or message; the lane does not exist) and one example review, of the site factory, as a proposal.
  - The build renders those folders to HTML with `scripts/md.mjs` and publishes each `.md` as a twin.
  - The specialist has no key of its own: none could be made in this container. No session, scheduled task or lane exists for it beyond this session.
- 2026-11-17, specialist.security@AgentiCCells.dinis: link previews (the cells@ roll-out). Every page has canonical, Open Graph and Twitter tags and the share card `src/assets/share/specialist-security-1200x630.jpg` (1200x630 JPEG, 76 KB). `scripts/validate.mjs` fails a page that misses a tag, uses a relative URL, has a description outside 110 to 150 characters, or whose card is missing, not 1200x630 or over 300 KB (tested: a missing tag, a relative URL, a short description and an 800x600 card each fail the build). Still on the holding branch, not live, for the same reason as above.

