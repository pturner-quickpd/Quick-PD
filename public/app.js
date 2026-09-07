// ============================================================
// The Turner Instructional Toolkit — SPA (vanilla JS, hash router)
// Formerly "Quick PD." Renamed to reflect that this is a portable,
// teacher-owned toolkit rather than a school-owned resource.
// ============================================================

// API base resolution:
//   - Published production (<name>.pplx.app): backend on port 5000, reached via '/port/5000'.
//   - Preview (sites.pplx.app/sites/proxy/...): the '__PORT_5001__' sentinel is rewritten
//     to a bare relative 'port/5001'. Fetches resolve relative to the current document URL,
//     so 'port/5001/api/x' becomes '/sites/proxy/<token>/.../static/port/5001/api/x' which
//     the proxy routes to sandbox port 5001. Use the sentinel raw.
//   - Local dev: sentinel is untouched; use http://localhost:5001 directly.
const API = (function () {
  if (typeof location !== 'undefined') {
    const h = location.hostname;
    if (h.endsWith('.pplx.app') && h !== 'sites.pplx.app') {
      return '/port/5000';
    }
  }
  const sentinel = "__PORT_5001__";
  return sentinel.startsWith("__") ? "http://localhost:5001" : sentinel;
})();

function api(p) { return API + p; }

// ---------------- Utilities ----------------
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s) {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

window.toast = toast;
function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Rewrite absolute /api paths in fetch to use the proxied backend URL.
const _fetch = window.fetch.bind(window);
window.fetch = (url, opts) => {
  if (typeof url === 'string' && url.startsWith('/api/')) return _fetch(API + url, opts);
  return _fetch(url, opts);
};

function ytEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}`;
}

// Teacher name — persisted via a cookie so it survives page reloads inside the
// sandboxed preview iframe (browser storage APIs are blocked there).
const TeacherStore = {
  get() {
    const m = document.cookie.match(/(?:^|;\s*)qpd_teacher=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  },
  set(v) {
    const val = v || "";
    // 1-year cookie, root path, SameSite=Lax so it works after navigations.
    document.cookie = `qpd_teacher=${encodeURIComponent(val)}; path=/; max-age=31536000; SameSite=Lax`;
  },
};

// ---------------- Cookie-backed key/value store ----------------
// The sandboxed preview iframe blocks browser storage APIs, so we persist small
// UI state (recent routes, First-30-Days progress) via cookies.
const _CookieStore = {
  get(key) {
    const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_");
    const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + safe + "=([^;]+)"));
    if (!m) return null;
    try { return JSON.parse(decodeURIComponent(m[1])); } catch { return null; }
  },
  set(key, value) {
    const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_");
    const val = encodeURIComponent(JSON.stringify(value));
    document.cookie = safe + "=" + val + "; path=/; max-age=31536000; SameSite=Lax";
  },
};

// ---------------- Recent routes (for dashboard "jump back in") ----------------
const RecentRoutes = {
  KEY: "qpd_recent_routes",
  MAX: 5,
  get() {
    const v = _CookieStore.get(this.KEY);
    return Array.isArray(v) ? v : [];
  },
  push(route, label) {
    if (!route || route === "start-here") return;
    const arr = this.get().filter((r) => r.route !== route);
    arr.unshift({ route, label, at: Date.now() });
    _CookieStore.set(this.KEY, arr.slice(0, this.MAX));
  },
};

const ROUTE_LABELS = {
  "start-here": "Start Here",
  "strategies": "Strategy Library",
  "today": "Today's Focus",
  "pick-for-me": "Pick for Me",
  "classroom": "Classroom Systems",
  "rigor": "Rigor & Questioning",
  "standards": "Standards & Planning",
  "standards/unpack": "Break Down a Standard",
  "standards/plan": "Build an Instructional Plan",
  "seating": "Seating & Environment",
  "interventions": "Tier 2 Interventions",
  "mtss-plc": "MTSS & PLC — how they fit",
  "plc-tool": "PLC Meeting & Referral Tool",
  "toolkit": "My Toolkit",
  "my-work": "My Work",
  "toolkit-examples": "Toolkit Examples",
  "lesson-plans": "Lesson Plan Templates",
  "weekly-plan": "Weekly Plan",
  "unit-plan": "Unit Planner",
  "daily-plan": "Daily Plan",
  "pl-tool": "Write My PL Goal",
  "add": "Add a Strategy",
  "stats": "Usage Stats",
  "elementary": "Elementary Foundations",
  "early-reading": "Early Reading (K–5)",
  "early-math": "Early Math (K–5)",
  "early-writing": "Early Writing (K–5)",
  "early-science": "Early Science (K–5)",
  "early-social-studies": "Early Social Studies (K–5)",
  "early-pe": "Early PE (K–5)",
  "feedback": "Teacher–Student Feedback",
  "first-30-days": "First 30 Days",
  "about": "About the Toolkit",
  "strategy": "Strategy detail",
};

// ---------------- Data cache ----------------
const Data = {
  strategies: null,
  classroom: null,
  rigor: null,
  seating: null,
  standards: null,
  qpd: null,
  favorites: null,
  triedLog: null,

  async ensure() {
    if (!this.strategies) this.strategies = this._withElementaryRows(await fetchJSON("/api/strategies"));
    if (!this.classroom) this.classroom = await fetchJSON("/api/classroom-techniques");
    if (!this.rigor) this.rigor = await fetchJSON("/api/rigor-practices");
    if (!this.seating) this.seating = await fetchJSON("/api/seating-guides");
    if (!this.standards) this.standards = await fetchJSON("/api/standards-guides");
    if (!this.qpd) this.qpd = await fetchJSON("/api/qpd-content");
  },
  async reloadStrategies() {
    this.strategies = this._withElementaryRows(await fetchJSON("/api/strategies"));
  },
  // Merge the K–5 / Feedback strategy cards (defined in elementary.js as
  // window.ElementaryLibraryRows) into the main library so subject/grade
  // filters and global search find them. De-dupes by id and skips if the
  // backend already returned a row with the same id (e.g. because someone
  // later imports them server-side).
  _withElementaryRows(list) {
    const rows = Array.isArray(window.ElementaryLibraryRows) ? window.ElementaryLibraryRows : [];
    if (!rows.length) return list || [];
    const base = Array.isArray(list) ? list.slice() : [];
    const seen = new Set(base.map((s) => s && s.id));
    rows.forEach((r) => { if (r && r.id && !seen.has(r.id)) { base.push(r); seen.add(r.id); } });
    return base;
  },
  async loadFavorites() {
    const t = TeacherStore.get();
    if (!t) { this.favorites = new Set(); return this.favorites; }
    const arr = await fetchJSON(`/api/favorites?teacher=${encodeURIComponent(t)}`);
    this.favorites = new Set(arr);
    return this.favorites;
  },
  async toggleFavorite(strategyId) {
    const t = TeacherStore.get();
    if (!t) { window.requireTeacher(); return false; }
    if (!this.favorites) await this.loadFavorites();
    if (this.favorites.has(strategyId)) {
      await fetch(`/api/favorites?teacher=${encodeURIComponent(t)}&strategyId=${encodeURIComponent(strategyId)}`, { method: "DELETE" });
      this.favorites.delete(strategyId);
      return false;
    } else {
      await fetch(`/api/favorites`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teacher: t, strategyId }) });
      this.favorites.add(strategyId);
      return true;
    }
  },
  async loadTriedLog() {
    const t = TeacherStore.get();
    if (!t) { this.triedLog = []; return this.triedLog; }
    try { this.triedLog = await fetchJSON(`/api/tried-log?teacher=${encodeURIComponent(t)}`); }
    catch { this.triedLog = []; }
    return this.triedLog;
  },
  triedStrategyIds() {
    return new Set((this.triedLog || []).map((e) => e.strategyId));
  },
};

// ---------------- Router ----------------
const Routes = {
  "start-here": renderStartHere,
  "strategies": renderStrategies,
  "strategy": renderStrategyDetail, // #/strategy/:id
  "classroom": renderClassroom,
  "unit-plan": renderPlannerPage("renderUnitPlan"),
  "weekly-plan": renderPlannerPage("renderWeeklyPlan"),
  "daily-plan": renderPlannerPage("renderDailyPlan"),
  "pl-tool": renderPLTool,
  "elementary": renderModulePage("Elementary","renderHub"),
  "early-reading": renderModulePage("Elementary","renderReading"),
  "early-math": renderModulePage("Elementary","renderMath"),
  "early-writing": renderModulePage("Elementary","renderWriting"),
  "early-science": renderModulePage("Elementary","renderScience"),
  "early-social-studies": renderModulePage("Elementary","renderSocialStudies"),
  "early-pe": renderModulePage("Elementary","renderPE"),
  "feedback": renderModulePage("Elementary","renderFeedback"),
  // We-Town Toolkit parity routes — thin adapters into existing views.
  "today": (view) => renderStrategies(view, { mode: "today" }),
  "pick-for-me": (view) => renderStrategies(view, { mode: "pick" }),
  "interventions": renderInterventionsPage,
  "mtss-plc": renderMtssPlc,
  "plc-tool": renderPlcTool,
  "toolkit": (view) => renderStrategies(view, { mode: "favorites" }),
  "my-work": async (view) => { await Data.ensure(); window.Data = Data; view.innerHTML = ""; window.MyWork.render(view); window.scrollTo(0, 0); },
  "add": (view) => renderStrategies(view, { mode: "add" }),
  "rigor": (view) => { ClassroomTab = "rigor"; return renderClassroom(view); },
  "standards": renderStandards,
  "standards-unpack": renderStandardsUnpack,
  "standards-plan": renderStandardsPlan,
  "seating": (view) => { ClassroomTab = "seating"; return renderClassroom(view); },
  "lesson-plans": renderLessonPlans,
  "toolkit-examples": renderToolkitExamples,
  "stats": renderStats,
  "first-30-days": renderFirst30Days,
  "about": renderAbout,
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "") || "start-here";
  const [route, ...rest] = hash.split("/");
  return { route, params: rest };
}

async function router() {
  try {
    await Data.ensure();
    await Data.loadFavorites();
  } catch (e) {
    const view = $("#view");
    if (view) {
      view.innerHTML = `<div class="empty" style="padding:24px;"><strong>Can't reach the backend.</strong><br/><small>${escapeHtml(e.message)}</small><br/><small style="opacity:.7;">API base: ${escapeHtml(API)}</small></div>`;
    }
    return;
  }
  await Data.loadTriedLog();
  const { route, params } = currentRoute();
  const fn = Routes[route] || renderNotFound;
  const view = $("#view");
  view.innerHTML = '<div class="empty">Loading…</div>';
  try {
    await fn(view, params);
  } catch (e) {
    console.error(e);
    view.innerHTML = `<div class="empty">Error: ${escapeHtml(e.message)}</div>`;
  }
  // Update nav active
  $$(".nav-link").forEach((a) => a.classList.toggle("active", a.dataset.route === route || (route === "strategy" && a.dataset.route === "strategies")));
  // Record recent route (skip Start Here itself and strategy detail per-page)
  if (route !== "start-here") {
    const label = ROUTE_LABELS[route] || route;
    RecentRoutes.push(route, label);
  }
  window.scrollTo(0, 0);
  // Close mobile sidebar
  $("#sidebar")?.classList.remove("open");
  $("#sidebar-scrim")?.setAttribute("hidden", "");
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", init);

async function init() {
  // Teacher input
  const input = $("#teacher-name");
  const box = $("#teacher-box"), goBtn = $("#teacher-go"), hint = $("#teacher-hint"), label = $("#teacher-label");
  function paintSignIn() {
    const name = TeacherStore.get();
    box.classList.toggle("is-signed", !!name);
    box.classList.toggle("is-empty", !name);
    label.textContent = name ? "Signed in as" : "Sign in — just your name, no password";
    goBtn.textContent = name ? "Change" : "Sign in";
    hint.textContent = name ? `Welcome, ${name}. Your work saves under this name.` : "Your saved goals, plans and toolkit are filed under your name.";
  }
  window.requireTeacher = function () {
    if (TeacherStore.get()) return true;
    box.classList.add("is-empty"); input.focus(); input.select();
    toast("Type your name in the sidebar to save your work");
    return false;
  };
  async function commitName() {
    TeacherStore.set(input.value.trim());
    paintSignIn();
    await Data.loadFavorites();
    await Data.loadTriedLog();
    if (TeacherStore.get()) toast(`Signed in as ${TeacherStore.get()}`);
    router();
  }
  input.value = TeacherStore.get();
  paintSignIn();
  input.addEventListener("input", (e) => { TeacherStore.set(e.target.value.trim()); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); input.blur(); commitName(); } });
  input.addEventListener("change", commitName);
  goBtn.addEventListener("click", () => {
    if (TeacherStore.get() && goBtn.textContent === "Change") { input.focus(); input.select(); return; }
    commitName();
  });
  // Mobile sidebar toggle
  const toggle = $("#sidebar-toggle");
  const sidebar = $("#sidebar");
  const scrim = $("#sidebar-scrim");
  toggle?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    const open = sidebar.classList.contains("open");
    scrim.hidden = !open;
    toggle.setAttribute("aria-expanded", open);
  });
  scrim?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    scrim.hidden = true;
  });
  // Feedback links — open mailto with context (current page + teacher name).
  // Static href on the anchors is a fine fallback for right-click / copy.
  function feedbackMailto() {
    const who = TeacherStore.get() || "(not signed in)";
    const where = location.href;
    const subject = "Turner Toolkit feedback";
    const body =
      "Hi Paul,\n\n" +
      "Feedback about the Toolkit:\n\n" +
      "[ ] Broken link\n" +
      "[ ] Content is outdated\n" +
      "[ ] Suggest an improvement\n" +
      "[ ] Share a classroom example\n\n" +
      "Details:\n\n\n" +
      "---\n" +
      "Page: " + where + "\n" +
      "Signed in as: " + who + "\n";
    return "mailto:pt2479@hotmail.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  ["send-feedback-link", "page-foot-feedback"].forEach((id) => {
    const a = document.getElementById(id);
    if (!a) return;
    a.addEventListener("click", (ev) => {
      // Rebuild the URL at click time so it captures the current page + teacher.
      a.href = feedbackMailto();
      // Let the browser follow the mailto link normally.
    });
  });

  // Global search (needs data loaded)
  await Data.ensure().catch(() => {});
  initGlobalSearch();
  router();
}

// ============================================================
// PAGES
// ============================================================

function renderNotFound(view) {
  view.innerHTML = `<h1 class="page-title">Not found</h1><p class="page-lede">That page doesn't exist yet.</p>`;
}

// ------------------ Start Here ------------------
function videoCard(v) {
  if (!v || !v.url) return "";
  const embed = ytEmbed(v.url);
  return `
    <div class="video-block">
      <div class="video-icon">▶</div>
      <div>
        <div class="video-meta">Watch</div>
        <a class="video-title-link" href="${escapeHtml(v.url)}" target="_blank" rel="noopener">${escapeHtml(v.title || v.url)}</a>
        ${v.channel ? `<div class="video-channel">${escapeHtml(v.channel)}</div>` : ""}
        ${embed ? `<div style="margin-top:10px;aspect-ratio:16/9;max-width:560px;"><iframe src="${embed}" title="${escapeHtml(v.title||'video')}" allowfullscreen style="width:100%;height:100%;border:0;border-radius:6px"></iframe></div>` : ""}
      </div>
    </div>
  `;
}

// Compute weekly plan created-this-month count
function _countThisMonth(list, dateField) {
  const now = new Date();
  const m = now.getMonth(), y = now.getFullYear();
  return (list || []).filter((it) => {
    const raw = it[dateField] || it.updatedAt || it.createdAt;
    if (!raw) return false;
    const d = new Date(raw);
    return !isNaN(d) && d.getMonth() === m && d.getFullYear() === y;
  }).length;
}
function _countThisYear(list, dateField) {
  const y = new Date().getFullYear();
  return (list || []).filter((it) => {
    const raw = it[dateField] || it.updatedAt || it.createdAt;
    if (!raw) return false;
    const d = new Date(raw);
    return !isNaN(d) && d.getFullYear() === y;
  }).length;
}
function _countThisWeek(list, dateField) {
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - 7);
  return (list || []).filter((it) => {
    const raw = it[dateField] || it.createdAt;
    if (!raw) return false;
    const d = new Date(raw);
    return !isNaN(d) && d >= start;
  }).length;
}

async function renderStartHere(view) {
  const sh = Data.qpd?.startHere || {};
  const teacher = TeacherStore.get();
  const strategies = Data.strategies || [];
  const focusId = pickTodayFocus(strategies);
  const focusStrategy = strategies.find((s) => s.id === focusId);

  // Pull per-teacher metrics in parallel if signed in
  let weeklyPlans = [], plGoals = [], triedThisWeek = 0;
  const favCount = (Data.favorites && Data.favorites.size) || 0;
  if (teacher) {
    try {
      const [wp, pg] = await Promise.all([
        fetchJSON(`/api/weekly-plans?teacher=${encodeURIComponent(teacher)}`).catch(() => []),
        fetchJSON(`/api/pl-goals?teacher=${encodeURIComponent(teacher)}`).catch(() => []),
      ]);
      weeklyPlans = wp;
      plGoals = pg;
      triedThisWeek = _countThisWeek(Data.triedLog || [], "createdAt");
    } catch {}
  }
  const weeklyThisMonth = _countThisMonth(weeklyPlans, "updatedAt");
  const goalsThisYear = _countThisYear(plGoals, "updatedAt");

  // Recent favorites (last 3 favorited)
  const favArr = teacher ? Array.from(Data.favorites || []).slice(-3).reverse() : [];
  const recentFavs = favArr.map((id) => strategies.find((s) => s.id === id)).filter(Boolean);

  // Recent routes for jump-back-in
  const recent = RecentRoutes.get().slice(0, 3);

  // Continue where you left off
  const continueRoute = recent[0]?.route || "strategies";
  const continueLabel = recent[0]?.label || "Strategy Library";

  // Weekly reflection card visible Fri/Sat/Sun (5,6,0)
  const dow = new Date().getDay();
  const showReflection = teacher && (dow === 5 || dow === 6 || dow === 0);

  // Tried log recent 5
  const recentTried = (Data.triedLog || []).slice(0, 5).map((entry) => {
    const s = strategies.find((x) => x.id === entry.strategyId);
    return { entry, strategy: s };
  }).filter((x) => x.strategy);

  // Framing content (moved below dashboard)
  const engagementCycle = `
    <div class="card">
      <div class="card-meta">Framing</div>
      <div class="card-title">Turner Engagement Cycle — the one idea, in six moves</div>
      <p>The Turner Engagement Cycle is a shared frame for what an engaged classroom looks like across every subject: <strong>Notice → Read → Talk → Solve → Defend → Revise</strong>. Not a script — a checklist of the six things a lesson has to make room for if every student is going to think and not just receive.</p>
      <ul class="check-list">
        <li><strong>Notice</strong> — lowers the cost of starting so the reluctant student starts (Costa Level 1).</li>
        <li><strong>Read</strong> — puts evidence on the desk before anyone asks for a conclusion (Costa Level 1).</li>
        <li><strong>Talk</strong> — lets the quiet student say it once, in private, before saying it in public (bridging Level 1→2).</li>
        <li><strong>Solve</strong> — compare, infer, explain why, analyze (Costa Level 2).</li>
        <li><strong>Defend</strong> — written claim + named evidence + reasoning a stranger could check (Costa Level 3).</li>
        <li><strong>Revise</strong> — update the claim when a second source pushes back (Costa Level 3).</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-meta">Framing</div>
      <div class="card-title">The Turner Standard</div>
      <p>Every teacher at Wewoka High is expected to teach to the <strong>Turner Standard</strong>: bell-to-bell instruction with a posted objective, students doing the cognitive work, and reading and writing woven into every class period. It is the shared bar we hold ourselves to across departments.</p>
    </div>
  `;

  const heroName = teacher ? `Welcome back, ${escapeHtml(teacher)}` : `Every teacher deserves a <em>bigger toolbox</em>`;
  const heroLede = teacher
    ? `Pick up where you left off, log what you tried this week, or browse today’s focus below.`
    : `The Turner Instructional Toolkit is a working library of classroom strategies you can try tomorrow — whether you’re a first-year teacher learning the craft, a veteran adding new tools, or someone who came to teaching through a non-traditional path. Every entry is short, specific, and battle-tested.`;

  view.innerHTML = `
    <section class="hero">
      <div class="hero-media" style="background-image:url('./img/heroes/start-here.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Turner Toolkit · Start Here</div>
        <div class="hero-gold-line"></div>
        <h1 class="hero-title">${heroName}</h1>
        <p class="hero-lede">${heroLede}</p>
        <div class="hero-cta-row">
          ${teacher ? `<a class="hero-cta" href="#/${continueRoute}">Continue: ${escapeHtml(continueLabel)} →</a>` : `<a class="hero-cta" href="#/strategies">Browse the Library →</a>`}
          <a class="hero-cta secondary" href="#/first-30-days">Start with the first 30 days</a>
        </div>
      </div>
    </section>

    <div class="announce-callout" role="note">
      <span class="announce-eyebrow">New</span>
      <p class="announce-text">16 formative assessment strategies just added — <a href="#/strategies">see them in the Library</a>.</p>
    </div>

    <div class="audience-card">
      <h3>Built for teachers like you.</h3>
      <p>First-year teachers finding their footing · veteran teachers adding fresh strategies · career changers and alternatively certified teachers learning on the job · paraprofessionals stepping into a lead role · anyone who wants to keep growing.</p>
    </div>

    <a class="dash-jump-card" href="#/first-30-days" style="border-left:4px solid var(--gold); padding:20px 22px; margin-bottom:22px;">
      <div class="jump-meta">New here?</div>
      <div style="font-family:var(--font-serif); font-size:22px; color:var(--navy); margin-bottom:4px;">Start with the first 30 days →</div>
      <div style="font-size:14px; color:var(--muted); font-weight:400;">A curated week-by-week path through the classroom moves that matter most in month one.</div>
    </a>

    ${teacher ? `
      <h2 class="section-title">Your dashboard</h2>
      <div class="dash-stat-grid">
        <div class="card card-stat">
          <div class="stat-number">${favCount}</div>
          <div class="stat-label">Favorites</div>
          <div class="stat-sub"><a href="#/toolkit">Open my toolkit →</a></div>
        </div>
        <div class="card card-stat">
          <div class="stat-number">${weeklyThisMonth}</div>
          <div class="stat-label">Weekly plans this month</div>
          <div class="stat-sub"><a href="#/weekly-plan">Plan the week →</a></div>
        </div>
        <div class="card card-stat">
          <div class="stat-number">${goalsThisYear}</div>
          <div class="stat-label">PL goals this year</div>
          <div class="stat-sub"><a href="#/pl-tool">Write a goal →</a></div>
        </div>
        <div class="card card-stat accent">
          <div class="stat-number">${triedThisWeek}</div>
          <div class="stat-label">Tried this week</div>
          <div class="stat-sub">Log one below</div>
        </div>
      </div>
    ` : `
      <div class="card" style="border-left:4px solid var(--gold);">
        <div class="card-title">Add your name to save your progress.</div>
        <p>The Toolkit keeps track of favorites, PL goals, plans, and what you’ve tried — but only if you sign in with your name in the sidebar. Everything stays in your browser; there’s no account and no password.</p>
      </div>
    `}

    <div class="dash-row">
      <div class="card">
        <div class="card-meta">Today’s focus</div>
        <div class="card-title">${focusStrategy ? escapeHtml(focusStrategy.title) : "Loading…"}</div>
        ${focusStrategy ? `<p>${escapeHtml(focusStrategy.description || "")}</p><a class="btn primary" href="#/strategy/${encodeURIComponent(focusStrategy.id)}">Open this strategy →</a>` : ""}
      </div>
      <div class="card">
        <div class="card-meta">This week I tried</div>
        <div class="card-title">Recent log entries</div>
        ${recentTried.length ? `<ul class="tried-list">${recentTried.map(({entry, strategy}) => {
          const when = (entry.triedDate || entry.createdAt || "").slice(0, 10);
          return `<li><span class="tried-when">${escapeHtml(when)}</span><span><span class="${entry.worked ? 'tried-ok' : 'tried-no'}">${entry.worked ? '✓' : '✗'}</span><a href="#/strategy/${encodeURIComponent(strategy.id)}">${escapeHtml(strategy.title)}</a>${entry.notes ? `<div class="tried-notes">“${escapeHtml(entry.notes)}”</div>` : ""}</span></li>`;
        }).join("")}</ul>` : `<p style="color:var(--muted);font-size:14px;">${teacher ? "Nothing logged yet. Open any strategy detail page and click “I tried this” after your lesson." : "Sign in with your name to start logging what you tried."}</p>`}
      </div>
    </div>

    ${recentFavs.length ? `
      <h2 class="section-title">Recent favorites</h2>
      <div class="card-grid" id="start-recent-favs">
        ${recentFavs.map((s) => strategyCard(s)).join("")}
      </div>
    ` : ""}

    ${recent.length ? `
      <h2 class="section-title">Jump back in</h2>
      <div class="dash-jump-grid">
        ${recent.map((r) => `
          <a class="dash-jump-card" href="#/${r.route}">
            <div class="jump-meta">Last visited</div>
            <div>${escapeHtml(r.label)}</div>
          </a>
        `).join("")}
      </div>
    ` : ""}

    ${showReflection ? `
      <div class="reflection-card">
        <h3>Weekly reflection</h3>
        <p>Take five minutes before the weekend. Capture what students learned — that’s the loop.</p>
        <form id="reflection-form">
          <div class="rc-row"><label>One win this week</label><textarea name="wins" required></textarea></div>
          <div class="rc-row"><label>One struggle</label><textarea name="struggles"></textarea></div>
          <div class="rc-row">
            <label>What evidence shows whether students learned this week?</label>
            <textarea name="studentEvidence" placeholder="Exit tickets, work samples, formative results, engagement observations… what did you see?"></textarea>
          </div>
          <div class="rc-row">
            <label>Evidence types <span style="font-weight:400;color:var(--muted);">(pick any)</span></label>
            <div class="evidence-chips" id="refl-evidence-chips">
              ${EVIDENCE_TYPES.map((e) => `<button type="button" class="chip" data-evidence="${escapeHtml(e)}">${escapeHtml(e)}</button>`).join("")}
            </div>
          </div>
          <div class="rc-row"><label>One focus for next week</label><textarea name="nextWeekFocus"></textarea></div>
          <button type="submit" class="btn primary">Save reflection</button>
        </form>
      </div>
    ` : ""}

    <h2 class="section-title">The Wewoka frame</h2>
    ${engagementCycle}

    ${(() => {
      const secs = [];
      ["principalLookFors", "board", "unpack", "curriculumVsResources", "onYourFeet"].forEach((k) => {
        const s = sh[k];
        if (!s) return;
        let listHtml = "";
        if (s.lookFors) listHtml = `<ul class="check-list">${s.lookFors.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
        else if (s.items) listHtml = `<ul class="check-list">${s.items.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
        else if (s.steps) listHtml = `<ol style="padding-left:20px;">${s.steps.map((x) => `<li style="margin-bottom:6px;">${escapeHtml(x)}</li>`).join("")}</ol>`;
        else if (s.techniques) listHtml = `<ul class="check-list">${s.techniques.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
        else if (s.compare) {
          listHtml = `<div class="compare">${s.compare.map((c) => `<div class="compare-cell"><strong>${escapeHtml(c.label)}</strong>${escapeHtml(c.detail)}</div>`).join("")}</div>`;
        }
        secs.push(`
          <div class="card">
            <div class="card-title">${escapeHtml(s.title)}</div>
            <p>${escapeHtml(s.description || "")}</p>
            ${videoCard(s.video)}
            ${listHtml}
          </div>
        `);
      });
      return secs.length ? `<h2 class="section-title">Onboarding videos</h2>${secs.join("")}` : "";
    })()}
  `;

  // Wire recent-favs cards
  $$("#start-recent-favs .card").forEach((el) => {
    el.addEventListener("click", (ev) => {
      if (ev.target.closest(".fav-btn")) return;
      location.hash = `#/strategy/${el.dataset.id}`;
    });
  });

  // Wire reflection form (with student-evidence capture + evidence-type chips)
  const rf = $("#reflection-form");
  if (rf) {
    const evSet = new Set();
    rf.querySelectorAll("#refl-evidence-chips .chip").forEach((b) => {
      b.addEventListener("click", () => {
        const v = b.dataset.evidence;
        if (evSet.has(v)) { evSet.delete(v); b.classList.remove("on"); }
        else { evSet.add(v); b.classList.add("on"); }
      });
    });
    rf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const t = TeacherStore.get();
      if (!t) { window.requireTeacher(); return; }
      const fd = new FormData(rf);
      try {
        await fetchJSON("/api/reflections", { method: "POST", body: JSON.stringify({
          teacher: t,
          wins: fd.get("wins") || "",
          struggles: fd.get("struggles") || "",
          nextWeekFocus: fd.get("nextWeekFocus") || "",
          // NEW: student-learning evidence — closes the reflection loop.
          studentEvidence: fd.get("studentEvidence") || "",
          evidenceTypes: Array.from(evSet),
        }) });
        toast("Reflection saved — great work capturing evidence.");
        rf.reset();
        rf.querySelectorAll("#refl-evidence-chips .chip.on").forEach((b) => b.classList.remove("on"));
        evSet.clear();
      } catch (err) { toast("Save failed: " + err.message); }
    });
  }
}

