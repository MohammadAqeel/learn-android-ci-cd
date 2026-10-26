(function () {
  const { levels, glossary, resources } = window.COURSE;
  const app = document.getElementById("app");
  const sidebar = document.getElementById("sidebar");

  // Flat list of lessons, each knowing its level (used for prev/next + progress).
  const allLessons = levels.flatMap((level) => level.lessons.map((lesson) => ({ ...lesson, level })));
  const findLesson = (id) => allLessons.find((l) => l.id === id);

  // ---------- Persistent state (localStorage, fails gracefully) ----------
  const STORE_KEY = "android-ci-path:v1";
  const state = load();

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && typeof s === "object") return { done: {}, tasks: {}, quiz: {}, ...s };
    } catch (_) {}
    return { done: {}, tasks: {}, quiz: {} };
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Inline `code` in plain-text strings (tasks, quiz).
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

  // Code samples are written as raw text inside <div class="code-block">…</div>.
  // Escape them and wrap with a header + copy button before inserting into the DOM.
  function renderBody(html) {
    return html.replace(
      /<div class="code-block" data-lang="([^"]*)" data-label="([^"]*)">([\s\S]*?)<\/div>/g,
      (_, lang, label, code) =>
        `<div class="code-block"><div class="code-head"><span>${esc(label)}</span>` +
        `<button class="copy-btn" type="button">Copy</button></div>` +
        `<pre><code class="lang-${esc(lang)}">${esc(code.replace(/^\n/, ""))}</code></pre></div>`
    );
  }

  const levelProgress = (level) => {
    const done = level.lessons.filter((l) => state.done[l.id]).length;
    return { done, total: level.lessons.length, pct: Math.round((done / level.lessons.length) * 100) };
  };

  // ---------- Sidebar ----------
  function renderSidebar(activeId) {
    const levelsHtml = levels.map((level) => {
      const p = levelProgress(level);
      const links = level.lessons.map((l) => `
        <a href="#/lesson/${l.id}" class="nav-link ${state.done[l.id] ? "done" : ""} ${l.id === activeId ? "active" : ""}">
          <span class="nav-check">${state.done[l.id] ? "✓" : ""}</span>${esc(l.title)}
        </a>`).join("");
      return `
        <div class="nav-level" style="--lvl:${level.color}">
          <div class="nav-level-title">${esc(level.title)} <small>${p.done}/${p.total}</small></div>
          ${links}
        </div>`;
    }).join("");

    sidebar.innerHTML = `
      <a href="#/" class="nav-link ${activeId === "home" ? "active" : ""}">🏠 Roadmap</a>
      <div style="height:12px"></div>
      ${levelsHtml}
      <div class="nav-extra">
        <a href="#/glossary" class="nav-link ${activeId === "glossary" ? "active" : ""}">📖 Glossary</a>
        <a href="#/resources" class="nav-link ${activeId === "resources" ? "active" : ""}">🔗 Resources</a>
      </div>`;

    const total = allLessons.filter((l) => state.done[l.id]).length;
    document.getElementById("progressPill").textContent =
      `${Math.round((total / allLessons.length) * 100)}% complete`;
  }

  // ---------- Pages ----------
  function renderHome() {
    const next = allLessons.find((l) => !state.done[l.id]) || allLessons[0];
    const started = allLessons.some((l) => state.done[l.id]);
    const cards = levels.map((level, i) => {
      const p = levelProgress(level);
      return `
        <a class="level-card" href="#/lesson/${level.lessons[0].id}" style="--lvl:${level.color}">
          <span class="level-tag">Level ${i + 1}</span>
          <h3>${esc(level.title)}</h3>
          <p>${esc(level.tagline)}</p>
          <div class="bar"><span style="width:${p.pct}%"></span></div>
          <div class="bar-label">${p.done} of ${p.total} lessons</div>
        </a>`;
    }).join("");

    app.innerHTML = `
      <section class="hero">
        <h1>Learn Android CI, from your first green build to senior-level pipelines.</h1>
        <p>Short, hands-on lessons. Each one gives you real YAML and Gradle to copy, tasks to do in your own project, and a quick quiz. Your progress is saved in this browser.</p>
        <a class="btn" href="#/lesson/${next.id}">${started ? "Continue: " + esc(next.title) : "Start learning →"}</a>
      </section>

      <h2 style="margin-top:36px">What you'll build</h2>
      <div class="pipeline">
        <span class="stage">Push / PR</span><span class="arrow">→</span>
        <span class="stage">Build</span><span class="arrow">→</span>
        <span class="stage">Lint</span><span class="arrow">→</span>
        <span class="stage">Unit tests</span><span class="arrow">→</span>
        <span class="stage">UI tests</span><span class="arrow">→</span>
        <span class="stage">Sign</span><span class="arrow">→</span>
        <span class="stage">Distribute</span><span class="arrow">→</span>
        <span class="stage">Play Store</span>
      </div>

      <h2>Roadmap</h2>
      <div class="level-grid">${cards}</div>

      <div class="panel">
        <h2>How to use this site</h2>
        <ol>
          <li>Create a small Android app (or use an existing one) and push it to GitHub.</li>
          <li>Work through the lessons in order. Each one builds on the previous one.</li>
          <li>Actually do the <strong>tasks</strong>. You learn CI by watching pipelines go red and fixing them.</li>
          <li>Mark each lesson complete once its tasks are done.</li>
        </ol>
      </div>`;
  }

  function renderLesson(lesson) {
    const idx = allLessons.indexOf(lesson);
    const prev = allLessons[idx - 1];
    const next = allLessons[idx + 1];
    const levelNum = levels.indexOf(lesson.level) + 1;
    const tasksDone = state.tasks[lesson.id] || [];
    const quizAnswer = state.quiz[lesson.id];

    const tasksHtml = lesson.tasks.map((t, i) => `
      <label class="task ${tasksDone[i] ? "checked" : ""}">
        <input type="checkbox" data-task="${i}" ${tasksDone[i] ? "checked" : ""}/>
        <span>${inline(t)}</span>
      </label>`).join("");

    const quizHtml = lesson.quiz.options.map((o, i) => `
      <button class="quiz-opt" data-opt="${i}" type="button">${inline(o)}</button>`).join("");

    app.innerHTML = `
      <article class="lesson" style="--lvl:${lesson.level.color}">
        <div class="crumb">Level ${levelNum} · ${esc(lesson.level.title)}</div>
        <h1>${esc(lesson.title)}</h1>
        <div class="meta">⏱ ~${lesson.minutes} min · Lesson ${idx + 1} of ${allLessons.length}</div>
        <div class="summary">${esc(lesson.summary)}</div>

        ${renderBody(lesson.body)}

        <div class="panel">
          <h2>🛠 Do it yourself</h2>
          ${tasksHtml}
        </div>

        <div class="panel" id="quiz">
          <h2>🧠 Quick check</h2>
          <p><strong>${inline(lesson.quiz.q)}</strong></p>
          ${quizHtml}
          <div class="quiz-explain" id="quizExplain"></div>
        </div>

        <div class="lesson-foot">
          ${prev ? `<a class="btn secondary" href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}
          <button class="btn" id="doneBtn" type="button">${state.done[lesson.id] ? "✓ Completed (undo)" : "Mark complete"}</button>
          ${next ? `<a class="btn secondary" href="#/lesson/${next.id}">${esc(next.title)} →</a>` : `<a class="btn secondary" href="#/">🏁 Back to roadmap</a>`}
        </div>
      </article>`;

    // Tasks
    app.querySelectorAll("[data-task]").forEach((box) => {
      box.addEventListener("change", () => {
        const arr = state.tasks[lesson.id] || [];
        arr[+box.dataset.task] = box.checked;
        state.tasks[lesson.id] = arr;
        box.closest(".task").classList.toggle("checked", box.checked);
        save();
      });
    });

    // Quiz
    const showQuiz = (picked) => {
      app.querySelectorAll(".quiz-opt").forEach((b, i) => {
        b.disabled = true;
        if (i === lesson.quiz.answer) b.classList.add("right");
        else if (i === picked) b.classList.add("wrong");
      });
      const correct = picked === lesson.quiz.answer;
      document.getElementById("quizExplain").innerHTML =
        `${correct ? "✅ Correct!" : "❌ Not quite."} ${inline(lesson.quiz.explain)} ` +
        `<button class="btn secondary" id="quizRetry" type="button" style="padding:4px 10px;margin-left:6px">Retry</button>`;
      document.getElementById("quizRetry").addEventListener("click", () => {
        delete state.quiz[lesson.id];
        save();
        renderLesson(lesson);
        document.getElementById("quiz").scrollIntoView({ block: "center" });
      });
    };
    app.querySelectorAll(".quiz-opt").forEach((b) => {
      b.addEventListener("click", () => {
        state.quiz[lesson.id] = +b.dataset.opt;
        save();
        showQuiz(+b.dataset.opt);
      });
    });
    if (quizAnswer !== undefined) showQuiz(quizAnswer);

    // Complete
    document.getElementById("doneBtn").addEventListener("click", () => {
      state.done[lesson.id] = !state.done[lesson.id];
      if (!state.done[lesson.id]) delete state.done[lesson.id];
      save();
      if (state.done[lesson.id] && next) location.hash = `#/lesson/${next.id}`;
      else route();
    });
  }

  function renderGlossary() {
    app.innerHTML = `
      <article class="lesson">
        <h1>📖 Glossary</h1>
        <dl class="gloss">
          ${glossary.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("")}
        </dl>
      </article>`;
  }

  function renderResources() {
    app.innerHTML = `
      <article class="lesson">
        <h1>🔗 Resources</h1>
        <p>Official docs and real-world examples worth bookmarking.</p>
        <ul>
          ${resources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}
        </ul>
        <div class="panel">
          <h2>Reset progress</h2>
          <p>Clear all completed lessons, tasks and quiz answers saved in this browser.</p>
          <button class="btn secondary" id="resetBtn" type="button">Reset my progress</button>
          <span id="resetMsg" style="margin-left:10px;color:var(--muted)"></span>
        </div>
      </article>`;
    document.getElementById("resetBtn").addEventListener("click", (e) => {
      if (e.target.dataset.armed) {
        state.done = {}; state.tasks = {}; state.quiz = {};
        save();
        renderSidebar("resources");
        document.getElementById("resetMsg").textContent = "Progress cleared.";
        e.target.textContent = "Reset my progress";
        delete e.target.dataset.armed;
      } else {
        e.target.dataset.armed = "1";
        e.target.textContent = "Click again to confirm";
      }
    });
  }

  // ---------- Router ----------
  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [page, id] = hash.split("/");
    let active = "home";

    if (page === "lesson" && findLesson(id)) {
      active = id;
      renderLesson(findLesson(id));
      document.title = `${findLesson(id).title} · Android CI Path`;
    } else if (page === "glossary") {
      active = "glossary";
      renderGlossary();
      document.title = "Glossary · Android CI Path";
    } else if (page === "resources") {
      active = "resources";
      renderResources();
      document.title = "Resources · Android CI Path";
    } else {
      renderHome();
      document.title = "Android CI Path";
    }

    renderSidebar(active);
    sidebar.classList.remove("open");
    window.scrollTo(0, 0);
  }

  // ---------- Global events ----------
  // Copy buttons (event delegation, works for every rendered code block)
  app.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const code = btn.closest(".code-block").querySelector("code").textContent;
    const done = () => { btn.textContent = "Copied!"; setTimeout(() => (btn.textContent = "Copy"), 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, () => (btn.textContent = "Failed"));
  });

  document.getElementById("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));

  // Theme: follow the system by default; remember an explicit choice.
  const root = document.documentElement;
  let theme = null;
  try { theme = localStorage.getItem("android-ci-path:theme"); } catch (_) {}
  if (!theme) theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.dataset.theme = theme;
  document.getElementById("themeBtn").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("android-ci-path:theme", root.dataset.theme); } catch (_) {}
  });

  window.addEventListener("hashchange", route);
  route();
})();
