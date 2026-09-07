// ============================================================
// Quick PD — static API shim
// Replaces the FastAPI/SQLite backend for the Cloudflare Pages build.
// Reference content is read from ./data/*.json; teacher-saved work is
// stored in this browser (localStorage). Must load BEFORE app.js.
// ============================================================
(function () {
  const realFetch = window.fetch.bind(window);
  const DATA = "./data/";
  const cache = {};

  async function loadJSON(name) {
    if (!cache[name]) {
      cache[name] = realFetch(DATA + name).then((r) => {
        if (!r.ok) throw new Error(`Could not load ${name}`);
        return r.json();
      });
    }
    return cache[name];
  }

  // ---------- local storage tables ----------
  const NS = "qpd:";
  function table(name) {
    try { return JSON.parse(localStorage.getItem(NS + name) || "[]"); } catch { return []; }
  }
  function save(name, rows) { localStorage.setItem(NS + name, JSON.stringify(rows)); }
  function nextId(name) {
    const k = NS + "seq:" + name;
    const n = (parseInt(localStorage.getItem(k) || "0", 10) || 0) + 1;
    localStorage.setItem(k, String(n));
    return n;
  }
  function insert(name, row) {
    const rows = table(name);
    row.id = nextId(name);
    rows.push(row);
    save(name, rows);
    return row;
  }
  function byTeacher(name, teacher, sortDesc = true) {
    const rows = table(name).filter((r) => r.teacher === teacher);
    return sortDesc ? rows.sort((a, b) => (b.id || 0) - (a.id || 0)) : rows;
  }
  function remove(name, pred) { save(name, table(name).filter((r) => !pred(r))); }
  const now = () => new Date().toISOString();

  async function loadStandards() {
    if (!cache.__oas) {
      cache.__oas = loadJSON("oas_standards.json").then((d) => {
        const items = d.items || d;
        const srcs = d.sources || {};
        return items.map((s) => ({ ...s, ...(srcs[s.subject] || {}) }));
      });
    }
    return cache.__oas;
  }

  // ---------- reference content ----------
  async function allStrategies() {
    const [base, formative] = await Promise.all([
      loadJSON("strategies.json"),
      loadJSON("formative_assessment.json").catch(() => []),
    ]);
    const titles = new Set(base.map((s) => (s.title || "").trim().toLowerCase()));
    const merged = base.slice();
    for (const it of formative) {
      const t = (it.title || "").trim().toLowerCase();
      if (t && !titles.has(t)) { merged.push(it); titles.add(t); }
    }
    return merged.concat(table("custom_strategies"));
  }

  function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  function notFound() { return json({ detail: "Not found" }, 404); }

  // ---------- router ----------
  async function handle(method, path, params, body) {
    const seg = path.split("/").filter(Boolean); // ["api", ...]
    const r = seg[1];
    const sub = seg[2];

    // -- reference content
    if (r === "strategies" && method === "GET") return json(await allStrategies());
    if (r === "strategies" && method === "POST") {
      const obj = { ...body };
      obj.id = obj.id || "custom-" + Math.random().toString(16).slice(2, 10);
      obj.isCustom = true;
      obj.createdAt = now();
      const rows = table("custom_strategies").filter((s) => s.id !== obj.id);
      rows.push(obj);
      save("custom_strategies", rows);
      return json(obj);
    }
    if (r === "classroom-techniques") return json(await loadJSON("classroom-techniques.json"));
    if (r === "rigor-practices") return json(await loadJSON("rigor-practices.json"));
    if (r === "seating-guides") return json(await loadJSON("seating-guides.json"));
    if (r === "standards-guides") return json(await loadJSON("standards-guides.json"));
    if (r === "standards-breakdowns") {
      const items = await loadJSON("standards-guides.json");
      const q = (params.get("q") || "").trim().toLowerCase();
      if (!q) return json(items);
      return json(items.filter((it) =>
        (it.standardCode || "").toLowerCase().includes(q) ||
        (it.standardText || "").toLowerCase().includes(q) ||
        (it.title || "").toLowerCase().includes(q)));
    }
    if (r === "qpd-content") return json(await loadJSON("qpd_data.json"));

    // -- state standards (OAS)
    if (r === "state-standards") {
      const all = await loadStandards();
      if (sub === "facets") {
        const subjects = [...new Set(all.map((s) => s.subject))].sort();
        const counts = new Map();
        for (const s of all) {
          const k = s.subject + "\u0000" + s.course;
          counts.set(k, (counts.get(k) || 0) + 1);
        }
        const courses = [...counts.entries()]
          .map(([k, n]) => { const [subject, course] = k.split("\u0000"); return { subject, course, count: n }; })
          .sort((a, b) => a.subject.localeCompare(b.subject) || a.course.localeCompare(b.course));
        return json({ subjects, courses });
      }
      if (sub) {
        const code = decodeURIComponent(sub);
        const hit = all.find((s) => s.code === code);
        return hit ? json(hit) : notFound();
      }
      const subject = params.get("subject") || "";
      const course = params.get("course") || "";
      const grade = params.get("grade");
      const q = (params.get("q") || "").toLowerCase();
      const limit = parseInt(params.get("limit") || "500", 10) || 500;
      let items = all;
      if (subject) items = items.filter((s) => s.subject === subject);
      if (course) items = items.filter((s) => s.course === course);
      if (grade !== null && grade !== "") items = items.filter((s) => String(s.grade) === String(grade));
      if (q) items = items.filter((s) =>
        (s.code || "").toLowerCase().includes(q) ||
        (s.text || "").toLowerCase().includes(q) ||
        (s.strand_label || "").toLowerCase().includes(q));
      items = items.slice().sort((a, b) =>
        a.subject.localeCompare(b.subject) || a.course.localeCompare(b.course) || a.code.localeCompare(b.code));
      return json({ items: items.slice(0, limit) });
    }

    // -- teacher-scoped saves
    const teacher = params.get("teacher") || (body && body.teacher) || "anonymous";

    if (r === "unit-plans") {
      if (method === "GET") return json(byTeacher("unit_plans", teacher));
      return json(insert("unit_plans", { teacher: body.teacher, title: body.title || "", data: body.data || {}, updatedAt: now() }));
    }
    if (r === "weekly-plans") {
      if (method === "GET") return json(byTeacher("weekly_plans", teacher));
      return json(insert("weekly_plans", { teacher: body.teacher, weekOf: body.weekOf || "", data: body.data || {}, updatedAt: now() }));
    }
    if (r === "pl-goals") {
      if (method === "GET") return json(byTeacher("pl_goals", teacher));
      return json(insert("pl_goals", { teacher: body.teacher, data: body.data || {}, updatedAt: now() }));
    }
    if (r === "favorites") {
      if (method === "GET") return json(byTeacher("favorites", teacher, false).map((f) => f.strategyId));
      if (method === "POST") {
        const rows = table("favorites");
        if (!rows.some((f) => f.teacher === body.teacher && f.strategyId === body.strategyId)) {
          rows.push({ teacher: body.teacher, strategyId: body.strategyId, createdAt: now() });
          save("favorites", rows);
        }
        return json({ ok: true });
      }
      if (method === "DELETE") {
        const sid = params.get("strategyId");
        remove("favorites", (f) => f.teacher === teacher && f.strategyId === sid);
        return json({ ok: true });
      }
    }
    if (r === "tried-log") {
      if (method === "GET") return json(byTeacher("tried_log", teacher));
      const date = body.triedDate || now().slice(0, 10);
      // v2 schema: keep legacy `worked` bool alongside `outcome` + evidence.
      return json(insert("tried_log", {
        teacher: body.teacher,
        strategyId: body.strategyId,
        triedDate: date,
        worked: !!body.worked,
        outcome: body.outcome || (body.worked ? "worked" : "not_yet"),
        evidenceTypes: Array.isArray(body.evidenceTypes) ? body.evidenceTypes : [],
        evidenceNotes: body.evidenceNotes || "",
        notes: body.notes || "",
        createdAt: now(),
      }));
    }
    if (r === "reflections") {
      if (method === "GET") return json(byTeacher("reflections", teacher));
      const week = body.weekStart || now().slice(0, 10);
      return json(insert("reflections", {
        teacher: body.teacher,
        weekStart: week,
        wins: body.wins || "",
        struggles: body.struggles || "",
        nextWeekFocus: body.nextWeekFocus || "",
        // v2: student-learning evidence + evidence types
        studentEvidence: body.studentEvidence || "",
        evidenceTypes: Array.isArray(body.evidenceTypes) ? body.evidenceTypes : [],
        createdAt: now(),
      }));
    }
    if (r === "standard-breakdowns" || r === "instructional-plans") {
      const t = r === "standard-breakdowns" ? "standard_breakdowns" : "instructional_plans";
      if (sub) {
        const id = parseInt(sub, 10);
        if (method === "DELETE") { remove(t, (x) => x.id === id && x.teacher === teacher); return json({ ok: true }); }
        const hit = table(t).find((x) => x.id === id);
        return hit ? json(hit) : notFound();
      }
      if (method === "GET") return json({ items: byTeacher(t, teacher) });
      const row = insert(t, { ...body, created_at: now(), updated_at: now() });
      return json({ id: row.id, ok: true });
    }
    if (r === "health") {
      const s = await allStrategies();
      return json({ ok: true, static: true, counts: { strategies: s.length } });
    }
    return notFound();
  }

  window.fetch = function (input, opts) {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    const i = url.indexOf("/api/");
    if (i === -1) return realFetch(input, opts);
    const u = new URL(url.slice(i), location.origin);
    const method = ((opts && opts.method) || "GET").toUpperCase();
    let body = null;
    if (opts && opts.body) { try { body = JSON.parse(opts.body); } catch { body = {}; } }
    return Promise.resolve()
      .then(() => handle(method, u.pathname, u.searchParams, body))
      .catch((e) => json({ detail: String(e) }, 500));
  };
})();
