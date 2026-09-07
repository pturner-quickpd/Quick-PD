/**
 * Elementary Foundations — K–5 Reading, Math, Writing, Science, and Social Studies
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

  var PAGES = {
    "early-reading": READING,
    "early-math": MATH,
    "early-writing": WRITING,
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
      "Teach reading, math, writing, science, and social studies early—the way the evidence says works. Five focused domain pages put high-leverage practices, classroom moves, and credible sources in one place."));

    var grid = el("div", { class: "hub-grid" }, [
      hubCard("early-reading", "Early Reading", "Phonemic awareness \u2192 phonics \u2192 fluency \u2192 vocabulary \u2192 comprehension. Rooted in the IES K\u20133 Foundational Skills Practice Guide."),
      hubCard("early-math",    "Early Math",    "Number sense first. Number talks, subitizing, CRA, CGI, and math discourse. Rooted in the IES Teaching Math to Young Children guide."),
      hubCard("early-writing", "Early Writing", "Write daily. Handwriting, encoding, shared writing, and SRSD. Rooted in the IES Effective Writers guide."),
      hubCard("early-science", "Elementary Science", "Phenomena, investigation, models, science notebooks, and evidence-based explanations."),
      hubCard("early-social-studies", "Elementary Social Studies", "Compelling questions, primary sources, maps, multiple perspectives, and civic action."),
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
    renderReading: function () { return renderDomainPage("early-reading"); },
    renderMath:    function () { return renderDomainPage("early-math");    },
    renderWriting: function () { return renderDomainPage("early-writing"); },
  };
})();