// ------------------ Strategy Library ------------------
const StrategyFilters = { subject: "", grade: "", category: "", need: "", search: "", favoritesOnly: false, todayFocus: false };

// Helper called from Classroom Systems "Browse all strategies for this need" links
window.__setLibraryNeed = function (need) {
  StrategyFilters.subject = "";
  StrategyFilters.grade = "";
  StrategyFilters.category = "";
  StrategyFilters.need = need || "";
  StrategyFilters.search = "";
  StrategyFilters.favoritesOnly = false;
  StrategyFilters.todayFocus = false;
  location.hash = "#/strategies";
};
let TodayFocusId = null;

function pickTodayFocus(strategies) {
  // Stable pick per day
  const day = new Date();
  const key = day.getFullYear() * 372 + day.getMonth() * 31 + day.getDate();
  const idx = key % strategies.length;
  TodayFocusId = strategies[idx]?.id;
  return TodayFocusId;
}

function uniqueOptions(strategies, field) {
  const s = new Set();
  strategies.forEach((st) => {
    const val = st[field];
    if (Array.isArray(val)) val.forEach((v) => v && s.add(v));
    else if (val) s.add(val);
  });
  return Array.from(s).sort();
}

async function renderStrategies(view, params) {
  const strategies = Data.strategies;
  pickTodayFocus(strategies);

  const subjects = uniqueOptions(strategies, "subjects");
  const grades = uniqueOptions(strategies, "grades");
  const categories = uniqueOptions(strategies, "category");
  const needs = uniqueOptions(strategies, "needs");

  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-media" style="background-image:url('./img/heroes/library.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Strategy Library · ${strategies.length} entries</div>
        <h1 class="hero-title">Strategy Library</h1>
        <p class="hero-lede">Every strategy in one place, sorted by what you need to strengthen. Filter by grade or subject — or hit Pick for Me to get moving fast.</p>
      </div>
    </section>

    <div class="actions-row">
      <button class="btn gold" id="btn-pick">🎲 Pick for Me</button>
      <button class="btn primary" id="btn-today">⭐ Today's Focus</button>
      <button class="btn" id="btn-favs">♥ Favorites</button>
      <button class="btn" id="btn-add">＋ Add a Strategy</button>
    </div>

    <div class="filter-bar">
      <div class="filter-row">
        <input id="q" class="search-input" placeholder="Search by title, category, or need…" />
      </div>
      <div class="filter-row">
        <label>Subject</label>
        <select id="f-subject" class="select"><option value="">All</option>${subjects.map((s) => `<option>${escapeHtml(s)}</option>`).join("")}</select>
        <label>Grade</label>
        <select id="f-grade" class="select"><option value="">All</option>${grades.map((s) => `<option>${escapeHtml(s)}</option>`).join("")}</select>
        <label>Category</label>
        <select id="f-category" class="select"><option value="">All</option>${categories.map((s) => `<option>${escapeHtml(s)}</option>`).join("")}</select>
        <label>Need</label>
        <select id="f-need" class="select"><option value="">All</option>${needs.map((s) => `<option>${escapeHtml(s)}</option>`).join("")}</select>
      </div>
    </div>

    <div id="results-summary" style="margin-bottom:12px;color:var(--muted);font-size:13px;"></div>
    <div id="results" class="card-grid"></div>

    <div id="add-modal" style="display:none;position:fixed;inset:0;background:rgba(10,37,64,0.5);z-index:70;align-items:center;justify-content:center;padding:20px;overflow-y:auto;">
      <div style="background:#fff;max-width:640px;width:100%;padding:24px;border-radius:12px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto;">
        <h2 class="page-title" style="font-size:22px;">Add a Strategy</h2>
        <p class="page-lede" style="margin-bottom:16px;font-size:14px;">Contribute one that's worked in your classroom.</p>
        <form id="add-form" class="form-grid">
          <div class="form-row"><label>Title *</label><input required class="input" name="title" /></div>
          <div class="form-row"><label>Description *</label><textarea required class="textarea" name="description"></textarea></div>
          <div class="form-row"><label>How to use it</label><textarea class="textarea" name="howTo"></textarea></div>
          <div class="form-row"><label>Category</label><input class="input" name="category" placeholder="e.g. Discussion & Talk" /></div>
          <div class="form-row"><label>Subjects (comma-separated)</label><input class="input" name="subjects" placeholder="ELA, Math" /></div>
          <div class="form-row"><label>Grades (comma-separated)</label><input class="input" name="grades" placeholder="9-12" /></div>
          <div class="form-row"><label>Needs (comma-separated)</label><input class="input" name="needs" placeholder="Discussion, Feedback" /></div>
          <div class="form-row"><label>Source name</label><input class="input" name="sourceName" /></div>
          <div class="form-row"><label>Source URL</label><input class="input" type="url" name="sourceUrl" /></div>
          <div class="form-row"><label>Video URL (YouTube)</label><input class="input" type="url" name="videoUrl" /></div>
          <div class="form-row"><label>Your name</label><input class="input" name="createdBy" /></div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
            <button type="button" class="btn" id="add-cancel">Cancel</button>
            <button type="submit" class="btn primary">Save strategy</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const applyFilters = () => {
    let out = strategies.slice();
    if (StrategyFilters.favoritesOnly) {
      out = out.filter((s) => Data.favorites?.has(s.id));
    }
    if (StrategyFilters.todayFocus && TodayFocusId) {
      out = out.filter((s) => s.id === TodayFocusId);
    }
    if (StrategyFilters.subject) out = out.filter((s) => (s.subjects || []).includes(StrategyFilters.subject));
    if (StrategyFilters.grade) out = out.filter((s) => (s.grades || []).includes(StrategyFilters.grade));
    if (StrategyFilters.category) out = out.filter((s) => s.category === StrategyFilters.category);
    if (StrategyFilters.need) out = out.filter((s) => (s.needs || []).includes(StrategyFilters.need));
    if (StrategyFilters.search) {
      const q = StrategyFilters.search.toLowerCase();
      out = out.filter((s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q) ||
        (s.needs || []).join(" ").toLowerCase().includes(q)
      );
    }
    renderResults(out);
  };

  const renderResults = (list) => {
    const summary = $("#results-summary");
    summary.textContent = `${list.length} ${list.length === 1 ? "strategy" : "strategies"}${StrategyFilters.favoritesOnly ? " (favorites)" : ""}${StrategyFilters.todayFocus ? " — today's focus" : ""}`;
    const results = $("#results");
    if (!list.length) { results.innerHTML = '<div class="empty" style="grid-column:1/-1;">No strategies match your filters. Try clearing them.</div>'; return; }
    results.innerHTML = list.map((s) => strategyCard(s)).join("");
    $$("#results .card").forEach((el) => {
      el.addEventListener("click", (ev) => {
        if (ev.target.closest(".fav-btn")) return;
        location.hash = `#/strategy/${el.dataset.id}`;
      });
    });
    $$("#results .fav-btn").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const id = btn.dataset.id;
        const on = await Data.toggleFavorite(id);
        btn.classList.toggle("on", on);
        btn.textContent = on ? "♥" : "♡";
      });
    });
  };

  // Wire filters
  $("#q").addEventListener("input", (e) => { StrategyFilters.search = e.target.value; applyFilters(); });
  ["subject", "grade", "category", "need"].forEach((k) => {
    $(`#f-${k}`).addEventListener("change", (e) => { StrategyFilters[k] = e.target.value; applyFilters(); });
    $(`#f-${k}`).value = StrategyFilters[k];
  });
  $("#q").value = StrategyFilters.search;

  $("#btn-pick").addEventListener("click", () => {
    // Pick a random strategy that matches current filters
    const list = strategies.filter((s) => {
      if (StrategyFilters.subject && !(s.subjects || []).includes(StrategyFilters.subject)) return false;
      if (StrategyFilters.grade && !(s.grades || []).includes(StrategyFilters.grade)) return false;
      if (StrategyFilters.category && s.category !== StrategyFilters.category) return false;
      if (StrategyFilters.need && !(s.needs || []).includes(StrategyFilters.need)) return false;
      return true;
    });
    if (!list.length) { toast("No strategies match current filters"); return; }
    const pick = list[Math.floor(Math.random() * list.length)];
    location.hash = `#/strategy/${pick.id}`;
  });
  $("#btn-today").addEventListener("click", () => {
    StrategyFilters.todayFocus = !StrategyFilters.todayFocus;
    if (StrategyFilters.todayFocus) StrategyFilters.favoritesOnly = false;
    $("#btn-today").classList.toggle("gold", StrategyFilters.todayFocus);
    $("#btn-favs").classList.remove("gold");
    applyFilters();
  });
  $("#btn-favs").addEventListener("click", async () => {
    if (!TeacherStore.get()) { window.requireTeacher(); return; }
    await Data.loadFavorites();
    StrategyFilters.favoritesOnly = !StrategyFilters.favoritesOnly;
    if (StrategyFilters.favoritesOnly) StrategyFilters.todayFocus = false;
    $("#btn-favs").classList.toggle("gold", StrategyFilters.favoritesOnly);
    $("#btn-today").classList.remove("gold");
    applyFilters();
  });

  const modal = $("#add-modal");
  $("#btn-add").addEventListener("click", () => { modal.style.display = "flex"; });
  $("#add-cancel").addEventListener("click", () => { modal.style.display = "none"; });
  $("#add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const toArr = (s) => (s || "").split(",").map((x) => x.trim()).filter(Boolean);
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      howTo: fd.get("howTo") || "",
      category: fd.get("category") || "Custom",
      subjects: toArr(fd.get("subjects")).length ? toArr(fd.get("subjects")) : ["All Subjects"],
      grades: toArr(fd.get("grades")).length ? toArr(fd.get("grades")) : ["All Grades"],
      needs: toArr(fd.get("needs")),
      sourceName: fd.get("sourceName") || "",
      sourceUrl: fd.get("sourceUrl") || "",
      videoUrl: fd.get("videoUrl") || "",
      createdBy: fd.get("createdBy") || TeacherStore.get() || "",
    };
    try {
      await fetchJSON("/api/strategies", { method: "POST", body: JSON.stringify(payload) });
      toast("Strategy added");
      modal.style.display = "none";
      e.target.reset();
      await Data.reloadStrategies();
      applyFilters();
    } catch (err) {
      toast("Failed to add: " + err.message);
    }
  });

  applyFilters();

  // Optional entry mode (from sidebar shortcuts like /today, /pick-for-me, /toolkit, /add)
  const mode = params && params.mode;
  if (mode === "pick") { setTimeout(() => $("#btn-pick")?.click(), 50); }
  else if (mode === "today") { if (!StrategyFilters.todayFocus) $("#btn-today")?.click(); }
  else if (mode === "favorites") { if (!StrategyFilters.favoritesOnly) $("#btn-favs")?.click(); }
  else if (mode === "add") { setTimeout(() => $("#btn-add")?.click(), 50); }
}

// Slug -> friendly name for the K-5 / Feedback domain pages so cards can
// show "From: Early Science" and link back to the source hub.
const ELEMENTARY_PAGE_TITLES = {
  "early-reading":        "Early Reading",
  "early-math":           "Early Math",
  "early-writing":        "Early Writing",
  "early-science":        "Early Science",
  "early-social-studies": "Early Social Studies",
  "early-pe":             "Early PE",
  "feedback":             "Teacher–Student Feedback",
};

function strategyCard(s) {
  const fav = Data.favorites?.has(s.id);
  const isToday = TodayFocusId === s.id;
  const fromPage = s.elementaryPageSlug && ELEMENTARY_PAGE_TITLES[s.elementaryPageSlug];
  return `
    <div class="card" data-id="${escapeHtml(s.id)}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div class="card-meta">${escapeHtml(s.category || "")}${isToday ? ' <span class="tag-pill">Today\'s focus</span>' : ""}${s.isCustom ? ' <span class="tag-pill">Custom</span>' : ""}${fromPage ? ` <span class="tag-pill tag-pill-elem">From: ${escapeHtml(fromPage)}</span>` : ""}</div>
        <button class="fav-btn ${fav ? "on" : ""}" data-id="${escapeHtml(s.id)}" title="Favorite" aria-label="Favorite">${fav ? "♥" : "♡"}</button>
      </div>
      <div class="strategy-mini-title">${escapeHtml(s.title)}</div>
      <div class="strategy-mini-desc">${escapeHtml(s.description || "")}</div>
      <div class="card-tags">
        ${(s.subjects || []).slice(0, 3).map((x) => `<span class="tag subject">${escapeHtml(x)}</span>`).join("")}
        ${(s.grades || []).slice(0, 2).map((x) => `<span class="tag grade">${escapeHtml(x)}</span>`).join("")}
        ${(s.needs || []).slice(0, 2).map((x) => `<span class="tag need">${escapeHtml(x)}</span>`).join("")}
      </div>
    </div>
  `;
}

// ------------------ Strategy Detail ------------------
async function renderStrategyDetail(view, params) {
  const id = params[0];
  const s = Data.strategies.find((x) => x.id === id);
  if (!s) return renderNotFound(view);
  const fav = Data.favorites?.has(s.id);
  const video = (s.videoUrl || s.videoTitle) ? { url: s.videoUrl, title: s.videoTitle, channel: s.videoChannel } : null;

  view.innerHTML = `
    <a href="#/strategies" class="detail-back">← Back to Strategy Library</a>
    <h1 class="page-title">${escapeHtml(s.title)}</h1>
    <p class="page-lede">${escapeHtml(s.description || "")}</p>

    <div class="actions-row">
      <button class="btn ${fav ? "gold" : ""}" id="detail-fav">${fav ? "♥ Favorited" : "♡ Add to favorites"}</button>
      <button class="btn" id="detail-tried">✎ I tried this</button>
      ${Data.triedStrategyIds().has(s.id) ? '<span class="tried-badge">Tried</span>' : ""}
    </div>

    <div class="connect-row" aria-label="Put this strategy to work">
      <div class="connect-label">Put it to work</div>
      <div class="connect-actions">
        <button class="btn ghost" data-use-in="daily">Use in a Daily plan</button>
        <button class="btn ghost" data-use-in="weekly">Use in this Week</button>
        <button class="btn ghost" data-use-in="unit">Use in a Unit plan</button>
        <button class="btn ghost" id="connect-pl">Connect to my PL goal</button>
        <button class="btn ghost" id="request-coaching">I want help using this</button>
      </div>
    </div>

    <div class="card">
      <div class="card-meta">${escapeHtml(s.category || "")}${s.telStage ? " · " + escapeHtml(s.telStage) : ""}</div>
      <div class="card-tags" style="margin-bottom:12px;">
        ${(s.subjects || []).map((x) => `<span class="tag subject">${escapeHtml(x)}</span>`).join("")}
        ${(s.grades || []).map((x) => `<span class="tag grade">${escapeHtml(x)}</span>`).join("")}
        ${(s.needs || []).map((x) => `<span class="tag need">${escapeHtml(x)}</span>`).join("")}
      </div>

      ${s.elementaryPageSlug && ELEMENTARY_PAGE_TITLES[s.elementaryPageSlug] ? `
        <div class="section">
          <a class="strategy-open-link" href="#/${escapeHtml(s.elementaryPageSlug)}">
            See the full card on the ${escapeHtml(ELEMENTARY_PAGE_TITLES[s.elementaryPageSlug])} page →
          </a>
        </div>` : ""}

      ${s.howTo ? `<div class="section"><h3 class="subsection-title">How to use it</h3><p>${nl2br(s.howTo)}</p></div>` : ""}
      ${s.example ? `<div class="section"><h3 class="subsection-title">Classroom example</h3><p>${nl2br(s.example)}</p></div>` : ""}
      ${s.weeklyProduct ? `<div class="section"><h3 class="subsection-title">Weekly product</h3><p>${nl2br(s.weeklyProduct)}</p></div>` : ""}

      ${video ? `<div class="section">${videoCard(video)}</div>` : ""}

      ${s.sourceUrl ? `
        <div class="source-block">
          <span class="source-label">Source</span>
          <a href="${escapeHtml(s.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(s.sourceName || s.sourceUrl)}</a>
        </div>` : ""}

      ${s.evidenceSourceUrl && s.evidenceSourceUrl !== s.sourceUrl ? `
        <div class="source-block">
          <span class="source-label">Evidence</span>
          <a href="${escapeHtml(s.evidenceSourceUrl)}" target="_blank" rel="noopener">${escapeHtml(s.evidenceType || s.evidenceSourceUrl)}${s.effectSizeLabel ? " — effect size " + escapeHtml(s.effectSizeLabel) : ""}</a>
        </div>` : ""}
    </div>
  `;

  $("#detail-fav").addEventListener("click", async () => {
    const on = await Data.toggleFavorite(s.id);
    const btn = $("#detail-fav");
    btn.classList.toggle("gold", on);
    btn.textContent = on ? "♥ Favorited" : "♡ Add to favorites";
  });

  $("#detail-tried").addEventListener("click", () => openTriedModal(s));

  // Connective-tissue: link strategy → plans, PL goal, coaching
  view.querySelectorAll("[data-use-in]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.useIn;
      // Stash the strategy id + kind for the destination page to consume.
      try {
        sessionStorage.setItem("pendingStrategyInsert", JSON.stringify({
          strategyId: s.id,
          strategyTitle: s.title,
          kind,
          ts: Date.now(),
        }));
      } catch {}
      const routes = { daily: "#/lesson-plans", weekly: "#/weekly-plan", unit: "#/unit-plan" };
      location.hash = routes[kind] || "#/weekly-plan";
    });
  });

  $("#connect-pl")?.addEventListener("click", () => {
    try {
      sessionStorage.setItem("pendingStrategyInsert", JSON.stringify({
        strategyId: s.id, strategyTitle: s.title, kind: "pl", ts: Date.now(),
      }));
    } catch {}
    location.hash = "#/pl-tool";
  });

  $("#request-coaching")?.addEventListener("click", () => {
    const t = TeacherStore.get();
    if (!t) { window.requireTeacher(); return; }
    const note = prompt("What kind of help do you want? (e.g., 'model this in my class', 'watch me try it', 'help me plan the rollout')") || "";
    CoachingRequests.add({ strategyId: s.id, strategyTitle: s.title, note });
    toast("Coaching request saved to My Growth.");
  });
}

// -------- Tried-log modal (4-way outcome + evidence of student learning) --------
// Design intent (per user feedback): teaching is rarely binary. Replace the
// worked / didn't-work toggle with four honest outcomes, and always ask what
// evidence tells the teacher whether students actually learned. The old
// { worked: true|false } shape stays populated (worked = 'worked' outcome)
// so backend + existing views keep functioning while we roll out.

const TRIED_OUTCOMES = [
  { id: "worked",   label: "Worked well",         hint: "Students got it; use this again." },
  { id: "partial",  label: "Partially worked",     hint: "Some students got it; tweak and re-try." },
  { id: "not_yet",  label: "Did not work yet",     hint: "Missed the mark today; not writing it off." },
  { id: "coaching", label: "Need coaching / modeling", hint: "Want a peer or coach to help me try this." },
];

const EVIDENCE_TYPES = [
  "Exit ticket",
  "Common formative assessment",
  "Student-work sample",
  "Student discussion",
  "Assignment completion",
  "Pre/post result",
  "Engagement observation",
  "Other",
];

function openTriedModal(strategy) {
  const t = TeacherStore.get();
  if (!t) { window.requireTeacher(); return; }
  // Remove any existing modal
  document.querySelector(".tried-modal")?.remove();

  const modal = document.createElement("div");
  modal.className = "tried-modal show";
  modal.innerHTML = `
    <div class="tried-modal-inner" role="dialog" aria-labelledby="tried-modal-title">
      <h3 id="tried-modal-title">Log: ${escapeHtml(strategy.title)}</h3>

      <label class="tm-label">How did it go?</label>
      <div class="outcome-grid">
        ${TRIED_OUTCOMES.map((o, i) => `
          <button type="button" class="outcome-btn ${i === 0 ? "selected" : ""}" data-outcome="${o.id}">
            <div class="outcome-title">${escapeHtml(o.label)}</div>
            <div class="outcome-hint">${escapeHtml(o.hint)}</div>
          </button>
        `).join("")}
      </div>

      <label class="tm-label">What evidence shows whether students learned? <span class="tm-optional">(pick any)</span></label>
      <div class="evidence-chips">
        ${EVIDENCE_TYPES.map((e) => `
          <button type="button" class="chip" data-evidence="${escapeHtml(e)}">${escapeHtml(e)}</button>
        `).join("")}
      </div>

      <label class="tm-label">Evidence detail <span class="tm-optional">(what did you see?)</span></label>
      <textarea id="evidence-notes" placeholder="e.g. 18 of 22 exit tickets showed the target; 3 needed reteach on step 2."></textarea>

      <label class="tm-label">Quick note <span class="tm-optional">(what you'd change next time)</span></label>
      <textarea id="tried-notes" placeholder="One line about how it went, what you'd tweak."></textarea>

      <div class="modal-actions">
        <button type="button" class="btn" id="tried-cancel">Cancel</button>
        <button type="button" class="btn primary" id="tried-save">Save entry</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let outcome = "worked";
  modal.querySelectorAll(".outcome-btn").forEach((b) => {
    b.addEventListener("click", () => {
      modal.querySelectorAll(".outcome-btn").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      outcome = b.dataset.outcome;
    });
  });

  const evidence = new Set();
  modal.querySelectorAll(".evidence-chips .chip").forEach((b) => {
    b.addEventListener("click", () => {
      const v = b.dataset.evidence;
      if (evidence.has(v)) { evidence.delete(v); b.classList.remove("on"); }
      else { evidence.add(v); b.classList.add("on"); }
    });
  });

  modal.querySelector("#tried-cancel").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

  modal.querySelector("#tried-save").addEventListener("click", async () => {
    const notes = modal.querySelector("#tried-notes").value;
    const evidenceNotes = modal.querySelector("#evidence-notes").value;
    const today = new Date().toISOString().slice(0, 10);
    try {
      await fetchJSON("/api/tried-log", {
        method: "POST",
        body: JSON.stringify({
          teacher: TeacherStore.get(),
          strategyId: strategy.id,
          // Legacy field kept so old dashboards/backends keep working.
          worked: (outcome === "worked"),
          // New rich fields.
          outcome,                                 // worked | partial | not_yet | coaching
          evidenceTypes: Array.from(evidence),     // string[]
          evidenceNotes,                           // long-form evidence detail
          notes,
          triedDate: today,
        }),
      });
      const messages = {
        worked:   "Logged — nice work. Try it again next week to build the habit.",
        partial:  "Logged. Adjust one thing and give it another rep.",
        not_yet:  "Logged. Not working yet ≠ not working — keep at it.",
        coaching: "Logged. A coaching request will show in your Growth Dashboard.",
      };
      toast(messages[outcome] || "Logged.");
      await Data.loadTriedLog();
      modal.remove();
      // Offer the natural next action — don't force it.
      offerNextAction(strategy, outcome);
      router();
    } catch (err) {
      toast("Save failed: " + err.message);
    }
  });
}

// After a tried-log entry, surface the most useful next step for that outcome.
// Non-modal, dismissible — keeps the loop closed without forcing.
function offerNextAction(strategy, outcome) {
  const el = document.createElement("div");
  el.className = "next-action-toast";
  const actions = {
    worked: [
      { label: "Add to my Weekly Plan", href: "#/weekly-plan" },
      { label: "Log another try",       href: `#/strategy/${strategy.id}`, action: "tried" },
    ],
    partial: [
      { label: "Find related strategies", href: "#/strategies" },
      { label: "Add to Weekly Plan",      href: "#/weekly-plan" },
    ],
    not_yet: [
      { label: "See the strategy again", href: `#/strategy/${strategy.id}` },
      { label: "Try a different move",   href: "#/strategies" },
    ],
    coaching: [
      { label: "Save a coaching request", action: "coaching" },
      { label: "Browse related",           href: "#/strategies" },
    ],
  }[outcome] || [];
  el.innerHTML = `
    <div class="nat-inner">
      <div class="nat-title">What's next?</div>
      <div class="nat-actions">
        ${actions.map((a, i) => `<a class="btn ${i === 0 ? "primary" : ""}" data-nat="${i}" href="${a.href || "#"}">${escapeHtml(a.label)}</a>`).join("")}
        <button type="button" class="btn ghost" id="nat-dismiss" aria-label="Dismiss">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  el.querySelector("#nat-dismiss").addEventListener("click", () => el.remove());
  el.querySelectorAll("a[data-nat]").forEach((a, i) => {
    a.addEventListener("click", (ev) => {
      const spec = actions[i];
      if (spec.action === "coaching") {
        ev.preventDefault();
        CoachingRequests.add({ strategyId: strategy.id, strategyTitle: strategy.title, note: "Requested from tried-log." });
        toast("Coaching request saved to My Growth.");
        el.remove();
      } else {
        // Just let the anchor navigate; auto-dismiss.
        setTimeout(() => el.remove(), 200);
      }
    });
  });
  // Auto-dismiss after 12s so it never becomes clutter.
  setTimeout(() => el.remove(), 12000);
}

