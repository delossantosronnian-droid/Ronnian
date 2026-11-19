(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");

  function syncThemeLabel() {
    var dark = root.dataset.theme === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  syncThemeLabel();

  themeBtn.addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    syncThemeLabel();
  });

  /* ---------- Hero name: letters thicken on load, then follow the pointer ---------- */
  var name = document.getElementById("heroName");
  var letters = [];

  document.querySelectorAll(".name-line").forEach(function (line) {
    var text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    text.split("").forEach(function (c) {
      var span = document.createElement("span");
      if (c === " ") {
        span.className = "sp";
      } else {
        span.className = "ch";
        span.textContent = c;
        span.style.setProperty("--i", letters.length);
        letters.push(span);
      }
      line.appendChild(span);
    });
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { name.classList.add("in"); });
  });
  setTimeout(function () { name.classList.add("ready"); }, reduceMotion ? 0 : 1700);

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var BASE = 520, PEAK = 800, RADIUS = 240, ticking = false, px = 0, py = 0;

    function update() {
      ticking = false;
      for (var i = 0; i < letters.length; i++) {
        var r = letters[i].getBoundingClientRect();
        var dx = px - (r.left + r.width / 2);
        var dy = py - (r.top + r.height / 2);
        var t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS);
        letters[i].style.fontVariationSettings = '"wght" ' + Math.round(BASE + (PEAK - BASE) * t) + ', "wdth" 90';
      }
    }
    window.addEventListener("pointermove", function (e) {
      if (!name.classList.contains("ready")) return;
      px = e.clientX; py = e.clientY;
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    });
  }

  /* ---------- Moving rows: achievements and certificates ---------- */
  var marquees = document.querySelectorAll(".marquee");

  function build(m) {
    var track = m.querySelector(".track");
    track.querySelectorAll("[data-clone]").forEach(function (n) { n.remove(); });
    if (reduceMotion) return;
    var originals = Array.prototype.slice.call(track.children);
    var setW = track.scrollWidth;
    var k = Math.max(1, Math.ceil(m.clientWidth / Math.max(setW, 1)));
    function addCopies(list) {
      list.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        c.setAttribute("data-clone", "");
        c.querySelectorAll("a, button").forEach(function (x) { x.tabIndex = -1; });
        track.appendChild(c);
      });
    }
    for (var i = 1; i < k; i++) addCopies(originals);
    addCopies(Array.prototype.slice.call(track.children)); /* second half */
    var speed = parseFloat(m.dataset.speed) || 40;
    track.style.setProperty("--dur", (track.scrollWidth / 2 / speed).toFixed(1) + "s");
  }

  marquees.forEach(build);
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { marquees.forEach(build); }, 250);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { marquees.forEach(build); });
  }

  document.querySelectorAll(".pause").forEach(function (btn) {
    var m = btn.closest(".content").querySelector(".marquee");
    btn.addEventListener("click", function () {
      var on = m.classList.toggle("paused");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Resume motion" : "Pause motion";
    });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  var status = document.getElementById("copyStatus");
  var clearTimer;

  function say(msg) {
    status.textContent = msg;
    clearTimeout(clearTimer);
    clearTimer = setTimeout(function () { status.textContent = ""; }, 2500);
  }

  copyBtn.addEventListener("click", function () {
    var email = copyBtn.dataset.email;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(
        function () { say("Email copied"); },
        function () { say("Couldn’t copy. Select the address and copy it manually."); }
      );
    } else {
      say("Couldn’t copy. Select the address and copy it manually.");
    }
  });

  /* ---------- Highlight current section in the nav ---------- */
  var links = document.querySelectorAll(".nav a");
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          var a = map[entry.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
