/**
 * Markdown Section Renderer
 * Loads .md files and renders specific sections by heading into DOM containers.
 * Uses marked.js (UMD global) — include <script src="marked"> before this.
 */

const Render = {
  /**
   * Render an entire markdown file into a container.
   * @param {string} containerSelector - CSS selector for target element
   * @param {string} mdPath - Path to .md file
   */
  async file(containerSelector, mdPath) {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    try {
      const md = await fetch(mdPath).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
      el.innerHTML = marked.parse(md);
    } catch (e) {
      el.innerHTML = '<p class="render-error">Content unavailable</p>';
      console.warn(`Render.file failed: ${mdPath}`, e);
    }
  },

  /**
   * Render specific sections from a markdown file.
   * Sections are delimited by ## or ### headings.
   * @param {string} containerSelector
   * @param {string} mdPath
   * @param {string[]} titles - Section heading titles to include (without ##)
   */
  async sections(containerSelector, mdPath, titles) {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    try {
      const md = await fetch(mdPath).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
      const parts = this._parseSections(md);
      const selected = titles
        .map(t => parts.find(p => p.title === t))
        .filter(Boolean);
      if (selected.length === 0) {
        el.innerHTML = '<p class="render-muted">Content pending — edit <code>' + mdPath + '</code></p>';
        return;
      }
      const mdJoined = this._joinSections(selected);
      el.innerHTML = marked.parse(mdJoined);
    } catch (e) {
      el.innerHTML = '<p class="render-error">Content unavailable</p>';
      console.warn(`Render.sections failed: ${mdPath}`, e);
    }
  },

  _joinSections(selected) {
    return selected.map(s => {
      const prefix = '#'.repeat(s.level) + ' ';
      return s.content ? prefix + s.title + '\n\n' + s.content : prefix + s.title;
    }).join('\n\n');
  },

  /**
   * Render all content between two headings (exclusive of end heading).
   * @param {string} containerSelector
   * @param {string} mdPath
   * @param {string} startTitle - ## heading to start from
   * @param {string} endTitle - ## heading to stop before (optional)
   */
  async range(containerSelector, mdPath, startTitle, endTitle) {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    try {
      const md = await fetch(mdPath).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
      const parts = this._parseSections(md);
      const startIdx = parts.findIndex(p => p.title === startTitle);
      if (startIdx === -1) {
        el.innerHTML = '<p class="render-muted">Content pending — add <code>## ' + startTitle + '</code> to <code>' + mdPath + '</code></p>';
        return;
      }
      let endIdx = endTitle ? parts.findIndex(p => p.title === endTitle) : -1;
      if (endIdx === -1) endIdx = parts.length;
      const selected = parts.slice(startIdx, endIdx);
      const mdJoined = this._joinSections(selected);
      el.innerHTML = marked.parse(mdJoined);
    } catch (e) {
      el.innerHTML = '<p class="render-error">Content unavailable</p>';
      console.warn(`Render.range failed: ${mdPath}`, e);
    }
  },

  /**
   * Parse markdown text into an array of { title, level, content } objects.
   * Each section starts with a ## or ### heading and ends at the next heading of same or higher level.
   */
  _parseSections(md) {
    const lines = md.split('\n');
    const sections = [];
    let currentTitle = '';
    let currentLevel = 0;
    let currentLines = [];
    let preContent = [];

    for (const line of lines) {
      const h2 = line.match(/^##\s+(.+)/);
      const h3 = line.match(/^###\s+(.+)/);
      if (h2 || h3) {
        if (currentLines.length > 0) {
          sections.push({
            title: currentTitle,
            level: currentLevel,
            content: currentLines.join('\n').trimEnd()
          });
        } else if (currentTitle && !currentLines.length) {
          sections.push({ title: currentTitle, level: currentLevel, content: '' });
        }
        if (h2) {
          currentTitle = h2[1].trim();
          currentLevel = 2;
        } else {
          currentTitle = h3[1].trim();
          currentLevel = 3;
        }
        currentLines = [];
      } else {
        if (!currentTitle && sections.length === 0) {
          preContent.push(line);
        }
        currentLines.push(line);
      }
    }
    if (currentLines.length > 0) {
      sections.push({
        title: currentTitle,
        level: currentLevel,
        content: currentLines.join('\n').trimEnd()
      });
    }
    sections._pre = preContent.join('\n').trim();
    return sections;
  },

  /**
   * Auto-render all [data-md] containers on page load.
   * Usage:
   *   <div data-md="file.md"></div>              — render entire file
   *   <div data-md="file.md" data-sections="标题A,标题B"></div>  — render specific sections
   *   <div data-md="file.md" data-start="起始标题" data-end="结束标题"></div> — render range
   */
  async auto() {
    const els = document.querySelectorAll('[data-md]');
    for (const el of els) {
      const md = el.dataset.md;
      const sections = el.dataset.sections;
      const start = el.dataset.start;
      const end = el.dataset.end;
      if (sections) {
        await this.sections('#' + el.id, md, sections.split(',').map(s => s.trim()));
      } else if (start) {
        await this.range('#' + el.id, md, start, end || null);
      } else {
        await this.file('#' + el.id, md);
      }
    }
  }
};