// -------- Coaching requests (private, browser-local) --------
const CoachingRequests = {
  key() {
    const t = TeacherStore.get() || "anon";
    return `coaching_requests:${t}`;
  },
  all() {
    try { return JSON.parse(localStorage.getItem(this.key()) || "[]"); } catch { return []; }
  },
  add(req) {
    const list = this.all();
    list.unshift({ id: Date.now().toString(36), createdAt: new Date().toISOString(), status: "open", ...req });
    localStorage.setItem(this.key(), JSON.stringify(list));
  },
  update(id, patch) {
    const list = this.all().map((r) => r.id === id ? { ...r, ...patch } : r);
    localStorage.setItem(this.key(), JSON.stringify(list));
  },
  remove(id) {
    const list = this.all().filter((r) => r.id !== id);
    localStorage.setItem(this.key(), JSON.stringify(list));
  },
  openCount() { return this.all().filter((r) => r.status === "open").length; },
};

// ------------------ Classroom Systems ------------------
let ClassroomTab = "techniques";

async function renderClassroom(view) {
  const tabs = [
    ["techniques", "Techniques", Data.classroom],
    ["rigor", "Rigor practices", Data.rigor],
    ["seating", "Seating guides", Data.seating],
    ["standards", "Standards guides", Data.standards],
    ["interventions", "Interventions", Data.qpd?.interventions?.items || []],
    ["pies", "PIES framing", null],
  ];

  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-media" style="background-image:url('./img/heroes/classroom.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Classroom Systems</div>
        <h1 class="hero-title">Classroom Systems</h1>
        <p class="hero-lede">The management side of teaching — techniques, rigor moves, seating, standards guides, and interventions in one place.</p>
      </div>
    </section>
    <div class="tabs" id="cls-tabs">
      ${tabs.map((t) => `<button class="tab ${t[0] === ClassroomTab ? "active" : ""}" data-tab="${t[0]}">${escapeHtml(t[1])}${t[2] ? ` <span style="color:var(--muted-2);font-weight:500;">(${t[2].length})</span>` : ""}</button>`).join("")}
    </div>
    <div id="cls-body"></div>
  `;

  const drawBody = () => {
    const body = $("#cls-body");
    if (ClassroomTab === "techniques") body.innerHTML = simpleList(Data.classroom, "technique");
    else if (ClassroomTab === "rigor") body.innerHTML = simpleList(Data.rigor, "rigor");
    else if (ClassroomTab === "seating") body.innerHTML = simpleList(Data.seating, "seating");
    else if (ClassroomTab === "standards") body.innerHTML = simpleList(Data.standards, "standards");
    else if (ClassroomTab === "interventions") body.innerHTML = renderInterventions();
    else if (ClassroomTab === "pies") body.innerHTML = renderPIES();
  };

  $$("#cls-tabs .tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      ClassroomTab = btn.dataset.tab;
      $$("#cls-tabs .tab").forEach((b) => b.classList.toggle("active", b === btn));
      drawBody();
    });
  });
  drawBody();
}

// Map technique/rigor categories to strategy needs so we can link related strategies
const CATEGORY_TO_NEEDS = {
  // Techniques
  "Active Supervision & Monitoring": ["Behavior & Self-Regulation", "Attention & Focus"],
  "Attention Signals & Transitions": ["Attention & Focus", "Behavior & Self-Regulation"],
  "Positive Reinforcement & Relationships": ["Relationships & Climate", "Behavior & Self-Regulation"],
  "Positive Systems & Recognition": ["Relationships & Climate", "Engagement & Motivation"],
  "Proximity & Non-Verbal Cues": ["Behavior & Self-Regulation", "Attention & Focus"],
  "Redirection & De-escalation": ["Behavior & Self-Regulation", "Relationships & Climate"],
  "Restorative Practices & Repair": ["Relationships & Climate", "Behavior & Self-Regulation"],
  "Routines & Procedures": ["Behavior & Self-Regulation", "Attention & Focus"],
  "Self-Regulation & Calm-Down Spaces": ["Behavior & Self-Regulation", "Relationships & Climate"],
};

function findRelatedStrategies(item, kind, limit = 6) {
  if (!Data.strategies?.length) return [];
  const title = (item.title || item.name || "").toLowerCase();
  const cat = item.category || "";
  const needs = CATEGORY_TO_NEEDS[cat] || [];
  const scored = [];
  for (const s of Data.strategies) {
    let score = 0;
    const sneeds = s.needs || [];
    // Match by need overlap
    for (const n of needs) if (sneeds.includes(n)) score += 3;
    // Match by title keywords (word overlap, 3+ chars)
    const titleWords = title.split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
    const stitle = (s.title || "").toLowerCase();
    for (const w of titleWords) if (stitle.includes(w)) score += 2;
    // Match rigor -> Feedback & Formative Assessment or Explicit Instruction
    if (kind === "rigor" && (sneeds.includes("Feedback & Formative Assessment") || sneeds.includes("Explicit Instruction"))) score += 1;
    if (score > 0) scored.push([score, s]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  return scored.slice(0, limit).map((x) => x[1]);
}

function relatedStrategiesBlock(item, kind) {
  const rel = findRelatedStrategies(item, kind);
  if (!rel.length) return "";
  const cat = item.category || "";
  const needs = CATEGORY_TO_NEEDS[cat] || [];
  const needName = needs[0] || "";
  return `
    <h3 class="subsection-title">Related strategies from the Library</h3>
    <ul class="related-list">
      ${rel.map((s) => `<li><a href="#/strategy/${encodeURIComponent(s.id)}">${escapeHtml(s.title)}</a></li>`).join("")}
    </ul>
    ${needName ? `<p style="margin-top:8px;"><a class="btn btn-ghost" href="#/strategies" data-need="${escapeHtml(needName)}" onclick="event.preventDefault();window.__setLibraryNeed &amp;&amp; window.__setLibraryNeed(this.dataset.need);">Browse all strategies for &ldquo;${escapeHtml(needName)}&rdquo; →</a></p>` : ""}
  `;
}

function simpleList(items, kind) {
  if (!items || !items.length) return '<div class="empty">No items yet.</div>';
  return items.map((it) => {
    const video = (it.videoUrl || it.videoTitle) ? { url: it.videoUrl, title: it.videoTitle, channel: it.videoChannel } : null;
    let meta = it.category || "";
    if (!meta && it.chapterNumber) meta = "Chapter " + it.chapterNumber;
    return `
      <div class="card">
        ${meta ? `<div class="card-meta">${escapeHtml(meta)}</div>` : ""}
        <div class="card-title">${escapeHtml(it.title || it.name)}</div>
        ${it.description ? `<p>${escapeHtml(it.description)}</p>` : ""}
        ${it.whenToUse ? `<h3 class="subsection-title">When to use it</h3><p>${escapeHtml(it.whenToUse)}</p>` : ""}
        ${it.howTo ? `<h3 class="subsection-title">How to do it</h3><p>${nl2br(it.howTo)}</p>` : ""}
        ${it.bestFor ? `<h3 class="subsection-title">Best for</h3><p>${escapeHtml(it.bestFor)}</p>` : ""}
        ${it.example ? `<h3 class="subsection-title">Example</h3><p>${nl2br(it.example)}</p>` : ""}
        ${video ? videoCard(video) : ""}
        ${it.sourceUrl ? `<div class="source-block"><span class="source-label">Source</span><a href="${escapeHtml(it.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(it.sourceName || it.sourceUrl)}</a></div>` : ""}
        ${relatedStrategiesBlock(it, kind)}
      </div>
    `;
  }).join("");
}


// ------------------ Tier 2: Academic Interventions (own page) ------------------
let IntvState = { category: "all", q: "" };
async function renderInterventionsPage(view) {
  await Data.ensure();
  const iv = Data.qpd?.interventions || { categories: [], items: [] };
  const cats = iv.categories || [];
  view.innerHTML = `
    <div class="page-kicker">Tier 2</div>
    <h1 class="page-title">Academic Interventions</h1>
    <p class="page-lede">Evidence-based Tier 2 supports across academics, behavior &amp; SEL, attendance, executive function, and EL/newcomer needs — for the students who need more than strong Tier 1. Each entry has a short demonstration video and a research citation so you can go deeper before Monday. Use the <a href="#/mtss-plc">MTSS &amp; PLC page</a> for the how-it-fits, and the <a href="#/plc-tool">PLC Meeting &amp; Referral Tool</a> to file Tier 2 referrals with a documented Tier 1 history.</p>
    <div class="filter-row" id="intv-filters">
      <button type="button" class="filter-btn${IntvState.category === "all" ? " active" : ""}" data-cat="all">All (${(iv.items || []).length})</button>
      ${cats.map((c) => `<button type="button" class="filter-btn${IntvState.category === c.id ? " active" : ""}" data-cat="${escapeHtml(c.id)}">${escapeHtml(c.label)} (${(iv.items || []).filter((i) => i.category === c.id).length})</button>`).join("")}
      <input class="search-input" id="intv-search" placeholder="Search interventions…" value="${escapeHtml(IntvState.q)}" />
    </div>
    <div id="intv-body"></div>
  `;
  const body = $("#intv-body");
  const paint = () => {
    const q = IntvState.q.trim().toLowerCase();
    const filtered = {
      categories: cats.filter((c) => IntvState.category === "all" || c.id === IntvState.category),
      items: (iv.items || []).filter((it) => (IntvState.category === "all" || it.category === IntvState.category) &&
        (!q || [it.name, it.subject, it.description, it.format].join(" ").toLowerCase().includes(q))),
    };
    body.innerHTML = filtered.items.length ? renderInterventions(filtered) : '<div class="empty">No interventions match.</div>';
  };
  paint();
  view.querySelectorAll("#intv-filters .filter-btn").forEach((b) => b.addEventListener("click", () => {
    IntvState.category = b.dataset.cat;
    view.querySelectorAll("#intv-filters .filter-btn").forEach((x) => x.classList.toggle("active", x === b));
    paint();
  }));
  $("#intv-search").addEventListener("input", (e) => { IntvState.q = e.target.value; paint(); });
}

function renderInterventions(ivOverride) {
  const iv = ivOverride || Data.qpd?.interventions || { categories: [], items: [] };
  const cats = iv.categories || [];
  const items = iv.items || [];
  if (!items.length) return '<div class="empty">No interventions loaded.</div>';
  const byCat = {};
  items.forEach((it) => { (byCat[it.category] ||= []).push(it); });
  return cats.map((c) => {
    const list = byCat[c.id] || [];
    if (!list.length) return "";
    return `
      <h2 class="section-title">${escapeHtml(c.label)}</h2>
      ${list.map((it) => {
        // Match interventions to strategies by subject + literacy/math needs
        const subj = (it.subject || "").toLowerCase();
        const need = subj.includes("read") || subj.includes("ela") || subj.includes("literacy") ? "Reading & Literacy"
                   : subj.includes("math") ? "Math & Problem-Solving"
                   : subj.includes("writ") ? "Reading & Literacy"
                   : "";
        const rel = need ? (Data.strategies || []).filter((s) => (s.needs || []).includes(need)).slice(0, 4) : [];
        return `
        <div class="card">
          <div class="card-meta">${escapeHtml(it.subject || "")}</div>
          <div class="card-title">${escapeHtml(it.name)}</div>
          <div class="card-format">${escapeHtml(it.format || "")}</div>
          <p>${escapeHtml(it.description)}</p>
          ${videoCard(it.video)}
          ${it.resources?.length ? `<h3 class="subsection-title">Resources</h3><ul class="resource-list">${it.resources.map((r) => `<li><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.title)}</a></li>`).join("")}</ul>` : ""}
          ${it.citation ? `<div class="citation">${escapeHtml(it.citation)}</div>` : ""}
          ${rel.length ? `<h3 class="subsection-title">Related Tier 1 strategies</h3><ul class="related-list">${rel.map((s) => `<li><a href="#/strategy/${encodeURIComponent(s.id)}">${escapeHtml(s.title)}</a></li>`).join("")}</ul>` : ""}
        </div>
      `;}).join("")}
    `;
  }).join("");
}

function renderPIES() {
  return `
    <div class="callout"><h3>What is PIES?</h3><p>PIES is the shared bar for a well-designed cooperative learning task. It asks four questions of any group activity before you use it. If it fails any one, redesign the task before running it.</p></div>
    <div class="card">
      <h3 class="subsection-title">P — Positive interdependence</h3>
      <p>Students need each other to succeed. If one student can complete the task alone, the task isn't cooperative — it's just group seating. Build in shared goals, shared resources, or divided roles.</p>
    </div>
    <div class="card">
      <h3 class="subsection-title">I — Individual accountability</h3>
      <p>Every student must be individually accountable for producing something (a written response, a spoken explanation, a graded product). Otherwise strong students carry weaker ones.</p>
    </div>
    <div class="card">
      <h3 class="subsection-title">E — Equal participation</h3>
      <p>Structure the task so every student talks or writes approximately the same amount — sentence stems, timed rounds, or protocols like round-robin.</p>
    </div>
    <div class="card">
      <h3 class="subsection-title">S — Simultaneous interaction</h3>
      <p>Maximize the percentage of students actively engaged at any given moment. Pair-share beats one-student-answers; small groups beat whole-class Q&amp;A.</p>
    </div>
    <p style="margin-top:16px;font-size:13px;color:var(--muted);">The PIES framework comes from Spencer Kagan's cooperative-learning research.</p>
  `;
}

// ------------------ Unit Plan ------------------

// Planner pages (weekly / unit / daily) come from the Toolkit planner module
// (planner-core.js + planner-pages.js): OAS standards picker, step-by-step
// walkthrough, and one-click Word (.docx) download.
function renderModulePage(mod, fn) {
  return async function (view) {
    view.innerHTML = "";
    const M = window[mod];
    if (!M || !M[fn]) { view.innerHTML = '<div class="empty">This section failed to load.</div>'; return; }
    view.appendChild(M[fn]());
    window.scrollTo(0, 0);
  };
}
function renderPlannerPage(fn) {
  return async function (view) {
    view.innerHTML = "";
    if (!window.PlannerPages || !window.PlannerPages[fn]) {
      view.innerHTML = '<div class="empty">Planner module failed to load.</div>';
      return;
    }
    view.appendChild(window.PlannerPages[fn]());
    window.scrollTo(0, 0);
  };
}

async function renderUnitPlan(view) {
  const teacher = TeacherStore.get();
  const saved = teacher ? await fetchJSON(`/api/unit-plans?teacher=${encodeURIComponent(teacher)}`).catch(() => []) : [];

  view.innerHTML = `
    <h1 class="page-title">Unit Plan</h1>
    <p class="page-lede">Sketch a unit — standard, big idea, weekly arc, and assessments. Save it and pick it back up on any device.</p>

    <div class="card">
      <h3 class="subsection-title">Unit planner</h3>
      <form id="unit-form" class="form-grid">
        <div class="form-row"><label>Unit title</label><input class="input" name="title" required placeholder="e.g. Argumentative writing — Unit 2" /></div>
        <div class="form-row">
          <label>Standard code</label>
          <input class="input" id="unit-std-code" name="standardCode" placeholder="e.g. 11.3.R.3 or type your own" />
          <div id="unit-std-picker"></div>
          <textarea class="textarea" id="unit-std-text" name="standardText" placeholder="Standard text (auto-fills when you pick from the catalog, or paste your own)" style="min-height:60px;"></textarea>
        </div>
        <div class="form-row"><label>Big idea / essential question</label><textarea class="textarea" name="bigIdea"></textarea></div>
        <div class="form-row"><label>Weekly arc (Week 1 → end)</label><textarea class="textarea" name="arc" placeholder="Week 1: launch task…&#10;Week 2: model text study…"></textarea></div>
        <div class="form-row"><label>Formative check-ins</label><textarea class="textarea" name="formatives"></textarea></div>
        <div class="form-row"><label>Summative assessment</label><textarea class="textarea" name="summative"></textarea></div>
        <div class="form-row"><label>Reading &amp; writing across this unit</label><textarea class="textarea" name="literacy" placeholder="Where in this unit will students read complex text and write?"></textarea></div>
        <button type="submit" class="btn primary" style="justify-self:start;">Save unit plan</button>
      </form>
    </div>

    <h2 class="section-title">Standards guides</h2>
    <p style="font-size:14px;color:var(--muted);">Search for a standard breakdown by code or keyword:</p>
    <input id="std-search" class="search-input" placeholder="e.g. R.4 or fluency" style="max-width:400px;margin-bottom:12px;" />
    <div id="std-results"></div>

    <h2 class="section-title">Your saved unit plans</h2>
    <div id="saved-units">${saved.length ? saved.map((p) => `<div class="card"><div class="card-meta">${escapeHtml(p.updatedAt || "")}</div><div class="card-title">${escapeHtml(p.title || "Untitled")}</div><pre style="white-space:pre-wrap;background:#f9f6ec;padding:12px;border-radius:6px;font-family:inherit;font-size:13px;">${escapeHtml(JSON.stringify(p.data, null, 2))}</pre></div>`).join("") : '<div class="empty">No saved unit plans yet.</div>'}</div>
  `;

  attachStandardsPicker({ mount: "#unit-std-picker", codeInput: "#unit-std-code", textOutput: "#unit-std-text" });

  const stdSearch = $("#std-search");
  const stdResults = $("#std-results");
  const runSearch = async () => {
    const q = stdSearch.value.trim();
    const items = await fetchJSON(`/api/standards-breakdowns?q=${encodeURIComponent(q)}`);
    if (!items.length) { stdResults.innerHTML = '<div class="empty">No standards found.</div>'; return; }
    stdResults.innerHTML = items.slice(0, 20).map((it) => {
      const video = (it.videoUrl || it.videoTitle) ? { url: it.videoUrl, title: it.videoTitle, channel: it.videoChannel } : null;
      return `
        <div class="card">
          <div class="card-meta">${escapeHtml(it.subject || "")}${it.standardCode ? " · " + escapeHtml(it.standardCode) : ""}</div>
          <div class="card-title">${escapeHtml(it.title || it.standardCode)}</div>
          ${it.standardText ? `<p style="font-style:italic;color:var(--muted);">${escapeHtml(it.standardText)}</p>` : ""}
          ${it.description ? `<p>${escapeHtml(it.description)}</p>` : ""}
          ${it.howTo ? `<h3 class="subsection-title">How to unpack it</h3><p>${nl2br(it.howTo)}</p>` : ""}
          ${it.example ? `<h3 class="subsection-title">Example</h3><p>${nl2br(it.example)}</p>` : ""}
          ${video ? videoCard(video) : ""}
          ${it.sourceUrl ? `<div class="source-block"><span class="source-label">Source</span><a href="${escapeHtml(it.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(it.sourceName || it.sourceUrl)}</a></div>` : ""}
        </div>
      `;
    }).join("");
  };
  stdSearch.addEventListener("input", runSearch);
  runSearch();

  $("#unit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = TeacherStore.get();
    if (!t) { window.requireTeacher(); return; }
    const fd = new FormData(e.target);
    const payload = {
      teacher: t,
      title: fd.get("title"),
      data: {
        standardCode: fd.get("standardCode"),
        standardText: fd.get("standardText"),
        bigIdea: fd.get("bigIdea"),
        arc: fd.get("arc"),
        formatives: fd.get("formatives"),
        summative: fd.get("summative"),
        literacy: fd.get("literacy"),
      },
    };
    try {
      await fetchJSON("/api/unit-plans", { method: "POST", body: JSON.stringify(payload) });
      toast("Unit plan saved");
      router();
    } catch (err) { toast("Save failed: " + err.message); }
  });
}

// ------------------ Weekly Plan ------------------
async function renderWeeklyPlan(view) {
  const teacher = TeacherStore.get();
  const saved = teacher ? await fetchJSON(`/api/weekly-plans?teacher=${encodeURIComponent(teacher)}`).catch(() => []) : [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  view.innerHTML = `
    <h1 class="page-title">Weekly Plan</h1>
    <p class="page-lede">One row per day: what students should be able to <em>do</em> by end of period, the objective, and the activity. Save the week and pick it up from home.</p>

    <div class="card">
      <form id="week-form">
        <div class="form-row"><label>Week of</label><input class="input" name="weekOf" type="date" style="max-width:220px;" /></div>
        <div class="week-grid">
          ${days.map((d, i) => `
            <div class="day-card">
              <h3>${d}</h3>
              <div class="day-field-label">Standard code</div>
              <input class="input" data-day="${i}" data-field="standardCode" id="wk-code-${i}" placeholder="e.g. 11.3.R.3" style="font-size:12px;" />
              <div id="wk-picker-${i}" style="margin:4px 0;"></div>
              <div class="day-field-label">Goal (what students walk out able to do)</div>
              <textarea data-day="${i}" data-field="goals"></textarea>
              <div class="day-field-label">Objective (I can…)</div>
              <textarea data-day="${i}" data-field="objectives" id="wk-obj-${i}"></textarea>
              <div class="day-field-label">Activities (agenda for the period)</div>
              <textarea data-day="${i}" data-field="activities"></textarea>
            </div>
          `).join("")}
        </div>
        <div style="margin-top:16px;"><button type="submit" class="btn primary">Save weekly plan</button></div>
      </form>
    </div>

    <h2 class="section-title">Your saved weekly plans</h2>
    <div id="saved-weeks">${saved.length ? saved.map((p) => weekCard(p, days)).join("") : '<div class="empty">No saved weekly plans yet.</div>'}</div>
  `;

  // Attach standards picker to each day; when a standard is picked, auto-fill the objective if empty.
  days.forEach((_, i) => {
    attachStandardsPicker({
      mount: `#wk-picker-${i}`,
      codeInput: `#wk-code-${i}`,
      onSelect: (s) => {
        const $obj = document.querySelector(`#wk-obj-${i}`);
        if ($obj && !$obj.value.trim()) $obj.value = s.text;
      },
    });
  });

  $("#week-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = TeacherStore.get();
    if (!t) { window.requireTeacher(); return; }
    const fd = new FormData(e.target);
    const daysData = days.map((_, i) => ({
      standardCode: e.target.querySelector(`[data-day="${i}"][data-field="standardCode"]`)?.value || "",
      goals: e.target.querySelector(`[data-day="${i}"][data-field="goals"]`).value,
      objectives: e.target.querySelector(`[data-day="${i}"][data-field="objectives"]`).value,
      activities: e.target.querySelector(`[data-day="${i}"][data-field="activities"]`).value,
    }));
    const payload = { teacher: t, weekOf: fd.get("weekOf") || "", data: { days: daysData } };
    try {
      await fetchJSON("/api/weekly-plans", { method: "POST", body: JSON.stringify(payload) });
      toast("Weekly plan saved");
      router();
    } catch (err) { toast("Save failed: " + err.message); }
  });
}

