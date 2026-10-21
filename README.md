![got-a.page - Everyone's got a page](assets/banner.svg)

# got-a.page website

The landing site at [got-a.page](https://got-a.page) - hero, live availability
checker, guided claim form, docs and badges.

Static HTML/CSS/JS, no build step, no frameworks. Served by GitHub Pages from
the `main` branch, with `got-a.page` set as the custom domain (the `CNAME`
file here keeps it sticky).

## How it stays fast and free

- The availability checker and live counter read the **static index** built by
  the claim repo's CI (`https://got-a-page.github.io/claim/index.json` and
  `stats.json`). No GitHub API calls from the browser, ever.
- The claim form writes the page JSON and opens a prefilled "new file" link,
  so claiming never requires editing JSON by hand.

## Setup

One-time steps (custom domain, DNS) live in the claim repo at
[docs/SETUP.md](https://github.com/got-a-page/claim/blob/main/docs/SETUP.md).
