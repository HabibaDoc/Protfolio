/* Dr. Habiba · Medical Portfolio — interactions */
(function () {
  "use strict";

  /* ── reveal on scroll ── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -50px 0px" });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  /* ── count-up stats ── */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counted = new WeakSet();
  function animateCount(el) {
    if (counted.has(el)) return;
    counted.add(el);
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var pad = el.getAttribute("data-pad") === "1";
    if (reduce) { el.textContent = format(target); return; }
    var dur = 1500, start = null;
    function format(v) {
      var s = v.toFixed(dec);
      if (pad && dec === 0 && v < 10) s = "0" + s;
      return s;
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) animateCount(e.target); });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ── nav: shadow on scroll + mobile toggle ── */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("open"); });
  });

  /* ── contact form → mailto ── */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = (form.elements.name.value || "").trim();
      var email = (form.elements.email.value || "").trim();
      var subject = (form.elements.subject.value || "Enquiry").trim();
      var message = (form.elements.message.value || "").trim();
      var body =
        message +
        "\n\n— " + name +
        (email ? "\n" + email : "");
      var href = "mailto:habibapriaum@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
      var sent = form.querySelector(".sent");
      if (sent) sent.classList.add("show");
    });
  }

  /* ── footer year ── */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
