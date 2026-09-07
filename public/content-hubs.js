/* Quick PD companion hubs: K-5 science/social studies, 6-12 domain
   pathways, student voice, and accessibility/learner supports. */
(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function sourceLink(source) {
    return '<a class="guide-card" href="' + esc(source.url) + '" target="_blank" rel="noopener">' +
      '<div class="guide-label">' + esc(source.label) + '</div>' +
      '<div class="guide-title">' + esc(source.title) + '</div>' +
      '<div class="guide-cta">Open source ↗</div></a>';
  }

  var K5 = {
    science: {
      title: "Elementary Science (K–5)",
      lede: "Young scientists should spend the period noticing, questioning, investigating, modeling, explaining, and revising—not copying definitions before they have a phenomenon to explain.",
      sources: [
        { label: "Science practices", title: "NGSS Science and Engineering Practices", url: "https://www.nextgenscience.org/content/home-page" },
        { label: "K–2 progression", title: "K–2 Engineering Design: questions, models, tests, and evidence", url: "https://www.nextgenscience.org/topic-arrangement/k-2engineering-design" },
        { label: "Grades 3–5 progression", title: "3–5 Engineering Design: controlled tests and evidence", url: "https://www.nextgenscience.org/topic-arrangement/3-5engineering-design" }
      ],
      practices: [
        { title: "Phenomenon-first notice and wonder", band: "K–5 · Launch", why: "A puzzling event gives students a reason to read, measure, and explain.", moves: ["Show an observable event, image, specimen, or short demonstration.", "Students record what they notice before the teacher names the concept.", "Sort questions into ones the class can investigate and ones that need another source."], evidence: "Students produce observations and testable questions before receiving an explanation." },
        { title: "Predict–observe–explain", band: "K–5 · Investigation", why: "Prediction makes initial thinking visible; observation creates evidence; explanation forces revision.", moves: ["Ask every student to predict and give a reason.", "Run the demonstration or investigation and record what actually happens.", "Require students to revise the explanation using the observation."], evidence: "Student explanations change when evidence conflicts with the original prediction." },
        { title: "Fair-test investigation", band: "Grades 2–5 · Inquiry", why: "Students learn that conclusions are only as trustworthy as the test that produced them.", moves: ["Name the question and the variable being changed.", "Agree on what stays the same and how results will be recorded.", "Repeat when possible, compare results, and name limitations."], evidence: "Tables, labeled measurements, and conclusions reference the controlled test." },
        { title: "Science notebooks: draw, label, explain", band: "K–5 · Literacy", why: "Drawing and writing make observation precise and give the teacher visible evidence of thinking.", moves: ["Date every entry and begin with a labeled observation or model.", "Add a sentence frame: I observed ____. I think ____ because ____.", "Return to earlier entries and revise in a different color."], evidence: "Notebook revisions show how students’ models and explanations develop." },
        { title: "Build and revise a model", band: "K–5 · Sensemaking", why: "A model is an explanation students can inspect, test, and improve—not merely a craft project.", moves: ["Ask what the model must show and what evidence should appear.", "Have partners compare what each model explains or leaves out.", "Revise after a new investigation, text, or data set."], evidence: "Students can name the evidence that caused a model revision." },
        { title: "Claim–evidence–reasoning", band: "Grades 3–5 · Explanation", why: "CER turns activity into science by connecting a conclusion to observable evidence and a scientific idea.", moves: ["Pose one focused question after the investigation.", "Require a claim, two specific observations or data points, and reasoning.", "Use partner critique: Does the evidence actually support the claim?"], evidence: "Written or spoken explanations name evidence rather than relying on ‘I think.’" }
      ],
      lookFors: ["Students handle phenomena, models, data, or texts—not only worksheets.", "Questions and observations are visible before the teacher explanation.", "Students talk and write from evidence.", "Models and explanations are revised as new evidence appears."]
    },
    social: {
      title: "Elementary Social Studies (K–5)",
      lede: "Elementary social studies builds knowledge, civic identity, and disciplined inquiry through compelling questions, primary sources, multiple perspectives, and evidence-based conclusions.",
      sources: [
        { label: "Inquiry framework", title: "College, Career, and Civic Life (C3) Framework", url: "https://www.socialstudies.org/standards/c3" },
        { label: "Primary sources", title: "Library of Congress: Getting Started with Primary Sources", url: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/" },
        { label: "Classroom sets", title: "Library of Congress Primary Source Sets", url: "https://www.loc.gov/programs/teachers/classroom-materials/primary-source-sets/" }
      ],
      practices: [
        { title: "Launch with a compelling question", band: "K–5 · Inquiry", why: "A question gives facts a purpose and invites students to investigate rather than wait for answers.", moves: ["Use a question with more than one defensible response.", "Post what students initially think and why.", "Return to the question after each new source."], evidence: "Final responses are more precise and better supported than initial thinking." },
        { title: "Observe–reflect–question a primary source", band: "K–5 · Sources", why: "Photographs, maps, objects, letters, and oral histories let children investigate traces of the past.", moves: ["Give quiet observation time before providing background.", "Separate what students see from what they infer.", "Generate questions and identify another source that could help."], evidence: "Students distinguish direct observations from interpretations." },
        { title: "Multiple-perspective source set", band: "Grades 2–5 · Perspective", why: "One source offers a viewpoint, not the whole story.", moves: ["Pair two short sources from different people or positions.", "Ask what each source emphasizes, omits, or values.", "Write a conclusion that acknowledges both perspectives."], evidence: "Students cite differences between sources without treating one voice as the entire event." },
        { title: "Map it before reading it", band: "K–5 · Geography", why: "Spatial context makes communities, movement, resources, and conflict easier to understand.", moves: ["Locate the place at neighborhood, state, nation, and world scales.", "Read the title, key, symbols, scale, and direction.", "Ask what pattern the map reveals and what it cannot tell us."], evidence: "Students use map features as evidence in an explanation." },
        { title: "Timeline with cause and consequence", band: "Grades 1–5 · History", why: "Chronology matters, but historical thinking begins when students explain relationships among events.", moves: ["Sequence a small set of events using dates and captions.", "Draw arrows showing cause, response, and consequence.", "Add one event whose absence would change the outcome."], evidence: "Students explain connections rather than merely reciting dates." },
        { title: "Civic problem–choice–action", band: "Grades 2–5 · Civics", why: "Civics becomes meaningful when students evaluate a real community problem and possible responses.", moves: ["Name a school or community issue students can understand.", "Compare options using fairness, impact, cost, and feasibility.", "Create a respectful public product: proposal, letter, presentation, or service action."], evidence: "Students defend a civic choice with criteria and evidence." }
      ],
      lookFors: ["A compelling question organizes the lesson or unit.", "Students read images, maps, objects, and short texts as evidence.", "More than one perspective is represented.", "Students make and defend conclusions instead of copying facts."]
    }
  };

  var SECONDARY = {
    reading: {
      title: "Secondary Reading (6–12)",
      lede: "Every teacher is a teacher of the reading their discipline requires. These routines help adolescents build knowledge, navigate complex text, and cite evidence without lowering the intellectual demand.",
      source: { label: "IES Practice Guide", title: "Providing Reading Interventions for Students in Grades 4–9", url: "https://ies.ed.gov/ncee/wwc/practiceguide/29" },
      ids: ["active-reading-annotation", "tg-three-reads-for-literature", "tg-text-mapping", "tg-socratic-seminar", "tg-synthesis-across-multiple-sources", "tg-exit-ticket-with-quoted-evidence"]
    },
    math: {
      title: "Secondary Math (6–12)",
      lede: "Students learn mathematics by representing, discussing, testing, and defending ideas—not by watching the teacher complete every problem.",
      source: { label: "Evidence library", title: "IES What Works Clearinghouse Practice Guides", url: "https://ies.ed.gov/ncee/wwc/practiceguides" },
      ids: ["tg-notice-and-wonder", "tg-numberless-word-problem", "tg-my-favorite-no", "tg-rallycoach-solve-and-justify", "tg-mathematical-proof-and-justification", "interleaved-mixed-practice-math"]
    },
    writing: {
      title: "Secondary Writing (6–12)",
      lede: "Writing is how students clarify and defend thinking in every course. Build from quick, low-risk writing toward evidence-based explanation, argument, feedback, and revision.",
      source: { label: "Evidence library", title: "IES What Works Clearinghouse Practice Guides", url: "https://ies.ed.gov/ncee/wwc/practiceguides" },
      ids: ["tg-quickwrite", "sentence-combining", "tg-sentence-and-paragraph-frames", "tg-three-pass-peer-review", "tg-the-quote-sandwich", "tg-counterclaim-rebuttal"]
    }
  };

  function practiceCard(p) {
    return '<article class="card strategy-card">' +
      '<div class="strategy-band">' + esc(p.band) + '</div>' +
      '<h3 class="card-title">' + esc(p.title) + '</h3><p>' + esc(p.why) + '</p>' +
      '<div class="resource-heading">Teacher moves</div><ul class="check-list">' + p.moves.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join("") + '</ul>' +
      '<div class="evidence-block"><div class="evidence-label">Evidence to collect</div><div class="evidence-body">' + esc(p.evidence) + '</div></div></article>';
  }

  function renderK5(view, key) {
    var page = K5[key];
    view.innerHTML = '<h1 class="page-title">' + esc(page.title) + '</h1><p class="page-lede">' + esc(page.lede) + '</p>' +
      '<h2 class="section-title">The evidence base</h2><div class="guide-row">' + page.sources.map(sourceLink).join("") + '</div>' +
      '<h2 class="section-title">Core practices</h2>' + page.practices.map(practiceCard).join("") +
      '<h2 class="section-title">What to look for in the room</h2><div class="card"><ul class="check-list">' + page.lookFors.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';
  }

  function renderSecondaryHub(view) {
    view.innerHTML = '<h1 class="page-title">Secondary Foundations (6–12)</h1>' +
      '<p class="page-lede">Three discipline-spanning pathways for the daily work Wewoka expects in every secondary classroom: students read, reason, write, and defend thinking.</p>' +
      '<div class="hub-grid">' +
      '<a class="hub-card" href="#/secondary-reading"><div class="hub-card-title">Secondary Reading</div><div class="hub-card-desc">Complex text, annotation, vocabulary, discussion, and evidence across every subject.</div><div class="hub-card-cta">Open ↗</div></a>' +
      '<a class="hub-card" href="#/secondary-math"><div class="hub-card-title">Secondary Math</div><div class="hub-card-desc">Represent, solve, explain, compare methods, defend, and revise.</div><div class="hub-card-cta">Open ↗</div></a>' +
      '<a class="hub-card" href="#/secondary-writing"><div class="hub-card-title">Secondary Writing</div><div class="hub-card-desc">Frequent low-stakes writing through evidence-based explanation and argument.</div><div class="hub-card-cta">Open ↗</div></a></div>';
  }

  function renderSecondary(view, key, strategies) {
    var page = SECONDARY[key];
    var byId = {};
    (strategies || []).forEach(function (s) { byId[s.id] = s; });
    var cards = page.ids.map(function (id) { return byId[id]; }).filter(Boolean).map(function (s) {
      var evidence = s.effectSizeLabel ? "Effect size " + s.effectSizeLabel : (s.evidenceType || "Research-informed");
      return '<article class="card"><div class="card-meta">' + esc(s.telStage || "Learning") + ' stage</div>' +
        '<h3 class="card-title">' + esc(s.title) + '</h3><p>' + esc(s.description || "") + '</p>' +
        '<div class="evidence-line"><strong>Evidence:</strong> ' + esc(evidence) + (s.sourceName ? ' · ' + esc(s.sourceName) : '') + '</div>' +
        '<a class="strategy-open-link" href="#/strategy/' + encodeURIComponent(s.id) + '">Open full strategy →</a></article>';
    }).join("");
    view.innerHTML = '<a class="detail-back" href="#/secondary">← Secondary Foundations</a><h1 class="page-title">' + esc(page.title) + '</h1>' +
      '<p class="page-lede">' + esc(page.lede) + '</p><div class="guide-row">' + sourceLink(page.source) + '</div>' +
      '<h2 class="section-title">Start with these six</h2><div class="card-grid">' + cards + '</div>' +
      '<div class="callout"><h3>Plan the full cycle</h3><p>Notice → Read → Talk → Solve → Defend → Revise. Use the strategy page to copy a direct link for coaching, then pull the move into your daily, weekly, or unit plan.</p></div>';
  }

  function renderStudentVoice(view) {
    var questions = [
      "I knew what I was supposed to learn today.",
      "I had to think, not just copy or listen.",
      "I had a meaningful chance to read, write, talk, solve, or create.",
      "The teacher checked whether I understood and responded when I needed help.",
      "One part of today’s lesson that helped me learn was…",
      "One change that would help more students learn is…"
    ];
    view.innerHTML = '<h1 class="page-title">Student Voice & Engagement Evidence</h1>' +
      '<p class="page-lede">Students are not products moving through a line. Their experience is evidence. Use brief, anonymous feedback alongside student work, assessment results, and observation—never as a popularity contest.</p>' +
      '<div class="callout"><h3>The rule</h3><p>Ask about the learning conditions the teacher can act on: clarity, thinking, participation, feedback, belonging, and access. Share back what you heard and what will change.</p></div>' +
      '<h2 class="section-title">Six-question pulse check</h2><div class="card"><p>Use a 1–5 scale for the first four items, followed by two short responses.</p><ol class="voice-questions">' + questions.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join("") + '</ol>' +
      '<div class="actions-row"><button class="btn primary" id="copy-voice">Copy questions</button><button class="btn" id="print-voice">Print this page</button></div></div>' +
      '<h2 class="section-title">Close the loop</h2><div class="card-grid">' +
      '<div class="card"><div class="card-title">1. Notice patterns</div><p>Look for repeated themes across students, not one isolated comment.</p></div>' +
      '<div class="card"><div class="card-title">2. Triangulate</div><p>Compare voice with student work, checks for understanding, attendance, and observation.</p></div>' +
      '<div class="card"><div class="card-title">3. Respond visibly</div><p>Tell students: “You said… so I will…” Then check again in two weeks.</p></div></div>' +
      '<div class="evidence-block"><div class="evidence-label">Privacy guardrail</div><div class="evidence-body">Keep routine pulse checks anonymous whenever possible. Do not ask students to disclose disability, immigration status, trauma, discipline history, or other sensitive information.</div></div>';
    var copy = view.querySelector("#copy-voice");
    copy.addEventListener("click", function () {
      var text = questions.map(function (q, i) { return (i + 1) + ". " + q; }).join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { copy.textContent = "Copied"; });
      else { copy.textContent = "Select and copy from the list"; }
    });
    view.querySelector("#print-voice").addEventListener("click", function () { window.print(); });
  }

  function supportCard(title, promise, moves, url, source) {
    return '<article class="card support-card"><h3 class="card-title">' + esc(title) + '</h3><p>' + esc(promise) + '</p><ul class="check-list">' +
      moves.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join("") + '</ul><a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(source) + ' ↗</a></article>';
  }

  function renderLearnerSupports(view) {
    view.innerHTML = '<h1 class="page-title">Accessibility & Learner Supports</h1>' +
      '<p class="page-lede">Keep the grade-level destination clear while removing unnecessary barriers to reaching it. Universal access is planned from the start; individualized accommodations and modifications are implemented exactly as required.</p>' +
      '<div class="evidence-block"><div class="evidence-label">Non-negotiable</div><div class="evidence-body">An IEP or Section 504 plan is not optional guidance. Teachers must know and implement the provisions that apply to each student. Use this page for planning support—not as a substitute for the student’s plan or the IEP/504 team.</div></div>' +
      '<div class="support-grid">' +
      supportCard("Universal Design for Learning", "Design multiple ways to engage, access information, and show learning before barriers appear.", ["Clarify the goal and success criteria.", "Offer accessible representations without removing key content.", "Provide meaningful response options tied to the same standard."], "https://udlguidelines.cast.org/", "CAST UDL Guidelines 3.0") +
      supportCard("Scaffolds, accommodations & modifications", "Name the difference so support does not accidentally lower the target.", ["Scaffold: temporary instructional support that fades.", "Accommodation: changes access or response, not the learning expectation.", "Modification: changes what a student is expected to learn; use only when the student’s plan requires it."], "https://iris.peabody.vanderbilt.edu/information-brief/common-accommodations-and-modifications-in-school/", "IRIS Center") +
      supportCard("IEP & Section 504 implementation", "Translate each required support into a visible classroom routine.", ["Review plans before instruction and assessment.", "Document implementation factually.", "Ask the case manager or team when language is unclear—never improvise away a required support."], "https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/frequently-asked-questions-section-504-free-appropriate-public-education-fape", "U.S. Department of Education") +
      supportCard("Dyslexia & structured literacy", "Use explicit, systematic, cumulative instruction while maintaining knowledge-building and meaningful text.", ["Teach sound-symbol, syllable, morphology, syntax, and semantics explicitly as needed.", "Model, practice with feedback, and build automaticity.", "Provide accessible text and tools without replacing instruction."], "https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/", "International Dyslexia Association") +
      supportCard("Multilingual learners", "Treat home language and background knowledge as assets while making disciplinary language visible.", ["Pair spoken explanation with visuals, models, captions, and written reinforcement.", "Preteach essential language in context.", "Use structured talk before public response and writing."], "https://wida.wisc.edu/teach", "WIDA") +
      supportCard("Advanced learners", "Replace already-mastered work with greater depth, complexity, pace, or authentic transfer.", ["Pre-assess before assigning repetition.", "Compact mastered content.", "Require original application, multiple perspectives, or creation—not simply more problems."], "https://www.nagc.org/curriculum-compacting", "National Association for Gifted Children") +
      supportCard("Assistive technology", "Make the tool available wherever the plan requires it and teach the student to use it independently.", ["Match the tool to a documented barrier and learning task.", "Plan access during instruction, assessment, and nonacademic settings when required.", "Monitor whether the tool increases participation and independence."], "https://sites.ed.gov/idea/idea-files/at-guidance/", "IDEA / U.S. Department of Education") +
      '</div>';
  }

  window.ContentHubs = {
    renderK5Science: function (view) { renderK5(view, "science"); },
    renderK5Social: function (view) { renderK5(view, "social"); },
    renderSecondaryHub: renderSecondaryHub,
    renderSecondaryReading: function (view, strategies) { renderSecondary(view, "reading", strategies); },
    renderSecondaryMath: function (view, strategies) { renderSecondary(view, "math", strategies); },
    renderSecondaryWriting: function (view, strategies) { renderSecondary(view, "writing", strategies); },
    renderStudentVoice: renderStudentVoice,
    renderLearnerSupports: renderLearnerSupports
  };
})();