function weekCard(p, days) {
  const dd = p.data.days || [];
  return `
    <div class="card">
      <div class="card-meta">${escapeHtml(p.weekOf || p.updatedAt || "")}</div>
      <div class="card-title">Week of ${escapeHtml(p.weekOf || "—")}</div>
      <div class="week-grid" style="margin-top:8px;">
        ${days.map((d, i) => `
          <div class="day-card" style="background:#f9f6ec;">
            <h3>${d}</h3>
            ${dd[i]?.standardCode ? `<div class="day-field-label">Standard</div><p style="font-size:12px;color:var(--navy);font-weight:700;">${escapeHtml(dd[i].standardCode)}</p>` : ""}
            <div class="day-field-label">Goal</div><p style="font-size:13px;">${nl2br(dd[i]?.goals || "—")}</p>
            <div class="day-field-label">Objective</div><p style="font-size:13px;">${nl2br(dd[i]?.objectives || "—")}</p>
            <div class="day-field-label">Activities</div><p style="font-size:13px;">${nl2br(dd[i]?.activities || "—")}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ------------------ PL Tool ------------------
async function renderPLTool(view) {
  const teacher = TeacherStore.get();
  const saved = teacher ? await fetchJSON(`/api/pl-goals?teacher=${encodeURIComponent(teacher)}`).catch(() => []) : [];

  view.innerHTML = `
    <h1 class="page-title">Write My PL Goal</h1>
    <p class="page-lede">Write a professional learning goal that holds up in an evaluation conversation. Four steps: pick a focus, pick the move, decide the measurement, and lock the timeline.</p>

    <div class="card">
      <form id="pl-form" class="form-grid">
        <div class="form-row">
          <label>1. Focus area</label>
          <select class="select" name="focus" required>
            <option value="">Choose one…</option>
            <option>Reading &amp; writing across the curriculum</option>
            <option>Student discourse &amp; talk</option>
            <option>Formative assessment &amp; feedback</option>
            <option>Teacher–student feedback (Hattie, Wiliam, Shute)</option>
            <option>Explicit modeling &amp; think-alouds</option>
            <option>Classroom management &amp; culture</option>
            <option>Cognitive rigor &amp; questioning</option>
            <option>Differentiation &amp; small-group instruction</option>
            <option>Early reading foundations (K–5)</option>
            <option>Early math &amp; number sense (K–5)</option>
            <option>Early writing &amp; composition (K–5)</option>
            <option>Elementary science &amp; phenomena-based instruction (K–5)</option>
            <option>Elementary social studies &amp; historical thinking (K–5)</option>
            <option>Physical education, movement &amp; health-related fitness (K–5)</option>
          </select>
        </div>
        <div class="form-row">
          <label>2. Specific move you will implement</label>
          <input class="input" name="move" required placeholder="e.g. Add a 3-minute writing-to-learn stop in every class" />
        </div>
        <div class="form-row">
          <label>3. How you will measure success</label>
          <select class="select" name="measure" required>
            <option value="">Choose one…</option>
            <option>Student work samples across a unit</option>
            <option>Weekly exit ticket data</option>
            <option>Walk-through evidence from admin</option>
            <option>Peer observation and feedback</option>
            <option>Student survey (start vs. end)</option>
          </select>
        </div>
        <div class="form-row">
          <label>4. Timeline</label>
          <select class="select" name="timeline" required>
            <option value="">Choose one…</option>
            <option>By the end of Q1</option>
            <option>By the end of Q2</option>
            <option>By the end of the semester</option>
            <option>By the end of the year</option>
          </select>
        </div>
        <div class="form-row">
          <label>Anchor standards (optional)</label>
          <input class="input" id="pl-std-code" name="anchorStandards" placeholder="e.g. 11.3.R.3, B.LS1.1 (comma-separated)" />
          <div id="pl-std-picker"></div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Tie this goal to the OAS standards it will show up in.</div>
        </div>
        <div class="form-row">
          <label>Baseline (where you are today)</label>
          <textarea class="textarea" name="baseline" placeholder="Describe what's happening in your classroom right now."></textarea>
        </div>
        <div class="form-row">
          <label>Target (where you want to be)</label>
          <textarea class="textarea" name="target" placeholder="Describe the observable difference at the end of the timeline."></textarea>
        </div>
        <button type="submit" class="btn primary" style="justify-self:start;">Save PL goal</button>
      </form>
    </div>

    <div class="card" id="preview-card" style="display:none;">
      <div class="card-meta">Preview</div>
      <div class="card-title">Your PL goal</div>
      <p id="preview-text"></p>
    </div>

    <h2 class="section-title">Your saved PL goals &amp; progress</h2>
    <div id="saved-pl">${saved.length ? saved.map((p) => plCard(p)).join("") : '<div class="empty">No saved PL goals yet.</div>'}</div>
  `;

  attachStandardsPicker({
    mount: "#pl-std-picker",
    codeInput: "#pl-std-code",
    onSelect: (s) => {
      const $c = document.querySelector("#pl-std-code");
      const existing = ($c.value || "").split(",").map(x => x.trim()).filter(Boolean);
      if (!existing.includes(s.code)) {
        existing.push(s.code);
        $c.value = existing.join(", ");
      }
    },
  });

  wirePLDocxButtons(view, saved);

  const form = $("#pl-form");
  const preview = $("#preview-card");
  const previewText = $("#preview-text");
  const updatePreview = () => {
    const fd = new FormData(form);
    const focus = fd.get("focus"), move = fd.get("move"), measure = fd.get("measure"), timeline = fd.get("timeline");
    if (focus && move && measure && timeline) {
      const tl = timeline.replace(/^By\s+/i, '');
      previewText.textContent = `By ${tl.toLowerCase()}, I will strengthen ${focus.toLowerCase()} in my classroom by ${move.trim().replace(/\.$/, '')}. I will measure success through ${measure.toLowerCase()}.`;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  };
  form.addEventListener("input", updatePreview);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = TeacherStore.get();
    if (!t) { window.requireTeacher(); return; }
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.assembled = previewText.textContent;
    try {
      await fetchJSON("/api/pl-goals", { method: "POST", body: JSON.stringify({ teacher: t, data }) });
      toast("PL goal saved");
      router();
    } catch (err) { toast("Save failed: " + err.message); }
  });
}

function plCard(p) {
  const d = p.data || {};
  return `
    <div class="card">
      <div class="card-meta">${escapeHtml(p.updatedAt || "")}</div>
      <div class="card-title">${escapeHtml(d.focus || "PL goal")}</div>
      ${d.assembled ? `<p><strong>${escapeHtml(d.assembled)}</strong></p>` : ""}
      ${d.baseline ? `<h3 class="subsection-title">Baseline</h3><p>${nl2br(d.baseline)}</p>` : ""}
      ${d.target ? `<h3 class="subsection-title">Target</h3><p>${nl2br(d.target)}</p>` : ""}
      ${d.anchorStandards ? `<div style="margin-top:10px;font-size:12px;"><strong style="color:var(--navy);">Anchor standards:</strong> ${escapeHtml(d.anchorStandards)}</div>` : ""}
      <div style="margin-top:12px;font-size:12px;color:var(--muted);">Timeline: ${escapeHtml(d.timeline || "—")} · Measure: ${escapeHtml(d.measure || "—")}</div>
      <div class="button-row" style="margin-top:12px;">
        <button type="button" class="btn btn-primary btn-sm pl-docx-btn" data-pl-id="${escapeHtml(String(p.id || ""))}">⭳ Download as Word (.docx)</button>
      </div>
    </div>
  `;
}

// Word export for a saved PL goal (uses the shared planner docx builder)
function plGoalDocxBlocks(p) {
  const d = p.data || {};
  const teacher = (TeacherStore.get && TeacherStore.get()) || "";
  const blocks = [
    { h1: "Professional Learning Goal" },
    { p: (teacher ? teacher + " · " : "") + "Wewoka High School · " + new Date().toLocaleDateString() },
    { hr: true },
  ];
  if (d.assembled) blocks.push({ h2: "Goal statement" }, { p: d.assembled });
  if (d.focus) blocks.push({ label: "Focus area", value: d.focus });
  if (d.baseline) blocks.push({ h2: "Baseline (where students are now)" }, { p: d.baseline });
  if (d.target) blocks.push({ h2: "Target (where they will be)" }, { p: d.target });
  if (d.move) blocks.push({ h2: "Instructional move" }, { p: d.move });
  if (d.measure) blocks.push({ label: "How I will measure it", value: d.measure });
  if (d.timeline) blocks.push({ label: "Timeline", value: d.timeline });
  if (d.anchorStandards) blocks.push({ label: "Anchor standards", value: d.anchorStandards });
  blocks.push({ hr: true }, { h2: "Progress notes" }, { p: "Check-in 1:  ________________________________" }, { p: "Check-in 2:  ________________________________" }, { p: "End of cycle: ________________________________" });
  return blocks;
}
function wirePLDocxButtons(view, saved) {
  view.querySelectorAll(".pl-docx-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const p = saved.find((x) => String(x.id) === btn.dataset.plId) || saved[0];
      if (!p || !window.PlannerCore) return;
      const orig = btn.textContent; btn.disabled = true; btn.textContent = "Preparing…";
      try {
        const blob = await window.PlannerCore.buildDocx("Professional Learning Goal", plGoalDocxBlocks(p));
        window.PlannerCore.downloadBlob(blob, "PL-Goal-" + ((p.data && p.data.focus) || "goal").replace(/[^a-z0-9]+/gi, "-") + ".docx");
      } catch (e) { alert("Could not build the Word file. " + (e && e.message || "")); }
      btn.disabled = false; btn.textContent = orig;
    });
  });
}

// ==================== Lesson Plan Templates ====================
async function renderLessonPlans(view) {
  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-media" style="background-image:url('./img/heroes/rigor.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Templates</div>
        <h1 class="hero-title">Lesson Plan Templates</h1>
        <p class="hero-lede">Copy-and-adapt lesson templates built around the Turner Engagement Cycle. Print any one as a one-page plan.</p>
      </div>
    </section>

    <div class="card lesson-template-card">
      <div class="card-title">The one-pager: Turner Cycle lesson plan</div>
      <p class="page-lede" style="margin-bottom:12px;">A single-period plan built around <strong>Notice → Read → Talk → Solve → Defend → Revise</strong>.</p>
      <div style="display:grid;grid-template-columns:1fr;gap:10px;">
        <div><strong>Objective (I can…):</strong> ___ tied to one priority standard.</div>
        <div><strong>Notice (2–3 min):</strong> A hook artifact — image, headline, data slice — that lowers the cost of starting.</div>
        <div><strong>Read (5–10 min):</strong> Short text (150–400 words) with a purpose question on the board.</div>
        <div><strong>Talk (3–5 min):</strong> Structured partner talk — "turn to your partner and say X."</div>
        <div><strong>Solve (10–15 min):</strong> Task requiring inference or explanation. Compare, analyze, or explain <em>why</em>.</div>
        <div><strong>Defend (5–10 min):</strong> Written claim + named evidence + one line of reasoning.</div>
        <div><strong>Revise (2–5 min):</strong> Trade papers or reread. Update one sentence based on a second source or a peer's push.</div>
        <div><strong>Exit ticket:</strong> One question that shows whether the objective was met.</div>
      </div>
      <button class="print-btn" data-print="turner-cycle">⭳ Print this template</button>
    </div>

    <div class="card lesson-template-card">
      <div class="card-title">Two-day discussion arc</div>
      <p class="page-lede" style="margin-bottom:12px;">Use when the priority standard is analysis, argument, or interpretation.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <strong>Day 1 — Build the base</strong>
          <ul class="check-list">
            <li>Notice: quick image or quote</li>
            <li>Read: two short paired texts</li>
            <li>Talk: quote-search protocol</li>
            <li>Solve: annotate + note-catcher</li>
          </ul>
        </div>
        <div>
          <strong>Day 2 — Defend & revise</strong>
          <ul class="check-list">
            <li>Talk: 60-second partner argument rehearsal</li>
            <li>Defend: written claim on shared question</li>
            <li>Revise: fishbowl or gallery critique</li>
            <li>Exit: one-sentence revision</li>
          </ul>
        </div>
      </div>
      <button class="print-btn" data-print="two-day-discussion">⭳ Print this template</button>
    </div>

    <div class="card lesson-template-card">
      <div class="card-title">Explicit-instruction lesson (I Do → We Do → You Do)</div>
      <p class="page-lede" style="margin-bottom:12px;">Use when introducing a new skill or procedure. Pair with the Weekly Plan Builder.</p>
      <ul class="check-list">
        <li><strong>I Do:</strong> Model the skill aloud, thinking through decisions. Keep to 5–7 minutes.</li>
        <li><strong>We Do:</strong> Solve 1–2 examples together, calling on non-volunteers.</li>
        <li><strong>You Do (guided):</strong> Students try one; you monitor and give immediate feedback.</li>
        <li><strong>You Do (independent):</strong> Students complete 3–5 more with a check for understanding.</li>
        <li><strong>Close:</strong> Restate the "I can" statement and give an exit ticket.</li>
      </ul>
      <button class="print-btn" data-print="i-do-we-do">⭳ Print this template</button>
    </div>

    <div class="callout">
      <h3>Where to go from here</h3>
      <p>Draft your week from any template above using the <a href="#/weekly-plan">Weekly Plan Builder</a>, or unpack the standard first with the <a href="#/unit-plan">Unit Planner</a>.</p>
    </div>
  `;

  // Wire print buttons - each isolates its own card via .printing-single body class
  $$(".print-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".lesson-template-card");
      if (!card) return;
      $$(".lesson-template-card").forEach((c) => c.classList.remove("print-target"));
      card.classList.add("print-target");
      document.body.classList.add("printing-single");
      window.print();
      // Cleanup after print dialog closes
      setTimeout(() => {
        document.body.classList.remove("printing-single");
        card.classList.remove("print-target");
      }, 500);
    });
  });
}

// ==================== Toolkit Examples ====================
async function renderToolkitExamples(view) {
  const favs = Array.from(Data.favorites || []);
  const favStrats = favs
    .map((id) => Data.strategies.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 6);

  view.innerHTML = `
    <h1 class="page-title">Toolkit Examples</h1>
    <p class="page-lede">Model toolkits from teachers who use the Turner Toolkit. Use them as a starting point — copy what fits, swap what doesn't, add your own.</p>

    <div class="card">
      <div class="card-title">New Teacher Starter Kit</div>
      <p>The seven strategies every first-year Wewoka teacher should be able to run in week one.</p>
      <ul class="related-list">
        <li>Attention Signal / Call-and-Response</li>
        <li>Cold Call with hands down</li>
        <li>Turn-and-Talk with a sentence stem</li>
        <li>Do Now / bell-ringer routine</li>
        <li>Exit ticket tied to the objective</li>
        <li>Modeling (I Do)</li>
        <li>Positive narration</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-title">ELA Teacher Toolkit</div>
      <ul class="related-list">
        <li>Close reading with text-dependent questions</li>
        <li>Quote-search discussion protocol</li>
        <li>Claim-Evidence-Reasoning writing frame</li>
        <li>Costa's Level 2 &amp; 3 question stems</li>
        <li>Sentence expansion / combining</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-title">Math Teacher Toolkit</div>
      <ul class="related-list">
        <li>Concrete–Representational–Abstract (CRA) sequence</li>
        <li>Number talks (5–10 minutes daily)</li>
        <li>Error analysis with student work</li>
        <li>Think-aloud modeling</li>
        <li>Structured partner problem-solving</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-title">Engagement &amp; Behavior Focus</div>
      <ul class="related-list">
        <li>Attention signal + positive narration</li>
        <li>Active supervision (constant scanning)</li>
        <li>Precise praise (2:1 positive-to-corrective)</li>
        <li>Rehearsed transitions</li>
        <li>Restorative check-ins after conflict</li>
      </ul>
    </div>

    ${favStrats.length ? `
    <div class="card">
      <div class="card-title">Your current favorites</div>
      <p class="page-lede" style="margin-bottom:8px;">You've saved ${favStrats.length} strategies. Consider grouping them into a toolkit.</p>
      <ul class="related-list">
        ${favStrats.map((s) => `<li><a href="#/strategy/${encodeURIComponent(s.id)}">${escapeHtml(s.title)}</a></li>`).join("")}
      </ul>
    </div>
    ` : ""}

    <div class="callout">
      <h3>Build your own</h3>
      <p>Open the <a href="#/strategies">Library</a>, favorite the strategies you use, then open <a href="#/toolkit">My Toolkit</a> to see them together.</p>
    </div>
  `;
}

// ==================== Usage Stats ====================
async function renderStats(view) {
  view.innerHTML = `
    <h1 class="page-title">Usage Stats</h1>
    <p class="page-lede">A quick look at what's in your Quick PD right now.</p>
    <div id="stats-body"><div class="empty">Loading…</div></div>
  `;

  try {
    const [strategies, techniques, rigor, seating, standards, qpd] = await Promise.all([
      fetchJSON("/api/strategies"),
      fetchJSON("/api/classroom-techniques"),
      fetchJSON("/api/rigor-practices"),
      fetchJSON("/api/seating-guides"),
      fetchJSON("/api/standards-guides"),
      fetchJSON("/api/qpd-content"),
    ]);

    const teacher = TeacherStore.get();
    let favCount = 0, planCount = 0, weekCount = 0, goalCount = 0;
    if (teacher) {
      try {
        const [favs, plans, weeks, goals] = await Promise.all([
          fetchJSON(`/api/favorites?teacher=${encodeURIComponent(teacher)}`).catch(() => []),
          fetchJSON(`/api/unit-plans?teacher=${encodeURIComponent(teacher)}`).catch(() => []),
          fetchJSON(`/api/weekly-plans?teacher=${encodeURIComponent(teacher)}`).catch(() => []),
          fetchJSON(`/api/pl-goals?teacher=${encodeURIComponent(teacher)}`).catch(() => []),
        ]);
        favCount = favs.length; planCount = plans.length; weekCount = weeks.length; goalCount = goals.length;
      } catch {}
    }

    const customStrategies = strategies.filter((s) => s.isCustom).length;

    $("#stats-body").innerHTML = `
      <div class="card-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
        <div class="card"><div class="card-meta">Library</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${strategies.length}</div><div class="page-lede" style="font-size:13px;">strategies (${customStrategies} teacher-added)</div></div>
        <div class="card"><div class="card-meta">Classroom Mgmt</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${techniques.length}</div><div class="page-lede" style="font-size:13px;">techniques</div></div>
        <div class="card"><div class="card-meta">Rigor &amp; Questioning</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${rigor.length}</div><div class="page-lede" style="font-size:13px;">practices</div></div>
        <div class="card"><div class="card-meta">Seating</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${seating.length}</div><div class="page-lede" style="font-size:13px;">arrangements</div></div>
        <div class="card"><div class="card-meta">Standards &amp; Planning</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${standards.length}</div><div class="page-lede" style="font-size:13px;">guides</div></div>
        <div class="card"><div class="card-meta">Interventions</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${(qpd.interventions?.items || []).length}</div><div class="page-lede" style="font-size:13px;">strategies</div></div>
      </div>

      ${teacher ? `
        <h2 class="page-title" style="font-size:22px;margin-top:24px;">Your activity</h2>
        <div class="card-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
          <div class="card"><div class="card-meta">Favorites</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${favCount}</div></div>
          <div class="card"><div class="card-meta">Unit plans</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${planCount}</div></div>
          <div class="card"><div class="card-meta">Weekly plans</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${weekCount}</div></div>
          <div class="card"><div class="card-meta">PL goals</div><div style="font-size:32px;font-weight:800;color:var(--navy);">${goalCount}</div></div>
        </div>
      ` : `
        <div class="callout" style="margin-top:20px;">
          <h3>Sign in to see your activity</h3>
          <p>Enter your name in the sidebar to see your favorites, plans, and PL goals.</p>
        </div>
      `}
    `;
  } catch (e) {
    $("#stats-body").innerHTML = `<div class="empty">Could not load stats: ${escapeHtml(e.message)}</div>`;
  }
}

// ============================================================
// SHARED STANDARDS PICKER (reusable in any form)
// ============================================================
// Renders a compact picker: subject/course dropdowns + keyword search + result list.
// When a row is clicked, writes the code into `codeInput` and (optionally) full
// text into `textOutput`, then calls `onSelect(std)` with the full record.
//
// Usage:
//   <input id="my-code" /> <div id="my-picker"></div>
//   attachStandardsPicker({ mount: "#my-picker", codeInput: "#my-code", textOutput: "#my-text" });
//
let _stdPickerFacetsCache = null;
async function _stdPickerLoadFacets() {
  if (_stdPickerFacetsCache) return _stdPickerFacetsCache;
  try {
    _stdPickerFacetsCache = await fetchJSON("/api/state-standards/facets");
  } catch { _stdPickerFacetsCache = { subjects: [], courses: [] }; }
  return _stdPickerFacetsCache;
}

async function attachStandardsPicker(opts) {
  const mount = typeof opts.mount === "string" ? document.querySelector(opts.mount) : opts.mount;
  if (!mount) return;
  const codeInput = typeof opts.codeInput === "string" ? document.querySelector(opts.codeInput) : opts.codeInput;
  const textOutput = opts.textOutput ? (typeof opts.textOutput === "string" ? document.querySelector(opts.textOutput) : opts.textOutput) : null;
  const onSelect = opts.onSelect || (() => {});
  const defaultCourse = opts.defaultCourse || "";

  const facets = await _stdPickerLoadFacets();
  const uid = "sp" + Math.random().toString(36).slice(2, 8);

  mount.innerHTML = `
    <details style="background:#f9f6ec; border:1px solid var(--line); border-radius:8px; margin:6px 0 12px;">
      <summary style="padding:10px 14px; cursor:pointer; font-size:13px; font-weight:600; color:var(--navy);">
        📚 Pick from Oklahoma Academic Standards catalog${facets.courses.length ? ` (${facets.courses.reduce((s,c)=>s+(c.count||0),0)} standards)` : ""}
      </summary>
      <div style="padding:12px 14px; border-top:1px solid var(--line);">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
          <select id="${uid}-subj" class="select">
            <option value="">Any subject</option>
            ${facets.subjects.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("")}
          </select>
          <select id="${uid}-crs" class="select">
            <option value="">Any course</option>
            ${facets.courses.map(c => `<option value="${escapeHtml(c.course)}" ${c.course === defaultCourse ? "selected" : ""}>${escapeHtml(c.course)} (${c.count})</option>`).join("")}
          </select>
        </div>
        <input id="${uid}-q" class="input" placeholder="Search by code or keyword (e.g. 11.3.R.3, DNA, fluency)" style="width:100%; margin-bottom:8px;" />
        <div id="${uid}-res" style="max-height:220px; overflow:auto; border:1px solid var(--line); border-radius:6px; background:#fff;"></div>
      </div>
    </details>
  `;

  const $subj = mount.querySelector(`#${uid}-subj`);
  const $crs = mount.querySelector(`#${uid}-crs`);
  const $q = mount.querySelector(`#${uid}-q`);
  const $res = mount.querySelector(`#${uid}-res`);

  async function run() {
    const qs = new URLSearchParams();
    if ($subj.value) qs.set("subject", $subj.value);
    if ($crs.value) qs.set("course", $crs.value);
    if ($q.value.trim()) qs.set("q", $q.value.trim());
    qs.set("limit", "50");
    try {
      const data = await fetchJSON(`/api/state-standards?${qs}`);
      const items = data.items || [];
      if (!items.length) {
        $res.innerHTML = `<div style="padding:10px; opacity:.6; font-size:13px;">No standards match.</div>`;
        return;
      }
      $res.innerHTML = items.slice(0, 100).map(s => `
        <div class="sp-row" data-code="${escapeHtml(s.code)}" style="padding:8px 12px; border-bottom:1px solid var(--line); cursor:pointer; font-size:13px;">
          <div style="font-weight:700; color:var(--navy);">${escapeHtml(s.code)} <span style="font-weight:400; color:var(--muted);">— ${escapeHtml(s.course)}</span></div>
          <div style="margin-top:2px; line-height:1.4; color:var(--ink);">${escapeHtml(s.text.slice(0, 180))}${s.text.length > 180 ? "…" : ""}</div>
        </div>
      `).join("");
      $res.querySelectorAll(".sp-row").forEach(row => {
        row.addEventListener("click", async () => {
          const code = row.dataset.code;
          try {
            const s = await fetchJSON(`/api/state-standards/${encodeURIComponent(code)}`);
            if (codeInput) codeInput.value = s.code;
            if (textOutput) {
              if (textOutput.tagName === "TEXTAREA" || textOutput.tagName === "INPUT") {
                textOutput.value = s.text;
              } else {
                textOutput.textContent = s.text;
              }
            }
            $res.querySelectorAll(".sp-row").forEach(r => r.style.background = "");
            row.style.background = "#fff5d6";
            onSelect(s);
            toast(`Picked ${s.code}`);
          } catch {}
        });
      });
    } catch {
      $res.innerHTML = `<div style="padding:10px; opacity:.6; font-size:13px;">Error loading standards.</div>`;
    }
  }

  $subj.addEventListener("change", run);
  $crs.addEventListener("change", run);
  let deb;
  $q.addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(run, 250); });
  run();
}

