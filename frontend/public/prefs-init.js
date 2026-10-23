/*
 * Loaded in <head> before the first paint: copies the saved sidebar and accent
 * choices onto <html>, so the page never flashes the wrong ones.
 *
 * Plain on purpose: no build step, no values from the app. The storage keys
 * mirror SIDEBAR_KEY and ACCENT_KEY; an unknown accent matches no CSS rule
 * and simply shows the default.
 */
(function () {
  try {
    var root = document.documentElement;
    if (localStorage.getItem("sidebar") === "collapsed") {
      root.dataset.sidebar = "collapsed";
    }
    var accent = localStorage.getItem("accent");
    if (accent) root.dataset.accent = accent;
  } catch (e) {
    // Storage blocked: the defaults apply.
  }
})();
