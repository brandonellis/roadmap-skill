(function () {
  "use strict";
  var shell = document.querySelector(".roadmap-shell");
  if (!shell) return;
  var choices = [];

  function choose(controlSelector, panelSelector, attribute) {
    var control = shell.querySelector(controlSelector);
    var panels = Array.from(shell.querySelectorAll(panelSelector));
    if (!control || !panels.length) return;
    function select(value) {
      var selected = panels.find(function (panel) { return panel.getAttribute(attribute) === value; });
      if (!selected) return;
      control.value = value;
      panels.forEach(function (panel) { panel.hidden = panel !== selected; });
      return selected;
    }
    select(control.value);
    control.addEventListener("change", function () {
      var panel = select(control.value);
      if (!panel) return;
      try { history.pushState(null, "", "#" + panel.id); }
      catch (error) { location.hash = panel.id; }
    });
    choices.push({ panels: panels, attribute: attribute, select: select });
  }

  choose("[data-scope-select]", "[data-assessment-scope]", "data-assessment-scope");
  choose("[data-roadmap-format-select]", "[data-roadmap-format]", "data-roadmap-format");

  var search = shell.querySelector("[data-roadmap-search]");
  var theme = shell.querySelector("[data-roadmap-theme]");
  var clear = shell.querySelector("[data-roadmap-clear]");
  var items = Array.from(shell.querySelectorAll("[data-roadmap-item]")).filter(function (item) {
    return !item.closest('[data-view="history"]');
  });
  var allIds = new Set(items.map(function (item) { return item.getAttribute("data-roadmap-item"); }));

  function applyFilter() {
    var query = search ? search.value.trim().toLocaleLowerCase() : "";
    var throughline = theme ? theme.value : "";
    var matches = new Set();
    items.forEach(function (item) {
      var themes = (item.getAttribute("data-throughlines") || "").split(/\s+/);
      var text = (item.getAttribute("data-search-text") || "").toLocaleLowerCase();
      var hit = (!query || text.includes(query)) && (!throughline || themes.includes(throughline));
      item.hidden = !hit;
      if (hit) matches.add(item.getAttribute("data-roadmap-item"));
    });
    shell.querySelectorAll("[data-roadmap-count]").forEach(function (element) {
      element.textContent = "Showing " + matches.size + " of " + allIds.size + " themes";
    });
    shell.querySelectorAll("[data-roadmap-list]").forEach(function (list) {
      var empty = list.querySelector("[data-filter-empty]");
      if (empty) empty.hidden = !!list.querySelector("[data-roadmap-item]:not([hidden])");
    });
    if (clear) clear.disabled = !query && !throughline;
  }

  function clearFilter() {
    if (search) search.value = "";
    if (theme) theme.value = "";
    applyFilter();
  }
  if (search) search.addEventListener("input", applyFilter);
  if (theme) theme.addEventListener("change", applyFilter);
  if (clear) clear.addEventListener("click", clearFilter);
  applyFilter();

  function reveal(target) {
    if (!target) return;
    if (window.roadmapViews) window.roadmapViews.reveal(target);
    choices.forEach(function (choice) {
      var panel = choice.panels.find(function (candidate) { return candidate === target || candidate.contains(target); });
      if (panel) choice.select(panel.getAttribute(choice.attribute));
    });
    var item = target.closest("[data-roadmap-item]");
    if (item && item.hidden) clearFilter();
    var detail = target.closest("details");
    while (detail) {
      detail.open = true;
      detail = detail.parentElement ? detail.parentElement.closest("details") : null;
    }
  }

  function hashTarget() {
    try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch (error) { return null; }
  }
  reveal(hashTarget());
  shell.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    try { reveal(document.getElementById(decodeURIComponent(anchor.hash.slice(1)))); }
    catch (error) {}
  });
  window.addEventListener("hashchange", function () {
    var target = hashTarget();
    reveal(target);
    if (target) requestAnimationFrame(function () { target.scrollIntoView({ block: "start" }); });
  });

  var themeButton = shell.querySelector("[data-theme-toggle]");
  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    if (themeButton) {
      themeButton.textContent = dark ? "Light theme" : "Dark theme";
      themeButton.setAttribute("aria-pressed", String(dark));
    }
    shell.querySelectorAll(".rm-archive-frame").forEach(function (frame) {
      try { if (frame.contentDocument) frame.contentDocument.documentElement.dataset.theme = dark ? "dark" : "light"; }
      catch (error) {}
    });
  }
  if (themeButton) themeButton.addEventListener("click", function () { setTheme(document.documentElement.dataset.theme !== "dark"); });
  setTheme(document.documentElement.dataset.theme === "dark");

  function resizeFrame(frame) {
    try {
      var record = frame.closest("details");
      if (!record || !record.open || !frame.contentDocument || !frame.contentDocument.body) return;
      frame.style.height = "1px";
      frame.style.height = Math.max(600, frame.contentDocument.documentElement.scrollHeight, frame.contentDocument.body.scrollHeight) + 24 + "px";
    } catch (error) {}
  }
  shell.querySelectorAll(".rm-archive-frame").forEach(function (frame) {
    frame.addEventListener("load", function () {
      setTheme(document.documentElement.dataset.theme === "dark");
      try { if (frame.contentDocument) frame.contentDocument.fonts.ready.then(function () { resizeFrame(frame); }); }
      catch (error) {}
      resizeFrame(frame);
    });
    var record = frame.closest("details");
    if (record) record.addEventListener("toggle", function () { resizeFrame(frame); });
  });
  window.addEventListener("resize", function () { shell.querySelectorAll(".rm-archive-frame").forEach(resizeFrame); });

  var openBeforePrint = null;
  window.addEventListener("beforeprint", function () {
    if (openBeforePrint !== null) return;
    openBeforePrint = Array.from(shell.querySelectorAll("details[open]"));
    shell.querySelectorAll("details").forEach(function (detail) { detail.open = true; });
    shell.querySelectorAll(".rm-archive-frame").forEach(function (frame) {
      var record = frame.closest("details");
      if (!record || record.querySelector(".rm-print-archive")) return;
      try {
        if (!frame.contentDocument || !frame.contentDocument.body) return;
        var printable = document.createElement("div");
        printable.className = "rm-print-archive";
        printable.setAttribute("data-generated-print", "");
        printable.textContent = frame.contentDocument.body.innerText;
        record.appendChild(printable);
      } catch (error) {}
    });
  });
  window.addEventListener("afterprint", function () {
    if (openBeforePrint === null) return;
    shell.querySelectorAll("[data-generated-print]").forEach(function (element) { element.remove(); });
    shell.querySelectorAll("details").forEach(function (detail) { detail.open = openBeforePrint.includes(detail); });
    openBeforePrint = null;
  });
  shell.querySelectorAll("[data-enhance-control]").forEach(function (control) { control.hidden = false; });
  shell.querySelectorAll(".rm-plain-navigation").forEach(function (navigation) { navigation.hidden = true; });
})();
