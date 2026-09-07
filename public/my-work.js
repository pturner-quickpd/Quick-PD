/* my-work.js — "My Work": one place where a teacher sees everything they've
   saved in Quick PD and can take it with them.
   - Download any single item as a Word file (.docx)
   - Download the whole portfolio as one Word file
   - Save a backup file / restore it on another computer
   Reads the same browser storage api-shim.js writes to. Depends on
   planner-core.js (window.PlannerCore) for the .docx builder. */
(function () {
  "use strict";

  var NS = "qpd:";
  function table(name) { try { return JSON.parse(localStorage.getItem(NS + name) || "[]"); } catch (e) { return []; } }
  function teacher() { var m = document.cookie.match(/(?:^|;\s*)qpd_teacher=([^;]+)/); return m ? decodeURIComponent(m[1]) : ""; }
  function mine(rows) { var t = teacher(); return rows.filter(function (r) { return !t || (r.teacher || "") === t; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(d) { if (!d) return ""; var x = new Date(d); return isNaN(x) ? String(d) : x.toLocaleDateString(); }
  function slug(s) { return String(s || "item").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "item"; }
  function stratTitle(id) {
    var list = (window.Data && window.Data.strategies) || [];
    for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i].title;
    return "Strategy " + id;
  }
  function draft(key) { try { return JSON.parse(localStorage.getItem("quickpd:plan:" + key) || "null"); } catch (e) { return null; } }
  function filled(state) { var n = 0; for (var k in state) if (state[k] && String(state[k]).trim()) n++; return n; }

  // ---------- Word blocks for each kind of work ----------
  function goalBlocks(p) {
    var d = p.data || {}, b = [];
    if (d.assembled) b.push({ h3: "Goal statement" }, { p: d.assembled });
    if (d.focus) b.push({ label: "Focus area", value: d.focus });
    if (d.baseline) b.push({ label: "Baseline", value: d.baseline });
    if (d.target) b.push({ label: "Target", value: d.target });
    if (d.move) b.push({ label: "Instructional move", value: d.move });
    if (d.measure) b.push({ label: "Measure", value: d.measure });
    if (d.timeline) b.push({ label: "Timeline", value: d.timeline });
    if (d.anchorStandards) b.push({ label: "Anchor standards", value: d.anchorStandards });
    b.push({ p: "Saved " + fmt(p.updatedAt) });
    return b;
  }
  function reflectionBlocks(r) {
    var b = [{ label: "Week of", value: fmt(r.weekStart) }];
    if (r.wins) b.push({ h3: "Wins" }, { p: r.wins });
    if (r.struggles) b.push({ h3: "Struggles" }, { p: r.struggles });
    if (r.nextWeekFocus) b.push({ h3: "Next week's focus" }, { p: r.nextWeekFocus });
    // v2: studentEvidence + evidenceTypes; keep legacy r.evidence fallback.
    var evTxt = r.studentEvidence || r.evidence;
    if (evTxt) b.push({ h3: "Evidence of student learning" }, { p: evTxt });
    if (Array.isArray(r.evidenceTypes) && r.evidenceTypes.length) {
      b.push({ label: "Evidence types", value: r.evidenceTypes.join(", ") });
    }
    return b;
  }
  var OUTCOME_LABEL = { worked: "Worked well", partial: "Partially worked", not_yet: "Did not work yet", coaching: "Need coaching" };
  function triedBlocks(rows) {
    return [{ headers: ["Date", "Strategy", "How it went", "Evidence", "Notes"],
      table: rows.map(function (t) {
        var outcome = OUTCOME_LABEL[t.outcome] || (t.worked ? "Yes" : "Not yet");
        var ev = (Array.isArray(t.evidenceTypes) ? t.evidenceTypes.join(", ") : "");
        if (t.evidenceNotes) ev = ev ? (ev + " — " + t.evidenceNotes) : t.evidenceNotes;
        return [fmt(t.triedDate), stratTitle(t.strategyId), outcome, ev, t.notes || ""];
      }) }];
  }
  var PLAN_LABELS = { weekly: "Weekly Plan", unit: "Unit Plan", daily: "Daily Plan" };
  function draftBlocks(key, state) {
    var b = [];
    Object.keys(state).forEach(function (k) {
      var v = state[k]; if (v == null || !String(v).trim()) return;
      var label = k.replace(/^(wp|up|dp)-/, "").replace(/-/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);
      b.push({ label: label, value: String(v) });
    });
    return b.length ? b : [{ p: "(empty)" }];
  }

  function download(title, blocks, filename, btn) {
    var PC = window.PlannerCore;
    if (!PC) { alert("The Word builder did not load. Refresh and try again."); return; }
    var orig = btn && btn.textContent; if (btn) { btn.disabled = true; btn.textContent = "Preparing…"; }
    PC.buildDocx(title, blocks).then(function (blob) { PC.downloadBlob(blob, filename); })
      .catch(function (e) { alert("Could not build the Word file. " + (e && e.message || "")); })
      .then(function () { if (btn) { btn.disabled = false; btn.textContent = orig; } });
  }

  // ---------- Portfolio (everything in one .docx) ----------
  function portfolioBlocks(all) {
    var t = teacher() || "Teacher";
    var b = [{ h1: "Quick PD Portfolio — " + t }, { p: "Wewoka High School · exported " + new Date().toLocaleDateString() }, { hr: true }];
    if (all.goals.length) { b.push({ h2: "Professional learning goals (" + all.goals.length + ")" }); all.goals.forEach(function (g) { b = b.concat(goalBlocks(g), [{ hr: true }]); }); }
    ["weekly", "unit", "daily"].forEach(function (k) { if (all.drafts[k]) { b.push({ h2: PLAN_LABELS[k] + " (current draft)" }); b = b.concat(draftBlocks(k, all.drafts[k]), [{ hr: true }]); } });
    if (all.tried.length) { b.push({ h2: "Strategies I tried (" + all.tried.length + ")" }); b = b.concat(triedBlocks(all.tried), [{ hr: true }]); }
    if (all.reflections.length) { b.push({ h2: "Weekly reflections (" + all.reflections.length + ")" }); all.reflections.forEach(function (r) { b = b.concat(reflectionBlocks(r), [{ hr: true }]); }); }
    if (all.favorites.length) { b.push({ h2: "My Toolkit — saved strategies (" + all.favorites.length + ")" }, { bullets: all.favorites.map(stratTitle) }); }
    return b;
  }

  // ---------- Backup / restore ----------
  function collectBackup() {
    var out = { app: "Quick PD · Wewoka High", version: 1, exportedAt: new Date().toISOString(), teacher: teacher(), keys: {} };
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf("qpd:") === 0 || k.indexOf("quickpd:") === 0) out.keys[k] = localStorage.getItem(k);
    }
    return out;
  }
  function restoreBackup(obj, merge) {
    if (!obj || !obj.keys) throw new Error("That file is not a Quick PD backup.");
    var n = 0;
    Object.keys(obj.keys).forEach(function (k) {
      if (merge && k.indexOf("qpd:") === 0 && /^\[/.test(obj.keys[k] || "")) {
        // merge table rows by id so nothing on this computer is lost
        var cur = table(k.slice(4)), inc = [];
        try { inc = JSON.parse(obj.keys[k]); } catch (e) {}
        var seen = {}; cur.forEach(function (r) { seen[JSON.stringify(r)] = 1; });
        inc.forEach(function (r) { if (!seen[JSON.stringify(r)]) cur.push(r); });
        localStorage.setItem(k, JSON.stringify(cur));
      } else localStorage.setItem(k, obj.keys[k]);
      n++;
    });
    if (obj.teacher && !teacher()) document.cookie = "qpd_teacher=" + encodeURIComponent(obj.teacher) + "; path=/; max-age=31536000; SameSite=Lax";
    return n;
  }

  // ---------- Page ----------
  function load() {
    return {
      goals: mine(table("pl_goals")).sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); }),
      tried: mine(table("tried_log")).sort(function (a, b) { return String(b.triedDate).localeCompare(String(a.triedDate)); }),
      reflections: mine(table("reflections")).sort(function (a, b) { return String(b.weekStart).localeCompare(String(a.weekStart)); }),
      favorites: mine(table("favorites")).map(function (f) { return f.strategyId; }),
      drafts: { weekly: draft("weekly"), unit: draft("unit"), daily: draft("daily") }
    };
  }

  function render(view) {
    var all = load();
    var t = teacher();
    var total = all.goals.length + all.tried.length + all.reflections.length + all.favorites.length + ["weekly", "unit", "daily"].filter(function (k) { return all.drafts[k]; }).length;

    var h = '<h1 class="page-title">My Work</h1>' +
      '<p class="page-lede">Everything you have saved in Quick PD' + (t ? " as <strong>" + esc(t) + "</strong>" : "") + '. Download any item as a Word file, take the whole portfolio at once, or save a backup you can restore on another computer.</p>';

    if (!t) h += '<div class="card" style="border-left:4px solid var(--gold);"><div class="card-title">Sign in with your name first</div><p class="card-desc">Type your name in the box at the top of the sidebar and press <strong>Sign in</strong>. There is no password — the name is just how your work is filed.</p><div class="button-row"><button type="button" class="btn btn-primary btn-sm" onclick="window.requireTeacher()">Go to sign in</button></div></div>';

    h += '<div class="card card-featured"><div class="card-title">Take it with you</div>' +
      '<p class="card-desc">Quick PD keeps your work in this browser on this computer. Use these to move it or keep a copy.</p>' +
      '<div class="button-row">' +
      '<button type="button" class="btn btn-primary" id="mw-portfolio"' + (total ? "" : " disabled") + '>⭳ Download everything as Word (.docx)</button>' +
      '<button type="button" class="btn" id="mw-backup">Save backup file</button>' +
      '<label class="btn" style="cursor:pointer">Restore from backup <input type="file" id="mw-restore" accept="application/json,.json" style="display:none"></label>' +
      '</div>' +
      '<div class="planner-actions-note">The backup is a small file (.json). On another computer, open Quick PD → My Work → Restore, choose the file, and your goals, plans, tried-it log, reflections and toolkit come back. Restoring adds to what is already on that computer; it does not erase it.</div></div>';

    // PL goals
    h += '<h2 class="section-title">Professional learning goals <span class="card-meta">' + all.goals.length + '</span></h2>';
    h += all.goals.length ? all.goals.map(function (g, i) {
      var d = g.data || {};
      return '<div class="card"><div class="card-meta">' + esc(fmt(g.updatedAt)) + '</div><div class="card-title">' + esc(d.focus || "PL goal") + '</div>' +
        (d.assembled ? '<p>' + esc(d.assembled) + '</p>' : '') +
        '<div class="button-row"><button type="button" class="btn btn-primary btn-sm" data-goal="' + i + '">⭳ Word (.docx)</button> <a class="btn btn-sm" href="#/pl-tool">Open goal writer</a></div></div>';
    }).join("") : '<div class="empty">No goals yet. <a href="#/pl-tool">Write one →</a></div>';

    // Plans
    h += '<h2 class="section-title">Plans in progress</h2><div class="form-grid form-grid-3">';
    ["weekly", "unit", "daily"].forEach(function (k) {
      var s = all.drafts[k];
      h += '<div class="card"><div class="card-title">' + PLAN_LABELS[k] + '</div>' +
        (s ? '<p class="card-desc">' + filled(s) + ' fields filled — auto-saved as you type.</p><div class="button-row"><button type="button" class="btn btn-primary btn-sm" data-draft="' + k + '">⭳ Word (.docx)</button> <a class="btn btn-sm" href="#/' + k + '-plan">Open</a></div>'
           : '<p class="card-desc">Nothing started.</p><div class="button-row"><a class="btn btn-sm" href="#/' + k + '-plan">Start one</a></div>') + '</div>';
    });
    h += '</div>';

    // Tried
    h += '<h2 class="section-title">Strategies I tried <span class="card-meta">' + all.tried.length + '</span></h2>';
    if (all.tried.length) {
      var worked = all.tried.filter(function (x) { return x.worked; }).length;
      h += '<div class="card"><p class="card-desc">' + worked + ' of ' + all.tried.length + ' marked as worked.</p><ul class="resource-list">' +
        all.tried.slice(0, 50).map(function (x) { return '<li><span class="res-meta">' + esc(fmt(x.triedDate)) + '</span> <a href="#/strategy/' + encodeURIComponent(x.strategyId) + '">' + esc(stratTitle(x.strategyId)) + '</a> — ' + (x.worked ? "✓ worked" : "✗ not yet") + (x.notes ? ' <em>“' + esc(x.notes) + '”</em>' : '') + '</li>'; }).join("") +
        '</ul><div class="button-row"><button type="button" class="btn btn-primary btn-sm" id="mw-tried">⭳ Word (.docx)</button></div></div>';
    } else h += '<div class="empty">Nothing logged yet. Mark "I tried this" on any strategy page.</div>';

    // Reflections
    h += '<h2 class="section-title">Weekly reflections <span class="card-meta">' + all.reflections.length + '</span></h2>';
    h += all.reflections.length ? all.reflections.map(function (r, i) {
      return '<div class="card"><div class="card-meta">Week of ' + esc(fmt(r.weekStart)) + '</div>' +
        (r.wins ? '<p><strong>Wins:</strong> ' + esc(r.wins) + '</p>' : '') + (r.struggles ? '<p><strong>Struggles:</strong> ' + esc(r.struggles) + '</p>' : '') + (r.nextWeekFocus ? '<p><strong>Next:</strong> ' + esc(r.nextWeekFocus) + '</p>' : '') +
        '<div class="button-row"><button type="button" class="btn btn-primary btn-sm" data-refl="' + i + '">⭳ Word (.docx)</button></div></div>';
    }).join("") : '<div class="empty">No reflections yet. <a href="#/today">Add one on Today\'s Focus →</a></div>';

    // Favorites
    h += '<h2 class="section-title">My Toolkit <span class="card-meta">' + all.favorites.length + '</span></h2>';
    h += all.favorites.length ? '<div class="card"><ul class="resource-list">' + all.favorites.map(function (id) { return '<li><a href="#/strategy/' + encodeURIComponent(id) + '">' + esc(stratTitle(id)) + '</a></li>'; }).join("") + '</ul><div class="button-row"><a class="btn btn-sm" href="#/toolkit">Open My Toolkit</a></div></div>'
      : '<div class="empty">No saved strategies yet. Tap ☆ on any strategy.</div>';

    view.innerHTML = h;

    // wire buttons
    var q = function (s) { return view.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(view.querySelectorAll(s)); };
    var name = slug(t || "teacher");
    if (q("#mw-portfolio")) q("#mw-portfolio").addEventListener("click", function (e) { download("Quick PD Portfolio", portfolioBlocks(all), "QuickPD-Portfolio-" + name + ".docx", e.currentTarget); });
    qa("[data-goal]").forEach(function (b) { b.addEventListener("click", function (e) { var g = all.goals[+b.dataset.goal]; download("Professional Learning Goal", [{ h1: "Professional Learning Goal" }, { p: (t ? t + " · " : "") + "Wewoka High School" }, { hr: true }].concat(goalBlocks(g)), "PL-Goal-" + slug((g.data || {}).focus) + ".docx", e.currentTarget); }); });
    qa("[data-refl]").forEach(function (b) { b.addEventListener("click", function (e) { var r = all.reflections[+b.dataset.refl]; download("Weekly Reflection", [{ h1: "Weekly Reflection" }, { p: (t ? t + " · " : "") + "Wewoka High School" }, { hr: true }].concat(reflectionBlocks(r)), "Reflection-" + slug(fmt(r.weekStart)) + ".docx", e.currentTarget); }); });
    qa("[data-draft]").forEach(function (b) { b.addEventListener("click", function (e) { var k = b.dataset.draft; download(PLAN_LABELS[k], [{ h1: PLAN_LABELS[k] }, { p: (t ? t + " · " : "") + "Wewoka High School · " + new Date().toLocaleDateString() }, { hr: true }].concat(draftBlocks(k, all.drafts[k])), PLAN_LABELS[k].replace(" ", "-") + "-" + name + ".docx", e.currentTarget); }); });
    if (q("#mw-tried")) q("#mw-tried").addEventListener("click", function (e) { download("Strategies I Tried", [{ h1: "Strategies I Tried" }, { p: (t ? t + " · " : "") + "Wewoka High School" }, { hr: true }].concat(triedBlocks(all.tried)), "Tried-Log-" + name + ".docx", e.currentTarget); });
    q("#mw-backup").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify(collectBackup(), null, 2)], { type: "application/json" });
      window.PlannerCore.downloadBlob(blob, "QuickPD-backup-" + name + "-" + new Date().toISOString().slice(0, 10) + ".json");
    });
    q("#mw-restore").addEventListener("change", function (ev) {
      var f = ev.target.files && ev.target.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try { var n = restoreBackup(JSON.parse(rd.result), true); if (window.toast) window.toast("Restored " + n + " items"); render(view); }
        catch (e) { alert(e.message || "Could not read that backup file."); }
      };
      rd.readAsText(f);
    });
  }

  window.MyWork = { render: render };
})();
