import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const js = readFileSync(path.join(root, "app.js"), "utf8");

const section = (start, end) => html.slice(html.indexOf(start), html.indexOf(end));

test("Hero is a concrete today snapshot without replay controls", () => {
  const hero = section('<section class="wrap hero">', '<div class="wrap section-rule">');
  assert.match(hero, /hero-today/);
  assert.match(hero, /到期客户/);
  assert.match(hero, /微信待回复/);
  assert.match(hero, /工地事项/);
  assert.match(hero, /<strong>6<\/strong><span>个进行中工地/);
  assert.match(hero, /<strong>10<\/strong><span>个客户待跟进/);
  assert.match(hero, /建发书香府/);
  assert.doesNotMatch(hero, /hero-replay|重播同步/);
});

test("Input has two modes and matching mode-specific paths", () => {
  const input = section('<section class="constraint-band section" id="input">', '<section class="output-section section"');
  assert.match(input, /data-input-mode="first"/);
  assert.match(input, /data-input-mode="ongoing"/);
  assert.match(input, /input-path/);
  assert.match(input, /input-step-detail/);
  assert.doesNotMatch(input, /sync-step|sync-run|clock-ring|sync-log/);
  assert.match(input, /当前部署频率：每 30 分钟检查一次变化/);
});

test("Output exposes the today view and keeps the unfinished morning brief disabled", () => {
  const output = section('<section class="output-section section"', '<section class="wrap section site-section"');
  assert.match(output, /output-board/);
  assert.match(output, /data-output-view="today"/);
  assert.match(output, /output-coming-soon/);
  assert.match(output, /晨间日报 · 暂不展示/);
  assert.match(output, /disabled aria-disabled="true"/);
  assert.doesNotMatch(output, /data-output-view="brief"/);
  assert.match(output, /actual-case-card/);
  assert.match(output, /output-stage/);
  assert.doesNotMatch(js, /outputStageHeight|measureOutputViews|outputHeights/);
});

test("Site keeps progress and ledger in one card", () => {
  const site = section('<section class="wrap section site-section"', '<section class="ai-section section"');
  assert.match(site, /site-case-card/);
  assert.match(site, /site-detail-grid/);
  assert.doesNotMatch(site, /progress-card.*ledger-card/s);

});

test("AI responsibility comparison is scroll-driven rather than tab-driven", () => {
  const ai = section('<section class="ai-section section"', '<section class="wrap section" id="current">');
  assert.match(ai, /ai-story-step/);
  assert.match(ai, /data-ai-stage="first"/);
  assert.match(ai, /data-ai-stage="ongoing"/);
  assert.match(ai, /ai-sticky/);
  assert.doesNotMatch(ai, /ai-tab/);
  assert.match(js, /ai-section-progress/);
});

test("All demos retain reduced-motion and background pause handling", () => {
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /visibilitychange/);
});
