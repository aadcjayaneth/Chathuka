(function () {
  var pages = ["home", "about", "skills", "talents", "contact"];
  var names = { home: "Home", about: "About", skills: "Skills", talents: "Talents", contact: "Contact" };
  var cur = null, busy = false;
  var curtain = document.getElementById("curtain");
  var cname = document.getElementById("cname");
  var links = [].slice.call(document.querySelectorAll("nav a"));
  var pill = document.getElementById("pill");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // which page does the URL (#about, #skills...) ask for?
  function route() {
    var h = location.hash.slice(1);
    return pages.indexOf(h) > -1 ? h : "home";
  }

  // slide the highlight pill under the active menu link
  function movePill(id) {
    var a = links[pages.indexOf(id)];
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = "translateX(" + a.offsetLeft + "px)";
    links.forEach(function (l) { l.classList.toggle("on", l === a); });
    a.scrollIntoView({ block: "nearest", inline: "center" });
  }

  // show one page, hide the other
  function swap(id) {
    if (cur) document.getElementById(cur).classList.remove("on");
    document.getElementById(id).classList.add("on");
    cur = id;
    window.scrollTo(0, 0);
    document.title = names[id] + " – Your Name";
  }

  // change page with the curtain animation
  function go() {
    var id = route();
    if (id === cur || busy) return;

    if (!cur || reduce) { swap(id); movePill(id); return; }

    busy = true;
    cname.textContent = names[id];
    movePill(id);
    curtain.className = "cover";             // curtain rises and covers the screen

    setTimeout(function () {
      swap(id);                               // change page while hidden
      curtain.className = "leave";            // curtain lifts away

      setTimeout(function () {
        curtain.style.transition = "none";    // reset curtain below the screen
        curtain.className = "";
        void curtain.offsetWidth;
        curtain.style.transition = "";
        busy = false;
        if (route() !== cur) go();            // user clicked again during animation
      }, 620);
    }, 780);
  }

  window.addEventListener("hashchange", go);
  window.addEventListener("resize", function () { if (cur) movePill(cur); });
  if (document.fonts) document.fonts.ready.then(function () { if (cur) movePill(cur); });
  go();

  // light / dark toggle
  var root = document.documentElement;
  document.getElementById("theme").addEventListener("click", function () {
    var systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
    var now = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
    root.setAttribute("data-theme", now === "dark" ? "light" : "dark");
  });
})();
