// Run with: node --test tests/gallery.test.cjs (no dependencies).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { render, showcased, makeCard } = require("../gallery/build.cjs");

const MARKED = "<ul><!-- GALLERY:START --><!-- GALLERY:END --></ul>";
const index = {
  pages: {
    wolfiku: { title: "Wolfiku", tagline: "Builder", theme: "plum", showcase: true },
    anubhav: { title: "Notes", tagline: null, theme: "forest", showcase: true },
    dani: { title: "Dani", theme: "ember", showcase: false },
    "Bad_Name": { title: "Bad", theme: "plum", showcase: true }
  }
};

test("showcased keeps only opted-in, valid names, sorted", () => {
  assert.deepEqual(showcased(index), ["anubhav", "wolfiku"]);
  assert.deepEqual(showcased({}), []);
});

test("render makes a card with title, tagline and theme, linked to the live page", () => {
  const { html, count } = render(MARKED, index);
  assert.equal(count, 2);
  assert.match(html, /href="https:\/\/wolfiku\.got-a\.page"/);
  assert.match(html, /<h3>Wolfiku<\/h3>/);
  assert.match(html, /data-theme="plum"/);
  assert.match(html, /class="tagline">Builder</);
  assert.doesNotMatch(html, /dani\.got-a\.page|Bad_Name/);
});

test("a null tagline is skipped", () => {
  assert.equal(render(MARKED, index).html.match(/class="tagline"/g).length, 1);
});

test("makeCard escapes titles and taglines", () => {
  const card = makeCard("example", { title: '<script>x</script>', tagline: "A & B", theme: "forest" });
  assert.ok(card.includes("&lt;script&gt;") && card.includes("A &amp; B"));
  assert.ok(!card.includes("<script>"));
});

test("unknown theme falls back to sunrise", () => {
  assert.match(makeCard("example", { theme: "nope" }), /data-theme="sunrise"/);
});

test("render rejects missing markers and shows an empty state", () => {
  assert.throws(() => render("<ul></ul>", index), /GALLERY markers not found/);
  assert.match(render(MARKED, { pages: {} }).html, /No showcased pages yet/);
});

test("running render twice gives the same result", () => {
  const once = render(MARKED, index).html;
  assert.equal(render(once, index).html, once);
});

// Narrow screens (e.g. 375px): a valid 40-character page name or an unbroken
// title/tagline must wrap inside its card instead of pushing the page sideways.
// There is no browser in this repo, so these tests check the CSS rules that
// prevent the overflow, using the real gallery/style.css.
const css = fs
  .readFileSync(path.join(__dirname, "../gallery/style.css"), "utf8")
  .replace(/\s+/g, " ");
const rule = (selector) => {
  const match = css.match(new RegExp("(?:^|[}\\s])" + selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + " \\{([^}]*)\\}"));
  return match ? match[1] : "";
};

test("narrow screen: a 40-character name and long unbroken text still make a card", () => {
  const long = { title: "T".repeat(60), tagline: "g".repeat(90), theme: "plum", showcase: true };
  const { html, count } = render(MARKED, { pages: { ["a".repeat(40)]: long } });
  assert.equal(count, 1);
  assert.ok(html.includes("a".repeat(40) + ".got-a.page"));
  assert.ok(html.includes("T".repeat(60)) && html.includes("g".repeat(90)));
});

test("narrow screen: long name, title and tagline wrap inside the card", () => {
  for (const selector of [".page-card .name", ".page-card h3", ".page-card .tagline"]) {
    assert.match(css, new RegExp(selector.replace(/[.]/g, "\\.") + "[^{]*\\{[^}]*overflow-wrap: anywhere"),
      selector + " must use overflow-wrap: anywhere");
  }
});

test("narrow screen: grid items may shrink below their content width", () => {
  assert.match(rule(".wall > li"), /min-width: 0/);
  assert.match(rule(".page-card"), /min-width: 0/);
});

test("narrow screen: grid column minimum never exceeds the viewport", () => {
  assert.match(rule(".wall"), /minmax\(min\(15rem, 100%\), 1fr\)/);
});
