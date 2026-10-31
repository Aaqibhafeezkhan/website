# Wall of Pages gallery

A gallery of pages claimed on [got-a.page](https://got-a.page) that have opted in
to the showcase. Each card shows the page's name, title, tagline and theme
colour, and links to the live page.

## How it works

`build.cjs` reads the published index
(`https://got-a-page.github.io/claim/index.json`) **at build time** and writes
one static card into `index.html` for every page with `"showcase": true`, between
the `GALLERY:START` and `GALLERY:END` markers. The page itself has no
JavaScript and makes no requests when opened. Styling is plain CSS in
`style.css` and reuses the site's colour variables, so light and dark mode work.

## Keeping the gallery up to date

This repo has no build step, so **the gallery does not refresh by itself**. The
cards are static HTML that is committed to the repo. When a page is added to or
removed from the showcase (or its title, tagline or theme changes), the gallery
stays as it was until someone runs:

    node gallery/build.cjs

and commits the updated `gallery/index.html`. Requires Node.js 18 or newer and
no dependencies.

A scheduled GitHub Action that runs the script and commits any change would make
this automatic. It is not included, because it adds a workflow and
commit permissions to the repo.

## Small screens

Long page names (a valid name can be 40 characters), titles and taglines wrap
inside their card, so the page never scrolls sideways on narrow screens. This is
covered by the "narrow screen" tests.

## Test

    node --test tests/gallery.test.cjs

## Preview locally

Open `gallery/index.html` in a browser.

## Notes

- Only pages with `"showcase": true` in the published index are shown.
- Cards are sorted alphabetically by page name.
- Supported themes: sunrise, forest, ember, slate, lagoon and plum. An unknown
  theme falls back to sunrise.
- Theme colours in `style.css` are approximate.