// ============================================================
// STANDARDS PAGE (standalone, own route now)
// ============================================================
async function renderStandards(view) {
  const guides = Data.standards || [];
  // Try to fetch facet counts to show catalog scope
  let facets = { subjects: [], courses: [] };
  try { facets = await fetchJSON("/api/state-standards/facets"); } catch {}
  const totalStds = facets.courses.reduce((sum, c) => sum + (c.count || 0), 0);

  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-media" style="background-image:url('./img/heroes/standards.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Standards &amp; Planning</div>
        <h1 class="hero-title">Standards &amp; Planning</h1>
        <p class="hero-lede">Read the standard, break it apart, plan a real lesson from it. ${totalStds ? `${totalStds} Oklahoma Academic Standards loaded for Wewoka High School courses.` : ""}</p>
      </div>
    </section>

    <h2 class="section-title">Interactive workspaces</h2>
    <div class="dash-row" style="grid-template-columns: 1fr 1fr; gap: 16px;">
      <a class="dash-jump-card" href="#/standards-unpack" style="border-left:4px solid var(--orange); padding:20px 22px;">
        <div class="jump-meta">Workspace</div>
        <div style="font-size:1.05em; font-weight:600; margin:6px 0 4px;">Break Down a Standard →</div>
        <div style="opacity:.75; font-size:.9em;">Pick an OAS standard (or paste any), pull out the skill verb, content, Costa's Level of Thinking, and turn it into a student-friendly "I can" statement.</div>
      </a>
      <a class="dash-jump-card" href="#/standards-plan" style="border-left:4px solid var(--gold); padding:20px 22px;">
        <div class="jump-meta">Workspace</div>
        <div style="font-size:1.05em; font-weight:600; margin:6px 0 4px;">Build an Instructional Plan →</div>
        <div style="opacity:.75; font-size:.9em;">Take a standard breakdown and turn it into a five-part lesson: Launch, Explore, Explain, Apply, Check.</div>
      </a>
    </div>

    <h2 class="section-title">Plug it into your planning</h2>
    <div class="dash-row" style="grid-template-columns: 1fr 1fr 1fr; gap:14px;">
      <a class="dash-jump-card" href="#/unit-plan"><div class="jump-meta">Zoom out</div><div>Unit Planner →</div></a>
      <a class="dash-jump-card" href="#/weekly-plan"><div class="jump-meta">Zoom in</div><div>Weekly &amp; Daily Plan →</div></a>
      <a class="dash-jump-card" href="#/pl-tool"><div class="jump-meta">Growth</div><div>Write My PL Goal →</div></a>
    </div>

    <h2 class="section-title">The 14-chapter guide</h2>
    <p style="opacity:.75; margin-top:-8px;">Walk through standards from first read to a finished lesson.</p>
    <div id="std-list">${simpleList(guides, "standards")}</div>

    ${facets.courses.length ? `
    <h2 class="section-title" style="margin-top:32px;">Catalog scope</h2>
    <p style="opacity:.75; margin-top:-8px;">Oklahoma Academic Standards currently in the catalog for WHS courses. Teachers of other courses can still use Break Down a Standard by pasting their own standard text.</p>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:10px;">
      ${facets.courses.map(c => `
        <a class="dash-jump-card" href="#/standards-unpack?course=${encodeURIComponent(c.course)}" style="padding:14px 16px;">
          <div class="jump-meta">${escapeHtml(c.subject)}</div>
          <div style="font-weight:600;">${escapeHtml(c.course)}</div>
          <div style="opacity:.65; font-size:.85em;">${c.count} standards</div>
        </a>
      `).join("")}
    </div>
    ` : ""}
  `;
}

// ============================================================
// BREAK DOWN A STANDARD (workspace)
// ============================================================
// ---------- Standard analyzer (pure functions, rules-based) ----------
const StandardAnalyzer = (() => {
  // Costa's Levels of Thinking (Art Costa / AVID) — three levels, not four.
  // Sources: AVID Open Access "Costa's Levels of Thinking" (avidopenaccess.org),
  // OCDE AVID Region 9 "Examples of Costa's Levels of Questions" (ocde.us),
  // Cobb County Rigor Training deck (media.cobbk12.org).
  // Level 1 — GATHERING ("on the page"): text-explicit, recall, one right answer.
  // Level 2 — PROCESSING ("between the lines"): compare, infer, sort, analyze.
  // Level 3 — APPLYING ("beyond the text"): evaluate, judge, predict, hypothesize, design.
  const COSTAS_MAP = {
    1: ["complete","count","cite","define","describe","draw","find","identify","label","list","locate","match","memorize","name","note","observe","quote","recall","recite","recognize","record","repeat","report","reproduce","select","show","spell","state","tell","underline","scan","measure"],
    2: ["analyze","apply","categorize","classify","collect","compare","compute","construct","contrast","determine","diagram","differentiate","discriminate","display","distinguish","examine","experiment","explain","extend","graph","group","infer","interpret","model","modify","organize","outline","paraphrase","relate","represent","revise","separate","sequence","solve","sort","summarize","synthesize","translate","use"],
    3: ["appraise","argue","assemble","assess","conclude","critique","debate","decide","defend","design","develop","evaluate","forecast","formulate","generalize","hypothesize","imagine","integrate","invent","investigate","judge","justify","predict","prove","rate","speculate","support","test","value","orchestrate"],
  };
  // Multi-word phrases in the standard text bump the level up regardless of the verb.
  const COSTAS_PHRASE_MAP = {
    2: ["cite evidence","use evidence","support their answer","support your answer","between the lines","more than one"],
    3: ["support with evidence","draw conclusions","defend a position","judge whether","predict what","design a","beyond the text","in a new situation","apply a principle","hypothesize","if/then"],
  };
  // Vague verbs that don't work in "I can" statements
  const VAGUE_VERBS = new Set(["understand","know","learn","study","review","see","think","appreciate","grasp","get","remember","become familiar with","be aware of","develop understanding of"]);
  // Verbs that pair well with "I can" (measurable substitutes for vague ones)
  const MEASURABLE_SUBS = {
    "understand": "explain",
    "know": "identify",
    "learn": "use",
    "study": "describe",
    "grasp": "explain",
    "get": "identify",
    "remember": "recall",
    "appreciate": "describe",
    "become familiar with": "identify",
    "be aware of": "identify",
    "develop understanding of": "explain",
  };
  // Level labels (used in UI + reason chips)
  const LEVEL_LABEL = { 1: "Gathering", 2: "Processing", 3: "Applying" };
  const LEVEL_SUBTITLE = { 1: "on the page — text-explicit", 2: "between the lines — text-implicit", 3: "beyond the text — apply, judge, create" };
  // Preferred verbs by level, used to AUTO-RAISE an "I can" verb up to the standard's Costa level.
  // Pulled straight from AVID Costa's handouts. Ordered by "which verb fits best for planning."
  const PREFERRED_VERBS_BY_LEVEL = {
    1: ["identify","describe","define","list","name","observe","recite","recall","label"],
    2: ["explain","compare","infer","analyze","classify","distinguish","summarize","sequence","organize","paraphrase"],
    3: ["evaluate","judge","predict","hypothesize","defend","justify","speculate","design","generalize","apply"],
  };
  function levelOfVerb(verb) {
    const v = (verb || "").toLowerCase().trim();
    if (!v) return null;
    for (const lvl of [3, 2, 1]) if ((COSTAS_MAP[lvl] || []).includes(v)) return lvl;
    return null;
  }
  // Words that shouldn't count as content nouns
  const STOPWORDS = new Set([
    "the","a","an","and","or","but","of","in","on","at","for","to","from","with","by","as","is","are","was","were","be","been","being",
    "will","students","student","student's","students'","student\u2019s","students\u2019","learners","learner","they","their","this","that","these","those",
    "each","some","any","many","few","several","various","different","specific","given","real","real-world","related","other","own","between","within","upon","across","through","over","under","into","during","about","above","below","among","using","use","used","when","how","why","what","which","who","whom","whose","if","then","also","such","including","include","includes","including",
    "e.g","i.e","ex","etc","level","grade","cite","cited","must","should","can","may"
  ]);
  // Skill verbs listed at the front of most standards (skip these when finding the noun)
  const VERB_LIST = new Set([].concat(
    ...Object.values(COSTAS_MAP)
  ).map(v => v.split(" ")[0]));

  function stripLead(text) {
    if (!text) return "";
    // Strip prefixes like "Students will", "Students can", "The student will"
    return text.replace(/^\s*(students?\s+(will|should|can)|the\s+student\s+(will|should|can)|learners?\s+(will|should|can)|by\s+the\s+end\s+of.*?,)\s+/i, "").replace(/^\s*[a-z]\.\s+/i, "").trim();
  }

  function firstVerb(cleanText) {
    const words = cleanText.toLowerCase().split(/[^a-z\-]+/).filter(Boolean);
    for (const w of words.slice(0, 8)) {
      if (VERB_LIST.has(w) || VAGUE_VERBS.has(w)) return w;
    }
    // fallback: first word if it ends in common verb endings
    const first = (words[0] || "").replace(/(ing|ed|s)$/, "");
    if (first.length > 2) return first;
    return words[0] || "";
  }

  function costasFor(verb, contextText) {
    const v = (verb || "").toLowerCase();
    const ctx = (contextText || "").toLowerCase();
    // Phrase overrides — level 3 first, then 2
    for (const level of [3, 2]) {
      const phrases = COSTAS_PHRASE_MAP[level] || [];
      for (const p of phrases) {
        if (ctx.includes(p)) return { level, reason: `Standard says “${p}” — that pushes students to Costa Level ${level} (${LEVEL_LABEL[level]}, ${LEVEL_SUBTITLE[level]}).` };
      }
    }
    // Single-verb lookup
    for (const level of [1, 2, 3]) {
      if ((COSTAS_MAP[level] || []).includes(v)) {
        return { level, reason: `“${v}” is a Costa Level ${level} verb (${LEVEL_LABEL[level]} — ${LEVEL_SUBTITLE[level]}). Context can bump it up — check what the standard asks students to DO with it.` };
      }
    }
    if (VAGUE_VERBS.has(v)) return { level: 2, reason: `“${v}” is vague — students can't demonstrate it. Swap in a measurable verb like “${MEASURABLE_SUBS[v] || "explain"}” and confirm the Costa level.` };
    return { level: 2, reason: "Best guess: Costa Level 2 (Processing). Adjust if the standard's context asks for more or less thinking." };
  }

  function extractContent(cleanText, verb) {
    // Drop the leading verb, keep the object/noun phrase — cut at first clause boundary.
    let t = cleanText.trim();
    if (verb) {
      const re = new RegExp("^" + verb.replace(/[-]/g, "\\-") + "s?\\b[,\\s]*", "i");
      t = t.replace(re, "");
    }
    // Strip parenthetical examples ("(e.g., ...)") and "i.e." clarifications
    t = t.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    // Split at instrumental / methodological phrases — but only if they're NOT the whole content.
    // "Construct an explanation based on evidence for how X" should keep the "for how X".
    // So we split on ONLY: "in order to", "so that", and "using"/"with"/"by" when they end the sentence.
    t = t.split(/\b(?:in order to|so that)\b/i)[0].trim();
    // Trim trailing punctuation
    t = t.replace(/[\.;:,]+$/, "").trim();
    // If very long (>160 chars), keep only through the first period
    if (t.length > 160) t = t.split(/\./)[0].trim();
    return t || "the ideas in this standard";
  }

  function extractVocab(cleanText, contentText) {
    const source = (contentText + " " + cleanText).toLowerCase();
    // Prefer parenthetical lists — standards often use "(e.g., X, Y, Z)"
    const parens = Array.from(cleanText.matchAll(/\(([^)]+)\)/g)).map(m => m[1]).join(" , ");
    const parenTerms = parens
      .split(/[,;]/)
      .map(s => s.replace(/\b(e\.g\.?|i\.e\.?|ex\.?|including|such as)\b/gi, "").trim())
      .map(s => s.replace(/^and\s+/i, "").trim())
      .filter(s => s && s.length > 2 && !/^\d+$/.test(s))
      .filter(s => !/^(e\.g|i\.e|ex)$/i.test(s));
    if (parenTerms.length >= 2) return parenTerms.slice(0, 6);
    // Otherwise pull multi-syllable or hyphenated words as candidates
    const words = (source.match(/[a-z][a-z\-]{4,}/g) || [])
      .filter(w => !STOPWORDS.has(w) && !VERB_LIST.has(w) && !VAGUE_VERBS.has(w) && w.length > 4)
      .filter(w => !/^(based|includes?|through|throughout|various|specific|essential|systems?|various|different|multiple|understand|understanding|knowledge|skills?|content|concepts?|ideas?)$/.test(w))
      .filter((w, i, a) => a.indexOf(w) === i);
    return words.slice(0, 6);
  }

  // Grade-band vocabulary simplification for "I can" rewrites
  const GRADE_SIMPLIFY = {
    "K-2": {
      "analyze": "look closely at", "evaluate": "decide how well", "identify": "find",
      "describe": "tell about", "explain": "tell why", "compare": "tell how ___ are the same and different",
      "construct": "build", "interpret": "figure out what it means", "determine": "figure out",
      "demonstrate": "show", "synthesize": "put together", "distinguish": "tell apart",
      "utilize": "use", "characteristics": "parts", "textual evidence": "words from the story",
      "informational": "true", "argumentative": "convincing", "characteristics": "parts",
      "phenomena": "things that happen", "protagonist": "main character",
    },
    "3-5": {
      "analyze": "look carefully at", "evaluate": "judge", "synthesize": "put together",
      "interpret": "explain what it means", "demonstrate": "show", "utilize": "use",
      "phenomena": "events", "protagonist": "main character", "characterization": "how a character is shown",
      "textual evidence": "proof from the text",
    },
    "6-8": {
      "utilize": "use", "elucidate": "explain", "delineate": "outline",
    },
    "9-12": {
      "utilize": "use",
    }
  };

  // Given the standard's Costa level and (optionally) the standard's own verb, pick
  // the verb that will drive the "I can" statement. If the natural verb sits BELOW
  // the standard's Costa level, AUTO-RAISE it to a preferred verb at the target level.
  function verbForLevel(naturalVerb, targetLevel, gradeBand) {
    let v = (naturalVerb || "").toLowerCase().trim();
    if (VAGUE_VERBS.has(v)) v = MEASURABLE_SUBS[v] || "explain";
    const currentLevel = levelOfVerb(v);
    // If the verb already matches (or exceeds) the target Costa level, keep it.
    if (currentLevel && currentLevel >= targetLevel) return v;
    // Otherwise raise it. Prefer a verb the teacher and kids will actually recognize.
    // K-2 gets a simpler Level-3 stem ("decide") over a formal one ("evaluate").
    const bank = PREFERRED_VERBS_BY_LEVEL[targetLevel] || ["explain"];
    if (gradeBand === "K-2") {
      const kidFriendly = { 2: "tell why", 3: "decide" };
      if (kidFriendly[targetLevel]) return kidFriendly[targetLevel];
    }
    return bank[0];
  }

  // Level-aware "I can" templates. Uses the AUTO-RAISED verb so the statement
  // actually matches the Costa level of the standard.
  function proposeICan(verbRaw, contentText, gradeBand, targetLevel) {
    const level = targetLevel || levelOfVerb(verbRaw) || 2;
    let verb = verbForLevel(verbRaw, level, gradeBand);
    // Simplify by grade band (verb + content noun phrases)
    const simplify = GRADE_SIMPLIFY[gradeBand] || {};
    if (simplify[verb]) verb = simplify[verb];
    let content = (contentText || "").trim();
    for (const [complex, simple] of Object.entries(simplify)) {
      content = content.replace(new RegExp("\\b" + complex.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "\\b", "gi"), simple);
    }
    // Level-specific stems that add the "how you'll know it" language.
    // Level 1: state the fact. Level 2: show the relationship. Level 3: apply/defend.
    let out;
    if (level === 3) {
      // "beyond the text" — add the defense clause
      const defenseVerbs = new Set(["predict","hypothesize","decide","judge","evaluate","speculate","forecast","generalize"]);
      if (defenseVerbs.has(verb)) {
        out = `I can ${verb} ${content} and defend my thinking with evidence`;
      } else if (verb === "design" || verb === "invent" || verb === "apply") {
        out = `I can ${verb} ${content} in a new situation and explain why my choices work`;
      } else if (verb === "defend" || verb === "justify") {
        out = `I can ${verb} a claim about ${content} with specific evidence`;
      } else {
        out = `I can ${verb} ${content} and back it up with evidence`;
      }
    } else if (level === 2) {
      // "between the lines" — add the "why" or "how"
      if (verb === "compare" || verb === "contrast") {
        out = `I can ${verb} ${content} and explain what the similarities and differences mean`;
      } else if (verb === "explain" || verb === "tell why") {
        out = `I can ${verb} how ${content} works`;
      } else if (verb === "infer") {
        out = `I can infer what ${content} means and point to the clues that led me there`;
      } else if (verb === "analyze") {
        out = `I can break ${content} into parts and show how the parts work together`;
      } else if (verb === "summarize" || verb === "paraphrase") {
        out = `I can restate the main idea of ${content} in my own words`;
      } else {
        out = `I can ${verb} ${content} and explain my thinking`;
      }
    } else {
      // Level 1 — direct recall
      out = `I can ${verb} ${content}`;
    }
    out = out.replace(/\s+/g, " ").trim();
    // Cap length for early elementary — trim at a WORD boundary so we don't chop mid-word.
    if (gradeBand === "K-2" && out.length > 100) {
      const clipped = out.slice(0, 100);
      const lastSpace = clipped.lastIndexOf(" ");
      out = clipped.slice(0, lastSpace > 60 ? lastSpace : 100).replace(/[,;].*$/, "").trim();
    }
    if (!/[.!?]$/.test(out)) out += ".";
    return out;
  }

  // Success criteria phrased at the Costa level. Level 3 explicitly names evidence
  // and reasoning; Level 2 names the relationship; Level 1 names the recall accuracy.
  function proposeCriteria(verbRaw, contentText, gradeBand, targetLevel) {
    const level = targetLevel || levelOfVerb(verbRaw) || 2;
    const verb = (verbRaw || "").toLowerCase().trim();
    const content = (contentText || "").trim();
    // Verb-family templates (finer detail wins over level template)
    const showMap = {
      "identify": `point out the correct ${content} and skip the ones that don't fit`,
      "describe": `tell the main features of ${content} in their own words`,
      "explain": `explain, in their own words, HOW or WHY ${content} works — not just retell the facts`,
      "compare": `list at least two ways ${content} are alike and two ways they're different, AND say what those similarities and differences mean`,
      "distinguish": `sort examples correctly and say what makes each one different from the others`,
      "analyze": `break ${content} into parts, show how the parts relate, and back the analysis with specifics from the source`,
      "evaluate": `judge ${content} against clear criteria they can name, and back the judgment with specific evidence`,
      "construct": `build ${content} step by step and explain each choice they made`,
      "solve": `solve a ${content} problem and show every step of their work`,
      "cite": `pull direct evidence from the text and tie it back to their claim in their own words`,
      "interpret": `explain what ${content} means and give a reason for their interpretation`,
      "predict": `make a prediction about ${content} and give the evidence and reasoning behind it`,
      "apply": `use ${content} correctly in a NEW situation — not one they've already practiced`,
      "model": `build a working model of ${content} and explain what each part represents`,
      "summarize": `restate the main ideas of ${content} in one or two sentences without losing meaning`,
      "determine": `pick the right answer for ${content} and justify how they got there`,
      "hypothesize": `state a testable hypothesis about ${content} and explain the reasoning behind it`,
      "judge": `judge ${content} against clear criteria and defend the call with evidence`,
      "defend": `state a claim about ${content}, give at least two pieces of evidence, and address a likely counter-view`,
      "design": `design ${content} that meets stated criteria and explain why each part of the design works`,
    };
    if (showMap[verb]) return `Students can show they've got it when they can ${showMap[verb]}.`;
    // Fallback: level-generic template.
    if (level === 3) return `Students can show they've got it when they can apply, judge, or extend ${content} beyond what was directly taught — and back the thinking with evidence.`;
    if (level === 2) return `Students can show they've got it when they can process ${content} — explain relationships, compare, infer, or organize — not just recite it.`;
    return `Students can show they've got it when they can accurately recall or identify ${content} on demand.`;
  }

  // Costa's-style question stems the teacher can ask (or hand kids) at each level.
  // Sources: AVID Open Access Costa's Level of Inquiry PDF; TeachThought Costa's guide.
  function proposeQuestionStems(contentText, targetLevel) {
    const c = (contentText || "the topic").trim();
    if (targetLevel === 3) {
      return [
        `What would happen if ${c} changed — and what evidence backs your prediction?`,
        `Judge whether ${c} is effective. Defend your call with at least two pieces of evidence.`,
        `How would you apply ${c} to a situation you've never seen before?`,
      ];
    }
    if (targetLevel === 2) {
      return [
        `How are the parts of ${c} related to each other?`,
        `Compare ${c} to something similar you already know. What's the same, what's different, and what does that difference tell us?`,
        `What can you infer about ${c} that the text/source doesn't say outright?`,
      ];
    }
    return [
      `What is ${c}?`,
      `List / name the parts of ${c}.`,
      `Describe ${c} in your own words.`,
    ];
  }

  function proposeMisconceptions(verbRaw, contentText, standardText) {
    const verb = (verbRaw || "").toLowerCase().trim();
    const t = (standardText || "").toLowerCase();
    const hits = [];
    // Verb-based common traps
    if (verb === "compare" || verb === "contrast") hits.push("Students list features side by side without actually saying HOW they're related — you get a chart, not a comparison.");
    if (verb === "evaluate") hits.push("Students state an opinion (“I liked it”) instead of judging against specific criteria with evidence.");
    if (verb === "analyze") hits.push("Students describe or summarize instead of breaking the thing into parts and showing how those parts work together.");
    if (verb === "cite" || t.includes("evidence")) hits.push("Students paste a quote without connecting it to the claim it's supposed to support.");
    if (verb === "explain") hits.push("Students give WHAT instead of WHY — retelling the facts without the reasoning.");
    if (verb === "solve") hits.push("Students jump to the answer without showing steps, so a wrong first step can't be caught or corrected.");
    if (t.includes("theme") || t.includes("mood") || t.includes("tone")) hits.push("Students confuse theme (the message) with topic (the subject) — “friendship” is a topic; “true friendship survives betrayal” is a theme.");
    if (t.includes("dna") || t.includes("protein")) hits.push("Students think DNA IS a protein instead of the instructions the cell uses to build proteins.");
    if (t.includes("function") && (t.includes("relation") || t.includes("graph"))) hits.push("Students assume every equation with x and y is a function — but a relation is only a function if each input has exactly one output.");
    if (t.includes("point of view") || t.includes("narrator")) hits.push("Students confuse first-person narration with the author's own opinion — an unreliable narrator is a choice, not a mistake.");
    if (!hits.length) hits.push(`Watch for students who repeat the vocabulary of ${contentText} without being able to use it in a new context — that's memorization, not understanding.`);
    return hits.join(" ");
  }

  function analyze(rawText) {
    const clean = stripLead(rawText);
    if (!clean) return null;
    const verb = firstVerb(clean);
    const content = extractContent(clean, verb);
    const costa = costasFor(verb, clean);
    const vocab = extractVocab(clean, content);
    return { verb, content, costaLevel: costa.level, costaReason: costa.reason, vocab };
  }

  return {
    analyze,
    proposeICan,
    proposeCriteria,
    proposeMisconceptions,
    proposeQuestionStems,
    verbForLevel,
    levelOfVerb,
    VAGUE_VERBS,
    MEASURABLE_SUBS,
    LEVEL_LABEL,
    LEVEL_SUBTITLE,
  };
})();

