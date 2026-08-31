# Changelog

User-facing release notes. Written in plain language for site visitors.

---

## v7.1.0 — 2026-08-31

**Status page rebuilt, readability pass**

- **ADDED** — The status page now shows an hourly status strip and real clock-time labels under each service's ping history, replacing the unclear "-24H" marker.
- **IMPRV** — Service status cards are now full-width, one per row, with uptime and latency on a single line so each card is more compact.
- **IMPRV** — Text and labels using the accent teal color are easier to read in light mode, without losing the terminal look.
- **IMPRV** — Project cards on the Projects page now line up at the same height within a row, even when a title wraps onto two lines.
- **FIXED** — Status page timestamps and outage durations could show the wrong time due to a timezone parsing bug; they now reflect your actual local time.

---

## v7.0.0 — 2026-08-29

**Media ratings, rebuilt**

- **ADDED** — Ratings on the media page now use four distinct colors (red, orange, purple, cyan) grouped as bad / average / good / great, so a score's quality is clear at a glance — no more washed-out gray tier.
- **ADDED** — A new score filter on the media page lets you jump straight to bad, average, good, or great reviews.
- **ADDED** — Standout scores (9.5 and up) now get a subtle animated glow, both on media cards and on a review's detail page.
- **IMPRV** — The rating on each media card is now bigger, bolder, and front and center instead of a tiny corner badge.
- **IMPRV** — Media cards now line up evenly in height, even when a review has no description yet.
- **IMPRV** — Poster thumbnails on media cards are a bit larger and easier to see.
- **IMPRV** — Rewrote the media page intro to actually explain what the page is: personal reviews of the movies, shows, and books I've watched and read.
- **FIXED** — A review's detail page title no longer runs together with "_ANALYSIS" on narrow screens.

---

## v6.1.0 — 2026-07-11

**Media & projects overhaul**

- **ADDED** — The media review page has been redesigned from the ground up. Posters now show in their natural portrait orientation, and the full review is visible without scrolling.
- **ADDED** — The overall score now stands out with an animated, color-coded rating meter.
- **IMPRV** — Cards in the media list are more compact with portrait posters, and you can now click anywhere on a card to open its details.
- **IMPRV** — The projects page now fits two cards per row on wide screens, with a cleaner, more consistent card size and the date and details button neatly aligned along the bottom.
- **IMPRV** — Project links now display proper brand icons (such as the App Store and Google Play) instead of showing the icon name as plain text.
- **IMPRV** — Changelog entry dates now show just the day, without the time.
- **FIXED** — Review text now appears exactly as written, in proper paragraphs, instead of breaking every sentence onto its own line.
- **FIXED** — Selecting an existing media or project entry in the admin panel now correctly opens the editor.

---

## v6.0.1 — 2026-07-08

**Status page & interface polish**

- **IMPRV** — Reworked the service status page with a clearer, labeled indicator that shows at a glance whether each service is operational.
- **IMPRV** — Updated the Minecraft server connection addresses (now including ports), with the main HUB server listed first.
- **IMPRV** — Visual refinements and smoother transitions across the navigation and cards.
