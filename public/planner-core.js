/* planner-core.js — Quick PD planners: OAS picker, walkthrough engine, .docx export
   Depends on: oas-standards.js (window.OAS_STANDARDS), docx library loaded on demand.
   No external framework — vanilla DOM.
*/
(function () {
  "use strict";

  // ---------- tiny DOM helper (mirror of app.js el) ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] === true) node.setAttribute(k, "");
        else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
      });
    }
    if (children == null) return node;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c == null || c === false) return;
      if (typeof c === "string" || typeof c === "number") node.appendChild(document.createTextNode(String(c)));
      else node.appendChild(c);
    });
    return node;
  }

  // ---------- OAS subject metadata ----------
  var SUBJECTS = [
    { key: "ELA",           label: "English Language Arts (2021)", url: "https://oklahoma.gov/education/services/standards-learning/english-language-arts.html" },
    { key: "Math",          label: "Mathematics (2022)",           url: "https://oklahoma.gov/education/services/standards-learning/mathematics.html" },
    { key: "Science",       label: "Science (2026)",               url: "https://oklahoma.gov/education/services/standards-learning/science-engineering.html" },
    { key: "SocialStudies", label: "Social Studies (2025)",        url: "https://oklahoma.gov/education/services/standards-learning/social-studies.html" },
    { key: "PFL",           label: "Personal Financial Literacy (2024)", url: "https://oklahoma.gov/education/services/standards-learning/personal-financial-literacy.html" },
    { key: "FineArts_VisualArt", label: "Fine Arts: Visual Art (2023)", url: "https://oklahoma.gov/education/services/standards-learning/fine-arts.html" },
    { key: "FineArts_Music",     label: "Fine Arts: Music — Band & Music Appreciation (2023)", url: "https://oklahoma.gov/education/services/standards-learning/fine-arts.html" },
    { key: "FineArts_MediaArts", label: "Fine Arts: Media Arts (2023)", url: "https://oklahoma.gov/education/services/standards-learning/fine-arts.html" },
    { key: "ComputerScience",    label: "Computer Science (2023)", url: "https://oklahoma.gov/education/services/standards-learning/computer-science.html" },
  ];

  // Sort grades in canonical PK → HS course order
  var GRADE_ORDER = [
    "Pre-Kindergarten", "Kindergarten",
    "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5",
    "Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12",
    "Pre-Algebra","Algebra I","Geometry","Algebra II",
    "Middle School Science","High School","Biology","Chemistry","Physics","Astronomy","Earth Science","Environmental Science",
    "Oklahoma History","United States History","US Government","World Geography",
    "Modern World History","AP World History","Economics","Personal Financial Literacy","Tribal Governments",
    "Proficient (Level I)","Advanced (Level II)","Accomplished (Level III)",
    "Band / Secondary Music — Novice","Band / Secondary Music — Intermediate","Band / Secondary Music — Proficient","Band / Secondary Music — Advanced","Band / Secondary Music — Accomplished",
    "Media — High School (9–12)","Grades 9–10 · Level 1","Grades 11–12 · Level 2",
    "Unspecified",
  ];
  function gradeSort(a, b) {
    var ia = GRADE_ORDER.indexOf(a); if (ia < 0) ia = 999;
    var ib = GRADE_ORDER.indexOf(b); if (ib < 0) ib = 999;
    if (ia !== ib) return ia - ib;
    return a.localeCompare(b);
  }

  function subjectGrades(subjKey) {
    var stds = (window.OAS_STANDARDS && window.OAS_STANDARDS[subjKey]) || [];
    var set = {};
    stds.forEach(function (s) { set[s.grade] = true; });
    return Object.keys(set).sort(gradeSort);
  }
  function gradeStandards(subjKey, grade) {
    var stds = (window.OAS_STANDARDS && window.OAS_STANDARDS[subjKey]) || [];
    return stds.filter(function (s) { return s.grade === grade; });
  }
  function findStandard(subjKey, code) {
    var stds = (window.OAS_STANDARDS && window.OAS_STANDARDS[subjKey]) || [];
    for (var i = 0; i < stds.length; i++) if (stds[i].code === code) return stds[i];
    return null;
  }

  // ---------- Standards Picker widget ----------
  // Renders: [Subject select] [Grade select] [Search input] → list of standards with "Insert" buttons.
  // onInsert(std)  → called when the teacher inserts a standard.
  function standardsPicker(opts) {
    opts = opts || {};
    var wrap = el("div", { class: "std-picker" });

    var controls = el("div", { class: "std-picker-controls" });
    var subjSel = el("select", { class: "std-picker-select", "aria-label": "Subject" });
    SUBJECTS.forEach(function (s) {
      subjSel.appendChild(el("option", { value: s.key }, s.label));
    });
    if (opts.subject) subjSel.value = opts.subject;

    var gradeSel = el("select", { class: "std-picker-select", "aria-label": "Grade or course" });
    var search = el("input", { class: "std-picker-search", type: "search", placeholder: "Search standard code or text…", "aria-label": "Search standards" });

    controls.appendChild(el("label", { class: "std-picker-label" }, [el("span", {}, "Subject"), subjSel]));
    controls.appendChild(el("label", { class: "std-picker-label" }, [el("span", {}, "Grade or course"), gradeSel]));
    controls.appendChild(el("label", { class: "std-picker-label std-picker-label-wide" }, [el("span", {}, "Search"), search]));

    var list = el("div", { class: "std-picker-list" });
    var meta = el("div", { class: "std-picker-meta" });

    function repopulateGrades() {
      var grades = subjectGrades(subjSel.value);
      gradeSel.innerHTML = "";
      grades.forEach(function (g) { gradeSel.appendChild(el("option", { value: g }, g)); });
      // Preserve grade preference
      if (opts.grade && grades.indexOf(opts.grade) !== -1) gradeSel.value = opts.grade;
    }
    function renderList() {
      var q = (search.value || "").trim().toLowerCase();
      var stds = gradeStandards(subjSel.value, gradeSel.value);
      if (q) {
        stds = stds.filter(function (s) {
          return s.code.toLowerCase().indexOf(q) !== -1 || s.text.toLowerCase().indexOf(q) !== -1;
        });
      }
      list.innerHTML = "";
      meta.textContent = stds.length + " standard" + (stds.length === 1 ? "" : "s") + " shown";
      if (!stds.length) {
        list.appendChild(el("div", { class: "std-picker-empty" }, "No standards match. Try a different grade or clear the search."));
        return;
      }
      stds.slice(0, 200).forEach(function (s) {
        var row = el("div", { class: "std-picker-row" }, [
          el("div", { class: "std-picker-row-code" }, s.code),
          el("div", { class: "std-picker-row-text" }, s.text),
          el("button", {
            type: "button", class: "btn btn-sm",
            onclick: function () {
              if (typeof opts.onInsert === "function") {
                opts.onInsert({ subject: subjSel.value, grade: gradeSel.value, code: s.code, text: s.text });
              }
            }
          }, opts.insertLabel || "Insert"),
        ]);
        list.appendChild(row);
      });
      if (stds.length > 200) {
        list.appendChild(el("div", { class: "std-picker-meta" }, "Showing first 200. Refine your search to narrow."));
      }
    }
    subjSel.addEventListener("change", function () { repopulateGrades(); renderList(); });
    gradeSel.addEventListener("change", renderList);
    search.addEventListener("input", renderList);

    repopulateGrades();
    renderList();

    wrap.appendChild(controls);
    wrap.appendChild(meta);
    wrap.appendChild(list);
    return wrap;
  }

  // ---------- Strategy picker (all 192 Tier 1 strategies from data.js) ----------
  function allStrategies() {
    var data = (window.QPD_DATA && window.QPD_DATA.strategies) || null;
    if (!data || !Array.isArray(data.groups)) return [];
    var out = [];
    data.groups.forEach(function (g) {
      (g.items || []).forEach(function (s) {
        out.push({
          id: s.id,
          title: s.title,
          description: s.description || "",
          group: g.label,
          subjects: s.subjects || [],
          grades: s.grades || [],
          toolkitUrl: s.toolkitUrl || "",
        });
      });
    });
    return out;
  }

  function strategyGroups() {
    var data = (window.QPD_DATA && window.QPD_DATA.strategies) || null;
    if (!data || !Array.isArray(data.groups)) return [];
    return data.groups.map(function (g) { return { label: g.label, count: (g.items || []).length }; });
  }

  // Compact chip-list for chosen strategies. Uses `data-list` so collectFields
  // picks up the JSON payload the same way it does for standardsList.
  function strategyList(fieldName, initial) {
    var items = (initial || []).slice();
    var wrap = el("div", { class: "std-list-wrap strat-list-wrap", "data-list": fieldName });

    function persist() {
      wrap.setAttribute("data-list-value", JSON.stringify(items));
    }
    function render() {
      wrap.innerHTML = "";
      if (!items.length) {
        wrap.appendChild(el("div", { class: "std-list-empty" }, "No strategies pulled in yet. Use the picker below to browse all 192 Tier 1 strategies."));
      } else {
        items.forEach(function (s, i) {
          var chip = el("div", { class: "std-list-chip strat-list-chip" }, [
            el("div", { class: "std-list-chip-code strat-list-chip-title" }, s.title),
            el("div", { class: "std-list-chip-text strat-list-chip-desc" }, s.description || ""),
            el("div", { class: "std-list-chip-meta" }, s.group || ""),
            el("button", {
              type: "button", class: "std-list-chip-x", "aria-label": "Remove strategy",
              onclick: function () { items.splice(i, 1); render(); persist(); },
            }, "×"),
          ]);
          if (s.toolkitUrl) {
            chip.appendChild(el("a", { class: "strat-list-chip-link", href: s.toolkitUrl, target: "_blank", rel: "noopener" }, "Open in live Toolkit →"));
          }
          wrap.appendChild(chip);
        });
      }
      persist();
    }
    function add(s) {
      if (!s || !s.title) return;
      for (var i = 0; i < items.length; i++) {
        if ((s.id && items[i].id === s.id) || items[i].title === s.title) return;
      }
      items.push({
        id: s.id || null,
        title: s.title,
        description: s.description || "",
        group: s.group || "",
        toolkitUrl: s.toolkitUrl || "",
      });
      render();
    }
    render();
    return { el: wrap, add: add, get: function () { return items.slice(); } };
  }

  function strategyPicker(opts) {
    opts = opts || {};
    var wrap = el("div", { class: "std-picker strat-picker" });
    var controls = el("div", { class: "std-picker-controls" });

    var groups = strategyGroups();
    var groupSel = el("select", { class: "std-picker-select", "aria-label": "Strategy group" });
    groupSel.appendChild(el("option", { value: "__ALL__" }, "All groups (" + allStrategies().length + ")"));
    groups.forEach(function (g) {
      groupSel.appendChild(el("option", { value: g.label }, g.label + " (" + g.count + ")"));
    });
    if (opts.group && groups.some(function (g) { return g.label === opts.group; })) groupSel.value = opts.group;

    var search = el("input", {
      class: "std-picker-search",
      type: "search",
      placeholder: "Search strategy name or description…",
      "aria-label": "Search strategies",
    });

    controls.appendChild(el("label", { class: "std-picker-label" }, [el("span", {}, "Group"), groupSel]));
    controls.appendChild(el("label", { class: "std-picker-label std-picker-label-wide" }, [el("span", {}, "Search"), search]));

    var list = el("div", { class: "std-picker-list strat-picker-list" });
    var meta = el("div", { class: "std-picker-meta" });

    function renderList() {
      var q = (search.value || "").trim().toLowerCase();
      var g = groupSel.value;
      var pool = allStrategies();
      if (g && g !== "__ALL__") pool = pool.filter(function (s) { return s.group === g; });
      if (q) {
        pool = pool.filter(function (s) {
          return s.title.toLowerCase().indexOf(q) !== -1
              || (s.description || "").toLowerCase().indexOf(q) !== -1;
        });
      }
      list.innerHTML = "";
      meta.textContent = pool.length + " strateg" + (pool.length === 1 ? "y" : "ies") + " shown";
      if (!pool.length) {
        list.appendChild(el("div", { class: "std-picker-empty" }, "No strategies match. Try a different group or clear the search."));
        return;
      }
      pool.slice(0, 150).forEach(function (s) {
        var short = (s.description || "").split(/\s+/).slice(0, 22).join(" ");
        if ((s.description || "").split(/\s+/).length > 22) short += "…";
        var row = el("div", { class: "std-picker-row strat-picker-row" }, [
          el("div", { class: "std-picker-row-code strat-picker-row-title" }, s.title),
          el("div", { class: "std-picker-row-text" }, [
            el("span", { class: "strat-picker-row-group" }, s.group),
            (short ? el("span", { class: "strat-picker-row-desc" }, " — " + short) : el("span", {})),
          ]),
          el("button", {
            type: "button", class: "btn btn-sm",
            onclick: function () {
              if (typeof opts.onInsert === "function") {
                opts.onInsert({
                  id: s.id, title: s.title, description: s.description,
                  group: s.group, toolkitUrl: s.toolkitUrl,
                });
              }
            }
          }, opts.insertLabel || "Pull into plan"),
        ]);
        list.appendChild(row);
      });
      if (pool.length > 150) {
        list.appendChild(el("div", { class: "std-picker-meta" }, "Showing first 150. Refine your search to narrow."));
      }
    }
    groupSel.addEventListener("change", renderList);
    search.addEventListener("input", renderList);
    renderList();

    wrap.appendChild(controls);
    wrap.appendChild(meta);
    wrap.appendChild(list);
    return wrap;
  }

  // ---------- Walkthrough engine ----------
  // Renders a fixed-position "Step X of N" callout with prev/next/close, tied to element ids.
  // steps = [{id: 'q1', title: 'Question 1', body: '...'}]
  function attachWalkthrough(container, steps, opts) {
    opts = opts || {};
    var idx = 0;
    var pill = el("div", { class: "walk-pill", role: "dialog", "aria-label": "Walk-through" });

    function highlight(on) {
      var s = steps[idx];
      var target = s && s.id ? document.getElementById(s.id) : null;
      // Clear previous highlights
      Array.prototype.forEach.call(document.querySelectorAll(".walk-highlight"), function (n) { n.classList.remove("walk-highlight"); });
      if (on && target) {
        target.classList.add("walk-highlight");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    function render() {
      var s = steps[idx];
      pill.innerHTML = "";
      pill.appendChild(el("div", { class: "walk-pill-count" }, "Step " + (idx + 1) + " of " + steps.length));
      pill.appendChild(el("div", { class: "walk-pill-title" }, s.title));
      pill.appendChild(el("div", { class: "walk-pill-body" }, s.body));
      var row = el("div", { class: "walk-pill-actions" }, [
        el("button", {
          type: "button", class: "btn btn-sm btn-ghost",
          disabled: idx === 0,
          onclick: function () { if (idx > 0) { idx--; render(); highlight(true); } }
        }, "Back"),
        el("button", {
          type: "button", class: "btn btn-sm",
          onclick: function () {
            if (idx < steps.length - 1) { idx++; render(); highlight(true); }
            else { close(); }
          }
        }, idx === steps.length - 1 ? "Finish" : "Next"),
      ]);
      pill.appendChild(row);
      pill.appendChild(el("button", {
        type: "button", class: "walk-pill-close", "aria-label": "Close walk-through",
        onclick: close,
      }, "×"));
    }
    function close() {
      highlight(false);
      if (pill.parentNode) pill.parentNode.removeChild(pill);
    }
    function open() {
      if (!pill.parentNode) document.body.appendChild(pill);
      render();
      highlight(true);
    }

    var openBtn = el("button", { type: "button", class: "btn btn-walk", onclick: open },
      opts.buttonLabel || "▶ Start step-by-step walk-through");
    container.appendChild(openBtn);
    return { open: open, close: close };
  }

  // ---------- Persistent draft (auto-save to localStorage per plan type) ----------
  function saveDraft(key, state) {
    try { localStorage.setItem("quickpd:plan:" + key, JSON.stringify(state)); } catch (e) {}
  }
  function loadDraft(key) {
    try {
      var raw = localStorage.getItem("quickpd:plan:" + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearDraft(key) {
    try { localStorage.removeItem("quickpd:plan:" + key); } catch (e) {}
  }

  // ---------- .docx generator (loaded from CDN on demand) ----------
  var docxLibPromise = null;
  function loadDocxLib() {
    if (docxLibPromise) return docxLibPromise;
    docxLibPromise = new Promise(function (resolve, reject) {
      // docx.js UMD build - browser bundle
      var s = document.createElement("script");
      s.src = "./vendor/docx.umd.min.js"; // bundled with the site (no internet dependency)
      s.onload = function () { resolve(window.docx); };
      s.onerror = function () {
        // Fallback to the CDN copy if the local file is missing
        var c = document.createElement("script");
        c.src = "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js";
        c.onload = function () { resolve(window.docx); };
        c.onerror = function () { reject(new Error("Failed to load docx library")); };
        document.head.appendChild(c);
      };
      document.head.appendChild(s);
    });
    return docxLibPromise;
  }

  var NAVY = "0A2540", GOLD = "BC9124", CREAM = "FAF7EF", TEXT = "1F2937", MUTED = "4B5563";

  // Build a .docx from a simple spec: [{h1|h2|h3|p|label:value|bullets|hr|standard|table}, ...]
  // Table entry: { table: [[cell,cell],[cell,cell]], headers?: [c,c] }
  function buildDocx(title, blocks) {
    return loadDocxLib().then(function (d) {
      var Paragraph = d.Paragraph, TextRun = d.TextRun, HeadingLevel = d.HeadingLevel;
      var Table = d.Table, TableRow = d.TableRow, TableCell = d.TableCell;
      var AlignmentType = d.AlignmentType, WidthType = d.WidthType, BorderStyle = d.BorderStyle;

      var children = [];

      // Title bar
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: title, bold: true, color: NAVY, size: 40 })],
        spacing: { after: 200 },
      }));

      function pRun(text, opts) {
        opts = opts || {};
        return new Paragraph({
          spacing: { after: opts.after != null ? opts.after : 120 },
          children: [new TextRun({
            text: text || "",
            bold: !!opts.bold, italics: !!opts.italics,
            color: opts.color || TEXT, size: opts.size || 22,
          })],
        });
      }
      function pMulti(runs, spacing) {
        return new Paragraph({ spacing: { after: spacing != null ? spacing : 120 }, children: runs });
      }

      blocks.forEach(function (b) {
        if (!b) return;
        if (b.h1) children.push(new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: b.h1, bold: true, color: NAVY, size: 32 })],
          spacing: { before: 240, after: 120 },
        }));
        else if (b.h2) children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: b.h2, bold: true, color: NAVY, size: 28 })],
          spacing: { before: 240, after: 100 },
        }));
        else if (b.h3) children.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun({ text: b.h3, bold: true, color: GOLD, size: 24 })],
          spacing: { before: 200, after: 80 },
        }));
        else if (b.p) children.push(pRun(b.p, b.opts));
        else if (b.italic) children.push(pRun(b.italic, { italics: true, color: MUTED, size: 20 }));
        else if (b.label != null) children.push(pMulti([
          new TextRun({ text: b.label + ": ", bold: true, color: NAVY, size: 22 }),
          new TextRun({ text: b.value || "—", color: TEXT, size: 22 }),
        ], 100));
        else if (b.bullets) b.bullets.forEach(function (line) {
          children.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: line, size: 22, color: TEXT })],
            spacing: { after: 60 },
          }));
        });
        else if (b.hr) children.push(new Paragraph({
          spacing: { before: 60, after: 60 },
          border: { bottom: { color: "D1D5DB", size: 6, style: BorderStyle.SINGLE, space: 1 } },
        }));
        else if (b.standard) {
          // { standard: {code, text, grade, subject} }
          var s = b.standard;
          children.push(pMulti([
            new TextRun({ text: s.code + " ", bold: true, color: GOLD, size: 22 }),
            new TextRun({ text: "(" + (s.subject || "") + " · " + (s.grade || "") + ")  ", italics: true, color: MUTED, size: 20 }),
            new TextRun({ text: s.text || "", color: TEXT, size: 22 }),
          ], 120));
        }
        else if (b.strategy) {
          // { strategy: {title, group, description, toolkitUrl} }
          var t = b.strategy;
          children.push(pMulti([
            new TextRun({ text: t.title || "", bold: true, color: GOLD, size: 22 }),
            (t.group ? new TextRun({ text: "  (" + t.group + ")", italics: true, color: MUTED, size: 20 }) : new TextRun({ text: "" })),
          ], 60));
          if (t.description) {
            children.push(pMulti([new TextRun({ text: t.description, color: TEXT, size: 22 })], 60));
          }
          if (t.toolkitUrl) {
            children.push(pMulti([
              new TextRun({ text: "Live Toolkit: ", italics: true, color: MUTED, size: 20 }),
              new TextRun({ text: t.toolkitUrl, color: "1D4ED8", size: 20, underline: {} }),
            ], 160));
          } else {
            children.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
          }
        }
        else if (b.table) {
          var rows = [];
          if (b.headers) {
            rows.push(new TableRow({
              tableHeader: true,
              children: b.headers.map(function (h) {
                return new TableCell({
                  shading: { fill: NAVY },
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 22 })] })],
                });
              }),
            }));
          }
          b.table.forEach(function (r) {
            rows.push(new TableRow({
              children: r.map(function (c) {
                var text = c == null ? "" : String(c);
                return new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: text, size: 22 })] })],
                });
              }),
            }));
          });
          children.push(new Table({ rows: rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
          children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
        }
      });

      // Footer
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [new TextRun({
          text: "Wewoka High School · Quick PD · " + new Date().toLocaleDateString(),
          italics: true, color: MUTED, size: 18,
        })],
      }));

      var doc = new d.Document({ sections: [{ properties: {}, children: children }] });
      return d.Packer.toBlob(doc);
    });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }

  // ---------- Form field helpers ----------
  function textInput(id, placeholder, value, opts) {
    opts = opts || {};
    return el("input", {
      type: opts.type || "text", id: id, class: "form-input",
      placeholder: placeholder || "", value: value == null ? "" : value,
      "data-field": id,
    });
  }
  function textArea(id, placeholder, value, rows) {
    return el("textarea", {
      id: id, class: "form-textarea", rows: rows || 3,
      placeholder: placeholder || "", "data-field": id,
    }, value == null ? "" : value);
  }
  function fieldLabel(text, forId, helper) {
    var wrap = el("label", { class: "form-label", for: forId }, [
      el("span", { class: "form-label-text" }, text),
    ]);
    if (helper) wrap.appendChild(el("span", { class: "form-label-helper" }, helper));
    return wrap;
  }
  function field(id, labelText, helper, input) {
    return el("div", { class: "form-field", id: "field-" + id }, [
      fieldLabel(labelText, id, helper),
      input,
    ]);
  }

  // Collect all fields under a container into a state object
  function collectFields(container) {
    var state = {};
    Array.prototype.forEach.call(container.querySelectorAll("[data-field]"), function (n) {
      state[n.getAttribute("data-field")] = n.value;
    });
    // Also collect chip lists / standard lists (stored on the element)
    Array.prototype.forEach.call(container.querySelectorAll("[data-list]"), function (n) {
      state[n.getAttribute("data-list")] = JSON.parse(n.getAttribute("data-list-value") || "[]");
    });
    return state;
  }
  function populateFields(container, state) {
    if (!state) return;
    Array.prototype.forEach.call(container.querySelectorAll("[data-field]"), function (n) {
      var k = n.getAttribute("data-field");
      if (state[k] != null) n.value = state[k];
    });
  }

  // ---------- Standards list widget (for use inside a form) ----------
  // Holds a list of {code, text, subject, grade} standards attached to a plan.
  function standardsList(fieldName, initial) {
    var items = initial ? initial.slice() : [];
    var wrap = el("div", { class: "std-list-wrap", "data-list": fieldName });

    function persist() {
      wrap.setAttribute("data-list-value", JSON.stringify(items));
    }
    function render() {
      wrap.innerHTML = "";
      if (!items.length) {
        wrap.appendChild(el("div", { class: "std-list-empty" }, "No standards added yet. Use the picker below to add one."));
      } else {
        items.forEach(function (s, i) {
          wrap.appendChild(el("div", { class: "std-list-chip" }, [
            el("div", { class: "std-list-chip-code" }, s.code),
            el("div", { class: "std-list-chip-text" }, s.text),
            el("div", { class: "std-list-chip-meta" }, (s.subject || "") + " · " + (s.grade || "")),
            el("button", {
              type: "button", class: "std-list-chip-x", "aria-label": "Remove",
              onclick: function () { items.splice(i, 1); render(); persist(); },
            }, "×"),
          ]));
        });
      }
      persist();
    }
    function add(s) {
      // Prevent dupes
      for (var i = 0; i < items.length; i++) if (items[i].code === s.code) return;
      items.push(s); render();
    }
    render();
    return { el: wrap, add: add, get: function () { return items.slice(); } };
  }

  // ---------- Public API ----------
  window.PlannerCore = {
    el: el,
    SUBJECTS: SUBJECTS,
    subjectGrades: subjectGrades,
    gradeStandards: gradeStandards,
    findStandard: findStandard,
    standardsPicker: standardsPicker,
    standardsList: standardsList,
    strategyPicker: strategyPicker,
    strategyList: strategyList,
    allStrategies: allStrategies,
    strategyGroups: strategyGroups,
    attachWalkthrough: attachWalkthrough,
    saveDraft: saveDraft,
    loadDraft: loadDraft,
    clearDraft: clearDraft,
    buildDocx: buildDocx,
    downloadBlob: downloadBlob,
    textInput: textInput,
    textArea: textArea,
    fieldLabel: fieldLabel,
    field: field,
    collectFields: collectFields,
    populateFields: populateFields,
  };
})();