// ============================================================
// BREAK DOWN A STANDARD (workspace)
// ============================================================
async function renderStandardsUnpack(view, params) {
  // Load facets and any pre-selected course from query string
  const search = new URLSearchParams(location.hash.split("?")[1] || "");
  const preCourse = search.get("course") || "";
  let facets = { subjects: [], courses: [] };
  try { facets = await fetchJSON("/api/state-standards/facets"); } catch {}

  // Remember whether the worked example is dismissed (per teacher, browser-local).
  const wxKey = "turner.unpack.wx.dismissed.v1";
  const wxDismissed = localStorage.getItem(wxKey) === "1";
  // Remember grade band selection
  const gbKey = "turner.unpack.gradeband.v1";
  const gradeBand = localStorage.getItem(gbKey) || "9-12";

  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-overlay"></div>
      <div class="hero-inner" style="padding:34px 24px;">
        <div class="eyebrow on-dark">Standards &amp; Planning</div>
        <h1 class="hero-title">Break Down a Standard</h1>
        <p class="hero-lede">Pick or paste a standard. The toolkit auto-drafts the skill verb, content, Costa's Level of Thinking, and a student-friendly "I can" statement pitched at the right level — you edit the draft instead of starting from scratch.</p>
      </div>
    </section>

    ${wxDismissed ? "" : `
    <div id="wx-panel" style="background:#fdf6e3; border:1px solid #e6d29a; border-left:4px solid var(--gold); border-radius:10px; padding:16px 18px; margin-top:16px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px;">
        <div style="font-weight:700; color:#5a4a12;">Here's what a finished breakdown looks like</div>
        <button id="wx-hide" class="btn ghost small" style="color:#5a4a12;">Hide example</button>
      </div>
      <div style="margin-top:8px; font-size:.92em; line-height:1.55; color:#4a3d0e;">
        <div><strong>Standard (OAS 11.3.R.3):</strong> Students will evaluate how literary elements impact theme, mood, and/or tone, using textual evidence.</div>
        <div style="margin-top:6px; display:grid; grid-template-columns:130px 1fr; gap:4px 12px;">
          <div><strong>Skill verb:</strong></div><div>evaluate</div>
          <div><strong>Content:</strong></div><div>how literary elements (setting, conflict, point of view, characterization) shape a story's theme, mood, and tone</div>
          <div><strong>Costa's level:</strong></div><div>Level 3 — Applying (“beyond the text”: judge + defend with evidence, not just name an element)</div>
          <div><strong>I can:</strong></div><div>“I can evaluate how one literary element shapes a story's mood or theme, and defend my thinking with specific evidence from the text.” <span style="opacity:.7; font-size:.9em;">(Level-3 verb + evidence defense — matches the standard's Costa level.)</span></div>
          <div><strong>Success criteria:</strong></div><div>Students judge one literary element against clear criteria they can name, and back the judgment with specific textual evidence.</div>
          <div><strong>Ask them:</strong></div><div><em>Would the story's mood change if the author flipped the point of view? Defend your prediction with evidence.</em></div>
        </div>
        <div style="margin-top:8px; font-size:.85em; opacity:.75;">Note: the "I can" verb auto-raises to match Costa's level. If your standard is Level 3, the draft won't drop to "list" or "describe."</div>
      </div>
    </div>
    `}

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-top:18px;">
      <!-- LEFT: Picker + text -->
      <div>
        <h2 class="section-title">1. Choose your standard</h2>

        <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:16px;">
          <label style="display:block; font-weight:600; margin-bottom:6px;">Browse the Oklahoma catalog</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
            <select id="std-subject" class="input">
              <option value="">Any subject</option>
              ${facets.subjects.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("")}
            </select>
            <select id="std-course" class="input">
              <option value="">Any course</option>
              ${facets.courses.map(c => `<option value="${escapeHtml(c.course)}" ${c.course === preCourse ? "selected" : ""}>${escapeHtml(c.course)} (${c.count})</option>`).join("")}
            </select>
          </div>
          <input id="std-search" class="input" placeholder="Search by keyword or code (e.g. &quot;DNA&quot; or &quot;11.3.R.3&quot;)" style="width:100%; margin-bottom:8px;" />
          <div id="std-results" style="max-height:280px; overflow:auto; border:1px solid var(--border); border-radius:6px; background:var(--bg);"></div>
        </div>

        <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:10px; padding:16px;">
          <label style="display:block; font-weight:600; margin-bottom:6px;">Or paste any standard text</label>
          <div style="display:grid; grid-template-columns:130px 1fr; gap:8px; margin-bottom:8px;">
            <input id="std-code-input" class="input" placeholder="Code (optional)" />
            <input id="std-course-input" class="input" placeholder="Course or subject (optional)" />
          </div>
          <textarea id="std-text" class="input" rows="5" placeholder="Paste the standard text here — the fields on the right will auto-fill." style="width:100%; resize:vertical;"></textarea>
          <button id="bd-autofill" class="btn primary small" style="margin-top:10px; width:100%;">Auto-fill from this standard →</button>
          <div style="font-size:.8em; opacity:.65; margin-top:6px;">Auto-fill runs automatically when you pick a standard from the catalog or when you click out of the paste box. Everything the toolkit drafts is a starting point — edit any field.</div>
        </div>
      </div>

      <!-- RIGHT: Breakdown form -->
      <div>
        <h2 class="section-title">2. Break it apart</h2>
        <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:10px; padding:16px;">
          <div style="margin-bottom:12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">Skill verb <span style="opacity:.6; font-weight:400;">(what students DO)</span></label>
            <input id="bd-verb" class="input" placeholder="e.g., analyze, evaluate, model, construct" style="width:100%;" />
            <div id="bd-verb-warn" style="font-size:.8em; color:var(--orange); margin-top:4px; display:none;"></div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">Costa's Level of Thinking <span style="opacity:.6; font-weight:400;">(AVID)</span></label>
            <select id="bd-costa" class="input">
              <option value="">Choose one...</option>
              <option value="1">Level 1 — Gathering (on the page)</option>
              <option value="2">Level 2 — Processing (between the lines)</option>
              <option value="3">Level 3 — Applying (beyond the text)</option>
            </select>
            <div id="bd-costa-reason" style="font-size:.82em; margin-top:6px; padding:6px 10px; background:rgba(200,150,50,0.1); border-left:3px solid var(--gold); border-radius:0 4px 4px 0; display:none;"></div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">Content <span style="opacity:.6; font-weight:400;">(what students KNOW / work with)</span></label>
            <textarea id="bd-content" class="input" rows="2" placeholder="The nouns in the standard — the concepts, processes, texts, or data students work with." style="width:100%; resize:vertical;"></textarea>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">"I can" statement <span style="opacity:.6; font-weight:400;">(student-friendly rewrite)</span></label>
            <textarea id="bd-ican" class="input" rows="3" placeholder="I can __________ so that __________." style="width:100%; resize:vertical;"></textarea>
            <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
              <span style="font-size:.8em; opacity:.7;">Rewrite for:</span>
              ${["K-2","3-5","6-8","9-12"].map(g => `<button class="btn small ghost gb-chip" data-band="${g}" style="padding:3px 10px; font-size:.85em; ${g===gradeBand ? "background:var(--gold); color:var(--card-bg); border-color:var(--gold);" : ""}">${g}</button>`).join("")}
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">Success criteria</label>
            <textarea id="bd-criteria" class="input" rows="2" placeholder="Students can show they got it when they can... (specific, observable)." style="width:100%; resize:vertical;"></textarea>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">Costa's question stems <span style="opacity:.6; font-weight:400;">(ask students these at the target level)</span></label>
            <textarea id="bd-stems" class="input" rows="3" placeholder="3 questions at the standard's Costa level — to use as bell-ringers, exit tickets, or discussion prompts." style="width:100%; resize:vertical;"></textarea>
          </div>

          <details id="bd-adv" style="margin-bottom:12px; border-top:1px dashed var(--border); padding-top:10px;">
            <summary style="cursor:pointer; font-weight:600; font-size:.9em; opacity:.85;">Advanced (optional): vocabulary &amp; misconceptions</summary>
            <div style="margin-top:10px;">
              <label style="font-weight:600; display:block; margin-bottom:4px; font-size:.9em;">Key vocabulary</label>
              <input id="bd-vocab" class="input" placeholder="Comma-separated: hierarchical, homeostasis, transcription..." style="width:100%;" />
            </div>
            <div style="margin-top:10px;">
              <label style="font-weight:600; display:block; margin-bottom:4px; font-size:.9em;">Likely misconceptions</label>
              <textarea id="bd-misc" class="input" rows="2" placeholder="Where kids will get confused, or the wrong pattern they'll fall into." style="width:100%; resize:vertical;"></textarea>
            </div>
          </details>

          <button id="bd-save" class="btn primary" style="width:100%;">Save breakdown</button>
          <div id="bd-save-status" style="margin-top:8px; font-size:.9em;"></div>
        </div>
      </div>
    </div>

    <!-- Saved list -->
    <h2 class="section-title" style="margin-top:32px;">My saved breakdowns</h2>
    <div id="bd-list"></div>
  `;

  // ---------- Wire up ----------
  const state = { selectedCode: "", selectedText: "", selectedCourse: preCourse, selectedSubject: "", gradeBand: gradeBand };
  const $subject = view.querySelector("#std-subject");
  const $course = view.querySelector("#std-course");
  const $search = view.querySelector("#std-search");
  const $results = view.querySelector("#std-results");
  const $codeInput = view.querySelector("#std-code-input");
  const $courseInput = view.querySelector("#std-course-input");
  const $textInput = view.querySelector("#std-text");
  const $verb = view.querySelector("#bd-verb");
  const $verbWarn = view.querySelector("#bd-verb-warn");
  const $content = view.querySelector("#bd-content");
  const $costa = view.querySelector("#bd-costa");
  const $costaReason = view.querySelector("#bd-costa-reason");
  const $ican = view.querySelector("#bd-ican");
  const $criteria = view.querySelector("#bd-criteria");
  const $stems = view.querySelector("#bd-stems");
  const $vocab = view.querySelector("#bd-vocab");
  const $misc = view.querySelector("#bd-misc");

  // Hide worked example
  const $wxHide = view.querySelector("#wx-hide");
  if ($wxHide) $wxHide.addEventListener("click", () => {
    localStorage.setItem(wxKey, "1");
    const p = view.querySelector("#wx-panel");
    if (p) p.remove();
  });

  // Auto-fill helpers
  function autofillFromStandard(overrideText) {
    const stdText = (overrideText != null ? overrideText : $textInput.value || "").trim();
    if (!stdText) return;
    const parsed = StandardAnalyzer.analyze(stdText);
    if (!parsed) return;
    // Only fill fields the user hasn't already edited
    if (!$verb.value.trim()) $verb.value = parsed.verb;
    if (!$content.value.trim()) $content.value = parsed.content;
    if (!$costa.value) $costa.value = String(parsed.costaLevel);
    updateVerbSignals();
    const targetLevel = parseInt($costa.value, 10) || parsed.costaLevel;
    // "I can" AUTO-RAISES the verb to match the standard's Costa level.
    if (!$ican.value.trim()) $ican.value = StandardAnalyzer.proposeICan(parsed.verb, parsed.content, state.gradeBand, targetLevel);
    if (!$criteria.value.trim()) $criteria.value = StandardAnalyzer.proposeCriteria(parsed.verb, parsed.content, state.gradeBand, targetLevel);
    if (!$stems.value.trim()) $stems.value = StandardAnalyzer.proposeQuestionStems(parsed.content, targetLevel).map((q, i) => `${i+1}. ${q}`).join("\n");
    if (!$vocab.value.trim()) $vocab.value = (parsed.vocab || []).join(", ");
    if (!$misc.value.trim()) $misc.value = StandardAnalyzer.proposeMisconceptions(parsed.verb, parsed.content, stdText);
  }

  function updateVerbSignals() {
    const v = ($verb.value || "").toLowerCase().trim();
    if (!v) { $verbWarn.style.display = "none"; $costaReason.style.display = "none"; return; }
    // Warn on vague verbs
    if (StandardAnalyzer.VAGUE_VERBS.has(v)) {
      const sub = StandardAnalyzer.MEASURABLE_SUBS[v] || "explain";
      $verbWarn.textContent = `“${v}” is a vague verb — students can't demonstrate it. Try a measurable verb like “${sub}”.`;
      $verbWarn.style.display = "block";
    } else {
      $verbWarn.style.display = "none";
    }
    // Update Costa reason chip
    const parsedForLevel = StandardAnalyzer.analyze(($textInput.value || "").trim() || `${v} things`);
    if (parsedForLevel) {
      $costaReason.textContent = parsedForLevel.costaReason;
      $costaReason.style.display = "block";
    }
  }

  // If the teacher manually changes the Costa level, re-raise the "I can" and criteria
  // to that new target so the phrasing stays aligned. Only rewrites fields that were
  // still auto-drafted (i.e. still match what proposeICan would produce for the OLD level).
  $costa.addEventListener("change", () => {
    const verb = ($verb.value || "").trim();
    const content = ($content.value || "").trim();
    const target = parseInt($costa.value, 10);
    if (!verb || !content || !target) return;
    $ican.value = StandardAnalyzer.proposeICan(verb, content, state.gradeBand, target);
    $criteria.value = StandardAnalyzer.proposeCriteria(verb, content, state.gradeBand, target);
    $stems.value = StandardAnalyzer.proposeQuestionStems(content, target).map((q, i) => `${i+1}. ${q}`).join("\n");
  });

  // Grade-band chips: re-rewrite the "I can"
  view.querySelectorAll(".gb-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const band = chip.dataset.band;
      state.gradeBand = band;
      localStorage.setItem(gbKey, band);
      view.querySelectorAll(".gb-chip").forEach(c => {
        c.style.background = "";
        c.style.color = "";
        c.style.borderColor = "";
      });
      chip.style.background = "var(--gold)";
      chip.style.color = "var(--card-bg)";
      chip.style.borderColor = "var(--gold)";
      // Rewrite from the parsed pieces so grade-band swaps take effect
      const verb = ($verb.value || "").trim();
      const content = ($content.value || "").trim();
      const target = parseInt($costa.value, 10) || null;
      if (verb && content) {
        $ican.value = StandardAnalyzer.proposeICan(verb, content, band, target);
        $criteria.value = StandardAnalyzer.proposeCriteria(verb, content, band, target);
        $stems.value = StandardAnalyzer.proposeQuestionStems(content, target).map((q, i) => `${i+1}. ${q}`).join("\n");
      }
    });
  });

  // Manual autofill button
  view.querySelector("#bd-autofill").addEventListener("click", () => autofillFromStandard());
  // Autofill when the paste box loses focus
  $textInput.addEventListener("blur", () => autofillFromStandard());
  // Live verb feedback
  $verb.addEventListener("input", updateVerbSignals);

  async function loadResults() {
    const qs = new URLSearchParams();
    if ($subject.value) qs.set("subject", $subject.value);
    if ($course.value) qs.set("course", $course.value);
    if ($search.value.trim()) qs.set("q", $search.value.trim());
    qs.set("limit", "50");
    try {
      const data = await fetchJSON(`/api/state-standards?${qs}`);
      renderStandardResults(data.items || []);
    } catch (e) {
      $results.innerHTML = `<div style="padding:12px; opacity:.6;">Error loading standards</div>`;
    }
  }

  function renderStandardResults(items) {
    if (!items.length) {
      $results.innerHTML = `<div style="padding:12px; opacity:.6;">No standards match. Try broadening the filters.</div>`;
      return;
    }
    $results.innerHTML = items.slice(0, 100).map(s => `
      <div class="std-result-row" data-code="${escapeHtml(s.code)}" style="padding:10px 12px; border-bottom:1px solid var(--border); cursor:pointer;">
        <div style="font-weight:600; font-size:.9em; color:var(--orange);">${escapeHtml(s.code)} <span style="font-weight:400; color:var(--fg); opacity:.65;">— ${escapeHtml(s.course)}${s.strand_label ? " • " + escapeHtml(s.strand_label) : ""}</span></div>
        <div style="font-size:.9em; line-height:1.4; margin-top:3px;">${escapeHtml(s.text.slice(0, 240))}${s.text.length > 240 ? "…" : ""}</div>
      </div>
    `).join("");
    $results.querySelectorAll(".std-result-row").forEach(row => {
      row.addEventListener("click", async () => {
        const code = row.dataset.code;
        try {
          const s = await fetchJSON(`/api/state-standards/${encodeURIComponent(code)}`);
          state.selectedCode = s.code;
          state.selectedText = s.text;
          state.selectedCourse = s.course;
          state.selectedSubject = s.subject;
          $codeInput.value = s.code;
          $courseInput.value = s.course;
          $textInput.value = s.text;
          // Highlight
          $results.querySelectorAll(".std-result-row").forEach(r => r.style.background = "");
          row.style.background = "var(--card-bg)";
          // Reset the breakdown fields so autofill has room to write, then autofill.
          [$verb, $content, $costa, $ican, $criteria, $stems, $vocab, $misc].forEach(el => { el.value = ""; });
          autofillFromStandard(s.text);
        } catch (e) { /* noop */ }
      });
    });
  }

  $subject.addEventListener("change", loadResults);
  $course.addEventListener("change", loadResults);
  let searchDebounce;
  $search.addEventListener("input", () => { clearTimeout(searchDebounce); searchDebounce = setTimeout(loadResults, 250); });
  loadResults();

  // Save handler
  view.querySelector("#bd-save").addEventListener("click", async () => {
    const currentTeacher = TeacherStore.get();
    if (!currentTeacher) {
      view.querySelector("#bd-save-status").innerHTML = `<span style="color:var(--orange);">Set your teacher name first (top-right).</span>`;
      return;
    }
    const stdText = ($textInput.value || "").trim();
    if (!stdText) {
      view.querySelector("#bd-save-status").innerHTML = `<span style="color:var(--orange);">Pick a standard or paste one first.</span>`;
      return;
    }
    const payload = {
      teacher: currentTeacher,
      standard_code: $codeInput.value || "",
      standard_text: stdText,
      subject: state.selectedSubject || "",
      course: $courseInput.value || "",
      skill_verb: $verb.value.trim(),
      content: $content.value.trim(),
      // Keep dok_level as the storage field name for backward compatibility with
      // existing saved rows and the backend schema; the value is now Costa's Level (1-3).
      dok_level: parseInt($costa.value, 10) || null,
      costa_level: parseInt($costa.value, 10) || null,
      i_can_statement: $ican.value.trim(),
      success_criteria: $criteria.value.trim(),
      question_stems: $stems.value.trim(),
      vocabulary: $vocab.value.trim(),
      misconceptions: $misc.value.trim(),
    };
    try {
      const res = await fetch(`${API}/api/standard-breakdowns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const body = await res.json();
      view.querySelector("#bd-save-status").innerHTML = `<span style="color:#10b981;">Saved — <a href="#/standards-plan?breakdown=${body.id}">now build an instructional plan →</a></span>`;
      loadBreakdowns();
    } catch (e) {
      view.querySelector("#bd-save-status").innerHTML = `<span style="color:var(--orange);">Save failed: ${escapeHtml(e.message)}</span>`;
    }
  });

  async function loadBreakdowns() {
    const currentTeacher = TeacherStore.get();
    if (!currentTeacher) {
      view.querySelector("#bd-list").innerHTML = `<div class="empty" style="padding:16px;">Set a teacher name (top-right) to save and view your breakdowns.</div>`;
      return;
    }
    try {
      const data = await fetchJSON(`/api/standard-breakdowns?teacher=${encodeURIComponent(currentTeacher)}`);
      const items = data.items || [];
      if (!items.length) {
        view.querySelector("#bd-list").innerHTML = `<div class="empty" style="padding:16px;">No saved breakdowns yet. Fill in the form above and click Save.</div>`;
        return;
      }
      view.querySelector("#bd-list").innerHTML = items.map(b => `
        <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:14px 16px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <div>
              <span style="font-weight:600; color:var(--orange);">${escapeHtml(b.standard_code || "—")}</span>
              <span style="opacity:.65; margin-left:8px; font-size:.9em;">${escapeHtml(b.course || b.subject || "")}</span>
            </div>
            <div style="opacity:.6; font-size:.85em;">${new Date(b.updated_at || b.created_at).toLocaleDateString()}</div>
          </div>
          <div style="margin:6px 0;">${escapeHtml(b.standard_text.slice(0, 180))}${b.standard_text.length > 180 ? "…" : ""}</div>
          ${b.i_can_statement ? `<div style="font-size:.9em;"><strong>I can:</strong> ${escapeHtml(b.i_can_statement)}</div>` : ""}
          <div style="margin-top:10px; display:flex; gap:8px;">
            <a class="btn small" href="#/standards-plan?breakdown=${b.id}">Plan a lesson →</a>
            <button class="btn small ghost bd-del" data-id="${b.id}">Delete</button>
          </div>
        </div>
      `).join("");
      view.querySelectorAll(".bd-del").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!confirm("Delete this breakdown?")) return;
          await fetch(`${API}/api/standard-breakdowns/${btn.dataset.id}?teacher=${encodeURIComponent(currentTeacher)}`, { method: "DELETE" });
          loadBreakdowns();
        });
      });
    } catch (e) {
      view.querySelector("#bd-list").innerHTML = `<div class="empty" style="padding:16px;">Error loading: ${escapeHtml(e.message)}</div>`;
    }
  }
  loadBreakdowns();
}
// ============================================================
// BUILD AN INSTRUCTIONAL PLAN (workspace)
// ============================================================
async function renderStandardsPlan(view, params) {
  const search = new URLSearchParams(location.hash.split("?")[1] || "");
  const preBreakdownId = search.get("breakdown") || "";

  let breakdown = null;
  if (preBreakdownId) {
    try { breakdown = await fetchJSON(`/api/standard-breakdowns/${preBreakdownId}`); } catch {}
  }

  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-overlay"></div>
      <div class="hero-inner" style="padding:34px 24px;">
        <div class="eyebrow on-dark">Standards &amp; Planning</div>
        <h1 class="hero-title">Build an Instructional Plan</h1>
        <p class="hero-lede">Turn a broken-down standard into a five-move lesson: Launch, Explore, Explain, Apply, Check. Save the plan and pull it into a weekly or unit plan.</p>
      </div>
    </section>

    ${breakdown ? `
    <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:10px; padding:14px 16px; margin-top:18px; margin-bottom:8px;">
      <div style="font-size:.85em; opacity:.65; text-transform:uppercase; letter-spacing:.5px;">Planning for standard</div>
      <div style="font-weight:600; color:var(--orange); margin-top:4px;">${escapeHtml(breakdown.standard_code || "—")}${breakdown.course ? ` • ${escapeHtml(breakdown.course)}` : ""}</div>
      <div style="margin-top:6px;">${escapeHtml(breakdown.standard_text)}</div>
      ${breakdown.i_can_statement ? `<div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border);"><strong>I can:</strong> ${escapeHtml(breakdown.i_can_statement)}</div>` : ""}
      ${breakdown.skill_verb || breakdown.content || breakdown.dok_level ? `<div style="margin-top:6px; font-size:.9em; opacity:.75;">${breakdown.skill_verb ? `<strong>Skill:</strong> ${escapeHtml(breakdown.skill_verb)}` : ""}${breakdown.content ? ` • <strong>Content:</strong> ${escapeHtml(breakdown.content)}` : ""}${breakdown.dok_level ? ` • <strong>Costa L${breakdown.dok_level}</strong>` : ""}</div>` : ""}
    </div>
    ` : `
    <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:10px; padding:14px 16px; margin-top:18px; margin-bottom:8px; opacity:.75;">
      <div>No breakdown selected. <a href="#/standards-unpack">Break down a standard first →</a> or fill in the plan below directly.</div>
    </div>
    `}

    <h2 class="section-title">The lesson</h2>
    <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:10px; padding:16px;">
      <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="font-weight:600; display:block; margin-bottom:4px;">Lesson title</label>
          <input id="pl-title" class="input" style="width:100%;" placeholder="e.g., DNA and protein synthesis intro" />
        </div>
        <div>
          <label style="font-weight:600; display:block; margin-bottom:4px;">Total minutes</label>
          <input id="pl-mins" type="number" class="input" style="width:100%;" placeholder="50" />
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-weight:600; display:block; margin-bottom:4px;">1. Launch <span style="opacity:.6; font-weight:400;">— hook + post the I can</span></label>
        <textarea id="pl-launch" class="input" rows="3" style="width:100%; resize:vertical;" placeholder="How you'll hook students in the first 3-5 minutes and post the I can statement."></textarea>
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-weight:600; display:block; margin-bottom:4px;">2. Explore <span style="opacity:.6; font-weight:400;">— students engage with the content first</span></label>
        <textarea id="pl-explore" class="input" rows="3" style="width:100%; resize:vertical;" placeholder="What students do BEFORE you explain: a Do Now, discovery task, data set, model, text."></textarea>
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-weight:600; display:block; margin-bottom:4px;">3. Explain <span style="opacity:.6; font-weight:400;">— your direct instruction (short!)</span></label>
        <textarea id="pl-explain" class="input" rows="3" style="width:100%; resize:vertical;" placeholder="The 5-10 minutes where you make the content explicit. Model with I Do / We Do."></textarea>
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-weight:600; display:block; margin-bottom:4px;">4. Apply <span style="opacity:.6; font-weight:400;">— students practice with support</span></label>
        <textarea id="pl-apply" class="input" rows="3" style="width:100%; resize:vertical;" placeholder="Guided practice or independent task where every student produces the skill."></textarea>
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-weight:600; display:block; margin-bottom:4px;">5. Check <span style="opacity:.6; font-weight:400;">— formative assessment tied to the I can</span></label>
        <textarea id="pl-check" class="input" rows="3" style="width:100%; resize:vertical;" placeholder="Exit ticket, hinge question, whiteboard slate, brief write — how you'll know they got it."></textarea>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="font-weight:600; display:block; margin-bottom:4px;">Differentiation</label>
          <textarea id="pl-diff" class="input" rows="2" style="width:100%; resize:vertical;" placeholder="Supports for MLLs, IEPs, and students below grade level."></textarea>
        </div>
        <div>
          <label style="font-weight:600; display:block; margin-bottom:4px;">Materials</label>
          <textarea id="pl-materials" class="input" rows="2" style="width:100%; resize:vertical;" placeholder="Copies, slides, videos, lab supplies, tech."></textarea>
        </div>
      </div>

      <button id="pl-save" class="btn primary" style="width:100%;">Save instructional plan</button>
      <div id="pl-save-status" style="margin-top:8px; font-size:.9em;"></div>
    </div>

    <h2 class="section-title" style="margin-top:32px;">My saved plans</h2>
    <div id="pl-list"></div>
  `;

  view.querySelector("#pl-save").addEventListener("click", async () => {
    const currentTeacher = TeacherStore.get();
    if (!currentTeacher) {
      view.querySelector("#pl-save-status").innerHTML = `<span style="color:var(--orange);">Set your teacher name first (top-right).</span>`;
      return;
    }
    const payload = {
      teacher: currentTeacher,
      breakdown_id: preBreakdownId ? parseInt(preBreakdownId, 10) : null,
      standard_code: breakdown?.standard_code || "",
      title: view.querySelector("#pl-title").value.trim(),
      launch: view.querySelector("#pl-launch").value.trim(),
      explore: view.querySelector("#pl-explore").value.trim(),
      explain: view.querySelector("#pl-explain").value.trim(),
      apply: view.querySelector("#pl-apply").value.trim(),
      formative_check: view.querySelector("#pl-check").value.trim(),
      differentiation: view.querySelector("#pl-diff").value.trim(),
      materials: view.querySelector("#pl-materials").value.trim(),
      duration_minutes: parseInt(view.querySelector("#pl-mins").value, 10) || null,
    };
    try {
      const res = await fetch(`${API}/api/instructional-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      view.querySelector("#pl-save-status").innerHTML = `<span style="color:#10b981;">Plan saved.</span>`;
      loadPlans();
    } catch (e) {
      view.querySelector("#pl-save-status").innerHTML = `<span style="color:var(--orange);">Save failed: ${escapeHtml(e.message)}</span>`;
    }
  });

  async function loadPlans() {
    const currentTeacher = TeacherStore.get();
    if (!currentTeacher) {
      view.querySelector("#pl-list").innerHTML = `<div class="empty" style="padding:16px;">Set a teacher name (top-right) to save and view your plans.</div>`;
      return;
    }
    try {
      const data = await fetchJSON(`/api/instructional-plans?teacher=${encodeURIComponent(currentTeacher)}`);
      const items = data.items || [];
      if (!items.length) {
        view.querySelector("#pl-list").innerHTML = `<div class="empty" style="padding:16px;">No plans saved yet.</div>`;
        return;
      }
      view.querySelector("#pl-list").innerHTML = items.map(p => `
        <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:14px 16px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <div>
              <span style="font-weight:600;">${escapeHtml(p.title || "(untitled)")}</span>
              ${p.standard_code ? `<span style="opacity:.65; margin-left:8px; font-size:.9em; color:var(--orange);">${escapeHtml(p.standard_code)}</span>` : ""}
              ${p.duration_minutes ? `<span style="opacity:.6; margin-left:8px; font-size:.85em;">${p.duration_minutes} min</span>` : ""}
            </div>
            <div style="opacity:.6; font-size:.85em;">${new Date(p.updated_at || p.created_at).toLocaleDateString()}</div>
          </div>
          ${p.launch ? `<div style="margin-top:6px; font-size:.9em;"><strong>Launch:</strong> ${escapeHtml(p.launch.slice(0, 140))}${p.launch.length > 140 ? "…" : ""}</div>` : ""}
          <div style="margin-top:10px;">
            <button class="btn small ghost pl-del" data-id="${p.id}">Delete</button>
          </div>
        </div>
      `).join("");
      view.querySelectorAll(".pl-del").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!confirm("Delete this plan?")) return;
          await fetch(`${API}/api/instructional-plans/${btn.dataset.id}?teacher=${encodeURIComponent(currentTeacher)}`, { method: "DELETE" });
          loadPlans();
        });
      });
    } catch (e) {
      view.querySelector("#pl-list").innerHTML = `<div class="empty" style="padding:16px;">Error loading: ${escapeHtml(e.message)}</div>`;
    }
  }
  loadPlans();

  // Prefill title from breakdown if available
  if (breakdown && breakdown.standard_code) {
    view.querySelector("#pl-title").value = `Lesson: ${breakdown.standard_code}`;
  }
}

// ============================================================
// FIRST 30 DAYS
// ============================================================
const FIRST_30_KEY = "qpd:first-30-days";
const FIRST_30_WEEKS = [
  {
    id: "wk1",
    title: "Week 1 — Survive & set tone",
    intro: "Your first job is climate: kids know exactly what to do when they walk in, what the signals mean, and that you'll narrate what's going right.",
    items: [
      { id: "attention-signal", label: "Attention Signal / Call-and-Response" },
      { id: "do-now", label: "Do Now / bell-ringer routine" },
      { id: "positive-narration", label: "Positive narration" },
      { id: "fa-exit-ticket", label: "Exit Ticket tied to the objective" },
      { id: "rehearsed-transitions", label: "Rehearsed transitions" },
    ],
  },
  {
    id: "wk2",
    title: "Week 2 — Get everyone thinking",
    intro: "Cut the volunteer-only pattern. Every kid gets asked, every kid gets to rehearse, every kid holds a whiteboard.",
    items: [
      { id: "fa-cold-call-wait-time", label: "Cold Call with Wait Time" },
      { id: "turn-and-talk", label: "Turn-and-Talk with sentence stems" },
      { id: "fa-whiteboard-slates", label: "Whiteboard Slates" },
      { id: "modeling-i-do", label: "Modeling (I Do)" },
    ],
  },
  {
    id: "wk3",
    title: "Week 3 — Build a real lesson",
    intro: "Move from routines to design. Every day starts with a posted learning target and has a checkpoint in the middle.",
    items: [
      { id: "lesson-plan-templates", label: "Lesson Plan Templates — Turner Cycle", route: "#/lesson-plans" },
      { id: "priority-standards", label: "Priority standard unpacking", route: "#/standards" },
      { id: "learning-target-board", label: "Learning target on the board every day" },
      { id: "fa-hinge-question", label: "Hinge Question mid-lesson" },
    ],
  },
  {
    id: "wk4",
    title: "Week 4 — Get better",
    intro: "Look at what worked. Write one PL goal. Start a habit of logging what you tried so a coach can help you.",
    items: [
      { id: "fa-fist-to-five", label: "Fist to Five" },
      { id: "fa-muddiest-point", label: "Muddiest Point" },
      { id: "pl-goal", label: "Write your first PL goal", route: "#/pl-tool" },
      { id: "log-tried-week", label: "Log one week of tried entries", route: "#/toolkit" },
    ],
  },
];

function _first30Get() {
  const v = _CookieStore.get("qpd_first_30");
  return (v && typeof v === "object") ? v : {};
}
function _first30Set(state) {
  _CookieStore.set("qpd_first_30", state || {});
}

async function renderFirst30Days(view) {
  const state = _first30Get();
  const strategies = Data.strategies || [];
  const stratMap = new Map(strategies.map((s) => [s.id, s]));

  // Compute progress
  const totalItems = FIRST_30_WEEKS.reduce((sum, w) => sum + w.items.length, 0);
  const doneCount = FIRST_30_WEEKS.reduce((sum, w) => {
    return sum + w.items.filter((it) => state[`${w.id}:${it.id}`]).length;
  }, 0);
  const pct = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;

  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-media" style="background-image:url('./img/heroes/start-here.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Onboarding Path</div>
        <h1 class="hero-title">First 30 Days</h1>
        <p class="hero-lede"><strong>New to a classroom? Start here.</strong> A curated 30-day path for teachers early in their journey — whether you just started your first year or you're stepping in without a traditional teacher-prep background. Work through the weeks in order, or jump to what you need most.</p>
      </div>
    </section>

    <div style="margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
        <span style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);font-weight:700;">Your progress</span>
        <span style="font-size:14px;color:var(--navy);font-weight:700;">${doneCount} / ${totalItems} · ${pct}%</span>
      </div>
      <div class="thirty-progress"><div class="thirty-progress-bar" style="width:${pct}%;"></div></div>
    </div>

    ${FIRST_30_WEEKS.map((w) => `
      <div class="thirty-week">
        <div class="week-eyebrow">${escapeHtml(w.id.replace("wk", "Week "))}</div>
        <h3>${escapeHtml(w.title.split(" — ")[1] || w.title)}</h3>
        <p class="week-intro">${escapeHtml(w.intro)}</p>
        <ul>
          ${w.items.map((it) => {
            const key = `${w.id}:${it.id}`;
            const done = !!state[key];
            let href = it.route || "";
            if (!href && stratMap.has(it.id)) href = `#/strategy/${encodeURIComponent(it.id)}`;
            const label = escapeHtml(it.label);
            const linkHtml = href
              ? `<a href="${href}">${label}</a>`
              : `<span>${label}</span>`;
            return `<li class="${done ? "done" : ""}">
              <input type="checkbox" data-key="${key}" ${done ? "checked" : ""} aria-label="Mark complete: ${label}"/>
              ${linkHtml}
            </li>`;
          }).join("")}
        </ul>
      </div>
    `).join("")}

    <div class="callout" style="margin-top:24px;">
      <h3>Done with the first 30 days?</h3>
      <p>Head to <a href="#/strategies">the full library</a>, write your first PL goal in <a href="#/pl-tool">Write My PL Goal</a>, or read <a href="#/about">About the Toolkit</a>.</p>
    </div>
  `;

  // Wire checkboxes
  $$('.thirty-week input[type=checkbox]').forEach((cb) => {
    cb.addEventListener("change", () => {
      const st = _first30Get();
      st[cb.dataset.key] = cb.checked;
      _first30Set(st);
      cb.closest("li").classList.toggle("done", cb.checked);
      // Update progress bar live
      const total = FIRST_30_WEEKS.reduce((s, w) => s + w.items.length, 0);
      const done = FIRST_30_WEEKS.reduce((s, w) => s + w.items.filter((it) => st[`${w.id}:${it.id}`]).length, 0);
      const p = total ? Math.round((done / total) * 100) : 0;
      const bar = $(".thirty-progress-bar");
      if (bar) bar.style.width = `${p}%`;
    });
  });
}

// ============================================================
// ABOUT
// ============================================================
async function renderAbout(view) {
  // Live-computed content counts so the About page stays in sync with the
  // actual library. Data.ensure() hydrates if the user landed here directly.
  await Data.ensure();
  const nStrategies = (Data.strategies || []).length;
  const nFormative = 16; // formative_assessment.json (merged into strategies; count is fixed for now)
  const nClassroom = (Data.classroom || []).length;
  const nInterventions = (Data.qpd?.interventions?.items || []).length;
  // Marketing-friendly floor for strategies (250+, 300+, ...).
  const strategiesLabel = nStrategies >= 300 ? "300+"
                        : nStrategies >= 250 ? "250+"
                        : nStrategies >= 200 ? "200+"
                        : String(nStrategies);
  const strategiesFloor = strategiesLabel === "300+" ? "300"
                         : strategiesLabel === "250+" ? "250"
                         : String(nStrategies);
  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-media" style="background-image:url('./img/heroes/seating.jpg');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">About</div>
        <h1 class="hero-title">About the Turner Instructional Toolkit</h1>
        <p class="hero-lede">A working library of classroom strategies you can try tomorrow — free, no login, no course.</p>
      </div>
    </section>

    <div class="about-block">
      <h2>Who this is for</h2>
      <p>The Turner Instructional Toolkit is for any teacher who wants to add to their toolbox — first-year teachers finding their footing, veterans hunting for a fresh move, career changers and alternatively certified teachers learning the craft on the job, and paraprofessionals stepping into a lead role. If you have a class next period and need something concrete, you're in the right place.</p>
      <p style="color:var(--muted);font-size:14px;margin-top:8px;"><em>Built and maintained by Paul Turner (principal, Wewoka High School). This is a personal, portable toolkit — it works the same wherever the teacher goes.</em></p>

      <h2>What it is</h2>
      <p>A curated library of over ${strategiesFloor} evidence-based classroom strategies, plus tools for weekly planning, unit planning, and writing a defensible professional learning goal. Every strategy card is short and specific: how to run it, a real classroom example, and where the evidence comes from. Nothing is longer than it needs to be.</p>
      <p>It's <strong>not a course</strong>. There's no sequence you have to follow, no completion badge, no cost. Pick what you need, try it, come back for the next thing.</p>

      <h2>Who built it</h2>
      <p>Paul Turner, principal at Wewoka High School in Oklahoma. Built for the teachers at Wewoka first, opened up because good practical PD shouldn't be locked behind a vendor. The strategies come from IES practice guides, the What Works Clearinghouse, the IRIS Center, Doug Lemov's work, and years of watching what actually moves the needle in real classrooms.</p>

      <h2>A note on MTSS and special education</h2>
      <p>This toolkit takes MTSS seriously — the <a href="#/mtss-plc">MTSS &amp; PLC page</a>, the <a href="#/plc-tool">PLC Meeting &amp; Referral Tool</a>, and the Tier 2 intervention pages all exist to help teachers try the right instruction and interventions before escalating. But MTSS is not, and never has been, a gatekeeper for special education. <strong>A student can be referred for a SPED evaluation at any time.</strong></p>
      <p>If a teacher, parent, or team member suspects a disability, the district's <strong>Child Find</strong> obligation under IDEA is triggered <em>immediately</em> — not after a Tier 2 cycle finishes, not after a certain number of interventions have been documented. The U.S. Department of Education is explicit on this in <a href="https://sites.ed.gov/idea/idea-files/osep-memo-11-07-response-to-intervention-rti-memo/" target="_blank" rel="noopener">OSEP Memo 11-07 (2011)</a> and again in the <a href="https://sites.ed.gov/idea/idea-files/rts-qa-child-find-part-b-08-24-2021/" target="_blank" rel="noopener">2021 Child Find Q&amp;A</a>. Tier 2 data is useful evidence <em>within</em> a SPED evaluation — it is never a prerequisite to one. Every page in this toolkit assumes that principle; the <a href="#/mtss-plc">MTSS &amp; PLC page</a> spells it out in detail.</p>

      <h2>Why it's free</h2>
      <p>Because it should be. Teachers already pay for their own supplies. If the Toolkit saves you an hour of planning a week, that's the entire point.</p>

      <h2>How to contribute</h2>
      <p>Tried something that worked? <a href="#/add">Add a strategy</a> to the library. Have feedback — a broken link, an outdated video, a strategy you want included, a classroom example to share? Use the <strong>Send feedback</strong> link at the bottom of every page.</p>

      <h2>What's in it right now</h2>
      <p>${strategiesLabel} strategies · ${nFormative} formative assessment routines · ${nClassroom} classroom techniques · rigor practices · seating guides · standards guides · ${nInterventions} Tier 2 interventions (reading, math, writing, study, behavior, attendance, executive function, EL) · a PL goal writer · a unit planner · a weekly plan builder · lesson plan templates you can print · six K–5 domain pages (Reading, Math, Writing, Science, Social Studies, PE) · a dedicated Teacher–Student Feedback page. All searchable from the sidebar. All yours.</p>
    </div>
  `;
}

// ============================================================
// GLOBAL SEARCH
// ============================================================
function _searchIndex() {
  const idx = [];
  (Data.strategies || []).forEach((s) => idx.push({
    label: s.title, sub: s.category || "Strategy", group: "Strategies", href: `#/strategy/${encodeURIComponent(s.id)}`,
    hay: `${s.title} ${s.description || ""} ${(s.needs || []).join(" ")} ${(s.subjects || []).join(" ")} ${s.category || ""}`.toLowerCase(),
  }));
  (Data.classroom || []).forEach((t) => idx.push({
    label: t.title, sub: "Classroom technique", group: "Classroom Techniques", href: `#/classroom`,
    hay: `${t.title} ${t.description || ""}`.toLowerCase(),
  }));
  (Data.rigor || []).forEach((t) => idx.push({
    label: t.title, sub: "Rigor practice", group: "Rigor & Questioning", href: `#/rigor`,
    hay: `${t.title} ${t.description || ""}`.toLowerCase(),
  }));
  (Data.seating || []).forEach((t) => idx.push({
    label: t.title, sub: "Seating guide", group: "Seating & Environment", href: `#/seating`,
    hay: `${t.title} ${t.description || ""}`.toLowerCase(),
  }));
  (Data.standards || []).forEach((t) => idx.push({
    label: t.title, sub: "Standards guide", group: "Standards & Planning", href: `#/standards`,
    hay: `${t.title} ${t.description || ""}`.toLowerCase(),
  }));
  const iv = Data.qpd?.interventions?.items || [];
  iv.forEach((it) => idx.push({
    label: it.name || it.title, sub: it.category || "Intervention", group: "Interventions", href: `#/classroom`,
    hay: `${it.name || it.title || ""} ${it.description || ""}`.toLowerCase(),
  }));
  // Static pages
  [
    { label: "Start Here", sub: "Dashboard", href: "#/start-here" },
    { label: "First 30 Days", sub: "Onboarding path", href: "#/first-30-days" },
    { label: "Write My PL Goal", sub: "Tool", href: "#/pl-tool" },
    { label: "Unit Planner", sub: "Tool", href: "#/unit-plan" },
    { label: "Weekly Plan", sub: "Tool", href: "#/weekly-plan" },
    { label: "Lesson Plan Templates", sub: "Templates", href: "#/lesson-plans" },
    { label: "Toolkit Examples", sub: "Examples", href: "#/toolkit-examples" },
    { label: "About the Toolkit", sub: "About", href: "#/about" },
    { label: "Elementary Foundations", sub: "K–5 hub", href: "#/elementary" },
    { label: "Early Reading (K–5)", sub: "K–5 domain", href: "#/early-reading" },
    { label: "Early Math (K–5)", sub: "K–5 domain", href: "#/early-math" },
    { label: "Early Writing (K–5)", sub: "K–5 domain", href: "#/early-writing" },
    { label: "Early Science (K–5)", sub: "K–5 domain", href: "#/early-science" },
    { label: "Early Social Studies (K–5)", sub: "K–5 domain", href: "#/early-social-studies" },
    { label: "Early PE (K–5)", sub: "K–5 domain", href: "#/early-pe" },
    { label: "Teacher–Student Feedback", sub: "Feedback", href: "#/feedback" },
  ].forEach((p) => idx.push({ ...p, group: "Pages", hay: p.label.toLowerCase() }));

  // Strategies inside the K–5 domain pages + Feedback page (data lives in elementary.js)
  var elemPages = [
    { slug: "early-reading",        obj: window.Elementary && window.EarlyPages_READING },
    { slug: "early-math",           obj: window.Elementary && window.EarlyPages_MATH },
    { slug: "early-writing",        obj: window.Elementary && window.EarlyPages_WRITING },
    { slug: "early-science",        obj: window.Elementary && window.EarlyPages_SCIENCE },
    { slug: "early-social-studies", obj: window.Elementary && window.EarlyPages_SOCIAL_STUDIES },
    { slug: "early-pe",             obj: window.Elementary && window.EarlyPages_PE },
    { slug: "feedback",             obj: window.Elementary && window.EarlyPages_FEEDBACK },
  ];
  elemPages.forEach((p) => {
    var page = p.obj;
    if (!page || !page.strategies) return;
    page.strategies.forEach((s) => idx.push({
      label: s.title,
      sub: page.title + " · strategy",
      group: "K–5 & Feedback strategies",
      href: "#/" + p.slug,
      hay: (s.title + " " + (s.why || "") + " " + (s.moves || []).join(" ") + " " + (s.evidence || "") + " " + (s.band || "")).toLowerCase(),
    }));
  });
  return idx;
}

function _highlight(text, query) {
  if (!query) return escapeHtml(text);
  const t = escapeHtml(text);
  const q = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return t.replace(new RegExp(`(${q})`, "gi"), "<mark>$1</mark>");
}

let _searchActiveIdx = -1;
let _searchCurrentResults = [];

function initGlobalSearch() {
  const input = document.getElementById("global-search");
  const results = document.getElementById("global-search-results");
  if (!input || !results) return;

  const idx = _searchIndex();

  const render = (q) => {
    if (!q || q.length < 2) {
      results.hidden = true;
      results.innerHTML = "";
      _searchCurrentResults = [];
      _searchActiveIdx = -1;
      return;
    }
    const needle = q.toLowerCase();
    const hits = idx.filter((it) => it.hay.includes(needle)).slice(0, 30);
    _searchCurrentResults = hits;
    _searchActiveIdx = -1;
    if (!hits.length) {
      results.innerHTML = `<div class="gsr-empty">No matches for "${escapeHtml(q)}"</div>`;
      results.hidden = false;
      return;
    }
    const byGroup = {};
    hits.forEach((h) => { (byGroup[h.group] = byGroup[h.group] || []).push(h); });
    const order = ["Strategies", "Classroom Techniques", "Rigor & Questioning", "Seating & Environment", "Standards & Planning", "Interventions", "Pages"];
    let html = "";
    let i = 0;
    order.forEach((g) => {
      if (!byGroup[g]) return;
      html += `<div class="gsr-group-label">${escapeHtml(g)}</div>`;
      byGroup[g].forEach((h) => {
        html += `<a class="gsr-item" data-idx="${i}" href="${h.href}">
          <div class="gsr-title">${_highlight(h.label, q)}</div>
          <div class="gsr-sub">${escapeHtml(h.sub)}</div>
        </a>`;
        i++;
      });
    });
    // Flat result order matches indices used above
    const flat = order.flatMap((g) => byGroup[g] || []);
    _searchCurrentResults = flat;
    results.innerHTML = html;
    results.hidden = false;

    // Click closes dropdown
    results.querySelectorAll(".gsr-item").forEach((el) => {
      el.addEventListener("click", () => {
        input.value = "";
        results.hidden = true;
      });
    });
  };

  input.addEventListener("input", (e) => render(e.target.value.trim()));
  input.addEventListener("focus", (e) => {
    if (e.target.value.trim().length >= 2) render(e.target.value.trim());
  });
  input.addEventListener("keydown", (e) => {
    if (results.hidden) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      _searchActiveIdx = Math.min(_searchCurrentResults.length - 1, _searchActiveIdx + 1);
      _updateSearchActive(results);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      _searchActiveIdx = Math.max(-1, _searchActiveIdx - 1);
      _updateSearchActive(results);
    } else if (e.key === "Enter") {
      if (_searchActiveIdx >= 0 && _searchCurrentResults[_searchActiveIdx]) {
        e.preventDefault();
        location.hash = _searchCurrentResults[_searchActiveIdx].href;
        input.value = "";
        results.hidden = true;
        input.blur();
      }
    } else if (e.key === "Escape") {
      input.value = "";
      results.hidden = true;
      input.blur();
    }
  });

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!results.contains(e.target) && e.target !== input) {
      results.hidden = true;
    }
  });
}

