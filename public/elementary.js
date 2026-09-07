/**
 * Elementary Foundations — K–3 Reading, Math, and Writing
 *
 * Every strategy on these pages is grounded in evidence-based practice
 * (IES Practice Guides, What Works Clearinghouse, National Reading Panel,
 * Common Core Progressions, Hattie meta-analyses) and includes at least
 * one companion video from a trusted source: IES, Reading Rockets,
 * Edutopia, Teaching Channel, Inside Mathematics, Great Minds, or a
 * verified YouTube channel.
 *
 * videoBlock() auto-embeds YouTube URLs and falls back to a link-out
 * card for non-YouTube sources (Reading Rockets, Inside Mathematics,
 * Teaching Channel), preserving the source label.
 */
(function () {
  "use strict";

  var el = window.PlannerCore ? window.PlannerCore.el : function (t, a, c) {
    var n = document.createElement(t);
    if (a) for (var k in a) { if (a[k] == null) continue; if (k === "class") n.className = a[k]; else n.setAttribute(k, a[k]); }
    if (c != null) {
      if (Array.isArray(c)) c.forEach(function (x) { if (x != null) n.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else if (typeof c === "string") n.textContent = c;
      else n.appendChild(c);
    }
    return n;
  };

  // -----------------------------------------------------------------
  //  DATA
  // -----------------------------------------------------------------

  // Maps each Elementary Foundations card to a strategy id in the main Library
  // so cards deep-link to #/strategies?open=<id> and scroll to the full page.

  var READING = {
    slug: "early-reading",
    title: "Early Reading (K–5)",
    lede:
      "The five pillars — phonemic awareness, phonics, fluency, vocabulary, comprehension — plus the daily routines that make them stick. Every recommendation below is drawn from IES Practice Guides and the National Reading Panel.",
    guides: [
      {
        label: "IES Practice Guide",
        title: "Foundational Skills to Support Reading for Understanding in K–3rd Grade (2016)",
        url: "https://ies.ed.gov/ncee/wwc/practiceguide/21",
      },
      {
        label: "IES Practice Guide",
        title: "Improving Reading Comprehension in K–3rd Grade",
        url: "https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/readingcomp_pg_092810.pdf",
      },
      {
        label: "Meta-analysis",
        title: "National Reading Panel — Teaching Children to Read (NICHD)",
        url: "https://www.nichd.nih.gov/publications/pubs/nrp/smallbook",
      },
    ],
    strategies: [
      {
        libraryId: "29e604eb-96da-424c-9253-140737fe2ae6",
        title: "Phonemic awareness — daily oral routine",
        band: "K–2 · 8–12 min/day",
        why:
          "Phonemic awareness is the single strongest kindergarten predictor of later reading success. IES rates the evidence 'Strong' for developing awareness of the sounds in speech and how they link to letters.",
        moves: [
          "Warm-up with syllable and onset-rime blending/segmenting before moving to phoneme-level tasks.",
          "Rotate the six phoneme skills — isolation, blending, segmenting, addition, deletion, substitution.",
          "Say-it-then-tap-it: children push a chip for each sound heard, then map letters to chips.",
          "Keep it oral first — letters are added once children can hear and manipulate the sounds.",
        ],
        evidence:
          "IES 2016 Recommendation 2 (Strong evidence). NRP 2000: phonemic awareness instruction produced d = 0.86 on reading outcomes.",
        video: {
          title: "How to Teach Phonemic Awareness in Kindergarten, 1st, & 2nd Grade",
          channel: "Mrs. Winter's Bliss",
          url: "https://www.youtube.com/watch?v=x3d2U01e71I",
        },
        moreVideos: [
          {
            title: "Kindergarten Heggerty Lesson — Week 25, Monday",
            channel: "Emily Doyle",
            url: "https://www.youtube.com/watch?v=fk9SZ1qX4OE",
          },
          {
            title: "Phonemic Awareness: Watch & Learn",
            channel: "Reading Rockets",
            url: "https://www.readingrockets.org/topics/phonological-and-phonemic-awareness/articles/phonemic-awareness-watch-learn",
          },
        ],
      },
      {
        libraryId: "b2937aea-7f78-4d29-bf67-c01264761d4d",
        title: "Systematic, explicit phonics — a scope you actually teach",
        band: "K–3 · 20–30 min/day",
        why:
          "IES gives a Strong evidence rating to teaching students to decode, analyze word parts, and write and recognize words. 'Systematic' means the sequence is planned and cumulative — not incidental.",
        moves: [
          "New sound → model → blend in words → read in decodable text → dictate/encode the pattern.",
          "Six-step routine: sound-symbol, blending drill, word chaining, decodable reading, encoding, and application.",
          "Keep a visible scope-and-sequence in the room; reteach any pattern more than 20% of students missed.",
          "Encoding (spelling) is not extra — it's how phonics sticks.",
        ],
        evidence:
          "IES 2016 Recommendation 3 (Strong evidence). NRP: systematic phonics d = 0.44 vs. non-systematic. Hattie: phonics d ≈ 0.54.",
        video: {
          title: "Explicit Phonics Instruction Using the 6 Step Method",
          channel: "Todd Reading",
          url: "https://www.youtube.com/watch?v=LVZULjEdZ-g",
        },
        moreVideos: [
          {
            title: "Teaching the '-ck' Pattern",
            channel: "Reading Rockets",
            url: "https://www.readingrockets.org/videos/classroom/teaching-ck-pattern",
          },
          {
            title: "Using Active Phonics Instruction with C-V-C Words",
            channel: "Teaching Channel",
            url: "https://www.teachingchannel.com/k12-hub/video-blog/using-active-phonics-instruction-with-c-v-c-words/",
          },
        ],
      },
      {
        libraryId: "873b7e89-0f74-4cdd-b408-ef9c8767ddb4",
        title: "Decodable text — first, then leveled text",
        band: "K–3 · Daily in small group",
        why:
          "Decodable texts let novice readers practice the phonics patterns they've been taught. IES recommends daily connected-text reading tied to the phonics scope.",
        moves: [
          "Preview only the tricky heart words (irregular high-frequency words) — never the decodable ones.",
          "Whisper-read or partner-read first pass; teacher listens for accuracy and prompts by sound.",
          "Reread for fluency and meaning; end with 2–3 comprehension questions.",
          "Retire the decodable when 95%+ of students read it accurately.",
        ],
        evidence: "IES 2016 Recommendation 4 (Moderate evidence).",
        video: {
          title: "Introducing Decodable Readers in 1st Grade",
          channel: "Learning at the Primary Pond",
          url: "https://www.youtube.com/watch?v=VzVVETsW_Wo",
        },
        moreVideos: [
          {
            title: "Do This Before Reading a Decodable Text",
            channel: "Learning at the Primary Pond",
            url: "https://www.youtube.com/watch?v=-nyG4BXbot8",
          },
          {
            title: "Decodable Readers Protocol (PDF)",
            channel: "Achieve the Core",
            url: "https://achievethecore.org/content/upload/Decodable%20Reader%20Protocol_2018.pdf",
          },
        ],
      },
      {
        libraryId: "4fc9a97f-b1e5-41e8-aca3-937b44f782ee",
        title: "Fluency — repeated & performance reading",
        band: "1–5 · 10–15 min/day",
        why:
          "Fluency is the bridge from decoding to comprehension. Repeated reading of grade-level passages with feedback consistently produces gains in accuracy, rate, and prosody.",
        moves: [
          "Choose a short (75–150 word) grade-level passage aligned to the current unit.",
          "Model → echo → choral → partner → performance across the week.",
          "Chart words correct per minute; the goal is prosody, not race-reading.",
          "Use readers' theater on Friday so fluency has a real audience.",
        ],
        evidence:
          "NRP 2000: guided repeated oral reading produces moderate-to-strong gains in fluency and comprehension. Hattie: repeated reading d ≈ 0.67.",
        video: {
          title: "Improving Fluency with Technology: Repeated and Performance Reading",
          channel: "Reading Rockets",
          url: "https://www.readingrockets.org/videos/classroom/improving-fluency-technology-repeated-and-performance-reading",
        },
        moreVideos: [
          {
            title: "Using 'I Do, We Do, You Do' to Teach Reading With Expression",
            channel: "Edutopia",
            url: "https://www.edutopia.org/video/using-i-do-we-do-you-do-to-teach-reading-with-expression",
          },
        ],
      },
      {
        libraryId: "f42f1e90-29eb-49d0-af4a-58fc828e7db1",
        title: "Vocabulary through knowledge-building read-alouds",
        band: "K–5 · 15–20 min/day",
        why:
          "Read-alouds using a topic set of books build both vocabulary and background knowledge — the two biggest levers on later comprehension.",
        moves: [
          "Choose a 2–3 week topic set; each book shares a topic and vocabulary.",
          "Pre-teach 3–5 tier-2 words per book using student-friendly definitions and examples/non-examples.",
          "During reading, stop at each target word: define, connect to prior use, ask students to use it.",
          "After reading: sketch, write, or discuss using the words. Add words to a visible topic wall.",
        ],
        evidence:
          "IES 2016 Recommendation 1 (Moderate evidence). Beck & McKeown: robust vocabulary instruction produces measurable gains in comprehension of texts using taught words.",
        video: {
          title: "Read Aloud with Attention to Vocabulary — Dr. Tanya S. Wright",
          channel: "MSU College of Education",
          url: "https://www.youtube.com/watch?v=ynPdxVP4q4Y",
        },
        moreVideos: [
          {
            title: "Building Better Readers With Scaffolded Read-Alouds",
            channel: "Edutopia",
            url: "https://www.edutopia.org/video/building-better-readers-scaffolded-read-alouds/",
          },
          {
            title: "Interactive Read-Alouds: Learning from Books Together",
            channel: "IES",
            url: "https://ies.ed.gov/use-work/resource-library/resource/video/interactive-readalouds-learning-books-together",
          },
        ],
      },
      {
        libraryId: "20f0c1ad-7ee0-46ba-bd8c-b93022e9e1c1",
        title: "Dialogic reading & comprehension talk",
        band: "K–5 · Woven into read-aloud",
        why:
          "Dialogic reading — the teacher becoming the questioner and the child becoming the storyteller — is one of the most-studied early comprehension routines. WWC lists it as an evidence-based practice.",
        moves: [
          "Use the PEER routine: Prompt → Evaluate → Expand → Repeat.",
          "Ask CROWD prompts: Completion, Recall, Open-ended, Wh-, Distancing.",
          "Give at least one turn-and-talk per read-aloud; monitor and lift one exemplar.",
          "For expository texts, add 'What did the author want us to learn?' to every closing.",
        ],
        evidence: "WWC Intervention Report: Dialogic Reading — positive effects on oral language.",
        video: {
          title: "Dialogic Reading With Expository Text (Video 3)",
          channel: "Reading Rockets",
          url: "https://www.readingrockets.org/videos/classroom/video-3-dialogic-reading-expository-text",
        },
        moreVideos: [
          {
            title: "Dialogic Reading: An Effective Way to Read Aloud",
            channel: "Reading Rockets",
            url: "https://www.readingrockets.org/topics/early-literacy-development/articles/dialogic-reading-effective-way-read-aloud-young-children",
          },
        ],
      },
    ],
    lookFors: [
      "Every child is producing sound — reading aloud, saying phonemes, echoing, or explaining — for the majority of the block.",
      "The phonics scope is visible and the day's target sound/pattern is named.",
      "Students are reading decodable OR connected text every day, not doing worksheets.",
      "Vocabulary being taught can be pointed to on a topic wall — and heard in student talk.",
    ],
  };

  var MATH = {
    slug: "early-math",
    title: "Early Math (K–5)",
    lede:
      "Number sense first. Then operations built through concrete → representational → abstract, daily number talks, and math language that all students use. Every recommendation below is drawn from the IES 'Teaching Math to Young Children' Practice Guide and companion research.",
    guides: [
      {
        label: "IES Practice Guide",
        title: "Teaching Math to Young Children (2013)",
        url: "https://ies.ed.gov/ncee/wwc/practiceguide/18",
      },
      {
        label: "IES Practice Guide",
        title: "Assisting Students Struggling with Mathematics: Intervention (2021)",
        url: "https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC2021006-Math-PG.pdf",
      },
      {
        label: "IES Toolkit",
        title: "Teaching Math to Young Children — Facilitator Modules & Videos",
        url: "https://ies.ed.gov/ncee/rel/math-young-children",
      },
    ],
    strategies: [
      {
        libraryId: "5e8ff7e6-727b-47b0-bf7d-8ce54b86d6e1",
        title: "Number talks — 8 minutes, every day",
        band: "K–5 · 8–10 min/day",
        why:
          "A short daily mental-math routine where students share strategies. It builds flexible thinking, mathematical language, and community — and it uses zero prep beyond the problem string.",
        moves: [
          "Pose one problem. Silent think time — thumb on chest when ready.",
          "Collect answers first (all of them, no reactions). Then ask: 'How did you get it?'",
          "Record 2–3 strategies on the board using students' names.",
          "Close with: 'Which strategy is new to you? Which will you try?'",
        ],
        evidence:
          "Parrish (2010, 2014); consistent classroom evidence for gains in mental computation, flexibility, and math discourse. Hattie: classroom discussion d ≈ 0.82.",
        video: {
          title: "Number Talks in Kindergarten, First, and Second Grade",
          channel: "Miss Kindergarten",
          url: "https://www.youtube.com/watch?v=jayG4dZr4gQ",
        },
        moreVideos: [
          {
            title: "1st Grade Math — Quick Look With Ten Frames",
            channel: "Inside Mathematics",
            url: "https://www.insidemathematics.org/classroom-videos/number-talks/1st-grade-math-quick-look-with-ten-frames",
          },
          {
            title: "60-Second Strategy: Mystery Number",
            channel: "Edutopia",
            url: "https://www.edutopia.org/video/60-second-strategy-mystery-number/",
          },
        ],
      },
      {
        libraryId: "69563c49-ea71-4d24-a906-da72cae285e7",
        title: "Subitizing & number sense",
        band: "K–2 · 5–10 min/day",
        why:
          "Perceptual and conceptual subitizing — instantly recognizing small quantities — is the ground floor of number sense. IES gives building children's understanding of number a Strong evidence rating.",
        moves: [
          "Dot-card flash: show for 2 seconds, hide, ask 'How many? How did you see them?'",
          "Vary arrangements (line, ten-frame, dice, random) so children don't memorize pictures.",
          "Move from 1–5 to 6–10, then to two-part patterns (5 + 2, 4 + 3).",
          "Ten-frames become the anchor for + and − work all year.",
        ],
        evidence:
          "IES 2013 Recommendation 1 (Strong evidence). Clements & Sarama Learning Trajectories.",
        video: {
          title: "Subitizing for Kids — Learn Numbers Fast (Dot Cards 1–5)",
          channel: "Miacademy Kids",
          url: "https://www.youtube.com/watch?v=9puTd69YWT8",
        },
        moreVideos: [
          {
            title: "Kindergarten Math — Number Operations and Counting (Public Lesson)",
            channel: "Inside Mathematics",
            url: "https://www.insidemathematics.org/classroom-videos/public-lessons/kindergarten-math-number-operations-and-counting",
          },
        ],
      },
      {
        libraryId: "0c4aafd9-22b1-468e-b012-3677170850aa",
        title: "Concrete → Representational → Abstract (CRA)",
        band: "K–5 · Every new concept",
        why:
          "Students who first build a concept with manipulatives, then draw it, then work symbolically consistently outperform students taught symbolically first. WWC lists visual representations as a top intervention practice.",
        moves: [
          "Concrete: cubes, counters, or base-10 blocks in every child's hands.",
          "Representational: student draws what they built — quick sketches, ten-frames, bar models.",
          "Abstract: only after C and R feel solid; connect back with 'Where do you see the ___ in the equation?'",
          "For struggling students, drop back one stage — don't just re-explain the symbols.",
        ],
        evidence:
          "IES 2021 Math Intervention Recommendation 5 (Moderate evidence). Meta-analyses: CRA d ≈ 0.53 for elementary math outcomes.",
        video: {
          title: "CRA — Concrete Representational Abstract",
          channel: "The Math Learning Center",
          url: "https://www.youtube.com/watch?v=ynkWYMLBe50",
        },
        moreVideos: [
          {
            title: "Concrete, Representational, Abstract Model for Subtraction",
            channel: "SPED Tacular Teaching",
            url: "https://www.youtube.com/watch?v=IX2IgXyRYLk",
          },
          {
            title: "Using the CRA Framework in Elementary Math",
            channel: "Edutopia",
            url: "https://www.edutopia.org/article/using-cra-framework-elementary-math/",
          },
        ],
      },
      {
        libraryId: "b6de36f9-ec00-4386-b27d-60b45c3547f0",
        title: "Cognitively Guided Instruction — problem-first teaching",
        band: "K–5 · 2–3× per week",
        why:
          "CGI centers instruction on students' own strategies for solving problems. Teachers learn to interpret student thinking and select problem types deliberately.",
        moves: [
          "Give the story problem BEFORE teaching a procedure. Let students choose tools.",
          "Circulate; select 2–3 student solutions to share (least → most sophisticated).",
          "Name the strategies — 'direct modeling,' 'counting on,' 'derived facts.'",
          "Vary problem type (Join / Separate / Part-Part-Whole / Compare) across the week.",
        ],
        evidence:
          "Carpenter, Fennema, Franke, Levi, Empson — decades of CGI research. WWC evidence for problem-solving instruction: Positive.",
        video: {
          title: "CGI Math For Teachers",
          channel: "K-6 Math Teachers",
          url: "https://www.youtube.com/watch?v=OMl3vTNc3X0",
        },
        moreVideos: [
          {
            title: "See Mona Talk About Math",
            channel: "T. Denny Sanford Harmony Academy / CGI archive",
            url: "https://www.youtube.com/watch?v=7Ph2NCOiDNU",
          },
        ],
      },
      {
        libraryId: "8570ee0c-5313-45b9-b570-466040ebd0c3",
        title: "Math language routine — 'convince yourself, a friend, a skeptic'",
        band: "K–5 · Daily",
        why:
          "Explaining and justifying math builds both understanding and language. Structured discourse routines give every child a turn — not just the volunteers.",
        moves: [
          "Sentence stems in the room: 'I know ___ because ___.' 'I disagree because ___.'",
          "Turn-and-talk in every math block; teacher names one exemplar per lesson.",
          "'Say it another way' — call on a second student to restate the first.",
          "'Convince a skeptic' — teacher plays doubter to push justification.",
        ],
        evidence:
          "IES 2021 Math Intervention Recommendation 4 (Moderate evidence). Hattie: classroom discussion d ≈ 0.82.",
        video: {
          title: "Bringing Number Talks to the Online Classroom (discourse moves)",
          channel: "Edutopia",
          url: "https://www.edutopia.org/article/bringing-number-talks-online-classroom/",
        },
        moreVideos: [
          {
            title: "Kindergarten Math — Number Operations and Counting",
            channel: "Inside Mathematics",
            url: "https://www.insidemathematics.org/classroom-videos/public-lessons/kindergarten-math-number-operations-and-counting",
          },
        ],
      },
      {
        libraryId: "030c9053-f981-42fe-8c12-09662b01a1e9",
        title: "Fact fluency — strategy, then practice",
        band: "1–5 · 10–15 min/day",
        why:
          "Fluency isn't memorization; it's efficient, flexible use of known facts. Teach the strategies first (make ten, doubles, near doubles, decomposing), then practice inside games and short timed sets.",
        moves: [
          "Teach one strategy per week; add it to a visible 'strategies we know' chart.",
          "Practice with games (Roll & Cover, War, ten-frame flash) — not just worksheets.",
          "Track progress against known-facts, not against speed alone.",
          "Small-group re-teach for students still direct-modeling all facts by mid-year.",
        ],
        evidence:
          "IES 2021 Math Intervention Recommendation 6 (Moderate evidence). Bay-Williams & Kling: 'Math Fact Fluency' framework.",
        video: {
          title: "Fact Fluency — Building Number Sense with Games (K-2)",
          channel: "The Recovering Traditionalist",
          url: "https://www.youtube.com/watch?v=w9ggAUNQ4ds",
        },
      },
    ],
    lookFors: [
      "Manipulatives and student drawings are visible in every math lesson — not just the intro.",
      "Every student is talking math; sentence stems are used and heard.",
      "The day's problem gets solved multiple ways and those ways are named.",
      "Fluency work is strategy-based, not just timed flash.",
    ],
  };

  var WRITING = {
    slug: "early-writing",
    title: "Early Writing (K–5)",
    lede:
      "Write every day, teach handwriting and spelling until they're automatic, and use Self-Regulated Strategy Development to teach students how to plan, draft, and revise. Grounded in the IES 'Teaching Elementary Students to Be Effective Writers' Practice Guide.",
    guides: [
      {
        label: "IES Practice Guide",
        title: "Teaching Elementary Students to Be Effective Writers (2018 Revised)",
        url: "https://ies.ed.gov/ncee/wwc/practiceguide/17",
      },
      {
        label: "WWC Report",
        title: "Self-Regulated Strategy Development — Intervention Report",
        url: "https://ies.ed.gov/ncee/wwc/Docs/InterventionReports/wwc_srsd_111417.pdf",
      },
      {
        label: "IES REL Resource",
        title: "Instructional Strategies for Teaching Writing to Elementary Students",
        url: "https://ies.ed.gov/ncee/rel/Products/Region/southeast/Resource/80192",
      },
    ],
    strategies: [
      {
        libraryId: "c3ca66d7-e19a-412c-b31f-5bbe5d6c7e3d",
        title: "Write daily — dedicated time, real audiences",
        band: "K–5 · 30 min/day recommended",
        why:
          "The IES Writing Practice Guide's Recommendation 1: provide daily time for students to write. Volume matters; without it, no strategy transfers.",
        moves: [
          "Protect the block — even 20 minutes daily beats 60 minutes twice a week.",
          "Give real audiences and purposes: notes home, class books, letters, how-to guides.",
          "Rotate a mini-lesson (5–8 min) → work time (18–22 min) → share (3–5 min).",
          "Never grade every piece — publish some, respond to others.",
        ],
        evidence:
          "IES 2018 Writing Recommendation 1 (Minimal evidence rating for time itself — but foundational). Graham & Perin meta-analysis: writing-for-learning d ≈ 0.30–0.55 depending on subject.",
        video: {
          title: "How Short, Low-Stakes Writing Challenges Build More Confident Writers",
          channel: "Edutopia",
          url: "https://www.edutopia.org/video/how-short-low-stakes-writing-challenges-build-more-confident-writers/",
        },
      },
      {
        libraryId: "62c272bb-66c5-4f73-9184-31edfd338554",
        title: "Handwriting instruction — until it's automatic",
        band: "K–2 · 10–15 min/day; grade 3+ as needed",
        why:
          "Handwriting fluency frees working memory for composition. Students who struggle to form letters can't hold onto the sentence they wanted to write.",
        moves: [
          "Explicit letter formation — model, verbalize the path, students trace, then write.",
          "Group by stroke family, not alphabet order (magic-c letters, tall letters, hook letters).",
          "Distributed practice: 3–5 minutes of letter formation daily is worth more than 30 minutes once a week.",
          "Watch for grip and posture. Correct early — habits set fast.",
        ],
        evidence:
          "IES 2018 Recommendation 2c (Strong evidence for handwriting instruction K–2).",
        video: {
          title: "How to Teach Handwriting in Kindergarten and First Grade",
          channel: "Kristen Sullins Teaching",
          url: "https://www.youtube.com/watch?v=U7ttQVAjzf4",
        },
        moreVideos: [
          {
            title: "How to Teach Spelling & Handwriting in Kindergarten, 1st, and 2nd",
            channel: "Mrs. Winter's Bliss",
            url: "https://www.youtube.com/watch?v=29V7lPZblWs",
          },
        ],
      },
      {
        libraryId: "9bb42d4f-0d4d-447b-a56b-6172257a5740",
        title: "Encoding & spelling — the same as decoding, in reverse",
        band: "K–5 · 10 min/day",
        why:
          "Encoding practice reinforces the same phoneme–grapheme knowledge students use to read. Dictation of sounds → words → sentences is the highest-leverage 10 minutes in the day.",
        moves: [
          "Dictate: sound → letter, then word (using this week's pattern), then a sentence.",
          "Elkonin boxes / sound boxes for tricky words — one box per phoneme.",
          "Word chains: change one sound to make a new word (map → nap → nab → nag).",
          "Weekly heart-word review — 'the tricky part is here.'",
        ],
        evidence:
          "IES 2018 Recommendation 2b (Strong evidence for spelling instruction).",
        video: {
          title: "Word Chains and Sound Boxes for Spelling",
          channel: "Miss DeCarbo",
          url: "https://www.youtube.com/watch?v=fk9SZ1qX4OE",
        },
        moreVideos: [
          {
            title: "Invented Spelling and Spelling Development",
            channel: "Reading Rockets",
            url: "https://www.readingrockets.org/topics/spelling-and-word-study/articles/invented-spelling-and-spelling-development",
          },
        ],
      },
      {
        libraryId: "1f4e73a5-606e-437a-a407-c9b81f18caf8",
        title: "Shared & interactive writing",
        band: "K–3 · 10–15 min, several times per week",
        why:
          "The teacher and students co-compose a text on chart paper. The teacher shares the pen, thinking aloud about letters, words, punctuation, and word choice. It bridges emergent writing and independent writing.",
        moves: [
          "Set a real purpose — a class letter, a recap, a how-to.",
          "Compose the sentence together; children help spell the parts they know.",
          "Reread each new sentence with the class before moving on.",
          "Post the finished chart; return to it as a mentor text.",
        ],
        evidence:
          "IES 2018 Writing Recommendation 3 (Strong evidence). McCarrier, Pinnell, & Fountas: Interactive Writing.",
        video: {
          title: "Interactive Writing Instruction Online With Young Children (Dr. Nell K. Duke)",
          channel: "IES",
          url: "https://ies.ed.gov/use-work/resource-library/resource/video/interactive-writing-instruction-online-young-children",
        },
        moreVideos: [
          {
            title: "Shared Writing for Small Moments",
            channel: "Two Writing Teachers",
            url: "https://www.youtube.com/watch?v=G-uSvdbhKUU",
          },
          {
            title: "All About Shared Writing — Informational Unit, Kindergarten",
            channel: "Kindergarten Chaos",
            url: "https://www.youtube.com/watch?v=5NRwuVFbmcI",
          },
        ],
      },
      {
        libraryId: "01dee2da-1989-45a2-812b-2321c6ba565d",
        title: "Self-Regulated Strategy Development (SRSD)",
        band: "2–5 (K–1 adapted) · 3–5 week unit",
        why:
          "SRSD is the most-studied writing intervention in elementary school. Students learn a genre strategy, memorize it with a mnemonic, and self-monitor their use.",
        moves: [
          "Develop background knowledge of the genre with mentor texts.",
          "Introduce a mnemonic (e.g. POW+TIDE for opinion: Pick idea, Organize notes, Write; Topic sentence, Ideas, Details, Ending).",
          "Model — think aloud writing a full piece using the strategy.",
          "Memorize with the class, then guided practice with fading support, then independent use.",
        ],
        evidence:
          "WWC Intervention Report: SRSD — Positive effects on writing quality (Strong evidence). Graham & Harris meta-analyses: SRSD d ≈ 1.0+ across multiple studies.",
        video: {
          title: "Inside the SRSD Writing Process for K–2 Classrooms",
          channel: "thinkSRSD",
          url: "https://www.youtube.com/watch?v=Xt8yJPSsVoU",
        },
        moreVideos: [
          {
            title: "SRSD Writing Instruction: Changing How Teachers Teach and How Students Feel About Writing",
            channel: "thinkSRSD",
            url: "https://www.youtube.com/watch?v=fivMIuLVRxs",
          },
          {
            title: "Improving Academic Achievement Through SRSD (IES blog)",
            channel: "IES",
            url: "https://ies.ed.gov/learn/blog/improving-academic-achievement-through-instruction-self-regulated-strategy-development-science",
          },
        ],
      },
      {
        libraryId: "e089476b-cd15-449e-b3db-cba139bfc127",
        title: "Sentence-level writing — combining and expanding",
        band: "1–5 · 5–10 min/day",
        why:
          "Sentence-combining is one of the highest-effect writing practices in the research. Students learn to expand kernel sentences with 'when? where? why? which one? what kind?'",
        moves: [
          "Give a kernel sentence: 'The dog ran.' Students expand: when, where, how, why.",
          "Combine short choppy sentences into one strong one; compare versions.",
          "Sentence-of-the-day: teacher displays a strong sentence; students identify the moves.",
          "Add to writing checklist: 'Did I use at least one expanded sentence?'",
        ],
        evidence:
          "Graham & Perin (2007): sentence-combining d ≈ 0.50. IES 2018 Recommendation 2a (Moderate evidence).",
        video: {
          title: "Warming Up Cold Calling by Writing Ideas Down First",
          channel: "Edutopia",
          url: "https://www.edutopia.org/video/warming-up-cold-calling-by-writing-ideas-down-first/",
        },
      },
    ],
    lookFors: [
      "Kids are writing something every day — not just filling in blanks.",
      "Letter formation, spelling, and sentence work each get a slot in the week.",
      "A visible strategy chart students can point to during writing.",
      "Student writing is displayed with real audiences in mind.",
    ],
  };

    var SCIENCE = {
  "slug": "early-science",
  "title": "Early Science (K–5)",
  "lede": "Science in the elementary classroom is figuring out how the world works — starting with a puzzling phenomenon, making sense of it through talk and models, and writing to defend claims with evidence. Every recommendation below is anchored in the NRC Framework, NGSS, IES/WWC guidance, or the STEM Teaching Tools practice briefs from the University of Washington.",
  "guides": [
    {
      "label": "NRC Consensus Report",
      "title": "A Framework for K–12 Science Education: Practices, Crosscutting Concepts, and Core Ideas (2012)",
      "url": "https://www.nap.edu/catalog/13165/a-framework-for-k-12-science-education-practices-crosscutting-concepts"
    },
    {
      "label": "IES Practice Guide",
      "title": "Teaching Academic Content and Literacy to English Learners in Elementary and Middle School (2014)",
      "url": "https://ies.ed.gov/ncee/wwc/practiceguide/19"
    },
    {
      "label": "Practice Briefs",
      "title": "STEM Teaching Tools — Research-to-practice briefs (Univ. of Washington, IES-funded)",
      "url": "https://stemteachingtools.org/tools"
    }
  ],
  "strategies": [
    {
      "libraryId": null,
      "title": "Anchor every unit in a real phenomenon",
      "band": "K–5 · Launch each 2–4 week unit",
      "why": "The NRC Framework and NGSS reorganize science instruction around explaining phenomena and solving problems — not covering topics. A well-chosen anchoring phenomenon gives students a reason to learn the disciplinary core ideas and use the science and engineering practices to make sense of it.",
      "moves": [
        "Open with the phenomenon (video, demo, or student experience) — 2–5 minutes, no vocabulary preview.",
        "Elicit initial ideas: students draw an initial model and write 'I notice / I wonder' in the notebook.",
        "Post a class 'Driving Question Board' of student questions; revisit and cross off as you build explanations.",
        "Close each lesson with 'How does today's investigation help us explain the phenomenon?'"
      ],
      "evidence": "NRC (2012) A Framework for K–12 Science Education — phenomena drive three-dimensional learning (Practices + Crosscutting Concepts + DCIs). Ambitious Science Teaching (Windschitl, Thompson, Braaten, 2018) — anchoring events are one of four core practices.",
      "video": {
        "title": "introduction to anchoring events",
        "channel": "Ambitious Science Teaching",
        "url": "https://www.youtube.com/watch?v=Ifxg_qR29H4"
      },
      "moreVideos": [
        {
          "title": "Putting Student Curiosity at the Heart of Scientific Inquiry",
          "channel": "Edutopia",
          "url": "https://www.youtube.com/watch?v=xaltB0GQjOE"
        },
        {
          "title": "STEM Teaching Tools — Practice Briefs (phenomena, SEPs, CCCs)",
          "channel": "STEM Teaching Tools / Univ. of Washington",
          "url": "https://stemteachingtools.org/tools"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Productive science talk — talk moves + Scientists Circle",
      "band": "K–5 · Woven into every investigation",
      "why": "Talk is how children make thinking visible in science — sharing, clarifying, critiquing, and building on ideas. Structured talk moves ensure it isn't just the same three kids each time. STEM Teaching Tools calls productive talk one of the highest-leverage moves a science teacher can make.",
      "moves": [
        "Post 4–6 talk moves visibly: 'Say more…', 'Who can revoice that?', 'Do you agree/disagree? Why?', 'What's your evidence?'",
        "Use a Scientists Circle (horseshoe on the rug) for whole-class sensemaking after an investigation.",
        "Give at least one small-group turn before whole-class share — the talker is the learner.",
        "Track participation on a class list; name one student idea back to them ('Marcus's claim was…') the next day."
      ],
      "evidence": "STEM Teaching Tools Brief #6 (Michaels & O'Connor) — productive talk moves; Brief #48 — teacher-guided classroom conversation. Hattie: classroom discussion d ≈ 0.82.",
      "video": {
        "title": "Encouraging Collaboration With a Scientists Circle",
        "channel": "Edutopia",
        "url": "https://www.youtube.com/watch?v=f__Jg6_Xo7o"
      },
      "moreVideos": [
        {
          "title": "Eliciting students' ideas overview",
          "channel": "Ambitious Science Teaching",
          "url": "https://www.youtube.com/watch?v=lEDvaIsZOek"
        },
        {
          "title": "STEM Teaching Tools Brief #6 — Getting students to learn science by productively talking",
          "channel": "STEM Teaching Tools",
          "url": "https://stemteachingtools.org/brief/6"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Science notebooks + Claim–Evidence–Reasoning (CER)",
      "band": "1–5 · Every investigation",
      "why": "A science notebook is where students record data, revise models, and write explanations. Framing every written explanation as Claim–Evidence–Reasoning (McNeill & Krajcik) makes scientific writing concrete and gives teachers a formative window into student thinking.",
      "moves": [
        "Set the notebook page: date, question, prediction, data (table/sketch), claim, evidence, reasoning.",
        "Model one full CER in front of the class the first three times — think-aloud how the evidence links to the claim.",
        "Post sentence stems: 'My claim is ___. My evidence is ___. This shows ___ because (science idea) ___.'",
        "Give feedback on reasoning, not spelling — the reasoning sentence is where the science thinking lives."
      ],
      "evidence": "McNeill & Krajcik (2012) Supporting Grade 5–8 Students in Constructing Explanations in Science — the CER framework. NRC Framework — SEP 7 (Engaging in Argument from Evidence) is a K–12 progression starting in Kindergarten.",
      "video": {
        "title": "CER - Claim Evidence Reasoning",
        "channel": "Bozeman Science (Paul Andersen)",
        "url": "https://www.youtube.com/watch?v=5KKsLuRPsvU"
      },
      "moreVideos": [
        {
          "title": "How to Set Up a Highly Engaged Science Classroom",
          "channel": "Edutopia",
          "url": "https://www.youtube.com/watch?v=YtggVEmuyEM"
        },
        {
          "title": "Using the Claim, Evidence, Reasoning (CER) Framework in Elementary Grades",
          "channel": "Edutopia (Brunsell)",
          "url": "https://www.edutopia.org/blog/science-inquiry-claim-evidence-reasoning-eric-brunsell"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Explicit vocabulary + language routines for MLLs in science",
      "band": "K–5 · Every lesson",
      "why": "Science is a language-rich subject, and multilingual learners need repeated, structured chances to use the target vocabulary in speaking and writing. The IES English Learners Practice Guide recommends teaching a small set of academic vocabulary intensively, and integrating oral and written English into content-area teaching.",
      "moves": [
        "Pick 3–5 tier-3 words per lesson (e.g. evaporate, condense); teach with student-friendly definitions, images, and a physical gesture.",
        "Use a word sort or Frayer card as the daily warm-up; students discuss why words belong together in pairs.",
        "Give a sentence frame for every response: 'I predict ___ because ___.' 'The ___ caused the ___ to ___.'",
        "End with a 2-minute 'talk-and-write': partner talks first, then each student writes one sentence using two of the target words."
      ],
      "evidence": "IES Practice Guide (2014) Recommendations 1 & 2 (Strong evidence for intensive academic vocabulary; Moderate for integrating oral/written language into content teaching). NAP (2018) English Learners in STEM Subjects — repeated productive use is essential.",
      "video": {
        "title": "Making the connection: Vascular plants and straws (5th-grade ELLs)",
        "channel": "Colorín Colorado",
        "url": "https://www.youtube.com/watch?v=svP7hczkh3Y"
      },
      "moreVideos": [
        {
          "title": "Hands-on science fun with ELLs",
          "channel": "Colorín Colorado",
          "url": "https://www.youtube.com/watch?v=Jj3ZLznJwTE"
        },
        {
          "title": "60-Second Strategy: Science Word Sorts",
          "channel": "Edutopia",
          "url": "https://www.youtube.com/watch?v=VdJ2kLbcSTU"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Hands-on investigation tied to the phenomenon (5E)",
      "band": "K–5 · At least 1×/week",
      "why": "Elementary science should be a doing subject. The BSCS 5E instructional model — Engage, Explore, Explain, Elaborate, Evaluate — sequences investigation so that students explore before the teacher explains, so the vocabulary lands on top of experience, not before it.",
      "moves": [
        "Engage: return to the anchor phenomenon or a puzzling sub-question — 3–5 minutes.",
        "Explore: students investigate with real materials in pairs (data goes in the notebook, not on a worksheet).",
        "Explain: teacher introduces the scientific term or model — after students have described what they saw.",
        "Elaborate + Evaluate: apply the idea to a new situation; use a CER or exit ticket as the check."
      ],
      "evidence": "Bybee et al. (2006) — The BSCS 5E Instructional Model: Origins, Effectiveness, and Applications. NRC Framework — students learn science by engaging in the practices, not by reading about them. Hattie: inquiry-based teaching d ≈ 0.46 when paired with explicit explanation.",
      "video": {
        "title": "4 Nature Experiments to Bring Science to Life",
        "channel": "Edutopia",
        "url": "https://www.youtube.com/watch?v=L1jxX0erH-0"
      },
      "moreVideos": [
        {
          "title": "A Project-Based Approach to Teaching Elementary Science",
          "channel": "Edutopia",
          "url": "https://www.youtube.com/watch?v=wSDOQ7_AAdk"
        },
        {
          "title": "OpenSciEd — free, phenomenon-driven K–12 curriculum (exemplars)",
          "channel": "OpenSciEd",
          "url": "https://www.openscied.org/"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Read complex informational science text — integrate with literacy",
      "band": "K–5 · 2–3× per unit",
      "why": "Text is one of the ways scientists share evidence, and complex informational text is where knowledge — and vocabulary — actually builds. Reading science texts inside science (not just during ELA) doubles the return on the block: students build background knowledge for the phenomenon and practice comprehension on grade-level text.",
      "moves": [
        "Choose a short (200–500 word) text tied to this week's phenomenon; read it AFTER the first investigation, not before.",
        "First read for gist; second read with a purpose ('Underline evidence that could support/refute our claim').",
        "Use a graphic organizer that matches the text structure (cause/effect, sequence, compare/contrast).",
        "Close with a written response using text evidence: '___. The text says ___ (p. __), which shows ___.'"
      ],
      "evidence": "IES Practice Guide (2014) EL Recommendation 1 (Strong) — informational text is the platform for intensive vocabulary. Cervetti et al. (2012) — integrating literacy and science instruction produced significant gains in both science understanding and reading comprehension.",
      "video": {
        "title": "Making Science Connections Across the Curriculum",
        "channel": "Edutopia",
        "url": "https://www.youtube.com/watch?v=4H_xlkNSRLk"
      },
      "moreVideos": [
        {
          "title": "Melissa Stewart: Getting Kids Excited About All Kinds of Science (nonfiction)",
          "channel": "Reading Rockets",
          "url": "https://www.youtube.com/watch?v=QwYuwD8KBOI"
        },
        {
          "title": "Ambitious Science Teaching — Elementary Series (K–2 modeling with text)",
          "channel": "Ambitious Science Teaching",
          "url": "https://ambitiousscienceteaching.org/elementary-series/"
        }
      ]
    }
  ],
  "lookFors": [
    "A visible phenomenon and driving question board — not just a topic on the board.",
    "Kids are talking science to each other, using talk moves and evidence — not just answering the teacher.",
    "Every child has a science notebook with sketches, data, and at least one CER per week.",
    "Hands-on materials on desks, and target vocabulary landing after the investigation — not before."
  ]
};

  var SOCIAL_STUDIES = {
  "slug": "early-social-studies",
  "title": "Early Social Studies (K–5)",
  "lede": "Social studies in the elementary grades is where children learn to ask questions about their world, read evidence, and act as members of a community. Every strategy below is anchored in the C3 Framework, NCSS guidance, the Library of Congress and Stanford History Education Group primary-source work, iCivics, and the Oklahoma Academic Standards for the Social Studies.",
  "guides": [
    {
      "label": "NCSS Framework",
      "title": "The College, Career, and Civic Life (C3) Framework for Social Studies State Standards",
      "url": "https://www.socialstudies.org/standards/c3"
    },
    {
      "label": "Oklahoma Standards",
      "title": "Oklahoma Academic Standards for the Social Studies (OSDE, 2025)",
      "url": "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/social-studies/Final%202025%20SS%20OAS.pdf"
    },
    {
      "label": "Library of Congress",
      "title": "Teacher's Guides and Primary Source Analysis Tool",
      "url": "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/guides/"
    }
  ],
  "strategies": [
    {
      "libraryId": null,
      "title": "Inquiry Design Model — start with a compelling question",
      "band": "K–5 · 1–2 week inquiry arc",
      "why": "The C3 Framework's Inquiry Arc puts a compelling question at the heart of every unit, with supporting questions, sources, and a task where students take informed action. In K–2 the compelling question is concrete and personal ('What makes a good rule?'); by grades 3–5 it stretches to community, state, and nation.",
      "moves": [
        "Write ONE compelling question on the board — student-facing, arguable, and worth a week. In grade 3 Oklahoma studies: 'Whose land is this?' or 'What makes a community?'",
        "Break it into 3–4 supporting questions students can actually answer with a source, a map, or an interview.",
        "Pair each supporting question with 1–2 sources (photo, map, chart, short text) — not a textbook chapter.",
        "End the arc with a summative task AND a small 'informed action' — a letter, a poster, a class vote, a note to the principal."
      ],
      "evidence": "NCSS C3 Framework (2013), Dimension 1: Developing Questions and Planning Inquiries. Grant, Swan, & Lee's Inquiry Design Model (IDM) operationalizes the arc for K–12 classrooms.",
      "video": {
        "title": "National Geographic Geo-Inquiry Process — Capstone Video",
        "channel": "Brennan Caverhill / National Geographic Education",
        "url": "https://www.youtube.com/watch?v=djEDXukSGpQ"
      },
      "moreVideos": [
        {
          "title": "Exploring the World through Geo-Inquiry and Writing",
          "channel": "National Geographic Education",
          "url": "https://www.youtube.com/watch?v=iOm2N06L5RM"
        },
        {
          "title": "Inquiry Design Model — free K–12 blueprints and toolkit",
          "channel": "C3 Teachers",
          "url": "https://c3teachers.org/idm/"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Primary source analysis — Observe · Reflect · Question",
      "band": "K–5 · 15–20 min, 2–3× per week",
      "why": "Children can 'read' a photograph, map, or artifact long before they can decode a document. The Library of Congress 'Analyzing Primary Sources' routine — Observe, Reflect, Question — gives every grade a shared protocol and every teacher a scaffold.",
      "moves": [
        "Project one primary source. Silent looking for 60 seconds. No pointing, no talking.",
        "Chart three columns: OBSERVE (what do you see?), REFLECT (what do you think is happening?), QUESTION (what do you wonder?).",
        "Take 4–5 responses per column; press for evidence — 'What in the picture makes you say that?'",
        "Close by revealing source information (who, when, where). Ask: 'Does knowing that change what we think?'"
      ],
      "evidence": "Library of Congress Teachers Program 'Analyzing Primary Sources' tool (2015). NCSS C3 Dimension 3: Evaluating Sources and Using Evidence.",
      "video": {
        "title": "Engaging Young Learners with Primary Sources",
        "channel": "Library of Congress",
        "url": "https://www.youtube.com/watch?v=RKC88CW3h00"
      },
      "moreVideos": [
        {
          "title": "Evaluating Primary Sources Through a See, Think, Wonder Routine",
          "channel": "Edutopia",
          "url": "https://www.edutopia.org/video/evaluating-primary-sources-see-think-wonder/"
        },
        {
          "title": "LOC Teacher's Guides & Primary Source Analysis Tool (PDF)",
          "channel": "Library of Congress",
          "url": "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/guides/"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Reading Like a Historian — sourcing, contextualizing, corroborating",
      "band": "3–5 · Once per unit",
      "why": "SHEG's Reading Like a Historian teaches students the four moves historians use: sourcing (who made this?), contextualization (when and where?), close reading, and corroboration (do the sources agree?). Even in grade 3, kids can compare two short accounts of the same event and notice they don't match.",
      "moves": [
        "Give students TWO short accounts of the same event (a settler's diary AND a Cherokee oral history; a newspaper AND a photo caption).",
        "Model sourcing aloud: 'Who wrote this? When? Why?' Post the four historian questions on the wall.",
        "Chart what each source says. Circle where they agree (corroboration) and where they don't.",
        "Ask the guiding question: 'Which account do you trust more, and why?' Every claim needs a source."
      ],
      "evidence": "Wineburg, Martin, & Monte-Sano, Reading Like a Historian (Teachers College Press, 2012). Stanford History Education Group / Digital Inquiry Group lesson library.",
      "video": {
        "title": "Reading Like a Historian — Introduction",
        "channel": "Stanford History Education Group",
        "url": "https://www.youtube.com/watch?v=7IJFIx4w56U"
      },
      "moreVideos": [
        {
          "title": "Stanford History Education Group: Reading Like a Historian (overview)",
          "channel": "Stanford History Education Group",
          "url": "https://www.youtube.com/watch?v=CnWnLNSZTAg"
        },
        {
          "title": "Free K–12 history lessons — Digital Inquiry Group (formerly SHEG)",
          "channel": "Digital Inquiry Group",
          "url": "https://sheg.stanford.edu/history-lessons"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Structured Academic Controversy — every voice, every side",
      "band": "3–5 · 30–45 min lesson",
      "why": "SAC is a structured discussion protocol in which pairs argue one side of an issue, then switch sides, then drop positions to reach consensus. Unlike open debate, SAC forces students to understand — not just defeat — the other side. It's the workhorse civil-discourse routine in the C3 civics dimension.",
      "moves": [
        "Frame a genuine question with two defensible answers ('Should our town build a new park OR fix the old one?'). Give each pair a short background text with both views.",
        "Round 1: Pair A argues Side 1 to Pair B; Pair B listens and restates until A agrees they've been heard. Then switch.",
        "Round 2: Pairs SWAP sides and argue the opposite position — using at least one new piece of evidence.",
        "Round 3: Drop the sides. As a group of four, reach the best consensus you can. Report to the class on where you agreed and what still divides you."
      ],
      "evidence": "Johnson & Johnson (1988, 1995), Structured Academic Controversy. NCSS Position Statement on Academic Freedom and the Social Studies Teacher. Hattie: classroom discussion d ≈ 0.82 (general routine).",
      "video": {
        "title": "Teach My Class With Me | Structured Academic Controversy",
        "channel": "YouTube (classroom demonstration)",
        "url": "https://www.youtube.com/watch?v=nlt5uOylCWU"
      },
      "moreVideos": [
        {
          "title": "Structured Academic Controversies for Civics Classrooms",
          "channel": "YouTube (civics PD)",
          "url": "https://www.youtube.com/watch?v=q7ECTdyPt3I"
        },
        {
          "title": "Structured Academic Controversy (SAC) — teaching guide",
          "channel": "TeachingHistory.org (National History Education Clearinghouse)",
          "url": "https://teachinghistory.org/teaching-materials/teaching-guides/structured-academic-controversy-sac/"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Geographic & historical thinking through maps and place",
      "band": "K–5 · Woven into every unit",
      "why": "Maps, timelines, and place-based inquiry are how young children build the geographic and historical thinking the C3 Framework calls for. Start with the map of the classroom in kindergarten and grow to the map of Oklahoma, its counties, and its Native Nations by grade 4.",
      "moves": [
        "Every social studies unit gets a map on the wall — updated by students, not the teacher.",
        "Teach the five themes (location, place, human-environment interaction, movement, region) with the school as case study before the state or nation.",
        "Grade 4 Oklahoma unit: overlay the Native Nations map on the modern county map. Ask: 'Whose land are we standing on?'",
        "Timelines get physical — a clothesline across the room with student-made cards. Add one event per lesson."
      ],
      "evidence": "NCSS C3 Framework Dimension 2: Geographic Representations and Human-Environment Interaction. Oklahoma Academic Standards for Social Studies (2025), Grade 3–4 geography strand. National Geographic Geo-Inquiry Process.",
      "video": {
        "title": "Exploring Writing, Social Studies, and Math in a Map Challenge",
        "channel": "Edutopia",
        "url": "https://www.edutopia.org/video/map-challenge-elementary-writing-social-studies-math/"
      },
      "moreVideos": [
        {
          "title": "Using Place-Based Learning to Spark Inquiry",
          "channel": "Edutopia",
          "url": "https://www.edutopia.org/article/strategies-teaching-place-based-learning/"
        },
        {
          "title": "Oklahoma Indian Education Lesson Plans (OSDE)",
          "channel": "Oklahoma State Department of Education",
          "url": "https://oklahoma.gov/education/services/american-indian-education/indian-education-lesson-plans.html"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Simulations & civic action — from mock election to community change",
      "band": "K–5 · 1–2 simulations per year",
      "why": "Simulations and small civic-action projects make abstract civic knowledge stick — a class election in K, a mock town hall in grade 3, a service-learning campaign in grade 5. iCivics' game-based simulations show measurable civic knowledge gains, and the C3 arc explicitly ends in 'taking informed action.'",
      "moves": [
        "Grades K–2: run a real class vote (snack, book, class name). Model the ballot, the count, and the peaceful transition.",
        "Grades 3–4: mock town hall on a local issue — students take roles (mayor, business owner, resident, kid). Rules: cite evidence, no interrupting, one 30-second turn each.",
        "Grade 5: pick one iCivics simulation (Cast Your Vote, Do I Have A Right?, Court Quest) and pair it with a real civic-action task (letter to a state legislator, playground redesign proposal).",
        "Every simulation ends in a debrief: 'What did the role feel like? What surprised you? What would you do next?'"
      ],
      "evidence": "LeCompte et al. (2011, JSR): iCivics games produced significant gains in civic knowledge in randomized studies. NCSS C3 Dimension 4: Taking Informed Action. Oklahoma OAS Civics strand, K–5.",
      "video": {
        "title": "Sparking Civic Engagement by Building in Public Spaces",
        "channel": "Edutopia",
        "url": "https://www.edutopia.org/video/sparking-civic-engagement-building-public-spaces/"
      },
      "moreVideos": [
        {
          "title": "Back to School with iCivics",
          "channel": "iCivics",
          "url": "https://www.youtube.com/watch?v=GC8QnLRDQfM"
        },
        {
          "title": "Cast Your Vote — iCivics classroom-ready election simulation",
          "channel": "iCivics",
          "url": "https://ed.icivics.org/resources/game/2190/cast-your-vote"
        }
      ]
    }
  ],
  "lookFors": [
    "A compelling question is visible in the room, and students can say what they're trying to figure out this week.",
    "Every social studies lesson uses at least one primary source — a photo, map, artifact, or short document — and students are asked what they observe before they're told what it means.",
    "Student talk sounds like historians: 'Who made this?' 'When?' 'Do the sources agree?' — with sentence stems on the wall.",
    "Maps, timelines, and student work products are updated by students, not just posted by the teacher; at least one unit per year ends in informed action."
  ]
};

  var PE = {
  "slug": "early-pe",
  "title": "Early PE (K–5)",
  "lede": "Fundamental motor skills, health-related fitness, and responsible participation — taught with high activity time and clear cues. Every strategy below is aligned to Oklahoma's 2026 Academic Standards for Physical Education and SHAPE America's National Standards.",
  "guides": [
    {
      "label": "Oklahoma Standards",
      "title": "Oklahoma Academic Standards for Physical Education (2026)",
      "url": "https://oklahoma.gov/content/dam/ok/en/osde/documents/services/standards-learning/physical-education/2026%20OAS%20Physical%20Education.pdf"
    },
    {
      "label": "National Standards",
      "title": "SHAPE America National Physical Education Standards (2024)",
      "url": "https://shapeamerica.org/standards/pe/"
    },
    {
      "label": "CDC / HHS Guidance",
      "title": "Physical Activity Guidelines for Americans — Children & Adolescents",
      "url": "https://www.cdc.gov/physical-activity-education/guidelines/index.html"
    }
  ],
  "strategies": [
    {
      "libraryId": null,
      "title": "Locomotor skill development — the K–2 alphabet of movement",
      "band": "PK–2 · 10–15 min/lesson",
      "why": "Walking, jogging, hopping, skipping, galloping, side-sliding, and leaping are the alphabet of every game that comes later. OAS PE 2026 S1.E1.K asks children to practice these while maintaining balance; by S1.E1.2 they must show a mature pattern.",
      "moves": [
        "Introduce ONE locomotor pattern per lesson with a 2-cue demo (e.g., skip = 'step-hop, step-hop; arms swing opposite').",
        "Use scattered general-space practice — no lines, no waiting — so every child gets 30+ repetitions per skill.",
        "Add music, tempo changes, and pathways (straight, zigzag, curved — S2.E2.K) to keep the drill from feeling like a drill.",
        "Assess with a 30-second observation window per child against the 2–3 critical cues; reteach the pattern most students missed."
      ],
      "evidence": "Aligns with OAS PE 2026 S1.E1.K → S1.E1.2 (locomotor mature patterns) and SHAPE America Standard 1. Pangrazi's Dynamic Physical Education emphasizes short, distributed skill practice with maximum repetitions as the driver of fundamental-movement-skill (FMS) proficiency.",
      "video": {
        "title": "Get Your Kindergarteners Moving: PE Skills You NEED!",
        "channel": "Prime Coaching Sport",
        "url": "https://www.youtube.com/watch?v=ELegorB5270"
      },
      "moreVideos": [
        {
          "title": "Locomotor 'Roll & Go' w/ K–2",
          "channel": "PE4EVERYKID",
          "url": "https://www.youtube.com/watch?v=QXnJBVqDHCQ"
        },
        {
          "title": "The 7 Basic Locomotion Movements for Sport",
          "channel": "Prime Coaching Sport",
          "url": "https://www.youtube.com/watch?v=rCg-MkVkxyU"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Manipulative skills — critical elements + cue words",
      "band": "1–5 · 15–20 min/lesson",
      "why": "Throwing, catching, dribbling, kicking, and striking each have 3–5 critical elements. Teach the elements explicitly with short cue words and children reach a mature pattern years earlier than through incidental practice. OAS PE 2026 walks these from S1.E11 (rolling/throwing) through S1.E22 (implement skills).",
      "moves": [
        "Post 2–4 cue words per skill (Overhand throw: 'side, T, step, throw, follow'). Every demo names them; every peer coach uses them.",
        "Whole-part-whole: brief demo → isolated part practice (footwork alone, arm alone) → put it back together.",
        "Every child has an object; use walls, targets, and self-toss stations before partner work — no 'watch while I throw' lines.",
        "Progress non-dynamic → dynamic per OAS: stationary target (S1.E11.5a) → moving partner (S1.E12.5b) → small-sided game (S1.E12.5c)."
      ],
      "evidence": "Aligns with OAS PE 2026 S1.E11–S1.E22 and SHAPE America Standard 1 outcomes. Meta-analytic research on fundamental-movement-skill instruction (Logan et al., JTPE; Morgan et al., RQES) shows explicit cue-based teaching outperforms free play for FMS acquisition in K–5.",
      "video": {
        "title": "Overhand Throw Cues for PE and an Instant Activity Example",
        "channel": "The PE Specialist",
        "url": "https://www.youtube.com/watch?v=Nnosl8emm5E"
      },
      "moreVideos": [
        {
          "title": "Manipulative Skill: Catching — FMS Break Down",
          "channel": "Northern Sydney Local Health District",
          "url": "https://www.youtube.com/watch?v=lIhK8bpRaEg"
        },
        {
          "title": "Elementary PE — Overhand Throwing at Targets",
          "channel": "Round Hill PE",
          "url": "https://www.youtube.com/watch?v=ge2oJ4WKs3M"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Small-sided games — max activity, no elimination",
      "band": "K–5 · Core of every lesson",
      "why": "The child sitting on the wall in Dodgeball is the child who most needed the movement. Small-sided games (2v2, 3v3, everyone-in variants) keep every student in the action and produce the touches, decisions, and MVPA time that big-team games destroy.",
      "moves": [
        "Cap teams at 2–4; run 3–6 games at once so every child is 3 feet from the ball, not 30.",
        "Replace elimination with a 'reset' rule — tagged players do 5 jumping jacks and return, so no one loses activity time.",
        "Modify one variable at a time (space, players, rules, equipment — the STEP framework) to differentiate up or down.",
        "Debrief in 60 seconds: 'What worked? What will you try next round?' — this hits Standard 2 tactical thinking."
      ],
      "evidence": "Supports OAS PE 2026 S3.E2.K/2/5 (MVPA 50%+ of class time) and S1.E5.5b (traveling with manipulative skills in small-sided practice tasks). SHAPE America's 'Appropriate Instructional Practice Guidelines' explicitly identifies elimination games as inappropriate practice for K–5.",
      "video": {
        "title": "PE Games for ALL Skill Levels (no equipment needed!)",
        "channel": "Prime Coaching Sport",
        "url": "https://www.youtube.com/watch?v=nm8j8YRAn7U"
      },
      "moreVideos": [
        {
          "title": "9 P.E. Games For Elementary Classrooms (Low Prep!)",
          "channel": "The Time-Crunched Teacher",
          "url": "https://www.youtube.com/watch?v=66l6Npp9WtI"
        },
        {
          "title": "OPEN Curriculum Modules (free lesson plans)",
          "channel": "OPEN Physical Education",
          "url": "https://openphysed.org/curriculummodules"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Fitness education — MVPA time, not fitness testing",
      "band": "K–5 · Every lesson · Formal assessment 4–5",
      "why": "The CDC/HHS Physical Activity Guidelines call for 60 minutes of moderate-to-vigorous activity daily for youth. OAS PE 2026 S3.E2 puts PE on the hook for at least 50% of class time in MVPA. Fitness knowledge is built through participation, not push-up counts.",
      "moves": [
        "Design lessons so movement is the default: instant activity from the moment students enter (no roll call sit-and-wait).",
        "Teach body cues to K–2 (heart rate, breathing — S3.E3.K); introduce FITT to 4–5 (S3.E4.5).",
        "Use FitnessGram in grades 4–5 as a personal-progress tool, not a competition; publish class norms, not individual scores.",
        "Chart activity outside PE (S3.E1.5) with a weekly log; connect it to Standard 3 goals and PLE.PK-5.4 (personal relevance)."
      ],
      "evidence": "Aligns with OAS PE 2026 S3.E1–S3.E6 and the CDC/HHS Physical Activity Guidelines for Americans (2nd ed., 2018). SHAPE America position: fitness education, not fitness testing, is the K–5 focus; PACER and FitnessGram are Cooper Institute assessments used developmentally in grades 4–12.",
      "video": {
        "title": "Pacer Test Intro — Cardio Vascular Endurance Overview | Elementary PE",
        "channel": "The PE Specialist",
        "url": "https://www.youtube.com/watch?v=wtQKBYzTrvg"
      },
      "moreVideos": [
        {
          "title": "Tips for Giving the Pacer Test — Teaching Intro",
          "channel": "The PE Specialist",
          "url": "https://www.youtube.com/watch?v=ZPTIdDRVFXI"
        },
        {
          "title": "Physical Activity Guidelines for Americans, 2nd Edition (HHS PDF)",
          "channel": "U.S. Department of Health & Human Services",
          "url": "https://www.cdc.gov/physical-activity/media/pdfs/Physical_Activity_Guidelines_2nd_edition.pdf"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Cooperative games & TPSR — teaching responsibility on purpose",
      "band": "K–5 · Woven through every unit",
      "why": "Hellison's Teaching Personal and Social Responsibility (TPSR) model gives K–5 students a ladder they can name: respect → participation → self-direction → helping others → transfer. It turns the affective standard from a slogan into a taught skill.",
      "moves": [
        "Post the five TPSR levels; open each class with a 60-second 'Level check' — students self-rate on a fist-to-five.",
        "Use cooperative challenges (no-losers) that require every voice — 'Group Juggle,' 'All Aboard,' 'Human Knot' — before any competition.",
        "Assign rotating roles (coach, referee, equipment manager) so leadership is taught, not left to the loudest child.",
        "Close with a 60-second reflection tied to S4.E1/E2/E4 and PLE.PK-5.2: 'Where did you show responsibility today?'"
      ],
      "evidence": "Aligns with OAS PE 2026 Standard 4 (S4.E1–S4.E6) and PLE.PK-5.2. Hellison's TPSR model has 30+ years of peer-reviewed support; recent meta-analyses (e.g., Pozo, Grao-Cruces & Pérez-Ordás, 2018, European Physical Education Review) show positive effects on prosocial behavior, self-regulation, and engagement.",
      "video": {
        "title": "7 Team Building and Cooperative Games — Physical Education",
        "channel": "Jakob Gyring",
        "url": "https://www.youtube.com/watch?v=o7vjMQUgNmQ"
      },
      "moreVideos": [
        {
          "title": "Cooperative Games For Elementary PE",
          "channel": "PLT4M",
          "url": "https://www.youtube.com/watch?v=i8Ng8UDGlCo"
        },
        {
          "title": "TPSR — Levels of Responsibility (Hellison model, explained)",
          "channel": "The Physical Educator",
          "url": "https://www.thephysicaleducator.com/blog/tpsr-levels-of-responsibility"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Movement concepts — space, effort, relationships, tactics",
      "band": "K–5 · 5–10 min woven per lesson",
      "why": "Movement concepts (space, effort, relationships) are the vocabulary students use to think about their own movement. Without them, a child can perform a skill but cannot adjust it. With them, kindergartners talk about 'general space' and fifth graders talk about 'open space' in a small-sided game.",
      "moves": [
        "Teach the vocabulary explicitly: self-space vs. general space; low/middle/high; slow/medium/fast; straight/zigzag/curved (S2.E1–S2.E3).",
        "Constrain-to-teach: 'Dribble only in curved pathways.' 'Pass only into open space.' The concept has to be USED, not just named.",
        "For grades 3–5, add tactical questions — 'How do you create space?' 'How do you close it down?' (S2.E1.5, S2.E5).",
        "Use a Word Wall of Movement in the gym; refer to it in every debrief."
      ],
      "evidence": "Aligns with OAS PE 2026 Standard 2 (S2.E1–S2.E5) and SHAPE America Standard 2. Rooted in the Laban movement framework and the Teaching Games for Understanding (TGfU) tactical approach; both are foundational to modern elementary PE curriculum design (Pangrazi; Graham, Holt/Hale & Parker, 'Children Moving').",
      "video": {
        "title": "Teaching Elementary PE Movement Concepts",
        "channel": "GVSU HPE",
        "url": "https://www.youtube.com/watch?v=XLK8vmatFys"
      },
      "moreVideos": [
        {
          "title": "Pathways, Levels, and Directions — PE at Home",
          "channel": "Leslee Mendez",
          "url": "https://www.youtube.com/watch?v=h_JHIVK7pgg"
        },
        {
          "title": "The 5 SHAPE America National Physical Education Standards",
          "channel": "SHAPE America",
          "url": "https://www.youtube.com/watch?v=3AD8yoT_2QA"
        }
      ]
    }
  ],
  "lookFors": [
    "Every child is moving — at least 50% of class time is spent in moderate-to-vigorous activity, and no student is eliminated or waiting in a long line.",
    "2–4 skill cues are posted and named on every demo; peer feedback uses the same words.",
    "Small-sided games (2v2, 3v3) — not full-class Kickball — are the default game format, so every child gets touches and decisions.",
    "Standard 4 is taught, not assumed: TPSR levels, class norms, or role cards are visible, and the teacher closes with a reflection tied to responsibility or personal relevance (PLE.PK-5.2, PLE.PK-5.4)."
  ]
};

  var FEEDBACK = {
  "slug": "feedback",
  "title": "Teacher–Student Feedback",
  "lede": "Feedback is one of the highest-leverage moves in the research — Hattie reports an average effect of d ≈ 0.70 across studies, and Hattie & Timperley (2007) put it near d ≈ 0.79 when it is done well. The strategies below turn that finding into six teacher-facing routines that work from kindergarten through senior English.",
  "guides": [
    {
      "label": "Foundational paper",
      "title": "Hattie & Timperley (2007) — The Power of Feedback (Review of Educational Research)",
      "url": "https://conselhopedagogico.tecnico.ulisboa.pt/files/sites/32/hattie-and-timperley-2007.pdf"
    },
    {
      "label": "Meta-analysis",
      "title": "Shute (2008) — Focus on Formative Feedback (Review of Educational Research 78:1)",
      "url": "https://journals.sagepub.com/doi/10.3102/0034654307313795"
    },
    {
      "label": "ASCD book",
      "title": "Brookhart — How to Give Effective Feedback to Your Students (2nd ed.)",
      "url": "https://www.ascd.org/books/how-to-give-effective-feedback-to-your-students-2nd-edition?variant=116066"
    }
  ],
  "strategies": [
    {
      "libraryId": null,
      "title": "Answer the three feedback questions",
      "band": "K–12 · Every task, every conference",
      "why": "Hattie & Timperley argue effective feedback answers three questions for the learner: Where am I going? How am I going? Where to next? When any one is missing, feedback degrades into praise or grading. Their synthesis put the average effect of well-formed feedback at d ≈ 0.79.",
      "moves": [
        "Post the success criteria in student-facing language before work begins — 'Where am I going?' is answered by the criteria, not by you.",
        "When you respond to work, name one criterion the student is meeting and one that is not yet met — that answers 'How am I going?'",
        "Close every feedback move with a next step the student can act on in the next 10 minutes — that is 'Where to next?'",
        "Audit your own comments once a week: highlight each in three colors — goal, current state, next step. Add whatever color is missing."
      ],
      "evidence": "Hattie & Timperley (2007), Review of Educational Research — average feedback effect d = 0.79; the three questions frame the paper. Hattie, Visible Learning: feedback d = 0.70 across 12 meta-analyses.",
      "video": {
        "title": "The Power of Feedback: John Hattie",
        "channel": "Digitally Enhanced Education Webinars",
        "url": "https://www.youtube.com/watch?v=HbHt1OecP0U"
      },
      "moreVideos": [
        {
          "title": "John Hattie on Visible Learning and Feedback in the Classroom",
          "channel": "Taylor & Francis Books",
          "url": "https://www.youtube.com/watch?v=Vpq09eY4pZo"
        },
        {
          "title": "Hattie & Timperley (2007) — The Power of Feedback (PDF)",
          "channel": "Review of Educational Research",
          "url": "https://conselhopedagogico.tecnico.ulisboa.pt/files/sites/32/hattie-and-timperley-2007.pdf"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Feed the task, the process, and self-regulation — not the self",
      "band": "K–12 · During work time",
      "why": "Hattie & Timperley distinguish four levels of feedback: task (FT), process (FP), self-regulation (FR), and self (FS). Task, process, and self-regulation feedback move learning; personal praise ('good job', 'you're so smart') does not — and Kluger & DeNisi found roughly one-third of feedback interventions actually depressed performance, most often when they shifted attention to the self.",
      "moves": [
        "Task-level: name what is correct or incorrect against the criteria ('Your claim is clear; two of three pieces of evidence don't yet support it').",
        "Process-level: comment on the strategy, not the answer ('When you got stuck, you reread — try annotating the confusing paragraph next').",
        "Self-regulation: hand the monitoring back ('Check your work against criterion 3 and mark the one line that needs the most revision').",
        "Cut personal praise from written feedback. Save warmth for relationship, not for evaluating the person."
      ],
      "evidence": "Hattie & Timperley (2007) — four levels FT/FP/FR/FS. Kluger & DeNisi (1996), Psychological Bulletin: mean feedback d = 0.41; over one-third of interventions decreased performance, most often when feedback drew attention to the self.",
      "video": {
        "title": "Descriptive Feedback — A Deeper Dive",
        "channel": "Edmonton Regional Learning Consortium (ERLC)",
        "url": "https://www.youtube.com/watch?v=QjxUEdoaOGQ"
      },
      "moreVideos": [
        {
          "title": "Kluger & DeNisi (1996) — The Effects of Feedback Interventions on Performance",
          "channel": "APA PsycNet",
          "url": "https://psycnet.apa.org/record/1996-02773-003"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Rubric-referenced, descriptive feedback",
      "band": "Grades 2–12 · Any product task",
      "why": "Sadler argued students can only close the gap if they can see the standard, judge current work against it, and know what to do. Wiliam calls this 'descriptive feedback' — comments students can act on, tied to explicit criteria rather than a grade. Shute's synthesis is consistent: specific, criterion-referenced feedback beats normative or evaluative feedback.",
      "moves": [
        "Give the rubric to students before the task — and rehearse it on an anonymous sample so 'proficient' means the same thing to every student.",
        "Comment against the rubric row, not in the margin at random — 'Row 2 — Evidence: 3/5. Two quotes are relevant but not explained.'",
        "Use two-column feedback: What I see (evidence from your work) | What to try (specific action).",
        "Delay the grade. Return the work with feedback only; require a revision before the score is posted."
      ],
      "evidence": "Sadler (1989), Instructional Science — formative assessment and design of instructional systems. Shute (2008), Review of Educational Research 78(1): specific, task-focused, timely feedback is the strongest formative move. Wiliam (2011/2018), Embedded Formative Assessment.",
      "video": {
        "title": "Helping Students Look Beyond Grades With Visual Rubrics",
        "channel": "Edutopia",
        "url": "https://www.edutopia.org/video/helping-students-look-beyond-grades-with-visual-rubrics/"
      },
      "moreVideos": [
        {
          "title": "EduTip 4: Hold off on most feedback until AFTER a task is done",
          "channel": "Cult of Pedagogy",
          "url": "https://www.youtube.com/watch?v=UTUT-XX-Ih4"
        },
        {
          "title": "Delaying the Grade: How to Get Students to Read Feedback",
          "channel": "Cult of Pedagogy",
          "url": "https://www.cultofpedagogy.com/delayed-grade/"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Timely, specific written feedback students actually use",
      "band": "Grades 3–12 · After a graded task",
      "why": "Shute's Focus on Formative Feedback synthesizes decades of research: feedback works when it is specific, task-focused, timely, and moderate in length — not when it is vague, evaluative, or arrives after students have moved on. Written feedback that never gets acted on is a workload sink with no achievement return.",
      "moves": [
        "Choose 2–3 focused comments per paper aligned to the current learning targets — not a red-pen sweep.",
        "Comment in the second person and imperative mood: 'Combine these two sentences to show cause.' Not 'awkward.'",
        "Return work within one class cycle. Feedback more than a week old competes with new instruction and rarely gets read.",
        "Build a 15-minute 'act on feedback' block into the next lesson: students revise or reattempt using the comments before anything new is added."
      ],
      "evidence": "Shute (2008), Review of Educational Research 78(1) — Focus on Formative Feedback (guidelines: specific, timely, actionable). Brookhart (2017), ASCD — How to Give Effective Feedback to Your Students.",
      "video": {
        "title": "87: Moving from Feedback to Feedforward",
        "channel": "Cult of Pedagogy",
        "url": "https://www.youtube.com/watch?v=LkoPALs5ioQ"
      },
      "moreVideos": [
        {
          "title": "Shute (2008) — Focus on Formative Feedback",
          "channel": "Review of Educational Research",
          "url": "https://journals.sagepub.com/doi/10.3102/0034654307313795"
        },
        {
          "title": "How to Give Effective Feedback to Your Students (sample chapters)",
          "channel": "ASCD",
          "url": "https://files.ascd.org/staticfiles/ascd/pdf/siteASCD/publications/books/How-to-Give-Effective-Feedback-to-Your-Students-2nd-Edition-sample-chapters.pdf"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "In-the-moment verbal feedback: the 3–5 minute conference",
      "band": "K–12 · During independent work",
      "why": "Wiliam's Embedded Formative Assessment argues the most powerful feedback is verbal, short, and delivered while the work is still moving. A quick conference — research the student, decide what to teach, teach one thing, ask them to try it — outperforms marginal comments returned days later.",
      "moves": [
        "Circulate with a clipboard and a class list; conference with 4–6 students per block, not all of them.",
        "Open with a 'research' question: 'Talk me through what you're doing here.' Listen for 30 seconds before you teach.",
        "Teach one thing. Model it in their work, then hand the pencil back and watch them try it.",
        "Log a two-word note per conference (student, what you taught) so the next conference builds instead of repeating."
      ],
      "evidence": "Wiliam (2011/2018), Embedded Formative Assessment — five key strategies of formative assessment. Black & Wiliam (1998), Inside the Black Box — formative assessment interventions produce effect sizes in the 0.4–0.7 range. Calkins' writing conference architecture (research → decide → teach) is the K–5 template.",
      "video": {
        "title": "Dylan Wiliam: Feedback on learning",
        "channel": "Education Scotland",
        "url": "https://www.youtube.com/watch?v=n7Ox5aoZ4ww"
      },
      "moreVideos": [
        {
          "title": "How do I have a writing conference?",
          "channel": "Amanda Werner",
          "url": "https://www.youtube.com/watch?v=UnSFGEp35ag"
        },
        {
          "title": "An introduction to formative assessment",
          "channel": "Dylan Wiliam",
          "url": "https://www.youtube.com/watch?v=zZL6Zf5lMVw"
        }
      ]
    },
    {
      "libraryId": null,
      "title": "Peer & self critique — done under a protocol",
      "band": "Grades 2–12 · Draft-and-revise cycles",
      "why": "Peer feedback usually fails because students are polite and vague. Under a structured protocol — Berger's kind/specific/helpful rules, Austin's Butterfly critique, TAG, or Two Stars and a Wish — peer and self-assessment become one of the strongest formative moves in the classroom. Berger's first-graders lifted a scientific illustration through six drafts of peer critique against a model.",
      "moves": [
        "Set Berger's three rules on the wall and enforce them every time: feedback must be Kind, Specific, and Helpful.",
        "Always critique against a model of excellence and the criteria — never against opinion.",
        "Use a fixed structure. Elementary: TAG (Tell something you like · Ask a question · Give a suggestion) or Two Stars and a Wish. Secondary: 'I noticed… I wondered… Have you considered…' with a rubric row named.",
        "Require action: students revise using at least two pieces of peer feedback and highlight the change. No revision, no credit for the critique."
      ],
      "evidence": "Berger, An Ethic of Excellence (2003) and the EL Education 'Austin's Butterfly' case study. Hattie & Timperley (2007) — self-regulation-level feedback among the most powerful. Black & Wiliam (1998) — peer/self assessment central to formative assessment gains.",
      "video": {
        "title": "Austin's Butterfly: Models, Critique, and Descriptive Feedback",
        "channel": "EL Education",
        "url": "https://www.youtube.com/watch?v=E_6PskE3zfQ"
      },
      "moreVideos": [
        {
          "title": "Ron Berger — Rules For Critique",
          "channel": "High Tech High Unboxed",
          "url": "https://www.youtube.com/watch?v=cWMH_X4IvOk"
        },
        {
          "title": "60-Second Strategy: TAG Feedback",
          "channel": "Edutopia",
          "url": "https://www.edutopia.org/video/60-second-strategy-tag-feedback/"
        }
      ]
    }
  ],
  "lookFors": [
    "Students can tell an observer, in their own words, what they are trying to learn, how their current work stacks up, and what their next step is.",
    "Comments — verbal or written — name a criterion and a next action, and are almost never personal praise ('good job', 'smart') or bare grades.",
    "The teacher is conferencing with individuals or small groups during work time, with a visible log or clipboard system, rather than marking at the desk.",
    "Peer or self critique is happening under a named protocol (rubric row, TAG, Two Stars and a Wish, Berger's kind/specific/helpful) and students are visibly revising in response."
  ]
};

  var PAGES = {
    "early-reading": READING,
    "early-math": MATH,
    "early-writing": WRITING,
    "early-science": SCIENCE,
    "early-social-studies": SOCIAL_STUDIES,
    "early-pe": PE,
    "feedback": FEEDBACK,
  };

  // -----------------------------------------------------------------
  //  RENDERERS
  // -----------------------------------------------------------------

  function hubBanner() {
    var banner = el("div", { class: "hub-banner" }, []);
    banner.innerHTML =
      '<strong>Elementary Foundations.</strong> Evidence-based K\u20133 practices with companion videos from IES, Reading Rockets, Edutopia, Inside Mathematics, and Teaching Channel. Every strategy is anchored in an IES Practice Guide or WWC Intervention Report.';
    return banner;
  }

  function guideRow(guides) {
    var wrap = el("div", { class: "guide-row" }, []);
    guides.forEach(function (g) {
      var card = el("a", {
        class: "guide-card",
        href: g.url, target: "_blank", rel: "noopener",
      }, [
        el("div", { class: "guide-label" }, g.label),
        el("div", { class: "guide-title" }, g.title),
        el("div", { class: "guide-cta" }, "Open source \u2197"),
      ]);
      wrap.appendChild(card);
    });
    return wrap;
  }

  // Uses the same videoBlock signature as app.js: {title, url, channel}
  // For non-YouTube URLs videoBlock falls back to a source-linked card.
  function videoBlockLocal(video, label) {
    // Prefer the app-wide videoBlock if exposed; otherwise render a fallback here.
    if (window.QPD_VIDEOBLOCK) return window.QPD_VIDEOBLOCK(video, label);
    // Minimal inline fallback
    var id = ytId(video.url);
    var text = el("div", { class: "video-text" }, [
      el("div", { class: "video-meta" }, label || "See it in practice"),
      el("div", { class: "video-title" }, video.title),
      video.channel ? el("div", { class: "video-channel" }, video.channel) : null,
    ]);
    if (!id) {
      var icon = el("div", { class: "video-icon" }, []);
      icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      return el("div", { class: "video-block" }, [
        icon,
        el("div", {}, [
          el("div", { class: "video-meta" }, label || "See it in practice"),
          el("a", { class: "video-title-link", href: video.url, target: "_blank", rel: "noopener" }, video.title),
          video.channel ? el("div", { class: "video-channel" }, video.channel) : null,
        ]),
      ]);
    }
    var img = el("img", { class: "video-poster", src: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg", alt: video.title, loading: "lazy" });
    var play = el("span", { class: "video-play", "aria-hidden": "true" });
    play.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    var thumb = el("button", { class: "video-thumb", type: "button", "aria-label": "Play video: " + video.title }, [img, play]);
    var frame = el("div", { class: "video-frame" }, [thumb]);
    thumb.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1";
      iframe.title = video.title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "");
      iframe.className = "video-iframe";
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
    var links = el("div", { class: "video-links" }, [
      el("a", { class: "btn btn-small btn-secondary", href: video.url, target: "_blank", rel: "noopener" }, "Watch on source \u2197"),
    ]);
    return el("div", { class: "video-block video-block-embed" }, [text, frame, links]);
  }

  function ytId(u) {
    if (!u) return null;
    var m = String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_\-]{11})/);
    return m ? m[1] : null;
  }

  function moreVideoLinks(list) {
    if (!list || !list.length) return null;
    var wrap = el("div", { class: "more-video-list" }, [
      el("div", { class: "resource-heading" }, "More classroom videos"),
    ]);
    var ul = el("ul", { class: "resource-list" }, []);
    list.forEach(function (v) {
      ul.appendChild(el("li", {}, [
        el("a", { href: v.url, target: "_blank", rel: "noopener" }, v.title),
        v.channel ? el("span", { class: "res-meta" }, " \u00b7 " + v.channel) : null,
      ]));
    });
    wrap.appendChild(ul);
    return wrap;
  }

  function strategyCard(s) {
    var card = el("div", { class: "card strategy-card" }, [
      el("div", { class: "strategy-band" }, s.band),
      el("h3", { class: "card-title" }, s.title),
      el("p", { class: "card-desc" }, s.why),
      el("div", { class: "resource-heading" }, "Teacher moves"),
      el("ul", { class: "check-list" }, s.moves.map(function (m) { return el("li", {}, m); })),
      el("div", { class: "evidence-block" }, [
        el("div", { class: "evidence-label" }, "Evidence"),
        el("div", { class: "evidence-body" }, s.evidence),
      ]),
      videoBlockLocal(s.video, "See it in practice"),
    ]);
    var more = moreVideoLinks(s.moreVideos);
    if (more) card.appendChild(more);
    if (s.libraryId) {
      card.appendChild(el("a", {
        class: "strategy-open-link",
        href: "#/strategy/" + s.libraryId,
        "aria-label": "Open \u201c" + s.title + "\u201d in the Strategy Library",
      }, "Open full strategy page in the Library \u2192"));
    }
    return card;
  }

  function renderDomainPage(slug) {
    var d = PAGES[slug];
    var frag = document.createDocumentFragment();
    
    frag.appendChild(el("h1", { class: "page-title" }, d.title));
    frag.appendChild(el("p", { class: "page-lede" }, d.lede));

    frag.appendChild(el("h2", { class: "section-title" }, "The evidence base"));
    frag.appendChild(guideRow(d.guides));

    frag.appendChild(el("h2", { class: "section-title" }, "Core strategies"));
    d.strategies.forEach(function (s) { frag.appendChild(strategyCard(s)); });

    frag.appendChild(el("h2", { class: "section-title" }, "What to look for in the room"));
    var lfCard = el("div", { class: "card" }, [
      el("ul", { class: "check-list" }, d.lookFors.map(function (t) { return el("li", {}, t); })),
    ]);
    frag.appendChild(lfCard);
    return frag;
  }

  function renderHub() {
    var frag = document.createDocumentFragment();
    
    frag.appendChild(el("h1", { class: "page-title" }, "Elementary Foundations"));
    frag.appendChild(el("p", { class: "page-lede" },
      "Teach reading, math, writing, science, social studies, and PE early \u2014 the way the evidence says works. Six domain pages, six or more strategies each, every one paired with a verified classroom video from IES, Reading Rockets, Edutopia, Inside Mathematics, STEM Teaching Tools, Ambitious Science Teaching, Library of Congress, iCivics, SHAPE America, OPEN PhysEd, and other trusted sources."));

    var grid = el("div", { class: "hub-grid" }, [
      hubCard("early-reading",        "Early Reading",        "Phonemic awareness \u2192 phonics \u2192 fluency \u2192 vocabulary \u2192 comprehension. Rooted in the IES K\u20133 Foundational Skills Practice Guide."),
      hubCard("early-math",           "Early Math",           "Number sense first. Number talks, subitizing, CRA, CGI, and math discourse. Rooted in the IES Teaching Math to Young Children guide."),
      hubCard("early-writing",        "Early Writing",        "Write daily. Handwriting, encoding, shared writing, and SRSD. Rooted in the IES Effective Writers guide."),
      hubCard("early-science",        "Early Science",        "Anchor in a phenomenon. Science discourse, notebooks, CER, hands-on investigation, and science text. Rooted in the NRC Framework and NGSS."),
      hubCard("early-social-studies", "Early Social Studies", "Compelling questions, primary sources, historical thinking, discussion, geography, and civic action. Rooted in the C3 Framework and Oklahoma Academic Standards."),
      hubCard("early-pe",             "Early PE",             "Locomotor and manipulative skills, small-sided games, MVPA fitness, TPSR, and movement concepts. Aligned to the 2026 Oklahoma Academic Standards for PE and SHAPE America."),
    ]);
    frag.appendChild(grid);
    return frag;
  }

  function hubCard(slug, title, desc) {
    return el("a", { class: "hub-card", href: "#/" + slug }, [
      el("div", { class: "hub-card-title" }, title),
      el("div", { class: "hub-card-desc" }, desc),
      el("div", { class: "hub-card-cta" }, "Open \u2197"),
    ]);
  }

  window.Elementary = {
    renderHub: renderHub,
    renderReading:       function () { return renderDomainPage("early-reading"); },
    renderMath:          function () { return renderDomainPage("early-math");    },
    renderWriting:       function () { return renderDomainPage("early-writing"); },
    renderScience:       function () { return renderDomainPage("early-science"); },
    renderSocialStudies: function () { return renderDomainPage("early-social-studies"); },
    renderPE:            function () { return renderDomainPage("early-pe"); },
    renderFeedback:      function () { return renderDomainPage("feedback"); },
  };
})();
