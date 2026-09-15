/* Comportements partagés — Les Gones du Market'
   Chargé sur index.html et index-v2.html. Chaque bloc est protégé par une
   détection de présence des éléments, donc une page n'exécute que ce qui la concerne. */
(function () {
  "use strict";

  /* ── 1. Filtres de l'agenda (Toutes / À venir / Passés) ── */
  var filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
        var filter = this.dataset.filter;
        document.querySelectorAll(".event-row").forEach(function (row) {
          row.style.display = (filter === "all" || row.dataset.status === filter) ? "" : "none";
        });
        document.querySelectorAll(".ev-group-label").forEach(function (label) {
          label.style.display = (filter === "all" || label.dataset.group === filter) ? "" : "none";
        });
      });
    });
  }

  /* ── 2. Compte à rebours du prochain événement (index-v2 uniquement) ── */
  var cdDays = document.getElementById("cd-days");
  if (cdDays) {
    var target = new Date("2026-09-24T18:30:00"); // Apéro de rentrée
    var set = function (id, v) {
      var el = document.getElementById(id);
      if (el) el.textContent = String(v).padStart(2, "0");
    };
    var tick = function () {
      var diff = target - new Date();
      if (diff <= 0) return;
      set("cd-days", Math.floor(diff / 86400000));
      set("cd-hours", Math.floor((diff % 86400000) / 3600000));
      set("cd-min", Math.floor((diff % 3600000) / 60000));
      set("cd-sec", Math.floor((diff % 60000) / 1000));
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── 3. Feed LinkedIn (Curator.io) : chargé quand la section approche du viewport ── */
  var feedSection = document.querySelector(".linkedin-section, .linkedin");
  if (feedSection) {
    var feedLoaded = false;
    var loadCurator = function () {
      if (feedLoaded) return;
      feedLoaded = true;
      var i = document.createElement("script");
      i.async = 1;
      i.charset = "UTF-8";
      i.src = "https://cdn.curator.io/published/df2326c7-04a7-443d-9134-7cdfbb54d5d4.js";
      var e = document.getElementsByTagName("script")[0];
      e.parentNode.insertBefore(i, e);
    };
    if (!("IntersectionObserver" in window)) {
      loadCurator();
    } else {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadCurator(); io.disconnect(); }
      }, { rootMargin: "600px" });
      io.observe(feedSection);
    }
  }

  /* ── 4. Formulaire de candidature Tally ── */
  if (document.querySelector("iframe[data-tally-src]")) {
    var TALLY = "https://tally.so/widgets/embed.js";
    var applyTally = function () {
      if (typeof Tally !== "undefined") {
        Tally.loadEmbeds();
      } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function (e) {
          e.src = e.dataset.tallySrc;
        });
      }
    };
    if (typeof Tally !== "undefined") {
      applyTally();
    } else if (!document.querySelector('script[src="' + TALLY + '"]')) {
      var s = document.createElement("script");
      s.src = TALLY;
      s.onload = applyTally;
      s.onerror = applyTally;
      document.body.appendChild(s);
    }
  }
})();
