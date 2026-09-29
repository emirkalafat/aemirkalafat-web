# Changelog

User-facing release notes. Written in plain language for site visitors.

---

## v9.0.0 — 2026-11

**TV series, rated season by season**

- **ADDED** — Shows are now rated one season at a time. Each season has its own score, review, and the month and year I watched it, so a great first season and a weaker third one can finally be told apart.
- **ADDED** — Every series has its own overview page with the overall score, the average of its seasons, the best and weakest season, the years I watched it over, and a bar chart of how the seasons compare. It also carries my overall thoughts on the show and a short take on each season, with a link to the full review.
- **ADDED** — A season's page has a season switcher at the top, so you can hop between seasons or jump to the series overview without going back to the list.
- **IMPRV** — On the media page, every season shows up as its own card marked with its season number, placed on the month it was watched.
- **FIXED** — Media cards inside a month are now sorted by the exact day I watched them, newest first, instead of in no particular order.
- **FIXED** — Opening a review no longer flashes "record not found" while the page is still loading.

**A livelier homepage**

- **ADDED** — The homepage hero now has a live terminal. It introduces itself, then you can type commands: `help` lists them, and you can look up my skills, experience, and education, open the Projects, Blog, Media, Status, and Contact pages, toggle light and dark mode, or download a CV. On phones the terminal sits at the bottom of the page instead.
- **ADDED** — In the terminal, typing `cv` shows the four CVs as a numbered list, and typing the number downloads that one.
- **ADDED** — A new "Projects" section shows my three most recent projects right on the homepage.
- **ADDED** — A GitHub activity graph shows my contributions over the last year, with my longest streak, active days, and best day.
- **ADDED** — A new "Input.Stream()" section shows the latest four movies, series seasons, or books I've rated, with a large score panel and the month I watched or read each one.
- **ADDED** — A scroll-to-top button appears on every page once you've scrolled down, with a thin bar along its bottom edge showing how far through the page you are.
- **IMPRV** — Each homepage section now has its own look and a numbered heading: experience runs along a timeline, projects get a colorful ticker, and education is laid out as a numbered stack.
- **IMPRV** — Sections and cards fade in as you scroll, the hero introduces itself piece by piece, and a soft dotted grid lights up around your cursor across the whole page.
- **IMPRV** — The purple accent color is calmer and easier on the eyes in dark mode.
- **IMPRV** — My software developer role at talsen team GmbH now shows its end date (September 2026), and my high school is no longer listed under education.

---

## v8.1.0 — 2026-09-29

**Role-specific CVs**

- **ADDED** — The homepage "Download CV" button now opens a menu with four CVs: Software and Electrical, each in Turkish and English. Pick the one that fits, and it downloads right away.
- **IMPRV** — The CV menu highlights the language matching your browser's language as the recommended choice.

---

## v8.0.0 — 2026-09-18

**Project logos**

- **ADDED** — Projects can now have a logo. On the Projects page, a project with a logo gets a dedicated icon panel next to its details; projects without one simply don't show that space.
- **ADDED** — A project's detail page now displays its logo next to the title, sized to match the height of the version and tag row below it, with its width scaling naturally so non-square logos aren't stretched or cropped.
- **ADDED** — The admin project editor has a new LOGO field — paste an image URL or upload one directly.
- **IMPRV** — Removed the redundant "SYSTEM_ONLINE" / "BETA_UNSTABLE" label from the project detail page header; the version and tags already convey that, and the footer's system status indicator is unchanged.
- **FIXED** — Multi-paragraph project descriptions written in the admin panel were rendering as a single run-on paragraph on the project detail page; line breaks are now preserved.

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
