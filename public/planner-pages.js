/* planner-pages.js — Renderers for OAS Standards + Weekly / Unit / Daily plan pages.
   Depends on: planner-core.js (window.PlannerCore).
   Exports render functions onto window.PlannerPages for app.js to route to.
*/
(function () {
  "use strict";
  var PC = window.PlannerCore;
  var el = PC.el;

  var TOOLKIT_BASE = "https://we-town-tier1-toolkit.pplx.app";

  function hubBanner() {
    var d = document.createElement("div");
    d.className = "hub-banner";
    d.innerHTML =
      '<strong>The Turner Instructional Toolkit.</strong> Short, teacher-facing PD you can watch between bells. Every planner here is teacher-owned and portable — your work stays with you.';
    return d;
  }

  function actionBar(items) {
    return el("div", { class: "planner-actions" }, items);
  }

  function downloadDocxBtn(label, filenameFn, buildFn) {
    return el("button", {
      type: "button", class: "btn btn-primary",
      onclick: function (ev) {
        var btn = ev.currentTarget;
        var originalText = btn.textContent;
        btn.disabled = true; btn.textContent = "Preparing…";
        Promise.resolve()
          .then(buildFn)
          .then(function (result) {
            return PC.buildDocx(result.title, result.blocks).then(function (blob) {
              PC.downloadBlob(blob, filenameFn());
            });
          })
          .catch(function (err) {
            console.error(err);
            alert("Sorry — could not build the Word file. " + (err && err.message ? err.message : ""));
          })
          .then(function () { btn.disabled = false; btn.textContent = originalText; });
      },
    }, label);
  }

  // Print current page
  function printBtn(label) {
    return el("button", { type: "button", class: "btn", onclick: function () { window.print(); } }, label || "Print");
  }

  // ---------- OAS STANDARDS PAGE ----------
  function renderStandards() {
    var frag = document.createDocumentFragment();
    
    frag.appendChild(el("h1", { class: "page-title" }, "Oklahoma Academic Standards"));
    frag.appendChild(el("p", { class: "page-lede" },
      "Search and browse the current Oklahoma Academic Standards for ELA (2021), Math (2022), Science (2026), and Social Studies (2025) — pulled straight from the state PDFs at oklahoma.gov. Use this before writing lesson objectives, breaking down a standard, or filling in Question 1 of a weekly plan."));

    var card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, "Standards library"));
    card.appendChild(el("p", { class: "card-desc" },
      "Pick a subject and grade or course, then filter with search. Click a standard's code to copy it — or use the Weekly / Unit / Daily planners to insert it directly into a plan."));

    var picker = PC.standardsPicker({
      subject: "ELA", grade: "Grade 9",
      insertLabel: "Copy code",
      onInsert: function (s) {
        // "Insert" from the standalone page → copy the code to clipboard
        try {
          navigator.clipboard.writeText(s.code + "  " + s.text);
          toast("Copied " + s.code + " to your clipboard");
        } catch (e) {
          toast("Selected " + s.code);
        }
      },
    });
    card.appendChild(picker);
    frag.appendChild(card);

    // Sources card
    var sourceCard = el("div", { class: "card" });
    sourceCard.appendChild(el("div", { class: "card-title" }, "Official state sources"));
    sourceCard.appendChild(el("p", { class: "card-desc" }, "Full state PDFs, in case you need alternate formats, appendices, or verbatim front-matter:"));
    var src = el("ul", { class: "sources-list" });
    [
      { name: "ELA — Oklahoma Academic Standards (2021)", url: "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/english-language-arts/ela-standards/2021%20Oklahoma%20Academic%20Standards%20for%20English%20Language%20Arts.pdf" },
      { name: "Math — Oklahoma Academic Standards (2022)", url: "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/mathematics/2022%20OAS%20Math.pdf" },
      { name: "Science — Oklahoma Academic Standards (2026)", url: "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/science-engineering/Final%202026%20OAS-S.pdf" },
      { name: "Social Studies — Oklahoma Academic Standards (2025)", url: "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/social-studies/Final%202025%20SS%20OAS.pdf" },
      { name: "Standards landing page (Oklahoma State Department of Education)", url: "https://oklahoma.gov/education/services/standards-learning/oklahoma-academic-standards.html" },
    ].forEach(function (item) {
      src.appendChild(el("li", {}, [
        el("a", { href: item.url, target: "_blank", rel: "noopener" }, item.name + " ↗"),
      ]));
    });
    sourceCard.appendChild(src);
    frag.appendChild(sourceCard);

    // Jump to planners
    var jump = el("div", { class: "card" });
    jump.appendChild(el("div", { class: "card-title" }, "Take a standard into a plan"));
    jump.appendChild(el("p", { class: "card-desc" }, "Each planner has the same picker built in — you don't have to copy anything. Pick where you're going next:"));
    jump.appendChild(el("div", { class: "button-row" }, [
      el("a", { class: "btn", href: "#/weekly-plan" }, "Open Weekly Plan"),
      el("a", { class: "btn", href: "#/unit-plan" }, "Open Unit Plan"),
      el("a", { class: "btn", href: "#/daily-plan" }, "Open Daily Plan"),
    ]));
    frag.appendChild(jump);

    return frag;
  }

  // ---------- Toast helper ----------
  function toast(msg) {
    var t = el("div", { class: "toast" }, msg);
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("toast-show"); }, 10);
    setTimeout(function () { t.classList.remove("toast-show"); }, 2200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
  }

  // ---------- WEEKLY PLAN PAGE ----------
  function renderWeeklyPlan() {
    var DRAFT_KEY = "weekly";
    var frag = document.createDocumentFragment();
    
    frag.appendChild(el("h1", { class: "page-title" }, "Weekly Plan"));
    frag.appendChild(el("p", { class: "page-lede" },
      "The WHS Weekly Lesson Plan — built on the four PLC critical questions, a Monday–Friday daily-checks grid, literacy across the curriculum, and a PLC handoff. Fill it in, walk through it step by step, then download as a Word file for your PLC binder."));

    var form = el("form", { class: "planner-form", onsubmit: function (e) { e.preventDefault(); } });

    // Header fields
    var header = el("div", { class: "form-grid form-grid-3", id: "wp-header" }, [
      PC.field("wp-teacher", "Teacher", null, PC.textInput("wp-teacher", "Ms. Turner")),
      PC.field("wp-course",  "Course",  null, PC.textInput("wp-course",  "Algebra I")),
      PC.field("wp-period",  "Period",  null, PC.textInput("wp-period",  "3rd")),
      PC.field("wp-weekof",  "Week of", null, PC.textInput("wp-weekof",  "", "", { type: "date" })),
      PC.field("wp-coteacher","Co-teacher / notes", null, PC.textInput("wp-coteacher", "Optional")),
    ]);
    form.appendChild(header);

    // Question 1
    var q1Std = PC.standardsList("wp-q1-standards", []);
    var q1 = el("section", { class: "form-section", id: "wp-q1" }, [
      el("h2", { class: "section-title" }, "Question 1: What do we want students to learn?"),
      el("p", { class: "section-lede" }, "Written first. Copy the priority Oklahoma standard from the picker, then translate it into a student-friendly learning target and success criteria."),
      PC.field("wp-q1-standards-wrap", "Priority Oklahoma standard(s)",
        "Search a subject and grade, then click Insert to add.",
        q1Std.el),
      PC.standardsPicker({ subject: "Math", grade: "Algebra I", insertLabel: "Insert", onInsert: q1Std.add }),
      PC.field("wp-q1-target", "Student-friendly learning target",
        "Written as an \"I can\" statement students can read.",
        PC.textArea("wp-q1-target", "I can …", "", 2)),
      PC.field("wp-q1-success", "Success criteria",
        "Two or three observable indicators — what students will do or produce.",
        PC.textArea("wp-q1-success", "Students will …", "", 3)),
    ]);
    form.appendChild(q1);

    // Question 2
    var q2 = el("section", { class: "form-section", id: "wp-q2" }, [
      el("h2", { class: "section-title" }, "Question 2: How will we know they learned it?"),
      el("p", { class: "section-lede" }, "Diagnostic before instruction. One common formative assessment this week, scored the same way by every teacher on the team."),
      PC.field("wp-q2-diag",   "Diagnostic check (before teaching)", "How you'll know what students already do and don't know before Monday.", PC.textArea("wp-q2-diag", "", "", 3)),
      PC.field("wp-q2-cfa",    "Common formative assessment",       "The mid-week check every team member gives.", PC.textArea("wp-q2-cfa", "", "", 3)),
      PC.field("wp-q2-scoring","Scoring / calibration",             "What counts as proficient. Same rubric across the team.", PC.textArea("wp-q2-scoring", "", "", 2)),
    ]);
    form.appendChild(q2);

    // Question 3
    var q3 = el("section", { class: "form-section", id: "wp-q3" }, [
      el("h2", { class: "section-title" }, "Question 3: What will we do if they don't learn it?"),
      el("p", { class: "section-lede" }, "Named students, named piece, named time, named recheck. Not \"review as needed.\""),
      PC.field("wp-q3-who",     "Who",     "Named students, and the specific criterion that flagged them.", PC.textArea("wp-q3-who", "", "", 2)),
      PC.field("wp-q3-what",    "What",    "The exact skill or concept being re-taught.", PC.textArea("wp-q3-what", "", "", 2)),
      PC.field("wp-q3-when",    "When",    "The block of time this reteach happens (day, period, minutes).", PC.textArea("wp-q3-when", "", "", 2)),
      PC.field("wp-q3-recheck", "Recheck", "How and when you'll know it worked.", PC.textArea("wp-q3-recheck", "", "", 2)),
    ]);
    form.appendChild(q3);

    // Question 4
    var q4 = el("section", { class: "form-section", id: "wp-q4" }, [
      el("h2", { class: "section-title" }, "Question 4: What will we do if they already know it?"),
      el("p", { class: "section-lede" }, "A real extension, not more of the same worksheet."),
      PC.field("wp-q4-who",  "Who",  "Students proficient before the rest of the class.", PC.textArea("wp-q4-who", "", "", 2)),
      PC.field("wp-q4-what", "What", "A genuine extension task — application, transfer, or deeper analysis.", PC.textArea("wp-q4-what", "", "", 2)),
      PC.field("wp-q4-when", "When", "When the extension happens.", PC.textArea("wp-q4-when", "", "", 2)),
    ]);
    form.appendChild(q4);

    // Daily checks Mon-Fri
    var daily = el("section", { class: "form-section", id: "wp-daily" }, [
      el("h2", { class: "section-title" }, "Monday–Friday daily checks for understanding"),
      el("p", { class: "section-lede" }, "One quick check each day — an exit ticket, a whiteboard signal, a targeted question. Enough to tell you what to do tomorrow."),
    ]);
    ["Mon","Tue","Wed","Thu","Fri"].forEach(function (day) {
      var fullName = { Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday" }[day];
      daily.appendChild(PC.field("wp-day-" + day, fullName, "Today's check for understanding and what it tells you.", PC.textArea("wp-day-" + day, "", "", 3)));
    });
    form.appendChild(daily);

    // Literacy across curriculum + Tier 1 strategy picker
    var wpStrats = PC.strategyList("wp-strategies", []);
    var lit = el("section", { class: "form-section", id: "wp-literacy" }, [
      el("h2", { class: "section-title" }, "Reading & writing across the curriculum"),
      el("p", { class: "section-lede" }, "Every student reads text worth thinking about and writes an evidence-based response — every class, every day."),
      PC.field("wp-lit-text",   "Text students will read", "Title, source, and rough length.", PC.textArea("wp-lit-text", "", "", 2)),
      PC.field("wp-lit-prompt", "Writing prompt",           "The evidence-based response you're asking for.", PC.textArea("wp-lit-prompt", "", "", 2)),
      PC.field("wp-strategies-wrap", "Tier 1 strategies pulled into this week",
        "Pull any of the 192 Tier 1 strategies from the library below — name, description, and Toolkit link travel with the plan.",
        wpStrats.el),
      PC.strategyPicker({ insertLabel: "Pull into plan", onInsert: wpStrats.add }),
    ]);
    form.appendChild(lit);

    // PLC handoff
    var handoff = el("section", { class: "form-section", id: "wp-handoff" }, [
      el("h2", { class: "section-title" }, "PLC handoff — bring to Monday"),
      el("p", { class: "section-lede" }, "What you're bringing to the next PLC. One insight, one problem, one ask."),
      PC.field("wp-handoff-insight", "One insight from this week", "Something a formative check told you.", PC.textArea("wp-handoff-insight", "", "", 2)),
      PC.field("wp-handoff-problem", "One problem you're still stuck on", "Where the data isn't moving.", PC.textArea("wp-handoff-problem", "", "", 2)),
      PC.field("wp-handoff-ask",     "One thing you need from the team", "Coaching, resources, calibration, or a fresh set of eyes.", PC.textArea("wp-handoff-ask", "", "", 2)),
    ]);
    form.appendChild(handoff);

    frag.appendChild(form);

    // Walk-through
    var walkContainer = el("div", { class: "walk-launcher" });
    PC.attachWalkthrough(walkContainer, [
      { id: "wp-header", title: "Start with the basics", body: "Fill in the teacher, course, period, and week — it prints at the top and is used in the exported Word file." },
      { id: "wp-q1", title: "Question 1 — What do we want students to learn?", body: "Pick your priority Oklahoma standard from the picker, then translate it into a student-friendly \"I can\" statement and observable success criteria." },
      { id: "wp-q2", title: "Question 2 — How will we know?", body: "One diagnostic before you teach, one common formative check during the week, and a shared rubric so the whole team scores it the same way." },
      { id: "wp-q3", title: "Question 3 — What if they don't learn it?", body: "Name the students, the piece, the time, and the recheck. \"Review as needed\" is not a plan." },
      { id: "wp-q4", title: "Question 4 — What if they already know it?", body: "A real extension — application or transfer — not more of the same worksheet." },
      { id: "wp-daily", title: "Daily checks", body: "One quick check each day. Enough to tell you what to do tomorrow." },
      { id: "wp-literacy", title: "Reading & writing across the curriculum", body: "Every student reads text worth thinking about and writes an evidence-based response, in every class, every day." },
      { id: "wp-handoff", title: "PLC handoff", body: "One insight, one problem, one ask. This is what you bring to Monday's PLC." },
    ]);
    frag.appendChild(walkContainer);

    // Actions
    frag.appendChild(actionBar([
      downloadDocxBtn("⬇ Download as Word (.docx)", function () {
        var st = PC.collectFields(form);
        var teacher = st["wp-teacher"] || "Teacher";
        var course = st["wp-course"] || "Course";
        var wk = st["wp-weekof"] || "";
        var wkPart = wk ? "-week-of-" + wk : "";
        return "WHS-Weekly-Plan-" + slug(teacher) + "-" + slug(course) + wkPart + ".docx";
      }, function () { return buildWeeklyDocx(form); }),
      printBtn("Print this plan"),
      el("button", { type: "button", class: "btn btn-ghost", onclick: function () {
        if (confirm("Clear this weekly plan? Your saved draft will be erased.")) {
          PC.clearDraft(DRAFT_KEY);
          location.reload();
        }
      } }, "Clear draft"),
      el("div", { class: "planner-actions-note" }, "This plan auto-saves to your browser as you type. Use \"Download as Word\" to keep a permanent copy for your PLC binder."),
    ]));

    // Restore draft & wire auto-save
    var saved = PC.loadDraft(DRAFT_KEY);
    if (saved) PC.populateFields(form, saved);
    var saveTimer;
    form.addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { PC.saveDraft(DRAFT_KEY, PC.collectFields(form)); }, 400);
    });

    return frag;
  }

  function buildWeeklyDocx(form) {
    var st = PC.collectFields(form);
    var teacher = st["wp-teacher"] || "";
    var course = st["wp-course"] || "";
    var period = st["wp-period"] ? "Period " + st["wp-period"] : "";
    var wk = st["wp-weekof"] || "";
    var wkLabel = wk ? formatDate(wk) : "";
    var subtitle = [teacher, course, period].filter(Boolean).join(" · ") +
      (wkLabel ? "  ·  Week of " + wkLabel : "");

    var blocks = [];
    blocks.push({ italic: "Weekly plan built on the four critical questions." });
    if (subtitle.trim()) blocks.push({ p: subtitle, opts: { size: 20, color: "4B5563" } });
    if (st["wp-coteacher"]) blocks.push({ label: "Co-teacher / notes", value: st["wp-coteacher"] });

    var stds = st["wp-q1-standards"] || [];
    blocks.push({ hr: true });
    blocks.push({ h2: "Question 1 — What do we want students to learn?" });
    if (stds.length) {
      blocks.push({ p: "Priority Oklahoma standards:", opts: { bold: true } });
      stds.forEach(function (s) { blocks.push({ standard: s }); });
    } else {
      blocks.push({ label: "Priority Oklahoma standard", value: "—" });
    }
    blocks.push({ label: "Student-friendly learning target", value: st["wp-q1-target"] });
    blocks.push({ label: "Success criteria",                 value: st["wp-q1-success"] });

    blocks.push({ hr: true });
    blocks.push({ h2: "Question 2 — How will we know they learned it?" });
    blocks.push({ label: "Diagnostic check (before teaching)", value: st["wp-q2-diag"] });
    blocks.push({ label: "Common formative assessment",         value: st["wp-q2-cfa"] });
    blocks.push({ label: "Scoring / calibration",               value: st["wp-q2-scoring"] });

    blocks.push({ hr: true });
    blocks.push({ h2: "Question 3 — What will we do if they don't learn it?" });
    blocks.push({ label: "Who",     value: st["wp-q3-who"] });
    blocks.push({ label: "What",    value: st["wp-q3-what"] });
    blocks.push({ label: "When",    value: st["wp-q3-when"] });
    blocks.push({ label: "Recheck", value: st["wp-q3-recheck"] });

    blocks.push({ hr: true });
    blocks.push({ h2: "Question 4 — What will we do if they already know it?" });
    blocks.push({ label: "Who",  value: st["wp-q4-who"] });
    blocks.push({ label: "What", value: st["wp-q4-what"] });
    blocks.push({ label: "When", value: st["wp-q4-when"] });

    blocks.push({ hr: true });
    blocks.push({ h2: "Monday–Friday daily checks for understanding" });
    blocks.push({ table: [
      ["Monday",    st["wp-day-Mon"] || ""],
      ["Tuesday",   st["wp-day-Tue"] || ""],
      ["Wednesday", st["wp-day-Wed"] || ""],
      ["Thursday",  st["wp-day-Thu"] || ""],
      ["Friday",    st["wp-day-Fri"] || ""],
    ], headers: ["Day", "Check for understanding & what it tells you"] });

    blocks.push({ hr: true });
    blocks.push({ h2: "Reading & writing across the curriculum" });
    blocks.push({ label: "Text students will read", value: st["wp-lit-text"] });
    blocks.push({ label: "Writing prompt",          value: st["wp-lit-prompt"] });

    var wpStratList = st["wp-strategies"] || [];
    if (wpStratList.length) {
      blocks.push({ p: "Tier 1 strategies pulled into this week:", opts: { bold: true } });
      wpStratList.forEach(function (s) { blocks.push({ strategy: s }); });
    }

    blocks.push({ hr: true });
    blocks.push({ h2: "PLC handoff — bring to Monday" });
    blocks.push({ label: "One insight from this week",           value: st["wp-handoff-insight"] });
    blocks.push({ label: "One problem you're still stuck on",    value: st["wp-handoff-problem"] });
    blocks.push({ label: "One thing you need from the team",     value: st["wp-handoff-ask"] });

    return { title: "WHS Weekly Lesson Plan", blocks: blocks };
  }

  // ---------- UNIT PLAN PAGE ----------
  // Six-stage flow (WHS Unit Planning framework):
  //  1. Standards         → which OAS standards anchor the unit
  //  2. Assessment Design → how you'll measure whether students met them
  //  3. Daily Engagement  → the instructional moves that carry the unit day to day
  //  4. Visible Evidence  → what you and students will see during the unit
  //  5. Instructional Response → what you'll do when the evidence changes
  //  6. Student Achievement    → what proficiency looks like at the end + PLC reflection
  function renderUnitPlan() {
    var DRAFT_KEY = "unit";
    var frag = document.createDocumentFragment();
    
    frag.appendChild(el("h1", { class: "page-title" }, "Unit Plan"));
    frag.appendChild(el("p", { class: "page-lede" },
      "The WHS unit-planning flow — Standards → Assessment Design → Daily Engagement → Visible Evidence → Instructional Response → Student Achievement. Fill each stage in order, walk through it step by step, then download as a Word file for your PLC binder."));

    var form = el("form", { class: "planner-form", onsubmit: function (e) { e.preventDefault(); } });

    // ---- Header ----
    var header = el("div", { class: "form-grid form-grid-3", id: "up-header" }, [
      PC.field("up-teacher",  "Teacher",   null, PC.textInput("up-teacher",  "Ms. Turner")),
      PC.field("up-course",   "Course",    null, PC.textInput("up-course",   "Algebra I")),
      PC.field("up-unitname", "Unit name", null, PC.textInput("up-unitname", "Linear Functions")),
      PC.field("up-start",    "Start date", null, PC.textInput("up-start", "", "", { type: "date" })),
      PC.field("up-end",      "End date",   null, PC.textInput("up-end",   "", "", { type: "date" })),
      PC.field("up-length",   "Length (days)", null, PC.textInput("up-length", "10", "", { type: "number" })),
    ]);
    form.appendChild(header);

    // Stage 1 — STANDARDS
    var stdList = PC.standardsList("up-standards", []);
    var stage1 = el("section", { class: "form-section form-section-stage", id: "up-standards-sec" }, [
      el("div", { class: "stage-badge" }, "Stage 1 · Standards"),
      el("h2", { class: "section-title" }, "Which Oklahoma standards anchor this unit?"),
      el("p", { class: "section-lede" }, "Add every Oklahoma standard the unit will teach, in the order you plan to teach them. Then translate them into a student-facing purpose — what students will know, do, and transfer."),
      PC.field("up-standards-wrap", "Prioritized standards", "Search a subject and grade, then click Add.", stdList.el),
      PC.standardsPicker({ subject: "Math", grade: "Algebra I", insertLabel: "Add", onInsert: stdList.add }),
      PC.field("up-purpose", "Unit purpose (student-facing)",
        "One or two sentences a student could read on Day 1 and understand why the unit matters.",
        PC.textArea("up-purpose", "By the end of this unit, students will …", "", 3)),
      PC.field("up-outcome-know", "Students will know",
        "Core knowledge, key vocabulary, and big ideas.",
        PC.textArea("up-outcome-know", "", "", 3)),
      PC.field("up-outcome-do", "Students will be able to",
        "Observable skills — verbs that can be measured.",
        PC.textArea("up-outcome-do", "", "", 3)),
      PC.field("up-outcome-transfer", "Students will transfer to",
        "Where the learning shows up outside this unit.",
        PC.textArea("up-outcome-transfer", "", "", 2)),
    ]);
    form.appendChild(stage1);

    // Stage 2 — ASSESSMENT DESIGN
    var stage2 = el("section", { class: "form-section form-section-stage", id: "up-assessment" }, [
      el("div", { class: "stage-badge" }, "Stage 2 · Assessment Design"),
      el("h2", { class: "section-title" }, "How will you know students met the standards?"),
      el("p", { class: "section-lede" }, "Design the assessments before you design the lessons. Start with the summative that proves proficiency, then work back to the formative checks that get students ready."),
      PC.field("up-summ-task", "Summative assessment task",
        "The culminating task that demonstrates mastery of the anchor standards.",
        PC.textArea("up-summ-task", "", "", 4)),
      PC.field("up-summ-rubric", "Scoring / rubric",
        "What proficient looks like. Same rubric across the PLC.",
        PC.textArea("up-summ-rubric", "", "", 3)),
      PC.field("up-diagnostic", "Pre-unit diagnostic",
        "What you'll give before instruction to know where students are starting.",
        PC.textArea("up-diagnostic", "", "", 2)),
      PC.field("up-formative-plan", "Formative check-in plan",
        "When and how you'll take the pulse during the unit — mid-unit CFA, exit tickets, structured tasks. Name the frequency.",
        PC.textArea("up-formative-plan", "", "", 3)),
    ]);
    form.appendChild(stage2);

    // Stage 3 — DAILY ENGAGEMENT
    var upStrats = PC.strategyList("up-strategies", []);
    var stage3 = el("section", { class: "form-section form-section-stage", id: "up-engagement" }, [
      el("div", { class: "stage-badge" }, "Stage 3 · Daily Engagement"),
      el("h2", { class: "section-title" }, "How will students engage with the content every day?"),
      el("p", { class: "section-lede" }, "The core instructional moves that carry the unit day to day — the strategies, texts, and tasks students will meet in every class."),
      PC.field("up-strategies-wrap", "Tier 1 strategies pulled into this unit",
        "Pull any of the 192 Tier 1 strategies from the library below — name, description, and Toolkit link travel with the plan and export in the Word file.",
        upStrats.el),
      PC.strategyPicker({ insertLabel: "Pull into unit", onInsert: upStrats.add }),
      PC.field("up-tier1-strats", "Notes on how strategies will be sequenced",
        "Optional: when in the unit each strategy shows up, or how you'll rotate them.",
        PC.textArea("up-tier1-strats", "", "", 3)),
      PC.field("up-literacy", "Reading & writing across the unit",
        "The texts students will read and the evidence-based writing they'll produce. Every class, every day.",
        PC.textArea("up-literacy", "", "", 3)),
      PC.field("up-discourse", "Discourse & response opportunities",
        "How every student will talk, write, or respond — not just the hand-raisers.",
        PC.textArea("up-discourse", "", "", 2)),
      PC.field("up-hook", "Hook, anchor text, or provocation",
        "The thing that makes students care on Day 1.",
        PC.textArea("up-hook", "", "", 2)),
    ]);
    form.appendChild(stage3);

    // Stage 4 — VISIBLE EVIDENCE
    var stage4 = el("section", { class: "form-section form-section-stage", id: "up-evidence" }, [
      el("div", { class: "stage-badge" }, "Stage 4 · Visible Evidence"),
      el("h2", { class: "section-title" }, "What will you and students see along the way?"),
      el("p", { class: "section-lede" }, "The observable signs that students are learning — in student work, in student talk, in the room. Data you can look at during the unit, not just at the end."),
      PC.field("up-evidence-work", "Evidence in student work",
        "What products will show growth — notebooks, drafts, problem sets, projects.",
        PC.textArea("up-evidence-work", "", "", 3)),
      PC.field("up-evidence-talk", "Evidence in student talk",
        "What you'll hear when students discuss the content — vocabulary, reasoning, questions.",
        PC.textArea("up-evidence-talk", "", "", 2)),
      PC.field("up-evidence-room", "Evidence in the room",
        "What visitors would see — posted standards, student-facing rubrics, anchor charts, student work displayed.",
        PC.textArea("up-evidence-room", "", "", 2)),
      PC.field("up-evidence-data", "Data you'll track",
        "The specific data points you'll collect during the unit and how you'll record them.",
        PC.textArea("up-evidence-data", "", "", 2)),
    ]);
    form.appendChild(stage4);

    // Stage 5 — INSTRUCTIONAL RESPONSE
    var stage5 = el("section", { class: "form-section form-section-stage", id: "up-response" }, [
      el("div", { class: "stage-badge" }, "Stage 5 · Instructional Response"),
      el("h2", { class: "section-title" }, "What will you do when the evidence changes?"),
      el("p", { class: "section-lede" }, "How you'll respond to what the evidence tells you — for students who are stuck, for students who already have it, and for the whole class when the whole class needs it."),
      PC.field("up-response-stuck", "If most students are stuck",
        "A whole-class reteach plan — what you'll model, what you'll change, when it happens.",
        PC.textArea("up-response-stuck", "", "", 3)),
      PC.field("up-response-some", "If some students are stuck",
        "Small-group or 1:1 support — named students, named piece, named time, named recheck.",
        PC.textArea("up-response-some", "", "", 3)),
      PC.field("up-response-ahead", "If students are already proficient",
        "A real extension — application, transfer, or deeper analysis. Not more of the same worksheet.",
        PC.textArea("up-response-ahead", "", "", 3)),
      PC.field("up-response-cadence", "Response cadence",
        "When during the unit you pause to make these decisions — e.g., after the mid-unit CFA, weekly PLC.",
        PC.textArea("up-response-cadence", "", "", 2)),
    ]);
    form.appendChild(stage5);

    // Stage 6 — STUDENT ACHIEVEMENT
    var stage6 = el("section", { class: "form-section form-section-stage", id: "up-achievement" }, [
      el("div", { class: "stage-badge" }, "Stage 6 · Student Achievement"),
      el("h2", { class: "section-title" }, "What does proficiency look like at the end?"),
      el("p", { class: "section-lede" }, "The results you're accountable for — what proficient student work looks like, how you'll report it, and what you'll take into next year."),
      PC.field("up-achievement-target", "Target proficiency",
        "The specific bar the team is holding — e.g., 80% of students at proficient or above on the summative.",
        PC.textArea("up-achievement-target", "", "", 2)),
      PC.field("up-achievement-exemplar", "What proficient work looks like",
        "Describe (or paste an exemplar link) the student work that demonstrates mastery.",
        PC.textArea("up-achievement-exemplar", "", "", 3)),
      PC.field("up-achievement-report", "How results will be reported",
        "Where the data lives — gradebook categories, PLC tracker, data wall.",
        PC.textArea("up-achievement-report", "", "", 2)),
      PC.field("up-refl-strong", "After the unit — what went well",
        "Fill in after the unit ends.",
        PC.textArea("up-refl-strong", "", "", 2)),
      PC.field("up-refl-change", "After the unit — what to change next time",
        "Fill in after the unit ends.",
        PC.textArea("up-refl-change", "", "", 2)),
    ]);
    form.appendChild(stage6);

    frag.appendChild(form);

    // Walk-through — one step per stage
    var walkContainer = el("div", { class: "walk-launcher" });
    PC.attachWalkthrough(walkContainer, [
      { id: "up-header",        title: "Name the unit", body: "Teacher, course, unit name, and dates. Length in days is optional but useful for pacing." },
      { id: "up-standards-sec", title: "Stage 1 — Standards", body: "Add every Oklahoma standard the unit will teach, in the order you'll teach them. Then translate them into a student-facing purpose and Know / Do / Transfer outcomes." },
      { id: "up-assessment",    title: "Stage 2 — Assessment Design", body: "Design the assessments before the lessons. Start with the summative that proves proficiency, then work back to the diagnostic and the formative check-ins that get students ready." },
      { id: "up-engagement",    title: "Stage 3 — Daily Engagement", body: "The instructional moves that carry the unit day to day — the Tier 1 strategies, the texts, the discourse, and the hook that make students care on Day 1." },
      { id: "up-evidence",      title: "Stage 4 — Visible Evidence", body: "The observable signs that students are learning — in their work, in their talk, and in the room. Data you can look at during the unit, not just at the end." },
      { id: "up-response",      title: "Stage 5 — Instructional Response", body: "What you'll do when the evidence changes — for students who are stuck, for students who already have it, and for the whole class when needed." },
      { id: "up-achievement",   title: "Stage 6 — Student Achievement", body: "What proficiency looks like at the end, how results will be reported, and — after the unit — what worked and what to change next year." },
    ]);
    frag.appendChild(walkContainer);

    // Actions
    frag.appendChild(actionBar([
      downloadDocxBtn("⬇ Download as Word (.docx)", function () {
        var st = PC.collectFields(form);
        return "Unit-Plan-" + slug(st["up-course"] || "course") + "-" + slug(st["up-unitname"] || "unit") + ".docx";
      }, function () { return buildUnitDocx(form); }),
      printBtn("Print this plan"),
      el("button", { type: "button", class: "btn btn-ghost", onclick: function () {
        if (confirm("Clear this unit plan? Your saved draft will be erased.")) {
          PC.clearDraft(DRAFT_KEY);
          location.reload();
        }
      } }, "Clear draft"),
      el("div", { class: "planner-actions-note" }, "This plan auto-saves to your browser as you type."),
    ]));

    var saved = PC.loadDraft(DRAFT_KEY);
    if (saved) PC.populateFields(form, saved);
    var saveTimer;
    form.addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { PC.saveDraft(DRAFT_KEY, PC.collectFields(form)); }, 400);
    });

    return frag;
  }

  function buildUnitDocx(form) {
    var st = PC.collectFields(form);
    var teacher = st["up-teacher"] || "";
    var course  = st["up-course"] || "";
    var name    = st["up-unitname"] || "Unit";
    var start   = st["up-start"] ? formatDate(st["up-start"]) : "";
    var endD    = st["up-end"]   ? formatDate(st["up-end"])   : "";
    var length  = st["up-length"] || "";
    var subtitle = [teacher, course].filter(Boolean).join(" · ") +
      ((start || endD) ? "  ·  " + [start, endD].filter(Boolean).join(" – ") : "") +
      (length ? "  ·  " + length + " days" : "");

    var blocks = [];
    blocks.push({ h1: name });
    if (subtitle.trim()) blocks.push({ p: subtitle, opts: { color: "4B5563", size: 20, italics: true } });
    blocks.push({ italic: "WHS unit-planning flow — Standards → Assessment Design → Daily Engagement → Visible Evidence → Instructional Response → Student Achievement." });

    // Stage 1 — Standards
    blocks.push({ hr: true });
    blocks.push({ h2: "Stage 1 — Standards" });
    var stds = st["up-standards"] || [];
    if (stds.length) {
      blocks.push({ p: "Prioritized Oklahoma standards:", opts: { bold: true } });
      stds.forEach(function (s) { blocks.push({ standard: s }); });
    } else {
      blocks.push({ label: "Prioritized standards", value: "—" });
    }
    if (st["up-purpose"])           blocks.push({ label: "Unit purpose (student-facing)", value: st["up-purpose"] });
    if (st["up-outcome-know"])      blocks.push({ label: "Students will know",         value: st["up-outcome-know"] });
    if (st["up-outcome-do"])        blocks.push({ label: "Students will be able to",   value: st["up-outcome-do"] });
    if (st["up-outcome-transfer"])  blocks.push({ label: "Students will transfer to",  value: st["up-outcome-transfer"] });

    // Stage 2 — Assessment Design
    blocks.push({ hr: true });
    blocks.push({ h2: "Stage 2 — Assessment Design" });
    blocks.push({ label: "Summative assessment task", value: st["up-summ-task"] });
    blocks.push({ label: "Scoring / rubric",          value: st["up-summ-rubric"] });
    blocks.push({ label: "Pre-unit diagnostic",       value: st["up-diagnostic"] });
    blocks.push({ label: "Formative check-in plan",   value: st["up-formative-plan"] });

    // Stage 3 — Daily Engagement
    blocks.push({ hr: true });
    blocks.push({ h2: "Stage 3 — Daily Engagement" });
    var upStratList = st["up-strategies"] || [];
    if (upStratList.length) {
      blocks.push({ p: "Tier 1 strategies pulled into this unit:", opts: { bold: true } });
      upStratList.forEach(function (s) { blocks.push({ strategy: s }); });
    }
    if (st["up-tier1-strats"]) blocks.push({ label: "Notes on how strategies will be sequenced", value: st["up-tier1-strats"] });
    blocks.push({ label: "Reading & writing across the unit",       value: st["up-literacy"] });
    blocks.push({ label: "Discourse & response opportunities",      value: st["up-discourse"] });
    blocks.push({ label: "Hook, anchor text, or provocation",       value: st["up-hook"] });

    // Stage 4 — Visible Evidence
    blocks.push({ hr: true });
    blocks.push({ h2: "Stage 4 — Visible Evidence" });
    blocks.push({ label: "Evidence in student work", value: st["up-evidence-work"] });
    blocks.push({ label: "Evidence in student talk", value: st["up-evidence-talk"] });
    blocks.push({ label: "Evidence in the room",    value: st["up-evidence-room"] });
    blocks.push({ label: "Data you'll track",       value: st["up-evidence-data"] });

    // Stage 5 — Instructional Response
    blocks.push({ hr: true });
    blocks.push({ h2: "Stage 5 — Instructional Response" });
    blocks.push({ label: "If most students are stuck",           value: st["up-response-stuck"] });
    blocks.push({ label: "If some students are stuck",           value: st["up-response-some"] });
    blocks.push({ label: "If students are already proficient",   value: st["up-response-ahead"] });
    blocks.push({ label: "Response cadence",                     value: st["up-response-cadence"] });

    // Stage 6 — Student Achievement
    blocks.push({ hr: true });
    blocks.push({ h2: "Stage 6 — Student Achievement" });
    blocks.push({ label: "Target proficiency",                     value: st["up-achievement-target"] });
    blocks.push({ label: "What proficient work looks like",         value: st["up-achievement-exemplar"] });
    blocks.push({ label: "How results will be reported",            value: st["up-achievement-report"] });
    if (st["up-refl-strong"] || st["up-refl-change"]) {
      blocks.push({ label: "After the unit — what went well",         value: st["up-refl-strong"] });
      blocks.push({ label: "After the unit — what to change next time", value: st["up-refl-change"] });
    }

    return { title: name, blocks: blocks };
  }

  // ---------- DAILY PLAN PAGE ----------
  function renderDailyPlan() {
    var DRAFT_KEY = "daily";
    var frag = document.createDocumentFragment();
    
    frag.appendChild(el("h1", { class: "page-title" }, "Daily Plan"));
    frag.appendChild(el("p", { class: "page-lede" },
      "A single-day gradual-release plan — Do Now, I Do, We Do, You Do, Closure, and Exit Ticket. Fill it in, walk through step by step, then download as a Word file."));

    var form = el("form", { class: "planner-form", onsubmit: function (e) { e.preventDefault(); } });

    var header = el("div", { class: "form-grid form-grid-3", id: "dp-header" }, [
      PC.field("dp-teacher", "Teacher", null, PC.textInput("dp-teacher", "Ms. Turner")),
      PC.field("dp-course",  "Course",  null, PC.textInput("dp-course",  "Algebra I")),
      PC.field("dp-period",  "Period",  null, PC.textInput("dp-period",  "3rd")),
      PC.field("dp-date",    "Date",    null, PC.textInput("dp-date",    "", "", { type: "date" })),
      PC.field("dp-length",  "Class length (min)", null, PC.textInput("dp-length", "50", "", { type: "number" })),
    ]);
    form.appendChild(header);

    // Objective + standards
    var stdList = PC.standardsList("dp-standards", []);
    var obj = el("section", { class: "form-section", id: "dp-obj" }, [
      el("h2", { class: "section-title" }, "Standard, objective & success criteria"),
      el("p", { class: "section-lede" }, "Posted for students to see all period. Pull the exact Oklahoma standard from the picker so the code and wording match."),
      PC.field("dp-standards-wrap", "Oklahoma standard(s)", null, stdList.el),
      PC.standardsPicker({ subject: "Math", grade: "Algebra I", insertLabel: "Add", onInsert: stdList.add }),
      PC.field("dp-objective", "Learning objective",  "Written as an \"I can\" or \"Students will …\" statement.", PC.textArea("dp-objective", "", "", 2)),
      PC.field("dp-success",   "Success criteria",    "The 2–3 observable things students will do or produce.", PC.textArea("dp-success", "", "", 3)),
    ]);
    form.appendChild(obj);

    // Tier 1 strategy picker — pull the exact strategies you'll run today
    var dpStrats = PC.strategyList("dp-strategies", []);
    var stratSec = el("section", { class: "form-section", id: "dp-strategies-sec" }, [
      el("h2", { class: "section-title" }, "Tier 1 strategies in play today"),
      el("p", { class: "section-lede" }, "Pull the exact strategies you'll run today from all 192 in the library. Each one carries its name, its summary, and a link back to the live Toolkit page — all of it prints on the Word file."),
      PC.field("dp-strategies-wrap", "Strategies for today's lesson", null, dpStrats.el),
      PC.strategyPicker({ insertLabel: "Pull into lesson", onInsert: dpStrats.add }),
    ]);
    form.appendChild(stratSec);

    // Gradual release blocks
    var blocks = [
      { id: "dp-donow",    title: "Do Now / Warm-up",                lede: "3–5 minutes. Silent, individual, based on yesterday's exit ticket data.",             fields: [["min", "Minutes", "5", "number"], ["desc", "What students do", ""]] },
      { id: "dp-ido",      title: "I Do (Model)",                    lede: "Explicit modeling. You do the thinking out loud. 8–12 minutes.",                      fields: [["min", "Minutes", "10", "number"], ["desc", "Exact model, key language, worked example", ""]] },
      { id: "dp-wedo",     title: "We Do (Guided practice)",         lede: "Whole-class or small groups. High success rate, high response rate. 8–12 minutes.",   fields: [["min", "Minutes", "12", "number"], ["desc", "Prompts, checks for understanding, response protocol", ""]] },
      { id: "dp-youdo",    title: "You Do (Independent practice)",   lede: "Every student working on the same objective. You circulate and coach. 10–15 minutes.", fields: [["min", "Minutes", "15", "number"], ["desc", "The task and how you'll spot who's stuck", ""]] },
      { id: "dp-closure",  title: "Closure",                         lede: "Bring it back to the objective. Name what was learned. 3–5 minutes.",                fields: [["min", "Minutes", "5", "number"], ["desc", "How you'll close — a summary, a share, a question", ""]] },
      { id: "dp-exit",     title: "Exit Ticket",                     lede: "One question that tells you who got it. Used to plan tomorrow's Do Now.",              fields: [["min", "Minutes", "3", "number"], ["desc", "The exact prompt", ""]] },
    ];
    blocks.forEach(function (b) {
      var sec = el("section", { class: "form-section", id: b.id }, [
        el("h2", { class: "section-title" }, b.title),
        el("p", { class: "section-lede" }, b.lede),
      ]);
      var row = el("div", { class: "form-grid form-grid-2" }, [
        PC.field(b.id + "-min", "Minutes", null, PC.textInput(b.id + "-min", "", b.fields[0][2], { type: "number" })),
      ]);
      sec.appendChild(row);
      sec.appendChild(PC.field(b.id + "-desc", b.fields[1][1], null, PC.textArea(b.id + "-desc", "", "", 4)));
      form.appendChild(sec);
    });

    // Materials + differentiation
    var extras = el("section", { class: "form-section", id: "dp-extras" }, [
      el("h2", { class: "section-title" }, "Materials & differentiation"),
      PC.field("dp-materials",   "Materials", "Everything you need on the podium before the bell.", PC.textArea("dp-materials", "", "", 2)),
      PC.field("dp-diff-support","Support",   "For students who need more scaffolding today.",     PC.textArea("dp-diff-support", "", "", 2)),
      PC.field("dp-diff-extend", "Extension", "For students who finish early or already have it.", PC.textArea("dp-diff-extend", "", "", 2)),
    ]);
    form.appendChild(extras);

    frag.appendChild(form);

    // Walk-through
    var walkContainer = el("div", { class: "walk-launcher" });
    PC.attachWalkthrough(walkContainer, [
      { id: "dp-header", title: "Header", body: "Teacher, course, period, date, class length. Sets the top of the printout." },
      { id: "dp-obj",    title: "Standard, objective, and success criteria", body: "Pull the exact Oklahoma standard so the posted code matches the state PDF. Then translate it into an \"I can\" objective and 2–3 success criteria." },
      { id: "dp-donow",  title: "Do Now", body: "Silent, individual, tied to yesterday's exit ticket data. Buys you a moment to greet students and take attendance." },
      { id: "dp-ido",    title: "I Do (Model)", body: "Explicit modeling. Say what you're doing while you do it. Anticipate the misconception you know they'll bring." },
      { id: "dp-wedo",   title: "We Do (Guided practice)", body: "Every student responding — cold call, whiteboards, choral response, structured turn-and-talk. High success rate here." },
      { id: "dp-youdo",  title: "You Do (Independent practice)", body: "Same objective, every student. You circulate with a data collection tool — clipboard, sticker chart, seating chart." },
      { id: "dp-closure",title: "Closure", body: "Bring it back to the objective. Ask one student to state what they can now do that they couldn't at bell." },
      { id: "dp-exit",   title: "Exit Ticket", body: "One question that tells you who got it. Grade tonight. Use it to write tomorrow's Do Now." },
      { id: "dp-extras", title: "Materials & differentiation", body: "Materials on the podium. Support for the students who need scaffolding. A real extension — not more of the same." },
    ]);
    frag.appendChild(walkContainer);

    // Actions
    frag.appendChild(actionBar([
      downloadDocxBtn("⬇ Download as Word (.docx)", function () {
        var st = PC.collectFields(form);
        var d = st["dp-date"] || "";
        return "Daily-Plan-" + slug(st["dp-course"] || "course") + (d ? "-" + d : "") + ".docx";
      }, function () { return buildDailyDocx(form); }),
      printBtn("Print this plan"),
      el("button", { type: "button", class: "btn btn-ghost", onclick: function () {
        if (confirm("Clear this daily plan? Your saved draft will be erased.")) {
          PC.clearDraft(DRAFT_KEY);
          location.reload();
        }
      } }, "Clear draft"),
      el("div", { class: "planner-actions-note" }, "This plan auto-saves to your browser as you type."),
    ]));

    var saved = PC.loadDraft(DRAFT_KEY);
    if (saved) PC.populateFields(form, saved);
    var saveTimer;
    form.addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { PC.saveDraft(DRAFT_KEY, PC.collectFields(form)); }, 400);
    });

    return frag;
  }

  function buildDailyDocx(form) {
    var st = PC.collectFields(form);
    var teacher = st["dp-teacher"] || "";
    var course  = st["dp-course"] || "";
    var period  = st["dp-period"] ? "Period " + st["dp-period"] : "";
    var date    = st["dp-date"]  ? formatDate(st["dp-date"]) : "";
    var length  = st["dp-length"] ? (st["dp-length"] + " min") : "";
    var subtitle = [teacher, course, period, date, length].filter(Boolean).join(" · ");

    var blocks = [];
    if (subtitle) blocks.push({ p: subtitle, opts: { color: "4B5563", size: 20, italics: true } });

    var stds = st["dp-standards"] || [];
    blocks.push({ hr: true });
    blocks.push({ h2: "Standard, objective & success criteria" });
    if (stds.length) stds.forEach(function (s) { blocks.push({ standard: s }); });
    blocks.push({ label: "Learning objective", value: st["dp-objective"] });
    blocks.push({ label: "Success criteria",   value: st["dp-success"] });

    var dpStratList = st["dp-strategies"] || [];
    if (dpStratList.length) {
      blocks.push({ hr: true });
      blocks.push({ h2: "Tier 1 strategies in play today" });
      dpStratList.forEach(function (s) { blocks.push({ strategy: s }); });
    }

    var segments = [
      ["Do Now / Warm-up", "dp-donow"],
      ["I Do (Model)",      "dp-ido"],
      ["We Do (Guided)",    "dp-wedo"],
      ["You Do (Independent)", "dp-youdo"],
      ["Closure",           "dp-closure"],
      ["Exit Ticket",       "dp-exit"],
    ];
    blocks.push({ hr: true });
    blocks.push({ h2: "Lesson (gradual release)" });
    var rows = segments.map(function (seg) {
      return [seg[0], (st[seg[1] + "-min"] || "") + " min", st[seg[1] + "-desc"] || ""];
    });
    blocks.push({ table: rows, headers: ["Segment", "Time", "What happens"] });

    blocks.push({ hr: true });
    blocks.push({ h2: "Materials & differentiation" });
    blocks.push({ label: "Materials",  value: st["dp-materials"] });
    blocks.push({ label: "Support",    value: st["dp-diff-support"] });
    blocks.push({ label: "Extension",  value: st["dp-diff-extend"] });

    var title = "Daily Plan — " + (course || "Course") + (date ? " · " + date : "");
    return { title: title, blocks: blocks };
  }

  // ---------- utilities ----------
  function slug(s) {
    return (s || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
  }
  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var d = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  window.PlannerPages = {
    renderStandards:   renderStandards,
    renderWeeklyPlan:  renderWeeklyPlan,
    renderUnitPlan:    renderUnitPlan,
    renderDailyPlan:   renderDailyPlan,
  };
})();