function _updateSearchActive(results) {
  results.querySelectorAll(".gsr-item").forEach((el, i) => {
    el.classList.toggle("active", i === _searchActiveIdx);
    if (i === _searchActiveIdx) {
      el.scrollIntoView({ block: "nearest" });
    }
  });
}

// ============================================================
// MTSS ⇄ PLC reference page + working PLC tool
// ============================================================
// The reference page is a working guide to how these two systems fit
// together at a school. The tool underneath it is what a PLC actually
// uses in a meeting: a Tier 1 review + Tier 2 referral + progress-
// monitoring log, all filed under the teacher's name and exportable
// as Word later via MyWork.
//
// Design intent: MTSS and PLC are often taught as parallel initiatives.
// They aren't. PLC is the meeting cadence where the data that drives
// MTSS decisions actually gets looked at. If your PLC doesn't produce
// MTSS actions, you have two systems doing half the work each.

function renderMtssPlc(view) {
  view.innerHTML = `
    <section class="hero hero-compact">
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="eyebrow on-dark">Tier 2 & MTSS</div>
        <h1 class="hero-title">MTSS &amp; PLC — how they fit</h1>
        <p class="hero-lede">MTSS is the response system. PLC is the meeting where the response gets decided. This page explains the loop so your PLC produces MTSS actions instead of parallel busy-work.</p>
      </div>
    </section>

    <div class="callout callout-navy">
      <h3>The one-sentence version</h3>
      <p><strong>PLC is the engine, MTSS is the transmission.</strong> The PLC's four questions turn student data into instructional decisions; MTSS turns those decisions into tiered supports. If your PLC agenda doesn't end in Tier 1 adjustments and Tier 2 referrals, you're spinning the engine without the transmission engaged.</p>
    </div>

    <div class="callout callout-maroon">
      <h3>Academic, behavioral, and social-emotional needs are intertwined — don't treat them as separate systems</h3>
      <p>Students who struggle academically tend to struggle behaviorally and emotionally, and the reverse is just as true. This is not opinion — it's one of the most consistent findings in the last thirty years of school research. A student behind in reading and a student acting out in class are often the same student, and treating those as two separate referral pipelines misses the point every time.</p>
      <ul class="check-list">
        <li><strong>Reading and behavior are correlated and causally linked in both directions.</strong> Morgan, Farkas, Tufis &amp; Sperling (2008) found early reading difficulties predict later behavior problems, and early behavior problems predict later reading difficulties, controlling for prior status (<a href="https://journals.sagepub.com/doi/10.1177/0022219408321123" target="_blank" rel="noopener">Journal of Learning Disabilities, 41(5)</a>).</li>
        <li><strong>Externalizing behavior and academic underachievement run together throughout childhood and adolescence.</strong> Hinshaw's landmark review synthesized decades of evidence that inattention and hyperactivity are the strongest correlates of academic problems in childhood, and by adolescence antisocial behavior and delinquency are clearly linked to underachievement (<a href="https://pubmed.ncbi.nlm.nih.gov/1539086/" target="_blank" rel="noopener">Hinshaw, 1992, Psychological Bulletin, 111(1), 127–155</a>).</li>
        <li><strong>SEL instruction lifts academic achievement.</strong> The Durlak et al. (2011) meta-analysis of 213 universal SEL programs found an 11-percentile-point average gain in academic achievement in schools that implemented SEL with fidelity (<a href="https://onlinelibrary.wiley.com/doi/10.1111/j.1467-8624.2010.01564.x" target="_blank" rel="noopener">Child Development, 82(1)</a>).</li>
        <li><strong>Chronic absenteeism drives both academic and behavioral gaps.</strong> Balfanz &amp; Byrnes' national analysis found students missing 10%+ of school (chronic absence) had substantially lower reading and math achievement and higher discipline referral rates, independent of poverty (<a href="https://new.every1graduates.org/wp-content/uploads/2012/05/FINALChronicAbsenteeismReport_May16.pdf" target="_blank" rel="noopener">Johns Hopkins / Get Schooled, 2012</a>).</li>
        <li><strong>Integrated MTSS outperforms parallel academic-only and behavior-only systems.</strong> McIntosh &amp; Goodman (2016) synthesized the evidence for combined MTSS-A/B (academic + behavior) and found stronger student outcomes than either system alone, largely because problem-solving teams see the whole student instead of two half-pictures (<a href="https://www.guilford.com/books/Integrated-Multi-Tiered-Systems-of-Support/McIntosh-Goodman/9781462524747" target="_blank" rel="noopener"><em>Integrated Multi-Tiered Systems of Support</em>, Guilford Press</a>).</li>
      </ul>
      <p><strong>What this means for your PLC and MTSS team:</strong> when a student surfaces in reading data, ask what's happening with their behavior, attendance, and SEL — and vice versa. The <a href="#/plc-tool">PLC Meeting &amp; Referral Tool</a> supports referrals across all seven domains for exactly this reason. Don't refer for reading and separately refer for behavior six weeks later; look at the whole student in the same conversation.</p>
    </div>

    <div class="callout callout-warn" role="note" aria-label="Legal safeguard">
      <span class="warn-eyebrow">Important — legal safeguard</span>
      <h3>MTSS is not a gatekeeper for special education. A student can be referred for a SPED evaluation at any time.</h3>
      <p>The point of MTSS is to make sure every student gets the right instruction and intervention as early as possible — not to delay evaluations. If a teacher, parent, or team member suspects a disability, the district's <strong>Child Find</strong> obligation under IDEA is triggered <em>immediately</em>, and a request for an initial special education evaluation must be acted on within the timelines your state sets. A student does not have to “fail through the tiers” first, and the school cannot require the family to wait out an intervention cycle before evaluating.</p>
      <p>The U.S. Department of Education's Office of Special Education Programs is explicit on this point in <a href="https://sites.ed.gov/idea/idea-files/osep-memo-11-07-response-to-intervention-rti-memo/" target="_blank" rel="noopener">OSEP Memo 11-07 (Jan. 21, 2011)</a>: “States and LEAs have an obligation to ensure that evaluations of children suspected of having a disability are not delayed or denied because of implementation of an RTI strategy.” The same guidance is restated in OSEP's <a href="https://sites.ed.gov/idea/idea-files/rts-qa-child-find-part-b-08-24-2021/" target="_blank" rel="noopener">2021 Child Find Q&amp;A (Part B)</a>.</p>
      <p><strong>What this means for our PLC and MTSS work:</strong> Tier 2 data is useful evidence <em>within</em> a SPED evaluation, but it is never a prerequisite to one. If a parent or teacher requests an evaluation, or the team suspects a disability, log it, notify the SPED team the same day, and start the evaluation timeline in parallel with any Tier 2 intervention already underway. Ask three questions in every PLC discussion of a struggling student: <strong>(1)</strong> Is Tier 1 working for most of the class? <strong>(2)</strong> Is Tier 2 working for this student? <strong>(3)</strong> Do we suspect a disability — and if yes, has SPED been notified?</p>
    </div>

    <div class="grid-2col">
      <div class="card">
        <div class="card-title">MTSS in one paragraph</div>
        <p>Multi-Tiered System of Supports is a schoolwide framework for meeting every student's academic, behavioral, and social-emotional needs by matching the intensity of support to the level of need. Tier 1 is high-quality core instruction for all. Tier 2 is small-group, evidence-based intervention layered on top for students not yet responding. Tier 3 is intensive, individualized support for the smallest number of students. Universal screening data identifies who needs more; progress-monitoring data tells you whether the extra support is working; a school-level problem-solving team makes tier-movement decisions.</p>
        <p class="small-note">Sources: <a href="https://mtss4success.org/essential-components" target="_blank" rel="noopener">Center on MTSS &mdash; Essential Components</a> &middot; <a href="https://ies.ed.gov/ncee/wwc/PracticeGuide/26" target="_blank" rel="noopener">IES Practice Guide: Assisting Students Struggling with Reading (RTI/MTSS)</a></p>
      </div>

      <div class="card">
        <div class="card-title">PLC in one paragraph</div>
        <p>A Professional Learning Community is a recurring team meeting (usually weekly) where teachers who share students or standards answer four questions: (1) What do we want students to learn? (2) How will we know they've learned it? (3) What will we do when they haven't? (4) What will we do when they already have? A PLC is not a book study, a curriculum meeting, or a compliance check-in — those can happen, but they're not PLC work. PLC work is teachers looking at their own students' data and deciding what to do next.</p>
        <p class="small-note">Source: DuFour, DuFour, Eaker &amp; Many (2016). <em>Learning by Doing.</em> Solution Tree. See also <a href="https://www.solutiontree.com/blog/plc-at-work-critical-questions/" target="_blank" rel="noopener">PLC at Work — the four critical questions</a>.</p>
      </div>
    </div>

    <h2 class="section-title">The loop — how the two systems connect</h2>
    <div class="mtss-loop">
      <div class="loop-step">
        <div class="loop-num">1</div>
        <div class="loop-body">
          <div class="loop-h">Universal screener (MTSS)</div>
          <p>3× per year the school screens every student in reading and math. Results roll up by teacher, grade, and building. This is MTSS data — it never lives only in a single teacher's gradebook.</p>
        </div>
      </div>
      <div class="loop-step">
        <div class="loop-num">2</div>
        <div class="loop-body">
          <div class="loop-h">Weekly PLC (PLC)</div>
          <p>Teachers who share a grade or content bring <strong>common formative assessment data</strong> (Question 2 of the PLC), plus the most recent screener. They answer: which students are on track for the standard, which are close, which need Tier 2 support?</p>
        </div>
      </div>
      <div class="loop-step">
        <div class="loop-num">3</div>
        <div class="loop-body">
          <div class="loop-h">Tier 1 adjustment (PLC → back to classroom)</div>
          <p>For the "close" students, the PLC agrees on a Tier 1 adjustment — a re-teach, a small change to the next lesson, a specific strategy from the toolkit — and every teacher runs it that week. This is the <a href="#/interventions">Interventions Library</a>'s job for individual moves, and the <a href="#/weekly-plan">Weekly Plan Builder</a>'s job for putting them into next week.</p>
        </div>
      </div>
      <div class="loop-step">
        <div class="loop-num">4</div>
        <div class="loop-body">
          <div class="loop-h">Tier 2 referral (PLC → MTSS team)</div>
          <p>For students not responding to Tier 1, the PLC files a Tier 2 referral to the building's MTSS/problem-solving team: what's the specific skill gap, what Tier 1 adjustments have been tried, what evidence, what the teacher recommends. The <a href="#/plc-tool">PLC Meeting &amp; Referral Tool</a> generates this from your PLC notes.</p>
        </div>
      </div>
      <div class="loop-step">
        <div class="loop-num">5</div>
        <div class="loop-body">
          <div class="loop-h">Tier 2 intervention (MTSS)</div>
          <p>The MTSS team assigns an evidence-based Tier 2 intervention from the <a href="#/interventions">Interventions Library</a>, an interventionist to deliver it, a start date, and a <strong>progress-monitoring cadence</strong> (typically weekly for 6&ndash;8 weeks). The classroom teacher keeps teaching Tier 1 — the intervention is added, not substituted.</p>
        </div>
      </div>
      <div class="loop-step">
        <div class="loop-num">6</div>
        <div class="loop-body">
          <div class="loop-h">Progress-monitoring review (PLC + MTSS)</div>
          <p>Every 4&ndash;8 weeks the PLC reviews progress-monitoring data alongside common formative results. Three decisions: <strong>keep going</strong>, <strong>change the intervention</strong>, or <strong>move tiers</strong> (up to Tier 3 for intensifying, back to Tier 1 for responders). Decisions and dates get logged.</p>
        </div>
      </div>
      <div class="loop-step">
        <div class="loop-num">7</div>
        <div class="loop-body">
          <div class="loop-h">Loop closes → back to next screener</div>
          <p>The next universal screener validates whether Tier 1 got stronger (fewer students needing Tier 2) and whether Tier 2 is doing its job (students exiting back to Tier 1). If Tier 1 keeps flooding Tier 2, that's a PLC problem, not a Tier 2 problem — go back to Question 1.</p>
        </div>
      </div>
    </div>

    <h2 class="section-title">Who owns what</h2>
    <div class="card">
      <table class="clean-table">
        <thead>
          <tr><th>Role</th><th>Owns in PLC</th><th>Owns in MTSS</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Classroom teacher</strong></td>
            <td>Brings common formative data. Runs Tier 1 adjustments agreed to in PLC. Reflects on evidence of student learning.</td>
            <td>Continues Tier 1. Coordinates with interventionist. Provides classroom evidence at progress-monitoring review.</td>
          </tr>
          <tr>
            <td><strong>PLC team / grade-level lead</strong></td>
            <td>Facilitates the 4 questions. Ensures the meeting ends in Tier 1 actions and (if needed) Tier 2 referrals.</td>
            <td>Sends referrals to the MTSS team. Represents the PLC at cross-tier reviews.</td>
          </tr>
          <tr>
            <td><strong>Interventionist / specialist</strong></td>
            <td>Attends PLC when reviewing shared students. Reports Tier 2 progress-monitoring data.</td>
            <td>Delivers the assigned Tier 2 intervention with fidelity. Collects progress-monitoring data on the agreed cadence.</td>
          </tr>
          <tr>
            <td><strong>MTSS / problem-solving team</strong></td>
            <td>&mdash;</td>
            <td>Reviews referrals. Assigns intervention, interventionist, dose, monitoring cadence. Makes tier-movement decisions.</td>
          </tr>
          <tr>
            <td><strong>Principal / instructional leader</strong></td>
            <td>Protects PLC time. Reviews PLC minutes for evidence the four questions are being answered. Coaches teams whose meetings aren't producing actions.</td>
            <td>Chairs or oversees MTSS team. Ensures Tier 2 stays evidence-based. Looks for the Tier-1-flooding-Tier-2 signal building-wide.</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <h2 class="section-title">What data moves between them</h2>
    <div class="grid-2col">
      <div class="card">
        <div class="card-title">PLC → MTSS</div>
        <ul class="check-list">
          <li>Common formative assessment results by student and by standard</li>
          <li>Tier 1 adjustments tried and their outcomes (this is why the tried-log matters)</li>
          <li>Specific skill gap for referred students &mdash; not "reading" but "phonics: r-controlled vowels"</li>
          <li>Teacher's recommended intensity level</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-title">MTSS → PLC</div>
        <ul class="check-list">
          <li>Which intervention was assigned, at what dose, by whom</li>
          <li>Progress-monitoring data on the agreed cadence</li>
          <li>Whether students are exiting Tier 2, staying, or intensifying to Tier 3</li>
          <li>Building-wide Tier 1 signals: if 30%+ of students in a grade are in Tier 2, PLC has core-instruction work to do</li>
        </ul>
      </div>
    </div>

    <h2 class="section-title">Sample weekly PLC agenda (45 minutes)</h2>
    <div class="card">
      <ol class="check-list numbered">
        <li><strong>2 min &mdash; Norms &amp; agenda check.</strong> Data on the table. Phones down.</li>
        <li><strong>5 min &mdash; Q1: What do we want students to learn?</strong> Name the priority standard(s) for the coming week. Everyone shows their common formative assessment for it.</li>
        <li><strong>10 min &mdash; Q2: How will we know they've learned it?</strong> Look at last week's common formative results. Sort students into on-track / close / not-yet.</li>
        <li><strong>15 min &mdash; Q3: What will we do when they haven't?</strong> Two moves:
          <ul>
            <li>For "close" students: agree on a Tier 1 adjustment for next week (a specific strategy from the <a href="#/strategies">library</a>, a re-teach block, a small-group pull during independent work).</li>
            <li>For "not-yet" students already on Tier 1 adjustments: check whether a Tier 2 referral is warranted. If yes, open the <a href="#/plc-tool">PLC Meeting &amp; Referral Tool</a> and file it in this meeting.</li>
          </ul>
        </li>
        <li><strong>8 min &mdash; Q4: What will we do for students who already know it?</strong> Extension task, deeper text, harder problem set &mdash; not just "give them the next worksheet."</li>
        <li><strong>5 min &mdash; Close.</strong> Every teacher restates the one Tier 1 adjustment they will run this week and how they will measure it. Log it in the tool.</li>
      </ol>
      <p><a class="btn primary" href="#/plc-tool">Open the PLC Meeting &amp; Referral Tool &rarr;</a></p>
    </div>

    <h2 class="section-title">Common failure modes (and the fix)</h2>
    <div class="grid-2col">
      <div class="card"><strong>PLC becomes a curriculum meeting.</strong><br>Fix: bring student data, not just next week's plan. If you're not looking at student work, it's not a PLC.</div>
      <div class="card"><strong>MTSS team assigns Tier 2 without knowing what Tier 1 was tried.</strong><br>Fix: no referral without a documented Tier 1 adjustment period. The referral form should require it.</div>
      <div class="card"><strong>Tier 2 substitutes for Tier 1 instead of adding to it.</strong><br>Fix: schedule Tier 2 outside core instruction blocks. Students in intervention still get all of Tier 1.</div>
      <div class="card"><strong>30%+ of a grade lands in Tier 2.</strong><br>Fix: this is a Tier 1 problem, not a Tier 2 problem. Take it back to the PLC and to instructional leadership. Intervening your way out is not possible.</div>
      <div class="card"><strong>Interventions aren't evidence-based.</strong><br>Fix: pull only from the <a href="#/interventions">Interventions Library</a> or the WWC/IES Practice Guides. If a program isn't there, it doesn't belong in Tier 2 &mdash; someone loved it once.</div>
      <div class="card"><strong>Progress monitoring doesn't happen.</strong><br>Fix: the cadence gets set at referral (e.g., weekly CBM for 6 weeks) and put on the calendar. If it isn't measured, you can't decide.</div>
    </div>

    <h2 class="section-title">Further reading</h2>
    <div class="card">
      <ul class="related-list">
        <li><a href="https://mtss4success.org/essential-components" target="_blank" rel="noopener">Center on MTSS &mdash; Essential Components of MTSS</a> (American Institutes for Research)</li>
        <li><a href="https://ies.ed.gov/ncee/wwc/practiceguides" target="_blank" rel="noopener">IES Practice Guides library</a> &mdash; the Tier 2 evidence base for reading, writing, math, and behavior</li>
        <li><a href="https://www.solutiontree.com/blog/plc-at-work-critical-questions/" target="_blank" rel="noopener">PLC at Work &mdash; the four critical questions</a> (Solution Tree)</li>
        <li>DuFour, DuFour, Eaker &amp; Many (2016). <em>Learning by Doing: A Handbook for Professional Learning Communities at Work</em> (3rd ed.). Solution Tree.</li>
        <li><a href="https://intensiveintervention.org/" target="_blank" rel="noopener">National Center on Intensive Intervention</a> &mdash; Tier 3 tools when Tier 2 isn't enough</li>
      </ul>
    </div>
  `;
}

