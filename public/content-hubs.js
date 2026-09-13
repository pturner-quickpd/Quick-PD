/* Quick PD companion hubs: K-5 science/social studies, 6-12 domain
   pathways, student voice, and accessibility/learner supports. */
(function () {
  "use strict";

  var AP_WORLD_APP = {
    url: "https://turnerstyleapworld.pplx.app/",
    label: "Turner AP World History"
  };

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
    },
    science: {
      title: "Secondary Science (6–12)",
      lede: "Students learn science by explaining phenomena, reasoning from data, and defending claims with evidence. Explicit instruction sets up the reasoning; discourse and writing consolidate it.",
      source: { label: "IES Practice Guide", title: "Teaching Academic Content and Literacy to English Learners in Elementary and Middle School", url: "https://ies.ed.gov/ncee/wwc/practiceguide/19" },
      ids: ["3094110f-91e7-4f98-894e-7b9f0a0893c0", "tg-claim-evidence-reasoning", "tg-notice-and-wonder", "tg-anchor-chart-for-vocabulary", "active-reading-annotation", "tg-exit-ticket-with-quoted-evidence"]
    },
    social: {
      title: "Secondary Social Studies (6–12)",
      lede: "Students think historically by sourcing documents, corroborating across sources, and defending arguments with evidence. Modeling the questions matters as much as modeling the answers.",
      source: { label: "Stanford History Education Group", title: "Reading Like a Historian curriculum", url: "https://sheg.stanford.edu/history-lessons" },
      ids: ["b0d1b183-06cc-4a46-9e05-bf3ea7f54e37", "tg-synthesis-across-multiple-sources", "tg-socratic-seminar", "active-reading-annotation", "tg-counterclaim-rebuttal", "tg-exit-ticket-with-quoted-evidence"]
    }
  };

  // Extract an 11-char YouTube video ID from any common YouTube URL shape.
  function youtubeIdOf(url) {
    if (!url) return null;
    var m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  // Lazy-loaded YouTube embed (facade pattern):
  // renders a thumbnail with a play overlay; the click handler in
  // wireLazyYouTube() swaps it for a real iframe on first click.
  // Prevents N YouTube players from loading on page open.
  function youtubeEmbed(video) {
    if (!video || !video.url) return "";
    var id = youtubeIdOf(video.url);
    if (!id) {
      return '<p style="margin:0 0 8px;"><a href="' + esc(video.url) + '" target="_blank" rel="noopener">' + esc(video.title || video.url) + ' ↗</a></p>';
    }
    var thumb = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    return '<div class="yt-facade" data-yt-id="' + esc(id) + '" data-yt-title="' + esc(video.title || "") + '" ' +
      'style="position:relative;width:100%;padding-top:56.25%;background:#000;border-radius:6px;overflow:hidden;cursor:pointer;margin:0 0 6px;">' +
      '<img src="' + thumb + '" alt="' + esc(video.title || "Video thumbnail") + '" loading="lazy" ' +
      'style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">' +
      '<div aria-hidden="true" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:48px;background:rgba(0,0,0,0.75);border-radius:12px;display:flex;align-items:center;justify-content:center;">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' +
      '</div></div>' +
      '<p style="margin:0 0 10px;font-size:0.88em;color:#4a4a4a;line-height:1.35;">' +
      esc(video.title || "YouTube video") +
      (video.channel ? ' <span style="color:#6b6b6b;">· ' + esc(video.channel) + '</span>' : '') +
      ' <a href="' + esc(video.url) + '" target="_blank" rel="noopener" style="margin-left:4px;">Open on YouTube ↗</a>' +
      '</p>';
  }

  // Render an array of videos (from practice.videos or a hub's concept videos).
  function youtubeEmbedList(videos) {
    if (!Array.isArray(videos) || !videos.length) return "";
    return videos.map(youtubeEmbed).join("");
  }

  // Concept-video block used at the top of Clarity and Delivery pages.
  // Accepts either page.conceptVideos (array) or page.conceptVideo (single).
  function conceptVideoBlock(page) {
    var list = Array.isArray(page.conceptVideos) && page.conceptVideos.length
      ? page.conceptVideos
      : (page.conceptVideo ? [page.conceptVideo] : []);
    if (!list.length) return "";
    var note = page.conceptVideo && page.conceptVideo.note
      ? '<p style="margin:6px 0 0;color:#4a4a4a;font-size:0.95em;"><em>' + esc(page.conceptVideo.note) + '</em></p>'
      : "";
    return '<p style="margin:8px 0 6px;"><strong>See it:</strong></p>' + youtubeEmbedList(list) + note;
  }

  // Attach a single delegated click handler that upgrades any .yt-facade
  // to a real iframe on first click. Idempotent — attaches at most once.
  function wireLazyYouTube() {
    if (window.__ytFacadeWired) return;
    window.__ytFacadeWired = true;
    document.addEventListener("click", function (e) {
      var facade = e.target.closest && e.target.closest(".yt-facade");
      if (!facade) return;
      var id = facade.getAttribute("data-yt-id");
      var title = facade.getAttribute("data-yt-title") || "YouTube video";
      if (!id) return;
      e.preventDefault();
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.setAttribute("frameborder", "0");
      iframe.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;border:0;";
      facade.innerHTML = "";
      facade.style.cursor = "default";
      facade.appendChild(iframe);
    }, false);
  }

  function practiceCard(p) {
    var videoBlock = "";
    // Prefer a videos array (embedded) over a single video (link only).
    if (Array.isArray(p.videos) && p.videos.length) {
      videoBlock = '<div class="resource-heading">See it in a classroom</div>' + youtubeEmbedList(p.videos);
    } else if (p.video && p.video.url) {
      videoBlock = '<div class="resource-heading">See it in a classroom</div>' + youtubeEmbed(p.video);
    }
    return '<article class="card strategy-card">' +
      '<div class="strategy-band">' + esc(p.band) + '</div>' +
      '<h3 class="card-title">' + esc(p.title) + '</h3><p>' + esc(p.why) + '</p>' +
      '<div class="resource-heading">Teacher moves</div><ul class="check-list">' + p.moves.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join("") + '</ul>' +
      videoBlock +
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
      '<a class="hub-card" href="#/secondary-writing"><div class="hub-card-title">Secondary Writing</div><div class="hub-card-desc">Frequent low-stakes writing through evidence-based explanation and argument.</div><div class="hub-card-cta">Open ↗</div></a>' +
      '<a class="hub-card" href="#/secondary-science"><div class="hub-card-title">Secondary Science</div><div class="hub-card-desc">Explain phenomena, reason from data, and defend claims with evidence.</div><div class="hub-card-cta">Open ↗</div></a>' +
      '<a class="hub-card" href="#/social-studies"><div class="hub-card-title">Social Studies (6–12)</div><div class="hub-card-desc">Foundations, Teaching with Primary Sources, and the Turner AP World History student app — grouped together.</div><div class="hub-card-cta">Open ↗</div></a></div>';
  }

  // Social Studies sub-hub — groups the three SS resources so they live together
  // instead of scattered across the Secondary Foundations grid.
  function renderSocialStudiesHub(view) {
    view.innerHTML = '<a class="detail-back" href="#/secondary">← Secondary Foundations</a>' +
      '<h1 class="page-title">Social Studies (6–12)</h1>' +
      '<p class="page-lede">Three resources for secondary Social Studies teachers, grouped so you can find them in one place. Start with Foundations if you are building your daily practice, Primary Sources when you are ready to build a document-based lesson, and the AP World app when you are teaching AP or want to see the principles in a live student study tool.</p>' +
      '<div class="hub-grid">' +
      '<a class="hub-card" href="#/secondary-social">' +
        '<div class="hub-card-title">Secondary Social Studies Foundations</div>' +
        '<div class="hub-card-desc">The six core practices for daily Social Studies instruction \u2014 sourcing, corroborating across sources, discussion, annotation, counterclaim, and quoted-evidence exit tickets.</div>' +
        '<div class="hub-card-cta">Open ↗</div></a>' +
      '<a class="hub-card" href="#/primary-sources">' +
        '<div class="hub-card-title">Teaching with Primary Sources</div>' +
        '<div class="hub-card-desc">The full framework \u2014 sourcing, contextualization, close reading, corroboration \u2014 with a verified overview video, the LOC Primary Source Analysis Tool, eight vetted source repositories, five classroom moves, and honest failure modes.</div>' +
        '<div class="hub-card-cta">Open ↗</div></a>' +
      '<a class="hub-card" href="' + esc(AP_WORLD_APP.url) + '" target="_blank" rel="noopener">' +
        '<div class="hub-card-title">' + esc(AP_WORLD_APP.label) + '</div>' +
        '<div class="hub-card-desc">Student study app built on the same principles \u2014 unit targets, success criteria, and annotated SAQ / LEQ / DBQ exemplars for AP World History.</div>' +
        '<div class="hub-card-cta">Open live app ↗</div></a>' +
      '</div>' +
      '<div class="callout" style="margin-top:20px;"><h3>How these three fit together</h3>' +
      '<p><strong>Foundations</strong> is what every Social Studies teacher does daily \u2014 the strategies that show up in every class period across the department. <strong>Teaching with Primary Sources</strong> is the discipline\u2019s highest-leverage move: how to build lessons around real documents that make students think historically instead of memorize. <strong>Turner AP World History</strong> is the live student study app that puts both into practice for one specific course \u2014 unit targets students can see, annotated exemplars they can study, and released-item practice for spaced retrieval. Foundations for the daily work, Primary Sources for the discipline\u2019s core move, AP World for what it looks like in a real course.</p>' +
      '</div>';
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
    var primarySourcesCallout = (key === "social")
      ? '<div class="callout" style="border-left-color:#8a6a1f;background:#fdf6e3;"><h3>New: Teaching with Primary Sources</h3>' +
        '<p>The full framework \u2014 sourcing, contextualization, close reading, corroboration \u2014 with a verified overview video, the Library of Congress analysis tool, eight vetted source repositories (LOC, DocsTeach, DPLA, Eisenhower, Gilder Lehrman, and more), and honest failure modes. Built for U.S. History, World / AP World, Government, and Oklahoma History.</p>' +
        '<p style="margin-top:8px;"><a class="btn primary" href="#/primary-sources">Open the Primary Sources guide \u2192</a></p></div>'
      : "";
    view.innerHTML = '<a class="detail-back" href="#/secondary">← Secondary Foundations</a><h1 class="page-title">' + esc(page.title) + '</h1>' +
      '<p class="page-lede">' + esc(page.lede) + '</p><div class="guide-row">' + sourceLink(page.source) + '</div>' +
      primarySourcesCallout +
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

  // -------------------- Instructional Delivery --------------------
  var DELIVERY = {
    title: "Instructional Delivery",
    lede: "Delivery is how new knowledge and skill get from the teacher into students' long-term memory. It is the teacher-led part of the lesson: explaining, modeling, guided practice, and the handoff to independent work. Clarity is where the lesson is going. Engagement is what students do with the learning. Delivery is how they get the learning in the first place.",
    sources: [
      { label: "Cognitive load theory", title: "Sweller — Cognitive Load During Problem Solving", url: "https://onlinelibrary.wiley.com/doi/10.1207/s15516709cog1202_4" },
      { label: "Guidance for novices", title: "Kirschner, Sweller & Clark (2006) — Why Minimal Guidance During Instruction Does Not Work", url: "https://www.tandfonline.com/doi/abs/10.1207/s15326985ep4102_1" },
      { label: "Principles of Instruction", title: "Rosenshine (2012) — Research-Based Strategies That All Teachers Should Know", url: "https://www.aft.org/sites/default/files/Rosenshine.pdf" },
      { label: "Explicit Instruction", title: "Archer & Hughes — Explicit Instruction: Effective and Efficient Teaching", url: "https://explicitinstruction.org/" },
      { label: "Gradual release", title: "Fisher & Frey — Better Learning Through Structured Teaching (I do / We do / You do together / You do alone)", url: "https://www.ascd.org/books/better-learning-through-structured-teaching-second-edition" }
    ],
    sequence: [
      { min: "~5 min", label: "Retrieval on prior learning", body: "Warm the brain and surface what students already have to build on." },
      { min: "~1 min", label: "State the target", body: "One sentence: what students will know or be able to do by the end." },
      { min: "~10 min", label: "New material in small pieces + think-aloud model", body: "Chunk the content. Model the thinking, not just the answer. Whole-class check every few minutes." },
      { min: "~10-15 min", label: "Guided practice (we do)", body: "Practice together until most students are getting it right. Rosenshine put the bar around 80% success before releasing." },
      { min: "~10-15 min", label: "Release into the Engagement Cycle", body: "Now students Notice, Read, Talk, Solve, Defend, Revise — with the delivery scaffolding in place." },
      { min: "~5 min", label: "Exit check", body: "A quick written or verbal check that tells you who has it and who needs a re-teach tomorrow." }
    ],
    practices: [
      { title: "Retrieval-practice opener", band: "Delivery · Launch", why: "Pulling knowledge from memory strengthens it more than re-reading or re-explaining. It also tells you what students actually retained.", moves: ["Start with 3–5 questions on prior learning students must answer without notes.", "Use whiteboards, index cards, or a quick cold-call round so every student responds.", "Address the two or three items most students missed before moving on."], evidence: "Every student produces a written or spoken response; the teacher acts on what was missed.",
        videos: [
          { url: "https://www.youtube.com/watch?v=vRyaWckh_x8", title: "Teach Like A Champion: Lemov's Do Now Technique", channel: "Curriculum Bytes" },
          { url: "https://www.youtube.com/watch?v=h2Z8WTWgPnw", title: "Daily Reviews", channel: "Mastery Learning Group" },
          { url: "https://www.youtube.com/watch?v=96xBOchLlWk", title: "Making Retrieval Practice a Classroom Routine", channel: "Edutopia" },
          { url: "https://www.youtube.com/watch?v=g7X7ekkuAQo", title: "Teachers Teach Teachers: Retrieval Practice", channel: "Science of Reading Classroom" },
          { url: "https://www.youtube.com/watch?v=PxEcB11doaA", title: "250: Nine Easy Ways to Add Retrieval to Your Lessons", channel: "Cult of Pedagogy" },
          { url: "https://www.youtube.com/watch?v=ZO8abw3DHxs", title: "What is retrieval practice?", channel: "Pooja K. Agarwal, Ph.D." }
        ] },
      { title: "Chunk + model with a think-aloud", band: "Delivery · New material", why: "Working memory is small; novices learn more from watching expert thinking than from being handed a finished product. The 9–12 modeled-writing videos below are the most direct examples of this move for our building focus — a teacher writing an evidence paragraph in front of students, out loud.", moves: ["Break new content into pieces that fit in one whiteboard or one screen.", "Narrate the decisions out loud — 'I'm skipping this quote because it doesn't prove my claim.'", "After each chunk, check before moving on. Never string two new pieces together without a check in between."], evidence: "Students can restate the reasoning, not just the answer. The board or slide shows the process, not only the product.",
        videos: [
          { url: "https://www.youtube.com/watch?v=wbZ2k5j8MFk", title: "9–12: Writing a paragraph with high school ELLs", channel: "Colórin Colorado", note: "HS teacher moves students from a brainstorm to a paragraph on screen, naming the moves." },
          { url: "https://www.youtube.com/watch?v=LDOEjAxSqTc", title: "9–12: How to write a basic history paragraph", channel: "James Couture (West Seattle HS)", note: "HS history teacher walks through the anatomy of an evidence-based paragraph and models one." },
          { url: "https://www.youtube.com/watch?v=hpHKvir4S9U", title: "9–12: High School Social Studies DBQ", channel: "JCPS Digital Learning Channel", note: "HS DBQ lesson: subclaim + evidence as the shape of a body paragraph." },
          { url: "https://www.youtube.com/watch?v=Lw1uLeDLN8g", title: "9–12: Argument Writing — Body Paragraph Format for High School", channel: "Catlin Tucker", note: "Narrated annotation of a high-school argument body paragraph — claim, data, warrant, counterclaim, rebuttal." },
          { url: "https://www.youtube.com/watch?v=qWHt_oyI5Vg", title: "9–12: A Formula for How to Write a LEQ (AP World, APUSH, AP Euro)", channel: "Heimler's History", note: "AP history teacher models the body-paragraph decision sequence: topic sentence, specific evidence, analysis." },
          { url: "https://www.youtube.com/watch?v=BRklGBRU0Vc", title: "9–12: Embed quotes to improve writing flow and voice", channel: "Laura Randazzo", note: "High-school English teacher demonstrates a specific evidence-integration move — the embedded quote." },
          { url: "https://www.youtube.com/watch?v=13Xtw6fYDEg", title: "9–12: DBQ — Building Paragraphs for the DBQ", channel: "History Haven", note: "AP-level DBQ paragraph modeling with documents-as-evidence tied to claims, sourcing, and outside information." },
          { url: "https://www.youtube.com/watch?v=G0ZHimY5YZo", title: "Think Alouds: Modeling Ways to Think About Text", channel: "The Balanced Literacy Diet" },
          { url: "https://www.youtube.com/watch?v=msWdR2nMAg4", title: "Modeling vs. Think Alouds: What's the Difference?", channel: "Smekens Education" },
          { url: "https://www.youtube.com/watch?v=crNzCafZ5E4", title: "Think Aloud | Teaching Tip", channel: "Kyle Thain" },
          { url: "https://www.youtube.com/watch?v=UmhLgsBD1-I", title: "Go beyond a model; reveal a Think Aloud", channel: "Smekens Education" },
          { url: "https://www.youtube.com/watch?v=qg9zpI0RDFM", title: "Use explicit instruction for novice learners — Tips for Teachers", channel: "Tips for Teachers" }
        ] },
      { title: "Every-student checks for understanding", band: "Delivery · Checking", why: "'Any questions?' and 'Does that make sense?' hear from three confident kids. Whole-class checks hear from everyone.", moves: ["Mini whiteboards, cold call, quick written response, or a signal — the format is less important than 'everyone answers'.", "Look at the data before you decide the next move. Wrong-answer patterns tell you what to reteach.", "Ask questions that expose reasoning, not recognition — 'Why did you pick that?' beats 'Is this right?'"], evidence: "Within a 10-minute segment you have visible responses from every student, and your next move responds to what you saw.",
        videos: [
          { url: "https://www.youtube.com/watch?v=KJ1TAH50Coc", title: "Always check for understanding", channel: "Tips for Teachers" },
          { url: "https://www.youtube.com/watch?v=xm0muw3GFtU", title: "Cold-Calling in a Warm Way | Teaching Unpacked with Doug Lemov", channel: "InnerDrive" },
          { url: "https://www.youtube.com/watch?v=S23myw0scw0", title: "Positive and Inclusive Cold-Calling | Teaching Unpacked with Doug Lemov", channel: "InnerDrive" },
          { url: "https://www.youtube.com/watch?v=Biiiey4exW8", title: "How To Use Mini Whiteboards To Check Student Understanding", channel: "InnerDrive" },
          { url: "https://www.youtube.com/watch?v=PBayieSHaK4", title: "Mini-whiteboards - Tips for Teachers Top 5s", channel: "Tips for Teachers" },
          { url: "https://www.youtube.com/watch?v=PRDuwKfmF-0", title: "Effective formative assessment: mini whiteboard routine", channel: "Dixons OpenSource" },
          { url: "https://www.youtube.com/watch?v=2JDRXpvajJw", title: "Increasing Participation With Individual Whiteboards", channel: "Edutopia" }
        ] },
      { title: "Guided practice to ~80% success", band: "Delivery · We do", why: "Independent practice on shaky ground produces the 'skipping we do' failure. Release when most students are getting it right, not when the clock says to.", moves: ["Work the first problem together, thinking aloud.", "Work the second one with students calling out each step.", "Have partners try one while you circulate. Do not release to independent work until you see success from most students."], evidence: "By release, a spot check shows the majority of students producing correct work with reasoning.",
        videos: [
          { url: "https://www.youtube.com/watch?v=z2iNggN__QA", title: "Gradual Release of Responsibility", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=EE5wvi-xQTM", title: "The power of explicit instruction with Anita Archer (Ep 57)", channel: "Chalk & Talk with Anna Stokke" },
          { url: "https://www.youtube.com/watch?v=2qIQLHQTNSQ", title: "Aninta Archer   Explicit Instruction Overview 8/18/2021", channel: "Milton-Union Schools" },
          { url: "https://www.youtube.com/watch?v=ZxUB25omadI", title: "Faded Guidance", channel: "Ochre Education" },
          { url: "https://www.youtube.com/watch?v=35rTqpl9SWk", title: "Procedures and Routines: Prompting, Scaffolding, & Fading", channel: "Easterseals AR Outreach Program & Technology Svcs." },
          { url: "https://www.youtube.com/watch?v=sdIeKv8YYcU", title: "HLP 15: Use Scaffolded Supports", channel: "Council for Exceptional Children" }
        ] },
      { title: "Worked examples → completion problems → independent", band: "Delivery · Practice sequence", why: "Sweller: novices learn more from studying worked examples than from solving problems cold. Expertise reversal says fade the guidance as they gain skill.", moves: ["Show a fully worked example annotated with the thinking.", "Give a partially completed problem with the hard step blanked out.", "Only then move to full problems. In AP or advanced classes, start further down this ladder."], evidence: "The task sequence gets progressively less scaffolded across a lesson or unit; students name what the worked example taught them.",
        videos: [
          { url: "https://www.youtube.com/watch?v=FdOuK1mN39I", title: "Worked Examples | CPD Grab Bag", channel: "Professional Development" },
          { url: "https://www.youtube.com/watch?v=YLza2mk3ZAk", title: "Worked Examples and Fading Scaffolds", channel: "iMediaGenius" },
          { url: "https://www.youtube.com/watch?v=xEzt2926ViU", title: "Explanations in worked examples", channel: "Education Endowment Foundation" },
          { url: "https://www.youtube.com/watch?v=xRM6mmze7Vw", title: "Using worked examples to support pupils' mathematical problem-solving", channel: "Education Endowment Foundation" },
          { url: "https://www.youtube.com/watch?v=gTbgFy9cLis", title: "Worked Examples | A Simple Way To Accelerate Student Learning", channel: "Jared Cooney Horvath" },
          { url: "https://www.youtube.com/watch?v=KwhGofOV5Hs", title: "Making Use of a Worked Example to Improve Learning", channel: "Edutopia" }
        ] },
      { title: "Handoff to the Engagement Cycle", band: "Delivery · Release", why: "Delivery ends when students can carry the work themselves. The Engagement Cycle is where they Notice, Read, Talk, Solve, Defend, and Revise on the ground you just prepared.", moves: ["Name the target one more time before release.", "State the success criteria students will use to check their own work.", "Post the model or worked example so it stays visible during independent work."], evidence: "Independent work begins with more than a handful of students able to start without a second re-teach.",
        videos: [
          { url: "https://www.youtube.com/watch?v=cEIS87uISvs", title: "Gradual Release of Responsibility — Fisher & Frey Interpretation", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=uE_KTMRwbJs", title: "Gradual Release (Modeled-Guided-Independent Practice)", channel: "CitizensAcademyCleve" },
          { url: "https://www.youtube.com/watch?v=Xp4HN9bF3tM", title: "Gradual Release of Responsibility in Action: Classroom Video", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=T4BIu1Jw_1I", title: "Gradual Release of Responsibility: Collaborative Learning", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=KLdP2fzw5RQ", title: "From Guidance to Independence: Teaching Geometry with GRR", channel: "ASCD" },
          { url: "https://www.youtube.com/watch?v=PTotDv1QN8Y", title: "Gradual Release Model for English classrooms sample lesson", channel: "McGraw Hill PreK-12" }
        ] }
    ],
    conceptVideo: { url: "https://www.youtube.com/watch?v=C-dfYyCRJ5E", title: "Explicit Vocabulary Instruction with Anita Archer", channel: "Good to Great Schools Australia", note: "Archer herself modeling explicit instruction with a class — the difference between explicit teaching and lecture is visible from the first minute." },
    conceptVideos: [
          { url: "https://www.youtube.com/watch?v=cjURdvzty4c", title: "Gradual Release of Responsibility", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=uPHDJI17sH4", title: "Rosenshine Masterclass I Intro and Research", channel: "Tom Sherrington" },
          { url: "https://www.youtube.com/watch?v=cp1juLTIdlM", title: "What is Explicit Teaching and Practice in the Gradual Release Model", channel: "The Simple Teachers" },
          { url: "https://www.youtube.com/watch?v=T-e6uHBDdNk", title: "A Gradual Release of Responsibility", channel: "Institute of Education Sciences" }
        ],
    breakdowns: [
      { title: "Skipping 'we do'", body: "You model one problem and assign twenty. This is the most common failure. It shows up as behavior — a student who cannot do the work will find something else to do — but it started in delivery." },
      { title: "Modeling the answer instead of the thinking", body: "Showing a finished paragraph with evidence teaches almost nothing. Narrating the decisions out loud — 'I'm skipping this quote because it doesn't prove my claim' — is what students can copy." },
      { title: "Checking with volunteers", body: "'Any questions?' and 'Does that make sense?' hear from three confident kids. Mini whiteboards, cold call, or a quick written response hear from everyone." },
      { title: "Talking over text-heavy slides", body: "Students cannot read and listen at the same time, so they do neither well. Pare slides to one image or a few words while you talk." },
      { title: "Video plus worksheet standing in for teaching", body: "When the day gets away from you, delivery quietly turns into a video plus a worksheet. That is not delivery — it is holding the room. Every teacher does it once in a while; the trap is when it becomes the pattern." }
    ],
    bySubject: [
      { subject: "Math", body: "Worked examples followed by partially completed ones. Show the decision points out loud, then hand students problems where the hard step is blanked out." },
      { subject: "Science", body: "Model claim–evidence–reasoning from actual data. Think aloud through which data point supports which claim and why the counter-data doesn't disqualify it." },
      { subject: "ELA", body: "Think-aloud through a passage. Show what a strong reader does at a hard sentence, an unfamiliar word, or a paragraph break — not just what they concluded." },
      { subject: "Social studies", body: "Source a document out loud: who wrote this, when, and why should I believe it? Model the questions before the interpretation." }
    ],
    cteRoutine: {
      title: "The demonstration routine — the CTE and electives version of gradual release",
      lede: "Shop, kitchen, studio, gym, and lab classrooms have their own name for the same move. The demonstration routine is I show you → you echo the steps → you do one with a check → you do the rest with me circulating. It is gradual release in a room where the wrong step burns, breaks, spoils, or gets someone hurt.",
      steps: [
        { label: "I show you (full run)", body: "Do the whole procedure at pace once so students see the finished thing. Do not talk over the safety-critical steps — just do them." },
        { label: "I show you again (slowed + narrated)", body: "Repeat the same procedure slowly, narrating the decision at every step. Name the trap — the step people skip, the step that ruins the piece, the step that gets someone hurt." },
        { label: "You echo the steps", body: "Students name the steps back in order before they touch a tool. Cold call the safety-critical ones. If they can't name it, they can't run it yet." },
        { label: "You do one with me watching", body: "Every student does the procedure once while you watch — one at a time in a shop, in pairs in a studio, in a rotation in a kitchen or gym. Correct in the moment, not after." },
        { label: "You do the rest — I circulate", body: "Independent work with the model still visible. Circulate with a spot-check list. First bad rep gets a stop-and-reset, not a mark on a rubric." }
      ]
    },
    cteApplications: [
      { subject: "Ag Mechanics / Welding", body: "Demonstrate the weld once cold-metal to show the motion, once at heat to show the bead, then have students strike a single practice bead on scrap while you watch. Never release to independent runs until the practice bead passes a visual check." },
      { subject: "Culinary", body: "Full demo of the technique — knife cut, sauce, sear — at speed first, then slowed with the trap named ('this is where the fond burns'). Students echo the sequence, run one portion under your eye, then run the batch while you circulate with a taste-and-adjust check." },
      { subject: "Aviation", body: "Ground demonstration of the checklist item at pace, then slowed with each callout narrated. Students verbalize the checklist back before touching the panel. First simulator run is under direct observation; independent practice only after a clean run." },
      { subject: "Art", body: "Show the technique on your own surface — brush loading, glaze, joinery, layout — at speed, then again with the decisions narrated ('I'm lifting here because a heavier line would flatten the shape'). Students try the move on scrap first, then in the piece." },
      { subject: "PE / Athletics", body: "Demonstrate the skill at full speed, then a slow-motion breakdown with the cues named. Every student walks through the pattern once under your eye before live reps. The check for release is the skill executed correctly under low pressure, not the clock." },
      { subject: "Any lab science with equipment", body: "Same routine — full demo, slowed demo with the trap named, echo of the steps, one supervised run, then release. The equipment doesn't care about the pacing guide." }
    ],
    businessPathwayLede: "The Business Pathway courses (Marketing, Entrepreneurship, Personal Finance, Management) don't run on power tools or heat — the room does not enforce the discipline the way a shop does. That means the teaching move has to. The demonstration routine still applies, but the 'thing being modeled' is a decision under real constraints: how to price this product, how to build this pitch, how to read this pay stub, how to lead this team through a change. The good business classroom looks like a live case: teacher models the decision with the reasoning narrated, students echo the reasoning back, then students run their own case with the model still visible while the teacher circulates. What looks like discussion should have documented evidence — a pitch deck, a pro-forma, a budget, an org chart — not just talk.",
    businessPathway: [
      {
        subject: "Marketing",
        body: "Model a real marketing decision out loud — segmentation, positioning, promotion mix — using a live case (a local business, a school problem, or a DECA case study). Show the four-Ps analysis at pace with your reasoning narrated ('I'm choosing this channel because our audience is here'), then slowed with the trap named ('this is where teams pick the tactic before defining the target'). Students run one case in pairs while you circulate; independent role-plays only after the pair case passes a check. Every unit ends with student-produced marketing evidence — a positioning statement, a campaign brief, a pitch — not just a multiple-choice test.",
        video: { url: "https://www.youtube.com/watch?v=wvph6lpfmQo", title: "NC DECA Toolbox Series — Mock Roleplay / Case Study", channel: "NC DECA · Andrew Voelsing (former ICDC champion) walks the full roleplay routine with commentary" },
        okStandards: {
          division: "Oklahoma CareerTech · Marketing Education (ME) · Teacher certification 7501",
          courses: [
            { code: "8602", title: "Marketing Fundamentals" },
            { code: "8607", title: "Sales and Sales Promotion" },
            { code: "8610", title: "Sports and Entertainment Marketing" },
            { code: "8612", title: "Advertising Strategies" },
            { code: "8613", title: "Marketing Research" },
            { code: "8628", title: "Digital Marketing (BITE, ME)" },
            { code: "8614", title: "Intro to Business/Marketing" }
          ],
          framework: "CareerTech Testing Center — Marketing Management standards (Product/Service Creation, Marketing-Information Management, Promotion, Pricing, Selling). The unit-ending student evidence above (positioning statement, campaign brief, pitch) is what these standards actually ask students to do.",
          frameworkUrl: "https://oklahoma.gov/careertech/educators/business-marketing-and-it-education.html",
          coursesUrl: "https://oklahoma.gov/content/dam/ok/en/careertech/educators/business-marketing-and-it-education/program-information/bmite-k12-course-descriptions.pdf"
        },
        resources: [
          { label: "DECA Marketing Career Cluster — free curriculum tools", url: "https://www.deca.org/career-clusters/marketing" },
          { label: "DECA Compete — role-plays and case studies", url: "https://www.deca.org/compete" },
          { label: "MBA Research LAP Modules — free classroom-ready lesson plans (marketing / promotion / selling / pricing)", url: "https://www.mbaresearch.org/local-educators/teaching-resources/lesson-modules/" }
        ]
      },
      {
        subject: "Entrepreneurship",
        body: "The failure mode is the 'business plan project' students complete once and never revisit. Real entrepreneurship teaching is iterative: model a customer-discovery interview, name the trap ('this is where founders pitch instead of listen'), have students echo the question set, then send them out to run one interview under your eye before the full round. The model of a good pitch stays visible while students build theirs. Grade the reasoning — did the pivot follow from the evidence? — not the polish of the deck. VentureLab and NFTE both organize around the entrepreneurial mindset, not the finished plan.",
        video: { url: "https://www.youtube.com/watch?v=Gp5XpYcTvk4", title: "Mindset Makers Series: Establishing an Entrepreneurial Culture in Your Classroom", channel: "NFTE · Free monthly educator PD webinar, October 2025 (~1 hr)" },
        okStandards: {
          division: "Oklahoma CareerTech · BITE and Marketing Education (ME)",
          courses: [
            { code: "8179", title: "Intro to Entrepreneurship (BITE)" },
            { code: "8616", title: "Entrepreneurship (ME)" },
            { code: "8617", title: "Advanced Entrepreneurship (BITE, ME)" },
            { code: "8620", title: "Entrepreneurship Awareness (ME)" },
            { code: "0911", title: "Entrepreneur end-of-program assessment" }
          ],
          framework: "National Content Standards for Entrepreneurship Education, used by the CareerTech 0911 Entrepreneur end-of-program assessment. Domains: Entrepreneurial Processes (Discovery / Concept Development / Resourcing / Actualization / Harvesting), Entrepreneurial Traits/Behaviors, Business Foundations, plus functional areas (Marketing, Financial, HR, Information, Operations, Risk, Strategic Management). Customer-discovery-first teaching above targets the Discovery and Concept Development standards directly.",
          frameworkUrl: "https://oklahoma.gov/content/dam/ok/en/careertech/testing-centers/testing/study-guides/entrepreneur-sg.pdf",
          coursesUrl: "https://oklahoma.gov/content/dam/ok/en/careertech/educators/business-marketing-and-it-education/program-information/bmite-k12-course-descriptions.pdf"
        },
        resources: [
          { label: "NFTE — Entrepreneurship Education & Entrepreneurial Mindset resources", url: "https://www.nfte.com/entrepreneurship-education/" },
          { label: "VentureLab — Topics in Entrepreneurship Part 1 (free curriculum, grades 6–12)", url: "https://venturelab.org/curriculum/" },
          { label: "Junior Achievement — JA Company Program (students launch a real business)", url: "https://jausa.ja.org/programs/ja-company-program" }
        ]
      },
      {
        subject: "Personal Finance",
        body: "The failure mode is teaching personal finance as vocabulary and worksheets. What good looks like is the teacher deciding a real financial decision in front of students — filling out a real W-4, opening a real (or realistic) savings account, comparing two actual credit-card offers — with the reasoning narrated. Students then run one decision under your eye using a live source (a real pay stub, a real lease, a real loan disclosure) before the assignment. Assessment produces a decision with a defended reason, not a matching-terms quiz. NGPF has done the curriculum work; the teacher move is to keep the decisions real.",
        video: { url: "https://www.youtube.com/watch?v=yawJVu_L2uM", title: "Teacher Tip — INTERACTIVE: How Much Will Your College Actually Cost?", channel: "Next Gen Personal Finance · NGPF Fellow Amanda Volz shows how she runs the resource in her classroom" },
        okStandards: {
          division: "Oklahoma State Department of Education · Passport to Financial Literacy Act of 2007 (70 O.S. § 11-103.6h) · Graduation requirement, grades 7–12",
          courses: [
            { code: "8178", title: "Personal Finance (BITE) — explicitly aligned to the Passport standards" },
            { code: "8118", title: "Business & Personal Finance (BITE)" },
            { code: "8120", title: "Banking & Financial Services (BITE)" },
            { code: "8180", title: "Math of Finance (BITE)" }
          ],
          framework: "PASS — 14 Areas of Instruction: 1) Earning an Income · 2) State/Federal Taxes · 3) Banking & Financial Services · 4) Balancing a Checkbook · 5) Saving & Investing · 6) Planning for Retirement · 7) Loans & Borrowing (incl. predatory lending) · 8) Interest, Credit Cards & Online Commerce · 9) Identity Fraud & Theft · 10) Renting vs. Buying a Home · 11) Insurance · 12) Financial Impact of Gambling · 13) Bankruptcy · 14) Charitable Giving. Every student must satisfactorily demonstrate all 14 to graduate. The 'real decision' teaching above targets Standards 1, 4, 5, 7, 8, and 10 directly — the ones students hit within a year of graduation.",
          frameworkUrl: "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/personal-financial-literacy/Introduction%20Guide%20to%20the%20Curriculum.pdf",
          coursesUrl: "https://oklahoma.gov/content/dam/ok/en/careertech/educators/business-marketing-and-it-education/program-information/bmite-k12-course-descriptions.pdf"
        },
        resources: [
          { label: "NGPF Semester Course — full free personal finance curriculum", url: "https://www.ngpf.org/courses/semester-course/" },
          { label: "NGPF Video Library — hundreds of classroom-ready, vetted videos", url: "https://www.ngpf.org/video-library/" },
          { label: "EconEdLink (Council for Economic Education) — free personal finance lessons", url: "https://econedlink.org/" },
          { label: "Oklahoma PASSport to Personal Financial Literacy Curriculum — free state-aligned lessons for all 14 standards", url: "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/personal-financial-literacy/Introduction%20Guide%20to%20the%20Curriculum.pdf" }
        ]
      },
      {
        subject: "Management",
        body: "Management is where the demonstration routine is most likely to be skipped — the temptation is to lecture the four functions (plan, organize, lead, control) and move on. What good looks like is the teacher walking through a real management decision (scheduling a shift, coaching an underperformer, running a stand-up, delegating a task) with the reasoning narrated, then students echoing the framework back, then running their own decision in a role-play or case with the model still visible. Assessment is a defended management decision — an org chart with reasoning, a coaching script, a delegation memo — not the definition of 'span of control.' Anchor the course to the National Business Education Standards so students see the discipline, not just the buzzwords.",
        video: { url: "https://www.youtube.com/watch?v=oxt9Lz79he8", title: "Learn High School Principles of Business: Functions and Responsibilities of Management", channel: "LEARN SKN · Kyle Flanders — walks the four functions of management at a high-school level" },
        okStandards: {
          division: "Oklahoma CareerTech · Business Management and Administration Career Cluster · BITE and ME programs",
          courses: [
            { code: "8606", title: "Business Management and Supervision (ME)" },
            { code: "8105", title: "Office Administration & Management (BITE)" },
            { code: "8254", title: "Business Foundations (BITE) — introduces the Business Management & Administration cluster" },
            { code: "8629", title: "Ethical Leadership (BITE, ME)" },
            { code: "8177", title: "Business Communications (BITE)" }
          ],
          framework: "CareerTech Testing Center — Business Foundations standards (role of business, ethical practices, management concepts, functional-area overview) and Human Resource Management standards (Organizing, Staffing, Training/Development, Morale/Motivation, Assessment). The 'defended management decision' teaching above targets HR Management standards J1–J26 (delegate responsibility, coach employees, exhibit leadership, encourage team building, assess employee performance) directly instead of leaving them as vocabulary.",
          frameworkUrl: "https://oklahoma.gov/careertech/educators/career-clusters/bus-mgmt-admin.html",
          coursesUrl: "https://oklahoma.gov/content/dam/ok/en/careertech/educators/business-marketing-and-it-education/program-information/bmite-k12-course-descriptions.pdf"
        },
        resources: [
          { label: "MBA Research LAP Modules — management, business admin, ethical leadership", url: "https://www.mbaresearch.org/local-educators/teaching-resources/lesson-modules/" },
          { label: "NBEA — National Business Education Curriculum Standards", url: "https://www.nbea.org/business-education-curriculum-standards" },
          { label: "Junior Achievement — JA Company Program (students run and manage a real venture)", url: "https://jausa.ja.org/programs/ja-company-program" }
        ]
      }
    ],
    lookFors: [
      "The teacher models thinking, not just answers — students can hear the decisions being made.",
      "Every student produces a response during at least one check for understanding.",
      "Guided practice happens before independent work; students see 'we do' before they see 'you do'.",
      "When independent work starts, the model or worked example is still visible.",
      "In the first three minutes of independent work, most students are engaged and working — not stuck."
    ]
  };

  function stepCard(step, i) {
    return '<article class="card" style="border-left:4px solid #D4A537;padding-left:16px;">' +
      '<div class="card-meta">Step ' + (i + 1) + ' · ' + esc(step.min) + '</div>' +
      '<h3 class="card-title">' + esc(step.label) + '</h3>' +
      '<p>' + esc(step.body) + '</p></article>';
  }

  function breakdownCard(b) {
    return '<article class="card">' +
      '<div class="card-meta" style="color:#B23A48;font-weight:600;">Common breakdown</div>' +
      '<h3 class="card-title">' + esc(b.title) + '</h3>' +
      '<p>' + esc(b.body) + '</p></article>';
  }

  function subjectCard(s) {
    return '<article class="card">' +
      '<h3 class="card-title">' + esc(s.subject) + '</h3>' +
      '<p>' + esc(s.body) + '</p></article>';
  }

  function cteStepCard(step, i) {
    return '<article class="card" style="border-left:4px solid #0A2540;padding-left:16px;">' +
      '<div class="card-meta">Step ' + (i + 1) + '</div>' +
      '<h3 class="card-title">' + esc(step.label) + '</h3>' +
      '<p>' + esc(step.body) + '</p></article>';
  }

  // Business-pathway card — richer than a subject card: what-good-looks-like body,
  // one lazy-loaded verified video, and a list of authoritative resource links.
  function businessCourseCard(c) {
    var resourcesHtml = "";
    if (Array.isArray(c.resources) && c.resources.length) {
      resourcesHtml = '<div style="margin-top:10px;">' +
        '<div style="font-weight:600;font-size:0.88em;color:#0A2540;margin-bottom:6px;">Anchor resources</div>' +
        '<ul style="margin:0;padding-left:18px;font-size:0.92em;line-height:1.5;">' +
        c.resources.map(function (r) {
          return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + ' ↗</a></li>';
        }).join("") + '</ul></div>';
    }
    var okHtml = "";
    if (c.okStandards) {
      var s = c.okStandards;
      var coursesLi = (s.courses || []).map(function (co) {
        return '<li><strong>OCAS ' + esc(co.code) + '</strong> — ' + esc(co.title) + '</li>';
      }).join("");
      var links = [];
      if (s.frameworkUrl) links.push('<a href="' + esc(s.frameworkUrl) + '" target="_blank" rel="noopener">Framework source ↗</a>');
      if (s.coursesUrl) links.push('<a href="' + esc(s.coursesUrl) + '" target="_blank" rel="noopener">BMITE course descriptions ↗</a>');
      okHtml = '<div style="margin-top:14px;padding-top:12px;border-top:1px dashed #d4a537;">' +
        '<div style="font-weight:600;font-size:0.88em;color:#0A2540;margin-bottom:6px;">Oklahoma standards alignment</div>' +
        '<div style="font-size:0.88em;color:#4a4a4a;margin-bottom:6px;"><em>' + esc(s.division) + '</em></div>' +
        (coursesLi ? '<ul style="margin:0 0 8px;padding-left:18px;font-size:0.9em;line-height:1.5;">' + coursesLi + '</ul>' : "") +
        (s.framework ? '<p style="margin:0 0 6px;font-size:0.9em;line-height:1.5;color:#333;">' + esc(s.framework) + '</p>' : "") +
        (links.length ? '<div style="font-size:0.85em;">' + links.join(' · ') + '</div>' : "") +
        '</div>';
    }
    return '<article class="card" style="border-left:4px solid #0A2540;padding-left:16px;">' +
      '<div class="card-meta">Business Pathway</div>' +
      '<h3 class="card-title">' + esc(c.subject) + '</h3>' +
      '<p>' + esc(c.body) + '</p>' +
      (c.video ? youtubeEmbed(c.video) : "") +
      resourcesHtml +
      okHtml +
      '</article>';
  }

  // Mapping table — reconciles the Daily Plan lesson names (Do Now / I Do / We Do / You Do / Closure / Exit Ticket)
  // with the Delivery page's evidence-based labels. Same lesson, two vocabularies.
  function lessonMapTable() {
    var rows = [
      ["Do Now / Warm-up", "Retrieval on prior learning", "~5 min", "3–5 questions on yesterday's target, answered without notes. Every student responds."],
      ["State the target", "State the target", "~1 min", "One sentence a student can restate. Refer back at every transition."],
      ["I Do (Model)", "New material in small pieces + think-aloud", "~10 min", "Chunk the content. Narrate the decisions, not just the answer. Check before moving on."],
      ["We Do (Guided practice)", "Guided practice to ~80% success", "~10–15 min", "Practice together until most students are getting it right. Do not release on the clock — release on the data. Rosenshine's 80% bar lives here."],
      ["You Do (Independent practice)", "Release into the Engagement Cycle", "~10–15 min", "Independent work happens here — this is where Notice, Read, Talk, Solve, Defend, Revise live, on the ground you just prepared."],
      ["Closure", "Handoff cue", "~2–3 min", "Name the target once more. State the success criteria students will self-check against."],
      ["Exit Ticket", "Exit check", "~3–5 min", "One target-aligned question every student answers. Sort tonight into got-it / partial / not-yet. Uses tomorrow's Do Now."]
    ];
    var head = '<tr><th style="text-align:left;padding:8px;border-bottom:2px solid #D4A537;">Daily Plan name</th>' +
               '<th style="text-align:left;padding:8px;border-bottom:2px solid #D4A537;">Delivery page name</th>' +
               '<th style="text-align:left;padding:8px;border-bottom:2px solid #D4A537;">Time</th>' +
               '<th style="text-align:left;padding:8px;border-bottom:2px solid #D4A537;">What it means</th></tr>';
    var body = rows.map(function (r) {
      return '<tr>' + r.map(function (c, i) {
        return '<td style="padding:8px;border-bottom:1px solid #e5e7eb;vertical-align:top;">' + esc(c) + '</td>';
      }).join("") + '</tr>';
    }).join("");
    return '<div class="card" style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;min-width:640px;border-collapse:collapse;font-size:0.95em;">' +
      '<thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  function renderInstructionalDelivery(view) {
    var page = DELIVERY;
    view.innerHTML = '<h1 class="page-title">' + esc(page.title) + '</h1>' +
      '<p class="page-lede">' + esc(page.lede) + '</p>' +

      '<div class="callout" style="background:#F6F1E4;border-left:4px solid #0A2540;"><h3>Where this fits in your plan</h3>' +
      '<p>This page is the teacher guide behind the <a href="#/daily-plan">Daily Plan template</a>. Every move you fill in on I Do, We Do, or You Do has an evidence base and a routine here. Pair it with the <a href="#/clarity">Clarity page</a> — clarity sets where the lesson is going; delivery is how you get students there. When you need a specific move, search the <a href="#/strategies">Strategy Library</a> or hit <a href="#/pick-for-me">Pick for Me</a>.</p>' +
      '</div>' +

      '<div class="callout"><h3>Explicit instruction is not lecture</h3>' +
      '<p>Lecture delivers content and hopes it sticks. Explicit instruction comes in short chunks, with frequent checks where every student responds, and it keeps adjusting based on what those checks show.</p>' +
      conceptVideoBlock(page) +
      '</div>' +

      '<h2 class="section-title">The evidence base</h2>' +
      '<p>The research is unusually consistent. It comes from three directions that agree with each other: cognitive load theory, the Kirschner–Sweller–Clark critique of minimal guidance, and Rosenshine\'s Principles of Instruction. Archer &amp; Hughes and Fisher &amp; Frey turn that research into classroom routines.</p>' +
      '<div class="guide-row">' + page.sources.map(sourceLink).join("") + '</div>' +

      '<h2 class="section-title">A strong delivery sequence — 50-minute WHS period</h2>' +
      '<p>In 50 minutes (45 on Mondays), a strong delivery sequence maps cleanly onto Teaching → Engagement → Learning without changing the framework.</p>' +
      '<div class="card-grid">' + page.sequence.map(stepCard).join("") + '</div>' +

      '<h2 class="section-title">Same lesson, two vocabularies</h2>' +
      '<p>The <a href="#/daily-plan">Daily Plan template</a> uses gradual-release names (Do Now, I Do, We Do, You Do, Closure, Exit Ticket) because those are the names on your walkthrough form and the ones staff learned first. This page uses evidence-based names (retrieval opener, model, guided practice, release into the Engagement Cycle, handoff, exit check) because they name the move, not the slot. They are the same lesson.</p>' +
      lessonMapTable() +
      '<p style="margin-top:12px;font-size:0.95em;color:#4a4a4a;">The 80% release check lives in <strong>We Do / Guided practice</strong>. Do not release to You Do until a quick spot-check shows most students producing correct work — not because 20 minutes have passed.</p>' +

      '<h2 class="section-title">Core delivery moves</h2>' +
      '<p style="margin-top:0;">Each move below has a matching entry you can pull into a plan. Open the <a href="#/strategy/modeling">Modeling (I Do) library entry</a> or the <a href="#/strategy/tlac30-14-show-call">Show Call entry</a> for a printable version of the routine.</p>' +
      page.practices.map(practiceCard).join("") +

      '<h2 class="section-title">Where delivery breaks down</h2>' +
      '<p>Read these as self-checks. If one sounds familiar in your own room this week, that is not a judgment — it is data. The move to fix it is on this page.</p>' +
      '<div class="card-grid">' + page.breakdowns.map(breakdownCard).join("") + '</div>' +

      '<div class="callout" style="border-left:4px solid #D4A537;"><h3>A five-minute self-check</h3>' +
      '<p>Watch your own first three minutes of independent work. If more than a handful of students are stuck or haven\'t started, the problem happened upstream in delivery, not in engagement. You can see it in ten minutes and it points straight to a next move — usually going back to We Do for another round before releasing.</p></div>' +

      '<div class="callout" style="border-left:4px solid #B03A2E;"><h3>Delivery is not the same as engagement</h3>' +
      '<p>Strong delivery gets students to a task worth doing. If the task itself is Level 1 recall, no amount of modeling will make the work matter. Before you plan the delivery moves for a lesson, run the two-minute check on the task itself — behavioral engagement without cognitive engagement is just orderly busywork.</p>' +
      '<p style="margin-bottom:0;"><a href="#/engagement-vs-busywork">Open Engagement vs. Busywork — six red flags and the repair moves →</a></p></div>' +

      '<h2 class="section-title">Delivery by subject — core academics</h2>' +
      '<p>The move is the same; the content is different. The literacy focus runs through all four, because modeling how to write with evidence is itself a delivery move.</p>' +
      '<div class="card-grid">' + page.bySubject.map(subjectCard).join("") + '</div>' +

      '<h2 class="section-title">Delivery in electives and CTE</h2>' +
      '<div class="callout" style="background:#F6F1E4;"><h3>' + esc(page.cteRoutine.title) + '</h3>' +
      '<p>' + esc(page.cteRoutine.lede) + '</p></div>' +
      '<div class="card-grid">' + page.cteRoutine.steps.map(cteStepCard).join("") + '</div>' +
      '<h3 class="section-title" style="font-size:1.1em;margin-top:24px;">How the routine looks in each discipline</h3>' +
      '<div class="card-grid">' + page.cteApplications.map(subjectCard).join("") + '</div>' +

      '<h2 class="section-title">Business Pathway (CTE) — what good teaching looks like</h2>' +
      '<div class="callout" style="background:#F6F1E4;"><p>' + esc(page.businessPathwayLede) + '</p></div>' +
      '<div class="card-grid">' + page.businessPathway.map(businessCourseCard).join("") + '</div>' +

      '<h2 class="section-title">The sequencing rule for the Engagement Cycle</h2>' +
      '<div class="callout">' +
      '<p>The Engagement Cycle — Notice, Read, Talk, Solve, Defend, Revise — is what students do on the ground your delivery prepared. It is not a replacement for teaching new material.</p>' +
      '<p>The rule is simple: <strong>teach before Defend.</strong> A short Notice hook before teaching is defensible — productive failure research (Kapur) shows it can help, as long as explicit instruction follows and builds on what students tried. A full Notice → Read → Talk sequence with no teaching until Defend is not, at least for students who are still building the reading or the background knowledge to make it through. Heavy guidance for novices, fading as students gain expertise. Advanced classes can start further down the ladder; on-level and behind classes cannot.</p></div>' +

      '<h2 class="section-title">See it applied in an AP course</h2>' +
      '<div class="callout">' +
      '<p>The <a href="' + esc(AP_WORLD_APP.url) + '" target="_blank" rel="noopener">' + esc(AP_WORLD_APP.label) + ' app ↗</a> is a student study app built on the same principles as this page. Unit lessons are framed around a clear historical-thinking target; annotated SAQ, LEQ, and DBQ exemplars show what mastery looks like before students attempt it; released items anchor spaced retrieval. Use it as a reference for what these delivery principles sound like when the discipline is AP World History. (The classroom-facing guided-practice and retrieval-opener features described on this page are being added to the app; the exemplar and target work is already live.)</p>' +
      '</div>' +

      '<h2 class="section-title">What to look for in the room</h2>' +
      '<div class="card"><ul class="check-list">' + page.lookFors.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';

    wireLazyYouTube();
  }

  // -------------------- Clarity --------------------
  var CLARITY = {
    title: "Clarity",
    lede: "Clarity is where the lesson is going and how students will know they got there. It is the destination made visible. Delivery is how students get the learning; engagement is what they do with it; clarity is the reason the whole trip has a point. When clarity is missing, everything downstream — pacing, checks, feedback, grading — gets harder for no good reason.",
    sources: [
      { label: "Visible Learning", title: "Hattie — teacher clarity as one of the highest-leverage practices", url: "https://visible-learning.org/hattie-ranking-influences-effect-sizes-learning-achievement/" },
      { label: "Formative assessment", title: "Wiliam — Embedded Formative Assessment (learning intentions & success criteria)", url: "https://www.dylanwiliamcenter.com/" },
      { label: "Teacher Clarity Playbook", title: "Fisher, Frey, Amador & Assof — The Teacher Clarity Playbook", url: "https://us.corwin.com/books/teacher-clarity-playbook-9781544369518" },
      { label: "Learning targets", title: "Moss & Brookhart — Learning Targets: Helping Students Aim for Understanding", url: "https://www.ascd.org/books/learning-targets" }
    ],
    conceptVideo: { url: "https://www.youtube.com/watch?v=oEVQLZ6ZZHQ", title: "Learning Targets in a Thinking Classroom", channel: "Building Thinking Classrooms", note: "A short primer on why students need to see where the lesson is going before they start it." },
    conceptVideos: [
          { url: "https://www.youtube.com/watch?v=zZL6Zf5lMVw", title: "An introduction to formative assessment", channel: "Dylan Wiliam" },
          { url: "https://www.youtube.com/watch?v=fC29IyqPVr0", title: "Strategy 1: Clarifying, Sharing, and Understanding Learning Intentions", channel: "LSI: Learning Sciences International" },
          { url: "https://www.youtube.com/watch?v=dvzeou_u2hM", title: "John Hattie Learning Intentions & Success Criteria", channel: "Lori Loehr" },
          { url: "https://www.youtube.com/watch?v=OGyvDvOegXE", title: "John Hattie Learning Intentions and Success Criteria", channel: "Lori Loehr" },
          { url: "https://www.youtube.com/watch?v=xXd7KGKSaXg", title: "Teacher Clarity: Effective Teaching Using Learning Intentions, Success Criteria, and Self-Reflection", channel: "SBCUSD" },
          { url: "https://www.youtube.com/watch?v=u6qCzBlJaYk", title: "Introduction to Teacher Clarity: Learning Intentions and Success Criteria", channel: "Corwin" }
        ],
    principles: [
      { title: "Aim, not activity", body: "A clear target names what students will know or be able to do, not what they will do to get there. 'Analyze the causes of the French Revolution' is a target. 'Read the packet and answer the questions' is an activity." },
      { title: "Visible from the start", body: "If students cannot say what they are learning and how they will know, the target is not clear yet. Post it, restate it, and refer back to it during the lesson." },
      { title: "Success criteria beat rubrics on the day", body: "A rubric grades the finished product. Success criteria describe what a strong response looks like while students are still making it. Both have a place; only success criteria change the work in progress." },
      { title: "Model the finish line", body: "Students do better work when they have seen strong work of the same kind. One annotated exemplar is worth more than three paragraphs of directions." }
    ],
    practices: [
      { title: "Share the learning target in student language", band: "Clarity · Aim", why: "When students can say what they are learning and why, they orient the rest of the lesson around it. When they cannot, activities feel random and effort drifts.", moves: ["Write the target on the board in one sentence, in language a student can restate.", "Say it, point to it, and have two students paraphrase it before the first activity.", "Refer back to it at each transition and at the exit check."], evidence: "A random student, cold-called, can restate the target in their own words at the middle and end of the lesson.",
        videos: [
          { url: "https://www.youtube.com/watch?v=k-8037IMQNQ", title: "PLPs \u2013 Establishing Learning Targets", channel: "SREBvideo" },
          { url: "https://www.youtube.com/watch?v=sLzAaYJkwQU", title: "TELL Project: Developing Learning Targets", channel: "TELL Project" },
          { url: "https://www.youtube.com/watch?v=luEhXBpOuQY", title: "Teacher Clarity: Learning Intentions", channel: "We Are Weiser" },
          { url: "https://www.youtube.com/watch?v=G4uM9K5uZXo", title: "Learning Targets and Essential Questions Training Video from Carson-Dellosa", channel: "Carson Dellosa Education" }
        ] },
      { title: "Co-construct success criteria", band: "Clarity · How they'll know", why: "Success criteria turn a target into checkable behavior. Wiliam's work shows that when students build them with the teacher, they use them — to self-check, to peer-check, and to revise.", moves: ["Show two responses — one strong, one weak — and ask students what makes the strong one work.", "Capture the criteria on the board in student language. Keep to three or four.", "Have students self-check against the criteria before they hand work in."], evidence: "Students name the criteria without prompting; work quality visibly rises against those criteria over the week.",
        videos: [
          { url: "https://www.youtube.com/watch?v=YcJdZGz6ifY", title: "Dylan Wiliam: Assessment strategies", channel: "Education Scotland" },
          { url: "https://www.youtube.com/watch?v=4goerO8tp8U", title: "Co-Constructing Success Criteria  in an Elementary School Classroom", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=2poWb2Tm4UA", title: "What can co-constructing criteria look like in a classroom?", channel: "Tracy Rosen" },
          { url: "https://www.youtube.com/watch?v=CM_HbQRUNnk", title: "Co-constructing Success Criteria with High School Students", channel: "Fisher and Frey" },
          { url: "https://www.youtube.com/watch?v=FUZJ6Ce08Ks", title: "Success Criteria", channel: "Susan Elliott" },
          { url: "https://www.youtube.com/watch?v=q8DaMpJ6xoQ", title: "Ten Minute Team Tip:  Using Exemplars to Help Students Spot Success Criteria", channel: "Ten Minute Team Tips with Bill Ferriter" }
        ] },
      { title: "Show a model of quality work", band: "Clarity · What good looks like", why: "Directions describe the task. A model shows the finish line. Students who have seen an exemplar produce stronger drafts and revise more sharply.", moves: ["Bring a real student exemplar (name removed) that shows what mastery looks like for this task.", "Annotate it live — label the moves that make it strong.", "Also show a not-yet exemplar and ask students what would move it up. This makes the criteria concrete."], evidence: "Students can point to features of the exemplar that match the success criteria; drafts start closer to the target than a no-model baseline.",
        videos: [
          { url: "https://www.youtube.com/watch?v=oXjA60zLmZI", title: "Inspiring Excellence: Using Models and Critique to Create Works of Quality", channel: "EL Education" },
          { url: "https://www.youtube.com/watch?v=E_6PskE3zfQ", title: "Austin's Butterfly: Models, Critique, and Descriptive Feedback", channel: "EL Education" },
          { url: "https://www.youtube.com/watch?v=KFzfSuvzm9g", title: "Critique and Feedback: Management in the Active Classroom", channel: "EL Education" },
          { url: "https://www.youtube.com/watch?v=AmnyqtO3ZE8", title: "Improving Writing Skills Through Exemplar Work Analysis", channel: "Nathan De Groot" }
        ] },
      { title: "Make the why visible", band: "Clarity · Relevance", why: "'Why are we learning this?' deserves a real answer. When students can name a reason that holds up, effort and persistence rise. When they cannot, compliance replaces learning.", moves: ["Prepare a one-sentence 'why this matters' that is honest — to the discipline, to the world, to the next unit — not just 'it's on the test.'", "Connect the target to something students already care about, know, or will use.", "Come back to the 'why' at closure, not just at the launch."], evidence: "Students, asked why the lesson matters, give a specific answer that is not 'because it's on the test' or 'because you said so.'",
        videos: [
          { url: "https://www.youtube.com/watch?v=9oEW0gP3wLY", title: "4 Ways I Connect My Classroom to the Real World", channel: "Teach Your Class Off" },
          { url: "https://www.youtube.com/watch?v=4nllbi6Eqyc", title: "Ways to Create Authentic Experiences in the Classroom", channel: "SREBvideo" },
          { url: "https://www.youtube.com/watch?v=M2BZ7GsEbPM", title: "HOW TO MAKE LEARNING RELEVANT TO YOUR STUDENTS (AND WHY IT\u2019S CRUCIAL TO THEIR SUCCESS)", channel: "Ruths Straight Talk" }
        ] },
      { title: "End-of-lesson clarity check", band: "Clarity · Close the loop", why: "Closure is where clarity is confirmed or exposed. If most students cannot answer a target-aligned check at the end of the lesson, the lesson did not land — regardless of how it felt.", moves: ["Ask a target-aligned exit question every student answers in writing.", "Sort responses into 'got it', 'partial', 'not yet' before you leave the room.", "Name tomorrow's re-teach based on what you saw, not on the pacing guide."], evidence: "An exit sort exists for the lesson; the next day's opening reflects what the sort revealed.",
        videos: [
          { url: "https://www.youtube.com/watch?v=Woro-dWwfHo", title: "8 Closing Activities to Wrap Up a Lesson", channel: "Edutopia" },
          { url: "https://www.youtube.com/watch?v=IvQxrBlVtAE", title: "Teacher Toolkit: Exit Ticket", channel: "ESC Region 13" },
          { url: "https://www.youtube.com/watch?v=gBTpojxwOgU", title: "Exit Tickets: Management in the Active Classroom", channel: "EL Education" },
          { url: "https://www.youtube.com/watch?v=ehvVCkFdZUs", title: "Exit ticket | Guided + Timed | Classroom Activity (8 minutes total)", channel: "Active Learning Guides" },
          { url: "https://www.youtube.com/watch?v=6Z1P2544iXE", title: "Exit Tickets | Retrieval & Assessment | Strategy Explainer", channel: "The Practitioner Playbook" }
        ] }
    ],
    breakdowns: [
      { title: "Confusing activity with target", body: "'Today we will finish the packet' is not a target. It is a task. If a substitute could read it and know what students should learn, it is not a target either — it is a plan." },
      { title: "Posted and forgotten", body: "Writing the objective on the board at the start of class and never mentioning it again does nothing. Reference it three times: launch, transition, close." },
      { title: "Standards language dumped on students", body: "State standards are written for adults. Translate the target into student language before you post it. If you would not say it out loud that way, do not write it that way." },
      { title: "Criteria known only to the teacher", body: "If only the teacher knows what a strong response looks like, students are guessing. Make success criteria visible before students start work — not after they turn it in." },
      { title: "No closure", body: "Lessons that end with the bell, with no target-aligned check, leave the teacher without data and students without a sense of where they landed." }
    ],
    walkthroughDiagnostic: "Stop three random students during the last third of class and ask, 'What are you learning right now and how will you know you got it?' If most cannot answer both parts, the lesson had a clarity problem — not an engagement problem.",
    bySubject: [
      { subject: "Math", body: "Target names the concept or skill, not the page. Success criteria describe what a correct explanation or annotated solution shows." },
      { subject: "Science", body: "Target names the phenomenon or reasoning move. Success criteria describe what a defensible claim looks like given the data students have." },
      { subject: "ELA", body: "Target names the thinking (analyze a shift in tone; support a claim with evidence) rather than the passage. Exemplars show strong reasoning against a shared text." },
      { subject: "Social studies", body: "Target names the historical thinking (sourcing, corroboration, causation) rather than the topic. Exemplars show a claim that survives the counter-evidence." }
    ],
    lookFors: [
      "Students can restate today's learning target in their own words when asked.",
      "Success criteria are visible before students start independent work — not after.",
      "At least one exemplar of the kind of work students are producing is visible in the room.",
      "The teacher refers back to the target at least twice during the lesson, including at closure.",
      "A target-aligned check happens before students leave, and the teacher acts on what it showed."
    ]
  };

  function principleCard(p) {
    return '<article class="card">' +
      '<h3 class="card-title">' + esc(p.title) + '</h3>' +
      '<p>' + esc(p.body) + '</p></article>';
  }

  function renderClarity(view) {
    var page = CLARITY;
    view.innerHTML = '<h1 class="page-title">' + esc(page.title) + '</h1>' +
      '<p class="page-lede">' + esc(page.lede) + '</p>' +

      '<div class="callout"><h3>The two-part test</h3>' +
      '<p>Clarity is present when a random student, at any point in the lesson, can answer two questions: <em>What are you learning right now?</em> and <em>How will you know you got it?</em> If most students cannot answer both, the lesson has a clarity problem — no matter how engaged the room looks.</p>' +
      conceptVideoBlock(page) +
      '</div>' +

      '<h2 class="section-title">The evidence base</h2>' +
      '<p>Clarity is one of the most consistently high-leverage practices in the research. Hattie ranks teacher clarity among the strongest general influences on achievement; Wiliam frames the daily version as learning intentions and success criteria; Fisher &amp; Frey turn it into a playbook; Moss &amp; Brookhart make the case for the daily learning target as the classroom unit.</p>' +
      '<div class="guide-row">' + page.sources.map(sourceLink).join("") + '</div>' +

      '<h2 class="section-title">Four principles</h2>' +
      '<div class="card-grid">' + page.principles.map(principleCard).join("") + '</div>' +

      '<h2 class="section-title">Core clarity moves</h2>' +
      page.practices.map(practiceCard).join("") +

      '<h2 class="section-title">Where clarity breaks down</h2>' +
      '<p>These are the patterns you will likely see on walkthroughs.</p>' +
      '<div class="card-grid">' + page.breakdowns.map(breakdownCard).join("") + '</div>' +

      '<div class="callout" style="border-left:4px solid #D4A537;"><h3>The best walkthrough diagnostic</h3>' +
      '<p>' + esc(page.walkthroughDiagnostic) + '</p></div>' +

      '<h2 class="section-title">Clarity by subject</h2>' +
      '<p>The principle is the same; what a good target sounds like changes with the discipline.</p>' +
      '<div class="card-grid">' + page.bySubject.map(subjectCard).join("") + '</div>' +

      '<h2 class="section-title">How clarity connects to Delivery and Engagement</h2>' +
      '<div class="callout">' +
      '<p>Clarity, Delivery, and the Engagement Cycle are three moves in one lesson, not three separate lessons. Clarity sets the destination. Delivery gets students onto the road. The Engagement Cycle is what they do on the road — Notice, Read, Talk, Solve, Defend, Revise — with the target and criteria in view the whole way. A clear target with weak delivery still fails. Strong delivery toward a fuzzy target still fails. The three move together.</p>' +
      '<p style="margin:8px 0 0;"><a href="#/delivery">Open the Instructional Delivery page →</a></p>' +
      '</div>' +

      '<h2 class="section-title">See it applied in an AP course</h2>' +
      '<div class="callout">' +
      '<p>The <a href="' + esc(AP_WORLD_APP.url) + '" target="_blank" rel="noopener">' + esc(AP_WORLD_APP.label) + ' app ↗</a> is a live example of clarity in an AP classroom. Each unit is framed around a clear historical-thinking target, success criteria are visible before students start work, and exemplars of strong short-answer and DBQ responses are annotated so students can see what quality looks like before they attempt it. Use it as a reference for what clarity sounds like when the target is a discipline-specific reasoning move, not a topic.</p>' +
      '</div>' +

      '<h2 class="section-title">What to look for in the room</h2>' +
      '<div class="card"><ul class="check-list">' + page.lookFors.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';

    wireLazyYouTube();
  }


  // ---------------- Why backward planning ----------------
  function renderWhyBackwardPlanning(view) {
    var primaryVideo = {
      url: "https://www.youtube.com/watch?v=6Cagh0H7PPA",
      title: "Understanding by Design with Grant Wiggins (4 min overview)",
      channel: "Avenues The World School"
    };
    var deeperVideos = [
      { url: "https://www.youtube.com/watch?v=4isSHf3SBuQ",
        title: "Grant Wiggins — Understanding by Design (1 of 2)",
        channel: "Avenues The World School" },
      { url: "https://www.youtube.com/watch?v=vgNODvvsgxM",
        title: "Grant Wiggins — Understanding by Design (2 of 2)",
        channel: "Avenues The World School" },
      { url: "https://www.youtube.com/watch?v=Hv138l0HqTA",
        title: "Understanding by Design with Jay McTighe (SYS Presents)",
        channel: "SYS Education" }
    ];

    var stageWhy = [
      { stage: "Stage 1 · Standards",
        why: "Everything downstream — assessments, daily work, evidence — has to point back to a standard. Skip this and the unit becomes activities in search of a purpose." },
      { stage: "Stage 2 · Assessment Design",
        why: "The assessment is the evidence you'll accept that the standard was met. Design it now so your daily lessons rehearse the thinking it demands — not surprise students with it in Week 4." },
      { stage: "Stage 3 · Daily Engagement",
        why: "Only now, with the target and the evidence in view, do we choose daily moves. Every strategy on this page should be one a student would use on the Stage 2 assessment." },
      { stage: "Stage 4 · Visible Evidence",
        why: "Daily moves have to leave a trail you can see mid-unit. If you can't name what proficiency looks like in student work and student talk now, you won't recognize it in time to adjust." },
      { stage: "Stage 5 · Instructional Response",
        why: "Collecting evidence without a response plan is just data. Decide now what you'll do when the evidence says students are stuck, ahead, or split — so the response is fast, not improvised." },
      { stage: "Stage 6 · Student Achievement",
        why: "The whole point of backward planning is a defensible answer to 'did they get there?' Name the bar now, then use the after-unit reflection to sharpen the next round." }
    ];

    var forwardVsBackward = [
      { move: "Where you start",
        forward: "Open the textbook, pick a chapter or a favorite activity.",
        backward: "Open the Oklahoma standard and read what students must know, do, and transfer." },
      { move: "When you design the assessment",
        forward: "Write the test the weekend before it's given.",
        backward: "Draft the summative first, then work back to the daily work that rehearses it." },
      { move: "What daily lessons are for",
        forward: "Cover the material.",
        backward: "Rehearse the exact thinking the assessment will require." },
      { move: "What 'evidence' means",
        forward: "The grade at the end.",
        backward: "Student work, student talk, and check-ins during the unit — with a planned response." },
      { move: "How you know it worked",
        forward: "Kids seemed engaged; most passed.",
        backward: "A named proficiency bar was hit, on the assessment you designed to prove it." }
    ];

    var failureModes = [
      { title: "Activities in search of a purpose",
        body: "A rich task, a great video, a fun project — with no line back to what students are being asked to know or do on the standard. Fun does not equal learning." },
      { title: "Surprise summative",
        body: "The test asks students to analyze, compare, or defend — but daily work only asked them to recall and label. The gap between daily thinking and assessed thinking is where scores drop." },
      { title: "Evidence you can't see until it's over",
        body: "No mid-unit check that would have told you the reteach was needed. The first time you know most students missed it is when you're grading." },
      { title: "Data with no response",
        body: "Exit tickets collected, patterns visible — and tomorrow's lesson looks exactly like it would have anyway. Backward design demands the response is built into the plan." }
    ];

    view.innerHTML =
      '<h1 class="page-title">Why backward planning</h1>' +
      '<p class="page-lede">The Unit Planner walks you through six stages in a specific order. That order isn\'t arbitrary — it\'s the backward-design logic Grant Wiggins and Jay McTighe laid out in <em>Understanding by Design</em>. This page is the short version of why the order matters, with a 4-minute Wiggins video that says it in his own words.</p>' +

      '<div class="callout"><h3>Backward, in one sentence</h3>' +
      '<p>Decide what proficient looks like <strong>first</strong>. Design the evidence you\'ll accept <strong>second</strong>. Only then plan the daily lessons — so every day is rehearsal for what the assessment will demand.</p>' +
      '<p style="margin:8px 0 0;color:#4a4a4a;font-size:0.95em;"><em>Or, in Wiggins\'s framing: identify desired results → determine acceptable evidence → plan learning experiences and instruction.</em></p>' +
      '</div>' +

      '<h2 class="section-title">Wiggins in 4 minutes</h2>' +
      '<p>The clearest short version of backward design, from Grant Wiggins himself:</p>' +
      '<div style="max-width:720px;">' + youtubeEmbed(primaryVideo) + '</div>' +

      '<h2 class="section-title">Why the order matters, stage by stage</h2>' +
      '<p>The Unit Planner\'s six stages are backward design applied to daily practice. Here\'s the one-line case for why each stage sits where it sits:</p>' +
      '<div class="card-grid">' +
      stageWhy.map(function (s) {
        return '<div class="card"><h3 class="subsection-title" style="margin-top:0;color:#BC9124;">' + esc(s.stage) + '</h3>' +
               '<p>' + esc(s.why) + '</p></div>';
      }).join("") +
      '</div>' +

      '<h2 class="section-title">Forward planning vs. backward planning</h2>' +
      '<p>The difference isn\'t abstract. It shows up in every planning decision you make:</p>' +
      '<div class="card" style="padding:0;overflow:hidden;">' +
      '<table style="width:100%;border-collapse:collapse;font-size:0.94em;">' +
      '<thead><tr style="background:#FBF8EE;">' +
      '<th style="text-align:left;padding:10px 12px;border-bottom:2px solid #E9DFC4;width:22%;">Move</th>' +
      '<th style="text-align:left;padding:10px 12px;border-bottom:2px solid #E9DFC4;width:39%;">Forward planning</th>' +
      '<th style="text-align:left;padding:10px 12px;border-bottom:2px solid #E9DFC4;width:39%;color:#BC9124;">Backward planning</th>' +
      '</tr></thead><tbody>' +
      forwardVsBackward.map(function (r) {
        return '<tr>' +
               '<td style="padding:10px 12px;border-bottom:1px solid #EFEADB;vertical-align:top;font-weight:600;">' + esc(r.move) + '</td>' +
               '<td style="padding:10px 12px;border-bottom:1px solid #EFEADB;vertical-align:top;color:#6b6555;">' + esc(r.forward) + '</td>' +
               '<td style="padding:10px 12px;border-bottom:1px solid #EFEADB;vertical-align:top;">' + esc(r.backward) + '</td>' +
               '</tr>';
      }).join("") +
      '</tbody></table></div>' +

      '<h2 class="section-title">What goes wrong when you plan forward</h2>' +
      '<p>These are the four patterns walkthroughs catch again and again. If any sound familiar, the fix is upstream — in the planning order, not in the lesson delivery.</p>' +
      '<div class="card-grid">' +
      failureModes.map(function (f) {
        return '<div class="card"><h3 class="subsection-title" style="margin-top:0;">' + esc(f.title) + '</h3>' +
               '<p>' + esc(f.body) + '</p></div>';
      }).join("") +
      '</div>' +

      '<h2 class="section-title">The three-question audit</h2>' +
      '<p>Before a unit goes live, run it against these three questions. If any answer is no, back up one stage.</p>' +
      '<div class="card"><ol style="margin:0;padding-left:20px;line-height:1.7;">' +
      '<li><strong>Does the assessment actually require the verb in the standard?</strong> If the standard says <em>analyze</em> and the summative is multiple-choice recall, the assessment doesn\'t match the target.</li>' +
      '<li><strong>Would the daily work rehearse the thinking the assessment demands?</strong> If daily work is Costa Level 1 and the assessment is Level 2/3, students will walk into it cold.</li>' +
      '<li><strong>Is there a planned response when evidence shows students aren\'t there yet?</strong> Named students, named piece, named time, named recheck — not "review as needed."</li>' +
      '</ol></div>' +

      '<h2 class="section-title">Go deeper</h2>' +
      '<p>If the 4-minute video sold you and you want the full Wiggins workshop, or McTighe\'s framing of the three stages, these are the primary sources:</p>' +
      '<div style="max-width:720px;">' + youtubeEmbedList(deeperVideos) + '</div>' +

      '<h2 class="section-title">Sources</h2>' +
      '<div class="card"><ul style="margin:0;padding-left:20px;line-height:1.7;">' +
      '<li>Wiggins, G. &amp; McTighe, J. (2005). <em>Understanding by Design</em> (2nd ed.). ASCD. — the foundational text for the three-stage backward design framework.</li>' +
      '<li>McTighe, J. &amp; Wiggins, G. (2012). <a href="https://files.ascd.org/staticfiles/ascd/pdf/siteASCD/publications/UbD_WhitePaper0312.pdf" target="_blank" rel="noopener">Understanding by Design® Framework (ASCD White Paper) ↗</a>.</li>' +
      '<li>Wiggins, G. (2012). <a href="https://www.youtube.com/watch?v=4isSHf3SBuQ" target="_blank" rel="noopener">Understanding by Design workshop (Part 1) ↗</a>. Avenues The World School.</li>' +
      '<li>Wiggins, G. (2013). <a href="https://www.youtube.com/watch?v=vgNODvvsgxM" target="_blank" rel="noopener">Understanding by Design workshop (Part 2) ↗</a>. Avenues The World School.</li>' +
      '<li>McTighe, J. (2023). <a href="https://www.youtube.com/watch?v=Hv138l0HqTA" target="_blank" rel="noopener">Understanding by Design with Jay McTighe ↗</a>. SYS Presents: Adventures in Online Education.</li>' +
      '</ul></div>' +

      '<div class="callout" style="border-left:4px solid #D4A537;margin-top:24px;">' +
      '<p style="margin:0;"><strong>Ready to plan a unit?</strong> Open the <a href="#/unit-plan">Unit Planner</a> and work through the six stages in order. It auto-saves as you type and exports to Word for your PLC binder.</p>' +
      '</div>';

    wireLazyYouTube();
  }


  // ---------------- Engagement vs. Busywork ----------------
  function renderEngagementVsBusywork(view) {
    var videos = [
      { url: "https://www.youtube.com/watch?v=YqKK4vXIQpE",
        title: "Is it Compliance or Engagement?",
        channel: "Eric Sheninger" },
      { url: "https://www.youtube.com/watch?v=AgPZOdsEgno",
        title: "Kim Bearden: Engagement vs Compliance",
        channel: "Innovative Schools Summit" },
      { url: "https://www.youtube.com/watch?v=-R4YAaIIYN4",
        title: "Cognitive Engagement",
        channel: "Envision" },
      { url: "https://www.youtube.com/watch?v=JRdw-mtNFZM",
        title: "Costa's Levels of Thinking and Questioning",
        channel: "LWashingtonHayfield" }
    ];

    var redFlags = [
      {
        flag: "High compliance, low thinking",
        tell: "Every student is on task, quiet, moving pencils — but a stranger walking in could not name the learning target from what students are producing.",
        repair: "Add a Costa Level 2/3 prompt that requires the task's content to answer. If the answer is a category, list, or one-word recall, the task is Level 1. Rewrite the prompt to compare, explain, justify, or apply."
      },
      {
        flag: "No success criteria the student can use",
        tell: "Students ask \"how many sentences?\" or \"is this enough?\" — they can't self-check because they don't know what a good answer looks like.",
        repair: "Post 2–3 concrete criteria before students start (\"cites the source, explains cause and effect, uses two unit terms correctly\"). Have students self-mark against them mid-task and again at closure."
      },
      {
        flag: "No student decision inside the task",
        tell: "Every student's finished product looks identical — same order, same answers, same length. The task removed all choice.",
        repair: "Give students a decision the content forces: which source to cite, which two examples to compare, which claim to defend. The decision is where the thinking lives."
      },
      {
        flag: "Product weight beats process weight",
        tell: "Colored borders, illustrations, cover pages, or formatting matter more to the grade than the reasoning does.",
        repair: "Grade the reasoning move (evidence + explanation), not the decoration. If the product still needs a visual, make it summarize the reasoning — a labeled diagram, an annotated map, a cause-effect chain."
      },
      {
        flag: "Repeats a Level 1 move students already own",
        tell: "Students who already know the vocabulary or facts finish in three minutes; students who don't, still can't do the task.",
        repair: "Move the Level 1 recall into a two-minute retrieval opener, then spend the block on a Level 2/3 task that requires those facts to be true. Now the recall serves the thinking instead of replacing it."
      },
      {
        flag: "Talking looks like discussion, not thinking",
        tell: "Table talk is polite and on-topic but students agree with each other's first answer and move on. No one is defending or revising a claim.",
        repair: "Give the talk a job: \"Find one place your partner's answer needs more evidence.\" Or use a Notice → Talk → Defend structure where students have to name what changed their mind."
      }
    ];

    var swaps = [
      { busywork: "Copy the definitions of ten vocabulary words.",
        engagement: "Use six of the ten terms to explain what is happening in this photograph, and mark two terms that did not fit and why." },
      { busywork: "Color the countries on the map.",
        engagement: "Annotate the map with three causes of the trade route's growth; cite one source for each cause." },
      { busywork: "Answer questions 1–20 at the end of the chapter.",
        engagement: "Pick the two questions you think are hardest. Answer them, and explain what a wrong answer would look like and why." },
      { busywork: "Fill in the blank worksheet from the video.",
        engagement: "Watch the video, then write the one sentence you would tell an absent student is the main idea. Cite one moment from the video that proves it." },
      { busywork: "Complete 30 practice problems.",
        engagement: "Do problems 1–5. Then write the rule you used and try one problem the rule should not work on. Explain why." },
      { busywork: "Take notes on the lecture.",
        engagement: "Take notes in two columns: what the teacher said on the left, your Level 2/3 question about it on the right. We open with three of your questions tomorrow." }
    ];

    function redFlagCard(rf) {
      return '<div class="card" style="border-left:4px solid #B03A2E;">' +
        '<div class="card-title" style="color:#B03A2E;">Red flag · ' + esc(rf.flag) + '</div>' +
        '<p><strong>What you see:</strong> ' + esc(rf.tell) + '</p>' +
        '<p style="margin-bottom:0;"><strong>Do this instead:</strong> ' + esc(rf.repair) + '</p>' +
        '</div>';
    }

    function swapRow(s) {
      return '<tr>' +
        '<td style="padding:10px 12px;border-top:1px solid #e5e0d0;vertical-align:top;background:#FBF3E4;">' + esc(s.busywork) + '</td>' +
        '<td style="padding:10px 12px;border-top:1px solid #e5e0d0;vertical-align:top;background:#F0F5EA;">' + esc(s.engagement) + '</td>' +
        '</tr>';
    }

    var subjectSwaps = [
      {
        subject: "ELA",
        busywork: "Look up the definitions of 15 vocabulary words and write them out.",
        engagement: "Read the passage. Rank the 15 vocabulary words by how much the author needed them to make her argument \u2014 top 5, middle 5, bottom 5. Defend your top 5 with a line from the text.",
        why: "Ranking with textual evidence forces reading the passage, weighing importance, and citing \u2014 all Level 2/3. Definitions are still learned along the way."
      },
      {
        subject: "Math",
        busywork: "Complete 30 factoring problems from the textbook.",
        engagement: "Do problems 1\u20135. Write the rule you used. Design one problem that looks like it should factor by that rule but doesn't \u2014 and explain the trap.",
        why: "Making a non-example requires understanding the rule's boundary conditions. 5 problems + a trap teaches more than 30 blind reps."
      },
      {
        subject: "Science",
        busywork: "Fill in the parts of the cell on a diagram.",
        engagement: "Given three cells (plant, animal, bacteria), predict which one survives each of three environments and why. Use organelle functions to defend each prediction.",
        why: "Applying organelle function to a novel scenario is Level 3; students still learn the parts, but the parts have a job to do."
      },
      {
        subject: "Social Studies",
        busywork: "Take Cornell notes on the Industrial Revolution chapter.",
        engagement: "As you read, pick the ONE invention you would keep if you had to erase the other four from history. Cite two effects from the chapter to defend your choice, and name one effect that argues against you.",
        why: "Weighing evidence for and against a claim is the historian's move (HIPP, sourcing). Notes still happen; they have a purpose."
      },
      {
        subject: "CTE (Ag/Welding, Culinary, Aviation, etc.)",
        busywork: "Copy the safety checklist for the equipment.",
        engagement: "Given three photos of setups that violate the checklist in different ways, identify each violation, rank them by risk, and write the one sentence you would say to the operator first.",
        why: "Ranking by risk requires understanding <em>why</em> each rule exists, not just what it says. Matches the demonstration routine on the Delivery page."
      },
      {
        subject: "PE",
        busywork: "Run laps until the bell.",
        engagement: "Do the workout of the day. Track heart rate at three points. Compare today's recovery time to last week's and explain what changed \u2014 sleep, nutrition, effort, or fitness gain.",
        why: "Applying knowledge of the FITT principle to their own body data is Level 3. Physical work still happens; students own why they're doing it."
      },
      {
        subject: "Art",
        busywork: "Color inside the lines of the printed template.",
        engagement: "Choose one of three color palettes for this composition. Justify the choice with a principle we studied (complementary, analogous, monochromatic) and explain what mood it creates.",
        why: "Choice + defense with vocabulary is Level 2/3. Craft still matters; students learn to talk about it like artists."
      },
      {
        subject: "Music",
        busywork: "Copy the note names onto the staff worksheet.",
        engagement: "Listen to two performances of the same piece. Notate the two places they interpret differently, and explain which version serves the composer's intent better and why.",
        why: "Comparing interpretations against composer intent is Level 3 analysis. Notation is a tool; the comparison is the point."
      }
    ];

    function subjectCard(s) {
      return '<div class="card" style="border-left:4px solid #0A2540;">' +
        '<div class="card-title" style="color:#0A2540;">' + esc(s.subject) + '</div>' +
        '<p style="margin:6px 0;"><span style="color:#B03A2E;font-weight:600;">Busywork:</span> ' + esc(s.busywork) + '</p>' +
        '<p style="margin:6px 0;"><span style="color:#2E7D32;font-weight:600;">Engagement:</span> ' + esc(s.engagement) + '</p>' +
        '<p style="margin:8px 0 0;font-size:0.9em;color:#4a4a4a;"><em>Why it works:</em> ' + s.why + '</p>' +
        '</div>';
    }

    function subjectRow(s) {
      return '<tr>' +
        '<td style="padding:8px 10px;border-top:1px solid #e5e0d0;vertical-align:top;font-weight:600;width:18%;">' + esc(s.subject) + '</td>' +
        '<td style="padding:8px 10px;border-top:1px solid #e5e0d0;vertical-align:top;background:#FBF3E4;width:41%;">' + esc(s.busywork) + '</td>' +
        '<td style="padding:8px 10px;border-top:1px solid #e5e0d0;vertical-align:top;background:#F0F5EA;width:41%;">' + esc(s.engagement) + '</td>' +
        '</tr>';
    }

    view.innerHTML =
      '<h1 class="page-title">Engagement vs. Busywork</h1>' +
      '<p class="page-lede">If we are honest about it, a lot of what we call &ldquo;engagement&rdquo; is compliance. Students are moving pencils. Nothing is actually being thought. This page names the difference and gives you six ways to catch it in your own room this week.</p>' +

      '<div class="callout" style="background:#F6F1E4;border-left:4px solid #0A2540;"><h3>The frame</h3>' +
      '<p><strong>Behavioral engagement</strong> is what a walkthrough sees — students on task, hands moving, no one off-topic. It is necessary. It is not sufficient.</p>' +
      '<p><strong>Cognitive engagement</strong> is what the student is doing with the content in their head — comparing, explaining, justifying, applying, revising. It is the thing you actually care about, and it is invisible unless the task makes it visible.</p>' +
      '<p style="margin-bottom:0;">The operational test on this campus is <strong>Costa\'s Levels of Thinking</strong>. If the task can be finished at Level 1 — recall, define, identify — then behavioral engagement is all you are getting, no matter how orderly the room looks. If finishing the task <em>requires</em> a Level 2 or Level 3 move (compare, explain, justify, evaluate, apply, hypothesize), the compliance you see is also cognitive engagement. That is the bar.</p>' +
      '</div>' +

      '<p style="margin:16px 0 8px;"><strong>See it:</strong></p>' +
      youtubeEmbedList(videos) +

      '<h2 class="section-title">Six red flags for busywork</h2>' +
      '<p>Read these as self-checks. If one sounds familiar, it is not a judgment — it is data. Each flag has a repair move you can use tomorrow.</p>' +
      '<div class="card-grid">' + redFlags.map(redFlagCard).join("") + '</div>' +

      '<h2 class="section-title">Same task, two versions</h2>' +
      '<p>These pairs use the same content and roughly the same amount of student time. The left column stops at Level 1. The right column forces Level 2/3 to finish.</p>' +
      '<div style="overflow-x:auto;">' +
      '<table style="width:100%;border-collapse:collapse;margin-top:8px;">' +
      '<thead><tr>' +
      '<th style="text-align:left;padding:10px 12px;background:#B03A2E;color:#fff;width:50%;">Busywork (Level 1 only)</th>' +
      '<th style="text-align:left;padding:10px 12px;background:#2E7D32;color:#fff;width:50%;">Engagement (requires Level 2/3)</th>' +
      '</tr></thead>' +
      '<tbody>' + swaps.map(swapRow).join("") + '</tbody>' +
      '</table>' +
      '</div>' +

      '<h2 class="section-title">Subject-specific swaps</h2>' +
      '<p>The move is the same across subjects — add a decision, force Costa Level 2/3 to finish. Here is what that looks like in your discipline.</p>' +
      '<div class="card-grid">' + subjectSwaps.map(subjectCard).join("") + '</div>' +

      '<h3 class="section-title" style="font-size:1.1em;margin-top:20px;">Quick reference — all subjects at a glance</h3>' +
      '<div style="overflow-x:auto;">' +
      '<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:0.92em;">' +
      '<thead><tr>' +
      '<th style="text-align:left;padding:8px 10px;background:#0A2540;color:#fff;width:18%;">Subject</th>' +
      '<th style="text-align:left;padding:8px 10px;background:#B03A2E;color:#fff;width:41%;">Busywork</th>' +
      '<th style="text-align:left;padding:8px 10px;background:#2E7D32;color:#fff;width:41%;">Engagement</th>' +
      '</tr></thead>' +
      '<tbody>' + subjectSwaps.map(subjectRow).join("") + '</tbody>' +
      '</table>' +
      '</div>' +

      '<h2 class="section-title">The two-minute check</h2>' +
      '<div class="callout">' +
      '<p>Before you hand out an assignment, ask the two questions in order:</p>' +
      '<ol style="margin:8px 0 8px 20px;">' +
      '<li><strong>What Costa level does finishing this task require?</strong> If the honest answer is Level 1, either move it to a warm-up (see the <a href="#/delivery">Delivery page</a>) or add a prompt that forces Level 2/3.</li>' +
      '<li><strong>What decision does the student have to make?</strong> If there is no decision — no source to weigh, no example to pick, no claim to defend — the task is finishable without thinking. Add one.</li>' +
      '</ol>' +
      '<p style="margin-bottom:0;">If both answers are strong, the task is engagement. If either is weak, you have busywork with a nice cover page.</p>' +
      '</div>' +

      '<h2 class="section-title">Where this fits in the Toolkit</h2>' +
      '<div class="callout" style="background:#F6F1E4;">' +
      '<ul style="margin:0 0 0 20px;">' +
      '<li><a href="#/clarity">Clarity</a> gives you the target and success criteria. If those are Level 1, no delivery move will save the task.</li>' +
      '<li><a href="#/delivery">Instructional Delivery</a> is how you get students to a Level 2/3 task without leaving them stranded. Explicit instruction first, then release.</li>' +
      '<li><a href="#/daily-plan">Daily Plan template</a> — plug the repair moves into We Do and You Do; use retrieval openers to move the Level 1 recall out of the main task.</li>' +
      '<li><a href="#/rigor">Rigor &amp; Questioning</a> — Costa question stems for Level 2 and 3 you can drop into any subject.</li>' +
      '</ul>' +
      '</div>';

    wireLazyYouTube();
  }


  // -------------------- Teaching with Primary Sources --------------------
  // Content-first page like Clarity / Delivery. Framework + one real overview
  // video (National History Day / Library of Congress, 2025) + a real reading
  // (LOC's official Primary Source Analysis Tool + Getting Started guide) +
  // a curated set of source repositories with verified URLs.
  var PRIMARY_SOURCES = {
    title: "Teaching with Primary Sources",
    lede: "A primary source is a piece of evidence created at the time under study \u2014 a photograph, a letter, a treaty, a diary page, a political cartoon, a piece of legislation, a home movie. Teaching with primary sources is not \"add a document to the packet.\" It is teaching students how historians actually work: source it, put it in context, read it closely, and check it against other sources. That set of moves is what the field calls historical thinking, and it is teachable.",
    sources: [
      { label: "Library of Congress", title: "Getting Started with Primary Sources \u2014 Teachers portal", url: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/" },
      { label: "Library of Congress", title: "Primary Source Analysis Tool (PDF)", url: "https://www.loc.gov/static/programs/teachers/getting-started-with-primary-sources/documents/Primary_Source_Analysis_Tool_LOC.pdf" },
      { label: "Digital Inquiry Group (Stanford)", title: "Historical Thinking Chart \u2014 sourcing, contextualization, corroboration, close reading", url: "https://www.inquirygroup.org/history-lessons/historical-thinking-chart" },
      { label: "National Archives", title: "DocsTeach \u2014 primary sources and analysis activities from NARA", url: "https://www.docsteach.org/" },
      { label: "Sam Wineburg", title: "Historical Thinking and Other Unnatural Acts \u2014 the foundational argument for teaching sourcing", url: "https://tupress.temple.edu/books/historical-thinking-and-other-unnatural-acts" }
    ],
    conceptVideo: {
      url: "https://www.youtube.com/watch?v=PBZEqq4ftJY",
      title: "Using Library of Congress Resources to Build a Historical Argument \u2014 Webinar 1: Historical Thinking",
      channel: "National History Day",
      note: "National History Day and the Library of Congress, January 2025. About 87 minutes \u2014 sit down with it once as PD. Walks the four historical thinking moves (sourcing, contextualization, close reading, corroboration) using the Boston Massacre engraving, the Constitution, and Civil Rights\u2013era images. This is the single best free overview a teacher can watch before teaching with documents."
    },
    principles: [
      { title: "Source before you read", body: "The first question is never \"what does this say?\" It is \"who made this, when, for whom, and why?\" A photograph, a speech, and a textbook paragraph about the same event carry different weight depending on that answer. Sourcing is the habit that separates historical thinking from just reading old stuff." },
      { title: "Context is not decoration", body: "A document without context is a puzzle piece with no picture. Students need enough background \u2014 the year, the tensions, the audience, the medium \u2014 to hear the document the way its first readers heard it. Skip context and students project the present onto the past." },
      { title: "Corroborate across sources, not inside one", body: "One document is a claim. Two documents in agreement is stronger. Two documents in disagreement is the actual work of history. Build lessons around at least two sources on the same event so students have to weigh them, not just summarize the one you handed out." },
      { title: "Excerpt honestly, cite fully", body: "Most classroom-length primary sources are excerpts. Cut for length, never for meaning \u2014 and tell students you cut it. Show the full citation (creator, date, repository, URL) every time. Students learn from your citation habits as much as from the document." }
    ],
    practices: [
      { title: "Teach a repeatable analysis routine", band: "Primary sources \u00b7 Framework",
        why: "Students need a set of moves they run on every document, not a new worksheet for every unit. The Library of Congress \"Observe \u2014 Reflect \u2014 Question\" routine and the SHEG four moves (sourcing, contextualization, close reading, corroboration) are the two most widely used. Pick one, use it every time, and students internalize it by mid-year.",
        moves: [
          "Post the routine where students can see it. Use the same three or four prompts every time you hand out a document.",
          "Model the routine out loud on the first two documents of the year \u2014 what you notice, what you wonder, what you would need to know to trust it.",
          "Move students to doing it in pairs, then independently, over the first quarter. The goal is a habit, not a worksheet score."
        ],
        evidence: "Cold-called mid-lesson, a student can name the routine and where they are in it \u2014 not just what the document says."
      },
      { title: "Pair two sources on the same event", band: "Primary sources \u00b7 Corroboration",
        why: "One document does not teach corroboration \u2014 by definition. When students see two accounts of the same event that do not fully agree, they have to make a defensible judgment about which is more trustworthy and why. That is the move AP history exams score and it is the move real historians make.",
        moves: [
          "Choose two short sources on the same event that disagree or emphasize different facts. Two paragraphs each is enough.",
          "Have students annotate each source separately using the routine, then complete a two-column comparison before you discuss.",
          "Ask the corroboration question directly: 'Where do these agree, where do they conflict, and which do you trust more \u2014 and why?'"
        ],
        evidence: "Student written responses reference both sources by name and explain which they weight more heavily \u2014 not just summaries side by side."
      },
      { title: "Use images and objects, not only text", band: "Primary sources \u00b7 Access",
        why: "Photographs, political cartoons, propaganda posters, maps, and artifacts open the door for students who struggle with archaic prose. They are not remedial \u2014 they are legitimate primary sources with their own analytical demands (composition, symbolism, audience, medium). Use them early in the year to teach the routine before you add hard text.",
        moves: [
          "Start units with an image or object whenever possible. Run the same analysis routine you use for text.",
          "Teach students to read composition and symbolism: who is centered, who is small, what is exaggerated, what is left out.",
          "Only after students can source and analyze the image do you hand them the paired document. The image builds the schema the text needs."
        ],
        evidence: "Students write about images with the same specificity they use for text \u2014 naming the creator, the year, and at least two specific choices the creator made."
      },
      { title: "Excerpt to about 200\u2013400 words, keep the citation whole", band: "Primary sources \u00b7 Access",
        why: "Length is the most common reason document lessons collapse. A one-page excerpt with clear paragraph breaks, defined vocabulary in brackets, and a complete citation gives students something they can actually read closely in a class period. Long excerpts turn into skim jobs.",
        moves: [
          "Aim for 200\u2013400 words per document for a class-period lesson; shorter for middle school and struggling readers.",
          "Mark ellipses honestly where you cut. Define hard words in brackets in-line rather than in a glossary they will not check.",
          "Print the full citation on the handout: creator, title, date, repository, URL. Students learn what a real citation looks like from seeing yours."
        ],
        evidence: "Students can quote a specific line and cite it correctly. Reading behavior on the document looks like reading, not skimming."
      },
      { title: "Write from the evidence, not around it", band: "Primary sources \u00b7 Argument",
        why: "The reason to run these lessons is not the document itself \u2014 it is the argument students build from it. Every primary-source lesson should end in writing that quotes at least one source and defends a claim. That is the same move AP DBQ and OAS argument writing require, at every grade level.",
        moves: [
          "End the lesson with a short written response: one paragraph, one claim, at least one quoted line of evidence, one sentence of reasoning.",
          "Score against a criterion the students saw before they wrote: 'claim + quoted evidence + one sentence explaining why the evidence supports the claim.'",
          "Read three responses out loud (with permission) the next day \u2014 a strong one, a partial one, and a not-yet one \u2014 and name what moves each one up."
        ],
        evidence: "Written responses cite specific evidence from the source, not general summaries. Quality visibly rises against the criterion over the semester."
      }
    ],
    repositories: [
      { name: "Library of Congress \u2014 Teachers", url: "https://www.loc.gov/programs/teachers/",
        what: "The biggest free primary-source library in the U.S., with teacher-built classroom materials, primary-source sets by topic, and the official Primary Source Analysis Tool.",
        good_for: "American history, immigration, civil rights, WWI/WWII posters, presidential papers, maps, photographs. Start here." },
      { name: "DocsTeach \u2014 National Archives", url: "https://www.docsteach.org/",
        what: "NARA's free platform: thousands of federal records tagged by era and topic, plus ready-to-run analysis activities you can assign to students.",
        good_for: "U.S. government, treaties, court cases, military records, immigration files, WPA records \u2014 the actual paper trail of the federal government." },
      { name: "Digital Inquiry Group (formerly SHEG)", url: "https://www.inquirygroup.org/history-lessons",
        what: "Reading Like a Historian lesson library: over 100 free document-based lessons for U.S. and world history, each built around a compelling central question and 2\u20135 primary sources.",
        good_for: "Ready-to-teach lessons when you do not have time to build one from scratch. Free with a teacher account." },
      { name: "Digital Public Library of America \u2014 Primary Source Sets", url: "https://dp.la/primary-source-sets",
        what: "Curated sets of 10\u201315 primary sources on a single topic, with a teacher guide and student discussion questions for each set.",
        good_for: "Cross-repository topical sets \u2014 e.g. Dust Bowl migration, the Harlem Renaissance, women\u2019s suffrage \u2014 that pull from many archives at once." },
      { name: "Eisenhower Presidential Library \u2014 Education", url: "https://www.eisenhowerlibrary.gov/education",
        what: "Classroom materials, document sets, and virtual programs (IKE Online) built from the Eisenhower archive: WWII, D-Day, the Cold War, civil rights, the interstate system.",
        good_for: "Kansas connection, WWII and Cold War units, presidential decision-making case studies. Live virtual programs for K\u201312 classes." },
      { name: "National Museum of African American History and Culture \u2014 Learning Lab", url: "https://learninglab.si.edu/org/nmaahc",
        what: "Smithsonian primary-source collections and teacher-built learning lab activities focused on African American history and culture.",
        good_for: "Reconstruction, Jim Crow, Great Migration, civil rights movement, contemporary Black history. Sources you will not find in a standard textbook." },
      { name: "Gilder Lehrman Institute \u2014 Primary Source Collection", url: "https://www.gilderlehrman.org/history-resources/primary-sources",
        what: "Over 85,000 primary sources on American history from the Gilder Lehrman Collection, with essays and lesson plans by leading historians.",
        good_for: "American history from the founding through the twentieth century \u2014 letters, manuscripts, pamphlets, and photographs, many with expert commentary." },
      { name: "World Digital Library / UNESCO", url: "https://www.wdl.org/",
        what: "Global primary sources hosted by the Library of Congress and UNESCO: manuscripts, maps, films, and photographs from partner libraries worldwide.",
        good_for: "World history and AP World \u2014 non-U.S. sources on the Silk Road, colonization, world religions, and modern global history." }
    ],
    breakdowns: [
      { title: "The document as decoration", body: "Handing out a primary source and asking students to \"read it and answer the questions\" is not teaching with primary sources. If the questions could be answered from a textbook paragraph, the source is decoration. The routine \u2014 source, contextualize, close read, corroborate \u2014 is the lesson." },
      { title: "One source, no argument", body: "A single document teaches summary, not history. Without at least a second source to weigh it against, students cannot corroborate, and corroboration is where historical thinking lives. Pair sources whenever possible." },
      { title: "Too much text, too fast", body: "Handing eighth graders a full page of eighteenth-century prose is not rigor \u2014 it is a reading assignment they will skim. Excerpt honestly, define hard words in brackets, and shorten the passage so close reading is actually possible in the time you have." },
      { title: "Analysis without writing", body: "If the lesson ends at discussion, most students will not have to defend a claim from the evidence. End every primary-source lesson in short writing \u2014 one paragraph, one quoted line, one sentence of reasoning \u2014 or you are teaching appreciation, not argument." },
      { title: "Sanitized sources", body: "Documents from slavery, colonization, Jim Crow, the Holocaust, and Indigenous removal include language and images that are painful and, for many students, personal. Choosing not to use those sources is a real choice \u2014 but replacing hard sources with easy ones teaches a false history. Frame the source, name what students will encounter, and give them the analytical language to work with it." }
    ],
    walkthroughDiagnostic: "Pick up a student's document handout mid-lesson. Ask them: 'Who made this, when, and for whom \u2014 and why should we trust it?' If they can only answer 'what it says,' the lesson is about the content of the document, not about historical thinking. That is the diagnostic.",
    bySubject: [
      { subject: "U.S. History", body: "Pair a founding-era text (Declaration, Federalist, a state ratification debate) with a competing voice from the same moment (Anti-Federalist, an enslaved person's petition, a Loyalist pamphlet). The disagreement is the lesson." },
      { subject: "World History / AP World", body: "Use the World Digital Library and DPLA sets to teach non-U.S. sources at every unit. A Ming-dynasty edict, a Mughal miniature, and a European traveler's account of the same court is a corroboration lesson students remember." },
      { subject: "Government / Civics", body: "DocsTeach carries the actual federal record \u2014 laws, executive orders, Supreme Court briefs, congressional hearings. Use the real document, not a textbook paraphrase, whenever the standard names a specific case or law." },
      { subject: "Oklahoma History", body: "The Oklahoma Historical Society's Gateway to Oklahoma History carries the state's newspapers, land-run records, tribal records, and Dust Bowl photographs. Local sources land harder than national sources for many students \u2014 use them." }
    ],
    lookFors: [
      "A visible analysis routine (LOC 'Observe / Reflect / Question' or SHEG 'source / contextualize / close read / corroborate') is posted and referenced.",
      "Students name the creator, date, and purpose of the source before they discuss its content.",
      "At least two sources on the same event or question are in play so corroboration is possible.",
      "Excerpts are readable in the time available; hard vocabulary is defined; full citation is visible.",
      "The lesson ends in short writing that quotes at least one source and defends a claim."
    ]
  };

  function repositoryCard(r) {
    return '<article class="card">' +
      '<h3 class="card-title">' + esc(r.name) + '</h3>' +
      '<p>' + esc(r.what) + '</p>' +
      '<p style="margin:6px 0 8px;"><strong>Good for:</strong> ' + esc(r.good_for) + '</p>' +
      '<p style="margin:0;"><a href="' + esc(r.url) + '" target="_blank" rel="noopener">Open ' + esc(r.name) + ' \u2197</a></p>' +
      '</article>';
  }

  function renderPrimarySources(view) {
    var page = PRIMARY_SOURCES;
    view.innerHTML = '<h1 class="page-title">' + esc(page.title) + '</h1>' +
      '<p class="page-lede">' + esc(page.lede) + '</p>' +

      '<div class="callout"><h3>The diagnostic</h3>' +
      '<p>' + esc(page.walkthroughDiagnostic) + '</p>' +
      conceptVideoBlock(page) +
      '</div>' +

      '<h2 class="section-title">The evidence base and the framework</h2>' +
      '<p>The Library of Congress\u2019s teachers portal and its Primary Source Analysis Tool are the closest thing the field has to a national standard for classroom-level primary-source work. The Stanford History Education Group (now the Digital Inquiry Group) built the four historical thinking moves \u2014 sourcing, contextualization, close reading, corroboration \u2014 that most secondary curricula now teach. Sam Wineburg\u2019s <em>Historical Thinking and Other Unnatural Acts</em> is the foundational argument for why this work matters. Read one primer, use one routine, and be consistent.</p>' +
      '<div class="guide-row">' + page.sources.map(sourceLink).join("") + '</div>' +

      '<h2 class="section-title">Four principles that make document lessons work</h2>' +
      '<div class="card-grid">' + page.principles.map(principleCard).join("") + '</div>' +

      '<h2 class="section-title">Core moves</h2>' +
      page.practices.map(practiceCard).join("") +

      '<h2 class="section-title">Where to find real primary sources</h2>' +
      '<p>Every repository below is free, teacher-facing, and has been verified. Start with the first two \u2014 the Library of Congress and DocsTeach \u2014 for anything U.S. history. Use DPLA and the World Digital Library for topical and non-U.S. sets. Use the Digital Inquiry Group when you need a ready-to-teach lesson rather than raw sources.</p>' +
      '<div class="card-grid">' + page.repositories.map(repositoryCard).join("") + '</div>' +

      '<h2 class="section-title">Where these lessons break down</h2>' +
      '<div class="card-grid">' + page.breakdowns.map(principleCard).join("") + '</div>' +

      '<h2 class="section-title">By subject inside the department</h2>' +
      '<div class="card-grid">' + page.bySubject.map(function (s) {
        return '<article class="card"><h3 class="card-title">' + esc(s.subject) + '</h3><p>' + esc(s.body) + '</p></article>';
      }).join("") + '</div>' +

      '<h2 class="section-title">What to look for in the room</h2>' +
      '<div class="card"><ul class="check-list">' + page.lookFors.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>' +

      '<p style="margin-top:24px;font-size:0.9em;color:#666;"><em>Every video, reading, and repository on this page has been verified to be live and on-topic as of publication. Report a broken link through the feedback link in the footer.</em></p>';

    wireLazyYouTube();
  }

  window.ContentHubs = {
    renderK5Science: function (view) { renderK5(view, "science"); },
    renderK5Social: function (view) { renderK5(view, "social"); },
    renderSecondaryHub: renderSecondaryHub,
    renderSocialStudiesHub: renderSocialStudiesHub,
    renderSecondaryReading: function (view, strategies) { renderSecondary(view, "reading", strategies); },
    renderSecondaryMath: function (view, strategies) { renderSecondary(view, "math", strategies); },
    renderSecondaryWriting: function (view, strategies) { renderSecondary(view, "writing", strategies); },
    renderSecondaryScience: function (view, strategies) { renderSecondary(view, "science", strategies); },
    renderSecondarySocial: function (view, strategies) { renderSecondary(view, "social", strategies); },
    renderStudentVoice: renderStudentVoice,
    renderLearnerSupports: renderLearnerSupports,
    renderInstructionalDelivery: renderInstructionalDelivery,
    renderClarity: renderClarity,
    renderWhyBackwardPlanning: renderWhyBackwardPlanning,
    renderEngagementVsBusywork: renderEngagementVsBusywork,
    renderPrimarySources: renderPrimarySources
  };
})();
