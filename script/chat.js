(function () {
  "use strict";

  /* Free quick-answer chat: no server, no API key, no cost.
     To change an answer, edit the text below. To add a topic, copy one block. */

  var TOPICS = [
    {
      keys: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
      answer: "Hello! Pick a question below or type one about Ronnian’s education, skills, certificates, or contact details."
    },
    {
      keys: ["thanks", "thank you", "salamat"],
      answer: "You’re welcome! If you’d like to reach Ronnian directly, his email is delossantosronnian@gmail.com."
    },
    {
      keys: ["who", "about", "introduce", "yourself", "summary", "profile", "overview", "tell me"],
      answer: "Ronnian G. Delos Santos is an Information Technology student from Tumauini, Isabela. He has basic knowledge of computer hardware and software troubleshooting, works well with others, and is willing to learn more about AI and cybersecurity."
    },
    {
      keys: ["education", "school", "study", "studying", "college", "course", "degree", "bsit", "university", "graduate", "high school", "elementary"],
      answer: "Present: Bachelor of Science in Information Technology at HGBaquiran College.\nSecondary: Antagan National High School (2023).\nPrimary: Antagan 1st Elementary School (2017)."
    },
    {
      keys: ["skill", "skills", "good at", "abilities", "ability", "strengths", "strength", "troubleshoot", "troubleshooting", "hardware", "software", "teamwork", "communication", "time management", "computer"],
      answer: "Skills: good communication, time management, computer literate, hardware and software troubleshooting (basic knowledge), and teamwork and collaboration."
    },
    {
      keys: ["achievement", "achievements", "award", "awards", "honors", "honor", "ojt", "best", "recognition"],
      answer: "Achievements: graduated with honors (2023) and Best in OJT (2023)."
    },
    {
      keys: ["certificate", "certificates", "certification", "seminar", "seminars", "training", "event", "events", "convention", "it day", "committee", "organizing"],
      answer: "Certificates and events:\n• Introduction to AI Literacy and Responsible Use (Sept 15, 2026)\n• Regional ITE Convention 2026, Organizing Committee (July 20–22, 2026)\n• IT Day 2026 sessions: Prompt Engineering, Cybersecurity Awareness, Digital Transformation and AI, and System Development (April 10–11, 2026)\n• Regional ITE Convention 2025, Organizing Committee (March 26–28, 2025)"
    },
    {
      keys: ["ai", "artificial", "intelligence", "cybersecurity", "security", "prompt", "prompting", "learning"],
      answer: "Ronnian is willing to learn more about AI and cybersecurity. He completed Introduction to AI Literacy and Responsible Use, and attended IT Day 2026 sessions on Applied AI: Prompt Engineering and Cybersecurity Awareness."
    },
    {
      keys: ["internship", "intern", "hire", "hiring", "available", "availability", "open", "job", "work", "opportunity", "opportunities", "employment", "career"],
      answer: "Ronnian is open to internships and entry-level opportunities. The best way to reach him is by email at delossantosronnian@gmail.com."
    },
    {
      keys: ["contact", "email", "e-mail", "phone", "number", "call", "address", "reach", "location", "where", "live", "mobile", "message"],
      answer: "Email: delossantosronnian@gmail.com\nPhone: +63 926-733-0954\nAddress: Antagan 2nd, Tumauini, Isabela 3325, Philippines"
    }
  ];

  var FALLBACK = "I don’t have an answer for that yet. Try one of the questions below, or email Ronnian at delossantosronnian@gmail.com.";

  var fab = document.getElementById("chatFab");
  var panel = document.getElementById("chatPanel");
  var closeBtn = document.getElementById("chatClose");
  var log = document.getElementById("chatLog");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var tips = document.getElementById("chatTips");

  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function findAnswer(text) {
    var q = text.toLowerCase();
    var best = null, bestScore = 0;
    TOPICS.forEach(function (t) {
      var score = 0;
      t.keys.forEach(function (k) {
        if (new RegExp("(^|[^a-z])" + escapeRegex(k) + "($|[^a-z])").test(q)) score += k.indexOf(" ") > -1 ? 2 : 1;
      });
      if (score > bestScore) { best = t; bestScore = score; }
    });
    return best ? best.answer : FALLBACK;
  }

  function add(text, cls) {
    var el = document.createElement("div");
    el.className = "msg " + cls;
    el.textContent = text; /* textContent keeps visitor text from injecting HTML */
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function open() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (!log.children.length) {
      add("Hi! I can answer questions about Ronnian’s education, skills, certificates, and how to contact him.", "bot");
    }
    input.focus();
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    fab.focus();
  }

  function ask(question) {
    question = question.trim();
    if (!question) return;
    input.value = "";
    add(question, "me");
    add(findAnswer(question), "bot");
  }

  fab.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  tips.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") ask(e.target.textContent);
  });
})();