// ------------------------------------------------------------
// PLC Meeting & Referral Tool
// ------------------------------------------------------------
// Three tabs, all saving under teacher name in localStorage:
//   1. Meeting notes (4 PLC questions, action items)
//   2. Tier 2 referrals (per-student, requires documented Tier 1 attempts)
//   3. Progress-monitoring log (weekly data points on referred students)
// Nothing leaves the browser. Later, MyWork can export any of these.

const PlcStore = {
  key(kind) { return `plc:${kind}:${TeacherStore.get() || "anon"}`; },
  all(kind) {
    try { return JSON.parse(localStorage.getItem(this.key(kind)) || "[]"); } catch { return []; }
  },
  add(kind, item) {
    const list = this.all(kind);
    list.unshift({ id: Date.now().toString(36), createdAt: new Date().toISOString(), ...item });
    localStorage.setItem(this.key(kind), JSON.stringify(list));
    return list[0];
  },
  update(kind, id, patch) {
    const list = this.all(kind).map((r) => r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r);
    localStorage.setItem(this.key(kind), JSON.stringify(list));
  },
  remove(kind, id) {
    const list = this.all(kind).filter((r) => r.id !== id);
    localStorage.setItem(this.key(kind), JSON.stringify(list));
  },
};

let PlcTab = "meeting";

function renderPlcTool(view) {
  const teacher = TeacherStore.get();
  if (!teacher) {
    view.innerHTML = `
      <h1 class="page-title">PLC Meeting &amp; Referral Tool</h1>
      <div class="callout">
        <h3>Sign in first</h3>
        <p>Type your name in the sidebar. Meeting notes, referrals, and progress-monitoring data are saved under your name in this browser.</p>
      </div>
    `;
    return;
  }

  view.innerHTML = `
    <h1 class="page-title">PLC Meeting &amp; Referral Tool</h1>
    <p class="page-lede">A PLC meeting that produces MTSS actions. Fill in the four questions during your meeting, refer students to Tier 2 with a documented Tier 1 history, and log progress-monitoring data as it comes in.</p>
    <p class="small-note">Everything here saves in this browser only, under <strong>${escapeHtml(teacher)}</strong>. Nothing is sent anywhere. Use <a href="#/my-work">My Work</a> to download a Word copy.</p>

    <div class="tabs" id="plc-tabs">
      <button class="tab ${PlcTab === "meeting" ? "active" : ""}" data-tab="meeting">Meeting notes</button>
      <button class="tab ${PlcTab === "referrals" ? "active" : ""}" data-tab="referrals">Tier 2 referrals</button>
      <button class="tab ${PlcTab === "monitoring" ? "active" : ""}" data-tab="monitoring">Progress monitoring</button>
    </div>
    <div id="plc-body"></div>
  `;

  const draw = () => {
    const body = $("#plc-body");
    if (PlcTab === "meeting") body.innerHTML = plcMeetingHtml();
    else if (PlcTab === "referrals") body.innerHTML = plcReferralsHtml();
    else body.innerHTML = plcMonitoringHtml();
    plcWireBody(draw);
  };
  view.querySelectorAll("#plc-tabs .tab").forEach((t) => {
    t.addEventListener("click", () => { PlcTab = t.dataset.tab; router(); });
  });
  draw();
}

function plcMeetingHtml() {
  const meetings = PlcStore.all("meetings");
  return `
    <div class="card">
      <h3 class="subsection-title">New meeting</h3>
      <form id="plc-meeting-form" class="form-grid">
        <div class="form-row"><label>Meeting date</label><input class="input" name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required /></div>
        <div class="form-row"><label>Team / grade / course</label><input class="input" name="team" placeholder="e.g., 6th grade ELA" required /></div>
        <div class="form-row"><label>Q1 &mdash; What do we want students to learn?</label><textarea class="textarea" name="q1" placeholder="Priority standard(s) for the coming week"></textarea></div>
        <div class="form-row"><label>Q2 &mdash; How do we know they've learned it? (data brought to meeting)</label><textarea class="textarea" name="q2" placeholder="Common formative results — on-track / close / not-yet counts"></textarea></div>
        <div class="form-row"><label>Q3 &mdash; What will we do when they haven't? (Tier 1 adjustments + Tier 2 referrals)</label><textarea class="textarea" name="q3" placeholder="Tier 1 adjustment agreed to for next week + which students are being referred to Tier 2"></textarea></div>
        <div class="form-row"><label>Q4 &mdash; What will we do for students who already know it?</label><textarea class="textarea" name="q4" placeholder="Extension / deeper task"></textarea></div>
        <div class="form-row"><label>Action items (one per line, owner + due)</label><textarea class="textarea" name="actions" placeholder="e.g., All teachers run cold-call routine daily &mdash; check next Fri&#10;Ms. Turner files Tier 2 referral for J.S. by Weds"></textarea></div>
        <button type="submit" class="btn primary" style="justify-self:start;">Save meeting</button>
      </form>
    </div>

    <h2 class="section-title">Saved meetings (${meetings.length})</h2>
    ${meetings.length === 0 ? `<div class="empty">No meetings saved yet.</div>` : meetings.map(m => `
      <div class="card">
        <div class="card-meta">${escapeHtml(m.date || "")} &middot; ${escapeHtml(m.team || "")}</div>
        <div class="card-title">Meeting on ${escapeHtml(m.date || "?")}</div>
        ${m.q1 ? `<div class="section"><strong>Q1 &mdash; Learn:</strong> ${nl2br(m.q1)}</div>` : ""}
        ${m.q2 ? `<div class="section"><strong>Q2 &mdash; Know:</strong> ${nl2br(m.q2)}</div>` : ""}
        ${m.q3 ? `<div class="section"><strong>Q3 &mdash; Respond:</strong> ${nl2br(m.q3)}</div>` : ""}
        ${m.q4 ? `<div class="section"><strong>Q4 &mdash; Extend:</strong> ${nl2br(m.q4)}</div>` : ""}
        ${m.actions ? `<div class="section"><strong>Actions:</strong><br>${nl2br(m.actions)}</div>` : ""}
        <button class="btn ghost small" data-plc-del="meetings:${m.id}">Delete</button>
      </div>
    `).join("")}
  `;
}

function plcReferralsHtml() {
  const referrals = PlcStore.all("referrals");
  return `
    <div class="card">
      <h3 class="subsection-title">New Tier 2 referral</h3>
      <p class="small-note">A referral is only valid when Tier 1 adjustments have already been tried and documented. That's the rule &mdash; not paperwork.</p>
      <div class="callout callout-warn" style="margin:8px 0 16px 0; padding:14px 16px;">
        <span class="warn-eyebrow">SPED referral — not a gatekeeper</span>
        <p style="margin-top:4px;">This form is for <strong>Tier 2</strong> intervention referrals. If you or a parent <em>suspect a disability</em>, do not wait for Tier 2 to run. Notify the SPED team the same day and start the special-education evaluation timeline in parallel. MTSS is not a prerequisite to a SPED evaluation — that's <a href="https://sites.ed.gov/idea/idea-files/osep-memo-11-07-response-to-intervention-rti-memo/" target="_blank" rel="noopener">OSEP Memo 11-07 (2011)</a> and reaffirmed in the <a href="https://sites.ed.gov/idea/idea-files/rts-qa-child-find-part-b-08-24-2021/" target="_blank" rel="noopener">2021 Child Find Q&amp;A</a>. See the <a href="#/mtss-plc">MTSS &amp; PLC reference page</a> for the full rule.</p>
      </div>
      <form id="plc-referral-form" class="form-grid">
        <div class="form-row"><label>Student (initials or code &mdash; keep it private)</label><input class="input" name="student" placeholder="e.g., J.S." required /></div>
        <div class="form-row"><label>Grade / class</label><input class="input" name="grade" placeholder="e.g., 6th grade / period 3" /></div>
        <div class="form-row"><label>Referral date</label><input class="input" name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required /></div>
        <div class="form-row"><label>Domain</label>
          <select class="input" name="domain">
            <option>Reading</option>
            <option>Math</option>
            <option>Writing</option>
            <option>Behavior / SEL</option>
            <option>Attendance</option>
            <option>Executive function</option>
            <option>EL / Newcomer support</option>
          </select>
        </div>
        <div class="form-row"><label>Specific skill gap (not "reading" &mdash; "phonics: r-controlled vowels")</label><input class="input" name="skillGap" placeholder="Be specific" required /></div>
        <div class="form-row"><label>Data supporting the concern (screener score, CFA results, dates)</label><textarea class="textarea" name="data" placeholder="e.g., iReady Fall: 12th %ile in fluency; last 3 CFAs 40%, 45%, 42%"></textarea></div>
        <div class="form-row"><label>Tier 1 adjustments already tried (which strategies, how long, what evidence)</label><textarea class="textarea" name="tier1Tried" placeholder="e.g., Cold-call + partner talk daily for 3 weeks; exit tickets show fluency has not improved" required></textarea></div>
        <div class="form-row"><label>Recommended Tier 2 intervention (from the library)</label><input class="input" name="recommendation" placeholder="e.g., HELPS or Repeated Reading" /></div>
        <div class="form-row"><label>Progress-monitoring cadence</label>
          <select class="input" name="cadence">
            <option>Weekly</option>
            <option>Every 2 weeks</option>
            <option>Monthly</option>
          </select>
        </div>
        <div class="form-row"><label>Review-back date (typically 6&ndash;8 weeks out)</label><input class="input" name="reviewDate" type="date" /></div>
        <button type="submit" class="btn primary" style="justify-self:start;">Save referral</button>
      </form>
    </div>

    <h2 class="section-title">Saved referrals (${referrals.length})</h2>
    ${referrals.length === 0 ? `<div class="empty">No Tier 2 referrals filed yet.</div>` : referrals.map(r => `
      <div class="card">
        <div class="card-meta">${escapeHtml(r.date || "")} &middot; ${escapeHtml(r.domain || "")}</div>
        <div class="card-title">${escapeHtml(r.student)} &mdash; ${escapeHtml(r.skillGap)}</div>
        <div class="section"><strong>Data:</strong> ${nl2br(r.data || "—")}</div>
        <div class="section"><strong>Tier 1 tried:</strong> ${nl2br(r.tier1Tried || "—")}</div>
        <div class="section"><strong>Recommended:</strong> ${escapeHtml(r.recommendation || "—")} &middot; <strong>Cadence:</strong> ${escapeHtml(r.cadence || "—")} &middot; <strong>Review by:</strong> ${escapeHtml(r.reviewDate || "—")}</div>
        <button class="btn ghost small" data-plc-del="referrals:${r.id}">Delete</button>
      </div>
    `).join("")}
  `;
}

function plcMonitoringHtml() {
  const entries = PlcStore.all("monitoring");
  const referrals = PlcStore.all("referrals");
  const studentOpts = referrals.map(r => `<option value="${escapeHtml(r.student)}">${escapeHtml(r.student)} &mdash; ${escapeHtml(r.skillGap)}</option>`).join("");
  return `
    <div class="card">
      <h3 class="subsection-title">Log a progress-monitoring data point</h3>
      <p class="small-note">One row per data point per student. Weekly is typical for CBM measures; every-two-weeks or monthly is fine for broader measures.</p>
      <form id="plc-monitoring-form" class="form-grid">
        <div class="form-row"><label>Student (pick from your referrals, or type)</label>
          <input class="input" name="student" list="plc-student-list" placeholder="e.g., J.S." required />
          <datalist id="plc-student-list">${studentOpts}</datalist>
        </div>
        <div class="form-row"><label>Date measured</label><input class="input" name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required /></div>
        <div class="form-row"><label>Measure (what you gave)</label><input class="input" name="measure" placeholder="e.g., DIBELS ORF; 1-min math facts; CBM writing correct word sequences" required /></div>
        <div class="form-row"><label>Score</label><input class="input" name="score" placeholder="e.g., 62 wcpm; 18/25; 4 CWS" required /></div>
        <div class="form-row"><label>Goal / benchmark</label><input class="input" name="goal" placeholder="e.g., 85 wcpm by end of Q2" /></div>
        <div class="form-row"><label>Notes (fidelity, attendance, anything unusual)</label><textarea class="textarea" name="notes"></textarea></div>
        <div class="form-row"><label>Decision so far</label>
          <select class="input" name="decision">
            <option>Continue as is</option>
            <option>Increase intensity / change intervention</option>
            <option>Move up a tier</option>
            <option>Exit back to Tier 1</option>
            <option>Not enough data yet</option>
          </select>
        </div>
        <button type="submit" class="btn primary" style="justify-self:start;">Log data point</button>
      </form>
    </div>

    <h2 class="section-title">Data points logged (${entries.length})</h2>
    ${entries.length === 0 ? `<div class="empty">No progress-monitoring data logged yet.</div>` : `
      <div class="card" style="padding:0;overflow:auto;">
        <table class="clean-table">
          <thead><tr><th>Date</th><th>Student</th><th>Measure</th><th>Score</th><th>Goal</th><th>Decision</th><th>Notes</th><th></th></tr></thead>
          <tbody>
            ${entries.map(e => `<tr>
              <td>${escapeHtml(e.date || "")}</td>
              <td>${escapeHtml(e.student || "")}</td>
              <td>${escapeHtml(e.measure || "")}</td>
              <td>${escapeHtml(e.score || "")}</td>
              <td>${escapeHtml(e.goal || "")}</td>
              <td>${escapeHtml(e.decision || "")}</td>
              <td>${escapeHtml(e.notes || "")}</td>
              <td><button class="btn ghost small" data-plc-del="monitoring:${e.id}">Delete</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    `}
  `;
}

function plcWireBody(redraw) {
  const meetingForm = $("#plc-meeting-form");
  if (meetingForm) meetingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(meetingForm);
    PlcStore.add("meetings", Object.fromEntries(fd));
    toast("Meeting saved.");
    redraw();
  });
  const referralForm = $("#plc-referral-form");
  if (referralForm) referralForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(referralForm);
    PlcStore.add("referrals", Object.fromEntries(fd));
    toast("Tier 2 referral saved.");
    redraw();
  });
  const monitoringForm = $("#plc-monitoring-form");
  if (monitoringForm) monitoringForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(monitoringForm);
    PlcStore.add("monitoring", Object.fromEntries(fd));
    toast("Data point logged.");
    redraw();
  });
  document.querySelectorAll("[data-plc-del]").forEach((b) => {
    b.addEventListener("click", () => {
      const [kind, id] = b.dataset.plcDel.split(":");
      if (confirm("Delete this entry? This cannot be undone.")) {
        PlcStore.remove(kind, id);
        redraw();
      }
    });
  });
}
